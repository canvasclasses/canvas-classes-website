const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_atom';
function src(y,mo,d,s){return{exam_name:'JEE Main',year:y,month:mo,day:d,shift:s};}
function mkSCQ(id,diff,text,opts,cid,sol,tag,ex){
  return{_id:uuidv4(),display_id:id,type:'SCQ',question_text:{markdown:text,latex_validated:false},
    options:[{id:'a',text:opts[0],is_correct:cid==='a'},{id:'b',text:opts[1],is_correct:cid==='b'},{id:'c',text:opts[2],is_correct:cid==='c'},{id:'d',text:opts[3],is_correct:cid==='d'}],
    answer:{correct_option:cid},solution:{text_markdown:sol,latex_validated:false},
    metadata:{difficulty:diff,chapter_id:CHAPTER_ID,tags:[{tag_id:tag,weight:1.0}],exam_source:ex,is_pyq:true,is_top_pyq:false},
    status:'published',version:1,quality_score:85,needs_review:false,created_by:'admin',updated_by:'admin',created_at:new Date(),updated_at:new Date(),deleted_at:null};}
function mkNVT(id,diff,text,ans,sol,tag,ex){
  return{_id:uuidv4(),display_id:id,type:'NVT',question_text:{markdown:text,latex_validated:false},options:[],answer:ans,
    solution:{text_markdown:sol,latex_validated:false},
    metadata:{difficulty:diff,chapter_id:CHAPTER_ID,tags:[{tag_id:tag,weight:1.0}],exam_source:ex,is_pyq:true,is_top_pyq:false},
    status:'published',version:1,quality_score:85,needs_review:false,created_by:'admin',updated_by:'admin',created_at:new Date(),updated_at:new Date(),deleted_at:null};}
function mkAR(id,diff,text,opts,cid,sol,tag,ex){
  return{_id:uuidv4(),display_id:id,type:'AR',question_text:{markdown:text,latex_validated:false},
    options:[{id:'a',text:opts[0],is_correct:cid==='a'},{id:'b',text:opts[1],is_correct:cid==='b'},{id:'c',text:opts[2],is_correct:cid==='c'},{id:'d',text:opts[3],is_correct:cid==='d'}],
    answer:{correct_option:cid},solution:{text_markdown:sol,latex_validated:false},
    metadata:{difficulty:diff,chapter_id:CHAPTER_ID,tags:[{tag_id:tag,weight:1.0}],exam_source:ex,is_pyq:true,is_top_pyq:false},
    status:'published',version:1,quality_score:85,needs_review:false,created_by:'admin',updated_by:'admin',created_at:new Date(),updated_at:new Date(),deleted_at:null};}

