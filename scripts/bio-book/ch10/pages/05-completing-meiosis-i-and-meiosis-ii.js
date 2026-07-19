'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'completing-meiosis-i-and-meiosis-ii',
  title: 'Completing Meiosis I & Meiosis II',
  subtitle: "Two anaphases, two very different separations. Get straight what pulls apart in each one — the homologues in Anaphase I, the sister chromatids in Anaphase II — and you've locked in the single fact NEET tests most.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['cell-cycle-and-cell-division', 'meiosis'],
  glossary: [
    { term: 'Anaphase I', definition: 'The stage of meiosis I where the homologous chromosomes separate and move to opposite poles, while the sister chromatids of each chromosome stay joined at their centromeres.' },
    { term: 'Telophase I', definition: 'The end of meiosis I: the nuclear membrane and nucleolus reappear and cytokinesis follows, producing a dyad of cells. The chromosomes do not fully de-condense back to the interphase state.' },
    { term: 'dyad of cells', definition: 'The two cells formed at the end of meiosis I after cytokinesis.' },
    { term: 'interkinesis', definition: 'The short-lived stage between the two meiotic divisions. There is no replication of DNA during interkinesis. It is followed by prophase II.' },
    { term: 'Prophase II', definition: 'The start of meiosis II, initiated immediately after cytokinesis. The nuclear membrane disappears by its end and the chromosomes become compact again.' },
    { term: 'Anaphase II', definition: 'The stage of meiosis II that begins with the splitting of the centromere of each chromosome, allowing the sister chromatids to separate and move to opposite poles — just as in mitosis.' },
    { term: 'tetrad of cells', definition: 'The four haploid daughter cells formed at the end of meiosis II after telophase II and cytokinesis.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single cell dividing into two, and those two dividing again into four, drawn as a soft glowing progression across a dark field',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet, atmospheric depiction of one softly glowing cell on the left that divides into two cells in the centre, and those two dividing again into four cells on the right — a left-to-right progression suggesting a single cell becoming four, without any text or labels. Faint translucent threads of chromosomes are suggested inside the glowing cells. Deep shadows fill the background, with gentle warm and cool highlights on the cell membranes. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram callouts, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'One Cell In, Four Cells Out',
      markdown: "Mitosis takes one cell and makes two. Meiosis is greedier with the count — it takes one cell and, across two back-to-back divisions, ends with **four** cells. And here's the part students trip over: those two divisions do not do the same job. The first division pulls apart the two members of each chromosome *pair*. The second division finally pulls apart the two *halves* of each chromosome. Same cell, two completely different separations — and the exam loves the difference.",
    },
    // ── 2 · Core concept — where we are in the process ────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "By the time meiosis I reaches its **anaphase**, the homologous chromosomes have already paired up and lined up at the equator. What happens next is the whole point of meiosis I — and it is *not* what happens in an ordinary mitosis.\n\nKeep one picture in your head for this entire page. Each chromosome is made of **two sister chromatids** joined at a **centromere**. In meiosis you deal with **homologous pairs** — two such chromosomes that match, one from each parent. Meiosis I separates the *pairs*. Meiosis II separates the *chromatids*. Everything below is just those two sentences in slow motion.",
    },
    // ── 3 · Heading — completing Meiosis I ───────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Completing Meiosis I — Anaphase I, Telophase I, Interkinesis',
      objective: "By the end of this you can say exactly what separates in Anaphase I (and what does NOT), what a dyad of cells is, and why interkinesis is not a second S phase.",
    },
    // ── 4 · Text — Anaphase I ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Anaphase I** is the make-or-break moment. Here the **homologous chromosomes separate** and move to opposite poles. But look closely at what stays put: the **sister chromatids remain associated at their centromeres**. The centromere does **not** split. So each chromosome travelling to a pole is still a whole chromosome — two chromatids joined together — not a single chromatid.\n\nThis is the one line to burn in. In an ordinary mitosis, anaphase splits the centromere and sends single chromatids to the poles. **Anaphase I refuses to do that.** It separates the pair, keeps each chromosome intact, and leaves the chromatid-splitting job for later.",
    },
    // ── 5 · Text — Telophase I ────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "**Telophase I** wraps up the first division. The **nuclear membrane and nucleolus reappear**, and **cytokinesis follows** — the cell splits in two. The two cells produced at this point are called a **dyad of cells** (\"dyad\" = a group of two).\n\nOne detail NEET likes to catch you on: the chromosomes do loosen up a little here, but **they do not go all the way back to the fully extended interphase state**. They stay somewhat condensed — because another division is coming right away and there's no point fully unpacking them.",
    },
    // ── 6 · Text — Interkinesis ──────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "The gap between the two meiotic divisions is called **interkinesis**, and it is **generally short-lived**. The single most important thing about it: **there is no replication of DNA during interkinesis.** This is exactly what makes the final cells haploid — the DNA was copied once (before meiosis I) but the cell divides twice, so each of the four cells ends with half the chromosome number.\n\nInterkinesis is followed by **prophase II**, which is a **much simpler prophase than prophase I** — no pairing, no crossing over, none of the elaborate steps of the first division.",
    },
    // ── 7 · Reasoning prompt — Anaphase I vs interkinesis check ───────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
      prompt: "A student is tracing a cell through meiosis. They claim: \"During interkinesis the DNA is copied again so that meiosis II has enough to divide.\" What is wrong with this claim, and what actually keeps the daughter cells haploid?",
      options: [
        "Nothing is wrong — interkinesis is a second S phase, and this DNA copy is what makes the cells haploid.",
        "The claim is wrong: there is no DNA replication during interkinesis. The DNA is copied only once (before meiosis I), but the cell divides twice, so each final cell ends with half the chromosome number.",
        "The claim is wrong: DNA is actually copied during prophase II instead of interkinesis, which is what halves the chromosome number.",
        "Nothing is wrong about the copy, but the cells stay haploid because the centromeres split during Anaphase I.",
      ],
      reveal: "Option 2 is right. NCERT states plainly that there is no replication of DNA during interkinesis. The whole logic of meiosis is one round of DNA copying (in the S phase before meiosis I) followed by two rounds of division — copy once, divide twice — which is what leaves each of the four cells haploid. Option 1 is the classic trap: interkinesis looks like an interphase but it is NOT an S phase, so no copying happens. Option 3 invents replication in prophase II (there is none). Option 4 is doubly wrong — the centromeres do not split in Anaphase I at all; that happens in Anaphase II.",
      difficulty_level: 2,
    },
    // ── 8 · Heading — Meiosis II ─────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'Meiosis II — The Division That Behaves Like a Mitosis',
      objective: "By the end of this you can walk through prophase II → metaphase II → anaphase II → telophase II, and explain why the centromere splitting in Anaphase II is the mirror-image of Anaphase I.",
    },
    // ── 9 · Text — Prophase II and Metaphase II ──────────────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "Here is the mental shortcut for the whole second division: **meiosis II resembles a normal mitosis.** If you know mitosis, you almost know meiosis II already.\n\n**Prophase II** starts **immediately after cytokinesis**, usually before the chromosomes have even fully elongated. The **nuclear membrane disappears by the end of prophase II** and the **chromosomes become compact** again.\n\n**Metaphase II** lines the chromosomes up at the **equator**. Now the spindle microtubules from **opposite poles** attach to the **kinetochores of the sister chromatids** — one chromatid's kinetochore hooked to one pole, its sister's to the other. Everything is now set up to pull the two chromatids apart.",
    },
    // ── 10 · Text — Anaphase II and Telophase II + interactive image ──────────
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "**Anaphase II** is where the chromatids finally get separated. It **begins with the simultaneous splitting of the centromere of each chromosome** — the very centromere that had been holding the sister chromatids together. Once it splits, the two **sister chromatids separate** and move to opposite poles. *This* is the step Anaphase I deliberately skipped.\n\n**Telophase II** ends the whole process. The two groups of chromosomes at each pole get **enclosed by a nuclear envelope**, and **cytokinesis follows** — producing a **tetrad of cells, i.e. four haploid daughter cells**. One diploid cell in, four haploid cells out. Trace the full journey below, from the pair splitting in Anaphase I all the way to the four-cell tetrad.",
    },
    // ── 11 · Interactive image — full meiosis journey ─────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 11, src: '',
      alt: 'A left-to-right diagram of meiosis: Anaphase I with homologous chromosomes separating while sister chromatids stay joined, a dyad of two cells, interkinesis with no DNA replication, meiosis II, Anaphase II with centromeres split and chromatids separating, and a final tetrad of four haploid cells',
      caption: '📸 Tap each dot to follow a single cell from Anaphase I to the four-cell tetrad — and watch exactly what separates at each step.',
      generation_prompt: "Scientific textbook illustration of the complete journey through the end of meiosis, laid out left to right in six clear stages. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. Stage 1 (Anaphase I): a cell with two homologous chromosomes moving to opposite poles, each chromosome clearly still made of two sister chromatids joined at a centromere. Stage 2 (Telophase I / dyad): two separate cells, each with a reforming nuclear membrane, chromosomes still somewhat condensed. Stage 3 (interkinesis): the two cells resting, labelled to show no DNA replication. Stage 4 (Prophase II / Metaphase II): chromosomes compact and aligned at the equator with spindle fibres. Stage 5 (Anaphase II): centromeres split, single chromatids moving to opposite poles. Stage 6 (Telophase II / tetrad): four small separate haploid cells. Use magenta/pink for chromosomes and thin grey-white spindle fibres. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.08, y: 0.45, label: 'Anaphase I — pairs separate', detail: "The **homologous chromosomes separate** and head to opposite poles. Crucially, the **sister chromatids stay joined at their centromeres** — the centromere does NOT split here.", icon: 'circle' },
        { id: uuid(), x: 0.26, y: 0.45, label: 'Telophase I — dyad of cells', detail: "The nuclear membrane and nucleolus reappear and **cytokinesis** splits the cell into two — a **dyad of cells**. The chromosomes stay partly condensed, not fully back to interphase.", icon: 'circle' },
        { id: uuid(), x: 0.42, y: 0.45, label: 'Interkinesis — NO DNA copy', detail: "The short gap between the two divisions. **There is no replication of DNA during interkinesis** — copy once, divide twice. It leads into prophase II.", icon: 'circle' },
        { id: uuid(), x: 0.58, y: 0.45, label: 'Prophase II & Metaphase II', detail: "Meiosis II begins right after cytokinesis and **resembles a normal mitosis**. Chromosomes become compact, the nuclear membrane disappears, and they align at the equator with spindle fibres on the **kinetochores of the sister chromatids**.", icon: 'circle' },
        { id: uuid(), x: 0.74, y: 0.45, label: 'Anaphase II — centromere splits', detail: "The **centromere of each chromosome splits**, and now the **sister chromatids finally separate** and move to opposite poles — exactly the step Anaphase I skipped.", icon: 'circle' },
        { id: uuid(), x: 0.90, y: 0.45, label: 'Telophase II — tetrad of 4', detail: "Nuclear envelopes enclose each group of chromosomes and cytokinesis follows, forming a **tetrad of cells — four haploid daughter cells**.", icon: 'circle' },
      ],
    },
    // ── 12 · Comparison card — Anaphase I vs Anaphase II ─────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 12,
      title: 'Anaphase I vs Anaphase II',
      columns: [
        {
          heading: 'Anaphase I',
          points: [
            'Homologous chromosomes separate and move to opposite poles',
            'The centromere does NOT split',
            'Sister chromatids stay joined together',
            'Each pole receives whole chromosomes (two chromatids each)',
          ],
        },
        {
          heading: 'Anaphase II',
          points: [
            'Sister chromatids separate and move to opposite poles',
            'The centromere of each chromosome splits',
            'Sister chromatids are finally pulled apart',
            'Behaves just like a mitotic anaphase — each pole receives single chromatids',
          ],
        },
      ],
    },
    // ── 13 · Remember callout ───────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Anaphase I:** homologous chromosomes separate; **sister chromatids stay joined** (centromere does NOT split).\n- **Telophase I:** nuclear membrane + nucleolus reappear → cytokinesis → **dyad of cells** (chromosomes not fully de-condensed).\n- **Interkinesis:** short gap between the two divisions with **NO DNA replication** — copy once, divide twice.\n- **Meiosis II ≈ a normal mitosis.** Prophase II is much simpler than prophase I; nuclear membrane gone by end of prophase II.\n- **Anaphase II:** the **centromere splits** → **sister chromatids finally separate** (the step Anaphase I skipped).\n- **Telophase II:** nuclear envelopes reform → cytokinesis → **tetrad of cells = four haploid daughter cells.**",
    },
    // ── 14 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**The whole chapter hinges on one contrast:** In **Anaphase I** the homologous chromosomes separate but the centromere does NOT split, so sister chromatids stay together. In **Anaphase II** the centromere splits and the sister chromatids finally separate. Mix these up and you lose the question.\n\n**Interkinesis has no S phase.** NCERT says it in one line — \"there is no replication of DNA during interkinesis\" — and NEET quotes exactly that idea. Copy once, divide twice.\n\n**Classic NEET question:** \"In which stage of meiosis do the sister chromatids finally separate?\" → **Anaphase II** (the centromere splits here). And its twin: \"Is DNA replicated during interkinesis?\" → **No.**",
    },
    // ── 15 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 15,
      markdown: "One cell has now become four haploid cells, and you can say exactly what separated at each anaphase. Next you'll step back and ask *why* the cell bothers with all of this — the significance of meiosis, and how it stacks up side by side against mitosis.",
    },
    // ── 16 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 16, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "During Anaphase I of meiosis, what exactly separates and moves to opposite poles?",
          options: [
            "The sister chromatids separate, because the centromere splits",
            "The homologous chromosomes separate, while the sister chromatids remain joined at their centromeres",
            "Single chromatids separate, exactly as in a mitotic anaphase",
            "The nuclear membrane splits and each half moves to a pole",
          ],
          correct_index: 1,
          explanation: "In Anaphase I the homologous chromosomes separate, but the sister chromatids stay associated at their centromeres — the centromere does NOT split. Options 1 and 3 describe what happens in Anaphase II (and in mitosis), where the centromere splits and chromatids finally separate. Option 4 confuses the nuclear membrane with the chromosomes.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which statement about interkinesis is correct?",
          options: [
            "It is a full S phase in which DNA is replicated to prepare for meiosis II",
            "It is the stage between the two meiotic divisions, and there is no replication of DNA during it",
            "It is another name for prophase II, when the chromosomes first pair up",
            "It is the stage in which the centromeres split to separate the sister chromatids",
          ],
          correct_index: 1,
          explanation: "Interkinesis is the short-lived stage between meiosis I and meiosis II, and NCERT is explicit that there is no DNA replication during it. Option 1 is the classic trap — it looks like an interphase but is NOT an S phase. Option 3 confuses it with prophase II (which follows interkinesis and does no pairing). Option 4 describes Anaphase II.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "In which stage do the sister chromatids finally separate from each other, and what makes it happen?",
          options: [
            "Anaphase I, because the homologous chromosomes are pulled apart",
            "Telophase I, when the dyad of cells is formed by cytokinesis",
            "Anaphase II, because the centromere of each chromosome splits",
            "Prophase II, when the chromosomes become compact again",
          ],
          correct_index: 2,
          explanation: "Anaphase II begins with the splitting of the centromere of each chromosome, which finally allows the two sister chromatids to separate and move to opposite poles. Anaphase I (option 1) separates the homologous pair but keeps the chromatids joined. Telophase I and Prophase II involve no chromatid separation at all.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "How does the end of meiosis II differ from the end of meiosis I in terms of the cells produced?",
          options: [
            "Meiosis I ends with four haploid cells; meiosis II ends with a dyad of two cells",
            "Both divisions end with a dyad of two cells each, giving four cells only after a third division",
            "Meiosis I ends with a dyad of cells; meiosis II ends with a tetrad of cells, i.e. four haploid daughter cells",
            "Meiosis I ends with a tetrad of four cells; meiosis II simply enlarges them without dividing",
          ],
          correct_index: 2,
          explanation: "Telophase I produces a dyad (two cells); telophase II then produces a tetrad — four haploid daughter cells in total from the original single cell. Option 1 reverses the two. Option 2 invents a non-existent third division. Option 4 swaps the dyad and tetrad and wrongly claims meiosis II does not divide.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
