'use strict';
const { v4: uuid } = require('uuid');

const malariaHotspots = [
  {
    id: uuid(), x: 0.14, y: 0.30, label: 'Female Anopheles bite → sporozoites', icon: 'circle',
    detail: "The whole cycle in you starts with a bite. An infected **female Anopheles** mosquito injects *Plasmodium* into your blood as **sporozoites** — the infectious form. Note the word: it enters as sporozoites, *not* as adult parasites.",
  },
  {
    id: uuid(), x: 0.34, y: 0.62, label: 'Liver stage — first multiplication', icon: 'circle',
    detail: "The sporozoites do not attack blood first. They head to the **liver cells** and **multiply there** initially. This is the quiet stage — you feel nothing yet.",
  },
  {
    id: uuid(), x: 0.55, y: 0.66, label: 'RBC stage — parasite enters red blood cells', icon: 'circle',
    detail: "After the liver, the parasites leave and **attack the red blood cells (RBCs)**, multiplying inside them. Two-organ rule for the human host: **liver first, then RBCs.**",
  },
  {
    id: uuid(), x: 0.74, y: 0.44, label: 'RBC rupture → haemozoin → fever', icon: 'circle',
    detail: "The infected RBCs **rupture**, and this releases a toxic substance called **haemozoin**. Haemozoin is what causes the **chill and high fever that recur every three to four days**. The toxin, not the parasite directly, is the reason you shiver and burn.",
  },
  {
    id: uuid(), x: 0.86, y: 0.72, label: 'Mosquito takes up parasites', icon: 'circle',
    detail: "When a female Anopheles **bites an infected person**, the parasites pass from human blood **into the mosquito's body**. The human is now the source; the mosquito becomes the next carrier.",
  },
  {
    id: uuid(), x: 0.55, y: 0.20, label: "Mosquito gut → sporozoites in salivary glands", icon: 'circle',
    detail: "Inside the mosquito the parasites **develop and multiply to form sporozoites**, which collect in its **salivary glands**. The next bite injects them into a fresh human — the loop closes. The parasite needs **two hosts (human + mosquito)** to finish its life cycle.",
  },
];

