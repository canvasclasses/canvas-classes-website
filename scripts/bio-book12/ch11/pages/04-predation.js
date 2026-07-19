'use strict';
/**
 * Class 12 Biology — Chapter 11: Organisms and Populations
 * Page 4 — Predation and the defences it drives.
 *
 * Source of truth: NCERT Class 12 Ch.11 (lebo111.txt), §11.1.4 Population
 * Interactions, part "(i) Predation" — predation as nature's way of transferring
 * plant-fixed energy to higher trophic levels; a seed-eating sparrow is no less a
 * predator; herbivores are, in a broad ecological context, not very different from
 * predators. Predators keep prey populations under control (prickly pear cactus in
 * Australia, early 1920s, controlled by an introduced cactus-feeding moth →
 * biological control in agricultural pest control) and maintain species diversity
 * by reducing the intensity of competition (starfish Pisaster on the American
 * Pacific Coast rocky intertidal; removal → >10 invertebrate species extinct within
 * a year through interspecific competition). Over-efficient predators drive prey
 * extinct and then themselves — hence predators in nature are 'prudent'. Prey
 * defences: cryptic colouration (some insects and frogs), being poisonous/
 * distasteful (Monarch butterfly, chemical acquired at the caterpillar stage by
 * feeding on a poisonous weed). Plant defences: ~25% of all insects are
 * phytophagous; thorns (Acacia, Cactus); chemicals that sicken/inhibit/kill —
 * Calotropis's cardiac glycosides; nicotine, caffeine, quinine, strychnine, opium.
 *
 * Rule 0: every fact here traces to that text. NOTE: hard shells and spines as
 * ANIMAL prey defences are NOT in the NCERT paragraph (it names only cryptic
 * colouration and distastefulness/poison), so they are deliberately omitted;
 * thorns appear only as a PLANT defence, exactly as NCERT has it. Competition,
 * parasitism, commensalism and mutualism are left for the following pages.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'predation-and-prey-defences',
  title: 'Predation — and the Arms Race It Starts',
  subtitle: "Predators are how the energy locked in plants climbs to the top of the food chain — and why a cactus stopped taking over Australia, why removing one starfish wiped out ten species, and why a butterfly can carry a poison it never made itself.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['predation', 'prey-defence', 'biological-control', 'herbivory', 'population-interactions', 'organisms-and-populations'],
  glossary: [
    { term: 'predation', definition: 'An interaction in which one species (the predator) benefits by eating another (the prey), which is harmed. It is nature\'s way of transferring the energy fixed by plants to higher trophic levels.' },
    { term: 'herbivory', definition: 'Animals feeding on plants. In a broad ecological sense a herbivore is not very different from a predator — for a plant, the herbivore *is* the predator.' },
    { term: 'phytophagous', definition: 'Feeding on plant sap and other plant parts. Nearly 25 per cent of all insects are phytophagous.' },
    { term: 'biological control', definition: 'Controlling a pest population by using its natural predator instead of chemicals. Agricultural pest control by this method rests on a predator\'s ability to regulate prey numbers — as the cactus-feeding moth did to prickly pear in Australia.' },
    { term: 'cryptic colouration (camouflage)', definition: 'Body colouring that blends an animal into its background so a predator does not detect it easily. Seen in some species of insects and frogs.' },
    { term: 'cardiac glycoside', definition: 'A highly poisonous chemical produced and stored by the weed *Calotropis*. It is why cattle and goats are never seen browsing on that plant.' },
    { term: "'prudent' predator", definition: 'A predator that does not overexploit its prey. If it were too efficient it would drive the prey extinct and then starve to extinction itself — so restraint is favoured in nature.' },
  ],
  blocks: [
    {
      id: '3f1b7a2c-9d40-4e61-8a35-0c7e5b91d204',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A rocky intertidal shore at low tide in dim light, starfish and mussels clinging to dark wet rock',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A rocky intertidal shore at low tide in the blue half-light just after dusk. Dark wet basalt rock fills the frame, crusted with clustered mussels and barnacles; two or three five-armed starfish cling to the rock surface, their bodies catching a faint cool highlight. Shallow tide pools reflect a dim sky. Painterly and atmospheric, naturalistic, dark overall tones (#0a0a0a base) with muted teal and slate highlights, shallow depth of field so the nearest starfish is sharp. No text, no labels, no diagram elements, no people.",
    },
    {
      id: '4a2c8b3d-0e51-4f72-9b46-1d8f6c02e315',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'A Butterfly Carrying Borrowed Poison',
      markdown: "A bird that catches a **Monarch butterfly** spits it out. The butterfly is highly **distasteful** to it — because of a special chemical sitting in its body.\n\nHere's the part worth pausing on: the butterfly never made that chemical. It picked it up earlier, back in its **caterpillar stage**, by feeding on a **poisonous weed**. The caterpillar ate poison, stored it, and the adult butterfly now walks around wearing a chemical shield it stole from a plant. Predation doesn't just kill prey — it pushes prey into inventing defences like this one. That's what this page is about.",
    },
    {
      id: '5b3d9c4e-1f62-4083-8c57-2e907d13f426',
      type: 'heading',
      order: 2,
      level: 2,
      text: "Predation — Nature's Way of Moving Energy Upward",
      objective: "By the end of this you can say what predation does for a community, and explain why a seed-eating sparrow counts as a predator.",
    },
    {
      id: '6c4e0d5f-2073-4194-9d68-3f018e24a537',
      type: 'text',
      order: 3,
      markdown: "Ask yourself a strange question: what would happen to all the energy fixed by **autotrophic organisms** if a community had no animals to eat the plants? It would sit there. Locked in leaves and stems, going nowhere.\n\nThat's the simplest way to hold **predation** in your head — it is **nature's way of transferring the energy fixed by plants to higher trophic levels**. The predator is the pipe. Without that pipe, the energy never climbs.\n\nWhen we say 'predator and prey', the picture that jumps to mind is a tiger and a deer. Fine — but a **sparrow eating a seed is no less a predator**. The seed is a living thing being eaten, and the energy in it moves up a level. Animals eating plants get their own name, **herbivores**, but in a broad ecological context they are **not very different from predators**. Keep that in mind — it is exactly the line NEET twists into a question.",
    },
    {
      id: '7d5f1e60-3184-42a5-8e79-40129f35b648',
      type: 'heading',
      order: 4,
      level: 2,
      text: 'The Other Jobs a Predator Does',
      objective: "By the end of this you can explain how predators control prey numbers and how they actually *raise* species diversity — with the two experiments NCERT names.",
    },
    {
      id: '8e602f71-4295-43b6-9f80-51230a46c759',
      type: 'text',
      order: 5,
      markdown: "Besides acting as **'conduits' for energy transfer** across trophic levels, predators do two more things.\n\n**One — they keep prey populations under control.** Take predators away and prey species could reach very high population densities and cause **ecosystem instability**. You can watch this happen whenever an **exotic species** is introduced into a new geographical area: it turns **invasive** and spreads fast, precisely because the invaded land **does not have its natural predators**. The **prickly pear cactus**, introduced into **Australia in the early 1920s**, caused havoc — it spread into **millions of hectares of rangeland**. Nothing stopped it. It was finally brought under control only after a **cactus-feeding predator, a moth**, was brought in from the cactus's natural habitat. That is the whole idea behind **biological control**: the pest-control methods used in agriculture are based on a **predator's ability to regulate prey population**, no chemicals needed.\n\n**Two — they maintain species diversity in a community**, by **reducing the intensity of competition among competing prey species**. This one surprises students, because it sounds backwards: how does an animal that *eats* species make there be *more* species? The classic evidence is from the **rocky intertidal communities of the American Pacific Coast**, where the starfish ***Pisaster*** is an important predator. In a field experiment, **all the starfish were removed** from an enclosed intertidal area. Within a year, **more than 10 species of invertebrates became extinct** — not eaten by anything, but wiped out by **interspecific competition**. The starfish had been holding the strongest competitors down; remove it and they took the place over.\n\nBut a predator can overdo it. If a predator is **too efficient and overexploits its prey**, the prey might become **extinct** — and following it, the **predator too becomes extinct for lack of food**. This is why **predators in nature are 'prudent'**. Restraint isn't kindness; it's survival.",
    },
    {
      id: '9f713082-53a6-44c7-8091-6234ab57d86a',
      type: 'heading',
      order: 6,
      level: 2,
      text: 'How Prey Fight Back',
      objective: "By the end of this you can list the defences prey species evolved against predation, and trace where the Monarch butterfly's poison comes from.",
    },
    {
      id: 'a0824193-64b7-45d8-91a2-7345bc68e97b',
      type: 'text',
      order: 7,
      markdown: "Being eaten is a strong pressure. So **prey species have evolved various defences to lessen the impact of predation**.\n\nThe first is simply **not being seen**. Some species of **insects and frogs** are **cryptically-coloured (camouflaged)** — their body colouring blends into the background so they **avoid being detected easily by the predator**. No fight, no running; the predator's eye just slides past.\n\nThe second is **not being worth eating**. Some prey are **poisonous and are therefore avoided by predators**. The **Monarch butterfly** is the standing example: it is **highly distasteful to its predator (a bird)** because of a **special chemical present in its body**. And, as the top of this page said, it doesn't manufacture that chemical. The butterfly **acquires this chemical during its caterpillar stage by feeding on a poisonous weed**. Learn that route — caterpillar → poisonous weed → chemical stored → distasteful adult.",
    },
    {
      id: 'b19352a4-75c8-46e9-82b3-8456cd79fa8c',
      type: 'heading',
      order: 8,
      level: 2,
      text: "Plants Can't Run Away",
      objective: "By the end of this you can explain why herbivory is a harsher problem for plants than predation is for animals, and name the thorn-bearers and the chemical defences NCERT lists.",
    },
    {
      id: 'c2a463b5-86d9-47fa-93c4-9567de8a0b9d',
      type: 'text',
      order: 9,
      markdown: "**For plants, herbivores are the predators.** And nearly **25 per cent of all insects are phytophagous** — feeding on **plant sap and other parts of plants**. That is one insect in four, living off plants.\n\nThe problem is **particularly severe for plants because, unlike animals, they cannot run away from their predators**. A deer can bolt. A shrub has to stand there and take it. So plants have evolved an **astonishing variety of morphological and chemical defences** against herbivores.\n\n**Morphological defence — thorns.** **Thorns** are the most common morphological means of defence, and NCERT names two plants that carry them: ***Acacia*** and ***Cactus***.\n\n**Chemical defence — make the herbivore regret it.** Many plants **produce and store chemicals** that **make the herbivore sick when eaten**, **inhibit feeding or digestion**, **disrupt its reproduction**, or even **kill it**. You have probably walked past the weed ***Calotropis*** growing in abandoned fields. It produces **highly poisonous cardiac glycosides** — and that is exactly why you **never see cattle or goats browsing on it**. They know.\n\nHere's the twist that makes this examinable. A whole set of chemicals we **extract from plants on a commercial scale** — **nicotine, caffeine, quinine, strychnine, opium** — were not made for us at all. Plants produce them **as defences against grazers and browsers**. Your morning coffee is a plant's poison, repurposed.\n\nPredation is one species eating another. But two species can hurt each other without either one being eaten — by simply wanting the same thing. That's competition, and it's next.",
    },
    {
      id: 'd3b574c6-97ea-48fb-84d5-a678ef9b1cae',
      type: 'interactive_image',
      order: 10,
      src: '',
      alt: 'A panel of anti-predator defences: a camouflaged insect on bark, a camouflaged frog, a Monarch butterfly, thorns on an Acacia twig, spiny cactus pads, and a Calotropis shoot with milky sap',
      caption: '📸 Tap each dot to explore how prey and plants stop themselves from being eaten',
      generation_prompt: "Scientific textbook illustration: a single wide panel showing five separate anti-predator defence examples arranged left to right against one continuous dark background. Flat 2D educational diagram on a dark background (#0a0a0a near-black), clean white outlines, biologically accurate proportions, no baked-in text labels and no leader lines. Far left: a stick-like leaf insect resting on a strip of brown bark, its body drawn in nearly the same brown/tan tones as the bark so it almost disappears (cryptic colouration). Next: a small frog crouched on a mottled green forest-floor patch, its green and grey blotches matching the substrate exactly. Centre: a Monarch butterfly shown wings-open from above, orange wing panels with strong black vein borders and white spots along the black margins, drawn crisply and boldly so it looks conspicuous rather than hidden; beside it a small milkweed shoot with a caterpillar on the leaf. Next: a thin Acacia twig bearing long paired straight white thorns and small bipinnate compound leaflets in green. Far right: a flat oval cactus pad in green covered in clusters of sharp spines, and beside it an upright Calotropis shoot with thick opposite grey-green leaves and a broken leaf stalk releasing a drop of white milky latex. Functional colours: green = living plant tissue, brown/tan = bark and dead matter, white = thorns/spines/latex, orange and black = the butterfly's warning colours. Standard biology textbook illustration style, no photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: 'e4c685d7-a8fb-49ac-95e6-b789f0ac2dbf', x: 0.09, y: 0.52, label: 'Cryptically-coloured insect', detail: 'Some species of **insects** are **cryptically-coloured (camouflaged)**. The colouring lets them **avoid being detected easily by the predator** — the cheapest defence there is, because the attack never starts.', icon: 'circle' },
        { id: 'f5d796e8-b90c-4abd-86f7-c890a1bd3ec0', x: 0.27, y: 0.6, label: 'Camouflaged frog', detail: 'NCERT names **frogs** alongside insects as cryptically-coloured prey. Blending into the background is a defence that **lessens the impact of predation** without the animal having to fight or flee.', icon: 'circle' },
        { id: 'a6e807f9-ca1d-4bce-97a8-d901b2ce4fd1', x: 0.47, y: 0.4, label: 'Monarch butterfly — borrowed poison', detail: 'The **Monarch butterfly** is **highly distasteful to its predator (a bird)** because of a **special chemical in its body**. It **acquires that chemical during its caterpillar stage by feeding on a poisonous weed** — it never makes the poison itself.', icon: 'circle' },
        { id: 'b7f918a0-db2e-4cdf-a8b9-ea12c3df5ae2', x: 0.68, y: 0.45, label: 'Thorns on Acacia', detail: '**Thorns** are the most common **morphological** defence of plants against herbivores. NCERT names ***Acacia*** and ***Cactus*** as the thorn-bearing examples.', icon: 'circle' },
        { id: 'c80a29b1-ec3f-4de0-b9ca-fb23d4e06bf3', x: 0.84, y: 0.62, label: 'Cactus spines', detail: 'A plant **cannot run away from its predators** — that is why herbivory hits plants harder than predation hits animals. ***Cactus*** answers with a body armoured in spines.', icon: 'circle' },
        { id: 'd91b3ac2-fd40-4ef1-8adb-0c34e5f17c04', x: 0.94, y: 0.36, label: 'Calotropis — cardiac glycosides', detail: 'The weed ***Calotropis*** of abandoned fields produces **highly poisonous cardiac glycosides**. That is why you **never see cattle or goats browsing on this plant**.', icon: 'circle' },
      ],
    },
    {
      id: 'ea2c4bd3-0e51-4f02-9bec-1d45f6028d15',
      type: 'reasoning_prompt',
      order: 11,
      reasoning_type: 'logical',
      prompt: "In the rocky intertidal of the American Pacific Coast, every starfish *Pisaster* was removed from an enclosed area. Within a year more than 10 invertebrate species had disappeared. The starfish ate invertebrates, so removing it should have *helped* them. What actually explains the crash?",
      options: [
        "Without the starfish stirring the water, oxygen fell and the weaker invertebrate species suffocated one after another",
        "The starfish had been reducing the intensity of competition among prey; once it was gone, the strongest competitors excluded the rest and interspecific competition drove them extinct",
        "The removed starfish were replaced by a more efficient predator that overexploited the prey and pushed 10 species to extinction",
        "The invertebrates lost their cryptic colouration cue and became easy targets for birds feeding at low tide",
      ],
      reveal: "Predators **maintain species diversity in a community by reducing the intensity of competition among competing prey species**. *Pisaster* was holding the dominant competitors in check. Remove it and those competitors took over the space, and **more than 10 species of invertebrates became extinct within a year because of interspecific competition** — competition, not predation, did the killing. The tempting wrong answer is the 'more efficient predator' one, because NCERT does say an over-efficient predator can drive prey extinct — but in this experiment **no predator was left**; that is the entire point of removing the starfish. Oxygen and colouration play no part in the NCERT account.",
      difficulty_level: 3,
    },
    {
      id: 'fb3d5ce4-1f62-4013-8cfd-2e560713ae26',
      type: 'callout',
      order: 12,
      variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Predation = nature's way of transferring the energy fixed by plants to higher trophic levels.** A **sparrow eating a seed** is no less a predator; **herbivores**, ecologically, are not very different from predators.\n- **Three predator roles:** (1) **conduits** for energy transfer across trophic levels; (2) **keep prey populations under control** — without them prey reach high densities and cause **ecosystem instability**; (3) **maintain species diversity** by **reducing the intensity of competition** among prey.\n- **Prickly pear cactus** → introduced into **Australia in the early 1920s** → spread over **millions of hectares** → controlled by an introduced **cactus-feeding moth**. This is the model for **biological control** in agricultural pest control.\n- **Starfish *Pisaster*** → **rocky intertidal, American Pacific Coast** → removed → **>10 invertebrate species extinct within a year** due to **interspecific competition**.\n- **Too-efficient predator → prey extinct → predator extinct** for lack of food. Hence predators in nature are **'prudent'**.\n- **Prey defences:** **cryptic colouration (camouflage)** in some insects and frogs; being **poisonous/distasteful** — the **Monarch butterfly**, whose chemical is **acquired at the caterpillar stage from a poisonous weed**.\n- **Plant defences:** **~25% of all insects are phytophagous**; plants **cannot run away**. **Thorns → *Acacia*, *Cactus***. **Chemicals → *Calotropis* makes highly poisonous cardiac glycosides**; **nicotine, caffeine, quinine, strychnine, opium** are all anti-grazer/browser defences.",
    },
    {
      id: 'ac4e6df5-2073-4124-9d0e-3f671824bf37',
      type: 'callout',
      order: 13,
      variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**The five commercial chemicals are a guaranteed list-question:** **nicotine, caffeine, quinine, strychnine, opium** — all produced by plants **as defences against grazers and browsers**, not for human use. Mnemonic: **\"Never Chew Quinine, Strychnine's Opium\"**. Distractors slip in a chemical NCERT never lists (morphine, capsaicin, cardiac glycoside from a wrong plant) — reject it.\n\n**Two named plants, two named defences, don't cross them:** **thorns → *Acacia* and *Cactus***; **cardiac glycosides → *Calotropis***. Papers love swapping the plant.\n\n**Monarch butterfly — the source of the chemical is the trap, not the effect.** Everyone knows it's distasteful to birds. The mark is in *how*: **acquired during the caterpillar stage by feeding on a poisonous weed**. An option saying the butterfly *synthesises* the chemical itself is wrong.\n\n**'Prudent' predator:** the reason is self-interest — an over-efficient predator **drives its prey extinct and then goes extinct itself for lack of food**.\n\n**Classic NEET question:** \"Removal of the starfish *Pisaster* from an intertidal area caused the extinction of more than 10 invertebrate species. This demonstrates that predators —\" → **maintain species diversity by reducing the intensity of interspecific competition among prey**.",
    },
    {
      id: 'bd5f7e06-3184-4235-8e1f-40782935c048',
      type: 'inline_quiz',
      order: 14,
      pass_threshold: 0.67,
      questions: [
        {
          id: 'ce607f17-4295-4346-9f20-51893a46d159',
          question: "The prickly pear cactus that overran millions of hectares of Australian rangeland in the early 1920s was finally brought under control by:",
          options: [
            "Introducing a starfish predator from the American Pacific Coast",
            "Spraying cardiac glycosides extracted from Calotropis over the rangeland",
            "Introducing a cactus-feeding moth from the cactus's natural habitat",
            "Introducing Acacia, whose thorns crowded the cactus out of the rangeland",
          ],
          correct_index: 2,
          explanation: "The invasive cactus spread unchecked because the invaded land **had no natural predators of it**; it was controlled only after a **cactus-feeding predator, a moth, was introduced from the cactus's natural habitat** — the textbook case of **biological control**. *Pisaster* is the tempting pick because it is the other famous predator on this page, but it is a starfish of the rocky intertidal and has nothing to do with cacti. Cardiac glycosides are *Calotropis*'s own defence chemical, not a sprayed pesticide, and *Acacia* is named only for thorns.",
          difficulty_level: 1,
        },
        {
          id: 'df718028-53a6-4457-8031-629a4b57e26a',
          question: "Why is the Monarch butterfly avoided by birds?",
          options: [
            "It stores a special chemical that it acquired as a caterpillar by feeding on a poisonous weed, which makes it highly distasteful",
            "It synthesises a bitter cardiac glycoside in its own body once it emerges as an adult butterfly",
            "Its wing colouration is cryptic, so birds hunting it are unable to detect it against the background",
            "It feeds on Calotropis nectar as an adult and concentrates the plant's thorn toxins in its wings",
          ],
          correct_index: 0,
          explanation: "The Monarch is **highly distasteful to its predator (a bird)** because of a **special chemical present in its body**, and it **acquires that chemical during its caterpillar stage by feeding on a poisonous weed** — it does not manufacture it. The 'synthesises it itself as an adult' option is the trap: the effect is right but the source is wrong, and cardiac glycosides belong to *Calotropis*, not the butterfly. The Monarch's defence is distastefulness, not camouflage — cryptic colouration is the defence of some insects and frogs.",
          difficulty_level: 2,
        },
        {
          id: 'ea82913a-64b7-4568-9142-73ab5c68f37b',
          question: "Nicotine, caffeine, quinine, strychnine and opium are produced by plants primarily because:",
          options: [
            "They attract specific pollinators to the flower and so improve the plant's seed set",
            "They are waste products the plant cannot excrete and so stores in its tissues",
            "They speed up the plant's own digestion of sap and stored food reserves",
            "They act as defences against grazers and browsers that feed on the plant",
          ],
          correct_index: 3,
          explanation: "NCERT states plainly that this whole set of substances, which we **extract from plants on a commercial scale**, is **produced by plants as defences against grazers and browsers** — chemicals that sicken the herbivore, inhibit feeding or digestion, disrupt reproduction, or kill it. Pollinator attraction is a different plant strategy altogether and is not the reason given for these compounds; and they are active defensive chemicals, not stored waste.",
          difficulty_level: 2,
        },
        {
          id: 'fb93a24b-75c8-4679-8253-84bc6d79048c',
          question: "In a broad ecological context, a sparrow eating a seed is regarded as:",
          options: [
            "A parasite, since the seed is harmed while the sparrow is benefitted and the two live closely together",
            "A predator, since predation is nature's way of transferring plant-fixed energy to higher trophic levels",
            "A commensal, since the plant produces far more seeds than the sparrow could ever consume",
            "An amensal, since the seed population is harmed while the sparrow gains nothing from it",
          ],
          correct_index: 1,
          explanation: "NCERT says a **sparrow eating any seed is no less a predator** — predation is the transfer of the energy fixed by plants to **higher trophic levels**, and animals eating plants (herbivores) are, ecologically, **not very different from predators**. Parasitism is the tempting choice because one species benefits and the other is harmed, but in parasitism the parasite lives closely with a **host it does not consume outright**; the sparrow simply eats the seed. Commensalism means the other species is unharmed, and amensalism means one is harmed while the other **gains nothing** — the sparrow clearly gains a meal.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
