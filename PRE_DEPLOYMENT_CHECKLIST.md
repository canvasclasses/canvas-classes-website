# Pre-Deployment Checklist - Crucible Updates

## ✅ Changes Made

### 1. **Guided Practice Beta Launch (GOC Only)**
- ✅ Added BETA badge and "Currently: GOC only" subtitle
- ✅ Added beta explanation in "How this session works" section
- ✅ Added conditional warning for non-GOC chapters
- ✅ Disabled "Begin Session" button for non-GOC chapters
- ✅ Clear messaging: "Available for GOC Only"

### 2. **Timed Test Configuration Flow**
- ✅ Fixed flow: Chapter selection → Test Config Modal → Shloka → Test starts
- ✅ Removed intermediate chapter page step
- ✅ Added TestConfigModal directly to CrucibleWizard
- ✅ Smart test generator with user progress integration
- ✅ Configuration options: count, difficulty mix, question order

### 3. **UI Improvements**
- ✅ Fixed auto-scroll issue on Guided Practice selection
- ✅ Fixed back button positioning in Browse mode (aligned with central content)
- ✅ Updated Timed Test description: "Simulate exam conditions • Test your speed & accuracy"

### 4. **Data Fixes**
- ✅ Fixed 164 GOC questions (191-354) that had incorrect exam_source metadata
- ✅ Cleared exam_source for non-PYQ questions

---

## 🧪 Testing Checklist

### **A. Guided Practice Flow**

#### Test 1: GOC Chapter (Should Work)
1. [ ] Select GOC chapter from Step 1
2. [ ] Expand Guided Practice card
3. [ ] Verify BETA badge is visible
4. [ ] Verify "Currently: GOC only" subtitle shows
5. [ ] Expand "How this session works"
6. [ ] Verify beta notice appears at bottom
7. [ ] Configure difficulty and session length
8. [ ] Click "Begin Session"
9. [ ] Verify shloka screen appears
10. [ ] Verify guided practice session starts correctly

#### Test 2: Non-GOC Chapter (Should Show Warning)
1. [ ] Select any non-GOC chapter (e.g., Hydrocarbons)
2. [ ] Expand Guided Practice card
3. [ ] Verify warning box appears: "Coming Soon for [Chapter Name]"
4. [ ] Verify "Begin Session" button is disabled
5. [ ] Verify button text shows "Available for GOC Only"
6. [ ] Verify configuration options are still visible but grayed out

### **B. Timed Test Flow**

#### Test 3: Timed Test Configuration
1. [ ] Select any chapter (e.g., P Block)
2. [ ] Click "Timed Test" button
3. [ ] **CRITICAL:** Verify TestConfigModal appears immediately (NOT chapter page)
4. [ ] Verify question count options show (10, 20, 30, etc.)
5. [ ] Verify difficulty mix options show (Balanced, Warm Up, Challenge, PYQ Only)
6. [ ] Verify question order options show (Random, Easy→Hard, By Topic)
7. [ ] Verify time estimate updates when changing question count
8. [ ] Click "Start Test"
9. [ ] Verify shloka screen appears
10. [ ] Verify test starts with correct number of questions
11. [ ] Verify timer is running
12. [ ] Complete test and verify save modal appears

### **C. Free Browse Flow**

#### Test 4: Browse Mode
1. [ ] Select any chapter
2. [ ] Click "Free Browse" button
3. [ ] Verify shloka screen appears
4. [ ] Verify browse view loads with questions
5. [ ] Verify back button is aligned with central content (not far left)
6. [ ] Click back button
7. [ ] Verify returns to wizard correctly

### **D. UI/UX Checks**

#### Test 5: Auto-scroll Fix
1. [ ] Select a chapter for Guided Practice
2. [ ] **CRITICAL:** Verify page does NOT auto-scroll up
3. [ ] Verify header text remains visible
4. [ ] Verify Step 2 expands smoothly without jumping

#### Test 6: Back Button Positioning
1. [ ] Enter Browse mode on a widescreen monitor
2. [ ] Verify back button is NOT at extreme left edge
3. [ ] Verify back button aligns with central content area (maxWidth: 1200px)

### **E. Data Integrity Checks**

#### Test 7: GOC Question Filtering
1. [ ] Go to Browse mode for GOC chapter
2. [ ] Click "JEE Mains" filter
3. [ ] Verify only actual PYQs appear (GOC-001 to GOC-190)
4. [ ] Verify GOC-191+ questions do NOT appear in this filter
5. [ ] Click "Non-PYQ" filter
6. [ ] Verify GOC-191+ questions appear here

---

## 🚨 Critical Issues to Watch For

1. **Timed Test Flow:** Must show config modal immediately, NOT route to chapter page first
2. **GOC Restriction:** Non-GOC chapters must show warning and disable button
3. **Auto-scroll:** Page must NOT jump when selecting chapter for Guided Practice
4. **Back Button:** Must be centered on widescreen, not at far left edge
5. **Question Filtering:** GOC 191+ must NOT appear in JEE Mains filter

---

## 📝 Files Modified

1. `/app/the-crucible/components/CrucibleWizard.tsx` - Main wizard component
2. `/app/the-crucible/components/BrowseView.tsx` - Back button positioning
3. `/scripts/fix_goc_exam_source.js` - Database cleanup (safe to delete after verification)

---

## 🔄 Rollback Plan (If Needed)

If critical issues are found:
1. Revert `/app/the-crucible/components/CrucibleWizard.tsx` to previous version
2. Revert `/app/the-crucible/components/BrowseView.tsx` to previous version
3. Keep GOC question fixes (they're correct)

---

## ✅ Final Sign-Off

- [ ] All Guided Practice tests pass
- [ ] All Timed Test tests pass
- [ ] All Browse mode tests pass
- [ ] All UI/UX checks pass
- [ ] All data integrity checks pass
- [ ] No console errors in browser
- [ ] No TypeScript errors
- [ ] Ready for production deployment

**Tested by:** _______________
**Date:** _______________
**Approved for deployment:** [ ] YES [ ] NO
