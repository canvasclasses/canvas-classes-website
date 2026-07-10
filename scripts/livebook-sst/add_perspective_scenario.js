'use strict';
// First perspective_scenario instance (founder-approved design, 2026-07-08) — a
// real documented Indian policy debate, not an invented hypothetical. See
// _agents/state/SOCIAL_SCIENCE_BOOK_BUILD.md "Engagement retrofit" section.
// Facts verified via web search before writing (Western Ghats Ecology Expert
// Panel / "Gadgil Committee" constituted 4 Mar 2010, report submitted 31 Aug
// 2011; High-Level Working Group / "Kasturirangan Committee" constituted 2012,
// 2013 report recommending ~37% as Ecologically Sensitive Area).
const { v4: uuid } = require('uuid');
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

async function main() {
  await bw.withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'landforms-and-disasters' });
    if (!page) throw new Error('page not found');
    const idx = page.blocks.findIndex((b) => b.id === 'add27987-6a0e-45b3-a43b-feb2da819e9f');
    if (idx === -1) throw new Error('anchor callout not found');

    const block = {
      id: uuid(),
      type: 'perspective_scenario',
      order: 0,
      title: 'How Much of the Western Ghats Should Be Protected?',
      role_frame: "You're advising the Ministry of Environment, Forest and Climate Change on how strictly to regulate mining, quarrying and construction across the ecologically fragile Western Ghats — the same kind of hill terrain where unplanned development has been linked to worse landslides and floods.",
      event_context: "In 2010, the Ministry set up an expert panel — the Western Ghats Ecology Expert Panel — chaired by ecologist Madhav Gadgil, to study this 1,600-km mountain range, a UNESCO World Heritage Site spanning six states. Its report, submitted in 2011, recommended declaring the large majority of the range an Ecologically Sensitive Area, with strict limits on mining, quarrying and construction. Several state governments pushed back, worried about the impact on farmers, plantation owners and local industry. In 2012, the government set up a second panel — the High-Level Working Group, chaired by space scientist K. Kasturirangan — to reconsider it. Its 2013 report proposed protecting a much smaller core: about 37% of the range, distinguishing land already settled or farmed from untouched natural forest. Neither report has been fully implemented to this day.",
      source_note: "Grounded in two real Government of India expert panel reports: the Western Ghats Ecology Expert Panel (Gadgil Committee, constituted 2010, report submitted 2011) and the High-Level Working Group on Western Ghats (Kasturirangan Committee, constituted 2012, report submitted 2013).",
      prompt: 'Which approach would you recommend?',
      options: [
        {
          id: uuid(),
          label: 'Go with the Gadgil approach — protect nearly the whole range',
          real_position: "The Western Ghats Ecology Expert Panel's actual 2011 recommendation",
          perspective: "The Gadgil panel argued that the Western Ghats functions as one connected ecological system — protecting only patches of it lets damage in unprotected zones (quarrying, deforestation) still destabilise the slopes and water systems of protected zones nearby. Its report also pushed decision-making down to gram sabhas (village councils) rather than state capitals, reasoning that local communities living on this land have the clearest stake in protecting it. The tradeoff: this was the hardest recommendation for state governments and industries to accept, and several states rejected it as too restrictive for local livelihoods.",
        },
        {
          id: uuid(),
          label: 'Go with the Kasturirangan approach — protect a smaller, clearly defined core',
          real_position: "The High-Level Working Group's actual 2013 recommendation",
          perspective: "The Kasturirangan committee split the region into 'natural landscape' (forests, wildlife corridors — strictly protected) and 'cultural landscape' (existing farms, plantations, towns — allowed to continue, with some rules). Its reasoning: a plan only works if it can actually be implemented and accepted, and a smaller, clearly-mapped protected zone is easier to enforce than a near-total one that provokes state governments to ignore it entirely. The tradeoff: environmentalists, including Gadgil himself, argued this leaves too much fragile land open to exactly the quarrying and construction that raises landslide and flood risk.",
        },
        {
          id: uuid(),
          label: 'Delay full protection and negotiate exemptions state-by-state first',
          real_position: 'The position several state governments and local industry groups actually took',
          perspective: "Several state governments argued that neither report properly accounted for the people already living and working on this land — farmers, plantation owners, quarry workers — and pushed for more consultation and exemptions before any rules were finalised. This protects livelihoods in the short term and can build local buy-in, since rules imposed without local support are often ignored anyway. The tradeoff: both scientific panels warned that further delay means more mining, deforestation and construction happen in fragile zones in the meantime — activity later blamed, by Gadgil, for worsening Kerala's severe 2018 floods and landslides.",
        },
      ],
      synthesis: "Neither report has been fully adopted more than a decade later — this isn't a case where one side was right and the debate simply ended. After Kerala's 2018 floods, Gadgil argued that the disaster's scale would have been smaller had his committee's recommendations been followed — a claim he made, not a settled scientific verdict. What's not disputed is that all three positions above are trying to solve a genuinely hard problem: protecting land that must absorb monsoon rain safely, while also being home to millions of people who farm and work on it. Real environment ministries face exactly this tradeoff today, on this exact mountain range.",
    };

    const updated = [...page.blocks.slice(0, idx + 1), block, ...page.blocks.slice(idx + 1)]
      .map((b, i) => ({ ...b, order: i }));
    const res = await bw.savePage(db, { slug: 'landforms-and-disasters' }, updated, {
      author: 'agent',
      summary: 'Added first perspective_scenario instance (Western Ghats Gadgil vs Kasturirangan) — founder-designed engagement mechanic',
    });
    console.log(`✓ landforms-and-disasters — inserted perspective_scenario (v${res.version})`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
