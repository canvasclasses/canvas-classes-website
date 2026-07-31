'use strict';
// Class 11 Biology — Ch.10 — "Practice — NCERT Exercises" page.
// SNAPSHOT of the live, already-inserted page (regenerated to fix a
// non-idempotency bug: the original module called uuid() at require() time,
// so every re-save looked like a full block removal+addition to book-writer's
// content-loss guard. This module carries the exact ids currently live in
// Mongo, so re-running insert_practice_pages.js against it is a true no-op.
module.exports = {
  "slug": "ch10-practice-ncert-exercises",
  "title": "Practice — NCERT Exercises",
  "subtitle": "All 16 NCERT textbook exercises for the chapter, grouped into 4 revision themes with full worked solutions.",
  "page_type": "lesson",
  "tags": [
    "ncert-exercises",
    "practice"
  ],
  "blocks": [
    {
      "id": "b37a920c-27dc-4c68-89d2-bcdeecf913a7",
      "type": "image",
      "order": 0,
      "src": "",
      "alt": "A single glowing cell splitting into two identical cells on one side, and a second glowing cell splitting through two divisions into four smaller cells on the other side, against a dark background",
      "caption": "",
      "width": "full",
      "aspect_ratio": "16:5",
      "generation_prompt": "Scientific textbook illustration, wide landscape banner, flat 2D educational diagram on a dark background (#0a0a0a near-black). Left half: a single round cell with condensed, glowing chromosomes at its equator, dividing cleanly into two identical daughter cells of the same size, connected by faint spindle-fibre lines radiating from two poles. Right half: a similar starting cell, but shown dividing twice in sequence — first into two cells, then each of those into two more — ending in four smaller daughter cells arranged in a loose cluster, with paired chromosome threads crossing over near the middle of the sequence. Clean white outlines, muted natural blues and soft violet tones for the chromosomes, biologically accurate schematic proportions, no photorealism, no cartoon, matches standard biology textbook illustration conventions. No text, no labels, no leader lines, no pointer lines of any kind anywhere in the image."
    },
    {
      "id": "72d77a36-32ee-4857-b6cd-1aeac32d9f6f",
      "type": "text",
      "order": 1,
      "markdown": "You've read the chapter — now drill it. Below are **all 16 NCERT exercises** for *Cell Cycle and Cell Division*, pulled out of the textbook's running order and re-sorted into four revision themes: the interphase clock, mitosis's stage-by-stage machinery, meiosis's long prophase I, and the comparisons that tie the whole chapter together.\n\nTry to answer each one in your head (or on paper) before you open the solution. The worked answer is written to *teach* the whole idea, not just tick the box — so even a question you get right is worth reading through."
    },
    {
      "id": "45930514-6a8a-47c3-ba6c-172b5f4693e4",
      "type": "practice_bank",
      "order": 2,
      "title": "NCERT Exercises 10.1–10.16",
      "intro": "Every end-of-chapter exercise, regrouped into four revision themes. Each carries a one-line answer for a quick self-check and a full worked solution.",
      "sections": [
        {
          "id": "s1-interphase",
          "title": "Interphase and the Cell Cycle Clock",
          "blurb": "How long a cycle takes, what actually happens while the cell \"rests,\" and the cells that opt out.",
          "items": [
            {
              "kind": "numerical",
              "id": "6c555bf6-5c37-44d8-9db5-81ba45cc73a7",
              "source": "ncert_exercise",
              "source_label": "NCERT 10.1",
              "prompt": "What is the average cell cycle span for a mammalian cell?",
              "answer": "About 24 hours for a typical human (mammalian) cell grown in culture.",
              "solution": "For a typical human cell grown in culture, one full turn of the cell cycle — from one division to the next — takes about **24 hours**. That's the standard figure to hold onto for a mammalian cell.\n\nSpeed isn't fixed across all organisms, though. **Yeast** runs through its entire cell cycle in only about **90 minutes** — the same basic job of copying DNA, growing, and splitting, just done far faster. That contrast is worth remembering: the *sequence* of events (interphase, then M phase) is the same everywhere, but the *duration* varies hugely by organism.\n\nOne more number worth locking in alongside this: of that 24-hour human cycle, the actual division (**M phase**) takes up only about **1 hour**. The other 23-odd hours — **more than 95%** of the cycle — is spent in interphase, quietly preparing."
            },
            {
              "kind": "numerical",
              "id": "f83a98e1-467c-4ead-adf3-05b416799011",
              "source": "ncert_exercise",
              "source_label": "NCERT 10.3",
              "prompt": "Describe the events taking place during interphase.",
              "answer": "Interphase runs G1 (growth, no DNA copying) → S (DNA replicates, 2C to 4C) → G2 (protein synthesis for mitosis) — all while the chromosome number stays unchanged at 2n.",
              "solution": "Interphase is the stretch **between** two successive divisions, and despite its old nickname of \"resting phase,\" it's the busiest part of the whole cycle — this is where the cell grows and copies its DNA in an orderly sequence. It has three sub-phases, always in this order:\n\n**G1 (Gap 1).** The interval right after the previous mitosis ends and before DNA replication starts. The cell is **metabolically active and grows continuously**, but it does **not** replicate its DNA yet. Chromosome number: 2n. DNA content: 2C.\n\n**S (Synthesis).** This is the **one specific stage where DNA replication happens**. The amount of DNA per cell **doubles — 2C to 4C**. Importantly, the chromosome number does **not** change during this — a 2n cell stays 2n, because the two new copies of each chromosome (the sister chromatids) stay joined at the centromere rather than becoming two separate chromosomes. In animal cells, DNA replication begins in the nucleus while the **centriole duplicates** at the same time in the cytoplasm.\n\n**G2 (Gap 2).** Comes after the DNA is copied. Now the cell **synthesises proteins in preparation for mitosis**, and growth continues. DNA content stays at 4C. Once G2 finishes, the cell is fully stocked and ready to enter the M phase.\n\nSo across all of interphase, the chromosome number never moves off 2n — only the DNA content climbs, from 2C to 4C, and only during S phase."
            },
            {
              "kind": "numerical",
              "id": "dae99380-c292-43d2-b94a-d198896e6534",
              "source": "ncert_exercise",
              "source_label": "NCERT 10.4",
              "prompt": "What is Go (quiescent phase) of cell cycle?",
              "answer": "G0 is where cells that stop dividing park themselves after exiting G1 — metabolically active, but not proliferating unless called upon.",
              "solution": "Not every cell keeps cycling forever. Some cells in adult animals — **heart cells** are the standard NCERT example — don't seem to divide at all, and many others divide only occasionally, just to replace cells lost to injury or death.\n\nCells like these **exit the G1 phase** and enter an inactive stage called the **quiescent stage, or G0**. Being in G0 doesn't mean the cell is dead or dormant in a deep sense — it stays **metabolically active**, doing its normal job — it just **no longer proliferates**, unless the organism specifically calls on it to divide again (say, to repair damage).\n\nSo think of G0 as a parked exit ramp off the main cell-cycle loop: the cell leaves right after G1, sits there doing its regular work, and only re-enters the cycle if the body specifically signals it to."
            }
          ]
        },
        {
          "id": "s2-mitosis",
          "title": "Mitosis — Karyokinesis, Cytokinesis, and Naming the Stages",
          "blurb": "Telling the two halves of division apart, why the count stays equal, and matching an event to its exact stage.",
          "items": [
            {
              "kind": "numerical",
              "id": "05d88c0d-69c6-4ff1-b14a-f29e9e1e0877",
              "source": "ncert_exercise",
              "source_label": "NCERT 10.2",
              "prompt": "Distinguish cytokinesis from karyokinesis.",
              "answer": "Karyokinesis divides the nucleus (prophase → metaphase → anaphase → telophase); cytokinesis divides the cytoplasm afterward, splitting the cell body itself in two.",
              "solution": "These are the two halves of what we casually call \"cell division,\" and they don't always travel together.\n\n**Karyokinesis** is the division of the **nucleus**. It's what sorts the duplicated chromosomes into two separate sets. For convenience it's split into four stages, always in this order: **prophase → metaphase → anaphase → telophase**. By the end of karyokinesis (telophase), there are two complete, fully-formed nuclei — but they're still sitting inside a single, undivided cell.\n\n**Cytokinesis** is the division of the **cytoplasm** — the step that finally separates that one cell into two distinct daughter cells. Only once cytokinesis finishes is cell division actually complete. How it happens depends on the cell: an **animal cell** pinches itself apart via a deepening furrow in the plasma membrane; a **plant cell**, boxed in by its cell wall, instead builds a new wall from the centre outward, starting as a cell-plate.\n\n| Feature | Karyokinesis | Cytokinesis |\n|---|---|---|\n| What divides | The nucleus | The cytoplasm |\n| Stages | Prophase, metaphase, anaphase, telophase | A furrow (animal) or a cell-plate (plant) |\n| Result | Two daughter nuclei in one cell | Two separate daughter cells |\n\nThe two don't always come as a pair. If karyokinesis repeats without cytokinesis ever following, the nuclei just pile up in one shared cytoplasm — a **multinucleate condition called a syncytium**, exactly what produces the liquid endosperm of a coconut."
            },
            {
              "kind": "numerical",
              "id": "f372e7ee-cf4d-4c06-bdec-98a653e4cef4",
              "source": "ncert_exercise",
              "source_label": "NCERT 10.5",
              "prompt": "Why is mitosis called equational division?",
              "answer": "Because the parent cell and its daughter cells end up with exactly the same chromosome number — the count stays equal on both sides.",
              "solution": "Mitosis is called **equational division** for one specific reason: the **number of chromosomes in the parent cell and in the progeny (daughter) cells is the same**. A diploid (2n) parent cell produces two diploid (2n) daughter cells — the chromosome count stays **equal** across the division, with nothing lost and nothing doubled.\n\nThis isn't about the cytoplasm splitting into equal halves, or the chromosomes lining up evenly at the metaphase plate, or the two chromatids of a chromosome being of equal length — those are all real features of the process, but none of them is the reason for the name. The name is purely about the **chromosome count staying balanced** between one generation of cells and the next.\n\nThat's also exactly why mitosis is the division the body relies on for growth and repair: every new cell it makes is a faithful, chromosome-for-chromosome copy of the one it came from."
            },
            {
              "kind": "numerical",
              "id": "75f17a43-d8e6-433d-8be5-bdcad3ad0bf9",
              "source": "ncert_exercise",
              "source_label": "NCERT 10.6",
              "prompt": "Name the stage of cell cycle at which one of the following events occur:\n(i) Chromosomes are moved to spindle equator.\n(ii) Centromere splits and chromatids separate.\n(iii) Pairing between homologous chromosomes takes place.\n(iv) Crossing over between homologous chromosomes takes place.",
              "answer": "(i) Metaphase (ii) Anaphase (iii) Zygotene of Prophase I (iv) Pachytene of Prophase I.",
              "solution": "Each of these four events has one exact, named home in the cell cycle — matching them precisely is exactly what NEET tests.\n\n**(i) Chromosomes are moved to spindle equator → Metaphase.** All the chromosomes come to lie at the equator of the cell along the metaphase plate, each one tethered to spindle fibres from both poles. This is also the stage where chromosome shape (morphology) is easiest to study, since condensation is complete by now.\n\n**(ii) Centromere splits and chromatids separate → Anaphase.** The centromere holding the two sister chromatids together finally divides, and the two chromatids — now called daughter chromosomes in their own right — move to opposite poles, centromere leading, arms trailing behind.\n\n**(iii) Pairing between homologous chromosomes → Zygotene** (the second of the five sub-stages of Prophase I of meiosis). This pairing is called **synapsis**, and it's here that the synaptonemal complex forms between the paired homologues, creating a bivalent (tetrad).\n\n**(iv) Crossing over between homologous chromosomes → Pachytene** (the third sub-stage of Prophase I). By this point the four chromatids of each bivalent are distinct as a tetrad, recombination nodules appear along them, and crossing over — the exchange of genetic material between **non-sister** chromatids, carried out by the enzyme **recombinase** — happens right here.\n\nNotice the pattern: (i) and (ii) are ordinary mitotic stages that any dividing diploid cell runs through; (iii) and (iv) are specific sub-stages buried inside the unusually long Prophase I of meiosis — a stage mitosis doesn't have at all."
            },
            {
              "kind": "numerical",
              "id": "b123ad93-f09a-453c-8165-135e0ded59a2",
              "source": "ncert_exercise",
              "source_label": "NCERT 10.8",
              "prompt": "How does cytokinesis in plant cells differ from that in animal cells?",
              "answer": "Animal cells pinch inward with a deepening furrow; plant cells, boxed in by a rigid wall, build a new cell-plate outward from the centre instead.",
              "solution": "The difference comes down to one thing: a plant cell has a rigid cell wall around it, and an animal cell doesn't.\n\nIn an **animal cell**, there's no wall to get in the way, so the cell simply squeezes itself apart from the outside. A **furrow appears in the plasma membrane**, gradually **deepens**, and finally **joins in the centre**, splitting the cytoplasm into two. Picture a drawstring pulled tight around the middle of a soft bag until the two halves pinch off — the direction is **outside in**.\n\nA **plant cell** can't do that — it's boxed in by a **relatively inextensible cell wall** that won't pinch. So instead of squeezing, it **builds a brand-new wall**, and it builds it from the inside out: **wall formation starts in the centre of the cell and grows outward** to meet the existing lateral walls. It begins as a simple precursor called the **cell-plate**, which goes on to become the **middle lamella** — the shared layer between the walls of the two resulting daughter cells. Meanwhile organelles like mitochondria and plastids get distributed between the two daughter cells so each gets its share.\n\n| Feature | Animal cell | Plant cell |\n|---|---|---|\n| Barrier | No cell wall | Relatively inextensible cell wall |\n| Mechanism | A furrow in the plasma membrane | A cell-plate |\n| Direction | Outside → in (furrow deepens and joins) | Centre → out (cell-plate grows to meet lateral walls) |\n| End result | Furrow joins, cytoplasm splits | Cell-plate becomes the middle lamella |"
            }
          ]
        },
        {
          "id": "s3-meiosis",
          "title": "Meiosis — Prophase I, Synapsis, and Unequal Divisions",
          "blurb": "The vocabulary of the long first prophase, and where meiosis produces equal or unequal daughter cells.",
          "items": [
            {
              "kind": "numerical",
              "id": "29a934b8-fc86-4870-ade6-7ed0f3ea01fd",
              "source": "ncert_exercise",
              "source_label": "NCERT 10.7",
              "prompt": "Describe the following:\n(a) synapsis (b) bivalent (c) chiasmata\nDraw a diagram to illustrate your answer.",
              "answer": "Synapsis = homologues pairing up (zygotene); bivalent = the paired unit of two homologues (four chromatids, a tetrad); chiasmata = X-shaped points where homologues stay joined after crossing over (diplotene).",
              "solution": "These three terms describe one continuous story unfolding across the sub-stages of Prophase I — pairing, then exchange, then partial separation.\n\n**(a) Synapsis.** This is the **pairing of homologous chromosomes**, and it defines the sub-stage **zygotene**. As the two matching chromosomes come together side by side, a ladder-like protein structure called the **synaptonemal complex** forms between them, holding the pair in tight alignment.\n\n**(b) Bivalent.** Once two homologous chromosomes have synapsed, the paired unit is called a **bivalent** (also a **tetrad**). Since each of the two homologues is itself made of two sister chromatids, the whole bivalent is made of **four chromatids** — which is exactly why it's also called a tetrad. This becomes clearly visible in the next sub-stage, **pachytene**, where recombination nodules appear along the tetrad and crossing over happens between non-sister chromatids at those nodules.\n\n**(c) Chiasmata.** As Prophase I moves into **diplotene**, the synaptonemal complex dissolves and the two homologues of each bivalent begin to separate — **except at the points where crossing over occurred**. Those points hold on, forming **X-shaped structures called chiasmata**. In the very next sub-stage, diakinesis, these chiasmata undergo terminalisation (they slide toward the ends of the chromosomes) as the cell finishes preparing for metaphase I.\n\n**Diagram, described in words:** picture two matching (homologous) chromosomes lying side by side, connected along their length by a ladder-like synaptonemal complex — that whole pairing is the **bivalent**. Each of the two chromosomes has two sister chromatids, so four thread-like strands run in parallel — that's the **tetrad**. Partway along, two of the strands (one from each homologue — the non-sister chromatids) cross over each other in an X shape at a small nodule; this X-shaped crossing point, once the homologues start pulling apart everywhere else, is the **chiasma** holding the pair together."
            },
            {
              "kind": "numerical",
              "id": "2dc2ccaa-2075-4ce2-ba7a-0576dffe9cf3",
              "source": "ncert_exercise",
              "source_label": "NCERT 10.9",
              "prompt": "Find examples where the four daughter cells from meiosis are equal in size and where they are found unequal in size.",
              "answer": "Equal in size: the four cells from sperm-forming meiosis (spermatogenesis) and from pollen-mother-cell division in plants. Unequal in size: the four cells from egg-forming meiosis (oogenesis), where nearly all the cytoplasm goes to one large cell and the rest end up as tiny cells.",
              "solution": "This chapter has already established the mechanics you need: meiosis always ends with **four haploid cells** from one diploid cell (Meiosis II's telophase producing a \"tetrad of cells\"), and cytokinesis is simply the division of the cytoplasm between daughter cells. What Question 9 is really asking is whether that cytoplasm gets split **evenly** or **unevenly** each time — and the answer depends on which cells are being formed.\n\n**Where the four cells come out equal in size:** in **spermatogenesis** — the meiotic division that produces sperm cells in animals — the cytoplasm divides evenly at every step, so all **four resulting cells are equal-sized**, each going on to mature into a functional sperm. The same even split happens when a **pollen mother cell** in a flowering plant undergoes meiosis: it produces **four equal-sized microspores**, each capable of developing into a pollen grain.\n\n**Where the four cells come out unequal in size:** in **oogenesis** — the meiotic division that produces the egg (ovum) in animals — the cytoplasm is divided very unevenly. At each division, almost all of the cytoplasm is retained by one cell, while the other gets only a thin sliver. The result is **one large functional egg cell and much smaller cells called polar bodies**, which eventually degenerate. The plant equivalent is **megasporogenesis**: a megaspore mother cell divides meiotically into four megaspores of unequal size, and typically only the largest one survives to develop further.\n\nSo the underlying meiotic machinery — one diploid cell, two divisions, four haploid products — is identical in both cases. What differs is purely how the cytoplasm gets carved up during cytokinesis: evenly for sperm/microspores, lopsidedly for eggs/megaspores."
            },
            {
              "kind": "numerical",
              "id": "1a06f01e-169d-48ed-918a-b5b4cce20f44",
              "source": "ncert_exercise",
              "source_label": "NCERT 10.13",
              "prompt": "Discuss with your teacher about\n(i) haploid insects and lower plants where cell-division occurs, and\n(ii) some haploid cells in higher plants where cell-division does not occur.",
              "answer": "Male honey bees (haploid insects) and many lower plants divide mitotically while haploid; in higher (flowering) plants, mature gametes such as the egg cell and male gametes are haploid but normally do not divide further — they exist only to fuse at fertilisation.",
              "solution": "This chapter already flags the key exception you need for part (i): normally, **mitotic cell division in animals is restricted to diploid somatic cells** — but **male honey bees** are the standard exception, since they develop from unfertilised eggs and are **haploid**, yet their body cells still divide perfectly well by mitosis to build a complete haploid organism. The chapter also notes that **plants are more flexible than animals** here — they show mitotic division in **both haploid and diploid cells**. This is why many **lower plants** — algae, fungi, and the leafy gametophyte stage of mosses, for instance — spend a large part of their life cycle as haploid tissue that keeps dividing mitotically to grow, rather than staying as a single, non-dividing haploid cell.\n\nFor part (ii), think about the haploid cells this chapter has already introduced as the *product*, not the starting point, of division: **gametes**. Each gamete carries a complete haploid set of chromosomes, produced by meiosis specifically so that two of them can fuse at fertilisation and restore the diploid number. In **higher (flowering) plants**, the mature male gametes (carried inside the pollen tube) and the egg cell inside the ovule are haploid — but once formed, they are **not built to divide further on their own**. Their whole purpose is to wait and then fuse; there is no ongoing mitotic proliferation of the egg cell or the male gamete the way there is in, say, a growing haploid moss gametophyte. Division only resumes **after** fertilisation restores the diploid state, when the resulting zygote begins mitotic divisions to build the embryo.\n\nThe contrast in short: some haploid cells (male honey bees, haploid lower-plant tissue) actively proliferate by mitosis because being haploid is their whole way of life; other haploid cells (the mature gametes of higher plants) are deliberately terminal — made once, used once, and never divided again."
            }
          ]
        },
        {
          "id": "s4-putting-it-together",
          "title": "Putting It All Together — Comparisons and the Deep Questions",
          "blurb": "Mitosis vs meiosis side by side, why meiosis matters, and the questions that test whether you really understand the cycle.",
          "items": [
            {
              "kind": "numerical",
              "id": "0d8281b7-82da-45ad-9413-cf4d966c4067",
              "source": "ncert_exercise",
              "source_label": "NCERT 10.10",
              "prompt": "Distinguish anaphase of mitosis from anaphase I of meiosis.",
              "answer": "Mitotic anaphase splits the centromere and separates sister chromatids; anaphase I separates whole homologous chromosomes while their sister chromatids stay joined — the centromere does not split.",
              "solution": "These look similar — chromosomes moving to opposite poles — but what's actually separating is completely different, and this is one of the most heavily tested contrasts in the chapter.\n\n**Anaphase (of mitosis).** Every chromosome on the metaphase plate splits simultaneously: the **centromere** holding the two sister chromatids together finally divides, and the two chromatids come apart. From this instant, each one is a **daughter chromosome** in its own right, and the two daughter chromosomes migrate to opposite poles — centromere leading, arms trailing.\n\n**Anaphase I (of meiosis).** Here, the **homologous chromosomes separate** and move to opposite poles — but the **sister chromatids of each chromosome remain associated at their centromeres**. The centromere does **not** split. So each chromosome heading to a pole is still a whole chromosome made of two chromatids, not a single separated chromatid. That chromatid-splitting job is deliberately left for Anaphase II.\n\n| Feature | Anaphase (mitosis) | Anaphase I (meiosis) |\n|---|---|---|\n| What separates | Sister chromatids | Homologous chromosomes |\n| Centromere | Splits | Does NOT split |\n| Sister chromatids | End up on opposite poles | Stay joined together, travel to the same pole |\n| Result at each pole | Single chromatids (now daughter chromosomes) | Whole chromosomes (still two chromatids each) |\n\nThe one line to burn in: mitosis's anaphase splits the centromere; meiosis's Anaphase I refuses to, and saves that step for Anaphase II."
            },
            {
              "kind": "numerical",
              "id": "fbfba810-ca02-40e5-aafd-cdb7b83594a9",
              "source": "ncert_exercise",
              "source_label": "NCERT 10.11",
              "prompt": "List the main differences between mitosis and meiosis.",
              "answer": "Mitosis: one division, one diploid-to-diploid outcome, two identical daughter cells, no pairing/crossing over, for growth and repair. Meiosis: two divisions off one DNA replication, chromosome number halved, four haploid cells, pairing and crossing over in Prophase I, for gamete formation and variation.",
              "solution": "Every contrast this chapter draws between the two divisions lines up in one table — this is the comparison exams reach for again and again.\n\n| Feature | Mitosis | Meiosis |\n|---|---|---|\n| Type of division | Equational division | Reduction division |\n| Chromosome number outcome | Conserved — same as parent (2n → 2n) | Halved — one-half of parent (2n → n) |\n| Number of divisions | One | Two (meiosis I and meiosis II) |\n| Rounds of DNA replication | One | One (before meiosis I only) |\n| Where it occurs | Somatic/diploid cells (plus some haploid cells in lower plants and social insects) | Diploid cells destined to form gametes |\n| Daughter cells produced | Two | Four |\n| Pairing of homologues & crossing over | Absent | Present — in Prophase I |\n| Purpose | Growth and repair | Gamete formation and variation |\n\nIf you only remember one sentence from this table: **mitosis is equational** (number conserved, one division, two identical daughter cells) and **meiosis is reduction** (number halved, two divisions on one replication, four haploid cells with pairing and crossing over along the way)."
            },
            {
              "kind": "numerical",
              "id": "67313153-1a12-4eb2-b3bf-648e5266a99c",
              "source": "ncert_exercise",
              "source_label": "NCERT 10.12",
              "prompt": "What is the significance of meiosis?",
              "answer": "Meiosis keeps a species' chromosome number constant across generations (because fertilisation later restores what it halved) and it increases genetic variability, which is the raw material evolution runs on.",
              "solution": "NCERT gives meiosis exactly **two jobs**, and both matter enormously for how sexually reproducing organisms work.\n\n**First — it conserves the species' chromosome number across generations.** This sounds paradoxical at first: meiosis's whole mechanism **reduces the chromosome number by half**. But that halving isn't a loss — it's the precise step that makes the arithmetic work out later. Each gamete carries a haploid (half) set; when two haploid gametes fuse at **fertilisation**, the diploid number is **restored** to exactly what the parent generation had. Halve at meiosis, restore at fertilisation — and the species' chromosome number stays fixed, generation after generation, instead of doubling every time two cells fused.\n\n**Second — it increases genetic variability.** Meiosis increases the genetic variability in a population of organisms from one generation to the next — which is why offspring aren't identical copies of their parents. This variation isn't a side effect; it's actively generated by the **pairing of homologous chromosomes and crossing over** that happens in Prophase I, reshuffling genetic material between the maternal and paternal copies of each chromosome before they're parcelled out into gametes.\n\nAnd that variation matters beyond just one family: **variations are essential for the process of evolution** — without new variation for natural selection to act on, a population has nothing to work with. So meiosis does two things at once that sound like they'd conflict: it keeps the chromosome *count* rock-steady across generations, while constantly refreshing the genetic *content* that gets carried forward."
            },
            {
              "kind": "numerical",
              "id": "5f2dd905-d675-4fb3-bedc-6d4dd35fad0c",
              "source": "ncert_exercise",
              "source_label": "NCERT 10.14",
              "prompt": "Can there be mitosis without DNA replication in 'S' phase?",
              "answer": "No — a normal mitosis is always preceded by S-phase replication; skipping it would leave daughter cells with progressively halved DNA, which the cell cycle never allows.",
              "solution": "No, not in a normal cell cycle. This chapter is explicit that the cell cycle runs in a fixed, non-negotiable order: the cell must **copy its DNA, build the other constituents it needs, and only then split into two daughter cells** — and if this order gets sloppy, a daughter cell could end up with a broken or incomplete genome.\n\nWork through what would happen if a cell skipped S phase and went straight from G1 into mitosis. Going into that mitosis, the DNA content would still be **2C** (unreplicated). Mitosis's whole machinery — condensing chromosomes, splitting centromeres in anaphase, and handing one full set to each pole — is built around dividing an **already-doubled (4C)** amount of DNA so that each daughter cell still ends up with a complete diploid (2n, 2C) genome. Try to run that same machinery on an un-doubled 2C cell, and there's nothing left to divide evenly — each daughter cell would end up with only **half** the normal amount of DNA, and if this repeated across successive divisions, the DNA content would keep halving every generation until the cell had no functional genome left.\n\nThat's exactly why the S phase exists as a fixed, mandatory checkpoint between G1 and G2 in every normal cycle: it's the one guarantee that mitosis always has a fully-doubled genome to split fairly. Mitosis without a preceding S phase isn't a variant the normal cell cycle produces — it's the kind of failure the checkpoint system exists to prevent."
            },
            {
              "kind": "numerical",
              "id": "40b06769-f9a3-4056-92cd-780464f0705a",
              "source": "ncert_exercise",
              "source_label": "NCERT 10.15",
              "prompt": "Can there be DNA replication without cell division?",
              "answer": "Yes — a cell can run S phase (or repeat it) without ever completing division, a process called endoreduplication, which produces cells with far more DNA than a normal diploid cell.",
              "solution": "Yes. The chapter has already shown you one related idea that makes this easy to accept: **karyokinesis and cytokinesis don't always come as a pair** — in a syncytium (like the liquid endosperm of a coconut), the nucleus keeps dividing again and again while the cytoplasm never splits. That's proof the cell cycle's steps can get decoupled from one another under the right conditions.\n\nDNA replication and division can decouple in a similar way. A cell can complete an S phase — doubling its DNA from 2C to 4C exactly as this chapter describes — and then simply **not proceed on to mitosis and cytokinesis**. If this happens repeatedly, with S phase running again and again without any division ever following, the cell accumulates far more than the normal diploid amount of DNA. This process is called **endoreduplication**, and it's how certain specialised cells end up with unusually high DNA content — for example, the giant chromosomes seen in some secretory or storage tissue cells accumulate exactly this way.\n\nSo the two processes this chapter treats as normally sequential — replicate, then divide — are genuinely separable. Replication can run on its own schedule and simply stop short of the division that would normally follow it."
            },
            {
              "kind": "numerical",
              "id": "7ac7dc98-7364-4e10-a0b9-ad6800ea21c1",
              "source": "ncert_exercise",
              "source_label": "NCERT 10.16",
              "prompt": "Analyse the events during every stage of cell cycle and notice how the following two parameters change\n(i) number of chromosomes (N) per cell\n(ii) amount of DNA content (C) per cell",
              "answer": "Chromosome number stays at 2n through G1, S, G2, prophase, metaphase, and only becomes 2n in each daughter cell after anaphase/telophase splits it; DNA content is 2C through G1, doubles to 4C during S phase, stays 4C through G2/prophase/metaphase, and halves back to 2C in each daughter cell once anaphase separates the chromatids.",
              "solution": "Track the two numbers — chromosome number (N) and DNA content (C) — stage by stage, using exactly what earlier pages of this chapter established about each one.\n\n| Stage | Chromosome number | DNA content | Why |\n|---|---|---|---|\n| G1 | 2n | 2C | Cell is growing; DNA has not been replicated yet |\n| S phase | 2n (unchanged) | 2C → 4C | DNA replicates; chromosome number does NOT change because the two copies (sister chromatids) stay joined at the centromere |\n| G2 | 2n | 4C | Proteins made for mitosis; growth continues; the doubled DNA is held as 2n chromosomes, each now with two chromatids |\n| Prophase | 2n | 4C | Chromosomes condense (each visibly made of two chromatids); no change in N or C yet |\n| Metaphase | 2n | 4C | Chromosomes line up at the equator, still 2n chromosomes each with two chromatids — condensation is complete but nothing has separated yet |\n| Anaphase | Effectively 4n for a moment, as centromeres split | 4C total, splitting toward 2C at each pole | The centromere of each chromosome splits, so what were chromatids of one chromosome each become independent daughter chromosomes — doubling the *chromosome count* in the cell as a whole, even though total DNA hasn't changed yet — and these move to opposite poles |\n| Telophase / each daughter cell | 2n | 2C | Once the daughter chromosomes reach each pole and a nuclear envelope encloses each set, every resulting daughter cell has the original 2n chromosome number and 2C DNA content — right back to where the parent cell started in G1 |\n\nThe pattern to hold onto: **DNA content (C) doubles exactly once, during S phase**, and halves back down only once each daughter cell is finalised after division. **Chromosome number (N) stays at 2n throughout interphase, prophase, and metaphase**, and only reaches its final 2n-per-daughter-cell value once anaphase has physically separated the chromatids and telophase has parcelled them into two nuclei. Copying DNA (S phase) and creating new, separate chromosomes (anaphase) are two completely different events, separated by the entire length of G2, prophase, and metaphase — which is exactly why NEET tests this distinction so relentlessly."
            }
          ]
        }
      ]
    }
  ]
};
