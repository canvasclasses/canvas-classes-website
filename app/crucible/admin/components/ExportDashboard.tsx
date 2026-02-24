'use client';

import { useState, useCallback, useMemo } from 'react';
import { X, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

interface Question {
  _id: string;
  display_id: string;
  question_text: { markdown: string };
  type: 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC';
  options: Array<{ id: string; text: string; is_correct: boolean }>;
  answer?: { integer_value?: number; decimal_value?: number };
  solution: { text_markdown: string };
  metadata: { difficulty: 'Easy' | 'Medium' | 'Hard'; chapter_id: string };
  svg_scales?: Record<string, number>; // keys: 'question', 'solution', 'option_a'…
}
interface ExportDashboardProps {
  questions: Question[];
  initialSelected?: Set<string>;
  onClose: () => void;
}

const DIFF_COLOR: Record<string, string> = { Easy: '#34d399', Medium: '#fbbf24', Hard: '#f87171' };
const TYPE_COLOR: Record<string, string> = {
  SCQ: '#818cf8', MCQ: '#60a5fa', NVT: '#c084fc', AR: '#fb923c', MST: '#22d3ee', MTC: '#f472b6',
};
const OPT_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];
const PAGE_SIZE = 20;

// ── LaTeX → HTML (with real <sup>/<sub> tags for proper rendering) ────────────
function latexToHtml(s: string): string {
  return s
    .replace(/\{\}\s*/g, '')
    // text commands first
    .replace(/\\text\{([^{}]+)\}/g, '$1').replace(/\\mathrm\{([^{}]+)\}/g, '$1')
    .replace(/\\mathbf\{([^{}]+)\}/g, '<b>$1</b>').replace(/\\mathbb\{([^{}]+)\}/g, '$1')
    .replace(/\\mathit\{([^{}]+)\}/g, '<i>$1</i>').replace(/\\boldsymbol\{([^{}]+)\}/g, '<b>$1</b>')
    .replace(/\\operatorname\{([^{}]+)\}/g, '$1').replace(/\\ce\{([^{}]+)\}/g, '$1')
    // fractions — render as (num/den) since canvas 2D cannot do stacked fractions
    .replace(/\\d?frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1/$2)')
    // roots
    .replace(/\\sqrt\[(\d+)\]\{([^{}]+)\}/g, '<sup>$1</sup>&radic;($2)')
    .replace(/\\sqrt\{([^{}]+)\}/g, '&radic;($1)')
    // superscript/subscript with braces → real HTML tags
    .replace(/\^\{([^{}]+)\}/g, '<sup>$1</sup>')
    .replace(/_\{([^{}]+)\}/g, '<sub>$1</sub>')
    // bare single-char super/subscript
    .replace(/\^(-?[0-9a-zA-Z+\-])/g, '<sup>$1</sup>')
    .replace(/_([0-9a-zA-Z])/g, '<sub>$1</sub>')
    // operators → proper symbols
    .replace(/\\times/g, '\u00D7').replace(/\\cdot/g, '\u00B7').replace(/\\div/g, '\u00F7').replace(/\\pm/g, '\u00B1')
    .replace(/\\leq/g, '\u2264').replace(/\\geq/g, '\u2265').replace(/\\neq/g, '\u2260').replace(/\\approx/g, '\u2248')
    .replace(/\\equiv/g, '\u2261').replace(/\\propto/g, '\u221D')
    // arrows
    .replace(/\\rightarrow/g, '\u2192').replace(/\\leftarrow/g, '\u2190').replace(/\\to/g, '\u2192')
    .replace(/\\Rightarrow/g, '\u21D2').replace(/\\Leftarrow/g, '\u21D0').replace(/\\leftrightarrow/g, '\u2194')
    // Greek
    .replace(/\\alpha/g, '\u03B1').replace(/\\beta/g, '\u03B2').replace(/\\gamma/g, '\u03B3')
    .replace(/\\delta/g, '\u03B4').replace(/\\epsilon/g, '\u03B5').replace(/\\varepsilon/g, '\u03B5')
    .replace(/\\zeta/g, '\u03B6').replace(/\\eta/g, '\u03B7').replace(/\\theta/g, '\u03B8')
    .replace(/\\kappa/g, '\u03BA').replace(/\\lambda/g, '\u03BB').replace(/\\mu/g, '\u03BC')
    .replace(/\\nu/g, '\u03BD').replace(/\\xi/g, '\u03BE').replace(/\\pi/g, '\u03C0')
    .replace(/\\rho/g, '\u03C1').replace(/\\sigma/g, '\u03C3').replace(/\\tau/g, '\u03C4')
    .replace(/\\phi/g, '\u03C6').replace(/\\varphi/g, '\u03C6').replace(/\\chi/g, '\u03C7')
    .replace(/\\psi/g, '\u03C8').replace(/\\omega/g, '\u03C9')
    .replace(/\\Delta/g, '\u0394').replace(/\\Sigma/g, '\u03A3').replace(/\\Omega/g, '\u03A9')
    .replace(/\\Gamma/g, '\u0393').replace(/\\Lambda/g, '\u039B').replace(/\\Pi/g, '\u03A0')
    .replace(/\\Theta/g, '\u0398').replace(/\\Phi/g, '\u03A6').replace(/\\Psi/g, '\u03A8')
    // misc
    .replace(/\\infty/g, '\u221E').replace(/\\partial/g, '\u2202').replace(/\\nabla/g, '\u2207')
    .replace(/\\hbar/g, '\u0127').replace(/\\int/g, '\u222B').replace(/\\sum/g, '\u2211').replace(/\\prod/g, '\u220F')
    .replace(/\\sin/g, 'sin').replace(/\\cos/g, 'cos').replace(/\\tan/g, 'tan')
    .replace(/\\log/g, 'log').replace(/\\ln/g, 'ln').replace(/\\lim/g, 'lim')
    .replace(/\\max/g, 'max').replace(/\\min/g, 'min').replace(/\\exp/g, 'exp')
    // brackets
    .replace(/\\left\s*[\(\[\{|]/g, '(').replace(/\\right\s*[\)\]\}|]/g, ')')
    .replace(/\\langle/g, '\u27E8').replace(/\\rangle/g, '\u27E9')
    .replace(/\\lvert/g, '|').replace(/\\rvert/g, '|')
    // spacing/structure
    .replace(/\\[,;!: ]/g, ' ').replace(/\\quad/g, '&ensp;&ensp;').replace(/\\qquad/g, '&ensp;&ensp;&ensp;')
    .replace(/\\\\/g, '<br/>').replace(/\\begin\{[^}]+\}/g, '').replace(/\\end\{[^}]+\}/g, '')
    .replace(/\\item/g, '').replace(/\\noindent/g, '')
    .replace(/[{}]/g, '').replace(/\s{2,}/g, ' ').trim();
}

// Markdown → HTML for export rendering (with real sup/sub, images preserved)
function mdToHtml(s: string): string {
  if (!s) return '';
  return s
    .replace(/\\\[([\s\S]+?)\\\]/g, (_m, inner: string) => ' ' + latexToHtml(inner) + ' ')
    .replace(/\\\(([^)]+?)\\\)/g, (_m, inner: string) => latexToHtml(inner))
    .replace(/\$\$([\s\S]+?)\$\$/g, (_m, inner: string) => ' ' + latexToHtml(inner) + ' ')
    .replace(/\$([^$\n]+?)\$/g, (_m, inner: string) => latexToHtml(inner))
    .replace(/\*\*([^*]+?)\*\*/g, '<b>$1</b>').replace(/\*([^*]+?)\*/g, '<i>$1</i>')
    // preserve image references (will be handled separately)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img data-src="$2" alt="$1" />')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*]\s+/gm, '&bull; ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/[{}]/g, '')
    .trim();
}

