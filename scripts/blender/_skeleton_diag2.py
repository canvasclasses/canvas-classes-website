import bpy

# Inspect the skull object's true state in the CURRENT scene (run after A+B).
o = bpy.data.objects.get("skull")
res = {}
if o:
    deps = bpy.context.evaluated_depsgraph_get()
    ev = o.evaluated_get(deps)
    res = {
        "data_polygons": len(o.data.polygons),
        "data_users": o.data.users,
        "modifiers": [(m.name, m.type) for m in o.modifiers],
        "evaluated_polygons": len(ev.data.polygons),
        # face-side histogram of the base data
        "ngon_faces": sum(1 for p in o.data.polygons if len(p.vertices) > 4),
        "quad_faces": sum(1 for p in o.data.polygons if len(p.vertices) == 4),
        "tri_faces": sum(1 for p in o.data.polygons if len(p.vertices) == 3),
        "max_face_verts": max((len(p.vertices) for p in o.data.polygons), default=0),
    }
else:
    res = {"error": "no skull object"}
result = res
print("diag2 done")
