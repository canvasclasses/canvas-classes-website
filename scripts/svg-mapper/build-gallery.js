#!/usr/bin/env node
/**
 * SVG MAPPER — Tool 1 of 2 (reviewer / mapper)
 * ============================================
 * Reads a folder of white-on-transparent SVGs (generated in book order with
 * timestamp filenames that carry NO question identity) and emits a single
 * self-contained `gallery.html` you open in your browser, beside the book.
 *
 * Why this exists: the SVGs are invisible on white (Finder/Preview) and have no
 * machine-readable labels, so file -> question matching has to be done by eye.
 * This tool makes that eyeballing fast and produces a `manifest.json` that the
 * companion inserter (insert-from-manifest.js) consumes deterministically.
 *
 * Usage:
 *   node scripts/svg-mapper/build-gallery.js "/Users/CanvasClasses/Desktop/Out - Ready for Database/Properties of matter"
 *
 * Output: writes `gallery.html` INTO that same folder. Double-click to open.
 * In the page you set, per tile: a display_id + a slot. "Group 4 as options"
 * fills this tile + the next three as Options A-D of the same display_id.
 * State auto-saves to localStorage; "Export manifest.json" downloads the map.
 *
 * This script is READ-ONLY against your data — it only reads .svg files and
 * writes one .html next to them. It never touches MongoDB or R2.
 */

const fs = require('fs');
const path = require('path');

const folder = process.argv[2];
if (!folder) {
  console.error('Usage: node scripts/svg-mapper/build-gallery.js "<folder-with-svgs>"');
  process.exit(1);
}
if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
  console.error(`Not a directory: ${folder}`);
  process.exit(1);
}

// Sort by filename — these are `Chem_YYYYMMDD_HHMMSS_nanos.svg`, so lexical
// order == generation order == book figure order.
const files = fs
  .readdirSync(folder)
  .filter((f) => f.toLowerCase().endsWith('.svg'))
  .sort();

if (files.length === 0) {
  console.error(`No .svg files found in: ${folder}`);
  process.exit(1);
}

const folderName = path.basename(folder);
// localStorage key is namespaced per folder so each chapter keeps its own map.
const storageKey = 'svgmap::' + folderName.replace(/[^a-z0-9]+/gi, '_');

const tiles = files
  .map((file, i) => {
    let svg = fs.readFileSync(path.join(folder, file), 'utf8');
    // Strip the XML prolog / doctype if present so it embeds cleanly inline.
    svg = svg.replace(/<\?xml[\s\S]*?\?>/i, '').replace(/<!DOCTYPE[\s\S]*?>/i, '').trim();
    return `
    <div class="card" data-index="${i}" data-file="${file.replace(/"/g, '&quot;')}">
      <div class="meta"><span class="idx">#${i}</span><span class="fname">${file}</span></div>
      <div class="stage">${svg}</div>
      <div class="controls">
        <input class="did" type="text" placeholder="display_id e.g. FLUI-132" autocomplete="off" />
        <select class="slot">
          <option value="">— slot —</option>
          <option value="question">Question stem</option>
          <option value="optionA">Option A</option>
          <option value="optionB">Option B</option>
          <option value="optionC">Option C</option>
          <option value="optionD">Option D</option>
          <option value="solution">Solution sketch</option>
          <option value="skip">Skip / not used</option>
        </select>
        <button class="group4" title="Set this + next 3 as Options A–D of the same display_id">Group 4 → options</button>
        <button class="invert" title="Toggle invert (for any black-on-transparent SVGs)">Invert</button>
      </div>
    </div>`;
  })
  .join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>SVG Mapper — ${folderName}</title>
