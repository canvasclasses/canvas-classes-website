const fs = require('fs');

try {
    const data = fs.readFileSync('data/questions/chapter_basic_concepts_mole_concept.json', 'utf8');
    const q = JSON.parse(data);

    console.log('ID | isPYQ | Year | Shift | Source');
    console.log('---|---|---|---|---');

    for (let i = 1; i <= 60; i++) {
        const id = 'MOLE-' + String(i).padStart(3, '0');
        const item = q.find(x => x.id === id);

        if (item) {
            const year = item.pyqYear || 'NO';
            const shift = item.pyqShift || 'NO';
            const source = item.examSource ? item.examSource.substring(0, 20) + '...' : 'undefined';
            console.log(`${id} | ${item.isPYQ} | ${year} | ${shift} | ${source}`);
        } else {
            console.log(`${id} | NOT FOUND`);
        }
    }
} catch (e) {
    console.error(e);
}
