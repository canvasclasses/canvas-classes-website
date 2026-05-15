'use client';

import { InlineQuizBlock, InlineQuizQuestion } from '@/types/books';

interface Props {
  block: InlineQuizBlock;
  onChange: (patch: Partial<InlineQuizBlock>) => void;
}

function QuestionEditor({
  q,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: {
  q: InlineQuizQuestion;
  index: number;
  onUpdate: (patch: Partial<InlineQuizQuestion>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="border border-white/8 rounded-lg p-3 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-violet-400">Q{index + 1}</span>
        {canRemove && (
          <button onClick={onRemove} className="text-xs text-red-400/60 hover:text-red-400">
            Remove
          </button>
        )}
      </div>

      <textarea
        value={q.question}
        onChange={e => onUpdate({ question: e.target.value })}
        placeholder="Question text (markdown + LaTeX supported)"
        rows={2}
        className="w-full bg-[#050505] border border-white/8 rounded-lg px-3 py-2 text-sm text-white
          placeholder-white/25 focus:outline-none focus:border-violet-500/50 resize-none"
      />

      <div className="flex flex-col gap-1.5">
        {q.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => onUpdate({ correct_index: i })}
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                q.correct_index === i
                  ? 'border-emerald-500 bg-emerald-500/20'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              {q.correct_index === i && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
            </button>
            <input
              value={opt}
              onChange={e => {
                const next = [...q.options];
                next[i] = e.target.value;
                onUpdate({ options: next });
              }}
              placeholder={`Option ${String.fromCharCode(65 + i)}`}
              className="flex-1 bg-[#050505] border border-white/8 rounded-lg px-3 py-1.5 text-sm text-white
                placeholder-white/25 focus:outline-none focus:border-white/20"
            />
          </div>
        ))}
      </div>

      <textarea
        value={q.explanation ?? ''}
        onChange={e => onUpdate({ explanation: e.target.value })}
        placeholder="Explanation shown after answering (optional)"
        rows={2}
        className="w-full bg-[#050505] border border-white/8 rounded-lg px-3 py-2 text-sm text-white
          placeholder-white/25 focus:outline-none focus:border-white/20 resize-none"
      />
    </div>
  );
}

export default function InlineQuizEditor({ block, onChange }: Props) {
  function updateQuestion(index: number, patch: Partial<InlineQuizQuestion>) {
    const next = block.questions.map((q, i) => i === index ? { ...q, ...patch } : q);
    onChange({ questions: next });
  }

  function addQuestion() {
    onChange({
      questions: [
        ...block.questions,
        {
          id: crypto.randomUUID(),
          question: '',
          options: ['', '', '', ''],
          correct_index: 0,
          explanation: '',
        },
      ],
    });
  }

  function removeQuestion(index: number) {
    onChange({ questions: block.questions.filter((_, i) => i !== index) });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <label className="text-xs text-white/50 shrink-0">Pass threshold</label>
        <input
          type="number"
          min={0}
          max={100}
          value={Math.round(block.pass_threshold * 100)}
          onChange={e => onChange({ pass_threshold: Number(e.target.value) / 100 })}
          className="w-20 bg-[#050505] border border-white/8 rounded-lg px-3 py-1.5 text-sm text-white
            focus:outline-none focus:border-violet-500/50"
        />
        <span className="text-xs text-white/30">%</span>
      </div>

      {block.questions.map((q, i) => (
        <QuestionEditor
          key={q.id}
          q={q}
          index={i}
          onUpdate={patch => updateQuestion(i, patch)}
          onRemove={() => removeQuestion(i)}
          canRemove={block.questions.length > 1}
        />
      ))}

      <button
        onClick={addQuestion}
        className="text-xs text-violet-400 hover:text-violet-300 border border-violet-500/20
          hover:border-violet-500/40 rounded-lg py-2 transition-colors"
      >
        + Add question
      </button>
    </div>
  );
}
