import bpy

OUT = "/tmp/skeleton-v1.glb"

TOKENS = {
    # skull broken out into individual cranial + facial bones
    "frontal_bone", "parietal", "temporal_bone", "occipital_bone", "sphenoid_bone",
    "ethmoid_bone", "maxilla", "zygomatic", "nasal_bone", "lacrimal_bone",
    "palatine_bone", "inferior_nasal_concha", "vomer", "mandible", "hyoid",
    # axial + appendicular
    "cervical_vertebrae", "thoracic_vertebrae", "lumbar_vertebrae", "sacrum",
    "coccyx", "ribs", "sternum", "clavicle", "scapula", "humerus", "radius",
    "ulna", "hand", "hip_bone", "femur", "patella", "tibia", "fibula", "foot",
    # soft tissue
    "costal_cartilage", "ligaments", "intervertebral_discs", "joint_cartilage",
}

# Strip everything that is not one of our 22 bone structures (cross-section planes,
# any stray non-mesh) so the exported scene is bone-only.
for o in list(bpy.data.objects):
    if o.name not in TOKENS:
        bpy.data.objects.remove(o, do_unlink=True)

# Un-exclude all collections in the view layer (Z-Anatomy ships many excluded;
# use_selection=False only exports view-layer objects).
def unexclude(lc):
    lc.exclude = False
    for ch in lc.children:
        unexclude(ch)
unexclude(bpy.context.view_layer.layer_collection)

# Make sure all bone objects are visible/renderable.
for o in bpy.data.objects:
    o.hide_set(False)
    o.hide_viewport = False
    o.hide_render = False

bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    use_selection=False,
    export_yup=True,
    export_apply=True,
    export_cameras=False,
    export_lights=False,
    export_materials="EXPORT",
)

import os
result = {
    "out": OUT,
    "bytes": os.path.getsize(OUT),
    "mb": round(os.path.getsize(OUT) / 1e6, 2),
    "exported_objects": [o.name for o in bpy.data.objects if o.type == "MESH"],
}
print("export done")
