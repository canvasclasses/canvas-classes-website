import { redirect } from 'next/navigation';
import { requireSuperAdmin } from '@/lib/adminAuth';
import PreviewClient from './PreviewClient';

export const metadata = {
  title: 'Preview | Canvas Admin',
};

export const dynamic = 'force-dynamic';

export default async function PreviewPage() {
  const admin = await requireSuperAdmin();
  if (!admin) redirect('/');
  return <PreviewClient />;
}
