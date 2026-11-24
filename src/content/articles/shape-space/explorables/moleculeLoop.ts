// Explorable: a loop of shapes with zero angular momentum. The molecule runs an elliptical
// loop in the (twist a, bend b) plane,
//   (a, b) = s · (1.5 cos 2πτ, ±1.5 · aspect · sin 2πτ)   (− runs it backwards),
// and the mechanical connection (total angular momentum L = 0) fixes its orientation:
//   ω = −I(q)⁻¹ Σ m_i q_i × q̇_i,   Ṙ = R [ω]×   (zeroMomentumRotations, 800 midpoint steps).
// After one loop the shape is back but the molecule has turned by the holonomy R(1); k loops
// give R(1)^k, the reversed loop R(1)⁻¹. For small loops the angle of R(1) is the curvature
// times the enclosed area π a b, so angle / area settles as the loop shrinks.

import {
  defineScene, slider, choice, toggle, drag, text, type, font, color, line, dot, arrow, roundRect, readout, rgba, clamp,
  drawMolecule, moleculeCamera, polyline3, arrow3, rotation, vec3, formatNumber,
} from '@/stage/kit';
import type { Mat3, Vec3, Camera } from '@/stage/kit';
import { VERTICAL, HORIZONTAL, MASSES, LOOP, loopHolonomy, loopConfiguration, loopRotation, loopCoordinates, loopArea, atomsOf } from '../film/shared';
import type { LoopHolonomy, LoopShape, Point2 } from '../film/shared';

/** Loops per second at speed 1 (the film runs one loop in 7 s). */
const LOOPS_PER_SECOND = 1 / 7;
const STEPS = 800;
const MOLECULE = { cx: 470, cy: 500, scale: 150 };
const PLANE = { x: 980, y: 150, w: 540, h: 250, perRadian: 54 };
const PANEL = { x: 960, y: 432, w: 560, row: 28 };
const TABLE = { x: 960, y: 696, w: 560, row: 25 };
const SHRINK = [1, 1 / 2, 1 / 4, 1 / 8];

const DEG = Math.PI / 180;

// ---- holonomy, memoised on the rounded inputs ---------------------------------------

interface Loop {
  s: number;
  shape: LoopShape;
  holonomy: LoopHolonomy;
  /** |π a b| s², rad². */
  area: number;
}

const cache = new Map<string, Loop>();

