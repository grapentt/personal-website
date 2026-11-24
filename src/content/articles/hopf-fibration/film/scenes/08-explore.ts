import { defineScene, seg, text, type, color, hopf, slider, toggle, drag, pick, dot } from '@/stage/kit';
import type { Vec3 } from '@/stage/kit';
import {
  spaceCamera, globeCamera, drawGlobe, drawGlobeCurve, globePoint, globePick, drawFibres, drawHopfTorus, fibreColor,
  fibrePointOnScreen, dragAngles, TAU, FibreSpec,
} from '../shared';

const GLOBE = { cx: 300, cy: 520, scale: 175, yaw: 0.6, pitch: 0.38 };
const AUTHORED: [number, Vec3][] = [
  [2, hopf.spherePoint(0.35, 0.4)],
  [3.2, hopf.spherePoint(0.9, 2.2)],
  [4.4, hopf.spherePoint(1.4, -0.9)],
  [5.6, hopf.spherePoint(1.9, 1.2)],
  [6.8, hopf.spherePoint(1.2, 3.6)],
  [20, hopf.spherePoint(1.15, 4.6)],
  [20.8, hopf.spherePoint(1.25, 4.75)],
  [21.6, hopf.spherePoint(1.05, 4.85)],
];
const TORUS_FIBRES = 14;

export default defineScene({
  name: 'Explore the fibration',
  duration: 48,
  narration: [
    [0, 'Explore it yourself. Every point of the sphere on the left has its own circle on the right, in the same colour.'],
    [9, 'Points on one latitude give the fibres of one torus. Watch the torus sweep as the latitude moves.'],
    [19, 'Points close together on the sphere have fibres close together in the room: three nearby points, three nearby circles, still linked in pairs.'],
    [29, 'Your turn: click the sphere to add fibres, drag the picture to look from another side, and move the latitude slider.'],
  ],
  header: { eyebrow: '05 · THE HOPF MAP · LIVE', title: 'Pick a point, see its circle' },
  beats: [[9, 'Sweeping a torus'], [19, 'Nearby points'], [29, 'Your turn']],
  handovers: [{ at: 30, prompt: 'Your turn: click the sphere, drag the picture.' }],
  controls: {
    points: pick('Click the sphere to add a fibre', { region: [100, 320, 500, 720], max: 16 }),
    view: drag('Drag the picture to turn it', { region: [640, 160, 1560, 880] }),
    latitude: slider('Torus latitude', { min: 5, max: 115, value: [[0, 60], [10, 60], [14, 25], [18, 105], [19, 105], [24, 60]], lens: true, digits: 0, unit: '°' }),
    torus: toggle('Torus', { value: [[0, false], [9.5, true]], lens: true }),
    flow: toggle('Flow along the fibres', { value: true, lens: true }),
  },
  draw(ctx, t, { input }) {
    const gcam = globeCamera(GLOBE);
    const cam = spaceCamera({ cx: 1060, cy: 520, scale: 104, ...dragAngles(input.view, { yaw: 0.5 + 0.01 * t, pitch: 0.45 }) });
    const polar = ((input.latitude as number) * Math.PI) / 180;
    const showTorus = input.torus as boolean;

    const bases: Vec3[] = AUTHORED.filter(([at]) => t >= at).map(([, p]) => p);
    for (const [x, y] of (input.points as [number, number][]) ?? []) {
      const p = globePick(gcam, x, y);
      if (p) bases.push(p);
    }

    drawGlobe(ctx, gcam, { alpha: seg(t, 0, 0.8) });
    if (showTorus) drawGlobeCurve(ctx, gcam, hopf.latitudeLoop(polar, 120), { color: color.ink, width: 2, alpha: 0.8 });
    const torusBases = showTorus ? Array.from({ length: TORUS_FIBRES }, (_, k) => hopf.spherePoint(polar, (k * TAU) / TORUS_FIBRES)) : [];
    torusBases.forEach((p) => globePoint(ctx, gcam, p, fibreColor(p), { r: 4 }));
    bases.forEach((p) => globePoint(ctx, gcam, p, fibreColor(p), { r: 8 }));

    if (showTorus) drawHopfTorus(ctx, cam, polar, { alpha: 0.2, nu: 48, nv: 24 });
    const fibres: FibreSpec[] = [
      ...torusBases.map((p) => ({ p, width: 1.8, alpha: 0.75 })),
      ...bases.map((p) => ({ p, width: 3.2 })),
    ];
    drawFibres(ctx, cam, fibres, { limit: 4.5 });
    if (input.flow) {
      for (const p of bases) {
        for (let k = 0; k < 3; k++) {
          const s = fibrePointOnScreen(cam, p, 0.9 * t + (k * TAU) / 3, 4.5);
          if (s) dot(ctx, s.x, s.y, 4, color.ink, 0.9);
        }
      }
    }
    text(ctx, `${bases.length} fibres`, 1500, 860, { ...type.note, align: 'right' });
  },
});
