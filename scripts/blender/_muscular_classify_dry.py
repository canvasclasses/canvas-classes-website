import bpy
import re
import json

# P2 step 2 — DRY classification: apply muscular-structure-map.json to every mesh
# in the appended muscular system. No naming, no export, no mutation. Reports
# per-token tallies, dropped count, and (critically) any UNCLASSIFIED names so the
# map can be made complete before the real build.
MAP = "/Users/CanvasClasses/Desktop/canvas/packages/data/simulations/muscular-structure-map.json"

with open(MAP, encoding="utf-8") as f:
    cfg = json.load(f)
drop_pats = [d.lower() for d in cfg["drop"]]
tokens = cfg["tokens"]

def is_helper(n):
    return bool(re.search(r"\.(i|j)(\.\d+)?$", n))

def classify(name):
    # Drop-first, then LONGEST-match-wins (most specific token substring beats a
    # shorter accidental one — e.g. coracobrachialis > brachialis, extensor
    # digitorum longus > extensor digitorum).
    nl = name.lower()
    for d in drop_pats:
        if d in nl:
            return ("__drop__", None)
    best_id, best_len = None, -1
    for t in tokens:
        for m in t["match"]:
            ml = m.lower()
            if ml in nl and len(ml) > best_len:
                best_id, best_len = t["id"], len(ml)
    if best_id is None:
        return ("__unclassified__", None)
    return (best_id, None)

tok_polys = {}
tok_count = {}
dropped = []
unclassified = []
for o in bpy.data.objects:
    if o.type != "MESH" or not o.data or is_helper(o.name):
        continue
    polys = len(o.data.polygons)
    tid, _ = classify(o.name)
    if tid == "__drop__":
        dropped.append(o.name)
        continue
    if tid == "__unclassified__":
        unclassified.append((o.name, polys))
        continue
    tok_polys[tid] = tok_polys.get(tid, 0) + polys
    tok_count[tid] = tok_count.get(tid, 0) + 1

# token coverage: which declared tokens matched ZERO meshes (a sign of a bad pattern)
empty_tokens = [t["id"] for t in tokens if t["id"] not in tok_count]

kept_polys = sum(tok_polys.values())
unclassified.sort(key=lambda x: -x[1])

result = {
    "tokens_declared": len(tokens),
    "tokens_with_meshes": len(tok_count),
    "empty_tokens (no mesh matched — FIX pattern)": empty_tokens,
    "kept_total_polys": kept_polys,
    "dropped_count": len(dropped),
    "unclassified_count": len(unclassified),
    "unclassified_names": [n for n, _ in unclassified],
    "per_token": {tid: {"meshes": tok_count[tid], "polys": tok_polys[tid]}
                  for tid in sorted(tok_count)},
}
print("muscular dry-classify done")
