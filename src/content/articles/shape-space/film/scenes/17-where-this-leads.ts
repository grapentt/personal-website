// The closing summary: the three ideas of the film side by side, each drawn
// with the helpers of the scenes where it was introduced, then the way on.

import {
  defineScene, seg, text, type, color, rgba, roundRect, ring, drawSurface, polyline3,
} from '@/stage/kit';
import type { Camera, Vec3 } from '@/stage/kit';
import {
  VERTICAL, HORIZONTAL, torusPoint, torusEnergy, torusCamera, energyColor, facesCamera, bundleCamera, bundlePoint,
} from '../shared';
import { RECT, drawRectangle, drawDashes } from '../flatTorus';
import { TWIST, LIFT_START, FLOOR, drawFloor, drawFibres, drawTiles, loopPoints, drawLoopAndLift } from '../bundleBox';

const TILE = { top: 190, width: 440, height: 470, gap: 40, left: 100 };
const tileX = (k: number) => TILE.left + k * (TILE.width + TILE.gap);
const tileCentre = (k: number) => tileX(k) + TILE.width / 2;
const DRAWING_Y = 420;
const TILES = [
  { label: 'BUNDLE', caption: 'fibres over a base: circles over a circle', accent: VERTICAL },
  { label: 'CONNECTION', caption: 'which directions count as horizontal', accent: HORIZONTAL },
  { label: 'CURVATURE', caption: 'a horizontal loop does not close up', accent: color.gold },
];
const FIBRES = [0.4, 1.45, 2.5, 3.55, 4.6, 5.65];
/** Where tile k starts to appear. */
const appear = (k: number) => 1 + 2.5 * k;

const circle = (f: (s: number) => Vec3, n = 72) => Array.from({ length: n + 1 }, (_, i) => f((i / n) * 2 * Math.PI));

export default defineScene({
  name: 'Where this leads',
  duration: 16,
  narration:
    'Three ideas carried the whole film: a bundle, a space made of fibres over a base; a connection, which says what counts as horizontal; and curvature, what a loop of horizontal steps leaves behind. The Hopf fibration is the same structure one step further: a circle as the fibre over the ordinary sphere.',
  header: { eyebrow: '08 · WHERE THIS LEADS', title: 'Bundle, connection, curvature' },

  draw(ctx, t) {
    TILES.forEach(({ label, caption, accent }, k) => {
      const a = seg(t, appear(k), appear(k) + 1);
      if (a <= 0.003) return;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = rgba(color.panel, 0.7);
      ctx.strokeStyle = color.line;
      ctx.lineWidth = 1.5;
      roundRect(ctx, tileX(k), TILE.top, TILE.width, TILE.height, 14);
      ctx.fill();
      ctx.stroke();
      text(ctx, label, tileX(k) + 28, TILE.top + 42, { ...type.eyebrow, color: accent });
      if (k === 0) drawBundleTile(ctx, t);
      else if (k === 1) drawConnectionTile(ctx);
      else drawCurvatureTile(ctx, t);
      text(ctx, caption, tileCentre(k), TILE.top + TILE.height - 30, { ...type.body, size: 20, align: 'center', alpha: seg(t, appear(k) + 0.6, appear(k) + 1.4) });
      ctx.restore();
    });

    text(ctx, 'Next: the same story over the sphere, the Hopf fibration.', 800, 760, { ...type.display, align: 'center', alpha: seg(t, 9.5, 10.5) });
  },
});

/** The energy-coloured torus with a few of its fibres in gold. */
function drawBundleTile(ctx: CanvasRenderingContext2D, t: number) {
  const cam = torusCamera({ cx: tileCentre(0), cy: DRAWING_Y, scale: 60, yaw: 0.25 + 0.04 * t });
  drawSurface(ctx, cam, torusPoint, { nu: 48, nv: 20, color: (theta) => energyColor(torusEnergy(theta)) });
  for (const theta of FIBRES) {
    polyline3(ctx, cam, circle((phi) => torusPoint(theta, phi)), { color: VERTICAL, width: 2.5, visible: (i) => facesCamera(cam, theta, (i / 72) * 2 * Math.PI) });
  }
}

/** The torus cut open, with the tilted dashes of a connection, scaled into the tile. */
function drawConnectionTile(ctx: CanvasRenderingContext2D) {
  const s = 0.44;
  const cx = (RECT.x0 + RECT.x1) / 2;
  const cy = 530; // middle of the rectangle together with its labels
  ctx.save();
  ctx.translate(tileCentre(1) - cx * s, DRAWING_Y - cy * s);
  ctx.scale(s, s);
  drawRectangle(ctx);
  drawDashes(ctx, 1);
  ctx.restore();
}

/** The bundle box with twisted tiles and a lifted loop whose end misses its start. */
function drawCurvatureTile(ctx: CanvasRenderingContext2D, t: number) {
  const cam: Camera = bundleCamera({ cx: tileCentre(2), cy: DRAWING_Y + 10, scale: 55, yaw: 0.55 + 0.02 * t });
  drawFloor(ctx, cam);
  drawFibres(ctx, cam);
  drawTiles(ctx, cam, TWIST, { alpha: 0.5 });
  const loop = loopPoints(1);
  const lifted = drawLoopAndLift(ctx, cam, loop, LIFT_START, TWIST);
  const [x0, y0] = loop[0];
  const end = lifted[lifted.length - 1];
  polyline3(ctx, cam, [bundlePoint(x0, y0, FLOOR), bundlePoint(x0, y0, 1.9)], { color: VERTICAL, width: 2.5 });
  const start = cam.project(bundlePoint(x0, y0, LIFT_START));
  const finish = cam.project(bundlePoint(...end));
  ring(ctx, start.x, start.y, 7, color.ink, 1, 2);
  ring(ctx, finish.x, finish.y, 7, color.gold, 1, 2.5);
}
