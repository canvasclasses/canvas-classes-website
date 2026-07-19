'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-male-reproductive-system',
  title: 'The Male Reproductive System',
  subtitle: "A guided tour of the male reproductive tract — where sperms are made, why the factory sits outside the body, and the path a sperm travels from testis to the outside.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['human-reproduction', 'male-reproductive-system', 'testis', 'scrotum', 'accessory-glands'],
  glossary: [
    { term: 'scrotum', definition: 'A pouch of skin outside the abdominal cavity that holds the two testes and keeps them 2–2.5 °C cooler than the rest of the body.' },
    { term: 'testis', definition: 'The paired male gonad that produces sperms and the male sex hormones (androgens). Each is oval, about 4–5 cm long and 2–3 cm wide.' },
    { term: 'epididymis', definition: 'A coiled duct running along the back surface of each testis; sperms are stored and transported here after leaving the testis.' },
    { term: 'vas deferens', definition: 'The duct that carries sperms upward from the epididymis into the abdomen, loops over the urinary bladder, and joins the duct of the seminal vesicle.' },
    { term: 'ejaculatory duct', definition: 'The short duct formed where the vas deferens is joined by the duct from the seminal vesicle; it opens into the urethra.' },
    { term: 'urethra', definition: 'The tube that begins at the urinary bladder and runs through the penis to its external opening, the urethral meatus.' },
    { term: 'seminal plasma', definition: 'The fluid made by the accessory glands (seminal vesicles, prostate, bulbourethral glands); it is rich in fructose, calcium and certain enzymes.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A calm anatomical silhouette of the lower human torso with a soft internal glow marking the pelvic region where the reproductive organs sit',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet, dignified side-on silhouette of the lower human male torso and pelvis rendered in deep shadow against a near-black background (#0a0a0a base tones), with a single soft warm internal glow concentrated low in the pelvis region to suggest the location of the reproductive organs — never explicit or clinical, just a gentle luminous hint of where the system lives. Atmospheric painterly illustration, respectful and medical-textbook in tone, muted amber and deep blue lighting, no text, no labels, no diagram lines, no anatomical detail — only mood and the sense of an inner region about to be explored.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Factory That Runs Cool',
      markdown: "The testes are the only major organs the body deliberately keeps **outside** the abdominal cavity. Why put them in an exposed pouch instead of tucked safely inside? Because sperm production needs it **cooler** — about **2–2.5 °C below normal body temperature**. Body core heat is actually too hot for making sperms. So the scrotum acts like a thermostat, holding the testes just far enough from the warm core to keep the sperm factory running.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The **male reproductive system** sits in the **pelvis region**. It is built from a pair of **testes**, plus **accessory ducts, glands, and the external genitalia** (the penis). Everything on this page is one of those four parts, so keep that simple list in mind as we go.\n\nStart with the **testes**, because they are the heart of the system. The testes are held **outside the abdominal cavity** in a pouch called the **scrotum**. That position is not an accident — the scrotum keeps the testes **2–2.5 °C lower than normal internal body temperature**, and that lower temperature is **necessary for spermatogenesis** (sperm formation). In an adult, each testis is **oval**, about **4 to 5 cm long** and **2 to 3 cm wide**, wrapped in a **dense covering**. Sperms are made deep inside the testis and then have to travel a long, looping path to reach the outside. That path is what the rest of the system is for.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Layout of the Tract',
      objective: "By the end of this you can trace a sperm's journey in order — testis → epididymis → vas deferens → ejaculatory duct → urethra → outside — and place each gland along the way.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Follow the route a sperm takes. After being made in the testis, sperms pass into the **epididymis**, a coiled duct lying along the **back (posterior) surface** of each testis, where they are stored and transported. The epididymis leads into the **vas deferens**, which **ascends into the abdomen and loops over the urinary bladder**. There the vas deferens is joined by a **duct from the seminal vesicle**, and together they open into the **urethra** as the **ejaculatory duct**. The **urethra** starts at the **urinary bladder** and runs through the **penis** to its external opening, the **urethral meatus**.\n\nAlong this route sit the **accessory glands**: a pair of **seminal vesicles**, a single **prostate**, and a pair of **bulbourethral glands**. Their secretions together make the **seminal plasma**, which is **rich in fructose, calcium, and certain enzymes**; the bulbourethral secretion also **lubricates the penis**. The **penis** itself is the male external genitalia, made of special tissue that allows erection; its enlarged tip, the **glans penis**, is covered by a loose fold of skin called the **foreskin**.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Sectional view of the male pelvis showing the testis in the scrotum, epididymis, vas deferens looping over the bladder, seminal vesicle, prostate, ejaculatory duct, urethra and penis',
      caption: '📸 Tap each dot to explore the male reproductive tract and follow a sperm from the testis to the outside (NCERT Figure 2.1)',
      generation_prompt: "Scientific textbook illustration of the human male reproductive system, diagrammatic sectional (side) view of the male pelvis (NCERT Figure 2.1a style). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions and positions, no baked-in text labels. Show, in correct anatomical arrangement: the paired oval testis held low inside the scrotum pouch (pink/magenta soft-tissue tone); the coiled epididymis along the posterior surface of the testis; the vas deferens as a tube ascending from the epididymis into the abdomen and looping over the top of the urinary bladder; the urinary bladder (blue) above; the seminal vesicle as a sac behind the bladder joining the vas deferens; the prostate gland as a rounded gland surrounding the start of the urethra just below the bladder; the ejaculatory duct where vas deferens and seminal vesicle duct meet; the urethra running from the bladder down through the penis; and the penis with its glans tip. Muted functional colours, thin white leader lines only where structures need pointing out. No photorealism, no cartoon, no mascots, respectful medical-textbook convention.",
      hotspots: [
        { id: uuid(), x: 0.20, y: 0.82, label: 'Testis', icon: 'circle',
          detail: 'The paired male gonad, oval and about **4–5 cm** long. Sperms and male hormones (**androgens**) are made here. It sits *outside* the abdomen so it can stay cool enough for sperm production.' },
        { id: uuid(), x: 0.24, y: 0.92, label: 'Scrotum', icon: 'circle',
          detail: 'The skin pouch that holds the testes outside the body and keeps them **2–2.5 °C cooler** than the core — the low temperature that **spermatogenesis** needs.' },
        { id: uuid(), x: 0.31, y: 0.74, label: 'Epididymis', icon: 'circle',
          detail: 'A coiled duct along the **posterior (back) surface** of each testis. Sperms leaving the testis are **stored and transported** here before moving on.' },
        { id: uuid(), x: 0.42, y: 0.52, label: 'Vas deferens', icon: 'circle',
          detail: 'Carries sperms up from the epididymis into the abdomen, where it **loops over the urinary bladder**. It then receives a duct from the seminal vesicle.' },
        { id: uuid(), x: 0.62, y: 0.40, label: 'Seminal vesicle', icon: 'circle',
          detail: 'A paired accessory gland behind the bladder. Its duct joins the vas deferens to form the **ejaculatory duct**. Its secretion helps make the **fructose-rich seminal plasma**.' },
        { id: uuid(), x: 0.50, y: 0.62, label: 'Prostate', icon: 'circle',
          detail: 'A single accessory gland surrounding the urethra just below the bladder. Its secretion is part of the **seminal plasma** (rich in fructose, calcium and enzymes).' },
        { id: uuid(), x: 0.55, y: 0.72, label: 'Urethra', icon: 'circle',
          detail: 'The final tube. It **originates from the urinary bladder** and runs through the penis to its external opening, the **urethral meatus**. The ejaculatory duct opens into it.' },
        { id: uuid(), x: 0.74, y: 0.80, label: 'Penis', icon: 'circle',
          detail: 'The male external genitalia, made of special tissue that allows erection for **insemination**. Its enlarged tip, the **glans penis**, is covered by a loose fold of skin, the **foreskin**.' },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A boy is born with an undescended testis that stays inside the warm abdominal cavity instead of dropping into the scrotum. Based on what the scrotum does, which outcome would you expect for that testis?",
      options: [
        "Sperm production is impaired, because the testis is now too warm — it lacks the 2–2.5 °C cooling the scrotum normally provides",
        "Sperm production speeds up, because the abdomen supplies more blood and warmth",
        "Nothing changes, because temperature has no effect on the testis",
        "The testis stops making androgens but makes sperms normally",
      ],
      reveal: "The scrotum's whole job is to hold the testes **2–2.5 °C below body core temperature**, and NCERT states this lower temperature is **necessary for spermatogenesis**. A testis trapped in the warm abdomen loses that cooling, so sperm formation is impaired. The tempting trap is 'more warmth helps' — it feels intuitive that warmth speeds biology up, but here the opposite is true: core heat is too hot for making sperms, which is exactly why the body evolved an external pouch.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 7, variant: 'remember', title: 'Lock These Down',
      markdown: "- **Sperm's path, in order:** testis → **epididymis** → **vas deferens** → **ejaculatory duct** → **urethra** → outside (urethral meatus).\n- **Scrotum:** keeps testes **2–2.5 °C cooler** than body core — needed for **spermatogenesis**.\n- **Testis size:** oval, **4–5 cm** long, **2–3 cm** wide.\n- **Ejaculatory duct** = vas deferens + duct from **seminal vesicle**, opening into the **urethra**.\n- **Three accessory glands:** paired **seminal vesicles**, a single **prostate**, paired **bulbourethral glands** → their secretions make the **seminal plasma** (rich in **fructose, calcium, enzymes**).\n- **Urethra** starts at the **urinary bladder** and runs through the **penis**.",
    },
    {
      id: uuid(), type: 'callout', order: 8, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Number of glands:** seminal vesicles are **paired**, the prostate is **single (one)**, bulbourethral glands are **paired**. NEET loves to flip 'prostate is paired' — it is not.\n\n**Ejaculatory duct formation:** vas deferens + duct of the **seminal vesicle** → ejaculatory duct → opens into **urethra**. Swapping in 'prostate' here is the classic wrong option.\n\n**Seminal plasma composition:** **fructose, calcium, and certain enzymes**. Fructose is the one they test — it feeds the sperms.\n\n**Classic NEET question:** \"Why are the testes located in the scrotum outside the abdomen?\" → **to keep them 2–2.5 °C below body temperature, the lower temperature required for spermatogenesis.**",
    },
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "That is the whole male tract — the factory (testis), the cooling pouch (scrotum), the delivery pipeline (epididymis → vas deferens → ejaculatory duct → urethra), and the glands that feed the sperms on their way out. Next we cross over to the female reproductive system, where the design problem is the opposite: not just making gametes, but housing and nourishing a developing baby.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 10, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Why does the scrotum hold the testes outside the abdominal cavity?',
          options: [
            'To keep them at the same temperature as the body core',
            'To keep them 2–2.5 °C cooler than body temperature, which spermatogenesis needs',
            'To warm them 2–2.5 °C above body temperature to speed up sperm formation',
            'To protect them from androgens made inside the abdomen',
          ],
          correct_index: 1,
          explanation: "The scrotum maintains the testes 2–2.5 °C below normal internal body temperature, and that lower temperature is required for spermatogenesis. The 'warmer' option is the trap — core body heat is actually too hot for making sperms, so cooling, not warming, is the point.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Place these structures in the correct order that a sperm travels through them.',
          options: [
            'Testis → vas deferens → epididymis → urethra',
            'Testis → epididymis → urethra → vas deferens',
            'Testis → epididymis → vas deferens → urethra',
            'Testis → urethra → vas deferens → epididymis',
          ],
          correct_index: 2,
          explanation: "Sperms go testis → epididymis (stored along the back of the testis) → vas deferens (loops over the bladder) → and finally the urethra to the outside. The common mistake is swapping epididymis and vas deferens — but the epididymis comes first, right on the testis, before the vas deferens carries sperms up into the abdomen.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'The ejaculatory duct is formed when the vas deferens is joined by a duct from which structure?',
          options: [
            'The prostate gland',
            'The bulbourethral gland',
            'The epididymis',
            'The seminal vesicle',
          ],
          correct_index: 3,
          explanation: "The vas deferens receives a duct from the seminal vesicle, and together they open into the urethra as the ejaculatory duct. The prostate and bulbourethral glands add secretions to the seminal plasma but do not form the ejaculatory duct, and the epididymis lies before the vas deferens, not at this junction.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which set correctly describes the male accessory glands?',
          options: [
            'Paired seminal vesicles, a single prostate, and paired bulbourethral glands',
            'A single seminal vesicle, paired prostates, and a single bulbourethral gland',
            'Paired seminal vesicles, paired prostates, and paired bulbourethral glands',
            'A single seminal vesicle, a single prostate, and a single bulbourethral gland',
          ],
          correct_index: 0,
          explanation: "NCERT lists paired seminal vesicles, one (single) prostate, and paired bulbourethral glands. The number that trips students up is the prostate — it is single, not paired — so any option that pairs the prostate or makes the seminal vesicles single is wrong.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
