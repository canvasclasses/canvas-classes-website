# 5-Level Hierarchical Tagging System for Guided Practice

## Overview

The Crucible now implements a comprehensive 5-level hierarchical tagging system that enables much more granular feedback collection and adaptive learning. This replaces the previous flat tagging system with a multi-dimensional approach.

## Tagging Hierarchy

### Level 1: Primary Concept Tag (Chapter-specific)
- **Type**: Single selection
- **Source**: Taxonomy (type: 'topic')
- **Example**: "Electronic Effects", "Acidity & Basicity", "Reaction Intermediates"
- **Purpose**: Broad categorization of the question's main concept
- **Field**: `metadata.primary_concept_tag` (string)
- **Legacy**: Also stored in `metadata.tags[0].tag_id` for backward compatibility

### Level 2: Micro Concept Tags (Chapter-specific)
- **Type**: Multiple selection
- **Source**: Taxonomy (type: 'micro_topic', parent = Primary Concept Tag)
- **Example**: ["Hyperconjugation", "Inductive effect (±I)", "Combined effect reasoning"]
- **Purpose**: Specific sub-concepts within the primary concept
- **Field**: `metadata.micro_concept_tags` (string[])
- **UI**: Checkbox list that appears after selecting Primary Concept Tag

### Level 3: Cognitive Type (Universal)
- **Type**: Single selection
- **Options**:
  - `recall` - Memorization, fact retrieval
  - `application` - Using concepts in straightforward scenarios
  - `analysis` - Breaking down complex problems
  - `synthesis` - Combining multiple concepts
  - `evaluation` - Comparing, judging, or choosing between options
- **Purpose**: Bloom's taxonomy level for adaptive difficulty
- **Field**: `metadata.cognitive_type`

### Level 4: Calculation Load (Universal)
- **Type**: Single selection
- **Options**:
  - `none` - No mathematical calculations required
  - `light` - Simple arithmetic (addition, subtraction, basic multiplication)
  - `moderate` - Multi-step calculations, algebra
  - `heavy` - Complex calculations, logarithms, advanced math
- **Purpose**: Helps identify if student struggles with math vs concepts
- **Field**: `metadata.calculation_load`

### Level 5: Entry Point Clarity (Universal)
- **Type**: Single selection
- **Options**:
  - `clear` - Obvious starting point, straightforward approach
  - `moderate` - Requires some thought to identify approach
  - `ambiguous` - Multiple possible approaches, unclear entry point
- **Purpose**: Measures problem-solving skill vs knowledge
- **Field**: `metadata.entry_point_clarity`

## Database Schema Changes

### MongoDB (Question.v2.ts)

```typescript
export interface IQuestionMetadata {
  // ... existing fields ...
  
  // LEGACY: Old flat tagging (kept for backward compatibility)
  tags: Array<{ tag_id: string; weight: number; }>;
  
  // NEW: 5-level hierarchical tagging
  primary_concept_tag?: string;
  micro_concept_tags?: string[];
  cognitive_type?: 'recall' | 'application' | 'analysis' | 'synthesis' | 'evaluation';
  calculation_load?: 'none' | 'light' | 'moderate' | 'heavy';
  entry_point_clarity?: 'clear' | 'moderate' | 'ambiguous';
}
```

### Taxonomy Structure

```typescript
export interface TaxonomyNode {
  id: string;
  name: string;
  parent_id: string | null;
  type: 'chapter' | 'topic' | 'micro_topic';  // Added 'micro_topic'
  // ... other fields ...
}
```

## UI Implementation

### Taxonomy Dashboard (`/crucible/admin/taxonomy`)
- **Primary Tags**: Displayed with purple tag icon
- **Micro Tags**: Nested under primary tags with indentation and blue dot indicator
- **Add Micro Tag**: Green "+" button appears on hover over primary tags
- **Edit/Delete**: Available for both primary and micro tags

### Admin Dashboard (`/crucible/admin`)
- **5-Level Tagging Panel**: Purple gradient panel with "Guided Practice Tagging" header
- **Level 1**: Dropdown (existing Primary Concept Tag field)
- **Level 2**: Checkbox list (dynamically populated based on Level 1 selection)
- **Level 3-5**: Dropdowns with descriptive labels
- **Progress Indicator**: Shows which levels are completed (L1 ✓, L2 ✓, etc.)

## Required Changes for Adaptive Engine

