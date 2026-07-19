'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'mollusca-and-echinodermata',
  title: 'Mollusca and Echinodermata',
  subtitle: "A shell-covered body with a rasping tongue, and a spiny-skinned animal that is bilateral as a baby but radial as an adult — two phyla NEET tests hard, and for very different reasons.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['animal-kingdom', 'mollusca', 'echinodermata'],
  glossary: [
    { term: 'mantle', definition: "The soft, spongy layer of skin that forms over a mollusc's visceral hump." },
    { term: 'mantle cavity', definition: 'The space between the visceral hump and the mantle in a mollusc, where feather-like gills sit; the gills carry out respiratory and excretory functions.' },
    { term: 'visceral hump', definition: "The distinct raised mass of a mollusc's body, covered by the mantle and the calcareous shell, sitting behind the head and foot." },
    { term: 'radula', definition: "A file-like rasping organ inside a mollusc's mouth, used for feeding." },
    { term: 'water vascular system', definition: 'The most distinctive feature of echinoderms — a system that helps in locomotion, capture and transport of food, and respiration.' },
    { term: 'ossicle', definition: 'A small calcareous plate; echinoderms have an endoskeleton built of these, which is why the phylum is named "spiny-bodied".' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A quiet rocky tide pool at dusk, spiral shells and a starfish silhouette resting half-submerged in still water',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A tranquil rocky tide pool at dusk, seen from a low angle across still, shallow water reflecting a soft amber sky. Scattered spiral shells and a five-armed starfish silhouette rest half-submerged among the rocks in the foreground, with the faint outline of more shells and a rounded sea-urchin shape visible deeper in the pool. Gentle ripples catch the fading light. No people, no text, no labels, no diagram elements. Deep dusk lighting, painterly illustration style, dark background tones throughout (#0a0a0a base).",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'One Phylum, So Many Shapes',
      markdown: "Pila the apple snail crawling under its shell. Pinctada the pearl oyster sitting shut on the seabed. Sepia the cuttlefish and Loligo the squid gliding through open water. Octopus, the devil fish. Aplysia, the sea-hare. Dentalium, the tusk shell. Chaetopleura, the chiton. NCERT places every single one of these very different-looking animals in the same phylum — **Mollusca**, the **second largest animal phylum** on Earth, right behind Arthropoda. What ties them together isn't how they look from the outside. It's one shared body plan hiding underneath.",
    },
    // ── 2 · Core concept — bridging from Arthropoda ─────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The jointed, segmented body plan of Arthropoda is one way to build a successful animal. This page hands you two more — both organ-system level, both triploblastic and coelomate, but built on completely different blueprints. **Mollusca** wraps its body in a shell and hides a rasping tongue inside its mouth. **Echinodermata** builds a skeleton out of spiny calcareous plates and does something no other phylum does: it changes its own symmetry between larva and adult.",
    },
    // ── 3 · Heading — Mollusca ───────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Phylum Mollusca — Shell, Foot, and a Rasping Tongue',
      objective: "By the end of this you can label every part of a mollusc's body plan — shell, mantle, mantle cavity, foot, and radula — and explain what each one actually does.",
    },
    // ── 4 · Text — Mollusca body plan ────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Molluscs are **terrestrial or aquatic** — some live on land, others in the sea or in fresh water — and they run an **organ-system level of organisation**. Like arthropods, they are **bilaterally symmetrical**, **triploblastic**, and **coelomate**.\n\nThe body itself is **unsegmented** and **covered by a calcareous shell**, and it is built in three distinct parts: a **distinct head**, a **muscular foot**, and a **visceral hump**. A soft, spongy layer of skin — the **mantle** — forms over the visceral hump. Between the hump and the mantle sits a fluid-filled space called the **mantle cavity**, and this is where you'll find **feather-like gills**. Those gills aren't just for breathing — NCERT gives them **both respiratory and excretory functions**.\n\nUp at the **anterior head region** sit **sensory tentacles**. Inside the mouth is the feature NEET asks about again and again: a **file-like rasping organ called the radula**, used for **feeding**.\n\nMolluscs are **usually dioecious** — separate male and female individuals — and **oviparous**, laying eggs that go through **indirect development** rather than hatching directly into a miniature adult.\n\n**Examples:** *Pila* (apple snail), *Pinctada* (pearl oyster), *Sepia* (cuttlefish), *Loligo* (squid), *Octopus* (devil fish), *Aplysia* (sea-hare), *Dentalium* (tusk shell), and *Chaetopleura* (chiton).",
    },
    // ── 5 · Interactive image — Mollusca body plan ───────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: "A generalised snail-like mollusc showing its shell, visceral hump, mantle, mantle cavity with gills, muscular foot, and radula inside the mouth",
      caption: '📸 Tap each part to see what it does in a mollusc’s body',
      generation_prompt: "Scientific textbook illustration of a generalised snail-like mollusc (Pila-style, apple snail). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, no text or labels baked into the image. Show a cutaway side view: a coiled tan/brown calcareous shell covering the upper body; beneath it, the visceral hump shown as a soft rounded mass in pale pink/magenta (animal soft tissue); a thin grey mantle layer wrapping the visceral hump, with a visible gap between mantle and hump labelled by shape as the mantle cavity, inside which sit two small feather-like gills in pale pink; a broad flat muscular foot in pink/magenta extending from underneath the body toward the ground; a distinct head at the front with two short sensory tentacles; and, inside the open mouth at the tip of the head, a small ridged radula structure visible in cross-section. Functional colours: tan/brown for the shell (dead/hard structure), pink/magenta for soft animal tissue (visceral hump, foot, gills, radula), grey-white for the mantle. No photorealism, no cartoon, no mascots, no labels — matches standard biology textbook illustration conventions.",
      hotspots: [
        {
          id: uuid(), x: 0.62, y: 0.18, label: 'Calcareous shell', icon: 'circle',
          detail: 'Covers the body of the mollusc. The body underneath is **unsegmented** — there are no repeating body rings like in an arthropod or an annelid.',
        },
        {
          id: uuid(), x: 0.60, y: 0.42, label: 'Visceral hump', icon: 'circle',
          detail: "One of the mollusc's three distinct body regions (along with the head and the foot). It sits under the shell and holds the animal's soft mass of organs.",
        },
        {
          id: uuid(), x: 0.50, y: 0.35, label: 'Mantle', icon: 'circle',
          detail: 'A soft, spongy layer of skin that forms over the visceral hump. The mantle is what secretes the calcareous shell.',
        },
        {
          id: uuid(), x: 0.68, y: 0.48, label: 'Mantle cavity with gills', icon: 'circle',
          detail: 'The space between the visceral hump and the mantle. It houses **feather-like gills**, which handle both **respiration and excretion**.',
        },
        {
          id: uuid(), x: 0.45, y: 0.85, label: 'Muscular foot', icon: 'circle',
          detail: "The third distinct body region, used for movement — the broad flat structure a snail or apple snail glides on.",
        },
        {
          id: uuid(), x: 0.14, y: 0.30, label: 'Radula (in the mouth)', icon: 'circle',
          detail: "A **file-like rasping organ** sitting inside the mouth, at the anterior head region. This is the mollusc's feeding structure — it scrapes food loose the way a file scrapes metal.",
        },
      ],
    },
    // ── 6 · Reasoning prompt — radula / mantle cavity terminology ───────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A mollusc's mouth contains the radula, and its mantle cavity contains feather-like gills. A student mixes the two up on a test and writes that the radula is what handles the mollusc's breathing. What is actually wrong with that answer?",
      options: [
        "Nothing — the radula and the gills are two names for the exact same rasping structure",
        "The radula is a rasping organ in the mouth used for feeding; it's the gills in the mantle cavity that carry out respiration (and excretion)",
        "Molluscs have no respiratory structure at all, so neither the radula nor the gills handle breathing",
        "The radula does handle breathing, and the gills are only used for feeding",
      ],
      correct_index: 1,
      reveal: "The radula is strictly a feeding structure — a file-like rasping organ in the mouth. Respiration (and excretion) is the job of the feather-like gills, which sit in the mantle cavity, not in the mouth. The two structures are in completely different locations doing completely different jobs, which is exactly why NEET likes to swap their functions in a wrong option.",
      difficulty_level: 2,
    },
    // ── 7 · Heading — Echinodermata ─────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Phylum Echinodermata — Spiny-Bodied, and Radial Only as an Adult',
      objective: 'By the end of this you can explain the water vascular system’s three jobs, and why an echinoderm’s symmetry actually changes between larva and adult.',
    },
    // ── 8 · Text — Echinodermata body plan ───────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Echinoderms have an **endoskeleton of calcareous ossicles** — small hard plates built into the body wall — and that's exactly where the name comes from: **Echinodermata means \"spiny-bodied\"**. **All echinoderms are marine**, and they run an **organ-system level of organisation**, just like molluscs.\n\nHere's the feature that makes this phylum stand apart from every other one you've studied: **adult echinoderms are radially symmetrical**, but their **larvae are bilaterally symmetrical**. They are still **triploblastic** and **coelomate** animals — that part doesn't change.\n\nThe **digestive system is complete**, with the **mouth on the lower (ventral) side** and the **anus on the upper (dorsal) side**. The single most distinctive feature of the whole phylum is the **water vascular system**, and it does three jobs at once: it helps in **locomotion**, in the **capture and transport of food**, and in **respiration**. There is **no excretory system** in echinoderms at all.\n\n**Sexes are separate**, reproduction is **sexual**, and **fertilisation is usually external**. Development is **indirect**, passing through a **free-swimming larva** — the very larva that is bilaterally symmetrical, before it settles down and becomes a radial adult.\n\n**Examples:** *Asterias* (star fish), *Echinus* (sea urchin), *Antedon* (sea lily), *Cucumaria* (sea cucumber), and *Ophiura* (brittle star).",
    },
    // ── 9 · Reasoning prompt — the radial-adult / bilateral-larva exception ──
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "You already know that bilateral symmetry runs through most of the higher animal phyla you've studied — from Platyhelminthes onward, an animal's body stays built the same way its whole life. Echinodermata breaks that pattern. What actually happens to an echinoderm's symmetry across its own life cycle?",
      options: [
        "The adult is bilaterally symmetrical and the free-swimming larva is radially symmetrical",
        "The free-swimming larva is bilaterally symmetrical, but the adult is radially symmetrical",
        "Both the larva and the adult stay bilaterally symmetrical, exactly like every other triploblastic phylum",
        "Both the larva and the adult stay radially symmetrical from the moment the egg is fertilised",
      ],
      correct_index: 1,
      reveal: "It's the larva that is bilaterally symmetrical, and the adult that turns radially symmetrical. This is the one big exception NEET loves to test: every other phylum you've studied keeps the same body symmetry from larva to adult, but Echinodermata's free-swimming larva starts out bilateral and only becomes radial once it settles down and develops into the adult form. Reversing which stage is which, or claiming no change happens at all, are the exact traps this fact is designed to catch.",
      difficulty_level: 3,
    },
    // ── 10 · Comparison card — adult vs larva ────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 10,
      title: 'Echinoderm Adult vs Echinoderm Larva',
      columns: [
        {
          heading: 'Adult echinoderm',
          points: [
            'Radially symmetrical body',
            'Endoskeleton of calcareous ossicles ("spiny-bodied")',
            'Complete digestive system — mouth on the lower (ventral) side, anus on the upper (dorsal) side',
            'Water vascular system present — used for locomotion, capturing and transporting food, and respiration',
            'No excretory system',
          ],
        },
        {
          heading: 'Free-swimming larva',
          points: [
            'Bilaterally symmetrical body — the exception among the phyla you have studied',
            'Free-swimming, produced by indirect development after external fertilisation',
            'Settles and develops into the radially symmetrical adult form',
          ],
        },
      ],
    },
    // ── 11 · Remember callout ─────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'The Facts You Cannot Get Wrong',
      markdown: "- **Mollusca is the second largest animal phylum.** Body: head + muscular foot + visceral hump, unsegmented, covered by a calcareous shell.\n- **Mantle** = soft layer over the visceral hump. **Mantle cavity** = space between hump and mantle, holding feather-like gills that do **respiration + excretion**.\n- **Radula** = the file-like rasping organ in the mouth, used only for **feeding** — never confuse it with the gills.\n- Molluscs are **usually dioecious**, **oviparous**, with **indirect development**.\n- **Echinodermata = spiny-bodied**, from the calcareous-ossicle **endoskeleton**. **All echinoderms are marine.**\n- **Adult echinoderms are radial; their larvae are bilateral** — the only phylum with this switch.\n- **Water vascular system** = the most distinctive echinoderm feature, doing **locomotion + food capture/transport + respiration**. **No excretory system** in this phylum.",
    },
    // ── 12 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Radula = feeding, not breathing:** the file-like rasping organ in a mollusc's mouth is strictly a feeding structure. Respiration and excretion are handled separately by the feather-like gills sitting in the mantle cavity.\n\n**Mantle cavity ≠ mantle:** the mantle is the soft skin layer; the mantle cavity is the space between that layer and the visceral hump, and it's the cavity — not the mantle itself — that houses the gills.\n\n**Calcareous shell, not chitinous:** a mollusc's shell is calcareous, built from the mantle. Do not confuse this with an arthropod's chitinous cuticle from the previous page — same word \"covering,\" completely different material and origin.\n\n**The symmetry-switch trap:** Echinodermata is the one phylum among those you've studied where the **larva is bilaterally symmetrical but the adult is radially symmetrical**. Any question that reverses this, or claims echinoderms are radial their whole life, is testing exactly this line.\n\n**Classic NEET question:** \"Which phylum has bilaterally symmetrical larvae but radially symmetrical adults?\" → **Echinodermata**.",
    },
    // ── 13 · Bridge to next page ─────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "Two very different body plans down — a shelled, rasping-tongued mollusc and a spiny, symmetry-switching echinoderm. Next up is a small phylum that was once filed away as nothing more than a sub-group of Chordata: Hemichordata.",
    },
    // ── 14 · Inline quiz ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: "In a mollusc, what exactly is the mantle cavity, and what does it contain?",
          options: [
            'The space inside the calcareous shell itself, containing the visceral hump',
            'The space between the visceral hump and the mantle, containing feather-like gills',
            'The space inside the muscular foot, containing the radula',
            'The space inside the head region, containing the sensory tentacles',
          ],
          correct_index: 1,
          explanation: "NCERT defines the mantle cavity as the space between the visceral hump and the mantle, and states that feather-like gills sit inside it. The shell simply covers the body; the foot is a separate structure used for movement; and the tentacles sit at the head, not inside the mantle cavity.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: "What is the radula, and where is it found?",
          options: [
            'A pair of feather-like gills found in the mantle cavity, used for respiration',
            'A muscular structure at the base of the foot, used for gripping surfaces',
            'A file-like rasping organ found in the mouth, used for feeding',
            'A sensory tentacle at the anterior head region, used for touch',
          ],
          correct_index: 2,
          explanation: "The radula is described in NCERT as a file-like rasping organ inside the mouth, used for feeding. Gills are the respiratory structures in the mantle cavity, not the radula; tentacles are sensory structures at the head, separate from the radula.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: "Which statement correctly describes symmetry across an echinoderm's life cycle?",
          options: [
            'The adult is radially symmetrical, but the free-swimming larva is bilaterally symmetrical',
            'Both the adult and the larva are radially symmetrical throughout life',
            'The adult is bilaterally symmetrical, but the free-swimming larva is radially symmetrical',
            'Symmetry is not defined in echinoderms at any stage',
          ],
          correct_index: 0,
          explanation: "NCERT states that adult echinoderms are radially symmetrical while their larvae are bilaterally symmetrical — the reverse of the common pattern in most other phyla. Claiming both stages share one symmetry, or reversing which stage is bilateral and which is radial, are the two classic traps here.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: "The water vascular system is described as the most distinctive feature of Echinodermata. Which functions does it actually perform?",
          options: [
            'Digestion of food and excretion of nitrogenous waste',
            'Locomotion, capture and transport of food, and respiration',
            'Reproduction and internal fertilisation only',
            'Formation of the calcareous endoskeleton',
          ],
          correct_index: 1,
          explanation: "NCERT explicitly assigns three jobs to the water vascular system: locomotion, capture and transport of food, and respiration. Echinoderms have no excretory system at all, fertilisation is usually external (not internal), and the endoskeleton of ossicles is a separate feature from the water vascular system.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
