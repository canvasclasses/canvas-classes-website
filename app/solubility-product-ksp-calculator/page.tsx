import type { Metadata } from 'next';
import KspCalculatorClient from './KspCalculatorClient';

export const metadata: Metadata = {
    title: 'Solubility Product (Ksp) Calculator for JEE & NEET | NCERT Chemistry',
    description: 'Free online Ksp Calculator with 70+ NCERT salts. Calculate molar solubility, compare Ksp values, visualize solubility trends, and practice JEE/NEET precipitation questions. Complete ionic equilibrium tool for Class 12 Chemistry.',
    keywords: [
        'Ksp calculator',
        'solubility product constant',
        'molar solubility calculator',
        'JEE chemistry',
        'NEET chemistry',
        'ionic equilibrium',
        'precipitation reactions',
        'NCERT Class 12 chemistry',
        'solubility rules',
        'common ion effect',
        'solubility product',
        'Ksp values NCERT'
    ],
    openGraph: {
        title: 'Solubility Product (Ksp) Calculator | JEE & NEET Chemistry',
        description: 'Interactive Ksp tool with 70+ NCERT salts. Calculate molar solubility, compare salts, and practice precipitation questions for JEE & NEET.',
        type: 'website',
        siteName: 'Canvas Classes',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Solubility Product (Ksp) Calculator for JEE & NEET',
        description: 'Free Ksp calculator with 70+ NCERT salts. Master ionic equilibrium for JEE & NEET.',
    },
    alternates: {
        canonical: '/solubility-product-ksp-calculator',
    },
};

// JSON-LD Structured Data for SEO
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Solubility Product (Ksp) Calculator',
    description: 'Free online Ksp Calculator with 70+ NCERT salts for JEE & NEET preparation. Calculate molar solubility, compare Ksp values, and practice precipitation questions.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web Browser',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
    },
    educationalLevel: 'Class 12',
    audience: {
        '@type': 'EducationalAudience',
        educationalRole: 'student',
    },
    about: {
        '@type': 'Thing',
        name: 'Solubility Product Constant (Ksp)',
        description: 'A measure of the solubility of a sparingly soluble salt in water',
    },
    isAccessibleForFree: true,
    creator: {
        '@type': 'Organization',
        name: 'Canvas Classes',
    },
};

export default function KspCalculatorPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <KspCalculatorClient />
        </>
    );
}
