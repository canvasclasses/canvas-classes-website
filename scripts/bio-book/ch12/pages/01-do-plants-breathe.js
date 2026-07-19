'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'do-plants-breathe',
  title: 'Do Plants Breathe?',
  subtitle: "Plants need oxygen and give out carbon dioxide just like you do — but they have no lungs, no nose, no organs for it at all. Here's how they manage, and why every living thing burns food in tiny controlled steps instead of one big flame.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['respiration-in-plants', 'cellular-respiration'],
  glossary: [
    { term: 'cellular respiration', definition: 'The breaking of the C–C bonds of complex compounds through oxidation within cells, releasing a large amount of energy. The breakdown happens in the cytoplasm and mitochondria.' },
    { term: 'respiratory substrate', definition: 'The compound that is oxidised during respiration to release energy. Usually a carbohydrate like glucose, but proteins, fats and even organic acids can serve as substrates in some plants under certain conditions.' },
    { term: 'ATP', definition: 'The molecule in which the energy released by respiration is trapped and stored. It is broken down wherever and whenever energy is needed, so it acts as the energy currency of the cell.' },
    { term: 'stomata', definition: 'Tiny pores, mainly on leaves, through which a plant exchanges gases with the air. Plants use these instead of specialised respiratory organs.' },
    { term: 'lenticels', definition: 'Openings in the bark of woody stems and roots that allow gas exchange between the living inner cells and the outside air.' },
    { term: 'parenchyma', definition: 'A living plant tissue whose loose packing creates an interconnected network of air spaces in leaves, stems and roots, keeping most cells in contact with air.' },
    { term: 'facultative anaerobe', definition: 'An organism that can survive with or without oxygen — it manages either way.' },
    { term: 'obligate anaerobe', definition: 'An organism for which anaerobic (oxygen-free) conditions are a requirement, not a choice.' },
    { term: 'glycolysis', definition: 'The breakdown of glucose to pyruvic acid without the help of oxygen. Every living organism keeps the enzymes for this step.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single broad leaf and a cross-cut woody branch resting on dark ground, faint wisps of vapour drifting from the surfaces as if the plant is quietly breathing',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single broad green leaf lies beside a freshly cut woody branch on dark earth, in soft dim light. Faint, barely-visible wisps of translucent vapour drift up from the surface of the leaf and from the pale cut face of the branch, suggesting a quiet, invisible exchange of breath, without any literal arrows or labels. Deep shadows fill the frame; subtle warm rim-light catches the edge of the leaf and the rings of the cut wood. Painterly, atmospheric, naturalistic illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'A Tree Breathes — Without a Single Lung',
      markdown: "You have a nose, a windpipe and two lungs whose only job is to move air in and out. A giant banyan tree does the same job — it takes in oxygen, it gives out carbon dioxide — but it has **no nose, no lungs, no breathing organ of any kind**. It gets away with this because of a few clever tricks of size and packing that we'll unpack on this page.",
    },
    // ── 2 · Core concept — respiration, respiratory substrate, ATP ────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Every living thing needs energy — to absorb, to transport, to move, to reproduce, even to breathe. All of that energy comes from the **oxidation of food** — the large molecules (macromolecules) we call food. And here's the chain worth remembering: **all the food that gets respired ultimately comes from photosynthesis.** Green plants trap light energy and lock it into the bonds of carbohydrates like glucose; everything else, plant or animal, eventually lives off that.\n\nSo what exactly is respiration? **Cellular respiration is the breaking of the C–C bonds of complex compounds through oxidation, inside the cell, releasing a large amount of energy.** The compounds that get oxidised are called **respiratory substrates** — usually carbohydrates, but proteins, fats and even organic acids can be used in some plants under certain conditions.\n\nOne detail decides everything that follows: the cell does **not** release all that energy in one burst. It comes out in a **series of slow, step-wise reactions controlled by enzymes**, and the energy is trapped as **ATP**. ATP is then broken down wherever and whenever energy is needed — which is why **ATP is called the energy currency of the cell**. (Photosynthesis happens in the chloroplast; this breakdown for energy happens in the **cytoplasm and mitochondria**.)",
    },
    // ── 3 · Heading — gas exchange without organs ─────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'How Plants Exchange Gases Without Any Breathing Organ',
      objective: "By the end of this you can name the two structures plants use for gas exchange and give the three reasons they don't need lungs.",
    },
    // ── 4 · Text — do plants breathe, the three reasons ───────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "So, do plants breathe? **Yes.** Plants need **O₂** for respiration and they give out **CO₂**. But unlike animals, they have **no specialised organs for gaseous exchange** — instead they use **stomata** (mainly on leaves) and **lenticels** (openings in woody bark).\n\nWhy can a plant get away without breathing organs? NCERT gives three reasons:\n\n1. **Each plant part looks after its own gas exchange.** There is very little transport of gases from one part of a plant to another — a leaf handles its own needs, a root handles its own.\n2. **Plants don't demand much gas exchange.** Roots, stems and leaves respire at rates **far lower** than animals do. (Only during photosynthesis are large volumes of gas exchanged, and even then O₂ is released *inside* the photosynthesising cell, so supply isn't a problem.)\n3. **The diffusion distance is short.** Every living cell in a plant sits **quite close to the surface**. In a thick woody stem the living cells lie in thin layers just under the bark (the deep interior cells are dead and only give mechanical support), and **loosely packed parenchyma** creates an interconnected network of air spaces. So most cells have at least part of their surface touching air.",
    },
    // ── 5 · Interactive image — gas exchange surfaces ─────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A leaf showing a stoma pore on one side and a cross-section of a woody stem showing a lenticel opening through the bark, with loosely packed parenchyma cells and air spaces beneath',
      caption: '📸 Tap each dot to explore how a plant swaps gases with the air — without a single breathing organ.',
      generation_prompt: "Scientific textbook illustration of gas-exchange surfaces in a plant. Flat 2D educational diagram on a dark background (#0a0a0a near-black). On the left, a green leaf shown in surface view with one small pore (a stoma) drawn as an opening between two curved cells. On the right, a cross-section through a woody stem: a brown/tan outer bark layer with a small raised opening (a lenticel) breaking through it, a thin layer of pale green living cells just inside and beneath the bark, and a darker interior of dead support cells. Between the living cells, draw loosely-packed rounded parenchyma cells with clear gaps (air spaces) forming an interconnected network. Clean white outlines, biologically accurate proportions, functional colours: green for living photosynthetic tissue, brown/tan for dead woody bark. No labels, no leader lines, no text. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.22, y: 0.32, label: 'Stoma (leaf)', detail: 'A tiny pore, mainly on leaves, where O₂ enters and CO₂ leaves. This — not any lung — is how a leaf breathes.', icon: 'circle' },
        { id: uuid(), x: 0.70, y: 0.30, label: 'Lenticel (woody stem)', detail: 'An opening in the bark of a woody stem or root. It lets the living inner cells swap gases with the outside air.', icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.50, label: 'Living cells beneath the bark', detail: 'In a thick stem the living cells sit in thin layers just inside and beneath the bark — close to the surface, so gases reach them easily.', icon: 'circle' },
        { id: uuid(), x: 0.78, y: 0.72, label: 'Dead interior cells', detail: 'The cells deep in the interior of a woody stem are dead. They provide only mechanical support, so they need no gas supply.', icon: 'circle' },
        { id: uuid(), x: 0.40, y: 0.62, label: 'Loosely-packed parenchyma', detail: 'Parenchyma cells are packed loosely, leaving an interconnected network of air spaces in leaves, stems and roots — so most cells have part of their surface in contact with air.', icon: 'circle' },
      ],
    },
    // ── 6 · Heading — why oxidise glucose in steps ────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Why Burn Glucose in Tiny Steps Instead of One Flame?',
      objective: "By the end of this you can write the glucose combustion equation and explain why the cell breaks glucose in many small steps rather than one.",
    },
    // ── 7 · Text — combustion equation and the stepwise strategy ──────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Set glucose on fire and it burns completely, giving carbon dioxide and water, and releasing energy — but **most of that energy escapes as heat**:\n\n$$C_6H_{12}O_6 + 6O_2 \\rightarrow 6CO_2 + 6H_2O + \\text{Energy}$$\n\nHeat is useless to a cell — it can't build molecules with a puff of hot air. So the cell uses a smarter strategy: it **catabolises glucose in several small steps instead of one**. Each step is sized so that the energy it releases can be **coupled to ATP synthesis** rather than lost as heat. That controlled, step-by-step burn *is* the story of respiration.\n\nOne more twist: the combustion reaction needs oxygen, but some organisms live where oxygen may not be available. **Facultative anaerobes** can manage with or without O₂; **obligate anaerobes** actually require oxygen-free conditions. And here's the unifying fact — **every** living organism keeps the enzymes to *partially* oxidise glucose without any oxygen at all. That first oxygen-free breakdown of glucose to **pyruvic acid** is called **glycolysis**.",
    },
    // ── 8 · Comparison card — combustion vs respiration ───────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 8,
      title: 'Combustion vs Cellular Respiration',
      columns: [
        {
          heading: 'Burning glucose (combustion)',
          points: [
            'Happens in a single step',
            'Releases all its energy at once',
            'Almost all the energy is lost as heat',
            'Heat cannot be used to build molecules',
          ],
        },
        {
          heading: 'Cellular respiration',
          points: [
            'Happens in many small, step-wise reactions',
            'Each step is controlled by enzymes',
            'Energy is trapped as ATP, not lost',
            'ATP is spent later, wherever energy is needed',
          ],
        },
      ],
    },
    // ── 9 · Reasoning prompt — mid-page check ─────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A giant tree far taller than any animal has no lungs, no nose, no breathing organ — yet every living cell inside it still gets the oxygen it needs. According to NCERT, which of these is NOT one of the reasons a plant manages this?",
      options: [
        "Each plant part handles its own gas-exchange needs, so gases barely have to travel from one part to another",
        "Plants respire at rates far lower than animals, so their demand for gas exchange is small",
        "Every living cell sits close to the surface, and loosely-packed parenchyma leaves an interconnected network of air spaces",
        "A plant pumps oxygen from its roots up to its leaves through the xylem, the way blood carries oxygen in animals",
      ],
      reveal: "Option 4 is the one NCERT never says — in fact it's the opposite of the truth. There is very little transport of gases from one plant part to another; plants do not pump oxygen around a central circulation the way animals do. The real three reasons are the other options: each part meets its own needs, plants demand little gas exchange, and short diffusion distances plus loose parenchyma packing keep every living cell near air. Option 4 sneaks in an animal-style transport system that plants simply don't use.",
      difficulty_level: 2,
    },
    // ── 10 · Remember callout ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Cellular respiration** = breaking the **C–C bonds of complex compounds through oxidation** inside the cell, releasing energy.\n- The compound oxidised = the **respiratory substrate** (usually a carbohydrate; sometimes proteins, fats or organic acids).\n- Energy is released in **slow, step-wise, enzyme-controlled** reactions and trapped as **ATP** — the **energy currency of the cell**.\n- Plants breathe through **stomata and lenticels** — they have **no specialised respiratory organs**.\n- Complete combustion of glucose: **C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy** (mostly heat).\n- **Glycolysis** = breakdown of **glucose → pyruvic acid without oxygen**; every organism keeps the enzymes for it.",
    },
    // ── 11 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**ATP is the energy currency of the cell — memorise that phrase.** NEET lifts it verbatim, and it hinges on one idea: the energy of oxidation is *not* used directly, it's used to make ATP first.\n\n**Gas exchange = stomata + lenticels, with no specialised organ.** Don't let a distractor hand plants a 'respiratory system' — they don't have one.\n\n**Classic NEET question:** \"The energy currency of the cell is ____.\" → **ATP.** A close second: \"Plants exchange gases through ____.\" → **stomata and lenticels.**",
    },
    // ── 12 · Bridge text ──────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "You now know *why* a cell bothers to break glucose in small steps, and that the very first step needs no oxygen at all. That first step has a name — **glycolysis** — and it's where the story of respiration truly begins. On the next page we'll walk through it, reaction by reaction.",
    },
    // ── 13 · Inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "According to NCERT, cellular respiration is best defined as which of the following?",
          options: [
            "The intake of O₂ and release of CO₂ through the stomata and lenticels of a plant",
            "The breaking of the C–C bonds of complex compounds through oxidation within cells, releasing energy",
            "The trapping of light energy and its storage in the bonds of carbohydrates like glucose",
            "The complete combustion of glucose in a single step to give CO₂, water and heat",
          ],
          correct_index: 1,
          explanation: "NCERT defines respiration precisely as the breaking of C–C bonds of complex compounds through oxidation within the cell, releasing energy. Option 1 describes gas exchange, not respiration itself. Option 3 describes photosynthesis. Option 4 describes plain combustion — which wastes energy as heat and is exactly what the cell avoids by respiring in steps.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Why is ATP called the 'energy currency of the cell'?",
          options: [
            "It stores the maximum possible energy in a single chemical bond",
            "The energy of oxidation is not used directly; it is trapped in ATP, which is then broken down wherever and whenever energy is needed",
            "It is the only respiratory substrate that plants can oxidise for energy",
            "It is produced only in the chloroplast during photosynthesis and spent in the mitochondria",
          ],
          correct_index: 1,
          explanation: "NCERT's logic is that respiration's energy can't be used directly, so it is first trapped as ATP and later broken down at the exact place and time energy is required — that spend-anywhere role is why it's called the energy currency. Option 3 confuses ATP with a respiratory substrate (that's usually glucose). Option 4 mislocates ATP to photosynthesis; the energy-yielding breakdown happens in the cytoplasm and mitochondria.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which pair of structures do plants use for gaseous exchange, given they have no specialised respiratory organs?",
          options: [
            "Xylem and phloem",
            "Chloroplasts and mitochondria",
            "Stomata and lenticels",
            "Guard cells and root hairs",
          ],
          correct_index: 2,
          explanation: "Plants have no specialised respiratory organs; they use stomata (mainly on leaves) and lenticels (openings in woody bark) for gas exchange. Xylem and phloem are transport tissues, not gas-exchange surfaces. Chloroplasts and mitochondria are organelles inside cells. 'Guard cells and root hairs' is a tempting mix-up but not the pair NCERT names here.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Why does the cell break glucose down in several small steps rather than burning it in one step?",
          options: [
            "Because a single-step burn would not produce enough CO₂ and water for the plant",
            "Because oxygen is available only in small amounts, so glucose must be rationed across many steps",
            "Because in a single-step burn most of the energy escapes as heat, whereas small steps let the energy be coupled to ATP synthesis",
            "Because each small step needs a different respiratory substrate — first a carbohydrate, then a protein, then a fat",
          ],
          correct_index: 2,
          explanation: "NCERT states that complete combustion of glucose releases most of its energy as heat, which the cell can't use. By oxidising glucose in several small steps, some steps are just large enough that their released energy can be coupled to ATP synthesis instead of being lost. Option 1 misreads the goal (it's about usable energy, not amounts of CO₂/water). Options 2 and 4 invent constraints — rationed oxygen and a rotation of substrates — that NCERT never describes.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
