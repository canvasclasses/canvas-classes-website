import { AlertCircle, AlertTriangle, Check, Sparkles, Star, Bookmark, Trash2 } from 'lucide-react';
import { TAXONOMY_FROM_CSV } from '@canvas/data/taxonomy/taxonomyData_from_csv';
import { type AdminQuestion as Question, type AdminChapter as Chapter, QUESTION_TYPES } from './types';
import AITagSuggestionsBox from './AITagSuggestionsBox';

const VALID_TOPIC_IDS = new Set(TAXONOMY_FROM_CSV.filter(t => t.type === 'topic').map(t => t.id));

function isTagValid(tags: Array<{ tag_id: string }> | undefined | null): tags is Array<{ tag_id: string }> {
  return !!(tags && tags.length > 0 && typeof tags[0] === 'object' && !!tags[0].tag_id && VALID_TOPIC_IDS.has(tags[0].tag_id));
}

function validateTag(tagId: string, chapterId: string): { valid: boolean; warning?: string } {
  if (!tagId) return { valid: false, warning: 'Tag is required' };
  if (!tagId.startsWith('tag_')) return { valid: false, warning: 'Tag must start with tag_' };
  const isValidTag = TAXONOMY_FROM_CSV.some(node =>
    node.id === tagId && node.parent_id === chapterId && node.type === 'topic'
  );
  if (!isValidTag) return { valid: true, warning: 'Tag may not belong to this chapter' };
  return { valid: true };
}

interface QuestionTaggingRowProps {
  selectedQuestion: Question;
  questions: Question[];
  chapters: Chapter[];
  reclassifying: boolean;
  aiAnalyzing: boolean;
  canDelete: boolean;
  deletingId: string | null;
  onReclassify: (questionId: string, newChapterId: string, currentTags: Array<{ tag_id: string; weight: number }>) => void;
  onUpdate: (id: string, updates: Partial<Question>) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  onAITagSuggestion: (id: string) => void;
  onOpenFlagModal: () => void;
  showTagSuggestions: boolean;
  setShowTagSuggestions: (v: boolean) => void;
  tagSuggestions: string[];
}

