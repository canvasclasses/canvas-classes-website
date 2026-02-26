// Stage 5: MongoDB insertion with proper schema and metadata
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

class DatabaseInserter {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.connected = false;
  }

  async connect() {
    if (this.connected) return;

    await mongoose.connect(this.config.mongodb.uri);
    this.connected = true;
    await this.logger.info('Connected to MongoDB');
  }

  async disconnect() {
    if (!this.connected) return;

    await mongoose.disconnect();
    this.connected = false;
    await this.logger.info('Disconnected from MongoDB');
  }

  /**
   * Insert question into MongoDB questions_v2 collection
   */
  async insertQuestion(questionData, solutionData, validationResult, examMetadata) {
    if (!this.config.features.enableDatabaseInsertion) {
      await this.logger.warn('Database insertion disabled, skipping');
      return { inserted: false, skipped: true };
    }

    await this.connect();

    const col = mongoose.connection.db.collection(this.config.mongodb.collection);

    // Generate display_id
    const displayId = await this.generateDisplayId(col, validationResult.chapterId);

    // Check if question already exists
    if (this.config.features.skipExisting) {
      const existing = await col.findOne({ display_id: displayId });
      if (existing) {
        await this.logger.warn('Question already exists, skipping', { displayId });
        return { inserted: false, skipped: true, displayId, reason: 'already_exists' };
      }
    }

    // Build question document
    const questionDoc = this.buildQuestionDocument(
      displayId,
      questionData,
      solutionData,
      validationResult,
      examMetadata
    );

    // Insert into MongoDB
    try {
      await col.insertOne(questionDoc);
      await this.logger.info('Question inserted successfully', {
        displayId,
        questionId: questionDoc._id,
        chapterId: validationResult.chapterId,
      });

      return {
        inserted: true,
        questionId: questionDoc._id,
        displayId,
        chapterId: validationResult.chapterId,
      };
    } catch (error) {
      await this.logger.error('Failed to insert question', {
        displayId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Generate display_id with proper prefix and sequence
   * Following CANONICAL PREFIX TABLE from QUESTION_INGESTION_WORKFLOW
   */
  async generateDisplayId(collection, chapterId) {
    // CANONICAL PREFIX TABLE - ONE PREFIX PER CHAPTER
    const prefixMap = {
      // Class 11 chapters
      'ch11_atom': 'ATOM',
      'ch11_bonding': 'BOND',
      'ch11_chem_eq': 'CEQ',
      'ch11_goc': 'GOC',
      'ch11_hydrocarbon': 'HC',
      'ch11_ionic_eq': 'IEQ',
      'ch11_mole': 'MOLE',
      'ch11_pblock': 'PB11',
      'ch11_periodic': 'PERI',
      'ch11_prac_org': 'POC',
      'ch11_redox': 'RDX',
      'ch11_thermo': 'THERMO',
      // Class 12 chapters
      'ch12_alcohols': 'ALCO',
      'ch12_aldehydes': 'ALDO',
      'ch12_amines': 'AMIN',
      'ch12_biomolecules': 'BIO',
      'ch12_carbonyl': 'CARB',
      'ch12_coord': 'CORD',
      'ch12_dblock': 'DNF',
      'ch12_electrochem': 'EC',
      'ch12_haloalkanes': 'HALO',
      'ch12_kinetics': 'CK',
      'ch12_pblock': 'PB12',
      'ch12_phenols': 'PHEN',
      'ch12_solutions': 'SOL',
    };

    const prefix = prefixMap[chapterId];
    if (!prefix) {
      throw new Error(`No canonical prefix found for chapter_id: ${chapterId}. Check QUESTION_INGESTION_WORKFLOW.`);
    }

    // Find the highest existing sequence number for this prefix
    const docs = await collection.find(
      { display_id: new RegExp(`^${prefix}-`) },
      { projection: { display_id: 1 } }
    ).toArray();
    
    const numbers = docs
      .map(d => parseInt(d.display_id.split('-')[1]))
      .filter(n => !isNaN(n));

    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    const sequence = maxNumber + 1;

    return `${prefix}-${String(sequence).padStart(3, '0')}`;
  }

  /**
   * Build complete question document following QUESTION_INGESTION_WORKFLOW schema
   */
  buildQuestionDocument(displayId, questionData, solutionData, validationResult, examMetadata) {
    const now = new Date();

    // Build exam_source metadata (required for PYQs)
    let examSource = null;
    if (examMetadata) {
      examSource = {
        exam: examMetadata.exam, // "JEE Main" or "JEE Advanced" - exact spelling
      };
      if (examMetadata.year) examSource.year = examMetadata.year; // 4-digit integer
      if (examMetadata.month) examSource.month = examMetadata.month; // "Jan", "Apr", etc.
      if (examMetadata.day) examSource.day = examMetadata.day; // Integer
      if (examMetadata.shift) examSource.shift = examMetadata.shift; // "Morning", "Evening"
      if (examMetadata.paper) examSource.paper = examMetadata.paper; // "Paper 1", "Paper 2"
    }

    // Build tags array
    const tags = validationResult.suggestedTags || [];

    // Format answer based on question type
    let formattedAnswer;
    if (questionData.type === 'SCQ') {
      // Single correct: store as single letter string
      formattedAnswer = typeof questionData.answer === 'string' 
        ? questionData.answer 
        : questionData.answer?.correct_option || null;
    } else if (questionData.type === 'MCQ') {
      // Multiple correct: store as array of letters
      formattedAnswer = Array.isArray(questionData.answer) 
        ? questionData.answer 
        : [questionData.answer];
    } else if (questionData.type === 'NVT') {
      // Numerical: store as number
      formattedAnswer = typeof questionData.answer === 'number'
        ? questionData.answer
        : parseFloat(questionData.answer);
    } else {
      formattedAnswer = questionData.answer;
    }

    // Build document following QUESTION_INGESTION_WORKFLOW schema exactly
    const doc = {
      _id: uuidv4(), // UUID v4 string, NOT ObjectId
      display_id: displayId, // Top-level (required by schema)
      
      question_text: {
        markdown: questionData.question_text,
        latex_validated: validationResult.warnings.filter(w => w.includes('LaTeX')).length === 0,
      },
      
      type: questionData.type, // SCQ, MCQ, NVT, AR, MST, MTC
      
      options: questionData.options || [], // For SCQ/MCQ only
      
      answer: formattedAnswer, // Format depends on type
      
      solution: solutionData?.solution ? {
        text_markdown: solutionData.solution,
        latex_validated: validationResult.warnings.filter(w => w.includes('Solution LaTeX')).length === 0,
      } : null,
      
      metadata: {
        difficulty: questionData.metadata?.difficulty || 'Medium', // Easy, Medium, Hard
        chapter_id: validationResult.chapterId, // Exact from taxonomyData_from_csv.ts
        tags: tags, // Array of { tag_id, weight }
        is_pyq: examSource !== null,
        is_top_pyq: false,
        ...(examSource && { exam_source: examSource }), // Required for PYQs
      },
      
      status: validationResult.needsReview ? 'review' : 'review', // Always start in review
      version: 1,
      quality_score: Math.round(validationResult.confidence * 100),
      needs_review: validationResult.needsReview,
      
      created_by: 'automation_pipeline',
      updated_by: 'automation_pipeline',
      created_at: now,
      updated_at: now,
      deleted_at: null, // MUST be null explicitly, not undefined
      
      asset_ids: [], // For future diagram references
    };

    // Add automation metadata for debugging (not part of schema)
    if (this.config.features.includeDebugMetadata) {
      doc._automation_metadata = {
        extraction_confidence: validationResult.confidence,
        validation_errors: validationResult.errors,
        validation_warnings: validationResult.warnings,
        has_diagrams: questionData.diagrams?.length > 0,
        diagram_count: questionData.diagrams?.length || 0,
        ai_model: questionData.metadata?.api_model,
        generated_at: questionData.metadata?.extracted_at,
        answer_source: questionData.answer_source,
        solution_source: questionData.solution_source,
      };
    }

    return doc;
  }

  /**
   * Get statistics about inserted questions
   */
  async getInsertionStats(chapterId = null) {
    await this.connect();
    const col = mongoose.connection.db.collection(this.config.mongodb.collection);

    const query = chapterId ? { 'metadata.chapter_id': chapterId } : {};

    const stats = await col.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          published: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
          },
          review: {
            $sum: { $cond: [{ $eq: ['$status', 'review'] }, 1, 0] }
          },
          avgQuality: { $avg: '$quality_score' },
        }
      }
    ]).toArray();

    return stats[0] || { total: 0, published: 0, review: 0, avgQuality: 0 };
  }
}

module.exports = DatabaseInserter;
