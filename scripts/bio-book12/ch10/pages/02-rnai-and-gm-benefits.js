'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'rna-interference-and-gm-crop-benefits',
  title: 'Silencing the Pest — RNAi & the Benefits of GM Crops',
  subtitle: "How a plant can be taught to switch off a parasite's own genes, and why genetically modified crops are worth all this trouble in the first place.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['rna-interference', 'rnai', 'gm-crops', 'pest-resistant-plants', 'biotechnology-applications'],
  glossary: [
    { term: 'RNA interference (RNAi)', definition: 'A natural cellular defence, present in all eukaryotic organisms, in which a specific mRNA is silenced so its protein is never made. A double-stranded RNA that is complementary to the target mRNA binds to it and stops its translation.' },
    { term: 'dsRNA (double-stranded RNA)', definition: 'A two-stranded RNA molecule formed when a sense RNA and its complementary anti-sense RNA pair up. It is the trigger that sets RNA interference in motion.' },
    { term: 'Meloidogyne incognita', definition: 'A nematode (a kind of roundworm) that infects the roots of tobacco plants and causes a great reduction in yield. It is the parasite that RNAi was used to defeat.' },
    { term: 'Agrobacterium vectors', definition: 'Agrobacterium is used as a natural gene-delivery vehicle to carry the nematode-specific genes into the host tobacco plant.' },
    { term: 'transgenic plant', definition: 'A plant that carries a gene deliberately introduced from another source. Here, a tobacco plant carrying the introduced nematode-specific genes that make it produce the protective dsRNA.' },
    { term: 'GMO', definition: 'Genetically Modified Organism — a plant, bacterium, fungus or animal whose genes have been altered by human manipulation.' },
    { term: 'golden rice', definition: "A genetically modified rice enriched with Vitamin 'A'. NCERT gives it as the example of GM improving the nutritional value of food." },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'Healthy tobacco plant roots glowing softly in dark soil while unseen worm-like shapes are turned away, suggesting hidden protection underground',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). An atmospheric underground scene: the healthy fibrous roots of a tobacco plant spreading through dark soil, softly lit as if protected from within. Faint worm-like nematode shapes drift near the roots but seem to be turning away, unable to take hold — never diagrammatic, just a quiet sense of an invisible shield around the roots. Painterly, naturalistic illustration, deeply atmospheric, overall dark background (#0a0a0a base tones), single warm underground glow as the light source, no text, no labels, no diagram elements, no photorealism.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: "The Plant Fights Back With the Pest's Own Instructions",
      markdown: "A tiny roundworm called **_Meloidogyne incognita_** buries into the roots of tobacco plants and quietly wrecks the crop's yield. You can't easily reach a worm hiding inside a root with a spray. So scientists tried something far cleverer: instead of poisoning the parasite, they got the **plant itself to jam the parasite's own genetic instructions**. The nematode climbs into a root that has been rigged to switch off the very genes the worm needs to survive — and the parasite simply cannot make it. No pesticide, no spray. The defence is built into the plant.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "To understand this trick you first need one idea: a cell can **silence a gene** — shut it down so its protein is never made. The natural tool for this is called **RNA interference (RNAi)**, and NCERT is clear that **RNAi takes place in all eukaryotic organisms as a method of cellular defence**. It is not something humans invented; cells already use it to protect themselves.\n\nHere is the mechanism in one line: **a specific mRNA is silenced because a complementary double-stranded RNA (dsRNA) molecule binds to it and prevents its translation.** Remember that an mRNA is a message that has to be *read* (translated) to make a protein. If something clamps onto that message, the ribosome can't read it — so no protein is made. That clamp is the dsRNA. Where does such interfering RNA come from naturally? NCERT names two sources: **infection by viruses that have RNA genomes**, and **mobile genetic elements (transposons) that replicate through an RNA intermediate**.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'How Double-Stranded RNA Switches Off a Gene',
      objective: "By the end of this you can explain, in order, why a dsRNA that matches an mRNA stops that mRNA from ever being translated into protein.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Think of the target **mRNA as a single-stranded instruction slip** the parasite needs to build an essential protein. On its own it would be read normally and the protein would get made.\n\nNow introduce a **dsRNA that is complementary to that mRNA** — it carries the exact matching sequence. Being complementary, it recognises and **binds to that one specific mRNA** and no other. Once bound, the message is blocked: **translation cannot happen**, so the protein is never produced. The gene has effectively been switched off, even though the DNA itself was never touched. That is the whole of RNAi — a targeted, sequence-specific silencing of one message. Because the block depends on an exact sequence match, it hits **only the intended mRNA** and leaves the rest of the cell running normally.",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'The Tobacco–Nematode Rescue',
      objective: "By the end of this you can trace how Agrobacterium-delivered genes make a tobacco plant produce dsRNA that silences the nematode and saves the crop.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Now watch how NCERT puts RNAi to work against the root nematode.\n\nUsing **_Agrobacterium_ vectors**, scientists introduced **nematode-specific genes** into the host tobacco plant. The clever part is *how* those genes were designed. The introduced DNA was arranged so that, inside the host cells, it produced **both sense RNA and anti-sense RNA**. These two are complementary to each other, so they pair up and form a **double-stranded RNA (dsRNA)**.\n\nThat dsRNA is exactly the trigger RNAi needs. It **initiated RNA interference and silenced the specific mRNA of the nematode**. When the worm feeds on the transgenic root, the silencing shuts down a gene it cannot live without. The result NCERT states plainly: **the parasite could not survive in the transgenic host** expressing the interfering RNA — so the **transgenic plant protected itself** from the parasite. The plant didn't attack the worm; it simply switched off a gene the worm needed, from the inside.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'Diagram of a transgenic tobacco root producing sense and anti-sense RNA that pair into dsRNA, silencing the mRNA of a feeding nematode so the parasite cannot survive',
      caption: '📸 Tap each dot to follow how the plant-made dsRNA silences the nematode (Figure 10.2)',
      hotspots: [
        { id: uuid(), x: 0.18, y: 0.30, label: 'Agrobacterium delivers the gene', icon: 'circle',
          detail: 'An **_Agrobacterium_ vector** is used to introduce **nematode-specific genes** into the host tobacco plant. This is the delivery step that sets everything up.' },
        { id: uuid(), x: 0.30, y: 0.60, label: 'Sense + anti-sense RNA', icon: 'circle',
          detail: 'Inside the host root cells, the introduced DNA is designed to make **both a sense RNA and an anti-sense RNA**. The two are complementary — they carry matching sequences.' },
        { id: uuid(), x: 0.50, y: 0.50, label: 'They pair into dsRNA', icon: 'circle',
          detail: 'Because they are complementary, the sense and anti-sense strands pair up to form a **double-stranded RNA (dsRNA)**. This dsRNA is the trigger that starts RNA interference.' },
        { id: uuid(), x: 0.68, y: 0.62, label: "Nematode's mRNA silenced", icon: 'circle',
          detail: 'The dsRNA is complementary to a **specific mRNA of the nematode**. It binds that mRNA and blocks its translation — the message is **silenced** and its protein is never made.' },
        { id: uuid(), x: 0.82, y: 0.32, label: 'Parasite cannot survive', icon: 'circle',
          detail: 'With an essential gene switched off, the **nematode cannot survive** in the transgenic root. The **tobacco plant is protected** — without any pesticide.' },
      ],
      generation_prompt: "Scientific textbook illustration matching NCERT Figure 10.2 — host plant-generated dsRNA triggering protection against nematode infestation. Flat 2D educational diagram on a dark background (#0a0a0a near-black), clean white outlines, labels in white with thin white leader lines. On the left, a small Agrobacterium cell (green outline) delivering a gene into a tobacco root cell. Inside the root cell (root tissue in green/tan), show a strand of sense RNA and a strand of anti-sense RNA (drawn in purple/magenta for nucleic acid) coming together to form a clearly double-stranded RNA ladder. An arrow leads to a nematode roundworm shape (pink/tan animal tissue) feeding at the root, with its single-stranded mRNA shown being bound and blocked by the dsRNA (a clear 'silenced' cross or block mark on the mRNA). Far right: the nematode drawn faded/shrivelled to show it cannot survive, beside a healthy protected root. Biologically accurate proportions, left-to-right process flow, evenly spaced, no baked-in text labels. No photorealism, no cartoon, no mascots, standard biology textbook illustration conventions.",
    },
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'Why Bother? The Benefits of GM Crops',
      objective: "By the end of this you can list the five benefits of genetic modification NCERT gives and pin the golden-rice example to the right one.",
    },
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "The nematode story is one win, but it sits inside a bigger picture. Any plant, bacterium, fungus or animal whose genes have been altered by human manipulation is a **Genetically Modified Organism (GMO)**. NCERT lists **five concrete ways** genetic modification has helped:\n\n1. Made crops **more tolerant to abiotic stresses** — cold, drought, salt and heat.\n2. **Reduced reliance on chemical pesticides** — by creating pest-resistant crops (exactly like the RNAi tobacco above, and Bt crops).\n3. Helped **reduce post-harvest losses**.\n4. **Increased the efficiency of mineral use** by plants, which stops the soil's fertility being exhausted early.\n5. **Enhanced the nutritional value of food** — the standout example is **golden rice**, rice enriched with **Vitamin 'A'**.\n\nBeyond these, GM has been used to make **tailor-made plants** that supply industry with alternative resources — **starches, fuels and pharmaceuticals**. Keep the five-item list tight in your head; NEET lifts it almost word for word.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "A transgenic tobacco root makes both sense and anti-sense RNA against a nematode gene. Feeding nematodes then die on it. What is the single event that directly stops the parasite?",
      options: [
        "The plant secretes a toxic protein that poisons the nematode's gut, like Bt toxin does",
        "The sense and anti-sense RNAs pair into dsRNA, which silences a specific nematode mRNA so its essential protein is never made",
        "The Agrobacterium vector infects and kills the nematode directly",
        "The plant's own DNA is cut, removing the gene the nematode needs",
      ],
      correct_index: 1,
      reveal: "The two complementary RNAs pair into dsRNA, and that dsRNA binds and silences a specific nematode mRNA — with the message blocked, an essential protein is never translated, so the parasite cannot survive. The Bt-toxin option is the classic trap: that is a *different* pest-resistance strategy (a toxic protein), whereas RNAi silences a gene without any toxin. Agrobacterium is only the delivery vehicle for the genes, it does not attack the worm, and RNAi acts on the mRNA message — the DNA is never cut.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember', title: 'Lock These In',
      markdown: "- **RNAi** = silencing a **specific mRNA** because a **complementary dsRNA** binds it and **stops translation**. Occurs in **all eukaryotes** as cellular defence.\n- Natural sources of the interfering RNA: **RNA-genome viruses** and **transposons** (mobile elements replicating via an RNA intermediate).\n- Nematode job: **_Meloidogyne incognita_** infects **tobacco roots**. **_Agrobacterium_ vectors** introduced nematode genes → host made **sense + anti-sense RNA** → **dsRNA** → silenced the **nematode's mRNA** → **parasite couldn't survive**.\n- **Five GM benefits:** (i) tolerance to **abiotic stress** (cold/drought/salt/heat); (ii) **less chemical pesticide**; (iii) **less post-harvest loss**; (iv) **better mineral-use efficiency**; (v) **more nutrition** — e.g. **golden rice = Vitamin 'A'**.",
    },
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**RNAi definition:** the key phrase is *silencing of a specific mRNA by a complementary dsRNA that prevents its translation*. If an option says RNAi cuts DNA or blocks transcription, it is wrong — RNAi acts on the **mRNA** and blocks **translation**.\n\n**The nematode:** **_Meloidogyne incognita_** on **tobacco roots** — expect its name and host as a direct one-mark match.\n\n**Sense + anti-sense → dsRNA:** the two RNAs are **complementary** and pair into dsRNA; that dsRNA is what starts RNAi. 'Only anti-sense RNA' is the planted wrong answer.\n\n**Golden rice** always maps to **enhanced nutritional value (Vitamin 'A')** — not pest resistance, not abiotic-stress tolerance.\n\n**Classic NEET question:** \"RNA interference used to develop nematode-resistant tobacco works by ______.\" → **silencing the specific mRNA of the nematode using a complementary dsRNA.**",
    },
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "So a crop can now defend itself two ways — by making a toxic protein (the Bt story from the last page) or by silencing a pest's own genes with RNAi. Next we leave the farm and follow biotechnology into the clinic, where the same recombinant DNA tools are used to mass-produce safe medicines for humans.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'RNA interference (RNAi) protects a cell by acting on which molecule, and how?',
          options: [
            'It cuts the pathogen\'s DNA, permanently deleting the harmful gene',
            'It blocks transcription so the pathogen\'s DNA is never copied into RNA',
            'It coats the ribosome so that no protein at all can be made in the cell',
            'It silences a specific mRNA, because a complementary dsRNA binds it and prevents translation',
          ],
          correct_index: 3,
          explanation: "RNAi works at the mRNA level: a complementary dsRNA binds the specific mRNA and stops it being translated, so that one protein is never made. It does not cut DNA (the gene stays intact) and it does not block transcription — the mRNA is made, then silenced. It is also sequence-specific, so it targets one mRNA, not all protein synthesis in the cell.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'In the NCERT example, how was the tobacco plant made resistant to the nematode Meloidogyne incognita?',
          options: [
            'Bt toxin genes from Bacillus thuringiensis were added so the roots produce an insecticidal crystal protein',
            'Nematode-specific genes were introduced via Agrobacterium so the host made sense and anti-sense RNA that formed dsRNA and silenced the nematode\'s mRNA',
            'The nematode\'s DNA was directly edited inside the root using a restriction enzyme',
            'The plant was sprayed with a complementary dsRNA that the roots absorbed from the soil',
          ],
          correct_index: 1,
          explanation: "Agrobacterium vectors carried nematode-specific genes into the tobacco; the host then made both sense and anti-sense RNA, which paired into dsRNA and silenced the nematode's mRNA, so the parasite could not survive. Bt toxin is the separate pest-resistance strategy for insects, not this RNAi case. The plant's own machinery makes the dsRNA internally — it is not edited inside the worm and not absorbed as a spray.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'Golden rice is cited by NCERT as an example of which benefit of genetically modified crops?',
          options: [
            'Greater tolerance to abiotic stresses such as cold and drought',
            'Reduced reliance on chemical pesticides',
            "Enhanced nutritional value of food — it is enriched with Vitamin 'A'",
            'Reduced post-harvest losses during storage',
          ],
          correct_index: 2,
          explanation: "Golden rice is NCERT's example of GM enhancing the nutritional value of food, because it is enriched with Vitamin 'A'. The other options are all genuine GM benefits from the same NCERT list, which is exactly what makes them tempting — but abiotic-stress tolerance, pesticide reduction and post-harvest loss are separate points; golden rice belongs specifically to the nutrition benefit.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'Which of these is NOT one of the ways NCERT says genetic modification has helped crops?',
          options: [
            'Made crops grow taller by permanently deleting their flowering genes',
            'Made crops more tolerant to cold, drought, salt and heat',
            'Increased the efficiency with which plants use minerals',
            'Reduced post-harvest losses',
          ],
          correct_index: 0,
          explanation: "Deleting flowering genes to grow taller is not in NCERT's list — it is invented. The genuine NCERT benefits include better tolerance to abiotic stress, more efficient mineral use, reduced post-harvest losses, less chemical pesticide, and enhanced nutrition. The trap works because the three real options are lifted straight from the NCERT list, so the fabricated one is the only correct answer to a 'NOT' question.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
