import { getQuestions } from './actions';
import QuestionBankGame from '@/components/question-bank/QuestionBankGame';

export const dynamic = 'force-dynamic'; // Ensure we always fetch fresh data

export default async function Page() {
    const questions = await getQuestions();

    return (
        <QuestionBankGame initialQuestions={questions} />
    );
}
