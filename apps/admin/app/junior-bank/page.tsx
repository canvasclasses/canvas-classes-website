import { Metadata } from 'next';
import AdminPanel from '@/features/admin/components/AdminPanel';
import JuniorBankWorkspace from '@/features/admin/junior-bank/JuniorBankWorkspace';

export const metadata: Metadata = {
  title: 'Junior Question Bank | Canvas Classes',
  description: 'Author and curate the junior (grades 6–10) practice question bank.',
};

export const dynamic = 'force-dynamic';

export default function JuniorBankAdminPage() {
  return (
    <AdminPanel gate="super">
      <JuniorBankWorkspace />
    </AdminPanel>
  );
}
