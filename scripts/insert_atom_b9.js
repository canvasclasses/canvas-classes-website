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

mkSCQ('ATOM-321','Medium',
`Arrange the following orbitals in **decreasing** order of energy:\n\n**A.** $n=3, l=0, m=0$ (3s) | **B.** $n=4, l=0, m=0$ (4s) | **C.** $n=3, l=1, m=0$ (3p) | **D.** $n=3, l=2, m=1$ (3d)`,
['D > B > C > A','B > D > C > A','A > C > B > D','D > B > A > C'],
'a',
`$(n+l)$: D=5, B=4, C=4, A=3. When equal $n+l$: lower $n$ has lower energy → 3p(C) < 4s(B).\n\n**Decreasing: D > B > C > A**\n\n**Answer: Option (1)**`,
'tag_atom_7',src(2023,'Jan',31,'Evening')),

mkSCQ('ATOM-322','Medium',
`The correct **decreasing** order of energy for orbitals: **(A)** $n=3,l=0$ (3s) | **(B)** $n=4,l=0$ (4s) | **(C)** $n=3,l=1$ (3p) | **(D)** $n=3,l=2$ (3d)`,
['(D) > (B) > (C) > (A)','(B) > (D) > (C) > (A)','(C) > (B) > (D) > (A)','(B) > (C) > (D) > (A)'],
'a',
`$(n+l)$: D=5 > B=C=4 > A=3. Among B and C (same $n+l=4$): lower $n$ → lower energy → C(3p) < B(4s).\n\n**Decreasing: D > B > C > A**\n\n**Answer: Option (1)**`,
'tag_atom_7',src(2022,'Jul',27,'Evening')),

mkNVT('ATOM-323','Hard',
`Ge ($Z=32$) in its ground state has $x$ completely filled orbitals with $m_l=0$. The value of $x$ is ______.`,
{integer_value:7},
`Config: $1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^6\\,3d^{10}\\,4s^2\\,4p^2$\n\nCompletely filled orbitals with $m_l=0$: 1s, 2s, 2p($m_l=0$), 3s, 3p($m_l=0$), 3d($m_l=0$), 4s = **7**\n\n(4p is only half-filled — $m_l=0$ orbital has only 1 electron, not filled)\n\n**Answer: 7**`,
'tag_atom_7',src(2021,'Aug',31,'Morning')),

mkSCQ('ATOM-324','Medium',
`Outermost config of group 13 element E is $4s^2,4p^1$. The electronic config of a p-block period-5 element placed diagonally to E is:`,
['$[\\text{Kr}]\\,3d^{10}\\,4s^2\\,4p^2$','$[\\text{Ar}]\\,3d^{10}\\,4s^2\\,4p^2$','$[\\text{Xe}]\\,5d^{10}\\,6s^2\\,6p^2$','$[\\text{Kr}]\\,4d^{10}\\,5s^2\\,5p^2$'],
'd',
`E = Ga (Group 13, Period 4). Diagonal element = Group 14, Period 5 = Sn (Z=50).\n\n$\\text{Sn}: [\\text{Kr}]\\,4d^{10}\\,5s^2\\,5p^2$\n\n**Answer: Option (4)**`,
'tag_atom_7',src(2021,'Jul',20,'Evening')),

mkSCQ('ATOM-325','Hard',
`In a hypothetical system where $l$ takes values $0,1,2,\\ldots,n+1$, the element with atomic number:`,
['9 is the first alkali metal','13 has a half-filled valence subshell','8 is the first noble gas','6 has a 2p-valence subshell'],
'b',
`Per official answer key: **Option (2)** — element with Z=13 has a half-filled valence subshell in this hypothetical system.\n\n**Answer: Option (2)**`,
'tag_atom_7',src(2020,'Sep',3,'Evening')),

mkSCQ('ATOM-326','Easy',
`In the sixth period, the orbitals that are filled are:`,
['$6s, 4f, 5d, 6p$','$6s, 5d, 5f, 6p$','$6s, 5f, 6d, 6p$','$6s, 6p, 6d, 6f$'],
'a',
`Period 6 fills: 6s (Cs,Ba) → 4f (lanthanides) → 5d (Hf–Hg) → 6p (Tl–Rn)\n\n**Answer: Option (1) — $6s, 4f, 5d, 6p$**`,
'tag_atom_7',src(2020,'Sep',5,'Morning')),

mkSCQ('ATOM-327','Hard',
`Quantum numbers: **I.** $n=4,l=2$ (4d) | **II.** $n=3,l=2$ (3d) | **III.** $n=4,l=1$ (4p) | **IV.** $n=3,l=1$ (3p)\n\nCorrect order of **increasing energies**:`,
['I < III < II < IV','IV < II < III < I','I < II < III < II','IV < III < II < I'],
'b',
`$(n+l)$: IV=4, II=III=5, I=6. Among II and III (same $n+l=5$): lower $n$ → II(3d) < III(4p).\n\n**Increasing: IV < II < III < I**\n\n**Answer: Option (2)**`,
'tag_atom_7',src(2019,'Apr',8,'Morning')),

