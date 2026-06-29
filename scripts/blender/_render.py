import bpy
import mathutils

OUT = "/tmp/heart_render.png"

meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
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

# Camera: 3/4 anterior view (-Y front, slight +X/+Z).
cam_data = bpy.data.cameras.new("PreviewCam")
cam = bpy.data.objects.new("PreviewCam", cam_data)
bpy.context.scene.collection.objects.link(cam)
offset = mathutils.Vector((0.4, -1.0, 0.22)).normalized()
cam.location = center + offset * size * 2.4
look = (center - cam.location).normalized()
cam.rotation_euler = look.to_track_quat("-Z", "Y").to_euler()
bpy.context.scene.camera = cam

# Light
ld = bpy.data.lights.new("PreviewSun", "SUN")
ld.energy = 4.0
lo = bpy.data.objects.new("PreviewSun", ld)
bpy.context.scene.collection.objects.link(lo)
lo.rotation_euler = mathutils.Euler((0.6, 0.2, 0.5))

sc = bpy.context.scene
sc.render.engine = "BLENDER_WORKBENCH"
sc.display.shading.light = "STUDIO"
sc.display.shading.color_type = "MATERIAL"
sc.display.shading.show_backface_culling = True   # single-sided — the key test
sc.display.shading.background_type = "VIEWPORT"
sc.display.shading.background_color = (0.02, 0.02, 0.03)
sc.render.resolution_x = 900
sc.render.resolution_y = 900
sc.render.film_transparent = False
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)

result = {"center": [round(c, 3) for c in center], "size": round(size, 4), "mesh_count": len(meshes)}
print("render done")
