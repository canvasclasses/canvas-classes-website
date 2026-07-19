'use strict';
/**
 * Class 12 Biology — Chapter 11: Organisms and Populations
 * Page 1 — What a Population Is, and Its Attributes.
 *
 * Source of truth: NCERT Class 12 Ch.11 (lebo111.txt), §11.1 "Populations" +
 * §11.1.1 "Population Attributes" — the paragraphs from "In nature, we rarely
 * find isolated, single individuals..." up to (but not including) §11.1.2
 * "Population Growth", plus the age-pyramid figure (age pyramids for human
 * population: growing / stable / declining).
 *
 * Rule 0: every fact, number and example here traces to that text — the lotus
 * birth-rate worked number (8/20 = 0.4), the fruitfly death rate (4/40 = 0.1),
 * the 60% female / 40% male sex-ratio example, the banyan vs carrot grass
 * per-cent-cover case, fish caught per trap as relative density, and the tiger
 * census by pug marks and fecal pellets. Population growth models (exponential,
 * logistic, r, K) are deliberately left for the next page.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'population-attributes',
  title: 'What a Population Is — and Its Attributes',
  subtitle: "An individual is born or dies. A population has a birth rate, a death rate, a sex ratio and an age structure — properties no single organism can ever have. Here's what each one means, and how a shape drawn on paper tells you whether a population is growing.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['ecology', 'population', 'population-attributes', 'age-pyramid', 'population-density', 'organisms-and-populations'],
  glossary: [
    { term: 'population', definition: 'A group of individuals of a species living in a well defined geographical area, sharing or competing for similar resources, and potentially interbreeding. Groups formed by asexual reproduction are also treated as populations in ecological studies.' },
    { term: 'natality (birth rate)', definition: 'The rate at which new individuals are added to a population by reproduction. It is a per capita rate — the number of births measured against the members of the population.' },
    { term: 'mortality (death rate)', definition: 'The rate at which individuals are lost from a population by death, again expressed per capita — deaths measured against the members of the population.' },
    { term: 'sex ratio', definition: 'The proportion of males to females in a population, for example 60 per cent females and 40 per cent males. An individual is only male or female; the ratio belongs to the population.' },
    { term: 'age distribution', definition: 'The percentage of individuals of a given age or age group in a population at a given time. Plotting it produces an age pyramid.' },
    { term: 'age pyramid', definition: 'The structure obtained when the age distribution of a population is plotted. For human populations it shows males and females in one diagram, and its shape reflects whether the population is growing, stable or declining.' },
    { term: 'population density (N)', definition: 'The size of a population. It need not always be a count of individuals — per cent cover, biomass, or a relative measure can be used instead.' },
  ],
  blocks: [
    {
      id: '7c1a4e92-3b56-4d08-9f27-1a5e8c63d940',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A dense flock of cormorants gathered across a dark wetland at dusk',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A large flock of cormorants gathered across a shallow wetland at dusk — dozens of dark birds standing and wading in still water, some with wings half-spread, receding into soft mist at the horizon. Low warm light rakes across the water surface leaving thin reflections. Deep dusk lighting, painterly and atmospheric, dark overall tones (#0a0a0a base), naturalistic, shallow depth of field on the nearest birds, a sense of many individuals forming one group. No text, no labels, no diagram elements.",
    },
    {
      id: '8d2b5f03-4c67-4e19-8a38-2b6f9d74ea51',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'Counting Tigers Without Seeing a Single Tiger',
      markdown: "How many tigers live in a national park? You cannot line them up and count them — a tiger is secretive, and the forest is large. So the **tiger census** in our national parks and tiger reserves is often based on something the tiger leaves behind: its **pug marks** (footprints) and its **fecal pellets**. Nobody sees the animal. The number still gets estimated.\n\nThat is not a shortcut, it is standard practice. For most populations in nature, we are **obliged to estimate population sizes indirectly**, without actually counting or seeing the individuals. Keep that in mind for the rest of this page — a population's numbers are something we measure cleverly, not something we simply read off.",
    },
    {
      id: '9e3c6a14-5d78-4f2a-9b49-3c7a0e85fb62',
      type: 'text',
      order: 2,
      markdown: "**Ecology** studies the interactions among organisms, and between an organism and its physical (abiotic) environment. It works at four levels of biological organisation — **organisms, populations, communities and biomes**. This chapter takes up the population level.\n\nSo what exactly is a population? In nature we rarely find isolated, single individuals of a species. The majority of them live in **groups in a well defined geographical area**, where they **share or compete for similar resources** and can **potentially interbreed**. A group like that is a **population**. The word *interbreeding* implies sexual reproduction, but for ecological studies a group of individuals produced even by **asexual reproduction** is generally counted as a population too.\n\nExamples make it concrete: all the **cormorants in a wetland**, the **rats in an abandoned dwelling**, the **teakwood trees in a forest tract**, the **bacteria in a culture plate**, the **lotus plants in a pond**. Each is a population.\n\nWhy bother with this level at all? Because of a point you have already met — an **individual** organism is the one that has to cope with a changed environment, but it is at the **population level that natural selection operates** to evolve the desired traits. That is why **population ecology** matters: it is the link between ecology, population genetics and evolution.",
    },
    {
      id: '0f4d7b25-6e89-403b-8c50-4d8b1f96ac73',
      type: 'heading',
      order: 3,
      level: 2,
      text: 'The Attributes an Individual Can Never Have',
      objective: "By the end of this you can name the attributes that belong to a population but not to an individual, and explain what 'per capita' does to a birth or death rate.",
    },
    {
      id: '1a5e8c36-7f9a-414c-9d61-5e9c2a07bd84',
      type: 'text',
      order: 4,
      markdown: "Here is the idea that runs through this whole page: **a population has certain attributes whereas an individual organism does not.**\n\nAn individual may have **births and deaths**. But a population has **birth rates and death rates** — and in a population these rates are **per capita** births and deaths. That phrase is doing real work. It means the rate is expressed as the **change in numbers (increase or decrease) with respect to the members of the population**, not as a bare count.\n\nWork through NCERT's two numbers slowly, because this is exactly how it gets asked.\n\n**Birth rate (natality).** A pond had **20 lotus plants** last year. Through reproduction, **8 new plants** are added, taking the current population to 28. The birth rate is not 8. It is **8/20 = 0.4 offspring per lotus per year**. You divide the new additions by the population that produced them.\n\n**Death rate (mortality).** A laboratory population of **40 fruitflies** loses **4 individuals** in a specified time interval, say a week. The death rate is not 4. It is **4/40 = 0.1 individuals per fruitfly per week**. Same move — divide by the population, and attach the time period.\n\nNotice what the division buys you. A count of 8 births tells you nothing on its own; 8 births in a population of 20 is a very different situation from 8 births in a population of 2000. The per capita rate makes populations of different sizes comparable.\n\nAnother attribute characteristic of a population is its **sex ratio**. An **individual is either a male or a female** — that is all an individual can be. A **population has a sex ratio**: for example, 60 per cent of the population are females and 40 per cent males. No single organism can be 60 per cent female. The property only exists once you have a group.\n\nAnd a population at any given time is composed of **individuals of different ages**. The **age distribution** — the per cent of individuals of a given age or age group — is a population attribute too. Plot it, and it turns into a picture.",
    },
    {
      id: '2b6f9d47-809b-425d-8e72-6f0d3b18ce95',
      type: 'heading',
      order: 5,
      level: 2,
      text: 'Age Pyramids — Reading a Population\'s Future From Its Shape',
      objective: "By the end of this you can look at any of the three age-pyramid shapes and say whether that population is growing, stable or declining, and why.",
    },
    {
      id: '3c7a0e58-91ac-436e-9f83-7a1e4c29df06',
      type: 'text',
      order: 6,
      markdown: "If the **age distribution** of a population is plotted, the resulting structure is called an **age pyramid**. For a **human population**, age pyramids generally show the age distribution of **males and females** in one diagram — males stacked on one side of a central axis, females on the other, with the youngest age groups at the bottom and the oldest at the top.\n\nThe useful part is the **shape**. The shape of the pyramid **reflects the growth status of the population** — whether it is **(a) growing, (b) stable, or (c) declining**. Three shapes, three futures.\n\nThink about why the base decides everything. The individuals at the bottom of the pyramid are the young ones who have not yet reproduced; they are the population's reproductive future. A **broad base** means a large crowd of young individuals is about to move up into the reproductive ages — so the population is set to **grow**. A base that is **as wide as the middle** means each generation is roughly replacing itself — **stable**. A base that is **narrower than the middle** means fewer young individuals are coming up than there are adults now — that population is on its way **down**.",
    },
    {
      id: '4d8b1f69-a2bd-4470-8a94-8b2f5d3ae017',
      type: 'interactive_image',
      order: 7,
      src: '',
      alt: 'Three age pyramids for human populations side by side — expanding with a broad base, stable with straight sides, and declining with a narrow base',
      caption: '📸 Tap each dot to explore the three age-pyramid shapes and what each band of the pyramid means',
      generation_prompt: "Scientific textbook illustration of three human age pyramids shown side by side, matching NCERT Class 12 Biology Chapter 11 'Representation of age pyramids for human population'. Flat 2D educational diagram on a dark background (#0a0a0a near-black), clean white outlines, thin white leader lines, labels in white text. Each of the three pyramids is a horizontal bar chart mirrored about a central vertical axis: stacked horizontal bars, males on the left half and females on the right half, youngest age group at the bottom and oldest at the top, drawn with clean white outlines. Left pyramid (a): a broad triangle — a very wide bottom bar tapering steeply and evenly to a narrow point at the top (expanding population). Middle pyramid (b): near-vertical straight sides — the bottom and middle bars are of similar width, tapering only near the top (stable population). Right pyramid (c): a narrow bottom — the lowest bars are clearly narrower than the bars above them, so the shape bulges in the middle and pinches at the base (declining population). Below each pyramid a small caption band reading (a), (b), (c). On each pyramid the three age bands are indicated as faint horizontal divisions: a lower pre-reproductive band, a middle reproductive band, and an upper post-reproductive band, tinted with restrained functional colour — muted blue for the male half and muted pink/magenta for the female half, identical tints across all three pyramids. A small horizontal axis line under each pyramid suggests per cent of individuals. No photorealism, no cartoon, no mascots, no 3D effects, no drop shadows, standard biology textbook illustration conventions.",
      hotspots: [
        { id: '5e9c2a70-b3ce-4581-9ba5-9c306e4bf128', x: 0.17, y: 0.78, label: 'Pre-reproductive band (the base)', detail: 'The lowest band holds the **youngest age groups** — individuals who have not yet reproduced. This is the part of the **age distribution** that decides where the population is heading, because these individuals will move up into the reproductive ages next.', icon: 'circle' },
        { id: '6f0d3b81-c4df-4692-8cb6-0d417f5ca239', x: 0.17, y: 0.5, label: 'Reproductive band (the middle)', detail: 'The middle band holds the individuals currently in the **reproductive age groups** — the ones producing the **per capita births**. Compare the width of the base against this band and you have the whole diagnosis.', icon: 'circle' },
        { id: '7a1e4c92-d5e0-47a3-9dc7-1e52806db34a', x: 0.17, y: 0.2, label: 'Post-reproductive band (the top)', detail: 'The topmost band holds the **oldest age groups**, past reproduction. It is always the narrowest part of a human age pyramid, so the top alone never tells you the growth status — the **base** does.', icon: 'circle' },
        { id: '8b2f5d03-e6f1-48b4-9ed8-2f639017ec5b', x: 0.17, y: 0.93, label: '(a) Expanding — a broad base', detail: 'A wide bottom tapering to a narrow top. A large crowd of **pre-reproductive individuals** is waiting to move up into the reproductive ages, so this population is **growing**.', icon: 'circle' },
        { id: '9c306e14-f702-49c5-8fe9-306a1128fd6c', x: 0.5, y: 0.93, label: '(b) Stable — base and middle alike', detail: 'The sides run almost straight, because the base is about as wide as the reproductive middle. Each age group is roughly replaced by the one below it, so the population is **stable**.', icon: 'circle' },
        { id: '0d417f25-0813-40d6-9a0a-417b2239ae7d', x: 0.83, y: 0.93, label: '(c) Declining — a pinched base', detail: 'The bottom is **narrower** than the band above it, so the pyramid bulges in the middle. Fewer young individuals are coming up than there are adults today, so this population is **declining**.', icon: 'circle' },
      ],
    },
    {
      id: '1e528036-1924-41e7-8b1b-528c334abf8e',
      type: 'reasoning_prompt',
      order: 8,
      reasoning_type: 'logical',
      prompt: "Two claims are on the table. First: 'A population has birth rates and death rates, but an individual only has births and deaths.' Second: 'The shape of a human age pyramid tells you whether that population is growing, stable or declining.' What single idea explains both claims at once?",
      options: [
        "Both attributes are averages, and an average of one individual is simply that individual's own value — so a population and an individual carry the same information either way",
        "Both are properties that only exist across a group of individuals — a per capita rate needs a population to divide by, and a growth status needs an age distribution, which one organism cannot have",
        "Both describe the physical environment the population lives in rather than the population itself, which is why an individual organism cannot show them",
        "Both are measured only for human populations, because other species do not have age groups or measurable birth rates",
      ],
      reveal: "The common idea is that these are **population-level** properties. A per capita birth rate is 8 new lotus plants divided by the 20 that produced them — the division needs a population to divide by, so a lone plant cannot have a rate at all, only a birth. In the same way, an age distribution is the per cent of individuals in each age group; one organism has an age, not a distribution, so it cannot have a pyramid or a growth status. The tempting wrong choice is the 'averages' one — it sounds sensible, but it misses the point exactly: the whole reason NCERT stresses the per capita form is that the population's rate is *not* recoverable from any single individual. The environment option is wrong because these are attributes of the population, not of the abiotic surroundings; and the human-only option is wrong because NCERT's own rate examples are lotus plants and fruitflies — only the male/female age-pyramid convention is specific to human populations.",
      difficulty_level: 2,
    },
    {
      id: '2f639147-2a35-4208-9c2c-639d445bca9f',
      type: 'heading',
      order: 9,
      level: 2,
      text: 'Population Density (N) — Numbers Are Not Always the Answer',
      objective: "By the end of this you can say why a single banyan tree is not 'less of a population' than 200 carrot grass plants, and pick the right density measure for a given situation.",
    },
    {
      id: '306a1258-3b46-4319-8d3d-74ae556cdba0',
      type: 'text',
      order: 10,
      markdown: "The **size of the population tells us a lot about its status in the habitat.** Whatever ecological process we want to investigate — the outcome of **competition with another species**, the impact of a **predator**, or the effect of a **pesticide application** — we always evaluate it in terms of **any change in the population size**. Population size is the common currency of the whole chapter.\n\nThat size, in nature, ranges enormously. It could be as low as **fewer than 10** (Siberian cranes at Bharatpur wetlands in any year) or run into **millions** (*Chlamydomonas* in a pond).\n\nPopulation size is technically called **population density**, designated **N**. And here is the line students skate past: **population density need not necessarily be measured in numbers only.** Total number is *generally* the most appropriate measure — but in some cases it is either **meaningless** or **difficult to determine**.\n\n**When a count is meaningless — use per cent cover or biomass.** Take an area with **200 carrot grass (*Parthenium hysterophorus*) plants** but only a **single huge banyan tree** with a large canopy. Going by numbers, the banyan's density is low compared to the carrot grass — and that badly **underestimates the enormous role of the banyan** in that community. One banyan is doing far more in that habitat than 200 weeds. In such cases, **per cent cover or biomass** is a more meaningful measure of population size.\n\n**When a count is impractical — use a relative density.** Total number is also not easily adoptable if the population is **huge and counting is impossible or very time-consuming** — think of a dense laboratory culture of bacteria in a petri dish. And for certain ecological investigations there is **no need to know the absolute population densities** at all; **relative densities serve the purpose equally well**. For instance, the **number of fish caught per trap** is a good enough measure of the total fish population density in a lake.\n\n**When the animal will not be seen — estimate indirectly.** As the tiger census shows, we are mostly obliged to estimate population sizes **indirectly**, without actually counting or seeing the individuals — from **pug marks** and **fecal pellets**.\n\nSo a population is a group with rates, a ratio, an age structure and a density. But none of those stay still — the size of a population for any species is **not a static parameter**; it keeps changing with time. That change is what the next page is about.",
    },
    {
      id: '417b2369-4c57-442a-9e4e-85bf667dcbb1',
      type: 'callout',
      order: 11,
      variant: 'remember',
      title: 'The Non-Negotiables',
      markdown: "- **Population:** individuals of a species in a **well defined geographical area**, **sharing or competing for similar resources**, **potentially interbreeding**. Asexually produced groups count too.\n- **A population has attributes an individual does not:** birth rate (**natality**), death rate (**mortality**), **sex ratio**, **age distribution**, **population density (N)**. An individual only has births, deaths, a sex, and an age.\n- **Rates are per capita.** Lotus: 8 new plants from 20 → **8/20 = 0.4 offspring per lotus per year**. Fruitflies: 4 deaths from 40 in a week → **4/40 = 0.1 individuals per fruitfly per week**. Always divide by the population; always state the time period.\n- **Age pyramid = plotted age distribution.** Three shapes: **broad base → expanding (growing)**; **base ≈ middle → stable**; **narrow base → declining**.\n- **Density (N) need not be a count:** **per cent cover / biomass** when a count is meaningless (banyan vs carrot grass); **relative density** when a count is impractical (fish caught per trap); **indirect estimates** when the animal is unseen (tiger **pug marks**, **fecal pellets**).",
    },
    {
      id: '528c3470-5d68-453b-8f5f-96c0778edcc2',
      type: 'callout',
      order: 12,
      variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Per capita is the whole trick.** NEET loves handing you raw numbers and watching who forgets to divide. If a question gives you births and a starting population, the answer is **births ÷ starting population**, per unit time — never the bare count. The two NCERT numbers (**0.4 offspring per lotus per year**, **0.1 individuals per fruitfly per week**) get lifted almost verbatim, so know how each was obtained, not just the value.\n\n**The pyramid shapes get swapped.** The single most common trap is offering a **narrow base** as 'expanding' or a **broad base** as 'declining'. Anchor it to the base, not the top: **broad base = expanding**, **straight sides / base like the middle = stable**, **pinched base = declining**. The post-reproductive top is narrow in all three, so it never decides anything.\n\n**'Density must be a number' is a trap.** NCERT says outright that population density **need not necessarily be measured in numbers only**. Match the case to the measure: **banyan vs carrot grass → per cent cover or biomass**; **fish caught per trap → relative density**; **tiger census → pug marks and fecal pellets (indirect estimate)**.\n\n**The definition is a fill-in-the-blank.** Three phrases from the population definition recur: *well defined geographical area*, *share or compete for similar resources*, *potentially interbreed*. Also remember that **natural selection operates at the population level**, even though it is the **individual** that copes with a changed environment.\n\n**Classic NEET question:** \"Which of the following is an attribute of a population but not of an individual?\" → **Sex ratio** (an individual is only male or female; a population has a ratio such as 60% females and 40% males).",
    },
    {
      id: '639d4581-6e79-4640-9a60-a7d1889fedd3',
      type: 'inline_quiz',
      order: 13,
      pass_threshold: 0.67,
      questions: [
        {
          id: '74ae5692-7f8a-4751-8b71-b8e2999a0ee4',
          question: 'Which one of the following is an attribute of a population but never of an individual organism?',
          options: [
            'Being either male or female',
            'Sex ratio, such as 60 per cent females and 40 per cent males',
            'Belonging to a particular age, such as three years old',
            'Undergoing a birth and later a death',
          ],
          correct_index: 1,
          explanation: "A sex ratio only exists across a group — no single organism can be 60 per cent female, but a population can have that composition. Being male or female, having an age, and undergoing a birth and a death are all things an individual does have; what the population adds on top of them is the ratio, the age distribution, and the per capita birth and death rates.",
          difficulty_level: 1,
        },
        {
          id: '85bf67a3-809b-4862-9c82-c9f30aab1ff5',
          question: 'A pond had 20 lotus plants last year. Through reproduction, 8 new plants were added, taking the population to 28. What is the birth rate of this population?',
          options: [
            '8 offspring per year, since 8 new plants were added',
            '0.29 offspring per lotus per year, since 8 of the current 28 plants are new',
            '0.4 offspring per lotus per year, since the 8 additions are divided by the 20 plants present',
            '28 offspring per year, since that is the size the population reached',
          ],
          correct_index: 2,
          explanation: "Birth rate in a population is a per capita rate: divide the additions by the members that produced them, so 8/20 = 0.4 offspring per lotus per year. The tempting error is dividing by 28 — but 28 is the population *after* the new plants arrived, and the offspring came from the 20 that were already there. Quoting the bare count of 8, or the final size 28, ignores the per capita form altogether.",
          difficulty_level: 2,
        },
        {
          id: '96c07894-91ac-4973-8d93-d0041bbc20a6',
          question: 'An age pyramid for a human population has a base clearly narrower than the band of reproductive-age individuals above it. What does this shape indicate?',
          options: [
            'The population is declining, because fewer pre-reproductive individuals are coming up than there are adults now',
            'The population is expanding, because the narrow base shows low mortality among the young',
            'The population is stable, because the pyramid bulges in the middle where the reproductive individuals are',
            'Nothing about growth status — only the width of the post-reproductive top reveals that',
          ],
          correct_index: 0,
          explanation: "The shape of an age pyramid reflects the growth status, and the base is what decides it: a base narrower than the middle means the pre-reproductive crowd is smaller than the current adult crowd, so the population is declining. The favourite trap is reading a narrow base as expanding — expanding is the opposite, a broad base tapering to a narrow top. A stable population has a base about as wide as the middle, not a pinched one, and the post-reproductive top is narrow in all three shapes, so it never diagnoses anything.",
          difficulty_level: 3,
        },
        {
          id: 'a7d1889b-a2bd-4a84-9ea4-e11526cd31b7',
          question: 'An area holds 200 carrot grass (Parthenium hysterophorus) plants and one huge banyan tree with a large canopy. Why is total number a poor measure of population density here, and what is used instead?',
          options: [
            'Because the banyan is impossible to count, so relative density such as number caught per trap is used instead',
            'Because carrot grass reproduces asexually and so does not form a population, so only the banyan is measured',
            'Because the two species have different sex ratios, so the age distribution of each is plotted instead',
            'Because counting makes the banyan appear low in density and underestimates its enormous role, so per cent cover or biomass is used instead',
          ],
          correct_index: 3,
          explanation: "By numbers alone the banyan's density looks tiny beside 200 carrot grass plants, which badly underestimates the enormous role that one tree plays in the community — so per cent cover or biomass is the more meaningful measure. Counting is not the problem here (a single banyan is easy to count); relative density such as fish caught per trap is for populations too huge or time-consuming to count. Asexually produced groups are still treated as populations, and sex ratio and age distribution are different attributes altogether, not measures of density.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
