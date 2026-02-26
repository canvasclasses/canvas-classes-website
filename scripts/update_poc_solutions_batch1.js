// Update POC solutions - Batch 1: Purification Methods (Q108-123)
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const solutions = {
  'POC-001': {
    solution: `**Solution:**

Matching purification techniques with mixtures:

**(A) Distillation (simple) → (III) Chloroform + Aniline**
- Simple distillation is used when boiling points differ by more than 25°C
- Chloroform (bp 61°C) and Aniline (bp 184°C) have large difference

**(B) Fractional distillation → (I) Diesel + Petrol**
- Used for liquids with close boiling points
- Petroleum fractions have similar boiling points

**(C) Distillation under reduced pressure → (IV) Glycerol + Spent-lye**
- Used for high boiling point liquids that decompose at normal bp
- Glycerol decomposes at its normal boiling point (290°C)

**(D) Steam distillation → (II) Aniline + Water**
- Used for steam volatile, water-immiscible substances
- Aniline is steam volatile and immiscible with water

**Answer: (d) (A)-(III), (B)-(I), (C)-(IV), (D)-(II)**`,
    difficulty: 'Medium',
    tags: [{ tag_id: 'tag_poc_1', weight: 1.0 }]
  },
  
  'POC-002': {
    solution: `**Solution:**

**(A) Aniline from aniline-water mixture → (IV) Steam distillation**
- Aniline is steam volatile and immiscible with water
- Steam distillation is ideal for such mixtures

**(B) Glycerol from spent-lye in soap industry → (III) Distillation at reduced pressure**
- Glycerol has high boiling point and decomposes at normal bp
- Vacuum distillation prevents decomposition

**(C) Different fractions of crude oil in petroleum industry → (II) Fractional distillation**
- Petroleum contains hydrocarbons with varying boiling points
- Fractional distillation separates them based on bp differences

**(D) Chloroform-Aniline mixture → (I) Simple distillation**
- Large difference in boiling points (61°C vs 184°C)
- Simple distillation is sufficient

**Answer: (a) (A)-(IV), (B)-(III), (C)-(II), (D)-(I)**`,
    difficulty: 'Medium',
    tags: [{ tag_id: 'tag_poc_1', weight: 1.0 }]
  },
  
  'POC-003': {
    solution: `**Solution:**

The physical transformation shown is:
$$\\ce{Solid ->[Heat] Vapour ->[Cool] Solid}$$

This represents **sublimation** - the process where a solid directly converts to vapor without passing through liquid state, and then condenses back to solid.

Examples of substances that sublime:
- Iodine
- Camphor
- Naphthalene
- Benzoic acid
- Ammonium chloride

**Answer: (a) Sublimation**`,
    difficulty: 'Easy',
    tags: [{ tag_id: 'tag_poc_1', weight: 1.0 }]
  },
  
  'POC-004': {
    solution: `**Solution:**

**Statement (I): In partition chromatography, stationary phase is thin film of liquid present in the inert support.**
- ✅ TRUE
- In partition chromatography, the stationary phase is a liquid film coated on an inert solid support
- Separation is based on differential partitioning between mobile and stationary liquid phases

**Statement (II): In paper chromatography, the material of paper acts as a stationary phase.**
- ✅ TRUE
- Paper (cellulose) acts as the stationary phase
- Water molecules absorbed in cellulose fibers form the actual stationary phase

Both statements are correct.

**Answer: (d) Both Statement I and Statement II are true**`,
    difficulty: 'Easy',
    tags: [{ tag_id: 'tag_poc_2', weight: 1.0 }]
  },
  
  'POC-005': {
    solution: `**Solution:**

For purification of **steam volatile water immiscible substances**, the technique used is **steam distillation**.

**Principle:**
- The substance is steam volatile (has appreciable vapor pressure)
- It is immiscible with water
- Total vapor pressure = P(substance) + P(water)
- Mixture boils when total pressure equals atmospheric pressure
- This occurs at temperature lower than boiling point of either component

**Examples:**
- Aniline
- Nitrobenzene
- Essential oils
- Turpentine oil

**Answer: (d) Steam distillation**`,
    difficulty: 'Easy',
    tags: [{ tag_id: 'tag_poc_1', weight: 1.0 }]
  },
  
  'POC-006': {
    solution: `**Solution:**

Chromatographic techniques based on **differential adsorption**:

**A. Column chromatography** ✅
- Uses adsorbent (silica gel, alumina) as stationary phase
- Components adsorb differently based on polarity
- More polar compounds adsorb more strongly

**B. Thin layer chromatography** ✅
- Uses thin layer of adsorbent on glass plate
- Separation based on differential adsorption
- Similar principle to column chromatography

**C. Paper chromatography** ❌
- Based on partition, not adsorption
- Water in cellulose acts as stationary phase
- Separation by differential partitioning

**Answer: (c) A & B only**`,
    difficulty: 'Medium',
    tags: [{ tag_id: 'tag_poc_2', weight: 1.0 }]
  },
  
  'POC-008': {
    solution: `**Solution:**

Purification methods based on **"Solubility" in two different solvents**:

**Differential Extraction** is the correct answer.

**Principle:**
- Uses two immiscible solvents
- Organic compound distributes between them based on relative solubility
- Separation occurs due to different distribution coefficients

**Example:**
- Separating benzoic acid from water using benzene
- Benzoic acid is more soluble in benzene than water
- Shake mixture in separating funnel, collect organic layer

**Other options:**
- Column Chromatography: Based on adsorption
- Sublimation: Based on vapor pressure
- Distillation: Based on boiling point

**Answer: (d) Differential Extraction**`,
    difficulty: 'Easy',
    tags: [{ tag_id: 'tag_poc_1', weight: 1.0 }]
  },
  
  'POC-009': {
    solution: `**Solution:**

**'Adsorption' principle** is used in **Chromatography**.

**Principle of Adsorption Chromatography:**
- Stationary phase is a solid adsorbent (silica gel, alumina)
- Mobile phase is a liquid or gas
- Components adsorb on surface with different strengths
- More polar compounds adsorb more strongly
- Less polar compounds elute first

**Types using adsorption:**
- Column chromatography
- Thin layer chromatography (TLC)
- Gas-solid chromatography

**Other options:**
- Extraction: Based on solubility
- Distillation: Based on boiling point
- Sublimation: Based on vapor pressure

**Answer: (b) Chromatography**`,
    difficulty: 'Easy',
    tags: [{ tag_id: 'tag_poc_2', weight: 1.0 }]
  }
};

async function updateBatch1() {
  console.log('\n=== UPDATE POC SOLUTIONS - BATCH 1 ===\n');
  console.log('Updating purification methods questions (Q108-123)...\n');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    let count = 0;
    for (const [displayId, data] of Object.entries(solutions)) {
      await collection.updateOne(
        { display_id: displayId },
        {
          $set: {
            'solution.text_markdown': data.solution,
            'solution.latex_validated': true,
            'metadata.difficulty': data.difficulty,
            'metadata.tags': data.tags,
            updated_at: new Date()
          }
        }
      );
      count++;
      console.log(`✅ Updated ${displayId} - ${data.difficulty}`);
    }
    
    console.log(`\n✅ Updated ${count} questions with solutions and metadata`);
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

updateBatch1();
