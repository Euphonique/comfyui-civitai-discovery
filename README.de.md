# Civitai Discovery für ComfyUI

*[English version](README.md)*

Ein ComfyUI-Plugin mit zwei neuen Panels in der linken Seitenleiste:

- 🧭 **Civitai Discovery**: der allgemeine Civitai-Feed mit Bildern und Videos
- ❤ **Civitai Favoriten**: deine Collections und Reaktionen, inklusive Verwaltung der Collections

In beiden kannst du filtern, Prompts mit einem Klick in Prompt-Nodes übernehmen und Bilder in deine Civitai-Collections speichern. Gespeichert wird direkt auf Civitai, nicht nur lokal.

<img width="3038" height="1464" alt="Bildschirmfoto vom 2026-11-17 23-51-54" src="https://github.com/user-attachments/assets/967a3e79-cd95-49cf-ae65-5c588f0b8c5a" />
</br></br>
<img height="535" alt="Bildschirmfoto vom 2026-11-17 23-51-00" src="https://github.com/user-attachments/assets/72dbe638-7dc2-4e2b-83dd-f737298a511c" /> 
<img height="535" alt="Bildschirmfoto vom 2026-11-17 23-55-28" src="https://github.com/user-attachments/assets/7f3a5a99-fe6a-414a-b161-9c2cb05fface" /> 
<img height="535" alt="Bildschirmfoto vom 2026-11-17 23-54-40" src="https://github.com/user-attachments/assets/6b3762d5-79eb-44c7-86ff-f5a13f110943" />

*[mehr Screenshots](screenshots.md)*

## Funktionen

### Civitai Discovery
- **Sortierung**: meiste Reaktionen, meiste Kommentare, am häufigsten gesammelt, neueste
- **Zeitraum**: Tag, Woche, Monat, Jahr, gesamt
- **Basismodell**: z. B. SD 1.x, SDXL, Pony, Illustrious, NoobAI, Flux, Krea, Qwen, Wan Video. Oben stehen die beliebtesten Familien, darunter alle weiteren. Civitai filtert direkt auf dem Server, deshalb funktioniert das auch bei seltenen Modellen.
- Sortierung, Zeitraum und Basismodell stehen in einer Zeile. Darunter klappt **Erweitert** die übrigen Filter auf: Medientyp, Metadaten (mit, mit Prompt, ohne), Rating und NSFW verpixeln. Weichen dort Filter vom Standard ab, zeigt der eingeklappte Bereich ihre Anzahl, z. B. „Erweitert (1)“.
- **Medientyp und Rating** werden ebenfalls auf dem Server gefiltert.
- **Leute, denen du folgst** (👥-Button im Kopf): nur Werke der User, denen du auf Civitai folgst, mit derselben Sortierung, demselben Zeitraum und denselben Filtern. Braucht einen API-Key.
- **Bilder mit einem Modell**: Der 🖼-Button neben einem Checkpoint oder einer LoRA in der Ressourcenliste zeigt die Galerie dieser Modellversion (gesamter Zeitraum). Klappt auch aus dem Favoriten-Tab, der dann zu Discovery wechselt.
- Funktioniert auch ohne API-Key. Für Inhalte ab R über civitai.red und zum Speichern in Collections brauchst du aber einen Key.

### Civitai Favoriten
- **Dropdown**: deine Collections, Collections, denen du folgst (markiert mit ↗), deine Reaktionen (👍 ❤️ 😂 😢) und zuletzt angesehene User
- **Collections verwalten** über die Buttons neben dem Dropdown:
  - **+** legt eine neue Collection an (Name, Beschreibung, Sichtbarkeit: privat, nicht gelistet, öffentlich)
  - **✎** bearbeitet die gewählte Collection
  - **🗑** löscht sie nach einer Rückfrage. Die Bilder selbst bleiben erhalten.
  - Bearbeiten und Löschen gehen nur bei eigenen Collections.
- **Filter**: Sortierung und Basismodell (mit Anzahl; nur Familien, die in der Ansicht vorkommen) in einer Zeile. Unter **Erweitert**: Medientyp, Metadaten, Rating und NSFW verpixeln.

### Suche und Tags
Das Suchfeld oben in beiden Panels versteht drei Arten von Eingaben, auch gemischt in einer Zeile, z. B. `#animal #forest @someone misty morning`:

