'use strict';
/**
 * Class 12 Biology — Chapter 2: Human Reproduction
 * Page 8 — Pregnancy and Embryonic Development.
 *
 * Source of truth: NCERT Class 12 Ch.2 §2.6 (lebo102.txt, lines 495–553) plus
 * the implantation lines just above it (486–493). Rule 0: every fact, name,
 * hormone, germ layer and month-milestone here traces to that text — nothing
 * invented, nothing added from coaching books. NCERT Fig 2.12 (the human
 * foetus within the uterus) is the diagram this page rebuilds interactively.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'pregnancy-and-embryonic-development',
  title: 'Pregnancy & Embryonic Development',
  subtitle: "How the placenta forms from villi and uterine tissue, why it is both a feeding organ and a hormone gland, and how one ball of cells turns into a fully-formed foetus over nine months.",
  page_number: 8,
  page_type: 'lesson',
  tags: ['human-reproduction', 'pregnancy', 'placenta', 'embryonic-development'],
  glossary: [
    { term: 'placenta', definition: 'The structural and functional unit that joins the developing foetus to the mother. It is built jointly by the chorionic villi and the uterine tissue, and it both feeds the foetus and acts as a hormone-producing gland.' },
    { term: 'chorionic villi', definition: 'Finger-like projections that grow out of the trophoblast after implantation. They push into the uterine tissue and, interlocked with it, form the placenta.' },
    { term: 'umbilical cord', definition: 'The cord that connects the placenta to the embryo. It carries substances to and from the foetus.' },
    { term: 'hCG', definition: 'Human chorionic gonadotropin — one of the hormones the placenta secretes. It is produced in women only during pregnancy.' },
    { term: 'inner cell mass', definition: 'The group of cells in the blastocyst that becomes the embryo. It contains stem cells able to give rise to every tissue and organ.' },
    { term: 'germ layers', definition: 'The three primary layers — ectoderm, mesoderm and endoderm — that the inner cell mass forms. Together they give rise to all the tissues and organs of the adult body.' },
    { term: 'gestation', definition: 'The period a pregnancy lasts. In humans the gestation period is about nine months.' },
  ],
  blocks: [
    {
      id: '100dbf39-aa01-4909-a4ff-ed8515d75fe9',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A warm, softly glowing protective space, suggesting a life sheltered and growing in the dark',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A tender, atmospheric painterly scene suggesting a life sheltered and growing safely in the dark — a soft warm glow of amber and rose light held at the centre of the frame, cradled by deep protective shadow that wraps around it and fades to near-black at the edges. The mood is warmth, safety and quiet growth over time. No anatomy, no diagrams, no people, no labels — purely an abstract atmospheric feeling of nurtured new life. Deep dark naturalistic base tone overall (#0a0a0a), painterly and cinematic, no text.",
    },
    {
      id: 'cd64b079-1cc9-42a8-9132-7a0d13ee3b98',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'The Only Gland Your Body Grows On Demand',
      markdown: "Most of your hormone glands — thyroid, adrenals, pituitary — are with you for life. The **placenta** is different. Your body builds a brand-new gland from scratch for each pregnancy, runs it for nine months, and then delivers it out of the body along with the baby. And it does two full-time jobs at once: it is the pipe that feeds oxygen and food to the foetus, **and** it is an endocrine gland pumping out hormones like **hCG**. One temporary organ, grown just for this — feeding line and hormone factory in the same structure.",
    },
    {
      id: '4ae543f6-3546-4f5f-acd4-694d68fbbd7c',
      type: 'text',
      order: 2,
      markdown: "Pick up the story right after **implantation** — the point where the blastocyst has burrowed into the endometrium and pregnancy has begun. Now the outer layer of the blastocyst, the **trophoblast**, does something new. Finger-like projections grow out of it called **chorionic villi**. These villi are surrounded by the uterine tissue and by the mother's blood.\n\nThe villi and the uterine tissue then **interdigitate** — they interlock like the fingers of two hands folding together. Locked in this way, the chorionic villi and the uterine tissue jointly form one structure: the **placenta**. Hold on to that idea — the placenta is not built by the foetus alone or by the mother alone. It is a joint unit, half from the developing embryo (the villi) and half from the mother (the uterine tissue), and it is the structural and functional link between the two.",
    },
    {
      id: '1d5b2325-6ee7-466a-939c-f9eb838cd847',
      type: 'heading',
      order: 3,
      text: 'The Placenta: One Organ, Two Jobs',
      level: 2,
      objective: 'Why the placenta is described as both an exchange organ and an endocrine gland — and what the umbilical cord adds.',
    },
    {
      id: 'de0846c9-eb88-4d9a-861d-e14e9152966d',
      type: 'text',
      order: 4,
      markdown: "**Job one — exchange.** The placenta is where the foetus's needs are met without its blood ever mixing directly with the mother's. It supplies **oxygen** and **nutrients** to the growing embryo, and it carries away the **carbon dioxide** and the **excretory / waste materials** the embryo produces. The placenta is connected to the embryo by the **umbilical cord**, and it is through this cord that substances are transported to and from the foetus.\n\n**Job two — hormones.** The placenta also acts as an **endocrine tissue**. It produces several hormones: **human chorionic gonadotropin (hCG)**, **human placental lactogen (hPL)**, **estrogens** and **progestogens**. One more hormone, **relaxin**, is also secreted in the later phase of pregnancy — but note carefully, relaxin comes from the **ovary**, not the placenta. NCERT wants you to remember that hCG, hPL and relaxin are produced in a woman **only during pregnancy**. On top of these, the levels of other hormones — estrogens, progestogens, cortisol, prolactin, thyroxine — rise several-fold in the mother's blood. All of this extra hormone output is essential for **supporting the growth of the foetus**, for the **metabolic changes** it forces on the mother, and for the **maintenance of the pregnancy** itself.",
    },
    {
      id: '5785e357-b00b-4a06-8e62-9cef2b088c5f',
      type: 'interactive_image',
      order: 5,
      src: '',
      alt: 'A human foetus curled inside the uterus, connected by the umbilical cord to a disc-shaped placenta on the uterine wall, surrounded by amniotic fluid',
      caption: '📸 Tap each dot to explore the foetus, the placenta and the link between mother and child (NCERT Fig 2.12)',
      generation_prompt: "Scientific textbook illustration of a human foetus within the uterus (based on NCERT Class 12 Fig 2.12). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions. A single foetus is drawn curled in the classic head-down foetal position at the centre-right of the frame, its soft body tissue rendered in pink/magenta. Around the foetus is a fluid-filled sac shown as a translucent blue region (amniotic fluid) enclosed by a thin membrane. A thick, twisted rope-like umbilical cord (pink/magenta with faint internal red vessels) runs from the foetus's belly across to a thick disc-shaped placenta pressed against the upper-left uterine wall. The placenta is drawn as a dense red-pink disc; at its base, small finger-like projections (chorionic villi) reach into and interlock with the darker muscular uterine wall. The uterine wall (endometrium and muscle) forms the thick outer boundary of the whole structure, rendered brownish-pink. No text or labels baked into the image, no photorealism, no cartoon, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: 'f6edc6b6-61ca-4bdf-aab8-94095e535704', x: 0.28, y: 0.22, label: 'Placenta', detail: 'The disc-shaped joint unit built from the chorionic villi and the uterine tissue together. It feeds the foetus, removes its waste, **and** secretes hormones — the structural and functional link between foetus and mother.', icon: 'circle' },
        { id: '53f822e7-98a0-4017-a7ef-ee14cfc8ebb9', x: 0.33, y: 0.34, label: 'Chorionic villi', detail: 'Finger-like projections that grew out of the trophoblast and pushed into the uterine tissue. Interlocked (interdigitated) with that tissue, they build the placenta.', icon: 'circle' },
        { id: 'b28c28bb-cbe2-4054-92f1-aada9a6a54d9', x: 0.47, y: 0.46, label: 'Umbilical cord', detail: 'The cord connecting the placenta to the embryo. All substances passing to and from the foetus — oxygen, nutrients, carbon dioxide, wastes — travel through it.', icon: 'circle' },
        { id: '941a198c-1671-4b33-9188-a9169ac2741c', x: 0.62, y: 0.6, label: 'Foetus', detail: 'The developing baby. From one month (heart) to nine months (fully developed and ready for delivery), it grows here, fed and supported entirely through the placenta and cord.', icon: 'circle' },
        { id: '40a6e3b1-36b4-4363-b358-8be72730b690', x: 0.72, y: 0.38, label: 'Amniotic fluid & sac', detail: 'The fluid-filled sac that cushions the foetus. It acts as a shock absorber, letting the foetus move and grow while protected inside the uterus.', icon: 'circle' },
        { id: '39899fe1-c1fc-4383-9bbb-220976963b85', x: 0.14, y: 0.62, label: 'Endometrium (uterine wall)', detail: 'The lining of the uterus that the blastocyst embedded into at implantation. Its tissue supplies the maternal half of the placenta and holds the whole pregnancy.', icon: 'circle' },
      ],
    },
    {
      id: 'a30a4ebb-7e58-48d1-93fa-51df0236ff2d',
      type: 'reasoning_prompt',
      order: 6,
      reasoning_type: 'logical',
      prompt: "In early pregnancy the placenta pours hCG, hPL, estrogens and progestogens into the mother's blood — on top of its job of feeding the foetus. Why does the body need all this extra hormone output?",
      options: [
        'To support the foetus’s growth, drive the metabolic changes in the mother, and maintain the pregnancy',
        'To trigger the strong uterine contractions that push the baby out at birth',
        'To stop the embryo from dividing any further until it is born',
        'To dissolve the umbilical cord once the foetus can feed on its own',
      ],
      reveal: "The right answer is the first one. NCERT states plainly that the increased production of these hormones is essential for supporting fetal growth, for the metabolic changes in the mother, and for the maintenance of pregnancy. The tempting wrong choice is the second — but the strong contractions that expel the baby are driven by **oxytocin at parturition** (a different event, in the next section), not by these placental pregnancy-maintaining hormones. Growing and holding the pregnancy is their job; ending it is not.",
      difficulty_level: 2,
    },
    {
      id: '187d3134-46a4-4432-9a53-58d1772a2db6',
      type: 'heading',
      order: 7,
      text: 'Three Layers That Become Everything',
      level: 2,
      objective: 'How the inner cell mass sorts itself into three germ layers, and why stem cells matter.',
    },
    {
      id: '3a11d025-03ed-4ae8-82ec-80624197b96f',
      type: 'text',
      order: 8,
      markdown: "Immediately after implantation, the **inner cell mass** (the embryo) starts sorting itself into layers. First it differentiates into an **outer layer called ectoderm** and an **inner layer called endoderm**. Then a third layer, the **mesoderm**, appears **in between** the ectoderm and the endoderm. These three layers are the **germ layers**, and from them come **all the tissues and organs** of the adult body.\n\nHere is the quiet powerhouse in all this: the inner cell mass contains certain cells called **stem cells**, which have the potency to give rise to every tissue and organ in the body. Three simple layers, a stock of stem cells — and that is enough raw material to build an entire human being.",
    },
    {
      id: '5db2451e-3e67-4950-973b-ccb91635f7c6',
      type: 'heading',
      order: 9,
      text: 'Month by Month: How the Foetus Takes Shape',
      level: 2,
      objective: 'The NCERT timeline of what forms when, across the nine months of pregnancy.',
    },
    {
      id: '657fc257-26bb-4eb3-9fcb-5fd513a8f63d',
      type: 'text',
      order: 10,
      markdown: "Human pregnancy lasts **nine months**, and NCERT marks out the milestones along the way. After **one month**, the embryo's **heart** is formed — the first sign of the growing foetus can be picked up by carefully listening to the heart sound through a stethoscope. By the end of the **second month**, the foetus develops **limbs and digits**. By the end of **12 weeks (the first trimester)**, most of the major organ systems are formed — the limbs and the external genital organs are well-developed by then.\n\nThe **first movements** of the foetus and the **appearance of hair on the head** are usually seen during the **fifth month**. By the end of about **24 weeks (end of the second trimester)**, the body is covered with fine hair, the eye-lids separate, and eyelashes form. By the end of **nine months**, the foetus is fully developed and ready for delivery. That readiness for delivery is exactly where the story goes next — **parturition**, the birth itself.",
    },
    {
      id: '184f77be-88ed-4791-b332-37cb8dd87fea',
      type: 'callout',
      order: 11,
      variant: 'remember',
      title: 'Lock These In',
      markdown: "- **The three germ layers, in the order they appear:** ectoderm (outer) and endoderm (inner) form first, then **mesoderm appears in between**. All three together give rise to every tissue and organ.\n- **hCG = human chorionic gonadotropin**, a hormone made by the **placenta**. Along with hPL and relaxin, it is produced in a woman **only during pregnancy**.\n- **Relaxin comes from the ovary**, in the later phase of pregnancy — not from the placenta. Don't let it slip into the placenta's hormone list.\n- **The placenta is a joint unit:** chorionic villi (from the embryo) + uterine tissue (from the mother), interdigitated.",
    },
    {
      id: 'addd08bd-79a1-435e-a751-da7fc8eeb09d',
      type: 'callout',
      order: 12,
      variant: 'exam_tip',
      title: 'What NEET Lifts From This Section',
      markdown: "**Placenta = structure + hormones:** NEET repeatedly tests that the placenta is formed by chorionic villi + uterine tissue, and that it doubles as an endocrine gland (hCG, hPL, estrogens, progestogens). Know both roles.\n**Relaxin trap:** questions love to slip relaxin into a list of placental hormones. Relaxin is secreted by the **ovary** in the later phase of pregnancy — this single-word swap is a classic distractor.\n**Germ-layer order:** ectoderm and endoderm first, **mesoderm in between and last** — the “which layer appears last” question turns on this.\n**Month milestones are memorised verbatim:** heart → 1st month; limbs & digits → end of 2nd month; most organ systems → 12 weeks; first movements & hair on head → 5th month.\n**Classic NEET question:** \"Which of the following is NOT secreted by the human placenta?\" → **Relaxin** (it is secreted by the ovary).",
    },
    {
      id: '28554816-25f7-49e6-9e68-26d59041d334',
      type: 'inline_quiz',
      order: 13,
      pass_threshold: 0.67,
      questions: [
        {
          id: '408e35c8-5d4d-48e3-bf9e-6b38c79502a6',
          question: 'The placenta is formed jointly by the uterine tissue and which structure growing from the trophoblast?',
          options: ['Chorionic villi', 'The inner cell mass', 'The blastomeres', 'The amniotic sac'],
          correct_index: 0,
          explanation: 'After implantation, finger-like chorionic villi grow out of the trophoblast, interdigitate with the uterine tissue, and jointly form the placenta. The inner cell mass is a tempting pick, but that becomes the embryo itself — it does not build the placenta with the uterine wall.',
          difficulty_level: 1,
        },
        {
          id: '67b38d6a-0bf6-4da5-9d29-db1552e157b0',
          question: 'Which hormone is NOT secreted by the placenta?',
          options: ['Human chorionic gonadotropin (hCG)', 'Human placental lactogen (hPL)', 'Estrogens', 'Relaxin'],
          correct_index: 3,
          explanation: 'The placenta secretes hCG, hPL, estrogens and progestogens. Relaxin is the odd one out — it is secreted by the ovary in the later phase of pregnancy, not by the placenta. hPL is a strong distractor because its name sounds placental and it is placental, so it stays on the list.',
          difficulty_level: 2,
        },
        {
          id: 'b998cf92-4413-4a80-ab0a-e90ba167740f',
          question: 'As the inner cell mass differentiates, which germ layer appears last, sandwiched between the other two?',
          options: ['Ectoderm', 'Mesoderm', 'Endoderm', 'Trophoblast'],
          correct_index: 1,
          explanation: 'The inner cell mass first forms the outer ectoderm and inner endoderm; the mesoderm appears afterwards, in between them. Ectoderm and endoderm are the two that form first, so they are wrong here, and the trophoblast is not a germ layer at all — it is the outer blastocyst layer that gave rise to the villi.',
          difficulty_level: 2,
        },
        {
          id: '483487ce-5c30-43d3-af27-e596521f7180',
          question: "According to NCERT, by the end of which month of pregnancy does the foetus develop limbs and digits?",
          options: ['End of the first month', 'End of the fifth month', 'End of the second month', 'End of the ninth month'],
          correct_index: 2,
          explanation: 'By the end of the second month the foetus develops limbs and digits. The first month is when the heart is formed (the classic trap here); the fifth month is when the first movements and hair on the head appear; and by nine months the foetus is fully developed and ready for delivery.',
          difficulty_level: 2,
        },
      ],
    },
  ],
};
