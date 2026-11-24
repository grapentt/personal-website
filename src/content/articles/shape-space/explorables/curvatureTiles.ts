// Explorable: holonomy is λ times the area. Bundle ℝ² × ℝ → ℝ² with coordinates (x, y | z)
// and connection A = dz − (λ/2)(x dy − y dx) (bundleBox.ts / shared.ts). A horizontal curve
// has dz = (λ/2)(x dy − y dx), so the lift of a closed loop rises by λ times its signed area
// (Stokes); the curvature is Ω = dA = −λ dx ∧ dy. The discrete lift adds (λ/2)(xₖ yₖ₊₁ − yₖ xₖ₊₁)
// per step, which sums to exactly λ times the shoelace area of the same polygon.

import { defineScene, slider, choice, toggle, drag, lin, lerp, clamp, text, type, font, color, rgba, tex, line, dot, ring, roundRect, formatNumber, polyline3, polygon3 } from '@/stage/kit';
import type { Tex, Vec3, Camera } from '@/stage/kit';
import { VERTICAL, HORIZONTAL, bundleCamera, bundlePoint, horizontalBasis, horizontalLift } from '../film/shared';
import type { Point2 } from '../film/shared';
import { FLOOR, LIFT_START, drawFloor, drawFibres, drawTiles, drawSheets, loopPoints, enclosedArea, drawLoopAndLift } from '../film/bundleBox';

type Shape = 'circle' | 'square' | 'triangle' | 'wobbly';
const SHAPES: Shape[] = ['circle', 'square', 'triangle', 'wobbly'];

/** One walk round the loop takes WALK seconds, then the result is held until PERIOD. */
const WALK = 8;
const PERIOD = 12;
const BOX_TOP = 1.9;
const PANEL = { x: 1000, y: 150, w: 540, h: 440 };
const ROW = { x: PANEL.x + 32, width: PANEL.w - 64, size: 18 };
const CHART = { x: 1050, y: 680, w: 470, h: 150 };
const CHART_RADII = [0.3, 0.6, 1.0, 1.4, 1.7];
const RADIUS_RANGE: [number, number] = [0.15, 1.7];

/** Closed polygon through the corners (counterclockwise), finely subdivided. */
function cornerLoop(corners: Point2[], perSide = 60): Point2[] {
  const pts: Point2[] = [];
  corners.forEach((a, i) => {
    const b = corners[(i + 1) % corners.length];
    for (let k = 0; k < perSide; k++) pts.push([lerp(a[0], b[0], k / perSide), lerp(a[1], b[1], k / perSide)]);
  });
  pts.push(corners[0]);
  return pts;
}
const onCircle = (r: number, angles: number[]): Point2[] => angles.map((a): Point2 => [r * Math.cos(a), r * Math.sin(a)]);

/** The loop of the given shape inscribed in the circle of radius r about the origin (star-shaped, counterclockwise). */
function shapeLoop(shape: Shape, r: number): Point2[] {
  if (shape === 'square') return cornerLoop(onCircle(r, [1, 3, 5, 7].map((k) => (k * Math.PI) / 4)));
  if (shape === 'triangle') return cornerLoop(onCircle(r, [0, 1, 2].map((k) => (2 * k * Math.PI) / 3)), 80);
  if (shape === 'wobbly') return loopPoints((phi) => r * (1 + 0.13 * Math.sin(3 * phi)));
  return loopPoints(r);
}

/** Holonomy Δz and signed area of a loop. */
function holonomyOf(loop: Point2[], lambda: number) {
  const lifted = horizontalLift(loop, 0, lambda);
  return { dz: lifted[lifted.length - 1][2], area: enclosedArea(loop) };
}

// The connection form with the live coefficient λ/2, typeset once per value.
const forms = new Map<string, Tex>();
function connectionForm(lambda: number): Tex {
  const k = lambda / 2;
  const magnitude = Math.abs(k).toFixed(3);
  const zero = Number(magnitude) === 0;
  let sign = '−';
  if (k < 0) sign = '+';
  const key = zero ? '0' : `${sign}${magnitude}`;
  let form = forms.get(key);
  if (!form) {
    if (zero) form = tex(String.raw`A = dz`, 'A = dz');
    else form = tex(String.raw`A = dz ${sign === '+' ? '+' : '-'} ${magnitude}\,(x\,dy - y\,dx)`, `A = dz ${sign} ${magnitude} (x dy − y dx)`);
    forms.set(key, form);
  }
  return form;
}

function panel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save();
  ctx.fillStyle = rgba(color.panel, 0.94);
  roundRect(ctx, x, y, w, h, 16);
  ctx.fill();
  ctx.strokeStyle = color.line;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

