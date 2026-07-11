'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'pteridophytes-first-vascular',
  title: 'Pteridophytes: The First Vascular Plants',
  subtitle: "Ferns and horsetails were the first land plants to grow real plumbing — xylem and phloem — and the first to build a proper body with roots, stem and leaves. Here's how that changed everything, and the tiny prothallus that still ties them to water.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['pteridophytes', 'vascular-plants', 'plant-kingdom'],
  glossary: [
    { term: 'vascular tissue', definition: 'The conducting tissue of a plant — xylem carries water, phloem carries food. Pteridophytes are the first land plants to possess it.' },
    { term: 'sporophyll', definition: 'A leaf-like appendage that bears sporangia. In pteridophytes the sporangia sit on these sporophylls.' },
    { term: 'strobilus', definition: 'A compact cone-like structure formed when sporophylls cluster tightly together, as in Selaginella and Equisetum. Plural: strobili.' },
    { term: 'prothallus', definition: 'The small, free-living, mostly photosynthetic thalloid gametophyte of a pteridophyte, which grows from a germinating spore and bears the sex organs.' },
    { term: 'microphyll', definition: 'A small leaf, as found in Selaginella.' },
    { term: 'macrophyll', definition: 'A large leaf, as found in ferns.' },
    { term: 'homosporous', definition: 'Producing only one kind of spore, all of similar size. Most pteridophytes are homosporous.' },
    { term: 'heterosporous', definition: 'Producing two kinds of spores — large megaspores and small microspores — as in Selaginella and Salvinia.' },
    { term: 'sporangium', definition: 'A structure that produces spores by meiosis in spore mother cells. Plural: sporangia.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A shaded, damp forest floor at dusk with ferns unfurling and horsetails standing among wet rocks',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A cool, damp, shady forest floor at dusk: fern fronds unfurling in the foreground, tall jointed horsetails (Equisetum) standing among moss-covered wet rocks, water trickling over stone in the mid-ground, and a canopy filtering only a little dim light from above. A single soft warm glow breaks through the leaves near the top of the frame. Deep, moist, atmospheric, painterly illustration style, dark naturalistic background throughout (#0a0a0a base tones), no people, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The First Plants With Real Plumbing',
      markdown: "Mosses and liverworts had no way to pump water very far — they stayed low, small, and close to moisture. Then came the **pteridophytes** — ferns and horsetails — the **first terrestrial plants to possess vascular tissues**, xylem and phloem. That's the biological version of installing pipes. Water could now be lifted, food could be carried, and for the first time a land plant could stand up tall with a real root, stem and leaves. That single upgrade is why the plant world stopped hugging the ground.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The **pteridophytes** include **horsetails and ferns**. People use them for **medicinal purposes**, grow them as **soil-binders** to hold loose earth in place, and keep them as **ornamentals**. But their real importance is evolutionary: they are the **first terrestrial plants to possess vascular tissues — xylem and phloem** (you'll meet these tissues properly in the tissues chapter). You'll usually find them in **cool, damp, shady places**, though some manage well even in **sandy soil**.\n\nRecall that in **bryophytes** the dominant phase of the life cycle was the **gametophyte** — the green plant body you saw was the gametophyte. Pteridophytes flip this. Here the **main plant body is a sporophyte**, and it is **differentiated into a true root, stem and leaves**. These organs carry **well-differentiated vascular tissues**, which is exactly what lets the plant grow bigger and stand upright.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Sporophyte Takes Over',
      objective: "By the end of this you'll know why the leafy fern you see is the sporophyte, where its spores are made, and what a strobilus actually is.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "In a pteridophyte, the plant you actually see and recognise — the fern with its fronds, the horsetail with its jointed stem — is the **sporophyte**. Its leaves come in two sizes: **small leaves called microphylls**, as in **Selaginella**, or **large leaves called macrophylls**, as in **ferns**.\n\nThe sporophyte carries its reproductive machinery on its leaves. It bears **sporangia**, and these sporangia are **subtended by leaf-like appendages called sporophylls** — think of a sporophyll as a leaf whose job is to hold sporangia. In some plants these sporophylls pack tightly together into **compact structures called strobili or cones** — you see this in **Selaginella and Equisetum**. Inside each sporangium, **spores are produced by meiosis in spore mother cells**. Those spores are the starting point of the next generation.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A fern sporophyte with sori on the frond underside beside a small heart-shaped prothallus bearing sex organs',
      caption: '📸 Tap each dot to explore the two life stages of a fern — the big sporophyte and the tiny prothallus',
      generation_prompt: "Scientific textbook illustration of a fern life cycle, showing two stages side by side. Flat 2D educational diagram on a dark background (#0a0a0a near-black). On the left, a large fern sporophyte with a true root system, an upright stem, and a divided green frond (leaf); clusters of small round sporangia shown on the underside of a frond segment; a cutaway inset of the stem showing central conducting strands (xylem and phloem) as fine lines. On the right, drawn much smaller to show scale, a flat heart-shaped green prothallus (the gametophyte) lying on wet ground, with tiny rounded antheridia and flask-shaped archegonia on its underside and thin root-like rhizoids beneath. Clean white outlines, biologically accurate proportions, green for the living photosynthetic tissue, thin white leader lines but NO baked-in text labels. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.24, y: 0.45, label: 'Sporophyte', icon: 'circle',
          detail: 'The dominant, main plant body — the big leafy fern you recognise. It is differentiated into a **true root, stem and leaves**, all carrying vascular tissue.' },
        { id: uuid(), x: 0.30, y: 0.22, label: 'Sporangia on sporophylls', icon: 'circle',
          detail: 'Spore-making sacs borne on leaf-like **sporophylls**. Inside each, **spores are produced by meiosis** in spore mother cells.' },
        { id: uuid(), x: 0.14, y: 0.62, label: 'Xylem & phloem', icon: 'circle',
          detail: 'The **vascular tissue** — xylem for water, phloem for food. Pteridophytes are the **first land plants to have it**, which is why they can grow tall.' },
        { id: uuid(), x: 0.76, y: 0.50, label: 'Prothallus', icon: 'circle',
          detail: 'The **gametophyte** — small, multicellular, free-living and mostly photosynthetic. A spore germinates into this **thalloid prothallus**, which needs cool, damp, shady conditions.' },
        { id: uuid(), x: 0.80, y: 0.68, label: 'Antheridia & archegonia', icon: 'circle',
          detail: 'The sex organs on the prothallus — **antheridia** (male) and **archegonia** (female). **Water is required** to carry the antherozoids to the mouth of the archegonium.' },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "Pteridophytes finally grew vascular tissue and a true root, stem and leaves — a proper land-plant body. So why are living pteridophytes still restricted to cool, damp, shady corners rather than spreading everywhere the way flowering plants do?",
      options: [
        "Their vascular tissue is too weak to lift water more than a few centimetres, so they dry out in the open",
        "Their tiny prothallus needs cool, damp, shady conditions, and water is still needed to carry the male gametes to the archegonium — so reproduction ties them to moisture",
        "They cannot photosynthesise, so they can only survive in the shade where they don't need light",
        "Their spores are too heavy to travel, so they can never colonise new ground",
      ],
      reveal: "The sporophyte is a capable land plant, but the life cycle still has a wet link. The gametophyte — the **prothallus** — is small and delicate and grows only in cool, damp, shady places, and even then **water is required to transfer the antherozoids to the mouth of the archegonium** for fertilisation. Because of this specific restricted requirement plus the need for water at fertilisation, the spread of living pteridophytes stays limited to narrow regions. Their vascular tissue actually works fine (that's the whole upgrade), they are photosynthetic, and their spores do disperse — it's the water-dependent reproduction that holds them back.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Homosporous vs Heterosporous — a Preview of the Seed',
      objective: "By the end of this you'll see how a few pteridophytes making two kinds of spores quietly set up the biggest idea in plant evolution — the seed.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Once a spore lands in a suitable spot it germinates into an **inconspicuous, small but multicellular, free-living, mostly photosynthetic thalloid gametophyte called a prothallus**. This prothallus bears the **antheridia and archegonia** — the male and female sex organs. **Water is required** to move the antherozoids released from the antheridia to the mouth of the archegonium. When the male gamete fuses with the egg, a **zygote** forms, and the zygote grows into a **multicellular, well-differentiated sporophyte — the dominant phase** all over again.\n\nNow the spores themselves. In **most pteridophytes all the spores are alike** — these plants are **homosporous**. But a few genera, like **Selaginella and Salvinia**, produce **two kinds of spores: large megaspores and small microspores** — these are **heterosporous**. The **megaspores germinate into female gametophytes**, the **microspores into male gametophytes**. Here's the crucial twist: in these heterosporous plants the **female gametophytes are retained on the parent sporophyte**, and the **zygote develops into a young embryo right there, inside the female gametophyte**. A future generation, sheltered and fed on the parent plant — this event is a **precursor to the seed habit**, one of the most important steps in plant evolution.\n\nFinally, pteridophytes are sorted into **four classes: Psilopsida (Psilotum); Lycopsida (Selaginella, Lycopodium); Sphenopsida (Equisetum); and Pteropsida (Dryopteris, Pteris, Adiantum).**",
    },
    {
      id: uuid(), type: 'comparison_card', order: 9, title: 'Homosporous vs Heterosporous',
      columns: [
        { heading: 'Homosporous', points: [
          'Produces only ONE kind of spore — all spores similar',
          'True of the MAJORITY of pteridophytes',
          'Spores germinate into free-living gametophytes',
          'No special retention of the gametophyte on the parent',
        ] },
        { heading: 'Heterosporous', points: [
          'Produces TWO kinds of spores — large megaspores + small microspores',
          'Seen in Selaginella and Salvinia',
          'Megaspores → female gametophytes; microspores → male gametophytes',
          'Female gametophyte retained on the parent; embryo develops there — a PRECURSOR TO THE SEED HABIT',
        ] },
      ],
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: "The Facts You Cannot Get Wrong",
      markdown: "- Pteridophytes are the **first terrestrial plants with vascular tissue** (xylem + phloem).\n- The **sporophyte is the dominant, main plant body** — with a true root, stem and leaves (opposite of bryophytes).\n- The **prothallus is the gametophyte** — small, free-living, photosynthetic.\n- **Microphyll = Selaginella (small leaf); macrophyll = fern (large leaf).**\n- **Heterospory = Selaginella and Salvinia** → precursor to the seed habit.\n- **Four classes:** Psilopsida (*Psilotum*), Lycopsida (*Selaginella*, *Lycopodium*), Sphenopsida (*Equisetum*), Pteropsida (*Dryopteris*, *Pteris*, *Adiantum*).",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**First vascular plants:** Pteridophytes are the first land plants with xylem and phloem — a favourite one-liner.\n\n**Dominant phase:** In pteridophytes the **sporophyte** dominates and has a true root, stem and leaves; the gametophyte is the small prothallus. NEET loves swapping this with bryophytes (where the gametophyte dominates) — don't fall for it.\n\n**Prothallus needs water:** The prothallus grows in cool, damp, shady places and **water is required for fertilisation** — this is why pteridophytes stay geographically restricted.\n\n**Heterospory:** *Selaginella* and *Salvinia* are heterosporous, and the retained female gametophyte with an embryo is the **precursor to the seed habit**.\n\n**The four classes:** Remember Psilopsida / Lycopsida / Sphenopsida / Pteropsida with one example genus each.\n\n**Classic NEET question:** \"Which of the following is a heterosporous pteridophyte?\" → *Selaginella* (also *Salvinia*).",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Why are pteridophytes evolutionarily important compared with the bryophytes before them?',
          options: [
            'They were the first land plants to possess vascular tissues — xylem and phloem',
            'They were the first plants to produce flowers',
            'They were the first plants to live on land at all',
            'They were the first plants to carry out photosynthesis',
          ],
          correct_index: 0,
          explanation: "Pteridophytes are the first terrestrial plants with vascular tissue (xylem and phloem), which is why they could grow a true root, stem and leaves. Flowers come much later (angiosperms); bryophytes already lived on land before them; and photosynthesis is far older than any land plant.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'In a pteridophyte, which phase is the dominant, main plant body — and what is it differentiated into?',
          options: [
            'The gametophyte, differentiated into root, stem and leaves',
            'The sporophyte, differentiated into a true root, stem and leaves',
            'The prothallus, differentiated into antheridia and archegonia',
            'The gametophyte, which remains a simple undifferentiated thallus',
          ],
          correct_index: 1,
          explanation: "In pteridophytes the sporophyte is dominant and is differentiated into a true root, stem and leaves with vascular tissue. The gametophyte here is the small prothallus — this is the exact reverse of bryophytes, where the gametophyte dominates, which is the trap in the first option.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Selaginella and Salvinia produce large megaspores and small microspores. This condition is called:',
          options: ['Homosporous', 'Heterosporous', 'Monosporous', 'Isosporous'],
          correct_index: 1,
          explanation: "Producing two kinds of spores — megaspores and microspores — is heterospory, seen in Selaginella and Salvinia. Homosporous (and its synonym isosporous) means one kind of spore, which describes most other pteridophytes; 'monosporous' is not a category used here.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'In heterosporous pteridophytes, why is the retention of the female gametophyte on the parent sporophyte considered so significant?',
          options: [
            'It lets the plant survive without any water for fertilisation',
            'The embryo develops within the retained female gametophyte — a precursor to the seed habit',
            'It converts the sporophyte into the dominant phase for the first time',
            'It allows the plant to produce flowers and fruit',
          ],
          correct_index: 1,
          explanation: "The megaspore's female gametophyte stays on the parent, and the zygote develops into a young embryo inside it — sheltered and nourished on the parent plant. NCERT calls this a precursor to the seed habit, an important evolutionary step. Water is still needed for fertilisation, the sporophyte was already dominant in all pteridophytes, and flowers/fruit belong to the angiosperms much later.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};

// Bridge to the next page: pteridophytes hinted at the seed with a retained, protected
// embryo — the gymnosperms take that hint and run with it, bearing exposed "naked" seeds
// on the parent plant for the very first time.
