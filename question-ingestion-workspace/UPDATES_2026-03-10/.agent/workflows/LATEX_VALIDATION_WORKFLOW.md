---
description: LaTeX Validation and Formatting Workflow
---

# LaTeX Validation Workflow for Question Ingestion

This workflow ensures all questions use consistent LaTeX formatting that renders identically across all systems.

## Before You Start

**CRITICAL:** This workspace uses the exact same LaTeX rendering system as the production website:
- **KaTeX 0.16.28** - Math rendering library
- **Canvas MathRenderer** - Custom component with chemistry support
- **LaTeX Validator** - Automatic error detection and fixing

## Step 1: Write Question with Proper LaTeX

Follow the rules in `LATEX_STYLE_GUIDE.md`:

### Quick Checklist:
- [ ] Use `$...$` for ALL math (never `$$`)
- [ ] Use `\frac` (never `\dfrac`)
- [ ] Wrap chemicals in `$\ce{...}$`
- [ ] Use LaTeX arrows: `$\rightarrow$` (not `→` or `->`)
- [ ] Use `\text{}` for words inside math
- [ ] Add `\,` thin space before units: `$25\,°C$`
- [ ] Pair `\left(` with `\right)`
- [ ] Close all `$` delimiters

### Example:
```markdown
Calculate the pH of a $0.1\,\text{M}$ solution of $\ce{CH3COOH}$ 
given that $K_{\text{a}} = 1.8 \times 10^{-5}$.

Solution:
$\ce{CH3COOH <=> CH3COO^{-} + H^{+}}$

$[\ce{H^{+}}] = \sqrt{K_{\text{a}} \times C} = \sqrt{1.8 \times 10^{-5} \times 0.1}$
```

## Step 2: Real-Time Preview

As you type in the admin panel:
1. **Question text preview** updates automatically
2. **Solution preview** shows rendered LaTeX
3. **Option previews** display math correctly

**What you see in preview = what students see on live site**

## Step 3: Automatic Validation

The admin panel automatically validates LaTeX on blur (when you click away from a field).

### Validation Indicators:

**✅ Green checkmark** = LaTeX is valid
```
✓ Question LaTeX is valid
```

**⚠️ Yellow warning** = Has warnings (non-critical)
```
⚠ Question has LaTeX warnings
- Possible chemical formulas without \ce{}: H2SO4, C6H12O6
```

**❌ Red error** = Has errors (must fix)
```
✗ Question has LaTeX errors
- Line 3: $$...$$ breaks the renderer — use $...$ only
- Line 5: Unmatched $ — math mode not closed
```

## Step 4: Review Errors and Warnings

Click on the validation message to see details:

### Common Errors (Must Fix):
1. **`$$` display math**
   - Error: `$$x^2$$ breaks the renderer`
   - Fix: Change to `$x^2$`

2. **`\dfrac` usage**
   - Error: `\dfrac causes oversized rendering`
   - Fix: Change to `\frac`

3. **Unmatched delimiters**
   - Error: `Unmatched $ — math mode not closed`
   - Fix: Add closing `$`

4. **Unmatched braces**
   - Error: `Unmatched braces: 3 { vs 2 }`
   - Fix: Add missing `}`

5. **Raw Unicode arrows**
   - Error: `Raw Unicode arrow "→" outside $...$`
   - Fix: Use `$\rightarrow$`

### Common Warnings (Should Fix):
1. **Chemical formulas without `\ce{}`**
   - Warning: `Possible chemical formulas: H2SO4, C6H12O6`
   - Fix: Wrap in `$\ce{H2SO4}$`

2. **Raw `->` arrows**
   - Warning: `Raw "->" found 2x`
   - Fix: Use `$\rightarrow$`

3. **LaTeX commands outside math**
   - Warning: `\frac appears to be outside $...$`
   - Fix: Wrap in `$...$`

## Step 5: Use Auto-Fix (Optional)

For auto-fixable errors, click **"Auto-Fix LaTeX"** button:

### What Auto-Fix Does:
- ✅ Converts `$$...$$ → $...$`
- ✅ Replaces `\dfrac → \frac`
- ✅ Removes extra spaces around `$`
- ✅ Converts Unicode arrows → LaTeX arrows
- ✅ Fixes spacing in `\frac{` commands

