import { defineScene, seg, fade, text, wrap, type, color, tex, drawSurface, hopf, vec3 } from '@/stage/kit';
import type { Vec3 } from '@/stage/kit';
import { up, drawGlobeCurve, filmCamera, TAU } from '../shared';
import { drawPlane, drawLamp, drawRay, drawImage, sphereCircle } from '../stereo';

const SIGMA = tex(String.raw`\sigma(x, y, z) = \frac{(x,\, y)}{1 - z}`, 'σ(x, y, z) = (x, y) / (1 − z)');
const RAYS: Vec3[] = [[0.6, -0.5, 0.62], [-0.7, 0.2, -0.68], [0.1, 0.8, 0.2], [-0.4, -0.8, -0.3]].map((v) => vec3.normalize(v as Vec3));
const sphere = (u: number, v: number): Vec3 => up([Math.sin(u) * Math.cos(v), Math.sin(u) * Math.sin(v), Math.cos(u)]);
// the tilted circle: normal n, height d; it passes through the lamp when d = n_z
const N: Vec3 = vec3.normalize([0.55, -0.2, 0.81]);

export default defineScene({
  name: 'One dimension down',
  duration: 36,
  narration: [
    [0, 'We cannot look into four dimensions, but we can project. First one dimension down: put a lamp at the north pole of an ordinary sphere and let every point cast its shadow onto the equatorial plane.'],
    [12, 'This is stereographic projection. Its best property: circles on the sphere become circles in the plane.'],
    [21, 'Slide a circle up towards the lamp and its shadow grows. When the circle passes through the lamp, the shadow is a straight line: a circle through the point at infinity.'],
    [30, 'The lamp itself has no shadow. The plane plus one point at infinity is the whole sphere.'],
  ],
  header: { eyebrow: '02 · STEREOGRAPHIC PROJECTION', title: 'Circles go to circles' },
  draw(ctx, t) {
    const cam = filmCamera({ cx: 560, cy: 560, scale: 118, yaw: 0.5 + 0.012 * t, pitch: 0.4, focal: 12 });
    drawPlane(ctx, cam, seg(t, 0.4, 1.4));
    ctx.save();
    ctx.globalAlpha = 0.55 * seg(t, 0.6, 1.6);
    drawSurface(ctx, cam, sphere, { nu: 24, nv: 36, u: [0, Math.PI], v: [0, TAU], color: () => '#24365c', ambient: 0.55 });
    ctx.restore();
    drawGlobeCurve(ctx, cam, Array.from({ length: 121 }, (_, i) => hopf.spherePoint(Math.PI / 2, (i / 120) * TAU)), { color: color.muted, width: 1.4, alpha: seg(t, 1, 2), back: 0.4 });
    drawLamp(ctx, cam, seg(t, 2, 3));

    // rays, one after another
    RAYS.forEach((p, k) => drawRay(ctx, cam, p, color.ink, fade(t, 3.5 + 1.2 * k, 4.3 + 1.2 * k, 11.5, 12.5)));

    // a circle and its shadow; from 21 s it slides up into the lamp
    const d = 0.1 + (N[2] - 0.1) * seg(t, 21, 29);
    const circle = sphereCircle(N, d, 360);
    const shown = seg(t, 12.5, 14);
    drawGlobeCurve(ctx, cam, circle, { color: color.gold, width: 3.2, alpha: shown, back: 0.45 });
    drawImage(ctx, cam, circle, color.gold, { width: 3.2, alpha: shown * seg(t, 14, 15.5) });
    if (shown > 0.5 && t < 21) {
      [0, 90, 180, 270].forEach((i) => drawRay(ctx, cam, circle[i], color.gold, 0.5 * fade(t, 15, 16, 20, 21)));
    }

    const x0 = 1080;
    SIGMA.draw(ctx, x0, 270, { size: 36, alpha: seg(t, 12, 13) });
    wrap(ctx, 'Each point of the sphere is sent to where the ray from the lamp through it meets the plane.', x0, 350, 440, 31, { ...type.body, size: 21, alpha: seg(t, 3, 4) });
    wrap(ctx, 'Circles on the sphere go to circles in the plane.', x0, 470, 440, 31, { ...type.body, size: 21, color: color.gold, alpha: seg(t, 14, 15) });
    wrap(ctx, 'A circle through the lamp goes to a line: a circle through ∞.', x0, 550, 440, 31, { ...type.body, size: 21, alpha: seg(t, 28, 29) });
    wrap(ctx, 'Plane + one point at ∞ = sphere.', x0, 640, 440, 31, { ...type.display, size: 26, color: color.ink, alpha: seg(t, 31, 32) });
    text(ctx, 'equator = unit circle: it does not move', x0, 760, { ...type.note, alpha: seg(t, 6, 7) });
  },
});
