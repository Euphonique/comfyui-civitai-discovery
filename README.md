# Civitai Discovery for ComfyUI

*[Deutsche Version](README.de.md)*

A ComfyUI plugin that adds two new panels to the left sidebar:

- 🧭 **Civitai Discovery**: the general Civitai feed of images and videos
- ❤ **Civitai Favorites**: your collections and reactions, including collection management

Both panels let you filter, insert prompts into prompt nodes with one click, and save images to your Civitai collections. Saving happens directly on Civitai, not just locally.

<img width="3038" height="1464" alt="Bildschirmfoto vom 2026-11-17 23-51-54" src="https://github.com/user-attachments/assets/583a9903-1d43-4617-b9b2-e5fc8e9a4296" />
</br></br>
<img height="535" alt="Bildschirmfoto vom 2026-11-17 23-51-00" src="https://github.com/user-attachments/assets/72dbe638-7dc2-4e2b-83dd-f737298a511c" /> 
<img height="535" alt="Bildschirmfoto vom 2026-11-17 23-55-28" src="https://github.com/user-attachments/assets/7f3a5a99-fe6a-414a-b161-9c2cb05fface" /> 
<img height="535" alt="Bildschirmfoto vom 2026-11-17 23-54-40" src="https://github.com/user-attachments/assets/6b3762d5-79eb-44c7-86ff-f5a13f110943" />

*[more Screenshots](screenshots.md)*

## Features

### Civitai Discovery
- **Sort**: most reactions, most comments, most collected, newest
- **Period**: day, week, month, year, all time
- **Base model**: e.g. SD 1.x, SDXL, Pony, Illustrious, NoobAI, Flux, Krea, Qwen, Wan Video. The most popular families are listed first, followed by all others. Civitai filters on the server, so this works for rare models too.
- Sort, period and base model sit in one row. Below it, **Advanced** expands the remaining filters: media type, metadata (with metadata, with prompt, without), rating and blur NSFW. If any of them differ from the default, the collapsed section shows how many, e.g. "Advanced (1)".
- **Media type and rating** are filtered on the server as well.
- **People you follow** (👥 button in the header): only works by the users you follow on Civitai, with the same sort, period and filters. Needs an API key.
- **Images made with a model**: the 🖼 button next to a checkpoint or LoRA in the resources list shows that model version's gallery (all time). Also works from the Favorites tab, which then switches to Discovery.
- Works without an API key. You need a key for content rated R and above via civitai.red, and for saving to collections.

### Civitai Favorites
- **Dropdown**: your collections, collections you follow (marked with ↗), your reactions (👍 ❤️ 😂 😢) and recently viewed users
- **Manage collections** with the buttons next to the dropdown:
  - **+** creates a new collection (name, description, visibility: private, unlisted, public)
  - **✎** edits the selected collection
  - **🗑** deletes it after a confirmation. The images themselves are kept.
  - Editing and deleting only work for your own collections.
- **Filters**: sort and base model (with counts; only families present in the current view) in one row. Under **Advanced**: media type, metadata, rating and blur NSFW.

### Search and tags
The search field at the top of both panels understands three kinds of input, which you can mix in one line, e.g. `#animal #forest @someone misty morning`:

- **#tag**: Words marked with `#` are used as tags. Write multi-word tags with an underscore or quotes: `#black_hair` or `#"black hair"`. While you type `#…`, the field suggests matching tags. The first Enter completes the tag, the second starts the search. If a tag doesn't exist, the word is searched as text instead and a notice appears.
- **Tag without #**: While you type, the field suggests matching tags. These are the tags from the loaded results with their counts and, with an API key, all matching tags on Civitai. Selected tags appear as chips and can be removed with ×. Multiple tags are combined with AND.
  - In **Discovery**, Civitai does the filtering, so the search covers the whole feed.
  - In **Favorites**, filtering happens within the loaded images.
- **@user**: shows all works by that user.
- **Free text** (all words without `#` or `@`), combinable with tags, base model, media type and user:
  - **Civitai text search:** Civitai has a new semantic image search, but only enables it for some accounts (gradual rollout). It also needs a full-access API key. If it is enabled for you, Discovery uses it to search all images on Civitai. The chip then reads "Search "…"".
  - **Fallback:** If Civitai rejects the search, and always in Favorites, the panel filters the prompts of the loaded images: matches must contain all the words you entered, and the panel loads more pages as needed. The chip then reads "Prompt contains "…"".
  - If the input is a single word without `#`/`@` and a tag with exactly that name exists, the tag is used. To search it as free text, pick the last line in the suggestions.

