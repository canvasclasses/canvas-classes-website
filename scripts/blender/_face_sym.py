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
if root and root.name not in bpy.context.scene.collection.children:
    bpy.context.scene.collection.children.link(root)
bpy.context.view_layer.update()

# Paired facial bones: compare .l vs .r vertex counts + world bbox size.
FACE = ["maxilla", "zygomatic", "nasal bone", "lacrimal", "palatine",
        "inferior nasal concha", "temporal bone", "parietal bone", "frontal"]

def wsize(o):
    mn = [1e18]*3; mx = [-1e18]*3
    for v in o.data.vertices:
        w = o.matrix_world @ v.co
        for i in range(3):
            mn[i] = min(mn[i], w[i]); mx[i] = max(mx[i], w[i])
    return [round(mx[i]-mn[i],3) for i in range(3)], [round((mn[i]+mx[i])/2,3) for i in range(3)]

rows = {}
for o in root.all_objects:
    if o.type != "MESH":
        continue
    nl = o.name.lower()
    if any(f in nl for f in FACE):
        s, c = wsize(o)
        rows[o.name] = {"verts": len(o.data.vertices), "size": s, "center": c}

result = {"face_bones": dict(sorted(rows.items()))}
print("face sym done")
