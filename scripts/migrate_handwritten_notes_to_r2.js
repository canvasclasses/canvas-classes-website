/* eslint-disable */
/**
 * Migrate handwritten notes from Google Drive → Cloudflare R2.
 *
 * Reads the source list from two places (mirroring app/lib/handwrittenNotesData.ts):
 *   1. Hardcoded STATIC_NOTES (same 11 entries that ship in the code)
 *   2. The published Google Sheet CSV
 *
 * For each entry:
 *   - Downloads the PDF directly from Drive via the public download URL
 *   - Uploads to R2 at:  handwritten-notes/{chapter-slug-or-misc}/{title-slug}.pdf
 *   - Verifies the resulting R2 public URL is reachable (HEAD)
 *
 * Outputs in scripts/output/:
 *   - migration_results.json   — full mapping (title, oldUrl, newUrl, status, size)
 *   - static_notes_updated.txt — drop-in replacement snippet for STATIC_NOTES
 *   - sheet_updates.csv        — title + new URL columns for pasting into the Sheet
 *
 * Usage:
 *   node scripts/migrate_handwritten_notes_to_r2.js          # full run
 *   node scripts/migrate_handwritten_notes_to_r2.js --test   # only the first STATIC_NOTES entry
 *   node scripts/migrate_handwritten_notes_to_r2.js --limit=3 # only the first N entries
 *   node scripts/migrate_handwritten_notes_to_r2.js --resume # skip files already in R2
 */

require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');

// ─── CSV (mirrors app/lib/handwrittenNotesData.ts) ────────────────────────────
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQYSeDWjc95SGbSeyU-Ap2fvga7DpQdxDPTXnyGKtvLrtDOB-34WsatAwiORiHojy1trdIkKreA6Cyc/pub?output=csv';

// ─── STATIC_NOTES (mirrors app/lib/handwrittenNotesData.ts) ───────────────────
const STATIC_NOTES = [
    { id: 'static-surface-chemistry-short',         title: 'Surface Chemistry — Short Revision Notes',  notesUrl: 'https://drive.google.com/file/d/1mHT8skp9opz-idhha6eboLkgNa4o_8W6/view',  category: 'Physical Chemistry', chapter: 'Surface Chemistry' },
    { id: 'static-everyday-life-notes',             title: 'Chemistry in Everyday Life Notes',          notesUrl: 'https://drive.google.com/file/d/1mCmQeRceffKaLWELnSmlT2bpg2qQzaKd/view',  category: 'Organic Chemistry',  chapter: 'Biomolecules & Polymers' },
    { id: 'static-electrochemistry-notes',          title: 'Electrochemistry Notes',                    notesUrl: 'https://drive.google.com/file/d/1hHYRF_B5mZLnZKy_GEy0Cb4RYBmDjnfj/view',  category: 'Physical Chemistry', chapter: 'Electrochemistry' },
    { id: 'static-solutions-notes',                 title: 'Solutions Notes',                           notesUrl: 'https://drive.google.com/file/d/1qyIOR1Y5aMQP12a_n6iYwJIsxZjJUWp7/view',  category: 'Physical Chemistry', chapter: 'Solutions' },
    { id: 'static-kinetics-notes',                  title: 'Chemical Kinetics Notes',                   notesUrl: 'https://drive.google.com/file/d/10S4kxF-cRE0dUKEzu2VNQERf4R68pn6Z/view',  category: 'Physical Chemistry', chapter: 'Chemical Kinetics' },
    { id: 'static-metallurgy-notes',                title: 'Metallurgy Notes',                          notesUrl: 'https://drive.google.com/file/d/18QSAqxCor5xibarUu1askEeVfThudu3e/view',  category: 'Inorganic Chemistry',chapter: 'Metallurgy' },
    { id: 'static-environmental-chemistry-notes',   title: 'Environmental Chemistry Notes',             notesUrl: 'https://drive.google.com/file/d/1QqRBpk9oZY0mrcC36gQ6N2ChYZWTPof1/view',  category: 'Inorganic Chemistry',chapter: 'Environmental Chemistry' },
    { id: 'static-thermodynamics-notes',            title: 'Thermodynamics One-Shot Notes',             notesUrl: 'https://drive.google.com/file/d/19m9zgH2zxXo_3Ahu3lD3fHUj1ANjner3/view',  category: 'Physical Chemistry', chapter: 'Thermodynamics' },
    { id: 'static-amines-quick-notes',              title: 'Amines Quick Notes',                        notesUrl: 'https://drive.google.com/file/d/1FjamUxwaq9S3or2Twh6_kKUgm9Gr0OhS/view',  category: 'Organic Chemistry',  chapter: 'Amines' },
    { id: 'static-aromatic-compounds-notes',        title: 'Aromatic Compounds Notes',                  notesUrl: 'https://drive.google.com/file/d/1D3vi4xDTEbHmTR1cq16mYM4Ropu1n7AR/view',  category: 'Organic Chemistry',  chapter: 'Aromatic Compounds' },
    { id: 'static-states-of-matter-notes',          title: 'States of Matter Notes',                    notesUrl: 'https://drive.google.com/file/d/1izBYnungBmwEZndprnLpYMdyY2YTclUO/view',  category: 'Physical Chemistry', chapter: 'States of Matter' },
];

