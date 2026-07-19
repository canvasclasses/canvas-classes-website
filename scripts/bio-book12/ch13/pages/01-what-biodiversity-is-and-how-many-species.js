'use strict';
/**
 * Class 12 Biology — Chapter 13: Biodiversity and Conservation
 * Page 1 — What Biodiversity Is, and How Much of It There Is.
 *
 * Source of truth: NCERT Class 12 Ch.13 (lebo113.txt), the chapter introduction
 * ("If an alien from a distant galaxy..."), §13.1 "Biodiversity" (Edward Wilson;
 * the three important levels — genetic, species, ecological) and §13.1.1 "How Many
 * Species are there on Earth and How Many in India?" (IUCN 2004 figure of slightly
 * more than 1.5 million described; Robert May's estimate of about 7 million; the
 * proportions of major taxa in Figure 13.1; prokaryotes excluded; India's 2.4% land
 * area vs 8.1% species share; 12 mega diversity countries; ~45,000 plant species and
 * twice as many animals; the yet-to-be-discovered estimates of >1,00,000 plants and
 * >3,00,000 animals). Stops before §13.1.2 "Patterns of Biodiversity" — latitudinal
 * gradients and the species-area relationship are the next page.
 *
 * Rule 0: every number, name and example here traces to that text — Rauwolfia
 * vomitoria and reserpine, >50,000 rice strains, 1,000 mango varieties, Western vs
 * Eastern Ghats amphibians, India vs Norway ecosystems, 20,000 ants / 3,00,000
 * beetles / 28,000 fishes / 20,000 orchids, the ">70% animals, ≤22% plants,
 * insects >70% of animals" proportions, and the fungi-vs-vertebrates comparison.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'what-biodiversity-is-and-how-many-species',
  title: 'Biodiversity — What It Is & How Much of It There Is',
  subtitle: "Biodiversity is not just 'many species'. It is diversity stacked at three levels — genes, species and ecosystems. Here is what each level means, how many species we have actually counted, how many Robert May thinks are out there, and why a country with 2.4 per cent of the land holds 8.1 per cent of the life.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['ecology', 'biodiversity', 'levels-of-biodiversity', 'species-richness', 'mega-diversity-country', 'biodiversity-and-conservation'],
  glossary: [
    { term: 'biodiversity', definition: 'The combined diversity at all the levels of biological organisation — from macromolecules within cells right up to biomes. The term was popularised by the sociobiologist Edward Wilson.' },
    { term: 'genetic diversity', definition: 'The diversity a single species shows at the genetic level over its distributional range — for example the different strains of rice grown in India, or Rauwolfia vomitoria plants from different Himalayan ranges differing in the reserpine they produce.' },
    { term: 'species diversity', definition: 'Diversity measured at the species level — the number and variety of species in an area. The Western Ghats have a greater amphibian species diversity than the Eastern Ghats.' },
    { term: 'ecological diversity', definition: 'Diversity at the ecosystem level — the variety of ecosystem types in a region. India, with deserts, rain forests, mangroves, coral reefs, wetlands, estuaries and alpine meadows, has greater ecosystem diversity than a Scandinavian country like Norway.' },
    { term: 'mega diversity country', definition: 'One of the 12 countries of the world that hold a disproportionately large share of global species diversity. India is one of them: 2.4 per cent of the world’s land area, 8.1 per cent of the global species diversity.' },
    { term: 'species inventory', definition: 'The published record of all the species that have been discovered, described and named so far. Inventories are more complete for temperate countries than for tropical ones.' },
    { term: 'reserpine', definition: 'The active chemical produced by the medicinal plant Rauwolfia vomitoria. Its potency and concentration vary between plants growing in different Himalayan ranges — a textbook case of genetic diversity within one species.' },
  ],
  blocks: [
    {
      id: 'befbd363-d933-457f-9df0-73be86a12351',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A dense, layered tropical rain forest canopy at dawn, crowded with countless different plant forms',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A dense tropical rain forest seen from just inside the canopy at first light — dozens of visibly different tree crowns, epiphytes, hanging lianas, ferns and broad leaves layered on top of one another, receding into soft mist. Thin shafts of pale dawn light break through the leaves. Deep dark green and near-black tones (#0a0a0a base), painterly and atmospheric, naturalistic, shallow depth of field on the nearest fronds, an overwhelming sense of many different kinds of life packed into one frame. No text, no labels, no diagram elements, no animals in focus.",
    },
    {
      id: '98cd2615-53e9-4b66-93cd-a6d42f20cfb9',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'Out of Every 10 Animals on Earth, 7 Are Insects',
      markdown: "Picture every animal on this planet lined up — every fish, frog, snake, bird, tiger, whale, worm and beetle. Now count off ten of them at random. **Seven will be insects.**\n\nThat is not a figure of speech. Among animals, **insects are the most species-rich taxonomic group, making up more than 70 per cent of the total.** The numbers behind that are hard to hold in your head: there are more than **20,000 species of ants**, **3,00,000 species of beetles**, **28,000 species of fishes** and nearly **20,000 species of orchids**. Beetles alone outnumber fishes more than ten times over.\n\nAnd one more that catches people out: the number of **fungi** species in the world is **more than the combined total** of the species of **fishes, amphibians, reptiles and mammals**. Every backboned animal you can name, added together, still loses to moulds and mushrooms.\n\nHold on to that lopsidedness. It is the shape of life on Earth, and this page is about learning to read it.",
    },
    {
      id: '16e7da29-cfa4-439b-855e-f34ea2d29bb1',
      type: 'text',
      order: 2,
      markdown: "If an alien from a distant galaxy visited Earth, the first thing that would baffle him would probably be the **enormous diversity of life** he ran into. Ecologists and evolutionary biologists have been asking about it for a long time — why are there so many species? Did such great diversity exist throughout earth's history? How did this diversification come about? How do humans benefit from it?\n\nStart with the word itself, because students usually get it half-right. **Biodiversity** is the term **popularised by the sociobiologist Edward Wilson**. And here is the definition NCERT actually gives, which is wider than the one most people carry around:\n\n> **Biodiversity is the combined diversity at all the levels of biological organisation.**\n\nRead that again. In our biosphere, immense diversity (or **heterogeneity**) exists **not only at the species level** but at **all levels of biological organisation** — ranging from **macromolecules within cells** all the way up to **biomes**. So biodiversity is not a headcount of species. Species are just one rung on a ladder that runs from molecules to biomes.\n\nOf all those levels, NCERT picks out **three as the most important**. The next section takes them one by one.",
    },
    {
      id: 'eb03631f-b44b-46bc-96dd-88033636f34d',
      type: 'heading',
      order: 3,
      level: 2,
      text: 'The Three Levels — Genes, Species, Ecosystems',
      objective: 'By the end of this you can take any example NCERT throws at you and say instantly which of the three levels of biodiversity it belongs to, and why.',
    },
    {
      id: '6fd0ee77-f197-401a-85e7-2a4f638c58eb',
      type: 'text',
      order: 4,
      markdown: "The trick with these three levels is to ask one question: **what is being compared with what?** That single question sorts every example.\n\n**(i) Genetic diversity — one species, compared with itself.** A **single species might show high diversity at the genetic level over its distributional range**. Take the medicinal plant ***Rauwolfia vomitoria***, growing across **different Himalayan ranges**. It is the same species everywhere. But the plants are not identical: the genetic variation between them shows up in the **potency and concentration of the active chemical, reserpine**, that the plant produces. Same species, different genes, different chemistry.\n\nIndia's own farms make the point at scale. India has **more than 50,000 genetically different strains of rice**, and **1,000 varieties of mango**. Every one of those is rice; every one of those is mango. The diversity is sitting *inside* the species.\n\n**(ii) Species diversity — one species compared with another.** This is diversity **at the species level**: how many different species an area holds. NCERT's example is a comparison you should be able to quote in your sleep — the **Western Ghats have a greater amphibian species diversity than the Eastern Ghats**. Both are hill ranges in India, both have frogs and toads; the Western Ghats simply have more *kinds*.\n\n**(iii) Ecological diversity — one ecosystem compared with another.** Now zoom out past the species to the **ecosystem level**. **India** has **deserts, rain forests, mangroves, coral reefs, wetlands, estuaries and alpine meadows** — seven wholly different theatres of life inside one country. So India has a **greater ecosystem diversity than a Scandinavian country like Norway**. It is not that Norway is empty; it is that Norway does not offer that many *types* of ecosystem.\n\nA memory hook for the sequence and the examples: **R-W-N** — **R**auwolfia (genetic), **W**estern Ghats (species), **N**orway (ecological). If the example names one species being compared with itself, it is genetic; if it compares kinds of organisms in a place, it is species; if it compares kinds of *places*, it is ecological.\n\nAnd there is a warning buried in this section. It has taken **millions of years of evolution** to accumulate this rich diversity — but we could **lose all that wealth in less than two centuries** if the present rates of species losses continue.",
    },
    {
      id: '742ef50a-f40d-484d-878e-4c45eab5bccf',
      type: 'interactive_image',
      order: 5,
      src: '',
      alt: 'Diagram of the three levels of biodiversity — genetic diversity in rice and Rauwolfia, species diversity in Western Ghats amphibians, and ecosystem diversity across India',
      caption: '📸 Tap each dot to explore the three levels of biodiversity and the NCERT example that defines each one',
      generation_prompt: "Scientific textbook illustration of the three levels of biodiversity, arranged as three clearly separated horizontal bands stacked one above the other. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. TOP BAND, labelled 'GENETIC DIVERSITY': a row of four rice plants (green) drawn side by side, each with a slightly different panicle shape and grain colour to show variation within one species, and beside them two specimens of the medicinal shrub Rauwolfia vomitoria (green leaves, small white flowers, red berries), one drawn taller with denser foliage than the other, with a small white outlined chemical-structure hexagon icon above each of different size to suggest differing concentration of reserpine. MIDDLE BAND, labelled 'SPECIES DIVERSITY': a row of five distinctly different amphibians — a tree frog, a toad, a bush frog, a caecilian and a torrent frog — each drawn in outline with muted pink-brown and green functional tints, clearly different species, set against a faint outlined hill-range silhouette. BOTTOM BAND, labelled 'ECOLOGICAL DIVERSITY': one continuous strip showing seven miniature ecosystem vignettes side by side in outline — desert (dunes, tan), rain forest (layered green canopy), mangrove (stilt roots in blue water), coral reef (branching corals under blue water), wetland (reeds and blue open water), estuary (river meeting sea, blue), and alpine meadow (grass and low peaks, green and white). Functional colours only: green for living or photosynthetic tissue, pink or magenta for animal soft tissue, brown or tan for dead, dry or woody material, blue for water. Each band separated by a thin white horizontal rule. No photorealism, no cartoon, no mascots, no 3D effects, no drop shadows, standard biology textbook illustration conventions.",
      hotspots: [
        { id: 'fb37d9a0-4b3c-486b-bc63-6d4032f8c7b8', x: 0.24, y: 0.18, label: 'Genetic diversity — India’s rice and mango', detail: 'A **single species** showing high diversity **at the genetic level** over its distributional range. India has **more than 50,000 genetically different strains of rice** and **1,000 varieties of mango** — all one species each, all genetically different.', icon: 'circle' },
        { id: '17269f59-7484-4780-9d48-221dd926ee83', x: 0.74, y: 0.18, label: 'Genetic diversity — Rauwolfia and reserpine', detail: 'The medicinal plant ***Rauwolfia vomitoria*** grows in **different Himalayan ranges**. The genetic variation between those plants shows up as differences in the **potency and concentration of reserpine**, the active chemical it produces.', icon: 'circle' },
        { id: 'c693b855-abd0-48e6-bf2e-11fae88bc199', x: 0.5, y: 0.5, label: 'Species diversity — Western vs Eastern Ghats', detail: 'Diversity **at the species level** — how many different kinds of organism an area holds. NCERT’s example: the **Western Ghats have a greater amphibian species diversity than the Eastern Ghats**.', icon: 'circle' },
        { id: '076eaba2-31b9-4e82-a526-e28cf26d7c55', x: 0.2, y: 0.82, label: 'Ecological diversity — India’s seven ecosystems', detail: 'Diversity **at the ecosystem level**. India has **deserts, rain forests, mangroves, coral reefs, wetlands, estuaries and alpine meadows** — different *kinds of places*, not just different species.', icon: 'circle' },
        { id: '6deb8fd3-5642-482c-8266-262c87eb6314', x: 0.8, y: 0.82, label: 'Ecological diversity — why India beats Norway', detail: 'Because of that spread of ecosystem types, **India has a greater ecosystem diversity than a Scandinavian country like Norway**. The comparison is between *types of ecosystem*, which is what makes it ecological and not species diversity.', icon: 'circle' },
      ],
    },
    {
      id: '9eac1266-8f60-42e9-ae19-20bb73c83633',
      type: 'heading',
      order: 6,
      level: 2,
      text: 'How Many Species Are There — On Earth, and in India?',
      objective: "By the end of this you can state how many species have actually been recorded, what Robert May's estimate is, and explain how India can hold 8.1 per cent of the world's species on 2.4 per cent of its land.",
    },
    {
      id: 'f711dec4-8248-4876-b22f-caaac4362ba6',
      type: 'text',
      order: 7,
      markdown: "There are **published records** of every species discovered and named, so we know how many have been **recorded**. Knowing how many actually **exist** is a different problem altogether.\n\n**What we have counted.** According to the **International Union for Conservation of Nature and Natural Resources (IUCN), 2004**, the total number of plant and animal species **described so far is slightly more than 1.5 million**. That number is solid — it is a library catalogue.\n\n**What is out there.** Estimates vary widely and many are **only educated guesses**. Some **extreme estimates range from 20 to 50 million**. The one you must know is the **more conservative and scientifically sound estimate made by Robert May**, which places **global species diversity at about 7 million**.\n\nHow does anyone reach a number like that? Not by counting. **Species inventories are more complete in temperate than in tropical countries**, and an overwhelmingly large proportion of the species still waiting to be discovered are **in the tropics**. So biologists take an **exhaustively studied group of insects**, make a **statistical comparison of its temperate-tropical species richness**, and **extrapolate that ratio** to other groups of animals and plants. It is a ratio scaled up — which is exactly why it is an estimate and not a count.\n\n**The shape of the catalogue.** Of all the species recorded, **more than 70 per cent are animals**, while **plants — including algae, fungi, bryophytes, gymnosperms and angiosperms — comprise no more than 22 per cent** of the total. Among the animals, **insects make up more than 70 per cent**. That is the *7 out of every 10 animals* line from the top of this page. **Figure 13.1** in your textbook draws this as proportionate species numbers of the major taxa.\n\n**One large gap.** These estimates give **no figures for prokaryotes**. Biologists are simply not sure how many prokaryotic species there might be, because **conventional taxonomic methods are not suitable for identifying microbial species** and many species are **not culturable under laboratory conditions**. If we accept **biochemical or molecular criteria** for delineating species in this group, **their diversity alone might run into millions**.\n\n**Now India.** India has only **2.4 per cent of the world's land area**. Its share of the global species diversity is an impressive **8.1 per cent** — more than three times its share of the land. That is what makes our country **one of the 12 mega diversity countries of the world**. Nearly **45,000 species of plants** and **twice as many animals** (that is about 90,000) have been recorded from India.\n\nAnd the recording is nowhere near done. If we accept May's global estimate of 7 million, then **only 22 per cent of the total species have been recorded so far**. Apply that same proportion to India's figures and you get the estimate that India probably holds **more than 1,00,000 plant species** and **more than 3,00,000 animal species** still **waiting to be discovered and named**.\n\nThink about what finishing that job would take — the trained taxonomists, the years. And a large fraction of those species face the threat of **becoming extinct even before we discover them**. As NCERT puts it, **nature's biological library is burning even before we catalogued the titles of all the books stocked there.**",
    },
    {
      id: 'c0ba8b33-0be2-41e2-a363-eedd1a095528',
      type: 'table',
      order: 8,
      caption: 'The numbers NCERT expects you to have at your fingertips — global first, then India.',
      headers: ['Scale', 'What is being measured', 'The number', 'Source / catch'],
      rows: [
        ['Global', 'Plant and animal species described so far', 'Slightly more than 1.5 million', 'IUCN (2004) — a record, not an estimate'],
        ['Global', 'Estimated total species diversity', 'About 7 million', "Robert May's conservative, scientifically sound estimate (extreme estimates run 20–50 million)"],
        ['Global', 'Share of recorded species that are animals', 'More than 70 per cent', 'Plants (algae, fungi, bryophytes, gymnosperms, angiosperms) are no more than 22 per cent'],
        ['Global', 'Share of animals that are insects', 'More than 70 per cent', '7 out of every 10 animals; fungi species outnumber fishes + amphibians + reptiles + mammals combined'],
        ['Global', 'Prokaryotic species', 'No figure given', 'Microbes are not identifiable by conventional taxonomy and many are not culturable; molecular criteria could push it into millions'],
        ['India', 'Share of world land area vs share of global species diversity', '2.4 per cent land, 8.1 per cent species', 'This mismatch is why India is one of the 12 mega diversity countries'],
        ['India', 'Species recorded so far', '~45,000 plants; twice as many animals', 'Only about 22 per cent of the total is recorded, if May’s estimate holds'],
        ['India', 'Species still to be discovered', '>1,00,000 plants; >3,00,000 animals', 'Obtained by applying the 22 per cent proportion to India’s figures'],
      ],
    },
    {
      id: 'a8c9a65a-b80c-40fd-bcad-a48c335ebd0f',
      type: 'reasoning_prompt',
      order: 9,
      reasoning_type: 'logical',
      prompt: "A researcher reports that Rauwolfia vomitoria plants collected from four different Himalayan ranges differ in the potency and concentration of the reserpine they produce. Which level of biodiversity does this observation demonstrate, and what is the reason?",
      options: [
        'Species diversity, because four different populations are being compared with one another across four ranges',
        'Ecological diversity, because the four Himalayan ranges are four different habitats supporting the plant',
        'Genetic diversity, because a single species is showing variation over its distributional range',
        'It demonstrates none of the three levels, because a chemical is being compared rather than the organisms themselves',
      ],
      reveal: "This is **genetic diversity**: NCERT defines it as **a single species showing high diversity at the genetic level over its distributional range**, and that is exactly the situation — one species, *Rauwolfia vomitoria*, varying from range to range. The tempting wrong answer is **ecological diversity**, because the word *Himalayan ranges* makes it sound like habitats are the subject. But ecological diversity compares **types of ecosystem** — deserts against rain forests against coral reefs, India against Norway. Here the ranges are only where the plants were collected; what varies is the plants' genes. **Species diversity** is wrong for a related reason: it needs *different species* to be compared, like the amphibians of the Western Ghats against those of the Eastern Ghats — here there is only ever one species. And the last option misreads the evidence: **reserpine is the read-out, not the subject** — the varying potency and concentration is how the underlying genetic variation makes itself visible.",
      difficulty_level: 2,
    },
    {
      id: '14ee6072-d4ad-44bc-8cc8-f128e0ccddbb',
      type: 'callout',
      order: 10,
      variant: 'remember',
      title: 'The Non-Negotiables',
      markdown: "- **Biodiversity** = **the combined diversity at all the levels of biological organisation**, from **macromolecules within cells** to **biomes**. Term **popularised by Edward Wilson**, a **sociobiologist**.\n- **The three most important levels, in order:**\n  - **Genetic diversity** — one species varying over its range. *Rauwolfia vomitoria* / **reserpine** potency across Himalayan ranges; India's **>50,000 rice strains** and **1,000 mango varieties**.\n  - **Species diversity** — **Western Ghats > Eastern Ghats** in amphibian species diversity.\n  - **Ecological diversity** — **India > Norway**, because India has **deserts, rain forests, mangroves, coral reefs, wetlands, estuaries and alpine meadows**.\n- **Recorded vs estimated:** **slightly more than 1.5 million** species described (**IUCN, 2004**) against **Robert May's estimate of about 7 million**. So only about **22 per cent** has been recorded.\n- **The proportions:** animals **> 70 per cent** of recorded species; plants **no more than 22 per cent**; insects **> 70 per cent** of animals (**7 of every 10 animals**); **fungi species > fishes + amphibians + reptiles + mammals combined**. **Prokaryotes are not in these figures at all.**\n- **India:** **2.4 per cent of the land, 8.1 per cent of the species** → one of the **12 mega diversity countries**. **~45,000 plant species** and **twice as many animal species** recorded; **>1,00,000 plant** and **>3,00,000 animal** species still to be discovered.\n- **Millions of years** built this diversity; **less than two centuries** could lose it at present rates of species loss.",
    },
    {
      id: 'e820a38a-b8ae-44af-a64d-0ee43c5bec2e',
      type: 'callout',
      order: 11,
      variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Edward Wilson popularised — he did not coin or define.** NCERT says the term was **popularised by the sociobiologist Edward Wilson**. Papers swap his name with Robert May's, so pin them apart: **Wilson → the word biodiversity**; **May → the estimate of about 7 million species**. Wilson is a **sociobiologist**; that adjective has been asked.\n\n**The three levels get their examples swapped.** This is the single most productive trap in §13.1. Lock the pairings: **Rauwolfia / reserpine and rice strains → genetic**; **Western Ghats vs Eastern Ghats amphibians → species**; **India vs Norway → ecological**. Note that both the Ghats example and the Norway example involve places — the difference is whether you are counting *species* or *types of ecosystem*.\n\n**1.5 million vs 7 million.** The number **described so far** is **slightly more than 1.5 million (IUCN, 2004)**. The number **estimated** is **about 7 million (Robert May)**. Options routinely present 1.5 million as the estimate or 7 million as the count. Also remember **20–50 million** is quoted as the *extreme* estimates, which NCERT does not endorse.\n\n**The percentages are asked as a set.** Animals **>70%** of all recorded species, plants **≤22%**, insects **>70%** *of animals*. Watch that last one — the trap is to offer '70 per cent of all species are insects', which is false; the 70 per cent for insects is measured **within animals**.\n\n**2.4 and 8.1 are never inverted in the answer key, only in the options.** **Land = 2.4 per cent, species = 8.1 per cent.** The species share is the bigger one — that is the entire point, and it is why India is one of the **12** mega diversity countries.\n\n**Classic NEET question:** \"India has more than 50,000 genetically different strains of rice and 1,000 varieties of mango. This is an example of which level of biodiversity?\" → **Genetic diversity** (a single species showing high diversity at the genetic level over its distributional range).",
    },
    {
      id: '48587594-d125-44fc-8516-c23f0daa9b2e',
      type: 'inline_quiz',
      order: 12,
      pass_threshold: 0.67,
      questions: [
        {
          id: 'cef82d4a-ea36-4cd7-b1d7-d2dfefc94798',
          question: 'India, with its deserts, rain forests, mangroves, coral reefs, wetlands, estuaries and alpine meadows, has a greater diversity than a Scandinavian country like Norway. This statement illustrates:',
          options: [
            'Genetic diversity, since the same species occurs across all seven of these Indian habitats',
            'Species diversity, since India holds a larger number of species than Norway does',
            'Ecological diversity, since the comparison is between the numbers of ecosystem types in the two countries',
            'Latitudinal diversity, since India lies closer to the equator than Norway does',
          ],
          correct_index: 2,
          explanation: "Deserts, rain forests, mangroves, coral reefs, wetlands, estuaries and alpine meadows are seven different **ecosystem types**, so comparing India with Norway on that list is diversity at the **ecosystem level** — ecological diversity. The most tempting distractor is species diversity, because India does hold more species; but this particular sentence counts *kinds of places*, not kinds of organisms, and NCERT files it under ecological diversity. Genetic diversity would require one species varying across its range, and 'latitudinal diversity' is not one of the three levels NCERT names here.",
          difficulty_level: 1,
        },
        {
          id: '06c55d0b-6c99-427a-b0fb-aa8c93ac68f9',
          question: 'Which pairing of a worker with his contribution to the study of biodiversity is correct?',
          options: [
            'Edward Wilson — popularised the term biodiversity; Robert May — estimated global species diversity at about 7 million',
            'Robert May — popularised the term biodiversity; Edward Wilson — estimated global species diversity at about 7 million',
            'Edward Wilson — recorded the 1.5 million described species for IUCN; Robert May — named the 12 mega diversity countries',
            'Robert May — described the three levels of biodiversity; Edward Wilson — extrapolated insect ratios from the tropics',
          ],
          correct_index: 0,
          explanation: "The **sociobiologist Edward Wilson popularised the term biodiversity**, and **Robert May** made the conservative, scientifically sound estimate placing global species diversity at **about 7 million**. Option 2 is the classic swap and is the one most students fall for, because both names sit within a few paragraphs of each other. The 1.5 million figure belongs to **IUCN (2004)**, not to Wilson, and the extrapolation of temperate-tropical insect ratios is the method behind May's estimate, not a separate credit to Wilson.",
          difficulty_level: 2,
        },
        {
          id: '169c9347-b14b-4be4-a05d-43af501164d2',
          question: 'Which statement about the proportions of earth’s recorded biodiversity is correct?',
          options: [
            'Insects make up more than 70 per cent of all recorded species on earth, animals included',
            'Plants make up more than 70 per cent of recorded species, while animals comprise no more than 22 per cent',
            'Prokaryotic species are included in these figures and account for the millions still unrecorded',
            'Animals are more than 70 per cent of recorded species, and insects are more than 70 per cent of those animals',
          ],
          correct_index: 3,
          explanation: "More than **70 per cent of all recorded species are animals**, and within the animals, **insects are more than 70 per cent** — which is where the line 'out of every 10 animals, 7 are insects' comes from. The favourite trap is the first option, which quietly promotes the insect figure from *70 per cent of animals* to *70 per cent of everything*. The second option inverts the two groups: plants, including algae, fungi, bryophytes, gymnosperms and angiosperms, are **no more than 22 per cent**. And prokaryotes are explicitly **not** given any figure, because conventional taxonomy cannot identify microbial species and many are not culturable.",
          difficulty_level: 3,
        },
        {
          id: 'a4bf9906-459d-4f00-91d7-4b3b5a188368',
          question: 'Why is India counted among the 12 mega diversity countries of the world?',
          options: [
            'Because it holds 8.1 per cent of the global species diversity on only 2.4 per cent of the world’s land area',
            'Because it holds 2.4 per cent of the global species diversity on only 8.1 per cent of the world’s land area',
            'Because nearly 45,000 species of plants and twice as many animals are still waiting to be discovered here',
            'Because about 22 per cent of the world’s total species have already been recorded from within its borders',
          ],
          correct_index: 0,
          explanation: "India's land share is **2.4 per cent** while its share of global species diversity is an impressive **8.1 per cent** — that mismatch, more life than land, is exactly what earns it a place among the 12 mega diversity countries. Option 2 is the same two numbers inverted, which is how this is most often mis-set in an exam. Option 3 confuses what has been recorded with what is left: **45,000 plants and twice as many animals have already been recorded**, whereas the ones still to be found are estimated at **more than 1,00,000 plants and 3,00,000 animals**. Option 4 misplaces the 22 per cent — that is the fraction of the *world's* species recorded so far globally, on May's estimate, not a figure recorded from India.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