// ── Styled text token ────────────────────────────────────────────────────────
interface TextToken {
  text: string;
  bold: boolean;
  italic: boolean;
  sup: boolean;
  sub: boolean;
}

// Parse HTML into a flat list of styled tokens + line-break markers.
// Handles <b>, <i>, <sup>, <sub>, <br/>, &bull;, &ensp;, &frasl;, HTML entities.
function parseHtmlToTokens(html: string): TextToken[] {
  const tokens: TextToken[] = [];
  // Normalise entities first
  const decoded = html
    .replace(/&bull;/g, '•').replace(/&ensp;/g, ' ').replace(/&emsp;/g, '  ')
    .replace(/&frasl;/g, '/').replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/&times;/g, '×').replace(/&middot;/g, '·').replace(/&divide;/g, '÷')
    .replace(/&plusmn;/g, '±').replace(/&le;/g, '≤').replace(/&ge;/g, '≥')
    .replace(/&#x27E8;/g, '⟨').replace(/&#x27E9;/g, '⟩')
    .replace(/&#[0-9]+;/g, m => String.fromCharCode(parseInt(m.slice(2, -1))))
    .replace(/&#x[0-9a-fA-F]+;/g, m => String.fromCharCode(parseInt(m.slice(3, -1), 16)));

  // Tokenise via a simple tag-aware scanner
  const tagRe = /<(\/?)([a-zA-Z]+)[^>]*>|([^<]+)/g;
  let bold = false, italic = false, sup = false, sub = false;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(decoded)) !== null) {
    if (m[3] !== undefined) {
      // Text node
      tokens.push({ text: m[3], bold, italic, sup, sub });
    } else {
      const closing = m[1] === '/';
      const tag = m[2].toLowerCase();
      if (tag === 'b' || tag === 'strong') bold = !closing;
      else if (tag === 'i' || tag === 'em') italic = !closing;
      else if (tag === 'sup') sup = !closing;
      else if (tag === 'sub') sub = !closing;
      else if (tag === 'br') tokens.push({ text: '\n', bold: false, italic: false, sup: false, sub: false });
    }
  }
  return tokens;
}

// ── Canvas 2D text renderer ───────────────────────────────────────────────────
// Renders HTML (with <b>,<i>,<sup>,<sub>,<br/>) onto a canvas using the 2D text API.
// No SVG foreignObject — works in all browsers without canvas taint.
function renderHtmlToImage(
  html: string,
  widthPx: number,
  opts: { fontSize?: number; color?: string; bgColor?: string; fontFamily?: string; bold?: boolean } = {},
): Promise<{ dataUrl: string; widthMm: number; heightMm: number }> {
  const DPR = 2;
  const PX_PER_MM = 3.7795;
  const baseFontSize = opts.fontSize ?? 14;
  const color = opts.color ?? '#111111';
  const bg = opts.bgColor ?? '#ffffff';
  const ff = opts.fontFamily ?? 'Helvetica, Arial, sans-serif';
  const globalBold = opts.bold ?? false;
  const LINE_HEIGHT = baseFontSize * 1.6;
  const SUP_SUB_SIZE = baseFontSize * 0.68;

  const tokens = parseHtmlToTokens(html);

  // ── First pass: measure and build lines ──────────────────────────────────
  // Use an offscreen canvas for measurement
  const measure = document.createElement('canvas');
  const mctx = measure.getContext('2d')!;

  const fontStr = (bold: boolean, italic: boolean, size: number) =>
    `${italic ? 'italic ' : ''}${bold || globalBold ? 'bold ' : ''}${size}px ${ff}`;

  // Word-wrap tokens into lines. Each line is an array of positioned spans.
  interface Span { text: string; bold: boolean; italic: boolean; sup: boolean; sub: boolean; x: number; }
  const lines: Span[][] = [];
  let curLine: Span[] = [];
  let curX = 0;

  const commitLine = () => { lines.push(curLine); curLine = []; curX = 0; };

  for (const tok of tokens) {
    if (tok.text === '\n') { commitLine(); continue; }
    const sz = (tok.sup || tok.sub) ? SUP_SUB_SIZE : baseFontSize;
    mctx.font = fontStr(tok.bold, tok.italic, sz);

    // Split on spaces to word-wrap
    const words = tok.text.split(/(\s+)/);
    for (const word of words) {
      if (!word) continue;
      const w = mctx.measureText(word).width;
      if (curX + w > widthPx && curX > 0 && word.trim() !== '') {
        commitLine();
      }
      curLine.push({ text: word, bold: tok.bold, italic: tok.italic, sup: tok.sup, sub: tok.sub, x: curX });
      curX += w;
    }
  }
  if (curLine.length > 0) commitLine();

  const totalLines = lines.length;
  const canvasH = Math.max(Math.ceil(totalLines * LINE_HEIGHT + baseFontSize), 20);

  // ── Second pass: draw ─────────────────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.width = widthPx * DPR;
  canvas.height = canvasH * DPR;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(DPR, DPR);

  // Background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, widthPx, canvasH);

  for (let li = 0; li < lines.length; li++) {
    const baseY = (li + 1) * LINE_HEIGHT - baseFontSize * 0.2;
    for (const span of lines[li]) {
      const sz = (span.sup || span.sub) ? SUP_SUB_SIZE : baseFontSize;
      ctx.font = fontStr(span.bold, span.italic, sz);
      ctx.fillStyle = color;
      const yOffset = span.sup ? -baseFontSize * 0.4 : span.sub ? baseFontSize * 0.2 : 0;
      ctx.fillText(span.text, span.x, baseY + yOffset);
    }
  }

  return Promise.resolve({
    dataUrl: canvas.toDataURL('image/png'),
    widthMm: widthPx / PX_PER_MM,
    heightMm: canvasH / PX_PER_MM,
  });
}

