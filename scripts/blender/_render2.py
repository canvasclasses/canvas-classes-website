import bpy
import mathutils

OUT = "/tmp/heart_proper.png"

VESSELS = {"aorta", "aorta_2", "superior_vena_cava", "inferior_vena_cava",
           "pulmonary_artery", "pulmonary_artery_2", "pulmonary_veins",
           "pulmonary_veins_2", "pulmonary_veins_3", "pulmonary_veins_4",
           "coronary_artery", "coronary_artery_2", "pulmonary_trunk"}

# Clean up any previous preview rig.
for n in ["PreviewCam", "PreviewSun"]:
    o = bpy.data.objects.get(n)
    if o:
        bpy.data.objects.remove(o, do_unlink=True)

# Hide the (broken, oversized) vessels; render only the heart-proper.
heart = []
for o in bpy.context.scene.objects:
    if o.type != "MESH":
        continue
    if o.name in VESSELS:
        o.hide_render = True
        o.hide_viewport = True
    else:
        o.hide_render = False
        o.hide_viewport = False
        heart.append(o)

mn = [1e18] * 3
mx = [-1e18] * 3
for o in heart:
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
offset = mathutils.Vector((0.25, -1.0, 0.15)).normalized()
cam.location = center + offset * size * 2.3
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
sc.display.shading.color_type = "SINGLE"
sc.display.shading.single_color = (0.7, 0.25, 0.25)
sc.display.shading.show_backface_culling = True
sc.display.shading.show_shadows = True
sc.display.shading.background_type = "VIEWPORT"
sc.display.shading.background_color = (0.02, 0.02, 0.03)
sc.render.resolution_x = 900
sc.render.resolution_y = 900
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)

result = {"heart_size": round(size, 4), "heart_meshes": len(heart)}
print("render2 done")
