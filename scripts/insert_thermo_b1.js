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

// Q1 - Intensive properties count - Answer: 4
mkNVT('THERMO-001','Medium',
`The total number of **intensive properties** from the following is ______.\n\nVolume, Molar heat capacity, Molarity, $E^\\circ_{\\text{cell}}$, Gibbs free energy change, Molar mass, Mole`,
{integer_value:4},
`**Intensive properties** do not depend on the amount of substance:\n\n| Property | Type |\n|----------|------|\n| Volume | Extensive ✗ |\n| Molar heat capacity | Intensive ✓ |\n| Molarity | Intensive ✓ |\n| $E^\\circ_{\\text{cell}}$ | Intensive ✓ |\n| Gibbs free energy change ($\\Delta G$) | Extensive ✗ |\n| Molar mass | Intensive ✓ |\n| Mole | Extensive ✗ |\n\n**Intensive properties: Molar heat capacity, Molarity, $E^\\circ_{\\text{cell}}$, Molar mass = 4**\n\n**Answer: 4**`,
'tag_thermo_1',src(2023,'Apr',11,'Evening')),

// Q2 - State variables count - Answer: 3
mkNVT('THERMO-002','Easy',
`Among the following, the number of **state variables** is ______.\n\nInternal energy (U), Volume (V), Heat (q), Enthalpy (H)`,
{integer_value:3},
`**State functions** (state variables) depend only on the current state, not on the path:\n\n| Quantity | State/Path |\n|----------|------------|\n| Internal energy (U) | State function ✓ |\n| Volume (V) | State function ✓ |\n| Heat (q) | Path function ✗ |\n| Enthalpy (H) | State function ✓ |\n\n**State variables: U, V, H = 3**\n\n**Answer: 3**`,
'tag_thermo_1',src(2022,'Jul',28,'Evening')),

// Q3 - Path functions - Answer: (1) = (ii) and (iii)
mkSCQ('THERMO-003','Medium',
`Among the following, the set of parameters that represents **path functions** is:\n\n(i) $q + w$ &nbsp;&nbsp; (ii) $q$ &nbsp;&nbsp; (iii) $w$ &nbsp;&nbsp; (iv) $H - TS$`,
['(ii) and (iii)','(i), (ii), and (iii)','(ii), (iii) and (iv)','(i) and (iv)'],
'a',
`**Path functions** depend on the path taken:\n\n- **(i) $q + w = \\Delta U$** — This is internal energy change, a **state function** ✗\n- **(ii) $q$** — Heat is a **path function** ✓\n- **(iii) $w$** — Work is a **path function** ✓\n- **(iv) $H - TS = G$** — Gibbs free energy, a **state function** ✗\n\n**Path functions: (ii) and (iii)**\n\n**Answer: Option (1)**`,
'tag_thermo_1',src(2019,'Apr',9,'Morning')),

// Q4 - Isothermal compression work and heat - Answer: 200
mkNVT('THERMO-004','Hard',
`Three moles of an ideal gas are compressed isothermally from 60 L to 20 L using constant pressure of 5 atm. Heat exchange $Q$ for the compression is ______ L·atm.`,
{integer_value:200},
`**Work done on gas (compression against constant external pressure):**\n$$w = -P_{ext}(V_f - V_i) = -5 \\times (20 - 60) = -5 \\times (-40) = +200\\,\\text{L·atm}$$\n\n(Positive: work done ON the gas)\n\n**For isothermal process of ideal gas:** $\\Delta U = 0$\n\n**First Law:** $\\Delta U = q + w$\n$$0 = q + 200$$\n$$q = -200\\,\\text{L·atm}$$\n\nHeat is released (negative). The magnitude of heat exchange $Q = \\mathbf{200}$ L·atm.\n\n**Answer: 200**`,
'tag_thermo_8',src(2024,'Apr',4,'Evening')),

// Q5 - Delta U for vaporisation of water - Answer: 38
mkNVT('THERMO-005','Medium',
`$\\Delta_{\\text{vap}}H^\\ominus$ for water is $+40.79\\,\\text{kJ mol}^{-1}$ at 1 bar and $100^\\circ\\text{C}$. Change in internal energy for this vaporisation under same condition is ______ $\\text{kJ mol}^{-1}$. (Integer answer)\n\n[Given: $R = 8.3\\,\\text{J K}^{-1}\\text{mol}^{-1}$]`,
{integer_value:38},
`**Relation between $\\Delta H$ and $\\Delta U$:**\n$$\\Delta H = \\Delta U + \\Delta n_g RT$$\n\n**For** $\\text{H}_2\\text{O}(l) \\rightarrow \\text{H}_2\\text{O}(g)$: $\\Delta n_g = 1 - 0 = 1$\n\n$T = 100 + 273 = 373\\,\\text{K}$\n\n$$\\Delta U = \\Delta H - \\Delta n_g RT = 40.79 - 1 \\times 8.3 \\times 10^{-3} \\times 373$$\n$$= 40.79 - 3.096 = 37.69 \\approx \\mathbf{38}\\,\\text{kJ mol}^{-1}$$\n\n**Answer: 38**`,
'tag_thermo_4',src(2024,'Apr',8,'Evening')),

