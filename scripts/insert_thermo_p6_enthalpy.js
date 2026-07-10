'use strict';
/**
 * Class 11 Chemistry — Ch.5 Thermodynamics — Arc A, Page 6.
 * "Enthalpy — Heat at Constant Pressure" — the everyday-case energy.
 * q_V = ΔU (constant volume) vs q_P = ΔH (constant pressure); H = U + PV;
 * ΔH = ΔU + Δ(PV), and for gases at fixed T, ΔH = ΔU + Δn_g RT (gas moles only).
 * SIGNATURE page. Voice: teacher-voice-profile.md (FORMAT v2) + THERMO-exemplars.md
 * (analogy/trap C + #13: the "ΔH = ΔU + PΔV" rote trap; "sir, temperature change?" doubt).
 * Reference-first: Mittal §23.10.
 * published:false. Run: node scripts/insert_thermo_p6_enthalpy.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 5;
const PAGE_NUMBER = 6;
const NEW_SLUG = 'enthalpy';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A fizzing reaction in an open beaker pushing the surrounding air gently outward as gas bubbles up',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). A glass beaker on a lab bench in a dim room, a vigorous fizzing reaction inside it sending up a column of fine gas bubbles. Above the open mouth of the beaker, faint glowing rings of air are being pushed gently outward and upward, as if the gas is quietly shoving the atmosphere aside to make room for itself. The idea: making gas in the open costs a little energy spent pushing against the surrounding air. Deep near-black background (#0a0a0a), warm orange and amber glow from the fizzing liquid and the rising bubbles, faint cool concentric rings showing the air being displaced. Clean cinematic scientific-illustration style. No text or labels.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'The Invisible Push',
      markdown: "A fizzing reaction in an open beaker is quietly busy doing something you never see: as it makes gas, it pushes the whole atmosphere aside to make room. Some of its energy is spent on that invisible shove against the air. Chemists wanted a single bookkeeping quantity that already has this push built in, so they invented **enthalpy** — the energy meant for the everyday open-flask case." },

    // 2 — core concept
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "On the last page you measured the energy change of a reaction by tracking its internal energy, $ \\Delta U $. That works perfectly when the reaction is sealed in a **rigid container** of fixed volume. But look around a real lab. Almost nothing happens in a sealed steel bomb. Reactions bubble away in open flasks, beakers, and test tubes, out in the open air.\n\n" +
      "In an open flask the volume is free to change, and the pressure stays fixed at whatever the atmosphere is pushing down. So when a reaction makes gas, it has to push the air back to make room. That push takes work, and that work has to come out of the reaction's own energy budget.\n\n" +
      "**Enthalpy** is the quantity built to handle exactly this case. It bundles the internal energy together with the push-against-the-atmosphere term, so that for an open-flask reaction you can read off the heat in one clean number." },

    // 3 — heading 1
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Why Chemists Needed a Second Energy',
      objective: 'See why the heat you measure at constant pressure is not the same as the internal-energy change, and why enthalpy is built for it.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Heat is not one fixed thing for a reaction. *How much heat you measure depends on the conditions you hold steady while it runs.*\n\n" +
      "Hold the **volume** constant (a sealed rigid vessel, like a bomb calorimeter), and the reaction cannot do any pushing work. Every joule of energy shows up as heat, so the heat exchanged equals the internal-energy change: $ q_V = \\Delta U $.\n\n" +
      "Hold the **pressure** constant instead (an open flask under the atmosphere), and a gas-making reaction now spends part of its energy pushing the air back. The heat you actually measure is no longer $ \\Delta U $ — it is a new quantity, the enthalpy change: $ q_P = \\Delta H $. Enthalpy itself is defined as $ H = U + PV $, where the extra $ PV $ piece is the push-against-the-surroundings part of the budget." },

    // 4 — image: constant V vs constant P
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'Two reaction vessels side by side: a sealed rigid bomb where heat equals delta U, and an open piston flask where heat equals delta H',
      caption: '📸 Same reaction, two conditions — constant volume reads ΔU, constant pressure reads ΔH',
      generation_prompt: 'A clean two-panel comparison diagram on a deep near-black background (#0a0a0a). Left panel "Constant Volume": a thick-walled sealed rigid steel bomb vessel, walls rigid and unmoving, with a reaction inside; an orange heat arrow leaving the vessel labelled q = delta U; a small lock/clamp icon showing the volume cannot change. Right panel "Constant Pressure": an open cylinder fitted with a frictionless piston that has risen upward as gas is produced; an orange heat arrow leaving labelled q = delta H; small amber arrows showing the piston pushing the surrounding air upward. Both vessels drawn in matching scientific-illustration style, glowing orange/amber accents, minimal white labels only (Constant Volume / Constant Pressure). No paragraphs of text.' },

    // 5 — reasoning_prompt (mid-page, after the q_V vs q_P concept)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "For the reaction $ \\ce{N2(g) + O2(g) -> 2NO(g)} $, count the gas moles on each side. Two moles of gas become two moles of gas, so the change in gas moles is zero. With that in mind, how do $ \\Delta H $ and $ \\Delta U $ compare for this reaction?",
      options: [
        "$ \\Delta H $ is larger, because forming a product always needs extra push-work",
        "They are equal, because with no change in gas moles the $ \\Delta n_g RT $ correction term is zero",
        "$ \\Delta U $ is larger, because the bonds store more energy than the heat released",
        "They cannot be compared without knowing the temperature"
      ],
      correct_index: 1,
      reveal: "The gap between $ \\Delta H $ and $ \\Delta U $ comes entirely from the $ \\Delta n_g RT $ term. Here two moles of gas turn into two moles of gas, so $ \\Delta n_g = 2 - 2 = 0 $, the whole correction vanishes, and $ \\Delta H = \\Delta U $. Temperature does sit inside the $ RT $, but it is multiplied by zero — so the answer does not depend on it at all. No net gas is made or destroyed, so there is no extra push-work to account for." },

    // 6 — heading 2
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Real Formula, and the Trap',
      objective: 'Learn the honest definition $ \\Delta H = \\Delta U + \\Delta(PV) $ and see why the popular $ P\\Delta V $ version is only a special case.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Here is the line most students memorise, and it is the one that quietly costs marks:\n\n" +
      "$ \\Delta H = \\Delta U + P\\Delta V $\n\n" +
      "That is not the real definition. The honest version comes straight from $ H = U + PV $ — change everything and you get:\n\n" +
      "$ \\Delta H = \\Delta U + \\Delta(PV) $\n\n" +
      "The term is the **change in the whole product** $ PV $, not just $ P\\Delta V $. Written out, $ \\Delta(PV) = P\\Delta V + V\\Delta P $. The familiar $ P\\Delta V $ form only survives when the pressure is held constant — then $ \\Delta P = 0 $, the bechaara $ V\\Delta P $ term dies, and you are left with $ P\\Delta V $. Use $ P\\Delta V $ when pressure is not constant and your answer is simply wrong.\n\n" +
      "A doubt comes up here every time — *sir, what about the temperature change during the reaction?* That is already counted. It lives inside $ \\Delta U $, which tracks every bit of the system's own energy, temperature included. You do not add it again." },

    // 7 — heading 3
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Reactions with Gases the Delta ng RT Term',
      objective: 'Turn $ \\Delta(PV) $ into the working formula $ \\Delta H = \\Delta U + \\Delta n_g RT $ and know exactly which moles to count.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "For most exam reactions the gases behave ideally, so $ PV = nRT $. At a fixed temperature, $ \\Delta(PV) $ becomes $ \\Delta(nRT) = \\Delta n_g \\, RT $, and the definition turns into the formula you will actually use:\n\n" +
      "$ \\Delta H = \\Delta U + \\Delta n_g RT $\n\n" +
      "Here $ \\Delta n_g $ is the **change in the number of moles of gas**: moles of gaseous products minus moles of gaseous reactants. Two rules decide everything:\n\n" +
      "- **Only gases count.** Solids and liquids barely change volume, so they contribute nothing to the push-work. Ignore them completely when counting $ \\Delta n_g $.\n" +
      "- **Combustion water is liquid.** When a reaction burns to give water, that $ \\ce{H2O} $ is liquid at the standard temperature, not vapour — so it is *not* a gas product and does not go into $ \\Delta n_g $. This single line is where most $ \\Delta n_g $ errors are born." },

    // 8 — worked_example
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Find ΔH − ΔU',
      problem: "For the combustion $ \\ce{CO(g) + 1/2 O2(g) -> CO2(g)} $ at 300 K, find $ \\Delta H - \\Delta U $. Take $ R = 8.314 $ J/(mol·K).",
      solution: "The given is a reaction at a fixed temperature, and the connector between $ \\Delta H $ and $ \\Delta U $ for gases is the $ \\Delta n_g RT $ term. So the whole job is to count gas moles correctly.\n\n" +
        "**Count the gas moles — products.** The only gaseous product is $ \\ce{CO2} $: that is $ 1 $ mole of gas.\n\n" +
        "**Count the gas moles — reactants.** $ \\ce{CO} $ gives $ 1 $ mole and $ \\ce{O2} $ gives $ 0.5 $ mole, so the reactants are $ 1 + 0.5 = 1.5 $ moles of gas.\n\n" +
        "**Find the change in gas moles.** $ \\Delta n_g = 1 - 1.5 = -0.5 $. Fewer gas moles after the reaction — the gas is shrinking, so the atmosphere does work on the system, and you should expect a negative answer.\n\n" +
        "**Apply the formula.** $ \\Delta H - \\Delta U = \\Delta n_g RT = (-0.5)(8.314)(300) $.\n\n" +
        "**Compute.** $ (-0.5)(8.314)(300) \\approx -1247 $ J, which is about $ -1.25 $ kJ.\n\n" +
        "So $ \\Delta H - \\Delta U \\approx -1.25 $ kJ. The thinking is the mole-count; the arithmetic is a few seconds once $ \\Delta n_g $ is right." },

    // 9 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'Carry These Four Lines',
      markdown: "At constant volume the heat is the internal-energy change: $ q_V = \\Delta U $. At constant pressure it is the enthalpy change: $ q_P = \\Delta H $.\n\n" +
        "The honest definition is $ \\Delta H = \\Delta U + \\Delta(PV) $ — never blindly $ P\\Delta V $.\n\n" +
        "For ideal gases at fixed temperature, $ \\Delta H = \\Delta U + \\Delta n_g RT $.\n\n" +
        "Only **gas** moles go into $ \\Delta n_g $; solids and liquids are ignored." },

    // 10 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "This page hides three favourite examiner traps:\n\n" +
        "**The rote-formula trap.** Students write $ \\Delta H = \\Delta U + P\\Delta V $ and apply it everywhere. It is really $ \\Delta H = \\Delta U + \\Delta(PV) $; the extra $ V\\Delta P $ piece only dies when pressure is constant. If a problem changes the pressure, the short version fails.\n\n" +
        "**Counting the wrong moles.** $ \\Delta n_g $ counts gaseous species only. Drop a solid or liquid into the count and the sign of your answer can flip.\n\n" +
        "**Combustion water.** In a combustion at standard temperature the water formed is liquid, never vapour, so it is not a gas product. Slip it into $ \\Delta n_g $ as a gas and the whole $ \\Delta n_g RT $ term goes wrong." },

    // 11 — inline_quiz (always last)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'A reaction is run in a sealed, rigid container so its volume cannot change. The heat it exchanges with the surroundings is equal to which quantity?',
          options: [
            'The enthalpy change, $ \\Delta H $',
            'The internal-energy change, $ \\Delta U $',
            'The push-work, $ P\\Delta V $',
            'The gas-mole change, $ \\Delta n_g RT $'
          ],
          correct_index: 1,
          explanation: 'A rigid container fixes the volume, so the reaction can do no pushing work and every joule shows up as heat — that is $ q_V = \\Delta U $. The enthalpy change $ \\Delta H $ is the heat at constant pressure, which is the open-flask case, not this sealed-volume one.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Which statement about the relation between $ \\Delta H $ and $ \\Delta U $ is correct?',
          options: [
            'The full definition is $ \\Delta H = \\Delta U + \\Delta(PV) $, and $ P\\Delta V $ is the special case when pressure is constant',
            'The full definition is $ \\Delta H = \\Delta U + P\\Delta V $ under all conditions',
            'For solids and liquids the term $ V\\Delta P $ is the one that matters most',
            'Temperature changes during the reaction must be added on top of $ \\Delta U $'
          ],
          correct_index: 0,
          explanation: 'Starting from $ H = U + PV $, the change is $ \\Delta H = \\Delta U + \\Delta(PV) = \\Delta U + P\\Delta V + V\\Delta P $; the $ V\\Delta P $ piece vanishes only when pressure is held constant, leaving $ P\\Delta V $. Writing $ P\\Delta V $ as the universal definition is the common trap. Temperature is already inside $ \\Delta U $, so it is never added again.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'For the combustion of one mole of carbon, $ \\ce{C(s) + O2(g) -> CO2(g)} $, what is the change in the number of moles of gas, $ \\Delta n_g $?',
          options: [
            '$ \\Delta n_g = -1 $, counting the solid carbon as a reactant',
            '$ \\Delta n_g = +1 $, counting the carbon dioxide produced',
            '$ \\Delta n_g = 0 $, since one mole of gas is consumed and one is produced',
            '$ \\Delta n_g = +2 $, counting both reactant and product'
          ],
          correct_index: 2,
          explanation: 'Only gases count. The solid carbon contributes nothing, so the gas reactant is $ 1 $ mole of $ \\ce{O2} $ and the gas product is $ 1 $ mole of $ \\ce{CO2} $, giving $ \\Delta n_g = 1 - 1 = 0 $. Counting the solid carbon as if it were a gas is exactly the mistake that produces $ -1 $.' },
      ] },

    // 12 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You can now read the heat of an open-flask reaction straight off as $ \\Delta H $, and convert between $ \\Delta H $ and $ \\Delta U $ whenever gases change. Next, a closer look at the quantity hiding behind both: **heat capacity** — exactly how much heat a substance needs to warm up, and why warming it at constant pressure always costs more than at constant volume.*" },
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
    slug: NEW_SLUG, title: 'Enthalpy — Heat at Constant Pressure',
    subtitle: 'Most reactions happen in open flasks, not sealed bombs. Enthalpy is the energy built for that everyday case.',
    blocks,
    hinglish_blocks: [], tags: ['thermodynamics', 'enthalpy', 'delta-h', 'delta-ng'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new thermo page 6 (enthalpy, heat at constant pressure)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
