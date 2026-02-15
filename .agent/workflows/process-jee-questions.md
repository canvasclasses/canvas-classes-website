---
description: Automatically process JEE question images and update the database
---

When the user uploads images for JEE questions, follow these steps to process them without requiring redundant instructions:

1. **Analyze Images**:
    - Use your vision capabilities to accurately transcribe the question, options, and explanation.
    - Identify the **Exam Source** (e.g., "JEE Main 2025 - Apr 7 Evening Shift").
    - Deduce the **Chapter ID** (e.g., `chapter_practical_organic_chemistry`).
    - Infer the **Concept Tags** (e.g., `TAG_PRAC_PURIFICATION_TECHNIQUES`).
    - Determine the **Difficulty** (Easy/Medium/Hard).
    - If solution to the question is not provided then **Generate Solution** acting as subject expert.

2. **Format Data**:
    - Ensure all mathematical symbols and chemical formulas use LaTeX (e.g., `$CH_3OH$`, `$$...$$`).
    - Use Markdown for structured text.
    - Generate a unique ID following the pattern: `jee_[year]_[shift_code]_[chapter_short]_[index]`.

3. **Update Local Question Bank**:
    - Add the question to the local JSON file: `app/the-crucible/questions.json`.
    - Handle both NEW questions and UPDATES to existing ones (if the ID matches).

4. **Sync to MongoDB**:
// turbo
    - Run the command: `node scripts/push_json_to_mongo.js`
    - This will automatically upsert the new questions into the cloud database.

5. **Final Verification**:
    - Report the successful addition of the question(s).
    - Provide a summary of the chapter and tags assigned.