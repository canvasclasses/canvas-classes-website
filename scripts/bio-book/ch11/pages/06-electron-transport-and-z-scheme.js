'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'electron-transport-and-z-scheme',
  title: 'Electron Transport & the Z-Scheme',
  subtitle: "Two photosystems, red light of two different wavelengths, and a zig-zag path that ends in NADPH — plus the moment water is split and the oxygen you breathe is released. This is the exact story NEET tests, in the exact order it happens.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['photosynthesis-in-higher-plants', 'z-scheme'],
  glossary: [
    { term: 'photosystem II (PS II)', definition: 'The photosystem whose reaction-centre chlorophyll a absorbs 680 nm red light. It acts first in the Z-scheme, and it is where water is split.' },
    { term: 'photosystem I (PS I)', definition: 'The photosystem whose reaction-centre chlorophyll a absorbs 700 nm red light. It receives electrons from PS II and finally passes them to NADP+.' },
    { term: 'electron acceptor', definition: 'A molecule that picks up an excited electron from a reaction centre and hands it onward — to the electron transport system (from PS II) or toward NADP+ (from PS I).' },
    { term: 'electron transport system', definition: 'A chain of carriers, consisting of cytochromes, down which electrons move from PS II to PS I. The movement is downhill on the redox potential scale.' },
    { term: 'redox potential scale', definition: 'The oxidation-reduction scale on which the electron carriers are arranged. Plotting the whole path of electrons on it produces the characteristic Z shape.' },
    { term: 'Z-scheme', definition: 'The full path of electrons: PS II → uphill to an acceptor → down the electron transport chain to PS I → excited again → to another acceptor → downhill to NADP+, reducing it to NADPH + H+. Named for the Z shape it makes on a redox scale.' },
    { term: 'splitting of water', definition: 'The reaction 2H2O → 4H+ + O2 + 4e-, associated with PS II and located on the inner side of the thylakoid membrane. It resupplies PS II with electrons and creates the oxygen of photosynthesis.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A zig-zag stream of glowing particles rising and falling across a dark thylakoid membrane, suggesting electrons moving between two light-catching centres',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). Inside a chloroplast at the level of a single thylakoid membrane, rendered as a soft dark green-black band across the frame. A stream of small glowing particles traces a zig-zag path — rising sharply, sliding down a gentle slope, rising sharply again — like energy leaping between two hidden points of light embedded in the membrane. Two faint warm-red glows sit beneath the membrane where the leaps begin, suggesting light being absorbed, without any literal labels or diagram parts. Deep shadows fill the rest of the frame. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Every Breath You Take Started With a Water Molecule Being Torn Apart',
      markdown: "The oxygen filling your lungs right now was not made from carbon dioxide, and it did not come from the sugar the plant builds. It came from **water** — split apart inside a leaf on the inner side of a membrane, one reaction, again and again, releasing the **O2** that every animal on Earth breathes. On this page you'll watch exactly where that split happens and why the plant is forced to do it.",
    },
    // ── 2 · Core concept — excited electrons in PS II ────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Light doesn't just warm a leaf — it knocks electrons loose. Inside **photosystem II (PS II)**, the reaction-centre **chlorophyll a** absorbs red light of **680 nm** wavelength. That energy makes its electrons **become excited** and jump into an orbit farther from the atomic nucleus.\n\nThose excited electrons don't fly off and vanish. They are caught by an **electron acceptor**, which passes them on to an **electron transport system** — a chain of carriers made of **cytochromes**. As the electrons travel down this chain, they move **downhill** on the oxidation-reduction (redox) potential scale, like a ball rolling down a slope. Here's the key point students miss: **the electrons are not used up** as they pass through. They are simply handed onward — to **photosystem I (PS I)**.",
    },
    // ── 3 · Heading — the Z-scheme ────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Z-Scheme — Two Uphill Jumps, Two Downhill Slides',
      objective: "By the end of this you can trace an electron from PS II all the way to NADPH in the right order, and explain why the whole path is drawn as the letter Z.",
    },
    // ── 4 · Text — PS I, second excitation, to NADP+ ─────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "When the electrons arrive at **PS I**, they get a second boost. The reaction-centre electrons of PS I are **excited** by red light of **700 nm** wavelength and are transferred to **another electron acceptor** — one that sits at a **greater redox potential**. From there the electrons move **downhill again**, this time all the way to a molecule of energy-rich **NADP+**. Adding those electrons **reduces NADP+ to NADPH + H+**.\n\nNow step back and look at the whole journey: start at **PS II** → **uphill** to an acceptor → **down** the electron transport chain to **PS I** → **excited again** → to **another acceptor** → **downhill** to **NADP+**, reducing it to **NADPH**. Draw that sequence of ups and downs with all the carriers placed in order on a **redox potential scale**, and it traces out the shape of the letter **Z**. That is why the entire path is called the **Z-scheme**.",
    },
    // ── 5 · Interactive image — Figure 11.5 Z scheme ─────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'The Z-scheme of the light reaction: PS II (P680) raises an electron to an acceptor, it flows down the cytochrome electron transport chain to PS I (P700), is excited again to a second acceptor, then flows downhill to NADP+ forming NADPH; water is split at PS II releasing O2',
      caption: '📸 Tap each dot to follow one electron from the moment light hits PS II to the moment NADP+ becomes NADPH — and see where water is split.',
      generation_prompt: "Scientific textbook illustration of the Z-scheme of the light reaction of photosynthesis (NCERT Figure 11.5 style). Flat 2D educational diagram on a dark background (#0a0a0a near-black). A vertical redox-potential axis on the left. Two light-catching reaction centres drawn as green rounded boxes: on the left 'Photosystem II (P680)', on the right 'Photosystem I (P700)'. From PS II a steep upward white arrow rises to a small 'electron acceptor' node, then a long gently downhill white arrow slopes rightward through a labelled 'electron transport system (cytochromes)' down to PS I; from PS I a second steep upward white arrow rises to another 'electron acceptor' node, then a downhill white arrow leads to a blue 'NADP+' node becoming 'NADPH'. Below PS II, a blue water droplet labelled with '2H2O → 4H+ + O2 + 4e-' on the inner membrane side, with a small O2 bubble rising. Clean white outlines, white label text with thin white leader lines. green=photosystems/living, blue=water and NADP, functional flat colours. Overall the arrows trace a zig-zag Z shape. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.14, y: 0.62, label: 'PS II — P680', detail: "Photosystem II. Its reaction-centre chlorophyll a absorbs **680 nm** red light. This is where the Z-scheme **begins** — PS II acts before PS I, even though PS I was named first.", icon: 'circle' },
        { id: uuid(), x: 0.28, y: 0.20, label: 'Electron acceptor (uphill)', detail: "The excited PS II electron jumps **uphill** to an electron acceptor. This is the first steep rise of the Z.", icon: 'circle' },
        { id: uuid(), x: 0.48, y: 0.44, label: 'Electron transport system (cytochromes)', detail: "The electrons slide **downhill** on the redox scale through a chain of **cytochromes**. They are **not used up** here — they are passed on toward PS I.", icon: 'circle' },
        { id: uuid(), x: 0.66, y: 0.62, label: 'PS I — P700', detail: "Photosystem I. Its reaction-centre electrons are excited by **700 nm** red light. PS I receives its electrons from PS II via the electron transport system.", icon: 'circle' },
        { id: uuid(), x: 0.80, y: 0.20, label: 'Second acceptor (uphill again)', detail: "The re-excited electron jumps **uphill** again to another acceptor that has a **greater redox potential** — the second rise of the Z.", icon: 'circle' },
        { id: uuid(), x: 0.93, y: 0.40, label: 'NADP+ → NADPH + H+', detail: "The electron moves **downhill** one last time to **NADP+**, reducing it to **NADPH + H+** — the energy-rich product the plant carries into the next stage.", icon: 'circle' },
        { id: uuid(), x: 0.14, y: 0.88, label: 'Splitting of water at PS II', detail: "On the **inner side of the thylakoid membrane**, water is split: **2H2O → 4H+ + O2 + 4e-**. These electrons replace the ones PS II lost, and the reaction releases the **O2** of photosynthesis.", icon: 'circle' },
      ],
    },
    // ── 6 · Heading — Splitting of water ──────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Splitting of Water — Where PS II Refills, and Where the Oxygen Comes From',
      objective: "By the end of this you can write the water-splitting equation, say which photosystem it belongs to and which side of the membrane it sits on, and trace exactly which electrons get replaced by what.",
    },
    // ── 7 · Text — 11.6.1 water splitting ─────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "There's an obvious problem with everything above. PS II keeps handing its electrons away — so how does it supply electrons **continuously** without running dry? The electrons that leave PS II have to be **replaced**, and the plant replaces them by **splitting water**.\n\nThe **splitting of water is associated with PS II**, and it happens on the **inner side of the thylakoid membrane** — the lumen side. Water is split into hydrogen ions, oxygen and electrons:\n\n**2H2O → 4H+ + O2 + 4e-**\n\nThose electrons flow straight into PS II to replace the ones it lost. This same reaction **creates the oxygen** — one of the net products of photosynthesis. Read the replacement chain carefully, because NEET loves this trap: the electrons removed from **PS I** are replaced by **PS II** (through the electron transport system), and the electrons removed from **PS II** are replaced by the **splitting of water**. Water refills PS II, PS II refills PS I.",
    },
    // ── 8 · Comparison card — who gets replaced by what ──────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 8,
      title: 'Which Photosystem Is Refilled by What',
      columns: [
        { heading: 'PS II — electrons replaced by SPLITTING OF WATER', points: [
          'PS II loses electrons after 680 nm light excites them.',
          'Its electrons are replaced by the splitting of water: 2H2O → 4H+ + O2 + 4e-.',
          'This split happens on the inner (lumen) side of the thylakoid membrane.',
          'This is the reaction that releases the O2 of photosynthesis.',
        ] },
        { heading: 'PS I — electrons replaced by PS II', points: [
          'PS I loses electrons after 700 nm light excites them and sends them toward NADP+.',
          'Its electrons are replaced by PS II, delivered down the electron transport system (cytochromes).',
          'So PS I is not refilled by water directly — it is refilled by PS II.',
          'Water → refills PS II → PS II refills PS I. Keep the order straight.',
        ] },
      ],
    },
    // ── 9 · Reasoning prompt — replacement / order check ─────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "In the Z-scheme, PS I sends electrons on to NADP+ and is left short of electrons. Where do the electrons that replace PS I's lost electrons come from?",
      options: [
        "Directly from the splitting of water on the inner side of the thylakoid membrane",
        "From photosystem II, delivered down the electron transport system of cytochromes",
        "From NADPH flowing backward into PS I",
        "From the 700 nm red light being converted straight into electrons",
      ],
      reveal: "The correct answer is PS II (option 2). NCERT states plainly that the electrons needed to replace those removed from PS I are provided by PS II — they arrive down the electron transport system of cytochromes. The tempting wrong answer is option 1: water-splitting does refill electrons, but it refills PS II, not PS I. The chain is: water → PS II → PS I. Option 3 reverses the flow (NADPH is the end product, it doesn't run backward), and option 4 misreads light as a source of electrons rather than the energy that excites them.",
      difficulty_level: 3,
    },
    // ── 10 · Remember callout ───────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Z-scheme order:** PS II (P680, 680 nm) → uphill to acceptor → down the **electron transport system (cytochromes)** → PS I (P700, 700 nm) → excited again → to another acceptor → downhill to **NADP+** → **NADPH + H+**.\n- **PS II acts FIRST**, even though PS I was named first. Don't let the numbers fool you.\n- **Water-splitting equation:** **2H2O → 4H+ + O2 + 4e-**. Memorise it exactly.\n- **Splitting of water is associated with PS II**, on the **inner (lumen) side** of the thylakoid membrane.\n- **The O2 of photosynthesis comes from the splitting of water** — not from CO2, not from sugar.\n- **Replacement chain:** water refills **PS II**; PS II refills **PS I**.",
    },
    // ── 11 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**680 nm vs 700 nm:** PS II absorbs **680 nm**, PS I absorbs **700 nm**. Swapping these two numbers is one of the most common wrong answers on this topic — pair each wavelength with the right photosystem.\n\n**The Z shape is about a redox scale:** the path only looks like a Z when the carriers are arranged on the **oxidation-reduction (redox) potential** scale — two uphill excitations, two downhill slides.\n\n**Classic NEET question:** \"Splitting of water is associated with which photosystem?\" → **PS II** (on the inner side of the thylakoid membrane) — and a close follow-up, \"In the Z-scheme, which photosystem functions first?\" → **PS II**, not PS I.",
    },
    // ── 12 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "You've now followed the electrons from PS II all the way to NADPH, and seen where the oxygen is set free. But notice we quietly picked up an **ATP** along the way — and sometimes the electrons take a shorter loop instead of the full Z. Next, you'll see how the plant actually banks that energy: cyclic and non-cyclic **photophosphorylation**, and the chemiosmosis that makes the ATP.",
    },
    // ── 13 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "In the Z-scheme of the light reaction, which photosystem functions first, and what wavelength does its reaction centre absorb?",
          options: [
            "PS I functions first, absorbing 700 nm red light",
            "PS II functions first, absorbing 680 nm red light",
            "PS I functions first, absorbing 680 nm red light",
            "PS II functions first, absorbing 700 nm red light",
          ],
          correct_index: 1,
          explanation: "The Z-scheme starts at PS II, whose reaction-centre chlorophyll a absorbs 680 nm red light — PS II acts before PS I despite PS I's lower number. The common trap is option 1: PS I does absorb 700 nm, but it acts second, receiving electrons from PS II. Options 3 and 4 mismatch each photosystem with the wrong wavelength.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "The splitting of water in photosynthesis is correctly described by which statement?",
          options: [
            "It is associated with PS I and occurs on the outer surface of the thylakoid membrane",
            "It is associated with PS II and occurs on the inner side of the thylakoid membrane, following 2H2O → 4H+ + O2 + 4e-",
            "It is associated with PS I and produces CO2 as a net product",
            "It is associated with PS II but takes place in the stroma, releasing hydrogen only",
          ],
          correct_index: 1,
          explanation: "NCERT ties water-splitting to PS II, on the inner side of the thylakoid membrane, by the equation 2H2O → 4H+ + O2 + 4e-. Option 1 wrongly assigns it to PS I and the outer surface. Option 3 wrongly assigns it to PS I and claims CO2 (the product is O2, not CO2). Option 4 keeps PS II but wrongly moves it to the stroma and drops the oxygen.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "The oxygen released during photosynthesis comes directly from which source?",
          options: [
            "The carbon dioxide absorbed by the leaf",
            "The glucose molecule built during photosynthesis",
            "The splitting of water associated with PS II",
            "The reduction of NADP+ to NADPH at PS I",
          ],
          correct_index: 2,
          explanation: "The O2 of photosynthesis is created by the splitting of water (2H2O → 4H+ + O2 + 4e-), which is associated with PS II. It does not come from CO2 (a frequent misconception, option 1), from the sugar the plant makes (option 2), or from the NADP+ reduction step at PS I (option 4), which involves electrons and NADPH, not oxygen release.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "As excited electrons pass down the electron transport system of cytochromes from PS II toward PS I, what happens to them?",
          options: [
            "They are used up and destroyed within the cytochrome chain",
            "They move uphill on the redox scale and are stored in PS I",
            "They move downhill on the redox scale and are passed on, unused, to PS I",
            "They are returned to the water molecule that released them",
          ],
          correct_index: 2,
          explanation: "NCERT is explicit: this movement of electrons is downhill on the redox potential scale, and the electrons are not used up as they pass through — they are passed on to PS I. Option 1 contradicts 'not used up'. Option 2 reverses the direction (the transport through cytochromes is downhill, the excitations are the uphill jumps). Option 4 invents a return to water that does not happen — water splitting supplies new electrons, it doesn't take them back.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
