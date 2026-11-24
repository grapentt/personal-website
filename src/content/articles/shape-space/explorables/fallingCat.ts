// Explorable: the falling cat. The reader sets the inertia ratio of the legs and the twist
// per loop; the cat runs its loop in shape space with zero angular momentum about its long
// axis and turns by the holonomy of the loop.
//
// Model (film/cat.ts): two halves on a shared long axis, I = 1 with legs tucked, I = r with
// legs stretched. L = I_f θ̇_f + I_b θ̇_b = 0 and δ = θ_f − θ_b give, while the halves twist,
//   dθ_f = I_b/(I_f + I_b) dδ,   dθ_b = −I_f/(I_f + I_b) dδ;
// changing the legs at fixed δ turns nothing. One loop (tuck front / twist Δδ / swap / twist
// back / relax) therefore turns the cat by Δθ = Δδ (r − 1)/(r + 1).

import { defineScene, slider, choice, text, type, font, color, line, dot, tex, roundRect, readout, rgba } from '@/stage/kit';
import { HORIZONTAL, VERTICAL } from '../film/shared';
import { catState, drawCat, inertia, turnPerLoop, PHASE_LABELS } from '../film/cat';
import type { CatParams, CatState } from '../film/cat';

/** Loops per second at speed 1 (the film runs one loop in about 7 s). */
const LOOPS_PER_SECOND = 1 / 8;
const CAT = { x: 470, y: 440, size: 1.25 };
const INSET = { x: 980, y: 150, w: 520, h: 180 };
const PANEL = { x: 960, y: 596, w: 560, rows: 8, row: 29 };

const MOMENTUM = tex(String.raw`L = I_{\text{front}}\,\dot\theta_{\text{front}} + I_{\text{back}}\,\dot\theta_{\text{back}} = 0`, 'L = I_front θ̇_front + I_back θ̇_back = 0');
const TURN = tex(String.raw`\Delta\theta = \Delta\delta\,\frac{r - 1}{r + 1}`, 'Δθ = Δδ · (r − 1)/(r + 1)');

const DEG = Math.PI / 180;
const degrees = (radians: number, digits = 1) => `${(radians / DEG).toFixed(digits)}°`;

// ---- an independent check: integrate L = 0 along one loop of shapes -----------

const measured = new Map<string, number>();

/**
 * Turn of the front half over one loop, integrated numerically from the shapes alone:
 * the loop's legs and twist are sampled N times and dθ_f = I_b/(I_f + I_b) dδ is summed
 * with midpoint inertias. Memoised on the (rounded) parameters.
 */
function measuredTurn(ratio: number, twist: number): number {
  const key = `${ratio.toFixed(3)}|${(twist / DEG).toFixed(2)}`;
  const hit = measured.get(key);
  if (hit !== undefined) return hit;
  const params: CatParams = { ratio, twist };
  const N = 2400;
  let previous = catState(0, 0, params);
  let front = 0;
  for (let k = 1; k <= N; k++) {
    const current = catState(k / N, 0, params);
    const iFront = inertia((previous.legs[0] + current.legs[0]) / 2, ratio);
    const iBack = inertia((previous.legs[1] + current.legs[1]) / 2, ratio);
    front += (iBack / (iFront + iBack)) * (current.twist - previous.twist);
    previous = current;
  }
  if (measured.size > 400) measured.clear();
  measured.set(key, front);
  return front;
}

// ---- the scene ----------------------------------------------------------------

