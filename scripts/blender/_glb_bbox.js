// Report each node's world AABB from a .glb so we can spot a displaced/oversized
// mesh that wrecks auto-fit. Approximates world = node.translation + scale*localMinMax
// (ignores rotation — fine for spotting gross outliers).
const fs = require('fs');
const buf = fs.readFileSync(process.argv[2] || '/tmp/heart.glb');
const jsonLen = buf.readUInt32LE(12);
const j = JSON.parse(buf.slice(20, 20 + jsonLen).toString('utf8'));

function accMinMax(meshIndex) {
  const prim = j.meshes[meshIndex].primitives[0];
  const acc = j.accessors[prim.attributes.POSITION];
  return { min: acc.min, max: acc.max };
}

let gmin = [Infinity, Infinity, Infinity], gmax = [-Infinity, -Infinity, -Infinity];
const rows = [];
for (const n of j.nodes) {
  if (n.mesh === undefined) continue;
  const t = n.translation || [0, 0, 0];
  const s = n.scale || [1, 1, 1];
  const { min, max } = accMinMax(n.mesh);
  const wmin = [0, 1, 2].map(i => t[i] + s[i] * min[i]);
  const wmax = [0, 1, 2].map(i => t[i] + s[i] * max[i]);
  const center = [0, 1, 2].map(i => +((wmin[i] + wmax[i]) / 2).toFixed(3));
  const size = +Math.max(...[0, 1, 2].map(i => wmax[i] - wmin[i])).toFixed(3);
  for (let i = 0; i < 3; i++) { gmin[i] = Math.min(gmin[i], wmin[i]); gmax[i] = Math.max(gmax[i], wmax[i]); }
  rows.push({ name: n.name, center, size });
}
rows.sort((a, b) => b.size - a.size);
const overall = [0, 1, 2].map(i => +(gmax[i] - gmin[i]).toFixed(3));
console.log('overall_bbox_size:', overall);
console.log('top by size:'); rows.slice(0, 6).forEach(r => console.log(' ', r.name, 'center', r.center, 'size', r.size));
// flag outliers far from median center
const med = [0,1,2].map(i => rows.map(r=>r.center[i]).sort((a,b)=>a-b)[Math.floor(rows.length/2)]);
console.log('median_center:', med.map(x=>+x.toFixed(3)));
console.log('outliers (center >0.3 from median on any axis):');
rows.forEach(r => { if ([0,1,2].some(i => Math.abs(r.center[i]-med[i])>0.3)) console.log('  ', r.name, r.center, 'size', r.size); });
