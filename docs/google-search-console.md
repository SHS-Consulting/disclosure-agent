# Google Search Console — Einrichtungsanleitung

## Schritt 1: Property hinzufügen
1. Gehe zu https://search.google.com/search-console
2. Klicke auf **"Property hinzufügen"**
3. Wähle **"URL-Präfix"** und gib ein: `https://uap-disclosure.now`
4. Klicke auf **"Weiter"**

## Schritt 2: Domain verifizieren
Wähle die Methode **"HTML-Tag"**:
1. Kopiere den Meta-Tag: `<meta name="google-site-verification" content="DEIN-CODE">`
2. Füge ihn in `/home/ubuntu/disclosure-agent-pwa/client/index.html` im `<head>` ein
3. Klicke in GSC auf **"Bestätigen"**

**Alternative:** DNS-TXT-Eintrag bei deinem Domain-Provider (kitaskforce.com)

## Schritt 3: Sitemap einreichen
1. In GSC: Linkes Menü → **"Sitemaps"**
2. Gib ein: `sitemap.xml`
3. Klicke auf **"Senden"**
4. Status sollte nach 24h auf **"Erfolgreich"** wechseln

## Schritt 4: FAQPage Rich Snippets aktivieren
Die Schema.org FAQPage ist bereits eingebaut. Nach Sitemap-Einreichung:
- Google prüft die strukturierten Daten automatisch
- Unter **"Verbesserungen" → "FAQ"** erscheint der Status
- Rich Snippets in Suchergebnissen erscheinen nach 1–7 Tagen

## Schritt 5: Indexierung prüfen
1. GSC → **"URL-Überprüfung"**
2. Gib `https://uap-disclosure.now` ein
3. Klicke auf **"Indexierung beantragen"**

## Wichtige URLs
- Hauptdomain: https://uap-disclosure.now
- Sitemap: https://uap-disclosure.now/sitemap.xml
- robots.txt: https://uap-disclosure.now/robots.txt

## Erwartete Timeline
- Tag 1: Property verifiziert, Sitemap eingereicht
- Tag 2–3: Erste Crawls erscheinen in GSC
- Tag 7: FAQPage Rich Snippets aktiv
- Tag 14–30: Vollständige Indexierung + Ranking-Daten
