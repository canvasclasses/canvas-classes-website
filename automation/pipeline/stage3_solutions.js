// Stage 3: AI-powered solution generation following QUESTION_INGESTION_WORKFLOW
const Anthropic = require('@anthropic-ai/sdk');
const { retry } = require('./utils');

class SolutionGenerator {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    
    if (config.ai.provider === 'claude') {
      this.client = new Anthropic({
        apiKey: config.ai.claude.apiKey,
      });
    }
    
    this.requestCount = 0;
    this.lastRequestTime = 0;
  }

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
   * Generate detailed step-by-step solution for a question
   */
  async generateSolution(questionData) {
    if (!this.config.features.enableSolutionGeneration) {
      await this.logger.warn('Solution generation disabled, skipping');
      return { solution: null, skipped: true };
    }

    await this.logger.info('Generating solution', { type: questionData.type });

    const prompt = this.buildSolutionPrompt(questionData);

    const response = await retry(
      async () => {
        await this.rateLimit();
        
        return await this.client.messages.create({
          model: this.config.ai.claude.model,
          max_tokens: this.config.ai.claude.maxTokens,
          temperature: 0.2, // Slightly higher for more natural explanations
          messages: [{
            role: 'user',
            content: prompt,
          }],
        });
      },
      {
        attempts: this.config.ai.rateLimit.retryAttempts,
        delay: this.config.ai.rateLimit.retryDelay,
        onRetry: (error, attempt, waitTime) => {
          this.logger.warn(`Solution generation failed (attempt ${attempt}), retrying in ${waitTime}ms`);
        },
      }
    );

    const solutionText = response.content[0].text;

    await this.logger.info('Solution generated successfully', {
      length: solutionText.length,
    });

    return {
      solution: solutionText,
      generated_at: new Date().toISOString(),
      model: this.config.ai.claude.model,
    };
  }

  /**
   * Build solution generation prompt following QUESTION_INGESTION_WORKFLOW
   */
  buildSolutionPrompt(questionData) {
    const { question_text, type, options, answer, metadata } = questionData;

    return `You are an expert chemistry educator creating detailed step-by-step solutions for JEE/NEET level questions. Generate a comprehensive solution following these strict formatting guidelines.

**QUESTION:**
${question_text}

${options && options.length > 0 ? `**OPTIONS:**
${options.map(opt => `${opt.id}) ${opt.text}`).join('\n')}` : ''}

**CORRECT ANSWER:** ${JSON.stringify(answer)}

**CHAPTER:** ${metadata.chapter || 'Unknown'}

**DIFFICULTY:** ${metadata.difficulty || 'Medium'}

---

**SOLUTION FORMAT REQUIREMENTS:**

1. **Structure**: Use clear step-by-step format with numbered steps
   - Start each major step with: **Step 1: [Brief title]**, **Step 2: [Brief title]**, etc.
   - Use \\n\\n for paragraph breaks (double newline)
   - End with **Key Points to Remember:** section

2. **LaTeX Formatting** (CRITICAL):
   - Use $...$ for inline math (e.g., $\\ce{H2O}$, $10^{-5}$, $\\frac{1}{2}$)
   - Use $\\ce{...}$ for ALL chemical formulas (e.g., $\\ce{NaOH}$, $\\ce{H2SO4}$)
   - Use $\\frac{numerator}{denominator}$ for fractions
   - NEVER use $$...$$ or \\[...\\] (display math)
   - NEVER use \\text{} inside math mode
   - Escape special characters: \\%, \\&, \\$

3. **Content Requirements**:
   - Explain the CONCEPT, not just the mechanism
   - Show WHY each step is taken
   - Explain why wrong options are incorrect (for MCQ/SCQ)
   - Include relevant chemical equations with proper balancing
   - Mention important exceptions or special cases
   - Connect to broader chemistry principles

4. **Key Points Section**:
   - End with: **Key Points to Remember:**
   - List 3-5 bullet points (use - for bullets)
   - Each point should be a concise takeaway

5. **Answer Indication**:
   - Clearly mark the final answer with ✓ symbol
   - For SCQ: "**Answer: (${typeof answer === 'string' ? answer : 'X'})** ✓"
   - For MCQ: "**Answers: (${Array.isArray(answer) ? answer.join(', ') : 'X, Y'})** ✓"
   - For NVT: "**Answer: ${typeof answer === 'number' ? answer : 'N'}** ✓"

**EXAMPLE FORMAT:**

**Step 1: Identify the reaction type**\\n\\n
This is an electrophilic aromatic substitution reaction. The $\\ce{-OH}$ group in phenol is a strong activating group due to its +M (mesomeric) effect, which increases electron density on the benzene ring, especially at ortho and para positions.\\n\\n

**Step 2: Analyze the electrophile**\\n\\n
Concentrated $\\ce{HNO3}$ generates the nitronium ion ($\\ce{NO2+}$) as the electrophile. The reaction is:\\n\\n
$\\ce{HNO3 + H2SO4 -> NO2+ + HSO4- + H2O}$\\n\\n

**Step 3: Determine the product**\\n\\n
Since phenol is highly activated, nitration occurs at multiple positions. With concentrated $\\ce{HNO3}$, we get trinitration at positions 2, 4, and 6, forming 2,4,6-trinitrophenol (picric acid).\\n\\n

**Answer: (c) 2,4,6-Trinitrophenol** ✓\\n\\n

**Key Points to Remember:**\\n
- Phenol is highly activated towards electrophilic substitution due to $\\ce{-OH}$ group.\\n
- Concentrated $\\ce{HNO3}$ leads to multiple nitrations.\\n
- Picric acid is a strong acid due to three electron-withdrawing $\\ce{-NO2}$ groups.\\n
- For mono-nitration, use dilute $\\ce{HNO3}$ at low temperature.

---

**NOW GENERATE THE SOLUTION:**

Provide ONLY the solution text in the exact format shown above. Do NOT include any JSON or additional commentary. Start directly with **Step 1:**.`;
  }

  getStats() {
    return {
      totalRequests: this.requestCount,
      estimatedCost: this.requestCount * 0.015,
    };
  }
}

module.exports = SolutionGenerator;
