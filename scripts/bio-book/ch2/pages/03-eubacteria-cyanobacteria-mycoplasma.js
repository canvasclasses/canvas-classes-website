'use strict';
const { v4: uuid } = require('uuid');

const cyanoHotspots = [
  {
    id: uuid(), x: 0.30, y: 0.48, label: 'Vegetative cell', icon: 'circle',
    detail: 'A normal cell of the filament. This is where **photosynthesis** happens — it carries chlorophyll a, the same pigment green plants use, so the organism builds its own food from sunlight.',
  },
  {
    id: uuid(), x: 0.60, y: 0.46, label: 'Heterocyst', icon: 'circle',
    detail: 'A larger, paler, specialised cell spaced along the chain. This is the **only** cell that fixes atmospheric nitrogen ($N_2$) into a usable form — the job that lets *Nostoc* and *Anabaena* enrich the soil and water around them.',
  },
  {
    id: uuid(), x: 0.50, y: 0.74, label: 'Gelatinous sheath', icon: 'circle',
    detail: 'A slimy jelly-like coat wrapped around the whole colony. It holds the cells together and is one reason cyanobacteria can pile up into visible **blooms** on the surface of polluted water.',
  },
  {
    id: uuid(), x: 0.50, y: 0.30, label: 'Filament', icon: 'circle',
    detail: 'The whole thread of cells joined end to end. Cyanobacteria may be unicellular, colonial, or **filamentous** like this one — a single row of cells forming one continuous strand.',
  },
];

