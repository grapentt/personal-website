import { defineScene, seg, fade, lerp, text, wrap, type, color, font, tex, quaternion, vec3 } from '@/stage/kit';
import type { Vec3, Quat } from '@/stage/kit';
import { filmCamera, drawCube, arrow3d, up } from '../shared';

const U: Vec3 = vec3.normalize([0.4, 0.6, 1]);
const SANDWICH = tex(String.raw`v \;\mapsto\; q\, v\, \bar q, \qquad q = \cos\tfrac{\varphi}{2} + \sin\tfrac{\varphi}{2}\, u`, 'v ↦ q v q̄,  q = cos(φ/2) + sin(φ/2) u');
const WHY = tex(String.raw`\underbrace{q\,\cdot}_{\text{left, by } \varphi/2}\;\; \underbrace{\cdot\,\bar q}_{\text{right, by } -\varphi/2}`, 'left by φ/2, right by −φ/2');
const ORDER = tex(String.raw`q_x\, q_z \;\neq\; q_z\, q_x`, 'q_x q_z ≠ q_z q_x');
const qx = quaternion.fromAxisAngle([1, 0, 0], Math.PI / 2);
const qz = quaternion.fromAxisAngle([0, 0, 1], Math.PI / 2);

export default defineScene({
  name: 'Back to three dimensions',
  duration: 44,
  narration: [
    [0, 'The payoff comes back in three dimensions. Read a vector of space as a quaternion with no real part, x i plus y j plus z k. Then multiply by a unit quaternion q on the left and by its conjugate on the right.'],
    [11, 'Multiplying by q on the left is a left-isoclinic rotation by half the angle. Multiplying by its conjugate on the right is a right-isoclinic rotation by half the angle. On the plane of 1 and u the two cancel; in the plane at right angles to it they add up. Together: a rotation of space by the full angle phi about the axis u.'],
    [24, 'Notice that q and minus q give the same rotation: every rotation of space has exactly two quaternions. And as with the quaternions themselves, the order of rotations matters.'],
    [33, 'Turn a quarter about z and then about x, or the other way round: two different results. Quaternions keep track of this automatically, which is why they turn objects in games, robots and spacecraft.'],
  ],
  header: { eyebrow: '11 · BACK TO 3D', title: 'Quaternions rotate space' },
  draw(ctx, t) {
    const cam = filmCamera({ cx: 470, cy: 510, scale: 130, yaw: 0.55, pitch: 0.35 });
    const phi = lerp(0, 2.2, seg(t, 3, 10)) + 0.35 * Math.max(0, t - 12) * seg(t, 12, 13);
    const q = quaternion.fromAxisAngle(U, phi);
    const main = fade(t, 0.3, 1.2, 32, 33);
    if (main > 0.01) {
      arrow3d(ctx, cam, vec3.scale(U, -1.9), vec3.scale(U, 3.8), { color: color.gold, width: 2.6, head: 14, alpha: main, dash: [8, 6] });
      const tip = cam.project(up(vec3.scale(U, 1.95)));
      text(ctx, 'u', tip.x + 10, tip.y, { ...type.math, size: 26, color: color.gold, alpha: main });
      drawCube(ctx, cam, (v) => quaternion.rotate(q, v), { size: 0.7, alpha: main });
      text(ctx, `φ = ${((phi * 180) / Math.PI % 360).toFixed(0)}°`, 470, 840, { font: font.mono, size: 20, color: color.gold, align: 'center', alpha: main });
      const shown: Quat = t > 24 && t < 32 ? quaternion.scale4(q, -1) : q;
      text(ctx, `${t > 24 && t < 32 ? '−q' : 'q'} = (${shown.map((x) => x.toFixed(2)).join(', ')})`, 470, 300, { font: font.mono, size: 19, color: color.ink, align: 'center', alpha: main });
    }

    // order matters: two cubes
    const ord = seg(t, 33, 34);
    if (ord > 0.01) {
      const u = seg(t, 35, 39);
      const camA = filmCamera({ cx: 320, cy: 560, scale: 110, yaw: 0.55, pitch: 0.35 });
      const camB = filmCamera({ cx: 700, cy: 560, scale: 110, yaw: 0.55, pitch: 0.35 });
      const qa = quaternion.slerp([1, 0, 0, 0], quaternion.multiply(qx, qz), u); // first z, then x
      const qb = quaternion.slerp([1, 0, 0, 0], quaternion.multiply(qz, qx), u); // first x, then z
      drawCube(ctx, camA, (v) => quaternion.rotate(qa, v), { size: 0.6, alpha: ord });
      drawCube(ctx, camB, (v) => quaternion.rotate(qb, v), { size: 0.6, alpha: ord });
      text(ctx, 'z first, then x:  q_x q_z', 320, 780, { font: font.mono, size: 17, align: 'center', alpha: ord });
      text(ctx, 'x first, then z:  q_z q_x', 700, 780, { font: font.mono, size: 17, align: 'center', alpha: ord });
      ORDER.draw(ctx, 510, 850, { size: 30, align: 'center', color: color.rose, alpha: seg(t, 39, 40) });
    }

    const x0 = 960;
    SANDWICH.draw(ctx, x0, 270, { size: 28, alpha: seg(t, 4, 5) });
    wrap(ctx, 'is the rotation of space by φ about the unit vector u (right-hand rule).', x0, 330, 560, 30, { ...type.body, size: 21, alpha: seg(t, 6, 7) });
    WHY.draw(ctx, x0, 450, { size: 26, alpha: seg(t, 12, 13) });
    wrap(ctx, 'The two half-turns cancel in the plane of 1 and u and add up to φ at right angles to u.', x0, 530, 560, 30, { ...type.body, size: 20, alpha: seg(t, 14, 15) });
    wrap(ctx, 'q and −q give the same rotation: two quaternions for every rotation of space.', x0, 640, 560, 30, { ...type.body, size: 21, color: color.gold, alpha: seg(t, 25, 26) });
  },
});
