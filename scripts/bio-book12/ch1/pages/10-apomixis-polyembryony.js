'use strict';
/**
 * Class 12 Biology — Chapter 1: Sexual Reproduction in Flowering Plants
 * Page 10 — Apomixis and Polyembryony (closing page of the chapter).
 *
 * Source of truth: NCERT Class 12 Ch.1, §1.5 "Apomixis and Polyembryony"
 * (lebo101.txt, lines 966–1006) + the summary lines 1063–1068. Rule 0: every
 * fact here traces to that text; nothing invented. The applied breeder angle
 * (hybrid seed segregation, farmers reusing saved seed) is NCERT's own.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'apomixis-and-polyembryony',
  title: 'Seeds Without Sex — Apomixis & Polyembryony',
  subtitle: 'After a whole chapter about pollination and fertilisation, here is the exception: a handful of plants that make perfectly good seeds with no fertilisation at all — and why plant breeders dream about it.',
  page_number: 10,
  page_type: 'lesson',
  tags: ['apomixis', 'polyembryony', 'sexual-reproduction-in-flowering-plants'],
  glossary: [
    { term: 'apomixis', definition: 'The formation of seeds without fertilisation. It is a form of asexual reproduction that mimics sexual reproduction, found in some grasses and members of the Asteraceae.' },
    { term: 'polyembryony', definition: 'The occurrence of more than one embryo inside a single seed. Squeeze an orange seed and you can see several embryos of different sizes.' },
    { term: 'nucellar embryony', definition: 'One route to apomixis: nucellar cells around the embryo sac start dividing, push into it, and grow into embryos — seen in many Citrus and Mango varieties.' },
    { term: 'apomict', definition: 'A plant that reproduces by apomixis — it sets seed without fertilisation. Apomicts have several advantages in horticulture and agriculture.' },
    { term: 'segregation', definition: 'The splitting-up of characters in the offspring of a hybrid. When hybrid seed is resown, the progeny segregate and no longer keep the parent hybrid’s useful traits.' },
  ],
  blocks: [
    {
      id: 'e7b3d1a4-2c9f-4e6b-8a17-5d0c3f9b2e41',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A field of wild grasses at dusk with ripe seed heads catching low golden light',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet field of tall wild grasses at dusk, their ripe seed heads catching low golden light near the horizon. The grasses are heavy with seed, swaying softly. No insects, no flowers on display — the mood is calm and slightly mysterious, hinting that these seeds formed on their own, without the usual pollination drama. Deep dusk lighting, painterly and atmospheric, dark background tones overall (#0a0a0a base), naturalistic, no text, no labels, no diagram elements.",
    },
    {
      id: '9c4f7a02-6b18-4d5e-9f3a-1e8c7b0d64a2',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'Cut Open One Orange Seed, Find Several Plants',
      markdown: "Take a seed out of an orange and squeeze it open. Instead of one embryo, you'll often find **several** — different sizes, different shapes, all packed into that single seed. Sow it and more than one seedling can push up from the same seed. That's not a defect. In many Citrus and Mango varieties it's the normal thing, and it's a clue to something strange happening inside the ovule: some of those embryos never came from an egg being fertilised at all.",
    },
    {
      id: '3a1e8c7d-5b09-4f26-8d4a-9c2b7e0f13d6',
      type: 'text',
      order: 2,
      markdown: "For this whole chapter the rule has been simple: pollen reaches the egg, fertilisation happens, and a seed forms. Seeds are the products of fertilisation. But a few flowering plants break that rule. Some species of **Asteraceae** and some **grasses** have evolved a special mechanism to produce seeds **without fertilisation** — this is called **apomixis**.\n\nHold on to what apomixis really is. Fertilisation normally means shuffling — two gametes fuse, and the offspring is a new mix. Apomixis skips the fusion entirely, so the seed is made asexually. Yet the end product still looks exactly like an ordinary seed. That's why NCERT calls it a **form of asexual reproduction that mimics sexual reproduction** — it wears the costume of a sexual seed while doing none of the actual mixing.",
    },
    {
      id: 'b6d29f04-8a13-4c7e-9b58-2f0e6a1c7d94',
      type: 'heading',
      order: 3,
      text: 'Two Ways a Plant Skips Fertilisation',
      level: 2,
      objective: 'How can a seed form when no sperm ever meets the egg?',
    },
    {
      id: 'f1a7c3e9-4d82-4b06-8e15-6a9d0c2f5b73',
      type: 'text',
      order: 4,
      markdown: "There are several ways apomictic seeds develop. Two are worth knowing.\n\n**Route one — the diploid egg.** In some species the egg cell is formed **without reduction division**, so it stays diploid instead of becoming haploid. This diploid egg then develops straight into an embryo, no fertilisation needed. Nothing had to fuse with it.\n\n**Route two — the nucellus takes over.** This is the more common one, and it's what happens in many **Citrus** and **Mango** varieties. Some of the **nucellar cells** surrounding the embryo sac start dividing, **protrude into the embryo sac**, and develop into embryos themselves. Remember the nucellus is ordinary body (diploid) tissue of the ovule — so these embryos grow from the mother plant's own cells. In such species each ovule ends up holding many embryos. The occurrence of **more than one embryo in a seed** is called **polyembryony** — and that is exactly the several-seedlings-per-orange-seed you saw at the top of this page.",
    },
    {
      id: '1f7c3e9a-8e0a-4c1d-9b4e-7d2c1a6f08b5',
      type: 'interactive_image',
      order: 5,
      src: '',
      alt: 'Cut-open Citrus seed showing nucellar cells dividing into several embryos inside one seed',
      caption: '📸 Tap each dot to explore how one Citrus seed ends up carrying several embryos.',
      generation_prompt: "Scientific textbook illustration of a Citrus (orange) ovule/seed shown in longitudinal section, cut open to reveal its inside. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions. Show: an outer seed coat / integument, the central embryo sac, and the surrounding nucellus tissue. From the nucellus, several small cells are shown dividing and protruding inward into the embryo sac, each developing into a small embryo — so the single seed clearly contains MULTIPLE embryos of slightly different sizes. Use functional colours: green for the small developing embryos (living/growing tissue), tan/brown for the seed coat, pale tissue tones for the nucellus, faint blue interior for the embryo sac cavity. Labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: 'a1', x: 0.5, y: 0.5, label: 'Embryo sac', detail: "The normal chamber where the egg sits and, in an ordinary seed, where the fertilised egg would grow. In apomixis it becomes the space that gets invaded from outside.", icon: 'circle' },
        { id: 'a2', x: 0.78, y: 0.42, label: 'Nucellus', detail: "The diploid body tissue of the ovule surrounding the embryo sac. In Citrus and Mango, some of its cells refuse to stay quiet and begin dividing.", icon: 'circle' },
        { id: 'a3', x: 0.66, y: 0.55, label: 'Nucellar cell pushing in', detail: "A dividing nucellar cell protrudes **into** the embryo sac. Because it comes from the mother's own tissue, no fertilisation is involved.", icon: 'circle' },
        { id: 'a4', x: 0.44, y: 0.62, label: 'Many embryos (polyembryony)', detail: "Several embryos of different sizes now share one seed. More than one embryo in a single seed is called **polyembryony**.", icon: 'circle' },
        { id: 'a5', x: 0.16, y: 0.5, label: 'Seed coat', detail: "The protective outer layer from the integuments. From the outside this looks like a perfectly ordinary orange seed — the surprise is only inside.", icon: 'circle' },
      ],
    },
    {
      id: '8e0a6c1d-3f75-4920-9b4e-4c9b2e7f01b5',
      type: 'comparison_card',
      order: 6,
      title: 'Apomictic seed vs normal sexual seed',
      columns: [
        {
          heading: 'Normal sexual seed',
          points: [
            'Is the product of fertilisation — pollen reaches the egg and gametes fuse.',
            'Involves the usual shuffling, so offspring carry a new mix of characters.',
            'If the parent is a hybrid, the resown seed segregates and loses the hybrid traits.',
          ],
        },
        {
          heading: 'Apomictic seed',
          points: [
            'Forms without fertilisation — a form of asexual reproduction that mimics the sexual one.',
            'The embryo grows from the mother’s own tissue, so it is genetically the same as the parent.',
            'A hybrid made apomictic would pass its characters on unchanged — no segregation.',
          ],
        },
      ],
    },
    {
      id: '4c9b2e7f-1a08-4d63-8f52-0e7a3c9d61b4',
      type: 'heading',
      order: 7,
      text: 'Why Plant Breeders Get Excited',
      level: 2,
      objective: 'What makes a farmer’s cost problem an apomixis opportunity?',
    },
    {
      id: 'd2f6a0c3-7e94-4b18-9a25-3c8b1e0f7d69',
      type: 'text',
      order: 8,
      markdown: "Hybrid crops have hugely raised productivity, so they're grown everywhere. But hybrids have a catch. **Hybrid seed has to be produced fresh every year.** If a farmer saves seed from this year's hybrid crop and sows it, the progeny **segregate** — the characters split up and the plants no longer hold the hybrid's useful qualities. Producing hybrid seed is costly, so buying it every single year makes it too expensive for many farmers.\n\nHere's where apomixis walks in. If a hybrid could be made into an **apomict**, its seeds would form without fertilisation — so there would be **no segregation**. The offspring would stay true to the hybrid year after year. The farmer could keep saving and sowing his own seed instead of buying new hybrid seed every season. That is exactly why active research is going on in laboratories around the world to understand the genetics of apomixis and to transfer apomictic genes into hybrid varieties.\n\nAnd that closes the chapter — from a flower dressed up to attract a bee, all the way to a seed that needs no pollination at all.",
    },
    {
      id: '6b1d4f8e-2c07-49a3-8e64-9f0a5c3b7d12',
      type: 'reasoning_prompt',
      order: 9,
      reasoning_type: 'logical',
      prompt: 'Why are plant breeders so keen to make hybrid crops apomictic?',
      options: [
        'Because apomictic seeds are cheaper to make, as no pollination is needed at all',
        'Because the hybrid’s characters would pass on unchanged, so farmers could resow saved seed each year',
        'Because apomixis makes each seed hold several embryos, giving more seedlings per seed',
        'Because apomictic crops are known to resist pests better than seed-grown hybrids',
      ],
      reveal: "The right answer is the second one. NCERT's whole argument is about segregation: resown hybrid seed segregates and loses the hybrid characters, so fresh hybrid seed must be bought every year. Making the hybrid apomictic removes that segregation, so the farmer can keep using saved seed. The third option is a real trap — apomixis often does come with polyembryony (several embryos per seed), but extra seedlings is not the breeding prize; preserving the hybrid's characters is.",
      difficulty_level: 2,
    },
    {
      id: 'a3e7c9f0-5b24-4681-9d3f-7c0e2a8b16d4',
      type: 'callout',
      order: 10,
      variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Apomixis = seeds without fertilisation.** It's a form of asexual reproduction that mimics sexual reproduction, seen in some Asteraceae and grasses.\n- **Two routes:** a diploid egg (formed without reduction division) growing into an embryo, OR nucellar cells dividing and protruding into the embryo sac (Citrus, Mango).\n- **Polyembryony = more than one embryo in a single seed.** Classic example: squeeze an orange seed.\n- **Breeder payoff:** an apomictic hybrid shows no segregation, so farmers can reuse saved seed instead of buying fresh hybrid seed yearly.",
    },
    {
      id: 'c0f4a7d1-6b93-4e28-8a05-1d7e2c9b6f30',
      type: 'callout',
      order: 11,
      variant: 'exam_tip',
      title: 'How NEET Uses This Page',
      markdown: "**Apomixis:** seed formation without fertilisation; NEET loves the exact phrase *“form of asexual reproduction that mimics sexual reproduction.”*\n**Nucellar embryony:** the Citrus/Mango example — embryos arise from **nucellar** (diploid, maternal) cells, NOT from the egg. This is a favourite trap.\n**Polyembryony:** simply more than one embryo per seed — don't confuse it with apomixis itself.\n**Applied angle:** apomixis matters because it fixes hybrid vigour — hybrids stay true, no segregation.\n\n**Classic NEET question:** \"In many Citrus varieties, apomictic embryos develop from —\" → **nucellar cells** (nucellar embryony), not the diploid egg and not the synergids.",
    },
    {
      id: '0d8b3a6e-9c14-42f7-8b05-1e6f9a2c7d3b',
      type: 'inline_quiz',
      order: 12,
      pass_threshold: 0.67,
      questions: [
        {
          id: '5f2a9c7e-0b38-4d61-9e47-2c8b0f3a6d95',
          question: 'What is apomixis?',
          options: [
            'The formation of seeds without fertilisation',
            'The formation of fruit without any seeds',
            'The fusion of two male gametes with the egg cell',
            'The presence of more than one embryo in a seed',
          ],
          correct_index: 0,
          explanation: "Apomixis is seed formation without fertilisation — a form of asexual reproduction that mimics the sexual one. The last option is a real trap: that describes polyembryony, a related but different term (more than one embryo per seed), which often accompanies apomixis but is not its definition.",
          difficulty_level: 1,
        },
        {
          id: 'c8d1e6b3-4a90-42f7-8b25-6e0c9a1f3d78',
          question: 'In many Citrus and Mango varieties, apomictic embryos develop from —',
          options: [
            'the two synergids sitting beside the egg cell',
            'the three antipodal cells at the chalazal end',
            'the diploid egg cell formed without reduction division',
            'nucellar cells that divide and grow into the embryo sac',
          ],
          correct_index: 3,
          explanation: "In Citrus and Mango, nucellar cells surrounding the embryo sac divide, protrude into it and become embryos — this is nucellar embryony. The diploid-egg route is a genuine apomixis mechanism too, but NCERT names it for *other* species, not for the Citrus/Mango example, which is the trap here.",
          difficulty_level: 2,
        },
        {
          id: '2a7f0c9d-6b14-4e83-9d52-8c1b3f7a0e64',
          question: 'The occurrence of more than one embryo in a single seed is called —',
          options: [
            'syngamy',
            'polyembryony',
            'apomixis',
            'triple fusion',
          ],
          correct_index: 1,
          explanation: "Polyembryony means more than one embryo in one seed (cut open an orange seed and count them). Apomixis is the broader phenomenon — seed formation without fertilisation. The two go together in Citrus, but they are not the same word, and apomixis is the tempting wrong pick.",
          difficulty_level: 1,
        },
        {
          id: '9e3b6d0a-1c78-4f25-8a94-0d7c2e6b1f43',
          question: 'When seeds collected from a hybrid crop are resown, the plants in the progeny —',
          options: [
            'remain genetically identical to the parent hybrid',
            'automatically become apomictic',
            'segregate and lose the hybrid characters',
            'turn out to be only male-sterile',
          ],
          correct_index: 2,
          explanation: "Resown hybrid seed segregates, so the hybrid characters are not maintained — which is why fresh hybrid seed must be bought each year. The first option is exactly what breeders *wish* would happen; it only would if the hybrid were first made apomictic, which does not occur on its own.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
