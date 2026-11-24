import { defineScene, seg, lerp, text, wrap, type, color, font, dot, line, tex, createRng, quaternion } from '@/stage/kit';
import { filmCamera, drawTesseract, drawTwoPlanes, doubleRotation, Vec4 } from '../shared';

const rng = createRng(17);
const SAMPLES = Array.from({ length: 220 }, () => ({ v: quaternion.normalize([rng.gauss(), rng.gauss(), rng.gauss(), rng.gauss()]) as Vec4, jitter: rng.uniform() }));
const T1 = (70 * Math.PI) / 180;
/** θ₂ over time: 0 (single), then up to θ₁ (left-isoclinic), then down to −θ₁ (right-isoclinic). */
function theta2(t: number) {
  if (t < 24) return lerp(0, T1, seg(t, 9, 16));
  return lerp(T1, -T1, seg(t, 26, 32));
}
const FORMULA = tex(String.raw`\cos \angle(v, Rv) = |v_{1i}|^2 \cos\theta_1 + |v_{jk}|^2 \cos\theta_2`, 'cos ∠(v, Rv) = |v₁ᵢ|² cos θ₁ + |vⱼₖ|² cos θ₂');
const METER = { x0: 760, x1: 1500, y: 720 };
const X = (deg: number) => METER.x0 + (deg / 180) * (METER.x1 - METER.x0);

export default defineScene({
  name: 'Every vector turns by the same angle',
  duration: 42,
  narration: [
    [0, 'How far does a rotation move each vector? Take two hundred random directions and measure, for each, the angle between the vector and its image. Each dot below is one direction.'],
    [9, 'For a single rotation by seventy degrees the dots are spread out: vectors close to the fixed plane hardly move, those in the turning plane move by the full seventy.'],
    [16, 'Now turn the second plane too, by the same angle. The spread shrinks until every vector moves by exactly seventy degrees. No direction is special any more: there is no axis, nothing stays behind. This is an isoclinic rotation.'],
    [27, 'Turning the second plane the opposite way works just as well. Same direction: a left-isoclinic rotation. Opposite directions: a right-isoclinic rotation.'],
  ],
  header: { eyebrow: '08 · ISOCLINIC ROTATIONS', title: 'When every vector turns by the same angle' },
  draw(ctx, t) {
    const a = T1;
    const b = theta2(t);
    drawTwoPlanes(ctx, { x: 380, y: 400, size: 88, gap: 70, v: [0.7, 0.2, 0.6, 0.3], angles: [a, b], alpha: seg(t, 0.3, 1.2), tint: color.soft });
    const cam = filmCamera({ cx: 1180, cy: 380, scale: 95, yaw: 0.55, pitch: 0.38 });
    const spin = 0.25 * t;
    drawTesseract(ctx, cam, (p) => doubleRotation(p, (a / T1) * spin, (b / T1) * spin), { alpha: seg(t, 0.5, 1.5), width: 2.6 });

    // the meter
    const m = seg(t, 2, 3);
    line(ctx, METER.x0, METER.y, METER.x1, METER.y, { color: color.muted, width: 2, alpha: m });
    [0, 30, 60, 90, 120, 150, 180].forEach((d) => {
      line(ctx, X(d), METER.y, X(d), METER.y + 8, { color: color.muted, width: 1.5, alpha: m });
      text(ctx, `${d}°`, X(d), METER.y + 30, { font: font.mono, size: 14, color: color.muted, align: 'center', alpha: m });
    });
    text(ctx, 'angle between v and its image', METER.x0, METER.y + 66, { ...type.note, alpha: m });
    let lo = 180;
    let hi = 0;
    SAMPLES.forEach(({ v, jitter }, k) => {
      const w = doubleRotation(v, a, b);
      const deg = (Math.acos(Math.max(-1, Math.min(1, quaternion.dot4(v, w)))) * 180) / Math.PI;
      lo = Math.min(lo, deg);
      hi = Math.max(hi, deg);
      dot(ctx, X(deg), METER.y - 16 - 70 * jitter, 3.4, color.soft, seg(t, 2 + 0.01 * k, 2.6 + 0.01 * k) * 0.85);
    });
    text(ctx, `from ${lo.toFixed(1)}° to ${hi.toFixed(1)}°`, METER.x1, METER.y - 110, { font: font.mono, size: 18, color: color.gold, align: 'right', alpha: m });

    FORMULA.draw(ctx, 100, 640, { size: 24, alpha: seg(t, 11, 12) });
    let label = 'single rotation: θ₂ = 0';
    if (Math.abs(b - a) < 0.01) label = 'θ₂ = θ₁: left-isoclinic';
    else if (Math.abs(b + a) < 0.01) label = 'θ₂ = −θ₁: right-isoclinic';
    else if (Math.abs(b) > 0.01) label = 'double rotation';
    text(ctx, label, 100, 720, { ...type.display, size: 28, color: color.gold, alpha: seg(t, 3, 4) });
    wrap(ctx, 'Every vector moves by exactly the same angle: no axis, no fixed direction.', 100, 770, 600, 30, { ...type.body, size: 21, alpha: seg(t, 18, 19) });
  },
});
