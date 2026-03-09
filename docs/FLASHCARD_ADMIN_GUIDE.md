# Flashcard Admin Dashboard Guide

## 🎯 Admin Dashboard URL

**Local Development:**
```
http://localhost:3000/crucible/admin/flashcards
```

**Production:**
```
https://canvasclasses.in/crucible/admin/flashcards
```

---

## ✨ Features Overview

### 1. **Split-View Interface**
- **Left Panel:** Flashcard list with search/filter
- **Right Panel:** Live preview of question & answer with LaTeX rendering

### 2. **SVG Drag & Drop**
- Upload SVG diagrams for both questions and answers
- Auto-upload to Cloudflare R2
- Markdown link auto-inserted
- Same workflow as Crucible question bank

### 3. **True/False Flashcards**
- Toggle flashcard type: Standard or True/False
- True/False cards show dropdown (True/False) instead of textarea

### 4. **Flexible Taxonomy**
- **No fixed chapter list** - add any chapter/section on the fly
- Examples:
  - "JEE 2026 PYQs"
  - "JEE 2025 Jan Session"
  - "NEET 2024"
  - "Solutions" (traditional chapter)
  - "100 Days to JEE"
- Autocomplete suggests existing chapters
- Chapter Manager button to view all chapters

### 5. **Live Preview**
- Real-time LaTeX rendering
- Markdown support
- SVG image preview
- Metadata tags display

---

## 🚀 How to Use

### Creating a New Flashcard

1. **Click "New Card"** button in left sidebar
2. **Fill in metadata:**
   - Flashcard ID (auto-generated)
   - Type: Standard or True/False
   - Category: Physical/Organic/Inorganic/JEE PYQ
   - Chapter: Type any name (e.g., "JEE 2026")
   - Topic: Optional (e.g., "Thermodynamics")
   - Difficulty: Easy/Medium/Hard

3. **Add Question:**
   - Type question in textarea
   - Use LaTeX: `$$P = P_0 \times X$$`
   - Drag & drop SVG for diagrams
   - Preview updates in real-time

4. **Add Answer:**
   - For Standard: Type full answer with LaTeX/Markdown
   - For True/False: Select True or False from dropdown
   - Drag & drop SVG for answer diagrams

5. **Click "Save"** - Flashcard created!

### Editing Existing Flashcard

1. **Click any flashcard** in left sidebar
2. **Edit fields** - preview updates live
3. **Click "Save"** to update

### Deleting Flashcard

1. **Click trash icon** on flashcard card
2. **Confirm deletion** - soft delete (can be recovered)

### Adding Custom Chapters

**Method 1: Direct Input**
- Type chapter name in "Chapter" field
- Autocomplete suggests existing chapters
- New chapters auto-created on save

**Method 2: Chapter Manager**
- Click folder icon (🗂️) in toolbar
- Type new chapter name
- Click "Add Chapter"
- View all existing chapters

---

## 📝 Taxonomy Structure Recommendation

### Flexible Approach (Recommended)

**No separate taxonomy file needed!** Chapters are created dynamically:

```
Flashcards
├── Physical Chemistry
│   ├── Solutions
│   ├── Electrochemistry
│   └── Chemical Kinetics
├── Organic Chemistry
│   ├── Alcohols, Phenols & Ethers
│   ├── Aldehydes, Ketones & Acids
│   └── GOC and POC
├── Inorganic Chemistry
│   ├── D & F Block
│   ├── Coordination Compounds
│   └── Salt Analysis
└── JEE PYQ
    ├── JEE 2026 Jan Session
    ├── JEE 2026 April Session
    ├── JEE 2025 Jan Session
    ├── JEE 2025 April Session
    ├── 100 Days to JEE
    └── Last Minute Revision
```

### Why This Approach?

1. **Flexibility:** Add any chapter/section without code changes
2. **PYQ Support:** Easily add "JEE 2026", "NEET 2024", etc.
3. **Campaign Support:** Create "100 Days to JEE", "Crash Course", etc.
4. **No Maintenance:** No taxonomy file to update
5. **User-Driven:** You decide structure, not code

### Alternative: Fixed Taxonomy (Not Recommended)

If you want a fixed taxonomy like Crucible questions:
- Create `/app/crucible/admin/taxonomy/flashcardTaxonomy.ts`
- Define chapters with IDs
- Restrict chapter selection to dropdown

**Downside:** Less flexible, requires code changes for new chapters

---

## 🖼️ SVG Upload Workflow

### For Questions:

1. **Drag SVG file** into "Question" SVG drop zone
2. **Auto-upload** to R2: `flashcards/FLASH-XXX/svg/diagram.svg`
3. **Markdown link inserted** in question textarea:
   ```
   ![image](https://canvas-chemistry-assets.r2.dev/flashcards/FLASH-XXX/svg/diagram.svg)
   ```
4. **Preview updates** with SVG rendered

### For Answers:

Same workflow as questions, but uploads to answer section.

### Supported File Types:
- SVG (recommended for diagrams)
- PNG, JPG, WebP (for photos)

---

## 🎨 UI Features

### Search & Filter

- **Search:** Type to search questions/answers/chapters
- **Category Filter:** Filter by Physical/Organic/Inorganic/JEE PYQ
- **Chapter Filter:** Filter by specific chapter

### Live Preview

