# LaTeX Style Guide for Canvas Classes Questions

## 🎯 Critical: Consistency is Everything

**This workspace uses the EXACT SAME LaTeX rendering system as the main application.**

All questions added here will be rendered with **KaTeX 0.16.28** using the Canvas-specific `MathRenderer` component. Following this guide ensures your questions render identically across all systems.

---

## ✅ Required LaTeX Format

### 1. Math Delimiters

**ALWAYS use single `$...$` for ALL math (inline and display):**

```markdown
✅ CORRECT:
The energy is $E = mc^2$ where $c$ is speed of light.

For display equations:
$\frac{d}{dx}(x^2) = 2x$

❌ WRONG:
$$E = mc^2$$  ← FORBIDDEN - breaks renderer
\[E = mc^2\]  ← Don't use
\(E = mc^2\)  ← Don't use
```

**Why:** Canvas MathRenderer processes `$$` differently and causes rendering issues. Use only `$...$`.

### 2. Fractions

**ALWAYS use `\frac`, NEVER `\dfrac`:**

```markdown
✅ CORRECT:
$\frac{1}{2}$, $\frac{a+b}{c-d}$

❌ WRONG:
$\dfrac{1}{2}$  ← Renders oversized
```

### 3. Chemical Formulas

**ALWAYS wrap chemical formulas in `$\ce{...}$`:**

```markdown
✅ CORRECT:
$\ce{H2SO4}$, $\ce{C6H12O6}$, $\ce{Fe^{3+}}$

Reactions:
$\ce{2H2 + O2 -> 2H2O}$

❌ WRONG:
H2SO4  ← Raw text, subscripts won't render
$H_2SO_4$  ← Manual subscripts, inconsistent spacing
```

**Chemistry arrows in `\ce{}`:**
- `->` becomes →
- `<->` becomes ↔
- `<=>` becomes ⇌

### 4. Arrows

**ALWAYS use LaTeX arrow commands inside math:**

```markdown
✅ CORRECT:
$\rightarrow$, $\leftarrow$, $\leftrightarrow$
$\rightleftharpoons$ (equilibrium)
$\Rightarrow$ (implies)

❌ WRONG:
→  ← Raw Unicode arrow
->  ← Text arrow outside math
```

### 5. Greek Letters

**ALWAYS use LaTeX commands:**

```markdown
✅ CORRECT:
$\alpha$, $\beta$, $\gamma$, $\Delta$, $\lambda$, $\pi$

❌ WRONG:
α, β, γ  ← Raw Unicode
```

### 6. Superscripts and Subscripts

**Use proper braces for multi-character scripts:**

```markdown
✅ CORRECT:
$x^{2}$, $H^{+}$, $10^{-18}$
$C_{6}H_{12}O_{6}$

❌ WRONG:
$x^2n$  ← Only first char is superscript
$10^-18$  ← Minus not in superscript
```

**Special case - MO orbital notation:**
```markdown
✅ CORRECT:
$\sigma^{*}$, $\pi^{*}$ (antibonding orbitals)

The renderer auto-fixes ^* → ^{*}
```

### 7. Text Inside Math

**Use `\text{}` for words:**

```markdown
✅ CORRECT:
$K_{\text{sp}}$, $\Delta H_{\text{reaction}}$
$\text{mol}$, $\text{L}^{-1}$

❌ WRONG:
$K_{sp}$  ← "sp" rendered as s×p
$mol$  ← Italicized as variables
```

### 8. Units

**Use `\,` (thin space) before units:**

```markdown
✅ CORRECT:
$25\,°C$, $1.5\,\text{mol}$, $100\,\text{mL}$

❌ WRONG:
$25°C$  ← No space
$25 °C$  ← Regular space too wide
```

### 9. Brackets and Parentheses

**Use `\left` and `\right` for auto-sizing:**

```markdown
✅ CORRECT:
$\left(\frac{a}{b}\right)^2$
$\left[\ce{Fe(CN)6}\right]^{3-}$

❌ WRONG:
$(\frac{a}{b})^2$  ← Parentheses too small
```

**CRITICAL:** Always pair `\left` with `\right` on the same line.

### 10. Common Math Operators

```markdown
✅ CORRECT:
$\sin$, $\cos$, $\tan$, $\log$, $\ln$, $\lim$
$\sum$, $\int$, $\frac{d}{dx}$

❌ WRONG:
$sin(x)$  ← Renders as s×i×n×(x)
```

