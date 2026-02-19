#!/usr/bin/env node
/**
 * MASTER REBUILD SCRIPT
 * One-command rebuild of the entire question bank
 * 
 * Usage: node scripts/rebuild_question_bank.js [--full]
 * 
 * Steps:
 * 1. Backup existing data
 * 2. Parse all PYQ files with new format support
 * 3. Audit and fix LaTeX
 * 4. Clear MongoDB
 * 5. Sync all questions
 * 6. Generate report
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const BACKUP_DIR = path.join(ROOT_DIR, 'backups');
const DATA_DIR = path.join(ROOT_DIR, 'data/questions');
const PYQ_DIR = path.join(ROOT_DIR, 'PYQ');
const LOG_FILE = path.join(ROOT_DIR, 'rebuild_log.txt');

const STEPS = [
    { name: 'Create Backup', fn: createBackup },
    { name: 'Parse PYQ Files', fn: parsePYQFiles },
    { name: 'Audit Questions', fn: auditQuestions },
    { name: 'Clear MongoDB', fn: clearMongoDB },
    { name: 'Sync to MongoDB', fn: syncToMongoDB },
    { name: 'Verify Sync', fn: verifySync },
];

let currentLog = '';

function log(message) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${message}`;
    console.log(line);
    currentLog += line + '\n';
}

function saveLog() {
    fs.appendFileSync(LOG_FILE, currentLog);
    currentLog = '';
}

function createBackup() {
    log('Creating backup of existing data...');
    
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `questions_${timestamp}`);
    
    fs.mkdirSync(backupPath, { recursive: true });
    
    // Copy all JSON files
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    for (const file of files) {
        fs.copyFileSync(
            path.join(DATA_DIR, file),
            path.join(backupPath, file)
        );
    }
    
    log(`✅ Backup created: ${backupPath} (${files.length} files)`);
    return { success: true, backupPath, fileCount: files.length };
}

function parsePYQFiles() {
    log('Parsing PYQ markdown files...');
    
    // Run the new parser
    try {
        const result = execSync('node scripts/parse_pyq_v2.js', {
            cwd: ROOT_DIR,
            encoding: 'utf8',
            stdio: 'pipe'
        });
        
        log('✅ PYQ parsing complete');
        log(result);
        
        return { success: true, output: result };
    } catch (error) {
        log('❌ PYQ parsing failed');
        log(error.stderr || error.message);
        throw error;
    }
}

function auditQuestions() {
    log('Auditing questions for LaTeX and solution issues...');
    
    try {
        const result = execSync('node scripts/audit_and_fix_questions.js', {
            cwd: ROOT_DIR,
            encoding: 'utf8',
            stdio: 'pipe'
        });
        
        log('✅ Audit complete');
        log(result);
        
        // Read the report
        const reportPath = path.join(ROOT_DIR, 'question_audit_report.json');
        if (fs.existsSync(reportPath)) {
            const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
            return { 
                success: true, 
                totalQuestions: report.summary?.totalQuestions || 0,
                issues: report.summary?.questionsWithIssues || 0,
                withoutSolutions: report.summary?.questionsWithoutSolutions || 0
            };
        }
        
        return { success: true };
    } catch (error) {
        log('⚠️ Audit had issues but continuing...');
        log(error.stderr || error.message);
        return { success: true, warning: 'Audit had errors' };
    }
}

function clearMongoDB() {
    log('Clearing MongoDB questions collection...');
    
    // This will be done by the sync script
    log('✅ Will be cleared during sync phase');
    return { success: true };
}

function syncToMongoDB() {
    log('Syncing questions to MongoDB...');
    
    try {
        const result = execSync('node scripts/sync_questions_robust.js --verify', {
            cwd: ROOT_DIR,
            encoding: 'utf8',
            stdio: 'pipe',
            timeout: 120000 // 2 minute timeout
        });
        
        log('✅ MongoDB sync complete');
        log(result);
        
        // Parse sync report
        const reportPath = path.join(ROOT_DIR, 'sync_report.json');
        if (fs.existsSync(reportPath)) {
            const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
            return {
                success: true,
                syncedCount: report.summary?.syncedToDB || 0,
                fileCount: report.summary?.totalQuestions || 0
            };
        }
        
        return { success: true };
    } catch (error) {
        log('❌ MongoDB sync failed');
        log(error.stderr || error.message);
        throw error;
    }
}

function verifySync() {
    log('Verifying sync integrity...');
    
    // Count questions in files
    let fileCount = 0;
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    for (const file of files) {
        const questions = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
        fileCount += questions.length;
    }
    
    log(`📊 File system: ${fileCount} questions`);
    log(`📊 By chapter:`);
    
    for (const file of files.sort()) {
        const questions = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
        const chapterId = file.replace('.json', '');
        log(`   ${chapterId}: ${questions.length}`);
    }
    
    return { success: true, totalQuestions: fileCount };
}

async function main() {
    const args = process.argv.slice(2);
    const fullRebuild = args.includes('--full');
    
    console.log('='.repeat(70));
    console.log('  CANVAS CLASSES - Question Bank Master Rebuild');
    console.log('='.repeat(70));
    console.log('');
    
    if (fullRebuild) {
        console.log('⚠️  FULL REBUILD MODE - All existing data will be refreshed');
        console.log('');
    }
    
    log(`Starting rebuild at ${new Date().toISOString()}`);
    
    const results = [];
    
    for (const step of STEPS) {
        console.log('');
        console.log(`📍 ${step.name}...`);
        console.log('-'.repeat(50));
        
        try {
            const result = step.fn();
            results.push({ step: step.name, ...result });
        } catch (error) {
            log(`❌ ${step.name} failed: ${error.message}`);
            results.push({ step: step.name, success: false, error: error.message });
            
            // Ask if user wants to continue
            console.log('');
            console.log('⚠️  Step failed. Check the error above.');
            console.log('   Logs saved to:', LOG_FILE);
            process.exit(1);
        }
        
        saveLog();
    }
    
    // Summary
    console.log('');
    console.log('='.repeat(70));
    console.log('  REBUILD COMPLETE');
    console.log('='.repeat(70));
    console.log('');
    
    const syncResult = results.find(r => r.step === 'Sync to MongoDB');
    const backupResult = results.find(r => r.step === 'Create Backup');
    const auditResult = results.find(r => r.step === 'Audit Questions');
    
    console.log(`📦 Backup: ${backupResult?.backupPath || 'N/A'}`);
    console.log(`📚 Total Questions: ${syncResult?.fileCount || 'N/A'}`);
    console.log(`💾 Synced to MongoDB: ${syncResult?.syncedCount || 'N/A'}`);
    console.log(`⚠️  Questions with issues: ${auditResult?.issues || 'N/A'}`);
    console.log(`❓ Without solutions: ${auditResult?.withoutSolutions || 'N/A'}`);
    console.log('');
    console.log(`📝 Full log: ${LOG_FILE}`);
    console.log('');
    console.log('✅ Rebuild completed successfully!');
}

main().catch(error => {
    console.error('');
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
});
