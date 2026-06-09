import { Metadata } from 'next';
import AdminPanel from '@/features/admin/components/AdminPanel';
import EnhancedFlashcardAdmin from '@/features/admin/components/EnhancedFlashcardAdmin';

export const metadata: Metadata = {
  title: 'Flashcard Admin | Canvas Classes',
  description: 'Manage chemistry flashcards',
};

export const dynamic = 'force-dynamic';

export default function FlashcardAdminPage() {
  return (
    <AdminPanel gate="super">
      <EnhancedFlashcardAdmin />
    </AdminPanel>
  );
}
