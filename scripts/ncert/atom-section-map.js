// atom-section-map.js — single source of the ATOM→NCERT classification + citation strings.
// Consumed by classify-atom.js (tally) and apply-atom-citations.js (write).

const SECTIONS = {
  S1:   { title: '§2.1 Discovery of sub-atomic particles + Dalton + Table 2.1', page: '29–33' },
  S221: { title: '§2.2.1 Thomson model', page: '33' },
  S222: { title: '§2.2.2 Rutherford α-scattering & nuclear model', page: '34–35' },
  S223: { title: '§2.2.3–2.2.4 Atomic/mass number, isotopes/isobars', page: '35' },
  S225: { title: '§2.2.5 Drawbacks of Rutherford model', page: '36' },
  S231: { title: '§2.3.1 EM radiation, c=νλ, wavenumber', page: '37–39' },
  S232: { title: '§2.3.2 Planck E=hν, black body, photoelectric, dual nature', page: '39–43' },
  S233: { title: '§2.3.3 Atomic/line spectra, H-spectrum, Rydberg, series', page: '44–45' },
  S24:  { title: '§2.4 Bohr model (rₙ, Eₙ, hydrogen-like, limitations)', page: '46–49' },
  S251: { title: '§2.5.1 de Broglie λ=h/mv', page: '49–50' },
  S252: { title: '§2.5.2 Heisenberg uncertainty principle', page: '50–52' },
  S26:  { title: '§2.6 + 2.6.1 QM model, orbital, quantum numbers', page: '52–56' },
  S262: { title: '§2.6.2 Shapes of orbitals, radial/angular nodes, |ψ|²', page: '57–59' },
  S263: { title: '§2.6.3 Orbital energies, (n+l) rule, shielding, Z_eff', page: '59–61' },
  S264: { title: '§2.6.4 Aufbau, Pauli, Hund', page: '61–63' },
  S265: { title: '§2.6.5 Electronic configuration', page: '63–64' },
  S266: { title: '§2.6.6 Half/fully-filled stability, exchange energy', page: '64–65' },
  XC:   { title: 'Beyond NCERT Cl-11 Ch.2 (JEE-Adv detail / cross-chapter)', page: '—' },
};

// Citation anchor per section: the § label + the single page where the topic is introduced.
const SECTION_CITE = {
  S1:   { sec: '§2.1', page: 'p.30' },
  S221: { sec: '§2.2.1', page: 'p.33' },
  S222: { sec: '§2.2.2', page: 'p.34' },
  S223: { sec: '§2.2.3–2.2.4', page: 'p.35' },
  S225: { sec: '§2.2.5', page: 'p.36' },
  S231: { sec: '§2.3.1', page: 'p.37' },
  S232: { sec: '§2.3.2', page: 'p.39' },
  S233: { sec: '§2.3.3', page: 'p.44' },
  S24:  { sec: '§2.4', page: 'p.46' },
  S251: { sec: '§2.5.1', page: 'p.49' },
  S252: { sec: '§2.5.2', page: 'p.50' },
  S26:  { sec: '§2.6.1', page: 'p.54' },
  S262: { sec: '§2.6.2', page: 'p.57' },
  S263: { sec: '§2.6.3', page: 'p.59' },
  S264: { sec: '§2.6.4', page: 'p.61' },
  S265: { sec: '§2.6.5', page: 'p.63' },
  S266: { sec: '§2.6.6', page: 'p.64' },
};

// Per-question overrides where the S1 bucket is heterogeneous.
const OVERRIDE_CITE = {
  'ATOM-002': { sec: 'Ch.2 Introduction, Dalton’s atomic theory', page: 'p.29' },
  'ATOM-003': { sec: 'Ch.2 Introduction, Dalton’s atomic theory', page: 'p.29' },
  'ATOM-295': { sec: 'Ch.2 Introduction, Dalton’s atomic theory', page: 'p.29' },
  'ATOM-141': { sec: 'Table 2.1', page: 'p.33' },
  'ATOM-268': { sec: 'Table 2.1', page: 'p.33' },
  'ATOM-139': { sec: '§2.1.4', page: 'p.32' },
  'ATOM-142': { sec: '§2.1.4', page: 'p.32' },
};

