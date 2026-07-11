'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'four-classes-of-fungi',
  title: 'Kingdom Fungi II: The Four Classes',
  subtitle: "Fungi split into four classes on three simple clues — the thread, the spore, and the fruiting body. Learn those, and you can name any of them.",
  page_number: 7,
  page_type: 'lesson',
  tags: ['kingdom-fungi', 'phycomycetes', 'ascomycetes', 'basidiomycetes', 'deuteromycetes', 'biological-classification'],
  glossary: [
    { term: 'coenocytic', definition: 'An aseptate mycelium — one long tube of cytoplasm with many nuclei and no cross-walls dividing it into separate cells. This is the phycomycete pattern.' },
    { term: 'septate', definition: 'A mycelium divided into separate cells by cross-walls called septa. Ascomycetes, basidiomycetes and deuteromycetes all have septate mycelia.' },
    { term: 'conidia', definition: 'The asexual spores of ascomycetes and deuteromycetes, produced exogenously (on the outside) at the tips of a special mycelium called conidiophores.' },
    { term: 'ascus', definition: 'A sac-like structure of ascomycetes inside which the sexual spores (ascospores) are produced endogenously. Plural: asci.' },
    { term: 'ascocarp', definition: 'The fruiting body of an ascomycete, in which the many asci are arranged.' },
    { term: 'basidium', definition: 'The structure of basidiomycetes in which karyogamy and meiosis take place, producing four basidiospores on its outer surface. Plural: basidia.' },
    { term: 'basidiocarp', definition: 'The fruiting body of a basidiomycete, in which the basidia are arranged — the mushroom you can see and eat is one.' },
    { term: 'zygospore', definition: 'The resting spore of phycomycetes, formed by the fusion of two gametes.' },
    { term: 'coprophilous', definition: 'Growing on dung — one of the habits of some ascomycetes.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dark forest floor at dusk showing a fuzzy grey bread mould, a green-dusted mould colony, a cluster of pale mushrooms and a rust-spotted leaf, each in its own pool of soft light',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single dark dusk composition on a damp forest floor showing four very different fungi spaced across the frame, each lit by its own quiet pool of warm light against one shared naturalistic dark background: on the far left, a fuzzy grey-white cottony bread mould creeping over a piece of damp wood; then a small colony of powdery blue-green mould dusting a fallen fruit; in the centre, a cluster of pale domed mushrooms rising from a dark log; and on the far right, a leaf blotched with orange-brown rust spots. The four subjects deliberately look like they belong to no single shape — some fuzzy, some powdery, one clearly a mushroom, one a diseased leaf. Deep dusk lighting, painterly and atmospheric, dark background overall (#0a0a0a base tones), no text, no labels, no diagram elements, no boxes or dividers.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Mushroom on Your Plate Is a Fruiting Body',
      markdown: "The button mushroom you slice into a curry is **Agaricus** — and the whole cap-and-stalk thing you eat is not the fungus itself. It's the fungus's **fruiting body**, called a **basidiocarp**, the part it pushes up above the soil to release spores. The actual fungus is a hidden web of threads spread through the soil and rotting wood below. That single fact — that a mushroom is a fruiting body sitting on top of a thread network — is your first clue to how this whole page sorts fungi into four classes.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Kingdom Fungi is huge and varied, so biologists needed a fair way to split it into groups. They don't go by where a fungus lives or what it eats — those vary too much. Instead the kingdom is divided into classes on **three structural clues**:\n\n- the **morphology of the mycelium** — is the thread-network divided into cells by cross-walls (**septate**) or is it one continuous multinucleate tube with no cross-walls (**aseptate, coenocytic**)?\n- the **mode of spore formation** — how and where the fungus makes its spores, especially its **sexual** spores;\n- the **fruiting bodies** — the structures that hold and release those spores.\n\nRun every fungus through those three questions and it falls neatly into one of four classes: **Phycomycetes, Ascomycetes, Basidiomycetes and Deuteromycetes**. We'll take them one at a time.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Four Classes, One at a Time',
      objective: 'By the end of this you can name each class by its mycelium, its spores, and one or two example organisms — the exact set NEET tests.',
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Phycomycetes** are the water-lovers of the kingdom. You find them in **aquatic habitats** and on **decaying wood in moist, damp places**, or living as **obligate parasites on plants**. Their mycelium is **aseptate and coenocytic** — one continuous tube with no cross-walls, packed with many nuclei. Asexual reproduction happens through spores made inside a sporangium: **zoospores**, which are **motile** (they can swim), or **aplanospores**, which are **non-motile**. Their sexual spore is a **zygospore**, formed when **two gametes fuse**. Those two gametes may look alike (**isogamous**), or look different (**anisogamous**, or **oogamous**). Common examples are **Mucor**, **Rhizopus** — the familiar **bread mould** — and **Albugo**, the parasitic fungus on mustard.",
    },
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "**Ascomycetes**, the **sac-fungi**, are mostly **multicellular** (like **Penicillium**), though a few are **unicellular** — **yeast (Saccharomyces)** is the famous single-celled one. They live as **saprophytes, decomposers, parasites**, or **coprophilous** forms (growing on dung). Their mycelium is **branched and septate** — divided into cells by cross-walls. Their asexual spores are **conidia**, produced **exogenously** (on the outside) at the tips of a special mycelium called **conidiophores**; each conidium can germinate into a new mycelium. Their sexual spores are **ascospores**, produced **endogenously** (on the inside) within sac-like structures called **asci** (singular **ascus**), and these asci are packed into fruiting bodies called **ascocarps**. Examples include **Aspergillus**, **Claviceps** and **Neurospora** — the last used heavily in biochemical and genetic research. Some members, like **morels and truffles**, are edible delicacies.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A fungus has a mycelium that is one continuous tube with no cross-walls, and it forms its sexual spore by the direct fusion of two gametes. Which class does it belong to?",
      options: [
        'Ascomycetes — the sac-fungi with septate mycelia',
        'Phycomycetes — aseptate, coenocytic mycelium and a zygospore from two fused gametes',
        'Basidiomycetes — septate mycelium that reproduces by fragmentation',
        'Deuteromycetes — septate mycelium known only from its asexual phase',
      ],
      reveal: "The two clues both point to Phycomycetes. 'One continuous tube with no cross-walls' is exactly an **aseptate, coenocytic** mycelium, and a sexual spore made by the **direct fusion of two gametes** is a **zygospore** — both are phycomycete features. Ascomycetes, basidiomycetes and deuteromycetes all have **septate** mycelia (cross-walls present), so the very first clue rules all three of them out before you even look at the spore.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "**Basidiomycetes** are the ones you'd recognise on sight: **mushrooms, bracket fungi and puffballs**. They grow in **soil, on logs and tree stumps**, and inside **living plants as parasites** — the **rusts and smuts** that damage crops are basidiomycetes. Their mycelium is **branched and septate**. Here's the twist: **asexual spores are generally absent**, and instead vegetative reproduction happens by **fragmentation**. **Sex organs are absent** too — so how do they reproduce sexually? Two **vegetative (somatic) cells** of different strains fuse (this fusion is called **plasmogamy**), giving a **dikaryotic** structure that grows into a **basidium**. Inside the basidium, **karyogamy and meiosis** take place and produce **four basidiospores**, which are made **exogenously** on the outside of the basidium (plural: **basidia**). The basidia sit inside fruiting bodies called **basidiocarps**. Common members are **Agaricus** (the mushroom), **Ustilago** (a smut) and **Puccinia** (a rust fungus).",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "**Deuteromycetes** are the odd class out — they're called the **imperfect fungi** because **only their asexual or vegetative phases are known**. Their mycelium is **septate and branched**, and they reproduce **only by asexual spores (conidia)**. The reason they're 'imperfect' is a story about missing information: for a long time nobody had seen these fungi reproduce sexually, so they were parked here. **The moment the sexual (perfect) stage of one is discovered, it gets moved out** — usually into **Ascomycetes** or **Basidiomycetes**, wherever it truly belongs. So this class is really a waiting room. In nature many of them are **decomposers of litter** that **help in mineral cycling**, while others are saprophytes or parasites. Examples are **Alternaria**, **Colletotrichum** and **Trichoderma**.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 9, src: '',
      alt: 'Three fungi side by side — a fuzzy Mucor mould, a powdery Aspergillus mould colony, and a capped Agaricus mushroom',
      caption: '📸 Tap each dot to see the fungus and the class it belongs to',
      generation_prompt: "Scientific textbook illustration of three different fungi shown side by side (mirroring NCERT Figure 2.5). Flat 2D educational diagram on a dark background (#0a0a0a near-black), clean white outlines, biologically accurate proportions, no labels baked in. On the LEFT: Mucor — a fuzzy coenocytic mould shown as fine branching threads rising from a substrate, each thread tipped with a round sporangium (a small ball of spores) at its top, drawn in pale grey-white. In the CENTRE: Aspergillus — a mould whose upright conidiophore ends in a swollen head bearing radiating chains of tiny round conidia, giving a fan or brush-like spray, drawn in muted blue-green. On the RIGHT: Agaricus — a classic capped mushroom in cross-section showing a rounded cap, gills on the underside, and a stalk, drawn in pale tan-brown. The three fungi evenly spaced, each on its own simple dark base line. No photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.17, y: 0.40, label: 'Mucor — Phycomycetes', icon: 'circle',
          detail: 'A phycomycete with an **aseptate, coenocytic** mycelium. Its asexual spores form inside a **sporangium**, and its sexual spore is a **zygospore**. Rhizopus (bread mould) and Albugo belong to the same class.' },
        { id: uuid(), x: 0.5, y: 0.40, label: 'Aspergillus — Ascomycetes', icon: 'circle',
          detail: 'An ascomycete (sac-fungus) with a **branched, septate** mycelium. Its asexual **conidia** form exogenously on **conidiophores**; its sexual **ascospores** form endogenously inside **asci** held in an **ascocarp**. Penicillium and Neurospora share this class.' },
        { id: uuid(), x: 0.83, y: 0.40, label: 'Agaricus — Basidiomycetes', icon: 'circle',
          detail: 'A basidiomycete. The visible mushroom is its fruiting body, a **basidiocarp**. Sexual spores are **basidiospores**, produced exogenously on a **basidium**. Ustilago (smut) and Puccinia (rust) are in the same class.' },
      ],
    },
    {
      id: uuid(), type: 'comparison_card', order: 10, title: 'The Four Classes of Fungi',
      columns: [
        { heading: 'Phycomycetes', points: [
          'Mycelium: aseptate & coenocytic (no cross-walls)',
          'Asexual spore: zoospores (motile) or aplanospores (non-motile), in a sporangium',
          'Sexual spore: zygospore (fusion of two gametes)',
          'Examples: Mucor, Rhizopus',
        ] },
        { heading: 'Ascomycetes', points: [
          'Mycelium: branched & septate',
          'Asexual spore: conidia, produced exogenously on conidiophores',
          'Sexual spore: ascospores, endogenous in asci (held in an ascocarp)',
          'Examples: Aspergillus, Neurospora',
        ] },
        { heading: 'Basidiomycetes', points: [
          'Mycelium: branched & septate',
          'Asexual spore: generally absent (vegetative reproduction by fragmentation)',
          'Sexual spore: basidiospores, exogenous on a basidium (held in a basidiocarp)',
          'Examples: Agaricus, Puccinia',
        ] },
        { heading: 'Deuteromycetes', points: [
          'Mycelium: septate & branched',
          'Asexual spore: conidia',
          'Sexual spore: none known (imperfect fungi)',
          'Examples: Alternaria, Trichoderma',
        ] },
      ],
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember', title: 'Pin the Examples to the Right Class',
      markdown: "Get the example organisms locked to their class — NEET tests this pairing constantly:\n\n- **Phycomycetes:** **Rhizopus** (bread mould), **Mucor**, **Albugo** (on mustard).\n- **Ascomycetes:** **Penicillium**, **yeast (Saccharomyces)**, **Neurospora**, **Aspergillus**, **Claviceps**.\n- **Basidiomycetes:** **Agaricus** (mushroom), **Ustilago** (smut), **Puccinia** (rust).\n- **Deuteromycetes:** **Alternaria**, **Colletotrichum**, **Trichoderma**.\n\nAnd the one-line reason deuteromycetes are called **imperfect fungi**: only their **asexual (or vegetative) phase is known** — the sexual stage hasn't been seen.",
    },
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Match the trio — class ↔ spore ↔ example:** the most common question format hands you an organism or a spore and asks for the class. Zygospore/Rhizopus → Phycomycetes; ascospore/Neurospora → Ascomycetes; basidiospore/Puccinia → Basidiomycetes; conidia-only/Alternaria → Deuteromycetes.\n\n**The endogenous-vs-exogenous trap:** **ascospores** are made **endogenously**, *inside* the sac-like **ascus**; **basidiospores** are made **exogenously**, *on the outside* of the **basidium**. Swapping these two is a favourite NEET distractor.\n\n**The dikaryotic clue points to basidiomycetes:** in basidiomycetes, plasmogamy fuses two somatic cells into a **dikaryotic** structure that becomes the basidium — that's where karyogamy and meiosis give **four basidiospores**.\n\n**Deuteromycetes are a waiting room:** once a member's **sexual (perfect) stage is discovered**, it is **reassigned** to Ascomycetes or Basidiomycetes — so 'imperfect fungi' is about missing information, not a permanent home.\n\n**Classic NEET question:** \"Ascospores are produced ______ while basidiospores are produced ______.\" → endogenously (in asci); exogenously (on basidia).",
    },
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "That completes Kingdom Fungi — four classes, sorted by their mycelium, their spores, and their fruiting bodies. From here the kingdoms get much more familiar: next we climb into the two you already half-know, the green world of **Kingdom Plantae** and the moving world of **Kingdom Animalia**.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'In which class are ascospores produced endogenously inside sac-like asci?',
          options: ['Basidiomycetes', 'Ascomycetes', 'Phycomycetes', 'Deuteromycetes'],
          correct_index: 1,
          explanation: "Ascospores forming endogenously inside asci is the defining sexual feature of Ascomycetes (the sac-fungi). Basidiomycetes make basidiospores exogenously on a basidium; phycomycetes make a zygospore from two fused gametes; deuteromycetes have no known sexual spore at all.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'Puccinia (a rust) and Ustilago (a smut) both belong to which class of fungi?',
          options: ['Phycomycetes', 'Ascomycetes', 'Basidiomycetes', 'Deuteromycetes'],
          correct_index: 2,
          explanation: "Rusts and smuts are basidiomycetes — the same class as the mushroom Agaricus. They are not phycomycetes (that class holds Rhizopus, Mucor, Albugo), not ascomycetes (Aspergillus, Neurospora, Penicillium), and not deuteromycetes (Alternaria, Trichoderma).",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'Why are the deuteromycetes commonly called the imperfect fungi?',
          options: [
            'Their mycelium is aseptate, so it is considered incompletely developed',
            'Only their asexual or vegetative phases are known — their sexual stage has not been observed',
            'They are the only fungi that cannot reproduce at all',
            'They lack a cell wall, unlike every other fungal class',
          ],
          correct_index: 1,
          explanation: "'Imperfect' refers to missing information about reproduction: only the asexual/vegetative phase is known for these fungi. Their mycelium is actually septate and branched (not aseptate), they do reproduce — by asexual conidia — and all fungi, including these, have cell walls.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "A fungus was classified as a deuteromycete. Later, biologists discovered its sexual (perfect) reproductive stage. What happens to its classification?",
          options: [
            'It stays in Deuteromycetes permanently, since that was its first classification',
            'It is moved into Phycomycetes because a sexual stage was found',
            'It is reassigned to the class it truly belongs to — usually Ascomycetes or Basidiomycetes',
            'It is removed from Kingdom Fungi entirely and placed in Protista',
          ],
          correct_index: 2,
          explanation: "Deuteromycetes is effectively a waiting room for fungi whose sexual stage is unknown. Once that stage is discovered, the fungus is moved to its rightful class — most often Ascomycetes or Basidiomycetes. It does not stay put, it is not sent to Phycomycetes by default, and it certainly does not leave the fungi for Protista.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
