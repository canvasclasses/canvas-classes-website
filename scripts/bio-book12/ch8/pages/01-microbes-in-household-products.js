'use strict';
/**
 * Class 12 Biology — Chapter 8: Microbes in Human Welfare
 * Page 1 — Microbes in Household Products (Microbes in Your Kitchen).
 *
 * Source of truth: NCERT Class 12 Ch.8 (lebo108.txt), section 8.1
 * "Microbes in Household Products" — curd from milk by Lactobacillus / lactic
 * acid bacteria (LAB) + vitamin B12; dosa & idli dough fermented by bacteria
 * (puffed by CO2); bread dough by baker's yeast (Saccharomyces cerevisiae);
 * 'toddy' from fermented palm sap; cheese — Swiss cheese holes from CO2 by
 * Propionibacterium sharmanii, Roquefort cheese ripened by the fungus
 * Penicillium roqueforti. Rule 0: every fact here traces to that text; nothing
 * invented. (NCERT spells the Swiss-cheese bacterium 'sharmanii' — kept verbatim.)
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'microbes-in-household-products',
  title: 'Microbes in Your Kitchen',
  subtitle: "The curd, dosa batter, bread and cheese in your home are all built by living microbes — here is exactly which microbe makes which one, and how.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['microbes-in-human-welfare', 'household-products', 'lactic-acid-bacteria', 'fermentation', 'cheese'],
  glossary: [
    { term: 'lactic acid bacteria (LAB)', definition: 'A group of bacteria, including Lactobacillus, that grow in milk and produce acids. Those acids coagulate the milk proteins and turn milk into curd.' },
    { term: 'Lactobacillus', definition: 'The best-known lactic acid bacterium. It sets curd from milk and, once inside our stomach, helps keep disease-causing microbes in check.' },
    { term: 'Saccharomyces cerevisiae', definition: "Baker's yeast — the fungus that ferments bread dough and makes it rise." },
    { term: 'Propionibacterium', definition: 'The bacterium (Propionibacterium sharmanii) whose large output of CO2 gas creates the big holes seen in Swiss cheese.' },
    { term: 'Penicillium', definition: 'A fungus. The species Penicillium roqueforti is grown on Roquefort cheese to ripen it and give it its particular flavour.' },
    { term: 'inoculum (starter)', definition: 'A small amount of an already-fermented product, such as a spoon of curd, added to a fresh batch. It carries millions of live microbes that seed the new fermentation.' },
  ],
  blocks: [
    {
      id: '3a40a28d-67dd-4ccb-9699-5220d4fcd906',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A warm kitchen counter at night holding a bowl of set curd, a batter jar, a loaf of bread and a wedge of holed cheese',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet home kitchen counter at night, seen from the side in warm low light. Arranged along the counter: an earthen bowl of freshly set thick curd, a covered jar of pale fermenting idli batter risen and bubbly at the rim, a rustic loaf of bread with an airy crumb, and a wedge of pale cheese with visible round holes. Steam or a faint haze of warmth hangs over them. Painterly and atmospheric, deep dark background tones overall (#0a0a0a base), naturalistic, cosy, no text, no labels, no diagram elements.",
    },
    {
      id: '019fdbff-7875-4658-ba0e-a3a24faa6e69',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'The Spoon of Curd That Sets a Whole Bowl',
      markdown: "When your mother stirs a single spoon of yesterday's curd into a bowl of warm milk and leaves it overnight, she is doing microbiology. That spoonful — the **starter** — carries **millions of lactic acid bacteria (LAB)**. Kept warm, they multiply through the milk and set the whole bowl into curd. And they don't just thicken it: as they grow, they push up the milk's **vitamin B12**, so the curd is actually more nutritious than the milk it came from. The same bacteria that live in your curd also settle in your stomach, where they help keep disease-causing microbes in check.",
    },
    {
      id: '92151cf9-d683-4a5e-9ecc-15d0f57eb6f8',
      type: 'text',
      order: 2,
      markdown: "We tend to think of microbes only as germs that make us sick. But some of the most ordinary food in your home is made *by* microbes, on purpose. Start with **curd**. Micro-organisms called **Lactobacillus** — and others grouped together as **lactic acid bacteria (LAB)** — grow inside the milk. As they grow they release **acids**. Those acids do two things: they **coagulate** the milk (curdle it, so it thickens and sets) and they **partially digest the milk proteins**. That is the whole trick behind curd — bacteria making acid.\n\nThe rest of your kitchen runs on the same idea, just with different microbes doing the fermenting. Learn to read each food as *which microbe + what it does*, and the whole topic becomes one short list.",
    },
    {
      id: '19469f12-b057-46bf-919e-f323c5284f9b',
      type: 'heading',
      order: 3,
      level: 2,
      text: "One Kitchen, Many Microbes — Batter, Bread, Toddy and Cheese",
      objective: "By the end of this you can name the exact microbe behind curd, idli/dosa batter, bread, toddy and each cheese — and say what that microbe actually does.",
    },
    {
      id: '949060be-377e-4660-b5c9-401ea3799f93',
      type: 'text',
      order: 4,
      markdown: "The **dough for dosa and idli** is fermented by **bacteria**. As they ferment, they give off **carbon dioxide (CO2) gas** — and that gas is trapped inside the thick batter, which is why it swells up and looks **puffed and spongy** by morning. The **dough for bread** works the same way, but the microbe is different: it is **baker's yeast, *Saccharomyces cerevisiae***, a fungus, whose CO2 makes the bread rise light.\n\nMicrobes also make traditional drinks. **'Toddy'**, a drink of some parts of **southern India**, is made by **fermenting the sap tapped from palms**. Microbes are even used to ferment fish, soyabean and bamboo-shoots into foods.\n\nThen there is **cheese**, one of the oldest foods made with microbes. Each variety gets its own texture, flavour and taste from the **specific microbe** used on it. The large **holes in 'Swiss cheese'** are made by a bacterium, ***Propionibacterium sharmanii***, which produces a **large amount of CO2** — the gas bubbles leave those round holes behind. **'Roquefort cheese'** is instead **ripened by growing a fungus, *Penicillium roqueforti*, on it**, which gives it its particular flavour.",
    },
    {
      id: 'e7e7aa6e-646a-4a29-a09a-6626489cef4f',
      type: 'table',
      order: 5,
      caption: '📸 Household products and the microbe behind each — the exact matches NEET tests.',
      headers: ['Product', 'Microbe', 'What it does'],
      rows: [
        ['Curd', 'Lactobacillus and other lactic acid bacteria (LAB)', 'Produce acids that coagulate and partially digest milk proteins, setting curd; also raise its vitamin B12.'],
        ['Dosa & idli batter', 'Bacteria', 'Ferment the dough; the CO2 they release puffs the batter up.'],
        ['Bread', "Baker's yeast — Saccharomyces cerevisiae (a fungus)", 'Ferments the dough so it rises.'],
        ['Toddy (southern India)', 'Fermenting microbes', 'Ferment the sap tapped from palms into the drink.'],
        ['Swiss cheese', 'Propionibacterium sharmanii (a bacterium)', 'Produces a large amount of CO2 — the gas leaves the big holes.'],
        ['Roquefort cheese', 'Penicillium roqueforti (a fungus)', 'Ripens the cheese, giving it its particular flavour.'],
      ],
    },
    {
      id: 'b3691670-e1d4-4e95-8d78-bcd6315025fb',
      type: 'reasoning_prompt',
      order: 6,
      reasoning_type: 'logical',
      prompt: "Two things happen in the kitchen for the same underlying reason: idli batter puffs up and swells overnight, and Swiss cheese ends up full of big round holes. What single cause explains both?",
      options: [
        "Both are caused by the acid that lactic acid bacteria pour into the mixture",
        "Both are caused by CO2 gas produced by the fermenting microbes getting trapped in the mixture",
        "Both are caused by the microbes physically eating tunnels through the food",
        "Both are caused by water evaporating and leaving empty pockets behind",
      ],
      correct_index: 1,
      reveal: "The one shared cause is CO2 gas. The bacteria fermenting idli batter release CO2, and it gets trapped in the thick batter, so the batter puffs up. In Swiss cheese, Propionibacterium sharmanii makes a large amount of CO2, and those trapped gas bubbles leave the big holes. The tempting wrong answer is acid: acid is what LAB use to set curd, but acid coagulates milk — it doesn't blow bubbles or holes. Puffing and holes are always a gas story, not an acid story.",
      difficulty_level: 2,
    },
    {
      id: '9c87d1e7-21a8-4cf9-8ddf-ab0c73580d36',
      type: 'callout',
      order: 7,
      variant: 'remember',
      title: 'Lock These In',
      markdown: "1. **Curd = Lactobacillus / LAB.** They make **acid**, which coagulates the milk — and they raise its **vitamin B12**.\n2. **A spoon of curd = the starter (inoculum)** — millions of LAB that seed a fresh bowl.\n3. **Idli & dosa batter = bacteria**, puffed up by **CO2**. **Bread = baker's yeast, *Saccharomyces cerevisiae***, also risen by CO2.\n4. **Toddy** = fermented **sap of palms**, from **southern India**.\n5. **Swiss cheese holes = CO2 from *Propionibacterium sharmanii*** (a bacterium).\n6. **Roquefort cheese = ripened by the fungus *Penicillium roqueforti***.",
    },
    {
      id: '4bc1ffc8-3da8-4615-afb6-630ffdf426ba',
      type: 'callout',
      order: 8,
      variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Bacterium vs fungus — the favourite trap:** curd (Lactobacillus/LAB), idli-dosa batter (bacteria) and Swiss cheese (*Propionibacterium sharmanii*) are made by **bacteria**. Bread (*Saccharomyces cerevisiae*) and Roquefort ripening (*Penicillium roqueforti*) are the work of **fungi**. NEET loves to swap these.\n\n**Vitamin B12:** the vitamin whose level goes *up* when LAB turn milk into curd — memorise it as B12, not any other vitamin.\n\n**CO2 does two jobs:** it puffs dough (idli, dosa, bread) *and* it makes the holes in Swiss cheese — same gas, two products.\n\n**Classic NEET question:** \"The large holes in Swiss cheese are produced by which organism, and due to what?\" → ***Propionibacterium sharmanii*, due to a large amount of CO2.**",
    },
    {
      id: 'd0e4e9ff-1fc1-4fa2-a9f7-32fc524c6275',
      type: 'text',
      order: 9,
      markdown: "So the microbes in your kitchen already work for you every day. The same helpful microbes are put to work on a far bigger stage — in giant vessels making beverages, antibiotics and life-saving chemicals. That is where we head next.",
    },
    {
      id: '2329e68e-3aff-48ed-8337-dc453343aea9',
      type: 'inline_quiz',
      order: 10,
      pass_threshold: 0.67,
      questions: [
        {
          id: 'a998c836-12cf-45c1-81e7-44e7cb79b022',
          question: "Milk is converted into curd by Lactobacillus and other lactic acid bacteria. What do these bacteria actually do to the milk, and what nutritional bonus follows?",
          options: [
            "They release CO2 gas that puffs the milk up, and add vitamin C",
            "They produce acids that coagulate the milk proteins, and increase vitamin B12",
            "They grow a fungal mesh through the milk, and increase vitamin D",
            "They ripen the milk like cheese, and add vitamin A",
          ],
          correct_index: 1,
          explanation: "LAB produce acids that coagulate (curdle) and partially digest the milk proteins — that is what sets curd — and the process raises the milk's vitamin B12. The CO2 option is the trap: CO2 is what puffs idli batter and makes Swiss-cheese holes, not what sets curd; curd is an acid story, and the vitamin is B12.",
          difficulty_level: 1,
        },
        {
          id: '07aca752-c75e-4051-a37b-c9340e77f778',
          question: "Which product is fermented by a FUNGUS rather than by bacteria?",
          options: [
            "Curd",
            "Idli and dosa batter",
            "Bread, using Saccharomyces cerevisiae",
            "Swiss cheese, using Propionibacterium sharmanii",
          ],
          correct_index: 2,
          explanation: "Bread dough is fermented by baker's yeast, Saccharomyces cerevisiae, which is a fungus. Curd (Lactobacillus/LAB), idli-dosa batter (bacteria) and Swiss cheese (Propionibacterium sharmanii) are all made by bacteria — Swiss cheese is the tempting wrong pick because it is a well-known cheese, but its microbe is a bacterium.",
          difficulty_level: 2,
        },
        {
          id: '8dce795b-13e8-4d74-819e-8f5fef09ede4',
          question: "The large holes in Swiss cheese are produced because of:",
          options: [
            "A large amount of CO2 released by the bacterium Propionibacterium sharmanii",
            "The fungus Penicillium roqueforti growing through the cheese",
            "Acid poured out by Lactobacillus curdling the cheese unevenly",
            "Baker's yeast, Saccharomyces cerevisiae, ripening the cheese",
          ],
          correct_index: 0,
          explanation: "Swiss cheese holes come from a large amount of CO2 gas produced by the bacterium Propionibacterium sharmanii — the trapped gas leaves round holes. Penicillium roqueforti is the fungus for Roquefort cheese, not Swiss; Lactobacillus sets curd, not cheese holes; and Saccharomyces cerevisiae raises bread, not this cheese.",
          difficulty_level: 2,
        },
        {
          id: '707042be-471e-4438-ac12-503e8381f739',
          question: "'Toddy', a traditional drink of some parts of southern India, is made by fermenting:",
          options: [
            "Malted cereals with brewer's yeast",
            "Milk with lactic acid bacteria",
            "Sap tapped from palms",
            "Soyabean paste with Penicillium",
          ],
          correct_index: 2,
          explanation: "Toddy is made by fermenting the sap tapped from palms — that is the exact NCERT fact. Malted cereals fermented by yeast give beer and whisky (industrial beverages, a later section), milk plus LAB gives curd, and soyabean is fermented into food, not into toddy.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
