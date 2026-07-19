'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-pituitary-gland',
  title: 'The Pituitary Gland — the Master Gland',
  subtitle: "A gland the size of a pea, tucked into a bony pocket at the base of your brain, runs six of the body's other hormone systems. Learn its two lobes, the eight hormones they handle, and the exact disorders NEET asks about.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['chemical-coordination-and-integration', 'pituitary'],
  glossary: [
    { term: 'sella turcica', definition: 'The small bony cavity at the base of the skull in which the pituitary gland sits, protected on all sides.' },
    { term: 'adenohypophysis', definition: 'One of the two anatomical divisions of the pituitary. It consists of two portions — the pars distalis and the pars intermedia.' },
    { term: 'pars distalis', definition: 'The main region of the adenohypophysis, commonly called the anterior pituitary. It produces six hormones: GH, PRL, TSH, ACTH, LH and FSH.' },
    { term: 'pars intermedia', definition: 'The other portion of the adenohypophysis; it secretes only melanocyte stimulating hormone (MSH). In humans it is almost merged with the pars distalis.' },
    { term: 'neurohypophysis', definition: 'The second anatomical division of the pituitary, also called the pars nervosa or posterior pituitary. It stores and releases oxytocin and vasopressin.' },
    { term: 'gonadotrophins', definition: 'The name given to LH and FSH together, because both act on the gonads (testis or ovary) to control their activity.' },
    { term: 'vasopressin (ADH)', definition: 'A posterior-pituitary hormone that acts at the kidney to reabsorb water and electrolytes, reducing water loss in urine. Because it opposes diuresis, it is also called anti-diuretic hormone (ADH).' },
    { term: 'acromegaly', definition: 'Severe disfigurement, especially of the face, caused by excess growth hormone secretion in adults (especially middle age).' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A glowing pea-sized gland suspended at the base of a shadowed human brain, connected upward by a thin stalk',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single small, softly glowing pea-sized gland hangs at the underside of a dimly lit human brain, joined to the brain above it by a thin delicate stalk, nestled into a shadowed bony hollow. Warm amber light emanates from the small gland as if it were quietly commanding the darkness around it, with faint threads of light spreading outward toward the edges of the frame to suggest its far-reaching control. Deep shadows fill the rest of the composition. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Gland That Bosses the Other Glands',
      markdown: "The pituitary is often called the **master gland** — and once you see what it does, the nickname makes sense. Several of its own hormones don't act on the body directly at all; instead they order **other** glands to release **their** hormones. **TSH** tells the thyroid to fire. **ACTH** tells the adrenal cortex to fire. **LH and FSH** tell the testis and ovary to fire. One pea-sized gland, holding the remote control for a whole network of others.",
    },
    // ── 2 · Core concept — location, sella turcica, the two lobes ───────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The pituitary gland sits in a **bony cavity called the sella turcica**, and it is **attached to the hypothalamus by a stalk**. That connection to the hypothalamus is not a small detail — as you'll see, some of the pituitary's hormones are actually made by the hypothalamus above it.\n\nAnatomically, the gland is divided into two parts: an **adenohypophysis** and a **neurohypophysis**. The adenohypophysis is itself made of two portions — the **pars distalis** and the **pars intermedia**. The neurohypophysis is also called the **pars nervosa**. So before any hormone names, fix the map in your head: **adeno**hypophysis (pars distalis + pars intermedia) up front, **neuro**hypophysis (pars nervosa) behind.",
    },
    // ── 3 · Heading — anterior pituitary hormones ───────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Anterior Pituitary and Its Six Hormones',
      objective: "By the end of this you can name the six hormones the pars distalis produces, say what each one targets, and place them on a diagram of the gland.",
    },
    // ── 4 · Text — pars distalis six + pars intermedia MSH, with figure intro ─
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The **pars distalis**, commonly called the **anterior pituitary**, produces **six** hormones: **growth hormone (GH)**, **prolactin (PRL)**, **thyroid stimulating hormone (TSH)**, **adrenocorticotrophic hormone (ACTH)**, **luteinizing hormone (LH)** and **follicle stimulating hormone (FSH)**.\n\nThe **pars intermedia** secretes only **one** hormone — **melanocyte stimulating hormone (MSH)**. In humans, though, the pars intermedia is **almost merged** with the pars distalis, so treat MSH as the single hormone of that tiny middle strip.\n\nEach hormone has its own job. **GH** drives body growth. **PRL** regulates growth of the mammary glands and formation of milk. **TSH** stimulates the thyroid gland to make thyroid hormones. **ACTH** stimulates the adrenal cortex to make steroid hormones called glucocorticoids. **LH** and **FSH** are the **gonadotrophins** — in males, LH drives androgen secretion from the testis while FSH plus androgens regulate spermatogenesis; in females, LH induces ovulation and maintains the corpus luteum while FSH drives growth of the ovarian follicles. **MSH** acts on the melanocytes and regulates skin pigmentation. Tap through the diagram below to place each region, then use the table to lock the hormone-to-target pairings.",
    },
    // ── 5 · Interactive image — the gland and its parts ─────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Diagrammatic view of the pituitary gland hanging below the hypothalamus, showing the stalk, anterior pituitary (pars distalis), pars intermedia, posterior pituitary (pars nervosa) and the portal circulation',
      caption: '📸 Tap each dot to explore the pituitary and its relationship with the hypothalamus (Figure 19.2 style).',
      generation_prompt: "Scientific textbook illustration of the human pituitary gland and its relationship with the hypothalamus. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions. At the top, the hypothalamus of the brain, with a suggestion of hypothalamic neurons. A thin stalk descends from the hypothalamus to the pituitary gland below, which sits in a bony hollow (sella turcica). The pituitary shows two lobes: an anterior pituitary (pars distalis) to one side and a posterior pituitary (pars nervosa) to the other, with a thin pars intermedia strip between them. A network of small blood vessels (portal circulation) runs down the stalk connecting the hypothalamus to the anterior pituitary. Functional colours: soft pink/magenta for the glandular tissue, pale blue-red vessels for the portal circulation. Labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.50, y: 0.12, label: 'Hypothalamus', detail: "The region of the brain that sits directly above the pituitary and is joined to it by the stalk. It **synthesises oxytocin and vasopressin**, which then travel down to be stored in the posterior pituitary.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.34, label: 'Stalk', detail: "The thin bridge that **attaches the pituitary to the hypothalamus**. Hormones and signals from the hypothalamus reach the pituitary through this stalk.", icon: 'circle' },
        { id: uuid(), x: 0.38, y: 0.48, label: 'Portal circulation', detail: "The network of blood vessels running down the stalk that links the hypothalamus to the **anterior pituitary** (shown in Figure 19.2). It carries hypothalamic signals to the pars distalis.", icon: 'circle' },
        { id: uuid(), x: 0.34, y: 0.70, label: 'Anterior pituitary (pars distalis)', detail: "The main region of the adenohypophysis. It produces **six hormones**: GH, PRL, TSH, ACTH, LH and FSH.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.72, label: 'Pars intermedia', detail: "The thin middle portion of the adenohypophysis. It secretes only **one hormone — MSH** (melanocyte stimulating hormone). In humans it is almost merged with the pars distalis.", icon: 'circle' },
        { id: uuid(), x: 0.67, y: 0.68, label: 'Posterior pituitary (pars nervosa)', detail: "The neurohypophysis. It does not make its own hormones — it **stores and releases oxytocin and vasopressin**, which are made by the hypothalamus and transported down axonally.", icon: 'circle' },
      ],
    },
    // ── 6 · Table — pituitary hormones and their targets ────────────────────
    {
      id: uuid(), type: 'table', order: 6,
      caption: 'Every pituitary hormone, the region that makes or releases it, and what it targets',
      headers: ['Hormone', 'Region', 'Target / function'],
      rows: [
        ['Growth hormone (GH)', 'Pars distalis (anterior)', 'Drives growth of the body'],
        ['Prolactin (PRL)', 'Pars distalis (anterior)', 'Growth of the mammary glands and formation of milk'],
        ['Thyroid stimulating hormone (TSH)', 'Pars distalis (anterior)', 'Stimulates the thyroid gland to make thyroid hormones'],
        ['Adrenocorticotrophic hormone (ACTH)', 'Pars distalis (anterior)', 'Stimulates glucocorticoids from the adrenal cortex'],
        ['Luteinizing hormone (LH)', 'Pars distalis (anterior)', 'Males: androgens from testis. Females: ovulation + maintains corpus luteum'],
        ['Follicle stimulating hormone (FSH)', 'Pars distalis (anterior)', 'Males: with androgens, drives spermatogenesis. Females: growth of ovarian follicles'],
        ['Melanocyte stimulating hormone (MSH)', 'Pars intermedia', 'Acts on melanocytes; regulates skin pigmentation'],
        ['Oxytocin', 'Pars nervosa (posterior)', 'Contracts smooth muscle; uterus at childbirth + milk ejection'],
        ['Vasopressin (ADH)', 'Pars nervosa (posterior)', 'Kidney: reabsorbs water/electrolytes at distal tubules, reducing urine water loss'],
      ],
    },
    // ── 7 · Heading — posterior pituitary + GH disorders ────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'The Posterior Pituitary, and What Happens When Hormones Go Wrong',
      objective: "By the end of this you can explain how the posterior pituitary stores hormones it never made, and match each pituitary disorder — gigantism, dwarfism, acromegaly, diabetes insipidus — to its cause.",
    },
    // ── 8 · Text — posterior storage, oxytocin, vasopressin, disorders ──────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "The **neurohypophysis (pars nervosa)**, or posterior pituitary, works differently from the anterior. It **does not synthesise its own hormones**. It **stores and releases two hormones — oxytocin and vasopressin — which are actually made by the hypothalamus** and transported down the stalk **axonally** to the posterior pituitary. So a hormone released from the posterior pituitary was born one storey up.\n\n**Oxytocin** acts on the **smooth muscles** of the body and stimulates their contraction. In females it drives the **vigorous contraction of the uterus at childbirth** and **milk ejection** from the mammary gland. **Vasopressin** acts mainly at the **kidney**, stimulating **resorption of water and electrolytes by the distal tubules**, which reduces the loss of water through urine (diuresis) — which is why it is also called **anti-diuretic hormone (ADH)**. If ADH synthesis or release is impaired, the kidney can no longer conserve water, so water is lost and the body dehydrates — a condition called **diabetes insipidus**.\n\nGrowth hormone has its own set of disorders. **Over-secretion of GH** causes abnormal, excessive growth — **gigantism**. **Low secretion of GH** causes stunted growth — **pituitary dwarfism**. And **excess GH in adults**, especially in middle age, causes severe disfigurement (especially of the face) called **acromegaly**.",
    },
    // ── 9 · Comparison card — growth hormone disorders ──────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'Growth hormone gone wrong: three different outcomes',
      columns: [
        { heading: 'Too much GH (growing years)', points: ['Over-secretion of growth hormone', 'Abnormal, excessive growth of the body', '→ Gigantism'] },
        { heading: 'Too little GH', points: ['Low secretion of growth hormone', 'Stunted growth', '→ Pituitary dwarfism'] },
        { heading: 'Excess GH in adults (middle age)', points: ['Excess growth hormone after growth has stopped', 'Severe disfigurement, especially of the face', '→ Acromegaly'] },
      ],
    },
    // ── 10 · Reasoning prompt — GH / gigantism attribution ──────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "A young patient shows abnormal, excessive growth of the body — gigantism. Over-secretion of which hormone, from which region of the pituitary, is responsible?",
      options: [
        "Growth hormone (GH), from the pars distalis (anterior pituitary)",
        "Thyroid stimulating hormone (TSH), from the pars distalis (anterior pituitary)",
        "Melanocyte stimulating hormone (MSH), from the pars intermedia",
        "Vasopressin (ADH), from the pars nervosa (posterior pituitary)",
      ],
      reveal: "The answer is growth hormone (GH) from the pars distalis. NCERT states that over-secretion of GH stimulates abnormal growth leading to gigantism (and low GH gives dwarfism). The tempting wrong pick is TSH, because it is also an anterior-pituitary hormone from the same pars distalis — but TSH acts on the thyroid gland, not on body growth. MSH controls skin pigmentation, and vasopressin acts on the kidney; neither has anything to do with body size.",
      difficulty_level: 2,
    },
    // ── 11 · Remember callout ───────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Anterior pituitary (pars distalis) → six hormones:** GH, PRL, TSH, ACTH, LH, FSH.\n- **Pars intermedia → one hormone:** MSH.\n- **Posterior pituitary (pars nervosa) → stores & releases oxytocin + vasopressin** — but these are **made by the hypothalamus** and carried down axonally. The posterior pituitary makes nothing of its own.\n- **GH:** over-secretion → **gigantism**; low secretion → **pituitary dwarfism**; excess in adults → **acromegaly**.\n- **Vasopressin = ADH** (acts at the kidney, saves water). Impaired ADH → **diabetes insipidus** (water loss, dehydration).\n- **Gonadotrophins = LH + FSH.** **TSH → thyroid; ACTH → adrenal cortex (glucocorticoids).**",
    },
    // ── 12 · Exam tip ───────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Which lobe makes what:** NEET loves to test that the posterior pituitary only **stores and releases** oxytocin and vasopressin — the **hypothalamus** synthesises them. Anything worded as \"the posterior pituitary *synthesises* oxytocin\" is a trap.\n\n**GH disorders by age:** the same hormone gives different diseases depending on when it goes wrong — over-secretion during growth → gigantism, low secretion → dwarfism, and excess *in adults* → acromegaly. The adult-onset detail is the one students miss.\n\n**Classic NEET question:** \"Oxytocin and vasopressin are released by the ___ pituitary.\" → **posterior** (pars nervosa). And: \"Excess growth hormone in adults causes ___.\" → **acromegaly**.",
    },
    // ── 13 · Bridge text ────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "You now know the master gland cold — its two lobes, its eight hormones, and the four disorders NEET builds questions from. Next, we move to three more endocrine glands and what they control: the **pineal gland**, and the **thyroid and parathyroid**.",
    },
    // ── 14 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Which of these is NOT one of the six hormones produced by the pars distalis (anterior pituitary)?",
          options: [
            "Growth hormone (GH)",
            "Thyroid stimulating hormone (TSH)",
            "Oxytocin",
            "Follicle stimulating hormone (FSH)",
          ],
          correct_index: 2,
          explanation: "The six pars distalis hormones are GH, PRL, TSH, ACTH, LH and FSH — so GH, TSH and FSH all belong to the anterior pituitary. Oxytocin is the odd one out: it is stored and released by the posterior pituitary (pars nervosa) and is actually synthesised by the hypothalamus, not made by the pars distalis.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "The posterior pituitary releases oxytocin and vasopressin — but where are these two hormones actually synthesised?",
          options: [
            "In the pars distalis of the pituitary",
            "In the hypothalamus",
            "In the pars intermedia of the pituitary",
            "In the adrenal cortex",
          ],
          correct_index: 1,
          explanation: "NCERT is explicit: oxytocin and vasopressin are synthesised by the hypothalamus and transported axonally down to the neurohypophysis, where they are only stored and released. The pars distalis makes the six anterior hormones, the pars intermedia makes MSH, and the adrenal cortex makes glucocorticoids — none of them make oxytocin or vasopressin.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Vasopressin acts at the kidney to conserve water, so it is also called ADH. What happens if its synthesis or release is impaired?",
          options: [
            "Water is lost through urine, causing dehydration — a condition called diabetes insipidus",
            "Too much water is retained, causing severe body swelling",
            "Skin pigmentation increases sharply, darkening the skin",
            "The thyroid gland is over-stimulated, enlarging into a goitre",
          ],
          correct_index: 0,
          explanation: "Impaired ADH means the kidney can no longer reabsorb water at the distal tubules, so water is lost through urine and the body dehydrates — NCERT names this diabetes insipidus. It does not cause water retention (the opposite is true). Skin pigmentation is MSH's domain, and thyroid stimulation is TSH's — neither is affected by ADH.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "A middle-aged adult develops severe disfigurement, especially of the face, traced to a pituitary problem. Which condition is this, and what causes it?",
          options: [
            "Gigantism, from over-secretion of GH before growth has stopped",
            "Acromegaly, from excess secretion of GH in adults",
            "Pituitary dwarfism, from low secretion of GH",
            "Diabetes insipidus, from impaired release of ADH",
          ],
          correct_index: 1,
          explanation: "Excess growth hormone in adults, especially in middle age, causes severe facial disfigurement — NCERT calls this acromegaly. Gigantism is also over-secretion of GH, but it happens during the growing years and causes abnormal body growth, not adult facial disfigurement. Dwarfism is the low-GH condition, and diabetes insipidus is an ADH disorder affecting water balance, not facial features.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
