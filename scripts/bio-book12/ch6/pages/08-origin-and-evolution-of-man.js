'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-origin-and-evolution-of-man',
  title: 'The Origin & Evolution of Humans',
  subtitle: "Our own family tree — from hairy, gorilla-walking primates 15 million years ago to modern humans — read as one clear line where the brain keeps growing and the walk turns upright.",
  page_number: 8,
  page_type: 'lesson',
  tags: ['human-evolution', 'hominid', 'homo-sapiens', 'brain-size', 'evolution'],
  glossary: [
    { term: 'Australopithecus', definition: 'Early man-like primates that lived in the East African grasslands about 2 million years ago. They walked upright, were not taller than 4 feet, hunted with stone weapons but essentially ate fruit, and had a roughly ape-sized brain.' },
    { term: 'Homo habilis', definition: 'The first human-like being (hominid), living about 2 million years ago with a brain capacity of 650–800 cc. Fossils suggest it probably did not eat meat.' },
    { term: 'Homo erectus', definition: 'A human ancestor from about 1.5 million years ago with a large brain of around 900 cc. Fossils were first found in Java in 1891. Homo erectus probably ate meat.' },
    { term: 'Neanderthal man', definition: 'A human type with a brain size of about 1400 cc that lived in the near east and central Asia between 1,00,000 and 40,000 years ago. They used hides to protect their body and buried their dead.' },
    { term: 'Homo sapiens', definition: 'Modern humans. Homo sapiens arose in Africa, moved across the continents and developed into distinct races. Modern Homo sapiens arose during the ice age between 75,000 and 10,000 years ago.' },
    { term: 'hominid', definition: 'A man-like primate showing human-like features (such as upright walking). NCERT uses the term for the man-like bones found in Ethiopia and Tanzania and for the first human-like being, Homo habilis.' },
    { term: 'mya', definition: 'Short for "million years ago" — the unit used to place each ancestor on the timeline of human evolution.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dawn savanna scene reading left to right: hairy ape-like primates near trees, then a small upright man-like figure on the grassland, then a taller tool-carrying figure, with distant hills behind',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dawn landscape across an East African savanna, reading left to right as a slow rise from ape to human. On the far left, hairy ape-like primates crouching among low trees at the woodland edge, walking on their knuckles like gorillas. Moving right, the trees thin into open golden grassland where a small upright man-like figure (not taller than four feet) stands on two legs, silhouetted. Further right, a slightly taller, more upright figure walks across the grass carrying a rough stone in one hand. Low warm dawn light, one soft amber sun near the horizon, distant flat-topped acacia trees and blue hills fading into haze. Painterly, atmospheric illustration style, dark naturalistic background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no modern objects.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Everyone Alive Traces Back to Africa',
      markdown: "Wherever you were born, your deepest family address is the same: **Africa.** NCERT is clear on this — **Homo sapiens arose in Africa** and then moved across the continents, spreading out and developing into distinct races along the way. So the grasslands of eastern Africa, where man-like primates first walked upright a few million years ago, are the starting line for every human story on Earth — including yours.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The last stop in this chapter is the animal you already know best: **us.** Human evolution isn't a single leap — it's a slow relay, one ancestor handing off to the next over millions of years. If you hold on to just two changes running through the whole line, the whole story clicks into place: **the walk turns upright, and the brain keeps getting bigger.**\n\nIt starts about **15 million years ago (mya)** with two primates, **Dryopithecus** and **Ramapithecus**. They were **hairy and walked like gorillas and chimpanzees**. The one difference to lock in: **Ramapithecus was more man-like, while Dryopithecus was more ape-like.** (An easy way to hold it — **R**amapithecus for **R**esembling man.)\n\nThen come the first man-like bones. Fossils found in **Ethiopia and Tanzania** show hominid features, which led scientists to believe that about **3–4 mya, man-like primates walked in eastern Africa.** They were **probably not taller than 4 feet, but they walked upright** — that upright walk is the first big human signature.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Line of Ancestors, Step by Step',
      objective: 'By the end of this you can place each ancestor in the right order and say the one feature NCERT ties to each — upright walk, tools, meat-eating, or burying the dead.',
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Australopithecus (about 2 mya).** These early man-like primates probably lived in the **East African grasslands**. The telling detail: **evidence shows they hunted with stone weapons, but they essentially ate fruit.** So — stone tools in hand, yet still a fruit diet, and a brain still about ape-sized.\n\n**Homo habilis (about 2 mya).** Among the bones discovered, some were different. This creature was called the **first human-like being — the hominid — Homo habilis.** Its **brain capacity was between 650–800 cc.** And here's the point students flip: **Homo habilis probably did NOT eat meat.**\n\n**Homo erectus (about 1.5 mya).** Fossils **discovered in Java in 1891** revealed the next stage. **Homo erectus had a large brain of around 900 cc,** and **Homo erectus probably ate meat** — the meat-eater of the line.\n\n**Neanderthal man.** With a **brain size of about 1400 cc**, Neanderthals **lived in the near east and central Asia between 1,00,000 and 40,000 years ago.** Two things to remember: they **used hides to protect their body**, and they **buried their dead** — the first ancestor NCERT credits with burial.\n\n**Homo sapiens (modern humans).** **Homo sapiens arose in Africa** and moved across continents, developing into distinct races. During the **ice age, between 75,000 and 10,000 years ago, modern Homo sapiens arose** — with a brain of about 1350 cc. Later, **pre-historic cave art developed about 18,000 years ago** (one such site is the **Bhimbetka rock shelter in Raisen district, Madhya Pradesh**), and **agriculture came around 10,000 years back.**",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 5, reasoning_type: 'logical',
      prompt: "A student lists four ancestors on the board — Homo erectus, Australopithecus, Neanderthal man, Homo habilis — and is asked to arrange them from EARLIEST to most recent. Which order is correct?",
      options: [
        "Australopithecus → Homo habilis → Homo erectus → Neanderthal man",
        "Homo habilis → Australopithecus → Homo erectus → Neanderthal man",
        "Australopithecus → Homo erectus → Homo habilis → Neanderthal man",
        "Homo erectus → Homo habilis → Australopithecus → Neanderthal man",
      ],
      correct_index: 0,
      reveal: "Anchor it with the timeline and the brain sizes, both of which climb together. **Australopithecus** and **Homo habilis** sit around 2 mya, with habilis marked as the *first human-like being*, so Australopithecus comes first; **Homo erectus** follows at about 1.5 mya (brain ~900 cc); **Neanderthal man** is most recent (1,00,000–40,000 years ago, brain ~1400 cc). The tempting trap is swapping **Homo habilis (650–800 cc)** and **Homo erectus (900 cc)** — but the smaller-brained habilis comes *before* the larger-brained erectus, never after.",
      difficulty_level: 3,
    },
    {
      id: uuid(), type: 'table', order: 6, caption: '📸 The human ancestry line — read the brain-size column top to bottom and watch it climb',
      headers: ['Ancestor', 'Approx. time', 'Brain size', 'Key NCERT feature'],
      rows: [
        ['Dryopithecus & Ramapithecus', '~15 mya', 'Ape-like', 'Hairy, walked like gorillas; Ramapithecus more man-like, Dryopithecus more ape-like'],
        ['Australopithecus', '~2 mya (East Africa)', 'Ape-sized', 'Walked upright, <4 ft; hunted with stone weapons but essentially ate fruit'],
        ['Homo habilis', '~2 mya', '650–800 cc', 'First human-like being (hominid); probably did NOT eat meat'],
        ['Homo erectus', '~1.5 mya', '~900 cc', 'Fossils found in Java, 1891; probably ate meat'],
        ['Neanderthal man', '1,00,000–40,000 yrs ago', '~1400 cc', 'Near east & central Asia; used hides, buried their dead'],
        ['Homo sapiens', 'Ice age, 75,000–10,000 yrs ago', '~1350 cc', 'Arose in Africa, spread across continents into distinct races'],
      ],
      highlight_row: [2, 3, 4],
    },
    {
      id: uuid(), type: 'callout', order: 7, variant: 'remember', title: 'Lock These In',
      markdown: "- **Sequence (earliest → latest):** Dryopithecus/Ramapithecus (~15 mya) → **Australopithecus** (~2 mya) → **Homo habilis** → **Homo erectus** (~1.5 mya) → **Neanderthal man** → **Homo sapiens.**\n- **Brain-size ladder (memorise the numbers):** Homo habilis **650–800 cc** → Homo erectus **~900 cc** → Neanderthal **~1400 cc** → modern Homo sapiens **~1350 cc.** The number rises with each step up to the Neanderthal.\n- **Ramapithecus = more man-like; Dryopithecus = more ape-like.** Don't swap them.\n- **Homo habilis did NOT eat meat. Homo erectus probably ate meat.**\n- **Neanderthals buried their dead and used hides.** **Homo sapiens arose in Africa.**\n- **Australopithecus:** upright, under 4 feet, **hunted with stone weapons but ate fruit.**",
    },
    {
      id: uuid(), type: 'callout', order: 8, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Brain capacity — memorise the exact figures.** Homo habilis **650–800 cc**, Homo erectus **900 cc**, Neanderthal **1400 cc**. NEET loves a match-the-column of *ancestor ↔ brain size*, and swapping habilis with erectus is the classic trap.\n\n**Diet trap:** it is **Homo erectus** (not Homo habilis) that probably **ate meat**. Australopithecus **hunted with stone weapons but essentially ate fruit** — a favourite line to test.\n\n**Fossil geography:** **Homo erectus fossils → Java, 1891.** **Neanderthal → near east & central Asia.** **Homo sapiens → arose in Africa.**\n\n**Ramapithecus vs Dryopithecus:** Ramapithecus is the **man-like** one.\n\n**Classic NEET question:** \"Which of the following had the largest cranial (brain) capacity?\" → **Neanderthal man (~1400 cc)** — larger than Homo erectus and even slightly larger than the ~1350 cc of modern Homo sapiens.",
    },
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "And that upright walk on the East African grassland, and the brain that kept swelling from a few hundred cc to fourteen hundred — that is where this chapter ends and human history begins. You've now traced life's whole story of change, from the origin of the first cells all the way to the species reading this page. **Chapter complete — that's Evolution, start to finish.**",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 10, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which of these human ancestors had a brain capacity of only about 650–800 cc?',
          options: ['Homo erectus', 'Neanderthal man', 'Homo habilis', 'Homo sapiens'],
          correct_index: 2,
          explanation: "NCERT gives Homo habilis a brain capacity of 650–800 cc — the smallest in the Homo line listed. Homo erectus is larger at ~900 cc, the Neanderthal is ~1400 cc, and modern Homo sapiens is ~1350 cc, so none of those match the 650–800 cc figure. Confusing habilis with erectus is the usual slip.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Arrange these ancestors from EARLIEST to most recent: Neanderthal man, Homo habilis, Australopithecus, Homo erectus.',
          options: [
            'Australopithecus → Homo habilis → Homo erectus → Neanderthal man',
            'Homo habilis → Homo erectus → Australopithecus → Neanderthal man',
            'Australopithecus → Homo erectus → Homo habilis → Neanderthal man',
            'Neanderthal man → Homo erectus → Homo habilis → Australopithecus',
          ],
          correct_index: 0,
          explanation: "Australopithecus and Homo habilis sit around 2 mya (habilis is the first human-like being), Homo erectus follows at ~1.5 mya, and the Neanderthal is most recent at 1,00,000–40,000 years ago. The tempting error is placing Homo erectus before Homo habilis — but the smaller-brained habilis comes first, so option 3 is wrong.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'According to NCERT, which ancestor "hunted with stone weapons but essentially ate fruit"?',
          options: ['Homo erectus', 'Australopithecus', 'Neanderthal man', 'Homo habilis'],
          correct_index: 1,
          explanation: "NCERT describes Australopithecus (living in the East African grasslands ~2 mya) as hunting with stone weapons yet essentially eating fruit. Homo erectus is the one linked with eating meat, and Homo habilis probably did not eat meat, so neither fits the stone-weapon-but-fruit description.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which statement about the Neanderthal man is correct as per NCERT?',
          options: [
            'It had a brain size of about 900 cc and its fossils were found in Java',
            'It had a brain size of about 1400 cc, used hides, and buried its dead',
            'It arose in Africa and spread across continents into distinct races',
            'It was more ape-like than Dryopithecus and walked like a gorilla',
          ],
          correct_index: 1,
          explanation: "NCERT gives the Neanderthal a brain size of about 1400 cc, living in the near east and central Asia (1,00,000–40,000 years ago), using hides and burying its dead. The ~900 cc, Java-fossil detail belongs to Homo erectus; arising in Africa and spreading into races describes Homo sapiens; and the gorilla-like walk describes Dryopithecus/Ramapithecus — so those three options mismatch.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