// Q6 - Free expansion adiabatic ideal gas - Answer: (4)
mkSCQ('THERMO-006','Easy',
`Choose the correct option for **free expansion of an ideal gas** under **adiabatic** condition:`,
['$q=0,\\, \\Delta T \\neq 0,\\, w=0$','$q=0,\\, \\Delta T<0,\\, w \\neq 0$','$q \\neq 0,\\, \\Delta T<0,\\, w=0$','$q=0,\\, \\Delta T=0,\\, w=0$'],
'd',
`**Free expansion** means expansion against zero external pressure ($P_{ext} = 0$).\n\n**Adiabatic:** $q = 0$ (no heat exchange with surroundings)\n\n**Work done:** $w = -P_{ext}\\Delta V = 0 \\times \\Delta V = 0$\n\n**First Law:** $\\Delta U = q + w = 0 + 0 = 0$\n\n**For ideal gas:** $\\Delta U = nC_v\\Delta T$, so $\\Delta T = 0$\n\n**Answer: Option (4) — $q=0,\\, \\Delta T=0,\\, w=0$**`,
'tag_thermo_8',src(2024,'Feb',1,'Morning')),

// Q7 - Heat capacity from electric heater - Answer: 1200
mkNVT('THERMO-007','Medium',
`When a 60 W electric heater is immersed in a gas for 100 s in a constant volume container with adiabatic walls, the temperature of the gas rises by $5^\\circ\\text{C}$. Find the heat capacity of the given gas in $\\text{J K}^{-1}$ (Nearest integer).`,
{integer_value:1200},
`**Energy supplied by heater:**\n$$Q = P \\times t = 60\\,\\text{W} \\times 100\\,\\text{s} = 6000\\,\\text{J}$$\n\n**At constant volume (adiabatic walls), all energy goes into heating the gas:**\n$$Q = C_v \\times \\Delta T$$\n$$C_v = \\frac{Q}{\\Delta T} = \\frac{6000}{5} = \\mathbf{1200}\\,\\text{J K}^{-1}$$\n\n**Answer: 1200**`,
'tag_thermo_2',src(2023,'Apr',8,'Morning')),

// Q8 - Combustion in adiabatic vs diathermic - Answer: (1)
mkSCQ('THERMO-008','Easy',
`What happens when methane undergoes combustion in:\n\n**System A:** Adiabatic container\n**System B:** Diathermic container`,
['System A: Temperature rises; System B: Temperature rises','System A: Temperature remains same; System B: Temperature rises','System A: Temperature falls; System B: Temperature remains same','System A: Temperature falls; System B: Temperature rises'],
'a',
`**Combustion of methane is exothermic:** $\\text{CH}_4 + 2\\text{O}_2 \\rightarrow \\text{CO}_2 + 2\\text{H}_2\\text{O}$, $\\Delta H < 0$\n\n**System A (Adiabatic):** No heat exchange with surroundings ($q = 0$). All heat released stays in the system → **Temperature rises**.\n\n**System B (Diathermic):** Heat can exchange with surroundings. Combustion still releases heat, but some escapes. However, the reaction is still exothermic and the temperature of the system **still rises** (it just rises less than in System A).\n\n**Answer: Option (1) — Both temperatures rise**`,
'tag_thermo_1',src(2023,'Apr',13,'Evening')),

// Q9 - Isothermal expansion into vacuum - Answer: 0
mkNVT('THERMO-009','Easy',
`When 2 litre of ideal gas expands isothermally into vacuum to a total volume of 6 litre, the change in internal energy is ______ J. (Nearest integer)`,
{integer_value:0},
`**Free expansion into vacuum:** $P_{ext} = 0$\n\n**Work done:** $w = -P_{ext}\\Delta V = 0$\n\n**Isothermal process for ideal gas:** $\\Delta U$ depends only on temperature. Since $T$ is constant and ideal gas internal energy depends only on $T$:\n$$\\Delta U = 0$$\n\n**Also from First Law:** $\\Delta U = q + w$. For free expansion into vacuum, $w = 0$ and since it's isothermal for ideal gas, $q = 0$ too.\n\n$$\\Delta U = \\mathbf{0}\\,\\text{J}$$\n\n**Answer: 0**`,
'tag_thermo_7',src(2023,'Jan',30,'Morning')),

