'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'medical-termination-of-pregnancy',
  title: 'Medical Termination of Pregnancy (MTP)',
  subtitle: 'What MTP means, why India chose to legalise it in 1971, why the first trimester is the safer window, and why the law watches it so closely.',
  page_number: 4,
  page_type: 'lesson',
  tags: ['mtp', 'induced-abortion', 'reproductive-health', 'first-trimester', 'female-foeticide'],
  glossary: [
    { term: 'MTP (Medical Termination of Pregnancy)', definition: 'The intentional or voluntary ending of a pregnancy before it reaches full term. It is a medical procedure, also known as induced abortion.' },
    { term: 'induced abortion', definition: 'Another name for MTP — a pregnancy deliberately brought to an end, as opposed to a natural miscarriage.' },
    { term: 'first trimester', definition: 'The first three months of pregnancy, up to about 12 weeks. MTP is considered relatively safe within this window.' },
    { term: 'amniocentesis', definition: 'A test done on the fluid around the developing foetus. It is meant to detect genetic disorders, but is banned by law for finding out the sex of the unborn child.' },
    { term: 'female foeticide', definition: 'The illegal practice of aborting a foetus only because it is found to be female. India has a statutory ban on sex-determination to check this.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A quiet, softly lit hospital counselling room at dusk, an empty chair beside a clinician\'s desk, warm amber light through a window',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A calm, dignified hospital counselling room at dusk — a clean clinician's desk with a folded stethoscope and a small potted plant, an empty patient chair drawn up beside it, a window on one side letting in soft amber evening light. The mood is quiet, respectful and reassuring, nothing clinical or cold, nobody in the frame. Painterly, atmospheric illustration style, dark naturalistic background throughout (#0a0a0a base tones), warm low light, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'A Very Common, Very Regulated Procedure',
      markdown: "Around the world, roughly **45 to 50 million** pregnancies are deliberately ended every year — that works out to about **one in every five** pregnancies conceived in a year. Because the decision carries so many emotional, ethical, religious and social questions, different countries handle it very differently. India chose to make it **legal, but only under strict conditions** — and this page is about why those conditions matter.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "When a pregnancy is **intentionally or voluntarily ended before full term**, that is called **medical termination of pregnancy (MTP)**, or **induced abortion**. The word *induced* is the key — this is a pregnancy brought to an end on purpose through a medical procedure, not a natural miscarriage.\n\nWhether MTP should be accepted or legalised at all is still **debated in many countries**, because it touches on **emotional, ethical, religious and social** issues. There is no single easy answer, and NCERT is careful to present it as a genuine debate rather than a settled question.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Why India Legalised It — and Why "With Conditions"',
      objective: "By the end of this you can say the year India legalised MTP, the reasons a woman may need one, and why the law attaches strict conditions instead of leaving it open.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The **Government of India legalised MTP in 1971**, but not as a free-for-all — it came **with some strict conditions**. Those conditions exist for one clear purpose: **to avoid its misuse**. As you'll see at the end of the page, that guardrail is exactly what keeps MTP from being turned into a tool for something far worse.\n\nSo why would a woman need an MTP in the first place? NCERT gives two honest reasons:\n\n- **To get rid of unwanted pregnancies** — for example, those resulting from casual unprotected intercourse, from the **failure of a contraceptive** used during coitus, or from **rape**.\n- **On medical grounds**, in certain cases where **continuing the pregnancy could be harmful, or even fatal, to the mother or to the foetus, or to both**.\n\nNotice that both reasons are about protecting the woman — from a pregnancy she never chose, or from a pregnancy that could kill her.",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'The Safety Window: The First Trimester',
      objective: "By the end of this you can state up to how many weeks MTP is considered relatively safe, why later abortions are riskier, and why an unqualified provider makes it dangerous.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Timing changes everything. MTPs are considered **relatively safe during the first trimester** — that is, **up to 12 weeks** of pregnancy. Once the pregnancy moves into the **second trimester**, the abortion becomes **much riskier**.\n\nThe reason is straightforward: in the early weeks the foetus is still very small and the procedure is simpler, so there is less to go wrong for the mother. As the pregnancy grows, the tissues and blood supply grow with it, and ending it later becomes a bigger, more dangerous operation.\n\nThere is a second danger that has nothing to do with timing. A worrying number of MTPs are performed **illegally, by unqualified quacks**. These back-alley procedures are **not only unsafe but can be fatal**. This is a large part of why the law insists MTP be done properly — safe, legal, and by qualified hands — rather than in secret.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
      prompt: "Two women require an MTP. One is at 8 weeks of pregnancy; the other is at 20 weeks. Both go to a qualified clinic. Based on what NCERT says, why is the 8-week procedure regarded as the relatively safer one?",
      options: [
        "Because a first-trimester pregnancy is not yet a real pregnancy, so nothing needs to be removed",
        "Because MTP is only legal in the first trimester and completely banned after that",
        "Because in the first trimester (up to 12 weeks) the pregnancy is still early and the procedure is simpler, whereas second-trimester abortions are much riskier",
        "Because the second trimester woman is certain to have a fatal reaction to the procedure",
      ],
      correct_index: 2,
      reveal: "NCERT states that MTPs are relatively safe during the first trimester — up to 12 weeks — and that second-trimester abortions are much riskier. The 8-week case falls inside that safer early window; the 20-week case is in the second trimester, when the pregnancy is more developed and the procedure carries more risk. The other options overstate the biology: an early pregnancy is still a genuine pregnancy, MTP is not banned outright after 12 weeks (it simply becomes riskier and needs more care), and 'certain to have a fatal reaction' turns a raised risk into a false guarantee.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'The Misuse the Law Is Guarding Against',
      objective: "By the end of this you can explain how amniocentesis gets misused, what female foeticide is, and why India places a statutory ban on sex-determination.",
    },
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "Here is where those 1971 conditions earn their place. One especially dangerous trend is the **misuse of amniocentesis** — a test that examines the fluid around the foetus. It was designed to detect genetic disorders, but it also reveals the **sex of the unborn child**. When the foetus is found to be **female**, it is sometimes followed by an MTP purely for that reason. This is **female foeticide**, and it is **totally against what is legal**.\n\nThat is exactly why India has a **statutory ban on amniocentesis for sex-determination** — a legal check on the rising menace of female foeticides, which have been reported to be high in India. Such practices are **dangerous for both the young mother and the foetus** and must be avoided.\n\nNCERT's suggested way forward is not only law but education: **effective counselling** on avoiding unprotected coitus and on the real risks of illegal abortions, together with **more health-care facilities**, could reverse this unhealthy trend. On the next page we move from managing unwanted pregnancy to the infections that spread through sexual contact.",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'Lock These In',
      markdown: "- **MTP = induced abortion** — the intentional, voluntary ending of a pregnancy **before full term**.\n- India **legalised MTP in 1971**, but **with strict conditions to avoid misuse**.\n- Reasons: **unwanted pregnancy** (contraceptive failure, rape, casual intercourse) and **medical grounds** (danger to mother, foetus, or both).\n- **Relatively safe up to 12 weeks (first trimester)**; **second-trimester abortions are much riskier**.\n- Misuse of **amniocentesis** for sex-determination → **female foeticide**, which is illegal; India has a **statutory ban** on sex-determination.",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**The year:** NEET repeatedly checks that **MTP was legalised in India in 1971**. Memorise the year.\n\n**The safe window:** **First trimester — up to 12 weeks** is the relatively safe period; **second trimester is riskier**. The number 12 weeks is the exact figure they test.\n\n**MTP = induced abortion:** These two terms mean the same thing. Watch for options that try to equate MTP with a natural miscarriage — that is wrong.\n\n**Amniocentesis:** Its legitimate use is detecting **genetic disorders**; its **illegal** use is **sex-determination**, which is **statutorily banned**. NEET loves the amniocentesis-and-female-foeticide link.\n\n**Classic NEET question:** \"MTPs are considered relatively safe up to which stage of pregnancy?\" → **the first trimester, i.e., up to 12 weeks.**",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Medical termination of pregnancy (MTP) is best defined as:',
          options: [
            'The natural loss of a pregnancy without any medical intervention',
            'A permanent surgical method of contraception in women',
            'The intentional or voluntary termination of pregnancy before full term',
            'The removal of the uterus to prevent future pregnancy',
          ],
          correct_index: 2,
          explanation: "NCERT defines MTP as the intentional or voluntary termination of pregnancy before full term — that is, induced abortion. A natural loss without intervention is a miscarriage, not MTP; a permanent surgical contraceptive is sterilisation (tubectomy); and removal of the uterus is a different operation altogether.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'In which year did the Government of India legalise MTP?',
          options: [
            '1971',
            '1951',
            '1985',
            '2001',
          ],
          correct_index: 0,
          explanation: "The Government of India legalised MTP in 1971, and it did so with strict conditions to prevent misuse. The other years are close-looking distractors with no basis in the NCERT text — only 1971 is correct.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Why does NCERT describe first-trimester MTPs as relatively safe compared with later ones?',
          options: [
            'Because the law forbids MTP after 12 weeks under all circumstances',
            'Because second-trimester procedures cannot be done in a hospital',
            'Because the foetus feels no pain only in the first trimester',
            'Because MTP is relatively safe up to 12 weeks, while second-trimester abortions are much riskier',
          ],
          correct_index: 3,
          explanation: "NCERT states that MTPs are relatively safe during the first trimester (up to 12 weeks), whereas second-trimester abortions are much riskier — the earlier, simpler procedure carries less danger for the mother. MTP is not banned outright after 12 weeks, second-trimester procedures are still done in hospitals, and the 'pain' claim is not something NCERT says at all.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'The misuse of amniocentesis that Indian law specifically bans is:',
          options: [
            'Using it to detect inherited genetic disorders in the foetus',
            'Using it to determine the sex of the foetus, which can lead to female foeticide',
            'Using it to check the mother\'s blood pressure during pregnancy',
            'Using it as a routine method of contraception',
          ],
          correct_index: 1,
          explanation: "Amniocentesis is legitimately used to detect genetic disorders, but its misuse — determining the sex of the unborn child, often followed by aborting female foetuses — is illegal, and India has a statutory ban on sex-determination to check female foeticide. Detecting genetic disorders is its allowed purpose, it is not a blood-pressure test, and it has nothing to do with contraception.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
