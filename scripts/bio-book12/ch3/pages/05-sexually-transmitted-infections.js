'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'sexually-transmitted-infections',
  title: 'Sexually Transmitted Infections (STIs)',
  subtitle: "Infections that spread through sexual contact — what NCERT lists, which ones a doctor can fully cure, which three stay for life, and the three simple rules that keep you free of all of them.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['sexually-transmitted-infections', 'sti', 'reproductive-health', 'std'],
  glossary: [
    { term: 'STI', definition: 'Sexually transmitted infection — any infection or disease that spreads through sexual intercourse. NCERT also calls these venereal diseases (VD) or reproductive tract infections (RTI).' },
    { term: 'venereal disease (VD)', definition: 'An older collective name for the same group of infections that spread through sexual contact.' },
    { term: 'gonorrhoea', definition: 'One of the common STIs named by NCERT. It is completely curable if detected early and treated properly.' },
    { term: 'syphilis', definition: 'One of the common STIs named by NCERT. It is completely curable if detected early and treated properly.' },
    { term: 'chlamydiasis', definition: 'One of the common STIs named by NCERT. It is completely curable if detected early and treated properly.' },
    { term: 'asymptomatic', definition: 'Showing no symptoms. Infected females are often asymptomatic, so an STI can stay undetected in them for a long time.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A calm dusk view of a small-town health clinic with a warmly lit window, a protective shield motif glowing softly at the entrance',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet, dignified dusk scene of a small-town health clinic: a modest single-storey building on the right with one warmly glowing window and an open doorway spilling soft light onto the path. Toward the centre-left, a faint translucent shield or barrier motif hovers over the path, catching the last warm light — a gentle symbol of protection and prevention, not a medical logo. A softly lit horizon glow ties the scene together, hopeful and reassuring rather than clinical or frightening. Painterly illustration style, atmospheric, respectful and calm, dark background overall (#0a0a0a base tones), no people shown in detail, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Age Group Most at Risk Is Yours',
      markdown: "Everyone is vulnerable to these infections, but NCERT points out one uncomfortable fact: the reported cases are **very high among people aged 15–24 years** — the exact age group you belong to. That's not a reason to panic. It's the opposite. **Prevention is possible**, and it comes down to a handful of simple rules. Read this page as practical safety, the same way you'd read the rules for handling electricity or crossing a busy road.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Infections or diseases that are **transmitted through sexual intercourse** are collectively called **sexually transmitted infections (STIs)**. NCERT gives them two other names you should recognise on an exam: **venereal diseases (VD)** and **reproductive tract infections (RTI)** — three names, one group.\n\nMost of these spread through sexual contact, but two of them have extra routes. **Hepatitis-B and HIV can also spread** by sharing **injection needles or surgical instruments** with an infected person, by **transfusion of blood**, and from an **infected mother to her foetus**. So for those two, the danger isn't limited to sexual contact — that detail is a favourite of examiners.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The STIs NCERT Names',
      objective: "By the end of this you can list the STIs NCERT gives — and split them into the ones a doctor can fully cure and the three that cannot be fully cured.",
    },
    {
      id: uuid(), type: 'table', order: 4,
      caption: '📸 The common STIs listed in NCERT. Note the three in the lower rows — they are the exceptions that are NOT completely curable.',
      headers: ['Infection', 'Notable point (per NCERT)'],
      rows: [
        ['Gonorrhoea', 'Completely curable if detected early and treated properly.'],
        ['Syphilis', 'Completely curable if detected early and treated properly.'],
        ['Chlamydiasis', 'Completely curable if detected early and treated properly.'],
        ['Genital warts', 'Completely curable if detected early and treated properly.'],
        ['Trichomoniasis', 'Completely curable if detected early and treated properly.'],
        ['Genital herpes', 'One of the three exceptions — NOT completely curable.'],
        ['Hepatitis-B', 'NOT completely curable. Also spreads via shared needles/surgical instruments, blood transfusion, and infected mother to foetus.'],
        ['HIV (leading to AIDS)', 'The most dangerous STI; NOT completely curable. Also spreads via needles, blood, and mother to foetus. Discussed in detail in Chapter 7.'],
      ],
    },
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "Here is what makes STIs quietly dangerous: the **early symptoms are minor** — **itching, fluid discharge, slight pain, and swellings** in the genital region — and they are easy to ignore. Worse, **infected females are often asymptomatic**, showing no symptoms at all, so the infection can **stay undetected in them for a long time**.\n\nThose faint early signs, plus the **social stigma** attached to these infections, stop many people from going for **timely detection and proper treatment**. When treatment is delayed, complications follow: **pelvic inflammatory diseases (PID)**, **abortions**, **still births**, **ectopic pregnancies**, **infertility**, and even **cancer of the reproductive tract**. That chain — minor symptom ignored, stigma, delay, serious complication — is exactly why NCERT calls STIs *a major threat to a healthy society*. The way to break the chain is early detection and cure, which is why these infections are given prime importance in reproductive health-care programmes.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A doctor tells four patients that their STI, caught early and treated properly, will be completely cured. Which of the following infections could that statement NOT be true for?",
      options: [
        "Gonorrhoea, syphilis and chlamydiasis",
        "Genital warts and trichomoniasis",
        "Hepatitis-B, genital herpes and HIV",
        "All STIs are completely curable if caught early",
      ],
      reveal: "NCERT states that *except for* hepatitis-B, genital herpes and HIV, the other STIs are completely curable if detected early and treated properly. So those three are the exceptions the doctor's promise cannot cover. The tempting wrong answer is the last one — 'all STIs are curable if caught early' — because early treatment does cure most of them; but it forgets the three named exceptions. Gonorrhoea, syphilis, chlamydiasis, genital warts and trichomoniasis are all in the curable group.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 7, variant: 'remember', title: 'Prevention — the A-B-C of Staying STI-free',
      markdown: "NCERT gives three simple principles. Fix them with **A-B-C**:\n\n- **A — Avoid.** Avoid sex with **unknown partners or multiple partners**.\n- **B — Barrier.** **Always try to use condoms** during coitus.\n- **C — Check.** **In case of doubt, go to a qualified doctor** for early detection and get complete treatment if an infection is diagnosed.\n\nFollow these and one can be **free of these infections**. Prevention or early detection and cure is the whole point of the reproductive health-care programmes.",
    },
    {
      id: uuid(), type: 'callout', order: 8, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**The three exceptions:** the only STIs that are NOT completely curable are **hepatitis-B, genital herpes and HIV**. Memorise this trio — 'all STIs are curable' is the classic false statement examiners plant.\n\n**Three names, one group:** STI = venereal disease (VD) = reproductive tract infection (RTI).\n\n**Extra transmission routes:** only **hepatitis-B and HIV** (from this list) also spread through shared needles/instruments, blood transfusion, and infected mother to foetus.\n\n**Most at-risk age group:** **15–24 years**.\n\n**Classic NEET question:** \"All sexually transmitted diseases are completely curable — true or false?\" → **False.** Hepatitis-B, genital herpes and HIV are not completely curable.",
    },
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "STIs are one threat to reproductive health that good habits can prevent outright. The next threat is a very different one — not an infection, but the inability to have a child despite trying. That's **infertility**, and the help modern medicine offers for it, which we turn to next.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 10, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Sexually transmitted infections (STIs) are also known by which other names?',
          options: [
            'Pelvic inflammatory diseases and ectopic infections',
            'Autoimmune diseases and allergic disorders',
            'Venereal diseases (VD) and reproductive tract infections (RTI)',
            'Congenital diseases and hereditary infections',
          ],
          correct_index: 2,
          explanation: "NCERT gives STIs two other collective names: venereal diseases (VD) and reproductive tract infections (RTI). Pelvic inflammatory disease is a complication of untreated STIs, not another name for the group, and STIs are transmitted infections, not autoimmune, allergic, or hereditary conditions.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Which of the following STIs is NOT completely curable even when detected early?',
          options: [
            'Gonorrhoea',
            'Chlamydiasis',
            'Trichomoniasis',
            'Genital herpes',
          ],
          correct_index: 3,
          explanation: "NCERT states that except for hepatitis-B, genital herpes and HIV, the other STIs are completely curable if detected early and treated properly. Genital herpes is one of those three exceptions. Gonorrhoea, chlamydiasis and trichomoniasis all belong to the curable group.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Besides sexual intercourse, hepatitis-B and HIV can also be transmitted by which route?',
          options: [
            'Sharing injection needles, blood transfusion, or from an infected mother to the foetus',
            'Breathing the same air as an infected person',
            'Sharing food and drinking water',
            'Casual touching or shaking hands',
          ],
          correct_index: 0,
          explanation: "NCERT notes that hepatitis-B and HIV can also spread by sharing injection needles and surgical instruments, by blood transfusion, and from an infected mother to the foetus. These infections do not spread through shared air, food, water, or casual contact like handshakes — a common misconception.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Why do STIs in females often remain undetected for a long time?',
          options: [
            'Because the symptoms are always severe and obvious from day one',
            'Because infected females are often asymptomatic, showing no early symptoms',
            'Because females cannot transmit STIs to others',
            'Because STIs only ever affect males',
          ],
          correct_index: 1,
          explanation: "NCERT states that infected females may often be asymptomatic and hence may remain undetected for long. Early symptoms of STIs are minor (itching, discharge, slight pain, swellings), not severe — and both males and females can carry and transmit these infections, so the other options contradict the text.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
