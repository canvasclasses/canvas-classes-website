import bpy, bmesh, re, json
from mathutils import Matrix
from collections import defaultdict

# Production muscular-system build: append → classify via the structure map →
# drop fascia/noise → bake .g-parent world transforms → flip mirrored normals →
# clear subsurf → red material → merge per token → decimate (smooth sheets hard,
# quality-first elsewhere) → export glb. (meshopt compression is a separate step.)
PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"
MAP = "/Users/CanvasClasses/Desktop/canvas/packages/data/simulations/muscular-structure-map.json"
OUT = "/tmp/anat-compress/muscular-v1.glb"
TARGET = "4: Muscular system"

# heavy-decimate smooth sheets (invisible to shave); quality-first elsewhere
HEAVY = {"intercostals","tensor_fasciae_latae","external_oblique","internal_oblique",
         "transversus_abdominis","serratus_anterior","erector_spinae","frontalis",
         "latissimus_dorsi","pharyngeal_constrictors","transversospinalis","trapezius"}
HEAVY_RATIO=0.22; LIGHT_RATIO=0.55

with open(MAP) as f: cfg=json.load(f)
drop_pats=[d.lower() for d in cfg["drop"]]
tokens=cfg["tokens"]

def classify(name):
    nl=name.lower()
    if re.search(r"\.(i|j|t|s|g)(\.\d+)?$", nl): return None
    for d in drop_pats:
        if d in nl: return None
    best,blen=None,-1
    for t in tokens:
        for m in t["match"]:
            ml=m.lower()
            if ml in nl and len(ml)>blen: best,blen=t["id"],len(ml)
    return best

# ---------- reset + append ----------
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

# ---------- partition ----------
keep={}; unmapped=[]; drop=[]
for o in list(root.all_objects):
    if o.type!="MESH" or not o.data:
        drop.append(o); continue
    tok=classify(o.name)
    if tok is None:
        if len(o.data.polygons)>0 and not re.search(r"\.(i|j|t|s|g)(\.\d+)?$", o.name.lower()):
            unmapped.append((o.name,len(o.data.polygons)))
        drop.append(o)
    else:
        keep[o]=tok

# ---------- capture world matrices BEFORE deleting parents (.g gotcha) ----------
world_mats={o:o.matrix_world.copy() for o in keep}
for o in drop:
    try: bpy.data.objects.remove(o, do_unlink=True)
    except Exception: pass

# ---------- material (red muscle) ----------
mus=bpy.data.materials.new("Muscle"); mus.use_nodes=True
b=mus.node_tree.nodes.get("Principled BSDF")
RED=(0.52,0.11,0.11,1.0)
b.inputs["Base Color"].default_value=RED
if "Roughness" in b.inputs: b.inputs["Roughness"].default_value=0.42
mus.diffuse_color=RED

# ---------- single-user + bake world transform + flip mirrored normals + smooth ----------
for o in list(keep.keys()):
    if o.data.users>1: o.data=o.data.copy()
    me=o.data
    o.modifiers.clear()
    o.parent=None
    me.transform(world_mats[o])
    if world_mats[o].determinant()<0:
        bm=bmesh.new(); bm.from_mesh(me); bmesh.ops.reverse_faces(bm,faces=bm.faces); bm.to_mesh(me); bm.free()
    o.matrix_world=Matrix.Identity(4)
    o.data.materials.clear(); o.data.materials.append(mus)
    for p in me.polygons: p.use_smooth=True

# ---------- merge per token (one object per token → ~81 draw calls) ----------
groups=defaultdict(list)
for o,t in keep.items(): groups[t].append(o)
merged={}
for tok,objs in groups.items():
    for ob in objs: ob.select_set(False)
    bpy.context.view_layer.objects.active=objs[0]
    for ob in objs: ob.select_set(True)
    if len(objs)>1:
        bpy.ops.object.join()
    m=bpy.context.view_layer.objects.active
    m.name=tok; m.data.name=tok
    merged[tok]=m
    m.select_set(False)

# ---------- decimate per token ----------
for tok,m in merged.items():
    ratio = HEAVY_RATIO if tok in HEAVY else LIGHT_RATIO
    mod=m.modifiers.new("dec","DECIMATE"); mod.ratio=ratio
    bpy.context.view_layer.objects.active=m
    bpy.ops.object.modifier_apply(modifier=mod.name)

# ---------- export ----------
def unexclude(lc):
    lc.exclude=False
    for ch in lc.children: unexclude(ch)
unexclude(bpy.context.view_layer.layer_collection)
for o in bpy.data.objects:
    o.hide_set(False); o.hide_viewport=False; o.hide_render=False
bpy.ops.export_scene.gltf(filepath=OUT, export_format="GLB", use_selection=False,
    export_yup=True, export_apply=True, export_cameras=False, export_lights=False, export_materials="EXPORT")

import os
result={"out":OUT,"mb":round(os.path.getsize(OUT)/1e6,2),
    "tokens_merged":len(merged),
    "total_polys":sum(len(m.data.polygons) for m in merged.values()),
    "unmapped":sorted(unmapped,key=lambda x:-x[1])[:10]}
print("muscular build done")
