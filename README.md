# Disclosure Agent v5.3 · KI Taskforce
**Live:** https://disclosure.kitaskforce.com

UAP Intelligence Hub — Pentagon Akten, weltweite Fälle, Kongruenz-Analyse, Claude-powered KI Agent.

## Inhalt
- 54 weltweite Fälle
- 31 Schlüsselpersonen  
- 28 Kongruenz-Thesen (1× Score 10/10)
- 12 Operationen + DIA FOIA-Dokumente
- 7 widerlegte Fälle
- 8 stärkste Beweise

## Update-Workflow
Alle Inhalte liegen in `data/*.json` — App lädt alles dynamisch.
Neue Fälle/Personen/Thesen: JSON updaten → GitHub push → Manus deployed automatisch.

## Dateistruktur
```
index.html          ← Haupt-App + Claude Sonnet API Agent
manifest.json       ← PWA-Konfiguration
sw.js               ← Service Worker / Offline
assets/logo.jpg     ← KI Taskforce Logo
data/
  cases.json        ← Weltweite Fälle
  people.json       ← Schlüsselpersonen
  congruence.json   ← Kongruenz-Thesen
  operations.json   ← Operationen + DIA Docs
  debunked.json     ← Widerlegte Fälle
  strongest.json    ← Stärkste Beweise
```

## Add-Commands für neue Inhalte
```
ADD_CASE: Titel | Region | Level | Datum | Ort | Beschreibung | URL | tags
ADD_PERSON: Name | Rolle | Bio | Tags | URL | Emoji
ADD_CONGRUENCE: Titel | Score | Quellen...
ADD_DEBUNKED: Titel | Verdict | Konfidenz% | Beschreibung
ADD_STRONGEST: Titel | Score | Warum stark | URL
```

## Tech Stack
- Vanilla HTML/CSS/JS — kein Build-System nötig
- Claude Sonnet 4 API (api.anthropic.com/v1/messages)
- PWA mit Service Worker (Offline-Support)
- Data-driven: alle Inhalte in JSON, kein Hardcode

## KI Taskforce
kitaskforce.com · SH Schmidt Consulting · Berlin-Adlershof
