import { defineScene, seg, fade, text, wrap, type, color, tex } from '@/stage/kit';
import { spaceCamera, globeCamera, drawGlobe, globePoint, drawFibres, fibreColor, spread } from '../shared';

const BASES = spread(28, 2.2);
const HOPF = tex(String.raw`h(z_1, z_2) = \big(2\,\mathrm{Re}\, z_1 \bar z_2,\; 2\,\mathrm{Im}\, z_1 \bar z_2,\; |z_1|^2 - |z_2|^2\big)`, 'h(z₁, z₂) = (2 Re z₁z̄₂, 2 Im z₁z̄₂, |z₁|² − |z₂|²)');
const BUNDLE = tex(String.raw`S^1 \hookrightarrow S^3 \xrightarrow{\;h\;} S^2`, 'S¹ ↪ S³ →h S²');
const COUNT = tex(String.raw`3 = 2 + 1`, '3 = 2 + 1');

export default defineScene({
  name: 'Naming the map',
  duration: 40,
  narration: [
    [0, 'Every fibre can be labelled by one point of an ordinary sphere: the balance of the two dials gives a latitude, the angle between them a longitude. Colour each fibre by its label.'],
    [12, 'That labelling is the Hopf map h. It keeps the balance and the angle between the dials and forgets their common turn, which is exactly the motion along a fibre.'],
    [24, 'So S³ is a sphere’s worth of circles: three dimensions, two for the sphere and one for the circle. A fibre bundle with fibre S¹ over the base S².'],
    [32, 'But it is not the product of a sphere and a circle. In a product the circles would sit side by side, unlinked. Here every two of them link.'],
  ],
  header: { eyebrow: '05 · THE HOPF MAP', title: 'One point of S² for every circle' },
  draw(ctx, t) {
    const gcam = globeCamera({ cx: 290, cy: 520, scale: 170, yaw: 0.5 + 0.02 * t, pitch: 0.42 });
    const cam = spaceCamera({ cx: 830, cy: 520, scale: 100, yaw: 0.45 + 0.015 * t, pitch: 0.46 });
    const focus = t > 12 ? Math.floor((t - 12) / 1.6) % BASES.length : -1;
    drawGlobe(ctx, gcam, { alpha: seg(t, 0.2, 1.2) });
    BASES.forEach((p, k) => {
      const a = seg(t, 1 + 0.3 * k, 1.5 + 0.3 * k);
      const s = globePoint(ctx, gcam, p, fibreColor(p), { r: k === focus ? 9 : 6, alpha: a });
      if (k === focus) text(ctx, 'p', s.x + 12, s.y - 10, { ...type.math, size: 22, alpha: a });
    });
    drawFibres(ctx, cam, BASES.map((p, k) => ({
      p,
      width: k === focus ? 4.5 : 2.2,
      alpha: seg(t, 1 + 0.3 * k, 1.8 + 0.3 * k) * (focus >= 0 && k !== focus ? 0.55 : 1),
    })), { limit: 4.2 });
    text(ctx, 'base S²', 290, 790, { ...type.note, align: 'center', alpha: seg(t, 2, 3) });
    text(ctx, 'total space S³, projected', 830, 840, { ...type.note, align: 'center', alpha: seg(t, 2, 3) });

    const x0 = 1220;
    HOPF.draw(ctx, x0 + 160, 236, { size: 21, align: 'center', alpha: seg(t, 12, 13) });
    wrap(ctx, 'keeps: the balance |z₁|² − |z₂|² (the latitude) and the angle between the dials (the longitude)', x0, 300, 330, 28, { ...type.body, size: 19, alpha: seg(t, 14, 15) });
    wrap(ctx, 'forgets: the common turn e^{iθ}, the motion along the fibre', x0, 420, 330, 28, { ...type.body, size: 19, color: color.gold, alpha: seg(t, 17, 18) });
    BUNDLE.draw(ctx, x0 + 160, 540, { size: 34, align: 'center', alpha: seg(t, 24, 25) });
    COUNT.draw(ctx, x0 + 160, 600, { size: 24, align: 'center', alpha: fade(t, 26, 27, 31.5, 32.5) });
    wrap(ctx, 'Not S² × S¹: there the circles would not link.', x0, 600, 330, 30, { ...type.body, size: 20, alpha: seg(t, 33, 34) });
  },
});
