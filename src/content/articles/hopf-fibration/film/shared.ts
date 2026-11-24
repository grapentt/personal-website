// The visual language of the Hopf film, shared by every scene and explorable.
//
// Mathematics happens in the conventions of src/stage/model/hopf.ts (z is the axis of
// symmetry, north pole of S² = (0, 0, 1)). The camera has y pointing up, so everything is
// shown through up(): (x, y, z) ↦ (x, z, −y), a rotation (not a reflection), so orientations
// on screen are the true ones.
//
// Colour carries meaning: a fibre has the colour of its base point on S² (hue = longitude,
// lightness = latitude), so the globe and the projected picture can be read side by side.
// Gold = the fibre direction (vertical), cyan = horizontal.

import {
  camera, color, drawSurface, hopf, polyline3, rgba, text, font, dot, ring as circleRing, mix, line,
} from '@/stage/kit';
import type { Camera, CameraOptions, Vec3, Projected, TextStyle } from '@/stage/kit';

export const VERTICAL = color.gold;
export const HORIZONTAL = color.soft;
export const TAU = 2 * Math.PI;

/** World coordinates for display: the maths' z-axis points up on screen. */
export const up = (v: Vec3): Vec3 => [v[0], v[2], -v[1]];

// ---- colours ----------------------------------------------------------------

function hslToHex(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h * 12) % 12;
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/** The colour of the fibre over p ∈ S² (hex): hue from the longitude, lighter towards the north. */
export function fibreColor(p: Vec3): string {
  const { polar, azimuth } = hopf.sphericalCoordinates(p);
  const hue = (((azimuth / TAU) % 1) + 1.08) % 1;
  return hslToHex(hue, 0.72, 0.7 - 0.2 * (polar / Math.PI));
}

// ---- cameras ----------------------------------------------------------------

/**
 * The engine's camera puts the eye below the floor for a positive pitch. In this film a positive
 * `pitch` means the eye is that far ABOVE the floor (so the north pole tips towards the viewer).
 */
const above = (o: CameraOptions): Camera => camera({ ...o, pitch: -(o.pitch ?? 0) });

/** Camera for the base sphere S² (the "globe"), usually on the left of the stage. */
export const globeCamera = (o: CameraOptions = {}): Camera => above({ cx: 330, cy: 500, scale: 190, yaw: 0.6, pitch: 0.38, focal: 10, ...o });

/** Camera for the stereographic picture of S³ in R³, usually on the right. */
export const spaceCamera = (o: CameraOptions = {}): Camera => above({ cx: 1060, cy: 500, scale: 118, yaw: 0.55, pitch: 0.42, focal: 9, ...o });

/** Any other camera of this film, with the same meaning of pitch. */
export const filmCamera = (o: CameraOptions = {}): Camera => above(o);

/** Yaw/pitch offsets from a drag lens value (stage units). */
export const dragAngles = (drag: unknown, base: { yaw: number; pitch: number }) => {
  const [dx, dy] = (drag as [number, number] | undefined) ?? [0, 0];
  return { yaw: base.yaw - dx / 260, pitch: Math.max(-1.35, Math.min(1.35, base.pitch + dy / 260)) };
};

// ---- the globe S² -------------------------------------------------------------

/** Is the point p of the unit sphere on the side facing the camera? */
export const facing = (cam: Camera, p: Vec3) => cam.rotate(up(p))[2] < 0.02;

const sphereSurface = (u: number, v: number): Vec3 => up(hopf.spherePoint(u, v));

/** The base sphere: shaded, with a light grid of latitudes and longitudes, and N/S marks. */
export function drawGlobe(ctx: CanvasRenderingContext2D, cam: Camera, { alpha = 1, grid = 1, poles = 1, tint = '#1d2c4c' }: { alpha?: number; grid?: number; poles?: number; tint?: string } = {}) {
  if (alpha <= 0.003) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  drawSurface(ctx, cam, sphereSurface, { nu: 28, nv: 40, u: [0, Math.PI], v: [0, TAU], color: () => tint, ambient: 0.5 });
  if (grid > 0) {
    const gridColor = rgba(color.muted, 0.3 * grid);
    for (let k = 1; k < 6; k++) drawGlobeCurve(ctx, cam, hopf.latitudeLoop((k * Math.PI) / 6, 96), { color: gridColor, width: 1, back: 0 });
    for (let k = 0; k < 12; k++) {
      const az = (k * TAU) / 12;
      const meridian = Array.from({ length: 49 }, (_, i) => hopf.spherePoint((i * Math.PI) / 48, az));
      drawGlobeCurve(ctx, cam, meridian, { color: gridColor, width: 1, back: 0 });
    }
  }
  if (poles > 0) {
    const n = cam.project(up([0, 0, 1.12]));
    text(ctx, 'N', n.x, n.y, { font: font.mono, size: 15, color: color.muted, align: 'center', baseline: 'middle', alpha: poles });
  }
  ctx.restore();
}

