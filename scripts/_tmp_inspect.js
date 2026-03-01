const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const MONTH_NUM = {
  Jan:1, January:1, Feb:2, February:2, Mar:3, March:3,
  Apr:4, April:4, May:5, Jun:6, June:6, Jul:7, July:7,
  Aug:8, September:9, Sep:9, Oct:10, Nov:11, Dec:12
};

const checks = [
  { year:2025, month:'Jan', day:22 },
  { year:2025, month:'Jan', day:23 },
  { year:2024, month:'Jan', day:29 },
  { year:2024, month:'Jan', day:30 },
  { year:2024, month:'Feb', day:1  },
  { year:2024, month:'Feb', day:10 },
  { year:2025, month:'Apr', day:3  },
  { year:2025, month:'Apr', day:4  },
  { year:2025, month:'Apr', day:7  },
  { year:2024, month:'Apr', day:4  },
  { year:2024, month:'Apr', day:5  },
  { year:2024, month:'Apr', day:6  },
];

async function main() {
  const res = await fetch('http://localhost:3000/api/v2/questions?chapter_id=ch12_carbonyl&limit=300&skip=0');
  const d = await res.json();
  const qs = (Array.isArray(d.data) ? d.data : []).filter(q => /^ALDO-\d+$/.test(q.display_id));

  for (const c of checks) {
    const targetMonth = MONTH_NUM[c.month];
    const matches = qs.filter(q => {
      const es = q.metadata?.exam_source;
      if (!es) return false;
      const dbMonth = MONTH_NUM[es.month] || 0;
      return es.year === c.year && dbMonth === targetMonth && es.day === c.day;
    });
    if (matches.length > 0) {
      matches.forEach(q => {
        const es = q.metadata.exam_source;
        const preview = q.question_text.markdown.substring(0,55).replace(/\n/g,' ');
        console.log(`${q.display_id} | ${c.year} ${c.month} ${c.day} | shift="${es.shift}" | ${preview}`);
      });
    } else {
      console.log(`NOT IN DB: ${c.year} ${c.month} ${c.day}`);
    }
  }
}
main();
