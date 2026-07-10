import bpy
import mathutils

PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"

TOKENS = [
    "ascending aorta", "descending aorta", "aortic arch", "root of aorta",
    "left pulmonary artery", "right pulmonary artery",
    "left superior pulmonary vein", "left inferior pulmonary vein",
    "right superior pulmonary vein", "right inferior pulmonary vein",
    "superior vena cava", "inferior vena cava",
    "left coronary artery", "right coronary artery",
]
EXCLUDE = ["node", "plexus", "sinus of", "sinuses of", "bifurcation", "sulcus",
           "impression", "lymph", "valve", "leaflet", "wall", "branch", "abdominal", ".j", ".g"]


def wanted(n):
    nl = n.lower()
    return any(t in nl for t in TOKENS) and not any(x in nl for x in EXCLUDE)


with bpy.data.libraries.load(PATH, link=False) as (src, dst):
    cand = [n for n in src.objects if wanted(n)]
    dst.objects = [n for n in cand if n not in bpy.data.objects]

col = bpy.data.collections.get("VesselsBuild")
if col is None:
    col = bpy.data.collections.new("VesselsBuild")
if "VesselsBuild" not in [c.name for c in bpy.context.scene.collection.children]:
    bpy.context.scene.collection.children.link(col)

rows = {}
for name in cand:
    o = bpy.data.objects.get(name)
    if not o:
        continue
    if col not in list(o.users_collection):
        for c in list(o.users_collection):
            try:
                c.objects.unlink(o)
            except Exception:  # noqa
                pass
        try:
            col.objects.link(o)
        except Exception:  # noqa
            pass
    info = {"type": o.type, "dims": [round(d, 4) for d in o.dimensions]}
    if o.type == "CURVE":
        d = o.data
        info["bevel_depth"] = round(d.bevel_depth, 5)
        info["bevel_object"] = d.bevel_object.name if d.bevel_object else None
        info["extrude"] = round(d.extrude, 5)
        info["splines"] = len(d.splines)
    rows[name] = info

# Heart scale reference (bbox across the 4 chambers).
mins = [1e9] * 3
maxs = [-1e9] * 3
for n in ["right_atrium", "left_ventricle", "right_ventricle", "left_atrium"]:
    o = bpy.data.objects.get(n)
    if not o:
        continue
    for corner in o.bound_box:
        wc = o.matrix_world @ mathutils.Vector(corner)
        for i in range(3):
            mins[i] = min(mins[i], wc[i])
            maxs[i] = max(maxs[i], wc[i])

result = {
    "vessel_count": len(rows),
    "vessels": rows,
    "heart_bbox_size": [round(maxs[i] - mins[i], 4) for i in range(3)] if maxs[0] > -1e8 else None,
}
print("v11 inspect done")
