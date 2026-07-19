'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'coelom-segmentation-and-notochord',
  title: 'Coelom, Segmentation, and Notochord',
  subtitle: "Three more yes/no questions — is the body cavity lined, are the segments repeated, is there a dorsal rod — and the toolkit for sorting every animal on Earth is complete.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['animal-kingdom', 'classification-basis'],
  glossary: [
    { term: 'coelom', definition: 'The body cavity between the body wall and the gut wall, when that cavity is lined by mesoderm. Animals that have one are coelomates.' },
    { term: 'pseudocoelom', definition: 'A body cavity in which the mesoderm is not a continuous lining but sits only as scattered pouches between the ectoderm and endoderm. Animals that have this are pseudocoelomates, e.g., aschelminthes.' },
    { term: 'acoelomate', definition: 'An animal in which the body cavity is completely absent, e.g., platyhelminthes.' },
    { term: 'metamerism', definition: 'The phenomenon in which the body is externally and internally divided into segments, with a serial repetition of at least some organs — seen in the earthworm.' },
    { term: 'notochord', definition: 'A mesodermally-derived, rod-like structure formed on the dorsal side of the body during embryonic development. Animals that form one are chordates; animals that do not are non-chordates.' },
  ],
  blocks: [
    // ── hero ─────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A segmented earthworm curled in dark soil at dusk, with faint glassy cross-section spheres and a distant glowing rod-like spine suggested in the background',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A close, low-angle dusk scene in damp dark soil: in the foreground, a long segmented earthworm curls gently across the frame, its ringed body segments catching a faint warm light. In the soft-focus background, three small glassy sphere-like forms float half-buried in the earth, each hinting at a different internal cross-section without any visible labels or diagram lines — just a suggestion of hidden structure. Farther back and higher in the frame, barely visible in the dusk haze, the faint silhouette of a slender fish-like body shows one thin glowing line running along its back like a spine of light. None of these elements are the focal subject on their own — they exist together as one quiet scene about hidden internal structure. Deep dusk lighting, a single warm glow tying the scene together, painterly and atmospheric illustration style, dark background tones throughout (#0a0a0a base), no text, no labels, no diagram elements.",
    },
    // ── fun_fact ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Empty Space Your Organs Float In',
      markdown: "Right now, inside your own body, there is a fluid-cushioned cavity between your body wall and your gut — and it's lined on both sides by a tissue layer called mesoderm. That's a **coelom**, and you have one because you're a chordate. A roundworm has a body cavity too, but its mesoderm doesn't form a proper lining — it just sits there as scattered patches. And a flatworm has no cavity at all; its organs are packed in solid. Same basic body plan question — is there a cavity, and if so, is it properly lined — answered three different ways by three different animal groups.",
    },
    // ── bridge + core concept ────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "You've already sorted animals by how their cells are arranged, whether they're radially or bilaterally symmetrical, and whether they're diploblastic or triploblastic. Three more features finish the classification toolkit — and the first one, the coelom, is one of the most repeated distinctions in the whole chapter.\n\nThe **coelom** is the cavity between the body wall and the gut wall. What decides its name isn't whether the cavity exists — it's *what lines it*. When that cavity is **lined by mesoderm**, the animal is a **coelomate**. This is the body plan of **annelids, molluscs, arthropods, echinoderms, hemichordates and chordates** — six of the phyla you'll meet on the pages ahead.",
    },
    // ── interactive image: Figure 4.3 ────────────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 3, src: '',
      alt: 'Three diagrammatic sectional views of an animal body plan: coelomate, pseudocoelomate, and acoelomate',
      caption: '📸 Tap each section to see how mesoderm sits between the body wall and the gut wall',
      generation_prompt: "Scientific textbook illustration comparing three animal body-cavity types, matching NCERT Figure 4.3. Flat 2D educational diagram on a dark background (#0a0a0a near-black), laid out as three clean circular cross-section panels in a row, clean white outlines throughout. Each panel shows a body wall as an outer ring and a gut wall as a smaller inner ring, with the space between them coloured to show mesoderm. Panel 1 (coelomate): the space between body wall and gut wall is fully lined on both sides by a continuous pink/magenta mesoderm layer, leaving a clear open cavity in between — biologically accurate, matching annelid/mollusc/arthropod/echinoderm/hemichordate/chordate body plans. Panel 2 (pseudocoelomate): the space between body wall and gut wall has small separate scattered patches of pink/magenta mesoderm tissue (not a continuous lining), with open cavity space around the patches. Panel 3 (acoelomate): the space between body wall and gut wall is completely solid, filled edge to edge with tissue (no open cavity at all, no mesoderm lining visible). Ectoderm shown as the thin outer boundary line, endoderm as the thin inner boundary line around the gut, in white outline. No baked-in text labels, no photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.17, y: 0.5, label: 'Coelomate', icon: 'circle',
          detail: "The body cavity is **lined by mesoderm**. This is the plan of **annelids, molluscs, arthropods, echinoderms, hemichordates and chordates** (Figure 4.3a)." },
        { id: uuid(), x: 0.5, y: 0.5, label: 'Pseudocoelomate', icon: 'circle',
          detail: "The mesoderm is **not a continuous lining** — it sits only as **scattered pouches** between the ectoderm and endoderm. Seen in **aschelminthes** (Figure 4.3b)." },
        { id: uuid(), x: 0.83, y: 0.5, label: 'Acoelomate', icon: 'circle',
          detail: "The body cavity is **absent** altogether. Seen in **platyhelminthes** (Figure 4.3c)." },
      ],
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "In some animals the mesoderm never forms a proper lining at all — instead it's present as **scattered pouches** sitting between the ectoderm and endoderm. That kind of cavity is called a **pseudocoelom**, and animals that have it are **pseudocoelomates** — the aschelminthes (roundworms) are NCERT's example.\n\nAnd in a third group, there's no cavity between the body wall and the gut wall at all — the space is simply not there. These are **acoelomates**, and **platyhelminthes** (flatworms) are the example. So the same question — body wall, then what, then gut wall — gets three different answers: a properly lined cavity, a cavity with only scattered mesoderm patches, or no cavity whatsoever.",
    },
    // ── mid-page reasoning check ─────────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 5, reasoning_type: 'logical',
      prompt: "An earthworm's body cavity is fully lined by mesoderm on both the body-wall side and the gut side. A roundworm from phylum Aschelminthes instead has mesoderm sitting only as scattered pouches, with no continuous lining. How should each be classified by coelom type?",
      options: [
        "The earthworm is pseudocoelomate, since annelids have scattered mesoderm pouches, and the roundworm is coelomate",
        "The earthworm is coelomate, since its cavity is fully lined by mesoderm, and the roundworm is pseudocoelomate, since its mesoderm is only scattered pouches",
        "Both are acoelomate, since NCERT groups all worm-shaped animals as lacking a true body cavity",
        "The earthworm is acoelomate, since annelids have no body cavity at all, and the roundworm is coelomate",
      ],
      correct_index: 1,
      reveal: "A fully mesoderm-lined cavity is the definition of coelomate — and the earthworm is an annelid, one of NCERT's own coelomate examples. Scattered mesoderm pouches with no continuous lining is the definition of pseudocoelomate, and aschelminthes is NCERT's named example of it. The first option simply swaps the two definitions around; the third is wrong because 'worm-shaped' isn't the criterion at all — mesoderm arrangement is; and the fourth wrongly calls the earthworm acoelomate, which describes platyhelminthes (no cavity), not annelids.",
      difficulty_level: 3,
    },
    // ── comparison card ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 6, title: 'Coelom vs Pseudocoelom vs Acoelom',
      columns: [
        { heading: 'Coelomate', points: ['Mesoderm forms a continuous lining of the body cavity', 'Annelids, molluscs, arthropods, echinoderms, hemichordates, chordates'] },
        { heading: 'Pseudocoelomate', points: ['Mesoderm present only as scattered pouches — no continuous lining', 'Aschelminthes'] },
        { heading: 'Acoelomate', points: ['No body cavity between body wall and gut wall at all', 'Platyhelminthes'] },
      ],
    },
    // ── heading: segmentation ────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Segmentation — When the Body Repeats Itself',
      objective: "By the end of this you can name metameric segmentation, its shorter name metamerism, and its textbook example.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "In some animals, the body is divided — both **externally and internally** — into **segments**, with **at least some organs repeated serially** down its length. NCERT's example is the **earthworm**: its body is visibly ringed on the outside, and internally, several organs repeat segment after segment. This pattern is called **metameric segmentation**, and the phenomenon itself is known as **metamerism**.\n\nDon't confuse this with the germ-layer count from diploblastic/triploblastic, or with the coelom you just learned. Segmentation is a separate question entirely: does the body repeat itself in a serial, ring-like pattern, or not?",
    },
    // ── heading: notochord ────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'Notochord — The Line That Splits Chordates From Everything Else',
      objective: "By the end of this you can define the notochord and correctly place any animal as chordate or non-chordate.",
    },
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "The last of the six features is the **notochord** — a **mesodermally derived, rod-like structure** that forms on the **dorsal side** of the body during **embryonic development**, in some animals. Animals that form a notochord are called **chordates**. Animals that never form this structure are **non-chordates** — and that covers everything from **porifera to echinodermata**.\n\nThat one structure is the single biggest split in the entire animal kingdom — bigger than symmetry, bigger than coelom type. Every phylum you're about to meet falls on one side of that line or the other, and section 4.2 groups all of them using exactly the fundamental features you've now learned: organisation, symmetry, germ layers, coelom, segmentation and notochord, together.",
    },
    // ── remember ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember', title: 'The Facts You Cannot Swap Around',
      markdown: "- **Coelomate** = cavity **lined by mesoderm** → annelids, molluscs, arthropods, echinoderms, hemichordates, chordates.\n- **Pseudocoelomate** = mesoderm as **scattered pouches**, no lining → aschelminthes.\n- **Acoelomate** = **no cavity** at all → platyhelminthes.\n- **Metameric segmentation (metamerism)** = body divided into segments, external and internal, with **serial repetition of at least some organs** → earthworm.\n- **Notochord** = **mesodermal, dorsal, embryonic** rod-like structure → present in chordates, absent in non-chordates (porifera to echinodermata).",
    },
    // ── exam_tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Coelom type is one of the most repeated NEET questions in this entire chapter.** Examiners love giving you an example organism and asking which bucket it falls in — so lock the three groups cold, in NCERT's own order: **Annelida, Mollusca, Arthropoda, Echinodermata, Hemichordata, Chordata** are coelomate; only **Aschelminthes** is pseudocoelomate; only **Platyhelminthes** is acoelomate.\n\n**A mnemonic for the six coelomate phyla, in that exact order:** \"**A**ll **M**ice **A**dore **E**ating **H**oney **C**ake\" → **A**nnelida, **M**ollusca, **A**rthropoda, **E**chinodermata, **H**emichordata, **C**hordata.\n\n**Don't mix up segmentation with coelom.** A phylum can be both segmented and coelomate (like Annelida) — they're two separate yes/no questions, not the same fact restated.\n\n**Classic NEET question:** \"Presence of notochord divides Animalia into which two groups?\" → **Chordata and non-chordata**, with non-chordates spanning **porifera to echinodermata**.",
    },
    // ── inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'What exactly makes a body cavity a true coelom?',
          options: [
            'The cavity between the body wall and the gut wall is lined by mesoderm',
            'The mesoderm is present only as scattered pouches between ectoderm and endoderm',
            'The body cavity between the body wall and the gut wall is completely absent',
            'An undifferentiated layer, mesoglea, sits between the ectoderm and endoderm',
          ],
          correct_index: 0,
          explanation: "A coelom is specifically a body cavity lined by mesoderm — that lining is the defining feature. Scattered mesoderm pouches describe a pseudocoelom instead, a completely absent cavity describes acoelomate animals, and mesoglea is the unrelated diploblastic-animal layer between ectoderm and endoderm, not a coelom at all.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Aschelminthes (roundworms) are classified by their coelom type as:',
          options: [
            'Coelomate, since their body cavity is fully lined by mesoderm like an annelid',
            'Acoelomate, since they have no body cavity between body wall and gut wall',
            'Pseudocoelomate, since their mesoderm is present only as scattered pouches',
            'Diploblastic, since they have only two embryonic germ layers',
          ],
          correct_index: 2,
          explanation: "NCERT names aschelminthes as the pseudocoelomate example — their mesoderm sits as scattered pouches rather than forming a continuous lining. They are not coelomate (that needs a full mesoderm lining), not acoelomate (they do have a cavity, just an unlined one), and diploblastic is a germ-layer count, not a coelom classification at all — aschelminthes are triploblastic.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which statement about the notochord is correct, per NCERT?',
          options: [
            'It is an ectodermally derived structure that forms on the ventral side of the body',
            'It is a mesodermally derived, rod-like structure formed on the dorsal side during embryonic development',
            'Every animal from porifera to echinodermata possesses a notochord',
            'It only develops after birth, never during embryonic development',
          ],
          correct_index: 1,
          explanation: "NCERT defines the notochord as mesodermally derived, rod-like, and formed on the dorsal side during embryonic development — animals that form it are chordates. It is not ectodermal or ventral, porifera through echinodermata are exactly the non-chordates that never form one, and it forms during embryonic development, not after birth.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: "In the earthworm, the body shows external and internal division into segments with serial repetition of at least some organs. This phenomenon is called:",
          options: [
            'Diploblastic organisation, since two germ layers repeat along the body',
            'Coelom formation, since a mesoderm-lined cavity repeats along the body',
            'Acoelomate organisation, since no body cavity forms between the segments',
            'Metameric segmentation (metamerism)',
          ],
          correct_index: 3,
          explanation: "Serial repetition of body segments and organs is exactly NCERT's definition of metameric segmentation, or metamerism, using the earthworm as the example. It has nothing to do with germ-layer count (diploblastic is about ectoderm/endoderm only), coelom formation (a separate mesoderm-lining question), or acoelomate status (the earthworm is in fact coelomate, not acoelomate).",
          difficulty_level: 1,
        },
      ],
    },
  ],
};
