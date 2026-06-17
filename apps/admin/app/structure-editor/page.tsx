import AdminPanel from '@/features/admin/components/AdminPanel';
import StructureEditorClient from '@/features/admin/structure-editor/StructureEditorClient';

export const metadata = {
  title: 'Structure Editor | Canvas Admin',
};

export const dynamic = 'force-dynamic';

export default function StructureEditorPage() {
  return (
    <AdminPanel gate="super">
      <StructureEditorClient />
    </AdminPanel>
  );
}
