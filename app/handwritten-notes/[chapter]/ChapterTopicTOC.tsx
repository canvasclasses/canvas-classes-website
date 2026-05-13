import { TAXONOMY_FROM_CSV } from '../../crucible/admin/taxonomy/taxonomyData_from_csv';
import type { TopicQuestionCounts } from './chapterStats.server';

// "What's inside · N topics" — server-rendered list of every primary tag
// (topic) under this chapter, with PYQ count badges on the right. Sourced
// from the canonical taxonomy file + Mongo aggregation in
// chapterStats.server.ts. Communicates depth: how much each topic is
// represented in PYQs.

interface Props {
    crucibleChapterId: string;        // e.g. 'ch11_mole'
    topicCounts: TopicQuestionCounts;
}

export default function ChapterTopicTOC({ crucibleChapterId, topicCounts }: Props) {
    const topics = TAXONOMY_FROM_CSV
        .filter((n) => n.parent_id === crucibleChapterId && n.type === 'topic')
        .sort((a, b) => (a.id < b.id ? -1 : 1));

    if (topics.length === 0) return null;

    return (
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.015] md:grid-cols-2">
            {topics.map((t, i) => {
                const counts = topicCounts[t.id] || { total: 0, pyq: 0 };
                const isLastRow = i >= topics.length - (topics.length % 2 === 0 ? 2 : 1);
                const isRightCol = i % 2 === 1;
                return (
                    <div
                        key={t.id}
                        className={`flex items-center gap-3.5 px-4 py-3.5 ${
                            isLastRow ? '' : 'border-b border-white/[0.07]'
                        } ${isRightCol ? '' : 'md:border-r md:border-white/[0.07]'}`}
                    >
                        <div className="w-7 shrink-0 font-mono text-[11px] text-zinc-500">
                            {String(i + 1).padStart(2, '0')}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-[14px] font-medium text-zinc-200">{t.name}</div>
                            {counts.total > 0 && (
                                <div className="mt-0.5 font-mono text-[11px] tracking-wide text-zinc-500">
                                    {counts.total} questions
                                </div>
                            )}
                        </div>
                        {counts.pyq > 0 && (
                            <div className="shrink-0 rounded bg-orange-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-orange-400">
                                {counts.pyq} PYQ
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
