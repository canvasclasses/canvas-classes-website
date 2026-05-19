import type { AdminQuestion as Question } from './types';

interface AITagSuggestionsBoxProps {
  isVisible: boolean;
  suggestions: string[];
  selectedQuestion: Question;
  onApply: (questionId: string, updates: Partial<Question>) => void;
  onDismiss: () => void;
}

/**
 * Renders the inline AI-suggested-tags strip below the tagging row.
 * Clicking a tag chip overwrites the question's tags with that single tag
 * (weight 1.0) — same behaviour as before the extraction.
 */
export default function AITagSuggestionsBox({
  isVisible,
  suggestions,
  selectedQuestion,
  onApply,
  onDismiss,
}: AITagSuggestionsBoxProps) {
  if (!isVisible || suggestions.length === 0) return null;

  return (
    <div className="flex items-center gap-2 p-2 bg-purple-900/20 border border-purple-600/50 rounded">
      <span className="text-[10px] font-bold text-purple-400 shrink-0">AI Suggested:</span>
      <div className="flex flex-wrap gap-1.5 flex-1">
        {suggestions.map(tag => (
          <button
            key={tag}
            onClick={() => {
              onApply(selectedQuestion._id, {
                metadata: { ...selectedQuestion.metadata, tags: [{ tag_id: tag, weight: 1.0 }] },
              });
              onDismiss();
            }}
            className="px-2 py-0.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 rounded text-[10px] font-mono text-purple-300 transition"
          >
            {tag}
          </button>
        ))}
      </div>
      <button
        onClick={onDismiss}
        className="text-xs text-gray-500 hover:text-gray-300 shrink-0"
      >
        ✕
      </button>
    </div>
  );
}
