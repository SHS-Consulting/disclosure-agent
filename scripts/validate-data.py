#!/usr/bin/env python3
"""
Disclosure Agent - Daten-Validierungs-Skript
Prüft alle JSON-Dateien auf Pflichtfelder und Konsistenz.
Ausführen: python3 scripts/validate-data.py
"""
import json, sys, os

BASE = os.path.join(os.path.dirname(__file__), "..", "client", "public", "data")
errors = []
warnings = []

def err(msg): errors.append(f"  ❌ {msg}")
def warn(msg): warnings.append(f"  ⚠️  {msg}")

# ── CASES ────────────────────────────────────────────────────────────────────
print("Prüfe cases.json...")
cdata = json.load(open(f"{BASE}/cases.json"))
cases = cdata["cases"] if isinstance(cdata, dict) else cdata
CASE_REQUIRED = ["id", "title", "date", "level", "description", "region"]
VALID_LEVELS = {"critical", "high", "medium", "confirmed", "historical"}

ids_seen = set()
for i, c in enumerate(cases):
    for f in CASE_REQUIRED:
        if not c.get(f):
            err(f"Case #{i+1} '{c.get('id','?')}': Pflichtfeld '{f}' fehlt oder leer")
    if c.get("level") and c["level"] not in VALID_LEVELS:
        err(f"Case '{c.get('id')}': Ungültiger level '{c['level']}' (erlaubt: {VALID_LEVELS})")
    if c.get("id") in ids_seen:
        err(f"Case: Doppelte ID '{c['id']}'")
    ids_seen.add(c.get("id"))
    if not c.get("score"):
        warn(f"Case '{c.get('id')}': Kein score-Wert")
    if not c.get("location"):
        warn(f"Case '{c.get('id')}': Kein location-Wert")

print(f"  → {len(cases)} Fälle geprüft")

# ── PEOPLE ───────────────────────────────────────────────────────────────────
print("Prüfe people.json...")
pdata = json.load(open(f"{BASE}/people.json"))
people = pdata["people"] if isinstance(pdata, dict) else pdata
PEOPLE_REQUIRED = ["id", "name", "role", "bio", "emoji"]

pids_seen = set()
for i, p in enumerate(people):
    for f in PEOPLE_REQUIRED:
        if not p.get(f):
            err(f"Person #{i+1} '{p.get('id','?')}': Pflichtfeld '{f}' fehlt oder leer")
    if p.get("id") in pids_seen:
        err(f"Person: Doppelte ID '{p['id']}'")
    pids_seen.add(p.get("id"))
    if not p.get("credibility") and not p.get("credibility_score"):
        warn(f"Person '{p.get('id')}': Kein credibility-Wert")

print(f"  → {len(people)} Personen geprüft")

# ── CONGRUENCE ───────────────────────────────────────────────────────────────
print("Prüfe congruence.json...")
tdata = json.load(open(f"{BASE}/congruence.json"))
theses = tdata.get("theses") or tdata.get("themes") or (tdata if isinstance(tdata, list) else [])
THESIS_REQUIRED = ["id", "title", "score"]  # description ODER summary reicht

tids_seen = set()
for i, t in enumerate(theses if isinstance(theses, list) else []):
    for f in THESIS_REQUIRED:
        if not t.get(f):
            err(f"These #{i+1} '{t.get('id','?')}': Pflichtfeld '{f}' fehlt oder leer")
    # description ODER summary muss vorhanden sein
    if not t.get('description') and not t.get('summary'):
        err(f"These #{i+1} '{t.get('id','?')}': Weder 'description' noch 'summary' vorhanden")
    if t.get("id") in tids_seen:
        err(f"These: Doppelte ID '{t['id']}'")
    tids_seen.add(t.get("id"))

print(f"  → {len(theses)} Thesen geprüft")

# ── ERGEBNIS ─────────────────────────────────────────────────────────────────
print()
if errors:
    print(f"FEHLER ({len(errors)}):")
    for e in errors: print(e)
else:
    print("✅ Keine Fehler gefunden!")

if warnings:
    print(f"\nWARNUNGEN ({len(warnings)}):")
    for w in warnings[:10]: print(w)
    if len(warnings) > 10:
        print(f"  ... und {len(warnings)-10} weitere Warnungen")

print(f"\nZusammenfassung: {len(cases)} Fälle · {len(people)} Personen · {len(theses)} Thesen")
sys.exit(1 if errors else 0)
