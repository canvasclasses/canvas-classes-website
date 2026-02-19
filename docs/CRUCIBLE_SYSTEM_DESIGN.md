# The Crucible - Professional System Design & Architecture
## Complete Redesign for Scalability, Reliability, and Asset Management

---

## 🔴 CURRENT SYSTEM ISSUES (Critical Analysis)

### 1. **Dual Source of Truth Problem**
- **Issue:** Both JSON files AND MongoDB exist, causing sync conflicts
- **Impact:** Changes in one place don't reflect in another
- **Root Cause:** No clear single source of truth

### 2. **Manual Sync Required**
- **Issue:** Requires running scripts to sync file system ↔ MongoDB
- **Impact:** Admin dashboard shows stale data until manual sync
- **Root Cause:** No automatic sync mechanism

### 3. **No Asset Management**
- **Issue:** SVG, images, audio files stored randomly with no tracking
- **Impact:** Broken links, lost files, no version control
- **Root Cause:** No centralized asset management system

### 4. **No Transaction Support**
- **Issue:** Deleting/updating questions can fail partially
- **Impact:** Data inconsistency between file system and MongoDB
- **Root Cause:** No atomic operations

### 5. **No Audit Trail**
- **Issue:** No history of who changed what and when
- **Impact:** Cannot track or revert changes
- **Root Cause:** No versioning system

### 6. **ID Reassignment Issues**
- **Issue:** Deleting questions breaks references and IDs
- **Impact:** Confusion, broken links, lost progress tracking
- **Root Cause:** Using sequential IDs instead of UUIDs

---

## ✅ PROPOSED PROFESSIONAL ARCHITECTURE

### **Core Principle: MongoDB as Single Source of Truth**

