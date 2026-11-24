// Simple 3D drawing through a camera: shaded parametric surfaces (painter's
// algorithm), polylines, and flat polygons such as tangent planes.

import { cross, sub, normalize, dot, Vec3 } from '../model/vec3';
import type { Camera, Projected } from '../model/camera';
import { hexToRgb } from './color';

const TO_LIGHT = normalize([0.4, 0.6, -0.7]); // view coordinates: towards the upper left front (screen right is −x)

export interface SurfaceOptions {
  nu?: number;
  nv?: number;
  u?: [number, number];
  v?: [number, number];
  color: (u: number, v: number) => string;
  alpha?: number | ((u: number, v: number) => number);
  ambient?: number;
  /** Draw only the quads for which this returns true (for cutaways). */
  visible?: (u: number, v: number) => boolean;
  /** Outline the quads (wireframe look) instead of the fill-matching stroke. */
  wire?: string;
}

interface Vertex {
  uu: number;
  vv: number;
  world: Vec3;
  screen: Projected;
}

/** Shaded surface p(u, v) over a grid. Colours must be hex strings. */
export function drawSurface(ctx: CanvasRenderingContext2D, cam: Camera, point: (u: number, v: number) => Vec3, { nu = 48, nv = 24, u = [0, 2 * Math.PI], v = [0, 2 * Math.PI], color, alpha = 1, ambient = 0.38, visible, wire }: SurfaceOptions) {
  const P: Vertex[][] = [];
  for (let i = 0; i <= nu; i++) {
    const row: Vertex[] = [];
    for (let j = 0; j <= nv; j++) {
      const uu = u[0] + ((u[1] - u[0]) * i) / nu;
      const vv = v[0] + ((v[1] - v[0]) * j) / nv;
      const world = point(uu, vv);
      row.push({ uu, vv, world, screen: cam.project(world) });
    }
    P.push(row);
  }

  const quads: { a: Vertex; b: Vertex; c: Vertex; d: Vertex; depth: number }[] = [];
  for (let i = 0; i < nu; i++) {
    for (let j = 0; j < nv; j++) {
      const a = P[i][j];
      const b = P[i + 1][j];
      const c = P[i + 1][j + 1];
      const d = P[i][j + 1];
      if (visible && !visible((a.uu + c.uu) / 2, (a.vv + c.vv) / 2)) continue;
      const depth = (a.screen.z + b.screen.z + c.screen.z + d.screen.z) / 4;
      quads.push({ a, b, c, d, depth });
    }
  }
  quads.sort((q, r) => r.depth - q.depth);

  ctx.save();
  const baseAlpha = ctx.globalAlpha;
  ctx.lineJoin = 'round';
  for (const { a, b, c, d } of quads) {
    let n = cam.rotate(normalize(cross(sub(c.world, a.world), sub(d.world, b.world))));
    if (n[2] > 0) n = [-n[0], -n[1], -n[2]]; // light both sides
    const shade = ambient + (1 - ambient) * Math.max(0, dot(n, TO_LIGHT));
    const um = (a.uu + c.uu) / 2;
    const vm = (a.vv + c.vv) / 2;
    const [r, g, bl] = hexToRgb(color(um, vm)).map((x) => Math.round(x * shade));
    const fill = `rgb(${r},${g},${bl})`;
    ctx.globalAlpha = baseAlpha * (typeof alpha === 'function' ? alpha(um, vm) : alpha);
    ctx.fillStyle = fill;
    ctx.strokeStyle = wire ?? fill;
    ctx.lineWidth = wire ? 0.6 : 0.8;
    ctx.beginPath();
    ctx.moveTo(a.screen.x, a.screen.y);
    ctx.lineTo(b.screen.x, b.screen.y);
    ctx.lineTo(c.screen.x, c.screen.y);
    ctx.lineTo(d.screen.x, d.screen.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

export interface Polyline3Options {
  color?: string;
  width?: number;
  alpha?: number;
  dash?: number[];
  /** Skip hidden segments: visible(i) → whether point i is drawn. */
  visible?: (i: number) => boolean;
  /** Draw only the first part (0 … 1). */
  progress?: number;
  /** Per-point colour; overrides `color`. */
  colorAt?: (i: number) => string;
  /** Per-point width multiplier (e.g. depth cue). */
  widthAt?: (i: number, p: Projected) => number;
}

/** Polyline through 3D points; null points lift the pen (for curves that run off to infinity). */
export function polyline3(ctx: CanvasRenderingContext2D, cam: Camera, points: (Vec3 | null)[], { color = '#ffffff', width = 2, alpha = 1, dash = [], visible, progress = 1, colorAt, widthAt }: Polyline3Options = {}) {
  if (alpha <= 0.003 || points.length < 2) return;
  const last = Math.max(1, Math.round((points.length - 1) * progress));
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.setLineDash(dash);
  if (colorAt || widthAt) {
    // per-segment styling
    let prev: Projected | null = null;
    for (let i = 0; i <= last; i++) {
      const w = points[i];
      if (w === null || (visible && !visible(i))) {
        prev = null;
        continue;
      }
      const p = cam.project(w);
      if (prev) {
        ctx.strokeStyle = colorAt ? colorAt(i) : color;
        ctx.lineWidth = widthAt ? width * widthAt(i, p) : width;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      prev = p;
    }
  } else {
    ctx.beginPath();
    let pen = false;
    for (let i = 0; i <= last; i++) {
      const w = points[i];
      if (w === null || (visible && !visible(i))) {
        pen = false;
        continue;
      }
      const p = cam.project(w);
      if (pen) ctx.lineTo(p.x, p.y);
      else ctx.moveTo(p.x, p.y);
      pen = true;
    }
    ctx.stroke();
  }
  ctx.restore();
}

/** Flat polygon through 3D points. */
export function polygon3(ctx: CanvasRenderingContext2D, cam: Camera, points: Vec3[], { fill, stroke, width = 1.5, alpha = 1 }: { fill?: string; stroke?: string; width?: number; alpha?: number } = {}) {
  if (alpha <= 0.003) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.beginPath();
  points.forEach((p, i) => {
    const s = cam.project(p);
    if (i) ctx.lineTo(s.x, s.y);
    else ctx.moveTo(s.x, s.y);
  });
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.stroke();
  }
  ctx.restore();
}

/** A sphere of radius r at the origin as a shaded surface (u = polar angle, v = azimuth). */
export function spherePoint(r: number) {
  return (u: number, v: number): Vec3 => [r * Math.sin(u) * Math.cos(v), r * Math.cos(u), r * Math.sin(u) * Math.sin(v)];
}
