import { useState } from 'react';
import { FlaskConical, PenLine } from 'lucide-react';
import StructureEditor from './structure-editor/StructureEditor';
import DiagramEditor from './diagram-editor/DiagramEditor';

type Tool = 'structure' | 'diagram';

// Both editors are mounted once and toggled with `hidden` rather than
// unmount/remount — Ketcher and Excalidraw are heavy to boot, so we keep their
// canvases alive when you switch tabs (your drawing is preserved).
export default function App() {
  const [tool, setTool] = useState<Tool>('structure');

  return (
    <div className="flex h-full flex-col bg-[#050505]">
      <header className="flex shrink-0 items-center gap-1 border-b border-white/10 bg-[#0B0F15] px-3 py-2">
        <span className="mr-3 text-sm font-bold tracking-tight text-white">
          Canvas Draw Studio
        </span>
        <TabButton
          active={tool === 'structure'}
          onClick={() => setTool('structure')}
          icon={<FlaskConical className="h-4 w-4" />}
        >
          Structure Editor
        </TabButton>
        <TabButton
          active={tool === 'diagram'}
          onClick={() => setTool('diagram')}
          icon={<PenLine className="h-4 w-4" />}
        >
          Diagram Editor
        </TabButton>
        <span className="ml-auto text-[11px] text-white/30">
          Local · offline · images save to your computer
        </span>
      </header>

      <main className="relative min-h-0 flex-1">
        <div className={tool === 'structure' ? 'h-full' : 'hidden'}>
          <StructureEditor />
        </div>
        <div className={tool === 'diagram' ? 'h-full' : 'hidden'}>
          <DiagramEditor />
        </div>
      </main>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
        active ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
