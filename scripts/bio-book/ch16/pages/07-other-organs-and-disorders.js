'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'other-organs-and-disorders',
  title: 'Other Organs in Excretion & Kidney Disorders',
  subtitle: "The kidneys do the heavy lifting, but your lungs, liver and skin quietly throw out waste too — and when the kidneys fail, a machine of cellophane tubing takes over their job. This closes the whole excretion chapter.",
  page_number: 7,
  page_type: 'lesson',
  tags: ['excretory-products-and-their-elimination', 'excretory-disorders'],
  glossary: [
    { term: 'bile', definition: 'A secretion of the liver — the largest gland in the body — containing bilirubin, biliverdin, cholesterol, degraded steroid hormones, vitamins and drugs. Most of these substances leave the body along with digestive wastes.' },
    { term: 'sebum', definition: 'An oily secretion of the sebaceous glands of the skin. It carries out sterols, hydrocarbons and waxes, and forms a protective oily covering for the skin.' },
    { term: 'sweat', definition: 'A watery fluid produced by the sweat glands of the skin, containing NaCl and small amounts of urea and lactic acid. Its main job is cooling the body, but it also removes some wastes.' },
    { term: 'uremia', definition: 'A harmful condition in which malfunctioning kidneys allow urea to accumulate in the blood. It may lead to kidney failure.' },
    { term: 'hemodialysis', definition: 'A process that removes urea from the blood of a uremic patient using an artificial kidney — a coiled cellophane tube bathed in dialysing fluid.' },
    { term: 'dialysing fluid', definition: 'The fluid surrounding the cellophane tube in an artificial kidney. It has the same composition as blood plasma except that it contains no nitrogenous wastes, so wastes move out of the blood into it.' },
    { term: 'renal calculi', definition: 'A stone, or insoluble mass of crystallised salts such as oxalates, formed within the kidney.' },
    { term: 'glomerulonephritis', definition: 'Inflammation of the glomeruli of the kidney.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dim clinical room at night with a dialysis machine glowing softly, coiled transparent tubing catching the light beside a hospital bed',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet, dimly lit clinical room at night. On one side, a dialysis machine glows softly, its coiled transparent tubing catching a faint warm light, threads of red blood suggested inside without becoming a literal labelled diagram. An empty hospital bed sits in soft shadow beside it. Deep shadows fill the rest of the frame, warm highlights only on the tubing and the machine's surface. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'You Breathe Out More Than Just Air',
      markdown: "Every single minute, your lungs quietly throw away about **200 mL of CO₂** — a genuine metabolic waste — along with a fair amount of water. You never think of breathing as \"excretion,\" but it is. The kidneys get all the credit for cleaning the body, yet three other organs are removing waste every hour of your life without you noticing.",
    },
    // ── 2 · Core concept — kidneys aren't the only route ─────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "By now you know the kidney is the main excretory organ — it makes urine and gets rid of most of the body's nitrogenous waste. But it isn't the only exit. **Besides the kidneys, the lungs, the liver and the skin also help eliminate excretory wastes.** Each one handles a different kind of waste, and together they take some of the load off the kidneys.\n\nThink of it as four separate doors, each letting out its own type of rubbish — gas through one, oily leftovers through another, salty water through a third.",
    },
    // ── 3 · Heading — lungs, liver, skin ──────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Lungs, Liver & Skin — The Backup Excretory Organs',
      objective: "By the end of this you can name exactly what each of the lungs, liver and skin removes from the body, and through which secretion.",
    },
    // ── 4 · Text — the three organs ───────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Lungs.** Your lungs remove large amounts of **CO₂ (about 200 mL per minute)** and also significant quantities of **water** every day. This is why heavy breathing during exercise is genuinely getting rid of waste.\n\n**Liver.** The liver is the **largest gland** in the body. It secretes **bile**, and that bile carries substances like **bilirubin, biliverdin, cholesterol, degraded steroid hormones, vitamins and drugs**. Most of these ultimately **pass out along with the digestive wastes** — so the liver's waste leaves the body through the gut, not the kidney.\n\n**Skin.** The skin holds two kinds of glands. The **sweat glands** produce **sweat** — a watery fluid containing **NaCl, small amounts of urea and lactic acid**. Sweat's *main* job is to **cool the body**, but it also removes a little waste on the side. The **sebaceous glands** get rid of **sterols, hydrocarbons and waxes** through **sebum**, which also forms a protective oily covering for the skin.\n\nOne more, easy to forget: small amounts of nitrogenous waste can also leave through your **saliva**.",
    },
    // ── 5 · Table — organ to waste ────────────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 5,
      caption: 'Each backup organ and what it throws out',
      headers: ['Organ', 'Secretion / route', 'What it removes'],
      rows: [
        ['Lungs', 'Exhaled air', 'CO₂ (~200 mL/min) and significant water'],
        ['Liver (largest gland)', 'Bile → out with digestive wastes', 'Bilirubin, biliverdin, cholesterol, degraded steroid hormones, vitamins, drugs'],
        ['Skin — sweat glands', 'Sweat (main job: cooling)', 'NaCl, small amounts of urea and lactic acid'],
        ['Skin — sebaceous glands', 'Sebum (protective oily covering)', 'Sterols, hydrocarbons, waxes'],
        ['Salivary glands', 'Saliva', 'Small amounts of nitrogenous waste'],
      ],
    },
    // ── 6 · Heading — disorders & treatments ──────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'When the Kidneys Fail — Disorders & Treatments',
      objective: "By the end of this you can explain what uremia is, how a hemodialysis machine cleans the blood step by step, and what renal calculi and glomerulonephritis mean.",
    },
    // ── 7 · Text — uremia and hemodialysis ────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "When the kidneys malfunction, urea starts building up in the blood instead of leaving in the urine. This accumulation of **urea in the blood** is called **uremia**. It is **highly harmful** and may lead to **kidney failure**.\n\nFor such patients, urea can be pulled out of the blood by a process called **hemodialysis**, using a machine called an **artificial kidney**. Here is exactly how it works:\n\n1. Blood is drained from a convenient **artery** and mixed with an **anticoagulant (heparin)** so it doesn't clot in the machine.\n2. This blood is pumped into the dialysing unit — a coiled **cellophane tube** surrounded by **dialysing fluid**.\n3. The dialysing fluid has the **same composition as blood plasma, except it contains no nitrogenous wastes**. Because the cellophane membrane is porous, molecules move across it down their **concentration gradient**. Since there are no nitrogenous wastes in the fluid, the wastes in the blood **freely move out** into the fluid — clearing the blood.\n4. The cleared blood is pumped back into the body through a **vein**, after adding **anti-heparin** to it so its clotting ability is restored.\n\nNotice the clever bit: nothing pushes the waste out. The waste leaves *on its own* simply because the fluid outside has none of it — pure diffusion down a gradient.",
    },
    // ── 8 · Interactive image — hemodialysis setup ────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 8, src: '',
      alt: 'Diagram of a hemodialysis / artificial kidney setup: blood leaves an artery, mixes with heparin, passes through a coiled cellophane tube bathed in dialysing fluid where wastes diffuse out, then cleared blood returns to a vein after anti-heparin',
      caption: '📸 Tap each dot to follow the blood through the artificial kidney, from artery to vein.',
      generation_prompt: "Scientific textbook illustration of a hemodialysis (artificial kidney) setup. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, labels in white text with thin white leader lines. On the left, blood exits an artery through a tube (red) and passes a small point where an anticoagulant (heparin) is added. The tube leads into a rectangular dialysing unit containing a long coiled cellophane tube; the unit is filled with pale blue dialysing fluid surrounding the coil. Small arrows show waste molecules moving out of the coiled tube into the surrounding fluid. On the right, a cleared blood tube (red) returns to a vein, passing a point where anti-heparin is added. Red = blood, blue = dialysing fluid. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.08, y: 0.30, label: 'Blood from artery', detail: "Blood is drained from a convenient **artery** — the high-pressure vessel — and pumped toward the machine.", icon: 'circle' },
        { id: uuid(), x: 0.24, y: 0.55, label: 'Heparin added', detail: "An **anticoagulant, heparin**, is mixed into the blood so it does not clot while passing through the machine.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.35, label: 'Coiled cellophane tube', detail: "The blood flows through a coiled **cellophane tube**. Its membrane is **porous**, letting molecules cross based on concentration gradient.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.70, label: 'Dialysing fluid', detail: "The tube is bathed in **dialysing fluid** — same composition as **plasma except the nitrogenous wastes**. That missing piece is what drives the cleaning.", icon: 'circle' },
        { id: uuid(), x: 0.66, y: 0.50, label: 'Wastes diffuse out', detail: "Because the fluid has no nitrogenous wastes, the wastes in the blood **freely move out** across the membrane down their concentration gradient, clearing the blood.", icon: 'circle' },
        { id: uuid(), x: 0.90, y: 0.30, label: 'Cleared blood to vein', detail: "The cleared blood is returned to the body through a **vein**, after adding **anti-heparin** to restore its ability to clot.", icon: 'circle' },
      ],
    },
    // ── 9 · Text — transplant, calculi, glomerulonephritis ────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "Hemodialysis keeps a patient alive, but it doesn't repair the kidney. The **ultimate** correction for **acute renal failure** (kidney failure) is a **kidney transplantation** — a working kidney taken from a **donor**, preferably a **close relative**, so the host's immune system is less likely to reject it.\n\nTwo more kidney disorders round out the list. **Renal calculi** are **stones** — an insoluble mass of crystallised salts, such as oxalates, formed within the kidney. **Glomerulonephritis** is the **inflammation of the glomeruli** of the kidney.",
    },
    // ── 10 · Reasoning prompt — dialysing fluid logic ─────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "In hemodialysis, the dialysing fluid is made with the same composition as blood plasma except for one thing — it contains no nitrogenous wastes. Why is leaving those wastes OUT of the fluid the whole point of the design?",
      options: [
        "With no nitrogenous wastes outside, the wastes inside the blood move out on their own down the concentration gradient, cleaning the blood",
        "The missing wastes make the fluid lighter, so it flows past the tube faster and scrubs the blood mechanically",
        "Without nitrogenous wastes the fluid becomes acidic, which chemically dissolves the urea in the blood",
        "The absence of wastes lets the fluid pull glucose and salts out of the blood, and the urea follows them",
      ],
      reveal: "Option 1 is right. The cellophane membrane is porous and lets molecules cross based on **concentration gradient**. Because the dialysing fluid has *no* nitrogenous wastes, there is a steep gradient for those wastes from blood (high) to fluid (none), so they diffuse out by themselves — no pumping, no chemistry needed. Option 2 invents a mechanical scrubbing effect that doesn't exist. Option 3 is wrong: nothing makes the fluid acidic and urea is not chemically dissolved. Option 4 is a trap — the fluid matches plasma in salts and glucose precisely so those do NOT leak out; only the wastes, which are missing from the fluid, leave.",
      difficulty_level: 2,
    },
    // ── 11 · Table — disorders & treatments ───────────────────────────────────
    {
      id: uuid(), type: 'table', order: 11,
      caption: 'Excretory-system disorders and the ways doctors correct kidney failure',
      headers: ['Term', 'What it is'],
      rows: [
        ['Uremia', 'Accumulation of urea in the blood from malfunctioning kidneys; highly harmful, may lead to kidney failure'],
        ['Renal calculi', 'Stone — an insoluble mass of crystallised salts (oxalates, etc.) formed within the kidney'],
        ['Glomerulonephritis', 'Inflammation of the glomeruli of the kidney'],
        ['Hemodialysis (treatment)', 'Removes urea using an artificial kidney — a coiled cellophane tube in dialysing fluid; wastes diffuse out'],
        ['Kidney transplantation (treatment)', 'Ultimate correction for acute renal failure; a donor kidney (preferably a close relative) replaces the failed one'],
      ],
    },
    // ── 12 · Remember callout ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Backup excretory organs:** **Lungs** → CO₂ (~200 mL/min) + water. **Liver** → bile pigments (bilirubin, biliverdin) etc., out with digestive wastes. **Skin** → sweat (NaCl, urea, lactic acid) + sebum (sterols, hydrocarbons, waxes). A little nitrogenous waste even leaves in **saliva**.\n- **Uremia** = **urea accumulating in the blood** — highly harmful, may cause kidney failure.\n- **Hemodialysis** uses an **artificial kidney**: a coiled **cellophane tube**, blood mixed with **heparin**, bathed in **dialysing fluid = plasma minus nitrogenous wastes**; wastes leave by **concentration gradient**; blood returns via a vein after **anti-heparin**.\n- **Kidney transplantation** = ultimate fix for acute renal failure; donor is preferably a **close relative** (less rejection).\n- **Renal calculi** = **stones** (crystallised salts like oxalates). **Glomerulonephritis** = **inflammation of the glomeruli**.",
    },
    // ── 13 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Sweat's primary function is cooling, not excretion** — NEET loves this. It *does* remove some waste, but if an option says its main job is to excrete urea, it's wrong.\n\n**Dialysing fluid = plasma composition MINUS nitrogenous wastes.** Never \"minus glucose\" or \"minus salts\" — those match plasma exactly, on purpose, so they don't leak out.\n\n**Classic NEET question:** \"Accumulation of urea in blood is called ___\" → **uremia**. And its twin: \"Dialysing fluid has the same composition as plasma except ___\" → **the nitrogenous wastes**.",
    },
    // ── 14 · Closing synthesis of the whole chapter ───────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "That completes the story of excretion. It began with the problem — our cells constantly make **nitrogenous wastes** (ammonia, urea, uric acid), and different animals get rid of them in the form that costs them the least water. The organ built to handle this is the **kidney**, and inside it, a million tiny **nephrons** do the real work: blood is **filtered** at the glomerulus, then the tubule **reabsorbs** back everything worth keeping — water, glucose, salts — and actively **secretes** extra waste in. A **counter-current** arrangement of the loop of Henle and the vasa recta lets the medulla concentrate the urine so we lose as little water as possible. **Hormones** — ADH, aldosterone, ANF — fine-tune how much water and salt stay in, and the filled bladder finally empties by **micturition**. When all that fails, the **lungs, liver and skin** carry part of the load, and a **dialysis machine** can stand in for a broken kidney. From a single waste molecule to a whole machine that mimics an organ — that's the excretory system, start to finish.",
    },
    // ── 15 · Inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Besides the kidneys, which set of organs helps eliminate excretory wastes, and what does each mainly remove?",
          options: [
            "Lungs remove CO₂ and water; liver removes bile substances with digestive wastes; skin removes sweat and sebum",
            "Lungs remove urea; liver removes CO₂; skin removes bilirubin through sweat",
            "Lungs remove bile pigments; liver removes lactic acid; skin removes CO₂ through sebum",
            "Lungs remove NaCl; liver removes water; skin removes cholesterol through sweat",
          ],
          correct_index: 0,
          explanation: "NCERT is specific: the lungs remove large amounts of CO₂ (~200 mL/min) and water; the liver secretes bile carrying bilirubin, biliverdin, cholesterol and more, most of which leave with digestive wastes; and the skin removes sweat (NaCl, urea, lactic acid) and sebum (sterols, hydrocarbons, waxes). The other options scramble which organ removes which waste — e.g. CO₂ is a lung job, never a liver or sebum job.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "The accumulation of urea in the blood due to malfunctioning kidneys is called:",
          options: [
            "Glomerulonephritis",
            "Uremia",
            "Renal calculi",
            "Ketonuria",
          ],
          correct_index: 1,
          explanation: "Uremia is exactly this — urea building up in the blood because the kidneys aren't clearing it; it is highly harmful and may lead to kidney failure. Glomerulonephritis is inflammation of the glomeruli, renal calculi are kidney stones, and ketonuria is ketone bodies appearing in the urine (a sign of diabetes) — none of these is urea in the blood.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "In an artificial kidney during hemodialysis, the dialysing fluid has the same composition as blood plasma EXCEPT that it lacks:",
          options: [
            "Glucose and amino acids",
            "Sodium and potassium ions",
            "The nitrogenous wastes",
            "Water and heparin",
          ],
          correct_index: 2,
          explanation: "The dialysing fluid matches plasma in everything except the nitrogenous wastes. That missing piece creates a concentration gradient so the wastes in the blood diffuse out across the porous cellophane membrane. If glucose or salts were missing (options 1 and 2), they too would leak out of the blood — which the design deliberately prevents by matching them to plasma.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "A kidney transplant is planned for a patient with acute renal failure. Why is the donor preferably a close relative?",
          options: [
            "A relative's kidney is physically larger and filters blood faster",
            "A relative's kidney already contains anti-heparin, so no clotting occurs",
            "A close relative's tissues are more similar, minimising rejection by the host's immune system",
            "Only a blood relative's kidney can produce dialysing fluid inside the body",
          ],
          correct_index: 2,
          explanation: "NCERT states the donor is preferably a close relative to minimise the chance of the transplanted kidney being rejected by the host's immune system — closer tissue similarity means a lower immune attack. The other options are inventions: kidney size and filtration speed aren't the reason, anti-heparin belongs to the dialysis machine, and no kidney 'produces dialysing fluid' — that fluid is part of the artificial-kidney machine, not the body.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
