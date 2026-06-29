import bpy
import re

# Directory-read: does Z-Anatomy ship eyeballs / skin / integument we could add to
# humanize the face? (These are NOT in the muscular system.)
PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"

with bpy.data.libraries.load(PATH, link=False, assets_only=False) as (src, dst):
    objs = list(src.objects)
    colls = list(src.collections)

def hits(names, kws):
    out = []
    for n in names:
        nl = n.lower()
        if any(k in nl for k in kws):
            out.append(n)
    return sorted(set(out))

EYE = ["eyeball", "eye ", "iris", "lens", "cornea", "sclera", "conjunctiva", "vitreous", "pupil"]
SKIN = ["skin", "integument", "epidermis", "dermis", "subcutaneous tissue", "superficial fascia"]
TEETH = ["tooth", "teeth", "dental", "gingiv", "incisor", "canine", "molar", "premolar"]

result = {
    "eye_objects": hits(objs, EYE)[:40],
    "eye_collections": hits(colls, EYE)[:30],
    "skin_objects": hits(objs, SKIN)[:40],
    "skin_collections": hits(colls, SKIN)[:30],
    "teeth_objects_sample": hits(objs, TEETH)[:15],
}
print("eye/skin probe done")
