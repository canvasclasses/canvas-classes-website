import AdminPanel from '@/features/admin/components/AdminPanel';
import TaxonomyClient from './TaxonomyClient';

export const metadata = {
  title: 'Taxonomy Manager | Canvas Admin',
};

export const dynamic = 'force-dynamic';

export default function TaxonomyPage() {
  return (
    <AdminPanel gate="super">
      <TaxonomyClient />
    </AdminPanel>
  );
}
