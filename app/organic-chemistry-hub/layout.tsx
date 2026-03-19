import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Organic Chemistry Hub | Name Reactions, Acidity Lab & Quick Reference',
  description: 'Master Organic Chemistry with interactive tools: Named Reactions with mechanisms, Acidity Lab for pKa comparisons, Physical Properties trends, and Quick Reference tables. Complete JEE & NEET preparation by Paaras Sir.',
  keywords: [
    'Organic Chemistry Name Reactions',
    'Organic Reactions Mechanisms',
    'Acidity Lab pKa',
    'Hammett Equation Calculator',
    'Organic Chemistry Quick Reference',
    'JEE Organic Chemistry',
    'NEET Organic Chemistry',
    'Phenol Acidity',
    'Benzoic Acid Derivatives',
    'Organic Chemistry Interactive',
    'Paaras Sir Chemistry',
    'Aldol Condensation',
    'Grignard Reaction',
    'Friedel Crafts'
  ],
  openGraph: {
    title: 'Organic Chemistry Hub - Interactive Learning Tools',
    description: 'Master Name Reactions, Acidity trends, and Physical Properties with interactive simulations. Complete Organic Chemistry preparation for JEE/NEET.',
    type: 'website',
    url: 'https://www.canvasclasses.in/organic-chemistry-hub',
  },
  alternates: {
    canonical: 'https://www.canvasclasses.in/organic-chemistry-hub',
  },
};

export default function OrganicChemistryHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
