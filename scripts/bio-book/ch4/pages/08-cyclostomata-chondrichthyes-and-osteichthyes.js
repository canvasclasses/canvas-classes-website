'use strict';
const { v4: uuid } = require('uuid');

const bodyPlanHotspots = [
  {
    id: uuid(), x: 0.12, y: 0.30, label: 'Gill slits — no operculum', icon: 'circle',
    detail: 'In Chondrichthyes, each gill slit opens separately onto the body surface. There is no operculum here — nothing covers or bundles them as one unit.',
  },
  {
    id: uuid(), x: 0.18, y: 0.55, label: 'Placoid scales & backward teeth', icon: 'circle',
    detail: 'The tough skin carries tiny placoid scales, and the teeth are simply larger placoid scales, pointed backward — the same material doing two jobs.',
  },
  {
    id: uuid(), x: 0.30, y: 0.80, label: 'No air bladder', icon: 'circle',
    detail: 'Chondrichthyes have no air bladder. Without one, they sink unless they keep swimming — this is why sharks and rays are almost never still.',
  },
  {
    id: uuid(), x: 0.72, y: 0.25, label: 'Operculum', icon: 'circle',
    detail: 'A single bony flap covers all four pairs of gills on each side in Osteichthyes — one moving cover instead of separate open slits.',
  },
  {
    id: uuid(), x: 0.82, y: 0.55, label: 'Air bladder', icon: 'circle',
    detail: 'A gas-filled internal sac that lets Osteichthyes fine-tune their buoyancy and hover motionless in the water column.',
  },
  {
    id: uuid(), x: 0.68, y: 0.80, label: 'Cycloid / ctenoid scales', icon: 'circle',
    detail: 'The skin of Osteichthyes is covered with these thin, overlapping scales — a different material and shape from the placoid scales of Chondrichthyes.',
  },
];

