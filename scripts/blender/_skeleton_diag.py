import bpy
from mathutils import Vector

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
if root and root.name not in bpy.context.scene.collection.children:
    bpy.context.scene.collection.children.link(root)
bpy.context.view_layer.update()

SAMPLE = ["Frontal bone", "Femur.l", "Femur.r", "Calcaneus.l", "Mandible",
          "Atlas (C1)", "Hip bone.l"]

def info(o):
    me = o.data
    lmin = [1e18] * 3
    lmax = [-1e18] * 3
    for v in me.vertices:
        for i in range(3):
            lmin[i] = min(lmin[i], v.co[i])
            lmax[i] = max(lmax[i], v.co[i])
    # world bounds via matrix_world
    wmin = [1e18] * 3
    wmax = [-1e18] * 3
    for v in me.vertices:
        w = o.matrix_world @ v.co
        for i in range(3):
            wmin[i] = min(wmin[i], w[i])
            wmax[i] = max(wmax[i], w[i])
    return {
        "parent": o.parent.name if o.parent else None,
        "loc": [round(x, 3) for x in o.location],
        "mw_translation": [round(x, 3) for x in o.matrix_world.to_translation()],
        "local_center": [round((lmin[i] + lmax[i]) / 2, 3) for i in range(3)],
        "local_size": [round(lmax[i] - lmin[i], 3) for i in range(3)],
        "world_center": [round((wmin[i] + wmax[i]) / 2, 3) for i in range(3)],
        "verts": len(me.vertices),
    }

out = {}
for name in SAMPLE:
    o = bpy.data.objects.get(name)
    out[name] = info(o) if o else "NOT FOUND"

result = out
print("diag done")
