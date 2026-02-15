import AdminDashboard from '../../../components/organic-wizard/admin/AdminDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Organic Wizard Admin | Management',
    description: 'Dashboard for managing conversion levels and chemistry data.',
};

export default function OrganicWizardAdmin() {
    return (
        <main className="h-screen w-screen overflow-hidden">
            <AdminDashboard />
        </main>
    );
}
