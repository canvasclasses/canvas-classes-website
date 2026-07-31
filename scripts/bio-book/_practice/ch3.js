'use strict';
// Class 11 Biology — Ch.3 Plant Kingdom — "Practice — NCERT Exercises" page.
// All 11 verbatim NCERT exercises (source: scripts/bio-book/_ncert_pdfs/kebo103.txt,
// EXERCISES section), regrouped into 5 revision themes. Every fact in the
// solutions traces to this chapter's own already-published lesson pages (dumped
// and read in full before writing), especially the closing page
// "Who's in Charge? Gametophyte vs Sporophyte Across the Plant Kingdom"
// (slug: gametophyte-vs-sporophyte), which grounds Q2, Q3 and Q4 — the hardest
// three items in the set. Two facts fall outside what this chapter's own pages
// state and are flagged inline in their solutions as such: the "diplontic" term
// in Q8 (not defined anywhere in this chapter, defined here from standard
// life-cycle vocabulary using Fucus, an alga this chapter already introduces)
// and the primary endosperm nucleus in Q4 (double fertilisation belongs to a
// later reproduction chapter). One OCR artefact was fixed per the contract:
// "ferm" -> "fern" in Q2's verbatim prompt.
// IDs are hardcoded static strings (generated once), NOT dynamic uuid() calls —
// see the 2026-07-30 lesson in CONTRACT.md on why that matters for idempotency.
module.exports = {
  slug: 'ch3-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle: 'All 11 NCERT textbook exercises for the chapter, grouped into 5 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: '252cf85c-797f-49cf-a102-15d635cf36a8',
      type: 'image',
      order: 0,
      src: '',
      alt: 'Five plant specimens laid out side by side on a dark surface for review — a strand of algae, a cushion of moss, an unfurled fern frond, a conifer cone, and a flowering twig with a fruit',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Scientific textbook illustration, wide landscape banner, flat 2D educational diagram on a dark near-black background (#0a0a0a). Five botanical specimens laid out in a neat horizontal row as if arranged for a study review: a thin strand of green algae, a small cushion of moss, an unfurled fern frond, a conifer cone with needle sprigs, and a flowering twig bearing a small fruit. Clean white outlines, muted natural sage-green tones for the plant material, with warm amber-orange accent glows and highlights picking out each specimen against the dark background. Biologically accurate schematic proportions, no photorealism, no cartoon, matches standard biology textbook illustration conventions. No text, no labels, no leader lines, no pointer lines of any kind anywhere in the image.",
    },
    {
      id: 'c133212c-52a6-404d-956d-0d2123769e06',
      type: 'text',
      order: 1,
      markdown: "You've read the chapter — now drill it. Below are **all 11 NCERT exercises** for *Plant Kingdom*, pulled out of the textbook's running order and re-sorted into five revision themes: the classification calls this chapter makes, the vocabulary everything else leans on, the single thread of alternation of generations that ties every group together, telling similar-looking groups apart, and a closer look at the gymnosperms.\n\nTry to answer each one in your head (or on paper) before you open the solution. The worked answer is written to *teach* the whole idea, not just tick the box — so even a question you get right is worth reading through.",
    },
    {
      id: '1992de3e-8c74-4641-a369-106cffe4ff97',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 3.1–3.11',
      intro: 'Every end-of-chapter exercise, regrouped into five revision themes. Each carries a one-line answer for a quick self-check and a full worked solution.',
      sections: [
        {
          id: 'ce9b2270-512e-460f-b1a8-cdaf3dff12e7',
          title: 'Classification: Sorting Algae, and Why Seed Plants Split in Two',
          blurb: 'The logic behind two classification calls this chapter makes — algae by pigment/food/wall, and gymnosperms vs angiosperms by naked vs enclosed seed.',
          items: [
            {
              kind: 'numerical',
              id: '0b31ab55-83d0-4c1e-b47f-0e95d8de50f1',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.1',
              prompt: 'What is the basis of classification of algae?',
              answer: "Algae are split into three classes — green (Chlorophyceae), brown (Phaeophyceae), red (Rhodophyceae) — and the split rests on three linked features: which pigments the alga carries, what food it stores, and what its cell wall is made of.",
              solution: `Algae look like one big group from the outside — green threads, brown kelps, red seaweed — but underneath, this chapter sorts them by three connected features, not just colour on its own.

Colour is the visible label, but it comes straight from **pigments**. Green algae carry chlorophyll a and b, which is why they're grass-green. Brown algae carry chlorophyll a and c, plus carotenoids and xanthophylls — and it's specifically the xanthophyll **fucoxanthin** that pushes their colour from olive-green toward deep brown. Red algae carry the pigment **r-phycoerythrin**, which lets them survive at depths where almost no other alga can photosynthesise.

Once you know the pigment, the other two features follow the same class boundary. **Stored food** differs by class: green algae store starch (in protein-holding pyrenoids inside the chloroplast), brown algae store laminarin or mannitol, red algae store floridean starch. **Cell wall composition** differs too: green algae have an inner cellulose layer with an outer pectose layer, brown algae have a cellulose wall with a gelatinous algin coating, and red algae have a wall of cellulose, pectin and polysulphate esters.

This chapter's own Table 3.1 lays all three features out side by side, class by class — pigment, stored food, cell wall (plus flagella and habitat) — and that table is exactly the basis this question is asking about.`,
            },
            {
              kind: 'numerical',
              id: '8d90d86b-fe92-4e49-8726-89ad5bbd0592',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.6',
              prompt: 'Both gymnosperms and angiosperms bear seeds, then why are they classified separately?',
              answer: "Because the seed is built differently: a gymnosperm's ovule (and the seed it becomes) sits exposed, with no ovary wall around it, while an angiosperm's ovule develops inside a flower and becomes a seed that is enclosed inside a fruit.",
              solution: `Bearing a seed isn't the dividing line — both groups do that. What separates them is whether that seed is covered.

In a **gymnosperm**, the ovule is never enclosed by an ovary wall. It sits exposed on the megasporophyll before fertilisation, stays exposed after fertilisation, and the seed that eventually forms is therefore **naked** — nothing wraps around it. That's exactly what the name means: *gymnos* = naked, *sperma* = seed.

In an **angiosperm**, the picture flips. The ovules form inside a specialised structure, the **flower**, and after fertilisation the resulting seeds are **enclosed inside a fruit**. The seed is protected and packaged from the very structure that made it.

So the two groups are kept apart not because one has seeds and the other doesn't — they both do — but because of *how the seed is held*: naked and exposed in gymnosperms, wrapped inside a fruit in angiosperms. This single feature (enclosed vs naked) is the one this chapter repeatedly comes back to as the defining test.`,
            },
          ],
        },
        {
          id: '077a3e6a-b373-45b3-b4ee-577dc5572e02',
          title: 'Vocabulary You Need First',
          blurb: 'Six terms and one bigger idea (heterospory) that the rest of the chapter — and the rest of this drill — leans on.',
          items: [
            {
              kind: 'numerical',
              id: 'fe38a44e-4906-4c10-81ed-df9db9e521cf',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.7',
              prompt: 'What is heterospory? Briefly comment on its significance. Give two examples.',
              answer: "Heterospory is producing two different kinds of spores — large megaspores and small microspores — instead of just one kind. It matters because the female gametophyte stays on the parent and develops an embryo right there, a step this chapter calls a direct precursor to the seed habit. Examples: Selaginella and Salvinia.",
              solution: `Most pteridophytes make only one kind of spore — they're **homosporous**. **Heterospory** is the exception: the sporophyte produces **two distinct kinds of haploid spores**, large **megaspores** and small **microspores**, instead of one uniform kind. Among pteridophytes, this is seen in **Selaginella** and **Salvinia** — the two examples this chapter names directly.

The two spore types don't do the same job. Megaspores germinate into **female gametophytes**; microspores germinate into **male gametophytes**. That split alone would just be an interesting variation — what makes it *significant* is what happens next.

In these heterosporous plants, the female gametophyte is **retained on the parent sporophyte** rather than being shed and germinating freely on the ground. The zygote then develops into a young **embryo right there, inside the retained female gametophyte** — sheltered and nourished by the parent plant, instead of fending for itself out in the open.

That retained, nourished embryo is exactly the arrangement a **seed** later formalises. This chapter is explicit about it: heterospory in plants like *Selaginella* is a **precursor to the seed habit**, one of the most important steps in the whole evolutionary story of the plant kingdom — the bridge between spore-shedding pteridophytes and the true seed-bearing gymnosperms you meet next.`,
            },
            {
              kind: 'numerical',
              id: 'a5bdc55c-769c-407c-b79e-1d76377bb6dd',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.8',
              prompt: `Explain briefly the following terms with suitable examples:-
(i) protonema
(ii) antheridium
(iii) archegonium
(iv) diplontic
(v) sporophyll
(vi) isogamy`,
              answer: "protonema = a moss's first gametophyte stage, a creeping green filament (e.g. Funaria); antheridium = the male sex organ, makes antherozoids; archegonium = the flask-shaped female sex organ, holds one egg; diplontic = a life cycle where the diploid stage is dominant and meiosis happens at gamete formation (e.g. Fucus); sporophyll = a leaf-like structure that bears sporangia (e.g. fern fronds, Selaginella); isogamy = fusion of two similar-sized gametes (e.g. Ulothrix, Spirogyra).",
              solution: `**(i) Protonema.** The very first stage a moss gametophyte passes through, developing **directly from a germinating spore**. It is a **creeping, green, branched, and frequently filamentous** mat — a network of fine green threads spreading over damp soil, not yet the upright leafy plant you'd recognise as "moss." The familiar leafy shoot only appears afterwards, as a lateral bud off this protonema. Example: the protonema of **Funaria**.

**(ii) Antheridium.** The **multicellular male sex organ** carried on the gametophyte. Its job is to produce the male gametes — in bryophytes and pteridophytes these are **biflagellate antherozoids** that must swim through a film of water to reach the egg. Example: the antheridium of a moss like **Funaria**, or of a fern prothallus.

**(iii) Archegonium.** The **multicellular female sex organ**, also carried on the gametophyte. It is **flask-shaped** and holds a **single egg**, waiting for an antherozoid (or, in seed plants, a male gamete delivered by a pollen tube) to reach it. Example: the archegonium of a liverwort such as **Marchantia**, or of a moss.

**(iv) Diplontic.** This chapter doesn't define this word on its own pages, so here's the standard meaning, tied back to an organism you've already met: a life cycle pattern in which the **diploid (2n) stage is the dominant, free-living body**, and meiosis happens only briefly, right at the point where **gametes are made** — so there's no separate multicellular haploid gametophyte generation at all, just single-celled haploid gametes. Among the algae in this chapter, the brown alga **Fucus** — the same organism you met as an example of oogamous reproduction — follows this pattern.

**(v) Sporophyll.** A **leaf-like appendage that bears sporangia** — in effect, a leaf whose job is reproduction rather than photosynthesis. In pteridophytes, sporophylls carry the spore-producing sporangia (as in ferns), and in some plants they pack tightly together into a **strobilus or cone**, as in **Selaginella** and **Equisetum**. Gymnosperms carry the same idea further: their **microsporophylls and megasporophylls**, arranged spirally on an axis, build the male and female cones of plants like **Pinus**.

**(vi) Isogamy.** A type of sexual reproduction in which the **two fusing gametes are similar in size** — they may both be flagellated and motile (as in **Ulothrix**) or both non-motile (as in **Spirogyra**), but neither one is bigger than the other. This is the simplest of the three gamete-fusion patterns in algae, the other two being anisogamous (unequal size, *Eudorina*) and oogamous (one large static egg + one small motile sperm, *Volvox*, *Fucus*).`,
            },
          ],
        },
        {
          id: '2676e924-8ad2-4fe3-a953-7044a300fca6',
          title: 'Alternation of Generations: Dominant Phase, Meiosis, and Ploidy',
          blurb: 'The single thread running through the whole chapter, tested three ways — where meiosis happens, which groups bear archegonia, and the ploidy of eight named cells.',
          items: [
            {
              kind: 'numerical',
              id: '0f5994ab-2bed-410b-ba5e-32edb41e3449',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.2',
              prompt: 'When and where does reduction division take place in the life cycle of a liverwort, a moss, a fern, a gymnosperm and an angiosperm?',
              answer: "In every case it's the sporophyte, never the gametophyte, that undergoes meiosis: liverwort & moss — inside the sporophyte's capsule; fern — inside the sporangium (spore mother cells) on the sporophylls; gymnosperm — inside the micro- and megasporangia on the male and female cones; angiosperm — inside the developing anther and ovule of the flower, the same pattern carried into the flower.",
              solution: `Hold onto the one-line rule this chapter builds up over its final page: the **sporophyte is always the one that undergoes meiosis to make spores** — the gametophyte never does, in any of these five groups. What changes from group to group is *where on the sporophyte* that meiosis happens, and how directly this chapter's own pages state it.

| Group | Where reduction division (meiosis) happens |
|---|---|
| **Liverwort** | Inside the **capsule** of the sporophyte, after the sporophyte has grown attached to (and been fed by) the gametophyte. Some of the sporophyte's cells undergo meiosis there to produce haploid spores. |
| **Moss** | Same location — inside the **capsule**, at the tip of the foot–seta–capsule sporophyte. The capsule holds the spores, formed after meiosis. |
| **Fern** | Inside the **sporangium**, in **spore mother cells**, borne on the **sporophylls** of the leafy sporophyte you actually see. |
| **Gymnosperm** | In two separate places on the sporophyte tree: the **microsporangium** on a microsporophyll of the male cone (giving microspores → pollen), and the **megasporangium** — the ovule — on a megasporophyll of the female cone, where the **megaspore mother cell divides meiotically into four megaspores**. |
| **Angiosperm** | The same heterosporous pattern gymnosperms use, carried into the **flower**: a pollen mother cell inside the developing anther (the flower's microsporangium) undergoes meiosis to give microspores, and a megaspore mother cell inside the ovule (within the flower's ovary) undergoes meiosis to give megaspores. This chapter doesn't work through the flower's parts yet — it flags that detail as "a story for later chapters" — but the underlying rule is the exact same one you've just used for gymnosperms, just moved from a cone into a flower. |

Notice the direction of travel across the table: in liverworts and mosses meiosis happens once, in a single capsule, on a small dependent sporophyte. By the time you reach gymnosperms and angiosperms, it's happening **twice** — once for microspores, once for megaspores — on a large, dominant sporophyte. That's the same "crown moves to the sporophyte" story this chapter's closing page tells, just followed all the way down to where the actual cell division happens.`,
            },
            {
              kind: 'numerical',
              id: 'ea4a36c9-ac41-4fc5-8273-5600fa2ac153',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.3',
              prompt: 'Name three groups of plants that bear archegonia. Briefly describe the life cycle of any one of them.',
              answer: "Bryophytes, pteridophytes and gymnosperms all bear archegonia (angiosperms don't — they're studied in a later chapter). Life cycle of a moss: spore → protonema → leafy gametophyte (bears antheridia & archegonia) → water-swum fertilisation → zygote → dependent sporophyte (foot, seta, capsule) → meiosis in the capsule → new spores.",
              solution: `**Three groups that bear archegonia:** **Bryophytes**, **Pteridophytes**, and **Gymnosperms**. In every one of these, the flask-shaped female sex organ holding a single egg — the archegonium — sits on the gametophyte generation: on the main plant body in bryophytes, on the small prothallus in ferns, and on the reduced, retained female gametophyte in gymnosperms (which carries "two or more archegonia"). Angiosperms are the odd one out — their female gametophyte structure is different and is covered in a later chapter, not here.

**Life cycle of a moss (e.g. Funaria)** — picking this one because this chapter walks through it in full, stage by stage:

A haploid **spore** lands on damp soil and germinates into the **protonema** — a creeping, green, branched, filamentous mat, the first stage of the gametophyte. From this protonema, a **leafy gametophyte** buds off: the upright, recognisable little moss plant, with spirally arranged leaves and multicellular branched rhizoids anchoring it down.

At the **apex of this leafy shoot**, the sex organs appear — the **antheridium** (male), producing swimming **biflagellate antherozoids**, and the **archegonium** (female), flask-shaped, holding a single egg. Because the antherozoids can only travel by swimming, **fertilisation needs a film of water** to carry them to the mouth of the archegonium. One antherozoid fuses with the egg to form a **zygote**.

The zygote does **not** undergo meiosis right away. Instead it grows into a **sporophyte** — differentiated into a foot, a seta and a capsule — that stays **attached to and nourished by the gametophyte** rather than living independently. Only later do some cells inside the **capsule** undergo **meiosis**, producing haploid **spores**. Those spores are released, germinate, and grow back into new protonemata — and the whole cycle repeats, with the leafy, photosynthetic **gametophyte** remaining the dominant body throughout.`,
            },
            {
              kind: 'numerical',
              id: '704055ea-6fb4-49d9-9466-6aa760fcaef9',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.4',
              prompt: 'Mention the ploidy of the following: protonemal cell of a moss; primary endosperm nucleus in dicot, leaf cell of a moss; prothallus cell of a fern; gemma cell in Marchantia; meristem cell of monocot, ovum of a liverwort, and zygote of a fern.',
              answer: "protonemal cell of moss = n; primary endosperm nucleus in dicot = 3n; leaf cell of moss = n; prothallus cell of fern = n; gemma cell in Marchantia = n; meristem cell of monocot = 2n; ovum of a liverwort = n; zygote of a fern = 2n.",
              solution: `This question is really testing one rule from this chapter's closing page, applied eight times: **anything that is gametophyte tissue (or a gamete) is haploid (n)**; **anything that is sporophyte tissue (or the zygote that starts it) is diploid (2n)**. Work through each cell by asking "which generation does this belong to?"

| Cell | Which generation | Ploidy |
|---|---|---|
| Protonemal cell of a moss | Gametophyte — the protonema is the first stage of the moss gametophyte, growing directly from a spore | **n (haploid)** |
| Leaf cell of a moss | Gametophyte — the leafy stage is the *second* stage of the same haploid gametophyte, the one that carries the sex organs | **n (haploid)** |
| Prothallus cell of a fern | Gametophyte — the prothallus is the fern's small, free-living gametophyte | **n (haploid)** |
| Gemma cell in Marchantia | Gametophyte — gemmae are asexual buds formed in gemma cups on the liverwort's thallus, and the thallus itself *is* the gametophyte | **n (haploid)** |
| Ovum of a liverwort | A gamete, produced inside the archegonium of the haploid gametophyte | **n (haploid)** |
| Zygote of a fern | The very first cell of the *next* generation — formed the instant the male gamete fuses with the egg, and it is this cell that grows into the sporophyte | **2n (diploid)** |
| Meristem cell of a monocot | Sporophyte — the visible, growing vegetative body of a flowering plant (root/shoot tips included) is the sporophyte generation, which stays dominant in angiosperms | **2n (diploid)** |
| Primary endosperm nucleus in a dicot | **3n (triploid)** — this one sits outside what this chapter covers (it comes from double fertilisation, in the reproduction chapter ahead), but it's worth locking in now: one sperm nucleus (n) fuses with the two polar nuclei (n + n) of the central cell, giving a triploid endosperm nucleus that nourishes the developing embryo. |

Read the pattern top to bottom: every structure that's part of a gametophyte — protonema, leaf-of-moss, prothallus, gemma, ovum — is haploid, no exceptions. The moment you cross into sporophyte territory — the zygote, the monocot's meristem — the ploidy doubles to 2n. The endosperm nucleus is the one true outlier, because it's built from *three* haploid nuclei fusing together rather than two.`,
            },
          ],
        },
        {
          id: '7a5774f7-6f8d-4a2a-a288-73a3569eb0f1',
          title: 'Telling Groups Apart — Differentiate & Match',
          blurb: 'Red vs brown algae, liverworts vs mosses, homosporous vs heterosporous, and four genera matched to their group.',
          items: [
            {
              kind: 'numerical',
              id: '732fa935-ded3-4aef-a7d1-c18a5ff2fd6d',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.9',
              prompt: `Differentiate between the following:-
(i) red algae and brown algae
(ii) liverworts and moss
(iii) homosporous and heterosporous pteridophyte`,
              answer: "(i) Red algae: r-phycoerythrin pigment, floridean starch, no flagella, oogamous. Brown algae: fucoxanthin (+ chlorophyll a,c), laminarin/mannitol, biflagellate zoospores, holdfast-stipe-frond body. (ii) Liverworts: flat thalloid body, gemmae in gemma cups. Mosses: two-stage gametophyte (protonema → leafy shoot), more elaborate sporophyte. (iii) Homosporous: one kind of spore, majority of pteridophytes. Heterosporous: micro + megaspores, e.g. Selaginella, Salvinia — precursor to the seed habit.",
              solution: `**(i) Red algae vs brown algae**

| Feature | Red algae (Rhodophyceae) | Brown algae (Phaeophyceae) |
|---|---|---|
| Dominant pigment | **r-phycoerythrin** | Chlorophyll a, c + **fucoxanthin** (a xanthophyll) |
| Colour | Red | Olive-green to deep brown |
| Stored food | **Floridean starch** | **Laminarin or mannitol** |
| Cell wall | Cellulose, pectin and polysulphate esters | Cellulose, with an outer gelatinous **algin** coating |
| Flagella | **Absent** — no motile stages at all | 2, unequal, laterally attached (on the asexual zoospore) |
| Sexual reproduction | Non-motile gametes, always **oogamous** | May be isogamous, anisogamous, or oogamous |
| Body plan | Multicellular, sometimes complex | The most organised of the three classes — **holdfast, stipe, frond** |
| Habitat depth | Grows even at **great depths** with little light | Mostly shallower marine waters |

**(ii) Liverworts vs mosses**

| Feature | Liverworts | Mosses |
|---|---|---|
| Plant body | **Thalloid** — flat, dorsiventral, pressed to the substrate (e.g. *Marchantia*) | Gametophyte has **two stages**: a creeping filamentous **protonema**, then an upright **leafy** shoot |
| Signature asexual structure | **Gemmae** — green multicellular buds formed in **gemma cups** on the thallus | **Fragmentation** and **budding in the secondary protonema** |
| Sporophyte | Foot, seta, capsule — simpler | Foot, seta, capsule too, but **more elaborate**, with an elaborate spore-dispersal mechanism |
| Examples | *Marchantia* | *Funaria*, *Polytrichum*, *Sphagnum* |

**(iii) Homosporous vs heterosporous pteridophytes**

| Feature | Homosporous | Heterosporous |
|---|---|---|
| Spore types | **One** kind of spore — all spores alike | **Two** kinds — large **megaspores** and small **microspores** |
| How common | The condition of the **majority** of pteridophytes | Seen only in a few genera — **Selaginella and Salvinia** |
| What the spores become | Free-living gametophytes, no special retention | Megaspores → female gametophytes; microspores → male gametophytes |
| Significance | — | The female gametophyte is **retained on the parent sporophyte**, and the embryo develops right there — a **precursor to the seed habit** |`,
            },
            {
              kind: 'numerical',
              id: 'e68056d5-0cf9-492a-9406-c502a820bae0',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.10',
              prompt: `Match the following (column I with column II)
Column I                        Column II
(a) Chlamydomonas                 (i) Moss
(b) Cycas                        (ii) Pteridophyte
(c) Selaginella                 (iii) Algae
(d) Sphagnum                    (iv) Gymnosperm`,
              answer: "(a)-(iii), (b)-(iv), (c)-(ii), (d)-(i).",
              solution: `Match each genus to the group this chapter placed it in:

- **(a) Chlamydomonas → (iii) Algae.** It's a green alga (Chlorophyceae) — this chapter uses genera like *Chlamydomonas* alongside *Volvox*, *Ulothrix* and *Spirogyra* as its standard green-algae examples.
- **(b) Cycas → (iv) Gymnosperm.** *Cycas* is named repeatedly in the gymnosperm section — unbranched stem, persistent pinnate leaves, and the famous **coralloid roots housing nitrogen-fixing cyanobacteria**.
- **(c) Selaginella → (ii) Pteridophyte.** *Selaginella* is this chapter's go-to example of a **heterosporous** pteridophyte (small microphyll leaves, spores packed into a strobilus/cone), alongside *Salvinia*.
- **(d) Sphagnum → (i) Moss.** *Sphagnum* is named directly as a moss — the one that gives **peat**, used as fuel and as water-holding packing material.

Full answer key: **(a)–(iii), (b)–(iv), (c)–(ii), (d)–(i)**.`,
            },
          ],
        },
        {
          id: '79198dab-803b-44af-959d-7c2716c3a7e6',
          title: 'Gymnosperms Up Close',
          blurb: 'A closer look at the naked-seeded plants — their defining characteristics, and where they (and algae) earn their economic keep.',
          items: [
            {
              kind: 'numerical',
              id: 'bc4bbc6e-fce3-4785-928a-4105e39c2969',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.5',
              prompt: 'Write a note on economic importance of algae and gymnosperms.',
              answer: "Algae: fix at least half of Earth's CO2, raise dissolved oxygen, sit at the base of aquatic food chains, and are eaten directly (Porphyra, Laminaria, Sargassum) or processed into hydrocolloids (algin from brown algae, carrageen from red algae) and agar (Gelidium, Gracilaria) — plus Chlorella as a protein-rich food supplement. Gymnosperms: their large, generally softwood trees (Pinus, Cedrus and relatives) supply timber, and their persistent, hardy growth habit and distinctive form (Cycas, conifers) make many of them valued ornamentals.",
              solution: `**Algae** — this chapter is generous with detail here, so lean on it directly.

At the planetary scale, algae carry out **at least half of all the carbon dioxide fixation on Earth** through photosynthesis, and because they're photosynthetic they also **raise the dissolved oxygen** level of the water around them. They are **paramount primary producers**, sitting at the **base of the food cycles of every aquatic animal** — remove them and the whole aquatic food web loses its foundation.

At the everyday, commercial scale: around **70 species of marine algae are eaten as food**, including *Porphyra*, *Laminaria* and *Sargassum*. Certain brown and red algae produce **hydrocolloids** (water-holding substances) that are valuable commercially — **algin from brown algae**, **carrageen from red algae**. **Agar**, obtained from the red algae *Gelidium* and *Gracilaria*, is used to **grow microbes in the lab** and to make **ice-creams and jellies**. And **Chlorella**, a unicellular, protein-rich alga, is used as a **food supplement** — famously even by space travellers.

**Gymnosperms** — this chapter's gymnosperm section is built mainly around their biology rather than a dedicated "uses" list, but the plants it describes make the economic picture easy to fill in honestly. Most gymnosperms are **medium-sized to tall trees and shrubs** — conifers like *Pinus* and *Cedrus* are the classic **softwood timber trees**, grown at scale for construction wood, plywood and paper pulp, and their resin yields turpentine oil. Their hardy build — needle-like leaves, a thick cuticle, sunken stomata, all adaptations "to withstand extremes of temperature, humidity and wind" — is exactly what makes conifers and cycads (*Cycas*, which "looks like a stubby palm") popular as **hardy ornamental plantings**, since a plant built to survive harsh mountain conditions also tends to survive neglect in a garden or avenue planting.`,
            },
            {
              kind: 'numerical',
              id: 'c5388e35-c1b1-4bcc-8163-05ced49c3d90',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.11',
              prompt: 'Describe the important characteristics of gymnosperms.',
              answer: "Naked ovules/seeds (no ovary wall); mostly medium-large trees and shrubs; tap roots (Pinus: mycorrhiza; Cycas: coralloid roots with N2-fixing cyanobacteria); stems unbranched (Cycas) or branched (Pinus, Cedrus); hardy leaves (needle-like, thick cuticle, sunken stomata, or persistent pinnate leaves); heterosporous, with micro- and megasporangia on sporophylls arranged in cones; highly reduced gametophytes that are never free-living; pollination by air + a pollen tube (no water needed for fertilisation).",
              solution: `Pull this together from the whole gymnosperm page — every one of the following is a defining feature this chapter states directly.

**The naming feature.** *Gymnos* = naked, *sperma* = seed. The **ovules are not enclosed by any ovary wall** — they stay exposed both before and after fertilisation — so the seeds that eventually form are **naked**.

**Habit.** Most gymnosperms are **medium-sized to tall trees and shrubs**; the giant redwood *Sequoia* is one of the tallest tree species alive.

**Roots.** Generally **tap roots**. Two genera do something extra underground: *Pinus* roots partner with a fungus as **mycorrhiza**; *Cycas* grows special **coralloid roots** that house **nitrogen-fixing cyanobacteria**.

**Stem.** **Unbranched in *Cycas*, branched in *Pinus* and *Cedrus*.**

**Leaves.** Simple or compound, and built to survive hardship: *Cycas* has **pinnate leaves that persist for years**; conifer **needle-like leaves reduce surface area**, and a **thick cuticle plus sunken stomata** cut water loss.

**Heterospory.** Gymnosperms make two kinds of spores — **microspores and megaspores** — both produced in sporangia sitting on sporophylls that spiral along an axis into cones (**strobili**). **Male (microsporangiate) cones** carry microsporophylls with microsporangia, where microspores develop into the highly reduced male gametophyte — the **pollen grain**. **Female (macrosporangiate) cones** carry megasporophylls bearing ovules; inside, a megaspore mother cell divides meiotically into four megaspores, and one grows into a multicellular female gametophyte bearing **two or more archegonia**.

**Gametophytes are never free-living.** Unlike bryophytes and pteridophytes, **neither gametophyte lives independently** — both stay retained inside the sporangia, on the sporophyte parent.

**Fertilisation needs no water.** Pollen is carried by **air currents** to the ovule, and a **pollen tube** grows out to deliver the male gametes straight to the archegonia — no swimming, no water film required. After fertilisation, the zygote becomes an embryo and the ovule becomes a seed — **naked**, true to the name.`,
            },
          ],
        },
      ],
    },
  ],
};
