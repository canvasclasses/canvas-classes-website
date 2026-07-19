'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'oogenesis-and-follicle-development',
  title: 'Oogenesis & Follicle Development',
  subtitle: 'How the ovary makes one egg — starting before a girl is even born, and finishing only after a sperm arrives.',
  page_number: 5,
  page_type: 'lesson',
  tags: ['oogenesis', 'graafian-follicle', 'human-reproduction', 'gametogenesis'],
  glossary: [
    { term: 'oogonia', definition: 'The gamete mother cells of the ovary. A couple of million form in each fetal ovary before birth, and no new ones are ever added afterward.' },
    { term: 'primary oocyte', definition: 'An oogonium that has entered prophase-I of meiosis and then stopped there. It stays frozen at this arrested stage from before birth until it is ready to mature.' },
    { term: 'granulosa cells', definition: 'The layer (or layers) of cells that wrap around an oocyte inside a follicle and nourish it as the follicle grows.' },
    { term: 'antrum', definition: 'The fluid-filled cavity that appears inside a tertiary follicle. Its presence is what marks a follicle as tertiary.' },
    { term: 'Graafian follicle', definition: 'The final, mature follicle. It ruptures to release the secondary oocyte from the ovary during ovulation.' },
    { term: 'zona pellucida', definition: 'A new membrane the secondary oocyte forms around itself. A sperm must cross this layer to fertilise the egg.' },
    { term: 'polar body', definition: 'A tiny cell thrown off during the unequal meiotic divisions of oogenesis. It carries a set of chromosomes but almost no cytoplasm, so it cannot become an egg.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single glowing egg cell resting deep inside a fluid-filled ovarian follicle, ringed by nourishing cells',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single large, luminous ovarian egg cell resting off-centre inside a rounded, fluid-filled follicle, cradled by a soft ring of smaller nourishing cells that fade into a deep, dark biological interior. A faint warm glow radiates from the egg outward through the surrounding fluid, giving a sense of something precious being protected and prepared. Painterly, atmospheric illustration style, naturalistic soft tissue tones (muted pinks and warm ambers) against an overall dark background (#0a0a0a base tones). No text, no labels, no diagram lines, not a clinical diagram — a mood piece suggesting the quiet making of a single egg.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Every Egg She Will Ever Have — Before She Is Born',
      markdown: "A baby girl is born with **all the egg-making cells she will ever have already made**. Oogenesis starts while she is still an embryo inside her own mother, and **no new gamete mother cells are formed or added after birth**. From then on the number only goes *down*: from a couple of million before birth, huge numbers waste away, so that by puberty **only 60,000–80,000** are left in each ovary. Compare that to a man, whose sperm factory doesn't even switch on until puberty and then runs for life. The egg supply is fixed on day one.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "**Oogenesis is the process of forming a mature female gamete** — the ovum. NCERT is blunt about it: oogenesis is *markedly different* from spermatogenesis, and the differences all trace back to *when* it starts and *how* the cell divides.\n\nIt begins in the **embryo**. During fetal development a couple of million **gamete mother cells (oogonia)** form inside each ovary, and that's the entire stock — **no more oogonia are made after birth**. These oogonia start to divide, enter **prophase-I of meiosis, and then get temporarily arrested right there**. A cell frozen at this arrested stage is called a **primary oocyte**. So a primary oocyte is not a resting oogonium — it has already committed to meiosis and paused mid-way, and it will wait like that for years.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Follicle Grows Up: Primary → Secondary → Tertiary → Graafian',
      objective: 'By the end of this you can name each follicle stage in order and say the one feature that defines it.',
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "A follicle is the oocyte plus the cells packed around it, and it matures through a fixed sequence of names.\n\n- Each primary oocyte gets wrapped by **a single layer of granulosa cells** — now it is a **primary follicle**.\n- More layers of granulosa cells plus a new outer coat called the **theca** build up around it — now it is a **secondary follicle**.\n- A **fluid-filled cavity called the antrum** appears inside — now it is a **tertiary follicle**. At this stage the theca splits into an inner **theca interna** and an outer **theca externa**.\n- **It is at the tertiary stage** that the primary oocyte finally grows in size and **completes its first meiotic division**. This division is **unequal**: it produces one large **secondary oocyte** that keeps almost all the nutrient-rich cytoplasm, plus a tiny **first polar body** that gets almost nothing. Both are haploid — the polar body is simply a cell that was cheated of cytoplasm so the future egg could stay well-stocked.\n- The tertiary follicle then becomes the **mature follicle, or Graafian follicle**. The secondary oocyte now builds a new membrane, the **zona pellucida**, around itself.\n\nThe Graafian follicle finally **ruptures and releases the secondary oocyte (the ovum) from the ovary** — that release is **ovulation**. Notice what has *not* happened yet: **the second meiotic division is still incomplete**. It finishes only after a sperm enters, producing the **second polar body** and the fully mature **ovum**.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Sectional view of an ovary showing follicles at every stage of development arranged around the rim, from primary follicle through Graafian follicle to corpus luteum',
      caption: '📸 Tap each dot to follow one follicle growing up — primary to Graafian to corpus luteum (Figure 2.7)',
      generation_prompt: "Scientific textbook illustration of a diagrammatic sectional view of a mammalian ovary. Flat 2D educational diagram on a dark background (#0a0a0a near-black). An oval ovary cross-section with follicles at progressive stages arranged clockwise around the outer rim, showing developmental sequence: a small primary follicle (a single round oocyte with one thin layer of cells) upper left; a larger secondary follicle (oocyte wrapped in several cell layers with an outer theca) upper right; a tertiary/mature Graafian follicle (large, with a prominent fluid-filled cavity, the antrum, off to one side and the oocyte pushed to one edge) at the right; a follicle rupturing to release an egg at lower right; and a corpus luteum (a solid, folded yellowish body) at the lower left. Clean white outlines, thin white leader lines, biologically accurate proportions, soft naturalistic pink and amber soft-tissue fills, antrum fluid shown pale blue. No baked-in text labels. No photorealism, no cartoon, no mascots, standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.22, y: 0.30, label: 'Primary follicle', icon: 'circle',
          detail: 'The starting stage: a **primary oocyte wrapped in a single layer of granulosa cells**. Most of these degenerate between birth and puberty.' },
        { id: uuid(), x: 0.50, y: 0.20, label: 'Secondary follicle', icon: 'circle',
          detail: 'The follicle has gained **more layers of granulosa cells and a new theca** coat around the oocyte.' },
        { id: uuid(), x: 0.74, y: 0.34, label: 'Tertiary / Graafian follicle', icon: 'circle',
          detail: 'The mature follicle. The tertiary follicle develops the antrum and completes meiosis-I, then becomes the **Graafian follicle** that ruptures at ovulation.' },
        { id: uuid(), x: 0.80, y: 0.52, label: 'Antrum', icon: 'circle',
          detail: 'The **fluid-filled cavity** inside the follicle. Its appearance is what turns a secondary follicle into a tertiary follicle.' },
        { id: uuid(), x: 0.68, y: 0.60, label: 'Secondary oocyte', icon: 'circle',
          detail: 'The large haploid cell formed by the **unequal first meiotic division** — it keeps the bulk of the cytoplasm. This is the cell released at ovulation.' },
        { id: uuid(), x: 0.60, y: 0.72, label: 'Zona pellucida', icon: 'circle',
          detail: 'The **new membrane the secondary oocyte forms around itself** before ovulation. A sperm must penetrate it to fertilise the egg.' },
        { id: uuid(), x: 0.26, y: 0.68, label: 'Corpus luteum', icon: 'circle',
          detail: 'After the Graafian follicle ruptures, its **leftover parts transform into the corpus luteum**, which secretes progesterone to maintain the uterine lining.' },
      ],
    },
    {
      id: uuid(), type: 'comparison_card', order: 6,
      title: 'Oogenesis vs Spermatogenesis',
      columns: [
        { heading: 'Oogenesis (female)', points: [
          'Starts **before birth**, in the embryo — then pauses.',
          'Fixed stock of oogonia; **none added after birth**.',
          'Meiotic divisions are **unequal**.',
          'One primary oocyte finally yields **one ovum + polar bodies** (the polar bodies are wasted cells).',
          'Meiosis-I completes in the tertiary follicle; **meiosis-II finishes only after a sperm enters**.',
          'Product keeps the **bulk of the cytoplasm** — a large, food-rich egg.',
        ] },
        { heading: 'Spermatogenesis (male)', points: [
          'Starts **at puberty** and continues through life.',
          'Spermatogonia keep multiplying by mitosis; supply is continually renewed.',
          'Meiotic divisions are **equal**.',
          'One primary spermatocyte yields **four equal spermatids → four sperms**.',
          'Both meiotic divisions are completed inside the testis before release.',
          'Products are small, stripped-down, motile cells.',
        ] },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
      prompt: "The first meiotic division in oogenesis produces a secondary oocyte and a first polar body, both haploid and both carrying a full set of chromosomes. Yet only the secondary oocyte can go on to become an egg. Why is the polar body a dead end?",
      options: [
        "The polar body is diploid, so it cannot become a haploid gamete",
        "The division was unequal in cytoplasm — the secondary oocyte kept almost all of it, leaving the polar body without the food reserves an egg needs",
        "The polar body never entered meiosis, so it is still a resting oogonium",
        "The polar body is formed only in the Graafian follicle after ovulation",
      ],
      reveal: "The split of chromosomes was fair — both cells are haploid — but the split of *cytoplasm* was not. NCERT stresses that the first meiotic division is **unequal**, so the secondary oocyte retains the bulk of the nutrient-rich cytoplasm and the polar body gets almost none. Without that food store the polar body can't support a developing embryo, so it's a dead end. The tempting trap is 'the polar body is diploid' — it isn't; both products are haploid, and the real difference is cytoplasm, not chromosome number.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 8, variant: 'remember', title: 'Lock These Down',
      markdown: "- **Oogenesis begins in the embryo**; oogonia are **not** added after birth.\n- Oogonia enter **prophase-I and arrest** → **primary oocytes**.\n- At puberty: **60,000–80,000 primary follicles** left **per ovary**.\n- Follicle order: **primary → secondary → tertiary (antrum appears) → Graafian (mature)**.\n- **Meiosis-I** (unequal) happens in the **tertiary follicle** → **secondary oocyte + first polar body**; the secondary oocyte keeps the cytoplasm.\n- **Zona pellucida** forms around the secondary oocyte; **ovulation** = Graafian follicle rupturing to release it.\n- **Meiosis-II completes only after sperm entry** → **second polar body + ovum**.",
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Number trap:** 60,000–80,000 is **per ovary**, and it's the count **at puberty**, not at birth. NEET loves swapping 'at birth' for 'at puberty' or dropping the 'per ovary'.\n\n**Stage trap:** the antrum defines the **tertiary** follicle, and meiosis-I completes in the **tertiary** follicle — not the primary or secondary. A common wrong option pins meiosis-I to the primary follicle.\n\n**Timing trap:** meiosis-II is **not** finished at ovulation. The cell released is a **secondary oocyte**, and meiosis-II completes **only when a sperm enters**, giving the ovum and second polar body.\n\n**Classic NEET question:** \"How many functional ova are formed from one primary oocyte, and how many from one primary spermatocyte?\" → **one ovum from a primary oocyte (plus polar bodies); four sperms from a primary spermatocyte.**",
    },
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "So the ovary hands over a **secondary oocyte**, not a finished egg, and holds the last step of meiosis in reserve until fertilisation. What happens to the empty Graafian follicle left behind, and how the whole ovary is timed month to month, is the story of the **menstrual cycle** — the next page.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'When does oogenesis begin, and are new gamete mother cells added later?',
          options: [
            'At puberty; new oogonia are added each month',
            'During embryonic development; no oogonia are added after birth',
            'At birth; oogonia keep multiplying until puberty',
            'At the first menstrual cycle; oogonia are added throughout reproductive life',
          ],
          correct_index: 1,
          explanation: "NCERT states oogenesis is initiated during the embryonic stage, when the oogonia form in the fetal ovary, and no more oogonia are formed or added after birth. Puberty is when spermatogenesis begins in the male and when follicle numbers have already dropped to 60,000–80,000 — it is not when oogenesis starts.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'A follicle is described as having a fluid-filled cavity called the antrum. Which stage is it, and what happens to the oocyte here?',
          options: [
            'Primary follicle; the oocyte is still arrested and has not divided',
            'Secondary follicle; the oocyte completes its second meiotic division',
            'Tertiary follicle; the primary oocyte completes its first meiotic division',
            'Graafian follicle; the ovum has already been released',
          ],
          correct_index: 2,
          explanation: "The antrum is the defining feature of the tertiary follicle, and NCERT specifically says it is at this stage that the primary oocyte grows and completes its first meiotic division. The secondary follicle has extra granulosa layers and a theca but no antrum yet, and the second meiotic division does not finish until after a sperm enters — not in the follicle.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'The first meiotic division of the primary oocyte is unequal. What does it produce?',
          options: [
            'Two equal secondary oocytes, each able to be fertilised',
            'A large secondary oocyte that retains most of the cytoplasm, plus a tiny first polar body',
            'Four equal haploid ova',
            'One diploid ovum and one haploid polar body',
          ],
          correct_index: 1,
          explanation: "The unequal division gives one large haploid secondary oocyte, which keeps the bulk of the nutrient-rich cytoplasm, and one tiny haploid first polar body. Four equal products are the outcome in spermatogenesis, not oogenesis, and both oogenesis products are haploid — the ovum is never diploid.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'What is actually released from the ovary at ovulation, and what completes the egg?',
          options: [
            'A fully mature ovum that has finished both meiotic divisions inside the follicle',
            'A primary oocyte still arrested in prophase-I',
            'A secondary oocyte; meiosis-II is completed only after a sperm enters',
            'An oogonium that then begins meiosis in the fallopian tube',
          ],
          correct_index: 2,
          explanation: "The Graafian follicle ruptures to release the secondary oocyte, which has completed meiosis-I but not meiosis-II. Sperm entry is what triggers completion of the second meiotic division, forming the second polar body and the haploid ovum. It is not a finished ovum, not a primary oocyte, and certainly not an oogonium at this point.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
