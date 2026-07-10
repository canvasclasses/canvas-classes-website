import { Metadata } from 'next';
import AdminPanel from '@/features/admin/components/AdminPanel';
import ReadinessDashboard from '@/features/admin/books-editor/ReadinessDashboard';

export const metadata: Metadata = {
  title: 'Book Readiness | Canvas Classes',
  description: 'Publish-readiness of every Live Book chapter and page.',
};

export const dynamic = 'force-dynamic';

export default function BookReadinessPage() {
  return (
    <AdminPanel gate="super">
      <ReadinessDashboard />
    </AdminPanel>
  );
}
