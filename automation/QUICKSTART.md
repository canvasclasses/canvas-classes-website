# 🚀 Quick Start Guide

Get the automated question ingestion pipeline running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd /Users/CanvasClasses/Desktop/canvas/automation
npm install
```

## Step 2: Get Claude API Key

1. Go to https://console.anthropic.com/
2. Sign up and add payment method
3. Create an API key
4. Copy the key (starts with `sk-ant-...`)

**Cost**: ~₹0.25 per question (very economical!)

## Step 3: Add API Key to Environment

Open `/Users/CanvasClasses/Desktop/canvas/.env.local` and add:

```bash
# Add this line
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

## Step 4: Update Mac Automator Paths

Open `pipeline/config.js` and update these lines (around line 13-14):

```javascript
svgInput: path.join(process.env.HOME, 'Desktop/In - To Be Processed'),
svgOutput: path.join(process.env.HOME, 'Desktop/Out - Ready for Database'),
```

Change to match your actual folder names.

## Step 5: Organize Your Input Folders

### For Chapter-wise Processing:

```
automation/input/
└── NEET-Chemistry-PYQ-Chapterwise/
    ├── Alcohols, Phenols & Ethers/
    │   ├── q001.png
    │   ├── q002.png
    │   └── q003.png
    └── Chemical Kinetics/
        ├── q001.png
        └── q002.png
```

### For Exam-wise Processing:

```
automation/input/
└── JEE-Main-Chemistry-PYQ/
    ├── 2024-Jan-24-Morning/
    │   ├── page_001.png
    │   ├── page_002.png
    │   └── page_003.png
    └── 2024-Jan-24-Evening/
        ├── page_001.png
        └── page_002.png
```

## Step 6: Test Run (Dry Mode)

Test without inserting into database:

```bash
node start_pipeline.js --dry-run --skip-solutions --no-diagrams
```

This will:
- ✅ Extract questions
- ✅ Validate format
- ❌ Skip solution generation (save cost)
- ❌ Skip diagram processing (faster)
- ❌ Skip database insertion (safe test)

Check the output in `output/review_queue/` to see extracted data.

## Step 7: Run Full Pipeline

Once you're happy with the test:

```bash
node start_pipeline.js
```

This will:
1. Extract all questions
2. Process diagrams and convert to SVG
3. Generate detailed solutions
4. Validate everything
5. Insert into MongoDB

## Step 8: Review Results

### Check MongoDB
- Questions inserted with proper display_ids (ALCO-001, CK-023, etc.)
- Solutions with step-by-step format
- Diagrams uploaded to Cloudflare R2

### Check Review Queue
- `automation/output/review_queue/` - Questions flagged for manual review
- Fix any issues and re-insert manually via admin panel

### Check Logs
- `automation/logs/` - Detailed processing logs

## Common Commands

```bash
# Normal run
node start_pipeline.js

# Dry run (no database)
node start_pipeline.js --dry-run

# Skip solutions (faster, cheaper)
node start_pipeline.js --skip-solutions

# View statistics
node start_pipeline.js --stats

# Show configuration
node start_pipeline.js --config
```

## Troubleshooting

### "Missing required environment variables"
- Check `.env.local` has `ANTHROPIC_API_KEY`
- Ensure MongoDB URI is set

### "Mac Automator folders not accessible"
- Update paths in `config.js`
- Check folder names match exactly

### "Chapter not found in taxonomy"
- Use exact chapter names from taxonomy
- Or add mapping to `config.js` → `chapterMapping`

### Questions flagged for review
- Normal! Low confidence or validation warnings
- Check `output/review_queue/` for details
- Fix and re-insert manually

## Next Steps

1. ✅ Test with 5-10 questions
2. ✅ Review output quality
3. ✅ Adjust config if needed
4. ✅ Process larger batches
5. ✅ Monitor API costs

## Cost Tracking

The pipeline shows estimated costs at the end:

```
💰 Estimated API cost: $0.23
   - Extraction: 75 requests ($0.23)
   - Solutions: 68 requests ($1.02)
```

**Budget**: ~₹0.25 per question = ₹250 for 1000 questions

## Support

- Check README.md for detailed documentation
- Review logs in `automation/logs/`
- Test with `--dry-run` first
- Start small, scale up gradually

---

**You're all set! Drop your PDF screenshots in the input folder and let the automation work overnight! 🎉**
