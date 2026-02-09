import { getQuestions } from './actions';
import QuestionBankGame from '@/components/question-bank/QuestionBankGame';
import { Metadata } from 'next';
import Script from 'next/script';

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every 1 hour (3600 seconds)

export const metadata: Metadata = {
    title: 'The Crucible | Personalized JEE Question Bank by Paaras Sir',
    description: 'The industry-leading adaptive practice platform for JEE Main & Advanced. Features Smart Failure Analysis, Guru Mode explanations directly by Paaras Sir, and AI-driven insights to pinpoint your weak areas. Stop practicing blindly—start training strategically.',
    keywords: [
        'JEE Question Bank',
        'Paaras Sir Chemistry',
        'Smart Failure Analysis',
        'IIT JEE Practice',
        'JEE Main 2026',
        'JEE Advanced Mock Test',
        'Adaptive Learning Platform',
        'Canvas Classes Crucible'
    ],
    openGraph: {
        title: 'The Crucible | Master JEE Chemistry with Paaras Sir',
        description: 'Experience the smartest way to prepare for JEE. Personalized insights, manual curation by Paaras Sir, and deep error analysis.',
        type: 'website',
        locale: 'en_IN',
        siteName: 'Canvas Classes',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'The Crucible - Ultimate JEE Training Ground',
        description: 'Personalized explanations by Paaras Sir & detailed error analysis.',
    }
};

export default async function Page() {
    const questions = await getQuestions();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'The Crucible',
        'applicationCategory': 'EducationalApplication',
        'operatingSystem': 'Web Browser',
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'INR'
        },
        'description': 'An advanced adaptive question bank for JEE aspirants featuring personalized explanations and smart analytics.',
        'author': {
            '@type': 'Person',
            'name': 'Paaras Sir',
            'description': 'Chemistry Expert and Mentor for IIT JEE'
        },
        'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.9',
            'ratingCount': '1500'
        }
    };

    return (
        <>
            <Script
                id="crucible-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <QuestionBankGame initialQuestions={questions} />
        </>
    );
}
