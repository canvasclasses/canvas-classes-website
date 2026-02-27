// Automated Question Ingestion Pipeline - Configuration
// All settings for the pipeline in one place

require('dotenv').config({ path: '../../.env.local' });
const path = require('path');

const config = {
  // ===== PATHS =====
  paths: {
    // Input folder where you drop PDF screenshot folders
    input: path.join(__dirname, '../input'),
    
    // SVG Automation folders (your existing Mac Automator setup)
    svgInput: path.join(process.env.HOME, 'Desktop/In - To Be Processed'),
    svgOutput: path.join(process.env.HOME, 'Desktop/Out - Ready for Database'),
    
    // Output folders
    extractedJson: path.join(__dirname, '../output/extracted_json'),
    diagramsCropped: path.join(__dirname, '../output/diagrams_cropped'),
    reviewQueue: path.join(__dirname, '../output/review_queue'),
    processedArchive: path.join(__dirname, '../output/processed_archive'),
    
    // Logs and tracking
    logs: path.join(__dirname, '../logs'),
    progressDb: path.join(__dirname, '../progress.db'),
  },

  // ===== AI API SETTINGS =====
  ai: {
    // Provider: 'claude' or 'openai'
    provider: process.env.AI_PROVIDER || 'claude',
    
    // Claude settings (recommended for chemistry)
    claude: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-3-5-sonnet-20241022',
      maxTokens: 4000,
      temperature: 0.1, // Low for consistency
    },
    
    // OpenAI settings (fallback)
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4o',
      maxTokens: 4000,
      temperature: 0.1,
    },
    
    // Rate limiting (to control costs)
    rateLimit: {
      requestsPerMinute: 10,
      retryAttempts: 3,
      retryDelay: 2000, // ms
    },
  },

  // ===== PROCESSING SETTINGS =====
  processing: {
    // Batch size (questions per batch)
    batchSize: 5,
    
    // Diagram extraction settings
    diagrams: {
      // Minimum size for a diagram to be extracted (pixels)
      minWidth: 100,
      minHeight: 100,
      
      // Padding around detected diagrams (pixels)
      padding: 10,
      
      // Max wait time for SVG conversion (seconds)
      svgConversionTimeout: 30,
      
      // Polling interval for SVG output (ms)
      svgPollingInterval: 500,
      
      // Target max width for diagrams in questions (pixels)
      targetMaxWidth: 600,
      
      // DPI for image quality
      dpi: 150,
    },
    
    // Validation settings
    validation: {
      // Require all fields to be present
      strictMode: true,
      
      // Minimum solution length (characters)
      minSolutionLength: 100,
      
      // Flag for manual review if confidence < threshold
      confidenceThreshold: 0.8,
    },
  },

  // ===== MONGODB SETTINGS =====
  mongodb: {
    uri: process.env.MONGODB_URI,
    database: 'canvas',
    collection: 'questions_v2',
  },

  // ===== CLOUDFLARE R2 SETTINGS =====
  r2: {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucketName: process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets',
    publicUrl: process.env.R2_PUBLIC_URL,
  },

  // ===== CHAPTER MAPPING =====
  // Maps folder names to taxonomy chapter IDs
  chapterMapping: {
    // Exact matches (case-insensitive)
    'Alcohols, Phenols & Ethers': 'ch12_alcohols',
    'Aldehydes, Ketones and Carboxylic Acids': 'ch12_carbonyl',
    'Haloalkanes & Haloarenes': 'ch12_haloalkanes',
    'Amines': 'ch12_amines',
    'Biomolecules': 'ch12_biomolecules',
    'Chemical Kinetics': 'ch12_kinetics',
    'Electrochemistry': 'ch12_electrochem',
    'Solutions': 'ch12_solutions',
    'D & F Block': 'ch12_dblock',
    'P Block (12th)': 'ch12_pblock',
    'Coordination Compounds': 'ch12_coord',
    'Salt Analysis': 'ch12_salt',
    'Practical Physical Chemistry': 'ch12_prac_phys',
    
    // Class 11
    'Some Basic Concepts of Chemistry (Mole Concept)': 'ch11_mole',
    'Structure of Atom': 'ch11_atom',
    'Classification of Elements and Periodicity': 'ch11_periodic',
    'Chemical Bonding': 'ch11_bonding',
    'Thermodynamics': 'ch11_thermo',
    'Chemical Equilibrium': 'ch11_chem_eq',
    'Ionic Equilibrium': 'ch11_ionic_eq',
    'Redox Reactions': 'ch11_redox',
    'P Block (Class 11)': 'ch11_pblock',
    'GOC': 'ch11_goc',
    'Hydrocarbons': 'ch11_hydrocarbon',
    'Practical Organic Chemistry': 'ch11_prac_org',
    
    // Aliases (common variations)
    'Alcohols Phenols and Ethers': 'ch12_alcohols',
    'Alcohols': 'ch12_alcohols',
    'Aldehydes and Ketones': 'ch12_carbonyl',
    'Carboxylic Acids': 'ch12_carbonyl',
    'Haloalkanes': 'ch12_haloalkanes',
    'Kinetics': 'ch12_kinetics',
    'Mole Concept': 'ch11_mole',
    'Atomic Structure': 'ch11_atom',
    'Periodic Table': 'ch11_periodic',
    'Bonding': 'ch11_bonding',
    'Equilibrium': 'ch11_chem_eq',
  },

  // ===== EXAM METADATA PARSING =====
  // Regex patterns to extract exam metadata from folder names
  examPatterns: {
    // JEE Advanced: "2012-Paper1", "2013-P2", etc.
    jeeAdvanced: /(\d{4})-?(?:Paper|P)?\s*([12])/i,
    
    // JEE Main: "2024-Jan-24-Morning", "2024-Apr-25-Evening", etc.
    jeeMain: /(\d{4})-(\w+)-(\d{1,2})-(\w+)/i,
    
    // NEET: "2023", "2024-May", etc.
    neet: /(\d{4})(?:-(\w+))?/i,
  },

  // ===== LOGGING =====
  logging: {
    level: 'info', // 'debug', 'info', 'warn', 'error'
    console: true,
    file: true,
    maxFileSize: 10 * 1024 * 1024, // 10 MB
  },

  // ===== FEATURE FLAGS =====
  features: {
    // Enable diagram extraction and SVG conversion
    enableDiagramExtraction: true,
    
    // Enable solution generation (can disable to save costs during testing)
    enableSolutionGeneration: true,
    
    // Enable automatic MongoDB insertion (disable for dry-run)
    enableDatabaseInsertion: true,
    
    // Enable R2 upload for diagrams
    enableR2Upload: true,
    
    // Skip questions that already exist in DB (based on display_id)
    skipExisting: true,
  },
};

// Validation: Check required env vars
function validateConfig() {
  const required = [
    'MONGODB_URI',
  ];
  
  // R2 credentials are optional if diagram extraction is disabled
  if (config.features.enableDiagramExtraction) {
    required.push('R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY');
  }
  
  const aiProvider = config.ai.provider;
  if (aiProvider === 'claude') {
    required.push('ANTHROPIC_API_KEY');
  } else if (aiProvider === 'openai') {
    required.push('OPENAI_API_KEY');
  }
  
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Export
module.exports = config;
module.exports.validateConfig = validateConfig;