/** A curve on the globe: solid where it faces the camera, faint and dashed behind. */
export function drawGlobeCurve(ctx: CanvasRenderingContext2D, cam: Camera, pts: Vec3[], { color: c = color.ink, width = 2.5, alpha = 1, back = 0.3, progress = 1 }: { color?: string; width?: number; alpha?: number; back?: number; progress?: number } = {}) {
  const world = pts.map(up);
  if (back > 0) polyline3(ctx, cam, world, { color: c, width: width * 0.7, alpha: alpha * back, dash: [3, 5], visible: (i) => !facing(cam, pts[i]), progress });
  polyline3(ctx, cam, world, { color: c, width, alpha, visible: (i) => facing(cam, pts[i]), progress });
}

/** A marked point on the globe; smaller and dimmer when it is behind the sphere. */
export function globePoint(ctx: CanvasRenderingContext2D, cam: Camera, p: Vec3, c: string, { r = 7, alpha = 1, halo = true } = {}): Projected {
  const s = cam.project(up(p));
  const front = facing(cam, p);
  const a = alpha * (front ? 1 : 0.35);
  if (halo && front) dot(ctx, s.x, s.y, r + 3, color.bg, a);
  dot(ctx, s.x, s.y, front ? r : r * 0.7, c, a);
  return s;
}

// ---- fibres in R³ -------------------------------------------------------------

export interface FibreSpec {
  /** Base point on S². */
  p: Vec3;
  color?: string;
  width?: number;
  alpha?: number;
  /** Draw only the first part of the fibre, 0 … 1, starting at fibre angle theta0. */
  progress?: number;
  theta0?: number;
  samples?: number;
  /** Keep only the points (in maths coordinates) for which this is true: for cutaways. */
  keep?: (x: Vec3) => boolean;
}

interface Segment {
  a: Projected;
  b: Projected;
  depth: number;
  color: string;
  width: number;
  alpha: number;
}

/**
 * The stereographic images of the fibres over the given base points, with all their segments
 * sorted back to front and drawn with a dark halo, so that crossings read as over and under.
 * Points farther than `limit` from the origin are dropped (the fibre through the lamp runs off).
 */
export function drawFibres(ctx: CanvasRenderingContext2D, cam: Camera, fibres: FibreSpec[], { limit = 7, halo = true, depthCue = 0.55 } = {}) {
  const segments: Segment[] = [];
  for (const f of fibres) {
    const alpha = f.alpha ?? 1;
    if (alpha <= 0.003) continue;
    const n = f.samples ?? 96;
    const progress = f.progress ?? 1;
    if (progress <= 0) continue;
    const last = Math.max(1, Math.round(n * progress));
    const c = f.color ?? fibreColor(f.p);
    let prev: Projected | null = null;
    for (let i = 0; i <= last; i++) {
      const x = hopf.stereographic(hopf.fibrePoint(f.p, (f.theta0 ?? 0) + (TAU * i * progress) / last));
      if (!x || Math.hypot(x[0], x[1], x[2]) > limit || (f.keep && !f.keep(x))) {
        prev = null;
        continue;
      }
      const s = cam.project(up(x));
      if (prev) segments.push({ a: prev, b: s, depth: (prev.z + s.z) / 2, color: c, width: f.width ?? 2.6, alpha });
      prev = s;
    }
  }
  if (!segments.length) return;
  let zMin = Infinity;
  let zMax = -Infinity;
  for (const s of segments) {
    zMin = Math.min(zMin, s.depth);
    zMax = Math.max(zMax, s.depth);
  }
  const span = Math.max(1e-6, zMax - zMin);
  segments.sort((p, q) => q.depth - p.depth);
  ctx.save();
  ctx.lineCap = 'round';
  const base = ctx.globalAlpha;
  for (const s of segments) {
    const near = 1 - (s.depth - zMin) / span; // 1 = nearest
    const k = (s.a.k + s.b.k) / 2;
    const w = s.width * k * (0.75 + 0.45 * near);
    if (halo) {
      // a shortened, square-ended halo: it cuts across other fibres but not into this fibre's own joints
      const hx = (s.b.x - s.a.x) * 0.2;
      const hy = (s.b.y - s.a.y) * 0.2;
      ctx.globalAlpha = base * s.alpha;
      ctx.strokeStyle = color.bg;
      ctx.lineCap = 'butt';
      ctx.lineWidth = w + 4;
      ctx.beginPath();
      ctx.moveTo(s.a.x + hx, s.a.y + hy);
      ctx.lineTo(s.b.x - hx, s.b.y - hy);
      ctx.stroke();
      ctx.lineCap = 'round';
    }
    ctx.globalAlpha = base * s.alpha;
    ctx.strokeStyle = depthCue > 0 ? mix(color.bg, s.color, 1 - depthCue * (1 - near)) : s.color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(s.a.x, s.a.y);
    ctx.lineTo(s.b.x, s.b.y);
    ctx.stroke();
  }
  ctx.restore();
}

