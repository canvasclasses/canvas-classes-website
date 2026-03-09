import { getTaxonomy, getChapterQuestionCounts } from './actions';
import CrucibleWizard from './components/CrucibleWizard';
import { Metadata } from 'next';
import { createClient } from '../utils/supabase/server';

export const revalidate = 3600; // Revalidate every hour — question counts don't change per-request

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
    const supabase = await createClient();
    const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

    // Always bypass auth in development mode (localhost)
    const isLoggedIn = process.env.NODE_ENV === 'development' || !!user;

    const [chapters, questionCounts] = await Promise.all([
        getTaxonomy(),
        getChapterQuestionCounts(),
    ]);

    const chaptersWithCounts = chapters.map(ch => ({
        ...ch,
        question_count: questionCounts[ch.id] ?? 0,
    }));

    return (
        <CrucibleWizard chapters={chaptersWithCounts} isLoggedIn={isLoggedIn} />
    );
}
