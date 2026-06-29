import bpy
import mathutils

OUT = "/tmp/anat-compress/muscular_face.png"

# Render a clean front close-up of the HEAD from the live muscular scene (Z-up,
# anterior = -Y). Hide FONT label objects + curves so only muscle meshes show.
for o in bpy.context.scene.objects:
    if o.type == "MESH":
        o.hide_render = False
    else:
        o.hide_render = True

meshes = [o for o in bpy.context.scene.objects if o.type == "MESH" and not o.hide_render]

# Robustly locate the FACE by averaging the world-centres of known facial muscles
# (immune to stray verts that corrupt the global bbox).
FACE_KEYS = ("frontalis", "masseter", "orbicularis", "zygomaticus", "nasalis", "buccinator", "mentalis")
face_pts = []
for o in meshes:
    nl = o.name.lower()
    if any(k in nl for k in FACE_KEYS):
        # object world-space bound-box centre
        cc = [0.0, 0.0, 0.0]
        for c in o.bound_box:
            w = o.matrix_world @ mathutils.Vector(c)
            for i in range(3):
                cc[i] += w[i]
        face_pts.append(mathutils.Vector([v / 8 for v in cc]))
if face_pts:
    head_center = mathutils.Vector((
        sum(p[0] for p in face_pts) / len(face_pts),
        min(p[1] for p in face_pts),   # most anterior (−Y) of the facial muscles
        sum(p[2] for p in face_pts) / len(face_pts),
    ))
else:
    head_center = mathutils.Vector((0, 0, 1.55))

for old in [o for o in bpy.data.objects if o.name.startswith("PreviewCam") or o.name.startswith("PreviewSun")]:
    bpy.data.objects.remove(old, do_unlink=True)

cam_data = bpy.data.cameras.new("PreviewCam")
cam = bpy.data.objects.new("PreviewCam", cam_data)
bpy.context.scene.collection.objects.link(cam)
offset = mathutils.Vector((0.05, -1.0, 0.06)).normalized()  # front, slightly above
cam.location = head_center + offset * 0.42  # ~0.42 m in front
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
sc.display.shading.show_backface_culling = False
sc.display.shading.background_type = "VIEWPORT"
sc.display.shading.background_color = (0.02, 0.02, 0.03)
sc.render.resolution_x = 800
sc.render.resolution_y = 800
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
result = {"face_pts": len(face_pts), "head_center": [round(v, 3) for v in head_center]}
print("muscular face render done")
