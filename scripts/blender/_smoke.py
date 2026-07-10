import bpy
import sys

# Prove the bridge works end-to-end: read Blender's version + scene contents.
result = {
    "blender_version": bpy.app.version_string,
    "python_version": sys.version.split()[0],
    "online_access": bool(bpy.app.online_access),
    "scene": bpy.context.scene.name,
    "objects": [o.name for o in bpy.data.objects],
    "gltf_exporter_available": hasattr(bpy.ops.export_scene, "gltf"),
}
print("Blender bridge OK")
