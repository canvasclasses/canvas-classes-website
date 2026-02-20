'use client';

import { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  markdown: string;
  className?: string;
  fontSize?: number; // px — sets font-size directly on container so innerHTML text inherits it
  imageScale?: number; // Fixed pixel width for images: scale * 2px (so 100 = 200px, 150 = 300px)
}

export default function MathRenderer({ markdown, className = '', fontSize, imageScale = 100 }: MathRendererProps) {
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

      // ── PHASE 1: Extract math into placeholders ──────────────────────────────
      // This lets block-level markdown (tables, lists) see complete lines
      // without math delimiters breaking the structure.
      const mathStore: Array<{ display: boolean; content: string }> = [];
      const PLACEHOLDER = '\x00MATH';

      // Replace $$...$$ first (display math)
      text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_m, inner) => {
        // Normalise ^* → ^{*} so KaTeX renders MO configs (σ*, π*) correctly
        const fixed = inner.replace(/\^\*/g, '^{*}');
        mathStore.push({ display: true, content: fixed });
        return `${PLACEHOLDER}${mathStore.length - 1}\x00`;
      });

      // Replace $...$ (inline math, must not span newlines)
      text = text.replace(/\$([^\$\n]+?)\$/g, (_m, inner) => {
        // Normalise ^* → ^{*} so KaTeX renders MO configs (σ*, π*) correctly
        const fixed = inner.replace(/\^\*/g, '^{*}');
        mathStore.push({ display: false, content: fixed });
        return `${PLACEHOLDER}${mathStore.length - 1}\x00`;
      });

      // ── PHASE 2: Process block-level markdown on the placeholder text ────────
      let html = processMarkdown(text, imageScale);

      // ── PHASE 3: Restore math placeholders with rendered KaTeX HTML ──────────
      html = html.replace(/\x00MATH(\d+)\x00/g, (_m, idxStr) => {
        const idx = Number(idxStr);
        const entry = mathStore[idx];
        if (!entry) return '';
        try {
          return katex.renderToString(entry.content, {
            ...katexOpts,
            displayMode: entry.display,
          });
        } catch {
          return `<span class="katex-error">${entry.content}</span>`;
        }
      });

      // ── PHASE 4: Set innerHTML ───────────────────────────────────────────────
      if (!cancelled && containerRef.current) {
        containerRef.current.innerHTML = html;
      }
    })();

    return () => { cancelled = true; };
  }, [markdown, imageScale]);

  return <div ref={containerRef} className={`latex-preview ${className}`} style={fontSize ? { fontSize } : undefined} />;
}

// Convert non-pipe-table MTC markdown into a 4-column HTML table.
// Handles two formats found in the DB:
//   Multiline:  **List I:**\nA. item\nB. item\n\n**List II:**\nI. item\n...
//   Inline:     **List I (label):** A. item B. item ... **List II (label):** I. item ...
function processNonTableMTC(text: string): string {
  // ── Multiline format ────────────────────────────────────────────────────────
  // **List I[...]:**\n(A|a). item\n... \n\n**List II[...]:**\n(I|i). item\n...
  text = text.replace(
    /(\*\*List I([^*]*)\*\*:?)[\s\n]+((?:[A-Da-d][.)][^\n]+\n?)+)[\s\n]*(\*\*List II([^*]*)\*\*:?)[\s\n]+((?:[IVXivx]+[.)][^\n]+\n?)+)/g,
    (_m: string, h1raw: string, h1label: string, listI: string, h2raw: string, h2label: string, listII: string) => {
      const h1 = `List I${h1label.trim() ? ' ' + h1label.trim() : ''}`;
      const h2 = `List II${h2label.trim() ? ' ' + h2label.trim() : ''}`;
      const rowsI = listI.trim().split('\n').map((l: string) => l.replace(/^[A-Da-d][.)\s]+/, '').trim()).filter(Boolean);
      const rowsII = listII.trim().split('\n').map((l: string) => l.replace(/^[IVXivx]+[.)\s]+/, '').trim()).filter(Boolean);
      const letters = ['A', 'B', 'C', 'D', 'E'];
      const numerals = ['I', 'II', 'III', 'IV', 'V'];
      const count = Math.max(rowsI.length, rowsII.length);
      let t = `<table class="markdown-table"><thead><tr><th colspan="2" style="text-align:left">${h1}</th><th colspan="2" style="text-align:left">${h2}</th></tr></thead><tbody>`;
      for (let i = 0; i < count; i++) {
        t += `<tr><td>${letters[i] ?? ''}</td><td>${rowsI[i] ?? ''}</td><td>${numerals[i] ?? ''}</td><td>${rowsII[i] ?? ''}</td></tr>`;
      }
      t += '</tbody></table>';
      return t;
    }
  );

  // ── Inline format ───────────────────────────────────────────────────────────
  // **List I (label):** A. item B. item ... **List II (label):** I. item II. item ...
  text = text.replace(
    /(\*\*List I([^*]*)\*\*:?)\s+((?:[A-Da-d][.)][^*]+?)+)(\*\*List II([^*]*)\*\*:?)\s+((?:[IVXivx]+[.)]\s*[^\n*]+)+)/g,
    (_m: string, _h1: string, h1label: string, listI: string, _h2: string, h2label: string, listII: string) => {
      const h1 = `List I${h1label.trim() ? ' ' + h1label.trim() : ''}`;
      const h2 = `List II${h2label.trim() ? ' ' + h2label.trim() : ''}`;
      const rowsI = listI.trim().split(/(?=[A-Da-d][.)])/).map((l: string) => l.replace(/^[A-Da-d][.)\s]+/, '').trim()).filter(Boolean);
      const rowsII = listII.trim().split(/(?=[IVXivx]+[.)])/).map((l: string) => l.replace(/^[IVXivx]+[.)\s]+/, '').trim()).filter(Boolean);
      const letters = ['A', 'B', 'C', 'D', 'E'];
      const numerals = ['I', 'II', 'III', 'IV', 'V'];
      const count = Math.max(rowsI.length, rowsII.length);
      let t = `<table class="markdown-table"><thead><tr><th colspan="2" style="text-align:left">${h1}</th><th colspan="2" style="text-align:left">${h2}</th></tr></thead><tbody>`;
      for (let i = 0; i < count; i++) {
        t += `<tr><td>${letters[i] ?? ''}</td><td>${rowsI[i] ?? ''}</td><td>${numerals[i] ?? ''}</td><td>${rowsII[i] ?? ''}</td></tr>`;
      }
      t += '</tbody></table>';
      return t;
    }
  );

  return text;
}

