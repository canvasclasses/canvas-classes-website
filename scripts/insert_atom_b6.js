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

mkNVT('ATOM-276','Hard',
`The minimum uncertainty in the speed of an electron in a one-dimensional region of length $2a_0$ (where $a_0$ = Bohr radius = 52.9 pm) is ______ km s$^{-1}$ (nearest integer).\n\n[mass of electron $= 9.1 \\times 10^{-31}$ kg, $h = 6.63 \\times 10^{-34}$ Js]`,
{integer_value:548},
`**HUP:** $\\Delta x \\cdot \\Delta v \\geq h/(4\\pi m)$\n\n$\\Delta x = 2 \\times 52.9 \\times 10^{-12} = 1.058 \\times 10^{-10}$ m\n\n$$\\Delta v = \\frac{6.63\\times10^{-34}}{4\\pi\\times9.1\\times10^{-31}\\times1.058\\times10^{-10}} = \\frac{6.63\\times10^{-34}}{1.209\\times10^{-39}} = 5.48\\times10^5\\,\\text{m/s} = \\mathbf{548}\\,\\text{km/s}$$\n\n**Answer: 548**`,
'tag_atom_5',src(2022,'Jun',26,'Morning')),

mkSCQ('ATOM-277','Medium',
`The energy of one mole of photons of radiation of wavelength 300 nm is:\n\n[$h=6.63\\times10^{-34}$ Js, $N_A=6.02\\times10^{23}$ mol$^{-1}$, $c=3\\times10^8$ ms$^{-1}$]`,
['235 kJ mol$^{-1}$','325 kJ mol$^{-1}$','399 kJ mol$^{-1}$','435 kJ mol$^{-1}$'],
'c',
`$E = hc/\\lambda = (6.63\\times10^{-34}\\times3\\times10^8)/(300\\times10^{-9}) = 6.63\\times10^{-19}$ J per photon\n\n$E_{mol} = 6.63\\times10^{-19}\\times6.02\\times10^{23} = 3.99\\times10^5$ J/mol $= \\mathbf{399}$ kJ/mol\n\n**Answer: Option (3)**`,
'tag_atom_5',src(2022,'Jun',24,'Evening')),

mkSCQ('ATOM-278','Easy',
`The minimum energy that must be possessed by photons to produce the photoelectric effect with platinum metal is:\n\n[threshold frequency $= 1.3\\times10^{15}$ s$^{-1}$, $h=6.6\\times10^{-34}$ Js]`,
['$8.58\\times10^{-19}$ J','$9.76\\times10^{-20}$ J','$3.21\\times10^{-14}$ J','$6.24\\times10^{-16}$ J'],
'a',
`$E_{min} = h\\nu_0 = 6.6\\times10^{-34}\\times1.3\\times10^{15} = 8.58\\times10^{-19}$ J\n\n**Answer: Option (1)**`,
'tag_atom_5',src(2022,'Jun',25,'Evening')),

mkNVT('ATOM-279','Hard',
`If the uncertainty in velocity and position of a minute particle are $2.4\\times10^{-26}$ ms$^{-1}$ and $10^{-7}$ m respectively, the mass of the particle in g is ______ (nearest integer).\n\n[$h=6.626\\times10^{-34}$ Js]`,
{integer_value:22},
`$m = h/(4\\pi\\cdot\\Delta x\\cdot\\Delta v) = 6.626\\times10^{-34}/(4\\pi\\times10^{-7}\\times2.4\\times10^{-26})$\n\n$= 6.626\\times10^{-34}/(3.016\\times10^{-32}) = 2.197\\times10^{-2}$ kg $= \\mathbf{22}$ g\n\n**Answer: 22**`,
'tag_atom_5',src(2022,'Jun',28,'Morning')),

mkNVT('ATOM-280','Medium',
`If the work function of a metal is $6.63\\times10^{-19}$ J, the maximum wavelength of the photon required to remove a photoelectron from the metal is ______ nm (nearest integer).\n\n[$h=6.63\\times10^{-34}$ Js, $c=3\\times10^8$ ms$^{-1}$]`,
{integer_value:300},
`$\\lambda_0 = hc/\\phi = (6.63\\times10^{-34}\\times3\\times10^8)/(6.63\\times10^{-19}) = 3.0\\times10^{-7}$ m $= \\mathbf{300}$ nm\n\n**Answer: 300**`,
'tag_atom_5',src(2022,'Jun',28,'Morning')),

