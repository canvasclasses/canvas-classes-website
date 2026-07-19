'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'competition-and-resource-partitioning',
  title: 'Competition — and How Species Dodge It',
  subtitle: "Competition isn't only for close relatives, and it isn't only about food running short — and the species that survive it are often the ones that learn to share the tree.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['organisms-and-populations', 'population-interactions', 'competition', 'competitive-exclusion', 'resource-partitioning'],
  glossary: [
    { term: 'competition', definition: "A process in which the fitness of one species — measured as its 'r', the intrinsic rate of increase — is significantly lowered in the presence of another species." },
    { term: 'interference competition', definition: 'Competition in which the feeding efficiency of one species is reduced by the interfering, inhibitory presence of another species — even when food and space are abundant.' },
    { term: 'competitive release', definition: 'The dramatic expansion of a species’ distributional range when a competitively superior species that had been restricting it is experimentally removed.' },
    { term: "competitive exclusion principle", definition: "Gause’s principle: two closely related species competing for the same resources cannot co-exist indefinitely, and the competitively inferior one is eventually eliminated." },
    { term: 'resource partitioning', definition: 'A mechanism that promotes co-existence — two species competing for the same resource avoid competition by choosing different times for feeding or different foraging patterns.' },
    { term: 'intrinsic rate of increase (r)', definition: "The measure of fitness used to define competition. If a species’ 'r' drops significantly when another species is present, the two are competing." },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A shallow South American lake at dusk with flamingoes wading while fishes move below the surface, both feeding on the same water',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: 'Ultra-wide cinematic banner (16:5 ratio). A shallow South American lake at deep dusk. Several tall flamingoes wade in the shallow water, heads lowered and bills submerged, filtering the water. Just beneath the surface, the dim shapes of a few resident fishes move through the same water, feeding in the same cloudy plankton-rich layer. The birds above and the fishes below share one narrow band of water, quietly using the same thing. Low mountains as a soft silhouette on the horizon, one warm glow of last light on the water. Muted, naturalistic, dark background (#0a0a0a base). Painterly, atmospheric, no text, no labels, no diagram elements, no arrows.',
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'A Bird and a Fish, Fighting Over the Same Lunch',
      markdown: "In some shallow **South American lakes**, visiting **flamingoes** and the **resident fishes** are competing with each other. A bird and a fish — not close relatives by any stretch, not even in the same class. But they share one thing: their common food, the **zooplankton** in the lake. Neither of them cares what the other one *is*. They only care that the plankton is going somewhere else.\n\nKeep this picture. It quietly breaks the first thing most students assume about competition.",
    },
    // ── 2 · Core concept — what competition actually is ───────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "When Darwin spoke of the **struggle for existence** and **survival of the fittest** in nature, he was convinced that **interspecific competition is a potent force in organic evolution**. So competition matters — but the common picture of it is only half right.\n\nIt is generally believed that competition occurs when **closely related species compete for the same resources that are limiting**. That belief is **not entirely true**, and NCERT corrects it on two counts.\n\n**First — the species need not be related at all.** Totally unrelated species could also compete for the same resource. That is exactly the flamingoes and the fishes: two organisms from completely different corners of the animal kingdom, both pulling zooplankton out of the same lake.\n\n**Second — the resource need not be running out.** Resources need not be limiting for competition to occur. In **interference competition**, the **feeding efficiency of one species is reduced by the interfering and inhibitory presence of the other species** — *even if food and space are abundant*. The pond is full, but one species simply cannot feed properly while the other is around.\n\nSo the safe, definition-proof way to say it: **competition is a process in which the fitness of one species — measured in terms of its 'r', the intrinsic rate of increase — is significantly lower in the presence of another species.** Notice what this definition does *not* mention: it says nothing about relatedness, and nothing about the resource being scarce. It only asks one question — does 'r' drop when the other species is around?",
    },
    // ── 3 · Heading — evidence in nature ──────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'How Do We Know Competition Really Happens Out There?',
      objective: 'By the end of this you can quote the three pieces of evidence NCERT gives for competition in nature — the tortoise, competitive release, and Connell’s barnacles — and say what each one proves.',
    },
    // ── 4 · Text — evidence ───────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "In a **laboratory**, competition is relatively easy to demonstrate. **Gause** and other experimental ecologists showed that when resources are limited, the **competitively superior species will eventually eliminate the other species**. Two species in a jar, one food supply, one survivor.\n\nOut in nature, though, evidence for such **competitive exclusion** is **not always conclusive**. But strong and persuasive **circumstantial evidence** does exist in some cases.\n\n**The Abingdon tortoise.** In the **Galapagos Islands**, the Abingdon tortoise became **extinct within a decade** after **goats were introduced** on the island — apparently because of the **greater browsing efficiency of the goats**. The goats were not the tortoise's relatives and did not attack it. They simply ate the same vegetation, better and faster.\n\n**Competitive release.** This is the cleanest evidence, because it is an *experiment*. A species whose distribution is restricted to a small geographical area because of the presence of a **competitively superior species** is found to **expand its distributional range dramatically when the competing species is experimentally removed**. Remove the rival, and the restricted species spreads out. That tells you the rival — not the climate, not the soil, not the species' own limits — was what was holding it back all along.\n\n**Connell's barnacles.** His elegant field experiments on the **rocky sea coasts of Scotland** showed that the **larger and competitively superior barnacle *Balanus* dominates the intertidal area and excludes the smaller barnacle *Chthamalus* from that zone**. *Chthamalus* is physically capable of living there. *Balanus* is the reason it doesn't.\n\nOne more line NCERT drops in, and NEET loves it: in general, **herbivores and plants appear to be more adversely affected by competition than carnivores**.",
    },
    // ── 5 · Heading — Gause's principle and the escape route ──────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: "Gause's Principle — and the Way Out of It",
      objective: 'By the end of this you can state the competitive exclusion principle with its condition attached, and explain how resource partitioning lets competitors live on the same tree.',
    },
    // ── 6 · Text — exclusion principle + resource partitioning ────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "**Gause's 'Competitive Exclusion Principle'** states that **two closely related species competing for the same resources cannot co-exist indefinitely, and the competitively inferior one will be eliminated eventually.**\n\nNow read the very next line carefully, because it is the one students skip: **this may be true if resources are limiting, but not otherwise.** The principle comes with a condition bolted onto it. It is not a law of nature that fires every time two similar species meet.\n\nIn fact, **more recent studies do not support such gross generalisations about competition.** They do not rule out interspecific competition in nature — it happens. But they point out that **species facing competition might evolve mechanisms that promote co-existence rather than exclusion**. Living together, not one wiping out the other.\n\nOne such mechanism is **'resource partitioning'**. If two species compete for the same resource, they could avoid competition by choosing, for instance, **different times for feeding** or **different foraging patterns**. Same resource, split up along another axis — the clock, or the habit.\n\n**MacArthur** showed this beautifully. **Five closely related species of warblers living on the same tree** were able to **avoid competition and co-exist** due to **behavioural differences in their foraging activities**. Five species that Gause's principle says should have been down to one — all still there, all on one tree, because each one hunts differently. Competition avoided, not won.\n\nCompetition is one species making another's life harder while taking nothing from its body. Next we meet an interaction where one species does take directly from the other's body — **parasitism**.",
    },
    // ── 7 · Interactive image — MacArthur's warblers ──────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: "A single conifer tree with five warbler species each feeding in a different zone of the same tree, illustrating resource partitioning",
      caption: '📸 Tap each dot to explore how five warblers share one tree',
      generation_prompt: 'Scientific textbook illustration of resource partitioning in warblers. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A single tall conifer tree occupying the centre of the frame, drawn in clean white outline with green foliage to signal living photosynthetic tissue. Five small warbler birds, all clearly the same closely-related body shape and size but each in a slightly different muted plumage tone, are shown perched and feeding in five clearly separate parts of the SAME tree: one among the topmost needles at the very crown, one on the outer tips of the upper branches, one in the dense middle of the crown, one on the inner branches close to the trunk, and one on the lowest branches near the base. Faint dotted white boundaries loosely mark each bird’s own feeding zone within the tree, so the reader sees one shared tree divided into five non-overlapping feeding areas. Clean white outlines, thin white leader lines, biologically accurate bird and conifer proportions, green foliage, brown/tan trunk and branches, muted natural bird tones. No text or labels baked into the image itself. No photorealism, no cartoon, no mascots.',
      hotspots: [
        {
          id: uuid(), x: 0.50, y: 0.50, label: 'One tree, one resource', icon: 'circle',
          detail: "All five warbler species live on the **same tree** and are **closely related**. By Gause's principle, that is the exact recipe for one of them being eliminated — yet all five are still here.",
        },
        {
          id: uuid(), x: 0.50, y: 0.10, label: 'Species 1 — the crown', icon: 'circle',
          detail: 'This warbler forages at the top of the tree. Its **foraging pattern** — where on the plant it hunts — is its own, so it is not taking food out of the mouth of the bird below it.',
        },
        {
          id: uuid(), x: 0.80, y: 0.32, label: 'Species 2 — the outer tips', icon: 'circle',
          detail: 'A second species works the outer ends of the branches. **Different foraging pattern**, same tree. This is one of the two ways NCERT says a species can dodge competition.',
        },
        {
          id: uuid(), x: 0.28, y: 0.55, label: 'Species 3 — the inner branches', icon: 'circle',
          detail: 'A third species hunts close to the trunk, inside the crown. The tree is not one resource any more — it has been **partitioned** into separate feeding areas.',
        },
        {
          id: uuid(), x: 0.62, y: 0.78, label: 'Species 4 & 5 — timing and habit', icon: 'circle',
          detail: 'The other way to partition a resource is the **clock** — **different times for feeding**. Different foraging pattern or different feeding time, either works. What matters is that the overlap shrinks.',
        },
        {
          id: uuid(), x: 0.16, y: 0.90, label: 'Result — co-existence', icon: 'circle',
          detail: '**Resource partitioning.** The five species **avoid competition and co-exist** because of **behavioural differences in their foraging activities** — a mechanism that promotes co-existence **rather than exclusion**. MacArthur showed this.',
        },
      ],
    },
    // ── 8 · Reasoning prompt ──────────────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "A barnacle species is found only on a narrow strip of a rocky coast. An ecologist experimentally removes a second, larger barnacle species from the area — and within a season the first species spreads right across the intertidal zone. Nothing else about the coast was changed. What has this experiment established?",
      options: [
        "That the restricted species was being held back by the presence of a competitively superior species, and not by any physical limit of the intertidal zone itself",
        "That the two barnacle species were living in mutualism, and removing one damaged the survival of the other",
        "That the removed species was a predator of the smaller barnacle and was eating it out of the intertidal zone",
        "That the intertidal zone became physically suitable for the smaller barnacle only after the larger one was taken away",
      ],
      correct_index: 0,
      reveal: "This is **competitive release** — NCERT's evidence for competition in nature, and Connell's Scottish rocky-coast experiment is the classic case. The smaller barnacle *Chthamalus* was always capable of living in the intertidal area; the larger, competitively superior *Balanus* was **excluding** it. Remove *Balanus*, and *Chthamalus* **expands its distributional range dramatically** — which proves the limit was the competitor, not the habitat. The tempting wrong answer is the last one: it feels like the same story, but it says the *zone* changed. It didn't. The rock, the tides and the salt were identical before and after — only the rival was gone, and that is precisely what makes the experiment evidence for competition. Mutualism is wrong (removing a mutualist would hurt, not help, the other), and *Balanus* excludes *Chthamalus* by competing for space, not by eating it.",
      difficulty_level: 2,
    },
    // ── 9 · Remember ──────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember',
      title: 'Lock These Down',
      markdown: "**Competition (the definition):** a process in which the **fitness of one species — its 'r', the intrinsic rate of increase — is significantly lower in the presence of another species.**\n\n**It is NOT limited to close relatives:** flamingoes and resident fishes compete for zooplankton in shallow South American lakes.\n\n**Resources need NOT be limiting:** in **interference competition**, the feeding efficiency of one species drops because of the interfering, inhibitory presence of another — even when food and space are abundant.\n\n**Gause's Competitive Exclusion Principle:** two **closely related** species competing for the **same resources cannot co-exist indefinitely**; the **competitively inferior** one is eliminated. *Condition:* true **if resources are limiting, but not otherwise.**\n\n**Resource partitioning:** competitors co-exist by choosing **different times for feeding** or **different foraging patterns**. **MacArthur — five closely related warbler species on the same tree**, co-existing through **behavioural differences in foraging**.\n\n**Named evidence:** Abingdon tortoise (Galapagos) went extinct within a decade of **goats** being introduced — greater **browsing efficiency**. **Connell** — ***Balanus*** dominates the intertidal and excludes ***Chthamalus*** on the **rocky sea coasts of Scotland**. **Herbivores and plants** are more adversely affected by competition than **carnivores**.",
    },
    // ── 10 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip',
      title: 'What NEET Actually Lifts From This Section',
      markdown: "**The two 'not entirely true' corrections:** NEET's favourite trick here is an option saying competition happens *only* between closely related species, or *only* when resources are limiting. Both are wrong. Unrelated species compete (flamingo–fish), and interference competition needs no scarcity.\n\n**The condition on Gause's principle:** the statement is examinable *with* its caveat — 'this may be true if resources are limiting, but not otherwise.' An option that states the principle as an absolute law is a trap.\n\n**Exclusion vs partitioning:** these are opposite outcomes and get swapped in options. Exclusion = the inferior species is **eliminated** (Gause). Partitioning = the species **co-exist** by splitting time or foraging pattern (MacArthur's warblers).\n\n**The name–example pairs are pure recall:** Gause → competitive exclusion (lab). Connell → *Balanus* excludes *Chthamalus*, Scotland. MacArthur → five warblers, one tree, resource partitioning. Abingdon tortoise → goats, Galapagos. Flamingo + fish → zooplankton, South American lakes. Mixing up which scientist goes with which example is where most marks are lost.\n\n**Classic NEET question:** \"Which of the following is an evidence for competitive release?\" → A species restricted to a small area expands its distributional range dramatically when the competing species is experimentally removed — as Connell showed with *Chthamalus* once *Balanus* was removed.",
    },
    // ── 11 · Inline quiz (last) ───────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'In a pond where food and space are both abundant, one species still feeds far less efficiently whenever a second species is present. What is this?',
          options: [
            'Interference competition, because the inhibitory presence of the other species lowers feeding efficiency even without scarcity',
            'Competitive release, because the species is being restricted to a smaller feeding area than it can use',
            'Resource partitioning, because the two species are dividing an abundant resource between themselves',
            'Amensalism, because the second species is harmed while the first one is entirely unaffected',
          ],
          correct_index: 0,
          explanation: "NCERT's second correction: resources need **not** be limiting for competition to occur. In **interference competition** the feeding efficiency of one species is reduced by the **interfering and inhibitory presence** of the other, even if food and space are abundant. Resource partitioning is tempting because the resource is plentiful — but partitioning is a mechanism that *avoids* competition and lets both species do fine; here one species is clearly doing worse.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'Five closely related warbler species live and feed on the same tree, and none of them is eliminated. Which statement explains this correctly?',
          options: [
            "Gause's principle has been disproved, since closely related species can always co-exist on a shared resource",
            'The five species are in mutualism on the tree, so each one benefits from the presence of the other four',
            'MacArthur showed they co-exist through resource partitioning — behavioural differences in their foraging activities',
            'The tree offers unlimited food, so their intrinsic rates of increase are identical and no species can be inferior',
          ],
          correct_index: 2,
          explanation: "This is **MacArthur's** classic case of **resource partitioning** — the warblers avoid competition and co-exist because of **behavioural differences in their foraging activities**, such as different feeding times or foraging patterns. The first option overreaches: Gause's principle is not disproved, it simply comes with a condition ('true if resources are limiting, but not otherwise'), and NCERT says recent studies do not support gross generalisations — species may evolve mechanisms promoting co-existence. Nothing here says the tree's food is unlimited, and warblers on a tree are not mutualists.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'The Abingdon tortoise of the Galapagos Islands became extinct within a decade after goats were introduced. What does NCERT give as the apparent reason?',
          options: [
            'The goats trampled the tortoise nests, destroying the eggs before they could hatch',
            'The goats carried a parasite that infected the tortoise population and wiped it out',
            'The goats and tortoises interbred, and the resulting hybrids were sterile',
            'The goats had greater browsing efficiency, so they out-competed the tortoise for the same vegetation',
          ],
          correct_index: 3,
          explanation: 'NCERT attributes the extinction to the **greater browsing efficiency of the goats** — the goats simply ate the shared vegetation better and faster. This is cited as **circumstantial evidence for competitive exclusion in nature**. The parasite option is the tempting one because it also explains a rapid wipe-out, but it belongs to a different interaction entirely (parasitism) and is not what NCERT says. Note also that goats and tortoises are not closely related — another reminder that competition is not restricted to close relatives.',
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which option states Gause's Competitive Exclusion Principle exactly as NCERT gives it, including its condition?",
          options: [
            'Any two species sharing a habitat must eventually partition the available resources between themselves',
            'Two closely related species competing for the same resources cannot co-exist indefinitely, the inferior one being eliminated — true if resources are limiting, but not otherwise',
            'Two unrelated species competing for the same resource will always both survive, because their intrinsic rates of increase differ',
            'Two closely related species competing for the same resources will always eliminate each other, whether or not resources are limiting',
          ],
          correct_index: 1,
          explanation: "The principle applies to **closely related species competing for the same resources**: they **cannot co-exist indefinitely** and the **competitively inferior one is eliminated eventually** — and NCERT immediately adds that this **may be true if resources are limiting, but not otherwise**. The last option is the trap: it states the principle as an absolute with no condition, and it also says the species eliminate *each other*, when only the inferior one goes. Partitioning is a possible mechanism, not something every pair of species must do.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
