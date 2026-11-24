import { defineScene, seg, fade, lerp, text, wrap, type, color, arrow, tex } from '@/stage/kit';
import { plane, drawGrid } from '../shared';

const G = plane(470, 520, 82);
const A = [[1.25, 0.55], [0.25, 0.95]]; // a linear map: columns are the images of e₁ and e₂
const ROT = (55 * Math.PI) / 180;
const LINEAR = tex(String.raw`T(a\,e_1 + b\,e_2) = a\,T(e_1) + b\,T(e_2)`, 'T(a e₁ + b e₂) = a T(e₁) + b T(e₂)');

/** The map at time t: identity → warp → identity → linear → identity → rotation. */
function mapAt(t: number) {
  const warp = seg(t, 2, 5) - seg(t, 9, 11);
  const lin = seg(t, 13, 16) - seg(t, 20, 22);
  const rot = ROT * seg(t, 24, 27);
  return (x: number, y: number): [number, number] => {
    // nonlinear
    let u = x + warp * 0.35 * Math.sin(1.2 * y);
    let v = y + warp * 0.35 * Math.sin(1.1 * x + 0.5);
    // linear
    const lu = lerp(u, A[0][0] * u + A[0][1] * v, lin);
    const lv = lerp(v, A[1][0] * u + A[1][1] * v, lin);
    u = lu;
    v = lv;
    // rotation
    return [Math.cos(rot) * u - Math.sin(rot) * v, Math.sin(rot) * u + Math.cos(rot) * v];
  };
}

export default defineScene({
  name: 'Symmetries of the plane',
  duration: 36,
  narration: [
    [0, 'Now the symmetries of space itself, starting with the plane. We could bend and stretch the plane any way we like, but that is far too much freedom: there is no structure left to study.'],
    [12, 'So keep the origin fixed, keep lines straight, and keep parallel lines parallel. These are the linear maps. A linear map is completely determined by where it sends the two basis vectors.'],
    [23, 'Ask for more: keep all lengths and angles, and keep the orientation too. What is left are the rotations, and they are what this film is about.'],
  ],
  header: { eyebrow: '03 · SYMMETRIES OF SPACE', title: 'From anything goes to rotations' },
  draw(ctx, t) {
    const f = mapAt(t);
    drawGrid(ctx, G, 4, seg(t, 0, 1), f);
    // the images of e₁ and e₂
    const [ax, ay] = f(1, 0);
    const [bx, by] = f(0, 1);
    const shown = seg(t, 12.5, 13.5);
    arrow(ctx, G.X(0), G.Y(0), G.X(ax), G.Y(ay), { color: color.x, width: 4, head: 14, alpha: shown });
    arrow(ctx, G.X(0), G.Y(0), G.X(bx), G.Y(by), { color: color.y, width: 4, head: 14, alpha: shown });
    text(ctx, 'T(e₁)', G.X(ax) + 10, G.Y(ay) + 22, { ...type.math, size: 22, color: color.x, alpha: shown });
    text(ctx, 'T(e₂)', G.X(bx) + 10, G.Y(by) - 10, { ...type.math, size: 22, color: color.y, alpha: shown });

    const x0 = 960;
    const step = (label: string, body: string, y: number, a: number, accent: string) => {
      text(ctx, label, x0, y, { ...type.display, size: 26, color: accent, alpha: a });
      wrap(ctx, body, x0, y + 36, 560, 30, { ...type.body, size: 20, alpha: a });
    };
    step('Anything goes', 'Bend and stretch at will: too general to say anything useful.', 260, fade(t, 2, 3, 11, 12) + 0.35 * seg(t, 12, 13), color.muted);
    step('Linear maps', 'Origin fixed, straight lines straight, parallel lines parallel.', 400, seg(t, 13, 14), color.ink);
    LINEAR.draw(ctx, x0, 520, { size: 24, alpha: seg(t, 16, 17) });
    step('Rotations', 'Lengths, angles and orientation kept as well.', 610, seg(t, 24, 25), color.gold);
  },
});
