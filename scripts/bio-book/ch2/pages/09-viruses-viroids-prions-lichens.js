'use strict';
const { v4: uuid } = require('uuid');

const virusHotspots = [
  {
    id: uuid(), x: 0.20, y: 0.42, label: 'Capsid', icon: 'circle',
    detail: "The **protein coat** wrapped around the virus. Its only job is to **protect the nucleic acid** inside. On this rod-shaped Tobacco Mosaic Virus the capsid is the outer sleeve running the whole length of the particle.",
  },
  {
    id: uuid(), x: 0.13, y: 0.66, label: 'Capsomere', icon: 'circle',
    detail: "A single **small subunit** that the capsid is built from. Many capsomeres stack together to form the coat, arranged either in a **helical** form (as in TMV) or a **polyhedral** geometric form.",
  },
  {
    id: uuid(), x: 0.32, y: 0.30, label: 'Nucleic acid (RNA / DNA)', icon: 'circle',
    detail: "The **genetic material** — either RNA **or** DNA, never both. TMV, a plant virus, carries **single-stranded RNA**. This nucleic acid is the **infectious** part of the virus.",
  },
  {
    id: uuid(), x: 0.73, y: 0.20, label: 'Head', icon: 'circle',
    detail: "The upper capsule of a **bacteriophage** (a virus that infects bacteria). It holds the nucleic acid — in phages that is usually **double-stranded DNA**.",
  },
  {
    id: uuid(), x: 0.73, y: 0.56, label: 'Sheath', icon: 'circle',
    detail: "The **tail sleeve** of the bacteriophage that runs down from the head. It gives the phage its tadpole-like shape and helps it dock onto a bacterial cell.",
  },
  {
    id: uuid(), x: 0.82, y: 0.85, label: 'Tail fibres', icon: 'circle',
    detail: "The thin **leg-like threads** at the base of the bacteriophage. They anchor the phage to the surface of the bacterium it is about to infect.",
  },
];

