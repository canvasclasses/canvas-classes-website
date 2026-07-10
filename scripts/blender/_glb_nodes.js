// Parse a .glb and print its node + mesh names (to confirm the viewer's token
// binding will work). glb = 12-byte header + chunks (len|type|data); first chunk is JSON.
const fs = require('fs');
const buf = fs.readFileSync(process.argv[2] || '/tmp/heart.glb');
const jsonLen = buf.readUInt32LE(12);            // first chunk length
const json = JSON.parse(buf.slice(20, 20 + jsonLen).toString('utf8'));
console.log('nodes:', (json.nodes || []).map((n) => n.name));
console.log('meshes:', (json.meshes || []).map((m) => m.name));
console.log('materials:', (json.materials || []).map((m) => m.name));