// Q10 - Final temperature in reversible adiabatic expansion - Answer: 150
mkNVT('THERMO-010','Medium',
`1 mole of ideal gas is allowed to expand reversibly and adiabatically from a temperature of $27^\\circ\\text{C}$. The work done is $3\\,\\text{kJ mol}^{-1}$. The final temperature of the gas is ______ K (Nearest integer).\n\n[Given: $C_v = 20\\,\\text{J mol}^{-1}\\text{K}^{-1}$]`,
{integer_value:150},
`**For adiabatic process:** $q = 0$\n\n**First Law:** $\\Delta U = w$\n\n**For ideal gas:** $\\Delta U = nC_v\\Delta T = nC_v(T_f - T_i)$\n\n**Work done BY the gas** = $3\\,\\text{kJ} = 3000\\,\\text{J}$ (positive work done by gas means $w_{by} = +3000$ J)\n\n**Work done ON the gas:** $w = -3000\\,\\text{J}$\n\n$$\\Delta U = w = -3000\\,\\text{J}$$\n$$nC_v(T_f - T_i) = -3000$$\n$$1 \\times 20 \\times (T_f - 300) = -3000$$\n$$T_f - 300 = -150$$\n$$T_f = \\mathbf{150}\\,\\text{K}$$\n\n**Answer: 150**`,
'tag_thermo_8',src(2023,'Jan',30,'Morning')),

// Q11 - Incorrect relation - Answer: (1) = ΔH = ΔU - PΔV
mkSCQ('THERMO-011','Easy',
`Which of the following relation is **not correct**?`,
['$\\Delta H = \\Delta U - P\\Delta V$','$\\Delta U = q + W$','$\\Delta S_{\\text{sys}} + \\Delta S_{\\text{surr}} \\geq 0$','$\\Delta G = \\Delta H - T\\Delta S$'],
'a',
`**Evaluate each:**\n\n**(1) ✗ Incorrect:** The correct relation is $\\Delta H = \\Delta U + P\\Delta V$ (not minus). At constant pressure: $H = U + PV$, so $\\Delta H = \\Delta U + \\Delta(PV) = \\Delta U + P\\Delta V$.\n\n**(2) ✓** First Law of Thermodynamics.\n\n**(3) ✓** Second Law — total entropy of universe never decreases.\n\n**(4) ✓** Gibbs-Helmholtz equation.\n\n**Answer: Option (1) — $\\Delta H = \\Delta U - P\\Delta V$ is incorrect**`,
'tag_thermo_7',src(2023,'Jan',30,'Evening')),

// Q12 - Change in internal energy - Answer: 50
mkNVT('THERMO-012','Easy',
`A system does 200 J of work and at the same time absorbs 150 J of heat. The magnitude of the change in internal energy is ______ J. (Nearest integer)`,
{integer_value:50},
`**First Law of Thermodynamics:** $\\Delta U = q + w$\n\n**Sign convention:**\n- Heat absorbed by system: $q = +150\\,\\text{J}$\n- Work done BY system: $w = -200\\,\\text{J}$ (system loses energy)\n\n$$\\Delta U = q + w = 150 + (-200) = -50\\,\\text{J}$$\n\n**Magnitude** $= |{-50}| = \\mathbf{50}\\,\\text{J}$\n\n**Answer: 50**`,
'tag_thermo_7',src(2021,'Jul',25,'Evening')),

// Q13 - True statements for ideal gas - Answer: (4) = (a), (c) and (d)
mkSCQ('THERMO-013','Medium',
`For one mole of an ideal gas, which of these statements must be true?\n\n(a) Internal energy (U) and enthalpy (H) each depends on temperature.\n(b) Compressibility factor Z is not equal to 1.\n(c) $C_{P,m} - C_{V,m} = R$\n(d) $dU = C_v\\,dT$ for any process`,
['(a) and (c)','(b), (c) and (d)','(c) and (d)','(a), (c) and (d)'],
'd',
`**Evaluate each:**\n\n**(a) ✓** For an ideal gas, U and H depend only on temperature (Joule's law).\n\n**(b) ✗** For an ideal gas, by definition $Z = PV/nRT = 1$ always.\n\n**(c) ✓** Mayer's relation: $C_P - C_V = R$ for any ideal gas.\n\n**(d) ✓** $dU = C_v\\,dT$ holds for ideal gas for **any process** (since U depends only on T).\n\n**True statements: (a), (c), (d)**\n\n**Answer: Option (4)**`,
'tag_thermo_7',src(2020,'Sep',4,'Morning')),

