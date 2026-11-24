import { defineScene, seg, fade, text, wrap, type, color, font, arrow, line, ring, tex } from '@/stage/kit';
import { plane } from '../shared';

const G = plane(460, 560, 120);
const IDENT = tex(String.raw`(a, b) \;\longleftrightarrow\; a + b\,J, \qquad J \to i`, '(a, b) ↔ a + bJ,  J → i');
const PRODUCT = tex(String.raw`r_1 e^{i\theta_1} \cdot r_2 e^{i\theta_2} = r_1 r_2\, e^{i(\theta_1 + \theta_2)}`, 'r₁e^{iθ₁} · r₂e^{iθ₂} = r₁r₂ e^{i(θ₁+θ₂)}');
const RULE = tex(String.raw`(a + bi)(c + di) = (ac - bd) + (ad + bc)\,i`, '(a + bi)(c + di) = (ac − bd) + (ad + bc) i');

function arc(ctx: CanvasRenderingContext2D, from: number, to: number, r: number, c: string, alpha: number) {
  if (alpha <= 0.003 || Math.abs(to - from) < 0.01) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.strokeStyle = c;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(G.cx, G.cy, r, -from, -to, to > from);
  ctx.stroke();
  ctx.restore();
}

export default defineScene({
  name: 'Complex numbers',
  duration: 36,
  narration: [
    [0, 'Because every rotation of the plane is cos theta plus sin theta J, every point of the plane can be read as a rotation followed by a stretch. Write the point a, b as a plus b J. Mathematicians call J by another name: i.'],
    [12, 'Now multiplying points means composing rotations and stretches: the lengths multiply, and the angles add. That is all there is to complex multiplication.'],
    [26, 'This works because rotations of the plane leave no direction fixed. Keep that in mind: it is exactly what will go wrong in three dimensions.'],
  ],
  header: { eyebrow: '05 · COMPLEX NUMBERS', title: 'Multiplying is rotating and stretching' },
  draw(ctx, t) {
    line(ctx, G.X(-2.6), G.Y(0), G.X(2.6), G.Y(0), { color: color.line, width: 1.4 });
    line(ctx, G.X(0), G.Y(-2.4), G.X(0), G.Y(2.4), { color: color.line, width: 1.4 });
    ring(ctx, G.cx, G.cy, G.unit, color.dim, 1, 1.2);
    text(ctx, '1', G.X(1) + 6, G.Y(0) + 22, { font: font.mono, size: 15, color: color.muted });
    text(ctx, 'i', G.X(0) + 8, G.Y(1) - 6, { ...type.math, size: 22, color: color.muted });

    const r1 = 1.35;
    const t1 = 0.55;
    const r2 = 1.25;
    const t2 = 0.35 + 0.9 * Math.sin(0.4 * Math.max(0, t - 12)) * seg(t, 12, 13);
    const show = seg(t, 1, 2);
    const z = [r1 * Math.cos(t1), r1 * Math.sin(t1)];
    const w = [r2 * Math.cos(t2), r2 * Math.sin(t2)];
    const zw = [r1 * r2 * Math.cos(t1 + t2), r1 * r2 * Math.sin(t1 + t2)];
    arrow(ctx, G.cx, G.cy, G.X(z[0]), G.Y(z[1]), { color: color.gold, width: 4, head: 15, alpha: show });
    text(ctx, 'z', G.X(z[0]) + 10, G.Y(z[1]), { ...type.math, size: 26, color: color.gold, alpha: show });
    const p = seg(t, 12, 13);
    arrow(ctx, G.cx, G.cy, G.X(w[0]), G.Y(w[1]), { color: color.soft, width: 4, head: 15, alpha: p });
    text(ctx, 'w', G.X(w[0]) + 10, G.Y(w[1]) + 10, { ...type.math, size: 26, color: color.soft, alpha: p });
    arrow(ctx, G.cx, G.cy, G.X(zw[0]), G.Y(zw[1]), { color: color.rose, width: 4.5, head: 16, alpha: p });
    text(ctx, 'zw', G.X(zw[0]) + 10, G.Y(zw[1]) - 6, { ...type.math, size: 26, color: color.rose, alpha: p });
    arc(ctx, 0, t1, 46, color.gold, show);
    arc(ctx, 0, t2, 70, color.soft, p);
    arc(ctx, 0, t1 + t2, 94, color.rose, p);

    const x0 = 900;
    IDENT.draw(ctx, x0, 270, { size: 28, alpha: seg(t, 4, 5) });
    PRODUCT.draw(ctx, x0, 370, { size: 28, alpha: seg(t, 13, 14) });
    text(ctx, `|zw| = ${r1.toFixed(2)} · ${r2.toFixed(2)} = ${(r1 * r2).toFixed(2)}`, x0, 450, { font: font.mono, size: 19, color: color.rose, alpha: p });
    text(ctx, `angle = ${((t1 * 180) / Math.PI).toFixed(0)}° + ${((t2 * 180) / Math.PI).toFixed(0)}° = ${(((t1 + t2) * 180) / Math.PI).toFixed(0)}°`, x0, 482, { font: font.mono, size: 19, color: color.rose, alpha: p });
    RULE.draw(ctx, x0, 560, { size: 24, alpha: seg(t, 18, 19) });
    text(ctx, 'with i² = −1, i.e. J² = −1', x0, 604, { ...type.note, alpha: seg(t, 18.5, 19.5) });
    wrap(ctx, 'It works because no rotation of the plane (other than doing nothing) fixes a direction.', x0, 690, 620, 32, { ...type.body, size: 21, color: color.gold, alpha: fade(t, 27, 28, 35.4, 36) });
  },
});
