'use client';

import { useState, useEffect } from 'react';
import SVGDropZone from '@/app/crucible/admin/components/SVGDropZone';
import AudioRecorder from '@/app/crucible/admin/components/AudioRecorder';
import type { Reaction, Priority, Exam, Difficulty } from '../types';
import { Save, Plus, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { TYPE_COLOR } from '../data';

// Empty template for a new reaction
const emptyReaction: Reaction = {
    id: '',
    name: '',
    type: 'Condensation',
    chapter: '',
    priority: 'medium',
    exam: 'both',
    difficulty: 'medium',
    tags: [],
    summary: '',
    reactants: '',
    reagents: '',
    conditions: '',
    product: '',
    mechanism: '',
    stereo: null,
    mistake: '',
    videoUrl: '',
    images: [],
    audioUrl: ''
};

export default function OrganicAdminDashboard() {
    const [reactions, setReactions] = useState<Reaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedId, setSelectedId] = useState<string>('new');
    const [formData, setFormData] = useState<Reaction>(emptyReaction);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchReactions();
    }, []);

    const fetchReactions = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/organic/reactions');
            const data = await res.json();
            if (data.success) {
                setReactions(data.data);
            } else {
                setStatusMessage({ type: 'error', text: data.error });
            }
        } catch (err: any) {
            setStatusMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleSelectReaction = (id: string) => {
        setSelectedId(id);
        if (id === 'new') {
            setFormData({ ...emptyReaction, id: `rxn_${Date.now()}` }); // prefill id
        } else {
            const selected = reactions.find(r => r.id === id);
            if (selected) {
                setFormData({ ...selected });
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'tags') {
            setFormData(prev => ({ ...prev, tags: value.split(',').map(t => t.trim()).filter(Boolean) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setStatusMessage(null);

            if (!formData.id || !formData.name) {
                throw new Error('ID and Name are required');
            }

            // Merge into reactions list
            let updatedList = [...reactions];
            const existingIdx = updatedList.findIndex(r => r.id === formData.id);

            if (existingIdx >= 0) {
                updatedList[existingIdx] = formData;
            } else {
                updatedList.push(formData);
            }

            const res = await fetch('/api/organic/reactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reactions: updatedList }),
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to save');
            }

            setReactions(updatedList);
            setStatusMessage({ type: 'success', text: 'Saved successfully to local JSON!' });

            if (selectedId === 'new') {
                setSelectedId(formData.id);
            }
        } catch (err: any) {
            setStatusMessage({ type: 'error', text: err.message });
        } finally {
            setSaving(false);
            setTimeout(() => setStatusMessage(null), 3000);
        }
    };

    const reactionTypes = Object.keys(TYPE_COLOR);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-500 mr-2" /> Loading reactions...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            <main className="max-w-7xl mx-auto px-4 py-8 mt-16">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar */}
                    <div className="w-full md:w-1/3 flex flex-col gap-4">
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Organic Reactions Admin
                        </h1>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Edit <code>reactions.json</code> locally. These changes are saved to the local file system. Push to GitHub when done.
                        </p>

                        <button
                            onClick={() => handleSelectReaction('new')}
                            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all ${selectedId === 'new' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300'}`}
                        >
                            <Plus size={18} /> Add New Reaction
                        </button>

                        <div className="bg-white/[0.02] border border-white/5 rounded-xl flex flex-col max-h-[60vh] overflow-hidden">
                            <div className="p-3 border-b border-white/5 font-bold text-sm text-gray-400 uppercase tracking-widest flex items-center justify-between">
                                <span>Existing Reactions</span>
                                <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full text-xs">{reactions.length}</span>
                            </div>
                            <div className="overflow-y-auto p-2 flex flex-col gap-1 custom-scrollbar">
                                {reactions.map(r => (
                                    <button
                                        key={r.id}
                                        onClick={() => handleSelectReaction(r.id)}
                                        className={`text-left px-3 py-2.5 rounded-lg text-sm transition-all truncate flex items-center gap-2 ${selectedId === r.id ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: TYPE_COLOR[r.type] ? TYPE_COLOR[r.type][2] : '#6ee7b7' }} />
                                        <span className="truncate">{r.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Editor Form */}
                    <div className="w-full md:w-2/3 bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-md">

                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                {selectedId === 'new' ? 'Create New Reaction' : `Editing: ${formData.name}`}
                            </h2>

                            <div className="flex items-center gap-4">
                                {statusMessage && (
                                    <span className={`text-sm ${statusMessage.type === 'error' ? 'text-red-400' : 'text-emerald-400'} animate-fade-in`}>
                                        {statusMessage.text}
                                    </span>
                                )}
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Save to JSON
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                            {/* ID & Name */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">ID (Unique)</label>
                                <input name="id" value={formData.id} onChange={handleChange} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reaction Name</label>
                                <input name="name" value={formData.name} onChange={handleChange} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition" />
                            </div>

                            {/* Type & Chapter */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reaction Type</label>
                                <select name="type" value={formData.type} onChange={handleChange} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition text-white">
                                    {reactionTypes.map(t => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chapter</label>
                                <input name="chapter" value={formData.chapter} onChange={handleChange} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition" placeholder="e.g. Aldehydes & Ketones" />
                            </div>

                            {/* Priority, Exam, Difficulty */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Priority</label>
                                <select name="priority" value={formData.priority} onChange={handleChange} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 outline-none transition text-white">
                                    <option value="high" className="bg-gray-900">High</option>
                                    <option value="medium" className="bg-gray-900">Medium</option>
                                    <option value="low" className="bg-gray-900">Low</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Exam</label>
                                <select name="exam" value={formData.exam} onChange={handleChange} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 outline-none transition text-white">
                                    <option value="both" className="bg-gray-900">Both Mains & Adv</option>
                                    <option value="mains" className="bg-gray-900">Mains Only</option>
                                    <option value="advanced" className="bg-gray-900">Advanced Only</option>
                                </select>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-col gap-1.5 md:col-span-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tags (comma separated)</label>
                                <input name="tags" value={formData.tags?.join(', ') || ''} onChange={handleChange} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 outline-none transition" placeholder="e.g. enolate, alpha-H, NaOH" />
                            </div>
                        </div>

                        {/* Media Uploads */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 border-y border-white/10 py-6">
                            <div className="flex flex-col gap-3">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                    Mechanism Images (R2)
                                </label>
                                <SVGDropZone
                                    questionId="organic_admin"
                                    fieldType="solution"
                                    onUploaded={(markdown, url) => setFormData(prev => ({ ...prev, images: [...prev.images, url] }))}
                                />
                                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="text-[10px] text-green-400 bg-green-500/10 p-2 rounded border border-green-500/20 flex items-center justify-between gap-2">
                                            <span className="truncate">Img {idx + 1}: {img}</span>
                                            <button
                                                onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                                className="text-red-400 underline uppercase font-bold shrink-0 hover:text-red-300"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                                    Audio Explanation (R2)
                                </label>
                                <AudioRecorder
                                    questionId="organic_admin"
                                    onAudioSaved={(url) => setFormData(prev => ({ ...prev, audioUrl: url }))}
                                    existingAudioUrl={formData.audioUrl}
                                />
                                {formData.audioUrl && (
                                    <div className="text-xs text-green-400 bg-green-500/10 p-2 rounded border border-green-500/20 flex items-center justify-between gap-2">
                                        <span className="truncate">Linked: {formData.audioUrl}</span>
                                        <button onClick={() => setFormData(prev => ({ ...prev, audioUrl: '' }))} className="text-red-400 underline uppercase font-bold shrink-0 hover:text-red-300">Remove</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Large Text Areas */}
                        <div className="space-y-6">
                            {[
                                { name: 'summary', label: 'Summary / Quick Overview', rows: 3 },
                                { name: 'reactants', label: 'Reactants', rows: 2 },
                                { name: 'reagents', label: 'Reagents', rows: 2 },
                                { name: 'conditions', label: 'Conditions', rows: 2 },
                                { name: 'product', label: 'Product', rows: 2 },
                                { name: 'mechanism', label: 'Mechanism (Text)', rows: 3 },
                                { name: 'stereo', label: 'Stereochemistry (optional)', rows: 2 },
                                { name: 'mistake', label: 'Common Mistake', rows: 2 },
                                { name: 'videoUrl', label: 'YouTube Video URL (optional)', rows: 1 },
                            ].map(field => (
                                <div key={field.name} className="flex flex-col gap-1.5 focus-within:text-emerald-400 transition-colors">
                                    <label className="text-xs font-bold uppercase tracking-wider text-inherit">{field.label}</label>
                                    {(field.rows === 1) ? (
                                        <input name={field.name} value={(formData as any)[field.name] || ''} onChange={handleChange} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition text-white" />
                                    ) : (
                                        <textarea name={field.name} value={(formData as any)[field.name] || ''} onChange={handleChange} rows={field.rows} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition text-white custom-scrollbar resize-y" />
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5); /* emerald-500 */
        }
      `}} />
        </div>
    );
}
