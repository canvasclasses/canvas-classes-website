'use strict';
// Founder feedback (2026-07-08, screenshots):
// 1. landforms-and-disasters hero was left as "IMAGE PENDING" (src cleared at
//    v6 awaiting a hyper-realistic regeneration that never happened) — founder:
//    "these images have been undone after latest changes." Fix: a REAL photo
//    of the actual Feb 2021 Chamoli/Tapovan disaster site (rescue operation,
//    Tunnel 1, 8 Feb 2021) — PIB (Press Information Bureau, Govt of India),
//    CC0, verified via commons.wikimedia.org file page + visual inspection.
//    This is MORE aligned with the founder's original ask (real imagery of the
//    actual event, not another AI attempt) than the abandoned illustration path.
// 2. underground-water-caves-and-karst-landscapes hero (single Mawsmai Cave
//    photo) was "too dark/murky" — founder: "need 3 images with better visuals
//    and maybe keep the ai generated illustration also in that image gallery."
//    Fix: convert to a gallery — recovered original AI illustration (still live
//    on R2, book_page_versions v4) + 3 new, verified well-lit real photos:
//    a brighter/clearer Mawsmai Cave stalactite shot (same site, much better
//    lit), Borra Caves (Andhra Pradesh, dramatic illuminated chamber), and
//    Carlsbad Caverns Chinese Theater (world-famous, textbook-clear formations).
//    No aspect_ratio set on the gallery — uses this session's new natural-ratio
//    fallback in GalleryBlockRenderer.tsx instead of a forced crop.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { v4: uuid } = require('uuid');
const { execFileSync } = require('child_process');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const bw = require('../lib/book-writer');

const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const SCRATCH = '/private/tmp/claude-501/-Users-CanvasClasses-Desktop-canvas/24e69260-bd31-4a25-99c6-bc375898c726/scratchpad';
const CWEBP_QUALITY = 42;
const MAX_DIM = 2000; // downscale huge originals (e.g. Borra at 12209x8140) before webp

async function uploadLocal(file, keyPrefix) {
  const srcPath = path.join(SCRATCH, file);
  const tmpOut = path.join(os.tmpdir(), `fix_${Date.now()}_${Math.random().toString(36).slice(2)}.webp`);
  execFileSync('cwebp', ['-q', String(CWEBP_QUALITY), '-resize', String(MAX_DIM), '0', '-quiet', srcPath, '-o', tmpOut]);
  const webp = fs.readFileSync(tmpOut);
  fs.unlinkSync(tmpOut);
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
  });
  const bucketName = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';
  const publicBase = process.env.R2_PUBLIC_URL || `https://${bucketName}.${process.env.R2_ACCOUNT_ID}.r2.dev`;
  const storagePath = `books/${BOOK_ID}/ch2/${keyPrefix}-${uuid()}.webp`;
  await client.send(new PutObjectCommand({
    Bucket: bucketName, Key: storagePath, Body: webp, ContentType: 'image/webp',
    Metadata: { 'uploaded-at': new Date().toISOString(), origin: 'real-photo-wikimedia-commons-fix-2' },
  }));
  const url = `${publicBase}/${storagePath}`;
  console.log(`  ✓ ${file} -> ${Math.round(webp.length / 1024)}KB webp`);
  return url;
}

