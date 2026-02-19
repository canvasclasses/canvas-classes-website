# 🎨 RENDERING STANDARDS - FINAL SPECIFICATION

## Overview
This document defines the complete rendering standards for The Crucible admin dashboard. All future questions will automatically follow these standards.

---

## ✅ LaTeX Rendering Standards

### **Font Consistency**
- **All LaTeX uses Inter font** (sans-serif)
- Matches surrounding text perfectly
- No Computer Modern serif font
- Applied via CSS classes with `!important`

### **Size Consistency**
All sections use **0.68em** for both inline and display math:

| Section | Inline Math | Display Math |
|---------|-------------|--------------|
| Question Text | 0.68em | 0.68em |
| Options | 0.68em | 0.68em |
| Solutions | 0.68em | 0.68em |

### **Technical Implementation**

**Component:** `/app/crucible/admin/components/LaTeXPreview.tsx`
- Applies inline styles for size control
- Wraps LaTeX in `.latex-math-inline` and `.latex-math-display` classes
- Detects context but applies uniform 0.68em to all sections

**CSS:** `/app/globals.css`
```css
/* Force Inter font on all LaTeX math elements */
.latex-math-inline,
.latex-math-inline *,
.latex-math-display,
.latex-math-display * {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif !important;
}
```

---

## 📝 Markdown Rendering Standards

### **Bold Text**
- Syntax: `**text**`
- Renders as: `<strong>text</strong>`
- Used for step headers: `**Step 1: Analyze**`

### **Bullet Points**
- Syntax: `- item`
- Renders as: `<ul><li>item</li></ul>`
- Used for key points lists

### **Tables**
- Syntax: Markdown table with `|` separators
- Example:
  ```markdown
  | Header 1 | Header 2 |
  |----------|----------|
  | Cell A   | Cell B   |
  ```
- Renders with styled borders and hover effects

---

## 🎯 Option Layout Standards

### **Intelligent Layout System**

**2×2 Grid Used When:**
- Options contain images/SVG
- Average text length < 50 characters
- Maximum text length < 80 characters

**Vertical Stack Used When:**
- Long text options (avg ≥ 50 chars AND max ≥ 80 chars)
- No images present

### **Option Label Design**
- **Style:** Rounded squares (8×8px)
- **Position:** Outside option boxes, center-aligned
- **Correct answer:** Green background with green border
- **Other options:** Gray background with gray border

---

## 🔧 Chemistry Formula Standards

### **\ce{} Command Processing**
The system automatically converts `\ce{}` commands to proper LaTeX:

| Input | Output |
|-------|--------|
| `\ce{H2O}` | `\mathrm{H_{2}O}` |
| `\ce{CO2}` | `\mathrm{CO_{2}}` |
| `\ce{N2O5}` | `\mathrm{N_{2}O_{5}}` |
| `\ce{A -> B}` | `\mathrm{A \rightarrow B}` |

**Processing in LaTeXPreview.tsx:**
- Converts element+number to subscripts: `H2` → `H_{2}`
- Converts arrows: `->` → `\rightarrow`
- Wraps in `\mathrm{}` for proper formatting

---

## 📊 Size Specifications

### **Text Sizes**
- Question text: 1rem (16px)
- Option text: 1rem (16px)
- Solution text: 1.0625rem (17px, handwritten style)

### **LaTeX Sizes (Relative to Text)**
- All LaTeX: 0.68em
- Calculated size: ~10.88px for questions/options
- Calculated size: ~11.56px for solutions

### **Visual Result**
- LaTeX appears slightly smaller than text
- Creates balanced, readable appearance
- Consistent across all sections

---

## 🎨 Font Families

### **Text Fonts**
- Question/Options: Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif
- Solutions: Kalam, Caveat, Patrick Hand, cursive (handwritten)

### **LaTeX Font**
- All sections: Inter (forced via CSS)
- Overrides KaTeX default Computer Modern

---

## ⚙️ SVG Scale Controls

### **Question & Solution Areas**
- Range: 1-100%
- Increment: 1% (fine control)
- UI: Slider with reset button

### **Option Areas**
- Range: 1-100%
- Increment: 5% (coarse control)
- UI: Compact inline slider

---

## 🔄 Audio Recording

### **Solution Audio**
- Component: AudioRecorder
- Format: WebM audio
- Storage: Cloudflare R2
- Features: Record, play, upload, delete

---

## 📋 Quality Assurance

### **Automatic Checks**
- ✅ LaTeX font consistency (Inter)
- ✅ LaTeX size consistency (0.68em)
- ✅ Markdown rendering (bold, bullets, tables)
- ✅ Chemistry formula conversion (\ce{})
- ✅ Option layout selection (grid vs vertical)

### **Manual Verification**
- Check LaTeX renders without red errors
- Verify chemical formulas display correctly
- Confirm option labels are center-aligned
- Test audio recording functionality

---

## 🚀 Future Questions

**All future questions will automatically:**
1. Use Inter font for all LaTeX
2. Apply 0.68em sizing uniformly
3. Render markdown formatting correctly
4. Convert \ce{} chemistry formulas
5. Choose appropriate option layout
6. Display with consistent styling

**No manual intervention required** - the system handles all rendering automatically.

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `/app/crucible/admin/components/LaTeXPreview.tsx` | LaTeX rendering with size/font control |
| `/app/globals.css` | CSS rules for font consistency |
| `/app/crucible/admin/page.tsx` | Admin dashboard with option layout logic |
| `/QUESTION_INGESTION_WORKFLOW.md` | Complete workflow for AI agents |

---

**Last Updated:** February 17, 2026  
**Status:** ✅ Production Ready  
**Consistency:** Fully Standardized
