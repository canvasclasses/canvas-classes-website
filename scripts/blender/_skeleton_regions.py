import bpy

PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"

# Candidate regional collections (Z-Anatomy's own "Bones of ..." groupings).
CANDIDATES = [
    "Axial skeleton", "Appendicular skeleton",
    "Bones of cranium", "Cranium", "Mandible", "Hyoid bone",
    "Bones of vertebral column", "Vertebral column",
    "Bones of thorax", "Thoracic skeleton", "Sternum", "Ribs",
    "Bones of pectoral girdle",
    "Bones of upper limb", "Skeleton of upper limbs",
    "Bones of free part of upper limb",
    "Bones of pelvic girdle", "Bony pelvis",
    "Bones of lower limb", "Skeleton of lower limbs",
    "Bones of free lower limb",
    "Bones of hand", "Bones of foot",
]

# --- reset scene ---
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
    present = [c for c in CANDIDATES if c in src.collections]
    dst.collections = list(present)  # pass a copy — loader mutates the list it's given

report = {}
for name in present:
    coll = bpy.data.collections.get(name)
    if not coll:
        continue
    mesh_names, polys = [], 0
    for o in coll.all_objects:
        if o.type == "MESH" and o.data:
            mesh_names.append(o.name)
            polys += len(o.data.polygons)
    report[name] = {
        "meshes": len(mesh_names),
        "polys": polys,
        "members": sorted(mesh_names),
    }

result = {
    "found_collections": present,
    "missing": [c for c in CANDIDATES if c not in present],
    "report": report,
}
print("region inspection done")
