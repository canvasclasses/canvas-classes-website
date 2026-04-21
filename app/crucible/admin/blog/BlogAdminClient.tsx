'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, FileText, Clock, CheckCircle2, Archive, Lightbulb, Rss, RefreshCw, Eye } from 'lucide-react';
import BlogEditor from './components/BlogEditor';
import IdeaForm from './components/IdeaForm';
import SourcesPanel from './components/SourcesPanel';

export type BlogStatus = 'idea' | 'draft' | 'review' | 'scheduled' | 'published' | 'archived';

export interface BlogPostRow {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  author: string;
  status: BlogStatus;
  source: 'manual' | 'rss' | 'idea';
  source_refs: string[];
  idea_id?: string;
  scheduled_for?: string | null;
  published_at?: string | null;
  cover_image?: { url: string; alt?: string };
  updated_at: string;
  created_at: string;
  seo?: { title?: string; description?: string; keywords?: string[] };
}

export interface BlogIdeaRow {
  _id: string;
  title: string;
  description: string;
  target_tags: string[];
  priority: number;
  status: 'pending' | 'drafted' | 'archived';
  target_publish_date?: string | null;
  created_at: string;
}

const COLUMNS: { status: BlogStatus; label: string; icon: React.ElementType; tint: string }[] = [
  { status: 'draft', label: 'Drafts', icon: FileText, tint: 'text-amber-400' },
  { status: 'review', label: 'Review', icon: Eye, tint: 'text-purple-400' },
  { status: 'scheduled', label: 'Scheduled', icon: Clock, tint: 'text-sky-400' },
  { status: 'published', label: 'Published', icon: CheckCircle2, tint: 'text-emerald-400' },
  { status: 'archived', label: 'Archived', icon: Archive, tint: 'text-gray-500' },
];

export default function BlogAdminClient({ adminEmail }: { adminEmail: string }) {
  const [tab, setTab] = useState<'board' | 'ideas' | 'sources'>('board');
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [ideas, setIdeas] = useState<BlogIdeaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPostRow | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [prefill, setPrefill] = useState<Partial<BlogPostRow> | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [postsRes, ideasRes] = await Promise.all([
        fetch('/api/blog/posts?limit=200').then(r => r.json()),
        fetch('/api/blog/ideas?limit=200').then(r => r.json()),
      ]);
      if (postsRes.success) setPosts(postsRes.data);
      if (ideasRes.success) setIdeas(ideasRes.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const grouped = useMemo(() => {
    const g: Record<BlogStatus, BlogPostRow[]> = {
      idea: [], draft: [], review: [], scheduled: [], published: [], archived: [],
    };
    for (const p of posts) g[p.status]?.push(p);
    return g;
  }, [posts]);

  const onSavePost = async (payload: Partial<BlogPostRow> & { id?: string }) => {
    const { id, ...rest } = payload;
    const url = id ? `/api/blog/posts/${id}` : '/api/blog/posts';
    const method = id ? 'PATCH' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(rest),
    });
    const j = await res.json();
    if (!res.ok || !j.success) throw new Error(j.error || 'Save failed');
    await loadAll();
    return j.data as BlogPostRow;
  };

  const onDeletePost = async (id: string) => {
    if (!confirm('Archive this post? It will be hidden from the site.')) return;
    const res = await fetch(`/api/blog/posts/${id}`, { method: 'DELETE' });
    if (res.ok) await loadAll();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-white/5 bg-gray-900/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Blog Studio</h1>
            <p className="text-xs text-gray-500 mt-1">Signed in as {adminEmail}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={() => { setPrefill(null); setCreatingNew(true); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm hover:opacity-90 transition"
            >
              <Plus size={16} />
              New post
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          {([
            ['board', 'Board', FileText],
            ['ideas', 'Ideas', Lightbulb],
            ['sources', 'RSS Sources', Rss],
          ] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                tab === key
                  ? 'border-orange-500 text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {tab === 'board' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {COLUMNS.map(col => {
              const Icon = col.icon;
              const items = grouped[col.status] || [];
              return (
                <div key={col.status} className="bg-[#0B0F15] border border-white/5 rounded-xl flex flex-col min-h-[60vh]">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Icon size={14} className={col.tint} />
                      <span className="text-sm font-semibold">{col.label}</span>
                    </div>
                    <span className="text-xs text-gray-500">{items.length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {items.length === 0 && (
                      <p className="text-xs text-gray-600 text-center py-8">Nothing here.</p>
                    )}
                    {items.map(p => (
                      <button
                        key={p._id}
                        onClick={() => setEditing(p)}
                        className="w-full text-left p-3 rounded-lg bg-[#151E32] border border-white/5 hover:border-orange-500/40 transition group"
                      >
                        <div className="flex items-start gap-2">
                          {p.cover_image?.url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.cover_image.url} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug">{p.title}</h3>
                            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                              {p.source === 'rss' && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">RSS</span>
                              )}
                              {p.source === 'idea' && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">idea</span>
                              )}
                              {p.tags.slice(0, 2).map(t => (
                                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400">{t}</span>
                              ))}
                            </div>
                            {p.scheduled_for && p.status === 'scheduled' && (
                              <p className="text-[10px] text-sky-400 mt-1.5">
                                → {new Date(p.scheduled_for).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'ideas' && (
          <IdeaForm ideas={ideas} onChanged={loadAll} />
        )}

        {tab === 'sources' && (
          <SourcesPanel
            onDraftFromSource={(source) => {
              setPrefill({
                title: source.title,
                excerpt: source.summary.slice(0, 300),
                content: `# ${source.title}\n\n> Source: [${source.source_name}](${source.url})\n\n${source.summary}\n`,
                tags: source.categories,
                source: 'rss',
                source_refs: [source._id],
              });
              setCreatingNew(true);
            }}
          />
        )}
      </div>

      {(editing || creatingNew) && (
        <BlogEditor
          initial={editing || undefined}
          prefill={!editing ? prefill || undefined : undefined}
          onClose={() => { setEditing(null); setCreatingNew(false); setPrefill(null); }}
          onSave={onSavePost}
          onDelete={editing ? () => onDeletePost(editing._id) : undefined}
        />
      )}
    </div>
  );
}
