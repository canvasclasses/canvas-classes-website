'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'why-five-kingdoms',
  title: 'From Two Kingdoms to Five',
  subtitle: "Plants vs animals feels obvious — until you meet an organism that is neither. Here's why one clean split had to become five kingdoms.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['biological-classification', 'five-kingdom-classification', 'whittaker', 'two-kingdom-system'],
  glossary: [
    { term: 'prokaryote', definition: 'An organism whose cell has no true nucleus — the genetic material sits free in the cell with no nuclear membrane around it. Bacteria are prokaryotes.' },
    { term: 'eukaryote', definition: 'An organism whose cell has a true, membrane-bound nucleus (and other membrane-bound parts). Protists, fungi, plants and animals are all eukaryotes.' },
    { term: 'autotrophic', definition: 'A mode of nutrition where the organism makes its own food — by photosynthesis (using light) or chemosynthesis (using chemical reactions).' },
    { term: 'heterotrophic', definition: 'A mode of nutrition where the organism takes in food made by others — as a saprophyte (feeding on dead matter), parasite, or by ingesting other organisms.' },
    { term: 'phylogenetic relationships', definition: 'Relationships based on evolutionary history — how closely two organisms are related through descent, not just how similar they look on the outside.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dark dusk scene where bacteria, a pond microbe, a mushroom, a fern and a deer each glow in their own pool of light, none of them fitting a single plant-or-animal box',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single dark dusk composition showing five very different living things spaced across the frame, each lit by its own quiet pool of warm light against one shared naturalistic dark background: on the far left, faint rod- and spiral-shaped bacteria glowing dimly; then a single-celled pond microbe (an amoeba-like blob with a flagellum) drifting in a shallow puddle; in the centre, a small cluster of pale mushrooms on a dark log; then a fern frond unfurling on a mossy bank; and on the far right, the silhouette of a grazing deer against a soft warm horizon glow. The five subjects deliberately look like they belong to no single group — some tiny, some green, some pale and rooted, one clearly an animal. Deep dusk lighting, painterly and atmospheric, dark background overall (#0a0a0a base tones), no text, no labels, no diagram elements, no boxes or dividers.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Cell That Refused to Pick a Side',
      markdown: "Picture a single tiny cell floating in pond water. In sunlight it turns green and makes its own food, exactly like a plant. Take the light away and it starts swimming, hunting, and swallowing food particles, exactly like an animal. So where does a creature like **Euglena** go — plant or animal? For a long time the honest answer was 'neither, really.' That single stubborn cell is a hint of the problem this whole page is about: the living world is far too varied to squeeze into just two boxes.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "People have tried to sort living things since the dawn of civilisation, but early attempts were driven by usefulness — which plants and animals gave us food, shelter, or clothing — not by any scientific rule. **Aristotle** was the first to attempt a more scientific basis. Using simple features he could see, he split plants into **trees, shrubs and herbs**, and divided animals into two groups: **those with red blood and those without**.\n\nMuch later, in **Linnaeus'** time, a **Two Kingdom system** took hold — every living thing was filed into either **Plantae** (plants) or **Animalia** (animals). It was easy to picture and easy to teach, and it lasted a very long time. The trouble is that 'easy to picture' is not the same as 'true to nature.'",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Why Two Kingdoms Broke Down',
      objective: "By the end of this you can name the exact things a plant-or-animal split fails to capture — the ones NEET turns into questions.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The two-kingdom system had one fatal weakness: it lumped together organisms that are deeply different, and it had no room for organisms that are clearly neither a plant nor an animal. Specifically, it **did not distinguish**:\n\n- **eukaryotes from prokaryotes** — a bacterium (no true nucleus) got filed alongside organisms with proper nuclei;\n- **unicellular from multicellular** organisms — a single-celled form sat in the same box as a giant many-celled one;\n- **photosynthetic from non-photosynthetic** organisms — green algae, which make their own food, were grouped with fungi, which cannot.\n\nAnd a large number of organisms simply **did not fall into either category** at all. Once you notice all this, two kingdoms is clearly too blunt a tool. Biologists realised that gross body shape alone isn't enough — you also have to look at **cell structure, the nature of the cell wall, the mode of nutrition, the habitat, the method of reproduction, and evolutionary relationships**. Bring in those extra characters, and the neat plant-or-animal line stops holding.",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: "Whittaker's Five Kingdoms",
      objective: 'By the end of this you can name all five kingdoms, list the five criteria behind them, and explain how they re-sorted organisms that used to be filed elsewhere.',
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "In **1969, R.H. Whittaker** proposed a **Five Kingdom Classification**. His five kingdoms were **Monera, Protista, Fungi, Plantae and Animalia**. Instead of judging an organism by its overall shape, Whittaker sorted it using **five main criteria**: **cell structure, body organisation, mode of nutrition, reproduction, and phylogenetic (evolutionary) relationships**.\n\nChanging the criteria completely reshuffled the deck. Under the old scheme, **bacteria, blue-green algae, fungi, mosses, ferns, gymnosperms and angiosperms** were all filed under 'Plants', because the one thing tying them together was simply that their cells had a **cell wall**. That single shared feature hid enormous differences — it grouped prokaryotic bacteria and cyanobacteria with eukaryotes, and grouped single-celled forms with many-celled ones.\n\nWatch how the new criteria pulled organisms apart and put them back together differently:\n\n- **Fungi** were pulled out into their own **Kingdom Fungi**, because although they are heterotrophic (they can't make their own food, unlike green plants), the deciding character was their wall: fungi have **chitin** in their walls, while green plants have a **cellulose** wall.\n- **All prokaryotic organisms** were gathered into **Kingdom Monera**.\n- **Unicellular eukaryotes** were placed together in **Kingdom Protista** — and this is the striking one. Protista brought **Chlamydomonas and Chlorella** (once counted as algae inside 'Plants', both with cell walls) into the *same* kingdom as **Paramoecium and Amoeba** (once counted as animals, both lacking a cell wall). Organisms that used to live in different kingdoms now share one, purely because the criteria changed.\n\nThis kind of reshuffle can happen again in the future as our understanding of evolutionary relationships improves. One footnote for later: a **three-domain system** has since been proposed that splits **Kingdom Monera into two**, giving a **six-kingdom** picture — you'll meet that in higher classes.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
      prompt: "Chlamydomonas has a cell wall and was once filed under plants; Amoeba has no cell wall and was once filed under animals. Under Whittaker's system, both end up in the same kingdom — Protista. Which criterion made that happen, given that they disagree on cell wall and on their old plant/animal label?",
      options: [
        "Both make their own food by photosynthesis, so they were grouped as autotrophs",
        "Both are single-celled organisms with a true nucleus — a unicellular eukaryote body plan, which is what Kingdom Protista is built on",
        "Both have the same kind of cell wall, which is why they share a kingdom",
        "Both are prokaryotes, so they were grouped together in Protista",
      ],
      reveal: "The feature they share is being **unicellular eukaryotes** — a single cell with a true nucleus. Kingdom Protista is defined on cell structure and body organisation, not on cell wall or on the old plant/animal habit, so the wall disagreement and the old labels stop mattering. Option A is a trap because Amoeba is not photosynthetic — it hunts its food — so 'both make their own food' is simply false. And they are not prokaryotes: prokaryotes (no true nucleus) go to Kingdom Monera, not Protista.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'table', order: 8,
      caption: 'Table 2.1 — Characteristics of the Five Kingdoms',
      headers: ['Character', 'Monera', 'Protista', 'Fungi', 'Plantae', 'Animalia'],
      rows: [
        ['Cell type', 'Prokaryotic', 'Eukaryotic', 'Eukaryotic', 'Eukaryotic', 'Eukaryotic'],
        ['Cell wall', 'Noncellulosic (polysaccharide + amino acid)', 'Present in some', 'Present, with chitin', 'Present (cellulose)', 'Absent'],
        ['Nuclear membrane', 'Absent', 'Present', 'Present', 'Present', 'Present'],
        ['Body organisation', 'Cellular', 'Cellular', 'Multicellular / loose tissue', 'Tissue / organ', 'Tissue / organ / organ system'],
        ['Mode of nutrition', 'Autotrophic (chemosynthetic & photosynthetic) and Heterotrophic (saprophytic / parasitic)', 'Autotrophic (photosynthetic) and Heterotrophic', 'Heterotrophic (saprophytic / parasitic)', 'Autotrophic (photosynthetic)', 'Heterotrophic (holozoic / saprophytic etc.)'],
      ],
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: 'Lock In the Five and the Five',
      markdown: "**The five kingdoms, in order — Monera, Protista, Fungi, Plantae, Animalia:**\n> **M**onkeys **P**lay **F**ootball **P**retty **A**wfully — M-P-F-P-A.\n\n**Whittaker's five criteria — cell structure, body organisation, mode of nutrition, reproduction, phylogenetic relationships:**\n> **C**lever **B**iologists **M**ake **R**eal **P**rogress — C-B-M-R-P.\n\n**The two anchors you must never swap:**\n- **Monera = the only prokaryotic kingdom** (no nuclear membrane). Everyone else is eukaryotic.\n- **Protista = unicellular eukaryotes.** Single cell, true nucleus.",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Whittaker & the year:** The Five Kingdom system was proposed by **R.H. Whittaker in 1969** — the name-and-year pair is a direct one-mark lift. Don't confuse it with the two-kingdom (Linnaeus) or the later six-kingdom / three-domain scheme.\n\n**The five criteria (verbatim):** cell structure, body organisation, mode of nutrition, reproduction, and phylogenetic relationships. NEET asks 'which of the following was NOT a criterion used by Whittaker?' and slips in a tempting extra like 'habitat.'\n\n**The two clean definitions:** **Monera = prokaryotic** (the only one); **Protista = unicellular eukaryotic**. Fungi were split off from plants on the basis of their **chitin** cell wall (plants have cellulose).",
    },
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "So the living world went from two boxes to five, sorted not by looks but by cell structure, body plan, nutrition, reproduction and evolutionary history. The most basic of those five kingdoms holds the organisms with no true nucleus at all — and that's exactly where we go next: **Kingdom Monera**, the world of bacteria.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'Who proposed the Five Kingdom Classification, and in which year?',
          options: [
            'Carolus Linnaeus, 1758',
            'R.H. Whittaker, 1969',
            'Ernst Haeckel, 1866',
            'Aristotle, 1735',
          ],
          correct_index: 1,
          explanation: 'The Five Kingdom system was proposed by R.H. Whittaker in 1969. Linnaeus is tied to the earlier two-kingdom (Plantae/Animalia) system, and Aristotle made the first scientific attempt (trees/shrubs/herbs; red-blooded vs not) — neither gave us five kingdoms.',
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'Which of the following was a real weakness of the two-kingdom (plants vs animals) system?',
          options: [
            'It separated prokaryotes and eukaryotes too strictly',
            'It did not distinguish eukaryotes from prokaryotes, unicellular from multicellular, or photosynthetic from non-photosynthetic organisms',
            'It placed fungi in their own separate kingdom too early',
            'It relied on evolutionary relationships that had not yet been discovered',
          ],
          correct_index: 1,
          explanation: 'The two-kingdom system lumped together organisms that differ in nucleus type, cell number, and mode of nutrition, and left many organisms fitting neither box. It did not separate prokaryotes and eukaryotes at all (so the first option is the opposite of the truth), and it kept fungi inside "Plants" rather than giving them their own kingdom.',
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'When Whittaker moved Fungi into a kingdom of their own, separate from green plants, which characteristic was the deciding one?',
          options: [
            'Fungi have a cell wall made of chitin, while green plants have a cellulose wall',
            'Fungi are prokaryotic while green plants are eukaryotic',
            'Fungi lack a cell wall entirely',
            'Fungi are photosynthetic while green plants are not',
          ],
          correct_index: 0,
          explanation: 'Although fungi are also heterotrophic (unlike autotrophic green plants), NCERT points to the wall as the deciding character: fungi have chitin in their walls, green plants have cellulose. Fungi are eukaryotes (not prokaryotes), they definitely have a wall, and they are non-photosynthetic — so the other three options are each false.',
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'Kingdom Protista brought Chlamydomonas and Chlorella together with Paramoecium and Amoeba. What do all four organisms share that justifies putting them in one kingdom?',
          options: [
            'They are all multicellular organisms',
            'They all lack a cell wall',
            'They are all unicellular eukaryotes',
            'They are all photosynthetic autotrophs',
          ],
          correct_index: 2,
          explanation: 'All four are single-celled organisms with a true nucleus — unicellular eukaryotes — which is what Kingdom Protista is defined on. They do NOT all lack a cell wall (Chlamydomonas and Chlorella have one; Amoeba and Paramoecium do not), they are not multicellular, and they are not all photosynthetic (Amoeba and Paramoecium are heterotrophic).',
          difficulty_level: 3,
        },
      ],
    },
  ],
};
