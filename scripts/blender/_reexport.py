import bpy
import os

OUT = "/tmp/heart.glb"

# Z-Anatomy ships many collections EXCLUDED from the view layer (outliner checkbox
# off). use_selection=False only exports view-layer objects, so excluded ones
# (the valvular complex, great vessels) were silently skipped. Un-exclude + unhide
# everything, then re-export.
vl = bpy.context.view_layer


def walk(lc):
    lc.exclude = False
    try:
        lc.hide_viewport = False
    except Exception:  # noqa
        pass
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

mesh_objs = [o.name for o in bpy.context.scene.objects if o.type == "MESH"]
result = {
    "file_bytes": os.path.getsize(OUT) if os.path.exists(OUT) else None,
    "scene_mesh_count": len(mesh_objs),
    "scene_meshes": sorted(mesh_objs),
}
print("re-export done")
