# Timed Test Complete Pipeline Verification

## 🔧 What Was Fixed

### **Critical Issue: Test Stuck at "Preparing your questions"**

**Root Cause:** The `startTest` function in `CrucibleWizard.tsx` was trying to use an empty `questions` array to build the test. Questions were never fetched from the API.

**Solution:** Added complete question fetching logic in the `startTest` callback:
1. Fetch questions from `/api/v2/questions?chapter_id=X`
2. Map API response to proper Question type format
3. Fetch user progress for smart test generation
4. Build smart test using `buildSmartTest` function
5. Show shloka screen and launch test

---

## ✅ Complete Pipeline Flow

### **Step 1: User Interaction**
1. User selects chapter (e.g., "P Block")
2. User clicks "Timed Test" button
3. **TestConfigModal appears immediately** ✅

### **Step 2: Test Configuration**
User configures:
- **Question Count:** 10, 20, 30, 40, or max available
- **Difficulty Mix:**
  - `balanced` - Mix of Easy/Medium/Hard
  - `easy` - Mostly Easy + Medium (Warm Up)
  - `hard` - Mostly Medium + Hard (Challenge)
  - `pyq` - PYQ Only (heavily deprioritizes non-PYQs)
- **Question Order:**
  - `random` - Shuffled
  - `difficulty` - Easy → Medium → Hard progression
  - `topic` - Grouped by concept tags

### **Step 3: Test Generation (Backend)**
When user clicks "Start Test":

```typescript
// 1. Fetch questions for chapter
const questionsRes = await fetch(`/api/v2/questions?chapter_id=${chapterId}&limit=500`);
const fetchedQuestions = questionsRes.data.map(q => ({
  id: q._id,
  display_id: q.display_id,
  question_text: q.question_text,
  type: q.question_type || q.type || 'SCQ',
  options: q.options,
  answer: q.answer,
  solution: q.solution,
  metadata: q.metadata,
  svg_scales: q.svg_scales,
}));

// 2. Fetch user progress
const progressRes = await fetch(`/api/v2/user/progress?chapterId=${chapterId}`);
const progress = {
  attempted_ids: [...],      // Questions already attempted
  starred_ids: [...],         // Bookmarked questions
  last_3_sessions: [[...]]   // Recent test question IDs
};

// 3. Build smart test
const picked = buildSmartTest({
  questions: fetchedQuestions,
  count,
  mix,
  sort,
  starredIds: new Set(progress.starred_ids),
  attempted: progress.attempted_ids,
  last3Sessions: progress.last_3_sessions,
});
```

### **Step 4: Smart Test Algorithm**

The `buildSmartTest` function implements:

#### **A. Question Scoring (Higher = More Likely)**
- **Unseen questions:** +80 points (strongly preferred)
- **Previously failed:** +60 points (needs review)
- **Starred questions:** +40 points
- **Recently correct (< 30 days):** -90 points (avoid)
- **In last 3 tests:** -50 points (avoid repetition)

#### **B. Difficulty Mix Multipliers**
- `easy`: Easy ×1.8, Medium ×1.2, Hard ×0.3
- `hard`: Hard ×1.8, Medium ×1.2, Easy ×0.3
- `pyq`: Non-PYQs -200 points (heavily deprioritized)
- `balanced`: No multiplier

#### **C. Topic Allocation**
- Questions distributed proportionally across topics
- Each topic gets `floor(count × topicQuestionCount / totalQuestions)` slots
- Remaining slots go to largest topics

#### **D. Type Ratio (JEE Main weights)**
- SCQ: 65%
- NVT: 20%
- MCQ: 10%
- AR: 3%
- MST: 1%
- MTC: 1%

#### **E. Overlap Prevention**
- If overlap with last 3 sessions > 20%, swap lowest-scored overlapping questions with next-best unseen

#### **F. Final Sorting**
- `random`: Shuffle all questions
- `difficulty`: Easy → Medium → Hard
- `topic`: Group by concept, shuffle within groups

### **Step 5: Test Execution**
1. Shloka screen (1.8s motivational quote)
2. Test view loads with timer
3. User answers questions
4. Timer countdown with warnings at 5min and 1min
5. Auto-submit when timer reaches 0

### **Step 6: Test Completion & Feedback**

#### **Results Screen Shows:**
- **Score:** X out of Y questions
- **Breakdown:**
  - Correct (green)
  - Wrong (red)
  - Skipped (yellow)
- **Actions:**
  - Review Solutions
  - Back to Home

#### **Review Mode:**
- Navigate through all questions
- See user's answer vs correct answer
- Color-coded feedback (green/red)
- Full solution with markdown/LaTeX rendering
- Video/audio solutions if available
- Community stats (% who selected each option)

#### **Data Saved to Backend:**

