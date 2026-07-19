'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'drugs-and-alcohol-abuse',
  title: 'Drugs & Alcohol Abuse',
  subtitle: "Where the commonly abused drugs come from, how they push and pull the nervous system, and why one experiment out of curiosity can slide into addiction, dependence and withdrawal.",
  page_number: 7,
  page_type: 'lesson',
  tags: ['human-health-and-disease', 'drug-abuse', 'opioids', 'cannabinoids', 'cocaine', 'addiction', 'dependence'],
  glossary: [
    { term: 'opioid', definition: 'A drug that binds to specific opioid receptors in the central nervous system and gastrointestinal tract. Heroin (smack) is an opioid; it is a depressant and slows down body functions.' },
    { term: 'cannabinoid', definition: 'A group of chemicals obtained from the inflorescences of Cannabis sativa that interact with cannabinoid receptors present principally in the brain. Marijuana, hashish, charas and ganja are all cannabinoid preparations.' },
    { term: 'cocaine', definition: 'The coca alkaloid, obtained from Erythroxylum coca. It interferes with the transport of the neurotransmitter dopamine and has a potent stimulating action on the central nervous system.' },
    { term: 'nicotine', definition: 'An alkaloid present in tobacco. It stimulates the adrenal gland to release adrenaline and nor-adrenaline into the blood, both of which raise blood pressure and increase heart rate.' },
    { term: 'addiction', definition: 'A psychological attachment to certain effects — such as euphoria and a temporary feeling of well-being — associated with drugs and alcohol, which drives a person to take them even when they are not needed or their use becomes self-destructive.' },
    { term: 'dependence', definition: 'The tendency of the body to manifest a characteristic and unpleasant withdrawal syndrome if a regular dose of drugs or alcohol is abruptly discontinued.' },
    { term: 'withdrawal syndrome', definition: 'The set of symptoms — anxiety, shakiness, nausea and sweating — that appear when a regular dose of a drug or alcohol is stopped suddenly. It is relieved when use is resumed, and in some cases can be severe and even life-threatening.' },
  ],
  blocks: [
    // ── hero ─────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'Three flowering plants standing quietly in low light — a poppy, a cannabis plant and a coca shrub — the ordinary-looking sources of the drugs that are most often abused',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet, sombre field at dusk under a heavy grey-blue sky. Standing apart from one another in the low light are three ordinary-looking flowering plants: on the left an opium poppy with a single pale nodding flower and a swollen green seed capsule; in the centre a tall cannabis plant with its distinctive palm-shaped serrated leaves; on the right a modest leafy coca shrub. Nothing glamorised — just three real plants rooted in dark soil, rendered so they look deceptively harmless. Muted, naturalistic, earthy palette, deep shadow tones throughout (#0a0a0a base), soft directional light. Painterly, atmospheric illustration style, no text, no labels, no diagram elements, no people.",
    },
    // ── fun_fact ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Same Plant, the Medicine and the Menace',
      markdown: "Here's the uncomfortable twist that runs through this whole topic: the drugs that wreck lives start out as **medicines**. **Morphine** — squeezed from the very same poppy that gives us heroin — is one of the finest **sedatives and painkillers** doctors have, and is genuinely useful for patients recovering from surgery. Barbiturates, amphetamines and benzodiazepines are prescribed to help people cope with **depression and insomnia**. The chemistry doesn't change between the hospital and the street. What changes is the **purpose and the amount**: the moment any of these is taken for something other than medical use, or in amounts and frequency that harm a person's body, mind or behaviour, it stops being treatment and becomes **drug abuse**.",
    },
    // ── the drugs ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 2, level: 2,
      text: 'The Drugs Most Commonly Abused',
      objective: "By the end of this you can name each commonly abused drug, the plant it comes from, and whether it speeds the nervous system up or slows it down.",
    },
    {
      id: uuid(), type: 'text', order: 3,
      markdown: "The drugs that are commonly abused fall into three groups — **opioids, cannabinoids and coca alkaloids**. The majority of these come from **flowering plants**. Once you tie each drug to its plant and its action on the nervous system, the whole topic falls into place.\n\n**Opioids** are drugs that **bind to specific opioid receptors** present in our **central nervous system and gastrointestinal tract**. The one to remember is **heroin**, commonly called **smack**. Chemically it is **diacetylmorphine** — a white, odourless, bitter crystalline compound — made by the **acetylation of morphine**, which is extracted from the **latex of the poppy plant, *Papaver somniferum***. Heroin is generally taken by **snorting and injection**, and it is a **depressant**: it **slows down body functions**.\n\n**Cannabinoids** are a group of chemicals that interact with **cannabinoid receptors present principally in the brain**. The natural ones are obtained from the **inflorescences (flower clusters) of *Cannabis sativa***. The **flower tops, leaves and resin** of this plant, used in various combinations, give us **marijuana, hashish, charas and ganja**. Usually taken by **inhalation and oral ingestion**, cannabinoids are known for their effects on the **cardiovascular system** — the heart and blood vessels. These days they are also being abused by some **sportspersons**.\n\n**Coca alkaloid, or cocaine**, is obtained from the **coca plant *Erythroxylum coca***, native to South America. It **interferes with the transport of the neurotransmitter dopamine**. Commonly called **coke or crack**, it is usually **snorted**, and it has a **potent stimulating action** on the central nervous system, producing a sense of **euphoria and increased energy**. An excessive dose causes **hallucinations**.\n\nOne more that isn't in the 'three groups' list but paves the way to the hard drugs — **tobacco**. Used by humans for over 400 years, it is smoked, chewed or taken as snuff. Tobacco contains **nicotine, an alkaloid**, which **stimulates the adrenal gland** to release **adrenaline and nor-adrenaline** into the blood — both **raise blood pressure and increase heart rate**. Smoking is linked with cancers of the **lung, urinary bladder and throat**, plus bronchitis, emphysema, coronary heart disease and gastric ulcer; tobacco chewing raises the risk of **cancer of the oral cavity**. Smoking also increases **carbon monoxide** in the blood and lowers haem-bound oxygen, causing **oxygen deficiency** in the body.",
    },
    // ── table: drug / source plant / type / effect ───────────────────────
    {
      id: uuid(), type: 'table', order: 4,
      caption: '📸 The commonly abused drugs at a glance — plant source, action on the nervous system, and chief effect. Lock this table down; NEET matches these columns almost every year.',
      headers: ['Drug', 'Source plant', 'Type', 'Chief effect on the body'],
      rows: [
        ['Heroin / smack (opioid)', 'Papaver somniferum (poppy)', 'Depressant', 'Binds opioid receptors in the CNS and gastrointestinal tract; slows down body functions'],
        ['Marijuana, hashish, charas, ganja (cannabinoids)', 'Cannabis sativa', 'Not classed as stimulant or depressant', 'Bind cannabinoid receptors in the brain; affect the cardiovascular system'],
        ['Cocaine / coke / crack (coca alkaloid)', 'Erythroxylum coca', 'Stimulant', 'Interferes with dopamine transport; euphoria and increased energy; excess causes hallucinations'],
        ['Tobacco (nicotine)', 'Tobacco plant', 'Stimulant (of the adrenal gland)', 'Releases adrenaline / nor-adrenaline — raises blood pressure and heart rate; linked to cancers and heart disease'],
      ],
    },
    // ── addiction, dependence, adolescents, prevention ───────────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'How a First Try Becomes a Trap',
      objective: "By the end of this you can separate addiction from dependence, explain withdrawal syndrome, say why adolescents are especially at risk, and list how abuse is prevented.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Almost nobody starts out planning to become an addict. **Adolescence** — roughly the **12–18 years** of age, the bridge between childhood and adulthood — is a **vulnerable phase** of mental and psychological development. **Curiosity, a need for adventure and excitement, and plain experimentation** are the common triggers that first push youngsters towards drugs and alcohol. What begins as one curious try can shift into using drugs to **escape from problems**. Modern **stress — the pressure to excel in academics and examinations** — plays a big part, as does the perception that it's **'cool'** to smoke or use drugs (helped along by television, movies and the internet). **Unstable or unsupportive family structures and peer pressure** complete the picture.\n\nNow the two words students constantly mix up. **Addiction** is a **psychological attachment** to certain effects — the **euphoria and temporary feeling of well-being** — that drugs and alcohol give. This attachment drives a person to keep taking them even when they aren't needed, and even when use turns self-destructive. On top of this, with repeated use the **tolerance level of the body's receptors rises**, so they only respond to **higher doses** — which means still greater intake, and deeper addiction. Even a **single use** can be a fore-runner to this vicious circle.\n\n**Dependence** is the body's side of the trap. It is the tendency of the body to show a characteristic and unpleasant **withdrawal syndrome** if a regular dose is **abruptly stopped**. Withdrawal is marked by **anxiety, shakiness, nausea and sweating**, and it is **relieved when the drug is taken again** — which is exactly what keeps a dependent person hooked. In some cases these symptoms are severe and even life-threatening, needing medical supervision.\n\nBecause the habit almost always begins young, **'prevention is better than cure'** is the guiding idea, and parents and teachers carry a special responsibility. NCERT lists five measures: **avoid undue peer pressure** (respect a child's own capacity, don't push beyond their limits), **education and counselling** to face stress and channel energy into sport, reading, music and yoga, **seeking help from parents and peers** early, **looking for the danger signs** (a drop in academic performance, withdrawal, isolation, changing sleep and eating habits), and **seeking professional and medical help** — psychologists, psychiatrists and de-addiction and rehabilitation programmes. With such help and enough will power, a person can recover fully and lead a perfectly normal, healthy life. And that hopeful line is where this chapter on human health and disease closes.",
    },
    // ── mid-page reasoning check ─────────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
      prompt: "Two people describe how a drug makes them feel. One says it makes them feel unusually alert, full of energy and euphoric, with racing thoughts. The other says it makes them calm, drowsy, and slows everything down. If the first person is on a coca alkaloid and the second is on an opioid, which classification is correct for each?",
      options: [
        "Both are depressants — all abused drugs ultimately sedate the nervous system",
        "The coca alkaloid (cocaine) is a stimulant; the opioid (heroin) is a depressant",
        "The coca alkaloid (cocaine) is a depressant; the opioid (heroin) is a stimulant",
        "Both are stimulants — both raise the heart rate, so both speed the body up",
      ],
      correct_index: 1,
      reveal: "Cocaine has a **potent stimulating action** on the central nervous system — euphoria and increased energy — so it is a **stimulant**. Heroin **slows down body functions**, so it is a **depressant**. The tempting trap is the last option: it's true that some drugs raise heart rate, but 'raises heart rate' is not what defines a stimulant here — a stimulant *speeds up* nervous-system activity while a depressant *slows it down*, and heroin clearly slows the body, so it can't be a stimulant.",
      difficulty_level: 2,
    },
    // ── remember ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 8, variant: 'remember', title: 'The Pairings You Cannot Swap',
      markdown: "- **Plant sources:** Heroin ← **Papaver somniferum** (poppy). Cannabinoids ← **Cannabis sativa**. Cocaine ← **Erythroxylum coca**. Get the plant wrong and the marks are gone.\n- **Stimulant vs depressant:** **Cocaine = stimulant** (speeds the CNS up, euphoria). **Heroin = depressant** (slows body functions). **Nicotine** stimulates the adrenal gland. Cannabinoids act on the **cardiovascular system**.\n- **Heroin = smack = diacetylmorphine**, made by **acetylation of morphine**. **Morphine** is a useful medicinal sedative and painkiller — same source plant.\n- **Addiction = psychological** attachment to the drug's effects. **Dependence = the body's** withdrawal syndrome (anxiety, shakiness, nausea, sweating) when a regular dose is stopped.\n- **Adolescence = 12–18 years.** Causes: **curiosity, adventure, experimentation, stress, peer pressure, unsupportive family**.",
    },
    // ── exam_tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 9, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Drug–source plant matching is the single most examined fact here.** Lock the three pairs: *Papaver somniferum* → heroin, *Cannabis sativa* → cannabinoids (marijuana/hashish/charas/ganja), *Erythroxylum coca* → cocaine.\n\n**Stimulant vs depressant:** NEET flips these to catch you. Cocaine = **stimulant**, heroin = **depressant**. Nicotine stimulates the **adrenal gland** to release adrenaline/nor-adrenaline.\n\n**Receptor sites are lifted verbatim:** opioids → receptors in the **CNS and gastrointestinal tract**; cannabinoids → receptors principally in the **brain**; cocaine → interferes with **dopamine** transport.\n\n**Addiction vs dependence:** addiction is **psychological attachment**; dependence is the **body's withdrawal syndrome** on stopping. Don't mix them.\n\n**Classic NEET question:** \"Which of the following is obtained from *Erythroxylum coca* and acts as a CNS stimulant?\" → **Cocaine** (coke/crack). Heroin is the tempting wrong pick — but that's from the poppy and is a depressant.",
    },
    // ── inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 10, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Heroin (smack) is chemically diacetylmorphine. From which plant is the morphine that it is made from ultimately obtained?',
          options: [
            'Cannabis sativa',
            'Erythroxylum coca',
            'Papaver somniferum',
            'Atropa belladona',
          ],
          correct_index: 2,
          explanation: "Heroin is made by acetylation of morphine, and morphine is extracted from the latex of the poppy plant Papaver somniferum. Cannabis sativa is the source of cannabinoids and Erythroxylum coca of cocaine — not opioids — while Atropa belladona is a hallucinogenic plant, not the source of heroin.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Which drug is correctly matched with its action on the nervous system?',
          options: [
            'Cocaine — a depressant that slows down body functions',
            'Heroin — a depressant that slows down body functions',
            'Heroin — a stimulant that produces euphoria and increased energy',
            'Cocaine — has no effect on the central nervous system',
          ],
          correct_index: 1,
          explanation: "Heroin is a depressant and slows down body functions. Cocaine is the opposite — a potent CNS stimulant producing euphoria and increased energy — so the first option swaps the two and the third mislabels heroin. Cocaine certainly acts on the CNS (interfering with dopamine transport), so the last option is wrong.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Marijuana, hashish, charas and ganja are all preparations of cannabinoids. Where are the cannabinoid receptors they act on principally located, and which body system do they chiefly affect?',
          options: [
            'Receptors in the gastrointestinal tract; they chiefly affect digestion',
            'Receptors in the kidneys; they chiefly affect urine formation',
            'Receptors principally in the brain; they chiefly affect the cardiovascular system',
            'Receptors in the skeletal muscles; they chiefly affect muscle strength',
          ],
          correct_index: 2,
          explanation: "Cannabinoids interact with cannabinoid receptors present principally in the brain, and are known for their effects on the cardiovascular system. The gastrointestinal-tract receptors belong to opioids like heroin, not cannabinoids, and NCERT links cannabinoids to the heart and blood vessels rather than to the kidneys or skeletal muscle.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'A regular drug user stops abruptly and develops anxiety, shakiness, nausea and sweating that ease only when the drug is taken again. Which term best describes this, and how does it differ from addiction?',
          options: [
            'Withdrawal syndrome, a sign of dependence — the body’s reaction to stopping the drug, whereas addiction is the psychological attachment to its effects',
            'Addiction — the psychological attachment to the drug, whereas dependence only means the drug is prescribed by a doctor',
            'Tolerance — the drug simply stops working, whereas addiction means the receptors have been destroyed',
            'Hallucination, a sign of overdose — whereas addiction means the user has stopped feeling any euphoria',
          ],
          correct_index: 0,
          explanation: "Anxiety, shakiness, nausea and sweating on abruptly stopping a drug are the withdrawal syndrome, which is the mark of dependence (the body's physical reaction). Addiction is the separate, psychological attachment to the drug's euphoric effects. Tolerance is the rise in dose needed for the same effect, and hallucinations are an effect of excess cocaine — neither describes this withdrawal picture.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
