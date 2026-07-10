import bpy

OUT = "/tmp/heart.glb"

# ── Canonical mapping: Z-Anatomy name (lowercased substring) → (token, layer, color)
# Colors teach oxygenation: right heart BLUE (deoxygenated), left heart RED
# (oxygenated), valves cream, muscle pink. Tokens match the viewer's HEART_STRUCTURES.
BLUE = (0.23, 0.45, 0.86, 1.0)   # deoxygenated
RED = (0.86, 0.24, 0.27, 1.0)    # oxygenated
CREAM = (0.90, 0.88, 0.80, 1.0)  # valves
PINK = (0.94, 0.45, 0.66, 1.0)   # papillary muscle
GREY = (0.60, 0.62, 0.66, 1.0)


def canon(nl):
    if "papillary" in nl:
        return ("papillary", "myocardium", PINK)
    if "right atrium" in nl:
        return ("right_atrium", "chambers", BLUE)
    if "left atrium" in nl:
        return ("left_atrium", "chambers", RED)
    if "right ventricle" in nl:
        return ("right_ventricle", "chambers", BLUE)
    if "left ventricle" in nl:
        return ("left_ventricle", "chambers", RED)
    if "right atrioventricular valve" in nl or "tricuspid" in nl:
        return ("tricuspid", "valves", CREAM)
    if "left atrioventricular valve" in nl or "mitral" in nl or "bicuspid" in nl:
        return ("mitral", "valves", CREAM)
    if "pulmonary valve" in nl or ("semilunar" in nl and "pulmonary" in nl):
        return ("pulmonary_valve", "valves", CREAM)
    if "coronary leaflet" in nl:  # right/left/non-coronary leaflet = aortic cusps
        return ("aortic_valve", "valves", CREAM)
    if "pulmonary trunk" in nl:
        return ("pulmonary_trunk", "vessels", BLUE)
    return (None, "other", GREY)


# Collect target meshes: everything in the Heart collection + the Pulmonary trunk.
targets = []
heart = bpy.data.collections.get("Heart")
if heart:
    targets += [o for o in heart.all_objects if o.type == "MESH" and o.data]
pt = bpy.data.objects.get("Pulmonary trunk")
if pt and pt.type == "MESH" and pt not in targets:
    targets.append(pt)

mat_cache = {}


def get_mat(color):
    key = tuple(round(c, 3) for c in color)
    m = mat_cache.get(key)
    if m:
        return m
    m = bpy.data.materials.new(name="heart_%s" % "_".join(str(int(c * 255)) for c in color[:3]))
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = color
        if "Roughness" in bsdf.inputs:
            bsdf.inputs["Roughness"].default_value = 0.55
        if "Metallic" in bsdf.inputs:
            bsdf.inputs["Metallic"].default_value = 0.0
    mat_cache[key] = m
    return m


counters, exported = {}, []
for o in targets:
    token, layer, color = canon(o.name.lower())
    base = token or "structure"
    counters[base] = counters.get(base, 0) + 1
    newname = base if counters[base] == 1 else "%s_%d" % (base, counters[base])
    o.name = newname
    if o.data:
        o.data.name = newname
    o.data.materials.clear()
    o.data.materials.append(get_mat(color))
    exported.append((newname, layer, len(o.data.polygons)))

# Select ONLY the heart meshes, then export selection to GLB.
bpy.ops.object.select_all(action="DESELECT")
for o in targets:
    o.select_set(True)
bpy.context.view_layer.objects.active = targets[0] if targets else None

bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    use_selection=True,
    export_yup=True,
    export_apply=True,
    export_cameras=False,
    export_lights=False,
    export_materials="EXPORT",
)

import os
result = {
    "exported_file": OUT,
    "file_bytes": os.path.getsize(OUT) if os.path.exists(OUT) else None,
    "mesh_count": len(exported),
    "total_polys": sum(p for _, _, p in exported),
    "meshes": sorted(exported),
}
print("heart export done")
