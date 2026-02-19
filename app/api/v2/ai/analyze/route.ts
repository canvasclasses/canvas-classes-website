import { NextRequest, NextResponse } from 'next/server';

// AI-powered question analysis
// This will analyze question difficulty and suggest appropriate tags
// TODO: Integrate with OpenAI or other LLM for production

interface AnalysisResult {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  reasoning: string;
  confidence: number;
}

function analyzeQuestionDifficulty(questionText: string, solutionText: string): AnalysisResult {
  // Simple heuristic-based analysis (replace with actual AI in production)
  let difficultyScore = 0;
  const suggestedTags: string[] = [];
  
  // Factor 1: Question length
  if (questionText.length > 300) difficultyScore += 1;
  if (questionText.length > 500) difficultyScore += 1;
  
  // Factor 2: Mathematical complexity (LaTeX usage)
  const latexCount = (questionText.match(/\$/g) || []).length / 2;
  if (latexCount > 3) difficultyScore += 1;
  if (latexCount > 6) difficultyScore += 1;
  
  // Factor 3: Solution length (indicates complexity)
  if (solutionText.length > 400) difficultyScore += 1;
  if (solutionText.length > 800) difficultyScore += 1;
  
  // Factor 4: Number of steps in solution
  const stepCount = (solutionText.match(/Step \d+/gi) || []).length;
  if (stepCount > 3) difficultyScore += 1;
  if (stepCount > 5) difficultyScore += 1;
  
  // Factor 5: Complex mathematical operations
  const complexOperations = [
    '\\frac', '\\int', '\\sum', '\\prod', '\\lim', 
    '\\sqrt', '\\log', '\\ln', '\\exp', '\\sin', '\\cos'
  ];
  const complexCount = complexOperations.filter(op => 
    questionText.includes(op) || solutionText.includes(op)
  ).length;
  if (complexCount > 2) difficultyScore += 1;
  if (complexCount > 4) difficultyScore += 1;
  
  // Determine difficulty based on score
  let difficulty: 'Easy' | 'Medium' | 'Hard';
  if (difficultyScore <= 2) {
    difficulty = 'Easy';
  } else if (difficultyScore <= 5) {
    difficulty = 'Medium';
  } else {
    difficulty = 'Hard';
  }
  
  // Tag suggestions based on content
  const contentLower = (questionText + ' ' + solutionText).toLowerCase();
  
  // Chemistry-specific tags
  if (contentLower.includes('atom') || contentLower.includes('electron')) {
    suggestedTags.push('TAG_ATOMIC_STRUCTURE');
  }
  if (contentLower.includes('mole') || contentLower.includes('avogadro')) {
    suggestedTags.push('TAG_MOLE_CONCEPT');
  }
  if (contentLower.includes('equilibrium') || contentLower.includes('k_c') || contentLower.includes('k_p')) {
    suggestedTags.push('TAG_CHEMICAL_EQUILIBRIUM');
  }
  if (contentLower.includes('thermodynamic') || contentLower.includes('enthalpy') || contentLower.includes('entropy')) {
    suggestedTags.push('TAG_THERMODYNAMICS');
  }
  if (contentLower.includes('kinetic') || contentLower.includes('rate')) {
    suggestedTags.push('TAG_CHEMICAL_KINETICS');
  }
  if (contentLower.includes('bond') || contentLower.includes('molecular')) {
    suggestedTags.push('TAG_CHEMICAL_BONDING');
  }
  if (contentLower.includes('periodic') || contentLower.includes('element')) {
    suggestedTags.push('TAG_PERIODIC_TABLE');
  }
  if (contentLower.includes('organic') || contentLower.includes('hydrocarbon')) {
    suggestedTags.push('TAG_ORGANIC_CHEMISTRY');
  }
  if (contentLower.includes('solution') || contentLower.includes('solubility')) {
    suggestedTags.push('TAG_SOLUTIONS');
  }
  if (contentLower.includes('electro') || contentLower.includes('cell')) {
    suggestedTags.push('TAG_ELECTROCHEMISTRY');
  }
  
  // If no specific tags found, use general tag
  if (suggestedTags.length === 0) {
    suggestedTags.push('TAG_GENERAL_CHEMISTRY');
  }
  
  const reasoning = `Analysis based on: ${stepCount} solution steps, ${latexCount.toFixed(0)} LaTeX expressions, ${complexCount} complex operations, ${questionText.length} chars question length. Score: ${difficultyScore}/10`;
  
  return {
    difficulty,
    tags: suggestedTags,
    reasoning,
    confidence: Math.min(0.95, 0.6 + (difficultyScore / 20))
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question_text, solution_text } = body;
    
    if (!question_text || !solution_text) {
      return NextResponse.json(
        { success: false, error: 'Question text and solution text are required' },
        { status: 400 }
      );
    }
    
    // Analyze the question
    const analysis = analyzeQuestionDifficulty(question_text, solution_text);
    
    // TODO: In production, integrate with OpenAI or other LLM:
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [{
    //     role: "system",
    //     content: "You are an expert chemistry educator. Analyze the difficulty and suggest appropriate concept tags."
    //   }, {
    //     role: "user",
    //     content: `Question: ${question_text}\n\nSolution: ${solution_text}`
    //   }]
    // });
    
    return NextResponse.json({
      success: true,
      data: analysis,
      message: 'Question analyzed successfully'
    });
    
  } catch (error) {
    console.error('Error analyzing question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze question' },
      { status: 500 }
    );
  }
}
