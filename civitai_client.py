"""Small async client for the parts of the Civitai API "Civitai Discovery" needs.

* Discovery feed: the public REST API (/api/v1/images). Works without a key.
* Favorites: Civitai's public REST API cannot filter by collection, so listing
  uses the site's tRPC endpoints, which accept a personal API key as a Bearer
  token (scopes: "Collections: read" + "Media: read"). Metadata (prompt etc.) is
  then fetched in one batch per page via `/api/v1/images?ids=...&withMeta=true`.
* Managing collections (create/edit/delete, add/remove images) uses the tRPC
  mutations `collection.upsert|delete|saveItem` (scope "Collections: write").
"""

from __future__ import annotations

import asyncio
import json
import re
from typing import Any
from urllib.parse import quote

import aiohttp

BASE_URL = "https://civitai.com"
# Civitai serves mature content only on civitai.red: on civitai.com the tRPC API
# clamps every request to SFW levels, whatever browsingLevel is asked for.
DOMAINS = {"com": "https://civitai.com", "red": "https://civitai.red"}
SFW_LEVELS = 1 | 2  # PG | PG13
EDGE_BASE = "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA"
USER_AGENT = "ComfyUI-Civitai-Discovery/1.1"
ALL_BROWSING_LEVELS = 31  # PG | PG13 | R | X | XXX

# Collection types whose items can be shown as images. `None` = mixed/legacy.
IMAGE_COLLECTION_TYPES = {None, "Image", "Post"}
REACTIONS = ("Like", "Heart", "Laugh", "Cry")
USERNAME_RE = re.compile(r"[A-Za-z0-9_.\-]{1,64}")
FEED_SORTS = ("Most Reactions", "Most Comments", "Most Collected", "Newest", "Oldest")
PERIODS = ("Day", "Week", "Month", "Year", "AllTime")
READ_CONFIGS = ("Private", "Unlisted", "Public")
HASH_RE = re.compile(r"[0-9A-Fa-f]{8,64}")
MAX_RESOURCE_LOOKUPS = 20

# Model-version lookups are immutable enough to cache for the process lifetime.
# key: ("id", 123) or ("hash", "ABCDEF1234") -> resource dict or None (not found)
_RESOURCE_CACHE: dict[tuple, dict | None] = {}


class CivitaiError(Exception):
    def __init__(self, message: str, status: int = 502):
        super().__init__(message)
        self.status = status


