// Shared block helpers for the Chemical Equilibrium (Ch.6) page build.
// Each page module exports { page_number, slug, title, subtitle, page_type, build(h) }
// where build(h) returns an array of blocks using the helper API `h` below.
// Order is auto-assigned in call order. The orchestrator (build_chapter.js) calls
// makeHelpers() fresh per page so each page starts at order 0.
const { v4: uuidv4 } = require('uuid');

function makeHelpers() {
  let o = 0;
  return {
    // hero/diagram image. src:'' (founder generates via the ChatGPT pipeline).
    img: (generation_prompt, aspect_ratio = '16:9', caption = '') =>
      ({ id: uuidv4(), type: 'image', order: o++, src: '', aspect_ratio, caption, generation_prompt }),
    // markdown text block (inline LaTeX $...$; chemical eqns in $...$).
    text: (markdown) => ({ id: uuidv4(), type: 'text', order: o++, markdown }),
    // level-2 heading; objective = the §15.2 learning objective for the sub-section.
    heading: (t, objective) => ({ id: uuidv4(), type: 'heading', order: o++, text: t, level: 2, ...(objective ? { objective } : {}) }),
    // callout. variant: 'fun_fact' | 'remember' | 'exam_tip' | 'note' | 'warning'
    callout: (variant, title, markdown) => ({ id: uuidv4(), type: 'callout', order: o++, variant, title, markdown }),
    // open-ended food-for-thought (opener / where zero prior knowledge needed).
    curiosity: (prompt, hint, reveal) => ({ id: uuidv4(), type: 'curiosity_prompt', order: o++, prompt, ...(hint ? { hint } : {}), ...(reveal ? { reveal } : {}) }),
    // mid-page reasoning checkpoint. reasoning_type: 'logical'|'quantitative'|'analogical'|'spatial'
    reasoning: (reasoning_type, prompt, options, reveal, difficulty_level) =>
      ({ id: uuidv4(), type: 'reasoning_prompt', order: o++, reasoning_type, prompt, options, reveal, difficulty_level }),
    // NCERT solved example. variant: 'solved_example' | 'ncert_intext'. reveal_mode: 'tap_to_reveal' | 'always_visible'
    worked: (label, variant, problem, solution, reveal_mode = 'tap_to_reveal') =>
      ({ id: uuidv4(), type: 'worked_example', order: o++, label, variant, problem, solution, reveal_mode }),
    // simulation block (predict-first). prediction optional {prompt, options[], reveal_after}
    sim: (simulation_id, title, prediction) =>
      ({ id: uuidv4(), type: 'simulation', order: o++, simulation_id, title, ...(prediction ? { prediction } : {}) }),
    // end-of-page quiz. questions: [{question, options[], correct_index, explanation}]
    quiz: (questions, pass_threshold = 0.6) =>
      ({ id: uuidv4(), type: 'inline_quiz', order: o++, pass_threshold, questions: questions.map(q => ({ id: uuidv4(), ...q })) }),
    // section-navigated practice bank. sections: [{id,title,blurb?,items:[{kind,id,source,source_label?,prompt, ...}]}]
    // mcq item: {kind:'mcq', options[], correct_index, explanation}; numerical item: {kind:'numerical', answer?, solution}
    bank: (title, intro, sections) =>
      ({ id: uuidv4(), type: 'practice_bank', order: o++, title, intro, sections }),
    // p-block group elements — buttons that expand into element detail cards.
    // element_symbols: ['N','P','As','Sb','Bi']. Reads shared elementsData.
    groupElements: (title, intro, element_symbols) =>
      ({ id: uuidv4(), type: 'group_elements', order: o++, title, intro, element_symbols }),
    // data table. headers: string[]; rows: string[][]; caption optional.
    table: (headers, rows, caption) =>
      ({ id: uuidv4(), type: 'table', order: o++, headers, rows, ...(caption ? { caption } : {}) }),
    // end-of-page Quick Recap — organised into spaced, labelled groups so it
    // scans cleanly for revision. groups: [{label, text}]. Renders each as a
    // bold-led paragraph with breathing room (not a dense bullet dump).
    recap: (groups) =>
      ({ id: uuidv4(), type: 'callout', order: o++, variant: 'remember', title: '⚡ Quick Recap',
        markdown: groups.map((g) => `**${g.label}** — ${g.text}`).join('\n\n') }),
  };
}

module.exports = { makeHelpers, uuidv4 };
