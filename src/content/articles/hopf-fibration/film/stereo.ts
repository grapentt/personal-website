// Stereographic projection of the ordinary sphere S² onto its equatorial plane, drawn in 3D:
// the lamp sits at the north pole N = (0, 0, 1), and σ(x, y, z) = (x, y) / (1 − z).
// Used by the "one dimension down" scene and the circles explorable.

import { color, polyline3, polygon3, rgba, dot, line, vec3 } from '@/stage/kit';
import type { Camera, Vec3 } from '@/stage/kit';
import { up } from './shared';

export const LAMP: Vec3 = [0, 0, 1];
export const PLANE_HALF = 2.6;

/** σ of a point of S², or null near the lamp / outside the square of the plane that is drawn. */
export function project2(p: Vec3, limit = PLANE_HALF): Vec3 | null {
  const w = 1 - p[2];
  if (w < 1e-6) return null;
  const x: Vec3 = [p[0] / w, p[1] / w, 0];
  return Math.max(Math.abs(x[0]), Math.abs(x[1])) > limit ? null : x;
}

/** The circle {x ∈ S² : n·x = d}, as n + 1 points (n unit, |d| < 1). */
export function sphereCircle(n: Vec3, d: number, count = 240): Vec3[] {
  const helper: Vec3 = Math.abs(n[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  const u = vec3.normalize(vec3.cross(n, helper));
  const v = vec3.cross(n, u);
  const rho = Math.sqrt(Math.max(0, 1 - d * d));
  return Array.from({ length: count + 1 }, (_, i) => {
    const s = (i / count) * 2 * Math.PI;
    return vec3.add(vec3.scale(n, d), vec3.add(vec3.scale(u, rho * Math.cos(s)), vec3.scale(v, rho * Math.sin(s))));
  });
}

/** The equatorial plane as a translucent square with a light grid. */
export function drawPlane(ctx: CanvasRenderingContext2D, cam: Camera, alpha = 1) {
  if (alpha <= 0.003) return;
  const h = PLANE_HALF;
  polygon3(ctx, cam, [up([-h, -h, 0]), up([h, -h, 0]), up([h, h, 0]), up([-h, h, 0])], { fill: rgba(color.soft, 0.06), stroke: rgba(color.soft, 0.35), alpha });
  for (let k = -2; k <= 2; k++) {
    polyline3(ctx, cam, [up([k, -h, 0]), up([k, h, 0])], { color: rgba(color.soft, 0.12), width: 1, alpha });
    polyline3(ctx, cam, [up([-h, k, 0]), up([h, k, 0])], { color: rgba(color.soft, 0.12), width: 1, alpha });
  }
}

/** The lamp at N: a glowing gold dot. */
export function drawLamp(ctx: CanvasRenderingContext2D, cam: Camera, alpha = 1) {
  if (alpha <= 0.003) return;
  const s = cam.project(up(LAMP));
  ctx.save();
  ctx.globalAlpha *= alpha;
  const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 42);
  g.addColorStop(0, 'rgba(242,207,99,0.55)');
  g.addColorStop(1, 'rgba(242,207,99,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(s.x, s.y, 42, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
  dot(ctx, s.x, s.y, 8, color.gold, alpha);
}

/** A ray from the lamp through p on the sphere down to its image on the plane. */
export function drawRay(ctx: CanvasRenderingContext2D, cam: Camera, p: Vec3, c: string, alpha = 1) {
  const img = project2(p, PLANE_HALF);
  if (!img || alpha <= 0.003) return;
  const a = cam.project(up(LAMP));
  const b = cam.project(up(img));
  line(ctx, a.x, a.y, b.x, b.y, { color: c, width: 1.4, alpha: alpha * 0.6, dash: [4, 5] });
  const s = cam.project(up(p));
  dot(ctx, s.x, s.y, 5, c, alpha);
  dot(ctx, b.x, b.y, 5, c, alpha);
}

/** The image of a curve on S² under σ, with the pen lifted where it runs off. */
export function drawImage(ctx: CanvasRenderingContext2D, cam: Camera, pts: Vec3[], c: string, { width = 3, alpha = 1, limit = PLANE_HALF } = {}) {
  polyline3(ctx, cam, pts.map((p) => {
    const x = project2(p, limit);
    return x ? up(x) : null;
  }), { color: c, width, alpha });
}
