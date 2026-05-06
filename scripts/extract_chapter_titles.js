/**
 * Downloads each chapter PDF from R2 and extracts a human-readable title.
 * Outputs: scripts/ncert_chapter_titles.json
 *
 * Run: node scripts/extract_chapter_titles.js
 */

const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const R2_BASE = process.env.R2_PUBLIC_URL; // e.g. https://pub-xxx.r2.dev

// All books with their R2 dirs and chapter counts (must match ncertBooksData.ts)
const BOOKS = [
    // ── Class 8 ──────────────────────────────────────────────────────────────
    { id: 'r2-8-science-science',                dir: 'class8/science',              chs: 13 },
    { id: 'r2-8-mathematics-mathematics',        dir: 'class8/math',                 chs: 13 },
    { id: 'r2-8-english-honeydew',               dir: 'class8/english-honeydew',     chs: 8  },
    { id: 'r2-8-english-it-so-happened',         dir: 'class8/english-itsohappened', chs: 7  },
    { id: 'r2-8-social-science-history',         dir: 'class8/ss-history',           chs: 8  },
    { id: 'r2-8-social-science-civics',          dir: 'class8/ss-civics',            chs: 7  },
    { id: 'r2-8-social-science-geography',       dir: 'class8/ss-geography',         chs: 6  },
    // ── Class 9 ──────────────────────────────────────────────────────────────
    { id: 'r2-9-science',                        dir: 'class9/science',              chs: 13 },
    { id: 'r2-9-mathematics',                    dir: 'class9/math',                 chs: 8  },
    { id: 'r2-9-english-beehive',                dir: 'class9/english-beehive',      chs: 8  },
    { id: 'r2-9-social-science-history',         dir: 'class9/ss-history',           chs: 6  },
    // ── Class 10 ─────────────────────────────────────────────────────────────
    { id: 'r2-10-science-science',               dir: 'class10/science',             chs: 13 },
    { id: 'r2-10-mathematics-mathematics',       dir: 'class10/math',                chs: 14 },
    { id: 'r2-10-english-first-flight',          dir: 'class10/english-firstflight', chs: 9  },
    { id: 'r2-10-english-footprints',            dir: 'class10/english-footprints',  chs: 9  },
    { id: 'r2-10-ss-history',                    dir: 'class10/ss-history',          chs: 7  },
    { id: 'r2-10-ss-geography',                  dir: 'class10/ss-geography',        chs: 5  },
    { id: 'r2-10-ss-civics',                     dir: 'class10/ss-civics',           chs: 5  },
    { id: 'r2-10-ss-economics',                  dir: 'class10/ss-economics',        chs: 5  },
    // ── Class 11 ─────────────────────────────────────────────────────────────
    { id: 'r2-11-chemistry-part1',               dir: 'class11/chemistry-p1',        chs: 6  },
    { id: 'r2-11-chemistry-part2',               dir: 'class11/chemistry-p2',        chs: 3  },
    { id: 'r2-11-physics-part1',                 dir: 'class11/physics-p1',          chs: 7  },
    { id: 'r2-11-physics-part2',                 dir: 'class11/physics-p2',          chs: 7  },
    { id: 'r2-11-mathematics',                   dir: 'class11/math',                chs: 13 },
    { id: 'r2-11-biology',                       dir: 'class11/biology',             chs: 19 },
    { id: 'r2-11-english-hornbill',              dir: 'class11/english-hornbill',    chs: 6  },
    { id: 'r2-11-english-snapshots',             dir: 'class11/english-snapshots',   chs: 5  },
    // ── Class 12 ─────────────────────────────────────────────────────────────
    { id: 'r2-12-chemistry-part1',               dir: 'class12/chemistry-p1',        chs: 5  },
    { id: 'r2-12-chemistry-part2',               dir: 'class12/chemistry-p2',        chs: 5  },
    { id: 'r2-12-physics-part1',                 dir: 'class12/physics-p1',          chs: 8  },
    { id: 'r2-12-physics-part2',                 dir: 'class12/physics-p2',          chs: 6  },
    { id: 'r2-12-mathematics-part1',             dir: 'class12/math-p1',             chs: 6  },
    { id: 'r2-12-mathematics-part2',             dir: 'class12/math-p2',             chs: 7  },
    { id: 'r2-12-biology',                       dir: 'class12/biology',             chs: 12 },
    { id: 'r2-12-english-flamingo',              dir: 'class12/english-flamingo',    chs: 11 },
    { id: 'r2-12-english-vistas',                dir: 'class12/english-vistas',      chs: 6  },
];