export default function QuestionTaggingRow(props: QuestionTaggingRowProps) {
  const {
    selectedQuestion, questions, chapters,
    reclassifying, aiAnalyzing, canDelete, deletingId,
    onReclassify, onUpdate, onDelete, onAITagSuggestion, onOpenFlagModal,
    showTagSuggestions, setShowTagSuggestions, tagSuggestions,
  } = props;

  return (
    <div className="shrink-0 border-b border-gray-800/50">
      <div className="p-3 space-y-2">

        {/* ── Tagging row: ID → Chapter → Primary Tag → Micro Concept → Type → Nature → Difficulty → Boards │ Actions ── */}
        <div className="flex items-end gap-0 flex-wrap">

          {/* ID */}
          <div className="flex items-end gap-1.5 pr-3 mr-2 border-r border-gray-700/60">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 mb-0.5">ID</span>
              <input type="text" value={selectedQuestion.display_id} readOnly
                className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs font-mono outline-none w-24 text-purple-400" />
            </div>
          </div>

          {/* Chapter → Primary Tag → Micro Concept (+ Multi) */}
          <div className="flex items-end gap-1.5 flex-1 min-w-0 pr-3 mr-2 border-r border-gray-700/60">
            <div className="flex flex-col flex-1 min-w-0">
              <label className="text-[10px] text-gray-500 mb-0.5 flex items-center gap-1">
                Chapter {reclassifying && <span className="text-purple-400 animate-pulse">● …</span>}
              </label>
              <select
                value={selectedQuestion.metadata.chapter_id}
                disabled={reclassifying}
                onChange={(e) => {
                  const newChapterId = e.target.value;
                  if (!newChapterId || newChapterId === selectedQuestion.metadata.chapter_id) return;
                  onReclassify(selectedQuestion._id, newChapterId, selectedQuestion.metadata.tags);
                }}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs focus:border-purple-500 outline-none disabled:opacity-50 disabled:cursor-wait"
              >
                <option value="">Select Chapter</option>
                {chapters.map(ch => <option key={ch._id} value={ch._id}>{ch.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <label className="text-[10px] text-gray-500 mb-0.5 flex items-center justify-between">
                <span>Primary Tag</span>
                {selectedQuestion.metadata.tags?.[0]?.tag_id && (() => {
                  const validation = validateTag(selectedQuestion.metadata.tags![0].tag_id, selectedQuestion.metadata.chapter_id);
                  return validation.warning ? <span className="text-yellow-400 flex items-center gap-0.5"><AlertCircle size={8} />{validation.warning}</span> : null;
                })()}
              </label>
              <select
                value={selectedQuestion.metadata.tags?.[0]?.tag_id || ''}
                onChange={(e) => onUpdate(selectedQuestion._id, {
                  metadata: { ...selectedQuestion.metadata, tags: e.target.value ? [{ tag_id: e.target.value, weight: 1.0 }] : [] }
                })}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs text-purple-300 focus:border-purple-500 outline-none font-mono"
              >
                <option value="">Select Tag</option>
                {TAXONOMY_FROM_CSV
                  .filter(node => node.parent_id === selectedQuestion.metadata.chapter_id && node.type === 'topic')
                  .map(tag => <option key={tag.id} value={tag.id}>{tag.name}</option>)
                }
              </select>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <label className="text-[10px] text-gray-500 mb-0.5">Micro Concept</label>
              <select
                value={selectedQuestion.metadata.microConcept ?? ''}
                onChange={(e) => onUpdate(selectedQuestion._id, {
                  metadata: { ...selectedQuestion.metadata, microConcept: e.target.value }
                })}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs text-teal-300 focus:border-teal-500 outline-none"
              >
                <option value="">— select micro concept —</option>
                {(() => {
                  const primaryTagId = selectedQuestion.metadata.tags?.[0]?.tag_id;
                  if (!primaryTagId) return <option value="" disabled>Select a Primary Tag first</option>;
                  const microTopics = TAXONOMY_FROM_CSV.filter(node =>
                    node.parent_id === primaryTagId && node.type === 'micro_topic'
                  );
                  if (microTopics.length === 0) return <option value="" disabled>No micro concepts for this tag</option>;
                  return microTopics.map(micro => (
                    <option key={micro.id} value={micro.name}>{micro.name}</option>
                  ));
                })()}
              </select>
            </div>
            <label className="flex items-center gap-1 cursor-pointer shrink-0 pb-1">
              <input
                type="checkbox"
                checked={!!selectedQuestion.metadata.isMultiConcept}
                onChange={(e) => onUpdate(selectedQuestion._id, {
                  metadata: { ...selectedQuestion.metadata, isMultiConcept: e.target.checked }
                })}
                className="h-3.5 w-3.5 accent-teal-500"
              />
              <span className="text-xs text-gray-400">Multi</span>
            </label>
          </div>

          {/* Type → Question Nature → Difficulty */}
          <div className="flex items-end gap-1.5 pr-3 mr-2 border-r border-gray-700/60">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 mb-0.5">Type</span>
              <select
                value={selectedQuestion.type}
                onChange={(e) => {
                  const newType = e.target.value as Question['type'];
                  const oldType = selectedQuestion.type;
                  if (newType === oldType) return;
                  const update: Partial<Question> = { type: newType };
                  if (newType === 'NVT' || newType === 'WKEX' || newType === 'SUBJ') {
                    update.options = [] as Question['options'];
                    update.answer = {} as Question['answer'];
                  } else if (oldType === 'NVT' || oldType === 'WKEX' || oldType === 'SUBJ' || !selectedQuestion.options || selectedQuestion.options.length === 0) {
                    update.options = [
                      { id: 'a', text: 'Option A', is_correct: newType === 'SCQ' },
                      { id: 'b', text: 'Option B', is_correct: false },
                      { id: 'c', text: 'Option C', is_correct: false },
                      { id: 'd', text: 'Option D', is_correct: false }
                    ] as Question['options'];
                    update.answer = {} as Question['answer'];
                  }
                  onUpdate(selectedQuestion._id, update);
                }}
                className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs font-medium"
              >
                {QUESTION_TYPES.map(qt => <option key={qt.id} value={qt.id}>{qt.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 mb-0.5">Question Nature</span>
              <select
                value={selectedQuestion.metadata.questionNature ?? ''}
                onChange={(e) => onUpdate(selectedQuestion._id, {
                  metadata: { ...selectedQuestion.metadata, questionNature: (e.target.value || undefined) as 'Recall' | 'Rule_Application' | 'Numerical' | 'Comparative' | 'Graphical' | 'Conceptual' | 'Mechanistic' | 'Synthesis' | undefined }
                })}
                className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs text-purple-300 focus:border-purple-500 outline-none"
              >
                <option value="">— select nature —</option>
                <option value="Recall">Recall</option>
                <option value="Rule_Application">Rule Application</option>
                <option value="Numerical">Numerical</option>
                <option value="Comparative">Comparative</option>
                <option value="Graphical">Graphical</option>
                <option value="Conceptual">Conceptual</option>
                <option value="Mechanistic">Mechanistic</option>
                <option value="Synthesis">Synthesis</option>
              </select>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 mb-0.5">Difficulty</span>
              <select
                value={selectedQuestion.metadata.difficultyLevel}
                onChange={(e) => onUpdate(selectedQuestion._id, { metadata: { ...selectedQuestion.metadata, difficultyLevel: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 } })}
                className={`bg-gray-800/50 border rounded px-2 py-1 text-xs font-medium ${
                  selectedQuestion.metadata.difficultyLevel >= 4 ? 'border-red-500/50 text-red-400' :
                  selectedQuestion.metadata.difficultyLevel === 3 ? 'border-orange-500/50 text-orange-400' :
                  'border-emerald-500/50 text-emerald-400'}`}
              >
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
                <option value="5">Level 5</option>
              </select>
            </div>
          </div>

          {/* Boards */}
          <div className="flex items-end gap-1.5 pr-3 mr-2 border-r border-gray-700/60">
            {(() => {
              const BOARD_OPTIONS = ['JEE', 'NEET', 'BITSAT', 'CBSE'] as const;
              type Board = typeof BOARD_OPTIONS[number];
              const current = (selectedQuestion.metadata.applicableExams
                ?? (selectedQuestion.metadata.examBoard ? [selectedQuestion.metadata.examBoard] : [])
              ) as Board[];
              const toggle = (b: Board) => {
                const next = current.includes(b)
                  ? current.filter(x => x !== b)
                  : [...current, b];
                onUpdate(selectedQuestion._id, {
                  metadata: { ...selectedQuestion.metadata, applicableExams: next.length ? next : undefined },
                });
              };
              return (
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 mb-0.5">Boards</span>
                  <div className="flex items-center gap-1">
                    {BOARD_OPTIONS.map(b => {
                      const on = current.includes(b);
                      return (
                        <button
                          key={b}
                          type="button"
                          onClick={() => toggle(b)}
                          className={`px-2 py-1 text-[11px] rounded border ${on
                            ? 'bg-orange-500/20 border-orange-500/60 text-orange-300'
                            : 'bg-gray-800/50 border-gray-700/50 text-gray-400 hover:bg-gray-700/50'}`}
                        >
                          {b}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Action cluster: Tag status + AI Suggest + icon actions */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Tag status badge */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold border ${
              !selectedQuestion.metadata.chapter_id ? 'bg-red-900/20 border-red-600/40 text-red-400' :
              !isTagValid(selectedQuestion.metadata.tags) ? 'bg-yellow-900/20 border-yellow-600/40 text-yellow-400' :
              'bg-green-900/20 border-green-600/40 text-green-400'}`}>
              {!selectedQuestion.metadata.chapter_id
                ? <><AlertTriangle size={11} /> No Chapter</>
                : !isTagValid(selectedQuestion.metadata.tags)
                ? <><AlertCircle size={11} /> No Tag</>
                : <><Check size={11} /> Tagged</>}
            </div>
            <button
              onClick={() => onAITagSuggestion(selectedQuestion._id)}
              disabled={aiAnalyzing}
              className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded text-[10px] font-bold transition disabled:opacity-50"
            >
              <Sparkles size={10} /> {aiAnalyzing ? '…' : 'AI Tags'}
            </button>
            {/* Star — Top PYQ */}
            <div className="flex flex-col items-center">
              <button onClick={() => onUpdate(selectedQuestion._id, { metadata: { ...selectedQuestion.metadata, is_top_pyq: !selectedQuestion.metadata.is_top_pyq } })}
                className={`p-1.5 rounded transition ${selectedQuestion.metadata.is_top_pyq ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-800/50 text-gray-500 hover:text-amber-400'}`} title="Top PYQ">
                <Star size={14} fill={selectedQuestion.metadata.is_top_pyq ? "currentColor" : "none"} />
              </button>
              <span className="text-[9px] font-mono text-amber-400/70 leading-none">
                {questions.filter(q => q.metadata.is_top_pyq && q.metadata.chapter_id === selectedQuestion.metadata.chapter_id).length}
              </span>
            </div>
            {/* Bookmark — Demo Question (drives /handwritten-notes side-by-side practice).
                Quality gate enforced server-side on save: solution must have ≥200 chars
                of text_markdown and latex_validated=true (see /api/v2/questions/[id]/route.ts). */}
            <div className="flex flex-col items-center">
              <button onClick={() => onUpdate(selectedQuestion._id, { metadata: { ...selectedQuestion.metadata, is_demo_question: !selectedQuestion.metadata.is_demo_question } })}
                className={`p-1.5 rounded transition ${selectedQuestion.metadata.is_demo_question ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-800/50 text-gray-500 hover:text-orange-400'}`} title="Demo Question (side-by-side practice on /handwritten-notes)">
                <Bookmark size={14} fill={selectedQuestion.metadata.is_demo_question ? "currentColor" : "none"} />
              </button>
              <span className="text-[9px] font-mono text-orange-400/70 leading-none">
                {questions.filter(q => q.metadata.is_demo_question && q.metadata.chapter_id === selectedQuestion.metadata.chapter_id).length}
              </span>
            </div>
            <button onClick={onOpenFlagModal}
              className={`p-1.5 rounded transition ${selectedQuestion.flags?.some(f => !f.resolved) ? 'bg-red-500/20 text-red-500' : 'bg-gray-800/50 text-gray-500 hover:text-red-400'}`} title="Flag">
              <AlertTriangle size={14} />
            </button>
            <button
              onClick={() => onDelete(selectedQuestion._id)}
              disabled={!canDelete}
              title={!canDelete ? 'Only super admins can delete questions' : 'Delete question'}
              className={`p-1.5 rounded transition ${deletingId === selectedQuestion._id ? 'bg-red-500 text-white' : 'bg-gray-800/50 text-gray-500 hover:text-red-400'} ${!canDelete ? 'opacity-30 cursor-not-allowed' : ''}`}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <AITagSuggestionsBox
          isVisible={showTagSuggestions}
          suggestions={tagSuggestions}
          selectedQuestion={selectedQuestion}
          onApply={onUpdate}
          onDismiss={() => setShowTagSuggestions(false)}
        />

      </div>
    </div>
  );
}
