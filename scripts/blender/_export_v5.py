import bpy
import os
import mathutils

OUT = "/tmp/heart.glb"

# strip non-mesh / preview rig
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

# unhide + un-parent (keep world transform)
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

# BAKE each object's world transform into its mesh, reset node to identity so the
# glTF axis conversion (Z-up -> Y-up) is applied UNIFORMLY to all geometry.
seen = set()
for o in bpy.context.scene.objects:
    if o.type != "MESH" or not o.data:
        continue
    me = o.data
    if me.name in seen:
        continue
    seen.add(me.name)
    me.transform(o.matrix_world)
    o.matrix_world = mathutils.Matrix.Identity(4)
bpy.context.view_layer.update()

bpy.ops.export_scene.gltf(
    filepath=OUT, export_format="GLB", use_selection=False,
    export_yup=True, export_apply=True, export_cameras=False,
    export_lights=False, export_materials="EXPORT",
)

meshes = sorted(o.name for o in bpy.context.scene.objects if o.type == "MESH")
result = {"mesh_count": len(meshes), "file_bytes": os.path.getsize(OUT) if os.path.exists(OUT) else None}
print("export v5 done")