The **Tags** button shows a **tag cloud**:
- **In the results**: the most frequent tags of the displayed images. The bigger the tag, the more often it appears.
- **Trending on Civitai**: Discovery only, and only with an API key.

Clicking a tag adds it to the search. The **detail view** lists all tags of an artwork, and clicking one adds it to the search too.

If a combination returns no results, the panel shows a notice with the buttons **Period: all time** and **Reset search & filters**. Several tags plus a short period plus a base model can easily come up empty.

### In both panels
- **Full width**: The ⧉ button at the top of the panel stretches it across the whole canvas. A second click, Esc, or switching sidebar tabs brings it back. At full width the grid has more columns, and the detail view shows the image on the left and the info on the right.
- **Masonry grid** with infinite scroll. Videos play on hover, and a `META` badge marks items with metadata.
- **Drag & drop** an artwork onto the canvas: onto a **Load Image** node it sets the image, onto a **prompt node** it inserts the prompt (the negative one if that node feeds a sampler's `negative` input), onto a **sampler** it sets seed/steps/CFG, and onto empty space it creates a new Load Image node there. In full width the panel fades out while dragging so you can reach the canvas.
- **Prompt history** (🕘 button in the header): the last 50 artworks whose prompts you sent to a node, newest first, shared by both tabs and stored on the server (`history.json`). Each entry can be inserted again (prompt + negative, prompt only, seed), copied, or opened in the detail view.
- **Quick button**: Hovering over an image shows a button. You choose what it does in the settings (⚙) under **Quick button on artworks**; the default is "Recreate in workflow…". All context-menu actions that insert something into the workflow are available.
- **Tooltip**: Resting on an image for a moment shows a compact preview: prompt (shortened), negative prompt, parameters, tags, reactions and user.
- **Context menu** (right-click on an image):
  - Prompt + negative → nodes, Prompt + negative + seed
  - Only prompt → node, Prompt + seed
  - Only negative → node, Negative + seed
  - Seed → sampler, Seed/steps/CFG → sampler, Load ComfyUI workflow
  - **Image → Load Image node**: downloads the original image into ComfyUI's `input` folder (as `civitai_<id>.<ext>`) and sets it in the selected Load Image node. If none is selected, it uses the first one in the workflow, and if there is none, it creates one. This works for images only, not videos, and is also available as a button in the detail view.
  - The quick button's action is shown in bold in the menu.
  - "Prompt + negative" respects the "None" target setting. The single and seed combinations always insert; if a target is set to "None", Auto is used for it. If an image has no seed, the combinations insert only the prompt.
  - Copy prompt, Copy seed, Copy all
  - Recreate in workflow…, Open details, Works by @user, Open on Civitai
  - **Save to collection** opens a submenu with all your collections; a checkmark shows where the image already is, and a click adds or removes it right away. The menu stays open, so you can tick several collections in a row. "New collection…" opens the detail view with the name field ready.
  - Entries for which the image has no data are greyed out.
- **Detail view** (click on an image): **←/→** (or the arrows next to "Back") go to the previous/next artwork and load more at the end; **Esc** goes back to the grid.
  - **Reactions** below the image: 👍 ❤️ 😂 😢 with counts, plus the number of comments (💬, opens the page on Civitai). With an API key your own reactions are highlighted, and a click sets or removes them directly on Civitai. This needs a key with write access ("Social: write"); a full-access key has it.
  - **Save to collection**: a list of your collections with checkmarks; a click adds or removes the image. Below it you can create a new collection right away, and the image goes straight into it.
  - Prompt and negative prompt, each with "Copy" and "→ Node"
  - "Prompt + negative → nodes" fills both at once
  - "Seed/steps/CFG → sampler"
  - "Load ComfyUI workflow", if the image has an embedded workflow
  - **Parameters** including the **checkpoint** actually used (model name and version, linked to the Civitai model page)
  - **Resources**, grouped into checkpoint, LoRAs (with weight) and other (embeddings, upscalers …), each linked to Civitai. Civitai supplies an image's model versions. If they are missing, the plugin looks them up by the hashes in the metadata. Anything that can't be resolved is shown in grey without a link.
  - All metadata as JSON, link to the image on Civitai
  - Clicking the **username** shows all works by that user.

### Local models, downloads and "Recreate in workflow"

**In the resources list** of the detail view, every checkpoint, LoRA, embedding etc. shows whether you already have it:
- **✓ green**: found in ComfyUI's model folders by its SHA256 hash
- **✓ yellow**: a file with the same name exists, but its hash wasn't checked
- **⬇**: not available locally. A click opens a small form to download it straight into ComfyUI: model type (for checkpoints `checkpoints` or `diffusion_models`), the model folder (all folders ComfyUI knows, including `extra_model_paths.yaml`; the one with the most models is preselected) and an optional subfolder. The choice is remembered per model type and base model. Progress is shown in the list, and the file is checked against Civitai's SHA256 afterwards. Civitai only allows downloads with an API key.

How the plugin finds your models without hashing everything: it first reads hashes that other tools already store next to the files (LoRA Manager `.metadata.json`, Stability Matrix `.cm-info.json`, `.sha256` files). Only files whose size exactly matches the Civitai file are hashed, once, and cached in `hashes.json`.

**Recreate in workflow…** (button below the resources, or in the context menu) opens a dialog listing what the image used and where it would go in your current workflow:

| Row | Possible targets |
|---|---|
| Checkpoint | every node with a dropdown that offers exactly this file (Load Checkpoint, UNET loader, custom loaders …) |
| LoRA | **LoRA Manager** loaders (`Lora Loader (LoraManager)`: the LoRAs are written into its text field and switched on with their weights; replaces the LoRAs in that node) · any loader with a `lora_name` dropdown · **new LoRA loaders** (inserted after the checkpoint and wired to everything the checkpoint fed) · `<lora:name:weight>` in the prompt · skip |
| Prompt / negative | the prompt targets from the settings |
| Sampler | seed (set to "fixed"), steps, CFG, sampler and scheduler (A1111 names like "DPM++ 2M Karras" are translated) |
| Size | the latent node feeding the sampler, or, if its width/height come from another node, that node: number nodes get the exact values, a **Resolution Selector** gets the closest aspect ratio and megapixels (the dialog shows the resulting size) |
| Clip skip | a `CLIP Set Last Layer` node, if present |

Every row can be switched off or pointed elsewhere; nothing changes until you click **Apply**. Missing models can be downloaded right in the dialog, and become selectable once the download is done. Missing LoRAs are switched off by default. The nodes you applied to are remembered and preselected next time: the same node if it's in the workflow, otherwise a node of the same type (for prompts only the same node, else the prompt settings apply).

### Which node receives the prompt?

In the settings (⚙) under **Insert prompts into** there are the fields **Prompt →** and **Negative →**. They apply to both panels, and the last selection is remembered. With **Auto**:

- **Positive**: the currently selected text/prompt node; if none is selected, the node connected to the sampler's `positive` input
- **Negative**: the node connected to the sampler's `negative` input

You can pick a fixed node from the list instead. If that node is missing in another workflow, the field behaves like **Auto**. With **None**, that prompt is never inserted, e.g. if you only want the positive prompt.

## Installation

**Via ComfyUI-Manager** (once the plugin is published in the Comfy Registry): search for "Civitai Discovery" in the Manager, install it and restart ComfyUI.

**Manually:**

```bash
cd ComfyUI/custom_nodes
git clone https://github.com/Euphonique/comfyui-civitai-discovery
```

Alternatively, copy or symlink the folder into `ComfyUI/custom_nodes/`. No extra Python packages are needed; ComfyUI already ships `aiohttp`. Then restart ComfyUI and reload the browser.

You need a recent ComfyUI frontend with sidebar tabs (roughly v1.3 or later).

## API key

1. On civitai.com, create a key under **Account Settings → API Keys**. A full-access key is fine. A restricted key needs at least:
   - **Collections: read** and **Media: read** for viewing
   - **Collections: write** for saving to collections and for creating, editing and deleting them
   - **User: read** and **Social: write** to see and set your own reactions
2. Click ⚙ in either panel, enter the key and save. The key applies to both panels.

The key is stored only on the server, in `config.json` in the plugin folder (file permissions `600`), and is never sent back to the browser. Alternatively, you can set the environment variable `CIVITAI_API_KEY`. When a key is set, the plugin sends it with every request, including the Discovery feed.

### Saved settings

All panel settings survive a ComfyUI restart and apply in every browser and on every device:

- **API key** in `config.json`
- **Dropdowns, filters and search** (selected collection, sort, period, base model, rating, domain, NSFW blur, selected tags, search text, tag cloud and "Advanced" open/closed, recently viewed users, target nodes for prompt/negative, quick button action) in `prefs.json`

Both files live in the plugin folder on the ComfyUI server. The browser only keeps a copy in case the server is unreachable. The prompt history is stored separately in `history.json`. Not saved: an open user or model view in Discovery and full width.

### civitai.com vs. civitai.red

Civitai only delivers content rated R and above via **civitai.red**. Through civitai.com the API limits requests to PG/PG-13. The settings (⚙) therefore have a **Domain** option that applies to both panels:

- **Auto** (default): civitai.red as soon as the selected rating includes R, X or XXX, otherwise civitai.com
- **civitai.com** or **civitai.red**: fixed domain

## Technical notes

- **Discovery** uses the public REST API (`GET /api/v1/images` with `sort`, `period`, `type`, `baseModels`, `username`, `tags`, `withTags`).
- **Text search** uses the tRPC procedure `semanticImageSearch.search`. Civitai enables it per feature flag for only some accounts, and it needs a full-access API key. If Civitai answers with 401/403, the plugin falls back to the prompt filter for the current session.
- **Tag suggestions and trending tags** come from the tRPC endpoints `tag.getAll` and `tag.getTrending` and therefore need an API key. The "In the results" tag cloud and the image tags work without a key.
- **Favorites**: The public API can't filter by collection. The plugin therefore uses the website's tRPC endpoints (`collection.getAllUser`, `image.getInfinite`), which accept an API key as a Bearer token. It then fetches the metadata for each page in one batch via `/api/v1/images?ids=…&withMeta=true`.
- **Reactions**: Counts come from the REST API (`stats`). The plugin reads your own reactions via `reaction.getMyImageReactions` and sets them via `reaction.toggle` (tRPC). Civitai sometimes updates the counters with a delay, so the plugin adjusts the display itself after a click.
- **Image → node** only downloads from `image.civitai.com` (no arbitrary URLs, 60 MB max) and saves into ComfyUI's `input` folder. An existing image with the same ID is reused.
- **Checkpoint and LoRAs** come from `GET /api/v1/model-versions/{id}` (for an image's `modelVersionIds`) or `/api/v1/model-versions/by-hash/{hash}`. The ComfyUI server caches the results until it restarts.
- **Write operations** use the tRPC mutations `collection.saveItem`, `collection.upsert` and `collection.delete`. The public API can only read collections.
- These tRPC endpoints are internal and may change without notice. If something breaks, the cause is usually in [`civitai_client.py`](civitai_client.py).
- **Downloads** only accept Civitai download URLs (`/api/download/models/…`) and only write into ComfyUI's model folders (no `..`, existing files are never overwritten). They run as background jobs on the server; a `.part` file is renamed after the SHA256 check.
- All requests go through the ComfyUI backend (`/civitai_discovery/*`). This avoids CORS issues and keeps the key on the server.
- The metadata filter runs in the browser (the API has no working filter for it). The plugin loads more pages automatically as needed: at most 5 in a row without matches, then via "Load more".
- Tested on Linux. Windows and macOS should work since the plugin is pure Python and JavaScript, but haven't been tested yet.

## Files

| File | Purpose |
|---|---|
| `__init__.py` | ComfyUI entry point, `WEB_DIRECTORY` |
| `civitai_routes.py` | HTTP routes in the ComfyUI server, API key storage |
| `civitai_client.py` | Civitai API client (REST + tRPC, read and write) |
| `local_models.py` | Which resources exist locally (hash matching, `hashes.json` cache) |
| `downloads.py` | Background downloads into the model folders |
| `web/civitai_discovery.js` | Both panels, filters, collection management, inserting into nodes (English/German depending on the ComfyUI language) |
| `web/civitai_discovery.css` | Styles (use ComfyUI's theme variables) |
| `web/base_models.json` | Base model → family mapping ("SDXL 1.0" → "Stable Diffusion XL"), generated from Civitai's `basemodel.constants.ts` |
