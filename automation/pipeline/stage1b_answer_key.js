// Stage 1B: Answer Key Extraction
// Extracts answers from answer key image and matches to questions

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs').promises;
const { retry } = require('./utils');

class AnswerKeyExtractor {
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
   * Extract answers from answer key image
   * @param {string} imagePath - Path to answer key image
   * @param {number} expectedCount - Expected number of answers
   * @returns {Array<string>} Array of answers in order (e.g., ['B', 'A', 'C', 'D'])
   */
  async extractAnswers(imagePath, expectedCount) {
    this.logger.info(`Extracting answer key from: ${imagePath}`);

    try {
      // Read and encode image
      const imageBuffer = await fs.readFile(imagePath);
      const base64Image = imageBuffer.toString('base64');
      const mediaType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

      // Rate limiting
      await this.rateLimit();

      // Construct prompt
      const prompt = this.buildPrompt(expectedCount);

      // Call Claude API
      const response = await retry(
        async () => {
          return await this.client.messages.create({
            model: this.config.ai.model,
            max_tokens: 2000,
            temperature: 0.1, // Low temperature for accuracy
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
            this.logger.warn(`Answer key extraction retry ${attempt}, waiting ${waitTime}ms`, { error: error.message });
          },
        }
      );

      // Parse response
      const textContent = response.content.find(c => c.type === 'text');
      if (!textContent) {
        throw new Error('No text content in API response');
      }

      const answers = this.parseAnswers(textContent.text, expectedCount);

      this.logger.info(`Extracted ${answers.length} answers from answer key`);
      return answers;

    } catch (error) {
      this.logger.error('Answer key extraction failed', { error: error.message, imagePath });
      throw error;
    }
  }

  /**
   * Build prompt for answer key extraction
   */
  buildPrompt(expectedCount) {
    return `You are extracting answers from an answer key image for chemistry questions.

TASK:
Extract ALL answers in order from this answer key image.

EXPECTED FORMAT:
The answer key should contain approximately ${expectedCount} answers.
Answers may be in formats like:
- "1. B  2. A  3. C  4. D"
- "Q1: B, Q2: A, Q3: C"
- Vertical list: "1. B\\n2. A\\n3. C"
- Table format with question numbers and answers

INSTRUCTIONS:
1. Extract ONLY the answer letter/number for each question
2. Maintain the exact order shown in the answer key
3. For MCQ (multiple correct), list all correct options (e.g., "A,C")
4. For numerical answers, extract the number exactly as shown
5. If an answer is unclear, use "?" as placeholder

OUTPUT FORMAT (JSON):
{
  "answers": ["B", "A", "C", "D", "A,C", "15.5", ...],
  "format_detected": "horizontal_list|vertical_list|table",
  "total_count": <number>,
  "notes": "Any observations about the answer key format"
}

CRITICAL:
- Maintain exact order from the answer key
- Do not skip any questions
- If you see ${expectedCount} questions but fewer answers, note this in "notes"
- Be precise - answer matching depends on correct order

Extract the answers now:`;
  }

  /**
   * Parse API response to extract answers array
   */
  parseAnswers(responseText, expectedCount) {
    try {
      // Try to find JSON in response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      if (!parsed.answers || !Array.isArray(parsed.answers)) {
        throw new Error('Invalid answer format in response');
      }

      const answers = parsed.answers.map(a => String(a).trim());

      // Validate count
      if (answers.length !== expectedCount) {
        this.logger.warn(
          `Answer count mismatch: expected ${expectedCount}, got ${answers.length}`,
          { notes: parsed.notes }
        );
      }

      // Log format detected
      if (parsed.format_detected) {
        this.logger.debug(`Answer key format: ${parsed.format_detected}`);
      }

      return answers;

    } catch (error) {
      this.logger.error('Failed to parse answer key response', { error: error.message, responseText });
      throw new Error(`Answer key parsing failed: ${error.message}`);
    }
  }

  /**
   * Match answers to questions
   * @param {Array<Object>} questions - Array of question objects
   * @param {Array<string>} answers - Array of answers from answer key
   * @returns {Array<Object>} Questions with matched answers
   */
  matchAnswersToQuestions(questions, answers) {
    if (questions.length !== answers.length) {
      this.logger.warn(
        `Question/answer count mismatch: ${questions.length} questions, ${answers.length} answers`
      );
    }

    return questions.map((question, index) => {
      const answer = answers[index];
      
      if (!answer || answer === '?') {
        this.logger.warn(`No answer found for question ${index + 1}`);
        return {
          ...question,
          answer: null,
          answer_source: 'missing',
        };
      }

      // Parse answer based on question type
      let parsedAnswer;
      if (question.type === 'SCQ') {
        // Single correct: should be single letter
        parsedAnswer = answer.toUpperCase();
      } else if (question.type === 'MCQ') {
        // Multiple correct: could be "A,C" or "AC"
        parsedAnswer = answer.toUpperCase().split(/[,\s]+/).filter(a => a);
      } else if (question.type === 'NVT') {
        // Numerical: parse as number
        parsedAnswer = parseFloat(answer);
      } else {
        parsedAnswer = answer;
      }

      return {
        ...question,
        answer: parsedAnswer,
        answer_source: 'answer_key',
      };
    });
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

module.exports = AnswerKeyExtractor;
