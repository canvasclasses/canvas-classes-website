const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/the-crucible/questions.json');
const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// cleanup q53 testing artifacts
const q53Id = 'jee_2026_jan21m_q53';
const idx = questions.findIndex(q => q.id === q53Id);
if (idx !== -1) {
    if (questions[idx].textMarkdown.includes('TESTING MODE')) {
        questions[idx].textMarkdown = questions[idx].textMarkdown.replace('TESTING MODE:\nOption 1: Cyclohexane\nOption 2: Benzene\nOption 3: Decalin\nOption 4: Original Complex', 'Identify A in the following reaction.\n\n![Reaction Scheme](/questions/jan21m_q53_reaction.png)\n(Note: Reaction involves Hydrogenation and Oxidative Cleavage)');
    }
}
// Clean up scripts (delete them)
['debug-q53.js', 'update-q53.js', 'rotate-q53.js', 'restore-q53.js'].forEach(file => {
    try { fs.unlinkSync(path.join(__dirname, file)); } catch (e) { }
});

fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
