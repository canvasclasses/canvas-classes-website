import bpy
import mathutils

PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"
OUT = "/tmp/anat-compress/refined_preview.png"

# Fresh scene → append skeleton + muscular together (same Z-Anatomy coordinate
# space, so they align perfectly). Colour: bone cream, muscle red, tendon white.
# Render with EEVEE + soft lighting + AO to preview the achievable quality.
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
for c in list(bpy.data.collections):
    try: bpy.data.collections.remove(c)
    except Exception: pass

SK = "1: Skeletal system"
MU = "4: Muscular system"
with bpy.data.libraries.load(PATH, link=False) as (src, dst):
    dst.collections = [c for c in src.collections if c in (SK, MU)]

vl = bpy.context.view_layer
for c in list(bpy.data.collections):
    if c.name in (SK, MU) and c.name not in [ch.name for ch in bpy.context.scene.collection.children]:
        try: bpy.context.scene.collection.children.link(c)
        except Exception: pass
def unexclude(lc):
    lc.exclude = False
    for ch in lc.children: unexclude(ch)
unexclude(vl.layer_collection)

# CRITICAL: refresh the dependency graph so matrix_world is correct for the freshly
# appended objects (skeleton bone positions come from a parent transform). Without
# this, obj_center() reads stale origin-centred transforms and framing aims at (0,0,0).
bpy.context.view_layer.update()

sk_root = bpy.data.collections.get(SK)
sk_objs = set(o.name for o in sk_root.all_objects) if sk_root else set()

# Apply our structure-map DROP list to the MUSCULAR meshes (remove fascia sheets,
# bursae, tendon sheaths, cross-sections) so the preview matches what we ship — these
# white fascia layers otherwise blanket the torso and hide the red muscle beneath.
import json
with open("/Users/CanvasClasses/Desktop/canvas/packages/data/simulations/muscular-structure-map.json") as f:
    drop_pats = [d.lower() for d in json.load(f)["drop"]]
for o in [m for m in bpy.context.scene.objects if m.type == "MESH" and m.name not in sk_objs]:
    nl = o.name.lower()
    if any(d in nl for d in drop_pats):
        bpy.data.objects.remove(o, do_unlink=True)

def mkmat(name, rgb, rough, spec=0.5):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = (*rgb, 1)
    b.inputs["Roughness"].default_value = rough
    if "Specular IOR Level" in b.inputs:
        b.inputs["Specular IOR Level"].default_value = spec
    m.diffuse_color = (*rgb, 1)
    return m

bone_mat = mkmat("BonePreview", (0.86, 0.80, 0.66), 0.55)
muscle_mat = mkmat("MusclePreview", (0.52, 0.11, 0.11), 0.42, 0.6)   # red, slight wet sheen
tendon_mat = mkmat("TendonPreview", (0.90, 0.88, 0.82), 0.5)          # white/cream

TENDON_KEYS = ("tendon", "aponeurosis", "fascia", "retinaculum", "calcaneal",
               "palmar aponeurosis", "plantar aponeurosis", "iliotibial", "linea alba")

meshes = [o for o in bpy.context.scene.objects if o.type == "MESH" and o.data]
for o in bpy.context.scene.objects:
    o.hide_render = (o.type != "MESH")
for o in meshes:
    nl = o.name.lower()
    if o.name in sk_objs:
        mat = bone_mat
    elif any(k in nl for k in TENDON_KEYS):
        mat = tendon_mat
    else:
        mat = muscle_mat
    o.data.materials.clear()
    o.data.materials.append(mat)
    for p in o.data.polygons:
        p.use_smooth = True

# Frame on real chest/head landmarks (robust to stray verts that inflate bbox).
def obj_center(o):
    cc = [0.0, 0.0, 0.0]
    for c in o.bound_box:
        w = o.matrix_world @ mathutils.Vector(c)
        for i in range(3): cc[i] += w[i]
    return mathutils.Vector([v/8 for v in cc])

FACE_KEYS = ("frontalis", "masseter", "orbicularis", "zygomaticus", "nasalis", "buccinator")
fpts = [obj_center(o) for o in meshes if any(k in o.name.lower() for k in FACE_KEYS)]
face = mathutils.Vector((
    sum(p[0] for p in fpts)/len(fpts),
    min(p[1] for p in fpts),
    sum(p[2] for p in fpts)/len(fpts),
)) if fpts else mathutils.Vector((0, -0.1, 1.56))
# Frame from head down to mid-chest: aim a bit below the face.
target = mathutils.Vector((face[0], face[1], face[2] - 0.26))
diag_target = [round(v, 3) for v in target]
frame_h = 0.46  # camera ~1.06 m out → head + chest + shoulders

cam_data = bpy.data.cameras.new("PreviewCam")
cam = bpy.data.objects.new("PreviewCam", cam_data)
bpy.context.scene.collection.objects.link(cam)
offset = mathutils.Vector((-0.55, -1.0, 0.12)).normalized()  # 3/4 front-left, slightly above
cam.location = target + offset * frame_h * 2.3
look = (target - cam.location).normalized()
cam.rotation_euler = look.to_track_quat("-Z", "Z").to_euler()  # world up = +Z (scene is Z-up)
bpy.context.scene.camera = cam

# Lighting: key + fill + rim area lights.
def area(name, loc, energy, size=2.0):
    d = bpy.data.lights.new(name, "AREA"); d.energy = energy; d.size = size
    o = bpy.data.objects.new(name, d); o.location = loc
    bpy.context.scene.collection.objects.link(o)
    look = (target - mathutils.Vector(loc)).normalized()
    o.rotation_euler = look.to_track_quat("-Z", "Y").to_euler()
    return o
tz = target[2]
area("Key", (-1.0, -1.4, tz+0.4), 55, size=2.5)
area("Fill", (1.2, -0.9, tz+0.1), 22, size=2.5)
area("Rim", (0.2, 1.3, tz+0.6), 38, size=2.0)

world = bpy.data.worlds.new("W"); world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = (0.05, 0.06, 0.08, 1)
world.node_tree.nodes["Background"].inputs[1].default_value = 0.4
bpy.context.scene.world = world

sc = bpy.context.scene
eng = "BLENDER_EEVEE_NEXT" if "BLENDER_EEVEE_NEXT" in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else "BLENDER_EEVEE"
sc.render.engine = eng
try: sc.eevee.use_gtao = True
except Exception: pass
try: sc.eevee.use_raytracing = True
except Exception: pass
try: sc.view_settings.view_transform = "Filmic"
except Exception: pass
try: sc.view_settings.look = "Medium High Contrast"
except Exception: pass
sc.render.resolution_x = 900
sc.render.resolution_y = 1100
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
result = {"engine": eng, "meshes": len(meshes), "bone": len(sk_objs),
          "fpts": len(fpts), "face_z": round(face[2], 3),
          "target": [round(v, 3) for v in target],
          "cam_loc": [round(v, 3) for v in cam.location],
          "n_muscle": sum(1 for o in meshes if o.data.materials and o.data.materials[0].name == "MusclePreview"),
          "n_tendon": sum(1 for o in meshes if o.data.materials and o.data.materials[0].name == "TendonPreview"),
          "n_bone": sum(1 for o in meshes if o.data.materials and o.data.materials[0].name == "BonePreview")}
print("refined preview render done")