module.exports = {
  slug: 'viruses-viroids-prions-lichens',
  title: 'Viruses, Viroids, Prions & Lichens — The Ones That Fit No Kingdom',
  subtitle: "The cold that laid you out last winter was caused by something that isn't quite alive. Here are the four odd cases Whittaker's five kingdoms leave out — and the exact facts NEET lifts from them.",
  page_number: 9,
  page_type: 'lesson',
  tags: ['viruses', 'viroids', 'prions', 'lichens', 'biological-classification'],
  glossary: [
    { term: 'capsid', definition: 'The protein coat of a virus. It surrounds and protects the nucleic acid, and is built from small subunits called capsomeres.' },
    { term: 'capsomere', definition: 'A small protein subunit of the capsid. Capsomeres are arranged in helical or polyhedral geometric forms.' },
    { term: 'obligate parasite', definition: 'An organism that cannot reproduce on its own and can only replicate inside a living host cell — as every virus does.' },
    { term: 'viroid', definition: 'An infectious agent smaller than a virus, made of free low-molecular-weight RNA with no protein coat. Discovered by T.O. Diener in 1971.' },
    { term: 'prion', definition: 'An infectious agent consisting of an abnormally folded protein, similar in size to a virus; causes diseases such as BSE and CJD.' },
    { term: 'phycobiont', definition: 'The algal partner of a lichen. It is autotrophic and prepares food for the association.' },
    { term: 'mycobiont', definition: 'The fungal partner of a lichen. It is heterotrophic, provides shelter, and absorbs mineral nutrients and water for its partner.' },
    { term: 'nucleoprotein', definition: 'A particle made of nucleic acid plus protein — the basic composition of a virus (genetic material wrapped in a protein capsid).' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dark microscopic-world banner with faint crystalline virus particles drifting toward a single glowing living cell',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A dark, cold, microscopic void at the edge of a living world: on the left, faint geometric crystalline shapes and rod-like particles drift, motionless and lifeless, catching only the faintest cold light — suggesting inert virus crystals outside any cell. On the far right, a single softly glowing living cell, warm and rounded, sits like a lit window in the dark, the drifting particles slowly angling toward it. The contrast between the lifeless crystalline left and the warm living right is the whole mood — is this thing alive or not. Deep atmospheric lighting, one soft warm glow on the right, dark naturalistic background throughout (#0a0a0a base tones). Painterly illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Thing That Gave You Last Winter\'s Cold Isn\'t Quite Alive',
      markdown: "Everyone has suffered a common cold or the 'flu, even if we never stop to ask what actually caused it. The answer is a **virus** — and here's the strange part: a virus doesn't get a place in Whittaker's five kingdoms at all, because biologists don't consider it **truly 'living.'** If 'living' means having a **cell structure**, a virus fails the test. Sitting outside a body it is an **inert crystalline structure** — closer to a speck of salt than a living thing. So: would you call a virus living or non-living?",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "In the five kingdom classification of Whittaker there is **no mention of lichens** and some acellular oddities like **viruses, viroids and prions**. They don't fit anywhere, so we handle them separately here.\n\nStart with what a virus is *not*. It is **non-cellular** — no cell, no cell membrane, none of the machinery every real organism uses to live. Outside a host it is characterised by having an **inert crystalline structure**, doing nothing at all. That changes the instant it gets inside a living cell. Once a virus infects a cell, it **takes over the machinery of the host cell to replicate itself, killing the host** in the process. It cannot copy itself any other way, which is why every virus is an **obligate parasite** — it has no independent life, only a borrowed one. The word *virus* itself means **venom or poisonous fluid**.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Inside a Virus',
      objective: 'By the end of this you can label a TMV and a bacteriophage, and state the one rule about viral genetic material NEET tests every year.',
    },
    {
      id: uuid(), type: 'interactive_image', order: 4, src: '',
      alt: 'Structure of two viruses — a rod-shaped Tobacco Mosaic Virus and a tadpole-shaped bacteriophage',
      caption: '📸 Tap each dot to explore the parts of a virus (Figure 2.6)',
      hotspots: virusHotspots,
      generation_prompt: "Scientific textbook illustration of two virus structures side by side on a dark background (#0a0a0a near-black). Flat 2D educational diagram, clean white outlines, biologically accurate proportions, no baked-in text labels. LEFT (a): Tobacco Mosaic Virus — a straight rigid rod-shaped particle standing upright, its outer protein coat drawn as a regular helix of small repeating stacked subunits (capsomeres forming the capsid), with a single thread of nucleic acid (RNA) shown coiling helically through the hollow core, tinted faint green to read as a plant virus. RIGHT (b): a bacteriophage in the classic tadpole form — a hexagonal / polyhedral HEAD capsule at the top holding a coiled thread of nucleic acid, a short COLLAR beneath it, a straight tubular SHEATH (tail) running downward, and several thin bent TAIL FIBRES splaying out from the base like legs, tinted faint grey-white. The two viruses clearly separated, each in its own half of the frame. No photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
    },
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "Besides protein, a virus contains **genetic material** — and here is the single rule to lock in: it is **either RNA or DNA. No virus contains both.** Because it is nucleic acid wrapped in protein, a virus is called a **nucleoprotein**, and it is the genetic material that is **infectious**.\n\nWhich type you get depends on what the virus attacks:\n- **Plant-infecting viruses** — in general **single-stranded RNA**.\n- **Animal-infecting viruses** — either single- or double-stranded **RNA**, or double-stranded **DNA**.\n- **Bacteriophages** (viruses that infect bacteria) — usually **double-stranded DNA**.\n\nWrapping the nucleic acid is the **capsid**, a protein coat built from small subunits called **capsomeres**, arranged in **helical or polyhedral** geometric forms. Its job is simply to protect the nucleic acid inside.\n\nViruses cause plenty of human diseases — **mumps, small pox, herpes, influenza**, and **AIDS**. In plants the symptoms include **mosaic formation, leaf rolling and curling, yellowing and vein clearing, dwarfing and stunted growth.**",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "Outside a cell a virus is an inert, lifeless crystal — you could bottle it like a chemical. Yet the moment it enters a living cell it hijacks that cell's machinery and multiplies. Which statement best explains why a virus is often called a 'bridge' between the living and the non-living?",
      options: [
        'It has a full cell structure of its own, so it is fully living, and the crystal form is just a resting stage',
        'It behaves like a non-living chemical crystal outside a host, but shows the living trait of replication once inside a host cell',
        'It is made of both RNA and DNA at once, which no truly living or truly non-living thing can manage',
        'It is neither non-living nor living because it can photosynthesise but cannot move',
      ],
      correct_index: 1,
      reveal: "The crystalline, inert form outside a cell is pure non-living behaviour — no cell, no activity, nothing you'd call alive. But slipped inside a host it replicates, which is a hallmark of living things. Sitting between those two states is exactly what earns it the 'bridge' description. It does **not** have a cell structure of its own (that's why it's kept out of the five kingdoms), it never carries both RNA and DNA together, and no virus photosynthesises — it can only borrow a living cell's machinery.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Discovery of Viruses',
      objective: "By the end of this you can put the three name-and-year discoveries in order — the exact attributions NEET asks about.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "The story of the virus was pieced together by three scientists, and NEET loves testing who did what.\n\n**Dmitri Ivanowsky (1892)** was first. Studying the **mosaic disease of tobacco**, he recognised certain microbes as the cause and noticed they were **smaller than bacteria** — because they slipped straight **through bacteria-proof filters** that would trap any ordinary bacterium.\n\n**M.W. Beijerinck (1898)** went further. He showed that the **extract of infected tobacco plants could cause infection in healthy plants**, named the new pathogen **'virus,'** and called the mysterious fluid *Contagium vivum fluidum* — **infectious living fluid.**\n\n**W.M. Stanley (1935)** delivered the clincher: he showed that **viruses could be crystallised**, and that the crystals **consist largely of proteins.** This is the proof behind the 'inert crystal outside the host' idea you met earlier.",
    },
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'Viroids, Prions & Lichens',
      objective: 'By the end of this you can tell apart three infectious agents and explain what a lichen actually is.',
    },
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "**Viroids** are even smaller than viruses. In **1971, T.O. Diener** discovered this new infectious agent, which caused **potato spindle tuber disease**. The surprise was its make-up: it is **free RNA** and it **lacks the protein coat** that every virus has — that missing coat is exactly why it's named a *viroid*. Its RNA is of **low molecular weight**.\n\n**Prions** are stranger still. Certain infectious **neurological diseases** turned out to be spread not by any nucleic acid, but by an agent made of **abnormally folded protein** — an agent **similar in size to viruses**. These agents are the prions. The most notable prion diseases are **bovine spongiform encephalopathy (BSE)**, commonly called **mad cow disease** in cattle, and its human analogue **Creutzfeldt–Jakob disease (CJD).**\n\n**Lichens** are the odd one out — not an infectious agent at all, but a partnership. A lichen is a **symbiotic (mutually useful) association between an alga and a fungus.** The **algal component is the phycobiont**, which is **autotrophic** and prepares food; the **fungal component is the mycobiont**, which is **heterotrophic** and provides shelter and absorbs mineral nutrients and water for its partner. The two live so closely intertwined that if you saw a lichen in nature you would **never imagine there were two different organisms** inside it. One more thing to remember: lichens are **very good pollution indicators — they do not grow in polluted areas.**",
    },
    {
      id: uuid(), type: 'comparison_card', order: 11, title: 'Virus vs Viroid vs Prion',
      columns: [
        {
          heading: 'Virus',
          points: [
            'Infectious agent: **nucleic acid (RNA or DNA, never both) + protein** — a nucleoprotein',
            'Protein coat (capsid)? **Yes**',
            'Example disease: **influenza / small pox / AIDS**',
            'Key names: Ivanowsky, Beijerinck, Stanley',
          ],
        },
        {
          heading: 'Viroid',
          points: [
            'Infectious agent: **free RNA only** (low molecular weight)',
            'Protein coat? **No** — that missing coat gives it its name',
            'Example disease: **potato spindle tuber disease**',
            'Discovered by: **T.O. Diener (1971)**',
          ],
        },
        {
          heading: 'Prion',
          points: [
            'Infectious agent: **abnormally folded protein** (no nucleic acid)',
            'Protein coat? **Not applicable** — it *is* protein',
            'Example disease: **BSE (mad cow) / CJD**',
            'Attacks: the **nervous system**',
          ],
        },
      ],
    },
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember', title: 'The Five You Cannot Swap',
      markdown: "- **Virus** → genetic material is **RNA or DNA, NEVER both**; a nucleoprotein; obligate parasite.\n- **Capsid** → the protein coat, built from subunits called **capsomeres** (helical or polyhedral).\n- **Viroid** → **free RNA, no protein coat**; discovered by **Diener (1971)**; potato spindle tuber disease.\n- **Prion** → **misfolded protein**; causes **BSE (mad cow)** and **CJD**.\n- **Lichen** → **phycobiont (alga, makes food)** + **mycobiont (fungus, gives shelter & water)** = a **pollution indicator**.",
    },
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Match the name to the discovery:** *Ivanowsky* (1892, smaller than bacteria, passed filters) · *Beijerinck* (1898, *Contagium vivum fluidum*, coined 'virus') · *Stanley* (1935, viruses can be crystallised) · *Diener* (1971, viroid). These attributions are lifted straight into NEET.\n\n**Genetic-material rule:** plant viruses → **single-stranded RNA**; bacteriophages → **double-stranded DNA**; and no virus ever holds **both RNA and DNA** — the most common trap on this topic.\n\n**Lichen vocabulary:** **phyco**biont = the **alga** (autotroph, makes food); **myco**biont = the **fungus** (heterotroph, shelter + water). Memory hook: *phyco → **ph**otosynthesis*. Lichens as **pollution indicators** is a near-guaranteed one-liner.\n\n**Classic NEET question:** \"Which is free RNA without a protein coat?\" → the **viroid** (Diener). Don't confuse it with a prion, which is misfolded *protein*, not RNA.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which statement about the genetic material of a virus is correct?',
          options: [
            'A virus always contains both RNA and DNA together',
            "A virus contains either RNA or DNA, but never both, and this genetic material is infectious",
            'A virus contains only DNA, never RNA, in every case',
            'A virus contains protein as its genetic material, which is why it is called a nucleoprotein',
          ],
          correct_index: 1,
          explanation: "A virus carries either RNA or DNA — never both — and it is this nucleic acid that is infectious. It is not always DNA (plant viruses use single-stranded RNA), and its genetic material is nucleic acid, not protein; 'nucleoprotein' means nucleic acid wrapped in a protein coat, not that protein is the genes.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'A newly found infectious agent is shown to be free RNA of low molecular weight with no protein coat, and it causes potato spindle tuber disease. What is it, and who discovered it?',
          options: [
            'A prion, discovered by W.M. Stanley',
            'A bacteriophage, discovered by M.W. Beijerinck',
            'A viroid, discovered by T.O. Diener',
            'A virus, discovered by Dmitri Ivanowsky',
          ],
          correct_index: 2,
          explanation: "Free RNA with no protein coat causing potato spindle tuber disease is the viroid, discovered by T.O. Diener in 1971 — the missing coat is what gives it its name. A prion is misfolded protein, not RNA; a bacteriophage and a virus both have a protein capsid, so neither fits an agent defined by having no coat.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'In a lichen, which pairing of partner, role, and mode of nutrition is correct?',
          options: [
            'Phycobiont is the fungus; it is autotrophic and prepares food',
            'Mycobiont is the alga; it is heterotrophic and absorbs water',
            'Phycobiont is the alga; it is autotrophic and prepares food for the fungus',
            'Mycobiont is the alga; it is autotrophic and provides shelter',
          ],
          correct_index: 2,
          explanation: "The phycobiont is the algal partner — autotrophic, so it prepares the food. The mycobiont is the fungal partner — heterotrophic, providing shelter and absorbing water and minerals. Swapping the alga and fungus, or their autotroph/heterotroph roles, is the exact mix-up examiners set up here.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which discovery is correctly matched to the scientist who made it?',
          options: [
            "Beijerinck (1898) showed viruses could be crystallised and are largely protein",
            "Ivanowsky (1892) found the tobacco mosaic microbe was smaller than bacteria as it passed bacteria-proof filters",
            "Stanley (1935) named the pathogen 'virus' and called the fluid Contagium vivum fluidum",
            "Diener (1971) demonstrated that infected plant extract could infect healthy plants",
          ],
          correct_index: 1,
          explanation: "Ivanowsky (1892) showed the tobacco-mosaic microbe passed through bacteria-proof filters, proving it was smaller than bacteria. Crystallising the virus (largely protein) was Stanley (1935), not Beijerinck; naming 'virus' and coining Contagium vivum fluidum was Beijerinck (1898), not Stanley; and the infected-extract experiment was also Beijerinck — Diener (1971) discovered the viroid, a different agent entirely.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
