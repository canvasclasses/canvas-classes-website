#!/usr/bin/env node
/**
 * Fetches campus photos from Wikipedia Commons for every college in
 * app/college-predictor/topCollegesData.ts and writes the URLs to
 * app/college-predictor/topCollegesImages.ts.
 *
 * The main data file imports that generated file and merges the URLs in
 * at module load — so re-running this script is the only step needed to
 * refresh the images.
 *
 * Filters out logos, seals, emblems, maps, and anything under 500 px wide.
 * Keeps up to 4 photos per college.
 */

const fs = require('fs');
const path = require('path');

const LOCAL_DIR = path.join(__dirname, '..', '..', 'public', 'college-images');
// Gallery tiles render ~200 px; 480 px covers up to 2× retina.
const GALLERY_WIDTH = 480;
// Hero renders up to ~1100 px; 1600 px covers wide screens at 1× and 2× on narrower.
const HERO_WIDTH = 1600;

// Slug → { title, keywords }. Keywords (case-insensitive, any-match) let us
// filter campus photos from alumni portraits that share the article.
const WIKI_SOURCES = {
  // IITs
  'iit-bombay':     { title: 'IIT Bombay',                          keywords: ['iitb', 'bombay', 'powai'] },
  'iit-delhi':      { title: 'IIT Delhi',                           keywords: ['iitd', 'delhi', 'hauz'] },
  'iit-madras':     { title: 'IIT Madras',                          keywords: ['iitm', 'madras', 'chennai'] },
  'iit-kanpur':     { title: 'IIT Kanpur',                          keywords: ['iitk', 'kanpur'] },
  'iit-kharagpur':  { title: 'IIT Kharagpur',                       keywords: ['iitkgp', 'kharagpur'] },
  'iit-roorkee':    { title: 'IIT Roorkee',                         keywords: ['iitr', 'roorkee'] },
  'iit-guwahati':   { title: 'IIT Guwahati',                        keywords: ['iitg', 'guwahati'] },
  'iit-bhu':        { title: 'Indian Institute of Technology (BHU) Varanasi', keywords: ['iitbhu', 'iit_bhu', 'iit-bhu', 'bhu', 'varanasi', 'banaras'] },

  // NITs
  'nit-trichy':     { title: 'National Institute of Technology, Tiruchirappalli', keywords: ['nitt', 'nit_trichy', 'nit_t', 'tiruchi', 'trichy', 'tiruchirappalli'] },
  'nit-warangal':   { title: 'National Institute of Technology, Warangal', keywords: ['nitw', 'warangal'] },
  'nit-surathkal':  { title: 'National Institute of Technology Karnataka', keywords: ['nitk', 'surathkal', 'karnataka'] },
  'nit-calicut':    { title: 'National Institute of Technology Calicut', keywords: ['nitc', 'calicut', 'kozhikode'] },
  'nit-rourkela':   { title: 'National Institute of Technology, Rourkela', keywords: ['nitr', 'rourkela'] },
  'mnit-jaipur':    { title: 'Malaviya National Institute of Technology, Jaipur', keywords: ['mnit', 'jaipur', 'malaviya'] },
  'vnit-nagpur':    { title: 'Visvesvaraya National Institute of Technology, Nagpur', keywords: ['vnit', 'nagpur', 'visvesvaraya'] },
  'mnnit-allahabad':{ title: 'Motilal Nehru National Institute of Technology Allahabad', keywords: ['mnnit', 'allahabad', 'prayagraj', 'motilal'] },

  // IIITs
  'iiit-hyderabad': { title: 'International Institute of Information Technology, Hyderabad', keywords: ['iiit', 'hyderabad', 'gachibowli'] },
  'iiit-bangalore': { title: 'International Institute of Information Technology, Bangalore', keywords: ['iiit', 'bangalore', 'bengaluru', 'electronic'] },
  'iiit-delhi':     { title: 'Indraprastha Institute of Information Technology Delhi', keywords: ['iiit', 'indraprastha', 'okhla', 'delhi'] },
  'iiit-allahabad': { title: 'Indian Institute of Information Technology, Allahabad', keywords: ['iiit', 'allahabad', 'prayagraj'] },
  'abv-iiitm-gwalior': { title: 'Atal Bihari Vajpayee Indian Institute of Information Technology and Management', keywords: ['iiitm', 'gwalior', 'abv'] },

  // BITS
  'bits-pilani':    { title: 'Birla Institute of Technology and Science, Pilani', keywords: ['bits', 'pilani', 'birla'] },
  'bits-goa':       { title: 'BITS Pilani, K. K. Birla Goa Campus', keywords: ['bits', 'goa', 'zuarinagar'] },
  'bits-hyderabad': { title: 'BITS Pilani, Hyderabad Campus', keywords: ['bits', 'hyderabad'] },

  // Private
  'vit-vellore':    { title: 'Vellore Institute of Technology', keywords: ['vit', 'vellore'] },
  'thapar':         { title: 'Thapar Institute of Engineering and Technology', keywords: ['thapar', 'patiala'] },
  'srm-chennai':    { title: 'SRM Institute of Science and Technology', keywords: ['srm', 'kattankulathur', 'chennai'] },
  'manipal':        { title: 'Manipal Institute of Technology', keywords: ['mit_', 'manipal'] },
  'shiv-nadar':     { title: 'Shiv Nadar University', keywords: ['shiv', 'nadar', 'snu'] },
};

