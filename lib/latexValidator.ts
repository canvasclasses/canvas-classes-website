// ============================================
// LATEX VALIDATION UTILITY
// Real-time LaTeX syntax validation for admin dashboard
// ============================================

export interface LaTeXValidationResult {
  isValid: boolean;
  errors: Array<{
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning';
  }>;
  warnings: string[];
}

/**
 * Common LaTeX patterns and their validation rules
 */
const LATEX_PATTERNS = {
  // Math mode delimiters
  inlineMath: /\$([^$]+)\$/g,
  displayMath: /\$\$([^$]+)\$\$/g,
  
  // Common commands
  frac: /\\frac\{([^}]*)\}\{([^}]*)\}/g,
  sqrt: /\\sqrt(\[([^\]]*)\])?\{([^}]*)\}/g,
  sum: /\\sum_\{([^}]*)\}\^\{([^}]*)\}/g,
  int: /\\int_\{([^}]*)\}\^\{([^}]*)\}/g,
  
  // Brackets
  leftBracket: /\\left[\(\[\{|]/g,
  rightBracket: /\\right[\)\]\}|]/g,
  
  // Subscripts and superscripts
  subscript: /_\{([^}]*)\}/g,
  superscript: /\^\{([^}]*)\}/g,
  
  // Chemical formulas
  chemFormula: /\\ce\{([^}]*)\}/g,
  
  // Text in math mode
  text: /\\text\{([^}]*)\}/g,
};

/**
 * Validate LaTeX syntax in markdown text
 */
export function validateLaTeX(text: string): LaTeXValidationResult {
  const errors: LaTeXValidationResult['errors'] = [];
  const warnings: string[] = [];
  
  const lines = text.split('\n');
  
  lines.forEach((line, lineIndex) => {
    // Check for unmatched dollar signs
    const dollarSigns = (line.match(/\$/g) || []).length;
    if (dollarSigns % 2 !== 0) {
      errors.push({
        line: lineIndex + 1,
        column: line.lastIndexOf('$'),
        message: 'Unmatched $ delimiter - LaTeX math mode not closed',
        severity: 'error'
      });
    }
    
    // Check for unmatched braces
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push({
        line: lineIndex + 1,
        column: openBraces > closeBraces ? line.lastIndexOf('{') : line.lastIndexOf('}'),
        message: `Unmatched braces: ${openBraces} open, ${closeBraces} close`,
        severity: 'error'
      });
    }
    
    // Check for unmatched \left and \right
    const leftCount = (line.match(/\\left/g) || []).length;
    const rightCount = (line.match(/\\right/g) || []).length;
    if (leftCount !== rightCount) {
      errors.push({
        line: lineIndex + 1,
        column: 0,
        message: `Unmatched brackets: ${leftCount} \\left, ${rightCount} \\right`,
        severity: 'error'
      });
    }
    
    // Check for common LaTeX errors
    if (line.includes('\\frac{}')) {
      warnings.push(`Line ${lineIndex + 1}: Empty \\frac command`);
    }
    
    if (line.includes('\\sqrt{}')) {
      warnings.push(`Line ${lineIndex + 1}: Empty \\sqrt command`);
    }
    
    // Check for missing backslash on common commands
    const commonCommands = ['frac', 'sqrt', 'sum', 'int', 'lim', 'sin', 'cos', 'tan', 'log', 'ln'];
    commonCommands.forEach(cmd => {
      const regex = new RegExp(`(?<!\\\\)\\b${cmd}\\s*\\{`, 'g');
      if (regex.test(line)) {
        errors.push({
          line: lineIndex + 1,
          column: line.indexOf(cmd),
          message: `Missing backslash before ${cmd} command`,
          severity: 'error'
        });
      }
    });
    
    // Check for double backslashes (common typo)
    if (line.includes('\\\\\\')) {
      warnings.push(`Line ${lineIndex + 1}: Triple backslash detected - may cause issues`);
    }
    
    // Check for unclosed subscripts/superscripts
    const singleSubscript = line.match(/_[^{$\s]/g);
    const singleSuperscript = line.match(/\^[^{$\s]/g);
    if (singleSubscript && singleSubscript.length > 0) {
      warnings.push(`Line ${lineIndex + 1}: Single character subscript - consider using braces for clarity`);
    }
    if (singleSuperscript && singleSuperscript.length > 0) {
      warnings.push(`Line ${lineIndex + 1}: Single character superscript - consider using braces for clarity`);
    }
  });
  
  // Check for overall structure issues
  const fullText = text;
  
  // Check for nested math modes
  const nestedMath = /\$[^$]*\$[^$]*\$/g;
  if (fullText.match(/\$\$[^$]*\$[^$]*\$\$/)) {
    warnings.push('Nested math modes detected - may cause rendering issues');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Get LaTeX suggestions for common patterns
 */
export function getLatexSuggestions(text: string): string[] {
  const suggestions: string[] = [];
  
  // Suggest using \ce{} for chemical formulas
  if (/[A-Z][a-z]?[0-9]+/.test(text) && !text.includes('\\ce{')) {
    suggestions.push('Consider using \\ce{} for chemical formulas (e.g., \\ce{H2O})');
  }
  
  // Suggest using \text{} for text in math mode
  if (/\$[^$]*[a-z]{4,}[^$]*\$/.test(text) && !text.includes('\\text{')) {
    suggestions.push('Consider using \\text{} for words in math mode');
  }
  
  // Suggest using display math for complex equations
  const inlineMathCount = (text.match(/\$[^$]+\$/g) || []).length;
  const displayMathCount = (text.match(/\$\$[^$]+\$\$/g) || []).length;
  if (inlineMathCount > 3 && displayMathCount === 0) {
    suggestions.push('Consider using display math ($$...$$) for complex equations');
  }
  
  return suggestions;
}

/**
 * Auto-fix common LaTeX errors
 */
export function autoFixLatex(text: string): string {
  let fixed = text;
  
  // Fix common spacing issues
  fixed = fixed.replace(/\$\s+/g, '$');
  fixed = fixed.replace(/\s+\$/g, '$');
  
  // Fix double spaces
  fixed = fixed.replace(/\s{2,}/g, ' ');
  
  // Fix common command typos
  fixed = fixed.replace(/\\frac\s*\{/g, '\\frac{');
  fixed = fixed.replace(/\\sqrt\s*\{/g, '\\sqrt{');
  
  return fixed;
}

/**
 * Extract all LaTeX expressions from text
 */
export function extractLatexExpressions(text: string): Array<{ type: 'inline' | 'display', content: string, start: number, end: number }> {
  const expressions: Array<{ type: 'inline' | 'display', content: string, start: number, end: number }> = [];
  
  // Extract display math
  let match;
  const displayRegex = /\$\$([^$]+)\$\$/g;
  while ((match = displayRegex.exec(text)) !== null) {
    expressions.push({
      type: 'display',
      content: match[1],
      start: match.index,
      end: match.index + match[0].length
    });
  }
  
  // Extract inline math
  const inlineRegex = /\$([^$]+)\$/g;
  while ((match = inlineRegex.exec(text)) !== null) {
    // Skip if it's part of display math
    const isInDisplay = expressions.some(exp => 
      match!.index >= exp.start && match!.index <= exp.end
    );
    if (!isInDisplay) {
      expressions.push({
        type: 'inline',
        content: match[1],
        start: match.index,
        end: match.index + match[0].length
      });
    }
  }
  
  return expressions.sort((a, b) => a.start - b.start);
}
