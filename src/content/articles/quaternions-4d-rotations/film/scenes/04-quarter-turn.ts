import { defineScene, seg, fade, lin, text, wrap, type, color, font, arrow, dot, line, ring, tex } from '@/stage/kit';
import { plane, TAU } from '../shared';

const G = plane(470, 520, 190);
const VELOCITY = tex(String.raw`\frac{d}{d\theta}\, v(\theta) = J\, v(\theta)`, "v'(θ) = J v(θ)");
const SQUARE = tex(String.raw`J^2 = -1`, 'J² = −1');
const SOLUTION = tex(String.raw`v(\theta) = \cos\theta\; v + \sin\theta\; Jv = e^{\theta J} v`, 'v(θ) = cos θ v + sin θ Jv = e^{θJ} v');
const WEDGE = tex(String.raw`J = e_1 \wedge e_2:\quad e_1 \mapsto e_2,\;\; e_2 \mapsto -e_1`, 'J = e₁ ∧ e₂: e₁ ↦ e₂, e₂ ↦ −e₁');

export default defineScene({
  name: 'The quarter turn',
  duration: 42,
  narration: [
    [0, 'Watch a vector turn at constant speed. Its velocity always points at right angles to it, and has the same length: the velocity is the vector itself, turned by a quarter.'],
    [12, 'Call the quarter turn J. It sends e one to e two and e two to minus e one; it is written e one wedge e two. Do it twice and every vector points the other way: J squared is minus one.'],
    [26, 'Knowing the velocity at every moment determines the whole motion. The answer is cos theta times v plus sin theta times J v. Adding up infinitely many tiny quarter turns is exponentiating: the rotation by theta is e to the theta J.'],
  ],
  header: { eyebrow: '04 · ROTATIONS IN THE PLANE', title: 'Every rotation is built from a quarter turn' },
  draw(ctx, t) {
    // axes and the unit circle
    line(ctx, G.X(-1.35), G.Y(0), G.X(1.35), G.Y(0), { color: color.line, width: 1.4 });
    line(ctx, G.X(0), G.Y(-1.35), G.X(0), G.Y(1.35), { color: color.line, width: 1.4 });
    ring(ctx, G.cx, G.cy, G.unit, color.dim, seg(t, 0, 1), 1.4);

    // phase 1: rotating vector with its velocity
    const p1 = fade(t, 0.5, 1.5, 11.5, 12.5);
    const th = 0.5 + 0.55 * Math.max(0, t - 1);
    const vx = Math.cos(th);
    const vy = Math.sin(th);
    arrow(ctx, G.cx, G.cy, G.X(vx), G.Y(vy), { color: color.ink, width: 4, head: 15, alpha: p1 });
    arrow(ctx, G.X(vx), G.Y(vy), G.X(vx - 0.55 * vy), G.Y(vy + 0.55 * vx), { color: color.gold, width: 4, head: 14, alpha: p1 * seg(t, 3, 4) });
    text(ctx, 'v(θ)', G.X(vx * 0.55) + 12, G.Y(vy * 0.55), { ...type.math, size: 24, alpha: p1 });
    text(ctx, "v'(θ)", G.X(vx - 0.6 * vy) + 8, G.Y(vy + 0.6 * vx) - 8, { ...type.math, size: 24, color: color.gold, alpha: p1 * seg(t, 3, 4) });

    // phase 2: J applied twice
    const p2 = fade(t, 12.5, 13.5, 25.5, 26.5);
    const b = 0.45;
    const steps: [number, number, string, string][] = [[Math.cos(b), Math.sin(b), 'v', color.ink], [-Math.sin(b), Math.cos(b), 'Jv', color.gold], [-Math.cos(b), -Math.sin(b), 'J²v = −v', color.rose]];
    steps.forEach(([x, y, name, c], k) => {
      const a = p2 * seg(t, 13 + 3 * k, 14 + 3 * k);
      arrow(ctx, G.cx, G.cy, G.X(x), G.Y(y), { color: c, width: 4, head: 15, alpha: a });
      text(ctx, name, G.X(1.12 * x) + (x < 0 ? -10 : 8), G.Y(1.12 * y), { ...type.math, size: 24, color: c, align: x < 0 ? 'right' : 'left', alpha: a });
    });

    // phase 3: cos θ v + sin θ Jv
    const p3 = seg(t, 26.5, 27.5);
    if (p3 > 0.01) {
      const theta = TAU * lin(t, 28, 40) * 0.85 + 0.15;
      const c = Math.cos(theta);
      const s = Math.sin(theta);
      const v = [1, 0];
      const jv = [0, 1];
      arrow(ctx, G.cx, G.cy, G.X(v[0]), G.Y(v[1]), { color: color.muted, width: 2.4, head: 11, alpha: p3 });
      arrow(ctx, G.cx, G.cy, G.X(jv[0]), G.Y(jv[1]), { color: color.gold, width: 2.4, head: 11, alpha: p3 * 0.7 });
      text(ctx, 'v', G.X(1.06), G.Y(0) + 26, { ...type.math, size: 22, color: color.muted, alpha: p3 });
      text(ctx, 'Jv', G.X(0) + 10, G.Y(1.08), { ...type.math, size: 22, color: color.gold, alpha: p3 });
      line(ctx, G.X(c), G.Y(0), G.X(c), G.Y(s), { color: color.gold, dash: [4, 5], alpha: p3 });
      line(ctx, G.X(0), G.Y(s), G.X(c), G.Y(s), { color: color.muted, dash: [4, 5], alpha: p3 });
      arrow(ctx, G.cx, G.cy, G.X(c), G.Y(s), { color: color.soft, width: 4.5, head: 16, alpha: p3 });
      dot(ctx, G.X(c), G.Y(s), 5, color.soft, p3);
      text(ctx, `θ = ${((theta * 180) / Math.PI).toFixed(0)}°`, G.cx, G.cy + G.unit + 60, { font: font.mono, size: 20, color: color.soft, align: 'center', alpha: p3 });
    }

    const x0 = 900;
    wrap(ctx, 'The velocity of a turning vector is the vector turned by a right angle:', x0, 270, 620, 32, { ...type.body, alpha: fade(t, 4, 5, 11.5, 12.5) });
    VELOCITY.draw(ctx, x0, 380, { size: 34, alpha: seg(t, 6, 7) });
    WEDGE.draw(ctx, x0, 470, { size: 28, alpha: seg(t, 13, 14) });
    SQUARE.draw(ctx, x0, 550, { size: 36, color: color.rose, alpha: seg(t, 19, 20) });
    SOLUTION.draw(ctx, x0, 660, { size: 30, color: color.soft, alpha: seg(t, 27, 28) });
    wrap(ctx, 'A rotation is the quarter turn, exponentiated: the quarter turn generates all rotations of the plane.', x0, 740, 620, 30, { ...type.body, size: 21, alpha: seg(t, 33, 34) });
  },
});
