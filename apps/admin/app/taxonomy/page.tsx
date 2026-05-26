import { redirect } from 'next/navigation';
import { requireSuperAdmin } from '@/lib/adminAuth';
import TaxonomyClient from './TaxonomyClient';

export const metadata = {
  title: 'Taxonomy Manager | Canvas Admin',
};

export const dynamic = 'force-dynamic';

export default async function TaxonomyPage() {
  const admin = await requireSuperAdmin();
  if (!admin) redirect('/');
  return <TaxonomyClient />;
}
