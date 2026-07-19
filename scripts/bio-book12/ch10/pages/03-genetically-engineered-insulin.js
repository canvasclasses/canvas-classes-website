'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'genetically-engineered-insulin',
  title: 'Insulin from Bacteria — Genetically Engineered Insulin',
  subtitle: "Insulin is two short chains locked together by disulphide bridges. See why the body first builds it as a longer pro-hormone, and how Eli Lilly got bacteria to make the two chains separately in 1983 and then joined them.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['biotechnology-applications', 'genetically-engineered-insulin', 'recombinant-dna', 'diabetes', 'humulin'],
  glossary: [
    { term: 'insulin', definition: 'The hormone that controls blood sugar; diabetics who cannot make enough of it must take it from outside. It is a protein made of two short polypeptide chains, A and B, held together by disulphide bridges.' },
    { term: 'pro-insulin', definition: 'The pro-hormone form in which insulin is first made in the body. It is a single stretch carrying an extra piece called the C peptide that has to be removed before the hormone becomes mature and functional.' },
    { term: 'C peptide', definition: 'The extra stretch present in pro-insulin but absent from mature insulin. It is removed during the maturation of pro-insulin into insulin.' },
    { term: 'disulphide bridge', definition: 'A chemical link (a bond between sulphur atoms) that ties the A chain and the B chain of insulin together. Also written as a disulphide bond.' },
    { term: 'Humulin', definition: 'The human insulin produced by recombinant DNA technology. Eli Lilly made the A and B chains in E. coli, extracted them, and joined them by disulphide bonds to form this human insulin.' },
    { term: 'pro-hormone', definition: 'A hormone made in an inactive longer form that must be processed before it works — the same idea as a pro-enzyme, which is an inactive enzyme awaiting activation.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dramatic banner of a single glowing flask of bacterial culture on the left and a small chain-like insulin molecule rising out of it, warm light raking across a dark laboratory',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). On the left, a single conical culture flask filled with a faintly luminous amber bacterial broth, sitting on a dark laboratory bench; a low warm side light rakes across the glass and catches soft highlights on the liquid's surface while the rest of the frame falls into deep shadow. Drifting up and to the right, out of the flask, a delicate abstract twin-chain molecule — two short ribbon-like polypeptide strands linked by fine bridge lines — rendered in cool pale blue-white, suggesting a protein being manufactured by the bacteria. Painterly, atmospheric, science-illustration mood rather than clinical. Naturalistic tones against an overall dark background (#0a0a0a base tones). No text, no labels, no leader lines, no diagram callouts.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Insulin Used to Come From Slaughtered Animals',
      markdown: "Before bacteria could make it, the insulin injected by diabetics was **extracted from the pancreas of slaughtered cattle and pigs**. It worked — but insulin from an animal source **caused some patients to develop allergy or other reactions to the foreign protein**. Imagine relying, every single day, on a hormone harvested from slaughterhouses, that your body might treat as an intruder. That is exactly the problem recombinant DNA technology set out to fix: grow a bacterium that makes **human** insulin, and you can brew as much as you need in a tank — no animals, no foreign-protein reaction.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Managing adult-onset diabetes means taking **insulin** at regular time intervals. So the first question is simple: what *is* insulin, structurally? It is a small protein made of **two short polypeptide chains — chain A and chain B — linked together by disulphide bridges**. Hold that picture: two separate short strands, stitched to each other by chemical links. That stitching is the whole reason making insulin turned out to be hard.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Why the Body Builds Insulin the Long Way First',
      objective: "By the end of this you can explain what pro-insulin is, what the C peptide is, and why the mature hormone is shorter than the form the body first makes.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "In mammals, including humans, insulin is **not** made directly in its final shape. It is first synthesised as a **pro-hormone** — like a **pro-enzyme**, a pro-hormone is an inactive longer form that has to be processed before it becomes a fully mature, working hormone.\n\nThis first form is called **pro-insulin**, and it carries **an extra stretch called the C peptide**. The C peptide is **not present in the mature insulin** — it is **removed during the maturation of pro-insulin into insulin**. So the sequence in the body is:\n\n**pro-insulin (with C peptide) → C peptide removed → mature insulin (A chain + B chain held by disulphide bridges).**\n\nThe C peptide's job is to hold the strand in the right shape while it is being built; once the folding and the disulphide bridges are in place, that spacer piece is snipped out and discarded. Keep the direction straight: the body makes the **longer** form first and **cuts it down** to the mature hormone.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Maturation of pro-insulin into insulin: a single folded pro-insulin strand with A chain, B chain and a connecting C peptide loop held by disulphide bonds, and beside it the mature insulin after the C peptide has been removed leaving only the A and B chains still bridged',
      caption: '📸 Tap each dot to explore how pro-insulin matures into insulin (Figure 10.3)',
      generation_prompt: "Scientific textbook illustration of the maturation of pro-insulin into insulin (simplified), shown as two labelled stages side by side. Flat 2D educational diagram on a dark background (#0a0a0a near-black). LEFT stage, labelled position for 'pro-insulin': a single continuous folded polypeptide drawn as a string of small round beads forming three segments — a lower B-chain segment, an upper A-chain segment lying roughly parallel to it, and a curved connecting loop of beads joining their far ends (the C peptide). Two short bridge lines link the A and B segments across the middle, and one short bridge line loops within the A segment, all drawn as thin double lines to suggest disulphide bonds. RIGHT stage, labelled position for 'mature insulin': the same A and B segments still held together by the same bridge lines, but the connecting C-peptide loop is now detached and shown as a small separate curved bead-string floating to one side, with a scissor-cut gap where it was removed. A simple arrow points from the left stage to the right stage. Clean white outlines, biologically accurate simplified proportions, functional colours (purple/blue for the peptide chains as nucleic-acid-adjacent biomolecules, a distinct warm tone for the C-peptide loop, thin yellow-white double lines for disulphide bonds). No baked-in text labels, no leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.16, y: 0.72, label: 'B chain', icon: 'circle',
          detail: 'One of the **two short polypeptide chains** that make up insulin. In the final hormone it stays joined to the A chain by disulphide bridges.' },
        { id: uuid(), x: 0.16, y: 0.34, label: 'A chain', icon: 'circle',
          detail: 'The **second short polypeptide chain**. Mature insulin is just the A chain and the B chain locked together — nothing else.' },
        { id: uuid(), x: 0.30, y: 0.50, label: 'C peptide (in pro-insulin)', icon: 'circle',
          detail: 'The **extra stretch** present only in **pro-insulin**. It connects the A and B portions while the strand is being made. It is **not present in mature insulin**.' },
        { id: uuid(), x: 0.24, y: 0.55, label: 'Disulphide bridges', icon: 'circle',
          detail: 'The **chemical links that tie chain A to chain B** (bonds between sulphur atoms). They are what hold the two short chains together as one working hormone.' },
        { id: uuid(), x: 0.55, y: 0.5, label: 'Maturation step', icon: 'circle',
          detail: 'During maturation the **C peptide is removed**. This is the pro-hormone being processed into its active form — the same idea as a pro-enzyme becoming an active enzyme.' },
        { id: uuid(), x: 0.82, y: 0.45, label: 'Mature insulin', icon: 'circle',
          detail: 'The finished hormone: only **chain A + chain B, held by disulphide bridges**, with the **C peptide gone**. This shorter form is the one that actually controls blood sugar.' },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "Mature insulin is shorter than the pro-insulin the body first makes. Which statement correctly explains the difference?",
      options: [
        "The A chain is removed during maturation, leaving only the B chain",
        "The C peptide, present in pro-insulin, is removed during maturation and is absent from mature insulin",
        "A C peptide is added to insulin during maturation to make it active",
        "The disulphide bridges are removed, separating the two chains",
      ],
      reveal: "Pro-insulin carries an **extra stretch, the C peptide**, which is **removed** as it matures — so mature insulin is the shorter form. The tempting trap is the third option, which flips the direction: the C peptide is **cut out**, never added. Neither chain A nor chain B is removed (both stay in the final hormone), and the disulphide bridges are what *hold* the two chains together, so removing them would be the opposite of maturing the hormone.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'The Eli Lilly Method — Making Human Insulin in Bacteria',
      objective: "By the end of this you can retell, in order, how a company got E. coli to produce insulin in 1983 — and pinpoint the one step (making the chains separately, then joining them) that NEET loves to test.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Here is the clever part. The **main challenge** in making insulin by recombinant DNA technology was **getting insulin assembled into a mature form** — that is, getting the two chains correctly joined.\n\nIn **1983**, **Eli Lilly**, an American company, solved it like this:\n\n1. They **prepared two DNA sequences** — one corresponding to **chain A** and one to **chain B** of human insulin.\n2. They **introduced these into plasmids of *E. coli*** (the bacterium) to produce the insulin chains.\n3. **Chains A and B were produced separately.**\n4. The two chains were then **extracted and combined by creating disulphide bonds** — stitching them together to form **human insulin**.\n\nThe human insulin produced this way is called **Humulin**. Notice how the method sidesteps the C-peptide problem entirely: instead of copying the body's build-it-long-then-cut-it-down route, Eli Lilly made the finished chains **directly and separately in bacteria**, and did the final joining themselves in the lab. On the next page we look at another medical use of this technology — gene therapy.",
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: 'Lock These In',
      markdown: "- Insulin = **two short polypeptide chains, A and B**, linked by **disulphide bridges (disulphide bonds)**.\n- The body first makes **pro-insulin**, which has an extra **C peptide**; the C peptide is **removed** during maturation (it is **absent** from mature insulin).\n- Main challenge for rDNA production = **assembling insulin into a mature form**.\n- **1983, Eli Lilly:** made **DNA for chain A and chain B**, put them into **plasmids of E. coli**, produced the two chains **separately**, then **extracted and joined them by disulphide bonds**.\n- The human insulin made this way = **Humulin**.",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**The single most-tested fact:** Eli Lilly produced **chains A and B separately in E. coli** and then **joined them by disulphide bonds** — bacteria did **not** make the whole ready-made insulin molecule. Any option saying \"E. coli produced complete/functional insulin directly\" is wrong.\n\n**C peptide:** present in **pro-insulin**, **absent** in mature insulin, **removed** during maturation. NEET flips this into \"C peptide is added\" or \"C peptide is part of mature insulin\" — both false.\n\n**Numbers to keep:** two chains (**A and B**), **disulphide** links, year **1983**, company **Eli Lilly**, host **E. coli**.\n\n**Classic NEET question:** \"In the production of human insulin by Eli Lilly, the A and B chains were —\" → **produced separately in E. coli and then combined by creating disulphide bonds.**",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'How did Eli Lilly (1983) produce human insulin using recombinant DNA technology?',
          options: [
            'Inserted a single gene into E. coli that made complete, ready-to-use insulin',
            'Prepared DNA for chains A and B, made the two chains separately in E. coli, then joined them by disulphide bonds',
            'Extracted pro-insulin from E. coli and let it mature by removing the C peptide inside the bacterium',
            'Fused cattle and pig pancreatic cells to secrete human insulin',
          ],
          correct_index: 1,
          explanation: "Eli Lilly prepared two DNA sequences (for chain A and chain B), introduced them into plasmids of E. coli to make the chains separately, then extracted and combined them by creating disulphide bonds. The favourite trap is the first option — the bacteria did NOT produce a complete insulin molecule; the two chains were made apart and joined afterwards.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'The C peptide of insulin is:',
          options: [
            'A third polypeptide chain kept in the final mature insulin',
            'The disulphide bridge that links chain A to chain B',
            'An extra stretch present in pro-insulin but removed during maturation',
            'Added to insulin only when it is made inside E. coli',
          ],
          correct_index: 2,
          explanation: "The C peptide is the extra stretch found in pro-insulin; it is not present in mature insulin and is removed as the pro-hormone matures. Option A is the classic error (it is removed, not retained), and it is a peptide stretch, not the disulphide bridge, which is the sulphur link that actually holds chains A and B together.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Insulin consists of two short polypeptide chains (A and B) that are held together by:',
          options: [
            'Disulphide bridges',
            'The C peptide loop',
            'Hydrogen bonds only',
            'Peptide bonds joining A directly to B end-to-end',
          ],
          correct_index: 0,
          explanation: "NCERT states chains A and B are linked together by disulphide bridges. The C peptide (option B) only connects the segments in pro-insulin and is removed on maturation — so it does not hold the two chains of the mature hormone; the disulphide bonds do.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Before genetically engineered insulin, what was the source of insulin for diabetic patients, and what problem did it cause?',
          options: [
            'The urine of healthy donors; it was too dilute to work',
            'The pancreas of slaughtered cattle and pigs; some patients developed allergy or reactions to the foreign protein',
            'Cultured human liver cells; it triggered no reactions at all',
            'The C peptide of pro-insulin; it was too expensive to purify',
          ],
          correct_index: 1,
          explanation: "Insulin was earlier extracted from the pancreas of slaughtered cattle and pigs, and this animal-source insulin caused some patients to develop allergy or other reactions to the foreign protein — exactly why human insulin made in bacteria was such an advance. The other options invent sources NCERT never mentions.",
          difficulty_level: 1,
        },
      ],
    },
  ],
};
