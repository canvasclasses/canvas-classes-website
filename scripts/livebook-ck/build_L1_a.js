'use strict';
/* Chemical Kinetics — Lecture 1, batch A: pages 1–3 (intro, the cow problem, fast vs slow). */
const { B, page, buildPages } = require('./_lib');

const pages = [

  // ── PAGE 1 ──────────────────────────────────────────────────────────────
  page(1, 'chemical-kinetics-intro',
    'Chemical Kinetics: How Fast, Not Just How Much',
    'Thermodynamics tells you a reaction can happen. Kinetics tells you whether it happens in a second, a year, or never in your lifetime.',
    ['chemical-kinetics', 'introduction', 'rate', 'thermodynamics-vs-kinetics'],
    [
      B.hero(
        'A single iron nail caught mid-change — one end polished steel, the other blooming into orange rust, with faint clock hands dissolving into the dark behind it',
        'Ultra-wide cinematic banner (16:5 ratio). A single iron nail lies across the frame on a near-black surface; its left end is bright polished steel, the right end has bloomed into deep orange rust, and faint translucent clock hands dissolve into the darkness behind it. The image asks one silent question: the same metal, the same air — so what decides how FAST it changes? Dramatic warm rim lighting, photorealistic-cinematic. Dark background (#0a0a0a). No text.'
      ),
      B.callout('fun_fact', 'A diamond is living on borrowed time',
        'Here is something strange. Every diamond on Earth is slowly turning into graphite — the soft grey stuff in your pencil. Graphite is the more stable form of carbon, so the change is **spontaneous**: nature *wants* it to happen. So why is your ring safe? Because the reaction is breathtakingly **slow** — far slower than the age of the universe. "Diamonds are forever" is really a statement about *speed*, not about stability.'
      ),
      B.text(
        'By now you can balance an equation and work out how much product it gives. But a balanced equation quietly hides three things it never tells you:\n\n1. **How fast** does the reaction go?\n2. **How far** does it go before it stops?\n3. Does it **release or absorb** energy?\n\nThermodynamics answers the second and third. This chapter is about the first one — **speed**. That study has a name: **chemical kinetics** is the branch of chemistry that deals with how fast reactions go, and with what controls that speed.'
      ),
      B.heading('"Spontaneous" and "fast" are not the same word'),
      B.text(
        'This is the single idea to fix before anything else. A **spontaneous** reaction is one that *can* happen on its own ($\\Delta G < 0$). A **fast** reaction is one that happens *quickly*. They are completely different questions. The diamond proves it: turning to graphite is spontaneous, yet so slow you will never see it. Thermodynamics decides *whether*; kinetics decides *how fast*.'
      ),
      B.reason('logical',
        'A jeweller worries that the diamonds in her shop will turn into graphite, because she has read that the change is spontaneous. Should she be worried — and what is the flaw in her reasoning?',
        [
          'Yes — spontaneous means it will definitely happen soon, so the diamonds are at risk',
          'No — spontaneous only means the change is energetically allowed; it says nothing about speed, and this particular change is so slow it effectively never happens',
          'No — diamonds are not spontaneous, so the change cannot happen at all',
          'Yes — but only if she heats the shop above room temperature',
        ],
        'Spontaneous answers "is it allowed?" not "how fast?". Diamond to graphite is allowed (graphite is more stable) but the rate is unimaginably slow, so the jeweller is safe. Mixing up "spontaneous" with "fast" is the classic trap kinetics is here to fix.',
        2
      ),
      B.heading('Why we bother measuring speed'),
      B.text(
        'Think of a doctor with a critical patient. She gives the medicine and she needs it working in fifteen, twenty minutes. If the same dose takes two hours to act, the patient is in trouble — even though the chemistry is "correct" either way. The *amount* was never the issue. The **speed** was. Most of chemistry that touches real life is like this — what matters is not only *what* happens, but *how fast*.'
      ),
      B.text(
        'That is why kinetics earns its place:\n\n- **Medicine and pharma** tune reactions so the useful product forms fast and the side-products do not.\n- **Industry** hunts for a catalyst when a reaction that takes four days has to finish in hours.\n- **Food** is treated and refrigerated to *slow down* the reactions that spoil it — that is how a packed snack survives months on a shelf.\n- **Catalysts** are chosen by understanding exactly how they speed a reaction up.\n- **Every enzyme** in your body is, underneath, a speed-control device keeping life running at the right pace.'
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Spontaneous $\\neq$ fast:** a favourite multi-statement trap quietly swaps "spontaneous" for "fast" (or "$\\Delta G < 0$" for "high rate"). They are independent. A reaction can be spontaneous and slow (diamond $\\to$ graphite), or non-spontaneous and need a constant push.\n\n**The three questions:** remember that a balanced equation answers *how much*, thermodynamics answers *how far* and *energy*, and kinetics answers *how fast*. Examiners like to ask which branch answers which.'
      ),
      B.quiz([
        {
          question: 'Chemical kinetics is the branch of chemistry that mainly studies:',
          options: [
            'How much product a reaction can form',
            'How fast a reaction goes and what controls its speed',
            'Whether a reaction releases or absorbs heat',
            'How to balance a chemical equation',
          ],
          correct_index: 1,
          explanation: 'Kinetics is about speed and its controlling factors. "How much" is stoichiometry; "heat released/absorbed" and "how far" are thermodynamics.',
          difficulty_level: 1,
        },
        {
          question: 'A reaction is found to be spontaneous ($\\Delta G < 0$) but extremely slow at room temperature. The best conclusion is:',
          options: [
            'It cannot really be spontaneous, since spontaneous reactions are always fast',
            'It is allowed to happen, but its rate is low — "spontaneous" and "fast" are independent ideas',
            'It will become non-spontaneous if you wait long enough',
            'Its products must be less stable than its reactants',
          ],
          correct_index: 1,
          explanation: 'Spontaneity (a thermodynamic verdict) and rate (a kinetic one) are independent. Diamond to graphite is the standard example: allowed, but vanishingly slow.',
          difficulty_level: 2,
        },
        {
          question: 'Food is kept in a refrigerator mainly because lowering the temperature:',
          options: [
            'Changes which products the spoilage reactions can form',
            'Makes the spoilage reactions non-spontaneous so they stop entirely',
            'Slows down the reactions that cause spoilage, so the food lasts longer',
            'Removes all the bacteria from the food instantly',
          ],
          correct_index: 2,
          explanation: 'Cooling does not change what is allowed — it changes the *rate*. Spoilage reactions still "want" to happen; they just run much slower when cold, which is exactly a kinetics effect.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

  // ── PAGE 2 ──────────────────────────────────────────────────────────────
  page(2, 'the-cow-problem',
    'The Cow Problem: Kinetics in the Sky',
    'A cow, a cleanup radical, and one rate equation that decides how much of a greenhouse gas hangs over the planet.',
    ['chemical-kinetics', 'rate-equation', 'methane', 'application', 'rate-constant'],
    [
      B.hero(
        'A lone cow on dark wetland at dusk, faint wisps of gas rising and dissolving into a vast sky above a faintly warming horizon',
        'Ultra-wide cinematic banner (16:5 ratio). A lone cow stands on dark marshy wetland at dusk; faint translucent wisps of gas rise from it and dissolve upward into a vast, deep sky that carries the faintest warm glow on the far horizon. Quiet, atmospheric, a little ominous. Photorealistic-cinematic, deep near-black tones. No text, no labels.'
      ),
      B.callout('fun_fact', 'The 100-kilogram burp',
        'A single cow burps out roughly **100 kg of methane a year**. Methane ($\\ce{CH4}$) traps heat about **80 times** more strongly than $\\ce{CO2}$ over a 20-year window. So the question that actually keeps climate scientists awake is not only *how much* methane goes up — it is **how fast it comes back down.**'
      ),
      B.text(
        'Inside a cow’s stomach, microbes break down grass and release methane. It drifts up into the **troposphere**, the lower atmosphere we live in. There it is constantly being *added* — from wetlands, cattle, and burning crops — and constantly being *removed* by a tiny, restless cleanup species called the **hydroxyl radical**, $\\ce{^.OH}$.'
      ),
      B.text(
        'The main way methane is destroyed is this single step:\n\n$$\\ce{CH4 + ^.OH -> H2O + ^.CH3}$$\n\nWhether methane is a small problem or a runaway one comes down to **how fast** this reaction runs. And the speed of a reaction is written down in one compact expression — its **rate equation**:'
      ),
      B.latex('\\text{rate} = k\\,[\\ce{CH4}]\\,[\\ce{^.OH}]', 'Rate equation for methane removal',
        'rate = how fast methane disappears · $[\\ce{CH4}]$, $[\\ce{^.OH}]$ = concentrations · $k$ = the rate constant'),
      B.text(
        'That little $k$ — the **rate constant** — is the number that captures how quick this reaction is, and finding $k$ for reactions is what this whole chapter is built to do. Thermodynamics already told us methane *can* be removed. Only kinetics tells us whether it is removed **fast enough to matter**. This is the heart of the subject: **the rate of a reaction depends on the concentrations of the species involved, tied together by a constant $k$.**'
      ),
      B.img(
        'Cross-section of a cow showing microbes in the rumen breaking carbohydrates into fatty acids, carbon dioxide and methane, with methane escaping as the animal exhales',
        '📸 Inside the rumen: microbes ferment grass and release methane, which the cow breathes out',
        'Labelled cutaway diagram of enteric fermentation inside a cow’s rumen. Show microbes (bacteria) breaking down carbohydrates into volatile fatty acids, carbon dioxide and methane; arrows show methane gas rising and leaving as the cow exhales. Label: Rumen, Microbes, Carbohydrates, Volatile fatty acids, CO2, CH4. Dark background (#0a0a0a), orange accent labels and arrows, clean technical illustration style.'
      ),
      B.reason('logical',
        'Two greenhouse gases are pumped into the air at exactly the same steady rate. Gas A is destroyed by sunlight within a few days; gas B survives for about a century. Which one builds up to a higher concentration in the atmosphere, and why?',
        [
          'They reach the same concentration, because they are added at the same rate',
          'Gas A, because reacting with sunlight means it is more active',
          'Gas B, because it is removed far more slowly — what is added keeps piling up before it can be cleared',
          'You cannot say without knowing which gas weighs more',
        ],
        'Concentration is set by the balance between how fast something is added and how fast it is removed. Same input for both, but B is cleared much more slowly, so it accumulates. That removal speed is precisely what kinetics studies — and it is why a long atmospheric lifetime makes a gas dangerous.',
        2
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Read the rate equation, do not memorise it.** For now, take away two things: (1) the rate of a reaction is written as $\\text{rate} = k\\,[\\,]\\,[\\,]$, a product of concentrations times a constant $k$; (2) **$k$ is the rate constant** — it carries the actual "how fast" information and stays fixed as long as temperature does not change.\n\n**Classic confusion:** the *rate* changes as the reaction proceeds (concentrations fall), but **$k$ does not** — $k$ only cares about temperature. We will hammer this distinction later, but plant it now.'
      ),
      B.quiz([
        {
          question: 'In the methane-removal step, the rate is written $\\text{rate} = k[\\ce{CH4}][\\ce{^.OH}]$. What does the symbol $k$ represent?',
          options: [
            'The amount of methane present in the air at that moment',
            'The rate constant — how fast the reaction goes at a set temperature',
            'The total time the reaction takes to reach full completion',
            'The concentration of the hydroxyl radical in the mixture',
          ],
          correct_index: 1,
          explanation: 'Concentrations are the bracketed terms; $k$ is the rate constant that ties them to the speed. It depends on temperature, not on how much methane is present.',
          difficulty_level: 1,
        },
        {
          question: 'Methane is added to and removed from the troposphere all the time. Its steady atmospheric concentration is decided by:',
          options: [
            'Only by how fast it is added from all its sources',
            'Only by how fast it is removed by the $\\ce{^.OH}$ radical',
            'By the balance between how fast it is added and removed',
            'Only by how heavy a single methane molecule is',
          ],
          correct_index: 2,
          explanation: 'A roughly constant concentration means the removal rate keeps pace with the emission rate. It is the balance of the two speeds — a kinetics idea — that sets the level.',
          difficulty_level: 2,
        },
        {
          question: 'A balanced equation for the methane reaction tells you the mole ratios, but NOT:',
          options: [
            'Which atoms are conserved during the reaction',
            'How fast the reaction actually proceeds in practice',
            'Which of the species act as the reactants',
            'How many product molecules are formed',
          ],
          correct_index: 1,
          explanation: 'The equation gives stoichiometry — what reacts with what, in what ratio. Speed lives outside the equation, in the rate equation and the constant $k$. That gap is the reason kinetics exists.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

  // ── PAGE 3 ──────────────────────────────────────────────────────────────
  page(3, 'fast-and-slow-reactions',
    'From a Flash to a Fossil: The Range of Reaction Speeds',
    'Reaction rates span from a fraction of a second to millions of years — and you cannot tell which from the equation alone.',
    ['chemical-kinetics', 'rate', 'fast-and-slow', 'concentration-time'],
    [
      B.hero(
        'A split scene: on the left a violent flash of burning metal in water, on the right a rust-eaten chain lying still on dark ground — the same kind of chemistry at wildly different speeds',
        'Ultra-wide cinematic banner (16:5 ratio). A split composition. Left: a violent bright flash as a piece of reactive metal hits water, sparks and white light bursting outward. Right: a heavily rust-eaten iron chain lying still and quiet on dark ground. Same theme — chemical change — but one is explosive and instant, the other slow and silent. Dramatic lighting, deep near-black background. Photorealistic-cinematic. No text.'
      ),
      B.callout('fun_fact', 'A second versus a few hundred million years',
        'Drop a piece of caesium into water and it reacts so violently it can shatter the container — done in a flash. Leave an iron gate out in the rain and it rusts over months. And the coal we burn today formed from dead plants over **hundreds of millions of years**. All three are chemical reactions. The difference between them is nothing but **speed**.'
      ),
      B.text(
        'Reactions sit anywhere on a vast speed scale:\n\n- **Very fast** — reactions between ions in solution (like a precipitate forming the instant two solutions meet), acid–base neutralisation, explosions.\n- **Moderate** — many reactions you can actually watch unfold over minutes, such as $\\ce{N2 + 3H2 -> 2NH3}$.\n- **Very slow** — rusting of iron, ripening of fruit, ageing, the formation of coal and oil.'
      ),
      B.text(
        'Here is the catch, and it is worth saying plainly: **you cannot judge how fast a reaction is by looking at its equation.** $\\ce{H2 + Cl2 -> 2HCl}$ and $\\ce{H2 + F2 -> 2HF}$ look almost identical on paper, yet one is sluggish and the other is ferociously fast. The shape of the equation carries no label saying "slow" or "fast". The only way to know a rate is to **measure** it.'
      ),
      B.reason('logical',
        'Two reactions are written on the board: $\\ce{AgNO3 + NaCl -> AgCl + NaNO3}$ (a precipitate forms the moment the solutions meet) and the rusting of an iron nail left in damp air. A student says "they are both single-arrow reactions, so they must go at similar speeds." Where is the flaw?',
        [
          'There is no flaw — both are written the same way, so they go at the same speed',
          'The equation’s appearance tells you nothing about speed; the ionic precipitation is near-instant while rusting takes weeks, and only measurement reveals that',
          'The rusting reaction is faster because iron is a metal',
          'The precipitation is slower because it involves three elements',
        ],
        'How an equation looks on paper says nothing about its rate. Ionic reactions in solution are typically very fast; rusting is famously slow. Two reactions with identical-looking equations can differ in speed by a factor of millions — you only know by measuring.',
        2
      ),
      B.heading('Watching a reaction happen: the concentration–time picture'),
      B.text(
        'Take the simplest possible change, $\\ce{A -> B}$. At the start you have only A and no B. As time passes, A is used up and B builds up. If you tabulate it, the story is obvious: A falls, B rises, and together they always add up to the same total.'
      ),
      B.table('A simple reaction $\\ce{A -> B}$ followed over time (concentrations in arbitrary units)',
        ['Time', '[A]', '[B]'],
        [
          ['start', '100', '0'],
          ['later', '80', '20'],
          ['', '60', '40'],
          ['', '50', '50'],
          ['', '40', '60'],
          ['', '20', '80'],
          ['end', '0', '100'],
        ]
      ),
      B.img(
        'Two curves against time for A to B: the reactant concentration falls from a high start and levels off near zero, while the product rises from zero and levels off, the two curves crossing midway',
        '📸 As the reaction runs, [A] falls and [B] rises until the reaction is over',
        'Line graph titled "concentration vs time" for the reaction A to B. The x-axis is time, the y-axis is concentration. One smooth curve labelled [A] starts high and decays, levelling off near zero; a second smooth curve labelled [B] starts at zero and rises, levelling off at the top; the two curves cross near the middle. Dark background (#0a0a0a), orange accent for [A] and a second accent colour for [B], clean technical illustration, gridlines subtle.'
      ),
      B.text(
        'Look at the curves and you can already *see* the rate. Early on, A drops steeply — the reaction is going fast. Later the curve flattens — the reaction slows down and finally stops. That changing steepness **is** the rate changing with time, and capturing it precisely is what the next page is about.'
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**"You cannot read rate off the equation" is itself examinable.** A common true/false statement claims that a reaction with more reactant molecules, or a "bigger" equation, must be faster. False — rate is decided by experiment, not by the look of the equation.\n\n**Everyday slow reactions to recognise:** rusting of iron, ripening of fruit, ageing, formation of coal/petroleum. Everyday fast ones: ionic precipitation, acid–base neutralisation, explosions. NEET likes "which of these is the slowest/fastest" recall.'
      ),
      B.quiz([
        {
          question: 'Which set lists reactions in order from typically fastest to slowest?',
          options: [
            'Rusting of iron → acid–base neutralisation → formation of coal',
            'Ionic precipitation in solution → $\\ce{N2 + 3H2 -> 2NH3}$ → rusting of iron',
            'Formation of coal → rusting of iron → explosion',
            'Ripening of fruit → explosion → ionic precipitation',
          ],
          correct_index: 1,
          explanation: 'Ionic reactions in solution are near-instant, the ammonia synthesis is moderate, and rusting is slow. The other options jumble fast and slow processes out of order.',
          difficulty_level: 2,
        },
        {
          question: 'The reactions $\\ce{H2 + Cl2 -> 2HCl}$ and $\\ce{H2 + F2 -> 2HF}$ have very similar-looking equations but very different rates. The best lesson is:',
          options: [
            'The equation with the lighter element always reacts faster',
            'You cannot judge a reaction’s rate from how its equation looks',
            'Both reactions must actually proceed at the same rate',
            'The reaction with more atoms in it is always the slower one',
          ],
          correct_index: 1,
          explanation: 'Similar-looking equations can have wildly different rates. Speed is a property you measure experimentally, not something you deduce from the formula on paper.',
          difficulty_level: 2,
        },
        {
          question: 'On a concentration–time graph for $\\ce{A -> B}$, the curve for [A] is steepest at the very start and flattens later. This tells you that:',
          options: [
            'The reaction runs at a constant speed throughout',
            'The reaction is slow at first and speeds up at the end',
            'The reaction is fastest at the start and slows down as it proceeds',
            'No reaction is taking place',
          ],
          correct_index: 2,
          explanation: 'Steepness of the concentration curve is the rate. A steep early slope that flattens out means the reaction starts fast and slows as the reactant is used up — the normal pattern for most reactions.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

];

buildPages(pages)
  .then(() => { console.log('\nbatch A done.'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
