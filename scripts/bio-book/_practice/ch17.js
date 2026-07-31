'use strict';
// Class 11 Biology — Ch.17 — "Practice — NCERT Exercises" page.
// SNAPSHOT of the live, already-inserted page (regenerated to fix a
// non-idempotency bug: the original module called uuid() at require() time,
// so every re-save looked like a full block removal+addition to book-writer's
// content-loss guard. This module carries the exact ids currently live in
// Mongo, so re-running insert_practice_pages.js against it is a true no-op.
module.exports = {
  "slug": "ch17-practice-ncert-exercises",
  "title": "Practice — NCERT Exercises",
  "subtitle": "All 10 NCERT textbook exercises for the chapter, grouped into 4 revision themes with full worked solutions.",
  "page_type": "lesson",
  "tags": [
    "ncert-exercises",
    "practice"
  ],
  "blocks": [
    {
      "id": "61bd64af-e4f9-4c14-a654-4c7405c34e06",
      "type": "image",
      "order": 0,
      "src": "",
      "alt": "A glowing sarcomere with its actin and myosin filaments on the left, dissolving into the outline of a human skeleton with a highlighted rib cage and joint on the right, against a dark background",
      "caption": "",
      "width": "full",
      "aspect_ratio": "16:5",
      "generation_prompt": "Scientific textbook illustration, wide landscape banner, flat 2D educational diagram on a dark background (#0a0a0a near-black). Left half: a single sarcomere of skeletal muscle shown schematically — thin actin filaments and thick myosin filaments arranged in parallel rows between two Z-lines, with a visible A-band, I-band and central H-zone, rendered in soft warm oranges and creams. Right half: a simplified human skeleton silhouette in cool bone-white, with the rib cage and one limb joint subtly highlighted to suggest bones and joints. The two halves blend smoothly into each other at the centre of the image. Clean white outlines, muted natural tones, biologically accurate schematic proportions, no photorealism, no cartoon, matches standard biology textbook illustration conventions. No text, no labels, no leader lines, no pointer lines of any kind anywhere in the image."
    },
    {
      "id": "e3bcb081-4a05-4a61-8bf5-9cf11705959a",
      "type": "text",
      "order": 1,
      "markdown": "You've read the chapter — now drill it. Below are **all 10 NCERT exercises** for *Locomotion and Movement*, pulled out of the textbook's running order and re-sorted into four revision themes: the basics of movement and muscle, the sarcomere and how it slides, the skeleton and its joints, and a mixed recap of true/false, match-the-column and fill-in-the-blank questions.\n\nTry to answer each one in your head (or on paper) before you open the solution. The worked answer is written to *teach* the whole idea, not just tick the box — so even a question you get right is worth reading through."
    },
    {
      "id": "466957ff-b9d5-46f6-8367-a94a452e5a2a",
      "type": "practice_bank",
      "order": 2,
      "title": "NCERT Exercises 17.1–17.10",
      "intro": "Every end-of-chapter exercise, regrouped into four revision themes. Each carries a one-line answer for a quick self-check and a full worked solution.",
      "sections": [
        {
          "id": "s1-movement-and-muscle-basics",
          "title": "Movement and Muscle at a Glance",
          "blurb": "The three ways a cell moves, telling skeletal from cardiac muscle, and three head-to-head comparisons NCERT asks for directly.",
          "items": [
            {
              "kind": "numerical",
              "id": "6542d1d8-fcef-42f2-9a00-8efc5e77dec7",
              "source": "ncert_exercise",
              "source_label": "NCERT 17.7",
              "prompt": "What are the different types of movements exhibited by the cells of human body?",
              "answer": "Three types: amoeboid (macrophages/leucocytes, via pseudopodia), ciliary (ciliated tubular organs like the trachea and the female reproductive tract), and muscular (limbs, jaws, tongue).",
              "solution": "Cells of the human body show **three main types of movement**, and each one works by a completely different mechanism.\n\n**1. Amoeboid movement** — crawling. Certain specialised cells in our body, namely **macrophages** and **leucocytes** in the blood, move exactly the way an *Amoeba* does. The cell pushes out **pseudopodia** (false feet), formed by the **streaming of protoplasm** inside the cell. Cytoskeletal elements called **microfilaments** are also involved in producing this movement.\n\n**2. Ciliary movement** — the beating of tiny hairs. This occurs in most of our **internal tubular organs**, which are lined by **ciliated epithelium**. Two jobs to remember: the coordinated beating of cilia in the **trachea** helps remove **dust particles and foreign substances** that we inhale with the air, and the **passage of ova** through the female reproductive tract is also helped along by ciliary movement.\n\n**3. Muscular movement** — moving the big parts. The movement of our **limbs, jaws, tongue**, and so on requires muscles, using their **contractile property**. But muscle never acts alone here — **locomotion requires a perfectly coordinated activity of the muscular, skeletal, and neural systems** working together."
            },
            {
              "kind": "numerical",
              "id": "a7ffb856-2126-4050-a35e-0a696f6da655",
              "source": "ncert_exercise",
              "source_label": "NCERT 17.8",
              "prompt": "How do you distinguish between a skeletal muscle and a cardiac muscle?",
              "answer": "Both are striated, but skeletal muscle is voluntary and attached to bones for locomotion/posture, while cardiac muscle is involuntary, made of branching cells, and found only in the heart.",
              "solution": "Skeletal and cardiac muscle share one feature — both are **striated** in appearance — but they differ in every other way that matters.\n\n| Feature | Skeletal muscle | Cardiac muscle |\n|---|---|---|\n| Appearance | Striated | Striated |\n| Control | **Voluntary** — under the will of the nervous system | **Involuntary** — not under voluntary control |\n| Location | Closely associated with, and attached to, the **skeletal components** of the body (bones) | The muscle of the **heart**, found only there |\n| Cell arrangement | Long fibres bundled into fascicles; each fibre is a multi-nucleate **syncytium** | Cells assemble in a **branching pattern** |\n| Job | **Locomotion** and changes of body posture | The contraction of the **heart** |\n\nSo the giveaway is never the stripes — both have them. It's **control and location**: a muscle you can consciously flex, sitting on a bone, is skeletal; a muscle that beats on its own, only in the heart, with cells that branch into each other, is cardiac."
            },
            {
              "kind": "numerical",
              "id": "0719db25-d61b-497f-b944-d01b0b0ca2fc",
              "source": "ncert_exercise",
              "source_label": "NCERT 17.5",
              "prompt": "Write the difference between :\n(a) Actin and Myosin\n(b) Red and White muscles\n(c) Pectoral and Pelvic girdle",
              "answer": "Actin is the thin, G-actin-built filament with troponin/tropomyosin; myosin is the thick, ATPase-headed filament. Red fibres are myoglobin-rich and aerobic; white fibres are pale and anaerobic. The pectoral girdle (clavicle + scapula) hangs the arms; the pelvic girdle (2 fused coxal bones) hangs the legs.",
              "solution": "**(a) Actin vs Myosin**\n\n| Feature | Actin | Myosin |\n|---|---|---|\n| Filament type | **Thin** filament | **Thick** filament |\n| Built from | Two **F-actins** (each a polymer of **G-actin** monomers) wound helically | Many **meromyosin** monomers polymerised together |\n| Extra proteins riding on it | **Tropomyosin** (two filaments, running along its length) + **troponin** (at regular intervals) | None — but its head has a special role (see below) |\n| Resting-state role | At rest, a **troponin** subunit masks its myosin-binding sites | The globular head (**HMM**) is an **ATPase enzyme** with sites for ATP and for actin |\n| Band it sits in | **I-band** (light) | **A-band** (dark) |\n\n**(b) Red vs White muscle**\n\n| Feature | Red fibres | White fibres |\n|---|---|---|\n| Myoglobin | High — gives the red colour | Very little — pale/whitish |\n| Mitochondria | Plenty | Few |\n| Sarcoplasmic reticulum | — | High amount |\n| Energy pathway | **Aerobic** (uses stored oxygen) | **Anaerobic** |\n\n**(c) Pectoral vs Pelvic girdle**\n\n| Feature | Pectoral girdle | Pelvic girdle |\n|---|---|---|\n| Each half made of | A **clavicle + a scapula** | A **coxal bone** (ilium + ischium + pubis fused) |\n| Socket for the limb | **Glenoid cavity** on the scapula, takes the head of the **humerus** | **Acetabulum**, takes the head of the **femur** |\n| Where the two halves meet | Not fused at the front (separate clavicles) | Meet at the front at the **pubic symphysis** |\n| What it hangs | The forelimb (arm) | The hindlimb (leg) |"
            }
          ]
        },
        {
          "id": "s2-sarcomere-and-sliding",
          "title": "The Sarcomere and the Sliding Filament Theory",
          "blurb": "What a sarcomere actually looks like, the theory that explains contraction, and the exact chain of steps that fires it.",
          "items": [
            {
              "kind": "numerical",
              "id": "627d1809-1ab7-49c7-93d0-447cc953ddf0",
              "source": "ncert_exercise",
              "source_label": "NCERT 17.1",
              "prompt": "Draw the diagram of a sarcomere of skeletal muscle showing different regions.",
              "answer": "One sarcomere runs Z-line → half I-band → A-band (with the H-zone and its central M-line) → half I-band → the next Z-line.",
              "solution": "We can't draw here, so build the picture in words, left to right, exactly the way the chapter lays it out.\n\nA **sarcomere** is the portion of a myofibril **between two successive Z-lines** — the **functional unit of contraction**. Start at the left **Z-line**. This elastic fibre sits in the **centre of an I-band** and bisects it; the thin (actin) filaments are firmly attached to it and project inward from it.\n\nMoving inward, you're still in the **I-band** — the **light** band, made only of the thin actin filaments (this is the *half* of the I-band that belongs to our sarcomere; the other half of the same I-band belongs to the neighbouring sarcomere, on the far side of this Z-line).\n\nContinue inward and you enter the **A-band** — the **dark** band, made of the thick myosin filaments. Near its edges, the thin filaments (coming in from both Z-lines) partially overlap the thick filaments. But right in the **middle of the A-band** is a region the thin filaments never reach — the **H-zone**, the central part of the thick filaments with no thin filament beside it. And right in the centre of that H-zone is the **M-line**, a thin fibrous membrane that holds the thick filaments together at their middle.\n\nThe pattern is then a **mirror image** going back out: the other half of the A-band (with overlap resuming), then the other half of the I-band, ending at the **next Z-line** — which marks the end of this sarcomere and the start of the next one.\n\n**So, in order, one full sarcomere reads:** Z-line — I-band (half) — A-band edge (overlap) — H-zone — M-line — H-zone — A-band edge (overlap) — I-band (half) — Z-line."
            },
            {
              "kind": "numerical",
              "id": "99501ad2-b241-40b2-a1b6-6d14660ec017",
              "source": "ncert_exercise",
              "source_label": "NCERT 17.2",
              "prompt": "Define sliding filament theory of muscle contraction.",
              "answer": "Contraction happens because the thin (actin) filaments slide over the thick (myosin) filaments, increasing their overlap — no individual filament changes length.",
              "solution": "The **sliding filament theory** states one clean thing: the contraction of a muscle fibre takes place by the **sliding of the thin filaments over the thick filaments**.\n\nDon't picture a muscle contracting the way rubber gets squeezed. Picture two overlapping combs. The thin (actin) and thick (myosin) filaments are already partly overlapped when the muscle is relaxed. During contraction, the thin filaments are dragged further in, deeper across the thick ones — more overlap, more shortening. Crucially, **not a single filament inside the sarcomere actually gets shorter**: the thick filaments stay their length and the thin filaments stay their length. The whole fibre shortens purely because the two sets of filaments slide past each other and overlap more.\n\nThis is why, during contraction, the **I-band gets reduced** (less of the thin filament is left un-overlapped) while the **A-band's length stays exactly the same** (the thick filaments themselves haven't changed at all) — the tell-tale sign that it's sliding, not shrinking, that shortens the muscle."
            },
            {
              "kind": "numerical",
              "id": "e3a054ff-7080-4276-ba31-206ea7347423",
              "source": "ncert_exercise",
              "source_label": "NCERT 17.3",
              "prompt": "Describe the important steps in muscle contraction.",
              "answer": "Nerve signal → acetylcholine → action potential in the sarcolemma → Ca2+ released → Ca2+ unmasks actin's myosin-binding sites → cross bridge forms and pulls (power stroke) → ATP breaks the bridge and the cycle repeats → Ca2+ pumped back → relaxation.",
              "solution": "Muscle contraction is a chain reaction — one step's output triggers the next. Here it is, in order, exactly as it runs:\n\n1. **A signal starts in the CNS** and travels down a **motor neuron**. One motor neuron, together with all the muscle fibres it connects to, is called a **motor unit**.\n2. The motor neuron meets the muscle fibre at the **neuromuscular junction** (the motor-end plate), where it releases the neurotransmitter **acetylcholine**.\n3. Acetylcholine generates an **action potential** in the **sarcolemma**, which spreads through the whole fibre.\n4. That action potential causes the release of **Ca²⁺ ions** into the **sarcoplasm** (they come from the sarcoplasmic reticulum, the fibre's calcium store house).\n5. The rise in Ca²⁺ makes calcium **bind to a subunit of troponin** on the actin filament, which **removes the masking** of actin's myosin-binding sites.\n6. Using energy from **ATP hydrolysis**, the **myosin head** binds the now-exposed site on actin, forming a **cross bridge**.\n7. The head performs a **power stroke** — it pivots and **pulls the actin filament toward the centre of the A-band**, dragging the attached **Z-line inward**. This is what shortens the **sarcomere**.\n8. Myosin releases **ADP and Pi**; a **new ATP binds** the head, and the **cross bridge breaks**. That fresh ATP is hydrolysed again, and steps 6–8 **repeat**, causing further sliding — one power stroke isn't enough on its own.\n9. This keeps going as long as the calcium signal continues. **Relaxation** happens once **Ca²⁺ is pumped back** into the sarcoplasmic cisternae: the actin sites get **re-masked**, the **Z-lines return** to their original position, and the fibre relaxes."
            }
          ]
        },
        {
          "id": "s3-skeleton-and-joints",
          "title": "The Skeleton and Its Joints",
          "blurb": "Naming the exact joint type at six named locations in the body, using the same movement-based criteria the chapter taught.",
          "items": [
            {
              "kind": "numerical",
              "id": "497800f6-b64b-4c1a-86a0-07bd312caf07",
              "source": "ncert_exercise",
              "source_label": "NCERT 17.9",
              "prompt": "Name the type of joint between the following:-\n(a) atlas/axis\n(b) carpal/metacarpal of thumb\n(c) between phalanges\n(d) femur/acetabulum\n(e) between cranial bones\n(f) between pubic bones in the pelvic girdle",
              "answer": "(a) Pivot (b) Saddle (c) Hinge (d) Ball and socket (e) Fibrous (f) Cartilaginous (pubic symphysis)",
              "solution": "Each joint type is defined by **how much movement it allows**, and once you know that rule you can name the joint at any location the bones' shapes suggest.\n\n**(a) Atlas/axis → Pivot joint.** This is the exact NCERT example: one bone rotates around another, which is what lets you turn your head side to side.\n\n**(b) Carpal/metacarpal of thumb → Saddle joint.** Also a direct NCERT example: two curved, saddle-shaped surfaces fit together, giving the thumb free movement in two planes — why it's the most flexible digit.\n\n**(c) Between phalanges → Hinge joint.** The finger bones swing back and forth in a single plane only — bending and straightening — exactly the same one-plane motion the chapter describes for the **knee**, which is why the knee is the book's named hinge-joint example.\n\n**(d) Femur/acetabulum → Ball and socket joint.** The rounded head of the femur fits into the cup-shaped **acetabulum** (formed where the ilium, ischium and pubis fuse) — the same head-in-a-socket arrangement the chapter describes for the humerus fitting into the scapula's glenoid cavity, which it names as a ball and socket joint.\n\n**(e) Between cranial bones → Fibrous joint.** This is a direct NCERT example: the flat skull bones fuse **end-to-end** by dense fibrous connective tissue in the form of **sutures**, forming the rigid cranium, allowing **no movement**.\n\n**(f) Between pubic bones in the pelvic girdle → Cartilaginous joint** (the **pubic symphysis**, where the two halves of the pelvic girdle meet at the front). The bones are held by cartilage and permit only **limited movement**, the same relationship the chapter describes for the joints between adjacent vertebrae."
            }
          ]
        },
        {
          "id": "s4-true-false-match-and-fill",
          "title": "True/False, Match and Fill-in-the-Blank Recap",
          "blurb": "A mixed round-up that touches muscle and skeleton facts together — the exact numbers and pairings NEET quotes.",
          "items": [
            {
              "kind": "numerical",
              "id": "b9e4883a-a5fd-4801-8b12-727a7246fd39",
              "source": "ncert_exercise",
              "source_label": "NCERT 17.4",
              "prompt": "Write true or false. If false change the statement so that it is true.\n(a) Actin is present in thin filament\n(b) H-zone of striated muscle fibre represents both thick and thin filaments.\n(c) Human skeleton has 206 bones.\n(d) There are 11 pairs of ribs in man.\n(e) Sternum is present on the ventral side of the body.",
              "answer": "(a) True (b) False — H-zone represents only the thick filament, not overlapped by any thin filament (c) True (d) False — there are 12 pairs of ribs in man (e) True",
              "solution": "Go statement by statement, checking each against what this chapter actually says.\n\n**(a) Actin is present in thin filament — TRUE.** The thin filament is built entirely of actin (two F-actins, each a polymer of G-actin), plus the tropomyosin and troponin riding on it.\n\n**(b) H-zone of striated muscle fibre represents both thick and thin filaments — FALSE.** The H-zone is defined as the **central part of the thick filaments not overlapped by the thin filaments** — that's the whole point of it. If thin filaments were present there too, it wouldn't be a distinct H-zone at all. **Corrected statement: the H-zone represents only the thick (myosin) filament — the region of it that has no thin filament beside it.**\n\n**(c) Human skeleton has 206 bones — TRUE.** The skeletal system in human beings is made of exactly 206 bones (plus a few cartilages), split into the axial skeleton (80 bones) and the appendicular skeleton (the rest).\n\n**(d) There are 11 pairs of ribs in man — FALSE.** There are **12 pairs of ribs**, not 11 — this chapter's own count is 7 true pairs + 3 false (vertebrochondral) pairs + 2 floating pairs = 12. **Corrected statement: there are 12 pairs of ribs in man.**\n\n**(e) Sternum is present on the ventral side of the body — TRUE.** The sternum is described as a flat bone on the **ventral midline of the thorax** — the breastbone running down the front-centre of the chest."
            },
            {
              "kind": "numerical",
              "id": "914750be-d456-4c56-8ac6-248f943cfa3e",
              "source": "ncert_exercise",
              "source_label": "NCERT 17.6",
              "prompt": "Match Column I with Column II :\nColumn I                        Column II\n(a) Smooth muscle                  (i) Myoglobin\n(b) Tropomyosin                   (ii) Thin filament\n(c) Red muscle                   (iii) Sutures\n(d) Skull                        (iv) Involuntary",
              "answer": "(a)–(iv) (b)–(ii) (c)–(i) (d)–(iii)",
              "solution": "Match each term in Column I to the one Column II entry it actually connects to.\n\n**(a) Smooth muscle → (iv) Involuntary.** Smooth (visceral) muscle sits in the walls of hollow organs like the alimentary canal and is not under voluntary control — it is **involuntary**, quietly moving food and gametes along on its own.\n\n**(b) Tropomyosin → (ii) Thin filament.** Tropomyosin is one of the two extra proteins (along with troponin) that run alongside the F-actins, so it belongs to the **thin filament**, not the thick one.\n\n**(c) Red muscle → (i) Myoglobin.** Red muscle fibres owe their colour to a high content of **myoglobin**, the red, oxygen-storing pigment, which also lets them work aerobically.\n\n**(d) Skull → (iii) Sutures.** The flat bones of the skull are joined end-to-end by dense fibrous connective tissue in the form of **sutures**, locking the cranium into one rigid box.\n\n**Final matches: (a)–(iv), (b)–(ii), (c)–(i), (d)–(iii).**"
            },
            {
              "kind": "numerical",
              "id": "aa0c9cc2-8cc9-4e7c-9215-6589fbb200de",
              "source": "ncert_exercise",
              "source_label": "NCERT 17.10",
              "prompt": "Fill in the blank spaces:\n(a) All mammals (except a few) have __________ cervical vertebra.\n(b) The number of phalanges in each limb of human is __________\n(c) Thin filament of myofibril contains 2 'F' actins and two other proteins namely __________ and __________.\n(d) In a muscle fibre Ca++ is stored in __________\n(e) __________ and __________ pairs of ribs are called floating ribs.\n(f) The human cranium is made of __________ bones.",
              "answer": "(a) seven (b) 14 (c) tropomyosin, troponin (d) the sarcoplasmic reticulum (e) 11th and 12th (f) 8",
              "solution": "Fill each blank using the exact figures and names this chapter already gave you.\n\n**(a) All mammals (except a few) have _seven_ cervical vertebra.** The number of cervical vertebrae is seven in almost all mammals — a giraffe's long neck and a human neck both have exactly seven.\n\n**(b) The number of phalanges in each limb of human is _14_.** Both the forelimb and the hindlimb carry 14 phalanges each (the finger/toe bones), alongside their carpals/tarsals and metacarpals/metatarsals.\n\n**(c) Thin filament of myofibril contains 2 'F' actins and two other proteins namely _tropomyosin_ and _troponin_.** Two filaments of tropomyosin run alongside the F-actins along their whole length, and troponin sits on the tropomyosin at regular intervals — together they're what mask (and later unmask) the myosin-binding sites.\n\n**(d) In a muscle fibre Ca++ is stored in _the sarcoplasmic reticulum_.** The endoplasmic reticulum of the muscle fibre has this special name, and its special job is being the store house of calcium ions.\n\n**(e) _11th_ and _12th_ pairs of ribs are called floating ribs.** They aren't connected ventrally at all — left free at the front, which is exactly why they're called floating.\n\n**(f) The human cranium is made of _8_ bones.** The skull as a whole is 22 bones, but the cranium specifically — the hard protective covering around the brain — is built from the 8 cranial bones (the skull's other 14 bones are the facial bones)."
            }
          ]
        }
      ]
    }
  ]
};
