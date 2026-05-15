/**
 * SEO helpers for live book pages — shared by both /class-9/[book]/[page]
 * and /books/[book]/[page] routes so the metadata stays consistent.
 *
 * Responsibilities:
 *   1. buildBookPageMetadata()  — returns a Next.js Metadata object with
 *      per-page title, description, keywords, canonical URL, OG + Twitter.
 *   2. buildBookPageJsonLd()    — returns a Schema.org `LearningResource`
 *      graph that the page route embeds as <script type="application/ld+json">.
 *
 * Deliberate design choices:
 *   • Descriptions are mined from page.subtitle first, then fall back to
 *     stripping the first TextBlock's markdown. This keeps metadata tied to
 *     what the student actually reads on page — no hand-authored SEO drift.
 *   • Keyword sets are intentionally overweight on NCERT / Class X / subject
 *     because those are the live search gaps (new NCERT Class 9 books are
 *     not yet on the official site at the time of writing).
 *   • Canonical URLs always point at /class-9/* for Class 9 books, matching
 *     the 301 redirect in middleware.ts — we never want two indexable URLs.
 */

import type { Metadata } from 'next';
import type { Book, BookPage, ContentBlock, TextBlock } from '@/types/books';

export const SITE_URL = 'https://www.canvasclasses.in';

// ── Label maps ────────────────────────────────────────────────────────────
// Kept inline so SEO copy stays in one file and isn't subject to drift from
// display-only UI labels elsewhere in the codebase.

const GRADE_LABELS: Record<number, string> = {
  6: 'Class 6', 7: 'Class 7', 8: 'Class 8', 9: 'Class 9',
  10: 'Class 10', 11: 'Class 11', 12: 'Class 12',
};

const SUBJECT_LABELS: Record<string, string> = {
  chemistry: 'Chemistry',
  biology: 'Biology',
  physics: 'Physics',
  mathematics: 'Mathematics',
  science: 'Science',
  social_science: 'Social Science',
};

// ── Utility: turn a markdown block into a clean excerpt ───────────────────

/**
 * Strip enough markdown/LaTeX/HTML that the result reads cleanly as a
 * meta description. Not a full parser — just enough to get rid of the
 * obvious syntax noise.
 */
