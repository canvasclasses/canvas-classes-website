'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'pancreas-and-gonads',
  title: 'The Pancreas & the Gonads',
  subtitle: "One tiny gland decides whether sugar stays in your blood or moves into your cells — and two more decide who grows a beard and who can carry a pregnancy. Learn which cell makes which hormone, exactly the way NEET asks it.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['chemical-coordination-and-integration', 'pancreas', 'gonads'],
  glossary: [
    { term: 'Islets of Langerhans', definition: 'The endocrine part of the pancreas — about 1 to 2 million scattered cell-clusters that make up only 1 to 2 per cent of the whole pancreas. They contain the α-cells and β-cells.' },
    { term: 'glucagon', definition: 'A peptide hormone from the α-cells of the Islets of Langerhans. It acts on liver cells to raise blood sugar — a hyperglycemic hormone.' },
    { term: 'insulin', definition: 'A peptide hormone from the β-cells of the Islets of Langerhans. It moves glucose out of the blood into cells, lowering blood sugar — a hypoglycemic hormone.' },
    { term: 'glycogenolysis', definition: 'The breakdown of stored glycogen back into glucose. Glucagon stimulates this in the liver, which raises blood sugar.' },
    { term: 'glycogenesis', definition: 'The conversion of glucose into glycogen for storage. Insulin stimulates this in target cells.' },
    { term: 'diabetes mellitus', definition: 'A disorder caused by prolonged high blood sugar (hyperglycemia), marked by loss of glucose in the urine and formation of harmful ketone bodies. It is treated with insulin therapy.' },
    { term: 'Leydig cells', definition: 'The interstitial cells lying between the seminiferous tubules of the testis; they produce androgens, mainly testosterone.' },
    { term: 'corpus luteum', definition: 'The structure formed from the ruptured ovarian follicle after ovulation; it secretes mainly progesterone.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A soft, atmospheric impression of the human torso at night with three glowing points marking the pancreas and the two gonads',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A dark, atmospheric silhouette of a human torso rendered in deep shadow, with three softly glowing warm points of light suggested deep inside it — one near the centre of the abdomen and two lower and to the sides — as if lit from within, hinting at hidden glands without any labels or diagram lines. Painterly, moody, naturalistic lighting against near-black surroundings (#0a0a0a base tones). Warm amber highlights only at the glowing points, deep shadow everywhere else. No text, no labels, no anatomical diagram, no people's faces.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'A Gland That Does Two Jobs At Once',
      markdown: "The pancreas is a bit of a cheat. Most of it quietly makes digestive juices and pipes them into your gut — that's its **exocrine** job. But hidden inside, taking up barely **1 to 2 per cent** of the whole organ, sit around **1 to 2 million** tiny cell-islands that do a completely different job: they pour hormones straight into your blood. Those tiny islands are the **Islets of Langerhans**, and they hold the two hormones that decide, minute by minute, how much sugar is floating in your blood right now.",
    },
    // ── 2 · Core concept — pancreas as composite gland ────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The **pancreas** is a **composite gland** — it works as both an **exocrine** gland and an **endocrine** gland. The exocrine part sends digestive juice into the intestine. The **endocrine** part is a scatter of small cell-clusters called the **Islets of Langerhans**.\n\nThere are about **1 to 2 million** Islets of Langerhans in a normal human pancreas, and together they make up only about **1 to 2 per cent** of the pancreatic tissue — a tiny fraction of the organ doing all the hormone work. Each islet has two main types of cells: **α-cells** (alpha), which secrete **glucagon**, and **β-cells** (beta), which secrete **insulin**. These two hormones are the whole story of this section.",
    },
    // ── 3 · Heading — insulin & glucagon ──────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Insulin & Glucagon — The Two Hormones That Balance Your Blood Sugar',
      objective: "By the end of this you can say which cell makes each hormone, whether it raises or lowers blood sugar, and the exact process each one switches on.",
    },
    // ── 4 · Text — the two hormones and what they do ──────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Picture your blood sugar as a level that must not swing too high or too low. Two hormones, working as opposites, keep it steady.\n\n**Glucagon** is a **peptide hormone** that helps maintain normal blood glucose levels. It acts mainly on the **liver cells (hepatocytes)** and stimulates **glycogenolysis** — the breakdown of stored glycogen back into glucose — which pushes blood sugar up (**hyperglycemia**). It also stimulates **gluconeogenesis** (making fresh glucose), adding even more sugar to the blood, and it reduces how much glucose the cells take up and use. Put simply, glucagon is a **hyperglycemic hormone** — it *raises* blood sugar.\n\n**Insulin** is also a **peptide hormone**, and it plays the major role in **glucose homeostasis**. It acts mainly on **hepatocytes and adipocytes** (fat-tissue cells) and enhances **cellular glucose uptake and utilisation**. This causes a rapid movement of glucose *out of the blood and into* those cells, so blood glucose falls (**hypoglycemia**). Insulin also stimulates **glycogenesis** — converting glucose into glycogen for storage. Put simply, insulin *lowers* blood sugar.\n\nBecause one raises blood sugar and the other lowers it, **glucose homeostasis is maintained jointly by insulin and glucagon** — the two are antagonists holding the level steady between them.",
    },
    // ── 5 · Interactive image — Islets of Langerhans ──────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A cross-section diagram of an Islet of Langerhans showing alpha-cells, beta-cells and the surrounding exocrine acini, with arrows showing glucagon raising and insulin lowering blood glucose',
      caption: '📸 Tap each dot to explore how one tiny cell-island balances your blood sugar.',
      generation_prompt: "Scientific textbook illustration of an Islet of Langerhans within pancreatic tissue. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A rounded cluster of cells (the islet) sits embedded in surrounding grape-like exocrine acini. Inside the islet, clearly show a group of α-cells on one side and β-cells on the other, drawn as distinct cell groups. A nearby blood capillary runs past the islet. Two labelled arrows: one from the α-cells reading 'glucagon → raises blood glucose', one from the β-cells reading 'insulin → lowers blood glucose'. Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. Pink/magenta for the soft glandular tissue, red for the blood capillary. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.30, y: 0.40, label: 'α-cells (alpha)', detail: "These secrete **glucagon**, the hormone that *raises* blood sugar. Glucagon acts on liver cells and breaks stored glycogen back into glucose.", icon: 'circle' },
        { id: uuid(), x: 0.52, y: 0.55, label: 'β-cells (beta)', detail: "These secrete **insulin**, the hormone that *lowers* blood sugar. Insulin moves glucose out of the blood into liver and fat cells. β-cells are the majority cell type of the islet.", icon: 'circle' },
        { id: uuid(), x: 0.42, y: 0.30, label: 'Islet of Langerhans', detail: "The endocrine part of the pancreas. There are about 1 to 2 million of these islets, making up only 1 to 2 per cent of the whole pancreas.", icon: 'circle' },
        { id: uuid(), x: 0.78, y: 0.62, label: 'Exocrine acini', detail: "The other 98–99 per cent of the pancreas. These clusters make digestive juice and send it to the intestine — the pancreas's exocrine job, separate from the hormone-making islets.", icon: 'circle' },
        { id: uuid(), x: 0.66, y: 0.28, label: 'Blood capillary', detail: "Both hormones are poured straight into the blood here (endocrine = ductless). Through this blood, glucagon and insulin reach the liver and fat cells they act on.", icon: 'circle' },
        { id: uuid(), x: 0.22, y: 0.72, label: 'Glucagon → up', detail: "Glucagon stimulates **glycogenolysis** and **gluconeogenesis** in the liver and reduces glucose uptake by cells — so blood sugar goes **up** (hyperglycemia).", icon: 'circle' },
        { id: uuid(), x: 0.58, y: 0.80, label: 'Insulin → down', detail: "Insulin enhances glucose uptake by cells and stimulates **glycogenesis** (glucose → glycogen) — so blood sugar goes **down** (hypoglycemia).", icon: 'circle' },
      ],
    },
    // ── 6 · Comparison card — insulin vs glucagon ─────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 6,
      title: 'Insulin vs Glucagon',
      columns: [
        {
          heading: 'Insulin (β-cells)',
          points: [
            'Secreted by the β-cells of the Islets of Langerhans',
            'A peptide hormone',
            'Lowers blood glucose → hypoglycemic hormone',
            'Enhances cellular glucose uptake and utilisation (acts on hepatocytes and adipocytes)',
            'Stimulates glycogenesis (glucose → glycogen)',
          ],
        },
        {
          heading: 'Glucagon (α-cells)',
          points: [
            'Secreted by the α-cells of the Islets of Langerhans',
            'A peptide hormone',
            'Raises blood glucose → hyperglycemic hormone',
            'Reduces cellular glucose uptake (acts mainly on liver cells / hepatocytes)',
            'Stimulates glycogenolysis (glycogen → glucose) and gluconeogenesis',
          ],
        },
      ],
    },
    // ── 7 · Text — diabetes mellitus ──────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "When this balance breaks and blood sugar stays high for a long time, the result is a serious disorder. **Prolonged hyperglycemia leads to diabetes mellitus** — a complex condition marked by **loss of glucose through the urine** and the formation of harmful compounds called **ketone bodies**. Diabetic patients are successfully treated with **insulin therapy** — supplying the very hormone the body can no longer balance on its own.",
    },
    // ── 8 · Heading — the gonads ──────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'The Gonads — Testis & Ovary as Endocrine Glands',
      objective: "By the end of this you can name the hormone-making cell in the testis and the two sources in the ovary, and match each hormone to what it does.",
    },
    // ── 9 · Text — testis ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "The **gonads** — the testis in males and the ovary in females — are not only sex organs. Each one is **also an endocrine gland**, making the sex hormones.\n\nA pair of **testis** sits in the **scrotal sac**, outside the abdomen. The testis does a **dual job**: it is a **primary sex organ** and an **endocrine gland**. It is built from **seminiferous tubules** (where sperm form) plus interstitial tissue between them. Lying in those intertubular spaces are the **Leydig cells** (also called **interstitial cells**), and these produce a group of hormones called **androgens — mainly testosterone**.\n\nAndrogens do a lot. They regulate the **development and maturation of the male accessory sex organs**. They stimulate **muscular growth**, the growth of **facial and axillary (armpit) hair**, **aggressiveness**, and a **low-pitched voice**. They are essential for **spermatogenesis** — the formation of sperm. They act on the central nervous system to influence **male sexual behaviour (libido)**. And they have **anabolic effects** on protein and carbohydrate metabolism — that is, they build tissue up.",
    },
    // ── 10 · Text — ovary ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "Females have a pair of **ovaries** in the **abdomen**. The ovary is the **primary female sex organ**, releasing **one ovum during each menstrual cycle**. It also produces two **steroid hormones**: **estrogen** and **progesterone**. The ovary is built from **ovarian follicles** and stromal tissue.\n\n**Estrogen** is synthesised and secreted mainly by the **growing ovarian follicles**. It stimulates the **growth and activity of the female secondary sex organs**, the development of the growing follicles, the appearance of **female secondary sex characters** (such as a **high-pitched voice**) and **mammary gland development**, and it regulates female sexual behaviour.\n\nAfter ovulation, the **ruptured follicle** turns into a structure called the **corpus luteum**, which secretes mainly **progesterone**. **Progesterone supports pregnancy**. It also acts on the mammary glands, stimulating the formation of **alveoli** (the small sacs that store milk) and **milk secretion**.",
    },
    // ── 11 · Table — gonadal hormones ─────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 11,
      caption: 'The gonads as endocrine glands — which cell or structure makes which hormone, and what it does',
      headers: ['Gland', 'Source', 'Hormone', 'Main actions'],
      rows: [
        ['Testis', 'Leydig cells (interstitial cells)', 'Androgens (mainly testosterone)', 'Male accessory sex organs; muscle growth, facial/axillary hair, aggressiveness, low-pitched voice; spermatogenesis; libido; anabolic effects'],
        ['Ovary', 'Growing ovarian follicles', 'Estrogen', 'Female secondary sex organs and characters (high-pitched voice); follicle development; mammary gland development; sexual behaviour'],
        ['Ovary', 'Corpus luteum (ruptured follicle after ovulation)', 'Progesterone', 'Supports pregnancy; forms alveoli in mammary glands; milk secretion'],
      ],
    },
    // ── 12 · Reasoning prompt — hormone / cell matching ───────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 12, reasoning_type: 'logical',
      prompt: "A patient's blood sugar has just spiked far too high after a meal. Which cell should now be releasing a hormone to bring it back down, and what is that hormone doing?",
      options: [
        "The β-cells release insulin, which moves glucose from the blood into liver and fat cells",
        "The α-cells release glucagon, which moves glucose from the blood into liver and fat cells",
        "The β-cells release glucagon, which breaks stored glycogen down into glucose",
        "The α-cells release insulin, which stimulates gluconeogenesis in the liver",
      ],
      reveal: "The first option is correct. High blood sugar is brought down by **insulin**, and insulin is made by the **β-cells**. It works by enhancing glucose uptake into hepatocytes and adipocytes, so glucose leaves the blood. The most tempting trap is the second option — it describes the right *action* (glucose moving into cells lowers blood sugar) but pins it on the wrong cell and hormone: α-cells make **glucagon**, which *raises* blood sugar, not lowers it. The last two options swap the hormones onto the wrong cells entirely (β-cells make insulin, not glucagon; α-cells make glucagon, not insulin).",
      difficulty_level: 2,
    },
    // ── 13 · Remember callout ─────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **β-cells → insulin** — *hypoglycemic* hormone: enhances glucose uptake into cells and stimulates **glycogenesis** (glucose → glycogen). Lowers blood sugar.\n- **α-cells → glucagon** — *hyperglycemic* hormone: stimulates **glycogenolysis** and gluconeogenesis in the liver. Raises blood sugar.\n- Glucose homeostasis is maintained **jointly by insulin and glucagon** (they are antagonists).\n- **Diabetes mellitus** = prolonged hyperglycemia → glucose lost in urine + harmful **ketone bodies**; treated with insulin therapy.\n- **Testis → Leydig (interstitial) cells → testosterone / androgens.**\n- **Ovary → growing follicles → estrogen; corpus luteum → progesterone (supports pregnancy).**",
    },
    // ── 14 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**The single most-tested swap:** β-cells make **insulin** (lowers sugar), α-cells make **glucagon** (raises sugar). Reversing these two is the trap NEET sets over and over — β for insulin, α for glucagon. Remember 'β for **B**lood-sugar-lowering'.\n\n**Match the source, not just the hormone:** in the ovary, **follicles → estrogen** and the **corpus luteum → progesterone**. In the testis, the **Leydig (interstitial) cells** — not the seminiferous tubules — make testosterone.\n\n**Classic NEET question:** \"Insulin is secreted by the ___ cells of the Islets of Langerhans.\" → **β-cells.** And its partner: \"The corpus luteum secretes mainly ___.\" → **progesterone.**",
    },
    // ── 15 · Bridge text ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 15,
      markdown: "You now know the whole endocrine story of the pancreas and the gonads — which cell makes which hormone, and whether it pushes blood sugar up or down. But hormones aren't made only by the organs we call 'glands'. Next, you'll meet the hormones secreted by organs that have a completely different day job — the **heart, the kidney, and the gut**.",
    },
    // ── 16 · Inline quiz (LAST) ───────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 16, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Which cells of the Islets of Langerhans secrete insulin, and what is insulin's effect on blood glucose?",
          options: [
            "The β-cells secrete insulin, which lowers blood glucose by enhancing glucose uptake into cells",
            "The α-cells secrete insulin, which lowers blood glucose by enhancing glucose uptake into cells",
            "The β-cells secrete insulin, which raises blood glucose by stimulating glycogenolysis",
            "The α-cells secrete insulin, which raises blood glucose by stimulating gluconeogenesis",
          ],
          correct_index: 0,
          explanation: "Insulin comes from the **β-cells** and it *lowers* blood glucose by enhancing cellular glucose uptake and utilisation. Option 2 keeps the right effect but names the wrong cell (α-cells make glucagon, not insulin). Options 3 and 4 describe glucagon's raising action, not insulin's — insulin lowers blood sugar.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Glucagon is described as a hyperglycemic hormone. Which action explains that label?",
          options: [
            "It stimulates glycogenolysis in liver cells, breaking glycogen down to glucose and raising blood sugar",
            "It stimulates glycogenesis in liver cells, converting glucose to glycogen and raising blood sugar",
            "It enhances glucose uptake by adipocytes, moving glucose into fat cells and raising blood sugar",
            "It converts glucose into ketone bodies in the liver, which raises blood sugar",
          ],
          correct_index: 0,
          explanation: "Glucagon acts on hepatocytes and stimulates **glycogenolysis** (glycogen → glucose), plus gluconeogenesis, which raises blood sugar — that is why it is 'hyperglycemic'. Option 2 names glycogenesis, which is insulin's storage action and would *lower* sugar. Option 3 describes insulin's uptake action. Ketone bodies (option 4) form in prolonged diabetes, not as glucagon's normal action.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "In the ovary, which structure secretes mainly progesterone, and what is progesterone's main role?",
          options: [
            "The corpus luteum, formed from the ruptured follicle after ovulation, secretes mainly progesterone, which supports pregnancy",
            "The growing ovarian follicle secretes mainly progesterone, which supports pregnancy",
            "The corpus luteum secretes mainly estrogen, which triggers the appearance of female secondary sex characters",
            "The Leydig cells secrete mainly progesterone, which stimulates milk secretion during pregnancy",
          ],
          correct_index: 0,
          explanation: "After ovulation the ruptured follicle becomes the **corpus luteum**, which secretes mainly **progesterone**, and progesterone **supports pregnancy**. Option 2 pins progesterone on the follicle, but the follicle mainly makes estrogen. Option 3 swaps the hormone (corpus luteum → progesterone, not estrogen). Option 4 places the Leydig cells — which belong to the *testis* and make androgens — in the ovary.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which of the following correctly describes diabetes mellitus as given by NCERT?",
          options: [
            "It results from prolonged hyperglycemia, with glucose lost in the urine and harmful ketone bodies formed; it is treated with insulin therapy",
            "It results from prolonged hypoglycemia caused by excess insulin, and is treated with glucagon therapy",
            "It results from the α-cells failing to make glucagon, causing blood sugar to fall dangerously low",
            "It results from the corpus luteum secreting too much progesterone, disrupting glucose homeostasis",
          ],
          correct_index: 0,
          explanation: "NCERT states that **prolonged hyperglycemia** (high blood sugar) leads to diabetes mellitus, associated with loss of glucose through urine and formation of **ketone bodies**, treated with **insulin therapy**. Option 2 reverses it to low blood sugar. Option 3 misdescribes the cause as a glucagon shortage lowering sugar. Option 4 brings in progesterone, which has nothing to do with diabetes here.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
