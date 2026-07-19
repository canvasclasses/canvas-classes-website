'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'antibodies-vaccination-and-allergy',
  title: 'Antibodies, Vaccines, Allergy & Autoimmunity',
  subtitle: "How your body builds its own protein weapons, why some protection is slow and lasting while other protection is borrowed and instant, and what happens when the defence system misfires.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['immunity', 'antibodies', 'vaccination', 'allergy', 'autoimmunity', 'human-health-and-disease'],
  glossary: [
    { term: 'antibody', definition: 'A protein made by B-lymphocytes and released into the blood to fight a specific pathogen. Each antibody has four peptide chains — two light and two heavy — so it is written as H2L2.' },
    { term: 'IgG', definition: 'One of the classes of antibody found in the blood. NCERT names IgA, IgM, IgE and IgG as some of the different types of antibodies our body makes.' },
    { term: 'active immunity', definition: 'Immunity in which the host is exposed to an antigen and produces its own antibodies. It is slow to build but the protection is the body\'s own. Caused by natural infection or by vaccination.' },
    { term: 'passive immunity', definition: 'Immunity in which ready-made antibodies are given directly to the body, rather than the body making its own. It acts fast. Examples: colostrum, antibodies crossing the placenta, and anti-tetanus/anti-snake-venom injections.' },
    { term: 'humoral immunity', definition: 'The antibody-mediated arm of acquired immunity. B-lymphocytes make antibodies that circulate in the blood, which is why it is called the humoral (fluid) response.' },
    { term: 'cell-mediated immunity', definition: 'The arm of acquired immunity carried out by T-lymphocytes rather than by circulating antibodies. It is responsible for the rejection of grafts and transplanted organs.' },
    { term: 'allergy', definition: 'The exaggerated response of the immune system to certain antigens (allergens) in the environment. The antibodies produced are of the IgE type.' },
    { term: 'autoimmunity', definition: 'A condition in which the body\'s immune system mistakenly attacks its own cells. Rheumatoid arthritis is an auto-immune disease.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A newborn cradled at dusk while faint protective specks pass from mother to infant, suggesting borrowed immunity',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A tender, atmospheric dusk scene of a mother cradling a newborn infant close, seen in soft silhouette against a warm low horizon glow. Drifting between them, faint gentle specks of light suggest something protective passing quietly from mother to child — never diagrammatic, just a warm sense of unseen defence being handed over. Painterly illustration style, naturalistic, deeply atmospheric, overall dark background (#0a0a0a base tones), single warm light source, no text, no labels, no diagram elements, no photorealism.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: "A Baby's First Immunity Is Borrowed",
      markdown: "A newborn's own immune system is barely warmed up — it hasn't met the world's germs yet, so it can't make its own antibodies fast enough to matter. Nature solves this with a hand-me-down. The **yellowish fluid colostrum** that a mother secretes in the first days of feeding is packed with ready-made antibodies (**IgA**) that go straight to protecting the infant. The baby didn't make them — mum did, and simply handed them over. Even before birth, the foetus receives antibodies from the mother **through the placenta**. This is your first real example of **passive immunity**: protection that is borrowed, not built.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Acquired immunity is fought by two special white blood cells: **B-lymphocytes** and **T-lymphocytes**. The B-lymphocytes are the weapon-makers. When a pathogen turns up, they pour an **army of proteins** into the blood to fight it — and those proteins are the **antibodies**.\n\nHere's the one structural fact NCERT wants locked in your head. Each antibody molecule has **four peptide chains** — **two small ones called light chains** and **two longer ones called heavy chains**. Two heavy plus two light, so an antibody is written as **H2L2**. Picture a **Y-shape**: two arms and a stem, all four chains held together. Our body makes several different classes of antibody — NCERT names **IgA, IgM, IgE and IgG** as some of them.\n\nBecause these antibodies float around in the blood, the response they drive is called the **humoral immune response** — one of the two arms of acquired immunity. Note something important: the **T-cells do not secrete antibodies themselves**; they help the B-cells make them.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'What an Antibody Actually Looks Like',
      objective: "By the end of this you can point to the two heavy chains, the two light chains and the arms that grab the antigen — and explain why the shorthand is H2L2.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 4, src: '',
      alt: 'A Y-shaped antibody molecule showing two heavy chains, two light chains, the two antigen-binding tips and the hinge holding the chains together',
      caption: '📸 Tap each dot to explore the four chains of an antibody and where it grabs the antigen (Figure 7.4)',
      hotspots: [
        { id: uuid(), x: 0.36, y: 0.62, label: 'Heavy chain (1 of 2)', icon: 'circle',
          detail: 'One of the **two longer peptide chains**, called **heavy chains**. It runs from the stem right up into one arm of the Y. Two of these give the antibody its backbone — the *H* in H2L2.' },
        { id: uuid(), x: 0.64, y: 0.62, label: 'Heavy chain (2 of 2)', icon: 'circle',
          detail: 'The **second heavy chain**, mirroring the first on the other side. The two heavy chains together form the stem and the inner half of both arms of the Y.' },
        { id: uuid(), x: 0.24, y: 0.30, label: 'Light chain (1 of 2)', icon: 'circle',
          detail: 'One of the **two small peptide chains**, called **light chains**. It sits along the outer part of one arm, paired with a heavy chain. Two of these are the *L* in H2L2.' },
        { id: uuid(), x: 0.76, y: 0.30, label: 'Light chain (2 of 2)', icon: 'circle',
          detail: 'The **second light chain**, on the opposite arm. So the full count is **two light + two heavy = four peptide chains**, which is exactly why an antibody is written **H2L2**.' },
        { id: uuid(), x: 0.20, y: 0.16, label: 'Antigen-binding tip', icon: 'circle',
          detail: 'The **tip of one arm of the Y** — the end where a light chain and a heavy chain meet. This is the business end that **locks onto the pathogen (antigen)** so it can be neutralised. There are two such tips, one on each arm.' },
        { id: uuid(), x: 0.50, y: 0.56, label: 'Hinge (chains joined)', icon: 'circle',
          detail: 'The point where the two arms meet the stem and **all four chains are held together**. This joint is what makes the molecule one Y-shaped unit rather than four loose chains.' },
      ],
      generation_prompt: "Scientific textbook illustration of a single antibody molecule (immunoglobulin), matching NCERT Figure 7.4. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A clean Y-shaped molecule centred in the frame with crisp white outlines: two long peptide chains (heavy chains) forming the central stem and the inner length of both upraised arms, drawn in one colour; two short peptide chains (light chains) running along only the outer part of each arm, drawn in a second contrasting muted colour (purple/magenta for protein) so heavy vs light is visually distinct. Small clear disulphide-style connectors shown where the chains meet at the fork/hinge holding all four chains together. The two open tips at the top of the Y drawn as the antigen-binding ends. Biologically accurate proportions, symmetrical, evenly spaced, no baked-in text labels. No photorealism, no cartoon, no mascots, standard biology textbook illustration conventions.",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Built vs Borrowed, and the Two Arms of Attack',
      objective: "By the end of this you can tell active from passive immunity, humoral from cell-mediated, and explain how a vaccine trains memory.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "**Active immunity is protection you build yourself.** When a host meets an antigen — living or dead microbes, or other foreign proteins — the body makes its **own antibodies** against it. That is active immunity. Two things switch it on: a **natural infection**, or deliberately injecting microbes during **immunisation**. Its one catch: it is **slow** and takes time to reach full strength — because the body has to manufacture the response from scratch.\n\n**Passive immunity is protection you're handed.** Here **ready-made antibodies are given directly** to the body, so there's nothing to build and it works **fast**. Colostrum, the antibodies crossing the placenta, and the injections for **tetanus (antitoxin)** and **snakebite (preformed antibodies against the venom)** are all passive immunity.\n\nNow the second split — the **two arms of acquired immunity**. The **humoral** arm is the antibodies we just met: B-cells make them, they circulate in blood. The **cell-mediated immune response (CMI)** is run by **T-lymphocytes**, not by circulating antibodies. CMI is the reason a **transplanted organ or graft gets rejected** — the body tells 'self' from 'nonself', and CMI attacks the nonself tissue. That's why doctors do tissue and blood-group matching before a transplant, and why patients take immuno-suppressants for life.\n\n**Vaccination** rests on one property of the immune system: **memory**. A vaccine is a preparation of antigenic proteins, or an inactivated/weakened pathogen. The body makes antibodies against it *and* generates **memory B- and T-cells**. Meet the real pathogen later, and those memory cells recognise it at once and flood the body with antibodies before it can take hold. When there's no time to wait for that — as in tetanus — we skip straight to giving **preformed antibodies (passive immunisation)**.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 7,
      title: 'Active vs Passive Immunity',
      columns: [
        { heading: 'Active immunity', points: [
          "The body makes its **own antibodies**.",
          "Triggered by **natural infection** or by **vaccination** (injecting the microbe/antigen).",
          "**Slow** to develop — takes time to reach full strength.",
          "Comes with **memory**, so protection is long-lasting.",
        ] },
        { heading: 'Passive immunity', points: [
          "**Ready-made antibodies** are given directly — the body makes none itself.",
          "Examples: **colostrum**, antibodies via the **placenta**, **anti-tetanus antitoxin**, **anti-snake-venom** injection.",
          "**Fast** — protection is immediate, useful when there's no time to wait.",
          "**No memory** — the borrowed antibodies are used up, so protection is short-lived.",
        ] },
      ],
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Sometimes the immune system doesn't underreact — it **overreacts**. An **allergy** is the exaggerated response of the immune system to certain antigens in the environment, called **allergens** — dust mites, pollen, animal dander. The antibodies produced here are the **IgE** type. When they're triggered, **mast cells release chemicals like histamine and serotonin**, and that's what causes the sneezing, watery eyes, running nose and difficulty in breathing. This is why **anti-histamine** drugs (along with adrenalin and steroids) quickly calm an allergic attack — they block the very chemical driving it.\n\nThe most unsettling misfire is when the system turns on its owner. Acquired immunity depends on telling **self from nonself**. Occasionally, for genetic and other unknown reasons, the **body attacks its own cells** — this is an **auto-immune disease**. NCERT's example is **rheumatoid arthritis**, which affects many people. Same immune machinery, aimed the wrong way.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A child steps on a rusty nail. To stop tetanus fast, the doctor injects an antitoxin — a preparation of preformed antibodies against the tetanus toxin. Which type of immunity is being given, and why this choice?",
      options: [
        "Active immunity, because any injection given for protection makes the body build its own antibodies",
        "Passive immunity, because ready-made antibodies are given directly, giving fast protection with no time lost building a response",
        "Cell-mediated immunity, because T-lymphocytes are being injected to attack the toxin",
        "Innate immunity, because it is present from birth and needs no exposure",
      ],
      correct_index: 1,
      reveal: "Ready-made antibodies are being handed over, not made by the child — that is passive immunity, and its whole point here is speed, because active immunity is too slow for a fast-moving danger like tetanus. The active-immunity option is the classic trap: an injection during immunisation usually means active immunity (a vaccine, where the body builds its own response), but an antitoxin injection is the opposite — it delivers the antibodies preformed. No T-lymphocytes are injected, so it isn't cell-mediated, and innate immunity is the non-specific defence you're born with, not something delivered in a syringe.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'Lock These In',
      markdown: "- An antibody = **four peptide chains**: two light + two heavy → **H2L2**, a Y-shape.\n- Antibody classes NCERT names: **IgA, IgM, IgE, IgG**. Allergy antibodies are **IgE**.\n- **Active** = body makes its **own** antibodies (infection or vaccine) → **slow**, has memory.\n- **Passive** = **ready-made** antibodies given (colostrum, placenta, anti-tetanus, anti-venom) → **fast**, no memory.\n- **Humoral** = antibodies, **B-cells**. **Cell-mediated (CMI)** = **T-cells**, and CMI causes **graft rejection**.\n- Allergy chemicals = **histamine and serotonin** from **mast cells**; **rheumatoid arthritis** = an auto-immune disease.",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**H2L2:** if a question asks how many chains an antibody has, it is **four** — two heavy, two light. 'Two chains' or 'H4L2' are the planted wrong options.\n\n**Active vs passive:** the discriminator is *who makes the antibodies*. Body makes its own → active (slow). Antibodies handed over ready-made → passive (fast). Colostrum, placenta, anti-tetanus and anti-snake-venom are the four passive examples NCERT gives.\n\n**Humoral vs CMI:** humoral = B-cells + antibodies; cell-mediated = T-cells. If a stem mentions **graft/organ rejection**, the answer is **cell-mediated immunity**, every time.\n\n**Allergy:** antibody = **IgE**; chemicals = **histamine and serotonin** from **mast cells**; relief = **anti-histamines**.\n\n**Classic NEET question:** \"Rejection of a transplanted kidney is mainly due to which type of immune response?\" → **Cell-mediated immunity (T-lymphocytes).**",
    },
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "So immunity has a shape you can now draw (the H2L2 antibody), a memory you can now train (vaccination), and two ways it can misfire (allergy and autoimmunity). Next we follow the immune system to the places these lymphocytes are actually born and trained — the lymphoid organs of the body.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'An antibody molecule is represented as H2L2. What does this stand for?',
          options: [
            'Two antigens and two lymphocytes',
            'Two heavy chains and two light chains — four peptide chains in all',
            'Two heavy chains and two long chains, made only by T-cells',
            'Two IgE antibodies bound to two mast cells',
          ],
          correct_index: 1,
          explanation: "An antibody has four peptide chains — two longer heavy chains and two smaller light chains — so it is written H2L2. The tempting trap is 'made only by T-cells': antibodies are actually made by B-lymphocytes, and T-cells only help them. IgE and mast cells belong to the allergy story, not the definition of H2L2.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "A newborn is protected by IgA antibodies passed on through its mother's colostrum. What type of immunity is this?",
          options: [
            'Passive immunity, because ready-made antibodies are handed over rather than built by the baby',
            'Active immunity, because the baby is exposed to an antigen and responds',
            'Innate immunity, because it is present from birth',
            'Cell-mediated immunity, because T-lymphocytes are transferred in the milk',
          ],
          correct_index: 0,
          explanation: "The baby doesn't make these antibodies — they arrive ready-made from the mother, which is passive immunity. Active immunity is the opposite (the body builds its own antibodies after meeting an antigen). Innate immunity is the non-specific defence you're born with, not the transfer of specific antibodies, and no T-cells are being handed over, so it isn't cell-mediated.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'A transplanted kidney is rejected by the recipient weeks after surgery. Which immune response is chiefly responsible?',
          options: [
            'Humoral immune response, driven by circulating antibodies from B-cells',
            'Innate immunity, through physical barriers like skin',
            'An allergic reaction mediated by IgE and histamine',
            'Cell-mediated immunity, driven by T-lymphocytes recognising the graft as nonself',
          ],
          correct_index: 3,
          explanation: "Graft and organ rejection is the work of cell-mediated immunity — T-lymphocytes distinguish 'self' from 'nonself' and attack the foreign tissue. The humoral option is the main trap: antibodies matter for pathogens in the blood, but rejection is specifically CMI. IgE/histamine is the allergy pathway, and innate barriers like skin have nothing to do with rejecting an internal transplant.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'Which statement about active immunity is correct?',
          options: [
            'It gives instant protection because ready-made antibodies are supplied',
            'The body produces its own antibodies, so it develops slowly but builds memory',
            'It is produced only by injecting antitoxin during a snakebite',
            'It is carried out entirely by mast cells releasing histamine',
          ],
          correct_index: 1,
          explanation: "In active immunity the host meets an antigen and makes its own antibodies, which is why it is slow to build but leaves lasting memory. Instant protection from ready-made antibodies describes passive immunity, and antitoxin for snakebite is a passive-immunisation example, not active. Mast cells and histamine belong to allergy, not to how active immunity works.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
