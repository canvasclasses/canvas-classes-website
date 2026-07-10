import bpy
import mathutils


def wbox(o):
    mn = [1e18] * 3
    mx = [-1e18] * 3
    for c in o.bound_box:
        w = o.matrix_world @ mathutils.Vector(c)
        for i in range(3):
            mn[i] = min(mn[i], w[i])
            mx[i] = max(mx[i], w[i])
    return mn, mx


dg = bpy.context.evaluated_depsgraph_get()
rows = []
for o in bpy.context.scene.objects:
    if o.type != "MESH":
        continue
    mn, mx = wbox(o)
    center = [round((mn[i] + mx[i]) / 2, 3) for i in range(3)]
    size = round(max(mx[i] - mn[i] for i in range(3)), 4)
    base = len(o.data.polygons) if o.data else 0
    try:
        ev = o.evaluated_get(dg)
        evp = len(ev.data.polygons)
    except Exception:  # noqa
        evp = "?"
    rows.append({"name": o.name, "center": center, "size": size, "base_polys": base, "eval_polys": evp,
                 "mods": [m.type for m in o.modifiers]})

rows.sort(key=lambda r: -r["size"])
result = {"mesh_count": len(rows), "objects": rows}
print("layout diag done")
