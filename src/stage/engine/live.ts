// What one viewer sees of the live scenes: the player and the poster renderer
// each get their own LiveView, with their own simulation cursors, while the
// snapshots of the authored run are shared through each scene's track.
// A LiveView also holds the viewer's lens settings and explore mode.

import { inputsAt, Inputs } from './controls';
import { stepAt, Track, Cursor } from './simulation';
import type { Scene } from './timeline';

export interface LiveState {
  input: Inputs;
  state: any;
  pending: boolean;
  exploring: boolean;
}

/** What a scene without controls or simulation resolves to. */
export const STILL: LiveState = Object.freeze({ input: Object.freeze({}), state: null, pending: false, exploring: false });

interface Explore {
  scene: Scene;
  t0: number;
  input: Inputs;
  cursor: Cursor | null;
  paused: boolean;
  carry: number;
}

export class LiveView {
  budgetMs: number;
  levers: Inputs | null;
  fixedLenses: Inputs | null;
  cursors = new Map<number, Cursor>();
  lenses = new Map<number, Inputs>();
  explore: Explore | null = null;

  constructor({ budgetMs = Infinity, levers = null, lenses = null }: { budgetMs?: number; levers?: Inputs | null; lenses?: Inputs | null } = {}) {
    this.budgetMs = budgetMs;
    this.levers = levers;
    this.fixedLenses = lenses;
  }

  /** Inputs and simulation state of a scene at local time t, and whether the state is still catching up. */
  resolve(scene: Scene, t: number): LiveState {
    if (!scene.live) return STILL;
    const ex = this.explore;
    if (ex?.scene === scene) {
      const forked = this.fork(ex);
      const state = forked ? ex.cursor?.state ?? null : this.cursors.get(scene.index)?.state ?? null;
      return { input: this.withLenses(scene, ex.input), state, pending: !forked, exploring: true };
    }
    const input = this.withLenses(scene, { ...inputsAt(scene.controls, t), ...this.leversOf(scene) });
    if (!scene.sim) return { input, state: null, pending: false, exploring: false };
    const cursor = this.cursor(scene);
    const n = stepAt(scene.sim, t);
    const reached = cursor.seek(n, this.deadline(cursor, n));
    return { input, state: cursor.state, pending: !reached, exploring: false };
  }

  // ---- explore mode ------------------------------------------------------

  /** Branch off the authored run at local time t0; the narration stays frozen there. */
  startExplore(scene: Scene, t0: number) {
    this.explore = { scene, t0, input: { ...inputsAt(scene.controls, t0), ...this.leversOf(scene) }, cursor: null, paused: false, carry: 0 };
  }

  setLever(name: string, value: unknown) {
    if (this.explore) this.explore.input = { ...this.explore.input, [name]: value };
  }

  /** Run the explore simulation on by `seconds` of real time; returns whether it moved. */
  stepExplore(seconds: number): boolean {
    const ex = this.explore;
    if (!ex?.cursor || ex.paused || !ex.scene.sim) return false;
    ex.carry += Math.min(seconds, 0.1) / ex.scene.sim.dt;
    const steps = Math.floor(ex.carry);
    ex.carry -= steps;
    ex.cursor.advanceTo(ex.cursor.n + steps);
    return steps > 0;
  }

  stopExplore() {
    this.explore = null;
  }

  // ---- lenses ------------------------------------------------------------

  setLens(scene: Scene, name: string, value: unknown) {
    this.lenses.set(scene.index, { ...this.lenses.get(scene.index), [name]: value });
  }

  lens(scene: Scene, name: string): unknown {
    return this.lenses.get(scene.index)?.[name];
  }

  resetLenses(scene: Scene) {
    this.lenses.delete(scene.index);
  }

  /** Forget cursors, lens settings and explore mode. */
  clear() {
    this.cursors.clear();
    this.lenses.clear();
    this.explore = null;
  }

  /** Start the explore branch once the authored run has reached t0, within this frame's budget. */
  private fork(ex: Explore): boolean {
    if (ex.cursor || !ex.scene.sim) return true;
    const cursor = this.cursor(ex.scene);
    const n = stepAt(ex.scene.sim, ex.t0);
    if (!cursor.seek(n, this.deadline(cursor, n))) return false;
    ex.cursor = cursor.fork(() => ex.input);
    return true;
  }

  private deadline(cursor: Cursor, n: number): number {
    if (this.budgetMs === Infinity) return Infinity;
    const every = cursor.spec.stepsPerSnapshot;
    const near = (n >= cursor.n && n - cursor.n <= every) || (cursor.track?.computed ?? -1) >= n - (n % every);
    return near ? Infinity : performance.now() + this.budgetMs;
  }

  private leversOf(scene: Scene): Inputs {
    return pickEntries(this.levers, (name) => scene.levers.includes(name));
  }

  private withLenses(scene: Scene, input: Inputs): Inputs {
    const isLens = (name: string) => scene.controls?.[name]?.lens === true;
    return { ...input, ...pickEntries(this.fixedLenses, isLens), ...pickEntries(this.lenses.get(scene.index), isLens) };
  }

  private cursor(scene: Scene): Cursor {
    let cursor = this.cursors.get(scene.index);
    if (!cursor) {
      const levers = this.leversOf(scene);
      const track = Object.keys(levers).length ? new Track(scene.sim!, (t) => ({ ...inputsAt(scene.controls, t), ...levers })) : scene.track!;
      cursor = track.cursor();
      this.cursors.set(scene.index, cursor);
    }
    return cursor;
  }
}

function pickEntries(values: Inputs | null | undefined, keep: (name: string) => boolean): Inputs {
  const out: Inputs = {};
  if (!values) return out;
  for (const name of Object.keys(values)) if (keep(name)) out[name] = values[name];
  return out;
}

/**
 * Compute the authored runs of all live scenes in the background, `sliceMs` at a time,
 * so that later seeks find their snapshots. Returns a function that stops it.
 */
export function warmUp(scenes: Scene[], { sliceMs = 6, busy = () => false }: { sliceMs?: number; busy?: () => boolean } = {}): () => void {
  const jobs = scenes.filter((s) => s.track).map((s) => ({ cursor: s.track!.cursor(), end: stepAt(s.sim!, s.duration) }));
  let stopped = false;
  const work = () => {
    const job = jobs.find((j) => j.cursor.n < j.end);
    if (stopped || !job) return;
    if (busy()) {
      setTimeout(work, 50);
      return;
    }
    try {
      job.cursor.seek(job.end, performance.now() + sliceMs);
    } catch (err) {
      console.error('Warming up a live scene failed', err);
      return;
    }
    setTimeout(work, 0);
  };
  setTimeout(work, 0);
  return () => {
    stopped = true;
  };
}