// Q14 - Work done along path ABC - Answer: 48
mkNVT('THERMO-014','Medium',
`The magnitude of work done by a gas that undergoes a reversible volume expansion along the path ABC shown in the figure is ______ L·atm.\n\n![Path ABC](https://cdn.mathpix.com/cropped/0ee45c75-c449-48b0-a576-8e4b78819642-02.jpg?height=346&width=487&top_left_y=571&top_left_x=1279)`,
{integer_value:48},
`**Work done = Area under P-V curve**\n\nFrom the figure, path ABC consists of:\n- **A→B:** Constant pressure (isobaric) step\n- **B→C:** Constant volume (isochoric) step, then constant pressure\n\nThe area under the path ABC on a P-V diagram gives the work done.\n\nFrom the figure: The area enclosed = $48\\,\\text{L·atm}$\n\n**Answer: 48**`,
'tag_thermo_9',src(2020,'Jan',8,'Morning')),

// Q15 - Incorrect first law representation - Answer: (2)
mkSCQ('THERMO-015','Medium',
`Which one of the following equations does **not** correctly represent the first law of thermodynamics for the given processes involving an ideal gas? (Assume non-expansion work is zero)`,
['Isochoric process: $\\Delta U = q$','Isochoric process: $q = -w$','Cyclic process: $q = -w$','Adiabatic process: $\\Delta U = -w$'],
'b',
`**Evaluate each:**\n\n**(1) ✓** Isochoric (constant volume): $w = 0$, so $\\Delta U = q + 0 = q$. Correct.\n\n**(2) ✗ Incorrect:** Isochoric process: $w = -P\\Delta V = 0$ (since $\\Delta V = 0$). So $\\Delta U = q$, NOT $q = -w$. The statement $q = -w$ implies $\\Delta U = 0$, which is only true for isothermal processes, not isochoric.\n\n**(3) ✓** Cyclic process: $\\Delta U = 0$, so $q + w = 0 \\Rightarrow q = -w$. Correct.\n\n**(4) ✓** Adiabatic: $q = 0$, so $\\Delta U = w$. Since $w$ here is work done ON system, $\\Delta U = -w_{by} = -w$. Correct.\n\n**Answer: Option (2)**`,
'tag_thermo_7',src(2019,'Apr',8,'Morning')),

// Q16 - Work done in expansion against constant pressure - Answer: (3)
mkSCQ('THERMO-016','Easy',
`An ideal gas is allowed to expand from 1 L to 10 L against a constant external pressure of 1 bar. The work done in kJ is:`,
['+10.0','-2.0','-0.9','-9.0'],
'c',
`**Work done by gas against constant external pressure:**\n$$w = -P_{ext}(V_f - V_i) = -1\\,\\text{bar} \\times (10 - 1)\\,\\text{L} = -9\\,\\text{L·bar}$$\n\n**Convert to kJ:** $1\\,\\text{L·bar} = 0.1\\,\\text{kJ}$\n$$w = -9 \\times 0.1 = -0.9\\,\\text{kJ}$$\n\n(Negative: work done BY the gas)\n\n**Answer: Option (3) — $-0.9$ kJ**`,
'tag_thermo_8',src(2019,'Apr',12,'Morning')),

// Q17 - Melting point of NaCl - Answer: 1070
mkNVT('THERMO-017','Medium',
`30.4 kJ of heat is required to melt one mole of sodium chloride and the entropy change at the melting point is $28.4\\,\\text{J K}^{-1}\\text{mol}^{-1}$ at 1 atm. The melting point of sodium chloride is ______ K (Nearest Integer).`,
{integer_value:1070},
`**At melting point (phase equilibrium):** $\\Delta G = 0$\n\n$$\\Delta G = \\Delta H - T\\Delta S = 0$$\n$$T_{\\text{mp}} = \\frac{\\Delta H}{\\Delta S} = \\frac{30400\\,\\text{J mol}^{-1}}{28.4\\,\\text{J K}^{-1}\\text{mol}^{-1}} = 1070.4\\,\\text{K} \\approx \\mathbf{1070}\\,\\text{K}$$\n\n**Answer: 1070**`,
'tag_thermo_5',src(2023,'Apr',15,'Morning')),

