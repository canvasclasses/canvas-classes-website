import bpy
import os

OUT = "/tmp/heart.glb"

# Drop the unreliable Z-Anatomy vessels; keep the clean heart-proper (chambers,
# valves, papillary muscles).
VESSEL_TOKENS = ["aorta", "vena_cava", "pulmonary_artery", "pulmonary_vein",
                 "coronary", "pulmonary_trunk"]
for o in list(bpy.context.scene.objects):
    nl = o.name.lower()
    if any(t in nl for t in VESSEL_TOKENS):
        try:
            bpy.data.objects.remove(o, do_unlink=True)
        except Exception:  # noqa
            pass

# Robust full-scene export of what remains (the heart-proper).
for o in list(bpy.context.scene.objects):
    if o.type in {"FONT", "CURVE", "EMPTY", "CAMERA", "LIGHT", "SURFACE", "META"} or o.name == "Cube":
        try:
            bpy.data.objects.remove(o, do_unlink=True)
        except Exception:  # noqa
            pass


def walk(lc):
    lc.exclude = False
    for ch in lc.children:
        walk(ch)


walk(bpy.context.view_layer.layer_collection)
for o in bpy.context.scene.objects:
    o.hide_viewport = False
    o.hide_render = False
    try:
        o.hide_set(False)
    except Exception:  # noqa
        pass
    if o.parent is not None:
        mw = o.matrix_world.copy()
        o.parent = None
        o.matrix_world = mw
bpy.context.view_layer.update()

bpy.ops.export_scene.gltf(
    filepath=OUT, export_format="GLB", use_selection=False,
    export_yup=True, export_apply=True, export_cameras=False,
    export_lights=False, export_materials="EXPORT",
)

meshes = sorted(o.name for o in bpy.context.scene.objects if o.type == "MESH")
result = {"mesh_count": len(meshes), "meshes": meshes,
          "file_bytes": os.path.getsize(OUT) if os.path.exists(OUT) else None}
print("export v3 done")
