# 🤖 Automated Question Ingestion Pipeline

Fully automated system for extracting chemistry questions from PDF screenshots, generating solutions, and inserting into MongoDB database.

## 🎯 Overview

This pipeline processes PDF screenshots of chemistry questions and:
1. **Extracts** question text, options, answers using Claude AI
2. **Detects** diagrams and chemical structures with bounding boxes
3. **Converts** diagrams to SVG using your Mac Automator
4. **Generates** detailed step-by-step solutions
5. **Validates** LaTeX formatting and completeness
6. **Inserts** into MongoDB with proper metadata

**Runs unattended** - drop PDFs in folders, wake up to hundreds of questions ready!

---

## 📁 Folder Structure

### Input Organization

**Option 1: Exam-wise (Paper-by-paper)**
```
automation/input/
├── JEE-Advanced-Chemistry-PYQ/
│   ├── 2012-Paper1/
│   │   ├── page_001.png
│   │   ├── page_002.png
│   │   └── ...
│   ├── 2013-Paper1/
│   └── 2014-Paper2/
│
└── JEE-Main-Chemistry-PYQ/
    ├── 2024-Jan-24-Morning/
    └── 2024-Jan-24-Evening/
```

**Option 2: Chapter-wise**
```
automation/input/
└── NEET-Chemistry-PYQ-Chapterwise/
    ├── Alcohols, Phenols & Ethers/
    │   ├── q001.png
    │   ├── q002.png
    │   └── ...
    ├── Chemical Kinetics/
    └── Haloalkanes & Haloarenes/
```

### Output Structure

```
automation/
├── output/
│   ├── extracted_json/          # Extracted data for reference
│   ├── diagrams_cropped/         # Temporary cropped diagrams
│   ├── review_queue/             # Questions flagged for manual review
│   └── processed_archive/        # Successfully processed
├── logs/                         # Detailed processing logs
└── progress.db                   # SQLite progress tracker
```

---

## 🚀 Setup

### 1. Install Dependencies

```bash
cd automation
npm install
```

Required packages:
- `@anthropic-ai/sdk` - Claude AI API
- `sharp` - Image processing
- `sqlite3` - Progress tracking
- `commander` - CLI interface
- `dotenv` - Environment variables

### 2. Configure Environment Variables

Add to `.env.local`:

```bash
# AI API (choose one)
AI_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-...

# MongoDB
MONGODB_URI=mongodb+srv://...

# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=canvas-chemistry-assets
R2_PUBLIC_URL=https://assets.canvasclasses.in
```

### 3. Get Claude API Key

**Recommended: Claude API (Best for chemistry)**

1. Sign up at https://console.anthropic.com/
2. Add payment method (pay-as-you-go)
3. Create API key
4. **Cost**: ~$0.003 per question (₹0.25)
   - 1000 questions = ~$3 (₹250)
   - Very economical!

**Alternative: OpenAI GPT-4o**
- Slightly cheaper but less accurate for chemistry
- Set `AI_PROVIDER=openai` and add `OPENAI_API_KEY`

### 4. Configure Mac Automator Paths

Update `config.js` if your Automator folders are different:

```javascript
svgInput: '/Users/YourName/Desktop/In - To Be Processed',
svgOutput: '/Users/YourName/Desktop/Out - Ready for Database',
```

---

## 📖 Usage

### Basic Usage

```bash
# Process all folders in input directory
node start_pipeline.js
```

### Advanced Options

```bash
# Dry run (no database insertion, validation only)
node start_pipeline.js --dry-run

# Skip solution generation (faster, cheaper)
node start_pipeline.js --skip-solutions

# Skip diagram extraction
node start_pipeline.js --no-diagrams

# Show statistics from previous runs
node start_pipeline.js --stats

# Show current configuration
node start_pipeline.js --config

# Reset a specific folder to reprocess
node start_pipeline.js --reset "2024-Jan-24-Morning"
```

---

## 🔧 Configuration

Edit `pipeline/config.js` to customize:

### Processing Settings

```javascript
processing: {
  batchSize: 5,                    // Questions per batch
  
  diagrams: {
    minWidth: 100,                 // Minimum diagram size
    minHeight: 100,
    padding: 10,                   // Padding around diagrams
    targetMaxWidth: 600,           // Max width for diagrams
    svgConversionTimeout: 30,      // Max wait for SVG (seconds)
  },
  
  validation: {
    strictMode: true,              // Require all fields
    minSolutionLength: 100,        // Minimum solution chars
    confidenceThreshold: 0.8,      // Flag if confidence < 80%
  },
}
```

### Feature Flags

```javascript
features: {
  enableDiagramExtraction: true,   // Extract and convert diagrams
  enableSolutionGeneration: true,  // Generate AI solutions
  enableDatabaseInsertion: true,   // Insert into MongoDB
  enableR2Upload: true,            // Upload SVGs to R2
  skipExisting: true,              // Skip duplicate questions
}
```

### Chapter Mapping

Add your chapter names to `chapterMapping` in `config.js`:

```javascript
chapterMapping: {
  'Alcohols, Phenols & Ethers': 'ch12_alcohols',
  'Chemical Kinetics': 'ch12_kinetics',
  // Add more as needed
}
```

---

## 🎨 How It Works

### Pipeline Stages

