import bpy, bmesh, re
from mathutils import Matrix
from collections import defaultdict

# Build a small shared "head features" asset: eyeballs (sclera + iris) + ears
# (auricle cartilage). Always shown with the head in any layer. Same proven recipe:
# append by object → bake .g-parent transforms → flip mirrored normals → materials
# → merge per token → export → (meshopt separate).
PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"
OUT = "/tmp/anat-compress/head-features-v1.glb"

EYE = ["sclera", "iris.l", "iris.r"]   # white sphere + coloured iris (cornea/lens skipped — internal)
EAR = ["helix", "antihelix", "antitragus", "tragus", "concha of auricle",
       "lobule of auricle", "apex of auricle", "anterior notch of auricle", "crura of antihelix"]

def helper(n): return bool(re.search(r"\.(i|j|t|s|g)(\.\d+)?$", n.lower()))
def is_eye(n): return any(k in n.lower() for k in EYE)
def is_ear(n): return any(k in n.lower() for k in EAR)
def side(n): return "left" if re.search(r"\.l(\.\d+)?$", n.lower()) else "right"
def classify(o):
    n=o.name
    if helper(n): return None
    if is_eye(n): return f"eyeball_{side(n)}"
    if is_ear(n): return f"ear_{side(n)}"
    return None
def eyepart(n):  # iris vs sclera (for material on the joined eyeball)
    return "iris" if "iris" in n.lower() else "sclera"

# reset + append objects
for o in list(bpy.data.objects): bpy.data.objects.remove(o, do_unlink=True)
for c in list(bpy.data.collections):
    try: bpy.data.collections.remove(c)
    except Exception: pass
for m in list(bpy.data.meshes): bpy.data.meshes.remove(m)
for mt in list(bpy.data.materials):
    try: bpy.data.materials.remove(mt)
    except Exception: pass
with bpy.data.libraries.load(PATH, link=False) as (src,dst):
    dst.objects=[n for n in src.objects if not helper(n) and (is_eye(n) or is_ear(n))]
loaded=[o for o in dst.objects if o is not None]
for o in loaded:
    try: bpy.context.scene.collection.objects.link(o)
    except Exception: pass
bpy.context.view_layer.update()

# materials
def mat(name,rgb,r):
    m=bpy.data.materials.new(name); m.use_nodes=True
    b=m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value=(*rgb,1); b.inputs["Roughness"].default_value=r
    m.diffuse_color=(*rgb,1); return m
sclera_m=mat("Sclera",(0.93,0.92,0.90),0.30)
iris_m  =mat("Iris",(0.28,0.18,0.10),0.40)
ear_m   =mat("EarCartilage",(0.88,0.78,0.76),0.45)

keep={}
for o in list(bpy.context.scene.objects):
    if o.type!="MESH" or not o.data: continue
    tok=classify(o)
    if tok is None:
        bpy.data.objects.remove(o, do_unlink=True); continue
    keep[o]=tok

# capture world matrices (.g parent) → bake → flip mirrored normals → material
wm={o:o.matrix_world.copy() for o in keep}
for o in list(keep.keys()):
    if o.data.users>1: o.data=o.data.copy()
    me=o.data; o.modifiers.clear(); o.parent=None
    me.transform(wm[o])
    if wm[o].determinant()<0:
        bm=bmesh.new(); bm.from_mesh(me); bmesh.ops.reverse_faces(bm,faces=bm.faces); bm.to_mesh(me); bm.free()
    o.matrix_world=Matrix.Identity(4)
    nl=o.name.lower()
    m = (iris_m if (is_eye(o.name) and eyepart(o.name)=="iris") else sclera_m) if is_eye(o.name) else ear_m
    o.data.materials.clear(); o.data.materials.append(m)
    for p in me.polygons: p.use_smooth=True

# merge per token
groups=defaultdict(list)
for o,t in keep.items(): groups[t].append(o)
merged={}
for tok,objs in groups.items():
    for ob in objs: ob.select_set(False)
    bpy.context.view_layer.objects.active=objs[0]
    for ob in objs: ob.select_set(True)
    if len(objs)>1: bpy.ops.object.join()
    m=bpy.context.view_layer.objects.active
    m.name=tok; m.data.name=tok; merged[tok]=m; m.select_set(False)

# export
for o in bpy.data.objects:
    o.hide_set(False); o.hide_viewport=False; o.hide_render=False
bpy.ops.export_scene.gltf(filepath=OUT, export_format="GLB", use_selection=False,
    export_yup=True, export_apply=True, export_cameras=False, export_lights=False, export_materials="EXPORT")
import os
result={"out":OUT,"mb":round(os.path.getsize(OUT)/1e6,3),"tokens":sorted(merged.keys()),
        "polys":{t:len(m.data.polygons) for t,m in merged.items()}}
print("head features build done")
