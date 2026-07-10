# Reproducible head-reshape tool (coarse proportional passes toward the Complete
# Anatomy reference). Loads fresh, applies parameterised deformations to the nose
# zone (bone + cartilage + muscle move together), sets the working profile camera,
# renders. Tune the params per pass. NEXT features: cranium depth, forehead, chin.
import bpy, re, mathutils, bmesh
PATH="/tmp/z-anatomy/Z-Anatomy/Startup.blend"
OUT="/tmp/anat-compress/nose_after.png"

# ---- NOSE params (anisotropic shrink toward the nose root) ----
ROOT=mathutils.Vector((0.0,-0.085,1.555))   # nasion-ish, where nose meets face
SY=0.74   # forward-projection scale (eased back per founder — was 0.50, too flat)
SX=0.90   # width scale
SZ=0.92   # height scale
LIFT=0.35 # raise the lower nose toward the root → opens the upper-lip gap above the teeth
ZONE_X=0.032; ZONE_ZMIN=1.50; ZONE_ZMAX=1.60; ZONE_YMAX=-0.082
# ---- GLOBAL FACE proportions (widen the narrow/elongated face toward CA) ----
FACE_WIDE=1.0    # REVERTED off (was 1.13) — global widen caused distortion
FACE_TALL=1.0    # REVERTED off (was 0.93) — vertical squish re-beaked the nose
FACE_PIV=mathutils.Vector((0.0,0.0,1.42))   # x-midline, z near skull base
NOTHEAD=("vertebra","atlas","axis","cervical","rib","clavicle","sternum","scapula","disc","hyoid","costal","manubrium")
RENDER_FRONT=False  # profile view (judge occiput + brow); True = front (width)
# ---- OCCIPUT (back of cranium protrudes too far posteriorly) ----
OCC_THRESH=0.045    # +Y beyond this (posterior) gets pulled in
OCC_SCALE=1.0      # REVERTED off (was 0.80)
# ---- BROW ridge (raised above the eye sockets — smooth the bulge) ----
BROW_ZMIN=1.545; BROW_ZMAX=1.62; BROW_XMAX=0.075; BROW_YREF=-0.062; BROW_SCALE=1.0
SKIP=("incisor","tooth","teeth","canine","premolar","molar")

for o in list(bpy.data.objects): bpy.data.objects.remove(o, do_unlink=True)
for c in list(bpy.data.collections):
    try: bpy.data.collections.remove(c)
    except Exception: pass
def helper(n): return bool(re.search(r"\.(i|j|t|s|g)(\.\d+)?$", n))
NOSE_EXTRA=["nasalis","procerus","depressor septi","levator nasolabialis","major alar cartilage","lateral nasal cartilage","septal nasal cartilage"]
with bpy.data.libraries.load(PATH, link=False) as (src,dst):
    dst.collections=[c for c in src.collections if c=="1: Skeletal system"]
    dst.objects=[n for n in src.objects if not helper(n) and any(k in n.lower() for k in NOSE_EXTRA)]
loaded=[o for o in dst.objects if o is not None]
root_c=bpy.data.collections.get("1: Skeletal system")
if root_c and root_c.name not in [ch.name for ch in bpy.context.scene.collection.children]:
    bpy.context.scene.collection.children.link(root_c)
for o in loaded:
    try: bpy.context.scene.collection.objects.link(o)
    except Exception: pass
def unex(lc):
    lc.exclude=False
    for ch in lc.children: unex(ch)
unex(bpy.context.view_layer.layer_collection)
bpy.context.view_layer.update()

# ---- apply nose shrink (region across all layers; teeth excluded) ----
done=set(); moved=0
for o in bpy.context.scene.objects:
    if o.type!="MESH" or not o.data: continue
    if any(s in o.name.lower() for s in SKIP): continue
    me=o.data
    if me.name in done: continue
    done.add(me.name)
    mw=o.matrix_world; inv=mw.inverted()
    for v in me.vertices:
        w=mw@v.co
        if abs(w.x)<ZONE_X and ZONE_ZMIN<w.z<ZONE_ZMAX and w.y<ZONE_YMAX:
            d=w-ROOT
            w=ROOT+mathutils.Vector((d.x*SX, d.y*SY, d.z*SZ))
            drop=ROOT.z-w.z                 # how far below the root this vert sits
            if drop>0: w.z += drop*LIFT      # lift the lower nose → open the teeth gap
            v.co=inv@w; moved+=1
    me.update()

# ---- TRIM UPPER-TOOTH ROOTS (Z-Anatomy roots are exposed; keep only the crown,
#      like the production skeleton) so they stop filling the nose↔teeth gap ----
KEEP_CROWN=1.0  # REVERTED — was 0.55 (chopped crowns looked broken); keep whole teeth
TOOTHKW=("incisor","canine","premolar","molar")
trimmed=0
for o in list(bpy.context.scene.objects):
    if o.type!="MESH" or not o.data: continue
    nl=o.name.lower()
    if not any(k in nl for k in TOOTHKW): continue
    me=o.data; mw=o.matrix_world
    zs=[(mw@v.co).z for v in me.vertices]
    if not zs: continue
    is_upper = ("upper" in nl) or ("lower" not in nl and (sum(zs)/len(zs))>1.505)
    if not is_upper: continue   # upper teeth: crown points down, root points up
    zmin,zmax=min(zs),max(zs)
    cut=zmin+KEEP_CROWN*(zmax-zmin)   # keep crown (low Z), delete root (high Z)
    bm=bmesh.new(); bm.from_mesh(me); bm.verts.ensure_lookup_table()
    doomed=[v for v in bm.verts if (mw@v.co).z>cut]
    if doomed:
        bmesh.ops.delete(bm, geom=doomed, context='VERTS'); trimmed+=1
    bm.to_mesh(me); bm.free(); me.update()

