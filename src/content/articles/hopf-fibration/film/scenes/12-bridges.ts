import { defineScene, seg, lin, text, wrap, type, color, font, hopf, drawMolecule, moleculeCamera, molecule, line } from '@/stage/kit';
import { spaceCamera, drawFibres, VERTICAL, HORIZONTAL } from '../shared';

const ROWS: [string, string, string][] = [
  ['fibre', 'a circle S¹: the phase', 'the rigid motions SE(3)'],
  ['total space', 'S³ ⊂ ℂ²', 'configurations ℝ³ᴺ'],
  ['base', 'S², e.g. the Bloch sphere', 'shapes M = ℝ³ᴺ / SE(3)'],
  ['horizontal', 'at right angles to the fibre', 'zero linear and angular momentum'],
  ['holonomy', 'a phase: half the solid angle', 'a rotation: the falling cat'],
];
const A = hopf.spherePoint(0.9, 0.3);
const B = hopf.spherePoint(1.7, 2.8);

export default defineScene({
  name: 'Two bridges',
  duration: 34,
  narration: [
    [0, 'Everything here, fibre, total space, base, a connection chosen by a metric, and holonomy measured by curvature, is the general shape of a fibre bundle.'],
    [11, 'Replace the circle by the group of rigid motions, S³ by the configurations of a molecule, and the sphere by the space of its shapes. The metric becomes kinetic energy, horizontal means zero angular momentum, and the holonomy of a loop of shapes is a rotation.'],
    [25, 'That is how a falling cat lands on its feet. It is the subject of the next film: the geometry of shape space.'],
  ],
  header: { eyebrow: '08 · WHY IT MATTERS', title: 'One idea, two bundles' },
  draw(ctx, t) {
    const left = 320;
    const right = 1150;
    // two small pictures
    const cam = spaceCamera({ cx: left + 60, cy: 330, scale: 70, yaw: 0.3 + 0.05 * t, pitch: 0.5 });
    drawFibres(ctx, cam, [{ p: A, width: 2.6 }, { p: B, width: 2.6 }], { limit: 4 });
    const mcam = moleculeCamera({ cx: right, cy: 330, scale: 70, yaw: 0.5 + 0.3 * Math.sin(0.4 * t), pitch: 0.3 });
    drawMolecule(ctx, molecule.positions, mcam, { opacity: seg(t, 11, 12.5), labels: 0 });

    text(ctx, 'The Hopf bundle', left + 60, 450, { ...type.display, size: 28, align: 'center', color: VERTICAL, alpha: seg(t, 0.5, 1.5) });
    text(ctx, 'The shape-space bundle', right, 450, { ...type.display, size: 28, align: 'center', color: HORIZONTAL, alpha: seg(t, 11, 12) });

    ROWS.forEach(([what, hopfSide, shapeSide], k) => {
      const y = 520 + 52 * k;
      const a = seg(t, 2 + 1.4 * k, 2.8 + 1.4 * k);
      text(ctx, what, 800, y, { font: font.mono, size: 15, color: color.muted, align: 'center', alpha: a });
      text(ctx, hopfSide, left + 60, y, { ...type.body, size: 20, align: 'center', alpha: a });
      text(ctx, shapeSide, right, y, { ...type.body, size: 20, align: 'center', alpha: seg(t, 12 + 1.4 * k, 12.8 + 1.4 * k) });
      line(ctx, 160, y + 20, 1440, y + 20, { color: color.line, width: 1, alpha: 0.5 * a });
    });
    wrap(ctx, 'Next: the geometry of shape space, where this holonomy turns a falling cat.', 800, 840, 900, 30, { ...type.body, size: 22, color: color.gold, align: 'center', alpha: seg(t, 26, 27), chars: Math.floor(120 * lin(t, 26, 30)) });
  },
});
