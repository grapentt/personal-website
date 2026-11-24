import { defineScene, seg, fade, text, wrap, type, color, font, quaternion, roundRect, arrow } from '@/stage/kit';
import { filmCamera, drawTesseract, doubleRotation, Vec4 } from '../shared';

const NAMES = ['1', 'i', 'j', 'k'];
const BASIS: Vec4[] = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
const nameOf = (q: Vec4) => {
  const k = q.findIndex((x) => Math.abs(x) > 0.5);
  return `${q[k] < 0 ? '−' : ''}${NAMES[k]}`;
};
const TABLE = NAMES.map((_, r) => NAMES.map((__, c) => nameOf(quaternion.multiply(BASIS[r], BASIS[c]) as Vec4)));

export default defineScene({
  name: 'Quaternions',
  duration: 44,
  narration: [
    [0, 'Now we can do what we did with complex numbers. A left-isoclinic rotation is a point of S³, so every point of R four can be read as an isoclinic rotation followed by a stretch. That defines a multiplication.'],
    [12, 'Its rules fit in one line, which William Rowan Hamilton carved into a bridge in Dublin in 1843: i squared equals j squared equals k squared equals i j k equals minus one.'],
    [22, 'Going around the circle i, j, k in its direction gives the next one: i j is k. Going against it gives a minus sign: j i is minus k. The order matters.'],
    [32, 'Multiplying from the left by a unit quaternion is a left-isoclinic rotation; multiplying from the right is a right-isoclinic one. These are the quaternions: four-dimensional numbers.'],
  ],
  header: { eyebrow: '10 · QUATERNIONS', title: 'Four-dimensional numbers' },
  draw(ctx, t) {
    // the multiplication table
    const x0 = 130;
    const y0 = 250;
    const cell = 82;
    const a = seg(t, 12, 13);
    if (a > 0.01) {
      ctx.save();
      ctx.globalAlpha = a;
      NAMES.forEach((n, k) => {
        text(ctx, n, x0 + cell * (k + 1) + cell / 2, y0 + cell / 2, { font: font.display, italic: true, size: 26, color: color.muted, align: 'center', baseline: 'middle' });
        text(ctx, n, x0 + cell / 2, y0 + cell * (k + 1) + cell / 2, { font: font.display, italic: true, size: 26, color: color.muted, align: 'center', baseline: 'middle' });
      });
      ctx.restore();
      TABLE.forEach((row, r) => row.forEach((entry, c) => {
        const at = 13 + 0.35 * (4 * r + c);
        const cx = x0 + cell * (c + 1);
        const cy = y0 + cell * (r + 1);
        const e = seg(t, at, at + 0.5);
        ctx.save();
        ctx.globalAlpha = e;
        ctx.fillStyle = entry.startsWith('−') ? 'rgba(232,122,166,0.12)' : 'rgba(108,196,232,0.08)';
        roundRect(ctx, cx + 4, cy + 4, cell - 8, cell - 8, 8);
        ctx.fill();
        ctx.restore();
        text(ctx, entry, cx + cell / 2, cy + cell / 2, { font: font.display, italic: true, size: 28, color: entry.startsWith('−') ? color.rose : color.ink, align: 'center', baseline: 'middle', alpha: e });
      }));
      text(ctx, 'row × column', x0 + cell * 2.5, y0 + cell * 5 + 34, { ...type.note, align: 'center', alpha: a });
    }

    // the cycle i → j → k
    const cyc = seg(t, 22, 23);
    const ccx = 1000;
    const ccy = 360;
    const r = 110;
    const at = (k: number): [number, number] => [ccx + r * Math.cos(-Math.PI / 2 + (k * 2 * Math.PI) / 3), ccy + r * Math.sin(-Math.PI / 2 + (k * 2 * Math.PI) / 3)];
    ['i', 'j', 'k'].forEach((n, k) => {
      const [px, py] = at(k);
      const [qx, qy] = at(k + 1);
      const mx = (px + qx) / 2;
      const my = (py + qy) / 2;
      const dx = (qx - px) * 0.32;
      const dy = (qy - py) * 0.32;
      arrow(ctx, mx - dx + (mx - ccx) * 0.15, my - dy + (my - ccy) * 0.15, mx + dx + (mx - ccx) * 0.15, my + dy + (my - ccy) * 0.15, { color: color.gold, width: 3, head: 13, alpha: cyc });
      text(ctx, n, px, py, { font: font.display, italic: true, size: 40, color: color.ink, align: 'center', baseline: 'middle', alpha: cyc });
    });
    text(ctx, 'ij = k,  jk = i,  ki = j', ccx + 200, ccy - 20, { font: font.mono, size: 20, color: color.gold, alpha: cyc });
    text(ctx, 'ji = −k,  kj = −i,  ik = −j', ccx + 200, ccy + 20, { font: font.mono, size: 20, color: color.rose, alpha: seg(t, 25, 26) });
    wrap(ctx, 'i² = j² = k² = ijk = −1', 1180, 260, 400, 30, { font: font.display, italic: true, size: 30, color: color.ink, alpha: fade(t, 14, 15, 21, 22) });

    // left and right multiplication on a tesseract
    const lr = seg(t, 32, 33);
    if (lr > 0.01) {
      const th = 0.45 * (t - 32);
      const camL = filmCamera({ cx: 880, cy: 680, scale: 72, yaw: 0.55, pitch: 0.38 });
      const camR = filmCamera({ cx: 1300, cy: 680, scale: 72, yaw: 0.55, pitch: 0.38 });
      drawTesseract(ctx, camL, (p) => doubleRotation(p, th, th), { alpha: lr, width: 2.2 });
      drawTesseract(ctx, camR, (p) => doubleRotation(p, th, -th), { alpha: lr, width: 2.2 });
      text(ctx, 'q · v: left-isoclinic', 880, 850, { ...type.note, align: 'center', color: color.ink, alpha: lr });
      text(ctx, 'v · q: right-isoclinic', 1300, 850, { ...type.note, align: 'center', color: color.ink, alpha: lr });
    }
    text(ctx, 'Every point of ℝ⁴ = an isoclinic rotation × a stretch', 130, 230, { ...type.note, alpha: fade(t, 2, 3, 11, 12) });
  },
});
