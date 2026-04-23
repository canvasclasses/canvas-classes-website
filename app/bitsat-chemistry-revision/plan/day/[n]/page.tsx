import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PlanShell } from '../../PlanShell';
import { ALL_DAYS, dayByNumber } from '../../planData';
import type { Day } from '../../../planTypes';

export async function generateStaticParams() {
    return ALL_DAYS.map((d: Day) => ({ n: String(d.day) }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ n: string }>;
}): Promise<Metadata> {
    const { n } = await params;
    const day = dayByNumber(Number(n));
    if (!day) return { title: 'BITSAT Chemistry · Day Not Found | Canvas Classes' };
    const cleanTitle = day.title.split('—')[0].trim();
    return {
        title: `Day ${day.day}: ${cleanTitle} · BITSAT Chemistry 30-Day Plan | Canvas Classes`,
        description: day.focus.slice(0, 160),
        alternates: { canonical: `/bitsat-chemistry-revision/plan/day/${day.day}` },
    };
}

export default async function DayPage({ params }: { params: Promise<{ n: string }> }) {
    const { n } = await params;
    const dayNum = Number(n);
    if (!Number.isInteger(dayNum) || dayNum < 1 || dayNum > 30) notFound();
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
            <PlanShell initialDay={dayNum} />
        </Suspense>
    );
}