/** Screen position of the point of the fibre over p at fibre angle θ (null if it is at infinity). */
export function fibrePointOnScreen(cam: Camera, p: Vec3, theta: number, limit = 7): Projected | null {
  const x = hopf.stereographic(hopf.fibrePoint(p, theta));
  if (!x || Math.hypot(x[0], x[1], x[2]) > limit) return null;
  return cam.project(up(x));
}

/** The point of R³ (display coordinates) of a point of S³, or null at the lamp. */
export const s3ToWorld = (q: hopf.S3Point, limit = 7): Vec3 | null => {
  const x = hopf.stereographic(q);
  return x && Math.hypot(x[0], x[1], x[2]) <= limit ? up(x) : null;
};

/** The torus of all fibres over the latitude ϑ, translucent, coloured by base point. */
export function drawHopfTorus(ctx: CanvasRenderingContext2D, cam: Camera, polar: number, { alpha = 0.3, nu = 56, nv = 28, ambient = 0.45, keep }: { alpha?: number; nu?: number; nv?: number; ambient?: number; keep?: (x: Vec3) => boolean } = {}) {
  if (alpha <= 0.003) return;
  const f = hopf.hopfTorusPoint(polar);
  ctx.save();
  ctx.globalAlpha *= alpha;
  drawSurface(ctx, cam, (u, v) => up(f(u, v)), {
    nu,
    nv,
    u: [0, TAU],
    v: [0, TAU],
    color: (_, lambda) => fibreColor(hopf.spherePoint(polar, lambda)),
    ambient,
    visible: keep ? (u, v) => keep(f(u, v)) : undefined,
  });
  ctx.restore();
}

/** Faint coordinate axes of R³ with labels; z (up) is the axis of symmetry. */
export function drawAxes(ctx: CanvasRenderingContext2D, cam: Camera, { alpha = 0.5, length = 2.6 } = {}) {
  if (alpha <= 0.003) return;
  const axes: [Vec3, string][] = [[[length, 0, 0], 'x'], [[0, length, 0], 'y'], [[0, 0, length], 'z']];
  for (const [v, name] of axes) {
    const a = cam.project(up([-v[0], -v[1], -v[2]]));
    const b = cam.project(up(v));
    line(ctx, a.x, a.y, b.x, b.y, { color: color.line, width: 1.2, alpha });
    text(ctx, name, b.x + 8, b.y - 6, { font: font.display, italic: true, size: 20, color: color.muted, alpha });
  }
}

// ---- S³ as two dials ----------------------------------------------------------

export interface DialsState {
  /** |z1| and |z2| with r1² + r2² = 1. */
  r1: number;
  r2: number;
  /** Arguments of z1 and z2. */
  a1: number;
  a2: number;
}

/** The dials of the point of S³ over p at fibre angle θ. */
export function dialsOf(p: Vec3, theta = 0): DialsState {
  const q = hopf.fibrePoint(p, theta);
  return { r1: Math.hypot(q[0], q[1]), r2: Math.hypot(q[2], q[3]), a1: Math.atan2(q[1], q[0]), a2: Math.atan2(q[3], q[2]) };
}

