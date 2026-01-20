import type { Metadata } from 'next';
import SaltAnalysisClient from './SaltAnalysisClient';
import Script from 'next/script';

const BASE_URL = 'https://www.canvasclasses.in';

export const metadata: Metadata = {
    title: 'Salt Analysis Simulator | Qualitative Analysis for CBSE Class 12 | Canvas Classes',
    description: 'Master Salt Analysis with our interactive simulator for CBSE Class 12 Chemistry practical. Learn cation (Group I-VI) and anion identification, flame tests, dry tests, and systematic qualitative analysis based on NCERT Lab Manual. Practice for board exams and JEE/NEET.',
    keywords: [
        'salt analysis',
        'qualitative analysis of salt',
        'salt analysis class 12',
        'salt analysis practical',
        'cation analysis',
        'anion analysis',
        'NCERT chemistry practical',
        'CBSE practical chemistry',
        'group reagents',
        'flame test',
        'brown ring test',
        'borax bead test',
        'chemistry lab practical',
        'class 12 chemistry practical',
        'salt analysis experiment',
        'qualitative inorganic analysis',
        'JEE chemistry practical',
        'NEET chemistry'
    ],
    authors: [{ name: 'Canvas Classes' }],
    creator: 'Canvas Classes',
    publisher: 'Canvas Classes',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: `${BASE_URL}/salt-analysis`,
    },
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: `${BASE_URL}/salt-analysis`,
        siteName: 'Canvas Classes',
        title: 'Salt Analysis Simulator - NCERT Chemistry Lab Practical',
        description: 'Interactive Salt Analysis Simulator for CBSE Class 12. Practice qualitative analysis of salts with step-by-step experiments for cation and anion identification.',
        images: [
            {
                url: `${BASE_URL}/og-salt-analysis.jpg`,
                width: 1200,
                height: 630,
                alt: 'Salt Analysis Simulator - Canvas Classes',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Salt Analysis Simulator | CBSE Class 12 Chemistry Practical',
        description: 'Master qualitative analysis with our interactive salt analysis simulator based on NCERT.',
        images: [`${BASE_URL}/og-salt-analysis.jpg`],
    },
    category: 'Education',
};

