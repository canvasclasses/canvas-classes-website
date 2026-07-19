'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'link-reaction-and-krebs-cycle',
  title: 'Aerobic Respiration — the Link Reaction & Krebs Cycle',
  subtitle: "Glycolysis handed you pyruvate. Now pyruvate walks into the mitochondria, gets stripped of every hydrogen atom until nothing but CO2 is left, and loads up the hydrogen-carriers that will later cash in for a mountain of ATP.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['respiration-in-plants', 'krebs-cycle'],
  glossary: [
    { term: 'aerobic respiration', definition: 'Respiration that takes place inside the mitochondria and requires oxygen; pyruvate from glycolysis is transported from the cytoplasm into the mitochondria for it.' },
    { term: 'oxidative decarboxylation', definition: 'The reaction that converts pyruvate into acetyl CoA in the mitochondrial matrix — a CO2 is removed (decarboxylation) and hydrogen is removed as NADH (oxidation) at the same time.' },
    { term: 'pyruvic dehydrogenase', definition: 'The enzyme complex that catalyses the link reaction; it needs the coenzymes NAD+ and Coenzyme A to convert pyruvic acid into acetyl CoA.' },
    { term: 'Coenzyme A (CoA)', definition: 'A coenzyme required by pyruvic dehydrogenase; it joins the 2-carbon acetyl group to form acetyl CoA, and is released again when citric acid is formed.' },
    { term: 'acetyl CoA', definition: 'The 2-carbon molecule formed when pyruvate is oxidatively decarboxylated; it is the fuel that enters the Krebs cycle.' },
    { term: 'Krebs cycle (TCA cycle)', definition: 'The tricarboxylic acid cycle, first elucidated by Hans Krebs; a cyclic pathway in the mitochondrial matrix that completely oxidises acetyl CoA, releasing CO2 and reducing NAD+ and FAD+.' },
    { term: 'oxaloacetic acid (OAA)', definition: 'The 4-carbon acid that condenses with acetyl CoA to start the cycle and is regenerated at the end; the cycle needs it to be continuously replenished so it can keep turning.' },
    { term: 'substrate level phosphorylation', definition: 'Direct synthesis of a high-energy phosphate molecule during a reaction step — in the Krebs cycle, GTP is made as succinyl-CoA becomes succinic acid, and that GTP then makes ATP from ADP.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single mitochondrion glowing softly in darkness, its folded inner membrane suggested as faint ridges, with a small molecule drifting in through its outer boundary',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single mitochondrion floats in near-darkness, softly backlit, its outer boundary smooth and its folded inner membrane suggested only as faint glowing ridges within. A tiny out-of-focus molecule is drifting in through the outer boundary from the surrounding cytoplasm, as if entering a private chamber. Warm amber and deep teal light pools inside the organelle, deep shadow everywhere else. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no arrows, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Same Cycle Runs in a Rat, a Rose, and You',
      markdown: "The cycle you are about to learn is named after **Hans Krebs**, the scientist who first worked it out. What makes it worth naming: this exact ring of reactions turns inside almost every living thing that breathes oxygen — the plant on your windowsill and the cell reading this sentence are running the very same steps, in the very same order, to squeeze the last drop of energy out of their food.",
    },
    // ── 2 · Core concept — pyruvate goes to the mitochondria, the two events ──
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Glycolysis finished in the cytoplasm and handed over its final product: **pyruvate**. For **aerobic respiration** to happen, that pyruvate can't stay where it was made — it is **transported from the cytoplasm into the mitochondria**.\n\nOnce inside, two crucial events unfold, and they happen in two different places:\n\n1. **The complete oxidation of pyruvate.** Every hydrogen atom is stripped off it, one step at a time, until nothing is left but **CO2** (three molecules of it per pyruvate). This first process happens in the **matrix** — the fluid-filled interior of the mitochondrion.\n2. **The electrons cash in for ATP.** The electrons carried away with those hydrogen atoms are passed on to molecular **O2**, and **ATP is synthesised** at the same time. This second process is located on the **inner membrane** of the mitochondrion.\n\nThis page is about the first event — completely taking pyruvate apart. Keep in mind that the hydrogen atoms being removed aren't thrown away; they're loaded onto carrier molecules (NADH and FADH2) that get spent later, in the second event.",
    },
    // ── 3 · Heading — the link reaction ───────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Link Reaction — Turning Pyruvate into Acetyl CoA',
      objective: "By the end of this you can write the link reaction, name the enzyme and the two coenzymes it needs, and say how much NADH one glucose's worth of pyruvate produces here.",
    },
    // ── 4 · Text — the link reaction ──────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Pyruvate enters the **mitochondrial matrix** and immediately undergoes a reaction called **oxidative decarboxylation** — a single word that packs in two things happening together: a **CO2 is removed** (that's the *decarboxylation*) and **hydrogen is removed as NADH** (that's the *oxidation*). This is catalysed by an enzyme complex called **pyruvic dehydrogenase**, which needs the help of two coenzymes: **NAD+** and **Coenzyme A (CoA)**.\n\nThe reaction in full:\n\n> **Pyruvic acid + CoA + NAD+ → Acetyl CoA + CO2 + NADH + H+**\n\nWhat's left of the pyruvate is now a 2-carbon fragment joined to CoA — **acetyl CoA** — and this is what feeds the cycle. Remember that one glucose gave **two** pyruvate molecules back in glycolysis, so this reaction runs twice per glucose. That means **two molecules of NADH** are produced here from every glucose. This step is the bridge between glycolysis and the cycle, which is why it's called the **link reaction**.",
    },
    // ── 5 · Heading — the Krebs cycle ─────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'The Krebs Cycle — Where Acetyl CoA Is Completely Taken Apart',
      objective: "By the end of this you can trace the cycle from acetyl CoA + OAA back around to OAA, point to every CO2 and every NADH/FADH2 release, and total the yield of one turn.",
    },
    // ── 6 · Text — the Krebs cycle walkthrough ────────────────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "The acetyl CoA now enters a **cyclic pathway** — the **tricarboxylic acid (TCA) cycle**, more commonly called the **Krebs cycle** after **Hans Krebs**, who first elucidated it.\n\nThe cycle starts with a **condensation**: the 2-carbon **acetyl group** joins with a 4-carbon acid called **oxaloacetic acid (OAA)**, plus water, to make the 6-carbon **citric acid**. This first reaction is catalysed by the enzyme **citrate synthase**, and the CoA is released back out (free to pick up the next acetyl group).\n\nFrom here the 6-carbon citrate is steadily dismantled:\n\n- Citrate is first rearranged (isomerised) to **isocitrate**.\n- Then come **two successive decarboxylations** — two CO2 molecules leave, one after another — taking it down to the 5-carbon **α-ketoglutaric acid** and then to **succinyl-CoA**.\n- As **succinyl-CoA is converted to succinic acid**, a molecule of **GTP** is made directly. This is **substrate level phosphorylation**, and in a coupled reaction that GTP passes its phosphate on — **GTP → GDP, while ATP is made from ADP**.\n- Through the remaining steps, succinic acid is oxidised onward and finally back to **OAA**, so the cycle can begin again with the next acetyl CoA.\n\nAcross one full turn there are **three points where NAD+ is reduced to NADH + H+** and **one point where FAD+ is reduced to FADH2**. Because OAA is used up at the start and only rebuilt at the end, the cycle depends on the **continuous replenishment of OAA** — and on the **regeneration of NAD+ and FAD+** from the NADH and FADH2 (which happens later, in the second event). Tap through the cycle below to see exactly where each CO2, each NADH, the FADH2, and the GTP come out.",
    },
    // ── 7 · Interactive image — the citric acid cycle ─────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'A ring diagram of the citric acid (Krebs) cycle showing acetyl CoA joining oxaloacetic acid to form citric acid, then the stepwise carbons around the ring with CO2, NADH, FADH2 and GTP coming off at labelled points',
      caption: '📸 Tap each dot to follow one turn of the Krebs cycle — where carbons leave as CO2, where hydrogen-carriers are loaded, and where GTP is made.',
      generation_prompt: "Scientific textbook illustration of the citric acid (Krebs) cycle as a clean circular ring diagram. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines and white leader lines, biologically accurate layout. At the top, a 2-carbon acetyl coenzyme A (2C) feeds into the ring; it condenses with 4-carbon oxaloacetic acid (OAA, 4C) plus water to form 6-carbon citric acid (6C) at the upper right, with a small CoA released. Going clockwise around the ring: citric acid (6C) → alpha-ketoglutaric acid (5C) with a CO2 and an NADH+H+ leaving → succinyl-CoA/succinic acid (4C) with another CO2 and NADH+H+ leaving and a GTP made → around the lower left with a FADH2 leaving → malic acid (4C) → back up to oxaloacetic acid (4C) with a final NADH+H+ leaving. Carbon counts (2C, 4C, 5C, 6C) labelled beside each acid in white text. Small outward arrows mark each CO2 (red), each NADH+H+ and FADH2 (green), and GTP. Green used for the reduced hydrogen-carriers, red for released CO2 gas. No photorealism, no cartoon, no mascots, no glow.",
      hotspots: [
        { id: uuid(), x: 0.50, y: 0.10, label: 'Acetyl CoA (2C) enters', detail: 'The 2-carbon acetyl CoA from the link reaction is the fuel that starts the cycle. Its CoA will be released the moment citric acid forms.', icon: 'circle' },
        { id: uuid(), x: 0.75, y: 0.28, label: 'Condensation → citric acid (6C)', detail: 'Acetyl CoA (2C) joins oxaloacetic acid (4C) plus water to make the 6-carbon citric acid, catalysed by **citrate synthase**. CoA is released here.', icon: 'circle' },
        { id: uuid(), x: 0.82, y: 0.60, label: '1st CO2 + 1st NADH → α-ketoglutaric acid (5C)', detail: 'After citrate is isomerised to isocitrate, the first of two decarboxylations removes a **CO2** and reduces NAD+ to **NADH + H+**, leaving 5-carbon α-ketoglutaric acid.', icon: 'circle' },
        { id: uuid(), x: 0.58, y: 0.86, label: '2nd CO2 + 2nd NADH → succinyl-CoA (4C)', detail: 'The second decarboxylation removes another **CO2** and produces another **NADH + H+**, bringing it down to 4-carbon succinyl-CoA.', icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.82, label: 'GTP made (substrate level phosphorylation)', detail: 'As succinyl-CoA becomes **succinic acid**, a molecule of **GTP** is synthesised directly. In a coupled reaction GTP → GDP, making **ATP from ADP**.', icon: 'circle' },
        { id: uuid(), x: 0.16, y: 0.55, label: 'FADH2 released', detail: 'Further along, the **one point** in the cycle where **FAD+ is reduced to FADH2**. This is the cycle’s single FADH2.', icon: 'circle' },
        { id: uuid(), x: 0.28, y: 0.24, label: '3rd NADH → OAA (4C) regenerated', detail: 'The final oxidation back to **oxaloacetic acid (4C)** reduces NAD+ to **NADH + H+** a third time and regenerates the OAA, so the cycle can turn again.', icon: 'circle' },
      ],
    },
    // ── 8 · Table — per-turn Krebs yield + link-reaction yield ────────────────
    {
      id: uuid(), type: 'table', order: 8,
      caption: 'What each step hands over — the link reaction (per pyruvate) and one full turn of the Krebs cycle',
      headers: ['Step', 'CO2 released', 'NADH + H+', 'FADH2', 'ATP / GTP'],
      rows: [
        ['Link reaction (per pyruvate)', '1', '1', '0', '0'],
        ['Krebs cycle (per turn / per acetyl CoA)', '2', '3', '1', '1 (as GTP)'],
        ['Together, per pyruvate', '3', '4', '1', '1'],
      ],
    },
    // ── 9 · Reasoning prompt — location / count check ─────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A classmate is reciting facts about aerobic respiration from memory. Exactly one of these four statements is wrong. Which one?",
      options: [
        "Pyruvate is transported from the cytoplasm into the mitochondria before aerobic respiration can take place.",
        "The complete oxidation of pyruvate happens in the matrix of the mitochondria.",
        "In one turn of the Krebs cycle, NAD+ is reduced to NADH + H+ at two points and FAD+ is reduced to FADH2 at two points.",
        "The link reaction, converting pyruvate to acetyl CoA, is catalysed by pyruvic dehydrogenase.",
      ],
      reveal: "Statement 3 is the wrong one. In one turn of the Krebs cycle NAD+ is reduced to NADH + H+ at **three** points, and FAD+ is reduced to FADH2 at just **one** point — not two and two. The other three are exactly right: pyruvate really is moved from the cytoplasm into the mitochondria first; its complete oxidation to CO2 really does happen in the matrix; and the link reaction really is catalysed by pyruvic dehydrogenase (with the help of NAD+ and Coenzyme A). Mixing up the 3-NADH-and-1-FADH2 count is the trap.",
      difficulty_level: 2,
    },
    // ── 10 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Link reaction:** Pyruvic acid + CoA + NAD+ → **Acetyl CoA + CO2 + NADH + H+**, catalysed by **pyruvic dehydrogenase** (needs NAD+ and Coenzyme A). One glucose (2 pyruvate) → **2 NADH** here.\n- **Krebs cycle starts** with **acetyl CoA (2C) + OAA (4C) → citric acid (6C)**, catalysed by **citrate synthase** (CoA released).\n- **Per turn of the cycle:** **3 NADH + 1 FADH2 + 1 ATP/GTP + 2 CO2**. (The 3 NADH = three points where NAD+ → NADH + H+; the 1 FADH2 = the one point where FAD+ → FADH2.)\n- **GTP** is made as **succinyl-CoA → succinic acid** — this is **substrate level phosphorylation**; GTP → GDP then makes ATP from ADP.\n- The cycle needs **OAA continuously replenished** (used at the start, rebuilt at the end) and **NAD+/FAD+ regenerated**.",
    },
    // ── 11 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Know the two locations cold:** the complete oxidation of pyruvate (link reaction + Krebs cycle) happens in the **matrix**; the electrons passing to O2 with ATP synthesis happens on the **inner membrane**. NEET loves to swap these two.\n\n**The counts are pure marks:** link reaction per pyruvate = 1 NADH + 1 CO2; one Krebs turn = **3 NADH, 1 FADH2, 1 ATP/GTP, 2 CO2**. Learn them as a set.\n\n**Classic NEET question:** \"Acetyl CoA combines with ___ to form citric acid, a reaction catalysed by ___.\" → **oxaloacetic acid (OAA)** and **citrate synthase**. A close cousin: \"The link reaction is catalysed by ___.\" → **pyruvic (pyruvate) dehydrogenase**.",
    },
    // ── 12 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "Add up everything so far — glycolysis, the link reaction, and the Krebs cycle — and one glucose has released its CO2 and built up **eight NADH + H+** and **two FADH2**, plus just **two molecules of ATP** made in the TCA cycle. Notice what still hasn't shown up: **O2 has not yet appeared**, and the promised large payoff of ATP hasn't been made either. All that stored-up NADH and FADH2 is about to be cashed in. Next page: the **electron transport system and oxidative phosphorylation** — where O2 finally enters and the big ATP haul is collected.",
    },
    // ── 13 · Inline quiz (LAST) ──────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "In the link reaction, pyruvic acid is converted to acetyl CoA. Which enzyme catalyses this, and which coenzymes does it require?",
          options: [
            "Citrate synthase, requiring OAA and water",
            "Pyruvic dehydrogenase, requiring NAD+ and Coenzyme A",
            "Pyruvic dehydrogenase, requiring FAD+ and GTP",
            "Citrate synthase, requiring NADH and Coenzyme A",
          ],
          correct_index: 1,
          explanation: "The link reaction — pyruvic acid + CoA + NAD+ → acetyl CoA + CO2 + NADH + H+ — is catalysed by pyruvic dehydrogenase, which needs the coenzymes NAD+ and Coenzyme A. Citrate synthase is the wrong enzyme; it catalyses the very next step (acetyl CoA + OAA → citric acid). FAD+ and GTP are not what this enzyme uses.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "The Krebs cycle begins when acetyl CoA condenses with which molecule to form citric acid?",
          options: [
            "α-ketoglutaric acid (5C)",
            "Succinic acid (4C)",
            "Oxaloacetic acid (4C)",
            "Isocitrate (6C)",
          ],
          correct_index: 2,
          explanation: "The cycle starts with the condensation of the 2-carbon acetyl group with 4-carbon oxaloacetic acid (OAA) and water to yield 6-carbon citric acid, catalysed by citrate synthase. α-ketoglutaric acid and succinyl/succinic acid form later, further around the ring; isocitrate is what citrate is isomerised to, not the starting partner.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "How many molecules of NADH + H+ and FADH2 are produced in one complete turn of the Krebs cycle?",
          options: [
            "2 NADH + H+ and 2 FADH2",
            "4 NADH + H+ and 1 FADH2",
            "1 NADH + H+ and 3 FADH2",
            "3 NADH + H+ and 1 FADH2",
          ],
          correct_index: 3,
          explanation: "One turn of the cycle has three points where NAD+ is reduced to NADH + H+ and one point where FAD+ is reduced to FADH2 — so 3 NADH + H+ and 1 FADH2. The figure of 4 NADH belongs to the link reaction plus the cycle combined per pyruvate (1 + 3), not to one turn of the cycle alone.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "During the Krebs cycle, a molecule of GTP is synthesised. At which conversion does this happen, and what type of phosphorylation is it?",
          options: [
            "When citric acid forms from acetyl CoA and OAA; oxidative phosphorylation",
            "When succinyl-CoA is converted to succinic acid; substrate level phosphorylation",
            "When α-ketoglutaric acid is decarboxylated; oxidative phosphorylation",
            "When OAA is regenerated at the end of the cycle; substrate level phosphorylation",
          ],
          correct_index: 1,
          explanation: "GTP is made during the conversion of succinyl-CoA to succinic acid, and because it is made directly at a reaction step it is substrate level phosphorylation (that GTP then makes ATP from ADP in a coupled reaction). Oxidative phosphorylation is a different process — it happens later on the inner membrane using O2, not here inside the cycle.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
