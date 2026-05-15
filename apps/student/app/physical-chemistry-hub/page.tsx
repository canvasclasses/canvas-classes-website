import PhysChemHubContent from './PhysChemHub';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Physical Chemistry Hub | Interactive Simulations & Visualizations',
  description: 'Master Physical Chemistry with interactive simulations for Gas Laws, Acid-Base Titration, Electrochemistry, and Atomic Models. Free JEE & NEET preparation tools by Paaras Sir.',
  keywords: [
    'Physical Chemistry Simulations',
    'Gas Laws Calculator',
    'Acid Base Titration Simulator',
    'Electrochemistry Interactive',
    'Atomic Models Visualization',
    'JEE Physical Chemistry',
    'NEET Chemistry Simulations',
    'Bohr Model Interactive',
    'Ideal Gas Law Calculator',
    'Chemistry Lab Simulations',
    'Paaras Sir Chemistry'
  ],
  openGraph: {
    title: 'Physical Chemistry Hub - Interactive Simulations',
    description: 'Interactive simulations for Gas Laws, Titration, Electrochemistry & Atomic Models. Master Physical Chemistry for JEE/NEET.',
    type: 'website',
    url: 'https://www.canvasclasses.in/physical-chemistry-hub',
  },
  alternates: {
    canonical: 'https://www.canvasclasses.in/physical-chemistry-hub',
  },
};

export default function PhysicalChemistryHub() {
  return <PhysChemHubContent />;
}
