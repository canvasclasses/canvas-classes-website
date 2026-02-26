// Stage 4: Validation and quality checks
const { TAXONOMY_FROM_CSV } = require('../../app/crucible/admin/taxonomy/taxonomyData_from_csv');

class QuestionValidator {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    
    // Build chapter ID lookup
    this.chapterIds = new Set(
      TAXONOMY_FROM_CSV
        .filter(node => node.type === 'chapter')
        .map(ch => ch.id)
    );
    
    // Build tag ID lookup
    this.tagIds = new Set(
      TAXONOMY_FROM_CSV
        .filter(node => node.type === 'topic')
        .map(tag => tag.id)
    );
  }

  /**
   * Validate extracted question data
   */
  async validate(questionData, solutionData) {
    const errors = [];
    const warnings = [];

    // 1. Required fields validation
    if (!questionData.question_text || questionData.question_text.trim().length < 10) {
      errors.push('Question text is missing or too short');
    }

    if (!questionData.type || !['SCQ', 'MCQ', 'NVT', 'MST', 'AR'].includes(questionData.type)) {
      errors.push(`Invalid question type: ${questionData.type}`);
    }

    // 2. Type-specific validation
    if (['SCQ', 'MCQ'].includes(questionData.type)) {
      if (!questionData.options || questionData.options.length < 4) {
        errors.push('MCQ/SCQ must have at least 4 options');
      }

      const correctOptions = questionData.options?.filter(opt => opt.is_correct) || [];
      if (questionData.type === 'SCQ' && correctOptions.length !== 1) {
        errors.push(`SCQ must have exactly 1 correct option, found ${correctOptions.length}`);
      }
      if (questionData.type === 'MCQ' && correctOptions.length < 1) {
        errors.push('MCQ must have at least 1 correct option');
      }
    }

    if (questionData.type === 'NVT') {
      if (questionData.answer === null || questionData.answer === undefined) {
        errors.push('NVT must have a numerical answer');
      }
    }

    // 3. Answer validation
    if (!questionData.answer && questionData.answer !== 0) {
      errors.push('Answer is missing');
    }

    // 4. LaTeX validation
    const latexIssues = this.validateLatex(questionData.question_text);
    if (latexIssues.length > 0) {
      warnings.push(...latexIssues.map(issue => `Question LaTeX: ${issue}`));
    }

    if (questionData.options) {
      for (const option of questionData.options) {
        const optionLatexIssues = this.validateLatex(option.text);
        if (optionLatexIssues.length > 0) {
          warnings.push(...optionLatexIssues.map(issue => `Option ${option.id} LaTeX: ${issue}`));
        }
      }
    }

    // 5. Solution validation
    if (solutionData && solutionData.solution) {
      if (solutionData.solution.length < this.config.processing.validation.minSolutionLength) {
        warnings.push(`Solution is short (${solutionData.solution.length} chars)`);
      }

      const solutionLatexIssues = this.validateLatex(solutionData.solution);
      if (solutionLatexIssues.length > 0) {
        warnings.push(...solutionLatexIssues.map(issue => `Solution LaTeX: ${issue}`));
      }

      // Check for required solution components
      if (!solutionData.solution.includes('**Step')) {
        warnings.push('Solution missing step-by-step format');
      }
      if (!solutionData.solution.includes('Key Points to Remember')) {
        warnings.push('Solution missing "Key Points to Remember" section');
      }
    } else if (this.config.features.enableSolutionGeneration) {
      warnings.push('Solution is missing');
    }

    // 6. Chapter validation
    const chapterId = this.mapChapterToId(questionData.metadata?.chapter);
    if (!chapterId) {
      errors.push(`Invalid or missing chapter: ${questionData.metadata?.chapter}`);
    } else if (!this.chapterIds.has(chapterId)) {
      errors.push(`Chapter ID not found in taxonomy: ${chapterId}`);
    }

    // 7. Metadata validation
    if (!questionData.metadata?.difficulty || !['Easy', 'Medium', 'Hard'].includes(questionData.metadata.difficulty)) {
      warnings.push(`Invalid difficulty: ${questionData.metadata?.difficulty}`);
    }

    // 8. Confidence check
    const confidence = questionData.metadata?.extraction_confidence || 0;
    if (confidence < this.config.processing.validation.confidenceThreshold) {
      warnings.push(`Low extraction confidence: ${confidence.toFixed(2)}`);
    }

    // 9. Diagram validation
    if (questionData.diagrams && questionData.diagrams.length > 0) {
      for (const diagram of questionData.diagrams) {
        if (!diagram.bbox || !diagram.location) {
          warnings.push('Diagram missing bbox or location');
        }
      }
    }

    const isValid = errors.length === 0;
    const needsReview = !isValid || 
                        warnings.length > 0 || 
                        confidence < this.config.processing.validation.confidenceThreshold;

    await this.logger.info('Validation complete', {
      isValid,
      needsReview,
      errorCount: errors.length,
      warningCount: warnings.length,
    });

    return {
      isValid,
      needsReview,
      errors,
      warnings,
      confidence,
      chapterId,
    };
  }

  /**
   * Validate LaTeX formatting
   */
  validateLatex(text) {
    if (!text) return [];

    const issues = [];

    // Check for forbidden constructs
    if (text.includes('$$') || text.includes('\\[') || text.includes('\\]')) {
      issues.push('Contains display math ($$...$$, \\[...\\]) - use inline $...$ only');
    }

    if (text.includes('\\text{') && text.match(/\$[^$]*\\text\{/)) {
      issues.push('Contains \\text{} inside math mode - avoid this');
    }

    if (text.includes('\\begin{align') || text.includes('\\begin{equation')) {
      issues.push('Contains LaTeX environments - use inline math only');
    }

    // Check for unescaped special characters
    const unescapedSpecial = text.match(/(?<!\\)[%&$]/g);
    if (unescapedSpecial) {
      issues.push(`Unescaped special characters: ${unescapedSpecial.join(', ')}`);
    }

    // Check for unmatched $ delimiters
    const dollarCount = (text.match(/\$/g) || []).length;
    if (dollarCount % 2 !== 0) {
      issues.push('Unmatched $ delimiters');
    }

    // Check for unmatched braces in math mode
    const mathBlocks = text.match(/\$[^$]+\$/g) || [];
    for (const block of mathBlocks) {
      const openBraces = (block.match(/\{/g) || []).length;
      const closeBraces = (block.match(/\}/g) || []).length;
      if (openBraces !== closeBraces) {
        issues.push(`Unmatched braces in math: ${block.substring(0, 50)}...`);
      }
    }

    // Check for chemical formulas without \ce{}
    const chemicalPattern = /\$(?!\\ce\{)[^$]*[A-Z][a-z]?[0-9]/;
    if (chemicalPattern.test(text)) {
      issues.push('Chemical formulas should use \\ce{} command');
    }

    return issues;
  }

  /**
   * Map chapter name to chapter_id using config mapping
   */
  mapChapterToId(chapterName) {
    if (!chapterName) return null;

    const normalized = chapterName.trim();
    
    // Try exact match
    for (const [key, value] of Object.entries(this.config.chapterMapping)) {
      if (key.toLowerCase() === normalized.toLowerCase()) {
        return value;
      }
    }

    // Try partial match
    for (const [key, value] of Object.entries(this.config.chapterMapping)) {
      if (normalized.toLowerCase().includes(key.toLowerCase()) ||
          key.toLowerCase().includes(normalized.toLowerCase())) {
        return value;
      }
    }

    return null;
  }

  /**
   * Suggest tags based on chapter and question content
   */
  suggestTags(chapterId, questionText) {
    // Get all tags for this chapter
    const chapterTags = TAXONOMY_FROM_CSV
      .filter(node => node.type === 'topic' && node.parent_id === chapterId)
      .map(tag => ({ id: tag.id, name: tag.name }));

    if (chapterTags.length === 0) {
      return [];
    }

    // Simple keyword matching (can be enhanced with AI later)
    const lowerText = questionText.toLowerCase();
    const scoredTags = chapterTags.map(tag => {
      const keywords = tag.name.toLowerCase().split(/[\s,&()]+/);
      let score = 0;
      for (const keyword of keywords) {
        if (keyword.length > 3 && lowerText.includes(keyword)) {
          score++;
        }
      }
      return { ...tag, score };
    });

    // Return top 3 tags
    return scoredTags
      .filter(tag => tag.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(tag => ({ tag_id: tag.id, weight: 1.0 }));
  }
}

module.exports = QuestionValidator;