- **Question Preview:** Shows formatted question with LaTeX
- **Answer Preview:** Shows formatted answer with LaTeX
- **Metadata Tags:** Shows category, chapter, topic, difficulty
- **Type Badge:** Shows "T/F" for True/False flashcards

### Keyboard Shortcuts

- **Enter in Chapter Manager:** Add new chapter
- **Click flashcard:** Edit
- **Trash icon:** Delete

---

## 📊 Example Use Cases

### Use Case 1: JEE 2026 PYQ Collection

```
Category: JEE PYQ
Chapter: JEE 2026 Jan Session
Topic: Thermodynamics
Question: Calculate the entropy change when 1 mol of ice melts at 0°C...
Answer: $$\Delta S = \frac{q_{rev}}{T} = \frac{6000}{273} = 21.98 \, J/K$$
```

### Use Case 2: Quick True/False Cards

```
Type: True/False
Category: Physical Chemistry
Chapter: Solutions
Question: Raoult's law is applicable to ideal solutions only.
Answer: True
```

### Use Case 3: Organic Reaction with SVG

```
Category: Organic Chemistry
Chapter: Aldehydes, Ketones & Acids
Question: Identify the product of this reaction:
[SVG diagram of reaction]
Answer: The product is benzaldehyde. Mechanism:
[SVG diagram of mechanism]
```

### Use Case 4: Campaign Flashcards

```
Category: JEE PYQ
Chapter: 100 Days to JEE - Day 1
Topic: Atomic Structure
Question: Calculate the wavelength of the first line in Balmer series...
```

---

## 🔧 Technical Details

### Data Structure

```typescript
{
  flashcard_id: "FLASH-1234567890",
  chapter: {
    id: "jee_2026_jan_session",  // Auto-generated from name
    name: "JEE 2026 Jan Session",
    category: "JEE PYQ"
  },
  topic: {
    name: "Thermodynamics",
    order: 0
  },
  question: "Calculate the entropy change...",
  answer: "$$\\Delta S = ...$$",
  metadata: {
    difficulty: "medium",
    tags: ["Thermodynamics", "JEE 2026 Jan Session"],
    source: "JEE Main",
    class_num: 12,
    flashcard_type: "standard"  // or "true-false"
  }
}
```

### API Endpoints

- `GET /api/v2/flashcards` - List flashcards
- `POST /api/v2/flashcards` - Create flashcard
- `PATCH /api/v2/flashcards/[id]` - Update flashcard
- `DELETE /api/v2/flashcards/[id]` - Delete flashcard

### SVG Upload

- Endpoint: `POST /api/v2/assets/upload`
- Storage: Cloudflare R2
- Path: `flashcards/{flashcard_id}/svg/{timestamp}_{name}_{uuid}.svg`

---

## 🎯 Best Practices

### Chapter Naming

**Good:**
- "JEE 2026 Jan Session"
- "NEET 2024"
- "Solutions"
- "100 Days to JEE - Day 1"

**Avoid:**
- "jee2026" (use proper capitalization)
- "Ch1" (use descriptive names)
- "Test" (use meaningful names)

### Question Writing

- Use LaTeX for math: `$$E = mc^2$$`
- Keep questions concise
- Add context if needed
- Use SVG for complex diagrams

### Answer Writing

- Provide complete explanations
- Use LaTeX for formulas
- Add diagrams where helpful
- For True/False: Just select True/False

### Tagging

- Tags auto-generated from topic + chapter
- Keep topic names consistent
- Use specific topics (e.g., "Raoult's Law" not "Solutions")

---

## 🐛 Troubleshooting

### "Failed to save flashcard"

**Cause:** Missing required fields
**Fix:** Ensure flashcard_id, question, answer, and chapter are filled

### "SVG upload failed"

**Cause:** File too large or wrong format
**Fix:** Ensure SVG < 5MB, or use PNG/JPG

### "Chapter not showing in filter"

**Cause:** No flashcards in that chapter yet
**Fix:** Create at least one flashcard in the chapter

### "Preview not updating"

**Cause:** LaTeX syntax error
**Fix:** Check LaTeX syntax (use `$$...$$` not `$...$`)

---

## 📈 Future Enhancements

1. **Bulk Import:** CSV upload for batch creation
2. **Duplicate Flashcard:** Clone existing flashcard
3. **Reorder Chapters:** Drag & drop chapter ordering
4. **Export:** Export flashcards to CSV/PDF
5. **Analytics:** View flashcard usage stats

---

## 🎓 Summary

**Admin Dashboard URL:**
- Local: `http://localhost:3000/crucible/admin/flashcards`
- Production: `https://canvasclasses.in/crucible/admin/flashcards`

**Key Features:**
- ✅ Split-view with live preview
- ✅ SVG drag & drop for questions and answers
- ✅ True/False flashcard type
- ✅ Flexible taxonomy (add any chapter)
- ✅ LaTeX & Markdown support
- ✅ Search & filter
- ✅ Real-time preview

**Taxonomy Approach:**
- ✅ **Flexible (Recommended):** Add chapters on the fly
- ❌ Fixed taxonomy: Not needed for flashcards

**Next Steps:**
1. Run migration script (see FLASHCARDS_MIGRATION_README.md)
2. Login as admin
3. Visit `/crucible/admin/flashcards`
4. Start creating flashcards!
