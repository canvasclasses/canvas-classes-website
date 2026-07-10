import bpy

PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"
TARGET = "3: Joints"

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

from collections import defaultdict
buckets = defaultdict(lambda: [0, 0])
total_m = total_p = 0
helper = 0
for o in (root.all_objects if root else []):
    if o.type != "MESH" or not o.data:
        continue
    nl = o.name.lower()
    if nl.endswith(".i") or nl.endswith(".j") or nl.endswith(".g"):
        helper += 1
        continue
    npoly = len(o.data.polygons)
    total_m += 1
    total_p += npoly
    if "ligament" in nl:
        k = "ligament"
    elif any(x in nl for x in ["meniscus", "articular disc", "labrum", "cartilage"]):
        k = "joint_cartilage"
    elif "membrane" in nl or "capsule" in nl:
        k = "capsule_membrane"
    else:
        k = "other"
    buckets[k][0] += 1
    buckets[k][1] += npoly

result = {
    "total_meshes": total_m,
    "total_polys": total_p,
    "helper_dropped": helper,
    "buckets": {k: {"meshes": v[0], "polys": v[1]} for k, v in sorted(buckets.items())},
}
print("joints measure done")
