import { defineScene, seg, fade, lin, text, wrap, type, color, font, tex, hopf, card, vec3 } from '@/stage/kit';
import type { Vec3 } from '@/stage/kit';
import { globeCamera, drawGlobe, drawGlobeCurve, VERTICAL, TAU } from '../shared';

/** A small circle of angular radius r around c on S². */
function smallCircle(c: Vec3, r: number, n = 480): Vec3[] {
  const helper: Vec3 = Math.abs(c[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  const u = vec3.normalize(vec3.cross(helper, c));
  const v = vec3.cross(c, u);
  return Array.from({ length: n + 1 }, (_, i) => {
    const s = (i / n) * TAU;
    return vec3.add(vec3.scale(c, Math.cos(r)), vec3.add(vec3.scale(u, Math.sin(r) * Math.cos(s)), vec3.scale(v, Math.sin(r) * Math.sin(s))));
  });
}

interface Row {
  name: string;
  loop: Vec3[];
  omega: number;
  gamma: number;
  tint: string;
}
const make = (name: string, loop: Vec3[], tint: string): Row => {
  let omega = hopf.solidAngle(loop.slice(0, -1));
  if (omega < 0) omega += 2 * TAU; // the solid angle on the left, in (0, 4π)
  let { gamma } = hopf.holonomy(loop);
  if (gamma < 0) gamma += TAU;
  return { name, loop, omega, gamma, tint };
};
const ROWS: Row[] = [
  make('latitude 30°', hopf.latitudeLoop(Math.PI / 6, 480), '#7fd8b6'),
  make('latitude 60°', hopf.latitudeLoop(Math.PI / 3, 480), '#6cc4e8'),
  make('octant triangle', hopf.geodesicPolygon([[1, 0, 0], [0, 1, 0], [0, 0, 1]], 160), '#e87aa6'),
  make('small circle', smallCircle(hopf.spherePoint(1.5, 2.6), 0.4), '#a98bf5'),
  make('tiny circle', smallCircle(hopf.spherePoint(2.0, -0.8), 0.12), '#ef8a5b'),
];
const deg = (x: number) => `${((x * 180) / Math.PI).toFixed(2)}°`;

const RULE = tex(String.raw`\gamma \;=\; \tfrac12\,\Omega \pmod{2\pi}`, 'γ = ½ Ω (mod 2π)');
const CURV = tex(String.raw`F = dA = -\tfrac12 \sin\vartheta\; d\vartheta \wedge d\lambda`, 'F = dA = −½ sin ϑ dϑ ∧ dλ');
const CHERN = tex(String.raw`\frac{1}{2\pi}\Big|\int_{S^2} F\,\Big| \;=\; \frac{1}{2\pi}\cdot\frac12\cdot 4\pi \;=\; 1`, '(1/2π) |∫ F| = 1');

export default defineScene({
  name: 'Half the solid angle',
  duration: 40,
  narration: [
    [0, 'Try other loops: circles of latitude, a triangle, small circles anywhere. Each time, measure the solid angle the loop encloses and the holonomy of its lift.'],
    [13, 'The holonomy is always half the solid angle. In the language of bundles: the curvature of the connection is half the area form of the sphere, the same everywhere.'],
    [24, 'Add up the curvature over the whole sphere: one half times four pi is two pi, one full turn. Divided by two pi that is one, the Chern number of the Hopf bundle up to its sign, and the same one by which any two fibres are linked.'],
  ],
  header: { eyebrow: '07 · HOLONOMY = CURVATURE', title: 'The holonomy is half the solid angle' },
  draw(ctx, t) {
    const gcam = globeCamera({ cx: 300, cy: 530, scale: 185, yaw: 0.5 + 0.02 * t, pitch: 0.45 });
    drawGlobe(ctx, gcam, { alpha: seg(t, 0, 0.8) });
    ROWS.forEach((row, k) => {
      const a = seg(t, 1.5 + 2 * k, 2.3 + 2 * k);
      drawGlobeCurve(ctx, gcam, row.loop, { color: row.tint, width: 3, alpha: a, progress: lin(t, 1.5 + 2 * k, 3 + 2 * k) });
    });

    // the table
    const x = 660;
    const cols = [x, x + 230, x + 410, x + 590];
    const head = { font: font.mono, size: 15, color: color.muted };
    const tableAlpha = seg(t, 1, 2);
    text(ctx, 'loop', cols[0], 250, { ...head, alpha: tableAlpha });
    text(ctx, 'solid angle Ω', cols[1], 250, { ...head, alpha: tableAlpha });
    text(ctx, 'holonomy γ', cols[2], 250, { ...head, alpha: tableAlpha });
    text(ctx, 'γ / Ω', cols[3], 250, { ...head, alpha: tableAlpha });
    ROWS.forEach((row, k) => {
      const y = 296 + 42 * k;
      const a = seg(t, 2 + 2 * k, 2.8 + 2 * k);
      const cell = { font: font.mono, size: 19, alpha: a };
      text(ctx, row.name, cols[0], y, { ...cell, color: row.tint });
      text(ctx, deg(row.omega), cols[1], y, cell);
      text(ctx, deg(row.gamma), cols[2], y, { ...cell, color: VERTICAL });
      text(ctx, (row.gamma / row.omega).toFixed(4), cols[3], y, { ...cell, color: color.gold });
    });
    text(ctx, 'measured: horizontal lift integrated numerically; solid angle from the loop', x, 520, { ...type.note, size: 13, alpha: seg(t, 11, 12) });

    RULE.draw(ctx, x, 590, { size: 34, alpha: seg(t, 13, 14) });
    CURV.draw(ctx, x, 660, { size: 26, alpha: seg(t, 17, 18) });
    wrap(ctx, 'half the area form, the same everywhere (the sign is our convention)', x + 420, 660, 330, 26, { ...type.body, size: 18, alpha: seg(t, 18, 19) });
    CHERN.draw(ctx, x, 750, { size: 26, alpha: seg(t, 25, 26) });
    wrap(ctx, 'the Chern number: the same 1 that links any two fibres', x + 420, 750, 330, 26, { ...type.body, size: 18, color: color.gold, alpha: seg(t, 28, 29) });
    card(ctx, {
      x: 660,
      y: 230,
      width: 870,
      tag: 'PHYSICS',
      title: 'Berry’s phase',
      body: 'For a spin-½ the base S² is the sphere of directions (the Bloch sphere) and the fibre is the overall phase of the state. Turn the spin slowly around a loop of directions and it returns with a phase of half the solid angle: Berry’s phase, the holonomy of this very connection.',
      accent: color.soft,
      alpha: fade(t, 32, 33, 39.4, 40),
      progress: lin(t, 32.3, 38),
    });
  },
});