# ---- GLOBAL FACE widen + de-elongate (whole head, all layers together) ----
done2=set(); scaled=0
for o in list(bpy.context.scene.objects):
    if o.type!="MESH" or not o.data: continue
    nl=o.name.lower()
    if any(k in nl for k in NOTHEAD): continue
    me=o.data
    if me.name in done2: continue
    mw=o.matrix_world
    if not me.vertices: continue
    cz=sum((mw@v.co).z for v in me.vertices)/len(me.vertices)
    if cz<1.42: continue           # head region only (skull/face/jaw/teeth/nose/muscle)
    done2.add(me.name); inv=mw.inverted()
    for v in me.vertices:
        w=mw@v.co
        if abs(w.x)<0.035 and 1.49<w.z<1.60 and w.y<-0.072:
            continue   # leave the already-shaped nose alone (don't let the squish re-beak it)
        w.x = FACE_PIV.x + (w.x-FACE_PIV.x)*FACE_WIDE
        w.z = FACE_PIV.z + (w.z-FACE_PIV.z)*FACE_TALL
        v.co=inv@w
    me.update(); scaled+=1

# ---- OCCIPUT pull-in + BROW smoothing (profile bone features) ----
done3=set()
for o in list(bpy.context.scene.objects):
    if o.type!="MESH" or not o.data: continue
    nl=o.name.lower()
    if any(k in nl for k in NOTHEAD): continue
    me=o.data
    if me.name in done3: continue
    done3.add(me.name); mw=o.matrix_world; inv=mw.inverted()
    for v in me.vertices:
        w=mw@v.co; ch=False
        # back of cranium: pull posterior verts forward (round the occiput)
        if w.z>1.55 and w.y>OCC_THRESH:
            w.y = OCC_THRESH + (w.y-OCC_THRESH)*OCC_SCALE; ch=True
        # brow ridge: ease the anterior bulge above the orbits
        if BROW_ZMIN<w.z<BROW_ZMAX and abs(w.x)<BROW_XMAX and w.y<BROW_YREF:
            w.y = BROW_YREF + (w.y-BROW_YREF)*BROW_SCALE; ch=True
        if ch: v.co=inv@w
    me.update()

# ---- materials + camera + lights + render ----
def mkmat(n,rgb,r):
    m=bpy.data.materials.new(n); m.use_nodes=True
    b=m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value=(*rgb,1); b.inputs["Roughness"].default_value=r
    m.diffuse_color=(*rgb,1); return m
bone=mkmat("B",(0.86,0.80,0.66),0.55); cart=mkmat("C",(0.95,0.62,0.13),0.4); mus=mkmat("M",(0.55,0.13,0.13),0.45)
for o in bpy.context.scene.objects:
    o.hide_render=(o.type!="MESH")
    if o.type!="MESH" or not o.data: continue
    nl=o.name.lower()
    m = cart if "cartilage" in nl else (mus if any(k in nl for k in ("nasalis","procerus","depressor septi","levator nasolabialis")) else bone)
    o.data.materials.clear(); o.data.materials.append(m)
    for p in o.data.polygons: p.use_smooth=True
def ctr(o):
    cc=[0,0,0]
    for c in o.bound_box:
        w=o.matrix_world@mathutils.Vector(c)
        for i in range(3): cc[i]+=w[i]
    return mathutils.Vector([v/8 for v in cc])
anchor=next((ctr(o) for o in bpy.context.scene.objects if o.type=="MESH" and "nasal bone" in o.name.lower()), mathutils.Vector((0,-0.09,1.55)))
anchor=mathutils.Vector((0.0, anchor[1], anchor[2]-0.06))   # face centre
cam_d=bpy.data.cameras.new("C"); cam=bpy.data.objects.new("C",cam_d); bpy.context.scene.collection.objects.link(cam)
if RENDER_FRONT:
    cam.location=anchor+mathutils.Vector((0.0,-0.27,0.0))    # straight front (closer)
else:
    cam.location=anchor+mathutils.Vector((-0.34,-0.12,0.03)) # profile
cam.rotation_euler=(anchor-cam.location).normalized().to_track_quat("-Z","Y").to_euler()
bpy.context.scene.camera=cam
def area(n,loc,e,s=2.0):
    d=bpy.data.lights.new(n,"AREA"); d.energy=e; d.size=s
    ob=bpy.data.objects.new(n,d); ob.location=loc; bpy.context.scene.collection.objects.link(ob)
    ob.rotation_euler=(anchor-mathutils.Vector(loc)).normalized().to_track_quat("-Z","Y").to_euler()
area("K",(-0.9,-0.9,anchor[2]+0.4),26); area("F",(0.5,-0.6,anchor[2]),12); area("R",(-0.2,0.8,anchor[2]+0.4),16)
sc=bpy.context.scene
sc.render.engine="BLENDER_EEVEE" if "BLENDER_EEVEE" in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else "BLENDER_EEVEE_NEXT"
try: sc.eevee.use_gtao=True
except Exception: pass
try: sc.view_settings.view_transform="Filmic"
except Exception: pass
sc.render.resolution_x=860; sc.render.resolution_y=900; sc.render.filepath=OUT
bpy.ops.render.render(write_still=True)
print("head reshape (nose) done, verts moved:", moved)