<style>
  :root { --bg:#121316; --card:#181A21; --line:rgba(255,255,255,.08); --txt:#e8e8ea; --muted:#8b8f98; --accent:#f97316; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--txt); font:14px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; }
  header { position:sticky; top:0; z-index:10; background:rgba(18,19,22,.96); backdrop-filter:blur(8px); border-bottom:1px solid var(--line); padding:12px 20px; display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
  header h1 { font-size:15px; margin:0; font-weight:600; }
  header .sub { color:var(--muted); font-size:12px; }
  .spacer { flex:1; }
  .count { font-variant-numeric:tabular-nums; color:var(--muted); }
  .count b { color:var(--accent); }
  button { cursor:pointer; border:1px solid var(--line); background:rgba(255,255,255,.05); color:var(--txt); border-radius:8px; padding:6px 12px; font-size:12px; }
  button:hover { background:rgba(255,255,255,.1); }
  button.primary { background:linear-gradient(to right,#f97316,#f59e0b); color:#000; font-weight:700; border:none; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px; padding:20px; }
  .card { background:var(--card); border:1px solid var(--line); border-radius:12px; overflow:hidden; display:flex; flex-direction:column; }
  .card.done { border-color:rgba(16,185,129,.5); }
  .card.skip { opacity:.5; }
  .meta { display:flex; justify-content:space-between; gap:8px; padding:8px 10px; font-size:11px; color:var(--muted); border-bottom:1px solid var(--line); }
  .meta .idx { color:var(--accent); font-weight:700; }
  .meta .fname { font-family:ui-monospace,monospace; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:200px; }
  .stage { background:#0d0e11; padding:14px; display:flex; align-items:center; justify-content:center; min-height:220px; }
  .stage svg { width:100% !important; height:auto !important; max-height:300px; display:block; }
  .stage.inv svg { filter:invert(1); }
  .controls { display:grid; grid-template-columns:1fr auto; gap:8px; padding:10px; align-items:center; }
  .controls .did { grid-column:1 / -1; padding:7px 9px; background:rgba(255,255,255,.04); border:1px solid var(--line); border-radius:8px; color:var(--txt); font-family:ui-monospace,monospace; text-transform:uppercase; }
  .controls .slot { padding:7px; background:rgba(255,255,255,.04); border:1px solid var(--line); border-radius:8px; color:var(--txt); }
  .controls .group4, .controls .invert { font-size:11px; padding:5px 8px; }
</style>
</head>
<body>
<header>
  <div>
    <h1>SVG Mapper — ${folderName}</h1>
    <div class="sub">${files.length} figures · in book order · white-on-dark</div>
  </div>
  <div class="spacer"></div>
  <span class="count"><b id="mapped">0</b> / ${files.length} mapped</span>
  <button id="export" class="primary">Export manifest.json</button>
  <button id="copy">Copy JSON</button>
  <button id="clear">Clear all</button>
</header>
<div class="grid">
${tiles}
</div>
<script>
  const STORAGE_KEY = ${JSON.stringify(storageKey)};
  const FOLDER = ${JSON.stringify(folderName)};
  const cards = Array.from(document.querySelectorAll('.card'));

  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
  }
  function save(state) { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  let state = load();

  function refreshCard(card) {
    const i = card.dataset.index;
    const did = card.querySelector('.did').value.trim().toUpperCase();
    const slot = card.querySelector('.slot').value;
    card.classList.toggle('done', !!(did && slot && slot !== 'skip'));
    card.classList.toggle('skip', slot === 'skip');
  }
  function recount() {
    const n = Object.values(state).filter(e => e.display_id && e.slot && e.slot !== 'skip').length;
    document.getElementById('mapped').textContent = n;
  }

  cards.forEach(card => {
    const i = card.dataset.index;
    const didEl = card.querySelector('.did');
    const slotEl = card.querySelector('.slot');
    const saved = state[i];
    if (saved) { didEl.value = saved.display_id || ''; slotEl.value = saved.slot || ''; }
    refreshCard(card);

    function commit() {
      state[i] = { file: card.dataset.file, index: Number(i), display_id: didEl.value.trim().toUpperCase(), slot: slotEl.value };
      save(state); refreshCard(card); recount();
    }
    didEl.addEventListener('input', commit);
    slotEl.addEventListener('change', commit);

    card.querySelector('.group4').addEventListener('click', () => {
      const did = didEl.value.trim().toUpperCase();
      if (!did) { didEl.focus(); return; }
      const slots = ['optionA','optionB','optionC','optionD'];
      for (let k = 0; k < 4; k++) {
        const c = cards[Number(i) + k];
        if (!c) break;
        c.querySelector('.did').value = did;
        c.querySelector('.slot').value = slots[k];
        state[c.dataset.index] = { file: c.dataset.file, index: Number(c.dataset.index), display_id: did, slot: slots[k] };
        refreshCard(c);
      }
      save(state); recount();
    });

    card.querySelector('.invert').addEventListener('click', () => {
      card.querySelector('.stage').classList.toggle('inv');
    });
  });
  recount();

  function buildManifest() {
    const entries = cards
      .map(c => state[c.dataset.index])
      .filter(e => e && e.display_id && e.slot && e.slot !== 'skip')
      .map(e => ({ file: e.file, index: e.index, display_id: e.display_id, slot: e.slot }));
    return { sourceFolder: FOLDER, generatedAt: new Date().toISOString(), count: entries.length, entries };
  }

  document.getElementById('export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(buildManifest(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'manifest.json';
    a.click();
  });
  document.getElementById('copy').addEventListener('click', async () => {
    await navigator.clipboard.writeText(JSON.stringify(buildManifest(), null, 2));
    const b = document.getElementById('copy'); const t = b.textContent; b.textContent = 'Copied!'; setTimeout(() => b.textContent = t, 1200);
  });
  document.getElementById('clear').addEventListener('click', () => {
    if (!confirm('Clear all mappings for this folder?')) return;
    state = {}; save(state);
    cards.forEach(c => { c.querySelector('.did').value=''; c.querySelector('.slot').value=''; refreshCard(c); });
    recount();
  });
</script>
</body>
</html>`;

const outPath = path.join(folder, 'gallery.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log(`✓ Wrote gallery for "${folderName}" — ${files.length} SVGs`);
console.log(`  ${outPath}`);
console.log(`  Open it in your browser, map each tile, then "Export manifest.json".`);
