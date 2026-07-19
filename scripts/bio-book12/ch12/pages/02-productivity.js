'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'productivity-gpp-and-npp',
  title: 'Productivity — GPP, NPP & What Reaches the Herbivore',
  subtitle: "Plants earn a gross salary of sugar every day — and spend a big slice of it on themselves before anyone else gets a bite. This page is about the pay slip: what the ecosystem makes, what the plant keeps, and what is left over for every animal above it.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['ecosystem', 'productivity', 'gpp', 'npp', 'secondary-productivity', 'primary-production'],
  glossary: [
    { term: 'primary production', definition: 'The amount of biomass or organic matter produced per unit area over a time period by plants during photosynthesis. It is an amount, so it is expressed in weight (g m⁻²) or in energy (kcal m⁻²).' },
    { term: 'productivity', definition: 'The rate of biomass production — how much organic matter is made per unit area per unit time. Because it is a rate, a time unit is always attached: g m⁻² yr⁻¹ or (kcal m⁻²) yr⁻¹.' },
    { term: 'gross primary productivity (GPP)', definition: 'The rate of production of organic matter by an ecosystem during photosynthesis. It is the total, before anything is subtracted.' },
    { term: 'net primary productivity (NPP)', definition: 'Gross primary productivity minus the respiration losses (R) of the plants. It is the biomass actually available for consumption by heterotrophs — herbivores and decomposers.' },
    { term: 'respiration loss (R)', definition: 'The considerable part of GPP that plants themselves use up in respiration to stay alive. It never reaches the consumers.' },
    { term: 'secondary productivity', definition: 'The rate of formation of new organic matter by consumers.' },
    { term: 'biomass', definition: 'The organic matter present in living bodies, measured as weight — the physical stuff photosynthesis builds and the stuff a herbivore eats.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'Sunlight falling at dusk over a green meadow that runs to a dark ocean horizon, the land richly vegetated and the vast water plain almost bare',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dusk landscape: the left two-thirds is a lush green meadow and a stand of leafy trees on dark earth, dense with living vegetation catching low warm light; the right third opens into a vast, dark, almost empty ocean plain stretching flat to the horizon, its surface a deep cold blue-black with only a faint sheen of light on it — visually far emptier than the crowded land. A single warm amber sun sits low on the horizon over the water, its light raking across both the meadow and the sea, the same light falling on both. Painterly, atmospheric illustration style, dark naturalistic background throughout (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Ocean Is Mostly Empty',
      markdown: "Look at a globe and it is mostly blue. Water covers about **70 per cent** of the Earth's surface. So you would expect the oceans to make most of the world's food.\n\nThey don't. The whole biosphere builds roughly **170 billion tons** (dry weight) of organic matter a year, and the oceans — with seven-tenths of the planet to work with — contribute only about **55 billion tons** of it. That is barely **a third**. The rest of it, all of it, is made on land. Same sun falling on both. Something about the sea is holding it back — worth arguing out with your teacher, because NCERT leaves that question open on purpose.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Start with the one thing an ecosystem cannot run without. **A constant input of solar energy is the basic requirement for any ecosystem to function and sustain.** Not a one-time deposit — a constant input, arriving every single day. Cut the sunlight off and there is nothing coming in at the bottom, and everything standing above it slowly starves.\n\nThat sunlight only enters the living world through one door: **photosynthesis** in plants. So if you want to know how much an ecosystem can support — how many deer, how many tigers, how many decomposers — the first number you need is how much organic matter the plants are building. Everything else in this chapter is downstream of that number.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Primary Production — An Amount, and the Units That Prove It',
      objective: 'By the end of this you can say exactly what primary production measures, and explain why productivity carries a time unit when primary production does not.',
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Primary production** is defined as the **amount of biomass or organic matter produced per unit area over a time period by plants during photosynthesis.** Read that slowly — every word is doing a job. *Biomass or organic matter*: real physical stuff, the leaves and stems and sugar the plant builds. *Per unit area*: a square metre, so a big forest and a small one can be compared fairly. *By plants during photosynthesis*: this is the plant's work, nobody else's.\n\nBecause it is an **amount**, it is expressed either in **weight — $ \\text{g m}^{-2} $ —** or in **energy — $ \\text{kcal m}^{-2} $**. Two currencies for the same thing: you can weigh what was built, or you can count the energy locked inside it.\n\nNow the second word, and students mix these two up constantly. **The rate of biomass production is called productivity.** Not the amount — the *rate*. And the moment you say rate, a **time unit** has to appear. So productivity is expressed in **$ \\text{g m}^{-2}\\,\\text{yr}^{-1} $** or **$ (\\text{kcal m}^{-2})\\,\\text{yr}^{-1} $**, and that per-year is exactly what lets you hold a grassland next to a forest next to a lake and compare their productivity honestly.\n\nHere is the plain way to hold it: primary production is the money in the box. Productivity is the salary — money *per month*. Same rupees, but one of them has time attached, and that changes what you can do with the number.",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'GPP, NPP and Secondary Productivity',
      objective: "By the end of this you can write the NPP relation from memory and say who each of the three quantities actually belongs to.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Primary productivity splits into two, and the split is the whole point of the page.\n\n**Gross primary productivity (GPP)** of an ecosystem is the **rate of production of organic matter during photosynthesis.** It is the total, the gross figure, everything the plants managed to build. Nothing has been taken out of it yet.\n\nBut the plant is alive, and staying alive costs. **A considerable amount of GPP is utilised by plants in respiration** — burnt to run the plant's own body. That expense is called **R**, the respiration loss, and it is gone. No herbivore will ever see it.\n\nWhat survives that expense is **net primary productivity (NPP)**: gross primary productivity **minus** respiration losses.\n\n$ GPP - R = NPP $\n\nAnd now the line NEET cares about most: **net primary productivity is the available biomass for the consumption to heterotrophs** — that is, to **herbivores and decomposers**. NPP is not just a smaller number than GPP. It is a *different kind* of number: it is the food that is actually on the table.\n\nOne more term completes the set. **Secondary productivity is defined as the rate of formation of new organic matter by consumers.** Notice the shift — the maker is no longer a plant. When a deer eats grass and builds deer flesh out of it, that rate of new organic matter is secondary productivity. Consumers cannot create organic matter out of sunlight; they can only rebuild what the plants already made.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'A wide arrow of gross primary productivity leaving a plant and splitting into a branch lost to respiration and a remaining branch of net primary productivity that reaches a herbivore and a decomposer',
      caption: '📸 Tap each dot to follow the split — what the plant makes, what it spends, and what is left for everyone else',
      generation_prompt: "Scientific textbook illustration of the split of gross primary productivity into respiration loss and net primary productivity. Flat 2D educational diagram on a dark background (#0a0a0a near-black), read left to right. FAR LEFT: a stylised sun with straight thin rays striking a single green leafy plant, the plant drawn in green to mark living photosynthetic tissue. FROM THE PLANT: one thick horizontal arrow leaves to the right — this is the total, drawn widest of all the arrows. Partway along, that thick arrow FORKS into exactly two branches: (1) an UPWARD branch, noticeably narrower, curving up and away off the top of the frame, drawn in a dull grey-brown to read as energy lost and leaving the system; (2) a FORWARD branch continuing right, clearly thinner than the original thick arrow but wider than the upward branch, kept green to show it is still usable organic matter. The forward green branch then splits once more into two short arrows: one reaching a pink/magenta herbivore (a simple grazing deer silhouette) and one reaching a small brown/tan cluster of fungi and an earthworm on soil at the lower right. The relative arrow widths must clearly show: original arrow = upward lost branch + forward branch. Clean white outlines, thin white leader lines, biologically accurate proportions, green = living photosynthetic plant matter and usable organic matter, grey-brown = respiratory loss, pink/magenta = animal soft tissue, brown/tan = dead matter and decomposers. No text or labels baked into the image itself. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.08, y: 0.35, label: 'Sunlight — the constant input', icon: 'circle',
          detail: "**A constant input of solar energy is the basic requirement for any ecosystem to function and sustain.** It is the only energy entering the system, and it enters only through the plant's photosynthesis." },
        { id: uuid(), x: 0.34, y: 0.5, label: 'GPP — the thick arrow', icon: 'circle',
          detail: '**Gross primary productivity** is the **rate of production of organic matter during photosynthesis** — the total, before anything is subtracted. That is why this arrow is the widest one in the diagram.' },
        { id: uuid(), x: 0.52, y: 0.16, label: 'R — respiration loss', icon: 'circle',
          detail: '**A considerable amount of GPP is utilised by plants in respiration.** This branch leaves the system and never reaches a consumer. It is the **R** that gets subtracted.' },
        { id: uuid(), x: 0.62, y: 0.55, label: 'NPP — what is left', icon: 'circle',
          detail: '**Net primary productivity = GPP – R.** Thinner than GPP, because the respiration branch has already been taken out. This is the **available biomass for the consumption to heterotrophs**.' },
        { id: uuid(), x: 0.86, y: 0.42, label: 'Herbivores and decomposers', icon: 'circle',
          detail: 'NPP is the biomass available to the **heterotrophs — herbivores and decomposers**. The rate at which these consumers then form new organic matter of their own is **secondary productivity**.' },
      ],
    },
    {
      id: uuid(), type: 'comparison_card', order: 8, title: 'GPP vs NPP vs Secondary Productivity',
      columns: [
        {
          heading: 'Gross Primary Productivity (GPP)',
          points: [
            'The rate of production of organic matter during photosynthesis.',
            'Made by plants (producers).',
            'The total — nothing subtracted from it yet.',
            'Respiration loss (R) is still sitting inside this figure.',
            'Not the food available to consumers.',
            'Largest of the three figures for the same ecosystem.',
          ],
        },
        {
          heading: 'Net Primary Productivity (NPP)',
          points: [
            'Gross primary productivity minus respiration losses: $ NPP = GPP - R $.',
            'Made by plants (producers).',
            'What survives after the plant has spent on itself.',
            'Respiration loss (R) has already been removed.',
            'This IS the available biomass for consumption by heterotrophs — herbivores and decomposers.',
            'Always smaller than GPP for the same ecosystem.',
          ],
        },
        {
          heading: 'Secondary Productivity',
          points: [
            'The rate of formation of new organic matter by consumers.',
            'Made by consumers (heterotrophs), not by plants.',
            'Builds on organic matter the plants already made.',
            'Respiration loss is not what defines it — the maker is.',
            'Comes after NPP in the chain, not before it.',
            'Concerns animal biomass, not the photosynthetic total.',
          ],
        },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A forest and a nearby plantation record exactly the same gross primary productivity for the year. But the forest's trees respire far more heavily than the plantation's. If a herbivore had to pick the patch that offers it more food, which patch and why?",
      options: [
        'The forest, because a higher respiration rate means the plants are more active and so build more food for herbivores',
        'The plantation, because with equal GPP and a smaller R, its NPP is larger — and NPP is the biomass available to heterotrophs',
        'Neither — equal GPP means equal food for herbivores, since GPP is what the consumers feed on',
        'The forest, because secondary productivity is what herbivores eat, and it is always higher where GPP is high',
      ],
      correct_index: 1,
      reveal: "Equal GPP is a decoy. What a herbivore can actually eat is **NPP**, and $ NPP = GPP - R $ — so with GPP held equal, the patch with the **smaller respiration loss** keeps more, and the plantation's NPP is the larger one. NCERT is explicit: **net** primary productivity, not gross, is the available biomass for consumption by heterotrophs. The tempting wrong answer is the third one — it assumes GPP is the food on the table, but a considerable amount of GPP is burnt by the plants in respiration and never reaches any consumer at all. (And secondary productivity is not a herbivore's food supply — it is the rate at which the consumers themselves form new organic matter.)",
      difficulty_level: 3,
    },
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "One last piece: productivity is not a fixed property of the planet. **Primary productivity depends on the plant species inhabiting a particular area.** It also depends on **a variety of environmental factors**, on the **availability of nutrients**, and on the **photosynthetic capacity of plants**. Change any of those and the number moves — which is exactly why **it varies in different types of ecosystems**.\n\nAdd it all up and the whole biosphere has an **annual net primary productivity of approximately 170 billion tons (dry weight)** of organic matter. Of that, **despite occupying about 70 per cent of the surface, the productivity of the oceans is only 55 billion tons.** The rest, of course, is on land.\n\nSo the plants have built the year's organic matter, and the herbivores have taken their share. But nothing eats all of it — leaves fall, bark peels, animals die. What happens to everything that is *not* eaten is the next page: **decomposition**.",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember', title: 'Lock These In',
      markdown: "- **$ GPP - R = NPP $**. Learn it in that direction, and learn what R is: **respiration losses of the plants**.\n- **NPP — not GPP — is the available biomass for the consumption to heterotrophs (herbivores and decomposers).**\n- **Primary production = an amount** → $ \\text{g m}^{-2} $ or $ \\text{kcal m}^{-2} $. **Productivity = a rate** → $ \\text{g m}^{-2}\\,\\text{yr}^{-1} $ or $ (\\text{kcal m}^{-2})\\,\\text{yr}^{-1} $. The **yr⁻¹** is the giveaway.\n- **Secondary productivity = the rate of formation of new organic matter by consumers.** The maker is a consumer, not a plant.\n- The numbers: whole biosphere annual **NPP ≈ 170 billion tons** (dry weight). Oceans = **55 billion tons**, from about **70 per cent** of the surface.\n- Primary productivity depends on: **plant species**, **environmental factors**, **nutrient availability**, **photosynthetic capacity of plants**.",
    },
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**GPP vs NPP:** the single most swapped pair in this chapter. GPP = the rate of production of organic matter during photosynthesis (the total). NPP = GPP – R (what is left). Any option that hands **GPP** to the herbivores is the trap — it is **NPP** that heterotrophs consume.\n\n**Amount vs rate:** if a question gives units, read them. $ \\text{g m}^{-2} $ with no time = primary **production**. $ \\text{g m}^{-2}\\,\\text{yr}^{-1} $ = **productivity**. Papers test this by quietly changing one unit.\n\n**The 170 / 55 figures:** annual NPP of the whole biosphere ≈ **170 billion tons** dry weight; oceans **55 billion tons** despite **70 per cent** of the surface. Distractors flip these — 70 billion, 55 per cent, or oceans given the larger share.\n\n**Secondary productivity:** made by **consumers**, and it is a **rate**. An option defining it as the productivity of secondary consumers only, or of plants at a second stage, is wrong.\n\n**Classic NEET question:** \"Net primary productivity is the biomass available for consumption to which group?\" → **Heterotrophs — herbivores and decomposers.**",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which quantity represents the biomass actually available for consumption by heterotrophs?',
          options: [
            'Gross primary productivity, since it is the total organic matter produced by photosynthesis',
            'Secondary productivity, since it is the organic matter formed at the consumer level',
            'Net primary productivity, since it is what remains after the plants’ respiration losses',
            'Primary production, since it is the amount of biomass produced per unit area',
          ],
          correct_index: 2,
          explanation: "NCERT states that net primary productivity is the available biomass for the consumption to heterotrophs, because GPP has already had the respiration losses (R) taken out of it. The tempting pick is gross primary productivity — but a considerable amount of GPP is utilised by the plants themselves in respiration, so that portion never reaches any consumer.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'An ecologist reports a value in units of g m⁻² yr⁻¹. Which quantity is being reported?',
          options: [
            'Productivity, because the time unit shows it is a rate of biomass production',
            'Primary production, because it is the amount of biomass produced per unit area',
            'Standing biomass, because weight per unit area describes the matter present',
            'Respiration loss, because only the loss term carries a per-year unit',
          ],
          correct_index: 0,
          explanation: "The rate of biomass production is called productivity, and being a rate it carries a time unit — g m⁻² yr⁻¹ or (kcal m⁻²) yr⁻¹. Primary production is the tempting wrong pick, but it is an amount, not a rate, so it is expressed as g m⁻² or kcal m⁻² with no per-year attached.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'The annual net primary productivity of the whole biosphere is about 170 billion tons of dry organic matter. What is the contribution of the oceans, and what share of the Earth’s surface do they occupy?',
          options: [
            '115 billion tons from about 70 per cent of the surface',
            '170 billion tons from about 55 per cent of the surface',
            '55 billion tons from about 30 per cent of the surface',
            '55 billion tons from about 70 per cent of the surface',
          ],
          correct_index: 3,
          explanation: "NCERT gives the oceans 55 billion tons despite their occupying about 70 per cent of the surface, with the rest of the 170 billion tons produced on land. The trap here is swapping the two numbers around — 55 is the tonnage, not the percentage, and 70 is the percentage of surface, not the tonnage.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Secondary productivity is best defined as which of the following?',
          options: [
            'The rate of production of organic matter by plants during photosynthesis',
            'The rate of formation of new organic matter by consumers',
            'Gross primary productivity remaining after the respiration losses of plants',
            'The amount of biomass produced per unit area by secondary consumers',
          ],
          correct_index: 1,
          explanation: "Secondary productivity is the rate of formation of new organic matter by consumers — the maker is a heterotroph, and it is a rate. The most tempting distractor is the last one, which sounds close but wrongly narrows it to secondary consumers and wrongly calls it an amount rather than a rate; consumers of every level, not just the secondary ones, contribute.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
