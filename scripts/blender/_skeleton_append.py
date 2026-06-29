import bpy

PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"
TARGET = "1: Skeletal system"  # top-level numbered system collection in Z-Anatomy

# --- reset scene (clear heart-build leftovers) ---
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
for mt in list(bpy.data.materials):
    try:
        bpy.data.materials.remove(mt)
    except Exception:  # noqa
        pass

# --- append the whole skeletal system collection ---
with bpy.data.libraries.load(PATH, link=False) as (src, dst):
    if TARGET in src.collections:
        dst.collections = [TARGET]
    else:
        dst.collections = []

root = bpy.data.collections.get(TARGET)
linked = False
if root and root.name not in bpy.context.scene.collection.children:
    try:
        bpy.context.scene.collection.children.link(root)
        linked = True
    except Exception as e:  # noqa
        linked = str(e)

NON_BONE = ("joint", "ligament", "cartilage", "fascia", "bursa", "insertion",
            "tendon", "syndesmos", "symphys", "synchondros", "suture", "disc",
            "membrane", "nerve", "artery", "vein", "plexus", "ganglion",
            "muscle", "lymph", "duct", "sheath")

def is_bone_coll(name):
    nl = name.lower()
    return not any(k in nl for k in NON_BONE)

# Walk all objects under the root, tally polys.
all_meshes = []
non_mesh_types = {}
for o in root.all_objects if root else []:
    if o.type == "MESH" and o.data:
        all_meshes.append((o.name, len(o.data.polygons)))
    else:
        non_mesh_types[o.type] = non_mesh_types.get(o.type, 0) + 1
all_meshes.sort(key=lambda x: -x[1])
total_polys = sum(p for _, p in all_meshes)

# Per direct-child-collection breakdown (recursive poly tally per branch).
def branch_stats(coll):
    mc, pc = 0, 0
    for o in coll.all_objects:
        if o.type == "MESH" and o.data:
            mc += 1
            pc += len(o.data.polygons)
    return mc, pc

direct_children = []
for c in (root.children if root else []):
    mc, pc = branch_stats(c)
    direct_children.append({"name": c.name, "meshes": mc, "polys": pc,
                             "bone_like": is_bone_coll(c.name)})
direct_children.sort(key=lambda d: -d["polys"])

result = {
    "linked": linked,
    "root": TARGET,
    "total_meshes": len(all_meshes),
    "total_polys": total_polys,
    "non_mesh_types": non_mesh_types,
    "direct_child_collections": direct_children,
    "heaviest_30_meshes": all_meshes[:30],
}
print("skeleton append+measure done")
