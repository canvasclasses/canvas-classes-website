import AdminPanel from '@/features/admin/components/AdminPanel';
import DiagramEditorClient from '@/features/admin/diagram-editor/DiagramEditorClient';

export const metadata = {
  title: 'Diagram Editor | Canvas Admin',
};

export const dynamic = 'force-dynamic';

export default function DiagramEditorPage() {
  return (
    <AdminPanel gate="super">
      <DiagramEditorClient />
    </AdminPanel>
  );
}
