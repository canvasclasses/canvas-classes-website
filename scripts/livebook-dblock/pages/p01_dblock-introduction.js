// Ch.5 (d- & f-Block) · Page 1 · The d- and f-Block Elements (chapter intro + NCERT §8.1 Position).
// NCERT content transcribed faithfully (same language/numbers). Enrichment confined to "Exam Point" callouts.
// Devices: "🔍 Decode This" (NCERT fact+reason → Assertion–Reason exam question).
// Ends with a Quick Recap + a textbook quiz in real exam formats.
module.exports = {
  page_number: 1,
  chapter: 5,
  slug: 'dblock-introduction',
  title: 'The d- and f-Block Elements',
  subtitle: 'Where the transition metals sit in the periodic table, what actually makes an element a "transition" element, and why three full-d¹⁰ metals (Zn, Cd, Hg) are quietly thrown out of the club.',
  tags: ['d-block', 'f-block', 'transition-metals', 'position', 'periodic-table'],
  reading_time_min: 6,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red, soft violet), no glow or neon, no 3D. Central motif: a simplified periodic table outline drawn in chalk-and-coloured-pencil style, with the large middle d-block (groups 3 to 12) shaded a warm ochre and clearly flanked on the left by the s-block and on the right by the p-block; below it, two long rows (the f-block lanthanoids and actinoids) drawn in dusty teal, pulled out as a separate strip. Small labels: "transition metals" over the middle slab, "inner transition metals" over the bottom strip. To one corner, faint sketches of an iron nail, a copper wire and a gold ring to hint at everyday transition metals. Landscape, desktop-friendly textbook plate.',
      '16:9',
      'The d-block is the great middle slab of the periodic table; the f-block is pulled out below it.'
    ),

    h.text(
      'Iron, copper, silver and gold are among the transition elements that have played important roles in the development of human civilisation. The inner transition elements such as Th, Pa and U are proving excellent sources of nuclear energy in modern times.'
    ),

    h.text(
      'The $d$-block of the periodic table contains the elements of the groups 3–12 in which the $d$ orbitals are progressively filled in each of the four long periods.'
    ),

    h.groupElements(
      'The 3d series — Scandium to Zinc',
      'Tap any element to open its card. These ten metals — the first row of the d-block — are the ones NCERT studies in greatest detail. Notice how the 3d sub-shell fills up as you walk left to right.',
      ['Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn']
    ),

    h.callout('note', 'What the f-block is (keep this NCERT line word for word)',
      '> *"The elements constituting the $f$-block are those in which the $4f$ and $5f$ orbitals are progressively filled in the latter two long periods; these elements are formal members of group 3."*\n\n' +
      'There have been taken out to form a separate $f$-block of the periodic table. The names **transition metals** and **inner transition metals** are often used to refer to the elements of $d$- and $f$-blocks respectively.'),

    h.text(
      'There are mainly three series of the transition metals, $3d$ series (Sc to Zn), $4d$ series (Y to Cd) and $5d$ series (La to Hg, omitting Ce to Lu). The fourth $6d$ series which begins with Ac is still incomplete. The two series of the inner transition metals, ($4f$ and $5f$) are known as **lanthanoids** and **actinoids** respectively.'
    ),

    h.heading('What exactly is a transition element?', 'State the strict definition of a transition element and apply it to decide whether a given metal qualifies.'),
    h.text(
      'Strictly speaking, a transition element is defined as **the one which has incompletely filled $d$ orbitals in its ground state or in any one of its oxidation states.** Zinc, cadmium and mercury of group 12 have full $d^{10}$ configuration in their ground state as well as in their common oxidation states and hence, are not regarded as transition metals. However, being the end members of the three transition series, their chemistry is studied along with the chemistry of the transition metals.'
    ),
    h.text(
      'The presence of partly filled $d$ or $f$ orbitals in their atoms sets the study of the transition elements and their compounds apart from that of the main group elements. However, the usual theory of valence as applicable to the main group elements can also be applied successfully to the transition elements.'
    ),

    h.heading('8.1 Position in the Periodic Table', 'Locate the d-block in the periodic table and explain why these elements are called "transition" elements.'),
    h.text(
      'The $d$-block occupies the large middle section flanked by $s$- and $p$-blocks in the periodic table. The very name "transition" given to the elements of $d$-block is because of their position between $s$- and $p$-block elements. The $d$-orbitals of the penultimate energy level in their atoms receive electrons giving rise to the three rows of the transition metals, i.e., $3d$, $4d$ and $5d$. The fourth row of $6d$ is still incomplete.'
    ),

    h.callout('exam_tip', 'Exam Point — the one-line test examiners love',
      'Whenever you are asked *"is X a transition element?"*, run this single check:\n\n' +
      '- **Does X have a partly filled $d$ sub-shell in the atom OR in any common ion?** → **Yes = transition element.**\n' +
      '- Sc passes on its ion ($\\ce{Sc^{3+}}$ is $d^0$, but the *atom* is $3d^1$ — partly filled) → transition.\n' +
      '- Zn, Cd, Hg are $d^{10}$ in the atom **and** in $\\ce{M^{2+}}$ → fail both → **not** transition.\n\n' +
      'The trap option is always "$\\ce{Sc^{3+}}$ is $d^0$ so Sc is not transition." The definition checks the **atom or any oxidation state** — Sc still qualifies.'),

    h.callout('note', '🔍 Decode This — turn an NCERT line into an exam question',
      'NCERT keeps pairing a **fact** with its **reason**. Examiners lift that exact pair into an **Assertion–Reason** question. Watch how this page does it:\n\n' +
      '> **NCERT (fact):** *"Zinc, cadmium and mercury of group 12 … are not regarded as transition metals."*\n' +
      '> **NCERT (reason):** *"[They] have full $d^{10}$ configuration in their ground state as well as in their common oxidation states."*\n\n' +
      'Reassembled as the exam sees it:\n\n' +
      '- **Assertion (A):** Zn, Cd and Hg are not regarded as transition metals.\n' +
      '- **Reason (R):** They have a completely filled $d^{10}$ configuration both in the atom and in their common oxidation states.\n\n' +
      '**Answer:** Both A and R are true, **and R is the correct explanation of A.**\n\n' +
      '**Your move:** whenever NCERT says *"X is so **because** Y"*, read it as a ready-made Assertion–Reason question — A = X, R = Y. That single habit cracks most inorganic A–R questions.'),

    h.recap([
      { label: 'Where', text: 'The $d$-block is the **middle slab** (groups 3–12), flanked by the $s$- and $p$-blocks — hence the name "transition".' },
      { label: 'Three series', text: '$3d$ (Sc→Zn), $4d$ (Y→Cd), $5d$ (La→Hg, skipping Ce–Lu); the $6d$ row from Ac is still incomplete.' },
      { label: 'f-block', text: 'The **inner transition metals** — $4f$ (lanthanoids) and $5f$ (actinoids) — are formal members of group 3, pulled out below the main table.' },
      { label: 'Definition', text: 'A transition element has an **incompletely filled $d$ sub-shell in its atom or in any one of its oxidation states.**' },
      { label: 'The exception', text: '$\\ce{Zn}$, $\\ce{Cd}$, $\\ce{Hg}$ are $d^{10}$ in the atom *and* in $\\ce{M^{2+}}$ → **not** transition metals, though studied with them as end members.' },
    ]),

    h.quiz([
      {
        question: 'According to NCERT, a transition element is best defined as one which has:',
        options: [
          'a partly filled $d$ sub-shell only in its ground-state atom',
          'an incompletely filled $d$ sub-shell in its ground state OR in any one of its oxidation states',
          'a completely filled $d$ sub-shell in all its oxidation states',
          'electrons entering the outermost $s$ orbital',
        ],
        correct_index: 1,
        explanation: 'The definition deliberately includes "or in any one of its oxidation states" — that clause is why Sc (whose $\\ce{Sc^{3+}}$ is $d^0$ but whose atom is $3d^1$) still counts. A definition restricted to the ground state alone would wrongly exclude such cases.',
      },
      {
        question: 'Why are Zn, Cd and Hg not regarded as transition metals?',
        options: [
          'They lie outside groups 3–12 of the periodic table',
          'Their $d$ orbitals are completely filled ($d^{10}$) in the ground state and in their common oxidation states',
          'They have no $d$ electrons at all',
          'They belong to the f-block',
        ],
        correct_index: 1,
        explanation: 'Zn, Cd, Hg sit in group 12 (inside the d-block region) but carry a full $d^{10}$ shell in both the atom and the $\\ce{M^{2+}}$ ion, so neither state has a partly filled $d$ sub-shell. They do have $d$ electrons — just a complete set — which is exactly why they fail the test.',
      },
      {
        question: 'The three completed series of transition metals are correctly given as:',
        options: [
          '$3d$ (Sc→Zn), $4d$ (Y→Cd), $5d$ (La→Hg, omitting Ce to Lu)',
          '$3d$ (Sc→Zn), $4d$ (Y→Cd), $6d$ (Ac→Uub)',
          '$4f$ (lanthanoids), $5f$ (actinoids), $6d$ (Ac→Hg)',
          '$3d$ (Ti→Cu), $4d$ (Zr→Ag), $5d$ (Hf→Au)',
        ],
        correct_index: 0,
        explanation: 'NCERT lists $3d$ (Sc→Zn), $4d$ (Y→Cd) and $5d$ (La→Hg, leaving out Ce to Lu). The $6d$ series beginning with Ac is still incomplete, and the $4f$/$5f$ rows are the inner-transition (f-block) series, not the main d-block series.',
      },
      {
        question: 'Assertion (A): The elements of the d-block are called "transition" elements.\nReason (R): They are positioned between the s-block and the p-block of the periodic table.\nChoose the correct option:',
        options: [
          'A is false but R is true',
          'A is true but R is false',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'Both A and R are true, and R is the correct explanation of A',
        ],
        correct_index: 3,
        explanation: 'NCERT states the name "transition" comes precisely from the d-block\'s position between the s- and p-blocks. Both statements are true and R is the reason for A, so the "not the correct explanation" option is the trap.',
      },
      {
        question: 'The elements of the f-block (the inner transition metals) are described by NCERT as:',
        options: [
          'members of group 12 with a full $d^{10}$ shell',
          'the $6d$ series beginning with actinium',
          'elements in which the $4f$ and $5f$ orbitals are progressively filled, and which are formal members of group 3',
          'the elements flanking the d-block on its right ($p$-block)',
        ],
        correct_index: 2,
        explanation: 'NCERT defines the f-block as the elements in which the $4f$ and $5f$ orbitals are progressively filled in the latter two long periods — formal members of group 3 pulled out below the table. Group-12 $d^{10}$ metals and the $6d$ series belong to the d-block, not the f-block.',
      },
    ], 0.6),
  ],
};
