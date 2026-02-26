// Comprehensive fix for all POC questions - LaTeX, solutions, tags, difficulty
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Fix LaTeX tables - convert to proper markdown tables
function fixLatexTables(markdown) {
  // Remove \begin{tabular} and \end{tabular}
  let fixed = markdown.replace(/\\begin\{tabular\}\{[^}]*\}/g, '');
  fixed = fixed.replace(/\\end\{tabular\}/g, '');
  
  // Remove \hline
  fixed = fixed.replace(/\\hline/g, '');
  
  // Convert \multicolumn to regular text
  fixed = fixed.replace(/\\multicolumn\{[^}]*\}\{[^}]*\}\{([^}]*)\}/g, '$1');
  
  // Clean up extra backslashes and formatting
  fixed = fixed.replace(/\\\\/g, '\n');
  fixed = fixed.replace(/\\n/g, '\n');
  
  return fixed;
}

// Fix oversized fractions - use \frac instead of \dfrac or \text
function fixFractions(text) {
  // Replace \dfrac with \frac
  let fixed = text.replace(/\\dfrac/g, '\\frac');
  
  // Fix text in fractions that causes oversizing
  fixed = fixed.replace(/\\text\{([^}]*)\}/g, '$1');
  
  return fixed;
}

// Proper detailed solutions based on question type
const detailedSolutions = {
  'POC-001': {
    solution: `**Solution:**

Let's match each purification technique with the appropriate mixture:

**(A) Distillation (simple) → (III) Chloroform + Aniline**

Simple distillation is used when the boiling points of two liquids differ by more than 25°C.
- Chloroform: bp = 61°C
- Aniline: bp = 184°C
- Difference = 123°C (large difference)
- ✅ Simple distillation is suitable

**(B) Fractional distillation → (I) Diesel + Petrol**

Fractional distillation is used for liquids with close boiling points (difference < 25°C).
- Petroleum fractions have similar boiling points
- Requires fractionating column for efficient separation
- ✅ Fractional distillation is needed

**(C) Distillation under reduced pressure → (IV) Glycerol + Spent-lye**

Used for high boiling point liquids that decompose at their normal boiling point.
- Glycerol: bp = 290°C (decomposes at this temperature)
- Reducing pressure lowers boiling point
- Prevents decomposition
- ✅ Vacuum distillation is essential

**(D) Steam distillation → (II) Aniline + Water**

Used for steam volatile, water-immiscible organic compounds.
- Aniline is steam volatile
- Immiscible with water
- Boils below 100°C when steam is passed
- ✅ Steam distillation is ideal

**Answer: (d) (A)-(III), (B)-(I), (C)-(IV), (D)-(II)**`,
    difficulty: 'Medium',
    tags: [{ tag_id: 'tag_poc_1', weight: 1.0 }]
  },
  
  'POC-002': {
    solution: `**Solution:**

Matching separation techniques with their applications:

**(A) Aniline from aniline-water mixture → (IV) Steam distillation**

**Why steam distillation?**
- Aniline is steam volatile (has appreciable vapor pressure)
- Immiscible with water
- Total vapor pressure = P(aniline) + P(water)
- Mixture boils when total pressure = atmospheric pressure
- This occurs below 100°C, preventing decomposition

**(B) Glycerol from spent-lye in soap industry → (III) Distillation at reduced pressure**

**Why vacuum distillation?**
- Glycerol has very high boiling point (290°C)
- Decomposes at normal boiling point
- Reducing pressure lowers boiling point
- Can be distilled at lower temperature without decomposition

**(C) Different fractions of crude oil in petroleum industry → (II) Fractional distillation**

**Why fractional distillation?**
- Crude oil contains many hydrocarbons
- Boiling points range from 20°C to 400°C
- Fractionating column separates based on bp differences
- Different fractions collected at different heights

**(D) Chloroform-Aniline mixture → (I) Simple distillation**

**Why simple distillation?**
- Chloroform: bp = 61°C
- Aniline: bp = 184°C
- Large difference (123°C) > 25°C
- Simple distillation is sufficient

**Answer: (a) (A)-(IV), (B)-(III), (C)-(II), (D)-(I)**`,
    difficulty: 'Medium',
    tags: [{ tag_id: 'tag_poc_1', weight: 1.0 }]
  },
  
  'POC-007': {
    solution: `**Solution:**

**Given:**
- Distance moved by organic compound = 3.5 cm
- Distance moved by solvent = 5 cm

**Formula:**

The retardation factor (Rf) is defined as:

$$R_f = \\frac{\\text{Distance moved by compound}}{\\text{Distance moved by solvent}}$$

**Calculation:**

$$R_f = \\frac{3.5}{5}$$

$$R_f = 0.7$$

**Converting to required format:**

The question asks for the answer in the form × 10⁻¹

$$R_f = 0.7 = 7 \\times 10^{-1}$$

**Important Notes:**
- Rf value is always between 0 and 1
- Rf = 0 means compound doesn't move (strongly adsorbed)
- Rf = 1 means compound moves with solvent front (no adsorption)
- More polar compounds have lower Rf values
- Less polar compounds have higher Rf values

**Answer: 7**`,
    difficulty: 'Easy',
    tags: [{ tag_id: 'tag_poc_2', weight: 1.0 }]
  },
  
  'POC-010': {
    solution: `**Solution:**

Let's match each technique with its application:

**List-I (Technique) → List-II (Application)**

**(A) Distillation → (I) Separation of glycerol from spent-lye**

Wait, this is incorrect! Glycerol requires vacuum distillation, not simple distillation.

Let me re-analyze:

**(A) Distillation → (IV) Chloroform - Aniline**

Simple distillation works when bp difference > 25°C
- Chloroform: 61°C, Aniline: 184°C
- Difference = 123°C ✅

**(B) Fractional distillation → (III) Separation of crude oil fractions**

Petroleum contains many components with varying bp
- Requires fractionating column
- Different fractions collected at different temperatures ✅

**(C) Steam distillation → (II) Aniline - Water mixture**

Aniline is steam volatile and water-immiscible
- Boils below 100°C with steam
- Ideal for steam distillation ✅

**(D) Distillation under reduced pressure → (I) Separation of glycerol from spent-lye**

Glycerol has high bp (290°C) and decomposes
- Vacuum distillation prevents decomposition ✅

**Answer: (b) A-IV, B-III, C-II, D-I**`,
    difficulty: 'Medium',
    tags: [{ tag_id: 'tag_poc_1', weight: 1.0 }]
  },
  
  'POC-011': {
    solution: `**Solution:**

**Understanding Essential Oils:**

Essential oils are organic compounds responsible for fragrance in flowers. They have specific properties:

1. **Steam volatile** - Have appreciable vapor pressure
2. **Water-insoluble** at room temperature
3. **Miscible with water vapor** in vapor phase

**Analyzing Each Method:**

**(a) Crystallisation** ❌
- Used for solid compounds
- Based on solubility differences
- Not suitable for volatile oils

**(b) Distillation under reduced pressure** ❌
- Used for high boiling point compounds that decompose
- Essential oils don't require vacuum
- Unnecessarily complex

**(c) Distillation** ❌
- Simple distillation for pure liquids
- Essential oils are mixed with plant material
- Not the most efficient method

**(d) Steam distillation** ✅
- **Perfect for steam volatile compounds**
- **Works with water-immiscible substances**
- **Prevents decomposition** (boils below 100°C)
- **Efficient extraction** from plant material

**Principle of Steam Distillation:**

When steam is passed through flowers:
- Total vapor pressure = P(oil) + P(water)
- Mixture boils when total pressure = atmospheric pressure
- This occurs at temperature < 100°C
- Essential oils vaporize without decomposition
- Vapors condense and oil separates from water

**Answer: (d) Steam distillation**`,
    difficulty: 'Easy',
    tags: [{ tag_id: 'tag_poc_1', weight: 1.0 }]
  },
  
  'POC-012': {
    solution: `**Solution:**

**Question Analysis:**

We need to identify adsorbents used in adsorption chromatography.

**Understanding Adsorption Chromatography:**

In adsorption chromatography:
- Stationary phase = Solid adsorbent
- Mobile phase = Liquid solvent
- Separation based on differential adsorption

**Analyzing Each Option:**

**A. Silica gel (SiO₂)** ✅
- Polar adsorbent
- Large surface area
- Commonly used in column and TLC
- Adsorbs polar compounds strongly

**B. Alumina (Al₂O₃)** ✅
- Polar adsorbent
- High adsorption capacity
- Used in column chromatography
- Can be acidic, basic, or neutral

**C. Quick lime (CaO)** ❌
- Not used as adsorbent
- Too reactive
- Used as drying agent
- Not suitable for chromatography

**D. Magnesia (MgO)** ❌
- Not commonly used as adsorbent
- Less effective than silica or alumina
- Not standard in chromatography

**Common Adsorbents in Chromatography:**
1. Silica gel (most common)
2. Alumina
3. Activated charcoal
4. Cellulose (for paper chromatography)

**Answer: (c) A and B only**`,
    difficulty: 'Easy',
    tags: [{ tag_id: 'tag_poc_2', weight: 1.0 }]
  }
};

