'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'respiratory-volumes-and-capacities',
  title: 'Respiratory Volumes & Capacities',
  subtitle: "There are only four volumes of air a lung deals with — and every capacity NEET asks about is just two or more of those four added together. Learn the four, and the five capacities fall out on their own.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['breathing-and-exchange-of-gases', 'lung-volumes'],
  glossary: [
    { term: 'spirometer', definition: 'The instrument that measures the volume of air moving in and out of the lungs; used for the clinical assessment of pulmonary (lung) functions.' },
    { term: 'tidal volume (TV)', definition: 'The volume of air inspired or expired during one normal, relaxed breath — about 500 mL.' },
    { term: 'inspiratory reserve volume (IRV)', definition: 'The extra volume of air a person can breathe in by a forcible inspiration, over and above a normal breath — about 2500 to 3000 mL.' },
    { term: 'expiratory reserve volume (ERV)', definition: 'The extra volume of air a person can breathe out by a forcible expiration, over and above a normal breath — about 1000 to 1100 mL.' },
    { term: 'residual volume (RV)', definition: 'The volume of air that still remains inside the lungs even after the most forcible expiration — about 1100 to 1200 mL. It can never be breathed out.' },
    { term: 'vital capacity (VC)', definition: 'The maximum volume of air a person can breathe in after a forced expiration (or breathe out after a forced inspiration). VC = ERV + TV + IRV.' },
    { term: 'functional residual capacity (FRC)', definition: 'The volume of air left in the lungs after a normal expiration. FRC = ERV + RV.' },
    { term: 'total lung capacity (TLC)', definition: 'The total volume of air the lungs can hold at the end of a forced inspiration. TLC = RV + ERV + TV + IRV, i.e. vital capacity + residual volume.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A person breathing into a tube connected to an old brass spirometer drum, the rising and falling trace of their breath faintly glowing in the dark',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). In a dim, quiet clinical room, a single mouthpiece and tube lead to an antique brass spirometer with a floating drum, softly lit. Faintly glowing in the darkness behind it is a suggestion of a rising-and-falling breathing trace — gentle waves that climb and dip like the rhythm of a breath — without becoming a literal labelled chart. Deep shadows fill the rest of the frame, warm highlights on the brass fittings. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people's faces.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'You Can Never Fully Empty Your Lungs',
      markdown: "Blow out as hard as you possibly can — squeeze every last bit of air from your chest. You still can't empty your lungs. More than a litre of air, about **1100 to 1200 mL**, stays trapped inside no matter how forcefully you push. That leftover air has a name — **residual volume** — and it's the reason your lungs never collapse flat like an empty bag.",
    },
    // ── 2 · Core concept — why we measure lung volumes ──────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "How much air actually moves through your lungs? Doctors can measure it with an instrument called a **spirometer** — the same machine that gives the **clinical assessment of pulmonary functions**. When a patient breathes into it, it records exactly how much air goes in and out.\n\nHere's the useful part: no matter how you breathe — a lazy relaxed breath, or the deepest gulp you can manage — the air in your lungs sorts itself into just **four basic volumes**. Learn those four, and every bigger measurement doctors care about (called a **capacity**) is simply some of those volumes **added together**. That's the whole logic of this page: four volumes first, then capacities as sums.",
    },
    // ── 3 · Heading — the four volumes ───────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Four Respiratory Volumes',
      objective: "By the end of this you can name all four lung volumes, give the approximate mL value of each, and say which one can never be exhaled.",
    },
    // ── 4 · Text — the four volumes explained ────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Start with an ordinary, relaxed breath — the kind you're taking right now without thinking. The air that moves in (or out) in that one normal breath is the **tidal volume (TV)**, about **500 mL**. Breathe like that steadily and a healthy man moves roughly **6000 to 8000 mL of air per minute**.\n\nNow push past a normal breath. After breathing in normally, you can still force in *more* air — that extra amount from a **forcible inspiration** is the **inspiratory reserve volume (IRV)**, about **2500 to 3000 mL**. In the same way, after breathing out normally you can still force *more* air out — that extra from a **forcible expiration** is the **expiratory reserve volume (ERV)**, about **1000 to 1100 mL**.\n\nEven after that hardest possible push-out, air stays behind. The air **remaining in the lungs even after a forcible expiration** is the **residual volume (RV)**, about **1100 to 1200 mL** — the air you can never breathe out. Those are all four: TV, IRV, ERV, RV.",
    },
    // ── 5 · Table — the four volumes ─────────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 5,
      caption: 'The four respiratory volumes — the building blocks every capacity is made from',
      headers: ['Volume', 'What it is', 'Approx. value'],
      rows: [
        ['Tidal Volume (TV)', 'Air inspired or expired during one normal breath', '≈ 500 mL'],
        ['Inspiratory Reserve Volume (IRV)', 'Extra air breathed in by a forcible inspiration', '2500–3000 mL'],
        ['Expiratory Reserve Volume (ERV)', 'Extra air breathed out by a forcible expiration', '1000–1100 mL'],
        ['Residual Volume (RV)', 'Air still left in the lungs even after a forcible expiration', '1100–1200 mL'],
      ],
    },
    // ── 6 · Reasoning prompt — after the volumes are taught ──────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A spirometer records air only as it moves in and out through the mouthpiece. Using that fact alone, which one of these four volumes can a spirometer NOT measure directly?",
      options: [
        "Tidal volume — the air in a normal breath",
        "Inspiratory reserve volume — the extra air forced in",
        "Expiratory reserve volume — the extra air forced out",
        "Residual volume — the air left after a forcible expiration",
      ],
      reveal: "Residual volume is the odd one out. By its very definition it is the air that remains in the lungs even after the most forcible expiration — it never leaves through the mouthpiece, so a spirometer, which only sees air that actually moves in and out, can't record it directly. The other three (TV, IRV, ERV) are all air that physically flows through the mouthpiece during breathing or forced effort, so the spirometer catches every one of them.",
      difficulty_level: 2,
    },
    // ── 7 · Heading — the capacities ─────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'The Five Capacities — Just Volumes Added Up',
      objective: "By the end of this you can build each of the five pulmonary capacities as a sum of the four volumes, without memorising anything new.",
    },
    // ── 8 · Text — capacities intro ──────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "By **adding up a few of the four volumes**, doctors derive the **pulmonary capacities** used in clinical diagnosis. Nothing new to memorise here — each capacity is just a combination you can reason out.\n\n- **Inspiratory Capacity (IC)** = the air you can breathe in **after a normal expiration** = **TV + IRV**.\n- **Expiratory Capacity (EC)** = the air you can breathe out **after a normal inspiration** = **TV + ERV**.\n- **Functional Residual Capacity (FRC)** = the air that stays in the lungs **after a normal expiration** = **ERV + RV**.\n- **Vital Capacity (VC)** = the **maximum** air you can breathe in after a forced expiration (or breathe out after a forced inspiration) = **ERV + TV + IRV**.\n- **Total Lung Capacity (TLC)** = **all** the air the lungs hold at the end of a forced inspiration = **RV + ERV + TV + IRV**, which is the same as **vital capacity + residual volume**.\n\nTap through the chart below to see how the four volumes stack up, and how each capacity brackets a group of them.",
    },
    // ── 9 · Interactive image — spirogram / lung-volume chart ────────────────
    {
      id: uuid(), type: 'interactive_image', order: 9, src: '',
      alt: 'A spirogram showing tidal volume, inspiratory and expiratory reserve volumes and residual volume stacked vertically, with inspiratory capacity, expiratory capacity, functional residual capacity, vital capacity and total lung capacity marked as brackets grouping those volumes',
      caption: '📸 Tap each dot to see how the four volumes stack up and which ones each capacity adds together.',
      generation_prompt: "Scientific textbook illustration of a respiratory spirogram (lung volumes and capacities chart). Flat 2D educational diagram on a dark background (#0a0a0a near-black). A vertical wavy breathing trace runs left to right in clean white outline, with a normal shallow tidal breathing rhythm in the middle, a deep forced inhalation peak, and a deep forced exhalation trough. Horizontal dashed guide lines in thin white mark the levels. Four stacked volume bands are shown as coloured horizontal segments on the right: tidal volume (small, central), inspiratory reserve volume (large, above tidal), expiratory reserve volume (below tidal), and residual volume (bottom, shaded differently to show it is trapped air). To the far right, vertical brackets group the bands into capacities and are labelled: Inspiratory Capacity (TV+IRV), Expiratory Capacity (TV+ERV), Functional Residual Capacity (ERV+RV), Vital Capacity (ERV+TV+IRV) and Total Lung Capacity (all four). Labels in white text with thin white leader lines. Muted functional colours (soft blue for air volumes, a duller grey-tan for the trapped residual volume). No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.62, y: 0.48, label: 'Tidal Volume (TV) ≈ 500 mL', detail: "The air moved in one **normal, relaxed breath**. It sits in the middle of the trace — the gentle everyday rhythm before any forcing.", icon: 'circle' },
        { id: uuid(), x: 0.62, y: 0.22, label: 'Inspiratory Reserve Volume (IRV) 2500–3000 mL', detail: "The **extra air you can force in** on top of a normal breath. It sits above the tidal band, reaching up to the forced-inhalation peak.", icon: 'circle' },
        { id: uuid(), x: 0.62, y: 0.66, label: 'Expiratory Reserve Volume (ERV) 1000–1100 mL', detail: "The **extra air you can force out** below a normal breath. It sits just under the tidal band.", icon: 'circle' },
        { id: uuid(), x: 0.62, y: 0.86, label: 'Residual Volume (RV) 1100–1200 mL', detail: "The air **trapped in the lungs even after the hardest exhale**. It's the bottom band, shaded apart — you can never breathe it out.", icon: 'circle' },
        { id: uuid(), x: 0.88, y: 0.35, label: 'Vital Capacity (VC) = ERV + TV + IRV', detail: "The **maximum** air you can move — breathe in after a forced expiration, or out after a forced inspiration. It brackets the top three volumes but leaves out residual volume.", icon: 'circle' },
        { id: uuid(), x: 0.88, y: 0.75, label: 'Functional Residual Capacity (FRC) = ERV + RV', detail: "What stays in the lungs **after a normal expiration** — the expiratory reserve plus the residual volume, bracketed together at the bottom.", icon: 'circle' },
        { id: uuid(), x: 0.94, y: 0.5, label: 'Total Lung Capacity (TLC) = all four', detail: "**Everything the lungs hold** at the end of a forced inspiration: RV + ERV + TV + IRV, i.e. vital capacity + residual volume.", icon: 'circle' },
      ],
    },
    // ── 10 · Table — the five capacities as sums ─────────────────────────────
    {
      id: uuid(), type: 'table', order: 10,
      caption: 'The five pulmonary capacities, each written as a sum of the four volumes',
      headers: ['Capacity', 'What it is', 'Formula'],
      rows: [
        ['Inspiratory Capacity (IC)', 'Air breathed in after a normal expiration', 'TV + IRV'],
        ['Expiratory Capacity (EC)', 'Air breathed out after a normal inspiration', 'TV + ERV'],
        ['Functional Residual Capacity (FRC)', 'Air remaining after a normal expiration', 'ERV + RV'],
        ['Vital Capacity (VC)', 'Maximum air breathed in after a forced expiration (or out after a forced inspiration)', 'ERV + TV + IRV'],
        ['Total Lung Capacity (TLC)', 'Total air in the lungs at the end of a forced inspiration', 'RV + ERV + TV + IRV (= VC + RV)'],
      ],
    },
    // ── 11 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'Lock These In',
      markdown: "**The four volumes (with values):**\n- **TV** ≈ 500 mL · **IRV** 2500–3000 mL · **ERV** 1000–1100 mL · **RV** 1100–1200 mL\n\n**The five capacities (as sums — never memorise a value, build it):**\n- **IC** = TV + IRV\n- **EC** = TV + ERV\n- **FRC** = ERV + RV\n- **VC** = ERV + TV + IRV\n- **TLC** = RV + ERV + TV + IRV  (= Vital Capacity + Residual Volume)\n\n**One-line check:** the only capacity that leaves out RV is **Vital Capacity**; the only one that leaves out IRV *and* TV is **FRC**; **TLC** is the one that contains all four.",
    },
    // ── 12 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Vital Capacity is the classic trap:** VC = **ERV + TV + IRV**. Students wrongly add residual volume into it — but RV is exactly what VC leaves out (it's the air you *can't* breathe out). Add RV to VC and you get TLC, not VC.\n\n**Residual volume can't be measured by a simple spirometer** because it never leaves the lungs — this exact reasoning is asked directly.\n\n**Classic NEET question:** \"Vital capacity is equal to ___\" → **ERV + TV + IRV**. And its cousin: \"The volume of air remaining in the lungs after a forcible expiration is the ___\" → **residual volume**.",
    },
    // ── 13 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "You can now measure exactly how much air a pair of lungs moves and holds. But moving air in and out is only half the story — the real purpose is the **exchange of gases**. Next, you'll go right down to the **alveoli**, where oxygen and carbon dioxide actually cross between the air and the blood.",
    },
    // ── 14 · Inline quiz (LAST) ──────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Vital capacity (VC) is the sum of which respiratory volumes?",
          options: [
            "ERV + TV + IRV",
            "TV + IRV + RV",
            "ERV + TV + RV",
            "ERV + IRV + RV",
          ],
          correct_index: 0,
          explanation: "Vital capacity is the maximum air a person can move — in after a forced expiration or out after a forced inspiration — and it equals ERV + TV + IRV. The tempting wrong picks all sneak in residual volume (RV), but RV is precisely the air you can never breathe out, so it is never part of vital capacity. Add RV to VC and you would have total lung capacity instead.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which volume remains in the lungs even after the most forcible expiration, and roughly how much is it?",
          options: [
            "Residual volume, about 1100–1200 mL",
            "Expiratory reserve volume, about 1000–1100 mL",
            "Tidal volume, about 500 mL",
            "Inspiratory reserve volume, about 2500–3000 mL",
          ],
          correct_index: 0,
          explanation: "Residual volume is defined as the air still left in the lungs after a forcible expiration — about 1100–1200 mL. Expiratory reserve volume is the extra air you *do* manage to force out (1000–1100 mL), so it leaves the lungs rather than staying behind. Tidal volume is a normal breath (500 mL) and IRV is the extra air forced in, neither of which is what stays behind after a hard exhale.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Functional Residual Capacity (FRC) — the air remaining in the lungs after a normal expiration — is made up of which volumes?",
          options: [
            "ERV + RV",
            "TV + RV",
            "TV + IRV",
            "TV + ERV",
          ],
          correct_index: 0,
          explanation: "FRC is the air left after a normal (not forced) expiration, which is the expiratory reserve volume plus the residual volume: ERV + RV. TV + IRV is the inspiratory capacity (IC), and TV + ERV is the expiratory capacity (EC) — both describe air being moved, not air left behind, so they can't be FRC.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "A patient's total lung capacity is measured, then their vital capacity is subtracted from it. What is the number that remains?",
          options: [
            "The residual volume",
            "The tidal volume",
            "The inspiratory reserve volume",
            "The expiratory reserve volume",
          ],
          correct_index: 0,
          explanation: "Total lung capacity equals vital capacity plus residual volume (TLC = VC + RV), so TLC minus VC leaves exactly the residual volume. Tidal volume, IRV and ERV are all part of vital capacity itself, so subtracting VC has already removed them — only the residual volume, the one thing VC never included, is left over.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
