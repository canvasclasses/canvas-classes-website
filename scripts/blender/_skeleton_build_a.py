import bpy
import bmesh
import re
from mathutils import Matrix

PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"
# Append both the bones AND the joints system (ligaments, intervertebral discs,
# joint cartilage). Capsules/membranes are classified out (they obscure the bones).
TARGETS = ["1: Skeletal system", "3: Joints"]

# ---------- reset ----------
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
for c in list(bpy.data.collections):
    try:
        bpy.data.collections.remove(c)
    except Exception:  # noqa
        pass
for m in list(bpy.data.meshes):
    bpy.data.meshes.remove(m)
for mt in list(bpy.data.materials):
    try:
        bpy.data.materials.remove(mt)
    except Exception:  # noqa
        pass

# ---------- append ----------
with bpy.data.libraries.load(PATH, link=False) as (src, dst):
    dst.collections = [t for t in TARGETS if t in src.collections]
roots = [bpy.data.collections.get(t) for t in TARGETS if bpy.data.collections.get(t)]
for rc in roots:
    if rc.name not in bpy.context.scene.collection.children:
        bpy.context.scene.collection.children.link(rc)
bpy.context.view_layer.update()  # ensure matrix_world reflects parent transforms


# ---------- token classifier (name -> structure token, or None to drop) ----------
def token(name):
    nl = name.lower()
    if nl.endswith(".i") or nl.endswith(".j") or nl.endswith(".g"):
        return None
    if any(k in nl for k in ["incisor", "canine", "premolar", "molar tooth"]):
        # Keep the teeth (excluding them left jagged, asymmetric empty sockets).
        # Upper teeth sit in the maxilla; lower teeth in the mandible.
        return "mandible" if "lower" in nl else "maxilla"
    if "costal cartilage" in nl:
        return "costal_cartilage"  # rib → sternum connectors (kept; distinct material)
    # ── Joints system ("3: Joints") ──
    if "ligament" in nl:
        return "ligaments"             # all ligaments → one toggle-able group
    if "intervertebral disc" in nl:
        return "intervertebral_discs"  # spinal cushions (cartilage material)
    if any(k in nl for k in ["meniscus", "articular disc", "labrum"]):
        return "joint_cartilage"       # menisci / discs / labra (cartilage material)
    if "capsule" in nl or "membrane" in nl:
        return None  # joint capsules + intercostal membranes obscure the bones
    if any(k in nl for k in ["cartilage", "cricoid", "arytenoid", "corniculate"]):
        return None  # larynx / ear / other non-skeletal cartilage
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


# ---------- partition ----------
keep = {}      # obj -> token
unmapped = []  # mesh names with geometry that we dropped (for review)
drop = []
seen_obj = set()
all_src_objs = []
for rc in roots:
    for o in rc.all_objects:
        if o.name not in seen_obj:
            seen_obj.add(o.name)
            all_src_objs.append(o)
for o in all_src_objs:
    if o.type != "MESH" or not o.data:
        drop.append(o)
        continue
    tok = token(o.name)
    if tok is None:
        # only flag as "unmapped" if it actually had geometry and wasn't a helper/teeth/cartilage
        nl = o.name.lower()
        is_known_drop = (nl.endswith(".i") or nl.endswith(".j") or nl.endswith(".g")
                         or any(k in nl for k in ["incisor", "canine", "premolar",
                                                  "molar tooth", "cartilage", "cricoid",
                                                  "arytenoid", "corniculate"]))
        if len(o.data.polygons) > 0 and not is_known_drop:
            unmapped.append((o.name, len(o.data.polygons)))
        drop.append(o)
    else:
        keep[o] = tok

# ---------- CAPTURE world matrices while parents are still intact ----------
# Z-Anatomy bones are parented to group (.g) objects we're about to delete, and
# the bone's WORLD position lives entirely in that inherited parent transform
# (local verts are origin-centred). So snapshot matrix_world NOW, then bake it
# straight into the verts — never re-read matrix_world after detaching/deleting.
world_mats = {o: o.matrix_world.copy() for o in keep}

