import AssertionReasonClient from './AssertionReasonClient';
import { fetchAssertionReasonQuestions } from '../lib/assertionReasonData';

export const metadata = {
    title: 'Circuit Breaker - Assertion & Reason Practice | Canvas Classes',
    description: 'Master NCERT assertion and reason questions with our unique 3-step decision flow and spaced repetition. Practice Chemistry assertion-reason for CBSE Boards.',
    keywords: ['assertion reason', 'chemistry', 'NCERT', 'CBSE', 'Class 12', 'practice', 'spaced repetition'],
};

export default async function AssertionReasonPage() {
    const questions = await fetchAssertionReasonQuestions();

    return <AssertionReasonClient initialQuestions={questions} />;
}
