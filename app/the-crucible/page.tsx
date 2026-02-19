import { getTaxonomy, getChapterQuestionCounts } from './actions';
import CrucibleLanding from './components/CrucibleLanding';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'The Crucible | Forge Your Rank - Master Chemistry',
    description: 'Master Chemistry one question at a time. Personalized practice sessions and mock tests designed by Paaras Sir for JEE Main, JEE Advanced, and NEET.',
    keywords: [
        'JEE Question Bank',
        'Paaras Sir Chemistry',
        'IIT JEE Practice',
        'JEE Main 2026',
        'JEE Advanced Mock Test',
        'NEET Chemistry',
        'Canvas Classes Crucible'
    ],
};

export default async function Page() {
    const [chapters, questionCounts] = await Promise.all([
        getTaxonomy(),
        getChapterQuestionCounts(),
    ]);

    const chaptersWithCounts = chapters.map(ch => ({
        ...ch,
        question_count: questionCounts[ch.id] ?? 0,
    }));

    return (
        <CrucibleLanding chapters={chaptersWithCounts} />
    );
}
