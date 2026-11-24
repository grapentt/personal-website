import { defineScene, seg, fade, lerp, text, wrap, type, color, font, tex, dot, columnVector } from '@/stage/kit';
import type { Vec3 } from '@/stage/kit';
import { filmCamera, circle3, drawCircle3, arrow3d, TAU } from '../shared';

const IL = tex(String.raw`i_L = e_1\wedge e_2 + e_3\wedge e_4`, 'i_L = e₁∧e₂ + e₃∧e₄');
const JL = tex(String.raw`j_L = e_1\wedge e_3 + e_4\wedge e_2`, 'j_L = e₁∧e₃ + e₄∧e₂');
const KL = tex(String.raw`k_L = e_1\wedge e_4 + e_2\wedge e_3`, 'k_L = e₁∧e₄ + e₂∧e₃');
const GEN = tex(String.raw`n = a\, i_L + b\, j_L + c\, k_L, \qquad a^2 + b^2 + c^2 = 1, \qquad n^2 = -1`, 'n = a i_L + b j_L + c k_L,  n² = −1');
const EXP = tex(String.raw`e^{\theta n} = \cos\theta + \sin\theta\; n`, 'e^{θn} = cos θ + sin θ n');

/** The generator direction (a, b, c) and the angle over time. */
function stateAt(t: number) {
  const s = Math.max(0, t - 14);
  const dir: Vec3 = [Math.cos(0.5 * s) * Math.sin(1 + 0.3 * Math.sin(0.4 * s)), Math.sin(0.5 * s) * Math.sin(1 + 0.3 * Math.sin(0.4 * s)), Math.cos(1 + 0.3 * Math.sin(0.4 * s))];
  const theta = lerp(0.3, 1.1, seg(t, 20, 26)) + 0.4 * Math.sin(0.5 * Math.max(0, t - 26));
  return { dir, theta };
}

export default defineScene({
  name: 'Isoclinic rotations are points of S³',
  duration: 42,
  narration: [
    [0, 'Let us describe all left-isoclinic rotations at once. Their generators are built from three basic ones, i L, j L and k L, each turning two orthogonal planes together by a quarter.'],
    [13, 'A general generator is a combination a i L plus b j L plus c k L, with a squared plus b squared plus c squared equal to one: a direction, a point on an ordinary sphere. And just like the quarter turn J, it squares to minus one.'],
    [24, 'So exponentiating works exactly as in the plane: the rotation by theta is cos theta plus sin theta times the generator. Four numbers, cos theta and a, b, c times sin theta, and their squares add up to one.'],
    [34, 'Every left-isoclinic rotation is a point on the three-dimensional sphere in R four. The same is true for the right-isoclinic ones.'],
  ],
  header: { eyebrow: '09 · THE 3-SPHERE', title: 'A direction and an angle: four numbers of length one' },
  draw(ctx, t) {
    IL.draw(ctx, 100, 250, { size: 26, alpha: seg(t, 3, 4) });
    JL.draw(ctx, 100, 300, { size: 26, alpha: seg(t, 5, 6) });
    KL.draw(ctx, 100, 350, { size: 26, alpha: seg(t, 7, 8) });
    GEN.draw(ctx, 100, 430, { size: 24, alpha: seg(t, 14, 15) });
    EXP.draw(ctx, 100, 510, { size: 28, color: color.soft, alpha: seg(t, 24, 25) });

    const { dir, theta } = stateAt(t);
    // the sphere of directions
    const cam = filmCamera({ cx: 380, cy: 690, scale: 120, yaw: 0.5, pitch: 0.4 });
    const g = seg(t, 13, 14);
    if (g > 0.01) {
      for (const n of [[0, 0, 1], [1, 0, 0], [0, 1, 0]] as Vec3[]) drawCircle3(ctx, cam, circle3([0, 0, 0], n, 1, 80), { color: color.line, width: 1.3, alpha: g });
      const tip = arrow3d(ctx, cam, [0, 0, 0], dir, { color: color.gold, width: 3.4, head: 13, alpha: g });
      dot(ctx, tip.x, tip.y, 6, color.gold, g);
      text(ctx, '(a, b, c)', tip.x + 12, tip.y - 8, { ...type.math, size: 22, color: color.gold, alpha: g });
      text(ctx, 'the direction of the generator', 380, 860, { ...type.note, align: 'center', alpha: g });
    }
    // the angle dial
    const dial = seg(t, 24, 25);
    if (dial > 0.01) {
      const cx = 760;
      const cy = 690;
      ctx.save();
      ctx.globalAlpha = dial;
      ctx.strokeStyle = color.line;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, 70, 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = color.soft;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, 70, 0, -theta, true);
      ctx.stroke();
      ctx.restore();
      text(ctx, `θ = ${((theta * 180) / Math.PI).toFixed(0)}°`, cx, cy + 6, { font: font.mono, size: 18, color: color.soft, align: 'center', alpha: dial });
      text(ctx, 'the angle', cx, 860, { ...type.note, align: 'center', alpha: dial });
    }
    // the four numbers
    const q = [Math.cos(theta), dir[0] * Math.sin(theta), dir[1] * Math.sin(theta), dir[2] * Math.sin(theta)];
    const col = seg(t, 26, 27);
    columnVector(ctx, 1180, 290, [
      { symbol: 'cos θ', value: q[0], color: color.gold },
      { symbol: 'a sin θ', value: q[1], color: color.x },
      { symbol: 'b sin θ', value: q[2], color: color.y },
      { symbol: 'c sin θ', value: q[3], color: color.z },
    ], { width: 230, rowHeight: 50, size: 24, alpha: col });
    text(ctx, `length² = ${q.reduce((s, x) => s + x * x, 0).toFixed(3)}`, 1180, 520, { font: font.mono, size: 20, color: color.gold, align: 'center', alpha: col });
    wrap(ctx, 'Every left-isoclinic rotation is a point of the 3-sphere S³ ⊂ ℝ⁴. So is every right-isoclinic one.', 1000, 610, 520, 32, { ...type.display, size: 25, color: color.ink, alpha: fade(t, 34, 35, 41.4, 42) });
  },
});
