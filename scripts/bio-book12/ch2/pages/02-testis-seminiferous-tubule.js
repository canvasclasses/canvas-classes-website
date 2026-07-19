'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'inside-the-testis-seminiferous-tubules',
  title: 'Inside the Testis — Seminiferous Tubules',
  subtitle: "Open up a testis and you find coiled tubes where sperms are made, lined by nurse cells that feed the germ cells and, just outside, other cells that make the male hormones — two cell types NEET loves to swap.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['male-reproductive-system', 'seminiferous-tubule', 'sertoli-cell', 'leydig-cell', 'human-reproduction'],
  glossary: [
    { term: 'seminiferous tubule', definition: 'A highly coiled tube inside a testicular lobule where sperms are produced. Each lobule holds one to three of them.' },
    { term: 'spermatogonia', definition: 'The male germ cells that sit on the inside wall of the seminiferous tubule and undergo meiotic divisions to finally form sperms. Singular: spermatogonium.' },
    { term: 'Sertoli cell', definition: 'A tall cell lining the seminiferous tubule that provides nutrition to the developing germ cells. Also called a nurse cell.' },
    { term: 'interstitial spaces', definition: 'The regions outside the seminiferous tubules; they contain small blood vessels and the interstitial (Leydig) cells.' },
    { term: 'Leydig cell', definition: 'An interstitial cell lying outside the seminiferous tubules that synthesises and secretes the testicular hormones called androgens. Also called an interstitial cell.' },
    { term: 'seminal plasma', definition: 'The fluid made by the accessory glands (seminal vesicles, prostate, bulbourethral glands); it is rich in fructose, calcium and certain enzymes.' },
    { term: 'semen', definition: 'The seminal plasma together with the sperms suspended in it.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'An atmospheric cutaway of a testis, its interior opening into a mass of coiled tubes catching a low warm light',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single oval testis shown in dramatic cutaway on the right, its dense outer covering peeling open to reveal the interior packed with tightly coiled, glistening tubes — the seminiferous tubules — spilling like fine coiled rope toward the centre of the frame. Warm low key lighting from one side rakes across the coils, catching soft highlights on their curves while the rest falls into deep shadow. Painterly, atmospheric, anatomical-illustration mood rather than clinical; naturalistic soft pink-and-cream tissue tones against an overall dark background (#0a0a0a base tones). No text, no labels, no leader lines, no diagram callouts.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Kilometres of Tube, Folded Into a Thumb',
      markdown: "Each testis is only about **4 to 5 cm long** — smaller than your thumb. Yet packed inside it are around **250 compartments (testicular lobules)**, and every lobule holds **one to three seminiferous tubules** coiled up tight. Uncoil them all and you'd have a startling length of tubing folded into that little oval. And this whole factory only works because the scrotum keeps the testes **2–2.5 °C cooler** than the rest of your body — too warm, and sperm production stalls.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The testes are the male **primary sex organs** — the place where sperms are made. To see how, we have to go inside. Each testis is covered by a **dense covering**, and beneath it the testis is divided into about **250 compartments called testicular lobules**.\n\nEach lobule contains **one to three highly coiled seminiferous tubules**, and it is inside these tubules that **sperms are produced**. So the path inward is simple to hold in your head: testis → lobule → seminiferous tubule → the sperm-making surface lining that tubule. Everything important on this page happens on the wall of that one coiled tube, and in the spaces just outside it.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Two Cell Types Inside the Tubule',
      objective: "By the end of this you can point to the cell that makes sperms, the cell that feeds them, and the cell (outside) that makes the male hormones — without mixing them up.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Look at the inside wall of a seminiferous tubule and you find it **lined by two types of cells**:\n\n- **Male germ cells (spermatogonia)** — these sit on the inside wall and **undergo meiotic divisions that finally lead to sperm formation**. As they mature, the developing stages move inward, from the wall toward the hollow centre (the lumen).\n- **Sertoli cells** — tall cells that **provide nutrition to the germ cells**. Think of them as the nurse cells: they don't become sperms themselves, they feed the cells that do.\n\nNow step just **outside** the tubule. The regions between the tubules are the **interstitial spaces**, and they contain small blood vessels and the **interstitial cells, also called Leydig cells**. The Leydig cells **synthesise and secrete the testicular hormones called androgens** (the male sex hormones). A few other immunologically competent cells are present here too.\n\nHold onto the geography: **inside** the tubule wall = germ cells + Sertoli (feeding) cells; **outside** the tubule, in the interstitial spaces = Leydig cells (hormone makers).",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Transverse section of a seminiferous tubule showing spermatogonia on the wall, Sertoli cells, primary spermatocytes, spermatids and sperm near the lumen, and Leydig cells in the interstitial space outside',
      caption: '📸 Tap each dot to explore the transverse section of a seminiferous tubule (Figure 2.2)',
      generation_prompt: "Scientific textbook illustration of a transverse section (T.S.) of a single seminiferous tubule. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A large circular cross-section of one tubule fills most of the frame: a thick wall built of layered cells with a hollow open centre (lumen) in the middle. Show, arranged from the outer wall inward toward the lumen: a row of rounded germ cells sitting on the basement membrane (spermatogonia), then slightly larger rounded cells (primary spermatocytes), then small clustered cells and slender tailed sperm near and projecting into the central lumen. Interspersed between the germ cells, draw tall column-shaped Sertoli cells stretching from the wall toward the lumen, distinctly taller and paler than the round germ cells. Outside the circular tubule, in the wedge-shaped interstitial space between tubules, draw a small cluster of polygonal Leydig (interstitial) cells beside a tiny blood vessel. Clean white outlines, biologically accurate proportions, functional colours (pink/magenta animal soft tissue, purple nuclei, faint red blood vessel). No baked-in text labels, no leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.19, y: 0.76, label: 'Spermatogonia (germ cells)', icon: 'circle',
          detail: 'The **male germ cells**, sitting on the **inside wall** of the tubule. They undergo **meiotic divisions** that finally lead to sperm formation. Everything that becomes a sperm starts here.' },
        { id: uuid(), x: 0.34, y: 0.61, label: 'Primary spermatocyte', icon: 'circle',
          detail: 'A germ cell that has enlarged and is set to divide. It lies a little **inward** from the spermatogonia — the developing stages move from the wall toward the centre as they mature.' },
        { id: uuid(), x: 0.5, y: 0.36, label: 'Spermatids / sperms', icon: 'circle',
          detail: 'The **mature end products**, found nearest the **lumen** with their tails pointing into the central space. This is where sperm formation finishes before the sperms are released into the tubule.' },
        { id: uuid(), x: 0.63, y: 0.67, label: 'Sertoli cell (nurse cell)', icon: 'circle',
          detail: 'A tall cell woven in among the germ cells, stretching from the wall toward the lumen. Its job is to **provide nutrition to the germ cells** — it feeds them, it does **not** make hormones.' },
        { id: uuid(), x: 0.5, y: 0.5, label: 'Lumen', icon: 'circle',
          detail: 'The **hollow central channel** of the tubule. The finished sperms are released into this space and carried away out of the testis.' },
        { id: uuid(), x: 0.86, y: 0.85, label: 'Leydig / interstitial cell', icon: 'circle',
          detail: 'Found **outside** the tubule, in the **interstitial space**. Leydig cells **synthesise and secrete androgens** (male sex hormones). Note the position: they are never inside the tubule wall.' },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A student is told: 'This cell lies outside the seminiferous tubule, in the interstitial space, and its secretion is a hormone.' Which cell is being described, and what does it make?",
      options: [
        "Sertoli cell, and it secretes androgens",
        "Leydig cell, and it secretes androgens",
        "Sertoli cell, and it provides nutrition to the germ cells",
        "Spermatogonium, and it secretes androgens",
      ],
      reveal: "The clue 'outside the tubule, in the interstitial space, secretes a hormone' fits only the **Leydig (interstitial) cell**, which makes **androgens**. The tempting trap is 'Sertoli cell secretes androgens' — but Sertoli cells sit *inside* the tubule and their job is **nutrition**, not hormones. Watch the two mismatches in the wrong options: right cell but wrong function (nutrition), or wrong cell (Sertoli/spermatogonium) glued to the hormone. Location and function both have to match.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'comparison_card', order: 7, title: 'Sertoli cell vs Leydig cell',
      columns: [
        { heading: 'Sertoli cell', points: [
          'Location: **inside** the seminiferous tubule, in its wall',
          'Job: **provides nutrition** to the germ cells (nurse cell)',
          'Does **not** secrete hormones',
          'Also called: nurse cell',
        ] },
        { heading: 'Leydig cell', points: [
          'Location: **outside** the tubule, in the **interstitial space**',
          'Job: **synthesises and secretes androgens** (male hormones)',
          'Does **not** feed germ cells',
          'Also called: interstitial cell',
        ] },
      ],
    },
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'The Accessory Glands and Semen',
      objective: "By the end of this you can name the three accessory glands and say what their fluid is rich in — and what semen actually is.",
    },
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "Making sperms is only half the story — they also need a fluid to travel and survive in. That fluid comes from the **male accessory glands**, and NCERT names three:\n\n- **Paired seminal vesicles**\n- **A prostate**\n- **Paired bulbourethral glands**\n\nThe secretions of these glands together form the **seminal plasma**, which is **rich in fructose, calcium and certain enzymes**. The fructose is fuel; the mix keeps the sperms nourished and able to move. The secretions of the **bulbourethral glands** also help in the **lubrication** of the penis.\n\nPut the two pieces together and you get the definition to memorise: **semen = seminal plasma + the sperms** suspended in it. On the next page we follow those sperms out of the tubule and trace the accessory ducts that carry them to the outside.",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: "Don't Get These Reversed",
      markdown: "- **Seminiferous tubule** = where sperms are made; lined by **spermatogonia** (germ cells) + **Sertoli cells**.\n- **Sertoli cells** → **nourish** the germ cells. Inside the tubule. **No hormones.**\n- **Leydig / interstitial cells** → make **androgens**. Outside the tubule, in the **interstitial spaces**.\n- **Accessory glands** = paired **seminal vesicles**, a **prostate**, paired **bulbourethral glands**.\n- **Seminal plasma** is rich in **fructose, calcium and certain enzymes**.\n- **Semen = seminal plasma + sperms.**",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Sertoli vs Leydig — the #1 trap:** NEET repeatedly swaps their jobs. **Sertoli = nutrition, inside the tubule. Leydig = androgens, outside in the interstitial space.** If an option says 'Sertoli cells secrete androgens' or 'Leydig cells are found in the ovary,' it is wrong.\n\n**Seminal plasma composition** is lifted almost verbatim: **fructose, calcium and certain enzymes.**\n\n**Accessory glands count:** seminal vesicles and bulbourethral glands are **paired**; the prostate is **single**.\n\n**Classic NEET question:** \"Androgens are produced by which cells?\" → **Leydig (interstitial) cells**, not Sertoli cells. (NCERT even asks the True/False version: 'Androgens are produced by Sertoli cells' → **False**.)",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Where are Leydig cells located in the testis?',
          options: [
            'Lining the inside wall of the seminiferous tubule',
            'In the interstitial spaces, outside the seminiferous tubules',
            'Floating free in the lumen of the tubule',
            'Inside the epididymis',
          ],
          correct_index: 1,
          explanation: "Leydig (interstitial) cells lie in the interstitial spaces outside the seminiferous tubules, alongside small blood vessels. The inside wall of the tubule is where the germ cells and Sertoli cells sit — a common swap NEET uses to make you place Leydig cells in the wrong compartment.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Which cell of the seminiferous tubule provides nutrition to the developing germ cells?',
          options: [
            'Sertoli cell',
            'Leydig cell',
            'Primary spermatocyte',
            'Interstitial cell',
          ],
          correct_index: 0,
          explanation: "Sertoli cells are the nurse cells inside the tubule — their job is to nourish the germ cells. Leydig and interstitial cells are the same thing (the hormone-making cells outside the tubule), and a primary spermatocyte is a developing germ cell being fed, not a feeder.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'The testicular hormones called androgens are synthesised and secreted by which cells?',
          options: [
            'Sertoli cells',
            'Spermatogonia',
            'Primary spermatocytes',
            'Leydig cells',
          ],
          correct_index: 3,
          explanation: "Leydig (interstitial) cells synthesise and secrete androgens. The classic trap is the first option — Sertoli cells sit inside the tubule and only provide nutrition; they make no hormones. Spermatogonia and spermatocytes are germ cells destined to become sperms, not hormone factories.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'The seminal plasma, secreted by the male accessory glands, is rich in which of the following?',
          options: [
            'Androgens and other steroid hormones',
            'Only water and mucus, with no nutrients',
            'Fructose, calcium and certain enzymes',
            'DNA and RNA released from broken sperms',
          ],
          correct_index: 2,
          explanation: "NCERT states the seminal plasma is rich in fructose, calcium and certain enzymes — the fructose fuels sperm movement. Androgens are hormones made by Leydig cells, not a component of seminal plasma, so that option mixes up two different topics from this page.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
