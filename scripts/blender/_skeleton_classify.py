import bpy

PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"
TARGET = "1: Skeletal system"

for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
for c in list(bpy.data.collections):
    try:
        bpy.data.collections.remove(c)
    except Exception:  # noqa
        pass
for m in list(bpy.data.meshes):
    bpy.data.meshes.remove(m)

with bpy.data.libraries.load(PATH, link=False) as (src, dst):
    dst.collections = [TARGET] if TARGET in src.collections else []

root = bpy.data.collections.get(TARGET)

import re
def suffix(name):
    # trailing .i / .j (helper) and/or .l / .r (side)
    m = re.search(r"\.(i|j)$", name)
    return m.group(1) if m else ""

meshes = []
for o in root.all_objects:
    if o.type == "MESH" and o.data:
        meshes.append((o.name, len(o.data.polygons)))

dot_i = [m for m in meshes if m[0].endswith(".i")]
dot_j = [m for m in meshes if m[0].endswith(".j")]
clean = [m for m in meshes if not (m[0].endswith(".i") or m[0].endswith(".j"))]
clean_nonzero = [m for m in clean if m[1] > 0]
clean_zero = [m for m in clean if m[1] == 0]

result = {
    "total_meshes": len(meshes),
    "dot_i_count": len(dot_i), "dot_i_polys": sum(p for _, p in dot_i),
    "dot_j_count": len(dot_j), "dot_j_polys": sum(p for _, p in dot_j),
    "clean_count": len(clean), "clean_polys": sum(p for _, p in clean),
    "clean_nonzero_count": len(clean_nonzero),
    "clean_nonzero_polys": sum(p for _, p in clean_nonzero),
    "clean_zero_count": len(clean_zero),
    "clean_zero_sample": [m[0] for m in clean_zero][:30],
    "clean_nonzero_names": sorted(m[0] for m in clean_nonzero),
}
print("classify done")
