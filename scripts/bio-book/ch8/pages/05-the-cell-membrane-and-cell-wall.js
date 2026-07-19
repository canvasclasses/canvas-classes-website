'use strict';
const { v4: uuid } = require('uuid');

const membraneHotspots = [
  {
    id: uuid(), x: 0.50, y: 0.50, label: 'Phospholipid Bilayer', icon: 'circle',
    detail: "The membrane's main lipid layer — two rows of phospholipid molecules stacked back to back. This is the basic structure that gives the membrane its shape.",
  },
  {
    id: uuid(), x: 0.20, y: 0.24, label: 'Polar (Hydrophilic) Head', icon: 'circle',
    detail: "The phosphate-containing head of each phospholipid. It's **polar**, so it always faces the watery surroundings — the outer side of the outer row, and the inner side of the inner row.",
  },
  {
    id: uuid(), x: 0.20, y: 0.62, label: 'Hydrophobic Tail', icon: 'circle',
    detail: "The fatty, nonpolar tail of each phospholipid. Both rows point their tails **toward each other, into the inner part of the membrane** — this keeps the tails shielded from the aqueous environment on either side.",
  },
  {
    id: uuid(), x: 0.38, y: 0.50, label: 'Cholesterol', icon: 'circle',
    detail: "Sits among the phospholipids, inside the bilayer. Chemical studies on the membrane — done mainly on human red blood cells — showed cholesterol as a regular part of the membrane, alongside the phospholipids.",
  },
  {
    id: uuid(), x: 0.60, y: 0.32, label: 'Integral Protein', icon: 'circle',
    detail: "A protein that sits **partially or totally buried in the membrane**. Integral proteins are classified this way by how hard they are to pull out — much harder to extract than a peripheral protein.",
  },
  {
    id: uuid(), x: 0.78, y: 0.18, label: 'Peripheral Protein', icon: 'circle',
    detail: "A protein that simply **lies on the surface of the membrane**, not buried in it. That surface position is exactly what makes peripheral proteins easier to extract.",
  },
  {
    id: uuid(), x: 0.88, y: 0.10, label: 'Sugar (Carbohydrate) Chain', icon: 'circle',
    detail: "A short carbohydrate chain projecting from the outer face of the membrane. Biochemical investigation revealed that, besides lipid and protein, the membrane also carries carbohydrate.",
  },
];

