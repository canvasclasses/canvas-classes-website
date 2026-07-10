'use strict';
/**
 * Class 11 Chemistry — Ch.5 Thermodynamics — Arc (Second Law motivation), Page 16.
 * "Why Things Happen: Spontaneity" — the limit of the First Law: energy is conserved
 * in BOTH a process and its reverse, so conservation alone cannot decide direction.
 * Spontaneous processes; exothermic is NOT a reliable test (endothermic spontaneous
 * changes exist; two gases mix with ΔH ≈ 0). Motivates entropy as the second factor.
 * Voice: teacher-voice-profile.md (FORMAT v2) + THERMO-exemplars.md (Spontaneity gallery,
 * khichdi gas-mixing). Reference-first: Mittal §25.1, §25.2.
 * published:false. Run: node scripts/insert_thermo_p16_spontaneity-first-law-limit.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 5;
const PAGE_NUMBER = 16;
const NEW_SLUG = 'spontaneity-first-law-limit';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A cup of hot tea cooling on a table, with a one-way arrow showing heat leaving into the room and a blocked reverse arrow',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). A single cup of hot tea sitting on a wooden table in a dim room, warm steam rising. A bold glowing orange arrow shows heat flowing OUT of the tea into the cooler room. Beside it, a faded reverse arrow (heat flowing back into the tea) is shown crossed out with a soft X, signalling "this never happens on its own". The idea: change runs one way only. Deep near-black background (#0a0a0a), warm orange and amber glow from the tea and the forward arrow, cool dim blues for the surrounding room, volumetric steam. Clean cinematic scientific-illustration style. No text or labels.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'The Tea That Never Reheats Itself',
      markdown: "Leave a cup of hot tea on the table and it always cools to room temperature. You have never once seen the reverse: a lukewarm cup quietly pulling heat back out of the room to reheat itself.\n\nHere is the strange part. That reverse would break no law of energy. The room would simply give back the heat it took, and the total energy would stay exactly the same. Energy accounting would be perfectly happy either way. Yet only one direction ever happens. Something the First Law cannot see is choosing the direction for us." },

    // 2 — core concept
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "A process that happens **on its own**, without being pushed or pulled by anything outside, is called a **spontaneous process**. Water runs downhill on its own. Hot tea cools on its own. Iron left in damp air rusts on its own. Nobody has to make these happen; given the chance, they just do.\n\n" +
      "The First Law of thermodynamics gave us a powerful rule: energy is never created or destroyed, only moved around. But notice what that rule does *not* tell you. It says nothing about **direction**. The tea cooling and the tea reheating both conserve energy perfectly, so the First Law would happily allow either one. It cannot explain why only one of them ever happens.\n\n" +
      "So energy conservation is true, but it is not the whole story. To predict which way a change will actually go, we need a second idea the First Law is blind to." },

    // 3 — heading: what spontaneous really means
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'What Spontaneous Really Means',
      objective: 'State what makes a process spontaneous, and why spontaneous does not mean fast.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "A **spontaneous** change is one that has a natural tendency to happen on its own, once it gets a chance. Think of a few everyday scenes that all run one way only:\n\n" +
      "- Water flows **downhill** by itself, but never climbs back up on its own.\n" +
      "- A cup of hot tea cools down by itself, but a cold cup never reheats itself. Who is stopping the cold one from doing it?\n" +
      "- Water spilled on the floor slowly dries up over a few hours, spreading into the air on its own.\n\n" +
      "One warning before we go further: spontaneous says nothing about **speed**. A spontaneous change can be lightning-fast or painfully slow. Diamond turning into graphite is spontaneous, yet so slow that a diamond ring outlasts its owner by millions of years. Spontaneous means *it will go that way if given enough time*, not *it will go quickly*." },

    // 4 — image: spontaneity gallery
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'Three one-way everyday changes: water flowing downhill, hot tea cooling, and spilled water drying off a floor',
      caption: '📸 Three everyday changes, each running one way only',
      generation_prompt: 'A clean side-by-side comparison diagram on a deep near-black background (#0a0a0a), three equal panels, each showing an everyday change that runs in one direction only. Panel 1: water flowing down a slope, a glowing orange arrow pointing downhill, a faded crossed-out arrow pointing uphill. Panel 2: a hot cup of tea with orange heat arrows leaving into the air, and a faded crossed-out reverse arrow. Panel 3: a small puddle of spilled water on a floor evaporating into faint rising wisps, an orange forward arrow, a faded crossed-out reverse arrow. Consistent visual language: bright orange/amber for the direction that happens, dim grey crossed-out arrows for the direction that never does. Minimal white labels only if needed. Clean scientific-illustration style.' },

    // 5 — reasoning_prompt (mid-page, after "what spontaneous means")
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "Ice melting in a glass at room temperature absorbs heat from its surroundings, so it is an endothermic change. Yet it happens completely on its own. What does this tell you about the rule \"if a change releases heat, it is spontaneous\"?",
      options: [
        "The rule is reliable; ice melting must secretly release heat overall",
        "The rule is not reliable, because here is a change that absorbs heat yet is still spontaneous",
        "Ice melting is not really spontaneous, since it needs heat to happen",
        "Spontaneity depends only on temperature, not on heat at all"
      ],
      correct_index: 1,
      reveal: "Ice melting above 0 °C clearly absorbs heat, and it clearly happens on its own. That single example breaks the comfortable rule that releasing heat is what makes a change spontaneous. The tempting answer is to insist the change must release heat somewhere, but it genuinely does not. So spontaneity cannot be decided by heat release alone. Some other factor must be at work, and that factor is **entropy**." },

    // 6 — heading: why energy alone is not enough
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Why Energy Alone Is Not Enough',
      objective: 'Show that releasing energy cannot be the test for spontaneity, using endothermic spontaneous changes and the mixing of two gases.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "It is tempting to say a change is spontaneous because it lowers energy, the way a ball rolls downhill to a lower point. **Exothermic** reactions, which release heat, are indeed spontaneous very often, and for a long time chemists thought heat release alone was the test. But nature keeps breaking that test.\n\n" +
      "Several **endothermic** changes, which *absorb* heat, are perfectly spontaneous:\n\n" +
      "- Ice melts on its own above 0 °C while soaking up heat.\n" +
      "- Many salts dissolve in water on their own, and the beaker actually turns cold as they do.\n" +
      "- Water evaporates from a wet floor on its own, drawing heat from its surroundings.\n\n" +
      "Now the cleanest proof of all. Take two different gases, open the tap between them, and they mix into one uniform blend on their own, an even khichdi of molecules, with almost **no energy change** at all ($ \\Delta H \\approx 0 $). Nothing was released and nothing was gained, yet the mixing still happens one way only and never unmixes. If energy were the driver, a change with zero energy change should have no reason to go anywhere. It goes anyway.\n\n" +
      "So enthalpy alone cannot be the test of spontaneity. A second factor is needed, one that measures how spread out and disordered things become. That factor is **entropy**." },

    // 7 — worked example: spontaneous vs exothermic
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Spontaneous or Exothermic?',
      problem: "For each change, state (i) whether it is spontaneous and (ii) whether it is exothermic or endothermic: (a) methane burning in air, (b) ice melting in a room at 25 °C, (c) two ideal gases mixing.",
      solution: "Treat the two questions separately each time, because they are not the same question.\n\n" +
        "**(a) Methane burning in air.**\n\n" +
        "It happens readily once lit, so it is spontaneous.\n\n" +
        "It releases a large amount of heat, so it is exothermic.\n\n" +
        "**(b) Ice melting in a room at 25 °C.**\n\n" +
        "Ice left in a warm room melts on its own, so it is spontaneous.\n\n" +
        "It absorbs heat from the room to melt, so it is endothermic.\n\n" +
        "**(c) Two ideal gases mixing.**\n\n" +
        "Open the tap and they blend on their own, so it is spontaneous.\n\n" +
        "Almost no heat is released or absorbed, so $ \\Delta H \\approx 0 $.\n\n" +
        "**Conclusion:** all three are spontaneous, yet one releases heat, one absorbs heat, and one does neither. Spontaneity and exothermicity are clearly not the same thing." },

    // 8 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'Three Things to Carry Forward',
      markdown: "**Spontaneous does not mean fast.** A change can be spontaneous and still take millions of years.\n\n" +
        "**Exothermic is not a reliable test for spontaneity.** Endothermic changes that happen on their own do exist, so heat release alone cannot decide direction.\n\n" +
        "**The missing factor is entropy.** Energy is half the story; the other half is how spread out and disordered the system becomes." },

    // 9 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "Examiners love to test the two traps on this page.\n\n" +
        "**\"Spontaneous\" says nothing about rate.** The classic example is graphite forming from diamond: it is spontaneous, yet unmeasurably slow. If a question links spontaneity to how fast a reaction goes, the link is wrong.\n\n" +
        "**Never assume exothermic equals spontaneous.** The examiner will hand you an endothermic change that is spontaneous (ice melting, a salt dissolving with cooling) to catch students who memorised the shortcut.\n\n" +
        "The real driver of direction combines **energy and entropy together**, which is exactly where the next pages take you." },

    // 10 — inline_quiz (last)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'A spontaneous process is best described as one that',
          options: [
            'always happens very quickly',
            'happens on its own, without help from outside, whether fast or slow',
            'always releases heat to its surroundings',
            'can only happen if energy is supplied to it'
          ],
          correct_index: 1,
          explanation: 'Spontaneous means the change has a natural tendency to happen on its own, given enough time. The tempting wrong choice is "always happens very quickly", but speed and spontaneity are unrelated. Diamond turning to graphite is spontaneous yet extremely slow.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Which observation most clearly shows that releasing energy cannot be the test for whether a change is spontaneous?',
          options: [
            'Methane burns in air and releases a large amount of heat',
            'A hot cup of tea cools down to room temperature over time',
            'Ice melts on its own at room temperature while absorbing heat',
            'Water flows downhill on its own from a higher level'
          ],
          correct_index: 2,
          explanation: 'Ice melting is spontaneous yet endothermic, so a change that absorbs heat still happens on its own. The tempting choice is the burning of methane, but that releases heat and so fits the old rule rather than breaking it.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Two different ideal gases are allowed to mix, with almost no heat released or absorbed. What does this tell us about what drives a spontaneous change?',
          options: [
            'Energy change alone cannot be the driver, since mixing happens with almost no energy change',
            'Mixing must secretly release heat, or it could not happen',
            'The mixing is not actually spontaneous because no energy is released',
            'The gases will slowly unmix again on their own to lower their energy'
          ],
          correct_index: 0,
          explanation: 'The gases mix on their own even though the energy barely changes, so energy cannot be what drives the change. The tempting choice is that mixing must secretly release heat, but it genuinely does not. The real driver is the increase in disorder, measured by entropy.' },
      ] },

    // 11 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You now know the First Law cannot decide direction, and that energy release alone is not the test. The missing factor has a name and a measure. Next: **Entropy, the measure of dispersal**, the second quantity that, working alongside energy, finally decides which way a change will go.*" },
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
    slug: NEW_SLUG, title: 'Why Things Happen: Spontaneity',
    subtitle: 'Hot tea always cools and never reheats itself — yet the First Law would happily allow both. Energy conservation cannot be the whole story.',
    blocks,
    hinglish_blocks: [], tags: ['thermodynamics', 'spontaneity', 'second-law-motivation', 'entropy-intro'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new thermo page 16 (spontaneity, the first-law limit)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
