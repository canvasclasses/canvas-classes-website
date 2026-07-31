'use strict';
// Class 11 Biology — Ch.8 Cell: The Unit of Life — "Practice — NCERT Exercises" page.
// All 14 verbatim NCERT exercises (chapter number 8, from the user-supplied verbatim
// extraction of the EXERCISES section; cross-checked against
// scripts/bio-book/_ncert_pdfs/kebo108.txt), regrouped into 5 revision themes. Every
// fact in the solutions traces to this chapter's own 11 already-published lesson pages
// (dumped and read in full via scripts/livebook-review/_dump_chapter.js class11-biology 8
// before writing) or to the NCERT source text itself. This is the densest, single
// highest-yield NEET chapter in the whole syllabus.
// IDs are hardcoded static strings (generated once), NOT dynamic uuid() calls —
// see the 2026-07-30 lesson in CONTRACT.md on why that matters for idempotency.
module.exports = {
  slug: 'ch8-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle: 'All 14 NCERT textbook exercises for the chapter, grouped into 5 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: '5ff147ac-8bb2-48fe-b850-8baf3ff28a34',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A cutaway of a single eukaryotic cell revealing five distinctly-shaped internal organelles glowing softly within it',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Scientific textbook illustration, wide landscape banner, flat 2D educational diagram on a dark background (#0a0a0a near-black). A cutaway of a single rounded cell interior, showing five distinctly-shaped organelles floating inside it, evenly spaced: an oval structure with a folded, ridged interior surface (mitochondrion), a stack of flattened disc-shaped sacs curved into a gentle arc (golgi apparatus), a network of thin interconnected tubules (endoplasmic reticulum), a large round central body containing one smaller sphere inside it (nucleus with a nucleolus), and a rounded structure with internal stacked layers of thin discs (chloroplast). Clean white outlines, muted natural ochre and sage tones, biologically accurate schematic proportions, no photorealism, no cartoon, matches standard biology textbook illustration conventions. No text, no labels, no leader lines, no pointer lines of any kind anywhere in the image.",
    },
    {
      id: 'ae139eb9-60c6-4569-92d3-18d778da99cf',
      type: 'text',
      order: 1,
      markdown: "You've read the chapter — now drill it. Below are **all 14 NCERT exercises** for *Cell: The Unit of Life*, pulled out of the textbook's own running order and re-sorted into five revision themes: the story and theory behind the cell itself, the prokaryotic cell's blueprint, how the plasma membrane controls what crosses it, every membrane-bound organelle working inside a eukaryotic cell, and the nucleus that runs it all.\n\nTry to answer each one in your head (or on paper) before you open the solution. This is the single highest-yield NEET chapter in the whole syllabus — even a question you already know cold is worth reading through, because the worked answer is written to teach the whole idea, not just tick the box.",
    },
    {
      id: 'eb028642-9b06-4d16-9dc3-9581211d54d6',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 8.1–8.14',
      intro: 'Every end-of-chapter exercise, regrouped into five revision themes. Each carries a one-line answer for a quick self-check and a full worked solution.',
      sections: [
        {
          id: '6433d716-f591-4a2d-aca2-f51eccee2956',
          title: 'Cell Theory and What Makes a Cell',
          blurb: "The history — who discovered what — plus the two ideas that make 'the cell is the basic unit of life' more than a slogan.",
          items: [
            {
              kind: 'mcq',
              id: 'beded5bb-dd26-4ac7-8908-f12fca13db0e',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.1',
              prompt: 'Which of the following is not correct?',
              options: [
                'Robert Brown discovered the cell.',
                'Schleiden and Schwann formulated the cell theory.',
                'Virchow explained that cells are formed from pre-existing cells.',
                'A unicellular organism carries out its life activities within a single cell.',
              ],
              correct_index: 0,
              explanation: "Option (a) is the one that's wrong, and this chapter is explicit about the real order of events: **Antonie Von Leeuwenhoek** was the first person to see and describe a living cell. **Robert Brown** came later, and what he discovered was the **nucleus**, not the cell itself. Swapping those two credits is exactly the trap this question sets.\n\nThe other three statements are all things this chapter states directly. **Schleiden (1838, plants)** and **Schwann (1839, animals)** did formulate the cell theory between them — that's (b), correct. **Virchow (1855)** did close the theory's gap by explaining that new cells arise only from pre-existing ones, *Omnis cellula-e cellula* — that's (c), correct. And a **unicellular organism** genuinely can exist independently and perform every essential function of life within its one cell, which is exactly why this chapter calls the cell the fundamental unit — that's (d), correct too. Only (a) misattributes a discovery, which is why it's the answer.",
            },
            {
              kind: 'mcq',
              id: '39ee1dc8-87a8-4756-8338-5d898a86f236',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.2',
              prompt: 'New cells generate from',
              options: [
                'Bacterial fermentation',
                'Regeneration of old cells',
                'Pre-existing cells',
                'Abiotic materials',
              ],
              correct_index: 2,
              explanation: "The answer is **pre-existing cells** — this is the exact gap Rudolf Virchow closed in 1855 when he explained that cells **divide**, and new cells form only from cells that already exist, a rule he wrote in Latin as *Omnis cellula-e cellula*, \"every cell from a cell.\" That addition is what turned Schleiden and Schwann's original idea into the **final, modern shape of the cell theory**: (i) all living organisms are composed of cells and products of cells, and (ii) all cells arise from pre-existing cells.\n\nThe other three options don't describe how a new cell is actually made. Bacterial fermentation is a metabolic process, not a way cells are formed. 'Regeneration of old cells' isn't the mechanism this chapter describes — the actual process is division of an existing cell into new ones, not an old cell renewing itself. And 'abiotic materials' is the exact idea the cell theory rules out — cells never arise from non-living matter; that's precisely what Virchow's statement was written to correct.",
            },
            {
              kind: 'numerical',
              id: '42ce98ce-2de7-4209-b136-e0c1f70c0be3',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.9',
              prompt: 'Multicellular organisms have division of labour. Explain.',
              answer: "In a multicellular organism, different cells take on different shapes suited to one specific job each — instead of one generalised cell having to do every job of life alone, the way a unicellular organism must.",
              solution: "Start from this chapter's own starting point. A **unicellular organism** is a single cell living entirely on its own, and it has to do two things all by itself: **exist independently**, and **perform every essential function of life** — feeding, respiring, reproducing, responding — with no help from any other cell. One cell managing every job works only when the whole body *is* that one cell.\n\nA multicellular organism can't rely on that trick, because it's built from many cells — so instead, it splits the total workload up. This chapter shows exactly what that looks like in its own gallery of cell shapes (Figure 8.1): **the shape of a cell may vary with the function it performs**. A **red blood cell** is round and biconcave — a shape suited to carrying oxygen efficiently through narrow blood vessels. A **white blood cell** is amoeboid, constantly changing shape — suited to squeezing between other cells to fight infection wherever it's needed. A **columnar epithelial cell** is long and narrow — suited to lining a surface and absorbing across it. A **nerve cell** is branched and long, among the longest cells in the body — suited to carrying a signal over distance. A **mesophyll cell** is round and oval — suited to packing in chloroplasts and trapping light. A **tracheid** is elongated — suited to forming a continuous tube that conducts water.\n\nEach of these cells has committed to one shape built for one job, rather than trying to be a generalist. That's what **division of labour** actually means at the cellular level: instead of every cell doing every job passably (which is all a lone unicellular organism can ever do), a multicellular body distributes its total workload across many specialised cell types, and the organism as a whole is simply the coordinated sum of all of them working together.",
            },
            {
              kind: 'numerical',
              id: 'a62953fa-298a-4d6a-8fe2-04bd05a18ae0',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.10',
              prompt: 'Cell is the basic unit of life. Discuss in brief.',
              answer: "A unicellular organism — a single cell — can, entirely alone, exist independently and perform every essential function of life, and nothing smaller than a whole cell can do this. That's why the cell, not anything smaller, is the fundamental structural and functional unit of every living organism.",
              solution: "This chapter opens with exactly this claim, and builds it from a simple thought experiment. Take a **unicellular organism** — a single cell living entirely on its own. It doesn't need any other cell to survive. It can do two things by itself: **exist independently**, and **perform every essential function of life** — feeding, respiring, reproducing, responding to its surroundings — without help from anything else.\n\nNow imagine breaking that one cell apart, so what's left is less than a complete cell — a stray fragment of it. **Anything less than a complete structure of a cell does not ensure independent living.** A half-cell can't do what a whole cell does. That's exactly why the cell, and nothing smaller than it, gets to be called the **fundamental structural and functional unit of all living organisms** — from a single bacterium to every cell inside your own body.\n\nThis idea is backed up by the **cell theory** itself, built over two decades by three scientists: Schleiden (1838, examining plants) and Schwann (1839, examining animals) together proposed that the bodies of both plants and animals are composed of cells and products of cells; Virchow (1855) closed the remaining gap by showing that all cells arise only from pre-existing cells. Put together, the modern cell theory states: (i) all living organisms are composed of cells and products of cells, and (ii) all cells arise from pre-existing cells. Both halves of that theory point at the same conclusion — life is built, cell by cell, from this one indivisible unit, and there is nothing smaller that still counts as 'alive' on its own.",
            },
          ],
        },
        {
          id: '0a93fd24-6dcc-482b-b66d-5658e5e3aa2e',
          title: "The Prokaryotic Cell's Blueprint",
          blurb: "No nucleus, no membrane-bound organelles — yet every prokaryote is built to the same working plan, mesosome included.",
          items: [
            {
              kind: 'mcq',
              id: '2585bc58-e55a-4ec9-b94a-17bde95c44b5',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.4',
              prompt: 'Which of the following is correct:',
              options: [
                'Cells of all living organisms have a nucleus.',
                'Both animal and plant cells have a well defined cell wall.',
                'In prokaryotes, there are no membrane bound organelles.',
                'Cells are formed de novo from abiotic materials.',
              ],
              correct_index: 2,
              explanation: "The correct statement is (c). This chapter is explicit: besides lacking a membrane-bound nucleus, prokaryotic cells have **no organelles like the ones found in eukaryotes, except ribosomes** — no ER, no Golgi complex, no lysosomes, no mitochondria, no microbodies, no vacuoles. That's the whole basis for calling them prokaryotic in the first place.\n\nEach of the other three breaks a fact this chapter states directly. **(a)** is false twice over: a prokaryotic cell has **no well-defined nucleus** at all — its genetic material is basically naked — and even among eukaryotes, this chapter names mature cells that lack a nucleus entirely: **erythrocytes of many mammals** and **sieve tube cells of vascular plants**. **(b)** is false because a cell wall is a **plant-only** (and fungi-only) feature — this chapter is explicit that a cell wall forms an outer covering for the plasma membrane 'only in fungi and plants,' and separately lists it as present in plant cells but absent in animal cells. **(d)** directly contradicts the cell theory itself: cells never arise 'de novo' from non-living matter — Virchow's own contribution was proving the opposite, that all cells arise from pre-existing cells.",
            },
            {
              kind: 'numerical',
              id: 'ca984427-99b2-41af-8198-783229c907a8',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.5',
              prompt: 'What is a mesosome in a prokaryotic cell? Mention the functions that it performs.',
              answer: "A mesosome is an infolding of the prokaryotic plasma membrane, formed as vesicles, tubules, and lamellae. It helps in cell wall formation, DNA replication and its distribution to daughter cells, respiration, secretion, and increasing the plasma membrane's surface area and enzymatic content.",
              solution: "A **mesosome** is not a separate organelle bolted onto the cell — it's the plasma membrane itself, folded inward. This chapter defines it as being **formed by extensions of the plasma membrane into the cell**, in the shape of **vesicles, tubules, and lamellae**. Because a prokaryotic cell has no membrane-bound organelles to fall back on, this one folded structure has to earn its keep doing several jobs at once.\n\nThe functions this chapter lists, and NEET expects you to know as a set:\n\n- **Cell wall formation** — helping build the wall during and after cell division.\n- **DNA replication and its distribution to daughter cells** — supporting the genome's copying and hand-off when the cell divides.\n- **Respiration** — contributing to the cell's energy metabolism, in the absence of a mitochondrion.\n- **Secretion processes** — helping move material out of the cell.\n- **Increasing the surface area of the plasma membrane and its enzymatic content** — simply by folding, the membrane packs in more surface (and more of the enzymes sitting on it) than a flat membrane of the same size ever could.\n\nWorth remembering: some prokaryotes push this same folding idea even further. In **cyanobacteria**, similar membranous extensions into the cytoplasm are called **chromatophores**, and these carry pigments that let cyanobacteria carry out photosynthesis — a different name for a related idea, not the mesosome itself.",
            },
            {
              kind: 'numerical',
              id: 'e824a77c-ed12-4538-88d3-6ec5091d7c44',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.8',
              prompt: 'What are the characteristics of prokaryotic cells?',
              answer: "No well-defined nucleus (naked genetic material, one circular chromosome + plasmids); a cell wall around the cell membrane in every prokaryote except mycoplasma; no membrane-bound organelles except ribosomes (70S, attached to the plasma membrane); a three-layered cell envelope (glycocalyx, cell wall, plasma membrane); a mesosome; free-lying inclusion bodies; and, in motile forms, flagella.",
              solution: "Pulling together everything this chapter builds up about prokaryotes, point by point:\n\n- **Represented by** bacteria, blue-green algae, mycoplasma, and PPLO (Pleuro Pneumonia Like Organisms) — generally **smaller** and **multiplying more rapidly** than eukaryotic cells, though built to a fundamentally similar plan across the whole group.\n- **No well-defined nucleus.** The genetic material is **basically naked**, not enclosed in a nuclear membrane — a nuclear membrane is a **eukaryotes-only** feature. The genome itself is a **single circular chromosome**; many bacteria also carry smaller circular **plasmid** DNA separately, which can pass on traits like antibiotic resistance.\n- **A cell wall around the cell membrane, with one exception: mycoplasma**, which has no cell wall at all.\n- **A three-layered cell envelope**, from outside in: the **glycocalyx** (a loose slime layer or a tough capsule), the **cell wall** (fixes cell shape, gives structural support), and the **plasma membrane** (selectively permeable, structurally similar to a eukaryotic membrane). This envelope also decides **Gram positive** vs **Gram negative** status, by whether the cell takes up the Gram stain.\n- **No organelles like eukaryotes have, except ribosomes.** These are **70S ribosomes**, built from a **50S** and a **30S** subunit, about 15 nm × 20 nm, and — unlike in eukaryotic cells — they sit **attached to the plasma membrane** rather than floating loose. What eukaryotes carry instead as organelles (ER, Golgi complex, lysosomes, mitochondria, microbodies, vacuoles) simply doesn't exist in a prokaryotic cell.\n- **A mesosome** — an infolding of the plasma membrane doing the work of cell wall formation, DNA replication and distribution, respiration, secretion, and increasing membrane surface area.\n- **Inclusion bodies** for reserve material (phosphate, cyanophycean, glycogen granules), **lying free in the cytoplasm with no membrane around them at all**.\n- **Motility, where present, via flagella** — thin filamentous extensions of the cell wall built from a filament, hook, and basal body — plus, in some bacteria, non-motile surface structures called **pili** and **fimbriae**.",
            },
          ],
        },
        {
          id: '0d72482a-44ae-4b14-89c0-6aa65072ba36',
          title: 'The Plasma Membrane: Crossing the Boundary',
          blurb: 'Why some molecules glide straight through the membrane and others need a helper protein to get across at all.',
          items: [
            {
              kind: 'numerical',
              id: 'f534d561-8363-4167-806d-ad57c549b521',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.6',
              prompt: 'How do neutral solutes move across the plasma membrane? Can the polar molecules also move across it in the same way? If not, then how are these transported across the membrane?',
              answer: "Neutral solutes cross by simple diffusion, moving along the concentration gradient with no energy needed. Polar molecules cannot cross the same way — the membrane's core is a nonpolar lipid bilayer — so they need a carrier protein in the membrane to be transported.",
              solution: "**Neutral solutes** move across the plasma membrane by **simple diffusion** — this chapter calls it **passive transport**, meaning it needs **no energy at all**. The rule for diffusion is always the same: the solute moves **along the concentration gradient**, from wherever it's more concentrated to wherever it's less concentrated. Water follows this exact same logic when it crosses the membrane, and that specific case of diffusion gets its own name: **osmosis**.\n\n**Polar molecules cannot cross the same way, and no — this chapter is explicit about it.** The membrane's core is the phospholipid bilayer, and that core is **nonpolar and hydrophobic**. A polar molecule simply cannot slip through a nonpolar barrier on its own, the way a neutral solute can.\n\nSo a polar molecule needs help: it crosses with the assistance of a **carrier protein** built into the membrane, which facilitates its transport. Worth noting carefully — needing a carrier protein doesn't automatically mean energy is spent. This chapter separates that question entirely: some transport (using a carrier protein, still passive, still along the gradient) needs no energy, while a different category — **active transport**, moving a molecule **against** its concentration gradient — always needs energy, supplied as **ATP** (the textbook example being the **Na+/K+ Pump**). The carrier-protein requirement for polar molecules is about the bilayer physically blocking them, not automatically about energy cost.",
            },
          ],
        },
        {
          id: '6a55f5e3-6ab8-4186-82bc-974b2799cf68',
          title: 'Membrane-Bound Organelles — Structure, Match, and Function',
          blurb: 'Cristae, cisternae, thylakoids, mitochondria, plastids, lysosomes, vacuoles — everything wrapped in its own membrane inside a eukaryotic cell.',
          items: [
            {
              kind: 'numerical',
              id: '529d1fa1-10e8-4840-9779-94cb6b8f0f32',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.3',
              prompt: 'Match the following\nColumn I                         Column II\n(a) Cristae                      (i) Flat membranous sacs in stroma\n(b) Cisternae                   (ii) Infoldings in mitochondria\n(c) Thylakoids                 (iii) Disc-shaped sacs in Golgi apparatus',
              answer: '(a) Cristae → (ii) Infoldings in mitochondria; (b) Cisternae → (iii) Disc-shaped sacs in Golgi apparatus; (c) Thylakoids → (i) Flat membranous sacs in stroma.',
              solution: "None of the three rows in the printed table are actually matched correctly as given — that's the whole point of a match-the-column exercise. Work out each structure from what this chapter says about it, and match on meaning, not on position.\n\n- **(a) Cristae** are, in this chapter's own words, infoldings of the **inner membrane of a mitochondrion**, projecting into the matrix — they exist to increase the surface area available for the mitochondrion's work. That's a direct match to **(ii) Infoldings in mitochondria**.\n- **(b) Cisternae** are the flat, disc-shaped sacs that stack up to form a **golgi body** — this chapter gives their size directly, 0.5 to 1.0 µm across, stacked parallel to each other near the nucleus. That matches **(iii) Disc-shaped sacs in Golgi apparatus**.\n- **(c) Thylakoids** are the organised, flattened membranous sacs sitting inside the **stroma** of a chloroplast — they're what stacks up into a granum, and it's inside a thylakoid's membrane that chlorophyll actually sits. That matches **(i) Flat membranous sacs in stroma**.\n\nSo the correct pairing is **a–(ii), b–(iii), c–(i)** — each structure belonging to a different organelle: cristae to the mitochondrion, cisternae to the golgi apparatus, thylakoids to the chloroplast.",
            },
            {
              kind: 'numerical',
              id: '70386e5e-6a3d-4095-8f6a-08b2ad0da589',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.7',
              prompt: 'Name two cell-organelles that are double membrane bound. What are the characteristics of these two organelles? State their functions and draw labelled diagrams of both.',
              answer: 'Mitochondria and plastids (chloroplasts). Mitochondria are the site of aerobic respiration and make ATP; chloroplasts trap light energy for photosynthesis.',
              solution: "The two double membrane-bound organelles this chapter covers are the **mitochondrion** and the **plastid** (specifically the **chloroplast**).\n\n**Mitochondrion** — typically **sausage-shaped or cylindrical**, 0.2–1.0 µm in diameter (average 0.5 µm) and 1.0–4.1 µm long, and barely visible under the microscope unless specifically stained. It's wrapped in **two membranes**: an **outer membrane** that simply forms the smooth, continuous boundary of the organelle, and an **inner membrane** that folds inward repeatedly toward the centre, forming infoldings called **cristae** — these exist purely to **increase the available surface area**. The two membranes divide the interior into an **outer compartment** and an **inner compartment**; the inner compartment is filled with a dense substance called the **matrix**, which holds a **single circular DNA molecule**, some **RNA**, and its own **70S ribosomes**. Both membranes carry their own enzymes. Function: mitochondria are the **sites of aerobic respiration**, producing the cell's usable energy as **ATP** — exactly why they're called the cell's **'power houses.'** They reproduce by simply **dividing by fission**.\n\n*(To sketch it: draw a rounded, elongated capsule. Draw a second, inner outline just inside the first — that's the outer and inner membranes. From the inner outline, draw several finger-like folds pushing into the centre and label them 'cristae.' Label the space between the two membranes 'outer compartment,' and the space inside the folded inner membrane 'matrix.')*\n\n**Chloroplast** — found in **all plant cells and in euglenoids**, large enough to be easily visible, lens-shaped to oval to spherical, 5–10 µm long and 2–4 µm wide. Also **double membrane-bound**, but here the **inner membrane is relatively less permeable** than the outer one. The space enclosed by the inner membrane is the **stroma**, and sitting inside the stroma are flattened membranous sacs called **thylakoids**, which stack up like piles of coins into units called **grana** (singular: granum); flat tubules called **stroma lamellae** connect the thylakoids of different grana to each other. **Chlorophyll sits inside the thylakoids**, not loose in the stroma. The stroma itself holds enzymes for making carbohydrates and proteins, plus its own circular DNA and its own **70S ribosomes** — smaller than the 80S ribosomes floating free in the rest of the cytoplasm. Function: chloroplasts **trap light energy**, which is essential for **photosynthesis**.\n\n*(To sketch it: draw a rounded or oval outline with two membrane lines close together at the edge — outer and inner membrane. Inside, draw several short stacks of flattened discs (grana), connecting a couple of the stacks with thin horizontal lines (stroma lamellae), and label the space around them 'stroma.')*",
            },
            {
              kind: 'numerical',
              id: '8662f03a-22cb-4793-bfc9-d2db9a629cbe',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.12',
              prompt: 'Both lysosomes and vacuoles are endomembrane structures, yet they differ in terms of their functions. Comment.',
              answer: "Lysosomes are golgi-built vesicles packed with hydrolytic enzymes (active at acidic pH) that digest carbohydrates, proteins, lipids and nucleic acids. Vacuoles are simple tonoplast-bound storage spaces holding water, cell sap, or waste — with no digestive enzymes at all.",
              solution: "Both structures are part of the **endomembrane system**, but they were built for opposite jobs — one digests, the other simply stores.\n\n**Lysosomes** are membrane-bound vesicles, and the **golgi apparatus is exactly where they're built**, packaged the same way the golgi packages everything else. What makes a lysosome a lysosome is what's loaded inside it: almost every kind of **hydrolytic enzyme** — hydrolases such as **lipases, proteases, and carbohydrases** — all working best at an **acidic pH**. Between them, these enzymes can digest **carbohydrates, proteins, lipids, and nucleic acids**.\n\nA **vacuole**, by contrast, is simply a **membrane-bound space** inside the cytoplasm, bounded by a single membrane called the **tonoplast**, holding **water, cell sap, excretory products, or anything else the cell has no further use for** — no digestive enzyme system involved. In plant cells, a vacuole can take up as much as **90 percent of the cell's volume**, and the tonoplast keeps pumping ions and materials **against their concentration gradient** into it, which is why its contents end up far more concentrated than the surrounding cytoplasm. Vacuoles also specialise by role: in *Amoeba*, a **contractile vacuole** handles **osmoregulation and excretion**; in many protists, a **food vacuole** forms simply by **engulfing food particles**.\n\nSo while both sit in the same broad 'endomembrane' family, a lysosome is a **digestive** structure built by the golgi and loaded with enzymes, while a vacuole is a **storage** structure bounded by the tonoplast and holding whatever the cell needs to keep, move, or get rid of — no overlap in what the two actually do.",
            },
          ],
        },
        {
          id: 'f4086e26-bf4b-43fb-90d7-7c7aa01b852d',
          title: 'The Nucleus, Centrosome, and Chromosomes',
          blurb: "The cell's control centre, its spindle-building partner, and the four shapes a chromosome can take depending on where its centromere sits.",
          items: [
            {
              kind: 'numerical',
              id: 'b26da49b-2ab8-4b13-a367-05cab20fc457',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.11',
              prompt: 'What are nuclear pores? State their function.',
              answer: "Nuclear pores are openings in the nuclear envelope, formed where its two membranes fuse. They are the passages through which RNA and protein molecules move in both directions between the nucleus and the cytoplasm.",
              solution: "The **nuclear envelope** is made of **two parallel membranes**, with a gap between them — the **perinuclear space** — measuring **10 to 50 nm**. That envelope isn't sealed shut everywhere, though. At a number of places, it's **interrupted by minute pores**, and each one of those **nuclear pores** is formed by the **fusion of the envelope's two membranes** at that exact spot.\n\nTheir function is precisely what that opening is for: nuclear pores are the actual passages through which **RNA and protein molecules move in both directions** — from the nucleus out into the cytoplasm, and from the cytoplasm back into the nucleus. Nothing crosses the nuclear envelope except through one of these gated openings. Worth connecting to the rest of the envelope's structure: the **outer membrane** of the envelope usually stays **continuous with the endoplasmic reticulum** and even **bears ribosomes** on its surface — so the nucleus, its pores, and the ER are all one linked system, not separate, isolated pieces.",
            },
            {
              kind: 'numerical',
              id: 'c695920e-6081-4896-976e-a42c3a9a7df8',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.13',
              prompt: 'Describe the structure of the following with the help of labelled diagrams.\n(i) Nucleus        (ii) Centrosome',
              answer: "Nucleus: a double-membraned nuclear envelope (with pores) enclosing nucleoplasm that holds chromatin and one or more nucleoli. Centrosome: usually two perpendicular, cartwheel-shaped centrioles (each a ring of nine tubulin triplets around a central hub, linked by radial spokes), surrounded by pericentriolar material.",
              solution: "**(i) Nucleus** — first described as a cell organelle by **Robert Brown in 1831**. Its boundary, the **nuclear envelope**, is made of **two parallel membranes** with a gap of **10–50 nm** between them called the **perinuclear space**; this double membrane forms a barrier between the nucleus's contents and the cytoplasm outside. The **outer membrane** stays continuous with the **endoplasmic reticulum** and carries **ribosomes** on its surface. The envelope is interrupted at points by **nuclear pores** — formed where the two membranes fuse — through which **RNA and protein move in both directions**. Inside, the **nucleoplasm** (nuclear matrix) holds two things: **chromatin**, a loose, indistinct network of nucleoprotein fibres (DNA + histones + a smaller amount of non-histone proteins + RNA) visible only in an interphase, non-dividing nucleus; and one or more **nucleoli** — spherical, **not membrane-bound**, so their content is continuous with the surrounding nucleoplasm, and each one a site of **active ribosomal RNA synthesis**. Cells busy making protein have larger, more numerous nucleoli.\n\n*(To sketch it: draw a large circle, then a second circle just inside it, with a small gap between the two — that's the double nuclear envelope and the perinuclear space. Add a small gap or notch in the double line and label it 'nuclear pore.' Inside, draw a tangled scribble of thin threads and label it 'chromatin,' and one or two small solid circles labelled 'nucleolus.')*\n\n**(ii) Centrosome** — an organelle usually containing **two cylindrical centrioles**, surrounded by **amorphous pericentriolar material**. The two centrioles lie **perpendicular** to each other, and each is built like a **cartwheel**: **nine evenly spaced peripheral fibrils of tubulin protein**, where each fibril is itself a **triplet** (three tubules bundled together), with adjoining triplets linked to each other. At the centre sits a proteinaceous **hub**, connected to the nine peripheral triplets by proteinaceous **radial spokes** — like spokes running from an axle to a wheel's rim. Function: centrioles form the **basal body of cilia or flagella**, and they also give rise to the **spindle fibres** that build the **spindle apparatus** during cell division in animal cells.\n\n*(To sketch it: draw a small circle (the hub) in the centre. Around it, draw nine short triple-lined bars arranged evenly like the rim of a wheel, each connected to the hub by a thin spoke line — that's one centriole, end-on. Draw a second, identical cartwheel shape lying at 90° to the first, to show the perpendicular pair.)*",
            },
            {
              kind: 'numerical',
              id: '315a5e74-3319-47e3-8070-df7080876b45',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.14',
              prompt: 'What is a centromere? How does the position of centromere form the basis of classification of chromosomes. Support your answer with a diagram showing the position of centromere on different types of chromosomes.',
              answer: "The centromere is a chromosome's primary constriction, holding its two chromatids together, with a kinetochore on each side. Its position along the chromosome sorts every chromosome into one of four types: metacentric (middle, equal arms), sub-metacentric (off-middle, unequal arms), acrocentric (near one end, one very short and one very long arm), or telocentric (terminal, essentially one arm).",
              solution: "A **centromere** is a chromosome's **primary constriction** — every chromosome (visible only in a dividing cell, once loose chromatin has condensed) has one. On either side of the centromere sit disc-shaped structures called **kinetochores**. The centromere does one more job besides marking that pinch point: it's what **holds together the two chromatids** of a replicated chromosome — the two strands joined at exactly the point where the centromere sits.\n\n**The position of the centromere along the chromosome is exactly what sorts chromosomes into four types:**\n\n- **Metacentric** — centromere sits right in the **middle**, giving **two equal arms**.\n- **Sub-metacentric** — centromere sits **slightly away from the middle**, giving **one shorter arm and one longer arm**.\n- **Acrocentric** — centromere sits **close to one end**, giving **one extremely short arm and one very long arm**.\n- **Telocentric** — centromere sits at a **terminal position**, right at the very end, leaving essentially **only one arm**.\n\nSo the same landmark — one constriction, one centromere — produces four visibly different chromosome shapes purely depending on where along the chromosome's length it happens to sit.\n\n*(To sketch it: draw four vertical rod-shaped chromosomes side by side. On the first, pinch the rod exactly in the middle — two equal-length arms above and below the pinch (metacentric). On the second, pinch it a little above centre — a short arm and a longer arm (sub-metacentric). On the third, pinch it very close to the top — a tiny stub of an arm and a long arm below (acrocentric). On the fourth, put the pinch right at the very top end, so there's essentially only one long arm below it (telocentric). Label the pinch point on each as 'centromere.')*",
            },
          ],
        },
      ],
    },
  ],
};
