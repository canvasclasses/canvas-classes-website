'use strict';
// Class 11 Biology — Ch.5 Morphology of Flowering Plants — "Practice — NCERT
// Exercises" page. All 10 verbatim NCERT exercises, regrouped into 5 revision
// themes. Every fact in the solutions traces to this chapter's own
// already-published lesson pages (dumped and read in full before writing:
// The Root and the Stem; The Leaf, Venation, and Phyllotaxy; Inflorescence and
// Flower Symmetry; Calyx, Corolla, and Aestivation; Androecium, Gynoecium,
// and Placentation; The Fruit and the Seed; Floral Formula, Floral Diagram,
// and the Solanaceae Family) or to the NCERT source text itself
// (scripts/bio-book/_ncert_pdfs/kebo105.txt).
// IDs are hardcoded static strings (generated once), NOT dynamic uuid() calls
// — see the 2026-07-30 lesson in CONTRACT.md on why that matters for
// idempotency.
module.exports = {
  slug: 'ch5-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle: 'All 10 NCERT textbook exercises for the chapter, grouped into 5 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: '9d059961-b6e0-4ff4-a26e-e83b5ea1d0c5',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A dark botanical study spread showing a leaf, an open flower cut away to reveal its whorls, and a seed sliced in half beside a floral diagram of concentric rings',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Scientific textbook illustration, wide landscape banner, flat 2D educational diagram on a dark background (#0a0a0a near-black). Left third: a single compound leaf with leaflets along a central axis. Centre third: a flower sliced in half showing four concentric whorls around a central ovary, drawn as clean nested rings. Right third: a seed cut in cross-section showing a layered interior with a small embryo tucked to one side. A faint dotted circular floral diagram with rings sits subtly in the background connecting the three elements. Clean white outlines, muted natural ochre and sage tones, biologically accurate schematic proportions, no photorealism, no cartoon, matches standard biology textbook illustration conventions. No text, no labels, no leader lines, no pointer lines of any kind anywhere in the image.",
    },
    {
      id: '548d2bab-c4e9-47b8-9d85-94fff4c37a96',
      type: 'text',
      order: 1,
      markdown: "You've read the chapter — now drill it. Below are **all 10 NCERT exercises** for *Morphology of Flowering Plants*, pulled out of the textbook's running order and re-sorted into five revision themes: the leaf's own architecture, the inflorescence and the flower as a whole, the flower's whorls with their symmetry and ovary position, the fruit and the seed, and finally the floral formula worked through on the Solanaceae family.\n\nTry to answer each one in your head (or on paper) before you open the solution. Several of these ask you to \"draw a labelled diagram\" — since we can't draw here, the solution instead walks through every part you'd have to label, in order, so the words do the same job the diagram would.",
    },
    {
      id: '7a50e28a-c886-4eed-943d-e648d2d4da8f',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 5.1–5.10',
      intro: 'Every end-of-chapter exercise, regrouped into five revision themes. Each carries a one-line answer for a quick self-check and a full worked solution.',
      sections: [
        {
          id: 's1-leaves',
          title: "Leaves — Compound Types & Phyllotaxy",
          blurb: 'The two ways a compound leaf can be built, and the three ways whole leaves sit on a stem.',
          items: [
            {
              kind: 'numerical',
              id: '16198ac2-a985-453a-b77f-a063cfee4639',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.1',
              prompt: 'How is a pinnately compound leaf different from a palmately compound leaf?',
              answer: 'Pinnate: leaflets sit along one axis, the rachis (neem). Palmate: leaflets all meet at one point, the tip of the petiole (silk cotton).',
              solution: "A leaf becomes compound once its incisions cut all the way through to the midrib, splitting the blade into separate leaflets. What decides whether it's *pinnately* or *palmately* compound is simply how those leaflets attach.\n\nIn a **pinnately compound** leaf, a number of leaflets sit on a **common axis called the rachis**, which itself represents the midrib of the leaf — the leaflets run off it one after another, the way barbs sit along a feather. **Neem** is NCERT's example.\n\nIn a **palmately compound** leaf, the leaflets are instead attached **at a common point, at the tip of the petiole** — they all spread out from that one point, like fingers from a palm, rather than sitting along an axis. **Silk cotton** is NCERT's example.\n\n| | Pinnately compound | Palmately compound |\n|---|---|---|\n| Leaflets attach | Along a common axis (the rachis) | At one common point (the petiole tip) |\n| Example | Neem | Silk cotton |\n\nOne test works for both types, and it's worth remembering alongside this answer: a bud sits in the axil of the *petiole* in both cases, but never in the axil of an individual leaflet — that's how you know either of these is one compound leaf, not several separate simple ones.",
            },
            {
              kind: 'numerical',
              id: 'cb1f19d2-1c55-438b-9a83-96223cb728be',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.2',
              prompt: 'Explain with suitable examples the different types of phyllotaxy.',
              answer: 'Alternate — one leaf per node (china rose, mustard, sunflower). Opposite — a pair per node (Calotropis, guava). Whorled — more than two per node (Alstonia).',
              solution: "**Phyllotaxy** is the pattern in which leaves are arranged on a stem or branch. NCERT names three types.\n\nIn **alternate** phyllotaxy, a **single leaf arises at each node**, and successive leaves alternate from side to side as you move up the stem. **China rose, mustard, and sunflower** all show this.\n\nIn **opposite** phyllotaxy, a **pair of leaves arises at each node**, sitting directly **opposite each other**. **Calotropis and guava** are NCERT's examples.\n\nIn **whorled** phyllotaxy, **more than two leaves arise at a node** and form a ring — a **whorl** — around the stem. **Alstonia** is the example.\n\n| Type | Leaves per node | Example |\n|---|---|---|\n| Alternate | One, alternating sides | China rose, mustard, sunflower |\n| Opposite | A pair, facing each other | Calotropis, guava |\n| Whorled | More than two, in a ring | Alstonia |\n\nAll three patterns are really answering the same question: how does the plant space out its light-catching surfaces so one leaf shades its neighbour as little as possible. Next time you look at a real plant, count the leaves at one node and check whether the next node up lines up with it or alternates — that's all phyllotaxy is asking you to notice.",
            },
          ],
        },
        {
          id: 's2-inflorescence-and-flower',
          title: 'Inflorescence & the Flower as a Whole',
          blurb: 'What an inflorescence actually is, what decides its shape, and what a flower is built from.',
          items: [
            {
              kind: 'numerical',
              id: 'a49bb616-4920-4035-b1b3-9980fd5c13c2',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.9',
              prompt: 'Define the term inflorescence. Explain the basis for the different types inflorescence in flowering plants.',
              answer: "Inflorescence = the arrangement of flowers on the floral axis. The basis for the two main types is whether the main axis keeps growing (racemose) or ends in a flower (cymose).",
              solution: "**Inflorescence** is defined, plainly, as the **arrangement of flowers on the floral axis**. Most flowers aren't solitary the way a shoot-tip flower is — they sit in a cluster instead, and inflorescence is the word for how that cluster is put together.\n\nThe basis for telling the different types apart is a single question: **does the growing tip of the axis ever turn into a flower and stop, or does it keep growing?**\n\nIf the **main axis keeps growing**, new flowers keep being added laterally along it as growth continues. This is a **racemose** inflorescence. Because the tip is never used up making a flower, the newest flowers always sit closest to the still-growing tip, with older flowers left behind lower down — NCERT records this order as **acropetal succession**.\n\nIf the **main axis itself terminates in a flower**, growth is **limited** — once the tip becomes a flower, the axis can't extend any further. This is a **cymose** inflorescence. Here the flowers appear in the opposite order, **basipetal**: the terminal flower caps the axis first, and every flower that follows has to appear below it.\n\nSo the one underlying basis — whether the tip becomes a flower or keeps growing — is what produces both the *shape* of the cluster (indefinite vs limited) and the *order* in which the flowers open (acropetal vs basipetal).",
            },
            {
              kind: 'numerical',
              id: '2a4da254-afcf-4953-b55b-4b93b13bc881',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.8',
              prompt: 'What is a flower? Describe the parts of a typical angiosperm flower.',
              answer: "A flower is a modified shoot — its apical meristem turns into a floral meristem. A typical angiosperm flower has four whorls on the thalamus: calyx (sepals), corolla (petals), androecium (stamens), gynoecium (carpels).",
              solution: "A **flower is a modified shoot**. Its shoot apical meristem — the growing tip that would normally keep adding stem and leaves — changes into a **floral meristem** instead. Two things happen together when this switch occurs: the **internodes stop elongating** so the whole axis condenses, and the apex stops producing leaves and instead lays down **different kinds of floral appendages, one after another at successive nodes**. That's why a flower is a tightly packed structure rather than a spread-out branch. The flower is the **reproductive unit of angiosperms** — its job is sexual reproduction.\n\nA typical flower carries **four different kinds of whorls**, arranged one after another on the swollen tip of the stalk, called the **thalamus** or **receptacle**:\n\n- **Calyx** — the outermost whorl, made of **sepals**. Usually green and leaf-like; protects the flower while it is still in the bud.\n- **Corolla** — made of **petals**, usually brightly coloured, to attract insects for pollination.\n- **Androecium** — made of **stamens**, the male reproductive organs. Each stamen has a filament (stalk) and an anther, which is where pollen grains are produced.\n- **Gynoecium** — made of **carpels**, the female reproductive part. Each carpel has a stigma, style, and ovary; the ovary bears the ovules that develop into seeds after fertilisation.\n\nCalyx and corolla are the **accessory organs**; androecium and gynoecium are the **reproductive organs**. (In some flowers, like lily, calyx and corolla aren't kept visually distinct, and together they're just called the **perianth**.) A flower with both androecium and gynoecium is **bisexual**; one with only stamens or only carpels is **unisexual**. On top of these four whorls, a flower is also described by its **symmetry** (actinomorphic, zygomorphic, or asymmetric), its **merosity** (trimerous, tetramerous, pentamerous), and whether it carries a **bract** (bracteate) or not (ebracteate).",
            },
          ],
        },
        {
          id: 's3-whorls-symmetry-placentation',
          title: 'Floral Whorls, Symmetry, Ovary Position & Placentation',
          blurb: "The exact vocabulary NCERT's own diagrams (Figure 5.9 especially) are built on.",
          items: [
            {
              kind: 'numerical',
              id: '274e2253-8b52-4598-8733-8e9360aed99e',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.3',
              prompt: 'Define the following terms:\n(a) aestivation\n(b) placentation\n(c) actinomorphic\n(d) zygomorphic\n(e) superior ovary\n(f) perigynous flower\n(g) epipetalous stamen',
              answer: "Aestivation = how sepals/petals fold in the bud. Placentation = how ovules sit inside the ovary. Actinomorphic = radial symmetry (any plane). Zygomorphic = bilateral symmetry (one plane). Superior ovary = sits above the other whorls (hypogynous). Perigynous flower = gynoecium central, ovary half inferior. Epipetalous stamen = attached to the petals.",
              solution: "**(a) Aestivation** — the mode of arrangement of sepals or petals in the floral bud, with respect to the other members of the *same* whorl. In plain terms: once the bud is closed, how are the sepals (or petals) sitting against each other — just touching, overlapping in one direction, overlapping every which way, or wrapped in a fixed order? NCERT names four types: **valvate** (margins just touch, no overlap — Calotropis), **twisted** (margins overlap, one consistent direction — china rose), **imbricate** (margins overlap, no fixed direction — Cassia), and **vexillary/papilionaceous** (standard overlaps the wings, which overlap the keel — pea).\n\n**(b) Placentation** — the arrangement of ovules within the ovary. NCERT names five types: marginal, axile, parietal, free central, and basal (each one is worked through in full in NCERT 5.7 below).\n\n**(c) Actinomorphic** — a flower that can be divided into two equal radial halves along **any** plane passing through its centre. Mustard, datura, and chilli are examples.\n\n**(d) Zygomorphic** — a flower that can only be divided into two similar halves along **one particular** vertical plane. Pea, gulmohur, bean, and Cassia are examples.\n\n**(e) Superior ovary** — the ovary of a **hypogynous** flower, one where the gynoecium occupies the highest position on the thalamus, with the calyx, corolla, and androecium all attached below it. Because the ovary sits above everything else, it's called superior. Mustard, china rose, and brinjal show this.\n\n**(f) Perigynous flower** — a flower whose gynoecium sits in the **centre** of the thalamus, with the other three whorls attached around it on the rim, at almost the same level as the ovary. This arrangement gives a **half inferior** ovary. Plum, rose, and peach are examples.\n\n**(g) Epipetalous stamen** — a stamen that is united with — attached to — the **petals**, rather than standing free of them. Brinjal is NCERT's example.",
            },
            {
              kind: 'numerical',
              id: 'd9bc4dcf-589f-4109-9de2-69c8d43b7a2a',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.10',
              prompt: 'Describe the arrangement of floral members in relation to their insertion on thalamus.',
              answer: "Hypogynous — gynoecium highest, ovary superior (mustard, china rose, brinjal). Perigynous — gynoecium central, ovary half inferior (plum, rose, peach). Epigynous — thalamus fuses around the ovary, ovary inferior (guava, cucumber, sunflower ray florets).",
              solution: "NCERT describes flowers by **where the calyx, corolla, and androecium sit relative to the ovary on the thalamus** — this gives three positions.\n\nIn a **hypogynous** flower, the **gynoecium occupies the highest position**, with every other whorl attached below it. Because the ovary sits above everything else, it is called **superior**. **Mustard, china rose, and brinjal** show this.\n\nIn a **perigynous** flower, the **gynoecium sits in the centre**, and the other whorls are attached around it on the rim of the thalamus, at almost the same level as the ovary. The ovary here is **half inferior**. **Plum, rose, and peach** are the examples.\n\nIn an **epigynous** flower, the **margin of the thalamus grows upward**, encloses the ovary completely, and **fuses with it**, so the other whorls end up arising **above** the ovary. Because the ovary is now enclosed below everything else, it is called **inferior**. **Guava, cucumber, and the ray florets of the sunflower** are all epigynous.\n\n| Position | Where the gynoecium sits | Ovary term | Examples |\n|---|---|---|---|\n| Hypogynous | Highest — everything else attaches below it | Superior | Mustard, china rose, brinjal |\n| Perigynous | Centre — other whorls level with it, on the rim | Half inferior | Plum, rose, peach |\n| Epigynous | Enclosed below — thalamus fuses around it | Inferior | Guava, cucumber, sunflower ray florets |\n\nThe fastest way to hold this table together: read it as one continuum, the ovary rising from *enclosed and below* (epigynous) to *level* (perigynous) to *sitting on top* (hypogynous), and the ovary term flips in the exact opposite direction, inferior to half inferior to superior.",
            },
            {
              kind: 'numerical',
              id: '08db0b85-b0cb-4f11-8ddc-f62d5d3edc71',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.4',
              prompt: 'Differentiate between\n(a) Racemose and cymose inflorescence\n(b) Apocarpous and syncarpous ovary',
              answer: "(a) Racemose: main axis keeps growing, acropetal succession. Cymose: main axis ends in a flower, basipetal order. (b) Apocarpous: carpels free (lotus, rose). Syncarpous: carpels fused (mustard, tomato).",
              solution: "**(a) Racemose vs cymose inflorescence**\n\n| | Racemose | Cymose |\n|---|---|---|\n| Main axis | Keeps growing — never turns into a flower itself | Terminates in a flower |\n| Growth | Indefinite — the tip stays free to keep adding flowers | Limited — once the tip becomes a flower, it can't extend further |\n| Flowers borne | Laterally along the axis | The terminal flower caps the axis; later flowers appear below it |\n| Order | Acropetal succession (newest nearest the tip) | Basipetal order (oldest at the top, newer ones below) |\n\n**(b) Apocarpous vs syncarpous ovary**\n\nThis is about how the carpels of the gynoecium relate to each other when a flower has more than one. If the carpels stay **free** from one another, the gynoecium is **apocarpous** — **lotus and rose** show this. If the carpels are instead **fused together**, it is **syncarpous** — **mustard and tomato** show this.\n\n| | Apocarpous | Syncarpous |\n|---|---|---|\n| Carpels | Free from one another | Fused together |\n| Example | Lotus, rose | Mustard, tomato |\n\nBoth differentiations come down to the same underlying question — does a structure stay separate or fuse — just asked once about the whole inflorescence axis and once about the carpels inside a single flower.",
            },
            {
              kind: 'numerical',
              id: '95c0c3bc-7a98-4f28-a718-1cde5b4c25e4',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.7',
              prompt: 'Describe the various types of placentations found in flowering plants.',
              answer: "Marginal (pea) — ovules in two rows on a ridge. Axile (china rose, tomato, lemon) — ovules on a central axis in a multi-chambered ovary. Parietal (mustard, Argemone) — ovules on the wall, false septum splits the ovary in two. Free central (Dianthus, Primrose) — ovules on a bare central axis, no septa. Basal (sunflower, marigold) — one ovule at the base.",
              solution: "**Placentation** is the arrangement of ovules within the ovary, and NCERT names five types.\n\nIn **marginal placentation**, the **placenta forms a ridge along the ventral suture** of the ovary, and the **ovules are borne on this ridge in two rows**. Example: **pea**.\n\nIn **axile placentation**, the **placenta is axial**, and the **ovules are attached to it inside a multilocular ovary** — one with several chambers. Examples: **china rose, tomato, and lemon**.\n\nIn **parietal placentation**, the **ovules develop on the inner wall of the ovary**, on its peripheral part. The ovary is **one-chambered**, but it **becomes two-chambered** because a **false septum** forms inside it. Examples: **mustard and Argemone**.\n\nIn **free central placentation**, the **ovules are borne on a central axis**, and **septa are absent**. Examples: **Dianthus and Primrose**.\n\nIn **basal placentation**, the **placenta develops at the base of the ovary**, and a **single ovule** is attached to it. Examples: **sunflower and marigold**.\n\n| Type | Where the ovules sit | Chambers | Example |\n|---|---|---|---|\n| Marginal | Two rows, on a ridge along the ventral suture | — | Pea |\n| Axile | On a central axis | Multilocular (many) | China rose, tomato, lemon |\n| Parietal | On the ovary wall | One, split in two by a false septum | Mustard, Argemone |\n| Free central | On a bare central axis | None (no septa) | Dianthus, Primrose |\n| Basal | At the base, one ovule only | — | Sunflower, marigold |\n\nThe cleanest way to hold all five together is to ask what's genuinely different about each: two rows on a ridge (marginal), many chambers around an axis (axile), a wall with a false wall added (parietal), a bare axis with nothing dividing it (free central), and just one ovule at the very bottom (basal).",
            },
          ],
        },
        {
          id: 's4-fruit-and-seed',
          title: 'The Fruit & The Seed',
          blurb: "A dicot seed (gram) and a monocot seed (maize) labelled part by part — since we can't draw here, every label is described in words instead.",
          items: [
            {
              kind: 'numerical',
              id: 'd79d5b94-e580-4169-b9b3-df9037064b1e',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.5',
              prompt: 'Draw the labelled diagram of the following:\n(i) gram seed\n(ii) V.S. of maize seed',
              answer: "Gram (dicot): seed coat (testa + tegmen) around an embryo of two fleshy cotyledons, with the radicle and plumule at the two ends of the embryonal axis; non-endospermous. Maize (monocot, V.S.): seed coat fused to the fruit wall, a bulky endosperm under an aleurone layer, and a small embryo with one shield-shaped cotyledon (scutellum), its plumule in the coleoptile and radicle in the coleorhiza.",
              solution: "We can't draw here, so instead here is every part you would place on each diagram, in the order you'd label it.\n\n**(i) Gram seed — a dicotyledonous seed**\n\nGram is NCERT's own example of a seed that is **non-endospermous** at maturity — its endosperm gets used up during development, so all the reserve food sits in the cotyledons instead. Labelling it from the outside in:\n\n- **Seed coat** — the outermost covering, made of **two layers**: the outer **testa** and the inner **tegmen**.\n- **Hilum** — a **scar** on the seed coat, marking exactly where the developing seed was attached to the fruit.\n- **Micropyle** — a **small pore**, sitting **just above the hilum**.\n- **Embryo** (inside the seed coat) — made of an **embryonal axis** and **two cotyledons**. The cotyledons are **fleshy and full of reserve food** — which is why a soaked gram seed splits so easily into two halves.\n- **Plumule** and **radicle** — sitting at the **two ends of the embryonal axis**. The plumule develops into the shoot; the radicle develops into the root.\n\n**(ii) V.S. of maize seed — a monocotyledonous seed**\n\nMaize is NCERT's working example of a monocot seed, and it is **generally endospermic** (unlike gram). Labelling a vertical section from the outside in:\n\n- **Seed coat** — **membranous**, and **generally fused with the fruit wall**, so the two can't be peeled apart the way they can in gram.\n- **Endosperm** — **bulky**, taking up most of the seed, and it **stores food**.\n- **Aleurone layer** — a **proteinous layer** on the outer covering of the endosperm, **separating the endosperm from the embryo**.\n- **Embryo** — **small**, tucked into a **groove at one end of the endosperm**. It has **one large, shield-shaped cotyledon**, the **scutellum**, plus a short axis bearing a plumule and a radicle.\n- **Coleoptile** and **coleorhiza** — the two protective sheaths. The **plumule is enclosed in the coleoptile**; the **radicle is enclosed in the coleorhiza** (a memory hook: coleo-PTILE pairs with Plumule; coleo-RHIZA pairs with Radicle — *rhiza* is Greek for root).\n\nThe one-line contrast worth carrying forward: gram has **two** cotyledons and **no** endosperm at maturity; maize has **one** cotyledon (the scutellum) and a large endosperm that survives to maturity, protected by sheaths the dicot seed doesn't have at all.",
            },
          ],
        },
        {
          id: 's5-solanaceae-and-floral-formula',
          title: 'Floral Formula & the Solanaceae Family',
          blurb: "NCERT's own worked example — a complete semi-technical description and floral diagram for a Solanaceae flower.",
          items: [
            {
              kind: 'numerical',
              id: '540f46de-2aeb-43e3-9d49-166528768d6d',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.6',
              prompt: 'Take one flower of the family Solanaceae and write its semi-technical description. Also draw their floral diagram.',
              answer: "Solanaceae flower: bisexual, actinomorphic; calyx and corolla each of 5 united (valvate) parts; androecium of 5 epipetalous stamens; gynoecium bicarpellary, syncarpous, ovary superior with axile placentation. Floral formula: ⊕ K(5) C(5) A5 G(2).",
              solution: "A semi-technical description follows a fixed sequence: habit, then vegetative characters, then floral characters, and finally the floral formula and floral diagram that sum the whole flower up. Here it is worked through for Solanaceae, exactly the way NCERT does it.\n\n**Habit:** mostly **herbs and shrubs**, rarely small trees. The family is large and widely distributed, across the **tropics, subtropics, and even temperate zones**.\n\n**Vegetative characters:**\n\n- **Stem** — herbaceous, rarely woody; aerial, erect, cylindrical, branched, solid or hollow, hairy or glabrous. Notably, **potato** (*Solanum tuberosum*) has an **underground stem** — the part of the potato plant you actually eat is a stem, not a root.\n- **Leaves** — alternate, simple, rarely pinnately compound, exstipulate; **reticulate venation**.\n\n**Floral characters:**\n\n- **Inflorescence** — solitary, axillary, or cymose (as in *Solanum*).\n- **Flower** — bisexual, actinomorphic.\n- **Calyx** — **5 sepals**, united (gamosepalous), persistent, **valvate** aestivation.\n- **Corolla** — **5 petals**, united (gamopetalous), **valvate** aestivation.\n- **Androecium** — **5 stamens**, **epipetalous** (attached to the corolla).\n- **Gynoecium** — **bicarpellary**, obliquely placed, **syncarpous**; ovary **superior**, **bilocular**; placenta swollen with many ovules, **axile** placentation.\n- **Fruit** — a berry or capsule.\n- **Seeds** — many, endospermous.\n\n**Floral formula:** ⊕ K(5) C(5) A5 G(2)\n\nReading it symbol by symbol: **⊕** marks actinomorphic (radial) symmetry. **K(5)** — calyx of 5 sepals, the bracket showing they're fused (cohesion). **C(5)** — corolla of 5 petals, also fused. **A5** — androecium of 5 stamens (in the real formula these would carry a line joining them up to the C, marking the adhesion of the epipetalous stamens to the petals — a mark this text format can't draw, but the fact still holds). **G(2)** — gynoecium of 2 fused carpels, the bracket again showing fusion (syncarpous); a bar under the G marks the ovary as superior.\n\n**Floral diagram, described in words:** a small dot above the diagram marks the **mother axis** — the stem the flower hangs from. Below that dot sit four concentric rings, drawn from outside in exactly as the whorls sit on the real flower: the outermost ring is the **calyx**, 5 sepals with their margins just touching (valvate); just inside it, the **corolla**, 5 fused petals, also valvate; inside that, the **androecium**, 5 stamens positioned in line with the petals, each linked outward toward its petal to show the epipetalous attachment; and at the very centre, the **gynoecium**, drawn as **2 fused chambers** set slightly off from perfectly symmetric (obliquely placed), with a mark under it showing the ovary sits superior to the rest of the flower.\n\nThe single memorisable chain worth keeping from this whole answer: **bicarpellary, obliquely placed, syncarpous, ovary superior, axile placentation** — every part of the Solanaceae gynoecium in one line.",
            },
          ],
        },
      ],
    },
  ],
};
