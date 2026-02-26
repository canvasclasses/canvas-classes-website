// Main pipeline orchestrator - coordinates all stages
const fs = require('fs').promises;
const path = require('path');
const config = require('./config');
const { Logger, parseFolderName, getImageFiles, calculateFileHash, ensureDir } = require('./utils');
const ProgressTracker = require('./progress_tracker');
const QuestionExtractor = require('./stage1_extract');
const DiagramProcessor = require('./stage2_diagrams');
const SolutionGenerator = require('./stage3_solutions');
const QuestionValidator = require('./stage4_validate');
const DatabaseInserter = require('./stage5_insert');

class PipelineOrchestrator {
  constructor() {
    this.config = config;
    this.logger = null;
    this.tracker = null;
    this.extractor = null;
    this.diagramProcessor = null;
    this.solutionGenerator = null;
    this.validator = null;
    this.inserter = null;
    
    this.stats = {
      foldersProcessed: 0,
      questionsExtracted: 0,
      questionsInserted: 0,
      questionsFailed: 0,
      questionsReview: 0,
      diagramsProcessed: 0,
      startTime: null,
      endTime: null,
    };
  }

  /**
   * Initialize all pipeline components
   */
  async initialize() {
    console.log('🚀 Initializing Automated Question Ingestion Pipeline...\n');

    // Validate configuration
    config.validateConfig();

    // Create output directories
    await ensureDir(this.config.paths.extractedJson);
    await ensureDir(this.config.paths.diagramsCropped);
    await ensureDir(this.config.paths.reviewQueue);
    await ensureDir(this.config.paths.processedArchive);
    await ensureDir(this.config.paths.logs);

    // Initialize logger
    this.logger = new Logger(this.config.paths.logs, this.config.logging.level);
    await this.logger.init();
    await this.logger.info('Pipeline initialization started');

    // Initialize progress tracker
    this.tracker = new ProgressTracker(this.config.paths.progressDb);
    await this.tracker.init();
    await this.logger.info('Progress tracker initialized');

    // Initialize pipeline stages
    this.extractor = new QuestionExtractor(this.config, this.logger);
    this.diagramProcessor = new DiagramProcessor(this.config, this.logger);
    this.solutionGenerator = new SolutionGenerator(this.config, this.logger);
    this.validator = new QuestionValidator(this.config, this.logger);
    this.inserter = new DatabaseInserter(this.config, this.logger);

    // Check Mac Automator setup
    if (this.config.features.enableDiagramExtraction) {
      const automatorOk = await this.diagramProcessor.checkAutomatorSetup();
      if (!automatorOk) {
        await this.logger.warn('Mac Automator folders not accessible - diagram extraction may fail');
      }
    }

    await this.logger.info('All pipeline components initialized');
    console.log('✅ Initialization complete\n');
  }

  /**
   * Main pipeline execution
   */
  async run() {
    this.stats.startTime = Date.now();
    await this.logger.info('Pipeline execution started');

    try {
      // Scan input folder for processing folders
      const folders = await this.scanInputFolder();
      
      if (folders.length === 0) {
        console.log('📭 No folders found to process');
        await this.logger.info('No folders to process');
        return;
      }

      console.log(`📂 Found ${folders.length} folder(s) to process\n`);

      // Process each folder
      for (const folder of folders) {
        await this.processFolder(folder);
        this.stats.foldersProcessed++;
      }

      // Final summary
      await this.printSummary();

    } catch (error) {
      await this.logger.error('Pipeline execution failed', { error: error.message, stack: error.stack });
      throw error;
    } finally {
      this.stats.endTime = Date.now();
      await this.cleanup();
    }
  }

  /**
   * Scan input folder for subfolders to process
   */
  async scanInputFolder() {
    const inputPath = this.config.paths.input;
    const entries = await fs.readdir(inputPath, { withFileTypes: true });
    
    const folders = [];
    
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      
      const folderPath = path.join(inputPath, entry.name);
      
      // Check if this is a parent folder (contains subfolders) or a leaf folder (contains images)
      const subEntries = await fs.readdir(folderPath, { withFileTypes: true });
      const hasSubfolders = subEntries.some(e => e.isDirectory());
      const hasImages = subEntries.some(e => /\.(png|jpg|jpeg)$/i.test(e.name));
      
      if (hasSubfolders) {
        // Parent folder - process each subfolder
        for (const subEntry of subEntries) {
          if (subEntry.isDirectory()) {
            folders.push({
              path: path.join(folderPath, subEntry.name),
              name: subEntry.name,
              parentName: entry.name,
            });
          }
        }
      } else if (hasImages) {
        // Leaf folder - process directly
        folders.push({
          path: folderPath,
          name: entry.name,
          parentName: null,
        });
      }
    }
    
