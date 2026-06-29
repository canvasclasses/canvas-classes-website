import bpy

names = [
    "right_atrium", "right_ventricle", "left_atrium", "left_ventricle",
    "papillary", "papillary_2", "papillary_3", "papillary_4",
    "tricuspid", "tricuspid_2", "mitral",
    "aortic_valve", "aortic_valve_2", "aortic_valve_3",
    "pulmonary_valve", "pulmonary_valve_2", "pulmonary_valve_3",
    "pulmonary_trunk",
]

depsgraph = bpy.context.evaluated_depsgraph_get()
rows = {}
for n in names:
    o = bpy.data.objects.get(n)
    if not o:
        rows[n] = "MISSING OBJECT"
        continue
    raw = len(o.data.polygons) if o.data else 0
    try:
        ev = o.evaluated_get(depsgraph)
        evpoly = len(ev.data.polygons) if ev and ev.data else 0
    except Exception as e:  # noqa
        evpoly = "err:%s" % e
    rows[n] = {
        "type": o.type,
        "raw_polys": raw,
        "eval_polys": evpoly,
        "modifiers": [m.type for m in o.modifiers],
        "parent": o.parent.name if o.parent else None,
        "instance_type": o.instance_type,
        "visible": o.visible_get(),
        "in_viewlayer": o.name in bpy.context.view_layer.objects,
    }
result = rows
print("diag2 done")