- **#Tag**: Mit `#` markierte Wörter werden als Tags übernommen. Mehrwortige Tags gehen auch mit Leerzeichen: `#star trek` findet den Tag „star trek“. Es gewinnt die längste Wortfolge, die ein Tag ist, also ergibt `#star trek misty forest` den Tag „star trek“ plus den Text „misty forest“. Unterstrich oder Anführungszeichen gehen weiterhin: `#black_hair` oder `#"black hair"`. Beim Tippen von `#…` schlägt das Feld passende Tags vor, auch mit Leerzeichen. Ein dort ausgewählter Tag bleibt, wie er ist, und Wörter danach sind Suchtext. Der erste Enter vervollständigt den Tag, der zweite startet die Suche. Gibt es einen Tag nicht, wird das Wort als Text gesucht, und ein Hinweis erscheint.
- **Ohne #**: Enter startet immer eine Textsuche (der erste, vorausgewählte Vorschlag). Darunter schlägt das Feld passende Tags vor; ein Klick übernimmt einen davon als Tag. Das sind die Tags aus den geladenen Ergebnissen mit Anzahl, und mit API-Key zusätzlich alle passenden Tags auf Civitai. Gewählte Tags erscheinen als Chips und lassen sich mit × wieder entfernen. Mehrere Tags werden mit UND verknüpft.
  - In **Discovery** filtert Civitai selbst. Die Suche läuft also über den ganzen Feed.
  - In den **Favoriten** wird innerhalb der geladenen Bilder gefiltert.
- **@User**: zeigt alle Werke dieses Users.
- **Freier Text** (alle Wörter ohne `#` oder `@`), kombinierbar mit Tags, Basismodell, Medientyp und User:
  - **Civitai-Textsuche:** Civitai hat eine neue semantische Bildersuche, schaltet sie aber nur für einen Teil der Accounts frei (schrittweise Einführung). Sie braucht außerdem einen API-Key mit vollem Zugriff. Ist sie für dich freigeschaltet, sucht Discovery damit über alle Bilder auf Civitai. Der Chip heißt dann „Suche „…““.
  - **Fallback:** Lehnt Civitai die Suche ab, und in den Favoriten immer, filtert das Panel die Prompts der geladenen Bilder: Treffer müssen alle eingegebenen Wörter enthalten, bei Bedarf lädt das Panel Seiten nach. Der Chip heißt dann „Prompt enthält „…““.

Der Button **Tags** blendet eine **Tag-Cloud** ein:
- **In den Ergebnissen**: die häufigsten Tags der angezeigten Bilder. Je größer der Tag, desto häufiger kommt er vor.
- **Trending auf Civitai**: nur in Discovery und nur mit API-Key.

Ein Klick auf einen Tag übernimmt ihn in die Suche. In der **Detailansicht** stehen alle Tags eines Werks, und ein Klick darauf übernimmt ihn ebenfalls.

Liefert eine Kombination keine Treffer, zeigt das Panel einen Hinweis mit den Buttons **Zeitraum: Gesamt** und **Suche & Filter zurücksetzen**. Mehrere Tags plus kurzer Zeitraum plus Basismodell können schnell leer ausgehen.

### In beiden Panels
- **Volle Breite**: Der Button ⧉ oben im Panel zieht das Panel über die ganze Arbeitsfläche. Ein zweiter Klick, Esc oder ein Wechsel des Seitenleisten-Tabs holt es zurück. In voller Breite gibt es mehr Spalten im Raster, und die Detailansicht zeigt das Bild links und die Infos rechts.
- **Raster** mit Infinite Scroll. Videos spielen beim Drüberfahren ab, ein `META`-Badge markiert Einträge mit Metadaten.
- **Ziehen und Ablegen** eines Werks auf die Arbeitsfläche:
  - auf einen **Load-Image-Node**: setzt das Bild
  - auf einen **Prompt-Node**: fügt den Prompt ein (den Negativ-Prompt, wenn der Node am `negative`-Eingang eines Samplers hängt)
  - auf einen **Sampler**: setzt Seed, Steps und CFG
  - auf eine freie Stelle: legt dort einen neuen Load-Image-Node an
  
  In voller Breite wird das Panel beim Ziehen durchsichtig, damit du an die Arbeitsfläche kommst.
