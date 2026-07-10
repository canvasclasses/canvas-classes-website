import bpy
import os

OUT = "/tmp/heart.glb"

# Selection-based export is unreliable over the socket (no UI context), so instead
# strip the scene down to ONLY the heart meshes, then export the whole scene.
DROP_TYPES = {"FONT", "CURVE", "EMPTY", "CAMERA", "LIGHT", "SURFACE", "META"}
DROP_NAMES = {"Cube"}

for obj in list(bpy.context.scene.objects):
    if obj.type in DROP_TYPES or obj.name in DROP_NAMES:
        try:
            bpy.data.objects.remove(obj, do_unlink=True)
        except Exception:  # noqa
            pass

remaining = [o.name for o in bpy.context.scene.objects]
mesh_remaining = [o.name for o in bpy.context.scene.objects if o.type == "MESH"]

bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    use_selection=False,          # export the whole (now heart-only) scene
    export_yup=True,
    export_apply=True,
    export_cameras=False,
    export_lights=False,
    export_materials="EXPORT",
)

result = {
    "scene_objects_after_prune": remaining,
    "mesh_count": len(mesh_remaining),
    "file_bytes": os.path.getsize(OUT) if os.path.exists(OUT) else None,
}
print("export-fix done")
