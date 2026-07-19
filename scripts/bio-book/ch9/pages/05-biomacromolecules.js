'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'biomacromolecules',
  title: 'Micromolecules & Biomacromolecules',
  subtitle: "Sort every compound in a living cell by just one number — its molecular weight — and the whole chemistry of life falls into two neat piles. This page shows you exactly where that line sits, and why one sneaky molecule refuses to stay where its size says it should.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['biomolecules', 'macromolecules'],
  glossary: [
    { term: 'micromolecule', definition: 'A biomolecule with a molecular weight less than one thousand daltons — the small compounds found in the acid-soluble pool, such as amino acids, simple sugars and nucleotides. Also called simply a biomolecule.' },
    { term: 'macromolecule', definition: 'A large molecule found in the acid-insoluble fraction, usually with a molecular weight of ten thousand daltons and above — proteins, nucleic acids and polysaccharides. Also called a biomacromolecule.' },
    { term: 'acid-soluble pool', definition: 'The fraction of ground tissue that stays dissolved in acid; it holds the small (18–800 Da) compounds and roughly represents the cytoplasmic composition.' },
    { term: 'acid-insoluble fraction', definition: 'The fraction of ground tissue that does not dissolve in acid; it holds the four macromolecule classes (proteins, nucleic acids, polysaccharides and lipids-in-membranes).' },
    { term: 'polymeric substance', definition: 'A large molecule built by joining many smaller repeating units together; the acid-insoluble molecules, except lipids, are polymers.' },
    { term: 'dalton (Da)', definition: 'The unit used to measure the molecular weight of a molecule; one dalton is roughly the mass of a single hydrogen atom.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'Two glass beakers on a dark laboratory bench — one holding a clear solution of tiny scattered specks, the other holding a cloudy suspension of larger clumped fragments',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). Two glass laboratory beakers stand side by side on a dark stone bench in a dim lab, softly backlit. The left beaker holds a clear, faintly glowing liquid with tiny scattered specks suspended in it, suggesting small dissolved particles. The right beaker holds a denser, cloudy suspension with larger, softly clumped fragments settling within it, suggesting big molecules that have separated out. Cool blue-green light gently rims both beakers against deep shadow. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'You Can Sort All of Life With One Weighing Scale',
      markdown: "Take a piece of living tissue, grind it up, treat it with acid, and every chemical inside it splits into two groups — and the only thing that decides which group a molecule lands in is **how heavy that molecule is**. There's a real cut-off line, measured in **daltons**, and once you know where it sits you can classify any compound in a living cell without knowing anything else about it.",
    },
    // ── 2 · Core concept — the acid-soluble pool and its size ─────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "In the previous pages you met the two pools you get after grinding tissue and treating it with acid: an **acid-soluble pool** (the small stuff that stays dissolved) and an **acid-insoluble fraction** (the big stuff that doesn't dissolve). Here we ask a simple question about them: **how big are the molecules in each?**\n\nThere is one feature common to every compound found in the **acid-soluble pool** — they are all light. Their **molecular weights range from about 18 to around 800 daltons (Da)**. These are the small molecules: things like amino acids, simple sugars and nucleotides.",
    },
    // ── 3 · Heading — the acid-insoluble fraction ─────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Acid-Insoluble Fraction — Only Four Kinds of Molecule',
      objective: "By the end of this you can name the four types of organic compound in the acid-insoluble fraction and state the molecular-weight cut-off that separates small biomolecules from large ones.",
    },
    // ── 4 · Text — the four macromolecule types + the cutoff ──────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The **acid-insoluble fraction** turns out to be surprisingly simple. It contains **only four types of organic compound**: **proteins, nucleic acids, polysaccharides and lipids**. That's the whole list.\n\nWith **one exception — lipids** — these compounds are heavy: their molecular weights are in the range of **ten thousand daltons and above**. And that gives us a clean way to sort every chemical in a living organism into two types, using just molecular weight:\n\n- Compounds with molecular weights **less than one thousand daltons** are called **micromolecules**, or simply **biomolecules**.\n- Compounds found in the **acid-insoluble fraction** are called **macromolecules**, or **biomacromolecules**.\n\nOne more thing about the insoluble fraction: with the exception of lipids, these molecules are **polymeric substances** — big molecules built by joining many small repeating units into long chains.",
    },
    // ── 5 · Interactive image — the two pools ─────────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 4 + 1, src: '',
      alt: 'A diagram of ground tissue splitting into two pools — a clear acid-soluble pool of tiny molecules on the left, and a cloudy acid-insoluble fraction of large polymers and membrane vesicles on the right',
      caption: '📸 Tap each dot to explore how the molecules of a cell split into two pools by size.',
      generation_prompt: "Scientific textbook illustration of a cell fractionation split into two pools. Flat 2D educational diagram on a dark background (#0a0a0a near-black). In the centre, a small circular clump of ground tissue with an arrow splitting into two labelled containers. LEFT container labelled 'Acid-soluble pool': show many tiny, separate, simple shapes (small dots, a short amino-acid shape, a single sugar ring, a single nucleotide) floating clear and dissolved, drawn small. RIGHT container labelled 'Acid-insoluble fraction': show large complex shapes — a long folded protein chain, a coiled nucleic-acid strand, and a branched polysaccharide chain, drawn big — plus, set slightly apart at the bottom, several small round closed membrane vesicles made of a lipid bilayer. Clean white outlines, labels in white text with thin white leader lines. Functional colours: green tint for the polysaccharide, pink/magenta for protein, blue for the nucleic acid strand, tan/brown for the lipid vesicles. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.15, label: 'Ground tissue', detail: 'Living tissue is ground up and treated with acid. What was one cell now splits into two pools decided purely by molecular size.', icon: 'circle' },
        { id: uuid(), x: 0.22, y: 0.55, label: 'Acid-soluble pool', detail: 'The small molecules — molecular weights of about **18 to 800 Da**. These are the **micromolecules** (biomolecules): amino acids, simple sugars, nucleotides.', icon: 'circle' },
        { id: uuid(), x: 0.78, y: 0.42, label: 'Acid-insoluble fraction', detail: 'The heavy molecules — the **macromolecules** (biomacromolecules). Most are **≥ ~10,000 Da** and are **polymers** built from many repeating units.', icon: 'circle' },
        { id: uuid(), x: 0.78, y: 0.35, label: 'Proteins & nucleic acids', detail: 'Two of the four macromolecule classes. Both are large polymeric chains, so they settle into the acid-insoluble fraction.', icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.55, label: 'Polysaccharides', detail: 'The third macromolecule class — long branched chains of sugar units, again heavy and polymeric.', icon: 'circle' },
        { id: uuid(), x: 0.82, y: 0.78, label: 'Membrane vesicles (lipids)', detail: 'Lipids are small (**≤ 800 Da**), yet they still end up here — because in the cell they sit inside **membranes**, which break into water-insoluble **vesicles** on grinding and separate with this pool.', icon: 'circle' },
      ],
    },
    // ── 6 · Heading — the lipid puzzle ────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Why Do Lipids Break the Rule?',
      objective: "By the end of this you can explain, step by step, why a small molecule like a lipid ends up in the large-molecule (acid-insoluble) fraction — and why NCERT says lipids are not strictly macromolecules.",
    },
    // ── 7 · Text — the lipid explanation ──────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Here's the puzzle. We just said the acid-insoluble fraction holds the heavy molecules. But **lipids** are light — their molecular weights **do not exceed 800 Da**. By size alone they belong with the micromolecules. So why do they turn up in the acid-insoluble, macromolecular fraction?\n\nThe answer isn't about the lipid molecule's size at all — it's about **where lipids live inside the cell**. Follow the steps:\n\n1. Lipids are indeed small-molecular-weight compounds, but in the cell they aren't just floating around loose — they are **arranged into structures like the cell membrane** and other membranes.\n2. When you **grind a tissue**, you disrupt the cell structure. The cell membrane and other membranes are **broken into pieces**.\n3. Those broken membrane pieces re-close into small bags called **vesicles**, and these vesicles are **not water soluble**.\n4. Being insoluble, the membrane fragments (as vesicles) **get separated along with the acid-insoluble pool** — landing in the macromolecular fraction.\n\nThat's the whole reason. It's a technicality of how the fraction is prepared, not a statement that lipids are big. That is exactly why NCERT adds the careful line: **lipids are not strictly macromolecules.**",
    },
    // ── 8 · Reasoning prompt — the lipid puzzle check ─────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "Lipids have molecular weights of only up to about 800 Da, yet they are recovered in the acid-insoluble (macromolecular) fraction. According to NCERT, what is the actual reason?",
      options: [
        "Lipids are polymers made of thousands of repeating fatty-acid units, so their true molecular weight is far above 10,000 Da.",
        "In the cell, lipids form membranes; grinding breaks these into vesicles that are not water soluble, so they separate with the acid-insoluble pool.",
        "Lipids chemically react with the acid and clump together into an insoluble solid, which is why they leave the soluble pool.",
        "Lipids bind tightly to proteins and nucleic acids, and it is those heavy partners that drag the lipids into the insoluble fraction.",
      ],
      reveal: "The second option is right. NCERT's reasoning is entirely about location, not size: lipids are genuinely small molecules, but they are arranged into membranes; grinding the tissue breaks those membranes into water-insoluble vesicles, and the vesicles separate out with the acid-insoluble pool. The first option is the tempting trap — it assumes 'insoluble fraction = big polymer', but NCERT explicitly says lipids are small and are 'not strictly macromolecules', so they are not heavy polymers. The acid-reaction and protein-binding options describe mechanisms NCERT never states.",
      difficulty_level: 2,
    },
    // ── 9 · Comparison card — micro vs macro ──────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'Micromolecule vs Macromolecule',
      columns: [
        {
          heading: 'Micromolecule (biomolecule)',
          points: [
            'Molecular weight less than 1000 Da',
            'Found in the acid-soluble pool (about 18–800 Da)',
            'Small, single molecules — not polymers',
            'Examples: amino acids, simple sugars, nucleotides',
          ],
        },
        {
          heading: 'Macromolecule (biomacromolecule)',
          points: [
            'Found in the acid-insoluble fraction',
            'Usually molecular weight ten thousand Da and above',
            'Polymeric substances (except lipids) — many repeating units',
            'Examples: proteins, nucleic acids, polysaccharides',
            'Lipid caveat: lipids are small (≤ 800 Da) but sit here because their membranes form insoluble vesicles — so lipids are not strictly macromolecules',
          ],
        },
      ],
    },
    // ── 10 · Heading — where the two pools come from ──────────────────────────
    {
      id: uuid(), type: 'heading', order: 10, level: 2,
      text: 'Putting the Two Pools Back Together',
      objective: "By the end of this you can say which part of the cell each pool roughly represents, and name the single most abundant chemical in every living organism.",
    },
    // ── 11 · Text — cytoplasm/organelles + water most abundant ────────────────
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "These two pools aren't random — each one roughly maps onto a part of the cell. The **acid-soluble pool** represents roughly the **cytoplasmic composition**. The **macromolecules from the cytoplasm and the organelles** become the **acid-insoluble fraction**. Put the two pools back together and you have the **entire chemical composition of living tissue**.\n\nAnd if you simply line up every class of chemical in a living tissue by **how much of it there is**, one answer jumps out: **water is the most abundant chemical in living organisms.** Table 9.4 shows the full breakdown.",
    },
    // ── 12 · Table 9.4 ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 12,
      caption: '📊 Table 9.4 — Average Composition of Cells (as a percentage of total cellular mass)',
      headers: ['Component', '% of total cellular mass'],
      rows: [
        ['Water', '70–90'],
        ['Proteins', '10–15'],
        ['Carbohydrates', '3'],
        ['Lipids', '2'],
        ['Nucleic acids', '5–7'],
        ['Ions', '1'],
      ],
    },
    // ── 13 · Remember callout ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **The cut-off:** molecular weight **less than 1000 Da → micromolecule** (biomolecule); found in the **acid-insoluble fraction → macromolecule** (biomacromolecule).\n- **The acid-soluble pool** holds compounds of about **18–800 Da**. The macromolecules (except lipids) are **≥ ~10,000 Da**.\n- **Only four** types of organic compound are in the acid-insoluble fraction: **proteins, nucleic acids, polysaccharides and lipids**.\n- Except lipids, the insoluble-fraction molecules are **polymeric substances**.\n- **Lipids are not strictly macromolecules** — they are small (≤ 800 Da) but land in the insoluble fraction because their membranes break into water-insoluble vesicles.\n- **Water is the most abundant chemical in living organisms** (70–90% of cellular mass).",
    },
    // ── 14 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Know the one-line facts cold — NEET lifts them straight from the text:** the four acid-insoluble compound types (proteins, nucleic acids, polysaccharides, lipids); the < 1000 Da cut-off; and 'lipids are not strictly macromolecules'.\n\n**The lipid trap:** a question will ask why lipids sit in the macromolecular fraction. The wrong-but-tempting answer is 'because they are huge polymers'. The right answer is the opposite — lipids are small, but their **membranes form water-insoluble vesicles** on grinding, so they separate with the acid-insoluble pool.\n\n**Classic NEET question:** \"Which is the most abundant chemical in living organisms?\" → **Water** (70–90% of cellular mass, from Table 9.4) — not proteins, even though proteins are the most abundant among the organic/macromolecules.",
    },
    // ── 15 · Bridge text ──────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 15,
      markdown: "You now know the size line that splits every compound in a cell into micromolecules and macromolecules, and why lipids are the one odd case. Next, you'll open up the two biggest polymeric macromolecules one at a time — starting with **proteins and polysaccharides** — and see exactly how their repeating units are strung together.",
    },
    // ── 16 · Inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 16, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "According to NCERT, which molecular-weight rule correctly classifies a biomolecule?",
          options: [
            "Molecular weight less than 1000 Da means a macromolecule; anything heavier is a micromolecule",
            "Molecular weight less than 1000 Da means a micromolecule (biomolecule); compounds in the acid-insoluble fraction are macromolecules",
            "All compounds between 18 and 800 Da are macromolecules found in the acid-insoluble fraction",
            "Any compound above 800 Da is automatically a macromolecule, whatever fraction it is found in",
          ],
          correct_index: 1,
          explanation: "NCERT is precise: compounds under 1000 Da are micromolecules (biomolecules), and the compounds recovered in the acid-insoluble fraction are the macromolecules. Option 1 swaps the two labels. Option 3 misplaces the light 18–800 Da compounds into the insoluble fraction — those are actually the soluble micromolecules. Option 4 invents an 800 Da hard rule; the classification is by the fraction, which is why small lipids can still count as part of the macromolecular fraction.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "The acid-insoluble fraction contains only four types of organic compound. Which set is correct?",
          options: [
            "Proteins, nucleic acids, polysaccharides and lipids",
            "Proteins, amino acids, simple sugars and nucleotides",
            "Water, ions, proteins and carbohydrates",
            "Nucleic acids, vitamins, lipids and mineral salts",
          ],
          correct_index: 0,
          explanation: "NCERT names exactly these four: proteins, nucleic acids, polysaccharides and lipids. Option 2 is the trap — amino acids, simple sugars and nucleotides are the small acid-soluble micromolecules, not the insoluble macromolecules (though they are the building blocks of them). Options 3 and 4 mix in water, ions, vitamins and mineral salts, which are not part of this four-compound list.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Why do lipids appear in the acid-insoluble (macromolecular) fraction even though their molecular weight does not exceed 800 Da?",
          options: [
            "Because lipids polymerise into long chains that push their molecular weight above ten thousand daltons",
            "Because lipids dissolve in acid and then precipitate as an insoluble solid",
            "Because lipids form membranes; grinding breaks these into water-insoluble vesicles that separate with the acid-insoluble pool",
            "Because lipids are the heaviest of the four organic compound types in the cell",
          ],
          correct_index: 2,
          explanation: "The reason is about location, not weight. Lipids sit in cell membranes; grinding the tissue breaks those membranes into vesicles that are not water soluble, so they separate along with the acid-insoluble pool. Option 1 is the classic misconception — it assumes 'insoluble means big polymer', but NCERT states lipids are small and 'not strictly macromolecules'. Options 2 and 4 describe behaviours NCERT never claims.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Based on Table 9.4, which chemical is the most abundant in living organisms?",
          options: [
            "Proteins, at 10–15% of total cellular mass",
            "Nucleic acids, at 5–7% of total cellular mass",
            "Water, at 70–90% of total cellular mass",
            "Carbohydrates, at 3% of total cellular mass",
          ],
          correct_index: 2,
          explanation: "Table 9.4 lists water at 70–90% of total cellular mass — far above everything else — so water is the most abundant chemical in living organisms. Proteins (10–15%) are the most abundant among the organic macromolecules, which is exactly why they are the tempting wrong choice, but they are nowhere near water overall. Nucleic acids and carbohydrates are smaller fractions still.",
          difficulty_level: 1,
        },
      ],
    },
  ],
};