// Bank questions that mirror an NCERT solved Problem — the strongest cite.
const PROBLEM_ECHO = {
  'ATOM-272': '2.3', 'ATOM-154': '2.7', 'ATOM-081': '2.7', 'ATOM-082': '2.7',
  'ATOM-076': '2.8', 'ATOM-089': '2.8', 'ATOM-080': '2.9', 'ATOM-020': '2.13',
  'ATOM-247': '2.12', 'ATOM-297': '2.12', 'ATOM-088': '2.16', 'ATOM-177': '2.16',
};

// display_id -> [sectionCode, tier]
const MAP = {
  'ATOM-001':['S232','A'],'ATOM-002':['S1','A'],'ATOM-003':['S1','A'],'ATOM-004':['S223','B'],
  'ATOM-005':['S223','B'],'ATOM-006':['S223','B'],'ATOM-007':['S223','B'],'ATOM-008':['S223','B'],
  'ATOM-009':['S223','B'],'ATOM-010':['S24','B'],'ATOM-011':['S26','A'],'ATOM-012':['S231','B'],
  'ATOM-013':['S233','A'],'ATOM-014':['S233','B'],'ATOM-015':['S233','B'],'ATOM-016':['S251','B'],
  'ATOM-017':['S251','B'],'ATOM-018':['S252','B'],'ATOM-019':['S232','B'],'ATOM-020':['S251','B'],
  'ATOM-021':['S232','A'],'ATOM-022':['S232','B'],'ATOM-023':['S232','B'],'ATOM-024':['S26','B'],
  'ATOM-025':['S26','B'],'ATOM-026':['S265','B'],'ATOM-027':['XC','C'],'ATOM-028':['S262','A'],
  'ATOM-029':['S26','A'],'ATOM-030':['S26','A'],'ATOM-031':['S265','B'],'ATOM-032':['S265','B'],
  'ATOM-033':['S26','B'],'ATOM-034':['S26','B'],'ATOM-035':['S26','B'],'ATOM-036':['S262','A'],
  'ATOM-037':['S233','B'],'ATOM-038':['S263','A'],'ATOM-039':['S265','A'],'ATOM-040':['S265','B'],
  'ATOM-041':['S263','A'],'ATOM-042':['S265','B'],'ATOM-043':['S265','B'],'ATOM-044':['S265','B'],
  'ATOM-045':['S251','B'],'ATOM-046':['S222','A'],'ATOM-047':['S221','A'],'ATOM-048':['S24','B'],
  'ATOM-049':['S24','B'],'ATOM-050':['S24','B'],'ATOM-051':['S26','A'],'ATOM-052':['S24','B'],
  'ATOM-053':['S24','B'],'ATOM-054':['S24','A'],'ATOM-055':['S24','B'],'ATOM-056':['S24','A'],
  'ATOM-057':['S24','B'],'ATOM-058':['S24','B'],'ATOM-059':['S24','B'],'ATOM-060':['S24','B'],
  'ATOM-061':['S233','B'],'ATOM-062':['S233','B'],'ATOM-063':['S233','B'],'ATOM-064':['S233','A'],
  'ATOM-065':['S233','B'],'ATOM-066':['S233','A'],'ATOM-067':['S233','B'],'ATOM-068':['S233','B'],
  'ATOM-069':['S233','B'],'ATOM-070':['XC','C'],'ATOM-071':['S251','A'],'ATOM-072':['S251','B'],
  'ATOM-073':['S232','A'],'ATOM-074':['S251','B'],'ATOM-075':['S252','B'],'ATOM-076':['S232','B'],
  'ATOM-077':['S232','B'],'ATOM-078':['S252','B'],'ATOM-079':['S232','B'],'ATOM-080':['S232','B'],
  'ATOM-081':['S232','B'],'ATOM-082':['S232','B'],'ATOM-083':['S251','B'],'ATOM-084':['S232','B'],
  'ATOM-085':['S252','B'],'ATOM-086':['S251','B'],'ATOM-087':['S251','B'],'ATOM-088':['S252','B'],
  'ATOM-089':['S232','B'],'ATOM-090':['S251','B'],'ATOM-091':['S251','B'],'ATOM-092':['S232','A'],
  'ATOM-093':['S251','B'],'ATOM-094':['S232','B'],'ATOM-095':['S251','B'],'ATOM-096':['S231','B'],
  'ATOM-097':['XC','C'],'ATOM-098':['S26','B'],'ATOM-099':['S265','B'],'ATOM-100':['S263','A'],
  'ATOM-101':['S262','B'],'ATOM-102':['S262','B'],'ATOM-103':['S262','A'],'ATOM-104':['XC','C'],
  'ATOM-105':['XC','C'],'ATOM-106':['S26','B'],'ATOM-107':['S26','A'],'ATOM-108':['S265','A'],
  'ATOM-109':['S262','A'],'ATOM-110':['XC','C'],'ATOM-111':['S262','B'],'ATOM-112':['S262','B'],
  'ATOM-113':['S262','A'],'ATOM-114':['S262','B'],'ATOM-115':['S262','A'],'ATOM-116':['S262','A'],
  'ATOM-117':['S265','B'],'ATOM-118':['S265','B'],'ATOM-119':['XC','C'],'ATOM-120':['S263','A'],
  'ATOM-121':['S263','A'],'ATOM-122':['S265','B'],'ATOM-123':['S265','B'],'ATOM-124':['XC','C'],
  'ATOM-125':['S265','A'],'ATOM-126':['S263','A'],'ATOM-127':['S263','A'],'ATOM-128':['S232','A'],
  'ATOM-129':['S24','B'],'ATOM-130':['S24','A'],'ATOM-131':['S233','A'],'ATOM-132':['S24','B'],
  'ATOM-133':['S24','A'],'ATOM-134':['S262','B'],'ATOM-135':['S26','A'],'ATOM-136':['S262','A'],
  'ATOM-137':['S262','A'],'ATOM-138':['S263','A'],'ATOM-139':['S1','A'],'ATOM-140':['S1','B'],
  'ATOM-141':['S1','A'],'ATOM-142':['S1','A'],'ATOM-143':['S1','A'],'ATOM-144':['S1','B'],
  'ATOM-145':['S1','B'],'ATOM-146':['S222','A'],'ATOM-147':['XC','C'],'ATOM-148':['S222','A'],
  'ATOM-149':['S222','A'],'ATOM-150':['XC','C'],'ATOM-151':['S231','A'],'ATOM-152':['S232','B'],
  'ATOM-153':['S232','B'],'ATOM-154':['S232','B'],'ATOM-155':['S232','B'],'ATOM-156':['S232','B'],
  'ATOM-157':['S232','B'],'ATOM-158':['S24','B'],'ATOM-159':['XC','C'],'ATOM-160':['S262','A'],
  'ATOM-161':['XC','C'],'ATOM-162':['XC','C'],'ATOM-163':['S24','B'],'ATOM-164':['S24','B'],
  'ATOM-165':['S233','B'],'ATOM-166':['S233','A'],'ATOM-167':['S233','B'],'ATOM-168':['S233','A'],
  'ATOM-169':['S233','B'],'ATOM-170':['S233','B'],'ATOM-171':['S251','A'],'ATOM-172':['S251','B'],
  'ATOM-173':['S251','B'],'ATOM-174':['S251','B'],'ATOM-175':['S251','B'],'ATOM-176':['S251','B'],
  'ATOM-177':['S252','B'],'ATOM-178':['S252','A'],'ATOM-179':['S262','B'],'ATOM-180':['S264','A'],
  'ATOM-181':['S264','A'],'ATOM-182':['S264','B'],'ATOM-183':['XC','C'],'ATOM-184':['S264','A'],
  'ATOM-185':['XC','C'],'ATOM-186':['S263','B'],'ATOM-187':['S264','A'],'ATOM-188':['S1','A'],
  'ATOM-189':['S266','B'],'ATOM-190':['S251','B'],'ATOM-191':['S232','B'],'ATOM-192':['XC','C'],
  'ATOM-193':['S232','A'],'ATOM-194':['S221','A'],'ATOM-195':['XC','C'],'ATOM-196':['S24','B'],
  'ATOM-197':['S24','B'],'ATOM-198':['S225','B'],'ATOM-199':['S233','B'],'ATOM-200':['S24','B'],
  'ATOM-201':['S251','B'],'ATOM-202':['S262','A'],'ATOM-203':['S26','A'],'ATOM-204':['S26','B'],
  'ATOM-205':['S26','B'],'ATOM-206':['S252','B'],'ATOM-207':['XC','C'],'ATOM-208':['S24','B'],
  'ATOM-209':['S262','A'],'ATOM-210':['S251','B'],'ATOM-211':['S24','B'],'ATOM-212':['S252','A'],
  'ATOM-213':['S24','A'],'ATOM-214':['XC','C'],'ATOM-215':['S265','B'],'ATOM-216':['S262','A'],
  'ATOM-218':['S266','A'],'ATOM-219':['S232','B'],'ATOM-220':['S26','B'],'ATOM-221':['S24','B'],
  'ATOM-222':['S263','A'],'ATOM-224':['S263','A'],'ATOM-226':['S222','A'],'ATOM-227':['S251','B'],
  'ATOM-228':['S232','B'],'ATOM-229':['S24','B'],'ATOM-230':['S24','B'],'ATOM-231':['S24','B'],
  'ATOM-232':['S24','B'],'ATOM-233':['S24','A'],'ATOM-234':['S24','B'],'ATOM-235':['XC','C'],
  'ATOM-236':['S24','B'],'ATOM-237':['S233','B'],'ATOM-238':['S24','B'],'ATOM-239':['S262','A'],
  'ATOM-240':['S262','B'],'ATOM-241':['S264','A'],'ATOM-242':['S26','A'],'ATOM-243':['S262','A'],
  'ATOM-244':['S265','A'],'ATOM-245':['S26','A'],'ATOM-246':['S262','B'],'ATOM-247':['S251','B'],
  'ATOM-248':['S232','B'],'ATOM-249':['XC','C'],'ATOM-250':['XC','C'],'ATOM-251':['S26','A'],
  'ATOM-252':['S26','B'],'ATOM-253':['S26','B'],'ATOM-254':['S26','B'],'ATOM-255':['XC','C'],
  'ATOM-256':['S262','A'],'ATOM-257':['S262','A'],'ATOM-258':['S262','A'],'ATOM-259':['S221','A'],
  'ATOM-260':['S222','A'],'ATOM-261':['S262','A'],'ATOM-262':['XC','C'],'ATOM-266':['XC','C'],
  'ATOM-267':['XC','C'],'ATOM-268':['S1','A'],'ATOM-269':['S26','A'],'ATOM-270':['S24','B'],
  'ATOM-271':['S223','B'],'ATOM-272':['S231','B'],'ATOM-273':['S223','B'],'ATOM-274':['S262','B'],
  'ATOM-275':['S223','A'],'ATOM-291':['S263','A'],'ATOM-292':['S233','A'],'ATOM-293':['S233','B'],
  'ATOM-294':['S24','B'],'ATOM-295':['S1','A'],'ATOM-296':['S251','B'],'ATOM-297':['S251','B'],
  'ATOM-298':['XC','C'],'ATOM-299':['S252','B'],'ATOM-300':['S263','A'],'ATOM-301':['S233','B'],
  'ATOM-302':['XC','C'],'ATOM-303':['S24','B'],'ATOM-304':['S233','B'],'ATOM-305':['XC','C'],
  'ATOM-306':['S24','B'],'ATOM-307':['S24','B'],'ATOM-308':['S251','B'],'ATOM-309':['S233','B'],
  'ATOM-310':['S24','B'],'ATOM-311':['S233','B'],'ATOM-312':['S232','B'],'ATOM-313':['S1','B'],
  'ATOM-314':['S26','A'],'ATOM-315':['S233','B'],'ATOM-316':['S233','B'],'ATOM-317':['S233','B'],
  'ATOM-318':['S263','A'],'ATOM-319':['S263','A'],'ATOM-320':['S223','B'],
};

// Build the single citation line that leads a solution. Tier A/B only.
function buildCitation(id) {
  const m = MAP[id];
  if (!m) return null;
  const [sec, tier] = m;
  if (tier === 'C') return null;
  const c = OVERRIDE_CITE[id] || SECTION_CITE[sec];
  let line = `**As per NCERT** · Class 11 Chemistry, *Structure of Atom* — ${c.sec} (${c.page}).`;
  if (PROBLEM_ECHO[id]) line += ` This question follows NCERT’s own solved Problem ${PROBLEM_ECHO[id]}.`;
  return line;
}

module.exports = { SECTIONS, SECTION_CITE, OVERRIDE_CITE, PROBLEM_ECHO, MAP, buildCitation };
