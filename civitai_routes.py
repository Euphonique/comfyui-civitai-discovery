"""HTTP routes registered on ComfyUI's PromptServer under /civitai_discovery/*."""

from __future__ import annotations

import json
import logging
import os
from pathlib import Path

import aiohttp
import folder_paths
from aiohttp import web
from server import PromptServer

from .civitai_client import (
    ALL_BROWSING_LEVELS,
    REACTIONS,
    CivitaiClient,
    CivitaiError,
    USER_AGENT,
    resolve_base_url,
)
from urllib.parse import urlparse

from . import downloads, local_models

PREFIX = "/civitai_discovery"

log = logging.getLogger("civitai_discovery")

CONFIG_PATH = Path(__file__).parent / "config.json"
# UI settings (dropdowns, filters, recent users) - separate from the key on purpose.
PREFS_PATH = Path(__file__).parent / "prefs.json"
PREFS_MAX_BYTES = 64 * 1024
# prompts sent to nodes (prompt history), separate because prompts can be long
HISTORY_PATH = Path(__file__).parent / "history.json"
HISTORY_MAX_BYTES = 2 * 1024 * 1024  # up to 300 entries with long prompts
ENV_KEY = "CIVITAI_API_KEY"


def _load_config() -> dict:
    try:
        return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def _save_config(cfg: dict) -> None:
    CONFIG_PATH.write_text(json.dumps(cfg, indent=2), encoding="utf-8")
    try:
        os.chmod(CONFIG_PATH, 0o600)
    except OSError:
        pass


def _write_atomic(path: Path, text: str) -> None:
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(text, encoding="utf-8")
    os.replace(tmp, path)


