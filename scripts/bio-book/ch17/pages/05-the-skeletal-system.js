'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-skeletal-system',
  title: 'The Skeletal System — Axial & Appendicular',
  subtitle: "206 bones, split into two teams: 80 that run down the body's central axis, and the rest that hang off it as limbs and girdles. Learn the split, the counts, and the exact rib and vertebra numbers NEET tests every year.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['locomotion-and-movement', 'skeleton'],
  glossary: [
    { term: 'skeletal system', definition: 'The framework of bones and a few cartilages that gives the body its shape and makes movement possible. In humans it is made of 206 bones.' },
    { term: 'axial skeleton', definition: 'The 80 bones distributed along the main axis of the body — the skull, vertebral column, sternum and ribs.' },
    { term: 'appendicular skeleton', definition: 'The bones of the limbs together with their girdles (pectoral and pelvic), which attach the limbs to the axial skeleton.' },
    { term: 'ear ossicles', definition: 'Three tiny bones — malleus, incus and stapes — present in each middle ear.' },
    { term: 'vertebral column', definition: 'A dorsally placed column of 26 serially arranged vertebrae, extending from the base of the skull, that protects the spinal cord and supports the head.' },
    { term: 'atlas', definition: 'The first vertebra of the vertebral column; it articulates with the two occipital condyles of the skull.' },
    { term: 'true ribs', definition: 'The first seven pairs of ribs, attached dorsally to the thoracic vertebrae and ventrally to the sternum by hyaline cartilage.' },
    { term: 'acetabulum', definition: 'The cavity in each coxal bone, formed where the ilium, ischium and pubis fuse, into which the head of the femur (thigh bone) fits.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A full human skeleton standing upright in a dark space, softly lit so the central spine and skull glow slightly warmer than the outstretched limbs',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single complete human skeleton stands upright, facing forward, centred in an otherwise dark, empty space. Soft warm light falls along the central axis — the skull, the long vertebral column, and the rib cage — making that central line glow slightly more than the arms and legs, which fade gently into shadow at the edges of the frame. Anatomically accurate proportions. Deep shadows fill the rest of the frame. Painterly, atmospheric, reverent illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram callouts, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Smallest Bone In Your Body Is Inside Your Ear',
      markdown: "When people picture bones, they think of the big ones — the thigh bone, the skull. But three of your bones are so small they sit hidden inside each middle ear: the **malleus, incus and stapes**. The stapes is the tiniest bone you own. All 206 bones matter equally to the count, whether it's the massive femur in your thigh or these three specks that let you hear.",
    },
    // ── 2 · Core concept — bone vs cartilage, 206 bones ──────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The **skeletal system** is a framework of **bones and a few cartilages**. Try to imagine chewing food without jaw bones, or walking around without your limb bones — the whole system is what makes the movements of the body possible in the first place.\n\nBoth **bone** and **cartilage** are **specialised connective tissues**, and the difference between them is the matrix they're made of. **Bone has a very hard matrix, because of the calcium salts in it.** **Cartilage has a slightly pliable (bendable) matrix, because of the chondroitin salts in it.** That's why bone is rigid and cartilage can flex a little.\n\nIn human beings, the skeletal system is made of **206 bones** and a few cartilages. Those 206 bones are split into **two principal divisions** — the **axial skeleton** and the **appendicular skeleton**.",
    },
    // ── 3 · Heading — Axial skeleton ─────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Axial Skeleton — 80 Bones Down the Central Axis',
      objective: "By the end of this you can list the four parts of the axial skeleton, give the exact bone count for each, and recite the five vertebral regions with their numbers.",
    },
    // ── 4 · Text — axial overview + skull ────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The **axial skeleton** is the **80 bones** arranged along the **main axis of the body** — the central line running from your head down through your trunk. Four structures make it up: the **skull, vertebral column, sternum and ribs**.\n\nStart with the **skull**, which is **22 bones** in total, built from two sets. The first set is the **8 cranial bones** — they form the hard protective outer covering, the **cranium**, around the brain. The second set is the **14 facial bones**, which form the front part of the skull. Below them, a single **U-shaped bone called the hyoid** sits at the base of the buccal cavity (the mouth). And each middle ear holds the three **ear ossicles — malleus, incus and stapes**.\n\nThe skull doesn't just sit on the spine — it **articulates** (joins) with the vertebral column through **two occipital condyles**. Because there are two of these knobs, the human skull is called **dicondylic**.",
    },
    // ── 5 · Interactive image — labelled skeleton, axial vs appendicular ──────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A full human skeleton diagram with the central axial bones tinted one colour and the limb and girdle bones tinted another, showing the axial vs appendicular split',
      caption: '📸 Tap each dot to explore whether a bone belongs to the axial or the appendicular skeleton.',
      generation_prompt: "Scientific textbook illustration of a full front-facing human skeleton, showing the whole body. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions. Tint the AXIAL bones — skull, vertebral column, rib cage and sternum, running down the central axis — in a warm tan/bone colour. Tint the APPENDICULAR bones — the arm bones, leg bones, the pectoral girdle (shoulder) and the pelvic girdle (hip) — in a cool blue-grey. No text labels baked into the image (labels are added as interactive hotspots). No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.06, label: 'Skull — AXIAL', detail: 'The skull is **22 bones** (8 cranial forming the cranium around the brain + 14 facial). Part of the **axial** skeleton.', icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.30, label: 'Vertebral column — AXIAL', detail: '**26 vertebrae** running down the central axis, protecting the spinal cord. **Axial** skeleton.', icon: 'circle' },
        { id: uuid(), x: 0.42, y: 0.24, label: 'Rib cage — AXIAL', detail: '**12 pairs of ribs** plus the thoracic vertebrae and sternum together form the rib cage. **Axial** skeleton.', icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.20, label: 'Sternum — AXIAL', detail: 'A flat bone on the ventral midline of the thorax. **Axial** skeleton.', icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.19, label: 'Pectoral girdle — APPENDICULAR', detail: 'Each half = a **clavicle + a scapula**. It attaches the arm to the axis. **Appendicular** skeleton.', icon: 'circle' },
        { id: uuid(), x: 0.22, y: 0.42, label: 'Forelimb (arm) — APPENDICULAR', detail: 'Humerus, radius, ulna, carpals, metacarpals and phalanges — **30 bones** per limb. **Appendicular** skeleton.', icon: 'circle' },
        { id: uuid(), x: 0.42, y: 0.52, label: 'Pelvic girdle — APPENDICULAR', detail: 'Two **coxal bones**, each fused from ilium + ischium + pubis. Attaches the leg to the axis. **Appendicular** skeleton.', icon: 'circle' },
        { id: uuid(), x: 0.40, y: 0.78, label: 'Hindlimb (leg) — APPENDICULAR', detail: 'Femur (the longest bone), tibia, fibula, tarsals, metatarsals and phalanges. **Appendicular** skeleton.', icon: 'circle' },
      ],
    },
    // ── 6 · Table — axial skeleton counts ────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 6,
      caption: 'The axial skeleton, part by part — the four counts add up to 80',
      headers: ['Part', 'Number', 'Note'],
      rows: [
        ['Skull', '22 bones', '8 cranial (cranium, around the brain) + 14 facial'],
        ['Vertebral column', '26 bones', '26 serially arranged vertebrae; first one = atlas'],
        ['Sternum', '1 bone', 'Flat bone on the ventral midline of the thorax'],
        ['Ribs', '12 pairs', 'Each rib is bicephalic (two articulation surfaces)'],
        ['Total (axial)', '80 bones', 'The rest of the 206 are appendicular'],
      ],
    },
    // ── 7 · Text — vertebral column detail ───────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "The **vertebral column** is formed by **26 serially arranged units called vertebrae**, placed dorsally (along your back). It runs from the base of the skull down through the trunk. Each vertebra has a hollow central portion — the **neural canal** — and the **spinal cord passes through** it, which is how the column protects the cord.\n\nThe **first vertebra is the atlas**, and it's the one that articulates with the occipital condyles of the skull. Going down from the skull, the column is divided into five regions: **cervical (7)**, **thoracic (12)**, **lumbar (5)**, **sacral (1, fused)** and **coccygeal (1, fused)**. One fact worth pinning down: the **number of cervical vertebrae is seven in almost all mammals** — a giraffe's long neck and a human neck both have exactly seven.",
    },
    // ── 8 · Table — vertebral regions ────────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 8,
      caption: 'The five regions of the vertebral column, top to bottom — they add up to 26',
      headers: ['Region', 'Number', 'Position'],
      rows: [
        ['Cervical', '7', 'Neck — the same 7 in almost all mammals'],
        ['Thoracic', '12', 'Chest — the ribs attach here'],
        ['Lumbar', '5', 'Lower back'],
        ['Sacral', '1 (fused)', 'Pelvis region'],
        ['Coccygeal', '1 (fused)', 'Tail-end (coccyx)'],
      ],
    },
    // ── 9 · Text — sternum + ribs ─────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "The **sternum** is a single **flat bone on the ventral midline of the thorax** — the breastbone running down the front-centre of your chest.\n\nThere are **12 pairs of ribs**. Each rib is a thin flat bone connected **dorsally to the vertebral column** and **ventrally to the sternum**. On its dorsal (back) end it has **two articulation surfaces**, which is why each rib is called **bicephalic** (\"two-headed\"). But the ribs aren't all attached the same way at the front, and that gives us three types. Finally, the **thoracic vertebrae, the ribs, and the sternum together form the rib cage** — the protective basket around your heart and lungs.",
    },
    // ── 10 · Comparison card — true vs false vs floating ribs ─────────────────
    {
      id: uuid(), type: 'comparison_card', order: 10,
      title: 'True vs False vs Floating Ribs',
      columns: [
        {
          heading: 'True ribs (1st–7th pairs)',
          points: [
            'First 7 pairs',
            'Attached dorsally to the thoracic vertebrae',
            'Attached ventrally to the sternum directly, by hyaline cartilage',
          ],
        },
        {
          heading: 'Vertebrochondral / False ribs (8th–10th pairs)',
          points: [
            '3 pairs: the 8th, 9th and 10th',
            'Do NOT reach the sternum directly',
            'Join the 7th rib in front, by hyaline cartilage',
          ],
        },
        {
          heading: 'Floating ribs (11th–12th pairs)',
          points: [
            'Last 2 pairs: the 11th and 12th',
            'Not connected ventrally at all',
            'Left free at the front — hence "floating"',
          ],
        },
      ],
    },
    // ── 11 · Heading — Appendicular skeleton ─────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 11, level: 2,
      text: 'The Appendicular Skeleton — Limbs and Their Girdles',
      objective: "By the end of this you can name the bones of the fore and hind limbs, identify the longest bone, and describe what the pectoral and pelvic girdles are each built from.",
    },
    // ── 12 · Text — limbs ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "The **appendicular skeleton** is the bones of the **limbs along with their girdles**. Each **limb is made of 30 bones**.\n\nThe **forelimb (hand/arm)** has: the **humerus** (upper arm), then the **radius and ulna** (forearm), then the **carpals** (wrist bones — **8**), the **metacarpals** (palm bones — **5**), and the **phalanges** (finger bones/digits — **14**).\n\nThe **hindlimb (leg)** has: the **femur** — the thigh bone, and the **longest bone in the body** — then the **tibia and fibula** (shin), the **tarsals** (ankle bones — **7**), the **metatarsals** (**5**), and the **phalanges** (toe bones/digits — **14**). One extra bone sits at the knee: a cup-shaped bone called the **patella**, the kneecap, covering the knee from the front.",
    },
    // ── 13 · Text — girdles ───────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "The **girdles** are what fasten the limbs onto the axial skeleton. Each girdle is made of two halves.\n\nEach half of the **pectoral girdle** (the shoulder) is a **clavicle and a scapula**. The **scapula** is a large triangular flat bone on the back of the thorax; it carries a depression called the **glenoid cavity**, into which the **head of the humerus** fits to form the **shoulder joint**. The **clavicle** is the long slender bone commonly called the **collar bone**.\n\nThe **pelvic girdle** (the hip) is made of **two coxal bones**. Each coxal bone is itself formed by the **fusion of three bones — ilium, ischium and pubis**. At the point where those three fuse is a cavity called the **acetabulum**, into which the **head of the femur** fits. The two halves of the pelvic girdle meet at the front to form the **pubic symphysis**.",
    },
    // ── 14 · Reasoning prompt — bone-classification check ─────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 14, reasoning_type: 'logical',
      prompt: "A friend points at their 9th pair of ribs and says, \"These attach straight to the breastbone, so they're true ribs.\" One thing in that sentence is wrong. Which correction is right?",
      options: [
        "The 9th pair are false (vertebrochondral) ribs — they don't reach the sternum directly, they join the 7th rib by cartilage.",
        "The 9th pair are floating ribs — they aren't connected ventrally at all.",
        "The 9th pair are true ribs, but they attach to the vertebral column at the front, not the sternum.",
        "The 9th pair attach directly to the sternum, so the friend is completely correct.",
      ],
      reveal: "The first option is right. Only the first 7 pairs are true ribs that attach directly to the sternum. The 8th, 9th and 10th pairs are vertebrochondral (false) ribs — they don't reach the sternum directly; instead they join the 7th rib by hyaline cartilage. The tempting wrong answer is 'floating ribs', but those are only the last 2 pairs (11th and 12th), which aren't connected ventrally at all — the 9th pair IS connected ventrally, just indirectly, so it can't be floating.",
      difficulty_level: 2,
    },
    // ── 15 · Remember callout ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 15, variant: 'remember',
      title: 'Lock These Numbers In',
      markdown: "- **206 bones total = axial 80 + appendicular** (the rest).\n- **Skull = 22** → **8 cranial + 14 facial**. Ear ossicles = **malleus, incus, stapes** (3 per middle ear).\n- **Vertebral column = 26**. Regions top-to-bottom: **cervical 7 / thoracic 12 / lumbar 5 / sacral 1 / coccygeal 1**. First vertebra = **atlas**.\n- **Ribs = 12 pairs**, each **bicephalic**. **True 1–7** (to sternum directly) · **False 8–10** (join 7th rib) · **Floating 11–12** (not connected in front).\n- **Femur = the longest bone.** Each limb = **30 bones**.\n- **Pectoral girdle** (each half) = **clavicle + scapula** (scapula's **glenoid cavity** takes the humerus).\n- **Pelvic girdle** = **2 coxal bones**, each = **ilium + ischium + pubis** (fused; the **acetabulum** takes the femur).",
    },
    // ── 16 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 16, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Number traps NEET loves:** skull = **22** bones, axial = **80**, total = **206**, vertebral column = **26**, and the vertebral region split **7/12/5/1/1**. Learn these as exact figures — the wrong options are always the neighbouring numbers (21, 24, 8+12, etc.).\n\n**Rib classification is a repeat favourite:** true (1–7), vertebrochondral/false (8–10), floating (11–12). Being asked to classify a specific rib pair — or which pairs are \"floating\" — is a classic single-line question.\n\n**Classic NEET question:** \"The number of bones in the human skull is ___.\" → **22.** And a close sibling: \"Floating ribs are the ___ pairs.\" → the **11th and 12th**.",
    },
    // ── 17 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 17,
      markdown: "You've now got the full frame — 206 bones, split axial (80) and appendicular, with every count and rib type in place. But a skeleton on its own can't move: bones only bend where two of them meet. Next, you'll look at the **joints** that connect these bones, and the **disorders** that affect the skeletal system.",
    },
    // ── 18 · Inline quiz (LAST) ──────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 18, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "How are the 206 bones of the human skeletal system divided, and how many are in each division?",
          options: [
            "Axial 80 bones (skull, vertebral column, sternum, ribs) and the appendicular skeleton (limbs and girdles) making up the rest",
            "Axial 120 bones (limbs and girdles) and appendicular 86 bones (skull and vertebral column)",
            "Cranial 22 bones and facial 184 bones, split evenly down the body's midline",
            "True skeleton 100 bones and false skeleton 106 bones, based on which ones bear weight",
          ],
          correct_index: 0,
          explanation: "The 206 bones split into the axial skeleton — 80 bones along the main axis (skull, vertebral column, sternum, ribs) — and the appendicular skeleton, the limbs plus their girdles. Option 2 swaps which division holds the limbs (that's appendicular, not axial) and invents an 86. Options 3 and 4 are made-up groupings NCERT never uses.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "The vertebral column has 26 vertebrae. Which region-count listing is correct, from the skull downward?",
          options: [
            "Cervical 12, thoracic 7, lumbar 5, sacral 1, coccygeal 1",
            "Cervical 7, thoracic 12, lumbar 5, sacral 1, coccygeal 1",
            "Cervical 7, thoracic 5, lumbar 12, sacral 1, coccygeal 1",
            "Cervical 5, thoracic 12, lumbar 7, sacral 1, coccygeal 1",
          ],
          correct_index: 1,
          explanation: "The correct order from the skull down is cervical 7, thoracic 12, lumbar 5, sacral 1 (fused), coccygeal 1 (fused) — adding to 26. The tempting trap is option 1, which swaps the cervical and thoracic numbers; remember it's 7 in the neck (the same 7 in almost all mammals) and 12 in the chest where the ribs attach.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which statement about the ribs is correct?",
          options: [
            "There are 12 pairs; the 8th–10th pairs are true ribs attached directly to the sternum",
            "There are 10 pairs; each rib is monocephalic with a single articulation surface",
            "There are 12 pairs; each rib is bicephalic, the first 7 pairs are true ribs, and the last 2 pairs (11th–12th) are floating ribs",
            "There are 12 pairs; the floating ribs are the 8th–10th pairs, which join the 7th rib by cartilage",
          ],
          correct_index: 2,
          explanation: "There are 12 pairs of ribs, each bicephalic (two dorsal articulation surfaces). The first 7 pairs are true ribs (to the sternum directly), and the last 2 pairs, the 11th and 12th, are floating (not connected ventrally). Option 1 wrongly calls the 8th–10th 'true' — they're false/vertebrochondral. Option 4 mislabels those same 8th–10th as 'floating' — floating means the 11th–12th only.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which pairing of a girdle with the bones that form it is correct?",
          options: [
            "Each half of the pectoral girdle = clavicle + scapula; each coxal bone of the pelvic girdle = ilium + ischium + pubis fused",
            "Each half of the pectoral girdle = ilium + ischium + pubis; each coxal bone = clavicle + scapula",
            "Each half of the pectoral girdle = scapula + acetabulum; the pelvic girdle = two glenoid cavities",
            "Each half of the pectoral girdle = clavicle only; the pelvic girdle = a single fused coxal bone",
          ],
          correct_index: 0,
          explanation: "Each half of the pectoral girdle is a clavicle plus a scapula, and each coxal bone of the pelvic girdle is the ilium, ischium and pubis fused together. Option 2 swaps the two girdles' components entirely. Option 3 confuses the sockets — the glenoid cavity (shoulder) and acetabulum (hip) are cavities that receive limb bones, not bones that build the girdle. Option 4 leaves out the scapula and wrongly makes the pelvis a single bone (it's two coxal bones).",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
