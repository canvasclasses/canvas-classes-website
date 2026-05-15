import type { Metadata } from 'next';
import Link from 'next/link';
import LandingClient from './LandingClient';

export const metadata: Metadata = {
  title: 'Career Explorer — Find Careers That Actually Fit You | Canvas Classes',
  description:
    'A structured self-discovery tool for Indian students (Class 9 onwards). Maps your aptitude, interests, values, and constraints to careers across mainstream and emerging paths — honestly, without clinical framing.',
  keywords: [
    'career explorer India', 'career guidance class 10', 'career counselling free',
    'careers after 12th', 'RIASEC India', 'career aptitude test', 'hidden career India',
  ],
  alternates: { canonical: 'https://canvasclasses.com/career-explorer' },
  openGraph: {
    title: 'Career Explorer — Canvas Classes',
    description: 'Map your aptitude, interests and constraints to careers that actually fit. Free, honest, Indian.',
    type: 'website',
  },
};

export default function CareerExplorerLanding() {
  return (
    <>
      <LandingClient />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Canvas Career Explorer',
          applicationCategory: 'EducationApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        }) }}
      />
    </>
  );
}
