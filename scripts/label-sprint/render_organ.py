import bpy, sys, math
from mathutils import Vector

argv = sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else []
GLB = argv[0]
OUT = argv[1]
VIEW = argv[2] if len(argv) > 2 else "front"   # front | back | left | right

# ---- clean scene ----
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=GLB)

meshes = [o for o in bpy.data.objects if o.type == "MESH"]
if not meshes:
    raise SystemExit("no meshes imported")

# ---- combined world-space bounding box ----
mn = Vector(( 1e18,  1e18,  1e18))
mx = Vector((-1e18, -1e18, -1e18))
for o in meshes:
    for c in o.bound_box:
        w = o.matrix_world @ Vector(c)
        for i in range(3):
            mn[i] = min(mn[i], w[i]); mx[i] = max(mx[i], w[i])
center = (mn + mx) * 0.5
dim = mx - mn

# per-object bbox centroid (used for framing + hotspot projection)
def obj_centroid(o):
    cs = [o.matrix_world @ Vector(c) for c in o.bound_box]
    return sum(cs, Vector((0, 0, 0))) / 8.0
cents = [obj_centroid(o) for o in meshes]
mass = sum(cents, Vector((0, 0, 0))) / len(cents)   # frame on the bulk, not the long vessels

# ---- empty target for camera ----
tgt = bpy.data.objects.new("tgt", None); bpy.context.collection.objects.link(tgt)
tgt.location = Vector((mass.x, center.y, mass.z))

# view direction: where the camera sits relative to center
D = max(dim) * 4.0
offs = {
    "front": Vector((0, -D, 0)),
    "back":  Vector((0,  D, 0)),
    "left":  Vector((-D, 0, 0)),
    "right": Vector(( D, 0, 0)),
}[VIEW]
# visible plane dims (perpendicular to view axis) -> ortho scale
if VIEW in ("front", "back"):
    span = max(dim.x, dim.z)
else:
    span = max(dim.y, dim.z)

cam_data = bpy.data.cameras.new("cam")
cam_data.type = "ORTHO"
cam_data.ortho_scale = span * 1.18
cam_data.clip_start = 0.01
cam_data.clip_end = D * 6
cam = bpy.data.objects.new("cam", cam_data)
bpy.context.collection.objects.link(cam)
cam.location = center + offs
tc = cam.constraints.new("TRACK_TO"); tc.target = tgt
tc.track_axis = "TRACK_NEGATIVE_Z"; tc.up_axis = "UP_Y"
bpy.context.scene.camera = cam

# ---- workbench: clean flat diagram look, model's own colours ----
scene = bpy.context.scene
scene.render.engine = "BLENDER_WORKBENCH"
sh = scene.display.shading
sh.light = "STUDIO"
sh.color_type = "MATERIAL"
sh.show_cavity = True
sh.cavity_type = "BOTH"
sh.curvature_ridge_factor = 1.0
sh.curvature_valley_factor = 1.0
try:
    sh.show_shadows = True
    sh.shadow_intensity = 0.35
except Exception:
    pass
try:
    scene.display.render_aa = "16"
except Exception:
    pass

scene.render.film_transparent = True
scene.render.resolution_x = 1200
scene.render.resolution_y = 1200
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.filepath = OUT

bpy.ops.render.render(write_still=True)
print("RENDERED", OUT)

# ---- auto hotspots: project every named mesh centroid to image space (0-1) ----
import json
from bpy_extras.object_utils import world_to_camera_view
hs = {}
for o, cen in zip(meshes, cents):
    co = world_to_camera_view(scene, cam, cen)
    hs[o.name] = {"x": round(co.x, 4), "y": round(1.0 - co.y, 4), "depth": round(co.z, 3)}
with open(OUT.rsplit(".", 1)[0] + ".hotspots.json", "w") as f:
    json.dump(hs, f, indent=1)
print("HOTSPOTS", len(hs))
