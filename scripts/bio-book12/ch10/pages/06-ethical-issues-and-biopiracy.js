'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'ethical-issues-and-biopiracy',
  title: 'The Ethics of Biotechnology — GEAC & Biopiracy',
  subtitle: "Why moving genes around can't go on without rules, what GEAC actually decides, and how the world's bio-rich countries get robbed of their own plants and traditional knowledge through unfair patents.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['biotechnology-and-its-applications', 'ethical-issues', 'geac', 'biopatent', 'biopiracy', 'basmati', 'neem', 'turmeric'],
  glossary: [
    { term: 'GEAC (Genetic Engineering Approval Committee)', definition: 'An organisation set up by the Indian Government to make decisions regarding the validity of GM research and the safety of introducing GM-organisms for public services (such as food and medicine).' },
    { term: 'GMO (Genetically Modified Organism)', definition: 'A living organism whose genes have been altered by methods other than natural ones. Because such modification can have unpredictable results once the organism enters an ecosystem, GM work needs regulation.' },
    { term: 'biopatent', definition: 'A patent granted for a biological product, process or technology — for example a variety of a crop or a use of a plant. It gives the patent-holder exclusive rights over that product or process.' },
    { term: 'biopiracy', definition: 'The use of bio-resources by multinational companies and other organisations without proper authorisation from the countries and people concerned, and without any compensatory payment.' },
    { term: 'bio-resources', definition: "A region's living wealth — its plants, animals, microbes and their genetic material — together with the traditional knowledge people have built around using them." },
    { term: 'traditional knowledge', definition: 'Knowledge of bio-resources long identified, developed and used by farmers and indigenous people of a region, which can be exploited to develop modern applications and save time, effort and expenditure during commercialisation.' },
  ],
  blocks: [
    // ── hero ─────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A weathered pair of scales standing in an Indian field — on one side ripe golden basmati grain, sprigs of neem and a knot of turmeric root; on the other a cold official seal — under a heavy overcast sky',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet, sombre agricultural landscape at dusk under a heavy grey-blue overcast sky. In the foreground stands an old weathered balance scale rooted in dark soil: on one pan sit the living riches of the land — a bundle of golden ripe basmati rice stalks, a sprig of green neem leaves, and a gnarled knob of bright turmeric root; on the other pan rests a cold, impersonal official document with a wax seal, tipping the balance unfairly. Behind it, rows of an Indian paddy field fade into mist. The mood is one of quiet injustice, not drama. Muted, naturalistic, earthy palette — ochre, deep green, dull gold — with deep shadow tones throughout (#0a0a0a base) and soft directional light. Painterly, atmospheric illustration style. No text, no labels, no diagram elements, no people.",
    },
    // ── fun_fact ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Someone Tried to Patent Haldi',
      markdown: "Think about the most ordinary things in an Indian kitchen and garden — **turmeric (haldi)** dabbed on a wound, **neem** twigs used to clean teeth, and **basmati** rice cooked for centuries. Now imagine being told a foreign company owns the rights to them. That is not a story — it actually happened. In **1997 an American company got patent rights on basmati rice** through the US Patent and Trademark Office, on a 'new' variety that had really been **derived from Indian farmers' varieties**. Similar attempts were made to patent uses and products based on **turmeric and neem** — plants Indians had known and used forever. India had to **fight back and counter these patent claims**, because if a country is not vigilant, others can quietly cash in on a legacy that was never theirs. This page is about the rules and the fights that protect that legacy.",
    },
    // ── WHY GM NEEDS OVERSIGHT + GEAC ────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 2, level: 2,
      text: 'Why Moving Genes Around Needs a Referee',
      objective: "By the end of this you can explain why genetic modification cannot go unregulated, and state exactly what GEAC decides.",
    },
    {
      id: uuid(), type: 'text', order: 3,
      markdown: "For the whole of this chapter we have celebrated what biotechnology can do — better crops, cheaper insulin, gene therapy, more milk. But there is a line the book draws firmly at the end: **the manipulation of living organisms by humans cannot go on any further without regulation.** Some **ethical standards** are needed to judge whether all this activity actually helps or harms living things.\n\nThere is a hard-nosed biological reason too, not just a moral one. **Genetic modification of organisms can have unpredictable results when such organisms are introduced into the ecosystem.** You engineer a gene in a lab under controlled conditions — but once that **GM organism (GMO)** is released into fields, forests and food chains, nobody can be fully certain how it will behave, spread or affect other species. That uncertainty is exactly why it can't be a free-for-all.\n\nSo the **Indian Government has set up organisations such as GEAC — the Genetic Engineering Approval Committee.** Hold on to what GEAC actually does, because NEET loves this line: **GEAC makes decisions regarding (1) the validity of GM research and (2) the safety of introducing GM-organisms for public services.** 'Public services' here means things like GM crops used as **food** or GM microbes used as sources of **medicine**. In short, GEAC is the referee: it decides whether a piece of GM research is sound, and whether a GM organism is safe enough to be let out into public use.",
    },
    // ── BIOPATENTS + BIOPIRACY ───────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 4, level: 2,
      text: 'Biopatents, Biopiracy and the Basmati Fight',
      objective: "By the end of this you can define biopiracy precisely and name the three classic Indian examples — basmati, turmeric and neem.",
    },
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "Once living organisms can be modified and used for **food and medicine**, a second problem appears: **patents**. A **biopatent** gives a company exclusive rights over a biological product or process. There is growing public anger that certain companies are being granted patents for **products and technologies that make use of genetic materials, plants and biological resources that have long been identified, developed and used by farmers and indigenous people** of a particular region. The people who nurtured the resource for generations get nothing; the company that files the paperwork gets the rights.\n\nThe **basmati** case makes it concrete. India has an estimated **200,000 varieties of rice**, and basmati alone has **27 documented varieties**, prized for a unique aroma and flavour and mentioned in ancient texts and folklore. Yet in **1997 an American company obtained a patent on basmati rice**, on a 'new' variety that was actually **Indian basmati crossed with semi-dwarf varieties** and then claimed as an invention. Worse, the patent extended to **functional equivalents**, meaning other people selling basmati rice could be restricted by it. Separate attempts were also made to patent uses, products and processes based on Indian traditional herbal medicines — **turmeric and neem** being the famous ones.\n\nThis kind of taking has a name. **Biopiracy is the use of bio-resources by multinational companies and other organisations without proper authorisation from the countries and people concerned, and without compensatory payment.** The pattern behind it is a mismatch: the **industrialised nations are rich financially but poor in biodiversity and traditional knowledge**, while the **developing and underdeveloped world is rich in biodiversity and in the traditional knowledge** tied to it — knowledge that can be used to build modern applications and to save time, effort and money during commercialisation. Because of the growing realisation of this injustice and inadequate compensation, **some nations are developing laws to prevent the unauthorised exploitation of their bio-resources and traditional knowledge.** In India, Parliament has cleared the **second amendment of the Indian Patents Bill** to take such issues into account.",
    },
    // ── mid-page reasoning check ─────────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A company in a wealthy, low-biodiversity country takes a plant that farmers in a bio-rich country have grown and used for centuries, patents a barely-changed 'new' variety, and pays those farmers nothing. Why does NCERT treat this as unfair, and what deeper reason lies behind setting up bodies and laws to govern such work?",
      options: [
        "It is fair, because whoever files the patent paperwork first has genuinely invented the product",
        "It is unfair only because the variety was crossed with semi-dwarf plants, not for any reason of ownership",
        "It is unfair because the bio-resource and traditional knowledge belonged to the people and country concerned, who gave no authorisation and got no compensation — and unregulated GM work can also have unpredictable effects on ecosystems",
        "It is unfair only because the company was foreign; an Indian company doing the same would be perfectly acceptable",
      ],
      correct_index: 2,
      reveal: "Biopiracy is **using bio-resources without proper authorisation from the people and country concerned and without compensatory payment** — the wrong is the missing consent and missing benefit-sharing, not the nationality of the company or the breeding detail. The wider reason for GEAC and for patent laws is twofold: **genetic modification can have unpredictable results in the ecosystem**, and a nation's **biodiversity and traditional knowledge** need legal protection from exploitation. The 'first to file has invented it' option is exactly the injustice NCERT is criticising, and the 'crossed with semi-dwarf' option mistakes one detail of the basmati case for the whole principle.",
      difficulty_level: 2,
    },
    // ── remember ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 7, variant: 'remember', title: 'Lock These Down',
      markdown: "- **GEAC = Genetic Engineering Approval Committee**, set up by the **Indian Government**. It decides **(1) the validity of GM research** and **(2) the safety of introducing GM-organisms for public services**. Do not expand the 'A' to 'Advisory' — it is **Approval**.\n- **Why regulation at all:** genetic modification can have **unpredictable results when organisms are introduced into the ecosystem**.\n- **Biopiracy** = the use of **bio-resources by multinational companies / organisations without proper authorisation from the countries and people concerned, and without compensatory payment**. Memorise the two missing pieces: **authorisation** and **compensation**.\n- **The three classic Indian examples:** **basmati** rice (US patent, 1997), **turmeric (haldi)**, and **neem**.\n- **The imbalance:** industrialised nations are **financially rich but biodiversity-poor**; developing nations are **biodiversity-rich and traditional-knowledge-rich**. India's answer: the **second amendment of the Indian Patents Bill**.",
    },
    // ── exam_tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 8, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**GEAC full form and role are lifted verbatim.** GEAC = **Genetic Engineering Approval Committee**; its job is the **validity of GM research** and the **safety of introducing GM-organisms for public services**. Distractors swap 'Approval' for 'Advisory/Advisory Council' or 'Committee' for 'Commission' — read every word.\n\n**Biopiracy definition is a favourite one-liner:** use of bio-resources **without proper authorisation** and **without compensatory payment**. If an option drops either phrase, it's wrong.\n\n**Example matching:** **basmati, turmeric, neem** are the three patent cases NCERT names. GM insulin, Bt cotton or RNAi are *applications* of biotechnology — not biopiracy examples — and are planted as traps.\n\n**Why regulate:** the exact reason is **unpredictable results when GM organisms enter the ecosystem** — not 'because it is expensive' or 'because it is illegal'.\n\n**Classic NEET question:** \"GEAC stands for and is concerned with —\" → **Genetic Engineering Approval Committee; validity of GM research and safety of releasing GM organisms for public services.** The tempting wrong pick is 'Genetic Engineering Advisory Committee' — the word is **Approval**, not Advisory.",
    },
    // ── inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 9, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'The Indian Government set up GEAC. What does the abbreviation stand for, and what does the body decide?',
          options: [
            'Genetic Engineering Advisory Council — it funds all GM research carried out in India',
            'Genetic Engineering Approval Committee — it decides the validity of GM research and the safety of introducing GM-organisms for public services',
            'Government Environmental Approval Cell — it grants patents on genetically modified crops and medicines',
            'Genetically Engineered Assessment Commission — it exports GM organisms to other countries',
          ],
          correct_index: 1,
          explanation: "GEAC is the Genetic Engineering Approval Committee, and it makes decisions on the validity of GM research and the safety of introducing GM-organisms for public services. The 'Advisory Council' option changes 'Approval' to 'Advisory' and invents a funding role; the other two invent entirely wrong names and jobs (granting patents, exporting GMOs) that GEAC does not do.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Why does NCERT insist that the manipulation of living organisms needs regulation by bodies like GEAC?',
          options: [
            'Because GM crops always yield less than normal crops and must be limited',
            'Because genetic modification is banned everywhere except in India',
            'Because GM techniques are too expensive for private companies to use safely',
            'Because genetic modification of organisms can have unpredictable results when they are introduced into the ecosystem',
          ],
          correct_index: 3,
          explanation: "NCERT's stated biological reason is that genetic modification can have unpredictable results once the organisms enter the ecosystem — that uncertainty is why oversight is needed. The other options are inventions: GM crops are not said to always yield less, GM work is not banned everywhere, and cost is not the reason NCERT gives for regulation.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which set is made up entirely of the classic Indian cases where foreign patents were sought on bio-resources long used by local people?',
          options: [
            'Basmati rice, turmeric (haldi) and neem',
            'Bt cotton, golden rice and Flavr Savr tomato',
            'Human insulin, alpha-1 antitrypsin and rosie the cow',
            'RNA interference, gene therapy and ADA deficiency',
          ],
          correct_index: 0,
          explanation: "Basmati, turmeric and neem are the three patent cases NCERT names when discussing biopiracy. The second set (Bt cotton, golden rice, Flavr Savr) are genetically modified products, the third are biotech medical products/animals, and the fourth are techniques and a disorder — all real biotechnology, but none of them are the biopiracy patent examples.",
          difficulty_level: 3,
        },
        {
          id: uuid(), question: 'Biopiracy is best defined as the use of bio-resources by multinational companies and organisations —',
          options: [
            'with the full consent of the country concerned, but at a reduced price',
            'only after paying fair compensation to the farmers who developed them',
            'without proper authorisation from the countries and people concerned and without compensatory payment',
            'strictly within the borders of the country where the resource originated',
          ],
          correct_index: 2,
          explanation: "Biopiracy is defined by two missing things — no proper authorisation from the people/country concerned, and no compensatory payment. Options that describe consent being given, fair compensation being paid, or use staying inside the home country all describe the opposite of biopiracy, which is precisely what makes them tempting traps.",
          difficulty_level: 1,
        },
      ],
    },
  ],
};
