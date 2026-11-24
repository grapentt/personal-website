import { defineScene, seg, fade, text, wrap, type, color, font, dot, polyline } from '@/stage/kit';

const CORNERS: [number, number][] = [[-1, 1], [1, 1], [1, -1], [-1, -1]];
const NAMES = ['A', 'B', 'C', 'D'];
const TINTS = [color.gold, color.soft, color.rose, color.mint];

/** The square after: a rotation by `angle`, then a reflection in the vertical axis by amount `mirror` (0 … 1, animated as a squash). */
function corner(k: number, angle: number, mirror: number): [number, number] {
  const [x, y] = CORNERS[k];
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const rx = c * x - s * y;
  const ry = s * x + c * y;
  return [rx * (1 - 2 * mirror), ry];
}

export default defineScene({
  name: 'Symmetry',
  duration: 30,
  narration: [
    [0, 'To understand a space, study its symmetries. A symmetry is a transformation that leaves something unchanged. Take a square.'],
    [6, 'Turn it by a quarter: the square looks exactly the same, even though every corner has moved.'],
    [13, 'Mirror it: again the same square. But read the corners in order: A, B, C, D used to go clockwise, and now they go anticlockwise. The reflection reversed the orientation.'],
    [23, 'So what counts as unchanged is a choice. We choose which structure to keep, and the symmetries are the transformations that keep it.'],
  ],
  header: { eyebrow: '02 · SYMMETRY', title: 'A symmetry keeps what we care about' },
  draw(ctx, t) {
    const cx = 480;
    const cy = 520;
    const unit = 150;
    const angle = (Math.PI / 2) * seg(t, 7, 10);
    const mirror = seg(t, 14, 17);
    const P = (k: number): [number, number] => {
      const [x, y] = corner(k, angle, mirror);
      return [cx + unit * x, cy - unit * y];
    };
    // the outline where the square started
    polyline(ctx, CORNERS.map(([x, y]) => [cx + unit * x, cy - unit * y] as [number, number]), { color: color.dim, width: 1.5, dash: [5, 6], close: true, alpha: seg(t, 6, 7) });
    // the square
    const pts = [0, 1, 2, 3].map(P);
    ctx.save();
    ctx.globalAlpha = seg(t, 0.3, 1.2);
    ctx.fillStyle = 'rgba(108,196,232,0.10)';
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    polyline(ctx, pts, { color: color.soft, width: 3, close: true, alpha: seg(t, 0.3, 1.2) });
    pts.forEach(([x, y], k) => {
      dot(ctx, x, y, 16, TINTS[k], seg(t, 0.8 + 0.2 * k, 1.3 + 0.2 * k));
      text(ctx, NAMES[k], x, y + 1, { font: font.mono, size: 17, weight: 600, color: color.bg, align: 'center', baseline: 'middle', alpha: seg(t, 0.8 + 0.2 * k, 1.3 + 0.2 * k) });
    });
    // the orientation arrow: clockwise before the mirror, anticlockwise after
    const o = fade(t, 18, 19, 29, 30) + fade(t, 2, 3, 6, 7);
    if (o > 0.01) {
      const clockwise = t < 15;
      const arc: [number, number][] = Array.from({ length: 41 }, (_, i) => {
        const s = (clockwise ? -1 : 1) * (0.3 + (i / 40) * 1.4 * Math.PI) + Math.PI / 2;
        return [cx + 60 * Math.cos(s), cy - 60 * Math.sin(s)];
      });
      polyline(ctx, arc, { color: color.gold, width: 3, alpha: o });
      const [ex, ey] = arc[40];
      const [px, py] = arc[38];
      const ang = Math.atan2(ey - py, ex - px);
      ctx.save();
      ctx.globalAlpha = o;
      ctx.fillStyle = color.gold;
      ctx.beginPath();
      ctx.moveTo(ex + 12 * Math.cos(ang), ey + 12 * Math.sin(ang));
      ctx.lineTo(ex + 9 * Math.cos(ang + 2.3), ey + 9 * Math.sin(ang + 2.3));
      ctx.lineTo(ex + 9 * Math.cos(ang - 2.3), ey + 9 * Math.sin(ang - 2.3));
      ctx.fill();
      ctx.restore();
      text(ctx, clockwise ? 'A → B → C → D: clockwise' : 'A → B → C → D: anticlockwise', cx, cy + 250, { font: font.mono, size: 18, color: color.gold, align: 'center', alpha: o });
    }

    const x0 = 900;
    wrap(ctx, 'Rotation by 90°: the same square. Lengths, angles and the order of the corners are all kept.', x0, 300, 600, 32, { ...type.body, alpha: seg(t, 8, 9) });
    wrap(ctx, 'Reflection: the same square, but the corners now run the other way round. The orientation is reversed.', x0, 440, 600, 32, { ...type.body, alpha: seg(t, 16, 17) });
    wrap(ctx, 'A symmetry is a transformation that keeps the structure we choose to care about.', x0, 600, 600, 34, { ...type.display, size: 27, color: color.gold, alpha: seg(t, 23.5, 24.5) });
  },
});
