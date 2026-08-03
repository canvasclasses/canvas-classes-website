'use strict';
/**
 * Class 11 Physics · Chapter 4 "Laws of Motion" — pages 7–9.
 * Wave 2a: the three dedicated FRICTION pages the founder asked for, split by
 * scenario family rather than crammed onto one page:
 *   p7  the concept — static vs kinetic, self-adjusting, angle of friction/repose
 *   p8  pulling vs pushing at an angle, optimum angle, stacked blocks
 *   p9  walls, rough inclines, and minimum-force problems
 *
 * All scenarios are transcribed from the reference books (Rule 0), never
 * generated from memory. Every number in every worked example was computed and
 * cross-checked before being written here.
 *
 * Run: node scripts/physics11-book/build_ch4_friction.js
 */
const { b, q, st, mcq, num, hero, ensureChapter, upsertPages, withDb } = require('./_book_ch4');

// ── p7 · Friction — Static, Kinetic, and the Self-Adjusting Force ───────────
const p7 = {
  page_number: 7,
  slug: 'friction-basics',
  title: 'Friction — Static, Kinetic, and the Self-Adjusting Force',
  subtitle: 'The force that gives you exactly as much as you ask for — until it runs out',
  glossary: [
    { term: 'static friction', definition: 'The friction that acts when there is only a TENDENCY of relative sliding, not actual sliding. It is self-adjusting: it takes whatever value is needed to prevent motion, up to a maximum of μ_s N.' },
    { term: 'kinetic friction', definition: 'The friction that acts once actual sliding has begun. It has a fixed value, f_k = μ_k N, and does not adjust itself.' },
    { term: 'angle of repose', definition: 'The incline angle at which a block is just on the verge of sliding down. tan α = μ. Numerically equal to the angle of friction.' },
  ],
  blocks: [
    hero('friction-basics'),
    b('curiosity_prompt', 0, {
      prompt: 'Push a heavy crate gently — it does not move. Push harder — still nothing. Push harder still — and suddenly it breaks free and slides. During all those failed pushes, what exactly was friction doing?',
      hint: 'The crate did not move, so the net force on it was zero every time. Work backwards from that.',
      reveal: 'It was **matching you, push for push.**\n\nWhile the crate stayed still, its acceleration was zero, so the net force on it was zero — which means friction was exactly equal and opposite to your push, at every single one of those failed attempts. Push with 20 N, friction gives back 20 N. Push with 60 N, friction gives back 60 N.\n\nThat is what makes **static friction** strange: it is not a fixed number. It is *self-adjusting* — it supplies precisely as much as is needed to prevent sliding, and no more. But it has a ceiling. Once your push exceeds that ceiling, friction cannot match you any more, and the crate breaks loose.\n\nThis is the single most misused idea in the chapter. Writing $ f = \\mu N $ for a block that is not sliding is wrong far more often than it is right.',
    }),
    b('text', 1, {
      markdown: 'Friction is the component of the contact force acting **along** the surface (the normal force is the perpendicular one). It always opposes the relative sliding — or the *tendency* to slide.\n\nIt comes in two kinds, and telling them apart is the whole skill:\n\n**Static friction** — only a tendency to slide. **Self-adjusting**, up to a limit: $ f_s \\le \\mu_s N $\n\n**Kinetic friction** — sliding has actually begun. **Fixed**: $ f_k = \\mu_k N $\n\nExperimentally $ \\mu_k < \\mu_s $, which is why a crate needs a big shove to start but a smaller push to keep going.',
    }),
    b('step_solver', 2, {
      title: 'Watching friction adjust itself, one push at a time',
      problem: 'A $ 1 $ kg block rests on a rough horizontal floor with $ \\mu_s = 0.5 $ and $ \\mu_k = 0.4 $. A horizontal force $ F $ is applied and gradually increased. Find the friction force and the block\'s acceleration when $ F $ is $ 2 $ N, $ 4 $ N, $ 5 $ N, $ 6 $ N and $ 8 $ N. Take $ g = 10 $ m/s².',
      intro: 'This one problem contains the whole page. Work through all five values and the behaviour of friction becomes obvious.',
      steps: [
        st('First the two thresholds. $ N = mg = 10\\ \\text{N} $, so $ f_L = \\mu_s N = 0.5(10) = 5\\ \\text{N} $ and $ f_k = \\mu_k N = 0.4(10) = 4\\ \\text{N} $.',
          'These two numbers decide everything that follows. $ f_L $ is the ceiling on static friction; $ f_k $ is the fixed value once sliding starts.', {
            check: {
              kind: 'mcq',
              prompt: 'At $ F = 2 $ N, the block does not move. What is the friction force?',
              options: [
                'Exactly 2 N, matching the applied force so the block stays still',
                'Exactly 5 N, the maximum static value available here',
                'Exactly 4 N, the kinetic value for these two surfaces',
                'Exactly 10 N, matching the normal force on the block',
              ],
              answer_index: 0,
              feedback_right: 'Right — the block is in equilibrium, so friction must exactly cancel the 2 N push. Self-adjusting means it supplies 2 N, not its 5 N maximum.',
              feedback_wrong: 'The block is stationary, so its net force is zero — friction must exactly balance the 2 N push, giving 2 N. Static friction supplies only what is needed, never its full 5 N ceiling unless forced to.',
            },
          }),
        st('$ F = 2 $: $ f = 2 $, $ a = 0 $. $ \\quad F = 4 $: $ f = 4 $, $ a = 0 $. $ \\quad F = 5 $: $ f = 5 $, $ a = 0 $ — friction is now at its ceiling, on the verge of slipping.',
          'Notice friction rising in lockstep with the push: 2, 4, 5. At $ F = 5 $ N it has nothing left to give.', {
            check: {
              kind: 'mcq',
              prompt: 'At $ F = 6 $ N, the block breaks free and slides. Which friction now acts?',
              options: [
                'Still 6 N, since static friction always matches the push exactly',
                '$ f_k = 4 $ N — once sliding begins, kinetic friction takes over at its fixed value',
                'Still 5 N, the limiting static value, since it was reached first',
                'Zero, because a sliding block has no friction acting on it',
              ],
              answer_index: 1,
              feedback_right: 'Right — the moment actual sliding starts, static friction is irrelevant and the fixed kinetic value $ f_k = 4 $ N applies instead.',
              feedback_wrong: 'Once the block is actually sliding, static friction no longer applies at all. Kinetic friction takes over, at its fixed value $ f_k = \\mu_k N = 4 $ N — which is LESS than the 5 N it took to break free.',
            },
          }),
        st('$ F = 6 $: $ f = f_k = 4 $, so $ a = \\dfrac{6-4}{1} = 2\\ \\text{m/s}^2 $. $ \\quad F = 8 $: $ f = 4 $ still, so $ a = \\dfrac{8-4}{1} = 4\\ \\text{m/s}^2 $.',
          'Once sliding, friction is frozen at 4 N however hard you push — so every extra newton of push goes straight into acceleration.', {
            check: {
              kind: 'fill_blank',
              prompt: 'If $ F $ were increased to $ 10 $ N, the acceleration would be $ (10-4)/1 $. Give the answer in m/s².',
              blank_answer: '6',
              feedback_right: 'Yes — 6 m/s². Friction stays at 4 N no matter how large F becomes.',
              feedback_wrong: '$ a = (F - f_k)/m = (10-4)/1 = 6 $ m/s². Kinetic friction does not grow with the applied force.',
            },
          }),
        st('The pattern: friction climbs $ 0 \\to 5 $ N alongside $ F $, then **drops** to $ 4 $ N the instant sliding begins, and stays there.',
          'That sudden drop from 5 N to 4 N is why a crate lurches forward when it finally breaks loose — for an instant the push exceeds friction by more than it did a moment before.', {
            why: 'This is exactly why $ \\mu_k < \\mu_s $ matters physically, not just as a number to memorise. At a microscopic level the surfaces form tiny cold-welded contact points at rest; breaking those welds needs more force than preventing them from re-forming once the surfaces are already sliding past each other.',
          }),
      ],
      now_you_try: {
        problem: 'A 2 kg block on a rough floor has $ \\mu_s = 0.4 $ and $ \\mu_k = 0.3 $. Take g = 10 m/s². Find the friction force when the applied horizontal force is (a) 5 N, (b) 10 N.',
        answer: '(a) $ 5 $ N, block stationary. (b) $ 6 $ N, block sliding at $ a = 2 $ m/s²',
        solution: '$ N = 20 $ N, so $ f_L = 0.4(20) = 8 $ N and $ f_k = 0.3(20) = 6 $ N. (a) $ F = 5 < 8 $, so the block stays still and friction self-adjusts to exactly 5 N. (b) $ F = 10 > 8 $, so it slides; friction becomes $ f_k = 6 $ N and $ a = (10-6)/2 = 2 $ m/s².',
      },
    }),
    b('callout', 3, {
      variant: 'warning',
      title: 'The single most common friction error',
      markdown: 'Writing $ f = \\mu N $ for a body that is **not sliding** — exactly the mistake the table above rules out. For a stationary body, $ \\mu_s N $ is only the **maximum** available; the friction actually acting is whatever the force balance demands, usually less.\n\n**Check first:** is it sliding? If yes, $ f_k = \\mu_k N $. If no, get $ f $ from equilibrium and verify it stays under $ \\mu_s N $.',
    }),
    b('image', 4, {
      src: '',
      alt: 'A graph of friction force against applied force, rising along a 45-degree line up to a peak labelled the limiting static value, then dropping to a lower horizontal line labelled the kinetic value and staying flat as the applied force increases further.',
      aspect_ratio: '16:9',
      figure_key: 'ch4-friction-force-graph',
      caption: 'Friction against applied force. Along the 45° line, friction is simply matching your push. At the peak it runs out, drops to the kinetic value, and then stays flat forever — every newton beyond that goes into acceleration.',
    }),
    b('step_solver', 5, {
      title: 'The angle of repose — measuring μ with nothing but a ramp',
      problem: 'A block is placed on a plank, and one end of the plank is slowly raised. The block is just on the verge of sliding when the plank makes $ 30° $ with the horizontal. Find the coefficient of friction between the block and the plank.',
      intro: 'This is a genuinely useful experiment — it measures μ without needing a force meter, a mass, or anything but a protractor.',
      steps: [
        st('On an incline of angle $ \\theta $: the driving force down the slope is $ mg\\sin\\theta $, the normal force is $ N = mg\\cos\\theta $, and so the maximum available friction is $ f_L = \\mu\\, mg\\cos\\theta $.',
          'As $ \\theta $ increases, the driving force GROWS (sine rises) while the available friction SHRINKS (cosine falls). They must cross somewhere — and that crossing is the angle of repose.', {
            check: {
              kind: 'mcq',
              prompt: 'At the exact angle where the block is on the verge of sliding, what is true?',
              options: [
                'The driving force exactly equals the maximum available friction',
                'The driving force is much larger than the available friction',
                'The normal force has fallen all the way to zero',
                'Friction has become larger than the block\'s full weight',
              ],
              answer_index: 0,
              feedback_right: 'Right — "on the verge" means friction is at its ceiling and still exactly balancing the driving force. One degree more and it loses.',
              feedback_wrong: '"On the verge of sliding" means the block is still in equilibrium, but only just — friction is at its maximum value AND still exactly balancing the driving force down the slope.',
            },
          }),
        st('Setting them equal: $ mg\\sin\\alpha = \\mu\\, mg\\cos\\alpha \\ \\Rightarrow\\ \\tan\\alpha = \\mu $.',
          'The mass cancels completely — the angle of repose does not depend on how heavy the block is, only on the pair of surfaces.', {
            check: {
              kind: 'fill_blank',
              prompt: 'With $ \\alpha = 30° $, find $ \\mu = \\tan 30° $, to three decimal places.',
              blank_answer: '0.577',
              feedback_right: 'Yes — $ \\tan 30° = 0.577 $.',
              feedback_wrong: '$ \\mu = \\tan 30° = 1/\\sqrt{3} = 0.577 $.',
            },
          }),
        st('$ \\mu = \\tan 30° = 0.577 $ — and it took no measuring equipment at all beyond an angle.',
          'The mass-independence is what makes this practical: a matchbox and a brick of the same material both start sliding at the same angle.', {
            why: 'There is a second angle worth knowing, and it turns out to be the same one. The **angle of friction** $ \\lambda $ is the angle the total contact force (normal plus limiting friction, added as vectors) makes with the normal: $ \\tan\\lambda = \\mu N / N = \\mu $. So $ \\lambda = \\alpha $ — the angle of friction and the angle of repose are numerically identical, both equal to $ \\tan^{-1}\\mu $. Two different-sounding definitions, one number.',
          }),
      ],
      now_you_try: {
        problem: 'A block just begins to slide when a plank is raised to 45°. Find μ. Then state what the angle of friction is for this pair of surfaces.',
        answer: '$ \\mu = 1 $, and the angle of friction is also $ 45° $',
        solution: '$ \\mu = \\tan 45° = 1 $. Since the angle of friction $ \\lambda = \\tan^{-1}\\mu = \\tan^{-1}(1) = 45° $, it equals the angle of repose — as it always does.',
      },
    }),
    b('step_solver', 6, {
      title: 'Past the tipping point — a block sliding down a rough incline',
      problem: 'A $ 5 $ kg block is released from rest on a rough incline of angle $ 37° $, where $ \\mu = 0.5 $. Find its acceleration down the slope. Take $ g = 10 $ m/s², $ \\sin37° = 0.6 $, $ \\cos37° = 0.8 $.',
      intro: 'The angle is past the angle of repose here, so the block WILL slide — which means kinetic friction, at its fixed value, opposing the motion up the slope.',
      steps: [
        st('First check that it actually slides: angle of repose $ \\alpha = \\tan^{-1}(0.5) \\approx 26.6° $, and $ 37° > 26.6° $. So yes, it slides.',
          'Never skip this check. If the angle had been BELOW the angle of repose, the block would simply sit there and the answer would be $ a = 0 $, with friction less than its maximum.', {
            check: {
              kind: 'mcq',
              prompt: 'Which way does the kinetic friction act on this sliding block?',
              options: [
                'Up the slope, opposing the block\'s downward sliding motion',
                'Down the slope, in the same direction as the sliding',
                'Perpendicular to the incline surface, alongside the normal force',
                'Vertically upward, directly opposing the block\'s weight',
              ],
              answer_index: 0,
              feedback_right: 'Right — friction always opposes the relative sliding, and the block slides down, so friction points up the slope.',
              feedback_wrong: 'Friction always opposes relative sliding. The block slides DOWN the slope, so friction acts UP the slope. (It is also always parallel to the surface — never perpendicular, which is the normal force\'s job.)',
            },
          }),
        st('$ N = mg\\cos\\theta = 5(10)(0.8) = 40\\ \\text{N} $, so $ f_k = \\mu N = 0.5(40) = 20\\ \\text{N} $ up the slope.',
          'The normal force on an incline is reduced by the $ \\cos\\theta $ factor — so the available friction is reduced too, exactly as the angle-of-repose argument required.', {
            check: {
              kind: 'fill_blank',
              prompt: 'The driving force down the slope is $ mg\\sin\\theta = 5(10)(0.6) $. Give it in newtons.',
              blank_answer: '30',
              feedback_right: 'Yes — 30 N down the slope.',
              feedback_wrong: '$ mg\\sin\\theta = 5 \\times 10 \\times 0.6 = 30 $ N.',
            },
          }),
        st('Along the slope: $ ma = mg\\sin\\theta - f_k = 30 - 20 = 10\\ \\text{N} \\ \\Rightarrow\\ a = \\dfrac{10}{5} = 2\\ \\text{m/s}^2 $ down the slope.',
          'Equivalently $ a = g(\\sin\\theta - \\mu\\cos\\theta) = 10(0.6 - 0.4) = 2 $ m/s² — and the mass cancels again, exactly as on the smooth incline.', {
            why: 'Compare with the SMOOTH incline from the free-body-diagram page: there $ a = g\\sin\\theta = 6 $ m/s². Friction has cut the acceleration to a third of that. The general result $ a = g(\\sin\\theta - \\mu\\cos\\theta) $ also tells you exactly when the block will not move at all: when $ \\mu \\ge \\tan\\theta $, which is the angle-of-repose condition again, arrived at from a completely different direction.',
          }),
      ],
      now_you_try: {
        problem: 'A block is released on a rough 30° incline with μ = 0.2. Find its acceleration down the slope. Take g = 10 m/s², sin30° = 0.5, cos30° = 0.866.',
        answer: '$ \\approx 3.27 $ m/s²',
        solution: 'Check first: $ \\tan30° = 0.577 > 0.2 $, so it does slide. $ a = g(\\sin\\theta - \\mu\\cos\\theta) = 10(0.5 - 0.2 \\times 0.866) = 10(0.5-0.173) = 3.27 $ m/s².',
      },
    }),
    b('step_solver', 7, {
      title: 'A block that will not move, however hard the numbers look',
      problem: 'A $ 4 $ kg block sits on a rough horizontal floor with $ \\mu_s = 0.6 $. A horizontal force of $ 20 $ N is applied. Find the friction force acting on the block, and its acceleration. Take $ g = 10 $ m/s².',
      intro: 'A deliberately plain-looking problem that catches almost everyone who reaches for $ f = \\mu N $ without checking first.',
      steps: [
        st('Maximum available static friction: $ f_L = \\mu_s N = \\mu_s mg = 0.6(4)(10) = 24\\ \\text{N} $.',
          'Compute the ceiling FIRST, before deciding anything about what friction actually is.', {
            check: {
              kind: 'mcq',
              prompt: 'The applied force is 20 N and the friction ceiling is 24 N. What happens?',
              options: [
                'The block slides, with friction fixed at its maximum 24 N value',
                'The block stays still — 20 N is below the 24 N ceiling',
                'The block slides, with friction adjusting to exactly 20 N',
                'The block stays still, with friction acting at its full 24 N',
              ],
              answer_index: 1,
              feedback_right: 'Right — the push cannot overcome the 24 N ceiling, so the block stays put and friction self-adjusts to match.',
              feedback_wrong: 'The applied 20 N is LESS than the 24 N ceiling, so static friction can still match it — the block stays stationary. And because it is self-adjusting, friction supplies exactly 20 N, not the full 24 N.',
            },
          }),
        st('Since $ 20 < 24 $, the block does not move. Equilibrium then forces $ f = 20\\ \\text{N} $, and $ a = 0 $.',
          'Writing $ f = \\mu N = 24 $ N here would be wrong twice over: wrong number, and it would predict the block accelerating BACKWARDS, into your own push.', {
            check: {
              kind: 'mcq',
              prompt: 'What would go visibly wrong if you incorrectly used $ f = \\mu_s N = 24 $ N here?',
              options: [
                'You would get $ a = (20-24)/4 = -1 $ m/s² — the block accelerating backwards, into the push',
                'You would get exactly the right answer anyway, by coincidence',
                'You would get a much larger forward acceleration than the true one',
                'You would get zero acceleration, which happens to be correct here',
              ],
              answer_index: 0,
              feedback_right: 'Right — and a block spontaneously accelerating into your own push is physically absurd, which is exactly the signal that the assumption was wrong.',
              feedback_wrong: 'You would compute $ a = (20-24)/4 = -1 $ m/s² — the block accelerating backwards, toward you, purely because you pushed it. That absurd result is the tell-tale sign of having applied $ f = \\mu N $ to a non-sliding body.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A 10 kg block on a floor with μ_s = 0.3 is pushed horizontally with 25 N. Take g = 10 m/s². Find the friction force and the acceleration.',
        answer: 'Friction $ = 25 $ N, $ a = 0 $',
        solution: 'Ceiling: $ f_L = 0.3(10)(10) = 30 $ N. The 25 N push is below that, so the block stays still, friction self-adjusts to exactly 25 N, and $ a = 0 $.',
      },
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.6,
      questions: [
        q('A 3 kg block sits on a floor with $ \\mu_s = 0.5 $ and is pushed horizontally with 10 N. Taking g = 10 m/s², the friction force acting on it is:',
          ['$ 15 $ N, the maximum static friction available in this situation', '$ 10 $ N, exactly matching the applied push, so the block stays still', '$ 5 $ N, half of the maximum static friction value here', '$ 30 $ N, equal to the normal force acting on the block'],
          1, 'The ceiling is $ \\mu_s mg = 0.5(3)(10) = 15 $ N. The 10 N push is below it, so the block stays still and self-adjusting static friction supplies exactly 10 N.', 2),
        q('Which statement about static and kinetic friction is correct?',
          ['Static friction has a single fixed value, exactly like kinetic friction does', 'Static friction is self-adjusting up to a maximum; kinetic friction is fixed', 'Kinetic friction is self-adjusting; static friction has one fixed value only', 'Both are self-adjusting and neither one has any upper limit at all'],
          1, 'Static friction supplies only what is needed to prevent sliding, up to a ceiling of $ \\mu_s N $. Kinetic friction, once sliding starts, is fixed at $ \\mu_k N $ regardless of the applied force.', 1),
        q('The angle of repose for a pair of surfaces is 30°. The coefficient of friction between them is:',
          ['$ \\sin 30° = 0.5 $, the sine of the measured repose angle', '$ \\tan 30° = 0.577 $, the tangent of the repose angle', '$ \\cos 30° = 0.866 $, the cosine of the repose angle', '$ 30 $, simply the angle itself expressed as a number'],
          1, 'Setting the driving force equal to the limiting friction on an incline gives $ mg\\sin\\alpha = \\mu mg\\cos\\alpha $, so $ \\mu = \\tan\\alpha = \\tan30° = 0.577 $.', 2),
        q('Two blocks of very different masses, made of the same material, are placed on the same plank which is slowly tilted. They begin to slide:',
          ['At the same angle, since the angle of repose does not depend on mass', 'At different angles, with the heavier block sliding sooner than the lighter', 'At different angles, with the lighter block sliding sooner than the heavier', 'Only the heavier block slides; the lighter one never begins to move at all'],
          0, 'Mass cancels completely from $ mg\\sin\\alpha = \\mu mg\\cos\\alpha $, leaving $ \\tan\\alpha = \\mu $ — which depends only on the pair of surfaces, never on the weight resting on them.', 3),
        q('Once a block has broken free and is sliding, increasing the applied force further causes the kinetic friction on it to:',
          ['Increase in direct proportion to the applied force, as static friction did', 'Stay exactly the same, since $ f_k = \\mu_k N $ and N is unchanged', 'Decrease steadily as the block picks up more and more speed', 'Rise until it reaches the limiting static value, then hold steady'],
          1, 'Kinetic friction depends only on $ \\mu_k $ and the normal force, neither of which changes when you push harder horizontally — so it stays fixed, and every extra newton goes into acceleration.', 2),
      ],
    }),
    b('callout', 9, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- **Static friction is self-adjusting:** $ f_s \\le \\mu_s N $. Use the force balance to find it, not $ \\mu_s N $.\n- **Kinetic friction is fixed:** $ f_k = \\mu_k N $, once sliding has actually begun. And $ \\mu_k < \\mu_s $.\n- **Always check first:** is it sliding? Compare the driving force with $ \\mu_s N $ before choosing a formula.\n- **Angle of repose** $ \\alpha $: $ \\tan\\alpha = \\mu $ — mass-independent, and numerically equal to the angle of friction $ \\lambda $.\n- On a rough incline, $ a = g(\\sin\\theta - \\mu\\cos\\theta) $ — and the block only moves at all when $ \\tan\\theta > \\mu $.',
    }),
    b('practice_bank', 10, {
      title: 'You solve it',
      intro: 'Seven questions. For every one of them, decide whether the body is sliding BEFORE you choose which friction formula to use.',
      sections: [
        {
          id: 'p7-ysi',
          title: 'Static, Kinetic & the Angle of Repose',
          items: [
            num('p7-y1', 'A 5 kg block on a rough floor has $ \\mu_s = 0.4 $. What is the maximum horizontal force it can withstand without sliding? Take g = 10 m/s².',
              '$ 20 $ N',
              '$ f_L = \\mu_s mg = 0.4 \\times 5 \\times 10 = 20 $ N. Any push up to and including 20 N is matched by static friction.'),
            mcq('p7-y2', 'A 2 kg block with $ \\mu_s = 0.5 $ is pushed horizontally with 6 N (g = 10 m/s²). The friction acting on it is:',
              ['$ 10 $ N, the full limiting static friction for this block', '$ 6 $ N, matching the push exactly since the block stays still', '$ 3 $ N, which is half of the applied pushing force', '$ 0 $ N, since a stationary block has no friction on it'],
              1, 'Ceiling is $ 0.5(2)(10) = 10 $ N; the 6 N push is below it, so the block stays put and friction self-adjusts to exactly 6 N.'),
            num('p7-y3', 'A block just begins to slide on a plank tilted at 37°. Find the coefficient of friction. Use tan37° = 0.75.',
              '$ 0.75 $',
              'At the angle of repose, $ \\mu = \\tan\\alpha = \\tan37° = 0.75 $.'),
            num('p7-y4', 'A 4 kg block slides down a rough 45° incline with μ = 0.2. Find its acceleration. Take g = 10 m/s², sin45° = cos45° = 0.707.',
              '$ \\approx 5.66 $ m/s²',
              '$ a = g(\\sin\\theta - \\mu\\cos\\theta) = 10(0.707 - 0.2 \\times 0.707) = 10 \\times 0.707 \\times 0.8 = 5.66 $ m/s².'),
            mcq('p7-y5', 'A 1 kg block with $ \\mu_s = 0.6 $, $ \\mu_k = 0.4 $ is pushed with 7 N (g = 10 m/s²). Its acceleration is:',
              ['$ 3 $ m/s², since the block slides and kinetic friction is then 4 N', '$ 1 $ m/s², subtracting the limiting static value of 6 N instead', '$ 0 $ m/s², because the applied push cannot break the block free', '$ 7 $ m/s², since friction stops mattering once sliding begins'],
              0, 'Ceiling is $ \\mu_s mg = 0.6(1)(10) = 6 $ N; the 7 N push exceeds it, so the block slides. Kinetic friction then applies: $ f_k = 0.4(10) = 4 $ N, giving $ a = (7-4)/1 = 3 $ m/s². Using the 6 N static ceiling instead of the 4 N kinetic value is the trap here.'),
            mcq('p7-y6', 'The angle of friction λ and the angle of repose α for the same pair of surfaces are related by:',
              ['$ \\lambda = 2\\alpha $, twice the angle of repose in every case', '$ \\lambda = \\alpha $, they are numerically identical for any surfaces', '$ \\lambda = 90° - \\alpha $, they are complementary to each other', 'They are entirely unrelated quantities with no fixed connection'],
              1, 'Both work out to $ \\tan^{-1}\\mu $ — the angle of friction from the geometry of the total contact force, the angle of repose from the incline condition. Same number, two derivations.'),
            num('p7-y7', 'A 6 kg block rests on a rough floor with $ \\mu_s = 0.3 $, $ \\mu_k = 0.2 $. A horizontal force of 24 N is applied. Take g = 10 m/s². Find the acceleration.',
              '$ 2 $ m/s²',
              'Ceiling: $ 0.3(6)(10) = 18 $ N. The 24 N push exceeds it, so the block slides. $ f_k = 0.2(60) = 12 $ N, and $ a = (24-12)/6 = 2 $ m/s².'),
          ],
        },
      ],
    }),
    b('text', 11, {
      markdown: 'Every push on this page was horizontal, and every surface was flat. The next page tilts the *force* rather than the surface — and it turns out that the angle you pull at changes the normal force, which changes the friction, which changes everything.',
    }),
  ],
};

// ── p8 · Friction in Action — Pulling, Pushing, and Stacked Blocks ──────────
const p8 = {
  page_number: 8,
  slug: 'friction-pulling-pushing-and-stacked-blocks',
  title: 'Friction in Action — Pulling, Pushing, and Stacked Blocks',
  subtitle: 'Why the angle you pull at matters more than how hard you pull',
  glossary: [
    { term: 'optimum angle of pull', definition: 'The angle at which the force needed to just move a block is smallest: tan θ = μ, giving F_min = μmg/√(1+μ²).' },
  ],
  blocks: [
    hero('friction-pulling-pushing-and-stacked-blocks'),
    b('curiosity_prompt', 0, {
      prompt: 'A loaded handcart can be moved either by pulling it with a rope angled up from your shoulder, or by pushing it with your hands angled down. Both use the same muscles and the same effort. Which one actually takes less force — and why should it make any difference at all?',
      hint: 'Friction depends on the normal force. Ask what each option does to the normal force.',
      reveal: '**Pulling wins, and often by a lot.**\n\nWhen you pull at an upward angle, part of your force lifts the cart slightly — which *reduces* the normal force from the ground, which *reduces* friction. When you push at a downward angle, part of your force presses the cart *into* the ground — which *increases* the normal force, and so increases friction.\n\nSo pushing makes you fight a friction force that you yourself made bigger. Pulling makes you fight one that you made smaller.\n\nOn this page you will find that for a typical crate, pulling can need barely half the force pushing does. This is NCERT\'s own question 4.23(c) — "why is it easier to pull a lawn mower than to push it" — and the answer is entirely in the normal force.',
    }),
    b('step_solver', 1, {
      title: 'Pulling at an angle — where the normal force goes',
      problem: 'A $ 10 $ kg crate rests on a rough floor with $ \\mu = 0.5 $. It is pulled by a rope making $ 30° $ above the horizontal. Find the minimum force needed to just start it moving. Take $ g = 10 $ m/s², $ \\sin30° = 0.5 $, $ \\cos30° = 0.866 $.',
      intro: 'The key move is to write the normal force in terms of the unknown F, rather than assuming it equals mg — because here it does not.',
      steps: [
        st('Vertical equilibrium: the rope\'s vertical component $ F\\sin\\theta $ acts UPWARD, helping to support the crate. So $ N + F\\sin\\theta - mg = 0 \\ \\Rightarrow\\ N = mg - F\\sin\\theta $.',
          'This is the whole idea of the page in one line. The normal force is NOT $ mg $ here — the pull is carrying part of the weight.', {
            check: {
              kind: 'mcq',
              prompt: 'What does this reduced normal force do to the maximum available friction?',
              options: [
                'Reduces it, since friction is $ \\mu N $ and N itself has gone down',
                'Increases it, since a lighter contact grips the floor more firmly',
                'Leaves it completely unchanged, since the crate\'s mass has not changed',
                'Reduces it to exactly zero, regardless of how small the pull is',
              ],
              answer_index: 0,
              feedback_right: 'Right — less normal force means less friction to overcome. The pull is helping you twice over: forward, and by lightening the load.',
              feedback_wrong: 'Friction is $ \\mu N $, so reducing N reduces the friction directly. That is the entire advantage of pulling at an upward angle.',
            },
          }),
        st('Horizontal, on the verge of moving: $ F\\cos\\theta = \\mu N = \\mu(mg - F\\sin\\theta) $.',
          'Notice F now appears on BOTH sides — that is what makes this different from every friction problem so far, and it is why the algebra needs one extra step.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Collecting F terms: $ F(\\cos\\theta + \\mu\\sin\\theta) = \\mu mg $. With $ \\mu=0.5, \\cos30°=0.866, \\sin30°=0.5 $, evaluate the bracket $ (0.866 + 0.5 \\times 0.5) $, to three decimals.',
              blank_answer: '1.116',
              feedback_right: 'Yes — $ 0.866 + 0.25 = 1.116 $.',
              feedback_wrong: '$ \\cos\\theta + \\mu\\sin\\theta = 0.866 + 0.5(0.5) = 0.866 + 0.25 = 1.116 $.',
            },
          }),
        st('$ F = \\dfrac{\\mu mg}{\\cos\\theta + \\mu\\sin\\theta} = \\dfrac{0.5 \\times 100}{1.116} = \\dfrac{50}{1.116} \\approx 44.8\\ \\text{N} $',
          'For comparison: pulling this crate horizontally (θ = 0) would need the full $ \\mu mg = 50 $ N. The 30° angle has already saved you about 5 N.', {
            why: 'The saving comes from the $ \\mu\\sin\\theta $ term in the denominator, which only exists because the pull lightens the crate. Push instead — angling downward — and that term flips sign, which is exactly what the next step-solver works out.',
          }),
      ],
      now_you_try: {
        problem: 'A 20 kg crate with μ = 0.4 is pulled by a rope at 30° above the horizontal. Find the minimum force to start it moving. Take g = 10 m/s², sin30° = 0.5, cos30° = 0.866.',
        answer: '$ \\approx 75.0 $ N',
        solution: '$ F = \\mu mg/(\\cos\\theta + \\mu\\sin\\theta) = 0.4(200)/(0.866 + 0.4 \\times 0.5) = 80/1.066 \\approx 75.0 $ N.',
      },
    }),
    b('step_solver', 2, {
      title: 'Pushing at the same angle — the direct comparison',
      problem: 'The same $ 10 $ kg crate ($ \\mu = 0.5 $) is now PUSHED with a force at $ 30° $ BELOW the horizontal, as if pressing down on its top edge. Find the minimum force needed to start it moving, and compare with the pulling answer.',
      intro: 'Exactly one sign changes in the whole derivation. Watch what it does to the answer.',
      steps: [
        st('Vertical: the push\'s vertical component $ F\\sin\\theta $ now acts DOWNWARD, pressing the crate into the floor. So $ N = mg + F\\sin\\theta $.',
          'A plus sign instead of a minus. That single character is the entire difference between the two cases.', {
            check: {
              kind: 'mcq',
              prompt: 'Compared to a purely horizontal push, this downward-angled push makes the friction:',
              options: [
                'Larger, because the extra downward force increases the normal force',
                'Smaller, because some of the force is no longer acting horizontally',
                'Exactly the same, since the crate\'s own weight has not changed at all',
                'Zero, because the vertical and horizontal parts cancel each other out',
              ],
              answer_index: 0,
              feedback_right: 'Right — you are pressing the crate harder into the floor, so friction goes up. You are fighting a resistance you created yourself.',
              feedback_wrong: 'The downward component adds to the normal force ($ N = mg + F\\sin\\theta $), and friction is $ \\mu N $ — so the friction you must overcome gets LARGER the harder you push.',
            },
          }),
        st('Horizontal: $ F\\cos\\theta = \\mu(mg + F\\sin\\theta) \\ \\Rightarrow\\ F(\\cos\\theta - \\mu\\sin\\theta) = \\mu mg $.',
          'The bracket is now a DIFFERENCE, not a sum — so it is smaller, so F must be bigger.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate the bracket $ (\\cos30° - \\mu\\sin30°) = (0.866 - 0.5 \\times 0.5) $, to three decimals.',
              blank_answer: '0.616',
              feedback_right: 'Yes — $ 0.866 - 0.25 = 0.616 $, compared with 1.116 for the pull.',
              feedback_wrong: '$ \\cos\\theta - \\mu\\sin\\theta = 0.866 - 0.25 = 0.616 $ — noticeably smaller than the pulling case\'s 1.116.',
            },
          }),
        st('$ F = \\dfrac{50}{0.616} \\approx 81.2\\ \\text{N} $ — against $ 44.8 $ N for the pull. **Pushing needs about 1.8 times as much force.**',
          'Same crate, same floor, same angle, same muscles. Only the direction of the vertical component differs, and it nearly doubles the effort.', {
            why: 'There is a genuinely dangerous case hiding in that denominator. If $ \\cos\\theta - \\mu\\sin\\theta $ reaches ZERO — that is, when $ \\tan\\theta = 1/\\mu $ — the required force becomes **infinite**: no amount of pushing at that angle will ever move the crate, because every extra newton of push adds exactly as much friction as it adds driving force. This is called self-locking, and it is why you cannot shove a heavy box along by pressing steeply down on it.',
          }),
      ],
      now_you_try: {
        problem: 'The 20 kg crate (μ = 0.4) from the previous try is now pushed at 30° below the horizontal instead. Find the minimum force, and compare with the 75.0 N it took to pull.',
        answer: '$ \\approx 120.1 $ N — about 1.6 times the pulling force',
        solution: '$ F = \\mu mg/(\\cos\\theta - \\mu\\sin\\theta) = 80/(0.866 - 0.2) = 80/0.666 \\approx 120.1 $ N, against 75.0 N for the pull.',
      },
    }),
    b('image', 3, {
      src: '',
      alt: 'Two free body diagrams side by side of the same crate: on the left a rope pulling upward at an angle with the normal force arrow drawn short, on the right a hand pushing downward at an angle with the normal force arrow drawn noticeably longer, and the friction arrow correspondingly longer.',
      aspect_ratio: '16:9',
      figure_key: 'ch4-pull-vs-push',
      caption: 'Same crate, same angle, opposite vertical components. Pulling shortens the normal-force arrow and so shortens friction; pushing lengthens both. That is the whole of NCERT 4.23(c) in one picture.',
    }),
    b('step_solver', 4, {
      title: 'The best possible angle to pull at',
      problem: 'For the same $ 10 $ kg crate with $ \\mu = 0.5 $, at what angle should the rope be held to make the required force as SMALL as possible, and what is that minimum force? Take $ g = 10 $ m/s².',
      intro: 'Pulling at 30° beat pulling horizontally. So is steeper always better? No — and finding the sweet spot is a nice piece of reasoning.',
      steps: [
        st('$ F(\\theta) = \\dfrac{\\mu mg}{\\cos\\theta + \\mu\\sin\\theta} $. To make $ F $ smallest, make the denominator $ (\\cos\\theta + \\mu\\sin\\theta) $ as LARGE as possible.',
          'Steeper is not automatically better: raising $ \\theta $ grows the helpful $ \\mu\\sin\\theta $ term but shrinks the $ \\cos\\theta $ term, since less of your pull points forward. There must be a best compromise.', {
            check: {
              kind: 'mcq',
              prompt: 'What goes wrong if you pull at a very steep angle, close to 90° (almost straight up)?',
              options: [
                'Friction becomes so small that no force at all is needed',
                'Almost none of your force points forward, so $ \\cos\\theta \\to 0 $ and F must grow',
                'The normal force becomes negative, which is physically impossible',
                'The crate rotates instead of sliding, so the analysis no longer applies',
              ],
              answer_index: 1,
              feedback_right: 'Right — at 90° you are lifting, not dragging. Friction may vanish, but so does your forward pull, and the crate goes nowhere horizontally.',
              feedback_wrong: 'At very steep angles almost all of your force is vertical: $ \\cos\\theta \\to 0 $, so the forward component vanishes. You would be lifting the crate rather than dragging it along.',
            },
          }),
        st('The maximum of $ \\cos\\theta + \\mu\\sin\\theta $ occurs at $ \\tan\\theta = \\mu $ — the same relation as the angle of friction, appearing yet again.',
          'So the ideal pulling angle is exactly the angle of friction, $ \\theta = \\tan^{-1}\\mu $. With $ \\mu = 0.5 $, that is about $ 26.6° $.', {
            check: {
              kind: 'fill_blank',
              prompt: 'At that optimum, $ F_{\\min} = \\dfrac{\\mu mg}{\\sqrt{1+\\mu^2}} = \\dfrac{50}{\\sqrt{1.25}} $. Evaluate, to one decimal place, in newtons.',
              blank_answer: '44.7',
              feedback_right: 'Yes — $ 50/1.118 = 44.7 $ N.',
              feedback_wrong: '$ \\sqrt{1.25} = 1.118 $, so $ F_{\\min} = 50/1.118 = 44.7 $ N.',
            },
          }),
        st('$ \\theta_{\\text{opt}} \\approx 26.6° $, $ F_{\\min} \\approx 44.7\\ \\text{N} $ — barely better than the $ 44.8 $ N at 30°.',
          'The curve is very flat near its minimum, which is genuinely useful to know: anywhere within about 10° of the optimum is essentially as good.', {
            why: 'That flatness is why this result is practical rather than fussy. Nobody hauling a crate measures $ \\tan^{-1}\\mu $ — but "pull at a modest upward angle rather than horizontally or steeply" captures almost the entire benefit, and that is what people do instinctively.',
          }),
      ],
      now_you_try: {
        problem: 'A crate with μ = 0.75 is to be pulled with the least possible force. Find the optimum angle of pull.',
        answer: '$ \\approx 36.9° $',
        solution: 'The optimum angle satisfies $ \\tan\\theta = \\mu = 0.75 $, so $ \\theta = \\tan^{-1}(0.75) \\approx 36.9° $ — the angle of friction for these surfaces.',
      },
    }),
    b('step_solver', 5, {
      title: 'Stacked blocks — when does the top one slip?',
      problem: 'A $ 2 $ kg block A rests on top of a $ 4 $ kg block B, which sits on a frictionless floor. The coefficient of friction between A and B is $ 0.5 $. A horizontal force $ F $ is applied to the TOP block A. Find the largest $ F $ for which the two blocks still move together. Take $ g = 10 $ m/s².',
      intro: 'The block underneath has nothing pushing it except friction from the block on top. That single observation solves the whole problem.',
      steps: [
        st('What drives block B? Only the friction from A on its upper surface — the floor is frictionless and nothing else touches it.',
          'So B\'s acceleration is entirely limited by how much friction A can supply, which has a hard ceiling.', {
            check: {
              kind: 'fill_blank',
              prompt: 'The maximum friction between A and B is $ \\mu\\, m_A\\, g = 0.5 \\times 2 \\times 10 $. Give it in newtons.',
              blank_answer: '10',
              feedback_right: 'Yes — 10 N is the most friction that interface can ever transmit.',
              feedback_wrong: 'The normal force between A and B is A\'s weight, $ m_A g = 20 $ N, so the maximum friction is $ \\mu(20) = 0.5 \\times 20 = 10 $ N.',
            },
          }),
        st('So B\'s maximum possible acceleration is $ a_{\\max} = \\dfrac{f_{\\max}}{m_B} = \\dfrac{10}{4} = 2.5\\ \\text{m/s}^2 $.',
          'B simply cannot be accelerated faster than this, no matter what happens to A — there is no other force available to push it.', {
            check: {
              kind: 'mcq',
              prompt: 'If F is large enough that the pair would need to accelerate faster than 2.5 m/s², what happens?',
              options: [
                'Both blocks accelerate together at that faster rate anyway',
                'A slides forward over B; B stays capped at 2.5 m/s² while A goes faster',
                'B slides forward faster than A does, overtaking it from below',
                'Neither block moves at all, since the friction limit has been exceeded',
              ],
              answer_index: 1,
              feedback_right: 'Right — B tops out at 2.5 m/s², and A, which has the force applied directly to it, keeps accelerating past it. They separate in speed.',
              feedback_wrong: 'B can never exceed 2.5 m/s² because friction from A is its only driving force. Beyond that, A (which has F applied directly) accelerates faster and starts sliding forward over B.',
            },
          }),
        st('While they move together, $ a = \\dfrac{F}{m_A + m_B} = \\dfrac{F}{6} $. Setting this equal to $ 2.5 $: $ F = 6 \\times 2.5 = 15\\ \\text{N} $.',
          'So for $ F \\le 15 $ N the pair moves as one block; above 15 N, A begins to slip over B.', {
            why: 'Worth noticing which mass appears where. The friction ceiling is set by A\'s weight (it is the normal force between them), but the acceleration limit is set by B\'s mass. Make A heavier and the grip improves; make B heavier and it becomes harder to drag along. Both effects are visible directly in $ a_{\\max} = \\mu m_A g / m_B $.',
          }),
      ],
      now_you_try: {
        problem: 'A 3 kg block sits on a 2 kg block on a frictionless floor, with μ = 0.4 between them. A horizontal force is applied to the TOP (3 kg) block. Take g = 10 m/s². Find the largest force for which they move together.',
        answer: '$ 30 $ N',
        solution: 'Maximum friction $ = 0.4(3)(10) = 12 $ N, so the bottom block\'s maximum acceleration is $ 12/2 = 6 $ m/s². Together, $ a = F/5 $, so $ F = 5 \\times 6 = 30 $ N.',
      },
    }),
    b('inline_quiz', 6, {
      pass_threshold: 0.6,
      questions: [
        q('Pulling a crate by a rope angled upward is easier than pushing it at the same angle downward because:',
          ['The upward pull reduces the normal force, and so reduces friction too', 'The upward pull increases the normal force, giving a much better grip', 'Pulling somehow uses stronger muscles than pushing does in practice', 'The crate\'s own weight is genuinely smaller when it is being pulled'],
          0, 'Pulling upward gives $ N = mg - F\\sin\\theta $; pushing downward gives $ N = mg + F\\sin\\theta $. Since friction is $ \\mu N $, the pull faces less friction and the push faces more.', 2),
        q('For a block being pulled at angle θ above the horizontal, the normal force from the floor is:',
          ['$ mg $, exactly as it would be with no applied force at all', '$ mg - F\\sin\\theta $, reduced by the pull\'s vertical component', '$ mg + F\\sin\\theta $, increased by the pull\'s vertical component', '$ mg\\cos\\theta $, as it would be on an inclined surface'],
          1, 'Vertical equilibrium with an upward component $ F\\sin\\theta $ helping to support the block gives $ N + F\\sin\\theta = mg $, so $ N = mg - F\\sin\\theta $.', 2),
        q('The angle at which the force needed to just move a block is smallest satisfies:',
          ['$ \\sin\\theta = \\mu $, the sine of the angle equalling the friction coefficient', '$ \\tan\\theta = \\mu $, making it exactly the angle of friction', '$ \\cos\\theta = \\mu $, the cosine of the angle equalling the coefficient', '$ \\theta = 45° $ always, regardless of the surfaces involved'],
          1, 'Maximising the denominator $ \\cos\\theta + \\mu\\sin\\theta $ gives $ \\tan\\theta = \\mu $ — the same angle of friction that turned up as the angle of repose on the previous page.', 3),
        q('When pushing a block at a steep downward angle, the required force can become infinite. This happens when:',
          ['$ \\tan\\theta = 1/\\mu $, so each extra newton of push adds equal friction', '$ \\tan\\theta = \\mu $, the ordinary angle of friction for the surfaces', 'The block\'s mass grows beyond some critical limiting value', 'The angle reaches exactly 45°, regardless of the coefficient'],
          0, 'The required force is $ \\mu mg/(\\cos\\theta - \\mu\\sin\\theta) $, which blows up when the denominator hits zero, i.e. $ \\cos\\theta = \\mu\\sin\\theta $, or $ \\tan\\theta = 1/\\mu $. This is the self-locking condition.', 3),
        q('Block A rests on block B on a frictionless floor, and a force is applied to A. Block B is driven forward by:',
          ['The applied force itself, transmitted directly through the two blocks', 'Friction from block A acting on B\'s upper surface, and nothing else', 'The normal force from the frictionless floor beneath block B', 'Block B\'s own weight, acting downward through its centre'],
          1, 'The floor is frictionless and nothing else touches B horizontally, so the only horizontal force available to accelerate it is friction from A above — which is exactly why B\'s acceleration is capped.', 2),
      ],
    }),
    b('callout', 7, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- **Pulling up at angle θ:** $ N = mg - F\\sin\\theta $, so $ F = \\dfrac{\\mu mg}{\\cos\\theta + \\mu\\sin\\theta} $.\n- **Pushing down at angle θ:** $ N = mg + F\\sin\\theta $, so $ F = \\dfrac{\\mu mg}{\\cos\\theta - \\mu\\sin\\theta} $ — always larger.\n- **Optimum pulling angle:** $ \\tan\\theta = \\mu $ (the angle of friction again), giving $ F_{\\min} = \\dfrac{\\mu mg}{\\sqrt{1+\\mu^2}} $.\n- **Self-locking:** pushing at $ \\tan\\theta = 1/\\mu $ needs infinite force — every extra newton adds as much friction as drive.\n- **Stacked blocks:** the lower block is driven ONLY by friction from above, capping its acceleration at $ \\mu m_{\\text{top}} g / m_{\\text{bottom}} $.',
    }),
    b('practice_bank', 8, {
      title: 'You solve it',
      intro: 'Seven questions. For each, write the normal force in terms of the unknown force FIRST — assuming $ N = mg $ is the mistake this whole page exists to prevent.',
      sections: [
        {
          id: 'p8-ysi',
          title: 'Pulling, Pushing & Stacked Blocks',
          items: [
            mcq('p8-y1', 'A block is pulled by a rope at 40° above the horizontal. Compared with pulling it horizontally, the normal force from the floor is:',
              ['Larger, since the rope presses the block down into the floor', 'Smaller, since the rope\'s vertical component helps support it', 'Exactly the same, because the block\'s mass has not changed', 'Zero, because the rope now carries the entire weight'],
              1, 'An upward-angled pull carries part of the weight: $ N = mg - F\\sin40° $, which is less than $ mg $.'),
            num('p8-y2', 'A 10 kg block with μ = 0.5 is pulled at the optimum angle. Find the minimum force needed to move it. Take g = 10 m/s².',
              '$ \\approx 44.7 $ N',
              '$ F_{\\min} = \\mu mg/\\sqrt{1+\\mu^2} = 0.5(100)/\\sqrt{1.25} = 50/1.118 \\approx 44.7 $ N.'),
            num('p8-y3', 'A 5 kg block with μ = 0.6 is pushed at 30° below the horizontal. Find the minimum force to move it. Take g = 10 m/s², sin30° = 0.5, cos30° = 0.866.',
              '$ \\approx 53.0 $ N',
              '$ F = \\mu mg/(\\cos\\theta - \\mu\\sin\\theta) = 0.6(50)/(0.866 - 0.3) = 30/0.566 \\approx 53.0 $ N.'),
            mcq('p8-y4', 'A 4 kg block sits on a 6 kg block on a frictionless floor, with μ = 0.5 between them. The maximum acceleration the LOWER block can reach is:',
              ['$ 5.0 $ m/s², set by the total weight of both blocks together', '$ 3.33 $ m/s², set by the friction ceiling divided by its own mass', '$ 10.0 $ m/s², since the floor beneath it is completely frictionless', '$ 2.00 $ m/s², set by the upper block\'s mass alone'],
              1, 'Maximum friction from above is $ 0.5(4)(10) = 20 $ N, and the lower block\'s mass is 6 kg, so $ a_{\\max} = 20/6 = 3.33 $ m/s².'),
            mcq('p8-y5', 'The optimum angle for pulling a block with μ = 1 is:',
              ['$ 30° $, a third of the way to vertical for this coefficient', '$ 45° $, since $ \\tan45° = 1 $ matches the coefficient exactly', '$ 60° $, two-thirds of the way to vertical for this case', '$ 90° $, straight up, since the coefficient is at its maximum'],
              1, 'The optimum satisfies $ \\tan\\theta = \\mu = 1 $, giving $ \\theta = 45° $.'),
            num('p8-y6', 'A 2 kg block rests on a 3 kg block on a frictionless floor, μ = 0.4 between them. Force is applied to the TOP block. Take g = 10 m/s². Find the largest force for which they move together.',
              '$ \\approx 13.3 $ N',
              'Maximum friction $ = 0.4(2)(10) = 8 $ N, so the lower block caps at $ 8/3 = 2.67 $ m/s². Together $ a = F/5 $, so $ F = 5(2.67) \\approx 13.3 $ N.'),
            mcq('p8-y7', 'Self-locking — where no amount of pushing will move a block — occurs when pushing downward at an angle satisfying:',
              ['$ \\tan\\theta = \\mu $, exactly the ordinary angle of friction', '$ \\tan\\theta = 1/\\mu $, so added friction cancels added drive', '$ \\sin\\theta = \\mu $, the sine matching the friction coefficient', '$ \\theta = 90° $, pressing straight down onto the block'],
              1, 'The denominator $ \\cos\\theta - \\mu\\sin\\theta $ vanishes when $ \\tan\\theta = 1/\\mu $, making the required force infinite — every extra newton of push contributes exactly as much extra friction as extra forward drive.'),
          ],
        },
      ],
    }),
    b('text', 9, {
      markdown: 'Every surface so far has been horizontal, with gravity pulling straight into it. The next page turns the surface **vertical** — where the normal force no longer has anything to do with weight at all — and then asks the question this chapter keeps circling: what is the *least* force that will do the job?',
    }),
  ],
};

