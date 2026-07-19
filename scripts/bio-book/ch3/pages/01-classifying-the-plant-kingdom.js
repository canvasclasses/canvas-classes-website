'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'classifying-the-plant-kingdom',
  title: "What's In (and Out of) the Plant Kingdom",
  subtitle: "The plant kingdom shrank — fungi and cell-walled bacteria were shown the door. Here's what Plantae holds now, and the three ways botanists have tried to sort it.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['plant-kingdom', 'classification', 'taxonomy', 'artificial-natural-phylogenetic'],
  glossary: [
    { term: 'artificial system', definition: 'The earliest way of classifying plants, using only a few gross, easily-seen features such as habit, leaf shape and colour, or the structure of the stamens.' },
    { term: 'natural system', definition: 'A classification built on real (natural) affinities between plants, using both external features and internal ones like anatomy, embryology and phytochemistry.' },
    { term: 'phylogenetic', definition: 'A classification based on evolutionary relationships, assuming that organisms of the same taxon share a common ancestor. It is the system accepted today.' },
    { term: 'numerical taxonomy', definition: 'A computer-based method that assigns numbers or codes to every observable character, gives each character equal importance, and can weigh hundreds of characters at once.' },
    { term: 'cytotaxonomy', definition: 'Classification that uses cytological information — chromosome number, structure and behaviour — to resolve confusions.' },
    { term: 'chemotaxonomy', definition: 'Classification that uses the chemical constituents of a plant to settle disputes about where it belongs.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dusk landscape holding only true plants — algae in water, mosses, ferns, a conifer and a flowering tree — with a faint bacterial mat pushed to the shadowed edge',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dusk scene reading as 'who belongs to the plant kingdom now': green filamentous algae drifting in shallow water on the left, rising onto a mossy wet rock, then a fern on a shaded bank, then a tall cone-bearing conifer, and a single softly blooming flowering tree on the right — the five true plant groups, each a quiet silhouette, none dominating. In the deep shadow at the very far edge of the frame, a faint slimy blue-green bacterial mat on a rock is turned away and dimmed, visually pushed out of the bright band of plant life. Deep dusk light, one warm horizon glow behind the flowering tree, dark naturalistic background (#0a0a0a base). Painterly, atmospheric, no text, no labels, no diagram elements.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: "The 'Algae' That Got Kicked Out of the Club",
      markdown: "For a long time, cyanobacteria carried the friendly nickname **'blue-green algae'** — the name is still printed on plenty of old charts. But our idea of the plant kingdom has changed. Fungi, and the cell-walled members of Monera and Protista, have all been **thrown out of Plantae**. Cyanobacteria are bacteria (Monera), so they went out with them. The result: those 'blue-green algae' are **not 'algae' any more** — same organism, same pond, but no longer part of the plant kingdom or the real algae.",
    },
    // ── 2 · Core concept — what Plantae now holds ─────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "In the last chapter you met Whittaker's five kingdoms — Monera, Protista, Fungi, Animalia and **Plantae**. This chapter zooms into that last kingdom, the one everyone calls the **'plant kingdom'**.\n\nHere's the thing to fix in your head before anything else: **the plant kingdom used to be bigger.** Older classifications parked fungi, and the cell-walled members of Monera and Protista, inside Plantae — probably because they had cell walls and looked plant-ish. Those members have now been **excluded**. So today, when we say Plantae, we mean five groups and only these five: **Algae, Bryophytes, Pteridophytes, Gymnosperms and Angiosperms.** The whole chapter is a tour of those five, in that order — a climb from simple water-dwellers up to flowering plants.",
    },
    // ── 3 · Heading — three systems ───────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Three Ways to Classify Plants',
      objective: "By the end of this you can explain why botanists moved from artificial to natural to phylogenetic systems — and what went wrong with each older one.",
    },
    // ── 4 · Text — artificial → natural → phylogenetic ────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Botanists didn't get classification right on the first try. Using flowering plants as the example, you can watch the thinking improve in three stages.\n\n**Artificial systems came first.** The earliest schemes used only **gross, superficial features** — the habit of the plant, its colour, the number and shape of its leaves. Some, like the system given by **Linnaeus**, leaned on the structure of the **androecium** (the stamens). These were called *artificial* because a handful of easy-to-spot features aren't enough — the systems ended up **separating closely related species** that happened to look different. Worse, they gave **equal weight to vegetative characters and sexual (reproductive) characters**. That's a real problem: vegetative characters like leaf shape and colour are **easily changed by the environment**, so leaning on them as heavily as on reproductive parts is not acceptable.\n\n**Natural systems fixed that.** Instead of a few surface looks, they were built on **natural affinities** — the genuine relationships between plants — and considered **both external and internal features**: ultrastructure, anatomy, embryology and phytochemistry. The natural classification for **flowering plants** was given by **George Bentham and Joseph Dalton Hooker**.\n\n**Phylogenetic systems are what we use now.** These sort plants by their **evolutionary relationships**, working from one big assumption: **organisms belonging to the same taxon share a common ancestor.** Where fossil evidence is missing, botanists pull in extra kinds of information to settle the hard cases — which is exactly where the modern tools on the next section come in.",
    },
    // ── 5 · Comparison card ───────────────────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 5,
      title: 'Artificial vs Natural vs Phylogenetic',
      columns: [
        {
          heading: 'Artificial',
          points: [
            'Basis: a few gross, superficial features seen at a glance',
            'Characters used: habit, colour, number and shape of leaves; the androecium (stamens)',
            'Given by: Linnaeus used the androecium',
            'Flaw: gives vegetative and sexual characters equal weight, so it splits closely related species',
          ],
        },
        {
          heading: 'Natural',
          points: [
            'Basis: natural affinities — the real relationships between plants',
            'Characters used: external AND internal — ultrastructure, anatomy, embryology, phytochemistry',
            'Given by: George Bentham & Joseph Dalton Hooker (for flowering plants)',
            'Better because: many features, inside and out, not just surface looks',
          ],
        },
        {
          heading: 'Phylogenetic',
          points: [
            'Basis: evolutionary relationships between organisms',
            'Assumes: organisms of the same taxon share a common ancestor',
            'Extra data: many other sources, especially when fossil evidence is missing',
            'Status: the system accepted today',
          ],
        },
      ],
    },
    // ── 6 · Reasoning prompt (mid-page) ───────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "Artificial systems gave vegetative characters — things like leaf shape and colour — the same weight as sexual (reproductive) characters. NCERT calls this unacceptable. What's the actual problem with weighting them equally?",
      options: [
        "Vegetative characters like leaf shape and colour are easily changed by the environment, so leaning on them as heavily as reproductive parts can split truly related plants and lump unrelated ones together",
        "Vegetative characters can only be seen under a microscope, so any system that uses them is bound to be unreliable",
        "Sexual characters vary far more with the environment than vegetative ones, so vegetative characters actually deserve more weight, not equal weight",
        "Vegetative and sexual characters belong to completely different plants, so a single system can't compare them at all",
      ],
      reveal: "The first option is right. NCERT's exact objection is that vegetative characters are more easily affected by the environment — a plant grown in shade or poor soil can change its leaf size, shape and colour without being a different species at all. So if you trust those changeable features as much as the stable reproductive ones, you'll wrongly separate close relatives and group distant ones. The 'microscope' claim is invented — vegetative features are the easy-to-see ones. The third option reverses the fact: it's the vegetative, not the sexual, characters that the environment sways. And vegetative and sexual characters are simply two feature sets of the *same* plant, so the last option is false.",
      difficulty_level: 2,
    },
    // ── 7 · Heading — modern tools ────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Modern Tools: Numerical, Cyto- & Chemo-taxonomy',
      objective: "By the end of this you can match a described method — computers, chromosomes, or chemicals — to its name in one read.",
    },
    // ── 8 · Text — the three modern tools ─────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "When fossils run out and the older features aren't enough to settle an argument, taxonomists reach for three extra tools. Keep them apart by the *kind of information* each one uses.\n\n**Numerical Taxonomy** is the computer's job. Every observable character is given a **number or code**, and the data are processed by computer. The clever part is fairness: **each character is given equal importance**, and because a machine is doing the counting, **hundreds of characters** can be weighed at the same time — far more than any human sorting by eye.\n\n**Cytotaxonomy** uses **cytological information** — that is, information from inside the cell about the **chromosomes**: their number, their structure, and their behaviour.\n\n**Chemotaxonomy** uses the **chemical constituents** of the plant — its actual chemistry — to resolve confusions about where it belongs.",
    },
    // ── 9 · Remember callout ──────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Plantae now = Algae, Bryophytes, Pteridophytes, Gymnosperms, Angiosperms.** Fungi and cell-walled Monera/Protista are *out*; cyanobacteria are no longer 'algae'.\n- **Bentham & Hooker** → the **natural** system for **flowering plants**. (Linnaeus = artificial, used the androecium.)\n- **Numerical taxonomy** → computer + **equal importance** to each character + hundreds of characters.\n- **Cytotaxonomy** → **chromosomes** (number, structure, behaviour).\n- **Chemotaxonomy** → **chemical** constituents of the plant.\n- **Phylogenetic** → **evolutionary** relationships; same taxon shares a **common ancestor**.",
    },
    // ── 10 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Attribution NEET loves:** the **natural classification of flowering plants** was given by **Bentham & Hooker** — memorise the pair. Don't confuse them with Linnaeus (artificial system, androecium) or Whittaker (five kingdoms, from the last chapter).\n\n**The 'equal weightage' line:** artificial systems gave **equal weight to vegetative and sexual characters**, and this is *unacceptable* because vegetative characters are **more easily affected by the environment**. That exact reasoning is a favourite one-liner.\n\n**Phylogenetic in one phrase:** based on **evolutionary relationships**, assuming organisms of the **same taxa have a common ancestor**.\n\n**The three modern tools — match by keyword:** Numerical = **computer, equal importance, hundreds of characters**; Cyto = **chromosome** number/structure/behaviour; Chemo = **chemical** constituents.\n\n**Classic NEET question:** \"Natural system of classification of flowering plants was proposed by?\" → **Bentham and Hooker.**",
    },
    // ── 11 · Bridge text ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "So the plant kingdom is five groups, and taxonomists have three sharper tools than habit-and-leaf-shape to sort them. Now we start the climb at the bottom rung — in the water — with the first of those five groups: **Algae**.",
    },
    // ── 12 · Inline quiz (LAST) ───────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Which organisms are no longer considered 'algae' or part of the plant kingdom, under the modern view?",
          options: [
            "Cyanobacteria (blue-green algae), because cell-walled members of Monera were excluded from Plantae",
            "Ferns, because they moved out of the water and onto land",
            "Gymnosperms, because their seeds are naked and uncovered",
            "Bryophytes, because they lack a proper vascular system",
          ],
          correct_index: 0,
          explanation: "NCERT is explicit that fungi and the cell-walled members of Monera and Protista were removed from Plantae, so cyanobacteria — which are Monera — are no longer 'algae'. Ferns (pteridophytes), gymnosperms and bryophytes are all still firmly inside the plant kingdom; the reasons given for them are true statements but have nothing to do with being excluded.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'The natural system of classification for flowering plants was given by:',
          options: [
            'George Bentham and Joseph Dalton Hooker',
            'Carolus Linnaeus',
            'R.H. Whittaker',
            'Ernst Haeckel',
          ],
          correct_index: 0,
          explanation: "Bentham and Hooker gave the natural classification for flowering plants, using external and internal features. Linnaeus is tied to an artificial system based on the androecium; Whittaker gave the five-kingdom classification (previous chapter), not a system for flowering plants; Haeckel is not the name NCERT attaches here.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "A method assigns a number or code to every observable character, gives each character equal importance, and lets a computer weigh hundreds of them at once. Which approach is this?",
          options: [
            'Numerical taxonomy',
            'Cytotaxonomy',
            'Chemotaxonomy',
            'Phylogenetic classification',
          ],
          correct_index: 0,
          explanation: "The 'computer + codes + equal importance + hundreds of characters' description is numerical taxonomy word for word. Cytotaxonomy is defined by chromosome number, structure and behaviour; chemotaxonomy uses the plant's chemical constituents; a phylogenetic system is built on evolutionary relationships and a common ancestor — none of those match the described method.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Why did NCERT call artificial systems unacceptable for giving vegetative and sexual characters equal weight?",
          options: [
            'Vegetative characters are more easily affected by the environment, so weighting them equally can wrongly separate closely related species',
            'Sexual characters are too rare to observe in most plants, so only vegetative ones can be relied on',
            'Vegetative and sexual characters can never appear together in the same plant',
            'Artificial systems used internal features like anatomy and embryology, which are hard to measure',
          ],
          correct_index: 0,
          explanation: "The environment easily shifts vegetative features such as leaf shape and colour, so trusting them as much as the stabler reproductive parts splits true relatives apart — that's NCERT's exact objection. Sexual characters aren't 'too rare'; vegetative and sexual characters both belong to the same plant; and it was the natural systems, not the artificial ones, that used internal features like anatomy and embryology.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
