import bpy
import re

# P1 spike — pure DIRECTORY READ of Startup.blend (no geometry import, no scene
# mutation). Enumerate the full collection tree + object name inventory so we can
# see the top-level systems and how many structures each carries.
PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"

with bpy.data.libraries.load(PATH, link=False, assets_only=False) as (src, dst):
    coll_names = sorted(list(src.collections))
    obj_names = list(src.objects)

# Top-level numbered systems look like "1: Skeletal system", "4: Muscular system".
numbered = sorted([c for c in coll_names if re.match(r"^\s*\d+\s*[:.]", c)])

# Label/helper anchors use .i/.j suffixes; left/right twins use .l/.r.
def suffix_bucket(names):
    b = {"helper_i_j": 0, "left_l": 0, "right_r": 0, "plain": 0}
    for n in names:
        if re.search(r"\.(i|j)(\.\d+)?$", n):
            b["helper_i_j"] += 1
        elif re.search(r"\.l(\.\d+)?$", n):
            b["left_l"] += 1
        elif re.search(r"\.r(\.\d+)?$", n):
            b["right_r"] += 1
        else:
            b["plain"] += 1
    return b

result = {
    "total_collections": len(coll_names),
    "total_objects": len(obj_names),
    "numbered_top_level_systems": numbered,
    "object_suffix_buckets": suffix_bucket(obj_names),
    "sample_collections_first_40": coll_names[:40],
}
print("explorer catalog enum (directory read) done")
