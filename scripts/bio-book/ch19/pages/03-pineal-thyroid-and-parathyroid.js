'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'pineal-thyroid-and-parathyroid',
  title: 'The Pineal, Thyroid & Parathyroid Glands',
  subtitle: "Three glands packed into your head and neck run three very different jobs — your day-night body clock, your whole-body engine speed, and the calcium tug-of-war in your blood. NEET loves the two calcium hormones that pull in opposite directions.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['chemical-coordination-and-integration', 'thyroid'],
  glossary: [
    { term: 'melatonin', definition: 'The hormone secreted by the pineal gland. It regulates the 24-hour (diurnal) rhythm of the body — the sleep-wake cycle and body temperature — and also influences metabolism, pigmentation, the menstrual cycle and defense capability.' },
    { term: 'isthmus', definition: 'A thin flap of connective tissue that interconnects the two lobes of the thyroid gland, which sit on either side of the trachea.' },
    { term: 'thyroid follicle', definition: 'The functional unit of the thyroid gland — a cavity enclosed by follicular cells. These follicular cells synthesise the two thyroid hormones, T4 and T3.' },
    { term: 'goitre', definition: 'Enlargement of the thyroid gland. Caused by iodine deficiency in the diet, which produces hypothyroidism along with the swelling.' },
    { term: 'cretinism', definition: 'Stunted growth in a baby caused by hypothyroidism during the mother\'s pregnancy. It comes with mental retardation, low IQ, abnormal skin and deaf-mutism.' },
    { term: 'thyrocalcitonin (TCT)', definition: 'A protein hormone also secreted by the thyroid gland. It regulates blood calcium levels by lowering them.' },
    { term: 'parathyroid hormone (PTH)', definition: 'A peptide hormone secreted by the four parathyroid glands. Its secretion is controlled by the level of calcium ions circulating in the blood, and it raises blood calcium.' },
    { term: 'hypercalcemic hormone', definition: 'A hormone that increases the blood Ca2+ level. PTH is the hypercalcemic hormone — it acts on bone, kidney and gut to push calcium up.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A softly glowing human head and neck in profile against darkness, with three faint points of warm light marking the deep brain, the throat, and just behind the throat',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A human head and upper neck shown in gentle profile silhouette against a deep dark background, rendered in a soft anatomical-illustration style. Three faint points of warm light glow from inside: one deep in the centre of the brain, one at the front of the throat, and one just behind the throat, suggesting three small hidden glands without drawing any literal labelled diagram. Deep shadows fill the rest of the frame, with subtle warm rim-lighting along the profile. Painterly, atmospheric, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'A Clock, an Engine, and a Calcium Referee',
      markdown: "Three of your hardest-working glands are all crammed into your head and neck, and no two of them do the same thing. One deep inside your brain keeps time — it knows when it is night and tells your body to wind down. One sitting across your windpipe sets the *speed* of your whole body, how fast every cell burns fuel. And a set of four tiny ones behind it act as referees for the calcium floating in your blood, keeping it from running too high or too low. Same neighbourhood, three completely different jobs.",
    },
    // ── 2 · Core concept — pineal & melatonin ─────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Start with the timekeeper. The **pineal gland** is located on the **dorsal (back) side of the forebrain**. It secretes a single hormone called **melatonin**.\n\nMelatonin's headline job is running the body's **24-hour rhythm**, also called the **diurnal rhythm** — the natural daily cycle your body follows whether you want it to or not. This is what keeps your **sleep-wake cycle** regular and helps hold your **body temperature** to its daily pattern. On top of that, melatonin also **influences metabolism, pigmentation** (skin/body colouration), the **menstrual cycle**, and even the body's **defense capability**. So it is a small gland, but the one hormone it makes has its fingers in a lot of daily housekeeping.",
    },
    // ── 3 · Heading — thyroid gland ───────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Thyroid Gland — The Body\'s Speed Dial',
      objective: "By the end of this you can describe where the thyroid sits, which two hormones its follicular cells make, why iodine is non-negotiable, and what goes wrong when levels run too low or too high.",
    },
    // ── 4 · Text — thyroid structure, T3/T4, iodine ───────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The **thyroid gland** is made of **two lobes** sitting on either side of the **trachea** (windpipe). The two lobes are joined across the front by a thin flap of connective tissue called the **isthmus**.\n\nZoom in and the thyroid is built from **follicles** plus supporting **stromal tissue**. Each **thyroid follicle** is a little cavity walled off by **follicular cells** — and these follicular cells are the factory. They synthesise **two hormones**: **tetraiodothyronine, better known as thyroxine (T4)**, and **triiodothyronine (T3)**. Notice the numbers — T4 carries four iodine atoms, T3 carries three. That is your clue to the next fact: **iodine is essential** for the thyroid to make these hormones at a normal rate. No iodine coming in, no T3 and T4 going out.",
    },
    // ── 5 · Interactive image — Figure 19.3 ───────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Diagram of the thyroid gland with its two lobes on either side of the trachea joined by the isthmus, and the four parathyroid glands on the dorsal side',
      caption: '📸 Tap each dot to explore the thyroid, the trachea it wraps around, and the four hidden parathyroid glands behind it (Figure 19.3).',
      generation_prompt: "Scientific textbook illustration of the human thyroid and parathyroid glands, front-and-back combined view. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions. Show the vertical trachea (windpipe) running down the centre in pale grey-blue, with the two butterfly-shaped thyroid lobes in soft pink/magenta clinging to either side of the trachea, joined across the front by a thin horizontal band (the isthmus). On the back (dorsal) side, show four small oval parathyroid glands in a slightly darker tan, arranged as two pairs, one pair on each thyroid lobe. Labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.30, y: 0.42, label: 'Left thyroid lobe', detail: "One of the two lobes of the thyroid gland, sitting on the left side of the trachea. Built from follicles and stromal tissue; the follicular cells here make thyroxine (T4) and triiodothyronine (T3).", icon: 'circle' },
        { id: uuid(), x: 0.70, y: 0.42, label: 'Right thyroid lobe', detail: "The matching lobe on the right side of the trachea. Together the two lobes give the thyroid its butterfly shape.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.50, label: 'Isthmus', detail: "The thin flap of connective tissue that interconnects the two lobes across the front of the trachea.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.20, label: 'Trachea', detail: "The windpipe. The thyroid gland's two lobes sit on either side of it — a landmark for locating the gland.", icon: 'circle' },
        { id: uuid(), x: 0.34, y: 0.34, label: 'Parathyroid glands (dorsal)', detail: "Four small parathyroid glands sit on the back side of the thyroid — one pair embedded in each thyroid lobe. They secrete parathyroid hormone (PTH), which raises blood calcium.", icon: 'circle' },
        { id: uuid(), x: 0.66, y: 0.60, label: 'Follicular cells', detail: "The cells lining each thyroid follicle. They synthesise T4 and T3 — and need dietary iodine to do it at a normal rate.", icon: 'circle' },
      ],
    },
    // ── 6 · Text — deficiency, disease, functions, TCT ────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Now the consequences. When iodine runs short in the diet, the thyroid can't make enough hormone — this is **hypothyroidism** — and the gland swells up, an enlargement commonly called **goitre**. If **hypothyroidism happens during pregnancy**, it damages the developing baby: **stunted growth (cretinism)**, mental retardation, low IQ, abnormal skin, and deaf-mutism. In an **adult woman**, hypothyroidism can make the **menstrual cycle irregular**.\n\nThe opposite problem is **hyperthyroidism** — usually from **cancer or nodules** of the thyroid — where hormone synthesis climbs to abnormally high levels and disturbs body physiology. One well-known form is **exophthalmic goitre**, also called **Graves' disease**: the thyroid enlarges, the **eyeballs protrude**, the **basal metabolic rate rises**, and the person **loses weight**.\n\nWhy does all this matter so much? Because thyroid hormones set the body's tempo. They regulate the **basal metabolic rate (BMR)** — the baseline speed at which your body burns energy at rest. They **support red blood cell (RBC) formation**, **control the metabolism of carbohydrates, proteins and fats**, and help maintain **water and electrolyte balance**. One more thing hides in this gland: the thyroid also secretes a **protein hormone called thyrocalcitonin (TCT)**, which **regulates blood calcium levels** — remember this hormone, it comes back in a moment as the counterweight to the parathyroid's hormone.",
    },
    // ── 7 · Heading — parathyroid gland ───────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'The Parathyroid Gland — The Calcium Raiser',
      objective: "By the end of this you can say how many parathyroid glands there are, where they sit, and exactly the three ways PTH pushes blood calcium up.",
    },
    // ── 8 · Text — PTH, hypercalcemic ─────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "In humans there are **four parathyroid glands**, tucked on the **back (dorsal) side of the thyroid gland** — one pair sitting in each of the two thyroid lobes. They secrete a peptide hormone called **parathyroid hormone (PTH)**. Just like the thyroid's TCT, PTH is switched on and off by the **level of calcium ions circulating in the blood** — the blood calcium itself is the signal.\n\nPTH does one clear thing: it **increases the Ca2+ level in the blood**. It manages this through three routes at once. First, it **acts on bones and stimulates bone resorption** — the dissolution or demineralisation of bone, which releases stored calcium into the blood. Second, it **stimulates reabsorption of Ca2+ by the renal tubules** in the kidney, so less calcium is lost in urine. Third, it **increases Ca2+ absorption from the digested food** in the gut. Bone, kidney, gut — all three pushing calcium up. That is why PTH is called a **hypercalcemic hormone**: it raises blood Ca2+. Working **together with TCT** (which lowers it), PTH keeps the body's calcium in balance.",
    },
    // ── 9 · Comparison card — PTH vs TCT ──────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'PTH vs TCT (thyrocalcitonin) — the two calcium hormones',
      columns: [
        {
          heading: 'Parathyroid hormone (PTH)',
          points: [
            'Made by the four parathyroid glands',
            'A peptide hormone',
            'RAISES blood Ca2+ — it is hypercalcemic',
            'Stimulates bone resorption (releases calcium from bone)',
            'Boosts Ca2+ reabsorption by renal tubules + absorption from food',
          ],
        },
        {
          heading: 'Thyrocalcitonin (TCT)',
          points: [
            'Made by the thyroid gland',
            'A protein hormone',
            'LOWERS blood Ca2+',
            'Acts as the counterweight to PTH',
            'Together with PTH, keeps calcium in balance',
          ],
        },
      ],
    },
    // ── 10 · Reasoning prompt — calcium direction check ───────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "A patient's blood calcium has dropped too low. Which gland-and-hormone should step in to correct it, and by doing what?",
      options: [
        "The parathyroid glands release PTH, which raises blood calcium by stimulating bone resorption and calcium reabsorption in the kidney.",
        "The thyroid releases thyrocalcitonin (TCT), which raises blood calcium by dissolving bone.",
        "The parathyroid glands release thyrocalcitonin (TCT), which raises blood calcium by absorbing more from food.",
        "The thyroid releases thyroxine (T4), which raises blood calcium by increasing the basal metabolic rate.",
      ],
      reveal: "The first option is right. Low blood calcium is the exact situation PTH is built for — PTH is the hypercalcemic (calcium-raising) hormone, and it comes from the four parathyroid glands. It pulls calcium up three ways: bone resorption, more reabsorption by the renal tubules, and more absorption from food. The tempting wrong answer is the second — but TCT lowers blood calcium, it does not raise it, so releasing TCT here would make a low reading worse. The third mixes up the glands (TCT comes from the thyroid, not the parathyroids), and the fourth confuses T4, which sets the basal metabolic rate, with the calcium hormones — T4 has nothing to do with correcting blood calcium.",
      difficulty_level: 2,
    },
    // ── 11 · Table — three glands summary ─────────────────────────────────
    {
      id: uuid(), type: 'table', order: 11,
      caption: 'The three glands on this page, side by side',
      headers: ['Gland', 'Hormone(s)', 'Main function'],
      rows: [
        ['Pineal (dorsal side of forebrain)', 'Melatonin', 'Regulates the 24-hour (diurnal) rhythm — sleep-wake cycle, body temperature; also affects metabolism, pigmentation, menstrual cycle, defense'],
        ['Thyroid (two lobes across the trachea)', 'Thyroxine (T4) & triiodothyronine (T3); also thyrocalcitonin (TCT)', 'T4/T3 (need iodine) regulate BMR, RBC formation, metabolism of carbs/proteins/fats, water-electrolyte balance; TCT lowers blood Ca2+'],
        ['Parathyroid (four, dorsal side of thyroid)', 'Parathyroid hormone (PTH)', 'Raises blood Ca2+ (hypercalcemic) via bone resorption + renal reabsorption + gut absorption'],
      ],
    },
    // ── 12 · Remember callout ─────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Melatonin** (from the pineal gland) = the **24-hour / diurnal rhythm** — sleep-wake cycle and body temperature.\n- **T3 and T4** (from thyroid follicular cells) **need iodine**. Iodine deficiency → **hypothyroidism + goitre**; during pregnancy → **cretinism** (stunted growth, low IQ).\n- The **thyroid controls the basal metabolic rate (BMR)**, supports RBC formation, and controls metabolism of carbohydrates, proteins and fats.\n- Two calcium hormones pull opposite ways: **TCT lowers blood Ca2+**; **PTH raises blood Ca2+ (hypercalcemic)** through **bone resorption + renal reabsorption + gut absorption**.\n- **PTH + TCT together = calcium balance** in the body.",
    },
    // ── 13 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Iodine is the trigger word.** Whenever a question mentions iodine deficiency, the answer chain is: hypothyroidism → **goitre** (enlarged thyroid); in a growing baby → **cretinism**.\n\n**Never swap the two calcium hormones.** PTH (parathyroid) **raises** Ca2+ and is the **hypercalcemic** hormone; TCT (thyroid) **lowers** Ca2+. Examiners bank on students reversing these.\n\n**Know the counts and positions:** two thyroid lobes joined by the **isthmus**; **four** parathyroid glands on the **dorsal side of the thyroid**; pineal on the **dorsal side of the forebrain**.\n\n**Classic NEET question:** \"The hypercalcemic hormone is ___\" → **parathyroid hormone (PTH)**. And its twin: \"Deficiency of iodine causes ___\" → **goitre**.",
    },
    // ── 14 · Bridge text ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "You now hold three glands in place: the pineal keeping daily time, the thyroid setting body speed and helping mind blood calcium, and the four parathyroids pushing calcium back up when TCT pulls it down. Next, you'll meet two more glands sitting lower in the body — the **thymus**, which trains the immune system, and the **adrenal gland**, which handles stress and emergencies.",
    },
    // ── 15 · Inline quiz (LAST) ───────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Which hormone regulates the 24-hour (diurnal) rhythm of the body, and which gland secretes it?",
          options: [
            "Melatonin, secreted by the pineal gland on the dorsal side of the forebrain",
            "Thyroxine, secreted by the thyroid gland on either side of the trachea",
            "Melatonin, secreted by the parathyroid glands on the dorsal side of the thyroid",
            "Parathyroid hormone, secreted by the pineal gland deep in the forebrain",
          ],
          correct_index: 0,
          explanation: "Melatonin from the pineal gland runs the 24-hour (diurnal) rhythm — sleep-wake cycle and body temperature. Option 2 names the wrong hormone (thyroxine sets metabolic rate, not the body clock). Options 3 and 4 attach the right or wrong hormone to the wrong gland — melatonin does not come from the parathyroids, and PTH does not come from the pineal.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Deficiency of iodine in the diet leads directly to which condition?",
          options: [
            "Exophthalmic goitre, with protruding eyeballs and weight loss",
            "Hypothyroidism with enlargement of the thyroid gland, commonly called goitre",
            "Hyperthyroidism caused by nodules of the thyroid gland",
            "A rise in blood calcium because thyrocalcitonin can no longer be made",
          ],
          correct_index: 1,
          explanation: "Iodine is essential for making T3 and T4, so a shortage causes hypothyroidism plus swelling of the gland — goitre. Option 1 (exophthalmic goitre / Graves' disease) and option 3 are forms of HYPERthyroidism, the opposite problem, caused by cancer or nodules, not iodine lack. Option 4 invents a calcium link that NCERT never draws — iodine deficiency affects T3/T4, not TCT and blood calcium.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "PTH and TCT both act on blood calcium. Which statement correctly pairs each hormone with what it does?",
          options: [
            "PTH lowers blood Ca2+; TCT raises blood Ca2+",
            "Both PTH and TCT raise blood Ca2+, working in the same direction",
            "PTH raises blood Ca2+ and is hypercalcemic; TCT lowers blood Ca2+",
            "PTH raises blood Ca2+ by dissolving bone; TCT raises it further by renal reabsorption",
          ],
          correct_index: 2,
          explanation: "PTH is the hypercalcemic hormone — it raises blood Ca2+ — while TCT, from the thyroid, lowers it; together they balance calcium. Option 1 reverses both. Option 2 wrongly makes them work the same way, when the whole point is that they oppose each other. Option 4 correctly describes PTH's bone action but falsely claims TCT also raises calcium, when TCT lowers it.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "By which combination of actions does parathyroid hormone (PTH) raise the blood Ca2+ level?",
          options: [
            "It stimulates bone resorption, boosts Ca2+ reabsorption by the renal tubules, and increases Ca2+ absorption from digested food",
            "It builds new bone, releases calcium into urine, and blocks calcium absorption in the gut",
            "It raises the basal metabolic rate, supports RBC formation, and controls fat metabolism",
            "It regulates the sleep-wake cycle, pigmentation, and the menstrual cycle",
          ],
          correct_index: 0,
          explanation: "PTH pushes calcium up three ways at once: bone resorption (dissolving bone to release calcium), more reabsorption by the renal tubules, and more absorption from food — bone, kidney, gut. Option 2 flips every action into its opposite. Option 3 lists thyroid-hormone (T3/T4) functions, and option 4 lists melatonin's jobs — neither belongs to PTH.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
