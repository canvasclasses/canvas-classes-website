import bpy
import bmesh
import mathutils
from statistics import median

VESSELS = ["aorta", "aorta_2", "superior_vena_cava", "inferior_vena_cava",
           "pulmonary_artery", "pulmonary_artery_2", "pulmonary_veins",
           "pulmonary_veins_2", "pulmonary_veins_3", "pulmonary_veins_4",
           "coronary_artery", "coronary_artery_2"]

THRESH = 0.18  # local units; heart ~0.12, so legit vessel geometry is well within this

report = {}
for name in VESSELS:
    o = bpy.data.objects.get(name)
    if not o or o.type != "MESH" or not o.data.vertices:
        continue
    me = o.data
    bm = bmesh.new()
    bm.from_mesh(me)
    med = mathutils.Vector((
        median([v.co.x for v in bm.verts]),
        median([v.co.y for v in bm.verts]),
        median([v.co.z for v in bm.verts]),
    ))
    far = [v for v in bm.verts if (v.co - med).length > THRESH]
    removed = len(far)
    if far:
        bmesh.ops.delete(bm, geom=far, context="VERTS")
    bm.to_mesh(me)
    bm.free()
    me.update()
    # accurate world size after cleaning
    mn = [1e18] * 3
    mx = [-1e18] * 3
    for v in me.vertices:
        w = o.matrix_world @ v.co
        for i in range(3):
            mn[i] = min(mn[i], w[i])
            mx[i] = max(mx[i], w[i])
    report[name] = {"removed_verts": removed,
                    "world_size": round(max(mx[i] - mn[i] for i in range(3)), 4) if me.vertices else 0}

result = report
print("v11d clean done")
