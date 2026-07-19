'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'microbes-as-biocontrol-agents',
  title: "Nature's Pest Control — Biocontrol Agents",
  subtitle: "Instead of spraying poison over a whole field, you set living predators and microbes to work on the pests — hitting the target and leaving everything else alone.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['microbes-in-human-welfare', 'biocontrol-agents'],
  glossary: [
    { term: 'biocontrol', definition: 'The use of biological methods — living predators, bacteria, fungi or viruses — to control plant diseases and pests, instead of chemical insecticides and pesticides.' },
    { term: 'Bacillus thuringiensis', definition: 'A bacterium (written Bt) sold as dried spores; sprayed on plants, its toxin is released in the gut of insect larvae and kills caterpillars while leaving other insects unharmed.' },
    { term: 'Trichoderma', definition: 'Free-living fungi very common in root ecosystems that act as effective biocontrol agents against several plant pathogens.' },
    { term: 'Baculovirus', definition: 'A virus that attacks insects and other arthropods; the species used for pest control belong to the genus Nucleopolyhedrovirus and are species-specific, narrow-spectrum insecticides.' },
    { term: 'integrated pest management (IPM)', definition: 'A pest-control programme that conserves beneficial insects and uses species-specific agents, so pests are held down without harming non-target life.' },
    { term: 'pest', definition: 'An organism — often an insect or its larvae — that damages crops; in organic farming pests are kept to manageable levels rather than wiped out entirely.' },
    { term: 'aphid', definition: 'A small sap-sucking insect that attacks crops; the ladybird beetle is used to get rid of aphids.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dusk crop field where ladybird beetles, dragonflies and a fine spray of microbes quietly work over the plants instead of a chemical sprayer',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A calm organic crop field at dusk seen close up: rows of green brassica and fruit-tree leaves under a deep dusk sky. Living helpers are quietly at work across the scene — a few red-and-black ladybird beetles crawling over aphid-covered stems on the left, slender dragonflies hovering over the crop in the middle, and on the right a faint fine mist of sprayed spores settling on the leaves, with tiny insect larvae on a leaf underside. No chemical sprayer, no people as focal subjects. One continuous warm horizon glow tying the field together, painterly atmospheric illustration, dark background tones throughout (#0a0a0a base), no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'A Beetle That Eats Your Pests For You',
      markdown: "That familiar little beetle with red-and-black markings — the **Ladybird** — is one of a farmer's best friends. Let enough of them loose in a field and they get rid of the **aphids** that suck the crop dry, no spray needed. Nearby, **dragonflies** patrol the air and clear out mosquitoes. The pests are handled by other living things that were going to be there anyway — you just tip the balance in the crop's favour.",
    },
    {
      id: uuid(), type: 'heading', order: 2, text: 'Why Reach For Living Agents Instead of Chemicals?', level: 2,
      objective: 'Understand what "biocontrol" means and why the organic farmer prefers checks-and-balances over blanket spraying.',
    },
    {
      id: uuid(), type: 'text', order: 3,
      markdown: "**Biocontrol** means using **biological methods** — living predators, bacteria, fungi or viruses — to control plant **diseases and pests**. The modern habit has been to reach for chemicals instead: **insecticides and pesticides**. Those chemicals are toxic and extremely harmful to humans and animals alike, and they pollute the environment — soil, ground water, fruits, vegetables and the crop plants themselves. Weedicides sprayed to kill weeds pollute the soil the same way.\n\nThe **organic farmer** takes a different view: **biodiversity furthers health**. The more variety a landscape has, the more sustainable it is. So the goal isn't to wipe out every insect called a pest — it's to keep pests at **manageable levels** through a complex system of checks and balances inside a living ecosystem. Conventional chemical farming kills useful and harmful life forms indiscriminately; biocontrol works with the web of interactions in the field instead of against it. In fact, eradicating pests completely would be undesirable — the beneficial predatory and parasitic insects that feed on them would starve. Leaning on biocontrol this way greatly reduces our dependence on toxic chemicals and pesticides.",
    },
    {
      id: uuid(), type: 'heading', order: 4, text: 'The Biocontrol Agents NCERT Wants You To Know', level: 2,
      objective: 'Match each agent to the pest or pathogen it controls, and note what makes each one useful.',
    },
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "Start with the two predators. The **Ladybird** beetle clears **aphids**; **Dragonflies** clear **mosquitoes**. These are whole insects doing the eating.\n\nThen the microbes. **Bacillus thuringiensis** — written **Bt** — is a bacterium sold in sachets as **dried spores**. You mix the spores with water and spray them onto vulnerable plants like **brassicas and fruit trees**. Insect **larvae** eat the sprayed leaves, and in the **gut of the larvae the toxin is released**, killing them. The clever part: this bacterial disease kills the **caterpillars** but leaves other insects unharmed. (Later, scientists moved the *B. thuringiensis* toxin genes straight into plants — **Bt-cotton** is one such crop, covered in Chapter 10.)\n\n**Trichoderma** is a **free-living fungus**, very common in root ecosystems, and an effective biocontrol agent against several **plant pathogens** — so it fights disease down at the roots rather than eating insects.\n\nFinally, **Baculoviruses** are viruses that attack insects and other arthropods. The ones used for pest control are in the genus **Nucleopolyhedrovirus**, and they are **species-specific, narrow-spectrum** insecticides with no negative impact on plants, mammals, birds, fish, or even non-target insects — which makes them ideal for an **integrated pest management (IPM)** programme or an ecologically sensitive area.",
    },
    {
      id: uuid(), type: 'table', order: 6,
      caption: '📸 The NCERT biocontrol agents at a glance — agent, its target, and what makes it useful.',
      headers: ['Biocontrol agent', 'Target pest / pathogen', 'Note'],
      rows: [
        ['Ladybird (beetle)', 'Aphids', 'A predatory insect — eats the pest directly.'],
        ['Dragonflies', 'Mosquitoes', 'A predatory insect — clears mosquitoes.'],
        ['Bacillus thuringiensis (Bt)', 'Butterfly caterpillars (insect larvae)', 'Sprayed as dried spores; toxin released in larval gut kills them, leaves other insects unharmed.'],
        ['Trichoderma', 'Several plant pathogens (at the roots)', 'Free-living fungus common in root ecosystems.'],
        ['Baculovirus (Nucleopolyhedrovirus)', 'Insects and other arthropods', 'Species-specific, narrow-spectrum; safe for plants, mammals, birds, fish, non-target insects — good for IPM.'],
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
      prompt: "Bt and Baculovirus are both praised for being 'species-specific' or 'narrow-spectrum'. Why is hitting only the target pest actually an *advantage* over a broad chemical pesticide?",
      options: [
        "Because they kill the target pest and also every other insect nearby, clearing the field completely",
        "Because they leave beneficial predatory and non-target insects unharmed, so the ecosystem's natural checks and balances keep working",
        "Because they act faster than any chemical and need only a single spray for the whole season",
        "Because they make the crop plants themselves poisonous to all animals that eat them",
      ],
      reveal: "The key is the second option. A chemical pesticide kills useful and harmful life forms indiscriminately, wiping out the very predatory and parasitic insects that keep pests down. A species-specific agent like Bt (kills the caterpillars, spares other insects) or a narrow-spectrum Baculovirus (no impact on non-target insects, birds, fish or mammals) removes the pest while conserving beneficial insects — exactly what an IPM programme wants. The first option is the opposite of what specificity means. Speed and single-spray claims (third option) aren't what NCERT credits them with, and biocontrol agents don't make crops poisonous to all animals (fourth option).",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 8, variant: 'remember', title: 'Lock In The Three Microbial Agents',
      markdown: "- **Bacillus thuringiensis (Bt)** → kills **butterfly caterpillars**; sprayed as dried spores, toxin released in the **gut of the larvae**, other insects unharmed.\n- **Trichoderma** → a **free-living fungus** in root ecosystems; controls several **plant pathogens** (disease, not insects).\n- **Baculovirus** (genus **Nucleopolyhedrovirus**) → **species-specific, narrow-spectrum** insecticide; safe for non-target life, ideal for **IPM**.\n\nAnd the two predators: **Ladybird → aphids**, **Dragonfly → mosquitoes**.",
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'exam_tip', title: 'What NEET Lifts From This Page',
      markdown: "**Ladybird → aphids, Dragonfly → mosquitoes:** the classic matching pair — don't swap them.\n**Bt (Bacillus thuringiensis):** targets butterfly caterpillars; the toxin is released in the **gut of the larvae**, and it leaves other insects unharmed.\n**Trichoderma:** a **fungus** (free-living, root ecosystems) against plant **pathogens** — examiners love pairing it wrongly with insects.\n**Baculovirus → genus Nucleopolyhedrovirus:** species-specific, narrow-spectrum, tied to **IPM**.\n**Classic NEET question:** \"Which biocontrol agent is used against butterfly caterpillars?\" → Bacillus thuringiensis (Bt).",
    },
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "So biocontrol swaps toxic sprays for living helpers that hit the pest and spare the rest. If chemicals in the field are the problem, chemicals in the *soil* — fertilisers — are the next one, and the same organic-farming logic points to microbes as the answer. That's biofertilisers, up next.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "The ladybird beetle and dragonflies are used as biocontrol agents against which pests, respectively?",
          options: ['Mosquitoes and aphids', 'Aphids and mosquitoes', 'Caterpillars and aphids', 'Aphids and plant pathogens'],
          correct_index: 1,
          explanation: "NCERT states the Ladybird gets rid of aphids and Dragonflies get rid of mosquitoes. The first option reverses the pair — the commonest trap. Caterpillars are Bt's target, and plant pathogens are Trichoderma's, so those options mix in the wrong agents.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Bacillus thuringiensis (Bt) is sprayed as dried spores on crops. How does it kill its target?",
          options: [
            'It infects the roots and blocks water uptake so the plant pest starves',
            'Its toxin is released in the gut of the insect larvae after they eat the sprayed leaves, killing them',
            'It coats the leaf surface and suffocates every insect that lands on it',
            'It attacks arthropods as a narrow-spectrum virus specific to each species',
          ],
          correct_index: 1,
          explanation: "The larvae eat the sprayed leaves, and inside the gut of the larvae the toxin is released and the larvae are killed — while other insects are left unharmed. The root option describes nothing NCERT says about Bt. 'Suffocates every insect' contradicts Bt's specificity. The last option describes a Baculovirus, not the bacterium Bt.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which biocontrol agent is a free-living fungus used against plant pathogens rather than against insects?",
          options: ['Trichoderma', 'Bacillus thuringiensis', 'Nucleopolyhedrovirus', 'Ladybird'],
          correct_index: 0,
          explanation: "Trichoderma species are free-living fungi common in root ecosystems and are effective biocontrol agents of several plant pathogens. Bacillus thuringiensis is a bacterium that targets insect larvae, Nucleopolyhedrovirus is an insect-attacking virus, and the ladybird is a predatory beetle — none of them is a fungus acting on pathogens.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Baculoviruses used in pest control belong to the genus Nucleopolyhedrovirus. What makes them especially suitable for integrated pest management (IPM)?",
          options: [
            'They kill a broad range of insects, birds and fish in one application',
            'They are cheaper to manufacture than any chemical pesticide',
            'They are species-specific and narrow-spectrum, with no negative impact on non-target insects, plants, mammals, birds or fish',
            'They spread from plant to plant on their own, needing no repeat spraying',
          ],
          correct_index: 2,
          explanation: "NCERT credits these viruses with being species-specific, narrow-spectrum insecticides that have no negative impact on plants, mammals, birds, fish or even non-target insects — ideal when beneficial insects are being conserved in an IPM programme. The 'broad range' option is the opposite of narrow-spectrum. Cost and self-spreading are not claims NCERT makes.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