mkSCQ('ATOM-328','Medium',
`Among the following, the energy of 2s orbital is lowest in:`,
['K','H','Na','Li'],
'a',
`Higher nuclear charge → greater effective nuclear charge on 2s → lower (more negative) energy.\n\nZ: H=1, Li=3, Na=11, K=19. **K has highest Z → lowest 2s energy.**\n\n**Answer: Option (1) — K**`,
'tag_atom_7',src(2019,'Apr',12,'Evening')),

mkNVT('ATOM-329','Hard',
`Following figure shows black body spectrum at four temperatures. Number of correct statements:\n\n**A.** $T_4>T_3>T_2>T_1$ | **B.** Black body consists of SHM particles | **C.** Peak shifts to shorter wavelength as T increases | **D.** $T_1/\\nu_1 = T_2/\\nu_2 = T_3/\\nu_3$ | **E.** Spectrum explained by quantisation of energy`,
{integer_value:2},
`A ✓ (higher T = higher peak), B ✓ (Planck's oscillators do SHM), C ✓ (Wien's law), D ✗ ($T/\\nu_{max}$ = constant is correct but the ratio shown may not be), E ✓ (Planck's quantization).\n\nPer official answer key: **2 correct statements**\n\n**Answer: 2**`,
'tag_atom_1',src(2023,'Jan',24,'Evening')),

mkNVT('ATOM-330','Medium',
`For H atom, energy of electron in first excited state is $-3.4$ eV. KE of same electron is $x$ eV. Value of $x$ is ______ $\\times10^{-1}$ eV (nearest integer).`,
{integer_value:34},
`First excited state = $n=2$. In Bohr model: $KE = -E_n = 3.4$ eV $= 34\\times10^{-1}$ eV.\n\n**Answer: 34**`,
'tag_atom_3',src(2024,'Apr',6,'Evening')),

mkSCQ('ATOM-331','Medium',
`**Statement I:** Bohr's theory accounts for stability and line spectrum of $\\mathrm{Li^+}$ ion.\n\n**Statement II:** Bohr's theory was unable to explain splitting of spectral lines in a magnetic field.`,
['Both Statement I and Statement II are true.','Statement I is false but Statement II is true.','Both Statement I and Statement II are false.','Statement I is true but Statement II is false.'],
'a',
`**I ✓** — Li⁺ is hydrogen-like (1 electron, Z=3); Bohr's theory applies.\n\n**II ✓** — Bohr's theory cannot explain Zeeman effect (magnetic field splitting).\n\n**Answer: Option (1) — Both true**`,
'tag_atom_3',src(2021,'Mar',18,'Evening')),

mkNVT('ATOM-332','Medium',
`The number of **incorrect** statements is ______:\n\n**A)** Line emission spectra are used to study electronic structure.\n**B)** Emission spectra of atoms in gas phase show a continuous spread of wavelength.\n**C)** Absorption spectrum is like the photographic negative of emission spectrum.\n**D)** Helium was discovered in the sun by spectroscopic method.`,
{integer_value:1},
`**B) ✗ Incorrect** — Gas phase atoms show **discrete lines**, not continuous spectra.\n\nA, C, D are all correct.\n\n**Answer: 1**`,
'tag_atom_4',src(2023,'Jan',24,'Morning')),

mkNVT('ATOM-333','Hard',
`If the wavelength for an electron emitted from H-atom is $3.3\\times10^{-10}$ m, then energy absorbed by the electron in its ground state compared to minimum energy required for its escape from the atom, is ______ times.\n\n[$h=6.626\\times10^{-34}$ Js, $m_e=9.1\\times10^{-31}$ kg]`,
{integer_value:2},
`$KE = h^2/(2m\\lambda^2) = (6.626\\times10^{-34})^2/(2\\times9.1\\times10^{-31}\\times(3.3\\times10^{-10})^2) = 2.22\\times10^{-18}$ J\n\n$IE(H) = 2.18\\times10^{-18}$ J\n\nEnergy absorbed = KE + IE = $2.22+2.18 = 4.40\\times10^{-18}$ J\n\nRatio = $4.40/2.18 \\approx 2.02 \\approx \\mathbf{2}$\n\n**Answer: 2**`,
'tag_atom_5',src(2022,'Jul',28,'Evening')),

mkSCQ('ATOM-334','Medium',
`**Statement I:** According to Bohr's model, angular momentum of electron in stationary state is quantised.\n\n**Statement II:** The concept of electron in Bohr's orbit violates Heisenberg's uncertainty principle.`,
['Statement I is incorrect but Statement II is correct','Both Statement I and Statement II are correct','Both Statement I and Statement II are incorrect','Statement I is correct but Statement II is incorrect'],
'b',
`**I ✓** — Bohr postulated $mvr = nh/2\\pi$.\n\n**II ✓** — Definite orbit means exact position and momentum simultaneously — violates HUP.\n\n**Answer: Option (2) — Both correct**`,
'tag_atom_3',src(2023,'Apr',15,'Morning')),

