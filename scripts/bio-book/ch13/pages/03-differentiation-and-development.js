'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'differentiation-and-development',
  title: 'Differentiation, Dedifferentiation & Development',
  subtitle: "A cell can grow up, forget how to divide, then be talked into dividing all over again — and that back-and-forth is exactly what NEET tests. Learn to tell differentiation, dedifferentiation and redifferentiation apart, and see how they add up to a plant's whole life story.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['plant-growth-and-development', 'differentiation'],
  glossary: [
    { term: 'differentiation', definition: 'The process in which cells derived from the root apical, shoot apical, and cambium meristems mature to perform specific functions, undergoing structural changes in their cell walls and protoplasm.' },
    { term: 'tracheary element', definition: 'A water-conducting cell that, during differentiation, loses its protoplasm and develops strong, elastic, lignocellulosic secondary walls so it can carry water over long distances even under extreme tension.' },
    { term: 'dedifferentiation', definition: 'The phenomenon in which living, differentiated cells that had lost the capacity to divide regain that capacity under certain conditions — for example, the interfascicular cambium and cork cambium formed from fully differentiated parenchyma cells.' },
    { term: 'redifferentiation', definition: 'The process in which cells produced by a dedifferentiated meristem again lose the capacity to divide but mature to perform specific functions.' },
    { term: 'development', definition: 'All the changes an organism goes through during its life cycle, from germination of the seed to senescence; broadly, development = growth + differentiation.' },
    { term: 'plasticity', definition: 'The ability of plants to follow different pathways, forming different kinds of structures, in response to their environment or their phase of life.' },
    { term: 'heterophylly', definition: 'The occurrence of different leaf shapes on the same kind of plant — for example juvenile versus mature leaves in cotton, coriander and larkspur, or leaves formed in air versus water in buttercup. It is an example of plasticity.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A cutaway of a woody plant stem at night, soft rings of living and woody tissue glowing faintly against deep darkness',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A softly lit cross-section of a woody plant stem sits in an otherwise dark frame, its concentric rings of tissue suggested as faint glowing bands — an inner core, a thin bright living ring, and a rough outer bark layer — without any labels or text. Warm, gentle highlights pick out the boundary where new living tissue meets older woody tissue, hinting at cells maturing outward. Deep shadow fills the rest of the composition. Painterly, atmospheric botanical illustration, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram callouts, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Cell That Died So It Could Do Its Job',
      markdown: "The tubes that carry water from a plant's roots all the way up to its tallest leaf are made of cells that are **completely dead** — no living contents inside them at all. To become a water pipe, the cell first threw away its own protoplasm and hardened its walls into a strong, stiff tube. That's not damage — it's the whole point. A cell **maturing into exactly what the plant needs** is called **differentiation**, and it's where this page begins.",
    },
    // ── 2 · Core concept — differentiation ────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Every new cell in a plant is born in a **meristem** — the root apical meristem, the shoot apical meristem, or the cambium. But a freshly made meristematic cell is a blank worker. It hasn't taken up a job yet. The cells derived from these meristems then **mature to perform specific functions**, and this act of maturing is called **differentiation**.\n\nDuring differentiation a cell doesn't just change its behaviour — it **rebuilds itself physically**. Cells undergo changes, from minor to major, in both their **cell walls** and their **protoplasm**. The clearest example is the making of a **tracheary element** (a water-conducting cell). To become one, the cell **loses its protoplasm** entirely, and develops a very strong, elastic, **lignocellulosic secondary cell wall**. That tough wall is what lets these cells carry water over long distances even under **extreme tension**, without collapsing.",
    },
    // ── 3 · Heading — de- and re-differentiation ──────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Losing, Regaining, and Losing Again the Power to Divide',
      objective: "By the end of this you can trace a parenchyma cell as it dedifferentiates into a meristem and then redifferentiates into mature tissue, and name the NCERT example for each step.",
    },
    // ── 4 · Text — dedifferentiation + redifferentiation ──────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Once a cell has differentiated and matured, it normally **stops dividing** — it has settled into its job. But plants can do something surprising. A living, differentiated cell that had **lost the capacity to divide can regain that capacity** under certain conditions. This regaining of the power to divide is called **dedifferentiation**.\n\nThe NCERT example to lock in: fully differentiated **parenchyma cells** dedifferentiate to form the meristems **interfascicular cambium** and **cork cambium**. A settled parenchyma cell becomes a dividing meristem again.\n\nThese newly formed meristems don't divide forever. They produce cells that **once again lose the capacity to divide but mature to perform specific functions** — this is called **redifferentiation**. So it's a full loop: a meristem cell differentiates into settled parenchyma → that parenchyma dedifferentiates back into a cork-cambium meristem → the cork cambium's products redifferentiate into mature tissue.",
    },
    // ── 5 · Interactive image — the three-step cycle ──────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A three-stage cycle showing a differentiated parenchyma cell dedifferentiating into a dividing cork-cambium meristem, whose products redifferentiate into mature cork tissue',
      caption: '📸 Tap each dot to follow one cell around the differentiation → dedifferentiation → redifferentiation loop.',
      generation_prompt: "Scientific textbook illustration of the differentiation, dedifferentiation and redifferentiation cycle in a plant. Flat 2D educational diagram on a dark background (#0a0a0a near-black), arranged left to right with curved arrows connecting three stages. Stage 1 on the left: a single mature, settled parenchyma cell drawn as a large rounded cell with a thin green wall and visible living contents (labelled area for 'differentiated parenchyma cell'). Curved arrow to Stage 2 in the centre: a band of small, brick-like, actively dividing meristematic cells (cork cambium) with dashed division lines between them, in a brighter green to signal 'living and dividing'. Curved arrow to Stage 3 on the right: a stack of mature, thick-walled brown/tan cork cells with no living contents, signalling dead protective tissue. Clean white outlines, biologically accurate proportions, functional colours (green = living, brown/tan = dead/woody). Labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.16, y: 0.5, label: 'Differentiated parenchyma cell', detail: "A cell that has already matured into a settled parenchyma cell — it does a specific job and has **lost the capacity to divide**. This is the starting point of the loop.", icon: 'circle' },
        { id: uuid(), x: 0.38, y: 0.35, label: 'Dedifferentiation', detail: "Under certain conditions this living, differentiated cell **regains the capacity to divide**. That regaining of division power is dedifferentiation.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.5, label: 'New meristem (cork cambium)', detail: "The dedifferentiated cell forms a meristem such as the **cork cambium** or **interfascicular cambium** — a band of cells that can divide again.", icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.35, label: 'Redifferentiation', detail: "The meristem's daughter cells **again lose the capacity to divide** and mature to perform specific functions. This second maturing is redifferentiation.", icon: 'circle' },
        { id: uuid(), x: 0.86, y: 0.5, label: 'Mature cork tissue', detail: "The end product — mature, thick-walled cork cells that protect the plant. In a woody dicot, tissues like this are the products of redifferentiation.", icon: 'circle' },
      ],
    },
    // ── 6 · Comparison card — the 3-way distinction ───────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 6,
      title: 'Differentiation vs Dedifferentiation vs Redifferentiation',
      columns: [
        { heading: 'Differentiation', points: [
          'A meristem-derived cell **matures to perform a specific function**.',
          'The cell changes structurally in its **cell walls and protoplasm**.',
          'Direction: dividing cell → settled, non-dividing mature cell.',
          'NCERT example: a cell becoming a **tracheary element** — losing its protoplasm and building a lignocellulosic secondary wall.',
        ] },
        { heading: 'Dedifferentiation', points: [
          'A living, **already differentiated** cell **regains the capacity to divide**.',
          'Direction: settled mature cell → dividing meristem again.',
          'NCERT example: **interfascicular cambium** and **cork cambium** forming from fully differentiated **parenchyma cells**.',
        ] },
        { heading: 'Redifferentiation', points: [
          'The cells made by a dedifferentiated meristem **again lose the capacity to divide** and mature for a specific function.',
          'Direction: dividing meristem → settled mature cell (a second time).',
          'NCERT example: the mature tissues of a **woody dicot** produced by the cork cambium / interfascicular cambium.',
        ] },
      ],
    },
    // ── 7 · Heading — development & plasticity ────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Development — The Whole Life Story of a Plant',
      objective: "By the end of this you can define development as growth + differentiation, explain plasticity using heterophylly, and separate the intrinsic from the extrinsic factors that control it.",
    },
    // ── 8 · Text — development, plasticity, heterophylly, factors ─────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Zoom all the way out from a single cell to the entire plant, and you get **development**: all the changes an organism goes through during its life cycle, **from germination of the seed to senescence** (ageing and death). The two forces you've been studying combine to make it happen — broadly, **development = growth + differentiation**. Growth adds material and size; differentiation shapes that material into working parts. Both together carry the plant through its whole life.\n\nPlants also show **plasticity**: they can follow **different pathways** to form **different kinds of structures** depending on their environment or their phase of life. The NCERT example is **heterophylly** — different leaf shapes on the same kind of plant. In **cotton, coriander and larkspur**, the leaves of the **juvenile** plant are a different shape from those on the **mature** plant. In **buttercup**, the leaves made **in air** differ in shape from those made **in water**. Heterophylly like this is an example of plasticity.\n\nWhat controls all of this? Development is under the control of two sets of factors:\n- **Intrinsic factors** — from inside the plant. These are **intracellular (genetic)** factors and **intercellular** factors (chemicals such as **plant growth regulators**).\n- **Extrinsic factors** — from outside the plant: **light, temperature, water, oxygen, nutrition**, and so on.",
    },
    // ── 9 · Reasoning prompt — classify the example ───────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "In a woody dicot stem, fully differentiated parenchyma cells begin dividing again and form the cork cambium. Which term names exactly this event — parenchyma cells getting their power to divide back?",
      options: [
        'Differentiation',
        'Dedifferentiation',
        'Redifferentiation',
        'Plasticity',
      ],
      reveal: "The answer is **dedifferentiation**. The defining move here is a **living, already differentiated** cell (parenchyma) **regaining the capacity to divide** — that is precisely NCERT's definition of dedifferentiation, and cork cambium from parenchyma is its textbook example. The tempting wrong pick is **redifferentiation**: but that word applies to the *next* step, when the cork cambium's daughter cells lose the power to divide again and mature into cork. Differentiation is the opposite direction (a dividing cell maturing and settling down), and plasticity is about forming different structures in response to environment or life phase (as in heterophylly), not about regaining division.",
      difficulty_level: 2,
    },
    // ── 10 · Remember callout ─────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Development = growth + differentiation.** This is the one-line equation NCERT gives — memorise it.\n- **Differentiation:** meristem-derived cells **mature to perform specific functions**. Tracheary element example → cell loses protoplasm + builds a **lignocellulosic secondary wall**.\n- **Dedifferentiation:** a differentiated cell **regains the capacity to divide**. Example → **interfascicular cambium** and **cork cambium** from **parenchyma**.\n- **Redifferentiation:** the meristem's products **again lose the capacity to divide** and mature.\n- **Development** spans the whole life cycle: **seed germination → senescence**.\n- **Plasticity** = different pathways → different structures (environment / life phase). Example → **heterophylly** (juvenile vs mature leaves in cotton, coriander, larkspur; air vs water leaves in buttercup).\n- **Control:** **intrinsic** (intracellular genetic + intercellular chemicals = plant growth regulators) + **extrinsic** (light, temperature, water, oxygen, nutrition).",
    },
    // ── 11 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**The three-way trap:** NEET loves to give you an example and ask you to name the process. Fix the direction of each in your head — differentiation *ends* division (cell settles down), dedifferentiation *restores* division (cell wakes back up), redifferentiation *ends* it again (the woken cell's products settle down).\n\n**Development = growth + differentiation** is quoted almost word-for-word — don't drop the word 'differentiation' and just say growth.\n\n**Classic NEET question:** \"Formation of cork cambium (or interfascicular cambium) from fully differentiated parenchyma cells is an example of ___\" → **dedifferentiation**. And its sibling: \"Different leaf shapes in the juvenile versus the mature plant (or in air versus water) is called ___\" → **heterophylly**, which is an example of **plasticity**.",
    },
    // ── 12 · Bridge text ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "You now have the full cell story — a cell matures (differentiation), can be woken up to divide again (dedifferentiation), settles once more (redifferentiation), and all of it adds up to the plant's development, steered by factors inside and outside. One of those intrinsic factors got a passing mention just now: the **plant growth regulators**. Those chemical messengers — the auxins, gibberellins, cytokinins and the rest — are the subject of the next page.",
    },
    // ── 13 · Inline quiz (LAST) ───────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "During the differentiation of a cell into a tracheary element, what happens to the cell?",
          options: [
            "It keeps its protoplasm but stops taking in water, and its walls stay thin and flexible",
            "It loses its protoplasm and develops a strong, elastic, lignocellulosic secondary cell wall",
            "It regains the capacity to divide and forms a new cork cambium",
            "It stores starch in its protoplasm and its wall becomes soft and permeable",
          ],
          correct_index: 1,
          explanation: "NCERT is specific: to form a tracheary element the cell loses its protoplasm and builds a strong, elastic, lignocellulosic secondary wall so it can carry water under extreme tension. Option 1 gets it backwards (the protoplasm goes, and the wall becomes strong, not flexible). Option 3 describes dedifferentiation, a different process. Option 4 invents storage and softening that NCERT never mentions for a tracheary element.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "The interfascicular cambium and cork cambium arise from fully differentiated parenchyma cells that start dividing again. This is an example of:",
          options: [
            "Differentiation",
            "Redifferentiation",
            "Dedifferentiation",
            "Senescence",
          ],
          correct_index: 2,
          explanation: "A living, already differentiated cell regaining the capacity to divide is dedifferentiation, and cork cambium / interfascicular cambium from parenchyma is NCERT's exact example. Differentiation is the reverse (a cell maturing and losing division). Redifferentiation is the following step, when the new meristem's products lose division again. Senescence is ageing toward death, not a change in division capacity.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "According to NCERT, development in a plant is best described as:",
          options: [
            "Growth alone, measured as an irreversible increase in size",
            "Differentiation alone, as cells mature into specific functions",
            "The sum of growth and differentiation, covering all changes from seed germination to senescence",
            "The regaining and re-losing of the capacity to divide by mature cells",
          ],
          correct_index: 2,
          explanation: "NCERT defines development as all the changes across the life cycle from seed germination to senescence, and states broadly that development = growth + differentiation. Options 1 and 2 each keep only half of that sum. Option 4 describes the dedifferentiation-redifferentiation cycle, which is one part of development, not its definition.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "In cotton, coriander and larkspur the juvenile leaves differ in shape from the mature leaves, and in buttercup the leaves formed in water differ from those formed in air. This phenomenon, an example of plasticity, is called:",
          options: [
            "Heterophylly",
            "Dedifferentiation",
            "Redifferentiation",
            "Senescence",
          ],
          correct_index: 0,
          explanation: "Different leaf shapes on the same kind of plant — juvenile vs mature, or air vs water — is heterophylly, and NCERT gives it as an example of plasticity. Dedifferentiation and redifferentiation are about cells regaining or re-losing the power to divide, not about leaf shape. Senescence is the ageing phase at the end of the life cycle. The named plants (cotton, coriander, larkspur, buttercup) are the NCERT examples of heterophylly.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