### 1. Feedback Collection Enhancement

**Current**: Simple "too easy" / "too hard" feedback
**New**: Multi-dimensional feedback collection

```typescript
interface EnhancedFeedback {
  question_id: string;
  user_id: string;
  
  // Overall difficulty (existing)
  difficulty_rating: 'too_easy' | 'appropriate' | 'too_hard';
  
  // NEW: Granular feedback mapped to tagging levels
  struggle_points: {
    // Level 2: Which micro concepts were challenging?
    challenging_micro_concepts?: string[];  // IDs of micro tags
    
    // Level 3: Did cognitive level match user's ability?
    cognitive_mismatch?: 'too_simple' | 'appropriate' | 'too_complex';
    
    // Level 4: Was calculation the bottleneck?
    calculation_struggle?: boolean;
    
    // Level 5: Could they identify the approach?
    entry_point_struggle?: boolean;
  };
  
  // Time spent (helps validate struggle points)
  time_spent_seconds: number;
  
  // Confidence level
  confidence: 'guessed' | 'unsure' | 'confident';
  
  timestamp: Date;
}
```

### 2. Adaptive Question Selection

**Algorithm Enhancement**:

```typescript
function selectNextQuestion(userProfile: UserProfile, sessionContext: SessionContext) {
  // 1. Select Primary Concept based on performance history
  const primaryConcept = selectPrimaryConcept(userProfile);
  
  // 2. Within that concept, select Micro Concepts to target
  const targetMicroConcepts = selectMicroConcepts(
    userProfile.weakMicroConcepts[primaryConcept],
    sessionContext.recentMicroConcepts
  );
  
  // 3. Adjust Cognitive Type based on mastery level
  const cognitiveType = adjustCognitiveType(
    userProfile.masteryLevel[primaryConcept],
    sessionContext.recentPerformance
  );
  
  // 4. Set Calculation Load based on math proficiency
  const calculationLoad = userProfile.mathProficiency > 0.7 
    ? ['moderate', 'heavy'] 
    : ['none', 'light'];
  
  // 5. Vary Entry Point Clarity for problem-solving practice
  const entryPointClarity = sessionContext.consecutiveCorrect > 3
    ? 'ambiguous'  // Challenge them
    : 'clear';     // Build confidence
  
  // Query questions matching all criteria
  return await Question.findOne({
    'metadata.primary_concept_tag': primaryConcept,
    'metadata.micro_concept_tags': { $in: targetMicroConcepts },
    'metadata.cognitive_type': cognitiveType,
    'metadata.calculation_load': { $in: calculationLoad },
    'metadata.entry_point_clarity': entryPointClarity,
    _id: { $nin: sessionContext.attemptedQuestions }
  });
}
```

### 3. User Profile Tracking

**Enhanced User Profile**:

```typescript
interface UserProfile {
  user_id: string;
  
  // Per-chapter tracking
  chapters: {
    [chapterId: string]: {
      // Level 1: Primary concept mastery
      primaryConcepts: {
        [primaryConceptId: string]: {
          mastery: number;  // 0-1
          attempts: number;
          correct: number;
          lastAttempt: Date;
          
          // Level 2: Micro concept breakdown
          microConcepts: {
            [microConceptId: string]: {
              mastery: number;
              struggles: number;  // How many times user struggled
              lastSeen: Date;
            }
          };
        }
      };
      
      // Level 3: Cognitive ability per chapter
      cognitiveProfile: {
        recall: number;      // 0-1
        application: number;
        analysis: number;
        synthesis: number;
        evaluation: number;
      };
      
      // Level 4: Math proficiency (chapter-specific)
      mathProficiency: number;  // 0-1
      calculationSpeed: number; // avg seconds per calculation
      
      // Level 5: Problem-solving skill
      problemSolvingSkill: number;  // 0-1 (based on ambiguous questions)
      entryPointIdentificationRate: number;  // Success rate on ambiguous questions
    }
  };
}
```

### 4. Feedback UI Changes

**In-Session Feedback Modal** (after answering):

