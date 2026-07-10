// Consolidate the Class 12 Chemical Kinetics chapter (ch#3 of ncert-simplified-12)
// from 38 pages down to 15 (14 content + the practice bank), per the founder-
// approved merge map (2026-06-27). LOSSLESS: each merged page = the first source
// page's hero, then that page's content, then every OTHER source page as a
// labelled section (its own hero becomes a section image, all its content + its
// quiz checkpoint kept). Nothing is removed from the keeper page, so the
// book-writer content-loss guard sees zero removed blocks. The non-keeper source
// pages are SOFT-DELETED (their content now also lives in the keeper). Finally
// the surviving pages are renumbered 1–15 and the chapter page_ids rebuilt.
// Dry-run by default; pass --apply to write. All writes via book-writer.
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const bw = require('../lib/book-writer');

const APPLY = process.argv.includes('--apply');

// Each merge: page_number, slug + title + subtitle for the merged page, and the
// ORDERED source slugs. sources[0] is the keeper (its _id survives).
const MERGES = [
  { n: 1, slug: 'chemical-kinetics-intro', title: 'Introduction to Chemical Kinetics',
    subtitle: 'What chemical kinetics studies, and why a reaction being spontaneous tells you nothing about how fast it goes.',
    sources: ['chemical-kinetics-intro', 'the-cow-problem'] },
  { n: 2, slug: 'rate-of-a-reaction', title: 'Rate of a Reaction',
    subtitle: 'Fast vs slow reactions, average and instantaneous rate, and how rate ties to stoichiometry.',
    sources: ['fast-and-slow-reactions', 'average-and-instantaneous-rate', 'rate-and-stoichiometry'] },
  { n: 3, slug: 'factors-affecting-rate', title: 'Factors Affecting Rate & Monitoring a Reaction',
    subtitle: 'Concentration, temperature, surface area and catalyst — and how a reaction’s progress is actually measured.',
    sources: ['factors-affecting-rate', 'monitoring-a-reaction'] },
  { n: 4, slug: 'rate-law-and-order', title: 'Rate Law, Order & the Rate Constant',
    subtitle: 'The experimental rate law, the order of a reaction, the units of k, and the orders you meet in real reactions.',
    sources: ['rate-law-and-order', 'units-of-rate-constant', 'rate-laws-in-the-wild'] },
  { n: 5, slug: 'elementary-and-complex-reactions', title: 'Elementary vs Complex Reactions; Molecularity vs Order',
    subtitle: 'Elementary steps and overall reactions, and the difference between molecularity and order.',
    sources: ['elementary-and-complex-reactions', 'molecularity-vs-order'] },
  { n: 6, slug: 'zero-order-reactions', title: 'Zero-Order Reactions',
    subtitle: 'The integrated rate law, half-life and graphs of a zero-order reaction.',
    sources: ['zero-order-reactions'] },
  { n: 7, slug: 'first-order-reactions', title: 'First-Order Reactions & Half-Life',
    subtitle: 'The first-order integrated rate law, its constant half-life, and the exam shortcuts.',
    sources: ['first-order-reactions', 'first-order-half-life-and-shortcuts', 'first-order-practice'] },
  { n: 8, slug: 'first-order-in-practice', title: 'First-Order Reactions in Practice',
    subtitle: 'Gas-phase first-order reactions and the classic monitored systems — H₂O₂, ester hydrolysis, cane-sugar inversion and bacterial growth.',
    sources: ['gas-phase-first-order', 'monitoring-h2o2-decomposition', 'pseudo-first-order-and-ester-hydrolysis', 'inversion-of-cane-sugar', 'bacterial-growth-kinetics'] },
  { n: 9, slug: 'second-order-reactions', title: 'Second-Order Reactions & Determining Order',
    subtitle: 'The second-order rate law, and how to find the order of a reaction from half-life data.',
    sources: ['second-order-reactions', 'order-from-half-life'] },
  { n: 10, slug: 'reaction-mechanisms', title: 'Reaction Mechanisms',
    subtitle: 'How a reaction really happens — elementary steps, reversible, parallel and consecutive reactions.',
    sources: ['reaction-mechanisms-and-types', 'reversible-opposing-reactions', 'parallel-reactions', 'consecutive-reactions'] },
  { n: 11, slug: 'deriving-rate-laws', title: 'Deriving Rate Laws: RDS & Steady-State',
    subtitle: 'Getting the rate law from a mechanism using the rate-determining step and the steady-state approximation.',
    sources: ['rate-law-from-a-mechanism', 'steady-state-approximation'] },
  { n: 12, slug: 'temperature-and-arrhenius', title: 'Temperature Dependence & the Arrhenius Equation',
    subtitle: 'Why heat speeds reactions up — the Arrhenius equation, its graphs, the temperature coefficient, and the energy profile.',
    sources: ['effect-of-temperature-arrhenius', 'arrhenius-graphs-and-temperature-coefficient', 'activation-energy-and-energy-profile'] },
  { n: 13, slug: 'collision-and-transition-state', title: 'Collision Theory & Transition State',
    subtitle: 'The collision-theory picture of rate, and the transition state — plus kinetic vs thermodynamic control.',
    sources: ['collision-theory', 'transition-state-and-kinetic-vs-thermodynamic'] },
  { n: 14, slug: 'catalysis-and-enzymes', title: 'Catalysis, Enzymes & Chapter Mastery',
    subtitle: 'How catalysts and enzymes work, and a final mastery sweep of the whole chapter.',
    sources: ['catalysis', 'enzyme-catalysis', 'chapter-mastery-chemical-kinetics'] },
];
const PRACTICE_SLUG = 'chemical-kinetics-practice';
const PRACTICE_PAGE_NUMBER = 15;

