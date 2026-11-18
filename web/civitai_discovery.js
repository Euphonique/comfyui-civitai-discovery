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
    emptySortPeriod: "Nothing found. With “{sort}” and “{period}”, Civitai only shows images that were collected or commented on within that period, which is often none for a tag or base model. Sorting by reactions or a longer period finds them.",
    sortToReactions: "Sort: most reactions",
    resetFilters: "Reset search & filters",
    search: "Search",
    tagCloud: "Tags",
    tagsInResults: "In the results",
    trendingTags: "Trending on Civitai",
    promptContains: "Prompt contains “{q}”",
    searchText: "Search “{q}”",
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
    ctxUser: "Works by @{user}",
    trendingNeedsKey: "Trending tags and searching all Civitai tags need an API key (⚙).",
    noTagsYet: "No tags in the loaded results yet.",
    normalWidth: "Back to sidebar width",
    localHave: "Available locally: {name}",
    localByName: "Probably available locally (same file name, hash not checked): {name}",
    localChecking: "Checking local model folders…",
    download: "Download",
    downloadTitle: "Download into ComfyUI ({size})",
    folderType: "Type",
    folder: "Folder",
    subfolder: "Subfolder (optional)",
    downloadStarted: "Download started: {name}",
    downloadDone: "Downloaded: {name}",
    downloadFailed: "Download failed: {name}",
    downloadCanceled: "Download canceled: {name}",
    cancelDownload: "Cancel download",
    noFolders: "ComfyUI has no folder for this model type.",
    recreate: "Recreate in workflow…",
    recreateHint: "Choose what goes where. Nothing is changed until you click “Apply”.",
    apply: "Apply",
    skip: "Skip",
    newLoraLoaders: "New LoRA loader(s)",
    asPromptSyntax: "As <lora:…> in the prompt",
    lmReplaces: "replaces the LoRAs in this node",
    missingLocal: "not available locally",
    rowPrompt: "Prompt",
    rowNegative: "Negative",
    rowSampler: "Sampler",
    rowSize: "Size",
    rowClipSkip: "Clip skip",
    perSettings: "per settings",
    noTargetNode: "no suitable node",
    recreateDone: "Applied to the workflow: {list}",
    recreateNothing: "Nothing was applied.",
    resolving: "Looking up resources…",
    modelView: "Images made with {name}",
    showModelImages: "Show images made with this model",
    followingView: "People you follow",
    following: "Feed of people you follow",
    historyTitle: "Prompt history",
    historyEmpty: "No prompts inserted yet. Everything you send to a node shows up here.",
    historyClear: "Clear history",
    prevItem: "Previous (←)",
    nextItem: "Next (→)",
    dragHint: "Drag onto the canvas: onto a Load Image node, a prompt node, or empty space",
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
    emptySortPeriod: "Nichts gefunden. Bei „{sort}“ und „{period}“ zeigt Civitai nur Bilder, die in diesem Zeitraum gesammelt bzw. kommentiert wurden, und das sind bei einem Tag oder Basismodell oft keine. Mit Sortierung nach Reaktionen oder einem längeren Zeitraum findest du sie.",
    sortToReactions: "Sortierung: Meiste Reaktionen",
    resetFilters: "Suche & Filter zurücksetzen",
    search: "Suchen",
    tagCloud: "Tags",
    tagsInResults: "In den Ergebnissen",
    trendingTags: "Trending auf Civitai",
    promptContains: "Prompt enthält „{q}“",
    searchText: "„{q}“ suchen",
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
    ctxUser: "Werke von @{user}",
    trendingNeedsKey: "Trending-Tags und die Suche in allen Civitai-Tags brauchen einen API-Key (⚙).",
    noTagsYet: "In den geladenen Ergebnissen gibt es noch keine Tags.",
    normalWidth: "Zurück zur Seitenleiste",
    localHave: "Lokal vorhanden: {name}",
    localByName: "Vermutlich lokal vorhanden (gleicher Dateiname, Hash nicht geprüft): {name}",
    localChecking: "Prüfe lokale Modellordner…",
    download: "Herunterladen",
    downloadTitle: "In ComfyUI herunterladen ({size})",
    folderType: "Typ",
    folder: "Ordner",
    subfolder: "Unterordner (optional)",
    downloadStarted: "Download gestartet: {name}",
    downloadDone: "Heruntergeladen: {name}",
    downloadFailed: "Download fehlgeschlagen: {name}",
    downloadCanceled: "Download abgebrochen: {name}",
    cancelDownload: "Download abbrechen",
    noFolders: "ComfyUI hat keinen Ordner für diesen Modelltyp.",
    recreate: "Im Workflow nachbauen…",
    recreateHint: "Wähle, was wohin soll. Geändert wird erst, wenn du auf „Übernehmen“ klickst.",
    apply: "Übernehmen",
    skip: "Überspringen",
    newLoraLoaders: "Neue LoRA-Loader",
    asPromptSyntax: "Als <lora:…> in den Prompt",
    lmReplaces: "ersetzt die LoRAs in diesem Node",
    missingLocal: "lokal nicht vorhanden",
    rowPrompt: "Prompt",
    rowNegative: "Negativ",
    rowSampler: "Sampler",
    rowSize: "Auflösung",
    rowClipSkip: "Clip Skip",
    perSettings: "laut Einstellungen",
    noTargetNode: "kein passender Node",
    recreateDone: "In den Workflow übernommen: {list}",
    recreateNothing: "Es wurde nichts übernommen.",
    resolving: "Suche Ressourcen…",
    modelView: "Bilder mit {name}",
    showModelImages: "Bilder mit diesem Modell zeigen",
    followingView: "Leute, denen du folgst",
    following: "Feed der Leute, denen du folgst",
    historyTitle: "Prompt-Verlauf",
    historyEmpty: "Noch keine Prompts übernommen. Alles, was du in einen Node schickst, erscheint hier.",
    historyClear: "Verlauf leeren",
    prevItem: "Vorheriges (←)",
    nextItem: "Nächstes (→)",
    dragHint: "Auf die Arbeitsfläche ziehen: auf einen Load-Image-Node, einen Prompt-Node oder eine freie Stelle",
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
/** pos: canvas position for a new node (drag & drop); without it an existing Load Image node is reused. */
function findOrCreateLoadImage(pos = null) {
  if (!pos) {
    const sel = Object.values(app.canvas?.selected_nodes || {}).find(imageWidget);
    if (sel) return sel;
    const existing = graphNodes().find((n) => n.type === "LoadImage" && imageWidget(n)) || graphNodes().find(imageWidget);
    if (existing) return existing;
  }
  const LG = window.LiteGraph;
  const node = LG?.createNode?.("LoadImage");
  if (!node) throw new Error("LoadImage node not available");
  // middle of the visible canvas (the left part may be covered by the sidebar)
  const ds = app.canvas.ds;
  const rect = app.canvas.canvas.getBoundingClientRect();
  node.pos = pos ? [pos[0], pos[1]] : [(rect.width * 0.55) / ds.scale - ds.offset[0] - node.size[0] / 2, (rect.height * 0.35) / ds.scale - ds.offset[1]];
  app.graph.add(node);
  try {
    app.canvas.selectNode(node);
  } catch {}
  return node;
}
function isSamplerNode(n) {
  return n.widgets?.some((w) => w.name === "steps") && n.widgets?.some((w) => w.name === "cfg");
}
function findSampler() {
  const sel = Object.values(app.canvas?.selected_nodes || {});
  return sel.find(isSamplerNode) || graphNodes().find(isSamplerNode) || null;
}

/* ------------------------------------------------- models: local / download */
/** Civitai model type -> ComfyUI folder types (first = default download target). */
const MODEL_FOLDERS = {
  Checkpoint: ["checkpoints", "diffusion_models"],
  LORA: ["loras"],
  LoCon: ["loras"],
  DoRA: ["loras"],
  TextualInversion: ["embeddings"],
  VAE: ["vae"],
  Upscaler: ["upscale_models"],
  Controlnet: ["controlnet"],
  Hypernetwork: ["hypernetworks"],
};
const LORA_TYPES = new Set(["lora", "locon", "dora", "lycoris"]);
function resourceGroup(type) {
  const tt = String(type || "").toLowerCase();
  if (tt === "checkpoint" || tt === "model") return "ckpt";
  if (LORA_TYPES.has(tt)) return "lora";
  return "other";
}
function formatSize(kb) {
  if (!kb) return "?";
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return kb > 1024 * 1024 ? `${(kb / 1024 / 1024).toFixed(2)} GB` : `${Math.round(kb / 1024)} MB`;
}
/** File name without folder and extension (what <lora:…> syntax uses). */
function fileStem(name) {
  return String(name || "")
    .split(/[\\/]/)
    .pop()
    .replace(/\.[^.]+$/, "");
}

/** Resolved resources per image (Civitai doesn't change them). */
const resourceCache = new Map();
function resourceQuery(item) {
  const meta = item.meta || {};
  const ids = new Set(item.modelVersionIds || []);
  for (const r of [...arr(meta.civitaiResources), ...arr(meta.additionalResources)]) if (Number.isInteger(r?.modelVersionId)) ids.add(r.modelVersionId);
  const hashes = new Set();
  for (const r of arr(meta.resources)) if (typeof r?.hash === "string") hashes.add(r.hash);
  for (const hv of Object.values(meta.hashes || {})) if (typeof hv === "string") hashes.add(hv);
  if (typeof meta["Model hash"] === "string") hashes.add(meta["Model hash"]);
  return { ids, hashes };
}
async function resolveResources(item, domain) {
  if (resourceCache.has(item.id)) return resourceCache.get(item.id);
  const { ids, hashes } = resourceQuery(item);
  if (!ids.size && !hashes.size) return [];
  const params = new URLSearchParams({ versionIds: [...ids].join(","), hashes: [...hashes].join(","), domain });
  const resolved = (await fetchJson(`${API}/resources?${params}`)).resources || [];
  resourceCache.set(item.id, resolved);
  return resolved;
}
/** {versionId: {type, name, by}} for the resources that exist in ComfyUI's model folders. */
async function localMatches(resolved) {
  const resources = resolved
    .filter((r) => MODEL_FOLDERS[r.type])
    .map((r) => ({ key: String(r.versionId), hashes: r.file?.sha256 ? [r.file.sha256, ...r.hashes] : r.hashes, sizeKB: r.file?.sizeKB, fileName: r.file?.name }));
  if (!resources.length) return {};
  try {
    return (await postJson(`${API}/local`, { resources })).matches || {};
  } catch {
    return {};
  }
}

