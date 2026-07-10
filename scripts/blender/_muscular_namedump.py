import bpy
import re

# P2 step 1b — dump the full deduped muscle inventory (the muscular system is
# already appended in the scene from _muscular_recon.py). Collapse .l/.r twins,
# sum polys per base muscle, write the full list to a scratch file for designing
# the structure contract. Returns a compact summary + the sorted base-name list.
OUT = "/tmp/anat-compress/muscular_inventory.txt"

def is_helper(n):
    return bool(re.search(r"\.(i|j)(\.\d+)?$", n))

def base_name(n):
    return re.sub(r"\.(l|r)(\.\d+)?$", "", n).strip()

agg = {}
for o in bpy.data.objects:
    if o.type != "MESH" or not o.data or is_helper(o.name):
        continue
    b = base_name(o.name)
    agg[b] = agg.get(b, 0) + len(o.data.polygons)

rows = sorted(agg.items(), key=lambda kv: kv[0].lower())
import os
os.makedirs("/tmp/anat-compress", exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    for name, polys in rows:
        f.write(f"{polys:>7}  {name}\n")

result = {
    "unique_base_muscles": len(rows),
    "wrote": OUT,
    "all_base_names": [n for n, _ in rows],
}
print("muscular namedump done")