```
┌─────────────────────────────────────────────────────────────┐
│                     THE CRUCIBLE PLATFORM                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │ Admin Panel  │────────▶│   Next.js    │                  │
│  │  (React UI)  │         │  API Routes  │                  │
│  └──────────────┘         └──────┬───────┘                  │
│                                   │                           │
│                                   ▼                           │
│                          ┌────────────────┐                  │
│                          │   MongoDB      │◀─── Single       │
│                          │  (Primary DB)  │     Source       │
│                          └────────┬───────┘     of Truth     │
│                                   │                           │
│                    ┌──────────────┼──────────────┐           │
│                    ▼              ▼              ▼           │
│            ┌──────────┐   ┌──────────┐   ┌──────────┐       │
│            │Questions │   │  Assets  │   │  Audit   │       │
│            │Collection│   │Collection│   │   Logs   │       │
│            └──────────┘   └──────────┘   └──────────┘       │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Asset Storage (Cloudflare R2 / S3)             │ │
│  │  /assets/questions/{question-id}/                      │ │
│  │    ├── images/                                         │ │
│  │    ├── svg/                                            │ │
│  │    └── audio/                                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │    JSON Backups (Git-tracked, Read-only)               │ │
│  │    - Daily automated exports from MongoDB              │ │
│  │    - Version controlled for disaster recovery          │ │
│  │    - NEVER used as source of truth                     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 NEW DATABASE SCHEMA

### **1. Questions Collection**

```javascript
{
  // Primary Key - UUID (never changes, even if question is moved)
  _id: "uuid-v4-here", // e.g., "550e8400-e29b-41d4-a716-446655440000"
  
  // Display ID (can change, for human readability)
  display_id: "ATOM-001", // Generated dynamically based on chapter + sequence
  
  // Core Question Data
  question_text: {
    markdown: "What is the de Broglie wavelength...",
    latex_validated: true, // Automated validation flag
    last_validated_at: ISODate("2026-02-17T06:00:00Z")
  },
  
  // Question Type
  type: "NVT", // SCQ, MCQ, NVT, AR, MST, MTC
  
  // Options (for MCQ/SCQ)
  options: [
    {
      id: "opt-1",
      text: "Option A text",
      is_correct: true,
      assets: ["asset-uuid-1"] // References to Asset collection
    }
  ],
  
  // Answer (for NVT)
  answer: {
    integer_value: 5,
    decimal_value: 5.0,
    tolerance: 0.01,
    unit: "nm"
  },
  
  // Solution
  solution: {
    text_markdown: "**Step 1:** Understand the concept...",
    latex_validated: true,
    assets: {
      images: ["asset-uuid-2", "asset-uuid-3"],
      svg: ["asset-uuid-4"],
      audio: ["asset-uuid-5"]
    },
    video_url: "https://youtube.com/...",
    video_timestamp_start: 120
  },
  
  // Metadata
  metadata: {
    difficulty: "Medium",
    chapter_id: "chapter_atomic_structure",
    tags: [
      { tag_id: "TAG_DE_BROGLIE", weight: 0.7 },
      { tag_id: "TAG_WAVE_PARTICLE", weight: 0.3 }
    ],
    exam_source: {
      exam: "JEE Main",
      year: 2023,
      month: "Apr",
      day: 11,
      shift: "Evening",
      question_number: "Q54"
    },
    is_pyq: true,
    is_top_pyq: false
  },
  
  // Status & Quality Control
  status: "published", // draft, review, published, archived
  quality_score: 95, // 0-100, automated + manual review
  needs_review: false,
  review_notes: "",
  
  // Versioning & Audit
  version: 3,
  created_at: ISODate("2025-01-15T10:00:00Z"),
  created_by: "admin-user-id",
  updated_at: ISODate("2026-02-17T06:00:00Z"),
  updated_by: "admin-user-id",
  
  // Soft Delete (never actually delete questions)
  deleted_at: null,
  deleted_by: null,
  
  // Asset References (for cascade operations)
  asset_ids: ["asset-uuid-1", "asset-uuid-2", "asset-uuid-3"]
}
```

### **2. Assets Collection (NEW)**

```javascript
{
  _id: "asset-uuid-here",
  
  // Asset Type
  type: "image", // image, svg, audio, video
  
  // File Information
  file: {
    original_name: "diagram.svg",
    mime_type: "image/svg+xml",
    size_bytes: 45678,
    storage_path: "assets/questions/550e8400-e29b-41d4-a716-446655440000/svg/diagram.svg",
    cdn_url: "https://cdn.canvasclasses.com/assets/questions/550e8400.../diagram.svg",
    checksum: "sha256-hash-here" // For integrity verification
  },
  
  // Usage Tracking
  used_in: {
    questions: ["question-uuid-1", "question-uuid-2"],
    question_field: "solution.assets.svg" // Where it's used
  },
  
  // Metadata
  metadata: {
    alt_text: "Diagram showing de Broglie wavelength",
    caption: "Figure 1: Wave-particle duality",
    width: 800,
    height: 600,
    duration_seconds: 120 // For audio/video
  },
  
  // Versioning
  version: 1,
  previous_versions: ["asset-uuid-old-version"],
  
  // Audit
  created_at: ISODate("2026-02-17T06:00:00Z"),
  created_by: "admin-user-id",
  updated_at: ISODate("2026-02-17T06:00:00Z"),
  
  // Soft Delete
  deleted_at: null,
  
  // Processing Status (for audio/video)
  processing_status: "completed", // pending, processing, completed, failed
  processing_error: null
}
```

### **3. Audit Logs Collection (NEW)**

```javascript
{
  _id: "log-uuid",
  
  // What changed
  entity_type: "question", // question, asset, tag
  entity_id: "question-uuid",
  action: "update", // create, update, delete, restore
  
  // Changes
  changes: {
    field: "solution.text_markdown",
    old_value: "Old solution text...",
    new_value: "New solution text..."
  },
  
  // Who & When
  user_id: "admin-user-id",
  user_email: "admin@canvasclasses.com",
  timestamp: ISODate("2026-02-17T06:00:00Z"),
  
  // Context
  ip_address: "192.168.1.1",
  user_agent: "Mozilla/5.0...",
  
  // Rollback capability
  can_rollback: true,
  rollback_data: { /* snapshot of previous state */ }
}
```

### **4. Chapters Collection (NEW)**

```javascript
{
  _id: "chapter_atomic_structure",
  
  // Display Information
  name: "Atomic Structure",
  display_order: 1,
  
  // Question Sequence (for display_id generation)
  question_sequence: 146, // Auto-increments, used for ATOM-001, ATOM-002, etc.
  
  // Metadata
  class_level: "11",
  subject: "Chemistry",
  
  // Statistics (cached, updated via triggers)
  stats: {
    total_questions: 146,
    published_questions: 146,
    draft_questions: 0,
    avg_difficulty: "Medium",
    pyq_count: 120
  },
  
  // Status
  is_active: true,
  created_at: ISODate("2025-01-01T00:00:00Z"),
  updated_at: ISODate("2026-02-17T06:00:00Z")
}
```

---

## 🔄 SYNC & CONSISTENCY STRATEGY

### **Approach: MongoDB as Single Source of Truth**

```
┌─────────────────────────────────────────────────────────┐
│  WRITE OPERATIONS (Admin Panel)                         │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. User creates/updates question in Admin UI            │
│  2. Next.js API validates data                           │
│  3. MongoDB transaction begins                           │
│  4. Write to MongoDB (questions + audit log)             │
│  5. Upload assets to storage (if any)                    │
│  6. Update asset references in MongoDB                   │
│  7. Transaction commits                                  │
│  8. Return success to UI                                 │
│                                                           │
│  ❌ NO file system writes during normal operations       │
│                                                           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  READ OPERATIONS (Admin Panel + Student App)            │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. Query MongoDB directly                               │
│  2. Use MongoDB indexes for fast queries                 │
│  3. Cache results in Redis (optional, for scale)         │
│  4. Return data to UI                                    │
│                                                           │
│  ❌ NO file system reads                                 │
│                                                           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  BACKUP OPERATIONS (Automated, Daily)                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. Cron job runs daily at 2 AM                          │
│  2. Export MongoDB to JSON (read-only backup)            │
│  3. Save to /backups/YYYY-MM-DD/questions.json           │
│  4. Commit to Git for version control                    │
│  5. Upload to S3 for disaster recovery                   │
│                                                           │
│  ✅ Backups are READ-ONLY, never used as source          │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### **Benefits:**
1. ✅ **No sync conflicts** - Single source of truth
2. ✅ **Atomic operations** - MongoDB transactions ensure consistency
3. ✅ **Real-time updates** - Changes reflect immediately
4. ✅ **Audit trail** - Every change is logged
5. ✅ **Disaster recovery** - Daily Git-tracked backups

