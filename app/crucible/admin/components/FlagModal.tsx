import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export type FlagReason = 'latex_error' | 'table_error' | 'mismatch' | 'solution_incorrect' | 'other';

export interface FlagSubmission {
  type: FlagReason;
  note: string;
}

interface FlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FlagSubmission) => void | Promise<void>;
}

export default function FlagModal({ isOpen, onClose, onSubmit }: FlagModalProps) {
  const [reason, setReason] = useState<FlagReason>('latex_error');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    await onSubmit({ type: reason, note });
    setReason('latex_error');
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} /> Flag Question
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Issue Type</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as FlagReason)}
              className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-white"
            >
              <option value="latex_error">LaTeX not rendering properly</option>
              <option value="table_error">Table formatting issue</option>
              <option value="mismatch">Question text/options mismatch</option>
              <option value="solution_incorrect">Solution is incorrect</option>
              <option value="other">Other issue</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Remarks (Optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add specific details for the content team..."
              className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none text-white resize-y min-h-[100px]"
            />
          </div>
        </div>
        <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition">Cancel</button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-red-900/20">Submit Flag</button>
        </div>
      </div>
    </div>
  );
}
