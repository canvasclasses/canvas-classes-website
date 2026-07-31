'use strict';
// Class 11 Biology — Ch.7 Structural Organisation in Animals — "Practice —
// NCERT Exercises" page. Only 2 verbatim NCERT exercises (source:
// scripts/bio-book/_ncert_pdfs/kebo107.txt, EXERCISES section) — this is the
// most heavily rationalised chapter in the book (single frog case study only).
// Both solutions trace to this chapter's own already-published lesson pages.
// Ids are hardcoded static strings, not dynamic uuid() calls.
module.exports = {
  slug: 'ch7-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle: 'Both NCERT textbook exercises for the chapter, with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: 'b7d8c4a5-b323-4717-839e-028fa0966fc3',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A cutaway diagram of a frog showing the alimentary canal from mouth to cloaca, with the liver, gall bladder, and pancreas feeding into the digestive tract',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Scientific textbook illustration, wide landscape banner, flat 2D educational diagram on a dark background (#0a0a0a near-black). A side-profile cutaway silhouette of a frog, showing its internal alimentary canal as a simple connected tube: a short buccal cavity, a short oesophagus, a small rounded stomach, a coiled but short intestine, a rectum, and a cloaca opening at the rear. The liver (a two-lobed shape) and a small round gall bladder sit near the stomach, connected by a thin duct; the pancreas sits near the duodenum. Clean white outlines, muted natural olive-green and tan tones, biologically accurate schematic proportions, no photorealism, no cartoon, matches standard biology textbook illustration conventions. No text, no labels, no leader lines, no pointer lines of any kind anywhere in the image.",
    },
    {
      id: 'dbbfc0ae-e3ac-40c8-af3c-67ccee1e3175',
      type: 'text',
      order: 1,
      markdown: "You've read the chapter — now drill it. This chapter's own NCERT edition keeps only two end-of-chapter exercises, both about the frog case study this whole chapter is built around: its digestive system, and its excretory ureters.\n\nTry to answer each one in your head (or on paper) before you open the solution. The worked answer is written to *teach* the whole idea, not just tick the box — so even a question you get right is worth reading through.",
    },
    {
      id: 'b462867b-086b-4e2a-bbd4-df583457db85',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 7.1–7.2',
      intro: 'Both end-of-chapter exercises for this chapter. Each carries a one-line answer for a quick self-check and a full worked solution.',
      sections: [
        {
          id: 's1-frog-systems',
          title: "The Frog's Digestive and Excretory Systems",
          blurb: 'The alimentary canal from mouth to cloaca, and what the ureters actually do.',
          items: [
            {
              kind: 'numerical',
              id: '623b47c9-255a-44f3-a47a-edaf4179ad2b',
              source: 'ncert_exercise',
              source_label: 'NCERT 7.1',
              prompt: 'Draw a neat diagram of digestive system of frog.',
              answer: 'Mouth → buccal cavity → pharynx → oesophagus → stomach → intestine → rectum → cloaca, with the liver (via the gall bladder) and pancreas both feeding bile and pancreatic juice into the duodenum.',
              solution: "Since we can't draw here, walk through the canal in the exact order food actually travels, as this chapter's own digestive-system page lays it out.\n\nFood is captured by the frog's **bilobed tongue** and enters the **mouth**, which opens into the **buccal cavity**. From there it passes through the **pharynx** into the **oesophagus** — a **short tube**, since a frog is carnivorous and NCERT is explicit that this shortens the whole canal. The oesophagus opens into the **stomach**, where **HCl and gastric juices** break the food down into **chyme**.\n\nChyme then moves into the **duodenum** (the first part of the small intestine), where two glands finally do their work: the **liver** has already secreted **bile**, stored in the **gall bladder**, which arrives here and **emulsifies fat**; the **pancreas** delivers **pancreatic juice** through the same shared **common bile duct**, which **digests carbohydrates and proteins**. Final digestion happens in the **intestine**, and the digested food is absorbed through finger-like folds called **villi and microvilli**, which increase the absorbing surface.\n\nWhatever remains undigested passes into the **rectum**, and finally leaves the body through the **cloaca** — the single shared opening the frog's digestive, excretory, and reproductive systems all empty into.\n\nSo, as a labelled sequence: **mouth → buccal cavity → pharynx → oesophagus → stomach → duodenum (fed by liver/gall bladder + pancreas) → intestine → rectum → cloaca.**",
            },
            {
              kind: 'numerical',
              id: 'fc0572b5-e9ee-45b0-8d0a-397423747ad7',
              source: 'ncert_exercise',
              source_label: 'NCERT 7.2',
              prompt: 'Mention the function of the Ureters in frog.',
              answer: 'In both sexes, ureters carry urine from the kidneys to the cloaca. In males specifically, the ureters double as the urinogenital duct, also carrying sperm.',
              solution: "The **ureters** carry urine away from the **kidneys**, ultimately to the **cloaca** — that much is true in every frog. But this chapter is explicit that the exact job of the ureter **splits by sex**, and that split is exactly what NEET tests.\n\nIn **male** frogs, the two ureters do **double duty**: they act as a combined **urinogenital duct**, carrying both **urine and sperm**, and open into the cloaca together.\n\nIn **female** frogs, the ureters carry **only urine**. The **oviduct** (which carries eggs) stays **completely separate** from the ureters, opening into the cloaca on its own.\n\nSo the one-line function is: **transport urine from the kidney to the cloaca** — and in males only, the ureter carries genital products too, which is the trap this exact question is designed to test.",
            },
          ],
        },
      ],
    },
  ],
};
