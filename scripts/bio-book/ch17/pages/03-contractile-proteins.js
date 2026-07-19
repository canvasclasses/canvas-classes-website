'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'contractile-proteins',
  title: 'The Contractile Proteins — Actin & Myosin',
  subtitle: "Muscle only shortens because two proteins slide past each other. Before you can understand that sliding, you need to know exactly how these two proteins — actin and myosin — are built, part by part.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['locomotion-and-movement', 'actin-myosin'],
  glossary: [
    { term: "F (filamentous) actin", definition: "A long thread of actin; each thin filament is made of two F-actins wound helically around each other. Each F-actin is itself a polymer of many G-actin monomers." },
    { term: "G (globular) actin", definition: "The small, round monomer unit of actin. Many G-actins join in a chain to make one F-actin." },
    { term: 'tropomyosin', definition: "A protein that runs as two filaments close to the F-actins along their whole length in the thin filament." },
    { term: 'troponin', definition: "A complex protein sitting at regular intervals on the tropomyosin. In the resting state, one of its subunits masks the active binding sites for myosin on the actin filament." },
    { term: 'meromyosin', definition: "The monomeric protein of myosin. Many meromyosins polymerise to form one thick (myosin) filament." },
    { term: 'heavy meromyosin (HMM)', definition: "The globular head plus the short arm of a meromyosin. It projects out from the myosin filament as the cross arm, and its head is an ATPase enzyme with binding sites for ATP and active sites for actin." },
    { term: 'light meromyosin (LMM)', definition: "The tail part of a meromyosin." },
    { term: 'cross arm', definition: "The name for the HMM (head + short arm) where it sticks outwards at regular distance and angle from the surface of the polymerised myosin filament." },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'Close, atmospheric view of fine protein filaments running in parallel through muscle tissue, softly lit against darkness',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). An extreme close-up, painterly impression of the inside of a muscle: fine parallel protein threads — some thin, some thicker — running lengthwise through the frame, softly catching warm light against deep shadow. The threads suggest an ordered, woven, rope-like architecture without becoming a literal labelled diagram. Deep dark background throughout (#0a0a0a base tones), subtle warm highlights along the filaments, atmospheric depth of field. Painterly, atmospheric illustration style, no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Every Movement You Make Runs on Two Proteins',
      markdown: "Blinking, gripping a pen, the beat of your heart right now — all of it comes down to two proteins sliding past each other inside your muscles. Their names are **actin** and **myosin**. NEET keeps coming back to how each one is built, because you cannot understand *how muscle shortens* until you know *what it is made of*. So we start with the parts.",
    },
    // ── 2 · Core concept — the two filaments ─────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Inside a muscle fibre there are two kinds of protein filaments lying side by side. One is thin, the other is thick. The **thin filament** is made of the protein **actin** (plus two helper proteins riding on it). The **thick filament** is made of the protein **myosin**. These two are called the **contractile proteins** because their sliding is what actually contracts the muscle.\n\nBoth filaments are built the same basic way — small monomer units joined up into a long chain. Learn each one part by part, and the machinery of movement stops being a mystery.",
    },
    // ── 3 · Heading — the thin filament ──────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Thin Filament: Actin',
      objective: "By the end of this you can name every protein in the thin filament and say exactly what troponin is doing while the muscle rests.",
    },
    // ── 4 · Text — actin structure ───────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Start with the actin itself. Each **actin (thin) filament** is made of **two 'F' (filamentous) actins** wound helically around each other — picture two threads twisted together like a rope. And each of those F-actins is not solid; it is a **polymer of monomeric 'G' (globular) actins** — many small round beads (G-actin) strung into a long chain (F-actin).\n\nNow add the two helpers. Running close to the F-actins along their entire length are **two filaments of another protein, tropomyosin**. And sitting on top of the tropomyosin, spaced out **at regular intervals**, is a complex protein called **troponin**.\n\nHere is the part NEET loves. **In the resting state, a subunit of troponin masks the active binding sites for myosin on the actin filament.** In plain words: while the muscle is relaxed, troponin sits like a cap over the exact spots where myosin would grab the actin — so myosin cannot latch on, and no contraction happens. Remember this; it is the switch the whole contraction mechanism turns on next page.",
    },
    // ── 5 · Heading — the thick filament ─────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'The Thick Filament: Myosin',
      objective: "By the end of this you can break a myosin molecule into HMM and LMM and say why its head is called an enzyme.",
    },
    // ── 6 · Text — myosin structure ──────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "The **myosin (thick) filament** is also a polymerised protein — many monomer units joined together. Its monomer is called a **meromyosin**, and many meromyosins make up one thick filament.\n\nLook at a single meromyosin and you will see **two parts**:\n\n- A **globular head with a short arm** — this front portion is the **heavy meromyosin (HMM)**.\n- A **tail** — this trailing portion is the **light meromyosin (LMM)**.\n\nThe HMM (the head and short arm) does not lie flat. It **projects outwards at regular distance and angle** from the surface of the polymerised myosin filament, and in that projecting position it is given a special name — the **cross arm**. Picture rows of tiny arms sticking out along the thick filament, all reaching toward the neighbouring actin.\n\nThe most tested detail is the head itself. **The globular head is an active ATPase enzyme, and it carries binding sites for ATP and active sites for actin.** So the head is both a tool that can break down ATP for energy *and* the hand that grips the actin — which is exactly why it has to reach across as the cross arm.",
    },
    // ── 7 · Interactive image — Figure 17.3 ──────────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'Structure of the contractile proteins: an actin thin filament showing two F-actins of G-actin beads with tropomyosin and troponin, beside a myosin meromyosin monomer showing head, cross arm and tail',
      caption: '📸 Tap each dot to explore the parts of the thin (actin) and thick (myosin) filaments.',
      generation_prompt: "Scientific textbook illustration of the contractile proteins of muscle (NCERT Figure 17.3 style). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. LEFT (a): an actin thin filament shown as two helically wound chains of small round beads (each bead = a G-actin monomer, the two twisted chains = two F-actins); two thin continuous filaments of tropomyosin running alongside the whole length; small distinct troponin complexes sitting at regular intervals on the tropomyosin, one of them shown capping/masking a binding site. RIGHT (b): a single myosin meromyosin monomer drawn sideways — a rounded globular head (magenta/pink) on a short arm at the front (labelled heavy meromyosin / cross arm), tapering into a long straight tail behind it (labelled light meromyosin); small marked spots on the head for the ATP binding site and the actin binding site. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.12, y: 0.35, label: "Two F-actins", detail: "The thin filament is **two 'F' (filamentous) actins** wound helically around each other — two threads twisted like a rope.", icon: 'circle' },
        { id: uuid(), x: 0.20, y: 0.62, label: "G-actin monomers", detail: "Each F-actin is a **polymer of monomeric 'G' (globular) actins** — many small round beads strung into the long chain.", icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.28, label: "Tropomyosin", detail: "**Two filaments of tropomyosin** run close to the F-actins along their whole length.", icon: 'circle' },
        { id: uuid(), x: 0.36, y: 0.50, label: "Troponin (masking)", detail: "A complex protein at regular intervals on the tropomyosin. **At rest, a subunit of troponin masks the active binding sites for myosin** on the actin filament.", icon: 'circle' },
        { id: uuid(), x: 0.74, y: 0.30, label: "Globular head (HMM)", detail: "The head plus its short arm is the **heavy meromyosin (HMM)**. It projects out as the **cross arm**. The head is an active **ATPase enzyme**.", icon: 'circle' },
        { id: uuid(), x: 0.68, y: 0.52, label: "ATP & actin sites", detail: "The globular head carries **binding sites for ATP** and **active sites for actin** — it powers itself and grips the actin.", icon: 'circle' },
        { id: uuid(), x: 0.90, y: 0.66, label: "Tail (LMM)", detail: "The trailing tail of the meromyosin is the **light meromyosin (LMM)**.", icon: 'circle' },
      ],
    },
    // ── 8 · Comparison card — actin vs myosin ────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 8,
      title: 'Actin (thin) vs Myosin (thick) filament',
      columns: [
        {
          heading: 'Actin — thin filament',
          points: [
            "Made of two F (filamentous) actins wound helically together",
            "Each F-actin is a polymer of monomeric G (globular) actins",
            "Two tropomyosin filaments run alongside its whole length",
            "Troponin sits at regular intervals on the tropomyosin",
            "At rest, a troponin subunit masks the myosin-binding sites",
            "The thinner of the two filaments",
          ],
        },
        {
          heading: 'Myosin — thick filament',
          points: [
            "A polymerised protein made of many monomeric meromyosins",
            "HMM = globular head + short arm; projects out as the cross arm",
            "The head is an active ATPase enzyme",
            "The head has binding sites for ATP and active sites for actin",
            "LMM = the tail of the meromyosin",
            "The thicker of the two filaments",
          ],
        },
      ],
    },
    // ── 9 · Reasoning prompt — troponin's job ────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A muscle fibre is completely relaxed. The myosin heads are near the actin but no contraction is happening. According to NCERT, what is stopping the myosin from gripping the actin right now?",
      options: [
        "A subunit of troponin is masking the active binding sites for myosin on the actin filament",
        "The tropomyosin has broken away from the F-actins, leaving no track for myosin to follow",
        "The globular head has run out of ATP, so it cannot act as an ATPase enzyme",
        "The two F-actins have unwound from each other, so the binding sites are not yet formed",
      ],
      reveal: "The first option is right. NCERT states plainly that in the resting state a subunit of troponin masks the active binding sites for myosin on the actin filament — so the sites physically exist but are capped, and myosin cannot latch on. The tempting wrong answer is the third one about ATP, because we just learned the head is an ATPase with ATP-binding sites — but NCERT never says a lack of ATP is what keeps a resting muscle relaxed; the block is troponin covering the sites, not an empty fuel tank. Tropomyosin does not break away, and the F-actins stay wound together — those options invent damage NCERT never describes.",
      difficulty_level: 2,
    },
    // ── 10 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Thin filament (actin)** = **two F-actins** wound helically; each **F-actin** is a polymer of **G-actin** monomers.\n- Add **two tropomyosin** filaments along its length + **troponin** at regular intervals on the tropomyosin.\n- **At rest, a troponin subunit masks the myosin-binding sites** on actin. (This is the switch.)\n- **Thick filament (myosin)** = polymerised protein of many **meromyosin** monomers.\n- **HMM** = globular **head + short arm** = the **cross arm**; the head is an **ATPase enzyme** with **binding sites for ATP** and **active sites for actin**.\n- **LMM** = the **tail**.",
    },
    // ── 11 · Exam tip ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Troponin is the trap:** NEET repeatedly tests that at rest it is troponin — not tropomyosin, not ATP — that masks the active binding sites for myosin on actin. Don't confuse the two 'T' proteins: tropomyosin is the long filament running alongside; troponin is the complex sitting on it at intervals that does the masking.\n\n**Know the head's two jobs:** the myosin globular head is an ATPase enzyme *and* carries active sites for actin. \"Enzyme + actin-gripper in one part\" is a favourite MCQ.\n\n**Classic NEET question:** \"At rest, the active sites for myosin on the actin filament are masked by ___\" → **a subunit of troponin.** And its partner: \"The globular head of myosin acts as a(n) ___ enzyme\" → **ATPase.**",
    },
    // ── 12 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "You now have every part in hand — two F-actins of G-actin beads, tropomyosin and its troponin cap, and the meromyosin thick filament with its ATPase cross-arm head. Next you'll watch these pieces move: how the thin filaments slide over the thick filaments to actually shorten the muscle.",
    },
    // ── 13 · Inline quiz (LAST) ──────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "How is a single actin (thin) filament built, according to NCERT?",
          options: [
            "Two F (filamentous) actins wound helically together, each F-actin being a polymer of G (globular) actin monomers",
            "Two G (globular) actins wound together, each being a polymer of F (filamentous) actin monomers",
            "Many meromyosins polymerised into a single helical chain of globular beads",
            "A single F-actin chain wrapped in two continuous layers of troponin",
          ],
          correct_index: 0,
          explanation: "NCERT is exact: two F-actins wound helically, and each F-actin is a polymer of G-actin monomers. Option 2 swaps F and G. Option 3 describes the myosin filament (meromyosins), not actin. Option 4 confuses troponin — which sits at intervals, not as a continuous double wrap — for the actin chains.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "In a resting muscle, what prevents myosin from binding to actin?",
          options: [
            "Tropomyosin dissolves and physically blocks the whole thin filament",
            "A subunit of troponin masks the active binding sites for myosin on the actin filament",
            "The globular head loses its ATP-binding site until the muscle is stimulated",
            "The cross arms retract fully inside the thick filament and cannot reach the actin",
          ],
          correct_index: 1,
          explanation: "NCERT states that in the resting state a subunit of troponin masks the active binding sites for myosin on the actin filament. Option 1 wrongly blames tropomyosin (the long filament, not the masking protein). Options 3 and 4 invent mechanisms NCERT never mentions — the ATP site and the cross arms are not described as switching off at rest.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which statement about a meromyosin's parts is correct?",
          options: [
            "The tail is the heavy meromyosin (HMM) and the globular head is the light meromyosin (LMM)",
            "Both the head and the tail together form the cross arm that grips actin",
            "The globular head with its short arm is the heavy meromyosin (HMM) and forms the cross arm; the tail is the light meromyosin (LMM)",
            "The light meromyosin (LMM) is the ATPase enzyme with binding sites for ATP and actin",
          ],
          correct_index: 2,
          explanation: "NCERT: the globular head with a short arm is the HMM (which projects out as the cross arm), and the tail is the LMM. Option 1 swaps HMM and LMM. Option 2 wrongly includes the tail in the cross arm — only the projecting head-and-short-arm is the cross arm. Option 4 misplaces the ATPase activity, which belongs to the head (part of HMM), not the LMM tail.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "The globular head of the myosin filament is best described as which of these?",
          options: [
            "A structural anchor with no enzyme activity, holding the thick filament to the thin filament",
            "An active ATPase enzyme carrying binding sites for ATP and active sites for actin",
            "A polymer of G-actin monomers that stores ATP for the whole filament",
            "The masking protein that covers the binding sites during rest",
          ],
          correct_index: 1,
          explanation: "NCERT states the globular head is an active ATPase enzyme and has binding sites for ATP and active sites for actin — so it both breaks down ATP for energy and grips the actin. Option 1 denies its enzyme role. Option 3 confuses it with G-actin, a completely different protein. Option 4 describes troponin's resting job, not the myosin head.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
