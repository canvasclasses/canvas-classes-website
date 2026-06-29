import bpy, bmesh, re
from mathutils import Matrix
from collections import defaultdict

# Build the visceral/organ-systems asset (respiratory + digestive + urinary +
# endocrine + reproductive). 75 clean organ meshes, ~66K polys → no decimation
# (quality-first, tiny). Same pipeline: bake .g → flip normals → per-system colour
# → merge per organ token → export. Curves (44 small internal ducts) dropped for v1.
PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"
OUT = "/tmp/anat-compress/viscera-v1.glb"
TARGET = "8: Visceral systems"

# per-system colours
LIVER=(0.50,0.26,0.22); RESP=(0.86,0.56,0.56); URIN=(0.68,0.34,0.34)
ENDO=(0.86,0.72,0.38); REPRO=(0.74,0.60,0.66); DIG=(0.82,0.58,0.48); GLAND=(0.86,0.66,0.62)

def classify(name):
    nl=name.lower()
    if "liver" in nl: return ("liver",LIVER)
    if "lung" in nl: return (("left_lung" if "left" in nl else "right_lung"),RESP)
    if "pleura" in nl: return ("pleura",RESP)
    if "trachea" in nl: return ("trachea",RESP)
    if "epiglottis" in nl: return ("epiglottis",RESP)
    if "pharynx" in nl: return ("pharynx",RESP)
    if "mucosa of nasal" in nl: return ("nasal_mucosa",RESP)
    if "kidney" in nl: return ("kidneys",URIN)
    if "renal pelvis" in nl: return ("renal_pelvis",URIN)
    if "urinary bladder" in nl: return ("urinary_bladder",URIN)
    if "suprarenal" in nl: return ("adrenal_glands",ENDO)
    if "thyroid" in nl: return ("thyroid_gland",ENDO)
    if "parathyroid" in nl: return ("parathyroid_glands",ENDO)
    if "pineal" in nl: return ("pineal_gland",ENDO)
    if "hypophysis" in nl: return ("pituitary_gland",ENDO)
    if "prostate" in nl: return ("prostate",REPRO)
    if "testis" in nl: return ("testes",REPRO)
    if "epididymis" in nl: return ("epididymis",REPRO)
    if "seminal" in nl: return ("seminal_glands",REPRO)
    if any(k in nl for k in ["penis","corpus cavernosum","corpus spongiosum","glans"]): return ("penis",REPRO)
    if "stomach" in nl: return ("stomach",DIG)
    if "duodenum" in nl: return ("duodenum",DIG)
    if "colon" in nl: return ("colon",DIG)
    if "appendix" in nl: return ("appendix",DIG)
    if "pancreas" in nl: return ("pancreas",DIG)
    if "gallbladder" in nl: return ("gallbladder",DIG)
    if "tongue" in nl: return ("tongue",DIG)
    if "gingiva" in nl: return ("gingiva",DIG)
    if any(k in nl for k in ["soft palate","uvula"]): return ("soft_palate",DIG)
    if any(k in nl for k in ["parotid","sublingual","submandibular"]): return ("salivary_glands",GLAND)
    if any(k in nl for k in ["omentum","mesocolon","taenia","meso-appendix","mesentery"]): return ("mesentery_omentum",DIG)
    return None

def helper(n): return bool(re.search(r"\.(i|j|t|s|g)(\.\d+)?$", n.lower()))

# reset + append
for o in list(bpy.data.objects): bpy.data.objects.remove(o, do_unlink=True)
for c in list(bpy.data.collections):
    try: bpy.data.collections.remove(c)
    except Exception: pass
for m in list(bpy.data.meshes): bpy.data.meshes.remove(m)
for mt in list(bpy.data.materials):
    try: bpy.data.materials.remove(mt)
    except Exception: pass
with bpy.data.libraries.load(PATH, link=False) as (src,dst):
    dst.collections=[TARGET] if TARGET in src.collections else []
root=bpy.data.collections.get(TARGET)
if root and root.name not in bpy.context.scene.collection.children:
    bpy.context.scene.collection.children.link(root)
bpy.context.view_layer.update()

# material cache by rgb
matcache={}
def getmat(rgb):
    key=tuple(round(c,3) for c in rgb)
    if key in matcache: return matcache[key]
    m=bpy.data.materials.new("organ_%d"%len(matcache)); m.use_nodes=True
    b=m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value=(*rgb,1); b.inputs["Roughness"].default_value=0.45
    m.diffuse_color=(*rgb,1); matcache[key]=m; return m

keep={}; unmapped=[]
for o in list(root.all_objects):
    if o.type!="MESH" or not o.data or helper(o.name): continue
    c=classify(o.name)
    if c is None:
        unmapped.append((o.name,len(o.data.polygons))); continue
    keep[o]=c

wm={o:o.matrix_world.copy() for o in keep}
# delete everything not kept (curves, helpers, unmapped)
for o in list(bpy.context.scene.objects):
    if o.type=="MESH" and o in keep: continue
    if o.type in ("MESH","CURVE","FONT","EMPTY"):
        try: bpy.data.objects.remove(o, do_unlink=True)
        except Exception: pass

for o in list(keep.keys()):
    tok,rgb=keep[o]
    if o.data.users>1: o.data=o.data.copy()
    me=o.data; o.modifiers.clear(); o.parent=None
    me.transform(wm[o])
    if wm[o].determinant()<0:
        bm=bmesh.new(); bm.from_mesh(me); bmesh.ops.reverse_faces(bm,faces=bm.faces); bm.to_mesh(me); bm.free()
    o.matrix_world=Matrix.Identity(4)
    o.data.materials.clear(); o.data.materials.append(getmat(rgb))
    for p in me.polygons: p.use_smooth=True

# merge per token
groups=defaultdict(list)
for o,(tok,rgb) in keep.items(): groups[tok].append(o)
merged={}
for tok,objs in groups.items():
    for ob in objs: ob.select_set(False)
    bpy.context.view_layer.objects.active=objs[0]
    for ob in objs: ob.select_set(True)
    if len(objs)>1: bpy.ops.object.join()
    m=bpy.context.view_layer.objects.active
    m.name=tok; m.data.name=tok; merged[tok]=m; m.select_set(False)

for o in bpy.data.objects:
    o.hide_set(False); o.hide_viewport=False; o.hide_render=False
bpy.ops.export_scene.gltf(filepath=OUT, export_format="GLB", use_selection=False,
    export_yup=True, export_apply=True, export_cameras=False, export_lights=False, export_materials="EXPORT")
import os
result={"out":OUT,"mb":round(os.path.getsize(OUT)/1e6,3),"organs":sorted(merged.keys()),
        "n_tokens":len(merged),"unmapped":unmapped}
print("viscera build done")