export default defineScene({
  name: 'Land on your feet',
  duration: 600,
  controls: {
    ratio: slider('Inertia ratio I_out / I_in', { min: 1, max: 8, step: 0.25, value: 4, lens: true, digits: 2 }),
    twist: slider('Twist per loop', { min: 0, max: 180, step: 5, value: 150, lens: true, digits: 0, unit: '°' }),
    speed: slider('Speed', { min: 0, max: 2, step: 0.05, value: 1, lens: true, digits: 2, unit: '×' }),
    start: choice('Start', { up: 'upside down', down: 'feet down' }, { value: 'up', lens: true }),
    show: choice('Show', { cat: 'cat', loop: 'cat + shape loop' }, { value: 'loop', lens: true }),
  },

  draw(ctx, t, { input }) {
    const ratio = input.ratio as number;
    const twist = (input.twist as number) * DEG;
    const speed = input.speed as number;
    const start = input.start === 'down' ? 0 : Math.PI;
    const withLoop = input.show === 'loop';

    const params: CatParams = { ratio, twist };
    const loops = speed * LOOPS_PER_SECOND * t;
    const state = catState(loops, start, params);
    const predicted = turnPerLoop(ratio, twist);

    text(ctx, 'EXPLORABLE · THE FALLING CAT', 80, 70, type.eyebrow);
    text(ctx, 'Land on your feet', 80, 114, { ...type.display, size: 34 });

    // the cat, side view
    drawCat(ctx, { x: CAT.x, y: CAT.y, size: CAT.size, front: state.front, back: state.back, legs: state.legs });
    text(ctx, 'back half', CAT.x - 140, 616, { ...type.note, align: 'center' });
    text(ctx, 'front half', CAT.x + 130, 616, { ...type.note, align: 'center' });
    const phase = state.phase === PHASE_LABELS.length - 1 ? `relax: same shape as before, but turned by ${degrees(predicted)}` : PHASE_LABELS[state.phase];
    text(ctx, phase, CAT.x, 700, { font: font.mono, size: 18, color: VERTICAL, align: 'center' });
    MOMENTUM.draw(ctx, CAT.x, 776, { size: 24, align: 'center' });
    text(ctx, 'legs out = large I, tucked in = small I', CAT.x, 826, { ...type.note, align: 'center' });

    if (withLoop) {
      drawShapeLoop(ctx, state, twist);
      drawDial(ctx, { x: 1070, y: 468, r: 74 }, state, start, predicted);
    } else {
      drawDial(ctx, { x: 1110, y: 360, r: 128 }, state, start, predicted);
    }
    drawReadouts(ctx, state, { loops, start, ratio, predicted, measured: measuredTurn(ratio, twist) });
  },
});

/** The loop in shape space: relative twist δ (right) and leg pose p = back − front (up). */
function drawShapeLoop(ctx: CanvasRenderingContext2D, state: CatState, twist: number) {
  const { x, y, w, h } = INSET;
  const X = (delta: number) => x + 30 + (delta / Math.PI) * (w - 90);
  const Y = (pose: number) => y + h / 2 - pose * (h / 2 - 16);
  text(ctx, 'loop in shape space', x, y - 24, { size: 19, weight: 500 });
  line(ctx, x + 30, y, x + 30, y + h);
  line(ctx, x + 30, Y(0), x + w - 20, Y(0));
  text(ctx, 'relative twist δ →', x + w - 20, y + h + 24, { ...type.note, size: 14, align: 'right' });
  text(ctx, 'back legs out', x + 40, y + 8, { ...type.note, size: 14 });
  text(ctx, 'front legs out', x + 40, y + h + 2, { ...type.note, size: 14 });
  text(ctx, '180°', X(Math.PI), Y(0) + 22, { ...type.note, size: 14, align: 'center' });
  line(ctx, X(Math.PI), Y(0) - 5, X(Math.PI), Y(0) + 5);

  // the rectangle of shapes, lightly filled; its corners are the four poses of the loop
  const corners: [number, number][] = [[0, 1], [twist, 1], [twist, -1], [0, -1]];
  ctx.save();
  ctx.beginPath();
  corners.forEach(([d, p], i) => {
    if (i) ctx.lineTo(X(d), Y(p));
    else ctx.moveTo(X(d), Y(p));
  });
  ctx.closePath();
  ctx.fillStyle = rgba(HORIZONTAL, 0.08);
  ctx.fill();
  ctx.strokeStyle = HORIZONTAL;
  ctx.lineWidth = 2.5;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(X(0), Y(0));
  for (const [d, p] of [...corners, [0, 0]]) ctx.lineTo(X(d), Y(p));
  ctx.stroke();
  ctx.restore();
  if (twist > 0) text(ctx, degrees(twist, 0), X(twist), y - 6, { font: font.mono, size: 14, color: HORIZONTAL, align: 'center' });
  dot(ctx, X(state.twist), Y(state.pose), 7, color.ink);
}

/**
 * The orientation of the two halves, seen along the long axis: a needle points where the
 * legs of that half point (down = feet down). The gold arc is the predicted turn per loop.
 */
