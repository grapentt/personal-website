// Explorable: tilt the connection on the cut-open torus and follow a horizontal lift.
// Total space T² with θ along the base circle and φ along the fibre. The connection
// 1-form is A = dφ − λ c(θ) dθ with c(θ) = 0.8 sin θ + μ (flatTorus.ts; the film has μ = 0),
// so a horizontal curve has slope dφ/dθ = λ (0.8 sin θ + μ) and the lift through (θₛ, φₛ) is
// φ(θ) = φₛ + λ (0.8 (cos θₛ − cos θ) + μ (θ − θₛ)). After one turn of the base it arrives at
// φₛ + 2πλμ: the connection is flat (dA = 0 on a 1-dimensional base) yet has holonomy 2πλμ.

import { defineScene, slider, toggle, pick, lin, text, wrap, type, font, color, rgba, tex, line, dot, ring, arrow, roundRect, formatNumber } from '@/stage/kit';
import type { Tex } from '@/stage/kit';
import { VERTICAL, HORIZONTAL } from '../film/shared';
import { RECT, X, Y, slope, lift, dashDirection, drawRectangle, drawDashes } from '../film/flatTorus';

const TAU = 2 * Math.PI;
/** One turn of the base takes WALK seconds, then the finished turn is held until PERIOD. */
const WALK = 9;
const PERIOD = 12;
const DEFAULT_START: [number, number] = [0.4, 2.2];
const PANEL = { x: 920, y: 230, w: 600, h: 540 };
const ROW = { x: PANEL.x + 36, width: PANEL.w - 72, size: 18 };

const mod = (a: number, b: number) => ((a % b) + b) % b;
/** Stage point → torus coordinates (θ, φ). */
const toTorus = ([x, y]: [number, number]): [number, number] => [((x - RECT.x0) / (RECT.x1 - RECT.x0)) * TAU, ((RECT.y1 - y) / (RECT.y1 - RECT.y0)) * TAU];

// The connection form A = dφ − 0.8 λ sin θ dθ − λ μ dθ with the live coefficients, typeset once per value.
const forms = new Map<string, Tex>();
/** One term "∓ |k| body" of the form, or null when the coefficient rounds to zero. */
function term(k: number, texBody: string, plainBody: string): { tex: string; plain: string } | null {
  const magnitude = Math.abs(k).toFixed(2);
  if (Number(magnitude) === 0) return null;
  const minus = k > 0; // the form subtracts λ c(θ) dθ
  return { tex: `${minus ? '-' : '+'} ${magnitude}${texBody}`, plain: `${minus ? '−' : '+'} ${magnitude}${plainBody}` };
}
function connectionForm(lambda: number, mu: number): Tex {
  const terms = [
    term(0.8 * lambda, String.raw`\,\sin\theta\,d\theta`, ' sin θ dθ'),
    term(lambda * mu, String.raw`\,d\theta`, ' dθ'),
  ].filter((x): x is { tex: string; plain: string } => x !== null);
  const key = terms.map((x) => x.plain).join(' ');
  let form = forms.get(key);
  if (!form) {
    const texRest = terms.map((x) => ` ${x.tex}`).join('');
    const plainRest = terms.map((x) => ` ${x.plain}`).join('');
    form = tex(String.raw`A = d\varphi` + texRest, `A = dφ${plainRest}`);
    if (forms.size > 400) forms.clear();
    forms.set(key, form);
  }
  return form;
}

/** Draw something in every periodic copy that can reach the rectangle, clipped to it. */
function inCopies(ctx: CanvasRenderingContext2D, draw: (shiftTheta: number, shiftPhi: number) => void) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(RECT.x0, RECT.y0, RECT.x1 - RECT.x0, RECT.y1 - RECT.y0);
  ctx.clip();
  // the lift spans one turn in θ and, with the offset, up to |φ − φₛ| ≈ 7.1 < 4π in φ
  for (const shiftTheta of [0, -TAU]) for (const shiftPhi of [-2 * TAU, -TAU, 0, TAU, 2 * TAU]) draw(shiftTheta, shiftPhi);
  ctx.restore();
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

