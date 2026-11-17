"""Download model files from Civitai into ComfyUI's model folders (background jobs)."""

from __future__ import annotations

import asyncio
import hashlib
import itertools
import logging
import os
import time
from urllib.parse import urlparse

import aiohttp
import folder_paths

from .civitai_client import USER_AGENT
from .local_models import INDEX, MODEL_EXTS

log = logging.getLogger("civitai_discovery")

ALLOWED_HOSTS = {"civitai.com", "civitai.red", "www.civitai.com", "www.civitai.red"}
FOLDER_TYPES = ["checkpoints", "diffusion_models", "loras", "embeddings", "vae", "upscale_models", "controlnet", "hypernetworks"]
CHUNK = 1024 * 1024

_jobs: dict[str, dict] = {}
_tasks: dict[str, asyncio.Task] = {}
_ids = itertools.count(1)


class DownloadError(Exception):
    pass


def folder_options(ftype: str) -> dict:
    """The folders ComfyUI knows for a model type, with how many models each holds."""
    if ftype not in FOLDER_TYPES:
        raise DownloadError(f"Unknown model folder type: {ftype}")
    try:
        paths = folder_paths.get_folder_paths(ftype)
    except Exception:  # noqa: BLE001
        return {"folders": [], "subdirs": []}
    counts = {p: 0 for p in paths}
    try:
        for name in folder_paths.get_filename_list(ftype):
            full = folder_paths.get_full_path(ftype, name) or ""
            for p in paths:
                if full.startswith(os.path.join(p, "")):
                    counts[p] += 1
                    break
    except Exception:  # noqa: BLE001
        pass
    subdirs = set()
    for p in paths:
        try:
            for entry in os.scandir(p):
                if entry.is_dir() and not entry.name.startswith("."):
                    subdirs.add(entry.name)
        except OSError:
            pass
    return {
        "folders": [{"path": p, "count": counts[p], "exists": os.path.isdir(p)} for p in paths],
        "subdirs": sorted(subdirs, key=str.lower),
    }


def _safe_name(name: str) -> str:
    name = os.path.basename((name or "").replace("\\", "/")).strip()
    if not name or name.startswith(".") or os.path.splitext(name)[1].lower() not in MODEL_EXTS:
        raise DownloadError(f"Unsupported file name: {name!r}")
    return name


def _safe_subdir(sub: str) -> str:
    sub = (sub or "").replace("\\", "/").strip().strip("/")
    if not sub:
        return ""
    parts = [p for p in sub.split("/") if p]
    if any(p in (".", "..") or p.startswith(".") for p in parts) or len(parts) > 4:
        raise DownloadError("Invalid subfolder")
    return os.path.join(*parts)


def start(*, url: str, file: dict, ftype: str, folder: str, subdir: str, api_key: str | None, label: str) -> dict:
    u = urlparse(url)
    if u.scheme != "https" or u.hostname not in ALLOWED_HOSTS or not u.path.startswith("/api/download/models/"):
        raise DownloadError("Only Civitai model downloads are allowed")
    if ftype not in FOLDER_TYPES:
        raise DownloadError(f"Unknown model folder type: {ftype}")
    if folder not in folder_paths.get_folder_paths(ftype):
        raise DownloadError("Not a model folder of ComfyUI")
    name = _safe_name(file.get("name") or "")
    dest_dir = os.path.join(folder, _safe_subdir(subdir))
    dest = os.path.join(dest_dir, name)
    root, real = os.path.realpath(folder), os.path.realpath(dest_dir)
    if real != root and not real.startswith(root + os.sep):
        raise DownloadError("Invalid destination")
    if os.path.exists(dest):
        raise DownloadError(f"File already exists: {dest}")
    for j in _jobs.values():
        if j["path"] == dest and j["status"] == "running":
            return j
    job_id = str(next(_ids))
    job = {
        "id": job_id,
        "label": label,
        "name": name,
        "type": ftype,
        "path": dest,
        "relName": os.path.relpath(dest, folder).replace(os.sep, "/"),
        "total": int((file.get("sizeKB") or 0) * 1024),
        "done": 0,
        "status": "running",
        "error": None,
        "started": time.time(),
        "versionId": file.get("versionId"),
    }
    _jobs[job_id] = job
    _tasks[job_id] = asyncio.get_running_loop().create_task(_run(job, url, file.get("sha256"), api_key))
    return job


async def _run(job: dict, url: str, sha256: str | None, api_key: str | None) -> None:
    part = job["path"] + ".part"
    headers = {"User-Agent": USER_AGENT}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    h = hashlib.sha256()
    try:
        os.makedirs(os.path.dirname(job["path"]), exist_ok=True)
        timeout = aiohttp.ClientTimeout(total=None, sock_connect=30, sock_read=120)
        async with aiohttp.ClientSession(timeout=timeout) as s:
            async with s.get(url, headers=headers, allow_redirects=True) as resp:
                ctype = resp.headers.get("Content-Type", "")
                if resp.status in (401, 403) or "text/html" in ctype:
                    raise DownloadError(
                        "Civitai only allows downloads with an API key. Add yours in the settings (⚙)."
                        if not api_key
                        else "Civitai refused the download (the key may lack access to this model, "
                        "or it needs to be bought / early access)."
                    )
                if resp.status >= 400:
                    raise DownloadError(f"Download failed (HTTP {resp.status})")
                if resp.content_length:
                    job["total"] = resp.content_length
                with open(part, "wb") as f:
                    async for chunk in resp.content.iter_chunked(CHUNK):
                        f.write(chunk)
                        h.update(chunk)
                        job["done"] += len(chunk)
        digest = h.hexdigest().upper()
        if sha256 and digest != sha256.upper():
            raise DownloadError("Checksum mismatch - the download is corrupt")
        if os.path.exists(job["path"]):
            raise DownloadError(f"File already exists: {job['path']}")
        os.replace(part, job["path"])
        INDEX.add(job["path"], digest)
        job["status"] = "done"
        log.info("civitai_discovery: downloaded %s", job["path"])
    except asyncio.CancelledError:
        job["status"] = "canceled"
    except (DownloadError, aiohttp.ClientError, OSError, asyncio.TimeoutError) as e:
        job["status"] = "error"
        job["error"] = str(e) or type(e).__name__
        log.warning("civitai_discovery: download of %s failed: %s", job["name"], job["error"])
    finally:
        if job["status"] != "done":
            try:
                os.remove(part)
            except OSError:
                pass
        _tasks.pop(job["id"], None)


def cancel(job_id: str) -> bool:
    t = _tasks.get(job_id)
    if t:
        t.cancel()
        return True
    return False


def jobs() -> list[dict]:
    # forget finished jobs after 10 minutes
    now = time.time()
    for k in [k for k, j in _jobs.items() if j["status"] != "running" and now - j["started"] > 600]:
        _jobs.pop(k, None)
    return list(_jobs.values())
