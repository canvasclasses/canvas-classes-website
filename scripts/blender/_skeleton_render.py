import bpy
import mathutils

OUT = "/tmp/skeleton_v1.png"

# Reimport the exported glb into a clean scene so we render exactly what shipped.
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
bpy.ops.import_scene.gltf(filepath="/tmp/skeleton-v1.glb")

meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
for o in meshes:
    o.hide_render = False
    o.hide_viewport = False
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

# Front view: camera on +Z looking at the skeleton (Y is up after export_yup).
cam_data = bpy.data.cameras.new("PreviewCam")
cam = bpy.data.objects.new("PreviewCam", cam_data)
bpy.context.scene.collection.objects.link(cam)
offset = mathutils.Vector((0.05, -1.0, 0.04)).normalized()  # front view, Z-up after import
cam.location = center + offset * size * 1.45
look = (center - cam.location).normalized()
cam.rotation_euler = look.to_track_quat("-Z", "Y").to_euler()
bpy.context.scene.camera = cam

ld = bpy.data.lights.new("PreviewSun", "SUN")
ld.energy = 4.0
lo = bpy.data.objects.new("PreviewSun", ld)
bpy.context.scene.collection.objects.link(lo)
lo.rotation_euler = mathutils.Euler((0.6, 0.1, 0.3))

sc = bpy.context.scene
sc.render.engine = "BLENDER_WORKBENCH"
sc.display.shading.light = "STUDIO"
sc.display.shading.color_type = "MATERIAL"
sc.display.shading.show_backface_culling = True
sc.display.shading.background_type = "VIEWPORT"
sc.display.shading.background_color = (0.02, 0.02, 0.03)
sc.render.resolution_x = 600
sc.render.resolution_y = 950
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
result = {"size": round(size, 4), "mesh_count": len(meshes),
          "bbox_min": [round(v, 3) for v in mn], "bbox_max": [round(v, 3) for v in mx]}
print("skeleton render done")