```tsx
<FeedbackModal>
  <h3>How did you find this question?</h3>
  
  {/* Overall difficulty */}
  <DifficultySelector />
  
  {/* Conditional: If marked as "too hard" */}
  {difficulty === 'too_hard' && (
    <>
      <h4>What made it challenging?</h4>
      
      {/* Show micro concepts from this question */}
      <MicroConceptCheckboxes 
        concepts={question.metadata.micro_concept_tags}
        label="Which concepts were unclear?"
      />
      
      {/* Calculation struggle */}
      {question.metadata.calculation_load !== 'none' && (
        <Checkbox label="The calculations were difficult" />
      )}
      
      {/* Entry point struggle */}
      {question.metadata.entry_point_clarity !== 'clear' && (
        <Checkbox label="I didn't know how to start" />
      )}
    </>
  )}
  
  {/* Confidence level */}
  <ConfidenceSelector />
</FeedbackModal>
```

## Migration Strategy

### Phase 1: Backward Compatibility (Current)
- ✅ New fields added to schema as optional
- ✅ Legacy `tags` field still populated
- ✅ Existing questions work without new tags
- ✅ Admin dashboard shows both old and new tagging

### Phase 2: Tagging Sprint (Next)
1. Tag all GOC chapter questions with new system
2. Validate tagging consistency
3. Test adaptive engine with tagged questions
4. Gather initial feedback data

### Phase 3: Full Migration (Future)
1. Tag all remaining chapters
2. Deprecate legacy `tags` field (keep for analytics)
3. Switch adaptive engine to use only new system
4. Deploy enhanced feedback collection

## API Endpoints to Update

### 1. `/api/v2/questions/[id]/route.ts` (PATCH)
- ✅ Already supports new fields via Mongoose schema
- No changes needed (uses `toObject()` pattern)

### 2. `/api/v2/questions/route.ts` (GET)
- Add query support for new fields:
  ```typescript
  if (cognitive_type) query['metadata.cognitive_type'] = cognitive_type;
  if (calculation_load) query['metadata.calculation_load'] = calculation_load;
  if (entry_point_clarity) query['metadata.entry_point_clarity'] = entry_point_clarity;
  if (micro_concept_tags) query['metadata.micro_concept_tags'] = { $in: micro_concept_tags };
  ```

### 3. `/api/v2/feedback/route.ts` (NEW)
- Create endpoint for enhanced feedback submission
- Store in `user_feedback` collection
- Update user profile in real-time

### 4. `/api/v2/adaptive/next-question/route.ts` (NEW)
- Implement adaptive selection algorithm
- Use 5-level tagging for question selection
- Return question with explanation of why it was selected

## Analytics & Insights

### Dashboard Metrics

**Concept Mastery Heatmap**:
- X-axis: Primary Concepts
- Y-axis: Micro Concepts
- Color: Mastery level (red = struggling, green = mastered)

**Cognitive Profile Chart**:
- Radar chart showing user's strength across 5 cognitive types
- Compare to target JEE profile

**Calculation Proficiency Trend**:
- Line graph showing improvement in calculation speed
- Separate lines for different calculation loads

**Problem-Solving Skill Progression**:
- Success rate on ambiguous vs clear entry point questions
- Tracks growth in independent problem-solving

## GOC Chapter Implementation

The GOC chapter has been fully tagged with the new system:

- **11 Primary Concept Tags** (e.g., "Electronic Effects", "Acidity & Basicity")
- **47 Micro Concept Tags** (e.g., "Hyperconjugation", "Inductive effect (±I)")
- All micro tags properly nested under their primary concepts
- Ready for cognitive type, calculation load, and entry point clarity tagging

## Next Steps

1. ✅ Update Question model schema
2. ✅ Update taxonomy data structure
3. ✅ Implement taxonomy dashboard UI for micro tags
4. ✅ Implement admin dashboard 5-level tagging UI
5. ⏳ Create feedback collection API endpoint
6. ⏳ Implement adaptive question selection algorithm
7. ⏳ Update user profile tracking system
8. ⏳ Create analytics dashboard for new metrics
9. ⏳ Tag remaining chapters with new system
10. ⏳ A/B test adaptive engine with new vs old system

## Benefits

1. **Precise Weakness Identification**: Know exactly which micro-concept the student struggles with
2. **Targeted Practice**: Serve questions that address specific weak points
3. **Cognitive Development**: Track and develop higher-order thinking skills
4. **Math vs Concept Separation**: Identify if struggles are due to calculations or understanding
5. **Problem-Solving Growth**: Measure and improve independent problem-solving ability
6. **Better Feedback Loop**: Collect actionable data instead of vague "too hard" responses
7. **Personalized Learning Path**: Each student gets a unique question sequence based on their profile
