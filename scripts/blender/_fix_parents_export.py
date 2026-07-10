import bpy
import os

OUT = "/tmp/heart.glb"

NAMES = [
    "right_atrium", "right_ventricle", "left_atrium", "left_ventricle",
    "papillary", "papillary_2", "papillary_3", "papillary_4",
    "tricuspid", "tricuspid_2", "mitral",
    "aortic_valve", "aortic_valve_2", "aortic_valve_3",
    "pulmonary_valve", "pulmonary_valve_2", "pulmonary_valve_3",
    "pulmonary_trunk",
]

# Un-parent each mesh from its (often deleted/FONT) parent while KEEPING its world
# transform, so every target becomes a root node the glTF exporter will include.
for n in NAMES:
    o = bpy.data.objects.get(n)
    if o and o.parent is not None:
        mw = o.matrix_world.copy()
        o.parent = None
        o.matrix_world = mw

# Make sure nothing is excluded/hidden, then push a view-layer update so the
# exporter sees the new state in this same run.
vl = bpy.context.view_layer


def walk(lc):
    lc.exclude = False
    for ch in lc.children:
        walk(ch)


walk(vl.layer_collection)
for o in bpy.context.scene.objects:
    o.hide_viewport = False
    o.hide_render = False
    try:
        o.hide_set(False)
    except Exception:  # noqa
        pass
vl.update()

bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    use_selection=False,
    export_yup=True,
    export_apply=True,
    export_cameras=False,
    export_lights=False,
    export_materials="EXPORT",
)

result = {
    "file_bytes": os.path.getsize(OUT) if os.path.exists(OUT) else None,
    "parents_now": {n: (bpy.data.objects[n].parent.name if bpy.data.objects.get(n) and bpy.data.objects[n].parent else None) for n in NAMES},
}
print("fix-parents export done")
