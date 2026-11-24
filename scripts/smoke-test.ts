// Draw every scene of every film and every explorable at several moments on a stub
// 2D context, and fail on any exception. Also reports frames slower than 40 ms (Node is
// slower than a browser, so this is a rough guide). Run with `npm run smoke`.

import { inputsAt } from '../src/stage/engine/controls';
import type { Scene } from '../src/stage/engine/timeline';
import hopfFilm from '../src/content/articles/hopf-fibration/film';
import shapeFilm from '../src/content/articles/shape-space/film';
import quatFilm from '../src/content/articles/quaternions-4d-rotations/film';
import complexEx from '../src/content/articles/quaternions-4d-rotations/explorables/complex';
import doubleRotationEx from '../src/content/articles/quaternions-4d-rotations/explorables/doubleRotation';
import rotate3dEx from '../src/content/articles/quaternions-4d-rotations/explorables/rotate3d';
import dials from '../src/content/articles/hopf-fibration/explorables/dials';
import circles from '../src/content/articles/hopf-fibration/explorables/circles';
import painter from '../src/content/articles/hopf-fibration/explorables/painter';
import holonomy from '../src/content/articles/hopf-fibration/explorables/holonomy';
import fallingCat from '../src/content/articles/shape-space/explorables/fallingCat';
import moleculeLoop from '../src/content/articles/shape-space/explorables/moleculeLoop';
import torusConnection from '../src/content/articles/shape-space/explorables/torusConnection';
import curvatureTiles from '../src/content/articles/shape-space/explorables/curvatureTiles';

function stubContext(): CanvasRenderingContext2D {
  const store: Record<string | symbol, unknown> = { globalAlpha: 1, lineWidth: 1 };
  const gradient = { addColorStop: () => {} };
  return new Proxy(store, {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (prop === 'measureText') return (s: string) => ({ width: 9 * String(s).length });
      if (prop === 'createLinearGradient' || prop === 'createRadialGradient') return () => gradient;
      if (prop === 'getImageData' || prop === 'createImageData') return () => ({ data: new Uint8ClampedArray(4) });
      return () => {};
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
  }) as unknown as CanvasRenderingContext2D;
}

let failures = 0;
const slow: string[] = [];
function run(label: string, scene: Scene, times: number[], extraInputs: Record<string, unknown>[] = [{}]) {
  for (const extra of extraInputs) {
    for (const t of times) {
      const ctx = stubContext();
      const input = { ...inputsAt(scene.controls, t), ...extra };
      const start = performance.now();
      try {
        scene.draw(ctx, t, { input, state: null, pending: false, exploring: false });
      } catch (err) {
        failures++;
        console.error(`FAIL ${label} at t = ${t.toFixed(2)} ${JSON.stringify(extra)}:`, err);
      }
      const ms = performance.now() - start;
      if (ms > 40) slow.push(`${label} t=${t.toFixed(1)} ${ms.toFixed(0)} ms`);
    }
  }
}

for (const film of [quatFilm, hopfFilm, shapeFilm]) {
  film.scenes.forEach((scene, i) => {
    const d = scene.duration;
    run(`${film.id} #${i} ${scene.name}`, scene, [0, 0.25 * d, 0.5 * d, 0.75 * d, d - 0.01]);
  });
  console.info(`${film.id}: ${film.scenes.length} scenes, ${(film.scenes.reduce((s, x) => s + x.duration, 0) / 60).toFixed(1)} min`);
}

const pts: [number, number][] = [[300, 450], [360, 520], [260, 560], [700, 400]];
run('explorable dials', dials, [0, 3, 30], [{}, { balance: 0 }, { balance: 180 }, { turn: false }]);
run('explorable circles', circles, [0, 5], [{}, { height: 0.95, tilt: 0 }, { tilt: 90, height: 0 }, { tilt: 30, height: Math.cos((30 * Math.PI) / 180) }]);
run('explorable painter', painter, [0, 5], [{}, { preset: 'spiral', torus: true }, { points: pts }, { preset: 'none' }]);
run('explorable holonomy', holonomy, [0, 4, 9], [{}, { kind: 'circle', size: 170 }, { kind: 'triangle' }, { kind: 'yours', points: pts }, { kind: 'yours' }, { kind: 'latitude', size: 175 }]);
run('explorable fallingCat', fallingCat, [0, 4, 20], [{}, { ratio: 1 }, { twist: 0 }]);
run('explorable moleculeLoop', moleculeLoop, [0, 4, 20], [{}]);
run('explorable torusConnection', torusConnection, [0, 4, 20], [{}, { mu: 0.5, lambda: -1.5 }]);
run('explorable curvatureTiles', curvatureTiles, [0, 4, 20], [{}, { lambda: 0 }]);

run('explorable complex', complexEx, [0, 5], [{}, { rz: 0.2, rw: 2, az: -180, aw: 180 }]);
run('explorable doubleRotation', doubleRotationEx, [0, 3, 30], [{}, { t1: 0, t2: 0 }, { t1: 70, t2: 70 }, { t1: 70, t2: -70 }, { t1: 0, t2: 90 }, { spin: false }]);
run('explorable rotate3d', rotate3dEx, [0, 5], [{}, { minus: true }, { phi: 360, elevation: 90 }, { elevation: -90 }]);

if (slow.length) console.info(`slow frames (>40 ms in Node):\n  ${slow.join('\n  ')}`);
if (failures) {
  console.error(`${failures} failure(s)`);
  process.exit(1);
}
console.info('smoke test passed');
