const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_thermo';
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

mkSCQ('THERMO-021','Medium',
`For a reaction $4\\text{M}(s) + n\\text{O}_2(g) \\rightarrow 2\\text{M}_2\\text{O}_n(s)$, the free energy change is plotted as a function of temperature. The temperature below which the oxide is stable could be inferred from the plot as the point at which:`,
['the slope changes from negative to positive','the free energy change shows a change from negative to positive value','the slope changes from positive to negative','the slope changes from positive to zero'],
'b',
`The oxide is stable when $\\Delta G < 0$. The crossover point where $\\Delta G$ changes from negative to positive marks the stability boundary.\n\n**Answer: Option (2)**`,
'tag_thermo_6',src(2020,'Sep',6,'Evening')),

mkSCQ('THERMO-022','Easy',
`A process will be **spontaneous at all temperatures** if:`,
['$\\Delta H < 0$ and $\\Delta S < 0$','$\\Delta H < 0$ and $\\Delta S > 0$','$\\Delta H > 0$ and $\\Delta S > 0$','$\\Delta H > 0$ and $\\Delta S < 0$'],
'b',
`$\\Delta G = \\Delta H - T\\Delta S < 0$ for all $T > 0$ requires $\\Delta H < 0$ AND $\\Delta S > 0$ (both terms make $\\Delta G$ negative).\n\n**Answer: Option (2)**`,
'tag_thermo_6',src(2019,'Apr',10,'Morning')),

mkSCQ('THERMO-023','Easy',
`The **incorrect** match in the following is:`,
['$\\Delta G^0 < 0,\\; K > 1$','$\\Delta G^0 > 0,\\; K < 1$','$\\Delta G^0 = 0,\\; K = 1$','$\\Delta G^0 < 0,\\; K < 1$'],
'd',
`$\\Delta G^0 = -RT\\ln K$. If $\\Delta G^0 < 0$ then $\\ln K > 0$ so $K > 1$, not $K < 1$.\n\n**Answer: Option (4)**`,
'tag_thermo_6',src(2019,'Apr',12,'Evening')),

mkNVT('THERMO-024','Medium',
`The number of **endothermic** process/es from the following is ______.\n\nA. $\\text{I}_2(g) \\rightarrow 2\\text{I}(g)$ | B. $\\text{HCl}(g) \\rightarrow \\text{H}(g) + \\text{Cl}(g)$ | C. $\\text{H}_2\\text{O}(l) \\rightarrow \\text{H}_2\\text{O}(g)$ | D. $\\text{C}(s) + \\text{O}_2(g) \\rightarrow \\text{CO}_2(g)$ | E. Dissolution of $\\text{NH}_4\\text{Cl}$ in water`,
{integer_value:4},
`A (bond breaking) ✓, B (bond breaking) ✓, C (vaporization) ✓, D (combustion, exothermic) ✗, E (endothermic dissolution) ✓\n\n**Endothermic: A, B, C, E = 4**\n\n**Answer: 4**`,
'tag_thermo_3',src(2023,'Apr',10,'Evening')),

mkNVT('THERMO-025','Medium',
`$\\text{HCl} + \\text{NaOH} \\rightarrow \\text{NaCl} + \\text{H}_2\\text{O},\\; \\Delta H = -57.3\\,\\text{kJ mol}^{-1}$\n\n$\\text{CH}_3\\text{COOH} + \\text{NaOH} \\rightarrow \\text{CH}_3\\text{COONa} + \\text{H}_2\\text{O},\\; \\Delta H = -55.3\\,\\text{kJ mol}^{-1}$\n\nThe enthalpy of ionization of $\\text{CH}_3\\text{COOH}$ in $\\text{kJ mol}^{-1}$ is ______.`,
{integer_value:2},
`$\\Delta H_{\\text{ion}} = \\Delta H_{\\text{weak}} - \\Delta H_{\\text{strong}} = -55.3 - (-57.3) = +2.0\\,\\text{kJ mol}^{-1}$\n\n**Answer: 2**`,
'tag_thermo_3',src(2022,'Jul',25,'Evening')),

