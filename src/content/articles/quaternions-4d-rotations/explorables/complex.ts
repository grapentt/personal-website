// Explorable: multiplying two complex numbers multiplies their lengths and adds their angles.
import { defineScene, text, type, color, font, slider, arrow, line, ring } from '@/stage/kit';
import { plane } from '../film/shared';

const G = plane(560, 470, 115);
const deg = (r: number) => (r * 180) / Math.PI;
const wrapDeg = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180;
const fmtC = (re: number, im: number) => `${re < 0 ? '−' : ''}${Math.abs(re).toFixed(2)} ${im < 0 ? '−' : '+'} ${Math.abs(im).toFixed(2)} i`;

function arc(ctx: CanvasRenderingContext2D, angle: number, r: number, c: string) {
  if (Math.abs(angle) < 0.01) return;
  ctx.save();
  ctx.strokeStyle = c;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(G.cx, G.cy, r, 0, -angle, angle > 0);
  ctx.stroke();
  ctx.restore();
}

export default defineScene({
  name: 'Multiply two complex numbers',
  duration: 600,
  controls: {
    rz: slider('|z|', { min: 0.2, max: 2, value: 1.3, lens: true, digits: 2 }),
    az: slider('angle of z', { min: -180, max: 180, value: 35, lens: true, digits: 0, unit: '°' }),
    rw: slider('|w|', { min: 0.2, max: 2, value: 1.15, lens: true, digits: 2 }),
    aw: slider('angle of w', { min: -180, max: 180, value: 60, lens: true, digits: 0, unit: '°' }),
  },
  draw(ctx, _t, { input }) {
    const rz = input.rz as number;
    const rw = input.rw as number;
    const az = ((input.az as number) * Math.PI) / 180;
    const aw = ((input.aw as number) * Math.PI) / 180;
    const z = [rz * Math.cos(az), rz * Math.sin(az)];
    const w = [rw * Math.cos(aw), rw * Math.sin(aw)];
    const zw = [z[0] * w[0] - z[1] * w[1], z[0] * w[1] + z[1] * w[0]];
    const extent = 3.4;
    for (let k = -3; k <= 3; k++) {
      line(ctx, G.X(-extent), G.Y(k), G.X(extent), G.Y(k), { color: k ? color.grid : color.muted, width: k ? 1 : 1.6 });
      line(ctx, G.X(k), G.Y(-extent), G.X(k), G.Y(extent), { color: k ? color.grid : color.muted, width: k ? 1 : 1.6 });
    }
    ring(ctx, G.cx, G.cy, G.unit, color.dim, 1, 1.2);
    arc(ctx, az, 40, color.gold);
    arc(ctx, aw, 62, color.soft);
    arc(ctx, az + aw, 84, color.rose);
    const vec = (v: number[], c: string, name: string) => {
      arrow(ctx, G.cx, G.cy, G.X(v[0]), G.Y(v[1]), { color: c, width: 4, head: 15 });
      text(ctx, name, G.X(v[0]) + 10, G.Y(v[1]) - 6, { ...type.math, size: 26, color: c });
    };
    vec(z, color.gold, 'z');
    vec(w, color.soft, 'w');
    vec(zw, color.rose, 'zw');

    const x0 = 1080;
    const row = (label: string, value: string, y: number, c: string = color.ink) => {
      text(ctx, label, x0, y, { font: font.mono, size: 16, color: color.muted });
      text(ctx, value, x0 + 440, y, { font: font.mono, size: 18, color: c, align: 'right' });
    };
    text(ctx, 'READ-OUT', x0, 200, { ...type.eyebrow, size: 13 });
    row('z', fmtC(z[0], z[1]), 250, color.gold);
    row('w', fmtC(w[0], w[1]), 290, color.soft);
    row('zw', fmtC(zw[0], zw[1]), 330, color.rose);
    row('|z| · |w|', `${rz.toFixed(2)} · ${rw.toFixed(2)} = ${(rz * rw).toFixed(2)}`, 400);
    row('|zw|', Math.hypot(zw[0], zw[1]).toFixed(2), 440, color.rose);
    row('angle z + angle w', `${wrapDeg(deg(az + aw)).toFixed(0)}°`, 510);
    row('angle of zw', `${deg(Math.atan2(zw[1], zw[0])).toFixed(0)}°`, 550, color.rose);
    text(ctx, 'Lengths multiply, angles add.', x0, 640, { ...type.display, size: 26, color: color.gold });
    text(ctx, 'Try |w| = 1, angle 90°: multiplying by i', x0, 690, { ...type.body, size: 18 });
    text(ctx, 'is exactly the quarter turn J.', x0, 716, { ...type.body, size: 18 });
  },
});
