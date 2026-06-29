import bpy
import mathutils

OUT = "/tmp/skeleton_skull.png"

for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
bpy.ops.import_scene.gltf(filepath="/tmp/skeleton-v1.glb")

meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
for m in bpy.data.materials:
    if m.use_nodes:
        b = m.node_tree.nodes.get("Principled BSDF")
        if b:
            m.diffuse_color = b.inputs["Base Color"].default_value

# bbox of skull + mandible (whole head — see the teeth + jaw)
targets = [o for o in meshes if o.name in ("skull", "mandible")]
mn = [1e18] * 3
mx = [-1e18] * 3
for o in targets:
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
offset = mathutils.Vector((0.06, -1.0, 0.04)).normalized()  # frontal
cam.location = center + offset * size * 1.25
look = (center - cam.location).normalized()
cam.rotation_euler = look.to_track_quat("-Z", "Y").to_euler()
bpy.context.scene.camera = cam

ld = bpy.data.lights.new("PreviewSun", "SUN")
ld.energy = 5.0
lo = bpy.data.objects.new("PreviewSun", ld)
bpy.context.scene.collection.objects.link(lo)
lo.rotation_euler = mathutils.Euler((0.9, 0.0, 0.0))  # from the front, lights the teeth
ld2 = bpy.data.lights.new("Fill", "SUN")
ld2.energy = 2.5
lo2 = bpy.data.objects.new("Fill", ld2)
bpy.context.scene.collection.objects.link(lo2)
lo2.rotation_euler = mathutils.Euler((0.4, 0.0, 0.6))

sc = bpy.context.scene
sc.render.engine = "BLENDER_WORKBENCH"
sc.display.shading.light = "STUDIO"
sc.display.shading.color_type = "MATERIAL"
sc.display.shading.show_backface_culling = True
sc.display.shading.background_type = "VIEWPORT"
sc.display.shading.background_color = (0.02, 0.02, 0.03)
sc.render.resolution_x = 1000
sc.render.resolution_y = 1000
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
result = {"skull_poly": len(bpy.data.objects.get("skull").data.polygons),
          "mandible_poly": len(bpy.data.objects.get("mandible").data.polygons)}
print("skull render done")