module.exports = {
  slug: 'eubacteria-cyanobacteria-mycoplasma',
  title: 'Eubacteria, Cyanobacteria & Mycoplasma',
  subtitle: "The 'true bacteria' run the whole spread — the blue-green algae that fix nitrogen in special cells, the ones that recycle the soil, the ones that make your curd, and the wall-less mycoplasma that break every rule.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['biological-classification', 'monera', 'eubacteria', 'cyanobacteria', 'mycoplasma'],
  glossary: [
    { term: 'heterocyst', definition: 'A specialised, thick-walled cell in some filamentous cyanobacteria (like Nostoc and Anabaena) where atmospheric nitrogen is fixed into a usable form.' },
    { term: 'cyanobacteria', definition: 'Photosynthetic eubacteria (also called blue-green algae) that carry chlorophyll a like green plants; they may be unicellular, colonial, or filamentous.' },
    { term: 'chemosynthetic', definition: 'A way of making food (autotrophy) by oxidising inorganic substances such as nitrates, nitrites, or ammonia to release energy, instead of using sunlight.' },
    { term: 'mycoplasma', definition: 'Bacteria that completely lack a cell wall; the smallest living cells known, able to survive without oxygen, and many of them pathogenic.' },
    { term: 'decomposer', definition: 'An organism that breaks down dead organic matter, returning its nutrients to the environment. Most heterotrophic bacteria are decomposers.' },
  ],
  blocks: [
    // 0 — hero
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dusk wetland where a still pond surface carries a faint blue-green film, ringed by reeds and legume plants',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet freshwater wetland at dusk: a still, dark pond in the foreground whose surface carries a faint blue-green film catching the last light, ringed by tall reeds and low leafy legume plants along the muddy bank. Steam rises softly from one warm corner suggesting a nearby hot spring. The whole scene is bathed in deep amber-into-indigo dusk light, painterly and atmospheric, dark naturalistic background tones throughout (#0a0a0a base). No text, no labels, no diagram elements, no visible organisms up close — just the sense of unseen life filling the water and soil.",
    },
    // 1 — fun_fact
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Bacteria in Your Kitchen and Your Medicine',
      markdown: "The spoonful of curd you set from warm milk overnight? Bacteria did that. The antibiotic a doctor prescribes when you have an infection? Bacteria help make many of those too. The same enormous group also fixes nitrogen in the roots of bean and pea plants so farmers don't have to add as much fertiliser. **Heterotrophic bacteria are the most abundant organisms in nature** — most of them quietly useful, a few of them the cause of diseases like cholera and typhoid. The 'true bacteria' on this page are that whole spread of talents in one group.",
    },
    // 2 — text: eubacteria
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "There are thousands of different kinds of **eubacteria**, and the name is worth taking literally — it means **'true bacteria'**. Two features mark them out: they have a **rigid cell wall** that gives the cell its shape and protection, and if the bacterium can move, it swims using a whip-like **flagellum**.\n\nThat simple body plan hides a huge range of lifestyles. Some eubacteria make their own food (autotrophs), some live off other organisms or dead matter (heterotrophs), and among the food-makers, some run on sunlight while others run on chemistry. The rest of this page walks through those talents one group at a time — starting with the ones that turned green.",
    },
    // 3 — heading: cyanobacteria
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Cyanobacteria — the Blue-Green Algae',
      objective: "By the end of this you'll know why a bacterium can photosynthesise like a plant, and which single cell does the nitrogen-fixing.",
    },
    // 4 — text: cyanobacteria
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The **cyanobacteria** — also called **blue-green algae** — are eubacteria that behave a lot like tiny plants. They carry **chlorophyll a**, the very same pigment green plants use, which makes them **photosynthetic autotrophs**: they build their own food straight from sunlight. You'll find them almost anywhere there's water or damp ground — **freshwater, marine, or terrestrial** — and their bodies come in three build styles: **unicellular** (single cells), **colonial** (cells clustered together), or **filamentous** (cells joined in a thread).\n\nThe colonies are usually wrapped in a **gelatinous sheath**, a slimy jelly coat that holds them together. When a pond or lake gets polluted with extra nutrients, cyanobacteria can multiply so fast that they pile into visible **blooms** across the water surface. And some filamentous kinds have a trick almost nothing else can do: they pull **nitrogen straight out of the air** and lock it into a usable form. This nitrogen fixation happens in special cells called **heterocysts** — as in *Nostoc* and *Anabaena*.",
    },
    // 5 — interactive_image: Nostoc filament
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A filamentous blue-green alga (Nostoc): a chain of cells with one specialised heterocyst, wrapped in a gelatinous sheath',
      caption: '📸 Tap each dot to explore a filamentous cyanobacterium (Nostoc)',
      generation_prompt: "Scientific textbook illustration of a filamentous blue-green alga (Nostoc). Flat 2D educational diagram on a dark background (#0a0a0a near-black). A single horizontal chain of rounded cells joined end to end, running left to right across the frame, drawn with clean white outlines. Most cells are filled a soft blue-green (photosynthetic vegetative cells). One cell roughly two-thirds along the chain is noticeably larger, paler and thicker-walled to stand out as a heterocyst. A translucent slimy jelly-like sheath is drawn as a soft outer boundary wrapping the entire chain. Biologically accurate proportions, no text or labels baked into the image, no photorealism, no cartoon, matches standard biology textbook illustration conventions.",
      hotspots: cyanoHotspots,
    },
    // 6 — reasoning_prompt (mid-page)
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A waterlogged field is poor in usable nitrogen, yet Nostoc thrives there and actually leaves the soil richer than it found it. Which feature of Nostoc best explains this?",
      options: [
        "Its gelatinous sheath absorbs nitrogen fertiliser that farmers spread on the field",
        "Its heterocysts fix nitrogen from the air into a form other organisms can use",
        "It survives by decomposing the dead plants already lying in the field",
        "Its chlorophyll a lets it make nitrogen directly during photosynthesis",
      ],
      reveal: "Nostoc has heterocysts — specialised cells that take inert atmospheric nitrogen ($N_2$) and fix it into a usable form, which is what enriches the soil around it. The sheath is just a protective jelly coat, not an absorber of fertiliser. Nostoc is a photosynthetic autotroph, so it isn't living by decomposing dead plants. And chlorophyll a runs photosynthesis (making food from sunlight) — it does not fix nitrogen; the heterocyst does that separate job.",
      difficulty_level: 2,
    },
    // 7 — heading: chemosynthetic & heterotrophic
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Chemosynthetic & Heterotrophic Bacteria',
      objective: "By the end of this you can tell apart the bacteria that feed on chemistry, the ones that recycle the dead, and the ones that make us sick.",
    },
    // 8 — text: chemosynthetic + heterotrophic
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Not every food-making bacterium needs sunlight. **Chemosynthetic autotrophic bacteria** get their energy by **oxidising inorganic substances** — nitrates, nitrites, and ammonia — and use the energy released to make their ATP. Their quiet importance is huge: they play a great role in **recycling nutrients** like **nitrogen, phosphorous, iron, and sulphur**, keeping those elements cycling through the environment instead of getting locked away.\n\nThe biggest group of all, though, is the **heterotrophic bacteria** — the **most abundant** bacteria in nature. The majority are important **decomposers**, breaking down dead matter and returning its nutrients. Many of them shape human life directly: they're helpful in **making curd from milk**, in the **production of antibiotics**, and in **fixing nitrogen in the roots of legume** plants. But some are **pathogens** that damage humans, crops, farm animals, and pets — **cholera, typhoid, tetanus, and citrus canker** are all well-known diseases caused by different bacteria.",
    },
    // 9 — heading: reproduction
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'How Bacteria Reproduce',
      objective: "By the end of this you can name the three ways bacteria multiply — and why one of them barely counts as 'sexual'.",
    },
    // 10 — text: reproduction + lead into mycoplasma
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "Bacteria multiply **mainly by fission** — one cell simply splits into two, which is how a handful of soil can hold hundreds of them so quickly. When conditions turn harsh, sometimes they switch strategy and produce **spores**, tough resting stages that wait out the bad times until things improve.\n\nThey also have a **primitive kind of sexual reproduction**: instead of two parents combining fully, one bacterium **transfers a piece of DNA** to another. It's a stripped-down version of what larger organisms do — enough to shuffle a little genetic material around, no more. That covers the true bacteria — except for one group that breaks the most basic rule of all.",
    },
    // 11 — remember: mycoplasma
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember', title: 'Mycoplasma — the Rule-Breakers',
      markdown: "- **No cell wall at all** — Mycoplasma completely lack a cell wall, which is the one feature that otherwise defines true bacteria.\n- **The smallest living cells known** — nothing smaller has been found that still counts as a living cell.\n- **Can survive without oxygen** — they don't need it to live.\n- **Many are pathogenic** — causing disease in both animals and plants.",
    },
    // 12 — exam_tip
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Heterocyst = nitrogen fixation.** If a question mentions heterocysts, the answer is nitrogen fixation, and the go-to examples are ***Nostoc* and *Anabaena***. Don't confuse the heterocyst (fixes N₂) with the vegetative cell (does photosynthesis).\n\n**Cyanobacteria have chlorophyll a** — the same pigment as green plants — which is why they're photosynthetic autotrophs, *not* chemosynthetic. Chemosynthetic bacteria are the ones that oxidise nitrates/nitrites/ammonia.\n\n**Mycoplasma = smallest + wall-less.** The classic pairing NEET tests: Mycoplasma completely lack a cell wall AND are the smallest living cells known. Both facts in one organism.\n\n**Classic NEET question:** \"Cholera, typhoid, tetanus and citrus canker are caused by —\" → **bacteria** (different bacterial species). Keep this disease list attached to bacteria, not viruses.",
    },
    // 13 — closing text: bridge to Protista
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "That's the full sweep of Kingdom Monera — cell wall or none, sunlight or chemistry, helpful or harmful, all of it built on the simplest cells alive. Next we step up in size and complexity to the single-celled organisms that finally have a proper nucleus: **Kingdom Protista**.",
    },
    // 14 — inline_quiz (LAST)
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'In filamentous cyanobacteria such as Nostoc and Anabaena, which specialised cells carry out the fixation of atmospheric nitrogen?',
          options: ['Heterocysts', 'Vegetative cells', 'Spores', 'Cells of the gelatinous sheath'],
          correct_index: 0,
          explanation: "Nitrogen fixation happens only in the heterocysts — the larger, thicker-walled cells spaced along the filament. The vegetative cells run photosynthesis with chlorophyll a, spores are resting stages for hard times, and the gelatinous sheath is just a protective jelly coat, not a site of nitrogen fixation.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'Cyanobacteria are described as photosynthetic autotrophs like green plants. Which feature is the reason for that description?',
          options: [
            'They oxidise nitrates and nitrites to release energy',
            'They contain chlorophyll a, the same pigment green plants use',
            'They absorb dead organic matter from their surroundings',
            'They live inside a host and draw nutrients from it',
          ],
          correct_index: 1,
          explanation: "Chlorophyll a is the pigment that lets cyanobacteria make food from sunlight, exactly as green plants do — that is what makes them photosynthetic autotrophs. Oxidising nitrates and nitrites for energy describes chemosynthetic bacteria; absorbing dead matter describes heterotrophic decomposers; and drawing nutrients from a host describes a parasite — none of those is how cyanobacteria feed.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'A soil bacterium gets its energy by oxidising ammonia and nitrites, and helps recycle nitrogen, iron, and sulphur in the environment. This bacterium is best described as:',
          options: [
            'Chemosynthetic autotrophic',
            'Photosynthetic autotrophic',
            'A heterotrophic decomposer',
            'A pathogen that causes typhoid',
          ],
          correct_index: 0,
          explanation: "Getting energy by oxidising inorganic substances like ammonia and nitrites — and driving nutrient recycling — is exactly what chemosynthetic autotrophic bacteria do. Photosynthetic autotrophs use sunlight, not chemical oxidation; a heterotroph would feed on dead or living organic matter rather than oxidising inorganic chemicals; and a typhoid pathogen is defined by the disease it causes, not by this nutrient-recycling role.",
          difficulty_level: 3,
        },
        {
          id: uuid(),
          question: 'Which statement about Mycoplasma is correct?',
          options: [
            'They completely lack a cell wall and are the smallest living cells known',
            'They have the thickest, most rigid cell wall of all true bacteria',
            'They can only survive when plenty of oxygen is available',
            'They are always harmless decomposers with no disease role',
          ],
          correct_index: 0,
          explanation: "Mycoplasma completely lack a cell wall and are the smallest living cells known — the two facts NEET pairs together. They don't have a thick wall (they have none at all), they can survive without oxygen rather than needing it, and many of them are pathogenic in animals and plants rather than harmless.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
