# SVG Scaling Fix - Test View

## 🔍 Problem Report

**Issue:** SVG images in test view rendering very small compared to admin dashboard preview.

**Evidence:**
- Test view images (Q2, Q3, Q4, etc.): SVG structures barely visible
- Admin dashboard preview (GOC-035): Same question shows properly scaled SVG
- Root cause: `svg_scales` property not being applied in TestView component

## 🐛 Root Cause

The `MathRenderer` component accepts an `imageScale` prop that controls SVG width:
```typescript
imageScale?: number; // Fixed pixel width: scale * 2px (100 = 200px, 150 = 300px)
```

**Problem:** TestView was calling `MathRenderer` without passing the `imageScale` prop:
```typescript
// BEFORE (incorrect)
<MathRenderer markdown={q.question_text.markdown} fontSize={20} />
```

**Expected:** Should pass `svg_scales.question` from the question object:
```typescript
// AFTER (correct)
<MathRenderer markdown={q.question_text.markdown} fontSize={20} imageScale={q.svg_scales?.question || 100} />
```

## ✅ Fix Applied

**File:** `/app/the-crucible/components/TestView.tsx`

### Changes Made:

**1. Question Text (Test Mode):**
```typescript
<MathRenderer 
  markdown={q.question_text.markdown} 
  className="leading-relaxed" 
  fontSize={isMobile ? undefined : 20} 
  imageScale={q.svg_scales?.question || 100}  // ✅ ADDED
/>
```

**2. Options (Test Mode):**
```typescript
<MathRenderer 
  markdown={opt.text || ''} 
  fontSize={isMobile ? undefined : 20} 
  imageScale={q.svg_scales?.options || 100}  // ✅ ADDED
/>
```

**3. Question Text (Review Mode):**
```typescript
<MathRenderer 
  markdown={rq.question_text.markdown} 
  className="text-base leading-relaxed" 
  imageScale={rq.svg_scales?.question || 100}  // ✅ ADDED
/>
```

**4. Options (Review Mode):**
```typescript
<MathRenderer 
  markdown={opt.text || ''} 
  className="text-sm" 
  imageScale={rq.svg_scales?.options || 100}  // ✅ ADDED
/>
```

**5. Solution (Review Mode):**
```typescript
<MathRenderer 
  markdown={rq.solution.text_markdown} 
  className="text-sm leading-relaxed" 
  imageScale={rq.svg_scales?.solution || 100}  // ✅ ADDED
/>
```

## 📊 How SVG Scaling Works

### MathRenderer Logic:
```typescript
// In MathRenderer component (line 191-194)
const pxWidth = Math.round(imageScale * 2);
html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m: string, alt: string, url: string) => {
  return `<img src="${url}" alt="${alt}" style="width:${pxWidth}px;height:auto;" />`;
});
```

### Scale Values:
- `imageScale: 100` → `200px` width (default)
- `imageScale: 150` → `300px` width
- `imageScale: 225` → `450px` width (for complex structures)
- `imageScale: 340` → `680px` width (for very detailed diagrams)

### Example from Database:
```json
{
  "display_id": "GOC-035",
  "svg_scales": {
    "question": 225,  // 450px width
    "options": 100,   // 200px width
    "solution": 100   // 200px width
  }
}
```

## 🎯 Result

**Before Fix:**
- All SVG images rendered at default 200px (imageScale=100)
- Complex organic structures appeared tiny and illegible
- Inconsistent with admin dashboard preview

**After Fix:**
- SVG images use stored `svg_scales` values
- Question images scale independently from option images
- Consistent rendering between test view and admin preview
- Large structures (imageScale=225+) now properly visible

## 🧪 Testing

**Test Questions with SVG:**
1. GOC-035 (carbocation stability) - `svg_scales.question: 225`
2. GOC-054 (deactivating groups) - Has SVG structures
3. Any question with organic chemistry diagrams

**Expected Behavior:**
- ✅ SVG images render at correct size in test mode
- ✅ SVG images render at correct size in review mode
- ✅ Scales match admin dashboard preview
- ✅ Different scales for question vs options vs solution

## 🚀 Deployment

**Build Status:** ✅ Successful
- No TypeScript errors
- No breaking changes
- Backward compatible (defaults to 100 if svg_scales missing)

**Safe to Deploy:** ✅