module.exports = {
  slug: 'the-cell-membrane-and-cell-wall',
  title: 'The Cell Membrane and Cell Wall',
  subtitle: "One boundary is a fluid sea of lipid and protein that lets molecules cross in careful, controlled ways. The other is a rigid, non-living wall that never moves at all. Every cell needs both — for very different reasons.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['cell-the-unit-of-life', 'cell-membrane', 'cell-wall'],
  glossary: [
    { term: 'phospholipid bilayer', definition: "The main lipid arrangement of the cell membrane — two layers of phospholipid molecules, polar heads facing the outer sides, hydrophobic tails facing the inner part, protecting the tails from the aqueous environment." },
    { term: 'peripheral protein', definition: 'A membrane protein that lies on the surface of the membrane — easier to extract than an integral protein.' },
    { term: 'integral protein', definition: 'A membrane protein that is partially or totally buried in the membrane — harder to extract than a peripheral protein.' },
    { term: 'fluid mosaic model', definition: "The widely accepted model of membrane structure proposed by Singer and Nicolson (1972): the quasi-fluid nature of the lipid bilayer lets proteins move laterally within it." },
    { term: 'fluidity', definition: "The membrane's ability to let proteins move within it — important for cell growth, formation of intercellular junctions, secretion, endocytosis, and cell division." },
    { term: 'passive transport', definition: 'Movement of molecules across the membrane without any requirement of energy.' },
    { term: 'osmosis', definition: 'Diffusion of water across the membrane, from higher concentration to lower concentration.' },
    { term: 'active transport', definition: 'Movement of ions or molecules across the membrane against their concentration gradient — an energy-dependent process that uses ATP, e.g. the Na+/K+ Pump.' },
    { term: 'cell wall', definition: 'A non-living rigid structure that forms an outer covering for the plasma membrane of fungi and plants.' },
    { term: 'middle lamella', definition: 'A layer mainly of calcium pectate that holds or glues neighbouring plant cells together.' },
    { term: 'plasmodesmata', definition: 'Channels that traverse the cell wall and middle lamella, connecting the cytoplasm of neighbouring cells.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dusk coastline: a solid stone rampart standing motionless beside constantly shifting tidal water',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A dusk coastal scene split naturally down the middle: on one side, a solid, weathered stone rampart wall stands completely still and unmoving, its surface catching the last warm light; on the other side, shallow tidal water ripples and shifts constantly around smooth rocks, in constant gentle motion. No people, no boats, no text, no labels. Deep dusk lighting, painterly illustration style, dark naturalistic background throughout (#0a0a0a base tones), atmospheric and moody.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Nobody Knew What the Membrane Was Made Of Until They Studied Blood',
      markdown: "For decades, biologists could see under the microscope that a cell had some kind of outer boundary — but nobody knew what it was actually built from. The answer came from an unlikely source: **chemical studies on human red blood cells (RBCs)**. RBCs are unusually easy to work with because, once you remove their contents, what's left is almost pure membrane. Studying that leftover membrane is exactly what let scientists deduce its structure.",
    },
    // ── 2 · Core concept — bilayer + cholesterol ─────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The detailed structure of the cell membrane was only worked out after the **electron microscope** arrived in the **1950s**. Combined with the chemical studies on RBCs, this revealed that the membrane is mainly built from **lipids and proteins**.\n\nThe major lipids are **phospholipids**, and they don't sit randomly — they arrange themselves into a **bilayer**, two layers stacked back to back. Each phospholipid has a **polar head** and a **hydrophobic (water-repelling) tail**. In the bilayer, the polar heads face the outer sides — toward the watery surroundings on both faces of the membrane — while the hydrophobic tails point inward, toward each other. This arrangement protects the nonpolar tails from ever having to touch water. The membrane also contains **cholesterol**, sitting alongside the phospholipids within this same bilayer.",
    },
    // ── 3 · Heading — Fluid Mosaic Model ──────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Fluid Mosaic Model — Lipids, Proteins, and Movement',
      objective: "By the end of this you can name the two protein types by how they're extracted, and explain what 'fluidity' actually means and why the membrane needs it.",
    },
    // ── 4 · Text — protein ratio, peripheral/integral, fluid mosaic, fluidity ──
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Later biochemical investigation showed the membrane also carries **protein and carbohydrate**, on top of its lipids. How much protein versus lipid it carries isn't fixed — it varies considerably from one cell type to another. In the human RBC, the membrane works out to roughly **52 per cent protein and 40 per cent lipid**.\n\nMembrane proteins are classified by one simple, practical test: **how easily they can be extracted**. **Peripheral proteins** lie on the surface of the membrane, so they come away relatively easily. **Integral proteins** are partially or totally buried inside the membrane, so extracting them is much harder.\n\nIn **1972**, **Singer and Nicolson** proposed an improved model of the membrane's structure — the **fluid mosaic model**, still the widely accepted picture today. Their key insight: the lipid bilayer is **quasi-fluid**, not rigid, and that fluid nature lets proteins **move laterally** within the overall bilayer. This ability to move is what's measured as the membrane's **fluidity**. Fluidity isn't a side detail — it's essential for several jobs the cell has to do: **cell growth, forming intercellular junctions, secretion, endocytosis, and cell division**. Tap through Figure 8.4 below to see how every piece — bilayer, cholesterol, both protein types, and the carbohydrate chains — actually sits together.",
    },
    // ── 5 · Interactive diagram — Figure 8.4 ──────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Figure 8.4 — the fluid mosaic model of the plasma membrane, showing the phospholipid bilayer, cholesterol, peripheral and integral proteins, and carbohydrate chains',
      caption: '📸 Tap each part of Figure 8.4 — the fluid mosaic model of the plasma membrane',
      hotspots: membraneHotspots,
      generation_prompt: "Scientific textbook illustration of the fluid mosaic model of the plasma membrane, matching NCERT Figure 8.4. Flat 2D educational diagram on a dark background (#0a0a0a near-black), clean white outlines, biologically accurate proportions. A horizontal phospholipid bilayer spans the width of the image: two rows of phospholipid molecules, each drawn as a small circular head with two wavy tails, the circular heads facing outward toward the top and bottom edges of the image and the wavy tails pointing inward toward each other to meet in the centre band. Several rounded cholesterol molecules are shown nested among the phospholipid tails within the bilayer. One large protein shape spans the full thickness of the bilayer from top to bottom (an integral protein), rendered with an irregular globular form threading through the lipid tails. A second, smaller protein shape sits only on the outer surface of the bilayer, not penetrating it (a peripheral protein). Short branching chain shapes (representing sugar/carbohydrate) project outward from the outer surface near one of the proteins. Labels in white text with thin white leader lines point to: phospholipid bilayer, cholesterol, integral protein, peripheral protein, sugar/carbohydrate. No photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
    },
    // ── 6 · Reasoning prompt — peripheral vs integral ─────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A researcher is trying to remove two different membrane proteins for study. Protein X comes off easily just by rinsing the membrane surface. Protein Y stays firmly attached even after that rinse, and only comes free once the lipid bilayer itself is broken apart. Which protein is peripheral and which is integral, and what's the basis for that classification?",
      options: [
        "Protein X is peripheral (lies on the membrane surface, easy to extract); Protein Y is integral (buried partially or totally in the membrane, hard to extract) — the classification is based on ease of extraction",
        "Protein X is integral and Protein Y is peripheral — proteins that are easiest to remove are always the ones buried deepest in the bilayer",
        "Both proteins are integral, since every membrane protein sits at least partly inside the phospholipid bilayer by definition",
        "The classification depends on the protein's size, not its position — larger proteins are always peripheral, smaller ones always integral",
      ],
      reveal: "Protein X is peripheral — it lies on the surface of the membrane, which is exactly why a simple rinse removes it. Protein Y is integral — partially or totally buried in the membrane, which is why nothing short of breaking apart the bilayer gets it out. NCERT's own basis for this classification is ease of extraction, nothing else. Swapping the two is the classic trap; claiming both are integral ignores that peripheral proteins exist precisely because they sit on the surface, not inside; and protein size was never part of the definition at all.",
      difficulty_level: 2,
    },
    // ── 7 · Heading — Transport ───────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Transport Across the Membrane — Passive and Active',
      objective: "By the end of this you can tell passive transport from active transport in any scenario, and explain exactly why polar molecules can't just cross the membrane on their own.",
    },
    // ── 8 · Text — passive + active transport ────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "One of the plasma membrane's most important jobs is **transport** — moving molecules across it. The membrane is **selectively permeable**: only certain molecules on either side get to cross.\n\nSome movement needs no energy at all. This is **passive transport**. Neutral solutes can move across the membrane by **simple diffusion**, always along the concentration gradient — from where they're more concentrated to where they're less concentrated. Water moves the same way, and when it does, that specific movement gets its own name: **osmosis**.\n\nBut not every molecule can just diffuse straight through. The membrane's core is the nonpolar, hydrophobic lipid bilayer you just met — and **polar molecules cannot pass through a nonpolar bilayer** on their own. To cross at all, a polar molecule needs a **carrier protein** in the membrane to facilitate its transport.\n\nSome transport goes the opposite direction entirely: a few ions or molecules are moved **against their concentration gradient** — from lower concentration to higher concentration. That can never happen for free. It's an **energy-dependent process**, using **ATP**, and it's called **active transport**. The textbook example is the **Na+/K+ Pump**.",
    },
    // ── 9 · Reasoning prompt — passive vs active ──────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A cell keeps moving a particular ion from a region where it's already scarce into a region where it's already abundant. The moment the cell's ATP supply is cut off, this movement stops completely. What kind of transport is this, and why does it fit that description?",
      options: [
        "Active transport — it moves the ion against its concentration gradient (low to high), and it stops without ATP because active transport is energy-dependent, exactly like the Na+/K+ Pump",
        "Simple diffusion — molecules always move from higher to lower concentration without needing energy, which matches an ion moving from scarce to abundant",
        "Osmosis — this describes water moving from a region of higher concentration to lower concentration across the membrane",
        "Passive transport via a carrier protein — carrier proteins only assist movement along the concentration gradient, so this fits a low-to-high movement",
      ],
      reveal: "This is active transport. The ion is moving from lower concentration to higher concentration — against its gradient — which passive processes never do on their own. And the fact that it stops the instant ATP runs out is the clearest sign of all: active transport is energy-dependent, using ATP, exactly like the Na+/K+ Pump. Simple diffusion and osmosis both move things from higher to lower concentration, the opposite direction described here, and neither needs energy. A carrier protein can help a polar molecule cross passively, but that assisted movement is still along the gradient, not against it — this scenario is moving against the gradient and depends on ATP, which only active transport explains.",
      difficulty_level: 3,
    },
    // ── 10 · Comparison card ───────────────────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 10, title: 'Passive Transport vs Active Transport',
      columns: [
        {
          heading: 'Passive Transport',
          points: [
            'No energy required',
            'Moves along the concentration gradient — higher to lower',
            'Neutral solutes: simple diffusion. Water: osmosis',
            'Polar molecules still need a carrier protein to cross, even though no energy is spent',
          ],
        },
        {
          heading: 'Active Transport',
          points: [
            'Energy-dependent — uses ATP',
            'Moves against the concentration gradient — lower to higher',
            'Example: the Na+/K+ Pump',
            'Stops as soon as the ATP supply is cut off',
          ],
        },
      ],
    },
    // ── 11 · Heading — Cell Wall ───────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 11, level: 2,
      text: 'The Cell Wall — A Non-Living Armour for Fungi and Plants',
      objective: "By the end of this you can list what the cell wall is made of, what it does, and tell a primary wall from a secondary wall by which one still grows.",
    },
    // ── 12 · Text — wall structure, function, composition ──────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "Unlike the membrane, the **cell wall** is a **non-living, rigid structure**. It forms an **outer covering for the plasma membrane** — but only in **fungi and plants**. It does four jobs at once: it **gives the cell its shape**, it **protects the cell from mechanical damage and infection**, it **helps in cell-to-cell interaction**, and it acts as a **barrier to undesirable macromolecules** trying to get in.\n\nWhat it's built from isn't identical everywhere. **Algae** have a cell wall made of **cellulose, galactans, mannans, and minerals like calcium carbonate**. In other plants, the wall is instead made of **cellulose, hemicellulose, pectins, and proteins**.\n\nA young plant cell's wall — the **primary wall** — is **capable of growth**. As the cell matures, that growth capability **gradually diminishes**, and a **secondary wall** forms **on the inner side of the cell, toward the membrane**. So a cell wall isn't fixed the moment it's built — it's laid down in stages, growing first and then adding a second, inner layer as the cell settles into maturity.\n\nWhere two plant cells sit next to each other, there's one more layer holding them together: the **middle lamella**, made mainly of **calcium pectate**, gluing the neighbouring cells to one another. The cell wall and middle lamella aren't a sealed barrier, though — they're traversed by **plasmodesmata**, channels that connect the cytoplasm of one cell directly to its neighbour's.",
    },
    // ── 13 · Remember callout ────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember', title: 'Membrane and Wall — In One Line Each',
      markdown: "- **Cell membrane** = mainly lipids + proteins. Phospholipids form a **bilayer**, polar heads out, hydrophobic tails in; also carries **cholesterol**, protein, and carbohydrate.\n- **Peripheral protein** = surface, easy to extract. **Integral protein** = buried, hard to extract. **Fluid mosaic model** (Singer & Nicolson, 1972) = quasi-fluid bilayer lets proteins move laterally = **fluidity**.\n- **Passive transport** = no energy; along the gradient (simple diffusion for solutes, osmosis for water). Polar molecules still need a **carrier protein**. **Active transport** = against the gradient, needs **ATP** (e.g. **Na+/K+ Pump**).\n- **Cell wall** = non-living, rigid, outer covering of the plasma membrane in **fungi and plants only**. Algae wall = cellulose + galactans + mannans + calcium carbonate. Other plants = cellulose + hemicellulose + pectins + proteins.\n- **Primary wall** = can still grow. **Secondary wall** = forms later, on the inner side, as growth diminishes. **Middle lamella** (calcium pectate) glues neighbouring cells; **plasmodesmata** connect their cytoplasm across the wall.",
    },
    // ── 14 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**The carrier-protein logic chain — tested constantly:** polar molecules cannot cross the nonpolar lipid bilayer directly. That single fact is why a carrier protein is required for them — not for every molecule, just the polar ones that the bilayer itself blocks. NEET loves testing whether you know *why* a carrier protein is needed, not just that one exists.\n\n**Primary wall vs secondary wall — a clean, memorisable fact:** the **primary wall** forms first, in a young cell, and is **capable of growth**. As the cell matures, that growth capability diminishes and the **secondary wall** forms **on the inner (membrane-facing) side**. If a question describes a wall that 'can still grow,' it's primary; if it describes a wall forming later, closer to the membrane, it's secondary.\n\n**Classic NEET question:** \"The plasma membrane model proposed by Singer and Nicolson is called ___\" → **fluid mosaic model.**",
    },
    // ── 15 · Bridge text ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 15,
      markdown: "You now have both of the cell's outer boundaries mapped — the fluid, selectively permeable membrane and the rigid, protective wall around it in plants and fungi. Next comes what those boundaries enclose: the endomembrane system, the network of internal compartments working together just inside the cell.",
    },
    // ── 16 · Inline quiz ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 16, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'The plasma membrane is mainly composed of lipids and proteins. How are the major lipids, the phospholipids, arranged within the membrane?',
          options: [
            'In a single layer, with all polar heads facing the same direction',
            'In a bilayer, with polar heads facing the outer sides and hydrophobic tails facing the inner part',
            'In a bilayer, with hydrophobic tails facing the outer sides and polar heads facing the inner part',
            'Scattered randomly with no consistent orientation of heads or tails',
          ],
          correct_index: 1,
          explanation: "Phospholipids form a bilayer with polar heads on the outer sides (facing the watery surroundings) and hydrophobic tails pointing inward, protecting the nonpolar tails from water. Reversing the heads and tails, or claiming a single layer or random scattering, all contradict this arrangement.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'Singer and Nicolson (1972) proposed a model of membrane structure that is now widely accepted. What is it called, and what does it say about protein movement?',
          options: [
            'The static lattice model — proteins are permanently fixed in position within the bilayer',
            'The fluid mosaic model — the quasi-fluid lipid bilayer allows proteins to move laterally within it',
            'The rigid scaffold model — only peripheral proteins can move, integral proteins never move',
            'The unit membrane model — the membrane is a single solid sheet with no separate lipid and protein components',
          ],
          correct_index: 1,
          explanation: "Singer and Nicolson's fluid mosaic model describes the lipid bilayer as quasi-fluid, which lets proteins move laterally within it — this movement ability is the membrane's fluidity. There is no 'static lattice,' 'rigid scaffold,' or 'unit membrane' model in this text, and the whole point of the fluid mosaic model is that the bilayer is fluid, not solid or fixed.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'A polar molecule needs to cross the plasma membrane. Why can it not simply diffuse through on its own the way a neutral solute does, and what does it need instead?',
          options: [
            'It can diffuse through just as easily as a neutral solute — no extra help is needed',
            'It cannot pass through the nonpolar lipid bilayer directly, so it requires a carrier protein in the membrane to facilitate its transport',
            'It requires ATP and active transport every single time it crosses the membrane',
            'It can only cross by being converted into a neutral solute first',
          ],
          correct_index: 1,
          explanation: "Polar molecules cannot pass through the nonpolar lipid bilayer directly, so they require a carrier protein to facilitate their transport across the membrane. This doesn't mean they always need ATP — that carrier-assisted crossing can still be passive; it just means they can't cross unassisted the way a neutral solute can by simple diffusion.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'A young plant cell has a wall that is still capable of growth. As the cell matures, this growth capability diminishes and a new wall layer forms on the inner, membrane-facing side. What are these two wall layers called?',
          options: [
            'The primary wall (still capable of growth) and the secondary wall (forms later, on the inner side)',
            'The middle lamella (still capable of growth) and the primary wall (forms later, on the inner side)',
            'The secondary wall (still capable of growth) and the primary wall (forms later, on the inner side)',
            'The cellulose layer (still capable of growth) and the pectin layer (forms later, on the inner side)',
          ],
          correct_index: 0,
          explanation: "The primary wall of a young cell is capable of growth; that capability diminishes as the cell matures, and the secondary wall forms afterward, on the inner (membrane-facing) side. Swapping primary and secondary reverses the actual order of formation, and the middle lamella is a separate layer — mainly calcium pectate — that glues neighbouring cells together, not a growth-capable wall itself.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
