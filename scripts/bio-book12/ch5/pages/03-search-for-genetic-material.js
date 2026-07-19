'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-search-for-the-genetic-material',
  title: 'Proving DNA Is the Genetic Material',
  subtitle: "Three experiments, twenty-four years — how biologists moved from 'genes live on chromosomes' to the hard proof that the molecule of heredity is DNA, not protein.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['genetic-material', 'griffith', 'hershey-chase', 'rna-world', 'molecular-basis-of-inheritance'],
  glossary: [
    { term: 'transformation', definition: 'The process by which a bacterium takes up genetic material from its surroundings and permanently changes its own characters — as when live R bacteria became virulent S bacteria in Griffith\'s experiment.' },
    { term: 'transforming principle', definition: 'The unknown substance passing from heat-killed S bacteria to live R bacteria that changed them. Griffith showed it existed; Avery, MacLeod and McCarty later proved it was DNA.' },
    { term: 'virulent', definition: 'Capable of causing disease. The smooth (S) strain of pneumococcus is virulent and kills mice; the rough (R) strain is not.' },
    { term: 'bacteriophage', definition: 'A virus that infects bacteria. It attaches to a bacterium and injects its genetic material inside — the tool Hershey and Chase used to settle the DNA-versus-protein question.' },
    { term: 'ribozyme', definition: 'An RNA molecule that acts as a catalyst, speeding up a biochemical reaction the way a protein enzyme would. Evidence that RNA can do jobs once thought to need proteins.' },
    { term: 'RNA world', definition: 'The idea that RNA was the first genetic material, acting as both the information store and the catalyst, before the more stable DNA evolved from it.' },
    { term: 'labile', definition: 'Easily broken down or chemically reactive. RNA is labile because of the reactive 2\'-OH group on every nucleotide, which is why it is less stable than DNA.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dusk laboratory scene layering a mouse cage, a culture plate of bacterial colonies, and a faint glowing double helix threading through the background',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dusk laboratory tableau blending three scenes without hard borders: on the far left a quiet laboratory mouse in soft focus behind glass; in the centre a petri culture plate showing two kinds of bacterial colonies — some smooth and glossy, some rough and dull; on the right glassware and a centrifuge silhouette, with a faint glowing blue-purple DNA double helix threading softly through the whole background like an unseen thread tying the scene together. The mood is one of patient discovery across decades. Deep dusk lighting throughout, a single warm horizon glow. Painterly illustration style, atmospheric, dark background overall (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Answer Was Ignored for Years',
      markdown: "By 1926 scientists already knew heredity lived on the **chromosomes** inside the nucleus — Mendel, Sutton and Morgan had narrowed it down that far. But chromosomes are made of *two* things: **protein and DNA**. For decades almost everyone bet on **protein** as the genetic material, because proteins were complex and DNA seemed too simple to carry so much information. It took three separate experiments over roughly twenty-four years to prove the quiet, 'boring' molecule was the right answer all along.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Here is the puzzle biologists faced. Everyone agreed genes sit on chromosomes. But a chromosome is a mixture of **protein and DNA**, so *which of the two* actually carries the instructions of inheritance? Solving this was a detective story with three cases, and each experiment took the search one step closer to the answer.\n\nKeep one running question in your head as you read: **does the experiment merely show that something is transferred, or does it name the exact molecule?** That difference is what separates Griffith's work from the two experiments that followed.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: "Case One — Griffith and the Transforming Principle",
      objective: "By the end of this you can retell Griffith's four injections in order and say exactly what he proved — and what he could not.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "In **1928, Frederick Griffith** worked with *Streptococcus pneumoniae* — the bacterium that causes pneumonia. Grown on a plate, it comes in two forms. The **S strain** makes **smooth, shiny colonies** because each cell wears a **mucous (polysaccharide) coat**; it is **virulent**, so mice injected with it **die** of pneumonia. The **R strain** makes **rough colonies**, has **no coat**, and does **not** cause disease — mice injected with R **live**.\n\nGriffith could also **kill bacteria with heat**. Now follow his four injections, because NEET tests this exact sequence:\n\n- **Live S** → mouse **dies** (as expected — S is virulent).\n- **Live R** → mouse **lives** (R is harmless).\n- **Heat-killed S** → mouse **lives** (dead bacteria can't infect).\n- **Heat-killed S + live R** → mouse **dies** — and from the dead mouse he recovered **living S bacteria**.\n\nThat last result is the shock. Two harmless ingredients — dead S and live R — together killed the mouse. Something had passed from the **heat-killed S** into the **live R** and turned it into a coat-making, virulent S. Griffith called this something the **'transforming principle'** and the change itself **transformation**. He had proved genetic material *can* be transferred. But he had **no idea what the transforming principle was made of** — his experiment could not name the molecule.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 5, reasoning_type: 'logical',
      prompt: "In Griffith's experiment, why did the mouse injected with heat-killed S plus live R die, even though each of those two ingredients on its own is harmless to the mouse?",
      options: [
        "The heat somehow brought the dead S bacteria back to life inside the mouse",
        "Genetic material from the heat-killed S transformed the live R bacteria into virulent, coat-making S bacteria",
        "The live R bacteria mutated on their own into S bacteria by chance",
        "The mouse was killed by the heat-killed S bacteria directly, not by any transformation",
      ],
      reveal: "The living S bacteria recovered from the dead mouse were not the original dead cells revived — dead bacteria stay dead. They were live R bacteria that had picked up the transforming principle (genetic material) from the heat-killed S and used it to build the polysaccharide coat, becoming virulent S. Heat-killed S alone couldn't kill (option 4 is exactly the control that let the mouse live), and a spontaneous R-to-S mutation would happen with live R alone too, which it didn't — so the dead S must have supplied something.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: "Case Two — Avery, MacLeod & McCarty Name the Molecule",
      objective: "By the end of this you can explain how the three enzymes (protease, RNase, DNase) worked like a process of elimination to pin the transforming principle on DNA.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Griffith left a molecule unnamed. Between **1933 and 1944, Oswald Avery, Colin MacLeod and Maclyn McCarty** set out to name it. At the time most biologists still assumed the transforming principle was **protein**.\n\nTheir method was clean detective work. They **purified the biochemicals — proteins, DNA, RNA — from heat-killed S cells** and tested which one could transform live R cells into S. Then they attacked each candidate with an enzyme that destroys only that one molecule:\n\n- **Protease** (digests protein) → transformation **still happened**. So the principle is **not protein**.\n- **RNase** (digests RNA) → transformation **still happened**. So it is **not RNA**.\n- **DNase** (digests DNA) → transformation **stopped**. Remove the DNA and the transforming power vanishes.\n\nOnly destroying DNA switched off transformation. They concluded that **DNA is the hereditary material**. It was strong evidence — but because many biologists were still attached to the protein idea, **not everyone was convinced**. The case needed one more, cleaner experiment.",
    },
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: "Case Three — Hershey & Chase Settle It with a Blender",
      objective: "By the end of this you can explain how radioactive ³²P and ³⁵S labelled DNA and protein separately, and why only ³²P entered the bacteria.",
    },
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "The **unequivocal proof** came in **1952 from Alfred Hershey and Martha Chase**. They used **bacteriophages** — viruses that infect bacteria. A phage lands on a bacterium, injects its genetic material inside, and the bacterium then obediently builds hundreds of new phages. The question was simple: when the phage attaches, does its **DNA** go in, or its **protein** coat?\n\nTheir trick was to label the two molecules with **different radioactive atoms**, chosen because of one chemical fact — **DNA contains phosphorus but no sulfur, while protein contains sulfur but no phosphorus.**\n\n- Phages grown with **radioactive phosphorus (³²P)** ended up with **radioactive DNA** only.\n- Phages grown with **radioactive sulfur (³⁵S)** ended up with **radioactive protein** only.\n\nThey let these labelled phages attach to *E. coli*, then whirled the mixture in a **blender** to shake the empty viral coats off the bacterial surface, and **spun it in a centrifuge** to separate the heavier bacteria from the lighter virus particles. Then they checked where the radioactivity ended up:\n\n- With **³²P phages**, the **bacteria were radioactive** → the **DNA had gone inside**.\n- With **³⁵S phages**, the **bacteria were not radioactive** → the **protein had stayed outside**.\n\nDNA entered; protein did not. **DNA is the genetic material passed from virus to bacterium.** Case closed.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 10, src: '',
      alt: 'The Hershey-Chase experiment shown as two parallel tracks — one bacteriophage batch labelled with radioactive phosphorus-32 in its DNA, the other with radioactive sulfur-35 in its protein coat, each attaching to E. coli, then blended and centrifuged',
      caption: '📸 Tap each dot to follow the two radioactive tracks of the Hershey-Chase experiment (Figure 5.5)',
      generation_prompt: "Scientific textbook illustration of the Hershey-Chase experiment. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Two parallel vertical tracks side by side, each with clean white outlines and thin white leader lines, no baked-in text labels. LEFT TRACK: a bacteriophage drawn with a polyhedral head and tail-fibre legs, its internal DNA strand highlighted in glowing purple to mark radioactive phosphorus-32; an arrow down to the phage attached to a rod-shaped E. coli bacterium; then a blender/centrifuge tube where the bacterial pellet at the bottom glows purple (radioactive DNA inside the bacteria). RIGHT TRACK: an identical bacteriophage but with its outer protein coat highlighted in glowing yellow-green to mark radioactive sulfur-35; an arrow down to it attached to an E. coli; then a centrifuge tube where the supernatant at the top glows yellow-green while the bacterial pellet stays plain (radioactive protein left outside). Purple = nucleic acid/DNA, yellow-green = protein, red-tinted rod for bacterium. Biologically accurate proportions, clean symmetrical layout, no photorealism, no cartoon, no mascots, standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.22, y: 0.16, label: 'Phage with ³²P-DNA', icon: 'circle',
          detail: 'This phage batch was grown with **radioactive phosphorus (³²P)**, so only its **DNA** is labelled. DNA contains phosphorus but no sulfur, so the coat stays unlabelled.' },
        { id: uuid(), x: 0.78, y: 0.16, label: 'Phage with ³⁵S-protein', icon: 'circle',
          detail: 'This phage batch was grown with **radioactive sulfur (³⁵S)**, so only its **protein coat** is labelled. Protein contains sulfur but no phosphorus, so the DNA stays unlabelled.' },
        { id: uuid(), x: 0.30, y: 0.48, label: 'Attach to E. coli', icon: 'circle',
          detail: 'Both labelled phages are allowed to **attach to *E. coli*** bacteria and begin infection, injecting their genetic material inside.' },
        { id: uuid(), x: 0.50, y: 0.66, label: 'Blender + centrifuge', icon: 'circle',
          detail: 'The mixture is **agitated in a blender** to knock the empty viral coats off the bacterial surface, then **spun in a centrifuge** so the heavier bacteria settle as a pellet and the lighter virus particles stay in the liquid above.' },
        { id: uuid(), x: 0.22, y: 0.86, label: 'Bacteria are radioactive (³²P)', icon: 'circle',
          detail: 'In the ³²P batch the **bacterial pellet is radioactive** — the **DNA went inside**, proving DNA is what the virus passes into the bacterium.' },
        { id: uuid(), x: 0.78, y: 0.86, label: 'Bacteria are NOT radioactive (³⁵S)', icon: 'circle',
          detail: 'In the ³⁵S batch the **bacteria are not radioactive**; the radioactivity stays in the liquid with the coats — the **protein remained outside** and never entered.' },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 11, reasoning_type: 'logical',
      prompt: "Why does labelling one phage batch with ³²P and the other with ³⁵S cleanly separate DNA from protein, so the experiment can tell exactly which one enters the bacterium?",
      options: [
        "Because phosphorus and sulfur are both found in DNA, so together they trace the whole DNA molecule",
        "Because DNA contains phosphorus but no sulfur, while protein contains sulfur but no phosphorus — so ³²P tags DNA only and ³⁵S tags protein only",
        "Because radioactive atoms make DNA heavier, letting the centrifuge separate it from protein by weight",
        "Because sulfur is only found in the phage's DNA and phosphorus only in its protein coat",
      ],
      reveal: "The whole design rests on one chemical asymmetry: DNA carries phosphorus in its sugar-phosphate backbone but no sulfur, and protein carries sulfur in some amino acids but no phosphorus. So ³²P can only sit in DNA and ³⁵S can only sit in protein — each label marks one molecule and nothing else. Option 4 flips this exactly backwards (sulfur is in protein, phosphorus in DNA), which is the classic NEET trap. Option 1 is wrong because phosphorus and sulfur don't both label DNA, and the centrifuge separates bacteria from loose phage coats, not DNA from protein by radioactive weight.",
      difficulty_level: 3,
    },
    {
      id: uuid(), type: 'heading', order: 12, level: 2,
      text: "What Makes a Molecule Fit to Be Genetic Material",
      objective: "By the end of this you can list the four criteria and explain why DNA beats RNA on stability — and why RNA still came first.",
    },
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "Once DNA won, one more question remained: *why* DNA and not RNA? Note that RNA **is** the genetic material in some viruses — **Tobacco Mosaic Virus** and the **QB bacteriophage**, for example. So both nucleic acids can do the job. To choose between them, NCERT sets **four criteria** a genetic material must meet:\n\n1. **Replication** — it must be able to make copies of itself.\n2. **Stability** — it must be chemically and structurally stable.\n3. **Mutation** — it must allow slow changes, which evolution needs.\n4. **Expression** — it must express itself as 'Mendelian characters'.\n\nBoth DNA and RNA can **replicate** (thanks to base pairing and complementarity) and both can **mutate** — proteins fail the very first test, so they were never real contenders. The deciding factor is **stability**, and here DNA wins:\n\n- RNA carries a reactive **2'-OH group on every nucleotide**, which makes it **labile** — easily degraded. RNA is also catalytic (reactive), which adds to its instability.\n- DNA is **double-stranded**: if the two complementary strands separate on heating, they simply **come back together** when conditions are right. (Griffith's own result hinted at this — heat killed the bacteria but did **not** destroy the genetic material.)\n- Having **thymine in place of uracil** gives DNA extra stability.\n\nSo DNA is **less reactive and more stable** — better for **storing** information. For **mutation and expression**, RNA is nimbler: RNA mutates faster (which is why RNA-genome viruses evolve quickly), and RNA can **directly code for proteins**, while DNA depends on RNA to do so.",
    },
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "This split personality of the two molecules points to a bigger idea. If RNA can both store information *and* speed up reactions, maybe it came first. That is exactly the **RNA world** hypothesis: **RNA was the first genetic material.** Early RNA acted as **both the gene and the catalyst** — some real biochemical reactions in living cells are still run by **RNA catalysts (ribozymes)**, not protein enzymes. But being catalytic made RNA reactive and unstable, so **DNA later evolved from RNA** with chemical changes that made it more stable — double-stranded, with a complementary strand and even a repair system to resist damage. RNA did the early work; DNA took over the long-term storage. With the identity and origin of the genetic material settled, the next page turns to how DNA actually copies itself — **replication**.",
    },
    {
      id: uuid(), type: 'callout', order: 15, variant: 'remember', title: 'Who Proved What — and the Four Criteria',
      markdown: "**The three experiments, in order:**\n- **Griffith (1928)** — discovered **transformation** and the **transforming principle**, but did **not** know its chemical nature.\n- **Avery, MacLeod & McCarty (1933–44)** — showed the transforming principle is **DNA** (DNase stopped transformation; protease and RNase did not).\n- **Hershey & Chase (1952)** — gave the **unequivocal proof** using **bacteriophages** and radioactive labels: **³²P-DNA entered** the bacteria, **³⁵S-protein did not**.\n\n**A genetic material must:** (i) **replicate**, (ii) be **stable**, (iii) **mutate** (slow changes), (iv) **express** itself as Mendelian characters.\n\n**DNA vs RNA:** DNA is more **stable** (double-stranded, no reactive 2'-OH, thymine not uracil) → best for **storage**. RNA is nimbler → better for **transmission/expression**, and was the **first genetic material** (RNA world).",
    },
    {
      id: uuid(), type: 'callout', order: 16, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Match the scientist to the exact claim:** Griffith = *transformation exists* (nature unknown); Avery–MacLeod–McCarty = *DNA is the transforming principle*; Hershey–Chase = *unequivocal proof DNA is the genetic material*. NEET loves to shuffle these names against the wrong finding.\n\n**³²P vs ³⁵S:** ³²P → **DNA** (phosphorus is in DNA, not protein); ³⁵S → **protein** (sulfur is in protein, not DNA). The swapped-label option is the most common trap.\n\n**RNA-genome examples:** Tobacco Mosaic Virus and QB bacteriophage — memorise these as the 'RNA is genetic material' cases.\n\n**Classic NEET question:** \"How did Hershey and Chase differentiate between DNA and protein while working with bacteriophage?\" → **They labelled DNA with radioactive ³²P and protein with radioactive ³⁵S, since DNA has phosphorus but no sulfur and protein has sulfur but no phosphorus.**",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 17, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Griffith injected mice with heat-killed S bacteria mixed with live R bacteria. What did he observe, and what did it show?",
          options: [
            "The mice died and living S bacteria were recovered, showing a 'transforming principle' passed from dead S to live R",
            "The mice lived, showing dead bacteria can never cause harm",
            "The mice died and living R bacteria were recovered, showing R had become more virulent on its own",
            "The mice died because the heat-killed S bacteria came back to life inside them",
          ],
          correct_index: 0,
          explanation: "The mice died and Griffith recovered living S bacteria — the live R had been transformed into virulent S by a transforming principle from the heat-killed S. He did not recover R (the R had changed into S), the dead S did not revive (heat-killed bacteria stay dead), and the point of the result is precisely that the mixture killed even though each part alone was harmless.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "In the Avery, MacLeod and McCarty experiment, which enzyme treatment STOPPED transformation, and what did that prove?",
          options: [
            "Protease stopped it, proving protein is the genetic material",
            "RNase stopped it, proving RNA is the genetic material",
            "DNase stopped it, proving DNA is the transforming principle",
            "All three enzymes stopped it equally, so the result was inconclusive",
          ],
          correct_index: 2,
          explanation: "Only DNase — which destroys DNA — stopped transformation, pinning the transforming principle on DNA. Protease and RNase left transformation intact, which is exactly how they ruled out protein and RNA. If all three had worked equally the experiment would prove nothing; the whole power of the design is that only one enzyme switched the effect off.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "In the Hershey-Chase experiment, which phage batch made the bacteria radioactive, and which molecule does that identify as the genetic material?",
          options: [
            "The ³⁵S batch made the bacteria radioactive, identifying protein",
            "The ³²P batch made the bacteria radioactive, identifying protein",
            "Both batches made the bacteria equally radioactive, identifying both DNA and protein",
            "The ³²P batch made the bacteria radioactive, identifying DNA",
          ],
          correct_index: 3,
          explanation: "The ³²P-labelled phages tagged DNA only, and the bacteria became radioactive — so DNA is what entered and is the genetic material. The ³⁵S batch labelled protein, and those bacteria were NOT radioactive because the protein coat stayed outside. The tempting trap pairs ³²P with protein — the right label but the wrong molecule, since ³²P marks DNA, not protein.",
          difficulty_level: 3,
        },
        {
          id: uuid(),
          question: "Why is DNA considered a more stable genetic material than RNA?",
          options: [
            "DNA is single-stranded, so it has fewer bonds that can break",
            "DNA lacks the reactive 2'-OH group RNA has, is double-stranded so separated strands can rejoin, and uses thymine instead of uracil",
            "DNA contains uracil, which is more stable than the thymine found in RNA",
            "DNA can act as a catalyst, which protects it from being degraded",
          ],
          correct_index: 1,
          explanation: "DNA is more stable because it has no reactive 2'-OH group (RNA's 2'-OH makes it labile), it is double-stranded so complementary strands that separate on heating can come back together, and thymine in place of uracil adds further stability. DNA is double-stranded (not single), it contains thymine (not uracil — the option flips this), and being catalytic is an RNA property that makes RNA reactive and unstable, not a protection.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
