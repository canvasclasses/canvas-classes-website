import bpy


# same classifier as stage A
def token(name):
    nl = name.lower()
    if nl.endswith(".i") or nl.endswith(".j") or nl.endswith(".g"):
        return None
    if any(k in nl for k in ["incisor", "canine", "premolar", "molar tooth"]):
        return "mandible" if "lower" in nl else "maxilla"
    if "costal cartilage" in nl:
        return "costal_cartilage"
    if "ligament" in nl:
        return "ligaments"
    if "intervertebral disc" in nl:
        return "intervertebral_discs"
    if any(k in nl for k in ["meniscus", "articular disc", "labrum"]):
        return "joint_cartilage"
    if "capsule" in nl or "membrane" in nl:
        return None
    if any(k in nl for k in ["cartilage", "cricoid", "arytenoid", "corniculate"]):
        return None
    if "mandible" in nl:
        return "mandible"
    if "hyoid" in nl:
        return "hyoid"
    if "atlas (c1)" in nl or "axis (c2)" in nl or "vertebra c" in nl:
        return "cervical_vertebrae"
    if "vertebra t" in nl:
        return "thoracic_vertebrae"
    if "vertebra l" in nl:
        return "lumbar_vertebrae"
    if "sacrum" in nl:
        return "sacrum"
    if "coccyx" in nl:
        return "coccyx"
    if "rib" in nl:
        return "ribs"
    if "sternum" in nl or "xiphoid" in nl:
        return "sternum"
    if "clavicle" in nl:
        return "clavicle"
    if "scapula" in nl:
        return "scapula"
    if "humerus" in nl:
        return "humerus"
    if "radius" in nl:
        return "radius"
    if "ulna" in nl:
        return "ulna"
    if "metacarpal" in nl or "finger of hand" in nl:
        return "hand"
    if any(k in nl for k in ["capitate", "hamate", "lunate", "pisiform",
                             "scaphoid", "trapezium", "trapezoid", "triquetr"]):
        return "hand"
    if "hip bone" in nl:
        return "hip_bone"
    if "femur" in nl:
        return "femur"
    if "patella" in nl:
        return "patella"
    if "tibia" in nl:
        return "tibia"
    if "fibula" in nl:
        return "fibula"
    if "metatarsal" in nl or "finger of foot" in nl or "sesamoid" in nl:
        return "foot"
    if any(k in nl for k in ["calcaneus", "talus", "navicular", "cuboid", "cuneiform"]):
        return "foot"
    # ── Skull broken out into individual cranial + facial bones (tappable) ──
    if "nasal concha" in nl:
        return "inferior_nasal_concha"
    if "ethmoid" in nl:
        return "ethmoid_bone"
    if "sphenoid" in nl:
        return "sphenoid_bone"
    if "frontal bone" in nl or "sinus of frontal" in nl:
        return "frontal_bone"
    if "parietal" in nl:
        return "parietal"
    if "occipital" in nl:
        return "occipital_bone"
    if "temporal bone" in nl or any(k in nl for k in ["ossicle", "malleus", "incus", "stapes"]):
        return "temporal_bone"
    if "nasal bone" in nl:
        return "nasal_bone"
    if "lacrimal" in nl:
        return "lacrimal_bone"
    if "vomer" in nl:
        return "vomer"
    if "palatine" in nl:
        return "palatine_bone"
    if "zygomatic" in nl:
        return "zygomatic"
    if "maxilla" in nl:
        return "maxilla"
    return None


# per-token decimate ratio (knobbly bones keep more; smooth long bones decimate hard)
RATIO = {
    # Skull bones + jaw NOT decimated (ratio 1.0): collapse-decimation never preserves
    # left/right symmetry and it shrinks each bone inward, opening gaps at the sutures.
    # The face is what learners zoom into, so keep full source resolution (incl. teeth).
    # Long/smooth bones elsewhere decimate hard with no visible loss.
    "frontal_bone": 1.0, "parietal": 1.0, "temporal_bone": 1.0, "occipital_bone": 1.0,
    "sphenoid_bone": 1.0, "ethmoid_bone": 1.0, "maxilla": 1.0, "zygomatic": 1.0,
    "nasal_bone": 1.0, "lacrimal_bone": 1.0, "palatine_bone": 1.0,
    "inferior_nasal_concha": 1.0, "vomer": 1.0, "mandible": 1.0,
    "cervical_vertebrae": 0.30, "thoracic_vertebrae": 0.30, "lumbar_vertebrae": 0.30,
    "sacrum": 0.30, "coccyx": 0.60,
    "ribs": 0.11, "sternum": 0.30,
    "clavicle": 0.35, "scapula": 0.15,
    "humerus": 0.25, "radius": 0.55, "ulna": 0.55,
    "hand": 0.15,
    "hip_bone": 0.35,
    "femur": 0.30, "patella": 1.0, "tibia": 0.42, "fibula": 0.45,
    "foot": 0.15,
    "costal_cartilage": 0.6,  # smooth, already low-poly
    "ligaments": 1.0,         # thin straps, only ~27K total — keep
    "intervertebral_discs": 0.5,
    "joint_cartilage": 1.0,   # tiny
}

# group current scene meshes by token
from collections import defaultdict
groups = defaultdict(list)
for o in list(bpy.data.objects):
    if o.type == "MESH" and o.data:
        t = token(o.name)
        if t:
            groups[t].append(o)

report = {}
for tok, objs in groups.items():
    target = objs[0]
    # join the rest into target
    if len(objs) > 1:
        for o in objs:
            o.select_set(True)
        bpy.context.view_layer.objects.active = target
        with bpy.context.temp_override(active_object=target, object=target,
                                       selected_objects=objs,
                                       selected_editable_objects=objs):
            bpy.ops.object.join()
        for o in bpy.data.objects:
            o.select_set(False)
    target.name = tok
    target.data.name = tok + "_mesh"

    pre = len(target.data.polygons)
    ratio = RATIO.get(tok, 0.3)
    if ratio < 1.0:
        mod = target.modifiers.new("dec", "DECIMATE")
        mod.ratio = ratio
        mod.decimate_type = "COLLAPSE"
        with bpy.context.temp_override(active_object=target, object=target,
                                       selected_objects=[target],
                                       selected_editable_objects=[target]):
            bpy.ops.object.modifier_apply(modifier=mod.name)
    # smooth after decimate
    for p in target.data.polygons:
        p.use_smooth = True
    report[tok] = {"pre": pre, "post": len(target.data.polygons)}

result = {
    "structures": {k: report[k] for k in sorted(report)},
    "node_count": len([o for o in bpy.data.objects if o.type == "MESH"]),
    "total_post_polys": sum(v["post"] for v in report.values()),
}
print("stage B done")