const firstImageIndex = (blocks) => blocks.findIndex((b) => b.type === 'image');

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const booksCol = db.collection('books');
  const pagesCol = db.collection('book_pages');
  const book = await booksCol.findOne({ slug: 'ncert-simplified-12' });
  const ci = book.chapters.findIndex((c) => c.number === 3);
  console.log(APPLY ? '=== APPLY (book-writer) ===' : '=== DRY-RUN ===');

  // load all ch3 pages by slug
  const allPages = await pagesCol.find({ book_id: String(book._id), chapter_number: 3 }).toArray();
  const bySlug = Object.fromEntries(allPages.map((p) => [p.slug, p]));

  const newPageIds = [];
  const toSoftDelete = [];

  // Clear the 1–38 page_number range first (unique index on
  // book_id+chapter_number+page_number means renumbering keepers into 1–15 would
  // otherwise collide with not-yet-deleted source pages). Bump everything +1000;
  // keepers then claim 1–15, soft-deleted pages stay parked at 1000+.
  if (APPLY) {
    await pagesCol.updateMany({ book_id: String(book._id), chapter_number: 3 }, [{ $set: { page_number: { $add: ['$page_number', 1000] } } }]);
  }

  for (const m of MERGES) {
    const srcPages = m.sources.map((s) => bySlug[s]);
    const missing = m.sources.filter((s) => !bySlug[s]);
    if (missing.length) { console.log(`  ! merge p${m.n} missing sources: ${missing.join(', ')}`); continue; }
    const keeper = srcPages[0];

    let mergedBlocks;
    if (m.sources.length === 1) {
      mergedBlocks = (keeper.blocks || []).map((b) => ({ ...b }));
    } else {
      mergedBlocks = [];
      srcPages.forEach((p, i) => {
        const blocks = [...(p.blocks || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        const heroIdx = firstImageIndex(blocks);
        if (i === 0) {
          // keeper: hero first (if any), then the rest of its content as-is
          if (heroIdx >= 0) mergedBlocks.push({ ...blocks[heroIdx] });
          blocks.forEach((b, j) => { if (j !== heroIdx) mergedBlocks.push({ ...b }); });
        } else {
          // later source: a section-divider heading, then ALL its blocks (its hero
          // becomes a section image; its quiz stays as a section checkpoint)
          mergedBlocks.push({ id: uuidv4(), type: 'heading', order: 0, text: p.title, level: 2 });
          blocks.forEach((b) => mergedBlocks.push({ ...b }));
        }
      });
    }
    mergedBlocks.forEach((b, i) => { b.order = i; });

    const inTotal = srcPages.reduce((s, p) => s + (p.blocks || []).length, 0);
    const quizzes = mergedBlocks.filter((b) => b.type === 'inline_quiz').length;
    const we = mergedBlocks.filter((b) => b.type === 'worked_example').length;
    console.log(`p${String(m.n).padStart(2)} "${m.slug}"  ${m.sources.length} src · ${inTotal}→${mergedBlocks.length} blk · ${we} worked · ${quizzes} quiz${m.sources.length > 1 ? '  ⟵ ' + m.sources.join(' + ') : ''}`);

    if (APPLY) {
      await bw.savePage(db, { pageId: keeper._id }, mergedBlocks, {
        author: 'ck-consolidate',
        summary: `Kinetics 38→15 consolidation: merge ${m.sources.join(' + ')}`,
        extraSet: { slug: m.slug, title: m.title, subtitle: m.subtitle, page_number: m.n },
      });
    }
    newPageIds.push(keeper._id);
    for (let i = 1; i < srcPages.length; i++) toSoftDelete.push(srcPages[i]);
  }

  // practice page → last position
  const practice = bySlug[PRACTICE_SLUG];
  if (practice) {
    console.log(`p${PRACTICE_PAGE_NUMBER} "${PRACTICE_SLUG}"  (practice bank — renumber only)`);
    if (APPLY) await bw.savePage(db, { pageId: practice._id }, practice.blocks, { author: 'ck-consolidate', summary: 'renumber practice to p15', extraSet: { page_number: PRACTICE_PAGE_NUMBER } });
    newPageIds.push(practice._id);
  }

  console.log(`\nSurviving pages: ${newPageIds.length} | soft-deleting: ${toSoftDelete.length} (${toSoftDelete.map((p) => p.slug).join(', ')})`);

  if (APPLY) {
    for (const p of toSoftDelete) {
      await bw.softDeletePage(db, { pageId: p._id }, { author: 'ck-consolidate', reason: `Founder-approved Kinetics 38→15 consolidation (2026-06-27): content merged into the keeper page; hidden from the reader, recoverable via version history.` });
    }
    await booksCol.updateOne({ _id: book._id }, { $set: { [`chapters.${ci}.page_ids`]: newPageIds } });
    console.log(`\n✓ chapter page_ids rebuilt → ${newPageIds.length} pages`);
  }
  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
