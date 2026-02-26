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
   * Extract question data from image using Claude Vision API
   */
  async extractFromImage(imagePath, metadata = {}) {
    await this.logger.info(`Extracting question from: ${path.basename(imagePath)}`);
    
    // Read image and encode to base64
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = this.getMimeType(imagePath);

    // Build the extraction prompt
    const prompt = this.buildExtractionPrompt(metadata);

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

    // Parse the response
    const extractedText = response.content[0].text;
    const questionData = this.parseExtractionResponse(extractedText);

    // Add metadata
    questionData.metadata = {
      ...questionData.metadata,
      ...metadata,
      extraction_confidence: this.calculateConfidence(questionData),
      api_model: this.config.ai.claude.model,
      extracted_at: new Date().toISOString(),
    };

    await this.logger.info('Question extracted successfully', {
      type: questionData.type,
      hasOptions: questionData.options?.length > 0,
      hasDiagrams: questionData.diagrams?.length > 0,
    });

    return questionData;
  }

  /**
   * Build the extraction prompt for Claude
   */
  buildExtractionPrompt(metadata) {
    const chapterInfo = metadata.chapterName 
      ? `This question is from the chapter: "${metadata.chapterName}".`
      : 'Determine the chapter from the question content.';

    const examInfo = metadata.exam
      ? `Exam: ${metadata.exam}${metadata.year ? ` (${metadata.year})` : ''}`
      : '';

    return `You are an expert chemistry question extractor. Analyze this image of a chemistry question and extract ALL information in a structured JSON format.

${examInfo}
${chapterInfo}

**CRITICAL INSTRUCTIONS:**

1. **Question Text**: Extract the complete question text with proper LaTeX formatting:
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

**OUTPUT FORMAT (strict JSON):**

\`\`\`json
{
  "question_text": "Complete question with proper LaTeX formatting",
  "type": "SCQ|MCQ|NVT|MST|AR",
  "options": [
    { "id": "a", "text": "Option text with LaTeX", "is_correct": true/false },
    { "id": "b", "text": "Option text with LaTeX", "is_correct": true/false },
    { "id": "c", "text": "Option text with LaTeX", "is_correct": true/false },
    { "id": "d", "text": "Option text with LaTeX", "is_correct": true/false }
  ],
  "answer": "c" or ["a", "c"] or 5 or {"p": "1", "q": "3", "r": "2", "s": "4"},
  "diagrams": [
    {
      "location": "question|option_a|option_b|option_c|option_d",
      "description": "What the diagram shows",
      "bbox": { "x": 10, "y": 20, "width": 30, "height": 25 },
      "essential": true/false
    }
  ],
  "metadata": {
    "chapter": "Chapter name from the list above",
    "difficulty": "Easy|Medium|Hard",
    "topics": ["Topic 1", "Topic 2"],
    "requires_diagram": true/false
  }
}
\`\`\`

**IMPORTANT:**
- Be extremely accurate with LaTeX formatting
- Do NOT miss any diagrams or structures
- Bounding boxes should be percentages (0-100) of image dimensions
- If you're unsure about something, indicate it in a "notes" field
- Extract EVERYTHING visible in the image

Now analyze the image and provide the complete JSON output.`;
  }

  /**
   * Parse Claude's response and extract structured data
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
    if (!questionData.answer) {
      score -= 0.2;
    }
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