// ─── Slug helpers ─────────────────────────────────────────────────────────────
function slugify(text) {
    return String(text)
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Map free-text chapter name → folder slug. We rely on a small inline map
// rather than importing chapterMetadata.ts (which is TypeScript) so this
// script stays node-runnable without a build step.
function chapterFolderSlug(chapter) {
    if (!chapter) return 'misc';
    return slugify(chapter);
}

function extractDriveFileId(url) {
    if (!url) return null;
    const patterns = [
        /\/file\/d\/([a-zA-Z0-9_-]+)/,
        /[?&]id=([a-zA-Z0-9_-]+)/,
        /\/d\/([a-zA-Z0-9_-]+)/,
    ];
    for (const p of patterns) {
        const m = url.match(p);
        if (m) return m[1];
    }
    return null;
}

// ─── CSV parsing (matches the parser in handwrittenNotesData.ts) ──────────────
function parseCSVRobust(text) {
    const result = [];
    let row = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const next = text[i + 1];
        if (ch === '"') {
            if (inQuotes && next === '"') { current += '"'; i++; }
            else { inQuotes = !inQuotes; }
        } else if (ch === ',' && !inQuotes) {
            row.push(current.trim()); current = '';
        } else if ((ch === '\r' || ch === '\n') && !inQuotes) {
            if (ch === '\r' && next === '\n') i++;
            row.push(current.trim());
            if (row.some((c) => c.length > 0)) result.push(row);
            row = []; current = '';
        } else {
            current += ch;
        }
    }
    if (current || row.length > 0) {
        row.push(current.trim());
        if (row.some((c) => c.length > 0)) result.push(row);
    }
    return result;
}

// Mirror classifyChapter() from handwrittenNotesData.ts so we can pre-classify
// CSV rows into folder slugs — keeps the R2 layout consistent with the UI.
const CHAPTER_RULES = [
    { keywords: /solid state|crystal|energetics of crystal/i, chapter: 'Solid State' },
    { keywords: /coordination/i,                                chapter: 'Coordination Compounds' },
    { keywords: /chemical bonding|bonding/i,                    chapter: 'Chemical Bonding' },
    { keywords: /salt analysis|qualitative/i,                   chapter: 'Salt Analysis' },
    { keywords: /\bp[\s-]?block\b|structures of p/i,            chapter: 'p-Block' },
    { keywords: /\bs[\s-]?block\b/i,                            chapter: 's-Block' },
    { keywords: /d and f block|d & f block|d-block|f-block/i,   chapter: 'd & f Block' },
    { keywords: /periodic propert|periodic table/i,             chapter: 'Periodic Properties' },
    { keywords: /atomic structure/i,                            chapter: 'Atomic Structure' },
    { keywords: /mole concept/i,                                chapter: 'Mole Concept' },
    { keywords: /hydrogen(?!\s*bond)/i,                         chapter: 'Hydrogen' },
    { keywords: /amino acid|biomolecule|polymer|carbohydrate|protein/i, chapter: 'Biomolecules & Polymers' },
    { keywords: /name reaction/i,                               chapter: 'Name Reactions' },
    { keywords: /tautomer/i,                                    chapter: 'GOC & Mechanisms' },
    { keywords: /general organic|\bGOC\b|before goc/i,          chapter: 'GOC & Mechanisms' },
    { keywords: /practical|chromatography|preparation of organic/i, chapter: 'Practical Chemistry' },
    { keywords: /free radical|haloalkane|alkyl halide|hydrocarbon/i, chapter: 'Hydrocarbons & Halides' },
    { keywords: /surface chemistry/i,                           chapter: 'Surface Chemistry' },
    { keywords: /electrochemistry|electrolysis|faraday|nernst|galvanic|kohlrausch/i, chapter: 'Electrochemistry' },
    { keywords: /\bsolutions\b|colligative|raoult|osmotic|van.?t hoff/i, chapter: 'Solutions' },
    { keywords: /chemical kinetics|kinetics|rate law|half.?life|arrhenius/i, chapter: 'Chemical Kinetics' },
    { keywords: /metallurgy|ores?|smelting|refining|ellingham/i, chapter: 'Metallurgy' },
    { keywords: /environmental chemistry|pollution|smog|ozone depletion/i, chapter: 'Environmental Chemistry' },
    { keywords: /states? of matter|kinetic theory|gas law|ideal gas|van der waals/i, chapter: 'States of Matter' },
    { keywords: /aromatic|benzene|electrophilic substitution|\bEAS\b/i, chapter: 'Aromatic Compounds' },
    { keywords: /solubility|ionic equilib|equilibrium/i,        chapter: 'Ionic Equilibrium' },
];
function classifyChapter(title) {
    for (const rule of CHAPTER_RULES) if (rule.keywords.test(title)) return rule.chapter;
    return 'Other';
}

