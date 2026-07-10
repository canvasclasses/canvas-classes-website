'use strict';
// Batch 2 of real-photo sourcing (founder request, 2026-07-08): "what more images
// can be swapped, add galleries, use historic images of India." All 24 photos
// below are REAL, openly-licensed images from Wikimedia Commons — sourced,
// license-verified (via WebFetch on the actual file page, not just search
// snippets), downloaded, and VISUALLY verified (via the Read tool) before use.
// One licensed candidate (an ambiguous "avalanche" photo, and an earthquake
// photo that turned out to show people) were each caught and swapped for a
// better/safer verified alternative during this process.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { v4: uuid } = require('uuid');
const { execFileSync } = require('child_process');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const bw = require('../lib/book-writer');

const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const CWEBP_QUALITY = 42;
const SRC_DIR = '/private/tmp/claude-501/-Users-CanvasClasses-Desktop-canvas/24e69260-bd31-4a25-99c6-bc375898c726/scratchpad/ss_images';

let s3client;
function getClient() {
  if (s3client) return s3client;
  s3client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  return s3client;
}

async function upload(file, keyPrefix) {
  const srcPath = path.join(SRC_DIR, file);
  const tmpOut = path.join(os.tmpdir(), `b2_${Date.now()}_${Math.random().toString(36).slice(2)}.webp`);
  execFileSync('cwebp', ['-q', String(CWEBP_QUALITY), '-quiet', srcPath, '-o', tmpOut]);
  const webp = fs.readFileSync(tmpOut);
  fs.unlinkSync(tmpOut);
  const bucketName = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';
  const publicBase = process.env.R2_PUBLIC_URL || `https://${bucketName}.${process.env.R2_ACCOUNT_ID}.r2.dev`;
  const storagePath = `books/${BOOK_ID}/ch1ch2-real-photos/${keyPrefix}-${uuid()}.webp`;
  await getClient().send(new PutObjectCommand({
    Bucket: bucketName, Key: storagePath, Body: webp, ContentType: 'image/webp',
    Metadata: { 'uploaded-at': new Date().toISOString(), origin: 'real-photo-wikimedia-commons-batch2' },
  }));
  const url = `${publicBase}/${storagePath}`;
  console.log(`  ✓ ${file} -> ${Math.round(webp.length / 1024)}KB webp`);
  return url;
}

async function replaceBlockKeepingId(db, slug, blockId, patch, opts, summary) {
  const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
  if (!page) throw new Error(`page not found: ${slug}`);
  const idx = page.blocks.findIndex((b) => b.id === blockId);
  if (idx === -1) throw new Error(`block ${blockId} not found on ${slug}`);
  const updated = page.blocks.map((b, i) => (i === idx ? { ...patch, id: blockId, order: b.order } : b));
  const res = await bw.savePage(db, { slug }, updated, { author: 'agent', summary, ...opts });
  console.log(`✓ ${slug} — replaced block ${blockId.slice(0, 8)} (v${res.version})`);
}

async function insertAfter(db, slug, anchorId, newBlock, summary) {
  const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
  if (!page) throw new Error(`page not found: ${slug}`);
  const idx = page.blocks.findIndex((b) => b.id === anchorId);
  if (idx === -1) throw new Error(`anchor ${anchorId} not found on ${slug}`);
  const updated = [...page.blocks.slice(0, idx + 1), newBlock, ...page.blocks.slice(idx + 1)]
    .map((b, i) => ({ ...b, order: i }));
  const res = await bw.savePage(db, { slug }, updated, { author: 'agent', summary });
  console.log(`✓ ${slug} — inserted new block (v${res.version})`);
}

function galleryBlock(items, aspect_ratio = '4:3') {
  return { type: 'gallery', items: items.map((it) => ({ id: uuid(), ...it })), aspect_ratio };
}
function imageBlock({ src, alt, caption, aspect_ratio = '16:9', width = 'full' }) {
  return { type: 'image', src, alt, caption, width, aspect_ratio, generation_prompt: '' };
}