class CivitaiClient:
    def __init__(self, api_key: str | None, base_url: str = BASE_URL, timeout: float = 30.0):
        self.has_key = bool(api_key)
        self._headers = {
            "User-Agent": USER_AGENT,
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
        if api_key:
            self._headers["Authorization"] = f"Bearer {api_key}"
        self._timeout = aiohttp.ClientTimeout(total=timeout)
        self.base = base_url.rstrip("/")

    # ------------------------------------------------------------------ http
    def _require_key(self) -> None:
        if not self.has_key:
            raise CivitaiError("No Civitai API key configured.", 401)

    async def _get_json(self, url: str, method: str = "GET", body: Any = None) -> Any:
        try:
            return await self._request_json(url, method, body)
        except asyncio.TimeoutError:
            raise CivitaiError("Civitai did not respond in time. Please try again.", 504)
        except aiohttp.ClientError as e:
            raise CivitaiError(f"Could not reach Civitai: {e}", 502)

    async def _request_json(self, url: str, method: str = "GET", body: Any = None) -> Any:
        async with aiohttp.ClientSession(headers=self._headers, timeout=self._timeout) as s:
            data_arg = json.dumps(body) if body is not None else None
            async with s.request(method, url, data=data_arg) as resp:
                text = await resp.text()
                try:
                    data = json.loads(text) if text else None
                except json.JSONDecodeError:
                    data = None
                if resp.status >= 400:
                    raise CivitaiError(_error_message(data, text, resp.status), resp.status)
                return data

    async def _trpc(self, procedure: str, payload: dict) -> Any:
        self._require_key()
        url = f"{self.base}/api/trpc/{procedure}?input=" + quote(
            json.dumps({"json": payload}, separators=(",", ":"))
        )
        data = await self._get_json(url)
        try:
            return data["result"]["data"]["json"]
        except (KeyError, TypeError):
            raise CivitaiError(f"Unexpected response from Civitai ({procedure}).")

    async def _trpc_mutation(self, procedure: str, payload: dict) -> Any:
        self._require_key()
        data = await self._get_json(
            f"{self.base}/api/trpc/{procedure}", method="POST", body={"json": payload}
        )
        try:
            return data["result"]["data"].get("json")
        except (KeyError, TypeError, AttributeError):
            return None

    # --------------------------------------------------------------- public
    async def get_me(self) -> dict | None:
        """Returns basic info about the key's owner (or None)."""
        try:
            data = await self._get_json(f"{self.base}/api/v1/me")
            return data if isinstance(data, dict) else None
        except CivitaiError:
            return None

    async def get_collections(self) -> list[dict]:
        raw, me = await asyncio.gather(
            self._trpc(
                "collection.getAllUser",
                # contributingOnly=True: own collections + ones the user follows/contributes
                # to. (False would additionally return *every* public collection on the site.)
                {"contributingOnly": True, "permissions": ["VIEW", "ADD", "MANAGE"]},
            ),
            self.get_me(),
        )
        my_id = (me or {}).get("id")
        result = []
        seen: set = set()
        for c in raw or []:
            ctype = c.get("type")
            if ctype not in IMAGE_COLLECTION_TYPES or c.get("id") in seen:
                continue
            seen.add(c.get("id"))
            result.append(
                {
                    "id": c.get("id"),
                    "name": c.get("name") or f"Collection {c.get('id')}",
                    "type": ctype,
                    "archived": bool(c.get("archivedAt")),
                    "description": c.get("description") or "",
                    "read": c.get("read"),
                    "owned": my_id is not None and c.get("userId") == my_id,
                }
            )
        result.sort(key=lambda c: (c["archived"], (c["name"] or "").lower()))
        return result

    async def get_images(
        self,
        source: str,
        cursor: Any = None,
        limit: int = 50,
        browsing_level: int = ALL_BROWSING_LEVELS,
        sort: str = "Newest",
    ) -> dict:
        """source: "collection:<id>", "reaction:<Like|Heart|...>" or "user:<username>"."""
        kind, _, value = source.partition(":")
        payload: dict[str, Any] = {
            "limit": max(1, min(int(limit), 100)),
            "sort": sort,
            "period": "AllTime",
            "browsingLevel": int(browsing_level),
            "include": [],
        }
        if kind == "collection" and value.isdigit():
            payload["collectionId"] = int(value)
        elif kind == "reaction" and value in REACTIONS:
            payload["reactions"] = [value]
        elif kind == "user" and USERNAME_RE.fullmatch(value):
            payload["username"] = value
        else:
            raise CivitaiError(f"Invalid source '{source}'.", 400)
        if cursor not in (None, ""):
            payload["cursor"] = cursor

        page = await self._trpc("image.getInfinite", payload)
        items = page.get("items") or []
        next_cursor = page.get("nextCursor")

        meta_by_id = await self._fetch_meta([i["id"] for i in items if i.get("id")], browsing_level)
        return {
            "items": [_normalize_item(i, meta_by_id.get(i.get("id")), self.base) for i in items],
            "nextCursor": next_cursor,
        }

    async def get_feed(
        self,
        cursor: Any = None,
        limit: int = 50,
        browsing_level: int = ALL_BROWSING_LEVELS,
        sort: str = "Most Reactions",
        period: str = "Week",
        media_type: str | None = None,
        base_models: list[str] | None = None,
        username: str | None = None,
        tags: list[int] | None = None,
    ) -> dict:
        """General image feed via the public REST API (no key required).

        tags: tag IDs; Civitai combines several with AND.
        """
        params: dict[str, Any] = {
            "limit": max(1, min(int(limit), 100)),
            "withMeta": "true",
            "withTags": "true",
            "sort": sort if sort in FEED_SORTS else "Most Reactions",
            "period": period if period in PERIODS else "Week",
            "browsingLevel": int(browsing_level),
        }
        if media_type in ("image", "video"):
            params["type"] = media_type
        if base_models:
            params["baseModels"] = ",".join(base_models)
        if username:
            if not USERNAME_RE.fullmatch(username):
                raise CivitaiError("Invalid username.", 400)
            params["username"] = username
        if tags:
            params["tags"] = ",".join(str(int(t)) for t in tags[:10])
        if cursor not in (None, ""):
            params["cursor"] = cursor
        url = f"{self.base}/api/v1/images?" + "&".join(
            f"{k}={quote(str(v), safe=',')}" for k, v in params.items()
        )
        data = await self._get_json(url) or {}
        items = []
        for it in data.get("items") or []:
            stub = {
                "id": it.get("id"),
                "type": it.get("type"),
                "width": it.get("width"),
                "height": it.get("height"),
                "nsfwLevel": it.get("browsingLevel"),
                "postId": it.get("postId"),
                "hasMeta": bool(it.get("meta")),
            }
            items.append(_normalize_item(stub, it, self.base))
        return {"items": items, "nextCursor": (data.get("metadata") or {}).get("nextCursor")}

    async def semantic_search(
        self,
        query: str,
        cursor: Any = None,
        limit: int = 50,
        browsing_level: int = ALL_BROWSING_LEVELS,
        sort: str = "relevance",
        media_type: str | None = None,
        base_models: list[str] | None = None,
        username: str | None = None,
        tags: list[int] | None = None,
    ) -> dict:
        """Text search over all Civitai images (tRPC semanticImageSearch.search).

        Civitai only enables this for some accounts (feature flag rollout) and only
        for full-access API keys; otherwise it answers 403/401, which the caller
        turns into a fallback.
        """
        query = (query or "").strip()[:500]
        if not query:
            raise CivitaiError("Empty query.", 400)
        payload: dict[str, Any] = {
            "query": query,
            "limit": max(1, min(int(limit), 100)),
            "browsingLevel": int(browsing_level),
            "sort": "newest" if sort == "newest" else "relevance",
        }
        if media_type in ("image", "video"):
            payload["types"] = [media_type]
        if base_models:
            payload["baseModels"] = base_models
        if username:
            if not USERNAME_RE.fullmatch(username):
                raise CivitaiError("Invalid username.", 400)
            payload["usernames"] = [username]
        if tags:
            payload["tagIds"] = [int(t) for t in tags[:20]]
        if cursor not in (None, ""):
            payload["cursor"] = int(cursor)
        page = await self._trpc("semanticImageSearch.search", payload)
        items = (page or {}).get("items") or []
        meta_by_id = await self._fetch_meta([i["id"] for i in items if i.get("id")], browsing_level)
        return {
            "items": [_normalize_item(i, meta_by_id.get(i.get("id")), self.base) for i in items],
            "nextCursor": (page or {}).get("nextCursor"),
        }

    # ------------------------------------------------------------- reactions
    async def my_reactions(self, image_ids: list[int]) -> dict[str, list[str]]:
        """The key owner's reactions per image id (tRPC; scope "User: read")."""
        ids = [int(i) for i in image_ids][:100]
        if not ids:
            return {}
        raw = await self._trpc("reaction.getMyImageReactions", {"imageIds": ids})
        return {str(k): [r for r in v if r in REACTIONS] for k, v in (raw or {}).items() if isinstance(v, list)}

    async def toggle_reaction(self, image_id: int, reaction: str) -> None:
        """Add or remove one of the key owner's reactions (tRPC; scope "Social: write")."""
        if reaction not in REACTIONS:
            raise CivitaiError("Invalid reaction.", 400)
        await self._trpc_mutation(
            "reaction.toggle", {"entityId": int(image_id), "entityType": "image", "reaction": reaction}
        )

    # ------------------------------------------------------------------ tags
    async def search_tags(self, query: str, limit: int = 20) -> list[dict]:
        """Image tags matching `query` (tRPC tag.getAll; needs a key)."""
        query = (query or "").strip()[:100]
        if not query:
            return []
        raw = await self._trpc(
            "tag.getAll",
            {"query": query, "entityType": ["Image"], "sort": "Most Images", "limit": max(1, min(limit, 50))},
        )
        items = raw.get("items") if isinstance(raw, dict) else raw
        return _clean_tags(items)

    async def trending_tags(self, limit: int = 40, include_nsfw: bool = False) -> list[dict]:
        """Currently trending image tags (tRPC tag.getTrending; needs a key)."""
        raw = await self._trpc(
            "tag.getTrending",
            {"entityType": ["Image"], "limit": max(1, min(limit, 100)), "includeNsfw": include_nsfw},
        )
        items = raw.get("items") if isinstance(raw, dict) else raw
        return _clean_tags(items)

    # ---------------------------------------------------- collection editing
    async def get_item_collections(self, image_id: int) -> list[int]:
        """IDs of the user's collections that contain this image."""
        raw = await self._trpc(
            "collection.getUserCollectionItemsByItem",
            {"imageId": int(image_id), "type": "Image", "contributingOnly": True},
        )
        return sorted({r.get("collectionId") for r in raw or [] if r.get("collectionId")})

    async def save_item(self, image_id: int, add: list[int], remove: list[int]) -> None:
        await self._trpc_mutation(
            "collection.saveItem",
            {
                "imageId": int(image_id),
                "type": "Image",
                "collections": [{"collectionId": int(c)} for c in add],
                "removeFromCollectionIds": [int(c) for c in remove],
            },
        )

    async def upsert_collection(
        self,
        name: str,
        description: str = "",
        read: str = "Private",
        collection_id: int | None = None,
        ctype: str | None = "Image",
    ) -> dict:
        name = (name or "").strip()
        if not name or len(name) > 30:
            raise CivitaiError("Name must be 1-30 characters.", 400)
        if len(description or "") > 300:
            raise CivitaiError("Description must be at most 300 characters.", 400)
        payload: dict[str, Any] = {
            "name": name,
            "description": description or None,
            "read": read if read in READ_CONFIGS else "Private",
            # The schema defaults `type` to "Model" - always send it explicitly.
            "type": ctype or "Image",
        }
        if collection_id:
            payload["id"] = int(collection_id)
        res = await self._trpc_mutation("collection.upsert", payload)
        return {"id": (res or {}).get("id", collection_id), "name": name}

    async def delete_collection(self, collection_id: int) -> None:
        await self._trpc_mutation("collection.delete", {"id": int(collection_id)})

    # ------------------------------------------------------------ resources
    async def get_resources(self, version_ids: list[int], hashes: list[str]) -> list[dict]:
        """Resolve model versions (checkpoint, LoRAs, ...) via the public REST API.

        version_ids: the image's `modelVersionIds`; hashes: AutoV2/SHA256 hashes
        from the generation metadata (for resources Civitai didn't link itself).
        """
        keys: list[tuple] = []
        for v in version_ids:
            if isinstance(v, int) and ("id", v) not in keys:
                keys.append(("id", v))
        for h in hashes:
            if HASH_RE.fullmatch(h or "") and ("hash", h.upper()) not in keys:
                keys.append(("hash", h.upper()))
        keys = keys[:MAX_RESOURCE_LOOKUPS]

        async def lookup(key: tuple) -> dict | None:
            if key in _RESOURCE_CACHE:
                return _RESOURCE_CACHE[key]
            kind, value = key
            url = (
                f"{self.base}/api/v1/model-versions/{value}"
                if kind == "id"
                else f"{self.base}/api/v1/model-versions/by-hash/{value}"
            )
            try:
                data = await self._get_json(url)
            except CivitaiError as e:
                if e.status == 404:
                    _RESOURCE_CACHE[key] = None
                return None
            res = _normalize_version(data, self.base) if isinstance(data, dict) else None
            _RESOURCE_CACHE[key] = res
            if res:
                _RESOURCE_CACHE[("id", res["versionId"])] = res
                for hv in res["hashes"]:
                    _RESOURCE_CACHE[("hash", hv)] = res
            return res

        results = await asyncio.gather(*(lookup(k) for k in keys))
        out, seen = [], set()
        for (kind, value), res in zip(keys, results):
            if not res or res["versionId"] in seen:
                continue
            seen.add(res["versionId"])
            out.append({**res, "matchedHash": value if kind == "hash" else None})
        return out

    async def _fetch_meta(self, ids: list[int], browsing_level: int) -> dict[int, dict]:
        """Batch-fetch the REST representation (incl. generation metadata)."""
        out: dict[int, dict] = {}
        for i in range(0, len(ids), 100):
            chunk = ids[i : i + 100]
            url = (
                f"{self.base}/api/v1/images?ids={','.join(map(str, chunk))}"
                f"&withMeta=true&withTags=true&limit={len(chunk)}&period=AllTime&browsingLevel={browsing_level}"
            )
            try:
                data = await self._get_json(url)
            except CivitaiError:
                continue  # metadata is a nice-to-have; listing still works
            for it in (data or {}).get("items", []):
                out[it.get("id")] = it
        return out


# ---------------------------------------------------------------- helpers
def resolve_base_url(domain: str | None, browsing_level: int | None = None) -> str:
    """domain: "com", "red" or "auto" (red as soon as a mature level is requested)."""
    if domain in DOMAINS:
        return DOMAINS[domain]
    if browsing_level is None or browsing_level & ~SFW_LEVELS:
        return DOMAINS["red"]
    return DOMAINS["com"]


def _error_message(data: Any, text: str, status: int) -> str:
    if status == 401:
        return "Civitai rejected the API key (401). Check that the key is valid."
    if status == 403:
        return "Civitai refused access (403). The API key may lack the required scopes."
    try:
        msg = data["error"]["json"]["message"]
        if msg:
            return f"Civitai: {msg}"
    except (KeyError, TypeError):
        pass
    if isinstance(data, dict) and isinstance(data.get("error"), str):
        return f"Civitai: {data['error']}"
    return f"Civitai request failed with HTTP {status}: {text[:200]}"


def edge_url(key: str, params: str, name: str | None, media_type: str) -> str:
    if key.startswith("http"):
        return key
    ext = ".mp4" if media_type == "video" else ".jpeg"
    fname = name or f"{key}{ext}"
    if media_type == "video" and not fname.endswith(".mp4"):
        fname = fname.rsplit(".", 1)[0] + ".mp4"
    return f"{EDGE_BASE}/{key}/{params}/{quote(fname)}"


def _variant(url: str, params: str) -> str:
    """Swap the transform segment of an image.civitai.com URL."""
    if "/original=true/" in url:
        return url.replace("/original=true/", f"/{params}/")
    return url


def _clean_stats(raw: Any) -> dict:
    raw = raw if isinstance(raw, dict) else {}
    keys = {"Like": "likeCount", "Heart": "heartCount", "Laugh": "laughCount", "Cry": "cryCount", "comments": "commentCount"}
    return {k: int(raw.get(v) or 0) for k, v in keys.items()}


def _clean_tags(raw: Any) -> list[dict]:
    out = []
    for t in raw or []:
        if isinstance(t, dict) and isinstance(t.get("id"), int) and t.get("name"):
            out.append({"id": t["id"], "name": str(t["name"])})
    return out


def _normalize_version(v: dict, base: str) -> dict | None:
    if not v.get("id") or not v.get("modelId"):
        return None
    model = v.get("model") or {}
    hashes = set()
    for f in v.get("files") or []:
        for hv in (f.get("hashes") or {}).values():
            if isinstance(hv, str):
                hashes.add(hv.upper())
    return {
        "versionId": v["id"],
        "versionName": v.get("name") or "",
        "modelId": v["modelId"],
        "modelName": model.get("name") or "",
        "type": model.get("type") or "",
        "baseModel": v.get("baseModel") or "",
        "url": f"{base}/models/{v['modelId']}?modelVersionId={v['id']}",
        "hashes": sorted(hashes),
    }


def _normalize_item(trpc_item: dict, rest_item: dict | None, base: str = BASE_URL) -> dict:
    media_type = trpc_item.get("type") or (rest_item or {}).get("type") or "image"
    key = trpc_item.get("url") or ""
    name = trpc_item.get("name")

    if rest_item and rest_item.get("url"):
        original = rest_item["url"]
    else:
        original = edge_url(key, "original=true", name, media_type)

    if media_type == "video":
        thumb = _variant(original, "transcode=true,width=450,optimized=true")
        preview = _variant(original, "transcode=true,width=1024,optimized=true")
        poster = _variant(original, "anim=false,transcode=true,width=450,optimized=true")
    else:
        thumb = _variant(original, "width=450,optimized=true")
        preview = _variant(original, "width=1200,optimized=true")
        poster = thumb

    meta = (rest_item or {}).get("meta") or None
    # The `?ids=` path returns the DB row ({id, meta: {...}}) instead of the flat meta.
    if isinstance(meta, dict) and isinstance(meta.get("meta"), dict) and "prompt" not in meta:
        meta = meta["meta"]
    if not isinstance(meta, dict):
        meta = None
    if isinstance(meta, dict) and not any(meta.values()):
        meta = None
    has_meta = bool(meta) or bool(trpc_item.get("hasMeta"))

    user = trpc_item.get("user") or {}
    return {
        "id": trpc_item.get("id"),
        "type": media_type,
        "width": trpc_item.get("width") or (rest_item or {}).get("width"),
        "height": trpc_item.get("height") or (rest_item or {}).get("height"),
        "nsfwLevel": trpc_item.get("nsfwLevel"),
        "url": original,
        "thumbUrl": thumb,
        "previewUrl": preview,
        "posterUrl": poster,
        "hasMeta": has_meta,
        "hasPrompt": bool(meta and meta.get("prompt")) or bool(trpc_item.get("hasPositivePrompt")),
        "meta": meta,
        "baseModel": (rest_item or {}).get("baseModel") or trpc_item.get("baseModel"),
        "username": (rest_item or {}).get("username") or user.get("username"),
        "postId": trpc_item.get("postId") or (rest_item or {}).get("postId"),
        "pageUrl": f"{base}/images/{trpc_item.get('id')}",
        "modelVersionIds": [v for v in ((rest_item or {}).get("modelVersionIds") or []) if isinstance(v, int)],
        "tags": _clean_tags((rest_item or {}).get("tags")),
        "stats": _clean_stats((rest_item or {}).get("stats")),
    }
