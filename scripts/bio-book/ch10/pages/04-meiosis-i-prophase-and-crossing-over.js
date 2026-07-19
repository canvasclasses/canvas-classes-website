'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'meiosis-i-prophase-and-crossing-over',
  title: 'Meiosis I — The Long Prophase & Crossing Over',
  subtitle: "Meiosis cuts the chromosome number in half so that when two gametes fuse, the count comes back to normal. It does this with two divisions but only one DNA copy — and its very first prophase is so long and busy that NEET splits it into five named stages you must recite in order.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['cell-cycle-and-cell-division', 'meiosis'],
  glossary: [
    { term: 'meiosis', definition: 'A special cell division that reduces the chromosome number by half, producing haploid daughter cells. It happens during gamete formation in sexually reproducing plants and animals.' },
    { term: 'haploid', definition: 'Having a single set of chromosomes (half the normal number). Meiosis produces the haploid phase; fertilisation restores the diploid phase.' },
    { term: 'gametogenesis', definition: 'The process of forming gametes (eggs and sperm). Meiosis takes place during gametogenesis in plants and animals.' },
    { term: 'synapsis', definition: 'The pairing together of homologous chromosomes during zygotene of prophase I.' },
    { term: 'synaptonemal complex', definition: 'A complex protein structure that forms between a pair of synapsed homologous chromosomes during zygotene.' },
    { term: 'bivalent (tetrad)', definition: 'The complex formed by a pair of synapsed homologous chromosomes. It contains four chromatids, and so is also called a tetrad.' },
    { term: 'crossing over', definition: 'The exchange of genetic material between non-sister chromatids of homologous chromosomes during pachytene. It is enzyme-mediated by recombinase and leads to recombination.' },
    { term: 'chiasmata', definition: 'The X-shaped structures seen in diplotene where recombined homologous chromosomes stay linked at the sites of crossing over.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'Two paired thread-like chromosomes wound around each other in deep space-like darkness, crossing at a single glowing X-shaped point',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). Two long, thread-like chromosomes lie side by side in a dark cellular void, gently twisted around one another so that they cross at one softly glowing point near the centre, forming a subtle X shape where they meet. One chromosome is tinted a muted magenta, the other a muted teal, so the exchange point where their colours blend is quietly emphasised without labels. Deep shadow fills the rest of the frame with a faint scatter of out-of-focus specks like a nucleus interior. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no letters.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'One Stage Can Last For Years',
      markdown: "Most stages of cell division are over in minutes or hours. But **diplotene** — the fourth sub-stage of the very first prophase in meiosis — can last **months, or even years**. In the egg cells (oocytes) of some vertebrates, the cell freezes right here, holding its paired chromosomes in mid-exchange, and only finishes the job much later in the animal's life. A single moment of cell division, stretched across a lifetime.",
    },
    // ── 2 · Core concept — what meiosis is + key features ──────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Sexual reproduction works by fusing two **gametes** — an egg and a sperm — each carrying a complete **haploid** set of chromosomes. But gametes are made from ordinary **diploid** cells, which carry a full double set. If those diploid cells just copied themselves, the gametes would be diploid too, and every fusion would double the chromosome number forever. Something has to cut the number in half first.\n\nThat something is **meiosis** — a special kind of cell division that **reduces the chromosome number by half**, producing **haploid** daughter cells. Meiosis gives sexually reproducing organisms their haploid phase, and **fertilisation** then restores the diploid phase. It happens during **gametogenesis** — the making of gametes — in both plants and animals.\n\nFour features of meiosis matter above everything else:\n\n- Meiosis is **two** sequential rounds of division — **meiosis I and meiosis II** — but only **one** round of DNA replication.\n- **Meiosis I starts only after** the chromosomes have already replicated at S phase into identical **sister chromatids**.\n- Meiosis involves the **pairing of homologous chromosomes** and **recombination** between their non-sister chromatids.\n- At the end of meiosis II, **four haploid cells** are formed.",
    },
    // ── 3 · Heading — Prophase I ──────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Prophase I — Five Stages Packed Into One',
      objective: "By the end of this you can name the five sub-stages of prophase I in order, and pin the one event that defines each — especially where synapsis happens and where crossing over happens.",
    },
    // ── 4 · Text — why prophase I is long, the 5 stages ────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Prophase of meiosis I is **longer and far more complex** than the prophase of mitosis. So much happens inside it that biologists split it into **five sub-stages**, named for the changing behaviour of the chromosomes: **Leptotene → Zygotene → Pachytene → Diplotene → Diakinesis.**\n\n**Leptotene.** The chromosomes gradually **become visible** under the light microscope, and their **compaction continues** through the whole stage.\n\n**Zygotene.** The homologous chromosomes **start pairing** — this pairing is called **synapsis**. Electron micrographs show that a complex structure, the **synaptonemal complex**, forms between the paired chromosomes. A pair of synapsed homologous chromosomes is called a **bivalent**, or a **tetrad**.\n\n**Pachytene.** Now the **four chromatids** of each bivalent become distinct and clearly appear as **tetrads**. **Recombination nodules** appear along them — these are the exact sites where **crossing over** happens. Crossing over is the **exchange of genetic material between non-sister chromatids** of the homologous chromosomes. It is **enzyme-mediated**, and the enzyme is **recombinase**. Crossing over leads to **recombination**, and it is finished by the end of pachytene, leaving the chromosomes linked at the crossover sites.\n\n**Diplotene.** The **synaptonemal complex dissolves**, and the recombined homologous chromosomes begin to **separate — except at the crossover sites**. Those points hold on, forming **X-shaped structures called chiasmata**.\n\n**Diakinesis.** The chiasmata undergo **terminalisation**, the chromosomes are **fully condensed**, and the **meiotic spindle assembles**. The **nucleolus disappears** and the **nuclear envelope breaks down**. Diakinesis is the hand-off into metaphase.",
    },
    // ── 5 · Interactive image — bivalent / tetrad in Prophase I ────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A bivalent (tetrad) of prophase I: two homologous chromosomes synapsed side by side, each with two sister chromatids, joined by a synaptonemal complex, with a recombination nodule and an X-shaped chiasma where two non-sister chromatids cross over',
      caption: '📸 Tap each dot to explore how a paired pair of chromosomes swaps genetic material in prophase I.',
      generation_prompt: "Scientific textbook illustration of a bivalent (tetrad) during prophase I of meiosis. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Two homologous chromosomes lie parallel and closely paired (synapsed): the left chromosome drawn in muted magenta, the right chromosome in muted teal. Each chromosome is shown as two joined sister chromatids, so four chromatids are visible in total (a tetrad). A thin ladder-like structure runs between the two homologues down the middle, representing the synaptonemal complex. At one point, a non-sister chromatid from the magenta chromosome and a non-sister chromatid from the teal chromosome cross over each other in a clear X shape, with a small rounded nodule sitting exactly at the crossing point. Clean white outlines, biologically accurate proportions, no labels or text in the image itself, no photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.30, y: 0.20, label: 'Homologous chromosomes (synapsed)', detail: 'Two matching chromosomes lie paired side by side. This pairing is **synapsis**, and it happens in **zygotene** — the second sub-stage of prophase I.', icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.42, label: 'Synaptonemal complex', detail: 'The ladder-like protein structure running between the two synapsed homologues. It **forms during zygotene** and later **dissolves in diplotene**.', icon: 'circle' },
        { id: uuid(), x: 0.24, y: 0.62, label: 'Four chromatids = a tetrad', detail: 'Each homologue is made of two sister chromatids, so the whole paired unit has **four chromatids**. That is why a bivalent is also called a **tetrad** — clearly seen in **pachytene**.', icon: 'circle' },
        { id: uuid(), x: 0.62, y: 0.55, label: 'Recombination nodule', detail: 'A small nodule appears along the tetrad in **pachytene**. It marks the exact site where **crossing over** takes place between non-sister chromatids.', icon: 'circle' },
        { id: uuid(), x: 0.52, y: 0.72, label: 'Crossing over point', detail: '**Crossing over** is the exchange of genetic material between **non-sister chromatids** of the homologous chromosomes. It is enzyme-mediated by **recombinase** and leads to **recombination**.', icon: 'circle' },
        { id: uuid(), x: 0.70, y: 0.82, label: 'Chiasma (X-shape)', detail: 'In **diplotene**, the homologues start to separate but stay linked at the crossover sites, forming **X-shaped chiasmata**. These get terminalised in diakinesis.', icon: 'circle' },
      ],
    },
    // ── 6 · Table — the five sub-stages in order ───────────────────────────
    {
      id: uuid(), type: 'table', order: 6,
      caption: 'The five sub-stages of prophase I, in order, and the one event that defines each',
      headers: ['Sub-stage', 'Defining event'],
      rows: [
        ['Leptotene', 'Chromosomes gradually become visible; compaction continues'],
        ['Zygotene', 'Homologous chromosomes pair up — synapsis; synaptonemal complex forms; bivalent/tetrad appears'],
        ['Pachytene', 'Four chromatids become distinct as tetrads; recombination nodules appear; crossing over occurs (by recombinase)'],
        ['Diplotene', 'Synaptonemal complex dissolves; homologues separate except at crossover sites — X-shaped chiasmata'],
        ['Diakinesis', 'Terminalisation of chiasmata; chromosomes fully condensed; spindle assembles; nucleolus gone, nuclear envelope breaks down'],
      ],
    },
    // ── 7 · Mnemonic callout ───────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 7, variant: 'remember',
      title: 'Mnemonic — Nail the Five Stages In Order',
      markdown: "Leptotene → Zygotene → Pachytene → Diplotene → Diakinesis.\n\nRemember **\"Lazy Zebras Prefer Dark Dens\"** — the first letters give you **L-Z-P-D-D** in the exact right order.\n\nAnd anchor the two events NEET loves to the middle letters:\n- **Z**ygotene = synapsis (chromosomes **Z**ip together)\n- **P**achytene = crossing over (**P** for **P**airing swaps / crossing over **P**oint)",
    },
    // ── 8 · Reasoning prompt — which sub-stage does what ───────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "A student is tracing a single cell through prophase I under a microscope. She sees the four chromatids of each pair become clearly distinct, notices small nodules appear along them, and watches genetic material get physically exchanged between non-sister chromatids. Which sub-stage is she looking at?",
      options: [
        'Zygotene — because the homologous chromosomes are pairing up through synapsis',
        'Pachytene — because the four chromatids are distinct as tetrads and crossing over is happening at recombination nodules',
        'Diplotene — because the chromosomes are separating and X-shaped chiasmata have appeared',
        'Leptotene — because the chromosomes are only just becoming visible and still compacting',
      ],
      reveal: "The answer is **pachytene**. Three clues pin it exactly: the four chromatids becoming distinct as tetrads, the recombination nodules appearing, and — the decisive one — crossing over (exchange of material between non-sister chromatids) actually taking place. All three are pachytene events. **Zygotene** is tempting because synapsis (pairing) does bring the homologues together, but the actual exchange of material hasn't happened yet there. Diplotene comes after crossing over (that's when chiasmata show), and leptotene is only the early 'becoming visible' stage.",
      difficulty_level: 2,
    },
    // ── 9 · Text — Metaphase I ─────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "Once diakinesis hands over, the cell enters **Metaphase I**. Here the **bivalent chromosomes align on the equatorial plate** — the imaginary plane across the middle of the cell. Then the **spindle microtubules from the opposite poles attach to the kinetochores of the homologous chromosomes**.\n\nNotice the difference from mitosis: in metaphase I it is the two **homologous** chromosomes of each pair that get pulled toward opposite poles — not the two sister chromatids of a single chromosome. That is precisely what makes meiosis I a **reduction division**.",
    },
    // ── 10 · Remember callout — the must-memorise facts ────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Meiosis = reduction division** — it halves the chromosome number and makes **haploid** cells during gametogenesis.\n- **Two divisions (meiosis I + II) but only ONE cycle of DNA replication.** Four haploid cells at the end.\n- **Five sub-stages of prophase I, in order:** Leptotene → Zygotene → Pachytene → Diplotene → Diakinesis.\n- **Synapsis (pairing) = Zygotene.** Synaptonemal complex forms here; the paired unit is a **bivalent / tetrad**.\n- **Crossing over = Pachytene.** It's between **non-sister** chromatids, enzyme-mediated by **recombinase**, and produces recombination.\n- **Chiasmata (X-shapes) = Diplotene.** **Terminalisation of chiasmata = Diakinesis** (spindle assembles, nucleolus gone, nuclear envelope breaks down).\n- **Metaphase I:** bivalents on the equatorial plate; microtubules attach to kinetochores of the **homologous** chromosomes.",
    },
    // ── 11 · Exam tip ──────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**These four facts get asked almost verbatim:**\n- Synapsis begins in **zygotene**.\n- Crossing over occurs in **pachytene** (never zygotene — pairing and exchange are different stages).\n- Chiasmata appear in **diplotene**.\n- The enzyme of crossing over is **recombinase**.\n\n**Trap to avoid:** meiosis has two divisions but only **one** round of DNA replication — a favourite one-mark catch. And crossing over is between **non-sister** chromatids of homologous chromosomes, not sister chromatids.\n\n**Classic NEET question:** \"Crossing over occurs during which sub-stage of prophase I?\" → **Pachytene.** And its partner: \"Synapsis begins in ___\" → **Zygotene.**",
    },
    // ── 12 · Bridge text ───────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "So far you've followed the cell through the long prophase I and lined its bivalents up at metaphase I. Next, you'll watch the homologues actually get pulled apart, finish meiosis I, and run through the whole of meiosis II to reach those four haploid cells.",
    },
    // ── 13 · Inline quiz (LAST) ────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Which set of features correctly describes meiosis?",
          options: [
            "One division and one round of DNA replication, producing two diploid cells",
            "Two divisions and two rounds of DNA replication, producing four haploid cells",
            "Two divisions but only one round of DNA replication, producing four haploid cells",
            "One division but two rounds of DNA replication, producing four diploid cells",
          ],
          correct_index: 2,
          explanation: "Meiosis runs two sequential divisions (meiosis I and II) on a single cycle of DNA replication, and ends with four haploid cells. The common trap is option 2 — students assume two divisions must mean two DNA copies, but the whole point of meiosis is one replication feeding two divisions, which is what halves the chromosome number.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "During which sub-stage of prophase I does synapsis — the pairing of homologous chromosomes — take place?",
          options: [
            "Leptotene",
            "Zygotene",
            "Pachytene",
            "Diplotene",
          ],
          correct_index: 1,
          explanation: "Synapsis, the pairing of homologous chromosomes, defines zygotene, and the synaptonemal complex forms here too. Leptotene is only when chromosomes become visible; pachytene is when crossing over happens (after pairing is done); diplotene is when the homologues start separating and chiasmata appear.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Crossing over during pachytene is best described as:",
          options: [
            "Pairing of homologous chromosomes to form the synaptonemal complex",
            "Separation of homologous chromosomes leaving X-shaped chiasmata",
            "Exchange of genetic material between sister chromatids of the same chromosome, mediated by recombinase",
            "Exchange of genetic material between non-sister chromatids of homologous chromosomes, mediated by recombinase",
          ],
          correct_index: 3,
          explanation: "Crossing over is the exchange of genetic material between non-sister chromatids of homologous chromosomes, and the enzyme is recombinase. The 'sister chromatids' version is the classic trap — exchange between identical sisters would achieve nothing. Pairing to form the synaptonemal complex is synapsis (zygotene), and the X-shaped chiasmata belong to diplotene; both are different stages.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "At metaphase I, which structures align on the equatorial plate and get attached by spindle microtubules from opposite poles?",
          options: [
            "Bivalent chromosomes, with microtubules from opposite poles attaching to the kinetochores of the homologous chromosomes",
            "Single chromatids, with microtubules attaching to the centromere of each",
            "Sister chromatids of one chromosome, pulled to opposite poles",
            "Fully separated haploid chromosomes lined up individually",
          ],
          correct_index: 0,
          explanation: "In metaphase I the bivalents (paired homologous chromosomes) line up on the equatorial plate, and microtubules from opposite poles attach to the kinetochores of the homologous chromosomes — so it is the homologues, not sister chromatids, that face opposite poles. That is the reduction-division signature. Pulling sister chromatids apart is a mitosis / meiosis-II event, not metaphase I.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
