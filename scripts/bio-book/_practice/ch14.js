'use strict';
// Class 11 Biology — Ch.14 — "Practice — NCERT Exercises" page.
// SNAPSHOT of the live, already-inserted page (regenerated to fix a
// non-idempotency bug: the original module called uuid() at require() time,
// so every re-save looked like a full block removal+addition to book-writer's
// content-loss guard. This module carries the exact ids currently live in
// Mongo, so re-running insert_practice_pages.js against it is a true no-op.
module.exports = {
  "slug": "ch14-practice-ncert-exercises",
  "title": "Practice — NCERT Exercises",
  "subtitle": "All 14 NCERT textbook exercises for the chapter, grouped into 4 revision themes with full worked solutions.",
  "page_type": "lesson",
  "tags": [
    "ncert-exercises",
    "practice"
  ],
  "blocks": [
    {
      "id": "50436fb9-46e2-4d9d-bea2-47d82599ebd4",
      "type": "image",
      "order": 0,
      "src": "",
      "alt": "An alveolus wrapped in capillaries on the left with oxygen and carbon dioxide diffusing in opposite directions, and a red blood cell releasing oxygen to tissue cells while picking up carbon dioxide on the right",
      "caption": "",
      "width": "full",
      "aspect_ratio": "16:5",
      "generation_prompt": "Scientific textbook illustration, wide landscape banner, flat 2D educational diagram on a dark background (#0a0a0a near-black). Left half: a cross-section of a single alveolus wrapped tightly in a capillary network, with small circular tokens showing oxygen molecules diffusing from the air sac into the blood vessel and carbon dioxide molecules diffusing the opposite way out into the air sac, small arrows indicating both directions of movement. Right half: a red blood cell travelling along a blood vessel toward a cluster of body tissue cells, shown releasing oxygen to the tissue cells and picking up carbon dioxide from them. Clean white outlines, muted natural reds, pinks and soft blue-grey tones, biologically accurate schematic proportions, no photorealism, no cartoon, matches standard biology textbook illustration conventions. No text, no labels, no leader lines, no pointer lines of any kind anywhere in the image."
    },
    {
      "id": "c26b4178-3479-41c6-96c6-a84b8eb662ae",
      "type": "text",
      "order": 1,
      "markdown": "You've read the chapter — now drill it. Below are **all 14 NCERT exercises** for *Breathing and Exchange of Gases*, pulled out of the textbook's running order and re-sorted into four revision themes: the mechanics of breathing and the volumes it moves, where and how gases actually diffuse, how the blood transports both gases, and how the whole rhythm is regulated — including what happens at altitude and when the system breaks down.\n\nTry to answer each one in your head (or on paper) before you open the solution. The worked answer is written to *teach* the whole idea, not just tick the box — so even a question you get right is worth reading through."
    },
    {
      "id": "4f9dee16-40d8-4659-8469-49063b3c65d1",
      "type": "practice_bank",
      "order": 2,
      "title": "NCERT Exercises 14.1–14.14",
      "intro": "Every end-of-chapter exercise, regrouped into four revision themes. Each carries a one-line answer for a quick self-check and a full worked solution.",
      "sections": [
        {
          "id": "s1-mechanics-and-volumes",
          "title": "Breathing Mechanics and the Volumes It Moves",
          "blurb": "How inspiration is actually driven, and the volumes and capacities a spirometer measures around it.",
          "items": [
            {
              "kind": "numerical",
              "id": "85da4dd5-a6f1-4f8b-866c-eeaff452f265",
              "source": "ncert_exercise",
              "source_label": "NCERT 14.6",
              "prompt": "Explain the process of inspiration under normal conditions.",
              "answer": "Diaphragm and external intercostal muscles contract → thoracic (and pulmonary) volume increases → intra-pulmonary pressure falls below atmospheric → air is forced in.",
              "solution": "Inspiration is the stage of breathing where atmospheric air is drawn into the lungs, and it happens only when the pressure inside the lungs falls below the pressure outside.\n\nTwo muscles do the work, and they act together. **Inspiration is initiated by the contraction of the diaphragm** — the dome-shaped muscle forming the floor of the thoracic chamber. When it contracts, it flattens and moves downward, and this increases the volume of the thoracic chamber along the **antero-posterior axis** (front-to-back).\n\nAt almost the same time, the **external intercostal muscles** — the muscles running between the ribs — contract and **lift the ribs and sternum** upward and outward. This adds a second increase in thoracic volume, this time along the **dorso-ventral axis** (back-to-belly).\n\nBecause the thoracic chamber is an air-tight box holding the lungs, any increase in its volume is passed straight on to the lungs — **pulmonary volume rises along with thoracic volume**. A bigger lung volume means the intra-pulmonary pressure **drops below atmospheric pressure** — a negative pressure inside the lungs compared to outside.\n\nOnce that pressure difference exists, nothing more needs to happen — air simply flows down the pressure gradient, from the higher pressure outside to the lower pressure inside, and rushes into the lungs. That inward flow is inspiration. Under normal, quiet breathing, only the diaphragm and external intercostals are needed; the extra abdominal muscles come into play only for a forced, deeper breath."
            },
            {
              "kind": "numerical",
              "id": "6f91cce7-040f-431a-8862-ebc4737d0949",
              "source": "ncert_exercise",
              "source_label": "NCERT 14.2",
              "prompt": "State the volume of air remaining in the lungs after a normal breathing.",
              "answer": "That's the Functional Residual Capacity — ERV + RV, roughly 2100 to 2300 mL.",
              "solution": "'After a normal breathing' means after an ordinary, relaxed breath out — not a forced one. NCERT has a name for exactly this: the **Functional Residual Capacity (FRC)** — the volume of air that stays in the lungs after a **normal expiration**.\n\nFRC is built from two of the four basic volumes: **FRC = ERV + RV**.\n\n- Expiratory Reserve Volume (ERV) is about 1000–1100 mL\n- Residual Volume (RV) is about 1100–1200 mL\n\nAdding the two together, FRC comes out to roughly **2100 to 2300 mL**. This is not 'empty lungs' — it's the cushion of air that never leaves, plus the little extra reserve you haven't used yet by forcing a harder exhale. Don't confuse this with residual volume alone (which is only the air you can *never* breathe out, even by forcing) — FRC is that plus the unused reserve on top of it."
            },
            {
              "kind": "numerical",
              "id": "ba49e488-6c99-41e6-af63-f3268ae67443",
              "source": "ncert_exercise",
              "source_label": "NCERT 14.1",
              "prompt": "Define vital capacity. What is its significance?",
              "answer": "VC = ERV + TV + IRV — the maximum air you can move in a single breath. It is the working measure of how much air a person can actually shift, used to check lung function.",
              "solution": "**Vital Capacity (VC)** is the **maximum volume of air a person can breathe in after a forced expiration** — or, said the other way round, the maximum volume a person can breathe out after a forced inspiration. It is built from three of the four basic respiratory volumes: **VC = ERV + TV + IRV** (Expiratory Reserve Volume + Tidal Volume + Inspiratory Reserve Volume). Notice what's left out — Residual Volume. VC deliberately excludes the air you can never breathe out at all; add RV to VC and you get Total Lung Capacity instead.\n\n**Why it matters:** the pulmonary capacities exist so there's a number to work with, and NCERT groups them together as measurements that can be **used in clinical diagnosis**. Vital capacity is the one that tells you, in a single figure, how much 'usable' air a person's lungs can move in one full breath. A healthy chest wall, a properly working diaphragm and healthy alveoli give a high VC. Anything that damages the lung tissue or restricts the lungs' ability to expand — the alveolar-wall damage seen in emphysema is a good example from later in this chapter — cuts into how much air can be moved, and VC falls. That's why it's measured with a spirometer as a simple, non-invasive check of how well a person's lungs are working."
            },
            {
              "kind": "numerical",
              "id": "db38cc2e-3aa6-4450-b50a-a9da37868727",
              "source": "ncert_exercise",
              "source_label": "NCERT 14.13",
              "prompt": "Distinguish between\n(a) IRV and ERV\n(b) Inspiratory capacity and Expiratory capacity.\n(c) Vital capacity and Total lung capacity.",
              "answer": "Three pairs, each built from the same four volumes — see the tables in the solution.",
              "solution": "Three pairs, and each one comes straight from the four volumes and five capacities you already know.\n\n**(a) IRV and ERV**\n\n| Feature | Inspiratory Reserve Volume (IRV) | Expiratory Reserve Volume (ERV) |\n|---|---|---|\n| What it is | Extra air you can force IN after a normal breath in | Extra air you can force OUT after a normal breath out |\n| When it's used | During a forcible inspiration | During a forcible expiration |\n| Approx. value | 2500–3000 mL | 1000–1100 mL |\n\n**(b) Inspiratory Capacity and Expiratory Capacity**\n\n| Feature | Inspiratory Capacity (IC) | Expiratory Capacity (EC) |\n|---|---|---|\n| Definition | Total air a person can inspire after a normal expiration | Total air a person can expire after a normal inspiration |\n| Formula | TV + IRV | TV + ERV |\n\n**(c) Vital Capacity and Total Lung Capacity**\n\n| Feature | Vital Capacity (VC) | Total Lung Capacity (TLC) |\n|---|---|---|\n| Definition | Maximum air breathed in after a forced expiration, or out after a forced inspiration | Total air the lungs hold at the end of a forced inspiration |\n| Formula | ERV + TV + IRV | RV + ERV + TV + IRV (= VC + RV) |\n| Includes RV? | No — the one capacity that leaves RV out | Yes — the only capacity that includes all four volumes |\n\nThe one thing to hold onto across all three pairs: IRV and ERV are single volumes on opposite sides of a normal breath; IC and EC are each a single volume added to the tidal volume; and VC vs TLC comes down to one thing only — whether residual volume is included."
            },
            {
              "kind": "numerical",
              "id": "7f5a4c8a-b021-46e6-abcd-97183b47e23e",
              "source": "ncert_exercise",
              "source_label": "NCERT 14.14",
              "prompt": "What is Tidal volume? Find out the Tidal volume (approximate value) for a healthy human in an hour.",
              "answer": "TV ≈ 500 mL per breath; over an hour, roughly 360,000–480,000 mL (360–480 litres) of air move through the lungs.",
              "solution": "**Tidal Volume (TV)** is the volume of air inspired or expired during one normal, relaxed breath — approximately **500 mL**.\n\nTo scale this up to an hour, you need one more fact this chapter already gives you: a healthy human breathes **12–16 times per minute**. Multiply tidal volume by the breathing rate and you get the volume moved per minute — which is exactly how this chapter gets its own per-minute figure: 500 mL × 12 to 16 breaths = **6000 to 8000 mL per minute**.\n\nNow scale that up by 60 minutes to get the hourly figure:\n\n- Lower end: 6000 mL/min × 60 min = **360,000 mL = 360 litres/hour**\n- Upper end: 8000 mL/min × 60 min = **480,000 mL = 480 litres/hour**\n\nSo a healthy human moves roughly **360 to 480 litres of air through the lungs every hour** — all of it in 500 mL sips, taken 12 to 16 times a minute, without you ever having to think about it."
            }
          ]
        },
        {
          "id": "s2-diffusion",
          "title": "Diffusion — Where Gases Actually Cross",
          "blurb": "Why exchange is confined to the alveoli, reading Table 14.1, and how an insect does the same job with no lungs at all.",
          "items": [
            {
              "kind": "numerical",
              "id": "c1408ad5-d01c-4dee-84fe-b2181057aeaf",
              "source": "ncert_exercise",
              "source_label": "NCERT 14.3",
              "prompt": "Diffusion of gases occurs in the alveolar region only and not in the other parts of respiratory system. Why?",
              "answer": "Only the alveoli (with their ducts) form the exchange part — a thin, richly vascularised wall built for diffusion. Everything else is the conducting part, built only to transport, clean, warm and humidify air.",
              "solution": "The respiratory system is deliberately split into two zones that do two different jobs, and only one of them is built for gas exchange.\n\nEverything from the **external nostrils down to the terminal bronchioles** — nasal chamber, pharynx, larynx, trachea, all the branching bronchi, and the bronchioles — is the **conducting part**. Its entire job is to **transport** air down to the alveoli, **clear** it of foreign particles, **humidify** it, and **warm** it to body temperature. None of that requires, or allows, gas to cross into the blood.\n\nOnly the **alveoli and their ducts** make up the **respiratory (exchange) part**, and they are built completely differently for exactly this reason. The wall a gas has to cross there — the **diffusion membrane** — is made of just three very thin layers (the squamous epithelium of the alveolus, a thin basement substance, and the endothelium of the capillary), and put together they measure **much less than a millimetre**. On top of that, the alveoli are **richly vascularised** — wrapped tightly in capillaries — so blood is always right there against that thin wall.\n\nThe conducting airways have neither of these features. Their walls are thicker (the trachea and bronchi are even held open by cartilage rings, which are certainly not built for gases to slip through), and they aren't wrapped in capillaries the way alveoli are. Without a thin membrane and a close blood supply, there is nothing for a gas to diffuse across — so diffusion simply doesn't happen anywhere along the conducting part, and stays confined entirely to the alveolar region."
            },
            {
              "kind": "mcq",
              "id": "2c25ccb3-f3e0-404a-89f6-76078f9a92c3",
              "source": "ncert_exercise",
              "source_label": "NCERT 14.5",
              "prompt": "What will be the pO2 and pCO2 in the atmospheric air compared to those in the alveolar air ?",
              "options": [
                "pO2 lesser, pCO2 higher",
                "pO2 higher, pCO2 lesser",
                "pO2 higher, pCO2 higher",
                "pO2 lesser, pCO2 lesser"
              ],
              "correct_index": 1,
              "explanation": "From Table 14.1: atmospheric air has pO2 = 159 mm Hg and pCO2 = 0.3 mm Hg; alveolar air has pO2 = 104 mm Hg and pCO2 = 40 mm Hg. Comparing the two, atmospheric air has a HIGHER pO2 (159 vs 104) and a LOWER pCO2 (0.3 vs 40) than alveolar air — that matches option (ii) exactly. It makes sense physically too: by the time air has become 'alveolar air', it has already given up some oxygen to the blood and picked up carbon dioxide from it, so its pO2 has dropped and its pCO2 has risen compared to fresh atmospheric air that hasn't exchanged with the blood yet."
            },
            {
              "kind": "numerical",
              "id": "e50d177d-d8cc-40ea-a0c0-a38422d49b49",
              "source": "ncert_exercise",
              "source_label": "NCERT 14.10",
              "prompt": "What is the site of gaseous exchange in an insect?",
              "answer": "The tracheal tubes — the branching network of air tubes that carries atmospheric air directly to the tissues, without involving blood.",
              "solution": "Insects don't use lungs or gills at all. This chapter's opening comparison across animal groups names their structure specifically: **insects have a network of tubes called tracheal tubes** to move atmospheric air through the body.\n\nThis is a genuinely different design from the airway you spent the rest of this chapter learning. In a human, air stops at the alveoli and the gas itself never reaches the tissues directly — the **blood** carries O2 and CO2 the rest of the way, between the alveoli and the tissues. An insect skips that blood-mediated step for gas transport: its **tracheal tubes branch finely enough to reach the body's tissues directly**, so air is delivered straight to where it's needed, and the exchange of gases happens right there, at the tissue end of the tracheal network — not through the blood.\n\nSo the answer to 'where does gas exchange happen in an insect' is the **tracheal tube system itself** — specifically its finest branches, where they meet the tissues — rather than a single dedicated organ like a lung or a gill."
            }
          ]
        },
        {
          "id": "s3-transport",
          "title": "Transport of Oxygen and Carbon Dioxide",
          "blurb": "The oxygen dissociation curve, what pCO2 does to it, and the three ways CO2 rides back to the lungs.",
          "items": [
            {
              "kind": "numerical",
              "id": "44943eb4-cd34-4768-9171-fc1ba0cc7893",
              "source": "ncert_exercise",
              "source_label": "NCERT 14.11",
              "prompt": "Define oxygen dissociation curve. Can you suggest any reason for its sigmoidal pattern?",
              "answer": "It's the graph of % Hb-saturation with O2 against pO2 — an S-shaped curve. The sigmoid shape comes from haemoglobin's four O2-binding sites binding cooperatively rather than independently.",
              "solution": "When you plot the **percentage saturation of haemoglobin with O2** on one axis against the **partial pressure of O2 (pO2)** on the other, you don't get a straight line — you get a smooth S-shaped curve. This is the **oxygen dissociation curve**, and it's the tool used to study how factors like pCO2, H+ concentration and temperature shift O2 binding to haemoglobin.\n\n**Why the S-shape, and not a straight line or an evenly-rising curve?** The chapter itself gives you the key fact needed to reason this out: **each haemoglobin molecule can carry a maximum of four molecules of O2** — it has four binding sites, not one. Those four sites don't act independently. Once the first O2 molecule binds, it becomes easier for the second one to bind; once the second binds, the third binds more easily still, and so on. This kind of binding, where each successive binding event makes the next one more favourable, is called cooperative binding.\n\nThat cooperativity is exactly what produces the sigmoid shape. At very low pO2, binding starts slowly — the curve is flat and low, because the first O2 has to bind before the boost to the other sites kicks in. Once a couple of sites are filled, binding accelerates sharply, so the curve rises steeply. And once most of the four sites are filled, there's little room left, so the curve flattens out again near full saturation. A molecule that bound all four O2 molecules completely independently of one another would trace a more gradual curve instead — not the sharp S-shape haemoglobin actually shows."
            },
            {
              "kind": "numerical",
              "id": "96d5aa1c-3c07-483e-baea-d4b8e680ed37",
              "source": "ncert_exercise",
              "source_label": "NCERT 14.8",
              "prompt": "What is the effect of pCO2 on oxygen transport?",
              "answer": "Rising pCO2 makes haemoglobin release O2 (favours dissociation); falling pCO2 makes it hold onto O2 (favours oxyhaemoglobin formation).",
              "solution": "Binding of oxygen to haemoglobin depends mainly on the **partial pressure of O2**, but the chapter names three other factors that interfere with that binding — and **pCO2** is one of them, alongside H+ concentration and temperature.\n\nThe effect runs in a clear direction. **A high pCO2 favours the dissociation of oxyhaemoglobin** — it pushes haemoglobin to let go of its bound oxygen. This is exactly what happens in the **tissues**: pCO2 is high there (the tissues are producing CO2 as a waste product), and along with low pO2, high H+ and higher temperature, that high pCO2 tips the balance toward O2 being released right where the cells need it.\n\nThe reverse happens in the **alveoli**, where pCO2 is low. A low pCO2 — together with high pO2, low H+, and lower temperature — **favours the formation of oxyhaemoglobin**, so haemoglobin picks up O2 there instead of letting it go.\n\nSo the effect of pCO2 on oxygen transport is really a **switching effect**: rising pCO2 turns haemoglobin into an oxygen-releaser (useful at the tissues); falling pCO2 turns it back into an oxygen-loader (useful at the alveoli). This is exactly why the same haemoglobin molecule can load O2 in the lungs and unload it in the tissues — pCO2, along with its partner factors, tells it which job to do, depending on where it is."
            },
            {
              "kind": "numerical",
              "id": "350470c8-ca47-421d-8c63-875274936a10",
              "source": "ncert_exercise",
              "source_label": "NCERT 14.4",
              "prompt": "What are the major transport mechanisms for CO2? Explain.",
              "answer": "Three ways: about 70% as bicarbonate (via carbonic anhydrase), about 20–25% as carbamino-haemoglobin, and about 7% dissolved in plasma.",
              "solution": "CO2 produced by the tissues travels back to the lungs in three different forms, and NCERT gives an exact split for each.\n\n**1. As bicarbonate (~70%) — the biggest share.** RBCs carry a very high concentration of the enzyme **carbonic anhydrase** (a little is also present in plasma), which catalyses this reaction in **both directions**:\n\nCO2 + H2O ⇌ H2CO3 ⇌ HCO3– + H+\n\nAt the **tissues**, pCO2 is high (from catabolism), so CO2 diffuses into the blood and this reaction is driven **forward**, forming HCO3– and H+. At the **alveoli**, pCO2 is low, so the reaction runs in **reverse**, regenerating CO2 and H2O — which is then breathed out. This one enzyme, working both ways depending on where it is, carries the majority of the body's CO2.\n\n**2. As carbamino-haemoglobin (~20–25%).** CO2 binds directly to haemoglobin inside the RBCs. This binding depends on the partial pressure of CO2, and pO2 also affects it: where **pCO2 is high and pO2 is low (the tissues)**, more CO2 binds on; where **pCO2 is low and pO2 is high (the alveoli)**, the CO2 dissociates and is released.\n\n**3. Dissolved in plasma (~7%) — the smallest share.** A small fraction of CO2 simply dissolves directly in the watery part of the blood and travels that way, without needing haemoglobin or a chemical reaction.\n\nTogether these three mechanisms explain how every 100 mL of deoxygenated blood can deliver about 4 mL of CO2 to the alveoli — the bulk of it riding as bicarbonate, a meaningful share on haemoglobin, and a small remainder simply dissolved."
            }
          ]
        },
        {
          "id": "s4-regulation",
          "title": "Regulation, Altitude and Low-Oxygen States",
          "blurb": "Who actually controls your breathing rate, what changes on a hill, and what hypoxia means when the chain breaks.",
          "items": [
            {
              "kind": "numerical",
              "id": "e1df8051-60f1-4422-ab72-a32c495ab667",
              "source": "ncert_exercise",
              "source_label": "NCERT 14.7",
              "prompt": "How is respiration regulated?",
              "answer": "By a rhythm centre in the medulla, moderated by a pneumotaxic centre in the pons, and fed by CO2/H+-sensing receptors — not by oxygen.",
              "solution": "Breathing isn't something you consciously run — it's controlled by the **neural system**, and NCERT lays out exactly which pieces do what.\n\nThe **master control** is the **respiratory rhythm centre**, located in the **medulla** region of the brain. It is **primarily responsible** for maintaining and moderating the respiratory rhythm — this is the one fact to lock in first: rhythm centre = medulla.\n\nSitting just above it, in the **pons** region, is a second centre called the **pneumotaxic centre**. It doesn't generate the rhythm itself — it only **moderates** the rhythm centre. Its signal can **reduce the duration of inspiration**, and through that, it can alter the overall respiratory rate.\n\nBut how does the rhythm centre know when to speed things up or slow them down? It has sensors. Right next to it sits a **chemosensitive area**, which is highly sensitive to **CO2 and hydrogen (H+) ions**. When these build up in the blood, the chemosensitive area is **activated** and signals the rhythm centre to make the adjustment needed to eliminate that extra CO2 — meaning breathing faster or deeper. Backing this up, there are peripheral **receptors on the aortic arch and the carotid artery** that also detect rises in CO2 and H+ and send their own signals to the rhythm centre for remedial action.\n\nOne detail stands out by its absence: **oxygen is not part of this sensing system**. NCERT states plainly that the role of O2 in regulating the respiratory rhythm is **quite insignificant**. So respiration is regulated as a CO2-management system — the medulla runs it, the pons fine-tunes it, and CO2/H+ levels, sensed both centrally and peripherally, are what actually drive the adjustments, not the body's oxygen level."
            },
            {
              "kind": "numerical",
              "id": "022e05dd-d06a-4f99-b23d-4649c9a9a5e5",
              "source": "ncert_exercise",
              "source_label": "NCERT 14.9",
              "prompt": "What happens to the respiratory process in a man going up a hill?",
              "answer": "Lower atmospheric pO2 at altitude means less O2 diffuses in, so breathing rate and depth rise to compensate — and with longer exposure, the body raises RBC production to carry more oxygen per litre of blood.",
              "solution": "At sea level, the atmospheric air a person breathes has a pO2 of about **159 mm Hg** (Table 14.1) — the figure the whole exchange gradient in this chapter is built from. Go up a hill or a mountain, and the **atmospheric pressure itself drops**, so the partial pressure of oxygen in the air being breathed drops well below that sea-level value.\n\nFollow the chain this chapter has already given you. A lower atmospheric pO2 means a smaller pressure gradient pushing O2 from the air into the alveoli, so the **alveolar pO2 also falls**. With a smaller gradient between alveoli and blood, **less oxygen diffuses into the blood** than at sea level, and less oxyhaemoglobin forms.\n\nThe body doesn't just accept this — it reacts, using exactly the regulation machinery from this chapter. The drop in oxygen delivery, along with the blood-gas changes that come with it, is picked up by the **chemosensitive area and the peripheral receptors on the aortic arch and carotid artery**, and the **respiratory rhythm centre in the medulla** responds by **increasing the rate and depth of breathing** — the person breathes faster and harder to pull in more air and partly compensate for the thinner air's lower oxygen content. This is the immediate response, felt within minutes of climbing.\n\nIf a person stays at altitude for longer, the body makes a second, slower adjustment: it increases the **production of red blood cells**. Even though each RBC is still loading oxygen against a lower alveolar pO2, having more RBCs in circulation raises the blood's overall oxygen-carrying capacity, helping make up the shortfall. This longer-term adjustment is why people living at high altitude, or athletes training there, tend to have a higher RBC count than people living at sea level."
            },
            {
              "kind": "numerical",
              "id": "b85c4ac0-5a9b-46a6-ac41-9e196cebd03c",
              "source": "ncert_exercise",
              "source_label": "NCERT 14.12",
              "prompt": "Have you heard about hypoxia? Try to gather information about it, and discuss with your friends.",
              "answer": "Hypoxia is a shortage of oxygen reaching the tissues. It can come from thin air at altitude, damaged or narrowed airways (emphysema, asthma), or reduced blood oxygen-carrying capacity, and shows up as breathlessness, a faster heartbeat, dizziness, or bluish skin.",
              "solution": "This is an open-ended, 'go find out and discuss' question, but everything you need to start the discussion is already sitting in this chapter's own facts about how O2 gets from air to tissue — hypoxia is simply what happens when that chain breaks down somewhere.\n\n**What it is:** hypoxia is a condition where the tissues of the body don't get enough oxygen to meet their needs. It isn't one single disease — it's the end result of several different problems, and this chapter has already introduced most of them:\n\n- **Low atmospheric oxygen (altitude hypoxia):** as covered in the previous question, climbing to altitude lowers the pO2 of the air itself, so less oxygen is available to diffuse into the blood in the first place.\n- **Airway and alveolar problems:** this chapter's own disorders — **asthma** (inflamed, narrowed bronchi and bronchioles restricting airflow) and **emphysema** (damaged alveolar walls, which decreases the respiratory surface available for diffusion) — both reduce how much oxygen can actually cross into the blood, even when the air being breathed in is perfectly normal.\n- **Reduced oxygen-carrying capacity of the blood:** since about 97% of O2 is carried bound to haemoglobin, anything that reduces the amount or effectiveness of haemoglobin (for instance, a low red blood cell count) cuts down how much oxygen the blood can deliver, even if the lungs themselves are working fine.\n\n**How it shows up:** because the body senses CO2 rather than O2 directly (as the regulation section of this chapter explains), hypoxia doesn't always announce itself through breathing rate alone. Common effects include breathlessness, a faster heart rate as the body tries to circulate the limited oxygen it has more quickly, dizziness or fatigue as the brain (a heavy oxygen user) is affected early, and in more severe cases a bluish discolouration of the skin and lips.\n\nDiscuss with your friends how many separate points in this chapter's chain — the airway, the alveoli, the diffusion membrane, the blood's carrying capacity, and the atmospheric pO2 itself — could each independently cause hypoxia if something went wrong with it. That's really the point of the question: hypoxia isn't caused by one mechanism, it's what you get whenever any single link in the oxygen-delivery chain fails."
            }
          ]
        }
      ]
    }
  ]
};
