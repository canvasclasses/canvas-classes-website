// NCERT Books Data — all PDFs served from Cloudflare R2
// Legacy CSV (Chemistry via Google Sheet) kept only for the [chapterSlug] SEO pages

const CSV_URL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSHZEaRQS05LJ1DUkUOgaUSRdcMJG8ocpVxkwH1C883xmENL_axHGtCGRMR6nS9pOVmN5XwrI-YGurX/pub?output=csv';

function convertDriveUrl(url: string): string {
    if (!url) return '';
    return url.replace('/view?usp=drive_link', '/preview').replace('/view', '/preview');
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type NcertClassNum = '8' | '9' | '10' | '11' | '12';

export interface NcertBookChapter {
    num: number;
    title: string;
    pdfUrl: string;
}

export interface NcertBook {
    id: string;
    classNum: NcertClassNum;
    subject: string;
    bookTitle: string;
    chapters: NcertBookChapter[];
}

// ── Static R2 books (uploaded via scripts/upload_ncert_to_r2.js) ─────────────

const R2_BASE = 'https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/ncert-books';

const R2_BOOKS: NcertBook[] = [
    // ── Class 8 ──────────────────────────────────────────────────────────────
    {
        id: 'r2-8-science-science',
        classNum: '8',
        subject: 'Science',
        bookTitle: 'Science',
        chapters: [
            { num: 1,  title: 'Crop Production and Management',          pdfUrl: `${R2_BASE}/class8/science/ch01.pdf` },
            { num: 2,  title: 'Microorganisms: Friend and Foe',           pdfUrl: `${R2_BASE}/class8/science/ch02.pdf` },
            { num: 3,  title: 'Coal and Petroleum',                       pdfUrl: `${R2_BASE}/class8/science/ch03.pdf` },
            { num: 4,  title: 'Combustion and Flame',                     pdfUrl: `${R2_BASE}/class8/science/ch04.pdf` },
            { num: 5,  title: 'Conservation of Plants and Animals',       pdfUrl: `${R2_BASE}/class8/science/ch05.pdf` },
            { num: 6,  title: 'Reproduction in Animals',                  pdfUrl: `${R2_BASE}/class8/science/ch06.pdf` },
            { num: 7,  title: 'Reaching the Age of Adolescence',          pdfUrl: `${R2_BASE}/class8/science/ch07.pdf` },
            { num: 8,  title: 'Force and Pressure',                       pdfUrl: `${R2_BASE}/class8/science/ch08.pdf` },
            { num: 9,  title: 'Friction',                                 pdfUrl: `${R2_BASE}/class8/science/ch09.pdf` },
            { num: 10, title: 'Sound',                                    pdfUrl: `${R2_BASE}/class8/science/ch10.pdf` },
            { num: 11, title: 'Chemical Effects of Electric Current',     pdfUrl: `${R2_BASE}/class8/science/ch11.pdf` },
            { num: 12, title: 'Some Natural Phenomena',                   pdfUrl: `${R2_BASE}/class8/science/ch12.pdf` },
            { num: 13, title: 'Light',                                    pdfUrl: `${R2_BASE}/class8/science/ch13.pdf` },
        ],
    },
    {
        id: 'r2-8-mathematics-mathematics',
        classNum: '8',
        subject: 'Mathematics',
        bookTitle: 'Mathematics',
        chapters: [
            { num: 1,  title: 'Rational Numbers',                         pdfUrl: `${R2_BASE}/class8/math/ch01.pdf` },
            { num: 2,  title: 'Linear Equations in One Variable',         pdfUrl: `${R2_BASE}/class8/math/ch02.pdf` },
            { num: 3,  title: 'Understanding Quadrilaterals',             pdfUrl: `${R2_BASE}/class8/math/ch03.pdf` },
            { num: 4,  title: 'Data Handling',                            pdfUrl: `${R2_BASE}/class8/math/ch04.pdf` },
            { num: 5,  title: 'Squares and Square Roots',                 pdfUrl: `${R2_BASE}/class8/math/ch05.pdf` },
            { num: 6,  title: 'Cubes and Cube Roots',                     pdfUrl: `${R2_BASE}/class8/math/ch06.pdf` },
            { num: 7,  title: 'Comparing Quantities',                     pdfUrl: `${R2_BASE}/class8/math/ch07.pdf` },
            { num: 8,  title: 'Algebraic Expressions and Identities',     pdfUrl: `${R2_BASE}/class8/math/ch08.pdf` },
            { num: 9,  title: 'Mensuration',                              pdfUrl: `${R2_BASE}/class8/math/ch09.pdf` },
            { num: 10, title: 'Exponents and Powers',                     pdfUrl: `${R2_BASE}/class8/math/ch10.pdf` },
            { num: 11, title: 'Direct and Inverse Proportions',           pdfUrl: `${R2_BASE}/class8/math/ch11.pdf` },
            { num: 12, title: 'Factorisation',                            pdfUrl: `${R2_BASE}/class8/math/ch12.pdf` },
            { num: 13, title: 'Introduction to Graphs',                   pdfUrl: `${R2_BASE}/class8/math/ch13.pdf` },
        ],
    },
    {
        id: 'r2-8-english-honeydew',
        classNum: '8',
        subject: 'English',
        bookTitle: 'Honeydew',
        chapters: [
            { num: 1, title: 'The Best Christmas Present in the World',   pdfUrl: `${R2_BASE}/class8/english-honeydew/ch01.pdf` },
            { num: 2, title: 'The Tsunami',                               pdfUrl: `${R2_BASE}/class8/english-honeydew/ch02.pdf` },
            { num: 3, title: 'Glimpses of the Past',                      pdfUrl: `${R2_BASE}/class8/english-honeydew/ch03.pdf` },
            { num: 4, title: "Bepin Choudhury's Lapse of Memory",         pdfUrl: `${R2_BASE}/class8/english-honeydew/ch04.pdf` },
            { num: 5, title: 'The Summit Within',                         pdfUrl: `${R2_BASE}/class8/english-honeydew/ch05.pdf` },
            { num: 6, title: "This is Jody's Fawn",                       pdfUrl: `${R2_BASE}/class8/english-honeydew/ch06.pdf` },
            { num: 7, title: 'A Visit to Cambridge',                      pdfUrl: `${R2_BASE}/class8/english-honeydew/ch07.pdf` },
            { num: 8, title: 'A Short Monsoon Diary',                     pdfUrl: `${R2_BASE}/class8/english-honeydew/ch08.pdf` },
        ],
    },
    {
        id: 'r2-8-english-it-so-happened',
        classNum: '8',
        subject: 'English',
        bookTitle: 'It So Happened',
        chapters: [
            { num: 1, title: 'How the Camel Got His Hump',                pdfUrl: `${R2_BASE}/class8/english-itsohappened/ch01.pdf` },
            { num: 2, title: 'Children at Work',                          pdfUrl: `${R2_BASE}/class8/english-itsohappened/ch02.pdf` },
            { num: 3, title: 'The Selfish Giant',                         pdfUrl: `${R2_BASE}/class8/english-itsohappened/ch03.pdf` },
            { num: 4, title: 'The Treasure Within',                       pdfUrl: `${R2_BASE}/class8/english-itsohappened/ch04.pdf` },
            { num: 5, title: 'Princess September',                        pdfUrl: `${R2_BASE}/class8/english-itsohappened/ch05.pdf` },
            { num: 6, title: 'The Fight',                                 pdfUrl: `${R2_BASE}/class8/english-itsohappened/ch06.pdf` },
            { num: 7, title: 'The Open Window',                           pdfUrl: `${R2_BASE}/class8/english-itsohappened/ch07.pdf` },
        ],
    },
    {
        id: 'r2-8-social-science-history',
        classNum: '8',
        subject: 'Social Science',
        bookTitle: 'History (Our Pasts III)',
        chapters: [
            { num: 1, title: 'How, When and Where',                                        pdfUrl: `${R2_BASE}/class8/ss-history/ch01.pdf` },
            { num: 2, title: 'From Trade to Territory: The Company Establishes Power',     pdfUrl: `${R2_BASE}/class8/ss-history/ch02.pdf` },
            { num: 3, title: 'Ruling the Countryside',                                     pdfUrl: `${R2_BASE}/class8/ss-history/ch03.pdf` },
            { num: 4, title: 'Tribals, Dikus and the Vision of a Golden Age',              pdfUrl: `${R2_BASE}/class8/ss-history/ch04.pdf` },
            { num: 5, title: 'When People Rebel: 1857 and After',                          pdfUrl: `${R2_BASE}/class8/ss-history/ch05.pdf` },
            { num: 6, title: 'Weavers, Iron Smelters and Factory Owners',                  pdfUrl: `${R2_BASE}/class8/ss-history/ch06.pdf` },
            { num: 7, title: 'Civilising the "Native", Educating the Nation',              pdfUrl: `${R2_BASE}/class8/ss-history/ch07.pdf` },
            { num: 8, title: 'Women, Caste and Reform',                                    pdfUrl: `${R2_BASE}/class8/ss-history/ch08.pdf` },
        ],
    },
    {
        id: 'r2-8-social-science-civics',
        classNum: '8',
        subject: 'Social Science',
        bookTitle: 'Civics (Social & Political Life III)',
        chapters: [
            { num: 1, title: 'The Indian Constitution',                     pdfUrl: `${R2_BASE}/class8/ss-civics/ch01.pdf` },
            { num: 2, title: 'Understanding Secularism',                    pdfUrl: `${R2_BASE}/class8/ss-civics/ch02.pdf` },
            { num: 3, title: 'Why Do We Need a Parliament?',                pdfUrl: `${R2_BASE}/class8/ss-civics/ch03.pdf` },
            { num: 5, title: 'Judiciary',                                   pdfUrl: `${R2_BASE}/class8/ss-civics/ch05.pdf` },
            { num: 6, title: 'Understanding Our Criminal Justice System',   pdfUrl: `${R2_BASE}/class8/ss-civics/ch06.pdf` },
            { num: 7, title: 'Understanding Marginalisation',               pdfUrl: `${R2_BASE}/class8/ss-civics/ch07.pdf` },
            { num: 8, title: 'Confronting Marginalisation',                 pdfUrl: `${R2_BASE}/class8/ss-civics/ch08.pdf` },
        ],
    },
    {
        id: 'r2-8-social-science-geography',
        classNum: '8',
        subject: 'Social Science',
        bookTitle: 'Geography (Resources and Development)',
        chapters: [
            { num: 1, title: 'Resources',                                                            pdfUrl: `${R2_BASE}/class8/ss-geography/ch01.pdf` },
            { num: 2, title: 'Land, Soil, Water, Natural Vegetation and Wildlife Resources',         pdfUrl: `${R2_BASE}/class8/ss-geography/ch02.pdf` },
            { num: 3, title: 'Mineral and Power Resources',                                          pdfUrl: `${R2_BASE}/class8/ss-geography/ch03.pdf` },
            { num: 4, title: 'Agriculture',                                                          pdfUrl: `${R2_BASE}/class8/ss-geography/ch04.pdf` },
            { num: 5, title: 'Industries',                                                           pdfUrl: `${R2_BASE}/class8/ss-geography/ch05.pdf` },
            { num: 6, title: 'Human Resources',                                                      pdfUrl: `${R2_BASE}/class8/ss-geography/ch06.pdf` },
        ],
    },
    // ── Class 9 ──────────────────────────────────────────────────────────────
    {
        id: 'r2-9-science',
        classNum: '9',
        subject: 'Science',
        bookTitle: 'Science',
        chapters: [
            { num: 1,  title: 'Exploration',                              pdfUrl: `${R2_BASE}/class9/science/ch01.pdf` },
            { num: 2,  title: 'Cell',                                     pdfUrl: `${R2_BASE}/class9/science/ch02.pdf` },
            { num: 3,  title: 'Tissues in Action',                        pdfUrl: `${R2_BASE}/class9/science/ch03.pdf` },
            { num: 4,  title: 'Motion around Us',                         pdfUrl: `${R2_BASE}/class9/science/ch04.pdf` },
            { num: 5,  title: 'Mixtures & Their Separation',              pdfUrl: `${R2_BASE}/class9/science/ch05.pdf` },
            { num: 6,  title: 'How Forces Affect Motion',                 pdfUrl: `${R2_BASE}/class9/science/ch06.pdf` },
            { num: 7,  title: 'Work, Energy & Machines',                  pdfUrl: `${R2_BASE}/class9/science/ch07.pdf` },
            { num: 8,  title: 'Inside an Atom',                           pdfUrl: `${R2_BASE}/class9/science/ch08.pdf` },
            { num: 9,  title: 'Atomic Foundations of Matter',             pdfUrl: `${R2_BASE}/class9/science/ch09.pdf` },
            { num: 10, title: 'Sound Waves',                              pdfUrl: `${R2_BASE}/class9/science/ch10.pdf` },
            { num: 11, title: 'Reproduction',                             pdfUrl: `${R2_BASE}/class9/science/ch11.pdf` },
            { num: 12, title: 'Pattern in Life',                          pdfUrl: `${R2_BASE}/class9/science/ch12.pdf` },
            { num: 13, title: 'Earth as a System',                        pdfUrl: `${R2_BASE}/class9/science/ch13.pdf` },
        ],
    },
    {
        id: 'r2-9-mathematics',
        classNum: '9',
        subject: 'Mathematics',
        bookTitle: 'Mathematics',
        chapters: [
            { num: 1, title: 'Orienting Yourself: The Use of Coordinates',      pdfUrl: `${R2_BASE}/class9/math/ch01.pdf` },
            { num: 2, title: 'Introduction to Linear Polynomials',             pdfUrl: `${R2_BASE}/class9/math/ch02.pdf` },
            { num: 3, title: 'The World of Numbers',                           pdfUrl: `${R2_BASE}/class9/math/ch03.pdf` },
            { num: 4, title: 'Exploring Algebraic Identities',                 pdfUrl: `${R2_BASE}/class9/math/ch04.pdf` },
            { num: 5, title: "I'm Up and Down, and Round and Round",           pdfUrl: `${R2_BASE}/class9/math/ch05.pdf` },
            { num: 6, title: 'Measuring Space: Perimeter and Area',            pdfUrl: `${R2_BASE}/class9/math/ch06.pdf` },
            { num: 7, title: 'The Mathematics of Maybe: Introduction to Probability', pdfUrl: `${R2_BASE}/class9/math/ch07.pdf` },
            { num: 8, title: 'Predicting What Comes Next: Exploring Sequences and Progressions', pdfUrl: `${R2_BASE}/class9/math/ch08.pdf` },
        ],
    },
    {
        id: 'r2-9-english-beehive',
        classNum: '9',
        subject: 'English',
        bookTitle: 'Kaveri',
        chapters: [
            { num: 1, title: 'How I Taught My Grandmother to Read',       pdfUrl: `${R2_BASE}/class9/english-beehive/ch01.pdf` },
            { num: 2, title: 'The Pot Maker',                             pdfUrl: `${R2_BASE}/class9/english-beehive/ch02.pdf` },
            { num: 3, title: 'Winds of Change',                           pdfUrl: `${R2_BASE}/class9/english-beehive/ch03.pdf` },
            { num: 4, title: 'Vitamin-M',                                 pdfUrl: `${R2_BASE}/class9/english-beehive/ch04.pdf` },
            { num: 5, title: 'The World of Limitless Possibilities',      pdfUrl: `${R2_BASE}/class9/english-beehive/ch05.pdf` },
            { num: 6, title: 'Twin Melodies',                             pdfUrl: `${R2_BASE}/class9/english-beehive/ch06.pdf` },
            { num: 7, title: 'Carrier of Words',                          pdfUrl: `${R2_BASE}/class9/english-beehive/ch07.pdf` },
            { num: 8, title: 'Follow That Dream',                         pdfUrl: `${R2_BASE}/class9/english-beehive/ch08.pdf` },
        ],
    },
    {
        id: 'r2-9-social-science-history',
        classNum: '9',
        subject: 'Social Science',
        bookTitle: 'Health and Physical Education',
        chapters: [
            { num: 1, title: 'Evolution of Physical Education and Well-being', pdfUrl: `${R2_BASE}/class9/ss-history/ch01.pdf` },
            { num: 2, title: 'Science and Sports',                              pdfUrl: `${R2_BASE}/class9/ss-history/ch02.pdf` },
            { num: 3, title: 'Olympism',                                        pdfUrl: `${R2_BASE}/class9/ss-history/ch03.pdf` },
            { num: 4, title: 'Sports for All',                                  pdfUrl: `${R2_BASE}/class9/ss-history/ch04.pdf` },
            { num: 5, title: 'Sports',                                          pdfUrl: `${R2_BASE}/class9/ss-history/ch05.pdf` },
            { num: 6, title: 'Yoga for Holistic Health and Personal Excellence', pdfUrl: `${R2_BASE}/class9/ss-history/ch06.pdf` },
        ],
    },
    // ── Class 10 ─────────────────────────────────────────────────────────────
    {
        id: 'r2-10-science-science',
        classNum: '10',
        subject: 'Science',
        bookTitle: 'Science',
        chapters: [
            { num: 1,  title: 'Chemical Reactions and Equations',         pdfUrl: `${R2_BASE}/class10/science/ch01.pdf` },
            { num: 2,  title: 'Acids, Bases and Salts',                   pdfUrl: `${R2_BASE}/class10/science/ch02.pdf` },
            { num: 3,  title: 'Metals and Non-metals',                    pdfUrl: `${R2_BASE}/class10/science/ch03.pdf` },
            { num: 4,  title: 'Carbon and Its Compounds',                 pdfUrl: `${R2_BASE}/class10/science/ch04.pdf` },
            { num: 5,  title: 'Periodic Classification of Elements',      pdfUrl: `${R2_BASE}/class10/science/ch05.pdf` },
            { num: 6,  title: 'Life Processes',                           pdfUrl: `${R2_BASE}/class10/science/ch06.pdf` },
            { num: 7,  title: 'Control and Coordination',                 pdfUrl: `${R2_BASE}/class10/science/ch07.pdf` },
            { num: 8,  title: 'How do Organisms Reproduce?',              pdfUrl: `${R2_BASE}/class10/science/ch08.pdf` },
            { num: 9,  title: 'Heredity and Evolution',                   pdfUrl: `${R2_BASE}/class10/science/ch09.pdf` },
            { num: 10, title: 'Light — Reflection and Refraction',        pdfUrl: `${R2_BASE}/class10/science/ch10.pdf` },
            { num: 11, title: 'The Human Eye and the Colourful World',    pdfUrl: `${R2_BASE}/class10/science/ch11.pdf` },
            { num: 12, title: 'Electricity',                              pdfUrl: `${R2_BASE}/class10/science/ch12.pdf` },
            { num: 13, title: 'Magnetic Effects of Electric Current',     pdfUrl: `${R2_BASE}/class10/science/ch13.pdf` },
        ],
    },
    {
        id: 'r2-10-mathematics-mathematics',
        classNum: '10',
        subject: 'Mathematics',
        bookTitle: 'Mathematics',
        chapters: [
            { num: 1,  title: 'Real Numbers',                             pdfUrl: `${R2_BASE}/class10/math/ch01.pdf` },
            { num: 2,  title: 'Polynomials',                              pdfUrl: `${R2_BASE}/class10/math/ch02.pdf` },
            { num: 3,  title: 'Pair of Linear Equations in Two Variables',pdfUrl: `${R2_BASE}/class10/math/ch03.pdf` },
            { num: 4,  title: 'Quadratic Equations',                      pdfUrl: `${R2_BASE}/class10/math/ch04.pdf` },
            { num: 5,  title: 'Arithmetic Progressions',                  pdfUrl: `${R2_BASE}/class10/math/ch05.pdf` },
            { num: 6,  title: 'Triangles',                                pdfUrl: `${R2_BASE}/class10/math/ch06.pdf` },
            { num: 7,  title: 'Coordinate Geometry',                      pdfUrl: `${R2_BASE}/class10/math/ch07.pdf` },
            { num: 8,  title: 'Introduction to Trigonometry',             pdfUrl: `${R2_BASE}/class10/math/ch08.pdf` },
            { num: 9,  title: 'Some Applications of Trigonometry',        pdfUrl: `${R2_BASE}/class10/math/ch09.pdf` },
            { num: 10, title: 'Circles',                                  pdfUrl: `${R2_BASE}/class10/math/ch10.pdf` },
            { num: 11, title: 'Areas Related to Circles',                 pdfUrl: `${R2_BASE}/class10/math/ch11.pdf` },
            { num: 12, title: 'Surface Areas and Volumes',                pdfUrl: `${R2_BASE}/class10/math/ch12.pdf` },
            { num: 13, title: 'Statistics',                               pdfUrl: `${R2_BASE}/class10/math/ch13.pdf` },
            { num: 14, title: 'Probability',                              pdfUrl: `${R2_BASE}/class10/math/ch14.pdf` },
        ],
    },
    {
        id: 'r2-10-english-first-flight',
        classNum: '10',
        subject: 'English',
        bookTitle: 'First Flight',
        chapters: [
            { num: 1, title: 'A Letter to God',                           pdfUrl: `${R2_BASE}/class10/english-firstflight/ch01.pdf` },
            { num: 2, title: 'Nelson Mandela: Long Walk to Freedom',      pdfUrl: `${R2_BASE}/class10/english-firstflight/ch02.pdf` },
            { num: 3, title: 'Two Stories about Flying',                  pdfUrl: `${R2_BASE}/class10/english-firstflight/ch03.pdf` },
            { num: 4, title: 'From the Diary of Anne Frank',              pdfUrl: `${R2_BASE}/class10/english-firstflight/ch04.pdf` },
            { num: 5, title: 'Glimpses of India',                         pdfUrl: `${R2_BASE}/class10/english-firstflight/ch05.pdf` },
            { num: 6, title: 'Mijbil the Otter',                          pdfUrl: `${R2_BASE}/class10/english-firstflight/ch06.pdf` },
            { num: 7, title: 'Madam Rides the Bus',                       pdfUrl: `${R2_BASE}/class10/english-firstflight/ch07.pdf` },
            { num: 8, title: 'The Sermon at Benares',                     pdfUrl: `${R2_BASE}/class10/english-firstflight/ch08.pdf` },
            { num: 9, title: 'The Proposal',                              pdfUrl: `${R2_BASE}/class10/english-firstflight/ch09.pdf` },
        ],
    },
    {
        id: 'r2-10-english-footprints',
        classNum: '10',
        subject: 'English',
        bookTitle: 'Footprints Without Feet',
        chapters: [
            { num: 1, title: 'A Triumph of Surgery',                      pdfUrl: `${R2_BASE}/class10/english-footprints/ch01.pdf` },
            { num: 2, title: "The Thief's Story",                         pdfUrl: `${R2_BASE}/class10/english-footprints/ch02.pdf` },
            { num: 3, title: 'The Midnight Visitor',                      pdfUrl: `${R2_BASE}/class10/english-footprints/ch03.pdf` },
            { num: 4, title: 'A Question of Trust',                       pdfUrl: `${R2_BASE}/class10/english-footprints/ch04.pdf` },
            { num: 5, title: 'Footprints without Feet',                   pdfUrl: `${R2_BASE}/class10/english-footprints/ch05.pdf` },
            { num: 6, title: 'The Making of a Scientist',                 pdfUrl: `${R2_BASE}/class10/english-footprints/ch06.pdf` },
            { num: 7, title: 'The Necklace',                              pdfUrl: `${R2_BASE}/class10/english-footprints/ch07.pdf` },
            { num: 8, title: 'Bholi',                                     pdfUrl: `${R2_BASE}/class10/english-footprints/ch08.pdf` },
            { num: 9, title: 'The Book That Saved the Earth',             pdfUrl: `${R2_BASE}/class10/english-footprints/ch09.pdf` },
        ],
    },
    {
        id: 'r2-10-ss-history',
        classNum: '10',
        subject: 'Social Science',
        bookTitle: 'History (India and the Contemporary World II)',
        chapters: [
            { num: 1, title: 'The Rise of Nationalism in Europe',         pdfUrl: `${R2_BASE}/class10/ss-history/ch01.pdf` },
            { num: 2, title: 'Nationalism in India',                      pdfUrl: `${R2_BASE}/class10/ss-history/ch02.pdf` },
            { num: 3, title: 'The Making of a Global World',              pdfUrl: `${R2_BASE}/class10/ss-history/ch03.pdf` },
            { num: 4, title: 'The Age of Industrialisation',              pdfUrl: `${R2_BASE}/class10/ss-history/ch04.pdf` },
            { num: 5, title: 'Work, Life and Leisure',                    pdfUrl: `${R2_BASE}/class10/ss-history/ch05.pdf` },
            { num: 6, title: 'Print Culture and the Modern World',        pdfUrl: `${R2_BASE}/class10/ss-history/ch06.pdf` },
            { num: 7, title: 'Novels, Society and History',               pdfUrl: `${R2_BASE}/class10/ss-history/ch07.pdf` },
        ],
    },
    {
        id: 'r2-10-ss-geography',
        classNum: '10',
        subject: 'Social Science',
        bookTitle: 'Geography (Contemporary India II)',
        chapters: [
            { num: 1, title: 'Resources and Development',                 pdfUrl: `${R2_BASE}/class10/ss-geography/ch01.pdf` },
            { num: 2, title: 'Forest and Wildlife Resources',             pdfUrl: `${R2_BASE}/class10/ss-geography/ch02.pdf` },
            { num: 3, title: 'Water Resources',                           pdfUrl: `${R2_BASE}/class10/ss-geography/ch03.pdf` },
            { num: 4, title: 'Agriculture',                               pdfUrl: `${R2_BASE}/class10/ss-geography/ch04.pdf` },
            { num: 5, title: 'Minerals and Energy Resources',             pdfUrl: `${R2_BASE}/class10/ss-geography/ch05.pdf` },
        ],
    },
    {
        id: 'r2-10-ss-civics',
        classNum: '10',
        subject: 'Social Science',
        bookTitle: 'Civics (Democratic Politics II)',
        chapters: [
            { num: 1, title: 'Power Sharing',                             pdfUrl: `${R2_BASE}/class10/ss-civics/ch01.pdf` },
            { num: 2, title: 'Federalism',                                pdfUrl: `${R2_BASE}/class10/ss-civics/ch02.pdf` },
            { num: 3, title: 'Democracy and Diversity',                   pdfUrl: `${R2_BASE}/class10/ss-civics/ch03.pdf` },
            { num: 4, title: 'Political Parties',                         pdfUrl: `${R2_BASE}/class10/ss-civics/ch04.pdf` },
            { num: 5, title: 'Outcomes of Democracy',                     pdfUrl: `${R2_BASE}/class10/ss-civics/ch05.pdf` },
        ],
    },
    {
        id: 'r2-10-ss-economics',
        classNum: '10',
        subject: 'Social Science',
        bookTitle: 'Economics (Understanding Economic Development)',
        chapters: [
            { num: 1, title: 'Development',                               pdfUrl: `${R2_BASE}/class10/ss-economics/ch01.pdf` },
            { num: 2, title: 'Sectors of the Indian Economy',             pdfUrl: `${R2_BASE}/class10/ss-economics/ch02.pdf` },
            { num: 3, title: 'Money and Credit',                          pdfUrl: `${R2_BASE}/class10/ss-economics/ch03.pdf` },
            { num: 4, title: 'Globalisation and the Indian Economy',      pdfUrl: `${R2_BASE}/class10/ss-economics/ch04.pdf` },
            { num: 5, title: 'Consumer Rights',                           pdfUrl: `${R2_BASE}/class10/ss-economics/ch05.pdf` },
        ],
    },
    // ── Class 11 ─────────────────────────────────────────────────────────────
    {
        id: 'r2-11-chemistry-part1',
        classNum: '11',
        subject: 'Chemistry',
        bookTitle: 'Chemistry Part 1',
        chapters: [
            { num: 1, title: 'Some Basic Concepts of Chemistry',                           pdfUrl: `${R2_BASE}/class11/chemistry-p1/ch01.pdf` },
            { num: 2, title: 'Structure of Atom',                                          pdfUrl: `${R2_BASE}/class11/chemistry-p1/ch02.pdf` },
            { num: 3, title: 'Classification of Elements and Periodicity in Properties',   pdfUrl: `${R2_BASE}/class11/chemistry-p1/ch03.pdf` },
            { num: 4, title: 'Chemical Bonding and Molecular Structure',                   pdfUrl: `${R2_BASE}/class11/chemistry-p1/ch04.pdf` },
            { num: 5, title: 'Thermodynamics',                                             pdfUrl: `${R2_BASE}/class11/chemistry-p1/ch05.pdf` },
            { num: 6, title: 'Equilibrium',                                                pdfUrl: `${R2_BASE}/class11/chemistry-p1/ch06.pdf` },
        ],
    },
    {
        id: 'r2-11-chemistry-part2',
        classNum: '11',
        subject: 'Chemistry',
        bookTitle: 'Chemistry Part 2',
        chapters: [
            { num: 7, title: 'Redox Reactions',                                                   pdfUrl: `${R2_BASE}/class11/chemistry-p2/ch01.pdf` },
            { num: 8, title: 'Organic Chemistry — Some Basic Principles and Techniques',          pdfUrl: `${R2_BASE}/class11/chemistry-p2/ch02.pdf` },
            { num: 9, title: 'Hydrocarbons',                                                      pdfUrl: `${R2_BASE}/class11/chemistry-p2/ch03.pdf` },
        ],
    },
    {
        id: 'r2-11-physics-part1',
        classNum: '11',
        subject: 'Physics',
        bookTitle: 'Physics Part 1',
        chapters: [
            { num: 1, title: 'Units and Measurements',                           pdfUrl: `${R2_BASE}/class11/physics-p1/ch01.pdf` },
            { num: 2, title: 'Motion in a Straight Line',                        pdfUrl: `${R2_BASE}/class11/physics-p1/ch02.pdf` },
            { num: 3, title: 'Motion in a Plane',                                pdfUrl: `${R2_BASE}/class11/physics-p1/ch03.pdf` },
            { num: 4, title: 'Laws of Motion',                                   pdfUrl: `${R2_BASE}/class11/physics-p1/ch04.pdf` },
            { num: 5, title: 'Work, Energy and Power',                           pdfUrl: `${R2_BASE}/class11/physics-p1/ch05.pdf` },
            { num: 6, title: 'System of Particles and Rotational Motion',        pdfUrl: `${R2_BASE}/class11/physics-p1/ch06.pdf` },
            { num: 7, title: 'Gravitation',                                      pdfUrl: `${R2_BASE}/class11/physics-p1/ch07.pdf` },
        ],
    },
    {
        id: 'r2-11-physics-part2',
        classNum: '11',
        subject: 'Physics',
        bookTitle: 'Physics Part 2',
        chapters: [
            { num: 8,  title: 'Mechanical Properties of Solids',          pdfUrl: `${R2_BASE}/class11/physics-p2/ch01.pdf` },
            { num: 9,  title: 'Mechanical Properties of Fluids',          pdfUrl: `${R2_BASE}/class11/physics-p2/ch02.pdf` },
            { num: 10, title: 'Thermal Properties of Matter',             pdfUrl: `${R2_BASE}/class11/physics-p2/ch03.pdf` },
            { num: 11, title: 'Thermodynamics',                           pdfUrl: `${R2_BASE}/class11/physics-p2/ch04.pdf` },
            { num: 12, title: 'Kinetic Theory',                           pdfUrl: `${R2_BASE}/class11/physics-p2/ch05.pdf` },
            { num: 13, title: 'Oscillations',                             pdfUrl: `${R2_BASE}/class11/physics-p2/ch06.pdf` },
            { num: 14, title: 'Waves',                                    pdfUrl: `${R2_BASE}/class11/physics-p2/ch07.pdf` },
        ],
    },
    {
        id: 'r2-11-mathematics',
        classNum: '11',
        subject: 'Mathematics',
        bookTitle: 'Mathematics',
        chapters: [
            { num: 1,  title: 'Sets',                                              pdfUrl: `${R2_BASE}/class11/math/ch01.pdf` },
            { num: 2,  title: 'Relations and Functions',                           pdfUrl: `${R2_BASE}/class11/math/ch02.pdf` },
            { num: 3,  title: 'Trigonometric Functions',                           pdfUrl: `${R2_BASE}/class11/math/ch03.pdf` },
            { num: 4,  title: 'Complex Numbers and Quadratic Equations',           pdfUrl: `${R2_BASE}/class11/math/ch04.pdf` },
            { num: 5,  title: 'Linear Inequalities',                               pdfUrl: `${R2_BASE}/class11/math/ch05.pdf` },
            { num: 6,  title: 'Permutations and Combinations',                     pdfUrl: `${R2_BASE}/class11/math/ch06.pdf` },
            { num: 7,  title: 'Binomial Theorem',                                  pdfUrl: `${R2_BASE}/class11/math/ch07.pdf` },
            { num: 8,  title: 'Sequences and Series',                              pdfUrl: `${R2_BASE}/class11/math/ch08.pdf` },
            { num: 9,  title: 'Straight Lines',                                    pdfUrl: `${R2_BASE}/class11/math/ch09.pdf` },
            { num: 10, title: 'Conic Sections',                                    pdfUrl: `${R2_BASE}/class11/math/ch10.pdf` },
            { num: 11, title: 'Introduction to Three-Dimensional Geometry',        pdfUrl: `${R2_BASE}/class11/math/ch11.pdf` },
            { num: 12, title: 'Limits and Derivatives',                            pdfUrl: `${R2_BASE}/class11/math/ch12.pdf` },
            { num: 13, title: 'Statistics',                                        pdfUrl: `${R2_BASE}/class11/math/ch13.pdf` },
        ],
    },
    {
        id: 'r2-11-biology',
        classNum: '11',
        subject: 'Biology',
        bookTitle: 'Biology',
        chapters: [
            { num: 1,  title: 'The Living World',                                  pdfUrl: `${R2_BASE}/class11/biology/ch01.pdf` },
            { num: 2,  title: 'Biological Classification',                         pdfUrl: `${R2_BASE}/class11/biology/ch02.pdf` },
            { num: 3,  title: 'Plant Kingdom',                                     pdfUrl: `${R2_BASE}/class11/biology/ch03.pdf` },
            { num: 4,  title: 'Animal Kingdom',                                    pdfUrl: `${R2_BASE}/class11/biology/ch04.pdf` },
            { num: 5,  title: 'Morphology of Flowering Plants',                    pdfUrl: `${R2_BASE}/class11/biology/ch05.pdf` },
            { num: 6,  title: 'Anatomy of Flowering Plants',                       pdfUrl: `${R2_BASE}/class11/biology/ch06.pdf` },
            { num: 7,  title: 'Structural Organisation in Animals',                pdfUrl: `${R2_BASE}/class11/biology/ch07.pdf` },
            { num: 8,  title: 'Cell: The Unit of Life',                            pdfUrl: `${R2_BASE}/class11/biology/ch08.pdf` },
            { num: 9,  title: 'Biomolecules',                                      pdfUrl: `${R2_BASE}/class11/biology/ch09.pdf` },
            { num: 10, title: 'Cell Cycle and Cell Division',                      pdfUrl: `${R2_BASE}/class11/biology/ch10.pdf` },
            { num: 11, title: 'Photosynthesis in Higher Plants',                   pdfUrl: `${R2_BASE}/class11/biology/ch11.pdf` },
            { num: 12, title: 'Respiration in Plants',                             pdfUrl: `${R2_BASE}/class11/biology/ch12.pdf` },
            { num: 13, title: 'Plant Growth and Development',                      pdfUrl: `${R2_BASE}/class11/biology/ch13.pdf` },
            { num: 14, title: 'Breathing and Exchange of Gases',                   pdfUrl: `${R2_BASE}/class11/biology/ch14.pdf` },
            { num: 15, title: 'Body Fluids and Circulation',                       pdfUrl: `${R2_BASE}/class11/biology/ch15.pdf` },
            { num: 16, title: 'Excretory Products and Their Elimination',          pdfUrl: `${R2_BASE}/class11/biology/ch16.pdf` },
            { num: 17, title: 'Locomotion and Movement',                           pdfUrl: `${R2_BASE}/class11/biology/ch17.pdf` },
            { num: 18, title: 'Neural Control and Coordination',                   pdfUrl: `${R2_BASE}/class11/biology/ch18.pdf` },
            { num: 19, title: 'Chemical Coordination and Integration',             pdfUrl: `${R2_BASE}/class11/biology/ch19.pdf` },
        ],
    },
    {
        id: 'r2-11-english-hornbill',
        classNum: '11',
        subject: 'English',
        bookTitle: 'Hornbill',
        chapters: [
            { num: 1, title: 'The Portrait of a Lady',                                     pdfUrl: `${R2_BASE}/class11/english-hornbill/ch01.pdf` },
            { num: 2, title: "We're Not Afraid to Die... if We Can All Be Together",       pdfUrl: `${R2_BASE}/class11/english-hornbill/ch02.pdf` },
            { num: 3, title: 'Discovering Tut: The Saga Continues',                        pdfUrl: `${R2_BASE}/class11/english-hornbill/ch03.pdf` },
            { num: 4, title: 'Landscape of the Soul',                                      pdfUrl: `${R2_BASE}/class11/english-hornbill/ch04.pdf` },
            { num: 5, title: "The Ailing Planet: the Green Movement's Role",               pdfUrl: `${R2_BASE}/class11/english-hornbill/ch05.pdf` },
            { num: 6, title: 'The Browning Version',                                       pdfUrl: `${R2_BASE}/class11/english-hornbill/ch06.pdf` },
        ],
    },
    {
        id: 'r2-11-english-snapshots',
        classNum: '11',
        subject: 'English',
        bookTitle: 'Snapshots',
        chapters: [
            { num: 1, title: 'The Summer of the Beautiful White Horse',   pdfUrl: `${R2_BASE}/class11/english-snapshots/ch01.pdf` },
            { num: 2, title: 'The Address',                               pdfUrl: `${R2_BASE}/class11/english-snapshots/ch02.pdf` },
            { num: 3, title: "Ranga's Marriage",                          pdfUrl: `${R2_BASE}/class11/english-snapshots/ch03.pdf` },
            { num: 4, title: 'Albert Einstein at School',                 pdfUrl: `${R2_BASE}/class11/english-snapshots/ch04.pdf` },
            { num: 5, title: "Mother's Day",                              pdfUrl: `${R2_BASE}/class11/english-snapshots/ch05.pdf` },
        ],
    },
    // ── Class 12 ─────────────────────────────────────────────────────────────
    {
        id: 'r2-12-chemistry-part1',
        classNum: '12',
        subject: 'Chemistry',
        bookTitle: 'Chemistry Part 1',
        chapters: [
            { num: 1, title: 'Solutions',                                 pdfUrl: `${R2_BASE}/class12/chemistry-p1/ch01.pdf` },
            { num: 2, title: 'Electrochemistry',                          pdfUrl: `${R2_BASE}/class12/chemistry-p1/ch02.pdf` },
            { num: 3, title: 'Chemical Kinetics',                         pdfUrl: `${R2_BASE}/class12/chemistry-p1/ch03.pdf` },
            { num: 4, title: 'The d- and f-Block Elements',               pdfUrl: `${R2_BASE}/class12/chemistry-p1/ch04.pdf` },
            { num: 5, title: 'Coordination Compounds',                    pdfUrl: `${R2_BASE}/class12/chemistry-p1/ch05.pdf` },
        ],
    },
    {
        id: 'r2-12-chemistry-part2',
        classNum: '12',
        subject: 'Chemistry',
        bookTitle: 'Chemistry Part 2',
        chapters: [
            { num: 6,  title: 'Haloalkanes and Haloarenes',               pdfUrl: `${R2_BASE}/class12/chemistry-p2/ch01.pdf` },
            { num: 7,  title: 'Alcohols, Phenols and Ethers',             pdfUrl: `${R2_BASE}/class12/chemistry-p2/ch02.pdf` },
            { num: 8,  title: 'Aldehydes, Ketones and Carboxylic Acids',  pdfUrl: `${R2_BASE}/class12/chemistry-p2/ch03.pdf` },
            { num: 9,  title: 'Amines',                                   pdfUrl: `${R2_BASE}/class12/chemistry-p2/ch04.pdf` },
            { num: 10, title: 'Biomolecules',                             pdfUrl: `${R2_BASE}/class12/chemistry-p2/ch05.pdf` },
        ],
    },
    {
        id: 'r2-12-physics-part1',
        classNum: '12',
        subject: 'Physics',
        bookTitle: 'Physics Part 1',
        chapters: [
            { num: 1, title: 'Electric Charges and Fields',               pdfUrl: `${R2_BASE}/class12/physics-p1/ch01.pdf` },
            { num: 2, title: 'Electrostatic Potential and Capacitance',   pdfUrl: `${R2_BASE}/class12/physics-p1/ch02.pdf` },
            { num: 3, title: 'Current Electricity',                       pdfUrl: `${R2_BASE}/class12/physics-p1/ch03.pdf` },
            { num: 4, title: 'Moving Charges and Magnetism',              pdfUrl: `${R2_BASE}/class12/physics-p1/ch04.pdf` },
            { num: 5, title: 'Magnetism and Matter',                      pdfUrl: `${R2_BASE}/class12/physics-p1/ch05.pdf` },
            { num: 6, title: 'Electromagnetic Induction',                 pdfUrl: `${R2_BASE}/class12/physics-p1/ch06.pdf` },
            { num: 7, title: 'Alternating Current',                       pdfUrl: `${R2_BASE}/class12/physics-p1/ch07.pdf` },
            { num: 8, title: 'Electromagnetic Waves',                     pdfUrl: `${R2_BASE}/class12/physics-p1/ch08.pdf` },
        ],
    },
    {
        id: 'r2-12-physics-part2',
        classNum: '12',
        subject: 'Physics',
        bookTitle: 'Physics Part 2',
        chapters: [
            { num: 9,  title: 'Ray Optics and Optical Instruments',                               pdfUrl: `${R2_BASE}/class12/physics-p2/ch01.pdf` },
            { num: 10, title: 'Wave Optics',                                                       pdfUrl: `${R2_BASE}/class12/physics-p2/ch02.pdf` },
            { num: 11, title: 'Dual Nature of Radiation and Matter',                              pdfUrl: `${R2_BASE}/class12/physics-p2/ch03.pdf` },
            { num: 12, title: 'Atoms',                                                             pdfUrl: `${R2_BASE}/class12/physics-p2/ch04.pdf` },
            { num: 13, title: 'Nuclei',                                                            pdfUrl: `${R2_BASE}/class12/physics-p2/ch05.pdf` },
            { num: 14, title: 'Semiconductor Electronics: Materials, Devices and Simple Circuits',pdfUrl: `${R2_BASE}/class12/physics-p2/ch06.pdf` },
        ],
    },
    {
        id: 'r2-12-mathematics-part1',
        classNum: '12',
        subject: 'Mathematics',
        bookTitle: 'Mathematics Part 1',
        chapters: [
            { num: 1, title: 'Relations and Functions',                   pdfUrl: `${R2_BASE}/class12/math-p1/ch01.pdf` },
            { num: 2, title: 'Inverse Trigonometric Functions',           pdfUrl: `${R2_BASE}/class12/math-p1/ch02.pdf` },
            { num: 3, title: 'Matrices',                                  pdfUrl: `${R2_BASE}/class12/math-p1/ch03.pdf` },
            { num: 4, title: 'Determinants',                              pdfUrl: `${R2_BASE}/class12/math-p1/ch04.pdf` },
            { num: 5, title: 'Continuity and Differentiability',          pdfUrl: `${R2_BASE}/class12/math-p1/ch05.pdf` },
            { num: 6, title: 'Application of Derivatives',                pdfUrl: `${R2_BASE}/class12/math-p1/ch06.pdf` },
        ],
    },
    {
        id: 'r2-12-mathematics-part2',
        classNum: '12',
        subject: 'Mathematics',
        bookTitle: 'Mathematics Part 2',
        chapters: [
            { num: 7,  title: 'Integrals',                                pdfUrl: `${R2_BASE}/class12/math-p2/ch01.pdf` },
            { num: 8,  title: 'Application of Integrals',                 pdfUrl: `${R2_BASE}/class12/math-p2/ch02.pdf` },
            { num: 9,  title: 'Differential Equations',                   pdfUrl: `${R2_BASE}/class12/math-p2/ch03.pdf` },
            { num: 10, title: 'Vector Algebra',                           pdfUrl: `${R2_BASE}/class12/math-p2/ch04.pdf` },
            { num: 11, title: 'Three Dimensional Geometry',               pdfUrl: `${R2_BASE}/class12/math-p2/ch05.pdf` },
            { num: 12, title: 'Linear Programming',                       pdfUrl: `${R2_BASE}/class12/math-p2/ch06.pdf` },
            { num: 13, title: 'Probability',                              pdfUrl: `${R2_BASE}/class12/math-p2/ch07.pdf` },
        ],
    },
    {
        id: 'r2-12-biology',
        classNum: '12',
        subject: 'Biology',
        bookTitle: 'Biology',
        chapters: [
            { num: 1,  title: 'Sexual Reproduction in Flowering Plants',  pdfUrl: `${R2_BASE}/class12/biology/ch01.pdf` },
            { num: 2,  title: 'Human Reproduction',                       pdfUrl: `${R2_BASE}/class12/biology/ch02.pdf` },
            { num: 3,  title: 'Reproductive Health',                      pdfUrl: `${R2_BASE}/class12/biology/ch03.pdf` },
            { num: 4,  title: 'Principles of Inheritance and Variation',  pdfUrl: `${R2_BASE}/class12/biology/ch04.pdf` },
            { num: 5,  title: 'Molecular Basis of Inheritance',           pdfUrl: `${R2_BASE}/class12/biology/ch05.pdf` },
            { num: 6,  title: 'Evolution',                                pdfUrl: `${R2_BASE}/class12/biology/ch06.pdf` },
            { num: 7,  title: 'Human Health and Disease',                 pdfUrl: `${R2_BASE}/class12/biology/ch07.pdf` },
            { num: 8,  title: 'Microbes in Human Welfare',                pdfUrl: `${R2_BASE}/class12/biology/ch08.pdf` },
            { num: 9,  title: 'Biotechnology: Principles and Processes',  pdfUrl: `${R2_BASE}/class12/biology/ch09.pdf` },
            { num: 10, title: 'Biotechnology and Its Applications',       pdfUrl: `${R2_BASE}/class12/biology/ch10.pdf` },
            { num: 11, title: 'Organisms and Populations',                pdfUrl: `${R2_BASE}/class12/biology/ch11.pdf` },
            { num: 12, title: 'Ecosystem',                                pdfUrl: `${R2_BASE}/class12/biology/ch12.pdf` },
        ],
    },
    {
        id: 'r2-12-english-flamingo',
        classNum: '12',
        subject: 'English',
        bookTitle: 'Flamingo',
        chapters: [
            { num: 1,  title: 'The Last Lesson',                          pdfUrl: `${R2_BASE}/class12/english-flamingo/ch01.pdf` },
            { num: 2,  title: 'Lost Spring',                              pdfUrl: `${R2_BASE}/class12/english-flamingo/ch02.pdf` },
            { num: 3,  title: 'Deep Water',                               pdfUrl: `${R2_BASE}/class12/english-flamingo/ch03.pdf` },
            { num: 4,  title: 'The Rattrap',                              pdfUrl: `${R2_BASE}/class12/english-flamingo/ch04.pdf` },
            { num: 5,  title: 'Indigo',                                   pdfUrl: `${R2_BASE}/class12/english-flamingo/ch05.pdf` },
            { num: 6,  title: 'Poets and Pancakes',                       pdfUrl: `${R2_BASE}/class12/english-flamingo/ch06.pdf` },
            { num: 7,  title: 'The Interview',                            pdfUrl: `${R2_BASE}/class12/english-flamingo/ch07.pdf` },
            { num: 8,  title: 'Going Places',                             pdfUrl: `${R2_BASE}/class12/english-flamingo/ch08.pdf` },
            { num: 11, title: 'My Mother at Sixty-Six',                   pdfUrl: `${R2_BASE}/class12/english-flamingo/ch11.pdf` },
            { num: 12, title: 'Keeping Quiet',                            pdfUrl: `${R2_BASE}/class12/english-flamingo/ch12.pdf` },
            { num: 13, title: 'A Thing of Beauty',                        pdfUrl: `${R2_BASE}/class12/english-flamingo/ch13.pdf` },
        ],
    },
    {
        id: 'r2-12-english-vistas',
        classNum: '12',
        subject: 'English',
        bookTitle: 'Vistas',
        chapters: [
            { num: 1, title: 'The Third Level',                           pdfUrl: `${R2_BASE}/class12/english-vistas/ch01.pdf` },
            { num: 2, title: 'The Tiger King',                            pdfUrl: `${R2_BASE}/class12/english-vistas/ch02.pdf` },
            { num: 3, title: 'Journey to the End of the Earth',           pdfUrl: `${R2_BASE}/class12/english-vistas/ch03.pdf` },
            { num: 4, title: 'The Enemy',                                 pdfUrl: `${R2_BASE}/class12/english-vistas/ch04.pdf` },
            { num: 5, title: 'On the Face of It',                         pdfUrl: `${R2_BASE}/class12/english-vistas/ch05.pdf` },
            { num: 6, title: 'Memories of Childhood',                     pdfUrl: `${R2_BASE}/class12/english-vistas/ch06.pdf` },
        ],
    },
];


// ── Public API ────────────────────────────────────────────────────────────────

export function getAllNcertBooks(): NcertBook[] {
    return R2_BOOKS;
}

export const ALL_CLASS_NUMS: NcertClassNum[] = ['8', '9', '10', '11', '12'];

// ── CSV parser (used by legacy fetchNcertBooksData for the Chemistry [chapterSlug] SEO pages) ──

function parseCSVRobust(text: string): string[][] {
    const result: string[][] = [];
    let row: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i]; const nextChar = text[i + 1];
        if (char === '"') {
            if (inQuotes && nextChar === '"') { current += '"'; i++; } else inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            row.push(current.trim()); current = '';
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') i++;
            row.push(current.trim());
            if (row.some(c => c.length > 0)) result.push(row);
            row = []; current = '';
        } else { current += char; }
    }
    if (current || row.length > 0) { row.push(current.trim()); if (row.some(c => c.length > 0)) result.push(row); }
    return result;
}

