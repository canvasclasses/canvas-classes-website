'use strict';
/**
 * Ch.11 pages 12-14: reproductive-health-and-hygiene, birth-control-methods,
 * assisted-reproductive-technologies.
 * Source: §11.5.7/§11.5.8/§11.5.9 + menstrual-hygiene & ASHA boxes (p221-223),
 * §11.5.10 + Copper-T Fig 11.23 (p223-224), IVF "Meet a Scientist" (p220).
 * Run: node scripts/science-ch11/build_p12_14.js [--dry]
 */
const { img, txt, h, h3, cur, callout, cmp, table, reason, q, quiz, applyPages } = require('./_lib');

// ── PAGE 12 — Reproductive Health and Hygiene ─────────────────────────────────
const p12 = {
  slug: 'reproductive-health-and-hygiene',
  subtitle: 'Growing up, growing a baby, and the everyday care that keeps the body healthy',
  blocks: [
    cur(
      'A 14-year-old\'s body may already be able to make a baby. Yet every doctor, teacher, and parent would say a 14-year-old is nowhere near ready to be a parent. So the body can be "ready" long before the person is. How can someone be physically grown up and yet not grown up at all?',
      'There is more than one kind of "growing up".',
      'Becoming an adult is not a single switch that flips. The body and the mind grow up on very different timetables — and understanding that gap is the start of reproductive health.'
    ),
    img(
      'A gentle montage of growing up and good health: a teenager, a pregnant mother at a check-up, a newborn being cared for, and clean menstrual hygiene items',
      'Wide 16:5 banner, dark background. A respectful, warm montage: on the left a teenager looking thoughtful; in the middle a pregnant woman smiling at a doctor\'s check-up; on the right a newborn wrapped warmly in a parent\'s arms, with a small clear inset showing clean menstrual-hygiene items (a fresh pad and a menstrual cup). Calm, caring, educational style, soft colours. No extra text.'
    ),
    callout('fun_fact', 'Nine Months, Three Acts',
`A human pregnancy lasts about **nine months**, and it is divided into three roughly equal stretches called **trimesters**. In the first, the major organs take shape; in the second, the mother begins to feel the baby move; in the third, the baby grows quickly and gets ready for life outside. One single cell becomes a complete baby in those three acts.`),
    h('Sexual Maturity: Body Ready, Mind Still Growing', 'See why physical maturity and emotional maturity are not the same thing.'),
    txt(
`During adolescence, the body slowly becomes capable of reproduction — sperm production begins in boys, and the menstrual cycle begins in girls. This is **sexual maturity**, and it happens gradually.

But becoming **emotionally mature** takes much longer. It means learning to handle strong feelings, to communicate clearly, and to make thoughtful, responsible decisions. A body can be ready for reproduction long before a person is ready for the responsibilities that come with it.`),
    h('Pregnancy and Childbirth'),
    txt(
`If an egg is fertilised and implants, **pregnancy** begins. Over about nine months, the zygote grows into an embryo, then a **foetus**, passing through three trimesters. At **childbirth**, strong muscular contractions of the uterus push the baby out through the birth canal. Sometimes, if a normal birth would not be safe for the mother or baby, doctors use medical or surgical help to deliver the baby safely.`),
    { type: 'timeline', orientation: 'horizontal', title: 'The three trimesters of pregnancy', events: [
      { id: 't1', label: '1st trimester', detail: 'The main organs of the body form' },
      { id: 't2', label: '2nd trimester', detail: 'The baby grows; the mother feels it move' },
      { id: 't3', label: '3rd trimester', detail: 'Rapid growth; the baby gets ready for birth' },
    ] },
    h('Caring for Mother and Baby'),
    txt(
`A mother\'s health shapes her baby\'s health. During pregnancy she needs a **balanced diet** rich in proteins, vitamins, and minerals, **regular check-ups**, enough **rest**, and she should avoid harmful things like smoking, alcohol, and any medicine not advised by a doctor. Her emotional well-being matters too, and family support helps.

After birth, **breastfeeding** gives the baby complete nutrition and protects it from many diseases. Newborns are kept warm, vaccinated on time, and handled gently. Some mothers feel low or anxious after delivery — a real, recognised condition that can be treated — so they should be encouraged to talk to a doctor, nurse, or ASHA worker for support.`),
    h('Hygiene During Menstruation'),
    txt(
`Good hygiene during a period keeps the body healthy and comfortable. Use clean menstrual products (pads, cups, or tampons — biodegradable where possible) and **change them regularly**, about every 4 to 6 hours, or more often if the flow is heavy. Wash the genital area with **water** (soap can upset the natural balance), and always **wash your hands** before and after changing. Wrap and bin used products properly — do not flush them — and make sure reusable pads are fully dry before using them again. A period is a sign of health, never something to feel ashamed of.`),
    reason('logical',
      'Doctors advise changing a sanitary pad every 4 to 6 hours during a period, even when it is not completely full. Why is changing regularly important, rather than simply waiting until a pad is full?',
      [
        'Because a fresh pad changes the colour of the flow',
        'Because wearing one for too long lets germs build up and can cause infection',
        'Because pads stop working completely after exactly four hours',
        'Because changing often makes the period end sooner',
      ], 1,
      'A used pad worn for many hours stays warm and damp — perfect conditions for germs to multiply, which can lead to irritation or infection. Changing regularly keeps the area clean and healthy. It is about hygiene, not about how full the pad is or how long the period lasts.',
      2),
    callout('india_science', 'A Million Health Heroes',
`Across India, more than **10 lakh** women work as **ASHA** (Accredited Social Health Activist) workers under the **National Health Mission**. Trained in their own communities, they promote hygiene, immunisation, and family planning, and give advice on maternal care, safe deliveries, and contraception — bringing reliable health support to rural areas far from big hospitals.`),
    quiz([
      q('A human pregnancy is divided into three stages, each called a —',
        ['trimester', 'cycle', 'zygote', 'ovulation'], 0,
        'The three stages of pregnancy are the trimesters, each about three months long. A zygote is the very first cell, ovulation is the release of an egg, and a cycle refers to the monthly menstrual rhythm — none of those name the stages of pregnancy.',
        1),
      q('A pregnant woman is told to avoid smoking, alcohol, and medicines not prescribed by a doctor. The main reason is that these can —',
        [
          'make the pregnancy finish a little faster',
          'harm the growing baby inside her',
          'stop her from feeling the baby move',
          'change whether the baby is a boy or a girl',
        ], 1,
        'Harmful substances can pass to the developing baby and damage its growth, which is why they are avoided during pregnancy. They do not control the length of pregnancy, the feeling of movement, or the baby\'s sex.',
        2),
      q('A teenager\'s body may already be capable of reproduction, yet doctors say a teenager is still not ready to be a parent. The best reason is that —',
        [
          'a teenager\'s body is not really mature enough yet',
          'teenagers are unable to produce healthy gametes at all',
          'emotional and social maturity take much longer than physical maturity',
          'becoming a parent needs no real maturity anyway',
        ], 2,
        'Physical maturity arrives during adolescence, but the emotional and social maturity needed to raise a child — handling feelings, making careful decisions — develops much later. That gap is exactly why being physically able is not the same as being ready.',
        3),
    ]),
  ],
};

