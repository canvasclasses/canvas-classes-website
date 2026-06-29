import bpy
import mathutils

OUT = "/tmp/heart_v4.png"

for n in ["PreviewCam", "PreviewSun"]:
    o = bpy.data.objects.get(n)
    if o:
        bpy.data.objects.remove(o, do_unlink=True)

# unhide everything; copy node base colour -> diffuse_color so Workbench shows it
meshes = []
for o in bpy.context.scene.objects:
    if o.type == "MESH":
        o.hide_render = False
        o.hide_viewport = False
        meshes.append(o)
for m in bpy.data.materials:
    if m.use_nodes:
        b = m.node_tree.nodes.get("Principled BSDF")
        if b:
            m.diffuse_color = b.inputs["Base Color"].default_value

mn = [1e18] * 3
mx = [-1e18] * 3
for o in meshes:
    for c in o.bound_box:
        w = o.matrix_world @ mathutils.Vector(c)
        for i in range(3):
            mn[i] = min(mn[i], w[i])
            mx[i] = max(mx[i], w[i])
center = mathutils.Vector([(mn[i] + mx[i]) / 2 for i in range(3)])
size = max(mx[i] - mn[i] for i in range(3))

cam_data = bpy.data.cameras.new("PreviewCam")
cam = bpy.data.objects.new("PreviewCam", cam_data)
bpy.context.scene.collection.objects.link(cam)
offset = mathutils.Vector((0.25, -1.0, 0.18)).normalized()
cam.location = center + offset * size * 2.2
look = (center - cam.location).normalized()
cam.rotation_euler = look.to_track_quat("-Z", "Y").to_euler()
bpy.context.scene.camera = cam

ld = bpy.data.lights.new("PreviewSun", "SUN")
ld.energy = 4.0
lo = bpy.data.objects.new("PreviewSun", ld)
bpy.context.scene.collection.objects.link(lo)
lo.rotation_euler = mathutils.Euler((0.5, 0.1, 0.4))

sc = bpy.context.scene
sc.render.engine = "BLENDER_WORKBENCH"
sc.display.shading.light = "STUDIO"
sc.display.shading.color_type = "MATERIAL"
sc.display.shading.show_backface_culling = True
sc.display.shading.background_type = "VIEWPORT"
sc.display.shading.background_color = (0.02, 0.02, 0.03)
sc.render.resolution_x = 950
sc.render.resolution_y = 950
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
result = {"size": round(size, 4), "mesh_count": len(meshes)}
print("render3 done")