const UA = 'CanvasClassesCollegePredictor/1.0 (https://canvasclasses.com; paaras.thakur07@gmail.com)';
const API = 'https://en.wikipedia.org/w/api.php';
const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';

// Extra free-text Commons search queries for colleges whose Wikipedia page
// has few embedded photos. Each query is tried in order until we have 4.
const COMMONS_FALLBACK_QUERIES = {
  'iit-guwahati':   ['IIT Guwahati campus', 'IIT Guwahati'],
  'iit-bhu':        ['IIT BHU Varanasi campus', 'IIT BHU'],
  'nit-trichy':     ['NIT Trichy campus', 'NIT Tiruchirappalli'],
  'nit-warangal':   ['NIT Warangal campus'],
  'nit-calicut':    ['NIT Calicut campus'],
  'nit-rourkela':   ['NIT Rourkela campus'],
  'mnit-jaipur':    ['MNIT Jaipur campus'],
  'vnit-nagpur':    ['VNIT Nagpur campus', 'Visvesvaraya NIT Nagpur'],
  'mnnit-allahabad':['MNNIT Allahabad campus'],
  'iiit-hyderabad': ['IIIT Hyderabad campus'],
  'iiit-bangalore': ['IIIT Bangalore campus', 'IIITB Bangalore'],
  'iiit-delhi':     ['IIIT Delhi campus'],
  'iiit-allahabad': ['IIIT Allahabad campus'],
  'abv-iiitm-gwalior': ['ABV IIITM Gwalior', 'IIITM Gwalior campus'],
  'bits-pilani':    ['BITS Pilani campus'],
  'bits-goa':       ['BITS Pilani Goa campus', 'BITS Goa'],
  'bits-hyderabad': ['BITS Pilani Hyderabad campus', 'BITS Hyderabad'],
  'vit-vellore':    ['VIT Vellore campus'],
  'thapar':         ['Thapar University campus', 'Thapar Institute Patiala'],
  'srm-chennai':    ['SRM University Kattankulathur', 'SRM Institute Chennai'],
  'manipal':        ['Manipal Institute of Technology campus', 'MIT Manipal'],
  'shiv-nadar':     ['Shiv Nadar University campus'],
};

// File-name substrings that indicate the image is not a campus photo.
const EXCLUDE_RE =
  /(logo|seal|emblem|coat[_-]of[_-]arms|crest|icon|symbol|flag[_-]of|^Map|location|locator|wikimedia|commons|wiki_|question_book|edit-clear|red_pog)/i;