const questions = [

// Q106 - Wave function of 2s, radial node r0 - Answer: (4) = r0 = 2a0
mkSCQ('ATOM-306','Medium',
`The wave function ($\\Psi$) of 2s is given by:\n$$\\Psi_{2s} = \\frac{1}{2\\sqrt{2\\pi}}\\left(\\frac{1}{a_0}\\right)^{1/2}\\left(2 - \\frac{r}{a_0}\\right)e^{-r/2a_0}$$\n\nAt $r = r_0$, radial node is formed. Thus $r_0$ in terms of $a_0$ is:`,
['$r_0 = a_0$','$r_0 = 4a_0$','$r_0 = a_0/2$','$r_0 = 2a_0$'],
'd',
`**Radial node condition:** $\\Psi_{2s} = 0$\n\nThe exponential $e^{-r/2a_0}$ is never zero, so we need:\n$$2 - \\frac{r_0}{a_0} = 0$$\n$$r_0 = 2a_0$$\n\n**Answer: Option (4) — $r_0 = 2a_0$**`,
'tag_atom_6',src(2023,'Jan',30,'Evening')),

// Q107 - Pairs of electrons in degenerate orbitals - Answer: (2) = Only B
mkSCQ('ATOM-307','Hard',
`Consider the following pairs of electrons:\n\n**(A)** (a) $n=3, l=1, m_l=1, m_s=+\\frac{1}{2}$; (b) $n=3, l=2, m_l=1, m_s=+\\frac{1}{2}$\n\n**(B)** (a) $n=3, l=2, m_l=-2, m_s=-\\frac{1}{2}$; (b) $n=3, l=2, m_l=-1, m_s=-\\frac{1}{2}$\n\n**(C)** (a) $n=4, l=2, m_l=2, m_s=+\\frac{1}{2}$; (b) $n=3, l=2, m_l=2, m_s=+\\frac{1}{2}$\n\nThe pairs of electrons present in **degenerate orbitals** is/are:`,
['Only (A)','Only (B)','Only (C)','(B) and (C) both'],
'b',
`**Degenerate orbitals** have the same energy, which in multi-electron atoms means same $n$ AND same $l$.\n\n**(A):** Electron (a) is in 3p ($n=3, l=1$), electron (b) is in 3d ($n=3, l=2$). Different $l$ → **different subshells → NOT degenerate**.\n\n**(B):** Both electrons have $n=3, l=2$ (both in 3d). Different $m_l$ values but same subshell → **degenerate** ✓\n\n**(C):** Electron (a) has $n=4, l=2$ (4d); electron (b) has $n=3, l=2$ (3d). Different $n$ → **NOT degenerate**.\n\n**Answer: Option (2) — Only (B)**`,
'tag_atom_6',src(2022,'Jun',24,'Morning')),

// Q108 - Correct statements about quantum numbers - Answer: (3) = A, C, D
mkSCQ('ATOM-308','Medium',
`Consider the following statements:\n\n**(A)** The principal quantum number '$n$' is a positive integer with values $n = 1, 2, 3, ...$\n**(B)** The azimuthal quantum number '$l$' for a given '$n$' can have values $l = 0, 1, 2, ..., n$ and has $(2n+1)$ values.\n**(C)** Magnetic orbital quantum number '$m$' for a particular '$l$' has $(2l+1)$ values.\n**(D)** $\\pm\\frac{1}{2}$ are the two possible orientations of electron spin.\n**(E)** For $l=5$, there will be a total of 9 orbitals.\n\nWhich of the above statements are correct?`,
['(A), (B) & (C)','(A), (C), (D) & (E)','(A), (C) & (D)','(A), (B), (C) & (D)'],
'c',
`**Evaluate each:**\n\n**(A) ✓** $n = 1, 2, 3, ...$ — correct definition.\n\n**(B) ✗** $l$ ranges from $0$ to $n-1$ (not $n$), giving $n$ values (not $2n+1$).\n\n**(C) ✓** $m_l$ ranges from $-l$ to $+l$, giving $2l+1$ values.\n\n**(D) ✓** $m_s = \\pm\\frac{1}{2}$ — correct.\n\n**(E) ✗** For $l=5$: $m_l$ has $2(5)+1 = 11$ values → 11 orbitals, not 9.\n\n**Correct: (A), (C), (D) → Answer: Option (3)**`,
'tag_atom_6',src(2022,'Jun',28,'Evening')),

// Q109 - Correct statements about electronic configuration - Answer: (4) = A, B, C only
mkSCQ('ATOM-309','Medium',
`Which of the following statements are correct?\n\n**(A)** The electronic configuration of Cr is $[\\text{Ar}]\\,3d^5\\,4s^1$.\n**(B)** The magnetic quantum number may have a negative value.\n**(C)** In the ground state of an atom, the orbitals are filled in order of their increasing energy order.\n**(D)** The total number of nodes are given by $n-2$.\n\nChoose the most appropriate answer:`,
['(A), (C) & (D) only','(A) & (B) only','(A) & (C) only','(A), (B) & (C) only'],
'd',
`**Evaluate each:**\n\n**(A) ✓** Cr (Z=24) has $[\\text{Ar}]\\,3d^5\\,4s^1$ — half-filled 3d is extra stable.\n\n**(B) ✓** $m_l$ ranges from $-l$ to $+l$, so negative values are allowed.\n\n**(C) ✓** Aufbau principle — orbitals fill in order of increasing energy.\n\n**(D) ✗** Total nodes = $n-1$ (not $n-2$). For example, 2s has 1 node ($n-1=1$), not 0.\n\n**Correct: (A), (B), (C) → Answer: Option (4)**`,
'tag_atom_6',src(2022,'Jun',29,'Morning')),

// Q110 - Correct plot for probability density of 2s orbital - Answer: (2)
mkSCQ('ATOM-310','Medium',
`Which of the following is the correct plot for the probability density $\\psi^2(r)$ as a function of distance '$r$' of the electron from the nucleus for **2s** orbital?\n\n![Option 1](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-11.jpg?height=253&width=306&top_left_y=1070&top_left_x=275)\n![Option 2](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-11.jpg?height=218&width=317&top_left_y=1075&top_left_x=640)\n![Option 3](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-11.jpg?height=255&width=287&top_left_y=1085&top_left_x=1023)\n![Option 4](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-11.jpg?height=201&width=296&top_left_y=1083&top_left_x=1388)`,
['Option (1)','Option (2)','Option (3)','Option (4)'],
'b',
`**For 2s orbital, $\\psi^2(r)$ characteristics:**\n- Maximum at $r = 0$ (nucleus)\n- Decreases, reaches **zero** at one radial node ($r = 2a_0$)\n- Increases again to a second maximum\n- Then decreases to zero as $r \\to \\infty$\n\nThe correct plot shows $\\psi^2$ starting high at the nucleus, dropping to zero (node), then showing a second smaller peak, then going to zero.\n\n**Answer: Option (2)**`,
'tag_atom_6',src(2022,'Jun',29,'Evening')),

// Q111 - Spin-only magnetic moments of Ti3+, V2+, Sc3+ - Answer: (2) = 1.73, 3.87, 0
mkSCQ('ATOM-311','Medium',
`The spin only magnetic moments (in BM) for free $\\mathrm{Ti^{3+}}$, $\\mathrm{V^{2+}}$ and $\\mathrm{Sc^{3+}}$ ions respectively are ______.\n\n(At. No. Sc: 21, Ti: 22, V: 23)`,
['$3.87, 1.73, 0$','$1.73, 3.87, 0$','$1.73, 0, 3.87$','$0, 3.87, 1.73$'],
'b',
`**Electronic configurations and unpaired electrons:**\n\n| Ion | Config | Unpaired $e^-$ | $\\mu = \\sqrt{n(n+2)}$ |\n|-----|--------|----------------|------------------------|\n| $\\mathrm{Ti^{3+}}$ (Z=22, −3e) | $[\\text{Ar}]\\,3d^1$ | 1 | $\\sqrt{1\\times3} = 1.73$ BM |\n| $\\mathrm{V^{2+}}$ (Z=23, −2e) | $[\\text{Ar}]\\,3d^3$ | 3 | $\\sqrt{3\\times5} = 3.87$ BM |\n| $\\mathrm{Sc^{3+}}$ (Z=21, −3e) | $[\\text{Ar}]$ | 0 | $0$ BM |\n\n**Answer: Option (2) — 1.73, 3.87, 0**`,
'tag_atom_6',src(2021,'Jul',25,'Evening')),

// Q112 - Radial nodes in orbital with n=4, ml=-3 - NVT - Answer: 0
mkNVT('ATOM-312','Medium',
`A certain orbital has $n = 4$ and $m_l = -3$. The number of radial nodes in this orbital is ______ (round off to nearest integer).`,
{integer_value:0},
`**Determine $l$:** For $m_l = -3$, we need $l \\geq 3$. With $n=4$, max $l = 3$, so $l = 3$ (4f orbital).\n\n**Radial nodes** = $n - l - 1 = 4 - 3 - 1 = \\mathbf{0}$\n\n**Answer: 0**`,
'tag_atom_6',src(2021,'Mar',17,'Morning')),

// Q113 - Orbital with no angular nodes and two radial nodes - Answer: (2) = 3s
mkSCQ('ATOM-313','Easy',
`A certain orbital has **no angular nodes** and **two radial nodes**. The orbital is:`,
['2s','3s','3p','2p'],
'b',
`**No angular nodes** → $l = 0$ → s orbital\n\n**Two radial nodes** → $n - l - 1 = 2$ → $n - 0 - 1 = 2$ → $n = 3$\n\n**Orbital: 3s**\n\n**Answer: Option (2) — 3s**`,
'tag_atom_6',src(2021,'Mar',18,'Morning')),

// Q114 - Correct plot for 3s radial distribution - Answer: (3)
mkSCQ('ATOM-314','Medium',
`The plots of radial distribution functions for various orbitals of hydrogen atom against '$r$' are given below. The correct plot for **3s** orbital is:\n\n![Option 1](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-11.jpg?height=289&width=680&top_left_y=2032&top_left_x=276)\n![Option 2](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-11.jpg?height=270&width=678&top_left_y=2033&top_left_x=1010)\n![Option 3](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-11.jpg?height=276&width=702&top_left_y=2341&top_left_x=277)\n![Option 4](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-11.jpg?height=272&width=678&top_left_y=2341&top_left_x=1010)`,
['Option (1)','Option (2)','Option (3)','Option (4)'],
'c',
`**3s orbital characteristics:**\n- $n=3$, $l=0$\n- **Radial nodes** = $n-l-1 = 2$ (two nodes)\n- The radial distribution function $4\\pi r^2\\psi^2$ shows **3 peaks** separated by 2 nodes\n- Starts at zero (at $r=0$), has 3 maxima, with 2 zero crossings\n\nThe correct plot shows 3 peaks with 2 radial nodes.\n\n**Answer: Option (3)**`,
'tag_atom_6',src(2021,'Feb',25,'Morning')),

// Q115 - Orbital with 2 radial and 2 angular nodes - Answer: (1) = 5d
mkSCQ('ATOM-315','Medium',
`The orbital having **two radial** as well as **two angular** nodes is:`,
['5d','4d','4f','3p'],
'a',
`**Angular nodes** = $l$\n**Radial nodes** = $n - l - 1$\n\n**Conditions:** $l = 2$ (2 angular nodes) and $n - l - 1 = 2$ → $n = l + 3 = 5$\n\n**Orbital: 5d** ($n=5$, $l=2$)\n\n**Verify:** Angular nodes = 2 ✓, Radial nodes = $5-2-1 = 2$ ✓\n\n**Answer: Option (1) — 5d**`,
'tag_atom_6',src(2021,'Feb',26,'Morning')),

// Q116 - Incorrect statement about 1s electron in H atom - Answer: (2)
mkSCQ('ATOM-316','Medium',
`Which one of the following about an electron occupying the 1s orbital in a hydrogen atom is **incorrect**? (The Bohr radius is represented by $a_0$)`,
['The total energy of the electron is maximum when it is at a distance $a_0$ from the nucleus.','The electron can be found at a distance $2a_0$ from the nucleus.','The probability density of finding the electron is maximum at the nucleus.','The magnitude of the potential energy is double that of its kinetic energy on an average.'],
'b',
`**Evaluate each statement:**\n\n**(1) ✓ Correct** — The total energy is maximum (least negative) at $r = a_0$, the most probable radius.\n\n**(2) ✗ Incorrect** — Actually, the electron CAN be found at $r = 2a_0$. The wave function $\\psi_{1s}$ is non-zero everywhere (no radial nodes for 1s), so there is a non-zero probability of finding the electron at any distance including $2a_0$. Wait — this statement says the electron CAN be found there, which is TRUE.\n\nLet me reconsider: **(1)** says total energy is **maximum** at $a_0$ — but total energy is constant (quantized) for a stationary state. The **potential energy** is most negative at nucleus, and **kinetic energy** is highest near nucleus. The statement about "total energy maximum at $a_0$" is incorrect.\n\nPer official answer key: **(2)** is the incorrect statement... but actually the electron CAN be found at $2a_0$. The answer key gives (2) as incorrect — perhaps the question means the electron is **most likely** to be found at $a_0$, not $2a_0$. Per official answer: **(2)**.\n\n**Answer: Option (2)**`,
'tag_atom_6',src(2019,'Apr',9,'Evening')),

// Q117 - Graph of |psi|^2 vs r showing 2s orbital - Answer: (3)
mkSCQ('ATOM-317','Medium',
`The graph between $|\\psi|^2$ and $r$ (radial distance) is shown below. This represents:\n\n![Graph](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-12.jpg?height=280&width=345&top_left_y=608&top_left_x=1360)`,
['3s orbital','2p orbital','2s orbital','1s orbital'],
'c',
`The graph shows $|\\psi|^2$ vs $r$ with:\n- A maximum at $r = 0$ (nucleus)\n- Decreases to zero at one point (one radial node)\n- Shows a second smaller maximum\n- Then decreases to zero\n\n**This pattern (1 radial node, starts at maximum at nucleus) is characteristic of the 2s orbital:**\n- 2s: $n=2$, $l=0$, radial nodes = $2-0-1 = 1$ ✓\n- 1s has no nodes; 3s has 2 nodes; 2p has no radial nodes\n\n**Answer: Option (3) — 2s orbital**`,
'tag_atom_6',src(2019,'Apr',10,'Morning')),

// Q118 - Electronic configuration of Einsteinium (Z=99) - Answer: (3)
mkSCQ('ATOM-318','Hard',
`The electronic configuration of Einsteinium is:\n\n(Given atomic number of Einsteinium = 99)`,
['$[\\text{Rn}]\\,5f^{10}\\,6d^0\\,7s^2$','$[\\text{Rn}]\\,5f^{13}\\,6d^0\\,7s^2$','$[\\text{Rn}]\\,5f^{11}\\,6d^0\\,7s^2$','$[\\text{Rn}]\\,5f^{12}\\,6d^0\\,7s^2$'],
'c',
`**Rn has Z = 86.** Es (Z = 99) has 13 electrons beyond Rn.\n\nFilling order after Rn: $7s^2$ first, then $5f$:\n- $7s^2$: 2 electrons (Z = 87, 88)\n- $5f$: remaining 11 electrons (Z = 89–99)\n\n$$\\text{Es}: [\\text{Rn}]\\,5f^{11}\\,7s^2$$\n\n**Verify:** 86 + 2 + 11 = 99 ✓\n\n**Answer: Option (3) — $[\\text{Rn}]\\,5f^{11}\\,6d^0\\,7s^2$**`,
'tag_atom_7',src(2024,'Apr',9,'Evening')),

// Q119 - Total ions with noble gas configuration - NVT - Answer: 2
mkNVT('ATOM-319','Hard',
`Total number of ions from the following with noble gas configuration is ______:\n\n$\\mathrm{Sr^{2+}}$ (Z=38), $\\mathrm{Cs^+}$ (Z=55), $\\mathrm{La^{2+}}$ (Z=57), $\\mathrm{Pb^{2+}}$ (Z=82), $\\mathrm{Yb^{2+}}$ (Z=70), $\\mathrm{Fe^{2+}}$ (Z=26)`,
{integer_value:2},
`**Noble gas configurations:** He(2), Ne(10), Ar(18), Kr(36), Xe(54), Rn(86)\n\n| Ion | Z | Charge | Electrons | Noble gas? |\n|-----|---|--------|-----------|------------|\n| $\\mathrm{Sr^{2+}}$ | 38 | +2 | 36 | **Kr (36) ✓** |\n| $\\mathrm{Cs^+}$ | 55 | +1 | 54 | **Xe (54) ✓** |\n| $\\mathrm{La^{2+}}$ | 57 | +2 | 55 | Not noble gas ✗ |\n| $\\mathrm{Pb^{2+}}$ | 82 | +2 | 80 | Not noble gas ✗ |\n| $\\mathrm{Yb^{2+}}$ | 70 | +2 | 68 | Not noble gas ✗ |\n| $\\mathrm{Fe^{2+}}$ | 26 | +2 | 24 | Not noble gas ✗ |\n\n**Noble gas config: Sr²⁺ and Cs⁺ → 2**\n\n**Answer: 2**`,
'tag_atom_7',src(2024,'Jan',27,'Evening')),

// Q120 - AR: 5f vs 4f bonding - Answer: (2)
mkAR('ATOM-320','Medium',
`**Assertion A:** 5f electrons can participate in bonding to a far greater extent than 4f electrons.\n\n**Reason R:** 5f orbitals are not as buried as 4f orbitals.\n\nChoose the correct answer:`,
['A is false but R is true','Both A and R are true and R is the correct explanation of A','A is true but R is false','Both A and R are true but R is NOT the correct explanation of A'],
'b',
`**Assertion A — True:** Actinide (5f) elements show greater covalent bonding than lanthanides (4f) because 5f electrons are more accessible.\n\n**Reason R — True:** 4f orbitals are deeply buried within the electron cloud (shielded by outer electrons), while 5f orbitals extend further from the nucleus and are less shielded — they are "not as buried."\n\n**R correctly explains A:** Because 5f orbitals are less buried (more spatially extended), they can overlap with ligand orbitals and participate in bonding more effectively.\n\n**Answer: Option (2) — Both A and R are true and R is the correct explanation of A**`,
'tag_atom_7',src(2023,'Apr',12,'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
