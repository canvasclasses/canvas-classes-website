'use client';

import { useEffect, useState } from 'react';

interface LatexPreviewProps {
    latex: string;
    className?: string;
}

export default function LatexPreview({ latex, className = '' }: LatexPreviewProps) {
    const [rendered, setRendered] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simple LaTeX to HTML conversion for preview
        let html = latex;
        
        try {
            // Replace inline math $...$
            html = html.replace(/\$([^$]+)\$/g, (match, content) => {
                return `<span class="math-inline">${escapeHtml(content)}</span>`;
            });
            
            // Replace display math $$...$$
            html = html.replace(/\$\$([^$]+)\$\$/g, (match, content) => {
                return `<div class="math-display">${escapeHtml(content)}</div>`;
            });
            
            // Replace chemical formulas
            html = html.replace(/([A-Z][a-z]?)_(\d+)/g, '$1<sub>$2</sub>');
            html = html.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>');
            html = html.replace(/\^(-?\d+)/g, '<sup>$1</sup>');
            
            // Replace common LaTeX commands
            html = html.replace(/\\times/g, '×');
            html = html.replace(/\\div/g, '÷');
            html = html.replace(/\\pm/g, '±');
            html = html.replace(/\\rightarrow/g, '→');
            html = html.replace(/\\Rightarrow/g, '⇒');
            html = html.replace(/\\leq/g, '≤');
            html = html.replace(/\\geq/g, '≥');
            html = html.replace(/\\neq/g, '≠');
            html = html.replace(/\\approx/g, '≈');
            html = html.replace(/\\alpha/g, 'α');
            html = html.replace(/\\beta/g, 'β');
            html = html.replace(/\\gamma/g, 'γ');
            html = html.replace(/\\delta/g, 'δ');
            html = html.replace(/\\Delta/g, 'Δ');
            html = html.replace(/\\pi/g, 'π');
            html = html.replace(/\\sigma/g, 'σ');
            html = html.replace(/\\Sigma/g, 'Σ');
            html = html.replace(/\\theta/g, 'θ');
            html = html.replace(/\\lambda/g, 'λ');
            html = html.replace(/\\omega/g, 'ω');
            html = html.replace(/\\infty/g, '∞');
            html = html.replace(/\\degree/g, '°');
            html = html.replace(/\\circ/g, '°');
            html = html.replace(/\\text\{([^}]+)\}/g, '$1');
            html = html.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');
            html = html.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
            
            // Replace fractions
            html = html.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="fraction"><span class="num">$1</span><span class="den">$2</span></span>');
            
            // Check for unclosed math
            const openCount = (html.match(/\$/g) || []).length;
            if (openCount % 2 !== 0) {
                setError('Warning: Unclosed $ in LaTeX');
            } else {
                setError(null);
            }
            
            setRendered(html);
        } catch (e) {
            setError('Error parsing LaTeX');
            setRendered(html);
        }
    }, [latex]);

    return (
        <div className={`latex-preview ${className}`}>
            {error && (
                <div className="text-amber-400 text-xs mb-2 flex items-center gap-1">
                    <span>⚠️</span> {error}
                </div>
            )}
            <div 
                className="prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: rendered }}
            />
            <style jsx>{`
                .latex-preview :global(.math-inline) {
                    background: rgba(99, 102, 241, 0.1);
                    padding: 1px 4px;
                    border-radius: 3px;
                    font-family: 'Courier New', monospace;
                    color: #c7d2fe;
                }
                .latex-preview :global(.math-display) {
                    background: rgba(99, 102, 241, 0.05);
                    padding: 8px 12px;
                    border-radius: 6px;
                    margin: 8px 0;
                    font-family: 'Courier New', monospace;
                    color: #c7d2fe;
                    border-left: 3px solid #6366f1;
                }
                .latex-preview :global(.fraction) {
                    display: inline-flex;
                    flex-direction: column;
                    align-items: center;
                    vertical-align: middle;
                    margin: 0 4px;
                }
                .latex-preview :global(.fraction .num) {
                    border-bottom: 1px solid currentColor;
                    padding: 0 4px;
                }
                .latex-preview :global(.fraction .den) {
                    padding: 0 4px;
                }
                .latex-preview :global(sub), .latex-preview :global(sup) {
                    font-size: 0.75em;
                }
            `}</style>
        </div>
    );
}

function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