/** The horizontal tile through a point of the lift: the curve stays tangent to it. */
function runnerTile(ctx: CanvasRenderingContext2D, cam: Camera, [x, y, z]: Vec3, lambda: number, size = 0.24) {
  const [e1, e2] = horizontalBasis(x, y, lambda);
  const corner = (a: number, b: number) => bundlePoint(x + size * (a * e1[0] + b * e2[0]), y + size * (a * e1[1] + b * e2[1]), z + size * (a * e1[2] + b * e2[2]));
  polygon3(ctx, cam, [corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)], { fill: rgba(HORIZONTAL, 0.32), stroke: HORIZONTAL, width: 2 });
}

/** Δz / area for every shape at a range of sizes, against the line y = λ; the reader's loop in gold. */
function drawRatioChart(ctx: CanvasRenderingContext2D, lambda: number, current: Shape, radius: number) {
  const { x, y, w, h } = CHART;
  const Yv = (v: number) => y + h / 2 - (v / 1.15) * (h / 2);
  const group = w / SHAPES.length;
  const Xr = (k: number, r: number) => x + group * k + 14 + ((r - RADIUS_RANGE[0]) / (RADIUS_RANGE[1] - RADIUS_RANGE[0])) * (group - 28);

  text(ctx, 'Δz / area for every shape and size, at this λ', x - 20, y - 26, { font: font.sans, size: 17, weight: 500, color: color.ink });
  line(ctx, x, y, x, y + h, { color: color.line });
  line(ctx, x, Yv(0), x + w, Yv(0), { color: color.line });
  for (const v of [-1, 0, 1]) text(ctx, formatNumber(v, 0), x - 10, Yv(v), { ...type.note, size: 14, align: 'right', baseline: 'middle' });
  line(ctx, x, Yv(lambda), x + w, Yv(lambda), { color: color.gold, dash: [6, 6], width: 1.5 });
  text(ctx, `λ = ${formatNumber(lambda, 2)}`, x + w, Yv(lambda) + (lambda > 0.6 ? 20 : -10), { font: font.mono, size: 14, color: color.gold, align: 'right' });

  SHAPES.forEach((shape, k) => {
    for (const r of CHART_RADII) {
      const { dz, area } = holonomyOf(shapeLoop(shape, r), lambda);
      dot(ctx, Xr(k, r), Yv(dz / area), 2.5 + 2.5 * r, HORIZONTAL, 0.85);
    }
    text(ctx, shape, x + group * (k + 0.5), y + h + 24, { ...type.note, size: 14, align: 'center', color: shape === current ? color.ink : color.muted });
  });
  const mine = holonomyOf(shapeLoop(current, radius), lambda);
  ring(ctx, Xr(SHAPES.indexOf(current), radius), Yv(mine.dz / mine.area), 9, color.gold, 1, 2.5);
}

