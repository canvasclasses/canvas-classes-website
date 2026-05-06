require('dotenv').config({ path: '.env.local' });
(async () => {
    // Use require with the compiled TS — check if we can use ts-node or similar
    // Easier: fetch the published Google Sheet directly with the same URL
    const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSHZEaRQS05LJ1DUkUOgaUSRdcMJG8ocpVxkwH1C883xmENL_axHGtCGRMR6nS9pOVmN5XwrI-YGurX/pub?output=csv';
    const res = await fetch(CSV_URL);
    const text = await res.text();
    const rows = text.split(/\r?\n/).slice(1).map((line) => {
        const cells = [];
        let cur = '';
        let inQ = false;
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
    const titles = new Map();
    for (const row of rows) {
        if (row.length < 3) continue;
        const cls = row[1];
        const title = row[2] ? row[2].replace(/^"|"$/g, '').replace(/^Class \d+ NCERT - /, '') : '';
        if (!title || !cls) continue;
        const key = `class-${cls}`;
        if (!titles.has(key)) titles.set(key, []);
        titles.get(key).push({ title, slug: slugify(title) });
    }
    for (const [cls, items] of titles) {
        console.log(`\n=== ${cls} ===`);
        const seen = new Set();
        for (const it of items) {
            if (seen.has(it.slug)) continue;
            seen.add(it.slug);
            console.log(`  ${it.slug.padEnd(60)} (${it.title})`);
        }
    }
})();
