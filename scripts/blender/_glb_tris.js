// Per-node triangle count from a .glb (reads each primitive's index accessor count).
const fs = require('fs');
const buf = fs.readFileSync(process.argv[2]);
const jsonLen = buf.readUInt32LE(12);
const j = JSON.parse(buf.slice(20, 20 + jsonLen).toString('utf8'));
let total = 0;
const rows = [];
for (const n of j.nodes || []) {
  if (n.mesh === undefined) continue;
  const m = j.meshes[n.mesh];
  let tris = 0;
  for (const p of m.primitives) {
    if (p.indices !== undefined) tris += j.accessors[p.indices].count / 3;
    else tris += j.accessors[p.attributes.POSITION].count / 3;
  }
  total += tris;
  rows.push([n.name, tris]);
}
rows.sort((a, b) => b[1] - a[1]);
console.log('total_tris:', total);
rows.forEach(r => console.log(' ', r[0], r[1]));
