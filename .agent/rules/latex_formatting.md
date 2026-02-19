# LaTeX Formatting Standards for Question Database

> [!IMPORTANT]
> All AI agents and contributors MUST follow these LaTeX formatting rules when adding or editing questions and solutions.

## Core Principles

### 1. Spacing Around Delimiters

**Always add space before and after** `$` delimiters for inline math.

✅ **Correct:**
```
The mass of $ CO_2 $ is $ 44 $ g/mol.
Calculate $ \frac{1}{2} $ of the value.
```

❌ **Incorrect:**
```
The mass of$CO_2$is$44$g/mol.
Calculate$\frac{1}{2}$of the value.
```

### 2. Inline vs Block Math

- **Inline math**: Use single `$` with surrounding spaces
  - Example: `The value of $ x $ is $ 5 $`
  
- **Block math**: Use `$$` for display equations (displayed on separate line)
  - Example:
    ```
    The quadratic formula is:
    $$ x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} $$
    ```

### 3. Spacing with Punctuation

**After commas:**
```
✅ For $ A $, $ B $, and $ C $ we have...
❌ For $ A $,$ B $,and $ C $ we have...
```

**After periods:**
```
✅ Calculate $ x $. Then find $ y $.
❌ Calculate $ x $.Then find $ y $.
```

**With parentheses:**
```
✅ The value ( $ x = 5 $ ) is given.
❌ The value ($ x = 5 $) is given.
```

### 4. Chemical Formulas

Use `\mathrm{}` or `\ce{}` for chemical symbols:

```
✅ $ \mathrm{H_2O} $, $ \mathrm{CO_2} $, $ \mathrm{Fe^{3+}} $
✅ $ \ce{H2O} $, $ \ce{CO2} $, $ \ce{Fe^{3+}} $
❌ $ H_2O $, $CO_2$, $Fe^{3+}$
```

### 5. Common LaTeX Patterns

**Fractions:**
```
$ \frac{numerator}{denominator} $
$ \frac{1}{2} $, $ \frac{a + b}{c - d} $
```

**Square roots:**
```
$ \sqrt{x} $, $ \sqrt{a^2 + b^2} $
$ \sqrt[3]{27} $ (cube root)
```

**Exponents and subscripts:**
```
$ x^2 $, $ 10^{-5} $
$ x_1 $, $ H_{2}O $
```

**Greek letters:**
```
$ \alpha $, $ \beta $, $ \gamma $, $ \Delta $, $ \theta $
```

**Mathematical operators:**
```
$ \times $, $ \div $, $ \pm $, $ \approx $, $ \neq $
$ \leq $, $ \geq $, $ \sum $, $ \int $
```

## Solution-Specific Standards

### Step-by-Step Format

Solutions should include:

1. **Clear heading** for each major step
2. **Proper LaTeX** in all mathematical expressions
3. **Final answer** clearly marked

**Example Structure:**
```markdown
**Step 1: Identify Given Data**
Mass = $ 100 $ g, Volume = $ 50 $ mL

**Step 2: Apply Formula**
Density $ \rho = \frac{\text{Mass}}{\text{Volume}} $

**Step 3: Calculate**
$ \rho = \frac{100}{50} = 2 $ g/mL

**Final Answer:** $ 2 $ g/mL
```

## Validation

### Automated Checks

Before committing any changes, run:
```bash
node scripts/validate_question_spacing.js
```

This will check for:
- Missing spaces before `$`
- Missing spaces after `$`
- Missing spaces after commas
- Issues in both questions AND solutions

### Fix Script

If validation fails, run:
```bash
node scripts/fix_spacing_all_questions.js  # Fixes questions
node scripts/fix_solution_latex.js         # Fixes solutions
```

## Common Mistakes to Avoid

| ❌ Wrong | ✅ Correct | Issue |
|---------|-----------|-------|
| `value$x$is` | `value $ x $ is` | No spaces around `$` |
| `$ H_2O$reacts` | `$ H_2O $ reacts` | Missing space after `$` |
| `for$A,B,$and` | `for $ A $, $ B $, and` | Multiple spacing issues |
| `Calculate$x$.Then` | `Calculate $ x $. Then` | No space after `$` and period |
| `$=99$` | `$ =99 $` | No spaces inside delimiters |
| `$5800\\AA$` | `$ 5800 \\AA $` | Missing spaces with units |
| `$10^{-8}$cm` | `$ 10^{-8} $ cm` | Missing space before unit |
| `$\\frac{1}{2}$of` | `$ \\frac{1}{2} $ of` | Missing space after closing `$` |

## Additional Physics/Chemistry Specific Rules

### Units and Constants
Always add space between value and unit:
```
✅ $ 5800 \\text{ Å} $ or $ 5800 \\AA $
✅ $ 3 \\times 10^8 \\text{ m/s} $
✅ $ 9.1 \\times 10^{-31} \\text{ kg} $
❌ $ 5800\\AA $ or $5800 \\text{ Å}$
```

### Equations with equals signs
Always add space around equals signs:
```
✅ Given $ x = 5 $ and $ y = 10 $
❌ Given $x=5$ and $y=10$
```

### Multiple mathematical expressions
Separate each expression with spaces:
```
✅ For $ A $, $ B $, and $ C $ we have
❌ For $A$,$B$, and $C$ we have
```

## JSON Escaping

In JSON files, remember to escape backslashes:

```json
{
  "textMarkdown": "The formula is $ \\\\frac{1}{2} $",
  "solution": {
    "textSolutionLatex": "Answer: $ x = \\\\sqrt{2} $"
  }
}
```

Note the double backslashes `\\\\` for LaTeX commands.

## MongoDB Field Names

The sync script automatically updates both field formats:
- `textMarkdown` and `text_markdown` (for questions)
- `solution.textSolutionLatex` and `solution.text_latex` (for solutions)

Always edit the JSON files - the MongoDB sync handles field conversion.

---

## Summary Checklist

- [ ] Space before every `$`
- [ ] Space after every `$`
- [ ] Space after commas and periods
- [ ] Use `\mathrm{}` for chemical formulas
- [ ] Double backslashes in JSON: `\\\\`
- [ ] Run validation before committing
- [ ] Solutions have clear step-by-step structure

**When in doubt, run the validator!**