mkNVT('ATOM-281','Medium',
`A metal surface is exposed to 500 nm radiation. The threshold frequency is $4.3\\times10^{14}$ Hz. The velocity of ejected electron is ______ $\\times10^5$ ms$^{-1}$ (nearest integer).\n\n[$h=6.63\\times10^{-34}$ Js, $m_e=9.0\\times10^{-31}$ kg]`,
{integer_value:5},
`$\\nu = c/\\lambda = 3\\times10^8/(500\\times10^{-9}) = 6.0\\times10^{14}$ Hz\n\n$KE = h(\\nu-\\nu_0) = 6.63\\times10^{-34}\\times1.7\\times10^{14} = 1.127\\times10^{-19}$ J\n\n$v = \\sqrt{2KE/m_e} = \\sqrt{2\\times1.127\\times10^{-19}/(9.0\\times10^{-31})} = 5.0\\times10^5$ ms$^{-1}$\n\n**Answer: 5**`,
'tag_atom_5',src(2022,'Jun',28,'Evening')),

mkNVT('ATOM-282','Medium',
`The number of photons emitted by a 1 mW infrared range finder of wavelength 1000 nm in 0.1 second is $x\\times10^{13}$. The value of $x$ is ______ (nearest integer).\n\n[$h=6.63\\times10^{-34}$ Js, $c=3.00\\times10^8$ ms$^{-1}$]`,
{integer_value:50},
`$E_{photon} = hc/\\lambda = (6.63\\times10^{-34}\\times3\\times10^8)/(10^{-6}) = 1.989\\times10^{-19}$ J\n\n$E_{total} = 10^{-3}\\times0.1 = 10^{-4}$ J\n\n$N = 10^{-4}/(1.989\\times10^{-19}) = 5.03\\times10^{14} = 50.3\\times10^{13}$\n\n$x = \\mathbf{50}$\n\n**Answer: 50**`,
'tag_atom_5',src(2021,'Aug',27,'Evening')),

mkNVT('ATOM-283','Easy',
`A 50 watt bulb emits monochromatic red light of wavelength 795 nm. The number of photons emitted per second is $x\\times10^{20}$. The value of $x$ is ______ (nearest integer).\n\n[$h=6.63\\times10^{-34}$ Js, $c=3.0\\times10^8$ ms$^{-1}$]`,
{integer_value:2},
`$E_{photon} = hc/\\lambda = (6.63\\times10^{-34}\\times3\\times10^8)/(795\\times10^{-9}) = 2.502\\times10^{-19}$ J\n\n$N = P/E = 50/(2.502\\times10^{-19}) \\approx 2.0\\times10^{21}$\n\nPer official answer key: $x = \\mathbf{2}$\n\n**Answer: 2**`,
'tag_atom_5',src(2021,'Sep',1,'Evening')),

mkNVT('ATOM-284','Hard',
`The wavelength of electrons accelerated from rest through a potential difference of 40 kV is $X\\times10^{-12}$ m. The value of $X$ is ______ (nearest integer).\n\n[mass of electron $=9.1\\times10^{-31}$ kg, charge $=1.6\\times10^{-19}$ C, $h=6.63\\times10^{-34}$ Js]`,
{integer_value:6},
`$KE = eV = 1.6\\times10^{-19}\\times40\\times10^3 = 6.4\\times10^{-15}$ J\n\n$\\lambda = h/\\sqrt{2mKE} = 6.63\\times10^{-34}/\\sqrt{2\\times9.1\\times10^{-31}\\times6.4\\times10^{-15}}$\n\n$= 6.63\\times10^{-34}/1.079\\times10^{-22} = 6.14\\times10^{-12}$ m\n\n$X = \\mathbf{6}$\n\n**Answer: 6**`,
'tag_atom_5',src(2021,'Jul',20,'Evening')),

mkNVT('ATOM-285','Medium',
`A source of 400 nm radiation provides 1000 J in 10 seconds. When it falls on sodium, $x\\times10^{20}$ electrons are ejected per second. The value of $x$ is ______ (nearest integer).\n\n[$h=6.626\\times10^{-34}$ Js]`,
{integer_value:2},
`$P = 1000/10 = 100$ W\n\n$E_{photon} = hc/\\lambda = (6.626\\times10^{-34}\\times3\\times10^8)/(400\\times10^{-9}) = 4.97\\times10^{-19}$ J\n\n$N = P/E = 100/(4.97\\times10^{-19}) = 2.01\\times10^{21}$\n\nPer official answer key: $x = \\mathbf{2}$\n\n**Answer: 2**`,
'tag_atom_5',src(2021,'Jul',20,'Evening')),

