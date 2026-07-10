'use strict';
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

const CH1 = ['what-is-social-science', 'indias-roots-in-social-thinking', 'four-disciplines-one-society', 'geography-the-study-of-place', 'history-the-study-of-the-past', 'how-historians-know-the-past', 'political-science-power-and-governance', 'economics-choices-and-resources', 'why-social-science-matters'];
const CH2 = ['plate-tectonics-earths-moving-crust', 'plate-boundaries-earthquakes-and-volcanoes', 'weathering-breaking-rock-in-place', 'erosion-and-indias-ancient-water-wisdom', 'agents-of-gradation-and-landforms-in-history', 'rivers-waterfalls-meanders-and-deltas', 'coastal-landforms-beaches-cliffs-and-stacks', 'glacial-landforms-and-moraines', 'wind-landforms-deserts-dunes-and-oases', 'underground-water-caves-and-karst-landscapes', 'landforms-and-disasters', 'shaping-the-earths-surface-toolkit'];

function extractText(b) {
  switch (b.type) {
    case 'heading': return `### ${b.text}`;
    case 'text': return b.markdown;
    case 'curiosity_prompt': return `[CURIOSITY] ${b.prompt}${b.hint ? ' | hint: ' + b.hint : ''}${b.reveal ? ' | reveal: ' + b.reveal : ''}`;
    case 'reasoning_prompt': return `[REASONING] ${b.prompt}${b.reveal ? ' | reveal: ' + b.reveal : ''}`;
    case 'callout': return `[CALLOUT:${b.variant || 'default'}] ${b.title || ''}\n${b.body || b.markdown || ''}`;
    case 'guided_reveal': return `[GUIDED_REVEAL] ${b.title || ''}\n` + (b.cards || b.steps || []).map((c) => `  - ${c.title || c.label || ''}: ${c.text || c.description || c.body || ''}`).join('\n');
    case 'timeline': return `[TIMELINE] ${b.title || ''}\n` + (b.events || []).map((e) => `  - ${e.label}: ${e.detail || ''}`).join('\n');
    case 'inline_quiz': return `[QUIZ] ` + (b.questions || []).map((q) => `Q: ${q.question}`).join(' | ');
    case 'meet_a_scientist': return `[PROFILE] ${b.name}: ${b.contribution}`;
    case 'perspective_scenario': return `[SCENARIO] ${b.title}\n${b.event_context || ''}`;
    case 'comparison_card': return `[COMPARE] ` + JSON.stringify(b.columns || []);
    case 'career_spotlight': return `[CAREERS] ` + (b.careers || []).map((c) => c.role).join(', ');
    case 'interactive_image': return `[INTERACTIVE_IMAGE] ${b.caption || ''} hotspots: ` + (b.hotspots || []).map((h) => h.label).join(', ');
    default: return null;
  }
}

async function main() {
  await bw.withDb(async (db) => {
    for (const [chName, slugs] of [['CHAPTER 1', CH1], ['CHAPTER 2', CH2]]) {
      console.log(`\n\n========== ${chName} ==========`);
      for (const slug of slugs) {
        const p = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
        if (!p) { console.log(`!! MISSING: ${slug}`); continue; }
        console.log(`\n---- PAGE: ${slug} ----`);
        for (const b of p.blocks) {
          const t = extractText(b);
          if (t) console.log(t + '\n');
        }
      }
    }
  });
}
main().catch((e) => { console.error(e); process.exit(1); });
