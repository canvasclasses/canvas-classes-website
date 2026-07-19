'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'levels-of-organisation-and-symmetry',
  title: 'Levels of Organisation and Symmetry',
  subtitle: "Before you can name a single phylum, you need the toolkit biologists actually use to sort a million-plus species — how a body is built, how it's shaped, and how many layers it grew from.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['animal-kingdom', 'classification-basis'],
  glossary: [
    { term: 'cellular level of organisation', definition: 'Cells are arranged as loose aggregates with some division of labour among them, but not grouped into tissues. Seen in sponges.' },
    { term: 'tissue level of organisation', definition: 'Cells performing the same function are arranged into tissues. Seen in coelenterates.' },
    { term: 'organ level of organisation', definition: 'Tissues are grouped together to form organs, each specialised for one function. Seen in Platyhelminthes and other higher phyla.' },
    { term: 'organ system level of organisation', definition: 'Organs associate to form functional systems, each concerned with a specific physiological function. Seen in annelids, arthropods, molluscs, echinoderms and chordates.' },
    { term: 'incomplete digestive system', definition: 'A digestive system with only one opening to the outside, which serves as both mouth and anus. Seen in Platyhelminthes.' },
    { term: 'complete digestive system', definition: 'A digestive system with two separate openings — a mouth and an anus.' },
    { term: 'open circulatory system', definition: 'Blood is pumped out of the heart and directly bathes the cells and tissues, instead of staying inside vessels.' },
    { term: 'closed circulatory system', definition: 'Blood is circulated only through a series of vessels of varying diameter — arteries, veins and capillaries.' },
    { term: 'radial symmetry', definition: 'Any plane passing through the central axis of the body divides the organism into two identical halves.' },
    { term: 'bilateral symmetry', definition: 'The body can be divided into identical left and right halves, but only in one particular plane.' },
    { term: 'diploblastic', definition: 'Body built from two embryonic layers — an outer ectoderm and an inner endoderm — with an undifferentiated mesoglea between them. Seen in coelenterates.' },
    { term: 'triploblastic', definition: 'Body built from three embryonic layers — ectoderm, mesoderm and endoderm. Seen from Platyhelminthes to chordates.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dusk scene of four animal body plans side by side — a lumpy sponge, a radially symmetric jellyfish, a flat ribbon-like worm, and a streamlined fish — each faintly lit to show how different their construction is',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dusk underwater-to-shoreline scene showing four very differently built animals in a row: on the far left, a lumpy irregular vase-shaped sponge attached to a rock with no fixed shape; then a translucent bell-shaped jellyfish drifting with tentacles hanging evenly all around its centre, faint radiating symmetry lines glowing softly within its bell; then a flat ribbon-like worm lying on wet sand with a visible left-right mirrored shape; then on the far right, a streamlined silver fish swimming with a clear head-to-tail, left-right mirrored body. Each creature lit by its own soft pool of light against a deep dusk gradient, none more prominent than the others, connected by one continuous dark naturalistic underwater-to-shore landscape. Dark background throughout (#0a0a0a base tones), one warm horizon glow tying the scene together. Painterly, atmospheric illustration style, no text, no labels, no diagram elements, no photorealism.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'One Opening Does Everything',
      markdown: "A flatworm eats through its mouth — and then, when it's done digesting, the leftover waste comes back out through **the very same opening**. There's no separate exit. NCERT calls this arrangement an **incomplete digestive system**, and it's one of the exact features you're about to learn to use as a sorting tool for the entire animal kingdom.",
    },
    // ── 2 · Core concept — why these features matter ───────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Over a million species of animals have been described so far, and every one of them looks different up close — different shapes, different sizes, different habits. So how does anyone sort a million-plus species into a sensible system?\n\nNCERT's answer: despite all the surface differences, there are **fundamental features common to groups of animals** — how their cells are arranged, what shape their body is built in, how many embryonic layers they grew from, whether they have a body cavity, and how their digestive, circulatory and reproductive systems are patterned. These features don't change from species to species within a group; they're stable enough to build a classification on.\n\nThis page hands you the first three of those tools: **levels of organisation**, **symmetry**, and **diploblastic vs triploblastic organisation**. You won't meet a single named phylum's full classification yet — that comes later. Right now, the job is to get comfortable using these three yes/no questions, because every phylum you meet from here on will be sorted using exactly this toolkit.",
    },
    // ── 3 · Heading — Levels of Organisation ────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Levels of Organisation',
      objective: 'By the end of this you can match cellular, tissue, organ and organ-system organisation to the right phyla, and explain incomplete vs complete digestion and open vs closed circulation as examples of organ-system complexity.',
    },
    // ── 4 · Text — cellular → tissue → organ → organ system ─────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Every member of Animalia is multicellular, but 'multicellular' doesn't mean the cells are all organised the same way. There's a climb here, and each phylum sits on a different rung.\n\nIn **sponges**, the cells are just arranged as **loose aggregates** — there's some division of labour between cells, but they aren't grouped into tissues. This is the **cellular level of organisation**.\n\nIn **coelenterates**, the arrangement is more complex: cells doing the same job are grouped together into **tissues**. This is the **tissue level of organisation**.\n\nA step higher, in **Platyhelminthes and other higher phyla**, tissues are grouped together into **organs**, each specialised for one particular function. This is the **organ level of organisation**.\n\nIn **Annelids, Arthropods, Molluscs, Echinoderms and Chordates**, organs go one step further and associate together to form functional **systems**, each system handling a specific physiological job. This is the **organ system level of organisation** — the most complex of the four.\n\nBut 'organ system level' isn't one fixed design — different groups run different versions of the same system. Take the **digestive system**: in Platyhelminthes it has only **one opening** to the outside, which does double duty as both mouth and anus — that's called an **incomplete digestive system**. A **complete digestive system** has **two separate openings**, a mouth and an anus.\n\nThe **circulatory system** varies the same way, in two types. An **open circulatory system** pumps blood out of the heart so that it directly bathes the cells and tissues. A **closed circulatory system** keeps the blood inside a network of **vessels of varying diameter — arteries, veins and capillaries** — that carry it everywhere instead of letting it spill into open spaces.",
    },
    // ── 5 · Comparison card — four levels ───────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 5,
      title: 'Cellular vs Tissue vs Organ vs Organ System',
      columns: [
        {
          heading: 'Cellular',
          points: [
            'Cells arranged as loose aggregates',
            'Some division of labour between cells, but no true tissues',
            'Example: sponges (Porifera)',
          ],
        },
        {
          heading: 'Tissue',
          points: [
            'Cells doing the same job grouped into tissues',
            'More complex arrangement than loose aggregates',
            'Example: coelenterates',
          ],
        },
        {
          heading: 'Organ',
          points: [
            'Tissues grouped together into organs',
            'Each organ specialised for one particular function',
            'Example: Platyhelminthes and other higher phyla',
          ],
        },
        {
          heading: 'Organ System',
          points: [
            'Organs associate to form functional systems',
            'Each system handles one specific physiological job',
            'Examples: Annelids, Arthropods, Molluscs, Echinoderms, Chordates',
          ],
        },
      ],
    },
    // ── 6 · Heading — Symmetry ───────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Symmetry',
      objective: 'By the end of this you can tell asymmetrical, radial and bilateral body plans apart and name a phylum example for each.',
    },
    // ── 7 · Text — asymmetrical, radial, bilateral ───────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Animals can also be sorted by their **symmetry** — the way a plane cutting through the body does, or doesn't, produce matching halves.\n\n**Sponges are mostly asymmetrical.** Any plane you pass through their centre fails to divide them into equal halves — there's no consistent shape to mirror.\n\n**Radial symmetry** is what you get when any plane passing through the **central axis** of the body divides the organism into **two identical halves**. Because the plane can be drawn through the centre in more or less any direction and still work, this body plan has no distinct left, right, front, or back. **Coelenterates, ctenophores and echinoderms** all show radial symmetry.\n\n**Bilateral symmetry** is stricter: the body can be divided into identical left and right halves, but **only in one particular plane**. Animals like **annelids and arthropods** are built this way — they have a definite head end, tail end, and one clean left-right mirror line, not many.",
    },
    // ── 8 · Reasoning prompt (mid-page) ──────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "A jellyfish's tentacles hang evenly all the way around its bell, and you can slice through its centre along almost any direction and still get two matching halves. Which symmetry does this describe, and why doesn't 'bilateral' fit here?",
      options: [
        "Bilateral symmetry — because a jellyfish still has a top and a bottom, and that's enough to call it bilateral",
        "Asymmetrical — because a jellyfish's tentacles are not identical in length, so no plane can ever divide it evenly",
        "Radial symmetry — because any plane through the central axis gives identical halves, not just one specific plane, which is exactly what bilateral symmetry requires",
        "Radial symmetry — because a jellyfish belongs to Annelida, and NCERT lists Annelida as radially symmetrical",
      ],
      reveal: "This is radial symmetry, because ANY plane through the central axis produces two identical halves — not just one. A jellyfish is a coelenterate, and NCERT places coelenterates (along with ctenophores and echinoderms) in the radial symmetry group for exactly this reason. Bilateral symmetry is the stricter case, where only ONE particular plane works; having a top and bottom doesn't make something bilateral. Calling it 'asymmetrical' misreads the question — the jellyfish here does divide evenly, that's the whole point. And the phylum link is wrong too: Annelida is NCERT's bilateral symmetry example, not radial — jellyfish belong to the coelenterates.",
      difficulty_level: 2,
    },
    // ── 9 · Heading — Diploblastic and Triploblastic ────────────────────────
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'Diploblastic and Triploblastic Organisation',
      objective: 'By the end of this you can name the embryonic layers of a diploblastic vs a triploblastic animal and place an example phylum in each group.',
    },
    // ── 10 · Text — diplo vs triploblastic ───────────────────────────────────
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "The last tool on this page looks at how many layers of cells an animal's body is built from, right back at the embryo stage.\n\n**Diploblastic animals** have their cells arranged in **two embryonic layers** — an outer **ectoderm** and an inner **endoderm**. Between these two layers sits an **undifferentiated layer called the mesoglea** — it isn't a true third germ layer, just packing material between the two real ones. **Coelenterates** are the example NCERT gives for diploblastic organisation.\n\n**Triploblastic animals** go one step further: the developing embryo grows a genuine **third germinal layer**, the **mesoderm**, sitting in between the ectoderm and the endoderm. This group runs from **Platyhelminthes all the way to Chordates** — in other words, once you're past the coelenterates, almost everything else in the animal kingdom is triploblastic.",
    },
    // ── 11 · Interactive image — germ layer cross-sections ──────────────────
    {
      id: uuid(), type: 'interactive_image', order: 11, src: '',
      alt: 'Two circular cross-sections side by side showing the embryonic layers of a diploblastic animal on the left (ectoderm, mesoglea, endoderm) and a triploblastic animal on the right (ectoderm, mesoderm, endoderm)',
      caption: '📸 Tap each layer to see what it is and which animals have it',
      generation_prompt: "Scientific textbook illustration of two labelled circular body-wall cross-sections placed side by side, showing germinal layers. Flat 2D educational diagram on a dark background (#0a0a0a near-black). LEFT circle: three concentric rings labelled by position — an outer ring (ectoderm), a thin middle ring (mesoglea), and an inner ring (endoderm) — representing a diploblastic body plan. RIGHT circle: three concentric rings of roughly equal thickness — an outer ring (ectoderm), a middle ring (mesoderm), and an inner ring (endoderm) — representing a triploblastic body plan, with the middle ring visibly thicker and more defined than the thin mesoglea on the left circle. Clean white outlines on both circles, thin white leader lines pointing from each ring to a label position outside the circle (labels added separately by the app, do not render text in the image), biologically accurate proportions, no photorealism, no cartoon style, no mascots, matches standard biology textbook diagram conventions.",
      hotspots: [
        { id: uuid(), x: 0.16, y: 0.16, label: 'Ectoderm (diploblastic)', detail: 'The outer embryonic layer in a **diploblastic** animal, such as a coelenterate.', icon: 'circle' },
        { id: uuid(), x: 0.16, y: 0.5, label: 'Mesoglea', detail: 'An **undifferentiated layer** sitting between the ectoderm and endoderm in diploblastic animals — not a true third germ layer, just packing material.', icon: 'circle' },
        { id: uuid(), x: 0.16, y: 0.84, label: 'Endoderm (diploblastic)', detail: 'The inner embryonic layer in a diploblastic animal.', icon: 'circle' },
        { id: uuid(), x: 0.82, y: 0.16, label: 'Ectoderm (triploblastic)', detail: 'The outer embryonic layer in a **triploblastic** animal — the group running from Platyhelminthes to Chordates.', icon: 'circle' },
        { id: uuid(), x: 0.82, y: 0.5, label: 'Mesoderm', detail: 'The genuine **third germinal layer** in triploblastic animals, sitting between the ectoderm and endoderm — this is what makes them triploblastic rather than diploblastic.', icon: 'circle' },
        { id: uuid(), x: 0.82, y: 0.84, label: 'Endoderm (triploblastic)', detail: 'The inner embryonic layer in a triploblastic animal.', icon: 'circle' },
      ],
    },
    // ── 12 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Cellular → Tissue → Organ → Organ System:** Porifera → Coelenterata → Platyhelminthes-and-other-higher-phyla → Annelida, Arthropoda, Mollusca, Echinodermata, Chordata.\n- **Incomplete digestive system** = one opening does both mouth and anus (Platyhelminthes). **Complete** = separate mouth and anus.\n- **Open circulatory system** = blood pumped out of the heart, directly bathes tissues. **Closed** = blood stays inside vessels — arteries, veins, capillaries.\n- **Asymmetrical** = sponges. **Radial** = coelenterates, ctenophores, echinoderms (any plane through the central axis gives identical halves). **Bilateral** = annelids, arthropods (only one plane gives identical left-right halves).\n- **Diploblastic** = ectoderm + mesoglea + endoderm, coelenterates. **Triploblastic** = ectoderm + mesoderm + endoderm, Platyhelminthes to Chordates.",
    },
    // ── 13 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Incomplete vs complete digestive system:** this is a classic one-liner. **Platyhelminthes = incomplete** (single opening, mouth and anus are the same hole). Anything with a separate mouth and anus is **complete**. Don't mix this up with coelom terms — it's about the gut's openings, not the body cavity.\n\n**Open vs closed circulatory system:** **open** = blood leaves the heart and directly bathes cells and tissues (no return-vessel network for that leg of the journey). **closed** = blood always stays inside vessels of varying diameter — arteries, veins, capillaries. NEET often phrases this as 'blood does NOT come in direct contact with tissues' → that's closed.\n\n**Mnemonic for organisation level → phylum:** think of it as one ladder, rung by rung — **Porifera (cellular) → Coelenterata (tissue) → Platyhelminthes (organ) → everyone from Annelida onward (organ system).** Say it as 'Poor Cells, Then Tissues, Then Organs, Then Whole Systems' to keep the order straight.\n\n**Classic NEET question:** \"Which of the following shows tissue level of organisation?\" → **Coelenterata.**",
    },
    // ── 14 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "So you now have three sorting questions in hand: how are the cells organised, what symmetry does the body have, and how many embryonic layers did it grow from. There's one more fundamental feature waiting — whether the body has a proper cavity between the body wall and the gut wall, and what that cavity is lined by. That's **coelom**, and it's next.",
    },
    // ── 15 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'Which group of animals shows the cellular level of organisation, where cells are arranged as loose aggregates rather than grouped into tissues?',
          options: [
            'Coelenterates',
            'Sponges (Porifera)',
            'Platyhelminthes',
            'Annelids',
          ],
          correct_index: 1,
          explanation: "NCERT gives sponges as the example of cellular level of organisation — cells are loose aggregates with some division of labour but no true tissues. Coelenterates are the tissue-level example, Platyhelminthes are organ-level, and annelids are organ-system level — all one or more rungs higher than cellular.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Platyhelminthes have a digestive system with only one opening that serves as both mouth and anus. What is this arrangement called?",
          options: [
            'A closed circulatory system',
            'A complete digestive system',
            'An incomplete digestive system',
            'An open circulatory system',
          ],
          correct_index: 2,
          explanation: "A single opening doing double duty as mouth and anus is exactly what NCERT calls an incomplete digestive system. A complete digestive system needs two separate openings. Open and closed circulatory system are a completely different feature — they describe how blood moves, not how digestion works.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "In a closed circulatory system, how does blood reach the body's cells and tissues?",
          options: [
            'It is pumped straight out of the heart and directly bathes the cells and tissues with no vessels involved',
            'It only moves when the animal is at the organ level of organisation, not the organ-system level',
            'It moves through the mesoglea layer that sits between the ectoderm and endoderm',
            'It is circulated only through vessels of varying diameter — arteries, veins and capillaries — never spilling out to directly bathe the tissues',
          ],
          correct_index: 3,
          explanation: "Closed circulatory systems keep blood confined to a network of vessels of varying diameter — arteries, veins and capillaries — throughout its whole path. 'Pumped straight out of the heart to directly bathe cells and tissues' describes the OPEN circulatory system instead, the opposite type. Tying circulatory type to organisation level is invented — NCERT never links them that way. And the mesoglea is a diploblastic germ layer, not part of the circulatory system at all — a different feature entirely.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "An animal is triploblastic. Which statement correctly describes what that means for its embryonic layers?",
          options: [
            'It shows radial symmetry, since NCERT groups triploblastic and radially symmetrical animals together as one category',
            'Its embryo has three germinal layers — ectoderm, mesoderm and endoderm — with mesoderm as a genuine third layer between the other two',
            'Its embryo has three germinal layers, but the middle one is an undifferentiated mesoglea rather than true mesoderm',
            'It has only two germinal layers, ectoderm and endoderm, but three tissue types built from them',
          ],
          correct_index: 1,
          explanation: "Triploblastic means a genuine third germinal layer, the mesoderm, develops between the ectoderm and endoderm — seen from Platyhelminthes to chordates. 'Three layers with an undifferentiated mesoglea in the middle' actually describes diploblastic animals (coelenterates), not triploblastic ones — mesoglea isn't true mesoderm. Claiming only two germinal layers is simply wrong for a triploblastic animal by definition. And linking triploblastic status to radial symmetry invents a connection NCERT never makes; symmetry and germ-layer number are two separate, independent sorting features.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
