const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');
const CHAPTER_ID = 'ch11_thermo';
function src(y,mo,d,s){return{exam_name:'JEE Main',year:y,month:mo,day:d,shift:s};}
function mkSCQ(id,diff,text,opts,cid,sol,tag,ex){return{_id:uuidv4(),display_id:id,type:'SCQ',question_text:{markdown:text,latex_validated:false},options:[{id:'a',text:opts[0],is_correct:cid==='a'},{id:'b',text:opts[1],is_correct:cid==='b'},{id:'c',text:opts[2],is_correct:cid==='c'},{id:'d',text:opts[3],is_correct:cid==='d'}],answer:{correct_option:cid},solution:{text_markdown:sol,latex_validated:false},metadata:{difficulty:diff,chapter_id:CHAPTER_ID,tags:[{tag_id:tag,weight:1.0}],exam_source:ex,is_pyq:true,is_top_pyq:false},status:'published',version:1,quality_score:85,needs_review:false,created_by:'admin',updated_by:'admin',created_at:new Date(),updated_at:new Date(),deleted_at:null};}
function mkNVT(id,diff,text,ans,sol,tag,ex){return{_id:uuidv4(),display_id:id,type:'NVT',question_text:{markdown:text,latex_validated:false},options:[],answer:ans,solution:{text_markdown:sol,latex_validated:false},metadata:{difficulty:diff,chapter_id:CHAPTER_ID,tags:[{tag_id:tag,weight:1.0}],exam_source:ex,is_pyq:true,is_top_pyq:false},status:'published',version:1,quality_score:85,needs_review:false,created_by:'admin',updated_by:'admin',created_at:new Date(),updated_at:new Date(),deleted_at:null};}
const questions = [

// Q101 - ΔH for H2F2 → H2 + F2 - Answer: 57
mkNVT('THERMO-101','Medium',
`For the reaction $\\text{H}_2\\text{F}_2(g)\\rightarrow\\text{H}_2(g)+\\text{F}_2(g)$, $\\Delta U=-59.6\\,\\text{kJ mol}^{-1}$ at $27^\\circ\\text{C}$. The enthalpy change is $(-)\\_\\_\\_\\_\\,\\text{kJ mol}^{-1}$ (nearest integer). [$R=8.314\\,\\text{J K}^{-1}\\text{mol}^{-1}$]`,
{integer_value:57},
`$\\Delta n_g=2-1=+1$\n$\\Delta H=\\Delta U+\\Delta n_g RT=-59600+(1)(8.314)(300)=-59600+2494=-57106\\,\\text{J mol}^{-1}\\approx-57\\,\\text{kJ mol}^{-1}$\nMagnitude=**57**\n\n**Answer: 57**`,
'tag_thermo_4',src(2022,'Jul',26,'Evening')),

// Q102 - Amount of gas burnt in calorimeter - Answer: 35
mkNVT('THERMO-102','Hard',
`A gas (molar mass=$280\\,\\text{g mol}^{-1}$) was burnt in excess $\\text{O}_2$ in a constant volume calorimeter. Temperature increased from 298.0 K to 298.45 K. Heat capacity of calorimeter = $2.5\\,\\text{kJ K}^{-1}$. Enthalpy of combustion = $9\\,\\text{kJ mol}^{-1}$. Amount of gas burnt is ______ g.`,
{integer_value:35},
`**Heat released:** $q=C_{cal}\\times\\Delta T=2.5\\times0.45=1.125\\,\\text{kJ}$\n\n**Moles burnt:** $n=q/\\Delta_c H=1.125/9=0.125\\,\\text{mol}$\n\n**Mass:** $m=0.125\\times280=35\\,\\text{g}$\n\n**Answer: 35**`,
'tag_thermo_2',src(2022,'Jul',27,'Evening')),

// Q103 - Rise in temperature on mixing HNO3 + NaOH - Answer: 54
mkNVT('THERMO-103','Hard',
`When 600 mL of 0.2 M $\\text{HNO}_3$ is mixed with 400 mL of 0.1 M NaOH, the rise in temperature is $\\_\\_\\_\\_\\times10^{-2}\\,^\\circ\\text{C}$.\n\n[Enthalpy of neutralisation = $57\\,\\text{kJ mol}^{-1}$, Specific heat of water = $4.2\\,\\text{J K}^{-1}\\text{g}^{-1}$]`,
{integer_value:54},
`**Moles of $\\text{HNO}_3$:** $0.6\\times0.2=0.12\\,\\text{mol}$\n**Moles of NaOH:** $0.4\\times0.1=0.04\\,\\text{mol}$ (limiting)\n\n**Heat released:** $q=0.04\\times57000=2280\\,\\text{J}$\n\n**Total volume:** $1000\\,\\text{mL}=1000\\,\\text{g}$ water\n\n**Temperature rise:** $\\Delta T=q/(m\\times c)=2280/(1000\\times4.2)=0.5429\\,^\\circ\\text{C}=54.29\\times10^{-2}\\approx54\\times10^{-2}\\,^\\circ\\text{C}$\n\n**Answer: 54**`,
'tag_thermo_2',src(2022,'Jul',29,'Morning')),

// Q104 - Enthalpy of formation of ethane - Answer: (2) = -68 kJ/mol
mkSCQ('THERMO-104','Medium',
`At $25^\\circ\\text{C}$ and 1 atm, enthalpies of combustion:\n\n| Substance | $\\text{H}_2$ | C(graphite) | $\\text{C}_2\\text{H}_6(g)$ |\n|-----------|------|------|------|\n| $\\Delta_c H^\\ominus/\\text{kJ mol}^{-1}$ | −286.0 | −394.0 | −1560.0 |\n\nThe enthalpy of formation of ethane is:`,
['$+54.0\\,\\text{kJ mol}^{-1}$','$-68.0\\,\\text{kJ mol}^{-1}$','$-86.0\\,\\text{kJ mol}^{-1}$','$+97.0\\,\\text{kJ mol}^{-1}$'],
'c',
`**Formation:** $2\\text{C}(s)+3\\text{H}_2(g)\\rightarrow\\text{C}_2\\text{H}_6(g)$\n\n$\\Delta_f H=2\\Delta_c H(\\text{C})+3\\Delta_c H(\\text{H}_2)-\\Delta_c H(\\text{C}_2\\text{H}_6)$\n$=2(-394)+3(-286)-(-1560)=-788-858+1560=-86\\,\\text{kJ mol}^{-1}$\n\n**Answer: Option (3) — $-86.0\\,\\text{kJ mol}^{-1}$**`,
'tag_thermo_3',src(2022,'Jun',24,'Evening')),

// Q105 - Enthalpy of combustion of methanol at constant pressure - Answer: 727
mkNVT('THERMO-105','Hard',
`For complete combustion of methanol: $\\text{CH}_3\\text{OH}(l)+\\frac{3}{2}\\text{O}_2(g)\\rightarrow\\text{CO}_2(g)+2\\text{H}_2\\text{O}(l)$. Heat produced in bomb calorimeter = $726\\,\\text{kJ mol}^{-1}$ at $27^\\circ\\text{C}$. Enthalpy of combustion = $-x\\,\\text{kJ mol}^{-1}$. Value of $x$ is ______ (integer). [$R=8.3\\,\\text{J K}^{-1}\\text{mol}^{-1}$]`,
{integer_value:727},
`$\\Delta U=-726\\,\\text{kJ mol}^{-1}$ (bomb calorimeter = constant volume)\n\n$\\Delta n_g=1-1.5=-0.5$\n\n$\\Delta H=\\Delta U+\\Delta n_g RT=-726000+(-0.5)(8.3)(300)=-726000-1245=-727245\\,\\text{J mol}^{-1}\\approx-727\\,\\text{kJ mol}^{-1}$\n\n$x=727$\n\n**Answer: 727**`,
'tag_thermo_4',src(2022,'Jun',26,'Morning')),

// Q106 - Internal energy for vaporisation of water from fish - Answer: 38
mkNVT('THERMO-106','Medium',
`A fish covered with 36 g water is cooked at $100^\\circ\\text{C}$. Internal energy for vaporisation in $\\text{kJ mol}^{-1}$ is ______ (integer).\n\n[$\\Delta_{\\text{vap}}H^\\ominus=41.1\\,\\text{kJ mol}^{-1}$ at 373 K, 1 bar; $R=8.31\\,\\text{J K}^{-1}\\text{mol}^{-1}$]`,
{integer_value:38},
`$\\text{H}_2\\text{O}(l)\\rightarrow\\text{H}_2\\text{O}(g)$: $\\Delta n_g=1$\n\n$\\Delta U=\\Delta H-\\Delta n_g RT=41100-(1)(8.31)(373)=41100-3099.6=38000.4\\approx38\\,\\text{kJ mol}^{-1}$\n\n**Answer: 38**`,
'tag_thermo_4',src(2022,'Jun',26,'Evening')),

// Q107 - Enthalpy for vaporisation of 85g NH3 - Answer: 117
mkNVT('THERMO-107','Medium',
`17.0 g of $\\text{NH}_3$ completely vaporises at $-33.42^\\circ\\text{C}$ and 1 bar. Enthalpy change = $23.4\\,\\text{kJ mol}^{-1}$. Enthalpy change for vaporisation of 85 g of $\\text{NH}_3$ under same conditions is ______ kJ.`,
{integer_value:117},
`Molar mass $\\text{NH}_3=17\\,\\text{g mol}^{-1}$\n\n$n=85/17=5\\,\\text{mol}$\n\n$\\Delta H=5\\times23.4=117\\,\\text{kJ}$\n\n**Answer: 117**`,
'tag_thermo_3',src(2022,'Jun',29,'Morning')),

// Q108 - Lattice enthalpy of KCl - Answer: 718
mkNVT('THERMO-108','Hard',
`Born-Haber cycle for KCl:\n$\\Delta_f H^\\Theta(\\text{KCl})=-436.7\\,\\text{kJ mol}^{-1}$; $\\Delta_{\\text{sub}}H^\\Theta(\\text{K})=89.2\\,\\text{kJ mol}^{-1}$;\n$\\Delta_{\\text{ion}}H^\\Theta(\\text{K})=419.0\\,\\text{kJ mol}^{-1}$; $\\Delta_{\\text{eg}}H^\\Theta(\\text{Cl}(g))=-348.6\\,\\text{kJ mol}^{-1}$;\n$\\Delta_{\\text{bond}}H^\\Theta(\\text{Cl}_2)=243.0\\,\\text{kJ mol}^{-1}$\n\nMagnitude of lattice enthalpy of KCl in $\\text{kJ mol}^{-1}$ is (Nearest integer).`,
{integer_value:718},
`**Born-Haber cycle:**\n$\\Delta_f H=\\Delta_{\\text{sub}}H+\\Delta_{\\text{ion}}H+\\frac{1}{2}\\Delta_{\\text{bond}}H+\\Delta_{\\text{eg}}H+\\Delta_{\\text{lattice}}H$\n\n$-436.7=89.2+419.0+\\frac{1}{2}(243.0)+(-348.6)+\\Delta_{\\text{lattice}}H$\n\n$-436.7=89.2+419.0+121.5-348.6+\\Delta_{\\text{lattice}}H$\n\n$-436.7=281.1+\\Delta_{\\text{lattice}}H$\n\n$\\Delta_{\\text{lattice}}H=-436.7-281.1=-717.8\\approx-718\\,\\text{kJ mol}^{-1}$\n\nMagnitude=**718**\n\n**Answer: 718**`,
'tag_thermo_3',src(2021,'Aug',26,'Morning')),

// Q109 - Amount of glucose needed per day - Answer: 667
mkNVT('THERMO-109','Medium',
`An average person needs 10000 kJ energy per day. Amount of glucose (molar mass=$180.0\\,\\text{g mol}^{-1}$) needed is ______ g.\n\n[$\\Delta_C H(\\text{glucose})=-2700\\,\\text{kJ mol}^{-1}$]`,
{integer_value:667},
`**Moles of glucose needed:** $n=10000/2700=3.704\\,\\text{mol}$\n\n**Mass:** $m=3.704\\times180=666.7\\approx667\\,\\text{g}$\n\n**Answer: 667**`,
'tag_thermo_3',src(2021,'Jul',20,'Morning')),

// Q110 - Heat generated on combustion of 1g graphite - Answer: 21
mkNVT('THERMO-110','Medium',
`Standard molar enthalpy change for combustion of graphite powder is $-2.48\\times10^2\\,\\text{kJ mol}^{-1}$. Heat generated on combustion of 1 g of graphite powder in kJ (Nearest integer):`,
{integer_value:21},
`Molar mass of C = 12 g mol⁻¹\n\n$q=\\frac{1}{12}\\times248=20.67\\approx21\\,\\text{kJ}$\n\n**Answer: 21**`,
'tag_thermo_3',src(2021,'Jul',22,'Morning')),

// Q111 - Bond dissociation enthalpy H vs D - Answer: (3) = EH = ED - 7.5
mkSCQ('THERMO-111','Medium',
`At 298.2 K, the relationship between enthalpy of bond dissociation (in $\\text{kJ mol}^{-1}$) for hydrogen ($E_H$) and its isotope deuterium ($E_D$) is best described by:`,
['$E_H=\\frac{1}{2}E_D$','$E_H=E_D$','$E_H=E_D-7.5$','$E_H=2E_D$'],
'c',
`The bond dissociation enthalpy of $\\text{H}_2$ is $436\\,\\text{kJ mol}^{-1}$ and of $\\text{D}_2$ is $443.5\\,\\text{kJ mol}^{-1}$ at 298 K.\n\n$E_H-E_D=436-443.5=-7.5\\,\\text{kJ mol}^{-1}$\n\n$E_H=E_D-7.5$\n\n**Answer: Option (3)**`,
'tag_thermo_3',src(2021,'Jul',25,'Morning')),

// Q112 - Enthalpy of sublimation - Answer: 101
mkNVT('THERMO-112','Medium',
`At 298 K, enthalpy of fusion of solid X = $2.8\\,\\text{kJ mol}^{-1}$ and enthalpy of vaporisation of liquid X = $98.2\\,\\text{kJ mol}^{-1}$. Enthalpy of sublimation of X in $\\text{kJ mol}^{-1}$ is ______ (nearest integer).`,
{integer_value:101},
`**Hess's Law:** $\\Delta H_{\\text{sub}}=\\Delta H_{\\text{fus}}+\\Delta H_{\\text{vap}}=2.8+98.2=101.0\\,\\text{kJ mol}^{-1}$\n\n**Answer: 101**`,
'tag_thermo_3',src(2021,'Jul',25,'Morning')),

// Q113 - ΔvapH - ΔvapU for water at 100°C - Answer: 31
mkNVT('THERMO-113','Medium',
`For water at $100^\\circ\\text{C}$ and 1 bar, $\\Delta_{\\text{vap}}H-\\Delta_{\\text{vap}}U=\\_\\_\\_\\_\\times10^2\\,\\text{J mol}^{-1}$ (Round to Nearest Integer). [$R=8.31\\,\\text{J mol}^{-1}\\text{K}^{-1}$]`,
{integer_value:31},
`$\\text{H}_2\\text{O}(l)\\rightarrow\\text{H}_2\\text{O}(g)$: $\\Delta n_g=1$\n\n$\\Delta H-\\Delta U=\\Delta n_g RT=1\\times8.31\\times373=3099.6\\,\\text{J mol}^{-1}=30.996\\times10^2\\approx31\\times10^2\\,\\text{J mol}^{-1}$\n\n**Answer: 31**`,
'tag_thermo_4',src(2021,'Jul',27,'Morning')),

// Q114 - Temperature rise when H2SO4 + NaOH mixed - Answer: 82
mkNVT('THERMO-114','Hard',
`400 mL of 0.2 M $\\text{H}_2\\text{SO}_4$ mixed with 600 mL of 0.1 M NaOH. Rise in temperature = $\\_\\_\\_\\_\\times10^{-2}\\,\\text{K}$.\n\n[$\\Delta_r H=-57.1\\,\\text{kJ mol}^{-1}$, specific heat of $\\text{H}_2\\text{O}=4.18\\,\\text{J K}^{-1}\\text{g}^{-1}$, density=1.0 g cm⁻³]`,
{integer_value:82},
`**Moles of $\\text{H}^+$** from $\\text{H}_2\\text{SO}_4$: $0.4\\times0.2\\times2=0.16\\,\\text{mol}$\n**Moles of $\\text{OH}^-$** from NaOH: $0.6\\times0.1=0.06\\,\\text{mol}$ (limiting)\n\n**Heat released:** $q=0.06\\times57100=3426\\,\\text{J}$\n\n**Total mass:** $1000\\,\\text{g}$\n\n**Temperature rise:** $\\Delta T=3426/(1000\\times4.18)=0.8196\\,\\text{K}=81.96\\times10^{-2}\\approx82\\times10^{-2}\\,\\text{K}$\n\n**Answer: 82**`,
'tag_thermo_2',src(2021,'Jul',27,'Evening')),

// Q115 - Standard reaction enthalpy for 3CaO + 2Al → 3Ca + Al2O3 - Answer: 230
mkNVT('THERMO-115','Hard',
`Standard enthalpies of formation: $\\text{Al}_2\\text{O}_3=-1675\\,\\text{kJ mol}^{-1}$, $\\text{CaO}=-635\\,\\text{kJ mol}^{-1}$. For $3\\text{CaO}+2\\text{Al}\\rightarrow3\\text{Ca}+\\text{Al}_2\\text{O}_3$, $\\Delta_r H^0=\\_\\_\\_\\_\\,\\text{kJ}$ (Round to Nearest Integer).`,
{integer_value:230},
`$\\Delta_r H^0=\\Delta_f H^0(\\text{Al}_2\\text{O}_3)+3\\Delta_f H^0(\\text{Ca})-3\\Delta_f H^0(\\text{CaO})-2\\Delta_f H^0(\\text{Al})$\n$=-1675+0-3(-635)-0=-1675+1905=+230\\,\\text{kJ}$\n\n**Answer: 230**`,
'tag_thermo_3',src(2021,'Mar',17,'Morning')),

// Q116 - Reaction enthalpy for C2H6 → C2H4 + H2 - Answer: 128
mkNVT('THERMO-116','Hard',
`For $\\text{C}_2\\text{H}_6\\rightarrow\\text{C}_2\\text{H}_4+\\text{H}_2$, reaction enthalpy $\\Delta_r H$ in $\\text{kJ mol}^{-1}$ is ______ (Round to Nearest Integer).\n\n[Bond enthalpies: C−C=347, C=C=611, C−H=414, H−H=436 kJ mol⁻¹]`,
{integer_value:128},
`**Bonds broken in $\\text{C}_2\\text{H}_6$:** 1 C−C(347) + 6 C−H(6×414=2484) = 2831 kJ\n**Bonds formed in $\\text{C}_2\\text{H}_4+\\text{H}_2$:** 1 C=C(611) + 4 C−H(4×414=1656) + 1 H−H(436) = 2703 kJ\n\n$\\Delta_r H=2831-2703=+128\\,\\text{kJ mol}^{-1}$\n\n**Answer: 128**`,
'tag_thermo_3',src(2021,'Mar',18,'Morning')),

// Q117 - |ΔH298| for NH2CN combustion - Answer: 741
mkNVT('THERMO-117','Hard',
`$\\text{NH}_2\\text{CN}(s)+\\frac{3}{2}\\text{O}_2(g)\\rightarrow\\text{N}_2(g)+\\text{CO}_2(g)+\\text{H}_2\\text{O}(l)$. $\\Delta U=-742.24\\,\\text{kJ mol}^{-1}$. Magnitude of $\\Delta H_{298}$ is ______ kJ. [$R=8.314\\,\\text{J mol}^{-1}\\text{K}^{-1}$]`,
{integer_value:741},
`$\\Delta n_g=(1+1)-1.5=0.5$\n\n$\\Delta H=\\Delta U+\\Delta n_g RT=-742240+(0.5)(8.314)(298)=-742240+1238.8=-741001\\,\\text{J mol}^{-1}\\approx-741\\,\\text{kJ mol}^{-1}$\n\nMagnitude=**741**\n\n**Answer: 741**`,
'tag_thermo_4',src(2021,'Feb',25,'Morning')),

// Q118 - Energy for formation of NaBr ionic solid - Answer: 5576
mkNVT('THERMO-118','Hard',
`Ionization enthalpy of $\\text{Na}^+$ from $\\text{Na}(g)=495.8\\,\\text{kJ mol}^{-1}$. Electron gain enthalpy of Br = $-325.0\\,\\text{kJ mol}^{-1}$. Lattice enthalpy of NaBr = $-728.4\\,\\text{kJ mol}^{-1}$. Energy for formation of NaBr ionic solid = $(-)\\_\\_\\_\\_\\times10^{-1}\\,\\text{kJ mol}^{-1}$.`,
{integer_value:5576},
`**Energy for** $\\text{Na}^+(g)+\\text{Br}^-(g)\\rightarrow\\text{NaBr}(s)$:\n\nThis is just the lattice enthalpy = $-728.4\\,\\text{kJ mol}^{-1}$\n\nBut the question asks for the energy of formation of NaBr ionic solid from ions in gas phase:\n\n$\\Delta H=\\Delta_{\\text{ion}}H(\\text{Na})+\\Delta_{\\text{eg}}H(\\text{Br})+\\Delta_{\\text{lattice}}H$\n$=495.8+(-325.0)+(-728.4)=-557.6\\,\\text{kJ mol}^{-1}$\n$=-5576\\times10^{-1}\\,\\text{kJ mol}^{-1}$\n\n**Answer: 5576**`,
'tag_thermo_3',src(2021,'Feb',25,'Morning')),

// Q119 - Average S-F bond energy in SF6 - Answer: 309
mkNVT('THERMO-119','Hard',
`Average S−F bond energy in $\\text{kJ mol}^{-1}$ of $\\text{SF}_6$ is ______ (Rounded to nearest integer).\n\n[$\\Delta_f H^\\circ(\\text{SF}_6(g))=-1100$, $\\Delta_f H^\\circ(\\text{S}(g))=275$, $\\Delta_f H^\\circ(\\text{F}(g))=80\\,\\text{kJ mol}^{-1}$]`,
{integer_value:309},
`**Atomization of SF₆:**\n$\\text{SF}_6(g)\\rightarrow\\text{S}(g)+6\\text{F}(g)$\n\n$\\Delta H_{\\text{atom}}=\\Delta_f H(\\text{S})+6\\Delta_f H(\\text{F})-\\Delta_f H(\\text{SF}_6)$\n$=275+6(80)-(-1100)=275+480+1100=1855\\,\\text{kJ mol}^{-1}$\n\n**Average S−F bond energy:** $E_{\\text{S-F}}=1855/6=309.2\\approx309\\,\\text{kJ mol}^{-1}$\n\n**Answer: 309**`,
'tag_thermo_3',src(2021,'Feb',26,'Evening')),

// Q120 - Internal energy change for 90g water evaporation - Answer: 189494
mkNVT('THERMO-120','Hard',
`Internal energy change (in J) when 90 g of water undergoes complete evaporation at $100^\\circ\\text{C}$ is ______.\n\n[$\\Delta H_{\\text{vap}}=41\\,\\text{kJ/mol}$ at 373 K, $R=8.314\\,\\text{J K}^{-1}\\text{mol}^{-1}$]`,
{integer_value:189494},
`$n=90/18=5\\,\\text{mol}$\n\n$\\Delta U=\\Delta H-\\Delta n_g RT=5\\times41000-(5)(8.314)(373)$\n$=205000-15505.6=189494.4\\approx189494\\,\\text{J}$\n\n**Answer: 189494**`,
'tag_thermo_4',src(2020,'Sep',2,'Morning')),

];
async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
