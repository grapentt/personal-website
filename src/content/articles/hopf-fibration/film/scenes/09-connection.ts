import { defineScene, seg, fade, text, wrap, type, tex, hopf, polygon3, polyline3, rgba, vec3, arrow } from '@/stage/kit';
import type { Vec3 } from '@/stage/kit';
import { spaceCamera, drawFibres, up, VERTICAL, HORIZONTAL, TAU, s3ToWorld } from '../shared';

const P = hopf.spherePoint(1.0, 0.6);
const NEIGHBOURS = Array.from({ length: 8 }, (_, k) => {
  const r = 0.32;
  const c = Math.cos(r);
  const s = Math.sin(r);
  // points at angular distance r around P
  const u = vec3.normalize(vec3.cross(P, [0, 0, 1]));
  const v = vec3.cross(P, u);
  const a = (k * TAU) / 8;
  return vec3.normalize(vec3.add(vec3.scale(P, c), vec3.add(vec3.scale(u, s * Math.cos(a)), vec3.scale(v, s * Math.sin(a)))));
});
const DISCS = 9;
const at = (theta: number): Vec3 => hopf.stereographic(hopf.fibrePoint(P, theta)) as Vec3;
/** A small disc at right angles to the projected fibre at fibre angle θ (display coordinates). */
function disc(theta: number, radius = 0.26): Vec3[] {
  const x = at(theta);
  const tangent = vec3.normalize(vec3.sub(at(theta + 1e-3), at(theta - 1e-3)));
  const helper: Vec3 = Math.abs(tangent[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  const u = vec3.normalize(vec3.cross(tangent, helper));
  const v = vec3.cross(tangent, u);
  return Array.from({ length: 36 }, (_, i) => {
    const s = (i / 36) * TAU;
    return up(vec3.add(x, vec3.add(vec3.scale(u, radius * Math.cos(s)), vec3.scale(v, radius * Math.sin(s)))));
  });
}
// a short horizontal path: the horizontal lift of a great-circle arc leaving P
const ARC = hopf.geodesicArc(P, hopf.spherePoint(1.55, 1.5), 200);
const LIFT = hopf.horizontalLift(ARC, 0.9).points.map((q) => s3ToWorld(q, 6));

const VERT = tex(String.raw`V_q = \mathbb{R}\, iq \quad\text{(along the fibre)}`, 'V_q = ℝ iq (along the fibre)');
const HOR = tex(String.raw`H_q = \{\, v \in T_qS^3 : \langle v,\, iq\rangle = 0 \,\}`, 'H_q = { v ∈ T_qS³ : ⟨v, iq⟩ = 0 }');
const FORM = tex(String.raw`A_q(v) = \langle iq,\, v\rangle, \qquad H_q = \ker A_q`, 'A_q(v) = ⟨iq, v⟩,  H_q = ker A_q');

export default defineScene({
  name: 'Perpendicular to the fibre',
  duration: 34,
  narration: [
    [0, 'At every point of S³ there are now two kinds of directions. One is the direction along the fibre, i times q: moving that way only turns the common phase. We call it vertical.'],
    [10, 'At right angles to it lies a plane of horizontal directions. The round metric of S³ picks this plane for us; this choice is a connection.'],
    [19, 'Stereographic projection preserves angles, so in the room the horizontal planes are simply the planes at right angles to each circle.'],
    [26, 'Moving horizontally means moving from fibre to fibre without any motion along them.'],
  ],
  header: { eyebrow: '06 · CONNECTION', title: 'Horizontal means: at right angles to the circle' },
  draw(ctx, t) {
    const cam = spaceCamera({ cx: 720, cy: 520, scale: 150, yaw: 0.25 + 0.012 * t, pitch: 0.4 });
    drawFibres(ctx, cam, [
      ...NEIGHBOURS.map((p) => ({ p, width: 1.8, alpha: 0.5 * seg(t, 19, 21) })),
      { p: P, color: VERTICAL, width: 4.2, alpha: seg(t, 0.4, 1.6) },
    ], { limit: 5 });

    // horizontal discs along the fibre, one after another
    for (let k = 0; k < DISCS; k++) {
      const a = seg(t, 10.5 + 0.5 * k, 11.3 + 0.5 * k);
      polygon3(ctx, cam, disc((k * TAU) / DISCS + 0.3), { fill: rgba(HORIZONTAL, 0.2), stroke: rgba(HORIZONTAL, 0.85), width: 1.6, alpha: a });
    }
    // the vertical arrow at one point
    const theta0 = 0.3;
    const x0 = at(theta0);
    const tangent = vec3.scale(vec3.normalize(vec3.sub(at(theta0 + 1e-3), at(theta0 - 1e-3))), 0.7);
    const a0 = cam.project(up(x0));
    const a1 = cam.project(up(vec3.add(x0, tangent)));
    arrow(ctx, a0.x, a0.y, a1.x, a1.y, { color: VERTICAL, width: 4, head: 16, alpha: fade(t, 3, 4, 33, 34) });
    text(ctx, 'iq', a1.x + 10, a1.y - 6, { ...type.math, size: 26, color: VERTICAL, alpha: fade(t, 3.5, 4.5, 33, 34) });

    // a horizontal path: crosses the fibres at right angles
    polyline3(ctx, cam, LIFT, { color: HORIZONTAL, width: 4, alpha: seg(t, 26, 27), progress: seg(t, 26.5, 31) });

    const x = 1150;
    VERT.draw(ctx, x, 260, { size: 24, color: VERTICAL, alpha: seg(t, 2, 3) });
    HOR.draw(ctx, x, 330, { size: 24, color: HORIZONTAL, alpha: seg(t, 10, 11) });
    FORM.draw(ctx, x, 410, { size: 24, alpha: seg(t, 14, 15) });
    wrap(ctx, 'The connection form A measures how much of a velocity is motion along the fibre. Horizontal = no motion along the fibre.', x, 470, 400, 30, { ...type.body, size: 20, alpha: seg(t, 15, 16) });
    wrap(ctx, 'Angles survive the projection: in the room, horizontal planes are the planes at right angles to the circles.', x, 610, 400, 30, { ...type.body, size: 20, alpha: seg(t, 19.5, 20.5) });
    wrap(ctx, 'A horizontal path crosses every fibre it meets at a right angle.', x, 740, 400, 30, { ...type.body, size: 20, color: HORIZONTAL, alpha: seg(t, 27, 28) });
  },
});
