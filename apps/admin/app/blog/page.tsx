import AdminPanel from '@/features/admin/components/AdminPanel';
import BlogAdminClient from '@/features/admin/components/BlogAdminClient';

export const dynamic = 'force-dynamic';

export default function BlogAdminPage() {
  return (
    <AdminPanel gate="admin" redirectTo="/login?next=/blog">
      {(admin) => <BlogAdminClient adminEmail={admin.email} />}
    </AdminPanel>
  );
}
