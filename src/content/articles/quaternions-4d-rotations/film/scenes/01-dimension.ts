import { defineScene, seg, fade, text, wrap, type, color, font, line, dot, tex } from '@/stage/kit';
import { filmCamera, up, arrow3d } from '../shared';
import type { Vec3 } from '@/stage/kit';

const RN = tex(String.raw`(x_1, x_2, \dots, x_n) \in \mathbb{R}^n`, '(x₁, x₂, …, xₙ) ∈ ℝⁿ');
const fmt = (v: number) => (v < 0 ? `−${Math.abs(v).toFixed(1)}` : v.toFixed(1));

export default defineScene({
  name: 'What is a dimension?',
  duration: 26,
  narration: [
    [0, 'A dimension is a direction you can move in, independently of the others. On a line, one number says where you are.'],
    [6, 'In a plane you need two numbers, in space three. A point of n-dimensional space is a list of n numbers: we call that space R n.'],
    [16, 'Four dimensions are just four numbers. We cannot picture them directly, but we can compute with them exactly as in three. And by looking at their symmetries, we can learn to see them.'],
  ],
  header: { eyebrow: '01 · DIMENSION', title: 'One number, two numbers, three numbers…' },
  draw(ctx, t) {
    // a point that wanders, so the coordinates change
    const s = 0.6 * t;
    const p: Vec3 = [1.2 * Math.cos(s), 1.0 * Math.sin(1.3 * s), 0.9 * Math.sin(0.7 * s + 1)];
    const cols = [250, 700, 1180];
    const a1 = seg(t, 0.4, 1.2);
    const a2 = seg(t, 6, 7);
    const a3 = seg(t, 9, 10);

    // the line
    line(ctx, cols[0] - 160, 470, cols[0] + 160, 470, { color: color.muted, width: 2, alpha: a1 });
    for (let k = -2; k <= 2; k++) line(ctx, cols[0] + 70 * k, 462, cols[0] + 70 * k, 478, { color: color.muted, width: 1.5, alpha: a1 });
    dot(ctx, cols[0] + 70 * p[0], 470, 8, color.gold, a1);
    text(ctx, `x = ${fmt(p[0])}`, cols[0], 540, { font: font.mono, size: 20, align: 'center', color: color.gold, alpha: a1 });
    text(ctx, 'a line: ℝ¹', cols[0], 600, { ...type.note, align: 'center', alpha: a1 });

    // the plane
    ctx.save();
    ctx.globalAlpha = a2;
    for (let k = -2; k <= 2; k++) {
      line(ctx, cols[1] - 150, 470 + 60 * k, cols[1] + 150, 470 + 60 * k, { color: k ? color.line : color.muted, width: k ? 1 : 1.8 });
      line(ctx, cols[1] + 60 * k, 320, cols[1] + 60 * k, 620, { color: k ? color.line : color.muted, width: k ? 1 : 1.8 });
    }
    ctx.restore();
    dot(ctx, cols[1] + 60 * p[0], 470 - 60 * p[1], 8, color.gold, a2);
    text(ctx, `(${fmt(p[0])}, ${fmt(p[1])})`, cols[1], 680, { font: font.mono, size: 20, align: 'center', color: color.gold, alpha: a2 });
    text(ctx, 'a plane: ℝ²', cols[1], 730, { ...type.note, align: 'center', alpha: a2 });

    // space
    const cam = filmCamera({ cx: cols[2], cy: 470, scale: 85, yaw: 0.6, pitch: 0.4 });
    if (a3 > 0.01) {
      ctx.save();
      ctx.globalAlpha = a3;
      ([[1, 0, 0], [0, 1, 0], [0, 0, 1]] as Vec3[]).forEach((e, k) => arrow3d(ctx, cam, [0, 0, 0], e.map((x) => 1.8 * x) as Vec3, { color: [color.x, color.y, color.z][k], width: 2.4, head: 11 }));
      const foot = cam.project(up([p[0], p[1], 0]));
      const top = cam.project(up(p));
      const o = cam.project(up([0, 0, 0]));
      line(ctx, o.x, o.y, foot.x, foot.y, { color: color.dim, dash: [4, 5] });
      line(ctx, foot.x, foot.y, top.x, top.y, { color: color.dim, dash: [4, 5] });
      dot(ctx, top.x, top.y, 8, color.gold);
      ctx.restore();
      text(ctx, `(${fmt(p[0])}, ${fmt(p[1])}, ${fmt(p[2])})`, cols[2], 680, { font: font.mono, size: 20, align: 'center', color: color.gold, alpha: a3 });
      text(ctx, 'space: ℝ³', cols[2], 730, { ...type.note, align: 'center', alpha: a3 });
    }

    RN.draw(ctx, 800, 810, { size: 34, align: 'center', alpha: fade(t, 13, 14, 25.4, 26) });
    wrap(ctx, 'ℝ⁴: four numbers. No picture, but the same arithmetic.', 1180, 800, 380, 30, { ...type.body, size: 21, color: color.gold, alpha: seg(t, 17, 18) });
  },
});
