import bpy, bmesh, re
from mathutils import Matrix
from collections import defaultdict

# Cardiovascular system: heart (22 chamber/valve meshes) + the whole-body vascular
# tree (654 CURVES → tubes via the heart recipe: normalise per-point radii, bevel,
# single batch convert). Merge → heart (red) + arteries (red) + veins (blue).
PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"
OUT = "/tmp/anat-compress/cardio-v1.glb"
TARGET = "5: Cardiovascular system"

ARTERY=(0.74,0.12,0.12); VEIN=(0.16,0.30,0.60); HEART=(0.62,0.16,0.16)
BIG=("aorta","vena cava","pulmonary trunk","pulmonary artery","pulmonary vein","common carotid",
     "internal carotid","external carotid","subclavian","brachiocephalic","common iliac",
     "external iliac","internal iliac","femoral","jugular","portal vein","renal","superior mesenteric")
def helper(n): return bool(re.search(r"\.(i|j|t|s|g)(\.\d+)?$", n.lower()))
def is_vein(nl): return any(k in nl for k in ["vein","vena","venous","sinus","plexus"])

for o in list(bpy.data.objects): bpy.data.objects.remove(o, do_unlink=True)
for c in list(bpy.data.collections):
    try: bpy.data.collections.remove(c)
    except Exception: pass
for m in list(bpy.data.meshes): bpy.data.meshes.remove(m)
for cu in list(bpy.data.curves):
    try: bpy.data.curves.remove(cu)
    except Exception: pass
for mt in list(bpy.data.materials):
    try: bpy.data.materials.remove(mt)
    except Exception: pass
with bpy.data.libraries.load(PATH, link=False) as (src,dst):
    allnames=list(src.collections); dst.collections=[TARGET] if TARGET in allnames else []
root=bpy.data.collections.get(TARGET)
if root and root.name not in bpy.context.scene.collection.children:
    bpy.context.scene.collection.children.link(root)
def unex(lc):
    lc.exclude=False
    for ch in lc.children: unex(ch)
unex(bpy.context.view_layer.layer_collection)
bpy.context.view_layer.update()

heart_meshes=[]; vessels=[]
for o in list(root.all_objects):
    if helper(o.name): continue
    if o.type=="MESH" and o.data: heart_meshes.append(o)
    elif o.type=="CURVE": vessels.append(o)

# ---- prep vessel curves: normalise radii + bevel (thicker for great vessels) ----
for o in vessels:
    cu=o.data; nl=o.name.lower()
    for sp in cu.splines:
        pts = sp.bezier_points if sp.type=='BEZIER' else sp.points
        for p in pts:
            try: p.radius=1.0
            except Exception: pass
    cu.bevel_depth = 0.006 if any(k in nl for k in BIG) else 0.0019
    cu.bevel_resolution = 2          # ~8-sided tubes (low-poly; 654 of them)
    cu.resolution_u = 2
    cu.use_fill_caps = True

# ---- single batch convert all curves → mesh ----
for o in bpy.context.scene.objects: o.select_set(False)
if vessels:
    bpy.context.view_layer.objects.active=vessels[0]
    for o in vessels: o.select_set(True)
    with bpy.context.temp_override(active_object=vessels[0], selected_objects=vessels,
                                   selected_editable_objects=vessels, object=vessels[0]):
        bpy.ops.object.convert(target='MESH')
    for o in bpy.context.scene.objects: o.select_set(False)

# ---- materials ----
def mat(name,rgb,rough=0.45):
    m=bpy.data.materials.new(name); m.use_nodes=True
    b=m.node_tree.nodes.get("Principled BSDF"); b.inputs["Base Color"].default_value=(*rgb,1); b.inputs["Roughness"].default_value=rough
    m.diffuse_color=(*rgb,1); return m
art_m=mat("Artery",ARTERY); vein_m=mat("Vein",VEIN); heart_m=mat("Heart",HEART)

# ---- bake world transforms + flip mirrored normals + assign material + token ----
keep={}  # obj -> token
all_objs = heart_meshes + [o for o in bpy.context.scene.objects if o.type=="MESH" and o not in heart_meshes]
wm={o:o.matrix_world.copy() for o in all_objs if o.type=="MESH" and o.data}
for o in list(wm.keys()):
    if o.data.users>1: o.data=o.data.copy()
    me=o.data; o.modifiers.clear(); o.parent=None
    me.transform(wm[o])
    if wm[o].determinant()<0:
        bm=bmesh.new(); bm.from_mesh(me); bmesh.ops.reverse_faces(bm,faces=bm.faces); bm.to_mesh(me); bm.free()
    o.matrix_world=Matrix.Identity(4)
    nl=o.name.lower()
    if o in heart_meshes:
        tok="heart"; m=heart_m
    elif is_vein(nl):
        tok="veins"; m=vein_m
    else:
        tok="arteries"; m=art_m
    o.data.materials.clear(); o.data.materials.append(m)
    for p in me.polygons: p.use_smooth=True
    keep[o]=tok

# ---- merge per token ----
groups=defaultdict(list)
for o,t in keep.items(): groups[t].append(o)
merged={}
for tok,objs in groups.items():
    objs=[o for o in objs if o.name in bpy.context.view_layer.objects]
    if not objs: continue
    for ob in bpy.context.scene.objects: ob.select_set(False)
    bpy.context.view_layer.objects.active=objs[0]
    for ob in objs: ob.select_set(True)
    if len(objs)>1: bpy.ops.object.join()
    m=bpy.context.view_layer.objects.active; m.name=tok; m.data.name=tok; merged[tok]=m; m.select_set(False)

# ---- decimate the vessel tree (heavy) lightly; keep heart ----
for tok,m in merged.items():
    if tok in ("arteries","veins"):
        mod=m.modifiers.new("d","DECIMATE"); mod.ratio=0.6
        bpy.context.view_layer.objects.active=m
        bpy.ops.object.modifier_apply(modifier=mod.name)

# strip FONT labels / empties / leftover non-mesh so they don't export as text geometry
for o in list(bpy.context.scene.objects):
    if o.type != "MESH":
        try: bpy.data.objects.remove(o, do_unlink=True)
        except Exception: pass
for o in bpy.data.objects:
    o.hide_set(False); o.hide_viewport=False; o.hide_render=False
bpy.ops.export_scene.gltf(filepath=OUT, export_format="GLB", use_selection=False,
    export_yup=True, export_apply=True, export_cameras=False, export_lights=False, export_materials="EXPORT")
import os
result={"out":OUT,"mb":round(os.path.getsize(OUT)/1e6,2),"tokens":sorted(merged.keys()),
        "polys":{t:len(m.data.polygons) for t,m in merged.items()},
        "n_vessels":len(vessels),"n_heart":len(heart_meshes)}
print("cardio build done")
