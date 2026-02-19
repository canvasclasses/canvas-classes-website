'use client';

import { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  markdown: string;
  className?: string;
  imageScale?: number;
}

export default function MathRenderer({ markdown, className = '', imageScale = 100 }: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    (async () => {
      const katex = (await import('katex')).default;
      if (cancelled) return;

      const katexOpts = { throwOnError: false, trust: true, strict: false };

      // Pre-process \ce{} chemistry formulas
      let text = markdown;
      text = text.replace(/\\ce\{([^}]+)\}/g, (_m: string, formula: string) => {
        let p = formula
          .replace(/([A-Z][a-z]?)(\d+)/g, '$1_{$2}')
          .replace(/->/g, '\\rightarrow')
          .replace(/<->/g, '\\leftrightarrow')
          .replace(/\[([^\]]+)\]/g, '\\overset{$1}')
          .replace(/\^(\d+)/g, '^{$1}');
        return `\\mathrm{${p}}`;
      });

      // Split text into segments: plain text vs math
      // Use character-by-character scan to find $...$ and $$...$$
      const segments: Array<{ type: 'text' | 'inline' | 'display'; content: string }> = [];
      let i = 0;
      let buf = '';
      const len = text.length;

      while (i < len) {
        // Display math $$...$$
        if (text[i] === '$' && i + 1 < len && text[i + 1] === '$') {
          if (buf) { segments.push({ type: 'text', content: buf }); buf = ''; }
          const start = i + 2;
          const end = text.indexOf('$$', start);
          if (end !== -1) {
            segments.push({ type: 'display', content: text.slice(start, end) });
            i = end + 2;
          } else {
            buf += text[i]; i++;
          }
          continue;
        }
        // Inline math $...$
        if (text[i] === '$') {
          const start = i + 1;
          let j = start;
          while (j < len && text[j] !== '$' && text[j] !== '\n') j++;
          if (j < len && text[j] === '$' && j > start) {
            if (buf) { segments.push({ type: 'text', content: buf }); buf = ''; }
            segments.push({ type: 'inline', content: text.slice(start, j) });
            i = j + 1;
            continue;
          }
        }
        buf += text[i];
        i++;
      }
      if (buf) segments.push({ type: 'text', content: buf });

      // Build DOM directly (no innerHTML for math — use KaTeX's DOM output)
      const frag = document.createDocumentFragment();

      for (const seg of segments) {
        if (seg.type === 'display') {
          const div = document.createElement('div');
          div.className = 'latex-math-display';
          katex.render(seg.content, div, { ...katexOpts, displayMode: true });
          frag.appendChild(div);
        } else if (seg.type === 'inline') {
          const span = document.createElement('span');
          span.className = 'latex-math-inline';
          katex.render(seg.content, span, { ...katexOpts, displayMode: false });
          frag.appendChild(span);
        } else {
          // Process markdown in text segments
          const html = processMarkdown(seg.content, imageScale);
          const wrapper = document.createElement('span');
          wrapper.innerHTML = html;
          frag.appendChild(wrapper);
        }
      }

      if (!cancelled && containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(frag);
      }
    })();

    return () => { cancelled = true; };
  }, [markdown, imageScale]);

  return <div ref={containerRef} className={`latex-preview ${className}`} />;
}

function processMarkdown(text: string, imageScale: number): string {
  let html = text;

  // Tables
  html = html.replace(/\|(.+)\|[\r\n]+\|[-:\s|]+\|[\r\n]+((?:\|.+\|[\r\n]*)+)/g,
    (_m: string, header: string, body: string) => {
      const hs = header.split('|').map((h: string) => h.trim()).filter(Boolean);
      const rows = body.trim().split('\n').map((r: string) =>
        r.split('|').map((c: string) => c.trim()).filter(Boolean)
      );
      let t = '<table class="markdown-table"><thead><tr>';
      hs.forEach((h: string) => { t += `<th>${h}</th>`; });
      t += '</tr></thead><tbody>';
      rows.forEach((r: string[]) => { t += '<tr>'; r.forEach((c: string) => { t += `<td>${c}</td>`; }); t += '</tr>'; });
      t += '</tbody></table>';
      return t;
    });

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m: string, alt: string, url: string) => {
    const clean = url.replace(/\s+/g, '');
    return `<img src="${clean}" alt="${alt}" style="max-width:${imageScale}%;height:auto;display:block;margin:8px 0;" />`;
  });

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Bullets
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>[\r\n]*)+/g, '<ul>$&</ul>');

  // Line breaks
  html = html.replace(/\n\n/g, '<br /><br />');
  html = html.replace(/\n/g, '<br />');

  // Clean up br around display math
  html = html.replace(/(<br \/>)+(<div class="latex-math-display)/g, '$2');
  html = html.replace(/(<\/div>)(<br \/>)+/g, '$1');

  // Clean up br inside ul
  html = html.replace(/<ul>[\s\S]*?<\/ul>/g, (m) => m.replace(/<br \/>/g, ''));

  return html;
}
