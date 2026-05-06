/**
 * Downloads NCERT chapter PDFs and uploads them to Cloudflare R2.
 * Outputs: scripts/ncert_r2_links.json  (all URLs + extracted titles)
 *
 * Run: node scripts/upload_ncert_to_r2.js
 */

const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// ── R2 client ────────────────────────────────────────────────────────────────
const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});
const BUCKET = process.env.R2_BUCKET_NAME;
const PUBLIC_URL_BASE = process.env.R2_PUBLIC_URL;
const NCERT_BASE = 'https://ncert.nic.in/textbook/pdf';

// ── Book list ─────────────────────────────────────────────────────────────────
// Each entry = one NCERT book (may span multiple chapter PDFs)
const BOOKS = [
    // ── Class 8 ──────────────────────────────────────────────────────────────
    { cls: '8',  subject: 'Science',        book: 'Science',         code: 'hesc1', chs: 13, dir: 'class8/science' },
    { cls: '8',  subject: 'Mathematics',    book: 'Mathematics',     code: 'hemh1', chs: 13, dir: 'class8/math' },
    { cls: '8',  subject: 'English',        book: 'Honeydew',        code: 'heih1', chs: 8,  dir: 'class8/english-honeydew' },
    { cls: '8',  subject: 'English',        book: 'It So Happened',  code: 'hees1', chs: 7,  dir: 'class8/english-itsohappened' },
    { cls: '8',  subject: 'Social Science', book: 'History',         code: 'hehd1', chs: 8,  dir: 'class8/ss-history' },
    { cls: '8',  subject: 'Social Science', book: 'Civics',          code: 'hekb1', chs: 8,  dir: 'class8/ss-civics' },
    { cls: '8',  subject: 'Social Science', book: 'Geography',       code: 'hess2', chs: 6,  dir: 'class8/ss-geography' },

    // ── Class 9 ──────────────────────────────────────────────────────────────
    { cls: '9',  subject: 'Science',        book: 'Science',          code: 'iesc1', chs: 13, dir: 'class9/science' },
    { cls: '9',  subject: 'Mathematics',    book: 'Mathematics',      code: 'iemh1', chs: 8,  dir: 'class9/math' },
    { cls: '9',  subject: 'English',        book: 'Beehive',          code: 'iebe1', chs: 8,  dir: 'class9/english-beehive' },
    { cls: '9',  subject: 'Social Science', book: 'History',          code: 'iehp1', chs: 6,  dir: 'class9/ss-history' },

    // ── Class 10 ─────────────────────────────────────────────────────────────
    { cls: '10', subject: 'Science',        book: 'Science',         code: 'jesc1', chs: 13, dir: 'class10/science' },
    { cls: '10', subject: 'Mathematics',    book: 'Mathematics',     code: 'jemh1', chs: 14, dir: 'class10/math' },
    { cls: '10', subject: 'English',        book: 'First Flight',    code: 'jeff1', chs: 9,  dir: 'class10/english-firstflight' },
    { cls: '10', subject: 'English',        book: 'Footprints',      code: 'jefp1', chs: 9,  dir: 'class10/english-footprints' },
    { cls: '10', subject: 'Social Science', book: 'History',         code: 'jess1', chs: 7,  dir: 'class10/ss-history' },
    { cls: '10', subject: 'Social Science', book: 'Geography',       code: 'jess2', chs: 5,  dir: 'class10/ss-geography' },
    { cls: '10', subject: 'Social Science', book: 'Civics',          code: 'jess3', chs: 5,  dir: 'class10/ss-civics' },
    { cls: '10', subject: 'Social Science', book: 'Economics',       code: 'jess4', chs: 5,  dir: 'class10/ss-economics' },

    // ── Class 11 ─────────────────────────────────────────────────────────────
    { cls: '11', subject: 'Chemistry',      book: 'Chemistry Part 1', code: 'kech1', chs: 6,  dir: 'class11/chemistry-p1' },
    { cls: '11', subject: 'Chemistry',      book: 'Chemistry Part 2', code: 'kech2', chs: 3,  dir: 'class11/chemistry-p2' },
    { cls: '11', subject: 'Physics',        book: 'Part 1',          code: 'keph1', chs: 7,  dir: 'class11/physics-p1' },
    { cls: '11', subject: 'Physics',        book: 'Part 2',          code: 'keph2', chs: 7,  dir: 'class11/physics-p2' },
    { cls: '11', subject: 'Mathematics',    book: 'Mathematics',     code: 'kemh1', chs: 13, dir: 'class11/math' },
    { cls: '11', subject: 'Biology',        book: 'Biology',         code: 'kebo1', chs: 19, dir: 'class11/biology' },
    { cls: '11', subject: 'English',        book: 'Hornbill',        code: 'kehb1', chs: 6,  dir: 'class11/english-hornbill' },
    { cls: '11', subject: 'English',        book: 'Snapshots',       code: 'kesp1', chs: 5,  dir: 'class11/english-snapshots' },

    // ── Class 12 ─────────────────────────────────────────────────────────────
    { cls: '12', subject: 'Chemistry',      book: 'Chemistry Part 1', code: 'lech1', chs: 5,  dir: 'class12/chemistry-p1' },
    { cls: '12', subject: 'Chemistry',      book: 'Chemistry Part 2', code: 'lech2', chs: 5,  dir: 'class12/chemistry-p2' },
    { cls: '12', subject: 'Physics',        book: 'Part 1',          code: 'leph1', chs: 8,  dir: 'class12/physics-p1' },
    { cls: '12', subject: 'Physics',        book: 'Part 2',          code: 'leph2', chs: 6,  dir: 'class12/physics-p2' },
    { cls: '12', subject: 'Mathematics',    book: 'Part 1',          code: 'lemh1', chs: 6,  dir: 'class12/math-p1' },
    { cls: '12', subject: 'Mathematics',    book: 'Part 2',          code: 'lemh2', chs: 7,  dir: 'class12/math-p2' },
    { cls: '12', subject: 'Biology',        book: 'Biology',         code: 'lebo1', chs: 13, dir: 'class12/biology' },
    { cls: '12', subject: 'English',        book: 'Flamingo',        code: 'lefl1', chs: 13, dir: 'class12/english-flamingo' },
    { cls: '12', subject: 'English',        book: 'Vistas',          code: 'levt1', chs: 6,  dir: 'class12/english-vistas' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function download(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode}`)); }
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        }).on('error', reject);
    });
}

function extractTitle(buf, chapterNum, subject) {
    const tmp = path.join(os.tmpdir(), `ncert_${Date.now()}_${Math.random()}.pdf`);
    try {
        fs.writeFileSync(tmp, buf);
        const raw = execSync(`pdftotext "${tmp}" - 2>/dev/null`, { encoding: 'utf8', timeout: 8000 });
        const title = raw.split('\n')
            .map(l => l.trim())
            .filter(l => l.length > 5 && l.length < 120)
            .filter(l => /[a-zA-Z]{3,}/.test(l))
            .filter(l => !/^\d+$/.test(l))
            .filter(l => !/^(reprint|chapter\s*\d|unit\s*\d|foreword|preface|contents|index)/i.test(l))
            .filter(l => !l.includes('...'))
            .filter(l => !/^(ISBN|Published|NCERT|National Council)/i.test(l))
            [0];
        return title || `${subject} - Chapter ${chapterNum}`;
    } catch {
        return `${subject} - Chapter ${chapterNum}`;
    } finally {
        try { fs.unlinkSync(tmp); } catch {}
    }
}

async function alreadyUploaded(key) {
    try {
        await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
        return true;
    } catch { return false; }
}

async function uploadToR2(buf, key) {
    await s3.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buf,
        ContentType: 'application/pdf',
        ContentDisposition: 'inline',
    }));
}

// Process chapters in small parallel batches
async function processBook(book) {
    const chapters = [];
    const CONCURRENCY = 4;

    for (let start = 1; start <= book.chs; start += CONCURRENCY) {
        const batch = [];
        for (let ch = start; ch < start + CONCURRENCY && ch <= book.chs; ch++) {
            batch.push(ch);
        }
        const results = await Promise.all(batch.map(async (ch) => {
            const chStr = String(ch).padStart(2, '0');
            const ncertUrl = `${NCERT_BASE}/${book.code}${chStr}.pdf`;
            const key = `ncert-books/${book.dir}/ch${chStr}.pdf`;
            const publicUrl = `${PUBLIC_URL_BASE}/ncert-books/${book.dir}/ch${chStr}.pdf`;

            try {
                // Skip if already uploaded
                if (await alreadyUploaded(key)) {
                    process.stdout.write(`  ch${chStr} [cached] `);
                    return { ch, chStr, title: null, url: publicUrl, cached: true };
                }

                const buf = await download(ncertUrl);
                const title = extractTitle(buf, ch, book.subject);
                await uploadToR2(buf, key);
                process.stdout.write(`  ch${chStr}✓ `);
                return { ch, chStr, title, url: publicUrl, cached: false };
            } catch (e) {
                process.stdout.write(`  ch${chStr}✗ `);
                return { ch, chStr, title: null, url: null, error: e.message };
            }
        }));
        chapters.push(...results);
    }
    return chapters;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
    const OUTPUT_PATH = path.join(__dirname, 'ncert_r2_links.json');

    // Load existing partial results to allow resuming
    let results = [];
    if (fs.existsSync(OUTPUT_PATH)) {
        results = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
        console.log(`Resuming — ${results.length} books already in output file.`);
    }

    const doneKeys = new Set(results.map(r => `${r.cls}-${r.subject}-${r.book}`));

    for (const book of BOOKS) {
        const key = `${book.cls}-${book.subject}-${book.book}`;
        if (doneKeys.has(key)) {
            console.log(`SKIP (cached): Class ${book.cls} ${book.subject} — ${book.book}`);
            continue;
        }

        console.log(`\n▶ Class ${book.cls} | ${book.subject} | ${book.book} (${book.chs} chapters, code: ${book.code})`);
        const chapters = await processBook(book);
        console.log('');

        const successCount = chapters.filter(c => c.url).length;
        console.log(`  → ${successCount}/${book.chs} uploaded`);

        results.push({
            cls: book.cls,
            subject: book.subject,
            book: book.book,
            code: book.code,
            chapters: chapters.filter(c => c.url).map(c => ({
                num: c.ch,
                chStr: c.chStr,
                title: c.title || `${book.subject} - Chapter ${c.ch}`,
                url: c.url,
            })),
        });

        // Save after each book so we can resume on interruption
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2));
    }

    console.log('\n✅ All done. Output saved to scripts/ncert_r2_links.json');
    console.log('\n── Summary ──────────────────────────────────────────────────');
    let total = 0;
    for (const r of results) {
        console.log(`  Class ${r.cls} ${r.subject} (${r.book}): ${r.chapters.length} chapters`);
        total += r.chapters.length;
    }
    console.log(`  Total chapters uploaded: ${total}`);
}

main().catch(err => { console.error(err); process.exit(1); });
