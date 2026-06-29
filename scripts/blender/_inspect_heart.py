import bpy

# Read the .blend's object/collection DIRECTORY only (headers, no geometry) so we
# never load the 293 MB scene or disturb the live session / socket server.
PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"

with bpy.data.libraries.load(PATH, link=False, assets_only=False) as (src, dst):
    all_objects = list(src.objects)
    all_collections = list(src.collections)

# Heart / cardiovascular terms (English + Terminologia Anatomica Latin).
KEYS = [
    "heart", "cardi", "myocard", "pericard", "endocard",
    "atrium", "atrial", "ventric", "septum",
    "aorta", "aortic", "pulmonary", "pulmonal", "truncus pulmon",
    "vena cava", "venacava", "cava",
    "valve", "valva", "tricuspid", "mitral", "bicuspid", "semilunar",
    "coronary", "coronari",
    " cor", "cor.", "cor ", "atrii", "ventriculus",
]

def matches(names):
    out = {}
    for n in names:
        nl = n.lower()
        for k in KEYS:
            if k in nl:
                out.setdefault(k, []).append(n)
                break
    return out

obj_hits = matches(all_objects)
coll_hits = matches(all_collections)

result = {
    "total_objects": len(all_objects),
    "total_collections": len(all_collections),
    "collection_matches": {k: v for k, v in coll_hits.items()},
    "object_match_counts": {k: len(v) for k, v in obj_hits.items()},
    # a flat sample so we can read real names / casing
    "object_match_sample": sorted({n for v in obj_hits.values() for n in v})[:120],
}
print("inspection done")