---

## 🧪 Chemistry-Specific Rules

### Oxidation States
```markdown
✅ CORRECT:
$\ce{Fe^{3+}}$, $\ce{Cr2O7^{2-}}$, $\ce{MnO4^{-}}$
```

### Equilibrium Reactions
```markdown
✅ CORRECT:
$\ce{N2 + 3H2 <=> 2NH3}$
$\ce{CH3COOH <=> CH3COO^{-} + H^{+}}$
```

### Reaction Conditions
```markdown
✅ CORRECT:
$\ce{CH4 ->[O2][heat] CO2 + H2O}$

Over/under arrow notation:
$\ce{A ->[catalyst][temp] B}$
```

### Organic Structures
For simple structures, use text names:
```markdown
✅ CORRECT:
Benzene, Toluene, Ethanol

For complex structures, use placeholder:
![Structure](https://canvas-chemistry-assets.r2.dev/questions/{question_id}/structure.svg)
```

---

## 🚫 Common Mistakes to Avoid

### 1. Mixing Math and Text
```markdown
❌ WRONG:
The pH is $7$ at $25°C$ temperature.

✅ CORRECT:
The pH is $7$ at $25\,°C$.
```

### 2. Unmatched Delimiters
```markdown
❌ WRONG:
$x^2 + y^2  ← Missing closing $
$\frac{1{2}$  ← Mismatched braces

✅ CORRECT:
$x^2 + y^2$
$\frac{1}{2}$
```

### 3. Exam Metadata in Question Text
```markdown
❌ WRONG:
[JEE Main 2024, Shift I, Morning] Calculate the pH...

✅ CORRECT:
Calculate the pH...
(Exam info goes in metadata.exam_source only)
```

### 4. Empty Commands
```markdown
❌ WRONG:
$\frac{}{}$, $\ce{}$

✅ CORRECT:
Remove or fill with content
```

---

## 🔍 Validation System

The workspace includes **automatic LaTeX validation** that checks for:

1. ❌ `$$` display math (forbidden)
2. ❌ `\dfrac` (use `\frac`)
3. ❌ Unmatched `$` delimiters
4. ❌ Unmatched braces `{}`
5. ❌ `\left` without `\right`
6. ❌ Raw Unicode arrows outside math
7. ⚠️ LaTeX commands outside `$...$`
8. ⚠️ Chemical formulas without `\ce{}`
9. ⚠️ Raw `->` arrows

**Auto-fix is available** for many issues. Use it before saving questions.

---

## 📝 Complete Example

```markdown
**Question:**
Calculate the pH of a $0.1\,\text{M}$ solution of $\ce{CH3COOH}$ 
given that $K_{\text{a}} = 1.8 \times 10^{-5}$ at $25\,°C$.

**Solution:**
For weak acid dissociation:
$\ce{CH3COOH <=> CH3COO^{-} + H^{+}}$

Using the formula:
$[\ce{H^{+}}] = \sqrt{K_{\text{a}} \times C}$

$[\ce{H^{+}}] = \sqrt{1.8 \times 10^{-5} \times 0.1}$

$[\ce{H^{+}}] = 1.34 \times 10^{-3}\,\text{M}$

Therefore:
$\text{pH} = -\log(1.34 \times 10^{-3}) = 2.87$
```

---

## 🛠️ Testing Your LaTeX

Before publishing:

1. **Preview in Admin Panel** - Real-time KaTeX rendering
2. **Run Validation** - Check for errors
3. **Apply Auto-fix** - Fix common issues
4. **Verify on Live Site** - Check final rendering

---

## 📚 Quick Reference

| Element | Correct | Wrong |
|---------|---------|-------|
| Inline math | `$x^2$` | `$$x^2$$` |
| Fraction | `$\frac{1}{2}$` | `$\dfrac{1}{2}$` |
| Chemical | `$\ce{H2O}$` | `H2O` |
| Arrow | `$\rightarrow$` | `→` or `->` |
| Greek | `$\alpha$` | `α` |
| Text in math | `$K_{\text{sp}}$` | `$K_{sp}$` |
| Units | `$25\,°C$` | `$25°C$` |
| Brackets | `$\left(\frac{a}{b}\right)$` | `$(\frac{a}{b})$` |

---

**Last Updated:** March 10, 2026  
**KaTeX Version:** 0.16.28  
**Renderer:** Canvas MathRenderer (identical to main system)
