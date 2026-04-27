#!/usr/bin/env node
/**
 * Regenerate taxonomy-snapshot.json from the project's taxonomy file.
 *
 * Run on THIS Mac (the one with the full project) whenever new chapters or tags
 * are added. The snapshot is what the other Mac validates against — keep it in
 * sync by re-running this and copying the updated tools/question-ingestion/
 * folder to the other system.
 *
 *   node tools/question-ingestion/refresh-taxonomy-snapshot.js
 */

const fs = require('fs');
const path = require('path');

const TAXONOMY_PATH = path.resolve(
    __dirname,
    '../../app/crucible/admin/taxonomy/taxonomyData_from_csv.ts'
);
const SNAPSHOT_PATH = path.resolve(__dirname, 'taxonomy-snapshot.json');

if (!fs.existsSync(TAXONOMY_PATH)) {
    console.error(`Cannot find taxonomy at ${TAXONOMY_PATH}.`);
    console.error('This script must be run from a full project clone (not from a stripped-down ingestion-only system).');
    process.exit(1);
}

const src = fs.readFileSync(TAXONOMY_PATH, 'utf-8');

// Extract { id, parent_id, type } triples for chapter + topic nodes only.
// Robust enough since taxonomyData_from_csv.ts is a flat array of literal objects.
const nodes = [];
const re = /\{\s*id:\s*['"]([\w-]+)['"]\s*,[^}]*?parent_id:\s*(?:['"]([\w-]+)['"]|null)[^}]*?type:\s*['"](chapter|topic|micro_topic)['"]/g;
let m;
while ((m = re.exec(src)) !== null) {
    nodes.push({ id: m[1], parent_id: m[2] || null, type: m[3] });
}

const chapters = nodes.filter(n => n.type === 'chapter').map(n => n.id);
const topics = nodes.filter(n => n.type === 'topic');

// chapter_id → array of valid tag_ids belonging to that chapter
const tagsByChapter = {};
for (const c of chapters) tagsByChapter[c] = [];
for (const t of topics) {
    if (t.parent_id && tagsByChapter[t.parent_id]) {
        tagsByChapter[t.parent_id].push(t.id);
    }
}

const snapshot = {
    generated_at: new Date().toISOString(),
    chapters: chapters.sort(),
    tags: topics.map(t => t.id).sort(),
    tagsByChapter,
};

fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2) + '\n');

console.log(`Wrote ${SNAPSHOT_PATH}`);
console.log(`  chapters: ${snapshot.chapters.length}`);
console.log(`  tags:     ${snapshot.tags.length}`);
console.log(`\nCopy tools/question-ingestion/ to the other Mac to sync.`);
