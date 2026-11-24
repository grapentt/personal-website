import { defineScene, seg, text, wrap, type, color } from '@/stage/kit';
import { filmCamera, drawTesseract, doubleRotation } from '../shared';

export default defineScene({
  name: 'Title',
  duration: 8,
  narration: 'A geometric introduction to quaternions: rotations in two, three and four dimensions, and the numbers that describe them.',
  draw(ctx, t) {
    const cam = filmCamera({ cx: 1140, cy: 470, scale: 150, yaw: 0.55 + 0.03 * t, pitch: 0.38 });
    drawTesseract(ctx, cam, (v) => doubleRotation(v, 0.35 * t, 0.35 * t), { alpha: seg(t, 0.3, 1.6), width: 3.4 });
    const a = seg(t, 0.2, 1.4);
    text(ctx, 'A GLIMPSE INTO FOUR DIMENSIONS · PART 1', 100, 300, { ...type.eyebrow, size: 18, tracking: 3, alpha: a });
    text(ctx, 'A geometric introduction', 100, 388, { ...type.title, size: 68, alpha: a });
    text(ctx, 'to quaternions', 100, 466, { ...type.title, size: 68, italic: true, color: color.gold, alpha: seg(t, 0.6, 1.8) });
    wrap(ctx, 'Rotations in two, three and four dimensions, and the numbers that describe them.', 100, 540, 600, 36, { ...type.body, size: 25, color: color.muted, alpha: seg(t, 1.2, 2.4) });
  },
});
