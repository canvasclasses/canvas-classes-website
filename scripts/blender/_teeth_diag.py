import bpy
import mathutils

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

def wbox(o):
    mn = [1e18]*3; mx = [-1e18]*3
    for v in o.data.vertices:
        w = o.matrix_world @ v.co
        for i in range(3):
            mn[i] = min(mn[i], w[i]); mx[i] = max(mx[i], w[i])
    return ([round((mn[i]+mx[i])/2,3) for i in range(3)],
            [round(mx[i]-mn[i],3) for i in range(3)], len(o.data.vertices))

uppers = {}
for o in root.all_objects:
    if o.type == "MESH" and "upper" in o.name.lower() and any(
            k in o.name.lower() for k in ["incisor","canine","premolar","molar"]):
        c, s, nv = wbox(o)
        uppers[o.name] = {"center": c, "size": s, "verts": nv}

result = {"upper_teeth": dict(sorted(uppers.items()))}
print("teeth diag done")
