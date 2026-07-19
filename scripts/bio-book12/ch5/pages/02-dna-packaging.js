'use strict';
/**
 * Class 12 Biology — Chapter 5: Molecular Basis of Inheritance
 * Page 2 — Packing 2 Metres into a Nucleus: DNA Packaging.
 *
 * Source of truth: NCERT Class 12 Ch.5 (lebo105.txt), §5.1.2 "Packaging of
 * DNA Helix" — the paragraphs on the ~2.2 m of DNA in a mammalian cell, the
 * prokaryotic nucleoid, positively charged histones (rich in lysine and
 * arginine), the histone octamer, the nucleosome (~200 bp), the beads-on-
 * string chromatin, chromatin fibres → chromosomes, NHC proteins, and
 * euchromatin vs heterochromatin. NCERT Figs 5.4a (Nucleosome) and 5.4b
 * (EM 'beads-on-string'). Rule 0: every fact here traces to that text;
 * nothing invented.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'packaging-of-dna-the-nucleosome',
  title: 'Packing 2 Metres into a Nucleus — DNA Packaging',
  subtitle: "Stretched out, the DNA in one of your cells is over two metres long — yet it fits inside a nucleus you could line up a million of across a millimetre. This page shows the trick: wrap it around protein spools, then coil the spools.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['dna-packaging', 'nucleosome', 'histones', 'chromatin', 'euchromatin', 'heterochromatin', 'molecular-basis-of-inheritance'],
  glossary: [
    { term: 'histone', definition: 'A positively charged (basic) protein rich in the amino acids lysine and arginine. Eight histone molecules join to form the octamer that DNA wraps around.' },
    { term: 'histone octamer', definition: 'A unit of eight histone molecules. The negatively charged DNA wraps around this positively charged core to form a nucleosome.' },
    { term: 'nucleosome', definition: 'The repeating unit of chromatin — a stretch of about 200 base pairs of DNA wrapped around one histone octamer. Under an electron microscope, nucleosomes look like beads on a string.' },
    { term: 'chromatin', definition: 'The threadlike, stainable material in the nucleus made of repeating nucleosomes. It is further packed into chromatin fibres and, at cell division, into chromosomes.' },
    { term: 'NHC proteins', definition: 'Non-histone Chromosomal proteins — an additional set of proteins needed to package chromatin at levels higher than the nucleosome.' },
    { term: 'euchromatin', definition: 'Chromatin that is loosely packed, stains light, and is transcriptionally active.' },
    { term: 'heterochromatin', definition: 'Chromatin that is densely packed, stains dark, and is transcriptionally inactive.' },
  ],
  blocks: [
    {
      id: '7a1c3e5f-2b4d-4a6f-8c1e-9d0b2f3a4c5d',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A single glowing thread of DNA coiling tighter and tighter into a compact bundle inside a dark cell nucleus',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single luminous thread of DNA, impossibly long, sweeping in from one side of the frame and progressively coiling — first loosely, then into tight spools, then into a dense compact bundle — as it disappears into the rounded shadow of a cell nucleus on the far side. The thread glows a soft cool blue-violet against a deep near-black background (#0a0a0a base). Painterly and atmospheric, a sense of vast length being tamed into a tiny space, shallow depth of field, faint particulate haze in the dark air. No text, no labels, no diagram elements.",
    },
    {
      id: '8b2d4f60-3c5e-4b7a-9d2f-0e1c3a4b5d6e',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'Two Metres In A Ten-Millionth Of A Metre',
      markdown: "Line up all the base pairs of the DNA in one human cell — about **6.6 × 10⁹** of them, each pair **0.34 nm** apart — and the double helix comes out roughly **2.2 metres** long. That thread has to fit inside a nucleus only about **10⁻⁶ m** across. It's like stuffing a two-kilometre rope into a cricket ball without tangling it into a useless knot. Nature's answer is not to shove it in, but to **wind it neatly around spools** — and that single idea is what this page is about.",
    },
    {
      id: '9c3e5a71-4d6f-4c8b-8e3a-1f2d4b5c6e7f',
      type: 'text',
      order: 2,
      markdown: "Start with the problem in numbers. Take the distance between two neighbouring base pairs as **0.34 nm**, multiply by the **6.6 × 10⁹** base pairs in a typical mammalian cell, and you get a DNA double helix about **2.2 metres** long. The nucleus it must live in is around **10⁻⁶ m** wide. So how does such a long polymer get packaged into such a tiny space?\n\nThe key is a simple physics fact: **opposite charges attract**. **DNA carries a negative charge** all along its backbone. So the cell holds it in place using proteins that carry the **opposite (positive) charge**. In prokaryotes like *E. coli* — which have no proper nucleus — the DNA is not left scattered around the cell; it is held with positively charged proteins in a region called the **nucleoid**, organised into large loops. In eukaryotes the same charge trick is used, but the packaging is far more organised and elegant.",
    },
    {
      id: 'a4d6b082-5e70-4d9c-9f4b-2a3e5c6d7e80',
      type: 'heading',
      order: 3,
      level: 2,
      text: 'Histones — the Positively Charged Spools',
      objective: "By the end of this you can explain how DNA and histones snap together to build a nucleosome, and why it takes about 200 base pairs.",
    },
    {
      id: 'b5e7c193-6f81-4e0d-8a5c-3b4f6d7e8f91',
      type: 'text',
      order: 4,
      markdown: "In eukaryotes the packaging proteins are a set of **positively charged, basic proteins called histones**. Why are they positive? A protein's charge comes from the amino acids in it, and histones are especially **rich in two basic amino acid residues — lysine and arginine**. Both of these carry **positive charges** on their side chains, so the whole histone protein ends up positively charged.\n\nHistones don't work alone. Eight histone molecules organise into a single unit called a **histone octamer** (*octa* = eight). Now bring the two together: the **negatively charged DNA wraps around the positively charged histone octamer**, and that wrapped unit is called a **nucleosome**. A typical nucleosome holds about **200 base pairs** of DNA coiled around its octamer core.\n\nThese nucleosomes are not one-offs. They repeat, over and over, along the DNA — the nucleosome is the **repeating unit** of a nuclear structure called **chromatin** (the threadlike, stainable bodies you see in the nucleus). Under an **electron microscope**, this string of repeating nucleosomes looks exactly like **‘beads on a string’** — each bead is a nucleosome, and the string is the DNA running between them.",
    },
    {
      id: 'c6f8d2a4-7092-4f1e-9b6d-4c5a7e8f9002',
      type: 'interactive_image',
      order: 5,
      src: '',
      alt: 'Beads-on-string chromatin showing DNA wrapped around histone octamers to form nucleosome beads connected by strands of DNA',
      caption: '📸 Tap each dot to explore the spool, the wrapped DNA, and the beads-on-string chromatin',
      generation_prompt: "Scientific textbook illustration combining NCERT Fig 5.4a (a single nucleosome) and Fig 5.4b (the 'beads-on-string' chromatin), shown as one continuous diagram. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Draw a horizontal DNA double strand (a thin purple double line, purple = nucleic acid) that repeatedly wraps almost two turns around a cluster of eight small rounded protein subunits (the histone octamer, drawn as a compact ball of eight pale-grey spheres), forming a row of three to four identical bead-like nucleosomes evenly spaced along the strand. Between consecutive beads the DNA runs as a short straight double-line connector (the linker DNA). To one side, enlarge a single nucleosome to show clearly that the purple DNA makes roughly two coils around the grey octamer core. In a lower band, show the same string of beads gathered and twisting together into a thicker coiled rope to suggest a higher-order chromatin fibre. Clean white outlines throughout, biologically accurate proportions. Functional colours: purple for DNA (nucleic acid), pale grey for the histone protein core. No text or labels baked into the image, no photorealism, no cartoon, standard biology textbook illustration style.",
      hotspots: [
        { id: '3d6f491b-e709-4a8f-8234-b321e556f779', x: 0.24, y: 0.44, label: 'Histone octamer', detail: "The **spool** — a unit of **eight histone molecules** clustered together. Because histones are rich in **lysine and arginine**, this core is **positively charged**, which is exactly what lets the negatively charged DNA wrap tightly onto it.", icon: 'circle' },
        { id: '4e70502c-f81a-4b90-9345-c432f6670881', x: 0.24, y: 0.24, label: 'DNA wrapped (~200 bp)', detail: "The negatively charged **DNA double helix coils around** the octamer — about **200 base pairs** per turn-set. Opposite charges attract, so the wrap is stable. This is how a very long thread starts getting shortened.", icon: 'circle' },
        { id: '5f81613d-092b-4ca1-a456-d54307719912', x: 0.5, y: 0.42, label: 'Nucleosome (the bead)', detail: "**DNA wrapped around one histone octamer = one nucleosome.** It is the **repeating unit** of chromatin and shows up as a single ‘bead’ under the electron microscope.", icon: 'circle' },
        { id: '6092724e-1a3c-4db2-8567-e65418820013', x: 0.64, y: 0.3, label: 'Linker DNA (the string)', detail: "The stretch of **DNA running between two neighbouring beads**. It is the ‘string’ in the beads-on-string picture — the same double helix, simply not yet wrapped around a spool.", icon: 'circle' },
        { id: '71a3835f-2b4d-4ec3-9678-f76529931124', x: 0.78, y: 0.24, label: 'Beads-on-string chromatin', detail: "A row of repeating nucleosomes along the DNA. Seen under an **electron microscope (EM)**, chromatin looks exactly like **beads on a string** — this is the first, loosest level of packing.", icon: 'circle' },
        { id: '82b49460-3c5e-4fd4-ab89-08763a042235', x: 0.5, y: 0.82, label: 'Chromatin fibre', detail: "The beads-on-string is coiled and gathered into a **thicker chromatin fibre**. Coiled and condensed further at the metaphase stage of cell division, these fibres become the **chromosomes**.", icon: 'circle' },
      ],
    },
    {
      id: 'd709e3b5-81a3-4a2f-8c7e-5d6b8f900113',
      type: 'heading',
      order: 6,
      level: 2,
      text: 'From Beads to Chromosome — and Two Kinds of Chromatin',
      objective: "By the end of this you can trace the packing from beads-on-string up to a chromosome, and tell euchromatin from heterochromatin by both look and activity.",
    },
    {
      id: 'e81af4c6-92b4-4b3a-9d8f-6e7c9001a224',
      type: 'text',
      order: 7,
      markdown: "The beads-on-string is only the first level. That string is **packed into chromatin fibres**, and these fibres are **further coiled and condensed at the metaphase stage** of cell division to form the **chromosomes** you can actually see under a light microscope. Getting chromatin packed this tightly at the higher levels needs help from an **additional set of proteins**, referred to together as **Non-histone Chromosomal (NHC) proteins**. (Histones do the nucleosome level; NHC proteins take it higher.)\n\nLook closely at a nucleus and you'll notice the chromatin is not packed evenly everywhere. **Some regions are loosely packed and stain light** — this is called **euchromatin**. **Other regions are more densely packed and stain dark** — this is **heterochromatin**. And the difference is not just how they look: **euchromatin is transcriptionally active** (its genes can be read), while **heterochromatin is transcriptionally inactive** (its genes are switched off). Loose and light means busy; dense and dark means quiet — that pairing is the whole point.\n\nWith the DNA now safely packed, the next big question is the one biologists spent decades on: how did we even prove that **DNA** — and not protein — is the genetic material? That's where we go next.",
    },
    {
      id: 'f92b05d7-a3c5-4c4b-8e90-7f8da112b335',
      type: 'comparison_card',
      order: 8,
      title: 'Euchromatin vs Heterochromatin',
      columns: [
        {
          heading: 'Euchromatin',
          points: [
            'Loosely packed chromatin',
            'Stains light (lighter regions of the nucleus)',
            'Transcriptionally ACTIVE — its genes can be read',
            'Think: loose + light = busy',
          ],
        },
        {
          heading: 'Heterochromatin',
          points: [
            'Densely packed chromatin',
            'Stains dark (darker regions of the nucleus)',
            'Transcriptionally INACTIVE — its genes are switched off',
            'Think: dense + dark = quiet',
          ],
        },
      ],
    },
    {
      id: '0a3c16e8-b4d6-4d5c-9f01-809eb223c446',
      type: 'reasoning_prompt',
      order: 9,
      reasoning_type: 'logical',
      prompt: "DNA wraps tightly onto the histone octamer, but it does not stick to just any protein in the cell. From what you've read, what is the single most important reason histones — and not ordinary proteins — are the ones DNA winds around?",
      options: [
        "Histones are the largest proteins in the nucleus, so DNA physically drapes over them by size alone",
        "DNA is negatively charged and histones are positively charged (rich in lysine and arginine), so opposite charges attract and the DNA winds tightly onto them",
        "Histones and DNA are both negatively charged, and like charges lock together to form a rigid spool",
        "Histones chemically cut the DNA into 200 bp pieces, and each piece then coils on its own",
      ],
      reveal: "It comes down to charge. DNA's backbone is negatively charged; histones are basic proteins made positive by their many lysine and arginine residues. Opposite charges attract, so the DNA wraps snugly around the positively charged octamer — that electrostatic pull is what holds a nucleosome together. Size isn't the reason (it's charge, not bulk). Two negatives would repel, not bind, so 'both negative' is wrong. And histones don't cut DNA — the ~200 bp figure is just how much DNA fits around one octamer, not a piece that was snipped off.",
      difficulty_level: 2,
    },
    {
      id: '1b4d27f9-c5e7-4e6d-8012-910fc334d557',
      type: 'callout',
      order: 10,
      variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Length problem:** ~**2.2 m** of DNA (6.6 × 10⁹ bp × 0.34 nm) must fit a ~**10⁻⁶ m** nucleus.\n- **Charge trick:** DNA is **negative**; histones are **positive** (basic; rich in **lysine + arginine**).\n- **Histone octamer:** **8** histone molecules = one spool.\n- **Nucleosome:** DNA wrapped around one octamer; **~200 bp** per nucleosome; it is the **repeating unit of chromatin**.\n- **Beads-on-string:** how nucleosomes look under the **EM** (beads = nucleosomes, string = DNA).\n- **Higher packing:** beads-on-string → **chromatin fibres** → coiled/condensed at **metaphase** → **chromosomes**; needs **NHC proteins**.\n- **Euchromatin** = loose, light, **active**. **Heterochromatin** = dense, dark, **inactive**.",
    },
    {
      id: '2c5e380a-d6f8-4f7e-9123-a210d445e668',
      type: 'callout',
      order: 11,
      variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Numbers NEET lifts verbatim:** a nucleosome contains about **200 bp** of DNA; a **histone octamer** has **8** histone molecules; histones are rich in **lysine and arginine**. These exact values are favourite one-mark stems.\n\n**The euchromatin ↔ heterochromatin swap trap:** questions love to flip the pair — e.g. 'heterochromatin is loosely packed and active'. Fix it once: **euchromatin = loosely packed, light-staining, transcriptionally ACTIVE**; **heterochromatin = densely packed, dark-staining, INACTIVE**. Any option that pairs 'dense/dark' with 'active', or 'loose/light' with 'inactive', is wrong.\n\n**Classic NEET question:** \"The repeating unit of chromatin is the ______, which contains about 200 bp of DNA wrapped around a core of ______ histone molecules.\" → **nucleosome; eight (histone octamer)**.\n\n**Don't mix up the proteins:** the nucleosome level uses **histones**; the *higher-order* packing needs **NHC (Non-histone Chromosomal) proteins**. A question asking which proteins package chromatin at higher levels wants NHC, not histones.",
    },
    {
      id: '3d6f491b-e709-4a8f-8234-b321e556f77a',
      type: 'inline_quiz',
      order: 12,
      pass_threshold: 0.67,
      questions: [
        {
          id: '93c5a571-4d6f-4a05-8c9a-19874b153346',
          question: 'About how many base pairs of DNA are wrapped around one histone octamer to form a typical nucleosome?',
          options: ['200 bp', '8 bp', '20 bp', '6.6 × 10⁹ bp'],
          correct_index: 0,
          explanation: "A typical nucleosome contains about 200 bp of DNA wrapped around its octamer core. The '8' is the number of histone molecules in the octamer (not base pairs), '20 bp' is simply too small to wrap a spool, and 6.6 × 10⁹ bp is the total DNA content of the whole mammalian cell — not one nucleosome.",
          difficulty_level: 1,
        },
        {
          id: 'a4d6b682-5e70-4b16-9dab-2a985c264457',
          question: 'Why does DNA wind tightly around the histone octamer?',
          options: [
            'Both DNA and histones are negatively charged, and like charges bind',
            'Histones are neutral, so DNA sticks to them by simple friction',
            'DNA is negatively charged and histones are positively charged, so opposite charges attract',
            'DNA is positively charged and histones are negatively charged, so opposite charges attract',
          ],
          correct_index: 2,
          explanation: "DNA carries a negative charge; histones are basic, positively charged proteins (rich in lysine and arginine). Opposite charges attract, so the DNA wraps onto the octamer. It is DNA that is negative and histones that are positive — not the reverse — and two like charges would repel rather than bind, so the 'both negative' option is wrong.",
          difficulty_level: 2,
        },
        {
          id: 'b5e7c793-6f81-4c27-8ebc-3ba96d375568',
          question: 'A student writes: "Heterochromatin is loosely packed, stains light, and is transcriptionally active." What is wrong?',
          options: [
            'Nothing — that description is correct for heterochromatin',
            'Every part is swapped: heterochromatin is densely packed, stains dark, and is transcriptionally inactive; the description actually fits euchromatin',
            'Only the staining is wrong — heterochromatin stains dark, but it is indeed loosely packed and active',
            'Only the activity is wrong — heterochromatin is loosely packed and light, but it is inactive',
          ],
          correct_index: 1,
          explanation: "The statement describes euchromatin, not heterochromatin. Heterochromatin is densely packed, stains dark, and is transcriptionally inactive — all three features are the opposite of what the student wrote. It is not just the staining or just the activity that is wrong; the whole trio is swapped, which is exactly the trap NEET sets.",
          difficulty_level: 3,
        },
        {
          id: 'c6f8d8a4-7092-4d38-9fcd-4cba7e486679',
          question: 'Packaging chromatin at levels higher than the nucleosome (into chromatin fibres and chromosomes) requires an additional set of proteins. What are they called?',
          options: [
            'Histones (the same eight that form the octamer)',
            'Non-histone Chromosomal (NHC) proteins',
            'Lysine and arginine residues',
            'RNA polymerase proteins',
          ],
          correct_index: 1,
          explanation: "The higher-order packing needs Non-histone Chromosomal (NHC) proteins, an additional set beyond the histones. Histones build the nucleosome level, not the higher levels; lysine and arginine are amino acids inside histones (not separate packaging proteins); and RNA polymerase is a transcription enzyme, unrelated to DNA packaging.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