**1. Batch Progress Update** (`/api/v2/user/progress/batch`)
```json
{
  "attempts": [
    {
      "question_id": "...",
      "display_id": "GOC-001",
      "chapter_id": "ch12_goc",
      "difficulty": "Medium",
      "concept_tags": ["tag1", "tag2"],
      "is_correct": true,
      "selected_option": "opt_a",
      "source": "test",
      "time_spent_seconds": 45
    }
  ]
}
```

**2. Test Result** (`/api/v2/test-results`)
```json
{
  "chapter_id": "ch12_goc",
  "test_config": {
    "count": 20,
    "difficulty_mix": "balanced",
    "question_sort": "random"
  },
  "questions": [...],
  "score": {
    "correct": 15,
    "total": 20,
    "percentage": 75
  },
  "timing": {
    "started_at": "2026-03-15T02:51:00Z",
    "completed_at": "2026-03-15T03:21:00Z",
    "total_seconds": 1800
  }
}
```

**3. Test Session** (`/api/v2/user/test-session`)
```json
{
  "chapter_id": "ch12_goc",
  "question_ids": ["q1", "q2", ...],
  "config": { "count": 20, "mix": "balanced" }
}
```

---

## 🧪 Testing Checklist

### **A. Configuration Options**

- [ ] **Question Count:** Try 10, 20, 30, 40
- [ ] **Balanced Mix:** Should get mix of Easy/Medium/Hard
- [ ] **Easy Mix:** Should get mostly Easy + Medium questions
- [ ] **Hard Mix:** Should get mostly Medium + Hard questions
- [ ] **PYQ Only:** Should get only PYQ questions (non-PYQs heavily deprioritized)
- [ ] **Random Order:** Questions should be shuffled
- [ ] **Difficulty Order:** Should go Easy → Medium → Hard
- [ ] **Topic Order:** Should group by concept tags

### **B. Edge Cases**

- [ ] **Chapter with < 10 questions:** Should work with available count
- [ ] **PYQ filter on chapter with no PYQs:** Should show message or fallback
- [ ] **All questions already attempted:** Should still generate test (lower scores)
- [ ] **Network error during fetch:** Should show error message

### **C. Test Execution**

- [ ] **Timer starts correctly**
- [ ] **Timer counts down**
- [ ] **Warning at 5 minutes remaining**
- [ ] **Warning at 1 minute remaining**
- [ ] **Auto-submit at 0:00**
- [ ] **Manual submit works**
- [ ] **Question navigation works**
- [ ] **Mark for review works**
- [ ] **Answer selection persists**

### **D. Results & Feedback**

- [ ] **Correct score calculation**
- [ ] **Breakdown shows correct/wrong/skipped**
- [ ] **Review mode loads**
- [ ] **Solutions display correctly**
- [ ] **User answer vs correct answer shown**
- [ ] **Color coding (green/red) works**
- [ ] **Video/audio solutions play**
- [ ] **Community stats display**
- [ ] **Navigation in review mode works**

### **E. Data Persistence**

- [ ] **Progress saved to database**
- [ ] **Test result saved**
- [ ] **Test session recorded**
- [ ] **Next test avoids recent questions (< 20% overlap)**
- [ ] **Starred questions get priority**
- [ ] **Failed questions appear more often**

---

## 🚨 Known Issues & Limitations

### **Fixed:**
✅ Test stuck at "Preparing your questions" - Questions now fetched correctly
✅ Empty questions array - Proper API call added
✅ Type mapping - `question_type` properly mapped to `type`

### **Current Limitations:**
1. **Subjective questions filtered out** - Cannot be auto-graded in timed tests
2. **Test config not passed to TestView** - Currently hardcoded as "balanced" in save function
3. **Time estimate** - Uses 1.5 min/question (may need adjustment)

---

## 📊 Performance Expectations

- **Question fetch:** < 500ms for 500 questions
- **Progress fetch:** < 200ms
- **Test generation:** < 100ms (client-side)
- **Total load time:** < 1 second
- **Shloka screen:** 1.8 seconds
- **Test save:** < 500ms (batch API)

---

## ✅ Final Verification Steps

1. **Select any chapter** (e.g., GOC, P Block, Hydrocarbons)
2. **Click "Timed Test"**
3. **Verify modal appears immediately** (not chapter page)
4. **Configure test:** 20 questions, Balanced, Random
5. **Click "Start Test"**
6. **Verify shloka appears** (1.8s)
7. **Verify test loads** with 20 questions
8. **Answer a few questions**
9. **Submit test**
10. **Verify results screen** shows correct score
11. **Click "Review Solutions"**
12. **Verify solutions display** correctly
13. **Check browser console** - no errors
14. **Check network tab** - all API calls successful

---

## 🎯 Success Criteria

- ✅ No "Preparing your questions" infinite loop
- ✅ All configuration options work
- ✅ Smart test algorithm generates diverse questions
- ✅ Timer works correctly
- ✅ Results display accurately
- ✅ Review mode shows solutions
- ✅ Data saves to backend
- ✅ No console errors
- ✅ No TypeScript errors

**Status:** Ready for production deployment after manual testing ✅