```
┌─────────────────────────────────────────────────┐
│  STAGE 1: AI Extraction                         │
│  • Claude Vision API analyzes image             │
│  • Extracts question, options, answer           │
│  • Detects diagram bounding boxes               │
│  • Determines chapter and difficulty            │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  STAGE 2: Diagram Processing                    │
│  • Crops diagrams from image                    │
│  • Copies to Mac Automator input folder         │
│  • Waits for SVG output                         │
│  • Uploads SVG to Cloudflare R2                 │
│  • Inserts markdown links into question         │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  STAGE 3: Solution Generation                   │
│  • Claude generates step-by-step solution       │
│  • Follows QUESTION_INGESTION_WORKFLOW format   │
│  • Includes LaTeX, key points, explanations     │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  STAGE 4: Validation                            │
│  • Schema validation (all required fields)      │
│  • LaTeX syntax check                           │
│  • Completeness verification                    │
│  • Confidence scoring                           │
│  • Flags issues for manual review               │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  STAGE 5: Database Insertion                    │
│  • Generates display_id (ALCO-001, etc.)        │
│  • Creates QuestionV2 document                  │
│  • Inserts into MongoDB questions_v2            │
│  • Logs success/failure                         │
└─────────────────────────────────────────────────┘
```

### Resumability

The pipeline uses SQLite to track progress:
- If it crashes, resumes from last successful point
- No duplicate processing
- Can reset specific folders if needed

### Quality Control

Questions are flagged for manual review if:
- Validation errors (missing fields, invalid format)
- Low confidence score (< 80%)
- LaTeX syntax issues
- Incomplete solutions

Review flagged questions in: `automation/output/review_queue/`

---

## 📊 Monitoring

### Real-time Progress

The pipeline shows live progress:

```
📁 Processing: JEE-Main-Chemistry-PYQ/2024-Jan-24-Morning
📸 Found 25 image(s)

[1/25] Processing: page_001.png
✅ Inserted as ALCO-045

[2/25] Processing: page_002.png
⚠️  Flagged for review: Low confidence

[3/25] Processing: page_003.png
✅ Inserted as CK-023
```

### Final Summary

```
📊 PIPELINE EXECUTION SUMMARY
⏱️  Duration: 15m 32s
📁 Folders processed: 3
📸 Images processed: 75
✅ Questions inserted: 68
⚠️  Questions for review: 5
❌ Questions failed: 2
🖼️  Diagrams processed: 23

💰 Estimated API cost: $0.23
   - Extraction: 75 requests ($0.23)
   - Solutions: 68 requests ($1.02)
```

### View Statistics

```bash
node start_pipeline.js --stats
```

---

## 🐛 Troubleshooting

### Common Issues

**1. "Mac Automator folders not accessible"**
- Check folder paths in `config.js`
- Ensure Automator is running
- Verify folder permissions

**2. "API rate limit exceeded"**
- Reduce `requestsPerMinute` in config
- Add delays between batches

**3. "LaTeX validation warnings"**
- Review flagged questions in review queue
- Common issues: unescaped `$`, `%`, `&`
- Use `\ce{}` for chemical formulas

**4. "Chapter not found in taxonomy"**
- Add chapter mapping to `config.js`
- Use exact chapter name from taxonomy

**5. "SVG conversion timeout"**
- Increase `svgConversionTimeout` in config
- Check if Automator is processing correctly

### Debug Mode

Enable debug logging:

```javascript
// In config.js
logging: {
  level: 'debug',  // Change from 'info' to 'debug'
}
```

Check logs in: `automation/logs/`

---

## 💰 Cost Estimation

### Claude API Pricing

**Per Question:**
- Extraction: ~$0.003
- Solution: ~$0.015
- **Total: ~$0.018 per question**

**Bulk Processing:**
- 100 questions: ~$1.80 (₹150)
- 500 questions: ~$9.00 (₹750)
- 1000 questions: ~$18.00 (₹1,500)

**Cost Reduction:**
- Skip solutions during testing: `--skip-solutions`
- Use dry-run mode: `--dry-run`
- Process in smaller batches

---

## 🔐 Security

- API keys stored in `.env.local` (gitignored)
- Never commit credentials
- R2 uploads use secure signed URLs
- MongoDB connection encrypted

---

## 📝 Manual Review Workflow

1. Check review queue: `automation/output/review_queue/`
2. Open JSON file to see extraction results
3. Fix issues (LaTeX, missing fields, etc.)
4. Use admin panel to manually insert corrected question
5. Or re-run pipeline after fixing source image

---

## 🚀 Tips for Best Results

### Image Quality
- Use high-resolution screenshots (150+ DPI)
- Ensure text is clear and readable
- Avoid cropped or cut-off questions

### Folder Organization
- Use consistent naming (exact taxonomy names for chapter-wise)
- One question per image for best results
- Name files sequentially (page_001.png, page_002.png)

### Diagram Extraction
- Ensure diagrams are clearly separated from text
- Avoid overlapping diagrams
- Use high contrast (black on white)

### Cost Optimization
- Test with small batches first (`--dry-run`)
- Skip solutions for initial validation
- Process chapter-wise to catch errors early

---

## 📚 Next Steps

1. **Test with sample data**: Start with 5-10 questions
2. **Review output**: Check MongoDB and review queue
3. **Adjust config**: Fine-tune settings based on results
4. **Scale up**: Process larger batches
5. **Monitor costs**: Track API usage

---

## 🤝 Support

For issues or questions:
1. Check logs in `automation/logs/`
2. Review configuration in `config.js`
3. Test with `--dry-run` mode
4. Check validation errors in review queue

---

## 📄 License

Part of Canvas Chemistry Question Bank system.
