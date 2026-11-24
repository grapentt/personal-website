// Explorable: stereographic projection of S² sends circles to circles (and circles through the lamp to lines).
import { defineScene, text, wrap, type, color, font, hopf, slider, drag, drawSurface, vec3, tex } from '@/stage/kit';
import type { Vec3 } from '@/stage/kit';
import { up, drawGlobeCurve, dragAngles, filmCamera, panel, TAU } from '../film/shared';
import { drawPlane, drawLamp, drawImage, sphereCircle, project2, drawRay } from '../film/stereo';

const sphere = (u: number, v: number): Vec3 => up(hopf.spherePoint(u, v));
const SIGMA = tex(String.raw`\sigma(x, y, z) = \frac{(x,\, y)}{1 - z}`, 'σ(x, y, z) = (x, y)/(1 − z)');

export default defineScene({
  name: 'Circles to circles',
  duration: 600,
  controls: {
    tilt: slider('Tilt of the circle', { min: 0, max: 90, value: 35, lens: true, digits: 0, unit: '°' }),
    turn: slider('Turn', { min: -180, max: 180, value: -20, lens: true, digits: 0, unit: '°' }),
    height: slider('Height d', { min: -0.95, max: 0.95, value: 0.3, lens: true, digits: 2 }),
    view: drag('Drag to turn the picture', { region: [40, 150, 1080, 880] }),
  },
  draw(ctx, _t, { input }) {
    const tilt = ((input.tilt as number) * Math.PI) / 180;
    const turn = ((input.turn as number) * Math.PI) / 180;
    const d = input.height as number;
    const n: Vec3 = [Math.sin(tilt) * Math.cos(turn), Math.sin(tilt) * Math.sin(turn), Math.cos(tilt)];
    const cam = filmCamera({ cx: 560, cy: 540, scale: 120, focal: 12, ...dragAngles(input.view, { yaw: 0.5, pitch: 0.42 }) });
    drawPlane(ctx, cam);
    ctx.save();
    ctx.globalAlpha = 0.55;
    drawSurface(ctx, cam, sphere, { nu: 24, nv: 36, u: [0, Math.PI], v: [0, TAU], color: () => '#24365c', ambient: 0.55 });
    ctx.restore();
    drawLamp(ctx, cam);
    const circle = sphereCircle(n, d, 360);
    drawGlobeCurve(ctx, cam, circle, { color: color.gold, width: 3.2, back: 0.45 });
    drawImage(ctx, cam, circle, color.gold, { width: 3.2 });
    [0, 120, 240].forEach((i) => drawRay(ctx, cam, circle[i], color.gold, 0.45));

    // the image circle, measured from three projected points
    const through = Math.abs(n[2] - d) < 0.004;
    const pts = [0, 120, 240].map((i) => project2(circle[i], 1e9));
    const image = !through && pts.every(Boolean) ? hopf.circleThrough(pts[0] as Vec3, pts[1] as Vec3, pts[2] as Vec3) : null;
    const lampGap = Math.acos(Math.max(-1, Math.min(1, vec3.dot(n, [0, 0, 1])))) - Math.acos(Math.max(-1, Math.min(1, d)));

    SIGMA.draw(ctx, 1150, 230, { size: 30 });
    panel(ctx, 1150, 300, 400, [
      { label: 'circle on the sphere: radius', value: Math.sqrt(1 - d * d).toFixed(3) },
      { label: 'passes through the lamp?', value: through ? 'yes' : 'no', color: through ? color.gold : color.ink },
      { label: 'image: centre', value: image ? `(${image.center[0].toFixed(2)}, ${image.center[1].toFixed(2)})` : '—' },
      { label: 'image: radius', value: image ? image.radius.toFixed(3) : '∞ (a line)', color: color.gold },
      { label: 'angular distance to the lamp', value: `${((Math.abs(lampGap) * 180) / Math.PI).toFixed(1)}°` },
    ], { title: 'measured' });
    wrap(ctx, 'Move the circle towards the lamp (raise d until it touches N): its shadow grows without bound and becomes a straight line exactly when the circle runs through the lamp.', 1150, 560, 400, 28, { ...type.body, size: 18 });
    text(ctx, 'the equatorial plane (z = 0) is the screen', 1150, 760, { font: font.mono, size: 14, color: color.muted });
  },
});
