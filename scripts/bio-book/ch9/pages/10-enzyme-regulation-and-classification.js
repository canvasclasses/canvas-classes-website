'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'enzyme-regulation-and-classification',
  title: 'Enzymes II — Regulation, Classes & Cofactors',
  subtitle: "An enzyme is only as good as the shape it holds. Heat it, change its pH, flood it with substrate, or slip in a look-alike molecule — and you control whether it works at all. Here's how that control works, how all enzymes are sorted into six families, and the non-protein helpers many of them can't work without.",
  page_number: 10,
  page_type: 'lesson',
  tags: ['biomolecules', 'enzymes', 'cofactors'],
  glossary: [
    { term: 'optimum temperature and optimum pH', definition: 'The particular temperature and pH at which an enzyme shows its highest activity. Activity declines both below and above the optimum value.' },
    { term: 'Vmax (maximum velocity)', definition: 'The top speed of an enzyme-catalysed reaction. Once the enzyme molecules are saturated with substrate, adding more substrate cannot push the reaction any faster.' },
    { term: 'inhibitor', definition: 'A chemical that binds to an enzyme and shuts off its activity. The process of shutting off is called inhibition.' },
    { term: 'competitive inhibitor', definition: 'An inhibitor that closely resembles the substrate in molecular structure and competes with it for the substrate-binding (active) site — e.g. malonate competing with succinate on succinic dehydrogenase.' },
    { term: 'cofactor', definition: 'A non-protein constituent bound to an enzyme to make it catalytically active. Removing it makes the enzyme lose its catalytic activity.' },
    { term: 'apoenzyme', definition: 'The protein portion of an enzyme, once a cofactor is bound to it.' },
    { term: 'prosthetic group', definition: 'An organic cofactor that is tightly bound to the apoenzyme — e.g. haem in peroxidase and catalase.' },
    { term: 'co-enzyme', definition: 'An organic cofactor whose association with the apoenzyme is only transient, occurring during catalysis; many contain vitamins — e.g. NAD and NADP contain niacin.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single glowing folded protein shape at the centre of a dark scene, with faint dials for temperature and pH suggested in the shadows around it',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single softly glowing, intricately folded protein shape floats at the centre of an otherwise dim, dark scene. Around it in the deep shadows, faint suggestions of control dials and a rising-then-falling curve are hinted at, as if unseen conditions are gently turning the protein's shape — without becoming a literal labelled diagram or chart. Warm amber highlights catch the folds of the protein; the rest of the frame falls into deep shadow. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no axes, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'A Fever Is Your Enzymes Walking a Tightrope',
      markdown: "Your body holds itself at about 37 °C for a reason. The enzymes running every reaction inside you each have one temperature where they work best — and heat past it doesn't just slow them down, it **destroys** them, because the heat unfolds the protein for good. That's why a high fever is dangerous: push your internal temperature too far and the very enzymes keeping you alive start falling apart, one denatured protein at a time.",
    },
    // ── 2 · Core concept — activity depends on shape ─────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "On the last page you saw that an enzyme works because of its precise folded **tertiary structure** — the exact pocket its active site forms. So here's the key idea for this whole page: **anything that alters that tertiary structure changes the enzyme's activity.**\n\nFour things can do it: **temperature**, **pH**, the **concentration of substrate**, and the **binding of specific chemicals** that regulate the enzyme. Get any of these wrong and the enzyme works slower, or stops entirely. Let's take them one at a time.",
    },
    // ── 3 · Heading — temperature, pH, substrate ─────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'What Speeds an Enzyme Up — and What Shuts It Down',
      objective: "By the end of this you can explain why enzyme activity rises to a peak and then falls with temperature and pH, and why the reaction speed hits a ceiling (Vmax) no matter how much substrate you add.",
    },
    // ── 4 · Text — temperature & pH ──────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Enzymes work in only a **narrow range** of temperature and pH. Each enzyme has one **optimum temperature** and one **optimum pH** where it shows its highest activity — and activity **declines both below and above** that optimum. The graphs are bell-shaped: they climb to a peak, then fall.\n\nTemperature is worth reading carefully, because low and high do different things. **Low temperature** keeps the enzyme in a *temporarily inactive* state — cool it and it slows or stops, but warm it back and it recovers. **High temperature is not reversible: it destroys enzymatic activity, because the heat denatures the protein** — it unfolds the tertiary structure permanently, and the active site is gone for good. This is the difference between putting food in the fridge (paused) and cooking it (changed forever)."
    },
    // ── 5 · Text — substrate concentration & Vmax ────────────────────────────
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "Now hold temperature and pH steady and just keep adding **more substrate**. At first the reaction speeds up — more substrate means more collisions with enzyme, so the **velocity rises**. But it doesn't rise forever. It climbs to a **maximum velocity, Vmax**, and no further increase in substrate can push past it.\n\nWhy the ceiling? Because the **enzyme molecules are fewer than the substrate molecules**. Once every enzyme is busy — *saturated* — there are no free enzyme molecules left to grab the extra substrate. The extra substrate just waits its turn. That plateau is Vmax, and it's set by how many enzyme molecules you have, not how much substrate you pile on."
    },
    // ── 6 · Interactive image — Figure 9.5 enzyme-activity graphs ─────────────
    {
      id: uuid(), type: 'interactive_image', order: 6, src: '',
      alt: 'Three enzyme-activity graphs side by side: enzyme activity versus pH (bell curve), enzyme activity versus temperature (bell curve), and velocity of reaction versus substrate concentration rising to a Vmax plateau',
      caption: '📸 Tap each dot to explore how pH, temperature, and substrate concentration each shape enzyme activity (NCERT Figure 9.5).',
      generation_prompt: "Scientific textbook illustration of three enzyme-activity graphs arranged side by side in one wide panel. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, thin white axes and leader lines, labels in white text. Graph (a): y-axis 'Enzyme activity', x-axis 'pH' — a smooth symmetric bell-shaped curve peaking in the middle. Graph (b): y-axis 'Enzyme activity', x-axis 'Temperature' — a smooth symmetric bell-shaped curve peaking in the middle. Graph (c): y-axis 'Velocity of reaction (V)', x-axis 'Substrate concentration [S]' — a curve that rises steeply then levels off into a flat horizontal plateau, with a dashed horizontal line marking 'Vmax' at the plateau and a dashed line marking 'Vmax/2'. Curves drawn in a soft amber/green line colour against the dark background. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.15, y: 0.30, label: 'Optimum pH', detail: "The top of the pH bell curve. This is the single pH at which the enzyme works fastest; move to either side and activity falls off because the change in pH alters the enzyme's tertiary structure.", icon: 'circle' },
        { id: uuid(), x: 0.15, y: 0.75, label: 'Falls off on both sides', detail: "Activity declines **below and above** the optimum. An enzyme works only in a narrow pH range — this is why stomach and intestinal enzymes have different optimum pH values.", icon: 'circle' },
        { id: uuid(), x: 0.48, y: 0.30, label: 'Optimum temperature', detail: "The peak of the temperature bell curve — highest activity at one particular temperature. Cool below it and the enzyme goes temporarily inactive; heat above it and the protein is denatured and destroyed.", icon: 'circle' },
        { id: uuid(), x: 0.82, y: 0.28, label: 'Vmax — the ceiling', detail: "The flat plateau of the substrate graph. Once every enzyme molecule is saturated with substrate, the reaction can't go any faster — Vmax is the maximum velocity, no matter how much more substrate you add.", icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.70, label: 'Velocity rises first', detail: "At low substrate concentration, adding substrate speeds the reaction up because free enzyme molecules are still available to bind it. The rise is steep here, before saturation kicks in.", icon: 'circle' },
      ],
    },
    // ── 7 · Heading — inhibition ──────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Inhibition — Jamming the Lock with a Fake Key',
      objective: "By the end of this you can define an inhibitor, explain how a competitive inhibitor works, and give NCERT's exact example.",
    },
    // ── 8 · Text — inhibition & competitive inhibitor ────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "The fourth control is chemical. When a chemical binds to an enzyme and **shuts off its activity**, the process is called **inhibition**, and the chemical is called an **inhibitor**.\n\nOne kind matters most for NEET: the **competitive inhibitor**. It **closely resembles the substrate** in its molecular structure. Because it looks so much like the real substrate, it **competes with the substrate for the substrate-binding site** — the active site — and sits in it. Now the real substrate can't get in, so the enzyme's action **declines**.\n\nNCERT's exact example, and the one you must memorise: **malonate inhibits succinic dehydrogenase**, because malonate closely resembles that enzyme's real substrate, **succinate**, in structure. This is not just textbook trivia — **competitive inhibitors are often used to control bacterial pathogens**, by jamming an enzyme the bacteria need."
    },
    // ── 9 · Heading — six classes ─────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'Every Enzyme Fits Into One of Six Families',
      objective: "By the end of this you can name all six enzyme classes in order and say the type of reaction each one catalyses.",
    },
    // ── 10 · Text — classification & nomenclature ────────────────────────────
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "Thousands of enzymes have been discovered. To keep track of them, they're **classified by the type of reaction they catalyse** into **6 classes**, each with **4–13 subclasses**, and every enzyme is named by a **four-digit number**.\n\nDon't just memorise a list — notice what each family *does*. The table below has all six, in their official order, with the reaction each one runs."
    },
    // ── 11 · Table — the six enzyme classes ──────────────────────────────────
    {
      id: uuid(), type: 'table', order: 11,
      caption: 'The 6 classes of enzymes, in official order, with the reaction each catalyses (NCERT §9.8.5)',
      headers: ['Class', 'Reaction it catalyses'],
      rows: [
        ['Oxidoreductases / dehydrogenases', 'Oxidoreduction between two substrates (one is oxidised, the other reduced)'],
        ['Transferases', 'Transfer of a group G (other than hydrogen) between a pair of substrates'],
        ['Hydrolases', 'Hydrolysis of ester, ether, peptide, glycosidic, C–C, C–halide or P–N bonds'],
        ['Lyases', 'Removal of groups from substrates by means other than hydrolysis, leaving double bonds'],
        ['Isomerases', 'Inter-conversion of optical, geometric or positional isomers'],
        ['Ligases', 'Linking together of two compounds (e.g. C–O, C–S, C–N, P–O bonds)'],
      ],
    },
    // ── 12 · Remember — mnemonic for the six classes ─────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Mnemonic — The Six Classes, In Order',
      markdown: "The order is fixed and NEET tests it: **O · T · H · L · I · L**.\n\n**\"Over The Hill, Lucy Is Ligating.\"**\n\n- **O** — **O**xidoreductases\n- **T** — **T**ransferases\n- **H** — **H**ydrolases\n- **L** — **L**yases\n- **I** — **I**somerases\n- **L** — **L**igases\n\nSay it a few times: *Over The Hill, Lucy Is Ligating.* The two L's are Lyases then Ligases — keep them in that order (Lyases break with double bonds, Ligases join)."
    },
    // ── 13 · Heading — cofactors ──────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 13, level: 2,
      text: "The Helpers Many Enzymes Can't Work Without",
      objective: "By the end of this you can define a cofactor and apoenzyme, and tell apart the three kinds of cofactor with NCERT's exact examples.",
    },
    // ── 14 · Text — cofactors, apoenzyme, three kinds ────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "Many enzymes aren't just protein. They need a **non-protein constituent** bound to them to become catalytically active — this helper is a **cofactor**. When a cofactor is attached, the protein part of the enzyme is called the **apoenzyme**.\n\nThere are **three kinds** of cofactor. **Prosthetic groups** are organic compounds bound **tightly** to the apoenzyme — for example, **haem** is the prosthetic group in **peroxidase and catalase**, the enzymes that break down hydrogen peroxide into water and oxygen. **Co-enzymes** are also organic, but their association with the apoenzyme is only **transient** (it happens during catalysis); many contain **vitamins** — for example, **NAD and NADP contain the vitamin niacin**. **Metal ions** form coordination bonds with the active site *and* with the substrate at the same time — for example, **zinc is a cofactor for carboxypeptidase**.\n\nThe proof they matter: **remove the cofactor and the enzyme loses its catalytic activity.**"
    },
    // ── 15 · Comparison card — the three kinds of cofactor ───────────────────
    {
      id: uuid(), type: 'comparison_card', order: 15,
      title: 'Prosthetic Group vs Coenzyme vs Metal Ion',
      columns: [
        { heading: 'Prosthetic group', points: ['Nature: organic compound', 'Binding: tightly bound to the apoenzyme', 'Example: haem in peroxidase & catalase (break H₂O₂ → water + oxygen)'] },
        { heading: 'Co-enzyme', points: ['Nature: organic compound', 'Binding: only transient — associates during catalysis', 'Example: NAD & NADP (contain the vitamin niacin)'] },
        { heading: 'Metal ion', points: ['Nature: inorganic metal ion', 'Binding: coordination bonds — to the active site and the substrate', 'Example: zinc, a cofactor for carboxypeptidase'] },
      ],
    },
    // ── 16 · Reasoning prompt — cofactor / inhibitor check ───────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 16, reasoning_type: 'logical',
      prompt: "A researcher removes a tightly-bound organic molecule from an enzyme and its catalytic activity vanishes. She notes the same molecule stays attached during and after the reaction. Which of these is the molecule she removed?",
      options: [
        "A prosthetic group — such as haem in catalase",
        "A co-enzyme — such as NAD",
        "A competitive inhibitor — such as malonate",
        "A metal ion — such as zinc",
      ],
      reveal: "The answer is the prosthetic group (option 1). The two clues both point there: it is **organic** and it is **tightly bound** — those are exactly NCERT's two distinguishing features of a prosthetic group, like haem in peroxidase and catalase. A co-enzyme (option 2) is organic too, but its association is only **transient**, not tight and permanent — so it wouldn't stay attached after the reaction. A metal ion (option 4) is inorganic, ruling it out. And a competitive inhibitor (option 3) isn't a cofactor at all — it *blocks* an enzyme rather than helping it work, so removing it would *restore* activity, not destroy it.",
      difficulty_level: 2,
    },
    // ── 17 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 17, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Four things change enzyme activity** (all by altering the tertiary structure): **temperature, pH, substrate concentration, specific chemicals.**\n- **Low temperature → temporarily inactive** (reversible). **High temperature → destroyed**, because heat **denatures** the protein (not reversible).\n- **Vmax** = the maximum velocity; reached when enzymes are **saturated** — enzyme molecules are fewer than substrate molecules.\n- **Competitive inhibitor** resembles the substrate and competes for the **active site**. NCERT example: **malonate** inhibits **succinic dehydrogenase** (resembles substrate **succinate**). Used to control **bacterial pathogens**.\n- **6 enzyme classes, in order:** Oxidoreductases, Transferases, Hydrolases, Lyases, Isomerases, Ligases — *Over The Hill, Lucy Is Ligating.*\n- **Cofactor** = non-protein helper; protein part = **apoenzyme**. Three kinds: **prosthetic group** (organic, tight — haem), **co-enzyme** (organic, transient — NAD/NADP, vitamin niacin), **metal ion** (zinc → carboxypeptidase)."
    },
    // ── 18 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 18, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**These are almost pure recall — NEET lifts them straight from NCERT:** the malonate–succinate–succinic dehydrogenase example, the niacin-in-NAD/NADP link, and zinc as the cofactor for carboxypeptidase are perennial one-mark questions. Memorise the exact pairings.\n\n**Watch the trap on temperature:** *low* temperature is temporary (reversible), *high* temperature destroys the enzyme by denaturation. Questions swap these two to catch you.\n\n**Classic NEET question:** \"Malonate inhibits succinic dehydrogenase. This is an example of a ______ inhibitor.\" → **competitive** (because malonate resembles the substrate succinate).\n\n**Classic NEET question:** \"The coenzymes NAD and NADP contain which vitamin?\" → **niacin.**"
    },
    // ── 19 · Bridge / chapter synthesis text ─────────────────────────────────
    {
      id: uuid(), type: 'text', order: 19,
      markdown: "Step back and look at the whole chapter now. It began with the smallest building blocks — the amino acids, sugars, fatty acids, and nucleotides that make up every living thing. Those small molecules link into the great **macromolecules**: proteins, polysaccharides, nucleic acids and lipids, each folding into a precise shape. And a special class of those folded proteins — the **enzymes** — is what actually *runs* the cell, speeding up thousands of reactions by lowering their activation energy. On this page you saw the final layer: enzymes themselves are controlled — by temperature, pH, substrate, and inhibitors — sorted into six working families, and often propped up by cofactors. That's the arc of Biomolecules, start to finish: tiny units → macromolecules → the enzymes that keep the whole living machine turning."
    },
    // ── 20 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 20, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Why does an enzyme-catalysed reaction reach a maximum velocity (Vmax) that adding more substrate cannot exceed?",
          options: [
            "The substrate gets used up faster than it can be replaced, so the reaction runs out of fuel",
            "The enzyme molecules are fewer than the substrate molecules, so once they are all saturated there are no free enzymes left to bind the extra substrate",
            "High substrate concentration lowers the pH, which denatures the enzyme and caps the speed",
            "The product builds up and competitively inhibits the enzyme's active site",
          ],
          correct_index: 1,
          explanation: "NCERT's reason for the Vmax ceiling is a numbers mismatch: there are fewer enzyme molecules than substrate molecules, so once every enzyme is saturated, extra substrate simply has nothing to bind. It isn't about running out of substrate (there's an excess — that's the whole point), nor about pH change or product inhibition, which NCERT does not invoke here.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Malonate inhibits succinic dehydrogenase. What kind of inhibitor is malonate, and why?",
          options: [
            "A non-competitive inhibitor, because it binds far from the active site and changes the enzyme's shape",
            "A prosthetic group, because it is tightly bound to the apoenzyme",
            "A competitive inhibitor, because it closely resembles the substrate succinate and competes for the substrate-binding site",
            "A coenzyme, because it transiently assists succinic dehydrogenase during catalysis",
          ],
          correct_index: 2,
          explanation: "Malonate is a competitive inhibitor: NCERT states it closely resembles the enzyme's real substrate, succinate, so it competes with succinate for the substrate-binding (active) site, and the enzyme's action declines. It is not a helper of any kind — a prosthetic group and a coenzyme are cofactors that *enable* an enzyme, the opposite of what malonate does; and NCERT specifically describes the competitive mechanism, not a non-competitive one.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which pairing of cofactor type with its example is correct according to NCERT?",
          options: [
            "Co-enzyme → zinc in carboxypeptidase",
            "Prosthetic group → NAD, which contains the vitamin niacin",
            "Metal ion → haem in peroxidase and catalase",
            "Prosthetic group → haem in peroxidase and catalase, tightly bound to the apoenzyme",
          ],
          correct_index: 3,
          explanation: "Haem is the prosthetic group in peroxidase and catalase and is tightly bound to the apoenzyme — exactly NCERT's example. The other three swap the labels: zinc is a metal ion (not a coenzyme), NAD is a coenzyme (not a prosthetic group), and haem is a prosthetic group (not a metal ion). Keeping haem/prosthetic, NAD/coenzyme, and zinc/metal-ion straight is the whole point of this question.",
          difficulty_level: 3,
        },
        {
          id: uuid(),
          question: "Which statement about temperature and enzyme activity matches NCERT exactly?",
          options: [
            "Low temperature destroys the enzyme permanently, while high temperature keeps it temporarily inactive",
            "Low temperature keeps the enzyme temporarily inactive, while high temperature destroys its activity by denaturing the protein",
            "Both low and high temperature denature the enzyme irreversibly",
            "Enzymes work equally well at all temperatures as long as the pH stays at the optimum",
          ],
          correct_index: 1,
          explanation: "NCERT draws a sharp line: low temperature preserves the enzyme in a temporarily inactive state (reversible), whereas high temperature destroys enzymatic activity because heat denatures the protein (not reversible). Option 1 reverses these two effects — the most common trap. Enzymes also clearly do not work equally at all temperatures; each has a single optimum with activity falling off on both sides.",
          difficulty_level: 1,
        },
      ],
    },
  ],
};
