import bpy

PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"

TOKENS = [
    "ascending aorta", "descending aorta", "aortic arch", "arch of aorta",
    "thoracic aorta", "root of aorta",
    "pulmonary trunk", "pulmonary artery", "pulmonary vein",
    "superior vena cava", "inferior vena cava",
    "left coronary artery", "right coronary artery", "coronary sinus",
]
EXCLUDE = ["node", "plexus", "sinus of", "sinuses of", "bifurcation", "sulcus",
           "impression", "vessels", "lymph", "wall", "valve", "leaflet"]


def wanted(n):
    nl = n.lower()
    return any(t in nl for t in TOKENS) and not any(x in nl for x in EXCLUDE)


# Candidate names from the directory; only append those not already present
# (the prior run already appended them, so this stays idempotent — no .001 dupes).
with bpy.data.libraries.load(PATH, link=False) as (src, dst):
    cand = [n for n in src.objects if wanted(n)]
    dst.objects = [n for n in cand if n not in bpy.data.objects]

gv = bpy.data.collections.get("Great vessels")
if gv is None:
    gv = bpy.data.collections.new("Great vessels")
if "Great vessels" not in [c.name for c in bpy.context.scene.collection.children]:
    bpy.context.scene.collection.children.link(gv)

kept, dropped = [], []
for name in cand:
    obj = bpy.data.objects.get(name)
    if obj is None:
        continue
    if obj.type == "MESH" and obj.data and len(obj.data.polygons) > 0:
        if gv not in list(obj.users_collection):
            for c in list(obj.users_collection):
                try:
                    c.objects.unlink(obj)
                except Exception:  # noqa
                    pass
            try:
                gv.objects.link(obj)
            except Exception:  # noqa
                pass
        kept.append((obj.name, len(obj.data.polygons)))
    else:
        dropped.append((obj.name, obj.type))
        try:
            bpy.data.objects.remove(obj, do_unlink=True)
        except Exception:  # noqa
            pass

kept.sort(key=lambda x: -x[1])
result = {
    "candidates": len(cand),
    "kept_mesh_count": len(kept),
    "kept_polys": sum(p for _, p in kept),
    "kept": kept,
    "dropped_nonmesh": dropped[:30],
}
print("vessels appended")
