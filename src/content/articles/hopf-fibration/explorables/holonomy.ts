// Explorable: the holonomy lab. Choose a loop on S², lift it horizontally, compare the holonomy with half the solid angle.
import { defineScene, text, wrap, type, color, hopf, slider, choice, drag, pick, polyline3, dot, ring as circle, vec3 } from '@/stage/kit';
import type { Vec3 } from '@/stage/kit';
import {
  spaceCamera, globeCamera, drawGlobe, drawGlobeCurve, globePoint, globePick, drawFibres, drawHopfTorus, fibreColor, s3ToWorld,
  dragAngles, panel, VERTICAL, HORIZONTAL, TAU,
} from '../film/shared';

const GLOBE = { cx: 300, cy: 500, scale: 190, yaw: 0.6, pitch: 0.5 };

function smallCircle(c: Vec3, r: number, n = 480): Vec3[] {
  const helper: Vec3 = Math.abs(c[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  const u = vec3.normalize(vec3.cross(helper, c));
  const v = vec3.cross(c, u);
  return Array.from({ length: n + 1 }, (_, i) => {
    const s = (i / n) * TAU;
    return vec3.add(vec3.scale(c, Math.cos(r)), vec3.add(vec3.scale(u, Math.sin(r) * Math.cos(s)), vec3.scale(v, Math.sin(r) * Math.sin(s))));
  });
}

interface Lab {
  loop: Vec3[];
  lift: (Vec3 | null)[];
  gamma: number;
  omega: number;
  polar: number | null;
}
let memo: { key: string; lab: Lab | null } = { key: '', lab: null };
function build(key: string, loop: Vec3[] | null, polar: number | null): Lab | null {
  if (memo.key === key) return memo.lab;
  let lab: Lab | null = null;
  if (loop && loop.length > 3) {
    let omega = hopf.solidAngle(loop.slice(0, -1));
    if (omega < 0) omega += 2 * TAU;
    const lifted = hopf.holonomy(loop);
    const { points } = lifted;
    const gamma = lifted.gamma < 0 ? lifted.gamma + TAU : lifted.gamma;
    lab = { loop, lift: points.map((q) => s3ToWorld(q, 6)), gamma, omega, polar };
  }
  memo = { key, lab };
  return lab;
}

const deg = (x: number) => `${((x * 180) / Math.PI).toFixed(2)}°`;

export default defineScene({
  name: 'Holonomy lab',
  duration: 600,
  controls: {
    kind: choice('Loop', { latitude: 'a latitude', circle: 'a small circle', triangle: 'a triangle', yours: 'your polygon' }, { value: 'latitude', lens: true }),
    size: slider('Size', { min: 5, max: 175, value: 60, lens: true, digits: 0, unit: '°' }),
    points: pick('“Your polygon”: click the sphere to add corners', { region: [110, 310, 490, 690], max: 8 }),
    speed: slider('Walking speed', { min: 0, max: 2, value: 1, lens: true, digits: 1 }),
    view: drag('Drag the picture to turn it', { region: [620, 150, 1180, 880] }),
  },
  draw(ctx, t, { input }) {
    const gcam = globeCamera(GLOBE);
    const cam = spaceCamera({ cx: 900, cy: 520, scale: 108, ...dragAngles(input.view, { yaw: 0.4, pitch: 0.55 }) });
    const kind = input.kind as string;
    const size = ((input.size as number) * Math.PI) / 180;
    const picked = ((input.points as [number, number][]) ?? []).map(([x, y]) => globePick(gcam, x, y)).filter(Boolean) as Vec3[];

    let loop: Vec3[] | null = null;
    let polar: number | null = null;
    if (kind === 'latitude') {
      polar = size;
      loop = hopf.latitudeLoop(size, 600);
    } else if (kind === 'circle') loop = smallCircle(hopf.spherePoint(1.3, 2.3), Math.min(size, Math.PI - 0.05) / 2, 600);
    else if (kind === 'triangle') {
      const r = Math.min(size, 170 * (Math.PI / 180)) / 2;
      const c = hopf.spherePoint(0.9, -0.6);
      const corners = [0, 1, 2].map((k) => smallCircle(c, r, 3)[k]);
      loop = hopf.geodesicPolygon(corners, 200);
    } else if (picked.length >= 3) loop = hopf.geodesicPolygon(picked, 120);
    const key = `${kind}|${input.size}|${picked.map((p) => p.map((x) => x.toFixed(4)).join()).join(';')}`;
    const lab = build(key, loop, polar);

    drawGlobe(ctx, gcam);
    picked.forEach((p) => globePoint(ctx, gcam, p, color.ink, { r: 5, alpha: kind === 'yours' ? 1 : 0.35 }));
    if (!lab) {
      wrap(ctx, kind === 'yours' ? 'Click at least three corners on the sphere.' : 'Choose a loop.', 900, 500, 500, 30, { ...type.body, align: 'center' });
      return;
    }
    const n = lab.loop.length - 1;
    const u = ((t * (input.speed as number)) / 8) % 1;
    const k = Math.round(u * n);
    drawGlobeCurve(ctx, gcam, lab.loop, { color: color.ink, width: 2.6 });
    globePoint(ctx, gcam, lab.loop[k], fibreColor(lab.loop[k]), { r: 8 });

    if (lab.polar !== null) drawHopfTorus(ctx, cam, lab.polar, { alpha: 0.12, nu: 44, nv: 22 });
    drawFibres(ctx, cam, [
      { p: lab.loop[0], color: VERTICAL, width: 2.4, alpha: 0.7 },
      { p: lab.loop[k], width: 2.8 },
    ], { limit: 5 });
    drawFibres(ctx, cam, [{ p: lab.loop[0], color: VERTICAL, width: 6, progress: lab.gamma / TAU, samples: 240 }], { limit: 5, halo: false, depthCue: 0 });
    polyline3(ctx, cam, lab.lift, { color: HORIZONTAL, width: 3.2, progress: Math.max(0.002, u) });
    const start = lab.lift[0];
    const end = lab.lift[n];
    const now = lab.lift[k];
    if (start) {
      const s = cam.project(start);
      circle(ctx, s.x, s.y, 12, color.ink, 1, 2.4);
    }
    if (end) {
      const s = cam.project(end);
      circle(ctx, s.x, s.y, 14, color.gold, 1, 2.6);
    }
    if (now) {
      const s = cam.project(now);
      dot(ctx, s.x, s.y, 6, color.ink);
    }

    panel(ctx, 1230, 220, 330, [
      { label: 'solid angle Ω (left)', value: deg(lab.omega) },
      { label: 'holonomy γ', value: deg(lab.gamma), color: VERTICAL },
      { label: 'Ω / 2', value: deg(lab.omega / 2) },
      { label: 'γ − Ω/2 (mod 360°)', value: deg(hopf.wrapAngle(lab.gamma - lab.omega / 2)), color: color.gold },
    ], { title: 'measured' });
    wrap(ctx, 'White ring: where the lift starts. Gold ring: where it ends, on the same fibre. The gold arc between them is the holonomy.', 1230, 470, 330, 27, { ...type.body, size: 17 });
    text(ctx, 'corners are joined by great-circle arcs', 1230, 600, { ...type.note, size: 13, alpha: kind === 'yours' || kind === 'triangle' ? 1 : 0 });
  },
});
