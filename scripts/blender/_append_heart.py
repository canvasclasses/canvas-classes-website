import bpy

PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"
TARGET = "Heart"  # top-level cardiovascular collection in the atlas

# Append the Heart collection (objects + nested child collections come with it).
with bpy.data.libraries.load(PATH, link=False) as (src, dst):
    if TARGET in src.collections:
        dst.collections = [TARGET]
    else:
        dst.collections = []

heart = bpy.data.collections.get(TARGET)
linked = False
if heart and heart.name not in bpy.context.scene.collection.children:
    try:
        bpy.context.scene.collection.children.link(heart)
        linked = True
    except Exception as e:  # noqa
        linked = str(e)

# Walk everything under the Heart collection.
meshes, others = [], []
total_tris = 0
if heart:
    for o in heart.all_objects:
        if o.type == "MESH" and o.data:
            npoly = len(o.data.polygons)
            total_tris += npoly
            meshes.append((o.name, npoly))
        else:
            others.append((o.name, o.type))

meshes.sort(key=lambda x: -x[1])

result = {
    "linked": linked,
    "child_collections": [c.name for c in heart.children] if heart else None,
    "mesh_count": len(meshes),
    "non_mesh_count": len(others),
    "total_polys": total_tris,
    "heaviest_meshes": meshes[:40],
    "non_mesh_types": sorted({t for _, t in others}),
    "non_mesh_sample": others[:20],
}
print("append+inspect done")