// Coarse subject-category fallback for sheet rows whose Category column we
// haven't round-tripped through the migration. Mirrors the four-bucket scheme
// the UI uses (Organic / Inorganic / Physical / General chemistry).
const CHAPTER_TO_CATEGORY = {
    'Solid State': 'Physical Chemistry',
    'Coordination Compounds': 'Inorganic Chemistry',
    'Chemical Bonding': 'Inorganic Chemistry',
    'Salt Analysis': 'Inorganic Chemistry',
    'p-Block': 'Inorganic Chemistry',
    's-Block': 'Inorganic Chemistry',
    'd & f Block': 'Inorganic Chemistry',
    'Periodic Properties': 'Inorganic Chemistry',
    'Atomic Structure': 'Physical Chemistry',
    'Mole Concept': 'Physical Chemistry',
    'Hydrogen': 'Inorganic Chemistry',
    'Biomolecules & Polymers': 'Organic Chemistry',
    'Name Reactions': 'Organic Chemistry',
    'GOC & Mechanisms': 'Organic Chemistry',
    'Practical Chemistry': 'Organic Chemistry',
    'Hydrocarbons & Halides': 'Organic Chemistry',
    'Surface Chemistry': 'Physical Chemistry',
    'Electrochemistry': 'Physical Chemistry',
    'Solutions': 'Physical Chemistry',
    'Chemical Kinetics': 'Physical Chemistry',
    'Metallurgy': 'Inorganic Chemistry',
    'Environmental Chemistry': 'Inorganic Chemistry',
    'States of Matter': 'Physical Chemistry',
    'Aromatic Compounds': 'Organic Chemistry',
    'Ionic Equilibrium': 'Physical Chemistry',
};
function chapterToCategory(chapter) {
    return CHAPTER_TO_CATEGORY[chapter] || 'General chemistry';
}

// ─── Drive download ───────────────────────────────────────────────────────────
async function downloadDriveFile(fileId) {
    // Direct download for files <100MB. For larger files Drive returns an
    // intermediate HTML page — we follow the confirm token if present.
    let url = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;

    let res = await fetch(url, { redirect: 'follow' });
    let buf = Buffer.from(await res.arrayBuffer());
    const head = buf.slice(0, 8).toString('utf-8');

    // If we got HTML back, scrape the confirm token and retry
    if (head.startsWith('<!DOCTYPE') || head.startsWith('<html')) {
        const html = buf.toString('utf-8');
        const tokenMatch = html.match(/name="confirm"\s+value="([^"]+)"/) || html.match(/[?&]confirm=([^"&]+)/);
        const uuidMatch = html.match(/name="uuid"\s+value="([^"]+)"/);
        if (tokenMatch) {
            const params = new URLSearchParams({
                id: fileId,
                export: 'download',
                confirm: tokenMatch[1],
            });
            if (uuidMatch) params.append('uuid', uuidMatch[1]);
            url = `https://drive.usercontent.google.com/download?${params.toString()}`;
            res = await fetch(url, { redirect: 'follow' });
            buf = Buffer.from(await res.arrayBuffer());
        }
    }

    // Final sanity check — must be a PDF
    const finalHead = buf.slice(0, 5).toString('utf-8');
    if (finalHead !== '%PDF-') {
        throw new Error(`downloaded content is not a PDF (got "${finalHead}", ${buf.length} bytes)`);
    }
    return buf;
}

// ─── R2 client ────────────────────────────────────────────────────────────────
function buildR2Client() {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    if (!accountId || !accessKeyId || !secretAccessKey) {
        throw new Error('Missing R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY in .env.local');
    }
    return new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId, secretAccessKey },
    });
}

