'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'why-we-should-conserve-biodiversity',
  title: 'Why Conserve Biodiversity?',
  subtitle: 'Three kinds of reasons — what nature pays us directly, what it does for us quietly for free, and what we owe it regardless of either — and how to tell in one second which one an exam option belongs to.',
  page_number: 5,
  page_type: 'lesson',
  tags: ['biodiversity', 'conservation', 'why-conserve-biodiversity', 'bioprospecting', 'ecosystem-services'],
  glossary: [
    { term: 'narrowly utilitarian', definition: 'The first category of reasons for conserving biodiversity — the countless direct economic benefits humans derive from nature: food, firewood, fibre, construction material, industrial products and products of medicinal importance.' },
    { term: 'broadly utilitarian', definition: 'The second category of reasons — biodiversity plays a major role in the many ecosystem services nature provides, such as oxygen from photosynthesis, pollination, and the intangible aesthetic pleasures we derive from nature.' },
    { term: 'ethical', definition: 'The third category of reasons — it relates to what we owe to the millions of plant, animal and microbe species with whom we share this planet. Every species has an intrinsic value, and we have a moral duty to care for their well-being.' },
    { term: 'bioprospecting', definition: 'Exploring molecular, genetic and species-level diversity for products of economic importance. As more resources go into it, nations endowed with rich biodiversity can expect to reap enormous benefits.' },
    { term: 'ecosystem services', definition: 'The services nature provides in which biodiversity plays a major role — for example the Amazon forest producing 20 per cent of the total oxygen in the earth’s atmosphere through photosynthesis, and pollination by bees, bumblebees, birds and bats.' },
    { term: 'intrinsic value', definition: 'The value every species has in itself, even if it may not be of current or any economic value to us. Recognising it is the heart of the ethical argument for conservation.' },
    { term: 'pollinators', definition: 'The animals through which ecosystems provide the service of pollination — bees, bumblebees, birds and bats. Without pollination, plants cannot give us fruits or seeds.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A vast dark rainforest canopy at first light with a bee crossing a flowering branch in the foreground and a bird perched on it, the forest breathing out faint mist',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: 'Ultra-wide cinematic banner (16:5 ratio). A vast tropical rainforest canopy seen from just above the treetops at first light, stretching unbroken to the horizon, faint mist rising off the leaves as though the forest itself is breathing out. In the near foreground one flowering branch crosses the frame, a few pale blossoms open on it, a single bee in flight beside one flower and a small bulbul-like bird perched further along the same branch with its bill slightly open as if singing. A great river glints faintly through a gap in the canopy far below. Everything muted, naturalistic and earthy, deep dark tones throughout (#0a0a0a base), one low warm glow of dawn along the horizon. Painterly, atmospheric. No people, no text, no labels, no diagram elements, no arrows.',
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'One forest makes a fifth of the air you are breathing right now',
      markdown: "The **Amazon forest** is estimated to produce, through **photosynthesis, 20 per cent of the total oxygen in the earth’s atmosphere**. One forest. One fifth of the planet’s oxygen. And it is fast dwindling.\n\nNCERT asks a question here that is worth sitting with for a moment: **can we put an economic value on this service by nature?** You can get some idea by finding out how much your neighbourhood hospital spends on a **single cylinder of oxygen**. Now multiply that by every breath taken by every animal on Earth. Nobody sends us that bill.\n\nAnd it is not only air. **More than 25 per cent of the drugs currently sold in the market worldwide are derived from plants.** The medicine strip in your cupboard has a one-in-four chance of having started life in a plant.",
    },
    // ── 2 · Core concept ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Why should we conserve biodiversity at all? NCERT’s answer opens with a line worth reading twice: **there are many reasons, some obvious and others not so obvious, but all equally important.** No ranking. No “the real reason is money”. All three carry the same weight.\n\nThose many reasons **can be grouped into three categories: narrowly utilitarian, broadly utilitarian, and ethical.** That is the whole architecture of this section, and it is the single most examined thing in it. Learn the three names in that order, because the section is written in that order and NEET quotes it in that order.\n\nHere is the plain-English shape of the three, so the labels stop feeling like jargon:\n\n- **Narrowly utilitarian** — what we **take out** of nature and use directly. Food on the plate, firewood in the stove, a tablet in the strip. You can point at the thing.\n- **Broadly utilitarian** — what nature **does for us** without handing us any object at all. It makes the oxygen. It pollinates the crop. It makes the morning pleasant. You cannot point at the thing, but you would miss it instantly if it stopped.\n- **Ethical** — reasons that have **nothing to do with us** benefiting. The species matters even if it never gives us a single thing.\n\nNotice the drift from “what I get” → “what gets done for me” → “what I owe”. Both the first two are *utilitarian* — both are about use. That shared word is exactly why students mix them up, so we will nail the boundary between them next.",
    },
    // ── 3 · Heading — narrowly utilitarian ────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Narrowly Utilitarian — What We Take Directly',
      objective: 'By the end of this you can list NCERT’s direct economic benefits from nature, quote the two medicinal-plant figures, and define bioprospecting.',
    },
    // ── 4 · Text — narrowly utilitarian ───────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The **narrowly utilitarian** arguments for conserving biodiversity are the **obvious** ones: **humans derive countless direct economic benefits from nature.** Direct is the operative word. Something physically leaves nature and ends up in a human hand.\n\nNCERT’s own list, and it is worth memorising as a list because that is how it gets asked:\n\n- **Food** — cereals, pulses, fruits\n- **Firewood**\n- **Fibre**\n- **Construction material**\n- **Industrial products** — tannins, lubricants, dyes, resins, perfumes\n- **Products of medicinal importance**\n\nThat last one carries the two numbers this section is famous for. **More than 25 per cent of the drugs currently sold in the market worldwide are derived from plants.** And **25,000 species of plants contribute to the traditional medicines used by native peoples around the world.** Keep the two apart in your head: *25 per cent* is a share of **drugs sold in the market**; *25,000* is a count of **plant species in traditional medicine**. The similar-looking “25” in both is not an accident of nature — it is a gift to whoever writes the distractors.\n\nAnd then the line that turns this from a shopping list into an argument: **nobody knows how many more medicinally useful plants there are in tropical rain forests waiting to be explored.** We are burning a chemist’s shop we have not finished reading the labels in.\n\nWhich brings in **‘bioprospecting’** — **exploring molecular, genetic and species-level diversity for products of economic importance.** Read that definition carefully: it is not only species-level. It goes down to **molecular** and **genetic** diversity too. With **increasing resources being put into bioprospecting**, **nations endowed with rich biodiversity can expect to reap enormous benefits.** India, with 8.1 per cent of global species diversity, is exactly such a nation — which is why this line matters far beyond the exam hall.",
    },
    // ── 5 · Heading — broadly utilitarian ─────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Broadly Utilitarian — What Nature Does For Us For Free',
      objective: 'By the end of this you can name NCERT’s three ecosystem services — oxygen, pollination and the aesthetic pleasures — with the exact figure and the exact pollinators.',
    },
    // ── 6 · Text — broadly utilitarian ────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "The **broadly utilitarian** argument says that **biodiversity plays a major role in many ecosystem services that nature provides.** Nothing is handed to us here. A *process* runs, we live off it, and no invoice arrives.\n\nNCERT gives three, and all three are examinable.\n\n**One — oxygen.** The **fast-dwindling Amazon forest** is estimated to produce, **through photosynthesis, 20 per cent of the total oxygen in the earth’s atmosphere.** Two details students throw away: it is **20 per cent**, not 20 per cent of the *world’s forests* or of the *rainfall*; and it is **through photosynthesis**. NCERT then asks whether we can put an economic value on this service — and answers by pointing at the price of a hospital **oxygen cylinder**. That is the whole trick of the broadly utilitarian argument: it takes something we never pay for and makes you imagine the bill.\n\n**Two — pollination**, **without which plants cannot give us fruits or seeds**. This is **another service ecosystems provide**, and they provide it **through pollinators — bees, bumblebees, birds and bats.** Four pollinators, and NEET expects all four. **Bumblebees are listed separately from bees** — do not let an option quietly drop them. **Bats are on the list** — do not let an option quietly add butterflies or moths to it either. And NCERT asks the same money question again: **what will be the costs of accomplishing pollination without help from natural pollinators?**\n\nHere is the point most students miss. Pollination sounds like it should be “narrowly utilitarian” because fruits and seeds are food, and food was on the *narrow* list. It is not. What we get from the ecosystem is not the fruit — it is **the act of pollination**, the service that makes fruit possible at all. The bee hands you nothing. It just does the job.\n\n**Three — the intangible benefits.** There are **other intangible benefits that we derive from nature** — **the aesthetic pleasures of walking through thick woods, watching spring flowers in full bloom, or waking up to a bulbul’s song in the morning.** **Can we put a price tag on such things?** These are not filler. Aesthetic pleasure is squarely **broadly utilitarian** in NCERT, and an option that files a bulbul’s song under *ethical* is the most common trap on this whole page — because it *feels* soulful, and “ethical” also feels soulful. But nobody is talking about the bulbul’s welfare there. The pleasure is **ours**. Anything we derive is utilitarian.",
    },
    // ── 7 · Heading — ethical ─────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Ethical — What We Owe',
      objective: 'By the end of this you can state the ethical argument in NCERT’s own terms — intrinsic value and moral duty — and say why it does not depend on any benefit to us.',
    },
    // ── 8 · Text — ethical ────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "The **ethical** argument for conserving biodiversity **relates to what we owe to millions of plant, animal and microbe species with whom we share this planet.** Note the three groups NCERT names — **plants, animals and microbes**. Even the microbe is in the sentence.\n\n**Philosophically or spiritually, we need to realise that every species has an intrinsic value, even if it may not be of current or any economic value to us.** That last clause is the whole argument compressed into eight words. *Current* economic value — or **any** economic value, ever. A species that will never feed us, never cure us, never pollinate anything of ours, still counts. Its worth is not a function of our use for it.\n\nAnd then: **we have a moral duty to care for their well-being and pass on our biological legacy in good order to future generations.** Two obligations sitting in one line — one facing sideways to the other species alive with us now, one facing forward to the humans not yet born. **Well-being** and **legacy**.\n\nThe cleanest test in the exam hall is a single question: **who benefits in this sentence?** If the answer is *us* — in any form, an object we take or a service we enjoy — it is utilitarian, narrow or broad. If the answer is *nobody, and we should do it anyway* — it is ethical. The ethical argument is the only one of the three that survives if you delete humanity from the sentence.\n\nSo: three reasons to hold on to biodiversity. **Next comes the part that decides whether we actually do** — *in situ* and *ex situ* conservation, the two ways we put these arguments to work on the ground.",
    },
    // ── 9 · Comparison card ───────────────────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'Narrowly Utilitarian vs Broadly Utilitarian vs Ethical',
      columns: [
        {
          heading: 'Narrowly Utilitarian',
          points: [
            'The **obvious** arguments — humans derive **countless direct economic benefits** from nature',
            '**Food** — cereals, pulses, fruits',
            '**Firewood**, **fibre**, **construction material**',
            '**Industrial products** — tannins, lubricants, dyes, resins, perfumes',
            '**Products of medicinal importance** — more than **25 per cent of drugs sold in the market worldwide are derived from plants**; **25,000 species of plants** contribute to traditional medicines used by native peoples',
            '**Bioprospecting** — exploring molecular, genetic and species-level diversity for products of economic importance; **nations rich in biodiversity can reap enormous benefits**',
            'Test: something physical **leaves nature and reaches a human hand**',
          ],
        },
        {
          heading: 'Broadly Utilitarian',
          points: [
            'Biodiversity plays a major role in the many **ecosystem services** nature provides',
            '**Oxygen** — the fast-dwindling **Amazon forest** produces, **through photosynthesis, 20 per cent of the total oxygen** in the earth’s atmosphere',
            '**Pollination** — without it plants cannot give us **fruits or seeds**; provided through **pollinators: bees, bumblebees, birds and bats**',
            '**Intangible benefits** — the **aesthetic pleasures** of walking through thick woods, watching spring flowers in full bloom, waking up to a **bulbul’s song** in the morning',
            'NCERT’s framing question throughout: **can we put an economic value / price tag on this?** (the hospital **oxygen cylinder**)',
            'Test: nature **performs a service**; we hold no object, but we would miss it at once',
          ],
        },
        {
          heading: 'Ethical',
          points: [
            'Relates to **what we owe** to the millions of **plant, animal and microbe species** with whom we share this planet',
            '**Philosophically or spiritually**, every species has an **intrinsic value**',
            '… **even if it may not be of current or any economic value to us**',
            'We have a **moral duty to care for their well-being**',
            'And to **pass on our biological legacy in good order to future generations**',
            'No numbers, no products, no services — nothing here is measured in money',
            'Test: **nobody benefits, and we should do it anyway**',
          ],
        },
      ],
    },
    // ── 10 · Reasoning prompt ─────────────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: 'A farmer says: “If the bees disappear from my orchard, my trees will not set fruit at all, and I will have to pay labourers to pollinate every flower by hand.” Under which of NCERT’s three categories does this reason for conserving biodiversity fall, and why?',
      options: [
        'Broadly utilitarian, because pollination is an ecosystem service the bees perform, and the argument turns on the cost of accomplishing it without natural pollinators',
        'Narrowly utilitarian, because fruit is food, and food is the very first direct economic benefit NCERT lists under the narrow arguments',
        'Ethical, because the farmer is recognising that the bees have an intrinsic value in his orchard that money cannot replace',
        'Narrowly utilitarian, because the bees are being bioprospected for a product of economic importance that the farmer then sells',
      ],
      correct_index: 0,
      reveal: 'This is **broadly utilitarian**. NCERT files **pollination** — “without which plants cannot give us fruits or seeds” — among the **ecosystem services** nature provides through its **pollinators: bees, bumblebees, birds and bats**, and asks exactly the farmer’s question: **what will be the costs of accomplishing pollination without help from natural pollinators?** The second option is the trap almost everyone falls into: it is true that fruit is food and that food heads NCERT’s narrow list, but look at what the ecosystem is actually giving here. Not the fruit — the **act of pollination**. The bee hands the farmer no object; it performs a service, and that service is what would have to be bought back. The ethical option fails the one-second test — the farmer is talking about **his** loss, and anything *we* derive is utilitarian, never ethical. And bioprospecting is the wrong term entirely: it means exploring molecular, genetic and species-level diversity for products of economic importance, not employing a pollinator.',
      difficulty_level: 2,
    },
    // ── 11 · Remember ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'Lock These Down',
      markdown: "**The three categories, in NCERT’s order:** **narrowly utilitarian**, **broadly utilitarian**, **ethical**. Many reasons — “some obvious and others not so obvious, but **all equally important**.” Three, not two, and none ranks above the others.\n\n**One signature example each — the fastest way to recall the whole section:**\n- **Narrowly utilitarian** → **more than 25 per cent of drugs sold in the market worldwide are derived from plants**\n- **Broadly utilitarian** → the **Amazon forest produces 20 per cent of the earth’s total atmospheric oxygen through photosynthesis**\n- **Ethical** → **every species has an intrinsic value, even if it may not be of current or any economic value to us**\n\n**The two ‘25’ figures — keep them apart:** **25 per cent** = share of **drugs currently sold in the market** derived from plants. **25,000** = **species of plants** contributing to **traditional medicines** used by native peoples around the world.\n\n**The narrow list, verbatim:** food (cereals, pulses, fruits), firewood, fibre, construction material, industrial products (**tannins, lubricants, dyes, resins, perfumes**), products of medicinal importance.\n\n**Bioprospecting:** exploring **molecular, genetic and species-level** diversity for **products of economic importance**. Nations **endowed with rich biodiversity can expect to reap enormous benefits**.\n\n**The four pollinators:** **bees, bumblebees, birds and bats.** Pollination is what plants need before they can give us **fruits or seeds**.\n\n**Aesthetic pleasures are broadly utilitarian, not ethical:** thick woods, spring flowers in full bloom, a **bulbul’s song** in the morning. We derive them → utilitarian.\n\n**The ethical line, word for word:** we owe something to the millions of **plant, animal and microbe** species we share the planet with; every species has an **intrinsic value**; we have a **moral duty to care for their well-being** and to **pass on our biological legacy in good order to future generations**.",
    },
    // ── 12 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'What NEET Actually Lifts From This Section',
      markdown: "**The classify-the-reason question:** this section exists in NEET almost entirely as “which category does *this* reason belong to?” Run the one-second test. Do we **take an object**? Narrow. Does nature **do a job** for us? Broad. Does **nobody benefit and we should still do it**? Ethical.\n\n**Aesthetic pleasure → broadly utilitarian:** the single most reliable trap on this page. A bulbul’s song and spring flowers feel spiritual, and “ethical” also feels spiritual, so the wrong option writes itself. But NCERT puts them under **intangible benefits we derive from nature** — inside the broadly utilitarian paragraph. If *we* enjoy it, it is utilitarian.\n\n**Pollination → broadly utilitarian, even though fruit is food:** the ecosystem supplies the **service**, not the fruit. Any option filing pollination under narrow is banking on you seeing the word “fruits” and stopping there.\n\n**The 20 vs 25 swap:** **20 per cent** = the **Amazon’s share of atmospheric oxygen**. **25 per cent** = **drugs sold in the market derived from plants**. Options that swap these two numbers, or attach 20 per cent to the drugs, are standard issue.\n\n**Bioprospecting — all three levels:** the definition is **molecular, genetic and species-level** diversity. An option that says only “species-level” is incomplete and wrong.\n\n**‘Even if it may not be of current or any economic value’:** this exact clause is the fingerprint of the **ethical** argument. Spot it and the answer is decided before you finish reading the option.\n\n**Classic NEET question:** “The fast-dwindling Amazon forest producing 20 per cent of the earth’s total oxygen through photosynthesis is an argument of which type for conserving biodiversity?” → **Broadly utilitarian** — it is an **ecosystem service** provided by nature, not a direct economic product taken from it.",
    },
    // ── 13 · Inline quiz (last) ───────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: '“Waking up to a bulbul’s song in the morning” is offered by NCERT as an argument for conserving biodiversity. Which category does it belong to?',
          options: [
            'Ethical, because it recognises that the bulbul has an intrinsic value quite apart from any economic value to us',
            'Broadly utilitarian, because it is one of the intangible benefits we derive from nature, alongside thick woods and spring flowers',
            'Narrowly utilitarian, because the bulbul is a direct economic benefit that humans derive from the natural world',
            'Ethical, because it expresses our moral duty to care for the well-being of the species we share the planet with',
          ],
          correct_index: 1,
          explanation: 'NCERT places the aesthetic pleasures — walking through thick woods, watching spring flowers in full bloom, waking up to a bulbul’s song — among the **other intangible benefits that we derive from nature**, inside the **broadly utilitarian** paragraph. The first option is the trap, and it is tempting because a birdsong feels like a spiritual argument rather than an economic one. But look at who benefits: **we** do. The sentence is about our pleasure, not the bulbul’s well-being or its intrinsic value — so it is utilitarian, and since nothing physical is taken from nature, it is the broad kind.',
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'Which pair of figures does NCERT give in the narrowly utilitarian argument?',
          options: [
            '20 per cent of drugs sold worldwide are derived from plants; 20,000 species of plants are used in traditional medicines',
            '25 per cent of the earth’s oxygen comes from the Amazon; 25,000 plant species are used in traditional medicines',
            'More than 25 per cent of drugs sold worldwide are derived from plants; 25,000 species of plants contribute to traditional medicines',
            'More than 25 per cent of plant species are medicinally useful; 25,000 drugs in the market are derived from plants',
          ],
          correct_index: 2,
          explanation: 'NCERT states that **more than 25 per cent of the drugs currently sold in the market worldwide are derived from plants**, and that **25,000 species of plants contribute to the traditional medicines used by native peoples around the world**. The last option is the standard inversion trap — it flips what each number counts, turning the 25 per cent into a share of *plant species* and the 25,000 into a count of *drugs*. Also note that the **20 per cent** figure belongs to the Amazon’s share of atmospheric oxygen in the **broadly utilitarian** paragraph, not to drugs at all.',
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'Which statement correctly defines bioprospecting as NCERT gives it?',
          options: [
            'Exploring molecular, genetic and species-level diversity for products of economic importance',
            'Surveying species-level diversity alone to estimate how many species remain to be described on Earth',
            'Protecting the whole ecosystem so that its biodiversity at all levels is conserved on site',
            'Assigning an economic value to the ecosystem services that a forest provides free of cost',
          ],
          correct_index: 0,
          explanation: '**Bioprospecting** is **exploring molecular, genetic and species-level diversity for products of economic importance** — all three levels, and the goal is economic products. The second option is the tempting one because it keeps the word “diversity” and the word “exploring”, but it truncates the definition to species level and swaps the purpose to counting species. Protecting the whole ecosystem on site is *in situ* conservation, and valuing free ecosystem services is the framing question of the broadly utilitarian argument — neither is bioprospecting.',
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'A conservationist argues that a small soil microbe of no known use to humans must still be protected, because it has worth in itself and we owe it to future generations to hand the planet on intact. Which category is this, and what marks it out?',
          options: [
            'Broadly utilitarian — the microbe must be performing some ecosystem service in the soil that we have not yet measured',
            'Narrowly utilitarian — the microbe is an undiscovered product of medicinal importance still waiting to be explored',
            'Broadly utilitarian — protecting the soil is an intangible benefit that we derive from a healthy natural environment',
            'Ethical — every species has an intrinsic value even if it is of no current or any economic value to us, and we have a moral duty towards it',
          ],
          correct_index: 3,
          explanation: 'This is the **ethical** argument, and its fingerprint is the exact NCERT clause: **every species has an intrinsic value, even if it may not be of current or any economic value to us**, plus the **moral duty to care for their well-being and pass on our biological legacy in good order to future generations** — note that NCERT explicitly includes **microbes** among the species we owe something to. The first option is the most tempting because it sounds scientific and generous, but it smuggles a benefit back in: the moment you justify the microbe by a service it renders us, the argument stops being ethical and becomes utilitarian. The whole point of the ethical case is that it holds even when the species does nothing for us at all.',
          difficulty_level: 3,
        },
      ],
    },
  ],
};
