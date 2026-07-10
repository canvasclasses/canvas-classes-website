import bpy

vl = bpy.context.view_layer
scene_objs = {o.name for o in bpy.context.scene.objects if o.type == "MESH"}
vl_objs = {o.name for o in vl.objects if o.type == "MESH"}

# Which target meshes are NOT in the view layer (hence not exported)?
missing = sorted(scene_objs - vl_objs)

# For a couple of missing ones, report why.
detail = {}
for name in missing[:6]:
    o = bpy.data.objects.get(name)
    if not o:
        continue
    detail[name] = {
        "hide_viewport": o.hide_viewport,
        "hide_render": o.hide_render,
        "visible_get": o.visible_get(),
        "collections": [c.name for c in o.users_collection],
    }


# Walk layer_collection tree and report any still-excluded collections.
excluded = []


def walk(lc, path=""):
    p = path + "/" + lc.collection.name
    if lc.exclude:
        excluded.append(p)
    for ch in lc.children:
        walk(ch, p)


walk(vl.layer_collection)

result = {
    "scene_mesh_count": len(scene_objs),
    "viewlayer_mesh_count": len(vl_objs),
    "missing_from_viewlayer": missing,
    "missing_detail": detail,
    "still_excluded_collections": excluded,
}
print("diag done")
