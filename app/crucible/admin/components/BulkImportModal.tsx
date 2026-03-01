'use client';

import { useState, useRef } from 'react';
import { X, Upload, FileJson, CheckCircle, AlertCircle, ChevronRight, Loader2, Eye } from 'lucide-react';
import { TAXONOMY_FROM_CSV } from '../taxonomy/taxonomyData_from_csv';
import { validateLaTeX } from '@/lib/latexValidator';

interface ImportQuestion {
  display_id?: string;
  type?: string;
  difficulty?: string;
  question_text?: { markdown: string };
  options?: Array<{ id: string; text: string; is_correct: boolean }>;
  answer?: Record<string, unknown>;
  solution?: string | null | { text_markdown: string };
  tag_id?: string;
  metadata?: {
    chapter_id?: string;
    difficulty?: string;
    tags?: Array<{ tag_id: string; weight: number }>;
    exam_source?: Record<string, unknown>;
    is_pyq?: boolean;
  };
  exam_source?: Record<string, unknown>;
}

interface ValidationIssue {
  index: number;
  display_id: string;
  issues: string[];
  warnings: string[];
}

interface BulkImportModalProps {
  onClose: () => void;
  onImported: (count: number) => void;
  defaultChapterId?: string;
}

const CHAPTER_PREFIX_MAP: Record<string, string> = {
  ch11_atom: 'ATOM', ch11_bonding: 'BOND', ch11_chem_eq: 'CEQ', ch11_goc: 'GOC',
  ch11_hydrocarbon: 'HC', ch11_ionic_eq: 'IEQ', ch11_mole: 'MOLE', ch11_pblock: 'PB11',
  ch11_periodic: 'PERI', ch11_prac_org: 'POC', ch11_redox: 'RDX', ch11_thermo: 'THERMO',
  ch12_alcohols: 'ALCO', ch12_carbonyl: 'ALDO', ch12_amines: 'AMIN', ch12_biomolecules: 'BIO',
  ch12_coord: 'CORD', ch12_dblock: 'DNF', ch12_electrochem: 'EC',
  ch12_haloalkanes: 'HALO', ch12_kinetics: 'CK', ch12_pblock: 'PB12',
  ch12_salt: 'SALT', ch12_solutions: 'SOL', ch12_prac_phys: 'PPC',
};

function normalizeQuestion(raw: ImportQuestion, chapterId: string): Record<string, unknown> {
  const now = new Date().toISOString();
  const solutionText = typeof raw.solution === 'string'
    ? raw.solution
    : raw.solution?.text_markdown ?? null;

  const chId = raw.metadata?.chapter_id || chapterId;
  const tags = raw.metadata?.tags
    ? raw.metadata.tags
    : raw.tag_id
      ? [{ tag_id: raw.tag_id, weight: 1.0 }]
      : [];
  const examSource = raw.metadata?.exam_source || raw.exam_source || null;

  return {
    display_id: raw.display_id || '',
    question_text: { markdown: raw.question_text?.markdown || '', latex_validated: false },
    type: raw.type || 'SCQ',
    options: raw.options || [],
    answer: raw.answer || null,
    solution: solutionText ? { text_markdown: solutionText, latex_validated: false } : null,
    metadata: {
      difficulty: raw.difficulty || raw.metadata?.difficulty || 'Medium',
      chapter_id: chId,
      tags,
      is_pyq: raw.metadata?.is_pyq ?? !!examSource,
      is_top_pyq: false,
      exam_source: examSource,
      source_reference: {
        type: 'json_import',
        verified_against_source: false,
        verification_date: now,
        verified_by: 'admin_import',
      },
    },
    status: 'review',
    version: 1,
    quality_score: 80,
    created_by: 'admin_import',
    updated_by: 'admin_import',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  };
}

