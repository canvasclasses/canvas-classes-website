import { Metadata } from 'next';
import NeetCrashCourseClient from './NeetCrashCourseClient';
import { fetchNeetCrashCourseData } from '@/app/lib/neetCrashCourseData';

export const metadata: Metadata = {
    title: 'NEET Chemistry Crash Course 2025 - Free Complete Course | Canvas Classes',
    description: 'Free NEET Chemistry crash course with high-yield lectures, DPP, and video solutions. Complete Class 11 & 12 revision for NEET 2025 preparation.',
    keywords: [
        'NEET Chemistry crash course',
        'NEET 2025 Chemistry preparation',
        'Quick NEET Chemistry course',
        'NEET Chemistry revision',
        'Free NEET crash course',
        'NEET Chemistry free course',
        'NEET 2025 preparation Chemistry',
    ],
    openGraph: {
        title: 'NEET Chemistry Crash Course 2025 - Free Complete Course | Canvas Classes',
        description: 'Free comprehensive NEET Chemistry crash course covering Class 11 & 12 syllabus.',
        type: 'website',
    },
    alternates: {
        canonical: '/neet-crash-course',
    },
};

// FAQ Schema for SEO
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What is covered in the NEET Chemistry Crash Course?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Complete Class 11 and 12 Chemistry syllabus covering Physical, Organic, and Inorganic Chemistry with focus on NEET pattern."
            }
        },
        {
            "@type": "Question",
            "name": "How is this different from regular lectures?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Crash course lectures are faster-paced and focus specifically on NEET important topics and previous year question patterns."
            }
        },
        {
            "@type": "Question",
            "name": "How much time does the crash course take?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The complete crash course can be finished in 15-20 days with dedicated study of 2-3 hours daily."
            }
        },
        {
            "@type": "Question",
            "name": "Is this suitable for students who haven't studied chemistry before?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "This is best for revision. Students should have basic knowledge of the topics. For beginners, we recommend our detailed chapter lectures first."
            }
        },
        {
            "@type": "Question",
            "name": "Are NEET PYQs discussed?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, important NEET previous year questions are discussed with solutions and shortcuts."
            }
        }
    ]
};

// Server-side data fetching for SEO
export default async function NeetCrashCoursePage() {
    const chapters = await fetchNeetCrashCourseData();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <NeetCrashCourseClient initialChapters={chapters} />
        </>
    );
}
