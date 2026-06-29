import bpy
import mathutils


def center(o):
    mn = [1e18] * 3
    mx = [-1e18] * 3
    for c in o.bound_box:
        w = o.matrix_world @ mathutils.Vector(c)
        for i in range(3):
            mn[i] = min(mn[i], w[i])
            mx[i] = max(mx[i], w[i])
    return mathutils.Vector([(mn[i] + mx[i]) / 2 for i in range(3)])


aorta = bpy.data.objects.get("aorta")
av = bpy.data.objects.get("aortic_valve")
arch = bpy.data.objects.get("aorta_2")
out = {}
if aorta and av and arch:
    target = (center(av) + center(arch)) / 2  # ascending aorta bridges valve -> arch
    aorta.location = aorta.location + (target - center(aorta))
    out = {"new_center": [round(c, 3) for c in center(aorta)],
           "target": [round(c, 3) for c in target]}
else:
    out = {"error": "missing object", "aorta": bool(aorta), "av": bool(av), "arch": bool(arch)}

result = out
print("fix aorta done")
