// Stage 3B: Solutions Matcher
// Extracts solutions from images or generates them if missing

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs').promises;
const { retry } = require('./utils');

class SolutionsMatcher {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.client = new Anthropic({
      apiKey: config.ai.apiKey,
    });
    this.requestCount = 0;
    this.lastRequestTime = 0;
  }

  /**
   * Rate limiting
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
   * Extract solution from image
   * @param {string} imagePath - Path to solution image
   * @param {Object} question - Question object for context
   * @returns {string} Solution markdown
   */
  async extractSolution(imagePath, question) {
    this.logger.info(`Extracting solution from: ${imagePath}`);

    try {
      // Read and encode image
      const imageBuffer = await fs.readFile(imagePath);
      const base64Image = imageBuffer.toString('base64');
      const mediaType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

      // Rate limiting
      await this.rateLimit();

      // Construct prompt
      const prompt = this.buildExtractionPrompt(question);

      // Call Claude API
      const response = await retry(
        async () => {
          return await this.client.messages.create({
            model: this.config.ai.model,
            max_tokens: 4000,
            temperature: 0.2,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'image',
                    source: {
                      type: 'base64',
                      media_type: mediaType,
                      data: base64Image,
                    },
                  },
                  {
                    type: 'text',
                    text: prompt,
                  },
                ],
              },
            ],
          });
        },
        {
          attempts: this.config.ai.rateLimit.retryAttempts,
          delay: 2000,
          backoff: 2,
          onRetry: (error, attempt, waitTime) => {
            this.logger.warn(`Solution extraction retry ${attempt}, waiting ${waitTime}ms`, { error: error.message });
          },
        }
      );

      // Parse response
      const textContent = response.content.find(c => c.type === 'text');
      if (!textContent) {
        throw new Error('No text content in API response');
      }

      const solution = this.parseSolution(textContent.text);
      this.logger.info(`Extracted solution (${solution.length} chars)`);
      
      return solution;

    } catch (error) {
      this.logger.error('Solution extraction failed', { error: error.message, imagePath });
      throw error;
    }
  }

  /**
   * Build prompt for solution extraction
   */
  buildExtractionPrompt(question) {
    return `You are extracting a chemistry solution from an image.

QUESTION CONTEXT:
${question.question_text?.markdown || question.text || 'Question not provided'}

TASK:
Extract the complete solution from this image and format it according to STRICT rules.

FORMATTING RULES (CRITICAL):
1. **LaTeX Math:**
   - Use $...$ for ALL math (NEVER use $$...$$)
   - Chemical formulas: \\ce{H2O}, \\ce{CaCO3}
   - Fractions: \\frac{numerator}{denominator}
   - Greek letters: \\Delta, \\alpha, \\beta
   - Arrows: \\rightarrow, \\leftarrow, \\rightleftharpoons

2. **Solution Structure:**
   - Use **Step 1: [description]** format for headers
   - Minimum 3 steps required
   - Each step must explain WHY, not just WHAT
   - Include all calculations with units
   - End with **Key Points to Remember:** section

3. **Markdown:**
   - Bold headers: **Step 1:**
   - Bullet points: - Point
   - No Unicode arrows outside math (use \\Rightarrow inside $...$)

4. **Quality Standards:**
   - Minimum 80 words for SCQ/MCQ
   - Minimum 60 words for NVT
   - Show ALL intermediate steps
   - Include units in calculations

OUTPUT FORMAT:
Return ONLY the solution markdown, no JSON wrapper.

Example:
**Step 1: Understand the Problem**
We need to calculate the pH of the solution.

**Step 2: Identify Key Concepts**
pH is calculated using: $\\text{pH} = -\\log[\\ce{H+}]$

**Step 3: Calculate**
$[\\ce{H+}] = 1 \\times 10^{-3}$ M
$\\text{pH} = -\\log(10^{-3}) = 3$

**Key Points to Remember:**
- pH scale ranges from 0-14
- Lower pH means more acidic

Extract the solution now:`;
  }

  /**
   * Generate solution using AI (when image not available)
   * @param {Object} question - Question object
   * @returns {string} Generated solution markdown
   */
  async generateSolution(question) {
    this.logger.info(`Generating solution for question: ${question.display_id || 'unknown'}`);

    try {
      // Rate limiting
      await this.rateLimit();

      // Construct prompt
      const prompt = this.buildGenerationPrompt(question);

      // Call Claude API
      const response = await retry(
        async () => {
          return await this.client.messages.create({
            model: this.config.ai.model,
            max_tokens: 4000,
            temperature: 0.3,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
          });
        },
        {
          attempts: this.config.ai.rateLimit.retryAttempts,
          delay: 2000,
          backoff: 2,
          onRetry: (error, attempt, waitTime) => {
            this.logger.warn(`Solution generation retry ${attempt}, waiting ${waitTime}ms`, { error: error.message });
          },
        }
      );

      // Parse response
      const textContent = response.content.find(c => c.type === 'text');
      if (!textContent) {
        throw new Error('No text content in API response');
      }

      const solution = this.parseSolution(textContent.text);
      this.logger.info(`Generated solution (${solution.length} chars)`);
      
      return solution;

    } catch (error) {
      this.logger.error('Solution generation failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Build prompt for solution generation
   */
  buildGenerationPrompt(question) {
    const optionsText = question.options
      ?.map(opt => `${opt.id.toUpperCase()}) ${opt.text}`)
      .join('\n') || '';

    const answerText = question.answer 
      ? `Correct Answer: ${Array.isArray(question.answer) ? question.answer.join(', ') : question.answer}`
      : '';

    return `You are generating a detailed step-by-step solution for a chemistry question.

QUESTION:
${question.question_text?.markdown || question.text}

${optionsText ? `OPTIONS:\n${optionsText}\n` : ''}
${answerText}

DIFFICULTY: ${question.metadata?.difficulty || 'Medium'}
CHAPTER: ${question.metadata?.chapter_id || 'Unknown'}

TASK:
Generate a complete, detailed solution following STRICT formatting rules.

FORMATTING RULES (CRITICAL):
1. **LaTeX Math:**
   - Use $...$ for ALL math (NEVER use $$...$$)
   - Chemical formulas: \\ce{H2O}, \\ce{CaCO3}
   - Fractions: \\frac{numerator}{denominator}
   - Greek letters: \\Delta, \\alpha, \\beta
   - Arrows: \\rightarrow, \\leftarrow, \\rightleftharpoons
   - NO Unicode arrows outside math blocks

2. **Solution Structure (MANDATORY):**
   **Step 1: Understand the Problem**
   [Brief explanation of what's being asked]

   **Step 2: Identify Key Concepts**
   [List relevant chemistry concepts/formulas]

   **Step 3: Apply the Concept**
   [Show reasoning and setup]

   **Step 4: Calculate/Derive**
   [Step-by-step calculation with units]

   **Step 5: Conclusion**
   [Final answer with explanation]

   **Key Points to Remember:**
   - Point 1
   - Point 2
   - Point 3

3. **Quality Standards:**
   - Minimum 80 words for SCQ/MCQ
   - Minimum 60 words for NVT
   - Show ALL intermediate calculations
   - Explain WHY each step is taken
   - Include units in all calculations
   - Use proper LaTeX for all math

4. **Chemistry-Specific:**
   - Use \\ce{} for all chemical formulas
   - Show balanced equations
   - Include reaction conditions
   - Explain mechanisms when relevant

OUTPUT:
Return ONLY the solution markdown, no JSON wrapper, no preamble.

Generate the solution now:`;
  }

  /**
   * Parse solution from API response
   */
  parseSolution(responseText) {
    // Remove any JSON wrappers if present
    let solution = responseText.trim();
    
    // Try to extract from JSON if wrapped
    const jsonMatch = solution.match(/\{[\s\S]*"solution":\s*"([\s\S]*)"\s*\}/);
    if (jsonMatch) {
      solution = jsonMatch[1]
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
    }

    // Remove markdown code blocks if present
    solution = solution.replace(/^```(?:markdown)?\n?/gm, '').replace(/\n?```$/gm, '');

    return solution.trim();
  }

  /**
   * Match solutions to questions
   * @param {Array<Object>} questions - Array of question objects
   * @param {Map<number, string>} solutionImages - Map of question number to solution image path
   * @returns {Array<Object>} Questions with solutions
   */
  async matchSolutions(questions, solutionImages) {
    const results = [];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const questionNum = i + 1;
      
      try {
        let solution;
        let solutionSource;

        // Check if solution image exists
        if (solutionImages.has(questionNum)) {
          const solutionPath = solutionImages.get(questionNum);
          this.logger.info(`[${questionNum}/${questions.length}] Extracting solution from image`);
          solution = await this.extractSolution(solutionPath, question);
          solutionSource = 'image';
        } else {
          this.logger.info(`[${questionNum}/${questions.length}] Generating solution (no image)`);
          solution = await this.generateSolution(question);
          solutionSource = 'generated';
        }

        results.push({
          ...question,
          solution: {
            text_markdown: solution,
            latex_validated: false, // Will be validated in stage 4
          },
          solution_source: solutionSource,
        });

      } catch (error) {
        this.logger.error(`Failed to get solution for question ${questionNum}`, { error: error.message });
        results.push({
          ...question,
          solution: null,
          solution_source: 'failed',
          solution_error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Get API usage stats
   */
  getStats() {
    return {
      requestCount: this.requestCount,
    };
  }
}

module.exports = SolutionsMatcher;