function validateQuestion(q: ImportQuestion, index: number, chapterId: string): ValidationIssue {
  const issues: string[] = [];
  const warnings: string[] = [];
  const displayId = q.display_id || `Q${index + 1}`;
  const chId = q.metadata?.chapter_id || chapterId;

  if (!q.display_id) issues.push('Missing display_id');
  else if (!/^[A-Z0-9]{2,10}-\d{3,}$/.test(q.display_id)) issues.push(`Invalid display_id format: "${q.display_id}"`);

  if (!q.type) issues.push('Missing type (SCQ/MCQ/NVT/AR/MST/MTC)');

  const markdown = q.question_text?.markdown || '';
  if (!markdown || markdown.length < 10) issues.push('Question text too short or missing');

  if (q.type !== 'NVT' && q.options) {
    if (q.options.length !== 4) issues.push(`Expected 4 options, got ${q.options.length}`);
    if (q.type === 'SCQ') {
      const correctCount = q.options.filter(o => o.is_correct).length;
      if (correctCount !== 1) warnings.push(`SCQ should have exactly 1 correct option (found ${correctCount})`);
    }
  }

  if (chId && !TAXONOMY_FROM_CSV.some(n => n.id === chId && n.type === 'chapter')) {
    issues.push(`chapter_id "${chId}" not found in taxonomy`);
  }

  const tagId = q.metadata?.tags?.[0]?.tag_id || q.tag_id;
  if (tagId && chId) {
    const validTag = TAXONOMY_FROM_CSV.some(n => n.id === tagId && n.parent_id === chId);
    if (!validTag) warnings.push(`tag_id "${tagId}" may not belong to chapter "${chId}"`);
  }

  if (markdown.length > 10) {
    const latexResult = validateLaTeX(markdown);
    const latexErrors = latexResult.errors.filter(e => e.severity === 'error');
    latexErrors.slice(0, 3).forEach(e => warnings.push(`LaTeX L${e.line}: ${e.message}`));
  }

  return { index, display_id: displayId, issues, warnings };
}

type Step = 'input' | 'validate' | 'preview' | 'importing' | 'done';