// ── Legacy API (kept for [classSlug]/[chapterSlug] SEO pages) ─────────────────

export interface NcertChapter {
    id: string;
    title: string;
    pdfUrl: string;
    classNum: NcertClassNum;
    category: 'textbook' | 'exemplar' | 'lab-manual';
    subject: string;
}

export interface NcertBooksData {
    textbooks9: NcertChapter[];
    textbooks10: NcertChapter[];
    textbooks11: NcertChapter[];
    textbooks12: NcertChapter[];
    exemplars9: NcertChapter[];
    exemplars10: NcertChapter[];
    exemplars11: NcertChapter[];
    exemplars12: NcertChapter[];
    labManuals9: NcertChapter[];
    labManuals10: NcertChapter[];
    labManuals11: NcertChapter[];
    labManuals12: NcertChapter[];
}

const LEGACY_CLASS_NUMS: Array<'9' | '10' | '11' | '12'> = ['9', '10', '11', '12'];

export async function fetchNcertBooksData(): Promise<NcertBooksData> {
    const data: NcertBooksData = {
        textbooks9: [], textbooks10: [], textbooks11: [], textbooks12: [],
        exemplars9: [], exemplars10: [], exemplars11: [], exemplars12: [],
        labManuals9: [], labManuals10: [], labManuals11: [], labManuals12: [],
    };

    try {
        const res = await fetch(CSV_URL, { next: { revalidate: 86400 } });
        const rows = parseCSVRobust(await res.text());

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.length < 7) continue;
            const id = row[0]; const classNum = row[1]; const title = row[2];
            const tbUrl = row[3]; const exUrl = row[4]; const labTitle = row[5]; const labUrl = row[6];
            if (!LEGACY_CLASS_NUMS.includes(classNum as '9')) continue;
            const cls = classNum as '9' | '10' | '11' | '12';
            const cleanTitle = title.replace(/^Class \d+ NCERT - /, '');

            if (tbUrl)  (data[`textbooks${cls}`]  as NcertChapter[]).push({ id: `tb-${id}`,  title: cleanTitle,                                                            pdfUrl: convertDriveUrl(tbUrl),  classNum: cls, category: 'textbook',   subject: 'Chemistry' });
            if (exUrl)  (data[`exemplars${cls}`]  as NcertChapter[]).push({ id: `ex-${id}`,  title: cleanTitle,                                                            pdfUrl: convertDriveUrl(exUrl),  classNum: cls, category: 'exemplar',   subject: 'Chemistry' });
            if (labUrl) (data[`labManuals${cls}`] as NcertChapter[]).push({ id: `lab-${id}`, title: labTitle ? labTitle.replace(/^Unit \d+ -\s*/, '').trim() : cleanTitle, pdfUrl: convertDriveUrl(labUrl), classNum: cls, category: 'lab-manual', subject: 'Chemistry' });
        }
    } catch (e) {
        console.error('Error fetching NCERT books data:', e);
    }
    return data;
}

