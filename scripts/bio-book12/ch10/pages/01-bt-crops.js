'use strict';
/**
 * Class 12 Biology — Chapter 10: Biotechnology and Its Applications
 * Page 1 — Built-In Pest Control: Bt Crops.
 *
 * Source of truth: NCERT Class 12 Ch.10 (lebo110.txt), §10.1 "Biotechnological
 * Applications in Agriculture" — the GMO definition and the Bt cotton
 * paragraphs (protein crystals → inactive protoxin → alkaline gut solubilises
 * crystals → active toxin binds midgut epithelium → pores → swelling & lysis →
 * insect death), plus the cry-gene / target-pest facts (cryIAc & cryIIAb →
 * cotton bollworms; cryIAb → corn borer) and Fig 10.1. Rule 0: every fact here
 * traces to that text; nothing invented. RNAi / nematode resistance is left for
 * the next page.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'bt-crops-and-pest-resistance',
  title: 'Built-In Pest Control — Bt Crops',
  subtitle: "A cotton plant that makes its own insecticide — and the neat trick that lets that poison sit harmlessly inside a bacterium, ride into a caterpillar, and only then switch on. Here's exactly why the toxin is a 'protoxin' until it hits the insect gut.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['gmo', 'bt-crops', 'bt-toxin', 'cry-gene', 'pest-resistance', 'biotechnology-and-its-applications'],
  glossary: [
    { term: 'GMO', definition: 'Genetically Modified Organism — a plant, bacterium, fungus, or animal whose genes have been deliberately altered by manipulation.' },
    { term: 'Bt toxin', definition: 'An insecticidal protein made by the bacterium Bacillus thuringiensis. Inside crops it acts as a built-in bio-pesticide that kills specific insect pests.' },
    { term: 'protoxin', definition: 'The inactive form in which the Bt toxin is first made. It stays harmless until the alkaline pH of an insect gut converts it into the active toxin.' },
    { term: 'cry gene', definition: 'The gene that codes for a Bt toxin protein. Different cry genes make toxins against different pests — e.g. cryIAc and cryIIAb against cotton bollworms, cryIAb against corn borer.' },
    { term: 'Bacillus thuringiensis', definition: 'A soil bacterium (Bt for short) that forms protein crystals containing a toxic insecticidal protein during a particular phase of its growth.' },
    { term: 'midgut epithelium', definition: 'The lining of cells in the middle part of an insect\'s gut. The activated Bt toxin binds this surface and punches pores into these cells.' },
  ],
  blocks: [
    {
      id: 'a1c4e7b2-0d61-4f83-9a2c-5f0e7b3d8401',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A cotton field at dusk with fully open white cotton bolls, one leaf carrying a caterpillar, in warm low light against a dark background',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A close-up stretch of a cotton field at dusk — several fully mature, fluffy white cotton bolls bursting open on their brown pods, filling the frame. On one green leaf in the mid-ground sits a single pale caterpillar (a bollworm) mid-crawl, small and unthreatening. Deep dusk lighting, painterly and atmospheric, dark overall tones (#0a0a0a base), warm low light catching the white cotton fibres, shallow depth of field so the nearest boll is sharp. Naturalistic, no text, no labels, no diagram elements.",
    },
    {
      id: 'b2d5f8c3-1e72-4093-8b3d-6a1f8c4e9502',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'A Bacterial Gene, Living Inside a Cotton Plant',
      markdown: "Here's something that sounds impossible: a **cotton plant** can carry a gene borrowed from a **bacterium**, and use it to make its own insecticide in every leaf. A hungry bollworm takes a bite, and the plant's own protein kills it — no spraying, no chemicals bought from a shop. That single borrowed gene turns the crop into its own pest-control system. This page is about how one gene does that, and the clever safety catch that keeps the poison switched off until the exact moment it's needed.",
    },
    {
      id: 'c3e6a9d4-2f83-41a4-9c4e-7b2a9d5f0613',
      type: 'heading',
      order: 2,
      level: 2,
      text: 'From GMO to a Crop That Fights Back',
      objective: "By the end of this you can define a GMO and explain what makes Bt cotton a 'bio-pesticide'.",
    },
    {
      id: 'd4f7b0e5-3094-42b5-8d5f-8c3b0e6a1724',
      type: 'text',
      order: 3,
      markdown: "Plants, bacteria, fungi and animals whose genes have been altered by manipulation are called **Genetically Modified Organisms (GMO)**. One of the most successful uses of GM technology in farming is making **pest-resistant plants** — crops that need far less pesticide because they defend themselves.\n\nThe key ingredient is the **Bt toxin**, an insect-killing protein made naturally by a soil bacterium called ***Bacillus thuringiensis*** (**Bt** for short). Scientists **cloned the Bt toxin gene** out of the bacterium and got it **expressed inside plants**, so the plant itself produces the toxin. The result is resistance to insects without any need to spray insecticide — in effect, a living **bio-pesticide**. This has been done in **Bt cotton, Bt corn, rice, tomato, potato and soyabean**.\n\nAnd the Bt toxin is fussy about who it kills. Different strains of *B. thuringiensis* make proteins that kill certain insect groups only — **lepidopterans** (tobacco budworm, armyworm), **coleopterans** (beetles) and **dipterans** (flies, mosquitoes). That specificity is exactly why it can protect a crop without wiping out everything else.",
    },
    {
      id: 'e5a8c1f6-40a5-43c6-9e6a-9d4c1f7b2835',
      type: 'heading',
      order: 4,
      level: 2,
      text: "Why the Poison Is 'Off' Until It Reaches the Insect Gut",
      objective: "By the end of this you can explain, step by step, why the Bt toxin is harmless as a protoxin and how the insect's own gut switches it on.",
    },
    {
      id: 'f6b9d2a7-51b6-44d7-8f7b-0e5d2a8c3946',
      type: 'text',
      order: 5,
      markdown: "Start with the bacterium itself. During a particular phase of its growth, ***Bacillus thuringiensis*** forms **protein crystals**, and these crystals contain the **toxic insecticidal protein**. So the poison is literally sitting inside the living bacterium. Here's the puzzle NEET loves: **why doesn't this toxin kill the *Bacillus* that makes it?**\n\nThe answer is that the toxin isn't made in its active, dangerous form. It exists as an **inactive protoxin** — a locked, harmless version. It stays locked as long as it stays in a neutral or acidic environment, which is why the bacterium is safe and, importantly, why it does no harm sitting in the leaf of a Bt crop.\n\nNow follow what happens when an insect eats it. Once the insect **ingests the inactive protoxin**, it meets the **alkaline pH of the insect's gut**. That alkaline environment **solubilises (dissolves) the crystals** and **converts the protoxin into the active toxin**. The activated toxin then **binds to the surface of the midgut epithelial cells** and **creates pores** in them. Water rushes in, the cells **swell and burst (lysis)**, the gut lining is destroyed — and the insect **dies**. The safety catch is elegant: the poison only unlocks in the one place you want it to, the alkaline gut of the pest that ate the plant.",
    },
    {
      id: 'a7c0e3b8-62c7-45e8-9a8c-1f6e3b9d4a57',
      type: 'interactive_image',
      order: 6,
      src: '',
      alt: 'Four-stage flow of Bt toxin action: inactive protoxin crystal, ingestion into alkaline insect gut, conversion to active toxin, and pores forming in swollen midgut cells',
      caption: '📸 Tap each dot to follow the toxin from harmless crystal to insect death',
      generation_prompt: "Scientific textbook illustration showing the mechanism of action of Bt toxin as a left-to-right flow diagram in four stages. Flat 2D educational diagram on a dark background (#0a0a0a near-black), clean white outlines, no baked-in text labels. Stage 1 (far left): a cluster of angular geometric protein crystals drawn in a cool inactive blue-grey, representing the inactive protoxin crystals. An arrow leads right to Stage 2: a simplified cutaway of a caterpillar's gut tube tinted alkaline teal-green, with the crystals shown entering it. An arrow to Stage 3: the crystals now dissolved into small individual wedge-shaped active toxin molecules rendered in an activated purple/magenta, floating free. An arrow to Stage 4 (far right): a row of midgut epithelial cells (pink/magenta soft-tissue cells with white outlines) with the toxin molecules embedded in the cell membrane forming visible round pores; one or two cells drawn swollen and bursting (lysis) with contents leaking out. Functional colours: blue-grey = inactive/locked, teal = alkaline gut fluid, purple/magenta = active toxin and animal cells. Biologically schematic, no photorealism, no cartoon mascots, standard biology textbook illustration style.",
      hotspots: [
        { id: 'aa11b2c3-1147-4d58-9e60-3b7c8d914f11', x: 0.1, y: 0.5, label: 'Inactive protoxin crystals', detail: '*Bacillus thuringiensis* forms **protein crystals** holding the toxic protein — but in an **inactive protoxin** form. Because it is locked, it does **not** harm the bacterium that makes it, nor the crop leaf that carries it.', icon: 'circle' },
        { id: 'aa12b2c3-2247-4d58-9e60-3b7c8d914f12', x: 0.36, y: 0.5, label: 'Ingested into the alkaline gut', detail: 'The insect **eats** the protoxin. The **alkaline pH of the insect gut** is the trigger — it **solubilises (dissolves) the crystals**, releasing the protein.', icon: 'circle' },
        { id: 'aa13b2c3-3347-4d58-9e60-3b7c8d914f13', x: 0.62, y: 0.5, label: 'Converted to active toxin', detail: 'In that alkaline environment the **protoxin is converted into the active toxin**. This is the switch-on step — the poison is now dangerous, but only inside the pest.', icon: 'circle' },
        { id: 'aa14b2c3-4447-4d58-9e60-3b7c8d914f14', x: 0.85, y: 0.35, label: 'Binds midgut & makes pores', detail: 'The activated toxin **binds the surface of the midgut epithelial cells** and **creates pores** in their membranes.', icon: 'circle' },
        { id: 'aa15b2c3-5547-4d58-9e60-3b7c8d914f15', x: 0.85, y: 0.68, label: 'Cell swelling, lysis, death', detail: 'Through the pores, the cells **swell and burst (lysis)**. The gut lining is wrecked and the **insect dies**.', icon: 'circle' },
      ],
    },
    {
      id: 'b8d1f4c9-73d8-46f9-8b9d-2a7f4c0e5b68',
      type: 'reasoning_prompt',
      order: 7,
      reasoning_type: 'logical',
      prompt: "*Bacillus thuringiensis* makes a protein that is lethal to insects and stores it right inside its own cells — yet the bacterium survives perfectly well. From the mechanism you just read, what is the single best explanation for why the bacterium is not killed by its own toxin?",
      options: [
        "The bacterium keeps the toxin in a special crystal case that insect enzymes chew open but bacterial enzymes cannot",
        "The toxin is made as an inactive protoxin, and it only converts to the active, pore-forming toxin in the alkaline pH of an insect's gut — a condition the bacterium never provides",
        "The bacterium continuously produces an antidote protein that neutralises the toxin inside its own cytoplasm",
        "The toxin is active everywhere, but bacterial cell walls are simply too thick for the pores to matter",
      ],
      reveal: "The toxin is stored as an **inactive protoxin**. It needs the **alkaline pH of an insect gut** to solubilise the crystal and convert it to the active toxin — the bacterium's own interior never reaches that alkaline, activating condition, so the poison stays locked and harmless to its maker. The 'crystal case chewed open by insect enzymes' idea sounds close but misses the actual trigger, which is **pH-driven conversion**, not enzymatic cutting of a case. There is no antidote protein in the NCERT account, and the toxin is not active everywhere — that's the whole point of it being a protoxin.",
      difficulty_level: 2,
    },
    {
      id: 'c9e2a5d0-84e9-470a-9c0e-3b8a5d1f6c79',
      type: 'table',
      order: 8,
      caption: 'cry genes and the pests their toxins control (NCERT §10.1)',
      headers: ['cry gene', 'Pest it controls'],
      rows: [
        ['cryIAc', 'Cotton bollworms'],
        ['cryIIAb', 'Cotton bollworms'],
        ['cryIAb', 'Corn borer'],
      ],
    },
    {
      id: 'd0f3b6e1-95f0-481b-8d1f-4c9b6e2a7d80',
      type: 'callout',
      order: 9,
      variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Bt toxin** is made by the bacterium ***Bacillus thuringiensis*** and coded by a gene named ***cry***.\n- The toxin gene is **cloned from the bacterium and expressed in the plant** → the crop becomes its own **bio-pesticide** (Bt cotton, Bt corn, rice, tomato, potato, soyabean).\n- The toxin is made as an **inactive protoxin** → this is why it does **not** kill the *Bacillus*.\n- **Alkaline gut pH** → solubilises the crystals → **converts protoxin to active toxin** → binds **midgut epithelial cells** → makes **pores** → cells swell & **lyse** → insect dies.\n- **cry gene → pest:** **cryIAc** and **cryIIAb** → **cotton bollworms**; **cryIAb** → **corn borer**.",
    },
    {
      id: 'e1a4c7f2-a601-492c-9e2a-5d0c7f3b8a91',
      type: 'callout',
      order: 10,
      variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Protoxin, not toxin:** NEET repeatedly asks *why the Bt toxin doesn't harm the bacterium.* The answer is one line — it exists as an **inactive protoxin** and is activated only by the **alkaline pH of the insect gut**. Any option about crystal shells, antidotes, or thick cell walls is a distractor.\n\n**The exact activation chain is examined verbatim:** ingested protoxin → **alkaline gut pH solubilises crystals** → active toxin → **binds midgut epithelium** → **pores** → swelling & **lysis** → death. Learn the order; questions scramble these steps.\n\n**Classic NEET question:** \"Which cry gene(s) protect cotton against bollworms?\" → **cryIAc and cryIIAb** (while **cryIAb** guards corn against the corn borer). Do not swap them.",
    },
    {
      id: 'f2b5d8a3-b712-4a3d-8f3b-6e1d8a4c9b02',
      type: 'text',
      order: 11,
      markdown: "So Bt cotton is a plant carrying one borrowed bacterial gene, quietly making a poison that stays safely switched off until a caterpillar's gut turns it on. But insects aren't the only threat to a crop — tiny roundworms called nematodes attack roots from below, and stopping them needs a completely different trick that silences the pest's own genes. That's the next page.",
    },
    {
      id: 'a3c6e9b4-c823-4b4e-9a4c-7f2e9b5d0c13',
      type: 'inline_quiz',
      order: 12,
      pass_threshold: 0.67,
      questions: [
        {
          id: 'b4d7f0c5-d934-4c5f-8b5d-8a3f0c6e1d24',
          question: "Why does the Bt toxin fail to kill the Bacillus thuringiensis that produces it?",
          options: [
            "The bacterium's cell wall blocks the toxin's pores from forming",
            "The bacterium makes an enzyme that destroys the toxin as fast as it is made",
            "The toxin is made as an inactive protoxin and is only activated by the alkaline pH of an insect gut",
            "The toxin only affects plant cells, never bacterial or animal cells",
          ],
          correct_index: 2,
          explanation: "The Bt protein is produced as an **inactive protoxin**; it needs the **alkaline pH of an insect's gut** to solubilise the crystals and convert it into the active toxin — a condition the bacterium never encounters, so it stays harmless to its maker. The cell-wall and enzyme options are inventions not in the mechanism, and the toxin's real target is insect midgut cells, not plant cells.",
          difficulty_level: 2,
        },
        {
          id: 'c5e8a1d6-ea45-4d60-9c6e-9b4a1d7f2e35',
          question: "Put the events of Bt toxin action in the correct order.",
          options: [
            "Alkaline gut solubilises crystals → protoxin becomes active toxin → toxin binds midgut epithelium → pores form → cells swell and lyse",
            "Toxin binds midgut epithelium → alkaline gut activates it → pores form → cells lyse → crystals dissolve",
            "Pores form → protoxin ingested → alkaline gut activates toxin → cells swell → toxin binds gut",
            "Protoxin binds midgut cells → cells lyse → alkaline gut converts it to active toxin → pores form",
          ],
          correct_index: 0,
          explanation: "The sequence is: the insect ingests the protoxin, the **alkaline gut pH solubilises the crystals and converts protoxin to active toxin**, the toxin **binds the midgut epithelial cells**, **pores** form, and the cells **swell and lyse**, killing the insect. The other chains scramble the order — activation must come before binding, and pore formation and lysis come last, not first.",
          difficulty_level: 3,
        },
        {
          id: 'd6f9b2e7-fb56-4e71-8d7f-0c5b2e8a3f46',
          question: "The proteins encoded by the genes cryIAc and cryIIAb are used to control which pest?",
          options: [
            "Corn borer",
            "Root-knot nematode of tobacco",
            "Flies and mosquitoes",
            "Cotton bollworms",
          ],
          correct_index: 3,
          explanation: "NCERT states that the proteins encoded by **cryIAc and cryIIAb control the cotton bollworms**, while **cryIAb** controls the **corn borer**. The root-knot nematode is stopped by RNA interference (a different strategy), and flies/mosquitoes are dipterans killed by other Bt strains — not the pest tied to these specific cry genes.",
          difficulty_level: 2,
        },
        {
          id: 'e7a0c3f8-0c67-4f82-9e80-1d6c3f9b4a57',
          question: "A GMO (Genetically Modified Organism) is best defined as:",
          options: [
            "Only a bacterium that has had a foreign gene inserted into it",
            "Any organism whose genes have been altered by manipulation",
            "A plant produced by crossing two natural varieties through pollination",
            "An organism that has mutated on its own in the wild",
          ],
          correct_index: 1,
          explanation: "A GMO is a **plant, bacterium, fungus, or animal whose genes have been altered by manipulation** — the definition spans all these groups, not bacteria alone. Conventional crossing through pollination and spontaneous natural mutation both change genes without deliberate manipulation, so neither produces a GMO in this sense.",
          difficulty_level: 1,
        },
      ],
    },
  ],
};
