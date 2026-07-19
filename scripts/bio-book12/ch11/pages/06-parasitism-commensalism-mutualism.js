'use strict';
/**
 * Class 12 Biology — Chapter 11: Organisms and Populations
 * Page 6 — Parasitism, Commensalism & Mutualism. Closing page of the chapter.
 *
 * Source of truth: NCERT Class 12 Ch.11 (lebo111.txt), §11.1.4 "Population
 * Interactions", parts (iii) Parasitism, (iv) Commensalism and (v) Mutualism,
 * plus Table 11.1 and Figures 11.4 / 11.5. Rule 0: every fact, name and example
 * here traces to that text — host-specificity and co-evolution, the four
 * parasitic adaptations (loss of unnecessary sense organs, adhesive organs or
 * suckers, loss of digestive system, high reproductive capacity), the liver
 * fluke's two intermediate hosts and the malarial parasite's mosquito vector,
 * the parasite's effects on host survival/growth/reproduction/population density
 * and vulnerability to predation, ectoparasites (lice on humans, ticks on dogs,
 * marine-fish copepods, Cuscuta on hedge plants having lost chlorophyll and
 * leaves) vs endoparasites (liver, kidney, lungs, red blood cells; simplified
 * morphology, emphasised reproductive potential), brood parasitism (cuckoo/koel
 * and crow, egg mimicry in size and colour), commensalism (orchid epiphyte on a
 * mango branch, barnacles on a whale's back, cattle egret and grazing cattle,
 * sea anemone and clown fish), and mutualism (lichens, mycorrhizae, the fig–wasp
 * one-to-one relationship, the Mediterranean orchid Ophrys and its sexual
 * deceit). Nothing invented.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'parasitism-commensalism-and-mutualism',
  title: 'Parasitism, Commensalism & Mutualism',
  subtitle: "A flower that pretends to be a female bee, a bird that outsources its parenting, a fungus and an alga living as one — three ways two species can live closely together, and the plus-and-minus scorecard that tells them apart.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['population-interactions', 'parasitism', 'commensalism', 'mutualism', 'brood-parasitism', 'co-evolution', 'organisms-and-populations'],
  glossary: [
    { term: 'parasitism', definition: 'An interaction in which one species (the parasite) benefits and the other (the host) is harmed — a (+ –) interaction. The parasitic mode of life ensures free lodging and meals, which is why parasitism has evolved in so many taxonomic groups, from plants to higher vertebrates.' },
    { term: 'ectoparasite', definition: 'A parasite that feeds on the external surface of the host. The familiar examples are lice on humans and ticks on dogs; many marine fish are infested with ectoparasitic copepods, and Cuscuta on hedge plants is the plant example.' },
    { term: 'endoparasite', definition: 'A parasite that lives inside the host body at different sites — liver, kidney, lungs, red blood cells. Its life cycle is more complex because of extreme specialisation, its morphology and anatomy are greatly simplified, and its reproductive potential is emphasised.' },
    { term: 'brood parasitism', definition: 'A form of parasitism in birds in which the parasitic bird lays its eggs in the nest of its host and lets the host incubate them. The cuckoo (koel) and the crow are the example to watch during the breeding season.' },
    { term: 'commensalism', definition: 'An interaction in which one species benefits and the other is neither harmed nor benefited — a (+ 0) interaction. Orchid on a mango branch, barnacles on a whale, cattle egret with grazing cattle, and clown fish among sea anemone tentacles.' },
    { term: 'mutualism', definition: 'An interaction that confers benefits on both the interacting species — a (+ +) interaction. Lichens, mycorrhizae and plant–pollinator partnerships such as the fig and its wasp are NCERT\'s examples.' },
    { term: 'co-evolution', definition: 'The tightly linked evolution of two interacting species, where a change in one forces a matching change in the other. It runs in host–parasite pairs and in plant–pollinator pairs — if the female bee\'s colour pattern changed, the Ophrys petal would have to co-evolve to keep the resemblance.' },
    { term: 'sexual deceit', definition: 'The trick used by the Mediterranean orchid Ophrys. One petal resembles the female of a bee species in size, colour and markings, so the male bee pseudocopulates with the flower and carries pollen away. The orchid offers no reward at all.' },
  ],
  blocks: [
    {
      id: 'a1c47f20-6d3b-4e58-9f21-0b7e5a913c40',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A Mediterranean hillside at dusk with an orchid spike in the foreground and a single bee approaching one of its flowers',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A dry Mediterranean hillside in low evening light, scrub and stone fading into haze. In the near foreground, a single slender orchid spike carries a few small flowers, one flower's lower petal catching the last warm light with a soft velvety texture and faint markings. A single bee hovers a hand's width from that flower, wings blurred, drawn toward it. Behind, out of focus, a mango branch heavy with an epiphytic orchid and, further back, a lichen-crusted rock — all suggested, never labelled. Painterly atmospheric illustration, naturalistic, deep dark tones throughout (#0a0a0a base), muted earthy palette, shallow depth of field. No people, no text, no labels, no diagram elements, no arrows.",
    },
    {
      id: 'b2d58031-7e4c-4f69-8032-1c8f6b024d51',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'A flower that lies to a bee',
      markdown: "The Mediterranean orchid **Ophrys** does not pay its pollinator anything. No nectar, no reward. Instead, one petal of its flower has evolved an uncanny resemblance to the **female of a bee species** — matching her in **size, colour and markings**.\n\nA male bee arrives, is convinced, and **pseudocopulates** with the flower. He gets nothing. While he is at it, the flower dusts him with pollen. He flies off, finds another Ophrys, is fooled again, and delivers the pollen. The orchid gets pollinated on a lie.\n\nHere is the part NCERT wants you to notice. If the **female bee's colour patterns change even slightly** during evolution, the trick stops working — pollination success drops — unless the orchid flower **co-evolves** to keep the resemblance. Two species, locked step for step. That is co-evolution you can actually watch.",
    },
    {
      id: 'c3e69142-8f5d-4a7a-9143-2d906c135e62',
      type: 'text',
      order: 2,
      markdown: "You already have the scorecard from Table 11.1. Put a **+** when a species benefits, a **–** when it is harmed, and a **0** when it is neither harmed nor benefited. Read the pair of signs and you have the name of the interaction.\n\nThree of those interactions are on this page, and they cover the full range of what two species can do to each other:\n\n- **Parasitism (+ –)** — one gains, the other pays.\n- **Commensalism (+ 0)** — one gains, the other does not notice.\n- **Mutualism (+ +)** — both gain.\n\nOne line ties them together. **Predation, parasitism and commensalism share a common characteristic — the interacting species live closely together.** That closeness is exactly what lets a parasite specialise on one host, and exactly what lets a flower and an insect evolve into each other's shape.",
    },
    {
      id: 'd4f70253-9061-4b8b-8254-3ea17d246f73',
      type: 'heading',
      order: 3,
      level: 2,
      text: 'Parasitism — Free Lodging and Meals',
      objective: "By the end of this you can list the four adaptations a parasitic life pushes for, and explain why an endoparasite is structurally simpler than an ectoparasite.",
    },
    {
      id: 'e5081364-a172-4c9c-9365-4fb28e357084',
      type: 'text',
      order: 4,
      markdown: "The parasitic mode of life ensures **free lodging and meals**. Given that deal, it is no surprise that parasitism has evolved in **so many taxonomic groups, from plants to higher vertebrates**.\n\nMany parasites have become **host-specific** — they can parasitise only a **single species** of host. Once that happens, host and parasite start to **co-evolve**. Think of it as a slow arms race: if the host evolves a special mechanism for **rejecting or resisting** the parasite, the parasite must evolve a mechanism to **counteract and neutralise** it, or it loses the only host it can live on.\n\nLiving inside or on another body means most of the equipment a free-living animal needs is dead weight. So parasites evolve **special adaptations** — and NCERT names four:\n\n- **Loss of unnecessary sense organs** — you do not need to hunt for food that surrounds you.\n- **Adhesive organs or suckers** to cling on to the host — the one thing you must not do is fall off.\n- **Loss of the digestive system** — the host has already digested the meal for you.\n- **High reproductive capacity** — the odds of any one offspring finding a host are terrible, so make an enormous number.\n\nThe life cycles of parasites are often **complex**, involving **one or two intermediate hosts or vectors** to reach the primary host. The **human liver fluke** (a trematode) depends on **two intermediate hosts — a snail and a fish** — to complete its life cycle. The **malarial parasite** needs a **vector, the mosquito**, to spread to other hosts.\n\nWhat does the host lose? The **majority of parasites harm the host**. They may **reduce the survival, growth and reproduction** of the host and **reduce its population density**. They may also render the host **more vulnerable to predation by making it physically weak** — the parasite does not do the killing, it just makes the host easy to kill.",
    },
    {
      id: 'f6192475-a283-4dad-8476-5ac394468195',
      type: 'text',
      order: 5,
      markdown: "Now split parasites by **where they sit**.\n\n**Ectoparasites** feed on the **external surface** of the host. The most familiar are the **lice on humans** and the **ticks on dogs**. Many **marine fish** are infested with **ectoparasitic copepods**. And plants do it too — **Cuscuta**, a parasitic plant commonly found growing on **hedge plants**, has **lost its chlorophyll and leaves** in the course of evolution, and derives its nutrition from the host plant it parasitises. That is the four-adaptation logic in a plant: drop the machinery you no longer need.\n\nOne famous exception to keep straight: the **female mosquito is not considered a parasite**, although it needs our blood for reproduction.\n\n**Endoparasites** live **inside the host body at different sites — liver, kidney, lungs, red blood cells**. Their life cycles are **more complex** because of their **extreme specialisation**. Inside a host, the loss of unneeded structures goes further than for any ectoparasite: their **morphological and anatomical features are greatly simplified**, while their **reproductive potential is emphasised**. Simple body, enormous output — that is the endoparasite signature.\n\n**Brood parasitism** is the odd one out, because nothing is being eaten. In birds, the **parasitic bird lays its eggs in the nest of its host and lets the host incubate them**. The host spends its season raising someone else's chick. During the course of evolution, the eggs of the parasitic bird have evolved to **resemble the host's egg in size and colour**, to reduce the chances of the host bird **detecting the foreign eggs and ejecting them** from the nest. The pair to watch in your neighbourhood park during the breeding season (spring to summer) is the **cuckoo (koel)** and the **crow**.",
    },
    {
      id: '07203586-b394-4ebe-9587-6bd4a5579206',
      type: 'heading',
      order: 6,
      level: 2,
      text: 'Commensalism — One Gains, the Other Shrugs',
      objective: "By the end of this you can name NCERT's four examples of commensalism and say exactly who benefits and who is unaffected in each.",
    },
    {
      id: '18314697-c4a5-4fcf-a698-7c5e6a68a317',
      type: 'text',
      order: 7,
      markdown: "**Commensalism** is the interaction in which **one species benefits and the other is neither harmed nor benefited** — a clean **(+ 0)**. NCERT gives four examples, and NEET rotates through all four.\n\n- **An orchid growing as an epiphyte on a mango branch.** The orchid gets a place to sit up in the light. The **mango tree derives no apparent benefit** — and no harm either.\n- **Barnacles growing on the back of a whale.** The barnacles get a free ride through food-rich water. The **whale derives no apparent benefit**.\n- **The cattle egret and grazing cattle** — a sight you will catch in any farmed rural area. The egrets **always forage close to where the cattle are grazing**, because the cattle, as they move, **stir up and flush out insects** from the vegetation that the egrets would otherwise find hard to spot and catch. The cattle lose nothing.\n- **The sea anemone and the clown fish.** The anemone has **stinging tentacles**; the clown fish lives among them. The **fish gets protection from predators**, which stay away from those tentacles. The **anemone does not appear to derive any benefit** by hosting the clown fish.\n\nNotice the phrasing NCERT keeps using — *no apparent benefit*. The second partner is not paying and not being paid. The moment you can show it is being harmed, the interaction is no longer commensalism.",
    },
    {
      id: '29425708-d5b6-4a01-b7a9-8d6f7b79a428',
      type: 'heading',
      order: 8,
      level: 2,
      text: 'Mutualism — Both Sides Get Paid',
      objective: "By the end of this you can explain what each partner gives and gets in lichens, mycorrhizae and the fig–wasp relationship, and why Ophrys is the exception that pays nothing.",
    },
    {
      id: '3a536819-e6c7-4b12-c8ba-9e708c8ab539',
      type: 'text',
      order: 9,
      markdown: "**Mutualism** confers benefits on **both** the interacting species — **(+ +)**. Start with the two intimate ones:\n\n- **Lichens** represent an intimate mutualistic relationship between a **fungus** and **photosynthesising algae or cyanobacteria**.\n- **Mycorrhizae** are associations between **fungi and the roots of higher plants**. The **fungi help the plant absorb essential nutrients from the soil**; the **plant in turn provides the fungi with energy-yielding carbohydrates**. Payment in both directions — that is why it is mutualism and not parasitism.\n\nThe **most spectacular and evolutionarily fascinating** examples of mutualism are in **plant–animal relationships**. Plants need animals to **pollinate their flowers and disperse their seeds**, and animals have to be paid **'fees'** for that service. Plants offer **pollen and nectar** for pollinators and **juicy, nutritious fruits** for seed dispersers.\n\nBut a paying system must be safeguarded against **'cheaters'** — animals that steal nectar without doing any pollination. That pressure is why plant–animal interactions so often involve **co-evolution of the mutualists**: the evolution of the flower and of its pollinator species are **tightly linked** with one another.\n\nThe **fig** is the classic. In many species of fig trees there is a **tight one-to-one relationship** with the pollinator species of **wasp** — a given fig species can be pollinated **only by its 'partner' wasp species and no other**. The female wasp uses the fruit not only as an **oviposition (egg-laying) site** but uses the **developing seeds within the fruit for nourishing its larvae**. She pollinates the fig inflorescence **while searching for suitable egg-laying sites**. In return for the favour of pollination, the fig **offers the wasp some of its developing seeds** as food for the developing larvae. Both partners pay, both partners collect.\n\nAnd then there is the cheat. **Orchids** show a bewildering diversity of floral patterns, many evolved to **attract the right pollinator insect** (bees and bumblebees) and guarantee pollination. **Not all orchids offer rewards.** The Mediterranean orchid **Ophrys** employs **'sexual deceit'** — one petal resembling the female bee in **size, colour and markings**, the male bee **pseudocopulating** and carrying pollen to the next flower. It is a mutualism-shaped machine running without a fee.\n\nThat closes Chapter 11 — from a single population's density and growth curve, all the way out to the +, – and 0 that link one population to another.",
    },
    {
      id: '4b64792a-f7d8-4c23-d9cb-af819b9bc64a',
      type: 'interactive_image',
      order: 10,
      src: '',
      alt: 'Diagram of a Mediterranean Ophrys orchid flower whose lower petal resembles a female bee, with a male bee pseudocopulating and picking up pollen',
      caption: '📸 Tap each dot to follow how the Ophrys orchid gets pollinated without paying a fee',
      generation_prompt: "Scientific textbook illustration in the spirit of NCERT Fig 11.5, 'bee — a pollinator on orchid flower'. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Centre: a single Mediterranean Ophrys orchid flower drawn large and in clean white outline with biologically accurate orchid proportions — narrow upper sepals and petals spread above, and one enlarged, rounded, velvety-looking lower petal (the labellum) whose shape, tone and banded markings clearly mimic the body of a female bee. Resting on that lower petal, a male bee shown in side view, body pressed against the petal in a pseudocopulation posture. On the bee's head and thorax, a small scatter of pollen grains rendered as pale yellow specks; a matching pollen-bearing structure at the top of the flower's column just above the bee's back, so the contact point is obvious. To the right and slightly behind, a second, smaller Ophrys flower of the same species drawn faintly, with a thin faint white dashed flight line from the bee curving toward it to suggest pollen transfer. Functional colour: muted green stem and leaves, warm brown-and-cream bee, dull maroon-brown labellum with paler markings, pale yellow pollen only. No text or labels baked into the image, no photorealism, no cartoon, no mascots — standard biology textbook illustration conventions.",
      hotspots: [
        { id: '5c75803b-08e9-4d34-ea0c-b0920ca7d75b', x: 0.46, y: 0.62, label: 'The petal that lies', detail: "**One petal** of the Ophrys flower bears an **uncanny resemblance to the female of a bee species** — in **size, colour and markings**. This is the whole mechanism of **'sexual deceit'**.", icon: 'circle' },
        { id: '6d86914c-19fa-4e45-fb1d-c1a31db86c6c', x: 0.5, y: 0.72, label: 'The male bee, fooled', detail: "The **male bee** is attracted to what it **perceives as a female** and **'pseudocopulates'** with the flower. It is not feeding — Ophrys offers **no reward** at all.", icon: 'circle' },
        { id: '7e97a25d-2a0b-4f56-0c2e-d2a42ec97d7d', x: 0.52, y: 0.42, label: 'Pollen loaded on', detail: "During that process the bee is **dusted with pollen** from the flower. The deceit is the only thing making the bee stay in contact long enough for this to happen.", icon: 'circle' },
        { id: '8fa8b36e-3b1c-4067-1d3f-e3b53fda8e8e', x: 0.82, y: 0.34, label: 'Pollen delivered', detail: "When the **same bee pseudocopulates with another flower**, it **transfers pollen** to it and thus **pollinates** it. The orchid gets cross-pollination for free.", icon: 'circle' },
        { id: '90b9c47f-4c2d-4178-2e40-f4c64a0b9f9f', x: 0.2, y: 0.5, label: 'Co-evolution, locked in', detail: "If the **female bee's colour patterns change even slightly** during evolution, **pollination success will be reduced** — unless the orchid flower **co-evolves** to maintain the resemblance of its petal. Neither partner can drift alone.", icon: 'circle' },
        { id: 'a1cad580-5d3e-4289-3f51-05d75b1cafa0', x: 0.5, y: 0.9, label: 'Not all orchids do this', detail: "Orchids show a **bewildering diversity of floral patterns**, most evolved to attract the right pollinator (**bees and bumblebees**) with a genuine reward. **Not all orchids offer rewards** — Ophrys is the named exception.", icon: 'circle' },
      ],
    },
    {
      id: 'b2dbe691-6e4f-439a-4062-16e86c2cb0b1',
      type: 'comparison_card',
      order: 11,
      title: 'Parasitism vs Commensalism vs Mutualism',
      columns: [
        {
          heading: 'Parasitism (+ –)',
          points: [
            'Parasite benefits; host is harmed',
            'Host loses survival, growth and reproduction; its population density falls',
            'Host rendered more vulnerable to predation by being made physically weak',
            'Adaptations: loss of unnecessary sense organs, adhesive organs or suckers, loss of digestive system, high reproductive capacity',
            'Ectoparasites: lice on humans, ticks on dogs, copepods on marine fish, Cuscuta on hedge plants',
            'Endoparasites: in liver, kidney, lungs, red blood cells — greatly simplified body, emphasised reproductive potential',
            'Brood parasitism: cuckoo (koel) lays eggs in the crow\'s nest; eggs mimic the host\'s in size and colour',
          ],
        },
        {
          heading: 'Commensalism (+ 0)',
          points: [
            'One species benefits; the other is neither harmed nor benefited',
            'Orchid as an epiphyte on a mango branch — mango gets no apparent benefit',
            'Barnacles on the back of a whale — whale gets no apparent benefit',
            'Cattle egret and grazing cattle — cattle stir up and flush out insects for the egret',
            'Sea anemone and clown fish — fish gets protection from the stinging tentacles; anemone gains nothing apparent',
            'Interacting species still live closely together',
            'No fee is paid in either direction',
          ],
        },
        {
          heading: 'Mutualism (+ +)',
          points: [
            'Both interacting species benefit',
            'Lichens: a fungus + photosynthesising algae or cyanobacteria',
            'Mycorrhizae: fungi + roots of higher plants — fungi supply soil nutrients, plant supplies carbohydrates',
            'Plant–pollinator: fees paid as pollen and nectar; juicy fruits for seed dispersers',
            'Fig and wasp: a tight one-to-one species-specific relationship',
            'Female wasp uses the fig fruit as an oviposition site and its developing seeds to nourish her larvae',
            'Ophrys: the exception — pollination by sexual deceit, no reward offered',
          ],
        },
      ],
    },
    {
      id: 'c3ecf7a2-7f50-44ab-5173-27f97d3dc1c2',
      type: 'reasoning_prompt',
      order: 12,
      reasoning_type: 'logical',
      prompt: "A cattle egret walks beside a grazing cow all morning. Every time the cow's hooves disturb the grass, insects fly up and the egret snaps them out of the air. The cow feeds exactly as it would have alone — it is neither helped nor hindered. Which interaction is this, and why?",
      options: [
        "Mutualism, because the egret removes insects that would otherwise trouble the cow, so both partners gain",
        "Commensalism, because the egret benefits from the flushed-out insects while the cow is neither harmed nor benefited",
        "Parasitism, because the egret is taking food that the cow's movement made available, at the cow's expense",
        "Amensalism, because the cow's grazing is what disturbs the insects while the cow itself is unaffected",
      ],
      reveal: "The egret gains and the cow is neither harmed nor benefited — a (+ 0), which is commensalism, and NCERT names cattle egret and grazing cattle as a classic example of it. The tempting wrong answer is mutualism: it sounds reasonable that the egret is doing pest control for the cow, but NCERT never says the cattle gain anything — the egret simply forages close to where the cattle graze because the cattle stir up and flush out insects. Parasitism needs the cow to be harmed, and nothing is taken from the cow. Amensalism has the signs backwards: it is (– 0), one species harmed and the other unaffected, whereas here the egret is the one that benefits.",
      difficulty_level: 2,
    },
    {
      id: 'd4fd08b3-8061-45bc-6284-380a8e4ed2d3',
      type: 'callout',
      order: 13,
      variant: 'remember',
      title: 'Lock These In',
      markdown: "**The sign pairs — get these automatic:**\n- **Mutualism (+ +)** · **Competition (– –)** · **Predation (+ –)** · **Parasitism (+ –)** · **Commensalism (+ 0)** · **Amensalism (– 0)**\n- Predation and parasitism share the same signs — only the benefiting partner's name changes (**predator/prey** vs **parasite/host**).\n\n**The named examples, by interaction:**\n- **Parasitism** — liver fluke (**two intermediate hosts: a snail and a fish**), malarial parasite (**vector: mosquito**). **Ectoparasites:** lice on humans, ticks on dogs, copepods on marine fish, **Cuscuta** on hedge plants (**lost chlorophyll and leaves**). **Endoparasites:** liver, kidney, lungs, red blood cells. **Brood parasitism:** **cuckoo (koel)** in a **crow's** nest, eggs mimicking the host's in **size and colour**.\n- **Commensalism** — **orchid epiphyte on a mango branch**, **barnacles on a whale's back**, **cattle egret + grazing cattle**, **sea anemone + clown fish**.\n- **Mutualism** — **lichens** (fungus + alga/cyanobacteria), **mycorrhizae** (**Glomus**-type fungi + roots of higher plants), **fig + its wasp** (one-to-one, species-specific), **Ophrys + male bee** (sexual deceit).\n\n**Four parasitic adaptations:** loss of unnecessary **sense organs** · **adhesive organs or suckers** · loss of the **digestive system** · **high reproductive capacity**.\n\n**One line worth memorising:** predation, parasitism and commensalism share a common characteristic — **the interacting species live closely together**.",
    },
    {
      id: 'e50e19c4-9172-4610-7395-491b5bf9e4e4',
      type: 'callout',
      order: 14,
      variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Example-to-interaction matching is the whole game here.** Almost every NEET question on §11.1.4 is a matching set — an organism pair in the question, an interaction name in the options. Learn the examples *by their pair*, not as a loose list.\n\n**Clown fish and sea anemone:** the classic trap. Students call it mutualism because it *feels* like a partnership. NCERT is explicit — the fish gets protection, the **anemone does not appear to derive any benefit**. It is **commensalism**.\n\n**Cuscuta:** it is a **parasite** and specifically an **ectoparasite**, and it has lost **chlorophyll and leaves** — not roots. Options saying \"lost its roots\" or calling it an endoparasite are wrong.\n\n**Endoparasite vs ectoparasite:** the **simplified morphology and anatomy** plus **emphasised reproductive potential** belongs to the **endoparasite**. Ectoparasites keep more structure.\n\n**Brood parasitism:** the mimicry is in **egg size and colour** — not chick voice, not nest shape. The purpose is to stop the host **detecting and ejecting** the foreign egg.\n\n**Fig–wasp:** the wasp uses the fig as an **oviposition site** *and* eats some **developing seeds**; the relationship is **one-to-one and species-specific**. A fig species is pollinated by **only its partner wasp**.\n\n**Female mosquito:** NCERT states plainly it is **not considered a parasite**, even though it needs blood. Expect this as a \"which of these is NOT a parasite\" option.\n\n**Classic NEET question:** \"An orchid growing as an epiphyte on a mango branch represents —\" → **commensalism (+ 0)**; the mango derives **no apparent benefit** and no harm.",
    },
    {
      id: 'f61f2ad5-a283-4721-84a6-5a2a0af0f5f5',
      type: 'inline_quiz',
      order: 15,
      pass_threshold: 0.67,
      questions: [
        {
          id: '07202be6-b394-4832-95b7-6b3b1b006a06',
          question: 'The interaction between the sea anemone and the clown fish living among its stinging tentacles is an example of:',
          options: [
            'Mutualism, since both partners gain protection from predators',
            'Parasitism, since the clown fish exploits the anemone for shelter',
            'Commensalism, since the fish is protected while the anemone gains nothing apparent',
            'Amensalism, since the anemone stings and thereby harms the clown fish',
          ],
          correct_index: 2,
          explanation: "NCERT states that the clown fish gets protection from predators that stay away from the stinging tentacles, and the anemone does not appear to derive any benefit by hosting the fish — one benefits, the other is unaffected, so (+ 0) commensalism. Mutualism is the tempting choice because the pair looks like a partnership, but a (+ +) label needs the anemone to gain something, and NCERT explicitly says it does not. Parasitism would need the anemone to be harmed, and amensalism would need the fish to be harmed, neither of which happens.",
          difficulty_level: 2,
        },
        {
          id: '18313cf7-c4a5-4943-a6c8-7c4c2c117b17',
          question: 'Which set correctly names the adaptations NCERT lists for a parasitic mode of life?',
          options: [
            'Loss of sense organs, adhesive organs or suckers, loss of the digestive system, high reproductive capacity',
            'Loss of sense organs, thickened cuticle, enlarged digestive system, low reproductive capacity',
            'Enlarged sense organs, adhesive suckers, loss of the digestive system, high reproductive capacity',
            'Loss of chlorophyll, adhesive suckers, enlarged digestive system, high reproductive capacity',
          ],
          correct_index: 0,
          explanation: "NCERT names exactly four: loss of unnecessary sense organs, presence of adhesive organs or suckers to cling to the host, loss of the digestive system, and high reproductive capacity. Every distractor keeps one real item and flips another — an enlarged or retained digestive system contradicts the point that the host has already digested the food, low reproductive capacity contradicts the odds a parasite faces in finding a host, and loss of chlorophyll is true only of Cuscuta specifically, not of parasites as a group.",
          difficulty_level: 2,
        },
        {
          id: '29424d08-d5b6-4a54-b7d9-8d5d3d228c28',
          question: 'In the fig–wasp relationship, what does the fig give the wasp in return for pollination?',
          options: [
            'Nectar secreted at the base of the inflorescence',
            'Some of its developing seeds, as food for the developing wasp larvae',
            'Ripe juicy fruit pulp, which the adult wasp feeds on before flying away',
            'Pollen grains, which the female wasp collects and carries back to her nest',
          ],
          correct_index: 1,
          explanation: "NCERT is specific: in return for the favour of pollination, the fig offers the wasp some of its developing seeds as food for the developing wasp larvae, and the female uses the fruit as an oviposition site. Nectar and pollen are the general 'fees' plants pay pollinators, which makes them tempting, but they are not what the fig pays its wasp. Juicy nutritious fruit is the fee paid to seed dispersers, not to this pollinator, and the wasp lays eggs inside the fig rather than carrying anything back to a nest.",
          difficulty_level: 3,
        },
        {
          id: '3a535e19-e6c7-4b65-c8ea-9e6e4e339d39',
          question: 'A parasitic bird lays its eggs in another bird\'s nest, and its eggs closely resemble the host\'s eggs in size and colour. Why has that resemblance evolved?',
          options: [
            'So the host bird does not detect the foreign eggs and eject them from the nest',
            'So the parasitic chick hatches at the same time as the host\'s own chicks',
            'So the host bird feeds the parasitic chick more than its own chicks',
            'So other parasitic birds do not lay eggs in the same nest',
          ],
          correct_index: 0,
          explanation: "In brood parasitism the eggs of the parasitic bird evolved to resemble the host's egg in size and colour to reduce the chances of the host detecting the foreign eggs and ejecting them from the nest — that ejection is the threat the mimicry defends against. Hatch timing sounds plausible but egg colour has nothing to do with when an egg hatches, and NCERT does not claim it. Preferential feeding of the parasitic chick and deterring rival parasites are not mentioned either — the mimicry works at the egg-recognition stage, before any chick exists.",
          difficulty_level: 1,
        },
      ],
    },
  ],
};
