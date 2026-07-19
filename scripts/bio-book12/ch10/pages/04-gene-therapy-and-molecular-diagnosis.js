'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'gene-therapy-and-molecular-diagnosis',
  title: 'Fixing & Finding Genes — Gene Therapy & Molecular Diagnosis',
  subtitle: "How doctors try to repair a faulty gene by handing the body a working copy — and how PCR, ELISA and DNA probes catch a disease long before the first symptom shows up.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['biotechnology-applications', 'gene-therapy-and-molecular-diagnosis', 'gene-therapy', 'ada-deficiency', 'pcr', 'elisa', 'dna-probe'],
  glossary: [
    { term: 'gene therapy', definition: 'A collection of methods that corrects a gene defect diagnosed in a child or embryo by delivering a normal gene into the person\'s cells to take over the job of the faulty one.' },
    { term: 'ADA deficiency', definition: 'A disorder caused by deletion of the gene for the enzyme adenosine deaminase (ADA). Because ADA is crucial for the immune system, the child is left unable to fight infection.' },
    { term: 'SCID', definition: 'Severe combined immunodeficiency — the crippled-immune-system condition that ADA deficiency produces, leaving the patient with no working defence against pathogens.' },
    { term: 'PCR (Polymerase Chain Reaction)', definition: 'A technique that amplifies (makes many copies of) even a tiny amount of DNA, so a very low concentration of a pathogen\'s nucleic acid can be detected before symptoms appear.' },
    { term: 'ELISA (Enzyme Linked Immuno-sorbent Assay)', definition: 'A diagnostic test based on antigen–antibody interaction. Infection is detected either by the pathogen\'s antigens or by the antibodies the body has made against the pathogen.' },
    { term: 'molecular probe', definition: 'A single-stranded DNA or RNA tagged with a radioactive (or fluorescent) molecule that hybridises to its complementary sequence in a clone of cells, letting us spot a mutated gene.' },
  ],
  blocks: [
    // ── hero ─────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A young child in a hospital bed at dawn with a soft glowing DNA strand threading gently into the crook of her arm',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A small child asleep in a hospital bed near a window at dawn, warm light spilling across the sheets. From an IV line at the crook of her arm, a soft luminous double-helix of DNA drifts gently inward, as if a healthy gene is being handed to her body. Hopeful, tender, medical-hope mood — quiet and human, not clinical. Painterly, atmospheric illustration style, dark background tones throughout (#0a0a0a base), no text, no labels, no diagram elements.",
    },
    // ── fun_fact: first gene therapy, 1990 ───────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Four-Year-Old Who Made History in 1990',
      markdown: "In **1990**, the world's **first clinical gene therapy** was given to a **4-year-old girl**. She had been born with **adenosine deaminase (ADA) deficiency** — a missing enzyme that left her immune system unable to work, so an ordinary infection could kill her. Doctors couldn't cure the fault, but they could try something new: take her own blood cells, slip a **working copy of the ADA gene** into them, and give them back. It was the first time a human being was treated by **handing the body a correct gene to replace a broken one** — the moment gene therapy stopped being an idea and became a treatment.",
    },
    // ── core concept: what gene therapy is ───────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "If a person is **born** with a hereditary disease, can the disease itself be corrected — not just its symptoms? **Gene therapy** is the attempt to do exactly that. It is a **collection of methods that corrects a gene defect diagnosed in a child or embryo.** The idea is simple to state: the person carries a **non-functional gene**, so we **deliver a normal copy of that gene into their cells** to take over the job the faulty gene can't do. Genes are inserted into a person's cells and tissues to treat the disease at its root. This page follows the first real case of it — the ADA girl — and then turns to the flip side of the same coin: **catching a disease early**, before it can do damage.",
    },
    // ── heading: gene therapy in action (ADA) ────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The ADA Story — And Why It Isn\'t a Permanent Cure',
      objective: "By the end of this you can walk through the ADA gene-therapy steps in order, and explain why returning gene-corrected lymphocytes treats the child but does not permanently cure her.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**ADA deficiency** is caused by the **deletion of the gene for adenosine deaminase**, an enzyme that is **crucial for the immune system to function**. Without it the child's defences collapse — the severe combined immunodeficiency (**SCID**) picture — and even a mild infection becomes dangerous.\n\nBefore gene therapy, there were two older options, and NCERT is careful to point out **both fall short**. In some children ADA deficiency can be treated by **bone marrow transplantation**; in others by **enzyme replacement therapy**, where **functional ADA is injected** into the patient. But **neither is completely curative** — the injected enzyme runs out, and not every child has a matching marrow donor.\n\nSo here is the gene-therapy route, step by step. **(1)** **Lymphocytes** (a type of white blood cell) are taken from the patient's blood and **grown in a culture outside the body**. **(2)** A **functional ADA cDNA** — a clean, working copy of the gene — is **introduced into these lymphocytes using a retroviral vector** (the virus acts as the delivery van that carries the gene into the cell). **(3)** These **gene-corrected lymphocytes are returned to the patient**.\n\nNow the catch. **These lymphocytes are not immortal** — they live, do their job, and die off. So the fix fades, and the **patient needs periodic infusions** of freshly engineered lymphocytes, again and again. It **treats**, it doesn't **cure**. For a **permanent cure**, the working gene would have to be put into cells that keep replacing themselves for life — that is, **the gene isolated from marrow cells (producing ADA) introduced into cells at an early embryonic stage.** Fix the gene early enough, in the right cells, and it stays fixed for good.",
    },
    // ── interactive image: ADA-SCID gene therapy steps ───────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A four-stage flow of ADA gene therapy: blood drawn from the patient, lymphocytes cultured, a retrovirus delivering the ADA gene, and the corrected cells returned to the patient',
      caption: '📸 Tap each dot to follow the ADA gene-therapy steps — from the patient\'s blood, through the retroviral vector, and back into her body',
      generation_prompt: "Scientific textbook illustration of the ADA (adenosine deaminase) gene therapy procedure shown as a left-to-right flow of four stages. Flat 2D educational diagram on a dark background (#0a0a0a near-black), clean white outlines, biologically accurate, thin white leader lines. Stage 1 (far left): a small child with a blood sample being drawn into a tube. Stage 2: a culture dish containing many round lymphocyte cells (each with a magenta/pink nucleus) growing outside the body. Stage 3 (centre): a single lymphocyte with a retrovirus particle delivering a short glowing purple DNA segment (the functional ADA cDNA / gene) into the cell's nucleus. Stage 4 (right): the corrected lymphocytes being infused back into the same child through an IV line. Faint curved arrows connect the four stages in sequence. Functional colours: purple for the DNA/gene, magenta/pink for cells and nuclei, red for blood, blue for the culture fluid. No baked-in text labels, no photorealism, no cartoon, no mascots, standard biology-textbook procedural-diagram style.",
      hotspots: [
        { id: uuid(), x: 0.12, y: 0.55, label: 'Lymphocytes drawn', icon: 'circle',
          detail: '**Lymphocytes** — white blood cells of the immune system — are taken from the **blood of the patient**. These are the cells the disorder has left defenceless.' },
        { id: uuid(), x: 0.37, y: 0.55, label: 'Grown in culture', icon: 'circle',
          detail: 'The lymphocytes are **grown in a culture outside the body**, giving doctors a population of the patient\'s own cells to work on before returning them.' },
        { id: uuid(), x: 0.60, y: 0.5, label: 'ADA gene delivered', icon: 'circle',
          detail: 'A **functional ADA cDNA** (a working copy of the gene) is **introduced into the lymphocytes using a retroviral vector** — the virus carries the healthy gene into the cell.' },
        { id: uuid(), x: 0.85, y: 0.55, label: 'Returned to patient', icon: 'circle',
          detail: 'The **gene-corrected lymphocytes are infused back** into the patient. But because these cells **are not immortal**, they die off — so the patient needs **periodic infusions** rather than a one-time cure.' },
      ],
    },
    // ── heading: molecular diagnosis ─────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Catching Disease Early — PCR, ELISA and DNA Probes',
      objective: "By the end of this you can explain how PCR, ELISA and radioactive/fluorescent probes each detect a disease before symptoms appear, and what exactly each one is looking for.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "For any disease, **early diagnosis** — catching it before it has done damage — is half the battle. But **conventional methods** (serum and urine analysis and the like) can only spot a problem once it is already well advanced. Three techniques changed that: **recombinant DNA technology, the Polymerase Chain Reaction (PCR), and ELISA.**\n\n**PCR — hunting the pathogen's genes.** Normally a pathogen (bacteria, virus) is suspected only **after** it has caused a symptom — and by then its concentration in the body is already very high. PCR flips the timing. It **amplifies the pathogen's nucleic acid** — copies a tiny trace of its DNA or RNA over and over until there's enough to detect — so **even a very low concentration** of a bacterium or virus can be caught **before symptoms are visible**. This is why PCR is used routinely to **detect HIV in suspected AIDS patients** and to **detect gene mutations in suspected cancer patients**.\n\n**Probes — spotting a mutated gene.** A **single-stranded DNA or RNA tagged with a radioactive molecule (a probe)** is allowed to **hybridise** — pair up — **with its complementary DNA in a clone of cells**, and the result is read by autoradiography. Here is the clever part: **a normal gene matches the probe and shows up; a mutated gene does NOT match, so it fails to hybridise and appears as a blank, unmarked spot** on the film. The absence *is* the signal. (Fluorescent tags are used the same way.)\n\n**ELISA — reading the immune fingerprint.** ELISA works on **antigen–antibody interaction**. An infection can be caught either by detecting the **pathogen's own antigens** (its proteins or glycoproteins) or by detecting the **antibodies the body has synthesised against** the pathogen. With these three tools in hand, the next page moves on to transgenic animals.",
    },
    // ── reasoning_prompt: why PCR enables early diagnosis ────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "A patient may be carrying a virus at a concentration far too low to trigger any symptom or show up in ordinary blood tests. Why can PCR still detect the infection at this early, symptom-free stage?",
      options: [
        "PCR kills the virus, and the dead viral particles are then easy to count",
        "PCR amplifies the virus's nucleic acid, multiplying a tiny trace into a detectable amount",
        "PCR measures the antibodies the body makes, which are always high even when the virus is low",
        "PCR waits until the virus has multiplied on its own to a high concentration, then reads it",
      ],
      correct_index: 1,
      reveal: "PCR **amplifies (makes many copies of) the pathogen's nucleic acid**, so even a **very low concentration** of viral DNA/RNA is multiplied until there is enough to detect — that's exactly why it catches infection *before* symptoms appear. It does not kill the virus (option 1), and it reads **nucleic acid, not antibodies** — antibody detection is ELISA's job, not PCR's (option 3). Option 4 describes waiting for a symptomatic high load, which is the old delay PCR was designed to avoid.",
      difficulty_level: 2,
    },
    // ── remember ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: 'The Facts You Cannot Swap Around',
      markdown: "- **Gene therapy** = correcting a gene defect by **delivering a normal gene** to take over from the faulty one. First given in **1990**, to a **4-year-old girl** with **ADA deficiency**.\n- **ADA deficiency** = **deletion of the adenosine deaminase gene**; ADA is crucial for the **immune system** (the SCID picture). Older non-curative options: **bone marrow transplantation** and **enzyme replacement therapy**.\n- **ADA gene-therapy steps:** lymphocytes from patient's blood → grown in culture → **functional ADA cDNA introduced via a retroviral vector** → returned to patient. **Not permanent** — lymphocytes aren't immortal, so **periodic infusions** are needed. **Permanent cure** would need the gene put into cells at **early embryonic stages**.\n- **PCR** = amplifies pathogen **nucleic acid**; detects **very low** levels **before symptoms** (used for **HIV** in suspected AIDS patients, and gene mutations in cancer).\n- **DNA/RNA probe** = tagged single strand that **hybridises to complementary DNA**; a **mutated gene does NOT hybridise → shows up as an unmarked/blank spot**.\n- **ELISA** = based on **antigen–antibody interaction**; detects the pathogen's **antigens** or the **antibodies** made against it.",
    },
    // ── exam_tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Pin the ADA facts NEET lifts verbatim:** first gene therapy = **1990**, a **4-year-old girl**, **ADA (adenosine deaminase) deficiency**, gene delivered by a **retroviral vector** into **lymphocytes**. The examiner loves the *'why not permanent?'* twist — answer: the **lymphocytes are not immortal**, so periodic infusion is needed; a permanent cure needs the gene in **early embryonic cells**.\n\n**Don't mix up the three diagnostic tools:** **PCR → amplifies nucleic acid** (used to detect **HIV**); **ELISA → antigen–antibody interaction**; **probe → hybridises to complementary DNA**, and a **mutated gene fails to hybridise** (blank spot). A classic trap swaps ELISA's job (antibodies) onto PCR.\n\n**The probe logic reversal is a favourite:** the mutated gene is the one that **does NOT show up**, because the probe can't pair with it.\n\n**Classic NEET question:** \"The first clinical gene therapy was given in 1990 for which enzyme deficiency, and by what vector was the gene delivered?\" → **Adenosine deaminase (ADA) deficiency; delivered via a retroviral vector into the patient's lymphocytes.**",
    },
    // ── inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'In the first clinical gene therapy (1990), what was the genetic defect being treated, and how was the corrective gene delivered?',
          options: [
            'Adenosine deaminase (ADA) deficiency; a functional ADA cDNA delivered into lymphocytes via a retroviral vector',
            'Insulin gene deletion; delivered into pancreatic cells via a plasmid vector',
            'Cystic fibrosis; the normal gene delivered into lung cells via a bacterial vector',
            'ADA deficiency; the enzyme itself injected directly into the bloodstream',
          ],
          correct_index: 0,
          explanation: "The 1990 case was a girl with ADA deficiency, and a functional ADA cDNA was introduced into her cultured lymphocytes using a retroviral vector, then the cells were returned to her. The tempting trap is 'ADA deficiency; enzyme injected' — that describes enzyme replacement therapy, a different, non-curative approach, not gene therapy. Insulin and cystic fibrosis are not the ADA case.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'Why does returning gene-corrected lymphocytes to the ADA patient treat but not permanently cure the disorder?',
          options: [
            'The retroviral vector destroys the gene soon after entering the cell',
            'The lymphocytes are not immortal and die off, so the patient needs periodic infusions',
            'The immune system rejects the patient\'s own returned cells',
            'The ADA gene works only in embryonic cells and never in lymphocytes',
          ],
          correct_index: 1,
          explanation: "The introduced gene works, but the lymphocytes carrying it are not immortal — they die over time, so the correction fades and the patient needs repeated (periodic) infusions of freshly engineered cells. A permanent cure would require putting the gene into cells at an early embryonic stage. The vector does not destroy the gene, and the returned cells are the patient's own, so rejection is not the reason.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'A patient carries a virus at a concentration far too low to cause symptoms. Which technique is best suited to detect it this early, and on what principle?',
          options: [
            'ELISA, by amplifying the virus\'s nucleic acid',
            'PCR, by detecting antibodies against the virus',
            'PCR, by amplifying the virus\'s nucleic acid to a detectable amount',
            'A DNA probe, by hybridising with the patient\'s antibodies',
          ],
          correct_index: 2,
          explanation: "PCR amplifies the pathogen's nucleic acid, so even a very low concentration of virus can be detected before symptoms appear — this is why PCR is used to detect HIV in suspected AIDS patients. The traps mix up methods: ELISA works on antigen–antibody interaction (not amplification), and a probe hybridises with complementary DNA, not with antibodies.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'A radioactive single-stranded DNA probe is added to a clone of cells to check for a mutated gene. How does the mutated gene reveal itself?',
          options: [
            'It hybridises strongly with the probe and shows up as the brightest spot on the film',
            'It changes the probe\'s colour from red to green',
            'It triggers an antigen–antibody reaction that the probe detects',
            'It fails to hybridise with the probe (no complementarity), so it does NOT appear on the film',
          ],
          correct_index: 3,
          explanation: "The probe hybridises only with a sequence complementary to it. A mutated gene has lost that complementarity, so the probe cannot bind — the clone with the mutated gene does NOT appear on the photographic film (its absence is the signal). The tempting trap is 'hybridises strongly and shows up brightest' — that is what a normal, matching gene does, the exact opposite. Antigen–antibody interaction is ELISA's principle, not a probe's.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
