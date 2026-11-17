"""Local model index: which of an image's resources are already on disk?

Matching is done by SHA256 (Civitai's "AutoV2" hash is its first 10 hex chars).
Hashes are read from sidecar files other tools already write next to the
models (LoRA Manager, Stability Matrix, plain .sha256), otherwise computed once
on demand (only for files whose size matches) and cached in hashes.json (keyed by path, size and mtime).
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import logging
import os
import threading
import time
from pathlib import Path

import folder_paths

log = logging.getLogger("civitai_discovery")

CACHE_PATH = Path(__file__).parent / "hashes.json"
# Civitai model type -> ComfyUI folder type(s); the first one is the default for downloads.
MODEL_FOLDERS = {
    "Checkpoint": ["checkpoints", "diffusion_models"],
    "LORA": ["loras"],
    "LoCon": ["loras"],
    "DoRA": ["loras"],
    "TextualInversion": ["embeddings"],
    "VAE": ["vae"],
    "Upscaler": ["upscale_models"],
    "Controlnet": ["controlnet"],
    "Hypernetwork": ["hypernetworks"],
}
INDEX_FOLDERS = ["checkpoints", "diffusion_models", "loras", "embeddings", "vae", "upscale_models", "controlnet"]
MODEL_EXTS = {".safetensors", ".ckpt", ".pt", ".pth", ".bin", ".gguf", ".sft"}


def _sidecar_sha256(path: str) -> str | None:
    """SHA256 written by other tools next to the model file, if any."""
    stem = os.path.splitext(path)[0]
    try:
        p = stem + ".metadata.json"  # LoRA Manager
        if os.path.isfile(p):
            v = json.loads(Path(p).read_text(encoding="utf-8")).get("sha256")
            if isinstance(v, str) and len(v) == 64:
                return v.upper()
        p = stem + ".cm-info.json"  # Stability Matrix
        if os.path.isfile(p):
            v = (json.loads(Path(p).read_text(encoding="utf-8")).get("Hashes") or {}).get("SHA256")
            if isinstance(v, str) and len(v) == 64:
                return v.upper()
        for p in (path + ".sha256", stem + ".sha256"):
            if os.path.isfile(p):
                v = Path(p).read_text(encoding="utf-8").strip().split()[0]
                if len(v) == 64:
                    return v.upper()
    except (OSError, ValueError, json.JSONDecodeError, IndexError, AttributeError):
        pass
    return None


def _sha256_file(path: str, stop: threading.Event) -> str | None:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(4 * 1024 * 1024):
            if stop.is_set():
                return None
            h.update(chunk)
    return h.hexdigest().upper()


class LocalIndex:
    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._cache: dict[str, dict] = self._load()  # abs path -> {size, mtime, sha256}
        self._files: list[tuple[str, str, str]] = []  # (folder type, relative name, abs path)
        self._scanned = 0.0
        self._stop = threading.Event()
        self._hash_lock = threading.Lock()  # one lookup (and its hashing) at a time

    # ------------------------------------------------------------ cache file
    def _load(self) -> dict:
        try:
            data = json.loads(CACHE_PATH.read_text(encoding="utf-8"))
            return data if isinstance(data, dict) else {}
        except (OSError, json.JSONDecodeError):
            return {}

    def _save(self) -> None:
        with self._lock:
            # forget files that are gone
            for k in [k for k in self._cache if not os.path.exists(k)]:
                del self._cache[k]
            data = json.dumps(self._cache)
        tmp = CACHE_PATH.with_suffix(".tmp")
        try:
            tmp.write_text(data, encoding="utf-8")
            os.replace(tmp, CACHE_PATH)
        except OSError as e:
            log.warning("civitai_discovery: could not write %s: %s", CACHE_PATH, e)

    # ------------------------------------------------------------ scanning
    def scan(self, force: bool = False) -> None:
        """List model files (cheap; folder_paths caches the listings)."""
        if not force and time.time() - self._scanned < 10:
            return
        files = []
        seen = set()
        for ftype in INDEX_FOLDERS:
            try:
                names = folder_paths.get_filename_list(ftype)
            except Exception:  # noqa: BLE001 - unknown folder type in this ComfyUI version
                continue
            for name in names:
                if os.path.splitext(name)[1].lower() not in MODEL_EXTS:
                    continue
                full = folder_paths.get_full_path(ftype, name)
                if not full:
                    continue
                key = os.path.realpath(full)
                if (ftype, key) in seen:
                    continue
                seen.add((ftype, key))
                files.append((ftype, name, key))
        self._files = files
        self._scanned = time.time()

    def _entry(self, path: str) -> dict | None:
        """Cached hash entry if it still matches the file on disk."""
        try:
            st = os.stat(path)
        except OSError:
            return None
        with self._lock:
            e = self._cache.get(path)
        if e and e.get("size") == st.st_size and e.get("mtime") == int(st.st_mtime):
            return e
        sha = _sidecar_sha256(path)
        if sha:
            e = {"size": st.st_size, "mtime": int(st.st_mtime), "sha256": sha}
            with self._lock:
                self._cache[path] = e
            return e
        return None

    def add(self, path: str, sha256: str) -> None:
        """A file we just downloaded (hash already verified)."""
        try:
            st = os.stat(path)
        except OSError:
            return
        with self._lock:
            self._cache[os.path.realpath(path)] = {"size": st.st_size, "mtime": int(st.st_mtime), "sha256": sha256.upper()}
        self._scanned = 0.0
        self._save()

    # ------------------------------------------------------------ lookup
    def lookup(self, resources: list[dict]) -> dict:
        """resources: [{key, hashes: [SHA256/AutoV2...], sizeKB, fileName}] -> {key: {type, name, by}}.

        Known hashes (cache / sidecar files) are matched first. Files whose size
        equals the Civitai file size are hashed on demand, so nothing is ever
        indexed in bulk.
        """
        self.scan()
        with self._hash_lock:
            by_hash: dict[str, tuple] = {}
            sizes: dict[int, list[tuple]] = {}
            for f in self._files:
                e = self._entry(f[2])
                if e:
                    by_hash.setdefault(e["sha256"], f)
                    by_hash.setdefault(e["sha256"][:10], f)
                else:
                    try:
                        sizes.setdefault(os.path.getsize(f[2]) // 1024, []).append(f)
                    except OSError:
                        pass
            out, hashed = {}, False
            for r in resources:
                want = [str(h).upper() for h in r.get("hashes") or [] if isinstance(h, str)]
                want = [h for h in want if len(h) in (10, 64)]
                hit = next((by_hash[h] for h in want if h in by_hash), None) or next(
                    (by_hash[h[:10]] for h in want if len(h) == 64 and h[:10] in by_hash), None
                )
                if not hit and want and isinstance(r.get("sizeKB"), (int, float)):
                    kb = int(r["sizeKB"])
                    for cand in [c for d in (-1, 0, 1) for c in sizes.get(kb + d, [])]:
                        sha = self._hash_now(cand[2])
                        hashed = True
                        if sha and any(sha == h or sha[:10] == h for h in want):
                            hit = cand
                            break
                if hit:
                    out[r.get("key")] = {"type": hit[0], "name": hit[1], "by": "hash"}
                    continue
                fname = (r.get("fileName") or "").lower()
                if fname:
                    for f in self._files:
                        if os.path.basename(f[1]).lower() == fname:
                            out[r.get("key")] = {"type": f[0], "name": f[1], "by": "name"}
                            break
            if hashed:
                self._save()
        return out

    def _hash_now(self, path: str) -> str | None:
        try:
            st = os.stat(path)
            sha = _sha256_file(path, self._stop)
        except OSError:
            return None
        if sha:
            with self._lock:
                self._cache[path] = {"size": st.st_size, "mtime": int(st.st_mtime), "sha256": sha}
        return sha

    def lists(self) -> dict:
        """Relative file names per folder type, as ComfyUI's combo widgets show them."""
        out = {}
        for ftype in INDEX_FOLDERS:
            try:
                out[ftype] = folder_paths.get_filename_list(ftype)
            except Exception:  # noqa: BLE001
                out[ftype] = []
        return out


INDEX = LocalIndex()


async def lookup(resources: list[dict]) -> dict:
    return await asyncio.to_thread(INDEX.lookup, resources)