- **Prompt-Verlauf** (🕘-Button im Kopf): die letzten 50 Werke, deren Prompt du in einen Node geschickt hast, neueste zuerst. Der Verlauf gilt für beide Tabs und liegt auf dem Server (`history.json`). Jeden Eintrag kannst du erneut einfügen (Prompt + Negativ, nur Prompt, Seed), kopieren oder in der Detailansicht öffnen.
- **Schnell-Button**: Beim Drüberfahren über ein Bild erscheint ein Button. Was er macht, stellst du in den Einstellungen (⚙) unter **Schnell-Button auf den Bildern** ein; Standard ist „Im Workflow nachbauen…“. Zur Wahl stehen alle Aktionen aus dem Kontextmenü, die etwas in den Workflow übernehmen.
- **Tooltip**: Kurz über einem Bild verweilen zeigt eine kompakte Vorschau: Prompt (gekürzt), Negativ-Prompt, Parameter, Tags, Reaktionen und User.
- **Kontextmenü** (Rechtsklick auf ein Bild):
  - Prompt + Negativ → Nodes, Prompt + Negativ + Seed
  - Nur Prompt → Node, Prompt + Seed
  - Nur Negativ → Node, Negativ + Seed
  - Seed → Sampler, Seed/Steps/CFG → Sampler, ComfyUI-Workflow laden
  - **Bild → Load-Image-Node**: lädt das Originalbild in den `input`-Ordner von ComfyUI (als `civitai_<id>.<endung>`) und setzt es im ausgewählten Load-Image-Node. Ist keiner ausgewählt, nimmt es den ersten im Workflow, und gibt es keinen, legt es einen an. Das geht nur mit Bildern, nicht mit Videos, und gibt es auch als Button in der Detailansicht.
  - Die Aktion des Schnell-Buttons ist im Menü fett markiert.
  - „Prompt + Negativ“ beachtet die Ziel-Einstellung „Keiner“. Die Einzel- und Seed-Kombinationen übernehmen immer; steht ein Ziel auf „Keiner“, gilt dafür Auto. Fehlt einem Bild der Seed, übernehmen die Kombinationen nur den Prompt.
  - Prompt kopieren, Seed kopieren, Alles kopieren
  - Im Workflow nachbauen…, Details öffnen, Werke von @User, Auf Civitai öffnen
  - **In Collection speichern** öffnet ein Untermenü mit all deinen Collections. Ein Häkchen zeigt, wo das Bild schon liegt, ein Klick fügt es hinzu oder entfernt es sofort. Das Menü bleibt offen, du kannst also mehrere Collections nacheinander anhaken. „Neue Collection…“ öffnet die Detailansicht mit dem Namensfeld.
  - Einträge, für die das Bild keine Daten hat, sind ausgegraut.
- **Detailansicht** (Klick auf ein Bild): **←/→** (oder die Pfeile neben „Zurück“) springen zum vorherigen bzw. nächsten Werk und laden am Ende nach. **Esc** führt zurück zum Raster.
  - **Reaktionen** unter dem Bild: 👍 ❤️ 😂 😢 mit Anzahl, dazu die Zahl der Kommentare (💬, öffnet die Seite auf Civitai). Mit API-Key sind deine eigenen Reaktionen hervorgehoben, und ein Klick setzt oder entfernt sie direkt auf Civitai. Dafür braucht der Key Schreibrechte („Social: write“); ein Key mit vollem Zugriff hat sie.
  - **In Collection speichern**: Liste deiner Collections mit Häkchen; ein Klick fügt das Bild hinzu oder entfernt es. Darunter kannst du direkt eine neue Collection anlegen, das Bild landet dann gleich darin.
  - Prompt und Negativ-Prompt, jeweils mit „Kopieren“ und „→ Node“
  - „Prompt + Negativ → Nodes“ füllt beide auf einmal
  - „Seed/Steps/CFG → Sampler“
  - „ComfyUI-Workflow laden“, falls das Bild einen eingebetteten Workflow hat
  - **Parameter** mit dem tatsächlich verwendeten **Checkpoint** (Modellname und Version, verlinkt auf die Civitai-Modellseite)
  - **Ressourcen**, gegliedert in Checkpoint, LoRAs (mit Gewicht) und Sonstige (Embeddings, Upscaler …), jeweils mit Link zu Civitai. Civitai liefert die Modellversionen eines Bildes mit. Fehlen sie, sucht das Plugin anhand der Hashes in den Metadaten. Was sich nicht zuordnen lässt, erscheint grau ohne Link.
  - alle Metadaten als JSON, Link zum Bild auf Civitai
  - Ein Klick auf den **Benutzernamen** zeigt alle Werke dieses Users.

