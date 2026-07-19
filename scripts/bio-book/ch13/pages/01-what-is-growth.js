'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'what-is-growth',
  title: 'What Is Growth?',
  subtitle: "Growth sounds obvious — things get bigger. But NCERT gives it a razor-sharp definition, and understanding why a swelling piece of wood does NOT count is exactly how NEET separates the students who memorised from the ones who understood.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['plant-growth-and-development', 'growth'],
  glossary: [
    { term: 'growth', definition: 'An irreversible permanent increase in size of an organ, its parts, or even a single cell. It is accompanied by metabolic processes (both anabolic and catabolic) that happen at the expense of energy.' },
    { term: 'meristem', definition: "A region of cells in the plant body that can divide and self-perpetuate. Meristems let plants keep growing throughout their life." },
    { term: 'open form of growth', definition: 'Growth in which new cells are always being added to the plant body by the activity of a meristem. It is why plant growth is described as indeterminate.' },
    { term: 'primary growth', definition: 'Growth driven by the root and shoot apical meristems that causes elongation of the plant along its axis.' },
    { term: 'secondary growth', definition: 'Growth driven by the lateral meristems (vascular cambium and cork cambium) that causes an increase in the girth of the plant. Seen in dicots and gymnosperms.' },
    { term: 'protoplasm', definition: 'The living material inside a cell. At the cellular level, growth is principally a consequence of an increase in the amount of protoplasm.' },
    { term: 'plasmodesmata', definition: 'Fine cytoplasmic channels that connect neighbouring cells. Meristematic cells have abundant plasmodesmatal connections.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A young plant seedling pushing up through dark soil, with a suggestion of unfurling leaves reaching toward a faint light',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single young green seedling pushes up through dark, rich soil in the foreground, its tender stem rising and two small leaves just beginning to unfurl toward a faint, soft light in the upper corner. Fine root threads are faintly suggested reaching down into the darkness of the soil below. Deep shadows fill most of the frame, with subtle warm and green highlights only on the seedling itself. Painterly, atmospheric, naturalistic illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'One Root Tip Builds 17,500 Cells Every Hour',
      markdown: "Sit still for one hour. In that same hour, the tip of a single **maize (corn) root** quietly manufactures **more than 17,500 brand-new cells** — building itself deeper into the soil while you did nothing. And a single cell in a **watermelon** can swell up to **3,50,000 times** its original size. Growth in plants runs at a scale that is almost impossible to picture, and it never fully stops as long as the plant is alive.",
    },
    // ── 2 · Core concept — the definition of growth ──────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Ask a beginner what growth is and they'll say \"getting bigger.\" NCERT is far more precise. **Growth is an irreversible permanent increase in size** of an organ, or its parts, or even of a single cell. Read that definition slowly — two words in it are doing all the work: **irreversible** and **permanent**.\n\nGrowth is not free. It is **accompanied by metabolic processes** — both **anabolic** (building up) and **catabolic** (breaking down) reactions — and these happen **at the expense of energy**. The plant spends energy to grow. So when a **leaf expands**, that is genuine growth: it is permanent, it can't be undone, and the plant burned energy to make it happen.\n\nNow the trap. If you drop a **piece of wood into water, it swells up** and gets bigger. Is that growth? No. The moment the wood dries out, it shrinks back — the change is **reversible**, and no energy-driven metabolism built anything new. Getting bigger is not enough. It has to be a permanent, irreversible, energy-costing increase to count as growth.",
    },
    // ── 3 · Heading — indeterminate growth ───────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Why a Plant Can Grow Its Whole Life',
      objective: "By the end of this you can explain what a meristem does, why plant growth is called 'open' and 'indeterminate', and how primary growth differs from secondary growth.",
    },
    // ── 4 · Text — indeterminate, meristems, primary/secondary ───────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "You stop growing taller in your late teens. A tree doesn't. **Plant growth is unique because plants retain the capacity for unlimited growth throughout their life.** This is what \"**indeterminate**\" means — there is no fixed final size the plant is heading toward.\n\nWhat gives plants this power? Special pockets of cells called **meristems**, sitting at certain locations in the plant body. The cells of a meristem can do two things: they **divide**, and they **self-perpetuate** (they keep replacing themselves, so the factory never shuts down). Here's the key detail students miss: the **product cells** that a meristem pushes out **soon lose the capacity to divide**, and those retired cells go on to **make up the actual plant body**. Because new cells are always being added by the meristem's activity, this is called the **open form of growth**.\n\nWhere the meristem sits decides what kind of growth it drives:\n\n- The **root apical meristem** and **shoot apical meristem** are responsible for **primary growth** — they make the plant **elongate** along its axis (get longer/taller).\n- In **dicotyledonous plants and gymnosperms**, the **lateral meristems** — the **vascular cambium** and **cork cambium** — appear later in life and cause an **increase in the girth** (thickness) of the organs. This is **secondary growth**.",
    },
    // ── 5 · Comparison card — primary vs secondary growth ─────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 5,
      title: 'Primary Growth vs Secondary Growth',
      columns: [
        {
          heading: 'Primary Growth',
          points: [
            'Driven by the apical meristems — root apical meristem and shoot apical meristem',
            'Causes elongation of the plant along its axis (makes it longer / taller)',
            'Happens in all plants',
          ],
        },
        {
          heading: 'Secondary Growth',
          points: [
            'Driven by the lateral meristems — vascular cambium and cork cambium',
            'Causes an increase in girth (thickness) of the organs',
            'Seen in dicotyledonous plants and gymnosperms; appears later in life',
          ],
        },
      ],
    },
    // ── 6 · Heading — measuring growth ────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'How Do You Actually Measure Growth?',
      objective: "By the end of this you can say what growth is at the cellular level and list the parameters used to measure it indirectly.",
    },
    // ── 7 · Text — measuring growth ───────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Zoom all the way in. At the cellular level, growth is **principally a consequence of an increase in the amount of protoplasm** — the living material inside the cell. The problem is that **protoplasm is difficult to measure directly**. You can't easily weigh the living stuff inside a cell.\n\nSo biologists measure something that rises roughly *in step* with the protoplasm instead. Growth is measured by a variety of parameters: **increase in fresh weight, dry weight, length, area, volume, and cell number.**\n\nWhich parameter you pick depends on the plant. A **maize root apical meristem** produces **more than 17,500 new cells per hour** — here growth is best expressed as an **increase in cell number**. A **watermelon** cell may **increase in size up to 3,50,000 times** — here growth is expressed as an **increase in the size of the cell**. The **growth of a pollen tube** is measured by its **length**, while growth in a flat **dorsiventral leaf** is measured by its **increase in surface area**.",
    },
    // ── 8 · Heading — the three phases ────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'The Three Phases of Growth in a Root Tip',
      objective: "By the end of this you can name the three phases of growth in order and match each to what its cells look like and do.",
    },
    // ── 9 · Text — three phases ───────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "Look at a **root tip** and you can actually see growth happening in three separate stretches, one after another. The period of growth is divided into **three phases: meristematic, elongation, and maturation.**\n\n**1. Meristematic phase** — right at the very tip. These are the **constantly dividing cells** at the root apex (and the shoot apex). Their cells are **rich in protoplasm**, carry **large, conspicuous nuclei**, and their **cell walls are primary in nature — thin and cellulosic** — with **abundant plasmodesmatal connections** linking neighbours.\n\n**2. Elongation phase** — just behind (proximal to) the meristematic zone. Here the cells stop dividing and start stretching. The features are **increased vacuolation, cell enlargement, and new cell-wall deposition.**\n\n**3. Maturation phase** — further away from the tip, just beyond the elongation zone. Here the cells **attain their maximal size**, with **wall thickening and protoplasmic modifications**. Most of the tissue and cell types you studied in earlier classes belong to this phase.",
    },
    // ── 10 · Interactive image — root tip zones ───────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 10, src: '',
      alt: 'Longitudinal diagram of a root tip showing, from the tip upward, the meristematic zone, the zone of elongation, and the zone of maturation, with the root apical meristem marked at the tip',
      caption: '📸 Tap each dot to explore the three zones of growth in a root tip.',
      generation_prompt: "Scientific textbook illustration of a longitudinal section of a plant root tip showing the three zones of growth arranged from the tip upward. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions. At the very bottom tip, a protective root cap in tan/brown; just above it the meristematic zone drawn as many small, densely packed square cells each with a large conspicuous nucleus, coloured green for living tissue; above that the zone of elongation drawn as taller, stretched rectangular cells with visible large vacuoles; above that the zone of maturation drawn as the widest, fully mature cells with thickened walls and a couple of faint root hairs on the side. Labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.9, label: 'Root apical meristem', detail: "The meristem sitting right at the tip of the root. Its cells divide and self-perpetuate, driving **primary growth** — the elongation of the root along its axis.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.72, label: 'Meristematic zone', detail: "The **constantly dividing cells** at the apex. They are **rich in protoplasm**, have **large conspicuous nuclei**, and **thin, primary, cellulosic walls** with abundant **plasmodesmata**.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.48, label: 'Zone of elongation', detail: "Just behind the meristematic zone. The cells here show **increased vacuolation, cell enlargement, and new cell-wall deposition** — this is where the root physically lengthens.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.22, label: 'Zone of maturation', detail: "Further from the tip, beyond the elongation zone. Cells **attain their maximal size** with **wall thickening and protoplasmic modifications**. Most familiar tissues and cell types belong here.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.97, label: 'Root cap', detail: "The protective covering at the very tip of the root. It shields the delicate dividing cells of the meristematic zone as the root pushes through the soil.", icon: 'circle' },
      ],
    },
    // ── 11 · Table — the three phases ─────────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 11,
      caption: 'The three phases of growth in a root tip, matched to their cells and features',
      headers: ['Phase', 'Where (from the tip)', 'Cells & features'],
      rows: [
        ['Meristematic', 'At the root apex / shoot apex', 'Constantly dividing cells; rich in protoplasm; large conspicuous nuclei; thin primary cellulosic walls; abundant plasmodesmata'],
        ['Elongation', 'Just behind (proximal to) the meristematic zone', 'Increased vacuolation; cell enlargement; new cell-wall deposition'],
        ['Maturation', 'Further away, proximal to the elongation zone', 'Cells attain maximal size; wall thickening; protoplasmic modifications'],
      ],
    },
    // ── 12 · Reasoning prompt — is-it-growth / phase match ────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 12, reasoning_type: 'logical',
      prompt: "A student lists four everyday observations and claims all four are examples of 'growth' by NCERT's definition. Exactly one of them does NOT qualify as growth. Which one?",
      options: [
        "A leaf on a plant expands and gets larger over several days",
        "A dry piece of wood is dropped into water and swells up in size",
        "A maize root tip adds thousands of new cells and pushes deeper into the soil",
        "A watermelon cell increases enormously in size as the fruit develops",
      ],
      reveal: "Option 2 is the one that is NOT growth. NCERT defines growth as an **irreversible, permanent** increase in size that is accompanied by energy-driven metabolism. Wood soaking up water swells, but the moment it dries it shrinks straight back — the change is **reversible** and no metabolism built anything, so it fails the definition. The other three are all genuine growth: the expanding leaf, the maize root adding cells (growth as increase in cell number), and the watermelon cell enlarging (growth as increase in cell size) are all permanent, irreversible, energy-costing increases.",
      difficulty_level: 2,
    },
    // ── 13 · Remember callout ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Growth** = an **irreversible permanent increase in size** of an organ, its parts, or a single cell — accompanied by anabolic + catabolic metabolism, **at the expense of energy**. Expanding leaf = growth; wood swelling in water = **not** growth (reversible).\n- Plant growth is **indeterminate** (unlimited, lifelong) because of **meristems** whose cells divide and self-perpetuate. New cells are always added → the **open form of growth**.\n- **Primary growth** = apical meristems (root + shoot apical) → **elongation**. **Secondary growth** = lateral meristems (**vascular cambium + cork cambium**) → **increase in girth**; only in dicots and gymnosperms.\n- Growth at the cellular level = increase in **protoplasm**; measured indirectly via **fresh weight, dry weight, length, area, volume, cell number**.\n- **Three phases in order: meristematic → elongation → maturation.**",
    },
    // ── 14 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Increase in girth is due to lateral meristems (vascular cambium + cork cambium):** memorise that apical = elongation (primary) and lateral = girth (secondary). NEET routinely swaps these two to catch you.\n\n**The definition is quoted verbatim:** \"growth is an irreversible permanent increase in size.\" The word NEET loves to test is **irreversible** — which is exactly why the swelling-wood-in-water example (a reversible change) is the classic \"which of these is NOT growth\" option.\n\n**Classic NEET question:** \"The zone of a root tip that contains constantly dividing cells with large nuclei and thin primary walls is the ___ phase.\" → **meristematic**. And: \"Secondary growth (increase in girth) is brought about by ___ meristems.\" → **lateral** (vascular cambium and cork cambium).",
    },
    // ── 15 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 15,
      markdown: "You now know what qualifies as growth, why plants can grow forever, how growth is measured, and the three phases a root tip passes through. Next, you'll see how fast growth actually happens — the growth rates and the outside conditions a plant needs to grow at all.",
    },
    // ── 16 · Inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 16, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "According to NCERT, which statement correctly defines growth?",
          options: [
            "Any increase in the size of an organ, whether temporary or permanent",
            "An irreversible permanent increase in size of an organ, its parts, or even a single cell",
            "A reversible increase in the water content of a plant's tissues",
            "An increase in size that happens without using any metabolic energy",
          ],
          correct_index: 1,
          explanation: "NCERT's definition has two load-bearing words: growth is an *irreversible* and *permanent* increase in size, accompanied by energy-driven metabolism. Option 1 misses 'irreversible/permanent', option 3 describes swelling wood (reversible, not growth), and option 4 contradicts NCERT — growth happens at the expense of energy, not without it.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Plant growth is described as 'indeterminate'. What is the direct reason?",
          options: [
            "Plants keep absorbing water throughout their life, which keeps swelling their cells",
            "Plants have meristems whose cells can divide and self-perpetuate, so growth can continue throughout life",
            "Plant cells never lose the capacity to divide once they are formed",
            "Plants only grow during a fixed determinate window and then stop permanently",
          ],
          correct_index: 1,
          explanation: "Indeterminate (unlimited, lifelong) growth comes from meristems — regions whose cells divide and self-perpetuate. Option 3 is the exact opposite of what NCERT says: the product cells soon LOSE the capacity to divide and go on to form the plant body. Option 1 describes reversible swelling, not growth, and option 4 contradicts 'indeterminate' altogether.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "The vascular cambium and cork cambium are responsible for which type of growth?",
          options: [
            "Primary growth, causing elongation of the plant along its axis",
            "Growth of the pollen tube, measured by its length",
            "Secondary growth, causing an increase in the girth of the organs",
            "The meristematic phase at the root apex",
          ],
          correct_index: 2,
          explanation: "Vascular cambium and cork cambium are the lateral meristems, and lateral meristems drive secondary growth — the increase in girth, seen in dicots and gymnosperms. Option 1 describes what the apical meristems do (primary growth = elongation), so it's the tempting swap. Options 2 and 4 name unrelated things.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "In a root tip, which sequence correctly lists the phases of growth as you move away from the very tip?",
          options: [
            "Elongation → meristematic → maturation",
            "Maturation → elongation → meristematic",
            "Meristematic → elongation → maturation",
            "Meristematic → maturation → elongation",
          ],
          correct_index: 2,
          explanation: "Starting at the apex, the constantly dividing cells form the meristematic phase; just proximal to them is the zone of elongation (increased vacuolation, cell enlargement, new wall deposition); further away is the maturation zone (maximal size, wall thickening). So the order is meristematic → elongation → maturation. The other options scramble this fixed sequence.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
