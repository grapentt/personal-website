// Explorable: a point of S³ as two dials (z₁, z₂), its image h(q) on S², and its place in the room.
import { defineScene, text, wrap, type, color, font, hopf, slider, toggle, dot, ring as circle } from '@/stage/kit';
import {
  drawDials, globeCamera, drawGlobe, globePoint, spaceCamera, drawFibres, drawAxes, fibreColor, s3ToWorld, panel,
} from '../film/shared';

const fmt = (x: number) => (x < 0 ? `−${Math.abs(x).toFixed(2)}` : ` ${x.toFixed(2)}`);
const complex = (re: number, im: number) => `${fmt(re)} ${im < 0 ? '−' : '+'} ${Math.abs(im).toFixed(2)} i`;

export default defineScene({
  name: 'Two dials, one point',
  duration: 600,
  controls: {
    balance: slider('Balance ϑ', { min: 0, max: 180, value: 70, lens: true, digits: 0, unit: '°' }),
    alpha: slider('Dial z₁: angle α', { min: -180, max: 180, value: 30, lens: true, digits: 0, unit: '°' }),
    beta: slider('Dial z₂: angle β', { min: -180, max: 180, value: -60, lens: true, digits: 0, unit: '°' }),
    turn: toggle('Turn both dials (e^{iθ})', { value: true, lens: true }),
  },
  draw(ctx, t, { input }) {
    const polar = ((input.balance as number) * Math.PI) / 180;
    const theta = input.turn ? 0.6 * t : 0;
    const a1 = ((input.alpha as number) * Math.PI) / 180 + theta;
    const a2 = ((input.beta as number) * Math.PI) / 180 + theta;
    const r1 = Math.cos(polar / 2);
    const r2 = Math.sin(polar / 2);
    const q: hopf.S3Point = [r1 * Math.cos(a1), r1 * Math.sin(a1), r2 * Math.cos(a2), r2 * Math.sin(a2)];
    const p = hopf.hopf(q);
    const tint = fibreColor(p);

    text(ctx, 'THE TWO DIALS', 300, 150, { ...type.eyebrow, size: 15, align: 'center' });
    drawDials(ctx, { x: 300, y: 330, size: 92, gap: 54, state: { r1, r2, a1, a2 }, hand: tint });
    text(ctx, `|z₁|² + |z₂|² = ${(r1 * r1 + r2 * r2).toFixed(2)}`, 300, 470, { font: font.mono, size: 16, color: color.muted, align: 'center' });

    text(ctx, 'THE BASE POINT h(q) ON S²', 300, 560, { ...type.eyebrow, size: 15, align: 'center' });
    const gcam = globeCamera({ cx: 300, cy: 720, scale: 120, yaw: 0.6, pitch: 0.4 });
    drawGlobe(ctx, gcam, { grid: 0.7 });
    globePoint(ctx, gcam, p, tint, { r: 9 });

    text(ctx, 'THE POINT IN THE ROOM, ON ITS FIBRE', 1000, 150, { ...type.eyebrow, size: 15, align: 'center' });
    const cam = spaceCamera({ cx: 1000, cy: 520, scale: 120, yaw: 0.5, pitch: 0.42 });
    drawAxes(ctx, cam, { alpha: 0.35, length: 2.2 });
    drawFibres(ctx, cam, [{ p, width: 3.2 }], { limit: 3.4 });
    const w = s3ToWorld(q, 3.4);
    const s = w ? cam.project(w) : null;
    if (s) {
      circle(ctx, s.x, s.y, 13, color.gold, 1, 2.4);
      dot(ctx, s.x, s.y, 5, color.ink);
    } else text(ctx, 'q is at the lamp: its image is at infinity', 1000, 840, { ...type.note, align: 'center' });

    panel(ctx, 1290, 220, 280, [
      { label: 'z₁', value: complex(q[0], q[1]) },
      { label: 'z₂', value: complex(q[2], q[3]) },
      { label: 'h(q)ₓ', value: fmt(p[0]) },
      { label: 'h(q)ᵧ', value: fmt(p[1]) },
      { label: 'h(q)_z', value: fmt(p[2]) },
      { label: 'latitude', value: `${((Math.acos(Math.max(-1, Math.min(1, p[2]))) * 180) / Math.PI).toFixed(0)}°`, color: color.gold },
      { label: 'longitude', value: `${((((Math.atan2(p[1], p[0]) * 180) / Math.PI) + 360) % 360).toFixed(0)}°`, color: color.gold },
    ], { title: 'read-out' });
    wrap(ctx, 'Turning both dials moves q along its fibre; h(q) on the sphere stays put.', 1290, 610, 280, 26, { ...type.body, size: 17 });
    text(ctx, 'angle between the dials', 1290, 700, { font: font.mono, size: 14, color: color.muted });
    text(ctx, `α − β = ${((((a1 - a2) * 180) / Math.PI % 360 + 540) % 360 - 180).toFixed(0)}°`, 1290, 726, { font: font.mono, size: 18, color: color.gold });
  },
});
