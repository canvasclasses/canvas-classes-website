'use client';

import { useEffect, useMemo, useState } from 'react';
import { localDateString } from '../lib/spacedRepetition';

interface StudyDay {
    date: string;
    reviews: number;
}

const DAYS_TO_SHOW = 182; // ~6 months — fits comfortably on one row

function fillDateRange(end: Date, days: number): string[] {
    const out: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(end);
        d.setDate(d.getDate() - i);
        out.push(localDateString(d));
    }
    return out;
}

function intensity(reviews: number): string {
    if (reviews === 0) return 'bg-slate-800';
    if (reviews < 5) return 'bg-emerald-900';
    if (reviews < 15) return 'bg-emerald-700';
    if (reviews < 30) return 'bg-emerald-500';
    return 'bg-emerald-400';
}

export default function StudyHeatmap() {
    const [history, setHistory] = useState<StudyDay[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let cancelled = false;
        fetch('/api/v2/user/flashcard-progress', { credentials: 'same-origin' })
            .then(res => (res.ok ? res.json() : null))
            .then(body => {
                if (cancelled || !body) return;
                if (Array.isArray(body.history)) setHistory(body.history);
            })
            .catch(err => console.error('Heatmap fetch failed:', err))
            .finally(() => {
                if (!cancelled) setLoaded(true);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const grid = useMemo(() => {
        const range = fillDateRange(new Date(), DAYS_TO_SHOW);
        const reviewsByDate = new Map(history.map(h => [h.date, h.reviews]));
        return range.map(date => ({
            date,
            reviews: reviewsByDate.get(date) ?? 0
        }));
    }, [history]);

    const totalReviews = useMemo(
        () => grid.reduce((s, g) => s + g.reviews, 0),
        [grid]
    );
    const activeDays = useMemo(
        () => grid.filter(g => g.reviews > 0).length,
        [grid]
    );

    if (!loaded) return null;

    return (
        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Last 6 months</h3>
                <div className="text-xs text-slate-400">
                    <span className="text-emerald-400 font-medium">{totalReviews}</span> reviews ·{' '}
                    <span className="text-emerald-400 font-medium">{activeDays}</span> active days
                </div>
            </div>
            <div
                className="grid gap-1"
                style={{
                    gridTemplateColumns: `repeat(${Math.ceil(DAYS_TO_SHOW / 7)}, minmax(0, 1fr))`,
                    gridAutoFlow: 'column',
                    gridTemplateRows: 'repeat(7, minmax(0, 1fr))'
                }}
            >
                {grid.map(cell => (
                    <div
                        key={cell.date}
                        className={`aspect-square rounded-sm ${intensity(cell.reviews)}`}
                        title={`${cell.date}: ${cell.reviews} review${cell.reviews === 1 ? '' : 's'}`}
                    />
                ))}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-slate-800" />
                <div className="w-3 h-3 rounded-sm bg-emerald-900" />
                <div className="w-3 h-3 rounded-sm bg-emerald-700" />
                <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                <div className="w-3 h-3 rounded-sm bg-emerald-400" />
                <span>More</span>
            </div>
        </div>
    );
}
