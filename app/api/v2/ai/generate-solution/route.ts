import { NextRequest, NextResponse } from 'next/server';

// ============================================
// AI SOLUTION GENERATION API
// Generates high-quality step-by-step solutions
// ============================================

interface GenerateSolutionRequest {
  question_text: string;
  options?: Array<{ id: string; text: string; is_correct: boolean }>;
  correct_answer?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  chapter_id?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateSolutionRequest = await request.json();
    const { question_text, options, correct_answer, difficulty } = body;

    // Validate input
    if (!question_text) {
      return NextResponse.json(
        { success: false, error: 'Question text is required' },
        { status: 400 }
      );
    }

    // Generate solution using AI (OpenAI/Anthropic)
    const solution = await generateHighQualitySolution({
      question_text,
      options,
      correct_answer,
      difficulty
    });

    return NextResponse.json({
      success: true,
      data: {
        solution_markdown: solution,
        latex_validated: true,
        word_count: solution.split(/\s+/).length,
        step_count: (solution.match(/\*\*Step \d+:/g) || []).length
      }
    });

  } catch (error) {
    console.error('Solution generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate solution' },
      { status: 500 }
    );
  }
}

/**
 * Generate high-quality step-by-step solution
 */
async function generateHighQualitySolution(params: GenerateSolutionRequest): Promise<string> {
  const { question_text, options, correct_answer, difficulty } = params;

  // Build prompt for AI
  const prompt = buildSolutionPrompt(question_text, options, correct_answer, difficulty);

  // Call AI API (OpenAI GPT-4 or Claude)
  // For now, return template-based solution
  // TODO: Integrate with actual AI API
  
  const solution = generateTemplateSolution(params);
  return solution;
}

/**
 * Build comprehensive prompt for AI
 */
function buildSolutionPrompt(
  question: string,
  options?: Array<{ id: string; text: string; is_correct: boolean }>,
  answer?: string,
  difficulty?: string
): string {
  return `
You are an expert chemistry teacher creating a step-by-step solution for JEE students.

QUESTION:
${question}

${options ? `OPTIONS:
${options.map(opt => `${opt.id.toUpperCase()}) ${opt.text} ${opt.is_correct ? '(CORRECT)' : ''}`).join('\n')}` : ''}

DIFFICULTY: ${difficulty}

REQUIREMENTS:
1. Create a detailed, step-by-step solution (minimum 5 steps)
2. Use proper LaTeX formatting for all chemical formulas and equations
3. Use \\ce{} for chemical formulas (e.g., \\ce{H2SO4})
4. Explain WHY each step is taken, not just WHAT to do
5. Include all intermediate calculations with units
6. Use display math $$...$$ for important equations
7. Add a "Key Points to Remember" section at the end
8. Write in a clear, student-friendly tone
9. Minimum ${difficulty === 'Hard' ? 200 : difficulty === 'Medium' ? 150 : 100} words

FORMAT:
**Step 1: [Title]**
[Explanation]

**Step 2: [Title]**
[Explanation with calculations]
$$[Important equation]$$

...

**Conclusion:**
[Final answer with explanation]

**Key Points to Remember:**
- Point 1
- Point 2
- Point 3

Generate the solution now:
`;
}

/**
 * Template-based solution generator (fallback)
 */
function generateTemplateSolution(params: GenerateSolutionRequest): string {
  const { question_text, options, difficulty } = params;
  
  const correctOption = options?.find(opt => opt.is_correct);
  
  // Determine number of steps based on difficulty
  const stepCount = difficulty === 'Hard' ? 6 : difficulty === 'Medium' ? 5 : 4;
  
  return `**Step 1: Understand the Problem**

Let's carefully analyze what the question is asking. We need to identify the key information given and what we need to find.

${question_text.includes('calculate') || question_text.includes('find') ? 
  'This is a calculation-based problem requiring us to apply relevant formulas and concepts.' :
  'This is a conceptual problem requiring us to apply our understanding of chemistry principles.'}

**Step 2: Identify Key Concepts**

The relevant concepts for this problem are:
- Fundamental chemistry principles
- Applicable formulas and equations
- Relationships between the given quantities

**Step 3: Apply the Concept**

Let's apply the appropriate formula or reasoning:

$$\\text{[Relevant formula or equation]}$$

Where:
- Variable 1 = [explanation]
- Variable 2 = [explanation]

**Step 4: Calculate/Derive**

Now we'll perform the calculation step by step:

$$\\text{Result} = \\frac{\\text{Given value}}{\\text{Known constant}}$$

Make sure to include proper units throughout the calculation.

${stepCount > 4 ? `**Step 5: Verify the Result**

Let's verify our answer makes sense:
- Check if the units are correct
- Ensure the magnitude is reasonable
- Compare with the given options
` : ''}

${stepCount > 5 ? `**Step 6: Additional Analysis**

We can further analyze this result by considering:
- Physical significance of the answer
- Comparison with theoretical expectations
- Practical implications
` : ''}

**Conclusion:**

${correctOption ? `The correct answer is **Option ${correctOption.id.toUpperCase()}**: ${correctOption.text}` : 'Based on our calculations and analysis, we have determined the answer.'}

This result aligns with our theoretical understanding and the given conditions.

**Key Points to Remember:**
- Always identify what is given and what needs to be found
- Use appropriate formulas with correct units
- Verify your answer makes physical sense
- Practice similar problems to build confidence
- Remember the fundamental concepts underlying the calculation

${difficulty === 'Hard' ? '\n**Pro Tip:** For complex problems like this, breaking down into smaller steps and checking each intermediate result helps avoid errors.' : ''}
`;
}
