import bpy
import bmesh
import mathutils
from statistics import median

PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"
RED = (0.86, 0.24, 0.27, 1.0)
BLUE = (0.23, 0.45, 0.86, 1.0)
BEVEL_RES = 6   # was 2 → ~6 sides; 6 → ~14 sides (round)
RES_U = 10      # was 6 → smoother along the path

VESSEL_MAP = {
    "Ascending aorta": ("aorta", RED, 0.013),
    "Aortic arch": ("aorta", RED, 0.013),
    "Superior vena cava": ("superior_vena_cava", BLUE, 0.011),
    "Inferior vena cava (thoracic part)": ("inferior_vena_cava", BLUE, 0.012),
    "Left pulmonary artery": ("pulmonary_artery", BLUE, 0.010),
    "Right pulmonary artery": ("pulmonary_artery", BLUE, 0.010),
    "Left superior pulmonary vein": ("pulmonary_veins", RED, 0.006),
    "Left inferior pulmonary vein": ("pulmonary_veins", RED, 0.006),
    "Right superior pulmonary vein": ("pulmonary_veins", RED, 0.006),
    "Right inferior pulmonary vein": ("pulmonary_veins", RED, 0.006),
    "Left coronary artery": ("coronary_artery", RED, 0.0035),
    "Right coronary artery": ("coronary_artery", RED, 0.0035),
}
TOKENS = ["aorta", "aorta_2", "superior_vena_cava", "inferior_vena_cava",
          "pulmonary_artery", "pulmonary_artery_2", "pulmonary_veins",
          "pulmonary_veins_2", "pulmonary_veins_3", "pulmonary_veins_4",
          "coronary_artery", "coronary_artery_2", "pulmonary_trunk"]

# delete existing (low-poly) vessel meshes
for n in list(VESSEL_MAP) + TOKENS:
    o = bpy.data.objects.get(n)
    if o:
        bpy.data.objects.remove(o, do_unlink=True)

col = bpy.data.collections.get("Vessels") or bpy.data.collections.new("Vessels")
if "Vessels" not in [c.name for c in bpy.context.scene.collection.children]:
    bpy.context.scene.collection.children.link(col)
with bpy.data.libraries.load(PATH, link=False) as (src, dst):
    dst.objects = [n for n in VESSEL_MAP if n in src.objects and n not in bpy.data.objects]
for n in VESSEL_MAP:
    o = bpy.data.objects.get(n)
    if o and col not in list(o.users_collection):
        for c in list(o.users_collection):
            try:
                c.objects.unlink(o)
            except Exception:  # noqa
                pass
        col.objects.link(o)

mat_cache = {}


def get_mat(color):
    key = tuple(round(c, 3) for c in color)
    if key in mat_cache:
        return mat_cache[key]
    m = bpy.data.materials.new("vessel_%s" % "_".join(str(int(c * 255)) for c in color[:3]))
    m.use_nodes = True
    m.diffuse_color = color
    b = m.node_tree.nodes.get("Principled BSDF")
    if b:
        b.inputs["Base Color"].default_value = color
        b.inputs["Roughness"].default_value = 0.55
        b.inputs["Metallic"].default_value = 0.0
    mat_cache[key] = m
    return m


counters = {}
made = []
for name, (token, color, radius) in VESSEL_MAP.items():
    o = bpy.data.objects.get(name)
    if not o or o.type != "CURVE":
        continue
    if o.parent is not None:
        mw = o.matrix_world.copy()
        o.parent = None
        o.matrix_world = mw
    for sp in o.data.splines:
        for p in sp.bezier_points:
            p.radius = 1.0
        for p in sp.points:
            p.radius = 1.0
    o.data.bevel_depth = radius
    o.data.bevel_resolution = BEVEL_RES
    o.data.resolution_u = RES_U
    o.data.use_fill_caps = True
    with bpy.context.temp_override(active_object=o, selected_objects=[o], selected_editable_objects=[o], object=o):
        bpy.ops.object.convert(target="MESH")
    counters[token] = counters.get(token, 0) + 1
    newname = token if counters[token] == 1 else "%s_%d" % (token, counters[token])
    o.name = newname
    if o.data:
        o.data.name = newname
        o.data.materials.clear()
        o.data.materials.append(get_mat(color))
        for poly in o.data.polygons:
            poly.use_smooth = True   # smooth shading → rounder look
    made.append(newname)

# clean stray verts (far from each vessel's own cluster)
for name in made:
    o = bpy.data.objects.get(name)
    if not o or not o.data.vertices:
        continue
    bm = bmesh.new()
    bm.from_mesh(o.data)
    med = mathutils.Vector((
        median([v.co.x for v in bm.verts]),
        median([v.co.y for v in bm.verts]),
        median([v.co.z for v in bm.verts]),
    ))
    far = [v for v in bm.verts if (v.co - med).length > 0.18]
    if far:
        bmesh.ops.delete(bm, geom=far, context="VERTS")
    bm.to_mesh(o.data)
    bm.free()

# reposition the ascending aorta (it converts at the world origin) to bridge
# the aortic valve and the aortic arch.
def center(o):
    mn = [1e18] * 3
    mx = [-1e18] * 3
    for c in o.bound_box:
        w = o.matrix_world @ mathutils.Vector(c)
        for i in range(3):
            mn[i] = min(mn[i], w[i])
            mx[i] = max(mx[i], w[i])
    return mathutils.Vector([(mn[i] + mx[i]) / 2 for i in range(3)])


aorta = bpy.data.objects.get("aorta")
av = bpy.data.objects.get("aortic_valve")
arch = bpy.data.objects.get("aorta_2")
if aorta and av and arch:
    target = (center(av) + center(arch)) / 2
    aorta.location = aorta.location + (target - center(aorta))

total = sum(len(bpy.data.objects[n].data.polygons) for n in made if bpy.data.objects.get(n))
result = {"vessels": len(made), "vessel_polys": total, "bevel_res": BEVEL_RES, "res_u": RES_U}
print("v12 vessels done")