module.exports = {
  slug: 'common-diseases-parasitic-and-fungal',
  title: 'Common Diseases II — Malaria, Worms & Fungi',
  subtitle: "How one mosquito bite hands a single-celled parasite two hosts, why the fever comes back like clockwork, and the worms and fungi that follow.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['human-health-and-disease', 'malaria', 'plasmodium', 'parasitic-diseases', 'ringworm'],
  glossary: [
    { term: 'Plasmodium', definition: 'The tiny protozoan parasite that causes malaria. Three NCERT species — P. vivax, P. malariae and P. falciparum — cause different types; P. falciparum causes the most serious (malignant) malaria and can be fatal.' },
    { term: 'Anopheles', definition: 'The mosquito genus that transmits malaria. The infected female Anopheles is the vector — it injects the parasite into humans and carries it between hosts.' },
    { term: 'haemozoin', definition: 'A toxic substance released when malaria-infected red blood cells rupture. It is responsible for the recurring chill and high fever of malaria.' },
    { term: 'amoebiasis', definition: 'Amoebic dysentery — a disease of the large intestine caused by the protozoan Entamoeba histolytica, spread mainly through faecally contaminated food and water.' },
    { term: 'Ascaris', definition: 'The common round worm, an intestinal helminth parasite that causes ascariasis. Its eggs pass out in faeces and reach a new host through contaminated water, vegetables and fruits.' },
    { term: 'Wuchereria', definition: 'The filarial (thread-like) worm — W. bancrofti and W. malayi — that lives for years in the lymphatic vessels of the lower limbs and causes elephantiasis (filariasis).' },
    { term: 'ringworm', definition: 'A common fungal skin infection caused by Microsporum, Trichophyton and Epidermophyton, showing as dry, scaly, intensely itchy lesions on skin, nails and scalp.' },
    { term: 'vector', definition: 'The transmitting agent that carries a pathogen from one host to another — for malaria and filariasis it is the female mosquito.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single mosquito silhouetted against a dim, humid evening sky over still water',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single mosquito silhouetted in sharp profile against a dim, humid tropical evening sky, wings caught in a thin sliver of fading amber light. Below it, dark still water — a stagnant pool reflecting the last of the dusk — hinting at a breeding ground. Heavy, moist, oppressive atmosphere, deep shadow, one low warm glow near the horizon, dark naturalistic background throughout (#0a0a0a base tones). Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Only the Female Carries It',
      markdown: "Not every mosquito can give you malaria. NCERT is precise about this: the vector is the **infected female Anopheles** mosquito. It is the female that takes a blood meal, so it is the female that picks the parasite up from one person and injects it into the next. The parasite can't fly, can't walk far, and can't jump from person to person on its own — it borrows the female mosquito as a living taxi between two hosts, human and mosquito.",
    },
    {
      id: uuid(), type: 'heading', order: 2, level: 2,
      text: 'Malaria: One Parasite, Two Hosts',
      objective: 'Trace a sporozoite from the mosquito bite through liver and RBCs and back into the mosquito — and be able to say exactly where the fever comes from.',
    },
    {
      id: uuid(), type: 'text', order: 3,
      markdown: "Malaria is caused by **Plasmodium**, a tiny **protozoan** parasite. NCERT names three species — **P. vivax**, **P. malariae** and **P. falciparum** — and they cause different types of malaria. The one to remember is **P. falciparum**: it causes **malignant malaria**, the most serious form, which can even be **fatal**.\n\nThe reason malaria is worth a whole life cycle is that the parasite needs **two hosts** to complete it — a **human** and a **mosquito** — and it looks completely different at each stop. Follow one round: the parasite enters you as **sporozoites** (the infectious form) through the bite of an infected female Anopheles, hides and multiplies in your **liver cells** first, then breaks out to attack your **red blood cells**. When those RBCs rupture, they spill a toxin called **haemozoin** — and that toxin, not the parasite chewing on you, is what brings the shaking chill and high fever back **every three to four days**. Tap through the cycle below.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 4, src: '',
      alt: 'Circular diagram of the Plasmodium life cycle between a human and a female Anopheles mosquito, with the liver, red blood cells and mosquito salivary glands marked',
      caption: '📸 Tap each dot to follow one full loop of the malaria parasite',
      hotspots: malariaHotspots,
      generation_prompt: "Scientific textbook illustration of the life cycle of Plasmodium (the malaria parasite), matching NCERT Figure 7.1. Flat 2D educational diagram on a dark background (#0a0a0a near-black), arranged as a large circular cycle. Clean white outlines, biologically accurate proportions, no baked-in text labels. LEFT / HUMAN SIDE: a human figure being bitten by a mosquito at top-left; an arrow leading to a large liver organ (tinted brown-tan) where small parasite forms multiply; a further arrow to a cluster of round red blood cells (tinted red) with tiny parasites inside, one red blood cell shown bursting apart to release small dark toxin granules. RIGHT / MOSQUITO SIDE: a detailed female Anopheles mosquito in profile (tinted faint pink), with a cutaway of its gut and its salivary glands in the head where thread-like sporozoites (drawn as slender curved forms) are stored. Curved directional arrows connect the stages all the way around the circle to show the loop from mosquito bite to liver to red blood cells and back into the mosquito. Purple/magenta tint for the parasite forms. No photorealism, no cartoon, no mascots; standard biology textbook illustration conventions.",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'The Other Culprits: Amoeba, Worms and Fungi',
      objective: 'Sort four more diseases by their pathogen, the organ they hit and how they reach you — the exact grid NEET tests as a match-the-column.',
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Malaria is a protozoan disease, but it is not the only one. **Entamoeba histolytica**, another protozoan, lives in the **large intestine** and causes **amoebiasis** (amoebic dysentery) — constipation, abdominal cramps, and stools with excess mucous and blood clots. Here the carrier is not a mosquito: **houseflies** act as mechanical carriers, walking the parasite from the faeces of an infected person onto food. Contaminated **drinking water and food** are the main source.\n\nNext come the **helminths** — the worms. **Ascaris**, the common **round worm**, is an intestinal parasite that causes **ascariasis** (internal bleeding, muscular pain, fever, anaemia, blocked intestine); its eggs leave in faeces and reach a new person through contaminated water, vegetables and fruits. **Wuchereria** (W. bancrofti and W. malayi), the **filarial worm**, is nastier in a different way — it lives for **years in the lymphatic vessels of the lower limbs**, causing a slow chronic inflammation called **elephantiasis** or **filariasis**, and like malaria it is spread by the **female mosquito**.\n\nFinally the **fungi**: **Microsporum**, **Trichophyton** and **Epidermophyton** cause **ringworm** — dry, scaly, intensely itchy lesions on **skin, nails and scalp**. Heat and moisture help them thrive, so they settle in skin folds like the groin and between the toes, and spread through **soil, towels, clothes or a shared comb**. The common thread across all of these is hygiene: clean water, clean food, proper disposal of waste, and — for the mosquito-borne ones — killing the vector and draining the stagnant water where it breeds.",
    },
    {
      id: uuid(), type: 'table', order: 7,
      caption: 'The parasitic and fungal diseases of §7.1 — pathogen, organ affected, and how it reaches you',
      headers: ['Disease', 'Pathogen', 'Organ / site affected', 'Vector / mode of spread'],
      rows: [
        ['Malaria', 'Plasmodium (P. vivax, P. malariae, P. falciparum) — protozoan', 'Liver, then red blood cells', 'Female Anopheles mosquito'],
        ['Amoebiasis (amoebic dysentery)', 'Entamoeba histolytica — protozoan', 'Large intestine', 'Houseflies (mechanical carrier); contaminated food & water'],
        ['Ascariasis', 'Ascaris — round worm (helminth)', 'Intestine', 'Contaminated water, vegetables, fruits, soil (no insect vector)'],
        ['Filariasis (elephantiasis)', 'Wuchereria (W. bancrofti, W. malayi) — filarial worm', 'Lymphatic vessels of the lower limbs', 'Female mosquito'],
        ['Ringworm', 'Microsporum, Trichophyton, Epidermophyton — fungi', 'Skin, nails, scalp', 'Soil, towels, clothes or comb of infected persons (no insect vector)'],
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "A malaria patient reports that the shaking chill and high fever hit hard, then ease off, then return sharply about every three to four days — like clockwork. Which explanation fits what is actually happening inside the body?",
      options: [
        'The mosquito re-bites the patient every three to four days, injecting a fresh dose of parasites each time',
        'Batches of infected red blood cells rupture together and release the toxin haemozoin, and the fever tracks these waves of rupture',
        'The parasite multiplies in the liver in three-to-four-day bursts, and each burst is felt as fever',
        'The patient produces antibodies every three to four days, and the fever is the immune reaction to them',
      ],
      correct_index: 1,
      reveal: "The fever is tied to the **rupture of RBCs**, which releases the toxic substance **haemozoin** — this is what NCERT says drives the recurring chill and high fever every three to four days. It doesn't need a fresh bite each time (the parasite is already cycling inside). The liver stage is the *first, quiet* multiplication — it isn't the fever source. And antibodies are part of the body's defence, not the cause of the cyclic fever.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: "Don't Get These Swapped",
      markdown: "- **Enters as sporozoites** → multiplies in **liver first**, then **RBCs** — never the other way round.\n- **Haemozoin** = the toxin from ruptured RBCs = the **cyclic fever** (every 3–4 days).\n- **Two hosts:** human + mosquito. The **female Anopheles is the vector.**\n- **P. falciparum** = malignant (most serious, can be fatal) malaria.\n- **Amoebiasis** → *Entamoeba histolytica* → **large intestine** → **houseflies** carry it.\n- **Ascaris** = round worm → **ascariasis** (no insect vector). **Wuchereria** = filarial worm → **elephantiasis** → **female mosquito**.\n- **Ringworm** = fungi **Microsporum, Trichophyton, Epidermophyton** → skin/nails/scalp.",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Vector vs no vector:** Malaria and filariasis need a **mosquito vector**; amoebiasis and ascariasis spread through **contaminated food/water** (housefly is only a *mechanical carrier* for amoebiasis, not a true vector); ringworm needs **no insect** at all. NEET loves this split.\n\n**Sequence trap:** The order is **liver → RBC**. Options that say the parasite hits RBCs first or 'multiplies in blood then liver' are the standard wrong answers.\n\n**Species trap:** *P. falciparum* → **malignant** malaria (most serious). Don't attribute that to *P. vivax*.\n\n**Classic NEET question:** \"Which of these is responsible for the recurring fever in malaria?\" → **haemozoin**, the toxin released when infected RBCs rupture — not the sporozoites and not the liver stage.",
    },
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "So the defence is mostly common sense scaled up: personal hygiene (clean body, clean drinking water and food) stops the food-and-water diseases like amoebiasis and ascariasis, while killing mosquitoes and draining the stagnant water they breed in stops malaria and filariasis. But hygiene only lowers your exposure — it doesn't explain why, out of everyone who *is* exposed, only a few actually fall ill. That job belongs to the body's own defence force, and that is where we go next: **immunity**.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: "In the life cycle of Plasmodium, in what form does the parasite enter the human body, and which organ does it multiply in first?",
          options: [
            'As gametocytes; it multiplies first in the red blood cells',
            'As sporozoites; it multiplies first in the liver cells',
            'As sporozoites; it multiplies first in the red blood cells',
            'As merozoites; it multiplies first in the salivary glands',
          ],
          correct_index: 1,
          explanation: "The parasite enters as sporozoites (the infectious form) through the female Anopheles bite and initially multiplies within the liver cells before attacking RBCs. Option 3 has the right entry form but the wrong first organ (liver comes before RBCs). The salivary-gland stage is inside the mosquito, not the human.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: "The recurring chill and high fever of malaria, appearing every three to four days, is directly caused by:",
          options: [
            'The multiplication of sporozoites in the liver',
            'The bite of the female Anopheles mosquito itself',
            'The release of haemozoin when infected red blood cells rupture',
            'Antibodies produced by the host against Plasmodium',
          ],
          correct_index: 2,
          explanation: "When infected RBCs rupture they release the toxic substance haemozoin, which is responsible for the chill and high fever recurring every three to four days. The liver stage is the earlier, silent multiplication; the mosquito bite only introduces the parasite; and antibodies are host defence, not the cause of the fever.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: "Which disease is correctly matched with its pathogen and the organ it primarily affects?",
          options: [
            'Filariasis — Entamoeba histolytica — large intestine',
            'Amoebiasis — Wuchereria bancrofti — lymphatic vessels',
            'Ascariasis — Microsporum — skin and scalp',
            'Filariasis — Wuchereria bancrofti — lymphatic vessels of the lower limbs',
          ],
          correct_index: 3,
          explanation: "Filariasis (elephantiasis) is caused by the filarial worm Wuchereria (W. bancrofti / W. malayi), which lives in the lymphatic vessels of the lower limbs. Option 1 wrongly pairs filariasis with the amoebiasis pathogen; option 2 swaps amoebiasis onto Wuchereria; and option 3 gives ascariasis a fungal (ringworm) pathogen instead of the round worm Ascaris.",
          difficulty_level: 3,
        },
        {
          id: uuid(), question: "Ringworm, one of the most common infectious diseases in humans, is caused by:",
          options: [
            'Fungi belonging to Microsporum, Trichophyton and Epidermophyton',
            'The protozoan Entamoeba histolytica',
            'The round worm Ascaris',
            'The bacterium Salmonella typhi',
          ],
          correct_index: 0,
          explanation: "Ringworm is a fungal disease caused by Microsporum, Trichophyton and Epidermophyton, producing dry, scaly, itchy lesions on skin, nails and scalp. Entamoeba causes amoebiasis (a protozoan gut disease), Ascaris causes ascariasis (a helminth disease), and Salmonella typhi causes typhoid (a bacterial disease) — none of them cause ringworm.",
          difficulty_level: 1,
        },
      ],
    },
  ],
};
