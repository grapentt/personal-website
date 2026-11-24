import { defineScene, seg, text, wrap, type, color, tex, vec3, rotation, polygon3, rgba, dot } from '@/stage/kit';
import type { Vec3 } from '@/stage/kit';
import { filmCamera, up, drawCube, arrow3d, circle3, drawCircle3 } from '../shared';

const AXIS: Vec3 = vec3.normalize([0.35, -0.25, 1]);
const W: Vec3 = [1.35, -0.85, 0.75];
const GEN = tex(String.raw`v_1 \wedge v_2:\;\; \text{project onto the plane, then turn by a quarter}`, 'v₁ ∧ v₂: project onto the plane, then a quarter turn');
const ROT = tex(String.raw`e^{\theta\, v_1 \wedge v_2}\, w = \cos\theta\; w_\parallel + \sin\theta\; J w_\parallel + w_\perp`, 'exp(θ v₁∧v₂) w = cos θ w∥ + sin θ J w∥ + w⊥');

export default defineScene({
  name: 'Rotations in three dimensions',
  duration: 38,
  narration: [
    [0, 'In three dimensions there is not just one plane to turn in, but infinitely many. A rotation needs a plane, and an angle.'],
    [9, 'Everything at right angles to that plane, the axis, does not move at all. Split any vector into a part in the plane and a part along the axis: the first part turns, the second stays put.'],
    [21, 'So the generator, written v one wedge v two, does two things: project onto the plane, then turn by a quarter. Exponentiate it and you get the rotation by theta in that plane.'],
    [31, 'And every rotation of space has such an axis of fixed points. That fixed axis is why there are no three-dimensional numbers.'],
  ],
  header: { eyebrow: '06 · ROTATIONS IN 3D', title: 'A plane to turn in, an axis that stays' },
  draw(ctx, t) {
    const cam = filmCamera({ cx: 520, cy: 520, scale: 145, yaw: 0.5 + 0.01 * t, pitch: 0.35 });
    const theta = 1.6 * seg(t, 3, 9) + 0.5 * Math.max(0, t - 12) * seg(t, 12, 13);
    const R = rotation.axisAngle(AXIS, theta);
    // the plane of rotation as a disc, and the axis
    const disc = circle3([0, 0, 0], AXIS, 1.65, 72).map(up);
    polygon3(ctx, cam, disc, { fill: rgba(color.soft, 0.08), stroke: rgba(color.soft, 0.5), alpha: seg(t, 1, 2) });
    const axisA = cam.project(up(vec3.scale(AXIS, -2.1)));
    const axisB = cam.project(up(vec3.scale(AXIS, 2.1)));
    ctx.save();
    ctx.globalAlpha = seg(t, 9, 10);
    ctx.strokeStyle = color.gold;
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(axisA.x, axisA.y);
    ctx.lineTo(axisB.x, axisB.y);
    ctx.stroke();
    ctx.restore();
    text(ctx, 'axis: fixed', axisB.x + 12, axisB.y, { ...type.note, color: color.gold, alpha: seg(t, 9, 10) });

    drawCube(ctx, cam, (v) => rotation.apply(R, v), { size: 0.55, alpha: seg(t, 0.5, 1.5) * (1 - 0.7 * seg(t, 9.5, 10.5)) });

    // decomposition of w into the part along the axis and the part in the plane
    const dec = seg(t, 10, 11);
    if (dec > 0.01) {
      const along = vec3.scale(AXIS, vec3.dot(W, AXIS));
      const inPlane = vec3.sub(W, along);
      const turned = rotation.apply(R, inPlane);
      arrow3d(ctx, cam, [0, 0, 0], turned, { color: color.soft, width: 4, head: 14, alpha: dec });
      arrow3d(ctx, cam, turned, along, { color: color.gold, width: 4, head: 14, alpha: dec });
      const tip = arrow3d(ctx, cam, [0, 0, 0], vec3.add(turned, along), { color: color.ink, width: 4.5, head: 16, alpha: dec });
      dot(ctx, tip.x, tip.y, 4, color.ink, dec);
      drawCircle3(ctx, cam, circle3(along, AXIS, vec3.length(inPlane), 96), { color: color.ink, width: 1.4, alpha: 0.5 * dec, dash: [3, 5] });
    }

    const x0 = 960;
    wrap(ctx, 'A rotation in 3D: a plane and an angle.', x0, 270, 560, 32, { ...type.body, alpha: seg(t, 1, 2) });
    wrap(ctx, 'The part of a vector in the plane turns (cyan); the part along the axis stays (gold).', x0, 350, 560, 32, { ...type.body, alpha: seg(t, 11, 12) });
    GEN.draw(ctx, x0, 470, { size: 22, alpha: seg(t, 21, 22) });
    ROT.draw(ctx, x0, 540, { size: 26, alpha: seg(t, 24, 25) });
    wrap(ctx, 'Every rotation of space fixes a whole line. That is the reason there are no 3D numbers.', x0, 640, 560, 34, { ...type.display, size: 25, color: color.gold, alpha: seg(t, 31, 32) });
  },
});
