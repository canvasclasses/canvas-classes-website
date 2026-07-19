'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'skeletal-muscle-structure',
  title: 'The Structure of Skeletal Muscle',
  subtitle: "Zoom into one muscle until you reach the smallest working part — the sarcomere. Learn the striped banding pattern, which protein sits in which band, and the exact lines that box in a sarcomere, the way NEET quotes them.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['locomotion-and-movement', 'sarcomere'],
  glossary: [
    { term: 'fascia', definition: 'The common collagenous connective tissue layer that holds a group of muscle bundles (fascicles) together inside a skeletal muscle.' },
    { term: 'fascicle', definition: 'A muscle bundle — one of the many bundles that make up a skeletal muscle. Each fascicle contains many muscle fibres.' },
    { term: 'sarcolemma', definition: 'The plasma membrane that lines each muscle fibre and encloses its sarcoplasm.' },
    { term: 'sarcoplasm', definition: 'The cytoplasm of a muscle fibre, enclosed by the sarcolemma. It contains many nuclei and the parallel myofilaments.' },
    { term: 'syncytium', definition: 'A single cell containing many nuclei. A muscle fibre is a syncytium because its sarcoplasm holds many nuclei.' },
    { term: 'sarcoplasmic reticulum', definition: 'The endoplasmic reticulum of the muscle fibre. It is the store house of calcium ions.' },
    { term: 'myofibril', definition: 'One of the large number of parallel filaments (also called myofilaments) arranged in the sarcoplasm, each showing alternate dark and light bands.' },
    { term: 'sarcomere', definition: 'The portion of a myofibril between two successive Z-lines. It is the functional unit of contraction.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A cutaway of a human limb muscle glowing faintly in the dark, its fibres and stripes suggested without labels',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single long limb muscle, seen as if partly cut open, floating in deep darkness. From its surface you can sense the bundles of fibres running lengthwise, and on those fibres a faint repeating pattern of light and dark stripes, softly glowing, as if lit from within. No text, no labels, no leader lines, no callouts. Painterly, atmospheric, biological illustration style. Deep near-black background (#0a0a0a base tones) with warm reddish highlights on the muscle tissue. No people, no faces.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Every Muscle Is a Bundle of Bundles',
      markdown: "The muscle you flex in your arm is not one solid block of meat. Cut into it and you find it packed with smaller **bundles**, tied together like a fistful of drinking straws. Cut into one of those bundles and you find it is made of long **fibres**. Cut into one fibre and you find it stuffed with even finer **threads** — and each of those threads carries the striped pattern that makes muscle work. Skeletal muscle is a bundle of bundles, all the way down.",
    },
    // ── 2 · Core concept — fascicle → fibre → myofibril hierarchy ─────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Let's zoom in, one level at a time. Each organised skeletal muscle in your body is made of a number of **muscle bundles**, also called **fascicles**. These bundles are held together by a common connective tissue layer made of collagen, called the **fascia**. So the fascia is the wrapper; the fascicles are the bundles inside it.\n\nEach muscle bundle contains a number of **muscle fibres** — the muscle cells themselves. Each muscle fibre is lined by a plasma membrane called the **sarcolemma**, which encloses the fibre's cytoplasm, the **sarcoplasm**. One odd thing about a muscle fibre: its sarcoplasm contains **many nuclei**, not just one. A single cell with many nuclei like this is called a **syncytium**.\n\nInside the fibre, the endoplasmic reticulum has a special name — the **sarcoplasmic reticulum** — and a special job: it is the **store house of calcium ions**. Hold on to that; those calcium ions matter for contraction. Floating in the sarcoplasm is a large number of **parallel filaments**, called **myofilaments** or **myofibrils**. These are the threads that carry the stripes.",
    },
    // ── 3 · Heading — the banding pattern ─────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Banding Pattern — Why Muscle Looks Striped',
      objective: "By the end of this you can name the two proteins behind the stripes, and say exactly which one sits in the light band and which in the dark band.",
    },
    // ── 4 · Text — bands, actin/myosin, thin/thick ───────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Look at one myofibril closely and you see **alternate dark and light bands** running along it. That striped, striated look comes from just **two proteins** laid out in a repeating pattern — **actin** and **myosin**. Both are arranged as rod-like structures, lying parallel to each other and to the long axis of the myofibril.\n\nHere is the split you must lock in. The **light band** contains **actin** and is called the **I-band** (short for **Isotropic** band). The **dark band** contains **myosin** and is called the **A-band** (short for **Anisotropic** band). Actin filaments are **thinner** than myosin filaments — so actin is the **thin filament** and myosin is the **thick filament**.\n\nTwo more landmarks sit inside these bands. In the centre of each I-band is an elastic fibre called the **Z-line**, which **bisects** it (cuts it in half); the thin filaments are firmly attached to this Z-line. The thick filaments in the A-band are held together in the middle by a thin fibrous membrane called the **M-line**. The A and I bands are arranged **alternately** along the whole length of the myofibril.",
    },
    // ── 5 · Interactive image — sarcomere (Figure 17.2 style) ────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A labelled diagram of one sarcomere showing thick and thin filaments, the A-band, I-band, Z-lines, M-line and H-zone, with the sarcolemma and sarcoplasmic reticulum around the fibre',
      caption: '📸 Tap each dot to explore the parts of a sarcomere and the muscle fibre around it.',
      generation_prompt: "Scientific textbook illustration of one sarcomere of a skeletal muscle myofibril, in the style of NCERT Figure 17.2. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Show a horizontal repeating unit: two vertical Z-lines at the left and right marking the sarcomere boundaries, thin filaments (actin) attached to each Z-line and pointing inward, thicker filaments (myosin) in the central region, and a central M-line running vertically through the middle of the thick filaments. Mark the wide dark central region as the A-band, the lighter regions on either side (around each Z-line) as the I-band, and the central lighter gap of the thick filaments not overlapped by thin filaments as the H-zone. Above, show a small portion of the whole muscle fibre wrapped by its outer plasma membrane (sarcolemma) with a fine network of sarcoplasmic reticulum around the myofibrils. Clean white outlines, biologically accurate proportions. Use magenta/pink for the thin actin filaments and a warmer red/brown for the thick myosin filaments. No embedded text labels — leave the parts clean for interactive dots. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.50, y: 0.15, label: 'Sarcolemma', detail: "The plasma membrane lining the whole muscle fibre. It encloses the sarcoplasm, in which all the myofibrils sit.", icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.28, label: 'Sarcoplasmic reticulum', detail: "The endoplasmic reticulum of the muscle fibre — the **store house of calcium ions**.", icon: 'circle' },
        { id: uuid(), x: 0.19, y: 0.60, label: 'Z-line', detail: "An elastic fibre in the centre of each I-band that **bisects** it. The thin filaments are firmly attached to it. The stretch between two successive Z-lines is one sarcomere.", icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.60, label: 'I-band (light)', detail: "The **light** band, also called the **Isotropic** band. It contains **actin** — the thin filaments — and is bisected by the Z-line.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.60, label: 'A-band (dark)', detail: "The **dark** band, also called the **Anisotropic** band. It contains **myosin** — the thick filaments.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.74, label: 'H-zone', detail: "The central part of the thick filaments **not overlapped** by thin filaments. In a resting fibre, the thin filaments only partially overlap the free ends of the thick filaments, leaving this gap in the middle.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.87, label: 'M-line', detail: "A thin fibrous membrane in the middle of the A-band that holds the thick filaments together at their centre.", icon: 'circle' },
        { id: uuid(), x: 0.35, y: 0.44, label: 'Sarcomere', detail: "The portion of the myofibril **between two successive Z-lines**. It is the **functional unit of contraction**.", icon: 'circle' },
      ],
    },
    // ── 6 · Heading — the sarcomere ───────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'The Sarcomere — The Working Unit',
      objective: "By the end of this you can define a sarcomere by the two lines that box it in, say why it is called the functional unit, and describe what the H-zone is.",
    },
    // ── 7 · Text — sarcomere definition + resting overlap + H-zone ────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Now for the part that everything else has been building towards. Take the length of a myofibril and mark off the portion **between two successive Z-lines**. That single repeating segment is a **sarcomere** — and it is the **functional unit of contraction**. When a muscle shortens, it is these sarcomeres, lined up end to end, that do the work.\n\nLook at one sarcomere at rest. The thin filaments stick inward from each Z-line, and the thick filaments sit in the middle. The **edges of the thin filaments on either side partially overlap the free ends of the thick filaments** — but they don't reach all the way in. That leaves the **central part of the thick filaments not overlapped by any thin filament**. That un-overlapped central strip is called the **H-zone**. So the H-zone is a resting-state feature: it's the bit of thick filament that has no thin filament beside it yet.",
    },
    // ── 8 · Comparison card — A-band vs I-band ────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 8,
      title: 'A-band vs I-band',
      columns: [
        {
          heading: 'A-band (dark)',
          points: [
            'The DARK band',
            'Full name: Anisotropic band',
            'Contains myosin',
            'Myosin filaments are THICK (thick filaments)',
            'Holds the M-line in its middle',
          ],
        },
        {
          heading: 'I-band (light)',
          points: [
            'The LIGHT band',
            'Full name: Isotropic band',
            'Contains actin',
            'Actin filaments are THIN (thin filaments)',
            'Bisected in its centre by the Z-line',
          ],
        },
      ],
    },
    // ── 9 · Reasoning prompt — band / line identity check ─────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A student is labelling a myofibril. They point to the light band and have to say which protein is inside it and what structure sits at its centre. Which single statement gets BOTH of these right?",
      options: [
        "The light band (I-band) contains actin, and an elastic Z-line bisects it in its centre.",
        "The light band (A-band) contains myosin, and an M-line sits in its centre.",
        "The light band (I-band) contains myosin, and a Z-line bisects it in its centre.",
        "The light band (A-band) contains actin, and an H-zone sits in its centre.",
      ],
      reveal: "Option 1 is right on both counts. The light band is the **I-band** (Isotropic), it contains **actin** (the thin filament), and its centre is bisected by the elastic **Z-line**. The tempting trap is option 3 — it correctly calls the light band the I-band and correctly puts the Z-line at its centre, but it swaps the protein: the I-band holds actin, not myosin (myosin sits in the *dark* A-band). Options 2 and 4 make the deeper error of calling the light band the A-band, which is actually the dark band.",
      difficulty_level: 2,
    },
    // ── 10 · Remember callout ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Hierarchy:** skeletal muscle → **fascicles** (muscle bundles, held together by the collagenous **fascia**) → **muscle fibres** → **myofibrils**.\n- A **muscle fibre** is a **syncytium** — one cell, many nuclei — lined by the **sarcolemma**, filled with **sarcoplasm**.\n- The **sarcoplasmic reticulum** is the store house of **calcium ions (Ca²⁺)**.\n- **A-band = Dark = Anisotropic = Myosin = Thick** filament (holds the **M-line** in its middle).\n- **I-band = Light = Isotropic = Actin = Thin** filament (**bisected by the Z-line**).\n- Thin filaments (actin) attach firmly to the **Z-line**; thick filaments (myosin) are held at their centre by the **M-line**.\n- A **sarcomere** = the portion **between two successive Z-lines** = the **functional unit of contraction**.\n- **H-zone** = the central part of the thick filaments **not overlapped** by thin filaments (a resting-state gap).",
    },
    // ── 11 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Never mix up the two bands.** NEET loves swapping them: **A-band is DARK and holds MYOSIN (thick)**; **I-band is LIGHT and holds ACTIN (thin)**. A quick memory hook — the letter shapes hide the answer: think **A**nisotropic = **A**-band = dark, and both actin and the I-band are the *thin, light* pair.\n\n**Know the two lines apart:** the **Z-line** sits in the I-band (bisects it, anchors the thin filaments); the **M-line** sits in the A-band (holds the thick filaments in the middle).\n\n**Classic NEET question:** \"The functional unit of contraction is the ___\" → **sarcomere** (the portion of a myofibril between two successive Z-lines). And its partner: \"The I-band contains ___\" → **actin**.",
    },
    // ── 12 · Bridge text ──────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "You can now zoom from a whole muscle down to a single sarcomere and name every band and line inside it. Next, we open up those two proteins — actin and myosin — and see the exact machinery inside each contractile filament that lets a sarcomere shorten.",
    },
    // ── 13 · Inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "A muscle fibre is described as a syncytium. What does that mean?",
          options: [
            "Its sarcoplasm contains many nuclei inside a single cell",
            "It is made of many separate cells fused only at their membranes",
            "It has no nucleus at all, like a mature red blood cell",
            "It contains a single very large nucleus that controls the whole fibre",
          ],
          correct_index: 0,
          explanation: "NCERT says the muscle fibre is a syncytium because its sarcoplasm contains many nuclei — one cell, many nuclei. It is not many separate fused cells, it is not without a nucleus, and it does not have just one big nucleus.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which structure inside the muscle fibre is the store house of calcium ions?",
          options: [
            "The sarcoplasmic reticulum",
            "The sarcolemma",
            "The M-line",
            "The Z-line",
          ],
          correct_index: 0,
          explanation: "The endoplasmic reticulum of the muscle fibre — the sarcoplasmic reticulum — is the store house of calcium ions. The sarcolemma is the outer plasma membrane, and the M-line and Z-line are structural markers in the myofibril, not calcium stores.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which pairing correctly matches a band with the protein and filament type inside it?",
          options: [
            "A-band → myosin → thick filament",
            "A-band → actin → thin filament",
            "I-band → myosin → thick filament",
            "I-band → actin → thick filament",
          ],
          correct_index: 0,
          explanation: "The dark A-band contains myosin, and myosin filaments are the thick filaments — so option 1 is correct on all three counts. The I-band contains actin, and actin is the thin filament; every other option either puts the wrong protein in the band or wrongly calls actin a thick filament.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "How is a sarcomere defined, and what is the H-zone?",
          options: [
            "A sarcomere is the portion of a myofibril between two successive Z-lines; the H-zone is the central part of the thick filaments not overlapped by thin filaments",
            "A sarcomere is the portion between two successive M-lines; the H-zone is the region where thin filaments attach to the Z-line",
            "A sarcomere is a single thick filament; the H-zone is the light band that contains actin",
            "A sarcomere is the whole muscle fibre; the H-zone is the connective tissue wrapping the fascicles",
          ],
          correct_index: 0,
          explanation: "A sarcomere runs between two successive Z-lines and is the functional unit of contraction; the H-zone is the central strip of the thick filaments left un-overlapped by thin filaments in the resting state. Option 2 wrongly uses M-lines as the boundary, option 3 shrinks the sarcomere to a single filament, and option 4 confuses it with the whole fibre and the fascia.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