async function apiGet(params, base = API) {
  const qs = new URLSearchParams({ format: 'json', ...params }).toString();
  const resp = await fetch(`${base}?${qs}`, { headers: { 'User-Agent': UA } });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

async function commonsSearch(query) {
  // srnamespace=6 means File: namespace. Returns files whose metadata matches.
  const data = await apiGet({
    action: 'query',
    list: 'search',
    srsearch: query,
    srnamespace: 6,
    srlimit: 20,
  }, COMMONS_API);
  const hits = data?.query?.search ?? [];
  // Titles come back as "File:XYZ.jpg" — strip the prefix to match our other code.
  return hits.map((h) => h.title.replace(/^File:/, ''));
}

async function commonsImageInfo(filenames) {
  const titles = filenames.map((f) => `File:${f}`).join('|');
  const data = await apiGet({
    action: 'query',
    titles,
    prop: 'imageinfo',
    iiprop: 'url|size|mime',
  }, COMMONS_API);
  const pages = Object.values(data?.query?.pages ?? {});
  const result = {};
  for (const p of pages) {
    const info = p.imageinfo?.[0];
    if (!info) continue;
    const file = p.title.replace(/^File:/, '');
    result[file] = info;
  }
  return result;
}

async function listImagesOnPage(title) {
  const data = await apiGet({ action: 'parse', page: title, prop: 'images', redirects: 1 });
  return data?.parse?.images ?? [];
}

async function imageInfo(filenames) {
  // Batch up to 50 file titles in one query.
  const titles = filenames.map((f) => `File:${f}`).join('|');
  const data = await apiGet({
    action: 'query',
    titles,
    prop: 'imageinfo',
    iiprop: 'url|size|mime',
  });
  const pages = Object.values(data?.query?.pages ?? {});
  const result = {};
  for (const p of pages) {
    const info = p.imageinfo?.[0];
    if (!info) continue;
    const file = p.title.replace(/^File:/, '');
    result[file] = info;
  }
  return result;
}

function isGoodCandidate(filename, info, keywords) {
  if (EXCLUDE_RE.test(filename)) return false;
  if (!info) return false;
  const mime = info.mime || '';
  if (!/(jpeg|jpg|png)/i.test(mime)) return false; // skip svg/gif
  if ((info.width ?? 0) < 500) return false;
  // Prefer landscape or near-square; skip extreme portraits (likely alumni headshots).
  if (info.width && info.height && info.height / info.width > 1.4) return false;
  // Must contain at least one college-specific keyword (filters alumni portraits etc.)
  const lower = filename.toLowerCase();
  if (!keywords.some((k) => lower.includes(k.toLowerCase()))) return false;
  return true;
}

async function fetchForSlug(slug, title, keywords) {
  const selected = [];
  const seen = new Set();

  // Step 1: Wikipedia article images.
  try {
    const all = await listImagesOnPage(title);
    if (all.length > 0) {
      const candidates = all.filter((f) => !EXCLUDE_RE.test(f)).slice(0, 40);
      const info = await imageInfo(candidates);
      for (const f of candidates) {
        if (selected.length >= 4) break;
        const i = info[f.replace(/_/g, ' ')] ?? info[f];
        if (!isGoodCandidate(f, i, keywords)) continue;
        if (seen.has(i.url)) continue;
        seen.add(i.url);
        selected.push(i.url);
      }
    }
  } catch (e) {
    console.error(`  ${slug} (wiki): ${e.message}`);
  }

  if (selected.length >= 4) return selected;

  // Step 2: Commons search fallback.
  const queries = COMMONS_FALLBACK_QUERIES[slug] ?? [];
  for (const q of queries) {
    if (selected.length >= 4) break;
    try {
      const hits = await commonsSearch(q);
      const candidates = hits.filter((f) => !EXCLUDE_RE.test(f)).slice(0, 20);
      if (candidates.length === 0) continue;
      const info = await commonsImageInfo(candidates);
      for (const f of candidates) {
        if (selected.length >= 4) break;
        const i = info[f.replace(/_/g, ' ')] ?? info[f];
        if (!isGoodCandidate(f, i, keywords)) continue;
        if (seen.has(i.url)) continue;
        seen.add(i.url);
        selected.push(i.url);
      }
      await sleep(150);
    } catch (e) {
      console.error(`  ${slug} (commons "${q}"): ${e.message}`);
    }
  }

  return selected;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Rewrite a full-size Wikimedia URL to its pre-sized thumb URL.
function wikiThumb(url, width) {
  const m = url.match(
    /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/(?:commons|en))\/([0-9a-f])\/([0-9a-f]{2})\/([^/?#]+)$/i,
  );
  if (!m) return url;
  const [, base, a, ab, file] = m;
  return `${base}/thumb/${a}/${ab}/${file}/${width}px-${file}`;
}

async function downloadTo(url, destPath) {
  const resp = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!resp.ok) throw new Error(`${resp.status} for ${url}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  fs.writeFileSync(destPath, buf);
  return buf.length;
}

function extOf(url) {
  const m = url.match(/\.(jpe?g|png)(?:$|\?|#)/i);
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg';
}

(async () => {
  const out = {};
  const entries = Object.entries(WIKI_SOURCES);
  for (let i = 0; i < entries.length; i++) {
    const [slug, { title, keywords }] = entries[i];
    process.stdout.write(`[${i + 1}/${entries.length}] ${slug} … `);
    const urls = await fetchForSlug(slug, title, keywords);
    out[slug] = urls;
    console.log(`${urls.length} images`);
    await sleep(200); // be polite to Wikipedia
  }

  // Hero: prefer an iconic campus aerial. "From Sameer Hill" is a well-known
  // IIT Bombay aerial view; fall back to any IITB shot, then any college image.
  let hero = null;
  const iitbImgs = out['iit-bombay'] ?? [];
  hero =
    iitbImgs.find((u) => /sameer[_-]?hill/i.test(u)) ??
    iitbImgs.find((u) => /main[_-]?building|main[_-]?road/i.test(u)) ??
    iitbImgs[1] ?? // skip index 0 (often historical / founding photo)
    iitbImgs[0] ??
    null;
  if (!hero) {
    for (const s of Object.keys(out)) {
      if (out[s]?.length) { hero = out[s][0]; break; }
    }
  }

  // Download each image to /public/college-images as a thumbnail. Browsers then
  // serve them same-origin — no Wikimedia rate limits, no third-party hop.
  if (!fs.existsSync(LOCAL_DIR)) fs.mkdirSync(LOCAL_DIR, { recursive: true });
  const localMap = {}; // slug -> string[] of /college-images/... paths
  let bytesTotal = 0;
  console.log('\nDownloading thumbnails…');
  for (const slug of Object.keys(out)) {
    const urls = out[slug];
    const locals = [];
    for (let i = 0; i < urls.length; i++) {
      const ext = extOf(urls[i]);
      const localRel = `/college-images/${slug}-${i + 1}.${ext}`;
      const localAbs = path.join(LOCAL_DIR, `${slug}-${i + 1}.${ext}`);
      try {
        const size = await downloadTo(wikiThumb(urls[i], GALLERY_WIDTH), localAbs);
        bytesTotal += size;
        locals.push(localRel);
      } catch (e) {
        console.error(`  ${slug} #${i + 1}: ${e.message}`);
      }
      await sleep(250);
    }
    localMap[slug] = locals;
    console.log(`  ${slug}: ${locals.length}/${urls.length}`);
  }

  // Hero — bigger thumbnail, separate filename so it doesn't collide with card thumb.
  let heroLocal = null;
  if (hero) {
    try {
      const ext = extOf(hero);
      const localRel = `/college-images/_hero.${ext}`;
      const localAbs = path.join(LOCAL_DIR, `_hero.${ext}`);
      const size = await downloadTo(wikiThumb(hero, HERO_WIDTH), localAbs);
      bytesTotal += size;
      heroLocal = localRel;
      console.log(`  hero: ${localRel}`);
    } catch (e) {
      console.error(`  hero: ${e.message}`);
    }
  }
  console.log(`\nDownloaded ${(bytesTotal / 1024 / 1024).toFixed(1)} MB total.\n`);

  const banner =
    '// AUTO-GENERATED by scripts/college-predictor/fetch_wikipedia_images.js\n' +
    '// Do not edit by hand — re-run the script to refresh.\n' +
    '// Images are downloaded to /public/college-images so they serve same-origin.\n\n';

  const body =
    `export const COLLEGE_IMAGES: Record<string, string[]> = ${JSON.stringify(localMap, null, 2)};\n\n` +
    `export const TOP_COLLEGES_HERO_IMAGE: string | null = ${JSON.stringify(heroLocal)};\n`;

  const outPath = path.join(
    __dirname,
    '..',
    '..',
    'app',
    'college-predictor',
    'topCollegesImages.ts',
  );
  fs.writeFileSync(outPath, banner + body);
  console.log(`Wrote ${outPath}`);

  const missing = Object.entries(localMap).filter(([, v]) => v.length === 0).map(([k]) => k);
  if (missing.length) console.warn(`No images found for: ${missing.join(', ')}`);
})().catch((e) => { console.error(e); process.exit(1); });
