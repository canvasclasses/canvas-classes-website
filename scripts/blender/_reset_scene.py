import bpy

for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
for c in list(bpy.data.collections):
    try:
        bpy.data.collections.remove(c)
    except Exception:  # noqa
        pass
for m in list(bpy.data.meshes):
    bpy.data.meshes.remove(m)
for cu in list(bpy.data.curves):
    try:
        bpy.data.curves.remove(cu)
    except Exception:  # noqa
        pass
for mt in list(bpy.data.materials):
    try:
        bpy.data.materials.remove(mt)
    except Exception:  # noqa
        pass

result = {
    "objects_left": len(bpy.data.objects),
    "collections_left": len(bpy.data.collections),
}
print("reset done")
