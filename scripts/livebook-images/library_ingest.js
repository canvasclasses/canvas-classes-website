// Ingest one generated image into the reusable diagram library
// (_agents/assets/image_library/manifest.json) — NOT tied to any page/block.
//
// Mirrors ingest_core.js's compress+upload steps exactly (same cwebp -q42,
// same R2 client) so library images are byte-for-byte consistent with the
// main per-page pipeline's output. Storage path is `books/_library/<id>_gen.webp`
// instead of `books/<bookId>/ch<n>/...` since these aren't scoped to one book.
//
// Usage:
//   node scripts/livebook-images/library_ingest.js \
//     --file <path/to/downloaded.png> \
//     --id <slug> \
//     --concept "Shapes of s, p, and d orbitals — 2D lobe diagrams" \
//     --tags "orbitals,quantum-numbers,shapes" \
//     --source "Shapes of Orbitals.png" \
//     --had-caption false \
//     --alt "..." \
//     --prompt "the exact generation prompt used" \
//     --aspect "4:3"
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env.local') });
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const CWEBP_QUALITY = 42;
const MANIFEST_PATH = path.join(__dirname, '..', '..', '_agents', 'assets', 'image_library', 'manifest.json');

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : fallback;
}

function r2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
}

async function main() {
  const file = arg('file');
  const id = arg('id');
  const concept = arg('concept');
  const tags = (arg('tags', '') || '').split(',').map((t) => t.trim()).filter(Boolean);
  const sourceFile = arg('source');
  const hadCaption = arg('had-caption', 'false') === 'true';
  const altText = arg('alt', concept);
  const prompt = arg('prompt', '');
  const aspect = arg('aspect', '4:3');

  if (!file || !fs.existsSync(file)) throw new Error(`--file not found: ${file}`);
  if (!id) throw new Error('--id is required (unique slug)');
  if (!concept) throw new Error('--concept is required');

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  if (manifest.entries.some((e) => e.id === id)) {
    throw new Error(`id "${id}" already exists in manifest.json — pick a different slug or edit the entry directly`);
  }

  // 1. COMPRESS — identical to ingest_core.js
  const tmpOut = path.join(os.tmpdir(), `libimg_${id}_${Date.now()}.webp`);
  execFileSync('cwebp', ['-q', String(CWEBP_QUALITY), '-quiet', file, '-o', tmpOut]);
  const webp = fs.readFileSync(tmpOut);
  fs.unlinkSync(tmpOut);
  const origKB = Math.round(fs.statSync(file).size / 1024);
  const newKB = Math.round(webp.length / 1024);
  console.log(`Compressed: ${origKB}KB -> ${newKB}KB`);

  // 2. UPLOAD — books/_library/ instead of books/{bookId}/ch{n}/
  const bucketName = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';
  const publicBase = process.env.R2_PUBLIC_URL || `https://${bucketName}.${process.env.R2_ACCOUNT_ID}.r2.dev`;
  const storagePath = `books/_library/${id}_gen.webp`;

  await r2Client().send(new PutObjectCommand({
    Bucket: bucketName,
    Key: storagePath,
    Body: webp,
    ContentType: 'image/webp',
    Metadata: { 'uploaded-at': new Date().toISOString(), origin: 'livebook-image-library' },
  }));
  const url = `${publicBase}/${storagePath}`;
  console.log(`Uploaded: ${url}`);

  // 3. REGISTER in the manifest
  manifest.entries.push({
    id, subject: 'chemistry', concept, tags,
    source_file: sourceFile || null,
    had_caption: hadCaption,
    r2_url: url,
    alt_text: altText,
    generation_prompt: prompt,
    aspect_ratio: aspect,
    created_at: new Date().toISOString(),
  });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`✅ Registered "${id}" in manifest.json (${manifest.entries.length} entries total)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
