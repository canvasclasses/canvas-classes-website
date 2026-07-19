'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'common-diseases-bacterial-and-viral',
  title: 'Common Diseases I — Bacterial & Viral',
  subtitle: "Three everyday infections — typhoid, pneumonia and the common cold — and for each one: the exact pathogen, where in the body it strikes, and how it jumps from one person to the next.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['human-health-and-disease', 'common-diseases', 'typhoid', 'pneumonia', 'common-cold'],
  glossary: [
    { term: 'pathogen', definition: 'Any disease-causing organism. Bacteria, viruses, fungi, protozoans and helminths can all be pathogens. Most parasites are pathogens because they harm the host they live in or on.' },
    { term: 'typhoid', definition: 'A bacterial fever caused by Salmonella typhi. The bacteria enter the small intestine through contaminated food and water, then spread to other organs through the blood.' },
    { term: 'Widal test', definition: 'The classic laboratory test used to confirm typhoid fever.' },
    { term: 'pneumonia', definition: 'A bacterial infection of the alveoli (the air-filled sacs of the lungs), caused by Streptococcus pneumoniae and Haemophilus influenzae. The alveoli fill with fluid, making breathing difficult.' },
    { term: 'common cold', definition: 'A highly infectious viral ailment caused by rhino viruses. It infects the nose and respiratory passage but not the lungs.' },
    { term: 'carrier', definition: 'A person who harbours a pathogen and keeps spreading it to others without necessarily falling seriously ill themselves — as Mary Mallon did with typhoid.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dusk scene layering a contaminated water source, a crowded room of shared cups and utensils, and a person mid-sneeze — the three routes by which everyday infections spread',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dusk scene stitching together three everyday settings without hard borders: on the left, a dim kitchen with a jug of water and a plate of food on a table, faint hints that the water is unclean; in the centre, a crowded low-lit room where hands pass a shared cup and utensils between people; on the right, a single figure in silhouette caught mid-sneeze, a faint spray of tiny droplets drifting into the air. Warm low dusk lighting ties the whole panorama together, quiet and human rather than clinical. Painterly, atmospheric, dark naturalistic background overall (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Cook Who Would Not Stop Spreading Typhoid',
      markdown: "One of the most famous cases in all of medicine is that of **Mary Mallon**, nicknamed **Typhoid Mary**. She was a **cook by profession** and a **typhoid carrier** — her body harboured *Salmonella typhi* and passed it on, yet she kept working. Through the food she prepared, she **continued to spread typhoid for several years** to the families she cooked for. One person, one kitchen, years of infection — a reminder of why *how a disease travels* matters just as much as the germ itself.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "A huge range of organisms — bacteria, viruses, fungi, protozoans, helminths and more — can make us ill. Any disease-causing organism is called a **pathogen**. A pathogen gets into the body, **multiplies**, and interferes with our normal vital activities, causing both structural and functional damage.\n\nTo do this, a pathogen must first **survive inside the host**. A germ that infects the gut, for example, has to withstand the stomach's low pH and its digestive enzymes before it can settle in. On this page we meet three of the most common human infections — two bacterial (**typhoid** and **pneumonia**) and one viral (the **common cold**). For each, hold on to three things: the **pathogen** that causes it, the **organ it attacks**, and its **mode of transmission** — the exact way it moves from a sick person to a healthy one.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Typhoid — A Fever That Starts in the Gut',
      objective: "By the end of this you can name the pathogen, the organ it enters, the test that confirms it, and how it spreads.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Typhoid fever** is caused by the bacterium **_Salmonella typhi_**. These pathogens generally enter the **small intestine** through **food and water contaminated** with them, and from there they **migrate to other organs through the blood**. So typhoid does not stay put where it lands — it begins in the gut and then travels around the body.\n\nThe common symptoms are a **sustained high fever (39° to 40°C)**, weakness, stomach pain, constipation, headache and loss of appetite. In **severe cases** there can be **intestinal perforation and death**. Typhoid fever is confirmed by the **Widal test**. Remember the pairing: food-and-water route, small intestine first, Widal to confirm.",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Pneumonia — When the Air Sacs Fill With Fluid',
      objective: "By the end of this you can name both bacteria, the exact part of the lung they flood, and the two ways the infection is passed on.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "**Pneumonia** in humans is caused by the bacteria **_Streptococcus pneumoniae_** and **_Haemophilus influenzae_**. Notice that pneumonia is one disease with **two responsible bacteria** — NCERT names both, so learn them as a pair.\n\nThese bacteria infect the **alveoli**, the air-filled sacs of the lungs. As the infection sets in, the alveoli **fill up with fluid**, which leads to **severe problems in respiration** — the sacs meant to hold air are now holding liquid. The symptoms include **fever, chills, cough and headache**, and in severe cases the **lips and finger nails may turn grey to bluish** in colour. A healthy person catches it by **inhaling the droplets or aerosols** released by an infected person, or even by **sharing glasses and utensils** with them.",
    },
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'The Common Cold — A Virus That Stays Out of the Lungs',
      objective: "By the end of this you can name the virus, state exactly which parts it does and does not infect, and describe how it spreads.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Viruses cause disease too, and **rhino viruses** are behind one of the most infectious human ailments of all — the **common cold**. Here is the detail NEET loves: rhino viruses infect the **nose and respiratory passage but _not_ the lungs**. That one word — *not* — is what separates the common cold from pneumonia.\n\nThe common cold shows up as **nasal congestion and discharge, sore throat, hoarseness, cough, headache and tiredness**, which usually last **3–7 days**. It spreads through **droplets from the cough or sneeze** of an infected person — either **inhaled directly**, or picked up from **contaminated objects** such as pens, books, cups, doorknobs, and a computer keyboard or mouse. That is why the cold runs so easily through a classroom or an office.",
    },
    {
      id: uuid(), type: 'table', order: 9,
      caption: '📸 The three infections side by side — pathogen, where it strikes, symptoms, and how it spreads.',
      headers: ['Disease', 'Pathogen', 'Organ affected & key symptoms', 'Mode of transmission'],
      rows: [
        ['Typhoid', 'Salmonella typhi (bacterium)', 'Enters small intestine, spreads via blood; sustained high fever (39–40°C), weakness, stomach pain, constipation, headache, loss of appetite; confirmed by Widal test', 'Contaminated food and water'],
        ['Pneumonia', 'Streptococcus pneumoniae & Haemophilus influenzae (bacteria)', 'Alveoli of the lungs fill with fluid; fever, chills, cough, headache; severe cases turn lips and finger nails grey to bluish', 'Inhaling droplets/aerosols from an infected person, or sharing glasses and utensils'],
        ['Common cold', 'Rhino viruses', 'Nose and respiratory passage (not the lungs); nasal congestion and discharge, sore throat, hoarseness, cough, headache, tiredness (3–7 days)', 'Inhaling cough/sneeze droplets, or contaminated objects (pens, books, cups, doorknobs, keyboard, mouse)'],
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "A patient has a bad cough and headache. The doctor needs to tell apart pneumonia from the common cold before treating. Which single fact would most cleanly separate the two?",
      options: [
        "Both are caused by viruses, so only the length of the fever can tell them apart",
        "Pneumonia infects the alveoli of the lungs, while the common cold infects the nose and respiratory passage but not the lungs",
        "The common cold is confirmed by the Widal test, pneumonia is not",
        "Pneumonia spreads through contaminated food and water, the common cold through droplets",
      ],
      reveal: "The clean dividing line NCERT draws is the site of infection: pneumonia attacks the **alveoli of the lungs**, whereas the common cold stays in the **nose and respiratory passage and does not reach the lungs**. The first option is wrong because pneumonia is bacterial (Streptococcus pneumoniae and Haemophilus influenzae), not viral. The Widal test belongs to typhoid, not the cold — that is the tempting trap for anyone who memorised 'test' without matching it to the right disease. And the food-and-water route is typhoid's; both pneumonia and the cold spread mainly by respiratory droplets.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember', title: 'Lock These Pathogen–Organ–Route Triples',
      markdown: "- **Typhoid** → *Salmonella typhi* → **small intestine** (spreads via blood) → **contaminated food & water** → confirmed by the **Widal test**.\n- **Pneumonia** → *Streptococcus pneumoniae* **and** *Haemophilus influenzae* → **alveoli of the lungs** (fill with fluid) → **droplets/aerosols, or shared glasses & utensils**.\n- **Common cold** → **rhino viruses** → **nose & respiratory passage, NOT the lungs** → **cough/sneeze droplets or contaminated objects**.\n- Severe pneumonia = **grey-to-bluish lips and finger nails**. Common cold = lasts **3–7 days**.",
    },
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Two bacteria, one disease:** pneumonia is caused by *Streptococcus pneumoniae* **and** *Haemophilus influenzae*. NEET drops one and asks you to complete the pair, or swaps in *Salmonella* to trap you.\n\n**The 'not the lungs' line:** rhino viruses infect the nose and respiratory passage **but not the lungs** — the single most lifted fact separating the cold from pneumonia.\n\n**Match the test to the disease:** the **Widal test** confirms **typhoid**, never the cold or pneumonia.\n\n**Match the route:** typhoid = **food and water**; pneumonia and cold = **droplets** (pneumonia adds shared utensils/glasses).\n\n**Classic NEET question:** \"Which test is used to confirm typhoid fever, and which pathogen causes it?\" → **the Widal test; _Salmonella typhi_.**",
    },
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "That covers the everyday bacterial and viral infections. Next we move to the diseases carried by **fungi and protozoans** — including malaria, the disease humans have been fighting for centuries, and the parasite behind it.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which pathogen causes typhoid fever, and which test confirms it?',
          options: [
            'Rhino viruses, confirmed by the Widal test',
            'Streptococcus pneumoniae, confirmed by a blood culture',
            'Salmonella typhi, confirmed by the Widal test',
            'Haemophilus influenzae, confirmed by the Widal test',
          ],
          correct_index: 2,
          explanation: "Typhoid is caused by the bacterium Salmonella typhi and is confirmed by the Widal test. Rhino viruses cause the common cold, while Streptococcus pneumoniae and Haemophilus influenzae cause pneumonia — pairing any of them with the Widal test is the classic swap trap, because the Widal test belongs only to typhoid.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Pneumonia infects which specific part of the body, and what happens there?',
          options: [
            'The nose and respiratory passage, which become congested with discharge',
            'The alveoli of the lungs, which fill with fluid and cause breathing problems',
            'The small intestine, from where the bacteria spread through the blood',
            'The lips and finger nails, which turn grey to bluish',
          ],
          correct_index: 1,
          explanation: "Pneumonia infects the alveoli — the air-filled sacs of the lungs — which then fill with fluid, leading to severe problems in respiration. The nose and respiratory passage are the site of the common cold, and the small intestine is where typhoid begins. Grey-to-bluish lips and nails are a severe symptom of pneumonia, not the site of infection.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Rhino viruses cause the common cold. Which statement about where they act is correct?',
          options: [
            'They infect the nose and respiratory passage but not the lungs',
            'They infect the alveoli of the lungs, filling them with fluid',
            'They enter the small intestine and spread through the blood',
            'They infect the lungs directly, causing 3–7 days of chest pain',
          ],
          correct_index: 0,
          explanation: "Rhino viruses infect the nose and respiratory passage but not the lungs — that exclusion of the lungs is exactly what separates the common cold from pneumonia. Filling the alveoli with fluid is pneumonia, and starting in the small intestine and spreading via blood is typhoid, so both are the wrong diseases here.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'By which route does typhoid most commonly spread from person to person?',
          options: [
            'Inhaling droplets released during a cough or sneeze',
            'Sharing glasses and utensils with an infected person',
            'Touching contaminated pens, books, cups and doorknobs',
            'Food and water contaminated with the pathogen',
          ],
          correct_index: 3,
          explanation: "Salmonella typhi enters the small intestine through contaminated food and water, so that is typhoid's transmission route. Inhaled droplets and shared utensils are how pneumonia spreads, and contaminated objects like pens and doorknobs carry the common cold — all three distractors are real transmission routes, just for the wrong disease.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
