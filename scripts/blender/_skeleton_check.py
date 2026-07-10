import bpy

meshes = []
for o in bpy.data.objects:
    if o.type == "MESH" and o.data:
        meshes.append((o.name, len(o.data.polygons)))
meshes.sort()
result = {
    "mesh_objects": meshes,
    "count": len(meshes),
    "non_mesh": [(o.name, o.type) for o in bpy.data.objects if o.type != "MESH"],
}
print("check done")
