'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-endomembrane-system',
  title: 'The Endomembrane System',
  subtitle: "ER, golgi apparatus, lysosomes and vacuoles aren't four separate parts — they're one coordinated chain. Mitochondria and chloroplasts, despite being membrane-bound too, are deliberately left out of it.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['cell-the-unit-of-life', 'endomembrane-system', 'endoplasmic-reticulum', 'golgi-apparatus'],
  glossary: [
    { term: 'endomembrane system', definition: 'The group of organelles — endoplasmic reticulum, golgi complex, lysosomes, and vacuoles — studied together because their functions are coordinated.' },
    { term: 'endoplasmic reticulum (ER)', definition: "A network of tiny tubular structures in the cytoplasm that divides the cell's interior into luminal (inside ER) and extra luminal (cytoplasm) compartments." },
    { term: 'rough endoplasmic reticulum (RER)', definition: 'ER studded with ribosomes on its outer surface; frequent in cells active in protein synthesis and secretion, and continuous with the outer membrane of the nucleus.' },
    { term: 'smooth endoplasmic reticulum (SER)', definition: 'ER with no ribosomes on its surface; the major site of lipid synthesis, including steroidal hormones in animal cells.' },
    { term: 'cisternae', definition: 'The flat, disc-shaped sacs, 0.5 to 1.0 µm across, that stack up to form the golgi apparatus.' },
    { term: 'cis (forming) face', definition: 'The convex face of the golgi apparatus, where vesicles arriving from the ER fuse in.' },
    { term: 'trans (maturing) face', definition: 'The concave face of the golgi apparatus, where processed material is finally released.' },
    { term: 'lysosome', definition: 'A membrane-bound vesicle formed by golgi packaging, rich in hydrolytic enzymes active at acidic pH.' },
    { term: 'tonoplast', definition: 'The single membrane that bounds a vacuole.' },
    { term: 'contractile vacuole', definition: 'A specialised vacuole in Amoeba responsible for osmoregulation and excretion.' },
  ],
  blocks: [
    // ── hero ─────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark, atmospheric scene of glowing membrane-bound vesicles drifting and merging in sequence through a dim cellular landscape',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A dark, atmospheric microscope-inspired scene: in a deep dark void lit by a warm amber glow, a chain of soft translucent membrane-bound vesicles and folded tubular forms drift in a loose sequence from left to right, each one slightly larger and more defined than the last, suggesting material moving and being reshaped step by step through a hidden internal pathway. None of these are literal labelled diagrams — just quiet glowing organic forms passing from a tangled network on the left, through a stack of curved layered discs in the centre, toward a few small rounded droplets drifting free on the right. Deep, atmospheric lighting, one soft warm glow tying the whole scene together, painterly illustration style, dark background tones throughout (#0a0a0a base), no text, no labels, no diagram elements.",
    },
    // ── fun_fact ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: "A Plant Cell That's Almost All Empty Space",
      markdown: "Look at a mature plant cell and you might assume most of it is packed with machinery. It isn't. NCERT notes that in plant cells, the **vacuole** — a single membrane-bound sac called the tonoplast — can take up **up to 90 percent of the cell's volume**. Everything else you'll meet on this page — the endoplasmic reticulum, the golgi apparatus, the lysosomes — works inside the remaining 10 percent, alongside the nucleus and every other organelle.",
    },
    // ── core concept: what the endomembrane system is (and isn't) ─────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "A cell isn't a bag of separate organelles working alone. Look at the endoplasmic reticulum, the golgi complex, lysosomes, and vacuoles together, and NCERT groups them under one name: the **endomembrane system** — not because they look alike, but because their functions are **coordinated**. Material moves from one to the next in a working chain, which is exactly why biologists study them as a connected system rather than four isolated parts.\n\nMitochondria, chloroplasts, and peroxisomes are membrane-bound too, but they're deliberately left out of this group. Their functions are **not coordinated** with the ER-golgi-lysosome-vacuole chain, so NCERT keeps them out of the endomembrane system entirely — even though they're every bit as membrane-bound as the others.",
    },
    // ── heading: ER ──────────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Endoplasmic Reticulum (ER): One Network, Two Jobs',
      objective: "By the end of this you can tell rough ER from smooth ER on sight — and say exactly what each one is for.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Look at a eukaryotic cell under an electron microscope and you'll find a network, or **reticulum**, of tiny tubular structures scattered through the cytoplasm — this is the **endoplasmic reticulum (ER)** (Figure 8.5). Because this network runs through the cytoplasm, it splits the cell's interior into two separate compartments: the space **inside the ER** is called **luminal**, and the space **outside the ER**, in the surrounding cytoplasm, is called **extra luminal**.\n\nLook closer and the ER comes in two forms, and the difference is just one thing sitting on its outer surface: **ribosomes**. ER studded with ribosomes on its outer surface is called **rough endoplasmic reticulum (RER)**. ER with no ribosomes on its surface looks smooth, and is called **smooth endoplasmic reticulum (SER)**.\n\nThat one difference decides what each form is for. **RER** turns up most often in cells that are actively making and secreting protein — it's extensive, and stays **continuous with the outer membrane of the nucleus**. **SER** is the cell's major site for making **lipids**; in animal cells specifically, steroid-type hormones are synthesised in SER.",
    },
    // ── interactive image: Figure 8.5 ───────────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A labelled diagram of the endoplasmic reticulum, showing ribosome-studded rough ER continuous with the nuclear envelope, and ribosome-free smooth ER',
      caption: '📸 Tap each dot to explore the ER — Figure 8.5',
      generation_prompt: "Scientific textbook illustration of the endoplasmic reticulum, matching NCERT Figure 8.5. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Show a section of a eukaryotic cell's cytoplasm with an irregular tubular network of pale, thin-walled channels spreading through the space — the endoplasmic reticulum. On the left side, the network stays close to and merges directly into the outer boundary of a large rounded nuclear envelope; along this left section, the tubule walls are covered with many small dark dots studding the outer surface — ribosomes — marking this portion as rough ER. On the right side, the same tubular network continues but its walls are completely bare, with no dots on the surface at all — smooth ER. A subtle shading difference marks the space enclosed within the tubules (lighter) versus the surrounding cytoplasm outside them (darker), suggesting the two separate compartments. Clean white outlines throughout, no photorealism, no cartoon, no mascots, no text or labels baked into the image itself, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.28, y: 0.18, label: 'Nuclear envelope', icon: 'circle',
          detail: "RER stays **continuous with the outer membrane of the nucleus** — the two are one connected system, not separate structures." },
        { id: uuid(), x: 0.35, y: 0.38, label: 'Rough ER (RER)', icon: 'circle',
          detail: "ER studded with **ribosomes** on its outer surface. Frequent in cells actively involved in protein synthesis and secretion." },
        { id: uuid(), x: 0.46, y: 0.26, label: 'Ribosomes on the surface', icon: 'circle',
          detail: "The one feature that makes ER 'rough.' Take them away and the very same network turns smooth." },
        { id: uuid(), x: 0.74, y: 0.58, label: 'Smooth ER (SER)', icon: 'circle',
          detail: "ER with **no ribosomes** on its surface. The cell's major site for making **lipids** — in animal cells, this includes steroidal hormones." },
        { id: uuid(), x: 0.56, y: 0.76, label: 'Luminal vs extra luminal space', icon: 'circle',
          detail: "The ER network splits the cell's interior into two compartments: **luminal** (inside the ER) and **extra luminal** (the surrounding cytoplasm)." },
      ],
    },
    // ── mid-page reasoning check ─────────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A gland cell that specialises in making and secreting large amounts of protein would be expected to be packed with which kind of ER — and why?",
      options: [
        "Smooth ER, because its ribosome-free tubules move finished proteins out of the cell faster",
        "Rough ER, because ribosomes studding its surface are exactly where those proteins are made, and RER is frequent in cells active in protein synthesis and secretion",
        "Smooth ER, because only SER stays continuous with the nuclear envelope",
        "Rough ER, because rough ER is the cell's main site of lipid synthesis",
      ],
      reveal: "RER's defining feature is ribosomes on its surface — the actual protein-making machinery — which is exactly why NCERT says RER is frequently seen in cells actively involved in protein synthesis and secretion. It's RER, not SER, that stays continuous with the nuclear envelope, so the third option reverses that fact; and lipid synthesis is SER's job, not RER's, so the fourth option swaps the two forms' functions. SER has no ribosomes at all, so it isn't the one 'moving proteins' either.",
      difficulty_level: 2,
    },
    // ── heading: golgi apparatus ─────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'The Golgi Apparatus: A Packaging Line Next Door to the ER',
      objective: "By the end of this you can trace a vesicle's path through the golgi apparatus, cis face to trans face, in order.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "In 1898, **Camillo Golgi** was the first to notice densely stained, net-like structures sitting close to the nucleus of a cell. They were later named **Golgi bodies** after him. Look closely and a golgi body turns out to be a stack of many flat, disc-shaped sacs called **cisternae**, each one **0.5 to 1.0 µm** across (Figure 8.6). These cisternae stack up parallel to each other, and the number stacked together varies from one golgi complex to the next.\n\nThe whole stack sits arranged concentrically near the nucleus, and its two ends look completely different: a convex **cis face**, also called the **forming face**, and a concave **trans face**, also called the **maturing face**. The cis and trans faces are structurally distinct, but they are **interconnected** — material moves from one to the other through the stack.\n\nThe golgi apparatus's main job is **packaging** — wrapping material into vesicles either for delivery to targets inside the cell, or for **secretion outside the cell**. Vesicles carrying material from the ER fuse with the **cis face** first, then move step by step toward the **trans face** as they mature. That's exactly why the golgi apparatus is always found sitting close to the ER — it's waiting to receive what the ER sends it. Along the way, many of the proteins that ribosomes on the ER made get **modified inside the golgi cisternae**, before finally being released from the trans face. This makes the golgi apparatus the cell's principal site for building **glycoproteins and glycolipids**.",
    },
    // ── interactive image: Figure 8.6 ───────────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 9, src: '',
      alt: 'A labelled diagram of the golgi apparatus, showing stacked cisternae with a convex cis face receiving ER vesicles and a concave trans face releasing secretory vesicles',
      caption: '📸 Tap each dot to trace a vesicle through the golgi apparatus — Figure 8.6',
      generation_prompt: "Scientific textbook illustration of the golgi apparatus, matching NCERT Figure 8.6. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Show a stack of five to six flat, curved, disc-shaped sacs (cisternae) nested concentrically like stacked bowls, arranged near a rounded nuclear outline in the background. One end of the stack curves outward as a convex surface (the cis/forming face), the opposite end curves inward as a concave surface (the trans/maturing face). Several small round vesicles are shown approaching and fusing with the convex cis face, arriving from a nearby patch of tubular endoplasmic reticulum drawn at the edge of the frame. On the opposite, concave trans side, one or two small vesicles are shown budding off and pinching away from the stack. Clean white outlines throughout, pale sac walls, no photorealism, no cartoon, no mascots, no text or labels baked into the image itself, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.5, label: 'Cisternae', icon: 'circle',
          detail: "Flat, disc-shaped sacs, **0.5 to 1.0 µm** across, stacked parallel to each other. The number stacked varies between golgi complexes." },
        { id: uuid(), x: 0.22, y: 0.28, label: 'Cis (forming) face', icon: 'circle',
          detail: "The **convex** end of the stack. Vesicles carrying material from the ER **fuse in here first**." },
        { id: uuid(), x: 0.78, y: 0.72, label: 'Trans (maturing) face', icon: 'circle',
          detail: "The **concave** end of the stack. Modified material is finally **released** from here — bound either for secretion or for a target inside the cell." },
        { id: uuid(), x: 0.12, y: 0.16, label: 'Vesicle from the ER', icon: 'circle',
          detail: "Carries packaged material from the ER toward the golgi's cis face — the reason the golgi apparatus always sits close to the ER." },
        { id: uuid(), x: 0.5, y: 0.88, label: 'Glycoprotein / glycolipid formation', icon: 'circle',
          detail: "Proteins made by ER ribosomes are **modified inside the cisternae** before release — golgi is the cell's main site for building glycoproteins and glycolipids." },
      ],
    },
    // ── heading: lysosomes & vacuoles ────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 10, level: 2,
      text: 'Lysosomes and Vacuoles: Two More Endomembrane Parts, Two Very Different Jobs',
      objective: "By the end of this you can explain what makes lysosomes and vacuoles both endomembrane structures — and exactly where they part ways.",
    },
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "**Lysosomes** are membrane-bound vesicles, and the golgi apparatus is exactly where they're built — packaged the same way it packages everything else. Isolate a lysosome and test what's inside, and you'll find it loaded with almost every kind of **hydrolytic enzyme** — hydrolases such as lipases, proteases, and carbohydrases — all working best at an **acidic pH**. Between them, these enzymes can digest carbohydrates, proteins, lipids, and nucleic acids.\n\nA **vacuole** is simply a membrane-bound space inside the cytoplasm, holding water, cell sap, excretory products, or anything else the cell has no further use for. A single membrane called the **tonoplast** bounds it. In plant cells, a vacuole can take up as much as **90 percent of the cell's volume** — the tonoplast keeps pumping ions and other materials **against their concentration gradient**, into the vacuole, which is why the vacuole ends up far more concentrated than the surrounding cytoplasm.\n\nNot every vacuole holds the same thing. In *Amoeba*, a **contractile vacuole** handles **osmoregulation and excretion**. In many protists, a **food vacuole** forms simply by **engulfing food particles**.",
    },
    // ── comparison card ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 12, title: 'Lysosomes vs Vacuoles',
      columns: [
        { heading: 'Lysosomes', points: ['Built by the golgi apparatus through packaging', 'Packed with hydrolytic enzymes (hydrolases — lipases, proteases, carbohydrases)', 'Enzymes work best at acidic pH', 'Digest carbohydrates, proteins, lipids and nucleic acids'] },
        { heading: 'Vacuoles', points: ['A membrane-bound space bound by a single membrane, the tonoplast', 'Holds water, sap, excretory products or unwanted material — no digestive enzymes involved', 'Tonoplast pumps ions and materials against the concentration gradient, into the vacuole', 'Plant cell vacuoles can reach 90% of cell volume; special roles include the contractile vacuole (Amoeba — osmoregulation and excretion) and food vacuoles (protists)'] },
      ],
    },
    // ── remember ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember', title: 'Facts You Cannot Blur Together',
      markdown: "- Endomembrane system = ER + golgi complex + lysosomes + vacuoles — grouped because their functions are **coordinated**.\n- **Ribosomes present = RER; ribosomes absent = SER.** RER stays continuous with the nuclear envelope; SER is the major site of lipid synthesis.\n- Golgi cisternae: the **cis (forming) face is convex**, the **trans (maturing) face is concave** — vesicles enter at cis, exit at trans.\n- Golgi apparatus = principal site of **glycoprotein and glycolipid** formation.\n- Lysosomes are golgi-packaged and full of **hydrolytic enzymes active at acidic pH**.\n- Vacuoles are bound by the **tonoplast**; plant cell vacuoles can be **up to 90%** of cell volume.",
    },
    // ── exam_tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Not part of the endomembrane system:** mitochondria, chloroplasts, and peroxisomes are membrane-bound organelles too, but NCERT explicitly excludes them from the endomembrane system because their functions are **not coordinated** with the ER-golgi-lysosome-vacuole chain. NEET loves a \"which of these is NOT part of the endomembrane system\" question — the answer is always one of these three.\n\n**Lysosomes in one line:** golgi-packaged vesicles, rich in hydrolytic enzymes, optimally active at **acidic pH**.\n\n**Classic NEET question:** \"Cell organelle bound by a single membrane, containing hydrolytic enzymes active at acidic pH\" → **Lysosome**.",
    },
    // ── bridge ───────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 15,
      markdown: "You've now met every member of the endomembrane system — ER, golgi apparatus, lysosomes, and vacuoles — and seen exactly why mitochondria, chloroplasts, and peroxisomes are kept out of that group. Next, you'll step into mitochondria themselves — the organelle NCERT calls the cell's power house.",
    },
    // ── inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 16, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which of the following organelles is NOT considered part of the endomembrane system?',
          options: ['Golgi apparatus', 'Lysosome', 'Mitochondria', 'Endoplasmic reticulum'],
          correct_index: 2,
          explanation: "NCERT groups ER, golgi complex, lysosomes and vacuoles together as the endomembrane system because their functions are coordinated. Mitochondria — along with chloroplasts and peroxisomes — are left out because their functions aren't coordinated with that group, even though they're membrane-bound too. The other three options are all named members of the endomembrane system.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: "An ER that's studded with ribosomes on its outer surface, extensive, and continuous with the nuclear envelope is best described as:",
          options: ['Smooth endoplasmic reticulum', 'Rough endoplasmic reticulum', 'Golgi cisternae', 'Tonoplast'],
          correct_index: 1,
          explanation: "Ribosomes on the surface plus continuity with the nuclear envelope are the two defining features of rough ER (RER), frequent in cells actively making and secreting protein. Smooth ER has no surface ribosomes and is the major site of lipid synthesis instead. Golgi cisternae and the tonoplast are different membranous structures altogether — a cisterna is a golgi sac, and the tonoplast bounds a vacuole, not the ER.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'In the golgi apparatus, vesicles arriving from the ER fuse first with which face, then move toward the other face as they mature?',
          options: [
            'They fuse with the trans (maturing) face first, moving toward the cis (forming) face',
            'They fuse with the cis (forming) face first, moving toward the trans (maturing) face',
            'They fuse simultaneously with both faces at once',
            "They bypass both faces and enter directly through a cisterna's side wall",
          ],
          correct_index: 1,
          explanation: "Vesicles from the ER fuse with the convex cis (forming) face first, then move through the stacked cisternae toward the concave trans (maturing) face, where the modified material is finally released. Reversing the direction, entering both faces at once, or entering through a side wall are not how NCERT describes the golgi's vesicle traffic.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which statement correctly distinguishes a lysosome from a vacuole?',
          options: [
            'Both are golgi-packaged vesicles rich in hydrolytic enzymes active at acidic pH',
            'A lysosome is packed with hydrolytic enzymes active at acidic pH, while a vacuole is a tonoplast-bound space holding water, sap or excretory material',
            'A vacuole is packed with hydrolytic enzymes, while a lysosome stores water and excretory products',
            'Both structures can occupy up to 90 percent of a plant cell\'s volume',
          ],
          correct_index: 1,
          explanation: "Lysosomes are the golgi's enzyme-packed vesicles, active at acidic pH; vacuoles are simple tonoplast-bound spaces holding water, sap, or waste, not enzymes. Swapping which structure holds the enzymes reverses the biology, and the 90 percent volume figure belongs to plant cell vacuoles only, not lysosomes.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
