const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/the-crucible/questions.json');
const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const q54Id = 'jee_2026_jan21m_q54';

const q54Content = {
    id: q54Id,
    questionType: 'MCQ',
    textMarkdown: `A hydrocarbon 'P' ($C_4H_8$) on reaction with HCl gives an optically active compound 'Q' ($C_4H_9Cl$) which on reaction with one mole of ammonia gives compound 'R' ($C_4H_{11}N$). 'R' on diazotization followed by hydrolysis gives 'S'. Identify P, Q, R and S.`,
    options: [
        {
            id: "1",
            text: `P=$CH_3-CH_2-CH=CH_2$, Q=$CH_3-CH_2-CH_2-CH_2-Cl$\nR=$CH_3-CH_2-CH_2-CH_2-NH_2$, S=$CH_3-CH_2-CH_2-CH_2-OH$`,
            isCorrect: false
        },
        {
            id: "2",
            text: `P=$CH_3-\\vartriangle$ (Methylcyclopropane), Q=$Cl-CH_2-\\vartriangle$\nR=$H_2N-CH_2-\\vartriangle$, S=$HO-CH_2-\\vartriangle$`,
            isCorrect: false
        },
        {
            id: "3",
            text: `P=$CH_3-CH=CH-CH_3$, Q=$CH_3-CH_2-CH(Cl)-CH_3$\nR=$CH_3-CH_2-CH(NH_2)-CH_3$, S=$CH_3-CH_2-CH(OH)-CH_3$`,
            isCorrect: true
        },
        {
            id: "4",
            text: `P=$CH_3-CH=CH-CH_3$, Q=$CH_3-CH_2-CH_2-CH_2-Cl$\nR=$CH_3-CH_2-CH_2-CH_2-NH_2$, S=$CH_3-CH_2-CH_2-CH_2-OH$`,
            isCorrect: false
        }
    ],
    // Ensure metadata is consistent
    sourceReferences: [{
        type: 'PYQ',
        pyqExam: 'JEE Mains',
        pyqYear: '2026',
        pyqShift: 'Jan 21 Morning',
        pyqQuestionNo: '54'
    }],
    topicId: 'Hydrocarbons',
    chapterId: 'Hydrocarbons'
};

const idx = questions.findIndex(q => q.id === q54Id);
if (idx !== -1) {
    // Preserve existing concept tags if strictly necessary, but user said "replace".
    // We'll keep basic metadata if present but overwrite content.
    questions[idx] = {
        ...questions[idx],
        ...q54Content,
        // If we want to keep tags, uncomment:
        // conceptTags: questions[idx].conceptTags,
        // tagId: questions[idx].tagId
    };
    console.log('Updated Q54');
} else {
    questions.push(q54Content);
    console.log('Added Q54');
}

fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
console.log('Written to ' + filePath);