    return folders;
  }

  /**
   * Process a single folder
   */
  async processFolder(folder) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📁 Processing: ${folder.parentName ? folder.parentName + '/' : ''}${folder.name}`);
    console.log('='.repeat(60));

    // Parse folder metadata
    const metadata = parseFolderName(folder.name, folder.parentName || '');
    await this.logger.info('Folder metadata parsed', { folder: folder.name, metadata });

    // Get all images in folder
    const images = await getImageFiles(folder.path);
    
    if (images.length === 0) {
      console.log('⚠️  No images found in folder');
      return;
    }

    console.log(`📸 Found ${images.length} image(s)\n`);

    // Register folder in progress tracker
    const folderId = await this.tracker.registerFolder(
      folder.path,
      folder.parentName,
      images.length,
      metadata
    );
    await this.tracker.startFolder(folderId);

    // Register all images
    for (const imagePath of images) {
      const fileHash = await calculateFileHash(imagePath);
      await this.tracker.registerImage(folderId, imagePath, fileHash);
    }

    // Process each image
    const pendingImages = await this.tracker.getPendingImages(folderId);
    let successful = 0;
    let failed = 0;

    for (let i = 0; i < pendingImages.length; i++) {
      const imageRecord = pendingImages[i];
      console.log(`\n[${i + 1}/${pendingImages.length}] Processing: ${path.basename(imageRecord.image_path)}`);

      try {
        await this.tracker.startImage(imageRecord.id);
        
        const result = await this.processImage(imageRecord.image_path, metadata);
        
        if (result.inserted) {
          await this.tracker.completeImage(
            imageRecord.id,
            result.questionId,
            result.displayId,
            result.extractedData
          );
          successful++;
          this.stats.questionsInserted++;
          console.log(`✅ Inserted as ${result.displayId}`);
        } else if (result.needsReview) {
          await this.tracker.completeImage(
            imageRecord.id,
            null,
            result.displayId || 'REVIEW',
            result.extractedData
          );
          successful++;
          this.stats.questionsReview++;
          console.log(`⚠️  Flagged for review: ${result.reviewReason}`);
        } else if (result.skipped) {
          await this.tracker.skipImage(imageRecord.id, result.reason);
          console.log(`⏭️  Skipped: ${result.reason}`);
        }
        
      } catch (error) {
        await this.tracker.failImage(imageRecord.id, error.message);
        await this.logger.error('Image processing failed', {
          image: imageRecord.image_path,
          error: error.message,
        });
        failed++;
        this.stats.questionsFailed++;
        console.log(`❌ Failed: ${error.message}`);
      }
    }

    // Complete folder
    await this.tracker.completeFolder(folderId, successful, failed);
    console.log(`\n📊 Folder complete: ${successful} successful, ${failed} failed`);
  }

  /**
   * Process a single image through all pipeline stages
   */
  async processImage(imagePath, folderMetadata) {
    const result = {
      inserted: false,
      needsReview: false,
      skipped: false,
      extractedData: null,
    };

    // STAGE 1: Extract question data
    const questionData = await this.extractor.extractFromImage(imagePath, folderMetadata);
    result.extractedData = questionData;
    this.stats.questionsExtracted++;

    // STAGE 2: Process diagrams (if any)
    let processedDiagrams = [];
    if (this.config.features.enableDiagramExtraction && questionData.diagrams?.length > 0) {
      const questionId = `temp_${Date.now()}`;
      processedDiagrams = await this.diagramProcessor.processDiagrams(
        imagePath,
        questionData.diagrams,
        questionId
      );
      
      // Insert diagram markdown links into question
      this.diagramProcessor.insertDiagramLinks(questionData, processedDiagrams);
      this.stats.diagramsProcessed += processedDiagrams.filter(d => d.status === 'success').length;
    }

    // STAGE 3: Generate solution
    const solutionData = await this.solutionGenerator.generateSolution(questionData);

    // STAGE 4: Validate
    const validationResult = await this.validator.validate(questionData, solutionData);
    
    // Suggest tags
    validationResult.suggestedTags = this.validator.suggestTags(
      validationResult.chapterId,
      questionData.question_text
    );

    // Check if validation passed
    if (!validationResult.isValid) {
      // Save to review queue
      await this.saveForReview(imagePath, questionData, solutionData, validationResult);
      result.needsReview = true;
      result.reviewReason = validationResult.errors.join('; ');
      return result;
    }

    // Check if needs manual review
    if (validationResult.needsReview) {
      await this.saveForReview(imagePath, questionData, solutionData, validationResult);
      result.needsReview = true;
      result.reviewReason = 'Low confidence or warnings';
      return result;
    }

    // STAGE 5: Insert into MongoDB
    const insertResult = await this.inserter.insertQuestion(
      questionData,
      solutionData,
      validationResult,
      folderMetadata
    );

    if (insertResult.inserted) {
      result.inserted = true;
      result.questionId = insertResult.questionId;
      result.displayId = insertResult.displayId;
      
      // Save extracted JSON for reference
      await this.saveExtractedJson(insertResult.displayId, questionData, solutionData, validationResult);
    } else if (insertResult.skipped) {
      result.skipped = true;
      result.reason = insertResult.reason;
    }

    return result;
  }

  /**
   * Save question data for manual review
   */
  async saveForReview(imagePath, questionData, solutionData, validationResult) {
    const reviewData = {
      source_image: imagePath,
      extracted_at: new Date().toISOString(),
      question_data: questionData,
      solution_data: solutionData,
      validation: validationResult,
    };

    const filename = `review_${Date.now()}_${path.basename(imagePath, path.extname(imagePath))}.json`;
    const reviewPath = path.join(this.config.paths.reviewQueue, filename);
    
    await fs.writeFile(reviewPath, JSON.stringify(reviewData, null, 2));
    await this.logger.info('Saved for manual review', { reviewPath });
  }

  /**
   * Save extracted JSON for reference
   */
  async saveExtractedJson(displayId, questionData, solutionData, validationResult) {
    const data = {
      display_id: displayId,
      extracted_at: new Date().toISOString(),
      question_data: questionData,
      solution_data: solutionData,
      validation: validationResult,
    };

    const filename = `${displayId}.json`;
    const jsonPath = path.join(this.config.paths.extractedJson, filename);
    
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2));
  }

  /**
   * Print final summary
   */
  async printSummary() {
    const duration = this.stats.endTime - this.stats.startTime;
    const overallStats = await this.tracker.getOverallStats();

    console.log('\n' + '='.repeat(60));
    console.log('📊 PIPELINE EXECUTION SUMMARY');
    console.log('='.repeat(60));
    console.log(`⏱️  Duration: ${this.formatDuration(duration)}`);
    console.log(`📁 Folders processed: ${this.stats.foldersProcessed}`);
    console.log(`📸 Images processed: ${overallStats.completed_images + overallStats.failed_images}`);
    console.log(`✅ Questions inserted: ${this.stats.questionsInserted}`);
    console.log(`⚠️  Questions for review: ${this.stats.questionsReview}`);
    console.log(`❌ Questions failed: ${this.stats.questionsFailed}`);
    console.log(`🖼️  Diagrams processed: ${this.stats.diagramsProcessed}`);
    
    // API usage stats
    const extractorStats = this.extractor.getStats();
    const solutionStats = this.solutionGenerator.getStats();
    const totalCost = extractorStats.estimatedCost + solutionStats.estimatedCost;
    
    console.log(`\n💰 Estimated API cost: $${totalCost.toFixed(2)}`);
    console.log(`   - Extraction: ${extractorStats.totalRequests} requests ($${extractorStats.estimatedCost.toFixed(2)})`);
    console.log(`   - Solutions: ${solutionStats.totalRequests} requests ($${solutionStats.estimatedCost.toFixed(2)})`);
    
    if (this.stats.questionsReview > 0) {
      console.log(`\n⚠️  ${this.stats.questionsReview} question(s) need manual review`);
      console.log(`   Check: ${this.config.paths.reviewQueue}`);
    }
    
    console.log('\n✅ Pipeline execution complete!');
    console.log('='.repeat(60) + '\n');

    await this.logger.info('Pipeline execution completed', { stats: this.stats, overallStats });
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    if (this.tracker) {
      await this.tracker.close();
    }
    if (this.inserter) {
      await this.inserter.disconnect();
    }
  }

  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
}

module.exports = PipelineOrchestrator;
