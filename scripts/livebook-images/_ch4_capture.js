'use strict';
/**
 * Tracks which ~/Downloads "ChatGPT Image*.png" file belongs to which ch4 queue
 * item, robust to a concurrent agent also downloading. Modes:
 *   --init                  snapshot current ChatGPT PNGs as "seen" baseline; reset map
 *   --capture <queueIndex>  find PNG(s) new since last seen, record newest for that index
 *   --show                  print the current index→file map
 * State files (gitignored): _ch4_seen.json, _ch4_map.json
 */
const fs = require('fs'); const os = require('os'); const path = require('path');
const DL = path.join(os.homedir(), 'Downloads');
const SEEN = path.join(__dirname, '_ch4_seen.json');
const MAP = path.join(__dirname, '_ch4_map.json');
const list = () => fs.readdirSync(DL).filter(f => f.startsWith('ChatGPT Image') && f.endsWith('.png'))
  .map(f => ({ f, m: fs.statSync(path.join(DL, f)).mtimeMs }));
const mode = process.argv[2];
if (mode === '--init') {
  fs.writeFileSync(SEEN, JSON.stringify(list().map(x => x.f)));
  fs.writeFileSync(MAP, JSON.stringify({}));
  console.log(`init: baseline ${JSON.parse(fs.readFileSync(SEEN)).length} existing ChatGPT PNGs; map reset`);
} else if (mode === '--capture') {
  const idx = process.argv[3];
  if (idx === undefined) { console.error('need queueIndex'); process.exit(1); }
  const seen = new Set(JSON.parse(fs.readFileSync(SEEN)));
  const fresh = list().filter(x => !seen.has(x.f)).sort((a, b) => b.m - a.m);
  if (fresh.length === 0) { console.error(`CAPTURE FAIL idx ${idx}: no new ChatGPT PNG since last capture`); process.exit(2); }
  if (fresh.length > 1) console.error(`⚠ WARNING idx ${idx}: ${fresh.length} new PNGs appeared (concurrent agent?). Picking newest: ${fresh[0].f}`);
  const chosen = fresh[0].f;
  const map = JSON.parse(fs.readFileSync(MAP));
  map[idx] = chosen;
  fs.writeFileSync(MAP, JSON.stringify(map, null, 1));
  // mark ALL currently-listed files as seen so we never double-count
  fs.writeFileSync(SEEN, JSON.stringify(list().map(x => x.f)));
  console.log(`captured idx ${idx} -> ${chosen} (mtime ${Math.round(fresh[0].m/1000)})`);
} else if (mode === '--show') {
  console.log(fs.existsSync(MAP) ? fs.readFileSync(MAP, 'utf8') : '{}');
} else { console.error('usage: --init | --capture <i> | --show'); process.exit(1); }
