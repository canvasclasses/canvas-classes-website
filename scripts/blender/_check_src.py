import bpy
import os

PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"
exists = os.path.exists(PATH)
size = os.path.getsize(PATH) if exists else 0

colls = []
heart_colls = []
n_objs = 0
if exists:
    with bpy.data.libraries.load(PATH, link=False) as (src, dst):
        colls = list(src.collections)
        n_objs = len(list(src.objects))
    heart_colls = [c for c in colls if "eart" in c.lower()]

result = {
    "exists": exists,
    "size_mb": round(size / 1024 / 1024, 1),
    "num_collections": len(colls),
    "num_objects": n_objs,
    "heart_collections": heart_colls,
    "has_Heart_exact": "Heart" in colls,
}
print("check done")
