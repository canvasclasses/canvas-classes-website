'use strict';
/**
 * Class 12 Biology — Chapter 1: Sexual Reproduction in Flowering Plants
 * Page 2 — Inside the Anther: the Microsporangium.
 *
 * Source of truth: NCERT Class 12 Ch.1 (lebo101.txt), §1.2.1 "Stamen,
 * Microsporangium and Pollen Grain" — the paragraphs up to the start of
 * microsporogenesis, plus Figs 1.2 and 1.3a/b. Rule 0: every fact here
 * traces to that text; nothing invented. Microsporogenesis itself (meiosis,
 * microspore tetrads, pollen grains) is deliberately left for the next page.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'anther-and-microsporangium',
  title: 'Inside the Anther — the Microsporangium',
  subtitle: "A stamen is just a stalk and a knob — but slice that knob open and you find four tiny pollen factories, each wrapped in four wall layers. Here's what each layer does, and why one of them feeds the pollen.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['androecium', 'stamen', 'anther', 'microsporangium', 'tapetum', 'sexual-reproduction-in-flowering-plants'],
  glossary: [
    { term: 'dithecous', definition: 'Describes a typical angiosperm anther that is bilobed, with each lobe carrying two theca (pollen chambers) — so the anther has two theca per lobe.' },
    { term: 'microsporangium', definition: 'One of the four pollen-producing chambers of an anther, sitting at the corners of the four-sided anther. Each later matures into a pollen sac.' },
    { term: 'endothecium', definition: 'The wall layer just inside the epidermis of a microsporangium — one of the outer three protective layers that also help the anther split open (dehisce).' },
    { term: 'tapetum', definition: 'The innermost wall layer of a microsporangium. It nourishes the developing pollen grains; its cells have dense cytoplasm and often more than one nucleus.' },
    { term: 'sporogenous tissue', definition: 'The compact mass of homogenous cells at the centre of a young microsporangium; each of its cells can later give rise to pollen.' },
    { term: 'dehiscence', definition: 'The splitting open of a mature anther that releases the pollen grains to the outside.' },
  ],
  blocks: [
    {
      id: 'b1f4c9a2-6e73-4d81-9a2c-5f0e7b3d84a1',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A dusk close-up of an open flower with slender stamens rising against a dark, warm-lit background',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). An extreme close-up of a single flower at dusk, filling the frame — a cluster of slender stamens rising from the centre, each a fine filament topped by a plump, softly lit anther. Faint golden pollen dust hangs in the still air around the anther tips, catching the last low warm light. Deep dusk lighting, painterly and atmospheric, dark background tones overall (#0a0a0a base), naturalistic, shallow depth of field so the anthers are the focus, no text, no labels, no diagram elements.",
    },
    {
      id: 'c2a7e138-4b90-4f26-8d15-6a9c1e4f70b3',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'The Yellow Dust On Your Fingers',
      markdown: "Brush your finger against the middle of an open hibiscus flower and it comes away dusted with fine yellow powder. That powder is thousands of **pollen grains** — and every one of them was built, packed, and fed inside a chamber smaller than a grain of rice. A single anther holds **four** of these chambers, and this page is a slice straight through one of them to see how it's put together.",
    },
    {
      id: 'd3b8f249-5c01-4a37-9e26-7b0d2f581c04',
      type: 'text',
      order: 2,
      markdown: "The male part of a flower, the **androecium**, is a whorl of **stamens**. Take one stamen and it has just two parts. There's a long, slender stalk called the **filament**, and at its tip sits a generally bilobed knob called the **anther** — this is the part that actually makes pollen. The bottom (proximal) end of the filament attaches to the **thalamus** or to a petal of the flower.\n\nStamens vary a lot between species — if you collected one stamen each from ten different flowers and laid them side by side, you'd see a wide range in size, shape, and how the anther is attached. But the internal build of the anther is remarkably consistent, and that's what's worth learning once and for all.",
    },
    {
      id: 'e4c9a350-6d12-4b48-8f37-8c1e3a692d15',
      type: 'heading',
      order: 3,
      level: 2,
      text: 'The Anther — Bilobed, Dithecous, Four-Sided',
      objective: "By the end of this you can explain why one anther holds exactly four microsporangia, and where they sit.",
    },
    {
      id: 'f5d0b461-7e23-4c59-9a48-9d2f4b703e26',
      type: 'text',
      order: 4,
      markdown: "A typical angiosperm anther is **bilobed** — it has two lobes. Each lobe carries **two theca** (pollen chambers), so we call the anther **dithecous**. A lengthwise groove often runs down the anther, separating the two theca.\n\nNow cut the anther across — take a transverse section — and its structure snaps into focus. In cross-section the anther is a **four-sided (tetragonal) structure**. At its four corners sit four **microsporangia** — two microsporangia in each lobe. Each microsporangium is a pollen-producing chamber. As the anther grows, these microsporangia develop further and become the **pollen sacs**: they run the full length of the anther and get packed with pollen grains. So the plan is simple to hold in your head — one anther, two lobes, four microsporangia at the corners, all four eventually stuffed with pollen.",
    },
    {
      id: 'a6e1c572-8f34-4d60-9b59-0e3a5c814f37',
      type: 'heading',
      order: 5,
      level: 2,
      text: 'A Slice Through One Microsporangium — Four Wall Layers',
      objective: "By the end of this you can name the four wall layers in order and say exactly what each one does.",
    },
    {
      id: 'b7f2d683-9045-4e71-8c60-1f4b6d925a48',
      type: 'text',
      order: 6,
      markdown: "Zoom in on just one of those four microsporangia in transverse section. Its outline is **near-circular**, and it's wrapped in **four wall layers**. From the outside working in, they are the **epidermis**, the **endothecium**, the **middle layers**, and — innermost of all — the **tapetum**.\n\nThe jobs split neatly. The **outer three layers** (epidermis, endothecium, and middle layers) handle **protection**, and they help the anther **split open (dehisce)** at the right time to release the pollen. The innermost layer, the **tapetum**, has a completely different job: it **nourishes the developing pollen grains**. Fittingly, tapetal cells are packed with **dense cytoplasm** and generally carry **more than one nucleus** — the signature of a cell working hard to feed something.\n\nAnd right in the middle of a young microsporangium, wrapped by all four layers, is a compact mass of homogenous cells called the **sporogenous tissue**. This is the raw material — each of these central cells will eventually give rise to pollen.",
    },
    {
      id: 'c8a3e794-0156-4f82-9d71-2a5c7e036b59',
      type: 'interactive_image',
      order: 7,
      src: '',
      alt: 'Transverse section of one near-circular microsporangium showing four concentric wall layers around central sporogenous tissue',
      caption: '📸 Tap each dot to explore the four wall layers and the tissue at the centre',
      generation_prompt: "Scientific textbook illustration of a transverse section of a single anther microsporangium (matching NCERT Fig 1.3b, enlarged view of one microsporangium). Flat 2D educational diagram on a dark background (#0a0a0a near-black). A near-circular chamber shown with four concentric wall layers rendered as clean white-outlined rings, from the outermost inward: a thin outer epidermis ring, a slightly thicker endothecium ring inside it, one or two thin middle-layer rings, and an innermost tapetum ring drawn as a distinct band of cells with dense stippled cytoplasm and small paired dots suggesting more than one nucleus per cell. The large central space is filled with a compact cluster of rounded homogenous cells (the sporogenous tissue), each cell outlined in white with a small central nucleus. At the base of the circular section, a small wedge of connective tissue containing a tiny vascular strand attaches the microsporangium to the rest of the anther. Functional colours: soft pink/magenta tint for the living cell tissue, faint brown for the outer protective wall. No text or labels baked into the image, no photorealism, no cartoon, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: 'aa01b2c3-1147-4d58-9e60-3b7c8d914e01', x: 0.5, y: 0.07, label: 'Epidermis', detail: 'The outermost wall layer. One of the **outer three** layers whose job is **protection** and helping the anther split open to release pollen.', icon: 'circle' },
        { id: 'aa02b2c3-2247-4d58-9e60-3b7c8d914e02', x: 0.5, y: 0.19, label: 'Endothecium', detail: 'The wall layer just inside the epidermis. Also one of the **outer three protective layers** — it helps the mature anther **dehisce** (split open). Do not confuse its role with the tapetum.', icon: 'circle' },
        { id: 'aa03b2c3-3347-4d58-9e60-3b7c8d914e03', x: 0.5, y: 0.29, label: 'Middle layers', detail: 'One to a few thin layers inside the endothecium. The **third** of the outer three protective layers — protection and dehiscence, not nutrition.', icon: 'circle' },
        { id: 'aa04b2c3-4447-4d58-9e60-3b7c8d914e04', x: 0.5, y: 0.38, label: 'Tapetum', detail: 'The **innermost** wall layer, sitting right against the developing pollen. Its job is to **nourish the developing pollen grains**. Its cells have **dense cytoplasm** and generally **more than one nucleus**.', icon: 'circle' },
        { id: 'aa05b2c3-5547-4d58-9e60-3b7c8d914e05', x: 0.5, y: 0.53, label: 'Sporogenous tissue', detail: 'The compact mass of homogenous cells filling the **centre** of a young microsporangium. Each of these cells can later give rise to pollen (a potential pollen mother cell).', icon: 'circle' },
        { id: 'aa06b2c3-6647-4d58-9e60-3b7c8d914e06', x: 0.5, y: 0.9, label: 'Connective tissue & vascular strand', detail: 'The small wedge of tissue at the base that anchors the microsporangium to the rest of the anther and carries a tiny vascular supply.', icon: 'circle' },
      ],
    },
    {
      id: 'd9b4f8a5-1267-4093-8e82-3b6d8f147c60',
      type: 'reasoning_prompt',
      order: 8,
      reasoning_type: 'logical',
      prompt: "The tapetum is the innermost wall layer — it sits directly against the developing pollen. Its cells are crammed with dense cytoplasm and often carry more than one nucleus. Putting those two clues together, what does this arrangement tell you about the tapetum's main job?",
      options: [
        "It is built for protection and for splitting the anther open — the dense cytoplasm makes the wall physically tougher",
        "It is built to nourish the developing pollen grains — the dense cytoplasm and extra nuclei mean a high metabolic output, delivered from the layer sitting closest to the pollen",
        "It stores the finished pollen grains until the anther is ready to dehisce",
        "It divides by meiosis to produce the microspores by itself",
      ],
      reveal: "The clues point to a feeding role. A cell packed with dense cytoplasm and carrying more than one nucleus is a cell running a high metabolism — it's producing a lot — and the tapetum is placed as the innermost layer, right against the pollen it supplies. That's exactly what nourishing the developing pollen grains needs. Protection and dehiscence are the jobs of the outer three layers (epidermis, endothecium, middle layers), not the tapetum. And the tapetum doesn't make the microspores itself — that's the sporogenous tissue at the centre, which divides by meiosis later.",
      difficulty_level: 2,
    },
    {
      id: 'e0c5a9b6-2378-4104-9f93-4c7e9a258d71',
      type: 'callout',
      order: 9,
      variant: 'remember',
      title: 'The Four Wall Layers, and Who Does What',
      markdown: "- **Four wall layers, outside in:** Epidermis → Endothecium → Middle layers → **Tapetum**.\n- **Outer three (epidermis, endothecium, middle layers):** protection + help the anther **dehisce** to release pollen.\n- **Tapetum (innermost):** **nourishes the developing pollen grains**; dense cytoplasm, often **more than one nucleus**.\n- **Sporogenous tissue:** the compact homogenous cells at the **centre** of a young microsporangium — the future pollen.\n- **Anther plan:** bilobed, **dithecous** (two theca per lobe), tetragonal in section, with **four microsporangia** at the corners (two per lobe).",
    },
    {
      id: 'f1d6b0c7-3489-4215-8a04-5d8f0b369e82',
      type: 'callout',
      order: 10,
      variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Anther in three words NEET reuses verbatim:** a typical anther is **bilobed, dithecous and tetrasporangiate** (four microsporangia). Memorise that exact phrasing.\n\n**The favourite swap trap:** questions flip the jobs of the **endothecium** and the **tapetum**. Fix it once — endothecium is one of the *outer* protective layers that aids dehiscence; the **tapetum** is the *innermost* layer that *nourishes* pollen. Any option that says the tapetum protects the anther, or that the endothecium feeds the pollen, is wrong.\n\n**Innermost = tapetum, every time.** If a question asks for the innermost wall layer of a microsporangium, the answer is the tapetum — and its two giveaway features are dense cytoplasm and being multinucleate.",
    },
    {
      id: 'a2e7c1d8-459a-4326-9b15-6e9a1c470f93',
      type: 'text',
      order: 11,
      markdown: "So a young microsporangium is a wrapped-up chamber: four wall layers on the outside, a feeder layer (the tapetum) on the inside, and a ball of sporogenous tissue in the middle waiting for its cue. That cue is coming next — when those central cells start dividing by meiosis to actually make the pollen, in a process called **microsporogenesis**.",
    },
    {
      id: 'b3f8d2e9-56ab-4437-8c26-7f0b2d581a04',
      type: 'inline_quiz',
      order: 12,
      pass_threshold: 0.67,
      questions: [
        {
          id: 'c4a9e3f0-67bc-4548-9d37-8a1c3e692b15',
          question: 'Which is the innermost of the four wall layers of a microsporangium?',
          options: ['Tapetum', 'Endothecium', 'Epidermis', 'Middle layers'],
          correct_index: 0,
          explanation: "The order from outside in is epidermis → endothecium → middle layers → tapetum, so the tapetum is the innermost layer. Endothecium sits second from the outside (one of the protective layers), the epidermis is the outermost, and the middle layers lie between endothecium and tapetum — none of them is innermost.",
          difficulty_level: 1,
        },
        {
          id: 'd5b0f4a1-78cd-4659-8e48-9b2d4f703c26',
          question: 'How many microsporangia does a typical angiosperm anther have, and how are they arranged?',
          options: [
            'Two microsporangia, one in each lobe',
            'Four microsporangia, sitting at the corners, two in each lobe',
            'Four microsporangia, all packed into a single lobe',
            'Six microsporangia, three in each lobe',
          ],
          correct_index: 1,
          explanation: "The anther is bilobed and, in transverse section, four-sided (tetragonal), with four microsporangia at the four corners — two in each lobe. 'Two, one per lobe' undercounts; the four are split evenly between the two lobes, not crammed into one; and there is no six-microsporangia arrangement.",
          difficulty_level: 2,
        },
        {
          id: 'e6c1a5b2-89de-476a-9f59-0c3e5a814d37',
          question: "A student writes: 'The tapetum protects the anther and helps it split open to release pollen.' What is wrong with this statement?",
          options: [
            'Nothing is wrong — that is exactly the tapetum\'s job',
            'The tapetum does not exist in a typical anther; only three wall layers do',
            'Protection and dehiscence are the jobs of the outer three layers; the tapetum\'s job is to nourish the developing pollen grains',
            'The tapetum only protects the anther but plays no part in dehiscence',
          ],
          correct_index: 2,
          explanation: "Protection and helping the anther dehisce belong to the outer three layers — epidermis, endothecium, and middle layers. The tapetum is the innermost layer and its job is to nourish the developing pollen. A microsporangium has four wall layers, not three, so that option is false too. This endothecium/tapetum role-swap is the classic NEET trap.",
          difficulty_level: 3,
        },
        {
          id: 'f7d2b6c3-90ef-487b-8a04-1d4f6b925e48',
          question: 'In a young anther, what occupies the centre of each microsporangium?',
          options: [
            'Mature pollen grains, ready to be released',
            'The tapetum, with its dense multinucleate cells',
            'Four microspores already arranged as a tetrad',
            'A compact mass of homogenous sporogenous tissue',
          ],
          correct_index: 3,
          explanation: "In a young microsporangium the centre is filled with sporogenous tissue — compact, homogenous cells that will later give rise to pollen. Pollen grains and microspore tetrads only form later, once these cells divide by meiosis during microsporogenesis, and the tapetum is a wall layer lining the chamber, not the tissue at its centre.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
