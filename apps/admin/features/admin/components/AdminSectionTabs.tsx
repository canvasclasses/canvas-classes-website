export type AdminSection = 'practice' | 'mock-tests' | 'flags';

interface AdminSectionTabsProps {
  section: AdminSection;
  onChange: (next: AdminSection) => void;
}

export default function AdminSectionTabs({ section, onChange }: AdminSectionTabsProps) {
  return (
    <div className="flex items-center gap-0.5 bg-gray-800/60 rounded-lg p-0.5 shrink-0">
      <button
        onClick={() => onChange('practice')}
        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
          section === 'practice'
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm'
            : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        Practice Bank
      </button>
      <button
        onClick={() => onChange('mock-tests')}
        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
          section === 'mock-tests'
            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm'
            : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        Mock Tests
      </button>
      <button
        onClick={() => onChange('flags')}
        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
          section === 'flags'
            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm'
            : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        🚩 Reports
      </button>
    </div>
  );
}
