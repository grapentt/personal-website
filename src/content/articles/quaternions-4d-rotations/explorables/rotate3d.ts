// Explorable: a unit quaternion q = cos(φ/2) + sin(φ/2) u rotates space by v ↦ q v q̄.
import { defineScene, text, wrap, type, color, font, slider, toggle, drag, quaternion, vec3 } from '@/stage/kit';
import type { Vec3 } from '@/stage/kit';
import { filmCamera, drawCube, arrow3d, up, dragAngles, circle3, drawCircle3 } from '../film/shared';

const fmt = (x: number) => `${x < 0 ? '−' : ' '}${Math.abs(x).toFixed(3)}`;

export default defineScene({
  name: 'Quaternions rotate space',
  duration: 600,
  controls: {
    azimuth: slider('Axis: longitude', { min: -180, max: 180, value: 30, lens: true, digits: 0, unit: '°' }),
    elevation: slider('Axis: latitude', { min: -90, max: 90, value: 55, lens: true, digits: 0, unit: '°' }),
    phi: slider('Angle φ', { min: -360, max: 360, value: 120, lens: true, digits: 0, unit: '°' }),
    minus: toggle('Use −q instead of q', { value: false, lens: true }),
    view: drag('Drag to turn your view', { region: [60, 150, 940, 880] }),
  },
  draw(ctx, _t, { input }) {
    const az = ((input.azimuth as number) * Math.PI) / 180;
    const el = ((input.elevation as number) * Math.PI) / 180;
    const phi = ((input.phi as number) * Math.PI) / 180;
    const u: Vec3 = [Math.cos(el) * Math.cos(az), Math.cos(el) * Math.sin(az), Math.sin(el)];
    let q = quaternion.fromAxisAngle(u, phi);
    if (input.minus) q = quaternion.scale4(q, -1);
    const cam = filmCamera({ cx: 500, cy: 520, scale: 150, ...dragAngles(input.view, { yaw: 0.55, pitch: 0.35 }) });

    // the fixed frame, faint, and the rotation axis
    ([[1, 0, 0], [0, 1, 0], [0, 0, 1]] as Vec3[]).forEach((e, k) => arrow3d(ctx, cam, [0, 0, 0], vec3.scale(e, 1.9), { color: [color.x, color.y, color.z][k], width: 1.4, head: 9, alpha: 0.45 }));
    drawCircle3(ctx, cam, circle3([0, 0, 0], u, 1.5, 96), { color: color.gold, width: 1.2, alpha: 0.4, dash: [3, 5] });
    drawCube(ctx, cam, (v) => quaternion.rotate(q, v), { size: 0.62 });
    arrow3d(ctx, cam, vec3.scale(u, -2), vec3.scale(u, 4), { color: color.gold, width: 2.6, head: 14, dash: [8, 6] });
    const tip = cam.project(up(vec3.scale(u, 2.05)));
    text(ctx, 'u', tip.x + 10, tip.y, { ...type.math, size: 26, color: color.gold });

    const x0 = 1040;
    text(ctx, 'THE QUATERNION', x0, 210, { ...type.eyebrow, size: 13 });
    const names = ['1', 'i', 'j', 'k'];
    q.forEach((x, k) => text(ctx, `${fmt(x)} ${names[k]}`, x0 + 20, 260 + 34 * k, { font: font.mono, size: 20, color: k ? [color.x, color.y, color.z][k - 1] : color.gold }));
    text(ctx, `|q| = ${quaternion.norm(q).toFixed(3)}`, x0 + 20, 410, { font: font.mono, size: 16, color: color.muted });
    wrap(ctx, `q = cos(φ/2) + sin(φ/2) u, and v ↦ q v q̄ turns space by φ = ${(input.phi as number).toFixed(0)}° about u.`, x0, 480, 470, 28, { ...type.body, size: 18 });
    wrap(ctx, 'Switch to −q: the cube does not move. Set φ = 360°: q = −1, and again nothing moves.', x0, 580, 470, 28, { ...type.body, size: 18, color: color.gold });
    wrap(ctx, 'Two quaternions, q and −q, for every rotation of space.', x0, 680, 470, 30, { ...type.display, size: 22 });
  },
});