### Lokale Modelle, Downloads und „Im Workflow nachbauen“

**In der Ressourcenliste** der Detailansicht siehst du bei jedem Checkpoint, jeder LoRA, jedem Embedding usw., ob du es schon hast:
- **✓ grün**: in den Modellordnern von ComfyUI über den SHA256-Hash gefunden
- **✓ gelb**: Es gibt eine Datei mit gleichem Namen, der Hash wurde aber nicht geprüft.
- **⬇**: lokal nicht vorhanden. Ein Klick öffnet ein kleines Formular zum Herunterladen direkt in ComfyUI:
  - **Modelltyp:** bei Checkpoints `checkpoints` oder `diffusion_models`
  - **Modellordner:** alle Ordner, die ComfyUI kennt, inklusive `extra_model_paths.yaml`. Vorausgewählt ist der mit den meisten Modellen.
  - **Unterordner:** optional
  
  Die Auswahl wird pro Modelltyp und Basismodell gespeichert. Der Fortschritt erscheint in der Liste, und die Datei wird danach mit dem SHA256 von Civitai abgeglichen. Civitai erlaubt Downloads nur mit API-Key.

So findet das Plugin deine Modelle, ohne alles zu hashen: Es liest zuerst die Hashes, die andere Tools schon neben den Dateien ablegen (LoRA Manager `.metadata.json`, Stability Matrix `.cm-info.json`, `.sha256`-Dateien). Nur Dateien, deren Größe genau zur Civitai-Datei passt, werden einmalig gehasht und in `hashes.json` gespeichert.

**Im Workflow nachbauen…** (Button unter den Ressourcen oder im Kontextmenü) öffnet einen Dialog. Er zeigt, was das Bild verwendet hat und wohin es in deinem aktuellen Workflow käme:

| Zeile | Mögliche Ziele |
|---|---|
| Checkpoint | jeder Node, dessen Dropdown genau diese Datei anbietet (Load Checkpoint, UNET-Loader, eigene Loader …) |
| LoRA | **LoRA-Manager-Loader** (`Lora Loader (LoraManager)`: Die LoRAs werden in sein Textfeld geschrieben und mit ihrem Gewicht aktiviert; ersetzt die LoRAs in diesem Node) · jeder Loader mit `lora_name`-Dropdown · **neue LoRA-Loader** (hinter dem Checkpoint eingefügt und mit allem verbunden, was vorher am Checkpoint hing) · `<lora:name:gewicht>` im Prompt · überspringen |
| Prompt / Negativ | die Prompt-Ziele aus den Einstellungen |
| Sampler | Seed (auf „fixed“ gestellt), Steps, CFG, Sampler und Scheduler (A1111-Namen wie „DPM++ 2M Karras“ werden übersetzt) |
| Auflösung | der Latent-Node am Sampler. Kommen width/height aus einem anderen Node, wird dieser gesetzt: Zahlen-Nodes bekommen die genauen Werte, ein **Resolution Selector** das nächstliegende Seitenverhältnis und die Megapixel (der Dialog zeigt die resultierende Größe) |
| Clip Skip | ein `CLIP Set Last Layer`-Node, falls vorhanden |

Jede Zeile lässt sich abwählen oder umleiten. Geändert wird erst, wenn du auf **Übernehmen** klickst. Fehlende Modelle kannst du direkt im Dialog herunterladen, danach sind sie auswählbar. Fehlende LoRAs sind standardmäßig abgewählt. Die Nodes, in die du übernommen hast, merkt sich das Plugin und schlägt sie beim nächsten Mal wieder vor: denselben Node, wenn er im Workflow ist, sonst einen Node gleichen Typs. Bei Prompts gilt nur derselbe Node, sonst greifen die Prompt-Einstellungen.

### Welcher Node bekommt den Prompt?

In den Einstellungen (⚙) unter **Prompts einfügen in** gibt es die Felder **Prompt →** und **Negativ →**. Sie gelten für beide Panels, und die letzte Auswahl wird gespeichert. Steht dort **Auto**, gilt:

