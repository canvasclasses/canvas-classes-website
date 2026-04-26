import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import {
  getQuestionBySlug,
  getAdjacentQuestions,
  getRelatedCrucibleQuestions,
  getTaxonomy,
} from '../../actions';
import QuestionDetailPage from './QuestionDetailPage';

// ISR: revalidate daily — solutions updated infrequently
export const revalidate = 86400;

// No pages pre-built at deploy time — generated on first request and cached via ISR.
// With revalidate = 86400, each page is built once per day on first visit.
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
  const result = await getQuestionBySlug(slug);
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

  const examSource = question.metadata.exam_source;
  const examLabel = examSource?.exam && examSource?.year
    ? `${examSource.exam} ${examSource.year}${examSource.shift ? ` ${examSource.shift}` : ''}`
    : 'JEE PYQ';

  const title = `${question.display_id}: ${rawText.substring(0, 55)}... | ${examLabel} | Canvas Classes`;
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
  const result = await getQuestionBySlug(slug);

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
