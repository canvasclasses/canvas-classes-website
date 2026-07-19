// Class 12 Biology — Chapter 8 (Microbes in Human Welfare)
// "Practice — NCERT Exercises" page. All 15 NCERT textbook exercises, verbatim
// prompts (Rule 0), regrouped into 4 revision themes with full worked solutions.
// Authored per scripts/bio-book12/_practice/CONTRACT.md. Do NOT insert here.

module.exports = {
  slug: 'ch8-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle:
    'All 15 NCERT textbook exercises for the chapter, grouped into 4 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    // ── Block 0 — hero image ────────────────────────────────────────────────
    {
      id: '603184d6-55c1-4519-a933-b88868857d70',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A montage of microbes at work in daily life — a pot of setting curd, a risen loaf of bread, a biogas dome, a petri dish streaked with mould, and legume roots dotted with nitrogen-fixing nodules.',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt:
        'Hand-drawn coloured illustration on a deep charcoal (near-black) background, muted earthy palette (ochre, moss green, brick red, warm cream), NO glow, NO neon, NO 3D, NO orange tech-lighting. A horizontal montage showing how microbes serve human welfare: on the left an earthen pot of setting curd with a wooden ladle; beside it a risen golden loaf of bread with airy holes; in the centre a small domed biogas plant with a cattle-dung inlet; to its right a laboratory petri dish streaked with a fuzzy Penicillium mould and a clear zone of inhibition; on the far right a leguminous plant pulled from the soil showing pink root nodules and a curling mycorrhizal thread. Soft botanical-textbook line work, gentle cross-hatching, labels left off. Landscape, desktop-friendly, calm and academic.',
    },

    // ── Block 1 — intro text ────────────────────────────────────────────────
    {
      id: '8d4dabae-0abc-44d5-a4eb-225ab3acf456',
      type: 'text',
      order: 1,
      markdown:
        "You have read the chapter — now drill it. Below are **all 15 NCERT exercises** for *Microbes in Human Welfare*, kept in their exact textbook wording, but regrouped out of the running order into **four revision themes**: microbes in our food and homes, microbes at industrial scale, sewage and BOD, and microbes for the soil and the environment. Every question carries a full worked solution, not just a one-line answer — the aim is that if you get one wrong, the solution teaches you the whole idea. Read the solution even when you think you knew it; the microbe-to-product pairings are exactly where marks are lost.",
    },

    // ── Block 2 — practice bank ─────────────────────────────────────────────
    {
      id: 'ddfe9a01-5dd8-428b-a168-684258906f8d',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 8.1–8.15',
      intro:
        'Fifteen questions, four themes. Work each one before opening the solution.',
      sections: [
        // ── Section 1 — Microbes in our food & homes ────────────────────────
        {
          id: '1a8df9ed-4632-4c63-ba64-42e572e5f834',
          title: 'Microbes in our food & homes',
          blurb:
            'Curd, dough, dosa, idli and bread — the microbes working in the kitchen and the gases they release.',
          items: [
            {
              kind: 'numerical',
              id: '39e666e9-b4da-4559-9b59-e637ed7c98b9',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.1',
              prompt:
                'Bacteria cannot be seen with the naked eyes, but these can be seen with the help of a microscope. If you have to carry a sample from your home to your biology laboratory to demonstrate the presence of microbes with the help of a microscope, which sample would you carry and why?',
              answer:
                'A little curd — it is teeming with Lactobacillus (lactic acid bacteria) that show up clearly under the microscope.',
              solution:
                "**Carry a small amount of curd.**\n\nCurd is made when *Lactobacillus* and other **lactic acid bacteria (LAB)** grow in warm milk. A single drop of curd holds millions of these bacteria, so it is one of the easiest home sources of a living microbial population.\n\n**Why it works so well:**\n- The bacteria are present in huge numbers — you do not need to hunt for them.\n- Smear a thin film of curd on a slide, let it dry, stain it (for example with methylene blue), and the rod-shaped *Lactobacillus* cells become visible under the microscope.\n- It is safe, cheap and available in almost every home.\n\nSo curd is the ideal sample to prove that microbes are real and all around us.",
            },
            {
              kind: 'numerical',
              id: '151d8873-2262-40a1-b928-64dff0a39c79',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.2',
              prompt:
                'Give examples to prove that microbes release gases during metabolism.',
              answer:
                'Rising dough (CO₂ from yeast/bacteria), the puffed texture of bread and dosa/idli batter, and biogas (methane) from methanogens all prove microbes release gases.',
              solution:
                "Microbes break down sugars during their metabolism and give off gases. A few clear everyday proofs:\n\n1. **Rising dough (bread).** *Saccharomyces cerevisiae* (baker's yeast) ferments the sugar in the dough and releases **carbon dioxide (CO₂)**. The trapped CO₂ makes the dough swell and gives bread its puffed, spongy texture.\n2. **Dosa and idli batter.** The batter is fermented by bacteria that also produce **CO₂**. The tiny gas bubbles make the batter rise and give the cooked dosa/idli their soft, holey look.\n3. **Biogas.** In a biogas plant, **methanogens** (like *Methanobacterium*) digest organic waste in the absence of air and release **methane (CH₄)** along with CO₂. The biogas that burns on the stove is this metabolic gas.\n4. **Swiss cheese holes.** *Propionibacterium* produces large amounts of **CO₂**, and the trapped gas creates the big holes seen in Swiss cheese.\n\nEach case shows gas being made as a by-product of microbial metabolism.",
            },
            {
              kind: 'numerical',
              id: 'f5a52f44-d415-4474-a57c-0c7e3e6bce4b',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.3',
              prompt:
                'In which food would you find lactic acid bacteria? Mention some of their useful applications.',
              answer:
                'Lactic acid bacteria are found in curd. They set milk into curd, raise its vitamin B₁₂ content, and in our stomach they keep disease-causing microbes in check.',
              solution:
                "**Where you find them:** Lactic acid bacteria (LAB), chiefly *Lactobacillus*, are found in **curd** (and in other fermented milk products).\n\n**How curd forms:** When added to warm milk, LAB multiply and produce **acids** that coagulate the milk protein and partially digest it, turning milk into curd.\n\n**Useful applications of LAB:**\n- They **convert milk into curd**, a nutritious fermented food.\n- They **improve the nutritional quality** of the food by increasing the amount of **vitamin B₁₂**.\n- In our stomach, LAB **check the growth of disease-causing (pathogenic) microbes**, so they play a helpful role in our health.",
            },
            {
              kind: 'numerical',
              id: '87aac690-9c9c-4941-8d6e-5e4331f9cb87',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.4',
              prompt:
                'Name some traditional Indian foods made of wheat, rice and Bengal gram (or their products) which involve use of microbes.',
              answer:
                'Wheat → bread / bhatura; rice → idli & dosa; Bengal gram → dhokla — all fermented by microbes that release CO₂.',
              solution:
                "In each of these foods, microbes ferment the dough or batter and release **CO₂**, which makes the food rise and turn soft and spongy.\n\n| Base ingredient | Traditional food | What the microbes do |\n|---|---|---|\n| **Wheat** (and its products) | Bread, bhatura | Baker's yeast (*Saccharomyces cerevisiae*) ferments the dough, CO₂ makes it rise |\n| **Rice** (rice + black gram batter) | Idli, dosa | Bacteria ferment the batter, CO₂ puffs it up |\n| **Bengal gram** (gram flour) | Dhokla, khandvi | Fermenting microbes make the batter rise and soften it |\n\nAll of these are everyday examples of the same idea — **fermentation by microbes** improving the texture and taste of food.",
            },
          ],
        },

        // ── Section 2 — Microbes at industrial scale ────────────────────────
        {
          id: '814a10f3-8724-443b-9c40-d69944b1622a',
          title: 'Microbes at industrial scale',
          blurb:
            'Antibiotics, life-saving drugs and organic chemicals — the microbes that fill the factory fermenters.',
          items: [
            {
              kind: 'numerical',
              id: '3b06182f-d8ac-4aba-a4ce-7cfc8ecc3fa6',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.5',
              prompt:
                'In which way have microbes played a major role in controlling diseases caused by harmful bacteria?',
              answer:
                'Microbes produce antibiotics (like penicillin) that kill or stop disease-causing bacteria, so diseases that were once fatal are now curable.',
              solution:
                "Microbes control bacterial diseases mainly by producing **antibiotics**.\n\n**What an antibiotic is:** a chemical produced by one microbe that, in low amounts, **kills or stops the growth of other (disease-causing) microbes**.\n\n**The role they have played:**\n- **Penicillin**, the first antibiotic, was discovered by Alexander Fleming from the mould *Penicillium notatum*; its full potential was later established by Ernest Chain and Howard Florey.\n- Antibiotics have been used to cure a wide range of bacterial diseases. Illnesses that once killed millions of people — such as **plague, whooping cough (pertussis), diphtheria and leprosy** — can now be treated.\n- By making these infections curable, antibiotics have **greatly improved human health and increased life expectancy** across the world.\n\nSo microbes, through the antibiotics they make, have been central to controlling diseases caused by harmful bacteria.",
            },
            {
              kind: 'numerical',
              id: '1d8622f7-9d1e-43bb-906c-1bb73670bce5',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.6',
              prompt:
                'Name any two species of fungus, which are used in the production of the antibiotics.',
              answer:
                'Penicillium notatum and Penicillium chrysogenum.',
              solution:
                "Two fungal species used to produce antibiotics are:\n\n1. **_Penicillium notatum_** — the mould from which Alexander Fleming first obtained penicillin.\n2. **_Penicillium chrysogenum_** — used for the large-scale industrial production of penicillin.\n\nBoth are **fungi (moulds)**, and both give the antibiotic **penicillin**. (*Cephalosporium acremonium*, the source of cephalosporins, is another fungal example.)",
            },
            {
              kind: 'numerical',
              id: '31feb591-c3b2-490b-bc69-2cd4a6f0e702',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.12',
              prompt:
                'Find out the name of the microbes from which Cyclosporin A (an immunosuppressive drug) and Statins (blood cholesterol lowering agents) are obtained.',
              answer:
                'Cyclosporin A → the fungus Trichoderma polysporum; Statins → the yeast Monascus purpureus.',
              solution:
                "Both are bioactive molecules produced by microbes:\n\n| Drug | Microbe (source) | Type of microbe | Use |\n|---|---|---|---|\n| **Cyclosporin A** | *Trichoderma polysporum* | Fungus | Immunosuppressant — stops the body rejecting organ transplants |\n| **Statins** | *Monascus purpureus* | Yeast | Lower blood cholesterol |\n\n**How statins work:** they act as **competitive inhibitors of the enzyme** responsible for making cholesterol (HMG-CoA reductase), so the body produces less cholesterol.\n\n**Memory tip:** *Trichoderma* (fungus) → **T**ransplant drug (Cyclosporin A); *Monascus* (yeast) → lowers cholesterol (**S**tatins).",
            },
            {
              kind: 'numerical',
              id: '60965cc2-009b-437f-b3a8-9cd70dcc0dfc',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.14',
              prompt:
                'Arrange the following in the decreasing order (most important first) of their importance, for the welfare of human society. Give reasons for your answer.\nBiogas, Citric acid, Penicillin and Curd',
              answer:
                'Penicillin > Biogas > Curd > Citric acid — from life-saving, to energy, to nutritious food, to a food additive.',
              solution:
                "This is a reasoned-judgement question, so the marks are in the **reasons**, not just the order. A well-justified ranking is:\n\n**Penicillin > Biogas > Curd > Citric acid**\n\n1. **Penicillin (most important).** It is an **antibiotic that saves lives** — it cures bacterial diseases that were once fatal. Nothing on the list matters more than saving human life.\n2. **Biogas.** A **clean, renewable source of energy** for cooking and lighting, made from waste. It serves whole communities and reduces dependence on fuel wood and fossil fuels.\n3. **Curd.** A **nutritious fermented food** that improves diet (extra vitamin B₁₂) and checks harmful microbes in the gut — valuable, but not life-saving.\n4. **Citric acid (least important).** A useful **food preservative and flavouring agent**, but the least essential of the four to human welfare.\n\n*(A different order can be defended as long as the reasoning is sound — the key idea is: life-saving medicine ranks above energy, which ranks above food, which ranks above a food additive.)*",
            },
          ],
        },

        // ── Section 3 — Sewage treatment & BOD ──────────────────────────────
        {
          id: 'e96f8987-b785-4c8c-9760-22057a9bc83b',
          title: 'Sewage treatment & BOD',
          blurb:
            'What sewage is, how primary and secondary treatment differ, and how BOD tells us how dirty water is.',
          items: [
            {
              kind: 'numerical',
              id: '05c6908a-f5f7-4d9d-8832-ea39c84d8711',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.7',
              prompt:
                'What is sewage? In which way can sewage be harmful to us?',
              answer:
                'Sewage is municipal waste water rich in organic matter and microbes (many pathogenic). It is harmful because it carries disease-causing microbes and pollutes our water sources.',
              solution:
                "**What sewage is:** Sewage is the **municipal waste water** — the large amount of waste water generated every day in cities and towns. A major part of it is **human excreta**. It is rich in **organic matter and microbes**, and many of those microbes are **pathogenic (disease-causing)**.\n\n**Why it is harmful:**\n- It contains **disease-causing microbes**, so it can spread illnesses.\n- If sewage is discharged **untreated** into rivers and streams, it **pollutes our natural water bodies** — the same water we may use for drinking.\n- This contamination can cause the **spread of water-borne diseases** in the community.\n\nThat is why sewage must be treated in a sewage treatment plant before its water is released into natural water bodies.",
            },
            {
              kind: 'numerical',
              id: '1191016a-85ed-4d70-94b8-b8cd5f859296',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.8',
              prompt:
                'What is the key difference between primary and secondary sewage treatment?',
              answer:
                'Primary treatment is a physical process that removes solids by filtration and sedimentation; secondary treatment is a biological process where microbes consume the organic matter and lower the BOD.',
              solution:
                "The key difference is **physical vs biological**:\n\n| Feature | Primary treatment | Secondary treatment |\n|---|---|---|\n| Nature of process | **Physical** | **Biological** |\n| What happens | Solids are removed by **filtration and sedimentation** — floating debris by filtration, grit and heavier solids by settling | The effluent is passed into **aeration tanks**; **aerobic microbes** grow and consume the organic matter |\n| Key players | No microbes needed | **Microbes** (they form flocs) |\n| Result | Removes suspended solids → **primary sludge** and **primary effluent** | Greatly **reduces the BOD** of the effluent |\n\n**In one line:** primary treatment *physically removes solids*, while secondary treatment uses *microbes to eat up the organic matter and bring the BOD down*.",
            },
            {
              kind: 'numerical',
              id: '745ee576-ecb2-48b5-876e-e6e77b5d200a',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.11',
              prompt:
                'Three water samples namely river water, untreated sewage water and secondary effluent discharged from a sewage treatment plant were subjected to BOD test. The samples were labelled A, B and C; but the laboratory attendant did not note which was which. The BOD values of the three samples A, B and C were recorded as 20mg/L, 8mg/L and 400mg/L, respectively. Which sample of the water is most polluted? Can you assign the correct label to each assuming the river water is relatively clean?',
              answer:
                'Most polluted = C (400 mg/L). Labels: B (8) = river water, A (20) = secondary effluent, C (400) = untreated sewage.',
              solution:
                "The rule to remember: **higher BOD means more organic matter, which means more polluted water.**\n\nThe recorded values are: **A = 20 mg/L, B = 8 mg/L, C = 400 mg/L.**\n\n**Most polluted sample:** **C**, because it has the **highest BOD (400 mg/L)**.\n\n**Assigning the labels** (river water is the cleanest, so it has the lowest BOD):\n\n| BOD value | Sample | Identity | Reason |\n|---|---|---|---|\n| 8 mg/L (lowest) | **B** | **River water** | Cleanest → lowest BOD |\n| 20 mg/L (middle) | **A** | **Secondary effluent** | Partly treated → moderate BOD |\n| 400 mg/L (highest) | **C** | **Untreated sewage** | Most organic matter → highest BOD |\n\nSo: **B = river water, A = secondary effluent, C = untreated sewage**, and **C is the most polluted**.",
            },
          ],
        },

        // ── Section 4 — Microbes for soil, energy & the environment ──────────
        {
          id: 'd05ab757-599c-454f-aeda-f1eafda60f20',
          title: 'Microbes for soil, energy & the environment',
          blurb:
            'Biogas as an energy source, biofertilisers and biocontrol agents, single-cell protein, and how microbes keep soil fertile.',
          items: [
            {
              kind: 'numerical',
              id: 'a94267bb-217e-4284-aa7d-7e663d12700f',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.9',
              prompt:
                'Do you think microbes can also be used as source of energy? If yes, how?',
              answer:
                'Yes — methanogens digest organic waste in a biogas plant and release methane-rich biogas, which is used as fuel for cooking and lighting.',
              solution:
                "**Yes, microbes can be used as a source of energy** — in the form of **biogas**.\n\n**The microbes involved:** **methanogens** (for example *Methanobacterium*). These are **anaerobic bacteria** (they work without oxygen). They are found in the **anaerobic sludge** of sewage treatment and in the **rumen of cattle** (which is why cattle dung, or gobar, is used).\n\n**How the energy is produced:**\n- Organic waste, such as **cattle dung mixed with water**, is fed into a **biogas plant** — a sealed tank with no oxygen.\n- The methanogens **digest the organic matter** and release a mixture of gases rich in **methane (CH₄)**, along with CO₂ and H₂S. This mixture is **biogas**.\n- Biogas is **combustible**, so it is piped out and used as **fuel for cooking and lighting**.\n- The leftover slurry is a good manure.\n\nSo microbes let us turn everyday organic waste into clean, usable energy.",
            },
            {
              kind: 'numerical',
              id: '2947968c-aea2-43b8-bf1e-1586d6a184db',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.10',
              prompt:
                'Microbes can be used to decrease the use of chemical fertilisers and pesticides. Explain how this can be accomplished.',
              answer:
                'Biofertilisers (Rhizobium, Azotobacter, cyanobacteria, mycorrhiza) replace chemical fertilisers, and biocontrol agents (Bt, Trichoderma, Baculovirus) replace chemical pesticides.',
              solution:
                "Microbes reduce the need for chemicals in **two ways** — as **biofertilisers** (in place of chemical fertilisers) and as **biocontrol agents** (in place of chemical pesticides).\n\n**1. Biofertilisers — replacing chemical fertilisers.** These microbes enrich the soil with nutrients naturally:\n- ***Rhizobium*** — lives in the root nodules of legumes and **fixes atmospheric nitrogen** into a usable form.\n- ***Azospirillum* and *Azotobacter*** — free-living bacteria that fix nitrogen in the soil.\n- **Cyanobacteria** (blue-green algae like *Anabaena, Nostoc, Oscillatoria*) — fix nitrogen and add organic matter, especially in paddy fields.\n- **Mycorrhiza** (the fungus *Glomus*) — lives with plant roots and helps them **absorb phosphorus** from the soil.\n\n**2. Biocontrol agents — replacing chemical pesticides.** These microbes kill crop pests without polluting the soil:\n- ***Bacillus thuringiensis* (Bt)** — its spores are sprayed on crops and kill insect (butterfly caterpillar) larvae.\n- ***Trichoderma*** — a free-living fungus that controls several plant (root) pathogens.\n- **Baculoviruses** (genus *Nucleopolyhedrovirus*) — narrow-spectrum insecticides that attack specific insect pests without harming other organisms.\n\nBy using these living agents instead of chemicals, we keep the soil and environment free of harmful chemical residues.",
            },
            {
              kind: 'numerical',
              id: '8a4b3d7d-535e-46ef-ae10-d11d31eed7e6',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.13',
              prompt:
                'Find out the role of microbes in the following and discuss it with your teacher.\n(a) Single cell protein (SCP)\n(b) Soil',
              answer:
                '(a) Microbes like Spirulina and Methylophilus are grown as protein-rich food/feed (SCP). (b) Microbes decompose waste, recycle nutrients, fix nitrogen and improve soil fertility.',
              solution:
                "**(a) Single Cell Protein (SCP)**\n\nSCP means using **microbial biomass (or protein) as an alternative source of protein** for humans and animals.\n- Microbes such as **_Spirulina_** (a cyanobacterium) and **_Methylophilus methylotrophus_** can be grown on cheap materials, even waste water and agricultural waste.\n- They multiply very fast and produce a large amount of **protein-rich biomass** in a small space.\n- This **reduces the pressure on agricultural land** used to grow protein-rich crops, and helps meet the food/feed demand of a growing population.\n\n**(b) Soil**\n\nMicrobes keep the soil alive and fertile:\n- They **decompose dead plants and animals (organic matter)** and recycle the nutrients back into the soil.\n- **Nitrogen-fixing microbes** (*Rhizobium, Azotobacter*, cyanobacteria) add usable **nitrogen** to the soil.\n- **Mycorrhiza** helps plant roots absorb **phosphorus** and gives resistance to drought and root pathogens.\n- Together they **maintain soil fertility and structure**, so plants grow well.",
            },
            {
              kind: 'numerical',
              id: '0f66046d-ad7e-4d93-8854-95599f2e14a6',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.15',
              prompt:
                'How do biofertilisers enrich the fertility of the soil?',
              answer:
                'They add nutrients naturally — Rhizobium and free-living bacteria and cyanobacteria fix nitrogen, while mycorrhiza supplies phosphorus — so the soil stays fertile without chemical fertilisers.',
              solution:
                "**Biofertilisers** are living organisms that enrich the soil with nutrients. They work chiefly by **fixing nitrogen** and **supplying phosphorus**.\n\n**By fixing nitrogen:**\n- ***Rhizobium*** lives in a **symbiotic** relationship inside the **root nodules of legumes** and fixes atmospheric nitrogen into a form the plant can use.\n- **Free-living bacteria** such as ***Azospirillum* and *Azotobacter*** fix nitrogen directly in the soil.\n- **Cyanobacteria** (blue-green algae like *Anabaena, Nostoc, Oscillatoria*) fix nitrogen **and add organic matter**, which is especially important in **paddy fields**.\n\n**By supplying phosphorus:**\n- **Mycorrhiza** — the symbiosis between the fungus ***Glomus*** and plant roots — helps the plant **absorb phosphorus** from the soil. Such plants also show more resistance to root pathogens, tolerance to salinity and drought, and better overall growth.\n\nBecause these microbes add nitrogen and phosphorus **naturally**, they enrich soil fertility and cut down the need for chemical fertilisers.",
            },
          ],
        },
      ],
    },
  ],
};