---

## 🎨 ASSET MANAGEMENT SYSTEM

### **Asset Storage Structure**

```
Cloudflare R2 / AWS S3 Bucket: canvas-classes-assets
│
├── questions/
│   ├── {question-uuid}/
│   │   ├── images/
│   │   │   ├── diagram-1.png
│   │   │   └── graph-2.jpg
│   │   ├── svg/
│   │   │   ├── molecular-structure.svg
│   │   │   └── energy-diagram.svg
│   │   └── audio/
│   │       ├── explanation-1.mp3
│   │       └── explanation-2.wav
│   │
│   └── {another-question-uuid}/
│       └── ...
│
└── shared/ (for reusable assets)
    ├── icons/
    ├── templates/
    └── common-diagrams/
```

### **Asset Upload Flow**

```javascript
// 1. User uploads file in Admin UI
async function uploadAsset(file, questionId, assetType) {
  // Validate file
  const validation = validateFile(file, assetType);
  if (!validation.valid) throw new Error(validation.error);
  
  // Generate UUID for asset
  const assetId = uuidv4();
  
  // Generate storage path
  const storagePath = `questions/${questionId}/${assetType}/${assetId}-${file.name}`;
  
  // Upload to cloud storage
  const cdnUrl = await uploadToCloudStorage(file, storagePath);
  
  // Create asset record in MongoDB
  const asset = await Asset.create({
    _id: assetId,
    type: assetType,
    file: {
      original_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      storage_path: storagePath,
      cdn_url: cdnUrl,
      checksum: await calculateChecksum(file)
    },
    used_in: {
      questions: [questionId],
      question_field: 'solution.assets.images'
    },
    created_at: new Date(),
    created_by: currentUser.id
  });
  
  return asset;
}
```

