// Pixel-level hit-test for interactive_image hotspots.
//
// WHY THIS EXISTS: hotspot x/y coordinates are authored by a text-only agent
// BEFORE the image exists (it's guessing from the generation prompt, not the
// actual pixels). When the generated image's real composition/padding differs
// from the guess, a hotspot dot lands on empty background instead of the
// feature it's meant to label. This was found (2026-07-12) in 22 of ~40
// hotspots across 8 of 9 diagrams in the Ch.1-2 batch, only because a human
// happened to screenshot one and ask about it. This module makes that class
// of error self-report instead of relying on someone noticing.
//
// APPROACH: every image in this pipeline is a hand-drawn illustration on a
// flat deep-charcoal background (see project_livebook_image_style memory).
// So "is this hotspot on the artwork?" reduces to "is there a pixel near
// this point that's meaningfully different from the background color?" —
// sample a small neighborhood around (x*w, y*h) and check the strongest
// color departure from an estimated background color inside it.

const sharp = require('sharp');

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

async function loadRawRGB(bufferOrPath) {
  const { data, info } = await sharp(bufferOrPath)
    .removeAlpha()
    .toColorspace('srgb')
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: info.channels };
}

function pixelAt(data, width, channels, x, y) {
  const idx = (y * width + x) * channels;
  return [data[idx], data[idx + 1], data[idx + 2]];
}

function colorDist(a, b) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

// Median color from small patches at the 4 corners + 4 edge midpoints —
// robust to one corner accidentally containing artwork.
function estimateBackground({ data, width, height, channels }) {
  const pad = Math.round(Math.min(width, height) * 0.02);
  const points = [
    [pad, pad], [width - 1 - pad, pad], [pad, height - 1 - pad], [width - 1 - pad, height - 1 - pad],
    [Math.round(width / 2), pad], [Math.round(width / 2), height - 1 - pad],
    [pad, Math.round(height / 2)], [width - 1 - pad, Math.round(height / 2)],
  ];
  const samples = points.map(([px, py]) =>
    pixelAt(data, width, channels, clamp(px, 0, width - 1), clamp(py, 0, height - 1))
  );
  const med = [0, 1, 2].map((c) => {
    const vals = samples.map((p) => p[c]).sort((a, b) => a - b);
    return vals[Math.floor(vals.length / 2)];
  });
  return med;
}

// Color-distance threshold above which a pixel counts as "artwork, not background".
// Calibrated against the corrected Ch.1-2 hotspot set (see verify_bio_ch1_2.js) —
// 28 cleanly separates all 9 corrected diagrams' true hits from background noise.
const CONTENT_THRESHOLD = 28;

// Spiral outward from a missed point to suggest the nearest actual content,
// as a hint only — NOT an auto-fix, because in multi-panel images the nearest
// content pixel may belong to a different labeled feature than intended.
function findNearestContent({ data, width, height, channels }, bg, cx, cy, maxRadiusFrac = 0.22) {
  const maxR = Math.round(Math.min(width, height) * maxRadiusFrac);
  for (let r = 4; r <= maxR; r += 4) {
    const steps = Math.max(16, Math.round(r * 0.9));
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      const px = Math.round(cx + r * Math.cos(angle));
      const py = Math.round(cy + r * Math.sin(angle));
      if (px < 0 || py < 0 || px >= width || py >= height) continue;
      const dist = colorDist(pixelAt(data, width, channels, px, py), bg);
      if (dist > CONTENT_THRESHOLD) {
        return { x: +(px / width).toFixed(3), y: +(py / height).toFixed(3), radiusPx: r };
      }
    }
  }
  return null;
}

// Some diagrams are hollow/outline shapes (flowchart-style boxes) where the
// semantically correct hotspot point is the shape's EMPTY interior, not ink —
// e.g. a taxonomy ladder's boxes are outlined rectangles with black centers.
// A direct "is there ink right here" test false-flags every one of those.
// So a point that fails the direct test gets a second chance: cast rays
// outward in a ring of directions and check whether content is hit in most
// of them within a wider radius — i.e. "am I boxed in by artwork on (almost)
// every side," which is true inside a hollow shape and false in open space.
function isEnclosed(decoded, bg, cx, cy, maxRadiusFrac = 0.15) {
  const { data, width, height, channels } = decoded;
  const maxR = Math.round(Math.min(width, height) * maxRadiusFrac);
  const directions = 12;
  let hits = 0;
  for (let i = 0; i < directions; i++) {
    const angle = (i / directions) * Math.PI * 2;
    const dx = Math.cos(angle), dy = Math.sin(angle);
    for (let r = 3; r <= maxR; r += 3) {
      const px = Math.round(cx + dx * r), py = Math.round(cy + dy * r);
      if (px < 0 || py < 0 || px >= width || py >= height) break;
      if (colorDist(pixelAt(data, width, channels, px, py), bg) > CONTENT_THRESHOLD) {
        hits++;
        break;
      }
    }
  }
  return hits >= Math.ceil(directions * 0.75);
}

/**
 * @param {Buffer|string} imageBufferOrPath
 * @param {Array<{id:string,label:string,x:number,y:number}>} hotspots
 * @returns {Promise<{width:number,height:number,background:number[],results:Array}>}
 */
async function checkHotspots(imageBufferOrPath, hotspots) {
  const decoded = await loadRawRGB(imageBufferOrPath);
  const { data, width, height, channels } = decoded;
  const bg = estimateBackground(decoded);
  const radius = Math.max(10, Math.round(Math.min(width, height) * 0.022));

  const results = hotspots.map((h) => {
    const cx = clamp(Math.round(h.x * width), 0, width - 1);
    const cy = clamp(Math.round(h.y * height), 0, height - 1);
    let maxDist = 0;
    for (let dy = -radius; dy <= radius; dy += 2) {
      for (let dx = -radius; dx <= radius; dx += 2) {
        if (dx * dx + dy * dy > radius * radius) continue;
        const px = cx + dx, py = cy + dy;
        if (px < 0 || py < 0 || px >= width || py >= height) continue;
        const dist = colorDist(pixelAt(data, width, channels, px, py), bg);
        if (dist > maxDist) maxDist = dist;
      }
    }
    let pass = maxDist > CONTENT_THRESHOLD;
    let enclosed = false;
    if (!pass) {
      enclosed = isEnclosed(decoded, bg, cx, cy);
      pass = enclosed;
    }
    const entry = { id: h.id, label: h.label, x: h.x, y: h.y, pass, maxColorDist: Math.round(maxDist), enclosed };
    if (!pass) entry.suggestedNear = findNearestContent(decoded, bg, cx, cy);
    return entry;
  });

  return { width, height, background: bg, results };
}

module.exports = { checkHotspots, estimateBackground, loadRawRGB, CONTENT_THRESHOLD };
