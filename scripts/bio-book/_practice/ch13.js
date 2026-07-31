'use strict';
// Class 11 Biology — Ch.13 — "Practice — NCERT Exercises" page.
// SNAPSHOT of the live, already-inserted page (regenerated to fix a
// non-idempotency bug: the original module called uuid() at require() time,
// so every re-save looked like a full block removal+addition to book-writer's
// content-loss guard. This module carries the exact ids currently live in
// Mongo, so re-running insert_practice_pages.js against it is a true no-op.
module.exports = {
  "slug": "ch13-practice-ncert-exercises",
  "title": "Practice — NCERT Exercises",
  "subtitle": "All 10 NCERT textbook exercises for the chapter, grouped into 5 revision themes with full worked solutions.",
  "page_type": "lesson",
  "tags": [
    "ncert-exercises",
    "practice"
  ],
  "blocks": [
    {
      "id": "952fe002-3da3-47bf-993c-61ef3e4ffc04",
      "type": "image",
      "order": 0,
      "src": "",
      "alt": "A germinating seedling's root tip on the left showing its three growth zones as soft glowing bands, and on the right a ripening fruit beside a leaf with visibly closed stomata",
      "caption": "",
      "width": "full",
      "aspect_ratio": "16:5",
      "generation_prompt": "Scientific textbook illustration, wide landscape banner, flat 2D educational diagram on a dark background (#0a0a0a near-black). Left half: a young seedling's root tip in longitudinal section, showing three softly glowing bands running from the tip toward the base, representing the meristematic, elongation and maturation zones of growth. Right half: a single ripening fruit on a short stem beside one leaf with visibly closed stomata, with a faint soft glow drifting from the fruit suggesting a released gas. Clean white outlines, muted natural greens, soft tans and warm amber tones, biologically accurate schematic proportions, no photorealism, no cartoon, matches standard biology textbook illustration conventions. No text, no labels, no leader lines, no pointer lines of any kind anywhere in the image."
    },
    {
      "id": "234c74e7-c82d-4d7a-8e69-5adac035302f",
      "type": "text",
      "order": 1,
      "markdown": "You've read the chapter — now drill it. Below are **all 10 NCERT exercises** for *Plant Growth and Development*, pulled out of the textbook's running order and re-sorted into five revision themes: the core vocabulary, how growth is actually measured and plotted, the five plant growth regulators, matching each hormone to its job, and — for two exercises that reach into photoperiodism, a topic this particular chapter doesn't cover — an honestly flagged bridge answer.\n\nTry to answer each one in your head (or on paper) before you open the solution. The worked answer is written to *teach* the whole idea, not just tick the box — so even a question you get right is worth reading through."
    },
    {
      "id": "68227449-7eca-496a-aa02-bc29d2ffa3d5",
      "type": "practice_bank",
      "order": 2,
      "title": "NCERT Exercises 13.1–13.10",
      "intro": "Every end-of-chapter exercise, regrouped into five revision themes. Each carries a one-line answer for a quick self-check and a full worked solution — including two exercises that reach into photoperiodism, a topic this chapter's own pages don't cover, clearly flagged where that happens.",
      "sections": [
        {
          "id": "s1-vocabulary",
          "title": "Defining Growth, Differentiation & Development",
          "blurb": "The core vocabulary this whole chapter runs on — and why growth and differentiation in a plant are both called 'open'.",
          "items": [
            {
              "kind": "numerical",
              "id": "091852ed-828c-4051-8d28-f64a7ee8f181",
              "source": "ncert_exercise",
              "source_label": "NCERT 13.1",
              "prompt": "Define growth, differentiation, development, dedifferentiation,\nredifferentiation, determinate growth, meristem and growth rate.",
              "answer": "Eight definitions, in the plant's own order: growth → differentiation → development, then dedifferentiation/redifferentiation, then determinate growth, meristem, and growth rate.",
              "solution": "Take these one at a time, because trying to memorise all eight together is how students mix them up.\n\n**Growth** — an irreversible, permanent increase in size of an organ, or its parts, or even a single cell. It is accompanied by both anabolic (building up) and catabolic (breaking down) metabolic processes, and it happens at the expense of energy. A leaf expanding is growth; a dry piece of wood swelling in water is not, because that swelling is reversible.\n\n**Differentiation** — the maturing of a cell, so that it takes on a specific function. Cells derived from a meristem differentiate, changing structurally in both their cell wall and their protoplasm. The clearest example: a cell becoming a tracheary element loses its protoplasm completely and builds a strong, elastic, lignocellulosic secondary wall so it can carry water under extreme tension.\n\n**Development** — all the changes an organism goes through across its whole life cycle, from the germination of the seed to senescence. Broadly, development is the sum of growth and differentiation.\n\n**Dedifferentiation** — a living, already-differentiated cell that has lost the capacity to divide regains that capacity under certain conditions. The example to remember: fully differentiated parenchyma cells dedifferentiating to form the interfascicular cambium and the cork cambium.\n\n**Redifferentiation** — once a dedifferentiated meristem (like the cork cambium above) starts dividing again, its own daughter cells eventually lose the capacity to divide once more and mature to perform a specific function. That second maturing is redifferentiation.\n\n**Determinate growth** — growth that comes to a stop once the organ or structure reaches its mature, final size — a leaf, a flower, or a fruit each stop growing once they're done. This is the opposite of what most of the plant body does, which grows indeterminately (with no fixed end point) because of its meristems.\n\n**Meristem** — a region of cells, located at fixed places in the plant body (the root apex, the shoot apex, and the cambium), whose cells retain the capacity to divide and to self-perpetuate. New cells are constantly added to the plant body by a meristem's activity, which is why plant growth is called the open form of growth.\n\n**Growth rate** — the increased growth per unit time. Because it's a 'per unit time' quantity, it can be written mathematically — arithmetically as Lt = L0 + rt, or geometrically/exponentially as W1 = W0 e^{rt}."
            },
            {
              "kind": "numerical",
              "id": "da91cc60-3f07-41cf-8988-3942dfb81ab2",
              "source": "ncert_exercise",
              "source_label": "NCERT 13.6",
              "prompt": "'Both growth and differentiation in higher plants are open'. Comment.",
              "answer": "Growth is open because meristems keep adding cells for life (indeterminate growth); differentiation is open because cells from the same meristem can mature into different final structures purely by position.",
              "solution": "'Open' here means neither process is fixed or closed off — both stay flexible for the whole life of the plant, and both depend on the meristems.\n\n**Growth is open** because plant growth is generally indeterminate — plants retain the capacity for unlimited growth throughout their life. This is possible only because meristems sit at certain locations in the plant body (root apex, shoot apex, cambium) and their cells can divide and self-perpetuate. New cells are always being added to the plant body by the activity of the meristem, and this continuous, never-finished addition of cells is exactly what makes growth 'open' — there's no fixed final size the plant is building toward.\n\n**Differentiation is open** in a related but distinct sense. Cells or tissues arising out of the very same meristem do not all mature into the same final structure — their structure at maturity is decided by the position of the cell within the organ, not by some fixed programme every cell follows identically. The chapter's own example: cells positioned away from the root apical meristem differentiate into root-cap cells, while cells that get pushed out to the periphery mature instead as epidermis. Same originating meristem, two completely different fates, decided purely by where each cell ends up.\n\nPut together: growth in higher plants never finishes because the meristem never stops adding cells, and differentiation never settles into one fixed pattern because a cell's final identity depends on its position, not a rigid blueprint. That flexibility, in both processes, is what 'open' means."
            }
          ]
        },
        {
          "id": "s2-measuring-growth",
          "title": "Measuring Growth — Parameters, Rates & Curves",
          "blurb": "Why one measurement never captures growth everywhere, and the two growth patterns — arithmetic and geometric — with their formulas and curves.",
          "items": [
            {
              "kind": "numerical",
              "id": "ab2ce8b4-209c-4721-b9a8-945db9181003",
              "source": "ncert_exercise",
              "source_label": "NCERT 13.2",
              "prompt": "Why is not any one parameter good enough to demonstrate growth\nthroughout the life of a flowering plant?",
              "answer": "Because different parts and stages of the plant express growth through different measures — cell number, cell size, length, or area — so no single yardstick fits every case.",
              "solution": "A flowering plant doesn't grow the same way everywhere, so it can't be measured the same way everywhere either. Growth is fundamentally a rise in protoplasm, and protoplasm itself is very hard to measure directly — which is why biologists always fall back on some parameter that rises roughly in step with it: fresh weight, dry weight, length, area, volume, or cell number.\n\nThe trouble is that which parameter actually reflects growth changes completely depending on which part of the plant, and which stage, you're looking at. A single maize root apical meristem can add more than 17,500 new cells every hour — there, growth is best captured by counting cell number. A watermelon cell, on the other hand, can swell up to 3,50,000 times its original size — there, cell number tells you almost nothing, and growth has to be captured by the increase in cell size instead. Elsewhere again, the growth of a pollen tube is best measured by its length, while growth in a flat, dorsiventral leaf is best measured by its increase in surface area.\n\nSo across the whole life of one flowering plant — root tip, fruit, pollen tube, leaf — no single parameter stays useful throughout. Pick length and you lose the fruit; pick cell number and you lose the leaf. That's exactly why NCERT insists you choose the parameter that suits the specific growth process you're examining, rather than trusting one measurement to describe growth everywhere."
            },
            {
              "kind": "numerical",
              "id": "545eee48-fd0e-47e5-a192-0856142e9210",
              "source": "ncert_exercise",
              "source_label": "NCERT 13.3",
              "prompt": "Describe briefly:\n(a) Arithmetic growth\n(b) Geometric growth\n(c) Sigmoid growth curve\n(d) Absolute and relative growth rates",
              "answer": "(a) constant-rate growth, Lt = L0 + rt (b) both daughters keep dividing, W1 = W0 e^{rt} (c) the S-shaped lag→log→stationary curve (d) total growth per unit time vs. growth per unit time relative to starting size.",
              "solution": "**(a) Arithmetic growth.** After a mitotic cell division, only one of the two daughter cells continues to divide — the other differentiates and matures. The simplest real example is a root elongating at a constant rate. Plot the length of the organ against time and you get a straight, linear curve. In symbols: **Lt = L0 + rt**, where Lt is the length at time t, L0 is the length at time zero, and r is the growth rate (the elongation per unit time).\n\n**(b) Geometric growth.** Here, after mitotic division, both progeny cells retain the ability to divide, and both go on doing so. Growth starts slow (the lag phase), then speeds up sharply into an exponential rate (the log or exponential phase); with a limited nutrient supply, it eventually slows into a stationary phase. The exponential growth is written as **W1 = W0 e^{rt}**, where W1 is the final size (weight, height, number, etc.), W0 is the initial size, r is the growth rate, t is the time of growth, and e is the base of natural logarithms. Here r is called the relative growth rate, or the efficiency index — the plant's ability to produce new plant material.\n\n**(c) Sigmoid growth curve.** Plot geometric growth against time and you don't get a straight line — you get an S-shaped curve, running through the lag phase, the log/exponential phase, and finally the stationary phase. This sigmoid curve is the characteristic curve of a living organism growing in a natural environment, and it's typical for all the cells, tissues, and organs of a plant.\n\n**(d) Absolute and relative growth rates.** These are two different ways of comparing how fast living systems grow. The absolute growth rate is simply the measurement and comparison of total growth per unit time — how much was added, full stop. The relative growth rate is the growth of the system per unit time expressed on a common basis, such as per unit of the initial size. NCERT's own illustration: two leaves, A and B, start at different sizes but both add the same 5 cm² of area in the same time. Measured absolutely, they grew equally. But relative to how big each one started, the smaller leaf shows a much higher relative growth rate — the same 5 cm² is a bigger jump for a leaf that started small."
            }
          ]
        },
        {
          "id": "s3-five-pgrs",
          "title": "The Five Plant Growth Regulators",
          "blurb": "The five plant growth regulators, how each was discovered, and why abscisic acid earns the name 'stress hormone'.",
          "items": [
            {
              "kind": "numerical",
              "id": "0b751ed8-c520-414c-a6ed-57e76d64e8af",
              "source": "ncert_exercise",
              "source_label": "NCERT 13.4",
              "prompt": "List five main groups of natural plant growth regulators. Write a note\non discovery, physiological functions and agricultural/horticultural\napplications of any one of them.",
              "answer": "Auxins, gibberellins, cytokinins, ethylene, abscisic acid — note below is written on auxin.",
              "solution": "The five main groups of natural plant growth regulators are **auxins, gibberellins, cytokinins, ethylene**, and **abscisic acid**.\n\nHere's the note on **auxin**, since it has the richest discovery story and the widest set of applications.\n\n**Discovery.** It began with Charles Darwin and his son Francis Darwin, who noticed that the coleoptiles of canary grass bent towards a light source coming from one side — a growth response called phototropism. Through a series of experiments, they concluded that the tip of the coleoptile was the site of a transmittable influence that caused the whole coleoptile to bend. F.W. Went later isolated the actual chemical — auxin — from the tips of oat coleoptiles.\n\n**Physiological functions.** Auxins are generally produced by the growing apices of the stems and roots, from where they migrate to where they act. Natural auxins include IAA (indole-3-acetic acid) and IBA (indole butyric acid); NAA (naphthalene acetic acid) and 2,4-D are synthetic. Auxins initiate rooting in stem cuttings, promote flowering (e.g. in pineapples), prevent fruit and leaf drop at early stages while promoting the abscission of older mature leaves and fruits, induce parthenocarpy (fruit without fertilisation, e.g. in tomatoes), control xylem differentiation, and help in cell division. Auxin produced at the apical bud is also what causes apical dominance — the phenomenon where the growing tip suppresses the growth of the lateral (axillary) buds below it.\n\n**Agricultural/horticultural applications.** Because auxins initiate rooting, they are used extensively in plant propagation — dipping a cutting in auxin before planting it. 2,4-D is widely used as a herbicide: it kills dicotyledonous weeds but does not affect mature monocotyledonous plants, which is exactly how gardeners prepare weed-free lawns. Auxin-induced parthenocarpy is used to get seedless tomatoes. And because removing the apical bud (decapitation) removes the source of auxin and ends apical dominance, this principle is deliberately used in tea plantations and hedge-making to force out bushy, branching growth."
            },
            {
              "kind": "numerical",
              "id": "a8462e00-0bc5-44c9-bd7b-4285af570eb5",
              "source": "ncert_exercise",
              "source_label": "NCERT 13.5",
              "prompt": "Why is abscisic acid also known as stress hormone?",
              "answer": "Because ABA stimulates stomatal closure (cutting water loss) and raises the plant's stress tolerance, and induces the dormancy that lets seeds survive desiccation.",
              "solution": "Abscisic acid earns the name stress hormone because of what it does under exactly the conditions that stress a plant. ABA acts as a general plant growth inhibitor and an inhibitor of plant metabolism — it slows the plant down rather than pushing it forward. Its most direct stress-fighting action is that it stimulates the closure of stomata, the tiny pores on a leaf's surface. Closing the stomata cuts down water loss through transpiration, and that is precisely what increases the plant's tolerance to various kinds of stresses — most obviously drought, where saving water is the difference between surviving and wilting.\n\nABA's role goes further than just the leaf. It plays an important part in seed development, maturation and dormancy, and by inducing dormancy, it helps seeds withstand desiccation (drying out) and other conditions unfavourable for growth — again, protecting the plant (or its seeds) against a hostile environment rather than promoting growth in a friendly one.\n\nSo the 'stress hormone' label isn't a separate function tacked on — it's a direct description of ABA's actual job: shutting things down (stomata, germination, growth) precisely when the plant needs to conserve resources and endure stress, in most situations acting as the antagonist to the growth-promoting gibberellins."
            }
          ]
        },
        {
          "id": "s4-match-the-hormone",
          "title": "Match the Hormone to the Job",
          "blurb": "Given a job, pick the right hormone — and predict what happens when a hormone is added, missing, or mixed into the wrong batch.",
          "items": [
            {
              "kind": "numerical",
              "id": "17b1419d-a0dd-4866-a376-a55242538dea",
              "source": "ncert_exercise",
              "source_label": "NCERT 13.8",
              "prompt": "Which one of the plant growth regulators would you use if you are\nasked to:\n(a) induce rooting in a twig\n(b) quickly ripen a fruit\n(c) delay leaf senescence\n(d) induce growth in axillary buds\n(e) 'bolt' a rosette plant\n(f) induce immediate stomatal closure in leaves.",
              "answer": "(a) auxin (b) ethylene (c) cytokinin (d) cytokinin (e) gibberellin (f) abscisic acid.",
              "solution": "**(a) Induce rooting in a twig → Auxin.** Auxins initiate rooting in stem cuttings — this is the whole basis of using rooting hormone in plant propagation.\n\n**(b) Quickly ripen a fruit → Ethylene.** Ethylene is highly effective in fruit ripening; the commercial source used to apply it is ethephon, which is absorbed and transported within the plant and releases ethylene slowly, hastening ripening in fruits like tomatoes and apples.\n\n**(c) Delay leaf senescence → Cytokinin.** Cytokinins promote nutrient mobilisation, which helps delay the senescence (ageing) of leaves — nutrients are pulled towards the leaf, keeping it green and alive longer.\n\n**(d) Induce growth in axillary buds → Cytokinin.** Cytokinins help overcome apical dominance — the opposite job to auxin, which is what causes it. Applying cytokinin to a lateral bud frees it to grow out.\n\n**(e) 'Bolt' a rosette plant → Gibberellin.** Gibberellins promote bolting — internode elongation just prior to flowering — in beet, cabbages and other plants with a rosette growth habit.\n\n**(f) Induce immediate stomatal closure in leaves → Abscisic acid.** ABA stimulates the closure of stomata, which is exactly why it's called the stress hormone — closing stomata cuts water loss immediately."
            },
            {
              "kind": "numerical",
              "id": "0472cca1-0bd0-4c6d-83ff-d4b8f5780376",
              "source": "ncert_exercise",
              "source_label": "NCERT 13.10",
              "prompt": "What would be expected to happen if:\n(a) GA3 is applied to rice seedlings\n(b) dividing cells stop differentiating\n(c) a rotten fruit gets mixed with unripe fruits\n(d) you forget to add cytokinin to the culture medium.",
              "answer": "(a) abnormal tall, spindly 'foolish-seedling' growth (b) an undifferentiated, disorganised mass of cells instead of a normal plant body (c) the rotten fruit's ethylene hastens ripening in the unripe fruits too (d) the callus fails to divide/proliferate properly even with auxin present.",
              "solution": "**(a) If GA3 is applied to rice seedlings:** the seedlings would grow abnormally tall and spindly — exactly the 'bakanae' (foolish seedling) symptoms that first revealed gibberellins. That disease was originally caused by a fungus (Gibberella fujikuroi) producing gibberellic acid in rice seedlings, and applying GA3 directly reproduces the same excessive-elongation response.\n\n**(b) If dividing cells stop differentiating:** the plant would end up as an undifferentiated, disorganised mass of proliferating cells rather than a properly built plant body. Differentiation is what turns a meristem's dividing cells into cells with a specific job — root-cap cells, epidermis, tracheary elements, and so on. Without it, cell division would carry on, but none of those functional tissues would ever form.\n\n**(c) If a rotten fruit gets mixed with unripe fruits:** the unripe fruits would start ripening faster than they otherwise would. A ripening (and rotting/senescing) fruit produces ethylene in large amounts, and because ethylene is a gas, it diffuses into the surrounding air and reaches the nearby unripe fruits, hastening their ripening too — the same reason keeping one ripe fruit in a basket ripens the rest of the batch.\n\n**(d) If you forget to add cytokinin to the culture medium:** the cells would fail to divide and proliferate properly, even with auxin present. This is exactly what F. Skoog found with tobacco stem segments — the callus (a mass of undifferentiated, proliferating cells) only multiplied when the medium had auxin plus a source of cytokinin activity (vascular tissue extract, yeast extract, coconut milk, or DNA). Auxin alone was not enough."
            }
          ]
        },
        {
          "id": "s5-beyond-chapter",
          "title": "Beyond This Chapter — Photoperiodism",
          "blurb": "Two NCERT exercises that reach into photoperiodism, a topic this chapter's own pages don't cover — answered from accurate general biology, and clearly flagged.",
          "items": [
            {
              "kind": "numerical",
              "id": "d5fe3c5e-ff2a-47e4-8db5-4edd84326ee0",
              "source": "ncert_exercise",
              "source_label": "NCERT 13.7",
              "prompt": "'Both a short day plant and a long day plant can produce can flower\nsimultaneously in a given place'. Explain.",
              "answer": "Not covered on this chapter's own pages — flagged below. Short/long-day status depends on each species' own critical day length, so both can be satisfied by the same actual day length.",
              "solution": "**A flag before the answer:** this question is genuinely about photoperiodism, and this chapter's own pages (which cover growth, differentiation, development, and the five plant growth regulators) don't include that topic — NCERT's rationalised edition trims the photoperiodism section out of this chapter's running text even though this exercise from the original chapter was kept. So the explanation below draws on standard, accurate NCERT-level biology knowledge of photoperiodism rather than on anything taught on this chapter's own pages — treat it as a bridge to a related topic, not as this chapter's content.\n\nThe key idea is that 'short-day plant' and 'long-day plant' are not about some universal fixed number of daylight hours. Each plant species has its own **critical photoperiod (critical day length)** — a species-specific duration of light exposure. A **short-day plant (SDP)** flowers when the day length falls **below** its own critical value; a **long-day plant (LDP)** flowers when the day length rises **above** its own critical value.\n\nBecause each species sets its own critical value independently, it's entirely possible for an SDP's critical day length to be *longer* than an LDP's critical day length. Say an SDP's critical day length is 14 hours (it flowers whenever the day is shorter than 14 hours) and an LDP's critical day length is 12 hours (it flowers whenever the day is longer than 12 hours). On an actual day length of 13 hours, both conditions are satisfied at once: 13 hours is below the SDP's 14-hour threshold, and it is also above the LDP's 12-hour threshold. So at the very same place, on the very same day, both plants can flower simultaneously — not because 'short' and 'long' have stopped meaning anything, but because each is measured against its own, different critical value."
            },
            {
              "kind": "numerical",
              "id": "d45283c5-762f-42e4-9ad9-8d8b62baba69",
              "source": "ncert_exercise",
              "source_label": "NCERT 13.9",
              "prompt": "Would a defoliated plant respond to photoperiodic cycle? Why?",
              "answer": "No — flagged below. The leaf is where the photoperiod signal is perceived, so a plant with no leaves has nothing left to sense day length with.",
              "solution": "**Flag, as with the previous question:** this is a photoperiodism question, and photoperiodism itself is not covered on this chapter's own pages — the answer below relies on standard, accurate biology knowledge of the topic rather than this chapter's content.\n\nNo, a defoliated plant (one with its leaves removed) would not respond to the photoperiodic cycle. The reason comes down to where the photoperiod signal is actually detected: it is the **leaf**, not the shoot tip or the flower-forming region, that perceives the duration of light and darkness, using light-sensitive pigments in its cells. The leaf then generates the signal that eventually triggers flowering elsewhere in the plant.\n\nIf the plant has no leaves, it has nothing left to perceive the photoperiod with — the sensing organ is gone. So even if a defoliated plant is kept under exactly the correct light-dark cycle for its species, it will not respond to that cycle, because the part of the plant responsible for reading day length is no longer there to read it."
            }
          ]
        }
      ]
    }
  ]
};
