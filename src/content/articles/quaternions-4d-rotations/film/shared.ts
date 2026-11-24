// The visual language of the quaternion film: vectors of ℝ⁴ written as quaternions
// q = x₀ + x₁ i + x₂ j + x₃ k, i.e. (e₁, e₂, e₃, e₄) = (1, i, j, k) as in the article.
//
// The tesseract is shown by hiding the real direction 1: a point of ℝ⁴ is projected from
// an eye on the real axis onto the 3D space of i, j, k (perspective in the fourth direction),
// then drawn with an ordinary camera. Edge colours say which coordinate changes along the edge:
// 1 gold, i red, j green, k blue.

import { camera, color, polygon3, rgba, mix, text, font, dot, line, arrow, vec3, polyline3 } from '@/stage/kit';
import type { Camera, CameraOptions, Vec3, Projected } from '@/stage/kit';

export type Vec4 = [number, number, number, number];
export const TAU = 2 * Math.PI;
export const AXIS4 = ['1', 'i', 'j', 'k'];
export const AXIS4_COLOR = [color.gold, color.x, color.y, color.z];

/** Rotate the plane (1, i) by a and the plane (j, k) by b: the general double rotation in these planes. */
export const doubleRotation = (v: Vec4, a: number, b: number): Vec4 => [
  Math.cos(a) * v[0] - Math.sin(a) * v[1],
  Math.sin(a) * v[0] + Math.cos(a) * v[1],
  Math.cos(b) * v[2] - Math.sin(b) * v[3],
  Math.sin(b) * v[2] + Math.cos(b) * v[3],
];

/** The camera; a positive pitch means the eye is above the floor (as in the Hopf film). */
export const filmCamera = (o: CameraOptions = {}): Camera => {
  const c = { cx: 1080, cy: 500, scale: 120, yaw: 0.6, pitch: 0.35, focal: 9, ...o };
  return camera({ ...c, pitch: -c.pitch });
};

/** Display coordinates of a 3D vector (x, y, z): z points up on screen. */
export const up = (v: Vec3): Vec3 => [v[0], v[2], -v[1]];

/** Yaw/pitch offsets from a drag lens value (stage units). */
export const dragAngles = (drag: unknown, base: { yaw: number; pitch: number }) => {
  const [dx, dy] = (drag as [number, number] | undefined) ?? [0, 0];
  return { yaw: base.yaw - dx / 260, pitch: Math.max(-1.35, Math.min(1.35, base.pitch + dy / 260)) };
};

// ---- the tesseract ------------------------------------------------------------

export const TESSERACT: Vec4[] = Array.from({ length: 16 }, (_, n) => [0, 1, 2, 3].map((k) => ((n >> k) & 1 ? 1 : -1)) as Vec4);
/** Edges as [from, to, axis]: the two vertices differ in exactly one coordinate, `axis`. */
export const TESSERACT_EDGES: [number, number, number][] = [];
for (let a = 0; a < 16; a++) for (let k = 0; k < 4; k++) if (!((a >> k) & 1)) TESSERACT_EDGES.push([a, a | (1 << k), k]);

/** Project a point of ℝ⁴ to the 3D space of (i, j, k), looking from the eye at 1 = `eye`. */
export const project4 = (v: Vec4, eye = 3.2): Vec3 => {
  const s = (eye - 1) / (eye - v[0]);
  return [v[1] * s, v[2] * s, v[3] * s];
};

/**
 * The tesseract after the transformation `map` of ℝ⁴, projected and drawn edge by edge,
 * back to front, with a halo. `size` scales it in ℝ⁴.
 */
