import bpy

PATH = "/tmp/z-anatomy/Z-Anatomy/Startup.blend"

# Find the top-level system collection(s) that hold ligaments/joints, and measure
# how big appending them would be. Directory read for names; then append candidate
# top-level collections to count meshes/polys.
with bpy.data.libraries.load(PATH, link=False, assets_only=False) as (src, dst):
    colls = list(src.collections)

# numbered systems (Z-Anatomy groups by "N: System")
numbered = sorted([c for c in colls if len(c) > 2 and c[0].isdigit() and ":" in c[:4]])

# candidate joint/ligament container collections
cand = sorted([c for c in colls if any(k in c.lower() for k in
              ["articular system", "joints", "ligaments", "syndesmoses", "fibrous joints",
               "synovial joints", "cartilaginous joints"]) and "of " not in c.lower()])[:30]

result = {"numbered_systems": numbered, "joint_ligament_collections": cand}
print("ligament scan done")
