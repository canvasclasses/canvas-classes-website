# Taxonomy vs MongoDB Chapters: Architecture Analysis & Recommendations

## Current State Analysis

### 1. **What We Have**

**Taxonomy (Code-based - Single Source of Truth)**
- Location: `/app/crucible/admin/taxonomy/taxonomyData_from_csv.ts`
- **27 chapters** (Class 11 + Class 12)
- Includes: `ch12_carbonyl` (merged chapter)
- Does NOT include: `ch12_aldehydes`, `ch12_carboxylic` (deleted after merge)

**MongoDB `chapters` Collection (Database - Legacy)**
- **26 chapters**
- Includes: `ch12_aldehydes`, `ch12_carboxylic` (old separate chapters)
- Does NOT include: `ch12_carbonyl` (merged chapter)
- Also missing: `ch12_prac_phys` exists in MongoDB but not in taxonomy

### 2. **The Mismatch**

```
Taxonomy (27):          MongoDB (26):
✓ ch12_carbonyl    ←→   ✗ ch12_aldehydes
                   ←→   ✗ ch12_carboxylic
                   ←→   ✓ ch12_prac_phys (missing in taxonomy)
```

---

## Technical Implications & Risks

### **Current Architecture (Hybrid State)**

```
┌─────────────────────────────────────────────────────────┐
│                    LIVE APPLICATION                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend Components:                                    │
│  ├─ CrucibleUnified.tsx ────────┐                       │
│  ├─ NewCrucibleHome.tsx ────────┤                       │
│  └─ QuestionAdmin.tsx ──────────┼─→ taxonomyData_from_csv.ts (27 chapters)
│                                  │                       │
│  API Endpoints:                  │                       │
│  └─ /api/v2/chapters ───────────┘                       │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Question Editor:                                        │
│  └─ /crucible/admin/page.tsx ──→ taxonomyData_from_csv.ts (27 chapters)
│                                                          │
│  Question Creation:                                      │
│  └─ POST /api/v2/questions ─────→ Chapter.findById()    │
│                                    └─→ MongoDB chapters (26 chapters)
│                                        ⚠️  MISMATCH!     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  MongoDB Collections:                                    │
│  ├─ chapters (26 docs) ──────────────────────────────── STALE
│  ├─ taxonomy (251 docs) ─────────────────────────────── BACKUP
│  └─ questions_v2 (metadata.chapter_id) ────────────────→ Uses taxonomy IDs
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### **Specific Risks Identified**

#### 🔴 **Critical Issues**

1. **DELETE API Failures** (Already Fixed)
   - When deleting questions with `metadata.chapter_id = 'ch12_carbonyl'`
   - `Chapter.findByIdAndUpdate('ch12_carbonyl')` returns null
   - Causes silent failures or HTTP 500 errors
   - **Status:** Fixed with try-catch wrapper

2. **Question Creation for ch12_carbonyl**
   - POST `/api/v2/questions` tries to increment `chapter.question_sequence`
   - Lookup fails for `ch12_carbonyl` → potential sequence number conflicts
   - **Risk:** Display IDs might collide or restart from 001

3. **Chapter Stats Inaccuracy**
   - MongoDB `chapters` collection stores `stats.total_questions`, `stats.draft_questions`, etc.
   - These stats are **never updated** for `ch12_carbonyl` (doesn't exist in DB)
   - Stats for `ch12_aldehydes` and `ch12_carboxylic` are **frozen** (chapters deleted from taxonomy)
   - **Impact:** Analytics/dashboards show incorrect counts

#### 🟡 **Medium Issues**

4. **Data Migration Complexity**
   - 260 questions have `metadata.chapter_id = 'ch12_carbonyl'`
   - If we sync MongoDB, we need to handle these questions carefully
   - Cannot simply delete old chapters without orphaning questions

5. **Future Chapter Merges/Splits**
   - Current architecture makes it **hard to evolve** the taxonomy
   - Every change requires manual MongoDB updates + code changes
   - No automated migration path

#### 🟢 **Low Issues (Already Mitigated)**

6. **Frontend Display**
   - All frontend components read from `taxonomyData_from_csv.ts`
   - No user-facing impact currently
   - **Status:** Working correctly

---

## Root Cause: Dual Source of Truth Anti-Pattern

The fundamental problem is **architectural debt** from having two sources of truth:

```
Code (taxonomyData_from_csv.ts)  ←→  Database (chapters collection)
         ↓                                      ↓
    AUTHORITATIVE                          STALE/UNUSED
