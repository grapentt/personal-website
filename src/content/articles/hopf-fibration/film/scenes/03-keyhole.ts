import { defineScene, seg, fade, text, wrap, type, color, tex, drawSurface, hopf, polyline3 } from '@/stage/kit';
import type { Vec3 } from '@/stage/kit';
import { up, spaceCamera, drawAxes, TAU } from '../shared';

const SIGMA = tex(String.raw`\sigma(x_0, x_1, x_2, x_3) = \frac{(x_0,\, x_1,\, x_2)}{1 - x_3}`, 'σ(x₀, x₁, x₂, x₃) = (x₀, x₁, x₂) / (1 − x₃)');
// The 2-spheres x₃ = h of S³ project to spheres about the origin of radius √((1 + h)/(1 − h)).
const LEVELS = [-0.6, 0, 0.55];
const radius = (h: number) => Math.sqrt((1 + h) / (1 - h));
const TINTS = ['#2b5d7a', '#3c4d77', '#6a4f7a'];
const LABELS = ['x₃ = −0.6', 'x₃ = 0: the equator', 'x₃ = 0.55'];

// three great circles of S³ (unit quaternions a cos s + b sin s with a ⟂ b), seen as circles in ℝ³
const GREAT: [hopf.S3Point, hopf.S3Point][] = [
  [[0.8, 0, 0.6, 0], [0, 0.6, 0, 0.8]],
  [[0.3, -0.7, 0.2, -0.62], [0.7, 0.4, 0.5, -0.31]],
  [[0, 0.5, -0.5, -0.71], [0.9, -0.2, -0.3, 0.24]],
];
const greatCircle = ([a, b]: [hopf.S3Point, hopf.S3Point]) => {
  const n = Math.hypot(...b);
  const bb = b.map((v) => v / n) as hopf.S3Point;
  return Array.from({ length: 241 }, (_, i) => {
    const s = (i / 240) * TAU;
    const q = a.map((v, k) => v * Math.cos(s) + bb[k] * Math.sin(s)) as hopf.S3Point;
    const x = hopf.stereographic(q);
    return x && Math.hypot(...x) < 8 ? up(x) : null;
  });
};
const sphereAt = (r: number) => (u: number, v: number): Vec3 => [r * Math.sin(u) * Math.cos(v), r * Math.cos(u), r * Math.sin(u) * Math.sin(v)];

export default defineScene({
  name: 'S³ through the keyhole',
  duration: 30,
  narration: [
    [0, 'One dimension up, the same recipe. Put the lamp at the north pole of S³ and project onto the three-dimensional equatorial space: our room.'],
    [9, 'The equator of S³, a 2-sphere, stays put as the unit sphere. The southern half fills the inside of the ball, the northern half everything outside, and the lamp sits at infinity.'],
    [19, 'Again circles go to circles. A great circle of S³ shows up as a circle in the room, or as a straight line if it passes through the lamp.'],
  ],
  header: { eyebrow: '02 · STEREOGRAPHIC PROJECTION', title: 'The 3-sphere, projected into the room' },
  draw(ctx, t) {
    const cam = spaceCamera({ cx: 560, cy: 520, scale: 120, yaw: 0.4 + 0.015 * t, pitch: 0.36 });
    drawAxes(ctx, cam, { alpha: 0.4 * seg(t, 0.5, 1.5), length: 2.8 });
    LEVELS.forEach((h, k) => {
      const a = seg(t, 9 + 2 * k, 10.5 + 2 * k) * (1 - 0.65 * seg(t, 19, 20.5));
      if (a <= 0.003) return;
      ctx.save();
      ctx.globalAlpha = 0.28 * a;
      drawSurface(ctx, cam, sphereAt(radius(h)), { nu: 18, nv: 30, u: [0, Math.PI], v: [0, TAU], color: () => TINTS[k], ambient: 0.6 });
      ctx.restore();
      const s = cam.project([radius(h) * 0.72, radius(h) * 0.72, 0]);
      text(ctx, LABELS[k], s.x + 10, s.y, { ...type.note, color: color.ink, alpha: a });
    });
    GREAT.forEach((g, k) => polyline3(ctx, cam, greatCircle(g), { color: [color.gold, color.soft, color.rose][k], width: 3, alpha: seg(t, 20 + 1.5 * k, 21.5 + 1.5 * k), progress: seg(t, 20 + 1.5 * k, 23 + 1.5 * k) }));

    const x0 = 1080;
    SIGMA.draw(ctx, x0, 260, { size: 32, alpha: seg(t, 1, 2) });
    wrap(ctx, 'The lamp N = (0, 0, 0, 1) goes to infinity. Everything else lands somewhere in ℝ³.', x0, 340, 450, 31, { ...type.body, size: 21, alpha: seg(t, 2.5, 3.5) });
    wrap(ctx, 'The 2-spheres x₃ = h of S³ become spheres around the origin: inside the unit sphere the southern half (h < 0), outside the northern half (h > 0).', x0, 450, 450, 31, { ...type.body, size: 21, alpha: seg(t, 10, 11) });
    wrap(ctx, 'Great circles of S³ become circles, or lines through ∞.', x0, 620, 450, 31, { ...type.body, size: 21, color: color.gold, alpha: seg(t, 21, 22) });
    text(ctx, 'south pole (0, 0, 0, −1) ↦ origin', x0, 760, { ...type.note, alpha: fade(t, 12, 13, 29, 30) });
  },
});