export function drawTesseract(ctx: CanvasRenderingContext2D, cam: Camera, map: (v: Vec4) => Vec4, { alpha = 1, size = 1, width = 3, highlight = -1 }: { alpha?: number; size?: number; width?: number; highlight?: number } = {}) {
  if (alpha <= 0.003) return;
  const pts = TESSERACT.map((v) => map(v.map((x) => x * size) as Vec4));
  const screen = pts.map((v) => cam.project(up(project4(v, 3.2 * size))));
  const edges = TESSERACT_EDGES.map(([a, b, k]) => ({ a: screen[a], b: screen[b], k, depth: (screen[a].z + screen[b].z) / 2, real: (pts[a][0] + pts[b][0]) / (2 * size) }));
  edges.sort((p, q) => q.depth - p.depth);
  ctx.save();
  ctx.lineCap = 'round';
  for (const e of edges) {
    const near = 0.5 + 0.5 * e.real; // 1 = nearer the eye in the fourth direction
    const w = width * (0.55 + 0.7 * near) * ((e.a.k + e.b.k) / 2);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color.bg;
    ctx.lineWidth = w + 4;
    ctx.beginPath();
    ctx.moveTo(e.a.x, e.a.y);
    ctx.lineTo(e.b.x, e.b.y);
    ctx.stroke();
    ctx.strokeStyle = mix(color.bg, AXIS4_COLOR[e.k], 0.45 + 0.55 * near);
    ctx.globalAlpha = alpha * (highlight >= 0 && highlight !== e.k ? 0.35 : 1);
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(e.a.x, e.a.y);
    ctx.lineTo(e.b.x, e.b.y);
    ctx.stroke();
  }
  ctx.restore();
}

/** A small key: which colour is which direction of ℝ⁴. */
export function axisKey(ctx: CanvasRenderingContext2D, x: number, y: number, alpha = 1) {
  if (alpha <= 0.003) return;
  AXIS4.forEach((name, k) => {
    line(ctx, x + k * 70, y, x + k * 70 + 26, y, { color: AXIS4_COLOR[k], width: 4, alpha });
    text(ctx, name, x + k * 70 + 34, y + 6, { font: font.display, italic: true, size: 20, color: AXIS4_COLOR[k], alpha });
  });
}

// ---- two planes side by side ------------------------------------------------------

/**
 * A vector of ℝ⁴ drawn as its two halves: (x₀, x₁) in the plane of 1 and i, (x₂, x₃) in the
 * plane of j and k. A double rotation turns the two planes independently.
 */
export function drawTwoPlanes(ctx: CanvasRenderingContext2D, { x, y, size = 110, gap = 90, v, angles = null, alpha = 1, tint = color.ink as string }: { x: number; y: number; size?: number; gap?: number; v: Vec4; angles?: [number, number] | null; alpha?: number; tint?: string }) {
  if (alpha <= 0.003) return;
  const planes: [number, number, number, string, string][] = [
    [x - size - gap / 2, v[0], v[1], '1', 'i'],
    [x + size + gap / 2, v[2], v[3], 'j', 'k'],
  ];
  ctx.save();
  ctx.globalAlpha *= alpha;
  planes.forEach(([cx, a, b, ex, ey], p) => {
    line(ctx, cx - size - 10, y, cx + size + 10, y, { color: color.line, width: 1.2 });
    line(ctx, cx, y - size - 10, cx, y + size + 10, { color: color.line, width: 1.2 });
    text(ctx, ex, cx + size + 16, y + 6, { font: font.display, italic: true, size: 22, color: AXIS4_COLOR[p * 2] });
    text(ctx, ey, cx + 8, y - size - 14, { font: font.display, italic: true, size: 22, color: AXIS4_COLOR[p * 2 + 1] });
    ctx.save();
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = color.dim;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(cx, y, size * 0.8, 0, TAU);
    ctx.stroke();
    ctx.restore();
    const hx = cx + size * 0.8 * a;
    const hy = y - size * 0.8 * b;
    if (Math.hypot(a, b) > 0.02) arrow(ctx, cx, y, hx, hy, { color: tint, width: 3.4, head: 13 });
    else dot(ctx, cx, y, 5, tint);
    if (angles) {
      const th = Math.atan2(Math.sin(angles[p]), Math.cos(angles[p])); // shown in (−180°, 180°]
      if (Math.abs(th) > 0.01) {
        ctx.save();
        ctx.strokeStyle = rgba(color.gold, 0.9);
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(cx, y, size * 0.32, 0, -th, th > 0);
        ctx.stroke();
        ctx.restore();
      }
      text(ctx, `θ${p ? '₂' : '₁'} = ${((th * 180) / Math.PI).toFixed(0)}°`, cx, y + size + 44, { font: font.mono, size: 18, color: color.gold, align: 'center' });
    }
  });
  ctx.restore();
}

// ---- a cube for rotations of 3D space ------------------------------------------------

const CUBE_FACES: { n: Vec3; tint: string }[] = [
  { n: [1, 0, 0], tint: '#e8786e' }, { n: [-1, 0, 0], tint: '#8a3f3a' },
  { n: [0, 1, 0], tint: '#86d08f' }, { n: [0, -1, 0], tint: '#3f6e45' },
  { n: [0, 0, 1], tint: '#7ea6f2' }, { n: [0, 0, -1], tint: '#3c5486' },
];

