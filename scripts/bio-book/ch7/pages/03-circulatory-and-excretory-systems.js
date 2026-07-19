'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'circulatory-and-excretory-systems',
  title: "The Frog's Circulatory and Excretory Systems",
  subtitle: "One frog, three heart chambers, and two portal systems with names that are easy to swap — trace how blood moves through a closed circulation, and how nitrogenous waste leaves through kidneys wired differently for males and females.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['structural-organisation-in-animals', 'frog', 'circulatory-system', 'excretory-system'],
  glossary: [
    { term: 'pericardium', definition: "The membrane that covers and protects the frog's heart." },
    { term: 'sinus venosus', definition: "A triangular structure that joins the right atrium of the frog's heart. It receives blood through the major veins called the vena cava." },
    { term: 'conus arteriosus', definition: "A sac-like structure on the ventral side of the frog's heart, into which the ventricle opens." },
    { term: 'hepatic portal system', definition: 'A special venous connection between the liver and the intestine, present in frogs.' },
    { term: 'renal portal system', definition: 'A special venous connection between the kidney and the lower parts of the body, present in frogs.' },
    { term: 'nephron', definition: "The structural and functional unit of the kidney, also called a uriniferous tubule. Each frog kidney is made of many of these." },
    { term: 'urinogenital duct', definition: "In male frogs, the name for the ureters once they take on a second job — carrying both urine and sperm into the cloaca." },
    { term: 'ureotelic', definition: 'A term for an animal that excretes urea as its nitrogenous waste. The frog is a ureotelic animal.' },
  ],
  blocks: [
    // ── hero ─────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A frog resting at the edge of still water at dusk, with a faint warm inner glow near its chest and flank suggesting its heart and kidneys at work beneath the skin',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single frog rests half-submerged at the edge of still water at dusk, viewed in gentle side profile, its smooth olive-green skin catching soft warm light. Beneath its chest and lower body, a faint warm inner glow is suggested through the skin — never literal or diagram-like, just two soft points of warmth: one near the upper chest hinting at the heartbeat, one lower near the flanks hinting at quiet internal activity. Around the frog, out-of-focus reeds, still water reflecting a dim horizon glow, a few floating droplets. Deep dusk lighting, dark naturalistic background throughout (#0a0a0a base tones). Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    // ── fun_fact ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Two Circulation Systems, Not Just One',
      markdown: "Most people picture a frog's blood running through a single simple loop. NCERT actually gives it two separate systems, running side by side — a **blood vascular system** built from the heart, blood vessels and blood, and a completely separate **lymphatic system** built from lymph, lymph channels and lymph nodes. And inside the blood vascular system itself, the frog adds two special detours you won't find described this plainly elsewhere: one venous route through the liver, and another through the kidney. This page walks through both.",
    },
    // ── heading: heart ───────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 2, level: 2,
      text: "The Frog's Closed Vascular System and Its Three-Chambered Heart",
      objective: "By the end of this you can label every part of the frog's heart and explain what 'closed type' means for its circulation.",
    },
    {
      id: uuid(), type: 'text', order: 3,
      markdown: "The frog's vascular system is well-developed and of the **closed type** — blood travels the entire body inside vessels rather than pooling openly around the organs. The **blood vascular system** is built from three parts: the **heart**, **blood vessels**, and **blood** itself. Running alongside it is the **lymphatic system**, made of **lymph**, **lymph channels**, and **lymph nodes**.\n\nThe **heart** is a muscular structure sitting in the **upper part of the body cavity**. It has **three chambers** — **two atria and one ventricle** — and the whole heart is wrapped in a protective membrane called the **pericardium**.\n\nA small triangular structure called the **sinus venosus** joins the **right atrium**. It receives blood arriving through the major veins called the **vena cava**. On the other side of the heart, the ventricle opens into a sac-like structure called the **conus arteriosus**, sitting on the **ventral side**.",
    },
    // ── interactive image: heart ────────────────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 4, src: '',
      alt: "The frog's three-chambered heart, showing both atria, the ventricle, the pericardium, the sinus venosus with vena cava, and the conus arteriosus",
      caption: '📸 Tap each part of the heart to see what it does',
      generation_prompt: "Scientific textbook illustration of a frog's heart, matching NCERT's frog heart diagram. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A three-chambered heart shown centrally: two rounded atria side by side at the top (left atrium and right atrium), each connecting below into a single larger ventricle. A thin, translucent outline wraps around the entire heart's outer edge representing the pericardium membrane. On the upper right side, a small triangular structure (sinus venosus) joins into the right atrium, with two thin tube-like vessels (vena cava) leading into it from either side. On the lower ventral side of the ventricle, a sac-like tube (conus arteriosus) extends outward, tapering into a vessel. Clean white outlines throughout, biologically accurate proportions, chambers subtly tinted with a muted deep red fill to suggest blood, no baked-in text labels, no photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.38, y: 0.24, label: 'Left atrium', icon: 'circle',
          detail: "One of the heart's two upper chambers — together with the right atrium, the heart has **two atria and one ventricle**." },
        { id: uuid(), x: 0.62, y: 0.24, label: 'Right atrium', icon: 'circle',
          detail: "The atrium the **sinus venosus** joins directly, receiving blood that arrives through the **vena cava**." },
        { id: uuid(), x: 0.8, y: 0.15, label: 'Sinus venosus + vena cava', icon: 'circle',
          detail: "A **triangular structure** that joins the right atrium. It receives blood through the major veins called the **vena cava**." },
        { id: uuid(), x: 0.5, y: 0.55, label: 'Ventricle', icon: 'circle',
          detail: "The heart's single lower chamber. It opens into the **conus arteriosus** on the ventral side of the heart." },
        { id: uuid(), x: 0.3, y: 0.8, label: 'Conus arteriosus', icon: 'circle',
          detail: "A **sac-like structure** on the **ventral side** of the heart, into which the ventricle opens." },
        { id: uuid(), x: 0.14, y: 0.5, label: 'Pericardium', icon: 'circle',
          detail: "The membrane that **covers** the whole heart, protecting all three chambers." },
      ],
    },
    // ── text: arterial/venous + portal systems ──────────────────────────
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "Once blood leaves the heart, the **arteries** carry it out to every part of the body — together, this is the **arterial system**. Coming back the other way, the **veins** collect blood from all over the body and return it to the heart, forming the **venous system**.\n\nFrogs add two special detours to this ordinary route. NCERT calls them **special venous connections** — one between the **liver and the intestine**, and one between the **kidney and the lower parts of the body**. The first is the **hepatic portal system**; the second is the **renal portal system**. Same idea — a special venous connection — but two completely different pairs of organs, which is exactly why the two names get mixed up.",
    },
    // ── comparison_card: hepatic vs renal portal ────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 6, title: 'Hepatic Portal System vs Renal Portal System',
      columns: [
        { heading: 'Hepatic Portal System', points: [
          'Special venous connection between the liver and the intestine',
          'One of the frog\'s two special venous connections',
          'Distinct from the ordinary venous system that returns blood straight to the heart',
        ] },
        { heading: 'Renal Portal System', points: [
          'Special venous connection between the kidney and the lower parts of the body',
          'The frog\'s other special venous connection',
          'Easy to mix up with the hepatic portal system — different organs, different side of the body',
        ] },
      ],
    },
    // ── text: blood composition + lymph ─────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Blood itself is made of two parts: **plasma** (the fluid) and **blood cells**. There are three kinds of blood cells — **RBCs** or **erythrocytes**, **WBCs** or **leucocytes**, and **platelets**. A frog's RBCs are **nucleated**, and they carry a red-coloured pigment called **haemoglobin**.\n\n**Lymph** looks similar to blood but isn't identical to it — it **lacks a few proteins and RBCs** that blood carries. During circulation, blood's job is to carry **nutrients, gases, and water** to wherever the body needs them, and the whole circuit runs on the **pumping action of the muscular heart**.",
    },
    // ── heading: excretory system ────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'The Excretory System — Kidneys, Ureters, and a Fact NEET Tests Both Ways',
      objective: "By the end of this you can trace the path waste takes out of a frog's body — and explain exactly how that path differs between males and females.",
    },
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "Nitrogenous waste leaves the frog's body through a well-developed **excretory system**, made of a pair of **kidneys**, **ureters**, the **cloaca**, and a **urinary bladder**.\n\nThe **kidneys** are **compact, dark red, bean-like structures**, sitting a little towards the back of the body cavity, one on each side of the **vertebral column**. Each kidney is built from many small structural and functional units called **uriniferous tubules**, or **nephrons**.\n\nFrom here the path splits by sex. In **male** frogs, the two **ureters** emerging from the kidneys do double duty — they act as a **urinogenital duct**, opening into the **cloaca**. In **female** frogs, the ureters and the **oviduct** stay completely separate, each opening into the cloaca on its own.\n\nA thin-walled **urinary bladder** sits **ventral to the rectum**, and it too opens into the **cloaca**. The nitrogenous waste the frog actually excretes is **urea** — which makes it a **ureotelic** animal. That waste is carried by the **blood** into the kidney, where it is separated out and excreted.",
    },
    // ── mid-page reasoning check: male vs female urogenital duct ─────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "A question describes a frog's excretory ducts like this: 'the ureters emerging from the kidneys act as a single duct, opening into the cloaca and doing more than one job.' Based only on this detail, what can you correctly conclude about the frog?",
      options: [
        "This must be a male frog — in males, the ureters act as the urinogenital duct; in females, the ureters and oviduct open into the cloaca separately",
        "This must be a female frog — in females, the ureters and oviduct combine into a single duct before reaching the cloaca",
        "The sex cannot be determined — both male and female frogs use their ureters as a combined urinogenital duct",
        "This must be a male frog, but only because male frogs have no urinary bladder, so the ureters are forced to carry everything",
      ],
      correct_index: 0,
      reveal: "NCERT draws this line clearly: in male frogs, the ureters act as the urinogenital duct opening into the cloaca. In female frogs, the ureters and the oviduct open separately into the cloaca instead of combining. So a duct doing double duty is the male pattern. The second option has the sexes backwards — combining is the male trait, not the female one. The third option ignores that NCERT explicitly separates the two sexes on this exact point. And the fourth option invents a reason: NCERT describes a thin-walled urinary bladder as part of the frog's excretory system generally, without saying males lack one.",
      difficulty_level: 3,
    },
    // ── remember ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember', title: 'Lock These In',
      markdown: "- The heart has **three chambers**: two atria + one ventricle, wrapped in the **pericardium**.\n- **Sinus venosus** (triangular, joins right atrium, receives blood via vena cava) sits on one side; **conus arteriosus** (ventral, sac-like) opens from the ventricle on the other.\n- **Hepatic portal system** = liver + intestine. **Renal portal system** = kidney + lower body parts. Don't swap them.\n- Frog **RBCs are nucleated** and carry **haemoglobin**; **lymph lacks a few proteins and RBCs** that blood has.\n- **Male** frogs: ureters double as the **urinogenital duct**. **Female** frogs: ureters and oviduct open **separately** into the cloaca.\n- The frog excretes **urea** — it is a **ureotelic** animal.",
    },
    // ── exam_tip ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Hepatic vs renal portal, don't swap them:** hepatic portal = liver + intestine. Renal portal = kidney + lower body parts. Read which two organs a question names before you answer.\n\n**Male vs female duct question:** in males, the ureters act as a **urinogenital duct**. In females, the ureters and oviduct open **separately** into the cloaca. This exact male-vs-female split is a favourite one-line NEET question.\n\n**Ureotelic = urea, one word, one mark:** if a question asks what nitrogenous waste a frog excretes, or what 'ureotelic' means, the answer is always **urea**.\n\n**Classic NEET question:** \"Which nitrogenous waste does the frog excrete, and what term describes this mode of excretion?\" → Urea; the frog is a ureotelic animal.",
    },
    // ── bridge ────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "You've now followed blood through the frog's heart and waste out through its kidneys. Next comes the system that controls both of them — the frog's nervous and endocrine systems.",
    },
    // ── quiz ──────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Which option correctly matches each heart structure with its actual location or connection?",
          options: [
            'Sinus venosus joins the right atrium and receives blood via the vena cava; conus arteriosus opens from the ventricle on the ventral side',
            'Sinus venosus opens from the ventricle on the ventral side; conus arteriosus joins the right atrium',
            'Both the sinus venosus and the conus arteriosus join directly to the left atrium',
            'Sinus venosus is a chamber of the heart; conus arteriosus is the membrane covering the heart',
          ],
          correct_index: 0,
          explanation: "NCERT places the sinus venosus at the right atrium, receiving blood via the vena cava, and the conus arteriosus at the ventral side of the ventricle. The second option swaps the two structures' locations. The third wrongly attaches both to the left atrium, which neither structure touches. The fourth misnames the sinus venosus as a chamber (the heart has only two atria and one ventricle as chambers) and confuses the conus arteriosus with the pericardium, the actual covering membrane.",
          difficulty_level: 3,
        },
        {
          id: uuid(),
          question: "The renal portal system is a special venous connection between which two parts of a frog's body?",
          options: ['Liver and intestine', 'Kidney and the lower parts of the body', 'Heart and lungs', 'Kidney and liver'],
          correct_index: 1,
          explanation: "NCERT names the renal portal system as the special venous connection between the kidney and the lower parts of the body. Liver-and-intestine is the hepatic portal system instead — a different pair of organs entirely. Heart-and-lungs and kidney-and-liver aren't the two portal connections NCERT describes at all.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "According to NCERT, what is true of a frog's red blood cells (RBCs)?",
          options: [
            'They are nucleated and carry haemoglobin',
            'They lack a nucleus but carry haemoglobin',
            'They are nucleated but lack haemoglobin',
            'They lack both a nucleus and haemoglobin',
          ],
          correct_index: 0,
          explanation: "NCERT states plainly that RBCs are nucleated and contain the red-coloured pigment haemoglobin — both facts hold true together. Each of the other options drops one of those two correct facts.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "What does it mean to say the frog is a 'ureotelic' animal?",
          options: [
            'It excretes urea as its nitrogenous waste',
            'It excretes uric acid as its nitrogenous waste',
            'It excretes ammonia directly without converting it',
            'It does not excrete any nitrogenous waste through the kidneys',
          ],
          correct_index: 0,
          explanation: "NCERT states plainly that 'the frog excretes urea and thus is a ureotelic animal' — urea is the nitrogenous waste it actually excretes, carried by the blood into the kidney and separated out there. The other three options describe excretion patterns that don't match what the text says about the frog.",
          difficulty_level: 1,
        },
      ],
    },
  ],
};
