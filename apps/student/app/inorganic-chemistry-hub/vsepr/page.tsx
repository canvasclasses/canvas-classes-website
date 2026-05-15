import InorganicHubContent from '../InorganicHub';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'VSEPR Theory Simulator | Interactive 3D Molecular Geometry',
    description: 'Build any molecule in 3D. Explore VSEPR shapes, bond angles, and hybridization interactively. Master NH₃, H₂O, PCl₅, SF₆ and 30+ molecules for JEE & NEET.',
    keywords: [
        'VSEPR Theory Simulator',
        'Molecular Geometry 3D',
        'Bond Angle Calculator',
        'Hybridization sp sp2 sp3',
        'JEE Inorganic Chemistry',
        'NEET Chemical Bonding',
        'Lone Pair Repulsion',
        'Molecular Shape Simulator',
        'VSEPR Examples NH3 H2O BF3',
        'Trigonal Bipyramidal PCl5',
        'Octahedral SF6',
        'Bent Molecule H2O',
        'Pyramidal NH3',
    ],
    openGraph: {
        title: 'VSEPR Theory Simulator – Interactive 3D Molecular Geometry',
        description: 'Build any molecule in 3D. Explore VSEPR shapes, bond angles, and hybridization. Free for JEE & NEET students.',
        type: 'website',
        url: 'https://www.canvasclasses.in/inorganic-chemistry-hub/vsepr',
        images: [
            {
                url: 'https://www.canvasclasses.in/og/vsepr-simulator.png',
                width: 1200,
                height: 630,
                alt: 'VSEPR Theory 3D Simulator',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'VSEPR Theory Simulator | 3D Molecular Geometry',
        description: 'Build any molecule in 3D. Explore VSEPR shapes, bond angles and hybridization interactively.',
    },
    alternates: {
        canonical: 'https://www.canvasclasses.in/inorganic-chemistry-hub/vsepr',
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: 'VSEPR Theory 3D Simulator',
    description: 'Interactive 3D simulator to explore VSEPR molecular geometries including linear, trigonal planar, tetrahedral, trigonal bipyramidal, octahedral, and pentagonal bipyramidal shapes. Includes 30+ real molecules with accurate bond angles and hybridization.',
    url: 'https://www.canvasclasses.in/inorganic-chemistry-hub/vsepr',
    learningResourceType: 'Interactive Simulation',
    educationalLevel: ['Grade 11', 'Grade 12', 'JEE', 'NEET'],
    teaches: [
        'VSEPR Theory',
        'Molecular Geometry',
        'Bond Angles',
        'Hybridization',
        'Lone Pair Repulsion',
        'sp sp2 sp3 sp3d sp3d2 Hybridization',
        'Bent Rule',
        'Steric Hindrance',
    ],
    author: {
        '@type': 'Organization',
        name: 'Canvas Classes',
        url: 'https://www.canvasclasses.in',
    },
    provider: {
        '@type': 'Organization',
        name: 'Canvas Classes',
        url: 'https://www.canvasclasses.in',
    },
    isAccessibleForFree: true,
    inLanguage: 'en',
    educationalUse: ['Instruction', 'Practice', 'Examination Preparation'],
    audience: {
        '@type': 'EducationalAudience',
        educationalRole: 'student',
        audienceType: 'JEE and NEET aspirants',
    },
};

export default function VSEPRPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <InorganicHubContent />
        </>
    );
}
