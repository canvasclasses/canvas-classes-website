// Utility functions for the pipeline
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

/**
 * Logger utility with file and console output
 */
class Logger {
  constructor(logDir, level = 'info') {
    this.logDir = logDir;
    this.level = level;
    this.levels = { debug: 0, info: 1, warn: 2, error: 3 };
    this.currentLevel = this.levels[level] || 1;
  }

  async init() {
    await fs.mkdir(this.logDir, { recursive: true });
    this.logFile = path.join(this.logDir, `pipeline_${Date.now()}.log`);
  }

  async log(level, message, data = null) {
    if (this.levels[level] < this.currentLevel) return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(data && { data }),
    };

    const logLine = JSON.stringify(logEntry) + '\n';

    // Console output with colors
    const colors = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m', // Red
    };
    const reset = '\x1b[0m';
    console.log(`${colors[level]}[${level.toUpperCase()}]${reset} ${message}`);
    if (data) console.log(data);

    // File output
    if (this.logFile) {
      await fs.appendFile(this.logFile, logLine);
    }
  }

  debug(message, data) { return this.log('debug', message, data); }
  info(message, data) { return this.log('info', message, data); }
  warn(message, data) { return this.log('warn', message, data); }
  error(message, data) { return this.log('error', message, data); }
}

/**
 * Parse folder name to extract exam metadata
 */
function parseFolderName(folderName, parentFolderName = '') {
  const result = {
    organizationType: null, // 'exam-wise' or 'chapter-wise'
    exam: null,
    year: null,
    month: null,
    day: null,
    shift: null,
    paper: null,
    chapterName: null,
  };

  // Detect organization type from parent folder
  if (parentFolderName.toLowerCase().includes('chapterwise')) {
    result.organizationType = 'chapter-wise';
    result.chapterName = folderName;
    
    // Extract exam from parent folder
    if (parentFolderName.toLowerCase().includes('jee-advanced')) {
      result.exam = 'JEE Advanced';
    } else if (parentFolderName.toLowerCase().includes('jee-main')) {
      result.exam = 'JEE Main';
    } else if (parentFolderName.toLowerCase().includes('neet')) {
      result.exam = 'NEET';
    }
    
    return result;
  }

  // Exam-wise organization
  result.organizationType = 'exam-wise';

  // Detect exam type from parent folder
  if (parentFolderName.toLowerCase().includes('jee-advanced')) {
    result.exam = 'JEE Advanced';
    
    // Parse: "2012-Paper1", "2013-P2"
    const match = folderName.match(/(\d{4})-?(?:Paper|P)?\s*([12])/i);
    if (match) {
      result.year = parseInt(match[1]);
      result.paper = parseInt(match[2]);
    }
  } else if (parentFolderName.toLowerCase().includes('jee-main')) {
    result.exam = 'JEE Main';
    
    // Parse: "2024-Jan-24-Morning"
    const match = folderName.match(/(\d{4})-(\w+)-(\d{1,2})-(\w+)/i);
    if (match) {
      result.year = parseInt(match[1]);
      result.month = match[2];
      result.day = parseInt(match[3]);
      result.shift = match[4];
    }
  } else if (parentFolderName.toLowerCase().includes('neet')) {
    result.exam = 'NEET';
    
    // Parse: "2023", "2024-May"
    const match = folderName.match(/(\d{4})(?:-(\w+))?/i);
    if (match) {
      result.year = parseInt(match[1]);
      result.month = match[2] || null;
    }
  }

  return result;
}

/**
 * Map chapter name to taxonomy chapter_id
 */
function mapChapterNameToId(chapterName, chapterMapping) {
  if (!chapterName) return null;

  // Try exact match (case-insensitive)
  const normalized = chapterName.trim();
  for (const [key, value] of Object.entries(chapterMapping)) {
    if (key.toLowerCase() === normalized.toLowerCase()) {
      return value;
    }
  }

  // Try partial match
  for (const [key, value] of Object.entries(chapterMapping)) {
    if (normalized.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(normalized.toLowerCase())) {
      return value;
    }
  }

  return null;
}

/**
 * Generate unique filename with timestamp
 */
function generateUniqueFilename(baseName, extension) {
  const timestamp = Date.now();
  const hash = crypto.randomBytes(4).toString('hex');
  const sanitized = baseName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return `${timestamp}_${sanitized}_${hash}.${extension}`;
}

/**
 * Sleep utility
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry wrapper with exponential backoff
 */
async function retry(fn, options = {}) {
  const {
    attempts = 3,
    delay = 1000,
    backoff = 2,
    onRetry = null,
  } = options;

  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < attempts - 1) {
        const waitTime = delay * Math.pow(backoff, i);
        if (onRetry) {
          onRetry(error, i + 1, waitTime);
        }
        await sleep(waitTime);
      }
    }
  }
  throw lastError;
}

/**
 * Ensure directory exists
 */
async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

/**
 * Get all image files in a directory
 */
async function getImageFiles(dirPath) {
  const files = await fs.readdir(dirPath);
  return files
    .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
    .map(f => path.join(dirPath, f))
    .sort();
}

/**
 * Categorize images into questions, answer key, and solutions
 * @param {string} dirPath - Directory containing images
 * @returns {Object} { questions: [], answerKey: string|null, solutions: Map<number, string> }
 */
async function categorizeImages(dirPath) {
  const files = await fs.readdir(dirPath);
  const result = {
    questions: [],
    answerKey: null,
    solutions: new Map(),
  };

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const fileName = file.toLowerCase();

    // Check if it's an image
    if (!/\.(png|jpg|jpeg)$/i.test(file)) continue;

    // Answer key detection
    if (fileName.includes('answer-key') || fileName.includes('answerkey') || fileName.includes('answer_key')) {
      result.answerKey = filePath;
      continue;
    }

    // Solution detection: solutions-001.png, solutions_002.png, solution-003.png
    const solutionMatch = fileName.match(/solutions?[-_](\d+)/i);
    if (solutionMatch) {
      const questionNum = parseInt(solutionMatch[1]);
      result.solutions.set(questionNum, filePath);
      continue;
    }

    // Everything else is a question image
    result.questions.push(filePath);
  }

  // Sort questions by filename
  result.questions.sort();

  return result;
}

/**
 * Check if a file is an answer key
 */
function isAnswerKeyFile(filename) {
  const lower = filename.toLowerCase();
  return lower.includes('answer-key') || lower.includes('answerkey') || lower.includes('answer_key');
}

/**
 * Check if a file is a solution image and extract question number
 * @returns {number|null} Question number or null if not a solution
 */
function getSolutionNumber(filename) {
  const lower = filename.toLowerCase();
  const match = lower.match(/solutions?[-_](\d+)/i);
  return match ? parseInt(match[1]) : null;
}

/**
 * Calculate file hash (for deduplication)
 */
async function calculateFileHash(filePath) {
  const buffer = await fs.readFile(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format duration to human readable
 */
function formatDuration(ms) {
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

/**
 * Sanitize filename for safe file system usage
 */
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-z0-9._-]/gi, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

/**
 * Extract question number from filename
 * Examples: "page_001.png" -> 1, "q042.png" -> 42
 */
function extractQuestionNumber(filename) {
  const match = filename.match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

module.exports = {
  Logger,
  parseFolderName,
  mapChapterNameToId,
  generateUniqueFilename,
  sleep,
  retry,
  ensureDir,
  getImageFiles,
  categorizeImages,
  isAnswerKeyFile,
  getSolutionNumber,
  calculateFileHash,
  formatBytes,
  formatDuration,
  sanitizeFilename,
  extractQuestionNumber,
};