// Bad title patterns — if a line matches these, it's not a chapter title
const BAD_PATTERNS = [
    /^chapter\s+(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+)$/i,
    /^(chapter|unit|part|section)\s*\d*$/i,
    /^(mathematics|physics|chemistry|biology|science|english|geography|history|civics|economics|social science)$/i,
    /^(ncert|national council|reprint|foreword|preface|contents|index|notes for the teacher|before you read)$/i,
    /^(overview|general|introduction:|part \d|section [ivxlcdm]+)$/i,
    /^\d+$/,
    /^[ivxlcdmIVXLCDM]+$/,      // roman numerals only
    /\.{3,}/,                    // ellipsis
    /^.{1,4}$/,                  // too short
    /^.{100,}$/,                 // too long
    /isbn|published by|©|copyright/i,
    /www\.|\.com|\.in|\.org/i,
];

function isBadTitle(line) {
    return BAD_PATTERNS.some(p => p.test(line.trim()));
}

function extractTitle(buf, chapterNum) {
    const tmp = path.join(os.tmpdir(), `ncert_title_${Date.now()}_${Math.random()}.pdf`);
    try {
        fs.writeFileSync(tmp, buf);
        // Only extract the first 2 pages to keep it fast
        const raw = execSync(`pdftotext -l 2 "${tmp}" - 2>/dev/null`, { encoding: 'utf8', timeout: 8000 });
        const lines = raw.split('\n')
            .map(l => l.trim())
            .filter(l => l.length > 3);

        // Strategy 1: find a line immediately after a "CHAPTER N" or just a standalone line that looks like a chapter title
        let afterChapterKeyword = false;
        for (const line of lines) {
            if (/^chapter\s+\d+$/i.test(line) || /^chapter\s+(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)$/i.test(line)) {
                afterChapterKeyword = true;
                continue;
            }
            if (afterChapterKeyword && line.length > 4 && !isBadTitle(line)) {
                return titleCase(line);
            }
            afterChapterKeyword = false;
        }

        // Strategy 2: first non-bad line that has ≥3 words and is not pure numbers
        for (const line of lines) {
            if (!isBadTitle(line) && line.split(/\s+/).length >= 3 && /[a-zA-Z]{3,}/.test(line)) {
                return titleCase(line);
            }
        }

        return null;
    } catch {
        return null;
    } finally {
        try { fs.unlinkSync(tmp); } catch {}
    }
}

function titleCase(str) {
    // Preserve all-caps acronyms (DNA, ATP, etc.) but fix normal words
    return str
        .replace(/\b([A-Z]{2,})\b/g, m => m)          // keep acronyms
        .replace(/\b([a-z])([a-z]+)\b/g, (_, a, b) => a.toUpperCase() + b)
        .replace(/\b(And|Or|Of|The|A|An|In|On|To|For|With|By|From|At|As|Into|Through)\b/g, m => m.toLowerCase())
        .replace(/^([a-z])/, m => m.toUpperCase());     // always capitalise first char
}

function downloadBuf(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode} for ${url}`)); }
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        }).on('error', reject);
    });
}

async function processBook(book) {
    const titles = {};
    process.stdout.write(`  ${book.id.replace('r2-','')}: `);

    const CONCURRENCY = 3;
    for (let start = 1; start <= book.chs; start += CONCURRENCY) {
        const batch = [];
        for (let ch = start; ch < start + CONCURRENCY && ch <= book.chs; ch++) batch.push(ch);

        await Promise.all(batch.map(async ch => {
            const chStr = String(ch).padStart(2, '0');
            const url = `${R2_BASE}/ncert-books/${book.dir}/ch${chStr}.pdf`;
            try {
                const buf = await downloadBuf(url);
                const title = extractTitle(buf, ch);
                titles[ch] = title;
                process.stdout.write(title ? `ch${chStr}✓ ` : `ch${chStr}? `);
            } catch {
                process.stdout.write(`ch${chStr}✗ `);
                titles[ch] = null;
            }
        }));
    }
    console.log('');
    return titles;
}

async function main() {
    const OUTPUT = path.join(__dirname, 'ncert_chapter_titles.json');
    let results = {};
    if (fs.existsSync(OUTPUT)) {
        results = JSON.parse(fs.readFileSync(OUTPUT, 'utf8'));
        console.log(`Resuming — ${Object.keys(results).length} books already extracted.`);
    }

    for (const book of BOOKS) {
        if (results[book.id]) {
            console.log(`SKIP: ${book.id}`);
            continue;
        }
        const titles = await processBook(book);
        results[book.id] = titles;
        fs.writeFileSync(OUTPUT, JSON.stringify(results, null, 2));
    }

    console.log('\n✅ Done. Output saved to scripts/ncert_chapter_titles.json');
}

main().catch(err => { console.error(err); process.exit(1); });