/** Background downloads (run on the ComfyUI server; polled while any is running). */
const downloads = {
  jobs: new Map(), // versionId -> job
  listeners: new Set(),
  timer: null,
  get(versionId) {
    return this.jobs.get(Number(versionId)) || null;
  },
  async start(body, domain) {
    const job = await postJson(`${API}/download?domain=${encodeURIComponent(domain)}`, body);
    this.jobs.set(Number(job.versionId), job);
    toast("info", t("downloadStarted", { name: job.name }));
    this.emit(false);
    this.poll();
    return job;
  },
  async cancel(job) {
    try {
      await postJson(`${API}/download/${job.id}`, undefined, "DELETE");
    } catch {}
  },
  poll() {
    if (this.timer) return;
    const tick = async () => {
      let list = [];
      try {
        list = (await fetchJson(`${API}/downloads`)).jobs || [];
      } catch {}
      let finished = false;
      for (const job of list) {
        const prev = this.jobs.get(Number(job.versionId));
        if (prev?.status === "running" && job.status !== "running") {
          finished = true;
          if (job.status === "done") toast("success", t("downloadDone", { name: job.name }));
          else if (job.status === "canceled") toast("info", t("downloadCanceled", { name: job.name }));
          else toast("error", t("downloadFailed", { name: job.name }), job.error || "");
        }
        if (prev?.id !== job.id && prev?.status === "running") continue; // an older job of the same version
        this.jobs.set(Number(job.versionId), job);
      }
      if (finished) {
        try {
          await app.refreshComboInNodes?.();
        } catch {}
      }
      this.emit(finished);
      this.timer = list.some((j) => j.status === "running") ? setTimeout(tick, 1000) : null;
    };
    this.timer = setTimeout(tick, 300);
  },
  emit(finished) {
    for (const fn of this.listeners) fn(finished);
  },
};

