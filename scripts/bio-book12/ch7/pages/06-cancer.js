'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'cancer',
  title: 'Cancer — When Cells Forget to Stop',
  subtitle: "Every cell in your body knows when to stop dividing. Cancer is what happens when a cell forgets that rule — and the difference between a lump that sits still and one that spreads is the whole story of this topic.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['cancer', 'tumour', 'metastasis', 'carcinogen', 'human-health-and-disease'],
  glossary: [
    { term: 'contact inhibition', definition: 'A property of normal cells by which touching neighbouring cells stops their uncontrolled growth. Cancer cells lose this property.' },
    { term: 'tumor', definition: 'A mass of cells formed when cells lose control over growth and keep dividing. Tumours are of two kinds — benign and malignant.' },
    { term: 'benign tumor', definition: 'A tumour that stays confined to its original location, does not spread to other parts of the body, and causes little damage.' },
    { term: 'malignant tumor', definition: 'A mass of rapidly dividing neoplastic (tumour) cells that invades and damages surrounding tissue and can spread to distant sites.' },
    { term: 'metastasis', definition: 'The spread of cancer when cells sloughed off a malignant tumour travel through the blood, lodge at distant sites, and start new tumours there. It is the most feared property of malignant tumours.' },
    { term: 'carcinogen', definition: 'A physical, chemical or biological agent that transforms a normal cell into a cancerous (neoplastic) cell.' },
    { term: 'oncogene', definition: 'A cancer-causing gene. Oncogenic viruses carry viral oncogenes; normal cells carry cellular oncogenes (proto-oncogenes) that can turn cancerous when activated.' },
    { term: 'proto-oncogene', definition: 'A cellular oncogene (c-onc) present in normal cells which, when activated under certain conditions, could lead to the oncogenic transformation of the cell.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark landscape where an orderly field of soft points suddenly breaks into a chaotic, spreading cluster on one side',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A vast dark dusk plain covered in a calm, evenly spaced grid of faint soft points of light, orderly and restful, filling most of the frame. Toward the right side the neat pattern breaks down: the points crowd together, pile up and spill outward into a dense, unruly cluster that pushes past its boundary, with a few stray points drifting away from the mass toward the far edge as if carried off. No cells, germs or medical objects are literally depicted — only this quiet shift from order to overgrowth suggested through spacing and density. Deep dusk lighting, painterly atmospheric illustration style, dark background tones throughout (#0a0a0a base), no text, no labels, no diagram elements, no faces.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'A Million Indians, and Counting',
      markdown: "Cancer is one of the most dreaded diseases of human beings and a major cause of death across the whole world. **More than a million Indians** suffer from cancer, and a large number of them die from it every year. Because of that, the mechanisms behind how cancer develops, and how to treat and control it, have become some of the most intense areas of research in all of biology and medicine.",
    },
    {
      id: uuid(), type: 'heading', order: 2, level: 2,
      text: 'The Rule Every Cell Obeys — and Cancer Breaks',
      objective: "By the end of this you can explain what contact inhibition is, why losing it produces a tumour, and what separates a benign tumour from a malignant one.",
    },
    {
      id: uuid(), type: 'text', order: 3,
      markdown: "In a healthy body, cell growth and differentiation is **highly controlled and regulated** — cells divide only when and where they should. In cancer cells, that whole system of control breaks down.\n\nThe key rule is called **contact inhibition**. Normal cells, by virtue of this property, stop their own uncontrolled growth the moment they come into **contact with other cells**. Think of it as cells saying, 'my neighbour is here, I'll stop now.' **Cancer cells appear to have lost this property.** With the brakes gone, they just keep dividing, one cell becoming two, two becoming four, on and on, until they pile up into masses of cells called **tumors**.\n\nNot every tumour is equally dangerous. Tumours come in two types — **benign** and **malignant** — and the whole seriousness of a cancer depends on which one it is. A **benign tumor** normally stays put: it remains confined to its original location, does not spread to other parts of the body, and causes little damage. A **malignant tumor** is a very different threat. It is a mass of rapidly proliferating cells — called **neoplastic** or **tumor cells** — that grow fast, **invading and damaging the surrounding normal tissues**, and even starving nearby normal cells by competing with them for vital nutrients.\n\nThe most feared thing a malignant tumour does is spread. Cells break off — 'sloughed' — from the tumour, travel through the **blood** to distant parts of the body, and wherever they lodge, they start a brand-new tumour there. This property of spreading to distant sites is called **metastasis**, and it is the single most feared property of malignant tumours.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 4, src: '',
      alt: 'Diagram showing normal cells with contact inhibition, a cancer cell that has lost it forming a tumour, and cells breaking off into a blood vessel to form a secondary tumour (metastasis)',
      caption: '📸 Tap each dot to follow how a normal cell turns cancerous and how metastasis spreads it',
      hotspots: [
        { id: uuid(), x: 0.15, y: 0.45, label: 'Normal cells — contact inhibition', icon: 'circle',
          detail: 'A tidy, evenly spaced sheet of normal cells. Because contact with neighbouring cells inhibits their growth, they **stop dividing** once they touch each other. Growth here is controlled and regulated.' },
        { id: uuid(), x: 0.40, y: 0.40, label: 'Loss of contact inhibition', icon: 'circle',
          detail: 'One cell has **lost contact inhibition**. Its growth is no longer switched off by its neighbours, so it keeps dividing when it should have stopped — the first step toward a tumour.' },
        { id: uuid(), x: 0.58, y: 0.62, label: 'Tumor (malignant)', icon: 'circle',
          detail: 'The uncontrolled division builds a **mass of cells — a tumour**. In a malignant tumour these neoplastic cells grow rapidly, invade and damage surrounding normal tissue, and starve nearby cells by competing for nutrients.' },
        { id: uuid(), x: 0.78, y: 0.50, label: 'Cells enter the blood', icon: 'circle',
          detail: 'Cells **slough off** the malignant tumour and get into the **blood**, which carries them away to distant parts of the body. Benign tumours do not do this — they stay in their original location.' },
        { id: uuid(), x: 0.90, y: 0.72, label: 'Secondary tumor — metastasis', icon: 'circle',
          detail: 'Wherever the travelling cells lodge, they **start a new tumour**. This spread to distant sites is **metastasis** — the most feared property of malignant tumours.' },
      ],
      generation_prompt: "Scientific textbook illustration showing the progression from a normal tissue to metastatic cancer. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Left third: an orderly sheet of evenly spaced rounded cells (pink/magenta soft-tissue fill) packed neatly together to show contact inhibition. Middle third: the same sheet with one cell breaking the pattern and dividing into a growing irregular clump — a tumour mass of crowded, disorganised cells pushing into the surrounding tissue. Right third: a red blood vessel running across the frame, with a few tumour cells detaching from the mass and entering the vessel, and downstream a small new clump of the same cells lodged at a distant site forming a secondary tumour. Clean white outlines, thin white leader lines but no baked-in text labels, biologically accurate cell proportions. Functional colours: pink/magenta for cells, red for the blood vessel. No photorealism, no cartoon, no mascots.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 5, title: 'Benign vs Malignant tumour',
      columns: [
        { heading: 'Benign tumor', points: [
          'Normally **remains confined to its original location**',
          '**Does not spread** to other parts of the body',
          'Causes **little damage**',
          'No metastasis — cells do not travel to distant sites',
        ] },
        { heading: 'Malignant tumor', points: [
          'A mass of **rapidly proliferating** neoplastic (tumour) cells',
          '**Invades and damages** the surrounding normal tissues',
          '**Starves** normal cells by competing for vital nutrients',
          'Cells sloughed off spread through **blood** and start new tumours — **metastasis**, its most feared property',
        ] },
      ],
    },
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'What Turns a Normal Cell Cancerous',
      objective: "By the end of this you can name the three kinds of carcinogens with an example of each, and tell a viral oncogene apart from a cellular proto-oncogene.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "The change of a normal cell into a cancerous neoplastic cell can be triggered by **physical, chemical or biological agents**. These agents are called **carcinogens**. NCERT gives you one clear example of each:\n\n- **Physical carcinogens:** **Ionising radiations** like X-rays and gamma rays, and **non-ionising radiation** like UV. All of these cause **DNA damage**, leading to neoplastic transformation.\n- **Chemical carcinogens:** the chemicals present in **tobacco smoke** — identified as a **major cause of lung cancer**.\n- **Biological carcinogens:** cancer-causing viruses called **oncogenic viruses**, which carry genes called **viral oncogenes**.\n\nThere is one more piece, and it comes from inside our own cells. Several genes called **cellular oncogenes (c-onc)** — also known as **proto-oncogenes** — are present in normal cells. On their own they are harmless. But when they are **activated under certain conditions**, they can push the cell into oncogenic transformation, turning it cancerous. So cancer isn't always an outside invader; sometimes it's a gene we already carry, switched on at the wrong time.",
    },
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'Catching It Early, and Fighting Back',
      objective: "By the end of this you can list how cancers are detected and the main ways they are treated, including what α-interferon does.",
    },
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "**Detecting cancer.** Catching a cancer early matters enormously, because early detection is what lets many cancers be treated successfully. Detection rests on a few methods:\n\n- **Biopsy and histopathological studies:** a piece of the suspected tissue is cut into thin sections, stained, and examined under a microscope by a **pathologist**.\n- **Blood and bone marrow tests:** used to spot increased cell counts, as in **leukemias**.\n- **Radiography (X-rays), CT and MRI:** very useful for cancers of the **internal organs**. **CT (computed tomography)** uses X-rays to build a three-dimensional image of the inside of the body; **MRI (magnetic resonance imaging)** uses strong magnetic fields and non-ionising radiations to detect changes in living tissue.\n- **Antibodies** against **cancer-specific antigens** are also used to detect certain cancers. Molecular biology can even find the genes that make some people inherit a susceptibility to particular cancers.\n\n**Treating cancer.** The common approaches are **surgery, radiotherapy, chemotherapy and immunotherapy**. In **radiotherapy**, tumour cells are irradiated lethally while taking proper care of the surrounding normal tissue. In **chemotherapy**, drugs are used to kill cancerous cells — some are specific for particular tumours, and many have side effects like hair loss and anaemia. Most cancers are treated with a **combination** of surgery, radiotherapy and chemotherapy. Finally, because tumour cells manage to avoid being detected and destroyed by the immune system, patients are given **biological response modifiers such as α-interferon**, which activates their own immune system and helps it destroy the tumour. That last idea — turning the body's defences back on the cancer — carries us straight into how drugs and alcohol, our next topic, do the opposite and wear those defences down.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "Two patients each have a tumour of the same size. One tumour stays exactly where it started; the other keeps shedding cells that turn up in the lungs, liver and bone. Why is the second patient's cancer far more dangerous?",
      options: [
        "Because a benign tumour divides faster than a malignant one",
        "Because its cells slough off, spread through the blood and start new tumours at distant sites — metastasis",
        "Because staying in one location lets a tumour damage more tissue than one that spreads",
        "Because only malignant tumours are made of cells, while benign ones are not",
      ],
      reveal: "The second tumour is malignant: its cells break off, travel through the blood, and seed new tumours far from the original site. That spread — metastasis — is the most feared property of malignant tumours, because you can no longer remove or irradiate a single lump. The tempting wrong answer is the third one: it sounds sensible that 'staying put' is worse, but the opposite is true — a benign tumour that stays confined causes little damage, while it is precisely the spreading that makes malignancy deadly. Benign tumours do not divide faster, and both kinds of tumour are of course made of cells.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember', title: 'Lock These Three Down',
      markdown: "- **Contact inhibition** — normal cells stop dividing when they touch other cells; **cancer cells lose this property** and keep dividing into tumours.\n- **Metastasis** — malignant tumour cells slough off, spread through the **blood**, and start new tumours at distant sites. The **most feared** property of malignant tumours. Benign tumours do **not** metastasise.\n- **Proto-oncogene (cellular oncogene, c-onc)** — a normal cellular gene that, when **activated**, can cause cancer. Don't confuse it with the **viral oncogene** carried by oncogenic viruses.",
    },
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Benign vs malignant:** benign = confined, no spread, little damage. Malignant = invades, competes for nutrients, metastasises. NEET loves swapping these — 'benign tumours spread to distant organs' is a classic wrong option.\n\n**Carcinogen types:** physical = ionising (X-rays, gamma rays) and non-ionising (UV) radiation → DNA damage; chemical = tobacco smoke → lung cancer; biological = oncogenic viruses with viral oncogenes. Memorise one example per type.\n\n**Oncogene trap:** viral oncogene = in the virus. Cellular oncogene / proto-oncogene (c-onc) = already in your normal cells, dangerous only when activated.\n\n**Classic NEET question:** \"The most feared property of malignant tumours is __?\" → **metastasis** (spread to distant sites via blood). And \"α-interferon is used in cancer as a __?\" → **biological response modifier that activates the immune system** (immunotherapy).",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Normal cells stop dividing when they come into contact with neighbouring cells. What is this property called, and what happens to it in cancer cells?',
          options: [
            'Metastasis; cancer cells gain it',
            'Contact inhibition; cancer cells lose it',
            'Neoplastic transformation; cancer cells strengthen it',
            'Histopathology; cancer cells keep it unchanged',
          ],
          correct_index: 1,
          explanation: "The property is contact inhibition, and cancer cells appear to have lost it, so they keep dividing into tumours. Metastasis is the spread of a malignant tumour, not the stop-on-contact rule; neoplastic transformation is the change of a normal cell into a cancer cell, not the property being described; and histopathology is a detection method, not a growth property.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Which statement correctly describes a benign tumour?',
          options: [
            'It sheds cells that travel through blood to start new tumours elsewhere',
            'It invades and damages surrounding normal tissues',
            'It normally remains confined to its original location and causes little damage',
            'It is a mass of rapidly proliferating neoplastic cells that starve normal cells',
          ],
          correct_index: 2,
          explanation: "A benign tumour stays confined to its original location, does not spread, and causes little damage. The other three options all describe a malignant tumour — spreading through blood (metastasis), invading surrounding tissue, and being a mass of proliferating neoplastic cells that compete for nutrients — which is exactly the contrast NEET tests.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Tobacco smoke has been identified as a major cause of lung cancer. Under which type of carcinogen does it fall?',
          options: [
            'Physical carcinogen',
            'Biological carcinogen',
            'Chemical carcinogen',
            'Viral oncogene',
          ],
          correct_index: 2,
          explanation: "The cancer-causing chemicals in tobacco smoke are chemical carcinogens, and NCERT names them as a major cause of lung cancer. Physical carcinogens are the radiations (X-rays, gamma rays, UV); biological carcinogens are the oncogenic viruses; and a viral oncogene is a gene carried by those viruses, not a category of carcinogen.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Cancer patients are sometimes given α-interferon. What is its role in treatment?',
          options: [
            'It is a chemotherapeutic drug that directly kills tumour cells',
            'It is a biological response modifier that activates the immune system to destroy the tumour',
            'It irradiates tumour cells lethally while sparing normal tissue',
            'It is an antibody used only to detect cancer-specific antigens',
          ],
          correct_index: 1,
          explanation: "α-interferon is a biological response modifier: since tumour cells avoid the immune system, it activates the patient's own immune system so it can destroy the tumour — this is immunotherapy. It is not a chemotherapy drug (those are separate chemicals that kill cells), not radiotherapy (that is lethal irradiation), and although antibodies against cancer-specific antigens are used for detection, α-interferon is used for treatment, not detection.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
