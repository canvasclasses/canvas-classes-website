'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'sugars-and-nucleotides',
  title: 'The Building Blocks II — Sugars & Nucleotides',
  subtitle: "Two small sugars and five nitrogen bases are the last set of building blocks. Get one habit right on this page — count the phosphate — and you'll never mix up a nucleoside with a nucleotide in the exam hall.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['biomolecules', 'carbohydrates', 'nucleotides'],
  glossary: [
    { term: 'monosaccharide', definition: 'A single, simple sugar unit — the smallest sugar building block. Glucose and ribose are the two shown in the NCERT diagram of small molecules in living tissue.' },
    { term: 'heterocyclic ring', definition: 'A ring-shaped molecule whose ring is built from more than one kind of atom (here, carbon plus nitrogen). The nitrogen bases are carbon compounds that contain such rings.' },
    { term: 'nitrogen base', definition: 'One of five ring-shaped carbon compounds — adenine, guanine, cytosine, uracil, and thymine — that carry nitrogen in their ring.' },
    { term: 'nucleoside', definition: 'A nitrogen base attached to a sugar. Examples: adenosine, guanosine, thymidine, uridine, cytidine. No phosphate is present.' },
    { term: 'nucleotide', definition: 'A nucleoside with a phosphate group esterified to its sugar — that is, a nitrogen base + sugar + phosphate. Examples: adenylic acid, thymidylic acid, guanylic acid, uridylic acid, cytidylic acid.' },
    { term: 'nucleic acid', definition: 'A large molecule — DNA or RNA — built only from nucleotides. DNA and RNA function as the genetic material.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark study bench with a few small glowing molecular ring shapes and a single sugar-crystal shape, softly lit as if being assembled together',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). On a dark laboratory bench at night, a few small softly-glowing translucent ring-shaped molecular forms float above the surface, with one simple faceted sugar-crystal shape and one faint glowing dot beside them, arranged as if they are about to be joined into a single larger unit. Warm rim-light catches the edges of each small shape against deep shadow. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no chemical formulas, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Difference Between Two Words Is One Phosphate',
      markdown: "The whole of your DNA — every instruction that built you — is a long chain of one type of building block called a **nucleotide**. Take just one phosphate group off that building block and it is no longer a nucleotide at all; it becomes something with a different name, a **nucleoside**. That single phosphate is the entire difference between the two most confused words in this chapter, and NEET tests it almost every year.",
    },
    // ── 2 · Core concept — sugars are also building blocks ───────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "You have already met amino acids and fatty acids as building blocks. The living cell has two more small building blocks on the same list: **sugars** (also called **carbohydrates**) and the parts that make up **nucleic acids**.\n\nA **sugar** in its simplest form is a single unit called a **monosaccharide** — the smallest sugar building block. NCERT shows two of them side by side, and the rest of this page uses them to build something bigger: the units that make up DNA and RNA.",
    },
    // ── 3 · Heading — the two sugars ──────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Two Sugars You Must Know By Formula',
      objective: "By the end of this you can write the molecular formula of glucose and of ribose, and say which class of sugar both belong to.",
    },
    // ── 4 · Text — glucose & ribose formulae ─────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "NCERT shows two simple sugars as building blocks. **Glucose** has the formula **C6H12O6**. **Ribose** has the formula **C5H10O5**. Both are **monosaccharides** — single sugar units, the small building blocks from which larger carbohydrates are made.\n\nHold on to ribose especially. In a moment you will attach a nitrogen base to a sugar, and it is this kind of small sugar that sits at the centre of every unit of DNA and RNA.",
    },
    // ── 5 · Heading — nitrogen bases & the units of nucleic acids ─────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'From a Nitrogen Base to a Nucleotide',
      objective: "By the end of this you can name the five nitrogen bases and explain, step by step, how a base becomes a nucleoside and then a nucleotide.",
    },
    // ── 6 · Text — heterocyclic rings & the five bases ───────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Living organisms carry a number of carbon compounds built around **heterocyclic rings** — ring-shaped molecules whose ring contains more than one kind of atom. Some of these compounds are the **nitrogen bases**. There are five of them, and you must know all five by name:\n\n**adenine, guanine, cytosine, uracil, and thymine.**\n\nOn their own these bases are not yet the units of DNA or RNA. They become those units in two clear steps — and the step you are on is decided by one thing only: is a phosphate group present or not?",
    },
    // ── 7 · Interactive image — assembling a nucleotide ──────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'A three-part diagram showing a nitrogen base, a sugar, and a phosphate group joined in sequence, with labels for nucleoside and nucleotide',
      caption: '📸 Tap each dot to build a nucleotide one piece at a time.',
      generation_prompt: "Scientific textbook illustration of how a nucleotide is assembled from its parts. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Three components are shown left to right and joined: on the left a hexagonal/ring-shaped nitrogen base drawn as a clean ring outline, in the centre a five-carbon sugar drawn as a pentagon ring, and on the right a phosphate group drawn as a small P atom with attached O atoms. A bond links the base to the sugar, and a second bond links the sugar to the phosphate. A bracket under the base+sugar pair is labelled 'nucleoside', and a wider bracket under all three parts is labelled 'nucleotide'. Clean white outlines, white labels with thin white leader lines, biologically accurate proportions. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.16, y: 0.42, label: 'Nitrogen base', detail: "One of the five bases — **adenine, guanine, cytosine, uracil, or thymine**. It is a carbon compound built around a heterocyclic ring.", icon: 'circle' },
        { id: uuid(), x: 0.44, y: 0.42, label: 'Sugar', detail: "A small sugar sits at the centre and is the part everything else attaches to. Attaching a base to this sugar is the first step.", icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.78, label: 'Base + sugar = nucleoside', detail: "When a nitrogen base is attached to a sugar, the pair is a **nucleoside**. There is still no phosphate here. Examples: adenosine, guanosine, thymidine, uridine, cytidine.", icon: 'circle' },
        { id: uuid(), x: 0.78, y: 0.42, label: 'Phosphate group', detail: "A **phosphate group** esterified (chemically joined) to the sugar. Its presence is the one thing that changes the name of the whole unit.", icon: 'circle' },
        { id: uuid(), x: 0.55, y: 0.90, label: 'Base + sugar + phosphate = nucleotide', detail: "Add a phosphate to the sugar and the whole unit becomes a **nucleotide**. Examples: adenylic acid, thymidylic acid, guanylic acid, uridylic acid, cytidylic acid.", icon: 'circle' },
        { id: uuid(), x: 0.90, y: 0.78, label: 'Why it matters', detail: "**Nucleic acids like DNA and RNA are made of nucleotides only** — never bare nucleosides. DNA and RNA are the genetic material.", icon: 'circle' },
      ],
    },
    // ── 8 · Text — the two-step naming rule ──────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Here is the rule stated once, cleanly:\n\n- A nitrogen base attached to a **sugar** is a **nucleoside**. The five nucleosides are **adenosine, guanosine, thymidine, uridine, and cytidine**.\n- If a **phosphate group** is also esterified to that sugar, the unit is now a **nucleotide**. The five nucleotides are **adenylic acid, thymidylic acid, guanylic acid, uridylic acid, and cytidylic acid**.\n\nSo the only difference between a nucleoside and a nucleotide is the phosphate. Base + sugar = nucleoside. Base + sugar + phosphate = nucleotide. And the reason this matters: **nucleic acids like DNA and RNA are built from nucleotides only** — the full three-part units — and DNA and RNA are what carry the genetic information of every living thing.",
    },
    // ── 9 · Comparison card — nucleoside vs nucleotide ───────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'Nucleoside vs Nucleotide',
      columns: [
        {
          heading: 'Nucleoside (no phosphate)',
          points: [
            'Made of: nitrogen base + sugar',
            'Phosphate group: absent',
            'The five names: adenosine, guanosine, thymidine, uridine, cytidine',
            'Not the direct building block of DNA/RNA on its own',
          ],
        },
        {
          heading: 'Nucleotide (has phosphate)',
          points: [
            'Made of: nitrogen base + sugar + phosphate',
            'Phosphate group: present (esterified to the sugar)',
            'The five names: adenylic acid, guanylic acid, cytidylic acid, uridylic acid, thymidylic acid',
            'DNA and RNA are made of nucleotides only',
          ],
        },
      ],
    },
    // ── 10 · Table — base → nucleoside → nucleotide ──────────────────────────
    {
      id: uuid(), type: 'table', order: 10,
      caption: 'Each nitrogen base, its nucleoside (base + sugar), and its nucleotide (base + sugar + phosphate)',
      headers: ['Nitrogen base', 'Nucleoside (base + sugar)', 'Nucleotide (+ phosphate)'],
      rows: [
        ['Adenine', 'Adenosine', 'Adenylic acid'],
        ['Guanine', 'Guanosine', 'Guanylic acid'],
        ['Cytosine', 'Cytidine', 'Cytidylic acid'],
        ['Uracil', 'Uridine', 'Uridylic acid'],
        ['Thymine', 'Thymidine', 'Thymidylic acid'],
      ],
    },
    // ── 11 · Reasoning prompt — nucleoside vs nucleotide sorting ──────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 11, reasoning_type: 'logical',
      prompt: "A student is handed four labelled molecules and asked to pick the one that is a nucleoside — a nitrogen base joined to a sugar, with no phosphate. Which one should they pick?",
      options: [
        "Adenylic acid — a base joined to a sugar that also carries a phosphate group",
        "Adenosine — a base joined to a sugar, with no phosphate group present",
        "Adenine — a nitrogen base on its own, not yet joined to any sugar",
        "A nucleotide chain — many base-sugar-phosphate units linked together, as in DNA",
      ],
      reveal: "The answer is adenosine. A nucleoside is exactly a nitrogen base attached to a sugar with no phosphate — and adenosine fits that definition. Adenylic acid is the tempting wrong pick: it is the same base and sugar but carries a phosphate, which makes it a nucleotide, not a nucleoside. Adenine alone is just the bare nitrogen base — it hasn't been joined to a sugar yet, so it isn't a nucleoside either. And a chain of base-sugar-phosphate units is a nucleic acid built from nucleotides, not a single nucleoside.",
      difficulty_level: 2,
    },
    // ── 12 · Remember callout ───────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Two sugars, by formula:** Glucose = **C6H12O6**, Ribose = **C5H10O5**. Both are **monosaccharides**.\n- **Five nitrogen bases:** adenine, guanine, cytosine, uracil, thymine.\n- **Nucleoside = base + sugar** (no phosphate) → adenosine, guanosine, thymidine, uridine, cytidine.\n- **Nucleotide = base + sugar + phosphate** → adenylic acid, thymidylic acid, guanylic acid, uridylic acid, cytidylic acid.\n- The single difference between the two is **the phosphate group**.\n- **DNA and RNA are made of nucleotides only**, and they are the **genetic material**.",
    },
    // ── 13 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Count the phosphate — that's the whole trick.** No phosphate → nucleoside. Phosphate present → nucleotide. NEET loves to hand you a name and ask which one it is.\n\n**Learn the two name-families by their endings:** nucleosides end in **-osine / -idine** (aden**osine**, ur**idine**), while nucleotides are named as **-ylic acids** (aden**ylic acid**, urid**ylic acid**). The ending alone tells you whether a phosphate is attached.\n\n**Classic NEET question:** \"Adenosine is a ___.\" → **a nucleoside** (base + sugar, no phosphate). If the question instead named **adenylic acid**, the answer would be a **nucleotide** — same base and sugar, but now with a phosphate.",
    },
    // ── 14 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "You now have every small building block the cell uses — amino acids, fatty acids, sugars, and the base-sugar-phosphate units that build DNA and RNA. Next you'll step up a level and sort all of a cell's chemicals into two big groups: the small **primary metabolites** the cell can't live without, and the special **secondary metabolites** that plants and microbes make for particular jobs.",
    },
    // ── 15 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "What is the exact difference between a nucleoside and a nucleotide?",
          options: [
            "A nucleoside contains a nitrogen base but a nucleotide does not",
            "A nucleoside is base + sugar; a nucleotide is base + sugar + a phosphate group",
            "A nucleoside is found only in DNA, while a nucleotide is found only in RNA",
            "A nucleoside contains ribose while a nucleotide contains glucose",
          ],
          correct_index: 1,
          explanation: "A nucleoside is a nitrogen base attached to a sugar; add a phosphate group esterified to that sugar and it becomes a nucleotide. That phosphate is the only difference. Both contain a nitrogen base, so option 1 is wrong; both types occur in nucleic acids regardless of DNA vs RNA, so option 3 is wrong; and glucose is not the sugar of these units, so option 4 is wrong.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which of the following is a nucleotide?",
          options: [
            "Adenosine",
            "Adenine",
            "Guanylic acid",
            "Guanosine",
          ],
          correct_index: 2,
          explanation: "Guanylic acid is a nucleotide — it is a base and sugar carrying a phosphate group. Adenosine and guanosine are nucleosides (base + sugar, no phosphate), and adenine is a bare nitrogen base that hasn't been joined to a sugar at all. The '-ylic acid' ending is your signal that a phosphate is present.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "According to NCERT, what are nucleic acids like DNA and RNA made of, and what is their function?",
          options: [
            "Made of nucleosides only; they store fat as an energy reserve",
            "Made of free nitrogen bases only; they speed up chemical reactions",
            "Made of nucleotides only; they function as the genetic material",
            "Made of monosaccharides only; they form the structural wall of the cell",
          ],
          correct_index: 2,
          explanation: "NCERT states plainly that nucleic acids like DNA and RNA consist of nucleotides only, and that DNA and RNA function as the genetic material. Nucleosides and free bases are not the direct building blocks of these chains, and DNA/RNA are not made of sugars alone — so the other options each swap in the wrong building block or the wrong function.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Glucose and ribose are shown by NCERT as building-block sugars. Which pair of formulae is correct?",
          options: [
            "Glucose C5H10O5, Ribose C6H12O6",
            "Glucose C6H12O6, Ribose C5H10O5",
            "Glucose C6H10O5, Ribose C5H12O6",
            "Glucose C5H12O6, Ribose C6H10O5",
          ],
          correct_index: 1,
          explanation: "NCERT gives glucose as C6H12O6 and ribose as C5H10O5. Option 1 swaps the two formulae; options 3 and 4 alter the hydrogen and oxygen counts. Both sugars are monosaccharides — single sugar units used as building blocks.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
