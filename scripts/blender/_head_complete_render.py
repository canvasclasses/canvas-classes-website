import bpy, re, json, mathutils

PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"
OUT = "/tmp/anat-compress/head_complete.png"
SK, MU = "1: Skeletal system", "4: Muscular system"

for o in list(bpy.data.objects): bpy.data.objects.remove(o, do_unlink=True)
for c in list(bpy.data.collections):
    try: bpy.data.collections.remove(c)
    except Exception: pass

def helper(n): return bool(re.search(r"\.(i|j|t|s|g)(\.\d+)?$", n))
EYE = ["sclera", "cornea", "iris.l", "iris.r"]
EAR = ["helix", "antihelix", "antitragus", "tragus", "concha of auricle", "lobule of auricle",
       "apex of auricle", "anterior notch of auricle", "crura of antihelix"]
NOSE = ["major alar cartilage"]
def is_extra(n):
    nl = n.lower()
    return any(k in nl for k in EYE + EAR + NOSE)

with bpy.data.libraries.load(PATH, link=False) as (src, dst):
    dst.collections = [c for c in src.collections if c in (SK, MU)]
    dst.objects = [n for n in src.objects if not helper(n) and is_extra(n)]

loaded_extras = [o for o in dst.objects if o is not None]
extras = [o.name for o in loaded_extras]

vl = bpy.context.view_layer
for c in list(bpy.data.collections):
    if c.name in (SK, MU) and c.name not in [ch.name for ch in bpy.context.scene.collection.children]:
        try: bpy.context.scene.collection.children.link(c)
        except Exception: pass
# link appended extra objects into the scene (use the loaded datablocks directly)
for o in loaded_extras:
    try: bpy.context.scene.collection.objects.link(o)
    except Exception: pass
def unexclude(lc):
    lc.exclude = False
    for ch in lc.children: unexclude(ch)
unexclude(vl.layer_collection)
bpy.context.view_layer.update()  # refresh matrix_world before framing/materials

sk_root = bpy.data.collections.get(SK)
sk_objs = set(o.name for o in sk_root.all_objects) if sk_root else set()
extra_set = set(extras)

# drop fascia from muscular per our map
with open("/Users/CanvasClasses/Desktop/canvas/packages/data/simulations/muscular-structure-map.json") as f:
    drop_pats = [d.lower() for d in json.load(f)["drop"]]
for o in [m for m in bpy.context.scene.objects if m.type == "MESH" and m.name not in sk_objs and m.name not in extra_set]:
    if any(d in o.name.lower() for d in drop_pats):
        bpy.data.objects.remove(o, do_unlink=True)

def mkmat(name, rgb, rough):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = (*rgb, 1); b.inputs["Roughness"].default_value = rough
    m.diffuse_color = (*rgb, 1)
    return m
bone_mat = mkmat("Bone", (0.86, 0.80, 0.66), 0.55)
muscle_mat = mkmat("Muscle", (0.52, 0.11, 0.11), 0.42)
tendon_mat = mkmat("Tendon", (0.90, 0.88, 0.82), 0.5)
cart_mat = mkmat("Cartilage", (0.82, 0.83, 0.86), 0.35)
sclera_mat = mkmat("Sclera", (0.93, 0.92, 0.90), 0.3)
iris_mat = mkmat("Iris", (0.30, 0.19, 0.10), 0.4)
TENDON_KEYS = ("tendon", "aponeurosis", "fascia", "retinaculum", "calcaneal", "iliotibial", "linea alba")

meshes = [o for o in bpy.context.scene.objects if o.type == "MESH" and o.data]
for o in bpy.context.scene.objects: o.hide_render = (o.type != "MESH")
for o in meshes:
    nl = o.name.lower()
    if o.name in extra_set:
        if "sclera" in nl: mat = sclera_mat
        elif "iris" in nl: mat = iris_mat
        elif "cornea" in nl: mat = sclera_mat
        else: mat = cart_mat  # ear + nose cartilage
    elif o.name in sk_objs:
        mat = bone_mat
    elif any(k in nl for k in TENDON_KEYS):
        mat = tendon_mat
    else:
        mat = muscle_mat
    o.data.materials.clear(); o.data.materials.append(mat)
    for p in o.data.polygons: p.use_smooth = True

def ctr(o):
    cc = [0, 0, 0]
    for c in o.bound_box:
        w = o.matrix_world @ mathutils.Vector(c)
        for i in range(3): cc[i] += w[i]
    return mathutils.Vector([v/8 for v in cc])
FACE = ("frontalis", "masseter", "orbicularis", "zygomaticus")
fp = [ctr(o) for o in meshes if any(k in o.name.lower() for k in FACE)]
face = mathutils.Vector((sum(p[0] for p in fp)/len(fp), min(p[1] for p in fp), sum(p[2] for p in fp)/len(fp)))
target = mathutils.Vector((face[0], face[1] + 0.02, face[2]))

cam_data = bpy.data.cameras.new("C"); cam = bpy.data.objects.new("C", cam_data)
bpy.context.scene.collection.objects.link(cam)
offset = mathutils.Vector((-0.85, -1.0, 0.06)).normalized()  # 3/4 left-front like the CA shot
cam.location = target + offset * 0.46
cam.rotation_euler = (target - cam.location).normalized().to_track_quat("-Z", "Z").to_euler()
bpy.context.scene.camera = cam

def area(name, loc, e, s=2.0):
    d = bpy.data.lights.new(name, "AREA"); d.energy = e; d.size = s
    o = bpy.data.objects.new(name, d); o.location = loc
    bpy.context.scene.collection.objects.link(o)
    o.rotation_euler = (target - mathutils.Vector(loc)).normalized().to_track_quat("-Z", "Z").to_euler()
area("K", (-0.8, -1.0, target[2]+0.4), 32, 2.0)
area("F", (0.9, -0.7, target[2]), 14, 2.0)
area("R", (0.2, 1.0, target[2]+0.4), 22, 1.6)
w = bpy.data.worlds.new("W"); w.use_nodes = True
w.node_tree.nodes["Background"].inputs[1].default_value = 0.35
bpy.context.scene.world = w

sc = bpy.context.scene
sc.render.engine = "BLENDER_EEVEE" if "BLENDER_EEVEE" in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else "BLENDER_EEVEE_NEXT"
try: sc.eevee.use_gtao = True
except Exception: pass
try: sc.view_settings.view_transform = "Filmic"
except Exception: pass
sc.render.resolution_x = 820; sc.render.resolution_y = 1000
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
result = {"extras_added": len(extras), "ear_parts": sum(1 for n in extras if any(k in n.lower() for k in EAR)),
          "eye_parts": sum(1 for n in extras if any(k in n.lower() for k in EYE)),
          "face_z": round(face[2], 3)}
print("head complete render done")