def _load_prefs() -> dict:
    try:
        data = json.loads(PREFS_PATH.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except (OSError, json.JSONDecodeError):
        return {}


def _api_key() -> str:
    return (_load_config().get("api_key") or os.environ.get(ENV_KEY) or "").strip()


def _mask(key: str) -> str:
    return f"{key[:4]}…{key[-4:]}" if len(key) > 10 else "••••"


def _err(e: Exception) -> web.Response:
    if isinstance(e, downloads.DownloadError):
        return web.json_response({"error": str(e)}, status=400)
    status = e.status if isinstance(e, CivitaiError) else 500
    if not isinstance(e, CivitaiError):
        log.exception("Civitai Discovery: unexpected error")
    return web.json_response({"error": str(e) or type(e).__name__}, status=status)


def _int(value, default: int = 0) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        raise CivitaiError("Invalid number.", 400)


def _client(request: web.Request, level: int | None = None) -> CivitaiClient:
    return CivitaiClient(_api_key(), resolve_base_url(request.query.get("domain"), level))


def _cursor(q):
    cursor = q.get("cursor") or None
    return int(cursor) if cursor and cursor.isdigit() else cursor


async def _json_body(request: web.Request) -> dict:
    try:
        body = await request.json()
    except Exception:
        raise CivitaiError("Invalid JSON.", 400)
    if not isinstance(body, dict):
        raise CivitaiError("Invalid JSON.", 400)
    return body


routes = PromptServer.instance.routes


# ------------------------------------------------------------------ config
@routes.get(f"{PREFIX}/config")
async def get_config(request: web.Request) -> web.Response:
    key = _api_key()
    from_env = bool(key) and not _load_config().get("api_key")
    return web.json_response(
        {"hasKey": bool(key), "masked": _mask(key) if key else None, "fromEnv": from_env}
    )


@routes.post(f"{PREFIX}/config")
async def set_config(request: web.Request) -> web.Response:
    try:
        body = await _json_body(request)
        key = (body.get("apiKey") or "").strip()
        cfg = _load_config()
        if key:
            await CivitaiClient(key).get_collections()  # validate before saving
            cfg["api_key"] = key
        else:
            cfg.pop("api_key", None)
        _save_config(cfg)
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return await get_config(request)


# ------------------------------------------------------------------- prefs
@routes.get(f"{PREFIX}/prefs")
async def get_prefs(request: web.Request) -> web.Response:
    return web.json_response(_load_prefs())


@routes.post(f"{PREFIX}/prefs")
async def set_prefs(request: web.Request) -> web.Response:
    """Replace the stored UI settings ({"discovery": {...}, "favorites": {...}})."""
    try:
        body = await _json_body(request)
        text = json.dumps(body, indent=2, ensure_ascii=False)
        if len(text.encode("utf-8")) > PREFS_MAX_BYTES:
            raise CivitaiError("Settings too large.", 413)
        if not all(isinstance(v, dict) for v in body.values()):
            raise CivitaiError("Invalid settings.", 400)
        _write_atomic(PREFS_PATH, text)
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response({"ok": True})


@routes.get(f"{PREFIX}/history")
async def get_history(request: web.Request) -> web.Response:
    try:
        data = json.loads(HISTORY_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        data = []
    return web.json_response({"items": data if isinstance(data, list) else []})


@routes.post(f"{PREFIX}/history")
async def set_history(request: web.Request) -> web.Response:
    try:
        body = await _json_body(request)
        items = body.get("items")
        if not isinstance(items, list) or not all(isinstance(i, dict) for i in items):
            raise CivitaiError("Invalid history.", 400)
        text = json.dumps(items, ensure_ascii=False)
        if len(text.encode("utf-8")) > HISTORY_MAX_BYTES:
            raise CivitaiError("History too large.", 413)
        _write_atomic(HISTORY_PATH, text)
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response({"ok": True})


# ------------------------------------------------------------------- reads
@routes.get(f"{PREFIX}/collections")
async def get_collections(request: web.Request) -> web.Response:
    try:
        collections = await _client(request).get_collections()
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response({"collections": collections, "reactions": list(REACTIONS)})


@routes.get(f"{PREFIX}/images")
async def get_images(request: web.Request) -> web.Response:
    """Favorites: images of a collection / reaction / user (tRPC, key required)."""
    q = request.query
    try:
        level = _int(q.get("browsingLevel", ALL_BROWSING_LEVELS), ALL_BROWSING_LEVELS)
        data = await _client(request, level).get_images(
            q.get("source", ""),
            cursor=_cursor(q),
            limit=_int(q.get("limit", 50), 50),
            browsing_level=level,
            sort=q.get("sort", "Newest"),
            period=q.get("period", "AllTime"),
            media_type=q.get("type") or None,
            base_models=[b for b in (q.get("baseModels") or "").split(",") if b.strip()] or None,
            tags=[_int(v) for v in (q.get("tags") or "").split(",") if v.strip()] or None,
        )
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response(data)


@routes.get(f"{PREFIX}/feed")
async def get_feed(request: web.Request) -> web.Response:
    """Discovery: the general image feed (public REST API; key used when set)."""
    q = request.query
    try:
        level = _int(q.get("browsingLevel", ALL_BROWSING_LEVELS), ALL_BROWSING_LEVELS)
        base_models = [b for b in (q.get("baseModels") or "").split(",") if b.strip()]
        data = await _client(request, level).get_feed(
            cursor=_cursor(q),
            limit=_int(q.get("limit", 50), 50),
            browsing_level=level,
            sort=q.get("sort", "Most Reactions"),
            period=q.get("period", "Week"),
            media_type=q.get("type") or None,
            base_models=base_models or None,
            username=q.get("username") or None,
            tags=[_int(v) for v in (q.get("tags") or "").split(",") if v.strip()] or None,
            model_version_id=_int(q.get("modelVersionId") or 0) or None,
        )
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response(data)


@routes.get(f"{PREFIX}/search")
async def semantic_search(request: web.Request) -> web.Response:
    """Text search (+ tags/base models/type/user) - only where Civitai enabled it."""
    q = request.query
    try:
        level = _int(q.get("browsingLevel", ALL_BROWSING_LEVELS), ALL_BROWSING_LEVELS)
        data = await _client(request, level).semantic_search(
            q.get("query", ""),
            cursor=_cursor(q),
            limit=_int(q.get("limit", 50), 50),
            browsing_level=level,
            sort="newest" if q.get("sort") == "Newest" else "relevance",
            media_type=q.get("type") or None,
            base_models=[b for b in (q.get("baseModels") or "").split(",") if b.strip()] or None,
            username=q.get("username") or None,
            tags=[_int(v) for v in (q.get("tags") or "").split(",") if v.strip()] or None,
        )
    except CivitaiError as e:
        if e.status in (401, 403):
            # not enabled for this account/key -> the UI falls back to filtering prompts
            return web.json_response({"error": str(e), "unavailable": True}, status=403)
        return _err(e)
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response(data)


# ------------------------------------------------------------ image -> node
IMAGE_HOSTS = {"image.civitai.com"}
IMAGE_TYPES = {"image/jpeg": ".jpeg", "image/png": ".png", "image/webp": ".webp"}
IMAGE_MAX_BYTES = 60 * 1024 * 1024


@routes.post(f"{PREFIX}/image_to_input")
async def image_to_input(request: web.Request) -> web.Response:
    """Download a Civitai image into ComfyUI's input folder (for Load Image nodes)."""
    try:
        body = await _json_body(request)
        url = str(body.get("url") or "")
        image_id = _int(body.get("id"))
        parsed = urlparse(url)
        # only Civitai's image CDN - never fetch arbitrary URLs
        if parsed.scheme != "https" or parsed.hostname not in IMAGE_HOSTS:
            raise CivitaiError("Only images from image.civitai.com can be imported.", 400)
        timeout = aiohttp.ClientTimeout(total=120)
        async with aiohttp.ClientSession(headers={"User-Agent": USER_AGENT}, timeout=timeout) as s:
            async with s.get(url) as resp:
                if resp.status >= 400:
                    raise CivitaiError(f"Download failed (HTTP {resp.status}).", 502)
                ctype = (resp.headers.get("Content-Type") or "").split(";")[0].strip().lower()
                ext = IMAGE_TYPES.get(ctype)
                if not ext:
                    raise CivitaiError(f"Not an image ({ctype or 'unknown type'}).", 415)
                data = bytearray()
                async for chunk in resp.content.iter_chunked(1 << 16):
                    data.extend(chunk)
                    if len(data) > IMAGE_MAX_BYTES:
                        raise CivitaiError("Image too large.", 413)
        name = f"civitai_{image_id}{ext}"
        target = Path(folder_paths.get_input_directory()) / name
        if not target.exists() or target.stat().st_size != len(data):
            tmp = target.with_suffix(target.suffix + ".part")
            tmp.write_bytes(data)
            os.replace(tmp, target)
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response({"name": name})


@routes.get(f"{PREFIX}/reactions")
async def get_reactions(request: web.Request) -> web.Response:
    try:
        image_id = _int(request.query.get("imageId"))
        mine = await _client(request).my_reactions([image_id])
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response({"reactions": mine.get(str(image_id), [])})


@routes.post(f"{PREFIX}/reactions")
async def toggle_reaction(request: web.Request) -> web.Response:
    try:
        body = await _json_body(request)
        image_id = _int(body.get("imageId"))
        client = _client(request)
        await client.toggle_reaction(image_id, str(body.get("reaction") or ""))
        mine = await client.my_reactions([image_id])
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response({"reactions": mine.get(str(image_id), [])})


@routes.get(f"{PREFIX}/following")
async def get_following(request: web.Request) -> web.Response:
    try:
        users = await _client(request).get_following()
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response({"users": users})


@routes.get(f"{PREFIX}/user")
async def get_user(request: web.Request) -> web.Response:
    try:
        return web.json_response(await _client(request).get_user(request.query.get("username", "")))
    except Exception as e:  # noqa: BLE001
        return _err(e)


@routes.get(f"{PREFIX}/users")
async def search_users(request: web.Request) -> web.Response:
    try:
        return web.json_response({"users": await _client(request).search_users(request.query.get("query", ""))})
    except Exception as e:  # noqa: BLE001
        return _err(e)


@routes.post(f"{PREFIX}/follow")
async def toggle_follow(request: web.Request) -> web.Response:
    """Follow / unfollow; returns the new following list so the UI is in sync with Civitai."""
    try:
        body = await _json_body(request)
        client = _client(request)
        await client.toggle_follow(str(body.get("username") or ""))
        users = await client.get_following()
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response({"users": users})


@routes.get(f"{PREFIX}/tags")
async def search_tags(request: web.Request) -> web.Response:
    try:
        tags = await _client(request).search_tags(request.query.get("query", ""))
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response({"tags": tags})


@routes.get(f"{PREFIX}/tags/trending")
async def trending_tags(request: web.Request) -> web.Response:
    try:
        level = _int(request.query.get("browsingLevel", 1), 1)
        tags = await _client(request, level).trending_tags(include_nsfw=bool(level & ~3))
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response({"tags": tags})


@routes.get(f"{PREFIX}/resources")
async def get_resources(request: web.Request) -> web.Response:
    """Checkpoint / LoRAs / ... of an image, resolved to Civitai models."""
    q = request.query
    try:
        ids = [_int(v) for v in (q.get("versionIds") or "").split(",") if v.strip()]
        hashes = [h.strip() for h in (q.get("hashes") or "").split(",") if h.strip()]
        res = await _client(request).get_resources(ids, hashes)
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response({"resources": res})


# ------------------------------------------------------ local models / downloads
@routes.post(f"{PREFIX}/local")
async def post_local(request: web.Request) -> web.Response:
    """Which of these resources exist in ComfyUI's model folders?"""
    try:
        body = await _json_body(request)
        res = [r for r in (body.get("resources") or []) if isinstance(r, dict)][:50]
        matches = await local_models.lookup(res, allow_hash=body.get("hash") is not False)
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response({"matches": matches})


@routes.post(f"{PREFIX}/local/rescan")
async def post_local_rescan(request: web.Request) -> web.Response:
    """Re-read the model folders (e.g. after copying models in by hand)."""
    try:
        files = await local_models.rescan()
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response({"files": files})


@routes.get(f"{PREFIX}/model_folders")
async def get_model_folders(request: web.Request) -> web.Response:
    try:
        return web.json_response(downloads.folder_options(request.query.get("type", "")))
    except Exception as e:  # noqa: BLE001
        return _err(e)


@routes.post(f"{PREFIX}/download")
async def post_download(request: web.Request) -> web.Response:
    try:
        body = await _json_body(request)
        version_id = _int(body.get("versionId"), 0)
        resolved = await _client(request).get_resources([version_id], [])
        file = (resolved[0].get("file") if resolved else None) or {}
        if not file.get("downloadUrl"):
            raise CivitaiError("Civitai offers no file for this model version.", 404)
        r = resolved[0]
        job = downloads.start(
            url=file["downloadUrl"],
            file={**file, "versionId": version_id},
            ftype=str(body.get("type") or ""),
            folder=str(body.get("folder") or ""),
            subdir=str(body.get("subdir") or ""),
            api_key=_api_key() or None,
            label=f"{r.get('modelName', '')} {r.get('versionName', '')}".strip(),
        )
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response(job)


@routes.get(f"{PREFIX}/downloads")
async def get_downloads(request: web.Request) -> web.Response:
    return web.json_response({"jobs": downloads.jobs()})


@routes.delete(f"{PREFIX}/download/{{job_id}}")
async def delete_download(request: web.Request) -> web.Response:
    return web.json_response({"canceled": downloads.cancel(request.match_info["job_id"])})


# ------------------------------------------------------ collection editing
@routes.get(f"{PREFIX}/item_collections")
async def get_item_collections(request: web.Request) -> web.Response:
    try:
        image_id = _int(request.query.get("imageId"), 0)
        ids = await _client(request).get_item_collections(image_id)
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response({"collectionIds": ids})


@routes.post(f"{PREFIX}/item_collections")
async def save_item_collections(request: web.Request) -> web.Response:
    try:
        body = await _json_body(request)
        client = _client(request)
        image_id = _int(body.get("imageId"), 0)
        await client.save_item(
            image_id,
            [_int(c, 0) for c in body.get("add") or []],
            [_int(c, 0) for c in body.get("remove") or []],
        )
        ids = await client.get_item_collections(image_id)
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response({"collectionIds": ids})


@routes.post(f"{PREFIX}/collection")
async def upsert_collection(request: web.Request) -> web.Response:
    """Create (no id) or update (with id) a collection."""
    try:
        body = await _json_body(request)
        cid = body.get("id")
        res = await _client(request).upsert_collection(
            name=body.get("name") or "",
            description=body.get("description") or "",
            read=body.get("read") or "Private",
            collection_id=_int(cid, 0) if cid else None,
            ctype=body.get("type") or "Image",
        )
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response(res)


@routes.delete(PREFIX + "/collection/{id}")
async def delete_collection(request: web.Request) -> web.Response:
    try:
        cid = _int(request.match_info["id"], 0)
        await _client(request).delete_collection(cid)
    except Exception as e:  # noqa: BLE001
        return _err(e)
    return web.json_response({"ok": True})