// Structured Data for SEO
const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
        // Learning Resource Schema
        {
            "@type": "LearningResource",
            "@id": `${BASE_URL}/salt-analysis#learning-resource`,
            "name": "Salt Analysis Simulator - Qualitative Inorganic Analysis",
            "description": "Interactive simulator for learning systematic qualitative analysis of salts including cation identification (Group I-VI), anion tests, flame tests, borax bead test, and dry heating test.",
            "url": `${BASE_URL}/salt-analysis`,
            "inLanguage": "en",
            "educationalLevel": ["CBSE Class 12", "ISC Class 12", "JEE Main", "NEET"],
            "learningResourceType": ["Interactive Simulation", "Practice Exercise", "Quiz"],
            "teaches": [
                "Qualitative analysis of salts",
                "Cation identification using group reagents",
                "Anion identification tests",
                "Flame test for cations",
                "Borax bead test",
                "Brown ring test for nitrates",
                "Systematic salt analysis procedure"
            ],
            "assesses": "Chemistry practical skills for CBSE board exams",
            "provider": {
                "@type": "Organization",
                "name": "Canvas Classes",
                "url": BASE_URL
            },
            "isAccessibleForFree": true,
            "audience": {
                "@type": "EducationalAudience",
                "educationalRole": "student",
                "audienceType": "CBSE Class 12 students, JEE/NEET aspirants"
            }
        },
        // Course Schema
        {
            "@type": "Course",
            "@id": `${BASE_URL}/salt-analysis#course`,
            "name": "Salt Analysis Practical - NCERT Chemistry Lab",
            "description": "Complete guide to systematic qualitative analysis of salts for CBSE Class 12 Chemistry practical examination",
            "url": `${BASE_URL}/salt-analysis`,
            "provider": {
                "@type": "Organization",
                "name": "Canvas Classes",
                "url": BASE_URL
            },
            "educationalCredentialAwarded": "CBSE Class 12 Chemistry Practical Skills",
            "hasCourseInstance": {
                "@type": "CourseInstance",
                "courseMode": "online",
                "courseWorkload": "PT2H"
            }
        },
        // FAQ Schema
        {
            "@type": "FAQPage",
            "@id": `${BASE_URL}/salt-analysis#faq`,
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Why does Lead (Pb²⁺) partially precipitate in Group I and then reappear in Group II analysis?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Lead chloride (PbCl₂) is slightly soluble in cold water. When dilute HCl is added, PbCl₂ forms as a white precipitate, but some Pb²⁺ ions escape into the filtrate. These remaining ions form black PbS precipitate in Group II when H₂S is passed in acidic medium. This is why Lead appears in both Group I and Group II."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How can we chemically distinguish the Copper Group (IIA) from the Arsenic Group (IIB)?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Using Yellow Ammonium Polysulphide [(NH₄)₂Sₓ]. Group IIB sulphides (As, Sb, Sn) dissolve in it forming soluble thio-salts, while Group IIA sulphides (Cu, Pb, Bi, Cd, Hg) remain insoluble. The Arsenic group metals are acidic and can form thio-anions."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Why is H₂S passed in acidic medium for Group II but alkaline medium for Group IV?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "This is based on Solubility Product (Ksp) principle. Group II sulphides have very low Ksp, so even low S²⁻ concentration (suppressed by HCl) is sufficient. Group IV sulphides have high Ksp, requiring high S²⁻ concentration (boosted by NH₄OH alkaline medium) for precipitation."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is the role of NH₄Cl when adding NH₄OH during Group III Analysis?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "NH₄Cl suppresses the ionization of NH₄OH through Common Ion Effect. This keeps OH⁻ concentration low enough to precipitate only Group III hydroxides (Fe, Al, Cr) while preventing precipitation of Mg(OH)₂ and Group IV hydroxides which have higher Ksp values."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Why must Ammonium (NH₄⁺) be analyzed in the original solution?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Ammonium salts like NH₄Cl and NH₄OH are added as reagents during Groups I-V analysis. Testing for NH₄⁺ after this would give false positives. Therefore, NH₄⁺ must be tested in the original solution before adding any reagents. This is why it's called 'Zero Group'."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is the brown ring test used for?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The brown ring test is used to confirm the presence of Nitrate (NO₃⁻) ions. When freshly prepared FeSO₄ solution is added to the salt solution and concentrated H₂SO₄ is poured carefully along the sides, a brown ring forms at the junction due to formation of [Fe(H₂O)₅NO]²⁺ complex."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What colours do different cations impart in flame test?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Sodium (Na⁺) gives golden yellow flame, Potassium (K⁺) gives lilac/violet flame, Calcium (Ca²⁺) gives brick red flame, Strontium (Sr²⁺) gives crimson red flame, Barium (Ba²⁺) gives apple green flame, and Copper (Cu²⁺) gives blue-green flame."
                    }
                }
            ]
        },
        // Breadcrumb Schema
        {
            "@type": "BreadcrumbList",
            "@id": `${BASE_URL}/salt-analysis#breadcrumb`,
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": BASE_URL
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Salt Analysis Simulator",
                    "item": `${BASE_URL}/salt-analysis`
                }
            ]
        },
        // WebPage Schema
        {
            "@type": "WebPage",
            "@id": `${BASE_URL}/salt-analysis`,
            "url": `${BASE_URL}/salt-analysis`,
            "name": "Salt Analysis Simulator | CBSE Class 12 Chemistry Practical",
            "description": "Interactive Salt Analysis Simulator for CBSE Class 12 Chemistry practical. Practice qualitative analysis with cation and anion identification.",
            "isPartOf": {
                "@type": "WebSite",
                "@id": `${BASE_URL}#website`,
                "name": "Canvas Classes",
                "url": BASE_URL
            },
            "about": {
                "@type": "Thing",
                "name": "Qualitative Inorganic Analysis"
            },
            "mainEntity": {
                "@id": `${BASE_URL}/salt-analysis#learning-resource`
            },
            "breadcrumb": {
                "@id": `${BASE_URL}/salt-analysis#breadcrumb`
            }
        }
    ]
};

export default function SaltAnalysisPage() {
    return (
        <>
            <Script
                id="salt-analysis-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <SaltAnalysisClient />
        </>
    );
}