function processMarkdown(text: string, imageScale: number): string {
  let html = text;

  // Convert non-pipe-table MTC formats to HTML tables before other markdown processing
  html = processNonTableMTC(html);

  // Tables — now sees complete rows because math is replaced with placeholders
  html = html.replace(/\|(.+)\|[ \t]*[\r\n]+\|[-:\s|]+\|[ \t]*[\r\n]+((?:\|.+\|[ \t]*[\r\n]*)+)/g,
    (_m: string, header: string, body: string) => {
      // Split header preserving empty cells (don't filter yet)
      // The regex captures content BETWEEN the outer | delimiters, e.g.:
      //   "| | List I | | List II |"  → header = " | List I | | List II "
      // so split gives: ['', 'List I', '', 'List II'] after trim
      const rawHs = header.split('|').map((h: string) => h.trim());
      // Strip leading empty string (artifact of leading space before first inner |)
      const trimmedHs = rawHs[0] === '' ? rawHs.slice(1) : rawHs;
      // Strip trailing empty string if present
      const finalHs = trimmedHs[trimmedHs.length - 1] === '' ? trimmedHs.slice(0, -1) : trimmedHs;

      const rows = body.trim().split('\n').map((r: string) =>
        r.split('|').map((c: string) => c.trim()).filter(Boolean)
      );

      // Detect MTC pattern: header " | List I | | List II " → finalHs = ['List I', '', 'List II'] (len 3, middle empty)
      // OR header " | | List I | | List II " → finalHs = ['', 'List I', '', 'List II'] (len 4, positions 0 and 2 empty)
      const isMTCHeader3 = finalHs.length === 3 && finalHs[1] === '' && finalHs[0] !== '' && finalHs[2] !== '';
      const isMTCHeader4 = finalHs.length === 4 && finalHs[0] === '' && finalHs[2] === '' && finalHs[1] !== '' && finalHs[3] !== '';
      const isMTCHeader = isMTCHeader3 || isMTCHeader4;
      const mtcH1 = isMTCHeader3 ? finalHs[0] : finalHs[1];
      const mtcH2 = isMTCHeader3 ? finalHs[2] : finalHs[3];

      let t = '<table class="markdown-table"><thead><tr>';
      if (isMTCHeader) {
        t += `<th colspan="2" style="text-align:left">${mtcH1}</th>`;
        t += `<th colspan="2" style="text-align:left">${mtcH2}</th>`;
      } else {
        finalHs.filter(Boolean).forEach((h: string) => { t += `<th>${h}</th>`; });
      }
      t += '</tr></thead><tbody>';
      rows.forEach((r: string[]) => {
        if (r.length === 0) return;
        t += '<tr>';
        r.forEach((c: string) => { t += `<td>${c}</td>`; });
        t += '</tr>';
      });
      t += '</tbody></table>';
      return t;
    });

  // Images — fixed pixel width so size is screen-independent
  const pxWidth = Math.round(imageScale * 2);
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m: string, alt: string, url: string) => {
    const clean = url.replace(/\s+/g, '');
    return `<img src="${clean}" alt="${alt}" style="width:${pxWidth}px;height:auto;display:block;margin:8px 0;" />`;
  });

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Bullets
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>[\r\n]*)+/g, '<ul>$&</ul>');

  // Line breaks
  html = html.replace(/\n\n/g, '<br /><br />');
  html = html.replace(/\n/g, '<br />');

  // Clean up br inside ul
  html = html.replace(/<ul>[\s\S]*?<\/ul>/g, (m) => m.replace(/<br \/>/g, ''));

  return html;
}
