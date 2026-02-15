import OrganicWizardGame from '@/components/organic-wizard/ConversionGame';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Organic Wizard - Canvas Classes',
    description: 'Master organic chemistry conversions in this interactive game.',
};

export default function OrganicWizardPage() {
    return <OrganicWizardGame />;
}
