// image-prep — download a question figure URL and make it legible to a vision model.
// Shared by fetch-question-images.js and the solution toolkits' fetch-batch.js.
//
// Why: the Claude vision API can't decode SVG, and the bank's SVGs are white-on-
// transparent. So any SVG URL → rasterise to a dark-background PNG via `sharp`
// (NOT magick/convert — those need ghostscript, which isn't installed). Raster
// inputs (PNG/JPG/WebP) are flattened on black and normalised to PNG too, so the
// caller always gets a local PNG path the Read tool can open.

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const MAX_PX = 1000;

async function urlToLocalPng(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const head = buf.slice(0, 200).toString('utf8');
  const isSvg = /\.svg($|\?)/i.test(url) || /<svg|<\?xml/i.test(head);
  const pipe = isSvg ? sharp(buf, { density: 200 }) : sharp(buf);
  await pipe
    .flatten({ background: '#000000' })
    .resize(MAX_PX, MAX_PX, { fit: 'inside', withoutEnlargement: !isSvg })
    .png()
    .toFile(outPath);
  return outPath;
}

// labeled: [{ source, url }] → [{ source, url, file } | { source, url, error }]
// outDir is created if missing; files are named <display_id>__<idx>.png.
async function prepareImages(labeled, displayId, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const safeId = String(displayId).replace(/[^a-z0-9-]/gi, '_');
  const out = [];
  for (let i = 0; i < labeled.length; i++) {
    const { source, url } = labeled[i];
    const outPath = path.join(outDir, `${safeId}__${i}.png`);
    try {
      await urlToLocalPng(url, outPath);
      out.push({ source, url, file: outPath });
    } catch (e) {
      out.push({ source, url, error: e.message });
    }
  }
  return out;
}

module.exports = { urlToLocalPng, prepareImages, MAX_PX };
