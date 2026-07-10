// mergePages(h, A, B, sectionHeading, sectionObjective, opts)
// Losslessly composes two page modules into one: keeps ALL of A's blocks and ALL
// of B's blocks EXCEPT B's leading hero image (replaced by a section heading), and
// collapses the two end-of-page Quick Recaps + quizzes into ONE combined recap and
// ONE quiz. Used by the chapter-consolidation (22→16 pages). No content is invented;
// every Example / In-text / Decode This / Exam Vault / table is carried over verbatim.
//   opts.quizFromA / opts.quizFromB — how many quiz Qs to keep from each (default 4).
const isRecap = (x) => x.type === 'callout' && (x.title || '').includes('Quick Recap');
const isQuiz = (x) => x.type === 'inline_quiz';

module.exports = function mergePages(h, A, B, sectionHeading, sectionObjective, opts = {}) {
  const a = A.build(h);
  const b = B.build(h);
  const aRecap = a.find(isRecap);
  const bRecap = b.find(isRecap);
  const aQuiz = a.find(isQuiz);
  const bQuiz = b.find(isQuiz);

  const aBody = a.filter((x) => !isRecap(x) && !isQuiz(x)); // hero + all A content
  const bBody = b.filter((x) => !isRecap(x) && !isQuiz(x)).slice(1); // drop B's hero only

  const recapMd = [aRecap && aRecap.markdown, bRecap && bRecap.markdown].filter(Boolean).join('\n\n');
  const recap = h.callout('remember', '⚡ Quick Recap', recapMd);

  const nA = opts.quizFromA != null ? opts.quizFromA : 4;
  const nB = opts.quizFromB != null ? opts.quizFromB : 4;
  const qs = [
    ...((aQuiz && aQuiz.questions) || []).slice(0, nA),
    ...((bQuiz && bQuiz.questions) || []).slice(0, nB),
  ].map(({ id, ...rest }) => rest); // strip ids; h.quiz re-mints them

  const heading = h.heading(sectionHeading, sectionObjective);
  const blocks = [...aBody, heading, ...bBody, recap, h.quiz(qs, 0.6)];
  return blocks.map((blk, i) => ({ ...blk, order: i })); // re-sequence order
};