async function comprehensiveFix() {
  console.log('\n=== COMPREHENSIVE POC FIX ===\n');
  console.log('Fixing: LaTeX tables, fractions, solutions, difficulty, tags\n');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    const allQuestions = await collection.find({
      'metadata.chapter_id': 'ch11_prac_org'
    }).sort({ display_id: 1 }).toArray();
    
    console.log(`Processing ${allQuestions.length} questions...\n`);
    
    let fixed = 0;
    for (const q of allQuestions) {
      const updates = {};
      let needsUpdate = false;
      
      // Fix question text LaTeX
      if (q.question_text.markdown.includes('\\begin{tabular}')) {
        updates['question_text.markdown'] = fixLatexTables(q.question_text.markdown);
        needsUpdate = true;
      }
      
      // Fix fractions in question text
      if (q.question_text.markdown.includes('\\dfrac') || q.question_text.markdown.includes('\\text{')) {
        updates['question_text.markdown'] = fixFractions(updates['question_text.markdown'] || q.question_text.markdown);
        needsUpdate = true;
      }
      
      // Update with detailed solution if available
      if (detailedSolutions[q.display_id]) {
        updates['solution.text_markdown'] = detailedSolutions[q.display_id].solution;
        updates['metadata.difficulty'] = detailedSolutions[q.display_id].difficulty;
        updates['metadata.tags'] = detailedSolutions[q.display_id].tags;
        needsUpdate = true;
      }
      
      // Fix fractions in solution
      if (q.solution?.text_markdown && (q.solution.text_markdown.includes('\\dfrac') || q.solution.text_markdown.includes('\\text{'))) {
        updates['solution.text_markdown'] = fixFractions(updates['solution.text_markdown'] || q.solution.text_markdown);
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        updates.updated_at = new Date();
        await collection.updateOne({ _id: q._id }, { $set: updates });
        fixed++;
        
        if (fixed % 10 === 0) {
          console.log(`  ✅ Fixed ${fixed} questions`);
        }
      }
    }
    
    console.log(`\n✅ Fixed ${fixed} questions`);
    console.log('\nNext: Will create detailed solutions for remaining questions...');
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

comprehensiveFix();