async function main() {
  await bw.withDb(async (db) => {
    console.log('Uploading images...');
    const urls = {
      manuscript: await upload('evidence_manuscript.jpg', 'manuscript'),
      inscription: await upload('evidence_inscription.jpg', 'inscription'),
      figurine: await upload('evidence_figurine.jpg', 'figurine'),
      coin: await upload('evidence_coin.jpg', 'coin'),
      weatherPhysical: await upload('weather_physical.jpg', 'weather-physical'),
      weatherChemical: await upload('weather_chemical.jpg', 'weather-chemical'),
      weatherBiological: await upload('weather_biological.jpg', 'weather-biological'),
      duneBarchan: await upload('dune_barchan.jpg', 'dune-barchan'),
      duneTransverse: await upload('dune_transverse.jpg', 'dune-transverse'),
      duneStar: await upload('dune_star.jpg', 'dune-star'),
      glacialArete: await upload('glacial_arete.jpg', 'glacial-arete'),
      glacialCirque: await upload('glacial_cirque.jpg', 'glacial-cirque'),
      glacialUshaped: await upload('glacial_ushaped.jpg', 'glacial-ushaped'),
      erosionWater: await upload('erosion_water.jpg', 'erosion-water'),
      erosionWind: await upload('erosion_wind.jpg', 'erosion-wind'),
      caveMeghalaya: await upload('cave_meghalaya.jpg', 'cave-meghalaya'),
      tectonicPlates: await upload('tectonic_plates.png', 'tectonic-plates'),
      earthquake: await upload('earthquake_damage_v2.jpg', 'earthquake'),
      waterfallJog: await upload('waterfall_jog.jpg', 'waterfall-jog'),
      ashokaPillar: await upload('ashoka_pillar.jpg', 'ashoka-pillar'),
      gramSabha: await upload('gram_sabha.jpg', 'gram-sabha'),
      econColonial: await upload('econ_colonial.jpg', 'econ-colonial'),
      econIndependence: await upload('econ_independence.jpg', 'econ-independence'),
      econModern: await upload('econ_modern.jpg', 'econ-modern'),
    };

    const lossOpts = (reason) => ({ allowContentLoss: true, lossReason: reason });

    // ─── 1. Ancient evidence gallery ────────────────────────────────────────
    await replaceBlockKeepingId(db, 'how-historians-know-the-past', '7f8bd563-decb-4f3b-b4d0-ce095a7efe04',
      galleryBlock([
        { src: urls.manuscript, alt: 'A real palm-leaf manuscript of the Tirukkural, a classical Tamil text', caption: 'A real Tirukkural palm-leaf manuscript. Public domain, via Tamil Virtual Academy / Wikimedia Commons.' },
        { src: urls.inscription, alt: 'A real 1509 AD Kannada stone inscription at the Virupaksha Temple, Hampi', caption: 'A real inscription (1509 AD) at Hampi\'s Virupaksha Temple. Photo: Dineshkannambadi, CC BY-SA 3.0.' },
        { src: urls.figurine, alt: 'A real Harappan (Indus Valley Civilization) terracotta figurine', caption: 'A real Harappan figurine, National Museum, New Delhi. Photo: Gary Todd, CC0.' },
        { src: urls.coin, alt: 'A real silver punch-marked coin from the Mauryan Empire, Emperor Ashoka\'s reign', caption: 'A real Mauryan-era punch-marked coin. Photo: Sujit kumar, CC BY-SA 4.0.' },
      ]),
      lossOpts('Founder request: swap the illustrated "four kinds of evidence" composite for a real-photo gallery of actual historical objects (manuscript/inscription/figurine/coin), each license-verified.'),
      'Replaced illustrated evidence composite with a 4-item real-photo gallery');

    // ─── 2. Weathering types gallery ─────────────────────────────────────────
    await replaceBlockKeepingId(db, 'weathering-breaking-rock-in-place', '7b121487-4b65-4b69-9506-ae44266c61c3',
      galleryBlock([
        { src: urls.weatherPhysical, alt: 'Real granite exfoliation — sheet-like peeling of rock at Enchanted Rock, Texas', caption: 'Real physical weathering: exfoliation of a granite dome. Photo: Wing-Chi Poon, CC BY-SA 2.5.' },
        { src: urls.weatherChemical, alt: 'Real chemically weathered, pitted limestone at Waipu Caves, New Zealand', caption: 'Real chemical weathering: rainwater dissolving limestone. Photo: Bernard Spragg. NZ, CC0.' },
        { src: urls.weatherBiological, alt: 'A real tree root splitting apart a rock, Biligirirangans, India', caption: 'Real biological weathering: a root splitting rock, Biligirirangans, India. Photo: Shyamal, CC BY-SA 3.0.' },
      ]),
      lossOpts('Founder request: swap the illustrated "three types of weathering" composite for a real-photo gallery, each license-verified; biological slot uses a real Indian example.'),
      'Replaced illustrated weathering composite with a 3-item real-photo gallery');

    // ─── 3. Dune types gallery ────────────────────────────────────────────────
    await replaceBlockKeepingId(db, 'wind-landforms-deserts-dunes-and-oases', '070fe316-4019-4811-85ee-900c88f55730',
      galleryBlock([
        { src: urls.duneBarchan, alt: 'A real crescent-shaped barchan dune, Sperrgebiet, Namibia', caption: 'A real barchan dune, Sperrgebiet, Namibia. Photo: Plastic pony, CC BY-SA 4.0.' },
        { src: urls.duneTransverse, alt: 'Real transverse dune ridges, satellite image of the Rub al Khali desert, Arabia', caption: "Real transverse dune ridges, Rub' al Khali (satellite image). NASA, public domain." },
        { src: urls.duneStar, alt: 'Aerial view of Deadvlei and the "Big Daddy" star dune, Namib-Naukluft Park, Namibia', caption: 'A real star dune ("Big Daddy"), Namib-Naukluft Park. Photo: Olga Ernst & Hp.Baumeler, CC BY-SA 4.0.' },
      ]),
      lossOpts('Founder request: swap the illustrated "three dune shapes" composite for a real-photo gallery, each license-verified.'),
      'Replaced illustrated dune composite with a 3-item real-photo gallery');

    // ─── 4. Glacial landforms gallery ────────────────────────────────────────
    await replaceBlockKeepingId(db, 'glacial-landforms-and-moraines', '2b79c27d-2e2d-40c2-aa07-6e960a75d4b2',
      galleryBlock([
        { src: urls.glacialArete, alt: 'A real sharp arête ridge, Cuillin ridge, Isle of Skye, Scotland', caption: 'A real arête, Cuillin ridge, Skye. Photo: Ailith Stewart, CC BY-SA 2.0.' },
        { src: urls.glacialCirque, alt: 'A real glacial cirque holding a tarn (lake), Beartooth Mountains, Wyoming, USA', caption: 'A real cirque and tarn, Beartooth Mountains, USA. Photo: James St. John, CC BY 2.0.' },
        { src: urls.glacialUshaped, alt: 'A real U-shaped glacial valley, Leh valley, Ladakh, India', caption: 'A real U-shaped valley, Ladakh, India. Photo: DanHobley, CC BY-SA 3.0.' },
      ]),
      lossOpts('Founder request: swap the illustrated glaciated-landscape composite for a real-photo gallery, each license-verified; U-shaped valley uses a genuine Indian Himalaya (Ladakh) example.'),
      'Replaced illustrated glacial-landform composite with a 3-item real-photo gallery');

    // ─── 5. Erosion types gallery ────────────────────────────────────────────
    await replaceBlockKeepingId(db, 'erosion-and-indias-ancient-water-wisdom', '99742b61-65a4-401f-a8ed-7bffeb1cfb6c',
      galleryBlock([
        { src: urls.erosionWater, alt: 'Real gully/badland erosion, the Chambal ravines, Rajasthan, India', caption: 'Real water erosion: the Chambal ravines, Rajasthan. Photo: Biswarup Ganguly, CC BY 3.0.' },
        { src: urls.erosionWind, alt: 'Real wind-sculpted yardang rock formations, White Sands National Park, USA', caption: 'Real wind erosion: yardangs, White Sands National Park, USA. NPS / Ken Redeker, public domain.' },
      ]),
      lossOpts('Founder request: swap the illustrated "water and wind erosion" composite for a real-photo gallery; water-erosion slot uses a genuine Indian example (Chambal ravines).'),
      'Replaced illustrated erosion composite with a 2-item real-photo gallery');

    // ─── 6. Underground-water-caves hero — real Meghalaya cave ──────────────
    await replaceBlockKeepingId(db, 'underground-water-caves-and-karst-landscapes', '0f4678ed-2428-4e1a-a022-d73fa4531cc6',
      imageBlock({ src: urls.caveMeghalaya, alt: 'The real interior of Mawsmai Cave, Meghalaya, India', caption: 'Inside Mawsmai Cave, Meghalaya, India — a real limestone cave. Photo: Ppyoonus, public domain.', aspect_ratio: '16:5' }),
      lossOpts('Founder request: swap the illustrated cave hero for a real photo of an actual Meghalaya cave, the same region already named on this page.'),
      'Replaced illustrated cave hero with a real Meghalaya cave photo');

    // ─── 7. Plate boundaries: real USGS map + real earthquake damage ────────
    await replaceBlockKeepingId(db, 'plate-boundaries-earthquakes-and-volcanoes', '7ebea3ab-3239-4a1d-8840-c882641c11eb',
      imageBlock({ src: urls.tectonicPlates, alt: 'A real, published USGS world map of tectonic plates and their boundaries', caption: 'The real USGS map of the world\'s tectonic plates. USGS, public domain.', aspect_ratio: '16:9' }),
      lossOpts('Founder request: swap the illustrated tectonic-plate map for the real, publicly available USGS map — no need to illustrate something that is already a real published scientific map.'),
      'Replaced illustrated tectonic-plate map with the real USGS map');
    await replaceBlockKeepingId(db, 'plate-boundaries-earthquakes-and-volcanoes', '92a133ab-0ae5-4347-b582-439a97feb6e1',
      imageBlock({ src: urls.earthquake, alt: 'Real structural damage to houses after the 2015 Nepal earthquake, no people visible', caption: 'Real damage from the 2015 Nepal earthquake — no people shown. Photo: Nirmal Dulal, CC BY-SA 4.0.', aspect_ratio: '16:9' }),
      lossOpts('Founder request: swap the illustrated earthquake-damage scene for a real photo — verified to show no people, only structural damage, appropriate for a Class 9 reader.'),
      'Replaced illustrated earthquake damage with a real, people-free 2015 Nepal earthquake photo');

    // ─── 8. Rivers hero — real Jog Falls ─────────────────────────────────────
    await replaceBlockKeepingId(db, 'rivers-waterfalls-meanders-and-deltas', '7677bf16-793b-44d6-ac39-cf431d4e033e',
      imageBlock({ src: urls.waterfallJog, alt: 'Jog Falls, a real waterfall in Shimoga district, Karnataka, India', caption: "Jog Falls, Karnataka — India's second-highest plunge waterfall. Photo: Naveen Gowda, CC BY-SA 4.0.", aspect_ratio: '16:5' }),
      lossOpts('Founder request: swap the illustrated river-journey hero for a real photo of a real, named Indian waterfall.'),
      'Replaced illustrated hero with a real Jog Falls photo');

    // ─── 9. New addition: Ashoka Pillar on indias-roots-in-social-thinking ──
    await insertAfter(db, 'indias-roots-in-social-thinking', 'd874f036-4faf-4c1e-b9f4-42b2f1a61f9f',
      imageBlock({ src: urls.ashokaPillar, alt: 'The real remains of the Ashoka Pillar at Sarnath, India, 3rd century BCE', caption: 'The real Ashoka Pillar at Sarnath — a physical monument from the Mauryan era discussed on this page. Photo: Jonas Maria E., public domain.', aspect_ratio: '4:3', width: 'two_third' }),
      'Added a real Ashoka Pillar photo — new historic-India authenticity addition (founder request)');

    // ─── 10. New addition: Gram Sabha on political-science-power-and-governance ─
    await insertAfter(db, 'political-science-power-and-governance', 'dd761216-3068-4557-af9d-478c3b0a8fc6',
      imageBlock({ src: urls.gramSabha, alt: 'A real Gram Sabha (village assembly) meeting at Mendha Lekha, Maharashtra, India', caption: 'A real Gram Sabha meeting at Mendha Lekha, Maharashtra — grassroots self-governance in practice. CC BY-SA 4.0, via Wikimedia Commons.', aspect_ratio: '4:3', width: 'two_third' }),
      'Added a real Gram Sabha photo — new historic/authentic-India addition tied to the Panchayati Raj content already on this page (founder request)');

    // ─── 11. New gallery: India's economic history on economics-choices-and-resources ─
    await insertAfter(db, 'economics-choices-and-resources', 'f266fb33-ae26-47f6-a644-923213d081f6',
      galleryBlock([
        { src: urls.econColonial, alt: 'A real photograph of Burra Bazaar, Calcutta, 1887-89, colonial-era India', caption: 'Colonial-era India: Burra Bazaar, Calcutta, 1887-89. Public domain.' },
        { src: urls.econIndependence, alt: 'A real 1953 photograph of Jawaharlal Nehru inspecting construction of the Bhakra Dam', caption: 'Post-independence India: Nehru inspecting the Bhakra Dam, 1953 — the First Five Year Plan era. Nehru Memorial Museum and Library, public domain.' },
        { src: urls.econModern, alt: "A real photograph of Amazon's modern IT campus in Hyderabad, India", caption: "Modern India: Amazon's Hyderabad tech campus. Photo: Faismeen, CC BY-SA 4.0." },
      ], '3:2'),
      'Added a real-photo gallery spanning India\'s economic history (colonial → independence → modern), tied to the existing timeline (founder request)');
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
