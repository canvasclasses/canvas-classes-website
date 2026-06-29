import bpy
import os
import mathutils

OUT = "/tmp/heart.glb"

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

# Bake transforms to identity (uniform axis conversion) + smooth-shade everything.
seen = set()
for o in bpy.context.scene.objects:
    if o.type != "MESH" or not o.data:
        continue
    me = o.data
    if me.name not in seen:
        seen.add(me.name)
        me.transform(o.matrix_world)
        o.matrix_world = mathutils.Matrix.Identity(4)
    for poly in me.polygons:
        poly.use_smooth = True
bpy.context.view_layer.update()

bpy.ops.export_scene.gltf(
    filepath=OUT, export_format="GLB", use_selection=False,
    export_yup=True, export_apply=True, export_cameras=False,
    export_lights=False, export_materials="EXPORT",
)

total = sum(len(o.data.polygons) for o in bpy.context.scene.objects if o.type == "MESH")
result = {"mesh_count": len([o for o in bpy.context.scene.objects if o.type == "MESH"]),
          "total_polys": total,
          "file_bytes": os.path.getsize(OUT) if os.path.exists(OUT) else None}
print("export v6 done")
