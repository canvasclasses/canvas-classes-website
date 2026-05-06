require('dotenv').config({ path: '.env.local' });
(async () => {
    const fs = require('fs');
    const ncertSrc = fs.readFileSync('app/lib/ncertData.ts', 'utf-8');
    const csvMatch = ncertSrc.match(/CSV_URL\s*=\s*['"]([^'"]+)['"]/);
    if (!csvMatch) { console.log('No CSV_URL found in ncertData.ts'); return; }
    const text = await (await fetch(csvMatch[1])).text();
    const rows = text.split(/\r?\n/).slice(1).map((line) => {
        const cells = []; let cur = ''; let inQ = false;
        for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (c === '"') inQ = !inQ;
            else if (c === ',' && !inQ) { cells.push(cur); cur = ''; }
            else cur += c;
        }
        cells.push(cur);
        return cells;
    });
    function slugify(t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
    // Need to find the chapter column — print header first
    const headerLine = text.split(/\r?\n/)[0];
    console.log('Header:', headerLine);
    console.log('');
    // Print first 5 rows fully
    for (let i = 0; i < Math.min(rows.length, 5); i++) console.log(`Row ${i}:`, rows[i].slice(0, 5).join(' | '));
})();
