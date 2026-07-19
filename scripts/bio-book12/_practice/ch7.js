// Class 12 Biology — Chapter 7 (Human Health and Disease)
// "Practice — NCERT Exercises" page. All 17 NCERT exercises, verbatim prompts
// (Rule 0), regrouped into 5 revision themes with full worked solutions.
// Authored per scripts/bio-book12/_practice/CONTRACT.md. Do NOT insert to DB here.

module.exports = {
  slug: 'ch7-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle:
    'All 17 NCERT textbook exercises for the chapter, grouped into 5 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: 'b5775131-02d0-4535-a212-001a6227e060',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A hand-drawn illustration board of human health and disease — a mosquito vector, an antibody, a virus particle, and a warning sign about drugs and alcohol.',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt:
        'A wide 16:5 hand-drawn coloured illustration on a deep charcoal dark background, muted earthy palette (dusty teal, ochre, brick red, sage), NO glow, NO neon, NO 3D, classroom-poster feel. A horizontal "revision board" for Human Health and Disease: on the left a female Anopheles mosquito beside a small malaria parasite; next a Y-shaped antibody molecule with its two antigen-binding tips labelled; in the middle a simple HIV virus particle and a cluster of dividing cells breaking away from a tumour (metastasis); on the right a plain "say no" hand over a bottle and pills, and a small shield representing immunity and public health. Simple hand-lettered mini-labels, chalk-illustration texture, calm and educational, not clinical or frightening.',
    },
    {
      id: '39acf587-2568-4a26-a91d-36bba389e289',
      type: 'text',
      order: 1,
      markdown:
        "You've read the chapter — now drill it. Below are **all 17 NCERT exercises** for *Human Health and Disease*, regrouped out of the textbook's running order into **5 revision themes**: how diseases spread and how we stop them, the immune system, AIDS, cancer, and drug and alcohol abuse. Each question keeps its exact NCERT wording, and each comes with a full worked solution — so if you miss one, the solution teaches you the whole idea, not just the answer. Work through a theme at a time.",
    },
    {
      id: '0591b92a-0998-4e60-b3e4-d72300d93696',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 7.1–7.17',
      intro:
        'Attempt each question on your own first, then open the solution. Pay special attention to the pathogen–disease pairings and to the immunity comparisons — those are the ones exams love to twist.',
      sections: [
        {
          id: '07c62b7f-8685-4302-83d9-df4d9870d752',
          title: 'Infectious diseases — how they spread and how we control them',
          blurb:
            'Transmission routes, public-health measures, and how biology has helped us fight infection.',
          items: [
            {
              kind: 'numerical',
              id: 'cdfa4c91-bd33-46d1-98c1-365f62c02944',
              source: 'ncert_exercise',
              source_label: 'NCERT 7.1',
              prompt:
                'What are the various public health measures, which you would suggest as safeguard against infectious diseases?',
              answer:
                'Personal and public hygiene, safe water and food, waste and vector control, plus immunisation and early treatment.',
              solution:
                "Public health measures work by breaking the chain between a pathogen and a new host. The main ones NCERT lists:\n\n- **Maintaining personal hygiene** — keeping the body clean, bathing, clean clothes; and **public hygiene** — proper disposal of waste and excreta.\n- **Clean drinking water and food** — periodic cleaning and disinfection of water reservoirs, pools, tanks and wells; observing standard hygiene in public catering (kitchens, eating places).\n- **Controlling vectors and their breeding** — eliminating stagnant water and other mosquito breeding places, cleaning coolers and drains, using mosquito nets and insecticides, and introducing biological controls like larvivorous fish (*Gambusia*).\n- **Immunisation (vaccination)** — vaccinating people against major infectious diseases so the population is protected. Large-scale immunisation has controlled polio, tetanus, diphtheria and helped **eradicate smallpox**.\n- **Education and early action** — public awareness about how diseases spread, plus early diagnosis and treatment so an infected person is treated and does not pass the pathogen on.",
            },
            {
              kind: 'numerical',
              id: '8c3767d8-901a-4dca-99bb-cf82cbe2a7ad',
              source: 'ncert_exercise',
              source_label: 'NCERT 7.2',
              prompt:
                'In which way has the study of biology helped us to control infectious diseases?',
              answer:
                'It gave us vaccines, antibiotics and other drugs, knowledge of pathogen and vector life cycles, and modern diagnostics.',
              solution:
                'Understanding the biology of pathogens and of our own body has given us several powerful tools:\n\n- **Vaccines and immunisation** — knowing how the immune system remembers an antigen let us make vaccines. This is how smallpox was eradicated and polio nearly wiped out.\n- **Antibiotics and other drugs** — the discovery of antibiotics (starting with **penicillin** from *Penicillium notatum*) and antiviral, antifungal and antiparasitic drugs lets us cure or control many infections.\n- **Knowing the life cycles of pathogens and vectors** — understanding, for example, the malarial parasite in the *Anopheles* mosquito, or the worm in contaminated food, tells us exactly where to break the cycle (vector control, clean water, hygiene).\n- **Biotechnology and better diagnostics** — recombinant DNA technology gives safer vaccines; tools like ELISA and PCR allow **early and accurate diagnosis**, so treatment starts sooner and spread is checked.',
            },
            {
              kind: 'numerical',
              id: '75aef5b6-15ed-443e-9654-7a09a390747c',
              source: 'ncert_exercise',
              source_label: 'NCERT 7.3',
              prompt:
                'How does the transmission of each of the following diseases take place?\n(a) Amoebiasis\n(b) Malaria\n(c) Ascariasis\n(d) Pneumonia',
              answer:
                'Amoebiasis and ascariasis spread through contaminated food/water; malaria through the female Anopheles mosquito; pneumonia through droplets or shared articles.',
              solution:
                "Match each disease to its route carefully — this is a favourite exam trap.\n\n**(a) Amoebiasis** (amoebic dysentery, pathogen *Entamoeba histolytica*): spreads through **contaminated food and water**. **Houseflies act as mechanical carriers**, carrying the parasite from the faeces of an infected person onto food, contaminating it. It is a **faecal–oral** route.\n\n**(b) Malaria** (pathogen *Plasmodium*): transmitted by the **bite of an infected female *Anopheles* mosquito**. The mosquito is the vector; when it bites, sporozoites in its saliva enter the human blood.\n\n**(c) Ascariasis** (pathogen the roundworm *Ascaris*): spreads when a person takes in the **eggs of the worm through contaminated water, vegetables, fruits and soil** (soil contaminated with the faeces of an infected person). It is again a faecal–oral route.\n\n**(d) Pneumonia** (pathogens *Streptococcus pneumoniae*, *Haemophilus influenzae*): spreads by **inhaling the droplets/aerosols** released by an infected person, or by **sharing glasses and utensils** with an infected person.",
            },
            {
              kind: 'numerical',
              id: 'd967c473-5a9b-4ddd-b1a2-90555bb62854',
              source: 'ncert_exercise',
              source_label: 'NCERT 7.4',
              prompt: 'What measure would you take to prevent water-borne diseases?',
              answer:
                'Keep sewage out of drinking water, disinfect water sources, drink boiled/clean water, and dispose of waste and excreta properly.',
              solution:
                'Water-borne diseases (typhoid, cholera, amoebiasis, ascariasis and the like) spread when drinking water is contaminated with human excreta. To prevent them:\n\n- **Proper disposal of waste and excreta** so that sewage does not mix with drinking-water sources.\n- **Periodic cleaning and disinfection of water reservoirs**, tanks, wells and pools.\n- **Observing standard practices of hygiene in public catering** — clean handling of food and water at eating places.\n- **Drinking clean, safe water** — boiling or otherwise treating drinking water, especially where the supply may be contaminated.\n\nIn short: keep the drinking-water supply completely separate from sewage, and treat both the water and the waste.',
            },
          ],
        },
        {
          id: '8a8aedc5-f219-4f35-b8f1-6d7e34ba20c7',
          title: 'Immunity and the immune system',
          blurb:
            'Lymphoid organs, vaccines, the innate vs acquired and active vs passive comparisons, and the antibody molecule.',
          items: [
            {
              kind: 'numerical',
              id: 'e9073616-150c-427e-b889-dd95b2ad6a25',
              source: 'ncert_exercise',
              source_label: 'NCERT 7.5',
              prompt:
                "Discuss with your teacher what does 'a suitable gene' means, in the context of DNA vaccines.",
              answer:
                'A gene that codes for a specific antigenic protein of the pathogen — one that triggers a protective immune response without causing the disease.',
              solution:
                "In a DNA vaccine, instead of injecting the whole pathogen, we introduce a **piece of DNA (a gene) from the pathogen** into the person. The body's own cells then read that gene and make the pathogen's protein, and the immune system responds to it and builds memory.\n\nSo a **'suitable gene'** is one that:\n\n- **codes for an antigen** — a surface protein of the pathogen that the immune system can recognise;\n- is **immunogenic**, meaning the protein it makes actually provokes a strong protective immune response (antibodies and memory cells); and\n- is **safe** — it produces only the antigen, never a live or complete pathogen, so it cannot cause the disease.\n\nChoosing the right gene is the whole point: pick a gene for a harmless-by-itself protein that still teaches the immune system to recognise and destroy the real pathogen later.",
            },
            {
              kind: 'numerical',
              id: 'd4ac9536-1f3d-4122-b034-afcbf28461e0',
              source: 'ncert_exercise',
              source_label: 'NCERT 7.6',
              prompt: 'Name the primary and secondary lymphoid organs.',
              answer:
                'Primary: bone marrow and thymus. Secondary: spleen, lymph nodes, tonsils, Peyer’s patches of the small intestine, and the appendix (plus MALT).',
              solution:
                "Lymphoid organs are where lymphocytes (the white blood cells of immunity) are made, mature and act.\n\n**Primary lymphoid organs** — where immature lymphocytes **differentiate into mature, antigen-sensitive lymphocytes**:\n- **Bone marrow**\n- **Thymus** (below the breastbone, large in children, shrinks with age)\n\n**Secondary lymphoid organs** — where mature lymphocytes **interact with the antigen, then proliferate to become effector cells**:\n- **Spleen**\n- **Lymph nodes**\n- **Tonsils**\n- **Peyer's patches of the small intestine**\n- **Appendix**\n- and the **mucosa-associated lymphoid tissue (MALT)** lining the respiratory, digestive and urogenital tracts.",
            },
            {
              kind: 'numerical',
              id: 'e5bad7b0-54a4-4a25-86cf-ca40b8cc6576',
              source: 'ncert_exercise',
              source_label: 'NCERT 7.7',
              prompt:
                'The following are some well-known abbreviations, which have been used in this chapter. Expand each one to its full form:\n(a) MALT\n(b) CMI\n(c) AIDS\n(d) NACO\n(e) HIV',
              answer:
                'MALT — Mucosa-Associated Lymphoid Tissue; CMI — Cell-Mediated Immunity; AIDS — Acquired Immuno Deficiency Syndrome; NACO — National AIDS Control Organisation; HIV — Human Immunodeficiency Virus.',
              solution:
                '| Abbreviation | Full form |\n|---|---|\n| **MALT** | Mucosa-Associated Lymphoid Tissue |\n| **CMI** | Cell-Mediated Immunity |\n| **AIDS** | Acquired Immuno Deficiency Syndrome |\n| **NACO** | National AIDS Control Organisation |\n| **HIV** | Human Immunodeficiency Virus |\n\nA quick note on each: **MALT** is the lymphoid tissue lining our respiratory, digestive and urogenital tracts (about half the body\'s lymphoid tissue). **CMI** is the arm of immunity run by T-lymphocytes. **AIDS** is the disease caused by **HIV**. **NACO** is the government body that runs India\'s AIDS-control programme.',
            },
            {
              kind: 'numerical',
              id: '94e62e41-d99e-46b5-8cb2-06b20d222fd3',
              source: 'ncert_exercise',
              source_label: 'NCERT 7.8',
              prompt:
                'Differentiate the following and give examples of each:\n(a) Innate and acquired immunity\n(b) Active and passive immunity',
              answer:
                'Innate = non-specific, present from birth, no memory; acquired = pathogen-specific with memory. Active = your own body makes the antibodies (slow, lasting); passive = ready-made antibodies given to you (fast, short-lived).',
              solution:
                "**(a) Innate vs Acquired immunity**\n\n| Feature | Innate immunity | Acquired immunity |\n|---|---|---|\n| Present | From birth (inborn) | Developed after exposure to a pathogen/antigen |\n| Specificity | Non-specific — same defence against all pathogens | Pathogen-specific |\n| Memory | No memory | Has memory (faster, stronger on a second exposure) |\n| Speed | Acts immediately | Response builds over time (primary then secondary) |\n| Basis | Barriers — physical (skin, mucus), physiological (acid in stomach, saliva, tears), cellular (neutrophils, macrophages, NK cells) and cytokine (interferons) | B-lymphocytes (antibodies) and T-lymphocytes |\n| Example | Skin and mucus stopping entry; interferons against viruses | Antibodies produced against measles after infection or vaccination |\n\n**(b) Active vs Passive immunity**\n\n| Feature | Active immunity | Passive immunity |\n|---|---|---|\n| How antibodies arise | The host's own body makes them in response to an antigen | Ready-made antibodies are given directly to the body |\n| Trigger | Exposure to a live/inactivated pathogen or a vaccine | Injection or transfer of pre-formed antibodies |\n| Onset | Slow — takes time to build | Fast — protection is immediate |\n| Duration | Long-lasting; has memory | Short-lived; no memory |\n| Example | Immunity after an infection, or after vaccination | Antibodies in a mother's **colostrum** passed to the infant; **anti-tetanus serum (ATS)** injection; antibodies crossing the placenta to the foetus |",
            },
            {
              kind: 'numerical',
              id: 'ba0c204a-c555-4ef3-96a8-1f762b003674',
              source: 'ncert_exercise',
              source_label: 'NCERT 7.9',
              prompt: 'Draw a well-labelled diagram of an antibody molecule.',
              answer:
                'A Y-shaped molecule of four polypeptide chains (two light + two heavy, H₂L₂), with two antigen-binding sites at the tips of the arms.',
              solution:
                "Since we can't draw here, picture and label it in words:\n\n- The antibody is **Y-shaped**.\n- It is made of **four polypeptide chains**: **two small light (L) chains** and **two large heavy (H) chains**. So an antibody is represented as **H₂L₂**.\n- The four chains are held together by **disulphide (–S–S–) bonds**.\n- Each of the **two arms of the Y** ends in a **variable region** that forms an **antigen-binding site** — so one antibody can bind two identical antigen molecules.\n- The stem and the lower parts of the arms are the **constant region**.\n\n**How to label your drawing:** draw a clear **Y**; mark the two outer chains along the arms as **light chains** and the two inner full-length chains as **heavy chains**; mark the tips of both arms as **antigen-binding sites (variable region)**; mark the joins between chains as **disulphide bonds**; label the lower part as the **constant region**.",
            },
          ],
        },
        {
          id: '45d516a0-1445-4ff2-a239-85bf5673492a',
          title: 'AIDS and HIV',
          blurb:
            'How HIV is transmitted, and how it destroys the immune system.',
          items: [
            {
              kind: 'numerical',
              id: 'da0745ea-f379-4256-bd87-b2126894bd76',
              source: 'ncert_exercise',
              source_label: 'NCERT 7.10',
              prompt:
                'What are the various routes by which transmission of human immunodeficiency virus takes place?',
              answer:
                'Unprotected sexual contact, transfusion of infected blood, sharing infected needles, and from an infected mother to her child.',
              solution:
                "HIV spreads only through the exchange of body fluids that carry the virus. The routes are:\n\n1. **Sexual contact** with an infected person (unprotected sex).\n2. **Transfusion of contaminated blood** or blood products.\n3. **Sharing infected needles and syringes** — as happens among intravenous drug abusers.\n4. **From an infected mother to her child** — across the **placenta** during pregnancy, during childbirth, or through **breast milk**.\n\n**Important — how it does NOT spread:** HIV is **not** transmitted by ordinary day-to-day contact — hugging, shaking hands, sharing food or utensils, using the same toilet, or by mosquito bites. Knowing this prevents needless fear and stigma against people living with HIV.",
            },
            {
              kind: 'numerical',
              id: '75c07b3b-6e30-4eb6-868f-f409ec0a2451',
              source: 'ncert_exercise',
              source_label: 'NCERT 7.11',
              prompt:
                'What is the mechanism by which the AIDS virus causes deficiency of immune system of the infected person?',
              answer:
                'HIV multiplies inside helper T-lymphocytes and keeps killing them, so their number steadily falls and immunity collapses.',
              solution:
                "Follow the virus step by step:\n\n1. After entering the body, HIV enters **macrophages**. Inside them its enzyme **reverse transcriptase** makes **viral DNA** from the viral RNA.\n2. This viral DNA gets **incorporated into the host cell's DNA** and directs the cell to make more virus particles — the macrophage keeps producing virus and acts like an **HIV factory**.\n3. HIV also enters **helper T-lymphocytes (T_H cells)**, replicates inside them and produces **progeny viruses**.\n4. These new viruses are released into the blood and **attack more helper T-lymphocytes**. This is repeated again and again.\n5. As a result, the **number of helper T-lymphocytes in the body falls progressively**.\n\nSince helper T cells are central to organising the immune response, their steady loss **cripples the person's immunity**. The person can no longer defend against infections and falls prey to **opportunistic infections** — bacteria (like *Mycobacterium*), viruses, fungi and parasites (like *Toxoplasma*) — that a healthy immune system would easily have resisted.",
            },
          ],
        },
        {
          id: '8ea99acf-3a21-4968-8ab9-e6a2b51483bb',
          title: 'Cancer',
          blurb: 'Cancer cells versus normal cells, and the meaning of metastasis.',
          items: [
            {
              kind: 'numerical',
              id: 'c32b1b44-a6c8-41e9-9eb9-bbebfddb1f15',
              source: 'ncert_exercise',
              source_label: 'NCERT 7.12',
              prompt: 'How is a cancerous cell different from a normal cell?',
              answer:
                'A normal cell shows contact inhibition and divides in a regulated way; a cancer cell has lost contact inhibition and divides uncontrollably, forming a tumour.',
              solution:
                "| Normal cell | Cancerous cell |\n|---|---|\n| Shows **contact inhibition** — contact with neighbouring cells stops it from dividing further | Has **lost contact inhibition** — keeps dividing even when surrounded by other cells |\n| Divides in a **controlled, regulated** way | Divides in an **uncontrolled** way, giving a mass of cells (**tumour**) |\n| Remains **properly differentiated** and stays in its own tissue | Is **transformed**; malignant ones **invade** neighbouring tissue and can spread |\n| Does not spread to distant sites | Malignant cells can **reach distant sites (metastasis)** and start new tumours |\n\nIn short, the key difference is the **loss of contact inhibition**, which lets cancer cells proliferate without stopping and, in malignant tumours, break away and spread.",
            },
            {
              kind: 'numerical',
              id: '6dddef97-ad62-4ba9-a13b-84b514c5199e',
              source: 'ncert_exercise',
              source_label: 'NCERT 7.13',
              prompt: 'Explain what is meant by metastasis.',
              answer:
                'The spread of cancer cells from a malignant tumour, through the blood, to distant sites where they start new (secondary) tumours.',
              solution:
                "**Metastasis** is a property of **malignant tumours**. Cells get **sloughed off (shed) from the original tumour** and travel through the **blood** to reach far-off parts of the body. Wherever they lodge, they begin dividing and **start a new tumour at that new site**.\n\nThis spreading to distant sites and setting up fresh tumours is what makes malignant cancers so dangerous — it is the **most feared property** of malignant tumours, because the disease is no longer confined to one place and becomes much harder to treat.",
            },
          ],
        },
        {
          id: '19254d76-5f49-4e62-a848-a76fcf388641',
          title: 'Drugs and alcohol abuse',
          blurb:
            'Harmful effects, peer influence, why addiction is hard to break, and what pushes youngsters towards it.',
          items: [
            {
              kind: 'numerical',
              id: 'ad7df2f9-ad0d-438c-92b6-73c99b755aca',
              source: 'ncert_exercise',
              source_label: 'NCERT 7.14',
              prompt: 'List the harmful effects caused by alcohol/drug abuse.',
              answer:
                'Harm to the individual (nervous system, liver, behaviour, even death from overdose), to the family (financial and mental distress), and to society (crime, and risk of AIDS/hepatitis-B from shared needles).',
              solution:
                "Alcohol and drug abuse harms the person, the family and society:\n\n**On the individual:**\n- Reckless behaviour, vandalism and **violence**.\n- Damage to the **nervous system**; with alcohol, damage to the **liver (cirrhosis)**.\n- A drop in **academic or work performance**, loss of interest in personal hygiene, **withdrawal and isolation, depression, fatigue** and aggressive, rebellious behaviour.\n- An **overdose can be fatal** — leading to coma and death from respiratory failure, heart failure or cerebral haemorrhage.\n\n**On the family and society:**\n- Serious **mental and financial distress** to the whole family.\n- People **sharing needles** are at high risk of **AIDS and hepatitis-B**.\n- To fund the habit, a person may turn to **stealing and crime**.\n\n**On the next generation:**\n- Use of drugs or alcohol **during pregnancy adversely affects the developing foetus**.",
            },
            {
              kind: 'numerical',
              id: 'dc5b5539-6ef0-43e7-b387-f92b1b0b11c8',
              source: 'ncert_exercise',
              source_label: 'NCERT 7.15',
              prompt:
                'Do you think that friends can influence one to take alcohol/drugs? If yes, how may one protect himself/herself from such an influence?',
              answer:
                'Yes — peer pressure is a major trigger. Protect yourself by resisting undue peer pressure, seeking counselling, confiding in parents and friends, and getting professional help when needed.',
              solution:
                "**Yes.** Friends and **peer pressure** are among the strongest reasons youngsters first try alcohol or drugs — the wish to fit in, to look grown-up, or to not be left out.\n\nWays to protect oneself from this influence:\n\n- **Avoid undue peer pressure** — do not let friends push you into things beyond your comfort or judgement; each person should be allowed to grow at their own pace and not be forced to match others.\n- **Education and counselling** — learn to face problems, stress, disappointments and failures as a normal part of life, and to channel energy into studies, sports, music, reading and other healthy activities.\n- **Seeking help from parents and peers** — share your worries and problems with people you trust; help from trusted friends and parents builds the confidence to say no.\n- **Looking for danger signs and getting professional help** — be alert to warning signs in yourself or a friend and, if needed, seek help from **parents, teachers, qualified psychologists and psychiatrists, and de-addiction and rehabilitation programmes**.",
            },
            {
              kind: 'numerical',
              id: 'ff6278ac-c891-4a46-948d-a339fea0b42a',
              source: 'ncert_exercise',
              source_label: 'NCERT 7.16',
              prompt:
                'Why is that once a person starts taking alcohol or drugs, it is difficult to get rid of this habit? Discuss it with your teacher.',
              answer:
                'Because of addiction and dependence — the body builds tolerance and shows unpleasant withdrawal symptoms when the drug is stopped, forcing the person to keep taking it.',
              solution:
                "Two linked reasons make quitting so hard: **addiction** and **dependence**.\n\n- **Addiction** is a psychological attachment to the pleasure or the 'high' that drugs and alcohol give. To get that feeling again, the person keeps using them — even knowing the harm.\n- With repeated use, the body develops **tolerance**, so the person needs **larger and more frequent doses** to get the same effect.\n- **Dependence** is the body's tendency to show a **withdrawal syndrome** if regular use is suddenly stopped. Withdrawal brings very unpleasant symptoms — **anxiety, shakiness, nausea and sweating** — which can be severe.\n- To **escape these withdrawal symptoms**, the person is compelled to take the drug again. This traps them in a cycle.\n\nDependence also makes a person **ignore social norms** to obtain and use the drug. And even after treatment and de-addiction, there is a real **risk of relapse** — which is why prevention and early help matter so much.",
            },
            {
              kind: 'numerical',
              id: '6e60f5d3-2e9b-46a1-b84f-bb6cd06817a5',
              source: 'ncert_exercise',
              source_label: 'NCERT 7.17',
              prompt:
                'In your view what motivates youngsters to take to alcohol or drugs and how can this be avoided?',
              answer:
                'Curiosity, excitement, experimentation, stress and peer pressure motivate them; it can be avoided through education, counselling, family support, alertness to warning signs, and professional help.',
              solution:
                "**What motivates youngsters:**\n- **Curiosity, the need for adventure and excitement, and experimentation** — wanting to try something new.\n- **Stress** — pressure to excel in studies or exams, and the frustration of failures.\n- **Peer pressure** — the wish to be accepted by friends.\n- An **unstable or unsupportive family**, and the **influence of television, films and media** that make such habits look attractive.\n- A mistaken belief that alcohol or drugs help them 'relax' or cope.\n\n**How it can be avoided:**\n- **Avoid undue peer pressure** — let each child develop at their own pace and not be pushed beyond their capacity.\n- **Education and counselling** — teach youngsters to handle stress, disappointment and failure, and to channel energy into sports, reading, music, yoga and other healthy outlets.\n- **Parental and peer support** — parents and friends should give support and let children share their problems freely.\n- **Look for early danger signs** — teachers and parents should watch for warning signs and act early.\n- **Seek professional and medical help** — from psychologists, psychiatrists, and de-addiction and rehabilitation programmes when needed.",
            },
          ],
        },
      ],
    },
  ],
};
