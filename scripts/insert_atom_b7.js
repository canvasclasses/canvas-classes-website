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

const questions = [

// Q91 - de Broglie wavelength of electron in 4th Bohr orbit - Answer: (4) = 8πa0
mkSCQ('ATOM-291','Medium',
`The de Broglie wavelength of an electron in the $4^{\\text{th}}$ Bohr orbit is:`,
['$2\\pi a_0$','$4\\pi a_0$','$6\\pi a_0$','$8\\pi a_0$'],
'd',
`**de Broglie condition:** $2\\pi r_n = n\\lambda$\n\n$r_n = n^2 a_0$ for hydrogen\n\n$r_4 = 16a_0$\n\n$\\lambda = 2\\pi r_4/n = 2\\pi\\times16a_0/4 = 8\\pi a_0$\n\n**Answer: Option (4) — $8\\pi a_0$**`,
'tag_atom_5',src(2020,'Jan',9,'Morning')),

// Q92 - Wavelength for 1.5p momentum photoelectron - Answer: (1) = 4λ/9
mkSCQ('ATOM-292','Hard',
`If $p$ is the momentum of the fastest electron ejected from a metal surface after irradiation of light having wavelength $\\lambda$, then for $1.5p$ momentum of the photoelectron, the wavelength of the light should be: (Assume KE >> work function)`,
['$\\frac{4}{9}\\lambda$','$\\frac{3}{4}\\lambda$','$\\frac{2}{3}\\lambda$','$\\frac{1}{2}\\lambda$'],
'a',
`**Since KE >> work function:** $E_{photon} \\approx KE = p^2/(2m)$\n\n$hc/\\lambda = p^2/(2m)$ ... (1)\n\nFor momentum $1.5p$:\n$hc/\\lambda' = (1.5p)^2/(2m) = 2.25p^2/(2m)$ ... (2)\n\nDividing (1) by (2):\n$\\lambda'/\\lambda = 1/2.25 = 4/9$\n\n$\\lambda' = 4\\lambda/9$\n\n**Answer: Option (1)**`,
'tag_atom_5',src(2019,'Apr',8,'Evening')),

// Q93 - Graph NOT representing photoelectric effect - Answer: (1)
mkSCQ('ATOM-293','Medium',
`Which of the graphs shown below does **not** represent the relationship between incident light and the electron ejected from metal surface?\n\n![Option 1](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-09.jpg?height=261&width=297&top_left_y=1406&top_left_x=258)\n![Option 2](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-09.jpg?height=268&width=296&top_left_y=1403&top_left_x=629)\n![Option 3](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-09.jpg?height=270&width=298&top_left_y=1410&top_left_x=999)\n![Option 4](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-09.jpg?height=269&width=302&top_left_y=1406&top_left_x=1365)`,
['Option (1): KE vs frequency — shows KE increasing even below threshold','Option (2): KE vs frequency — linear above threshold, zero below','Option (3): Stopping potential vs frequency — linear','Option (4): Photoelectric current vs intensity — linear'],
'a',
`**Key facts about photoelectric effect:**\n- KE of ejected electrons is **zero** below threshold frequency $\\nu_0$\n- KE increases **linearly** with frequency above $\\nu_0$: $KE = h(\\nu - \\nu_0)$\n- Stopping potential is proportional to frequency\n- Photoelectric current is proportional to intensity (not frequency)\n\n**The graph that does NOT represent the correct relationship** is one that shows KE increasing below the threshold frequency — this violates the photoelectric effect.\n\n**Answer: Option (1)**`,
'tag_atom_5',src(2019,'Jan',10,'Morning')),

// Q94 - de Broglie wavelength of photoelectron vs frequency - Answer: (4) = λ ∝ 1/(v-v0)^(1/2)
mkSCQ('ATOM-294','Hard',
`The de Broglie wavelength ($\\lambda$) associated with a photoelectron varies with the frequency ($\\nu$) of the incident radiation as [$\\nu_0$ is threshold frequency]:`,
['$\\lambda \\propto \\dfrac{1}{(\\nu-\\nu_0)}$','$\\lambda \\propto \\dfrac{1}{(\\nu-\\nu_0)^{1/4}}$','$\\lambda \\propto \\dfrac{1}{(\\nu-\\nu_0)^{3/2}}$','$\\lambda \\propto \\dfrac{1}{(\\nu-\\nu_0)^{1/2}}$'],
'd',
`**KE of photoelectron:** $KE = h(\\nu - \\nu_0)$\n\n**de Broglie wavelength:** $\\lambda = h/p = h/\\sqrt{2m\\cdot KE}$\n\n$$\\lambda = \\frac{h}{\\sqrt{2m\\cdot h(\\nu-\\nu_0)}} = \\frac{h}{\\sqrt{2mh}}\\cdot\\frac{1}{(\\nu-\\nu_0)^{1/2}}$$\n\n$$\\lambda \\propto \\frac{1}{(\\nu-\\nu_0)^{1/2}}$$\n\n**Answer: Option (4)**`,
'tag_atom_5',src(2019,'Jan',11,'Evening')),

// Q95 - Work function from 4000 Å light and v=6e5 m/s - Answer: (4) = 2.1 eV
mkSCQ('ATOM-295','Medium',
`What is the work function of the metal if the light of wavelength 4000 Å generates photoelectrons of velocity $6\\times10^5$ ms$^{-1}$ from it?\n\n(Mass of electron $=9\\times10^{-31}$ kg, $c=3\\times10^8$ ms$^{-1}$, $h=6.626\\times10^{-34}$ Js, charge of electron $=1.6\\times10^{-19}$ C)`,
['0.9 eV','4.0 eV','3.1 eV','2.1 eV'],
'd',
`**Energy of incident photon:**\n$$E = hc/\\lambda = (6.626\\times10^{-34}\\times3\\times10^8)/(4000\\times10^{-10}) = 4.97\\times10^{-19}\\,\\text{J} = 3.1\\,\\text{eV}$$\n\n**KE of photoelectron:**\n$$KE = \\frac{1}{2}mv^2 = \\frac{1}{2}\\times9\\times10^{-31}\\times(6\\times10^5)^2 = 1.62\\times10^{-19}\\,\\text{J} = 1.01\\,\\text{eV}$$\n\n**Work function:**\n$$\\phi = E - KE = 3.1 - 1.01 \\approx 2.1\\,\\text{eV}$$\n\n**Answer: Option (4) — 2.1 eV**`,
'tag_atom_5',src(2019,'Jan',12,'Morning')),

// Q96 - n/z for de Broglie wavelength = 1.5πa0 - Answer: (4) = 0.75
mkSCQ('ATOM-296','Hard',
`If the de Broglie wavelength of the electron in $n^{\\text{th}}$ Bohr orbit in a hydrogenic atom is equal to $1.5\\pi a_0$ ($a_0$ is Bohr radius), then the value of $n/z$ is:`,
['1.50','1.0','0.4','0.75'],
'd',
`**de Broglie wavelength in $n$th orbit:**\n$$\\lambda = \\frac{2\\pi r_n}{n} = \\frac{2\\pi n^2 a_0/Z}{n} = \\frac{2\\pi n a_0}{Z}$$\n\n**Given:** $\\lambda = 1.5\\pi a_0$\n\n$$\\frac{2\\pi n a_0}{Z} = 1.5\\pi a_0$$\n\n$$\\frac{n}{Z} = \\frac{1.5}{2} = 0.75$$\n\n**Answer: Option (4) — 0.75**`,
'tag_atom_5',src(2019,'Jan',12,'Evening')),

// Q97 - Frequency of hypothetical EM wave from figure - NVT - Answer: 5
mkNVT('ATOM-297','Hard',
`A hypothetical electromagnetic wave is shown below. The frequency of the wave is $x\\times10^{19}$ Hz.\n\n$x =$ ______ (nearest integer)\n\n![Hypothetical EM wave](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-09.jpg?height=224&width=393&top_left_y=2380&top_left_x=1360)`,
{integer_value:5},
`From the figure, the wavelength of the hypothetical EM wave can be read as approximately $6\\times10^{-12}$ m (in the X-ray/gamma range).\n\n**Frequency:**\n$$\\nu = c/\\lambda = (3\\times10^8)/(6\\times10^{-12}) = 5\\times10^{19}\\,\\text{Hz}$$\n\n$x = \\mathbf{5}$\n\n**Answer: 5**`,
'tag_atom_4',src(2023,'Jan',24,'Evening')),

// Q98 - Highest magnetic moment electronic config - Answer: (4) = [Ar]3d6
mkSCQ('ATOM-298','Medium',
`Which of the following electronic configuration would be associated with the highest magnetic moment?`,
['$[\\text{Ar}]\\,3d^7$','$[\\text{Ar}]\\,3d^8$','$[\\text{Ar}]\\,3d^3$','$[\\text{Ar}]\\,3d^6$'],
'd',
`**Spin-only magnetic moment:** $\\mu = \\sqrt{n(n+2)}$ BM, where $n$ = unpaired electrons.\n\nCount unpaired electrons using Hund's rule:\n\n| Config | Filling 3d (5 orbitals) | Unpaired |\n|--------|------------------------|----------|\n| $3d^7$ | ↑↓ ↑↓ ↑↓ ↑ ↑ | 3 |\n| $3d^8$ | ↑↓ ↑↓ ↑↓ ↑↓ ↑ | 2 |\n| $3d^3$ | ↑ ↑ ↑ | 3 |\n| $3d^6$ | ↑↓ ↑ ↑ ↑ ↑ | **4** |\n\n$3d^6$ has **4 unpaired electrons** → highest $\\mu = \\sqrt{4\\times6} = \\sqrt{24} = 4.90$ BM\n\n**Answer: Option (4) — $[\\text{Ar}]\\,3d^6$**`,
'tag_atom_6',src(2024,'Jan',27,'Morning')),

// Q99 - Electrons in completely filled subshells with n=4 and s=+1/2 - NVT - Answer: 16
mkNVT('ATOM-299','Hard',
`The number of electrons present in all the completely filled subshells having $n = 4$ and $s = +\\frac{1}{2}$ is ______ (where $n$ = principal quantum number and $s$ = spin quantum number).`,
{integer_value:16},
`**Completely filled subshells with $n = 4$:** 4s², 4p⁶, 4d¹⁰, 4f¹⁴\n\nFor each completely filled subshell, half the electrons have $m_s = +\\frac{1}{2}$:\n\n| Subshell | Total electrons | With $m_s = +\\frac{1}{2}$ |\n|----------|----------------|---------------------------|\n| 4s² | 2 | 1 |\n| 4p⁶ | 6 | 3 |\n| 4d¹⁰ | 10 | 5 |\n| 4f¹⁴ | 14 | 7 |\n\n**Total = 1 + 3 + 5 + 7 = 16**\n\n**Answer: 16**`,
'tag_atom_6',src(2024,'Jan',27,'Morning')),

// Q100 - Quantum numbers of valence electron of Rb (Z=37) - Answer: (1)
mkSCQ('ATOM-300','Easy',
`The correct set of four quantum numbers for the valence electron of rubidium atom ($Z = 37$) is:`,
['$5, 0, 0, +\\frac{1}{2}$','$5, 0, 1, +\\frac{1}{2}$','$5, 1, 0, +\\frac{1}{2}$','$5, 1, 1, +\\frac{1}{2}$'],
'a',
`**Electronic configuration of Rb (Z=37):**\n$$[\\text{Kr}]\\,5s^1$$\n\nThe valence electron is in the **5s** orbital:\n- $n = 5$\n- $l = 0$ (s subshell)\n- $m_l = 0$ (only value for $l=0$)\n- $m_s = +\\frac{1}{2}$\n\n**Answer: Option (1) — $5, 0, 0, +\\frac{1}{2}$**`,
'tag_atom_6',src(2024,'Jan',29,'Morning')),

// Q101 - AR: Degenerate orbitals in H atom - Answer: (1)
mkSCQ('ATOM-301','Medium',
`**Statement-I:** The orbitals having same energy are called as degenerate orbitals.\n\n**Statement-II:** In hydrogen atom, 3p and 3d orbitals are not degenerate orbitals.\n\nChoose the most appropriate answer:`,
['Statement-I is true but Statement-II is false','Both Statement-I and Statement-II are true','Both Statement-I and Statement-II are false','Statement-I is false but Statement-II is true'],
'a',
`**Statement-I — True:** Degenerate orbitals are defined as orbitals with the same energy.\n\n**Statement-II — False:** In a **hydrogen atom** (one-electron system), energy depends only on $n$. Therefore, all orbitals with the same $n$ are degenerate. So 3p and 3d (both $n=3$) **are** degenerate in hydrogen.\n\n(In multi-electron atoms, 3p and 3d have different energies due to shielding, but in H they are degenerate.)\n\n**Answer: Option (1) — Statement-I is true but Statement-II is false**`,
'tag_atom_6',src(2024,'Jan',30,'Morning')),

// Q102 - Radial nodes in 3p orbital - Answer: (1) = 1
mkSCQ('ATOM-302','Easy',
`The number of radial node/s for 3p orbital is:`,
['1','4','2','3'],
'a',
`**Radial nodes** = $n - l - 1$\n\nFor 3p: $n=3$, $l=1$\n$$\\text{Radial nodes} = 3 - 1 - 1 = \\mathbf{1}$$\n\n**Answer: Option (1) — 1**`,
'tag_atom_6',src(2024,'Feb',1,'Evening')),

// Q103 - Number of atomic orbitals with 5 radial nodes from given set - NVT - Answer: 3
mkNVT('ATOM-303','Medium',
`The number of atomic orbitals from the following having **5 radial nodes** is ______.\n\n$$7s,\\ 7p,\\ 6s,\\ 8p,\\ 8d$$`,
{integer_value:3},
`**Radial nodes** = $n - l - 1$\n\n| Orbital | $n$ | $l$ | Radial nodes |\n|---------|-----|-----|---------------|\n| 7s | 7 | 0 | 7−0−1 = **6** |\n| 7p | 7 | 1 | 7−1−1 = **5** ✓ |\n| 6s | 6 | 0 | 6−0−1 = **5** ✓ |\n| 8p | 8 | 1 | 8−1−1 = **6** |\n| 8d | 8 | 2 | 8−2−1 = **5** ✓ |\n\n**Orbitals with 5 radial nodes: 7p, 6s, 8d → 3**\n\n**Answer: 3**`,
'tag_atom_6',src(2023,'Apr',8,'Evening')),

// Q104 - Number of correct statements about orbitals - NVT - Answer: 3
mkNVT('ATOM-304','Hard',
`The number of correct statements from the following is ______:\n\n**A.** For 1s orbital, the probability density is maximum at the nucleus.\n**B.** For 2s orbital, the probability density first increases to maximum and then decreases sharply to zero.\n**C.** Boundary surface diagrams of the orbitals enclose a region of 100% probability of finding the electron.\n**D.** p and d-orbitals have 1 and 2 angular nodes respectively.\n**E.** Probability density of p-orbital is zero at the nucleus.`,
{integer_value:3},
`**Evaluate each statement:**\n\n**A. ✓ Correct** — For 1s, $\\psi^2$ is maximum at $r=0$ (nucleus).\n\n**B. ✗ Incorrect** — For 2s, probability density starts at a maximum at nucleus, decreases to zero (radial node), then increases to a second maximum, then decreases. It does NOT "first increase".\n\n**C. ✗ Incorrect** — Boundary surface diagrams enclose ~**90%** probability, not 100% (the orbital extends to infinity).\n\n**D. ✓ Correct** — p-orbitals have $l=1$ → 1 angular node; d-orbitals have $l=2$ → 2 angular nodes.\n\n**E. ✓ Correct** — For p-orbitals, the angular wave function is zero at the nucleus, so probability density = 0 at nucleus.\n\n**Correct statements: A, D, E → 3**\n\n**Answer: 3**`,
'tag_atom_6',src(2023,'Apr',11,'Evening')),

// Q105 - Orbital angular momentum of electron in 3s - NVT - Answer: 0
mkNVT('ATOM-305','Easy',
`The orbital angular momentum of an electron in 3s orbital is $\\dfrac{xh}{2\\pi}$. The value of $x$ is ______ (nearest integer).`,
{integer_value:0},
`**Orbital angular momentum** = $\\sqrt{l(l+1)}\\cdot\\dfrac{h}{2\\pi}$\n\nFor **3s** orbital: $l = 0$\n\n$$L = \\sqrt{0(0+1)}\\cdot\\frac{h}{2\\pi} = 0\\cdot\\frac{h}{2\\pi} = 0$$\n\nSo $x = \\mathbf{0}$\n\n**Answer: 0**`,
'tag_atom_6',src(2023,'Apr',13,'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
