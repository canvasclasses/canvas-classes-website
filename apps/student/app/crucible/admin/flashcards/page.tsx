import { Metadata } from 'next';
import EnhancedFlashcardAdmin from '@/features/crucible/components/admin/EnhancedFlashcardAdmin';

export const metadata: Metadata = {
  title: 'Flashcard Admin | Canvas Classes',
  description: 'Manage chemistry flashcards',
};

export default function FlashcardAdminPage() {
  return <EnhancedFlashcardAdmin />;
}