async function uploadToR2(client, key, body) {
    const bucketName = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';
    await client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: body,
        ContentType: 'application/pdf',
        ContentDisposition: 'inline',
        CacheControl: 'public, max-age=31536000, immutable',
        Metadata: { 'migrated-from': 'google-drive', 'uploaded-at': new Date().toISOString() },
    }));
    const publicBase = process.env.R2_PUBLIC_URL || `https://${bucketName}.${process.env.R2_ACCOUNT_ID}.r2.dev`;
    return `${publicBase.replace(/\/$/, '')}/${key}`;
}

async function objectExistsInR2(client, key) {
    const bucketName = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';
    try {
        await client.send(new HeadObjectCommand({ Bucket: bucketName, Key: key }));
        return true;
    } catch {
        return false;
    }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    const args = process.argv.slice(2);
    const isTest = args.includes('--test');
    const isResume = args.includes('--resume');
    const limitArg = args.find((a) => a.startsWith('--limit='));
    const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : null;

    console.log('─'.repeat(60));
    console.log('Handwritten Notes — Drive → R2 migration');
    console.log('─'.repeat(60));

    // Build the work list
    const work = [];

    // 1. STATIC_NOTES
    for (const n of STATIC_NOTES) {
        work.push({
            source: 'static',
            id: n.id,
            title: n.title,
            chapter: n.chapter,
            oldUrl: n.notesUrl,
        });
    }

    // 2. CSV rows (skip if --test, only need 1 entry there)
    if (!isTest) {
        console.log('Fetching Google Sheet CSV…');
        const csvText = await (await fetch(CSV_URL)).text();
        const rows = parseCSVRobust(csvText);
        const dataRows = rows.slice(1); // header
        for (let i = 0; i < dataRows.length; i++) {
            const row = dataRows[i];
            const title = row[0] || '';
            const notesUrl = row[1] || '';
            if (!title || !notesUrl) continue;
            work.push({
                source: 'sheet',
                id: `note-${i + 1}`,
                title,
                chapter: classifyChapter(title),
                oldUrl: notesUrl,
            });
        }
        console.log(`Sheet rows: ${dataRows.length}`);
    }

    // Apply test/limit
    let queue = work;
    if (isTest) queue = work.slice(0, 1);
    else if (limit) queue = work.slice(0, limit);

    console.log(`Total to process: ${queue.length} (of ${work.length} discovered)`);
    console.log('');

    const client = buildR2Client();
    const results = [];
    const outDir = path.join(__dirname, 'output');
    fs.mkdirSync(outDir, { recursive: true });

    for (let i = 0; i < queue.length; i++) {
        const item = queue[i];
        const fileId = extractDriveFileId(item.oldUrl);
        if (!fileId) {
            console.log(`  ✗ [${i + 1}/${queue.length}] ${item.title} — could not extract Drive fileId`);
            results.push({ ...item, status: 'error', error: 'no fileId in URL' });
            continue;
        }

        const folder = chapterFolderSlug(item.chapter);
        const filename = `${slugify(item.title)}.pdf`;
        const r2Key = `handwritten-notes/${folder}/${filename}`;

        process.stdout.write(`  → [${i + 1}/${queue.length}] ${item.title}\n     ${r2Key} `);

        try {
            // Resume: skip if already in R2
            if (isResume && await objectExistsInR2(client, r2Key)) {
                const publicBase = process.env.R2_PUBLIC_URL || `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.dev`;
                const newUrl = `${publicBase.replace(/\/$/, '')}/${r2Key}`;
                process.stdout.write('(already in R2, skipped)\n');
                results.push({ ...item, fileId, r2Key, newUrl, status: 'skipped' });
                continue;
            }

            const buf = await downloadDriveFile(fileId);
            const newUrl = await uploadToR2(client, r2Key, buf);
            process.stdout.write(`(${(buf.length / 1024).toFixed(0)} KB)\n     ✓ ${newUrl}\n`);
            results.push({ ...item, fileId, r2Key, newUrl, sizeBytes: buf.length, status: 'ok' });
        } catch (err) {
            process.stdout.write('\n');
            console.log(`     ✗ ${err.message}`);
            results.push({ ...item, fileId, r2Key, status: 'error', error: err.message });
        }
    }

    // Persist results
    fs.writeFileSync(path.join(outDir, 'migration_results.json'), JSON.stringify(results, null, 2));

    // Build STATIC_NOTES replacement snippet
    const staticOk = results.filter((r) => r.source === 'static' && r.status === 'ok' || r.source === 'static' && r.status === 'skipped');
    const staticSnippet = staticOk.map((r) => {
        const original = STATIC_NOTES.find((s) => s.id === r.id);
        if (!original) return '';
        // Preserve the original Drive thumbnail — Drive files aren't being deleted,
        // so the existing /thumbnail?id=... URL will keep working. When you later
        // generate R2-hosted cover images, swap this field.
        const driveFileId = extractDriveFileId(original.notesUrl);
        const thumbnailUrl = driveFileId
            ? `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w480`
            : null;
        return `    {
        id: '${original.id}',
        title: ${JSON.stringify(original.title)},
        notesUrl: ${JSON.stringify(r.newUrl)},
        category: ${JSON.stringify(original.category)},
        chapter: ${JSON.stringify(original.chapter)},
        thumbnailUrl: ${thumbnailUrl ? JSON.stringify(thumbnailUrl) : 'null'},
        addedOrder: ${(99999 - STATIC_NOTES.findIndex((s) => s.id === r.id))},
    },`;
    }).join('\n');
    fs.writeFileSync(path.join(outDir, 'static_notes_updated.txt'), staticSnippet);

    // Build sheet-update CSV (kept as a fallback if the Sheet is still in use)
    const sheetOk = results.filter((r) => r.source === 'sheet' && (r.status === 'ok' || r.status === 'skipped'));
    const csvHeader = 'Title,New Notes URL (R2)\n';
    const csvBody = sheetOk
        .map((r) => `"${r.title.replace(/"/g, '""')}","${r.newUrl}"`)
        .join('\n');
    fs.writeFileSync(path.join(outDir, 'sheet_updates.csv'), csvHeader + csvBody);

    // Build the unified static TypeScript array — drop-in replacement for the
    // STATIC_NOTES + CSV-fetch combination in app/lib/handwrittenNotesData.ts.
    // Once this is in place, we can delete the Google Sheet dependency entirely.
    const allOk = results.filter((r) => r.status === 'ok' || r.status === 'skipped');

    // Preserve original ordering: static entries get high addedOrder, sheet
    // entries get values based on their CSV row position.
    const sheetEntries = allOk.filter((r) => r.source === 'sheet');
    const totalSheetRows = sheetEntries.length;

    const tsEntries = allOk.map((r) => {
        const driveFileId = r.fileId;
        const thumbnailUrl = driveFileId
            ? `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w480`
            : null;

        let category;
        if (r.source === 'static') {
            const original = STATIC_NOTES.find((s) => s.id === r.id);
            category = original ? original.category : 'General chemistry';
        } else {
            // For sheet rows the original CSV captured a Category column we don't
            // currently round-trip; fall back to classifier-derived chapter mapped
            // to a coarse subject. This is a best-effort guess — review before
            // committing if any notes look mis-tagged.
            category = chapterToCategory(r.chapter);
        }

        let addedOrder;
        if (r.source === 'static') {
            addedOrder = 99999 - STATIC_NOTES.findIndex((s) => s.id === r.id);
        } else {
            // Sheet rows: most recent (highest index in CSV) gets the highest
            // ordinal — same convention as the previous fetch logic.
            const idxInSheet = sheetEntries.findIndex((s) => s.id === r.id);
            addedOrder = totalSheetRows - idxInSheet;
        }

        return `    {
        id: ${JSON.stringify(r.id)},
        title: ${JSON.stringify(r.title)},
        notesUrl: ${JSON.stringify(r.newUrl)},
        category: ${JSON.stringify(category)},
        chapter: ${JSON.stringify(r.chapter)},
        thumbnailUrl: ${thumbnailUrl ? JSON.stringify(thumbnailUrl) : 'null'},
        addedOrder: ${addedOrder},
    },`;
    }).join('\n');

    const tsFile = `// Auto-generated by scripts/migrate_handwritten_notes_to_r2.js
// Do NOT edit blindly — this is the canonical list of handwritten notes.
// To add/remove a note: upload PDF to R2 under handwritten-notes/{chapter-slug}/,
// then add an entry to this array.

import type { HandwrittenNote } from './handwrittenNotesData';

export const NOTES: HandwrittenNote[] = [
${tsEntries}
];
`;
    fs.writeFileSync(path.join(outDir, 'notes_data_unified.ts'), tsFile);

    // Summary
    const ok = results.filter((r) => r.status === 'ok').length;
    const skipped = results.filter((r) => r.status === 'skipped').length;
    const failed = results.filter((r) => r.status === 'error').length;
    console.log('');
    console.log('─'.repeat(60));
    console.log(`Results: ${ok} uploaded · ${skipped} skipped · ${failed} failed`);
    console.log('Output written to scripts/output/');
    console.log('─'.repeat(60));
    if (failed > 0) process.exitCode = 1;
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
