"""
Civitai Discovery for ComfyUI
-----------------------------
Adds two sidebar tabs to ComfyUI:

* Civitai Discovery - browse the general Civitai image/video feed
* Civitai Favorites - your collections and reactions, incl. creating/editing/
  deleting collections

Both offer metadata and base-model filters, one-click prompt insertion into
prompt nodes and saving images to your Civitai collections.

The Python side only registers HTTP routes (/civitai_discovery/*) that proxy
requests to Civitai with your API key, so the key never lives in the browser
and CORS is not an issue.
"""

from . import civitai_routes  # noqa: F401  (registers the routes on import)

NODE_CLASS_MAPPINGS = {}
NODE_DISPLAY_NAME_MAPPINGS = {}
WEB_DIRECTORY = "./web"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
