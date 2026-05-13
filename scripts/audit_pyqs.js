/**
 * scripts/audit_pyqs.js
 *
 * READ-ONLY audit of the Crucible questions_v2 collection. Counts PYQs
 * across every detection field in the schema, chapter by chapter, to
 * identify tagging gaps.
 *
 * Run: `node scripts/audit_pyqs.js`
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const CHEMISTRY_CHAPTERS = [
    { id: 'ch11_mole',         name: 'Mole Concept'                  },
    { id: 'ch11_atom',         name: 'Atomic Structure'              },
    { id: 'ch11_periodic',     name: 'Periodicity'                   },
    { id: 'ch11_bonding',      name: 'Chemical Bonding'              },
    { id: 'ch11_thermo',       name: 'Thermodynamics'                },
    { id: 'ch11_chem_eq',      name: 'Chemical Equilibrium'          },
    { id: 'ch11_ionic_eq',     name: 'Ionic Equilibrium'             },
    { id: 'ch11_redox',        name: 'Redox'                         },
    { id: 'ch11_pblock',       name: 'P-Block (11)'                  },
    { id: 'ch11_goc',          name: 'GOC'                           },
    { id: 'ch11_hydrocarbon',  name: 'Hydrocarbons'                  },
    { id: 'ch11_prac_org',     name: 'Practical Organic'             },
    { id: 'ch12_solutions',    name: 'Solutions'                     },
    { id: 'ch12_electrochem',  name: 'Electrochemistry'              },
    { id: 'ch12_kinetics',     name: 'Chemical Kinetics'             },
    { id: 'ch12_pblock',       name: 'P-Block (12)'                  },
    { id: 'ch12_dblock',       name: 'd & f-Block'                   },
    { id: 'ch12_coord',        name: 'Coordination Compounds'        },
    { id: 'ch12_haloalkanes',  name: 'Haloalkanes & Haloarenes'      },
    { id: 'ch12_alcohols',     name: 'Alcohols, Phenols & Ethers'    },
    { id: 'ch12_carbonyl',     name: 'Aldehydes, Ketones, Acids'     },
    { id: 'ch12_amines',       name: 'Amines'                        },
    { id: 'ch12_biomolecules', name: 'Biomolecules'                  },
    { id: 'ch12_salt',         name: 'Salt Analysis'                 },
    { id: 'ch12_prac_phys',    name: 'Practical Physical'            },
];

const CHAPTER_IDS = CHEMISTRY_CHAPTERS.map((c) => c.id);
const NAME_BY_ID = Object.fromEntries(CHEMISTRY_CHAPTERS.map((c) => [c.id, c.name]));

function pad(s, n) {
    return String(s).padEnd(n);
}
function rpad(s, n) {
    return String(s).padStart(n);
}

async function countByChapter(col, baseFilter) {
    const result = await col.aggregate([
        { $match: { ...baseFilter, 'metadata.chapter_id': { $in: CHAPTER_IDS } } },
        { $group: { _id: '$metadata.chapter_id', count: { $sum: 1 } } },
    ]).toArray();
    const map = {};
    for (const ch of CHAPTER_IDS) map[ch] = 0;
    for (const r of result) map[r._id] = r.count;
    map.__total = Object.values(map).reduce((a, b) => a + b, 0);
    return map;
}

function printChapterTable(title, columns) {
    // columns = [{ label, map }, ...] — each map is { chapter_id: count, __total: N }
    console.log(`\n━━━ ${title} ━━━`);
    const headers = ['Chapter', ...columns.map((c) => c.label)];
    console.log(pad(headers[0], 30) + headers.slice(1).map((h) => rpad(h, 14)).join(''));
    console.log('─'.repeat(30 + columns.length * 14));
    for (const ch of CHEMISTRY_CHAPTERS) {
        const row = [pad(ch.name, 30)];
        for (const col of columns) {
            row.push(rpad(col.map[ch.id] || 0, 14));
        }
        console.log(row.join(''));
    }
    console.log('─'.repeat(30 + columns.length * 14));
    const totalRow = [pad('TOTAL', 30)];
    for (const col of columns) {
        totalRow.push(rpad(col.map.__total || 0, 14));
    }
    console.log(totalRow.join(''));
}

async function main() {
    if (!process.env.MONGODB_URI) {
        console.error('FATAL: MONGODB_URI not set in .env.local');
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const col = db.collection('questions_v2');

    // ─── Section 1: All chemistry questions ──────────────────────────
    console.log('\n========== SECTION 1: TOTAL CHEMISTRY INVENTORY ==========');

    const allChem = await countByChapter(col, { deleted_at: null });
    const publishedChem = await countByChapter(col, { deleted_at: null, status: 'published' });
    const reviewChem = await countByChapter(col, { deleted_at: null, status: 'review' });
    const draftChem = await countByChapter(col, { deleted_at: null, status: 'draft' });

    printChapterTable('Total chemistry questions by status', [
        { label: 'All', map: allChem },
        { label: 'Published', map: publishedChem },
        { label: 'Review', map: reviewChem },
        { label: 'Draft', map: draftChem },
    ]);

    // ─── Section 2: Type breakdown ──────────────────────────
    console.log('\n========== SECTION 2: QUESTION TYPE DISTRIBUTION ==========');
    const typeAgg = await col.aggregate([
        { $match: { deleted_at: null, 'metadata.chapter_id': { $in: CHAPTER_IDS } } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]).toArray();
    console.log(pad('Type', 12) + rpad('Count', 10));
    console.log('─'.repeat(22));
    for (const r of typeAgg) {
        console.log(pad(r._id || '(null)', 12) + rpad(r.count, 10));
    }

    // ─── Section 3: PYQ detection by EVERY known field ──────────────────────────
    console.log('\n========== SECTION 3: PYQ DETECTION COUNTS (chemistry, deleted_at:null) ==========');

    const baseChem = { deleted_at: null };

    // 3a. Modern fields
    const examDetailsJeeMain  = await countByChapter(col, { ...baseChem, 'metadata.examDetails.exam': 'JEE_Main' });
    const examDetailsJeeAdv   = await countByChapter(col, { ...baseChem, 'metadata.examDetails.exam': 'JEE_Advanced' });
    const examDetailsNeetUG   = await countByChapter(col, { ...baseChem, 'metadata.examDetails.exam': 'NEET_UG' });
    const sourceTypePYQ       = await countByChapter(col, { ...baseChem, 'metadata.sourceType': 'PYQ' });
    const applicableExamsJEE  = await countByChapter(col, { ...baseChem, 'metadata.applicableExams': 'JEE' });
    const applicableExamsNEET = await countByChapter(col, { ...baseChem, 'metadata.applicableExams': 'NEET' });

    printChapterTable('Modern PYQ-tag fields (per-chapter)', [
        { label: 'examDtls=JEE_Main', map: examDetailsJeeMain },
        { label: 'examDtls=JEE_Adv',  map: examDetailsJeeAdv },
        { label: 'examDtls=NEET_UG',  map: examDetailsNeetUG },
        { label: 'sourceType=PYQ',    map: sourceTypePYQ },
    ]);

    printChapterTable('applicableExams field', [
        { label: 'has JEE',  map: applicableExamsJEE },
        { label: 'has NEET', map: applicableExamsNEET },
    ]);

    // 3b. Legacy fields
    const isPyqTrue       = await countByChapter(col, { ...baseChem, 'metadata.is_pyq': true });
    const isTopPyqTrue    = await countByChapter(col, { ...baseChem, 'metadata.is_top_pyq': true });
    const examBoardJEE    = await countByChapter(col, { ...baseChem, 'metadata.examBoard': 'JEE' });
    const examBoardNEET   = await countByChapter(col, { ...baseChem, 'metadata.examBoard': 'NEET' });
    const examSourceExam  = await countByChapter(col, { ...baseChem, 'metadata.exam_source.exam': { $exists: true, $ne: null, $ne: '' } });

    printChapterTable('Legacy PYQ-tag fields', [
        { label: 'is_pyq=true',     map: isPyqTrue },
        { label: 'is_top_pyq=true', map: isTopPyqTrue },
        { label: 'examBoard=JEE',   map: examBoardJEE },
        { label: 'examBoard=NEET',  map: examBoardNEET },
        { label: 'exam_source set', map: examSourceExam },
    ]);

    // ─── Section 4: ANY PYQ detection (union) ──────────────────────────
    console.log('\n========== SECTION 4: UNION DETECTION (any PYQ flag set) ==========');

    const anyPyqFilter = {
        ...baseChem,
        $or: [
            { 'metadata.examDetails.exam': { $exists: true, $ne: null } },
            { 'metadata.sourceType': 'PYQ' },
            { 'metadata.is_pyq': true },
            { 'metadata.is_top_pyq': true },
            { 'metadata.examBoard': { $in: ['JEE', 'NEET', 'BITSAT', 'OLYMPIAD'] } },
            { 'metadata.applicableExams': { $exists: true, $ne: [] } },
            { 'metadata.exam_source.exam': { $exists: true, $ne: null, $ne: '' } },
        ],
    };
    const anyPyq = await countByChapter(col, anyPyqFilter);

    const anyPyqPublished = await countByChapter(col, { ...anyPyqFilter, status: 'published' });

    printChapterTable('Any PYQ flag (union of all detection methods)', [
        { label: 'Any flag', map: anyPyq },
        { label: '+ published', map: anyPyqPublished },
    ]);

    // ─── Section 5: JEE Main union (all detection paths) ──────────────────────────
    console.log('\n========== SECTION 5: JEE MAIN UNION DETECTION ==========');

    // What we'd capture if we accept multiple JEE Main detection paths
    const jeeMainUnionFilter = {
        ...baseChem,
        $or: [
            { 'metadata.examDetails.exam': 'JEE_Main' },
            // Has examBoard=JEE but no exam type specified — could be Main or Advanced
            { 'metadata.examBoard': 'JEE', 'metadata.examDetails.exam': { $exists: false } },
            // applicableExams contains JEE but no specific exam set
            { 'metadata.applicableExams': 'JEE', 'metadata.examDetails.exam': { $exists: false } },
            // legacy exam_source containing "main" (case-insensitive)
            { 'metadata.exam_source.exam': /main/i },
            // is_pyq=true with examBoard=JEE (legacy convention)
            { 'metadata.is_pyq': true, 'metadata.examBoard': 'JEE', 'metadata.examDetails.exam': { $exists: false } },
        ],
    };
    const jeeMainUnion = await countByChapter(col, jeeMainUnionFilter);
    const jeeMainUnionPub = await countByChapter(col, { ...jeeMainUnionFilter, status: 'published' });
    const jeeMainUnionPubScq = await countByChapter(col, { ...jeeMainUnionFilter, status: 'published', type: 'SCQ' });
    const jeeMainUnionPubAllTypes = await countByChapter(col, { ...jeeMainUnionFilter, status: 'published', type: { $in: ['SCQ', 'NVT', 'MCQ', 'AR', 'MTC', 'MST'] } });

    printChapterTable('JEE Main detection variants', [
        { label: 'Union (all)',  map: jeeMainUnion },
        { label: '+ published',  map: jeeMainUnionPub },
        { label: '+ SCQ only',   map: jeeMainUnionPubScq },
        { label: '+ all types',  map: jeeMainUnionPubAllTypes },
    ]);

    // ─── Section 6: tagging gap analysis ──────────────────────────
    console.log('\n========== SECTION 6: TAGGING GAP ANALYSIS ==========');

    // Questions with ANY PYQ signal but missing examDetails.exam (modern field)
    const pyqMissingModern = await countByChapter(col, {
        ...baseChem,
        $or: [
            { 'metadata.is_pyq': true },
            { 'metadata.is_top_pyq': true },
            { 'metadata.examBoard': { $in: ['JEE', 'NEET', 'BITSAT'] } },
            { 'metadata.exam_source.exam': { $exists: true, $ne: null, $ne: '' } },
            { 'metadata.applicableExams': { $exists: true, $ne: [] } },
        ],
        'metadata.examDetails.exam': { $exists: false },
    });

    // Questions with ANY PYQ signal but missing year
    const pyqMissingYear = await countByChapter(col, {
        ...baseChem,
        $or: [
            { 'metadata.is_pyq': true },
            { 'metadata.examDetails.exam': { $exists: true, $ne: null } },
            { 'metadata.exam_source.exam': { $exists: true, $ne: null, $ne: '' } },
        ],
        'metadata.examDetails.year': { $exists: false },
        'metadata.exam_source.year': { $exists: false },
    });

    printChapterTable('Tagging gaps', [
        { label: 'Has PYQ flag, no examDetails.exam',      map: pyqMissingModern },
        { label: 'Has PYQ flag, no year set',              map: pyqMissingYear },
    ]);

    // ─── Section 7: Detailed sample of a high-volume chapter ──────────────────────────
    console.log('\n========== SECTION 7: SAMPLE — SHOW UNTAGGED PYQs FROM A HIGH-VOLUME CHAPTER ==========');
    const sampleChapter = 'ch11_goc';
    const sample = await col.find(
        {
            'metadata.chapter_id': sampleChapter,
            deleted_at: null,
            $or: [
                { 'metadata.is_pyq': true },
                { 'metadata.examBoard': 'JEE' },
                { 'metadata.exam_source.exam': { $exists: true, $ne: null, $ne: '' } },
            ],
            'metadata.examDetails.exam': { $exists: false },
        },
        { projection: { display_id: 1, status: 1, type: 1, 'metadata.is_pyq': 1, 'metadata.is_top_pyq': 1, 'metadata.examBoard': 1, 'metadata.applicableExams': 1, 'metadata.exam_source': 1, 'metadata.sourceType': 1 } }
    ).limit(10).toArray();

    console.log(`\nSample of up to 10 ${sampleChapter} questions with legacy PYQ flags but no examDetails.exam:`);
    for (const q of sample) {
        console.log(`  ${q.display_id} | status=${q.status} | type=${q.type} | is_pyq=${q.metadata?.is_pyq} | is_top_pyq=${q.metadata?.is_top_pyq} | examBoard=${q.metadata?.examBoard} | applicableExams=${JSON.stringify(q.metadata?.applicableExams)} | exam_source=${JSON.stringify(q.metadata?.exam_source)} | sourceType=${q.metadata?.sourceType}`);
    }
    if (sample.length === 0) {
        console.log('  (none found)');
    }

    await mongoose.disconnect();
    console.log('\n✓ Audit complete.');
}

main().catch((err) => {
    console.error('FATAL:', err);
    process.exit(1);
});
