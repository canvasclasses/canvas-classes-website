import AdminPanel from '@/features/admin/components/AdminPanel';
import GraphEditorClient from '@/features/admin/graph-editor/GraphEditorClient';

export const metadata = {
  title: 'Graph Editor | Canvas Admin',
};

export const dynamic = 'force-dynamic';

export default function GraphEditorPage() {
  return (
    <AdminPanel gate="super">
      <GraphEditorClient />
    </AdminPanel>
  );
}