/** The loop of size s, aspect b/a and direction, with its rotations along the way (computed once per input). */
function loopFor(size: number, aspect: number, reverse: boolean): Loop {
  const s = Number(size.toFixed(6));
  const ratio = Number(aspect.toFixed(6));
  const key = `${s}|${ratio}|${reverse ? 'r' : 'f'}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const b = LOOP.a * ratio;
  const shape: LoopShape = { a: LOOP.a, b: reverse ? -b : b };
  const loop = { s, shape, holonomy: loopHolonomy(s, STEPS, shape), area: Math.abs(loopArea(s, shape)) };
  if (cache.size > 64) cache.clear();
  cache.set(key, loop);
  return loop;
}

/** Unit axis of a rotation (right-handed with its angle), or null for (almost) no rotation. */
function axisOf(R: Mat3): Vec3 | null {
  const angle = rotation.rotationAngle(R);
  if (angle < 1e-7) return null;
  const skew: Vec3 = [R[2][1] - R[1][2], R[0][2] - R[2][0], R[1][0] - R[0][1]];
  if (angle < 2.6) return vec3.normalize(skew);
  // near 180° the skew part vanishes: read the axis off k kᵀ = (sym R − cos θ I) / (1 − cos θ)
  const c = Math.cos(angle);
  const K = [0, 1, 2].map((i) => [0, 1, 2].map((j) => ((R[i][j] + R[j][i]) / 2 - (i === j ? c : 0)) / (1 - c)) as Vec3);
  const j = [0, 1, 2].reduce((best, k) => (K[k][k] > K[best][best] ? k : best), 0);
  const axis = vec3.normalize(K[j]);
  return vec3.dot(axis, skew) < 0 ? vec3.scale(axis, -1) : axis;
}

const degreesOf = (R: Mat3) => rotation.rotationAngle(R) / DEG;

/** Enough decimals to show three significant digits of a small positive number. */
const significant = (v: number, digits = 3) => v.toFixed(clamp(digits - 1 - Math.floor(Math.log10(Math.max(Math.abs(v), 1e-12))), 2, 6));

const centreOfMass = (X: number[]): Vec3 => {
  const total = MASSES.reduce((a, m) => a + m, 0);
  return atomsOf(X).reduce((acc, p, i) => vec3.add(acc, vec3.scale(p, MASSES[i] / total)), [0, 0, 0] as Vec3);
};

// ---- the scene ----------------------------------------------------------------------

export default defineScene({
  name: 'A loop of shapes',
  duration: 600,
  controls: {
    size: slider('Loop size s', { min: 0.1, max: 1.4, step: 0.05, value: 1, lens: true, digits: 2 }),
    aspect: slider('Aspect bend / twist', { min: 0.1, max: 1, step: 0.01, value: 1 / 3, lens: true, digits: 2 }),
    direction: choice('Direction', { forward: 'forward', reverse: 'reverse' }, { value: 'forward', lens: true }),
    speed: slider('Speed', { min: 0, max: 2, step: 0.05, value: 1, lens: true, digits: 2, unit: '×' }),
    ghost: toggle('Ghost of the start', { value: true, lens: true }),
    shrink: toggle('Shrink test', { value: true, lens: true }),
    view: drag('Drag the molecule to turn the view', { region: [60, 150, 900, 880] }),
  },

  draw(ctx, t, { input }) {
    const [dx, dy] = input.view as [number, number];
    const reverse = input.direction === 'reverse';
    const loop = loopFor(input.size as number, input.aspect as number, reverse);
    const { s, shape, holonomy } = loop;
    const tau = (input.speed as number) * LOOPS_PER_SECOND * t;

    text(ctx, 'EXPLORABLE · SHAPE-SPACE HOLONOMY', 80, 70, type.eyebrow);
    text(ctx, 'A loop of shapes', 80, 114, { ...type.display, size: 34 });
    text(ctx, 'total angular momentum L = 0 at every instant', 80, 148, { font: font.mono, size: 16, color: HORIZONTAL });

    // the molecule, its starting outline, and the rotation it has picked up
    const cam = moleculeCamera({ ...MOLECULE, yaw: 0.5 + dx / 260, pitch: clamp(0.28 - dy / 260, -1.45, 1.45) });
    const X = loopConfiguration(holonomy, tau, s, shape);
    if (input.ghost) drawMolecule(ctx, loopConfiguration(holonomy, 0, s, shape), cam, { ghost: color.muted, opacity: 0.6, labels: 0 });
    drawMolecule(ctx, X, cam);
    const R = loopRotation(holonomy, tau);
    drawRotation(ctx, cam, centreOfMass(X), R);
    const caption = input.ghost ? 'outline: the molecule at the start  ·  drag to turn the view' : 'drag to turn the view';
    text(ctx, caption, MOLECULE.cx, 862, { ...type.note, align: 'center' });

    drawPlane(ctx, loop, tau);
    drawReadouts(ctx, loop, tau, R);
    if (input.shrink) drawShrinkTable(ctx, input.aspect as number, reverse, s);
  },
});

/** Gold: the rotation since the start, as an axis through the centre of mass and an arc of its angle. */
function drawRotation(ctx: CanvasRenderingContext2D, cam: Camera, centre: Vec3, R: Mat3) {
  const angle = rotation.rotationAngle(R);
  const axis = axisOf(R);
  if (!axis || angle < 0.5 * DEG) return;
  arrow3(ctx, cam, vec3.add(centre, vec3.scale(axis, -1.1)), vec3.scale(axis, 2.3), { color: VERTICAL, width: 3, head: 14 });
  const u = rotation.perpendicular(axis);
  const v = vec3.cross(axis, u);
  const radius = 0.65;
  const samples = 48;
  const arc = Array.from({ length: samples + 1 }, (_, k): Vec3 => {
    const phi = (angle * k) / samples;
    return vec3.add(centre, vec3.add(vec3.scale(u, radius * Math.cos(phi)), vec3.scale(v, radius * Math.sin(phi))));
  });
  polyline3(ctx, cam, arc, { color: VERTICAL, width: 3.5 });
  const end = cam.project(arc[samples]);
  dot(ctx, end.x, end.y, 5, VERTICAL);
}

/** The (twist a, bend b) plane: the loop, its enclosed area, and where the shape is now. */
function drawPlane(ctx: CanvasRenderingContext2D, { s, shape }: Loop, tau: number) {
  const { x, y, w, h, perRadian } = PLANE;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const toPlane = ([a, b]: Point2): [number, number] => [cx + a * perRadian, cy - b * perRadian];

  text(ctx, 'path in shape space', x, y - 24, { size: 19, weight: 500 });
  line(ctx, x, cy, x + w, cy);
  line(ctx, cx, y, cx, y + h);
  for (let k = -4; k <= 4; k++) {
    if (k !== 0 && Math.abs(k * perRadian) < w / 2 - 6) line(ctx, cx + k * perRadian, cy - 4, cx + k * perRadian, cy + 4);
    if (k !== 0 && Math.abs(k * perRadian) < h / 2 - 6) line(ctx, cx - 4, cy - k * perRadian, cx + 4, cy - k * perRadian);
  }
  text(ctx, 'ticks: 1 rad', x, y + h, { ...type.note, size: 13 });
  text(ctx, 'twist a', x + w, cy + 22, { ...type.note, size: 14, align: 'right' });
  text(ctx, 'bend b', cx + 10, y - 4, { ...type.note, size: 14 });

  const samples = 160;
  const points = Array.from({ length: samples + 1 }, (_, i) => toPlane(loopCoordinates(i / samples, s, shape)));
  ctx.save();
  ctx.beginPath();
  points.forEach(([px, py], i) => {
    if (i) ctx.lineTo(px, py);
    else ctx.moveTo(px, py);
  });
  ctx.closePath();
  ctx.fillStyle = rgba(HORIZONTAL, 0.1);
  ctx.fill();
  ctx.strokeStyle = HORIZONTAL;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  // which way round: an arrowhead a quarter of the way along
  const [ax, ay] = toPlane(loopCoordinates(0.2, s, shape));
  const [bx, by] = toPlane(loopCoordinates(0.23, s, shape));
  arrow(ctx, ax, ay, bx, by, { color: HORIZONTAL, width: 2.5, head: 12 });

  const [px, py] = toPlane(loopCoordinates(tau - Math.floor(tau), s, shape));
  dot(ctx, cx, cy, 4, color.muted);
  dot(ctx, px, py, 7, color.ink);
}

function panel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, title: string) {
  ctx.save();
  ctx.fillStyle = rgba(color.panel, 0.85);
  roundRect(ctx, x, y, w, h, 12);
  ctx.fill();
  ctx.strokeStyle = color.line;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
  text(ctx, title, x + 28, y + 34, { ...type.eyebrow, size: 14 });
}

function drawReadouts(ctx: CanvasRenderingContext2D, { s, shape, holonomy, area }: Loop, tau: number, R: Mat3) {
  const { x, y, w, row } = PANEL;
  const rows = 7;
  panel(ctx, x, y, w, 56 + rows * row, 'READOUT');
  const left = x + 28;
  const width = w - 56;
  const H = holonomy.rotations[holonomy.rotations.length - 1];
  const axis = axisOf(H);
  const perLoop = holonomy.angle;
  let yy = y + 68;
  const put = (label: string, value: string) => {
    readout(ctx, left, yy, label, value, { size: 17, width });
    yy += row;
  };
  put('loop amplitudes  (a, b)', `${(s * shape.a).toFixed(2)}, ${(s * Math.abs(shape.b)).toFixed(2)} rad`);
  put('loops completed', String(Math.floor(tau + 1e-9)));
  put('rotation since the start', `${degreesOf(R).toFixed(1)}°`);
  readout(ctx, left, yy, 'holonomy per loop', '', { size: 17, width });
  text(ctx, `${significant(perLoop)}°`, left + width, yy + 1, { font: font.mono, size: 22, weight: 500, color: VERTICAL, align: 'right' });
  yy += row;
  put('its axis (space frame)', axis ? `(${axis.map((c) => formatNumber(c, 2, true)).join(', ')})` : 'none');
  put('enclosed area  π a b', `${significant(area)} rad²`);
  put('holonomy / area', `${(perLoop / area).toFixed(2)} °/rad²`);
}

/** Rotation per loop for s, s/2, s/4, s/8 at the current aspect: rotation / area settles at the curvature. */
function drawShrinkTable(ctx: CanvasRenderingContext2D, aspect: number, reverse: boolean, s: number) {
  const { x, y, w, row } = TABLE;
  panel(ctx, x, y, w, 58 + (SHRINK.length + 1) * row, 'SHRINK TEST  ·  ROTATION / AREA → CURVATURE');
  const cols = [x + 28, x + 250, x + 390, x + w - 28];
  const head = { ...type.note, size: 14 };
  let yy = y + 66;
  text(ctx, 'loop size', cols[0], yy, head);
  text(ctx, 'rotation', cols[1], yy, { ...head, align: 'right' });
  text(ctx, 'area', cols[2], yy, { ...head, align: 'right' });
  text(ctx, 'rotation / area', cols[3], yy, { ...head, align: 'right' });
  for (const f of SHRINK) {
    yy += row;
    const loop = loopFor(s * f, aspect, reverse);
    const cell = { font: font.mono, size: 17 };
    const label = f === 1 ? 's' : `s/${Math.round(1 / f)}`;
    text(ctx, `${label} = ${loop.s.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}`, cols[0], yy, { ...cell, color: color.muted });
    text(ctx, `${significant(loop.holonomy.angle)}°`, cols[1], yy, { ...cell, align: 'right' });
    text(ctx, `${significant(loop.area)}`, cols[2], yy, { ...cell, align: 'right' });
    text(ctx, `${(loop.holonomy.angle / loop.area).toFixed(2)} °/rad²`, cols[3], yy, { ...cell, color: VERTICAL, align: 'right' });
  }
}
