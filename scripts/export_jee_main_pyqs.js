/**
 * scripts/export_jee_main_pyqs.js
 *
 * READ-ONLY export script for the public JEE Main PYQ SEO route.
 *
 * Pulls every star-marked JEE Main PYQ across all 25 chemistry chapters
 * from the Crucible questions_v2 collection and writes:
 *
 *   app/lib/jee-main-pyqs/data/manifest.json     — chapter list + counts + slug map
 *   app/lib/jee-main-pyqs/data/<chapter_id>.json — full question data per chapter
 *
 * The Crucible database is NOT modified. Only `.find()` reads are issued.
 *
 * Run: `node scripts/export_jee_main_pyqs.js`
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// ─── Configuration ──────────────────────────────────────────────────────────

// Chemistry chapters — synced from app/crucible/admin/taxonomy/taxonomyData_from_csv.ts.
// Chapter slug is the URL segment — keep stable across builds; if you ever
// rename one, plan a 301 redirect.
const CHEMISTRY_CHAPTERS = [
    { id: 'ch11_mole',         name: 'Some Basic Concepts (Mole Concept)',     slug: 'mole-concept',                              class_level: 11, type: 'physical'  },
    { id: 'ch11_atom',         name: 'Structure of Atom',                       slug: 'structure-of-atom',                         class_level: 11, type: 'physical'  },
    { id: 'ch11_periodic',     name: 'Classification of Elements & Periodicity',slug: 'classification-of-elements-and-periodicity',class_level: 11, type: 'inorganic' },
    { id: 'ch11_bonding',      name: 'Chemical Bonding',                        slug: 'chemical-bonding',                          class_level: 11, type: 'inorganic' },
    { id: 'ch11_thermo',       name: 'Thermodynamics',                          slug: 'thermodynamics',                            class_level: 11, type: 'physical'  },
    { id: 'ch11_chem_eq',      name: 'Chemical Equilibrium',                    slug: 'chemical-equilibrium',                      class_level: 11, type: 'physical'  },
    { id: 'ch11_ionic_eq',     name: 'Ionic Equilibrium',                       slug: 'ionic-equilibrium',                         class_level: 11, type: 'physical'  },
    { id: 'ch11_redox',        name: 'Redox Reactions',                         slug: 'redox-reactions',                           class_level: 11, type: 'physical'  },
    { id: 'ch11_pblock',       name: 'p-Block Elements (Class 11)',             slug: 'p-block-elements-class-11',                 class_level: 11, type: 'inorganic' },
    { id: 'ch11_goc',          name: 'General Organic Chemistry (GOC)',         slug: 'general-organic-chemistry',                 class_level: 11, type: 'organic'   },
    { id: 'ch11_hydrocarbon',  name: 'Hydrocarbons',                            slug: 'hydrocarbons',                              class_level: 11, type: 'organic'   },
    { id: 'ch11_prac_org',     name: 'Practical Organic Chemistry',             slug: 'practical-organic-chemistry',               class_level: 11, type: 'practical' },
    { id: 'ch12_solutions',    name: 'Solutions',                                slug: 'solutions',                                 class_level: 12, type: 'physical'  },
    { id: 'ch12_electrochem',  name: 'Electrochemistry',                         slug: 'electrochemistry',                          class_level: 12, type: 'physical'  },
    { id: 'ch12_kinetics',     name: 'Chemical Kinetics',                        slug: 'chemical-kinetics',                         class_level: 12, type: 'physical'  },
    { id: 'ch12_pblock',       name: 'p-Block Elements (Class 12)',              slug: 'p-block-elements-class-12',                 class_level: 12, type: 'inorganic' },
    { id: 'ch12_dblock',       name: 'd & f-Block Elements',                     slug: 'd-and-f-block-elements',                    class_level: 12, type: 'inorganic' },
    { id: 'ch12_coord',        name: 'Coordination Compounds',                   slug: 'coordination-compounds',                    class_level: 12, type: 'inorganic' },
    { id: 'ch12_haloalkanes',  name: 'Haloalkanes & Haloarenes',                 slug: 'haloalkanes-and-haloarenes',                class_level: 12, type: 'organic'   },
    { id: 'ch12_alcohols',     name: 'Alcohols, Phenols & Ethers',               slug: 'alcohols-phenols-and-ethers',               class_level: 12, type: 'organic'   },
    { id: 'ch12_carbonyl',     name: 'Aldehydes, Ketones & Carboxylic Acids',    slug: 'aldehydes-ketones-and-carboxylic-acids',    class_level: 12, type: 'organic'   },
    { id: 'ch12_amines',       name: 'Amines',                                   slug: 'amines',                                    class_level: 12, type: 'organic'   },
    { id: 'ch12_biomolecules', name: 'Biomolecules',                             slug: 'biomolecules',                              class_level: 12, type: 'organic'   },
    { id: 'ch12_salt',         name: 'Salt Analysis',                            slug: 'salt-analysis',                             class_level: 12, type: 'practical' },
    { id: 'ch12_prac_phys',    name: 'Practical Physical Chemistry',             slug: 'practical-physical-chemistry',              class_level: 12, type: 'practical' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Slugify a string for URL use. Strips LaTeX, image markdown, special
 * chars, collapses whitespace, lowercases, returns at most maxChars.
 */
