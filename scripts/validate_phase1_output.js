// scripts/validate_phase1_output.js
//
// Pre-Phase-2 validator for question ingestion.
// Catches malformed extractions BEFORE you write the insertion script.
//
// USAGE:
//   1. Paste the Phase 1 output array into a per-chapter buffer file
//      `scripts/_phase1_buffer_<prefix>.js` (e.g. `_phase1_buffer_curr.js`),
//      wrapped:
//        const questions = [ /* paste here */ ];
//        module.exports = { questions };
//      Per-chapter naming avoids collisions when multiple sessions ingest
//      different chapters in parallel.
//   2. Run:
//        node scripts/validate_phase1_output.js scripts/_phase1_buffer_curr.js physics
//
// SUBJECTS: 'physics' | 'chemistry' | 'maths' | 'biology' (default: 'physics')
//
// Exits non-zero on any error. Prints a per-question report.

const path = require('path');

const VALID_TYPES = ['SCQ', 'MCQ', 'NVT', 'AR', 'MST', 'MTC'];
const VALID_NATURES = ['Recall', 'Rule_Application', 'Numerical', 'Comparative', 'Graphical', 'Conceptual', 'Mechanistic', 'Synthesis'];
const ORGANIC_ONLY_NATURES = ['Mechanistic', 'Synthesis'];
const VALID_BOARDS = ['JEE', 'NEET', 'CBSE', 'BITSAT', 'WBJEE'];
const VALID_SOURCE_TYPES = ['PYQ', 'Practice', 'NCERT_Textbook', 'NCERT_Exemplar', 'Mock'];
const VALID_EXAMS = ['JEE_Main', 'JEE_Advanced', 'NEET_UG', 'NEET_PG', 'WBJEE'];

function checkLatex(field, label, errs) {
  if (typeof field !== 'string') return;

  const dollarCount = (field.match(/\$/g) || []).length;
  if (dollarCount % 2 !== 0) {
    errs.push(`${label}: odd number of $ delimiters (${dollarCount}) — unclosed math`);
  }

  if (/\$\$/.test(field)) {
    errs.push(`${label}: contains $$ — use $...$ only for inline math`);
  }

  if (/\\dfrac/.test(field)) {
    errs.push(`${label}: contains \\dfrac — use \\frac only`);
  }

  const openBrace = (field.match(/(?<!\\){/g) || []).length;
  const closeBrace = (field.match(/(?<!\\)}/g) || []).length;
  if (openBrace !== closeBrace) {
    errs.push(`${label}: unbalanced braces — { count ${openBrace}, } count ${closeBrace}`);
  }

  const rawArrows = field.match(/[→←⇌⇄]/g);
  if (rawArrows) {
    errs.push(`${label}: contains raw Unicode arrow ${rawArrows[0]} — use $\\rightarrow$ etc.`);
  }
}

