# The Crucible - Migration Action Plan

## 🎯 EXECUTIVE SUMMARY

**Current Problem:** Dual source of truth (JSON + MongoDB) causing sync issues, no asset management, no audit trail, data loss risks.

**Solution:** Migrate to MongoDB-only architecture with proper asset management, versioning, and atomic operations.

**Timeline:** 4 weeks

**Risk Level:** Low (with proper backups)

**Expected Outcome:** Scalable to 10,000+ questions, zero sync issues, professional asset management

---

## ✅ MY RECOMMENDATION: START FRESH

### Why Start Fresh?

1. **Current system is fundamentally broken**
   - Dual source of truth creates unsolvable sync conflicts
   - No way to track assets (SVG, audio, images)
   - No audit trail or versioning
   - Sequential IDs break when deleting questions

2. **Incremental fixes won't work**
   - Each fix creates new technical debt
   - Band-aid solutions don't scale
   - Will face same issues at 1000+ questions

3. **New system is future-proof**
   - MongoDB as single source of truth
   - Proper asset management with CDN
   - Full audit trail and versioning
   - UUID-based IDs that never change
   - Designed for 10,000+ questions

---

## 🏗️ NEW ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────┐
│                   ADMIN PANEL (React)                    │
│                                                           │
│  Create/Edit/Delete Questions → Upload Assets            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              NEXT.JS API ROUTES (Server)                 │
│                                                           │
│  • Validation (Zod schemas)                              │
│  • LaTeX validation (automated)                          │
│  • Transaction management                                │
│  • Asset upload handling                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  MONGODB (Single Source)                 │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Questions   │  │    Assets    │  │  Audit Logs  │  │
│  │  Collection  │  │  Collection  │  │  Collection  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
│  • UUID primary keys (never change)                      │
│  • Display IDs (ATOM-001, MOLE-001)                      │
│  • Full versioning                                       │
│  • Soft deletes                                          │
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         CLOUDFLARE R2 / AWS S3 (Asset Storage)          │
│                                                           │
│  /assets/questions/{uuid}/                               │
│    ├── images/                                           │
│    ├── svg/                                              │
│    └── audio/                                            │
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│           JSON BACKUPS (Git, Read-Only)                  │
│                                                           │
│  • Daily automated exports from MongoDB                  │
│  • Version controlled for disaster recovery              │
│  • NEVER used as source of truth                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 KEY IMPROVEMENTS

### 1. **UUID-Based IDs**
```javascript
// OLD SYSTEM (breaks when deleting)
ATOM-001, ATOM-002, ATOM-003
// Delete ATOM-002 → Need to renumber everything

// NEW SYSTEM (never breaks)
_id: "550e8400-e29b-41d4-a716-446655440000" // UUID (permanent)
display_id: "ATOM-001" // Human-readable (can change)
```

### 2. **Asset Management**
```javascript
// OLD SYSTEM
// Images stored randomly, no tracking, broken links

// NEW SYSTEM
{
  _id: "asset-uuid",
  type: "svg",
  file: {
    storage_path: "assets/questions/550e8400.../svg/diagram.svg",
    cdn_url: "https://cdn.canvasclasses.com/.../diagram.svg"
  },
  used_in: {
    questions: ["question-uuid-1", "question-uuid-2"]
  }
}
```

### 3. **Audit Trail**
```javascript
// NEW SYSTEM - Every change is logged
{
  entity_id: "question-uuid",
  action: "update",
  changes: {
    field: "solution.text_markdown",
    old_value: "Old solution...",
    new_value: "New solution..."
  },
  user_id: "admin-user-id",
  timestamp: "2026-02-17T06:00:00Z",
  can_rollback: true
}
```

### 4. **Automated LaTeX Validation**
```javascript
// Runs on every save
async function validateLatex(text) {
  // Check for common errors
  // Validate rendering with KaTeX
  // Return issues to admin immediately
}
```

---

## 📅 4-WEEK MIGRATION PLAN

### **Week 1: Foundation Setup**

**Day 1-2: Database Setup**
- [ ] Create new MongoDB collections (questions, assets, audit_logs, chapters)
- [ ] Set up schema validation
- [ ] Create indexes for performance
- [ ] Test CRUD operations

**Day 3-4: Asset Storage Setup**
- [ ] Configure Cloudflare R2 or AWS S3
- [ ] Set up CDN
- [ ] Test upload/download
- [ ] Implement asset cleanup job

**Day 5: Backup & Migration Scripts**
- [ ] Backup all current JSON files to Git
- [ ] Take MongoDB snapshot
- [ ] Write migration scripts
- [ ] Test migration on sample data

---

### **Week 2: Data Migration**