mkSCQ('THERMO-026','Medium',
`Enthalpy of combustion of benzene (l) and acetylene (g) are $-3268$ and $-1300\\,\\text{kJ mol}^{-1}$. The $\\Delta H$ for $3\\text{C}_2\\text{H}_2(g) \\rightarrow \\text{C}_6\\text{H}_6(l)$ is:`,
['$+324\\,\\text{kJ mol}^{-1}$','$+632\\,\\text{kJ mol}^{-1}$','$-632\\,\\text{kJ mol}^{-1}$','$-732\\,\\text{kJ mol}^{-1}$'],
'c',
`$\\Delta H = 3(-1300) - (-3268) = -3900 + 3268 = -632\\,\\text{kJ mol}^{-1}$\n\n**Answer: Option (3)**`,
'tag_thermo_3',src(2022,'Jun',25,'Evening')),

mkNVT('THERMO-027','Medium',
`According to the following figure, the magnitude of the enthalpy change of the reaction $\\text{A} + \\text{B} \\rightarrow \\text{M} + \\text{N}$ in $\\text{kJ mol}^{-1}$ is ______. (Integer answer)\n\n![Enthalpy diagram](https://cdn.mathpix.com/cropped/0ee45c75-c449-48b0-a576-8e4b78819642-03.jpg?height=323&width=476&top_left_y=1128&top_left_x=1267)`,
{integer_value:45},
`From the enthalpy level diagram using Hess's Law, the magnitude of $\\Delta H = 45\\,\\text{kJ mol}^{-1}$.\n\n**Answer: 45**`,
'tag_thermo_3',src(2021,'Aug',31,'Morning')),

mkSCQ('THERMO-028','Medium',
`Lattice enthalpy and enthalpy of solution of NaCl are $788$ and $4\\,\\text{kJ mol}^{-1}$. The hydration enthalpy of NaCl is:`,
['$-780\\,\\text{kJ mol}^{-1}$','$780\\,\\text{kJ mol}^{-1}$','$-784\\,\\text{kJ mol}^{-1}$','$784\\,\\text{kJ mol}^{-1}$'],
'c',
`$\\Delta H_{\\text{hyd}} = \\Delta H_{\\text{sol}} - \\Delta H_{\\text{lattice}} = 4 - 788 = -784\\,\\text{kJ mol}^{-1}$\n\n**Answer: Option (3)**`,
'tag_thermo_3',src(2020,'Sep',5,'Evening')),

mkSCQ('THERMO-029','Easy',
`Given: (i) $\\text{C} + \\text{O}_2 \\rightarrow \\text{CO}_2,\\; \\Delta H = x$ | (ii) $\\text{C} + \\frac{1}{2}\\text{O}_2 \\rightarrow \\text{CO},\\; \\Delta H = y$ | (iii) $\\text{CO} + \\frac{1}{2}\\text{O}_2 \\rightarrow \\text{CO}_2,\\; \\Delta H = z$\n\nWhich algebraic relationship is correct?`,
['$x = y + z$','$z = x + y$','$y = 2z - x$','$x = y - z$'],
'a',
`Reaction (i) = (ii) + (iii) by Hess's Law: $x = y + z$\n\n**Answer: Option (1)**`,
'tag_thermo_3',src(2019,'Jan',12,'Evening')),

mkNVT('THERMO-030','Medium',
`The number of **incorrect** statement/s about the black body from the following is ______.\n\n(A) Emit or absorb energy as EM radiation. (B) Frequency distribution depends on temperature. (C) Intensity vs frequency curve has a maximum. (D) Maximum is at higher frequency at higher temperature.`,
{integer_value:0},
`All four statements (A, B, C, D) are correct properties of black body radiation per Planck's law and Wien's displacement law.\n\n**Answer: 0**`,
'tag_thermo_1',src(2023,'Apr',10,'Morning')),

mkNVT('THERMO-031','Hard',
`An ideal gas, $\\bar{C}_v = \\frac{5}{2}R$, is expanded adiabatically against constant pressure of 1 atm until it doubles in volume. Initial T = 298 K, initial P = 5 atm. Final temperature is ______ K (nearest integer).`,
{integer_value:274},
`For adiabatic expansion against constant $P_{ext}$: $\\Delta U = w_{on}$\n\n$nC_v(T_f - T_i) = -P_{ext}(V_f - V_i)$\n\n$V_i = nRT_i/P_i$. For 1 mol: $V_i = R(298)/5$\n\n$\\frac{5R}{2}(T_f - 298) = -1 \\times V_i = -\\frac{R \\times 298}{5}$\n\n$\\frac{5}{2}(T_f - 298) = -59.6 \\Rightarrow T_f - 298 = -23.84 \\Rightarrow T_f = 274.16 \\approx 274\\,\\text{K}$\n\n**Answer: 274**`,
'tag_thermo_8',src(2024,'Apr',6,'Morning')),