function drawDial(ctx: CanvasRenderingContext2D, { x, y, r }: { x: number; y: number; r: number }, state: CatState, start: number, predicted: number) {
  const toward = (angle: number, radius: number): [number, number] => [x + radius * Math.sin(angle), y + radius * Math.cos(angle)];
  // canvas angle of the direction (sin θ, cos θ)
  const canvasAngle = (angle: number) => Math.PI / 2 - angle;

  ctx.save();
  ctx.strokeStyle = color.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  for (let k = 0; k < 12; k++) {
    const a = (k * Math.PI) / 6;
    const [x0, y0] = toward(a, r - (k % 3 === 0 ? 10 : 5));
    const [x1, y1] = toward(a, r);
    line(ctx, x0, y0, x1, y1, { color: k % 3 === 0 ? color.muted : color.line, width: 1.5 });
  }
  // predicted turn per loop, from the starting orientation
  if (predicted > 1e-6) {
    ctx.strokeStyle = rgba(VERTICAL, 0.55);
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(x, y, r + 11, canvasAngle(start), canvasAngle(start + predicted), true);
    ctx.stroke();
  }
  ctx.restore();

  const [fx, fy] = toward(state.front, r - 16);
  const [bx, by] = toward(state.back, r - 30);
  line(ctx, x, y, bx, by, { color: rgba(VERTICAL, 0.5), width: 4 });
  line(ctx, x, y, fx, fy, { color: VERTICAL, width: 4 });
  dot(ctx, fx, fy, 5, VERTICAL);
  dot(ctx, x, y, 5, color.ink);

  text(ctx, 'upside down', x, y - r - 24, { ...type.note, size: 14, align: 'center' });
  text(ctx, 'feet down', x, y + r + 34, { ...type.note, size: 14, color: color.ink, align: 'center' });

  const lx = x + r + 44;
  const ly = y - 30;
  text(ctx, 'orientation, along the body', lx, ly - 4, { size: 17, weight: 500 });
  line(ctx, lx, ly + 26, lx + 30, ly + 26, { color: VERTICAL, width: 4 });
  text(ctx, 'front half', lx + 42, ly + 31, { ...type.note, size: 14 });
  line(ctx, lx, ly + 52, lx + 30, ly + 52, { color: rgba(VERTICAL, 0.5), width: 4 });
  text(ctx, 'back half', lx + 42, ly + 57, { ...type.note, size: 14 });
  line(ctx, lx, ly + 78, lx + 30, ly + 78, { color: rgba(VERTICAL, 0.55), width: 6 });
  text(ctx, 'turn per loop', lx + 42, ly + 83, { ...type.note, size: 14 });
}

interface Numbers {
  loops: number;
  start: number;
  ratio: number;
  predicted: number;
  measured: number;
}

function drawReadouts(ctx: CanvasRenderingContext2D, state: CatState, { loops, start, ratio, predicted, measured: check }: Numbers) {
  const { x, y, w, rows, row } = PANEL;
  const height = 58 + rows * row;
  ctx.save();
  ctx.fillStyle = rgba(color.panel, 0.85);
  roundRect(ctx, x, y, w, height, 12);
  ctx.fill();
  ctx.strokeStyle = color.line;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  const inner = w - 56;
  const left = x + 28;
  let yy = y + 36;
  text(ctx, 'READOUT', left, yy, { ...type.eyebrow, size: 14 });
  yy += 34;
  const iFront = inertia(state.legs[0], ratio);
  const iBack = inertia(state.legs[1], ratio);
  const lands = predicted > 1e-9 ? (Math.PI / predicted).toFixed(2) : 'never';
  const rowsOut: [string, string, boolean?][] = [
    ['front half turned', degrees(state.front - start)],
    ['back half turned', degrees(state.back - start)],
    ['relative twist δ', degrees(state.twist)],
    ['inertia  front / back', `${iFront.toFixed(2)} / ${iBack.toFixed(2)}`],
    ['turn per loop  Δδ·(r−1)/(r+1)', degrees(predicted, 2), true],
    ['integrated over one loop, L = 0', degrees(check, 2)],
    ['loops to turn 180°', lands],
    ['loops completed', String(Math.floor(loops + 1e-9))],
  ];
  for (const [label, value, key] of rowsOut) {
    if (key) {
      readout(ctx, left, yy, label, '', { size: 17, width: inner });
      text(ctx, value, left + inner, yy + 1, { font: font.mono, size: 22, weight: 500, color: VERTICAL, align: 'right' });
    } else {
      readout(ctx, left, yy, label, value, { size: 17, width: inner });
    }
    yy += row;
  }
  TURN.draw(ctx, x + w - 28, y + 30, { size: 20, align: 'right', color: color.muted });
}
