// scripts/_lib/compact.js
//
// Expands compact tuple-format question buffers into the canonical schema
// expected by validate_phase1_output.js and insert_questions.js.
//
// Designed for math (JEE-only, no figures, no per-question solutions) where
// the verbose canonical schema repeats ~80% boilerplate across every question.
// Physics and chemistry buffers can keep using the canonical object format if
// they have heavy per-question variation; the canonical format is unchanged
// and still accepted everywhere.
//
// USAGE in a buffer file:
//   const { expand } = require('./_lib/compact');
//   const SRC = { exam: 'JEE_Main', year: 2021, month: 'Jul', shift: 'Shift-II' };
//   const Q = [
//     // [id, type, diff, nature, qmd, opts, ans, sourceOverride?]
//     ['MRES-064', 'SCQ', 3, 'Conceptual',
//       'Negation of $(p\\vee r)\\Rightarrow(q\\vee r)$ is:',
//       ['$\\sim p\\wedge q\\wedge\\sim r$','$\\sim p\\wedge q\\wedge r$',
//        '$p\\wedge\\sim q\\wedge\\sim r$','$p\\wedge q\\wedge r$'],
//       3],
//     ['MRES-092', 'NVT', 4, 'Numerical',
//       'Let $S$ be the set of all compound statements such that...',
//       null, 9],
//   ];
//   module.exports = { questions: expand(Q, { source: SRC, tag_id: 'tag_ma_reasoning' }) };
//
// Tuple positions (positional, not named):
//   [0] id              — display_id (e.g. 'MRES-064')
//   [1] type            — 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC'
//   [2] difficulty      — integer 1..5
//   [3] nature          — questionNature string
//   [4] qmd             — question_text.markdown
//   [5] opts            — array of 4 option-text strings (or null for NVT)
//   [6] ans             — 1-based correct index for SCQ/AR/MST/MTC,
//                         array of 1-based indices for MCQ,
//                         numeric answer for NVT
//   [7] sourceOverride? — optional per-question examDetails override
//
// Already-canonical objects pass through unchanged — you can mix tuples and
// objects in the same Q array if a few questions have unusual shape.

const VALID_TYPES = ['SCQ', 'MCQ', 'NVT', 'AR', 'MST', 'MTC'];
const OPTION_IDS = ['a', 'b', 'c', 'd'];

function expand(tuples, opts = {}) {
  const {
    source: defaultSource = null,
    tag_id: defaultTagId,
    applicableExams = ['JEE'],
    sourceType = 'PYQ',
  } = opts;

  if (!defaultTagId) {
    throw new Error('expand(): opts.tag_id is required (placeholder tag for the chapter)');
  }
  if (!Array.isArray(tuples)) {
    throw new Error('expand(): first arg must be an array');
  }

  return tuples.map((t, i) => {
    if (!Array.isArray(t)) return t; // already-canonical object — pass through

    const [id, type, diff, nature, qmd, qOpts, ans, sourceOverride] = t;

    if (!id) throw new Error(`Tuple ${i}: missing display_id`);
    if (!VALID_TYPES.includes(type)) {
      throw new Error(`Tuple ${i} (${id}): type "${type}" not in ${VALID_TYPES.join('/')}`);
    }
    if (!Number.isInteger(diff) || diff < 1 || diff > 5) {
      throw new Error(`Tuple ${i} (${id}): difficulty must be integer 1-5, got ${diff}`);
    }
    if (typeof qmd !== 'string' || qmd.length < 10) {
      throw new Error(`Tuple ${i} (${id}): question_text too short or missing`);
    }

    const source = sourceOverride || defaultSource;

    const out = {
      display_id: id,
      type,
      difficultyLevel: diff,
      question_text: { markdown: qmd },
      tag_id: defaultTagId,
      questionNature: nature,
      applicableExams,
      sourceType,
      examDetails: sourceType === 'PYQ' ? source : null,
      solution: null,
    };

    if (type === 'NVT') {
      out.options = [];
      if (typeof ans !== 'number' || Number.isNaN(ans)) {
        throw new Error(`Tuple ${i} (${id}): NVT requires numeric answer, got ${ans}`);
      }
      out.answer = Number.isInteger(ans) ? { integer_value: ans } : { decimal_value: ans };
    } else {
      if (!Array.isArray(qOpts) || qOpts.length !== 4) {
        throw new Error(`Tuple ${i} (${id}): ${type} requires 4 options, got ${qOpts ? qOpts.length : 0}`);
      }
      qOpts.forEach((o, k) => {
        if (typeof o !== 'string' || o.length === 0) {
          throw new Error(`Tuple ${i} (${id}): option[${k}] empty`);
        }
      });
      const correctList = Array.isArray(ans) ? ans : [ans];
      correctList.forEach(n => {
        if (!Number.isInteger(n) || n < 1 || n > 4) {
          throw new Error(`Tuple ${i} (${id}): answer ${n} must be 1-based index 1..4`);
        }
      });
      const correctSet = new Set(correctList);
      out.options = qOpts.map((text, idx) => ({
        id: OPTION_IDS[idx],
        text,
        is_correct: correctSet.has(idx + 1),
      }));
      if (type === 'MCQ') {
        out.answer = {
          correct_options: [...correctSet].sort((a, b) => a - b).map(n => OPTION_IDS[n - 1]),
        };
      } else {
        out.answer = { correct_option: OPTION_IDS[correctList[0] - 1] };
      }
    }

    return out;
  });
}

module.exports = { expand };
