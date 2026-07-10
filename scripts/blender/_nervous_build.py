import bpy, bmesh, re
from mathutils import Matrix
from collections import defaultdict

# Build the central nervous system asset: brain (cerebrum/cerebellum/brainstem/
# diencephalon) + spinal cord + meninges + ventricles. 339 granular meshes merged
# into ~7 major regions; 249 nerve CURVES dropped for v1 (add via tube recipe later).
PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"
OUT = "/tmp/anat-compress/nervous-v1.glb"
TARGET = "7: Nervous system & Sense organs"
DECIMATE = 0.45

CEREBRUM=(0.80,0.68,0.66); CEREBELLUM=(0.78,0.60,0.46); BRAINSTEM=(0.82,0.74,0.55)
DIENCEPH=(0.72,0.56,0.62); SPINAL=(0.86,0.82,0.70); VENTRICLE=(0.60,0.70,0.82); MENINGES=(0.74,0.74,0.78)
# exclude sense organs we already built (eye/ear) + skip pineal (in viscera/endocrine)
SKIP=("sclera","iris","cornea","lens","eyeball","retina","choroid of eye","auricle","helix",
      "antihelix","tragus","cochlea","vestibul","tympan","ossicle","malleus","incus","stapes",
      "labyrinth","pineal","eyelid","conjunctiva","lacrimal")

def classify(name):
    nl=name.lower()
    if any(k in nl for k in SKIP): return None
    if any(k in nl for k in ["cerebell","vermis","lobule","culmen","declive","folium",
            "nodulus","flocculus","dentate nucleus","arbor vitae","biventral","semilunar",
            "gracile","quadrangular","tonsil of cerebellum","pyramid of vermis","uvula of cerebellum"]):
        return ("cerebellum",CEREBELLUM)
    if any(k in nl for k in ["pons","medulla oblongata","mesencephalon","midbrain","cerebral peduncle",
            "tegmentum","colliculus","substantia nigra","red nucleus","olive","tectum","reticular"]):
        return ("brainstem",BRAINSTEM)
    if any(k in nl for k in ["thalamus","hypothalam","epithalam","subthalam","geniculate",
            "mammillary","metathalam"]):
        return ("diencephalon",DIENCEPH)
    if "spinal" in nl or "medulla spinalis" in nl or "filum terminale" in nl or "cauda equina" in nl:
        return ("spinal_cord",SPINAL)
    if "ventricle" in nl or "choroid plexus" in nl or "septum pellucidum" in nl:
        return ("ventricles",VENTRICLE)
    if any(k in nl for k in ["dura","arachnoid","pia mater","falx","tentorium","meninge"]):
        return ("meninges",MENINGES)
    # cerebrum catch-all (telencephalon, cortex, gyri, white matter, basal nuclei, limbic…)
    return ("cerebrum",CEREBRUM)

def helper(n): return bool(re.search(r"\.(i|j|t|s|g)(\.\d+)?$", n.lower()))

for o in list(bpy.data.objects): bpy.data.objects.remove(o, do_unlink=True)
for c in list(bpy.data.collections):
    try: bpy.data.collections.remove(c)
    except Exception: pass
for m in list(bpy.data.meshes): bpy.data.meshes.remove(m)
for mt in list(bpy.data.materials):
    try: bpy.data.materials.remove(mt)
    except Exception: pass
with bpy.data.libraries.load(PATH, link=False) as (src,dst):
    allnames=list(src.collections)
    dst.collections=[TARGET] if TARGET in allnames else []
root=bpy.data.collections.get(TARGET)
if root and root.name not in bpy.context.scene.collection.children:
    bpy.context.scene.collection.children.link(root)
bpy.context.view_layer.update()

matcache={}
def getmat(rgb):
    key=tuple(round(c,3) for c in rgb)
    if key in matcache: return matcache[key]
    m=bpy.data.materials.new("n_%d"%len(matcache)); m.use_nodes=True
    b=m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value=(*rgb,1); b.inputs["Roughness"].default_value=0.5
    m.diffuse_color=(*rgb,1); matcache[key]=m; return m

keep={}; dropped_sense=0
for o in list(root.all_objects):
    if o.type!="MESH" or not o.data or helper(o.name): continue
    c=classify(o.name)
    if c is None: dropped_sense+=1; continue
    keep[o]=c
wm={o:o.matrix_world.copy() for o in keep}
for o in list(bpy.context.scene.objects):
    if o.type=="MESH" and o in keep: continue
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

for tok,m in merged.items():
    mod=m.modifiers.new("dec","DECIMATE"); mod.ratio=DECIMATE
    bpy.context.view_layer.objects.active=m
    bpy.ops.object.modifier_apply(modifier=mod.name)

for o in bpy.data.objects:
    o.hide_set(False); o.hide_viewport=False; o.hide_render=False
bpy.ops.export_scene.gltf(filepath=OUT, export_format="GLB", use_selection=False,
    export_yup=True, export_apply=True, export_cameras=False, export_lights=False, export_materials="EXPORT")
import os
result={"out":OUT,"mb":round(os.path.getsize(OUT)/1e6,3),"tokens":sorted(merged.keys()),
        "polys_per_token":{t:len(m.data.polygons) for t,m in merged.items()},"dropped_sense":dropped_sense}
print("nervous build done")
