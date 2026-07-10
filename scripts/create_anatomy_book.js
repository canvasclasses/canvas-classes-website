'use strict';
/**
 * Creates the "Anatomy & Physiology" Live Book + its first chapter "Skeletal System"
 * with two starter pages (chapter opener + the overview lesson that embeds the
 * skeleton-3d sim). PURELY ADDITIVE — inserts a new book, chapter and pages; never
 * touches existing content (so the content-protection guard isn't needed for
 * creation). Future EDITS to these pages must go through book-writer.savePage().
 *
 * Everything is created UNPUBLISHED (is_published/published = false) so nothing goes
 * live to students until the founder reviews + publishes.
 *
 * Idempotent: re-running won't duplicate the book/chapter/pages (matches by slug).
 */
const { computeReadingTime, computeContentTypes, withDb } = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'anatomy-physiology';
const CH = { number: 1, title: 'Skeletal System', slug: 'skeletal-system' };

const b = (type, order, extra) => ({ id: uuidv4(), type, order, ...extra });

// ── Page 1: chapter opener (no food-for-thought; journey auto-derived) ──
const openerBlocks = [
  b('image', 0, {
    src: '', alt: 'A full human skeleton standing against a dark background', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5 ratio). A complete, anatomically accurate human skeleton ' +
      'standing upright, lit dramatically from one side so the bones glow warm ivory against deep ' +
      'shadow. The framework of the body revealed — skull, rib cage, spine, limbs — conveying that ' +
      'this is the living scaffold every human is built on. Dark near-black background, warm rim ' +
      'lighting, photorealistic medical-illustration style. No text.',
  }),
  b('text', 1, {
    markdown:
      'Every move you make — standing, walking, breathing, even nodding — happens because of a ' +
      'living framework of **206 bones**. Far from being a dead, dry rack, your skeleton is a busy ' +
      'organ system: it holds you up, shields your most delicate organs, works with muscles as a ' +
      'system of levers, manufactures your blood, and acts as the body’s warehouse for calcium.\n\n' +
      'In this chapter we’ll explore that framework in 3D, name its major bones, look *inside* a ' +
      'bone at the chemistry that makes it both strong and light, and see how bones meet at joints.',
  }),
  b('text', 2, {
    markdown:
      '**What you’ll explore in this chapter**\n\n' +
      '- What a skeleton actually *does* — its five jobs\n' +
      '- The major bones, and the **axial vs appendicular** split (80 + 126 = 206)\n' +
      '- Inside a bone: compact vs spongy bone, and the chemistry of bone (hydroxyapatite + collagen)\n' +
      '- How bones meet: joints, cartilage and ligaments',
  }),
];

// ── Page 2: overview lesson — "What Your Skeleton Does" (embeds skeleton-3d) ──
const overviewBlocks = [
  b('image', 0, {
    src: '', alt: 'Glowing human skeleton with the rib cage and skull highlighted', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5 ratio). Close three-quarter view of a human skeleton’s ' +
      'upper body — skull, rib cage and spine — warm ivory bone catching dramatic side light, the ' +
      'rib cage subtly suggesting the heart and lungs it protects. Dark near-black background, ' +
      'warm rim lighting, photorealistic medical-illustration style. No text.',
  }),
  b('callout', 1, {
    variant: 'fun_fact', title: 'Did you know?',
    markdown:
      'A newborn baby has about **270 bones** — more than an adult. As you grow, many of them ' +
      '**fuse together**, settling at **206** by adulthood. Your skull alone started as separate ' +
      'plates with soft gaps (fontanelles) so it could squeeze through birth and then grow.',
  }),
  b('text', 2, {
    markdown:
      'It’s easy to picture the skeleton as a lifeless coat-rack the body hangs on. In reality it ' +
      'is **living tissue** — laced with blood vessels and nerves, constantly being rebuilt, and ' +
      'doing five very different jobs at once.',
  }),
  b('heading', 3, { text: 'The five jobs of your skeleton', level: 2,
    objective: 'List the five functions of the skeletal system and give an example of each.' }),
  b('text', 4, {
    markdown:
      '1. **Shape and support** — the skeleton is the rigid scaffold that gives the body its form ' +
      'and holds it upright against gravity. Without it you would collapse like a tent with no poles.\n' +
      '2. **Protection** — bone is armour for soft organs: the **skull** boxes in the brain, the ' +
      '**rib cage** shields the heart and lungs, and the **vertebrae** wrap around the spinal cord.\n' +
      '3. **Movement** — bones are **levers**. On their own they can’t move; muscles pull on them ' +
      'across joints, turning a muscle’s squeeze into a swing of the arm or a step forward.\n' +
      '4. **Blood-cell production** — inside many bones, soft **red bone marrow** is a factory that ' +
      'churns out red blood cells, white blood cells and platelets — millions every second.\n' +
      '5. **Mineral storage** — bone is the body’s **calcium and phosphate warehouse**. When blood ' +
      'calcium runs low, bone releases some; when it’s high, bone stores it. (That storage chemistry ' +
      'is the focus of a later page.)',
  }),
  b('heading', 5, { text: 'Explore the whole skeleton in 3D', level: 2,
    objective: 'Identify the location of a major bone by exploring the 3D model.' }),
  b('text', 6, {
    markdown:
      'Rotate, zoom and tap any bone in the model below to learn what it is. Try the **Axial vs ' +
      'Appendicular** toggle to see the two halves of the skeleton light up, or take the guided tour.',
  }),
  b('simulation', 7, {
    simulation_id: 'skeleton-3d',
    title: 'The Human Skeleton — 3D',
    prediction: {
      prompt: 'Before you explore: which of these is the longest and strongest bone in the body?',
      options: ['The femur (thigh bone)', 'The humerus (upper arm)', 'The tibia (shin)', 'The spine'],
      reveal_after:
        'It’s the **femur** — the thigh bone. It carries your entire body weight when you stand and ' +
        'walk, so it’s built longest and strongest. Find it in the model and tap it to confirm.',
    },
  }),
  b('callout', 8, {
    variant: 'remember', title: 'Remember',
    markdown:
      'The 206 bones split into two groups: the **axial skeleton** (80 bones — skull, vertebral ' +
      'column, ribs, sternum and the hyoid: the central axis) and the **appendicular skeleton** ' +
      '(126 bones — the limbs plus the pectoral and pelvic girdles that attach them). **80 + 126 = 206.**',
  }),
  b('inline_quiz', 9, {
    pass_threshold: 0.67,
    questions: [
      {
        id: uuidv4(),
        question: 'Which function of the skeleton depends on bones acting as levers worked by muscles?',
        options: ['Movement', 'Protection of organs', 'Production of blood cells', 'Storage of calcium'],
        correct_index: 0,
        explanation:
          'Bones cannot move themselves; muscles pull on them across joints, using each bone as a ' +
          'lever to produce movement. Protection comes from bone acting as armour, blood cells are ' +
          'made in marrow, and calcium storage is a chemical role — none of those use the lever idea.',
        difficulty_level: 2,
      },
      {
        id: uuidv4(),
        question: 'How are the 206 bones of an adult divided between the axial and appendicular skeletons?',
        options: [
          '80 axial and 126 appendicular',
          '126 axial and 80 appendicular',
          '103 axial and 103 appendicular',
          '60 axial and 146 appendicular',
        ],
        correct_index: 0,
        explanation:
          'The axial skeleton (skull, vertebral column, ribs, sternum, hyoid) has 80 bones; the ' +
          'appendicular skeleton (limbs + the two girdles) has 126. They add to 206. Swapping the two ' +
          'numbers is the classic trap — the limbs and girdles outnumber the central axis.',
        difficulty_level: 1,
      },
      {
        id: uuidv4(),
        question: 'Where in a bone are blood cells actually produced?',
        options: [
          'In the red bone marrow inside the bone',
          'In the hard outer layer of compact bone',
          'In the cartilage capping the joints',
          'In the calcium stored in the bone matrix',
        ],
        correct_index: 0,
        explanation:
          'Soft red bone marrow inside many bones is the site of blood-cell production. The hard ' +
          'compact bone and the joint cartilage are structural, and stored calcium is a mineral ' +
          'reserve — none of them make blood cells.',
        difficulty_level: 2,
      },
    ],
  }),
];

