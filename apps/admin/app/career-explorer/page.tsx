import AdminPanel from '@/features/admin/components/AdminPanel';
import CareerExplorerDashboard from './CareerExplorerDashboard';

export const dynamic = 'force-dynamic';

export default function CareerExplorerAdminPage() {
  return (
    <AdminPanel gate="admin">
      <CareerExplorerDashboard />
    </AdminPanel>
  );
}
