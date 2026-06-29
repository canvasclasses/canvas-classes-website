import bpy
import os

OUT = "/tmp/heart.glb"
RED = (0.86, 0.24, 0.27, 1.0)   # oxygenated
BLUE = (0.23, 0.45, 0.86, 1.0)  # deoxygenated

# object name -> (canonical token, colour, world tube radius)
# Radii sized to the model (heart ~0.05-0.10 wide): aorta widest, coronaries thin.
VESSEL_MAP = {
    "Ascending aorta":                ("aorta", RED, 0.013),
    "Aortic arch":                    ("aorta", RED, 0.013),
    "Superior vena cava":             ("superior_vena_cava", BLUE, 0.011),
    "Inferior vena cava (thoracic part)": ("inferior_vena_cava", BLUE, 0.012),
    "Left pulmonary artery":          ("pulmonary_artery", BLUE, 0.010),
    "Right pulmonary artery":         ("pulmonary_artery", BLUE, 0.010),
    "Left superior pulmonary vein":   ("pulmonary_veins", RED, 0.006),
    "Left inferior pulmonary vein":   ("pulmonary_veins", RED, 0.006),
    "Right superior pulmonary vein":  ("pulmonary_veins", RED, 0.006),
    "Right inferior pulmonary vein":  ("pulmonary_veins", RED, 0.006),
    "Left coronary artery":           ("coronary_artery", RED, 0.0035),
    "Right coronary artery":          ("coronary_artery", RED, 0.0035),
}

mat_cache = {}


def get_mat(color):
    key = tuple(round(c, 3) for c in color)
    if key in mat_cache:
        return mat_cache[key]
    m = bpy.data.materials.new(name="vessel_%s" % "_".join(str(int(c * 255)) for c in color[:3]))
    m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    if b:
        b.inputs["Base Color"].default_value = color
        b.inputs["Roughness"].default_value = 0.55
        b.inputs["Metallic"].default_value = 0.0
    mat_cache[key] = m
    return m


vcol = bpy.data.collections.get("Vessels")
if vcol is None:
    vcol = bpy.data.collections.new("Vessels")
if "Vessels" not in [c.name for c in bpy.context.scene.collection.children]:
    bpy.context.scene.collection.children.link(vcol)

# 1) give every curve a real thickness + low-poly profile
for name, (_tok, _col, radius) in VESSEL_MAP.items():
    o = bpy.data.objects.get(name)
    if o and o.type == "CURVE":
        o.data.bevel_depth = radius
        o.data.bevel_resolution = 2      # ~hexagonal tube — light
        o.data.resolution_u = 6          # fewer segments along the path
        o.data.use_fill_caps = True

bpy.context.view_layer.update()
depsgraph = bpy.context.evaluated_depsgraph_get()

# 2) convert each curve -> solid mesh tube (persisted), keep world transform
counters = {}
made = []
for name, (token, color, _r) in VESSEL_MAP.items():
    o = bpy.data.objects.get(name)
    if not o or o.type != "CURVE":
        continue
    ev = o.evaluated_get(depsgraph)
    me = bpy.data.meshes.new_from_object(ev)
    counters[token] = counters.get(token, 0) + 1
    newname = token if counters[token] == 1 else "%s_%d" % (token, counters[token])
    me.name = newname
    new = bpy.data.objects.new(newname, me)
    new.matrix_world = o.matrix_world.copy()
    me.materials.clear()
    me.materials.append(get_mat(color))
    vcol.objects.link(new)
    made.append((newname, len(me.polygons)))
    bpy.data.objects.remove(o, do_unlink=True)  # drop the original curve

# 3) robust full-scene export (strip non-mesh, un-exclude, un-parent, then export)
for obj in list(bpy.context.scene.objects):
    if obj.type in {"FONT", "CURVE", "EMPTY", "CAMERA", "LIGHT", "SURFACE", "META"} or obj.name == "Cube":
        try:
            bpy.data.objects.remove(obj, do_unlink=True)
        except Exception:  # noqa
            pass


def walk(lc):
    lc.exclude = False
    for ch in lc.children:
        walk(ch)


walk(bpy.context.view_layer.layer_collection)
for obj in bpy.context.scene.objects:
    obj.hide_viewport = False
    obj.hide_render = False
    try:
        obj.hide_set(False)
    except Exception:  # noqa
        pass
    if obj.parent is not None:
        mw = obj.matrix_world.copy()
        obj.parent = None
        obj.matrix_world = mw
bpy.context.view_layer.update()

bpy.ops.export_scene.gltf(
    filepath=OUT, export_format="GLB", use_selection=False,
    export_yup=True, export_apply=True, export_cameras=False,
    export_lights=False, export_materials="EXPORT",
)

mesh_objs = [o.name for o in bpy.context.scene.objects if o.type == "MESH"]
result = {
    "vessels_made": made,
    "vessel_polys": sum(p for _, p in made),
    "scene_mesh_count": len(mesh_objs),
    "scene_meshes": sorted(mesh_objs),
    "file_bytes": os.path.getsize(OUT) if os.path.exists(OUT) else None,
}
print("v11 build+export done")
