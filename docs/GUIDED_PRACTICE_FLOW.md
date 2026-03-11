# Guided Practice Flow - Complete Documentation

## 🎯 Overview

Guided Practice is an adaptive learning system that adjusts question difficulty based on user performance and feedback. After every 10 questions, users provide feedback that influences the next set.

---

## 📊 The Complete Flow

### Step 1: Initial Setup
1. User selects a chapter from the Guided Practice wizard
2. User chooses filters:
   - **Difficulty:** Easy, Medium, Hard, or Mixed
   - **Question Source:** All Questions or PYQ Only
   - **Concept Tags:** Optional focus on specific topics
3. System fetches first batch of **10 questions** matching filters

### Step 2: Practice Session (10 Questions)
User attempts questions one by one:
- **SCQ (Single Correct):** Click option → Instant feedback
- **MCQ (Multiple Correct):** Select options → Click "Check Answer"
- **NVT (Numerical):** Enter number → Click "Submit" or press Enter
- **SUBJ (Subjective):** Click "View Detailed Solution" (counted as attempted)

**Tracking:** Each question attempt is tracked:
- Question ID, correctness, selected answer
- Sent to `/api/v2/user/progress/batch`
- Triggers `onQuestionAnswered(isCorrect)` callback

### Step 3: Feedback Modal (After 10 Questions)
**Trigger Condition:**
```typescript
if (totalAnswered % 10 === 0 && totalAnswered !== lastFeedbackAt) {
  // Show modal after 800ms delay
  setShowFeedbackModal(true);
}
```

**Modal Shows:**
- Total questions answered in this batch (10)
- Accuracy percentage
- Three feedback options

### Step 4: User Feedback Options

#### Option 1: 🟢 Too Easy
**User feels:** Questions were too simple, wants harder challenges

**System Response:**
```typescript
if (currentDifficulty === 'Easy') → newDifficulty = 'Medium'
if (currentDifficulty === 'Medium') → newDifficulty = 'Hard'
if (currentDifficulty === 'Hard') → stays 'Hard'
```

**Next Action:**
- Fetch 10 new questions with **increased difficulty**
- Keep same concept tags and PYQ filter
- Reset counter: `totalAnswered = 0, correctCount = 0`

#### Option 2: 🟡 Just Right
**User feels:** Perfect difficulty level, keep it the same

**System Response:**
```typescript
// Check accuracy for auto-adjustment
if (accuracy >= 80% && currentDifficulty !== 'Hard') {
  // User is doing very well, bump up difficulty
  if (currentDifficulty === 'Easy') → newDifficulty = 'Medium'
  if (currentDifficulty === 'Medium') → newDifficulty = 'Hard'
} else if (accuracy <= 40% && currentDifficulty !== 'Easy') {
  // User is struggling, reduce difficulty
  if (currentDifficulty === 'Hard') → newDifficulty = 'Medium'
  if (currentDifficulty === 'Medium') → newDifficulty = 'Easy'
} else {
  // Goldilocks zone - keep same difficulty
  newDifficulty = currentDifficulty
}
```

**Next Action:**
- Fetch 10 new questions with **adjusted difficulty** (based on accuracy)
- Keep same concept tags and PYQ filter
- Reset counter

#### Option 3: 🔴 Too Hard
**User feels:** Questions were too difficult, needs easier ones

**System Response:**
```typescript
if (currentDifficulty === 'Hard') → newDifficulty = 'Medium'
if (currentDifficulty === 'Medium') → newDifficulty = 'Easy'
if (currentDifficulty === 'Easy') → stays 'Easy'
```

**Next Action:**
- Fetch 10 new questions with **decreased difficulty**
- Keep same concept tags and PYQ filter
- Reset counter

#### Option 4: Skip for Now
**User action:** Close modal without feedback

**System Response:**
- Modal closes
- **No new questions loaded** - user continues with current set
- Counter does NOT reset
- Next modal appears after 10 more questions

---

## 🔄 Adaptive Algorithm Details

### Function: `getAdaptiveDifficulty()`

**Input:**
- `sessionStats`: Current session statistics
  - `totalAnswered`: Questions attempted in current batch
  - `correctCount`: Correct answers in current batch
  - `currentDifficulty`: Current difficulty level
- `feedback`: User's feedback choice or `null`

**Logic Priority:**
1. **User feedback takes absolute priority** (if provided)
2. **Accuracy-based auto-adjustment** (if "Just Right" or no feedback)

**Accuracy Thresholds:**
- **≥80% accuracy:** User is excelling → increase difficulty
- **≤40% accuracy:** User is struggling → decrease difficulty
- **41-79% accuracy:** Sweet spot → maintain difficulty

