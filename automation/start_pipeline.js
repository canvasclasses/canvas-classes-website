#!/usr/bin/env node

// CLI entry point for the automated question ingestion pipeline
const path = require('path');
const { program } = require('commander');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const PipelineOrchestrator = require('./pipeline/orchestrator');

// ASCII art banner
const banner = `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🤖  Automated Question Ingestion Pipeline                  ║
║   📚  Canvas Chemistry Question Bank                         ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`;

// CLI configuration
program
  .name('start_pipeline')
  .description('Automated pipeline for extracting chemistry questions from PDF screenshots')
  .version('1.0.0')
  .option('-d, --dry-run', 'Run without inserting into database (validation only)')
  .option('-s, --skip-solutions', 'Skip solution generation (faster, cheaper)')
  .option('-n, --no-diagrams', 'Skip diagram extraction and SVG conversion')
  .option('--stats', 'Show statistics from previous runs')
  .option('--reset <folder>', 'Reset progress for a specific folder')
  .option('--config', 'Show current configuration')
  .parse(process.argv);

const options = program.opts();

async function main() {
  console.log(banner);

  // Handle special commands
  if (options.config) {
    showConfig();
    return;
  }

  if (options.stats) {
    await showStats();
    return;
  }

  if (options.reset) {
    await resetFolder(options.reset);
    return;
  }

  // Apply CLI options to config
  if (options.dryRun) {
    console.log('🔍 DRY RUN MODE - No database insertion\n');
    const config = require('./pipeline/config');
    config.features.enableDatabaseInsertion = false;
  }

  if (options.skipSolutions) {
    console.log('⚡ FAST MODE - Skipping solution generation\n');
    const config = require('./pipeline/config');
    config.features.enableSolutionGeneration = false;
  }

  if (options.noDiagrams) {
    console.log('📷 SIMPLE MODE - Skipping diagram extraction\n');
    const config = require('./pipeline/config');
    config.features.enableDiagramExtraction = false;
  }

  // Run the pipeline
  const orchestrator = new PipelineOrchestrator();
  
  try {
    await orchestrator.initialize();
    await orchestrator.run();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Pipeline failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

function showConfig() {
  const config = require('./pipeline/config');
  
  console.log('⚙️  Current Configuration:\n');
  console.log('AI Provider:', config.ai.provider);
  console.log('Model:', config.ai[config.ai.provider].model);
  console.log('Rate Limit:', config.ai.rateLimit.requestsPerMinute, 'requests/min');
  console.log('\nPaths:');
  console.log('  Input:', config.paths.input);
  console.log('  SVG Input:', config.paths.svgInput);
  console.log('  SVG Output:', config.paths.svgOutput);
  console.log('  Review Queue:', config.paths.reviewQueue);
  console.log('\nFeatures:');
  console.log('  Diagram Extraction:', config.features.enableDiagramExtraction);
  console.log('  Solution Generation:', config.features.enableSolutionGeneration);
  console.log('  Database Insertion:', config.features.enableDatabaseInsertion);
  console.log('  R2 Upload:', config.features.enableR2Upload);
  console.log('  Skip Existing:', config.features.skipExisting);
}

async function showStats() {
  const ProgressTracker = require('./pipeline/progress_tracker');
  const config = require('./pipeline/config');
  
  const tracker = new ProgressTracker(config.paths.progressDb);
  await tracker.init();
  
  const stats = await tracker.getOverallStats();
  
  console.log('📊 Pipeline Statistics:\n');
  console.log('Folders:');
  console.log('  Total:', stats.total_folders);
  console.log('  Completed:', stats.completed_folders);
  console.log('  Failed:', stats.failed_folders);
  console.log('  Processing:', stats.processing_folders);
  console.log('  Pending:', stats.pending_folders);
  console.log('\nQuestions:');
  console.log('  Successful:', stats.total_successful);
  console.log('  Failed:', stats.total_failed);
  console.log('\nImages:');
  console.log('  Total:', stats.total_images);
  console.log('  Completed:', stats.completed_images);
  console.log('  Failed:', stats.failed_images);
  console.log('  Skipped:', stats.skipped_images);
  console.log('  Pending:', stats.pending_images);
  
  await tracker.close();
}

async function resetFolder(folderPath) {
  const ProgressTracker = require('./pipeline/progress_tracker');
  const config = require('./pipeline/config');
  
  const tracker = new ProgressTracker(config.paths.progressDb);
  await tracker.init();
  
  // Find folder by path
  const folders = await tracker.getPendingFolders();
  const folder = folders.find(f => f.folder_path.includes(folderPath));
  
  if (!folder) {
    console.log('❌ Folder not found:', folderPath);
    await tracker.close();
    return;
  }
  
  await tracker.resetFolder(folder.id);
  console.log('✅ Reset folder:', folder.folder_path);
  
  await tracker.close();
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