/* ------------------------------------------------- recreate: graph helpers */
function comboValues(w) {
  const v = w?.options?.values;
  try {
    return typeof v === "function" ? v() : Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
/** Nodes with a combo widget offering this exact file (any loader, core or custom). */
function nodesWithFile(name) {
  const out = [];
  for (const node of graphNodes()) {
    for (const w of node.widgets || []) {
      if (w.type === "combo" && comboValues(w).includes(name)) {
        out.push({ node, widget: w });
        break;
      }
    }
  }
  return out;
}
/** LoRA Manager's loaders: a "text" widget with <lora:…> syntax synced to a "loras" list widget. */
function isLoraManagerNode(node) {
  const names = new Set((node.widgets || []).map((w) => w.name));
  return names.has("text") && names.has("loras") && /LoraManager/i.test(node.type || node.comfyClass || "");
}
function setWidget(node, w, value) {
  w.value = value;
  try {
    w.callback?.(value, app.canvas, node);
  } catch {}
  node.onWidgetChanged?.(w.name, value, undefined, w);
}
function setStrengths(node, weight) {
  if (weight == null) return;
  for (const w of node.widgets || []) if (typeof w.value === "number" && /strength|weight/i.test(w.name)) setWidget(node, w, weight);
}
function setLoraManagerLoras(node, loras) {
  const text = node.inputWidget || node.widgets.find((w) => w.name === "text");
  const code = loras.map((l) => `<lora:${fileStem(l.name)}:${l.weight ?? 1}>`).join(" ");
  text.value = code;
  try {
    text.callback?.(code);
  } catch {}
  // switch every listed entry on, with the image's strength
  const lw = node.lorasWidget || node.widgets.find((w) => w.name === "loras");
  if (Array.isArray(lw?.value)) {
    const byStem = new Map(loras.map((l) => [fileStem(l.name).toLowerCase(), l.weight ?? 1]));
    const next = lw.value.map((e) => {
      const w = byStem.get(String(e.name || "").toLowerCase());
      return w == null ? e : { ...e, active: true, strength: w, clipStrength: w };
    });
    lw.value = next;
    try {
      lw.callback?.(next);
    } catch {}
  }
}
function inputSlot(node, name) {
  return node.inputs?.findIndex((i) => i.name === name) ?? -1;
}
function outputSlot(node, type) {
  return node.outputs?.findIndex((o) => o.type === type) ?? -1;
}
/** The node at the start of the sampler's MODEL chain (checkpoint / UNET loader). */
function modelRoot() {
  const sampler = findSampler();
  if (!sampler) return null;
  let node = sampler;
  for (let hop = 0; hop < 20; hop++) {
    const i = node.inputs?.find((x) => x.type === "MODEL" && x.link != null);
    const link = i ? getLink(i.link) : null;
    const origin = link ? app.graph.getNodeById(link.origin_id) : null;
    if (!origin) return node === sampler ? null : node;
    node = origin;
  }
  return node;
}
/** Insert LoraLoader nodes right after the model root and rewire its consumers through them. */
function insertLoraChain(root, loras) {
  const LG = window.LiteGraph;
  const mSlot = outputSlot(root, "MODEL");
  if (mSlot < 0) throw new Error("no MODEL output");
  const cSlot = outputSlot(root, "CLIP");
  const consumers = (slot) =>
    (root.outputs[slot]?.links || [])
      .map(getLink)
      .filter(Boolean)
      .map((l) => [app.graph.getNodeById(l.target_id), l.target_slot])
      .filter(([n]) => n);
  const modelUsers = consumers(mSlot);
  const clipUsers = cSlot >= 0 ? consumers(cSlot) : [];
  let prevM = [root, mSlot];
  let prevC = cSlot >= 0 ? [root, cSlot] : null;
  let y = root.pos[1] + root.size[1] + 60;
  loras.forEach((l) => {
    const node = LG.createNode(prevC ? "LoraLoader" : "LoraLoaderModelOnly");
    // stacked below the model loader, where there is usually room
    node.pos = [root.pos[0], y];
    y += node.size[1] + 50;
    app.graph.add(node);
    const w = node.widgets.find((x) => x.name === "lora_name");
    if (w) setWidget(node, w, l.name);
    setStrengths(node, l.weight ?? 1);
    prevM[0].connect(prevM[1], node, inputSlot(node, "model"));
    if (prevC) prevC[0].connect(prevC[1], node, inputSlot(node, "clip"));
    prevM = [node, outputSlot(node, "MODEL")];
    if (prevC) prevC = [node, outputSlot(node, "CLIP")];
  });
  for (const [n, slot] of modelUsers) prevM[0].connect(prevM[1], n, slot);
  if (prevC) for (const [n, slot] of clipUsers) prevC[0].connect(prevC[1], n, slot);
}
/** The latent node feeding the sampler (or any node with width + height). */
function hasSizeWidgets(n) {
  return n.widgets?.some((w) => w.name === "width" && typeof w.value === "number") && n.widgets?.some((w) => w.name === "height" && typeof w.value === "number");
}
/**
 * Where an image size can be set. width/height may be widgets of the node itself, or inputs
 * fed by another node (primitive / int nodes, Resolution Selector, …): then the source is set.
 * -> [{node (the consumer), label, preview(w, h), apply(w, h)}]
 */
function sizeTargets() {
  const out = [];
  for (const node of graphNodes()) {
    const linked = (name) => node.inputs?.find((i) => i.name === name && i.link != null);
    const wIn = linked("width");
    const hIn = linked("height");
    if (!wIn && !hIn) {
      if (!hasSizeWidgets(node)) continue;
      const set = (w, hh) => {
        setWidget(node, node.widgets.find((x) => x.name === "width"), w);
        setWidget(node, node.widgets.find((x) => x.name === "height"), hh);
      };
      out.push({ node, label: nodeLabel(node), preview: (w, hh) => `${w} × ${hh}`, apply: set });
      continue;
    }
    if (!wIn || !hIn) continue;
    const src = (input) => {
      const l = getLink(input.link);
      const origin = l && app.graph.getNodeById(l.origin_id);
      return origin ? { origin, outName: origin.outputs?.[l.origin_slot]?.name } : null;
    };
    const ws = src(wIn);
    const hs = src(hIn);
    if (!ws || !hs) continue;
    // Resolution Selector (aspect ratio + megapixels): closest equivalent
    if (ws.origin === hs.origin && isResolutionSelector(ws.origin)) {
      const rs = ws.origin;
      out.push({
        node,
        label: `${nodeLabel(node)} ← ${nodeLabel(rs)}`,
        preview: (w, hh) => {
          const r = resolutionSelectorValues(rs, w, hh);
          return `${r.ratio}, ${r.mp} MP ≈ ${r.w} × ${r.h}`;
        },
        apply: (w, hh) => {
          const r = resolutionSelectorValues(rs, w, hh);
          setWidget(rs, rs.widgets.find((x) => x.name === "aspect_ratio"), r.ratio);
          setWidget(rs, rs.widgets.find((x) => x.name === "megapixels"), r.mp);
        },
      });
      continue;
    }
    // plain number sources: a widget named like the output, or the node's only number widget
    const numWidget = ({ origin, outName }) => {
      const nums = (origin.widgets || []).filter((x) => typeof x.value === "number");
      return nums.find((x) => x.name === outName) || (nums.length === 1 ? nums[0] : null);
    };
    const ww = numWidget(ws);
    const hw = numWidget(hs);
    if (!ww || !hw || (ww === hw && ws.origin === hs.origin)) continue;
    const via = ws.origin === hs.origin ? nodeLabel(ws.origin) : `${nodeLabel(ws.origin)} + ${nodeLabel(hs.origin)}`;
    out.push({
      node,
      label: `${nodeLabel(node)} ← ${via}`,
      preview: (w, hh) => `${w} × ${hh}`,
      apply: (w, hh) => {
        setWidget(ws.origin, ww, w);
        setWidget(hs.origin, hw, hh);
      },
    });
  }
  return out;
}
function isResolutionSelector(n) {
  const names = new Set((n.widgets || []).map((w) => w.name));
  return names.has("aspect_ratio") && names.has("megapixels");
}
/** Same math as ComfyUI's ResolutionSelector: nearest listed aspect ratio + megapixels for w × h. */
function resolutionSelectorValues(node, w, hh) {
  const ratioW = node.widgets.find((x) => x.name === "aspect_ratio");
  const options = comboValues(ratioW)
    .map((v) => {
      const m = /^(\d+)\s*:\s*(\d+)/.exec(String(v));
      return m ? { v, a: Number(m[1]), b: Number(m[2]) } : null;
    })
    .filter(Boolean);
  const target = Math.log(w / hh);
  const best = options.reduce((acc, o) => (!acc || Math.abs(Math.log(o.a / o.b) - target) < Math.abs(Math.log(acc.a / acc.b) - target) ? o : acc), null);
  const mpW = node.widgets.find((x) => x.name === "megapixels");
  const min = mpW?.options?.min ?? 0.1;
  const max = mpW?.options?.max ?? 16;
  const mp = Math.min(max, Math.max(min, Math.round(((w * hh) / 1048576) * 100) / 100));
  const multiple = node.widgets.find((x) => x.name === "multiple")?.value || 8;
  if (!best) return { ratio: ratioW?.value, mp, w, h: hh };
  const scale = Math.sqrt((mp * 1048576) / (best.a * best.b));
  return {
    ratio: best.v,
    mp,
    w: Math.round((best.a * scale) / multiple) * multiple,
    h: Math.round((best.b * scale) / multiple) * multiple,
  };
}
function latentNode() {
  const hasSize = hasSizeWidgets;
  const sampler = findSampler();
  const i = sampler?.inputs?.find((x) => /latent/i.test(x.name) && x.link != null);
  const origin = i ? app.graph.getNodeById(getLink(i.link)?.origin_id) : null;
  if (origin && hasSize(origin)) return origin;
  return graphNodes().find((n) => hasSize(n) && /latent/i.test(n.type)) || null;
}
/** A1111 sampler name -> ComfyUI sampler_name + scheduler. */
const SAMPLER_MAP = {
  "euler a": "euler_ancestral",
  euler: "euler",
  lms: "lms",
  heun: "heun",
  dpm2: "dpm_2",
  "dpm2 a": "dpm_2_ancestral",
  "dpm++ 2s a": "dpmpp_2s_ancestral",
  "dpm++ 2m": "dpmpp_2m",
  "dpm++ sde": "dpmpp_sde",
  "dpm++ 2m sde": "dpmpp_2m_sde",
  "dpm++ 3m sde": "dpmpp_3m_sde",
  "dpm fast": "dpm_fast",
  "dpm adaptive": "dpm_adaptive",
  ddim: "ddim",
  ddpm: "ddpm",
  unipc: "uni_pc",
  lcm: "lcm",
  "euler cfg++": "euler_cfg_pp",
};
function mapSampler(meta) {
  let name = String(meta.sampler || "").trim();
  if (!name) return {};
  let scheduler = meta.scheduler ? String(meta.scheduler).toLowerCase().replace(/ /g, "_") : null;
  const m = /\s+(karras|exponential|sgm uniform|simple|beta|normal|ddim uniform)$/i.exec(name);
  if (m) {
    scheduler = scheduler || m[1].toLowerCase().replace(/ /g, "_");
    name = name.slice(0, m.index);
  }
  const key = name.toLowerCase();
  const a1111 = key in SAMPLER_MAP && /[A-Z ]/.test(name);
  const sampler = SAMPLER_MAP[key] || key.replace(/[ +]+/g, (x) => (x.includes("+") ? "pp" : "_"));
  // A1111 names without a suffix use the "automatic" (= normal) schedule
  return { sampler, scheduler: scheduler || (a1111 ? "normal" : null) };
}
function parseSize(item) {
  const meta = item.meta || {};
  const m = /^(\d+)\s*x\s*(\d+)$/i.exec(String(meta.Size || ""));
  if (m) return [Number(m[1]), Number(m[2])];
  if (meta.width && meta.height) return [Number(meta.width), Number(meta.height)];
  if (item.width && item.height) return [Number(item.width), Number(item.height)];
  return null;
}

/* ------------------------------------------------------- prompt history */
const HISTORY_MAX = 50;
/** Prompts sent to nodes, newest first; stored on the ComfyUI server (history.json). */
const promptHistory = {
  items: null,
  listeners: new Set(),
  timer: null,
  async load() {
    if (this.items) return this.items;
    try {
      this.items = (await fetchJson(`${API}/history`)).items || [];
    } catch {
      this.items = [];
    }
    return this.items;
  },
  async add(item, what) {
    const meta = item.meta || {};
    if (!meta.prompt && !meta.negativePrompt) return;
    await this.load();
    const entry = {
      id: item.id,
      at: Date.now(),
      what, // "pos" | "neg" | "both" | "recreate"
      type: item.type,
      username: item.username || "",
      pageUrl: item.pageUrl,
      url: item.url,
      thumbUrl: item.thumbUrl,
      previewUrl: item.previewUrl,
      posterUrl: item.posterUrl,
      width: item.width,
      height: item.height,
      nsfwLevel: item.nsfwLevel,
      baseModel: item.baseModel,
      modelVersionIds: item.modelVersionIds,
      meta: {
        prompt: String(meta.prompt || "").slice(0, 4000),
        negativePrompt: String(meta.negativePrompt || "").slice(0, 2000),
        seed: meta.seed,
        steps: meta.steps,
        cfgScale: meta.cfgScale,
        sampler: meta.sampler,
        scheduler: meta.scheduler,
        Size: meta.Size,
        clipSkip: meta.clipSkip,
        Model: meta.Model,
      },
    };
    this.items = [entry, ...this.items.filter((x) => x.id !== item.id)].slice(0, HISTORY_MAX);
    this.save();
  },
  clear() {
    this.items = [];
    this.save();
  },
  save() {
    for (const fn of this.listeners) fn();
    clearTimeout(this.timer);
    this.timer = setTimeout(() => postJson(`${API}/history`, { items: this.items }).catch(() => {}), 500);
  },
};
function timeAgo(ts) {
  const s = Math.max(0, (Date.now() - ts) / 1000);
  const fmt = new Intl.RelativeTimeFormat(locale(), { numeric: "auto" });
  if (s < 60) return fmt.format(-Math.round(s), "second");
  if (s < 3600) return fmt.format(-Math.round(s / 60), "minute");
  if (s < 86400) return fmt.format(-Math.round(s / 3600), "hour");
  return fmt.format(-Math.round(s / 86400), "day");
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
      model: null, // discovery: {id, name} of the model version whose images are shown (not persisted)
      following: !!p.following, // discovery: feed of the users the key's owner follows
      // prompt targets are shared by both tabs: "" = auto, "none", or a node id
      posTarget: typeof common.posTarget === "string" ? common.posTarget : "",
      negTarget: typeof common.negTarget === "string" ? common.negTarget : "",
      quickAction: typeof common.quickAction === "string" && ACTION_KEYS.some((a) => a.key === common.quickAction) ? common.quickAction : "recreate",
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
    downloads.listeners.add((finished) => this.onDownloadsChanged(finished));
  }

  persist() {
    this.updateAdvancedBadge?.();
    const keys = ["source", "metaFilter", "mediaFilter", "browsingLevel", "blurNsfw", "sort", "period", "domain", "bmFilter", "recentUsers", "lastFavSource", "tags", "textFilter", "cloudOpen", "advancedOpen", "following"];
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
    const sortSel = (this.sortSel = select(
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
    ));
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
    this.listView.firstChild.addEventListener("scroll", (e) => !this.listView.hidden && (this.gridScrollTop = e.target.scrollTop), { passive: true });
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
        this.isFav
          ? null
          : (this.followBtn = h(
              "button",
              { class: "cf-icon" + (this.state.following ? " active" : ""), title: t("following"), onclick: () => this.setFollowing(!this.state.following) },
              h("i", { class: "pi pi-users" })
            )),
        h("button", { class: "cf-icon", title: t("historyTitle"), onclick: () => this.toggleHistory() }, h("i", { class: "pi pi-history" })),
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

  /** Tokens in input order: {kind: "tag", name, quoted} | {kind: "user", name} | {kind: "text", word}. */
  tokenizeSearch(raw) {
    const out = [];
    const re = /#"([^"]+)"|#(\S+)|@(\S+)|(\S+)/g;
    let m;
    while ((m = re.exec(raw))) {
      if (m[1]) out.push({ kind: "tag", name: m[1].trim(), quoted: true });
      else if (m[2]) out.push({ kind: "tag", name: m[2].replace(/_/g, " ").trim(), quoted: false });
      else if (m[3]) out.push({ kind: "user", name: m[3] });
      else out.push({ kind: "text", word: m[4] });
    }
    return out;
  }

  /**
   * The "#…" being typed at the end of the input, if any. It may contain spaces
   * ("#star tr" -> "star tr") so tags like "star trek" can be found without quotes;
   * a tag already completed from the suggestions ends at the space after it.
   */
  currentHashToken(raw) {
    const m = /(^|\s)#("[^"]*|[^#@"]*)$/.exec(raw);
    if (!m) return null;
    let body = m[2];
    if (!body.startsWith('"')) {
      const first = body.split(" ")[0];
      // "#owl misty" after picking #owl: the tag is done, the rest is text
      if (body.includes(" ") && this.pickedTags?.has(normTag(first))) return null;
      if (body.trim().split(/\s+/).length > 5) return null;
    }
    return { start: m.index + m[1].length, query: body.replace(/^"/, "").replace(/_/g, " ") };
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
      // plain words: Enter searches the text; tags are only offered (use "#" or click one)
      if (structured) {
        const parts = [...parsed.tags.map((x) => `#${x}`), ...parsed.users.map((u) => `@${u}`), parsed.text ? `„${parsed.text}“` : ""].filter(Boolean);
        add([h("i", { class: "pi pi-search" }), " ", `${t("search")}: ${parts.join(" + ")}`], () => this.submitSearch());
      } else if (q) {
        add([h("i", { class: "pi pi-search" }), " ", t("searchText", { q })], () => this.runSearch(() => this.setText(q)));
        for (const tag of tags) tagRow(tag, () => this.runSearch(() => this.addTag(tag)));
      }
    }
    this.suggestActions = actions;
    const exact = tags.findIndex((x) => x.name.toLowerCase() === q.toLowerCase());
    // "#star tr": preselect a tag that starts with what was typed; "#owl misty": Enter just searches
    const prefix = tags.findIndex((x) => normTag(x.name).startsWith(normTag(q)));
    const hashIdx = exact >= 0 ? exact : prefix >= 0 ? prefix : tags.length && !q.trim().includes(" ") ? 0 : null;
    this.suggestIdx = mode === "hash" ? hashIdx : rows.length ? 0 : null;
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
      // plain input is always a text search; tags need "#" (or a click on a suggested tag)
      return this.runSearch(() => this.setText(raw));
    }
    this.searchInput.value = "";
    this.hideSuggest();
    const found = [];
    const missing = [];
    const words = [];
    // "#star trek": the longest run of following words that is a tag wins ("star trek" before "star")
    const tokens = this.tokenizeSearch(raw);
    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i];
      if (tok.kind === "text") words.push(tok.word);
      if (tok.kind !== "tag") continue;
      let tag = null;
      // a tag picked from the suggestions or written in quotes is taken as is
      if (!tok.quoted && !this.pickedTags?.has(normTag(tok.name))) {
        let n = 0;
        while (n < 4 && tokens[i + 1 + n]?.kind === "text") n++;
        for (let k = n; k > 0 && !tag; k--) {
          const name = [tok.name, ...tokens.slice(i + 1, i + 1 + k).map((x) => x.word)].join(" ");
          tag = await this.resolveTagByName(name);
          if (tag) i += k; // those words belong to the tag
        }
      }
      tag ||= await this.resolveTagByName(tok.name);
      if (tag) found.push(tag);
      else missing.push(tok.name);
    }
    this.pickedTags = new Map(); // picks belong to this input only
    if (missing.length) toast("warn", t("tagNotFound", { tags: missing.map((x) => `#${x}`).join(", ") }));
    const text = [words.join(" "), ...missing].filter(Boolean).join(" ");
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
    if (!this.detailView.hidden) this.closeDetail(true);
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
    if (!this.detailView.hidden) this.closeDetail(true);
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

  setSource(source, keepStack = false) {
    if (!source.startsWith("user:")) this.state.lastFavSource = source;
    this.state.source = source;
    this.renderUserOptions();
    this.sourceSelect.value = source;
    this.updateManageButtons();
    this.persist();
    this.reload(keepStack);
  }

  /* ---------- view stack: user / model views remember the gallery they came from ---------- */
  pushView() {
    this.viewStack ||= [];
    this.viewStack.push({
      user: this.state.user,
      model: this.state.model,
      following: this.state.following,
      source: this.state.source,
      items: this.items.slice(),
      cursor: this.cursor,
      hasMore: this.hasMore,
      removedIds: new Set(this.removedIds),
      // the grid is hidden while a detail view is open, so use the last position seen
      scrollTop: this.listView.hidden ? this.gridScrollTop || 0 : this.listView.firstChild.scrollTop,
    });
    if (this.viewStack.length > 10) this.viewStack.shift();
  }
  /** Back to the previous gallery exactly as it was (items, loaded pages, scroll position). */
  popView() {
    const v = this.viewStack?.pop();
    if (!v) return false;
    Object.assign(this.state, { user: v.user, model: v.model, following: v.following });
    this.followBtn?.classList.toggle("active", !!v.following);
    if (this.isFav && v.source !== this.state.source) {
      this.state.source = v.source;
      if (!v.source.startsWith("user:")) this.state.lastFavSource = v.source;
      this.renderUserOptions();
      this.sourceSelect.value = v.source;
      this.updateManageButtons();
    }
    this.persist();
    this.requestId++; // drop a page that is still loading for the left view
    this.loading = false;
    this.items = v.items;
    this.cursor = v.cursor;
    this.hasMore = v.hasMore;
    this.removedIds = v.removedIds;
    this.autoPages = 0;
    this.updateScopeBar();
    this.closeDetail(true);
    this.resetGrid();
    this.appendTiles(this.items);
    this.updateBaseModelOptions();
    this.updateStatus();
    this.renderCloud();
    const scroller = this.listView.querySelector(".cf-scroll");
    if (scroller) {
      scroller.scrollTop = v.scrollTop;
      requestAnimationFrame(() => (scroller.scrollTop = v.scrollTop)); // after the tiles are laid out
    }
    return true;
  }

  showUser(username) {
    if (!username) return;
    this.state.recentUsers = [username, ...this.state.recentUsers.filter((u) => u !== username)].slice(0, 8);
    this.pushView();
    if (this.isFav) this.setSource(`user:${username}`, true);
    else {
      this.state.user = username;
      this.persist();
      this.reload(true);
    }
  }

  /** Discovery: images made with one model version (opened from the resources list). */
  showModel(resource) {
    if (this.isFav) {
      // the feed lives in the Discovery tab
      let disc = panels.get("discovery");
      if (!disc) panels.set("discovery", (disc = new BrowserPanel("discovery")));
      if (disc.initialized) disc.pushView();
      disc.state.model = { id: resource.versionId, name: `${resource.modelName}${resource.versionName ? ` – ${resource.versionName}` : ""}` };
      disc.state.user = "";
      const store = app.extensionManager?.sidebarTab;
      if (store && store.activeSidebarTabId !== "civitai-discovery") store.toggleSidebarTab?.("civitai-discovery");
      if (disc.initialized) disc.reload(true);
      return;
    }
    this.pushView();
    this.state.model = { id: resource.versionId, name: `${resource.modelName}${resource.versionName ? ` – ${resource.versionName}` : ""}` };
    this.state.user = "";
    this.reload(true);
  }
  setFollowing(on) {
    if (on && !shared.config?.hasKey) return toast("warn", t("needKey"));
    this.state.following = on;
    this.followBtn?.classList.toggle("active", on);
    this.persist();
    this.reload();
  }

  backFromUser() {
    if (this.popView()) return;
    if (!this.isFav) {
      // leave the innermost view: user, then model, then the followed feed
      if (this.state.user) this.state.user = "";
      else if (this.state.model) this.state.model = null;
      else if (this.state.following) this.setFollowing(false);
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
  /** Hide the grid for a detail/history view, remembering where it was scrolled to. */
  hideGrid() {
    if (!this.listView.hidden) this.gridScrollTop = this.listView.firstChild.scrollTop;
    this.listView.hidden = true;
  }
  /** The bar above the grid: "Works by …" / "Images made with …" / "People you follow" + back. */
  updateScopeBar() {
    const user = this.currentUser();
    const scope = user
      ? t("userView", { user })
      : !this.isFav && this.state.model
        ? t("modelView", { name: this.state.model.name })
        : !this.isFav && this.state.following
          ? t("followingView")
          : "";
    this.userBar.hidden = !scope;
    this.userLabel.textContent = scope;
  }
  /** keepStack: a user/model view was just pushed; anything else (filters, search) starts over. */
  async reload(keepStack = false) {
    if (!keepStack) this.viewStack = [];
    this.updateScopeBar();
    this.updateKeyStatus();
    this.items = [];
    this.cursor = null;
    this.hasMore = true;
    this.requestId++;
    this.loading = false;
    this.autoPages = 0;
    this.removedIds.clear();
    this.resetGrid();
    this.closeDetail(true);
    this.listView.firstChild.scrollTop = 0; // a new view starts at the top
    this.gridScrollTop = 0;
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
    if (this.state.model) {
      // a model's gallery: all time, otherwise most models show nothing
      params.set("modelVersionId", String(this.state.model.id));
      params.set("period", "AllTime");
      return `${API}/feed?${params}`;
    }
    params.set("period", this.state.period);
    if (this.state.following && !this.state.user) {
      params.set("source", "followed");
      return `${API}/images?${params}`;
    }
    return `${API}/feed?${params}`;
  }

  /** Discovery text search runs on Civitai where enabled; otherwise prompts are filtered locally. */
  useSemantic() {
    return !this.isFav && !!this.state.textFilter && !shared.semanticUnavailable && !this.state.model && !(this.state.following && !this.state.user);
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
      // Civitai: "Most collected/commented" + a period = collected/commented *within* that period
      const metricPeriod =
        !this.isFav && !this.useSemantic() && !this.state.model && ["Most Collected", "Most Comments"].includes(this.state.sort) && this.state.period !== "AllTime";
      if (!this.items.length && metricPeriod) {
        const sortLabel = this.sortSel?.selectedOptions?.[0]?.textContent || this.state.sort;
        const periodLabel = this.periodSel?.selectedOptions?.[0]?.textContent || this.state.period;
        this.showMessage(t("emptySortPeriod", { sort: sortLabel, period: periodLabel }));
        const btns = [
          h("button", { class: "cf-btn primary", onclick: () => this.setSort("Most Reactions") }, t("sortToReactions")),
          h("button", { class: "cf-btn", onclick: () => this.setPeriod("AllTime") }, t("widenPeriod")),
        ];
        if (filtered) btns.push(h("button", { class: "cf-btn", onclick: () => this.resetFilters() }, t("resetFilters")));
        this.emptyActions.replaceChildren(...btns);
        this.emptyActions.hidden = false;
      } else if (!shown && filtered) {
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
  setSort(v) {
    this.state.sort = v;
    if (this.sortSel) this.sortSel.value = v;
    this.persist();
    this.reload();
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
      pauseWhenHidden(media, false);
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
        draggable: "true",
        ondragstart: (e) => {
          hideTooltip();
          dragItem = { panel: this, item };
          e.dataTransfer.effectAllowed = "copy";
          e.dataTransfer.setData("application/x-civitai-discovery", String(item.id));
          e.dataTransfer.setData("text/uri-list", item.pageUrl || "");
          // leave the canvas visible when the panel covers it (full width)
          if (this.full) setTimeout(() => this.root.classList.add("cf-dragging"), 0);
        },
        ondragend: () => {
          dragItem = null;
          this.root.classList.remove("cf-dragging");
        },
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
  /** ←/→ in the detail view: the neighbouring visible artwork (loads the next page at the end). */
  async stepDetail(dir) {
    const list = this.items.filter((i) => this.matches(i));
    let idx = list.findIndex((i) => i.id === this.detailItem?.id);
    if (idx < 0) return;
    if (dir > 0 && idx === list.length - 1 && this.hasMore) {
      await this.loadPage(false);
      const more = this.items.filter((i) => this.matches(i));
      if (more.length > list.length) return this.openDetail(more[idx + 1]);
      return;
    }
    const next = list[idx + dir];
    if (next) this.openDetail(next);
  }
  openDetail(item, fromHistory = false) {
    this.historyOpen = false;
    this.returnToHistory = fromHistory;
    this.detailItem = item;
    this.detailView.querySelectorAll("video").forEach((v) => v.pause());
    const meta = item.meta || null;
    const media =
      item.type === "video"
        ? h("video", { src: item.previewUrl, poster: item.posterUrl, controls: true, autoplay: true, muted: true, loop: true, playsInline: true })
        : h("img", { src: item.previewUrl, alt: "" });
    if (item.type === "video") pauseWhenHidden(media, true);

    const textBlock = (label, text, kind) =>
      h(
        "div",
        { class: "cf-block" },
        h(
          "div",
          { class: "cf-block-head" },
          h("span", {}, label),
          h("button", { class: "cf-btn small", onclick: () => copyText(text) }, h("i", { class: "pi pi-copy" }), " ", t("copy")),
          h("button", { class: "cf-btn small primary", onclick: () => this.insertText(text, kind) && this.recordHistory(item, kind === "negative" ? "neg" : "pos") }, t("toNode"))
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
    downloads.poll();
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
        h("button", { class: "cf-icon", title: t("prevItem"), onclick: () => this.stepDetail(-1) }, h("i", { class: "pi pi-chevron-left" })),
        h("button", { class: "cf-icon", title: t("nextItem"), onclick: () => this.stepDetail(1) }, h("i", { class: "pi pi-chevron-right" })),
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
    this.hideGrid();
    this.detailView.hidden = false;
    this.openPicker = () => this.togglePicker(item, pickerBox, saveBtn);
  }
  /** Fetch the image's resources (checkpoint, LoRAs, ...) from Civitai, then check the local model folders. */
  async loadResources(item, block, cell) {
    const token = (this.detailToken = (this.detailToken || 0) + 1);
    const st = (this.resState = { item, block, cell, resolved: null, local: null, forms: new Map() });
    let resolved = [];
    try {
      resolved = await resolveResources(item, this.state.domain);
    } catch {}
    if (token !== this.detailToken) return;
    st.resolved = resolved;
    this.renderResources(block, cell, item, resolved, null);
    await this.refreshLocal(token);
  }
  async refreshLocal(token = this.detailToken) {
    const st = this.resState;
    if (!st?.resolved) return;
    const local = await localMatches(st.resolved);
    if (token !== this.detailToken || st !== this.resState) return;
    st.local = local;
    this.renderResources(st.block, st.cell, st.item, st.resolved, local);
  }
  /** A download started/finished somewhere: update the open detail view. */
  onDownloadsChanged(finished) {
    const st = this.resState;
    if (!st?.resolved || this.detailView.hidden || !st.block.isConnected) return;
    if (finished) this.refreshLocal();
    else this.renderResources(st.block, st.cell, st.item, st.resolved, st.local);
  }

  /** Status / download control for one resolved resource. local: null = still checking. */
  resourceStatus(r, local, onForm) {
    if (!MODEL_FOLDERS[r.type]) return null;
    if (local === null) return h("span", { class: "cf-local checking", title: t("localChecking") }, "…");
    const hit = local[String(r.versionId)];
    if (hit)
      return h(
        "span",
        { class: "cf-local" + (hit.by === "name" ? " byname" : ""), title: t(hit.by === "name" ? "localByName" : "localHave", { name: `${hit.type}/${hit.name}` }) },
        h("i", { class: "pi pi-check" })
      );
    const job = downloads.get(r.versionId);
    if (job?.status === "running") {
      const pct = job.total ? Math.floor((job.done / job.total) * 100) : null;
      return h(
        "span",
        { class: "cf-dl-progress" },
        h("i", { class: "pi pi-download" }),
        pct != null ? ` ${pct}%` : " …",
        h("button", { class: "cf-icon-btn", title: t("cancelDownload"), onclick: () => downloads.cancel(job) }, h("i", { class: "pi pi-times" }))
      );
    }
    if (!r.file?.downloadUrl) return h("span", { class: "cf-local missing", title: t("missingLocal") }, "–");
    return h(
      "button",
      { class: "cf-icon-btn cf-dl-btn", title: t("downloadTitle", { size: formatSize(r.file.sizeKB) }), onclick: onForm },
      h("i", { class: "pi pi-download" })
    );
  }

  /** Inline form: which ComfyUI folder to download a model into. */
  downloadForm(r, onDone) {
    const types = MODEL_FOLDERS[r.type] || [];
    const common = loadPrefs("common");
    const memo = common.downloadTargets?.[`${r.type}|${r.baseModel}`] || common.downloadTargets?.[r.type] || {};
    const typeSel = h("select", {}, types.map((ft) => h("option", { value: ft }, ft)));
    typeSel.value = types.includes(memo.type) ? memo.type : types[0];
    const folderSel = h("select", {});
    const subdir = h("input", { type: "text", placeholder: t("subfolder"), value: memo.subdir || "" });
    const listId = `cf-subdirs-${r.versionId}`;
    const datalist = h("datalist", { id: listId });
    subdir.setAttribute("list", listId);
    const go = h("button", { class: "cf-btn primary" }, h("i", { class: "pi pi-download" }), " ", t("download"));
    const loadFolders = async () => {
      folderSel.replaceChildren(h("option", {}, t("loading")));
      go.disabled = true;
      try {
        const { folders, subdirs } = await fetchJson(`${API}/model_folders?type=${encodeURIComponent(typeSel.value)}`);
        if (!folders.length) {
          folderSel.replaceChildren(h("option", { value: "" }, t("noFolders")));
          return;
        }
        folderSel.replaceChildren(...folders.map((f) => h("option", { value: f.path }, `${f.path} (${f.count})`)));
        const best = folders.find((f) => f.path === memo.folder) || [...folders].sort((a, b) => b.count - a.count)[0];
        folderSel.value = best.path;
        datalist.replaceChildren(...subdirs.map((d) => h("option", { value: d })));
        go.disabled = false;
      } catch (e) {
        folderSel.replaceChildren(h("option", { value: "" }, String(e.message || e)));
      }
    };
    typeSel.addEventListener("change", loadFolders);
    go.addEventListener("click", async () => {
      if (!folderSel.value) return;
      go.disabled = true;
      const target = { type: typeSel.value, folder: folderSel.value, subdir: subdir.value.trim() };
      try {
        await downloads.start({ versionId: r.versionId, ...target }, this.state.domain);
        const c = loadPrefs("common");
        savePrefs("common", { ...c, downloadTargets: { ...(c.downloadTargets || {}), [r.type]: target, [`${r.type}|${r.baseModel}`]: target } });
        onDone?.();
      } catch (e) {
        go.disabled = false;
        toast("error", t("downloadFailed", { name: r.file?.name || r.modelName }), String(e.message || e));
      }
    });
    loadFolders();
    return h(
      "div",
      { class: "cf-dl-form" },
      h("div", { class: "cf-hint" }, `${r.file?.name || ""} · ${formatSize(r.file?.sizeKB)}${r.file?.fp ? ` · ${r.file.fp}` : ""}`),
      types.length > 1 ? h("label", { class: "cf-field" }, h("span", {}, t("folderType")), typeSel) : null,
      h("label", { class: "cf-field" }, h("span", {}, t("folder")), folderSel),
      h("label", { class: "cf-field" }, h("span", {}, t("subfolder")), subdir, datalist),
      h("div", { class: "cf-row" }, go)
    );
  }

  /** resolved: null while loading, else the list from /resources. local: null while checking. */
  renderResources(block, cell, item, resolved, local = null) {
    const meta = item.meta || {};
    const st = this.resState;
    const groups = { ckpt: [], lora: [], other: [] };
    const covered = new Set(); // lowercase names/hashes already represented by a resolved entry
    for (const r of resolved || []) {
      const w = resourceWeight(r, meta);
      const g = resourceGroup(r.type);
      const toggleForm = () => {
        if (!st) return;
        if (st.forms.has(r.versionId)) st.forms.delete(r.versionId);
        else st.forms.set(r.versionId, this.downloadForm(r, () => (st.forms.delete(r.versionId), this.onDownloadsChanged(false))));
        this.renderResources(block, cell, item, resolved, local);
      };
      const li = h(
        "li",
        {},
        h("a", { href: r.url, target: "_blank", rel: "noopener", title: r.baseModel }, r.modelName, r.versionName ? h("span", { class: "cf-ver" }, ` – ${r.versionName}`) : ""),
        w != null && g !== "ckpt" ? h("span", { class: "cf-weight" }, ` ${w}`) : null,
        g === "other" ? h("span", { class: "cf-tag" }, r.type) : null
      );
      li.append(
        h("button", { class: "cf-icon-btn cf-res-images", title: t("showModelImages"), onclick: () => this.showModel(r) }, h("i", { class: "pi pi-images" }))
      );
      const status = this.resourceStatus(r, local, toggleForm);
      if (status) li.append(status);
      const form = st?.forms.get(r.versionId);
      if (form && !local?.[String(r.versionId)] && downloads.get(r.versionId)?.status !== "running") li.append(form);
      groups[g].push(li);
      r.hashes.forEach((x) => covered.add(x.toLowerCase()));
      covered.add(r.modelName.toLowerCase());
      covered.add(r.versionName.toLowerCase());
    }
    // metadata entries Civitai couldn't resolve: show as plain text
    for (const r of collectResources(meta)) {
      if (covered.has(String(r.hash || "").toLowerCase()) || covered.has(String(r.name).toLowerCase())) continue;
      groups[resourceGroup(r.type)].push(h("li", { class: "cf-unresolved" }, r.name, r.weight != null ? h("span", { class: "cf-weight" }, ` ${r.weight}`) : null));
    }
    const metaCkpt = meta.Model || meta.model;
    if (!groups.ckpt.length && metaCkpt && resolved) groups.ckpt.push(h("li", { class: "cf-unresolved" }, metaCkpt));

    // parameters table cell
    if (resolved && cell) {
      const ck = (resolved || []).filter((r) => resourceGroup(r.type) === "ckpt");
      if (ck.length) cell.replaceChildren(...ck.flatMap((r, i) => [i ? ", " : "", h("a", { href: r.url, target: "_blank", rel: "noopener" }, r.modelName, r.versionName ? ` – ${r.versionName}` : "")]));
      else if (metaCkpt) cell.replaceChildren(metaCkpt);
      else cell.closest("tr")?.remove();
    }

    const section = (label, list) => (list.length ? [h("div", { class: "cf-res-label" }, label), h("ul", { class: "cf-res" }, list)] : []);
    const content = [...section(t("checkpoint"), groups.ckpt), ...section(t("loras"), groups.lora), ...section(t("otherResources"), groups.other)];
    const recreateBtn = item.meta
      ? h("button", { class: "cf-btn", onclick: () => this.openRecreate(item) }, h("i", { class: "pi pi-sitemap" }), " ", t("recreate"))
      : null;
    block.replaceChildren(
      h("div", { class: "cf-block-head" }, h("span", {}, t("resources")), resolved ? null : h("span", { class: "cf-hint" }, t("loading"))),
      ...content,
      content.length && recreateBtn ? h("div", { class: "cf-actions" }, recreateBtn) : null
    );
    block.hidden = !content.length && !!resolved;
  }

  /* ---------- recreate in workflow ---------- */
  /** Dialog: map the image's checkpoint, LoRAs, prompts and parameters onto nodes of the current workflow. */
  async openRecreate(item) {
    closeRecreate();
    const meta = item.meta || {};
    const body = h("div", { class: "cf-modal-body" }, h("div", { class: "cf-hint" }, t("resolving")));
    const applyBtn = h("button", { class: "cf-btn primary", disabled: true }, t("apply"));
    const modal = h(
      "div",
      { class: "cf-modal-backdrop", onmousedown: (e) => e.target === modal && closeRecreate() },
      h(
        "div",
        { class: "cf-modal" },
        h("div", { class: "cf-modal-head" }, h("span", {}, t("recreate").replace(/…$/, "")), h("button", { class: "cf-icon-btn", onclick: closeRecreate }, h("i", { class: "pi pi-times" }))),
        body,
        h("div", { class: "cf-modal-foot" }, h("span", { class: "cf-hint" }, t("recreateHint")), h("button", { class: "cf-btn", onclick: closeRecreate }, t("cancel")), applyBtn)
      )
    );
    document.body.append(modal);
    activeRecreate = modal;

    let resolved = [];
    try {
      resolved = await resolveResources(item, this.state.domain);
    } catch {}
    let local = await localMatches(resolved);
    if (!modal.isConnected) return;

    const forms = new Map();
    const overrides = new Map(); // user choices survive re-renders (download progress)
    let rows = [];
    const render = () => {
      rows = this.recreateRows(item, resolved, local);
      for (const row of rows) {
        row.key = `${row.kind}|${row.value}`;
        const o = overrides.get(row.key);
        if (!o) continue;
        if (o.on != null && row.targets.length) row.on = o.on;
        if (o.target && row.targets.some((x) => x.value === o.target)) row.target = o.target;
      }
      const table = h(
        "div",
        { class: "cf-rec" },
        rows.map((row) => {
          const cb = h("input", { type: "checkbox", checked: row.on, disabled: !row.targets.length });
          cb.addEventListener("change", () => {
            row.on = cb.checked;
            overrides.set(row.key, { ...overrides.get(row.key), on: cb.checked });
          });
          const sel = row.targets.length
            ? h(
                "select",
                {
                  onchange: (e) => {
                    row.target = e.target.value;
                    overrides.set(row.key, { ...overrides.get(row.key), target: row.target });
                    render(); // e.g. the LoRA Manager note depends on the target
                  },
                },
                row.targets.map((o) => h("option", { value: o.value }, o.label))
              )
            : h("span", { class: "cf-hint" }, row.missing ? t("missingLocal") : t("noTargetNode"));
          if (row.targets.length) sel.value = row.target;
          let status = null;
          if (row.resource) {
            status = this.resourceStatus(row.resource, local, () => {
              if (forms.has(row.resource.versionId)) forms.delete(row.resource.versionId);
              else forms.set(row.resource.versionId, this.downloadForm(row.resource, () => (forms.delete(row.resource.versionId), render())));
              render();
            });
          }
          const form =
            row.resource && !local[String(row.resource.versionId)] && downloads.get(row.resource.versionId)?.status !== "running"
              ? forms.get(row.resource.versionId)
              : null;
          return h(
            "div",
            { class: "cf-rec-row" + (row.targets.length ? "" : " off") },
            h("label", { class: "cf-rec-what" }, cb, h("span", { class: "cf-rec-kind" }, row.kind), h("span", { class: "cf-rec-value", title: row.value }, row.value)),
            h("div", { class: "cf-rec-target" }, h("span", { class: "cf-rec-arrow" }, "→"), sel, status),
            row.lora && row.target?.startsWith("lm:") ? h("div", { class: "cf-hint cf-rec-note" }, t("lmReplaces")) : null,
            row.noteFor?.(row.target) ? h("div", { class: "cf-hint cf-rec-note" }, row.noteFor(row.target)) : null,
            form
          );
        })
      );
      body.replaceChildren(table);
      applyBtn.disabled = !rows.some((r) => r.targets.length);
    };
    render();
    // a finished download makes the model selectable
    const onDl = async (finished) => {
      if (!modal.isConnected) return downloads.listeners.delete(onDl);
      if (finished) local = await localMatches(resolved);
      render();
    };
    downloads.listeners.add(onDl);
    applyBtn.addEventListener("click", () => {
      const done = this.applyRecreate(item, rows);
      closeRecreate();
      if (done.length) toast("success", t("recreateDone", { list: done.join(", ") }));
      else toast("info", t("recreateNothing"));
    });
  }

  /** Build the dialog rows with their possible targets and a sensible default each. */
  recreateRows(item, resolved, local) {
    const meta = item.meta || {};
    const memo = loadPrefs("common").recreateTargets || {};
    const rows = [];
    const label = (n) => nodeLabel(n);
    const skip = { value: "skip", label: t("skip") };
    const nodeOpt = (n, value = String(n.id), suffix = "") => ({ value, label: label(n) + suffix, node: n });
    /** The node chosen last time (same id + type), else one of the same type, else the fallback. */
    const remembered = (m, opts, sameTypeOk = true) => {
      if (!m?.type) return null;
      const withNode = opts.filter((o) => o.node);
      const exact = withNode.find((o) => String(o.node.id) === String(m.id) && o.node.type === m.type);
      return (exact || (sameTypeOk ? withNode.find((o) => o.node.type === m.type) : null))?.value || null;
    };
    const getNode = (id) => app.graph.getNodeById(Number(id));

    // checkpoint(s)
    for (const r of resolved.filter((x) => resourceGroup(x.type) === "ckpt")) {
      const hit = local[String(r.versionId)];
      const cands = hit ? nodesWithFile(hit.name) : [];
      const targets = cands.length ? [...cands.map((c) => nodeOpt(c.node)), skip] : [];
      rows.push({
        kind: t("checkpoint"),
        value: `${r.modelName}${r.versionName ? ` – ${r.versionName}` : ""}`,
        resource: r,
        missing: !hit,
        memoKey: "ckpt",
        targets,
        target: remembered(memo.ckpt, targets) || targets[0]?.value,
        on: !!cands.length,
        apply: (target) => {
          const c = cands.find((x) => String(x.node.id) === target);
          if (!c) return null;
          setWidget(c.node, c.widget, hit.name);
          return t("checkpoint");
        },
      });
    }

    // LoRAs: LoRA Manager loaders, any loader that lists the file, new LoraLoader nodes, or <lora:> prompt syntax
    const loras = resolved.filter((x) => resourceGroup(x.type) === "lora");
    const lmNodes = graphNodes().filter(isLoraManagerNode);
    const root = modelRoot();
    const canChain = !!(root && window.LiteGraph?.registered_node_types?.LoraLoader && outputSlot(root, "MODEL") >= 0);
    const loraLoaders = graphNodes().filter((n) => !isLoraManagerNode(n) && n.widgets?.some((w) => w.name === "lora_name" && w.type === "combo"));
    const usedNodes = new Set();
    for (const r of loras) {
      const hit = local[String(r.versionId)];
      const weight = resourceWeight(r, meta) ?? 1;
      const generic = hit ? nodesWithFile(hit.name).filter((c) => !isLoraManagerNode(c.node)).map((c) => c.node) : [];
      const genericNodes = [...new Set([...generic, ...(hit ? loraLoaders : [])])];
      const targets = [];
      if (hit) {
        for (const n of lmNodes) targets.push(nodeOpt(n, `lm:${n.id}`, " (LoRA Manager)"));
        for (const n of genericNodes) targets.push(nodeOpt(n, `node:${n.id}`));
        if (canChain) targets.push({ value: "new", label: t("newLoraLoaders") });
      }
      targets.push({ value: "prompt", label: t("asPromptSyntax") });
      targets.push(skip);
      // default: the node / kind of target used last time, else LoRA Manager > free loader > new loaders > prompt
      const m = memo.lora || {};
      const free = (o) => !o.value.startsWith("node:") || !usedNodes.has(o.value);
      const ofKind = (k) => targets.filter((o) => o.value.startsWith(`${k}:`) && free(o));
      const pick =
        ((m.kind === "lm" || m.kind === "node") && targets.find((o) => o.value === remembered(m, ofKind(m.kind)))) ||
        ((m.kind === "lm" || m.kind === "node") && ofKind(m.kind)[0]) ||
        (m.kind && targets.find((o) => o.value === m.kind)) ||
        ofKind("lm")[0] ||
        ofKind("node")[0] ||
        targets.find((o) => o.value === "new") ||
        targets.find((o) => o.value === "prompt");
      if (pick.value.startsWith("node:")) usedNodes.add(pick.value);
      rows.push({
        kind: "LoRA",
        value: `${r.modelName}${r.versionName ? ` – ${r.versionName}` : ""} (${weight})`,
        resource: r,
        missing: !hit,
        memoKey: "lora",
        targets,
        target: pick.value,
        on: !!hit, // a missing LoRA would only break the prompt / loader
        lora: { name: hit?.name || r.file?.name || r.modelName, weight },
      });
    }

    // prompts: any text node; preselected: last choice, else the target from the settings
    const textNodes = promptNodes();
    const promptRow = (kind, text, rowLabel) => {
      if (!text) return;
      const pref = kind === "negative" ? this.state.negTarget : this.state.posTarget;
      const fromSettings = resolveTarget(kind, pref);
      const targets = textNodes.length
        ? [...textNodes.map((n) => nodeOpt(n, String(n.id), n === fromSettings ? ` (${t("perSettings")})` : "")), skip]
        : [];
      const fallback = fromSettings === "none" ? "skip" : fromSettings ? String(fromSettings.id) : targets[0]?.value;
      rows.push({ kind: rowLabel, value: text, memoKey: kind, targets, target: remembered(memo[kind], targets, false) || fallback /* positive and negative usually share a node type */, on: !!targets.length, prompt: kind });
    };
    promptRow("positive", meta.prompt, t("rowPrompt"));
    promptRow("negative", meta.negativePrompt, t("rowNegative"));

    // sampler settings
    const samplers = graphNodes().filter(isSamplerNode);
    if (samplers.length && (meta.seed != null || meta.steps != null || meta.cfgScale != null || meta.sampler)) {
      const { sampler: sName, scheduler } = mapSampler(meta);
      const parts = [
        meta.seed != null ? `seed ${meta.seed}` : null,
        meta.steps != null ? `${meta.steps} steps` : null,
        meta.cfgScale != null ? `CFG ${meta.cfgScale}` : null,
        sName ? `${sName}${scheduler ? ` / ${scheduler}` : ""}` : null,
      ].filter(Boolean);
      const targets = [...samplers.map((n) => nodeOpt(n)), skip];
      rows.push({
        kind: t("rowSampler"),
        value: parts.join(", "),
        memoKey: "sampler",
        targets,
        target: remembered(memo.sampler, targets) || String(findSampler()?.id ?? samplers[0].id),
        on: true,
        apply: (target) => {
          const sampler = getNode(target);
          if (!sampler) return null;
          const ws = Object.fromEntries((sampler.widgets || []).map((w) => [w.name, w]));
          const setNum = (name, v) => ws[name] && v != null && !Number.isNaN(Number(v)) && setWidget(sampler, ws[name], Number(v));
          setNum("seed", meta.seed);
          setNum("noise_seed", meta.seed);
          // keep the seed for the next run instead of randomizing it
          const ctl = ws.control_after_generate;
          if (meta.seed != null && ctl && comboValues(ctl).includes("fixed")) setWidget(sampler, ctl, "fixed");
          setNum("steps", meta.steps);
          setNum("cfg", meta.cfgScale);
          if (sName && ws.sampler_name && comboValues(ws.sampler_name).includes(sName)) setWidget(sampler, ws.sampler_name, sName);
          if (scheduler && ws.scheduler && comboValues(ws.scheduler).includes(scheduler)) setWidget(sampler, ws.scheduler, scheduler);
          return t("rowSampler");
        },
      });
    }

    // resolution: the node's own width/height, or the node feeding them (Resolution Selector, number nodes)
    const size = parseSize(item);
    if (size) {
      const cands = sizeTargets();
      const targets = cands.length ? [...cands.map((c) => ({ ...nodeOpt(c.node), label: c.label })), skip] : [];
      const lat = latentNode();
      const fed = cands.find((c) => lat && c.node === lat) || cands.find((c) => c.label.includes("←"));
      rows.push({
        kind: t("rowSize"),
        value: `${size[0]} × ${size[1]}`,
        memoKey: "size",
        targets,
        target: remembered(memo.size, targets) || (fed ? String(fed.node.id) : targets[0]?.value),
        on: !!targets.length,
        noteFor: (target) => {
          const c = cands.find((x) => String(x.node.id) === target);
          return c && c.label.includes("←") ? `→ ${c.preview(size[0], size[1])}` : null;
        },
        apply: (target) => {
          const c = cands.find((x) => String(x.node.id) === target);
          if (!c) return null;
          c.apply(size[0], size[1]);
          return t("rowSize");
        },
      });
    }

    // clip skip
    const clipSkip = Number(meta.clipSkip ?? meta["Clip skip"]);
    if (clipSkip > 1) {
      const clipNodes = graphNodes().filter((n) => n.widgets?.some((w) => w.name === "stop_at_clip_layer"));
      const targets = clipNodes.length ? [...clipNodes.map((n) => nodeOpt(n)), skip] : [];
      rows.push({
        kind: t("rowClipSkip"),
        value: String(clipSkip),
        memoKey: "clipSkip",
        targets,
        target: remembered(memo.clipSkip, targets) || targets[0]?.value,
        on: !!targets.length,
        apply: (target) => {
          const n = getNode(target);
          if (!n) return null;
          setWidget(n, n.widgets.find((w) => w.name === "stop_at_clip_layer"), -clipSkip);
          return t("rowClipSkip");
        },
      });
    }
    return rows;
  }

  /** Remember which node each kind of row went to, to preselect it next time. */
  rememberRecreateTargets(active) {
    const common = loadPrefs("common");
    const next = { ...(common.recreateTargets || {}) };
    for (const r of active) {
      if (!r.memoKey) continue;
      if (r.lora) {
        const kind = r.target.startsWith("lm:") ? "lm" : r.target.startsWith("node:") ? "node" : r.target;
        const node = kind === "lm" || kind === "node" ? app.graph.getNodeById(Number(r.target.split(":")[1])) : null;
        next.lora = { kind, id: node?.id, type: node?.type };
        continue;
      }
      const node = app.graph.getNodeById(Number(r.target));
      if (node) next[r.memoKey] = { id: node.id, type: node.type };
    }
    savePrefs("common", { ...common, recreateTargets: next });
  }

  applyRecreate(item, rows) {
    const done = [];
    const active = rows.filter((r) => r.on && r.targets.length && r.target && r.target !== "skip");
    this.rememberRecreateTargets(active);
    // LoRAs grouped by target kind
    const loraRows = active.filter((r) => r.lora);
    const promptLoras = loraRows.filter((r) => r.target === "prompt").map((r) => r.lora);
    const byLm = new Map();
    for (const r of loraRows.filter((x) => x.target.startsWith("lm:"))) {
      const id = r.target.slice(3);
      if (!byLm.has(id)) byLm.set(id, []);
      byLm.get(id).push(r.lora);
    }
    for (const [id, list] of byLm) {
      const node = app.graph.getNodeById(Number(id));
      if (node) {
        setLoraManagerLoras(node, list);
        done.push(`${list.length}× LoRA`);
      }
    }
    for (const r of loraRows.filter((x) => x.target.startsWith("node:"))) {
      const node = app.graph.getNodeById(Number(r.target.slice(5)));
      const w = node?.widgets?.find((x) => x.type === "combo" && comboValues(x).includes(r.lora.name));
      if (!w) continue;
      setWidget(node, w, r.lora.name);
      setStrengths(node, r.lora.weight);
      done.push("LoRA");
    }
    const chain = loraRows.filter((x) => x.target === "new").map((r) => r.lora);
    if (chain.length) {
      try {
        insertLoraChain(modelRoot(), chain);
        done.push(`${chain.length}× LoraLoader`);
      } catch (e) {
        toast("error", t("newLoraLoaders"), String(e.message || e));
      }
    }
    for (const r of active.filter((x) => x.apply && !x.lora)) {
      const what = r.apply(r.target);
      if (what) done.push(what);
    }
    // prompts, with <lora:…> syntax appended to the positive one if chosen
    const loraSyntax = promptLoras.map((l) => `<lora:${fileStem(l.name)}:${l.weight}>`).join(" ");
    const pos = active.find((r) => r.prompt === "positive");
    const neg = active.find((r) => r.prompt === "negative");
    const promptNode = (r) => r && app.graph.getNodeById(Number(r.target));
    if (promptNode(pos)) {
      setNodeText(promptNode(pos), loraSyntax ? `${item.meta.prompt} ${loraSyntax}` : item.meta.prompt);
      done.push(t("rowPrompt"));
    } else if (loraSyntax) {
      const node = resolveTarget("positive", this.state.posTarget);
      if (node && node !== "none") {
        setNodeText(node, `${textWidget(node).value || ""} ${loraSyntax}`.trim());
        done.push(t("rowPrompt"));
      }
    }
    if (promptNode(neg)) {
      setNodeText(promptNode(neg), item.meta.negativePrompt);
      done.push(t("rowNegative"));
    }
    if (pos || neg) this.recordHistory(item, "both");
    app.graph.setDirtyCanvas(true, true);
    try {
      app.graph.change?.();
    } catch {}
    return done;
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

  /** toGrid: always back to the grid (new results), not to the prompt history the detail came from. */
  closeDetail(toGrid = false) {
    if (this.returnToHistory && this.detailItem && !toGrid) {
      this.returnToHistory = false;
      return this.showHistory();
    }
    this.historyOpen = false;
    this.returnToHistory = false;
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
  /** Add/remove an image to/from one of your collections on Civitai; returns the new set of collection ids. */
  async setItemCollection(item, collection, add) {
    const res = await postJson(`${API}/item_collections?domain=${encodeURIComponent(this.state.domain)}`, {
      imageId: item.id,
      add: add ? [collection.id] : [],
      remove: add ? [] : [collection.id],
    });
    toast("success", t(add ? "addedTo" : "removedFrom", { name: collection.name }));
    if (this.isFav && this.state.source === `collection:${collection.id}`) {
      // the favorites collection currently shown: drop the image from the grid / bring it back
      if (add) this.removedIds.delete(item.id);
      else this.removedIds.add(item.id);
      if (this.detailView.hidden) this.renderGrid();
      else this.gridDirty = true;
    }
    for (const p of panels.values()) if (p !== this) p.onItemCollectionsChanged(item, collection.id, add);
    return new Set(res.collectionIds || []);
  }
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
        inIds = await this.setItemCollection(item, collection, add);
        checkbox.checked = inIds.has(collection.id);
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
    const has = { meta: !!item.meta, pos: !!meta.prompt, neg: !!meta.negativePrompt, seed: meta.seed != null, image: item.type === "image" && !!item.url };
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
    if (key === "recreate") return this.openRecreate(item);
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
    if (ok && key !== "seed") this.recordHistory(item, key.startsWith("neg") ? "neg" : key.startsWith("pos") ? "pos" : "both");
  }

  /* ---------- prompt history ---------- */
  recordHistory(item, what) {
    promptHistory.add(item, what);
  }
  toggleHistory() {
    if (this.historyOpen) return this.closeDetail();
    this.showHistory();
  }
  async showHistory() {
    this.detailItem = null;
    this.historyOpen = true;
    this.detailView.querySelectorAll("video").forEach((v) => v.pause());
    const list = h("div", { class: "cf-history" }, h("div", { class: "cf-hint" }, t("loading")));
    const clearBtn = h(
      "button",
      { class: "cf-btn small", onclick: () => promptHistory.clear() },
      h("i", { class: "pi pi-trash" }),
      " ",
      t("historyClear")
    );
    this.detailView.replaceChildren(
      h(
        "div",
        { class: "cf-detail-head" },
        h("button", { class: "cf-btn", onclick: () => this.closeDetail() }, t("back")),
        h("span", { class: "cf-grow cf-history-title" }, h("i", { class: "pi pi-history" }), " ", t("historyTitle")),
        clearBtn
      ),
      h("div", { class: "cf-scroll" }, list)
    );
    this.hideGrid();
    this.detailView.hidden = false;
    const render = () => {
      if (!this.historyOpen) return promptHistory.listeners.delete(render);
      const items = promptHistory.items || [];
      clearBtn.disabled = !items.length;
      if (!items.length) return list.replaceChildren(h("div", { class: "cf-message" }, t("historyEmpty")));
      list.replaceChildren(
        ...items.map((it) => {
          const thumb =
            it.type === "video"
              ? h("img", { src: it.posterUrl || it.thumbUrl, alt: "", loading: "lazy" })
              : h("img", { src: it.thumbUrl, alt: "", loading: "lazy" });
          return h(
            "div",
            { class: "cf-hist-row" + (it.nsfwLevel >= 4 ? " cf-nsfw" : "") },
            h("button", { class: "cf-hist-thumb", title: t("ctxDetails"), onclick: () => this.openDetail(it, true) }, thumb),
            h(
              "div",
              { class: "cf-hist-body" },
              h("div", { class: "cf-hist-prompt", title: it.meta.prompt }, it.meta.prompt || it.meta.negativePrompt),
              h(
                "div",
                { class: "cf-hist-meta" },
                [it.username ? `@${it.username}` : null, timeAgo(it.at), it.meta.seed != null ? `seed ${it.meta.seed}` : null].filter(Boolean).join(" · ")
              ),
              h(
                "div",
                { class: "cf-hist-actions" },
                h("button", { class: "cf-btn small primary", onclick: () => this.insertBoth(it) }, t("applyBoth")),
                it.meta.prompt ? h("button", { class: "cf-btn small", onclick: () => this.runAction("pos", it) }, t("ctxPositive")) : null,
                it.meta.seed != null ? h("button", { class: "cf-btn small", title: t("ctxSeed"), onclick: () => this.applySampler(it.meta, ["seed"]) }, h("i", { class: "pi pi-hashtag" })) : null,
                h("button", { class: "cf-btn small", title: t("copyAll"), onclick: () => copyText(formatA1111(it.meta)) }, h("i", { class: "pi pi-copy" }))
              )
            )
          );
        })
      );
    };
    promptHistory.listeners.add(render);
    await promptHistory.load();
    render();
  }
  /** An artwork dropped on the canvas: image node -> image, text node -> prompt, sampler -> seed/steps/CFG, empty -> new Load Image. */
  dropOnCanvas(item, node, pos) {
    const meta = item.meta || {};
    if (node && imageWidget(node)) {
      if (item.type !== "image") return toast("warn", t("noData"));
      return this.imageToNode(item, node);
    }
    if (node && textWidget(node)) {
      // a node wired to a sampler's negative input gets the negative prompt
      const isNeg = samplerConditioningNode("negative") === node;
      const text = isNeg ? meta.negativePrompt : meta.prompt;
      if (!text) return toast("warn", t("noData"));
      setNodeText(node, text);
      this.recordHistory(item, isNeg ? "neg" : "pos");
      return toast("success", t("insertedInto", { node: nodeLabel(node) }));
    }
    if (node && isSamplerNode(node)) {
      if (meta.seed == null && meta.steps == null) return toast("warn", t("noData"));
      return this.applySampler(meta, ["seed", "steps", "cfg"], node);
    }
    if (!node) {
      if (item.type !== "image") return toast("warn", t("noData"));
      return this.imageToNode(item, null, pos);
    }
    toast("warn", t("noData"));
  }
  /** Download the original into ComfyUI's input folder and set it in a Load Image node. */
  async imageToNode(item, target = null, pos = null) {
    toast("info", t("imageLoading"));
    try {
      const { name } = await postJson(`${API}/image_to_input`, { url: item.url, id: item.id });
      const node = target || findOrCreateLoadImage(pos);
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
    savePrefs("common", { ...loadPrefs("common"), posTarget: this.state.posTarget, negTarget: this.state.negTarget, quickAction: this.state.quickAction });
  }

  /* ---------- context menu ---------- */
  /** Fill the "Save to collection" submenu: one click adds/removes the image, the menu stays open. */
  async collectionSubmenu(item, sub) {
    const relayout = () => sub.parentElement?.placeSub?.();
    const newEntry = () =>
      h(
        "button",
        {
          class: "cf-ctx-item",
          onclick: () => {
            closeContextMenu();
            this.openDetail(item);
            Promise.resolve(this.openPicker?.()).then(async () => {
              const input = this.detailView.querySelector(".cf-row input[type=text][maxlength='30']");
              if (!input) return;
              input.focus({ preventScroll: true });
              // the image above may still be loading and push the field out of view
              const media = this.detailView.querySelector("img, video");
              if (media && !(media.complete || media.readyState >= 1))
                await new Promise((r) => {
                  media.addEventListener("load", r, { once: true });
                  media.addEventListener("loadedmetadata", r, { once: true });
                  setTimeout(r, 2000);
                });
              input.scrollIntoView({ block: "center" });
            });
          },
        },
        iconEl("pi-plus"),
        h("span", {}, t("newCollection") + "…")
      );
    if (!shared.config?.hasKey) {
      sub.replaceChildren(h("div", { class: "cf-ctx-note" }, t("needKey")));
      return relayout();
    }
    sub.replaceChildren(h("div", { class: "cf-ctx-note" }, t("loading")));
    relayout();
    let own, inIds;
    try {
      const domain = encodeURIComponent(this.state.domain);
      const [cols, res] = await Promise.all([shared.ownCollections(), fetchJson(`${API}/item_collections?imageId=${item.id}&domain=${domain}`)]);
      own = cols;
      inIds = new Set(res.collectionIds || []);
    } catch (e) {
      if (!sub.isConnected) return;
      sub.replaceChildren(h("div", { class: "cf-ctx-note error" }, String(e.message || e)));
      return relayout();
    }
    if (!sub.isConnected) return; // menu closed meanwhile
    const rows = own.map((c) => {
      const check = h("i", { class: "pi" });
      const btn = h("button", { class: "cf-ctx-item cf-ctx-check" }, check, h("span", {}, c.name));
      const paint = () => {
        const on = inIds.has(c.id);
        check.className = on ? "pi pi-check" : "pi";
        btn.classList.toggle("checked", on);
      };
      paint();
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        btn.disabled = true;
        try {
          inIds = await this.setItemCollection(item, c, !inIds.has(c.id));
        } catch (err) {
          toast("error", t("saveToCollection"), String(err.message || err));
        } finally {
          btn.disabled = false;
          paint();
        }
      });
      return btn;
    });
    sub.replaceChildren(
      h("div", { class: "cf-ctx-list" }, rows.length ? rows : h("div", { class: "cf-ctx-note" }, t("noOwnCollections"))),
      h("div", { class: "cf-ctx-sep" }),
      newEntry()
    );
    relayout();
  }
  showContextMenu(item, x, y) {
    closeContextMenu();
    const meta = item.meta || {};
    const entries = [];
    const add = (icon, label, fn, enabled = true, bold = false) => entries.push({ icon, label, fn, enabled, bold });
    const sep = () => entries.length && entries[entries.length - 1] !== "-" && entries.push("-");
    for (const a of this.actionsFor(item)) {
      add(a.icon, t(a.label), a.run, a.enabled, a.key === this.state.quickAction);
      if (a.key === "recreate" || a.key === "negSeed" || a.key === "sampler") sep();
    }
    const wf = extractWorkflow(meta);
    if (wf) add("pi-sitemap", t("loadWorkflow"), () => this.loadWorkflow(wf));
    sep();
    add("pi-copy", t("ctxCopyPrompt"), () => copyText(meta.prompt), !!meta.prompt);
    add("pi-copy", t("ctxCopySeed"), () => copyText(String(meta.seed)), meta.seed != null);
    add("pi-clone", t("copyAll"), () => copyText(formatA1111(meta)), !!item.meta);
    sep();
    add("pi-window-maximize", t("ctxDetails"), () => this.openDetail(item));
    entries.push({ icon: "pi-bookmark", label: t("saveToCollection"), enabled: true, submenu: (anchor) => this.collectionSubmenu(item, anchor) });
    if (item.username) add("pi-user", t("ctxUser", { user: item.username }), () => this.showUser(item.username));
    add("pi-external-link", t("openCivitai"), () => window.open(item.pageUrl, "_blank", "noopener"));

    const menu = h(
      "div",
      { class: "cf-ctxmenu", oncontextmenu: (e) => e.preventDefault() },
      entries.map((en) => {
        if (en === "-") return h("div", { class: "cf-ctx-sep" });
        if (en.submenu) {
          const btn = h(
            "button",
            { class: "cf-ctx-item cf-ctx-parent", onclick: () => openSub(btn, en) },
            iconEl(en.icon),
            h("span", {}, en.label),
            h("i", { class: "pi pi-chevron-right cf-ctx-arrow" })
          );
          btn.addEventListener("mouseenter", () => openSub(btn, en));
          return btn;
        }
        const btn = h(
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
        );
        btn.addEventListener("mouseenter", closeSub);
        return btn;
      })
    );
    let sub = null;
    let subOwner = null;
    function closeSub() {
      sub?.remove();
      sub = subOwner = null;
      menu.querySelector(".cf-ctx-parent.open")?.classList.remove("open");
    }
    function openSub(btn, en) {
      if (subOwner === btn) return;
      closeSub();
      subOwner = btn;
      btn.classList.add("open");
      sub = h("div", { class: "cf-ctxmenu cf-ctxsub" });
      menu.append(sub);
      en.submenu(sub);
      placeSub();
    }
    // next to the parent entry; flips left / up when there's no room
    function placeSub() {
      if (!sub || !subOwner) return;
      const b = subOwner.getBoundingClientRect();
      const r = sub.getBoundingClientRect();
      const left = b.right + r.width + 4 <= window.innerWidth ? b.right + 2 : b.left - r.width - 2;
      sub.style.left = `${Math.max(4, left)}px`;
      sub.style.top = `${Math.max(4, Math.min(b.top - 5, window.innerHeight - r.height - 4))}px`;
    }
    menu.placeSub = placeSub;
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
    if (done) this.recordHistory(item, "both");
    if (!done && this.state.posTarget === "none" && this.state.negTarget === "none")
      toast("info", t("targetNone", { kind: `${t("prompt")} + ${t("negative")}` }));
  }
  applySampler(meta, fields = ["seed", "steps", "cfg"], target = null) {
    const node = target || findSampler();
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
  { key: "recreate", label: "recreate", icon: "pi-sitemap", needs: ["meta"] },
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
let activeRecreate = null;
function closeRecreate() {
  activeRecreate?.remove();
  activeRecreate = null;
}
function closeContextMenu() {
  activeMenu?.remove();
  activeMenu = null;
}
document.addEventListener("mousedown", (e) => activeMenu && !activeMenu.contains(e.target) && closeContextMenu(), true);
document.addEventListener(
  "keydown",
  (e) => {
    if (e.key === "Escape" && activeRecreate && !activeMenu) {
      e.preventDefault();
      e.stopPropagation();
      closeRecreate();
      return;
    }
    if (e.key === "Escape" && activeMenu) {
      e.preventDefault(); // close the menu, not full width
      closeContextMenu();
    }
  },
  true
);
/* ---------- videos: never play where nobody can see them ---------- */
// A looping video keeps the browser's GPU busy: pause it when it is scrolled out of view,
// when the panel is closed / another sidebar tab is shown, or when the browser tab is hidden.
const videoObserver = new IntersectionObserver((entries) => {
  for (const e of entries) {
    const v = e.target;
    if (!e.isIntersecting) v.pause();
    else if (v._cfResume && document.visibilityState === "visible") v.play().catch(() => {});
  }
});
function pauseWhenHidden(video, resume) {
  video._cfResume = resume; // detail video: continue when visible again; grid videos only play on hover
  videoObserver.observe(video);
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible") document.querySelectorAll(".civitai-favorites video").forEach((v) => v.pause());
});

/* ---------- drag & drop onto the canvas ---------- */
let dragItem = null; // {panel, item} while an artwork is dragged
function canvasDropInfo(e) {
  const canvas = app.canvas?.canvas;
  if (!canvas || !dragItem) return null;
  const r = canvas.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return null;
  // the panel itself may lie above the canvas
  const top = document.elementFromPoint(e.clientX, e.clientY);
  if (top && top !== canvas && !canvas.contains(top) && top.closest?.(".civitai-favorites, .cf-modal-backdrop")) return null;
  const ds = app.canvas.ds;
  const pos = [(e.clientX - r.left) / ds.scale - ds.offset[0], (e.clientY - r.top) / ds.scale - ds.offset[1]];
  const node = app.graph.getNodeOnPos?.(pos[0], pos[1], graphNodes()) || null;
  return { pos, node };
}
window.addEventListener(
  "dragover",
  (e) => {
    if (!dragItem) return;
    if (canvasDropInfo(e)) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  },
  true
);
window.addEventListener(
  "drop",
  (e) => {
    if (!dragItem) return;
    const info = canvasDropInfo(e);
    const { panel, item } = dragItem;
    dragItem = null;
    panel.root.classList.remove("cf-dragging");
    if (!info) return;
    // ours: don't let ComfyUI treat it as a file/URL drop
    e.preventDefault();
    e.stopPropagation();
    panel.dropOnCanvas(item, info.node, info.pos);
  },
  true
);

// detail view: ← / → browse, Esc back to the grid (not while typing, not under a menu/dialog)
document.addEventListener(
  "keydown",
  (e) => {
    if (activeMenu || activeRecreate || e.ctrlKey || e.metaKey || e.altKey) return;
    if (!["ArrowLeft", "ArrowRight", "Escape"].includes(e.key)) return;
    const el = e.target;
    if (el?.closest?.("input, textarea, select, [contenteditable=''], [contenteditable='true']")) return;
    const panel = [...panels.values()].find((p) => !p.detailView.hidden && p.root.isConnected && p.root.offsetParent !== null);
    if (!panel) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.key === "Escape") panel.closeDetail();
    else panel.stepDetail(e.key === "ArrowRight" ? 1 : -1);
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
      // resume a detail video that was paused when the tab was left
      panel.detailView.querySelectorAll("video").forEach((v) => !panel.detailView.hidden && v._cfResume && v.play().catch(() => {}));
    },
    // tab closed or another sidebar tab opened: stop videos (they'd keep the GPU busy off-screen)
    destroy: () => panels.get(mode)?.root.querySelectorAll("video").forEach((v) => v.pause()),
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
