'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'primary-and-secondary-metabolites',
  title: 'Primary & Secondary Metabolites',
  subtitle: "The same word — 'metabolite' — covers both the sugar in your blood and the rubber in a tyre. This page draws the one line NEET tests: which compounds are primary, which are secondary, and why we still don't fully understand the second group.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['biomolecules', 'metabolites'],
  glossary: [
    { term: 'metabolite', definition: 'Another name for a biomolecule — any of the thousands of organic compounds that can be isolated from a living organism.' },
    { term: 'primary metabolite', definition: 'A metabolite seen in animal tissues (amino acids, sugars, and the other compounds of Figure 9.1) that has an identifiable function and a known role in normal physiological processes.' },
    { term: 'secondary metabolite', definition: 'A compound found in plant, fungal and microbial cells beyond the primary metabolites — e.g. alkaloids, pigments, rubber — whose role in the host is often still not understood, though many are useful to human welfare.' },
    { term: 'alkaloid', definition: 'A class of secondary metabolite; morphine and codeine are NCERT examples.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark laboratory bench holding a rubber tapping cup, a jar of coloured pigment powder, and a sprig of a scented herb, softly lit from one side',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). On a dark laboratory bench, softly lit from one side, sit three objects together: a small cup of pale rubber latex being collected drop by drop, a shallow open jar of deep-red and orange pigment powder, and a fresh sprig of a scented green herb. Warm low-key lighting picks out their textures against deep shadow. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Rubber, Morphine and Chilli Are All the Same Kind of Thing',
      markdown: "The rubber in a bicycle tyre, the morphine a doctor uses to kill pain, the colour of a rose petal, the sharp smell of lemon grass, the heat of a spice — chemically, these are all the *same category* of compound. A plant made every one of them. Biology has a single name for this whole crowd: **secondary metabolites**. And here's the strange part — for a lot of them, we still don't actually know *why the plant bothers to make them*.",
    },
    // ── 2 · Core concept — metabolites, primary in animal tissues ─────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "If you listed out every biomolecule you could isolate from a living organism, that list would run to **thousands of organic compounds** — amino acids, sugars, and much more. Biology gives this whole set of biomolecules one working name: **metabolites**.\n\nNow look specifically at **animal tissues**. Every category of compound you saw earlier in Figure 9.1 — the amino acids, the sugars, the fatty acids, the nucleotides — shows up there. These are the **primary metabolites**. The key thing about them is that each one has an **identifiable function** and plays a **known role in the normal physiological processes** of the body. We know what a sugar is doing there, we know what an amino acid is for.",
    },
    // ── 3 · Heading — secondary metabolites ──────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Thousands of Extra Compounds in Plants, Fungi and Microbes',
      objective: "By the end of this you can say where secondary metabolites are found, name several from memory, and explain why NCERT says we don't fully understand them.",
    },
    // ── 4 · Text — secondary metabolites definition + examples ────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Now switch from animal tissue to **plant, fungal and microbial cells**. Analyse them and you find the primary metabolites are still there — but sitting alongside them are **thousands of other compounds** that animal tissue simply doesn't bother making. NCERT's examples: **alkaloids, flavonoids, rubber, essential oils, antibiotics, coloured pigments, scents, gums, spices**. These are the **secondary metabolites**.\n\nHere is the honest gap NCERT points out. With primary metabolites, we know the job each one does. With secondary metabolites, **we do not, at the moment, understand the role or function of all of them in the host organism** — the plant makes rubber or an alkaloid, and we can't always say why *it* benefits. What we *can* say is that **many of them are useful to human welfare** — rubber, drugs, spices, scents and pigments all come from this group — and that **some have ecological importance**.",
    },
    // ── 5 · Table 9.3 ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 5,
      caption: 'NCERT Table 9.3 — Some Secondary Metabolites',
      headers: ['Category', 'Examples'],
      rows: [
        ['Pigments', 'Carotenoids, Anthocyanins'],
        ['Alkaloids', 'Morphine, Codeine'],
        ['Terpenoides', 'Monoterpenes, Diterpenes'],
        ['Essential oils', 'Lemon grass oil'],
        ['Toxins', 'Abrin, Ricin'],
        ['Lectins', 'Concanavalin A'],
        ['Drugs', 'Vinblastin, Curcumin'],
        ['Polymeric substances', 'Rubber, gums, cellulose'],
      ],
    },
    // ── 6 · Comparison card — primary vs secondary ────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 6,
      title: 'Primary vs Secondary Metabolites',
      columns: [
        {
          heading: 'Primary metabolites',
          points: [
            'Seen in animal tissues (the categories in Figure 9.1)',
            'Each has an identifiable function',
            'Play known roles in normal physiological processes',
            'Examples: amino acids, sugars, fatty acids',
          ],
        },
        {
          heading: 'Secondary metabolites',
          points: [
            'Found mostly in plant, fungal and microbial cells',
            'Role/function in the host often still not understood',
            'Many are useful to human welfare; some have ecological importance',
            'Examples: alkaloids, coloured pigments, rubber, essential oils',
          ],
        },
      ],
    },
    // ── 7 · Reasoning prompt — classify a compound ────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
      prompt: "A student is handed four compounds and told to pick the ONE that is a primary metabolite (the other three are secondary metabolites). Which should they pick?",
      options: [
        "Morphine, isolated from a plant and listed by NCERT as an alkaloid",
        "An amino acid found among the compounds of animal tissue in Figure 9.1",
        "Rubber, listed by NCERT under polymeric substances",
        "Anthocyanin, one of the coloured pigments a plant produces",
      ],
      reveal: "The amino acid is the primary metabolite. NCERT defines primary metabolites as the categories of compounds seen in animal tissues (Figure 9.1) — amino acids and sugars are the textbook examples, each with a known physiological role. The tempting wrong pick is rubber, because it sounds like a plain industrial material rather than a fancy 'metabolite' — but NCERT lists rubber squarely under secondary metabolites (polymeric substances). Morphine (an alkaloid) and anthocyanin (a pigment) are secondary metabolites too.",
      difficulty_level: 2,
    },
    // ── 8 · Remember callout ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 8, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Metabolite** = another name for a biomolecule.\n- **Primary metabolites** → seen in **animal tissues** (Figure 9.1 categories); have **identifiable functions** and known roles in normal physiology. E.g. amino acids, sugars.\n- **Secondary metabolites** → the thousands of extra compounds in **plant, fungal and microbial cells**; their role in the host is **often not yet understood**. E.g. alkaloids, flavonoids, rubber, essential oils, antibiotics, pigments, scents, gums, spices.\n- Many secondary metabolites are **useful to human welfare** (rubber, drugs, spices, scents, pigments); some have **ecological importance**.\n- **Table 9.3 examples to memorise:** Pigments → carotenoids, anthocyanins · Alkaloids → morphine, codeine · Essential oils → lemon grass oil · Toxins → abrin, ricin · Lectins → concanavalin A · Drugs → vinblastin, curcumin · Polymeric substances → rubber, gums, cellulose.",
    },
    // ── 9 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 9, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Match-the-example is the whole game here:** NEET loves to give you a compound and ask for its category, or give a category and ask for its example — straight from Table 9.3. Learn the pairs both ways.\n\n**The classic trap:** rubber *sounds* like an ordinary material, not a 'metabolite', so students wrongly call it primary. It is a **secondary metabolite** (polymeric substances). Same trap with pigments and drugs — all secondary.\n\n**Classic NEET question:** \"Morphine and codeine are examples of ___\" → **alkaloids**, which are secondary metabolites. (And concanavalin A → lectin; abrin and ricin → toxins.)",
    },
    // ── 10 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "So far every compound we've named — primary or secondary — has been on the smaller side. Next you'll meet the giants: the **biomacromolecules**, the large molecules the cell builds by joining these smaller units together.",
    },
    // ── 11 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "According to NCERT, where are primary metabolites seen, and what is special about them?",
          options: [
            "In plant and fungal cells; their functions in the host are mostly unknown",
            "In animal tissues; each has an identifiable function and a known role in normal physiological processes",
            "Only in microbial cells; they are useful to human welfare but harmful to the host",
            "In all living cells equally; they have molecular weights above 800 daltons",
          ],
          correct_index: 1,
          explanation: "NCERT places primary metabolites in animal tissues (the categories of Figure 9.1) and defines them by having identifiable functions and known physiological roles. Option 1 describes secondary metabolites (plant/fungal cells, unknown roles). Option 3 misuses 'human welfare' (that phrase applies to secondary metabolites) and invents 'harmful to the host'. Option 4 borrows a molecular-weight fact from a different section, not the definition of a primary metabolite.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which of the following is a secondary metabolite?",
          options: [
            "A sugar, one of the compounds of Figure 9.1 in animal tissue",
            "An amino acid with a known physiological role",
            "Rubber, a polymeric substance produced by plants",
            "A fatty acid used in the body's normal metabolism",
          ],
          correct_index: 2,
          explanation: "Rubber is listed by NCERT under secondary metabolites (polymeric substances), found in plant cells and useful to human welfare. The other three — sugars, amino acids and fatty acids — are primary metabolites seen in animal tissues with identifiable functions. Rubber is the common trap because it feels like a plain material rather than a 'metabolite'.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "In NCERT Table 9.3, concanavalin A is given as an example of which category?",
          options: [
            "Toxins",
            "Alkaloids",
            "Lectins",
            "Pigments",
          ],
          correct_index: 2,
          explanation: "Table 9.3 pairs concanavalin A with lectins. Toxins in that table are abrin and ricin; alkaloids are morphine and codeine; pigments are carotenoids and anthocyanins. Mixing up which example belongs to which category is exactly what this kind of question tests.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Why does NCERT say secondary metabolites are treated differently from primary metabolites?",
          options: [
            "Secondary metabolites are larger molecules, so they belong to the acid-insoluble pool",
            "We do not, at the moment, understand the role or function of all secondary metabolites in the host organism, even though many are useful to human welfare",
            "Secondary metabolites are found only in animal tissues, while primary metabolites are found only in plants",
            "Secondary metabolites have no use to humans and no ecological importance whatsoever",
          ],
          correct_index: 1,
          explanation: "NCERT's actual point: unlike primary metabolites (whose roles we know), the roles of secondary metabolites in the host are often still not understood — yet many are useful to human welfare and some have ecological importance. Option 1 invents a size/solubility reason. Option 3 reverses where each group is found (secondary are in plant/fungal/microbial cells). Option 4 flatly contradicts NCERT, which says many are useful to human welfare.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
