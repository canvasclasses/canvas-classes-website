'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'life-history-variation-and-kinds-of-interaction',
  title: 'Life-History Strategies & the Six Kinds of Interaction',
  subtitle: 'Why some organisms stake everything on one breeding season while others spread the bet — and the simple +, – and 0 code that names every relationship in nature.',
  page_number: 3,
  page_type: 'lesson',
  tags: ['life-history-variation', 'darwinian-fitness', 'population-interactions', 'table-11-1', 'organisms-and-populations'],
  glossary: [
    { term: 'life history traits', definition: 'The reproductive habits of a species — how many times in its life it breeds, and how many offspring it makes at a time and of what size. NCERT says these traits have evolved in relation to the constraints imposed by the abiotic and biotic components of the habitat the organism lives in.' },
    { term: 'Darwinian fitness', definition: 'Reproductive fitness — measured as a high r value (a high intrinsic rate of natural increase). Populations evolve to maximise it in the habitat in which they live.' },
    { term: 'mutualism', definition: 'An interspecific interaction in which both species benefit. Sign pair: + +.' },
    { term: 'competition', definition: 'An interspecific interaction in which both species lose. Sign pair: – –.' },
    { term: 'predation', definition: 'An interaction where one species (the predator) benefits and the other (the prey) is harmed. Sign pair: + –.' },
    { term: 'parasitism', definition: 'An interaction where one species (the parasite) benefits and the other (the host) is harmed. Sign pair: + –, the same as predation.' },
    { term: 'commensalism', definition: 'An interaction where one species is benefitted and the other is neither benefitted nor harmed. Sign pair: + 0.' },
    { term: 'amensalism', definition: 'An interaction where one species is harmed while the other is unaffected. Sign pair: – 0.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A river at dusk crowded with salmon pushing upstream, with a dense stand of bamboo on the dark bank behind them',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: 'Ultra-wide cinematic banner (16:5 ratio). A dark, atmospheric river at dusk, crowded with silvery salmon pushing upstream against the current, their backs breaking the water. On the shadowed far bank, a dense stand of tall bamboo culms rises into the gloom. Painterly, naturalistic illustration, deeply atmospheric, overall dark background (#0a0a0a base tones), a single cold moonlit sheen on the water as the light source. No text, no labels, no diagram elements, no photorealism.',
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'One Breeding Season Is Their Whole Reproductive Life',
      markdown: "A **Pacific salmon** breeds **only once in its lifetime**. Not once a year — once, full stop. Everything the fish has ever eaten, grown and stored is spent on that single event, and there is no second attempt.\n\n**Bamboo** does the same thing on land: one breeding episode in a lifetime. Now compare that with a sparrow or a cow — **most birds and mammals breed many times during their lifetime**, a little each season, again and again.\n\nBoth strategies exist. Both survive. So neither can be simply *wrong* — which is exactly the puzzle this page opens with.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Start with what a population is actually trying to do. **Populations evolve to maximise their reproductive fitness, also called Darwinian fitness (high r value), in the habitat in which they live.** That *r* is the intrinsic rate of natural increase you met with growth models — so \"fitness\" here is not about strength or size. It is about **leaving behind the most descendants**.\n\nAnd under **a particular set of selection pressures, organisms evolve towards the most efficient reproductive strategy.** Read that sentence carefully — *a particular set*. The strategy is fitted to a specific habitat, not to nature in general. Change the habitat and the most efficient strategy changes with it.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Two Great Trade-Offs',
      objective: 'By the end of this you can state both reproductive trade-offs with their NCERT examples, and explain why neither side of either trade-off is the universally "better" one.',
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "NCERT sets out the variation as two clean either-or choices.\n\n**How many times do you breed?** **Some organisms breed only once in their lifetime — Pacific salmon fish and bamboo. Others breed many times during their lifetime — most birds and mammals.**\n\n**How many offspring, and how big?** **Some produce a large number of small-sized offspring — oysters and pelagic fishes. Others produce a small number of large-sized offspring — birds and mammals.**\n\nNotice the shape of both choices: you cannot have everything. An oyster's resources can be split into millions of tiny eggs or a handful of well-provisioned ones — not both. A salmon can hold energy back for a second season or pour all of it into the first — not both.\n\nSo which is desirable for maximising fitness? NCERT does not hand you a winner, and that is the point. **Ecologists suggest that life history traits of organisms have evolved in relation to the constraints imposed by the abiotic and biotic components of the habitat in which they live.** The habitat decides. The non-living conditions and the other living things around you set the constraints, and the strategy that squeezes the most descendants out of *those* constraints is the one that evolves. **Evolution of life history traits in different species is currently an important area of research being conducted by ecologists** — it is an open question, not a settled rule.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 5,
      title: 'Breed Once vs Breed Many · Many Small vs Few Large',
      columns: [
        {
          heading: 'Breed only once in a lifetime',
          points: [
            'A single reproductive event is the whole of the organism\'s breeding life.',
            'NCERT examples: **Pacific salmon fish**, **bamboo**.',
            'Everything is committed to one attempt — no resources held back for a later season.',
          ],
        },
        {
          heading: 'Breed many times in a lifetime',
          points: [
            'Reproduction is repeated again and again through the organism\'s life.',
            'NCERT examples: **most birds and mammals**.',
            'The effort is spread across several attempts instead of staked on one.',
          ],
        },
        {
          heading: 'Many small-sized offspring',
          points: [
            'A large number of offspring, each one small.',
            'NCERT examples: **oysters**, **pelagic fishes**.',
            'The same resources are divided into very many, very small packets.',
          ],
        },
        {
          heading: 'Few large-sized offspring',
          points: [
            'A small number of offspring, each one large.',
            'NCERT examples: **birds**, **mammals**.',
            'The same resources are concentrated into a few well-provisioned young.',
          ],
        },
      ],
    },
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Nobody Lives Alone — and the +, –, 0 Code',
      objective: 'By the end of this you can build all six named interactions yourself from the three signs, instead of memorising six loose definitions.',
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Ask yourself NCERT's question: **can you think of any natural habitat on earth that is inhabited just by a single species?** There is none, and such a situation is even inconceivable. **For any species, the minimal requirement is one more species on which it can feed.** Even a plant — which makes its own food — **needs soil microbes** to break down organic matter in the soil and return the inorganic nutrients for absorption. And **how will the plant manage pollination without an animal agent?** Animals, plants and microbes **do not and cannot live in isolation** but interact in various ways to form a **biological community**.\n\n**Interspecific interactions arise from the interaction of populations of two different species.** Two species — that is the whole set-up. And for each of the two, only three things can happen: it can be helped, it can be hurt, or nothing happens to it. NCERT writes those three as signs:\n\n- **`+` = beneficial** to that species\n- **`–` = detrimental** to that species\n- **`0` = neutral** — neither harm nor benefit\n\nNow just pair the signs for Species A and Species B, and you get every possible outcome — that is **Table 11.1**, and it is not a list to cram, it is a grid you can rebuild from scratch.\n\n**Both the species benefit in mutualism (+ +) and both lose in competition (– –).** Then two interactions share the *identical* sign pair: **in both parasitism and predation only one species benefits — the parasite and the predator respectively — and the interaction is detrimental to the other species, the host and the prey respectively (+ –).** That is the one place the signs alone can't tell them apart, and NEET knows it.\n\nThe last two use the `0`. **The interaction where one species is benefitted and the other is neither benefitted nor harmed is called commensalism (+ 0). In amensalism, on the other hand, one species is harmed whereas the other is unaffected (– 0).** Same neutral partner, opposite fate for the other one — mix these two up and you lose the mark.\n\nOne more line worth holding: **predation, parasitism and commensalism share a common characteristic — the interacting species live closely together.**",
    },
    {
      id: uuid(), type: 'table', order: 8,
      caption: 'Table 11.1 — Population Interactions. Assign + for beneficial, – for detrimental, 0 for neutral, and every named interaction falls out of the sign pair.',
      headers: ['Name of Interaction', 'Species A', 'Species B'],
      rows: [
        ['Mutualism', '+', '+'],
        ['Competition', '–', '–'],
        ['Predation', '+', '–'],
        ['Parasitism', '+', '–'],
        ['Commensalism', '+', '0'],
        ['Amensalism', '–', '0'],
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: 'Two species live closely together. Species A gains nothing and loses nothing from the association. Species B is clearly harmed by it. Using Table 11.1, which interaction is this?',
      options: [
        'Commensalism — one species is benefitted and the other is unaffected',
        'Amensalism — one species is harmed while the other is unaffected',
        'Parasitism — one species benefits at the expense of the other',
        'Competition — both of the interacting species lose',
      ],
      correct_index: 1,
      reveal: 'Write the signs down before you read the options. Species A is unaffected → **0**. Species B is harmed → **–**. The pair **– 0** is **amensalism**, where one species is harmed whereas the other is unaffected. Commensalism is the trap almost everyone falls into, because it also has a neutral partner — but its pair is **+ 0**, meaning the *other* species is **benefitted**, not harmed. Parasitism needs a species that actually gains (+ –), and nobody gains here. Competition needs *both* to lose (– –), but A loses nothing.',
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'The Six Sign Pairs — Lock Them In',
      markdown: "**Table 11.1, in order (Species A, Species B):**\n\n- **Mutualism → `+ +`** — both benefit.\n- **Competition → `– –`** — both lose.\n- **Predation → `+ –`** — predator gains, prey harmed.\n- **Parasitism → `+ –`** — parasite gains, host harmed. *Same signs as predation.*\n- **Commensalism → `+ 0`** — one benefits, other unaffected.\n- **Amensalism → `– 0`** — one harmed, other unaffected.\n\n**Read the table downwards and the pattern is the mnemonic:** both win → both lose → one wins one loses (twice) → then the two with a `0` partner, first the good one, then the bad one.\n\n**Also fixed in NCERT:**\n- **`+` = beneficial · `–` = detrimental · `0` = neutral (neither harm nor benefit).**\n- Interspecific interactions = interaction of populations of **two different species**.\n- **Predation, parasitism and commensalism** → the interacting species **live closely together**.\n- Life history: **breed once → Pacific salmon, bamboo** | **breed many times → most birds and mammals** | **many small offspring → oysters, pelagic fishes** | **few large offspring → birds, mammals**.\n- Fitness = **Darwinian fitness = high r value**; life history traits evolved under constraints of the **abiotic and biotic components of the habitat**.",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Table 11.1 is lifted verbatim.** NEET asks it as a match-the-column or as \"which pair of signs represents X\". Learn it as a grid you can rebuild from + / – / 0, not as six sentences — sentences blur under exam pressure, the grid doesn't.\n\n**Predation and parasitism both = `+ –`.** This is the single most exploited fact on this page. If a question shows you only the signs `+ –` and asks for *one* name, the question is faulty or it will name the organisms — the signs alone cannot separate the two. Both help one species and harm the other.\n\n**Commensalism vs amensalism:** both have a **0** partner, so students swap them. Fix it by the *other* species — **commensalism `+ 0`** (other one is **helped**), **amensalism `– 0`** (other one is **harmed**). Amensalism is the negative twin.\n\n**Darwinian fitness = high r value.** Not body size, not lifespan. Expect \"reproductive fitness is measured as ______\" → **high r value**.\n\n**Examples get swapped deliberately.** **Oysters and pelagic fishes → many small offspring.** **Birds and mammals → few large offspring** *and* **breed many times**. **Pacific salmon and bamboo → breed only once.** An option putting bamboo with \"breeds many times\" is the standard trap.\n\n**Classic NEET question:** \"In Table 11.1 of population interactions, the sign pair for amensalism is ______.\" → **`– 0`** — one species harmed, the other unaffected.",
    },
    {
      id: uuid(), type: 'text', order: 12,
      markdown: 'So the grid gives you the names. What it does not give you is the *story* behind each one — how a predator actually shapes the community it hunts in. That is where NCERT goes next, starting with predation.',
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'According to NCERT, which pair of organisms breeds only once in its lifetime?',
          options: [
            'Oysters and pelagic fishes',
            'Most birds and mammals',
            'Pacific salmon fish and bamboo',
            'Soil microbes and flowering plants',
          ],
          correct_index: 2,
          explanation: 'NCERT names Pacific salmon fish and bamboo as the organisms that breed only once in their lifetime. Most birds and mammals are the contrasting example — they breed many times, so that option is the direct opposite. Oysters and pelagic fishes belong to the *other* trade-off entirely: they are the example of producing a large number of small-sized offspring, which is about offspring number and size, not about how many times an organism breeds.',
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'In Table 11.1, which interaction carries the sign pair – 0 (one species harmed, the other unaffected)?',
          options: [
            'Amensalism',
            'Commensalism',
            'Competition',
            'Parasitism',
          ],
          correct_index: 0,
          explanation: 'Amensalism is the – 0 interaction: one species is harmed whereas the other is unaffected. Commensalism is the tempting swap because it also has a neutral (0) partner, but its pair is + 0 — there the other species is benefitted, not harmed. Competition is – – because both species lose, and parasitism is + – because the parasite actually gains from the host.',
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'Two different interactions in Table 11.1 share the identical sign pair + –. Which two are they?',
          options: [
            'Mutualism and commensalism',
            'Competition and amensalism',
            'Commensalism and amensalism',
            'Predation and parasitism',
          ],
          correct_index: 3,
          explanation: 'Predation and parasitism both read + – : only one species benefits (the predator and the parasite respectively) and the interaction is detrimental to the other (the prey and the host respectively). Commensalism and amensalism are the tempting pick because they are also often confused with each other, but their signs are different from each other (+ 0 versus – 0), not identical. Mutualism is + +, competition is – –, and amensalism is – 0 — none of those match + –.',
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'NCERT says the life history traits of an organism have evolved in relation to what?',
          options: [
            'The intrinsic rate of natural increase alone, independent of where the organism lives',
            'The constraints imposed by the abiotic and biotic components of the habitat in which it lives',
            'The body size of the organism, which fixes how many offspring it can carry',
            'A single universally most efficient strategy that all species are slowly evolving towards',
          ],
          correct_index: 1,
          explanation: 'Ecologists suggest that life history traits have evolved in relation to the constraints imposed by the abiotic and biotic components of the habitat in which the organism lives — the habitat sets the constraints, so different habitats favour different strategies. The "one universally best strategy" option is the trap: NCERT deliberately asks which is desirable and refuses to name a winner, saying instead that organisms evolve towards the most efficient strategy under *a particular set of selection pressures*. The r value is what fitness is measured by, not what the traits evolved in relation to, and body size is never given as the deciding factor.',
          difficulty_level: 3,
        },
      ],
    },
  ],
};
