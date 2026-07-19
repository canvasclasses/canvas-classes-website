'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-lac-operon',
  title: 'Switching Genes On & Off — the lac Operon',
  subtitle: "How a bacterium turns the right genes on only when they're needed — the classic lac operon of E. coli, worked out by Jacob and Monod.",
  page_number: 8,
  page_type: 'lesson',
  tags: ['lac-operon', 'gene-regulation', 'jacob-monod', 'molecular-basis-of-inheritance'],
  glossary: [
    { term: 'operon', definition: 'A group of structural genes controlled together by one common promoter and one operator, along with a regulatory gene. It lets a bacterium switch a whole set of related genes on or off at once.' },
    { term: 'repressor', definition: 'A protein made by the regulatory (i) gene that can sit on the operator and block transcription. It is the "off switch" of the lac operon.' },
    { term: 'operator', definition: 'A short DNA sequence next to the promoter where the repressor binds. Each operon has its own specific operator — the lac operator binds only the lac repressor.' },
    { term: 'promoter', definition: 'The DNA site where RNA polymerase attaches to begin transcription. In the lac operon it is shared by all three structural genes.' },
    { term: 'structural gene', definition: 'A gene that codes for an actual working product (like an enzyme). In the lac operon these are z, y and a.' },
    { term: 'inducer', definition: 'A molecule that switches an operon on. For the lac operon the inducer is lactose (allolactose); it inactivates the repressor.' },
    { term: 'beta-galactosidase', definition: 'The enzyme coded by the z gene. It breaks the disaccharide lactose into glucose and galactose so the cell can use them for energy.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark, atmospheric scene of an E. coli bacterium with molecular switches glowing faintly along a strand of DNA inside it',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single rod-shaped E. coli bacterium seen up close in a dark microscopic world, its outer membrane faintly translucent. Inside, a long loop of DNA runs across the frame, and along one stretch of it a row of tiny molecular 'switches' glow softly — some lit, some dark — hinting at genes being turned on and off. A few small lactose sugar molecules drift nearby in the surrounding fluid. Moody, atmospheric, painterly illustration, deep dark background (#0a0a0a base tones), soft cool blue and faint amber glow only where the switches sit. No text, no labels, no diagram callouts.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'A Bacterium That Waits Its Turn',
      markdown: "E. coli would rather eat **glucose** than anything else. Give it both glucose and lactose, and it ignores the lactose completely — it only bothers making the lactose-digesting machinery **after the glucose runs out**. Why waste energy building enzymes for a food you're not eating yet? That single habit — *make the enzyme only when the food is around* — is the whole idea behind the lac operon.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "A cell carries thousands of genes, but it never runs them all at full blast at once. It switches genes **on when their product is needed and off when it isn't**. This control is called **regulation of gene expression**, and it can happen at several stages — but in bacteria (prokaryotes) the main point of control is right at the start: whether **transcription** even begins.\n\nThe cleanest example is E. coli feeding on lactose. To use lactose, the cell needs the enzyme **beta-galactosidase**, which splits lactose into glucose and galactose. No lactose around means no need for the enzyme — so the genes for it stay off. Lactose arriving switches them on. Two scientists, **Francois Jacob and Jacque Monod**, worked out exactly how this switch is built. They called the whole unit an **operon**.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Parts of the lac Operon',
      objective: "By the end of this you can name every piece of the lac operon and say what each one does — the exact set NEET asks you to match.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "An **operon** bundles several genes under one shared control so they all switch together. The lac operon has these pieces, sitting in a row along the DNA:\n\n- The **regulatory gene, i** — it codes for the **repressor** protein. (Careful: the *i* stands for *inhibitor*, **not** inducer.)\n- The **promoter** — where RNA polymerase lands to start transcription.\n- The **operator** — a short stretch next to the promoter where the repressor can bind. The lac operator binds only the lac repressor.\n- Three **structural genes**, all sharing that one promoter:\n  - **z** codes for **beta-galactosidase** — splits lactose into glucose and galactose.\n  - **y** codes for **permease** — lets lactose get into the cell.\n  - **a** codes for **transacetylase**.\n\nAll three structural-gene products are needed to handle lactose, which is why they're kept together under one switch.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'The lac operon laid out along a DNA strand: regulatory gene i, promoter, operator, and structural genes z, y and a, with the repressor protein and RNA polymerase nearby',
      caption: '📸 Tap each dot to explore the parts of the lac operon (Figure 5.14)',
      hotspots: [
        { id: uuid(), x: 0.12, y: 0.52, label: 'Regulatory gene (i)', icon: 'circle',
          detail: "Codes for the **repressor** protein, which is made all the time. The *i* is from *inhibitor* — it does **not** mean inducer. It sits apart, before the promoter." },
        { id: uuid(), x: 0.30, y: 0.52, label: 'Promoter', icon: 'circle',
          detail: "The landing site for **RNA polymerase**. From here the enzyme reads the three structural genes. All of z, y and a share this one promoter." },
        { id: uuid(), x: 0.42, y: 0.52, label: 'Operator', icon: 'circle',
          detail: "A short DNA sequence right next to the promoter. When the **repressor sits here, transcription is blocked**. The lac operator binds only the lac repressor." },
        { id: uuid(), x: 0.57, y: 0.52, label: 'z gene', icon: 'circle',
          detail: "Codes for **beta-galactosidase (β-gal)** — the key enzyme that breaks lactose into **glucose and galactose** for energy." },
        { id: uuid(), x: 0.78, y: 0.52, label: 'y and a genes', icon: 'circle',
          detail: "**y** codes for **permease**, which lets lactose enter the cell. **a** codes for **transacetylase**. All three (z, y, a) are needed to metabolise lactose." },
        { id: uuid(), x: 0.42, y: 0.26, label: 'Repressor protein', icon: 'circle',
          detail: "Made constantly from the i gene. It clamps onto the **operator** to keep the operon off. Lactose (the inducer) knocks it loose." },
        { id: uuid(), x: 0.30, y: 0.78, label: 'RNA polymerase', icon: 'circle',
          detail: "Binds the **promoter** and transcribes the structural genes — but only when the operator is free of the repressor." },
      ],
      generation_prompt: "Scientific textbook illustration of the lac operon of E. coli. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A horizontal DNA segment drawn as a clean double bar running left to right, divided into labelled boxes in this order: a separate 'i' regulatory gene box on the far left (purple fill for nucleic-acid), then a small 'promoter' box, then an 'operator' box, then three adjoining structural-gene boxes 'z', 'y', 'a'. Above the operator, a rounded repressor protein (pink/magenta) shown poised to bind the operator. Near the promoter, an oval RNA polymerase enzyme (blue). Clean white outlines, thin white leader lines, biologically accurate left-to-right gene arrangement, evenly spaced boxes, no baked-in text labels beyond the single-letter gene names on the boxes. No photorealism, no cartoon, no mascots, standard molecular-biology textbook style.",
    },
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'The Switch: OFF vs ON',
      objective: "By the end of this you can explain, step by step, why the operon is silent without lactose and active with it.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "The repressor is made **all the time** from the i gene — it's always around. What changes is whether it's **stuck to the operator or knocked off it**.\n\n**OFF — no lactose.** The repressor binds the operator. With the repressor sitting there, **RNA polymerase can't get past to transcribe** the z, y and a genes. No transcription, no enzymes. The cell isn't wasting effort on machinery it doesn't need.\n\n**ON — lactose present.** Lactose (as allolactose) acts as the **inducer**. It binds the repressor and **changes its shape so it can no longer grip the operator**. The repressor falls off, the operator is now free, and **RNA polymerase moves in and transcribes** all three genes. The lactose-digesting enzymes get made. Because lactose *induces* its own operon like this, the lac operon is called an **inducible operon** — and you can think of it as an enzyme's own substrate switching on the enzyme's production.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 8,
      title: 'lac operon OFF (no lactose) vs ON (lactose present)',
      columns: [
        { heading: 'OFF — no lactose', points: [
          'Repressor is active and binds the operator.',
          'RNA polymerase is blocked — it cannot transcribe past the operator.',
          'Structural genes z, y, a are NOT transcribed.',
          'No beta-galactosidase, permease or transacetylase made.',
          'Cell saves energy — no lactose to digest anyway.',
        ] },
        { heading: 'ON — lactose present', points: [
          'Lactose (allolactose) acts as the inducer.',
          'Inducer binds the repressor and inactivates it — it lets go of the operator.',
          'Operator is now free; RNA polymerase transcribes z, y and a.',
          'Beta-galactosidase, permease and transacetylase are made.',
          'Cell can now break lactose into glucose and galactose for energy.',
        ] },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "Lactose has just entered an E. coli cell. What does it actually do to switch the lac operon on?",
      options: [
        "It binds the operator directly and pushes the repressor off",
        "It binds the repressor and changes its shape so the repressor can no longer sit on the operator",
        "It binds RNA polymerase and drags it onto the promoter",
        "It switches on the i gene so more repressor is made",
      ],
      reveal: "Lactose (as allolactose) is the inducer, and it works on the **repressor** — it binds the repressor and inactivates it, so the repressor lets go of the operator. With the operator free, RNA polymerase can finally transcribe the genes. Option 1 is the classic trap: it's true the repressor ends up off the operator, but lactose doesn't touch the operator itself — it acts on the repressor. Lactose never grabs RNA polymerase, and it certainly doesn't make *more* repressor (the i gene runs constantly on its own).",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'Lock These In',
      markdown: "- **i gene → repressor** (i is from *inhibitor*, not inducer).\n- **z gene → beta-galactosidase**; **y gene → permease**; **a gene → transacetylase**.\n- **Inducer = lactose (allolactose)** — it inactivates the repressor.\n- **OFF:** repressor on operator → no transcription. **ON:** inducer removes repressor → transcription proceeds.\n- The lac operon is an **inducible operon**; control by the repressor is **negative regulation**.",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**The i-gene trap:** *i* stands for *inhibitor*, and the i gene codes for the **repressor** — NCERT flags this on purpose. Any option saying 'i means inducer' is wrong.\n\n**Gene → product matching:** z = β-galactosidase, y = permease, a = transacetylase. NEET loves to swap these (e.g. 'y codes for β-galactosidase') — memorise the exact pairing.\n\n**Negative regulation:** control of the lac operon by the repressor is called **negative regulation**. It is an **inducible** operon.\n\n**Classic NEET question:** \"In the lac operon, in the presence of an inducer such as lactose, the repressor —\" → **is inactivated (binds the inducer, changes shape) and leaves the operator, so RNA polymerase transcribes the structural genes.**",
    },
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "That's the lac operon end to end: one regulatory gene, a promoter, an operator, three structural genes, and a repressor that lactose can knock loose. Next we'll zoom right out to the biggest sequencing effort ever attempted — the Human Genome Project.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'In the lac operon, which gene codes for the repressor protein?',
          options: ['The z gene', 'The y gene', 'The a gene', 'The i gene'],
          correct_index: 3,
          explanation: "The regulatory i gene codes for the repressor — remember i is from 'inhibitor'. The z gene codes for beta-galactosidase, y for permease and a for transacetylase; those are the three structural genes, not the regulator.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'When lactose is absent, why are the structural genes z, y and a NOT transcribed?',
          options: [
            'The active repressor binds the operator and blocks RNA polymerase',
            'The promoter is deleted so RNA polymerase has nowhere to bind',
            'The inducer binds the operator and shuts it down',
            'Beta-galactosidase breaks down the RNA polymerase',
          ],
          correct_index: 0,
          explanation: "With no lactose, the repressor stays active and sits on the operator, blocking RNA polymerase from transcribing the operon. The promoter isn't deleted — it's simply blocked downstream at the operator. There is no inducer present when lactose is absent, and beta-galactosidase does not destroy RNA polymerase.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'What is the role of lactose (allolactose) in switching the lac operon on?',
          options: [
            'It acts as the repressor, binding the operator',
            'It acts as the inducer, binding and inactivating the repressor',
            'It is the promoter where RNA polymerase binds',
            'It is the enzyme that digests the operator',
          ],
          correct_index: 1,
          explanation: "Lactose is the inducer: it binds the repressor and inactivates it, freeing the operator so transcription can start. It is not the repressor (that's the i-gene product) and not the promoter (a fixed DNA site); calling it an enzyme that 'digests the operator' has no basis — lactose is the substrate the operon exists to break down.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Because lactose itself triggers the genes needed to break it down, the lac operon is best described as which type of operon?',
          options: [
            'A repressible operon',
            'A constitutive operon that is always fully on',
            'An inducible operon',
            'A eukaryotic split operon',
          ],
          correct_index: 2,
          explanation: "Lactose induces its own operon, so it is an inducible operon controlled by negative regulation. It is not repressible (that describes operons switched off by their end product), and it is certainly not always-on — the whole point is that it stays off until lactose appears. Operons are a prokaryotic feature, so 'eukaryotic split operon' is wrong too.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