module.exports = {
  slug: 'cyclostomata-chondrichthyes-and-osteichthyes',
  title: 'Cyclostomata, Chondrichthyes, and Osteichthyes',
  subtitle: "The jawless parasite, the cartilage predator, and the bony fish from your fish tank — three classes, sorted by jaw, skeleton, and one missing organ that decides who has to keep swimming and who gets to float.",
  page_number: 8,
  page_type: 'lesson',
  tags: ['animal-kingdom', 'pisces', 'vertebrata'],
  glossary: [
    { term: 'ectoparasite', definition: 'An organism that lives and feeds on the outside of a living host, without killing it outright.' },
    { term: 'placoid scales', definition: 'The small, tooth-like scales covering the skin of Chondrichthyes; their teeth are just larger, backward-pointing placoid scales.' },
    { term: 'operculum', definition: 'The bony flap covering all four pairs of gills on each side of an Osteichthyes fish. Chondrichthyes have no operculum.' },
    { term: 'air bladder', definition: 'A gas-filled internal sac in Osteichthyes that regulates buoyancy, letting the fish hover without swimming. Chondrichthyes lack this organ.' },
    { term: 'poikilothermous', definition: 'Cold-blooded — unable to internally regulate body temperature; it rises and falls with the surroundings.' },
    { term: 'clasper', definition: 'A modified structure on the pelvic fins of male Chondrichthyes, used during internal fertilisation.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dusk underwater scene moving from a river where a jawless fish clings to a host, out to open ocean where a torpedo-shaped fish keeps swimming, and into a calm pond where rounded fish hover motionless',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous underwater scene at dusk, read left to right: on the far left, a dim river mouth where a slender, eel-like jawless fish silhouette is attached to the side of a larger fish, both partly obscured in murky green-tinted water; the scene opens into a wide, darker open ocean in the centre where a sleek, torpedo-shaped predatory fish silhouette glides forward in continuous motion, never pausing; and on the right, calmer, clearer water where several small rounded fish silhouettes hover perfectly still, suspended at different depths without effort. A single soft warm light source filters down from the top of the frame, tying the three zones together. Deep, moody, painterly illustration style, dark naturalistic background throughout (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'A Parasite Built to Die on Schedule',
      markdown: "Lampreys spend their adult lives at sea, attached to other fish as **ectoparasites**. But every one of them eventually leaves the ocean and swims up into fresh water — not to feed, but to **spawn**. Once that's done, within just a few days, **every adult dies**. The species survives only because the next generation — the larvae — hatches in that fresh water, grows up, and eventually swims back out to sea alone.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Last page split every vertebrate into two doors, and the door was decided by one single feature — a jaw. **Agnatha** means 'no jaw,' and its only class is **Cyclostomata**. **Gnathostomata** means 'has a jaw,' and it splits again: **Pisces** (fish with fins) on one side, and **Tetrapoda** (limbed animals — the amphibians, reptiles, birds, and mammals waiting a few pages ahead) on the other. Pisces itself holds two classes, **Chondrichthyes** and **Osteichthyes**. This page walks through all three classes that open the vertebrate story — Cyclostomata, Chondrichthyes, and Osteichthyes: the jawless parasite, the cartilage predator, and the bony fish you'd actually recognise from a fish tank or a fish market.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Cyclostomata — Jawless, and Living Off Something Else',
      objective: "By the end you'll know why every cyclostome dies right after spawning, and what its jawless mouth is actually for.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Every living cyclostome alive today is an **ectoparasite** — it doesn't hunt its food, it attaches to a living fish and feeds off it. That parasitic lifestyle is written into its body. Instead of jaws, it has a **sucking, circular mouth** that clamps onto the host. The body is long and slender, with **6 to 15 pairs of gill slits** running along its sides for respiration — far more than any bony fish carries. There are no scales and no paired fins, and both the **cranium and the vertebral column stay cartilaginous** for life; nothing here ever turns to true bone. Blood moves through a **closed circulatory system**.\n\nCyclostomes live in the sea, but when it's time to breed they migrate into **fresh water to spawn** — and within a few days of spawning, every adult **dies**. The next generation carries on alone: the larvae hatch in fresh water, undergo metamorphosis, and only then swim back out to the ocean to grow into adults. **Petromyzon** (the lamprey) and **Myxine** (the hagfish) are the two examples to know.",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Chondrichthyes — Cartilage, Jaws, and No Air Bladder',
      objective: "By the end you'll know the Chondrichthyes signature: a cartilaginous skeleton, no operculum, and why the missing air bladder forces constant swimming.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Chondrichthyes are marine animals with a **streamlined**, torpedo-shaped body built for constant swimming — and 'constant' is the operative word, because of one missing organ. Their entire skeleton is **cartilaginous**, and unlike most vertebrates, the **notochord stays intact throughout life** rather than being fully replaced by a bony column. The mouth sits on the **underside (ventral)** of the head, and the **gill slits are separate**, opening individually with no covering flap — Chondrichthyes have **no operculum**. The skin is tough and studded with tiny **placoid scales**, and the teeth themselves are nothing but **modified placoid scales, pointed backward** — a jaw built from the same material as the skin around it. Those jaws are **powerful**, and Chondrichthyes are **predaceous**, hunting rather than filtering or grazing.\n\nHere's the catch: Chondrichthyes have **no air bladder**. With nothing to keep them buoyant, they have to **swim constantly just to avoid sinking**. The heart is **two-chambered** — one auricle and one ventricle. Some carry an **electric organ** (*Torpedo*, the electric ray) and some carry a **poison sting** (*Trygon*, the sting ray). Like every fish class on this page, they're **cold-blooded (poikilothermous)** — they can't regulate their own body temperature. Sexes are separate, and males carry **claspers on their pelvic fins**. Fertilisation is **internal**, and many species are **viviparous**, giving birth to live young instead of laying eggs. Remember these names: ***Scoliodon*** (dog fish), ***Pristis*** (saw fish), ***Carcharodon*** (great white shark), and ***Trygon*** (sting ray).",
    },
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Osteichthyes — Bone, an Operculum, and an Air Bladder',
      objective: "By the end you'll know the Osteichthyes signature: a bony skeleton, gills covered by an operculum, and the air bladder that lets these fish hover.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Osteichthyes covers both **marine and freshwater** fish, and the difference from Chondrichthyes starts with the skeleton itself: it's **bony**, not cartilaginous. The body is streamlined, the mouth is usually right at the front of the head (**terminal**), and — the single biggest visible difference from the last class — the **four pairs of gills sit under one bony flap called the operculum** on each side, instead of opening as separate slits. The skin carries **cycloid or ctenoid scales**, and inside the body sits an **air bladder**, a gas-filled sac that **regulates buoyancy** — exactly the organ Chondrichthyes are missing. That's why a rohu can hang motionless in water while a shark can't.\n\nThe heart is **two-chambered**, same as Chondrichthyes, and Osteichthyes are also **cold-blooded**. Sexes are separate, but fertilisation is usually **external** rather than internal, most species are **oviparous** (egg-laying), and development is **direct** — no larval stage to metamorphose through. The examples split neatly by habitat: **marine** — *Exocoetus* (flying fish) and *Hippocampus* (sea horse); **freshwater** — *Labeo* (rohu), *Catla* (katla), and *Clarias* (magur); **aquarium** favourites — *Betta* (fighting fish) and *Pterophyllum* (angel fish).",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A shark (Chondrichthyes) has to keep swimming even when it isn't hunting, or it sinks. A rohu (Osteichthyes) can hang perfectly still in water whenever it wants. Both are streamlined fish with fins — so what single structural difference explains this?",
      options: [
        "Osteichthyes carry an air bladder that regulates buoyancy; Chondrichthyes have no air bladder and must swim to stay up",
        "Chondrichthyes have four gill pairs covered by an operculum, which weighs the body down; Osteichthyes have open gill slits and float freely",
        "Osteichthyes have a light cartilaginous skeleton while Chondrichthyes carry a heavy bony one that keeps sinking them",
        "Chondrichthyes are viviparous and their young are too heavy to float, while Osteichthyes lay light eggs that stay buoyant",
      ],
      reveal: "It comes down to one organ: the **air bladder**. Osteichthyes (rohu, catla, and every bony fish) carry one, and it lets them adjust their buoyancy and hover without effort. Chondrichthyes (sharks, rays) have no air bladder at all, so without forward motion pushing water past their fins, they simply sink — which is exactly why NCERT calls out constant swimming as a Chondrichthyes trait. The operculum option has the fact backwards — that bony gill-covering flap belongs to Osteichthyes, not Chondrichthyes, which actually have separate, uncovered gill slits. The skeleton option is also flipped — Chondrichthyes are the cartilaginous class, Osteichthyes the bony one. And viviparous vs. oviparous is a reproduction detail with nothing to do with adult buoyancy.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'interactive_image', order: 10, src: '',
      alt: 'A cartilaginous fish and a bony fish shown side by side, with the body-plan features that tell them apart',
      caption: '📸 Tap each feature to compare Chondrichthyes and Osteichthyes',
      hotspots: bodyPlanHotspots,
      generation_prompt: "Scientific textbook illustration comparing two fish body plans side by side. Flat 2D educational diagram on a dark background (#0a0a0a near-black), clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. On the LEFT, a cartilaginous fish (shark-like, e.g. Scoliodon) shown in profile: visible separate gill slits along the side with no covering flap, a ventral mouth, small placoid scales textured across the skin, and no visible internal air bladder. On the RIGHT, a bony fish (e.g. Labeo/rohu-like) shown in profile: a single operculum flap covering the gill region, smooth overlapping cycloid scales, a terminal mouth, and a faint dotted outline inside the body showing an internal air bladder. Both fish rendered in pale grey-white outline tones with functional colour accents (blue for gills/water, pale tan for scale texture) on the dark background. No photorealism, no cartoon, no mascots; matches standard biology textbook illustration conventions.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 11, title: 'Cyclostomata vs Chondrichthyes vs Osteichthyes',
      columns: [
        {
          heading: 'Cyclostomata',
          points: [
            'Jaws: **absent** — sucking, circular mouth',
            'Skeleton: cranium & vertebral column **cartilaginous**',
            'No scales, no paired fins',
            'Gill slits: **6–15 pairs**',
            'Marine, but migrate to fresh water to spawn — adults **die within days**',
            'Example: *Petromyzon* (lamprey), *Myxine* (hagfish)',
          ],
        },
        {
          heading: 'Chondrichthyes',
          points: [
            'Jaws: **present**, powerful — predaceous',
            'Skeleton: **cartilaginous** endoskeleton throughout',
            'Skin: tough, with **placoid scales**',
            'Air bladder: **absent** — must swim constantly to avoid sinking',
            'Gills: separate slits, **no operculum**',
            'Example: *Scoliodon* (dog fish), *Trygon* (sting ray)',
          ],
        },
        {
          heading: 'Osteichthyes',
          points: [
            'Jaws: **present**',
            'Skeleton: **bony** endoskeleton',
            'Skin: **cycloid / ctenoid scales**',
            'Air bladder: **present** — regulates buoyancy',
            'Gills: four pairs, covered by an **operculum**',
            'Example: *Labeo* (rohu), *Catla* (katla)',
          ],
        },
      ],
    },
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember', title: 'One Line Per Class — Memorise These',
      markdown: "- **Cyclostomata:** jawless, sucking circular mouth, all living members are **ectoparasites**, adults **die within days of spawning**.\n- **Chondrichthyes:** **cartilaginous** endoskeleton, **no operculum**, **no air bladder** → must keep swimming, teeth = **backward placoid scales**.\n- **Osteichthyes:** **bony** endoskeleton, gills covered by an **operculum**, **air bladder present** → can hover motionless.\n- Chondrichthyes and Osteichthyes together make up **Pisces**; Cyclostomata sits outside Pisces, under Agnatha.",
    },
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Cyclostomata is the exception, not a fish:** it's jawless, ectoparasitic on living fish, and every individual dies within days of spawning — the larvae alone make the swim back to the ocean. NEET loves testing that lifestyle detail.\n\n**Cartilage vs bone — the single most repeated fact in this trio:** Chondrichthyes = cartilaginous endoskeleton (sharks, rays). Osteichthyes = bony endoskeleton (rohu, catla, seahorse). If a question names an endoskeleton material, it's naming the class.\n\n**All three are cold-blooded (poikilothermous)** — none of them can regulate body temperature. Hold onto that; it's the exact feature that flips when you reach birds and mammals later in this chapter.\n\n**Classic NEET question:** \"Why must Chondrichthyes swim constantly, even when resting?\" → They have no air bladder, so without forward motion they sink.",
    },
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "Cyclostomata, Chondrichthyes, Osteichthyes — that's every class Gnathostomata's Pisces branch has to offer, plus the one jawless class standing outside it. The other branch, Tetrapoda, is where things change completely: limbs instead of fins, and — for the first time in this chapter — animals that don't need water to breathe. Amphibia, the class that lives in both worlds, is next.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'Which class is defined by a sucking, circular mouth without jaws, and includes only ectoparasitic members such as Petromyzon?',
          options: ['Cyclostomata', 'Chondrichthyes', 'Osteichthyes', 'Gnathostomata'],
          correct_index: 0,
          explanation: "Cyclostomata is the jawless class — its sucking, circular mouth and fully ectoparasitic lifestyle set it apart. Chondrichthyes and Osteichthyes both have powerful jaws, and Gnathostomata isn't a class at all — it's the super class of ALL jawed vertebrates, the exact opposite of jawless.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'A fish has separate gill slits with no covering flap, tough skin with placoid scales, and teeth that are simply backward-pointing versions of those same scales. Which class is it?',
          options: ['Osteichthyes', 'Chondrichthyes', 'Cyclostomata', 'Pisces'],
          correct_index: 1,
          explanation: "Separate, uncovered gill slits, placoid scales, and teeth built from those same scales are the Chondrichthyes signature. Osteichthyes instead has an operculum and cycloid/ctenoid scales; Cyclostomata has no scales or jaws at all; and Pisces isn't a class — it's the super class holding Chondrichthyes and Osteichthyes together, so it can't be the specific answer.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'Which of these correctly explains why Chondrichthyes must swim constantly to avoid sinking?',
          options: [
            'They have a heavy bony endoskeleton with no operculum to help them float',
            'Their placoid scales trap water and add extra weight when the fish is still',
            'They have no air bladder, so nothing regulates their buoyancy once they stop moving',
            'Their cartilaginous notochord persists into adulthood, adding extra density',
          ],
          correct_index: 2,
          explanation: "NCERT states plainly that Chondrichthyes must swim constantly because they have no air bladder. Their skeleton is cartilaginous, not bony, so the first option reverses that fact; placoid scales are about skin texture and teeth, not weight; and a persistent notochord is cartilage, not a source of extra density.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'Petromyzon and Myxine are both marine, but every so often they migrate somewhere else to breed. What happens to the adults afterward, according to NCERT?',
          options: [
            'They stay in fresh water permanently and never return to the sea',
            'They give birth to live young and then swim back to the ocean unharmed',
            'Only the larvae die; the adults return to the sea to breed again next season',
            'They migrate to fresh water to spawn, and the adults die within a few days of spawning',
          ],
          correct_index: 3,
          explanation: "NCERT is specific: cyclostomes migrate to fresh water to spawn, and within a few days of spawning, the adults die. It's the larvae — not the adults — that survive, metamorphose, and swim back to the ocean. So the adults don't settle in fresh water, don't survive to breed again, and definitely don't give birth to live young — Chondrichthyes, not Cyclostomata, are the viviparous class.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