const PAGES = [
  { slug: 'skeletal-system-overview-opener', title: 'The Skeletal System',
    subtitle: 'Your body’s living framework — 206 bones that hold you up, shield your organs, move you, make your blood and store your calcium.',
    page_number: 0, page_type: 'chapter_opener', blocks: openerBlocks },
  { slug: 'what-your-skeleton-does', title: 'What Your Skeleton Does',
    subtitle: 'The five jobs of the skeleton — and a 3D tour of every bone.',
    page_number: 1, page_type: 'lesson', blocks: overviewBlocks },
];

(async () => {
  await withDb(async (db) => {
    const books = db.collection('books');
    const pages = db.collection('book_pages');
    const now = new Date();

    // 1) Upsert the book (additive; idempotent by slug)
    let book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) {
      book = {
        _id: uuidv4(), slug: BOOK_SLUG, title: 'Anatomy & Physiology',
        subject: 'biology', grade: 11, board: 'ncert',
        chapters: [], is_published: false,
        deleted_at: null, created_at: now, updated_at: now,
      };
      await books.insertOne(book);
      console.log('created book:', BOOK_SLUG, book._id);
    } else {
      console.log('book already exists:', BOOK_SLUG, book._id);
    }

    // 2) Ensure the chapter exists
    if (!book.chapters.some((c) => c.slug === CH.slug)) {
      await books.updateOne({ _id: book._id }, {
        $push: { chapters: { number: CH.number, title: CH.title, slug: CH.slug,
          page_ids: [], description: 'Bones, the chemistry of bone, and joints — explored in 3D.',
          is_published: false } },
        $set: { updated_at: now },
      });
      console.log('added chapter:', CH.title);
    } else {
      console.log('chapter already exists:', CH.title);
    }

    // 3) Insert pages (additive); collect their ids for the chapter
    const pageIds = [];
    for (const p of PAGES) {
      const existing = await pages.findOne({ book_id: book._id, slug: p.slug });
      if (existing) { console.log('page exists, skipping:', p.slug); pageIds.push(existing._id); continue; }
      const doc = {
        _id: uuidv4(), book_id: book._id,
        chapter_number: CH.number, page_number: p.page_number,
        slug: p.slug, title: p.title, subtitle: p.subtitle,
        blocks: p.blocks,
        page_type: p.page_type, published: false,
        reading_time_min: computeReadingTime(p.blocks),
        content_types: computeContentTypes(p.blocks),
        tags: [], deleted_at: null, created_at: now, updated_at: now,
      };
      await pages.insertOne(doc);
      pageIds.push(doc._id);
      console.log('created page:', p.slug, '·', doc.reading_time_min, 'min ·', doc.content_types.join('/') || 'no-interactive');
    }

    // 4) Point the chapter at its pages (idempotent — set the array)
    await books.updateOne(
      { _id: book._id, 'chapters.slug': CH.slug },
      { $set: { 'chapters.$.page_ids': pageIds, updated_at: now } },
    );
    console.log('chapter page_ids set:', pageIds.length, 'pages');
    console.log('DONE. Book is UNPUBLISHED — review in the admin books editor before publishing.');
  });
})().catch((e) => { console.error(e); process.exit(1); });