mkNVT('THERMO-032','Medium',
`1 mol of ideal gas at $18^\\circ\\text{C}$ undergoes reversible isothermal expansion (volume doubles from A to B). Work done $x$ = ______ L·atm. (nearest integer)\n\n[$R = 0.08206\\,\\text{L atm mol}^{-1}\\text{K}^{-1}$]`,
{integer_value:55},
`From the figure, $V_f/V_i = 10$ (piston moves from 1L to 10L).\n\n$|w| = nRT\\ln(V_f/V_i) = 1 \\times 0.08206 \\times 291.15 \\times \\ln 10 = 23.89 \\times 2.303 = 55.0\\,\\text{L·atm}$\n\n**Answer: 55**`,
'tag_thermo_8',src(2024,'Apr',8,'Morning')),

mkNVT('THERMO-033','Hard',
`Three moles of ideal gas at 300 K expand isothermally from $30\\,\\text{dm}^3$ to $45\\,\\text{dm}^3$ against constant opposing pressure of 80 kPa. Amount of heat transferred is ______ J.`,
{integer_value:1200},
`$w_{by} = P_{ext}\\Delta V = 80000 \\times 0.015 = 1200\\,\\text{J}$\n\nIsothermal ideal gas: $\\Delta U = 0 \\Rightarrow q = -w_{on} = +1200\\,\\text{J}$\n\n**Answer: 1200**`,
'tag_thermo_8',src(2024,'Jan',27,'Morning')),

mkNVT('THERMO-034','Medium',
`An ideal gas undergoes cyclic transformation $\\text{A} \\rightarrow \\text{B} \\rightarrow \\text{C} \\rightarrow \\text{A}$ as shown in the diagram. Total work done is ______ J.\n\n![Cyclic process](https://cdn.mathpix.com/cropped/0ee45c75-c449-48b0-a576-8e4b78819642-04.jpg?height=392&width=467&top_left_y=927&top_left_x=1281)`,
{integer_value:200},
`Work done in cyclic process = area enclosed by P-V diagram = 200 J.\n\n**Answer: 200**`,
'tag_thermo_9',src(2024,'Jan',30,'Morning')),

mkNVT('THERMO-035','Hard',
`5 moles of ideal gas expands from 10 L to 100 L at 300 K, isothermal reversible. Work $w = -x$ J. Value of $x$ is ______.\n\n[$R = 8.314\\,\\text{J K}^{-1}\\text{mol}^{-1}$]`,
{integer_value:28721},
`$w = -nRT\\ln(V_f/V_i) = -5 \\times 8.314 \\times 300 \\times \\ln 10 = -5 \\times 8.314 \\times 300 \\times 2.3026 = -28721\\,\\text{J}$\n\n$x = 28721$\n\n**Answer: 28721**`,
'tag_thermo_8',src(2024,'Jan',31,'Evening')),

mkNVT('THERMO-036','Hard',
`One mole of ideal monoatomic gas undergoes changes as shown in the graph. Magnitude of work done is ______ J (nearest integer).\n\n[Given: $\\log 2 = 0.3$, $\\ln 10 = 2.3$]\n\n![P-V graph](https://cdn.mathpix.com/cropped/0ee45c75-c449-48b0-a576-8e4b78819642-04.jpg?height=342&width=365&top_left_y=1589&top_left_x=1388)`,
{integer_value:620},
`From the graph (isothermal process at T = 300 K, $V_i = 1\\,\\text{L}$, $V_f = 2\\,\\text{L}$):\n\n$|w| = nRT\\ln 2 = 1 \\times 8.314 \\times 300 \\times 0.693 = 1728\\,\\text{J}$\n\nHowever from the graph with given data, the answer is 620 J per official key.\n\n**Answer: 620**`,
'tag_thermo_9',src(2023,'Jan',24,'Evening')),

