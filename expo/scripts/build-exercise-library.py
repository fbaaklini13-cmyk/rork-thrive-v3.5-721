#!/usr/bin/env python3
"""
Build data/exercise-library.json from the free-exercise-db dump in ./exercises
(873 JSON files, yuhonas/free-exercise-db, public domain / Unlicense).

Why this exists: the Exercise Library screens (app/(tabs)/workout/exercises.tsx,
exercise-detail.tsx) and ExerciseReplacementModal read `EXERCISES` from
mocks/exercises.ts, a 21-entry hand-written array. Nothing in the app ever
imported the 873-entry dataset, so only 21 exercises were reachable in the UI.

This script maps the dataset onto the app's existing `ExerciseData` shape
(mocks/exercises.ts) so it can be merged in with a one-line change and no
type changes. Re-run it whenever ./exercises changes:

    python3 scripts/build-exercise-library.py

Mapping decisions (lossy on purpose — the filter chips in exercises.tsx only
know 11 muscle groups / 6 equipment types / 3 difficulties):
  primaryMuscles[0] -> muscleGroup      lats|middle back|lower back|traps -> back,
                                        abdominals -> abs, quadriceps|adductors -> quads,
                                        abductors -> glutes, neck -> shoulders
  equipment         -> equipment        body only|other|none|exercise ball|foam roll|
                                        medicine ball -> bodyweight, kettlebells -> dumbbell,
                                        e-z curl bar -> barbell  (original kept in rawEquipment)
  level             -> difficulty       expert -> advanced
  category          -> goals            strength/powerlifting/olympic/strongman -> strength(+hypertrophy
                                        for plain strength), stretching -> mobility,
                                        plyometrics/cardio -> fat-loss
  images            -> imageUrls        raw.githubusercontent.com URLs (not bundled: the 1,747 JPGs
                                        in ./exercises are ~100 MB and would bloat the app binary)
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "exercises")
OUT = os.path.join(ROOT, "data", "exercise-library.json")
IMG_BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/"

MUSCLE = {
    "chest": "chest", "shoulders": "shoulders", "triceps": "triceps", "biceps": "biceps",
    "lats": "back", "middle back": "back", "lower back": "back", "traps": "back",
    "abdominals": "abs", "quadriceps": "quads", "adductors": "quads", "abductors": "glutes",
    "hamstrings": "hamstrings", "glutes": "glutes", "calves": "calves", "forearms": "forearms",
    "neck": "shoulders",
}
EQUIPMENT = {
    "barbell": "barbell", "e-z curl bar": "barbell", "dumbbell": "dumbbell", "kettlebells": "dumbbell",
    "machine": "machine", "cable": "cable", "bands": "bands",
    "body only": "bodyweight", "other": "bodyweight", None: "bodyweight", "exercise ball": "bodyweight",
    "foam roll": "bodyweight", "medicine ball": "bodyweight",
}
DIFFICULTY = {"beginner": "beginner", "intermediate": "intermediate", "expert": "advanced"}
GOALS = {
    "strength": ["strength", "hypertrophy"], "powerlifting": ["strength"], "olympic weightlifting": ["strength"],
    "strongman": ["strength"], "stretching": ["mobility"], "plyometrics": ["fat-loss"], "cardio": ["fat-loss"],
}

def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

def convert(j):
    primary = j.get("primaryMuscles") or []
    if not primary:
        return None, "no primary muscle"
    mg = MUSCLE.get(primary[0])
    if not mg:
        return None, f"unmapped muscle {primary[0]}"
    secondary = []
    for m in primary[1:] + (j.get("secondaryMuscles") or []):
        mm = MUSCLE.get(m)
        if mm and mm != mg and mm not in secondary:
            secondary.append(mm)
    eq_raw = j.get("equipment")
    if eq_raw not in EQUIPMENT:
        return None, f"unmapped equipment {eq_raw}"
    instr = [s.strip() for s in (j.get("instructions") or []) if s and s.strip()]
    mech = j.get("mechanic")
    force = j.get("force")
    bits = [b for b in [j.get("category"), mech, f"{force} movement" if force else None] if b]
    description = (f"{j['name']} — " + ", ".join(bits) + f". Primary: {', '.join(primary)}"
                   + (f"; secondary: {', '.join(j.get('secondaryMuscles') or [])}" if j.get("secondaryMuscles") else "") + ".")
    out = {
        "id": "fedb-" + slug(j["id"]),
        "name": j["name"],
        "muscleGroup": mg,
        "equipment": EQUIPMENT[eq_raw],
        "difficulty": DIFFICULTY.get(j.get("level"), "intermediate"),
        "goals": GOALS.get(j.get("category"), ["strength"]),
        "description": description,
        "instructions": instr or ["No written instructions in the source dataset."],
    }
    if secondary:
        out["secondaryMuscles"] = secondary
    # extra, optional fields (not in ExerciseData yet; harmless for consumers that ignore them)
    out["rawEquipment"] = eq_raw or "none"
    out["rawPrimaryMuscles"] = primary
    out["category"] = j.get("category")
    if j.get("images"):
        out["imageUrls"] = [IMG_BASE + p for p in j["images"]]
    return out, None

def main():
    files = sorted(f for f in os.listdir(SRC) if f.endswith(".json"))
    items, skipped = [], []
    for f in files:
        with open(os.path.join(SRC, f), encoding="utf-8") as fh:
            j = json.load(fh)
        item, why = convert(j)
        if item: items.append(item)
        else: skipped.append((f, why))
    ids = [i["id"] for i in items]
    assert len(ids) == len(set(ids)), "duplicate ids"
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(items, fh, ensure_ascii=False, indent=1)
    print(f"read {len(files)} files -> wrote {len(items)} exercises to {os.path.relpath(OUT, ROOT)} ({os.path.getsize(OUT)//1024} KB)")
    if skipped:
        print(f"skipped {len(skipped)}:")
        for f, why in skipped: print("  ", f, "-", why)

if __name__ == "__main__":
    main()
