import { Metadata } from 'next';
import AboutPage from '@/features/legal/components/AboutPage';

export const metadata: Metadata = {
    title: 'About Paaras Sir',
    description: 'Meet Paaras Thakur, an EdTech enthusiast and passionate teaching geek with 15+ years of experience empowering students for JEE and NEET examinations.',
    keywords: ['Paaras Thakur', 'Paaras Sir', 'Canvas Classes founder', 'Chemistry teacher', 'JEE NEET educator'],
    alternates: { canonical: 'https://www.canvasclasses.in/about' },
};

export default function About() {
    return <AboutPage />;
}
