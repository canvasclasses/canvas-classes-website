const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error("MONGODB_URI not set.");
    process.exit(1);
}

const questionSchema = new mongoose.Schema({
    _id: String
}, { strict: false, _id: false });

const Question = mongoose.model('Question', questionSchema);

async function main() {
    await mongoose.connect(MongoDB);
    console.log('Connected to MongoDB\n');

    // Check Atomic Structure chapter
    console.log('='.repeat(60));
    console.log('ATOMIC STRUCTURE CHAPTER VERIFICATION');
    console.log('='.repeat(60));
    
    const atomicQuestions = await Question.find({ 
        chapterId: 'chapter_atomic_structure' 
    }).lean();
    
    console.log(`Total Atomic Structure questions in MongoDB: ${atomicQuestions.length}`);
    
    // Check specific enhanced questions
    const enhancedAtoms = ['ATOM-011', 'ATOM-016', 'ATOM-017'];
    enhancedAtoms.forEach(id => {
        const q = atomicQuestions.find(q => q._id === id);
        if (q) {
            const solutionText = q.solution?.text_latex || q.solution?.textSolutionLatex || '';
            const hasSteps = solutionText.includes('**Step');
            console.log(`${id}: Enhanced solution ${hasSteps ? '✓ YES' : '✗ NO'}`);
            console.log(`  Text: ${solutionText.substring(0, 50)}...`);
        } else {
            console.log(`${id}: NOT FOUND`);
        }
    });

    // Check Mole Concept chapter
    console.log('\n' + '='.repeat(60));
    console.log('MOLE CONCEPT CHAPTER VERIFICATION');
    console.log('='.repeat(60));
    
    const moleQuestions = await Question.find({ 
        chapterId: 'chapter_basic_concepts_mole_concept' 
    }).lean();
    
    console.log(`Total Mole Concept questions in MongoDB: ${moleQuestions.length}`);
    
    // Check if any have enhanced solutions
    const enhancedMole = moleQuestions.filter(q => {
        const solutionText = q.solution?.text_latex || q.solution?.textSolutionLatex || '';
        return solutionText.includes('**Step');
    });
    
    console.log(`Mole Concept questions with enhanced solutions: ${enhancedMole.length}`);
    
    if (enhancedMole.length > 0) {
        console.log('\nSample enhanced Mole Concept questions:');
        enhancedMole.slice(0, 3).forEach(q => {
            console.log(`${q._id}: Enhanced ✓`);
            console.log(`  Text: ${(q.solution?.text_latex || q.solution?.textSolutionLatex || '').substring(0, 50)}...`);
        });
    }

    // Check LaTeX formatting improvements
    console.log('\n' + '='.repeat(60));
    console.log('LATEX FORMATTING VERIFICATION');
    console.log('='.repeat(60));
    
    // Check a few questions for proper spacing
    const sampleAtoms = atomicQuestions.slice(0, 5);
    let properlyFormattedCount = 0;
    
    sampleAtoms.forEach(q => {
        const text = q.text_markdown || q.textMarkdown || '';
        const hasProperSpacing = text.includes(' $ ') && text.includes(' $ ');
        if (hasProperSpacing) properlyFormattedCount++;
    });
    
    console.log(`Atomic Structure: ${properlyFormattedCount}/5 sample questions have proper LaTeX spacing`);
    
    const sampleMoles = moleQuestions.slice(0, 5);
    let moleFormattedCount = 0;
    
    sampleMoles.forEach(q => {
        const text = q.text_markdown || q.textMarkdown || '';
        const hasProperSpacing = text.includes(' $ ') && text.includes(' $ ');
        if (hasProperSpacing) moleFormattedCount++;
    });
    
    console.log(`Mole Concept: ${moleFormattedCount}/5 sample questions have proper LaTeX spacing`);

    await mongoose.disconnect();
    console.log('\n✓ Verification complete!');
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