/** A cube with coloured faces, rotated by R (a map of ℝ³), drawn back to front. */
export function drawCube(ctx: CanvasRenderingContext2D, cam: Camera, R: (v: Vec3) => Vec3, { size = 1, alpha = 1, center = [0, 0, 0] as Vec3 } = {}) {
  if (alpha <= 0.003) return;
  const faces = CUBE_FACES.map(({ n, tint }) => {
    const helper: Vec3 = Math.abs(n[0]) > 0.5 ? [0, 1, 0] : [1, 0, 0];
    const u = vec3.cross(n, helper);
    const w = vec3.cross(n, u);
    const corners = [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(([a, b]) => vec3.add(center, R(vec3.scale(vec3.add(n, vec3.add(vec3.scale(u, a), vec3.scale(w, b))), size))));
    const c = vec3.add(center, R(vec3.scale(n, size)));
    return { corners, depth: cam.project(up(c)).z, facing: cam.rotate(up(R(n)))[2] < 0, tint };
  });
  faces.sort((a, b) => b.depth - a.depth);
  for (const f of faces) {
    polygon3(ctx, cam, f.corners.map(up), { fill: rgba(f.tint, f.facing ? 0.92 : 0.25), stroke: rgba(color.bg, 0.9), width: 2, alpha });
  }
}

/** An arrow in 3D from `from` along `delta` (maths coordinates). */
export function arrow3d(ctx: CanvasRenderingContext2D, cam: Camera, from: Vec3, delta: Vec3, o: { color?: string; width?: number; head?: number; alpha?: number; dash?: number[] } = {}): Projected {
  const a = cam.project(up(from));
  const b = cam.project(up(vec3.add(from, delta)));
  arrow(ctx, a.x, a.y, b.x, b.y, o);
  return b;
}

/** A circle in 3D (maths coordinates): centre c, unit normal n, radius r. */
export function circle3(c: Vec3, n: Vec3, r: number, count = 96, from = 0, to = TAU): Vec3[] {
  const helper: Vec3 = Math.abs(n[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  const u = vec3.normalize(vec3.cross(n, helper));
  const w = vec3.cross(n, u);
  return Array.from({ length: count + 1 }, (_, i) => {
    const s = from + ((to - from) * i) / count;
    return vec3.add(c, vec3.add(vec3.scale(u, r * Math.cos(s)), vec3.scale(w, r * Math.sin(s))));
  });
}

export const drawCircle3 = (ctx: CanvasRenderingContext2D, cam: Camera, pts: Vec3[], o: { color?: string; width?: number; alpha?: number; dash?: number[] } = {}) =>
  polyline3(ctx, cam, pts.map(up), o);

// ---- the plane, for the 2D scenes ---------------------------------------------------------

/** Maps plane coordinates to stage coordinates for a plane drawn at (cx, cy) with `unit` px per unit. */
export const plane = (cx: number, cy: number, unit: number) => ({
  X: (x: number) => cx + x * unit,
  Y: (y: number) => cy - y * unit,
  P: (x: number, y: number): [number, number] => [cx + x * unit, cy - y * unit],
  cx,
  cy,
  unit,
});

/** A light grid with axes. */
export function drawGrid(ctx: CanvasRenderingContext2D, g: ReturnType<typeof plane>, extent = 3, alpha = 1, map?: (x: number, y: number) => [number, number]) {
  if (alpha <= 0.003) return;
  const f = map ?? ((x: number, y: number): [number, number] => [x, y]);
  ctx.save();
  ctx.globalAlpha *= alpha;
  for (let k = -extent; k <= extent; k++) {
    for (const vertical of [true, false]) {
      ctx.strokeStyle = k === 0 ? color.muted : color.line;
      ctx.lineWidth = k === 0 ? 1.8 : 1.1;
      ctx.beginPath();
      for (let s = 0; s <= 60; s++) {
        const u = -extent + (2 * extent * s) / 60;
        const [x, y] = vertical ? f(k, u) : f(u, k);
        if (s) ctx.lineTo(g.X(x), g.Y(y));
        else ctx.moveTo(g.X(x), g.Y(y));
      }
      ctx.stroke();
    }
  }
  ctx.restore();
}
