'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'immunity-innate-and-acquired',
  title: "The Body's Defences — Innate & Acquired Immunity",
  subtitle: "You meet germs every single day but rarely fall sick. This page shows you the two defence systems doing that quiet work — one you were born with, one you build.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['human-health-and-disease', 'immunity', 'innate-immunity', 'acquired-immunity', 'lymphocytes'],
  glossary: [
    { term: 'innate immunity', definition: 'The non-specific defence you are born with. It works the same way against any foreign agent and does not remember past infections.' },
    { term: 'acquired immunity', definition: 'A pathogen-specific defence you build during life. It is characterised by memory, so it responds faster and stronger on a second encounter.' },
    { term: 'interferon', definition: 'Proteins secreted by virus-infected cells that protect the neighbouring non-infected cells from further viral infection. They form the cytokine barrier of innate immunity.' },
    { term: 'B-lymphocyte', definition: 'A type of white blood cell that produces antibodies against pathogens in the blood — the basis of the antibody-mediated (humoral) immune response.' },
    { term: 'T-lymphocyte', definition: 'A type of white blood cell that carries out the cell-mediated immune response. T-cells do not make antibodies themselves but help B-cells make them, and they cause graft rejection.' },
    { term: 'antibody', definition: 'A protein made by B-lymphocytes to fight a specific pathogen. Each molecule has four peptide chains — two light and two heavy — so it is written as H2L2.' },
    { term: 'primary response', definition: 'The low-intensity immune response the body produces the first time it meets a particular pathogen.' },
    { term: 'secondary response', definition: 'The highly intensified (anamnestic) response produced on a later encounter with the same pathogen, thanks to immune memory.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A human figure at dusk standing calm inside a soft protective glow while dim shapes of microbes drift around the edge, unable to get through',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single dark, atmospheric composition at dusk: a calm human figure in soft silhouette stands at the centre, wrapped in a quiet warm protective glow like a thin shield of light around the skin. Around the outer edges of the frame, faint dim shapes of microbes — rod-shaped bacteria, a spiky virus, a droplet of contaminated air — drift toward the figure but stall at the glowing boundary, kept out. Deep dusk lighting, painterly and naturalistic, dark background overall (#0a0a0a base tones), warm amber rim-light on the shield. No text, no labels, no diagram elements, no arrows.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'You Are Under Attack Right Now — And Winning',
      markdown: "Think about your morning so far. You breathed dusty air, touched a doorknob, drank water, rubbed your eyes. Every one of those moments poured **infectious agents** onto and into your body. Yet you are not sick. That is not luck. The skin held the line, stomach acid dissolved what you swallowed, tears washed your eyes, and hidden cells patrolled your blood swallowing anything that slipped through. Your body fights off almost every one of these attacks so quietly that you never even notice the battle. This whole page is about *how* it wins.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Every day we are exposed to a large number of infectious agents, but only a few of these exposures actually turn into disease. Why? Because the body can defend itself against most foreign agents. This overall ability of the host to fight off disease-causing organisms, given to us by the **immune system**, is called **immunity**.\n\nImmunity comes in two forms, and you must keep them clearly apart:\n\n- **Innate immunity** — the defence you are **born with**. It is **non-specific**: it treats every intruder the same way and keeps no memory of them.\n- **Acquired immunity** — the defence you **build up during life**. It is **pathogen-specific** and it **remembers**.\n\nWe'll take them one at a time.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Innate Immunity — The Four Barriers You Were Born With',
      objective: 'By the end of this you can name all four innate barriers and drop any given example — skin, stomach acid, a neutrophil, an interferon — into the right one.',
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Innate immunity** is the **non-specific** type of defence that is **present at the time of birth**. It does its job by putting up different kinds of **barriers** to stop foreign agents from entering the body. NCERT groups these into **four types of barriers** — and this list of four is a favourite NEET target, so learn each one with its own examples:\n\n1. **Physical barriers** — the walls. The **skin** is the main one, keeping micro-organisms out. The **mucus coating** lining the respiratory, gastrointestinal and urogenital tracts traps microbes that get in through those openings.\n2. **Physiological barriers** — the chemistry. **Acid in the stomach**, **saliva in the mouth**, and **tears from the eyes** all create conditions that prevent microbial growth.\n3. **Cellular barriers** — the soldiers. Certain white blood cells (leukocytes) swallow and destroy microbes: **PMNL-neutrophils** (polymorpho-nuclear leukocytes) and **monocytes** in the blood, **natural killer (NK) cells** (a type of lymphocyte) in the blood, and **macrophages** in the tissues. They **phagocytose** — literally eat — the invaders.\n4. **Cytokine barriers** — the alarm. When a cell is infected by a virus, it secretes proteins called **interferons**. These interferons protect the surrounding **non-infected cells** from further viral infection.\n\nNotice the pattern: a wall, a chemical, a cell that eats, and a warning signal. None of them ask *which* germ they are dealing with — that is what 'non-specific' means.",
    },
    {
      id: uuid(), type: 'table', order: 5,
      caption: '📸 The four barriers of innate immunity — the exact examples NCERT gives',
      headers: ['Barrier', 'What it is', 'NCERT examples'],
      rows: [
        ['Physical', 'Structures that physically block entry', 'Skin; mucus coating of respiratory, GI and urogenital tracts'],
        ['Physiological', 'Chemical conditions that stop microbial growth', 'Acid in the stomach; saliva in the mouth; tears from the eyes'],
        ['Cellular', 'WBCs that phagocytose (eat) microbes', 'PMNL-neutrophils; monocytes; NK cells (blood); macrophages (tissues)'],
        ['Cytokine', 'Signalling proteins from infected cells', 'Interferons secreted by virus-infected cells, protecting nearby cells'],
      ],
    },
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Acquired Immunity — The Defence That Remembers',
      objective: 'By the end of this you can explain primary vs secondary response, and split the two lymphocytes cleanly: B makes antibodies, T runs cell-mediated immunity.',
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "**Acquired immunity** is **pathogen-specific**, and its defining feature is **memory**. Here is the story it tells:\n\nWhen your body meets a pathogen **for the first time**, it puts out a **primary response** — and this first response is of **low intensity**. But your body files the experience away. On a **later encounter with the same pathogen**, it hits back with a **highly intensified secondary (or anamnestic) response**. Same germ, second meeting, a much bigger and faster reply — because the body now *remembers* the first encounter.\n\nBoth responses are carried out by two special types of **lymphocytes** in your blood — **B-lymphocytes** and **T-lymphocytes** — and this is the split NEET loves to test:\n\n- **B-lymphocytes** produce an army of proteins called **antibodies** that pour into the blood to fight the pathogens. Because these antibodies travel in the blood (the 'humour'), this is the **antibody-mediated** or **humoral immune response**. Each antibody molecule has **four peptide chains — two short light chains and two longer heavy chains** — so it is written as **H₂L₂** (types include IgA, IgM, IgE, IgG).\n- **T-lymphocytes** run the **cell-mediated immune response (CMI)**. The T-cells themselves **do not secrete antibodies** — instead they **help the B-cells** make them, and they carry out cell-mediated defence directly. It is this cell-mediated response that lets the body tell **'self' from 'non-self'**, which is exactly why a transplanted **graft gets rejected** unless the tissue is carefully matched.\n\nSo remember the one-line split: **B = antibodies (humoral); T = cell-mediated (CMI)**. Once you're solid on that, the next page moves from the immunity you *make yourself* to immunity that can be *handed to you ready-made* — active versus passive immunity.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 8, title: 'Innate vs Acquired Immunity',
      columns: [
        { heading: 'Innate Immunity',
          points: [
            'Non-specific — same response to every foreign agent',
            'Present at the time of birth',
            'No memory — reacts the same way each time',
            'Works through four barriers: physical, physiological, cellular, cytokine',
            'Front-line, general defence (skin, acid, neutrophils, interferons)',
          ] },
        { heading: 'Acquired Immunity',
          points: [
            'Pathogen-specific — tailored to the exact pathogen',
            'Built up during life, after exposure',
            'Characterised by memory — primary then a stronger secondary response',
            'Carried out by B- and T-lymphocytes',
            'Two arms: antibody-mediated (humoral, B-cells) and cell-mediated (CMI, T-cells)',
          ] },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A child gets chickenpox at age 5 and recovers. Years later the same virus enters her body again, but this time she barely notices — the response is far faster and stronger than the first time. What explains this second, more powerful response?",
      options: [
        "Her innate barriers (skin, mucus, acid) grew thicker with age and now block the virus completely",
        "Acquired immunity has memory — the first infection produced a primary response, and the same pathogen now triggers a highly intensified secondary (anamnestic) response",
        "Her interferons multiplied after the first infection and permanently coat all her cells",
        "The virus became weaker on its own, so the second infection was naturally milder",
      ],
      reveal: "The key is **memory**, the defining feature of **acquired** immunity. The first infection was the **primary response** (low intensity); because the body remembers that encounter, meeting the same pathogen again triggers the **secondary / anamnestic response**, which is faster and much stronger. Option A is the tempting trap — but **innate** immunity is non-specific and has **no memory**, so thicker barriers would not explain a *faster, stronger* reply to *that specific* virus. Interferons act during an active viral infection to protect nearby cells; they don't give lasting memory. And nothing in NCERT says the virus itself weakens.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'Lock These In Before the Exam',
      markdown: "**The four innate barriers, in order — Physical, Physiological, Cellular, Cytokine:**\n> **P**lease **P**rotect **C**ells **C**arefully — P-P-C-C.\n- **Physical** = skin, mucus (walls)\n- **Physiological** = stomach acid, saliva, tears (chemistry)\n- **Cellular** = PMNL-neutrophils, monocytes, NK cells, macrophages (cells that eat microbes)\n- **Cytokine** = interferons from virus-infected cells (alarm signal)\n\n**The lymphocyte split you must never swap:**\n- **B-lymphocyte = antiBody-mediated** (humoral) response.\n- **T-lymphocyte = cell-mediated** immunity (CMI) — and the reason grafts get rejected.\n\n**Innate = born with it, non-specific, no memory. Acquired = built in life, pathogen-specific, has memory (primary → secondary).**",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**The four-barrier list (verbatim):** physical, physiological, cellular, cytokine. NEET loves to mis-file an example — e.g. calling interferons a 'cellular' barrier (they're **cytokine**) or calling stomach acid a 'physical' barrier (it's **physiological**). Match each example to its barrier exactly as NCERT does.\n\n**NK cells are a trap:** natural killer cells are part of the **cellular** barrier of **innate** immunity — even though they are a type of lymphocyte, they are not the acquired-immunity B/T lymphocytes.\n\n**B vs T (one-mark lift):** B-lymphocytes → antibodies → **humoral / antibody-mediated**; T-lymphocytes → **cell-mediated immunity (CMI)** and **graft rejection**. Remember: **T-cells do NOT secrete antibodies** — they help B-cells do it.\n\n**Antibody structure:** four peptide chains — two light + two heavy = **H₂L₂**.\n\n**Classic NEET question:** \"Interferons are secreted by virus-infected cells and protect which cells?\" → the **non-infected (neighbouring) cells** from further viral infection.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'Acid in the stomach, saliva in the mouth, and tears in the eyes belong to which barrier of innate immunity?',
          options: [
            'Physical barriers',
            'Physiological barriers',
            'Cellular barriers',
            'Cytokine barriers',
          ],
          correct_index: 1,
          explanation: 'Stomach acid, saliva and tears are chemical conditions that prevent microbial growth, so they are physiological barriers. Physical barriers are structural blocks like skin and mucus; cellular barriers are microbe-eating WBCs (neutrophils, macrophages); cytokine barriers are the interferons — so those three are the wrong file for acid/saliva/tears.',
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'Which statement correctly separates the two lymphocytes of acquired immunity?',
          options: [
            'T-lymphocytes secrete antibodies, while B-lymphocytes carry out cell-mediated immunity',
            'Both B- and T-lymphocytes secrete antibodies into the blood',
            'B-lymphocytes produce antibodies (humoral response), while T-lymphocytes carry out cell-mediated immunity',
            'B-lymphocytes cause graft rejection, while T-lymphocytes make interferons',
          ],
          correct_index: 2,
          explanation: 'B-lymphocytes make antibodies — the antibody-mediated (humoral) response — while T-lymphocytes run cell-mediated immunity (CMI). The first option reverses the two, which is the most tempting trap. T-cells do NOT secrete antibodies (they help B-cells make them), so the "both secrete antibodies" option is false, and graft rejection is a T-cell (CMI) job, not a B-cell one.',
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'Interferons, which protect non-infected cells from further viral infection, are the basis of which innate barrier?',
          options: [
            'Cytokine barriers',
            'Physical barriers',
            'Cellular barriers',
            'Physiological barriers',
          ],
          correct_index: 0,
          explanation: 'Interferons are proteins secreted by virus-infected cells and make up the cytokine barrier. A common trap is to call them a cellular barrier because cells release them — but the cellular barrier refers to phagocytic WBCs (neutrophils, monocytes, NK cells, macrophages), not the signalling proteins themselves.',
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'The second time the body meets the same pathogen, it produces a much stronger, faster reply. This highly intensified secondary response is possible because acquired immunity is characterised by:',
          options: [
            'Non-specificity',
            'Being present at birth',
            'The four physical and chemical barriers',
            'Memory',
          ],
          correct_index: 3,
          explanation: 'Acquired immunity is characterised by memory: the low-intensity primary response on first contact leaves the body "remembering" the pathogen, so the same pathogen later triggers the highly intensified secondary (anamnestic) response. Non-specificity and being present at birth describe innate immunity, and the four barriers are the innate system — none of which has memory.',
          difficulty_level: 1,
        },
      ],
    },
  ],
};