export function getChapters(data: NcertBooksData, classNum: '9' | '10' | '11' | '12', category: 'textbook' | 'exemplar' | 'lab-manual'): NcertChapter[] {
    const prefix = category === 'textbook' ? 'textbooks' : category === 'exemplar' ? 'exemplars' : 'labManuals';
    return data[`${prefix}${classNum}` as keyof NcertBooksData] as NcertChapter[];
}

export function slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export interface ChapterGroup {
    classNum: '9' | '10' | '11' | '12';
    baseId: string;
    slug: string;
    title: string;
    subject: string;
    textbook: NcertChapter | null;
    exemplar: NcertChapter | null;
    labManual: NcertChapter | null;
}

function baseIdOf(chapter: NcertChapter): string {
    return chapter.id.replace(/^(tb|ex|lab)-/, '');
}

export function getChapterGroupsForClass(data: NcertBooksData, classNum: '9' | '10' | '11' | '12'): ChapterGroup[] {
    const textbooks  = data[`textbooks${classNum}`  as keyof NcertBooksData] as NcertChapter[];
    const exemplars  = data[`exemplars${classNum}`  as keyof NcertBooksData] as NcertChapter[];
    const labManuals = data[`labManuals${classNum}` as keyof NcertBooksData] as NcertChapter[];
    const groupsById = new Map<string, ChapterGroup>();

    const upsert = (baseId: string, title: string, subject: string, slot: 'textbook' | 'exemplar' | 'labManual', chapter: NcertChapter) => {
        let g = groupsById.get(baseId);
        if (!g) { g = { classNum, baseId, slug: slugify(title), title, subject, textbook: null, exemplar: null, labManual: null }; groupsById.set(baseId, g); }
        g[slot] = chapter;
    };

    for (const c of textbooks) upsert(baseIdOf(c), c.title, c.subject, 'textbook', c);
    for (const c of exemplars) {
        const bid = baseIdOf(c);
        if (!groupsById.has(bid)) upsert(bid, c.title, c.subject, 'exemplar', c);
        else groupsById.get(bid)!.exemplar = c;
    }
    for (const c of labManuals) {
        const bid = baseIdOf(c);
        if (!groupsById.has(bid)) upsert(bid, c.title, c.subject, 'labManual', c);
        else groupsById.get(bid)!.labManual = c;
    }

    const seenSlugs = new Set<string>();
    return Array.from(groupsById.values()).map((g) => {
        let slug = g.slug;
        if (seenSlugs.has(slug)) slug = `${slug}-${g.baseId}`;
        seenSlugs.add(slug);
        return { ...g, slug };
    });
}

export async function getChapterGroupBySlug(classNum: '9' | '10' | '11' | '12', slug: string): Promise<ChapterGroup | null> {
    const data = await fetchNcertBooksData();
    return getChapterGroupsForClass(data, classNum).find((g) => g.slug === slug) ?? null;
}

// Used by sitemap and [chapterSlug] page (Chemistry-only, classes 9–12)
export const CHEMISTRY_CLASS_NUMS: Array<'9' | '10' | '11' | '12'> = ['9', '10', '11', '12'];

export async function getAllChapterGroups(): Promise<ChapterGroup[]> {
    const data = await fetchNcertBooksData();
    return CHEMISTRY_CLASS_NUMS.flatMap((c) => getChapterGroupsForClass(data, c));
}
