// Stage 1: AI-powered question extraction from images
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs').promises;
const path = require('path');
const { retry } = require('./utils');

class QuestionExtractor {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    
    // Initialize AI client
    if (config.ai.provider === 'claude') {
      this.client = new Anthropic({
        apiKey: config.ai.claude.apiKey,
      });
    } else {
      throw new Error('Only Claude API is currently supported');
    }
    
    this.requestCount = 0;
    this.lastRequestTime = 0;
  }

  /**
   * Rate limiting to stay within API limits
   */
  async rateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minInterval = 60000 / this.config.ai.rateLimit.requestsPerMinute;
    
    if (timeSinceLastRequest < minInterval) {
      const waitTime = minInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  /**
   * Extract MULTIPLE questions from a single page image using Claude Vision API
   * Each page may contain 5-10 questions
   */
  async extractFromImage(imagePath, metadata = {}) {
    await this.logger.info(`Extracting questions from page: ${path.basename(imagePath)}`);
    
    // Read image and encode to base64
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = this.getMimeType(imagePath);

    // Build the extraction prompt for MULTIPLE questions
    const prompt = this.buildMultiQuestionExtractionPrompt(metadata);

    // Call Claude API with retry logic
    const response = await retry(
      async () => {
        await this.rateLimit();
        
        return await this.client.messages.create({
          model: this.config.ai.claude.model,
          max_tokens: this.config.ai.claude.maxTokens,
          temperature: this.config.ai.claude.temperature,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType,
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: prompt,
              },
            ],
          }],
        });
      },
      {
        attempts: this.config.ai.rateLimit.retryAttempts,
        delay: this.config.ai.rateLimit.retryDelay,
        onRetry: (error, attempt, waitTime) => {
          this.logger.warn(`API call failed (attempt ${attempt}), retrying in ${waitTime}ms`, { error: error.message });
        },
      }
    );

    // Parse the response - now returns ARRAY of questions
    const extractedText = response.content[0].text;
    const questionsArray = this.parseMultiQuestionResponse(extractedText);

    // Add metadata to each question
    questionsArray.forEach((questionData, index) => {
      questionData.metadata = {
        ...questionData.metadata,
        ...metadata,
        page_source: path.basename(imagePath),
        question_number_on_page: index + 1,
        extraction_confidence: this.calculateConfidence(questionData),
        api_model: this.config.ai.claude.model,
        extracted_at: new Date().toISOString(),
      };
    });

    await this.logger.info(`Extracted ${questionsArray.length} questions from page`, {
      page: path.basename(imagePath),
      questionCount: questionsArray.length,
    });

    return questionsArray;
  }

  /**
   * Build the extraction prompt for MULTIPLE questions per page
   */
  buildMultiQuestionExtractionPrompt(metadata) {
    const chapterInfo = metadata.chapterName 
      ? `This question is from the chapter: "${metadata.chapterName}".`
      : 'Determine the chapter from the question content.';

    const examInfo = metadata.exam
      ? `Exam: ${metadata.exam}${metadata.year ? ` (${metadata.year})` : ''}`
      : '';

    return `You are an expert chemistry question extractor. This image shows a PDF page containing MULTIPLE chemistry questions (typically 5-10 questions per page).

**YOUR TASK:** Extract ALL questions from this page in order, from top to bottom.

${examInfo}
${chapterInfo}

**CRITICAL INSTRUCTIONS:**

1. **Multiple Questions**: This page contains MULTIPLE questions. Extract ALL of them in sequential order.

2. **Question Text**: For each question, extract the complete question text with proper LaTeX formatting:
   - Use $...$ for inline math (e.g., $\\ce{H2O}$, $10^{-5}$)
   - Use $\\ce{...}$ for chemical formulas (e.g., $\\ce{NaOH}$, $\\ce{H2SO4}$)
   - Use $\\frac{numerator}{denominator}$ for fractions
   - Preserve all subscripts, superscripts, and special symbols
   - DO NOT use display math $$...$$ or \\[...\\]

2. **Question Type**: Identify the type:
   - SCQ: Single Correct Question (one correct option)
   - MCQ: Multiple Correct Questions (multiple correct options)
   - NVT: Numerical Value Type (integer answer)
   - MST: Matrix Match Type (matching pairs)
   - AR: Assertion-Reason

3. **Options**: For MCQ/SCQ, extract all options (a, b, c, d) with:
   - Proper LaTeX formatting
   - Identify which options are correct
   - If an option contains a diagram/structure, mark it as [DIAGRAM]

4. **Answer**: Extract the correct answer(s):
   - For SCQ: single option letter (e.g., "c")
   - For MCQ: array of correct options (e.g., ["a", "c"])
   - For NVT: numerical value (e.g., 5 or 2.5)
   - For MST: matching pairs object

5. **Diagrams**: Detect ALL diagrams, chemical structures, graphs, or tables:
   - Provide approximate bounding box coordinates (x, y, width, height) as percentages of image dimensions
   - Specify location: "question", "option_a", "option_b", etc.
   - Describe what the diagram shows (e.g., "benzene ring structure", "reaction mechanism", "graph of concentration vs time")
   - Mark if it's essential for solving the question

6. **Chapter Detection** (if not provided): Analyze the question content and determine the most appropriate chapter from this list:
   - Alcohols, Phenols & Ethers
   - Aldehydes, Ketones and Carboxylic Acids
   - Haloalkanes & Haloarenes
   - Amines
   - Chemical Kinetics
   - Electrochemistry
   - Solutions
   - Thermodynamics
   - Chemical Equilibrium
   - Ionic Equilibrium
   - GOC
   - Hydrocarbons
   - (and other standard chemistry chapters)

7. **Difficulty**: Estimate difficulty (Easy/Medium/Hard) based on:
   - Conceptual complexity
   - Number of steps required
   - Level of application needed

**OUTPUT FORMAT (strict JSON ARRAY):**

Return a JSON object with a "questions" array where each element is a question object.

Example structure:
- questions: array of question objects
- Each question has: question_number, question_text, type, options (if applicable), diagrams (if any), metadata

DO NOT include answers in the extraction - answers come from a separate answer key image.

**CRITICAL RULES:**
- Extract ALL questions on this page in sequential order (top to bottom)
- Number questions sequentially starting from 1
- DO NOT extract answers - answers will come from a separate answer key
- Be extremely accurate with LaTeX formatting
- Do NOT miss any diagrams or structures
- Bounding boxes should be percentages (0-100) of image dimensions
- If a question spans multiple lines or has parts, keep it as ONE question
- If you're unsure about something, indicate it in a "notes" field

**IMPORTANT:** Some questions may be split across pages. If you see a question that appears incomplete (e.g., "continued from previous page" or ends abruptly), extract what's visible and mark it with a note.

Now analyze the image and provide the complete JSON array of ALL questions on this page.`;
  }

  /**
   * Parse Claude's response for MULTIPLE questions
   */
  parseMultiQuestionResponse(responseText) {
    // Extract JSON from response (Claude might wrap it in markdown)
    let jsonText = responseText;
    
    // Remove markdown code blocks if present
    const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }

    try {
      const parsed = JSON.parse(jsonText);
      
      // Validate structure
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('Response must contain a "questions" array');
      }

      // Validate and normalize each question
      const questions = parsed.questions.map((q, index) => {
        if (!q.question_text) {
          throw new Error(`Question ${index + 1} missing question_text field`);
        }
        if (!q.type) {
          throw new Error(`Question ${index + 1} missing type field`);
        }

        return {
          question_text: q.question_text,
          type: q.type,
          options: q.options || [],
          answer: null, // Will be filled from answer key
          diagrams: q.diagrams || [],
          metadata: q.metadata || {},
          notes: q.notes || null,
          question_number_on_page: q.question_number || (index + 1),
        };
      });

      return questions;
    } catch (error) {
      this.logger.error('Failed to parse multi-question response', { error: error.message, responseText: responseText.substring(0, 500) });
      throw new Error(`JSON parsing failed: ${error.message}`);
    }
  }

  /**
   * Parse Claude's response and extract structured data (legacy single question)
   */
  parseExtractionResponse(responseText) {
    // Extract JSON from response (Claude might wrap it in markdown)
    let jsonText = responseText;
    
    // Remove markdown code blocks if present
    const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }

    try {
      const parsed = JSON.parse(jsonText);
      
      // Validate required fields
      if (!parsed.question_text) {
        throw new Error('Missing question_text field');
      }
      if (!parsed.type) {
        throw new Error('Missing type field');
      }

      // Normalize structure
      return {
        question_text: parsed.question_text,
        type: parsed.type,
        options: parsed.options || [],
        answer: parsed.answer || null,
        diagrams: parsed.diagrams || [],
        metadata: parsed.metadata || {},
        notes: parsed.notes || null,
      };
    } catch (error) {
      this.logger.error('Failed to parse extraction response', { error: error.message, responseText });
      throw new Error(`JSON parsing failed: ${error.message}`);
    }
  }

  /**
   * Calculate confidence score for the extraction
   */
  calculateConfidence(questionData) {
    let score = 1.0;

    // Penalize if missing critical fields
    if (!questionData.question_text || questionData.question_text.length < 20) {
      score -= 0.3;
    }
    if (!questionData.type) {
      score -= 0.2;
    }
    if (['SCQ', 'MCQ'].includes(questionData.type) && (!questionData.options || questionData.options.length < 4)) {
      score -= 0.2;
    }
    // Don't penalize for missing answer - it comes from answer key
    if (!questionData.metadata?.chapter) {
      score -= 0.1;
    }

    // Bonus for having diagrams detected
    if (questionData.diagrams && questionData.diagrams.length > 0) {
      score += 0.1;
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Get MIME type from file extension
   */
  getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
    };
    return mimeTypes[ext] || 'image/png';
  }

  /**
   * Get usage statistics
   */
  getStats() {
    return {
      totalRequests: this.requestCount,
      estimatedCost: this.requestCount * 0.003, // Rough estimate
    };
  }
}

module.exports = QuestionExtractor;
