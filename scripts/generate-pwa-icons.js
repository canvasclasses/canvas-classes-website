/* Generates PWA icons from the white "Canvas" wordmark onto a dark (#050505) square.
   Run once (and whenever the logo or sizing changes): node scripts/generate-pwa-icons.js
   sharp is a devDependency of apps/student and is hoisted to the repo-root node_modules. */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, '..', 'apps', 'student', 'public');
const SVG = path.join(PUBLIC, 'Canvas Logo white.svg'); // viewBox 0 0 1442 300, white fill
const OUT = path.join(PUBLIC, 'icons');
const BG = { r: 5, g: 5, b: 5, alpha: 1 }; // #050505

fs.mkdirSync(OUT, { recursive: true });

// Render the wordmark to a transparent PNG at a target width, then center it on a
// solid #050505 square. wordmarkWidthRatio controls how much of the square the
// wordmark fills (smaller for the maskable safe zone).
async function makeIcon({ size, wordmarkWidthRatio, file }) {
  const wordmarkWidth = Math.round(size * wordmarkWidthRatio);
  const wordmarkHeight = Math.round((wordmarkWidth * 300) / 1442); // preserve 1442:300
  const wordmark = await sharp(SVG, { density: 300 })
    .resize(wordmarkWidth, wordmarkHeight, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: wordmark, gravity: 'center' }])
    .png()
    .toFile(path.join(OUT, file));
  console.log('wrote', path.join('icons', file), `${size}x${size}`);
}

(async () => {
  // "any" icons: wordmark ~76% of width (comfortable margin)
  await makeIcon({ size: 192, wordmarkWidthRatio: 0.76, file: 'icon-192.png' });
  await makeIcon({ size: 512, wordmarkWidthRatio: 0.76, file: 'icon-512.png' });
  // maskable: keep content inside the central ~80% safe zone -> wordmark ~60% width
  await makeIcon({ size: 192, wordmarkWidthRatio: 0.6, file: 'icon-maskable-192.png' });
  await makeIcon({ size: 512, wordmarkWidthRatio: 0.6, file: 'icon-maskable-512.png' });
  // apple touch icon: opaque 180x180 (iOS ignores transparency)
  await makeIcon({ size: 180, wordmarkWidthRatio: 0.76, file: 'apple-touch-icon.png' });
  console.log('done');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
