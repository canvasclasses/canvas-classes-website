import bpy
import re
import json

# P1 spike — DIRECTORY READ only (no geometry import, no scene mutation, no write
# to Startup.blend). Pulls the full object + collection name inventory from
# Z-Anatomy and writes a DRAFT structure catalog to the repo. Per-system grouping
# is a keyword first-cut (objects often lack a system token, so this is approximate
# and clearly flagged; exact membership is harvested per-system at build time when
# that collection is appended anyway).
PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"
OUT = "/Users/CanvasClasses/Desktop/canvas/packages/data/simulations/anatomy-structure-catalog.draft.json"

with bpy.data.libraries.load(PATH, link=False, assets_only=False) as (src, dst):
    coll_names = sorted(list(src.collections))
    obj_names = sorted(list(src.objects))

# Drop .i/.j label-helper anchors (zero-poly text anchors, not structures).
def is_helper(n):
    return bool(re.search(r"\.(i|j)(\.\d+)?$", n))

structures = [n for n in obj_names if not is_helper(n)]

# Collapse left/right twins to a base name for the unique-structure count.
def base_name(n):
    return re.sub(r"\.(l|r)(\.\d+)?$", "", re.sub(r"\.\d+$", "", n))

# Keyword first-cut classifier → 9 Z-Anatomy systems (NEET-oriented).
# Ordered: first match wins, so put specific/strong tokens first.
SYS = [
    ("cardiovascular", ["aorta", "artery", "arterial", "arteriole", "vein", "venous",
        "venule", "vena cava", "cardiac", "heart", "atri", "ventricle", "valve",
        "capillar", "sinus", "trunk (", "coronary", "carotid", "jugular", "femoral a",
        "pulmonary trunk", "truncus"]),
    ("lymphoid", ["lymph", "spleen", "splenic", "thymus", "tonsil", "node", "nodi",
        "lymphatic", "thoracic duct", "cisterna chyli"]),
    ("nervous", ["nerve", "nervus", "nervous", "ganglion", "plexus", "cortex",
        "cerebr", "cerebell", "brain", "spinal cord", "medulla", "pons", "thalam",
        "hypothalam", "hippocamp", "gyrus", "sulcus", "neur", "retina", "cochlea",
        "vestibul", "tympan", "ossicle", "eyeball", "iris", "lens", "optic",
        "olfactory", "auditory", "meninge", "dura", "pia", "arachnoid", "ventricle of brain"]),
    ("muscular_insertions", ["insertion", "origin of", "attachment"]),
    ("muscular", ["muscle", "musculus", "biceps", "triceps", "deltoid", "trapezius",
        "pectoralis", "gluteus", "gastrocnemius", "soleus", "quadriceps", "sartorius",
        "masseter", "temporalis", "sterno", "rectus abdominis", "oblique", "latissimus",
        "rhomboid", "serratus", "tendon", "aponeurosis", "diaphragm", "sphincter"]),
    ("skeletal", ["bone", "ossi", " os ", "vertebra", "rib", "costa", "costal",
        "sternum", "skull", "crani", "mandible", "maxilla", "clavicle", "scapula",
        "humerus", "radius", "ulna", "carpal", "metacarpal", "phalan", "femur",
        "patella", "tibia", "fibula", "tarsal", "metatarsal", "ilium", "ischium",
        "pubis", "pelvi", "hyoid", "sacrum", "coccyx", "occipit", "parietal",
        "temporal bone", "frontal bone", "sphenoid", "ethmoid", "zygomat", "nasal bone",
        "lacrimal", "palatine", "vomer", "concha", "tooth", "teeth", "dental",
        "process", "tubercle", "condyle", "epicondyle", "fossa", "foramen", "crest",
        "spine of", "tuberosity", "trochanter", "malleolus"]),
    ("joints", ["joint", "ligament", "cartilage", "meniscus", "labrum", "disc",
        "capsule", "membrane", "syndesmos", "symphys", "synchondros", "suture",
        "bursa", "articular"]),
    ("visceral", ["lung", "pulmon", "bronch", "trachea", "larynx", "pharynx",
        "alveol", "stomach", "gastr", "intestine", "duoden", "jejun", "ileum",
        "colon", "caecum", "cecum", "rectum", "anus", "liver", "hepat", "gallbladder",
        "bile", "pancrea", "kidney", "renal", "ureter", "bladder", "urethra",
        "oesophag", "esophag", "spleen", "adrenal", "suprarenal", "thyroid",
        "parathyroid", "pituitary", "hypophys", "adenohypophys", "ovary", "ovarian",
        "uter", "vagina", "testis", "testic", "prostate", "epididym", "penis",
        "scrotum", "salivary", "parotid", "tongue", "peritone", "mesenter", "omentum",
        "fascia", "gland", "duct", "cavity", "recess"]),
    ("regions", ["region", "abdomen", "thorax of body", "head of body", "neck of body",
        "perineum", "axilla", "trigone"]),
]

def classify(n):
    nl = n.lower()
    for sysname, kws in SYS:
        for k in kws:
            if k in nl:
                return sysname
    return "unclassified"

by_system = {}
for n in structures:
    s = classify(n)
    by_system.setdefault(s, []).append(n)

# Dedup base names per system for the curated-count view.
system_summary = {}
for s, names in by_system.items():
    bases = sorted(set(base_name(n) for n in names))
    system_summary[s] = {"object_count": len(names), "unique_base_count": len(bases)}

catalog = {
    "_meta": {
        "source": "Z-Anatomy Startup.blend (CC BY-SA — BodyParts3D + Z-Anatomy)",
        "generated_by": "scripts/blender/_explorer_catalog_build.py (P1 spike, directory-read only)",
        "note": ("DRAFT. system grouping is a KEYWORD FIRST-CUT from object names and is "
                 "approximate — many structures lack a system token. Exact per-system "
                 "membership is captured at build time when each numbered collection is "
                 "appended. The full collection-name tree + object inventory below are exact."),
        "total_objects": len(obj_names),
        "label_helper_anchors_dropped": len(obj_names) - len(structures),
        "real_structures": len(structures),
        "total_collections": len(coll_names),
    },
    "numbered_top_level_systems": sorted(
        [c for c in coll_names if re.match(r"^\s*\d+\s*[:.]", c)]),
    "system_summary_keyword_firstcut": system_summary,
    "structures_by_system_keyword_firstcut": {s: sorted(v) for s, v in by_system.items()},
    "all_collection_names": coll_names,
}

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(catalog, f, ensure_ascii=False, indent=1)

result = {
    "wrote": OUT,
    "total_objects": len(obj_names),
    "helpers_dropped": len(obj_names) - len(structures),
    "real_structures": len(structures),
    "total_collections": len(coll_names),
    "system_summary": {s: system_summary[s] for s in sorted(system_summary)},
}
print("explorer catalog build (directory read) done")
