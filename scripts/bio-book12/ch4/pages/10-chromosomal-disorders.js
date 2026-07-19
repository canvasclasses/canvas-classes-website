'use strict';
/**
 * Class 12 Biology — Chapter 4: Principles of Inheritance and Variation
 * Page 10 — Chromosomal Disorders (closing page of the chapter).
 *
 * Source of truth: NCERT Class 12 Ch.4, §4.8.3 "Chromosomal Disorders"
 * (lebo104.txt, lines 1231–1315) + the summary lines 1380–1386. Rule 0: every
 * fact here traces to that text; nothing invented. NCERT figures for this section
 * are Fig 4.16 (Down's syndrome individual + karyotype) and Fig 4.17
 * (Klinefelter's and Turner's syndrome); the karyotype/hotspot imagery mirrors those.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'chromosomal-disorders',
  title: 'When Chromosome Number Goes Wrong — Chromosomal Disorders',
  subtitle: 'Mendelian disorders came from a single faulty gene. These come from something bigger — a whole chromosome too many or too few — and by the end you will know exactly why 47 or 45 chromosomes changes a life.',
  page_number: 10,
  page_type: 'lesson',
  tags: ['chromosomal-disorders', 'principles-of-inheritance-and-variation'],
  glossary: [
    { term: 'aneuploidy', definition: 'The gain or loss of one or more chromosomes, caused by failure of the chromatids to separate during cell division. The chromosome number changes by one (or a few), not by a whole set.' },
    { term: 'polyploidy', definition: 'An increase in a whole set of chromosomes in an organism, caused by failure of cytokinesis after the telophase stage of cell division. It is often seen in plants.' },
    { term: 'non-disjunction', definition: 'The failure of chromatids (or chromosomes) to segregate properly during cell division, so one cell ends up with an extra chromosome and another with one missing. This is the root cause of aneuploidy.' },
    { term: 'trisomy', definition: 'The condition in which an individual has an additional copy of a chromosome, i.e. three copies instead of the normal pair. Down’s syndrome is trisomy of chromosome 21.' },
    { term: 'monosomy', definition: 'The condition in which an individual lacks one chromosome of a pair, i.e. only one copy instead of two. Turner’s syndrome (45, X0) is monosomy of the X chromosome.' },
    { term: 'karyotype', definition: 'The complete set of chromosomes of an individual, arranged and counted. Writing 47, XXY or 45, X0 is a shorthand karyotype showing the total number and the sex chromosomes.' },
    { term: 'gynaecomastia', definition: 'The development of breast tissue, a feminine feature. It appears in Klinefelter’s syndrome even though the individual is otherwise masculine in build.' },
  ],
  blocks: [
    {
      id: '7d3f9a2c-1e64-4b08-9c57-2a6f0d3e8b41',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A quiet arrangement of paired human chromosomes fading into darkness, with one pair carrying a third, extra chromosome',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A softly lit, orderly arrangement of human chromosomes shown as gently glowing paired shapes receding into a dark background (#0a0a0a base). Most pairs sit as neat twos, but one position clearly carries THREE chromosomes instead of two, subtly highlighted so the eye lands on the odd one out. Purple/violet nucleic-acid tones for the chromosomes against deep shadow. Painterly, atmospheric, scientific rather than cartoonish. No text, no labels, no numbers, no diagram callouts.",
    },
    {
      id: '4a92c7e0-8b13-4d5f-9a3e-1c8b7e0f6d24',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'One Chromosome Off, and Everything Changes',
      markdown: "Every healthy human cell carries **46 chromosomes** — 23 tidy pairs. Not 45, not 47. Forty-six. That number is so exact that a single extra chromosome, or a single missing one, is enough to reshape an entire life. In Down’s syndrome the cell holds **47** chromosomes — just one over. In Turner’s syndrome it holds **45** — just one under. Same tiny arithmetic gap of one, opposite directions, and two very different conditions. This page is about what happens when the counting goes wrong.",
    },
    {
      id: '3c1e8a7d-5b09-4f62-8d4a-9c2b7e0f13d6',
      type: 'text',
      order: 2,
      markdown: "A **Mendelian disorder** (the last topic) came from a fault inside a single gene — one letter of the DNA gone wrong. **Chromosomal disorders** are a different scale of problem. They are caused by the **absence, or excess, or abnormal arrangement of one or more whole chromosomes**. Not a typo in a gene — a whole chromosome missing or spare.\n\nStart from the normal picture. A normal human cell has **46 chromosomes (23 pairs)**. Of these, **22 pairs are autosomes** and **one pair is the sex chromosomes**. Every gamete should carry exactly one of each — 23 in all. When that neat halving goes wrong, an individual can end up with an extra chromosome, or short of one, and that is where these disorders begin.",
    },
    {
      id: 'b6d29f04-8a31-4c7e-9b58-2f0e6a1c7d94',
      type: 'heading',
      order: 3,
      text: 'Aneuploidy vs Polyploidy — and the Slip That Causes Them',
      level: 2,
      objective: 'What goes wrong during cell division to leave a cell with one chromosome too many, or a whole set too many?',
    },
    {
      id: 'f1a7c3e9-4d28-4b06-8e15-6a9d0c2f5b73',
      type: 'text',
      order: 4,
      markdown: "During cell division, the chromatids of each chromosome are supposed to **segregate** — pull apart cleanly, one to each new cell. Sometimes they don’t. This failure to separate is called **non-disjunction**, and its result is that one cell gains a chromosome while another loses one. When a cell ends up with an extra chromosome or one short, the condition is called **aneuploidy**. The chromosome number is now off by one (or a few) — for example, **Down’s syndrome** comes from the *gain* of an extra copy of chromosome 21, and **Turner’s syndrome** comes from the *loss* of an X chromosome in human females.\n\nGaining an extra chromosome is called **trisomy** (three copies where there should be two). Lacking one of a pair is called **monosomy** (one copy where there should be two). Both are aneuploidy — just in opposite directions.\n\nThere is a second, larger kind of error. If **cytokinesis fails after the telophase stage** of cell division — that is, the chromosomes duplicate but the cell never splits — the organism ends up with an increase in a **whole set of chromosomes**. This is called **polyploidy**, and it is often seen in **plants**. Keep the two apart in your head: aneuploidy shifts the count by *one chromosome*; polyploidy adds an *entire set*.",
    },
    {
      id: '8e0a6c1d-3f57-4920-9b4e-4c9b2e7f01b5',
      type: 'heading',
      order: 5,
      text: 'The Three Classic Syndromes',
      level: 2,
      objective: 'How do trisomy 21, an extra X, and a missing X each show up in a person?',
    },
    {
      id: 'f1a7c3e9-4d82-4b60-8e51-6a9d0c2f5b37',
      type: 'text',
      order: 6,
      markdown: "NCERT names three common examples of chromosomal disorders. Learn all three together — they are a favourite because they are so easy to confuse.\n\n**Down’s syndrome** is caused by the presence of an **additional copy of chromosome number 21** — a **trisomy of 21**, so the total climbs to 47. It was first described by **Langdon Down (1866)**. The affected person is **short statured with a small round head**, a **furrowed tongue** and a **partially open mouth**. The **palm is broad with a characteristic palm crease**. Physical, psychomotor and mental development is retarded.\n\n**Klinefelter’s syndrome** is caused by the presence of an **additional copy of the X chromosome**, giving a karyotype of **47, XXY**. The individual has **overall masculine development**, but **feminine development is also expressed** — including breast development, called **gynaecomastia**. Such individuals are **sterile**.\n\n**Turner’s syndrome** is caused by the **absence of one of the X chromosomes**, giving **45, with X0**. Such **females are sterile**, as the **ovaries are rudimentary**, along with a **lack of other secondary sexual characters**.",
    },
    {
      id: '1f7c3e9a-8e0a-4c1d-9b4e-7d2c1a6f08b5',
      type: 'table',
      order: 7,
      caption: '📌The three chromosomal disorders at a glance — the exact rows NEET pulls from.',
      headers: ['Disorder', 'Karyotype', 'Chromosome count', 'Key features'],
      rows: [
        ['Down’s syndrome', 'Trisomy of chromosome 21 (an extra 21)', '47', 'Short stature; small round head; furrowed tongue; partially open mouth; broad palm with a characteristic palm crease; physical, psychomotor and mental development retarded. First described by Langdon Down (1866).'],
        ['Klinefelter’s syndrome', '47, XXY (an extra X)', '47', 'Overall masculine build, but feminine development also shows — breast development (gynaecomastia). Individuals are sterile.'],
        ['Turner’s syndrome', '45, X0 (one X missing)', '45', 'Sterile females; ovaries rudimentary; lack of other secondary sexual characters.'],
      ],
    },
    {
      id: '6b1d4f8e-2c07-49a3-8e64-9f0a5c3b7d12',
      type: 'reasoning_prompt',
      order: 8,
      reasoning_type: 'logical',
      prompt: 'A human gamete is found carrying 24 chromosomes instead of the normal 23. Which event during cell division best explains how it got that extra chromosome?',
      options: [
        'Non-disjunction — the chromatids failed to segregate, so this cell gained a chromosome while its partner lost one',
        'Failure of cytokinesis after telophase, which adds a whole extra set of chromosomes',
        'Crossing over between homologous chromosomes during meiosis',
        'Independent assortment of the two chromosome pairs into the gamete',
      ],
      reveal: "The right answer is the first. Non-disjunction is the failure of chromatids to separate during division, so one cell ends up with a chromosome too many (24) and the other with one too few (22) — that is exactly how aneuploidy arises. The second option is the trap: failure of cytokinesis does add chromosomes, but a *whole set* at once (polyploidy), which would give far more than a single extra — not one chromosome. Crossing over and independent assortment are normal, healthy meiotic events that reshuffle genes without changing the chromosome count.",
      difficulty_level: 2,
    },
    {
      id: 'a3e7c9f0-5b42-4681-9d3f-7c0e2a8b16d4',
      type: 'callout',
      order: 9,
      variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Down’s syndrome = trisomy of chromosome 21.** An extra 21, so **47** chromosomes total. First described by Langdon Down (1866).\n- **Klinefelter’s syndrome = 47, XXY.** An extra X. Masculine build but gynaecomastia shows; **sterile**.\n- **Turner’s syndrome = 45, X0.** One X missing. **Sterile female**, ovaries rudimentary.\n- **Aneuploidy** = gain/loss of a chromosome (from non-disjunction). **Polyploidy** = a whole extra set (from failed cytokinesis; common in plants).\n- Normal human cell = **46 chromosomes = 23 pairs = 22 autosome pairs + 1 sex-chromosome pair**.",
    },
    {
      id: 'c0f4a7d1-6b39-4e28-8a05-1d7e2c9b6f30',
      type: 'callout',
      order: 10,
      variant: 'exam_tip',
      title: 'How NEET Uses This Page',
      markdown: "**Down’s syndrome:** trisomy of **21**, total **47** — NEET checks whether you know the *chromosome number* (21), not just the name.\n**Klinefelter’s:** **47, XXY**, masculine + gynaecomastia, sterile. Watch the swap trap: XXY is Klinefelter, NOT Turner.\n**Turner’s:** **45, X0**, sterile female, rudimentary ovaries. The mirror image of Klinefelter — X *missing* vs X *extra*.\n**Aneuploidy vs polyploidy:** aneuploidy = one chromosome off (failed segregation of chromatids); polyploidy = whole set added (failed cytokinesis, seen in plants). NEET loves this exact pair.\n\n**Classic NEET question:** \"An individual with the karyotype 47, XXY is affected by —\" → **Klinefelter’s syndrome** (not Turner’s, which is 45, X0).",
    },
    {
      id: '0d8b3a6e-9c41-42f7-8b05-1e6f9a2c7d3b',
      type: 'inline_quiz',
      order: 11,
      pass_threshold: 0.67,
      questions: [
        {
          id: '5f2a9c7e-0b83-4d61-9e47-2c8b0f3a6d95',
          question: 'Down’s syndrome is caused by —',
          options: [
            'trisomy of chromosome 21 (an extra copy of chromosome 21)',
            'monosomy of chromosome 21 (a missing chromosome 21)',
            'the karyotype 45, X0',
            'the karyotype 47, XXY',
          ],
          correct_index: 0,
          explanation: "Down’s syndrome is the presence of an additional copy of chromosome 21 — trisomy of 21 — bringing the total to 47. The 47, XXY option is the trap: that is Klinefelter’s syndrome, a sex-chromosome disorder, while 45, X0 is Turner’s. Down’s involves an autosome (21), not the sex chromosomes.",
          difficulty_level: 1,
        },
        {
          id: 'c8d1e6b3-4a09-42f7-8b25-6e0c9a1f3d78',
          question: 'An individual has the karyotype 47, XXY, showing an overall masculine build together with breast development (gynaecomastia), and is sterile. This is —',
          options: [
            'Turner’s syndrome',
            'Klinefelter’s syndrome',
            'Down’s syndrome',
            'a normal male karyotype',
          ],
          correct_index: 1,
          explanation: "47, XXY means an extra X chromosome — Klinefelter’s syndrome, with masculine development plus gynaecomastia, and sterility. Turner’s is the tempting swap, but it is the opposite: 45, X0, an X *missing*, in a sterile female. A normal male is 46, XY, not 47.",
          difficulty_level: 2,
        },
        {
          id: '2a7f0c9d-6b41-4e83-9d52-8c1b3f7a0e64',
          question: 'Turner’s syndrome in human females results from —',
          options: [
            'an additional copy of chromosome 21',
            'the presence of an extra X chromosome (XXY)',
            'the absence of one of the X chromosomes (X0)',
            'failure of cytokinesis producing a whole extra chromosome set',
          ],
          correct_index: 2,
          explanation: "Turner’s syndrome is caused by the loss of one X chromosome — 45, with X0 — giving a sterile female with rudimentary ovaries. The XXY option is the mirror-image trap (that is Klinefelter’s, an X *added*). Failure of cytokinesis causes polyploidy, an entire extra set, not the loss of a single X.",
          difficulty_level: 2,
        },
        {
          id: '9e3b6d0a-1c87-4f25-8a94-0d7c2e6b1f43',
          question: 'The gain or loss of a single chromosome, caused by failure of the chromatids to segregate during cell division, is called —',
          options: [
            'polyploidy',
            'a monohybrid cross',
            'linkage',
            'aneuploidy',
          ],
          correct_index: 3,
          explanation: "Aneuploidy is the gain or loss of a chromosome that follows from failure of segregation of chromatids (non-disjunction). Polyploidy is the trap: it also changes chromosome number, but it adds a *whole set* and comes from failed cytokinesis, not a single failed segregation. Monohybrid cross and linkage are unrelated Mendelian/gene-level ideas.",
          difficulty_level: 1,
        },
      ],
    },
  ],
};
