import { Metadata } from 'next';
import FlashcardsClient from './FlashcardsClient';

export const metadata: Metadata = {
    title: 'Chemistry Flashcards - Class 12 | Canvas Classes',
    description: 'Practice Chemistry flashcards for Class 12 CBSE, JEE & NEET. Interactive spaced repetition cards covering all chapters - Solutions, Electrochemistry, Biomolecules & more.',
    keywords: ['chemistry flashcards', 'class 12 flashcards', 'CBSE flashcards', 'JEE chemistry cards', 'NEET chemistry revision'],
};

export default function FlashcardsPage() {
    return <FlashcardsClient />;
}
