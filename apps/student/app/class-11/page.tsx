import type { Metadata } from 'next';
import connectToDatabase from '@canvas/data/db/mongodb';
import BookModel from '@canvas/data/models/Book';
import BookPageModel from '@canvas/data/models/BookPage';
import GradeLandingPage, {
  type GradeBook,
  type GradePage,
} from '@/features/books/components/GradeLandingPage';
import LiveBooksComingSoon from '@/features/books/components/LiveBooksComingSoon';
import { loadChapterImagery } from '@/features/books/lib/bookImagery';

// CLAUDE.md §10.5: a class hub is effectively static → 24h. `revalidate = 60`
// is forbidden by §10.2. For instant turnaround after a Class 11 book edit the
// admin save flow should call revalidatePath('/class-11') instead of
// shortening this window.
export const revalidate = 86400;

const SITE_URL = 'https://www.canvasclasses.in';
const CANONICAL = `${SITE_URL}/class-11`;

const EXPECTED_SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];

/**
 * Books whose URL segment under /class-11 differs from their DB slug.
 * Chemistry shipped first at /class-11/chemistry with the slug
 * `ncert-simplified`; those URLs are indexed, so the segment is pinned here
 * rather than migrated. New books should just use their slug.
 */
const URL_SEGMENTS: Record<string, string> = {
  'ncert-simplified': 'chemistry',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Class 11 NCERT Live Books — Physics, Chemistry, Maths, Biology',
  description:
    'Read the NCERT Class 11 syllabus as interactive live books — Physics, Chemistry, Mathematics and Biology. Chapter-wise lessons with simulations, worked examples, quizzes and Hinglish mode. Free on Canvas Classes.',
  keywords: [
    'Class 11 NCERT',
    'NCERT Class 11 Physics',
    'NCERT Class 11 Chemistry',
    'NCERT Class 11 Maths',
    'NCERT Class 11 Biology',
    'Class 11 live book',
    'CBSE Class 11',
    'Class 11 JEE preparation',
    'Class 11 NEET preparation',
    'Class 11 Hinglish',
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
    title: 'Class 11 NCERT Live Books — Physics, Chemistry, Maths, Biology',
    description:
      'Chapter-wise NCERT Class 11 lessons with simulations, worked examples and Hinglish mode — free.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Class 11 NCERT Live Books',
    description:
      'Chapter-wise NCERT Class 11 lessons with simulations, worked examples and Hinglish mode.',
    creator: '@canvasclasses',
    site: '@canvasclasses',
  },
};

export default async function Class11Page() {
  await connectToDatabase();

  const rawBooks = await BookModel.find({ grade: 11, is_published: true })
    .sort({ subject: 1, title: 1 })
    .lean();

  if (rawBooks.length === 0) {
    return <LiveBooksComingSoon grade={11} expectedSubjects={EXPECTED_SUBJECTS} />;
  }

  const books: GradeBook[] = rawBooks.map((b) => ({
    _id: String(b._id),
    slug: String(b.slug),
    cover_image: ((b as Record<string, unknown>).cover_image as string) ?? null,
    url_segment: URL_SEGMENTS[String(b.slug)],
    title: String(b.title),
    subject: String(b.subject),
    grade: Number(b.grade),
    chapters: b.chapters
      .filter((c) => c.is_published)
      .sort((a, b2) => a.number - b2.number)
      .map((c) => ({ number: c.number, title: c.title, slug: c.slug, description: c.description ?? null })),
  }));

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
      ((p as Record<string, unknown>).content_types as GradePage['content_types']) ?? null,
    video_title: ((p as Record<string, unknown>).video_title as string) ?? null,
  }));

  // Real artwork from inside the books — see features/books/lib/bookImagery.ts.
  // One page per chapter, bounded, behind this page's 24h ISR cache.
  const imagery = await loadChapterImagery(
    books.map((b) => ({ _id: b._id, chapterNumbers: b.chapters.map((c) => c.number) })),
  );

  for (const b of books) {
    // a cover set by hand on the book document always wins
    b.cover_image = b.cover_image ?? imagery.covers.get(b._id) ?? null;
    for (const c of b.chapters) {
      c.thumbnail = imagery.thumbnails.get(`${b._id}:${c.number}`) ?? null;
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/class-11#collection`,
        url: CANONICAL,
        name: 'Class 11 NCERT Live Books',
        description:
          'Interactive NCERT-aligned Class 11 live books across Physics, Chemistry, Mathematics and Biology, with simulations, quizzes and Hinglish mode.',
        inLanguage: 'en-IN',
        isPartOf: { '@type': 'WebSite', name: 'Canvas Classes', url: SITE_URL },
        about: {
          '@type': 'EducationalOccupationalProgram',
          name: 'Class 11 NCERT Curriculum',
          educationalLevel: 'Class 11',
          educationalProgramMode: 'online',
        },
        audience: {
          '@type': 'EducationalAudience',
          educationalRole: 'student',
          audienceType: 'Class 11 students, parents, teachers',
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/class-11#books`,
        numberOfItems: books.length,
        itemListElement: books.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/class-11/${b.url_segment ?? b.slug}`,
          name: b.title,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GradeLandingPage grade={11} books={books} pages={pages} basePath="/class-11" />
    </>
  );
}
