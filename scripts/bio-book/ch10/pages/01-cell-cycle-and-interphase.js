'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'cell-cycle-and-interphase',
  title: 'The Cell Cycle & Interphase',
  subtitle: "A cell doesn't just split the moment it feels like it — it runs through a fixed sequence of steps first. Most of that sequence is quiet preparation, and one step in it hides the single fact NEET tests over and over: DNA doubles, but chromosome number does not.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['cell-cycle-and-cell-division', 'interphase'],
  glossary: [
    { term: 'cell cycle', definition: 'The sequence of events by which a cell duplicates its genome, synthesises the other constituents of the cell, and eventually divides into two daughter cells.' },
    { term: 'interphase', definition: 'The phase between two successive M phases. Called the "resting phase," but it is actually the time when the cell prepares for division through cell growth and DNA replication. It lasts more than 95% of the cell cycle.' },
    { term: 'M phase', definition: 'The mitosis phase — the part of the cell cycle when the actual cell division happens. In a 24-hour human cell cycle it lasts only about an hour.' },
    { term: 'G1 phase', definition: 'Gap 1 — the interval between mitosis and the start of DNA replication. The cell is metabolically active and keeps growing, but does not replicate its DNA.' },
    { term: 'S phase', definition: 'Synthesis phase — the period when DNA replication takes place and the amount of DNA per cell doubles (2C to 4C), though the chromosome number stays the same.' },
    { term: 'G2 phase', definition: 'Gap 2 — the phase after S, when proteins are synthesised in preparation for mitosis while cell growth continues.' },
    { term: 'quiescent stage (G0)', definition: 'An inactive stage that cells enter by exiting G1 when they stop dividing. Such cells stay metabolically active but no longer proliferate unless the organism calls on them to.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single glowing cell caught mid-division against a dark field, a faint clock-like ring of light circling it',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single softly glowing living cell floats at the centre of a dark field, caught in the middle of pinching into two, with a faint ring of light encircling it like the face of a clock — suggesting a repeating cycle of time without any numbers, dials, or literal clock hands. Warm and cool light play gently across the cell's surface; deep shadows fill the rest of the frame. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'A Human Cell Takes a Full Day — Yeast Does It Before Lunch',
      markdown: "Right now, cells inside your body are copying themselves. A typical human cell grown in culture divides about once every **24 hours** — a full day for one cell to become two. But speed depends entirely on the organism. **Yeast** can run through its whole cell cycle in only about **90 minutes**. Same basic job — copy the DNA, grow, split — but one takes a day and the other is done before you'd finish lunch.",
    },
    // ── 2 · Core concept — what the cell cycle is ────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Before a cell divides, three things have to happen, and they can't happen in a sloppy order. The cell has to **copy its DNA** (so each daughter gets a full set), it has to **build the other constituents** it needs, and only then can it **split into two daughter cells**. If any of these ran out of step, a daughter cell could end up with a broken or incomplete genome.\n\nThat coordinated sequence — duplicate the genome, synthesise the other constituents, then divide into two daughter cells — is what we call the **cell cycle**. One important detail to hold onto: cell growth (the cytoplasm getting bigger) is a **continuous** process, but **DNA synthesis happens only during one specific stage** of the cycle, not throughout it.",
    },
    // ── 3 · Heading — the two basic phases ───────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Two Basic Phases — And Why One Is Almost the Whole Story',
      objective: "By the end of this you can name the two phases the cell cycle splits into and explain why interphase, not division, takes up almost the entire cycle.",
    },
    // ── 4 · Text — interphase vs M phase, the >95% point ─────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The cell cycle is divided into two basic phases:\n\n- **Interphase** — the phase *between* two successive divisions.\n- **M phase (Mitosis phase)** — the phase when the actual cell division happens.\n\nHere's the part students underestimate. In that 24-hour human cell cycle, the **M phase — the dramatic splitting — lasts only about an hour.** Everything else, **more than 95%** of the cycle, is **interphase**. So the moment of division is a tiny sliver at the end; the cell spends almost all its time quietly preparing.\n\nInterphase is nicknamed the **resting phase**, but that name is misleading. The cell isn't resting at all — it's the busiest stretch of the whole cycle, spent **growing** and **replicating its DNA** in an orderly way so it's ready to divide.",
    },
    // ── 5 · Heading — the three sub-phases ───────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Inside Interphase — G1, S and G2',
      objective: "By the end of this you can say what the cell does in each of G1, S and G2, and pinpoint exactly which one copies the DNA.",
    },
    // ── 6 · Text — G1, S, G2 walkthrough ─────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Interphase is itself divided into three further phases, in order: **G1 (Gap 1)**, **S (Synthesis)** and **G2 (Gap 2)**.\n\n**G1 phase** is the interval between the end of mitosis and the start of DNA replication. During G1 the cell is **metabolically active and continuously grows — but it does not replicate its DNA yet.** Hold that: growth, no DNA copying.\n\n**S phase (synthesis)** is the one specific stage where **DNA replication takes place**. During S phase the **amount of DNA per cell doubles** — if the starting amount is written as **2C, it rises to 4C**. In animal cells, DNA replication begins in the **nucleus**, and at the same time the **centriole duplicates in the cytoplasm**.\n\n**G2 phase (Gap 2)** comes after the DNA is copied. Now **proteins are synthesised in preparation for mitosis**, while the cell's growth continues. Once G2 is done, the cell is fully stocked and ready to enter M phase.",
    },
    // ── 7 · Interactive image — the cell cycle wheel ─────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'The cell cycle drawn as a circle, with G1, S and G2 making up interphase and a smaller M phase wedge, plus a G0 branch coming off G1',
      caption: '📸 Tap each dot to walk one full turn around the cell cycle — and see how small M phase really is.',
      generation_prompt: "Scientific textbook illustration of the eukaryotic cell cycle drawn as a circle (a clock-like wheel). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, labels in white text with thin white leader lines. The large arc of the circle is interphase, subdivided into three labelled sectors in clockwise order — G1 (Gap 1), S (Synthesis), G2 (Gap 2) — and a smaller wedge labelled M phase (Mitosis) shown as clearly the shortest sector, with a curved arrow indicating the cycle turns in one direction. A short branch labelled G0 (quiescent stage) leaves the G1 sector and points outward to a resting cell. Use soft functional colour fills to distinguish the sectors (cool blue-green for the interphase sectors, a warm/pink tint for the M phase wedge), muted and earthy, on the dark background. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.30, y: 0.30, label: 'G1 (Gap 1)', detail: "The interval between mitosis and the start of DNA replication. The cell is metabolically active and keeps growing, but **does not replicate its DNA** in G1.", icon: 'circle' },
        { id: uuid(), x: 0.70, y: 0.30, label: 'S (Synthesis) — 2C to 4C', detail: "DNA replication happens here. The **amount of DNA per cell doubles, 2C to 4C** — but the **chromosome number does not change**. In animal cells the centriole also duplicates in the cytoplasm.", icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.68, label: 'G2 (Gap 2)', detail: "After the DNA is copied, **proteins are synthesised in preparation for mitosis** and cell growth continues. The cell is getting ready to divide.", icon: 'circle' },
        { id: uuid(), x: 0.42, y: 0.74, label: 'M phase (Mitosis)', detail: "The actual cell division. In a 24-hour human cell cycle it lasts only **about an hour** — the whole rest of the wheel is interphase.", icon: 'circle' },
        { id: uuid(), x: 0.10, y: 0.20, label: 'G0 (quiescent stage)', detail: "Cells that stop dividing exit **G1** into this inactive stage. They stay **metabolically active but no longer proliferate** unless the organism calls on them (e.g. heart cells, or cells replacing ones lost to injury).", icon: 'circle' },
      ],
    },
    // ── 8 · Reasoning prompt — chromosome number vs DNA after S ──────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "A human cell enters G1 with a diploid (2n) set of chromosomes and a DNA amount of 2C. It passes completely through S phase. What are its chromosome number and DNA content now, at the start of G2?",
      options: [
        "Chromosome number 2n, DNA content 4C",
        "Chromosome number 4n, DNA content 4C",
        "Chromosome number 2n, DNA content 2C",
        "Chromosome number 4n, DNA content 2C",
      ],
      reveal: "The answer is 2n and 4C. S phase copies the DNA, so the DNA amount doubles from 2C to 4C — that part most students get. The trap is the chromosome number: even after S phase, the number of chromosomes stays exactly what it was, 2n. Copying the DNA of a chromosome does not make a new, separate chromosome — the copy stays attached as part of the same chromosome. So '4n' (option 2 and 4) is the classic mistake: it wrongly assumes doubling the DNA also doubles the chromosome count. Option 3 forgets that S phase doubled the DNA at all.",
      difficulty_level: 2,
    },
    // ── 9 · Comparison card — chromosome number vs DNA content ───────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'Chromosome Number vs DNA Content Through Interphase',
      columns: [
        { heading: 'Chromosome NUMBER', points: [
          'G1: 2n (diploid)',
          'After S phase: still 2n — unchanged',
          'G2: still 2n',
          'S phase does NOT change the chromosome number',
        ] },
        { heading: 'DNA CONTENT (amount)', points: [
          'G1: 2C',
          'After S phase: 4C — doubled',
          'G2: 4C',
          'S phase DOES double the DNA amount, 2C to 4C',
        ] },
      ],
    },
    // ── 10 · Comparison card — the three interphase sub-phases ───────────────
    {
      id: uuid(), type: 'comparison_card', order: 10,
      title: 'What Happens in G1, S and G2',
      columns: [
        { heading: 'G1 (Gap 1)', points: [
          'Interval between mitosis and start of DNA replication',
          'Cell is metabolically active and grows',
          'DNA is NOT replicated yet',
          'DNA content: 2C',
        ] },
        { heading: 'S (Synthesis)', points: [
          'DNA replication takes place',
          'DNA per cell doubles, 2C to 4C',
          'In animal cells, the centriole duplicates in the cytoplasm',
          'Chromosome number stays the same (2n stays 2n)',
        ] },
        { heading: 'G2 (Gap 2)', points: [
          'Comes after DNA is copied',
          'Proteins synthesised in preparation for mitosis',
          'Cell growth continues',
          'DNA content: 4C',
        ] },
      ],
    },
    // ── 11 · Text — the G0 quiescent stage + who divides by mitosis ──────────
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "Not every cell keeps cycling forever. Some cells in adult animals **don't seem to divide at all** — **heart cells** are the standard example — and many others divide only occasionally, just to replace cells lost to injury or death. Cells like these **exit the G1 phase** and enter an inactive stage called the **quiescent stage (G0)**. A G0 cell is not dead or dormant in the deep sense — it stays **metabolically active** — it just **no longer proliferates** unless the organism specifically calls on it to.\n\nOne more distinction NCERT draws. In **animals**, mitotic cell division is normally seen only in **diploid somatic cells** — with a notable exception: **male honey bees**, which are haploid yet divide by mitosis. **Plants** are more flexible: they can show mitotic divisions in **both haploid and diploid cells.**",
    },
    // ── 12 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Cell cycle** = the sequence of events by which a cell duplicates its genome, synthesises the other cell constituents, and divides into two daughter cells.\n- **Two basic phases:** Interphase and M phase (mitosis). **Interphase lasts more than 95%** of the cycle; in a 24-hour human cell, M phase (division) is only about **1 hour**.\n- **G1** → cell grows and is metabolically active, but **does NOT replicate DNA**.\n- **S** → DNA replication; **DNA doubles, 2C to 4C**, but **chromosome number does NOT change** (2n stays 2n). In animal cells the centriole also duplicates.\n- **G2** → proteins synthesised in preparation for mitosis; growth continues.\n- **G0 (quiescent)** → cells that stop dividing exit G1; stay metabolically active but don't proliferate (e.g. heart cells).",
    },
    // ── 13 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**The single most tested fact on this page:** in **S phase the DNA amount doubles (2C to 4C), but the chromosome number stays the same (2n stays 2n).** Copying DNA is not the same as making a new chromosome — the copies stay joined. NEET loves the option that quietly changes 2n to 4n; reject it.\n\n**Know the numbers cold:** human cell cycle ≈ **24 hours**, yeast ≈ **90 minutes**, interphase = **>95%** of the cycle, M phase (in the human cell) ≈ **1 hour**.\n\n**Classic NEET question:** \"During the S phase, the DNA content of a diploid cell changes from 2C to ______, while the chromosome number remains ______.\" → **4C** and **2n**.",
    },
    // ── 14 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "So the cell has now grown, copied its DNA, and stocked up the proteins it needs — G2 is finished and it's ready to actually divide. That division is the **M phase**. On the next page we open it up and follow the chromosomes through the first two stages of mitosis — **prophase and metaphase**.",
    },
    // ── 15 · Inline quiz (LAST) ──────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "During which single phase of the cell cycle does DNA replication actually take place?",
          options: [
            "G1 phase, right after the previous mitosis ends",
            "S phase, when the amount of DNA per cell doubles from 2C to 4C",
            "G2 phase, while proteins are being made for mitosis",
            "M phase, at the same time the cell physically divides",
          ],
          correct_index: 1,
          explanation: "NCERT is specific: DNA synthesis happens only during the S (synthesis) phase, and this is when the DNA amount doubles from 2C to 4C. G1 is growth with no DNA copying, G2 is protein synthesis after the DNA is already copied, and M phase is the division itself — none of these is when DNA is replicated.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "A diploid (2n) cell with a DNA content of 2C completes S phase. What is true afterward?",
          options: [
            "The DNA content is now 4C and the chromosome number is now 4n",
            "The DNA content is still 2C but the chromosome number is now 4n",
            "The DNA content is now 4C but the chromosome number is still 2n",
            "Both the DNA content and the chromosome number stay at 2C and 2n",
          ],
          correct_index: 2,
          explanation: "S phase doubles the DNA (2C to 4C), but it does not change the chromosome number — a cell that was 2n stays 2n. The tempting wrong answer changes the chromosome number to 4n along with the DNA, but doubling the DNA of a chromosome doesn't create a new separate chromosome; the copy stays attached. That 2n-vs-4n distinction is exactly the trap NEET sets.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "In the 24-hour cell cycle of a cultured human cell, how are interphase and M phase divided up?",
          options: [
            "Interphase and M phase each take about 12 hours",
            "M phase lasts more than 95% of the cycle; interphase is only about an hour",
            "Interphase lasts more than 95% of the cycle; M phase (division) lasts only about an hour",
            "The whole 24 hours is interphase, and M phase happens in a separate cycle",
          ],
          correct_index: 2,
          explanation: "In the 24-hour human cell cycle, division proper (M phase) lasts only about an hour, and interphase takes up more than 95% of the total time. Option 2 flips these two around — a common trap. Interphase, despite its 'resting phase' nickname, is by far the longest part of the cycle.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which statement about the quiescent stage (G0) and mitosis is correct?",
          options: [
            "Cells enter G0 by exiting the G1 phase, and G0 cells stay metabolically active but do not proliferate unless required",
            "Cells enter G0 by exiting the S phase, and G0 cells are metabolically dead until destroyed",
            "In animals, mitotic division is normally seen only in haploid cells, with heart cells as the main example",
            "Plants can show mitosis only in diploid cells, never in haploid cells",
          ],
          correct_index: 0,
          explanation: "Cells that stop dividing exit G1 (not S) into the quiescent G0 stage, where they remain metabolically active but no longer proliferate unless the organism needs them to — heart cells are the example. Option 3 reverses NCERT: in animals mitosis is normally in diploid somatic cells (male honey bees are the haploid exception). Option 4 is also wrong — plants show mitosis in both haploid and diploid cells.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
