import { defineScene, seg, text, wrap, type, color } from '@/stage/kit';
import { spaceCamera, drawFibres, ring, FibreSpec } from '../shared';

// The fibres over three latitude rings: three nested tori of linked circles.
const BASES = [...ring(0.55, 10), ...ring(1.25, 14, 0.2), ...ring(2.0, 18, 0.1)];

export default defineScene({
  name: 'Title',
  duration: 8,
  narration: 'The Hopf fibration: the 3-sphere of unit quaternions, seen as a sphere’s worth of circles, every two of them linked.',
  draw(ctx, t) {
    const cam = spaceCamera({ cx: 1150, cy: 470, scale: 112, yaw: 0.35 + 0.05 * t, pitch: 0.5 });
    const fibres: FibreSpec[] = BASES.map((p, k) => ({ p, width: 2.2, alpha: seg(t, 0.2 + 0.035 * k, 1.2 + 0.035 * k), theta0: 0.25 * t }));
    drawFibres(ctx, cam, fibres, { limit: 6 });

    const a = seg(t, 0.2, 1.4);
    text(ctx, 'A GLIMPSE INTO FOUR DIMENSIONS · PART 2', 100, 300, { ...type.eyebrow, size: 18, tracking: 3, alpha: a });
    text(ctx, 'The Hopf', 100, 388, { ...type.title, size: 80, alpha: a });
    text(ctx, 'fibration', 100, 476, { ...type.title, size: 80, italic: true, color: color.gold, alpha: seg(t, 0.6, 1.8) });
    wrap(ctx, 'The 3-sphere as a circle of circles, every two of them linked.', 100, 550, 560, 36, { ...type.body, size: 25, color: color.muted, alpha: seg(t, 1.2, 2.4) });
  },
});