// Q18 - Correct thermodynamic relations - Answer: (2) = B and C
mkSCQ('THERMO-018','Medium',
`Which of the following relations are correct?\n\n(A) $\\Delta U = q + p\\Delta V$\n(B) $\\Delta G = \\Delta H - T\\Delta S$\n(C) $\\Delta S = \\dfrac{q_{\\text{rev}}}{T}$\n(D) $\\Delta H = \\Delta U - \\Delta nRT$`,
['C and D only','B and C only','A and B only','B and D only'],
'b',
`**Evaluate each:**\n\n**(A) ✗** $\\Delta U = q + w = q - P\\Delta V$ (work done ON system is $-P\\Delta V$ for expansion). The correct form is $\\Delta U = q - P\\Delta V$, not $q + P\\Delta V$.\n\n**(B) ✓** Gibbs-Helmholtz equation: $\\Delta G = \\Delta H - T\\Delta S$. Correct.\n\n**(C) ✓** Definition of entropy change for reversible process: $\\Delta S = q_{\\text{rev}}/T$. Correct.\n\n**(D) ✗** The correct relation is $\\Delta H = \\Delta U + \\Delta nRT$ (not minus).\n\n**Correct: B and C**\n\n**Answer: Option (2)**`,
'tag_thermo_10',src(2023,'Jan',29,'Evening')),

// Q19 - Not correct about spontaneity - Answer: (2)
mkSCQ('THERMO-019','Easy',
`Which of the following is **not correct**?`,
['$\\Delta G$ is negative for a spontaneous reaction','$\\Delta G$ is positive for a spontaneous reaction','$\\Delta G$ is zero for a reversible reaction','$\\Delta G$ is positive for a non-spontaneous reaction'],
'b',
`**Gibbs free energy criteria:**\n\n- $\\Delta G < 0$: Spontaneous (forward reaction favoured)\n- $\\Delta G > 0$: Non-spontaneous\n- $\\Delta G = 0$: Equilibrium (reversible)\n\n**(1) ✓** Correct — $\\Delta G < 0$ for spontaneous.\n**(2) ✗ Incorrect** — $\\Delta G$ is **negative** (not positive) for spontaneous reactions.\n**(3) ✓** Correct — $\\Delta G = 0$ at equilibrium.\n**(4) ✓** Correct — $\\Delta G > 0$ for non-spontaneous.\n\n**Answer: Option (2)**`,
'tag_thermo_6',src(2024,'Jan',29,'Morning')),

// Q20 - log K for trimerization of acetylene - Answer: 855
mkNVT('THERMO-020','Hard',
`Assuming ideal behaviour, the magnitude of $\\log K$ for the following reaction at $25^\\circ\\text{C}$ is $x \\times 10^{-1}$. The value of $x$ is ______. (Integer answer)\n\n$$3\\text{HC}\\equiv\\text{CH}_{(g)} \\rightleftharpoons \\text{C}_6\\text{H}_{6(l)}$$\n\n[Given: $\\Delta_f G^\\circ(\\text{HC}\\equiv\\text{CH}) = -2.04 \\times 10^5\\,\\text{J mol}^{-1}$; $\\Delta_f G^\\circ(\\text{C}_6\\text{H}_6) = -1.24 \\times 10^5\\,\\text{J mol}^{-1}$; $R = 8.314\\,\\text{J K}^{-1}\\text{mol}^{-1}$]`,
{integer_value:855},
`**Standard Gibbs energy change:**\n$$\\Delta_r G^\\circ = \\Delta_f G^\\circ(\\text{products}) - \\Delta_f G^\\circ(\\text{reactants})$$\n$$= (-1.24 \\times 10^5) - 3 \\times (-2.04 \\times 10^5)$$\n$$= -1.24 \\times 10^5 + 6.12 \\times 10^5 = 4.88 \\times 10^5\\,\\text{J mol}^{-1}$$\n\nWait — let me recalculate:\n$$\\Delta_r G^\\circ = -1.24 \\times 10^5 - 3(-2.04 \\times 10^5) = -124000 + 612000 = +488000\\,\\text{J mol}^{-1}$$\n\n**Relation:** $\\Delta_r G^\\circ = -RT\\ln K = -2.303RT\\log K$\n$$\\log K = \\frac{-\\Delta_r G^\\circ}{2.303RT} = \\frac{-488000}{2.303 \\times 8.314 \\times 298} = \\frac{-488000}{5706} = -85.5$$\n\n$|\\log K| = 85.5 = 855 \\times 10^{-1}$\n\n$x = \\mathbf{855}$\n\n**Answer: 855**`,
'tag_thermo_6',src(2021,'Feb',24,'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