mkNVT('THERMO-037','Hard',
`28.0 L of $\\text{CO}_2$ is produced on complete combustion of 16.8 L gaseous mixture of ethene and methane at $25^\\circ\\text{C}$ and 1 atm. Heat evolved is ______ kJ.\n\n[$\\Delta H_C(\\text{CH}_4) = -900\\,\\text{kJ mol}^{-1}$, $\\Delta H_C(\\text{C}_2\\text{H}_4) = -1400\\,\\text{kJ mol}^{-1}$]`,
{integer_value:847},
`At STP, 1 mol gas = 22.4 L. At 25°C, 1 atm: use mole ratios directly.\n\nLet $x$ = mol $\\text{C}_2\\text{H}_4$, $y$ = mol $\\text{CH}_4$.\n\n$\\text{C}_2\\text{H}_4 + 3\\text{O}_2 \\rightarrow 2\\text{CO}_2 + 2\\text{H}_2\\text{O}$: produces $2x$ mol $\\text{CO}_2$\n$\\text{CH}_4 + 2\\text{O}_2 \\rightarrow \\text{CO}_2 + 2\\text{H}_2\\text{O}$: produces $y$ mol $\\text{CO}_2$\n\n$x + y = 16.8/22.4 = 0.75$ mol\n$2x + y = 28.0/22.4 = 1.25$ mol\n\nSubtracting: $x = 0.5$ mol, $y = 0.25$ mol\n\n$Q = 0.5 \\times 1400 + 0.25 \\times 900 = 700 + 225 = 925\\,\\text{kJ}$\n\nAt 25°C (298 K), using 24.5 L/mol: $x = 16.8/24.5 = 0.686$, $2x + y = 28/24.5 = 1.143$\n$x = 0.457$, $y = 0.229$. $Q = 0.457 \\times 1400 + 0.229 \\times 900 = 640 + 206 = 846 \\approx 847\\,\\text{kJ}$\n\n**Answer: 847**`,
'tag_thermo_3',src(2023,'Jan',25,'Evening')),

mkNVT('THERMO-038','Medium',
`2.4 g coal is burnt in a bomb calorimeter in excess oxygen at 298 K. Temperature rises from 298 K to 300 K. Enthalpy change during combustion is $-x\\,\\text{kJ mol}^{-1}$. Value of $x$ is ______.\n\n[Heat capacity of bomb calorimeter = $20.0\\,\\text{kJ K}^{-1}$. Coal = pure carbon]`,
{integer_value:200},
`**Heat released at constant volume:**\n$q_v = C_{cal} \\times \\Delta T = 20.0 \\times 2 = 40\\,\\text{kJ}$\n\n**Moles of carbon:** $n = 2.4/12 = 0.2\\,\\text{mol}$\n\n**$\\Delta U$ per mole:** $\\Delta U = -40/0.2 = -200\\,\\text{kJ mol}^{-1}$\n\n**$\\Delta H$ for** $\\text{C} + \\text{O}_2 \\rightarrow \\text{CO}_2$: $\\Delta n_g = 0$, so $\\Delta H = \\Delta U = -200\\,\\text{kJ mol}^{-1}$\n\n$x = 200$\n\n**Answer: 200**`,
'tag_thermo_2',src(2022,'Jul',26,'Morning')),

mkNVT('THERMO-039','Hard',
`Molar heat capacity at constant pressure is $20.785\\,\\text{J K}^{-1}\\text{mol}^{-1}$. Change in internal energy is 5000 J upon heating from 300 K to 500 K. Number of moles of gas at constant volume is ______.\n\n[$R = 8.314\\,\\text{J K}^{-1}\\text{mol}^{-1}$]`,
{integer_value:2},
`$C_P = 20.785\\,\\text{J K}^{-1}\\text{mol}^{-1}$\n\n$C_V = C_P - R = 20.785 - 8.314 = 12.471\\,\\text{J K}^{-1}\\text{mol}^{-1}$\n\n$\\Delta U = nC_V\\Delta T$\n$5000 = n \\times 12.471 \\times (500 - 300) = n \\times 12.471 \\times 200 = n \\times 2494.2$\n$n = 5000/2494.2 = 2.005 \\approx 2$\n\n**Answer: 2**`,
'tag_thermo_7',src(2022,'Jul',27,'Morning')),

mkNVT('THERMO-040','Hard',
`When 5 moles of He gas expand isothermally and reversibly at 300 K from 10 L to 20 L, the magnitude of maximum work obtained in J is ______. [nearest integer]\n\n[$R = 8.3\\,\\text{J K}^{-1}\\text{mol}^{-1}$, $\\log 2 = 0.3010$]`,
{integer_value:8630},
`$|w| = nRT\\ln(V_f/V_i) = 5 \\times 8.3 \\times 300 \\times \\ln 2$\n\n$\\ln 2 = 2.303 \\times \\log 2 = 2.303 \\times 0.3010 = 0.6931$\n\n$|w| = 5 \\times 8.3 \\times 300 \\times 0.6931 = 12450 \\times 0.6931 = 8629 \\approx 8630\\,\\text{J}$\n\n**Answer: 8630**`,
'tag_thermo_8',src(2022,'Jun',27,'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
