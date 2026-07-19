'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'how-to-analyse-chemical-composition',
  title: 'How to Analyse the Chemistry of Life',
  subtitle: "A leaf, a piece of liver and a lump of soil are built from the same elements — so what actually makes something 'living' chemically? Grind, strain and burn a tissue and you'll see exactly where the difference hides.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['biomolecules', 'chemical-analysis'],
  glossary: [
    { term: 'biomolecule', definition: 'Any carbon compound obtained from living tissue. From a biology point of view these are grouped as amino acids, nucleotide bases, fatty acids, and so on.' },
    { term: 'trichloroacetic acid', definition: 'The acid (Cl₃CCOOH) in which a living tissue is ground with a mortar and pestle to begin chemical analysis, producing a thick slurry.' },
    { term: 'acid-soluble pool', definition: 'The filtrate obtained after straining the ground-tissue slurry through cheesecloth or cotton. It holds thousands of small organic compounds plus inorganic compounds like sulphate and phosphate.' },
    { term: 'acid-insoluble fraction', definition: 'The retentate — the material left behind on the cloth after straining the slurry, which does not pass through with the filtrate.' },
    { term: 'wet weight', definition: 'The mass of a small piece of living tissue weighed before any water is removed.' },
    { term: 'ash', definition: 'The inorganic material left behind after a living tissue is fully burnt and all its carbon compounds have been oxidised to gases. It contains inorganic elements like calcium and magnesium.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A green leaf and a clump of dark earth resting side by side on a laboratory bench under soft light',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). On a dark laboratory bench, a fresh green leaf rests on the left and a small clump of dark brown earth/soil rests on the right, softly and evenly lit so both are clearly visible, separated by shadow in the middle of the frame. The mood is quiet and comparative, as if the two are being weighed against each other. Painterly, atmospheric illustration style, deep dark background throughout (#0a0a0a base tones), naturalistic muted colours, no text, no labels, no diagram elements, no people, no glow.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'You Are Made of the Same Stuff as Dirt',
      markdown: "Take a sample of the earth's crust — plain soil and rock — and make a list of every element in it. Now do the same for your own body tissue. Here's the surprise: **every single element in the soil is also present in your body.** There is not one element life uses that non-living matter doesn't also have. In absolute terms, the two lists are the same. The difference between living and non-living is not *which* elements — it's *how much* of each.",
    },
    // ── 2 · Core concept — same elements, different proportions ───────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "In chemistry you learnt how to do **elemental analysis** — breaking a sample down and listing the elements in it, along with how much of each is present per unit mass. Run that analysis on a **plant tissue, an animal tissue, or a microbial paste**, and you get a list: carbon, hydrogen, oxygen, and several others. Run the exact same analysis on a **piece of earth's crust** as an example of non-living matter, and you get a very similar list.\n\nSo where's the difference? **In absolute terms, there isn't one** — all the elements in the crust are also in living tissue. But look closer at the *amounts*. The **relative abundance of carbon and hydrogen with respect to the other elements is higher in any living organism than in the earth's crust.** Life didn't invent new elements. It just concentrates certain ones — especially carbon and hydrogen.",
    },
    // ── 3 · Heading — Table 9.1 ───────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Numbers: Crust vs Body',
      objective: "By the end of this you can point to the exact elements — carbon, hydrogen, oxygen — whose share jumps dramatically inside a living body, and name one element that all but vanishes.",
    },
    // ── 4 · Text intro to the table ──────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The table below sets the two lists side by side — the same elements, measured as a percentage of weight, in the **earth's crust** and in the **human body**. Read down the carbon and hydrogen rows first. Then look at silicon, which makes up over a quarter of the crust but is **negligible** in the body. That flip is the whole story of what 'chemically living' means.",
    },
    // ── 5 · Table 9.1 ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 5,
      caption: "NCERT Table 9.1 — a comparison of elements in non-living and living matter. Notice how carbon, hydrogen and oxygen are dramatically higher in the human body, while an element like silicon (huge in the crust) is negligible in the body.",
      headers: ['Element', "Earth's crust (% weight)", 'Human body (% weight)'],
      rows: [
        ['Hydrogen (H)', '0.14', '9.5'],
        ['Carbon (C)', '0.03', '18.5'],
        ['Oxygen (O)', '46.6', '65.0'],
        ['Nitrogen (N)', 'very little', '3.3'],
        ['Sulphur (S)', '0.03', '0.3'],
        ['Sodium (Na)', '2.8', '0.2'],
        ['Calcium (Ca)', '3.6', '1.5'],
        ['Magnesium (Mg)', '2.1', '0.1'],
        ['Silicon (Si)', '27.7', 'negligible'],
      ],
    },
    // ── 6 · Heading — the grind-and-strain method ────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Finding the Organic Compounds: Grind, Then Strain',
      objective: "By the end of this you can describe, step by step, how grinding a tissue in acid and straining it splits its contents into two named fractions — and say which one holds thousands of small organic compounds.",
    },
    // ── 7 · Text — the method ────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Knowing the elements isn't enough — we want to know what **organic compounds** a living thing is built from. To find out, you do a chemical analysis, and it starts with something you could almost do in a kitchen.\n\nTake any living tissue — **a vegetable, or a piece of liver** — and grind it in **trichloroacetic acid (Cl₃CCOOH)** using a mortar and pestle. You get a **thick slurry**. Strain that slurry through cheesecloth or cotton, and it splits into **two fractions**:\n\n- The part that flows through — the **filtrate**, technically called the **acid-soluble pool**.\n- The part left behind on the cloth — the **retentate**, or the **acid-insoluble fraction**.\n\nScientists have found **thousands of organic compounds in the acid-soluble pool** — the small molecules that passed straight through the cloth.",
    },
    // ── 8 · Interactive image — fractionation flow ───────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 8, src: '',
      alt: 'Flow diagram: a living tissue is ground in trichloroacetic acid to a slurry, strained into an acid-soluble filtrate and an acid-insoluble retentate, with a separate branch showing a tissue burnt down to inorganic ash',
      caption: '📸 Tap each dot to follow how a living tissue is broken down — one path splits its compounds by straining, the other burns it down to its inorganic core.',
      generation_prompt: "Scientific textbook illustration of a tissue-fractionation flow chart. Flat 2D educational diagram on a dark background (#0a0a0a near-black), clean white outlines, labels in white text with thin white leader lines. Left: a green living tissue (a leaf and a piece of liver) inside a mortar with a pestle grinding it, labelled path leading down to a beaker of thick greyish slurry. An arrow through a piece of cheesecloth splits into two: a clear liquid filtrate collecting below (small scattered dots suggesting many tiny molecules) and a solid clump of material retained on the cloth above. A separate branch on the right shows the same green tissue being fully burnt over a flame, wisps of gas rising away, leaving a small pile of pale grey ash at the bottom. Functional colours: green for the living tissue, blue tint for the liquid filtrate, grey for slurry and ash. No photorealism, no cartoon, no mascots, no glow.",
      hotspots: [
        { id: uuid(), x: 0.18, y: 0.22, label: 'Grinding in trichloroacetic acid', detail: 'A living tissue (a vegetable or a piece of liver) is ground in **trichloroacetic acid (Cl₃CCOOH)** with a mortar and pestle. This produces a **thick slurry**.', icon: 'circle' },
        { id: uuid(), x: 0.18, y: 0.62, label: 'The thick slurry, strained', detail: 'The slurry is strained through **cheesecloth or cotton**. Straining is what separates the contents into two fractions.', icon: 'circle' },
        { id: uuid(), x: 0.40, y: 0.80, label: 'Acid-soluble pool (filtrate)', detail: 'The part that flows through is the **filtrate**, or **acid-soluble pool**. Scientists have found **thousands of organic compounds** here, along with inorganic compounds like sulphate and phosphate.', icon: 'circle' },
        { id: uuid(), x: 0.40, y: 0.30, label: 'Acid-insoluble fraction (retentate)', detail: 'The material left behind on the cloth is the **retentate**, or the **acid-insoluble fraction** — it does not pass through with the filtrate.', icon: 'circle' },
        { id: uuid(), x: 0.78, y: 0.28, label: 'Burning the tissue', detail: 'In a separate, destructive experiment, a weighed piece of tissue is dried and then **fully burnt**. All the carbon compounds are **oxidised to gases** (CO₂, water vapour) and leave.', icon: 'circle' },
        { id: uuid(), x: 0.80, y: 0.78, label: 'Ash (inorganic)', detail: 'What remains after burning is the **ash**. It contains **inorganic elements like calcium and magnesium**.', icon: 'circle' },
      ],
    },
    // ── 9 · Reasoning prompt — after the grind-strain concept ─────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "You grind a piece of liver in trichloroacetic acid and strain the slurry through cotton. A classmate asks: 'Where did all those thousands of small organic compounds end up?' What's the correct answer?",
      options: [
        "In the acid-soluble pool — the filtrate that passed through the cloth",
        "In the acid-insoluble fraction — the retentate left behind on the cloth",
        "In the ash left behind after the tissue is fully burnt",
        "They evaporated as gas the moment the acid touched the tissue",
      ],
      reveal: "The thousands of organic compounds are in the **acid-soluble pool** — the filtrate that flowed through the cloth. The tempting wrong choice is the retentate (acid-insoluble fraction): it is the *other* fraction from the same straining step, so it's easy to grab, but NCERT specifically places the thousands of organic compounds in the acid-soluble filtrate, not the retentate. The ash belongs to a completely different experiment (burning), and nothing here evaporates on contact with the acid.",
      difficulty_level: 2,
    },
    // ── 10 · Heading — the burn-to-ash method ────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 10, level: 2,
      text: 'Finding the Inorganic Part: Dry It, Then Burn It',
      objective: "By the end of this you can explain what wet weight, dry weight and ash each tell you, and why burning a tissue is what exposes its inorganic elements.",
    },
    // ── 11 · Text — the destructive burn experiment ──────────────────────────
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "Living tissue also carries **inorganic elements and compounds**, and finding those needs a different, destructive experiment.\n\nWeigh a small amount of living tissue — say a leaf or a piece of liver. That first measurement is the **wet weight**. Now dry it: all the **water evaporates**, and what's left gives you the **dry weight**. Finally, **fully burn** the tissue. Every carbon compound is **oxidised to gaseous form (CO₂, water vapour)** and leaves. What remains behind is called **ash** — and this ash holds the **inorganic elements like calcium and magnesium**.\n\nInorganic compounds such as **sulphate and phosphate** also turn up in the acid-soluble fraction from the earlier experiment. Put both experiments together and you can describe a living tissue two ways: its **elemental composition** (hydrogen, oxygen, chlorine, carbon, and so on) from elemental analysis, and its **organic and inorganic constituents** from analysis for compounds.",
    },
    // ── 12 · Heading — what we call these compounds ──────────────────────────
    {
      id: uuid(), type: 'heading', order: 12, level: 2,
      text: 'One Name for All of Them: Biomolecules',
      objective: "By the end of this you can say what the word 'biomolecule' covers, and how a biologist groups these compounds differently from a chemist.",
    },
    // ── 13 · Text — biomolecules and biological classification ────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "Here's the single word that ties it together: **all the carbon compounds we get from living tissues can be called 'biomolecules'.**\n\nA chemist looking at these same compounds would sort them by **functional groups** — aldehydes, ketones, aromatic compounds. But **from a biological point of view**, we classify them into groups that matter for life: **amino acids, nucleotide bases, fatty acids**, and so on. Same molecules, a biologist's labels.",
    },
    // ── 14 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Same elements, different proportions:** every element in the earth's crust is also in living tissue. What's higher in living organisms is the **relative abundance of carbon and hydrogen** with respect to other elements.\n- **Grind in trichloroacetic acid → thick slurry → strain →** two fractions: the **filtrate / acid-soluble pool** (holds thousands of organic compounds) and the **retentate / acid-insoluble fraction**.\n- **Burn method:** wet weight → dry (water evaporates) → dry weight → fully burn → carbon compounds leave as CO₂ + water vapour → what remains is **ash** (inorganic elements like Ca, Mg).\n- **Biomolecules** = all carbon compounds from living tissue. Biologists group them as **amino acids, nucleotide bases, fatty acids**, etc.",
    },
    // ── 15 · Exam tip ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 15, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Which fraction is which:** the **filtrate = acid-soluble pool** (thousands of organic compounds); the **retentate = acid-insoluble fraction**. NEET loves swapping these two labels — keep filtrate tied to acid-*soluble*.\n\n**The acid is specific:** the tissue is ground in **trichloroacetic acid (Cl₃CCOOH)**, not any general acid. That exact name gets asked.\n\n**Ash = inorganic:** it's what's left after full burning, once carbon compounds leave as CO₂ and water vapour. Ash carries inorganic elements like **calcium and magnesium**.\n\n**Classic NEET question:** \"When a living tissue is fully burnt, what remains and what does it contain?\" → **Ash**, containing **inorganic elements like calcium and magnesium** — the carbon compounds have already been oxidised to gases and removed.",
    },
    // ── 16 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 16,
      markdown: "You now know how to pull a living tissue apart into its organic and inorganic parts, and that every carbon compound in it is a **biomolecule**. Next, you'll meet the actual building blocks these experiments turn up — starting with the amino acids and the lipids.",
    },
    // ── 17 · Inline quiz (LAST) ──────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 17, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "How does the chemical make-up of a living organism actually differ from that of the earth's crust?",
          options: [
            "Living tissue contains several elements that are completely absent from the earth's crust",
            "The elements are the same in both, but carbon and hydrogen are relatively more abundant in living organisms",
            "The earth's crust has more carbon and hydrogen, while living tissue is richer in silicon",
            "Living tissue contains only organic elements, while the earth's crust contains only inorganic ones",
          ],
          correct_index: 1,
          explanation: "In absolute terms there's no difference — every element in the crust is also in living tissue. The real difference is proportion: the relative abundance of carbon and hydrogen is higher in living organisms. Option 1 is the classic trap (life uses no unique elements); option 3 reverses the truth (silicon is huge in the crust, negligible in the body); option 4 is false since living tissue has inorganic elements too.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "A living tissue is ground in trichloroacetic acid and the slurry is strained. Which statement about the two fractions is correct?",
          options: [
            "The retentate is the acid-soluble pool and holds thousands of organic compounds",
            "The filtrate is the acid-insoluble fraction left behind on the cloth",
            "The filtrate is the acid-soluble pool, and thousands of organic compounds are found in it",
            "Both fractions are burnt to ash before any compound can be identified",
          ],
          correct_index: 2,
          explanation: "The filtrate — the part that passes through — is the acid-soluble pool, and that's where thousands of organic compounds are found. Option 1 mislabels the retentate as acid-soluble; option 2 flips filtrate and retentate; option 4 confuses this straining experiment with the separate burning experiment.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "When a piece of living tissue is dried and then fully burnt, what is the 'ash' that remains?",
          options: [
            "The carbon compounds that were oxidised during burning",
            "The water that evaporated out of the tissue during drying",
            "The inorganic material left after carbon compounds leave as gases — containing elements like calcium and magnesium",
            "The acid-soluble organic pool concentrated into a solid",
          ],
          correct_index: 2,
          explanation: "On full burning, all carbon compounds are oxidised to gases (CO₂, water vapour) and leave; what remains is the ash, holding inorganic elements like calcium and magnesium. Option 1 is backwards — carbon compounds leave, they don't stay as ash; option 2 confuses the earlier drying step; option 4 mixes in the unrelated straining experiment.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "From a biological point of view, how are the carbon compounds obtained from living tissue classified?",
          options: [
            "As aldehydes, ketones and aromatic compounds",
            "As amino acids, nucleotide bases and fatty acids",
            "As sulphates, phosphates and other inorganic salts",
            "As wet weight, dry weight and ash",
          ],
          correct_index: 1,
          explanation: "All carbon compounds from living tissue are biomolecules, and from a biological point of view they're grouped as amino acids, nucleotide bases, fatty acids, and so on. Option 1 is how a chemist classifies them (by functional group), not a biologist; option 3 lists inorganic constituents, not organic biomolecules; option 4 lists weight measurements from the burning experiment, not compound classes.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