### What Auto-Fix CANNOT Do:
- ❌ Fix unmatched delimiters (you must do manually)
- ❌ Fix unmatched braces (you must do manually)
- ❌ Add missing `\ce{}` around chemicals (optional)

**After auto-fix:**
1. Review the changes
2. Validation runs again automatically
3. Fix any remaining errors manually

## Step 6: Manual Fixes

For errors that can't be auto-fixed:

### Unmatched Delimiters:
```markdown
❌ BEFORE:
The energy is $E = mc^2 where c is constant.

✅ AFTER:
The energy is $E = mc^2$ where $c$ is constant.
```

### Unmatched Braces:
```markdown
❌ BEFORE:
$\frac{a+b{c-d}$

✅ AFTER:
$\frac{a+b}{c-d}$
```

### Missing `\left`/`\right` Pair:
```markdown
❌ BEFORE:
$\left(\frac{a}{b}$

✅ AFTER:
$\left(\frac{a}{b}\right)$
```

## Step 7: Verify Rendering

After fixing all errors:

1. **Check preview** - Does it look correct?
2. **Check special characters** - Are subscripts/superscripts right?
3. **Check chemical formulas** - Are they properly formatted?
4. **Check arrows** - Do they point the right direction?

### Common Rendering Issues:

**Issue:** Subscripts not showing
```markdown
❌ H2SO4  ← Plain text
✅ $\ce{H2SO4}$  ← Renders with subscripts
```

**Issue:** Fractions too large
```markdown
❌ $\dfrac{1}{2}$  ← Oversized
✅ $\frac{1}{2}$  ← Normal size
```

**Issue:** Variables not italicized
```markdown
❌ $\text{x}^2$  ← x not italic
✅ $x^2$  ← x properly italic
```

## Step 8: Save and Publish

Once validation passes:

1. Click **"Save"** to store in database
2. LaTeX is saved exactly as written
3. Set status to **"Published"** when ready
4. Question appears on live site immediately

## Testing on Live Site

After publishing, verify on production:

1. Go to https://canvasclasses.in/the-crucible
2. Navigate to the chapter
3. Find your question (by display_id)
4. Verify LaTeX renders correctly
5. Check on both desktop and mobile

## Troubleshooting

### "LaTeX not rendering at all"
- Check if `$` delimiters are present
- Verify no unmatched delimiters
- Check browser console for errors

### "Chemical formula shows as plain text"
- Wrap in `$\ce{...}$`
- Check for typos in `\ce` command

### "Fraction looks wrong"
- Use `\frac` not `\dfrac`
- Check braces: `\frac{num}{den}`

### "Arrow not showing"
- Use `$\rightarrow$` not `→` or `->`
- Ensure inside `$...$` delimiters

### "Subscript/superscript wrong"
- Use braces for multi-char: `$10^{-18}$`
- Check for missing `{}`

## Best Practices

1. **Write LaTeX incrementally** - Add math bit by bit, check preview
2. **Use validation early** - Don't wait until the end
3. **Fix errors immediately** - Don't accumulate errors
4. **Test complex expressions** - Preview before saving
5. **Keep it simple** - Simpler LaTeX = fewer errors
6. **Follow the style guide** - Consistency is key

## Quick Reference Commands

### Math Delimiters:
- Inline: `$x^2$`
- Display: `$\frac{a}{b}$` (NOT `$$`)

### Chemistry:
- Formula: `$\ce{H2SO4}$`
- Reaction: `$\ce{A + B -> C}$`
- Equilibrium: `$\ce{A <=> B}$`

### Common Symbols:
- Arrow: `$\rightarrow$`
- Equilibrium: `$\rightleftharpoons$`
- Plus/minus: `$\pm$`
- Times: `$\times$`
- Degree: `$25\,°C$`

### Greek Letters:
- `$\alpha$`, `$\beta$`, `$\gamma$`
- `$\Delta$`, `$\lambda$`, `$\pi$`

### Text in Math:
- `$K_{\text{sp}}$`
- `$\Delta H_{\text{reaction}}$`

---

**Remember:** The LaTeX you write here renders EXACTLY the same as on the live website. If it looks good in preview, it will look good for students!

**Last Updated:** March 10, 2026
