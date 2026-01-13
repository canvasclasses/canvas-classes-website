import AssertionReasonClient from './AssertionReasonClient';
import { fetchAssertionReasonQuestions } from '../lib/assertionReasonData';

export const metadata = {
    title: 'Assertion & Reason Questions Chemistry Class 12 - Practice for CBSE, NEET | Canvas Classes',
    description: 'Practice NCERT assertion-reason questions for Chemistry Class 12 with our unique 3-step decision flow. Spaced repetition for CBSE Boards & NEET 2025-26 preparation.',
    keywords: ['assertion reason questions Class 12', 'Chemistry assertion reason CBSE', 'MCQ assertion reason Chemistry', 'NEET assertion reason practice', 'NCERT Chemistry assertion', 'Class 12 Chemistry MCQs', 'spaced repetition Chemistry'],
};

export default async function AssertionReasonPage() {
    const questions = await fetchAssertionReasonQuestions();

    return <AssertionReasonClient initialQuestions={questions} />;
}
