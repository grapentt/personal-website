import { defineScene, seg, fade, text, wrap, type, color, hopf, polygon3, rgba, ring as circle, dot, vec3 } from '@/stage/kit';
import type { Vec3 } from '@/stage/kit';
import { spaceCamera, drawFibres, fibreColor, spread, up, panel, TAU } from '../shared';

const A = hopf.spherePoint(0.75, 0.4);
const B = hopf.spherePoint(1.95, 2.7);
const MORE = spread(9, 2.4).slice(2, 7);
const CIRCLE_A = hopf.fibreCircle(A)!;
const DISC_A: Vec3[] = Array.from({ length: 96 }, (_, i) => {
  const s = (i / 96) * TAU;
  return up(vec3.add(CIRCLE_A.center, vec3.add(vec3.scale(CIRCLE_A.u, CIRCLE_A.radius * Math.cos(s)), vec3.scale(CIRCLE_A.v, CIRCLE_A.radius * Math.sin(s)))));
});

const sample = (p: Vec3, n: number) => hopf.fibreSamples(p, n, 0, 1e9).map((x) => x as Vec3);
const LINKING = hopf.linkingNumber(sample(A, 360), sample(B, 360));

/** Where fibre B pierces the flat disc spanned by fibre A (maths coordinates). */
const PIERCE: Vec3[] = (() => {
  const pts = sample(B, 720);
  const out: Vec3[] = [];
  const side = (x: Vec3) => vec3.dot(vec3.sub(x, CIRCLE_A.center), CIRCLE_A.normal);
  for (let i = 0; i < pts.length - 1; i++) {
    const s0 = side(pts[i]);
    const s1 = side(pts[i + 1]);
    if (s0 * s1 < 0) {
      const x = vec3.add(pts[i], vec3.scale(vec3.sub(pts[i + 1], pts[i]), s0 / (s0 - s1)));
      if (vec3.length(vec3.sub(x, CIRCLE_A.center)) < CIRCLE_A.radius) out.push(x);
    }
  }
  return out;
})();

export default defineScene({
  name: 'Two fibres link',
  duration: 32,
  narration: [
    [0, 'Now two fibres. Span the first by a soap film, a flat disc.'],
    [6, 'The second fibre passes through that disc exactly once. You cannot pull the two circles apart without cutting one: they are linked, like two links of a chain.'],
    [17, 'Turn the picture: it is the same from every side. And it is true for any two fibres, whichever two points of S³ you start from.'],
  ],
  header: { eyebrow: '03 · TWO CIRCLES', title: 'Any two fibres are linked, exactly once' },
  draw(ctx, t) {
    const cam = spaceCamera({ cx: 820, cy: 520, scale: 140, yaw: 0.2 + 0.9 * seg(t, 16, 26) + 0.01 * t, pitch: 0.35 + 0.25 * seg(t, 16, 26) });
    const disc = fade(t, 3, 4.5, 15.5, 17);
    polygon3(ctx, cam, DISC_A, { fill: rgba(fibreColor(A), 0.16), stroke: rgba(fibreColor(A), 0.4), alpha: disc });
    drawFibres(ctx, cam, [
      { p: A, width: 4, progress: seg(t, 0.5, 3) },
      { p: B, width: 4, progress: seg(t, 5.5, 9) },
      ...MORE.map((p, k) => ({ p, width: 2.6, alpha: seg(t, 23 + 0.8 * k, 24 + 0.8 * k) })),
    ], { limit: 6 });
    const pierce = fade(t, 9.5, 10.5, 15.5, 17);
    for (const x of PIERCE) {
      const s = cam.project(up(x));
      circle(ctx, s.x, s.y, 16, color.gold, pierce, 2.5);
      dot(ctx, s.x, s.y, 4, color.gold, pierce);
    }

    const x0 = 1180;
    wrap(ctx, 'Fibre B crosses the disc of fibre A once.', x0, 260, 360, 30, { ...type.body, size: 21, alpha: fade(t, 10, 11, 15.5, 16.5) });
    panel(ctx, x0, 360, 360, [
      { label: 'crossings of the disc', value: String(PIERCE.length) },
      { label: 'linking number', value: LINKING.toFixed(3), color: color.gold },
    ], { title: 'measured', alpha: seg(t, 12, 13) });
    text(ctx, 'Gauss’s linking integral, computed', x0, 520, { ...type.note, size: 13, alpha: seg(t, 12.5, 13.5) });
    wrap(ctx, 'Every two fibres are linked exactly once.', x0, 620, 360, 32, { ...type.display, size: 26, color: color.gold, alpha: seg(t, 25, 26) });
  },
});
