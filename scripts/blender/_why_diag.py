import bpy
import bmesh


def analyze(o):
    if not o or o.type != "MESH" or not o.data:
        return "missing"
    me = o.data
    bm = bmesh.new()
    bm.from_mesh(me)
    boundary = sum(1 for e in bm.edges if len(e.link_faces) == 1)
    bm.free()
    smooth = sum(1 for p in me.polygons if p.use_smooth)
    return {
        "polys": len(me.polygons),
        "verts": len(me.vertices),
        "boundary_edges": boundary,           # >0 → open shell (a wall fragment), 0 → closed solid
        "smooth_polys": smooth,
        "smooth_frac": round(smooth / max(1, len(me.polygons)), 2),  # 0 → flat/faceted shading
        "dims": [round(d, 4) for d in o.dimensions],
    }


chambers = {
    n: analyze(bpy.data.objects.get(n))
    for n in ["right_atrium", "left_ventricle", "left_atrium", "right_ventricle", "tricuspid", "mitral"]
}

# Is there a proper OUTER heart-surface mesh (epicardium / myocardial wall) in the
# source that we failed to include? Search the file's object directory.
PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"
KEYS = ["epicard", "myocard", "surface of heart", "external surface",
        "wall of", "auricle", "fibrous skeleton"]
with bpy.data.libraries.load(PATH, link=False) as (src, dst):
    names = [n for n in src.objects if any(k in n.lower() for k in KEYS)]
    dst.objects = [n for n in names if n not in bpy.data.objects]

surf = {}
for n in names:
    o = bpy.data.objects.get(n)
    if o:
        surf[n] = {"type": o.type, "polys": (len(o.data.polygons) if o.type == "MESH" and o.data else 0)}

result = {"chambers": chambers, "outer_surface_candidates": surf}
print("why diag done")
