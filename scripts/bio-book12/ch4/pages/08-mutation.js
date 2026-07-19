'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'mutation',
  title: 'Mutation — the Source of New Variation',
  subtitle: "How a change in the DNA itself creates brand-new variation — the three kinds NCERT names (chromosomal aberration, point mutation, frame-shift), why one wrong letter can cripple a whole protein, and what a mutagen is.",
  page_number: 8,
  page_type: 'lesson',
  tags: ['mutation', 'variation', 'point-mutation', 'frame-shift', 'mutagen'],
  glossary: [
    { term: 'mutation', definition: 'A change or alteration in the DNA sequence (the genetic material). It changes the genotype, and often the phenotype, of an organism, and is a source of new variation.' },
    { term: 'point mutation', definition: 'A mutation caused by a change in a single base pair of DNA. Sickle-cell anaemia is the classic example NCERT gives.' },
    { term: 'frame-shift mutation', definition: 'A mutation caused by the deletion (loss) or insertion (gain) of base pairs in DNA, which shifts the way the whole sequence downstream is read.' },
    { term: 'chromosomal aberration', definition: 'An abnormality in a chromosome caused by loss (deletion) or gain (insertion/duplication) of a segment of DNA. Such aberrations are commonly observed in cancer cells.' },
    { term: 'mutagen', definition: 'Any chemical or physical factor that induces (causes) mutations. UV radiation is an example of a mutagen.' },
    { term: 'sickle-cell anaemia', definition: 'A disorder caused by a point mutation — a single base change (GAG to GUG) that swaps one amino acid in the beta-globin chain of haemoglobin.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A long strand of DNA fading into darkness with one rung glowing a different colour, hinting at a single changed letter in the genetic code',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single elegant DNA double helix stretches across the frame, receding into a deep dark background (#0a0a0a base tones). Most of its rungs glow a calm, uniform cool blue-white, but at one point along the ladder a single rung glows a warm distinct colour (amber/orange), quietly signalling one changed 'letter' in an otherwise perfect code. Faint particles of light drift near that one rung. Painterly, atmospheric, scientific and beautiful rather than clinical. No text, no labels, no letters, no diagram callouts.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'One Letter Out of Three Billion',
      markdown: "Your DNA is a message written in about three billion letters. Copy it perfectly, generation after generation, and nothing new ever appears. But every so often a letter changes — swapped, dropped, or added. That tiny slip is a **mutation**, and it is one of the few ways genuinely *new* variation enters a species. Sometimes the change does nothing. Sometimes, as in sickle-cell anaemia, a single wrong letter is enough to change a person's blood for life.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "**Mutation** is a phenomenon that results in an **alteration of the DNA sequence**, and so changes the **genotype** and often the **phenotype** of an organism. Recall that recombination (from crossing over and independent assortment) shuffles the genes you already have into new combinations. Mutation is different — it doesn't just reshuffle, it **creates a brand-new version of the DNA that wasn't there before**. That is why NCERT lists it, alongside recombination, as a phenomenon that **leads to variation in DNA**.\n\nSo hold this distinction in your head: recombination deals a new hand from the same deck of cards; mutation actually prints a new card.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Three Ways the DNA Text Can Change',
      objective: "By the end of this you can tell apart a chromosomal aberration, a point mutation, and a frame-shift mutation — and say which one changes a single base pair and which one shifts the whole reading.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**1. Chromosomal aberrations.** A single DNA helix runs continuously from one end of a chromatid to the other, tightly supercoiled. So if a **whole segment of DNA is lost (deletion)** or **gained (insertion or duplication)**, the chromosome itself is altered. Because genes sit on chromosomes, altering the chromosome produces abnormalities called **chromosomal aberrations**. NCERT gives one telling fact here: **chromosomal aberrations are commonly observed in cancer cells.**",
    },
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "**2. Point mutation.** A mutation can also arise from a change in just a **single base pair** of DNA. This is a **point mutation**. Small as it sounds, its classic example is **sickle-cell anaemia** — a single base change that reshapes the haemoglobin protein.\n\n**3. Frame-shift mutation.** When base pairs are **deleted or inserted** into the DNA, they cause **frame-shift mutations**. The bases of DNA are read in fixed groups (a 'reading frame'). Add or remove even one base and every group after that point is read wrongly — like deleting one letter from a sentence and re-spacing everything after it into nonsense.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 6, src: '',
      alt: 'Two rows of DNA letters comparing a point mutation with a frame-shift mutation',
      caption: '📸 Tap each dot to explore how one wrong letter (point mutation) differs from one missing or extra letter (frame-shift).',
      generation_prompt: "Scientific textbook illustration comparing point mutation and frame-shift mutation. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines and white text. Show a reference DNA base sequence at the top as evenly spaced letters in reading groups of three (e.g. A T G | C A T | G G A) coloured purple for nucleic acid. Below it, a LEFT panel titled area showing a POINT MUTATION: the same sequence with exactly ONE letter changed (highlighted in amber/orange), the reading groups still aligned. A RIGHT panel showing a FRAME-SHIFT MUTATION: the same sequence with one letter INSERTED (or deleted), highlighted in amber, and every group after it re-shifted so the downstream letters regroup differently. Use thin white leader lines. Purple=DNA bases, amber=the changed/added base. No photorealism, no cartoon, no mascots, biologically clean.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.15, label: 'The original code', detail: "The undamaged DNA read in fixed groups. Every group is correct, so the right protein is built.", icon: 'circle' },
        { id: uuid(), x: 0.25, y: 0.55, label: 'Point mutation', detail: "**One base pair is swapped** for another. Only that single spot changes — the reading groups after it stay aligned. This is what happens in sickle-cell anaemia.", icon: 'circle' },
        { id: uuid(), x: 0.25, y: 0.82, label: 'Local damage', detail: "Because only one letter changed, at most one 'word' is misread. The rest of the message is untouched.", icon: 'circle' },
        { id: uuid(), x: 0.75, y: 0.55, label: 'Frame-shift mutation', detail: "**A base pair is inserted or deleted.** This is not a swap — it adds or removes a letter, so the reading frame slips.", icon: 'circle' },
        { id: uuid(), x: 0.75, y: 0.82, label: 'Everything downstream shifts', detail: "From the point of change onward, every group is re-read wrongly. A single missing or extra base can ruin the whole rest of the message.", icon: 'circle' },
      ],
    },
    {
      id: uuid(), type: 'comparison_card', order: 7, title: 'Point Mutation vs Frame-shift Mutation',
      columns: [
        { heading: 'Point mutation', points: [
          'Caused by a change in a single base pair.',
          'One base is substituted (swapped) for another.',
          'The reading frame stays intact — groups after it are unaffected.',
          "NCERT's classic example: sickle-cell anaemia.",
        ] },
        { heading: 'Frame-shift mutation', points: [
          'Caused by deletion or insertion of base pairs.',
          'A base is removed or added, not merely swapped.',
          'The reading frame shifts — everything downstream is misread.',
          'Named in NCERT alongside point mutation as a type of gene mutation.',
        ] },
      ],
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "**What actually causes mutations?** NCERT keeps the deep mechanism out of scope at this level, but it names the culprits. Many **chemical and physical factors** can induce mutations, and any such factor is called a **mutagen**. The example to remember: **UV radiation can cause mutations — it is a mutagen.** So a mutation isn't always a random internal slip; a mutagen from the outside can force one.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "In sickle-cell anaemia, only a single DNA base changes (GAG becomes GUG), swapping one amino acid — glutamic acid for valine — at just one position in the beta-globin chain. Why can such a tiny change cause a serious disease?",
      options: [
        "Because a single wrong amino acid can change the protein's behaviour — here it makes haemoglobin polymerise and deform the red blood cell",
        "Because a single base change always deletes the entire gene",
        "Because a point mutation shifts the reading frame and scrambles the whole protein",
        "Because glutamic acid and valine are found only in nerve cells, not in blood",
      ],
      reveal: "A protein's job depends on its exact sequence of amino acids. Change even one (Glu to Val at the sixth position of the beta-globin chain) and the mutant haemoglobin can polymerise under low oxygen, turning the red blood cell from a biconcave disc into a rigid sickle shape — that is the disease. The tempting wrong answer is the third: it describes a frame-shift, not a point mutation. A point mutation is a single-base swap that does NOT shift the reading frame, so the rest of the protein is read normally — the harm comes from that one changed amino acid, not from scrambling everything downstream.",
      difficulty_level: 3,
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'Lock These In',
      markdown: "- **Mutation** = a change in the genetic material (DNA), altering genotype and phenotype. It is a source of **new variation**, alongside recombination.\n- **Chromosomal aberration** = loss (deletion) or gain (insertion/duplication) of a DNA segment → alters the chromosome. **Commonly seen in cancer cells.**\n- **Point mutation** = change in a **single base pair**. Classic example: **sickle-cell anaemia**.\n- **Frame-shift mutation** = **deletion or insertion** of base pairs → shifts the reading of everything after it.\n- **Mutagen** = a chemical or physical factor that induces mutations. Example: **UV radiation**.",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Point vs frame-shift — the #1 trap:** point mutation = **single base pair change (substitution)**; frame-shift = **deletion/insertion** of bases. Examiners deliberately swap these two definitions.\n\n**Sickle-cell = point mutation**, never frame-shift. Fix this pairing firmly.\n\n**Chromosomal aberrations → cancer cells.** This exact association is lifted straight from NCERT.\n\n**Mutagen:** a factor (chemical or physical) that *causes* mutation; **UV radiation** is the NCERT example.\n\n**Classic NEET question:** \"Insertion or deletion of base pairs in DNA causes which type of mutation?\" → **Frame-shift mutation.**",
    },
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "So variation reaches a species by two routes: recombination reshuffles existing genes, and mutation creates altogether new ones — sometimes harmless, sometimes, like sickle-cell anaemia, the root of a lifelong disorder. That last link is the doorway to the next page: how such altered genes and chromosomes are passed down as **genetic disorders**, and how we trace them through a family using **pedigree analysis**.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'A mutation caused by the deletion or insertion of base pairs in DNA is called:',
          options: [
            'A point mutation',
            'A chromosomal aberration',
            'A frame-shift mutation',
            'A recombination',
          ],
          correct_index: 2,
          explanation: "NCERT states that deletions and insertions of base pairs of DNA cause frame-shift mutations, because adding or removing bases shifts how the rest of the sequence is read. A point mutation is a single base-pair change (a swap, not an insertion/deletion), and recombination is a reshuffling of existing genes, not a change in the DNA sequence itself.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Sickle-cell anaemia is the classic NCERT example of which kind of mutation?',
          options: [
            'Point mutation (change in a single base pair)',
            'Frame-shift mutation (insertion of bases)',
            'Chromosomal aberration (loss of a whole segment)',
            'A mutation caused only by UV radiation',
          ],
          correct_index: 0,
          explanation: "NCERT names sickle-cell anaemia as the classical example of a point mutation — a change in a single base pair (GAG to GUG). It is not a frame-shift, because no base is inserted or deleted; the reading frame is intact. It is not a chromosomal aberration, and NCERT does not attribute it to UV radiation.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Chromosomal aberrations, caused by loss or gain of a DNA segment, are noted by NCERT as being commonly observed in:',
          options: [
            'Nerve cells',
            'Muscle cells',
            'Red blood cells only',
            'Cancer cells',
          ],
          correct_index: 3,
          explanation: "NCERT specifically states that chromosomal aberrations are commonly observed in cancer cells. These aberrations arise when a whole segment of DNA is deleted or duplicated, altering the chromosome. The other cell types are distractors not linked to this statement in the text.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which of the following correctly describes a mutagen?',
          options: [
            'A gene that reshuffles during crossing over',
            'A chemical or physical factor that induces mutations, such as UV radiation',
            'A red blood cell that has become sickle-shaped',
            'A segment of a chromosome that has been duplicated',
          ],
          correct_index: 1,
          explanation: "NCERT defines mutagens as chemical and physical factors that induce mutations, and gives UV radiation as an example. The other options confuse a mutagen with a result or a component of mutation — a sickled RBC is an effect of a mutation, and a duplicated segment is a type of aberration, not the factor that causes one.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