# ---------- delete dropped objects (parents included — safe, matrices captured) ----------
for o in drop:
    try:
        bpy.data.objects.remove(o, do_unlink=True)
    except Exception:  # noqa
        pass

# ---------- single-user mesh + bake captured world transform into verts + smooth ----------
bone_mat = bpy.data.materials.new("Bone")
bone_mat.use_nodes = True
bsdf = bone_mat.node_tree.nodes.get("Principled BSDF")
IVORY = (0.93, 0.90, 0.82, 1.0)
if bsdf:
    bsdf.inputs["Base Color"].default_value = IVORY
    if "Roughness" in bsdf.inputs:
        bsdf.inputs["Roughness"].default_value = 0.6
    if "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = 0.3
bone_mat.diffuse_color = IVORY  # Workbench QA renders

for o in list(keep.keys()):
    if o.data.users > 1:
        o.data = o.data.copy()
    me = o.data
    # Drop any inherited modifiers (some Z-Anatomy bones carry a SUBSURF modifier).
    # Left on, the join makes the merged mesh inherit it and export_apply re-subdivides
    # it (3x poly explosion); we control detail purely via our own Decimate instead.
    o.modifiers.clear()
    o.parent = None
    me.transform(world_mats[o])      # bake captured world position into geometry
    # Z-Anatomy builds the LEFT-side bones by mirroring the right (negative-scale
    # matrix). Baking a negative-determinant transform turns the mesh inside-out
    # (winding/normals flipped). Blender solid view is double-sided so it looks fine,
    # but our viewer renders single-sided (FrontSide) → those faces get culled and the
    # whole left/face reads as broken/see-through. Flip the winding back here.
    if world_mats[o].determinant() < 0:
        bm = bmesh.new()
        bm.from_mesh(me)
        bmesh.ops.reverse_faces(bm, faces=bm.faces)
        bm.to_mesh(me)
        bm.free()
    o.matrix_world = Matrix.Identity(4)
    o.data.materials.clear()
    o.data.materials.append(bone_mat)
    for p in me.polygons:
        p.use_smooth = True

# ---------- trim tooth ROOTS (keep crowns only) ----------
# Each Z-Anatomy tooth is crown + a long root. The maxilla/mandible don't fully
# enclose the roots, so from an angle the roots poke out as long "spiky" teeth
# (founder saw this on the skull's left). Geometry is already baked to world coords
# here, so cut along world-Z: upper teeth crown points DOWN (keep low Z), lower
# teeth crown points UP (keep high Z). Keep ~the biting 55%.
def is_tooth(name):
    nl = name.lower()
    return any(k in nl for k in ["incisor", "canine", "premolar", "molar"])

KEEP_CROWN = 0.55  # fraction of the tooth (from the biting end) to keep
for o in list(keep.keys()):
    if not is_tooth(o.name):
        continue
    me = o.data
    zs = [v.co.z for v in me.vertices]
    if not zs:
        continue
    zmin, zmax = min(zs), max(zs)
    h = zmax - zmin
    lower = "lower" in o.name.lower()
    bm = bmesh.new()
    bm.from_mesh(me)
    if lower:                       # crown up → keep high Z
        cut = zmax - KEEP_CROWN * h
        kill = [v for v in bm.verts if v.co.z < cut]
    else:                          # upper crown down → keep low Z
        cut = zmin + KEEP_CROWN * h
        kill = [v for v in bm.verts if v.co.z > cut]
    if kill and len(kill) < len(bm.verts):
        bmesh.ops.delete(bm, geom=kill, context="VERTS")
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True

# ---------- report ----------
from collections import defaultdict
by_tok = defaultdict(lambda: [0, 0])
for o, t in keep.items():
    by_tok[t][0] += 1
    by_tok[t][1] += len(o.data.polygons)

result = {
    "kept_objects": len(keep),
    "tokens": {t: {"meshes": v[0], "polys": v[1]} for t, v in sorted(by_tok.items())},
    "total_kept_polys": sum(len(o.data.polygons) for o in keep),
    "unmapped_dropped_with_geometry": sorted(unmapped, key=lambda x: -x[1]),
}
print("stage A done")