### **Asset Cleanup (Garbage Collection)**

```javascript
// Automated job runs weekly
async function cleanupUnusedAssets() {
  // Find assets not referenced by any question
  const unusedAssets = await Asset.find({
    'used_in.questions': { $size: 0 },
    created_at: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Older than 30 days
  });
  
  for (const asset of unusedAssets) {
    // Soft delete
    await Asset.updateOne(
      { _id: asset._id },
      { $set: { deleted_at: new Date() } }
    );
    
    // Optionally move to archive storage (cheaper tier)
    await archiveAsset(asset.file.storage_path);
  }
}
```

---

## 🔐 DATA INTEGRITY & VALIDATION

### **1. Schema Validation (MongoDB Level)**

```javascript
// MongoDB Schema Validation
db.createCollection("questions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "question_text", "type", "solution", "metadata", "status"],
      properties: {
        _id: { bsonType: "string", pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$" },
        question_text: {
          bsonType: "object",
          required: ["markdown"],
          properties: {
            markdown: { bsonType: "string", minLength: 10 },
            latex_validated: { bsonType: "bool" }
          }
        },
        type: { enum: ["SCQ", "MCQ", "NVT", "AR", "MST", "MTC"] },
        status: { enum: ["draft", "review", "published", "archived"] }
      }
    }
  }
});
```

### **2. Application-Level Validation**

```javascript
// Zod Schema for TypeScript validation
import { z } from 'zod';

const QuestionSchema = z.object({
  _id: z.string().uuid(),
  display_id: z.string().regex(/^[A-Z]{4}-\d{3}$/),
  question_text: z.object({
    markdown: z.string().min(10),
    latex_validated: z.boolean()
  }),
  type: z.enum(['SCQ', 'MCQ', 'NVT', 'AR', 'MST', 'MTC']),
  solution: z.object({
    text_markdown: z.string().min(20),
    latex_validated: z.boolean(),
    assets: z.object({
      images: z.array(z.string().uuid()).optional(),
      svg: z.array(z.string().uuid()).optional(),
      audio: z.array(z.string().uuid()).optional()
    }).optional()
  }),
  metadata: z.object({
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    chapter_id: z.string(),
    tags: z.array(z.object({
      tag_id: z.string(),
      weight: z.number().min(0).max(1)
    }))
  }),
  status: z.enum(['draft', 'review', 'published', 'archived'])
});
```

### **3. Automated LaTeX Validation**

```javascript
// Run on every question save
async function validateLatex(text) {
  const issues = [];
  
  // Check for common LaTeX errors
  if (text.includes('$$')) {
    issues.push('Use $ $ instead of $$');
  }
  
  if (/\$[^\s]/.test(text) || /[^\s]\$/.test(text)) {
    issues.push('Missing spaces around $ delimiters');
  }
  
  // Use KaTeX to validate rendering
  try {
    katex.renderToString(extractLatex(text), { throwOnError: true });
  } catch (error) {
    issues.push(`LaTeX rendering error: ${error.message}`);
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}
```

---

## 📈 SCALABILITY CONSIDERATIONS

### **Database Indexes**

