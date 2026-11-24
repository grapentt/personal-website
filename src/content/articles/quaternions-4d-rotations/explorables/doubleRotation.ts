// Explorable: double rotations of ℝ⁴. Choose the angles in the planes (1, i) and (j, k), see the
// tesseract move and measure by how much each of 220 random directions is turned.
import { defineScene, text, wrap, type, color, font, slider, toggle, drag, dot, line, createRng, quaternion } from '@/stage/kit';
import { filmCamera, drawTesseract, drawTwoPlanes, doubleRotation, dragAngles, axisKey, Vec4 } from '../film/shared';

const rng = createRng(29);
const SAMPLES = Array.from({ length: 220 }, () => ({ v: quaternion.normalize([rng.gauss(), rng.gauss(), rng.gauss(), rng.gauss()]) as Vec4, jitter: rng.uniform() }));
const METER = { x0: 120, x1: 760, y: 790 };
const X = (d: number) => METER.x0 + (d / 180) * (METER.x1 - METER.x0);

export default defineScene({
  name: 'Double rotations in 4D',
  duration: 600,
  controls: {
    t1: slider('θ₁ (plane of 1 and i)', { min: -180, max: 180, value: 70, lens: true, digits: 0, unit: '°' }),
    t2: slider('θ₂ (plane of j and k)', { min: -180, max: 180, value: 20, lens: true, digits: 0, unit: '°' }),
    spin: toggle('Animate the tesseract', { value: true, lens: true }),
    view: drag('Drag the tesseract to turn your view', { region: [820, 150, 1560, 760] }),
  },
  draw(ctx, t, { input }) {
    const a = ((input.t1 as number) * Math.PI) / 180;
    const b = ((input.t2 as number) * Math.PI) / 180;
    drawTwoPlanes(ctx, { x: 440, y: 380, size: 95, gap: 80, v: doubleRotation([0.7, 0.2, 0.6, 0.3], a, b), angles: [a, b], tint: color.soft });
    const cam = filmCamera({ cx: 1190, cy: 440, scale: 120, ...dragAngles(input.view, { yaw: 0.55, pitch: 0.38 }) });
    const s = input.spin ? ((0.5 * t) % 1) : 1;
    drawTesseract(ctx, cam, (p) => doubleRotation(p, a * s, b * s), { width: 3 });
    axisKey(ctx, 1060, 800);

    line(ctx, METER.x0, METER.y, METER.x1, METER.y, { color: color.muted, width: 2 });
    [0, 45, 90, 135, 180].forEach((d) => text(ctx, `${d}°`, X(d), METER.y + 26, { font: font.mono, size: 13, color: color.muted, align: 'center' }));
    let lo = 180;
    let hi = 0;
    for (const { v, jitter } of SAMPLES) {
      const w = doubleRotation(v, a, b);
      const d = (Math.acos(Math.max(-1, Math.min(1, quaternion.dot4(v, w)))) * 180) / Math.PI;
      lo = Math.min(lo, d);
      hi = Math.max(hi, d);
      dot(ctx, X(d), METER.y - 12 - 60 * jitter, 3, color.soft, 0.85);
    }
    text(ctx, 'angle between a direction and its image, for 220 random directions', METER.x0, METER.y - 94, { ...type.note, size: 14 });
    let kind = 'double rotation';
    const same = (x: number, y: number) => Math.abs(Math.cos(x) - Math.cos(y)) < 1e-6 && Math.abs(Math.sin(x) - Math.sin(y)) < 1e-6;
    if (same(a, 0) && same(b, 0)) kind = 'the identity';
    else if (same(a, 0) || same(b, 0)) kind = 'single rotation: a whole plane stays fixed';
    else if (same(a, b)) kind = 'left-isoclinic: every direction turns by the same angle';
    else if (same(a, -b)) kind = 'right-isoclinic: every direction turns by the same angle';
    text(ctx, `from ${lo.toFixed(1)}° to ${hi.toFixed(1)}°`, METER.x1, METER.y - 120, { font: font.mono, size: 18, color: color.gold, align: 'right' });
    wrap(ctx, kind, 120, 600, 640, 30, { ...type.display, size: 24, color: color.gold });
  },
});