// ── PAGE 13 — Birth Control Methods ───────────────────────────────────────────
const p13 = {
  slug: 'birth-control-methods',
  subtitle: 'One simple method does two very different jobs — and missing that fact has cost lives',
  blocks: [
    cur(
      'Some methods of family planning stop a pregnancy. Some protect against serious infections that pass between people. But there is one simple, cheap method that does both at once — and not knowing this single fact has cost many people their health. Which method pulls double duty, and why can the others not?',
      'Think about what physically gets in the way of both a sperm and a germ.',
      'Making responsible choices is a big part of growing up. Let us look at how unwanted pregnancies and infections can both be prevented.'
    ),
    img(
      'A clear, respectful diagram of an Intra-Uterine Device (Copper-T) placed in the uterus, alongside simple icons for barrier, pill, and surgical methods',
      'Wide 16:5 banner, dark background. Left: a clean clinical diagram of a Copper-T (Intra-Uterine Device) shown placed inside the uterus, with a neat label. Right: four simple, tasteful icons representing the main family-planning methods — a barrier method, a pill packet, an IUD, and a surgical method — arranged in a row. Educational medical style, soft muted colours. No extra text.'
    ),
    callout('fun_fact', 'Prevention Beats Cure Here',
`Some infections spread through close physical contact between people — these are called **sexually transmitted infections (STIs)**, and they include HIV, which can lead to AIDS. A few of these still have **no cure** at all. That is why, for this group of diseases, *preventing* them matters far more than hoping to treat them later.`),
    h('Being Ready Means Being Responsible', 'Understand why responsible choices protect both health and the future.'),
    txt(
`During adolescence the body becomes capable of reproduction, but emotional and social maturity take longer to develop. Making thoughtful, responsible choices helps prevent **unplanned pregnancies** and **sexually transmitted infections**, and supports healthy relationships. This is what being "ready" really means.`),
    h('Sexually Transmitted Infections (STIs)'),
    txt(
`Because some infections spread through close physical contact, they pass from an infected person to a healthy one. These **STIs** include gonorrhoea, herpes, syphilis, genital warts, and HIV (which can eventually lead to AIDS). Some of them cannot yet be cured. Using **condoms** can prevent these infections from spreading — and prevent pregnancy at the same time.`),
    h('Ways to Prevent Pregnancy'),
    txt(
`There are several **contraceptive** (pregnancy-preventing) methods. **Barrier methods** like condoms physically stop sperm from reaching the egg. **Hormonal methods** like oral pills change the body\'s hormones so that an egg is not released — though they can have side effects. **Intra-Uterine Devices (IUDs)** such as the Copper-T are placed in the uterus to prevent pregnancy, but may sometimes cause irritation. **Surgical methods** block the vas deferens in males or the fallopian tubes in females, so that sperm and egg can never meet.`),
    table('Common methods of birth control',
      ['Method', 'How it works', 'Note'],
      [
        ['Condom (barrier)', 'Physically blocks sperm', 'Also prevents STIs'],
        ['Oral pills (hormonal)', 'Change hormones so no egg is released', 'May have side effects'],
        ['Copper-T (IUD)', 'Placed in the uterus to prevent pregnancy', 'May cause irritation'],
        ['Surgical', 'Blocks the tubes so gametes cannot meet', 'A long-term method'],
      ]),
    reason('logical',
      'Some sexually transmitted infections, such as HIV, still have no cure. For a disease that cannot be cured, why do doctors place so much weight on prevention rather than on treatment?',
      [
        'Because preventing it is the only real way to stay safe when there is no cure',
        'Because prevention is far more expensive than treatment',
        'Because the infection cures itself if it is simply ignored',
        'Because treatment always works better than prevention',
      ], 0,
      'If a disease cannot be cured, then once it is caught, treatment cannot remove it. The only dependable protection left is to stop it from being caught in the first place — which is why prevention carries so much weight for incurable infections.',
      3),
    h('Ending a Pregnancy, and a Law That Protects Girls'),
    txt(
`In some cases, an unwanted pregnancy may be ended by surgery — a procedure called **abortion** — generally only within the first trimester, when the embryo is very small. A serious concern is **sex-selective abortion**, where a pregnancy is ended because of the baby\'s expected sex. This practice can badly unbalance the **sex ratio** in society. To stop it, finding out a baby\'s sex before birth (**prenatal sex determination**) is strictly **prohibited by law in India**.`),
    callout('note', 'Every Child Has Equal Worth',
`The law against finding out a baby\'s sex before birth exists for one reason: to stop sex-selective abortion, which has badly reduced the number of girls compared to boys in some parts of India. A healthy society needs both — and every child, girl or boy, has exactly the same worth.`),
    quiz([
      q('Which of the following is a barrier method of birth control?',
        ['Condom', 'Oral pills', 'Copper-T (IUD)', 'Surgical method'], 0,
        'A barrier method physically blocks sperm from reaching the egg, and a condom does exactly that. Pills work through hormones, the Copper-T sits inside the uterus, and surgery blocks the tubes — none of those is a simple physical barrier.',
        1),
      q('Apart from preventing pregnancy, which method also helps prevent sexually transmitted infections?',
        ['Oral contraceptive pills', 'Condoms', 'Copper-T', 'Surgical methods'], 1,
        'Only the condom forms a physical barrier that blocks germs from passing between people, so it prevents infection as well as pregnancy. Pills, IUDs, and surgery prevent pregnancy but do nothing to stop an infection from spreading.',
        2),
      q('A couple uses oral pills, which prevent pregnancy very well, but uses no condoms. Why might they still be at risk?',
        [
          'The pills may suddenly cause a pregnancy instead',
          'The pills make infections spread much faster',
          'Pills prevent pregnancy but do not stop infections from spreading between people',
          'There is actually no risk at all in this situation',
        ], 2,
        'Pills act on hormones to stop an egg being released, so they handle pregnancy — but they put nothing between the two people, so an infection can still pass. Preventing pregnancy and preventing infection are two separate jobs, and pills only do one of them.',
        3),
    ]),
  ],
};

