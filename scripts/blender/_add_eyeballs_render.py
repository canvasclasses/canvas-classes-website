import bpy
import mathutils

# Append Z-Anatomy's eyeballs alongside the muscular system and re-render the face,
# to show how much the empty sockets were the problem.
PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"
OUT = "/tmp/anat-compress/muscular_face_eyes.png"

before = set(o.name for o in bpy.data.objects)
with bpy.data.libraries.load(PATH, link=False) as (src, dst):
    want = [c for c in src.collections if c.lower() in ("eyeball", "sclera", "cornea", "iris", "lens")]
    dst.collections = want

# Link any newly-loaded collections into the scene + un-exclude.
for c in bpy.data.collections:
    if c.name.lower() in ("eyeball", "sclera", "cornea", "iris", "lens"):
        if c.name not in [ch.name for ch in bpy.context.scene.collection.children]:
            try:
                bpy.context.scene.collection.children.link(c)
            except Exception:  # noqa
                pass

# Hide FONT/curve, show meshes.
for o in bpy.context.scene.objects:
    o.hide_render = (o.type != "MESH")

new_objs = [o for o in bpy.data.objects if o.name not in before and o.type == "MESH"]

# ----- reuse face framing (anchor on facial muscles) -----
meshes = [o for o in bpy.context.scene.objects if o.type == "MESH" and not o.hide_render]
FACE_KEYS = ("frontalis", "masseter", "orbicularis", "zygomaticus", "nasalis", "buccinator", "mentalis")
face_pts = []
for o in meshes:
    nl = o.name.lower()
    if any(k in nl for k in FACE_KEYS):
        cc = [0.0, 0.0, 0.0]
        for c in o.bound_box:
            w = o.matrix_world @ mathutils.Vector(c)
            for i in range(3):
                cc[i] += w[i]
        face_pts.append(mathutils.Vector([v / 8 for v in cc]))
head_center = mathutils.Vector((
    sum(p[0] for p in face_pts) / len(face_pts),
    min(p[1] for p in face_pts),
    sum(p[2] for p in face_pts) / len(face_pts),
)) if face_pts else mathutils.Vector((0, 0, 1.55))

for old in [o for o in bpy.data.objects if o.name.startswith("PreviewCam") or o.name.startswith("PreviewSun")]:
    bpy.data.objects.remove(old, do_unlink=True)
cam_data = bpy.data.cameras.new("PreviewCam")
cam = bpy.data.objects.new("PreviewCam", cam_data)
bpy.context.scene.collection.objects.link(cam)
offset = mathutils.Vector((0.05, -1.0, 0.06)).normalized()
cam.location = head_center + offset * 0.42
look = (head_center - cam.location).normalized()
cam.rotation_euler = look.to_track_quat("-Z", "Y").to_euler()
bpy.context.scene.camera = cam

for m in bpy.data.materials:
    if m.use_nodes:
        b = m.node_tree.nodes.get("Principled BSDF")
        if b:
            m.diffuse_color = b.inputs["Base Color"].default_value

ld = bpy.data.lights.new("PreviewSun", "SUN")
ld.energy = 4.0
lo = bpy.data.objects.new("PreviewSun", ld)
bpy.context.scene.collection.objects.link(lo)
lo.rotation_euler = mathutils.Euler((1.0, 0.0, 0.2))

sc = bpy.context.scene
sc.render.engine = "BLENDER_WORKBENCH"
sc.display.shading.light = "STUDIO"
sc.display.shading.color_type = "MATERIAL"
sc.display.shading.background_type = "VIEWPORT"
sc.display.shading.background_color = (0.02, 0.02, 0.03)
sc.render.resolution_x = 800
sc.render.resolution_y = 800
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
result = {"new_eye_meshes": len(new_objs), "names_sample": [o.name for o in new_objs[:12]]}
print("eyeball add+render done")
