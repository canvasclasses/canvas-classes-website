/**
 * scripts/export_goc_pyq_quiz.js
 *
 * READ-ONLY export script.
 *
 * Pulls 30 star-marked JEE Main PYQ questions from the Crucible
 * questions_v2 collection (chapter_id = 'ch11_goc') and writes a
 * static QuizData module at:
 *
 *   app/lib/quizzes/general-organic-chemistry-mcq.data.ts
 *
 * The Crucible database is NOT modified. Only `.find()` reads are issued.
 *
 * To re-run: `node scripts/export_goc_pyq_quiz.js`
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// ─── Configuration ──────────────────────────────────────────────────────────

const TARGET_DISTRIBUTION = {
    tag_goc_1: 3,
    tag_goc_2: 4,
    tag_goc_3: 4,
    tag_goc_4: 4,
    tag_goc_5: 2,
    tag_goc_6: 2,
    tag_goc_7: 2,
    tag_goc_8: 4,
    tag_goc_9: 2,
    tag_goc_10: 2,
    tag_goc_11: 1,
};

const TAG_LABELS = {
    tag_goc_1: 'Classification & IUPAC Naming',
    tag_goc_2: 'Electronic Effects',
    tag_goc_3: 'Acidity & Basicity',
    tag_goc_4: 'Reaction Intermediates',
    tag_goc_5: 'Electrophiles, Nucleophiles & Basic Terms',
    tag_goc_6: 'Structural Isomerism & Tautomerism',
    tag_goc_7: 'Geometrical Isomerism',
    tag_goc_8: 'Optical Isomerism & Chirality',
    tag_goc_9: 'Conformational Isomerism',
    tag_goc_10: "Aromaticity (Hückel's Rule)",
    tag_goc_11: 'Allenes, Atropisomers & Spiro Compounds',
};

const TAG_ORDER = Object.keys(TARGET_DISTRIBUTION);

// ─── Helpers ────────────────────────────────────────────────────────────────

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

/**
 * Convert any value into a TS string literal. JSON.stringify handles
 * backslash escaping, control chars, quotes and unicode for us.
 */
function tsString(s) {
    if (typeof s !== 'string') return '""';
    return JSON.stringify(s);
}

/**
 * Normalise the Crucible options array into the QuizData option shape
 * (ids 'a','b','c','d' in document order).
 */
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

/**
 * Pretty-print a single question object as TS source.
 */
