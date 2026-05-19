'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

// Two-column layout wrapper for the chapter reading area. Owns the
// "split-mode active" state via React Context so deep descendants (the
// inline PDF reader inside ChapterNotesGrid) can collapse the Crucible
// rail column when the student opens side-by-side practice.
//
// Why a Context instead of prop-drilling: ChapterNotesGrid is two layers
// down (page → leftColumn → section → ChapterNotesGrid), and the rail
// lives in a sibling column. Lifting state through prop chains would be
// noisy; a Context exposes a single setter to whoever wants to flip the
// layout.
//
// The shell still renders server components passed in as `leftColumn`
// and `rightColumn` — they're rendered server-side and arrive as already-
// computed React elements. The shell adds only one client boundary.

interface SplitModeValue {
    splitActive: boolean;
    setSplitActive: (v: boolean) => void;
}

const SplitModeCtx = createContext<SplitModeValue>({
    splitActive: false,
    setSplitActive: () => {},
});

export function useSplitMode(): SplitModeValue {
    return useContext(SplitModeCtx);
}

interface Props {
    leftColumn: ReactNode;
    rightColumn: ReactNode;
}

export default function ChapterReadingShell({ leftColumn, rightColumn }: Props) {
    const [splitActive, setSplitActive] = useState(false);

    // Grid template flips between 2-col and 1-col based on split state:
    //   - Inactive: chapter intro/notes on left, Crucible rail on right.
    //   - Active:   left column gets the full width so the PDF + practice
    //     side-by-side panel can breathe; rail unmounts (not just hidden)
    //     so it doesn't keep the right grid track reserved.
    return (
        <SplitModeCtx.Provider value={{ splitActive, setSplitActive }}>
            <div
                className={`mb-12 grid grid-cols-1 items-start gap-8 ${
                    splitActive ? '' : 'lg:grid-cols-[minmax(0,1fr)_460px]'
                }`}
            >
                <div className="min-w-0">{leftColumn}</div>
                {!splitActive && <div className="hidden lg:block">{rightColumn}</div>}
            </div>
        </SplitModeCtx.Provider>
    );
}