export default defineScene({
  name: 'Tilt the connection',
  duration: 600,
  controls: {
    lambda: slider('Tilt λ', { min: -1.5, max: 1.5, step: 0.05, value: 1, lens: true }),
    mu: slider('Offset μ (flat, with holonomy)', { min: -0.5, max: 0.5, step: 0.05, value: 0, lens: true }),
    start: pick('Click the rectangle to choose the start point', { region: [RECT.x0, RECT.y0, RECT.x1, RECT.y1], max: 1, value: [[X(DEFAULT_START[0]), Y(DEFAULT_START[1])]] }),
    animate: toggle('Walk along the base', { value: true, lens: true }),
  },

  draw(ctx, t, { input }) {
    const lambda = input.lambda as number;
    const mu = input.mu as number;
    const picked = input.start as [number, number][];
    const [thetaS, phiS] = picked.length ? toTorus(picked[picked.length - 1]) : DEFAULT_START;
    const walked = input.animate ? Math.min(1, lin(mod(t, PERIOD), 0, WALK)) : 1; // turns of the base
    const curve = lift(thetaS, phiS, lambda, mu);
    const theta = thetaS + TAU * walked;
    const phi = curve(theta);
    const displacement = phi - phiS;
    const afterTurn = curve(thetaS + TAU) - phiS;
    const done = walked >= 1;

    text(ctx, 'EXPLORE · A CONNECTION ON THE TORUS', RECT.x0, 82, type.eyebrow);
    text(ctx, 'Tilt the connection, follow the dashes', RECT.x0, 132, { ...type.title, size: 38 });

    drawRectangle(ctx);
    drawDashes(ctx, lambda, 0.75, 22, mu);

    // the λ = 0 lift through the start (a straight line) as a reference
    line(ctx, RECT.x0, Y(phiS), RECT.x1, Y(phiS), { color: color.muted, width: 1.5, dash: [5, 7], alpha: 0.6 });

    // the horizontal lift so far, wrapping across the glued edges
    const samples = Math.max(2, Math.ceil(360 * walked));
    inCopies(ctx, (sT, sP) => {
      const pts: [number, number][] = Array.from({ length: samples + 1 }, (_, i) => {
        const th = thetaS + (TAU * walked * i) / samples;
        return [X(th + sT), Y(curve(th) + sP)];
      });
      ctx.save();
      ctx.strokeStyle = HORIZONTAL;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      pts.forEach(([px, py], i) => {
        if (i) ctx.lineTo(px, py);
        else ctx.moveTo(px, py);
      });
      ctx.stroke();
      ctx.restore();
      // vertical displacement from the start height, along the fibre at the current point
      line(ctx, X(theta + sT), Y(phiS + sP), X(theta + sT), Y(phi + sP), { color: VERTICAL, width: 4, alpha: 0.9 });
    });

    // start, current point and the direction of the dash there
    const cx = X(mod(theta, TAU));
    const cy = Y(mod(phi, TAU));
    const [dx, dy] = dashDirection(theta, lambda, mu);
    ring(ctx, X(thetaS), Y(phiS), 12, done ? color.gold : color.ink, 1, 2.5);
    if (!done) arrow(ctx, cx, cy, cx + 54 * dx, cy + 54 * dy, { color: HORIZONTAL, width: 3, head: 12 });
    dot(ctx, cx, cy, 7, color.ink);

    // readouts
    panel(ctx, PANEL.x, PANEL.y, PANEL.w, PANEL.h);
    text(ctx, 'THE HORIZONTAL LIFT', ROW.x, PANEL.y + 46, { ...type.eyebrow, size: 15 });
    const row = (k: number, label: string, value: string, tint: string = color.ink, size = ROW.size) => {
      const y = PANEL.y + 92 + 38 * k;
      text(ctx, label, ROW.x, y, { font: font.mono, size: ROW.size, color: color.muted });
      text(ctx, value, ROW.x + ROW.width, y, { font: font.mono, size, color: tint, align: 'right' });
    };
    row(0, 'tilt λ  ·  offset μ', `${formatNumber(lambda, 2)}  ·  ${formatNumber(mu, 2)}`);
    row(1, 'start (θₛ, φₛ)', `(${formatNumber(thetaS, 2)}, ${formatNumber(phiS, 2)})`);
    row(2, 'walked along the base', `${walked.toFixed(2)} turn`);
    row(3, 'slope dφ/dθ = λ (0.8 sin θ + μ)', formatNumber(slope(theta, lambda, mu), 3), color.gold, 21);
    row(4, 'displacement φ − φₛ', `${formatNumber(displacement, 3, true)} rad`, VERTICAL);
    row(5, '… as a share of the fibre', `${formatNumber(displacement / TAU, 3, true)}`, VERTICAL);
    row(6, 'after one turn, Δφ = 2πλμ', formatNumber(afterTurn, 3, true), done ? color.gold : color.ink);
    line(ctx, ROW.x, PANEL.y + 352, ROW.x + ROW.width, PANEL.y + 352, { color: color.line });

    connectionForm(lambda, mu).draw(ctx, ROW.x, PANEL.y + 394, { size: 28 });
    text(ctx, 'curvature Ω = dA = 0', ROW.x, PANEL.y + 446, { font: font.mono, size: 19, color: color.gold });
    wrap(ctx, 'The base is a circle, 1-dimensional: it carries no 2-forms, so every connection on this bundle is flat.', ROW.x, PANEL.y + 476, ROW.width, 24, { ...type.note, size: 15 });
    // the lift closes when it comes back to φₛ modulo 2π, i.e. when λμ is a whole number
    const offFibre = mod(afterTurn + Math.PI, TAU) - Math.PI;
    const closes = Math.abs(offFibre) < 1e-9;
    text(ctx, closes ? 'After one turn the lift is back where it started.' : 'Flat, yet the lift comes back rotated: holonomy.', ROW.x, PANEL.y + 524, {
      font: font.sans,
      size: 17,
      color: closes ? color.body : color.stiff,
    });
  },
});
