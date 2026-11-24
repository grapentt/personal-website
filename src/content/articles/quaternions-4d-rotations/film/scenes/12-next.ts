import { defineScene, seg, text, wrap, type, color, hopf, polyline3, hue } from '@/stage/kit';
import { filmCamera, up } from '../shared';

export default defineScene({
  name: 'Next: the Hopf fibration',
  duration: 18,
  narration: 'The unit quaternions form the 3-sphere. Multiplying all of them by e to the i theta moves every point of S³ around a circle, and no two circles meet. What those circles look like, and why every two of them are linked, is the subject of the next article: the Hopf fibration.',
  header: { eyebrow: '12 · NEXT', title: 'The 3-sphere, as a circle of circles' },
  draw(ctx, t) {
    const cam = filmCamera({ cx: 1060, cy: 520, scale: 115, yaw: 0.4 + 0.03 * t, pitch: 0.45 });
    for (let k = 0; k < 18; k++) {
      const p = hopf.spherePoint(k < 9 ? 0.8 : 1.6, (k * 2 * Math.PI) / 9);
      const pts = hopf.fibreSamples(p, 90, 0.3 * t, 6).map((x) => (x ? up(x) : null));
      polyline3(ctx, cam, pts, { color: hue(k / 9), width: 2.4, alpha: seg(t, 1 + 0.25 * k, 2 + 0.25 * k) });
    }
    wrap(ctx, 'Unit quaternions = the 3-sphere S³. Left multiplication by e^{iθ} moves every point of S³ around a great circle.', 100, 300, 560, 34, { ...type.body, alpha: seg(t, 1, 2) });
    wrap(ctx, 'Every two of these circles are linked.', 100, 460, 560, 34, { ...type.display, size: 28, color: color.gold, alpha: seg(t, 8, 9) });
    text(ctx, 'Next: the Hopf fibration.', 100, 600, { ...type.display, size: 30, alpha: seg(t, 11, 12) });
  },
});