export default defineScene({
  name: 'Holonomy is λ times the area',
  duration: 600,
  controls: {
    lambda: slider('Twist λ', { min: -1, max: 1, step: 0.05, value: 0.5, lens: true }),
    radius: slider('Loop radius', { min: RADIUS_RANGE[0], max: RADIUS_RANGE[1], step: 0.05, value: 1, lens: true }),
    shape: choice('Loop', { circle: 'circle', square: 'square', triangle: 'triangle', wobbly: 'wobbly circle' }, { value: 'circle', lens: true }),
    show: choice('Show', { tiles: 'horizontal tiles', sheets: 'sheets z = const', none: 'nothing' }, { value: 'tiles', lens: true }),
    animate: toggle('Walk the loop', { value: true, lens: true }),
    view: drag('Drag the box to turn it', { region: [40, 170, 960, 880] }),
  },

  draw(ctx, t, { input }) {
    const lambda = input.lambda as number;
    const radius = input.radius as number;
    const shape = input.shape as Shape;
    const show = input.show as string;
    const [dragX, dragY] = input.view as [number, number];
    const progress = input.animate ? lin(t % PERIOD, 0, WALK) : 1;
    const done = progress >= 1;

    const loop = shapeLoop(shape, radius);
    const area = enclosedArea(loop);
    const holonomy = holonomyOf(loop, lambda).dz;
    // the lift always occupies [LIFT_START, LIFT_START + |Δz|]; a falling lift starts higher
    const z0 = LIFT_START + Math.max(0, -holonomy);
    const top = Math.max(BOX_TOP, LIFT_START + Math.abs(holonomy) + 0.35);
    const fit = (BOX_TOP - FLOOR) / (top - FLOOR);
    const cam = bundleCamera({
      yaw: 0.55 + dragX / 280,
      pitch: clamp(0.42 - dragY / 280, 0.05, 1.35),
      scale: 118 * fit,
      cx: 520,
      cy: 520,
      center: [0, (FLOOR + top) / 2, 0],
    });

    text(ctx, 'EXPLORE · CURVATURE', 80, 82, type.eyebrow);
    text(ctx, 'Holonomy is λ times the area', 80, 132, { ...type.title, size: 38 });

    drawFloor(ctx, cam);
    if (show === 'sheets') drawSheets(ctx, cam, Math.abs(lambda) < 1e-9 ? 1 : 0.35);
    drawFibres(ctx, cam);
    const [sx, sy] = loop[0];
    polyline3(ctx, cam, [bundlePoint(sx, sy, FLOOR), bundlePoint(sx, sy, top)], { color: VERTICAL, width: 2.5, alpha: 0.9 });
    if (show === 'tiles') drawTiles(ctx, cam, lambda, { alpha: 0.55 });

    const lifted = drawLoopAndLift(ctx, cam, loop, z0, lambda, { progress });
    const k = Math.max(1, Math.round((lifted.length - 1) * progress));
    const here = lifted[k];
    const zSoFar = here[2] - z0;

    // the runner, its tile and its shadow on the base
    const shadow = cam.project(bundlePoint(here[0], here[1], FLOOR));
    const runner = cam.project(bundlePoint(...here));
    polyline3(ctx, cam, [bundlePoint(here[0], here[1], FLOOR), bundlePoint(...here)], { color: color.muted, width: 1.5, dash: [4, 5], alpha: 0.8 });
    dot(ctx, shadow.x, shadow.y, 5, color.ink, 0.8);
    if (!done) runnerTile(ctx, cam, here, lambda);
    const start = cam.project(bundlePoint(sx, sy, z0));
    dot(ctx, start.x, start.y, 6, color.ink);
    dot(ctx, runner.x, runner.y, 7, done ? color.gold : color.ink);

    // once round: the gap along the start fibre is the holonomy
    if (done) {
      const end = lifted[lifted.length - 1];
      polyline3(ctx, cam, [bundlePoint(sx, sy, z0), bundlePoint(sx, sy, end[2])], { color: color.gold, width: 6 });
      const tip = cam.project(bundlePoint(...end));
      ring(ctx, tip.x, tip.y, 12, color.gold, 1, 2.5);
      const mid = cam.project(bundlePoint(sx, sy, (z0 + end[2]) / 2));
      text(ctx, 'holonomy Δz', mid.x + 18, mid.y, { font: font.mono, size: 16, color: color.gold, baseline: 'middle' });
    }

    // readouts
    panel(ctx, PANEL.x, PANEL.y, PANEL.w, PANEL.h);
    text(ctx, 'ROUND THE LOOP', ROW.x, PANEL.y + 44, { ...type.eyebrow, size: 15 });
    const row = (n: number, label: string, value: string, tint: string = color.ink, size = ROW.size) => {
      const y = PANEL.y + 88 + 36 * n;
      text(ctx, label, ROW.x, y, { font: font.mono, size: ROW.size, color: color.muted });
      text(ctx, value, ROW.x + ROW.width, y, { font: font.mono, size, color: tint, align: 'right' });
    };
    row(0, 'twist λ', formatNumber(lambda, 2));
    row(1, 'loop', `${shape} · r = ${radius.toFixed(2)}`);
    row(2, 'signed area', formatNumber(area, 3), HORIZONTAL);
    row(3, 'Δz so far', formatNumber(zSoFar, 3), VERTICAL);
    row(4, 'holonomy Δz (once round)', formatNumber(holonomy, 3), VERTICAL);
    row(5, 'Δz / area', formatNumber(holonomy / area, 3), color.gold, 22);
    line(ctx, ROW.x, PANEL.y + 302, ROW.x + ROW.width, PANEL.y + 302, { color: color.line });
    connectionForm(lambda).draw(ctx, ROW.x, PANEL.y + 336, { size: 26 });
    text(ctx, `curvature Ω = dA = ${formatNumber(-lambda, 2)} dx∧dy`, ROW.x, PANEL.y + 378, { font: font.mono, size: 17, color: color.ink });
    const flat = Math.abs(lambda) < 1e-9;
    text(ctx, flat ? 'λ = 0: flat, the lift closes up.' : `λ ≠ 0: curved, the lift misses by λ · area = ${formatNumber(lambda * area, 3)}.`, ROW.x, PANEL.y + 414, {
      font: font.sans,
      size: 17,
      color: flat ? color.body : color.gold,
    });

    drawRatioChart(ctx, lambda, shape, radius);
  },
});