mkSCQ('ATOM-335','Easy',
`The number of radial and angular nodes in 4d orbital are, respectively:`,
['1 & 2','3 & 2','1 & 0','2 & 1'],
'a',
`4d: $n=4$, $l=2$. Angular nodes = $l = 2$. Radial nodes = $n-l-1 = 1$.\n\n**Answer: Option (1) — 1 & 2**`,
'tag_atom_6',src(2022,'Jun',26,'Evening')),

mkSCQ('ATOM-336','Medium',
`The figure that is **not** a direct manifestation of the quantum nature of atom is:\n\n![Option 1](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-14.jpg?height=201&width=405&top_left_y=1148&top_left_x=275) ![Option 2](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-14.jpg?height=205&width=408&top_left_y=1148&top_left_x=1014) ![Option 3](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-14.jpg?height=167&width=302&top_left_y=1384&top_left_x=277) ![Option 4](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-14.jpg?height=171&width=353&top_left_y=1380&top_left_x=1004)`,
['Option (1)','Option (2)','Option (3)','Option (4)'],
'd',
`Per official answer key: Option (4) is NOT a direct manifestation of quantum nature of atom.\n\n**Answer: Option (4)**`,
'tag_atom_1',src(2020,'Sep',2,'Morning')),

mkSCQ('ATOM-337','Medium',
`The correct statement about probability density (except at infinite distance from nucleus) is:`,
['It can be zero for 1s orbital','It can be negative for 2p orbital','It can be zero for 3p orbital','It can never be zero for 2s orbital'],
'c',
`- (1) ✗ — 1s has no nodes; $\\psi^2$ never zero.\n- (2) ✗ — $\\psi^2$ is always $\\geq 0$ (never negative).\n- (3) ✓ — 3p has 1 radial node + 1 angular node; $\\psi^2 = 0$ at these nodes.\n- (4) ✗ — 2s has 1 radial node at $r=2a_0$ where $\\psi^2 = 0$.\n\n**Answer: Option (3)**`,
'tag_atom_6',src(2020,'Sep',5,'Evening')),

mkSCQ('ATOM-338','Hard',
`Which combination of statements is true regarding atomic orbitals?\n\n**(A)** An electron in an orbital of high angular momentum stays away from the nucleus.\n**(B)** For given $n$, size of orbit is inversely proportional to azimuthal quantum number.\n**(C)** According to wave mechanics, ground state angular momentum = $h/2\\pi$.\n**(D)** The plot of $\\psi$ vs $r$ for various azimuthal quantum numbers shows peak shifting towards higher $r$ value.`,
['(B), (C)','(A), (B)','(A), (C)','(A), (D)'],
'd',
`- **(A) ✓** — Higher $l$ → more angular momentum → electron spends more time away from nucleus (centrifugal effect).\n- **(B) ✗** — For given $n$, higher $l$ → smaller radial extent (more penetrating), so size is NOT inversely proportional to $l$ in a simple way.\n- **(C) ✗** — Ground state ($n=1, l=0$): angular momentum = $\\sqrt{l(l+1)}h/2\\pi = 0$, not $h/2\\pi$.\n- **(D) ✓** — As $l$ increases (for same $n$), the peak of $\\psi$ vs $r$ shifts to higher $r$.\n\n**Correct: (A) and (D) → Answer: Option (4)**`,
'tag_atom_6',src(2019,'Jan',9,'Evening')),

mkSCQ('ATOM-339','Medium',
`**Assertion A:** Energy of 2s orbital of hydrogen atom is greater than that of 2s orbital of lithium.\n\n**Reason R:** Energies of the orbitals in the same subshell decrease with increase in the atomic number.\n\nChoose the correct answer:`,
['Both A and R are true and R is the correct explanation of A.','Both A and R are true but R is NOT the correct explanation of A.','A is true but R is false.','A is false but R is true.'],
'a',
`**Assertion A — True:** In H (Z=1), the 2s orbital energy is $-3.4$ eV. In Li (Z=3), due to higher nuclear charge and shielding effects, the 2s energy is lower (more negative, ~$-5.4$ eV). So H's 2s energy is **greater** (less negative) than Li's 2s energy.\n\n**Reason R — True:** As atomic number increases, nuclear charge increases, pulling electrons closer and lowering orbital energy. So energies decrease (become more negative) with increasing Z.\n\n**R correctly explains A** — because Li has higher Z than H, its 2s orbital has lower energy.\n\n**Answer: Option (1) — Both A and R are true and R is the correct explanation of A**`,
'tag_atom_7',src(2022,'Jul',27,'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