// ── p9 · Friction — Walls, Wedges, and Minimum-Force Problems ───────────────
const p9 = {
  page_number: 9,
  slug: 'friction-walls-wedges-and-minimum-force',
  title: 'Friction — Walls, Wedges, and Minimum-Force Problems',
  subtitle: 'When the surface is vertical, weight stops setting the normal force',
  glossary: [
    { term: 'self-locking', definition: 'A situation where increasing the applied force increases the resisting friction just as fast, so no amount of force produces motion.' },
  ],
  blocks: [
    hero('friction-walls-wedges-and-minimum-force'),
    b('curiosity_prompt', 0, {
      prompt: 'Hold a book flat against a wall with your palm, pressing horizontally. Press gently and it slides down. Press hard and it stays. But your hand is pushing purely sideways — so what is actually holding the book UP?',
      hint: 'Friction acts along the surface. Which way is "along" a vertical wall?',
      reveal: '**Friction — acting vertically.**\n\nOn a horizontal floor, friction acts horizontally and the normal force acts vertically. On a vertical wall, both of those rotate through 90°: the normal force is now horizontal (your palm\'s push, matched by the wall), and friction now acts **vertically**, up the wall face, holding the book against gravity.\n\nAnd here is the part that catches people: the normal force has **nothing to do with the book\'s weight** any more. It is set entirely by how hard you press. So the available friction, $ \\mu N $, is under your direct control — press harder and you get more upward grip. That is why pressing harder works, and it is exactly the free-body diagram the free-body-diagram page deliberately left unfinished.',
    }),
    b('step_solver', 1, {
      title: 'The minimum press that holds a block on a wall',
      problem: 'A $ 2 $ kg block is held against a vertical wall by a horizontal force $ F $. The coefficient of friction between block and wall is $ 0.4 $. Find the minimum $ F $ that will keep the block from sliding down. Take $ g = 10 $ m/s².',
      intro: 'The picture promised on the free-body-diagram page, now with friction in it and real numbers attached.',
      steps: [
        st('Horizontally: the wall\'s normal force balances the push, so $ N = F $. **Not $ mg $** — the block\'s weight plays no part in setting N here at all.',
          'This is the single most important line on the page. On a vertical wall, the normal force is whatever you press with.', {
            check: {
              kind: 'mcq',
              prompt: 'Which force holds the block up against gravity?',
              options: [
                'The normal force from the wall, acting vertically upward',
                'Friction from the wall, acting vertically up along the wall face',
                'The applied horizontal force F, acting directly upward',
                'Nothing — the block must always slide down a vertical wall',
              ],
              answer_index: 1,
              feedback_right: 'Right — friction acts along the surface, and on a vertical wall "along" means vertically. It is the only upward force available.',
              feedback_wrong: 'The normal force is perpendicular to the wall, so it is horizontal and cannot oppose gravity. Friction acts ALONG the wall — vertically — and is the only thing holding the block up.',
            },
          }),
        st('Vertically, on the verge of slipping: $ f_{\\max} = mg \\ \\Rightarrow\\ \\mu N = mg \\ \\Rightarrow\\ \\mu F = mg $.',
          'Friction is at its ceiling and exactly matching the weight — the standard "minimum force" condition.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Solve $ F = mg/\\mu = (2 \\times 10)/0.4 $. Give the answer in newtons.',
              blank_answer: '50',
              feedback_right: 'Yes — 50 N.',
              feedback_wrong: '$ F = mg/\\mu = 20/0.4 = 50 $ N.',
            },
          }),
        st('$ F_{\\min} = \\dfrac{mg}{\\mu} = 50\\ \\text{N} $ — two and a half times the block\'s own weight of $ 20 $ N.',
          'Pressing a 2 kg book to a wall needs a 5 kg-equivalent push. Anyone who has tried this knows it is surprisingly hard work, and the factor $ 1/\\mu $ is why.', {
            why: 'Notice what happens as $ \\mu $ gets small: $ F_{\\min} = mg/\\mu $ blows up. On a genuinely frictionless wall ($ \\mu = 0 $) no finite force can hold the block at all — which is precisely the conclusion the free-body-diagram page reached, arrived at here from the opposite direction and now with the general formula behind it.',
          }),
      ],
      now_you_try: {
        problem: 'A 3 kg block is held against a vertical wall by a horizontal force, with μ = 0.5. Take g = 10 m/s². Find the minimum force needed.',
        answer: '$ 60 $ N',
        solution: '$ F_{\\min} = mg/\\mu = (3 \\times 10)/0.5 = 30/0.5 = 60 $ N — double the block\'s 30 N weight.',
      },
    }),
    b('step_solver', 2, {
      title: 'A second force along the wall — combining two forces friction must fight',
      problem: 'A $ 1 $ kg block is pushed against a rough vertical wall with a horizontal force of $ 20 $ N, with $ \\mu = 0.25 $. A second horizontal force of $ 10 $ N is now applied to the block, directed **sideways along the wall face**. Will the block move? If so, in which direction and with what acceleration? Take $ g = 10 $ m/s².',
      intro: 'Friction on a wall can act in ANY direction along the wall face — not just vertically. That makes this a genuinely two-dimensional problem on the wall surface.',
      steps: [
        st('$ N = 20\\ \\text{N} $ (the press), so $ f_L = \\mu N = 0.25(20) = 5\\ \\text{N} $. This is the total friction available, in any direction along the wall.',
          'The friction ceiling is a single number, but it can be spent in whichever direction the block tends to slide.', {
            check: {
              kind: 'mcq',
              prompt: 'Two forces now act along the wall face: weight 10 N downward and the applied 10 N sideways. Their resultant is:',
              options: [
                '$ 20 $ N, simply the two forces added together arithmetically',
                '$ 10\\sqrt{2} \\approx 14.1 $ N, at 45° to the vertical',
                '$ 0 $ N, since the two forces exactly cancel each other out',
                '$ 10 $ N, since only the larger of the two forces matters here',
              ],
              answer_index: 1,
              feedback_right: 'Right — two perpendicular 10 N forces combine to $ \\sqrt{10^2+10^2} = 10\\sqrt{2} \\approx 14.1 $ N, at 45° between them.',
              feedback_wrong: 'The weight (down) and the applied force (sideways) are perpendicular to each other, so they combine as vectors: $ \\sqrt{10^2 + 10^2} = 10\\sqrt{2} \\approx 14.1 $ N, at 45°.',
            },
          }),
        st('Compare: driving force $ 14.1\\ \\text{N} $ against friction ceiling $ 5\\ \\text{N} $. Since $ 14.1 > 5 $, the block **slides**.',
          'And it slides in the direction of that resultant — diagonally down the wall at 45°, not straight down.', {
            check: {
              kind: 'fill_blank',
              prompt: 'The acceleration is $ (14.1 - 5)/1 $. Give it in m/s², to two decimal places.',
              blank_answer: '9.14',
              feedback_right: 'Yes — about 9.14 m/s², directed diagonally down the wall at 45°.',
              feedback_wrong: '$ a = (F_{\\text{net}} - f_L)/m = (14.14 - 5)/1 = 9.14 $ m/s².',
            },
          }),
        st('The block slides **diagonally down the wall at $ 45° $**, with $ a \\approx 9.14\\ \\text{m/s}^2 $.',
          'Friction acts back along that same 45° line, opposing the slide — not straight up, and not straight sideways.', {
            why: 'The lesson generalises well beyond walls: when several forces act along a surface, **combine them into one resultant first**, then compare that single resultant with the friction ceiling. Testing each force separately against $ \\mu N $ would have said "10 N beats 5 N" twice over and still missed the actual direction of motion entirely.',
          }),
      ],
      now_you_try: {
        problem: 'A 2 kg block is pressed against a vertical wall with 40 N, μ = 0.3. A sideways force of 15 N is applied along the wall. Take g = 10 m/s². Does it move, and if so with what acceleration?',
        answer: 'Yes — resultant $ = 25 $ N along the wall, friction ceiling $ = 12 $ N, so $ a = 6.5 $ m/s²',
        solution: '$ f_L = 0.3(40) = 12 $ N. Along the wall: weight 20 N down, applied 15 N sideways, resultant $ \\sqrt{20^2+15^2} = \\sqrt{625} = 25 $ N. Since $ 25 > 12 $ it slides, with $ a = (25-12)/2 = 6.5 $ m/s².',
      },
    }),
    b('image', 3, {
      src: '',
      alt: 'A block held against a vertical wall, with the applied horizontal force and the wall normal force shown as a horizontal pair, and friction drawn as an arrow acting vertically upward along the wall face opposing the block weight.',
      aspect_ratio: '16:9',
      figure_key: 'ch4-block-on-wall',
      caption: 'On a vertical wall everything rotates by 90°: the normal force is horizontal and set by your push alone, while friction acts vertically along the face — the only thing opposing the weight.',
    }),
    b('step_solver', 4, {
      title: 'Holding a block still on a rough incline',
      problem: 'A $ 5 $ kg block sits on a rough incline of angle $ 37° $ with $ \\mu = 0.3 $. Find (a) the minimum force, applied UP the slope, needed to stop it sliding down, and (b) the force needed to push it steadily UP the slope. Take $ g = 10 $ m/s², $ \\sin37° = 0.6 $, $ \\cos37° = 0.8 $.',
      intro: 'The same block, the same slope, two different questions — and friction points in opposite directions in the two cases. That reversal is the entire content of this problem.',
      steps: [
        st('$ N = mg\\cos\\theta = 5(10)(0.8) = 40\\ \\text{N} $, so $ f_{\\max} = \\mu N = 0.3(40) = 12\\ \\text{N} $. The weight component down the slope is $ mg\\sin\\theta = 5(10)(0.6) = 30\\ \\text{N} $.',
          'Since $ 30 > 12 $, the block would slide down on its own — so a holding force is genuinely needed.', {
            check: {
              kind: 'mcq',
              prompt: 'For case (a), stopping it sliding DOWN, which way does friction act?',
              options: [
                'Up the slope, opposing the block\'s tendency to slide downward',
                'Down the slope, adding to the weight component pulling it down',
                'Perpendicular to the incline, alongside the normal force itself',
                'Horizontally, in the direction of the applied holding force',
              ],
              answer_index: 0,
              feedback_right: 'Right — the block tends to slide down, so friction opposes that tendency and acts up the slope, helping your holding force.',
              feedback_wrong: 'Friction opposes the tendency of relative motion. The block tends to slide DOWN, so friction acts UP the slope — working with your applied force, not against it.',
            },
          }),
        st('(a) Holding it: friction helps. $ F + f_{\\max} = mg\\sin\\theta \\ \\Rightarrow\\ F = 30 - 12 = 18\\ \\text{N} $.',
          'You only need to supply the shortfall — friction covers 12 N of the 30 N pull.', {
            check: {
              kind: 'fill_blank',
              prompt: '(b) Pushing it UP, friction now reverses to act DOWN the slope, so $ F = mg\\sin\\theta + f_{\\max} = 30 + 12 $. Give the answer in newtons.',
              blank_answer: '42',
              feedback_right: 'Yes — 42 N, against just 18 N to hold it still.',
              feedback_wrong: 'Moving up the slope means friction opposes that motion, acting down the slope: $ F = 30 + 12 = 42 $ N.',
            },
          }),
        st('(a) $ 18 $ N to hold it. (b) $ 42 $ N to push it up — more than twice as much, purely because friction switched sides.',
          'Between those two values, from 18 N to 42 N, the block simply sits still: any force in that range is balanced by self-adjusting static friction.', {
            why: 'That in-between range is worth dwelling on, because it is the self-adjusting idea in its most useful form. Apply 30 N and friction supplies exactly zero. Apply 25 N and friction supplies 5 N up the slope. Apply 35 N and it supplies 5 N down the slope. The block does not move for any force between 18 N and 42 N — a genuine window, not a single balance point.',
          }),
      ],
      now_you_try: {
        problem: 'A 10 kg block on a rough 30° incline has μ = 0.2. Take g = 10 m/s², sin30° = 0.5, cos30° = 0.866. Find the force along the slope needed to (a) just hold it, and (b) push it steadily up.',
        answer: '(a) $ \\approx 32.7 $ N  (b) $ \\approx 67.3 $ N',
        solution: '$ mg\\sin\\theta = 50 $ N, $ N = mg\\cos\\theta = 86.6 $ N, $ f_{\\max} = 0.2(86.6) = 17.3 $ N. (a) $ F = 50 - 17.3 = 32.7 $ N. (b) $ F = 50 + 17.3 = 67.3 $ N.',
      },
    }),
    b('step_solver', 5, {
      title: 'How fast can a car take a flat, unbanked bend?',
      problem: 'A car goes round a flat, unbanked circular bend of radius $ 40 $ m. The coefficient of friction between tyres and road is $ 0.5 $. Find the maximum speed at which the car can take the bend without skidding. Take $ g = 10 $ m/s².',
      intro: 'Chapter 3 established that circular motion needs a centre-directed acceleration. This asks the question that chapter could not: what actually supplies the force?',
      steps: [
        st('The car needs a centripetal force $ \\dfrac{mv^2}{r} $ pointing at the centre of the bend. On a flat road, the ONLY horizontal force available is friction from the tyres.',
          'This is the promise from Chapter 3 finally paid off — "some material force must supply it," and here that force is friction.', {
            check: {
              kind: 'mcq',
              prompt: 'What is the maximum centripetal force friction can supply here?',
              options: [
                '$ \\mu mg $, the limiting friction with $ N = mg $ on a flat road',
                '$ mg $, the car\'s full weight acting as the centripetal force',
                '$ \\mu mg\\cos\\theta $, reduced by the banking angle of the road',
                'Unlimited, since friction always adjusts to whatever is needed',
              ],
              answer_index: 0,
              feedback_right: 'Right — on a flat road $ N = mg $, so the friction ceiling is $ \\mu mg $. That is a hard limit, and it is what caps the speed.',
              feedback_wrong: 'On a flat (unbanked) road the normal force is just $ mg $, so the maximum friction available is $ \\mu mg $. Static friction is self-adjusting, but only up to that ceiling — it is not unlimited.',
            },
          }),
        st('At the limit: $ \\dfrac{mv_{\\max}^2}{r} = \\mu mg \\ \\Rightarrow\\ v_{\\max} = \\sqrt{\\mu r g} $ — and the mass cancels completely.',
          'A loaded truck and an empty hatchback have the same maximum cornering speed on the same road, which surprises most people.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ v_{\\max} = \\sqrt{0.5 \\times 40 \\times 10} = \\sqrt{200} $, in m/s, to two decimal places.',
              blank_answer: '14.14',
              feedback_right: 'Yes — about 14.14 m/s, roughly 51 km/h.',
              feedback_wrong: '$ v_{\\max} = \\sqrt{\\mu r g} = \\sqrt{0.5 \\times 40 \\times 10} = \\sqrt{200} = 14.14 $ m/s.',
            },
          }),
        st('$ v_{\\max} = \\sqrt{\\mu r g} \\approx 14.1\\ \\text{m/s} \\approx 51\\ \\text{km/h} $. Above this, no available friction can bend the car\'s path tightly enough, and it skids outward.',
          'Note this is a MAXIMUM, not a minimum — on a flat road there is no lower limit at all; you can crawl round as slowly as you like.', {
            why: 'Two consequences follow directly, and both match everyday experience. **Wet road:** $ \\mu $ drops, so $ v_{\\max} $ drops — the same corner taken at the same speed becomes a skid. **Tighter bend:** smaller $ r $, so smaller $ v_{\\max} $ — which is why sharp bends carry lower advisory limits than gentle ones. The remaining question, "can we do better than relying on friction at all?", is answered on the banked-roads page later in this chapter, where the road itself is tilted to help.',
          }),
      ],
      now_you_try: {
        problem: 'A car takes a flat bend of radius 90 m where μ = 0.4. Take g = 10 m/s². Find the maximum safe speed.',
        answer: '$ 18.97 $ m/s (about 68 km/h)',
        solution: '$ v_{\\max} = \\sqrt{\\mu r g} = \\sqrt{0.4 \\times 90 \\times 10} = \\sqrt{360} \\approx 18.97 $ m/s.',
      },
    }),
    b('inline_quiz', 6, {
      pass_threshold: 0.6,
      questions: [
        q('A block is held against a vertical wall by a horizontal push. The normal force from the wall equals:',
          ['The block\'s weight $ mg $, exactly as on a horizontal floor', 'The applied horizontal push F, with weight playing no part', '$ \\mu $ times the block\'s weight for these two surfaces', 'Zero, since the wall is vertical rather than horizontal'],
          1, 'Horizontal equilibrium sets $ N = F $. On a vertical wall the normal force is decided entirely by how hard you press — the weight is opposed by friction instead.', 2),
        q('The minimum horizontal force needed to hold a block of mass m against a vertical wall with coefficient μ is:',
          ['$ \\mu mg $, the limiting friction for the pair of surfaces', '$ mg/\\mu $, which grows large when μ becomes small', '$ mg $, simply matching the weight of the block itself', '$ \\mu mg/2 $, half the available limiting friction value'],
          1, 'Friction must support the weight: $ \\mu N = mg $ with $ N = F $, giving $ F = mg/\\mu $. As μ falls toward zero, this required force grows without limit.', 2),
        q('Several forces act on a block along a rough surface. To decide whether it slides, you should:',
          ['Compare each individual force separately against the friction ceiling', 'Combine them into one resultant, then compare that with the ceiling', 'Add up the magnitudes of all the forces arithmetically first', 'Compare only the largest single force with the friction ceiling'],
          1, 'Friction opposes the NET tendency to slide, so the forces along the surface must be combined as vectors into one resultant before comparing with $ \\mu N $ — otherwise both the verdict and the direction of motion can come out wrong.', 3),
        q('For a block on a rough incline steep enough to slide on its own, the force needed to push it steadily UP the slope, compared with the force needed just to hold it still, is:',
          ['Larger, because friction reverses and now opposes the upward motion', 'Smaller, because friction always helps whatever you are trying to do', 'Exactly the same, since friction has one fixed magnitude either way', 'Zero, because gravity supplies all the force needed going upward'],
          0, 'Holding it still has friction acting up the slope (helping you); pushing it up reverses friction to act down the slope (opposing you). The two answers differ by exactly $ 2f_{\\max} $.', 2),
        q('A car rounds a flat, unbanked bend. Its maximum safe speed $ \\sqrt{\\mu r g} $ does NOT depend on:',
          ['The mass of the car, which cancels out of the equation entirely', 'The coefficient of friction between the tyres and the road', 'The radius of the bend the car is attempting to go around', 'The value of g at the location where the car is driving'],
          0, 'Setting $ mv^2/r = \\mu mg $ cancels m from both sides, leaving $ v_{\\max} = \\sqrt{\\mu rg} $ — a loaded truck and an empty car share the same limit on the same bend.', 2),
      ],
    }),
    b('callout', 7, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- **On a vertical wall**, $ N $ is set by your push, not by weight; friction acts vertically and is the only thing holding the block up. $ F_{\\min} = mg/\\mu $.\n- **Combine forces along a surface into one resultant first**, then compare with the friction ceiling $ \\mu N $ — direction included.\n- **On a rough incline**, holding needs $ mg\\sin\\theta - f_{\\max} $; pushing up needs $ mg\\sin\\theta + f_{\\max} $. Friction switches sides between the two.\n- Between those two values there is a **whole window** of forces for which the block does not move at all.\n- **Flat bend:** $ v_{\\max} = \\sqrt{\\mu r g} $, independent of mass. Wet road or tighter bend both lower it.',
    }),
    b('practice_bank', 8, {
      title: 'You solve it',
      intro: 'Seven questions. On any vertical or tilted surface, work out the normal force from the geometry before touching friction — it is almost never just $ mg $.',
      sections: [
        {
          id: 'p9-ysi',
          title: 'Walls, Inclines & Minimum Forces',
          items: [
            num('p9-y1', 'A 4 kg block is held against a vertical wall by a horizontal force, with μ = 0.5. Take g = 10 m/s². Find the minimum force needed.',
              '$ 80 $ N',
              '$ F_{\\min} = mg/\\mu = 40/0.5 = 80 $ N — double the block\'s own 40 N weight.'),
            mcq('p9-y2', 'On a vertical wall, the friction force holding a block up acts:',
              ['Horizontally, in the same direction as the applied push', 'Vertically upward, along the face of the wall itself', 'Perpendicular to the wall, opposing the applied force', 'At 45° to the wall, splitting the difference between them'],
              1, 'Friction always acts along the contact surface. For a vertical wall, "along the surface" is vertical — which is exactly why it can oppose the weight.'),
            num('p9-y3', 'A 6 kg block sits on a rough 30° incline with μ = 0.2. Take g = 10 m/s², sin30° = 0.5, cos30° = 0.866. Find the force along the slope needed just to hold it in place.',
              '$ \\approx 19.6 $ N',
              '$ mg\\sin\\theta = 30 $ N, $ N = mg\\cos\\theta = 51.96 $ N, $ f_{\\max} = 0.2(51.96) = 10.4 $ N. Holding force $ = 30 - 10.4 = 19.6 $ N.'),
            num('p9-y4', 'A car takes a flat bend of radius 50 m with μ = 0.6. Take g = 10 m/s². Find the maximum speed without skidding.',
              '$ \\approx 17.32 $ m/s',
              '$ v_{\\max} = \\sqrt{\\mu rg} = \\sqrt{0.6 \\times 50 \\times 10} = \\sqrt{300} \\approx 17.32 $ m/s.'),
            mcq('p9-y5', 'The same car takes the same bend after rain has halved the coefficient of friction. Its maximum safe speed is now:',
              ['Half of what it was before the road became wet', '$ 1/\\sqrt{2} $ of what it was, about 71% of the dry-road value', 'Unchanged, since the car\'s mass has not changed at all', 'A quarter of what it was on the dry road surface'],
              1, 'Since $ v_{\\max} = \\sqrt{\\mu rg} $, halving μ multiplies the speed limit by $ \\sqrt{1/2} = 0.707 $ — a reduction, but less severe than halving.'),
            num('p9-y5b', 'A 2 kg block is pressed against a vertical wall with 30 N, μ = 0.5. A 5 N force is applied sideways along the wall. Take g = 10 m/s². Does the block move, and if so with what acceleration?',
              'Yes — it slides diagonally, at $ a \\approx 2.8 $ m/s²',
              '$ f_L = 0.5(30) = 15 $ N. Along the wall: weight 20 N down, applied 5 N sideways, resultant $ \\sqrt{400+25} = \\sqrt{425} \\approx 20.6 $ N. Since $ 20.6 > 15 $, it slides, with $ a = (20.6-15)/2 \\approx 2.8 $ m/s².'),
            mcq('p9-y6', 'A block on a rough incline needs 20 N to hold it still and 50 N to push it steadily up. The maximum friction force on it is:',
              ['$ 70 $ N, the sum of the two force values given', '$ 15 $ N, half the difference between the two values', '$ 30 $ N, the plain difference between the two values', '$ 35 $ N, the average of the two given values'],
              1, 'Holding needs $ mg\\sin\\theta - f $ and pushing up needs $ mg\\sin\\theta + f $, so the two differ by exactly $ 2f $. Here $ 50 - 20 = 30 = 2f $, giving $ f = 15 $ N.'),
          ],
        },
      ],
    }),
    b('text', 9, {
      markdown: 'Three pages of friction, and every single free body diagram was drawn by someone standing still on the ground. The next two pages ask what changes when the **observer themselves is accelerating** — inside a lift, a braking car, or on a sliding wedge — and introduce the one trick that makes those frames as easy to work in as the ground.',
    }),
  ],
};

// ── run ──────────────────────────────────────────────────────────────────────
withDb(async (db) => {
  const bookId = await ensureChapter(db);
  await upsertPages(db, bookId, [p7, p8, p9]);
  console.log('\n✅ Ch.4 Wave 2a done: p7–p9 (friction basics, pulling/pushing/stacked, walls/inclines/min-force)');
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
