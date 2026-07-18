import { notFound, redirect } from 'next/navigation';
import { cache } from 'react';
import { Metadata } from 'next';
import {
  getQuestionBySlug,
  getAdjacentQuestions,
  getRelatedCrucibleQuestions,
  getTaxonomy,
} from '@/features/crucible/server-actions/the-crucible';
import { formatExamLabel } from '@/features/crucible/components/examLabel';
import QuestionDetailPage from './QuestionDetailPage';

// Dedupe the question read so generateMetadata + Page share ONE DB fetch per
// request instead of fetching the full doc twice (vercel-cost #20b).
const getQuestion = cache(getQuestionBySlug);

// ISR: 28-day revalidate — solutions change infrequently. Admin question edits
// run in a separate deployment, so revalidateTag('questions') there does not
// cross-invalidate this page's ISR cache; edits reach students via the
// secret-gated /api/revalidate bridge instead (cache redesign Phase 1 —
// _agents/plans/CRUCIBLE_CACHE_SEO_REDESIGN.md). Crawlers sweep this surface
// ~weekly, so the earlier 7d window put ~every visit just past expiry and
// triggered a stale-while-revalidate rebuild (2026-07 diagnosis); 28d lets
// ~3 of 4 sweeps hit fresh. This window is only the self-healing backstop.
export const revalidate = 2419200;

// No pages pre-built at deploy time — generated on first request and cached via ISR.
// This keeps deploy times fast regardless of how many questions exist.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getQuestion(slug);
  if (!result) return { title: 'Question Not Found | The Crucible' };

  const { question } = result;

  // Get chapter name for metadata
  const chapters = await getTaxonomy();
  const chapter = chapters.find((c) => c.id === question.metadata.chapter_id);
  const chapterName = chapter?.name || 'Chemistry';

  // Build a clean plain-text snippet from markdown (strip markdown syntax)
  const rawText = question.question_text.markdown
    .replace(/!\[.*?\]\(.*?\)/g, '') // remove images
    .replace(/\$\$?[^$]*\$\$?/g, '[formula]') // replace math blocks
    .replace(/[*_`#>]/g, '') // strip common markdown chars
    .trim()
    .substring(0, 160);

  // Exam label uses the shared `formatExamLabel` helper.
  // See app/the-crucible/components/examLabel.ts.
  const examLabel = formatExamLabel(
    question.metadata.examDetails,
    question.metadata.exam_source
  ) ?? 'JEE PYQ';

  // Title leads with the QUESTION TEXT (what students actually search /
  // paste), never the internal display_id — the audit (2026-07-18) found the
  // old `GOC-524: …` pattern spent the highest-value title slot on a token
  // nobody searches, and Google fell back to bare "Canvasclasses" on at
  // least one page. display_id trails for brand/reference.
  // Verbatim question text FIRST (matches pasted-question searches + Google
  // Lens photo→text queries; Google bolds the matched words), "— Solved" as a
  // compact suffix promise (founder decision 2026-07-18, option B: text-first
  // survives mobile truncation, no content-farm prefix; SEO_PLAYBOOK Part G).
  const title = `${rawText.substring(0, 70)} — Solved (${examLabel}) | ${question.display_id}`;
  // Subject-neutral attribution (2026-07-18): this surface serves ALL
  // subjects; "by Paaras Sir" mis-credited physics/maths solutions to a
  // chemistry teacher, and teacher-as-brand-face is an open decision
  // (QUESTION_LIBRARY_SPEC §7).
  const description = `${examLabel} question on ${chapterName}. ${rawText.substring(0, 120)}. Free step-by-step solution${question.solution.video_url ? ' with video explanation' : ''} — Canvas Classes.`;

  return {
    title,
    description,
    keywords: [
      question.display_id,
      examLabel,
      chapterName,
      'JEE PYQ solution',
      'chemistry previous year question',
      'Canvas Classes',
      ...(question.solution.video_url ? ['video solution', 'video explanation'] : []),
    ],
    alternates: {
      canonical: `https://www.canvasclasses.in/the-crucible/q/${question.id}`,
    },
    openGraph: {
      // Question-text-first here too — OG titles are what WhatsApp/Telegram
      // shares display, and a student sharing into a 200-member prep group
      // needs the link to say what the question IS, not an internal ID.
      title: `${rawText.substring(0, 70)} (${examLabel}) | Canvas Classes`,
      description,
      url: `https://www.canvasclasses.in/the-crucible/q/${question.id}`,
      siteName: 'Canvas Classes',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${rawText.substring(0, 70)} (${examLabel}) | Canvas Classes`,
      description,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getQuestion(slug);

  if (!result) notFound();

  // Permanent redirect: display_id URL → canonical UUID URL
  if (result.redirectTo) {
    redirect(result.redirectTo);
  }

  const { question } = result;

  // Fetch adjacent + related in parallel
  const [adjacent, related, chapters] = await Promise.all([
    getAdjacentQuestions(question.metadata.chapter_id, question.display_id),
    getRelatedCrucibleQuestions(question.metadata.chapter_id, question.id, 5),
    getTaxonomy(),
  ]);

  const chapter = chapters.find((c) => c.id === question.metadata.chapter_id) ?? null;

  return (
    <QuestionDetailPage
      question={question}
      chapter={chapter}
      adjacent={adjacent}
      related={related}
    />
  );
}
