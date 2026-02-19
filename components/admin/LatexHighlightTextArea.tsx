'use client';

import React, { useRef, useEffect, useState } from 'react';

interface LatexHighlightTextAreaProps {
    value: string;
    onChange: (value: string) => void;
    onPaste?: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    className?: string;
}

export default function LatexHighlightTextArea({
    value,
    onChange,
    onPaste,
    placeholder,
    className = ""
}: LatexHighlightTextAreaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const [highlightedHtml, setHighlightedHtml] = useState('');

    const handleScroll = () => {
        if (textareaRef.current && backdropRef.current) {
            backdropRef.current.scrollTop = textareaRef.current.scrollTop;
            backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    };

    const highlightContent = (text: string) => {
        // 1. Double escape for HTML
        let escaped = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // 2. Highlight Errors

        // Triple dollar signs (most common typo)
        escaped = escaped.replace(/\${3,}/g, (match) =>
            `<span class="bg-red-500/40 border-b-2 border-red-500 text-white rounded-sm px-0.5" title="Triple dollar sign error">${match}</span>`
        );

        // Mismatched backticks/delimiters
        // Simple state machine for $ and $$
        let result = '';
        let i = 0;
        let inMath = false;
        let inDisplayMath = false;
        let lastPos = 0;

        const tokens = escaped.split(/(\$\$|\$)/);

        let processed = '';
        let currentInMath = false;
        let currentInDisplayMath = false;

        for (let j = 0; j < tokens.length; j++) {
            const token = tokens[j];
            if (token === '$$') {
                if (currentInDisplayMath) {
                    processed += `<span class="text-indigo-300 font-bold">$$</span>`;
                    currentInDisplayMath = false;
                } else if (!currentInMath) {
                    processed += `<span class="text-indigo-300 font-bold">$$</span>`;
                    currentInDisplayMath = true;
                } else {
                    processed += token; // Nested $$ inside $? Just treat as text
                }
            } else if (token === '$') {
                if (currentInMath) {
                    processed += `<span class="text-indigo-400 font-bold">$</span>`;
                    currentInMath = false;
                } else if (!currentInDisplayMath) {
                    processed += `<span class="text-indigo-400 font-bold">$</span>`;
                    currentInMath = true;
                } else {
                    processed += token;
                }
            } else {
                // Content
                if (currentInMath || currentInDisplayMath) {
                    processed += `<span class="text-indigo-200/80 italic">${token}</span>`;
                } else {
                    processed += token;
                }
            }
        }

        // Flag unclosed at the end
        if (currentInMath || currentInDisplayMath) {
            // We can't easily highlight the whole rest in red without breaking alignment
            // but we can add a trailing error indicator or just let the colors speak
        }

        // Handle newlines for the backdrop
        return processed.replace(/\n/g, '<br/>') + (text.endsWith('\n') ? '<br/>' : '');
    };

    useEffect(() => {
        setHighlightedHtml(highlightContent(value));
    }, [value]);

    return (
        <div className={`relative w-full h-full font-mono text-sm leading-tight bg-gray-900 rounded-md overflow-hidden border border-gray-700 focus-within:border-purple-500 ${className}`}>
            {/* Backdrop for highlights */}
            <div
                ref={backdropRef}
                className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words px-3 py-2 select-none overflow-hidden text-white"
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />

            {/* Actual Textarea */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onScroll={handleScroll}
                onPaste={onPaste}
                placeholder={placeholder}
                spellCheck={false}
                className="relative block w-full h-full bg-transparent border-none p-3 focus:ring-0 outline-none resize-none overflow-y-auto"
                style={{
                    color: 'transparent',
                    caretColor: 'white',
                    zIndex: 1,
                    WebkitTextFillColor: 'transparent'
                }}
            />

            <style jsx>{`
        textarea {
          font-family: inherit;
          line-height: inherit;
        }
        div[ref="backdropRef"] {
            border: 1px solid transparent;
        }
      `}</style>
        </div>
    );
}
