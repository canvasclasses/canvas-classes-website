import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/bookAuth';
import BlogAdminClient from './BlogAdminClient';

export const dynamic = 'force-dynamic';

export default async function BlogAdminPage() {
  const admin = await requireAdmin();
  if (!admin) redirect('/login?redirect=/crucible/admin/blog');
  return <BlogAdminClient adminEmail={admin.email} />;
}
