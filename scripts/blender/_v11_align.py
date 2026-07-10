import bpy
import mathutils

VESSELS = [
    "Superior vena cava", "Inferior vena cava (thoracic part)",
    "Ascending aorta", "Aortic arch",
    "Left pulmonary artery", "Right pulmonary artery",
    "Left superior pulmonary vein", "Left inferior pulmonary vein",
    "Right superior pulmonary vein", "Right inferior pulmonary vein",
    "Left coronary artery", "Right coronary artery",
]


def world_bbox(o):
    mn = [1e18] * 3
    mx = [-1e18] * 3
    for c in o.bound_box:
        w = o.matrix_world @ mathutils.Vector(c)
        for i in range(3):
            mn[i] = min(mn[i], w[i])
            mx[i] = max(mx[i], w[i])
    return mn, mx


# Un-parent vessels, KEEP world transform (so world placement is preserved).
for n in VESSELS:
    o = bpy.data.objects.get(n)
    if o and o.parent is not None:
        mw = o.matrix_world.copy()
        o.parent = None
        o.matrix_world = mw

rows = {}
for n in VESSELS:
    o = bpy.data.objects.get(n)
    if not o:
        rows[n] = "missing"
        continue
    mn, mx = world_bbox(o)
    sc = o.matrix_world.to_scale()
    rows[n] = {
        "world_center": [round((mn[i] + mx[i]) / 2, 4) for i in range(3)],
        "world_size": [round(mx[i] - mn[i], 4) for i in range(3)],
        "world_scale": [round(s, 5) for s in sc],
        "bevel_depth_local": round(o.data.bevel_depth, 6),
        "world_tube_radius_est": round(o.data.bevel_depth * abs(sc[0]), 6),
    }

# Heart reference (right_atrium).
ra = bpy.data.objects.get("right_atrium")
if ra:
    mn, mx = world_bbox(ra)
    rows["_HEART_right_atrium"] = {
        "world_center": [round((mn[i] + mx[i]) / 2, 4) for i in range(3)],
        "world_size": [round(mx[i] - mn[i], 4) for i in range(3)],
    }

result = rows
print("v11 align done")
