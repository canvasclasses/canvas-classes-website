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

  const title = `${question.display_id}: ${rawText.substring(0, 55)}... | ${examLabel}`;
  const description = `${examLabel} question on ${chapterName}. ${rawText.substring(0, 120)}. Full solution${question.solution.video_url ? ' with video explanation' : ''} by Paaras Sir.`;

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
      title: `${question.display_id} — ${examLabel} | Canvas Classes`,
      description,
      url: `https://www.canvasclasses.in/the-crucible/q/${question.id}`,
      siteName: 'Canvas Classes',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${question.display_id} — ${examLabel} | Canvas Classes`,
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
