import bpy
import mathutils

PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"
OUT = "/tmp/anat-compress/skin_layer.png"

# Fresh scene.
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
for c in list(bpy.data.collections):
    try:
        bpy.data.collections.remove(c)
    except Exception:  # noqa
        pass

# Append candidate skin collections (object membership unknown — enumerate after).
WANT = ("skin", "integument")
with bpy.data.libraries.load(PATH, link=False) as (src, dst):
    dst.collections = [c for c in src.collections if c.lower() in WANT]

# Link + un-exclude everything recursively.
def link_all(coll):
    if coll.name not in [ch.name for ch in bpy.context.scene.collection.children]:
        try:
            bpy.context.scene.collection.children.link(coll)
        except Exception:  # noqa
            pass

for c in list(bpy.data.collections):
    link_all(c)

vl = bpy.context.view_layer
def unexclude(lc):
    lc.exclude = False
    for ch in lc.children:
        unexclude(ch)
unexclude(vl.layer_collection)

meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
rows = sorted([(o.name, len(o.data.polygons)) for o in meshes if o.data], key=lambda x: -x[1])

for o in bpy.context.scene.objects:
    o.hide_render = (o.type != "MESH")

# Front full-body framing (Z up, anterior −Y).
mn = [1e18] * 3
mx = [-1e18] * 3
for o in meshes:
    for c in o.bound_box:
        w = o.matrix_world @ mathutils.Vector(c)
        for i in range(3):
            mn[i] = min(mn[i], w[i]); mx[i] = max(mx[i], w[i])
center = mathutils.Vector([(mn[i] + mx[i]) / 2 for i in range(3)])
size = max(mx[i] - mn[i] for i in range(3))

cam_data = bpy.data.cameras.new("PreviewCam")
cam = bpy.data.objects.new("PreviewCam", cam_data)
bpy.context.scene.collection.objects.link(cam)
offset = mathutils.Vector((0.05, -1.0, 0.04)).normalized()
cam.location = center + offset * size * 1.4
look = (center - cam.location).normalized()
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
lo.rotation_euler = mathutils.Euler((0.9, 0.0, 0.3))

sc = bpy.context.scene
sc.render.engine = "BLENDER_WORKBENCH"
sc.display.shading.light = "STUDIO"
sc.display.shading.color_type = "MATERIAL"
sc.display.shading.background_type = "VIEWPORT"
sc.display.shading.background_color = (0.02, 0.02, 0.03)
sc.render.resolution_x = 700
sc.render.resolution_y = 1000
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)

result = {
    "mesh_count": len(meshes),
    "total_polys": sum(p for _, p in rows),
    "top_meshes": rows[:15],
    "bbox_min": [round(v, 3) for v in mn],
    "bbox_max": [round(v, 3) for v in mx],
}
print("skin probe render done")