function questionToTS(qIndex, q, primaryTag) {
    const opts = normaliseOptions(q.options);
    if (!opts) return null;

    const lines = [];
    lines.push('        {');
    lines.push(`            id: ${qIndex},`);
    lines.push(`            topic: ${tsString(TAG_LABELS[primaryTag])},`);
    lines.push(`            difficulty: ${tsString(difficultyLabel(q.metadata?.difficultyLevel))},`);
    lines.push(`            sourceTrendIds: [],`);
    lines.push(`            sourceCrucibleDisplayId: ${tsString(q.display_id)},`);

    const exam = q.metadata?.examDetails?.exam;
    const year = q.metadata?.examDetails?.year;
    const shift = q.metadata?.examDetails?.shift;
    if (exam || year || shift) {
        const pyqParts = [];
        if (exam) pyqParts.push(`exam: ${tsString(exam)}`);
        if (typeof year === 'number') pyqParts.push(`year: ${year}`);
        if (shift) pyqParts.push(`shift: ${tsString(shift)}`);
        lines.push(`            sourcePYQ: { ${pyqParts.join(', ')} },`);
    }

    lines.push(`            stem: ${tsString(q.question_text?.markdown || '')},`);
    lines.push('            options: [');
    for (const opt of opts.options) {
        lines.push(`                { id: ${tsString(opt.id)}, text: ${tsString(opt.text)} },`);
    }
    lines.push('            ],');
    lines.push(`            answerId: ${tsString(opts.answerId)},`);
    lines.push(`            explanation: ${tsString(q.solution?.text_markdown || '')},`);
    lines.push('        },');
    return lines.join('\n');
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
    if (!process.env.MONGODB_URI) {
        console.error('FATAL: MONGODB_URI is not set in .env.local');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const col = db.collection('questions_v2');

    // Filter: GOC + star-marked + JEE Main PYQ + published + SCQ
    // examDetails.exam takes precedence (modern field). We OR with legacy
    // fields so partially-migrated data still matches.
    const baseFilter = {
        'metadata.chapter_id': 'ch11_goc',
        'metadata.is_top_pyq': true,
        status: 'published',
        deleted_at: null,
        type: 'SCQ',
        $or: [
            { 'metadata.examDetails.exam': 'JEE_Main' },
            { 'metadata.applicableExams': 'JEE' },
            { 'metadata.examBoard': 'JEE' },
        ],
    };

    console.log('Filter:');
    console.log(JSON.stringify(baseFilter, null, 2));
    console.log('');

    const all = await col.find(baseFilter).toArray();
    console.log(`Total candidate questions: ${all.length}`);

    // Keep only text-only questions (no asset images) so the export is self-contained.
    const textOnly = all.filter((q) => !q.asset_ids || q.asset_ids.length === 0);
    console.log(`Text-only candidates (no assets): ${textOnly.length}`);

    // Group by primary tag (highest weight in metadata.tags)
    const byTag = {};
    for (const q of textOnly) {
        const tag = getPrimaryTag(q);
        if (!tag) continue;
        if (!byTag[tag]) byTag[tag] = [];
        byTag[tag].push(q);
    }

    console.log('\nAvailable per primary tag:');
    let totalAvailable = 0;
    for (const tagId of TAG_ORDER) {
        const have = byTag[tagId]?.length || 0;
        const want = TARGET_DISTRIBUTION[tagId];
        totalAvailable += have;
        const tagLabel = (TAG_LABELS[tagId] || '').padEnd(45);
        console.log(`  ${tagId.padEnd(12)} ${tagLabel} have ${String(have).padStart(3)}, want ${want}`);
    }
    console.log(`  Total available across tags: ${totalAvailable}`);

    // Sort each bucket by quality_score desc, then difficultyLevel asc
    // (preferring well-vetted, mid-difficulty PYQs).
    for (const tagId of TAG_ORDER) {
        if (!byTag[tagId]) continue;
        byTag[tagId].sort((a, b) => {
            const sa = a.quality_score ?? 0;
            const sb = b.quality_score ?? 0;
            if (sb !== sa) return sb - sa;
            const da = a.metadata?.difficultyLevel ?? 3;
            const db = b.metadata?.difficultyLevel ?? 3;
            return da - db;
        });
    }

    // Greedy pick: take target count from each tag, track shortfall
    const picked = [];
    let shortfall = 0;
    for (const tagId of TAG_ORDER) {
        const want = TARGET_DISTRIBUTION[tagId];
        const bucket = byTag[tagId] || [];
        const take = bucket.slice(0, want);
        for (const q of take) picked.push({ q, tag: tagId });
        if (take.length < want) {
            shortfall += want - take.length;
            console.log(`  ⚠ Shortfall on ${tagId}: needed ${want}, got ${take.length}`);
        }
    }

    // Fill shortfall from any tag with extras
    if (shortfall > 0) {
        console.log(`\nFilling ${shortfall} shortfall from over-supplied tags...`);
        const usedIds = new Set(picked.map((p) => p.q._id));
        const extras = [];
        for (const tagId of TAG_ORDER) {
            const bucket = byTag[tagId] || [];
            for (const q of bucket) {
                if (!usedIds.has(q._id)) extras.push({ q, tag: tagId });
            }
        }
        extras.sort((a, b) => (b.q.quality_score ?? 0) - (a.q.quality_score ?? 0));
        for (const e of extras.slice(0, shortfall)) picked.push(e);
    }

    console.log(`\nFinal picks: ${picked.length} (target 30)`);
    console.log('\nQuestions selected (by tag):');
    for (const p of picked) {
        const stem = (p.q.question_text?.markdown || '').slice(0, 75).replace(/\s+/g, ' ');
        const lvl = p.q.metadata?.difficultyLevel ?? '?';
        const yr = p.q.metadata?.examDetails?.year || p.q.metadata?.exam_source?.year || '----';
        console.log(`  ${p.q.display_id.padEnd(10)} [${p.tag.padEnd(11)}] (lvl ${lvl}, ${yr}) ${stem}...`);
    }

    if (picked.length === 0) {
        console.error('\nFATAL: zero questions matched. Aborting export.');
        await mongoose.disconnect();
        process.exit(1);
    }

    // ─── Build the QuizData TypeScript module ──────────────────────────────

    const fileLines = [];
    fileLines.push("import { QuizData } from './types';");
    fileLines.push('');
    fileLines.push('// 30-question revision quiz on General Organic Chemistry (GOC).');
    fileLines.push('// Sourced from star-marked JEE Main PYQs in the Crucible question bank');
    fileLines.push("// (questions_v2 collection, chapter_id='ch11_goc'). Generated by");
    fileLines.push('// scripts/export_goc_pyq_quiz.js — re-run that script to refresh.');
    fileLines.push('//');
    fileLines.push('// Crucible database is read-only here.');
    fileLines.push('');
    fileLines.push('export const gocJeeMainPyqsQuiz: QuizData = {');
    fileLines.push("    slug: 'general-organic-chemistry-mcq',");
    fileLines.push("    title: 'General Organic Chemistry MCQ for JEE Main Revision',");
    fileLines.push('    description:');
    fileLines.push("        'A 30-question revision quiz on General Organic Chemistry (GOC) — every question is a star-marked JEE Main previous-year question (PYQ) hand-picked by Paaras Sir\\'s team. Covers electronic effects (inductive, resonance, hyperconjugation), acidity and basicity, carbocation/carbanion/free-radical stability, structural and stereo-isomerism, aromaticity, and IUPAC nomenclature. Built for JEE Main, JEE Advanced, NEET and BITSAT aspirants.',");
    fileLines.push("    shortLabel: 'General Organic Chemistry',");
    const today = new Date().toISOString().slice(0, 10);
    fileLines.push(`    datePublished: ${tsString(today)},`);
    fileLines.push(`    dateModified: ${tsString(today)},`);
    fileLines.push("    educationalLevel: 'Class 11',");
    fileLines.push("    targetExams: ['JEE Main', 'JEE Advanced', 'NEET', 'BITSAT'],");
    fileLines.push('    keywords: [');
    [
        'general organic chemistry MCQ',
        'GOC MCQ',
        'GOC quiz',
        'GOC JEE Main PYQ',
        'inductive effect MCQ',
        'hyperconjugation MCQ',
        'resonance effect MCQ',
        'carbocation stability MCQ',
        'IUPAC nomenclature MCQ',
        'acidity basicity organic MCQ',
        'optical isomerism MCQ',
        'aromaticity MCQ',
        'JEE Main organic chemistry quiz',
        'NEET organic chemistry quiz',
    ].forEach((k) => fileLines.push(`        ${tsString(k)},`));
    fileLines.push('    ],');
    fileLines.push('    learningOutcomes: [');
    [
        'Apply electronic effects (Inductive, Mesomeric, Hyperconjugation) to predict stability and reactivity',
        'Compare acidity and basicity across organic compound families using reasoning chains',
        'Rank reaction intermediates (carbocation, carbanion, free radical) by stability',
        'Assign IUPAC names and identify isomerism (structural, geometrical, optical)',
        "Recognise aromaticity using Hückel's rule across charged and neutral systems",
    ].forEach((o) => fileLines.push(`        ${tsString(o)},`));
    fileLines.push('    ],');
    fileLines.push('    questions: [');

    // Group picked questions by tag for ordered emission
    const byTagPicked = {};
    for (const p of picked) {
        if (!byTagPicked[p.tag]) byTagPicked[p.tag] = [];
        byTagPicked[p.tag].push(p.q);
    }

    let qIndex = 1;
    for (const tagId of TAG_ORDER) {
        const bucket = byTagPicked[tagId];
        if (!bucket || bucket.length === 0) continue;
        fileLines.push(`        // ───── ${TAG_LABELS[tagId]} (${bucket.length} questions) ─────`);
        for (const q of bucket) {
            const block = questionToTS(qIndex, q, tagId);
            if (!block) {
                console.error(`  ⚠ Skipping ${q.display_id} — could not normalise options`);
                continue;
            }
            fileLines.push(block);
            qIndex++;
        }
    }
    fileLines.push('    ],');

    fileLines.push('    faqs: [');
    [
        {
            q: 'What is in this General Organic Chemistry MCQ quiz?',
            a: "Thirty multiple-choice questions sourced from star-marked JEE Main previous-year questions (PYQs) in the Canvas Classes Crucible question bank, balanced across the primary topics of GOC: nomenclature, electronic effects, acidity/basicity, reaction intermediates, electrophiles & nucleophiles, structural isomerism, geometrical isomerism, optical isomerism, conformational analysis, aromaticity, and atropisomerism / spiro compounds.",
        },
        {
            q: 'How are these questions different from the rest of the Crucible bank?',
            a: "These are the GOC questions Paaras Sir's team has explicitly star-marked as high-yield JEE Main PYQs — every one of them has appeared in an official JEE Main paper. The full solution and explanation for each is the same one used inside The Crucible practice platform.",
        },
        {
            q: "I'm preparing for NEET. Will these GOC questions still help me?",
            a: "Yes. NEET's organic chemistry overlaps heavily with the JEE Main syllabus for GOC — concepts like inductive effect, hyperconjugation, carbocation stability and IUPAC naming appear in both. The questions are well-suited for NEET revision; the only caveat is that JEE Main questions are slightly more rigorous on stereochemistry and combined-effects reasoning.",
        },
        {
            q: 'Where can I practice more GOC questions?',
            a: "Use The Crucible — Canvas Classes' adaptive practice platform — for the full GOC chapter with hundreds of additional questions, adaptive difficulty, and personalised recommendations based on your strengths and weaknesses.",
        },
        {
            q: 'Should I do this quiz before or after revising the GOC theory?',
            a: "Either works. Practice-first surfaces the gaps in your understanding fast — the explanations then act as targeted revision. Read-first checks how solid your concepts are. If you score below 60%, prioritise re-reading electronic effects, intermediates, and acidity/basicity reasoning before attempting more PYQs.",
        },
    ].forEach((f) => {
        fileLines.push('        {');
        fileLines.push(`            question: ${tsString(f.q)},`);
        fileLines.push(`            answer: ${tsString(f.a)},`);
        fileLines.push('        },');
    });
    fileLines.push('    ],');

    fileLines.push('    relatedLinks: [');
    [
        {
            label: 'The Crucible — GOC Chapter Practice',
            href: '/the-crucible/ch11_goc',
            description: 'Hundreds of additional GOC questions with adaptive difficulty and personalised recommendations.',
        },
        {
            label: 'Inorganic Chemistry Exceptions Quiz',
            href: '/quiz/chemistry/inorganic-exceptions',
            description: 'Companion quiz on the inorganic side — periodic anomalies, inert pair effect, lanthanoid contraction.',
        },
        {
            label: 'P-Block Anomalies Quiz',
            href: '/quiz/chemistry/p-block-anomalies',
            description: '41-question deep-dive into Groups 13–18 — back bonding, inert pair, Fajans rule, oxoacid acidity.',
        },
        {
            label: 'Organic Name Reactions',
            href: '/organic-name-reactions',
            description: 'Reference for all named organic reactions — useful when an explanation cites Aldol, Cannizzaro, Reimer-Tiemann etc.',
        },
    ].forEach((l) => {
        fileLines.push('        {');
        fileLines.push(`            label: ${tsString(l.label)},`);
        fileLines.push(`            href: ${tsString(l.href)},`);
        fileLines.push(`            description: ${tsString(l.description)},`);
        fileLines.push('        },');
    });
    fileLines.push('    ],');
    fileLines.push('};');

    const output = fileLines.join('\n') + '\n';
    const outPath = path.join(__dirname, '..', 'app', 'lib', 'quizzes', 'general-organic-chemistry-mcq.data.ts');
    fs.writeFileSync(outPath, output, 'utf8');
    console.log(`\n✓ Written: ${path.relative(process.cwd(), outPath)} (${output.length} bytes, ${qIndex - 1} questions)`);

    await mongoose.disconnect();
}

main().catch((err) => {
    console.error('FATAL:', err);
    process.exit(1);
});
