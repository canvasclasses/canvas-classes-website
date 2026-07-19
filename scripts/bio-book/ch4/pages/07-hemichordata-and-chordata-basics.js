'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'hemichordata-and-chordata-basics',
  title: 'Hemichordata and the Chordate Blueprint',
  subtitle: "One phylum was once counted as a chordate and got moved out over a single structure. Learn what actually separates a chordate from everything else, and the branching tree that runs the rest of this chapter.",
  page_number: 7,
  page_type: 'lesson',
  tags: ['animal-kingdom', 'hemichordata', 'chordata', 'vertebrata'],
  glossary: [
    { term: 'hemichordate', definition: 'A small group of worm-like marine animals with an anterior proboscis, a collar and a long trunk. Once treated as a chordate sub-phylum, now classified as a separate non-chordate phylum. Examples: Balanoglossus, Saccoglossus.' },
    { term: 'stomochord', definition: 'A rudimentary structure in the collar region of a hemichordate that is similar to a notochord but is not a true one — the reason hemichordates were once mistaken for chordates.' },
    { term: 'notochord', definition: 'A rod-like structure formed on the dorsal side of the body, present at some stage in every chordate. Its presence or absence is the first line of Table 4.1.' },
    { term: 'protochordates', definition: 'The informal name for subphyla Urochordata and Cephalochordata together — exclusively marine chordates whose notochord is either restricted to the larval tail or persists for life, but which never replace it with a vertebral column.' },
    { term: 'Agnatha', definition: 'The division of Vertebrata that lacks a jaw. Contains a single class, Cyclostomata.' },
    { term: 'Gnathostomata', definition: 'The division of Vertebrata that bears a jaw. Splits further into Super Class Pisces and Super Class Tetrapoda.' },
  ],
  blocks: [
    // ── hero ─────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A worm-like burrower on a dusk seafloor on the left, transitioning to a slender fish-shaped silhouette with a glowing spine-like line on the right',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dusk ocean-floor scene read left to right. On the far left, a soft-bodied worm-like burrower rests half-buried in sand near its burrow opening, its body divided into a rounded front end, a slight collar, and a long trailing trunk — no visible internal structure, just its outer form. Moving rightward across the frame the seafloor gently deepens into open water, and on the right a slender fish-shaped silhouette glides past, one thin warm glowing line running the full length of its back like a spine of light, faintly echoing the burrower's shape on the left without being identical to it. Deep dusk underwater lighting, a single warm glow low in the scene tying both halves together, painterly and atmospheric illustration style, dark naturalistic background throughout (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    // ── fun_fact ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Phylum That Got Reclassified Out',
      markdown: "For a while, biologists actually counted **Hemichordata** as a sub-phylum inside Chordata. NCERT now places it as a **separate phylum under non-chordata** instead — and the reason for the switch is a single structure in its collar that only *looks* like the real thing every chordate has. This page is the story of that one structure, and the three features that actually decide who gets to be called a chordate.",
    },
    // ── heading: Hemichordata ────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 2, level: 2,
      text: 'Hemichordata — The Phylum That Nearly Stayed a Chordate',
      objective: "By the end of this you can list Hemichordata's defining features and explain why it was moved out of Chordata.",
    },
    {
      id: uuid(), type: 'text', order: 3,
      markdown: "Every phylum you've sorted so far — right up to Echinodermata — belongs to non-chordata. This page hands you the dividing line that splits the whole animal kingdom into chordates and non-chordates, starting with a phylum that sits right on top of that line.\n\n**Hemichordata** is a small group of **worm-like marine animals** with **organ-system level** organisation. They are **bilaterally symmetrical, triploblastic and coelomate**. The body is cylindrical, built from three parts in a row: an anterior **proboscis**, a **collar**, and a long **trunk**. Tucked inside the collar region is a rudimentary structure called the **stomochord** — a structure **similar to a notochord**. That resemblance is exactly why hemichordates were once grouped with the chordates, and exactly what this page needs you to see through.\n\nThe rest of the body plan: circulation is **open**, respiration happens through **gills**, the excretory organ is the **proboscis gland**, the sexes are **separate**, fertilisation is **external**, and development is **indirect**. **Balanoglossus** and **Saccoglossus** are NCERT's two examples.",
    },
    // ── mid-page reasoning check: stomochord vs notochord trap ──────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 4, reasoning_type: 'logical',
      prompt: "Hemichordata was once treated as a sub-phylum of Chordata, but NCERT now places it as a separate phylum under non-chordata, even though Balanoglossus has a stomochord in its collar region. What is the actual reasoning behind moving it out of Chordata?",
      options: [
        "The stomochord is only found in the animal's trunk rather than its collar, so it cannot be compared to a notochord at all",
        "Hemichordates are worm-like and marine, and NCERT groups every worm-like marine animal under non-chordata regardless of internal structure",
        "The stomochord only resembles a notochord in position — it is not a true notochord — so Balanoglossus does not actually meet the defining chordate criteria",
        "The stomochord fully qualifies as a genuine notochord, and Hemichordata is kept separate purely as a historical naming convention",
      ],
      correct_index: 2,
      reveal: "NCERT is careful with its wording — it calls the stomochord 'a structure similar to notochord,' sitting in the collar region, not an actual notochord. Since a genuine notochord is one of the three defining chordate features, a structure that only resembles one isn't enough to earn Hemichordata a place in Chordata, and it now sits under non-chordata instead. The stomochord's real location is the collar, not the trunk, so that option gets the anatomy wrong; 'worm-like and marine' isn't NCERT's classification criterion at all; and calling the stomochord a genuine notochord contradicts the very reason NCERT moved the phylum out of Chordata in the first place.",
      difficulty_level: 3,
    },
    // ── heading: the three chordate features ─────────────────────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'The Three Features That Make a Chordate a Chordate',
      objective: 'By the end of this you can name the three defining chordate features and use Table 4.1 to tell a chordate from a non-chordate at a glance.',
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Animals in phylum Chordata are fundamentally characterised by three features, present at some stage of life: a **notochord**, a **dorsal, hollow nerve cord**, and **paired pharyngeal gill slits**. Alongside these three, chordates are **bilaterally symmetrical, triploblastic, coelomate**, with **organ-system level** organisation. They also carry a **post-anal tail** and a **closed circulatory system** — and this is exactly where the Hemichordata comparison falls apart: a stomochord that merely *resembles* a notochord isn't enough on its own to satisfy the first criterion.\n\nTable 4.1 lines up the five features NCERT uses to tell the two groups apart, every single time a question asks you to.",
    },
    // ── interactive image: Figure 4.16 ───────────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'A generic chordate body outline showing the notochord, dorsal hollow nerve cord, paired pharyngeal gill slits, and post-anal tail',
      caption: '📸 Tap each feature to see what makes it one of the three chordate criteria',
      generation_prompt: "Scientific textbook illustration of a generic chordate body plan, matching NCERT Figure 4.16. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A single elongated, torpedo-shaped generic chordate body shown in side profile, clean white outlines, biologically accurate proportions. Along the dorsal (upper) side, a thin white rod-like structure runs from head to tail region representing the notochord, drawn just beneath the body outline. Directly above the notochord, a thin hollow tube-like structure runs parallel to it representing the dorsal hollow nerve cord. Near the anterior (head) end, a short series of small parallel slit openings are visible on the side of the body representing paired pharyngeal gill slits. At the posterior end, the body outline extends visibly beyond a small marked anus into a tapering tail section representing the post-anal part. No baked-in text labels, no photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.22, label: 'Dorsal hollow nerve cord', icon: 'circle',
          detail: "In chordates the central nervous system is **dorsal, hollow and single** — the opposite of non-chordates, where it's **ventral, solid and double** (Table 4.1)." },
        { id: uuid(), x: 0.5, y: 0.46, label: 'Notochord', icon: 'circle',
          detail: "A rod-like structure on the dorsal side of the body, present at some stage in every chordate. Table 4.1's first line: **present in chordates, absent in non-chordates**." },
        { id: uuid(), x: 0.2, y: 0.58, label: 'Paired pharyngeal gill slits', icon: 'circle',
          detail: "The pharynx is **perforated by gill slits** in every chordate at some stage; non-chordates have **no gill slits at all** (Table 4.1)." },
        { id: uuid(), x: 0.85, y: 0.72, label: 'Post-anal tail', icon: 'circle',
          detail: "A part of the body extending **beyond the anus**. Present in chordates; **absent** in non-chordates — the last line of Table 4.1." },
      ],
    },
    // ── table 4.1 ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 8, caption: 'Table 4.1 — Comparison of Chordates and Non-chordates',
      headers: ['Chordates', 'Non-chordates'],
      rows: [
        ['Notochord present.', 'Notochord absent.'],
        ['Central nervous system is dorsal, hollow and single.', 'Central nervous system is ventral, solid and double.'],
        ['Pharynx perforated by gill slits.', 'Gill slits are absent.'],
        ['Heart is ventral.', 'Heart is dorsal (if present).'],
        ['A post-anal part (tail) is present.', 'Post-anal tail is absent.'],
      ],
    },
    // ── heading: three subphyla ───────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'Three Subphyla, One Split That Runs the Rest of the Chapter',
      objective: 'By the end of this you can place any chordate into one of the three subphyla, and defend the line "all vertebrates are chordates, but all chordates are not vertebrates."',
    },
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "Phylum Chordata splits into three subphyla: **Urochordata (Tunicata)**, **Cephalochordata**, and **Vertebrata**.\n\nUrochordata and Cephalochordata are together called **protochordates** — both are **exclusively marine**. In **Urochordata**, the notochord is present only in the **larval tail**. In **Cephalochordata**, it runs **from head to tail and persists throughout life**. NCERT's examples: Urochordata — *Ascidia*, *Salpa*, *Doliolum*; Cephalochordata — *Branchiostoma* (Amphioxus, or Lancelet).\n\n**Vertebrata** is different again. Its members possess a notochord only during the **embryonic period** — in the adult it is **replaced by a cartilaginous or bony vertebral column**. That single fact is the whole logic behind the line NCERT wants you to be able to defend: **all vertebrates are chordates, but all chordates are not vertebrates.** A vertebrate has already passed the chordate test — notochord, dorsal hollow nerve cord, gill slits, at some stage — and has then gone one step further, swapping its notochord for a backbone as an adult. A protochordate never takes that extra step, so it stays a chordate without ever becoming a vertebrate.\n\nOn top of the basic chordate plan, vertebrates carry a few extra features: a **ventral muscular heart with two, three or four chambers**, **kidneys** for excretion and osmoregulation, and **paired appendages** — fins or limbs.",
    },
    // ── comparison card: three subphyla ──────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 11, title: 'Urochordata vs Cephalochordata vs Vertebrata',
      columns: [
        { heading: 'Urochordata (Tunicata)', points: ['Protochordate — exclusively marine', 'Notochord present only in the larval tail', 'Examples: Ascidia, Salpa, Doliolum'] },
        { heading: 'Cephalochordata', points: ['Protochordate — exclusively marine', 'Notochord extends head to tail, persists for life', 'Example: Branchiostoma (Amphioxus/Lancelet)'] },
        { heading: 'Vertebrata', points: ['Notochord present only in the embryonic period', 'Replaced by a cartilaginous or bony vertebral column as an adult', 'Also has a ventral muscular heart, kidneys, and paired fins/limbs'] },
      ],
    },
    // ── tree intro ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "Subphylum Vertebrata doesn't stop at one group — NCERT branches it further, and this branching is the map for every page left in this chapter.\n\nDivision **Agnatha** (animals that **lack a jaw**) sits apart from Division **Gnathostomata** (animals that **bear a jaw**). Gnathostomata then splits into Super Class **Pisces** (animals that **bear fins**) and Super Class **Tetrapoda** (animals that **bear limbs**). Six classes hang off these branches: Agnatha holds **Cyclostomata**; Pisces holds **Chondrichthyes** and **Osteichthyes**; Tetrapoda holds **Amphibia**, **Reptilia**, **Aves**, and **Mammals**.",
    },
    // ── interactive image: vertebrate classification tree ────────────────
    {
      id: uuid(), type: 'interactive_image', order: 13, src: '',
      alt: 'The Vertebrata classification tree branching from Agnatha and Gnathostomata down to Pisces, Tetrapoda, and their six classes',
      caption: '📸 Tap each branch to see how Vertebrata splits down to its six classes',
      generation_prompt: "Scientific classification flowchart illustration matching NCERT's Vertebrata classification diagram. Flat 2D educational diagram on a dark background (#0a0a0a near-black), clean white outlines and thin white connecting lines only, no baked-in text labels. A single top node splits into two branches at a first level, positioned left and right. The right-hand branch of that first split then splits again into two further branches at a second level, positioned below it, left and right of each other. Each node rendered as a simple minimal rounded rectangle connected by thin straight white lines showing the branching hierarchy, consistent line weight throughout, evenly spaced. No text, no photorealism, no decorative elements, minimalist scientific flowchart style, matching standard biology textbook diagram conventions.",
      hotspots: [
        { id: uuid(), x: 0.22, y: 0.32, label: 'Agnatha (lacks jaw)', icon: 'circle',
          detail: "Division of Vertebrata that **lacks a jaw**. Contains a single class: **1. Cyclostomata**." },
        { id: uuid(), x: 0.68, y: 0.32, label: 'Gnathostomata (bears jaw)', icon: 'circle',
          detail: "Division of Vertebrata that **bears a jaw**. Splits further into Super Class **Pisces** and Super Class **Tetrapoda**." },
        { id: uuid(), x: 0.5, y: 0.65, label: 'Pisces (bear fins)', icon: 'circle',
          detail: "Super Class of Gnathostomata that **bears fins**. Contains two classes: **1. Chondrichthyes 2. Osteichthyes**." },
        { id: uuid(), x: 0.85, y: 0.65, label: 'Tetrapoda (bear limbs)', icon: 'circle',
          detail: "Super Class of Gnathostomata that **bears limbs**. Contains four classes: **1. Amphibia 2. Reptilia 3. Aves 4. Mammals**." },
      ],
    },
    // ── remember ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'remember', title: 'Lock These In',
      markdown: "- **Hemichordata's stomochord is NOT a true notochord** — that's exactly why it's a non-chordate phylum, not a chordate one.\n- The three defining chordate features: **notochord, dorsal hollow nerve cord, paired pharyngeal gill slits** — all present at some stage.\n- **Urochordata:** notochord only in the **larval tail**. **Cephalochordata:** notochord **head-to-tail, for life**. **Vertebrata:** notochord only **embryonic**, replaced by a **vertebral column** in the adult.\n- **All vertebrates are chordates; not all chordates are vertebrates.**\n- The tree: **Agnatha** (no jaw) vs **Gnathostomata** (jaw) → **Pisces** (fins) vs **Tetrapoda** (limbs) → **six classes**.",
    },
    // ── exam tip ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 15, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**The stomochord trap:** NEET loves to ask why Balanoglossus isn't a chordate despite having a notochord-like structure. Answer: the **stomochord only resembles a notochord** — it isn't a true one, so Hemichordata stays under non-chordata.\n\n**Table 4.1, cold:** notochord present/absent; CNS dorsal-hollow-single vs ventral-solid-double; gill slits present/absent; heart ventral vs dorsal (if present); post-anal tail present/absent. NEET lifts these lines directly.\n\n**Memorise the tree before the next page:** Agnatha (no jaw) vs Gnathostomata (jaw) → Pisces (fins) vs Tetrapoda (limbs) → six classes: Cyclostomata under Agnatha; Chondrichthyes and Osteichthyes under Pisces; Amphibia, Reptilia, Aves, Mammals under Tetrapoda. Every remaining page in this chapter hangs off this one branching diagram.\n\n**Classic NEET question:** \"Which statement correctly describes the relationship between chordates and vertebrates?\" → All vertebrates are chordates, but all chordates are not vertebrates.",
    },
    // ── bridge ────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 16,
      markdown: "You now have the map. The next few pages walk each branch of this tree, one class at a time, starting with the jawless survivors of Agnatha.",
    },
    // ── quiz ──────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 17, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'Why is Hemichordata now classified as a separate phylum under non-chordata rather than as a chordate sub-phylum?',
          options: [
            'Its stomochord is a genuine notochord, but it lacks a dorsal hollow nerve cord entirely',
            'Its stomochord only resembles a notochord and is not a true one, so it does not meet the chordate criteria',
            'It lacks bilateral symmetry, which the three chordate subphyla all share',
            'It is triploblastic but acoelomate, unlike every true chordate',
          ],
          correct_index: 1,
          explanation: "NCERT describes the stomochord as a structure 'similar to' a notochord, not an actual one — that resemblance-without-identity is the reason Hemichordata sits under non-chordata. Hemichordates are in fact bilaterally symmetrical and coelomate, just like true chordates, so any option naming those as the disqualifying feature has the facts backwards.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'What is the excretory organ of a hemichordate like Balanoglossus?',
          options: ['Malpighian tubule', 'Flame cell', 'Proboscis gland', 'Nephridium'],
          correct_index: 2,
          explanation: "NCERT names the proboscis gland as the excretory organ in hemichordates. Malpighian tubules, flame cells, and nephridia are all excretory structures used by other animal groups — none of them is what Balanoglossus actually uses.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'According to Table 4.1, where is the heart located in chordates versus non-chordates?',
          options: [
            'Dorsal in chordates; ventral in non-chordates',
            'Ventral in both groups',
            'Absent in chordates; ventral in non-chordates',
            'Ventral in chordates; dorsal (if present) in non-chordates',
          ],
          correct_index: 3,
          explanation: "Table 4.1 states the chordate heart is ventral, while a non-chordate's heart — where one exists at all — is dorsal. Swapping ventral and dorsal, or claiming both groups share one position, contradicts the table's actual wording; chordates do have a heart, so calling it absent is wrong too.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'A student says: "Branchiostoma keeps its notochord for life, so it must be a vertebrate." What is wrong with this reasoning?',
          options: [
            'Branchiostoma is a Urochordate, and its notochord is present only in the larval tail, so the premise is already false',
            'Branchiostoma is a Cephalochordate; its notochord runs head-to-tail for life, but it never develops a vertebral column, so it stays a chordate, not a vertebrate',
            'The student is correct — any chordate that keeps its notochord for life automatically counts as a vertebrate',
            'Branchiostoma is a vertebrate whose notochord happens to persist alongside a fully formed vertebral column',
          ],
          correct_index: 1,
          explanation: "Branchiostoma (Amphioxus/Lancelet) is NCERT's named Cephalochordate example, and its notochord does run head-to-tail for life — but Vertebrata is defined by replacing the notochord with a vertebral column in the adult, which Cephalochordata never does. Keeping the notochord for life is exactly what keeps Branchiostoma a protochordate, not what makes it a vertebrate.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
