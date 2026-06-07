'use strict';
/** Extract analytical blocks' English explainer text (per chapter) for Hinglish twins. */
const fs = require('fs');
const { withBook } = require('./_lib');

(async () => {
  await withBook(async ({ allPages }) => {
    const byCh = {};
    for (const p of allPages) {
      const push = (item) => ((byCh[p.chapter_number] ||= []).push(item));
      for (const b of p.blocks || []) {
        const base = { page_slug: p.slug, block_id: b.id };
        if (b.type === 'literary_devices_highlighter') {
          (b.devices || []).forEach((d, di) => (d.matches || []).forEach((m, mi) => {
            push({ kind: 'device', loc: { ...base, di, mi }, device: d.device, text: m.text, en: m.explanation });
          }));
        } else if (b.type === 'tone_meter') {
          (b.segments || []).forEach((s, si) => push({ kind: 'tone', loc: { ...base, si }, emotion: s.emotion, excerpt: s.excerpt, en: s.note }));
        } else if (b.type === 'cultural_context_card') {
          push({ kind: 'culture', loc: base, reference: b.reference, en: b.detail });
        } else if (b.type === 'theme_explorer') {
          (b.themes || []).forEach((t, ti) => push({ kind: 'theme', loc: { ...base, ti }, title: t.title, en_description: t.description, en_reflection: t.reflection_prompt }));
        } else if (b.type === 'callout' && b.variant === 'literature_in_life') {
          push({ kind: 'lit_in_life', loc: base, title: b.title || '', en: b.markdown });
        }
      }
    }
    let total = 0;
    for (const ch of Object.keys(byCh).sort((a, b) => a - b)) {
      const file = `scripts/kaveri-fix/_ch${ch}_hinglish.json`;
      fs.writeFileSync(file, JSON.stringify(byCh[ch], null, 1));
      const k = {}; byCh[ch].forEach((x) => (k[x.kind] = (k[x.kind] || 0) + 1));
      total += byCh[ch].length;
      console.log(`Ch${ch}: ${byCh[ch].length} items ${JSON.stringify(k)} -> ${file}`);
    }
    console.log('TOTAL analytical items:', total);
  });
})().catch((e) => { console.error(e); process.exit(1); });
