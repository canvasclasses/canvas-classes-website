import { NextRequest, NextResponse } from 'next/server';

// LaTeX validation rules
interface ValidationIssue {
  type: 'error' | 'warning';
  message: string;
  line?: number;
  suggestion?: string;
}

function validateLatex(text: string): { valid: boolean; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  
  // Rule 1: Check for $$ (should use $ $ instead)
  if (text.includes('$$')) {
    issues.push({
      type: 'error',
      message: 'Use $ $ instead of $$',
      suggestion: 'Replace $$ with $ $ (space-separated)'
    });
  }
  
  // Rule 2: Check for missing spaces around $ delimiters
  const missingSpaceBefore = /[^\s\\]\$/g;
  const missingSpaceAfter = /\$[^\s$]/g;
  
  if (missingSpaceBefore.test(text)) {
    issues.push({
      type: 'warning',
      message: 'Missing space before $ delimiter',
      suggestion: 'Add space before $ for better rendering'
    });
  }
  
  if (missingSpaceAfter.test(text)) {
    issues.push({
      type: 'warning',
      message: 'Missing space after $ delimiter',
      suggestion: 'Add space after $ for better rendering'
    });
  }
  
  // Rule 3: Check for unmatched $ delimiters
  const dollarCount = (text.match(/\$/g) || []).length;
  if (dollarCount % 2 !== 0) {
    issues.push({
      type: 'error',
      message: 'Unmatched $ delimiter',
      suggestion: 'Ensure all $ delimiters are properly paired'
    });
  }
  
  // Rule 4: Check for common LaTeX errors
  const commonErrors = [
    { pattern: /\\frac\s*\{[^}]*\}\s*\{[^}]*\}/g, error: false },
    { pattern: /\\times(?!\s)/g, error: true, message: 'Missing space after \\times' },
    { pattern: /\\div(?!\s)/g, error: true, message: 'Missing space after \\div' },
    { pattern: /\\pm(?!\s)/g, error: true, message: 'Missing space after \\pm' },
  ];
  
  commonErrors.forEach(({ pattern, error, message }) => {
    if (error && pattern.test(text)) {
      issues.push({
        type: 'warning',
        message: message || 'LaTeX formatting issue',
        suggestion: 'Add proper spacing around operators'
      });
    }
  });
  
  // Rule 5: Check for proper superscript/subscript syntax
  if (text.includes('^') && !text.match(/\^(\{[^}]+\}|\d)/)) {
    issues.push({
      type: 'warning',
      message: 'Superscript may need braces',
      suggestion: 'Use ^{text} for multi-character superscripts'
    });
  }
  
  if (text.includes('_') && !text.match(/_(\{[^}]+\}|\d)/)) {
    issues.push({
      type: 'warning',
      message: 'Subscript may need braces',
      suggestion: 'Use _{text} for multi-character subscripts'
    });
  }
  
  // Rule 6: Check for proper fraction syntax
  if (text.includes('\\frac') && !text.match(/\\frac\s*\{[^}]*\}\s*\{[^}]*\}/)) {
    issues.push({
      type: 'error',
      message: 'Invalid \\frac syntax',
      suggestion: 'Use \\frac{numerator}{denominator}'
    });
  }
  
  // Rule 7: Check for proper chemical formula syntax
  if (text.match(/[A-Z][a-z]?\d+/) && !text.includes('\\mathrm')) {
    issues.push({
      type: 'warning',
      message: 'Chemical formulas should use \\mathrm{}',
      suggestion: 'Wrap chemical formulas in \\mathrm{} for proper formatting'
    });
  }
  
  // Rule 8: Check for proper unit formatting
  const unitPattern = /\d+\s*(nm|pm|kg|g|mol|L|mL|K|°C|J|kJ|eV)/g;
  const matches = text.match(unitPattern);
  if (matches) {
    matches.forEach(match => {
      if (!match.includes('\\mathrm') && !match.includes('\\text')) {
        issues.push({
          type: 'warning',
          message: `Unit "${match}" should be formatted properly`,
          suggestion: 'Use \\mathrm{} or \\text{} for units'
        });
      }
    });
  }
  
  return {
    valid: issues.filter(i => i.type === 'error').length === 0,
    issues
  };
}

// Auto-fix common LaTeX issues
function autoFixLatex(text: string): string {
  let fixed = text;
  
  // Fix 1: Replace $$ with $ $
  fixed = fixed.replace(/\$\$/g, '$ $');
  
  // Fix 2: Add spaces around $ delimiters
  fixed = fixed.replace(/([^\s\\])(\$)/g, '$1 $2');
  fixed = fixed.replace(/(\$)([^\s$])/g, '$1 $2');
  
  // Fix 3: Fix multiple spaces
  fixed = fixed.replace(/\s+/g, ' ');
  
  // Fix 4: Add spaces after operators
  fixed = fixed.replace(/\\times(?!\s)/g, '\\times ');
  fixed = fixed.replace(/\\div(?!\s)/g, '\\div ');
  fixed = fixed.replace(/\\pm(?!\s)/g, '\\pm ');
  
  // Fix 5: Add spaces after commas
  fixed = fixed.replace(/,(?!\s)/g, ', ');
  
  return fixed;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, autoFix = false } = body;
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      );
    }
    
    // Validate LaTeX
    const validation = validateLatex(text);
    
    // Auto-fix if requested
    let fixedText = text;
    if (autoFix && !validation.valid) {
      fixedText = autoFixLatex(text);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        original: text,
        fixed: autoFix ? fixedText : undefined,
        validation: {
          valid: validation.valid,
          issues: validation.issues,
          errorCount: validation.issues.filter(i => i.type === 'error').length,
          warningCount: validation.issues.filter(i => i.type === 'warning').length
        }
      }
    });
    
  } catch (error) {
    console.error('Error validating LaTeX:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate LaTeX' },
      { status: 500 }
    );
  }
}
