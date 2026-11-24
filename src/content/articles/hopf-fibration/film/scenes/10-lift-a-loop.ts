import { defineScene, seg, fade, text, wrap, type, color, hopf, polyline3, ring as circle, dot, drawSurface, tex } from '@/stage/kit';
import type { Vec3 } from '@/stage/kit';
import {
  spaceCamera, globeCamera, drawGlobe, drawGlobeCurve, globePoint, drawFibres, drawHopfTorus, fibreColor, s3ToWorld, panel, up,
  VERTICAL, HORIZONTAL, TAU,
} from '../shared';

interface Phase {
  polar: number;
  name: string;
  loop: Vec3[];
  lift: (Vec3 | null)[];
  gamma: number;
  omega: number;
}
const N = 720;
const phase = (polar: number, name: string): Phase => {
  const loop = hopf.latitudeLoop(polar, N);
  const { gamma, points } = hopf.holonomy(loop, 0);
  return { polar, name, loop, lift: points.map((q) => s3ToWorld(q, 6)), gamma: gamma < 0 ? gamma + TAU : gamma, omega: TAU * (1 - Math.cos(polar)) };
};
const A = phase(Math.PI / 3, 'the 60° latitude');
const B = phase(Math.PI / 2, 'the equator');
const SHIFTED = tex(String.raw`e^{i\gamma} q`, 'e^{iγ}q');
const MINUS = tex('-q', '−q');
const deg = (x: number) => `${((x * 180) / Math.PI).toFixed(1)}°`;
const cap = (u: number, v: number): Vec3 => up(hopf.spherePoint(u, v)).map((x) => x * 1.003) as Vec3;

export default defineScene({
  name: 'Lift a loop',
  duration: 56,
  narration: [
    [0, 'Now walk once around a loop on the sphere, here the circle of latitude sixty degrees, and follow it upstairs, always horizontally.'],
    [6, 'Downstairs the point goes once around. Upstairs it runs along the torus, crossing every fibre at right angles.'],
    [21, 'Back at the start downstairs, the lifted point is on the same fibre, but not at the same place: it has slipped a quarter of the way around. That shift is the holonomy of the loop.'],
    [31, 'Now the equator. This time the lift slips half-way round the fibre and comes back as minus q, the antipodal point of S³. Go round twice and it closes.'],
  ],
  header: { eyebrow: '07 · HOLONOMY', title: 'Walk a loop, always horizontally' },
  beats: [[31, 'The equator']],
  draw(ctx, t) {
    const second = t >= 30;
    const ph = second ? B : A;
    const t0 = second ? 30 : 0;
    const u = seg(t, t0 + 5, t0 + 19);
    const k = Math.round(u * N);
    const shown = fade(t, t0 + 0.2, t0 + 1.2, second ? 99 : 29, second ? 100 : 30);
    const gcam = globeCamera({ cx: 270, cy: 520, scale: 165, yaw: 0.6, pitch: 0.55 });
    const cam = spaceCamera({ cx: 900, cy: 520, scale: second ? 102 : 116, yaw: 0.4 + 0.01 * t, pitch: 0.55 });

    // the globe: the loop, the enclosed cap, the walking base point
    drawGlobe(ctx, gcam, { alpha: seg(t, 0, 0.8) });
    ctx.save();
    ctx.globalAlpha = 0.28 * shown * seg(t, t0 + 19, t0 + 21);
    drawSurface(ctx, gcam, cap, { nu: 14, nv: 36, u: [0, ph.polar], v: [0, TAU], color: () => '#f2cf63', ambient: 0.8 });
    ctx.restore();
    drawGlobeCurve(ctx, gcam, ph.loop, { color: color.ink, width: 2.4, alpha: shown });
    globePoint(ctx, gcam, ph.loop[k], fibreColor(ph.loop[k]), { r: 8, alpha: shown });

    // upstairs: the torus over the loop, the start fibre, the current fibre, the lift
    drawHopfTorus(ctx, cam, ph.polar, { alpha: 0.13 * shown, nu: 48, nv: 24 });
    const done = seg(t, t0 + 19.5, t0 + 22);
    drawFibres(ctx, cam, [
      { p: ph.loop[0], color: VERTICAL, width: 2.4, alpha: 0.75 * shown },
      { p: ph.loop[k], width: 3, alpha: shown * (1 - done) },
    ], { limit: 5 });
    // the shift along the start fibre: from q to e^{iγ}q
    drawFibres(ctx, cam, [{ p: ph.loop[0], color: VERTICAL, width: 7, alpha: shown * done, progress: (ph.gamma / TAU) * seg(t, t0 + 21, t0 + 24), samples: 240 }], { limit: 5, halo: false, depthCue: 0 });
    polyline3(ctx, cam, ph.lift, { color: HORIZONTAL, width: 3.4, alpha: shown, progress: u });
    const start = ph.lift[0];
    const now = ph.lift[k];
    if (start) {
      const s = cam.project(start);
      circle(ctx, s.x, s.y, 12, color.ink, shown, 2.4);
      text(ctx, 'q', s.x - 30, s.y - 12, { ...type.math, size: 26, alpha: shown });
    }
    if (now) {
      const s = cam.project(now);
      dot(ctx, s.x, s.y, 6, color.ink, shown);
      if (done > 0) {
        circle(ctx, s.x, s.y, 14, color.gold, shown * done, 2.8);
        (second ? MINUS : SHIFTED).draw(ctx, s.x + 20, s.y + 26, { size: 24, color: color.gold, alpha: shown * done });
      }
    }

    const x = 1230;
    panel(ctx, x, 230, 320, [
      { label: 'loop', value: ph.name },
      { label: 'walked', value: `${(u * 100).toFixed(0)} %` },
      { label: 'solid angle Ω', value: `${(ph.omega / Math.PI).toFixed(2)} π` },
      { label: 'holonomy γ', value: done > 0.5 ? deg(ph.gamma) : '…', color: color.gold },
      { label: 'Ω / 2', value: done > 0.5 ? deg(ph.omega / 2) : '…' },
    ], { title: 'measured', alpha: shown });
    wrap(ctx, second ? 'Half a turn: the lift comes back to −q.' : 'A quarter turn along the fibre.', x, 520, 320, 32, { ...type.display, size: 24, color: color.gold, alpha: shown * seg(t, t0 + 23, t0 + 24) });
    wrap(ctx, 'The shaded cap is the solid angle the loop encloses on its left.', x, 620, 320, 28, { ...type.body, size: 19, alpha: shown * seg(t, t0 + 20, t0 + 21) });
  },
});
