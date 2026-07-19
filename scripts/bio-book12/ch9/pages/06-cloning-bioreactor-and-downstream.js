'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'cloning-bioreactors-and-downstream-processing',
  title: 'From Cell to Product — Cloning, Bioreactors & Downstream Processing',
  subtitle: "You have your recombinant DNA. Now push it into a host, let that host copy the gene millions of times, grow the culture by the thousand-litre in a bioreactor, and clean up the harvest — the last stretch from a single gene to a bottled, marketable product.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['biotechnology-principles-and-processes', 'cloning', 'bioreactor', 'downstream-processing', 'recombinant-protein'],
  glossary: [
    { term: 'cloning', definition: 'Making many identical copies of a piece of DNA (and the cell carrying it): once the recombinant DNA is inside a competent host, the host multiplies and copies the foreign gene along with its own DNA, so one insert becomes millions.' },
    { term: 'selectable marker', definition: 'A gene (such as one for antibiotic resistance) that lets you pick out the host cells which took up the recombinant DNA from those which did not. Cells carrying it survive on a medium the others cannot.' },
    { term: 'recombinant protein', definition: 'A protein made when a protein-encoding gene is expressed inside a foreign (heterologous) host — the whole point of most recombinant DNA work.' },
    { term: 'bioreactor', definition: 'A vessel in which raw materials are biologically converted into specific products or enzymes using microbial, plant, animal or human cells, under controlled optimum conditions. Handles large volumes of 100–1000 litres of culture.' },
    { term: 'stirred-tank bioreactor', definition: 'The most common bioreactor design — usually cylindrical or with a curved base — in which a stirrer mixes the contents and spreads oxygen evenly through the culture.' },
    { term: 'sparger', definition: 'The part of the oxygen delivery system that bubbles sterile air up through the culture in a sparged stirred-tank bioreactor, supplying oxygen to the growing cells.' },
    { term: 'downstream processing', definition: 'The series of separation and purification steps a product goes through after the biosynthetic stage, before it can be formulated, quality-tested and marketed as a finished product.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A towering stainless-steel bioreactor glowing in a dim industrial hall, culture swirling behind a viewing port',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single tall gleaming stainless-steel stirred-tank bioreactor standing in a dim industrial fermentation hall, pipes and gauges climbing its curved flank, a small round viewing port on the right side glowing softly to hint at a living culture swirling inside. A drive motor sits on top, fine air bubbles suggested rising through the amber liquid behind the port. Warm low-key rim lighting rakes across the polished metal, the rest of the hall falling into deep shadow. Painterly, atmospheric, industrial-biotech mood; naturalistic steel greys and a warm amber glow against an overall dark background (#0a0a0a base tones). No text, no labels, no leader lines, no diagram callouts.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Insulin By the Thousand Litres',
      markdown: "A single bacterium carrying your gene is invisible and useless on its own. But let it divide — and its billions of descendants each carry a copy of that gene, each churning out the protein you asked for. A test tube can't hold enough of them to matter: **small-volume cultures cannot yield appreciable quantities of product.** So biotech grows them in **bioreactors that process 100 to 1000 litres of culture at a time.** That is how a life-saving protein stops being a lab curiosity and becomes something you can bottle, box and sell.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "By now you have made **recombinant DNA** — the gene of interest ligated into a vector. But recombinant DNA sitting in a test tube does nothing. The next moves take it from a molecule to a living factory: **get it into a host, let the host copy it, switch the gene on to make protein, grow that host in bulk, and finally purify the harvest.** This page walks that last stretch — the end of the recombinant DNA journey.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Into the Host, and Then Cloning',
      objective: "By the end of this you can explain how a competent host takes up the DNA, why we spike the plate with an antibiotic, and what 'cloning' actually means once the DNA is inside.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "To get the ligated recombinant DNA into a cell, the recipient cell first has to be made **'competent'** — able to take up DNA from its surroundings. A competent cell then absorbs the recombinant DNA present around it.\n\nBut how do you tell which cells actually took it up? NCERT's own example: suppose the recombinant DNA carries a **gene for resistance to an antibiotic (e.g., ampicillin)**, and it is transferred into *E. coli*. Any cell that takes it up becomes **transformed into an ampicillin-resistant cell.** Now spread all the cells on an **agar plate containing ampicillin** — only the **transformants grow**; the untransformed cells, having no resistance, **die.** Because the ampicillin-resistance gene lets you fish out exactly the cells you want, it is called a **selectable marker**.\n\nOnce the alien DNA is inside a bacterial, plant or animal cell, something powerful happens for free: as the host divides, **the alien DNA gets multiplied** right along with the host's own DNA. Every daughter cell inherits a copy of the foreign gene. That copying of the DNA — the host multiplying and duplicating the foreign gene over and over into an identical population — is what we mean by **cloning.**",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 5, reasoning_type: 'logical',
      prompt: "You transform E. coli with a recombinant plasmid carrying an ampicillin-resistance gene, then spread the whole mixture on an agar plate containing ampicillin. Only a few colonies grow. What are those colonies?",
      options: [
        "Cells that took up the recombinant DNA and became ampicillin-resistant (transformants)",
        "Cells that failed to take up the DNA but survived because ampicillin is harmless to them",
        "Cells in which the ampicillin killed the resistance gene but spared the cell",
        "Contaminating cells that never received any plasmid at all",
      ],
      reveal: "Only the cells that **took up the recombinant DNA** carry the resistance gene, so only they survive the ampicillin — those growing colonies are the **transformants.** The tempting trap is the second option, but ampicillin is *not* harmless: untransformed cells have no resistance gene and are killed, which is exactly why the plate 'selects' for the ones you want. The antibiotic is the filter, and the resistance gene is the ticket past it.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Scaling Up — The Stirred-Tank Bioreactor',
      objective: "By the end of this you can say why we need bioreactors at all, and name the parts of a stirred-tank bioreactor and what each one does.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "In almost every recombinant technology the ultimate aim is to **produce a desirable protein.** So the foreign gene must be **expressed** — switched on under the right conditions to actually make its protein. When a protein-encoding gene is expressed inside a foreign host like this, the product is called a **recombinant protein.**\n\nA few cells in a flask won't make enough. To keep cells at their most productive, biotech uses a **continuous culture system**: spent medium is drained out from one side while fresh medium is added from the other, holding the cells in their **log (exponential) phase** — this gives more biomass and higher yields. But even that needs scale. **Small-volume cultures cannot yield appreciable quantities of product**, so we develop **bioreactors** — vessels that process **large volumes (100–1000 litres)** of culture. A bioreactor is simply a vessel in which **raw materials are biologically converted into specific products or enzymes using microbial, plant, animal or human cells**, while providing the **optimum growth conditions — temperature, pH, substrate, salts, vitamins and oxygen.**\n\nThe most commonly used design is the **stirred-tank bioreactor** (Figure 9.7). It is usually **cylindrical or has a curved base** to help mix the contents. A central **stirrer** ensures even mixing *and* spreads oxygen throughout the tank; alternatively, sterile air can be bubbled up through the culture. Look closely and a stirred-tank bioreactor has: an **agitator system**, an **oxygen delivery system**, a **foam control system**, a **temperature control system**, a **pH control system**, and **sampling ports** to withdraw small volumes of culture from time to time.\n\nOnce the culture has done its work, the product still has to be cleaned up. After the **biosynthetic stage**, it passes through **separation and purification** steps — together called **downstream processing** — then is **formulated with suitable preservatives**. Like any drug, that formulation must clear **clinical trials**, and each product faces **strict quality control testing**. The exact downstream steps and quality checks **vary from product to product.**",
    },
    {
      id: uuid(), type: 'interactive_image', order: 8, src: '',
      alt: 'Labelled diagram of a sparged stirred-tank bioreactor: a cylindrical vessel with a curved base, a top drive motor turning a central shaft with impeller blades, a sparger ring bubbling air at the base, a temperature-control jacket, a pH probe, a foam breaker near the top, and a sampling port on the side',
      caption: '📸 Tap each dot to explore the sparged stirred-tank bioreactor (Figure 9.7)',
      generation_prompt: "Scientific textbook illustration of a sparged stirred-tank bioreactor, cross-sectional view. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A tall cylindrical stainless-steel vessel with a gently curved base, shown cut open to reveal the culture liquid inside. Details, arranged clearly: a drive motor sitting on top of the vessel; a vertical central shaft descending from the motor into the liquid, carrying two or three flat impeller (agitator) blades midway down; at the very bottom, a horizontal ring-shaped sparger releasing many small rising air bubbles up through the culture; an outer jacket hugging the vessel wall with small inlet and outlet pipes (temperature control system); a slender probe entering the side wall into the liquid (pH control system); a flat horizontal foam-breaker disc mounted on the shaft near the top above the liquid surface (foam control system); and a small tap/valve on the lower side wall (sampling port). Clean white outlines, industrial equipment proportions, functional colours (steel grey vessel, pale amber culture liquid, blue water pipes on the jacket, faint blue rising air bubbles). No baked-in text labels, no leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.45, label: 'Agitator / impeller (agitator system)', icon: 'circle',
          detail: 'The **stirrer** on the central shaft. It ensures **even mixing** of the reactor contents **and spreads oxygen** throughout the culture — the single part that keeps cells, nutrients and air uniform everywhere in the tank.' },
        { id: uuid(), x: 0.5, y: 0.86, label: 'Sparger (oxygen delivery system)', icon: 'circle',
          detail: 'A ring at the base that **bubbles sterile air up through the culture**. In a *sparged* stirred-tank bioreactor this is how oxygen is delivered — an alternative or supplement to mixing air in with the stirrer.' },
        { id: uuid(), x: 0.14, y: 0.55, label: 'Temperature control system', icon: 'circle',
          detail: 'The **outer jacket** with water pipes around the vessel. It holds the culture at the **optimum temperature** — one of the growth conditions (along with pH, substrate, salts, vitamins, oxygen) a bioreactor must provide.' },
        { id: uuid(), x: 0.83, y: 0.5, label: 'pH control system', icon: 'circle',
          detail: 'A **probe monitoring the pH** of the culture. Cells only stay productive within a narrow pH range, so the bioreactor measures and corrects it to keep conditions optimum.' },
        { id: uuid(), x: 0.5, y: 0.2, label: 'Foam control system', icon: 'circle',
          detail: 'Stirring and sparging whip up **foam** on the culture surface. The foam control system (here a breaker near the top of the shaft) keeps foam down so it does not clog outlets or carry cells away.' },
        { id: uuid(), x: 0.82, y: 0.74, label: 'Sampling port', icon: 'circle',
          detail: 'A small valve on the side. It lets you **withdraw small volumes of culture periodically** — to check how the cells and product are doing — without opening or contaminating the whole tank.' },
      ],
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: 'Lock These In',
      markdown: "- **Cloning** = the host cell multiplying and **copying the foreign gene** into an identical population once the recombinant DNA is inside it.\n- **Selectable marker** (e.g. an **antibiotic-resistance gene** like ampicillin resistance) lets you pick out transformed cells — they survive the antibiotic, untransformed cells die.\n- A **bioreactor** processes **100–1000 litres** of culture and provides optimum **temperature, pH, substrate, salts, vitamins and oxygen.**\n- The **stirred-tank bioreactor** is the most common design — **cylindrical or curved base**; the **stirrer gives even mixing AND oxygen.**\n- Its parts: **agitator system, oxygen delivery system (sparger), foam control, temperature control, pH control, sampling ports.**\n- **Downstream processing** = **separation and purification** after the biosynthetic stage, then **formulation with preservatives**, **clinical trials** and **quality control** — and it **varies from product to product.**",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Stirrer does two jobs:** NEET loves the line that the stirrer/agitator provides **even mixing AND oxygen availability** — not just mixing. Don't pick an option that gives it only one role.\n\n**Bioreactor volume:** the **100–1000 litre** figure is lifted verbatim; the reason for bioreactors is that **small-volume cultures cannot give appreciable product.**\n\n**Downstream processing = separation + purification** (after the product is made). It does **not** include making the product — that's the biosynthetic stage before it.\n\n**Selectable marker:** an **antibiotic-resistance gene** used to identify transformants, not to make the product.\n\n**Classic NEET question:** \"The stirrer in a stirred-tank bioreactor helps in ___\" → **even mixing and oxygen availability throughout the vessel.** Another favourite: \"Separation and purification of the product is called ___\" → **downstream processing.**",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'In a stirred-tank bioreactor, what does the stirrer (agitator) achieve?',
          options: [
            'It only keeps the culture temperature constant',
            'It ensures even mixing and oxygen availability throughout the vessel',
            'It bubbles sterile air in and nothing more',
            'It separates and purifies the finished product',
          ],
          correct_index: 1,
          explanation: "NCERT says the stirrer facilitates even mixing AND oxygen availability throughout the bioreactor — two jobs, not one. The trap is picking a single role: temperature is handled by the jacket, air-bubbling is the sparger's job, and separation/purification is downstream processing, which happens after the culture stage entirely.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'The separation and purification steps a product goes through after the biosynthetic stage are collectively called:',
          options: [
            'Downstream processing',
            'Bioprocess engineering',
            'Cloning',
            'Gel electrophoresis',
          ],
          correct_index: 0,
          explanation: "Separation and purification after the biosynthetic stage are together termed downstream processing, followed by formulation and quality control. Cloning is the multiplying of the DNA inside the host (earlier), and gel electrophoresis is a DNA-separation tool used during cutting/checking — neither is the post-production clean-up.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Why are bioreactors used instead of ordinary flasks for making a recombinant product?',
          options: [
            'Flasks cannot be kept sterile at all',
            'Bioreactors process large volumes (100–1000 litres); small-volume cultures cannot yield appreciable product',
            'Bioreactors remove the need to express the foreign gene',
            'Flasks kill all antibiotic-resistant cells',
          ],
          correct_index: 1,
          explanation: "NCERT is explicit: small-volume cultures cannot yield appreciable quantities of product, so bioreactors that handle 100–1000 litres are developed for large-scale production. The gene still must be expressed to make protein (bioreactors don't skip that step), and antibiotic selection happens on plates, not because of flask size.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'A recombinant plasmid carries an ampicillin-resistance gene. In the cloning experiment, this gene acts as a:',
          options: [
            'Origin of replication',
            'Sparger',
            'Selectable marker',
            'Restriction enzyme',
          ],
          correct_index: 2,
          explanation: "The antibiotic-resistance gene lets you select transformed cells — they survive on ampicillin while untransformed cells die — so it works as a selectable marker. An origin of replication controls how many copies the DNA makes, a sparger delivers oxygen in a bioreactor, and a restriction enzyme cuts DNA; none of those is the tool used to pick out the transformants.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