export default function BulkImportModal({ onClose, onImported, defaultChapterId = '' }: BulkImportModalProps) {
  const [step, setStep] = useState<Step>('input');
  const [jsonText, setJsonText] = useState('');
  const [parseError, setParseError] = useState('');
  const [parsed, setParsed] = useState<ImportQuestion[]>([]);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [chapterId, setChapterId] = useState(defaultChapterId);
  const [importedCount, setImportedCount] = useState(0);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chapters = TAXONOMY_FROM_CSV.filter(n => n.type === 'chapter');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setJsonText(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handleParse = () => {
    setParseError('');
    let raw: unknown;
    try {
      raw = JSON.parse(jsonText.trim());
    } catch (e) {
      setParseError(`JSON parse error: ${(e as Error).message}`);
      return;
    }

    const arr = Array.isArray(raw) ? raw : [raw];
    if (arr.length === 0) { setParseError('No questions found in JSON'); return; }
    if (arr.length > 100) { setParseError('Maximum 100 questions per import batch'); return; }

    const issues = arr.map((q, i) => validateQuestion(q as ImportQuestion, i, chapterId));
    setParsed(arr as ImportQuestion[]);
    setValidationIssues(issues);
    setStep('validate');
  };

  const hardErrors = validationIssues.filter(v => v.issues.length > 0);
  const canProceed = hardErrors.length === 0;

  const handleImport = async () => {
    setStep('importing');
    const errors: string[] = [];
    let ok = 0;
    for (let i = 0; i < parsed.length; i++) {
      const normalized = normalizeQuestion(parsed[i], chapterId);
      try {
        const res = await fetch('/api/v2/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(normalized),
        });
        const data = await res.json();
        if (data.success) { ok++; }
        else { errors.push(`${normalized.display_id}: ${data.error || 'Unknown error'}`); }
      } catch (e) {
        errors.push(`${normalized.display_id}: Network error`);
      }
      setImportProgress(i + 1);
    }
    setImportedCount(ok);
    setImportErrors(errors);
    setStep('done');
    if (ok > 0) onImported(ok);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/85 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700/60 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 flex items-center justify-center">
              <FileJson size={18} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Bulk JSON Import</h2>
              <p className="text-xs text-gray-500">Paste or upload a JSON array of questions</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition p-1 rounded-lg hover:bg-gray-800">
            <X size={18} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 px-5 py-3 border-b border-gray-800/60 shrink-0">
          {(['input', 'validate', 'preview', 'done'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-0">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${step === s ? 'bg-blue-600/20 text-blue-300' : ['input','validate','preview','done'].indexOf(step) > i ? 'text-green-400' : 'text-gray-600'}`}>
                {['input','validate','preview','done'].indexOf(step) > i
                  ? <CheckCircle size={12} />
                  : <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">{i + 1}</span>
                }
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </div>
              {i < 3 && <ChevronRight size={12} className="text-gray-700 mx-1" />}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* STEP 1: Input */}
          {step === 'input' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Target Chapter</label>
                <select
                  value={chapterId}
                  onChange={e => setChapterId(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none"
                >
                  <option value="">— Select chapter (or include in JSON) —</option>
                  {chapters.map(c => (
                    <option key={c.id} value={c.id}>{c.name} [{CHAPTER_PREFIX_MAP[c.id] || c.id}]</option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-600 mt-1">If chapter_id is in the JSON, it will override this selection.</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">JSON Input</label>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition px-3 py-1.5 rounded-lg border border-blue-500/30 hover:border-blue-400/50"
                  >
                    <Upload size={12} /> Upload .json file
                  </button>
                  <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                </div>
                <textarea
                  value={jsonText}
                  onChange={e => setJsonText(e.target.value)}
                  placeholder={`Paste JSON array here:\n[\n  {\n    "display_id": "ALCO-179",\n    "type": "SCQ",\n    "difficulty": "Medium",\n    "question_text": { "markdown": "The major product..." },\n    "options": [\n      { "id": "a", "text": "...", "is_correct": false },\n      { "id": "b", "text": "...", "is_correct": true },\n      { "id": "c", "text": "...", "is_correct": false },\n      { "id": "d", "text": "...", "is_correct": false }\n    ],\n    "tag_id": "tag_alcohols_4",\n    "exam_source": { "exam": "JEE Main", "year": 2023, "month": "Jan", "shift": "Morning" }\n  }\n]`}
                  className="w-full h-64 bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-xs font-mono text-gray-300 focus:border-blue-500 outline-none resize-none"
                />
                {parseError && (
                  <div className="mt-2 flex items-start gap-2 text-red-400 bg-red-950/30 border border-red-500/30 rounded-lg px-3 py-2 text-xs">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" /> {parseError}
                  </div>
                )}
              </div>

              <div className="bg-gray-800/40 rounded-xl p-4 text-xs text-gray-500 space-y-1.5">
                <p className="font-semibold text-gray-400 mb-2">Accepted JSON fields per question:</p>
                <p><code className="text-blue-300">display_id</code> — e.g. <code>"ALCO-179"</code> (required)</p>
                <p><code className="text-blue-300">type</code> — SCQ / MCQ / NVT / AR / MST / MTC</p>
                <p><code className="text-blue-300">difficulty</code> — Easy / Medium / Hard</p>
                <p><code className="text-blue-300">question_text.markdown</code> — question body with LaTeX</p>
                <p><code className="text-blue-300">options</code> — array of 4 <code>&#123;id,text,is_correct&#125;</code></p>
                <p><code className="text-blue-300">tag_id</code> — e.g. <code>"tag_alcohols_4"</code></p>
                <p><code className="text-blue-300">exam_source</code> — <code>&#123;exam,year,month,day,shift&#125;</code></p>
                <p><code className="text-blue-300">solution</code> — string or null (TEXT-ONLY mode = null)</p>
              </div>
            </div>
          )}

          {/* STEP 2: Validate */}
          {step === 'validate' && (
            <div className="space-y-4">
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${canProceed ? 'bg-green-950/30 border-green-600/30' : 'bg-red-950/20 border-red-500/30'}`}>
                {canProceed
                  ? <CheckCircle size={20} className="text-green-400 shrink-0" />
                  : <AlertCircle size={20} className="text-red-400 shrink-0" />
                }
                <div>
                  <p className={`font-semibold text-sm ${canProceed ? 'text-green-300' : 'text-red-300'}`}>
                    {canProceed
                      ? `${parsed.length} questions validated — ready to import`
                      : `${hardErrors.length} question(s) have blocking errors`}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {validationIssues.filter(v => v.warnings.length > 0).length} questions have warnings (non-blocking)
                  </p>
                </div>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {validationIssues.map((v) => (
                  (v.issues.length > 0 || v.warnings.length > 0) && (
                    <div key={v.index} className={`rounded-xl border p-3 text-xs ${v.issues.length > 0 ? 'bg-red-950/20 border-red-500/20' : 'bg-yellow-950/20 border-yellow-600/20'}`}>
                      <p className="font-bold text-gray-300 mb-1.5">{v.display_id}</p>
                      {v.issues.map((issue, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-red-300 mb-1">
                          <span className="text-red-500 mt-0.5">✕</span> {issue}
                        </div>
                      ))}
                      {v.warnings.map((warn, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-yellow-400 mb-1">
                          <span className="text-yellow-500 mt-0.5">⚠</span> {warn}
                        </div>
                      ))}
                    </div>
                  )
                ))}
                {validationIssues.every(v => v.issues.length === 0 && v.warnings.length === 0) && (
                  <div className="text-center py-8 text-gray-600 text-sm">All questions passed validation ✓</div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Preview */}
          {step === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">Preview question <span className="text-white font-mono">{previewIndex + 1} / {parsed.length}</span></p>
                <div className="flex gap-2">
                  <button disabled={previewIndex === 0} onClick={() => setPreviewIndex(p => p - 1)} className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-40 transition text-gray-300">← Prev</button>
                  <button disabled={previewIndex === parsed.length - 1} onClick={() => setPreviewIndex(p => p + 1)} className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-40 transition text-gray-300">Next →</button>
                </div>
              </div>
              {parsed[previewIndex] && (() => {
                const q = parsed[previewIndex];
                const norm = normalizeQuestion(q, chapterId);
                return (
                  <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 p-4 space-y-3 text-sm">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-purple-400 text-xs">{String(norm.display_id)}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">{String(norm.type)}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-400">{String((norm.metadata as Record<string,unknown>)?.difficulty)}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-400">
                        chapter: {String((norm.metadata as Record<string,unknown>)?.chapter_id)}
                      </span>
                    </div>
                    <div className="bg-gray-900/60 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Question</p>
                      <p className="text-gray-200 text-sm leading-relaxed font-mono text-xs whitespace-pre-wrap">
                        {(norm.question_text as { markdown: string })?.markdown}
                      </p>
                    </div>
                    {(norm.options as Array<{ id: string; text: string; is_correct: boolean }>)?.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {(norm.options as Array<{ id: string; text: string; is_correct: boolean }>).map(opt => (
                          <div key={opt.id} className={`text-xs px-3 py-2 rounded-lg border ${opt.is_correct ? 'bg-green-900/20 border-green-600/30 text-green-300' : 'bg-gray-800/40 border-gray-700/40 text-gray-400'}`}>
                            <span className="font-bold mr-2">{opt.id.toUpperCase()}.</span>{opt.text}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-gray-600">
                      Tags: {((norm.metadata as Record<string,unknown>)?.tags as Array<{tag_id:string}>)?.map(t => t.tag_id).join(', ') || '—'} |
                      Exam: {JSON.stringify((norm.metadata as Record<string,unknown>)?.exam_source) || '—'}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* STEP: Importing */}
          {step === 'importing' && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 size={40} className="text-blue-400 animate-spin" />
              <p className="text-white font-semibold">Importing questions…</p>
              <div className="w-64 bg-gray-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${(importProgress / parsed.length) * 100}%` }} />
              </div>
              <p className="text-sm text-gray-500">{importProgress} / {parsed.length}</p>
            </div>
          )}

          {/* STEP: Done */}
          {step === 'done' && (
            <div className="space-y-4">
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${importErrors.length === 0 ? 'bg-green-950/30 border-green-600/30' : 'bg-yellow-950/20 border-yellow-600/30'}`}>
                <CheckCircle size={24} className="text-green-400 shrink-0" />
                <div>
                  <p className="font-bold text-green-300 text-base">{importedCount} questions imported successfully</p>
                  {importErrors.length > 0 && <p className="text-yellow-400 text-sm mt-0.5">{importErrors.length} failed</p>}
                </div>
              </div>
              {importErrors.length > 0 && (
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {importErrors.map((e, i) => (
                    <div key={i} className="text-xs text-red-400 bg-red-950/20 border border-red-500/20 rounded-lg px-3 py-2">{e}</div>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500">Questions are in <code className="text-gray-300">review</code> status. Open the admin dashboard to review and publish them.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/60 flex items-center justify-between shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition rounded-lg hover:bg-gray-800">
            {step === 'done' ? 'Close' : 'Cancel'}
          </button>
          <div className="flex gap-3">
            {step === 'validate' && (
              <button onClick={() => setStep('input')} className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-xl transition">
                ← Back
              </button>
            )}
            {step === 'preview' && (
              <button onClick={() => setStep('validate')} className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-xl transition">
                ← Back
              </button>
            )}
            {step === 'input' && (
              <button
                onClick={handleParse}
                disabled={!jsonText.trim()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition shadow-lg"
              >
                Parse & Validate →
              </button>
            )}
            {step === 'validate' && (
              <button
                onClick={() => setStep('preview')}
                className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold rounded-xl transition flex items-center gap-2"
              >
                <Eye size={14} /> Preview
              </button>
            )}
            {step === 'validate' && canProceed && (
              <button
                onClick={handleImport}
                className="px-5 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-green-900/20"
              >
                Import {parsed.length} Questions →
              </button>
            )}
            {step === 'preview' && (
              <button
                onClick={handleImport}
                className="px-5 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-green-900/20"
              >
                Import {parsed.length} Questions →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