```javascript
// Questions Collection Indexes
db.questions.createIndex({ "metadata.chapter_id": 1, "status": 1 });
db.questions.createIndex({ "metadata.tags.tag_id": 1 });
db.questions.createIndex({ "metadata.exam_source.year": 1, "metadata.exam_source.exam": 1 });
db.questions.createIndex({ "status": 1, "created_at": -1 });
db.questions.createIndex({ "display_id": 1 }, { unique: true });
db.questions.createIndex({ "deleted_at": 1 }); // For soft deletes

// Assets Collection Indexes
db.assets.createIndex({ "used_in.questions": 1 });
db.assets.createIndex({ "type": 1, "deleted_at": 1 });
db.assets.createIndex({ "file.checksum": 1 }); // Detect duplicates

// Audit Logs Indexes
db.audit_logs.createIndex({ "entity_id": 1, "timestamp": -1 });
db.audit_logs.createIndex({ "user_id": 1, "timestamp": -1 });
db.audit_logs.createIndex({ "timestamp": -1 }); // TTL index for cleanup
```

### **Caching Strategy (Optional, for 10,000+ questions)**

```javascript
// Redis caching layer
const cache = {
  // Cache frequently accessed questions
  async getQuestion(id) {
    const cached = await redis.get(`question:${id}`);
    if (cached) return JSON.parse(cached);
    
    const question = await Question.findById(id);
    await redis.setex(`question:${id}`, 3600, JSON.stringify(question));
    return question;
  },
  
  // Invalidate cache on update
  async invalidateQuestion(id) {
    await redis.del(`question:${id}`);
  }
};
```

---

## 🚀 MIGRATION STRATEGY

### **Phase 1: Preparation (Week 1)**

1. **Backup Everything**
   - Export all current JSON files to Git
   - Take MongoDB snapshot
   - Document current state

2. **Set Up New Collections**
   - Create new MongoDB collections with schemas
   - Set up indexes
   - Configure validation rules

3. **Set Up Asset Storage**
   - Configure Cloudflare R2 / AWS S3
   - Set up CDN
   - Test upload/download

### **Phase 2: Data Migration (Week 2)**

```javascript
// Migration Script
async function migrateToNewSystem() {
  console.log('Starting migration...');
  
  // 1. Migrate Questions
  const oldQuestions = await OldQuestionModel.find({});
  
  for (const oldQ of oldQuestions) {
    const newQuestion = {
      _id: uuidv4(), // Generate new UUID
      display_id: oldQ.id, // Keep old ID as display ID
      question_text: {
        markdown: oldQ.textMarkdown,
        latex_validated: false // Will be validated later
      },
      type: oldQ.questionType,
      options: oldQ.options,
      answer: oldQ.integerAnswer ? {
        integer_value: parseInt(oldQ.integerAnswer),
        decimal_value: parseFloat(oldQ.integerAnswer)
      } : null,
      solution: {
        text_markdown: oldQ.solution.textSolutionLatex,
        latex_validated: false,
        assets: { images: [], svg: [], audio: [] }
      },
      metadata: {
        difficulty: oldQ.difficulty,
        chapter_id: oldQ.chapterId,
        tags: oldQ.conceptTags || [],
        exam_source: parseExamSource(oldQ.examSource),
        is_pyq: oldQ.isPYQ,
        is_top_pyq: oldQ.isTopPYQ
      },
      status: 'published',
      quality_score: 50, // Default, will be reviewed
      version: 1,
      created_at: new Date(),
      created_by: 'migration-script',
      updated_at: new Date(),
      deleted_at: null,
      asset_ids: []
    };
    
    await NewQuestionModel.create(newQuestion);
    console.log(`Migrated: ${oldQ.id} -> ${newQuestion._id}`);
  }
  
  // 2. Validate all LaTeX
  await validateAllLatex();
  
  // 3. Generate display IDs
  await regenerateDisplayIds();
  
  console.log('Migration complete!');
}
```

### **Phase 3: Testing (Week 3)**