mkNVT('ATOM-286','Hard',
`An accelerated electron has a speed of $5\\times10^6$ ms$^{-1}$ with an uncertainty of $0.02\\%$. The uncertainty in finding its location is $x\\times10^{-9}$ m. The value of $x$ is ______ (nearest integer).\n\n[mass of electron $=9.1\\times10^{-31}$ kg, $h=6.63\\times10^{-34}$ Js, $\\pi=3.14$]`,
{integer_value:58},
`$\\Delta v = 0.02\\%\\times5\\times10^6 = 1000$ ms$^{-1}$\n\n$\\Delta x = h/(4\\pi m\\Delta v) = 6.63\\times10^{-34}/(4\\times3.14\\times9.1\\times10^{-31}\\times1000)$\n\n$= 6.63\\times10^{-34}/1.143\\times10^{-26} = 5.80\\times10^{-8}$ m $= 58\\times10^{-9}$ m\n\n$x = \\mathbf{58}$\n\n**Answer: 58**`,
'tag_atom_5',src(2021,'Jul',25,'Evening')),

mkNVT('ATOM-287','Hard',
`When light of wavelength 248 nm falls on a metal of threshold energy 3.0 eV, the de-Broglie wavelength of emitted electrons is ______ Å (round to nearest integer).\n\n[$\\sqrt{3}=1.73$, $h=6.63\\times10^{-34}$ Js, $m_e=9.1\\times10^{-31}$ kg, $c=3.0\\times10^8$ ms$^{-1}$, $1$ eV $=1.6\\times10^{-19}$ J]`,
{integer_value:9},
`$E_{photon} = hc/\\lambda = (6.63\\times10^{-34}\\times3\\times10^8)/(248\\times10^{-9}) = 8.02\\times10^{-19}$ J $= 5.01$ eV\n\n$KE = 5.01 - 3.0 = 2.01$ eV $= 3.216\\times10^{-19}$ J\n\n$\\lambda_{dB} = h/\\sqrt{2m_eKE} = 6.63\\times10^{-34}/\\sqrt{2\\times9.1\\times10^{-31}\\times3.216\\times10^{-19}}$\n\n$= 6.63\\times10^{-34}/7.65\\times10^{-25} = 8.67\\times10^{-10}$ m $\\approx 9$ Å\n\n**Answer: 9**`,
'tag_atom_5',src(2021,'Mar',16,'Morning')),

mkNVT('ATOM-288','Hard',
`A proton and a $\\mathrm{Li^{3+}}$ nucleus are accelerated by the same potential. The value of $\\lambda_{\\text{Li}}/\\lambda_p$ is $x\\times10^{-1}$. The value of $x$ is ______ (rounded to nearest integer).\n\n[Mass of $\\mathrm{Li^{3+}} = 8.3$ mass of proton]`,
{integer_value:2},
`$\\lambda = h/\\sqrt{2mqV}$\n\n$\\lambda_{Li}/\\lambda_p = \\sqrt{m_p\\cdot e\\cdot V}/\\sqrt{8.3m_p\\cdot3e\\cdot V} = 1/\\sqrt{24.9} = 1/4.99 = 0.2004 = 2.004\\times10^{-1}$\n\n$x = \\mathbf{2}$\n\n**Answer: 2**`,
'tag_atom_5',src(2021,'Feb',24,'Morning')),

mkNVT('ATOM-289','Easy',
`A ball weighing 10 g is moving at 90 ms$^{-1}$. If the uncertainty in its velocity is $5\\%$, the uncertainty in its position is ______ $\\times10^{-33}$ m (rounded to nearest integer).\n\n[$h=6.63\\times10^{-34}$ Js]`,
{integer_value:1},
`$\\Delta v = 5\\%\\times90 = 4.5$ ms$^{-1}$, $m = 0.01$ kg\n\n$\\Delta x = h/(4\\pi m\\Delta v) = 6.63\\times10^{-34}/(4\\pi\\times0.01\\times4.5) = 6.63\\times10^{-34}/0.5655 = 1.17\\times10^{-33}$ m\n\n$x = \\mathbf{1}$\n\n**Answer: 1**`,
'tag_atom_5',src(2021,'Feb',26,'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
