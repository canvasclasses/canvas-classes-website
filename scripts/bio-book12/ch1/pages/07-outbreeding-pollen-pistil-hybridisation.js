'use strict';
/**
 * Class 12 Biology — Chapter 1: Sexual Reproduction in Flowering Plants
 * Page 7 — Outbreeding Devices, Pollen–Pistil Interaction & Artificial Hybridisation.
 *
 * Source of truth: NCERT Class 12 Ch.1 (lebo101.txt), §1.2.3 — the "Outbreeding
 * Devices", "Pollen-pistil Interaction" and "Artificial Hybridisation" passages
 * (lines 640–753), plus Figure 1.12 (pollen tube path). Rule 0: every fact here
 * traces to that text; nothing invented, no coaching-book additions.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'outbreeding-devices-and-pollen-pistil-interaction',
  title: 'Keeping It Cross: Outbreeding Devices, Pollen–Pistil Interaction & Hand-Pollination',
  subtitle: "Most flowers carry both sexes side by side — yet plants go to great lengths to avoid mating with themselves. Here's how they do it, how the pistil screens every pollen grain that lands, and how a breeder takes over the whole process by hand.",
  page_number: 7,
  page_type: 'lesson',
  tags: ['outbreeding-devices', 'pollen-pistil-interaction', 'artificial-hybridisation', 'sexual-reproduction-in-flowering-plants'],
  glossary: [
    { term: 'inbreeding depression', definition: 'The loss of vigour that builds up when a plant keeps self-pollinating generation after generation. Avoiding it is the whole reason outbreeding devices exist.' },
    { term: 'self-incompatibility', definition: "A genetic mechanism that blocks a plant's own pollen from fertilising its ovules, by stopping that pollen from germinating or its tube from growing in the pistil." },
    { term: 'dioecious', definition: 'A condition where a plant bears only male flowers or only female flowers, never both — so each plant is one sex, like papaya. It prevents both autogamy and geitonogamy.' },
    { term: 'pollen-pistil interaction', definition: 'The whole dialogue from pollen landing on the stigma until the pollen tube enters the ovule — including the pistil recognising, then accepting or rejecting, the pollen.' },
    { term: 'pollen tube', definition: 'The tube a compatible pollen grain grows out of a germ pore, carrying its contents (including the male gametes) down through the stigma and style to the ovule.' },
    { term: 'emasculation', definition: 'Removing the anthers from a bisexual flower bud, before they shed pollen, so the flower cannot pollinate itself — the first step of a controlled cross.' },
    { term: 'bagging', definition: "Covering an emasculated (or unopened female) flower with a butter-paper bag so no unwanted pollen can reach its stigma." },
  ],
  blocks: [
    {
      id: 'e913c2d8-a3a6-4ce2-a62c-6e801c6a54e0',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A dusk field of papaya trees, some bearing only flowers and others heavy with fruit, warm light low on the horizon',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet plantation at dusk of tall slender papaya trees, seen from a low angle. Some trees carry only clusters of small pale flowers high on the trunk, while other, separate trees are heavy with rows of hanging fruit — subtly suggesting that some plants are male and some female, without any labels. A single low warm sun glows near the horizon behind the trees, backlighting the leaves. A few insects drift faintly between the distant blooms. Deep dusk lighting throughout, painterly and atmospheric, dark background tones overall (#0a0a0a base), naturalistic, no text, no labels, no diagram elements.",
    },
    {
      id: 'ebc7b1d1-9672-42a3-83f4-31560001a0a0',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'A Flower That Refuses To Marry Itself',
      markdown: "Most flowers are **hermaphrodite** — they carry working anthers and a receptive stigma in the very same flower, sitting millimetres apart. Left to chance, a grain of pollen would simply drop onto the stigma right below it, and the plant would fertilise itself over and over. That sounds convenient, but it's a slow trap: keep self-pollinating and the offspring get weaker each generation. So flowering plants have evolved a whole toolkit of tricks to *stop* their own pollen from succeeding and push for a partner instead. A papaya tree takes it to the extreme — it's born either male or female, so it simply cannot pollinate itself at all.",
    },
    {
      id: 'd0e18a05-4761-4f46-a077-d354abcb5431',
      type: 'text',
      order: 2,
      markdown: "The majority of flowering plants produce **hermaphrodite flowers**, where pollen grains are very likely to land on the stigma of the same flower. That constant self-pollination leads to **inbreeding depression** — a build-up of weakness across generations. To dodge it, flowering plants have developed several **outbreeding devices**: features that discourage self-pollination and encourage cross-pollination.\n\nBefore we list them, hold two words from the pollination page in mind. **Autogamy** is pollen landing on the stigma of the *same flower*. **Geitonogamy** is pollen carried to *another flower on the same plant* — genetically still self-pollination, even though the pollen travelled. A good outbreeding device has to defeat one or both of these.",
    },
    {
      id: '8418c502-7ac4-4cbf-9af4-a307c741d6cb',
      type: 'heading',
      order: 3,
      level: 2,
      text: 'The Four Ways a Flower Avoids Pollinating Itself',
      objective: "By the end of this you can name each outbreeding device and say exactly which kind of self-pollination — autogamy, geitonogamy, or both — it shuts down.",
    },
    {
      id: '73e3f84b-09c8-46b2-9fd2-7f68fbc2453d',
      type: 'text',
      order: 4,
      markdown: "**1. Timing them apart.** In some species, pollen release and stigma receptivity are not synchronised. Either the pollen is shed before the stigma is ready to receive it, or the stigma becomes receptive long before the pollen is released. The flower's own pollen and its own stigma are simply never ready at the same moment.\n\n**2. Placing them apart.** In other species, the anther and the stigma sit at different positions inside the flower, so the pollen physically cannot fall onto the stigma of the same flower. Both this device and the timing trick above prevent **autogamy**.\n\n**3. Self-incompatibility.** This is a **genetic mechanism**, not a matter of position or timing. Even if self-pollen (from the same flower, or from another flower of the same plant) lands squarely on the stigma, the pistil blocks it — either the pollen fails to germinate or its tube is stopped from growing in the pistil. No fertilisation follows.\n\n**4. Making the sexes separate — unisexual flowers.** If a plant bears separate male and female flowers on the *same* plant (**monoecious**, like castor and maize), pollen can't drop onto the same flower, so autogamy is prevented — but pollen can still travel to a female flower elsewhere on the same plant, so **geitonogamy is not prevented**. Go one step further and put male and female flowers on *different* plants, so each plant is only one sex (**dioecious**, like papaya). Now the plant has no flowers of the other sex at all, so both autogamy *and* geitonogamy are prevented.",
    },
    {
      id: 'f92ec67a-5de9-4c8f-8ba9-7087932ed520',
      type: 'heading',
      order: 5,
      level: 2,
      text: 'Pollen–Pistil Interaction — The Pistil Screens Every Grain',
      objective: "By the end of this you can trace the compatible pollen grain from the stigma all the way into the embryo sac, and explain how the pistil turns the wrong pollen away.",
    },
    {
      id: '8a338a6d-e8b2-428d-9210-552819ec3780',
      type: 'text',
      order: 6,
      markdown: "Getting pollen onto a stigma isn't the finish line — it doesn't guarantee the *right* pollen arrived. Wind and insects are careless: pollen of the wrong type, from another species or even self-pollen on a self-incompatible plant, lands on the stigma too. So the pistil does something remarkable — it **recognises** each grain and decides whether it's compatible (right type) or incompatible (wrong type).\n\nIf the pollen is **compatible**, the pistil accepts it and switches on the events that lead to fertilisation. If it's **incompatible**, the pistil rejects it — by preventing the pollen from germinating on the stigma, or by stopping its tube from growing through the style. This acceptance-or-rejection is the result of a continuous chemical **dialogue** between the pollen grain and the pistil.\n\nOnce a compatible grain is accepted, here's the journey. The pollen grain **germinates on the stigma** and pushes out a **pollen tube** through one of its germ pores. The contents of the grain move into the tube. The tube grows down through the tissues of the **stigma and style** and reaches the **ovary**. There it enters the **ovule through the micropyle**, then pushes into one of the **synergids** inside the embryo sac, guided by the filiform apparatus. (In plants that shed pollen two-celled, the generative cell divides to form the two male gametes *during* this tube growth; plants that shed it three-celled already carry both gametes from the start.) Every step, from pollen landing on the stigma to the tube entering the ovule, together makes up **pollen–pistil interaction**.",
    },
    {
      id: 'b4d5a27e-43a7-4037-8b99-c26f33eba431',
      type: 'interactive_image',
      order: 7,
      src: '',
      alt: 'Longitudinal section of a pistil showing a pollen tube growing from the stigma down through the style into the ovule',
      caption: '📸 Tap each dot to follow the pollen tube from the stigma into the embryo sac',
      generation_prompt: "Scientific textbook illustration of a longitudinal section (L.S.) of a pistil showing pollen-tube growth. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions. At the top, a broad receptive STIGMA with a few purple pollen grains resting on it, one of them germinating and sending out a slender tube (purple = nucleic acid / reproductive cell). Below the stigma, a narrow elongated STYLE tissue drawn as a translucent column, with a single purple pollen tube growing downward through its centre. At the bottom, a rounded green-outlined OVARY containing one large OVULE; the pollen tube reaches the ovule and enters through a small opening (the micropyle) at its base-facing tip. Inside the ovule, a pale oval EMBRYO SAC with a small egg apparatus (egg cell plus two synergids) rendered in soft pink. No labels or text baked into the image itself, no leader lines, no photorealism, no cartoon, matches standard biology textbook illustration conventions. Vertical composition, pistil centred.",
      hotspots: [
        { id: '4556e04b-64cc-433a-a9bd-3de4fac79bfb', x: 0.5, y: 0.08, label: 'Stigma with germinating pollen', icon: 'circle',
          detail: 'The landing platform. A compatible pollen grain germinates here and pushes out a pollen tube through one of its germ pores. Incompatible pollen is stopped right at this step — it never germinates.' },
        { id: '39747d6d-0c20-40a3-8edd-1003a1967ec1', x: 0.52, y: 0.30, label: 'Pollen tube', icon: 'circle',
          detail: 'The tube that carries the pollen grain’s contents — including the two male gametes — down towards the ovary. In wrong-type pollen the pistil can halt this tube inside the style.' },
        { id: 'b8084d0c-9f12-4313-b871-99effc6c3722', x: 0.48, y: 0.46, label: 'Style', icon: 'circle',
          detail: 'The narrow neck of tissue between stigma and ovary. The pollen tube grows through the stigma and style tissues on its way down.' },
        { id: '5d83c384-bdb0-48c1-b1f2-b0e7874b4061', x: 0.5, y: 0.70, label: 'Ovary / ovule', icon: 'circle',
          detail: 'The swollen base of the pistil holding the ovule. The pollen tube reaches the ovary after growing through the style.' },
        { id: '44ee265c-7fae-4dab-8dd0-954f3c291870', x: 0.40, y: 0.80, label: 'Micropyle', icon: 'circle',
          detail: 'The tiny opening in the ovule. The pollen tube enters the ovule through the micropyle — the only doorway in.' },
        { id: '0df1643c-6b4e-413c-bb62-998197cdc5e7', x: 0.55, y: 0.86, label: 'Embryo sac (egg apparatus)', icon: 'circle',
          detail: 'Inside the ovule. After the micropyle, the tube pushes into one of the synergids and discharges the two male gametes near the egg and the central cell — ready for fertilisation.' },
      ],
    },
    {
      id: 'b0e25412-f2a6-4820-86bf-26d37a0badba',
      type: 'heading',
      order: 8,
      level: 2,
      text: 'Artificial Hybridisation — The Breeder Takes Over By Hand',
      objective: "By the end of this you can describe emasculation and bagging in order, and say exactly when emasculation is skipped.",
    },
    {
      id: '0425b293-3d36-4c5c-95ae-f96862bc230d',
      type: 'text',
      order: 9,
      markdown: "A plant breeder wants specific crosses — pairing two chosen parents to combine desirable characters and produce commercially 'superior' varieties. **Artificial hybridisation** is one of the major approaches of crop improvement. For it to work, the breeder must guarantee two things: that *only the desired pollen* reaches the stigma, and that the stigma is *protected from any unwanted pollen*. Both are achieved with **emasculation** and **bagging**.\n\n**If the female parent has bisexual flowers:** the breeder removes the anthers from the flower bud with a pair of forceps *before the anthers dehisce* (before they split open and shed pollen). This is **emasculation** — it takes away the flower's own source of pollen so it can't pollinate itself. The emasculated flower is then covered with a bag, usually of butter paper, to keep stray pollen off its stigma. This is **bagging**. When the bagged stigma becomes receptive, the breeder dusts it with mature pollen collected from the chosen male parent, **rebags** the flower, and lets the fruit develop.\n\n**If the female parent has unisexual flowers:** there are no anthers to remove, so **emasculation is not needed at all**. The breeder simply bags the female flower buds before they open. When the stigma turns receptive, they pollinate it with the desired pollen and rebag it.",
    },
    {
      id: '61065cc9-1ab3-447d-acf6-f2a4ed5651d9',
      type: 'reasoning_prompt',
      order: 10,
      reasoning_type: 'logical',
      prompt: "A breeder crossing two tomato varieties (tomato flowers are bisexual) snips off all the anthers from a flower bud while it's still closed, days before it would have shed any pollen. Why remove the plant's own anthers this early?",
      options: [
        "So the flower cannot supply its own pollen — with the anthers gone before they dehisce, only the breeder's chosen male-parent pollen can fertilise it",
        "To remove the stigma so that only the male parent contributes to the cross",
        "Because anthers must be removed from every flower before any pollination, including unisexual female flowers",
        "To force the stigma to become receptive earlier than it naturally would",
      ],
      reveal: "Emasculation removes the anthers *before they dehisce* precisely so the flower can't pollinate itself — that leaves the stigma open only for the pollen the breeder chooses. It does not touch the stigma (option 2 describes destroying the female part, which would ruin the cross). It's needed only for bisexual female parents — a unisexual female flower has no anthers to remove, so emasculation is skipped (option 3 is the classic trap). And emasculation has nothing to do with triggering receptivity; the breeder waits for the stigma to become receptive on its own after bagging (option 4).",
      difficulty_level: 2,
    },
    {
      id: 'cc7634c3-5a81-456e-895a-bce1028b9cd0',
      type: 'callout',
      order: 11,
      variant: 'remember',
      title: "Facts You Can't Afford To Blur",
      markdown: "- **Monoecious (castor, maize)** prevents autogamy but **NOT** geitonogamy. **Dioecious (papaya)** prevents **both**. This single distinction is examined constantly.\n- **Self-incompatibility** is a **genetic** mechanism — it blocks pollen germination *or* pollen tube growth in the pistil. Not timing, not position.\n- The pollen tube's path: **stigma → style → ovary → ovule via the micropyle → synergid** in the embryo sac. The micropyle is the tube's entry point into the ovule.\n- **Emasculation = removing anthers** (from a bisexual flower, before dehiscence). **Bagging = covering the flower.** A unisexual female parent needs **only bagging, no emasculation.**",
    },
    {
      id: 'd9a1e19b-a175-463b-b660-9dfadf9bdccc',
      type: 'callout',
      order: 12,
      variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Monoecy vs dioecy:** NCERT states monoecy prevents autogamy but not geitonogamy, while dioecy prevents both — NEET lifts this almost word for word. If a question asks which condition prevents *both* forms of self-pollination, the answer is **dioecy**.\n\n**Self-incompatibility:** remember it acts by *inhibiting pollen germination or pollen tube growth in the pistil*. That exact phrasing is a favourite fill-in-the-blank.\n\n**Emasculation:** it means removing the **anthers**, and it is done **before anther dehiscence**. A question asking 'when is emasculation NOT required?' is testing whether you know the female parent is **unisexual** in that case.\n\n**Classic NEET question:** \"Emasculation is a technique used in — (a) removing stigma (b) removing anthers before dehiscence (c) bagging the flower (d) dusting pollen.\" → **(b) removing anthers before dehiscence.**",
    },
    {
      id: '7e27cf2c-e756-46db-b15d-e1b45ba8a90f',
      type: 'text',
      order: 13,
      markdown: "Whether the pollen tube arrived on the wind, on a bee's leg, or from a breeder's brush, it ends the same way — discharging its two male gametes into the embryo sac. What happens next is a fusion event found nowhere else in the living world, and in flowering plants it happens not once but twice over.",
    },
    {
      id: 'f89c30b0-573c-4651-8af5-68825d681583',
      type: 'inline_quiz',
      order: 14,
      pass_threshold: 0.67,
      questions: [
        {
          id: '2c04df5b-3151-4252-9b90-4f6cae888380',
          question: 'Which outbreeding device prevents BOTH autogamy and geitonogamy?',
          options: [
            'Monoecy, as in castor and maize',
            'Pollen being released before the stigma becomes receptive',
            'Dioecy, as in papaya',
            'The anther and stigma being placed at different positions',
          ],
          correct_index: 2,
          explanation: "Dioecy puts male and female flowers on separate plants, so a plant has no flowers of the other sex — that stops autogamy and geitonogamy both. Monoecy (option 1) keeps the sexes on the same plant, so it stops autogamy but pollen can still travel to another flower on that plant — geitonogamy remains possible. Asynchronous timing and separated anther/stigma positions only prevent autogamy.",
          difficulty_level: 2,
        },
        {
          id: '9d23395f-d50b-4edd-bce1-85516d3a52fc',
          question: 'When a pistil receives incompatible (wrong-type) pollen, how does it reject it?',
          options: [
            'By sealing the micropyle so no pollen tube can enter the ovule',
            'By destroying the two male gametes once the tube reaches the ovary',
            'By making the stigma secrete extra nectar to wash the pollen off',
            'By preventing the pollen from germinating on the stigma, or stopping its tube from growing in the style',
          ],
          correct_index: 3,
          explanation: "NCERT is specific: the pistil rejects wrong-type pollen by blocking germination on the stigma or halting pollen tube growth in the style — the rejection happens early, before the tube ever nears the ovule. Sealing the micropyle (option 1) and destroying gametes in the ovary (option 2) both imagine the tube already reaching the ovary, which is exactly what rejection prevents. Nectar-washing (option 3) is invented.",
          difficulty_level: 2,
        },
        {
          id: 'e7c99c0c-8a0c-48d3-a332-22f5f6933946',
          question: 'What is the correct order of the pollen tube’s journey after a compatible grain lands?',
          options: [
            'Stigma → ovary → style → enters ovule through micropyle',
            'Stigma → style → ovary → enters ovule through micropyle → synergid',
            'Micropyle → style → stigma → ovary → synergid',
            'Style → stigma → ovary → micropyle → synergid',
          ],
          correct_index: 1,
          explanation: "The tube germinates on the stigma, grows down through the stigma and style tissues to the ovary, enters the ovule through the micropyle, and pushes into a synergid — that is option 2. Option 1 puts the ovary before the style, which is backwards; options 3 and 4 start in the wrong place entirely. The micropyle is always the entry point into the ovule, never the starting point.",
          difficulty_level: 3,
        },
        {
          id: 'bfe964da-680e-4042-a66e-e67e9f9c6ba6',
          question: 'A breeder is using a female parent that produces bisexual flowers. Which step is required, and why?',
          options: [
            'Emasculation — the anthers must be removed before they dehisce, so the flower cannot pollinate itself',
            'Emasculation — the stigma must be removed so only the male parent contributes',
            'No emasculation — a bisexual flower has no anthers to remove',
            'No emasculation — bagging alone is enough because the flower is unisexual',
          ],
          correct_index: 0,
          explanation: "A bisexual flower carries its own anthers, so it can self-pollinate — the breeder must emasculate it (remove the anthers before dehiscence) to force the cross. Option 2 wrongly removes the stigma, the female part the breeder needs. Options 3 and 4 confuse this with the unisexual case: emasculation is skipped only when the female parent is unisexual, which this one is not.",
          difficulty_level: 1,
        },
      ],
    },
  ],
};
