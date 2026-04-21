'use client';

import { useState } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';
import type { BlogIdeaRow } from '../BlogAdminClient';

interface Props {
  ideas: BlogIdeaRow[];
  onChanged: () => Promise<void> | void;
}

export default function IdeaForm({ ideas, onChanged }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [priority, setPriority] = useState(3);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    if (!title.trim()) { setError('Title required'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/blog/ideas', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description,
          target_tags: tagsStr.split(',').map(s => s.trim()).filter(Boolean),
          priority,
        }),
      });
      const j = await res.json();
      if (!res.ok || !j.success) throw new Error(j.error || 'Save failed');
      setTitle(''); setDescription(''); setTagsStr(''); setPriority(3);
      await onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm('Delete this idea?')) return;
    await fetch(`/api/blog/ideas?id=${id}`, { method: 'DELETE' });
    await onChanged();
  };

  const toggleStatus = async (id: string, newStatus: BlogIdeaRow['status']) => {
    await fetch('/api/blog/ideas', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    await onChanged();
  };

  const pending = ideas.filter(i => i.status === 'pending');
  const drafted = ideas.filter(i => i.status === 'drafted');
  const archived = ideas.filter(i => i.status === 'archived');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
      {/* New idea form */}
      <div className="bg-[#0B0F15] border border-white/5 rounded-xl p-5 h-fit sticky top-32">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Plus size={16} className="text-orange-400" />
          New idea
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Idea title — e.g. Why Coordination Compounds trip up JEE aspirants"
            className="w-full bg-[#151E32] border border-white/5 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-orange-500/50 focus:outline-none"
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Notes, angle, key points to cover, anecdotes, questions to answer…"
            rows={6}
            className="w-full bg-[#151E32] border border-white/5 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-orange-500/50 focus:outline-none resize-none"
          />
          <input
            type="text"
            value={tagsStr}
            onChange={e => setTagsStr(e.target.value)}
            placeholder="Target tags (comma-separated)"
            className="w-full bg-[#151E32] border border-white/5 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-orange-500/50 focus:outline-none"
          />
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Priority</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setPriority(n)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                    priority >= n
                      ? 'bg-orange-500/20 border border-orange-500/50 text-orange-300'
                      : 'bg-white/5 border border-white/10 text-gray-500'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            onClick={submit}
            disabled={saving}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save idea'}
          </button>
          <p className="text-[10px] text-gray-500 text-center">
            The daily RSS cron reviews pending ideas each morning and may draft them into the Review column.
          </p>
        </div>
      </div>

      {/* Idea columns */}
      <div className="space-y-6">
        <IdeaColumn label="Pending" items={pending} onDelete={del} onStatus={toggleStatus} />
        <IdeaColumn label="Drafted" items={drafted} onDelete={del} onStatus={toggleStatus} />
        <IdeaColumn label="Archived" items={archived} onDelete={del} onStatus={toggleStatus} />
      </div>
    </div>
  );
}

function IdeaColumn({
  label,
  items,
  onDelete,
  onStatus,
}: {
  label: string;
  items: BlogIdeaRow[];
  onDelete: (id: string) => void;
  onStatus: (id: string, s: BlogIdeaRow['status']) => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
        {label} <span className="text-gray-500">· {items.length}</span>
      </h3>
      {items.length === 0 && <p className="text-xs text-gray-600">None yet.</p>}
      <div className="grid gap-3 md:grid-cols-2">
        {items.map(i => (
          <div key={i._id} className="bg-[#151E32] border border-white/5 rounded-xl p-4">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-sm leading-snug">{i.title}</h4>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                {Array.from({ length: i.priority }).map((_, idx) => (
                  <Star key={idx} size={10} className="text-orange-400 fill-orange-400" />
                ))}
              </div>
            </div>
            {i.description && (
              <p className="text-xs text-gray-400 mt-2 line-clamp-3 whitespace-pre-wrap">{i.description}</p>
            )}
            {i.target_tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {i.target_tags.map(t => (
                  <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400">{t}</span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
              <select
                value={i.status}
                onChange={e => onStatus(i._id, e.target.value as BlogIdeaRow['status'])}
                className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-gray-300 focus:outline-none"
              >
                <option value="pending">pending</option>
                <option value="drafted">drafted</option>
                <option value="archived">archived</option>
              </select>
              <button onClick={() => onDelete(i._id)} className="p-1 rounded hover:bg-red-500/10 text-gray-500 hover:text-red-400">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