```

This violates the **Single Source of Truth (SSOT)** principle in system design.

---

## Recommended Solutions (3 Options)

### **Option 1: Code as SSOT (Recommended) ✅**

**Approach:** Make `taxonomyData_from_csv.ts` the **only** source of truth. Remove all MongoDB dependencies.

**Implementation:**

1. **Remove MongoDB `chapters` collection dependency**
   ```typescript
   // BEFORE (in POST /api/v2/questions)
   const chapter = await Chapter.findById(data.metadata.chapter_id);
   const sequence = chapter.question_sequence + 1;
   
   // AFTER
   import { TAXONOMY_FROM_CSV } from '@/app/crucible/admin/taxonomy/taxonomyData_from_csv';
   
   const chapterExists = TAXONOMY_FROM_CSV.find(
     node => node.type === 'chapter' && node.id === data.metadata.chapter_id
   );
   if (!chapterExists) throw new Error('Invalid chapter_id');
   
   // Generate display_id client-side (already done in admin dashboard)
   // OR use a Redis counter for sequence numbers
   ```

2. **Migrate chapter stats to Redis or in-memory cache**
   ```typescript
   // Store stats in Redis with TTL
   await redis.set(`chapter:${chapterId}:stats`, JSON.stringify({
     total_questions: count,
     draft_questions: draftCount,
     published_questions: pubCount
   }), 'EX', 3600); // 1 hour cache
   
   // Recompute on-demand from questions_v2 collection
   const stats = await QuestionV2.aggregate([
     { $match: { 'metadata.chapter_id': chapterId, deleted_at: null } },
     { $group: { 
       _id: '$status', 
       count: { $sum: 1 } 
     }}
   ]);
   ```

3. **Keep MongoDB `chapters` as backup only**
   - Rename collection to `chapters_backup`
   - Document that it's for historical reference only
   - Never query it in production code

**Pros:**
- ✅ True single source of truth
- ✅ No sync issues
- ✅ Easy to version control (Git tracks taxonomy changes)
- ✅ Fast reads (no DB query for chapter list)
- ✅ Aligns with current architecture (already 90% there)

**Cons:**
- ❌ Requires Redis or alternative for stats caching
- ❌ Display ID sequence needs new strategy (client-side generation or Redis counter)

---

### **Option 2: MongoDB as SSOT**

**Approach:** Sync `taxonomyData_from_csv.ts` from MongoDB. Make DB authoritative.

**Implementation:**

1. **Create migration script to sync taxonomy → MongoDB**
   ```javascript
   // Sync ch12_carbonyl to MongoDB
   await Chapter.create({
     _id: 'ch12_carbonyl',
     name: 'Aldehydes, Ketones and Carboxylic Acids',
     display_order: 23,
     question_sequence: 260, // current max
     stats: { total_questions: 260, draft_questions: 0, published_questions: 260 }
   });
   
   // Delete old chapters
   await Chapter.deleteMany({ _id: { $in: ['ch12_aldehydes', 'ch12_carboxylic'] } });
   ```

2. **Auto-generate `taxonomyData_from_csv.ts` from MongoDB**
   ```typescript
   // POST /api/v2/taxonomy/save now writes to MongoDB first
   // Then regenerates taxonomyData_from_csv.ts from DB
   const chapters = await Chapter.find().sort({ display_order: 1 });
   const taxonomy = await Taxonomy.find();
   
   const fileContent = generateTaxonomyFile(chapters, taxonomy);
   await fs.writeFile('taxonomyData_from_csv.ts', fileContent);
   ```

3. **Change all code to read from MongoDB**
   ```typescript
   // /api/v2/chapters already does this
   // But frontend components would need to fetch via API instead of import
   ```

**Pros:**
- ✅ Database is authoritative (traditional approach)
- ✅ Stats and sequences work natively
- ✅ Easier to build admin UI for taxonomy editing

**Cons:**
- ❌ Requires DB query for every chapter list fetch
- ❌ Harder to version control taxonomy changes
- ❌ Requires major refactor of frontend components
- ❌ Slower performance (network + DB latency)

---

### **Option 3: Hybrid with Sync Script (Current State - Not Recommended)**

**Approach:** Keep both, but add automated sync.

**Implementation:**
- Add a cron job or GitHub Action to sync taxonomy → MongoDB
- Run on every taxonomy change

**Pros:**
- ✅ Minimal code changes

**Cons:**
- ❌ Still dual source of truth
- ❌ Sync can fail or drift
- ❌ Complexity increases over time
- ❌ Doesn't solve the root problem

---

## **Final Recommendation: Option 1 (Code as SSOT)**

### Why This is the Best Approach

1. **You're already 90% there** - Most code reads from `taxonomyData_from_csv.ts`
2. **Performance** - No DB queries for chapter lists
3. **Version Control** - Git tracks all taxonomy changes
4. **Simplicity** - One source of truth, no sync needed
5. **Modern Architecture** - Aligns with JAMstack principles

### Migration Plan (Step-by-Step)

#### **Phase 1: Immediate Fixes (Already Done)**
- ✅ Wrap Chapter stats updates in try-catch (DELETE API)
- ✅ Fix display_id prefix mapping for ch12_carbonyl

#### **Phase 2: Remove MongoDB Dependencies (1-2 hours)**

**Step 1:** Update POST `/api/v2/questions` route
```typescript
// Remove Chapter.findById() dependency
// Validate chapter_id against TAXONOMY_FROM_CSV instead
```

**Step 2:** Update PATCH `/api/v2/questions/[id]` route
```typescript
// Remove Chapter stats update (already wrapped in try-catch)
// Delete the entire stats update block
```

**Step 3:** Implement stats caching
```typescript
// Option A: Compute on-demand (simple, no cache)
export async function GET(request: NextRequest) {
  const chapterId = searchParams.get('chapter_id');
  const stats = await QuestionV2.aggregate([
    { $match: { 'metadata.chapter_id': chapterId, deleted_at: null } },
    { $facet: {
      total: [{ $count: 'count' }],
      byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }]
    }}
  ]);
  // Return computed stats
}

