'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'endocrine-glands-and-hypothalamus',
  title: 'Endocrine Glands, Hormones & the Hypothalamus',
  subtitle: "Your nerves are fast but they can't reach every cell, and their message fades in seconds. A second messenger system — hormones from ductless glands — fills that gap, and the whole thing takes its orders from one small patch of the brain: the hypothalamus.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['chemical-coordination-and-integration', 'hypothalamus'],
  glossary: [
    { term: 'hormone', definition: 'A non-nutrient chemical that acts as an intercellular messenger and is produced in trace amounts. It is the secretion of an endocrine gland.' },
    { term: 'endocrine gland', definition: 'A gland that lacks ducts and releases its secretion (a hormone) directly into the blood. Because it has no duct, it is also called a ductless gland.' },
    { term: 'ductless gland', definition: 'Another name for an endocrine gland — "ductless" because it has no tube (duct) to carry its secretion; the hormone goes straight into the blood instead.' },
    { term: 'endocrine system', definition: 'All the endocrine glands plus the hormone-producing diffused tissues and cells located in different parts of the body, taken together.' },
    { term: 'hypothalamus', definition: 'The basal part of the diencephalon of the forebrain. It regulates a wide spectrum of body functions and controls the pituitary gland through the hormones it makes.' },
    { term: 'nuclei', definition: 'Groups of neurosecretory cells in the hypothalamus that produce hormones. (Here "nuclei" means clusters of nerve cells, not the nucleus inside a cell.)' },
    { term: 'releasing hormone', definition: 'A hypothalamic hormone that stimulates the secretion of a pituitary hormone. Example: GnRH.' },
    { term: 'inhibiting hormone', definition: 'A hypothalamic hormone that inhibits the secretion of a pituitary hormone. Example: somatostatin.' },
    { term: 'portal circulatory system', definition: 'The special set of blood vessels through which hypothalamic hormones reach the anterior pituitary to control it.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A silhouetted human figure against darkness, with a soft warm glow marking the brain and faint glowing points scattered through the torso, suggesting glands quietly signalling across the body',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single human figure shown in profile silhouette against a deep dark background, faintly translucent so the inside of the body is softly suggested. A warm amber glow sits at the base of the brain, and several small soft points of light are scattered down through the neck, chest and lower torso, connected by the faintest suggestion of streaming lines, as if a quiet chemical message is spreading slowly through the whole body from the brain. Painterly, atmospheric, biological illustration style, deep shadow throughout (#0a0a0a base tones), no text, no labels, no diagram callouts, no anatomical annotation.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Your Body Runs Two Messaging Systems At Once',
      markdown: "Touch something hot and your hand jerks back before you've even finished the thought — that's your **neural system**, and it's blindingly fast. But it has two limits: the message is **short-lived** (it fades the instant the nerve stops firing), and nerve fibres **don't reach every single cell** of your body. Yet your cells need to be regulated all the time, non-stop. So the body runs a second, slower messaging service alongside the nerves — one that broadcasts chemical messages through the blood to reach cells the nerves can't. Those chemicals are **hormones**.",
    },
    // ── 2 · Core concept — why hormones, ductless glands, definition ────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Neural coordination is **fast but short-lived**, and the nerve fibres **do not reach every cell** of the body. Since the cells still need to be **continuously regulated**, a second kind of coordination is needed — and this job is done by **hormones**. The **neural system and the endocrine system work together** to coordinate and regulate all the physiological functions in your body.\n\nThe glands that make hormones have one defining feature: **they lack ducts**. A duct is a little tube that carries a secretion to where it's needed — your salivary gland, for example, has a duct that drips saliva into your mouth. Endocrine glands have no such tube, so they are called **ductless glands**. Instead of pouring their secretion down a tube, they release it **straight into the blood**. Those secretions are the **hormones**.",
    },
    // ── 3 · Text — the modern definition of a hormone ──────────────────────────
    {
      id: uuid(), type: 'text', order: 3,
      markdown: "The old, classical way of defining a hormone was: a chemical made by an endocrine gland, released into the blood, and carried to a **distant target organ**. That's still true, but biologists have widened it. The **current scientific definition** is the one NEET wants you to know word-for-word:\n\n> **Hormones are non-nutrient chemicals which act as intercellular messengers and are produced in trace amounts.**\n\nUnpack that phrase by phrase. **Non-nutrient** — a hormone is not food; it carries a message, it isn't burnt for energy. **Intercellular messenger** — it carries a signal *between* cells. **Produced in trace amounts** — the body makes only the tiniest quantity, and that tiny quantity is enough. This wider definition matters because it now covers many new signalling molecules, not just the secretions of the big organised glands.",
    },
    // ── 4 · Heading — the human endocrine system ─────────────────────────────
    {
      id: uuid(), type: 'heading', order: 4, level: 2,
      text: 'The Human Endocrine System — Where the Glands Sit',
      objective: "By the end of this you can name all eight organised endocrine glands in the body and point to where each one sits, and know that some ordinary organs make hormones too.",
    },
    // ── 5 · Text — the eight organised glands + other organs ─────────────────
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "The **endocrine system** is made of the endocrine glands **plus** hormone-producing diffused tissues and cells scattered in different parts of the body. The clearly organised endocrine glands — the ones with a definite structure you can point to — are **eight**:\n\n**pituitary, pineal, thyroid, adrenal, pancreas, parathyroid, thymus, and gonads** (the **testis** in males and the **ovary** in females).\n\nA quick way to remember all eight: ***\"Please Print Two Assorted Passes Per Tall Gate\"*** — **P**ituitary, **P**ineal, **T**hyroid, **A**drenal, **P**ancreas, **P**arathyroid, **T**hymus, **G**onads.\n\nOn top of these organised glands, some **other organs** — the **gastrointestinal tract, liver, kidney, and heart** — also produce hormones, even though making hormones isn't their main job. Keep those separate in your head: the eight are the *organised* endocrine glands; these four are ordinary organs that happen to secrete hormones too.",
    },
    // ── 6 · Interactive image — location of endocrine glands (Fig 19.1) ─────────
    {
      id: uuid(), type: 'interactive_image', order: 6, src: '',
      alt: 'Front-view diagram of a human body outline showing the location of each organised endocrine gland, from the hypothalamus and pituitary in the head down to the gonads',
      caption: '📸 Tap each dot to explore where every organised endocrine gland sits in the body (Figure 19.1).',
      generation_prompt: "Scientific textbook illustration of the location of the human endocrine glands. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A single front-facing human body shown as a clean white outline, semi-transparent, standing upright. Inside it, show the organised endocrine glands each as a small, biologically accurate, correctly-positioned soft-pink/magenta organ shape: the hypothalamus and pituitary at the base of the brain in the head, the pineal gland deep in the brain, the thyroid and parathyroid at the front of the neck, the thymus in the upper chest behind the breastbone, the adrenal glands as small caps on top of each kidney, the pancreas across the upper abdomen, and the gonads at the lower body (ovaries in the female lower abdomen / testes shown for the male). Clean white outlines, thin white leader lines ready for labels, biologically accurate proportions and positions. No photorealism, no cartoon, no mascots, no glow, no neon.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.09, label: 'Hypothalamus & Pituitary', detail: 'Both sit at the **base of the brain**. The hypothalamus is the basal part of the forebrain; the pituitary hangs just below it and takes its orders from it.', icon: 'circle' },
        { id: uuid(), x: 0.56, y: 0.12, label: 'Pineal', detail: 'A small gland located **deep in the brain**. It is one of the eight organised endocrine glands.', icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.2, label: 'Thyroid & Parathyroid', detail: 'Both lie in the **front of the neck**. The parathyroid glands are embedded on the back of the thyroid.', icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.32, label: 'Thymus', detail: 'Sits in the **upper chest**, behind the breastbone. An organised endocrine gland.', icon: 'circle' },
        { id: uuid(), x: 0.44, y: 0.46, label: 'Adrenal', detail: 'A pair of glands, one sitting like a **cap on top of each kidney** in the upper abdomen.', icon: 'circle' },
        { id: uuid(), x: 0.54, y: 0.5, label: 'Pancreas', detail: 'Lies across the **upper abdomen**. It is both an endocrine gland (hormones) and works with the digestive system.', icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.62, label: 'Gonads', detail: 'The **testis in males** and the **ovary in females** — the reproductive endocrine glands, located in the lower body.', icon: 'circle' },
      ],
    },
    // ── 7 · Comparison card — neural vs hormonal coordination ────────────────
    {
      id: uuid(), type: 'comparison_card', order: 7,
      title: 'Neural vs Hormonal (Endocrine) Coordination',
      columns: [
        { heading: 'Neural coordination', points: [
          'Carried by nerve fibres',
          'Fast — the message travels almost instantly',
          'Point-to-point — reaches only the cells the nerve fibres actually connect to',
          'Short-lived — the effect fades the moment the nerve stops firing',
        ] },
        { heading: 'Hormonal (endocrine) coordination', points: [
          'Carried by hormones through the blood',
          'Slower — the chemical has to travel in the bloodstream',
          'Broadcast — the blood can reach cells the nerves cannot',
          'Longer-lasting — keeps regulating the cells continuously',
        ] },
      ],
    },
    // ── 8 · Heading — hypothalamus commands the pituitary ────────────────────
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'The Hypothalamus Commands the Pituitary',
      objective: "By the end of this you can explain where the hypothalamus sits, what its two kinds of hormones do, name one example of each, and describe how it controls the anterior versus the posterior pituitary.",
    },
    // ── 9 · Text — what the hypothalamus is + releasing/inhibiting ───────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "The **hypothalamus** is the **basal part of the diencephalon** of the **forebrain** — a small region at the very base of the brain — and it regulates a **wide spectrum of body functions**. Tucked inside it are several groups of **neurosecretory cells** called **nuclei**. (Careful: here \"nuclei\" means *clusters of nerve cells*, not the nucleus that sits inside a single cell.) These nuclei **produce hormones**, and those hormones control the **synthesis and secretion of pituitary hormones**. In other words, the hypothalamus is the boss, and the pituitary largely does what the hypothalamus tells it.\n\nThe hormones the hypothalamus makes come in **two types**:\n\n- **Releasing hormones** — they **stimulate** the pituitary to secrete its hormones.\n- **Inhibiting hormones** — they **inhibit** (hold back) the pituitary's secretions.",
    },
    // ── 10 · Comparison card — releasing vs inhibiting hormones ──────────────
    {
      id: uuid(), type: 'comparison_card', order: 10,
      title: 'Releasing vs Inhibiting Hormones of the Hypothalamus',
      columns: [
        { heading: 'Releasing hormone', points: [
          'Stimulates the secretion of a pituitary hormone',
          'Turns the pituitary ON',
          'Example: GnRH (Gonadotrophin Releasing Hormone)',
          'GnRH → stimulates the pituitary to release gonadotrophins',
        ] },
        { heading: 'Inhibiting hormone', points: [
          'Inhibits the secretion of a pituitary hormone',
          'Turns the pituitary OFF (holds it back)',
          'Example: Somatostatin',
          'Somatostatin → inhibits release of growth hormone from the pituitary',
        ] },
      ],
    },
    // ── 11 · Text — examples + portal system + anterior vs posterior ─────────
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "Take the two examples NEET loves. **GnRH — Gonadotrophin Releasing Hormone** — is a *releasing* hormone: it stimulates the pituitary to synthesise and release **gonadotrophins**. **Somatostatin** is an *inhibiting* hormone: it **inhibits the release of growth hormone** from the pituitary. Read those two lines twice — swapping them is the classic trap.\n\nNow, how do these hormones actually reach the pituitary? They **originate in the hypothalamic neurons**, travel **down the axons**, and are **released from the nerve endings**. From there they reach the pituitary through a **portal circulatory system** — a special little set of blood vessels — and this is how they **regulate the anterior pituitary**.\n\nBut the **posterior pituitary** is handled differently: it is under the **direct neural control** of the hypothalamus. So keep this split clean: the hypothalamus reaches the **anterior** pituitary through a **portal (blood) system**, but controls the **posterior** pituitary through **direct nerve connections**.",
    },
    // ── 12 · Reasoning prompt — releasing hormone / definition check ─────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 12, reasoning_type: 'logical',
      prompt: "A hypothalamic hormone called GnRH is released. What will it do to the pituitary — and why does that make it a 'releasing' hormone?",
      options: [
        "It stimulates the pituitary to synthesise and release gonadotrophins, which is why it is called a releasing hormone.",
        "It inhibits the pituitary from releasing growth hormone, which is why it is called a releasing hormone.",
        "It travels through direct nerve connections to control the posterior pituitary, releasing its stored hormones.",
        "It is burnt by the pituitary cells for energy, releasing the fuel they need to make their own hormones.",
      ],
      reveal: "The first option is right. A **releasing hormone** stimulates the secretion of a pituitary hormone, and GnRH (Gonadotrophin Releasing Hormone) specifically stimulates the pituitary to release **gonadotrophins** — that stimulating action is exactly what 'releasing' means. The second option describes an *inhibiting* hormone (that's somatostatin's job with growth hormone), not a releasing one. The third option mixes up the routes — the hypothalamus reaches the anterior pituitary via a portal blood system, and it's the *posterior* pituitary that's under direct neural control, not something GnRH does. The fourth is wrong because hormones are **non-nutrient** chemicals — they are messengers, never burnt for energy.",
      difficulty_level: 2,
    },
    // ── 13 · Remember callout ───────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Endocrine glands = ductless glands** — no ducts; they release hormones straight into the **blood**.\n- **Hormone (modern definition):** a **non-nutrient chemical**, acting as an **intercellular messenger**, **produced in trace amounts.**\n- **The 8 organised endocrine glands:** pituitary, pineal, thyroid, adrenal, pancreas, parathyroid, thymus, gonads (testis/ovary). *(GI tract, liver, kidney, heart make hormones too, but are NOT counted among the organised glands.)*\n- **Hypothalamus** = basal part of the **diencephalon (forebrain)**; its **nuclei** (neurosecretory cell groups) make two kinds of hormones: **releasing** (stimulate the pituitary) and **inhibiting** (inhibit it).\n- **GnRH** → **stimulates** pituitary to release **gonadotrophins**. **Somatostatin** → **inhibits** release of **growth hormone**.\n- Hypothalamus controls the **anterior pituitary via a portal circulatory system**, and the **posterior pituitary via direct neural control**.",
    },
    // ── 14 · Exam tip ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Learn the hormone definition verbatim — NEET lifts it word-for-word:** hormones are *non-nutrient chemicals which act as intercellular messengers and are produced in trace amounts.*\n\n**The releasing-vs-inhibiting pair is a favourite:** GnRH **stimulates** (releasing), somatostatin **inhibits growth hormone** (inhibiting). Reversing these two, or attaching somatostatin to gonadotrophins, is the standard trap.\n\n**Anterior vs posterior routing gets tested:** anterior pituitary → **portal circulatory system**; posterior pituitary → **direct neural control**.\n\n**Classic NEET question:** \"Somatostatin inhibits the release of ___ from the pituitary.\" → **growth hormone.** And: \"Endocrine glands are also called ___ glands.\" → **ductless.**",
    },
    // ── 15 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 15,
      markdown: "So the hypothalamus gives the orders — but the gland that actually carries most of them out is the **pituitary**, sitting just below it. On the next page you'll open up that pituitary gland itself: its parts, and the hormones each part sends out across the body.",
    },
    // ── 16 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 16, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Why are endocrine glands also called ductless glands, and where do their secretions go?",
          options: [
            "They have no ducts, so they release their hormones directly into the blood",
            "They have many ducts, so they pour their hormones straight onto the target organ's surface",
            "They have no ducts, so their hormones stay stored inside the gland until nerves release them",
            "They have a single duct, so they drip their hormones into the gut like digestive glands",
          ],
          correct_index: 0,
          explanation: "Endocrine glands lack ducts, which is exactly why they're called ductless — and because there is no tube to carry the secretion, the hormone is released straight into the blood. The other options invent ducts the glands don't have, or a nerve-triggered/gut route that isn't how endocrine secretion works.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "According to the current scientific definition, hormones are best described as:",
          options: [
            "Nutrient chemicals produced in large amounts that are burnt by target cells for energy",
            "Non-nutrient chemicals that act as intercellular messengers and are produced in trace amounts",
            "Nerve signals that travel point-to-point and fade the moment the nerve stops firing",
            "Proteins made only by the gonads that act on a single distant target organ",
          ],
          correct_index: 1,
          explanation: "The modern definition is exact: hormones are non-nutrient chemicals, they act as intercellular messengers, and they are produced in trace amounts. Option 1 gets all three features backwards. Option 3 describes neural coordination, not a hormone. Option 4 is far too narrow — hormones come from many glands, not just the gonads.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which of the following is NOT one of the organised endocrine glands of the body?",
          options: [
            "Pineal",
            "Thymus",
            "Liver",
            "Parathyroid",
          ],
          correct_index: 2,
          explanation: "The liver does produce hormones, but it is counted among the 'other organs' (along with the GI tract, kidney, and heart) — not among the eight organised endocrine glands. Pineal, thymus, and parathyroid are all on the list of organised endocrine glands (pituitary, pineal, thyroid, adrenal, pancreas, parathyroid, thymus, gonads).",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "How does the hypothalamus control the anterior versus the posterior pituitary?",
          options: [
            "It controls both the anterior and posterior pituitary through the same portal circulatory system",
            "It controls both the anterior and posterior pituitary by direct neural connections only",
            "It reaches the anterior pituitary through a portal circulatory system, while the posterior pituitary is under its direct neural control",
            "It reaches the anterior pituitary by direct neural control, while the posterior pituitary is fed through a portal circulatory system",
          ],
          correct_index: 2,
          explanation: "Hypothalamic hormones travel down axons, are released at the nerve endings, and reach the anterior pituitary through a portal circulatory system to regulate it — but the posterior pituitary is under the direct neural regulation of the hypothalamus. Option 4 swaps the two routes, which is the classic trap; options 1 and 2 wrongly use a single route for both lobes.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
