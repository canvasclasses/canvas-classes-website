import bpy

PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"

# Directory read only — count cartilage + ligament meshes near the skeleton.
with bpy.data.libraries.load(PATH, link=False, assets_only=False) as (src, dst):
    objs = list(src.objects)
    colls = list(src.collections)

def has(name, keys):
    nl = name.lower()
    return any(k in nl for k in keys)

CART = ["cartilage", "costal", "meniscus", "articular disc", "intervertebral disc",
        "labrum"]
LIG = ["ligament", "membrane", "retinaculum", "aponeurosis", "fascia lata"]

cart_objs = [o for o in objs if has(o, CART) and not (o.endswith(".i") or o.endswith(".j"))]
lig_objs = [o for o in objs if has(o, LIG) and not (o.endswith(".i") or o.endswith(".j"))]

# relevant collections
cart_colls = sorted([c for c in colls if has(c, CART)])
lig_colls = sorted([c for c in colls if "ligament" in c.lower()])

result = {
    "cartilage_obj_count": len(cart_objs),
    "cartilage_sample": sorted(cart_objs)[:40],
    "ligament_obj_count": len(lig_objs),
    "ligament_sample": sorted(lig_objs)[:50],
    "cartilage_collections": cart_colls[:30],
    "ligament_collections": lig_colls[:40],
}
print("soft tissue scan done")
