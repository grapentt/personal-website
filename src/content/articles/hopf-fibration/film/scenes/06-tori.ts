import { defineScene, seg, fade, lerp, text, wrap, type, color, font, tex, hopf } from '@/stage/kit';
import type { Vec3 } from '@/stage/kit';
import { spaceCamera, globeCamera, drawGlobe, drawGlobeCurve, globePoint, drawFibres, drawHopfTorus, fibreColor, ring, panel } from '../shared';

const SIZES = tex(String.raw`\text{core radius } \sec\tfrac{\vartheta}{2}, \qquad \text{tube radius } \tan\tfrac{\vartheta}{2}`, 'core sec(ϑ/2), tube tan(ϑ/2)');
const COUNT = 22;
/** The latitude ϑ (from the north pole) over time. */
function polarAt(t: number) {
  if (t < 15) return 1.05;
  if (t < 21) return lerp(1.05, 0.32, seg(t, 15, 21));
  if (t < 29) return lerp(0.32, 1.95, seg(t, 21, 29));
  return lerp(1.95, 1.05, seg(t, 29, 32));
}
const NESTED = [0.5, 1.15, 1.8];
/** Cut a wedge out of the nested tori, so the inner ones show. */
const cutaway = (x: Vec3) => {
  const a = Math.atan2(x[1], x[0]);
  return !(a > -0.35 && a < 1.45);
};

export default defineScene({
  name: 'Tori of circles',
  duration: 44,
  narration: [
    [0, 'Bring back the dials. Fix their balance, the ratio of their lengths, and let the angle between them go once around. Each setting gives a fibre.'],
    [9, 'Together these fibres fill a torus, and every one of them winds once around it the long way and once the short way: they are Villarceau circles.'],
    [15, 'Tip the balance towards z one and the torus shrinks onto the unit circle. Tip it towards z two and it swells until it wraps around the vertical axis.'],
    [32, 'So the room is filled with nested tori, each one woven from linked circles, around the two special fibres. That is the whole of S³.'],
  ],
  header: { eyebrow: '04 · TORI', title: 'Fibres with the same balance fill a torus' },
  draw(ctx, t) {
    const polar = polarAt(t);
    const nested = seg(t, 32, 34);
    const gcam = globeCamera({ cx: 250, cy: 540, scale: 130, yaw: 0.6, pitch: 0.42 });
    const cam = spaceCamera({ cx: 900, cy: 530, scale: lerp(104, 96, nested), yaw: 0.5 + 0.012 * t, pitch: 0.5 });
    const bases = ring(polar, COUNT, 0.15);

    // the globe: the latitude and its points
    drawGlobe(ctx, gcam, { alpha: seg(t, 0.2, 1.2) * (1 - nested), grid: 0.6 });
    drawGlobeCurve(ctx, gcam, hopf.latitudeLoop(polar, 120), { color: color.ink, width: 1.6, alpha: 0.7 * seg(t, 0.8, 1.8) * (1 - nested) });
    bases.forEach((p, k) => globePoint(ctx, gcam, p, fibreColor(p), { r: 5, alpha: seg(t, 1 + 0.3 * k, 1.4 + 0.3 * k) * (1 - nested) }));
    text(ctx, 'base points', 250, 760, { ...type.note, align: 'center', alpha: seg(t, 1, 2) * (1 - nested) });

    if (nested < 1) {
      drawHopfTorus(ctx, cam, polar, { alpha: 0.32 * seg(t, 10, 12) * (1 - nested) });
      drawFibres(ctx, cam, bases.map((p, k) => ({ p, width: 2.6, alpha: seg(t, 1 + 0.3 * k, 1.8 + 0.3 * k) * (1 - nested) })), { limit: 9 });
    }
    if (nested > 0) {
      NESTED.forEach((pol, k) => drawHopfTorus(ctx, cam, pol, { alpha: (0.22 + 0.06 * k) * nested, keep: cutaway, nu: 64, nv: 30 }));
      const fibres = NESTED.flatMap((pol, k) => ring(pol, 9 + 3 * k, 0.3 * k).map((p) => ({ p, width: 2.2, alpha: nested * seg(t, 34 + k, 35 + k), keep: cutaway })));
      drawFibres(ctx, cam, [
        { p: hopf.spherePoint(0, 0), color: color.ink, width: 3, alpha: nested },
        { p: hopf.spherePoint(Math.PI, 0), color: color.ink, width: 3, alpha: nested },
        ...fibres,
      ], { limit: 3.3 });
    }

    const x0 = 1260;
    SIZES.draw(ctx, x0 - 30, 250, { size: 20, alpha: fade(t, 12, 13, 31, 32) });
    panel(ctx, x0, 300, 290, [
      { label: 'latitude ϑ', value: `${((polar * 180) / Math.PI).toFixed(0)}°` },
      { label: '|z₁|', value: Math.cos(polar / 2).toFixed(3) },
      { label: '|z₂|', value: Math.sin(polar / 2).toFixed(3) },
      { label: 'core', value: (1 / Math.cos(polar / 2)).toFixed(2), color: color.gold },
      { label: 'tube', value: Math.tan(polar / 2).toFixed(2), color: color.gold },
    ], { title: 'this torus', alpha: fade(t, 12.5, 13.5, 31, 32) });
    wrap(ctx, 'core² − tube² = 1 for every one of them.', x0, 580, 290, 28, { font: font.mono, size: 16, color: color.muted, alpha: fade(t, 14, 15, 31, 32) });
    wrap(ctx, 'Nested tori fill the room; the unit circle and the vertical axis are their cores.', x0, 300, 290, 32, { ...type.body, size: 21, alpha: seg(t, 34, 35) });
    wrap(ctx, 'Each fibre winds once each way around its torus: a Villarceau circle.', x0, 480, 290, 32, { ...type.body, size: 21, color: color.gold, alpha: seg(t, 37, 38) });
  },
});
