'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'centrosome-and-the-nucleus',
  title: 'Centrosome, Centrioles, and the Nucleus',
  subtitle: "One organelle that builds the spindle when a cell divides, and one that quietly does without a name tag once described by a botanist in 1831. Two structures, both essential, both easy to picture once you see them.",
  page_number: 9,
  page_type: 'lesson',
  tags: ['cell-the-unit-of-life', 'centrosome', 'nucleus'],
  glossary: [
    { term: 'centrosome', definition: 'An organelle usually containing two cylindrical structures called centrioles, surrounded by amorphous pericentriolar material.' },
    { term: 'centriole', definition: 'A cylindrical structure inside the centrosome, made of nine peripheral triplets of tubulin protein arranged in a cartwheel pattern. Forms the basal body of cilia and flagella, and gives rise to the spindle fibres during animal-cell division.' },
    { term: 'hub', definition: "The proteinaceous central part of a centriole's proximal region, connected to the nine peripheral triplets by radial spokes." },
    { term: 'chromatin', definition: 'The highly extended, elaborate nucleoprotein fibres that fill an interphase nucleus, named by Flemming after the basic dyes that stain it.' },
    { term: 'perinuclear space', definition: 'The 10 to 50 nm gap between the two parallel membranes of the nuclear envelope.' },
    { term: 'nuclear pore', definition: 'A minute opening in the nuclear envelope, formed where its two membranes fuse, that lets RNA and protein move in both directions between nucleus and cytoplasm.' },
    { term: 'nucleolus', definition: 'A spherical, non-membrane-bound body inside the nucleoplasm that is the site of active ribosomal RNA synthesis.' },
  ],
  blocks: [
    // ── hero ─────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A cell interior at dusk with a glowing cartwheel-shaped structure near the centre and a large softly-lit sphere holding it in place',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). The interior of a single animal cell rendered as a vast dim chamber at dusk. Near the centre-left, a small pair of short cylindrical structures glow faintly, arranged at right angles to one another, each with a delicate spoked cartwheel pattern visible end-on, suggesting quiet architectural precision. To the right, a large smooth spherical form dominates the frame, softly lit from within, its surface faintly granular, with the faintest hint of a smaller sphere nested just inside it. Deep dusk lighting, a single warm glow tying both structures together across the frame, painterly and atmospheric illustration style, dark naturalistic background throughout (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    // ── fun_fact ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'A Structure Named 195 Years Before Anyone Understood It',
      markdown: "The **nucleus** was first described as a cell organelle by **Robert Brown**, all the way back in **1831** — decades before anyone had worked out chromosomes, DNA, or cell division. He simply saw a dense, distinct body sitting inside the cell and gave it a name. Everything you're about to learn about it — chromatin, the double membrane, the pores that let molecules pass through — was worked out much later, one discovery at a time.",
    },
    // ── heading: centrosome and centrioles ──────────────────────────────
    {
      id: uuid(), type: 'heading', order: 2, level: 2,
      text: 'Centrosome and Centrioles — The Cartwheel Inside Every Animal Cell',
      objective: 'By the end of this you can describe the internal structure of a centriole and name the two jobs centrioles do for the cell.',
    },
    {
      id: uuid(), type: 'text', order: 3,
      markdown: "The **centrosome** is an organelle usually containing **two cylindrical structures called centrioles**, surrounded by **amorphous pericentriolar material**. The two centrioles inside a centrosome don't sit parallel to each other — they lie **perpendicular** to one another, and each one is built like a **cartwheel**.\n\nLook closely at that cartwheel and here's what you'd find: each centriole is made up of **nine evenly spaced peripheral fibrils of tubulin protein**, and each of those peripheral fibrils is a **triplet** — three tubules bundled together, not one. The adjacent triplets are also **linked** to each other, holding the ring together. At the centre of the proximal region sits the **hub**, itself made of protein, and the hub is connected to the peripheral triplets by **radial spokes**, also made of protein — like the spokes of a wheel running from the axle out to the rim.\n\nThis structure isn't decoration. The centrioles form the **basal body of cilia or flagella**, and they also give rise to the **spindle fibres** that build the **spindle apparatus** during cell division in animal cells. One structure, one cartwheel design, two completely different jobs depending on what the cell needs.",
    },
    // ── interactive image: centriole structure ──────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 4, src: '',
      alt: 'End-on cartwheel view of a centriole showing nine peripheral triplets of tubulin, the central hub, and the radial spokes connecting them, with a second centriole shown lying perpendicular to it',
      caption: '📸 Tap each part of the centriole to see what it is and what it connects to',
      generation_prompt: "Scientific textbook illustration of centriole structure. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Main view: a single centriole shown end-on as a perfect cartwheel — nine evenly spaced peripheral fibril bundles arranged in a ring, each bundle clearly drawn as three thin parallel tubules (a triplet) bound tightly together, clean white outlines. At the very centre of the ring, a small solid circular hub. Thin straight white radial spoke lines run from the central hub outward to each of the nine peripheral triplets, like spokes of a wheel. To the side of this main cartwheel view, a smaller secondary cylindrical centriole is drawn lying at a right angle (perpendicular) to the main one, showing the pair's characteristic perpendicular arrangement inside a centrosome, with a faint amorphous cloud-like shading around both representing the pericentriolar material. No baked-in text labels, no photorealism, biologically accurate proportions, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.08, label: 'Perpendicular pair', icon: 'circle',
          detail: "A centrosome usually has **two centrioles**, and they lie **perpendicular to each other** — not side by side. Each one is organised like a **cartwheel**." },
        { id: uuid(), x: 0.5, y: 0.5, label: 'Hub', icon: 'circle',
          detail: "The **central part of the proximal region** of the centriole. It is **proteinaceous** and sits at the very middle of the cartwheel." },
        { id: uuid(), x: 0.5, y: 0.32, label: 'Radial spokes', icon: 'circle',
          detail: "Made of **protein**. They connect the central **hub** to the tubules of the **peripheral triplets** — like spokes running from an axle to a wheel's rim." },
        { id: uuid(), x: 0.82, y: 0.5, label: 'Peripheral triplet', icon: 'circle',
          detail: "The centriole is built of **nine evenly spaced peripheral fibrils of tubulin protein**. Each peripheral fibril is a **triplet**, and **adjacent triplets are also linked** to one another." },
        { id: uuid(), x: 0.5, y: 0.85, label: 'What centrioles build', icon: 'circle',
          detail: "Centrioles form the **basal body of cilia or flagella**, and also give rise to the **spindle fibres** that build the **spindle apparatus** during cell division in animal cells." },
      ],
    },
    // ── reasoning prompt: centriole structure ────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 5, reasoning_type: 'logical',
      prompt: "A textbook diagram labels one peripheral fibril of a centriole as 'a single tubulin tubule.' A student studying the same centriole under NCERT's description says this label is incomplete. What is the student's reasoning?",
      options: [
        "NCERT states each peripheral fibril is a triplet — three tubules bundled together — not a single tubule, so calling it 'a single tubulin tubule' leaves out two-thirds of its actual structure",
        "NCERT states centrioles have no tubulin at all; the fibrils are made purely of the hub protein, so the label is wrong about the material, not just the count",
        "The student is mistaken — NCERT does describe each peripheral fibril as a single tubule, matching the diagram exactly",
        "NCERT describes six peripheral fibrils per centriole, not nine, so the diagram's real error is the total count of fibrils rather than what each fibril contains",
      ],
      correct_index: 0,
      reveal: "NCERT is precise here: the centriole is made of nine evenly spaced peripheral fibrils of tubulin protein, and each of those peripheral fibrils is a triplet — three tubules together, not one. A label calling it 'a single tubulin tubule' undercounts what's actually there. The fibrils genuinely are made of tubulin, so the material itself isn't the error; and the count of peripheral fibrils is nine, not six, so that isn't where the diagram goes wrong either — the missing detail is specifically the triplet structure of each fibril.",
      difficulty_level: 3,
    },
    // ── heading: nucleus ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'The Nucleus — A Double Membrane With Gated Passages',
      objective: "By the end of this you can describe the nuclear envelope's structure and explain what nuclear pores actually let through.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "The nucleus was first described as a cell organelle by **Robert Brown in 1831**. Later, the material inside the nucleus that stained readily with basic dyes was given a name by **Flemming**, who called it **chromatin**.\n\nAn **interphase nucleus** — the nucleus of a cell that isn't currently dividing — has **highly extended and elaborate nucleoprotein fibres called chromatin**, a **nuclear matrix**, and **one or more spherical bodies called nucleoli** (singular: nucleolus).\n\nElectron microscopy shows exactly what the boundary of the nucleus is made of. The **nuclear envelope** consists of **two parallel membranes**, with a gap between them of **10 to 50 nm** called the **perinuclear space**. Together, this double membrane forms a **barrier between the material inside the nucleus and the cytoplasm outside it**. The **outer membrane** usually stays **continuous with the endoplasmic reticulum**, and it also **bears ribosomes** on its surface — so the nuclear envelope is directly connected to the ER network you've already met.\n\nThat barrier isn't sealed shut, though. At a number of places, the nuclear envelope is **interrupted by minute pores**, formed by the **fusion of its two membranes**. These **nuclear pores** are the actual passages through which **RNA and protein molecules move in both directions** between the nucleus and the cytoplasm — nothing gets in or out of the nucleus except through one of these gated openings.",
    },
    // ── interactive image: nucleus structure (Figure 8.11) ───────────────
    {
      id: uuid(), type: 'interactive_image', order: 8, src: '',
      alt: 'Cross-section of a nucleus showing the double nuclear membrane with a nuclear pore, the perinuclear space, the nucleoplasm, and a nucleolus inside it',
      caption: '📸 Tap each part of Figure 8.11 to see what it is and what it does',
      generation_prompt: "Scientific textbook illustration matching NCERT Figure 8.11, structure of the nucleus. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A large rounded nucleus shown in cross-section. The nuclear boundary is drawn as two thin, closely-spaced concentric white outlines (a double membrane) with a very narrow visible gap between them running the full circumference. At one point on this double boundary, a small circular break shows the two membranes fusing into a single ring-shaped opening, representing a nuclear pore. Inside the nucleus, the interior space (nucleoplasm) is shown with a subtle granular texture, and one clearly bounded but non-membraned spherical body sits within it, denser and darker than the surrounding nucleoplasm, representing the nucleolus. No baked-in text labels, no photorealism, clean white outlines throughout, biologically accurate proportions, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.08, label: 'Nuclear membrane (envelope)', icon: 'circle',
          detail: "Made of **two parallel membranes**. Forms a **barrier** between the nucleus's contents and the cytoplasm. The **outer membrane** stays **continuous with the ER** and **bears ribosomes**." },
        { id: uuid(), x: 0.72, y: 0.18, label: 'Perinuclear space', icon: 'circle',
          detail: "The **space between the two membranes** of the nuclear envelope, measuring **10 to 50 nm**." },
        { id: uuid(), x: 0.86, y: 0.42, label: 'Nuclear pore', icon: 'circle',
          detail: "Formed where the **two membranes fuse** at points along the envelope. These are the **passages** through which **RNA and protein move in both directions** between the nucleus and cytoplasm." },
        { id: uuid(), x: 0.5, y: 0.55, label: 'Nucleoplasm (nuclear matrix)', icon: 'circle',
          detail: "The material filling the nucleus, containing the **nucleolus** and the **chromatin**." },
        { id: uuid(), x: 0.42, y: 0.55, label: 'Nucleolus', icon: 'circle',
          detail: "A spherical body in the nucleoplasm. It is **not membrane-bound**, so its content is **continuous with the rest of the nucleoplasm**. It is a site for **active ribosomal RNA synthesis**. Cells actively making proteins have **larger and more numerous nucleoli**." },
      ],
    },
    // ── mid-page reasoning check: nucleus-less cells ─────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "NCERT says normally there is only one nucleus per cell, though variations in nuclear number are frequently observed — and then adds that some mature cells even lack a nucleus altogether. Which two examples does NCERT actually give for cells that lack a nucleus?",
      options: [
        "Erythrocytes of many mammals, and sieve tube cells of vascular plants",
        "Neurons of the human brain, and root hair cells of vascular plants",
        "Erythrocytes of all vertebrates without exception, and companion cells of vascular plants",
        "Muscle cells of mammals, and guard cells of vascular plants",
      ],
      correct_index: 0,
      reveal: "NCERT names exactly two examples: erythrocytes (red blood cells) of many mammals, and the sieve tube cells of vascular plants — both are mature cells that carry out their jobs without a nucleus at all. It's 'many mammals,' not every vertebrate, since plenty of non-mammalian vertebrates keep a nucleus in their red blood cells. Neurons, root hair cells, muscle cells, and guard cells are none of them NCERT's actual examples here — companion cells sit right next to sieve tubes but do keep their nucleus, which is exactly why sieve tube cells rely on them.",
      difficulty_level: 3,
    },
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "The **nuclear matrix**, or nucleoplasm, contains the **nucleolus** and the **chromatin**. Nucleoli are spherical structures sitting inside the nucleoplasm, and here's the detail that trips people up: the content of a nucleolus is **continuous with the rest of the nucleoplasm**, precisely because it is **not a membrane-bound structure** — unlike almost every other organelle you've studied so far, there's no membrane separating a nucleolus from the nucleoplasm around it.\n\nWhat is the nucleolus actually doing in there? It is a site for **active ribosomal RNA synthesis**. And cells that are busy **actively carrying out protein synthesis** show it directly in their nucleus — they have **larger and more numerous nucleoli**, because more rRNA has to be made to keep feeding the ribosomes.",
    },
    // ── remember ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember', title: 'Lock These In',
      markdown: "- A centriole is made of **nine peripheral triplets of tubulin**, linked to a central **hub** by **radial spokes** — the whole thing is organised like a **cartwheel**.\n- The two centrioles in a centrosome lie **perpendicular** to each other.\n- Centrioles form the **basal body of cilia/flagella** AND the **spindle fibres** in animal cell division.\n- The nuclear envelope is **two membranes** with a **10–50 nm perinuclear space** between them; the **outer membrane** is continuous with the **ER** and bears **ribosomes**.\n- **Nuclear pores** form where the two membranes **fuse**, and let **RNA and protein** pass **both ways**.\n- The **nucleolus is not membrane-bound** — its content is continuous with the nucleoplasm. It makes **rRNA**.\n- Mature cells that **lack a nucleus**: **erythrocytes of many mammals** and **sieve tube cells of vascular plants**.",
    },
    // ── exam tip ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**The nucleus-less-cell exception:** NEET repeatedly tests NCERT's two named examples of mature cells without a nucleus — **erythrocytes of many mammals** and **sieve tube cells of vascular plants**. NCERT itself asks a reflective question after stating this: 'Would you consider these cells as living?' It doesn't hand you an answer — that's left as a discussion point, not a fact to memorise, so don't force one into your notes as if NCERT stated it directly.\n\n**Centriole numbers, exactly as NCERT states them:** nine peripheral triplets, one central hub, radial spokes connecting them. If a question changes any of these numbers — six triplets, a doublet instead of a triplet, two hubs — that's the trap.\n\n**Nuclear pore function:** memorise it as bidirectional — RNA and protein move **both ways**, nucleus to cytoplasm and cytoplasm to nucleus, through pores formed by the **fusion** of the two nuclear membranes.\n\n**Classic NEET question:** \"Name two examples of mature, nucleus-lacking cells given by NCERT.\" → Erythrocytes of many mammals; sieve tube cells of vascular plants.",
    },
    // ── bridge ────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "You've now seen the nucleus from the outside in — envelope, pores, nucleoplasm, nucleolus. The next page opens up the chromatin itself, and the loose, indistinct network of nucleoprotein fibres that will eventually condense into chromosomes.",
    },
    // ── quiz ──────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'How are the two centrioles arranged relative to each other inside a centrosome?',
          options: [
            'Parallel to each other, joined end to end',
            'Perpendicular to each other, each organised like a cartwheel',
            'Stacked directly on top of one another, sharing a single hub',
            'Randomly oriented, with no fixed relationship',
          ],
          correct_index: 1,
          explanation: "NCERT states the two centrioles lie perpendicular to each other, and each one has an organisation like a cartwheel. They are not parallel, not stacked sharing one hub — each centriole has its own hub — and their arrangement is a fixed, defined feature, not random.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'Each peripheral fibril of a centriole is made of tubulin protein. How is each peripheral fibril structured?',
          options: ['As a single tubule', 'As a doublet of two tubules', 'As a triplet of three tubules', 'As a bundle of nine tubules'],
          correct_index: 2,
          explanation: "NCERT is explicit that each peripheral fibril is a triplet. A single tubule or a doublet undercounts the structure, and nine tubules per fibril would mean eighty-one tubules total across the centriole, far more than NCERT describes — nine is the count of peripheral fibrils, not the tubules within one fibril.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'What forms a nuclear pore, and what does NCERT say passes through it?',
          options: [
            'Formed by fusion of the two nuclear membranes; lets RNA and protein move in both directions between nucleus and cytoplasm',
            'Formed by a break in the outer membrane alone; lets only proteins leave the nucleus',
            'Formed by fusion of the two nuclear membranes; lets only RNA enter the nucleus from the cytoplasm',
            'Formed by the folding of the endoplasmic reticulum around the nucleus; lets ribosomes pass through',
          ],
          correct_index: 0,
          explanation: "NCERT states nuclear pores form where the two nuclear membranes fuse, and that RNA and protein molecules move through them in both directions, not just one. The pore involves both membranes fusing, not a break in a single membrane, and it is not built from folded ER — the ER is merely continuous with the outer nuclear membrane, a separate fact.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'Why is the content of a nucleolus described as continuous with the rest of the nucleoplasm?',
          options: [
            'Because the nucleolus is filled with the same chromatin fibres found throughout the nucleus',
            'Because the nucleolus is not a membrane-bound structure, so nothing separates it from the surrounding nucleoplasm',
            'Because the nucleolus dissolves completely during every interphase and reforms afterward',
            'Because nuclear pores connect the nucleolus directly to the cytoplasm outside the nucleus',
          ],
          correct_index: 1,
          explanation: "NCERT gives the reason directly: the nucleolus is not a membrane-bound structure, which is exactly why its content is continuous with the rest of the nucleoplasm around it. It isn't simply made of chromatin, its continuity isn't about dissolving and reforming, and nuclear pores connect the nucleus to the cytoplasm generally, not the nucleolus specifically.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