- **Positiv**: der aktuell ausgewählte Text-/Prompt-Node; ist keiner ausgewählt, der Node am `positive`-Eingang des Samplers
- **Negativ**: der Node am `negative`-Eingang des Samplers

Du kannst stattdessen einen festen Node aus der Liste wählen. Fehlt dieser Node in einem anderen Workflow, verhält sich das Feld wie **Auto**. Mit **Keiner** wird der jeweilige Prompt nie übernommen, z. B. wenn du nur den positiven Prompt willst.

## Installation

**Über den ComfyUI-Manager** (sobald das Plugin in der Comfy Registry veröffentlicht ist): Im Manager nach „Civitai Discovery“ suchen, installieren und ComfyUI neu starten.

**Manuell:**

```bash
cd ComfyUI/custom_nodes
git clone https://github.com/Euphonique/comfyui-civitai-discovery
```

Alternativ den Ordner einfach nach `ComfyUI/custom_nodes/` kopieren oder dort verlinken. Zusätzliche Python-Pakete brauchst du nicht, `aiohttp` bringt ComfyUI schon mit. Danach ComfyUI neu starten und den Browser neu laden.

Du brauchst ein aktuelles ComfyUI-Frontend mit Seitenleisten-Tabs (ab etwa v1.3).

## API-Key

1. Auf civitai.com unter **Account Settings → API Keys** einen Key erstellen. Ein Key mit vollem Zugriff reicht. Bei eingeschränkten Keys braucht er mindestens:
   - **Collections: read** und **Media: read** zum Ansehen
   - **Collections: write** zum Speichern in Collections und zum Anlegen, Bearbeiten und Löschen
   - **User: read** und **Social: write**, um eigene Reaktionen zu sehen und zu vergeben
2. In einem der beiden Panels auf ⚙ klicken, den Key eintragen und speichern. Der Key gilt für beide Panels.

Der Key wird nur serverseitig in `config.json` im Plugin-Ordner gespeichert (Dateirechte `600`) und nie an den Browser zurückgegeben. Alternativ kannst du die Umgebungsvariable `CIVITAI_API_KEY` setzen. Ist ein Key hinterlegt, schickt das Plugin ihn bei jeder Anfrage mit, auch beim Discovery-Feed.

### Gespeicherte Einstellungen

Alle Panel-Einstellungen bleiben auch über einen Neustart von ComfyUI erhalten und gelten in jedem Browser und auf jedem Gerät:

- **API-Key** in `config.json`
- **Dropdowns, Filter und Suche** (gewählte Collection, Sortierung, Zeitraum, Basismodell, Rating, Domain, NSFW-Unschärfe, gewählte Tags, Suchtext, Tag-Cloud und „Erweitert“ offen/zu, zuletzt angesehene User, Ziel-Nodes für Prompt/Negativ, Aktion des Schnell-Buttons) in `prefs.json`

Beide Dateien liegen im Plugin-Ordner auf dem ComfyUI-Server. Der Browser hält nur eine Kopie für den Fall, dass der Server nicht erreichbar ist. Der Prompt-Verlauf liegt separat in `history.json`. Nicht gespeichert werden eine gerade offene User- oder Modell-Ansicht in Discovery und die volle Breite.

### civitai.com vs. civitai.red

Civitai liefert Inhalte ab Rating R nur über **civitai.red** aus. Über civitai.com begrenzt die API die Anfragen auf PG/PG-13. In den Einstellungen (⚙) gibt es deshalb die Option **Domain**, die für beide Panels gilt:

- **Auto** (Standard): civitai.red, sobald das gewählte Rating R, X oder XXX enthält, sonst civitai.com
- **civitai.com** oder **civitai.red**: feste Domain

## Technische Hinweise