**Code:**
```typescript
function getAdaptiveDifficulty(stats: SessionStats, feedback: FeedbackType | null): Difficulty {
  const accuracy = stats.totalAnswered > 0 ? stats.correctCount / stats.totalAnswered : 0.5;
  
  // User feedback takes priority
  if (feedback === 'too_easy') {
    if (stats.currentDifficulty === 'Easy') return 'Medium';
    if (stats.currentDifficulty === 'Medium') return 'Hard';
    return 'Hard';
  }
  if (feedback === 'too_hard') {
    if (stats.currentDifficulty === 'Hard') return 'Medium';
    if (stats.currentDifficulty === 'Medium') return 'Easy';
    return 'Easy';
  }
  
  // Auto-adjust based on accuracy if user says "just right" or no feedback
  if (accuracy >= 0.8 && stats.currentDifficulty !== 'Hard') {
    return stats.currentDifficulty === 'Easy' ? 'Medium' : 'Hard';
  }
  if (accuracy <= 0.4 && stats.currentDifficulty !== 'Easy') {
    return stats.currentDifficulty === 'Hard' ? 'Medium' : 'Easy';
  }
  
  return stats.currentDifficulty;
}
```

---

## 🐛 Bug Fixes (March 10, 2026)

### Issue: Modal Not Appearing After 10 Questions

**Root Cause:**
NVT (Numerical) and SUBJ (Subjective) questions were **not tracking attempts**, so the counter never reached 10.

**Files Fixed:**
- `/app/the-crucible/components/BrowseView.tsx`

**Changes:**
1. **NVT Questions (lines 309-334):**
   - Added `silentTrackAttempt()` call on Submit button click
   - Added `silentTrackAttempt()` call on Enter key press
   - Validates answer: `userAnswer.trim() === correctAnswer.trim()`

2. **SUBJ Questions (lines 295-308):**
   - Added `silentTrackAttempt()` call when viewing solution
   - Tracks as `isCorrect: false` (subjective, no auto-grading)

**Result:** All question types now properly trigger the feedback modal after 10 attempts.

---

## 📈 Example Session Flow

### Scenario: User practicing GOC chapter

**Batch 1 (Initial):**
- Difficulty: Mixed (user selected)
- Questions: 10 random from all difficulties
- User answers: 8/10 correct (80% accuracy)
- **Feedback:** "Just Right"
- **System:** 80% accuracy → bump to Hard
- **Next batch:** 10 Hard questions

**Batch 2:**
- Difficulty: Hard
- Questions: 10 hard questions
- User answers: 3/10 correct (30% accuracy)
- **Feedback:** "Too Hard"
- **System:** User says too hard → reduce to Medium
- **Next batch:** 10 Medium questions

**Batch 3:**
- Difficulty: Medium
- Questions: 10 medium questions
- User answers: 7/10 correct (70% accuracy)
- **Feedback:** "Just Right"
- **System:** 70% accuracy (sweet spot) → keep Medium
- **Next batch:** 10 Medium questions

**Batch 4:**
- Difficulty: Medium
- Questions: 10 medium questions
- User answers: 9/10 correct (90% accuracy)
- **Feedback:** "Too Easy"
- **System:** User says too easy → bump to Hard
- **Next batch:** 10 Hard questions

---

## 🎓 Learning Outcomes

### Benefits of Adaptive System:
1. **Personalized Learning:** Adjusts to individual skill level
2. **Prevents Frustration:** Reduces difficulty when struggling
3. **Maintains Challenge:** Increases difficulty when excelling
4. **User Control:** Feedback overrides automatic adjustments
5. **Continuous Improvement:** Tracks progress over time

### Best Practices for Users:
- **Be honest with feedback:** System adapts based on your input
- **Don't skip feedback:** Helps system optimize for you
- **Track your progress:** Notice difficulty changes over sessions
- **Focus on concepts:** Use tag filters to target weak areas

---

## 🔧 Technical Implementation

### Key Components:

**1. GuidedPracticeWizard.tsx**
- Main orchestrator
- Manages session state
- Triggers feedback modal
- Handles difficulty adjustment

**2. BrowseView.tsx**
- Renders questions
- Tracks attempts via `silentTrackAttempt()`
- Calls `onQuestionAnswered()` callback

**3. FeedbackModal Component**
- Shows after every 10 questions
- Three feedback buttons + skip option
- Displays current accuracy

### State Management:

```typescript
interface SessionStats {
  totalAnswered: number;      // Questions answered in current batch
  correctCount: number;        // Correct answers in current batch
  lastFeedbackAt: number;      // Last question count when feedback shown
  currentDifficulty: Difficulty; // Current difficulty level
}
```

### API Endpoints:

**Progress Tracking:**
```
POST /api/v2/user/progress/batch
Body: {
  attempts: [{
    question_id, display_id, chapter_id,
    difficulty, concept_tags,
    is_correct, selected_option, source
  }]
}
```

**Question Fetching:**
```
GET /api/v2/questions?chapter_id={id}&limit=500
```

---

## 🚀 Future Enhancements

### Potential Improvements:
1. **Spaced Repetition:** Revisit incorrectly answered questions
2. **Concept Mastery Tracking:** Track performance per concept tag
3. **Adaptive Batch Size:** Adjust from 10 based on user preference
4. **Performance Analytics:** Show progress graphs over time
5. **Smart Question Selection:** Avoid recently seen questions

---

**Last Updated:** March 10, 2026  
**Version:** 2.0 (Bug fixes applied)  
**Status:** Fully Functional ✅
