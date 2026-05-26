'use client';

import { Trash2 } from 'lucide-react';
import type { Grant, Subject, AccessLevel } from '../hooks/usePermissions';
import { ChapterMultiSelect } from './ChapterMultiSelect';
import { Select } from './Select';

interface GrantEditorProps {
  grant: Grant;
  /** Subjects already used by other grants in the same form — disabled in the dropdown. */
  disabledSubjects: Subject[];
  onChange: (next: Grant) => void;
  onRemove: () => void;
}

const ALL_SUBJECTS: Subject[] = ['chemistry', 'physics', 'mathematics', 'biology'];

const SUBJECT_LABEL: Record<Subject, string> = {
  chemistry: 'Chemistry',
  physics: 'Physics',
  mathematics: 'Mathematics',
  biology: 'Biology',
};

export function GrantEditor({ grant, disabledSubjects, onChange, onRemove }: GrantEditorProps) {
  const isAllChapters = grant.chapters === 'all';
  const specificChapters: string[] = grant.chapters === 'all' ? [] : grant.chapters;

  const handleSubjectChange = (subject: Subject) => {
    // Reset chapter selection when subject changes (otherwise stored chapter
    // IDs would be stale and fail cross-field validation).
    onChange({ subject, chapters: 'all', level: grant.level });
  };

  const handleChaptersModeChange = (mode: 'all' | 'specific') => {
    if (mode === 'all') onChange({ ...grant, chapters: 'all' });
    else onChange({ ...grant, chapters: specificChapters });
  };

  const handleSpecificChaptersChange = (ids: string[]) => {
    onChange({ ...grant, chapters: ids });
  };

  const handleLevelChange = (level: AccessLevel) => {
    onChange({ ...grant, level });
  };

  return (
    <div className="rounded-lg border border-white/10 bg-[#0B0F15]/60 p-4">
      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-3">
          <div>
            <label className="block text-xs uppercase tracking-widest text-white/40 mb-1">
              Subject
            </label>
            <Select<Subject>
              value={grant.subject}
              onChange={handleSubjectChange}
              options={ALL_SUBJECTS.map((s) => ({
                value: s,
                label: SUBJECT_LABEL[s],
                disabled: s !== grant.subject && disabledSubjects.includes(s),
              }))}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/40 mb-1">
              Chapters
            </label>
            <div className="flex gap-4 text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-white/80">
                <input
                  type="radio"
                  checked={!isAllChapters}
                  onChange={() => handleChaptersModeChange('specific')}
                  className="accent-orange-500"
                />
                Specific chapters
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-white/80">
                <input
                  type="radio"
                  checked={isAllChapters}
                  onChange={() => handleChaptersModeChange('all')}
                  className="accent-orange-500"
                />
                All chapters in subject
              </label>
            </div>
            {!isAllChapters && (
              <div className="mt-2">
                <ChapterMultiSelect
                  subject={grant.subject}
                  selected={specificChapters}
                  onChange={handleSpecificChaptersChange}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/40 mb-1">
              Level
            </label>
            <div className="flex gap-4 text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-white/80">
                <input
                  type="radio"
                  checked={grant.level === 'view'}
                  onChange={() => handleLevelChange('view')}
                  className="accent-orange-500"
                />
                View only
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-white/80">
                <input
                  type="radio"
                  checked={grant.level === 'edit'}
                  onChange={() => handleLevelChange('edit')}
                  className="accent-orange-500"
                />
                Edit
              </label>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="rounded-md p-2 text-white/40 hover:bg-white/5 hover:text-red-400"
          title="Remove grant"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
