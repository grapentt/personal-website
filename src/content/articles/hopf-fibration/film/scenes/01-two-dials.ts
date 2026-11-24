import { defineScene, seg, fade, lin, text, wrap, type, color, font, tex } from '@/stage/kit';
import { drawDials, VERTICAL } from '../shared';

const UNIT = tex(String.raw`q = w + x\,i + y\,j + z\,k, \qquad |q| = 1`, 'q = w + xi + yj + zk,  |q| = 1');
const LEFT = tex(String.raw`q \;\mapsto\; e^{i\theta} q, \qquad e^{i\theta} = \cos\theta + i\sin\theta`, 'q ↦ e^{iθ} q');
const SPLIT = tex(String.raw`q = z_1 + z_2\, j, \qquad z_1, z_2 \in \mathbb{C}, \qquad |z_1|^2 + |z_2|^2 = 1`, 'q = z₁ + z₂ j,  |z₁|² + |z₂|² = 1');
const FLOW = tex(String.raw`e^{i\theta} q = (e^{i\theta} z_1) + (e^{i\theta} z_2)\, j`, 'e^{iθ}q = (e^{iθ}z₁) + (e^{iθ}z₂) j');

// one point of S³: balance r1 = cos(0.55), r2 = sin(0.55), angles 0.5 and −0.9
const R1 = Math.cos(0.55);
const R2 = Math.sin(0.55);

export default defineScene({
  name: 'Where we left off',
  duration: 32,
  narration: [
    [0, 'Last time we met the unit quaternions: four numbers with length one, a point of the 3-sphere S³ in four-dimensional space.'],
    [8, 'Multiplying by e to the i theta from the left was a left-isoclinic rotation: it turns two orthogonal planes by the same angle at once.'],
    [15, 'Group the four coordinates into two complex numbers, z one and z two, one for each plane. A point of S³ is a pair of dials whose lengths satisfy one equation.'],
    [23, 'The isoclinic rotation turns both dials together. Every point of S³ travels around a circle. This film is about those circles.'],
  ],
  header: { eyebrow: '01 · WHERE WE LEFT OFF', title: 'A point of S³ is a pair of dials' },
  draw(ctx, t) {
    UNIT.draw(ctx, 100, 250, { size: 30, alpha: fade(t, 0.8, 1.8, 14, 15) });
    wrap(ctx, 'The unit quaternions form the 3-sphere S³ ⊂ ℝ⁴.', 100, 310, 620, 32, { ...type.body, alpha: fade(t, 1.6, 2.6, 14, 15) });
    LEFT.draw(ctx, 100, 410, { size: 30, alpha: fade(t, 8, 9, 14, 15) });
    wrap(ctx, 'is a left-isoclinic rotation: two orthogonal planes turn by the same angle θ at once.', 100, 470, 620, 32, { ...type.body, alpha: fade(t, 8.6, 9.6, 14, 15) });

    SPLIT.draw(ctx, 100, 250, { size: 28, alpha: seg(t, 15.2, 16.2) });
    wrap(ctx, 'One complex number for each of the two planes: z₁ = w + x i and z₂ = y + z i. Their lengths share one unit of length between them.', 100, 312, 600, 32, { ...type.body, alpha: seg(t, 16, 17) });
    FLOW.draw(ctx, 100, 450, { size: 28, alpha: seg(t, 23, 24) });
    wrap(ctx, 'Both dials turn together. Every point of S³ moves on a circle, and no two of these circles meet.', 100, 510, 600, 32, { ...type.body, alpha: seg(t, 23.6, 24.6) });
    text(ctx, 'What do these circles look like?', 100, 640, { ...type.display, size: 32, color: color.gold, alpha: seg(t, 27, 28) });

    // the dials: appear at 15 s, turn together from 22 s
    const theta = 2.2 * lin(t, 22.5, 31.5) * Math.PI;
    const state = { r1: R1, r2: R2, a1: 0.5 + theta, a2: -0.9 + theta };
    const a = seg(t, 15.5, 16.8);
    drawDials(ctx, { x: 1160, y: 470, size: 130, gap: 80, state, alpha: a, hand: VERTICAL });
    text(ctx, `|z₁| = ${R1.toFixed(2)}     |z₂| = ${R2.toFixed(2)}`, 1160, 680, { font: font.mono, size: 18, color: color.muted, align: 'center', alpha: a });
    text(ctx, `|z₁|² + |z₂|² = ${(R1 * R1 + R2 * R2).toFixed(2)}`, 1160, 712, { font: font.mono, size: 18, color: color.muted, align: 'center', alpha: a });
    text(ctx, `θ = ${((theta * 180) / Math.PI).toFixed(0)}°`, 1160, 760, { font: font.mono, size: 22, color: VERTICAL, align: 'center', alpha: seg(t, 22.5, 23.5) });
  },
});
