import bpy
import mathutils

PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"
RED = (0.86, 0.24, 0.27, 1.0)
BLUE = (0.23, 0.45, 0.86, 1.0)

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

# clear any leftover vessel meshes/curves
for n in list(VESSEL_MAP) + ["aorta", "aorta_2", "superior_vena_cava", "inferior_vena_cava",
                              "pulmonary_artery", "pulmonary_artery_2", "pulmonary_veins",
                              "pulmonary_veins_2", "pulmonary_veins_3", "pulmonary_veins_4",
                              "coronary_artery", "coronary_artery_2"]:
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


def wsize(o):
    mn = [1e18] * 3
    mx = [-1e18] * 3
    for c in o.bound_box:
        w = o.matrix_world @ mathutils.Vector(c)
        for i in range(3):
            mn[i] = min(mn[i], w[i])
            mx[i] = max(mx[i], w[i])
    return round(max(mx[i] - mn[i] for i in range(3)), 4)


counters = {}
report = {}
for name, (token, color, radius) in VESSEL_MAP.items():
    o = bpy.data.objects.get(name)
    if not o or o.type != "CURVE":
        continue
    if o.parent is not None:
        mw = o.matrix_world.copy()
        o.parent = None
        o.matrix_world = mw
    # Normalise per-point radius (the explosion culprit) to a uniform tube.
    maxr = 0.0
    for sp in o.data.splines:
        for p in sp.bezier_points:
            maxr = max(maxr, p.radius)
            p.radius = 1.0
        for p in sp.points:
            maxr = max(maxr, p.radius)
            p.radius = 1.0
    o.data.bevel_depth = radius
    o.data.bevel_resolution = 2
    o.data.resolution_u = 6
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
    report[newname] = {"max_point_radius_before": round(maxr, 2), "world_size_after": wsize(o)}

result = {"vessels": report, "expect": "world_size ~0.02-0.12"}
print("v11c vessels done")
