import { app } from "../../scripts/app.js";
import { api } from "../../scripts/api.js";

/*
 * Civitai Discovery for ComfyUI
 * Two sidebar tabs sharing one implementation:
 *   - "Civitai Discovery": the general Civitai image/video feed
 *   - "Civitai Favorites": your collections and reactions, with collection management
 * Both: metadata/base-model filters, one-click prompt insertion, save to collections.
 */
const API = "/civitai_discovery";

/* ------------------------------------------------------------------ i18n */
const STRINGS = {
  en: {
    titleFavorites: "Civitai Favorites",
    titleDiscovery: "Civitai Discovery",
    settings: "Settings",
    apiKey: "Civitai API key",
    apiKeyHint: "Create one at civitai.com → Account settings → API Keys. Stored on the ComfyUI server only. For managing collections the key needs write access.",
    save: "Save",
    remove: "Remove",
    cancel: "Cancel",
    keySaved: "API key saved",
    keyRemoved: "API key removed",
    keyFromEnv: "Using key from CIVITAI_API_KEY environment variable",
    keySet: "Key set",
    noKey: "No API key set. Open the settings (⚙) and add your Civitai API key.",
    needKey: "This needs a Civitai API key (⚙ settings).",
    redNoKey: "Without an API key, civitai.red may not return mature content. Add your key in the settings (⚙).",
    source: "Favorites",
    collections: "Collections",
    reactions: "My reactions",
    reaction_Like: "👍 Liked",
    reaction_Heart: "❤️ Loved",
    reaction_Laugh: "😂 Laughed",
    reaction_Cry: "😢 Cried",
    meta: "Metadata",
    metaAll: "All",
    metaWith: "With metadata",
    metaPrompt: "With prompt",
    metaWithout: "Without metadata",
    media: "Media",
    mediaAll: "All",
    mediaImage: "Images",
    mediaVideo: "Videos",
    rating: "Rating",
    blurNsfw: "Blur NSFW",
    sort: "Sort",
    sortNewest: "Newest",
    sortAdded: "Recently added",
    sortOldest: "Oldest",
    sortReactions: "Most reactions",
    sortComments: "Most comments",
    sortCollected: "Most collected",
    period: "Period",
    period_Day: "Day",
    period_Week: "Week",
    period_Month: "Month",
    period_Year: "Year",
    period_AllTime: "All time",
    refresh: "Reload",
    posTarget: "Prompt →",
    negTarget: "Negative →",
    auto: "Auto",
    loading: "Loading…",
    loadMore: "Load more",
    empty: "Nothing found.",
    emptyFiltered: "No items match the filter (yet).",
    loaded: "{shown} of {loaded} loaded",
    back: "← Back",
    prompt: "Prompt",
    negative: "Negative prompt",
    params: "Parameters",
    resources: "Resources",
    rawMeta: "All metadata (JSON)",
    noMeta: "This item has no generation metadata.",
    toNode: "→ Node",
    copy: "Copy",
    copyAll: "Copy all",
    copied: "Copied to clipboard",
    applyBoth: "Prompt + negative → nodes",
    applySampler: "Seed/steps/CFG → sampler",
    loadWorkflow: "Load ComfyUI workflow",
    confirmWorkflow: "Replace the current workflow with the one embedded in this image?",
    openCivitai: "Open on Civitai",
    insertedInto: "Inserted into “{node}”",
    noTarget: "No prompt node found. Select a text/prompt node or pick a target.",
    noSampler: "No sampler node (with seed/steps/cfg) found.",
    samplerApplied: "Applied to “{node}”",
    quickPrompt: "Insert prompt",
    hasMeta: "has metadata",
    video: "Video",
    baseModel: "Base model",
    bmAll: "All",
    bmUnknown: "Unknown",
    bmPopular: "Popular",
    bmOther: "More",
    users: "Users",
    showUser: "Show all works by {user}",
    backToFavs: "← Back to favorites",
    backToFeed: "← Back to feed",
    userView: "Works by {user}",
    domain: "Domain",
    domainAuto: "Auto (civitai.red for R/X/XXX)",
    domainHint: "Civitai only delivers mature content via civitai.red; civitai.com is limited to PG/PG-13.",
    // collections
    saveToCollection: "Save to collection",
    inCollections: "In {n} collection(s)",
    newCollection: "New collection",
    editCollection: "Edit collection",
    deleteCollection: "Delete collection",
    name: "Name",
    description: "Description",
    privacy: "Visibility",
    read_Private: "Private",
    read_Unlisted: "Unlisted",
    read_Public: "Public",
    create: "Create",
    created: "Collection “{name}” created",
    updated: "Collection “{name}” saved",
    deleted: "Collection “{name}” deleted",
    confirmDelete: "Delete the collection “{name}” on Civitai? This cannot be undone. (The images themselves are not deleted.)",
    addedTo: "Added to “{name}”",
    removedFrom: "Removed from “{name}”",
    onlyOwn: "Only your own collections can be edited.",
    noOwnCollections: "You have no collections of your own yet.",
    newCollectionPlaceholder: "Name of the new collection",
    checkpoint: "Checkpoint",
    loras: "LoRAs",
    otherResources: "Other",
    fullWidth: "Full width",
    searchPlaceholder: "#tag, @user or text…",
    none: "None",
    targetsLabel: "Insert prompts into",
    targetsHint: "Auto: positive → selected text node or the sampler's positive input; negative → the sampler's negative input. “None” skips that prompt.",
    targetNone: "{kind} is set to “None” (⚙ settings).",
    targetMissing: "not in this workflow",
    semanticSearch: "Search “{q}”",
    semanticUnavailable: "Civitai's text search isn't enabled for your account/API key (it needs a full-access key and is still being rolled out). Falling back to filtering the prompts of the loaded images.",
    emptyFilters: "No results for this combination of filters.",
    widenPeriod: "Period: all time",
    resetFilters: "Reset search & filters",
    search: "Search",
    tagCloud: "Tags",
    tagsInResults: "In the results",
    trendingTags: "Trending on Civitai",
    promptContains: "Prompt contains “{q}”",
    searchInPrompt: "Search in prompts: “{q}”",
    searchUser: "Works by @{q}",
    clearAll: "Clear all",
    tags: "Tags",
    tagHint: "Click to search for this tag",
    textFilterHint: "Civitai has no full-text image search; this filters the prompts of the loaded images.",
    tagNotFound: "Tag not found: {tags}. Searching it as text instead.",
    advanced: "Advanced",
    ctxBoth: "Prompt + negative → nodes",
    ctxBothSeed: "Prompt + negative + seed",
    comments: "Comments (opens Civitai)",
    reactionFailed: "Reaction could not be saved",
    ctxImage: "Image → Load Image node",
    imageLoading: "Downloading image…",
    imageInserted: "Image set in “{node}”",
    imageFailed: "Could not import the image",
    ctxPosSeed: "Prompt + seed",
    ctxNegSeed: "Negative + seed",
    quickAction: "Quick button on artworks",
    quickActionHint: "What the button that appears when hovering an artwork does. Also shown in bold in the right-click menu.",
    noData: "This artwork has no data for this action.",
    ctxPositive: "Only prompt → node",
    ctxNegative: "Only negative → node",
    ctxSeed: "Seed → sampler",
    ctxCopyPrompt: "Copy prompt",
    ctxCopySeed: "Copy seed",
    ctxDetails: "Open details",
    ctxSave: "Save to collection…",
    ctxUser: "Works by @{user}",
    trendingNeedsKey: "Trending tags and searching all Civitai tags need an API key (⚙).",
    noTagsYet: "No tags in the loaded results yet.",
    normalWidth: "Back to sidebar width",
  },
  de: {
    titleFavorites: "Civitai Favoriten",
    titleDiscovery: "Civitai Discovery",
    settings: "Einstellungen",
    apiKey: "Civitai API-Key",
    apiKeyHint: "Erstellen unter civitai.com → Account Settings → API Keys. Wird nur auf dem ComfyUI-Server gespeichert. Zum Verwalten von Collections braucht der Key Schreibrechte.",
    save: "Speichern",
    remove: "Entfernen",
    cancel: "Abbrechen",
    keySaved: "API-Key gespeichert",
    keyRemoved: "API-Key entfernt",
    keyFromEnv: "Key aus Umgebungsvariable CIVITAI_API_KEY",
    keySet: "Key gesetzt",
    noKey: "Kein API-Key gesetzt. Öffne die Einstellungen (⚙) und trage deinen Civitai API-Key ein.",
    needKey: "Dafür wird ein Civitai API-Key benötigt (⚙ Einstellungen).",
    redNoKey: "Ohne API-Key liefert civitai.red evtl. keine Inhalte ab R. Trage deinen Key in den Einstellungen (⚙) ein.",
    source: "Favoriten",
    collections: "Collections",
    reactions: "Meine Reaktionen",
    reaction_Like: "👍 Geliked",
    reaction_Heart: "❤️ Geherzt",
    reaction_Laugh: "😂 Gelacht",
    reaction_Cry: "😢 Geweint",
    meta: "Metadaten",
    metaAll: "Alle",
    metaWith: "Mit Metadaten",
    metaPrompt: "Mit Prompt",
    metaWithout: "Ohne Metadaten",
    media: "Medien",
    mediaAll: "Alle",
    mediaImage: "Bilder",
    mediaVideo: "Videos",
    rating: "Rating",
    blurNsfw: "NSFW verpixeln",
    sort: "Sortierung",
    sortNewest: "Neueste",
    sortAdded: "Zuletzt hinzugefügt",
    sortOldest: "Älteste",
    sortReactions: "Meiste Reaktionen",
    sortComments: "Meiste Kommentare",
    sortCollected: "Am häufigsten gesammelt",
    period: "Zeitraum",
    period_Day: "Tag",
    period_Week: "Woche",
    period_Month: "Monat",
    period_Year: "Jahr",
    period_AllTime: "Gesamt",
    refresh: "Neu laden",
    posTarget: "Prompt →",
    negTarget: "Negativ →",
    auto: "Auto",
    loading: "Lade…",
    loadMore: "Mehr laden",
    empty: "Nichts gefunden.",
    emptyFiltered: "(Noch) keine Einträge passend zum Filter.",
    loaded: "{shown} von {loaded} geladen",
    back: "← Zurück",
    prompt: "Prompt",
    negative: "Negativ-Prompt",
    params: "Parameter",
    resources: "Ressourcen",
    rawMeta: "Alle Metadaten (JSON)",
    noMeta: "Dieser Eintrag hat keine Generierungs-Metadaten.",
    toNode: "→ Node",
    copy: "Kopieren",
    copyAll: "Alles kopieren",
    copied: "In die Zwischenablage kopiert",
    applyBoth: "Prompt + Negativ → Nodes",
    applySampler: "Seed/Steps/CFG → Sampler",
    loadWorkflow: "ComfyUI-Workflow laden",
    confirmWorkflow: "Aktuellen Workflow durch den im Bild eingebetteten ersetzen?",
    openCivitai: "Auf Civitai öffnen",
    insertedInto: "Eingefügt in „{node}“",
    noTarget: "Kein Prompt-Node gefunden. Wähle einen Text-/Prompt-Node aus oder setze ein Ziel.",
    noSampler: "Kein Sampler-Node (mit seed/steps/cfg) gefunden.",
    samplerApplied: "Übernommen in „{node}“",
    quickPrompt: "Prompt einfügen",
    hasMeta: "hat Metadaten",
    video: "Video",
    baseModel: "Basismodell",
    bmAll: "Alle",
    bmUnknown: "Unbekannt",
    bmPopular: "Beliebt",
    bmOther: "Weitere",
    users: "Benutzer",
    showUser: "Alle Werke von {user} anzeigen",
    backToFavs: "← Zurück zu den Favoriten",
    backToFeed: "← Zurück zum Feed",
    userView: "Werke von {user}",
    domain: "Domain",
    domainAuto: "Auto (civitai.red bei R/X/XXX)",
    domainHint: "Civitai liefert Inhalte ab R nur über civitai.red aus; civitai.com ist auf PG/PG-13 beschränkt.",
    saveToCollection: "In Collection speichern",
    inCollections: "In {n} Collection(s)",
    newCollection: "Neue Collection",
    editCollection: "Collection bearbeiten",
    deleteCollection: "Collection löschen",
    name: "Name",
    description: "Beschreibung",
    privacy: "Sichtbarkeit",
    read_Private: "Privat",
    read_Unlisted: "Nicht gelistet",
    read_Public: "Öffentlich",
    create: "Erstellen",
    created: "Collection „{name}“ erstellt",
    updated: "Collection „{name}“ gespeichert",
    deleted: "Collection „{name}“ gelöscht",
    confirmDelete: "Collection „{name}“ auf Civitai löschen? Das kann nicht rückgängig gemacht werden. (Die Bilder selbst werden nicht gelöscht.)",
    addedTo: "Zu „{name}“ hinzugefügt",
    removedFrom: "Aus „{name}“ entfernt",
    onlyOwn: "Nur eigene Collections können bearbeitet werden.",
    noOwnCollections: "Du hast noch keine eigenen Collections.",
    newCollectionPlaceholder: "Name der neuen Collection",
    checkpoint: "Checkpoint",
    loras: "LoRAs",
    otherResources: "Sonstige",
    fullWidth: "Volle Breite",
    searchPlaceholder: "#Tag, @User oder Text…",
    none: "Keiner",
    targetsLabel: "Prompts einfügen in",
    targetsHint: "Auto: Positiv → ausgewählter Text-Node bzw. positiver Eingang des Samplers; Negativ → negativer Eingang des Samplers. „Keiner“ überspringt diesen Prompt.",
    targetNone: "{kind} ist auf „Keiner“ gestellt (⚙ Einstellungen).",
    targetMissing: "nicht im Workflow",
    semanticSearch: "Suche „{q}“",
    semanticUnavailable: "Die Civitai-Textsuche ist für deinen Account/API-Key nicht freigeschaltet (sie braucht einen Key mit vollem Zugriff und wird noch schrittweise eingeführt). Stattdessen werden die Prompts der geladenen Bilder gefiltert.",
    emptyFilters: "Keine Treffer für diese Kombination von Filtern.",
    widenPeriod: "Zeitraum: Gesamt",
    resetFilters: "Suche & Filter zurücksetzen",
    search: "Suchen",
    tagCloud: "Tags",
    tagsInResults: "In den Ergebnissen",
    trendingTags: "Trending auf Civitai",
    promptContains: "Prompt enthält „{q}“",
    searchInPrompt: "In Prompts suchen: „{q}“",
    searchUser: "Werke von @{q}",
    clearAll: "Alle entfernen",
    tags: "Tags",
    tagHint: "Klicken, um nach diesem Tag zu suchen",
    textFilterHint: "Civitai hat keine Volltextsuche für Bilder; das filtert die Prompts der geladenen Bilder.",
    tagNotFound: "Tag nicht gefunden: {tags}. Wird stattdessen als Text gesucht.",
    advanced: "Erweitert",
    ctxBoth: "Prompt + Negativ → Nodes",
    ctxBothSeed: "Prompt + Negativ + Seed",
    comments: "Kommentare (öffnet Civitai)",
    reactionFailed: "Reaktion konnte nicht gespeichert werden",
    ctxImage: "Bild → Load-Image-Node",
    imageLoading: "Lade Bild…",
    imageInserted: "Bild in „{node}“ gesetzt",
    imageFailed: "Bild konnte nicht übernommen werden",
    ctxPosSeed: "Prompt + Seed",
    ctxNegSeed: "Negativ + Seed",
    quickAction: "Schnell-Button auf den Bildern",
    quickActionHint: "Was der Button macht, der beim Drüberfahren über ein Bild erscheint. Steht im Rechtsklick-Menü fett.",
    noData: "Für diese Aktion hat das Bild keine Daten.",
    ctxPositive: "Nur Prompt → Node",
    ctxNegative: "Nur Negativ → Node",
    ctxSeed: "Seed → Sampler",
    ctxCopyPrompt: "Prompt kopieren",
    ctxCopySeed: "Seed kopieren",
    ctxDetails: "Details öffnen",
    ctxSave: "In Collection speichern…",
    ctxUser: "Werke von @{user}",
    trendingNeedsKey: "Trending-Tags und die Suche in allen Civitai-Tags brauchen einen API-Key (⚙).",
    noTagsYet: "In den geladenen Ergebnissen gibt es noch keine Tags.",
    normalWidth: "Zurück zur Seitenleiste",
  },
};

