'use strict';
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');
const bw = require('../lib/book-writer');

const PAGE_ID = 'd654823c-cae2-4f82-b5db-6adcb0956743';

const NEW_QUESTIONS = [
  {
    id: uuidv4(),
    question:
      "In Thomson's discharge tube experiment, the cathode ray beam is first deflected by a magnetic field alone. An electric field is then switched on in the opposite sense and adjusted until the beam travels straight again, undeflected. What does this balancing step let Thomson calculate?",
    options: [
      'The velocity of the cathode ray particles (v = E/B)',
      'The charge of the electron directly',
      'The total number of electrons in the beam',
      'The wavelength of the cathode rays',
    ],
    correct_index: 0,
    explanation:
      'When the electric force (eE) exactly cancels the magnetic force (evB) on the moving charge, eE = evB, so v = E/B. This velocity is only an intermediate result — it is then combined with the magnetic deflection (radius of curvature) measured with the electric field switched off to solve for e/m. The balancing trick isolates velocity, not charge or particle count.',
  },
  {
    id: uuidv4(),
    question:
      'The specific charge (e/m) of the electron is about 1837 times larger than the specific charge of the proton, even though both particles carry the same magnitude of charge. What accounts for this?',
    options: [
      "The proton's charge is 1837 times smaller than the electron's charge",
      'The proton travels 1837 times faster than the electron through the discharge tube',
      "The proton's radius of curvature under a magnetic field is 1837 times larger because of its charge sign",
      "The proton's mass is about 1837 times greater than the electron's mass",
    ],
    correct_index: 3,
    explanation:
      'Specific charge = charge / mass. Electron and proton carry equal charge magnitude, so the entire 1837× gap in e/m comes from mass alone — the proton is roughly 1837 times heavier than the electron, which proportionally shrinks its e/m.',
  },
];

(async () => {
  await bw.withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ _id: PAGE_ID });
    const existing = page.blocks || [];
    const quiz = existing.find((b) => b.type === 'inline_quiz');
    if (!quiz) throw new Error('No inline_quiz block found on this page');

    const updatedQuiz = { ...quiz, questions: [...quiz.questions, ...NEW_QUESTIONS] };
    const newBlocks = existing.map((b) => (b.id === quiz.id ? updatedQuiz : b));

    const dry = await bw.savePage(db, { pageId: page._id }, newBlocks, { dryRun: true });
    console.log('DRY RUN diff:', JSON.stringify(dry.diff, null, 2));
    if (dry.wouldBlock) { console.log('BLOCKED — not writing.'); return; }

    const res = await bw.savePage(db, { pageId: page._id }, newBlocks, {
      author: 'agent',
      summary: 'Add 2 quiz questions on the discharge-tube balancing technique and the electron/proton specific-charge ratio',
    });
    console.log(`Saved -> version ${res.version}, quiz now ${updatedQuiz.questions.length} questions`);
  });
})().catch((e) => { console.error(e); process.exit(1); });
