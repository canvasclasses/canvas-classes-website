import { Metadata } from 'next';
import MechanicsHubContent from '../MechanicsHub';

// Public, static interactive content — cache hard at the edge (CLAUDE.md §10).
// The sim is a client island; this Server Component reads no cookies/searchParams.
export const revalidate = 86400;

export const metadata: Metadata = {
    title: 'Vector Lab — Interactive Vector Addition & Subtraction Simulator | JEE Physics',
    description:
        'Learn vectors the way engineers use them. Drag force arrows on real scenarios — tugboats, crosswinds, hanging signs, wrenches — to master vector addition, subtraction, resolution, relative velocity, equilibrium, and the dot & cross products for JEE Main & Advanced.',
    keywords: [
        'Vector Addition Simulator',
        'Vector Subtraction',
        'Resultant Vector',
        'Parallelogram Law of Vectors',
        'Resolution of Vectors',
        'Relative Velocity Simulator',
        'Triangle Law of Vectors',
        "Lami's Theorem",
        'Dot Product Cross Product',
        'JEE Physics Vectors',
        'Motion in a Plane Class 11',
        'Free Body Diagram Vectors',
    ],
    openGraph: {
        title: 'Vector Lab — Interactive Vector Addition & Subtraction',
        description:
            'Drag force arrows on real-world scenarios to master vectors — the foundation of all mechanics. Free for JEE & NEET students.',
        type: 'website',
        url: 'https://www.canvasclasses.in/mechanics-hub/vectors',
        images: [{ url: 'https://www.canvasclasses.in/og/vector-lab.png', width: 1200, height: 630, alt: 'Vector Lab Simulator' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Vector Lab — Vector Addition & Subtraction Simulator',
        description: 'Master vectors through real-world force scenarios. Built for JEE Physics.',
    },
    alternates: { canonical: 'https://www.canvasclasses.in/mechanics-hub/vectors' },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: 'Vector Lab — Interactive Vector Simulator',
    description:
        'Interactive simulator teaching vector addition and subtraction through real-world force scenarios: graphical (triangle & parallelogram) methods, resolution into components, analytical addition, relative velocity, equilibrium and Lami’s theorem, and the dot & cross products.',
    url: 'https://www.canvasclasses.in/mechanics-hub/vectors',
    learningResourceType: 'Interactive Simulation',
    educationalLevel: ['Grade 11', 'Grade 12', 'JEE', 'NEET'],
    teaches: [
        'Vector Addition',
        'Vector Subtraction',
        'Parallelogram Law',
        'Triangle Law',
        'Resolution of Vectors',
        'Relative Velocity',
        'Equilibrium of Forces',
        "Lami's Theorem",
        'Dot Product',
        'Cross Product',
    ],
    author: { '@type': 'Organization', name: 'Canvas Classes', url: 'https://www.canvasclasses.in' },
    provider: { '@type': 'Organization', name: 'Canvas Classes', url: 'https://www.canvasclasses.in' },
    isAccessibleForFree: true,
    inLanguage: 'en',
    educationalUse: ['Instruction', 'Practice', 'Examination Preparation'],
    audience: { '@type': 'EducationalAudience', educationalRole: 'student', audienceType: 'JEE and NEET aspirants' },
};

export default function VectorLabPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <MechanicsHubContent />
        </>
    );
}