function validateQuestion(q, idx, subject) {
  const errs = [];
  const id = q.display_id || `(question #${idx + 1})`;

  if (!q.display_id) errs.push('missing display_id');
  else if (!/^[A-Z0-9]+-\d{3,4}$/.test(q.display_id)) {
    errs.push(`display_id "${q.display_id}" must match PREFIX-NNN or PREFIX-NNNN`);
  }

  if (!q.type) errs.push('missing type');
  else if (!VALID_TYPES.includes(q.type)) {
    errs.push(`type "${q.type}" not in ${VALID_TYPES.join('/')}`);
  }

  if (q.difficultyLevel == null) {
    errs.push('missing difficultyLevel');
  } else if (!Number.isInteger(q.difficultyLevel) || q.difficultyLevel < 1 || q.difficultyLevel > 5) {
    errs.push(`difficultyLevel ${q.difficultyLevel} must be integer 1-5`);
  }

  const md = q.question_text?.markdown;
  if (!md) {
    errs.push('missing question_text.markdown');
  } else {
    if (md.length < 10) errs.push(`question_text.markdown too short (${md.length} chars)`);
    checkLatex(md, 'question_text.markdown', errs);
  }

  // When `answer_pending: true` is set, the question is being ingested before
  // the answer key is available. Skip correctness-related checks but still
  // validate option structure (ids, texts, LaTeX, count).
  const answerPending = q.answer_pending === true;

  if (!Array.isArray(q.options)) {
    errs.push('options must be an array');
  } else if (q.type === 'NVT') {
    if (q.options.length !== 0) errs.push('NVT must have options: []');
    if (!answerPending) {
      if (q.answer == null || (q.answer.integer_value == null && q.answer.decimal_value == null)) {
        errs.push('NVT requires answer.integer_value or answer.decimal_value');
      }
    }
  } else if (['SCQ', 'MCQ', 'AR', 'MST', 'MTC'].includes(q.type)) {
    if (q.options.length !== 4) {
      errs.push(`${q.type} requires exactly 4 options (got ${q.options.length})`);
    } else {
      const expectedIds = ['a', 'b', 'c', 'd'];
      q.options.forEach((opt, i) => {
        if (opt.id !== expectedIds[i]) errs.push(`option[${i}].id should be "${expectedIds[i]}", got "${opt.id}"`);
        if (typeof opt.text !== 'string' || opt.text.length === 0) errs.push(`option[${i}].text empty`);
        else checkLatex(opt.text, `option[${opt.id}].text`, errs);
        if (typeof opt.is_correct !== 'boolean') errs.push(`option[${i}].is_correct must be boolean`);
      });

      if (!answerPending) {
        const correctCount = q.options.filter(o => o.is_correct).length;
        if (q.type === 'SCQ' && correctCount !== 1) {
          errs.push(`SCQ needs exactly 1 correct option (got ${correctCount})`);
        }
        if (q.type === 'MCQ' && correctCount < 2) {
          errs.push(`MCQ needs 2+ correct options (got ${correctCount})`);
        }
        if (q.type === 'AR' && correctCount !== 1) {
          errs.push(`AR needs exactly 1 correct option (got ${correctCount})`);
        }

        const allFalse = q.options.every(o => !o.is_correct);
        const hasAnswer = q.answer && (q.answer.correct_option || q.answer.correct_options);
        if (!allFalse && !hasAnswer) {
          errs.push('options have is_correct=true but answer field is empty');
        }
      } else {
        // answer_pending: ensure no option is accidentally flagged correct
        const correctCount = q.options.filter(o => o.is_correct).length;
        if (correctCount > 0) {
          errs.push(`answer_pending=true but ${correctCount} option(s) marked correct — clear is_correct flags`);
        }
      }
    }
  }

  if (!q.tag_id) errs.push('missing tag_id');
  else if (!/^tag_/.test(q.tag_id)) errs.push(`tag_id "${q.tag_id}" must start with "tag_"`);

  if (!q.questionNature) {
    errs.push('missing questionNature');
  } else if (!VALID_NATURES.includes(q.questionNature)) {
    errs.push(`questionNature "${q.questionNature}" not in ${VALID_NATURES.join('/')}`);
  } else if (subject !== 'chemistry' && ORGANIC_ONLY_NATURES.includes(q.questionNature)) {
    errs.push(`questionNature "${q.questionNature}" is organic-chemistry-only — invalid for ${subject}`);
  }

  // Canonical: applicableExams[] (Phase 2 — 2026-05-07 cleanup retired examBoard)
  if (q.sourceType !== 'Practice') {
    if (!Array.isArray(q.applicableExams) || q.applicableExams.length === 0) {
      errs.push('applicableExams[] required (unless sourceType is Practice)');
    } else {
      q.applicableExams.forEach(e => {
        if (!VALID_BOARDS.includes(e)) errs.push(`applicableExams entry "${e}" not in ${VALID_BOARDS.join('/')}`);
      });
    }
  }

  if (!q.sourceType) {
    errs.push('missing sourceType');
  } else if (!VALID_SOURCE_TYPES.includes(q.sourceType)) {
    errs.push(`sourceType "${q.sourceType}" not in ${VALID_SOURCE_TYPES.join('/')}`);
  }

  if (q.sourceType === 'PYQ') {
    if (!q.examDetails) {
      errs.push('PYQ requires examDetails');
    } else {
      if (!q.examDetails.exam) errs.push('examDetails.exam required for PYQ');
      else if (!VALID_EXAMS.includes(q.examDetails.exam)) errs.push(`examDetails.exam "${q.examDetails.exam}" not in ${VALID_EXAMS.join('/')}`);
      if (!q.examDetails.year || q.examDetails.year < 2000 || q.examDetails.year > 2030) {
        errs.push(`examDetails.year ${q.examDetails.year} out of plausible range`);
      }
    }
  }

  return { id, errs };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: node scripts/validate_phase1_output.js <phase1-file> [subject]');
    console.error('Example: node scripts/validate_phase1_output.js scripts/_phase1_buffer_curr.js physics');
    process.exit(2);
  }

  const filePath = path.resolve(args[0]);
  const subject = (args[1] || 'physics').toLowerCase();

  if (!['physics', 'chemistry', 'maths', 'biology'].includes(subject)) {
    console.error(`Invalid subject "${subject}". Use physics/chemistry/maths/biology.`);
    process.exit(2);
  }

  let mod;
  try {
    mod = require(filePath);
  } catch (e) {
    console.error(`Failed to load ${filePath}:`);
    console.error(e.message);
    process.exit(2);
  }

  const questions = mod.questions;
  if (!Array.isArray(questions)) {
    console.error(`${filePath} must export { questions: [...] }`);
    process.exit(2);
  }

  console.log(`\nValidating ${questions.length} question(s) — subject: ${subject}\n`);

  const seenIds = new Set();
  let totalErrs = 0;
  let cleanCount = 0;

  questions.forEach((q, i) => {
    const { id, errs } = validateQuestion(q, i, subject);

    if (q.display_id) {
      if (seenIds.has(q.display_id)) {
        errs.push(`duplicate display_id "${q.display_id}" within batch`);
      } else {
        seenIds.add(q.display_id);
      }
    }

    if (errs.length === 0) {
      console.log(`  ✅ ${id}`);
      cleanCount++;
    } else {
      console.log(`  ❌ ${id}`);
      errs.forEach(e => console.log(`     - ${e}`));
      totalErrs += errs.length;
    }
  });

  console.log(`\n──────────────────────────────────────────────`);
  console.log(`Clean: ${cleanCount}/${questions.length}  |  Errors: ${totalErrs}`);
  console.log(`──────────────────────────────────────────────\n`);

  if (totalErrs > 0) {
    console.log('❌ Validation FAILED — fix errors above before writing insertion script.\n');
    process.exit(1);
  }

  console.log('✅ All questions passed. Safe to proceed to Phase 2.\n');
}

main();
