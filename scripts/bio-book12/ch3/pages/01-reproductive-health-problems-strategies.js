'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'what-reproductive-health-means',
  title: 'What Reproductive Health Means',
  subtitle: "Reproductive health is more than working organs — it is total well-being in reproduction, and this page walks through what that means and the exact strategies India uses to build a reproductively healthy society.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['reproductive-health', 'rch-programmes', 'family-planning', 'amniocentesis', 'sex-education'],
  glossary: [
    { term: 'reproductive health', definition: 'According to the WHO, a total well-being in all aspects of reproduction — physical, emotional, behavioural and social — not just healthy reproductive organs with normal functions.' },
    { term: 'RCH programmes', definition: "Reproductive and Child Health Care programmes — the improved, wider version of India's national family-planning effort, currently in operation to build a reproductively healthy society." },
    { term: 'family planning', definition: 'The name of the national-level action plans India first initiated in 1951 to attain total reproductive health as a social goal; later broadened into the RCH programmes.' },
    { term: 'sex education', definition: 'Teaching in schools that gives the young correct information about reproduction so as to discourage them from believing myths and having misconceptions about sex-related aspects.' },
    { term: 'amniocentesis', definition: 'A procedure in which some amniotic fluid of the developing foetus is taken to analyse the foetal cells and dissolved substances, used to test for certain genetic disorders and to determine the survivability of the foetus.' },
    { term: 'female foeticide', definition: 'The killing of a female foetus, usually after its sex is illegally determined — the menace that the statutory ban on amniocentesis for sex-determination is meant to check.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A warm, atmospheric banner of an Indian family — parents with two children — standing together in soft dawn light, suggesting a healthy family of desired size',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet, dignified atmospheric painterly illustration of a young Indian family — two parents standing with two small children — silhouetted in soft warm dawn light against a near-black background (#0a0a0a base tones). Muted amber and deep blue lighting, respectful and hopeful in tone, evoking well-being, care and a healthy society. No text, no labels, no diagram lines, no clinical or medical detail — only mood: warmth, togetherness and the sense of a cared-for community.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'India Went First',
      markdown: "Here is something most students never notice in this chapter. **India was among the very first countries in the world** to launch action plans and programmes at a **national level** to attain total reproductive health as a social goal. These programmes — called **‘family planning’** — were started way back in **1951**, and have been reviewed and improved decade after decade. Today they run under the name **Reproductive and Child Health Care (RCH) programmes**. So this is not just a health topic — it is a piece of Indian public-health history NEET expects you to know.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Ask most people what **reproductive health** means and they will say *healthy reproductive organs that work normally*. That is true — but it is only half the picture. According to the **World Health Organisation (WHO)**, reproductive health means a **total well-being in all aspects of reproduction**, and there are **four** of those aspects: **physical, emotional, behavioural and social**.\n\nRead that carefully, because NEET tests these four words directly. A society is called **reproductively healthy** only when its people have **physically and functionally normal reproductive organs** *and* **normal emotional and behavioural interactions** among them in all sex-related aspects. So the definition reaches past the body into how people feel, how they behave, and how they relate to one another. The natural next question is: how does a country actually build this? That is where India's strategies come in.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Strategies for a Reproductively Healthy Society',
      objective: "By the end of this you can list the concrete steps India takes — awareness and sex education, care for mothers and children, removing myths, medical facilities, and the amniocentesis ban — and say what each one is for.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The two major tasks under the RCH programmes are simple to state: **create awareness** among people about reproduction-related matters, and **provide the facilities and support** to build a reproductively healthy society. Here is how each is done.\n\n**Awareness** is spread using **audio-visual and print media** by both **governmental and non-governmental agencies**. But officials are not the only teachers — **parents, close relatives, teachers and friends** all have a major role in passing on the right information.\n\n**Sex education in schools** should be encouraged. Giving the young correct information about **reproductive organs, adolescence and related changes, safe and hygienic sexual practices, STDs and AIDS** discourages children from believing **myths and misconceptions** about sex. Older groups matter too: **fertile couples and those of marriageable age** are taught about **birth control options, care of pregnant mothers, post-natal care of mother and child, the importance of breast feeding, and equal opportunities for the male and female child** — all aimed at raising **socially conscious healthy families of a desired size**.\n\nAwareness alone is not enough. Successful programmes need **strong infrastructure, professional expertise and material support** to give **medical assistance** for pregnancy, delivery, STDs, abortions, contraception, menstrual problems and infertility. Two specific measures NCERT names are the **statutory ban on amniocentesis for sex-determination** (to check the menace of **female foeticide**) and **massive child immunisation**. And **research** is funded by government and non-government agencies to find better methods — for example, **‘Saheli’, an oral contraceptive for females, was developed by scientists at the CDRI (Central Drug Research Institute) in Lucknow, India.**",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A concept map with a central node reading Reproductive Health branching out to five strategy nodes: awareness and sex education, care for mothers and children, removing myths, medical facilities and research, and the amniocentesis ban',
      caption: '📸 Tap each dot to explore the five strategies India uses to build a reproductively healthy society',
      generation_prompt: "Scientific textbook illustration of a concept map titled 'Strategies for Reproductive Health'. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A central rounded node reading nothing (leave label areas blank / no baked-in text) with clean white outlines, connected by thin white leader lines to five surrounding nodes arranged evenly around it. Each surrounding node is a simple rounded box with a small icon suggesting: (1) a megaphone / open book for awareness and sex education, (2) a mother-and-child figure for care of mothers and children, (3) a crossed-out myth / lightbulb for removing myths and misconceptions, (4) a medical cross / hospital for medical facilities and research, (5) a shield over an ultrasound-symbol for the statutory ban on amniocentesis for sex-determination. Muted functional colours (green, blue, pink, amber accents) on the dark ground, no photorealism, no cartoon mascots, respectful medical-textbook convention, no text labels baked into the image.",
      hotspots: [
        { id: uuid(), x: 0.50, y: 0.50, label: 'Reproductive health', icon: 'circle',
          detail: 'The goal at the centre: **total well-being in reproduction** — physical, emotional, behavioural and social. Every strategy around it exists to reach this.' },
        { id: uuid(), x: 0.50, y: 0.14, label: 'Awareness & sex education', icon: 'circle',
          detail: 'Spread through **audio-visual and print media** by government and non-government agencies, plus parents, teachers and friends. **Sex education in schools** gives the young correct information about reproduction.' },
        { id: uuid(), x: 0.85, y: 0.42, label: 'Care for mothers & children', icon: 'circle',
          detail: 'Teaching couples about **care of pregnant mothers, post-natal care, breast feeding**, and **equal opportunities for the male and female child** — building healthy families of a desired size.' },
        { id: uuid(), x: 0.72, y: 0.86, label: 'Removing myths', icon: 'circle',
          detail: 'Giving the right information **discourages children from believing myths and misconceptions** about sex-related aspects — a direct aim of school sex education.' },
        { id: uuid(), x: 0.28, y: 0.86, label: 'Medical facilities & research', icon: 'circle',
          detail: 'Strong **infrastructure, expertise and support** for pregnancy, delivery, STDs, contraception and infertility — plus research that gave us **Saheli**, developed at **CDRI, Lucknow**.' },
        { id: uuid(), x: 0.15, y: 0.42, label: 'Amniocentesis ban', icon: 'circle',
          detail: 'A **statutory ban on amniocentesis for sex-determination**, meant to legally check the increasing menace of **female foeticide**. Also alongside it: **massive child immunisation**.' },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "Amniocentesis is a genuinely useful medical test — it reads foetal cells for genetic disorders like Down syndrome, haemophilia and sickle-cell anaemia. So why has the government put a statutory ban on it *for sex-determination*?",
      options: [
        "Because the test was being misused to find out the sex of the foetus, and female foetuses were then being aborted — the ban checks female foeticide",
        "Because amniocentesis itself always kills the foetus and is unsafe",
        "Because the test cannot actually detect any genetic disorder reliably",
        "Because only private clinics, not government hospitals, are allowed to perform it",
      ],
      reveal: "The ban is **not** on amniocentesis as a whole — the test stays legal for detecting genetic disorders and checking the survivability of the foetus. What is banned is using it **for sex-determination**, because that use was being abused: once the foetus was found to be female it was often aborted. NCERT says the ban exists to **legally check the increasing menace of female foeticide**. The tempting trap is 'the test is unsafe/useless' — but the problem was never the test's safety or accuracy, it was the social misuse of one of its results.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 7, variant: 'remember', title: 'Lock These Down',
      markdown: "- **WHO definition:** reproductive health = **total well-being in all aspects of reproduction** — **physical, emotional, behavioural and social** (the four words).\n- **India was among the first countries** to launch national reproductive-health programmes; **‘family planning’ began in 1951**, now run as the **RCH (Reproductive and Child Health Care) programmes**.\n- **Two major tasks:** create **awareness**, and **provide facilities/support**.\n- **Sex education in schools** → discourages **myths and misconceptions**.\n- **Statutory ban on amniocentesis for sex-determination** → to check **female foeticide**.\n- **Saheli** (oral contraceptive) was developed at **CDRI, Lucknow**.\n- **Signs of improved reproductive health:** decreased **maternal and infant mortality rates**, more small families, better detection/cure of STDs, more medical facilities.",
    },
    {
      id: uuid(), type: 'callout', order: 8, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**The four aspects:** physical, emotional, **behavioural** and social. NEET drops one (often ‘behavioural’) and expects you to catch that the set is incomplete.\n\n**First programme + year:** **‘family planning’, 1951**, now the **RCH programmes**. The year 1951 is a favourite fill-in-the-blank.\n\n**Amniocentesis:** its *legitimate* use is detecting **genetic disorders (Down syndrome, haemophilia, sickle-cell anaemia)** and foetal survivability; the *banned* use is **sex-determination** → to stop **female foeticide**. Don't confuse the two.\n\n**Saheli → CDRI, Lucknow.** Both the drug and the institute get asked.\n\n**Classic NEET question:** \"Amniocentesis for sex-determination is banned in our country. Why?\" → **because it was being misused to determine the sex of the foetus, leading to female foeticide; the ban legally checks that menace.**",
    },
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "So reproductive health is total well-being in reproduction, and India works towards it through awareness, sex education, care for mothers and children, medical facilities, research, and firm laws like the amniocentesis ban. But even the best health programmes ran into a side-effect no one fully planned for: better health and longer lives caused the population to grow explosively. On the next page we look at that population explosion and the birth-control methods used to slow it.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 10, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'According to the WHO, reproductive health means total well-being in which set of aspects?',
          options: [
            'Physical, emotional, behavioural and social',
            'Physical, mental, financial and legal',
            'Physical and social well-being only',
            'Emotional, behavioural, spiritual and economic',
          ],
          correct_index: 0,
          explanation: "The WHO definition names exactly four aspects — physical, emotional, behavioural and social. Options that drop ‘behavioural’ or slip in words like ‘financial’, ‘spiritual’ or ‘legal’ are the traps; NCERT is specific that reproductive health is more than just physical or social well-being.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: "What was the popular name of the national programmes India first initiated in 1951, and what are they called now?",
          options: [
            "‘Population control’ then, ‘Family Welfare Scheme’ now",
            "‘Family planning’ then, ‘Reproductive and Child Health Care (RCH) programmes’ now",
            "‘RCH programmes’ then, ‘family planning’ now",
            "‘Child immunisation drive’ then, ‘Saheli programme’ now",
          ],
          correct_index: 1,
          explanation: "The programmes began in 1951 as ‘family planning’ and are today run as the Reproductive and Child Health Care (RCH) programmes. The reversed option is the classic trap — RCH is the modern, wider version, so family planning came first, not the other way round.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Why has the government placed a statutory ban on amniocentesis for sex-determination?',
          options: [
            'Because amniocentesis cannot detect genetic disorders accurately',
            'Because the procedure is illegal in all its uses',
            'Because it was being misused to determine foetal sex, leading to female foeticide',
            'Because it can only be done after 24 weeks of pregnancy',
          ],
          correct_index: 2,
          explanation: "Amniocentesis stays legal for detecting genetic disorders and foetal survivability; only its use for sex-determination is banned, to legally check the increasing menace of female foeticide. The distractor ‘it cannot detect disorders’ is wrong — that is exactly its valid purpose (Down syndrome, haemophilia, sickle-cell anaemia).",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: "‘Saheli’, an oral contraceptive for females, was developed by scientists at which institute?",
          options: [
            'The World Health Organisation (WHO)',
            'The All India Institute of Medical Sciences (AIIMS)',
            'The Indian Council of Medical Research, Delhi',
            'The Central Drug Research Institute (CDRI), Lucknow',
          ],
          correct_index: 3,
          explanation: "NCERT credits Saheli to scientists at the Central Drug Research Institute (CDRI) in Lucknow, India — an example of the research supported under reproductive-health programmes. The WHO gives the definition of reproductive health but did not develop Saheli, which is the tempting mix-up.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
