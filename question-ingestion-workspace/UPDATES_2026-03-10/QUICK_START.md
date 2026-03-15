# Quick Start - Mac Mini Setup

## 🚀 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

This installs:
- ✅ **KaTeX 0.16.28** - LaTeX rendering (CRITICAL)
- ✅ **React, Next.js** - Framework
- ✅ **MongoDB, Mongoose** - Database
- ✅ **AWS SDK** - R2 storage
- ✅ All other required packages

**Expected time:** 2-3 minutes

### 2. Start Admin Panel
```bash
npm run dev
```

**Admin panel:** http://localhost:3000

### 3. Verify LaTeX Rendering

1. Open admin panel
2. Click "Add Question"
3. In question text, type: `$E = mc^2$`
4. Preview should show properly rendered equation

**If LaTeX doesn't render:**
- Check terminal for errors
- Verify KaTeX installed: `npm list katex`
- Should show: `katex@0.16.28`

---

## ✅ System Verification Checklist

After setup, verify these work:

### LaTeX Rendering
- [ ] Inline math: `$x^2$` renders correctly
- [ ] Fractions: `$\frac{1}{2}$` displays properly
- [ ] Chemistry: `$\ce{H2SO4}$` shows subscripts
- [ ] Arrows: `$\rightarrow$` renders as →

### Database Connection
- [ ] Questions load in admin panel
- [ ] Can create new question
- [ ] Can save question
- [ ] Question appears in list

### Asset Upload
- [ ] Can drag-drop SVG files
- [ ] Upload completes successfully
- [ ] CDN URL is generated
- [ ] Image displays in preview

---

## 📚 Essential Documents

Read these in order:

1. **SETUP_GUIDE.md** - Complete setup instructions
2. **LATEX_STYLE_GUIDE.md** - LaTeX formatting rules (READ THIS!)
3. **SECURITY_NOTICE.md** - Security guidelines
4. **.agent/workflows/LATEX_VALIDATION_WORKFLOW.md** - Step-by-step validation

---

## 🎯 Your First Question

Follow this workflow:

### Step 1: Create Question
1. Click "Add Question"
2. Select chapter (e.g., "GOC")
3. Choose type (SCQ, MCQ, NVT)

### Step 2: Write Question Text
```markdown
Calculate the pH of a $0.1\,\text{M}$ solution of $\ce{CH3COOH}$ 
given that $K_{\text{a}} = 1.8 \times 10^{-5}$.
```

### Step 3: Add Options (for MCQ/SCQ)
```
A. $2.87$
B. $3.14$
C. $4.76$
D. $5.23$
```

### Step 4: Mark Correct Answer
Click on option A

### Step 5: Write Solution
```markdown
For weak acid dissociation:
$\ce{CH3COOH <=> CH3COO^{-} + H^{+}}$

Using: $[\ce{H^{+}}] = \sqrt{K_{\text{a}} \times C}$

$[\ce{H^{+}}] = \sqrt{1.8 \times 10^{-5} \times 0.1} = 1.34 \times 10^{-3}$

$\text{pH} = -\log(1.34 \times 10^{-3}) = 2.87$
```

### Step 6: Tag Question
- Primary tag: Select from dropdown (e.g., "Acidity & Basicity")
- Mark as PYQ if applicable
- Click star ⭐ to mark as Top PYQ

### Step 7: Validate LaTeX
- Check for green ✓ validation indicator
- If errors, click "Auto-Fix LaTeX"
- Fix any remaining errors manually

### Step 8: Save & Publish
- Click "Save"
- Set status to "Published"
- Question is now live!

---

## 🔧 Common Issues & Fixes

### "KaTeX is not defined"
```bash
# Reinstall KaTeX
npm install katex@0.16.28 --save
npm run dev
```

### "Module not found: MathRenderer"
```bash
# Verify file exists
ls app/admin/components/MathRenderer.tsx

# If missing, copy from main system
```

### "LaTeX not rendering"
1. Check browser console (F12)
2. Verify KaTeX CSS loaded
3. Check for JavaScript errors
4. Restart dev server

### "Chemical formulas show as plain text"
- Wrap in `$\ce{...}$`
- Example: `$\ce{H2SO4}$` not `H2SO4`

---

## 📋 LaTeX Quick Reference

| What | How | Example |
|------|-----|---------|
| Inline math | `$...$` | `$x^2$` |
| Fraction | `$\frac{a}{b}$` | `$\frac{1}{2}$` |
| Chemical | `$\ce{...}$` | `$\ce{H2O}$` |
| Arrow | `$\rightarrow$` | `$A \rightarrow B$` |
| Subscript | `$x_{1}$` | `$H_{2}O$` |
| Superscript | `$x^{2}$` | `$E = mc^{2}$` |
| Greek | `$\alpha$` | `$\alpha$, $\beta$` |
| Text in math | `$\text{...}$` | `$K_{\text{sp}}$` |

---

## 🎓 Learning Path

### Day 1: Setup & Basics
- [ ] Complete setup
- [ ] Read LATEX_STYLE_GUIDE.md
- [ ] Create 1-2 test questions
- [ ] Verify rendering on live site

### Day 2: LaTeX Mastery
- [ ] Practice all LaTeX commands
- [ ] Learn chemistry notation
- [ ] Use validation workflow
- [ ] Add 5-10 real questions

### Day 3: Production Ready
- [ ] Add questions at full speed
- [ ] Use keyboard shortcuts
- [ ] Bulk operations
- [ ] Quality assurance checks

---

## 🆘 Getting Help

### Self-Help Resources
1. **LATEX_STYLE_GUIDE.md** - All LaTeX rules
2. **LATEX_VALIDATION_WORKFLOW.md** - Step-by-step guide
3. Browser console (F12) - Error messages
4. Terminal output - Server errors

### Contact Main System
If you encounter:
- Database connection issues
- R2 upload failures
- Credential problems
- System-wide errors

---

## ✨ Pro Tips

1. **Use Auto-Fix** - Saves time on common errors
2. **Preview Often** - Catch issues early
3. **Copy-Paste LaTeX** - Reuse common patterns
4. **Keyboard Shortcuts** - Cmd+S to save
5. **Batch Similar Questions** - More efficient

---

**You're ready to start adding questions!** 🎉

Open http://localhost:3000 and begin.

**Last Updated:** March 10, 2026