1. **Verify Data Integrity**
   - Compare old vs new question counts
   - Spot-check 100 random questions
   - Validate all LaTeX rendering

2. **Test Admin Panel**
   - Create new questions
   - Update existing questions
   - Delete and restore questions
   - Upload assets

3. **Performance Testing**
   - Load 1000 questions in admin panel
   - Test search and filters
   - Measure query response times

### **Phase 4: Deployment (Week 4)**

1. **Deploy New System**
   - Deploy to staging environment
   - Run final tests
   - Deploy to production

2. **Monitor**
   - Watch error logs
   - Monitor MongoDB performance
   - Track asset upload success rate

3. **Cleanup**
   - Archive old JSON files
   - Remove old sync scripts
   - Update documentation

---

## 🎯 RECOMMENDED DECISION

### **YES - Start Fresh with New System**

**Reasons:**
1. ✅ Current system has fundamental architectural flaws
2. ✅ Fixing incrementally will create more technical debt
3. ✅ New system is future-proof for 10,000+ questions
4. ✅ Proper asset management from day one
5. ✅ Audit trail and versioning built-in
6. ✅ Clean migration path exists

**Timeline:** 4 weeks
**Risk:** Low (with proper backups and testing)
**ROI:** High (saves months of debugging later)

---

## 📋 IMPLEMENTATION CHECKLIST

### **Week 1: Foundation**
- [ ] Set up new MongoDB collections with schemas
- [ ] Configure Cloudflare R2 / AWS S3
- [ ] Create backup of all current data
- [ ] Write migration scripts
- [ ] Set up new API routes

### **Week 2: Migration**
- [ ] Run migration script (questions)
- [ ] Migrate assets to cloud storage
- [ ] Validate all LaTeX
- [ ] Generate display IDs
- [ ] Create audit log entries

### **Week 3: Admin Panel Updates**
- [ ] Update admin panel to use new API
- [ ] Implement asset upload UI
- [ ] Add LaTeX validation feedback
- [ ] Add audit log viewer
- [ ] Test all CRUD operations

### **Week 4: Testing & Deployment**
- [ ] End-to-end testing
- [ ] Performance testing
- [ ] Deploy to staging
- [ ] Final verification
- [ ] Deploy to production
- [ ] Monitor and iterate

---

## 💡 ADDITIONAL RECOMMENDATIONS

### **1. Automated Quality Checks**
- Run LaTeX validation on every save
- Check for duplicate questions (similarity detection)
- Validate answer correctness (where possible)
- Flag questions missing tags or metadata

### **2. Version Control for Questions**
- Store previous versions in separate collection
- Allow rollback to any previous version
- Show diff between versions in admin panel

### **3. Collaborative Editing**
- Add "draft" status for work-in-progress questions
- Allow multiple admins to review before publishing
- Add comments/notes on questions

### **4. Analytics & Insights**
- Track which questions students struggle with
- Identify questions with high skip rates
- Suggest similar questions for practice

### **5. API Rate Limiting**
- Protect MongoDB from excessive queries
- Implement pagination for large result sets
- Use cursor-based pagination for efficiency

---

## 🎓 CONCLUSION

The proposed architecture solves all current issues:

| Issue | Current System | New System |
|-------|---------------|------------|
| Sync conflicts | ❌ Dual source of truth | ✅ Single source (MongoDB) |
| Stale data | ❌ Manual sync required | ✅ Real-time updates |
| Asset management | ❌ No system | ✅ Centralized with tracking |
| Data loss | ❌ No versioning | ✅ Full audit trail |
| Scalability | ❌ Limited | ✅ Designed for 10,000+ questions |
| ID conflicts | ❌ Sequential IDs | ✅ UUIDs + display IDs |

**Recommendation:** Proceed with full migration to new system. The investment of 4 weeks now will save months of debugging and ensure The Crucible can scale to thousands of questions without issues.