function slugify(text, maxChars = 80) {
    if (typeof text !== 'string') return '';
    return text
        // Strip image markdown ![alt](url)
        .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
        // Strip dollar-delimited LaTeX
        .replace(/\$[^$]*\$/g, ' ')
        // Strip backslash commands
        .replace(/\\[a-zA-Z]+/g, ' ')
        // Strip remaining non-alphanumerics
        .replace(/[^a-zA-Z0-9\s-]/g, ' ')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, maxChars)
        .replace(/-$/, ''); // trim trailing dash if cut mid-word
}

/**
 * Build the canonical slug for a question — slugified stem + display_id
 * suffix to guarantee uniqueness (avoids collisions on similar stems
 * like "which is the most stable carbocation?" appearing many times).
 */
function buildQuestionSlug(stem, displayId) {
    const stemSlug = slugify(stem, 80);
    const idSlug = slugify(displayId, 20);
    if (!stemSlug && !idSlug) return null;
    if (!stemSlug) return idSlug;
    return `${stemSlug}-${idSlug}`;
}

function getPrimaryTag(question) {
    const tags = question.metadata?.tags;
    if (!Array.isArray(tags) || tags.length === 0) return null;
    const sorted = [...tags].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
    return sorted[0]?.tag_id || null;
}

function difficultyLabel(level) {
    if (typeof level !== 'number') return 'medium';
    if (level <= 2) return 'easy';
    if (level === 3) return 'medium';
    return 'hard';
}

