#!/usr/bin/env node
/**
 * SVG MAPPER — rasterizer helper
 * ==============================
 * Renders a folder of white-on-transparent SVGs to indexed PNGs flattened on a
 * black background (so the white content is visible) for visual review/matching.
 * Index == filename sort order == book figure order.
 *
 * Usage:
 *   node scripts/svg-mapper/rasterize.js "<svg-folder>" "<out-dir>" [maxPx]
 *
 * Read-only against your data: reads .svg, writes .png. No DB / R2.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const [, , folder, outDir, maxPxArg] = process.argv;
if (!folder || !outDir) {
  console.error('Usage: node scripts/svg-mapper/rasterize.js "<svg-folder>" "<out-dir>" [maxPx]');
  process.exit(1);
}
const maxPx = Number(maxPxArg) || 640;
fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(folder).filter((f) => f.toLowerCase().endsWith('.svg')).sort();
if (!files.length) { console.error(`No .svg in ${folder}`); process.exit(1); }

(async () => {
  const manifestLines = [];
  for (let i = 0; i < files.length; i++) {
    const idx = String(i).padStart(2, '0');
    const out = path.join(outDir, `${idx}.png`);
    try {
      await sharp(path.join(folder, files[i]), { density: 200 })
        .flatten({ background: '#000000' })
        .resize(maxPx, maxPx, { fit: 'inside', withoutEnlargement: false })
        .png()
        .toFile(out);
      manifestLines.push(`${idx}\t${files[i]}`);
    } catch (e) {
      console.error(`! failed ${files[i]}: ${e.message}`);
      manifestLines.push(`${idx}\t${files[i]}\tFAILED`);
    }
  }
  fs.writeFileSync(path.join(outDir, '_index.tsv'), manifestLines.join('\n') + '\n');
  console.log(`✓ rasterized ${files.length} SVGs → ${outDir} (index.tsv maps idx → filename)`);
})();