- **„Meist gesammelt“ / „Meist kommentiert“ mit Zeitraum**: Civitai liefert dann nur Bilder, die *in diesem Zeitraum* gesammelt bzw. kommentiert wurden. Ein Tag oder Basismodell ergibt bei „Woche“ oder „Monat“ deshalb oft nichts, während „Meiste Reaktionen“ viele Treffer findet. Das Panel erklärt das in diesem Fall und bietet an, Sortierung oder Zeitraum umzustellen.
- **Discovery** nutzt die öffentliche REST-API (`GET /api/v1/images` mit `sort`, `period`, `type`, `baseModels`, `username`, `tags`, `withTags`).
- **Textsuche** nutzt die tRPC-Prozedur `semanticImageSearch.search`. Civitai schaltet sie per Feature-Flag nur für einen Teil der Accounts frei, und sie braucht einen API-Key mit vollem Zugriff. Antwortet Civitai mit 401/403, fällt das Plugin für die laufende Sitzung auf den Prompt-Filter zurück.
- **Tag-Vorschläge und Trending-Tags** kommen aus den tRPC-Endpunkten `tag.getAll` und `tag.getTrending` und brauchen deshalb einen API-Key. Die Tag-Cloud „In den Ergebnissen“ und die Tags der Bilder funktionieren ohne Key.
- **Favoriten**: Die öffentliche API kann nicht nach Collections filtern. Das Plugin nutzt deshalb die tRPC-Endpunkte der Website (`collection.getAllUser`, `image.getInfinite`), die einen API-Key als Bearer-Token akzeptieren. Die Metadaten jeder Seite holt es danach gesammelt über `/api/v1/images?ids=…&withMeta=true`.
- **Reaktionen**: Die Anzahlen kommen aus der REST-API (`stats`). Eigene Reaktionen liest das Plugin über `reaction.getMyImageReactions` und setzt sie über `reaction.toggle` (tRPC). Civitai aktualisiert die Zähler teils verzögert, deshalb passt das Plugin die Anzeige nach einem Klick selbst an.
- **Bild → Node** lädt nur von `image.civitai.com` (keine beliebigen URLs, höchstens 60 MB) und speichert in den `input`-Ordner von ComfyUI. Ein schon vorhandenes Bild mit derselben ID wird wiederverwendet.
- **Checkpoint und LoRAs** kommen aus `GET /api/v1/model-versions/{id}` (für die `modelVersionIds` eines Bildes) bzw. `/api/v1/model-versions/by-hash/{hash}`. Die Ergebnisse speichert der ComfyUI-Server bis zum Neustart zwischen.
- **Schreibzugriffe** laufen über die tRPC-Mutationen `collection.saveItem`, `collection.upsert` und `collection.delete`. Die öffentliche API kann Collections nur lesen.
- Diese tRPC-Endpunkte sind intern und können sich ohne Ankündigung ändern. Bricht etwas, liegt es meist an [`civitai_client.py`](civitai_client.py).
- **Downloads** akzeptieren nur Civitai-Download-URLs (`/api/download/models/…`) und schreiben nur in die Modellordner von ComfyUI. `..` im Pfad ist nicht erlaubt, und vorhandene Dateien werden nie überschrieben. Sie laufen als Hintergrund-Jobs auf dem Server; eine `.part`-Datei wird erst nach der SHA256-Prüfung umbenannt.
- Alle Anfragen laufen über das ComfyUI-Backend (`/civitai_discovery/*`). Dadurch gibt es keine CORS-Probleme und der Key bleibt auf dem Server.
- Der Metadaten-Filter arbeitet im Browser (die API bietet dafür keinen funktionierenden Filter). Bei Bedarf lädt das Plugin automatisch Seiten nach: höchstens 5 am Stück ohne Treffer, danach über „Mehr laden“.

## Dateien

| Datei | Zweck |
|---|---|
| `__init__.py` | Einstiegspunkt für ComfyUI, `WEB_DIRECTORY` |
| `civitai_routes.py` | HTTP-Routen im ComfyUI-Server, Speicherung des API-Keys |
| `civitai_client.py` | Civitai-API-Client (REST + tRPC, Lesen und Schreiben) |
| `local_models.py` | Welche Ressourcen lokal vorhanden sind (Hash-Abgleich, Cache in `hashes.json`) |
| `downloads.py` | Downloads im Hintergrund in die Modellordner |
| `web/civitai_discovery.js` | Beide Panels, Filter, Collection-Verwaltung, Einfügen in Nodes (DE/EN je nach ComfyUI-Sprache) |
| `web/civitai_discovery.css` | Styles (nutzen die Theme-Variablen von ComfyUI) |
| `web/base_models.json` | Zuordnung Basismodell → Familie („SDXL 1.0“ → „Stable Diffusion XL“), erzeugt aus Civitais `basemodel.constants.ts` |
