'use strict';
/**
 * Class 11 Chemistry — Ch.5 Thermodynamics — Arc D, Page 18.
 * "Calculating Entropy Changes" — one master formula for an ideal gas, a clean rule
 * for phase changes, and the surroundings trap where students slip (the ΔS_surr
 * formula switches for irreversible processes).
 * Voice: teacher-voice-profile.md (FORMAT v2) + THERMO-exemplars.md (master entropy
 * formula; phase change ΔH_trans/T_trans; exemplar 32 S–T staircase; exemplars 28 + the
 * ΔS_surr formula-switch trap).
 * Reference-first: Mittal §25.4.
 * published:false. Run: node scripts/insert_thermo_p18_calculating-entropy-changes.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 5;
const PAGE_NUMBER = 18;
const NEW_SLUG = 'calculating-entropy-changes';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A block of ice, a pool of water, and a cloud of steam arranged left to right, with the entropy rising in two steps — a small step at melting and a much taller step at boiling',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). Three states of water arranged left to right across the frame: a solid block of ice on the left, a calm pool of liquid water in the middle, and a billowing cloud of steam on the right. Floating above them, a glowing staircase made of light rises in two steps — a SHORT step where ice becomes water, and a much TALLER step where water becomes steam — visually showing that the entropy jump at boiling dwarfs the jump at melting. Deep near-black background (#0a0a0a), warm orange and amber glow on the staircase and steam, cool dim blue on the ice. Clean cinematic scientific-illustration style. No text, no labels, no numbers.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'Which jump is bigger?',
      markdown: "Here is a question worth a second of thought: which gives a bigger entropy jump — melting ice into water, or boiling water into steam? Boiling wins, by a wide margin. Loosening a solid into a liquid frees the particles a little. Turning a liquid into a gas unleashes vastly more freedom, so the entropy jump at the boiling point dwarfs the one at melting." },

    // 2 — core text
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "You already know what entropy is and which way it tends to go. Now you need to put a number on the change. The good news Paaras sir keeps repeating about this chapter holds here too: once you know which formula fits the situation, the rest is plain arithmetic.\n\n" +
      "There are really just three tools on this page. One **master formula** for an ideal gas changing its temperature and volume. One short rule for a **phase change** at constant temperature. And one bookkeeping equation that ties the **system** and its **surroundings** into the **universe**. Pick the right tool, and the entropy change falls out." },

    // 3 — heading: master formula
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Master Formula',
      objective: 'Write one entropy formula for an ideal gas, then switch off the term the conditions remove.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "For one mole region of an ideal gas, the entropy change has two parts — one for the temperature change, one for the volume change:\n\n" +
      "$ \\Delta S = nC_V\\ln\\frac{T_2}{T_1} + nR\\ln\\frac{V_2}{V_1} $\n\n" +
      "The trick is not to memorise three separate formulas. Memorise this one, then **kill whichever term the conditions remove.** If the temperature does not change — an **isothermal** change — the first term is zero, and you are left with the volume part alone:\n\n" +
      "$ \\Delta S = nR\\ln\\frac{V_2}{V_1} $\n\n" +
      "If instead the volume is fixed, the second term dies and only the temperature part survives. One formula, switched on and off by the conditions — that is the whole game." },

    // 4 — image: master-formula decision map
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'The master entropy formula at the top, with two branches below showing which term is removed for an isothermal change and which for a constant-volume change',
      caption: '📸 One master formula — switch off the term the conditions remove',
      generation_prompt: 'Clean technical decision-map diagram on a deep near-black background (#0a0a0a). At the top, a single glowing master equation shown as two side-by-side terms in a box: a temperature term and a volume term. Two orange arrows branch downward. Left branch labelled "temperature fixed (isothermal)" leads to the same box with the temperature term dimmed out and crossed, leaving only the volume term glowing. Right branch labelled "volume fixed" leads to the box with the volume term dimmed and crossed, leaving only the temperature term glowing. Orange accent arrows and labels, white minimal text, clean technical illustration style. No stray text, no watermark.' },

    // 5 — heading: phase change
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Entropy of a Phase Change',
      objective: 'Compute the entropy change when a substance melts or boils using the heat of the transition over its temperature.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "A melting or boiling does not happen at a moving temperature — it happens at one fixed temperature. Ice melts at its melting point and stays there until the last crystal is gone. Water boils at its boiling point and stays there until the last drop is gas. So a phase change is a constant-temperature event, and its entropy change has a clean form:\n\n" +
      "$ \\Delta S = \\frac{\\Delta H_{trans}}{T_{trans}} $\n\n" +
      "Here $ \\Delta H_{trans} $ is the heat absorbed for the transition and $ T_{trans} $ is the temperature at which it happens. For melting, use the heat of fusion at the melting point. For boiling, use the heat of vaporisation at the boiling point. Because vaporisation needs far more heat than fusion, the boiling entropy jump comes out far larger — the same staircase you saw in the banner." },

    // 6 — mid-page reasoning_prompt (after the phase-change + surroundings idea is set up)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "Water boils at 100 °C. The boiling water (the system) gains entropy as liquid turns to gas. What happens to the entropy of the surroundings, and why?",
      options: [
        "It rises too, because heat and entropy always increase together everywhere",
        "It falls, because the heat needed for boiling flows out of the surroundings, so its entropy change is negative",
        "It stays exactly zero, because the temperature of the surroundings does not change",
        "It falls, because the surroundings lose volume to the expanding steam"
      ],
      correct_index: 1,
      reveal: "Boiling water has to absorb heat to turn into steam, and that heat comes from the surroundings. The surroundings lose heat, so their entropy change is negative: $ \\Delta S_{surr} = \\frac{-q}{T} $. The tempting answer says entropy rises everywhere — but that is only true for the universe as a whole, never guaranteed for each part. The surroundings here genuinely lose entropy; it is the system's larger gain that keeps the universe's total from falling." },

    // 7 — heading: system, surroundings, universe
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'System, Surroundings, and the Universe',
      objective: 'Add the system and surroundings entropy changes correctly, and read off whether a process is reversible or spontaneous.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Entropy is judged on the whole universe, not on the system alone. So the total change is always:\n\n" +
      "$ \\Delta S_{universe} = \\Delta S_{system} + \\Delta S_{surroundings} $\n\n" +
      "The system part you get from the formulas above. The surroundings part comes from the heat the system dumped into them: $ \\Delta S_{surr} = \\frac{-q_{system}}{T_{surr}} $. The minus sign is the whole point — heat that leaves the system enters the surroundings, and vice versa.\n\n" +
      "Read the total to judge the process. For a **reversible** process the books-only ideal, $ \\Delta S_{universe} = 0 $. For a real **spontaneous** (irreversible) process, $ \\Delta S_{universe} > 0 $. The universe never loses entropy." },

    // 8 — text: the trap (surroundings formula switch)
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Here is the one place students get confused, so slow down. The **system** formula is the same whether the path is reversible or irreversible — you always use the reversible heat to get $ \\Delta S_{system} $. But the **surroundings** formula switches. For an irreversible process, the heat that actually flows is the real heat, so you must use $ \\Delta S_{surr} = \\frac{-q_{actual}}{T} $. Same system formula, different surroundings formula — sir flags this as exactly where bachche slip." },

    // 9 — worked example
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Entropy of Vaporisation',
      problem: "One mole of water vaporises at its boiling point, $ 373 $ K, with a heat of vaporisation $ \\Delta H_{vap} = 40.7 $ kJ/mol. Find the entropy of vaporisation $ \\Delta S_{vap} $.",
      solution: "**Spot the situation.** This is a phase change at one fixed temperature, so reach for the phase-change rule, not the master gas formula.\n\n" +
        "**Write the formula.** $ \\Delta S_{vap} = \\frac{\\Delta H_{vap}}{T} $\n\n" +
        "**Convert the units first.** $ \\Delta H_{vap} = 40.7 $ kJ/mol $ = 40700 $ J/mol — this kJ to J step is where marks are lost.\n\n" +
        "**Put in the numbers.** $ \\Delta S_{vap} = \\frac{40700}{373} $\n\n" +
        "**Divide.** $ \\Delta S_{vap} \\approx 109 $ J/(mol·K)\n\n" +
        "**Answer:** $ \\Delta S_{vap} \\approx 109 $ J/(mol·K), positive because the liquid gains disorder on becoming a gas." },

    // 10 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The Three Tools, In One Box',
      markdown: "Master formula for an ideal gas: $ \\Delta S = nC_V\\ln\\frac{T_2}{T_1} + nR\\ln\\frac{V_2}{V_1} $ — kill the term the conditions remove.\n\n" +
        "Phase change at constant temperature: $ \\Delta S = \\frac{\\Delta H_{trans}}{T_{trans}} $.\n\n" +
        "Total: $ \\Delta S_{universe} = \\Delta S_{sys} + \\Delta S_{surr} $. A reversible process gives $ 0 $; a spontaneous one gives a positive value." },

    // 11 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**The surroundings formula switches — this is the trap:** $ \\Delta S_{sys} $ always uses the reversible heat and is the same no matter which path was taken. But $ \\Delta S_{surr} $ changes — for an irreversible process you must use the real heat, $ \\frac{-q_{actual}}{T} $. The system formula stays put; the surroundings formula moves.\n\n" +
        "**Convert kJ to J before you divide:** enthalpies arrive in kJ/mol, entropies are wanted in J/(mol·K). Forgetting the factor of $ 1000 $ is the single most common slip in these questions.\n\n" +
        "**Remember the staircase ranking:** the entropy jump at boiling is far larger than the jump at melting, because a gas carries far more freedom than a liquid." },

    // 12 — inline_quiz (LAST, 3 Qs, varied correct_index, difficulty 1/2/2)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'For a phase change happening at one fixed temperature, which formula gives the entropy change?',
          options: [
            'The heat of the transition divided by the transition temperature',
            'The heat of the transition multiplied by the transition temperature',
            'The transition temperature divided by the heat of the transition',
            'The gas constant multiplied by the natural log of the volume ratio'
          ],
          correct_index: 0,
          explanation: 'A phase change is a constant-temperature event, so its entropy change is the heat of the transition divided by the temperature at which it happens. The volume-ratio option is the isothermal gas formula — a real tool, but for an expanding gas, not for melting or boiling.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'For a spontaneous, irreversible process, what is the correct relationship for the total entropy change of the universe?',
          options: [
            'It is exactly zero, the same as for a reversible process',
            'It is greater than zero',
            'It is less than zero, because real processes waste entropy',
            'It depends only on the system and ignores the surroundings'
          ],
          correct_index: 1,
          explanation: 'A spontaneous process drives the entropy of the universe up, so the total is greater than zero. The "exactly zero" option is the trap — that value belongs to a reversible process, the ideal that real spontaneous changes never quite reach.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'When computing the entropy change of the surroundings for an irreversible process, which quantity must you use?',
          options: [
            'The reversible heat, the same value used for the system',
            'No heat term, because the surroundings entropy is always zero',
            'The actual heat that really flows, taken with a minus sign over the temperature',
            'The volume change of the system divided by the temperature'
          ],
          correct_index: 2,
          explanation: 'The surroundings formula switches for an irreversible process: you use the real heat that actually flows, as the negative of that heat over the temperature. The first option is the classic confusion — the reversible heat is right for the system, but the surroundings track the heat that genuinely crossed.' },
      ] },

    // 13 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You can now put numbers on an entropy change — for a gas, for a phase change, and for the universe as a whole. Next: what that rising entropy of the universe actually rules out, and where the true zero of entropy lives — the Second and Third Laws.*" },
  ];
}

bw.withDb(async (db) => {
  const pages = db.collection('book_pages');
  const books = db.collection('books');
  const book = await books.findOne({ slug: BOOK_SLUG });
  if (!book) throw new Error('book not found');

  if (await pages.findOne({ book_id: book._id, slug: NEW_SLUG })) {
    console.log(`⚠  ${NEW_SLUG} already exists — skipping (idempotent).`);
    return;
  }

  const blocks = buildBlocks();
  const newId = uuidv4();
  const now = new Date();
  const doc = {
    _id: newId, book_id: book._id, chapter_number: CH, page_number: PAGE_NUMBER,
    slug: NEW_SLUG, title: 'Calculating Entropy Changes',
    subtitle: 'One master formula, a clean rule for phase changes, and the one place students always slip — the surroundings.',
    blocks,
    hinglish_blocks: [], tags: ['thermodynamics', 'entropy-change', 'phase-change', 'entropy-of-surroundings'],
    published: false,
    reading_time_min: bw.computeReadingTime(blocks),
    content_types: bw.computeContentTypes(blocks),
    page_type: 'lesson', created_at: now, updated_at: now,
    deleted_at: null, deleted_by: null, deletion_reason: null,
  };
  await pages.insertOne(doc);
  console.log(`✓ inserted "${doc.title}" — ch${CH} page ${PAGE_NUMBER}, ${blocks.length} blocks, published:false`);

  const ch = book.chapters.find((c) => c.number === CH);
  if (!ch) throw new Error('chapter 5 not found in book.chapters');
  ch.page_ids = ch.page_ids || [];
  if (!ch.page_ids.includes(newId)) ch.page_ids.push(newId);
  await books.updateOne({ _id: book._id, 'chapters.number': CH }, { $set: { 'chapters.$.page_ids': ch.page_ids } });
  console.log(`✓ appended page_id into chapter ${CH} page_ids (now ${ch.page_ids.length})`);

  await bw.snapshotVersion(db, doc, 'baseline — new thermo page 18 (calculating entropy changes)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
