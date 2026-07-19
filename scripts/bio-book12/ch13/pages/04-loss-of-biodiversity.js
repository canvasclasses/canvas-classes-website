'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'loss-of-biodiversity-the-evil-quartet',
  title: 'Losing It — the Evil Quartet',
  subtitle: 'Extinction is not new — five mass extinctions happened before we ever arrived. What is new is the speed, and the fact that four human habits are driving it.',
  page_number: 4,
  page_type: 'lesson',
  tags: ['biodiversity', 'extinction', 'evil-quartet', 'habitat-loss', 'alien-species', 'conservation'],
  glossary: [
    { term: 'extinction', definition: 'The complete disappearance of a species from the earth. It has happened five times on a mass scale before humans appeared; the episode now in progress is called the Sixth Extinction.' },
    { term: 'IUCN Red List', definition: 'The international record of species that have gone extinct and species facing the threat of extinction. The 2004 Red List documents 784 extinctions in the last 500 years.' },
    { term: 'habitat fragmentation', definition: 'The breaking up of large habitats into small fragments due to human activities. Mammals and birds requiring large territories, and certain animals with migratory habits, are badly affected, leading to population declines.' },
    { term: 'over-exploitation', definition: 'The excessive use of natural resources that follows when human "need" turns to "greed". It caused extinctions such as Steller\'s sea cow and the passenger pigeon, and today has many marine fish populations over harvested.' },
    { term: 'alien species invasion', definition: 'The introduction of a species — unintentionally or deliberately — into a region it does not belong to. Some of these turn invasive and cause decline or extinction of indigenous species.' },
    { term: 'co-extinction', definition: 'When a species becomes extinct, the plant and animal species associated with it in an obligatory way also become extinct — for example, the unique assemblage of parasites of an extinct host fish.' },
    { term: 'Evil Quartet', definition: 'The sobriquet used for the four major causes of biodiversity loss: habitat loss and fragmentation, over-exploitation, alien species invasions, and co-extinctions.' },
    { term: 'endemic', definition: 'A species confined to one region and found nowhere else. Endemic species are especially vulnerable to habitat loss, because there is nowhere else for them to survive.' },
  ],
  blocks: [
    // ── hero ─────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A rainforest edge at dusk where dense canopy is cut off in a hard straight line against bare cleared ground',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A tropical rainforest at dusk seen from a low vantage, but the forest ends abruptly along a hard, unnaturally straight edge running through the frame: on the left, dense living canopy layered into warm mist, faint bird and insect silhouettes moving in it, vines and epiphytes crowding the trunks. On the right of that straight edge, bare open cleared ground stretching to the horizon — flat, empty, stumps and churned red earth, a thin haze of smoke drifting low, not a single animal silhouette. The straight boundary between the two is the subject of the picture. One low warm horizon glow runs across the whole frame so both halves read as the same continuous place. Painterly atmospheric illustration, naturalistic, deep dark tones throughout (#0a0a0a base), muted earthy palette of dark greens, browns and dull red earth. No people, no machinery, no text, no labels, no diagram elements, no arrows.",
    },
    // ── fun_fact ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'One Fish Erased 200 Species',
      markdown: "**Lake Victoria** in east Africa held something no other lake on earth had — an **ecologically unique assemblage of more than 200 species of cichlid fish**, evolved in that one lake and found nowhere else.\n\nThen the **Nile perch** was introduced into it. The perch is a big predator; the cichlids had never met anything like it. The introduction eventually led to the **extinction of all of that assemblage** — more than two hundred species gone, from one decision about one fish.\n\nNobody set out to destroy Lake Victoria. That is the point worth carrying into this page. Every one of the four causes you are about to read looks reasonable from close up: clear some forest, catch some fish, stock a useful species. The damage only shows at the scale of the whole system.",
    },
    // ── core concept: the scale of the loss ──────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Start with the honest position NCERT takes: **it is doubtful if any new species are being added (through speciation) into the earth's treasury of species, but there is no doubt about their continuing losses.** The biological wealth of our planet has been declining rapidly, and **the accusing finger is clearly pointing to human activities**.\n\nThe record is not vague. The **colonisation of tropical Pacific Islands by humans** is said to have led to the extinction of **more than 2,000 species of native birds**. The **IUCN Red List (2004)** documents the extinction of **784 species in the last 500 years** — and that figure splits into **338 vertebrates, 359 invertebrates and 87 plants**. Learn the split, not just the total; NEET has asked for the parts.\n\nThe famous names sit inside that 784: the **dodo (Mauritius)**, the **quagga (Africa)**, the **thylacine (Australia)**, **Steller's Sea Cow (Russia)**, and **three subspecies of tiger — Bali, Javan and Caspian**. The **last twenty years alone have witnessed the disappearance of 27 species**. And extinctions **across taxa are not random** — some groups, like **amphibians**, appear to be **more vulnerable** to extinction.",
    },
    // ── heading: the rate ────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Sixth Extinction — Same Event, Different Speed',
      objective: 'By the end of this you can say exactly what makes the current extinction episode different from the five before it, and quote the four percentages of groups now threatened.',
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Fossil records tell us that large-scale loss of species like the one we are currently witnessing **has happened earlier, even before humans appeared on the scene**. During the long period — **more than 3 billion years** — since the origin and diversification of life on earth, there were **five episodes of mass extinction**.\n\nSo a fair question: how is the **'Sixth Extinction'** presently in progress different from the previous five? **The difference is in the rates.** The **current species extinction rates are estimated to be 100 to 1,000 times faster than in pre-human times**, and **our activities are responsible for the faster rates**. Hold that sentence exactly — the difference is not the scale, not the cause of death, not the groups affected. It is the **speed**. Ecologists warn that if the present trends continue, **nearly half of all the species on earth might be wiped out within the next 100 years**.\n\nAnd the queue is already forming. **More than 15,500 species world-wide are facing the threat of extinction.** Broken down by group, presently facing that threat:\n\n- **12 per cent** of all **bird** species\n- **23 per cent** of all **mammal** species\n- **32 per cent** of all **amphibian** species\n- **31 per cent** of all **gymnosperm** species\n\nAmphibians top that list, which fits the earlier line that extinctions are not random and amphibians are more vulnerable.\n\nWhy does any of this matter beyond the sadness of it? Because **loss of biodiversity in a region may lead to (a) decline in plant production, (b) lowered resistance to environmental perturbations such as drought, and (c) increased variability in certain ecosystem processes such as plant productivity, water use, and pest and disease cycles.** A thinner ecosystem produces less, breaks more easily, and swings more wildly.",
    },
    // ── heading: the Evil Quartet ────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'The Evil Quartet — the Four Causes',
      objective: 'By the end of this you can name the four causes in order, say which is the most important, and match every NCERT example to its cause without hesitating.',
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "The accelerated rates of species extinctions the world faces now are **largely due to human activities**. There are **four major causes**, and ecologists gave them a nickname that has stuck: **'The Evil Quartet'**. Four — not three, not five. Take them in order.\n\n**(i) Habitat loss and fragmentation.** **This is the most important cause driving animals and plants to extinction.** If you remember one ranking from this page, remember that one. The most dramatic examples come from **tropical rain forests** — once covering **more than 14 per cent** of the earth's land surface, they now cover **no more than 6 per cent**, and they are being destroyed fast. **By the time you finish reading this chapter, 1000 more hectares of rain forest would have been lost.** The **Amazon rain forest** — so huge it is called the **'lungs of the planet'**, harbouring probably millions of species — is being **cut and cleared for cultivating soya beans, or for conversion to grasslands for raising beef cattle**.\n\nBut habitat loss is not only about total loss. **Degradation of many habitats by pollution** also threatens survival. And there is the second half of the name: when **large habitats are broken up into small fragments** due to human activities, **mammals and birds requiring large territories, and certain animals with migratory habits, are badly affected, leading to population declines**. Picture it — the forest is still there, just chopped into islands. A tiger needs a territory bigger than any one island. A migratory bird needs the whole route, not three surviving patches of it. The habitat was not destroyed; it was cut into pieces too small to live in. That distinction is exactly what NEET tests.\n\n**(ii) Over-exploitation.** Humans have always depended on nature for food and shelter, but **when 'need' turns to 'greed', it leads to over-exploitation of natural resources**. **Many species extinctions in the last 500 years — Steller's sea cow, passenger pigeon — were due to over-exploitation by humans.** Presently, **many marine fish populations around the world are over harvested, endangering the continued existence of some commercially important species.**\n\n**(iii) Alien species invasions.** When **alien species are introduced unintentionally or deliberately for whatever purpose, some of them turn invasive, and cause decline or extinction of indigenous species.** Note both words — *unintentionally or deliberately*. Intent doesn't decide the outcome. The **Nile perch introduced into Lake Victoria** in east Africa led eventually to the **extinction of an ecologically unique assemblage of more than 200 species of cichlid fish** in the lake. Closer to home, invasive **weed species like carrot grass (*Parthenium*), *Lantana* and water hyacinth (*Eicchornia*)** cause environmental damage and threaten our native species. And the recent **illegal introduction of the African catfish *Clarias gariepinus* for aquaculture purposes is posing a threat to the indigenous catfishes in our rivers.**\n\n**(iv) Co-extinctions.** **When a species becomes extinct, the plant and animal species associated with it in an obligatory way also become extinct.** The word doing the work is **obligatory** — the second species had no other option, no alternative host, no alternative partner. Two NCERT examples: **when a host fish species becomes extinct, its unique assemblage of parasites also meets the same fate**; and **a coevolved plant-pollinator mutualism, where extinction of one invariably leads to the extinction of the other.**",
    },
    // ── table: the quartet at a glance ───────────────────────────────────
    {
      id: uuid(), type: 'table', order: 7,
      caption: 'The Evil Quartet — cause, what it means, and the NCERT example attached to each',
      headers: ['Cause', 'What it means', 'NCERT examples'],
      rows: [
        [
          '(i) Habitat loss and fragmentation — **the most important cause**',
          'Habitats are destroyed outright, degraded by pollution, or broken into small fragments. Fragmentation badly affects mammals and birds requiring large territories and animals with migratory habits, leading to population declines.',
          'Tropical rain forests down from more than 14% to no more than 6% of land surface; 1000 hectares lost while you read the chapter; the Amazon (the "lungs of the planet") cut and cleared for soya beans and for grasslands for beef cattle.',
        ],
        [
          '(ii) Over-exploitation',
          "Humans always depended on nature for food and shelter, but when 'need' turns to 'greed', natural resources are over-used.",
          "Steller's sea cow and the passenger pigeon, both driven extinct in the last 500 years; marine fish populations around the world presently over harvested, endangering commercially important species.",
        ],
        [
          '(iii) Alien species invasions',
          'Species introduced unintentionally or deliberately turn invasive and cause decline or extinction of indigenous species.',
          'Nile perch in Lake Victoria → extinction of more than 200 species of cichlid fish; carrot grass (*Parthenium*), *Lantana*, water hyacinth (*Eicchornia*); African catfish *Clarias gariepinus* introduced illegally for aquaculture, threatening indigenous catfishes.',
        ],
        [
          '(iv) Co-extinctions',
          'When a species goes extinct, species associated with it in an **obligatory** way go with it.',
          'A host fish going extinct takes its unique assemblage of parasites with it; in a coevolved plant-pollinator mutualism, extinction of one invariably leads to extinction of the other.',
        ],
      ],
    },
    // ── reasoning check ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "A forest is not cleared, but a highway and farms cut it into several small isolated patches. Total forest area falls only slightly, yet within a few years the local tiger population and a migratory bird that used to pass through both crash. Which member of the Evil Quartet is at work here?",
      options: [
        'Over-exploitation, because the tigers and the birds are being directly harvested by humans',
        'Alien species invasions, because the farms have introduced crop species into the tiger habitat',
        'Habitat loss and fragmentation, because large habitats broken into small fragments badly affect animals requiring large territories and animals with migratory habits',
        'Co-extinctions, because the tiger and the migratory bird are associated with each other in an obligatory way',
      ],
      correct_index: 2,
      reveal: "This is the **fragmentation** half of the first and most important cause. NCERT says it plainly: **when large habitats are broken up into small fragments due to various human activities, mammals and birds requiring large territories and certain animals with migratory habits are badly affected, leading to population declines.** The tiger needs a large territory and the bird needs an intact migratory route — neither survives a habitat served in slices, even though almost all the forest is technically still standing. **Over-exploitation** is the tempting pick because a crashing tiger population sounds like hunting — but over-exploitation means humans directly over-using the resource ('need' turning to 'greed'), like Steller's sea cow or over harvested marine fish, and nobody in this scenario is harvesting anything. **Co-extinction** is wrong on the definition: it needs an **obligatory** association, like a host fish and its unique parasites, not two large animals that happen to share a forest.",
      difficulty_level: 3,
    },
    // ── remember ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: 'The Four Causes, the Ranking, and the Numbers',
      markdown: "- **The Evil Quartet, in NCERT's order: (i) Habitat loss and fragmentation → (ii) Over-exploitation → (iii) Alien species invasions → (iv) Co-extinctions.** A line to hold the order: **H**umans **O**ften **A**ct **C**arelessly.\n- **Habitat loss and fragmentation is the MOST IMPORTANT cause.** This ranking is asked directly.\n- **Fragmentation hits two kinds of animals:** those **requiring large territories** (mammals and birds) and those with **migratory habits**.\n- **Co-extinction needs the word *obligatory*.** Host fish → its unique assemblage of parasites. Coevolved plant–pollinator mutualism → one goes, the other invariably follows.\n- **Sixth Extinction: the difference from the previous five is the RATE — 100 to 1,000 times faster than pre-human times.** There were **five** earlier episodes of mass extinction over **>3 billion years**.\n- **IUCN Red List (2004): 784 species extinct in the last 500 years = 338 vertebrates + 359 invertebrates + 87 plants.** The **last 20 years alone: 27 species**. Pacific Islands colonisation: **more than 2,000 species of native birds**.\n- **More than 15,500 species** worldwide currently face the threat of extinction. Percentages threatened: **birds 12%, mammals 23%, amphibians 32%, gymnosperms 31%.** Amphibians are highest, and they are also the group NCERT names as **more vulnerable**.\n- **Rain forests: once more than 14% of land surface → now no more than 6%.** Amazon = **'lungs of the planet'**, cleared for **soya beans** and **beef cattle** grasslands.",
    },
    // ── exam_tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**The Evil Quartet is the single most reliable question on this chapter.** It arrives in two shapes: name the four causes, or match a scenario/example to its cause. Learn the examples *attached to* each cause, not the causes alone — that is where marks are lost.\n\n**Habitat loss and fragmentation:** the phrase **'most important cause'** is lifted verbatim. If an option set asks which cause is most important, this is it, every time.\n\n**The 784 split:** **338 vertebrates, 359 invertebrates, 87 plants.** Notice invertebrates > vertebrates — students reverse these two out of habit.\n\n**The percentages:** **birds 12, mammals 23, amphibians 32, gymnosperms 31.** The classic trap is swapping the amphibian (32%) and gymnosperm (31%) figures, since they sit one apart. Anchor it: amphibians are the most threatened group *and* the group NCERT calls more vulnerable to extinction — the two facts back each other up.\n\n**The Sixth Extinction:** the difference from the earlier five is the **rate — 100 to 1,000 times faster**. Distractors will offer '10 to 100 times' or '1,000 to 10,000 times'.\n\n**Names to place correctly:** dodo → **Mauritius**; quagga → **Africa**; thylacine → **Australia**; Steller's sea cow → **Russia**; three tiger subspecies → **Bali, Javan, Caspian**. Steller's sea cow appears **twice** — as a recent extinction *and* as an example of **over-exploitation**, alongside the **passenger pigeon**.\n\n**Alien species names:** **Nile perch → Lake Victoria → 200+ cichlid species**; **carrot grass = *Parthenium***; **water hyacinth = *Eicchornia***; ***Lantana***; **African catfish = *Clarias gariepinus***, introduced **illegally for aquaculture**, threatening **indigenous catfishes**.\n\n**Classic NEET question:** \"The introduction of the Nile perch into Lake Victoria led to the extinction of more than 200 species of cichlid fish. This is an example of which cause of biodiversity loss?\" → **Alien species invasions** (not co-extinction — the cichlids had no obligatory association with the perch; the perch was simply an introduced species that turned invasive).",
    },
    // ── inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: "Which of the following is described by NCERT as the most important cause driving animals and plants to extinction?",
          options: [
            'Over-exploitation of natural resources',
            'Habitat loss and fragmentation',
            'Alien species invasions',
            'Co-extinctions',
          ],
          correct_index: 1,
          explanation: "NCERT names habitat loss and fragmentation as the most important cause, and gives tropical rain forests as the most dramatic example — down from more than 14% of the earth's land surface to no more than 6%. Over-exploitation is the usual second guess because it has famous casualties (Steller's sea cow, the passenger pigeon), but it is not the cause ranked most important.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: "The illegal introduction of the African catfish Clarias gariepinus for aquaculture, now threatening indigenous catfishes in our rivers, belongs to which member of the Evil Quartet?",
          options: [
            'Co-extinctions',
            'Habitat loss and fragmentation',
            'Over-exploitation',
            'Alien species invasions',
          ],
          correct_index: 3,
          explanation: "Clarias gariepinus is an alien species introduced deliberately for aquaculture that turned invasive and now threatens indigenous species — the exact definition of alien species invasions. Over-exploitation tempts because the fish was brought in for a commercial purpose, but over-exploitation means over-using a natural resource until it collapses, as with over harvested marine fish populations, not stocking a foreign species.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: "According to the IUCN Red List (2004), 784 species have gone extinct in the last 500 years. How does this figure break up?",
          options: [
            '338 vertebrates, 359 invertebrates and 87 plants',
            '359 vertebrates, 338 invertebrates and 87 plants',
            '87 vertebrates, 338 invertebrates and 359 plants',
            '338 vertebrates, 87 invertebrates and 359 plants',
          ],
          correct_index: 0,
          explanation: "NCERT gives the split as 338 vertebrates, 359 invertebrates and 87 plants. The second option is the trap that catches most students — it swaps the vertebrate and invertebrate figures, because people assume vertebrates must be the larger number when in fact invertebrates are.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: "A host fish species becomes extinct, and its unique assemblage of parasites disappears with it. Along with which other situation is this classified under the same cause?",
          options: [
            'The over harvesting of marine fish populations, endangering commercially important species',
            'The breaking of a large forest into fragments too small for animals with migratory habits',
            'A coevolved plant-pollinator mutualism, where extinction of one invariably leads to extinction of the other',
            'The spread of water hyacinth (Eicchornia) and Lantana, which threaten native species',
          ],
          correct_index: 2,
          explanation: "Both the host fish with its parasites and the coevolved plant-pollinator mutualism are NCERT's two examples of co-extinction — species associated in an obligatory way, so one cannot survive the other's loss. The fragmentation option is the tempting one because it also describes a species dying out as a knock-on effect, but there the animals are lost to a shrunken habitat, not to the extinction of a partner species they obligatorily depend on.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
