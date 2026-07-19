'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-menstrual-cycle',
  title: 'The Menstrual Cycle',
  subtitle: "How one hormone spike on about day 14 releases the egg, and why the corpus luteum decides whether menstruation comes or not.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['menstrual-cycle', 'ovulation', 'human-reproduction'],
  glossary: [
    { term: 'menstrual cycle', definition: 'The roughly 28/29-day reproductive cycle of female primates, running from one menstruation to the next.' },
    { term: 'ovulation', definition: 'The release of the ovum from the mature Graafian follicle, happening about the 14th day of the cycle.' },
    { term: 'LH surge', definition: 'The rapid rise of luteinising hormone to its peak in the middle of the cycle; it ruptures the Graafian follicle and causes ovulation.' },
    { term: 'corpus luteum', definition: 'The structure that the leftover parts of the Graafian follicle turn into after ovulation; it secretes large amounts of progesterone.' },
    { term: 'menarche', definition: 'The first menstruation, which begins at puberty.' },
    { term: 'menopause', definition: 'The permanent stopping of menstrual cycles, around 50 years of age in humans.' },
    { term: 'endometrium', definition: 'The inner lining of the uterus that thickens to receive a fertilised ovum and breaks down as menstrual flow when there is no pregnancy.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A calm monthly rhythm suggested by a softly glowing 28-day arc curving across a dark, atmospheric field',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). An atmospheric, painterly depiction of a monthly biological rhythm: a single softly glowing arc sweeping gently from left to right across a deep, dark field, its brightness rising to a warm peak near the centre and easing down again toward the right edge, quietly suggesting a cycle that builds to a single high point and returns. Faint concentric ripples and a soft warm horizon glow give a sense of time turning over and over. No human figures, no anatomical diagram, no numbers, no text, no labels. Deep dusk tones, dark background overall (#0a0a0a base tones), painterly and calm.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'One Egg, One Month, One Spike',
      markdown: "Across a whole cycle of about **28 to 29 days**, the ovary releases just **one ovum** — and it lets it go on roughly a single day, near the middle. What flips the switch is one sharp burst of a hormone that lasts only a short while. Miss that burst and there is no ovulation that month. The entire monthly rhythm, from the bleeding you can see to the release you cannot, is run quietly by hormones rising and falling on a schedule.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The reproductive cycle in **female primates** — monkeys, apes and human beings — is called the **menstrual cycle**. The very first menstruation happens at puberty and has its own name: **menarche**. After that, in human females menstruation repeats at an average interval of about **28/29 days**, and the run of events from one menstruation to the next *is* one menstrual cycle.\n\nOne ovum is released — this release is **ovulation** — during the middle of each cycle. Hold on to one more fact before we walk through the phases: **menstruation only occurs if the released ovum is not fertilised.** A missed period can therefore hint at pregnancy — though stress or poor health can also cause it.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The First Half: Menstrual Phase, then Follicular Phase',
      objective: "By the end of this you can say what the body is building in the first half of the cycle, and which hormones are driving it upward.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The cycle **starts with the menstrual phase**, when the **menstrual flow** occurs. It lasts **3–5 days**. The flow is the **breakdown of the endometrial lining** of the uterus and its blood vessels — that broken-down tissue and blood forms the liquid that comes out through the vagina. So a cycle opens by clearing away the old lining.\n\nThe menstrual phase is followed by the **follicular phase**. Two things happen together here. In the ovary, the **primary follicles grow into a fully mature Graafian follicle**. In the uterus, the **endometrium regenerates** — it rebuilds itself through proliferation. Both changes are driven by hormones: the pituitary hormones **LH and FSH increase gradually** through this phase, and they stimulate follicle development *and* push the growing follicles to secrete **estrogens**. The first half, then, is a build-up phase — a follicle ripening and a fresh lining growing, all on rising hormones.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A menstrual-cycle chart showing the four phases across 28 days with FSH, LH, estrogen and progesterone curves, the follicle developing into a Graafian follicle then corpus luteum, and the endometrium thickening',
      caption: '📸 Tap each dot to walk through the phases, the hormone spikes, and what happens to the follicle and the uterine lining (Figure 2.9)',
      hotspots: [
        { id: uuid(), x: 0.08, y: 0.80, label: 'Menstrual phase (days 1–5)', icon: 'circle',
          detail: 'The cycle **starts here**. The **endometrium breaks down** and leaves the body as menstrual flow for **3–5 days**. This only happens because the previous ovum was **not fertilised**.' },
        { id: uuid(), x: 0.28, y: 0.55, label: 'Follicular phase', icon: 'circle',
          detail: 'The **primary follicle grows into a mature Graafian follicle** while the **endometrium regenerates**. **FSH and LH rise gradually** and drive the follicle to secrete **estrogen**.' },
        { id: uuid(), x: 0.50, y: 0.12, label: 'LH surge (about day 14)', icon: 'circle',
          detail: 'In the middle of the cycle **LH shoots up to a sharp peak** — the **LH surge**. This spike is the trigger for the very next event. FSH and estrogen also peak around now.' },
        { id: uuid(), x: 0.52, y: 0.62, label: 'Ovulation (ovulatory phase)', icon: 'circle',
          detail: 'The **LH surge ruptures the Graafian follicle** and the **ovum is released** — this is **ovulation**, about the **14th day**. No LH surge means no ovulation.' },
        { id: uuid(), x: 0.72, y: 0.45, label: 'Corpus luteum (luteal phase)', icon: 'circle',
          detail: 'The **leftover parts of the Graafian follicle transform into the corpus luteum**, which secretes **large amounts of progesterone**. Progesterone **maintains the thick endometrium**, ready for a fertilised ovum to implant.' },
        { id: uuid(), x: 0.92, y: 0.72, label: 'Endometrium (uterine lining)', icon: 'circle',
          detail: 'Watch the lining across the cycle: it is **shed** in the menstrual phase, **rebuilt** in the follicular phase, and **kept thick** by progesterone in the luteal phase. If no fertilisation, the corpus luteum degenerates, the lining disintegrates, and menstruation begins again.' },
      ],
      generation_prompt: "Scientific textbook illustration of the human menstrual cycle. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, labels in white text with thin white leader lines. Horizontal layout spanning about 28 days left to right, divided into four vertical bands labelled menstrual phase (days 1-5), follicular phase, ovulatory phase (mid-cycle), and luteal phase. Three stacked horizontal tracks aligned to the same day axis: (top) four hormone curves in distinct colours — FSH and LH both rising to sharp peaks in the middle with LH drawn as a tall narrow spike at about day 14 (the LH surge), estrogen rising to a peak just before mid-cycle, and progesterone (purple) rising as a broad hump in the second half; (middle) the ovarian cycle showing a small primary follicle enlarging step by step into a mature Graafian follicle, then a burst releasing the ovum at mid-cycle, then transforming into a rounded corpus luteum, drawn in pink/magenta soft-tissue tones; (bottom) the uterine endometrium shown as a lining that is thin and shedding at the start, thickening through the follicular phase, and thickest and richly vascularised (red blood vessels) in the luteal phase. Biologically accurate proportions, evenly spaced, no cartoon, no photorealism, no mascots, standard NCERT-style biology textbook conventions.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "In a normal cycle, the ovum is released around day 14. A researcher blocks the mid-cycle rise of one particular hormone and finds that ovulation never happens. Which hormone did she block, and why does that stop ovulation?",
      options: [
        "FSH, because FSH is what physically bursts the Graafian follicle open",
        "Progesterone, because progesterone is what pushes the ovum out of the ovary",
        "LH, because the mid-cycle LH surge is what ruptures the Graafian follicle and releases the ovum",
        "Estrogen, because estrogen directly tears the follicle wall at day 14",
      ],
      correct_index: 2,
      reveal: "NCERT is explicit: the rapid rise of LH to its maximum in mid-cycle — the LH surge — induces rupture of the Graafian follicle and the release of the ovum. Block that surge and the follicle never bursts, so no ovulation. FSH is the tempting trap because it does rise alongside LH and helps the follicle mature, but it is the *LH* peak that actually triggers rupture. Progesterone comes from the corpus luteum *after* ovulation, so it cannot cause it; and estrogen prepares the build-up but does not itself rupture the follicle.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'The Second Half: Ovulation, then the Luteal Phase',
      objective: "By the end of this you can trace the LH surge to ovulation, and the corpus luteum to progesterone — and explain why menstruation returns.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Both LH and FSH reach a **peak in the middle of the cycle — about the 14th day**. The important one is LH. The **rapid secretion of LH to its maximum level in mid-cycle is called the LH surge**, and this surge **induces rupture of the Graafian follicle and thereby the release of the ovum** — that is **ovulation** (the ovulatory phase). Fix that chain in your head: *LH surge → follicle bursts → ovum released.*\n\nThe ovulatory phase is followed by the **luteal phase**. Now the **remaining parts of the Graafian follicle transform into the corpus luteum**. The corpus luteum secretes **large amounts of progesterone**, and progesterone is **essential for maintaining the endometrium** — the thick lining needed for a fertilised ovum to implant. So the second chain is: *corpus luteum → progesterone → endometrium maintained.*\n\nEverything now hinges on fertilisation. If the ovum **is** fertilised and pregnancy begins, all the cycle events stop and there is no menstruation. If there is **no fertilisation**, the **corpus luteum degenerates**. With it gone, progesterone falls, the endometrium disintegrates, and that disintegration is menstruation — marking the start of a new cycle. Cyclic menstruation runs from **menarche** to **menopause** (around 50 years of age), the span of the normal reproductive phase. Next we follow what happens when a sperm actually does meet that ovum — fertilisation and implantation.",
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: 'The Two Chains You Cannot Get Wrong',
      markdown: "- **Ovulation is about day 14**, at the middle of the cycle.\n- **LH surge → rupture of Graafian follicle → ovulation.** The trigger is the **LH surge**, not FSH.\n- **Corpus luteum → progesterone → maintains the endometrium.** Progesterone comes *after* ovulation.\n- **No fertilisation → corpus luteum degenerates → endometrium breaks down → menstruation.**\n- Menstrual phase lasts **3–5 days**; cycle length is about **28/29 days**.\n- First period = **menarche** (puberty); cycles stop at **menopause** (~50 years).",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**LH surge:** the single most-asked line — the LH surge (peak mid-cycle, ~day 14) *ruptures the Graafian follicle* and causes ovulation. A favourite wrong option credits FSH with the rupture. FSH helps the follicle mature; **LH bursts it.**\n\n**Corpus luteum → progesterone:** know the source. Progesterone that maintains the endometrium comes from the **corpus luteum** in the **luteal phase** — not from the follicle.\n\n**Phase order:** menstrual → follicular → ovulatory → luteal. NEET may scramble these or park ovulation in the follicular phase.\n\n**Menarche vs menopause:** first menstruation = menarche; cessation ~50 yrs = menopause. These two terms get swapped in one-word options.\n\n**Classic NEET question:** \"The LH surge during the menstrual cycle is responsible for what?\" → **rupture of the Graafian follicle and release of the ovum (ovulation), around day 14.**",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'The rapid mid-cycle peak of LH, called the LH surge, is directly responsible for which event?',
          options: [
            'Regeneration of the endometrium during the follicular phase',
            'Rupture of the Graafian follicle and release of the ovum',
            'Formation of primary follicles from primordial follicles',
            'Breakdown of the endometrial lining as menstrual flow',
          ],
          correct_index: 1,
          explanation: "NCERT states the LH surge induces rupture of the Graafian follicle and thereby ovulation. Endometrial regeneration happens earlier in the follicular phase on rising FSH/LH and estrogen, not from the surge itself; and endometrial breakdown is the menstrual phase, which follows corpus luteum degeneration — the opposite end of the cycle.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Progesterone, which maintains the endometrium for a possible pregnancy, is secreted in large amounts by which structure?',
          options: ['The growing Graafian follicle', 'The anterior pituitary', 'The regenerating endometrium', 'The corpus luteum'],
          correct_index: 3,
          explanation: "After ovulation the leftover Graafian follicle transforms into the corpus luteum, which secretes large amounts of progesterone. The growing follicle secretes estrogen (not the bulk of progesterone), the pituitary secretes the gonadotropins LH and FSH, and the endometrium is the tissue being maintained, not the gland that makes the hormone.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'If the released ovum is NOT fertilised, what sequence leads back to menstruation?',
          options: [
            'Corpus luteum persists → progesterone rises → endometrium thickens further',
            'Graafian follicle re-forms → estrogen falls → endometrium is shed',
            'Corpus luteum degenerates → endometrium disintegrates → menstruation begins',
            'LH surge repeats → follicle ruptures again → menstruation begins',
          ],
          correct_index: 2,
          explanation: "With no fertilisation the corpus luteum degenerates; losing its progesterone, the endometrium disintegrates, and that disintegration is menstruation, starting a new cycle. The corpus luteum does not persist without pregnancy, the follicle does not re-form to shed the lining, and a repeat LH surge is not what brings on menstruation.",
          difficulty_level: 3,
        },
        {
          id: uuid(), question: 'Which pairing is correct?',
          options: [
            'Menarche = the first menstruation at puberty',
            'Menopause = the first menstruation at puberty',
            'Menarche = cessation of cycles around 50 years of age',
            'Ovulation = the breakdown of the endometrial lining',
          ],
          correct_index: 0,
          explanation: "Menarche is the first menstruation, which begins at puberty. Menopause is the opposite bookend — cycles ceasing around 50 years of age — so the first two options swap the two terms. Ovulation is the release of the ovum around day 14, not the shedding of the lining (that is the menstrual phase).",
          difficulty_level: 1,
        },
      ],
    },
  ],
};
