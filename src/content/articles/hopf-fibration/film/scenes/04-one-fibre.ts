import { defineScene, seg, fade, text, wrap, type, color, font, hopf, arrow, ring as circle } from '@/stage/kit';
import { spaceCamera, drawFibres, drawDials, dialsOf, fibrePointOnScreen, fibreColor, drawAxes, spread, TAU, up } from '../shared';

const P0 = hopf.spherePoint(1.1, 0.8);
const NORTH = hopf.spherePoint(0, 0);
const SOUTH = hopf.spherePoint(Math.PI, 0);
const MORE = spread(7, 2.5).slice(1);

export default defineScene({
  name: 'One fibre',
  duration: 36,
  narration: [
    [0, 'Take one point of S³ and turn both of its dials together.'],
    [4, 'In the room the point runs once around a circle and comes back to where it started: a great circle of S³, projected. We call it the fibre through that point.'],
    [15, 'Two fibres are special. The points with z two equal to zero form the unit circle in the floor. The points with z one equal to zero form a circle through the lamp, and the lamp is at infinity: the vertical axis, closed up at infinity.'],
    [27, 'Every point of S³ lies on exactly one fibre, so no two fibres ever meet. They fill all of S³.'],
  ],
  header: { eyebrow: '03 · ONE CIRCLE', title: 'Turn the dials: a point runs around a circle' },
  draw(ctx, t) {
    const cam = spaceCamera({ cx: 1090, cy: 510, scale: 125, yaw: 0.5 + 0.02 * t, pitch: 0.42 });
    drawAxes(ctx, cam, { alpha: 0.35 * seg(t, 0.3, 1.3), length: 2.4 });

    const theta = TAU * seg(t, 4, 13) + (t > 13 ? 0.4 * (t - 13) : 0);
    const state = dialsOf(P0, theta);
    drawDials(ctx, { x: 360, y: 400, size: 95, gap: 60, state, alpha: seg(t, 0.4, 1.4), hand: fibreColor(P0) });
    text(ctx, `θ = ${(((theta * 180) / Math.PI) % 360).toFixed(0)}°`, 360, 560, { font: font.mono, size: 20, color: color.gold, align: 'center', alpha: fade(t, 4, 5, 15, 16) });

    // the fibre through q, traced by the turning point
    const traced = seg(t, 4, 13);
    drawFibres(ctx, cam, [
      { p: P0, width: 3.4, progress: traced, alpha: seg(t, 3.5, 4) },
      { p: NORTH, color: color.ink, width: 3, alpha: seg(t, 16, 17.5) },
      { p: SOUTH, color: color.ink, width: 3, alpha: seg(t, 19.5, 21) },
      ...MORE.map((p, k) => ({ p, width: 2.4, alpha: seg(t, 27.5 + 0.6 * k, 28.5 + 0.6 * k) })),
    ], { limit: 3.0 });
    const s = fibrePointOnScreen(cam, P0, theta);
    if (s && t > 1) {
      circle(ctx, s.x, s.y, 13, color.gold, fade(t, 1, 2, 30, 31), 2.4);
      circle(ctx, s.x, s.y, 5, color.ink, fade(t, 1, 2, 30, 31), 5);
    }

    // the z-axis runs off to the lamp at infinity in both directions
    const axis = seg(t, 20.5, 22);
    if (axis > 0) {
      const top = cam.project(up([0, 0, 3.0]));
      const bottom = cam.project(up([0, 0, -3.0]));
      arrow(ctx, top.x, top.y + 30, top.x, top.y - 16, { color: color.ink, width: 2.4, head: 12, alpha: axis });
      arrow(ctx, bottom.x, bottom.y - 30, bottom.x, bottom.y + 16, { color: color.ink, width: 2.4, head: 12, alpha: axis });
      text(ctx, '∞', top.x + 14, top.y - 8, { ...type.math, size: 26, alpha: axis });
      text(ctx, '∞', bottom.x + 14, bottom.y + 18, { ...type.math, size: 26, alpha: axis });
    }

    const x0 = 100;
    wrap(ctx, 'The fibre through q: all the points e^{iθ}q. A great circle of S³; in the room, a circle.', x0, 640, 560, 30, { ...type.body, size: 21, alpha: fade(t, 9, 10, 15, 15.6) });
    wrap(ctx, 'z₂ = 0: the unit circle in the floor.', x0, 640, 560, 30, { ...type.body, size: 21, alpha: fade(t, 16.5, 17.3, 26.5, 27) });
    wrap(ctx, 'z₁ = 0: through the lamp. The vertical axis, closed up at ∞.', x0, 690, 560, 30, { ...type.body, size: 21, alpha: fade(t, 20, 20.8, 26.5, 27) });
    wrap(ctx, 'Through every point of S³ passes exactly one fibre. No two fibres meet.', x0, 650, 560, 30, { ...type.body, size: 21, color: color.gold, alpha: seg(t, 28, 29) });
  },
});