// Option B: Use Redis cache with 1-hour TTL
```

#### **Phase 3: Cleanup (30 minutes)**

**Step 1:** Rename MongoDB collection
```javascript
db.chapters.renameCollection('chapters_backup_20260301');
```

**Step 2:** Add documentation
```typescript
// In taxonomyData_from_csv.ts
/**
 * SINGLE SOURCE OF TRUTH for chapter taxonomy.
 * 
 * MongoDB `chapters_backup_*` collection exists for historical reference only.
 * DO NOT query it in production code.
 * 
 * To add/modify chapters:
 * 1. Edit this file directly, OR
 * 2. Use Taxonomy Dashboard at /crucible/admin/taxonomy
 */
```

**Step 3:** Update README
```markdown
## Taxonomy Architecture

- **Source of Truth:** `/app/crucible/admin/taxonomy/taxonomyData_from_csv.ts`
- **Database:** MongoDB `questions_v2` collection stores `metadata.chapter_id` references
- **Stats:** Computed on-demand from questions collection (no caching currently)
```

#### **Phase 4: Testing (30 minutes)**

1. Create new question for ch12_carbonyl → verify display_id generation
2. Delete question → verify no errors
3. Update question chapter → verify stats recompute correctly
4. Load frontend → verify chapter lists display correctly

---

## Conclusion

The mismatch exists because of an **incomplete migration** from MongoDB-based taxonomy to code-based taxonomy. The solution is to **complete the migration** by removing all MongoDB dependencies and making `taxonomyData_from_csv.ts` the single source of truth.

This approach:
- ✅ Eliminates sync issues permanently
- ✅ Improves performance (no DB queries for chapter lists)
- ✅ Simplifies architecture (one source of truth)
- ✅ Makes taxonomy changes version-controlled
- ✅ Prevents future conflicts

**Estimated Total Time:** 2-3 hours for complete implementation and testing.

**Risk Level:** Low (most code already uses taxonomyData_from_csv.ts)

---

## Next Steps

1. Review this analysis
2. Approve Option 1 (Code as SSOT)
3. I'll implement Phase 2 (remove MongoDB dependencies)
4. Test thoroughly
5. Deploy with confidence

Let me know if you'd like me to proceed with the implementation.
