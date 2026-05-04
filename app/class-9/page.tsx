import type { Metadata } from 'next';
import connectToDatabase from '@/lib/mongodb';
import BookModel from '@/lib/models/Book';
import BookPageModel from '@/lib/models/BookPage';
import GradeLandingPage, {
  type GradeBook,
  type GradePage,
} from '@/components/books/GradeLandingPage';
import LiveBooksComingSoon from '@/components/books/LiveBooksComingSoon';

const EXPECTED_SUBJECTS = ['Science', 'Mathematics', 'Social Science'];

export const revalidate = 60;

const SITE_URL = 'https://www.canvasclasses.in';
const CANONICAL = `${SITE_URL}/class-9`;

// This page is the primary landing for the "new NCERT Class 9" search
// gap — students, parents, and teachers are searching for the updated
// syllabus while it hasn't yet appeared on the official NCERT site.
// Metadata is tuned to rank against those queries.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Class 9 NCERT — New Syllabus Live Books (Science, Maths, Physics) | Canvas Classes',
  description:
    'Read the new NCERT Class 9 syllabus as interactive live books — Science, Mathematics, Physics. Chapter-wise lessons with simulations, worked examples, quizzes, and Hinglish mode. Free on Canvas Classes.',
  keywords: [
    'Class 9 NCERT',
    'Class 9 NCERT new syllabus',
    'NCERT Class 9 Science',
    'NCERT Class 9 new book',
    'Class 9 Science chapter',
    'Class 9 Maths NCERT',
    'Class 9 Physics NCERT',
    'NCERT 2026 Class 9',
    'Class 9 live book',
    'CBSE Class 9',
    'Class 9 Hinglish',
    'Canvas Classes',
    'Paaras Sir',
  ],
  alternates: { canonical: CANONICAL },
  authors: [{ name: 'Paaras Sir', url: SITE_URL }],
  category: 'Education',
  openGraph: {
    type: 'website',
    url: CANONICAL,
    siteName: 'Canvas Classes',
    locale: 'en_IN',
    title: 'Class 9 NCERT — New Syllabus Live Books',
    description:
      'Chapter-wise NCERT Class 9 lessons with simulations, worked examples, and Hinglish mode. Science, Maths, Physics — free.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Class 9 NCERT — New Syllabus Live Books',
    description:
      'Chapter-wise NCERT Class 9 lessons with simulations, worked examples, and Hinglish mode.',
    creator: '@canvasclasses',
    site: '@canvasclasses',
  },
};

export default async function Class9Page() {
  await connectToDatabase();

  const rawBooks = await BookModel.find({ grade: 9, is_published: true })
    .sort({ subject: 1, title: 1 })
    .lean();

  // No published Class 9 books yet — render the coming soon page
  // (mirrors the Class 10 fallback pattern).
  if (rawBooks.length === 0) {
    return <LiveBooksComingSoon grade={9} expectedSubjects={EXPECTED_SUBJECTS} />;
  }

  // Only published chapters per book
  const books: GradeBook[] = rawBooks.map((b) => ({
    _id: String(b._id),
    slug: String(b.slug),
    title: String(b.title),
    subject: String(b.subject),
    grade: Number(b.grade),
    chapters: b.chapters
      .filter((c) => c.is_published)
      .sort((a, b) => a.number - b.number)
      .map((c) => ({
        number: c.number,
        title: c.title,
        slug: c.slug,
      })),
  }));

  // Fetch published pages for all published chapters across all books
  const bookIds = books.map((b) => b._id);
  const publishedChapterNums = books.flatMap((b) => b.chapters.map((c) => c.number));

  const rawPages =
    bookIds.length === 0
      ? []
      : await BookPageModel.find({
          book_id: { $in: bookIds },
          chapter_number: { $in: publishedChapterNums },
          published: true,
        })
          .select('book_id slug title chapter_number page_number reading_time_min content_types video_title')
          .sort({ chapter_number: 1, page_number: 1 })
          .lean();

  const pages: GradePage[] = rawPages.map((p) => ({
    book_id: String(p.book_id),
    slug: p.slug,
    title: p.title,
    chapter_number: p.chapter_number,
    page_number: p.page_number,
    reading_time_min: p.reading_time_min ?? null,
    content_types:
      (p as Record<string, unknown>).content_types as GradePage['content_types'] ?? null,
    video_title: (p as Record<string, unknown>).video_title as string ?? null,
  }));

  // ── Structured data ────────────────────────────────────────────────
  //
  // We emit a @graph with three nodes:
  //   1. CollectionPage — tells Google "this page lists lessons/books"
  //   2. ItemList        — the actual list of books, letting Google
  //                        show them as rich results
  //   3. FAQPage         — answers the high-intent queries that parents
  //                        and teachers are typing right now about the
  //                        new NCERT Class 9 syllabus
  //
  // The FAQ content is chosen deliberately to map to searches that are
  // spiking while the official NCERT site hasn't published the new books.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/class-9#collection`,
        url: CANONICAL,
        name: 'Class 9 NCERT — New Syllabus Live Books',
        description:
          'Interactive NCERT-aligned Class 9 live books covering Science, Mathematics, and Physics with simulations, quizzes, and Hinglish mode.',
        inLanguage: 'en-IN',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Canvas Classes',
          url: SITE_URL,
        },
        about: {
          '@type': 'EducationalOccupationalProgram',
          name: 'Class 9 NCERT Curriculum',
          educationalLevel: 'Class 9',
          educationalProgramMode: 'online',
        },
        audience: {
          '@type': 'EducationalAudience',
          educationalRole: 'student',
          audienceType: 'Class 9 students, parents, teachers',
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/class-9#books`,
        numberOfItems: books.length,
        itemListElement: books.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/class-9/${b.slug}`,
          name: b.title,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/class-9#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Has NCERT released the new Class 9 books for the updated syllabus?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'The new NCERT Class 9 books for the revised syllabus have not yet been published on the official NCERT website. Canvas Classes Live Books cover the updated Class 9 syllabus chapter-wise with interactive lessons, simulations, and worked examples — free and openly accessible while the official books are being finalised.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which Class 9 subjects are available as Canvas Classes Live Books?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Canvas Classes currently covers ${books.map((b) => b.title).join(', ')} for Class 9 — all aligned to the updated NCERT syllabus. More subjects are being added as the new syllabus is released.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Are the Canvas Classes Class 9 Live Books free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Yes. Every Class 9 live book on Canvas Classes is free to read in full, including interactive simulations, worked examples, and the Hinglish language mode. No payment or premium upgrade is required.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do the Class 9 live books cover the NCERT syllabus exactly?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Yes. Chapters follow the updated NCERT Class 9 syllabus structure. Each chapter is broken into short, focused pages with visuals, simulations, and quizzes — so students can read linearly like a textbook but also revisit specific concepts.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can Class 9 students read Canvas live books in Hinglish?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Yes. Most Class 9 pages ship with an EN / HI toggle. The Hinglish version is a full re-explanation in the language students actually use — not a literal translation — so the concept lands naturally.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GradeLandingPage grade={9} books={books} pages={pages} basePath="/class-9" />
    </>
  );
}
