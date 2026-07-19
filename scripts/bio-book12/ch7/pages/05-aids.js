'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'aids-and-hiv',
  title: 'AIDS & HIV',
  subtitle: "AIDS is not a disease you are born with — it is an immune system slowly emptied out by a virus that turns your own defence cells into virus factories.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['aids', 'hiv', 'retrovirus', 'human-health-and-disease'],
  glossary: [
    { term: 'HIV', definition: 'Human Immunodeficiency Virus — the virus that causes AIDS. It carries an RNA genome inside an envelope and attacks the immune system.' },
    { term: 'retrovirus', definition: 'A group of viruses whose genetic material is RNA and which can make DNA from that RNA after entering a host cell. HIV is a retrovirus.' },
    { term: 'reverse transcriptase', definition: 'The enzyme HIV uses to build viral DNA from its RNA genome inside the host cell — the reverse of the usual DNA-to-RNA direction.' },
    { term: 'helper T-lymphocyte', definition: "A type of immune cell (T-H cell) that helps run the body's immune response. HIV destroys these cells, which is why immunity collapses in AIDS." },
    { term: 'ELISA', definition: 'Enzyme Linked Immuno-Sorbent Assay — the widely used diagnostic test for detecting HIV infection / AIDS.' },
    { term: 'opportunistic infection', definition: 'An infection by a microbe the body could normally fight off easily, which takes hold only because the immune system has been weakened — common in AIDS patients.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dim clinical scene suggesting the quiet, hidden progress of HIV infection inside the body over years',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet, sombre, respectful medical scene rendered in painterly illustration: a softly lit hospital blood-testing bench at dusk, a rack of labelled sample vials and a microscope in shallow focus, with faint suggestions of tiny virus particles drifting like dust motes in a shaft of cool light in the background. The mood is calm, scientific and dignified — not frightening, not sensational. Deep dusk lighting, single soft horizon glow, dark overall background (#0a0a0a base tones). No people's faces, no red-ribbon symbols, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'A Word That Tells You Everything',
      markdown: "Break the name apart and the disease explains itself. **A**cquired — you are **not born with it**, you pick it up during your life. **I**mmuno **D**eficiency — your immune system runs **short**. **S**yndrome — a **group of symptoms**, not one single sign. AIDS was first reported in **1981**, and within about twenty-five years it had spread across the world and killed **more than 25 million people**. All of that damage traces back to one tiny virus.",
    },
    {
      id: uuid(), type: 'heading', order: 2, level: 2,
      text: 'The Virus, and How It Travels',
      objective: "By the end of this you can name the virus, its family, and the exact four ways it spreads — and the ways it does not.",
    },
    {
      id: uuid(), type: 'text', order: 3,
      markdown: "AIDS is caused by the **Human Immunodeficiency Virus (HIV)**. HIV belongs to a group of viruses called **retroviruses** — viruses that carry an **RNA genome** wrapped inside an **envelope**. Hold on to that word *retrovirus*; it is the whole reason HIV behaves the way it does.\n\nHIV spreads **only through body fluids**, by four routes NCERT names:\n\n- **(a)** sexual contact with an infected person,\n- **(b)** transfusion of contaminated **blood** and blood products,\n- **(c)** sharing **infected needles** (as among intravenous drug abusers),\n- **(d)** from an **infected mother to her child through the placenta**.\n\nSo the people at high risk are those with multiple sexual partners, drug addicts who inject drugs, people who need repeated blood transfusions, and babies born to HIV-infected mothers.\n\nNow the part students get wrong under exam pressure: **HIV is NOT spread by mere touch or ordinary physical contact.** Sharing a meal, a handshake, a hug, sitting together — none of these pass the virus. Because it does not spread by casual contact, there is no reason to isolate infected people from family and society. Doing so only harms them. There is also a **time-lag** between getting infected and showing AIDS symptoms — often **5 to 10 years** — during which a person may look and feel healthy while the virus works quietly inside.",
    },
    {
      id: uuid(), type: 'heading', order: 4, level: 2,
      text: 'Inside the Cell: How HIV Copies Itself',
      objective: "By the end of this you can walk through HIV replication in order — from entry, to reverse transcriptase, to the destruction of helper T-cells.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Diagram of HIV replication inside a human immune cell — the virus entering a macrophage, reverse transcriptase making viral DNA, that DNA joining the host DNA, new virus particles forming, and a helper T-cell being destroyed',
      caption: '📸 Tap each dot to follow HIV through one full cycle inside the body (Replication of HIV, NCERT Fig 7.6)',
      generation_prompt: "Scientific textbook illustration of the replication of HIV (a retrovirus) inside a human immune cell. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, no baked-in text labels. Left side: an enveloped HIV particle (purple RNA strands inside a spherical envelope with surface spikes) fusing with and entering a large rounded macrophage (pink/magenta soft-tissue cell). Inside the macrophage: a purple viral RNA strand being converted into a straight double-stranded viral DNA (purple) by a small enzyme shape labelled area for reverse transcriptase; then that viral DNA shown joining/inserting into the host cell's own coiled DNA in the nucleus. Show several small new HIV particles budding out of the macrophage (macrophage acting as a virus factory). To the right: released HIV particles attacking a second distinct immune cell, a helper T-lymphocyte (pink cell marked T-H), which is shown shrinking/breaking apart to indicate destruction. Arrows implying a clockwise cycle. Functional colours: purple = nucleic acid, pink/magenta = animal cells. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.12, y: 0.42, label: 'HIV enters a macrophage', icon: 'circle',
          detail: "After getting into the body, the virus first enters a **macrophage** — a large immune cell. The enveloped HIV particle carries its **RNA genome** inside." },
        { id: uuid(), x: 0.34, y: 0.36, label: 'Reverse transcriptase makes viral DNA', icon: 'circle',
          detail: "Inside the macrophage, the viral RNA is copied into **viral DNA** with the help of the enzyme **reverse transcriptase**. This RNA-to-DNA step is exactly what makes HIV a *retrovirus*." },
        { id: uuid(), x: 0.44, y: 0.66, label: 'Viral DNA joins the host DNA', icon: 'circle',
          detail: "The newly made viral DNA gets **incorporated into the host cell's own DNA**. Once hidden inside the host genome, it directs the infected cell to start making virus particles." },
        { id: uuid(), x: 0.60, y: 0.40, label: 'New virus particles are made', icon: 'circle',
          detail: "The infected macrophage now churns out new HIV particles, one after another. NCERT calls the macrophage an **HIV factory** — it keeps producing virus without dying." },
        { id: uuid(), x: 0.84, y: 0.44, label: 'Helper T-lymphocytes are destroyed', icon: 'circle',
          detail: "HIV also enters **helper T-lymphocytes (T-H cells)**, multiplies inside them, and the progeny viruses go on to attack still more helper T-cells — steadily **destroying** them and dropping their number." },
        { id: uuid(), x: 0.70, y: 0.74, label: 'Progeny viruses spread', icon: 'circle',
          detail: "The progeny viruses released into the **blood** attack fresh helper T-lymphocytes, and the cycle repeats — which is why the count of these cells falls lower and lower over time." },
      ],
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Follow the damage forward. As helper T-lymphocytes are destroyed cycle after cycle, **their number keeps dropping**. During this stretch the person suffers **bouts of fever, diarrhoea and weight loss**.\n\nThen comes the real danger. Helper T-cells are central to running the immune response, so as they disappear the body's defences fall apart. The person starts catching infections that a healthy body would shrug off — **opportunistic infections** from bacteria (especially *Mycobacterium*), viruses, fungi, and even parasites like *Toxoplasma*. The patient becomes so **immuno-deficient** that they can no longer protect themselves against these microbes. It is usually one of these opportunistic infections, not HIV directly, that overwhelms the body.\n\nTo find out whether someone is infected, the widely used diagnostic test is **ELISA** (Enzyme Linked Immuno-Sorbent Assay). Treatment uses **anti-retroviral drugs**, but these are only **partially effective** — they can prolong life but cannot prevent death, which is inevitable once AIDS sets in.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
      prompt: "An HIV-positive patient dies not from HIV itself but from a fungal infection that a healthy person would have easily fought off. Which single fact best explains why this ordinary microbe became deadly?",
      options: [
        "HIV directly kills fungi-fighting cells in the skin, so fungi grow unchecked",
        "HIV destroys helper T-lymphocytes, collapsing the immune response and letting normally harmless microbes take hold",
        "Anti-retroviral drugs cause the fungal infection as a side effect",
        "The fungus mutated into a stronger form after entering the body",
      ],
      reveal: "HIV specifically enters and destroys **helper T-lymphocytes**, the cells that coordinate the immune response. As their number falls, the whole defence system weakens, and microbes the body would normally overcome — bacteria, fungi, parasites — cause **opportunistic infections** that can kill. That is the mechanism NCERT stresses. The tempting wrong answer is the fungus 'mutating into a stronger form': it feels dramatic, but NCERT never says the microbe changes — it is the *patient's* fallen immunity, not a tougher microbe, that turns an ordinary infection fatal.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 8, variant: 'remember', title: 'Lock These Three In',
      markdown: "- HIV is a **retrovirus** — RNA genome inside an envelope; it uses **reverse transcriptase** to make viral DNA.\n- HIV destroys **helper T-lymphocytes (T-H cells)** — that is *why* immunity collapses and opportunistic infections take over.\n- The diagnostic test for AIDS is **ELISA**.\n- Spread routes: **sexual contact, contaminated blood/transfusion, shared infected needles, infected mother → child via placenta**. NOT by touch or casual contact.",
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Retrovirus + enzyme:** HIV carries RNA and makes DNA from it using **reverse transcriptase**. NEET loves to flip the enzyme name or the direction — the answer is always reverse transcriptase, RNA → DNA.\n\n**Which cell?** HIV first enters **macrophages** (the 'HIV factory'), but the cells whose destruction causes the immune collapse are the **helper T-lymphocytes**. Both appear as options — read the question.\n\n**Diagnosis = ELISA.** Don't confuse it with the treatment (anti-retroviral drugs, only partially effective).\n\n**Transmission myths:** questions often list a wrong route like 'sharing food' or 'mosquito bite / handshake' among the four real routes — HIV spreads only through body fluids, never casual contact.\n\n**Classic NEET question:** \"Which enzyme of HIV synthesises viral DNA from its RNA genome inside the host cell?\" → **reverse transcriptase.**",
    },
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "Because AIDS has **no cure**, prevention is the best option — and most HIV infection spreads through conscious behaviour, so it *can* be prevented. In India, the **National AIDS Control Organisation (NACO)** and various NGOs work to educate people, while steps like **screening blood in blood banks to make it HIV-safe**, using only **disposable needles and syringes**, distributing condoms, controlling drug abuse, and promoting regular check-ups all cut the spread. Infected people need help and sympathy, not shunning — hiding the infection only lets it reach more people. Next we turn to another failure of the body's own controls: **cancer**.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'HIV is best described as which type of virus?',
          options: [
            'A DNA virus with no envelope',
            'A retrovirus with an RNA genome enclosed in an envelope',
            'A bacteriophage that infects gut bacteria',
            'A viroid made only of free RNA with no protein coat',
          ],
          correct_index: 1,
          explanation: "HIV is a retrovirus: it has an RNA genome enclosed in an envelope and uses reverse transcriptase to make DNA from that RNA. The 'DNA virus' option is the classic trap — students remember DNA gets made and wrongly call HIV a DNA virus, but its actual genome is RNA. Viroids (free RNA, no coat) and bacteriophages are entirely different agents.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'A student lists ways HIV can spread. Which one is WRONG?',
          options: [
            'Transfusion of contaminated blood',
            'From an infected mother to her child through the placenta',
            'Sharing a plate of food or shaking hands with an infected person',
            'Sharing infected needles between intravenous drug users',
          ],
          correct_index: 2,
          explanation: "HIV spreads only through body fluids — sexual contact, contaminated blood, shared infected needles, and mother-to-child via the placenta. Sharing food or shaking hands is casual contact and does NOT transmit HIV; that is exactly why infected people should not be isolated. The other three options are all genuine NCERT routes.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'The progressive collapse of immunity in AIDS is directly due to HIV destroying which cells?',
          options: [
            'Red blood cells',
            'Helper T-lymphocytes',
            'Macrophages, which are killed off immediately on infection',
            'Lymph nodes',
          ],
          correct_index: 1,
          explanation: "HIV steadily destroys helper T-lymphocytes, and because these cells coordinate the immune response, their loss cripples the body's defences and lets opportunistic infections take over. Macrophages are the tempting distractor: HIV does infect them, but they act as virus 'factories' and keep producing virus rather than being immediately killed — it is the falling helper T-cell count that causes the immune breakdown.",
          difficulty_level: 3,
        },
        {
          id: uuid(), question: 'The widely used diagnostic test for AIDS is:',
          options: [
            'ELISA (Enzyme Linked Immuno-Sorbent Assay)',
            'Treatment with anti-retroviral drugs',
            'A blood-sugar (glucose tolerance) test',
            'The Widal test',
          ],
          correct_index: 0,
          explanation: "ELISA is the widely used test to diagnose HIV infection / AIDS. Anti-retroviral drugs are the treatment, not a diagnostic test — a common mix-up. A glucose tolerance test is for diabetes, and the Widal test is for typhoid, so both belong to entirely different diseases.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
