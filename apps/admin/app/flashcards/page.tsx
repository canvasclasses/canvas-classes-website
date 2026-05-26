import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireSuperAdmin } from '@/lib/adminAuth';
import EnhancedFlashcardAdmin from '@/features/admin/components/EnhancedFlashcardAdmin';

export const metadata: Metadata = {
  title: 'Flashcard Admin | Canvas Classes',
  description: 'Manage chemistry flashcards',
};

export const dynamic = 'force-dynamic';

export default async function FlashcardAdminPage() {
  const admin = await requireSuperAdmin();
  if (!admin) redirect('/');
  return <EnhancedFlashcardAdmin />;
}
