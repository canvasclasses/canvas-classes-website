import bpy
import re

# P2 step 1 — reconnaissance of Z-Anatomy's muscular system before designing the
# structure contract + superficial/deep peel layers. Resets the (disposable) scene,
# appends "4: Muscular system", and measures: hierarchy, poly counts, naming, and
# whether depth (superficial/deep) is encoded anywhere we can exploit.
PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"
TARGET = "4: Muscular system"

# --- reset disposable scene (prior skeleton build leftovers; skeleton-v8.glb is
#     already exported, so nothing of value is lost) ---
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
for c in list(bpy.data.collections):
    try:
        bpy.data.collections.remove(c)
    except Exception:  # noqa
        pass
for m in list(bpy.data.meshes):
    bpy.data.meshes.remove(m)
for cu in list(bpy.data.curves):
    try:
        bpy.data.curves.remove(cu)
    except Exception:  # noqa
        pass

with bpy.data.libraries.load(PATH, link=False) as (src, dst):
    dst.collections = [TARGET] if TARGET in src.collections else []

root = bpy.data.collections.get(TARGET)
if root and root.name not in bpy.context.scene.collection.children:
    try:
        bpy.context.scene.collection.children.link(root)
    except Exception:  # noqa
        pass

# Tally meshes vs non-mesh, drop .i/.j label anchors.
def is_helper(n):
    return bool(re.search(r"\.(i|j)(\.\d+)?$", n))

meshes, helpers, non_mesh_types = [], 0, {}
for o in (root.all_objects if root else []):
    if is_helper(o.name):
        helpers += 1
        continue
    if o.type == "MESH" and o.data:
        meshes.append((o.name, len(o.data.polygons)))
    else:
        non_mesh_types[o.type] = non_mesh_types.get(o.type, 0) + 1
meshes.sort(key=lambda x: -x[1])
total_polys = sum(p for _, p in meshes)

# Direct child collections = Z-Anatomy's own grouping (regional? by depth?).
def branch_polys(coll):
    return sum(len(o.data.polygons) for o in coll.all_objects
              if o.type == "MESH" and o.data and not is_helper(o.name))

children = []
for c in (root.children if root else []):
    children.append({"name": c.name, "polys": branch_polys(c)})
children.sort(key=lambda d: -d["polys"])

# Does any name encode depth? (superficialis / profundus / superficial / deep)
DEPTH_KEYS = ["superficial", "profund", "deep", "superficialis", "profundus"]
depth_hits = [n for n, _ in meshes
              if any(k in n.lower() for k in DEPTH_KEYS)][:25]

result = {
    "root": TARGET,
    "real_mesh_objects": len(meshes),
    "label_helpers_dropped": helpers,
    "non_mesh_types": non_mesh_types,
    "total_polys": total_polys,
    "direct_child_collections": children,
    "n_child_collections": len(children),
    "heaviest_25_muscles": meshes[:25],
    "depth_encoded_names_sample": depth_hits,
    "name_samples_first_30": [n for n, _ in meshes[:30]],
}
print("muscular recon done")
