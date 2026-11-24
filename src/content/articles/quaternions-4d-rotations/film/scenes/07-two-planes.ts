import { defineScene, seg, fade, text, wrap, type, color, quaternion } from '@/stage/kit';
import { filmCamera, drawTesseract, drawTwoPlanes, doubleRotation, axisKey, Vec4 } from '../shared';

const V0 = quaternion.normalize([0.75, 0.35, 0.45, 0.32]) as Vec4;
/** θ₁ and θ₂ over time: a single rotation first, then a double rotation. */
function anglesAt(t: number): [number, number] {
  if (t < 17) return [1.6 * seg(t, 5, 13), 0];
  const s = Math.max(0, t - 19);
  return [1.6 + 0.55 * s * seg(t, 19, 20), 0.32 * s * seg(t, 19, 20)];
}

export default defineScene({
  name: 'Two planes at once',
  duration: 42,
  narration: [
    [0, 'Four dimensions. Write a point of R four as a quaternion, with coordinates along 1, i, j and k, and split it into two halves: the plane of 1 and i, and the plane of j and k. These two planes are at right angles to each other.'],
    [12, 'That is the new phenomenon: in four dimensions the plane at right angles to a plane is not a line, but another plane. A rotation in the first plane leaves the whole second plane fixed. We call it a single rotation.'],
    [24, 'But nothing stops us from turning both planes at once, by two different angles. This is a double rotation. And in fact every rotation of four-dimensional space is a double rotation in some pair of orthogonal planes.'],
    [35, 'On the right: a tesseract, the four-dimensional cube, projected into our space and turned by the same rotations.'],
  ],
  header: { eyebrow: '07 · ROTATIONS IN 4D', title: 'Two planes, at right angles' },
  draw(ctx, t) {
    const [a, b] = anglesAt(t);
    const v = doubleRotation(V0, a, b);
    drawTwoPlanes(ctx, { x: 400, y: 420, size: 105, gap: 80, v, angles: [a, b], alpha: seg(t, 0.5, 1.5), tint: color.soft });
    const cam = filmCamera({ cx: 1180, cy: 470, scale: 125, yaw: 0.55, pitch: 0.38 });
    drawTesseract(ctx, cam, (p) => doubleRotation(p, a, b), { alpha: seg(t, 1, 2), width: 3 });
    axisKey(ctx, 1000, 820, seg(t, 35, 36));

    wrap(ctx, 'A single rotation turns one plane and keeps the other plane fixed.', 100, 680, 620, 32, { ...type.body, alpha: fade(t, 13, 14, 23, 24) });
    wrap(ctx, 'A double rotation turns both, by θ₁ and θ₂. Every rotation of ℝ⁴ is of this kind.', 100, 680, 620, 32, { ...type.body, color: color.gold, alpha: seg(t, 25, 26) });
    text(ctx, 'plane of 1 and i', 400 - 105 - 40, 600, { ...type.note, align: 'center', alpha: seg(t, 2, 3) });
    text(ctx, 'plane of j and k', 400 + 105 + 40, 600, { ...type.note, align: 'center', alpha: seg(t, 2, 3) });
  },
});
