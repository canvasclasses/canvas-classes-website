'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { X, Save, Trash2, ExternalLink, Calendar, Tag, Image as ImageIcon, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import type { BlogPostRow, BlogStatus } from '../BlogAdminClient';
import BlogImageDrop from './BlogImageDrop';

interface Props {
  initial?: BlogPostRow;
  prefill?: Partial<BlogPostRow>;
  onClose: () => void;
  onSave: (payload: Partial<BlogPostRow> & { id?: string }) => Promise<BlogPostRow>;
  onDelete?: () => void;
}

function slugify(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80);
}

export default function BlogEditor({ initial, prefill, onClose, onSave, onDelete }: Props) {
  const seed = initial || prefill || {};
  const [title, setTitle] = useState(seed.title || '');
  const [slug, setSlug] = useState(seed.slug || '');
  const [excerpt, setExcerpt] = useState(seed.excerpt || '');
  const [content, setContent] = useState(seed.content || '');
  const [tagsStr, setTagsStr] = useState((seed.tags || []).join(', '));
  const [status, setStatus] = useState<BlogStatus>(seed.status || 'draft');
  const [scheduledFor, setScheduledFor] = useState(
    seed.scheduled_for ? new Date(seed.scheduled_for).toISOString().slice(0, 16) : ''
  );
  const [coverUrl, setCoverUrl] = useState(seed.cover_image?.url || '');
  const [coverAlt, setCoverAlt] = useState(seed.cover_image?.alt || '');
  const [author, setAuthor] = useState(seed.author || 'Canvas Classes');
  const [seoTitle, setSeoTitle] = useState(seed.seo?.title || '');
  const [seoDesc, setSeoDesc] = useState(seed.seo?.description || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!initial && !slug && title) setSlug(slugify(title));
  }, [title, slug, initial]);

  const effectiveSlug = slug || slugify(title) || 'draft';

  const insertAtCursor = (text: string) => {
    const el = contentRef.current;
    if (!el) {
      setContent(c => `${c}\n\n${text}\n`);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = content.slice(0, start);
    const after = content.slice(end);
    const insert = `\n\n${text}\n`;
    const next = before + insert + after;
    setContent(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + insert.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const submit = async () => {
    setError('');
    if (!title.trim()) { setError('Title is required'); return; }
    if (!content.trim()) { setError('Content is required'); return; }
    if (status === 'scheduled' && !scheduledFor) { setError('Set a scheduled time'); return; }

    setSaving(true);
    try {
      const payload: Partial<BlogPostRow> & { id?: string } = {
        id: initial?._id,
        title: title.trim(),
        slug: effectiveSlug,
        excerpt: excerpt.trim() || title.trim().slice(0, 300),
        content,
        tags: tagsStr.split(',').map(s => s.trim()).filter(Boolean),
        author: author.trim() || 'Canvas Classes',
        status,
        scheduled_for: status === 'scheduled' && scheduledFor ? new Date(scheduledFor).toISOString() : null,
        cover_image: coverUrl ? { url: coverUrl, alt: coverAlt } : undefined,
        seo: { title: seoTitle, description: seoDesc, keywords: [] },
        source: seed.source || 'manual',
        source_refs: seed.source_refs || [],
      };
      await onSave(payload);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const wordCount = useMemo(() => content.trim().split(/\s+/).filter(Boolean).length, [content]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0B0F15] border border-white/10 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold">{initial ? 'Edit post' : 'New post'}</h2>
            {initial && (
              <a
                href={`/blog/${initial.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gray-400 hover:text-orange-400 flex items-center gap-1"
              >
                View <ExternalLink size={11} />
              </a>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(p => !p)}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 flex items-center gap-1"
            >
              <Eye size={12} />
              {showPreview ? 'Editor' : 'Preview'}
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-0">
            {/* Main editor column */}
            <div className="p-5 space-y-4 min-w-0">
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Post title"
                  className="w-full text-2xl font-bold bg-transparent border-0 border-b border-white/10 focus:border-orange-500 focus:outline-none py-2 text-white placeholder-gray-600"
                />
                <div className="text-xs text-gray-500 mt-1">
                  /blog/<span className="text-orange-400">{effectiveSlug}</span>
                </div>
              </div>

              <textarea
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                placeholder="Excerpt — a 1-2 sentence hook shown on the blog grid"
                rows={2}
                className="w-full bg-[#151E32] border border-white/5 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:border-orange-500/50 focus:outline-none resize-none"
              />

              {showPreview ? (
                <div className="bg-[#151E32] border border-white/5 rounded-lg p-5 min-h-[400px] prose prose-invert max-w-none text-gray-300">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              ) : (
                <textarea
                  ref={contentRef}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write in markdown. Drop images on the zone at right — they upload to R2 and the link lands at your cursor."
                  rows={22}
                  className="w-full bg-[#151E32] border border-white/5 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-600 font-mono leading-relaxed focus:border-orange-500/50 focus:outline-none resize-y"
                />
              )}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{wordCount} words · ~{Math.max(1, Math.round(wordCount / 200))} min read</span>
                {error && <span className="text-red-400">{error}</span>}
              </div>
            </div>

            {/* Sidebar */}
            <div className="p-5 border-l border-white/5 space-y-5 bg-gray-900/30">
              {/* Image upload */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-2">
                  <ImageIcon size={12} /> Drop image (inserts at cursor)
                </label>
                <BlogImageDrop
                  slug={effectiveSlug}
                  onUploaded={(md) => insertAtCursor(md)}
                />
              </div>

              {/* Cover image */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400">Cover image</label>
                {coverUrl ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coverUrl} alt={coverAlt} className="w-full rounded-lg border border-white/5" />
                    <button
                      onClick={() => { setCoverUrl(''); setCoverAlt(''); }}
                      className="absolute top-2 right-2 p-1 rounded bg-black/70 text-white hover:bg-red-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <BlogImageDrop
                    slug={effectiveSlug}
                    compact
                    onUploaded={(_md, url) => setCoverUrl(url)}
                  />
                )}
                {coverUrl && (
                  <input
                    type="text"
                    value={coverAlt}
                    onChange={e => setCoverAlt(e.target.value)}
                    placeholder="Alt text (SEO + accessibility)"
                    className="w-full bg-[#151E32] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 placeholder-gray-600 focus:border-orange-500/50 focus:outline-none"
                  />
                )}
              </div>

              {/* Status */}
              <div>
                <label className="text-xs font-semibold text-gray-400 mb-2 block">Status</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['draft', 'review', 'scheduled', 'published', 'archived'] as BlogStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`text-xs px-2 py-1.5 rounded-lg border transition capitalize ${
                        status === s
                          ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {status === 'scheduled' && (
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-2">
                    <Calendar size={12} /> Publish at
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={e => setScheduledFor(e.target.value)}
                    className="w-full bg-[#151E32] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:border-orange-500/50 focus:outline-none"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Auto-publishes on the cron pass after this time.</p>
                </div>
              )}

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-2">
                  <Tag size={12} /> Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={e => setTagsStr(e.target.value)}
                  placeholder="JEE, Chemistry, exam tips"
                  className="w-full bg-[#151E32] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 placeholder-gray-600 focus:border-orange-500/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 mb-2 block">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder={slugify(title) || 'auto-from-title'}
                  className="w-full bg-[#151E32] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 placeholder-gray-600 focus:border-orange-500/50 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 mb-2 block">Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  className="w-full bg-[#151E32] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:border-orange-500/50 focus:outline-none"
                />
              </div>

              <details className="group">
                <summary className="text-xs font-semibold text-gray-400 cursor-pointer hover:text-gray-200">
                  SEO overrides (optional)
                </summary>
                <div className="space-y-2 mt-2">
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={e => setSeoTitle(e.target.value)}
                    placeholder="Meta title (else uses post title)"
                    className="w-full bg-[#151E32] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 placeholder-gray-600 focus:border-orange-500/50 focus:outline-none"
                  />
                  <textarea
                    value={seoDesc}
                    onChange={e => setSeoDesc(e.target.value)}
                    placeholder="Meta description (else uses excerpt)"
                    rows={3}
                    className="w-full bg-[#151E32] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 placeholder-gray-600 focus:border-orange-500/50 focus:outline-none resize-none"
                  />
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between bg-gray-900/40">
          <div>
            {onDelete && (
              <button
                onClick={onDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition"
              >
                <Trash2 size={12} />
                Archive
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm hover:opacity-90 disabled:opacity-50"
            >
              <Save size={14} />
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
