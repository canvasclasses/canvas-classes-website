// Class 12 Biology — Chapter 1: Sexual Reproduction in Flowering Plants
// "Practice — NCERT Exercises" page. 18 NCERT exercises, regrouped into 5 revision themes.
// Authored per scripts/bio-book12/_practice/CONTRACT.md. Not inserted to any DB here.

module.exports = {
  slug: 'ch1-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle: 'All 18 NCERT textbook exercises for the chapter, grouped into 5 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: 'e41df008-c8f3-482a-8741-271391d3966d',
      type: 'image',
      order: 0,
      src: '',
      alt: 'Cutaway of an angiosperm flower showing anther with pollen, ovule with embryo sac, and a pollen tube growing to the ovule',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: 'A hand-drawn coloured botanical illustration on a deep-charcoal (near-black) background, wide landscape banner. Left: a longitudinal cut of an angiosperm flower showing the anther with a dusting of pollen grains, and below it the pistil with stigma, style and a swollen ovary. Centre: a large clean cross-section of a single ovule labelled softly — integuments, micropyle, nucellus, and inside it the 7-celled embryo sac (egg apparatus, central cell with two polar nuclei, antipodals). Right: a pollen grain germinating a pollen tube travelling down toward the ovule, hinting at double fertilisation. Muted earthy palette — sage green, ochre, dusty rose, soft cream line-work. Textbook plate feeling, calm and precise. No glow, no neon, no orange, no 3D render, no text captions baked in.',
    },
    {
      id: 'b6639e13-68f8-4a76-8250-7baa08c92901',
      type: 'text',
      order: 1,
      markdown:
        "You've read the chapter — now drill it. Below are **all 18 NCERT exercises** for *Sexual Reproduction in Flowering Plants*, but pulled out of the textbook's running order and re-sorted into five revision themes: making the gametophytes, the ovule and embryo sac, pollination, fertilisation and the seed, and finally fruits and apomixis.\n\nTry to answer each one in your head (or on paper) before you open the solution. The worked answer is written to *teach* the whole idea, not just tick the box — so even a question you get right is worth reading through.",
    },
    {
      id: '304b624b-6eb0-4af5-bf23-2d39aa137b94',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 1.1–1.18',
      intro: 'Every end-of-chapter exercise, regrouped into five revision themes. Each carries a one-line answer for a quick self-check and a full worked solution.',
      sections: [
        {
          id: '398d6855-b22c-4f37-8a0d-f0efb7a759ae',
          title: 'Making the gametophytes — sporogenesis',
          blurb: 'Where and how the male and female gametophytes are built, and the wall-maker tapetum.',
          items: [
            {
              kind: 'numerical',
              id: 'b224f104-d662-4b83-9a0f-fdf6dc3810fe',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.1',
              prompt: 'Name the parts of an angiosperm flower in which development of male and female gametophyte take place.',
              answer: 'Male gametophyte (pollen grain) develops in the anther; female gametophyte (embryo sac) develops in the ovule.',
              solution:
                "The **male gametophyte** is the pollen grain. It develops inside the **anther** — precisely in the pollen sacs (**microsporangia**), where microspores are formed and then mature into pollen grains.\n\nThe **female gametophyte** is the embryo sac. It develops inside the **ovule** — within the **nucellus** (the megasporangium), from the single functional megaspore.\n\nSo, in one line: anther → male gametophyte, ovule → female gametophyte.",
            },
            {
              kind: 'numerical',
              id: '48e859d5-980c-4ab8-a0db-f3189a93dd06',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.2',
              prompt: 'Differentiate between microsporogenesis and megasporogenesis. Which type of cell division occurs during these events? Name the structures formed at the end of these two events.',
              answer: 'Both are meiotic. Microsporogenesis makes microspores (in the anther); megasporogenesis makes megaspores (in the ovule).',
              solution:
                "Both processes are the **making of spores by meiosis**, but one happens on the male side and the other on the female side.\n\n| Feature | Microsporogenesis | Megasporogenesis |\n|---|---|---|\n| Site | Microsporangium (pollen sac) of the **anther** | Nucellus of the **ovule** |\n| Starting cell | Pollen mother cell (microspore mother cell) | Megaspore mother cell (MMC) |\n| Product of meiosis | Four microspores, arranged as a **microspore tetrad** | Four megaspores in a **linear row** |\n| Fate of the products | Usually all four microspores separate and mature into pollen grains | Usually **three degenerate**; only one **functional megaspore** survives |\n\n**Type of cell division:** in *both* events the spores are formed by **meiosis** (a reduction division of the diploid mother cell).\n\n**Structures formed at the end:** microsporogenesis ends in **microspores** (which become pollen grains); megasporogenesis ends in **megaspores** (of which one functional megaspore goes on to form the embryo sac).",
            },
            {
              kind: 'numerical',
              id: 'd9936b33-2203-40fe-a24e-fc7b7c6f0074',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.3',
              prompt: 'Arrange the following terms in the correct developmental sequence:\n\nPollen grain, sporogenous tissue, microspore tetrad, pollen mother cell, male gametes.',
              answer: 'Sporogenous tissue → pollen mother cell → microspore tetrad → pollen grain → male gametes.',
              solution:
                "Follow the anther from the inside out, step by step:\n\n**Sporogenous tissue → Pollen mother cell → Microspore tetrad → Pollen grain → Male gametes**\n\n- The **sporogenous tissue** fills the young pollen sac.\n- Its cells enlarge into **pollen mother cells** (microspore mother cells).\n- Each pollen mother cell divides by **meiosis** to give a **microspore tetrad** — four microspores in a group.\n- The microspores separate and mature into **pollen grains**.\n- Inside the pollen grain, the generative cell divides to form the two **male gametes**.",
            },
            {
              kind: 'numerical',
              id: 'f8cbba1b-c696-4ee4-b91b-373bb7003ceb',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.17',
              prompt: 'Explain the role of tapetum in the formation of pollen-grain wall.',
              answer: 'The tapetum nourishes the developing microspores and supplies sporopollenin for the exine.',
              solution:
                "The **tapetum** is the innermost of the four wall layers of the anther, lining each microsporangium. It sits right next to the developing microspores, so it is the layer that feeds and finishes them.\n\nIts two key jobs:\n\n1. **Nourishment** — the tapetal cells are dense with cytoplasm and are the food supply for the developing pollen grains.\n2. **Wall material** — the tapetum provides **sporopollenin**, the extremely tough material that is laid down as the **exine** (the outer pollen-grain wall). Sporopollenin resists high temperature, strong acids and alkalis, and enzymes, which is why pollen (and the exine) is so well preserved.\n\nSo without a healthy tapetum, the microspores are neither properly nourished nor given the sporopollenin they need to build the exine.",
            },
          ],
        },
        {
          id: 'c03a582c-c924-4474-b800-1e201d916d5a',
          title: 'The ovule & the female gametophyte',
          blurb: 'The parts of the ovule, and how one megaspore builds the 7-celled embryo sac.',
          items: [
            {
              kind: 'numerical',
              id: '6880175f-c42d-4640-8d14-1eb83272cfc0',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.4',
              prompt: 'With a neat, labelled diagram, describe the parts of a typical angiosperm ovule.',
              answer: 'Ovule = funicle, hilum, integuments enclosing a micropyle, nucellus, chalaza, and the embryo sac inside.',
              solution:
                "The ovule (megasporangium) is a small body attached to the wall of the ovary. Your diagram should be a longitudinal section showing these parts (label each on the drawing):\n\n- **Funicle** — the stalk that attaches the ovule to the placenta of the ovary.\n- **Hilum** — the point where the funicle joins the body of the ovule.\n- **Integuments** — one or two protective coats that wrap the ovule, leaving a small opening.\n- **Micropyle** — that small opening at the tip of the integuments, usually near the funicle; the pollen tube enters here.\n- **Chalaza** — the basal region of the ovule, opposite the micropyle, where the integuments and nucellus meet.\n- **Nucellus** — the mass of nutritive tissue enclosed by the integuments; it holds and feeds the embryo sac.\n- **Embryo sac (female gametophyte)** — embedded in the nucellus, typically towards the micropylar end.\n\nSo, moving from outside in: funicle carries the ovule; integuments enclose it with a micropyle at one end and the chalaza at the other; inside sits the nucellus, and within the nucellus lies the embryo sac.",
            },
            {
              kind: 'numerical',
              id: 'bcdbb654-df87-4b9a-ab0b-6206ba670ccc',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.5',
              prompt: 'What is meant by monosporic development of female gametophyte?',
              answer: 'The embryo sac develops from a single functional megaspore.',
              solution:
                "When the megaspore mother cell divides by meiosis, it produces **four megaspores**. In most flowering plants, **three of these degenerate** and only **one** survives — the **functional megaspore**.\n\nThat single functional megaspore then divides mitotically to form the entire embryo sac.\n\nBecause the whole female gametophyte comes from just **one megaspore**, this pattern is called **monosporic development** ('mono' = one spore).",
            },
            {
              kind: 'numerical',
              id: 'e5c4da99-6d08-43b1-a938-409a701e8e28',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.6',
              prompt: 'With a neat diagram explain the 7-celled, 8-nucleate nature of the female gametophyte.',
              answer: '3 free-nuclear mitoses give 8 nuclei; these organise into 7 cells (the central cell keeps 2 polar nuclei), hence 8-nucleate but 7-celled.',
              solution:
                "Start from the **functional megaspore** and count carefully. It undergoes **three successive mitotic (free-nuclear) divisions**:\n\n- 1st division → 2 nuclei\n- 2nd division → 4 nuclei\n- 3rd division → **8 nuclei**\n\nThese 8 nuclei are not scattered randomly — four move to the micropylar end and four to the chalazal end, and then cell walls form to organise them (draw and label):\n\n- **Micropylar end:** an **egg apparatus** of **3 cells** — one **egg cell** flanked by two **synergids**.\n- **Chalazal end:** three **antipodal cells**.\n- **Centre:** one large **central cell** — into it move one nucleus from each end, the two **polar nuclei**.\n\nNow add it up: 3 (egg apparatus) + 3 (antipodals) + 1 (central cell) = **7 cells**. But the central cell holds **two** nuclei, so the total nuclei = 3 + 3 + 2 = **8 nuclei**.\n\nThat is why the mature embryo sac is described as **8-nucleate but 7-celled** — the central cell is the one cell that carries two nuclei.",
            },
          ],
        },
        {
          id: '162a0e41-8173-4ed9-9b97-c55194f6e6fe',
          title: 'Pollination & outbreeding devices',
          blurb: 'Flower types, the strategies that discourage selfing, and the breeder tools that control pollen.',
          items: [
            {
              kind: 'numerical',
              id: '65923405-d968-4235-aa67-40460fc3eb85',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.7',
              prompt: 'What are chasmogamous flowers? Can cross-pollination occur in cleistogamous flowers? Give reasons for your answer.',
              answer: 'Chasmogamous flowers open with exposed anthers and stigma. Cleistogamous flowers never open, so cross-pollination cannot occur — only self-pollination.',
              solution:
                "**Chasmogamous flowers** are the ordinary open flowers — they open up so that their anthers and stigma are **exposed** to the outside. Because they are open, both self- and cross-pollination are possible.\n\n**Cleistogamous flowers** are a special type that **never open at all**. The anthers and stigma stay shut inside the closed flower, lying close together.\n\n**Can cross-pollination occur in cleistogamous flowers? No.** Since the flower never opens, no pollen from another flower can reach its stigma, and its own pollen cannot escape. Pollen from the anthers falls directly on the stigma of the *same* closed flower, so only **self-pollination (autogamy)** happens. The advantage is that cleistogamous flowers set seed with **complete certainty**, even when there are no pollinators.",
            },
            {
              kind: 'numerical',
              id: '5c21ebc8-1860-45d3-824a-e8f65c1d632a',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.8',
              prompt: 'Mention two strategies evolved to prevent self-pollination in flowers.',
              answer: 'e.g. (i) anther and stigma mature at different times (or are placed apart), and (ii) self-incompatibility / unisexual flowers.',
              solution:
                "Plants have evolved several **outbreeding devices** to discourage self-pollination and encourage cross-pollination. Any two of these are correct:\n\n1. **Different timing of maturity** — the pollen is released either before or after the stigma of the same flower is receptive, so self-pollen can't land on a ready stigma.\n2. **Different positioning** — the anther and stigma are placed at different positions in the flower, so the pollen doesn't easily fall on its own stigma.\n3. **Self-incompatibility** — a genetic mechanism that prevents self-pollen from germinating or fertilising the ovules of the same flower.\n4. **Unisexual flowers** — making male and female flowers separate (as in the castor and maize, or dioecious plants) physically prevents self-pollination and self-fertilisation.\n\nMention any **two** of the above.",
            },
            {
              kind: 'numerical',
              id: '927b4d0e-2103-42ea-b842-c26bc5f3a8b1',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.9',
              prompt: 'What is self-incompatibility? Why does self-pollination not lead to seed formation in self-incompatible species?',
              answer: 'A genetic mechanism that blocks self-pollen from fertilising ovules; the pistil inhibits its own pollen, so no fertilisation and no seed.',
              solution:
                "**Self-incompatibility** is a **genetic mechanism** that prevents the pollen of a flower (or of a genetically similar plant) from fertilising the ovules of the *same* flower or plant.\n\n**Why no seed after self-pollination?** Even if self-pollen lands on the stigma, the pistil recognises it as 'self' and **inhibits it** — the pollen either fails to germinate, or the pollen tube's growth is stopped inside the pistil. So the male gamete never reaches the egg, **fertilisation does not happen**, and without fertilisation there can be no zygote and therefore **no seed**.",
            },
            {
              kind: 'numerical',
              id: 'd315a649-1fa8-42a0-89a3-4326df564d03',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.10',
              prompt: 'What is bagging technique? How is it useful in a plant breeding programme?',
              answer: 'Covering an emasculated flower with a bag to keep out unwanted pollen; it ensures only the chosen pollen fertilises it during hybridisation.',
              solution:
                "The **bagging technique** means covering an **emasculated flower** (a flower from which the anthers have been removed) with a **bag** — usually of butter paper — to stop pollen from any unwanted source landing on its stigma.\n\n**How it helps a breeder:** in artificial hybridisation, the breeder wants to control *exactly* which pollen reaches the female parent. After emasculating and bagging the flower, the breeder waits until the stigma becomes receptive, then dusts it with **pollen collected from the desired male parent** and bags it again.\n\nSo bagging **protects the stigma from contamination by stray pollen**, guaranteeing that the seed produced comes only from the intended cross — which is exactly what a controlled breeding programme needs.",
            },
            {
              kind: 'numerical',
              id: '04d3bbae-3e83-424d-ab0b-ad9928c6956e',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.15',
              prompt: 'What is meant by emasculation? When and why does a plant breeder employ this technique?',
              answer: 'Removing the anthers from a bisexual flower bud before they dehisce, to prevent self-pollination during artificial hybridisation.',
              solution:
                "**Emasculation** is the **removal of the anthers** from a bisexual flower **before the anthers dehisce** (before they shed pollen), using a pair of forceps. It is done on the flower chosen as the **female parent**.\n\n**When:** at the **flower-bud stage**, before the anthers mature and release pollen.\n\n**Why:** when the female parent bears **bisexual flowers**, its own anthers could self-pollinate the stigma and spoil the cross. By removing the anthers first, the breeder makes sure the flower **cannot self-pollinate**, so that only the deliberately chosen pollen (added later) fertilises it. Emasculated flowers are then bagged to keep them safe until pollinated.",
            },
          ],
        },
        {
          id: '6a6b9934-cbd2-420e-a122-ee13dfbe94a4',
          title: 'Fertilisation, endosperm & the seed',
          blurb: 'Triple fusion, the waiting zygote, and telling apart the parts of seed and seedling.',
          items: [
            {
              kind: 'numerical',
              id: '4aa2b2a9-111e-4848-a57c-667f458ae26e',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.11',
              prompt: 'What is triple fusion? Where and how does it take place? Name the nuclei involved in triple fusion.',
              answer: 'One male gamete fuses with the two polar nuclei in the central cell to form the 3n primary endosperm nucleus.',
              solution:
                "**Triple fusion** is the fusion of **one male gamete with the two polar nuclei** of the central cell. Since three nuclei come together, it is called *triple* fusion.\n\n**Where:** it takes place in the **central cell** of the **embryo sac**.\n\n**How:** after a pollen tube discharges its two male gametes into the embryo sac, one male gamete fuses with the egg (that's syngamy). The **second male gamete** moves to the central cell and fuses with the **two polar nuclei** there. Because a male gamete fuses with two polar nuclei, the product is **triploid (3n)** — the **primary endosperm nucleus (PEN)**, which develops into the nutritive endosperm.\n\n**Nuclei involved:** one **male gamete nucleus** + the **two polar nuclei** (of the central cell).\n\n(Together with syngamy, this is why the whole event is called **double fertilisation** — two fusions happen inside one embryo sac.)",
            },
            {
              kind: 'numerical',
              id: 'e7622d8a-6c3f-41de-bd6a-adc3036b4279',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.12',
              prompt: 'Why do you think the zygote is dormant for sometime in a fertilised ovule?',
              answer: 'It waits for the endosperm to form first, so that nourishment is ready before the embryo starts developing.',
              solution:
                "After double fertilisation there are two products in the ovule — the **zygote** and the **primary endosperm cell**. In most flowering plants the **endosperm develops first**, and the zygote **stays dormant for a while** before it starts dividing.\n\nThe reason is **nourishment**. The endosperm is the food-supplying tissue of the seed. By waiting until some endosperm has already formed, the zygote makes sure that **assured nutrition is available** for the young embryo the moment it begins to grow. In short, the embryo doesn't start building itself until the kitchen (endosperm) is stocked.",
            },
            {
              kind: 'numerical',
              id: '005b43d8-3729-48d6-9538-8705fdca8a77',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.13',
              prompt: 'Differentiate between:\n(a) hypocotyl and epicotyl;\n(b) coleoptile and coleorrhiza;\n(c) integument and testa;\n(d) perisperm and pericarp.',
              answer: 'Hypocotyl = below cotyledon (to radicle); epicotyl = above cotyledon (to plumule). Coleoptile sheaths the plumule; coleorrhiza sheaths the radicle. Integument = ovule coat; testa = seed coat (its mature form). Perisperm = leftover nucellus; pericarp = fruit wall from the ovary.',
              solution:
                "**(a) Hypocotyl vs Epicotyl**\n\n| Hypocotyl | Epicotyl |\n|---|---|\n| Portion of the embryonal axis **below** the level of the cotyledons | Portion of the embryonal axis **above** the level of the cotyledons |\n| Ends in the **radicle** (future root) | Ends in the **plumule** (future shoot) |\n\n**(b) Coleoptile vs Coleorrhiza** (in a grass/monocot seed)\n\n| Coleoptile | Coleorrhiza |\n|---|---|\n| Protective sheath covering the **plumule** (shoot tip) | Undifferentiated sheath covering the **radicle** (root tip) |\n| Present at the **upper** end of the axis | Present at the **lower** end of the axis |\n\n**(c) Integument vs Testa**\n\n| Integument | Testa |\n|---|---|\n| Protective covering of the **ovule** (before fertilisation) | The outer **seed coat**, formed from the integument **after fertilisation** |\n| Belongs to the ovule stage | Belongs to the mature seed stage |\n\n**(d) Perisperm vs Pericarp**\n\n| Perisperm | Pericarp |\n|---|---|\n| **Residual, persistent nucellus** left in some seeds | The **wall of the fruit**, developed from the **ovary wall** |\n| Part of the **seed** | Part of the **fruit** |",
            },
          ],
        },
        {
          id: 'b5ff5f6a-b624-4a33-a8bd-9f3a4ce57509',
          title: 'Fruits, parthenocarpy & apomixis',
          blurb: 'True vs false fruits, seedless fruits, and seeds made without fertilisation.',
          items: [
            {
              kind: 'numerical',
              id: 'd320f304-305e-44b6-9ca0-1210f63d214e',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.14',
              prompt: 'Why is apple called a false fruit? Which part(s) of the flower forms the fruit?',
              answer: 'Because its fleshy edible part comes from the thalamus, not the ovary. In apple, the thalamus forms the fleshy fruit.',
              solution:
                "In a **true fruit**, the fruit develops only from the **ovary** of the flower. In some plants, though, another floral part joins in and becomes part of the fruit — such a fruit is a **false fruit**.\n\n**Apple is a false fruit** because its main fleshy, edible portion develops from the **thalamus** (the receptacle) and *not* from the ovary. The ovary itself forms only the central core.\n\n**Which part forms the fruit in apple:** the **thalamus** grows and becomes the fleshy fruit (with the ovary contributing the core). Because a part *other than the ovary* forms the fruit, apple is classed as a false fruit.",
            },
            {
              kind: 'numerical',
              id: 'ea8cc313-2208-4845-a44d-f47cbdf3656f',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.16',
              prompt: 'If one can induce parthenocarpy through the application of growth substances, which fruits would you select to induce parthenocarpy and why?',
              answer: 'Fruits eaten for their fleshy part where seeds are a nuisance — e.g. banana, grapes, watermelon, orange — because seedlessness raises their value.',
              solution:
                "**Parthenocarpy** is the development of a fruit **without fertilisation**, so the fruit is **seedless**. If we can trigger it with growth substances, we should apply it to fruits where **seeds are unwanted** and the fleshy part is what we actually eat.\n\nGood choices: **banana, grapes, watermelon, orange, guava** — juicy, fleshy fruits eaten fresh, where seeds are only a nuisance to the consumer.\n\n**Why these:** making them **seedless** improves their eating quality and market value — no hard seeds to remove or spit out — while the edible flesh (pericarp/thalamus) still develops fully. It makes little sense to induce parthenocarpy in crops grown *for* their seeds (like pulses or cereals), because there the seed is the product.",
            },
            {
              kind: 'numerical',
              id: '947686e4-1345-452a-8b15-abdbc715686e',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.18',
              prompt: 'What is apomixis and what is its importance?',
              answer: 'Formation of seeds without fertilisation (an asexual mode that mimics sexual reproduction); it lets hybrid vigour be preserved cheaply, year after year.',
              solution:
                "**Apomixis** is the formation of **seeds without fertilisation**. It is a form of **asexual reproduction that mimics sexual reproduction** — a seed is still produced, but no fusion of gametes takes place. (For example, in some species the diploid egg cell or a nucellar cell develops into an embryo without being fertilised.)\n\n**Importance:**\n\n- **Preserves hybrid vigour.** Normally, if hybrid seeds are re-sown, the useful characters get scrambled by segregation and the vigour is lost after one generation. Since apomictic seeds are genetically identical to the parent, **hybrid characters are kept unchanged** generation after generation.\n- **Cheaper and simpler seed production.** Farmers can keep using seed from their own hybrid plants without buying fresh hybrid seed every season, which cuts cost.\n- It also gives a quick, dependable way to multiply desirable genotypes.",
            },
          ],
        },
      ],
    },
  ],
};
