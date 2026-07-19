'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'competent-hosts-and-gel-electrophoresis',
  title: 'Getting DNA In & Sorting It — Hosts & Gel Electrophoresis',
  subtitle: "How you trick a bacterium into swallowing foreign DNA, and how you line up cut DNA pieces by size to pull out the exact one you want.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['competent-host', 'transformation', 'gel-electrophoresis', 'recombinant-dna-technology'],
  glossary: [
    { term: 'competent cell', definition: 'A host cell that has been treated so its membrane will let DNA pass through. Normal cells will not take up DNA on their own; they must be made competent first.' },
    { term: 'transformation', definition: 'The process of a host cell taking up foreign DNA (such as a recombinant plasmid) from its surroundings.' },
    { term: 'heat shock', definition: 'A brief warming of competent cells to 42 °C, sandwiched between spells on ice, that pushes the recombinant DNA into the bacterium.' },
    { term: 'biolistics', definition: 'A method of getting DNA into plant cells by firing high-velocity micro-particles of gold or tungsten coated with DNA at them. Also called the gene gun.' },
    { term: 'gel electrophoresis', definition: 'A technique that separates DNA fragments by size by making them move through a gel matrix under an electric field.' },
    { term: 'agarose', definition: 'A natural polymer extracted from sea weeds, used as the gel matrix in electrophoresis. Its mesh acts like a sieve.' },
    { term: 'elution', definition: 'Cutting a chosen DNA band out of the gel and extracting the DNA from that gel piece so it can be used further.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single bacterial cell on a dark field, a glowing ring of DNA hovering just outside its membrane, with a faint gel of stacked orange bands behind it',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). On the left, a single rod-shaped bacterial cell rendered in soft blue-green, its outer membrane faintly lit, with a glowing purple ring of circular DNA (a plasmid) hovering just outside the membrane as if about to be pulled in. Toward the right of the frame, dissolving into the darkness, a suggestion of a laboratory gel: faint horizontal orange bands stacked in a column, glowing gently as under UV light, never sharply in focus. A quiet sense of DNA being moved and sorted. Painterly, atmospheric illustration, deep near-black background (#0a0a0a base tones), single soft glow tying the scene together, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'DNA Hates Water-Repelling Doors',
      markdown: "You have your recombinant plasmid ready. Now it has to get *inside* a bacterium. Simple, right? Not at all. **DNA is a hydrophilic molecule** — it loves water — and the bacterial cell membrane will not let a water-loving molecule stroll through. Left alone, the plasmid just sits outside, locked out. So before you can hand a bacterium new genes, you have to force its door open. That trick — turning an ordinary cell into one that will *accept* DNA — is what this page is about.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "A bacterium will not take up a plasmid on its own. To force it to, the bacterial cells must first be made **‘competent’ to take up DNA** — a **competent cell** is simply one whose membrane has been prepared to let DNA pass. Getting there is a small, precise recipe, and the exam loves the exact details of it.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Making a Host Competent — and Other Ways In',
      objective: "By the end of this you can name the calcium-and-heat-shock recipe step by step, and match microinjection, the gene gun, and disarmed pathogens to what they are used for.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The standard method uses two things: a **divalent cation** and a jolt of heat.\n\n- First, the cells are treated with a specific concentration of a **divalent cation, such as calcium (Ca²⁺)**. This increases the efficiency with which DNA enters the bacterium **through pores in its cell wall**.\n- Then the recombinant DNA is forced in: the cells are incubated **with the recombinant DNA on ice**, followed by placing them **briefly at 42 °C — this is the heat shock** — and then putting them **back on ice**. That temperature swing is what enables the bacteria to take up the recombinant DNA.\n\nThat calcium-plus-heat-shock route is the one to remember, but it is **not the only way** to get alien DNA into a host. NCERT lists three more:\n\n- **Micro-injection** — the recombinant DNA is injected **directly into the nucleus of an animal cell** with a fine needle.\n- **Biolistics (the gene gun)** — cells are **bombarded with high-velocity micro-particles of gold or tungsten coated with DNA**. This one is **suitable for plants**.\n- **‘Disarmed pathogen’ vectors** — a pathogen stripped of its ability to cause disease is allowed to **infect the cell**, and in doing so it transfers the recombinant DNA into the host.\n\nSo: calcium and heat shock for bacteria, a needle for animal cells, a gun for plant cells, and a tamed pathogen as a living delivery van.",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Gel Electrophoresis — Sorting DNA by Size',
      objective: "By the end of this you can explain why cut DNA runs toward the positive end and why the smallest pieces travel farthest.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "When a restriction enzyme cuts DNA, you are left with a mix of fragments of different sizes. To see them and separate them, you use **gel electrophoresis**.\n\nThe idea rests on one fact: **DNA is a negatively charged molecule.** Put the fragments in an electric field and they are pulled toward the **positive electrode — the anode**. They travel through a **matrix**, and the most commonly used matrix is **agarose**, a natural polymer extracted from **sea weeds**.\n\nThe agarose acts like a **sieve**. Its mesh lets small pieces slip through easily but slows big ones down, so the fragments **separate (resolve) according to their size**. Hence the rule you must lock in: **the smaller the fragment, the farther it moves.**\n\nPure DNA is invisible in ordinary light, so the separated fragments are **stained with a compound called ethidium bromide** and then exposed to **UV radiation**. Under UV you see **bright orange bands** of DNA in the ethidium-bromide-stained gel — each band is a pile of fragments of one size. Finally, you **cut the wanted band out of the agarose gel and extract the DNA from that gel piece**. This step is called **elution**. The DNA purified by elution is then used to build recombinant DNA by joining it to a cloning vector.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'An agarose gel electrophoresis set-up: wells at the negative cathode end at the top, orange DNA bands migrating down through the gel toward the positive anode at the bottom, small fragments having travelled farthest',
      caption: '📸 Tap each dot to explore the gel electrophoresis set-up — where DNA is loaded, which way it runs, and why band position tells you fragment size.',
      generation_prompt: "Scientific textbook illustration of agarose gel electrophoresis. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A rectangular gel shown upright: a row of small rectangular loading wells across the very top, marked with a faint negative (–) cathode electrode symbol above them; the same gel with a positive (+) anode electrode symbol at the very bottom. From the wells, several vertical lanes of DNA run downward — drawn as short horizontal bars (bands) glowing in bright orange (as under UV light), stacked at different heights in each lane: larger bands sitting high near the wells, smaller bands having travelled far down toward the anode. A thin downward arrow along one side indicating the direction of migration from – (top) toward + (bottom). Purple-tinted DNA fragment motifs acceptable. Clean white outlines, biologically accurate proportions, no baked-in text labels. No photorealism, no cartoon, no mascots, standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.30, y: 0.10, label: 'Wells + cathode (–) end', icon: 'circle',
          detail: 'The DNA sample is loaded into these wells at the **top**, next to the **negative electrode (cathode)**. Since DNA is negatively charged, it is *pushed away* from this end.' },
        { id: uuid(), x: 0.55, y: 0.45, label: 'Agarose gel matrix', icon: 'circle',
          detail: 'The whole slab is **agarose**, a polymer from sea weeds. Its fine mesh acts as a **sieve** — the fragments have to squeeze through it, which is what sorts them by size.' },
        { id: uuid(), x: 0.28, y: 0.38, label: 'Larger fragments (stay near top)', icon: 'circle',
          detail: 'Big fragments get **caught in the mesh** and move slowly, so they stay **high up, close to the wells** — only a short distance from where they started.' },
        { id: uuid(), x: 0.70, y: 0.72, label: 'Smaller fragments (travel farthest)', icon: 'circle',
          detail: 'Small fragments slip through the sieve easily and move fastest, ending up **far down the gel**. The smaller the fragment, the farther it goes.' },
        { id: uuid(), x: 0.50, y: 0.86, label: 'Direction of migration → anode (+)', icon: 'circle',
          detail: 'DNA is **negatively charged**, so under the electric field it moves toward the **positive electrode (anode)** at the bottom. That is why every band runs downward, away from the wells.' },
        { id: uuid(), x: 0.82, y: 0.55, label: 'Orange bands (ethidium bromide + UV)', icon: 'circle',
          detail: 'Each **band** is a group of same-size fragments. You cannot see pure DNA, so it is stained with **ethidium bromide** and viewed under **UV light**, where it glows **bright orange**. Cutting a band out and extracting its DNA is called **elution**.' },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "Two DNA fragments start from the same well and run for the same time in the same agarose gel. One is 500 base pairs long, the other is 5000. When you switch off the current, which is nearer the anode, and why?",
      options: [
        "The 5000 bp fragment, because a longer molecule carries more negative charge and so is pulled harder toward the anode",
        "The 500 bp fragment, because the smaller a fragment is, the more easily it slips through the sieving mesh of the agarose and so the farther it travels",
        "Both are at the same place, because they started together and the field pulled them equally",
        "The 5000 bp fragment, because larger fragments are lighter and therefore move faster through the gel",
      ],
      reveal: "The 500 bp fragment ends up nearer the anode. Separation in a gel is by **size through the sieving effect of the agarose**, not by total charge — smaller fragments squeeze through the mesh more easily and move farther. The tempting trap is the charge argument (option 1): yes, a longer DNA carries more charge, but it is also bulkier and gets held back by the mesh, so size wins and the big fragment lags behind. Option 4 has the physics backwards — larger fragments are heavier and slower, not lighter and faster.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: 'Lock These Three In',
      markdown: "- **Making a host competent:** treat with a **divalent cation (calcium, Ca²⁺)** → incubate with DNA on ice → **brief 42 °C heat shock** → back on ice.\n- **DNA runs toward the anode (+):** DNA is **negatively charged**, so in the electric field it always moves to the **positive** electrode.\n- **Smaller = farther:** the **smaller** the fragment, the **farther** it travels through the agarose sieve. Big pieces stay near the wells.",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Competent cell recipe:** the exact sequence — Ca²⁺ (a *divalent* cation) then a *brief 42 °C* heat shock — is lifted almost word for word. Watch for options that flip 'divalent' to 'monovalent', name sodium instead of calcium, or change the temperature.\n\n**Method-to-cell matching:** microinjection → **animal** cells (into the nucleus); biolistics / gene gun with **gold or tungsten** particles → **plant** cells; disarmed pathogen → living vector. NEET swaps these around — 'gene gun for animal cells' is a classic wrong option.\n\n**Migration direction:** DNA → **anode (positive)**. The trap answer is 'cathode', betting you forgot DNA is negatively charged.\n\n**Classic NEET question:** \"In gel electrophoresis, DNA fragments move towards which electrode, and how are they separated?\" → **towards the anode (positive electrode); separated according to size, with smaller fragments moving farther.**",
    },
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "You now have the two remaining tools of the trade: a way to make a host swallow DNA, and a way to sort cut DNA and pull out the exact fragment you want. With the enzymes, vectors, hosts, and separation all in hand, we are ready to run the whole assembly line end to end — the **processes of recombinant DNA technology** — on the next page.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'During gel electrophoresis, DNA fragments move towards which electrode, and why?',
          options: [
            'Towards the cathode (negative), because DNA carries a net positive charge',
            'They stay in the well, because DNA is too heavy to move through agarose',
            'Towards the anode (positive), because DNA is a negatively charged molecule',
            'Towards whichever electrode is nearer, regardless of charge',
          ],
          correct_index: 2,
          explanation: "DNA is negatively charged, so in an electric field it is pulled toward the positive electrode — the anode. The tempting wrong answer is the cathode, which assumes DNA is positive; it is not. Opposite charges attract, so a negative molecule heads to the positive end.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'What is the correct way to make bacterial cells competent so they take up recombinant DNA?',
          options: [
            'Treat with a divalent cation such as calcium, incubate with the DNA on ice, give a brief 42 °C heat shock, then return to ice',
            'Bombard them with gold particles coated in DNA at high velocity',
            'Inject the DNA directly into the nucleus with a fine needle',
            'Boil the cells at 100 °C so the membrane dissolves and DNA floods in',
          ],
          correct_index: 0,
          explanation: "The competent-cell recipe is a divalent cation (calcium) to prime the pores, then the on-ice / brief 42 °C heat shock / back-on-ice cycle. Gold-particle bombardment is biolistics (used for plants) and nuclear injection is microinjection (used for animal cells) — both are different delivery methods, not how you make a bacterium competent. Boiling at 100 °C would simply kill the cells.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'In an agarose gel, one lane shows a band near the wells and another band far down toward the anode. What can you say about the two sets of fragments?',
          options: [
            'The band far down is made of larger fragments, since bigger DNA moves faster',
            'Both bands must be the same size, since they are in the same gel',
            'The band near the wells carries no charge, which is why it barely moved',
            'The band far down is made of smaller fragments, since smaller fragments travel farther',
          ],
          correct_index: 3,
          explanation: "Fragments separate by size through the sieving effect of the agarose, and the smaller the fragment, the farther it moves. So the band far down the gel is the smaller fragments and the band near the wells is the larger ones — not the other way round. Both bands are charged; the large one simply travels less because the mesh holds it back.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Firing high-velocity micro-particles of gold or tungsten coated with DNA at cells is a method called biolistics (the gene gun). It is especially suited to which cells?',
          options: [
            'Animal cells, because the particles are aimed at the nucleus',
            'Plant cells',
            'Bacterial cells, replacing the calcium and heat-shock step',
            'Only disarmed pathogen cells',
          ],
          correct_index: 1,
          explanation: "Biolistics, or the gene gun, is described by NCERT as a method suitable for plants. Firing DNA-coated gold or tungsten particles at animal cells is not the point — the needle-based microinjection is the animal-cell method. For bacteria, the calcium-and-heat-shock competent-cell route is used, not the gene gun.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