// ── PAGE 14 — Assisted Reproductive Technologies (IVF) ────────────────────────
const p14 = {
  slug: 'assisted-reproductive-technologies',
  subtitle: 'The truth behind the phrase "test tube baby"',
  blocks: [
    cur(
      'You have probably heard the phrase "test tube baby." But here is the twist: no baby has ever actually grown inside a test tube. The name is misleading. So what really happens, and why would a couple ever need a new life to begin outside the body in the first place?',
      'The "outside" part is only the very first step — the start, not the whole journey.',
      'The technology is called IVF, and behind it lies one of India\'s proudest and most surprising scientific stories.'
    ),
    img(
      'A respectful laboratory scene of IVF: an egg and sperm being joined in a glass dish under a microscope, then the early embryo being placed into the uterus',
      'Wide 16:5 banner, dark background. Left: a clean laboratory scene showing a gloved hand and a microscope, with a close inset of a single sperm being brought to an egg inside a small glass dish. Right: a simple diagram of the resulting early embryo being gently placed into a uterus. Calm, clinical, hopeful tone, soft colours. No extra text.'
    ),
    callout('fun_fact', 'India\'s "Durga", Born in 1978',
`India\'s first test tube baby, a girl nicknamed **Durga** (Kanupriya Agarwal), was born in Kolkata in **1978** — astonishingly, just a couple of months after the world\'s very first. The scientist behind it, **Subhash Mukhopadhyay**, did it with simple, almost homemade equipment. Sadly, his work was doubted in his lifetime and honoured only years later.`),
    h('When Nature Needs a Helping Hand', 'Learn what IVF is and why some couples need it.'),
    txt(
`Some couples are unable to have a baby in the usual way — perhaps the sperm and egg cannot meet, or fertilisation does not happen inside the body. Science can help through **assisted reproductive technologies**. The best known of these is **IVF**, which stands for **in-vitro fertilisation** ("in-vitro" simply means "in glass").`),
    h('What IVF Actually Is'),
    txt(
`In IVF, an **egg** and **sperm** are brought together **outside the body**, in a lab dish, where fertilisation can take place. The resulting fertilised egg — an early embryo — is then carefully placed into the mother\'s **uterus**, where it grows into a normal pregnancy. Because the first step happens in glassware, babies born this way were nicknamed "**test tube babies**" — even though no actual test tube is involved, and the baby grows in the uterus just like any other.`),
    cmp('Natural fertilisation vs IVF', [
      { heading: 'Natural', points: ['Sperm and egg meet inside the oviduct', 'Zygote travels to the uterus on its own', 'Grows in the uterus'] },
      { heading: 'IVF', points: ['Sperm and egg are joined in a lab dish', 'Early embryo is placed into the uterus by doctors', 'Grows in the uterus — exactly the same'] },
    ]),
    reason('logical',
      'In IVF, the egg and sperm are joined in a lab dish. But the moment a fertilised egg forms, doctors must place it into the mother\'s uterus. Why can the embryo not simply keep growing in the dish?',
      [
        'A dish cannot give the nourishment, protection, and space a growing baby needs — only the uterus can',
        'The dish is far too cold for the embryo to survive',
        'The embryo would turn back into an egg if left in the dish',
        'The light in the laboratory would instantly harm the embryo',
      ], 0,
      'A growing baby needs the rich, blood-supplied lining of the uterus for food, plus protection and room to develop for nine months — a small glass dish can offer none of that. The dish is only useful for the very first step, the joining of egg and sperm.',
      3),
    callout('note', 'A Powerful Tool, With Real Limits',
`IVF has brought joy to countless families who could not otherwise have children. But it is not magic: it can be expensive, it does not always succeed on the first attempt, and it needs skilled medical care. Like any powerful tool, it has both great uses and real limits — worth knowing before forming an opinion about it.`),
    quiz([
      q('In IVF (in-vitro fertilisation), the egg and sperm are first brought together —',
        [
          'inside the uterus',
          'inside the oviduct',
          'outside the body, in a lab dish',
          'inside the ovary',
        ], 2,
        'The whole point of IVF is that fertilisation is helped along outside the body, in a glass dish. The uterus, oviduct, and ovary are all inside the body — the places where things happen in natural reproduction, not in IVF\'s first step.',
        1),
      q('After fertilisation in IVF, why is the early embryo then placed into the uterus?',
        [
          'So that it can be watched more easily by doctors',
          'So that it has the nourishment and protection it needs to grow',
          'So that it can turn back into an egg',
          'So that it can be cooled down',
        ], 1,
        'Only the uterus, with its thick blood-rich lining, can feed and shelter the developing baby for months. That is why the embryo cannot stay in the dish — it must move to where real growth is possible.',
        2),
      q('Why is the term "test tube baby" actually misleading?',
        [
          'The baby is somehow born much older and bigger than a normal newborn',
          'No test tube is used; egg and sperm meet in a dish, then the baby grows in the uterus',
          'IVF does not actually involve any sperm from the father',
          'The baby turns out not to be genetically related to its parents',
        ], 1,
        'The name suggests a baby grows inside a tube, which never happens. Only the first joining of egg and sperm takes place in glassware; after that, the baby develops in the uterus just like any other. Sperm is certainly used, and the baby is the parents\' own child.',
        3),
    ]),
  ],
};

applyPages([p12, p13, p14]);
