import bpy

# Directory read only (headers, no geometry) — find the skeletal-system collection
# name + how the bones are grouped into sub-collections. Does NOT open the 293 MB scene.
PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"

with bpy.data.libraries.load(PATH, link=False, assets_only=False) as (src, dst):
    all_objects = list(src.objects)
    all_collections = list(src.collections)

# Skeletal terms (English + Terminologia Anatomica Latin).
COLL_KEYS = [
    "skelet", "bone", "oss", "skull", "crani", "cranium",
    "vertebr", "spine", "column", "vertebral",
    "rib", "costa", "cost", "sternum", "thorax", "thorac", "thoracic",
    "clavic", "scapul", "humer", "radius", "ulna", "carp", "phalan", "limb",
    "pelvi", "hip", "ilium", "ischium", "pubis", "coxa", "girdle",
    "femur", "patella", "tibia", "fibula", "tars", "foot", "hand",
    "mandib", "maxilla", "hyoid", "appendic", "axial",
]

def coll_hits(names):
    out = []
    for n in names:
        nl = n.lower()
        if any(k in nl for k in COLL_KEYS):
            out.append(n)
    return sorted(out)

result = {
    "total_objects": len(all_objects),
    "total_collections": len(all_collections),
    "skeletal_collection_candidates": coll_hits(all_collections),
}
print("skeleton directory inspection done")
