'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'prokaryotic-cell-structure',
  title: 'Prokaryotic Cell Structure',
  subtitle: "No nucleus, no membrane-bound organelles, yet a fully working cell — bacteria pack cell-wall formation, DNA replication, respiration, and secretion into one clever infolding of the plasma membrane called the mesosome.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['cell-the-unit-of-life', 'prokaryotic-cells'],
  glossary: [
    { term: 'bacillus', definition: 'A rod-like bacterial shape — one of the four basic shapes bacteria come in.' },
    { term: 'coccus', definition: 'A spherical bacterial shape — one of the four basic shapes bacteria come in.' },
    { term: 'vibrio', definition: 'A comma-shaped bacterial shape — one of the four basic shapes bacteria come in.' },
    { term: 'spirillum', definition: 'A spiral bacterial shape — one of the four basic shapes bacteria come in.' },
    { term: 'plasmid', definition: 'Small circular DNA present in many bacteria, outside the main genomic DNA, that confers unique phenotypic characters such as resistance to antibiotics.' },
    { term: 'glycocalyx', definition: "The outermost layer of the bacterial cell envelope, sitting outside the cell wall. Can be a loose slime layer or a thick, tough capsule." },
    { term: 'mesosome', definition: 'A specialised, differentiated form of the plasma membrane, formed by its extensions (vesicles, tubules, lamellae) into the cell. Characteristic of prokaryotes.' },
    { term: 'flagellum', definition: 'A thin filamentous extension from the cell wall of a motile bacterium, made of a filament, a hook, and a basal body.' },
    { term: 'pili', definition: 'Elongated tubular surface structures made of a special protein, present on some bacteria. Do not aid motility.' },
    { term: 'fimbriae', definition: 'Small bristle-like fibres sprouting from the cell surface of some bacteria, used to attach to surfaces or host tissues. Do not aid motility.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark, glowing scene of assorted bacterial cells of different shapes floating close together, each with a faintly visible internal structure',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A close, atmospheric view of several bacterial cells of visibly different shapes — a rod, a sphere, a comma-curved cell, and a spiral cell — floating near each other in a dark void, each cell softly glowing from within to hint at internal structure without becoming a literal labelled diagram. Faint outlines suggest a thin outer envelope on each cell. Deep, atmospheric lighting, one soft warm glow shared across the cells, dark naturalistic background throughout (#0a0a0a base tones). Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'One Tiny Loop of DNA Can Make a Bacterium Unbeatable',
      markdown: "A bacterium's main genome sits in one big circular chromosome. But many bacteria carry a second, much smaller loop of DNA too, floating separately — a **plasmid**. That little loop can carry a single gene that makes the bacterium resistant to an antibiotic. Because plasmids are separate and can move between bacteria, that one gene can spread fast. This is a real reason some infections stop responding to a drug that used to work perfectly.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "**Prokaryotic cells** are represented by **bacteria, blue-green algae, mycoplasma, and PPLO (Pleuro Pneumonia Like Organisms)**. They are generally **smaller** and **multiply more rapidly** than eukaryotic cells, and they can vary greatly in **shape and size** — from a typical bacterium a couple of micrometres across down to PPLO, some of the smallest cells known.\n\nHere's the part worth holding onto: even with all that variety in shape, the way a prokaryotic cell is put together is **fundamentally similar** across the group. Learn the plan once, and you can recognise it in almost any bacterium.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Four Basic Bacterial Shapes',
      objective: 'By the end of this you can name all four bacterial shapes on sight, from a single-word description.',
    },
    {
      id: uuid(), type: 'interactive_image', order: 4, src: '',
      alt: 'Four bacteria shown side by side, each a different basic shape: rod-shaped bacillus, spherical coccus, comma-shaped vibrio, and spiral spirillum',
      caption: '📸 Tap each shape to see its name',
      generation_prompt: "Scientific textbook illustration comparing the four basic bacterial shapes, shown side by side in a row. Flat 2D educational diagram on a dark background (#0a0a0a near-black). From left to right: a straight rod-shaped cell, a small round spherical cell, a curved comma-shaped cell, and a corkscrew-like spiral cell, all drawn at a similar scale for comparison. Each cell rendered as a simple pink/magenta soft-tissue shape with a thin white outline, no internal detail, no photorealism, no cartoon. Clean white outlines throughout, matches standard biology textbook illustration conventions. No text or labels baked into the image itself.",
      hotspots: [
        { id: uuid(), x: 0.14, y: 0.5, label: 'Bacillus', icon: 'circle',
          detail: "**Rod-like** — the straight, elongated bacterial shape." },
        { id: uuid(), x: 0.38, y: 0.5, label: 'Coccus', icon: 'circle',
          detail: "**Spherical** — the round bacterial shape." },
        { id: uuid(), x: 0.62, y: 0.5, label: 'Vibrio', icon: 'circle',
          detail: "**Comma-shaped** — a short, curved bacterial shape." },
        { id: uuid(), x: 0.86, y: 0.5, label: 'Spirillum', icon: 'circle',
          detail: "**Spiral** — the corkscrew-shaped bacterial shape." },
      ],
    },
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "Shape aside, every prokaryotic cell is built to a similar plan. **All prokaryotes have a cell wall surrounding the cell membrane — except mycoplasma**, which has no cell wall at all. Filling the cell is a **semi-fluid matrix called the cytoplasm**.\n\nThere is **no well-defined nucleus**. The genetic material is **basically naked**, not wrapped inside a nuclear membrane the way it is in a eukaryotic cell — a **nuclear membrane is found only in eukaryotes**. The main genome is a **single chromosome, or circular DNA**. On top of that, many bacteria carry small circular **plasmid** DNA separately, which — as you just read — can hand the bacterium traits like antibiotic resistance.\n\nProkaryotic cells also have **no organelles like the ones found in eukaryotes, except ribosomes**. What they do have instead is something unique to them: structures called **inclusions**, and a special infolded form of the cell membrane called the **mesosome** — you'll see exactly what a mesosome does in the next section.",
    },
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'The Cell Envelope and Its Modifications',
      objective: "By the end of this you can name the three layers of a bacterial cell envelope in order, and explain what separates Gram positive from Gram negative bacteria.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Most prokaryotic cells — bacterial cells especially — wrap themselves in a **chemically complex cell envelope**: a tightly bound **three-layered structure**. From the outside in, that's the **glycocalyx**, then the **cell wall**, then the **plasma membrane**. Each layer does its own distinct job, but together they act as **one single protective unit**.\n\nThe cell envelope is also what sorts bacteria into two groups, based on how they respond to a staining test developed by Gram: bacteria that **take up the Gram stain** are **Gram positive**, and bacteria that **do not** are **Gram negative**.\n\nThe **glycocalyx** itself is not fixed — it differs in **composition and thickness** from one bacterium to the next. Sometimes it's a **loose sheath called the slime layer**; in others it thickens into a **tough capsule**. The **cell wall** underneath it **determines the shape of the cell** and gives it enough **structural support to keep it from bursting or collapsing**. The innermost layer, the **plasma membrane**, is **selectively permeable** and is the layer that actually **interacts with the outside world** — structurally, it's **similar to the plasma membrane of a eukaryotic cell**.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 8, src: '',
      alt: 'A cutaway of the three-layered bacterial cell envelope, peeled back to show the glycocalyx, cell wall, and plasma membrane as separate layers',
      caption: '📸 Tap each layer, from outermost to innermost',
      generation_prompt: "Scientific textbook illustration of the bacterial cell envelope, three layers peeled back and shown separately in a horizontal cutaway. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Three concentric curved bands drawn side by side left to right, each peeled slightly apart to show it is a distinct layer: the leftmost/outermost band is a loose, wavy sheath (glycocalyx), the middle band is a firmer, more rigid layer (cell wall), and the rightmost/innermost band is a thin double-line membrane (plasma membrane), with a hint of cytoplasm just past the innermost layer. Clean white outlines, thin white leader lines, biologically accurate schematic proportions, pale tan/grey tones for the wall and membrane layers, no photorealism, no cartoon, matches standard biology textbook illustration conventions. No text or labels baked into the image itself.",
      hotspots: [
        { id: uuid(), x: 0.18, y: 0.5, label: 'Glycocalyx', icon: 'circle',
          detail: "The **outermost layer**. Varies in composition and thickness — a loose sheath is a **slime layer**, a thick tough one is a **capsule**." },
        { id: uuid(), x: 0.5, y: 0.5, label: 'Cell Wall', icon: 'circle',
          detail: "The **middle layer**. **Determines the shape of the cell** and gives it strong structural support so it doesn't burst or collapse." },
        { id: uuid(), x: 0.82, y: 0.5, label: 'Plasma Membrane', icon: 'circle',
          detail: "The **innermost layer**. **Selectively permeable**, interacts with the outside world, and is structurally similar to a eukaryotic plasma membrane." },
      ],
    },
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "The plasma membrane isn't just a boundary — in prokaryotes it also folds inward to build the **mesosome**, formed by extensions of the plasma membrane into the cell in the form of **vesicles, tubules, and lamellae**. A single structure, but it earns its keep in several jobs at once: it helps in **cell wall formation**, in **DNA replication and its distribution to daughter cells**, and it also helps in **respiration**, **secretion processes**, and in **increasing the surface area of the plasma membrane and its enzymatic content**.\n\nSome prokaryotes take this idea further. In **cyanobacteria**, there are other membranous extensions into the cytoplasm called **chromatophores**, and these actually **contain pigments** — they're what let cyanobacteria carry out photosynthesis.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "A bacterium is found that can no longer form its cell wall properly during division, fails to distribute replicated DNA cleanly to its daughter cells, and shows weaker respiration and secretion than normal. Which single structure is most likely damaged, and why does damaging just one structure explain all of these failures together?",
      options: [
        "The mesosome — it is formed by infoldings of the plasma membrane and is the structure that helps with cell wall formation, DNA replication and distribution to daughter cells, respiration, secretion, and increasing the plasma membrane's surface area and enzymatic content",
        "The ribosome — since it is the only organelle prokaryotes possess, any defect in the cell must trace back to it",
        "The glycocalyx — since it is the outermost layer and decides whether the bacterium is Gram positive or Gram negative",
        "The plasmid — since plasmid DNA confers unique phenotypic characters such as antibiotic resistance, a damaged plasmid would disrupt DNA replication and distribution",
      ],
      correct_index: 0,
      reveal: "The mesosome is the one structure NCERT credits with exactly this list of jobs — cell wall formation, DNA replication and distribution to daughter cells, respiration, secretion, and increasing the plasma membrane's surface area and enzymatic content — because it's a fold of the plasma membrane itself, so damaging it disrupts all of those at once. The ribosome (option B) really is the only organelle prokaryotes have besides these membrane structures, but its job is protein synthesis, not any of the functions described here. The glycocalyx (option C) genuinely determines Gram staining, but that's a staining property, not cell wall formation or DNA distribution. The plasmid (option D) genuinely carries phenotypic traits like antibiotic resistance, but it is extra circular DNA, not the machinery that replicates and distributes the main genome — that mix-up is exactly the kind of half-right distractor NEET uses.",
      difficulty_level: 3,
    },
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "Bacterial cells may be **motile or non-motile**. A motile bacterium has **thin filamentous extensions from its cell wall called flagella**, and bacteria vary a lot in **how many flagella they have and how they're arranged**. A bacterial **flagellum is built from three parts — filament, hook, and basal body**. The **filament is the longest part**, and it's the piece that actually **extends from the cell surface to the outside**.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 12, title: 'Flagella vs Pili vs Fimbriae — Don\'t Mix These Up',
      columns: [
        { heading: 'Flagella', points: ["Present on motile bacteria only", "Thin filamentous extensions from the cell wall", "Number and arrangement vary between bacteria", "Built from three parts: filament, hook, basal body", "Filament is the longest part and extends outward"] },
        { heading: 'Pili', points: ["Do NOT play a role in motility", "Elongated, tubular surface structures", "Made of a special protein"] },
        { heading: 'Fimbriae', points: ["Do NOT play a role in motility", "Small, bristle-like fibres sprouting from the cell", "In some bacteria, help attach the bacterium to rocks in streams and to host tissues"] },
      ],
    },
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember', title: 'Lock These In',
      markdown: "- All prokaryotes have a cell wall around the cell membrane **except mycoplasma**.\n- No well-defined nucleus — genetic material is **naked**, not enclosed by a **nuclear membrane** (nuclear membrane = eukaryotes only).\n- Genomic DNA = one **circular chromosome**; **plasmids** are separate, smaller circular DNA that confer traits like antibiotic resistance.\n- No organelles like eukaryotes' **except ribosomes**.\n- Cell envelope, outside to inside: **glycocalyx → cell wall → plasma membrane**. Gram stain response splits bacteria into **Gram positive** (stain-taking) and **Gram negative** (non-staining).\n- **Mesosome** = infoldings of the plasma membrane. Functions: **cell wall formation, DNA replication + distribution, respiration, secretion, increasing membrane surface area/enzymatic content**.\n- **Flagella** = motility. **Pili and fimbriae** = surface structures that do **not** aid motility.",
    },
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Mesosome function is a straight-recall NCERT exercise question — memorise it as a list of five:** cell wall formation; DNA replication and distribution to daughter cells; respiration; secretion processes; increasing the plasma membrane's surface area and enzymatic content. If a question gives you any one or two of these and asks which structure is responsible, the answer is the mesosome.\n\n**The mycoplasma exception is a favourite trap:** every prokaryote has a cell wall around its cell membrane — except mycoplasma. A question that says \"which of the following prokaryotes lacks a cell wall\" is testing exactly this one line.\n\n**Classic NEET question:** \"Mesosomes are the infoldings of ______, and help in ______, ______, and ______.\" → plasma membrane; cell wall formation; DNA replication and distribution; respiration and secretion.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which of the four basic bacterial shapes is comma-shaped?',
          options: ['Bacillus', 'Coccus', 'Vibrio', 'Spirillum'],
          correct_index: 2,
          explanation: "Vibrio is the comma-shaped bacterial form. Bacillus is rod-like, coccus is spherical, and spirillum is spiral — each a distinct one of the four basic shapes, not interchangeable with vibrio's comma shape.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Which prokaryote is the one exception to the rule that all prokaryotes have a cell wall surrounding the cell membrane?',
          options: ['Mycoplasma', 'Cyanobacteria (blue-green algae)', 'Vibrio', 'Bacillus'],
          correct_index: 0,
          explanation: "Mycoplasma is the stated exception — it has no cell wall at all. Cyanobacteria, vibrio-shaped bacteria, and bacillus-shaped bacteria all follow the general rule and do have a cell wall surrounding their cell membrane.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: "Going from the outermost layer inward, what is the correct order of the three layers in a bacterial cell envelope?",
          options: [
            'Cell wall → glycocalyx → plasma membrane',
            'Glycocalyx → cell wall → plasma membrane',
            'Plasma membrane → cell wall → glycocalyx',
            'Glycocalyx → plasma membrane → cell wall',
          ],
          correct_index: 1,
          explanation: "The cell envelope, from outside to inside, is glycocalyx, then cell wall, then plasma membrane. Any order that puts the cell wall or plasma membrane before the glycocalyx, or swaps the cell wall and plasma membrane, reverses the actual layering NCERT describes.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'A bacterial surface structure is elongated and tubular, made of a special protein, and plays no role in the bacterium\'s movement. What is it?',
          options: ['Flagellum', 'Pili', 'Mesosome', 'Chromatophore'],
          correct_index: 1,
          explanation: "This describes pili — elongated tubular structures made of a special protein that do not aid motility. Flagella are the structures that do provide motility, so they don't fit \"plays no role in movement.\" A mesosome is an infolding of the plasma membrane with roles in cell wall formation, DNA distribution, respiration and secretion, not a tubular surface structure. Chromatophores are pigment-containing membranous extensions found in cyanobacteria, unrelated to bacterial surface attachment structures.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
