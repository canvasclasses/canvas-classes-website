'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'transgenic-animals',
  title: 'Transgenic Animals',
  subtitle: "An animal carrying an extra, foreign gene — and the five jobs we build them for, from mapping disease to a cow whose milk suits human babies.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['biotechnology-and-its-applications', 'transgenic-animals', 'rosie', 'disease-models', 'vaccine-safety'],
  glossary: [
    { term: 'transgenic animal', definition: 'An animal whose DNA has been manipulated to possess and express an extra, foreign gene. Transgenic rats, rabbits, pigs, sheep, cows and fish have been made, but over 95% of all existing transgenic animals are mice.' },
    { term: 'foreign gene', definition: 'A piece of DNA introduced from another source (often another species) into an animal, which the animal then carries and expresses along with its own genes.' },
    { term: 'disease model', definition: 'A transgenic animal specially made to carry genes that make it develop a human disease — such as cancer, cystic fibrosis, rheumatoid arthritis or Alzheimer\'s — so new treatments can be studied on it.' },
    { term: 'alpha-1-antitrypsin', definition: 'A human protein used to treat emphysema (a lung disease). A transgenic animal carrying the gene that codes for it can produce this biological product.' },
    { term: 'Rosie', definition: 'The first transgenic cow, produced in 1997. Her milk was enriched with the human protein alpha-lactalbumin (2.4 g per litre), making it a nutritionally more balanced food for human babies than natural cow-milk.' },
    { term: 'vaccine safety testing', definition: 'Using transgenic mice to check that a vaccine (for example, the polio vaccine) is safe before it is given to humans — potentially replacing the use of monkeys.' },
    { term: 'toxicity / chemical safety testing', definition: 'Exposing transgenic animals — deliberately made more sensitive to toxic substances than normal animals — to a chemical and studying the effects, which gives results in less time.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single white laboratory mouse in a pool of warm light against deep darkness',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single small white laboratory mouse sitting alert in a narrow pool of warm amber light, the rest of the frame falling away into deep, soft darkness (#0a0a0a base tones). A faint, almost invisible suggestion of a delicate DNA double-helix motif woven into the shadows behind it, as if the animal itself were quietly redrawn at the genetic level. Quiet, thoughtful, slightly reverent mood — this small creature carries an extra human gene. Painterly, atmospheric illustration style, naturalistic dark background, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: "Rosie the Cow Gave 'Human' Milk",
      markdown: "In 1997 scientists made the first transgenic cow and named her **Rosie**. What made her special was her milk. An ordinary cow's milk is made for calves, not for human babies. Rosie carried an extra human gene, so her milk contained a **human protein — alpha-lactalbumin** — at about **2.4 grams per litre**. That single human ingredient made her milk **nutritionally more balanced for human babies** than natural cow-milk. A cow, quietly producing a protein written in the human recipe book.",
    },
    {
      id: uuid(), type: 'heading', order: 2, level: 2,
      text: 'What Makes an Animal "Transgenic"',
      objective: 'Say exactly what the extra gene is, what "express" adds beyond "possess", and why almost every transgenic animal you meet is a mouse.',
    },
    {
      id: uuid(), type: 'text', order: 3,
      markdown: "Take a normal animal, slip an **extra gene from outside** into its DNA, and let that animal not just *hold* the gene but actually **use it** — that animal is now a **transgenic animal**. NCERT's definition packs in two verbs on purpose: the animal has been manipulated to **possess and express** an extra (foreign) gene. Possess means the gene is there in its DNA; express means the gene is switched on and making its product. Both are needed — a silent, unused gene wouldn't help anyone.\n\nMany kinds have been made — **transgenic rats, rabbits, pigs, sheep, cows and fish**. But if you had to bet on which animal a lab is working with, bet on the mouse: **over 95 per cent of all existing transgenic animals are mice**. So the picture to hold in your head is a small white mouse carrying one borrowed gene, doing a job for us.",
    },
    {
      id: uuid(), type: 'heading', order: 4, level: 2,
      text: 'The Five Jobs We Build Them For',
      objective: 'Match each of NCERT\'s five uses to its one signature example — the exact grid NEET turns into a match-the-column.',
    },
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "NCERT gives **five** reasons we make transgenic animals, and each one comes with a specific example worth locking down.\n\n**1. Normal physiology and development.** They let us study **how genes are regulated** and how they shape the body's normal working and growth — the textbook example is the study of **insulin-like growth factor**, by introducing genes from other species that change how this factor forms and watching the biological effect.\n\n**2. Study of disease.** Many are built to act as **models for human diseases**, so new treatments can be tried on them. NCERT names four such diseases outright: **cancer, cystic fibrosis, rheumatoid arthritis and Alzheimer's**.\n\n**3. Biological products.** Medicines can contain **biological products** that are expensive to make. Put in the gene that codes for the product and the animal makes it for you — the example is the human protein **alpha-1-antitrypsin, used to treat emphysema** (with similar attempts for phenylketonuria and cystic fibrosis). This is also **Rosie's** category.\n\n**4. Vaccine safety.** **Transgenic mice** are used to **test the safety of vaccines** before humans get them — specifically the **polio vaccine** — and could replace the use of monkeys.\n\n**5. Chemical safety (toxicity) testing.** Animals are made **more sensitive to toxic substances** than normal, then exposed to a chemical so the effects show up **in less time**.\n\nRead the table below across, not down — each use has its own signature example.",
    },
    {
      id: uuid(), type: 'table', order: 6,
      caption: 'NCERT §10.3 — the five uses of transgenic animals, each with its signature example',
      headers: ['Use', 'What it is for', 'NCERT example'],
      rows: [
        ['Normal physiology & development', 'Study how genes are regulated and affect normal body function and growth', 'Insulin-like growth factor'],
        ['Study of disease', 'Serve as models for human diseases so new treatments can be investigated', "Cancer, cystic fibrosis, rheumatoid arthritis, Alzheimer's"],
        ['Biological products', 'Carry a gene that codes for a useful protein, so the animal makes the medicine', 'Human alpha-1-antitrypsin (for emphysema); Rosie the cow — human alpha-lactalbumin in milk (1997)'],
        ['Vaccine safety', 'Transgenic mice test that a vaccine is safe before use on humans', 'Polio vaccine (could replace monkeys)'],
        ['Chemical safety (toxicity) testing', 'Made more sensitive to toxins, then exposed, so effects show faster', 'Toxicity / safety testing of substances'],
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
      prompt: "A lab wants to check whether a new batch of polio vaccine is safe before giving it to children, and it wants to move away from using monkeys. Why is a transgenic mouse the sensible choice here?",
      options: [
        'The mouse has been given a gene that makes it develop the disease, so it can be used as a living, human-like test system that reacts to the vaccine',
        'The mouse produces the polio vaccine in its milk, so no separate manufacturing is needed',
        'The mouse is naturally immune to every human virus, so any reaction proves the vaccine is faulty',
        'The mouse is cheaper than a monkey, and cost is the only reason NCERT gives',
      ],
      correct_index: 0,
      reveal: "NCERT places vaccine-safety testing with disease modelling for a reason: a transgenic mouse can be engineered to carry the relevant human gene so it responds like a human test system, letting us check the vaccine's safety before humans are exposed — and potentially replace monkeys. It does not *make* the vaccine (that is the 'biological products' use, a different category). Mice are not 'naturally immune to every virus'. And while replacing monkeys is real, NCERT's stated point is safety testing, not cost alone.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 8, variant: 'remember', title: "Lock These Down",
      markdown: "- **Transgenic animal** = DNA manipulated to **possess AND express** an extra (foreign) gene.\n- **Over 95% are mice** — many kinds exist (rats, rabbits, pigs, sheep, cows, fish), but the mouse dominates.\n- **The five uses:** (1) normal physiology & development, (2) study of disease, (3) biological products, (4) vaccine safety, (5) chemical (toxicity) safety testing. Mnemonic: **P**hysiology, **D**isease, **P**roducts, **V**accine, **T**oxicity.\n- **Rosie** = first **transgenic cow, 1997** → milk with human **alpha-lactalbumin** (2.4 g/L), better balanced for human babies.\n- **alpha-1-antitrypsin** = human protein made by transgenic animals to treat **emphysema** (biological products use).\n- **Disease models:** cancer, cystic fibrosis, rheumatoid arthritis, Alzheimer's.\n- **Vaccine safety** → transgenic **mice**, **polio** vaccine, could replace monkeys.",
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**95% figure:** NCERT states over **95 per cent** of existing transgenic animals are **mice**. That exact number and animal is a favourite one-liner.\n\n**Rosie facts:** first transgenic **cow**, year **1997**, milk protein **alpha-lactalbumin** (human), **2.4 g/L**. Don't confuse alpha-lactalbumin (Rosie's milk protein) with alpha-1-antitrypsin (the emphysema drug protein) — NEET swaps these two on purpose.\n\n**Match-the-example:** insulin-like growth factor → physiology; alpha-1-antitrypsin → biological products; polio → vaccine safety. Distractors move an example under the wrong use.\n\n**Classic NEET question:** \"The first transgenic cow, Rosie, produced human protein-enriched milk containing which protein?\" → **human alpha-lactalbumin.**",
    },
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "So a transgenic animal is a normal animal carrying one borrowed, working gene, put to five uses — from studying how our bodies grow, to modelling our diseases, making our medicines, checking our vaccines and testing our chemicals. But the moment we start rewriting living creatures like this, a harder question follows: just because we *can*, should we? That is where the chapter turns next — to the **ethical issues** of biotechnology.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: "Which statement about transgenic animals is correct according to NCERT?",
          options: [
            'They have had their DNA manipulated to possess and express an extra foreign gene, and over 95% of them are mice',
            'They are animals cloned from a single parent, and most of them are sheep',
            'They possess a foreign gene but are specifically bred so that the gene is never expressed',
            'They are animals treated with hormones, and over 95% of them are cows',
          ],
          correct_index: 0,
          explanation: "A transgenic animal is one whose DNA has been manipulated to possess and express an extra (foreign) gene, and NCERT notes that over 95% of all existing transgenic animals are mice. Cloning from a single parent describes a clone (like Dolly), not a transgenic animal. Being made 'so the gene is never expressed' contradicts the definition, which requires the gene to be expressed. Hormone treatment does not change an animal's DNA.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: "Rosie, the first transgenic cow (1997), was significant because her milk contained:",
          options: [
            'Human alpha-1-antitrypsin, used to treat emphysema',
            'Human alpha-lactalbumin, making the milk more nutritionally balanced for human babies',
            'Insulin-like growth factor, used to study human growth',
            'A vaccine against polio that could replace the use of monkeys',
          ],
          correct_index: 1,
          explanation: "Rosie's milk was enriched with the human protein alpha-lactalbumin (2.4 g/L), making it nutritionally more balanced for human babies than normal cow-milk. Alpha-1-antitrypsin is a different human protein (for emphysema) and is the example for 'biological products' generally, not Rosie's milk protein — this is the classic swap. Insulin-like growth factor belongs to the physiology-study use, and polio vaccine testing uses transgenic mice, not Rosie.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: "Which use of transgenic animals is matched with the WRONG NCERT example?",
          options: [
            'Study of disease — models for cancer, cystic fibrosis, rheumatoid arthritis and Alzheimer\'s',
            'Vaccine safety — transgenic mice used to test the safety of the polio vaccine',
            'Normal physiology and development — study of insulin-like growth factor',
            'Biological products — transgenic mice used to test the toxicity of chemicals',
          ],
          correct_index: 3,
          explanation: "Testing the toxicity of chemicals is the 'chemical safety testing' use, not 'biological products' — biological products means making a useful protein such as alpha-1-antitrypsin. The other three are correctly paired: disease models cover cancer/cystic fibrosis/rheumatoid arthritis/Alzheimer's, polio-vaccine safety uses transgenic mice, and insulin-like growth factor is the physiology-and-development example.",
          difficulty_level: 3,
        },
        {
          id: uuid(), question: "For which purpose are transgenic animals deliberately made MORE sensitive than normal animals?",
          options: [
            'To produce larger quantities of milk proteins',
            'To act as long-lived models of human disease',
            'For toxicity (chemical safety) testing, so the effects of a toxic substance appear in less time',
            'To increase the expression of insulin-like growth factor',
          ],
          correct_index: 2,
          explanation: "In chemical (toxicity) safety testing, transgenic animals are made to carry genes that make them more sensitive to toxic substances than non-transgenic animals; exposed to the toxin, they show effects faster, giving results in less time. Extra milk protein is the biological-products use, disease modelling is a separate use, and boosting growth-factor expression relates to the physiology study — none of these depend on heightened sensitivity to toxins.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