**Day 1-2: Question Migration**
- [ ] Run migration script for all questions
- [ ] Generate UUIDs for all questions
- [ ] Preserve old IDs as display_ids
- [ ] Verify data integrity

**Day 3: Asset Migration**
- [ ] Extract all image URLs from questions
- [ ] Upload to cloud storage
- [ ] Create asset records in MongoDB
- [ ] Update question references

**Day 4: Validation**
- [ ] Run LaTeX validation on all questions
- [ ] Flag questions with issues
- [ ] Generate quality scores
- [ ] Create initial audit log entries

**Day 5: Verification**
- [ ] Compare old vs new question counts
- [ ] Spot-check 100 random questions
- [ ] Verify all assets are accessible
- [ ] Test rollback capability

---

### **Week 3: Admin Panel Updates**

**Day 1-2: API Routes**
- [ ] Create new API routes for questions
- [ ] Implement asset upload endpoints
- [ ] Add LaTeX validation endpoint
- [ ] Add audit log viewer endpoint

**Day 3-4: UI Updates**
- [ ] Update admin panel to use new API
- [ ] Add asset upload UI (drag & drop)
- [ ] Add LaTeX validation feedback
- [ ] Add audit log viewer
- [ ] Add version history viewer

**Day 5: Testing**
- [ ] Test creating new questions
- [ ] Test updating questions
- [ ] Test deleting questions (soft delete)
- [ ] Test asset uploads
- [ ] Test rollback functionality

---

### **Week 4: Testing & Deployment**

**Day 1-2: Comprehensive Testing**
- [ ] End-to-end testing (all workflows)
- [ ] Performance testing (1000+ questions)
- [ ] Load testing (concurrent users)
- [ ] Edge case testing

**Day 3: Staging Deployment**
- [ ] Deploy to staging environment
- [ ] Run smoke tests
- [ ] Fix any issues
- [ ] Get stakeholder approval

**Day 4: Production Deployment**
- [ ] Deploy to production
- [ ] Monitor error logs
- [ ] Monitor MongoDB performance
- [ ] Track asset upload success rate

**Day 5: Cleanup & Documentation**
- [ ] Archive old JSON files
- [ ] Remove old sync scripts
- [ ] Update documentation
- [ ] Train team on new system

---

## 🚨 CRITICAL: WHAT TO DO RIGHT NOW

### **Option A: Full Migration (Recommended)**

1. **Backup everything** (30 minutes)
   ```bash
   # Backup current state
   node scripts/backup_all_data.js
   git add data/questions/
   git commit -m "Backup before migration"
   ```

2. **Start Week 1 tasks** (this week)
   - Set up new MongoDB collections
   - Configure asset storage
   - Write migration scripts

3. **Timeline:** 4 weeks to completion

### **Option B: Quick Fix (Not Recommended)**

If you need to keep working with current system:

1. **Force sync everything to MongoDB**
   ```bash
   node scripts/sync_all_chapters_to_mongo.js
   ```

2. **Stop using JSON files** for writes
   - Only write to MongoDB
   - JSON files become read-only backups

3. **Accept limitations:**
   - Still no asset management
   - Still no audit trail
   - Still no versioning
   - Will need full migration eventually

---

## 💰 COST ESTIMATE

### **Development Time**
- Week 1: 40 hours (database + asset setup)
- Week 2: 40 hours (migration)
- Week 3: 40 hours (admin panel updates)
- Week 4: 40 hours (testing + deployment)
- **Total:** 160 hours

### **Infrastructure Costs (Monthly)**
- MongoDB Atlas (M10): $57/month
- Cloudflare R2 Storage (100GB): $1.50/month
- CDN Bandwidth (1TB): $0.90/month
- **Total:** ~$60/month

### **One-Time Costs**
- Migration testing: 20 hours
- Documentation: 10 hours
- Training: 5 hours
- **Total:** 35 hours

---

## ✅ SUCCESS CRITERIA

After migration, you should be able to:

1. ✅ **Add 100 questions** without any sync issues
2. ✅ **Delete questions** without breaking IDs or references
3. ✅ **Upload SVG/audio** and see them render immediately
4. ✅ **View audit trail** of all changes
5. ✅ **Rollback changes** to any previous version
6. ✅ **Search 1000+ questions** in under 1 second
7. ✅ **Never lose data** even if admin panel crashes

---

## 🎯 MY FINAL RECOMMENDATION

**START FRESH WITH NEW SYSTEM**

**Why?**
- Current system cannot be fixed incrementally
- New system solves all current problems
- Future-proof for 10,000+ questions
- Professional-grade architecture
- Clean migration path exists

**Timeline:** 4 weeks

**Risk:** Low (with proper backups and testing)

**ROI:** Saves months of debugging and ensures scalability

**Next Step:** Review this plan, approve, and I'll start Week 1 tasks immediately.

