const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../data/questions/chapter_basic_concepts_mole_concept.json');

function fixSpacing() {
    console.log(`Processing ${FILE}...`);
    try {
        const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
        let count = 0;

        data.forEach(q => {
            if (!q.textMarkdown) return;
            let original = q.textMarkdown;
            let text = original;

            // 1. Add space before $ if preceded by alphanumeric, %, ., ,, or )
            text = text.replace(/([a-zA-Z0-9%\.,\)])(\$)/g, '$1 $2');

            // 2. Add space after $ if followed by alphanumeric or (
            text = text.replace(/(\$)([a-zA-Z0-9\(])/g, '$1 $2');

            // 3. Add space after comma if followed by alphanumeric or $
            text = text.replace(/,([a-zA-Z\$])/g, ', $1');

            // 4. Add space after period if followed by alphanumeric, $, or (
            text = text.replace(/\.([a-zA-Z\$\(])/g, '. $1');

            if (text !== original) {
                q.textMarkdown = text;
                count++;
            }
        });

        fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
        console.log(`Fixed spacing in ${count} questions.`);
    } catch (err) {
        console.error("Error fixing spacing:", err);
        process.exit(1);
    }
}

fixSpacing();