function normaliseOptions(rawOptions) {
    if (!Array.isArray(rawOptions) || rawOptions.length !== 4) return null;
    const letters = ['a', 'b', 'c', 'd'];
    const opts = rawOptions.map((opt, i) => ({
        id: letters[i],
        text: typeof opt.text === 'string' ? opt.text : '',
        is_correct: Boolean(opt.is_correct),
    }));
    if (opts.some((o) => !o.text)) return null;
    const correct = opts.find((o) => o.is_correct);
    if (!correct) return null;
    return {
        options: opts.map((o) => ({ id: o.id, text: o.text })),
        answerId: correct.id,
    };
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
    if (!process.env.MONGODB_URI) {
        console.error('FATAL: MONGODB_URI not set in .env.local');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const col = db.collection('questions_v2');

    const chapterIds = CHEMISTRY_CHAPTERS.map((c) => c.id);

    // Filter: every JEE Main PYQ across chemistry chapters.
    // Canonical PYQ signal: sourceType === 'PYQ' (no longer using legacy is_pyq).
    // Canonical exam attribution: examDetails.exam === 'JEE_Main' (not JEE_Advanced
    // or NEET_UG). Practice questions are explicitly excluded by the sourceType filter.
    const baseFilter = {
        'metadata.chapter_id': { $in: chapterIds },
        'metadata.sourceType': 'PYQ',
        'metadata.examDetails.exam': 'JEE_Main',
        status: 'published',
        deleted_at: null,
        type: 'SCQ',
    };

    console.log('Filter:');
    console.log(JSON.stringify(baseFilter, null, 2));
    console.log('');

    const all = await col.find(baseFilter).toArray();
    console.log(`Total candidate questions: ${all.length}`);

    // Group by chapter
    const byChapter = {};
    for (const ch of CHEMISTRY_CHAPTERS) byChapter[ch.id] = [];
    for (const q of all) {
        const cid = q.metadata?.chapter_id;
        if (cid && byChapter[cid]) byChapter[cid].push(q);
    }

    // Write per-chapter files + build manifest
    const dataDir = path.join(__dirname, '..', 'app', 'lib', 'jee-main-pyqs', 'data');
    fs.mkdirSync(dataDir, { recursive: true });

    // Wipe stale per-chapter files (so deleted-from-bank questions don't linger)
    for (const f of fs.readdirSync(dataDir)) {
        if (f.endsWith('.json')) fs.unlinkSync(path.join(dataDir, f));
    }

    const manifestChapters = [];
    let totalExported = 0;
    let totalSkipped = 0;
    const slugCollisions = [];

    for (const ch of CHEMISTRY_CHAPTERS) {
        const bucket = byChapter[ch.id] || [];
        // Sort by year desc, then quality_score desc — fresher PYQs first
        bucket.sort((a, b) => {
            const ya = a.metadata?.examDetails?.year ?? a.metadata?.exam_source?.year ?? 0;
            const yb = b.metadata?.examDetails?.year ?? b.metadata?.exam_source?.year ?? 0;
            if (yb !== ya) return yb - ya;
            return (b.quality_score ?? 0) - (a.quality_score ?? 0);
        });

        const exported = [];
        const seenSlugs = new Set();
        for (const q of bucket) {
            const opts = normaliseOptions(q.options);
            if (!opts) {
                totalSkipped++;
                continue;
            }
            const slug = buildQuestionSlug(q.question_text?.markdown || '', q.display_id);
            if (!slug) {
                totalSkipped++;
                continue;
            }
            if (seenSlugs.has(slug)) {
                slugCollisions.push({ chapter: ch.id, slug, displayId: q.display_id });
                totalSkipped++;
                continue;
            }
            seenSlugs.add(slug);
            exported.push({
                crucibleId: q._id,
                displayId: q.display_id,
                slug,
                chapterId: ch.id,
                primaryTag: getPrimaryTag(q),
                difficulty: difficultyLabel(q.metadata?.difficultyLevel),
                difficultyLevel: q.metadata?.difficultyLevel ?? 3,
                qualityScore: q.quality_score ?? 0,
                stem: q.question_text?.markdown || '',
                options: opts.options,
                answerId: opts.answerId,
                explanation: q.solution?.text_markdown || '',
                exam: q.metadata?.examDetails?.exam || null,
                examYear: q.metadata?.examDetails?.year ?? q.metadata?.exam_source?.year ?? null,
                examShift: q.metadata?.examDetails?.shift || q.metadata?.exam_source?.shift || null,
            });
        }

        const chapterFile = path.join(dataDir, `${ch.id}.json`);
        fs.writeFileSync(chapterFile, JSON.stringify({ chapterId: ch.id, questions: exported }, null, 0), 'utf8');

        manifestChapters.push({
            id: ch.id,
            name: ch.name,
            slug: ch.slug,
            classLevel: ch.class_level,
            chapterType: ch.type,
            questionCount: exported.length,
            // Store just slugs in manifest for fast generateStaticParams
            questionSlugs: exported.map((q) => q.slug),
        });

        totalExported += exported.length;
        console.log(`  ${ch.id.padEnd(20)} ${ch.name.padEnd(50)} ${String(exported.length).padStart(4)} questions → ${ch.slug}`);
    }

    // Write manifest
    const manifestPath = path.join(dataDir, 'manifest.json');
    const manifest = {
        generatedAt: new Date().toISOString(),
        exam: 'JEE_Main',
        subject: 'chemistry',
        totalQuestions: totalExported,
        chapters: manifestChapters,
    };
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

    console.log('');
    console.log(`✓ Total exported: ${totalExported} questions across ${manifestChapters.length} chapters`);
    if (totalSkipped > 0) {
        console.log(`⚠ Skipped: ${totalSkipped} (bad options, missing slug, or collision)`);
    }
    if (slugCollisions.length > 0) {
        console.log(`⚠ Slug collisions: ${slugCollisions.length}`);
        slugCollisions.slice(0, 5).forEach((c) => console.log(`    ${c.chapter} ${c.displayId} → ${c.slug}`));
    }
    console.log(`✓ Manifest: ${path.relative(process.cwd(), manifestPath)}`);
    console.log(`✓ Data dir: ${path.relative(process.cwd(), dataDir)}`);

    await mongoose.disconnect();
}

main().catch((err) => {
    console.error('FATAL:', err);
    process.exit(1);
});