function locale() {
  try {
    const l = app.extensionManager?.setting?.get?.("Comfy.Locale") || navigator.language || "en";
    return String(l).toLowerCase().startsWith("de") ? "de" : "en";
  } catch {
    return "en";
  }
}
function t(key, vars) {
  let s = (STRINGS[locale()] || STRINGS.en)[key] ?? STRINGS.en[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v);
  return s;
}

/* --------------------------------------------------------------- helpers */
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
    else if (k in el && typeof v !== "string") el[k] = v;
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

function toast(severity, summary, detail) {
  const tm = app.extensionManager?.toast;
  if (tm?.add) tm.add({ severity, summary, detail, life: severity === "error" ? 6000 : 2500 });
  else if (severity === "error") alert(`${summary}\n${detail || ""}`);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = h("textarea", { style: { position: "fixed", opacity: "0" } });
    ta.value = text;
    document.body.append(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  toast("success", t("copied"));
}

async function fetchJson(path, opts) {
  const res = await api.fetchApi(path, opts);
  let data = null;
  try {
    data = await res.json();
  } catch {}
  if (!res.ok) {
    const err = new Error(data?.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

/* ------------------------------------------------------------ base models */
// Civitai base model name -> ecosystem/family ("SDXL 1.0" -> "Stable Diffusion XL").
// Generated from Civitai's basemodel.constants.ts; unknown names are shown as-is.
let BASE_MODEL_GROUPS = {};
async function loadBaseModelGroups() {
  try {
    const res = await fetch(new URL("./base_models.json", import.meta.url));
    if (res.ok) BASE_MODEL_GROUPS = await res.json();
  } catch {}
}
const UNKNOWN_BM = "__unknown";
function baseModelGroup(item) {
  if (!item.baseModel) return UNKNOWN_BM;
  return BASE_MODEL_GROUPS[item.baseModel] || item.baseModel;
}

/* ------------------------------------------------------ graph integration */
const TEXT_WIDGET_NAMES = ["text", "prompt", "positive", "negative", "text_g", "text_l", "string", "value"];

function graphNodes() {
  const g = app.graph;
  return (g?._nodes || g?.nodes || []).slice();
}
function getLink(id) {
  const links = app.graph?.links;
  if (!links || id == null) return null;
  return typeof links.get === "function" ? links.get(id) : links[id];
}
function textWidget(node) {
  const ws = node?.widgets || [];
  const multiline = ws.filter(
    (w) => typeof w.value === "string" && (w.type === "customtext" || w.options?.multiline || w.inputEl?.tagName === "TEXTAREA")
  );
  if (multiline.length) return multiline[0];
  return ws.find((w) => typeof w.value === "string" && TEXT_WIDGET_NAMES.includes(w.name)) || null;
}
function nodeLabel(node) {
  return `#${node.id} ${node.title || node.type}`;
}
function promptNodes() {
  return graphNodes().filter((n) => textWidget(n));
}
function selectedTextNode() {
  const sel = Object.values(app.canvas?.selected_nodes || {});
  return sel.find((n) => textWidget(n)) || null;
}
/** Follows a sampler's `positive`/`negative` input back to a node with a text widget. */
function samplerConditioningNode(kind) {
  for (const node of graphNodes()) {
    const input = node.inputs?.find((i) => i.name === kind && i.link != null);
    if (!input) continue;
    let link = getLink(input.link);
    // walk through reroutes / simple pass-through nodes (max 5 hops)
    for (let hop = 0; link && hop < 5; hop++) {
      const origin = app.graph.getNodeById(link.origin_id);
      if (!origin) break;
      if (textWidget(origin)) return origin;
      const next = origin.inputs?.find((i) => i.link != null);
      link = next ? getLink(next.link) : null;
    }
  }
  return null;
}
function resolveTarget(kind, explicitId) {
  if (explicitId === "none") return "none";
  if (explicitId) {
    const n = app.graph.getNodeById(Number(explicitId));
    if (n && textWidget(n)) return n;
  }
  if (kind === "positive") {
    return selectedTextNode() || samplerConditioningNode("positive");
  }
  return samplerConditioningNode("negative");
}
function setNodeText(node, text) {
  const w = textWidget(node);
  if (!w) return false;
  w.value = text;
  if (w.inputEl) w.inputEl.value = text;
  try {
    w.callback?.(text, app.canvas, node);
  } catch {}
  node.onWidgetChanged?.(w.name, text, undefined, w);
  app.graph.setDirtyCanvas(true, true);
  try {
    app.graph.change?.();
  } catch {}
  return true;
}
/** A node with a combo widget named "image" (Load Image and friends). */
function imageWidget(node) {
  return node?.widgets?.find((w) => w.name === "image" && Array.isArray(w.options?.values)) || null;
}
function findOrCreateLoadImage() {
  const sel = Object.values(app.canvas?.selected_nodes || {}).find(imageWidget);
  if (sel) return sel;
  const existing = graphNodes().find((n) => n.type === "LoadImage" && imageWidget(n)) || graphNodes().find(imageWidget);
  if (existing) return existing;
  const LG = window.LiteGraph;
  const node = LG?.createNode?.("LoadImage");
  if (!node) throw new Error("LoadImage node not available");
  // middle of the visible canvas (the left part may be covered by the sidebar)
  const ds = app.canvas.ds;
  const rect = app.canvas.canvas.getBoundingClientRect();
  node.pos = [(rect.width * 0.55) / ds.scale - ds.offset[0] - node.size[0] / 2, (rect.height * 0.35) / ds.scale - ds.offset[1]];
  app.graph.add(node);
  try {
    app.canvas.selectNode(node);
  } catch {}
  return node;
}
function findSampler() {
  const sel = Object.values(app.canvas?.selected_nodes || {});
  const isSampler = (n) => n.widgets?.some((w) => w.name === "steps") && n.widgets?.some((w) => w.name === "cfg");
  return sel.find(isSampler) || graphNodes().find(isSampler) || null;
}

/* ------------------------------------------------------- shared state */
/** Config (API key status) and the collection list, shared by both tabs. */
const shared = {
  config: null,
  domain: "auto",
  _collections: null,
  listeners: new Set(),
  async loadConfig() {
    this.config = await fetchJson(`${API}/config`);
    return this.config;
  },
  setConfig(cfg) {
    this.config = cfg;
    this.invalidate("key");
  },
  /** {collections, reactions}; cached until invalidate(). */
  getCollections(force = false) {
    if (force || !this._collections) {
      this._collections = fetchJson(`${API}/collections?domain=${encodeURIComponent(this.domain)}`).catch((e) => {
        this._collections = null;
        throw e;
      });
    }
    return this._collections;
  },
  async ownCollections() {
    const data = await this.getCollections();
    return (data.collections || []).filter((c) => c.owned);
  },
  /** Collections changed (or key changed): refetch lazily and tell every panel. */
  invalidate(origin) {
    this._collections = null;
    for (const fn of this.listeners) fn(origin);
  },
};

function prefsKey(mode) {
  return `civitaiDiscovery.${mode}`;
}
/*
 * UI settings live on the ComfyUI server (prefs.json), so they survive restarts
 * and are the same in every browser. localStorage is only a fallback/cache for
 * when the server can't be reached, and the source for a one-time migration.
 */
let serverPrefs = null; // {discovery: {...}, favorites: {...}}; null = server unavailable
let prefsTimer = null;
async function loadServerPrefs() {
  try {
    const data = await fetchJson(`${API}/prefs`);
    serverPrefs = data && typeof data === "object" ? data : {};
  } catch {
    serverPrefs = null;
  }
}
function localPrefs(mode) {
  try {
    const p = JSON.parse(localStorage.getItem(prefsKey(mode)));
    if (p) return p;
    // migrate settings from the plugin's former name
    if (mode === "favorites") return JSON.parse(localStorage.getItem("civitaiFavorites.state")) || {};
  } catch {}
  return {};
}
function loadPrefs(mode) {
  const sp = serverPrefs?.[mode];
  if (sp && Object.keys(sp).length) return sp;
  const lp = localPrefs(mode);
  if (serverPrefs && Object.keys(lp).length) savePrefs(mode, lp); // first run: move to the server
  return lp;
}
function flushPrefs(keepalive = false) {
  clearTimeout(prefsTimer);
  prefsTimer = null;
  if (!serverPrefs) return;
  api
    .fetchApi(`${API}/prefs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serverPrefs),
      keepalive,
    })
    .catch(() => {});
}
function savePrefs(mode, p) {
  try {
    localStorage.setItem(prefsKey(mode), JSON.stringify(p));
  } catch {}
  if (!serverPrefs) return;
  serverPrefs[mode] = p;
  clearTimeout(prefsTimer);
  prefsTimer = setTimeout(() => flushPrefs(), 400);
}
// don't lose a change made right before closing/reloading the tab
window.addEventListener("pagehide", () => prefsTimer && flushPrefs(true));

async function postJson(path, body, method = "POST") {
  return fetchJson(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

/* ------------------------------------------------------------- the panel */
const NSFW_LEVELS = [
  { v: 1, label: "PG" },
  { v: 3, label: "PG-13" },
  { v: 7, label: "R" },
  { v: 15, label: "X" },
  { v: 31, label: "XXX" },
];
const POPULAR_FAMILIES = [
  "Stable Diffusion 1.x",
  "Stable Diffusion XL",
  "Pony Diffusion",
  "Illustrious",
  "NoobAI",
  "Flux.1",
  "Flux.1 Krea",
  "Flux.2",
  "Krea 2",
  "Qwen",
  "ZImageTurbo",
  "Chroma",
  "Wan Video",
  "Hunyuan Video",
  "LTX Video 2",
];
/** family -> [base model names], from BASE_MODEL_GROUPS */
function familyModels() {
  const fam = new Map();
  for (const [bm, f] of Object.entries(BASE_MODEL_GROUPS)) {
    if (!fam.has(f)) fam.set(f, []);
    fam.get(f).push(bm);
  }
  return fam;
}

class BrowserPanel {
  /** mode: "favorites" | "discovery" */
  constructor(mode) {
    this.mode = mode;
    this.isFav = mode === "favorites";
    const p = loadPrefs(mode);
    const common = loadPrefs("common");
    this.state = {
      source: p.source || "",
      metaFilter: p.metaFilter || "all",
      mediaFilter: p.mediaFilter || "all",
      browsingLevel: p.browsingLevel ?? 31,
      blurNsfw: p.blurNsfw ?? true,
      sort: p.sort || (this.isFav ? "Newest" : "Most Reactions"),
      period: p.period || "Week",
      domain: p.domain || shared.domain || "auto",
      bmFilter: p.bmFilter || "all",
      recentUsers: Array.isArray(p.recentUsers) ? p.recentUsers : [],
      lastFavSource: p.lastFavSource || "",
      tags: Array.isArray(p.tags) ? p.tags.filter((x) => x && Number.isInteger(x.id)) : [],
      textFilter: typeof p.textFilter === "string" ? p.textFilter : "",
      cloudOpen: !!p.cloudOpen,
      advancedOpen: !!p.advancedOpen,
      user: "", // discovery: currently shown user (not persisted)
      // prompt targets are shared by both tabs: "" = auto, "none", or a node id
      posTarget: typeof common.posTarget === "string" ? common.posTarget : "",
      negTarget: typeof common.negTarget === "string" ? common.negTarget : "",
      quickAction: typeof common.quickAction === "string" ? common.quickAction : "pos",
    };
    shared.domain = this.state.domain;
    this.items = [];
    this.cursor = null;
    this.hasMore = false;
    this.loading = false;
    this.requestId = 0;
    this.removedIds = new Set();
    this.knownTags = new Map(); // id -> {id, name, count}: tags seen in loaded results
    this.root = this.build();
    shared.listeners.add((origin) => this.onSharedChange(origin));
  }

  persist() {
    this.updateAdvancedBadge?.();
    const keys = ["source", "metaFilter", "mediaFilter", "browsingLevel", "blurNsfw", "sort", "period", "domain", "bmFilter", "recentUsers", "lastFavSource", "tags", "textFilter", "cloudOpen", "advancedOpen"];
    savePrefs(this.mode, Object.fromEntries(keys.map((k) => [k, this.state[k]])));
  }

  /* ---------- DOM ---------- */
  build() {
    const select = (key, options, onChange) => {
      const el = h("select", {
        onchange: (e) => {
          this.state[key] = e.target.value;
          this.persist();
          onChange?.();
        },
      });
      for (const o of options) el.append(h("option", { value: o.v }, o.label));
      el.value = String(this.state[key]);
      return el;
    };
    const field = (label, el) => h("label", { class: "cf-field" }, h("span", {}, label), el);

    // settings (shared API key + domain)
    this.keyInput = h("input", { type: "password", placeholder: "••••••••••••", autocomplete: "off" });
    this.keyStatus = h("div", { class: "cf-hint" });
    this.domainSelect = select(
      "domain",
      [
        { v: "auto", label: t("domainAuto") },
        { v: "com", label: "civitai.com" },
        { v: "red", label: "civitai.red" },
      ],
      () => {
        // the domain is shared by both tabs
        shared.domain = this.state.domain;
        for (const p of panels.values()) {
          if (p !== this) {
            p.state.domain = this.state.domain;
            p.domainSelect.value = this.state.domain;
            p.persist();
          }
          if (!p.initialized) continue;
          if (p.isFav) {
            if (shared.config?.hasKey) p.loadSources(true);
          } else p.reload();
        }
      }
    );
    this.settingsBox = h(
      "div",
      { class: "cf-settings", hidden: true },
      h("label", {}, t("apiKey")),
      h(
        "div",
        { class: "cf-row" },
        this.keyInput,
        h("button", { class: "cf-btn primary", onclick: () => this.saveKey(this.keyInput.value) }, t("save")),
        h("button", { class: "cf-btn", onclick: () => this.saveKey("") }, t("remove"))
      ),
      this.keyStatus,
      h("div", { class: "cf-hint" }, t("apiKeyHint")),
      h("label", {}, t("domain")),
      this.domainSelect,
      h("div", { class: "cf-hint" }, t("domainHint"))
    );

    // filters
    const metaSel = (this.metaSel = select(
      "metaFilter",
      [
        { v: "all", label: t("metaAll") },
        { v: "with", label: t("metaWith") },
        { v: "prompt", label: t("metaPrompt") },
        { v: "without", label: t("metaWithout") },
      ],
      () => this.renderGrid()
    ));
    const mediaSel = (this.mediaSel = select(
      "mediaFilter",
      [
        { v: "all", label: t("mediaAll") },
        { v: "image", label: t("mediaImage") },
        { v: "video", label: t("mediaVideo") },
      ],
      // discovery filters media server-side
      () => (this.isFav ? this.renderGrid() : this.reload())
    ));
    const levelSel = select("browsingLevel", NSFW_LEVELS, () => this.reload());
    const sortSel = select(
      "sort",
      this.isFav
        ? [
            { v: "Newest", label: t("sortNewest") },
            { v: "Recently Added", label: t("sortAdded") },
            { v: "Oldest", label: t("sortOldest") },
            { v: "Most Reactions", label: t("sortReactions") },
          ]
        : [
            { v: "Most Reactions", label: t("sortReactions") },
            { v: "Most Comments", label: t("sortComments") },
            { v: "Most Collected", label: t("sortCollected") },
            { v: "Newest", label: t("sortNewest") },
          ],
      () => this.reload()
    );
    const periodSel = (this.periodSel = select(
      "period",
      ["Day", "Week", "Month", "Year", "AllTime"].map((v) => ({ v, label: t(`period_${v}`) })),
      () => this.reload()
    ));
    const blur = h("input", {
      type: "checkbox",
      checked: this.state.blurNsfw,
      onchange: (e) => {
        this.state.blurNsfw = e.target.checked;
        this.persist();
        this.root.classList.toggle("cf-blur", this.state.blurNsfw);
      },
    });
    this.bmSelect = h("select", {
      onchange: (e) => {
        this.state.bmFilter = e.target.value;
        this.persist();
        this.isFav ? this.renderGrid() : this.reload();
      },
    });

    const targetSelect = (key) =>
      h("select", {
        onfocus: () => this.fillTargets(),
        onmousedown: () => this.fillTargets(),
        // remembered and shared by both tabs
        onchange: (e) => {
          for (const p of new Set([this, ...panels.values()])) {
            p.state[key] = e.target.value;
            p.fillTargets();
          }
          this.saveCommon();
        },
      });
    this.posSelect = targetSelect("posTarget");
    this.negSelect = targetSelect("negTarget");

    this.statusLine = h("div", { class: "cf-status" });
    this.grid = h("div", { class: "cf-grid" });
    this.sentinel = h("div", { class: "cf-sentinel" });
    this.moreBtn = h("button", { class: "cf-btn cf-more", hidden: true, onclick: () => this.loadPage(false) }, t("loadMore"));
    this.message = h("div", { class: "cf-message", hidden: true });
    this.emptyActions = h("div", { class: "cf-empty-actions", hidden: true });
    this.notice = h("div", { class: "cf-notice", hidden: true });
    this.listView = h("div", { class: "cf-list" }, h("div", { class: "cf-scroll" }, this.message, this.emptyActions, this.grid, this.moreBtn, this.sentinel));
    this.detailView = h("div", { class: "cf-detail", hidden: true });

    this.userLabel = h("span", { class: "cf-grow" });
    this.userBar = h(
      "div",
      { class: "cf-userbar", hidden: true },
      h("button", { class: "cf-btn", onclick: () => this.backFromUser() }, this.isFav ? t("backToFavs") : t("backToFeed")),
      this.userLabel
    );

    // favorites: source + collection management
    let sourceRow = null;
    if (this.isFav) {
      this.sourceSelect = h("select", { class: "cf-source", onchange: (e) => this.setSource(e.target.value) });
      this.editBtn = h("button", { class: "cf-icon", title: t("editCollection"), onclick: () => this.openCollectionForm(this.currentCollection()) }, h("i", { class: "pi pi-pencil" }));
      this.delBtn = h("button", { class: "cf-icon", title: t("deleteCollection"), onclick: () => this.deleteCollection(this.currentCollection()) }, h("i", { class: "pi pi-trash" }));
      sourceRow = field(
        t("source"),
        h(
          "div",
          { class: "cf-row cf-source-row" },
          this.sourceSelect,
          h("button", { class: "cf-icon", title: t("newCollection"), onclick: () => this.openCollectionForm(null) }, h("i", { class: "pi pi-plus" })),
          this.editBtn,
          this.delBtn
        )
      );
      this.formBox = h("div", { class: "cf-settings", hidden: true });
    }

    const icon = this.isFav ? "pi pi-heart" : "pi pi-compass";
    const title = this.isFav ? t("titleFavorites") : t("titleDiscovery");
    const root = h(
      "div",
      { class: "civitai-favorites" + (this.state.blurNsfw ? " cf-blur" : "") },
      h(
        "div",
        { class: "cf-header" },
        h("span", { class: "cf-title" }, h("i", { class: icon }), " ", title),
        (this.fullBtn = h("button", { class: "cf-icon", title: t("fullWidth"), onclick: () => this.toggleFull() }, h("i", { class: "pi pi-window-maximize" }))),
        h("button", { class: "cf-icon", title: t("refresh"), onclick: () => this.init(true) }, h("i", { class: "pi pi-refresh" })),
        h("button", { class: "cf-icon", title: t("settings"), onclick: () => (this.settingsBox.hidden = !this.settingsBox.hidden) }, h("i", { class: "pi pi-cog" }))
      ),
      this.settingsBox,
      this.formBox,
      h(
        "div",
        { class: "cf-controls" },
        sourceRow,
        this.buildSearch(),
        // main filters in one row
        h(
          "div",
          { class: this.isFav ? "cf-row2" : "cf-row3" },
          field(t("sort"), sortSel),
          this.isFav ? null : field(t("period"), periodSel),
          field(t("baseModel"), this.bmSelect)
        ),
        // the rest collapsed under "Advanced"
        (this.advToggle = h(
          "button",
          { class: "cf-adv-toggle", onclick: () => this.toggleAdvanced() },
          h("i", { class: this.state.advancedOpen ? "pi pi-chevron-down" : "pi pi-chevron-right" }),
          h("span", {}, t("advanced"))
        )),
        (this.advBox = h(
          "div",
          { class: "cf-adv", hidden: !this.state.advancedOpen },
          h("div", { class: "cf-row3" }, field(t("media"), mediaSel), field(t("meta"), metaSel), field(t("rating"), levelSel)),
          h("label", { class: "cf-check" }, blur, " ", t("blurNsfw"))
        ))
      ),
      this.notice,
      this.userBar,
      this.statusLine,
      this.listView,
      this.detailView
    );

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && this.hasMore && !this.loading && (this.autoPages || 0) < 5) this.loadPage(true);
      },
      { root: this.listView.querySelector(".cf-scroll"), rootMargin: "400px" }
    );
    this.observer.observe(this.sentinel);
    this.resetGrid();
    new ResizeObserver(() => this.relayout()).observe(this.grid);
    this.updateAdvancedBadge();
    this.quickSelect = h("select", {
      onchange: (e) => {
        for (const p of new Set([this, ...panels.values()])) {
          p.state.quickAction = e.target.value;
          p.quickSelect.value = e.target.value;
          p.renderGrid(); // re-create the hover buttons
        }
        this.saveCommon();
      },
    });
    for (const a of ACTION_KEYS) this.quickSelect.append(h("option", { value: a.key }, t(a.label)));
    this.quickSelect.value = this.state.quickAction;
    this.settingsBox.append(
      h("label", {}, t("targetsLabel")),
      h("div", { class: "cf-row2" }, field(t("posTarget"), this.posSelect), field(t("negTarget"), this.negSelect)),
      h("div", { class: "cf-hint" }, t("targetsHint")),
      h("label", {}, t("quickAction")),
      this.quickSelect,
      h("div", { class: "cf-hint" }, t("quickActionHint"))
    );
    this.buildBaseModelOptions();
    this.fillTargets();
    this.renderChips();
    return root;
  }

  /* ---------- advanced filters ---------- */
  toggleAdvanced() {
    this.state.advancedOpen = !this.state.advancedOpen;
    this.persist();
    this.advBox.hidden = !this.state.advancedOpen;
    this.updateAdvancedBadge();
  }
  /** Shows how many advanced filters differ from the defaults while collapsed. */
  updateAdvancedBadge() {
    if (!this.advToggle) return;
    const n = [this.state.mediaFilter !== "all", this.state.metaFilter !== "all", Number(this.state.browsingLevel) !== 31, !this.state.blurNsfw].filter(Boolean).length;
    this.advToggle.firstChild.className = this.state.advancedOpen ? "pi pi-chevron-down" : "pi pi-chevron-right";
    this.advToggle.lastChild.textContent = n && !this.state.advancedOpen ? `${t("advanced")} (${n})` : t("advanced");
  }

  /* ---------- search: tags, @user, prompt text ---------- */
  buildSearch() {
    this.searchInput = h("input", { type: "text", class: "cf-search-input", placeholder: t("searchPlaceholder"), autocomplete: "off" });
    this.suggestBox = h("div", { class: "cf-suggest", hidden: true });
    this.chips = h("div", { class: "cf-chips" });
    this.cloudBox = h("div", { class: "cf-cloud", hidden: !this.state.cloudOpen });
    this.cloudBtn = h(
      "button",
      { class: "cf-btn small" + (this.state.cloudOpen ? " primary" : ""), title: t("tagCloud"), onclick: () => this.toggleCloud() },
      h("i", { class: "pi pi-tags" }),
      " ",
      t("tagCloud")
    );
    let timer = null;
    this.searchInput.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => this.suggest(this.searchInput.value), 250);
    });
    this.searchInput.addEventListener("keydown", (e) => {
      const rows = [...this.suggestBox.querySelectorAll(".cf-suggest-row")];
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!rows.length) return;
        this.suggestIdx = Math.max(0, Math.min(rows.length - 1, (this.suggestIdx ?? -1) + (e.key === "ArrowDown" ? 1 : -1)));
        rows.forEach((r, i) => r.classList.toggle("active", i === this.suggestIdx));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (!this.suggestBox.hidden && this.suggestIdx != null && this.suggestActions?.[this.suggestIdx]) this.suggestActions[this.suggestIdx]();
        else this.submitSearch();
      } else if (e.key === "Escape") {
        e.preventDefault(); // don't also leave full width
        this.hideSuggest();
      }
    });
    this.searchInput.addEventListener("blur", () => setTimeout(() => this.hideSuggest(), 200));
    this.searchInput.addEventListener("focus", () => this.searchInput.value.trim() && this.suggest(this.searchInput.value));
    return h(
      "div",
      { class: "cf-search" },
      h(
        "div",
        { class: "cf-row cf-search-row" },
        h("div", { class: "cf-search-wrap" }, this.searchInput, this.suggestBox),
        h("button", { class: "cf-icon", title: t("search"), onclick: () => this.submitSearch() }, h("i", { class: "pi pi-search" })),
        this.cloudBtn
      ),
      this.chips,
      this.cloudBox
    );
  }

  hideSuggest() {
    this.suggestBox.hidden = true;
    this.suggestIdx = null;
  }

  /**
   * Search box syntax: "#tag" (multi-word: #black_hair or #"black hair"), "@user",
   * everything else is free text. E.g. `#animal #forest @someone misty morning`.
   */
  parseSearch(raw) {
    const out = { tags: [], users: [], text: [] };
    const re = /#"([^"]+)"|#(\S+)|@(\S+)|(\S+)/g;
    let m;
    while ((m = re.exec(raw))) {
      if (m[1] || m[2]) out.tags.push((m[1] || m[2]).replace(/_/g, " ").trim());
      else if (m[3]) out.users.push(m[3]);
      else out.text.push(m[4]);
    }
    return { tags: out.tags.filter(Boolean), users: out.users, text: out.text.join(" ") };
  }

  /** The "#word" being typed at the end of the input, if any. */
  currentHashToken(raw) {
    const m = /(^|\s)#("[^"]*|[^\s#@"]*)$/.exec(raw);
    if (!m) return null;
    return { start: m.index + m[1].length, query: m[2].replace(/^"/, "").replace(/_/g, " ") };
  }

  localTagMatches(q, limit = 8) {
    const ql = q.toLowerCase();
    const active = new Set(this.state.tags.map((x) => x.id));
    return [...this.knownTags.values()]
      .filter((x) => !active.has(x.id) && x.name.toLowerCase().includes(ql))
      .sort((a, b) => (a.name.toLowerCase().startsWith(ql) ? 0 : 1) - (b.name.toLowerCase().startsWith(ql) ? 0 : 1) || b.count - a.count)
      .slice(0, limit);
  }

  async remoteTagMatches(q) {
    if (q.length < 2 || !shared.config?.hasKey) return [];
    try {
      const res = await fetchJson(`${API}/tags?query=${encodeURIComponent(q)}&domain=${encodeURIComponent(this.state.domain)}`);
      const active = new Set(this.state.tags.map((x) => x.id));
      return (res.tags || []).filter((x) => !active.has(x.id));
    } catch {
      return [];
    }
  }

  async suggest(raw) {
    const token = (this.suggestToken = (this.suggestToken || 0) + 1);
    if (!raw.trim()) return this.hideSuggest();
    const hash = this.currentHashToken(raw);
    const q = hash ? hash.query.trim() : raw.trim();
    // "#…" being typed -> tag suggestions only; otherwise tags + user/text rows
    const mode = hash ? "hash" : "plain";
    const local = this.localTagMatches(q, hash && !q ? 15 : 8);
    this.renderSuggest(raw, q, local, mode);
    if (!q || (!hash && /[#@]/.test(raw))) return;
    const remote = await this.remoteTagMatches(q);
    if (token !== this.suggestToken) return;
    const seen = new Set(local.map((x) => x.id));
    this.renderSuggest(raw, q, [...local, ...remote.filter((x) => !seen.has(x.id))].slice(0, 12), mode);
  }

  renderSuggest(raw, q, tags, mode) {
    this.lastSuggestTags = tags;
    const rows = [];
    const actions = [];
    const add = (content, fn, cls = "") => {
      const i = actions.length;
      actions.push(fn);
      rows.push(h("div", { class: "cf-suggest-row " + cls, onmousedown: (e) => (e.preventDefault(), fn()), onmouseenter: () => (this.suggestIdx = i) }, content));
    };
    const tagRow = (tag, fn) => add([h("i", { class: "pi pi-hashtag" }), " ", tag.name, tag.count ? h("span", { class: "cf-count" }, tag.count) : null], fn);
    const parsed = this.parseSearch(raw);
    const structured = parsed.tags.length || parsed.users.length;

    if (mode === "hash") {
      // pick a tag for the "#word" being typed; the rest of the input stays
      for (const tag of tags) tagRow(tag, () => this.pickHashTag(tag));
    } else {
      if (!structured && q.length > 0) {
        for (const tag of tags) tagRow(tag, () => this.runSearch(() => this.addTag(tag)));
      }
      if (structured) {
        const parts = [...parsed.tags.map((x) => `#${x}`), ...parsed.users.map((u) => `@${u}`), parsed.text ? `„${parsed.text}“` : ""].filter(Boolean);
        add([h("i", { class: "pi pi-search" }), " ", `${t("search")}: ${parts.join(" + ")}`], () => this.submitSearch());
      } else if (q) {
        add([h("i", { class: "pi pi-align-left" }), " ", t("searchInPrompt", { q })], () => this.runSearch(() => this.setText(q)), "muted");
      }
    }
    this.suggestActions = actions;
    const exact = tags.findIndex((x) => x.name.toLowerCase() === q.toLowerCase());
    this.suggestIdx = mode === "hash" ? (tags.length ? Math.max(0, exact) : null) : structured ? rows.length - 1 : exact >= 0 ? exact : null;
    this.suggestBox.replaceChildren(...rows);
    rows.forEach((r, i) => r.classList.toggle("active", i === this.suggestIdx));
    this.suggestBox.hidden = document.activeElement !== this.searchInput || !rows.length;
  }

  /** Suggestion picked while typing "#…": complete the token (Enter again searches). */
  pickHashTag(tag) {
    const raw = this.searchInput.value;
    const hash = this.currentHashToken(raw);
    if (!hash) return;
    (this.pickedTags ||= new Map()).set(normTag(tag.name), tag);
    this.searchInput.value = raw.slice(0, hash.start) + "#" + tag.name.replace(/ /g, "_") + " ";
    this.hideSuggest();
    this.searchInput.focus();
  }

  runSearch(fn) {
    this.searchInput.value = "";
    this.hideSuggest();
    fn();
  }

  /** Exact tag by name: from loaded results/suggestions, else asked from Civitai (key). */
  async resolveTagByName(name) {
    const nl = normTag(name);
    if (this.pickedTags?.has(nl)) return this.pickedTags.get(nl);
    const local = [...(this.lastSuggestTags || []), ...this.knownTags.values()].find((x) => normTag(x.name) === nl);
    if (local) return local;
    const remote = await this.remoteTagMatches(name);
    return remote.find((x) => normTag(x.name) === nl) || null;
  }

  async submitSearch() {
    const raw = this.searchInput.value.trim();
    if (!raw) return;
    const parsed = this.parseSearch(raw);
    if (!parsed.tags.length && !parsed.users.length) {
      // plain input: an exact tag name becomes a tag, anything else is text
      const exact = await this.resolveTagByName(raw).catch(() => null);
      return this.runSearch(() => (exact ? this.addTag(exact) : this.setText(raw)));
    }
    this.searchInput.value = "";
    this.hideSuggest();
    const found = [];
    const missing = [];
    for (const name of parsed.tags) {
      const tag = await this.resolveTagByName(name);
      if (tag) found.push(tag);
      else missing.push(name);
    }
    if (missing.length) toast("warn", t("tagNotFound", { tags: missing.map((x) => `#${x}`).join(", ") }));
    const text = [parsed.text, ...missing].filter(Boolean).join(" ");
    const known = new Set(this.state.tags.map((x) => x.id));
    this.state.tags = [...this.state.tags, ...found.filter((x) => !known.has(x.id)).map((x) => ({ id: x.id, name: x.name }))].slice(-10);
    if (text) this.state.textFilter = text;
    const user = parsed.users[parsed.users.length - 1];
    if (user) {
      this.state.recentUsers = [user, ...this.state.recentUsers.filter((u) => u !== user)].slice(0, 8);
      if (this.isFav) {
        this.state.source = `user:${user}`;
        this.renderUserOptions();
        this.sourceSelect.value = this.state.source;
        this.updateManageButtons();
      } else this.state.user = user;
    }
    this.persist();
    this.renderChips();
    if (!this.detailView.hidden) this.closeDetail();
    this.reload();
    this.renderCloud();
  }

  /** Discovery: Civitai filters (several tags = AND). Favorites: filtered locally. */
  addTag(tag) {
    if (!tag || this.state.tags.some((x) => x.id === tag.id)) return;
    this.state.tags = [...this.state.tags, { id: tag.id, name: tag.name }].slice(-10);
    this.searchChanged(true);
  }
  removeTag(id) {
    this.state.tags = this.state.tags.filter((x) => x.id !== id);
    this.searchChanged(true);
  }
  setText(q) {
    const wasSemantic = this.useSemantic();
    this.state.textFilter = q;
    this.searchChanged(wasSemantic || this.useSemantic());
  }
  clearSearch() {
    this.state.tags = [];
    this.state.textFilter = "";
    this.searchChanged(true);
  }
  searchChanged(tagsChanged) {
    this.persist();
    this.renderChips();
    if (!this.detailView.hidden) this.closeDetail();
    if (tagsChanged && !this.isFav) this.reload();
    else this.renderGrid();
    this.renderCloud();
  }

  renderChips() {
    const chips = this.state.tags.map((tag) =>
      h("span", { class: "cf-chip" }, `#${tag.name}`, h("button", { class: "cf-chip-x", title: t("remove"), onclick: () => this.removeTag(tag.id) }, "×"))
    );
    if (this.state.textFilter)
      chips.push(
        h(
          "span",
          { class: "cf-chip text", title: this.useSemantic() ? "" : t("textFilterHint") },
          this.useSemantic() ? t("semanticSearch", { q: this.state.textFilter }) : t("promptContains", { q: this.state.textFilter }),
          h("button", { class: "cf-chip-x", title: t("remove"), onclick: () => this.setText("") }, "×")
        )
      );
    if (chips.length > 1) chips.push(h("button", { class: "cf-chip-clear", onclick: () => this.clearSearch() }, t("clearAll")));
    this.chips.replaceChildren(...chips);
    this.chips.hidden = !chips.length;
  }

  toggleCloud() {
    this.state.cloudOpen = !this.state.cloudOpen;
    this.persist();
    this.cloudBox.hidden = !this.state.cloudOpen;
    this.cloudBtn.classList.toggle("primary", this.state.cloudOpen);
    this.renderCloud();
  }

  async renderCloud() {
    if (!this.state.cloudOpen) return;
    const active = new Set(this.state.tags.map((x) => x.id));
    const tagEl = (tag, size) =>
      h("span", { class: "cf-cloud-tag", style: size ? { fontSize: `${size}px` } : null, title: tag.count ? `${tag.count}×` : t("tagHint"), onclick: () => this.addTag(tag) }, tag.name);
    // tags in the loaded (visible) results, sized by frequency
    const counts = new Map();
    for (const it of this.items) {
      if (!this.matches(it)) continue;
      for (const tag of it.tags || []) if (!active.has(tag.id)) counts.set(tag.id, { ...tag, count: (counts.get(tag.id)?.count || 0) + 1 });
    }
    const top = [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 40);
    const max = top[0]?.count || 1;
    const inResults = top.sort((a, b) => a.name.localeCompare(b.name)).map((tag) => tagEl(tag, 11 + Math.round((tag.count / max) * 8)));
    const sections = [h("div", { class: "cf-res-label" }, t("tagsInResults")), inResults.length ? h("div", { class: "cf-cloud-tags" }, inResults) : h("div", { class: "cf-hint" }, t("noTagsYet"))];
    // trending (discovery only, needs a key)
    if (!this.isFav) {
      sections.push(h("div", { class: "cf-res-label" }, t("trendingTags")));
      if (!shared.config?.hasKey) sections.push(h("div", { class: "cf-hint" }, t("trendingNeedsKey")));
      else {
        const key = `${this.state.domain}|${this.state.browsingLevel}`;
        if (this.trendingKey !== key) {
          this.trendingKey = key;
          this.trending = fetchJson(`${API}/tags/trending?browsingLevel=${this.state.browsingLevel}&domain=${encodeURIComponent(this.state.domain)}`)
            .then((r) => r.tags || [])
            .catch(() => []);
        }
        const list = (await this.trending).filter((x) => !active.has(x.id));
        sections.push(list.length ? h("div", { class: "cf-cloud-tags" }, list.map((tag) => tagEl(tag))) : h("div", { class: "cf-hint" }, "–"));
      }
    }
    this.cloudBox.replaceChildren(...sections);
  }

  /* ---------- full width ---------- */
  /**
   * Full width: the panel is moved out of the sidebar into <body> and positioned
   * fixed from the sidebar's left edge to the right window edge. Being detached,
   * no sidebar/splitter container can clip, transform or resize it.
   */
  toggleFull(on = !this.full) {
    if (on === !!this.full) return;
    const scrolls = [...this.root.querySelectorAll(".cf-scroll")].map((el) => [el, el.scrollTop]);
    if (on) {
      this.homeParent = this.root.parentElement;
      if (!this.homeParent) return;
      this.full = true;
      document.body.append(this.root);
      this.positionFull();
      // follow sidebar resizes; leave full width when the tab is closed/switched
      this.fullTimer = setInterval(() => {
        const host = this.homeParent;
        // closed, hidden, or another sidebar tab now renders into the same host
        if (!host?.isConnected || host.getBoundingClientRect().width === 0 || host.childElementCount > 0) this.toggleFull(false);
        else this.positionFull();
      }, 400);
    } else {
      this.full = false;
      clearInterval(this.fullTimer);
      Object.assign(this.root.style, { left: "", top: "", bottom: "", right: "", width: "", height: "" });
      if (this.homeParent?.isConnected && !this.homeParent.childElementCount) this.homeParent.append(this.root);
      else this.root.remove(); // tab closed/switched meanwhile; render() re-attaches it
    }
    this.root.classList.toggle("cf-full", this.full);
    this.fullBtn.title = this.full ? t("normalWidth") : t("fullWidth");
    this.fullBtn.firstChild.className = this.full ? "pi pi-window-minimize" : "pi pi-window-maximize";
    for (const [el, top] of scrolls) el.scrollTop = top;
    if (!this._fullListeners) {
      this._fullListeners = true;
      window.addEventListener("resize", () => this.full && this.positionFull());
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.full && !e.defaultPrevented) this.toggleFull(false);
      });
    }
  }
  positionFull() {
    const host = this.homeParent;
    if (!host) return;
    const r = host.getBoundingClientRect();
    Object.assign(this.root.style, { left: `${r.left}px`, top: `${r.top}px`, bottom: `${window.innerHeight - r.bottom}px`, right: "0px", width: "auto", height: "auto" });
  }

  fillTargets() {
    const nodes = promptNodes();
    for (const [sel, key] of [
      [this.posSelect, "posTarget"],
      [this.negSelect, "negTarget"],
    ]) {
      const current = this.state[key] || "";
      const opts = [h("option", { value: "" }, t("auto")), h("option", { value: "none" }, t("none")), ...nodes.map((n) => h("option", { value: String(n.id) }, nodeLabel(n)))];
      // a remembered node that isn't in the current workflow: keep it, act like Auto
      if (current && current !== "none" && !nodes.some((n) => String(n.id) === current))
        opts.push(h("option", { value: current }, `#${current} (${t("targetMissing")})`));
      sel.replaceChildren(...opts);
      sel.value = current;
    }
  }

  /* ---------- config / key ---------- */
  async init(force = false) {
    if (this.initialized && !force) return;
    this.initialized = true;
    try {
      if (force || !shared.config) await shared.loadConfig();
    } catch (e) {
      this.showMessage(String(e.message || e), true);
      return;
    }
    this.updateKeyStatus();
    if (this.isFav) {
      if (!shared.config.hasKey) {
        this.settingsBox.hidden = false;
        this.showMessage(t("noKey"));
        this.resetGrid();
        return;
      }
      await this.loadSources(force);
    } else {
      await this.reload();
    }
  }

  updateKeyStatus() {
    const c = shared.config || {};
    this.keyStatus.textContent = c.hasKey ? (c.fromEnv ? t("keyFromEnv") : `${t("keySet")}: ${c.masked}`) : "";
    const redWithoutKey = !this.isFav && !c.hasKey && (this.state.domain === "red" || (this.state.domain === "auto" && this.state.browsingLevel > 3));
    this.notice.hidden = !redWithoutKey;
    this.notice.textContent = redWithoutKey ? t("redNoKey") : "";
  }

  async saveKey(key) {
    try {
      const cfg = await postJson(`${API}/config`, { apiKey: key });
      this.keyInput.value = "";
      toast("success", key ? t("keySaved") : t("keyRemoved"));
      shared.setConfig(cfg); // notifies all panels (incl. this one)
      if (cfg.hasKey) this.settingsBox.hidden = true;
    } catch (e) {
      toast("error", t("apiKey"), String(e.message || e));
    }
  }

  /** Something shared changed (key saved, collections edited in another panel). */
  onSharedChange(origin) {
    this.updateKeyStatus();
    if (!this.initialized) return;
    if (this.isFav) {
      if (!shared.config?.hasKey) {
        this.sourceSelect.replaceChildren();
        this.resetGrid();
        this.items = [];
        this.updateStatus();
        this.showMessage(t("noKey"));
        return;
      }
      // keep the grid unless this panel changed the collections itself or the key changed
      this.loadSources(false, origin !== this && origin !== "key");
    } else if (origin === "key") {
      this.reload();
    }
  }

  /* ---------- favorites: sources ---------- */
  async loadSources(force = false, keepGrid = false) {
    if (!keepGrid) this.showMessage(t("loading"));
    let data;
    try {
      data = await shared.getCollections(force);
    } catch (e) {
      this.showMessage(String(e.message || e), true);
      return;
    }
    this.collectionsById = new Map((data.collections || []).map((c) => [c.id, c]));
    const sel = this.sourceSelect;
    sel.replaceChildren();
    if (data.collections?.length) {
      const g = h("optgroup", { label: t("collections") });
      for (const c of data.collections)
        g.append(h("option", { value: `collection:${c.id}` }, (c.owned ? "" : "↗ ") + c.name + (c.archived ? " (archived)" : "")));
      sel.append(g);
    }
    const r = h("optgroup", { label: t("reactions") });
    for (const re of data.reactions || []) r.append(h("option", { value: `reaction:${re}` }, t(`reaction_${re}`)));
    sel.append(r);
    this.userGroup = h("optgroup", { label: t("users") });
    sel.append(this.userGroup);
    this.renderUserOptions();

    const values = [...sel.querySelectorAll("option")].map((o) => o.value);
    const changed = !values.includes(this.state.source);
    if (changed) this.state.source = values[0] || "";
    sel.value = this.state.source;
    this.updateManageButtons();
    this.persist();
    if (!keepGrid || changed) await this.reload();
  }

  currentCollection() {
    const m = /^collection:(\d+)$/.exec(this.state.source || "");
    return m ? this.collectionsById?.get(Number(m[1])) || null : null;
  }
  updateManageButtons() {
    if (!this.isFav) return;
    const c = this.currentCollection();
    for (const b of [this.editBtn, this.delBtn]) {
      b.disabled = !c?.owned;
      b.title = c && !c.owned ? t("onlyOwn") : b === this.editBtn ? t("editCollection") : t("deleteCollection");
    }
  }

  renderUserOptions() {
    if (!this.userGroup) return;
    const users = [...this.state.recentUsers];
    const cur = this.state.source.startsWith("user:") ? this.state.source.slice(5) : null;
    if (cur && !users.includes(cur)) users.unshift(cur);
    this.userGroup.replaceChildren(...users.map((u) => h("option", { value: `user:${u}` }, `👤 ${u}`)));
    this.userGroup.hidden = !users.length;
  }

  setSource(source) {
    if (!source.startsWith("user:")) this.state.lastFavSource = source;
    this.state.source = source;
    this.renderUserOptions();
    this.sourceSelect.value = source;
    this.updateManageButtons();
    this.persist();
    this.reload();
  }

  showUser(username) {
    if (!username) return;
    this.state.recentUsers = [username, ...this.state.recentUsers.filter((u) => u !== username)].slice(0, 8);
    if (this.isFav) this.setSource(`user:${username}`);
    else {
      this.state.user = username;
      this.persist();
      this.reload();
    }
  }

  backFromUser() {
    if (!this.isFav) {
      this.state.user = "";
      this.reload();
      return;
    }
    const fav = [...this.sourceSelect.querySelectorAll("option")].map((o) => o.value).filter((v) => !v.startsWith("user:"));
    this.setSource(fav.includes(this.state.lastFavSource) ? this.state.lastFavSource : fav[0] || "");
  }

  currentUser() {
    if (this.isFav) return this.state.source.startsWith("user:") ? this.state.source.slice(5) : null;
    return this.state.user || null;
  }

  /* ---------- favorites: collection management ---------- */
  openCollectionForm(collection) {
    if (!shared.config?.hasKey) return toast("warn", t("needKey"));
    if (collection && !collection.owned) return toast("warn", t("onlyOwn"));
    const name = h("input", { type: "text", maxlength: "30", value: collection?.name || "" });
    const desc = h("textarea", { maxlength: "300", rows: "3" });
    desc.value = collection?.description || "";
    const read = h("select", {}, ["Private", "Unlisted", "Public"].map((v) => h("option", { value: v }, t(`read_${v}`))));
    read.value = collection?.read || "Private";
    const submit = async () => {
      try {
        const res = await postJson(`${API}/collection?domain=${encodeURIComponent(this.state.domain)}`, {
          id: collection?.id,
          name: name.value,
          description: desc.value,
          read: read.value,
          type: collection?.type || "Image",
        });
        toast("success", t(collection ? "updated" : "created", { name: name.value.trim() }));
        this.formBox.hidden = true;
        if (!collection && res?.id) {
          this.state.source = `collection:${res.id}`;
          this.state.lastFavSource = this.state.source;
          this.persist();
        }
        shared.invalidate(this);
      } catch (e) {
        toast("error", t(collection ? "editCollection" : "newCollection"), String(e.message || e));
      }
    };
    this.formBox.replaceChildren(
      h("label", { class: "cf-form-title" }, collection ? t("editCollection") : t("newCollection")),
      h("label", { class: "cf-field" }, h("span", {}, t("name")), name),
      h("label", { class: "cf-field" }, h("span", {}, t("description")), desc),
      h("label", { class: "cf-field" }, h("span", {}, t("privacy")), read),
      h(
        "div",
        { class: "cf-row" },
        h("button", { class: "cf-btn primary", onclick: submit }, collection ? t("save") : t("create")),
        h("button", { class: "cf-btn", onclick: () => (this.formBox.hidden = true) }, t("cancel"))
      )
    );
    this.formBox.hidden = false;
    name.focus();
  }

  async deleteCollection(collection) {
    if (!collection) return;
    if (!collection.owned) return toast("warn", t("onlyOwn"));
    if (!confirm(t("confirmDelete", { name: collection.name }))) return;
    try {
      await fetchJson(`${API}/collection/${collection.id}?domain=${encodeURIComponent(this.state.domain)}`, { method: "DELETE" });
      toast("success", t("deleted", { name: collection.name }));
      this.state.source = "";
      shared.invalidate(this);
    } catch (e) {
      toast("error", t("deleteCollection"), String(e.message || e));
    }
  }

  /* ---------- base model options ---------- */
  buildBaseModelOptions() {
    if (this.isFav) return this.updateBaseModelOptions();
    // discovery: static list (filtered server-side)
    const fam = familyModels();
    const popular = POPULAR_FAMILIES.filter((f) => fam.has(f));
    const others = [...fam.keys()].filter((f) => !popular.includes(f)).sort((a, b) => a.localeCompare(b));
    this.bmSelect.replaceChildren(
      h("option", { value: "all" }, t("bmAll")),
      h("optgroup", { label: t("bmPopular") }, popular.map((f) => h("option", { value: f }, f))),
      h("optgroup", { label: t("bmOther") }, others.map((f) => h("option", { value: f }, f)))
    );
    this.bmSelect.value = fam.has(this.state.bmFilter) ? this.state.bmFilter : "all";
    this.state.bmFilter = this.bmSelect.value;
  }
  updateBaseModelOptions() {
    if (!this.isFav) return;
    const counts = new Map();
    for (const it of this.items || []) {
      const g = baseModelGroup(it);
      counts.set(g, (counts.get(g) || 0) + 1);
    }
    const cur = this.state.bmFilter;
    if (cur !== "all" && !counts.has(cur)) counts.set(cur, 0);
    const label = (g) => (g === UNKNOWN_BM ? t("bmUnknown") : g);
    const groups = [...counts.keys()].sort((a, b) => (a === UNKNOWN_BM) - (b === UNKNOWN_BM) || label(a).localeCompare(label(b)));
    this.bmSelect.replaceChildren(h("option", { value: "all" }, t("bmAll")), ...groups.map((g) => h("option", { value: g }, `${label(g)} (${counts.get(g)})`)));
    this.bmSelect.value = cur;
  }

  /* ---------- loading ---------- */
  async reload() {
    const user = this.currentUser();
    this.userBar.hidden = !user;
    this.userLabel.textContent = user ? t("userView", { user }) : "";
    this.updateKeyStatus();
    this.items = [];
    this.cursor = null;
    this.hasMore = true;
    this.requestId++;
    this.loading = false;
    this.autoPages = 0;
    this.removedIds.clear();
    this.resetGrid();
    this.closeDetail();
    this.updateBaseModelOptions();
    await this.loadPage();
  }

  pageUrl() {
    const params = new URLSearchParams({
      limit: "50",
      browsingLevel: String(this.state.browsingLevel),
      sort: this.state.sort,
      domain: this.state.domain,
    });
    if (this.cursor != null) params.set("cursor", String(this.cursor));
    if (this.isFav) {
      params.set("source", this.state.source);
      return `${API}/images?${params}`;
    }
    if (this.state.mediaFilter !== "all") params.set("type", this.state.mediaFilter);
    if (this.state.bmFilter !== "all") params.set("baseModels", (familyModels().get(this.state.bmFilter) || []).join(","));
    if (this.state.user) params.set("username", this.state.user);
    if (this.state.tags.length) params.set("tags", this.state.tags.map((x) => x.id).join(","));
    if (this.useSemantic()) {
      params.set("query", this.state.textFilter);
      return `${API}/search?${params}`;
    }
    params.set("period", this.state.period);
    return `${API}/feed?${params}`;
  }

  /** Discovery text search runs on Civitai where enabled; otherwise prompts are filtered locally. */
  useSemantic() {
    return !this.isFav && !!this.state.textFilter && !shared.semanticUnavailable;
  }

  async loadPage(auto = false) {
    if (this.loading || !this.hasMore || (this.isFav && !this.state.source)) return;
    // Pages fetched in a row without producing a visible tile; manual "load more" resets it.
    if (!auto) this.autoPages = 0;
    const visibleBefore = this.visibleCount();
    this.loading = true;
    const rid = this.requestId;
    this.showMessage(this.items.length ? null : t("loading"));
    this.moreBtn.hidden = true;
    this.statusLine.textContent = t("loading");
    try {
      const data = await fetchJson(this.pageUrl());
      if (rid !== this.requestId) return;
      const known = new Set(this.items.map((i) => i.id));
      const fresh = (data.items || []).filter((i) => !known.has(i.id));
      this.items.push(...fresh);
      this.cursor = data.nextCursor ?? null;
      this.hasMore = this.cursor != null && (data.items || []).length > 0;
      for (const it of fresh)
        for (const tag of it.tags || []) {
          const k = this.knownTags.get(tag.id);
          this.knownTags.set(tag.id, { id: tag.id, name: tag.name, count: (k?.count || 0) + 1 });
        }
      this.appendTiles(fresh);
      this.renderCloud();
      this.updateBaseModelOptions();
      this.autoPages = this.visibleCount() > visibleBefore ? 0 : (this.autoPages || 0) + 1;
    } catch (e) {
      if (rid !== this.requestId) return;
      this.hasMore = false;
      if (e.data?.unavailable && !shared.semanticUnavailable) {
        // not enabled for this account: remember for the session and fall back
        shared.semanticUnavailable = true;
        toast("info", t("search"), t("semanticUnavailable"));
        this.renderChips();
        setTimeout(() => this.reload(), 0);
        return;
      }
      this.showMessage(String(e.message || e), true);
    } finally {
      if (rid === this.requestId) {
        this.loading = false;
        this.updateStatus();
        // keep filling if the filter hides most of what we have (capped)
        if (this.hasMore && this.visibleCount() < 24 && (this.autoPages || 0) < 5) setTimeout(() => this.loadPage(true), 0);
      }
    }
  }

  /* ---------- filtering & grid ---------- */
  matches(item) {
    const { metaFilter, mediaFilter } = this.state;
    if (this.removedIds.has(item.id)) return false;
    if (this.state.textFilter && !this.useSemantic()) {
      const prompt = String(item.meta?.prompt || "").toLowerCase();
      if (!this.state.textFilter.toLowerCase().split(/\s+/).every((w) => prompt.includes(w))) return false;
    }
    // favorites: tag filter applied locally (discovery: by Civitai)
    if (this.isFav && this.state.tags.length) {
      const ids = new Set((item.tags || []).map((x) => x.id));
      if (!this.state.tags.every((x) => ids.has(x.id))) return false;
    }
    if (mediaFilter !== "all" && item.type !== mediaFilter) return false;
    if (metaFilter === "with" && !item.hasMeta) return false;
    if (metaFilter === "prompt" && !item.hasPrompt) return false;
    if (metaFilter === "without" && item.hasMeta) return false;
    // discovery filters base models server-side (an image can use several)
    if (this.isFav && this.state.bmFilter !== "all" && baseModelGroup(item) !== this.state.bmFilter) return false;
    return true;
  }
  visibleCount() {
    return this.items.filter((i) => this.matches(i)).length;
  }
  updateStatus() {
    const shown = this.visibleCount();
    this.statusLine.textContent = this.items.length ? t("loaded", { shown, loaded: this.items.length }) : "";
    this.moreBtn.hidden = !this.hasMore || this.loading;
    this.emptyActions.hidden = true;
    if (!this.loading) {
      const filtered = this.state.tags.length || this.state.textFilter || this.state.bmFilter !== "all" || this.state.mediaFilter !== "all" || this.state.metaFilter !== "all";
      if (!shown && filtered) {
        this.showMessage(this.items.length ? t("emptyFiltered") : t("emptyFilters"));
        const btns = [];
        if (!this.isFav && !this.useSemantic() && this.state.period !== "AllTime")
          btns.push(h("button", { class: "cf-btn", onclick: () => this.setPeriod("AllTime") }, t("widenPeriod")));
        btns.push(h("button", { class: "cf-btn", onclick: () => this.resetFilters() }, t("resetFilters")));
        this.emptyActions.replaceChildren(...btns);
        this.emptyActions.hidden = false;
      } else if (!this.items.length) this.showMessage(t("empty"));
      else if (!shown) this.showMessage(t("emptyFiltered"));
      else this.showMessage(null);
    }
  }
  setPeriod(v) {
    this.state.period = v;
    if (this.periodSel) this.periodSel.value = v;
    this.persist();
    this.reload();
  }
  resetFilters() {
    Object.assign(this.state, { tags: [], textFilter: "", bmFilter: "all", mediaFilter: "all", metaFilter: "all" });
    for (const [sel, v] of [[this.bmSelect, "all"], [this.mediaSel, "all"], [this.metaSel, "all"]]) if (sel) sel.value = v;
    this.persist();
    this.renderChips();
    this.reload();
  }
  renderGrid() {
    this.resetGrid();
    this.appendTiles(this.items);
    this.autoPages = 0;
    this.updateStatus();
    if (this.hasMore && this.visibleCount() < 24) this.loadPage(true);
  }
  appendTiles(items) {
    for (const item of items) {
      if (!this.matches(item)) continue;
      const el = this.tile(item);
      this.tileEls.push(el);
      this.placeTile(el);
    }
  }

  tile(item) {
    // clamp extreme formats so a single panorama/strip can't dominate a column
    const ar = item.width && item.height ? Math.min(2.5, Math.max(0.45, item.width / item.height)) : 1;
    const ratio = String(ar);
    let media;
    if (item.type === "video") {
      media = h("video", { src: item.thumbUrl, poster: item.posterUrl, muted: true, loop: true, playsInline: true, preload: "none" });
      media.muted = true;
    } else {
      media = h("img", { src: item.thumbUrl, loading: "lazy", alt: "" });
    }
    const qa = this.actionsFor(item).find((a) => a.key === this.state.quickAction);
    const quick =
      qa && qa.enabled
        ? h(
            "button",
            {
              class: "cf-quick",
              title: t(qa.label),
              onclick: (e) => {
                e.stopPropagation();
                hideTooltip();
                qa.run();
              },
            },
            iconEl(qa.icon)
          )
        : null;
    const el = h(
      "div",
      {
        class: "cf-tile" + (item.nsfwLevel >= 4 ? " cf-nsfw" : ""),
        style: { aspectRatio: ratio },
        onclick: () => {
          hideTooltip();
          this.openDetail(item);
        },
        oncontextmenu: (e) => {
          e.preventDefault();
          e.stopPropagation();
          hideTooltip();
          this.showContextMenu(item, e.clientX, e.clientY);
        },
        onmouseenter: (e) => {
          if (item.type === "video") media.play?.().catch(() => {});
          scheduleTooltip(item, e.currentTarget);
        },
        onmouseleave: () => {
          if (item.type === "video") media.pause?.();
          hideTooltip();
        },
      },
      media,
      h(
        "div",
        { class: "cf-badges" },
        item.type === "video" ? h("span", { class: "cf-badge", title: t("video") }, h("i", { class: "pi pi-video" })) : null,
        item.hasMeta ? h("span", { class: "cf-badge meta", title: t("hasMeta") }, "META") : null
      ),
      quick
    );
    el._cfHeight = 1 / ar; // relative height for the masonry placement
    return el;
  }

  /* ---------- masonry: tiles go into the currently shortest column ---------- */
  columnCount() {
    const w = this.grid.clientWidth || 0;
    if (!w) return this.cols?.length || 2;
    const min = this.full ? 200 : 110;
    const gap = 6;
    return Math.max(1, Math.floor((w + gap) / (min + gap)));
  }
  buildColumns(n) {
    this.cols = Array.from({ length: n }, () => h("div", { class: "cf-col" }));
    this.colHeights = new Array(n).fill(0);
    this.grid.replaceChildren(...this.cols);
  }
  resetGrid() {
    this.tileEls = [];
    this.buildColumns(this.columnCount());
  }
  placeTile(el) {
    let i = 0;
    for (let k = 1; k < this.cols.length; k++) if (this.colHeights[k] < this.colHeights[i] - 1e-6) i = k;
    this.cols[i].append(el);
    this.colHeights[i] += el._cfHeight + 0.05; // + gap
  }
  /** Width changed (sidebar resized, full width): redistribute if the column count changed. */
  relayout() {
    const n = this.columnCount();
    if (n === this.cols?.length) return;
    this.buildColumns(n);
    for (const el of this.tileEls || []) this.placeTile(el);
  }

  showMessage(text, isError = false) {
    this.message.hidden = !text;
    this.message.textContent = text || "";
    this.message.classList.toggle("error", !!isError);
  }

  /* ---------- detail view ---------- */
  openDetail(item) {
    const meta = item.meta || null;
    const media =
      item.type === "video"
        ? h("video", { src: item.previewUrl, poster: item.posterUrl, controls: true, autoplay: true, muted: true, loop: true, playsInline: true })
        : h("img", { src: item.previewUrl, alt: "" });

    const textBlock = (label, text, kind) =>
      h(
        "div",
        { class: "cf-block" },
        h(
          "div",
          { class: "cf-block-head" },
          h("span", {}, label),
          h("button", { class: "cf-btn small", onclick: () => copyText(text) }, h("i", { class: "pi pi-copy" }), " ", t("copy")),
          h("button", { class: "cf-btn small primary", onclick: () => this.insertText(text, kind) }, t("toNode"))
        ),
        h("div", { class: "cf-text" }, text)
      );

    const pickerBox = h("div", { class: "cf-block cf-picker", hidden: true });
    const tagsBlock = item.tags?.length
      ? h(
          "div",
          { class: "cf-block" },
          h("div", { class: "cf-block-head" }, h("span", {}, t("tags"))),
          h(
            "div",
            { class: "cf-cloud-tags" },
            item.tags.map((tag) =>
              h("span", { class: "cf-cloud-tag" + (this.state.tags.some((x) => x.id === tag.id) ? " active" : ""), title: t("tagHint"), onclick: () => this.addTag(tag) }, `#${tag.name}`)
            )
          )
        )
      : null;
    const saveBtn = h(
      "button",
      { class: "cf-btn", onclick: () => this.togglePicker(item, pickerBox, saveBtn) },
      h("i", { class: "pi pi-bookmark" }),
      " ",
      t("saveToCollection")
    );

    const imgBtn =
      item.type === "image"
        ? h("button", { class: "cf-btn", onclick: () => this.imageToNode(item) }, h("i", { class: "pi pi-image" }), " ", t("ctxImage"))
        : null;
    const reactionBar = h("div", { class: "cf-reactions" });
    this.renderReactions(item, reactionBar, null);
    this.loadMyReactions(item, reactionBar);
    const body = [reactionBar, h("div", { class: "cf-actions" }, saveBtn, imgBtn), pickerBox];
    // Checkpoint / LoRAs: shown from the metadata at once, resolved to Civitai models async
    const metaCkpt = meta?.Model || meta?.model || null;
    const ckptCell = h("td", {}, metaCkpt || "…");
    const resBlock = h("div", { class: "cf-block", hidden: true });
    this.renderResources(resBlock, ckptCell, item, null);
    this.loadResources(item, resBlock, ckptCell);
    if (!meta) {
      body.push(h("div", { class: "cf-message" }, t("noMeta")));
      body.push(tagsBlock, resBlock);
    } else {
      const actions = h("div", { class: "cf-actions" });
      if (meta.prompt || meta.negativePrompt) actions.append(h("button", { class: "cf-btn primary", onclick: () => this.insertBoth(item) }, t("applyBoth")));
      if (meta.seed != null || meta.steps != null || meta.cfgScale != null)
        actions.append(h("button", { class: "cf-btn", onclick: () => this.applySampler(meta) }, t("applySampler")));
      const wf = extractWorkflow(meta);
      if (wf) actions.append(h("button", { class: "cf-btn", onclick: () => this.loadWorkflow(wf) }, h("i", { class: "pi pi-sitemap" }), " ", t("loadWorkflow")));
      actions.append(h("button", { class: "cf-btn", onclick: () => copyText(formatA1111(meta)) }, t("copyAll")));
      body.push(actions);

      if (meta.prompt) body.push(textBlock(t("prompt"), meta.prompt, "positive"));
      if (meta.negativePrompt) body.push(textBlock(t("negative"), meta.negativePrompt, "negative"));
      body.push(tagsBlock);

      const params = [
        ["Checkpoint", ckptCell],
        ["Base model", item.baseModel],
        ["Sampler", meta.sampler],
        ["Scheduler", meta.scheduler],
        ["Steps", meta.steps],
        ["CFG", meta.cfgScale],
        ["Seed", meta.seed],
        ["Size", meta.Size || (item.width ? `${item.width}x${item.height}` : null)],
        ["Clip skip", meta.clipSkip ?? meta["Clip skip"]],
        ["Denoise", meta.denoise ?? meta["Denoising strength"]],
      ].filter(([, v]) => v != null && v !== "");
      if (params.length)
        body.push(
          h(
            "div",
            { class: "cf-block" },
            h("div", { class: "cf-block-head" }, h("span", {}, t("params"))),
            h("table", { class: "cf-params" }, params.map(([k, v]) => h("tr", {}, h("th", {}, k), v instanceof Node ? v : h("td", {}, String(v)))))
          )
        );

      body.push(resBlock);

      const raw = { ...meta };
      delete raw.comfy;
      body.push(h("details", { class: "cf-block" }, h("summary", {}, t("rawMeta")), h("pre", { class: "cf-raw" }, JSON.stringify(raw, null, 2))));
    }

    this.detailView.replaceChildren(
      h(
        "div",
        { class: "cf-detail-head" },
        h("button", { class: "cf-btn", onclick: () => this.closeDetail() }, t("back")),
        h(
          "span",
          { class: "cf-grow" },
          item.username
            ? h("button", { class: "cf-user", title: t("showUser", { user: item.username }), onclick: () => this.showUser(item.username) }, h("i", { class: "pi pi-user" }), " ", item.username)
            : ""
        ),
        h("a", { class: "cf-btn", href: item.pageUrl, target: "_blank", rel: "noopener" }, h("i", { class: "pi pi-external-link" }), " ", t("openCivitai"))
      ),
      h("div", { class: "cf-scroll" }, h("div", { class: "cf-preview" + (item.nsfwLevel >= 4 ? " cf-nsfw" : "") }, media), ...body)
    );
    this.fillTargets();
    this.listView.hidden = true;
    this.detailView.hidden = false;
    this.openPicker = () => this.togglePicker(item, pickerBox, saveBtn);
  }
  /** Fetch the image's resources (checkpoint, LoRAs, ...) from Civitai. */
  async loadResources(item, block, cell) {
    const token = (this.detailToken = (this.detailToken || 0) + 1);
    const meta = item.meta || {};
    const ids = new Set(item.modelVersionIds || []);
    for (const r of [...arr(meta.civitaiResources), ...arr(meta.additionalResources)]) if (Number.isInteger(r?.modelVersionId)) ids.add(r.modelVersionId);
    const hashes = new Set();
    for (const r of arr(meta.resources)) if (typeof r?.hash === "string") hashes.add(r.hash);
    for (const hv of Object.values(meta.hashes || {})) if (typeof hv === "string") hashes.add(hv);
    if (typeof meta["Model hash"] === "string") hashes.add(meta["Model hash"]);
    if (!ids.size && !hashes.size) return this.renderResources(block, cell, item, []);
    const params = new URLSearchParams({ versionIds: [...ids].join(","), hashes: [...hashes].join(","), domain: this.state.domain });
    let resolved = [];
    try {
      resolved = (await fetchJson(`${API}/resources?${params}`)).resources || [];
    } catch {}
    if (token === this.detailToken) this.renderResources(block, cell, item, resolved);
  }

  /** resolved: null while loading, else the list from /resources. */
  renderResources(block, cell, item, resolved) {
    const meta = item.meta || {};
    const groupOf = (type) => {
      const tt = String(type || "").toLowerCase();
      if (tt === "checkpoint" || tt === "model") return "ckpt";
      if (["lora", "locon", "dora", "lycoris"].includes(tt)) return "lora";
      return "other";
    };
    const groups = { ckpt: [], lora: [], other: [] };
    const covered = new Set(); // lowercase names/hashes already represented by a resolved entry
    for (const r of resolved || []) {
      const w = resourceWeight(r, meta);
      groups[groupOf(r.type)].push(
        h(
          "li",
          {},
          h("a", { href: r.url, target: "_blank", rel: "noopener", title: r.baseModel }, r.modelName, r.versionName ? h("span", { class: "cf-ver" }, ` – ${r.versionName}`) : ""),
          w != null && groupOf(r.type) !== "ckpt" ? h("span", { class: "cf-weight" }, ` ${w}`) : null,
          groupOf(r.type) === "other" ? h("span", { class: "cf-tag" }, r.type) : null
        )
      );
      r.hashes.forEach((x) => covered.add(x.toLowerCase()));
      covered.add(r.modelName.toLowerCase());
      covered.add(r.versionName.toLowerCase());
    }
    // metadata entries Civitai couldn't resolve: show as plain text
    for (const r of collectResources(meta)) {
      if (covered.has(String(r.hash || "").toLowerCase()) || covered.has(String(r.name).toLowerCase())) continue;
      groups[groupOf(r.type)].push(h("li", { class: "cf-unresolved" }, r.name, r.weight != null ? h("span", { class: "cf-weight" }, ` ${r.weight}`) : null));
    }
    const metaCkpt = meta.Model || meta.model;
    if (!groups.ckpt.length && metaCkpt && resolved) groups.ckpt.push(h("li", { class: "cf-unresolved" }, metaCkpt));

    // parameters table cell
    if (resolved) {
      const ck = (resolved || []).filter((r) => groupOf(r.type) === "ckpt");
      if (ck.length) cell.replaceChildren(...ck.flatMap((r, i) => [i ? ", " : "", h("a", { href: r.url, target: "_blank", rel: "noopener" }, r.modelName, r.versionName ? ` – ${r.versionName}` : "")]));
      else if (metaCkpt) cell.replaceChildren(metaCkpt);
      else cell.closest("tr")?.remove();
    }

    const section = (label, list) => (list.length ? [h("div", { class: "cf-res-label" }, label), h("ul", { class: "cf-res" }, list)] : []);
    const content = [...section(t("checkpoint"), groups.ckpt), ...section(t("loras"), groups.lora), ...section(t("otherResources"), groups.other)];
    block.replaceChildren(h("div", { class: "cf-block-head" }, h("span", {}, t("resources")), resolved ? null : h("span", { class: "cf-hint" }, t("loading"))), ...content);
    block.hidden = !content.length && !!resolved;
  }

  /* ---------- reactions ---------- */
  /** mine: the key owner's reactions on this image (null = unknown / no key). */
  renderReactions(item, bar, mine) {
    const stats = item.stats || {};
    const set = new Set(mine || []);
    const btns = REACTION_EMOJI.map(([r, emoji]) =>
      h(
        "button",
        {
          class: "cf-react" + (set.has(r) ? " active" : ""),
          title: t(`reaction_${r}`),
          onclick: () => this.toggleReaction(item, r, bar),
        },
        h("span", { class: "e" }, emoji),
        h("span", { class: "n" }, formatCount(stats[r] || 0))
      )
    );
    btns.push(
      h("a", { class: "cf-react comments", href: item.pageUrl, target: "_blank", rel: "noopener", title: t("comments") }, h("span", { class: "e" }, "💬"), h("span", { class: "n" }, formatCount(stats.comments || 0)))
    );
    bar.replaceChildren(...btns);
    bar.dataset.mine = JSON.stringify([...set]);
  }
  async loadMyReactions(item, bar) {
    if (!shared.config?.hasKey) return;
    try {
      const res = await fetchJson(`${API}/reactions?imageId=${item.id}&domain=${encodeURIComponent(this.state.domain)}`);
      if (bar.isConnected) this.renderReactions(item, bar, res.reactions || []);
    } catch {}
  }
  async toggleReaction(item, reaction, bar) {
    if (!shared.config?.hasKey) return toast("warn", t("needKey"));
    if (bar.dataset.busy) return;
    const before = JSON.parse(bar.dataset.mine || "[]");
    const had = before.includes(reaction);
    // optimistic
    item.stats = { ...(item.stats || {}) };
    item.stats[reaction] = Math.max(0, (item.stats[reaction] || 0) + (had ? -1 : 1));
    this.renderReactions(item, bar, had ? before.filter((r) => r !== reaction) : [...before, reaction]);
    bar.dataset.busy = "1";
    try {
      const res = await postJson(`${API}/reactions?domain=${encodeURIComponent(this.state.domain)}`, { imageId: item.id, reaction });
      const now = res.reactions || [];
      // trust the server about what is set; keep the count consistent with it
      if (now.includes(reaction) === had) item.stats[reaction] = Math.max(0, item.stats[reaction] + (had ? 1 : -1));
      this.renderReactions(item, bar, now);
    } catch (e) {
      item.stats[reaction] = Math.max(0, item.stats[reaction] + (had ? 1 : -1));
      this.renderReactions(item, bar, before);
      toast("error", t("reactionFailed"), String(e.message || e));
    } finally {
      delete bar.dataset.busy;
    }
  }

  closeDetail() {
    this.detailView.querySelectorAll("video").forEach((v) => v.pause());
    this.detailView.hidden = true;
    this.detailView.replaceChildren();
    this.listView.hidden = false;
    if (this.gridDirty) {
      this.gridDirty = false;
      this.renderGrid();
    }
  }

  /* ---------- save to collection ---------- */
  async togglePicker(item, box, btn, autoAddId = null) {
    if (!box.hidden) {
      box.hidden = true;
      return;
    }
    if (!shared.config?.hasKey) return toast("warn", t("needKey"));
    box.hidden = false;
    box.replaceChildren(h("div", { class: "cf-hint" }, t("loading")));
    const domain = encodeURIComponent(this.state.domain);
    let own, inIds;
    try {
      const [cols, res] = await Promise.all([shared.ownCollections(), fetchJson(`${API}/item_collections?imageId=${item.id}&domain=${domain}`)]);
      own = cols;
      inIds = new Set(res.collectionIds || []);
    } catch (e) {
      box.replaceChildren(h("div", { class: "cf-message error" }, String(e.message || e)));
      return;
    }
    const updateBtn = () => {
      btn.classList.toggle("primary", inIds.size > 0);
      btn.lastChild.textContent = inIds.size ? t("inCollections", { n: inIds.size }) : t("saveToCollection");
    };
    const apply = async (collection, add, checkbox) => {
      checkbox.disabled = true;
      try {
        const res = await postJson(`${API}/item_collections?domain=${domain}`, {
          imageId: item.id,
          add: add ? [collection.id] : [],
          remove: add ? [] : [collection.id],
        });
        inIds = new Set(res.collectionIds || []);
        checkbox.checked = inIds.has(collection.id);
        toast("success", t(add ? "addedTo" : "removedFrom", { name: collection.name }));
        // removed from the favorites collection currently shown -> drop it from the grid
        if (this.isFav && !add && this.state.source === `collection:${collection.id}`) {
          this.removedIds.add(item.id);
          this.gridDirty = true;
        }
        if (this.isFav && add && this.state.source === `collection:${collection.id}`) {
          this.removedIds.delete(item.id);
          this.gridDirty = true;
        }
        for (const p of panels.values()) if (p !== this) p.onItemCollectionsChanged(item, collection.id, add);
      } catch (e) {
        checkbox.checked = !add;
        toast("error", t("saveToCollection"), String(e.message || e));
      } finally {
        checkbox.disabled = false;
        updateBtn();
      }
    };
    const boxes = new Map();
    const list = h(
      "div",
      { class: "cf-picker-list" },
      own.length
        ? own.map((c) => {
            const cb = h("input", { type: "checkbox", checked: inIds.has(c.id) });
            boxes.set(c.id, [c, cb]);
            cb.addEventListener("change", () => apply(c, cb.checked, cb));
            return h("label", { class: "cf-check cf-picker-item" }, cb, " ", c.name, c.read && c.read !== "Private" ? h("span", { class: "cf-tag" }, t(`read_${c.read}`)) : null);
          })
        : h("div", { class: "cf-hint" }, t("noOwnCollections"))
    );
    const newName = h("input", { type: "text", maxlength: "30", placeholder: t("newCollectionPlaceholder") });
    const createAndAdd = async () => {
      const name = newName.value.trim();
      if (!name) return;
      try {
        const res = await postJson(`${API}/collection?domain=${domain}`, { name, read: "Private", type: "Image" });
        toast("success", t("created", { name }));
        newName.value = "";
        shared.invalidate("picker");
        box.hidden = true;
        await this.togglePicker(item, box, btn, res?.id); // re-open with the new list and add the item
      } catch (e) {
        toast("error", t("newCollection"), String(e.message || e));
      }
    };
    newName.addEventListener("keydown", (e) => e.key === "Enter" && createAndAdd());
    box.replaceChildren(
      h("div", { class: "cf-block-head" }, h("span", {}, t("saveToCollection"))),
      list,
      h("div", { class: "cf-row" }, newName, h("button", { class: "cf-btn", onclick: createAndAdd }, h("i", { class: "pi pi-plus" }), " ", t("create")))
    );
    updateBtn();
    if (autoAddId && boxes.has(autoAddId)) {
      const [c, cb] = boxes.get(autoAddId);
      cb.checked = true;
      await apply(c, true, cb);
    }
  }

  /** Another panel added/removed an image to/from a collection. */
  onItemCollectionsChanged(item, collectionId, added) {
    if (!this.isFav || this.state.source !== `collection:${collectionId}`) return;
    if (added) {
      if (!this.items.some((i) => i.id === item.id)) {
        this.items.unshift(item);
        this.renderGrid();
      }
      this.removedIds.delete(item.id);
    } else {
      this.removedIds.add(item.id);
      this.detailView.hidden ? this.renderGrid() : (this.gridDirty = true);
    }
  }

  /* ---------- prompt/seed actions (context menu + quick button) ---------- */
  actionsFor(item) {
    const meta = item.meta || {};
    const has = { pos: !!meta.prompt, neg: !!meta.negativePrompt, seed: meta.seed != null, image: item.type === "image" && !!item.url };
    return ACTION_KEYS.map((a) => ({
      ...a,
      // the first need is required; seed in a combination is applied when available
      enabled: a.key === "sampler" ? has.seed || meta.steps != null || meta.cfgScale != null : !!has[a.needs[0]],
      run: () => this.runAction(a.key, item),
    }));
  }
  runAction(key, item) {
    const meta = item.meta || {};
    // explicit single-prompt actions ignore a "None" target; "both" respects it like the button
    const force = key !== "both" && key !== "bothSeed";
    let ok = false;
    const pos = () => meta.prompt && (ok = this.insertText(meta.prompt, "positive", !force, force) || ok);
    const neg = () => meta.negativePrompt && (ok = this.insertText(meta.negativePrompt, "negative", !force, force) || ok);
    const seed = () => meta.seed != null && (ok = this.applySampler(meta, ["seed"]) || ok);
    switch (key) {
      case "both":
        return this.insertBoth(item);
      case "bothSeed":
        pos();
        neg();
        seed();
        break;
      case "pos":
        pos();
        break;
      case "posSeed":
        pos();
        seed();
        break;
      case "neg":
        neg();
        break;
      case "negSeed":
        neg();
        seed();
        break;
      case "seed":
        seed();
        break;
      case "sampler":
        this.applySampler(meta);
        break;
      case "image":
        this.imageToNode(item);
        break;
    }
  }
  /** Download the original into ComfyUI's input folder and set it in a Load Image node. */
  async imageToNode(item) {
    toast("info", t("imageLoading"));
    try {
      const { name } = await postJson(`${API}/image_to_input`, { url: item.url, id: item.id });
      const node = findOrCreateLoadImage();
      const w = imageWidget(node);
      if (!w.options.values.includes(name)) w.options.values.push(name);
      w.value = name;
      try {
        w.callback?.(name, app.canvas, node);
      } catch {}
      app.graph.setDirtyCanvas(true, true);
      toast("success", t("imageInserted", { node: nodeLabel(node) }));
    } catch (e) {
      toast("error", t("imageFailed"), String(e.message || e));
    }
  }
  saveCommon() {
    savePrefs("common", { posTarget: this.state.posTarget, negTarget: this.state.negTarget, quickAction: this.state.quickAction });
  }

  /* ---------- context menu ---------- */
  showContextMenu(item, x, y) {
    closeContextMenu();
    const meta = item.meta || {};
    const entries = [];
    const add = (icon, label, fn, enabled = true, bold = false) => entries.push({ icon, label, fn, enabled, bold });
    const sep = () => entries.length && entries[entries.length - 1] !== "-" && entries.push("-");
    for (const a of this.actionsFor(item)) {
      add(a.icon, t(a.label), a.run, a.enabled, a.key === this.state.quickAction);
      if (a.key === "negSeed" || a.key === "sampler") sep();
    }
    const wf = extractWorkflow(meta);
    if (wf) add("pi-sitemap", t("loadWorkflow"), () => this.loadWorkflow(wf));
    sep();
    add("pi-copy", t("ctxCopyPrompt"), () => copyText(meta.prompt), !!meta.prompt);
    add("pi-copy", t("ctxCopySeed"), () => copyText(String(meta.seed)), meta.seed != null);
    add("pi-clone", t("copyAll"), () => copyText(formatA1111(meta)), !!item.meta);
    sep();
    add("pi-window-maximize", t("ctxDetails"), () => this.openDetail(item));
    add("pi-bookmark", t("ctxSave"), () => {
      this.openDetail(item);
      this.openPicker?.();
    });
    if (item.username) add("pi-user", t("ctxUser", { user: item.username }), () => this.showUser(item.username));
    add("pi-external-link", t("openCivitai"), () => window.open(item.pageUrl, "_blank", "noopener"));

    const menu = h(
      "div",
      { class: "cf-ctxmenu", oncontextmenu: (e) => e.preventDefault() },
      entries.map((en) =>
        en === "-"
          ? h("div", { class: "cf-ctx-sep" })
          : h(
              "button",
              {
                class: "cf-ctx-item" + (en.bold ? " bold" : ""),
                disabled: !en.enabled,
                onclick: () => {
                  closeContextMenu();
                  en.fn();
                },
              },
              iconEl(en.icon),
              h("span", {}, en.label)
            )
      )
    );
    document.body.append(menu);
    // keep inside the window
    const r = menu.getBoundingClientRect();
    menu.style.left = `${Math.max(4, Math.min(x, window.innerWidth - r.width - 4))}px`;
    menu.style.top = `${Math.max(4, Math.min(y, window.innerHeight - r.height - 4))}px`;
    activeMenu = menu;
  }

  /* ---------- actions ---------- */
  /** force: an explicit "only prompt/negative" action ignores a "None" target (uses Auto). */
  insertText(text, kind, silentNone = false, force = false) {
    this.fillTargets();
    const pref = kind === "negative" ? this.state.negTarget : this.state.posTarget;
    const node = resolveTarget(kind, force && pref === "none" ? "" : pref);
    if (node === "none") {
      if (!silentNone) toast("info", t("targetNone", { kind: kind === "negative" ? t("negative") : t("prompt") }));
      return false;
    }
    if (!node) {
      toast("warn", t("noTarget"));
      return false;
    }
    setNodeText(node, text);
    toast("success", t("insertedInto", { node: nodeLabel(node) }));
    return true;
  }
  insertPrompt(item, kind) {
    const text = kind === "negative" ? item.meta?.negativePrompt : item.meta?.prompt;
    if (text) this.insertText(text, kind);
  }
  insertBoth(item) {
    let done = false;
    if (item.meta?.prompt) done = this.insertText(item.meta.prompt, "positive", true) || done;
    if (item.meta?.negativePrompt) done = this.insertText(item.meta.negativePrompt, "negative", true) || done;
    if (!done && this.state.posTarget === "none" && this.state.negTarget === "none")
      toast("info", t("targetNone", { kind: `${t("prompt")} + ${t("negative")}` }));
  }
  applySampler(meta, fields = ["seed", "steps", "cfg"]) {
    const node = findSampler();
    if (!node) {
      toast("warn", t("noSampler"));
      return false;
    }
    const set = (name, value) => {
      const w = node.widgets?.find((w) => w.name === name);
      if (!w || value == null || value === "") return;
      const num = Number(value);
      if (Number.isNaN(num)) return;
      w.value = num;
      try {
        w.callback?.(num, app.canvas, node);
      } catch {}
    };
    if (fields.includes("seed")) {
      set("seed", meta.seed);
      set("noise_seed", meta.seed);
    }
    if (fields.includes("steps")) set("steps", meta.steps);
    if (fields.includes("cfg")) set("cfg", meta.cfgScale);
    app.graph.setDirtyCanvas(true, true);
    toast("success", t("samplerApplied", { node: nodeLabel(node) }));
    return true;
  }
  async loadWorkflow(wf) {
    if (!confirm(t("confirmWorkflow"))) return;
    try {
      await app.loadGraphData(wf);
    } catch (e) {
      toast("error", t("loadWorkflow"), String(e.message || e));
    }
  }
}

/* ------------------------------------------------------------ meta utils */
function extractWorkflow(meta) {
  let comfy = meta?.comfy;
  if (!comfy) return null;
  try {
    if (typeof comfy === "string") comfy = JSON.parse(comfy);
    let wf = comfy.workflow ?? null;
    if (typeof wf === "string") wf = JSON.parse(wf);
    return wf && Array.isArray(wf.nodes) ? wf : null;
  } catch {
    return null;
  }
}

function normTag(name) {
  return String(name).toLowerCase().replace(/_/g, " ").replace(/\s+/g, " ").trim();
}
function arr(v) {
  return Array.isArray(v) ? v : [];
}
function escapeRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
/** The weight a resolved resource was used with, from the generation metadata. */
function resourceWeight(res, meta) {
  const num = (v) => (v == null || v === "" || Number.isNaN(Number(v)) ? null : Number(v));
  for (const r of [...arr(meta.civitaiResources), ...arr(meta.additionalResources)])
    if (r?.modelVersionId === res.versionId) {
      const w = num(r.weight ?? r.strength);
      if (w != null) return w;
    }
  const hashes = new Set(res.hashes.map((x) => x.toLowerCase()));
  for (const r of arr(meta.resources))
    if (r?.hash && hashes.has(String(r.hash).toLowerCase())) {
      const w = num(r.weight);
      if (w != null) return w;
    }
  // A1111-style: hashes {"lora:name": hash} + "<lora:name:0.8>" in the prompt
  for (const [key, hv] of Object.entries(meta.hashes || {})) {
    if (typeof hv !== "string" || !hashes.has(hv.toLowerCase())) continue;
    const name = key.replace(/^(lora|lyco|embed):/i, "");
    const m = new RegExp(`<(?:lora|lyco):${escapeRe(name)}:([-\\d.]+)`, "i").exec(meta.prompt || "");
    if (m) return num(m[1]);
  }
  return null;
}

function collectResources(meta) {
  const out = [];
  const seen = new Set();
  const add = (r) => {
    const name = r.name || r.modelName || r.modelVersionName;
    if (!name) return;
    const key = `${r.type}|${name}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ name: r.modelVersionName && r.modelName ? `${r.modelName} – ${r.modelVersionName}` : name, type: r.type || r.modelType, weight: r.weight ?? r.strength, hash: r.hash });
  };
  (Array.isArray(meta.resources) ? meta.resources : []).forEach(add);
  (Array.isArray(meta.civitaiResources) ? meta.civitaiResources : []).forEach(add);
  (Array.isArray(meta.additionalResources) ? meta.additionalResources : []).forEach(add);
  return out;
}

function formatA1111(meta) {
  const lines = [];
  if (meta.prompt) lines.push(meta.prompt);
  if (meta.negativePrompt) lines.push(`Negative prompt: ${meta.negativePrompt}`);
  const parts = [
    ["Steps", meta.steps],
    ["Sampler", meta.sampler],
    ["CFG scale", meta.cfgScale],
    ["Seed", meta.seed],
    ["Size", meta.Size],
    ["Model", meta.Model],
    ["Clip skip", meta.clipSkip],
  ]
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `${k}: ${v}`);
  if (parts.length) lines.push(parts.join(", "));
  return lines.join("\n");
}

/* ----------------------------------------------------------------- icons */
// Own SVG icons; filled with currentColor so they follow the button's text color.
const SVG_ICONS = {
  // curved "forward" arrow (as in mail clients): send to the workflow
  forward: "M13.5 4.2a.9.9 0 0 1 1.5-.6l6.9 6.8a1 1 0 0 1 0 1.4L15 18.6a.9.9 0 0 1-1.5-.6v-3.6c-4.6 0-7.6 1.2-9.6 4.2a.6.6 0 0 1-1.1-.4C3.3 12.6 7 9 13.5 8.6z",
};
/** "pi-xyz" -> PrimeIcons <i>, "svg:name" -> inline SVG. */
function iconEl(icon) {
  if (!String(icon).startsWith("svg:")) return h("i", { class: `pi ${icon}` });
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", "cf-svg");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(NS, "path");
  path.setAttribute("d", SVG_ICONS[icon.slice(4)] || "");
  path.setAttribute("fill", "currentColor");
  svg.append(path);
  return svg;
}

/* --------------------------------------------------------------- actions */
const ACTION_KEYS = [
  { key: "both", label: "ctxBoth", icon: "svg:forward", needs: ["pos"] },
  { key: "bothSeed", label: "ctxBothSeed", icon: "svg:forward", needs: ["pos", "seed"] },
  { key: "pos", label: "ctxPositive", icon: "svg:forward", needs: ["pos"] },
  { key: "posSeed", label: "ctxPosSeed", icon: "svg:forward", needs: ["pos", "seed"] },
  { key: "neg", label: "ctxNegative", icon: "svg:forward", needs: ["neg"] },
  { key: "negSeed", label: "ctxNegSeed", icon: "svg:forward", needs: ["neg", "seed"] },
  { key: "seed", label: "ctxSeed", icon: "pi-hashtag", needs: ["seed"] },
  { key: "sampler", label: "applySampler", icon: "pi-sliders-h", needs: [] },
  { key: "image", label: "ctxImage", icon: "pi-image", needs: ["image"] },
];

const REACTION_EMOJI = [
  ["Like", "👍"],
  ["Heart", "❤️"],
  ["Laugh", "😂"],
  ["Cry", "😢"],
];
function formatCount(n) {
  n = Number(n) || 0;
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}k`;
  return String(n);
}

/* --------------------------------------------------------- hover tooltip */
let tooltipEl = null;
let tooltipTimer = null;
function hideTooltip() {
  clearTimeout(tooltipTimer);
  tooltipTimer = null;
  tooltipEl?.remove();
  tooltipEl = null;
}
function scheduleTooltip(item, anchor) {
  hideTooltip();
  tooltipTimer = setTimeout(() => showTooltip(item, anchor), 450);
}
/** Compact version of the detail view: prompt, negative, parameters, tags. */
function showTooltip(item, anchor) {
  if (!anchor.isConnected || activeMenu) return;
  const meta = item.meta || null;
  const parts = [];
  if (meta?.prompt) parts.push(h("div", { class: "cf-tt-label" }, t("prompt")), h("div", { class: "cf-tt-text clamp6" }, meta.prompt));
  if (meta?.negativePrompt) parts.push(h("div", { class: "cf-tt-label" }, t("negative")), h("div", { class: "cf-tt-text clamp2" }, meta.negativePrompt));
  const params = [
    ["Model", meta?.Model || meta?.model],
    ["Base", item.baseModel],
    ["Sampler", meta?.sampler],
    ["Steps", meta?.steps],
    ["CFG", meta?.cfgScale],
    ["Seed", meta?.seed],
    ["Size", meta?.Size || (item.width ? `${item.width}x${item.height}` : null)],
  ].filter(([, v]) => v != null && v !== "");
  if (params.length)
    parts.push(
      h("div", { class: "cf-tt-label" }, t("params")),
      h("div", { class: "cf-tt-params" }, params.flatMap(([k, v]) => [h("span", { class: "k" }, k), h("span", { class: "v", title: String(v) }, String(v))]))
    );
  if (item.tags?.length) {
    const shown = item.tags.slice(0, 14);
    parts.push(
      h("div", { class: "cf-tt-label" }, t("tags")),
      h("div", { class: "cf-tt-tags" }, shown.map((tag) => h("span", {}, `#${tag.name}`)), item.tags.length > shown.length ? h("span", { class: "more" }, `+${item.tags.length - shown.length}`) : null)
    );
  }
  if (!meta) parts.unshift(h("div", { class: "cf-tt-text muted" }, t("noMeta")));
  const st = item.stats || {};
  const statLine = [...REACTION_EMOJI.map(([r, e]) => [e, st[r]]), ["💬", st.comments]].filter(([, n]) => n > 0);
  if (statLine.length) parts.push(h("div", { class: "cf-tt-stats" }, statLine.map(([e, n]) => h("span", {}, `${e} ${formatCount(n)}`))));
  if (item.username) parts.push(h("div", { class: "cf-tt-user" }, `@${item.username}`));
  tooltipEl = h("div", { class: "cf-tooltip" }, parts);
  document.body.append(tooltipEl);
  // beside the tile: right if there is room, else left; vertically clamped
  const a = anchor.getBoundingClientRect();
  const r = tooltipEl.getBoundingClientRect();
  let left = a.right + 8;
  if (left + r.width > window.innerWidth - 4) left = Math.max(4, a.left - r.width - 8);
  const top = Math.max(4, Math.min(a.top, window.innerHeight - r.height - 4));
  Object.assign(tooltipEl.style, { left: `${left}px`, top: `${top}px` });
}
document.addEventListener("scroll", hideTooltip, true);

/* -------------------------------------------------------- context menu */
let activeMenu = null;
function closeContextMenu() {
  activeMenu?.remove();
  activeMenu = null;
}
document.addEventListener("mousedown", (e) => activeMenu && !activeMenu.contains(e.target) && closeContextMenu(), true);
document.addEventListener(
  "keydown",
  (e) => {
    if (e.key === "Escape" && activeMenu) {
      e.preventDefault(); // close the menu, not full width
      closeContextMenu();
    }
  },
  true
);
window.addEventListener("blur", closeContextMenu);
document.addEventListener("scroll", closeContextMenu, true);

/* ------------------------------------------------------------- register */
const panels = new Map();

function registerTab(mode, id, icon, title) {
  app.extensionManager.registerSidebarTab({
    id,
    icon,
    title,
    tooltip: title,
    type: "custom",
    render: (el) => {
      if (!panels.has(mode)) panels.set(mode, new BrowserPanel(mode));
      const panel = panels.get(mode);
      // The host element has auto height; pin it so only our grid scrolls.
      el.style.height = "100%";
      el.style.overflow = "hidden";
      if (panel.full) {
        // stays in <body> while in full width; just follow the new host
        panel.homeParent = el;
        el.replaceChildren();
        panel.positionFull();
      } else el.replaceChildren(panel.root);
      panel.init();
    },
  });
}

app.registerExtension({
  name: "civitai.discovery",
  async setup() {
    await Promise.all([loadBaseModelGroups(), loadServerPrefs()]);
    document.head.append(h("link", { rel: "stylesheet", href: new URL("./civitai_discovery.css", import.meta.url).href }));

    if (typeof app.extensionManager?.registerSidebarTab !== "function") {
      console.warn("[Civitai Discovery] This ComfyUI frontend does not support sidebar tabs. Please update ComfyUI.");
      return;
    }
    registerTab("discovery", "civitai-discovery", "pi pi-compass", t("titleDiscovery"));
    registerTab("favorites", "civitai-favorites", "pi pi-heart", t("titleFavorites"));
  },
});
