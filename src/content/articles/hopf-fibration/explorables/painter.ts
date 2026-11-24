// Explorable: the fibre painter. Click the sphere, see the fibres; sweep a torus; check that fibres link.
import { defineScene, text, type, color, hopf, slider, toggle, choice, drag, pick, dot } from '@/stage/kit';
import type { Vec3 } from '@/stage/kit';
import {
  spaceCamera, globeCamera, drawGlobe, drawGlobeCurve, globePoint, globePick, drawFibres, drawHopfTorus, fibreColor,
  fibrePointOnScreen, dragAngles, panel, TAU, FibreSpec,
} from '../film/shared';

const GLOBE = { cx: 300, cy: 500, scale: 190, yaw: 0.6, pitch: 0.38 };
const PRESETS: Record<string, Vec3[]> = {
  none: [],
  latitude: Array.from({ length: 12 }, (_, k) => hopf.spherePoint(1.1, (k * TAU) / 12)),
  meridian: Array.from({ length: 11 }, (_, k) => hopf.spherePoint(0.12 + (k * 2.5) / 10, 0.7)),
  spiral: Array.from({ length: 24 }, (_, k) => hopf.spherePoint(0.15 + (k * 2.3) / 23, k * 0.7)),
};

let memoKey = '';
let memoLinking = 0;
function linking(a: Vec3, b: Vec3) {
  const key = `${a.join()}|${b.join()}`;
  if (key !== memoKey) {
    const sample = (p: Vec3) => hopf.fibreSamples(p, 160, 0, 1e9).map((x) => x as Vec3);
    memoLinking = hopf.linkingNumber(sample(a), sample(b));
    memoKey = key;
  }
  return memoLinking;
}

export default defineScene({
  name: 'The fibre painter',
  duration: 600,
  controls: {
    points: pick('Click the sphere to add a fibre (click a point again to remove it)', { region: [100, 300, 500, 700], max: 20 }),
    preset: choice('Start from', { none: 'nothing', latitude: 'a latitude', meridian: 'a meridian', spiral: 'a spiral' }, { value: 'latitude', lens: true }),
    view: drag('Drag the picture to turn it', { region: [620, 150, 1560, 880] }),
    torus: toggle('Torus', { value: false, lens: true }),
    latitude: slider('Torus latitude', { min: 5, max: 115, value: 63, lens: true, digits: 0, unit: '°' }),
    flow: toggle('Flow along the fibres', { value: true, lens: true }),
  },
  draw(ctx, t, { input }) {
    const gcam = globeCamera(GLOBE);
    const cam = spaceCamera({ cx: 1080, cy: 520, scale: 104, ...dragAngles(input.view, { yaw: 0.5, pitch: 0.45 }) });
    const bases: Vec3[] = [...(PRESETS[input.preset as string] ?? [])];
    for (const [x, y] of (input.points as [number, number][]) ?? []) {
      const p = globePick(gcam, x, y);
      if (p) bases.push(p);
    }
    const polar = ((input.latitude as number) * Math.PI) / 180;

    drawGlobe(ctx, gcam);
    if (input.torus) {
      drawGlobeCurve(ctx, gcam, hopf.latitudeLoop(polar, 120), { color: color.ink, width: 2 });
      drawHopfTorus(ctx, cam, polar, { alpha: 0.24, nu: 48, nv: 24 });
    }
    bases.forEach((p) => globePoint(ctx, gcam, p, fibreColor(p), { r: 7 }));
    const fibres: FibreSpec[] = bases.map((p) => ({ p, width: 2.8 }));
    drawFibres(ctx, cam, fibres, { limit: 4.5 });
    if (input.flow) {
      for (const p of bases) {
        const s = fibrePointOnScreen(cam, p, 0.9 * t, 4.5);
        if (s) dot(ctx, s.x, s.y, 4, color.ink);
      }
    }

    const rows = [{ label: 'fibres', value: String(bases.length) }];
    if (bases.length >= 2) rows.push({ label: 'linking (last two)', value: linking(bases[bases.length - 1], bases[bases.length - 2]).toFixed(3) });
    panel(ctx, 1280, 200, 280, rows, { title: 'measured' });
    text(ctx, 'click the sphere', 300, 760, { ...type.note, align: 'center' });
  },
});
