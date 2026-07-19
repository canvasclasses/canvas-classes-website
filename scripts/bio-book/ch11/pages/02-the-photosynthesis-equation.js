'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-photosynthesis-equation',
  title: 'The Photosynthesis Equation — and Where the Oxygen Comes From',
  subtitle: "For a hundred years everyone assumed the oxygen a plant releases is broken off from carbon dioxide. One microbiologist, studying bacteria that make no oxygen at all, proved it comes from water instead — and that single insight rewrote the equation NEET asks you to recite.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['photosynthesis-in-higher-plants', 'history'],
  glossary: [
    { term: 'chloroplast', definition: 'The special green body inside a plant cell where the green substance (chlorophyll) sits and where glucose is made. Julius von Sachs traced glucose production to these green parts.' },
    { term: 'starch', definition: 'The form in which the glucose made during photosynthesis is usually stored inside the plant.' },
    { term: 'action spectrum', definition: 'A graph showing how effective each colour (wavelength) of light is at driving photosynthesis. Engelmann described the first one, and it roughly matches the absorption spectra of chlorophyll a and b.' },
    { term: 'absorption spectrum', definition: 'A graph showing which colours of light a pigment absorbs. The action spectrum of photosynthesis resembles the absorption spectra of chlorophyll a and b.' },
    { term: 'hydrogen donor', definition: 'The oxidisable compound that supplies hydrogen to reduce carbon dioxide to carbohydrate. In green plants it is water (H2O); in purple and green sulphur bacteria it is hydrogen sulphide (H2S).' },
    { term: 'oxidisable compound', definition: 'A substance that can give up hydrogen (be oxidised) during photosynthesis. Van Niel showed the hydrogen taken from it reduces CO2 to carbohydrate.' },
    { term: 'radioisotopic technique', definition: 'A labelling method using radioactive atoms to track where atoms end up. It later proved that the oxygen a green plant releases comes from water, not from carbon dioxide.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single sunlit green leaf against deep shadow, with faint bubbles of oxygen rising from its surface into the darkness',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single backlit green leaf glows against an almost-black background, one warm shaft of light catching its veins. Faint, softly glowing translucent bubbles drift upward from the leaf surface into the surrounding darkness, suggesting oxygen being released, without any labels or text. Deep shadow fills most of the frame with subtle green and gold highlights. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Oxygen You Breathe Was Once Water',
      markdown: "Every breath you take is roughly one-fifth oxygen, and almost all of it was made by plants. Here is the strange part: for a long time everyone assumed that oxygen was chopped off from the carbon dioxide a plant takes in. It turned out they were wrong. The oxygen a green plant hands you was pulled out of **water** — the plant splits water apart and releases those oxygen atoms into the air. The person who first worked this out wasn't even studying green plants; he was studying bacteria that release no oxygen at all.",
    },
    // ── 2 · Core concept — the puzzle ─────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "By the middle of the nineteenth century, the big picture was already clear: plants use **light energy** to make carbohydrates from **carbon dioxide (CO2)** and **water**. That much everyone agreed on. What took decades longer to settle was a much smaller-sounding question — when a plant releases oxygen, which of the two ingredients does that oxygen come from, the CO2 or the water?\n\nGetting to the correct answer took the work of three people, one after another: **Julius von Sachs**, who showed *what* the plant makes; **T.W. Engelmann**, who showed *which colours of light* drive the process; and **Cornelius van Niel**, who finally showed *where the released oxygen comes from*. Follow them in order and the final equation writes itself.",
    },
    // ── 3 · Heading — Sachs & Engelmann ───────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Sachs and Engelmann — What Is Made, and by Which Light',
      objective: "By the end of this you can say what Sachs proved a plant produces and stores, and what Engelmann's prism-and-bacteria experiment revealed about the colours that power photosynthesis.",
    },
    // ── 4 · Text — Sachs ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "In about **1854**, **Julius von Sachs** provided the first solid evidence that plants **produce glucose** as they grow. He also noticed what happens to that glucose afterward: it is **usually stored as starch**.\n\nHis later work pinned down *where* all this happens. Sachs found that the **green substance** in a plant — what we now call **chlorophyll** — is not spread evenly through the cell but packed into **special bodies** (later named **chloroplasts**). And it is exactly these **green parts** of the plant where the glucose is made. So Sachs gave us three linked facts: glucose is the product, starch is the storage form, and the green chloroplasts are the workshop.",
    },
    // ── 5 · Text — Engelmann ──────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "Next came a clever experiment by **T.W. Engelmann (1843–1909)**. He took a **prism** and used it to split light into its **spectral colours** — a rainbow spread out in a line. He shone that spread-out spectrum onto a green alga called **Cladophora**, which he had placed in a suspension of **aerobic bacteria**. Those bacteria were his detector: aerobic bacteria crowd toward oxygen, so wherever they gathered, the alga must be releasing the most **O2** — meaning photosynthesis was strongest there.\n\nThe bacteria collected mainly in the **blue** and **red** parts of the split spectrum. That told Engelmann blue and red light drive photosynthesis best, and he had just described the **first action spectrum of photosynthesis**. Notice how neatly it fits together: this action spectrum roughly **resembles the absorption spectra of chlorophyll a and b** — the very pigments doing the work.",
    },
    // ── 6 · Heading — where the oxygen comes from ─────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Van Niel — Where Does the Released Oxygen Come From?',
      objective: "By the end of this you can explain, using van Niel's bacteria studies, why the oxygen a green plant releases comes from water and not from carbon dioxide — and write the correct overall equation.",
    },
    // ── 7 · Text — empirical equation ─────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "With those pieces in place, biologists wrote down an **empirical equation** for the oxygen-releasing organisms — a first, rough summary of the whole process:\n\n$ CO_2 + H_2O \\xrightarrow{\\text{Light}} [CH_2O] + O_2 $\n\nHere $ [CH_2O] $ just stands for a **carbohydrate** — glucose, a six-carbon sugar, is the usual example. This equation captures the inputs and outputs, but it quietly leaves the real question unanswered: the single oxygen released — did it come from the CO2 or from the water?",
    },
    // ── 8 · Text — van Niel's insight ─────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "The answer came from **Cornelius van Niel (1897–1985)**, a microbiologist who was studying **purple and green bacteria**. He showed that photosynthesis is essentially a **light-dependent reaction** in which **hydrogen from a suitable oxidisable compound reduces carbon dioxide to carbohydrate**. He wrote it in a general form that fits *all* photosynthetic organisms, not just green plants:\n\n$ 2H_2A + CO_2 \\xrightarrow{\\text{Light}} 2A + CH_2O + H_2O $\n\nHere **H2A** is whatever the organism uses as its **hydrogen donor**. In **green plants** the donor is **water (H2O)**, and water is **oxidised to O2** — so the oxygen bubbles out. But some organisms release no oxygen at all: in **purple and green sulphur bacteria** the donor is **hydrogen sulphide (H2S)**, and the oxidation product is **sulphur or sulphate, not O2**. That contrast is the whole clue. If swapping the donor from water to H2S swaps the by-product from O2 to sulphur, then the released substance must come **from the donor**. So van Niel inferred that in a green plant the **O2 comes from water, not from carbon dioxide** — a conclusion later confirmed with **radioisotopic techniques**.\n\nOnce you know the oxygen traces back to water, the rough equation has to be rewritten. To supply enough water to account for the oxygen released, the **correct overall equation** shows twelve water molecules going in:\n\n$ 6CO_2 + 12H_2O \\xrightarrow{\\text{Light}} C_6H_{12}O_6 + 6H_2O + 6O_2 $\n\nwhere $ C_6H_{12}O_6 $ is glucose. Remember that this single line is not one reaction — it is shorthand for a **multistep process**.",
    },
    // ── 9 · Interactive image — O2 comes from water ───────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 9, src: '',
      alt: 'Diagram of the balanced photosynthesis equation with the six oxygen molecules traced by leader lines back to the twelve water molecules on the reactant side',
      caption: '📸 Tap each dot to trace where every atom goes — especially the oxygen.',
      generation_prompt: "Scientific textbook illustration of the overall photosynthesis equation shown as a labelled flow diagram: on the left, reactant molecules '6 CO2' and '12 H2O' feed into a central green chloroplast lens marked 'Light'; on the right, product molecules 'C6H12O6 (glucose)', '6 H2O' and '6 O2' come out. Thin dashed white leader lines curve from the oxygen atoms of the 12 water molecules on the left to the '6 O2' released on the right, showing the released oxygen originates in water (radioisotope-tracing idea). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, labels in white text with thin white leader lines. Functional colours: blue for water molecules, faint grey for CO2, green for the glucose and the chloroplast, pale blue-white highlight on the released O2. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.12, y: 0.30, label: '6 CO₂ (goes in)', detail: "Carbon dioxide supplies the **carbon** that ends up in glucose. It is *not* the source of the oxygen the plant releases — that is the whole point of this page.", icon: 'circle' },
        { id: uuid(), x: 0.12, y: 0.68, label: '12 H₂O (goes in)', detail: "Water is the **hydrogen donor**. Its oxygen atoms are the ones that get released as O₂ — which is why twelve water molecules are needed on the substrate side.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.50, label: 'Light + chloroplast', detail: "**Light energy**, captured in the green chloroplast, drives the whole multistep process. The single equation is only a summary of it.", icon: 'circle' },
        { id: uuid(), x: 0.86, y: 0.28, label: 'C₆H₁₂O₆ (comes out)', detail: "**Glucose**, the six-carbon sugar. This is the carbohydrate the empirical equation wrote simply as [CH₂O].", icon: 'circle' },
        { id: uuid(), x: 0.86, y: 0.52, label: '6 H₂O (comes out)', detail: "Six water molecules are also formed again on the **product** side — this is why water appears on both the left and the right of the balanced equation.", icon: 'circle' },
        { id: uuid(), x: 0.86, y: 0.76, label: '6 O₂ (released)', detail: "The oxygen the plant gives off. Follow the dashed lines back: every oxygen atom here came **from the water**, not from CO₂ — proved later with radioisotopes.", icon: 'circle' },
      ],
    },
    // ── 10 · Reasoning prompt — where the O2 comes from ───────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "In van Niel's experiments, purple and green sulphur bacteria use H2S as their hydrogen donor and give off sulphur (not oxygen), while green plants use H2O and give off O2. What does this contrast let you conclude about a green plant's released oxygen?",
      options: [
        "The released oxygen comes from the hydrogen donor (water in green plants), not from carbon dioxide.",
        "The released oxygen comes from splitting carbon dioxide, and water only supplies hydrogen.",
        "The released oxygen comes half from water and half from carbon dioxide in equal amounts.",
        "The released oxygen comes from the glucose molecule breaking down after it is formed.",
      ],
      reveal: "Option 1 is right, and the reasoning is the key part. Both organisms take in CO2, yet the by-product changes — O2 versus sulphur — the moment the *donor* changes from H2O to H2S. If the released substance tracked with the donor, it must come *from* the donor. So in a green plant the oxygen comes from water. Option 2 is the exact old assumption van Niel overturned; if oxygen came from CO2 it wouldn't change when the donor changed. Option 3 and option 4 invent sources NCERT never describes — the radioisotope work later confirmed it is water, and water alone.",
      difficulty_level: 2,
    },
    // ── 11 · Table — the three scientists ─────────────────────────────────
    {
      id: uuid(), type: 'table', order: 11,
      caption: 'The three scientists behind the photosynthesis equation, and what each one contributed',
      headers: ['Scientist', 'Contribution'],
      rows: [
        ['Julius von Sachs (≈1854)', 'Showed plants produce glucose, usually stored as starch; located the green substance (chlorophyll) in special bodies later called chloroplasts, in the green parts where glucose is made'],
        ['T.W. Engelmann', 'Used a prism + the green alga Cladophora in a suspension of aerobic bacteria; bacteria gathered in the blue and red light — the first action spectrum of photosynthesis (resembles the absorption spectra of chlorophyll a and b)'],
        ['Cornelius van Niel', 'From studies of purple and green bacteria (2H2A + CO2 → 2A + CH2O + H2O), inferred the O2 a green plant releases comes from water, not carbon dioxide — later proved with radioisotopes'],
      ],
    },
    // ── 12 · Remember callout ─────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Sachs** → plants make **glucose**, usually stored as **starch**; the green substance (chlorophyll) sits in **chloroplasts**, in the green parts where glucose is made.\n- **Engelmann** → prism + **Cladophora** + aerobic bacteria → bacteria gathered in **blue and red** light → the **first action spectrum** of photosynthesis (matches the absorption spectra of chlorophyll a and b).\n- **Van Niel** → the **O2 released by green plants comes from water, not from CO2**. In green plants the donor is **H2O** (oxidised to O2); in purple/green sulphur bacteria the donor is **H2S** (product = sulphur/sulphate, no O2).\n- **Correct overall equation:** $ 6CO_2 + 12H_2O \\xrightarrow{\\text{Light}} C_6H_{12}O_6 + 6H_2O + 6O_2 $ — and it is a **multistep** process, not a single reaction.",
    },
    // ── 13 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Where the released O2 comes from is the single most-tested idea on this page.** The answer is **water** — never carbon dioxide. Van Niel reasoned it out from bacteria; radioisotopes later confirmed it.\n\n**Know why 12 water molecules appear as substrate:** the correct equation shows **12 H2O** on the left so there is enough water to account for the **6 O2** released *and* the **6 H2O** re-formed on the product side. Water therefore appears on **both** sides of the balanced equation.\n\n**Classic NEET question:** \"The O2 released during photosynthesis comes from ___.\" → **water (H2O)**, not CO2 — this is van Niel's insight.",
    },
    // ── 14 · Bridge text ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "You now know what a plant makes, which light drives it, and that the oxygen it releases is split out of water. Sachs already hinted at *where* all of this happens — inside the green chloroplasts. Next, you'll step inside that chloroplast and see the exact structures where the light is caught and the sugar is built.",
    },
    // ── 15 · Inline quiz (LAST) ───────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "During photosynthesis in green plants, the oxygen that is released comes from:",
          options: [
            "Water (H2O), which acts as the hydrogen donor and is oxidised to O2",
            "Carbon dioxide (CO2), which is split apart to free its oxygen",
            "The glucose molecule after it has been assembled",
            "Both water and carbon dioxide, in equal proportions",
          ],
          correct_index: 0,
          explanation: "Van Niel showed the released O2 comes from the hydrogen donor — water in green plants — a conclusion later confirmed with radioisotopes. The old assumption that oxygen is broken off carbon dioxide (option 2) is exactly what he overturned; glucose and a 50:50 split (options 3 and 4) are sources NCERT never mentions.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "What did Julius von Sachs establish about photosynthesis?",
          options: [
            "That bacteria gather in blue and red light, giving the first action spectrum",
            "That the oxygen released by a plant comes from water rather than carbon dioxide",
            "That plants produce glucose (usually stored as starch), made in the green parts where chlorophyll sits in special bodies later called chloroplasts",
            "That the hydrogen donor in green plants is H2S, producing sulphur",
          ],
          correct_index: 2,
          explanation: "Sachs's contribution was the product and its location: glucose is made, usually stored as starch, in the green chloroplast-containing parts. Option 1 is Engelmann's action-spectrum work, option 2 is van Niel's oxygen-source insight, and option 4 describes sulphur bacteria — H2S is never the donor in green plants.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "In Engelmann's experiment, aerobic bacteria placed around the alga Cladophora accumulated mainly in the blue and red light of the split spectrum. Why did they gather there?",
          options: [
            "Blue and red light killed the bacteria everywhere else, so only these survivors remained",
            "Photosynthesis — and therefore O2 release — was strongest in blue and red light, and aerobic bacteria move toward oxygen",
            "The prism concentrated all its heat into the blue and red bands, attracting the bacteria",
            "Cladophora released glucose only in blue and red light, which the bacteria fed on",
          ],
          correct_index: 1,
          explanation: "Engelmann used aerobic bacteria as an oxygen detector: they crowd toward O2, so wherever they gathered, the alga was releasing the most oxygen — meaning photosynthesis was strongest there, in the blue and red bands. This gave the first action spectrum. The other options invent heat, glucose-feeding, or a killing effect that the experiment never involved.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Van Niel's general equation is 2H2A + CO2 → 2A + CH2O + H2O. Comparing a green plant with purple sulphur bacteria, which statement is correct?",
          options: [
            "Both use H2O as the donor, so both release O2",
            "In green plants H2A is H2O (oxidised to O2); in purple/green sulphur bacteria H2A is H2S (oxidised to sulphur or sulphate, no O2)",
            "In green plants H2A is CO2, and in sulphur bacteria H2A is glucose",
            "Neither organism releases oxygen, because H2A is always hydrogen sulphide",
          ],
          correct_index: 1,
          explanation: "H2A is the hydrogen donor, and it differs by organism: water in green plants (giving O2) versus H2S in purple and green sulphur bacteria (giving sulphur or sulphate, no O2). That very difference is how van Niel deduced the oxygen comes from the donor. Options 1, 3 and 4 all get the donor wrong — H2A is never CO2, never glucose, and not always H2S.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
