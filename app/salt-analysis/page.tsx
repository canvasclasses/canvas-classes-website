import type { Metadata } from 'next';
import SaltAnalysisClient from './SaltAnalysisClient';
import Script from 'next/script';

const BASE_URL = 'https://www.canvasclasses.in';

export const metadata: Metadata = {
    title: 'Salt Analysis: Procedure, Cation & Anion Tests + Free Virtual Lab | Class 12',
    description: 'Free interactive salt analysis lab with step-by-step cation analysis (Groups I–VI), anion tests, flame tests, and the brown ring test. Complete procedure, reactions, and viva questions for CBSE Class 12 practical, JEE & NEET.',
    keywords: [
        'salt analysis',
        'salt analysis procedure',
        'salt analysis class 12',
        'salt analysis viva questions',
        'salt analysis practical',
        'salt analysis virtual lab',
        'salt analysis simulator',
        'qualitative analysis of salt',
        'cation analysis',
        'anion analysis',
        'group reagents in salt analysis',
        'flame test',
        'brown ring test',
        'borax bead test',
        'NCERT chemistry practical',
        'CBSE practical chemistry',
        'class 12 chemistry practical',
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
        title: 'Salt Analysis: Procedure, Tests & Free Virtual Lab — Class 12',
        description: 'Step-by-step salt analysis procedure with free virtual lab. Cation analysis (Groups I–VI), anion tests, flame tests, brown ring test, and viva questions for CBSE Class 12 practical.',
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
        title: 'Salt Analysis: Procedure + Free Virtual Lab | Class 12',
        description: 'Free interactive salt analysis lab. Step-by-step cation/anion tests, flame tests, brown ring test, and viva questions for CBSE Class 12.',
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
                    "name": "What is salt analysis in chemistry?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Salt analysis, also called qualitative inorganic analysis, is the systematic procedure used to identify the cation (basic radical) and the anion (acidic radical) present in an unknown inorganic salt. It is a core CBSE Class 12 Chemistry practical and an important foundation topic for JEE and NEET inorganic chemistry."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What are the steps of salt analysis?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Salt analysis is done in five stages: (1) Preliminary examination — note the colour, smell, and solubility of the salt. (2) Dry tests — heat the salt, perform flame test and borax bead test. (3) Anion analysis — use dilute H₂SO₄ for one set of anions and concentrated H₂SO₄ for the other set, then confirm with specific tests. (4) Cation analysis — prepare original solution and test through Groups 0, I, II, III, IV, V, VI in order. (5) Confirmatory tests for the identified cation and anion."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is the original solution in salt analysis?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The original solution (O.S.) is a solution of the salt prepared in a suitable solvent — usually water, dilute HCl, dilute HNO₃, or aqua regia, depending on the solubility of the salt. The original solution is used for systematic cation analysis through Groups 0 to VI. Choosing the right solvent is the first step before group separation."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Why is dilute HCl used as the Group I reagent?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Dilute HCl is used as the Group I reagent because it precipitates only the cations whose chlorides are insoluble — Pb²⁺, Ag⁺, and Hg₂²⁺. The dilute concentration provides a controlled chloride ion concentration so that chlorides of Group II–VI cations (which are soluble) remain in solution and can be analysed in subsequent groups."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do you identify the cation in a salt?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Cations are identified by passing the original solution through Groups 0 to VI in fixed order. Group 0 (NH₄⁺) is tested first using NaOH. Group I uses dilute HCl. Group II uses H₂S in acidic medium. Group III uses NH₄Cl + NH₄OH. Group IV uses H₂S in alkaline medium. Group V uses (NH₄)₂CO₃. Group VI tests for Mg²⁺. Once the cation is precipitated in a group, a confirmatory test is done to identify the exact ion."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do you identify the anion in a salt?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Anions are identified in two stages. The dilute H₂SO₄ test detects carbonate, sulphide, sulphite, nitrite, and acetate by gas evolution. The concentrated H₂SO₄ test detects chloride, bromide, iodide, nitrate, and oxalate. The anion is then confirmed using specific tests — silver nitrate test for halides, brown ring test for nitrate, BaCl₂ test for sulphate, and ammonium molybdate test for phosphate."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is the dry test in salt analysis?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Dry tests are done on the solid salt before it is dissolved. They include: (a) noting colour and smell, (b) heating the salt in a dry test tube to observe colour changes and any gas evolved, (c) flame test using a clean platinum wire dipped in concentrated HCl, and (d) borax bead test for transition metal cations. Dry tests give early hints about the cation and anion present."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Why is H₂S not passed in Group I?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "H₂S is not passed in Group I because the goal of Group I is to precipitate only Pb²⁺, Ag⁺, and Hg₂²⁺ as their insoluble chlorides using dilute HCl. If H₂S were passed first, sulphides of Group II cations would also precipitate together, making it impossible to separate Group I from Group II cleanly. Each group reagent is chosen to precipitate only its own cations."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is the principle of qualitative inorganic analysis?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The principle is selective precipitation based on the Solubility Product (Ksp) of insoluble salts. By controlling the concentration of the precipitating ion (Cl⁻, S²⁻, OH⁻, CO₃²⁻) and the pH of the medium, we ensure that only the cations of one group exceed their Ksp and precipitate, while cations of later groups stay in solution. The Common Ion Effect is used to fine-tune ion concentrations during the procedure."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What apparatus is needed for salt analysis practical?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The basic apparatus includes test tubes and a test tube stand, a test tube holder, a Bunsen burner, a platinum or nichrome wire (for flame test), a watch glass, a glass rod, dropper bottles for reagents (dil HCl, dil H₂SO₄, conc H₂SO₄, NaOH, NH₄OH, NH₄Cl, H₂S source, BaCl₂, AgNO₃, FeSO₄, (NH₄)₂CO₃), a centrifuge or filter paper for separating precipitates, and a wash bottle."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What precautions should be taken during salt analysis?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Important precautions: (1) Always test for NH₄⁺ in the original solution before adding any ammonium reagent. (2) Use dilute HCl for Group I and ensure the solution is cold to fully precipitate PbCl₂. (3) Pass H₂S only in a fume hood — it is toxic. (4) Keep the medium acidic for Group II and alkaline for Group IV. (5) Always centrifuge or filter completely before moving to the next group. (6) Confirm each cation and anion with at least one specific confirmatory test."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Why does Lead (Pb²⁺) partially precipitate in Group I and then reappear in Group II analysis?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Lead chloride (PbCl₂) is slightly soluble in cold water. When dilute HCl is added, PbCl₂ forms as a white precipitate, but some Pb²⁺ ions escape into the filtrate. These remaining ions form black PbS precipitate in Group II when H₂S is passed in acidic medium. This is why Lead can appear in both Group I and Group II."
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
                        "text": "This is based on the Solubility Product (Ksp) principle. Group II sulphides have very low Ksp, so even a low S²⁻ concentration (suppressed by HCl) is sufficient to exceed Ksp and precipitate them. Group IV sulphides have higher Ksp, requiring a much higher S²⁻ concentration — achieved by NH₄OH which boosts the dissociation of H₂S in alkaline medium."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is the role of NH₄Cl when adding NH₄OH during Group III Analysis?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "NH₄Cl suppresses the ionization of NH₄OH through the Common Ion Effect. This keeps the OH⁻ concentration low enough to precipitate only Group III hydroxides — Fe(OH)₃, Al(OH)₃, and Cr(OH)₃ — while preventing the premature precipitation of Mg(OH)₂ and Group IV hydroxides which have higher Ksp values."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Why must Ammonium (NH₄⁺) be analyzed in the original solution?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Ammonium salts like NH₄Cl and NH₄OH are added as reagents during Groups III, IV, and V analysis. Testing for NH₄⁺ after this stage would give false positives because of the added ammonium. Therefore NH₄⁺ must be tested in the original solution before any reagent is added — this is why it is grouped under 'Zero Group'."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is the brown ring test used for?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The brown ring test confirms the presence of nitrate (NO₃⁻) ions. Freshly prepared FeSO₄ solution is added to the salt solution, and concentrated H₂SO₄ is then poured carefully along the side of the test tube. A brown ring forms at the junction of the two layers due to the formation of the [Fe(H₂O)₅NO]²⁺ complex, confirming nitrate."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What colours do different cations impart in the flame test?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Sodium (Na⁺) gives a golden yellow flame, Potassium (K⁺) gives a lilac or violet flame, Calcium (Ca²⁺) gives a brick red flame, Strontium (Sr²⁺) gives a crimson red flame, Barium (Ba²⁺) gives an apple green flame, and Copper (Cu²⁺) gives a blue-green flame. Lead and lithium give characteristic colours too — pale blue and crimson respectively."
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