// ── SVG diagram handler: fetch, recolor for background, rasterize ────────────
async function renderSvgDiagram(
  svgUrl: string,
  maxWidthPx: number,
  bgMode: 'light' | 'dark',
): Promise<{ dataUrl: string; widthMm: number; heightMm: number } | null> {
  const PX_PER_MM = 3.7795;
  const DPR = 3;
  try {
    // Route through server-side proxy to avoid CORS on R2/CDN URLs
    const proxyUrl = `/api/proxy-svg?url=${encodeURIComponent(svgUrl)}`;
    const resp = await fetch(proxyUrl);
    if (!resp.ok) return null;
    let svgText = await resp.text();

    if (bgMode === 'light') {
      // SVGs are white-stroked (designed for dark bg) — invert to black for white PDF background
      svgText = svgText
        // attribute form: white/light → black
        .replace(/fill\s*=\s*"(#ffffff|#fff|white)"/gi, 'fill="#111111"')
        .replace(/stroke\s*=\s*"(#ffffff|#fff|white)"/gi, 'stroke="#111111"')
        // attribute form: black → keep black (already correct for light bg)
        // style form: white/light → black
        .replace(/fill\s*:\s*(#ffffff|#fff|white)/gi, 'fill:#111111')
        .replace(/stroke\s*:\s*(#ffffff|#fff|white)/gi, 'stroke:#111111')
        // Remove any explicit white/light background fills on the root SVG rect
        .replace(/(<rect[^>]*fill\s*=\s*"(#ffffff|#fff|white)"[^>]*>)/gi, (m) =>
          m.replace(/fill\s*=\s*"(#ffffff|#fff|white)"/gi, 'fill="none"')
        );
    } else if (bgMode === 'dark') {
      // Invert common colors for dark background
      svgText = svgText
        .replace(/fill\s*=\s*"(#000000|#000|black)"/gi, 'fill="##PLACEHOLDER_WHITE##"')
        .replace(/stroke\s*=\s*"(#000000|#000|black)"/gi, 'stroke="##PLACEHOLDER_WHITE##"')
        .replace(/fill\s*=\s*"(#ffffff|#fff|white)"/gi, 'fill="#0d0d0d"')
        .replace(/stroke\s*=\s*"(#ffffff|#fff|white)"/gi, 'stroke="#0d0d0d"')
        .replace(/##PLACEHOLDER_WHITE##/g, '#f0f0f0')
        .replace(/fill\s*:\s*(#000000|#000|black)/gi, 'fill:#f0f0f0')
        .replace(/stroke\s*:\s*(#000000|#000|black)/gi, 'stroke:#f0f0f0')
        .replace(/fill\s*:\s*(#ffffff|#fff|white)/gi, 'fill:#0d0d0d')
        .replace(/stroke\s*:\s*(#ffffff|#fff|white)/gi, 'stroke:#0d0d0d');
    }

    // Parse SVG to get dimensions
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');
    if (!svgEl) return null;

    let svgW = parseFloat(svgEl.getAttribute('width') || '300');
    let svgH = parseFloat(svgEl.getAttribute('height') || '200');
    const vb = svgEl.getAttribute('viewBox');
    if (vb) {
      const parts = vb.split(/[\s,]+/).map(Number);
      if (parts.length === 4) { svgW = parts[2]; svgH = parts[3]; }
    }

    // Scale to fit maxWidth
    const scale = Math.min(1, maxWidthPx / svgW);
    const finalW = Math.round(svgW * scale);
    const finalH = Math.round(svgH * scale);

    // Ensure SVG has explicit dimensions for rasterization
    svgEl.setAttribute('width', String(finalW));
    svgEl.setAttribute('height', String(finalH));
    const finalSvg = new XMLSerializer().serializeToString(svgEl);

    const svgB64 = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(finalSvg)))}`;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = finalW * DPR;
        canvas.height = finalH * DPR;
        const ctx = canvas.getContext('2d')!;
        ctx.scale(DPR, DPR);
        ctx.drawImage(img, 0, 0, finalW, finalH);
        resolve({
          dataUrl: canvas.toDataURL('image/png'),
          widthMm: finalW / PX_PER_MM,
          heightMm: finalH / PX_PER_MM,
        });
      };
      img.onerror = () => resolve(null);
      img.src = svgB64;
    });
  } catch { return null; }
}

// Hard cap on diagram height in mm — prevents tall graphs from dominating a page
const MAX_DIAGRAM_HEIGHT_MM = 70;

// Extract image URLs from markdown
function extractImageUrls(md: string): string[] {
  const urls: string[] = [];
  const re = /!\[[^\]]*\]\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(md)) !== null) urls.push(m[1]);
  return urls;
}

// For UI display (can use Unicode since browser handles it)
function latexToUnicode(s: string): string {
  const sup = (c: string) => {
    const m: Record<string,string> = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','+':'⁺','-':'⁻','n':'ⁿ','i':'ⁱ','a':'ᵃ','b':'ᵇ','x':'ˣ'};
    return m[c] ?? c;
  };
  const sub = (c: string) => {
    const m: Record<string,string> = {'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉','+':'₊','-':'₋','n':'ₙ','i':'ᵢ','a':'ₐ'};
    return m[c] ?? c;
  };
  return s
    .replace(/\^\{([^{}]+)\}/g, (_m, e: string) => e.split('').map(sup).join(''))
    .replace(/\^(-?[0-9+\-])/g, (_m, e: string) => sup(e))
    .replace(/_\{([^{}]+)\}/g, (_m, e: string) => e.split('').map(sub).join(''))
    .replace(/_([0-9])/g, (_m, e: string) => sub(e))
    .replace(/\\dfrac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)')
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\times/g, '×').replace(/\\cdot/g, '·').replace(/\\div/g, '÷').replace(/\\pm/g, '±')
    .replace(/\\leq/g, '≤').replace(/\\geq/g, '≥').replace(/\\neq/g, '≠').replace(/\\approx/g, '≈')
    .replace(/\\rightarrow/g, '→').replace(/\\leftarrow/g, '←').replace(/\\to/g, '→')
    .replace(/\\Rightarrow/g, '⇒').replace(/\\leftrightarrow/g, '↔')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ')
    .replace(/\\delta/g, 'δ').replace(/\\epsilon/g, 'ε').replace(/\\varepsilon/g, 'ε')
    .replace(/\\theta/g, 'θ').replace(/\\lambda/g, 'λ').replace(/\\mu/g, 'μ')
    .replace(/\\nu/g, 'ν').replace(/\\pi/g, 'π').replace(/\\sigma/g, 'σ')
    .replace(/\\phi/g, 'φ').replace(/\\omega/g, 'ω')
    .replace(/\\Delta/g, 'Δ').replace(/\\Sigma/g, 'Σ').replace(/\\Omega/g, 'Ω')
    .replace(/\\Gamma/g, 'Γ').replace(/\\Lambda/g, 'Λ').replace(/\\Pi/g, 'Π')
    .replace(/\\infty/g, '∞').replace(/\\partial/g, '∂')
    .replace(/\\sin/g, 'sin').replace(/\\cos/g, 'cos').replace(/\\tan/g, 'tan')
    .replace(/\\log/g, 'log').replace(/\\ln/g, 'ln').replace(/\\lim/g, 'lim')
    .replace(/\\text\{([^{}]+)\}/g, '$1').replace(/\\mathrm\{([^{}]+)\}/g, '$1')
    .replace(/\\mathbf\{([^{}]+)\}/g, '$1').replace(/\\mathbb\{([^{}]+)\}/g, '$1')
    .replace(/\\operatorname\{([^{}]+)\}/g, '$1').replace(/\\ce\{([^{}]+)\}/g, '$1')
    .replace(/\\left\s*[\(\[\{|]/g, '(').replace(/\\right\s*[\)\]\}|]/g, ')')
    .replace(/\\[,;!: ]/g, ' ').replace(/\\quad/g, '  ').replace(/\\\\/g, ' ')
    .replace(/\\begin\{[^}]+\}/g, '').replace(/\\end\{[^}]+\}/g, '')
    .replace(/[{}]/g, '').replace(/\s{2,}/g, ' ').trim();
}

function mdToDisplay(s: string): string {
  if (!s) return '';
  return s
    .replace(/\\\[([\s\S]+?)\\\]/g, (_m, inner: string) => ' ' + latexToUnicode(inner) + ' ')
    .replace(/\\\(([^)]+?)\\\)/g, (_m, inner: string) => latexToUnicode(inner))
    .replace(/\$\$([\s\S]+?)\$\$/g, (_m, inner: string) => ' ' + latexToUnicode(inner) + ' ')
    .replace(/\$([^$\n]+?)\$/g, (_m, inner: string) => latexToUnicode(inner))
    .replace(/\*\*([\s\S]+?)\*\*/g, '$1').replace(/\*([\s\S]+?)\*/g, '$1')
    .replace(/!\[.*?\]\(.*?\)/g, '[figure]')
    .replace(/^[-*]\s+/gm, '  ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\\[a-zA-Z]+/g, '').replace(/[{}]/g, '')
    .trim();
}

// ── PDF Export (image-based rendering for perfect math) ──────────────────────
async function runPDFExport(
  questions: Question[],
  opts: { title: string; showAnswerKey: boolean; includeSolution: boolean; orientation: 'portrait' | 'landscape' },
  onProgress: (pct: number, label: string) => void,
) {
  const { default: jsPDF } = await import('jspdf');
  const { title, showAnswerKey, includeSolution, orientation } = opts;
  const isL = orientation === 'landscape';
  const PW = isL ? 297 : 210;
  const PH = isL ? 210 : 297;
  const ML = 15, MR = 15, MT = 18, MB = 18;
  const CW = PW - ML - MR;
  const PX_PER_MM = 3.7795;
  const contentWidthPx = Math.round(CW * PX_PER_MM);

  const pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4', compress: true });

  const setF = (style: 'normal' | 'bold' | 'italic', sz: number) => { pdf.setFont('helvetica', style); pdf.setFontSize(sz); };
  const setC = (hex: string) => { const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16); pdf.setTextColor(r,g,b); };
  const setFill = (r: number, g: number, b: number) => pdf.setFillColor(r, g, b);
  const setDraw = (hex: string) => { const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16); pdf.setDrawColor(r,g,b); };

  let pageNum = 0;
  const newPage = (): number => {
    if (pageNum > 0) pdf.addPage();
    pageNum++;
    setFill(255, 255, 255); pdf.rect(0, 0, PW, PH, 'F');
    setFill(79, 70, 229); pdf.rect(0, 0, PW, 1.5, 'F');
    if (pageNum > 1) {
      setF('normal', 7); setC('#888888');
      pdf.text(title.substring(0, 60), ML, MT - 4);
      pdf.text('Canvas Classes', PW - MR, MT - 4, { align: 'right' });
      setDraw('#e0e0e0'); pdf.setLineWidth(0.2);
      pdf.line(ML, MT - 2, PW - MR, MT - 2);
    }
    return MT;
  };

  const ensureSpace = (y: number, need: number): number =>
    y + need > PH - MB ? newPage() : y;

  // Render HTML text block as image and place it in the PDF
  const placeHtmlBlock = async (
    html: string, x: number, y: number, widthPx: number,
    fontSize: number, color: string, bold?: boolean,
  ): Promise<number> => {
    const img = await renderHtmlToImage(html, widthPx, { fontSize, color, bold });
    const imgH = img.heightMm;
    // Check if we need a new page
    if (y + imgH > PH - MB) {
      y = newPage();
    }
    pdf.addImage(img.dataUrl, 'PNG', x, y, img.widthMm, imgH);
    return y + imgH;
  };

  // Place SVG diagrams found in markdown
  // scalePercent: from svg_scales (0-200). Clamped to 100 so SVG never exceeds content width.
  // Default 45 = ~45% of content width (~80mm on A4) — professional half-page size.
  const placeDiagrams = async (md: string, x: number, y: number, maxWidthPx: number, scalePercent = 45): Promise<number> => {
    const urls = extractImageUrls(md);
    const clampedScale = Math.min(scalePercent, 100);
    const scaledMaxPx = Math.round(maxWidthPx * (clampedScale / 100));
    for (const url of urls) {
      const diagram = await renderSvgDiagram(url, scaledMaxPx, 'light');
      if (diagram) {
        // Cap height: if diagram is taller than MAX, scale both dimensions down proportionally
        let { widthMm, heightMm, dataUrl } = diagram;
        if (heightMm > MAX_DIAGRAM_HEIGHT_MM) {
          const ratio = MAX_DIAGRAM_HEIGHT_MM / heightMm;
          widthMm = widthMm * ratio;
          heightMm = MAX_DIAGRAM_HEIGHT_MM;
        }
        y = ensureSpace(y, heightMm + 2);
        pdf.addImage(dataUrl, 'PNG', x, y, widthMm, heightMm);
        y += heightMm + 2;
      }
    }
    return y;
  };

  let y = newPage();

  // ── Cover / Title block ──
  setFill(79, 70, 229); pdf.rect(0, 0, PW, 28, 'F');
  setF('bold', 20); setC('#ffffff');
  pdf.text(title.substring(0, 60), PW / 2, 14, { align: 'center' });
  setF('normal', 9); setC('#c7d2fe');
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  pdf.text(`${questions.length} Questions  |  Canvas Classes  |  ${dateStr}`, PW / 2, 22, { align: 'center' });
  y = 36;

  for (let qi = 0; qi < questions.length; qi++) {
    const q = questions[qi];
    onProgress(Math.round((qi / questions.length) * 90), `Rendering Q${qi + 1} / ${questions.length}`);

    // ── Pre-render question text to measure height before placing header ──
    // This prevents orphan headers: we know how much space is needed before drawing anything.
    const qHtml = mdToHtml(q.question_text.markdown);
    const qImg = await renderHtmlToImage(qHtml, contentWidthPx - 8, { fontSize: 14, color: '#111111' });
    const headerH = 5; // header line + separator
    const neededH = headerH + Math.min(qImg.heightMm, 40); // reserve header + first ~40mm of text
    y = ensureSpace(y, neededH);

    // ── Question header — compact single line, no background bar ──
    const diffHex = q.metadata.difficulty === 'Easy' ? '#16a34a' : q.metadata.difficulty === 'Medium' ? '#d97706' : '#dc2626';
    setF('bold', 11); setC('#3730a3');
    pdf.text(`Q${qi + 1}.`, ML, y);
    setF('bold', 7); setC('#4f46e5');
    pdf.text(q.type, ML + 11, y);
    setF('normal', 7); setC(diffHex);
    pdf.text(q.metadata.difficulty, ML + 11 + pdf.getTextWidth(q.type) + 3, y);
    setF('normal', 6.5); setC('#aaaaaa');
    pdf.text((q.display_id || q._id.substring(0, 8)).substring(0, 20), PW - MR, y, { align: 'right' });
    setDraw('#d1d5db'); pdf.setLineWidth(0.15);
    pdf.line(ML, y + 1.5, PW - MR, y + 1.5);
    y += 4;

    // ── Question text (already rendered above) ──
    if (y + qImg.heightMm > PH - MB) y = newPage();
    pdf.addImage(qImg.dataUrl, 'PNG', ML + 2, y, qImg.widthMm, qImg.heightMm);
    y += qImg.heightMm;

    // Diagrams in question — use per-question svg_scales.question (default 50%)
    y = await placeDiagrams(q.question_text.markdown, ML + 4, y, contentWidthPx - 16, q.svg_scales?.question ?? 50);
    y += 2;

    // ── Options (each rendered as image) ──
    if (q.type !== 'NVT' && q.options.length > 0) {
      for (let oi = 0; oi < q.options.length; oi++) {
        const opt = q.options[oi];
        const label = OPT_LABELS[oi] ?? String.fromCharCode(65 + oi);
        const correct = opt.is_correct && showAnswerKey;
        const optHtml = `<b>(${label})</b>&ensp;${mdToHtml(opt.text)}`;

        const optImg = await renderHtmlToImage(optHtml, contentWidthPx - 20, {
          fontSize: 13,
          color: correct ? '#166534' : '#222222',
          bold: correct,
        });

        y = ensureSpace(y, optImg.heightMm + 2);

        if (correct) {
          setFill(220, 252, 231);
          pdf.rect(ML + 4, y - 0.5, CW - 8, optImg.heightMm + 1, 'F');
          setDraw('#86efac'); pdf.setLineWidth(0.3);
          pdf.rect(ML + 4, y - 0.5, CW - 8, optImg.heightMm + 1, 'S');
        }

        pdf.addImage(optImg.dataUrl, 'PNG', ML + 7, y, optImg.widthMm, optImg.heightMm);
        y += optImg.heightMm + 1.5;
      }
    }

    // ── NVT answer (compact inline, no rect) ──
    if (q.type === 'NVT' && showAnswerKey) {
      const ans = String(q.answer?.integer_value ?? q.answer?.decimal_value ?? '-');
      y = ensureSpace(y, 6);
      setF('bold', 9); setC('#166534');
      pdf.text(`Answer:  ${ans}`, ML + 2, y + 3);
      y += 5;
    }

    // ── Solution (rendered as image) ──
    if (includeSolution && q.solution?.text_markdown) {
      y = ensureSpace(y, 14);
      setFill(245, 243, 255); pdf.rect(ML + 4, y - 1, CW - 8, 6, 'F');
      setF('bold', 8.5); setC('#6d28d9');
      pdf.text('Solution', ML + 7, y + 3);
      y += 7;

      const solHtml = mdToHtml(q.solution.text_markdown);
      y = await placeHtmlBlock(solHtml, ML + 7, y, contentWidthPx - 28, 12, '#374151');
      y = await placeDiagrams(q.solution.text_markdown, ML + 7, y, contentWidthPx - 28, q.svg_scales?.solution ?? 50);
      y += 2;
    }

    // ── Separator ──
    y = ensureSpace(y, 6);
    setDraw('#d1d5db'); pdf.setLineWidth(0.2);
    pdf.line(ML, y, PW - MR, y);
    y += 6;
  }

  // ── Page numbers ──
  const totalPages = (pdf as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p);
    setFill(79, 70, 229); pdf.rect(0, PH - 1.2, PW, 1.2, 'F');
    setF('normal', 7); setC('#888888');
    pdf.text(`Page ${p} of ${totalPages}`, PW / 2, PH - 4, { align: 'center' });
  }

  onProgress(100, 'Saving...');
  pdf.save(`${title.replace(/\s+/g, '_')}.pdf`);
}

// ── PPT Export (image-based rendering for perfect math + SVG recoloring) ─────
type PptShapeType = 'rect' | 'line' | 'roundRect';

interface PptShapeOp {
  shape: PptShapeType;
  x: number;
  y: number;
  w: number;
  h: number;
  fillColor?: string;
  lineColor?: string;
  lineWidth?: number;
  rectRadius?: number;
}

interface PptTextRun {
  text: string;
  options?: { color?: string; fontSize?: number; bold?: boolean };
}

interface PptTextOp {
  text: string | PptTextRun[];
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize?: number;
  bold?: boolean;
  color?: string;
  fontFace?: string;
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'mid' | 'bottom';
  shape?: PptShapeType;
  fillColor?: string;
  rectRadius?: number;
}

interface PptImageOp {
  data: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PptSlidePayload {
  backgroundColor: string;
  shapes: PptShapeOp[];
  texts: PptTextOp[];
  images: PptImageOp[];
}

async function runPPTExport(
  questions: Question[],
  opts: { title: string; showAnswerKey: boolean; includeSolution: boolean; pptBg: 'white' | 'black' },
  onProgress: (pct: number, label: string) => void,
) {
  const { title, showAnswerKey, includeSolution, pptBg } = opts;
  const SW = 13.33, SH = 7.5, PAD = 0.5, CW = SW - PAD * 2;
  const dark = pptBg === 'black';
  const BG  = dark ? '0d0d0d' : 'ffffff';
  const TXT = dark ? '#f0f0f0' : '#111111';
  const DIM = dark ? '888888' : '666666';
  const ACC = dark ? 'a78bfa' : '4f46e5';
  const GRN = dark ? '34d399' : '166534';
  const GBG = dark ? '052e16' : 'dcfce7';
  const GBORDER = dark ? '166534' : '86efac';
  const bgMode: 'light' | 'dark' = dark ? 'dark' : 'light';
  const slides: PptSlidePayload[] = [];

  const newSlide = (): PptSlidePayload => ({
    backgroundColor: BG.replace('#', ''),
    shapes: [],
    texts: [],
    images: [],
  });

  const addChrome = (slide: PptSlidePayload, sub?: string) => {
    slide.shapes.push({ shape: 'rect', x: 0, y: 0, w: SW, h: 0.08, fillColor: ACC, lineColor: ACC, lineWidth: 0 });
    slide.shapes.push({ shape: 'rect', x: 0, y: SH - 0.08, w: SW, h: 0.08, fillColor: ACC, lineColor: ACC, lineWidth: 0 });
    slide.texts.push({
      text: sub ?? title,
      x: PAD,
      y: SH - 0.35,
      w: CW * 0.6,
      h: 0.25,
      fontSize: 7,
      color: DIM,
      fontFace: 'Helvetica',
    });
    slide.texts.push({
      text: 'Canvas Classes',
      x: SW - PAD - 2.5,
      y: SH - 0.35,
      w: 2.5,
      h: 0.25,
      fontSize: 7,
      color: DIM,
      fontFace: 'Helvetica',
      align: 'right',
    });
  };

  // Render HTML to image and add to slide
  const addRenderedText = async (
    slide: PptSlidePayload,
    html: string, x: number, yPos: number, widthIn: number, maxHeightIn: number,
    fontSize: number, color: string, bold?: boolean,
  ) => {
    const widthPx = Math.round(widthIn * 96);
    const bgColor = dark ? '#0d0d0d' : '#ffffff';
    const img = await renderHtmlToImage(html, widthPx, { fontSize, color, bgColor, bold });
    // Convert mm to inches (1 inch = 25.4mm)
    const wIn = img.widthMm / 25.4;
    const hIn = Math.min(img.heightMm / 25.4, maxHeightIn);
    slide.images.push({ data: img.dataUrl, x, y: yPos, w: wIn, h: hIn });
  };

  // Add SVG diagrams to slide
  // scalePercent: from svg_scales (0-200). Clamped to 100. Default 45%.
  const addDiagrams = async (
    slide: PptSlidePayload,
    md: string, x: number, yPos: number, maxWidthIn: number, scalePercent = 45,
  ) => {
    const urls = extractImageUrls(md);
    const clampedScale = Math.min(scalePercent, 100);
    const scaledMaxPx = Math.round(maxWidthIn * 96 * (clampedScale / 100));
    let curY = yPos;
    for (const url of urls) {
      const diagram = await renderSvgDiagram(url, scaledMaxPx, bgMode);
      if (diagram) {
        const wIn = diagram.widthMm / 25.4;
        const hIn = diagram.heightMm / 25.4;
        slide.images.push({ data: diagram.dataUrl, x, y: curY, w: wIn, h: hIn });
        curY += hIn + 0.1;
      }
    }
  };

  for (let qi = 0; qi < questions.length; qi++) {
    const q = questions[qi];
    onProgress(Math.round((qi / questions.length) * 88), `Rendering slide ${qi + 1} / ${questions.length}`);

    // ── Question slide ──
    const slide = newSlide();
    addChrome(slide);

    // Slide counter
    slide.texts.push({
      text: `${qi + 1} / ${questions.length}`,
      x: SW/2 - 0.6, y: SH-0.35, w: 1.2, h: 0.25,
      fontSize: 7, color: DIM, fontFace: 'Helvetica', align: 'center',
    });

    // Difficulty color
    const diffC = q.metadata.difficulty === 'Easy'
      ? (dark ? '34d399' : '16a34a')
      : q.metadata.difficulty === 'Medium'
        ? (dark ? 'fbbf24' : 'd97706')
        : (dark ? 'f87171' : 'dc2626');

    // Header row
    slide.texts.push({
      text: `Q${qi + 1}.`,
      x: PAD, y: 0.12, w: 0.65, h: 0.4,
      fontSize: 16, bold: true, color: ACC, fontFace: 'Helvetica',
    });
    slide.texts.push({
      text: q.type,
      x: PAD + 0.65, y: 0.14, w: 0.7, h: 0.34,
      fontSize: 8.5, bold: true, color: ACC, fontFace: 'Helvetica',
      fillColor: dark ? '2d1b69' : 'ede9fe',
      shape: 'roundRect', rectRadius: 0.05,
      align: 'center', valign: 'mid',
    });
    slide.texts.push({
      text: q.metadata.difficulty,
      x: PAD + 1.45, y: 0.14, w: 1.1, h: 0.34,
      fontSize: 9, bold: true, color: diffC, fontFace: 'Helvetica',
    });
    slide.texts.push({
      text: q.display_id || q._id.substring(0, 8),
      x: SW - PAD - 3, y: 0.18, w: 3, h: 0.22,
      fontSize: 6, color: DIM, fontFace: 'Helvetica', align: 'right',
    });

    // Question text (rendered as image for perfect math)
    const qHtml = mdToHtml(q.question_text.markdown);
    await addRenderedText(slide, qHtml, PAD, 0.6, CW, 2.6, 20, TXT);

    // Diagrams in question — use per-question svg_scales.question (default 50%)
    await addDiagrams(slide, q.question_text.markdown, PAD, 3.0, CW, q.svg_scales?.question ?? 50);

    // Options (each rendered as image)
    if (q.type !== 'NVT' && q.options.length > 0) {
      const optStartY = 3.38;
      const availH = SH - 0.55 - optStartY;
      const optH = Math.min(0.58, availH / Math.max(q.options.length, 1));
      for (let oi = 0; oi < q.options.length; oi++) {
        const opt = q.options[oi];
        const label = OPT_LABELS[oi] ?? String.fromCharCode(65 + oi);
        const correct = opt.is_correct && showAnswerKey;
        const oy = optStartY + oi * optH;
        if (correct) {
          slide.shapes.push({
            shape: 'rect',
            x: PAD + 0.05,
            y: oy - 0.02,
            w: CW - 0.1,
            h: optH - 0.02,
            fillColor: GBG,
            lineColor: GBORDER,
            lineWidth: 0.75,
          });
        }
        const optHtml = `<b>(${label})</b>&ensp;${mdToHtml(opt.text)}`;
        const optColor = correct ? (dark ? '#34d399' : '#166534') : TXT;
        await addRenderedText(slide, optHtml, PAD + 0.15, oy, CW - 0.3, optH, 16, optColor, correct);
      }
    }

    // NVT answer
    if (q.type === 'NVT' && showAnswerKey) {
      const ans = String(q.answer?.integer_value ?? q.answer?.decimal_value ?? '-');
      slide.shapes.push({
        shape: 'rect',
        x: PAD,
        y: 3.4,
        w: 4,
        h: 0.55,
        fillColor: GBG,
        lineColor: GBORDER,
        lineWidth: 0.75,
      });
      slide.texts.push({
        text: [
        { text: 'Answer:  ', options: { color: DIM, fontSize: 14 } },
        { text: ans, options: { bold: true, color: GRN, fontSize: 18 } },
        ],
        x: PAD + 0.15,
        y: 3.4,
        w: 3.7,
        h: 0.55,
        fontFace: 'Helvetica',
        valign: 'mid',
      });
    }

    slides.push(slide);

    // ── Solution slide ──
    if (includeSolution && q.solution?.text_markdown) {
      const ss = newSlide();
      addChrome(ss, `Q${qi + 1} - Solution`);
      ss.texts.push({
        text: `${qi + 1} / ${questions.length}`,
        x: SW/2-0.6, y: SH-0.35, w: 1.2, h: 0.25,
        fontSize: 7, color: DIM, fontFace: 'Helvetica', align: 'center',
      });

      // Solution header
      ss.shapes.push({
        shape: 'rect',
        x: 0,
        y: 0.08,
        w: SW,
        h: 0.52,
        fillColor: dark ? '2d1b69' : 'ede9fe',
        lineColor: dark ? '2d1b69' : 'ede9fe',
        lineWidth: 0,
      });
      ss.texts.push({
        text: `Q${qi + 1} - Solution`,
        x: PAD, y: 0.1, w: CW, h: 0.46,
        fontSize: 14, bold: true, color: ACC, fontFace: 'Helvetica', valign: 'mid',
      });

      // Stem (rendered as image)
      const stemHtml = mdToHtml(q.question_text.markdown);
      await addRenderedText(ss, stemHtml, PAD, 0.72, CW, 0.9, 13, dark ? '#888888' : '#666666');

      // Divider
      ss.shapes.push({
        shape: 'line',
        x: PAD,
        y: 1.72,
        w: CW,
        h: 0,
        lineColor: dark ? '334155' : 'd1d5db',
        lineWidth: 0.75,
      });

      // Solution body (rendered as image)
      const solHtml = mdToHtml(q.solution.text_markdown);
      await addRenderedText(ss, solHtml, PAD, 1.85, CW, SH - 2.35, 17, TXT);

      // Diagrams in solution — use per-question svg_scales.solution (default 50%)
      await addDiagrams(ss, q.solution.text_markdown, PAD, SH - 2.0, CW, q.svg_scales?.solution ?? 50);
      slides.push(ss);
    }
  }

  onProgress(94, 'Building PPT...');
  const response = await fetch('/api/v2/export/ppt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, slides }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || 'Failed to generate PPT');
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/\s+/g, '_')}.pptx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  onProgress(100, 'Saved');
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function ExportDashboard({ questions, initialSelected, onClose }: ExportDashboardProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialSelected && initialSelected.size > 0 ? Array.from(initialSelected) : []
  );
  const [format, setFormat]                     = useState<'pdf' | 'ppt'>('pdf');
  const [sheetTitle, setSheetTitle]             = useState('Practice Sheet');
  const [showAnswerKey, setShowAnswerKey]       = useState(true);
  const [includeSolution, setIncludeSolution]   = useState(false);
  const [pdfOrientation, setPdfOrientation]     = useState<'portrait' | 'landscape'>('portrait');
  const [pptBg, setPptBg]                       = useState<'white' | 'black'>('white');
  const [exporting, setExporting]               = useState(false);
  const [progress, setProgress]                 = useState(0);
  const [progressLabel, setProgressLabel]       = useState('');
  const [searchFilter, setSearchFilter]         = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterType, setFilterType]             = useState('');
  const [filterChapter, setFilterChapter]       = useState('');
  const [showFilters, setShowFilters]           = useState(false);
  const [page, setPage]                         = useState(0);

  const allChapters = useMemo(
    () => Array.from(new Set(questions.map(q => q.metadata.chapter_id))).sort(),
    [questions]
  );

  const filteredAll = useMemo(() => questions.filter(q => {
    if (searchFilter) {
      const s = searchFilter.toLowerCase();
      if (!q.display_id.toLowerCase().includes(s) && !q.question_text.markdown.toLowerCase().includes(s)) return false;
    }
    if (filterDifficulty && q.metadata.difficulty !== filterDifficulty) return false;
    if (filterType && q.type !== filterType) return false;
    if (filterChapter && q.metadata.chapter_id !== filterChapter) return false;
    return true;
  }), [questions, searchFilter, filterDifficulty, filterType, filterChapter]);

  // Reset to page 0 whenever filters change
  const totalPages = Math.ceil(filteredAll.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(0, totalPages - 1));
  const pageSlice = filteredAll.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const allFilteredSelected = filteredAll.length > 0 && filteredAll.every(q => selectedSet.has(q._id));
  const someFilteredSelected = filteredAll.some(q => selectedSet.has(q._id));

  const toggleSelect = (id: string) =>
    setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const toggleAll = () => {
    if (allFilteredSelected) {
      setSelectedIds(p => p.filter(id => !filteredAll.some(q => q._id === id)));
    } else {
      setSelectedIds(p => Array.from(new Set([...p, ...filteredAll.map(q => q._id)])));
    }
  };

  const selectedQuestions = useMemo(
    () => selectedIds.map(id => questions.find(q => q._id === id)).filter(Boolean) as Question[],
    [selectedIds, questions]
  );

  const handleExport = useCallback(async () => {
    if (selectedQuestions.length === 0) return;
    setExporting(true); setProgress(0); setProgressLabel('Preparing...');
    try {
      const prog = (pct: number, label: string) => { setProgress(pct); setProgressLabel(label); };
      if (format === 'pdf') {
        await runPDFExport(selectedQuestions, { title: sheetTitle, showAnswerKey, includeSolution, orientation: pdfOrientation }, prog);
      } else {
        await runPPTExport(selectedQuestions, { title: sheetTitle, showAnswerKey, includeSolution, pptBg }, prog);
      }
    } catch (e) {
      console.error('Export failed:', e);
      alert('Export failed — check console for details.');
    } finally {
      setExporting(false); setProgress(0); setProgressLabel('');
    }
  }, [selectedQuestions, format, sheetTitle, showAnswerKey, includeSolution, pdfOrientation, pptBg]);

  const clearFilters = () => {
    setFilterDifficulty(''); setFilterType(''); setFilterChapter(''); setSearchFilter(''); setPage(0);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-[#0d1117] border border-[#1e2a3a] rounded-2xl shadow-2xl w-full max-w-[1600px] h-[95vh] flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="shrink-0 px-5 py-3 border-b border-[#1e2a3a] bg-[#161b27] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg">
              <Download size={14} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Export Practice Sheet</h2>
              <p className="text-[10px] text-gray-500 mt-0.5">
                {selectedQuestions.length} selected · pure text · fast &amp; crisp output
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-[#1e2a3a] hover:bg-[#2d3f55] flex items-center justify-center transition">
            <X size={13} className="text-gray-400" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 flex overflow-hidden min-h-0">

          {/* ════ LEFT: Question list (70%) ════ */}
          <div className="flex flex-col min-h-0 border-r border-[#1e2a3a]" style={{ width: '70%' }}>

            {/* Toolbar */}
            <div className="shrink-0 px-4 pt-3 pb-2 border-b border-[#1e2a3a] space-y-2 bg-[#0d1117]">
              <div className="flex items-center gap-2">
                {/* Select-all checkbox */}
                <button
                  onClick={toggleAll}
                  title={allFilteredSelected ? 'Deselect all filtered' : 'Select all filtered'}
                  className="shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors"
                  style={{
                    background: allFilteredSelected ? '#4f46e5' : someFilteredSelected ? '#312e81' : 'transparent',
                    borderColor: allFilteredSelected || someFilteredSelected ? '#4f46e5' : '#475569',
                  }}
                >
                  {allFilteredSelected && (
                    <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                      <path d="M1 3.5L3 5.5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {someFilteredSelected && !allFilteredSelected && (
                    <div className="w-2 h-0.5 bg-indigo-300 rounded" />
                  )}
                </button>
                <span className="text-[11px] text-gray-400 font-medium">
                  {filteredAll.filter(q => selectedSet.has(q._id)).length} / {filteredAll.length} selected
                  {filteredAll.length < questions.length && <span className="text-gray-600"> (filtered from {questions.length})</span>}
                </span>
                <div className="flex-1" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchFilter}
                  onChange={e => { setSearchFilter(e.target.value); setPage(0); }}
                  className="w-48 px-3 py-1.5 rounded-lg bg-[#1e2a3a] border border-[#2d3f55] text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
                />
                <button
                  onClick={() => setShowFilters(p => !p)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    showFilters ? 'bg-indigo-600 text-white' : 'bg-[#1e2a3a] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Filter size={11} />
                  Filters
                </button>
              </div>

              {showFilters && (
                <div className="flex items-center gap-2 flex-wrap">
                  <select value={filterDifficulty} onChange={e => { setFilterDifficulty(e.target.value); setPage(0); }}
                    className="px-2 py-1 rounded-lg bg-[#1e2a3a] border border-[#2d3f55] text-xs text-gray-300 focus:outline-none focus:border-indigo-500">
                    <option value="">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(0); }}
                    className="px-2 py-1 rounded-lg bg-[#1e2a3a] border border-[#2d3f55] text-xs text-gray-300 focus:outline-none focus:border-indigo-500">
                    <option value="">All Types</option>
                    {['SCQ','MCQ','NVT','AR','MST','MTC'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select value={filterChapter} onChange={e => { setFilterChapter(e.target.value); setPage(0); }}
                    className="px-2 py-1 rounded-lg bg-[#1e2a3a] border border-[#2d3f55] text-xs text-gray-300 focus:outline-none focus:border-indigo-500">
                    <option value="">All Chapters</option>
                    {allChapters.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {(filterDifficulty || filterType || filterChapter || searchFilter) && (
                    <button onClick={clearFilters}
                      className="px-2 py-1 rounded-lg bg-red-900/30 text-red-400 text-xs hover:bg-red-900/50 transition">
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Paginated question list — 2-column grid */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
            <div className="grid grid-cols-2 gap-2">
              {filteredAll.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-gray-600 text-sm">
                  No questions match the current filters.
                </div>
              )}
              {pageSlice.map((q, qi) => {
                const isSelected = selectedSet.has(q._id);
                const globalIdx = safePage * PAGE_SIZE + qi;
                const qText = mdToDisplay(q.question_text.markdown);
                return (
                  <div
                    key={q._id}
                    className={`rounded-xl border transition-colors ${
                      isSelected
                        ? 'border-indigo-500/60 bg-[#161b27]'
                        : 'border-[#1e2a3a] bg-[#0f1419] hover:border-[#2d3f55]'
                    }`}
                  >
                    {/* Row */}
                    <div className="flex items-start gap-2 px-3 py-2.5">
                      {/* Left col: checkbox + number + badges */}
                      <div className="shrink-0 flex flex-col items-center gap-1 pt-0.5" style={{width:'36px'}}>
                        <button
                          onClick={() => toggleSelect(q._id)}
                          className="w-4 h-4 rounded border-2 flex items-center justify-center transition-colors"
                          style={{
                            background: isSelected ? '#4f46e5' : 'transparent',
                            borderColor: isSelected ? '#4f46e5' : '#475569',
                          }}
                        >
                          {isSelected && (
                            <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                              <path d="M1 3.5L3 5.5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </button>
                        <span className="text-[11px] font-bold text-indigo-400 leading-none">{globalIdx + 1}.</span>
                        <span className="px-1 py-0.5 rounded text-[8px] font-bold leading-none"
                          style={{ background: `${TYPE_COLOR[q.type]}22`, color: TYPE_COLOR[q.type] }}>
                          {q.type}
                        </span>
                        <span className="text-[8px] font-semibold leading-none"
                          style={{ color: DIFF_COLOR[q.metadata.difficulty] }}>
                          {q.metadata.difficulty[0]}
                        </span>
                      </div>

                      {/* Question text — full width */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] text-gray-200 leading-relaxed whitespace-pre-wrap break-words">
                          {qText}
                        </p>
                        {/* SVG diagrams */}
                        {extractImageUrls(q.question_text.markdown).map((url, ui) => (
                          <img key={ui} src={`/api/proxy-svg?url=${encodeURIComponent(url)}`}
                            alt="diagram" className="mt-2 rounded block"
                            style={{
                              maxHeight: 160,
                              background: '#0d1117',
                              width: `${q.svg_scales?.question ?? 50}%`,
                              maxWidth: '100%',
                            }} />
                        ))}
                        {/* Options */}
                        {q.type !== 'NVT' && q.options.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {q.options.map((opt, oi) => (
                              <div key={opt.id} className={`flex items-start gap-2 px-2.5 py-1 rounded-lg text-[13px] ${
                                opt.is_correct ? 'bg-emerald-900/20 border border-emerald-700/30' : 'bg-[#1a2030]'
                              }`}>
                                <span className={`shrink-0 font-bold text-[12px] mt-0.5 ${opt.is_correct ? 'text-emerald-400' : 'text-indigo-400'}`}>
                                  ({OPT_LABELS[oi] ?? String.fromCharCode(65 + oi)})
                                </span>
                                <span className={`flex-1 leading-snug ${opt.is_correct ? 'text-emerald-300' : 'text-gray-300'}`}>
                                  {mdToDisplay(opt.text)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* NVT answer */}
                        {q.type === 'NVT' && (
                          <p className="mt-1 text-[13px] text-emerald-400 font-medium">
                            Answer: {q.answer?.integer_value ?? q.answer?.decimal_value ?? '—'}
                          </p>
                        )}
                        {/* display_id */}
                        <p className="mt-1.5 text-[9px] text-indigo-500/60 font-mono font-semibold">{q.display_id}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            </div>

            {/* Pagination bar */}
            {totalPages > 1 && (
              <div className="shrink-0 px-4 py-2 border-t border-[#1e2a3a] bg-[#0d1117] flex items-center justify-between">
                <span className="text-[11px] text-gray-500">
                  Page {safePage + 1} of {totalPages} &nbsp;·&nbsp; {filteredAll.length} questions
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={safePage === 0}
                    className="w-7 h-7 rounded-lg bg-[#1e2a3a] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#2d3f55] disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={13} />
                  </button>
                  {/* Page number pills — show up to 7 */}
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const p = totalPages <= 7 ? i
                      : safePage < 4 ? i
                      : safePage > totalPages - 5 ? totalPages - 7 + i
                      : safePage - 3 + i;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-7 h-7 rounded-lg text-[11px] font-medium transition ${
                          p === safePage
                            ? 'bg-indigo-600 text-white'
                            : 'bg-[#1e2a3a] text-gray-400 hover:text-white hover:bg-[#2d3f55]'
                        }`}
                      >
                        {p + 1}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={safePage >= totalPages - 1}
                    className="w-7 h-7 rounded-lg bg-[#1e2a3a] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#2d3f55] disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ════ RIGHT: Settings (30%) ════ */}
          <div className="shrink-0 flex flex-col bg-[#0d1117] overflow-y-auto" style={{ width: '30%' }}>
            <div className="p-4 space-y-5">

              {/* Sheet title */}
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sheet Title</label>
                <input
                  type="text"
                  value={sheetTitle}
                  onChange={e => setSheetTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#161b27] border border-[#2d3f55] text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="Practice Sheet"
                />
              </div>

              {/* Format toggle */}
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Export Format</label>
                <div className="flex rounded-lg overflow-hidden border border-[#2d3f55]">
                  {(['pdf', 'ppt'] as const).map(f => (
                    <button key={f} onClick={() => setFormat(f)}
                      className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        format === f ? 'bg-indigo-600 text-white' : 'bg-[#161b27] text-gray-500 hover:text-gray-300'
                      }`}>
                      {f === 'pdf' ? '📄 PDF' : '📊 PPT'}
                    </button>
                  ))}
                </div>
              </div>

              {/* PDF orientation */}
              {format === 'pdf' && (
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Page Orientation</label>
                  <div className="flex rounded-lg overflow-hidden border border-[#2d3f55]">
                    {(['portrait', 'landscape'] as const).map(o => (
                      <button key={o} onClick={() => setPdfOrientation(o)}
                        className={`flex-1 py-2 text-xs font-medium capitalize transition ${
                          pdfOrientation === o ? 'bg-indigo-600 text-white' : 'bg-[#161b27] text-gray-500 hover:text-gray-300'
                        }`}>
                        {o === 'portrait' ? '↕ Portrait' : '↔ Landscape'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PPT background */}
              {format === 'ppt' && (
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Slide Background</label>
                  <div className="flex rounded-lg overflow-hidden border border-[#2d3f55]">
                    {(['white', 'black'] as const).map(bg => (
                      <button key={bg} onClick={() => setPptBg(bg)}
                        className={`flex-1 py-2 text-xs font-medium capitalize transition ${
                          pptBg === bg ? 'bg-indigo-600 text-white' : 'bg-[#161b27] text-gray-500 hover:text-gray-300'
                        }`}>
                        {bg === 'white' ? '☀ White' : '🌙 Black'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Content options */}
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Content Options</label>
                <div className="space-y-2">
                  {[
                    { label: 'Show Answer Key', value: showAnswerKey, set: setShowAnswerKey, desc: 'Highlight correct options in green' },
                    { label: 'Include Solution', value: includeSolution, set: setIncludeSolution,
                      desc: format === 'ppt' ? 'Solution on separate slide' : 'Solution below each question' },
                  ].map(({ label, value, set, desc }) => (
                    <button key={label} onClick={() => set(!value)}
                      className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg border text-left transition ${
                        value ? 'border-indigo-500/50 bg-indigo-900/20' : 'border-[#2d3f55] bg-[#161b27] hover:border-[#3d4f65]'
                      }`}>
                      <div className="shrink-0 mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center"
                        style={{ background: value ? '#4f46e5' : 'transparent', borderColor: value ? '#4f46e5' : '#475569' }}>
                        {value && (
                          <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                            <path d="M1 3.5L3 5.5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-200">{label}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl bg-[#161b27] border border-[#2d3f55] p-3 space-y-1.5">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Summary</p>
                {([
                  ['Questions', selectedQuestions.length],
                  ['Format', format.toUpperCase()],
                  ['Answer Key', showAnswerKey ? 'Yes' : 'No'],
                  ['Solutions', includeSolution ? 'Yes' : 'No'],
                  ...(format === 'pdf' ? [['Orientation', pdfOrientation]] : [['Background', pptBg]]),
                ] as [string, string | number][]).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">{k}</span>
                    <span className="text-[11px] font-semibold text-gray-300">{v}</span>
                  </div>
                ))}
              </div>

              {/* Progress */}
              {exporting && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">{progressLabel}</span>
                    <span className="text-[10px] font-bold text-indigo-400">{progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#1e2a3a] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 transition-all duration-300"
                      style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              {/* Export button */}
              <button
                onClick={handleExport}
                disabled={exporting || selectedQuestions.length === 0}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  exporting || selectedQuestions.length === 0
                    ? 'bg-[#1e2a3a] text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-900/40'
                }`}
              >
                {exporting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download size={15} />
                    Export {selectedQuestions.length} Question{selectedQuestions.length !== 1 ? 's' : ''} as {format.toUpperCase()}
                  </>
                )}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
