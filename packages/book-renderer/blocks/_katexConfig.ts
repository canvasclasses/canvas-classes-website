/**
 * Shared rehype-katex options for the livebook reader.
 *
 * Why this file exists
 * --------------------
 * KaTeX renders `\frac{a}{b}` in *text-style* when it appears inside inline
 * math (`$...$`). Text-style fractions use script-level positioning so the
 * numerator and denominator both shrink to roughly 70% of body size — which
 * makes constructs like `\frac{1}{2}` look microscopic next to body text.
 *
 * CSS overrides can boost the font-size of the fraction's children, but the
 * underlying layout is still text-style — numerator/denominator stay
 * vertically compressed and the fraction bar sits crammed between them.
 *
 * The macro below forces every inline `\frac` to expand to `\dfrac` (display
 * style) before KaTeX lays it out, so every inline fraction renders at the
 * same scale as a block-level equation.
 *
 *   `$h\nu = W_0 + \frac{1}{2} m_e v^2$` becomes
 *   `$h\nu = W_0 + \dfrac{1}{2} m_e v^2$`
 *
 * In display math (`$$...$$` / latex_block / displayMode: true) the result is
 * identical to plain `\frac` — `\dfrac` is already the default there — so
 * this is a no-op for block equations.
 *
 * Usage:
 *   rehypePlugins={[[rehypeKatex, REHYPE_KATEX_OPTIONS]]}
 */
export const REHYPE_KATEX_OPTIONS = {
  macros: {
    '\\frac': '\\dfrac{#1}{#2}',
  },
};
