require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const R = String.raw;

// WBJEE 2021 — 8 questions whose stored answer key was corrected to the official
// book key (p.17). Their solutions are rewritten so the working ends at, and the
// boxed letter equals, the CORRECTED official answer.
const UPDATES = {
  // ATPH-133 — Physics Q3 — official (c). 12.5 eV beam on ground-state H.
  'ATPH-133': R`🎯
- A $ 12.5\,\mathrm{eV} $ electron beam bombards hydrogen in its ground state ( $ n_1 = 1 $ )
- Find the highest level $ n $ the atoms can be excited to

💡 The absorbed energy must equal the gap between level 1 and level $ n $: $ E = 13.6\left(1 - \frac{1}{n^2}\right)\,\mathrm{eV} $.

✏️
The electron can transfer at most $ 12.5\,\mathrm{eV} $, so set the excitation energy equal to this:

$ 12.5 = 13.6\left(\frac{1}{1^2} - \frac{1}{n^2}\right) $

$ 1 - \frac{1}{n^2} = \frac{12.5}{13.6} $

$ \frac{1}{n^2} = 1 - \frac{12.5}{13.6} = 0.080 $

$ n^2 = \frac{1}{0.080} = 12.5 \Rightarrow n = \sqrt{12.5} \approx 3.53 \approx 4 $

So the hydrogen atoms are excited up to the $ n = 4 $ level.

$\boxed{\text{Answer: (c)}}$
`,

  // WEP-136 — Physics Q9 — official (a). Block hits spring on second block.
  'WEP-136': R`🎯
- A block of mass $ m $ moves with speed $ v $ on a frictionless table toward a stationary block of mass $ m $ carrying a spring of constant $ k $
- Find the maximum compression $ x $ of the spring

💡 At maximum compression the spring stores the kinetic energy delivered to it; equate kinetic energy to spring potential energy.

✏️
At maximum compression, the kinetic energy of the moving block is fully stored in the spring:

$ \frac{1}{2}mv^2 = \frac{1}{2}kx^2 $

Cancel the $ \frac{1}{2} $ and solve for $ x $:

$ mv^2 = kx^2 $

$ x^2 = \frac{m}{k}\,v^2 $

$ x = \sqrt{\frac{m}{k}}\;v $

$\boxed{\text{Answer: (a)}}$
`,

  // K1D-144 — Physics Q10 — official (c) = 25 m/s. a-vs-x graph.
  'K1D-144': R`🎯
- A particle starts with initial velocity $ 5\,\mathrm{m/s} $
- For $ 0 \le x \le 20\,\mathrm{m} $ the acceleration rises linearly from $ 5 $ to $ 10\,\mathrm{m/s^2} $; for $ 20 \le x \le 35\,\mathrm{m} $ it stays constant at $ 10\,\mathrm{m/s^2} $
- Find the velocity at $ x = 35\,\mathrm{m} $

💡 Use $ a = v\frac{dv}{dx} $ so that $ v\,dv = a\,dx $; integrate over each segment of the graph.

✏️
First segment ( $ 0 \to 20\,\mathrm{m} $ ): the line gives $ a = \frac{x}{4} + 5 $.

$ v\,dv = \left(\frac{x}{4} + 5\right)dx $

Integrate from $ v = 5 $ to $ v $, and $ x = 0 $ to $ 20 $:

$ \frac{v^2}{2} - \frac{25}{2} = \left[\frac{x^2}{8} + 5x\right]_0^{20} = \frac{400}{8} + 100 = 150 $

$ \frac{v^2}{2} = 150 + \frac{25}{2} \Rightarrow v^2 = 325 $

Second segment ( $ 20 \to 35\,\mathrm{m} $ ): constant $ a = 10\,\mathrm{m/s^2} $, distance $ s = 15\,\mathrm{m} $.

$ v'^2 - v^2 = 2as $

$ v'^2 = 325 + 2(10)(15) = 325 + 300 = 625 $

$ v' = \sqrt{625} = 25\,\mathrm{m/s} $

$\boxed{\text{Answer: (c)}}$
`,

  // ELST-273 — Physics Q21 — official (a). Sphere + grounded shell.
  'ELST-273': R`🎯
- A metal sphere of radius $ R $ carries charge $ q $, surrounded by a thick concentric shell (inner radius $ a $, outer radius $ b $) with zero net charge, whose outer surface is grounded
- Find the potential at the centre

💡 Only the field in the gap between the sphere and the inner shell wall contributes (the grounded outer surface fixes the outside potential to zero); integrate that field inward.

✏️
By Gauss's law the field between the sphere and the inner shell ( $ R < r < a $ ) is

$ E = \frac{q}{4\pi\varepsilon_0 r^2} $

The grounded outer surface makes the potential zero at $ r = b $. The potential at the centre is the work to bring a unit charge in, which only accumulates across the gap from $ b $ to $ a $:

$ V = \int_a^b \frac{q}{4\pi\varepsilon_0 r^2}\,dr = \frac{q}{4\pi\varepsilon_0}\left[-\frac{1}{r}\right]_a^b $

$ V = \frac{q}{4\pi\varepsilon_0}\left(\frac{1}{a} - \frac{1}{b}\right) $

$\boxed{\text{Answer: (a)}}$
`,

  // MVCH-292 — Physics Q24 — official (b). Two parallel wires, field at origin.
  'MVCH-292': R`🎯
- Two long wires parallel to the $ Z $-axis carry equal current $ I $ in the $ +z $-direction, one through $ L(-1, +1) $ and one through $ M(-1, -1) $
- Find the resultant magnetic field at the origin $ O $

💡 Each wire's field at $ O $ has magnitude $ \frac{\mu_0 I}{2\pi r} $ and points perpendicular to the line joining the wire to $ O $ (right-hand rule); add the two vectors.

✏️
Distance of each wire from $ O $:

$ OL = \sqrt{(-1)^2 + 1^2} = \sqrt{2}, \qquad OM = \sqrt{(-1)^2 + (-1)^2} = \sqrt{2} $

Field at $ O $ from wire $ L $ (perpendicular to $ OL $, by right-hand rule):

$ \mathbf{B}_L = \frac{\mu_0 I}{2\pi\sqrt{2}}\left(\frac{\hat{i} + \hat{j}}{\sqrt{2}}\right) $

Field at $ O $ from wire $ M $:

$ \mathbf{B}_M = \frac{\mu_0 I}{2\pi\sqrt{2}}\left(\frac{-\hat{i} + \hat{j}}{\sqrt{2}}\right) $

Add them; the $ \hat{i} $ components cancel:

$ \mathbf{B} = \frac{\mu_0 I}{2\sqrt{2}\,\pi}\cdot\frac{2\hat{j}}{\sqrt{2}} = \frac{\mu_0 I}{2\pi}\,\hat{j} $

$\boxed{\text{Answer: (b)}}$
`,

  // ROT-272 — Physics Q33 — official (b) = 1/(2α). Rod, thermal expansion.
  'ROT-272': R`🎯
- A uniform rod of length $ L $ pivoted at one end rotates freely in a horizontal plane with angular velocity $ \omega $
- After heating by $ \Delta T $ the angular velocity becomes $ \frac{\omega}{2} $; coefficient of linear expansion is $ \alpha $ ( $ \alpha \ll 1 $ )
- Find $ \Delta T $

💡 No external torque acts, so angular momentum $ I\omega $ is conserved; the only change is the moment of inertia growing as the rod lengthens with heating.

✏️
Initial angular momentum: $ L_i = \frac{ML^2}{3}\,\omega $.

After heating the rod's length is $ L' = L(1 + \alpha\Delta T) $, so

$ L_f = \frac{ML'^2}{3}\cdot\frac{\omega}{2} $

Conserve angular momentum, $ L_f = L_i $:

$ \frac{ML'^2}{3}\cdot\frac{\omega}{2} = \frac{ML^2}{3}\,\omega $

$ \frac{L'^2}{2} = L^2 \Rightarrow L^2(1 + \alpha\Delta T)^2 = 2L^2 $

$ (1 + \alpha\Delta T)^2 = 2 \Rightarrow 1 + 2\alpha\Delta T + \alpha^2\Delta T^2 = 2 $

Since $ \alpha \ll 1 $, drop the $ \alpha^2\Delta T^2 $ term:

$ 2\alpha\Delta T = 1 \Rightarrow \Delta T = \frac{1}{2\alpha} $

$\boxed{\text{Answer: (b)}}$
`,

  // BNML-214 — Maths Q59 — official (d). Coefficient of a^3 b^4 c^5 in (bc+ca+ab)^6.
  'BNML-214': R`🎯
- Find the coefficient of $ a^3 b^4 c^5 $ in the expansion of $ (bc + ca + ab)^6 $

💡 Use the multinomial term $ \frac{6!}{p!\,q!\,r!}(bc)^p(ca)^q(ab)^r $ and match the powers of $ a, b, c $.

✏️
A general term is

$ \frac{6!}{p!\,q!\,r!}(bc)^p(ca)^q(ab)^r = \frac{6!}{p!\,q!\,r!}\,a^{q+r}\,b^{p+r}\,c^{p+q} $

Match the required powers $ a^3 b^4 c^5 $:

$ q + r = 3, \qquad p + r = 4, \qquad p + q = 5 $

Adding all three: $ 2(p + q + r) = 12 \Rightarrow p + q + r = 6 $.

Solving: $ p = 3, \; q = 2, \; r = 1 $.

So the coefficient is

$ \frac{6!}{3!\,2!\,1!} = 3\left(\frac{6!}{3!\,3!}\right) $

$\boxed{\text{Answer: (d)}}$
`,

  // SQSR-256 — Maths Q60 — official (c). G.P. + A.P. of logs → triangle type.
  'SQSR-256': R`🎯
- Three unequal positive numbers $ a, b, c $ are in G.P., and $ \log\left(\frac{5c}{2a}\right) $, $ \log\left(\frac{7b}{5c}\right) $, $ \log\left(\frac{2a}{7b}\right) $ are in A.P.
- Identify the type of triangle with sides $ a, b, c $

💡 G.P. gives $ b^2 = ac $; the A.P. condition on the three logs gives a second relation between $ b $ and $ a $. Then test the sides.

✏️
Since $ a, b, c $ are in G.P.: $ b^2 = ac $.

The logs are in A.P., so

$ 2\log\left(\frac{7b}{5c}\right) = \log\left(\frac{5c}{2a}\right) + \log\left(\frac{2a}{7b}\right) $

$ \frac{49b^2}{25c^2} = \frac{5c}{2a}\cdot\frac{2a}{7b} = \frac{5c}{7b} $

$ (7b)^3 = (5c)^3 \Rightarrow 7b = 5c \Rightarrow c = \frac{7}{5}b $

From $ b^2 = ac $: $ b^2 = a\cdot\frac{7}{5}b \Rightarrow b = \frac{7}{5}a $, so $ a = \frac{5}{7}b $.

The three sides are therefore $ \frac{5b}{7},\; b,\; \frac{7b}{5} $ — all different.

So $ a, b, c $ are the sides of a scalene triangle.

$\boxed{\text{Answer: (c)}}$
`,
};

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');
  const client = new MongoClient(uri);
  let updated = 0, failed = 0;
  try {
    await client.connect();
    const col = client.db('crucible').collection('questions_v2');
    for (const [display_id, md] of Object.entries(UPDATES)) {
      const res = await col.updateOne(
        { display_id },
        { $set: { 'solution.text_markdown': md, 'solution.latex_validated': false, updated_at: new Date(), updated_by: 'wbjee2021-solutions' } }
      );
      if (res.matchedCount === 1) {
        updated++;
        console.log(`OK  ${display_id}`);
      } else {
        failed++;
        console.log(`MISS ${display_id} (matched ${res.matchedCount})`);
      }
    }
  } finally {
    await client.close();
  }
  console.log(`\n${updated} updated, ${failed} failed`);
}

main().catch((e) => { console.error(e); process.exit(1); });