async function main() {
  await bw.withDb(async (db) => {
    // ─── 1. Chamoli hero — real disaster-site photo, replaces "IMAGE PENDING" ─
    const chamoliUrl = await uploadLocal('chamoli_pib098.jpg', 'chamoli-tapovan-rescue');
    const page1 = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'landforms-and-disasters' });
    const idx1 = page1.blocks.findIndex((b) => b.id === 'ff04e412-74b1-4853-88c9-30269ebd9397');
    if (idx1 === -1) throw new Error('Chamoli hero block not found');
    const updated1 = page1.blocks.map((b, i) => {
      if (i !== idx1) return b;
      const { generation_prompt, ...rest } = b;
      return {
        ...rest,
        src: chamoliUrl,
        alt: 'Rescue teams clearing debris inside the Tapovan tunnel after the 7 February 2021 Chamoli disaster, Uttarakhand',
        caption: 'SDRF rescue teams clearing mud and debris inside the Tapovan-Vishnugad tunnel, one day after the 7 Feb 2021 Chamoli disaster. Photo: Press Information Bureau, Government of India, CC0.',
      };
    });
    const res1 = await bw.savePage(db, { slug: 'landforms-and-disasters' }, updated1, {
      author: 'agent',
      summary: 'Fixed "IMAGE PENDING" hero (src had been cleared awaiting a regeneration that never happened) — replaced with a real, verified photo of the actual Feb 2021 Chamoli/Tapovan disaster rescue operation (PIB, CC0)',
      allowContentLoss: true,
      lossReason: 'Hero src was empty (a stalled generation placeholder, not real content) — filling it with a real photo is a restoration, not a removal.',
    });
    console.log(`✓ landforms-and-disasters — Chamoli hero fixed (v${res1.version})`);

    // ─── 2. Cave hero → gallery: illustration + 3 verified real photos ────────
    const illustrationUrl = 'https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/books/a60d142c-c96b-48cc-ba72-e68d71d83802/ch2/0f4678ed-2428-4e1a-a022-d73fa4531cc6_gen.webp';
    const mawsmaiUrl = await uploadLocal('cave_mawsmai_stalactite.jpg', 'cave-mawsmai-stalactite');
    const borraUrl = await uploadLocal('cave_borra_full.jpg', 'cave-borra');
    const carlsbadUrl = await uploadLocal('cave_carlsbad.jpg', 'cave-carlsbad');

    const page2 = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'underground-water-caves-and-karst-landscapes' });
    const idx2 = page2.blocks.findIndex((b) => b.id === '0f4678ed-2428-4e1a-a022-d73fa4531cc6');
    if (idx2 === -1) throw new Error('Cave hero block not found');
    const oldHero = page2.blocks[idx2];
    const galleryBlock = {
      id: oldHero.id,
      type: 'gallery',
      items: [
        {
          id: uuid(),
          src: illustrationUrl,
          alt: 'Illustrated cave entrance at dusk with stalactites and an underground river glimpsed inside',
          caption: 'A limestone cave entrance (illustration).',
        },
        {
          id: uuid(),
          src: mawsmaiUrl,
          alt: 'Well-lit stalactite and flowstone formations inside Mawsmai Cave, Meghalaya, India',
          caption: 'Stalactite and flowstone formations inside Mawsmai Cave, Meghalaya. Photo: Dhruva Punde, CC BY-SA 4.0.',
        },
        {
          id: uuid(),
          src: borraUrl,
          alt: 'A vast illuminated chamber inside Borra Caves, Andhra Pradesh, India',
          caption: 'The vast main chamber of Borra Caves, Andhra Pradesh — one of India’s largest cave systems. Photo: Bhim Chawhan, CC BY-SA 4.0.',
        },
        {
          id: uuid(),
          src: carlsbadUrl,
          alt: 'Large stalactite and stalagmite formations in the Big Room of Carlsbad Caverns, New Mexico, USA',
          caption: 'The "Big Room" of Carlsbad Caverns, USA — one of the world’s most famous limestone cave chambers. Photo: Daniel Mayer, CC BY-SA 3.0.',
        },
      ],
    };
    const updated2 = page2.blocks.map((b, i) => (i === idx2 ? galleryBlock : b));
    const res2 = await bw.savePage(db, { slug: 'underground-water-caves-and-karst-landscapes' }, updated2, {
      author: 'agent',
      summary: 'Rebuilt the single dark/murky Mawsmai Cave hero into a 4-image gallery: recovered original AI illustration (book_page_versions v4, still live) + 3 verified well-lit real photos (Mawsmai stalactite close-up, Borra Caves, Carlsbad Caverns). No aspect_ratio set — natural per-slide sizing.',
      allowContentLoss: true,
      lossReason: "Founder feedback (screenshot review): \"i didn't like the cave pic you added, need 3 images with better visuals\" — the old dark/murky Mawsmai photo asset is unlinked from this block (replaced by a clearer Mawsmai shot + 2 more real photos + the recovered illustration); the R2 file itself is not deleted, per platform policy.",
    });
    console.log(`✓ underground-water-caves-and-karst-landscapes — cave gallery rebuilt (v${res2.version})`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