function stripMarkdown(md: string): string {
  return md
    // math — drop entire $...$ spans so readers don't see LaTeX
    .replace(/\$[^$\n]*\$/g, '')
    // images: ![alt](url "title") → alt
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    // links: [text](url) → text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // headings / emphasis / code / blockquote markers
    .replace(/[*_`~>#]/g, '')
    // residual HTML tags
    .replace(/<[^>]+>/g, '')
    // collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Find the first text block by display order, strip markdown, and truncate
 * to roughly `max` chars at a word boundary. Returns empty string if the
 * page has no text block (e.g. pages made entirely of interactive blocks).
 */
function firstTextBlockExcerpt(blocks: ContentBlock[] | undefined, max = 155): string {
  if (!blocks?.length) return '';
  const firstText = [...blocks]
    .sort((a, b) => a.order - b.order)
    .find((b): b is TextBlock => b.type === 'text');
  if (!firstText?.markdown) return '';
  const stripped = stripMarkdown(firstText.markdown);
  if (stripped.length <= max) return stripped;
  // Cut at last word boundary inside the budget
  const cut = stripped.slice(0, max - 1);
  const spaceIdx = cut.lastIndexOf(' ');
  const body = spaceIdx > max * 0.6 ? cut.slice(0, spaceIdx) : cut;
  return `${body}…`;
}

// ── Public API ────────────────────────────────────────────────────────────

interface BuildArgs {
  book: Pick<Book, 'slug' | 'title' | 'subject' | 'grade' | 'chapters' | 'cover_image'>;
  page: Pick<BookPage, 'slug' | 'title' | 'subtitle' | 'chapter_number' | 'blocks' | 'tags' | 'updated_at' | 'created_at'>;
  /**
   * Canonical URL base. Use `/class-9` for Class 9 books (matches the 301
   * redirect in middleware.ts) and `/books` for other grades.
   */
  basePath: string;
}

export function buildBookPageMetadata({ book, page, basePath }: BuildArgs): Metadata {
  const chapter = book.chapters.find((c) => c.number === page.chapter_number);
  const gradeLabel = GRADE_LABELS[book.grade] ?? `Class ${book.grade}`;
  const subjectLabel = SUBJECT_LABELS[book.subject] ?? book.subject;

  // Title format: "Page Title — Class 9 Science Chapter 0"
  // Keep under ~60 chars where possible so Google doesn't truncate.
  const chapterSuffix = Number.isFinite(page.chapter_number)
    ? ` Chapter ${page.chapter_number}`
    : '';
  const title = `${page.title} — ${gradeLabel} ${subjectLabel}${chapterSuffix}`;

  // Description: prefer the author-written subtitle, fall back to content.
  const contentDesc = page.subtitle?.trim() || firstTextBlockExcerpt(page.blocks);
  const description = contentDesc
    ? `${contentDesc} · ${gradeLabel} NCERT ${subjectLabel} — Canvas Classes.`
    : `${page.title} — an interactive ${gradeLabel} NCERT ${subjectLabel} lesson with simulations, quizzes, and worked examples from Canvas Classes.`;

  // Keywords — weighted toward the "new NCERT Class 9" search gap.
  // Order matters less than coverage; dedupe to be safe.
  const rawKeywords = [
    `${gradeLabel} ${subjectLabel}`,
    `${gradeLabel} NCERT ${subjectLabel}`,
    `NCERT ${gradeLabel}`,
    `${gradeLabel} NCERT new syllabus`,
    `NCERT ${subjectLabel} ${gradeLabel}`,
    chapter?.title,
    chapter ? `${gradeLabel} ${subjectLabel} Chapter ${chapter.number}` : null,
    page.title,
    `${page.title} ${gradeLabel}`,
    'Canvas Classes',
    'Paaras Sir',
    ...(page.tags ?? []),
  ];
  const keywords = Array.from(
    new Set(rawKeywords.filter((k): k is string => Boolean(k && k.trim())))
  );

  const canonical = `${SITE_URL}${basePath}/${book.slug}/${page.slug}`;

  // Prefer the book's cover_image as the OG fallback; the route may also
  // colocate an opengraph-image.tsx that Next will auto-inject — in that
  // case this array is overridden by the route-level asset.
  const ogImage = book.cover_image
    ? [{ url: book.cover_image, width: 1200, height: 630, alt: book.title }]
    : undefined;

  const published = page.created_at ? new Date(page.created_at).toISOString() : undefined;
  const modified = page.updated_at ? new Date(page.updated_at).toISOString() : undefined;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    authors: [{ name: 'Paaras Sir', url: SITE_URL }],
    category: 'Education',
    openGraph: {
      type: 'article',
      url: canonical,
      siteName: 'Canvas Classes',
      title,
      description,
      locale: 'en_IN',
      publishedTime: published,
      modifiedTime: modified,
      authors: ['Paaras Sir'],
      section: `${gradeLabel} ${subjectLabel}`,
      tags: keywords.slice(0, 10),
      images: ogImage,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@canvasclasses',
      site: '@canvasclasses',
      images: book.cover_image ? [book.cover_image] : undefined,
    },
  };
}

// ── Structured data (Schema.org LearningResource) ─────────────────────────

/**
 * Build a Schema.org `LearningResource` graph for a book page. Google uses
 * this to understand "this is a Class 9 Science lesson about X" and can
 * surface it in rich results / Discover / Classroom-style search features.
 *
 * We emit LearningResource (not Article) because these pages are
 * pedagogical content units, not journalism.
 */
export function buildBookPageJsonLd({ book, page, basePath }: BuildArgs) {
  const chapter = book.chapters.find((c) => c.number === page.chapter_number);
  const gradeLabel = GRADE_LABELS[book.grade] ?? `Class ${book.grade}`;
  const subjectLabel = SUBJECT_LABELS[book.subject] ?? book.subject;
  const canonical = `${SITE_URL}${basePath}/${book.slug}/${page.slug}`;

  const description =
    page.subtitle?.trim() ||
    firstTextBlockExcerpt(page.blocks) ||
    `${gradeLabel} ${subjectLabel} — ${page.title}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    '@id': canonical,
    url: canonical,
    name: page.title,
    headline: `${page.title} — ${gradeLabel} ${subjectLabel}`,
    description,
    inLanguage: 'en-IN',
    educationalLevel: gradeLabel,
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      audienceType: `${gradeLabel} student`,
    },
    learningResourceType: 'Lesson',
    about: [
      { '@type': 'Thing', name: subjectLabel },
      ...(chapter ? [{ '@type': 'Thing', name: chapter.title }] : []),
    ],
    teaches: chapter?.title ?? subjectLabel,
    isPartOf: {
      '@type': 'Book',
      name: book.title,
      bookFormat: 'https://schema.org/EBook',
      inLanguage: 'en-IN',
      ...(book.cover_image ? { image: book.cover_image } : {}),
    },
    educationalAlignment: {
      '@type': 'AlignmentObject',
      alignmentType: 'educationalSubject',
      educationalFramework: 'NCERT',
      targetName: `${gradeLabel} ${subjectLabel}`,
    },
    author: {
      '@type': 'Person',
      name: 'Paaras Sir',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'EducationalOrganization',
      name: 'Canvas Classes',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
    },
    ...(page.created_at ? { datePublished: new Date(page.created_at).toISOString() } : {}),
    ...(page.updated_at ? { dateModified: new Date(page.updated_at).toISOString() } : {}),
    isAccessibleForFree: true,
  };
}