/**
 * A point of S³ ⊂ C² drawn as two complex planes ("dials") side by side: z₁ = r₁e^{iα},
 * z₂ = r₂e^{iβ}, with r₁² + r₂² = 1. The unit circle of each plane is drawn dashed.
 */
export function drawDials(ctx: CanvasRenderingContext2D, { x, y, size = 110, gap = 70, state, alpha = 1, hand = color.ink as string, label = true }: { x: number; y: number; size?: number; gap?: number; state: DialsState; alpha?: number; hand?: string; label?: boolean }) {
  if (alpha <= 0.003) return;
  const planes: [number, number, number, string][] = [[x - size - gap / 2, state.r1, state.a1, 'z₁'], [x + size + gap / 2, state.r2, state.a2, 'z₂']];
  ctx.save();
  ctx.globalAlpha *= alpha;
  for (const [cx, r, a, name] of planes) {
    line(ctx, cx - size - 12, y, cx + size + 12, y, { color: color.line, width: 1 });
    line(ctx, cx, y - size - 12, cx, y + size + 12, { color: color.line, width: 1 });
    ctx.save();
    ctx.setLineDash([4, 6]);
    circleRing(ctx, cx, y, size, color.dim, 1, 1.4);
    ctx.restore();
    circleRing(ctx, cx, y, size * r, rgba(hand, 0.35), 1, 1.2);
    const hx = cx + size * r * Math.cos(a);
    const hy = y - size * r * Math.sin(a);
    line(ctx, cx, y, hx, hy, { color: hand, width: 3 });
    dot(ctx, hx, hy, 7, hand);
    if (label) {
      const style: TextStyle = { font: font.display, italic: true, size: 26, color: color.ink };
      text(ctx, name, cx - size, y - size - 10, style);
    }
  }
  ctx.restore();
}

// ---- interaction and panels -------------------------------------------------------

/**
 * The point of the unit globe under a stage point, or null if the click misses the sphere.
 * Inverts the perspective camera on the front of the sphere (a few fixed-point steps).
 */
export function globePick(cam: Camera, sx: number, sy: number): Vec3 | null {
  let k = 1;
  let view: Vec3 = [0, 0, 0];
  for (let i = 0; i < 6; i++) {
    const X = (cam.cx - sx) / (cam.scale * k); // screen right is −x in view coordinates
    const Y = (cam.cy - sy) / (cam.scale * k);
    const r2 = X * X + Y * Y;
    if (r2 > 1) return null;
    view = [X, Y, -Math.sqrt(1 - r2)];
    k = cam.focal / (cam.focal + view[2]);
  }
  const w = cam.unrotate(view); // display coordinates; undo up(): (x, y, z) = (w0, −w2, w1)
  return [w[0], -w[2], w[1]];
}

/** A rounded panel of label / value rows in mono, values right-aligned; `accent` rows are gold. */
export function panel(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, rows: { label: string; value: string; color?: string }[], { alpha = 1, title = '', rowHeight = 32 } = {}) {
  if (alpha <= 0.003) return;
  const height = rows.length * rowHeight + (title ? 46 : 18) + 12;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = 'rgba(17,24,40,0.88)';
  ctx.strokeStyle = rgba(color.line, 1);
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 12);
  ctx.fill();
  ctx.stroke();
  let yy = y + 30;
  if (title) {
    text(ctx, title.toUpperCase(), x + 20, yy, { font: font.mono, size: 13, color: color.muted, tracking: 1.5 });
    yy += 34;
  } else yy += 8;
  for (const row of rows) {
    text(ctx, row.label, x + 20, yy, { font: font.mono, size: 16, color: color.muted });
    text(ctx, row.value, x + width - 20, yy, { font: font.mono, size: 17, color: row.color ?? color.ink, align: 'right' });
    yy += rowHeight;
  }
  ctx.restore();
}

/** Base points spread evenly over a latitude circle. */
export const ring = (polar: number, count: number, offset = 0): Vec3[] =>
  Array.from({ length: count }, (_, k) => hopf.spherePoint(polar, offset + (TAU * k) / count));

/** A deterministic spread of base points over the whole sphere (Fibonacci lattice), avoiding the south pole. */
export const spread = (count: number, maxPolar = 2.7): Vec3[] =>
  Array.from({ length: count }, (_, k) => {
    const u = (k + 0.5) / count;
    const polar = Math.acos(1 - 2 * u) * (maxPolar / Math.PI);
    return hopf.spherePoint(polar, k * 2.399963);
  });
