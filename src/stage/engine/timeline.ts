// A film is an ordered list of scenes. The timeline places them end to end,
// finds the scene for any global time, and takes care of what every scene
// shares: background, the header block, and the dip-to-dark between scenes.

import { seg, fade } from './timing';
import { checkControls, inputsAt, Controls } from './controls';
import { LiveView, STILL, LiveState } from './live';
import { Track, Simulation } from './simulation';
import { rgba } from '../draw/color';
import { color, type } from '../draw/theme';
import { text } from '../draw/text';
import { sceneHeader, SceneHeaderSpec } from '../draw/widgets';

/** All drawing happens in these stage units; the canvas scales them to its pixel size. */
export const STAGE = Object.freeze({ width: 1600, height: 900 });

const FADE_IN = 0.6;
const FADE_OUT = 0.45;

export type NarrationCue = [number, string];

export interface SceneSpec {
  /** Chapter label in the player. */
  name: string;
  /** Length in seconds. */
  duration: number;
  /** Draws the frame at local time t (0 … duration) in stage units. */
  draw: (ctx: CanvasRenderingContext2D, t: number, live: LiveState) => void;
  /** Script line shown under the stage, or [time, text] cues for a long scene. */
  narration?: string | NarrationCue[];
  /** Drawn and faded automatically. */
  header?: SceneHeaderSpec | null;
  /** Flow straight on from the previous scene instead of dipping to dark. */
  continues?: boolean;
  controls?: Controls;
  sim?: Simulation;
  /** Named moments, listed as sub-chapters. */
  beats?: [number, string][];
  /** Invitations to take over the controls. */
  handovers?: { at: number; prompt: string }[];
  /** Earliest local time explore mode starts from. */
  exploreFrom?: number;
}

export interface Scene extends Required<Omit<SceneSpec, 'controls' | 'sim' | 'header'>> {
  controls: Controls | null;
  sim: Simulation | null;
  header: SceneHeaderSpec | null;
  live: boolean;
  levers: string[];
  track: Track | null;
  /** Set by the Timeline. */
  index: number;
  start: number;
}

/** Validate a scene definition and fill in defaults. */
export function defineScene(spec: SceneSpec): Scene {
  const fail = (why: string): never => {
    throw new Error(`Scene "${spec.name ?? '(unnamed)'}" ${why}`);
  };
  if (!spec.name || !(spec.duration > 0) || typeof spec.draw !== 'function') fail('needs a name, a positive duration and draw(ctx, t).');
  const inScene = (time: number) => time >= 0 && time < spec.duration;
  const ordered = (times: number[]) => times.every((time, i) => inScene(time) && (i === 0 || time > times[i - 1]));
  if (Array.isArray(spec.narration) && !(spec.narration[0]?.[0] === 0 && ordered(spec.narration.map(([time]) => time)))) {
    fail('needs narration cues in order, the first at 0 s.');
  }
  if (!ordered((spec.beats ?? []).map(([time]) => time))) fail('has beats outside the scene or out of order.');
  if (!(spec.handovers ?? []).every(({ at }) => inScene(at))) fail('has a hand-over outside the scene.');

  const controls = spec.controls ? Object.freeze({ ...spec.controls }) : null;
  const sim = spec.sim ?? null;
  const live = Boolean(controls || sim);
  if (!live && (spec.handovers?.length || spec.exploreFrom)) fail('has hand-overs or exploreFrom but no controls.');
  const levers = live ? checkControls(controls ?? {}, [...(sim?.uses ?? [])], spec.name) : [];
  return Object.freeze({
    narration: '',
    continues: false,
    beats: [],
    handovers: [],
    exploreFrom: 0,
    ...spec,
    header: spec.header ?? null,
    controls,
    sim,
    live,
    levers,
    track: sim ? new Track(sim, (t) => inputsAt(controls, t)) : null,
    index: -1,
    start: 0,
  }) as Scene;
}

/** The narration line of a scene at local time t, and which cue it is. */
export function narrationAt(scene: Scene, t: number): { text: string; cue: number } {
  if (!Array.isArray(scene.narration)) return { text: scene.narration, cue: 0 };
  let cue = 0;
  while (cue < scene.narration.length - 1 && t >= scene.narration[cue + 1][0]) cue++;
  return { text: scene.narration[cue][1], cue };
}

export interface RenderResult extends LiveState {
  /** How far the frame is dipped to dark between scenes (0 … 1). */
  dip: number;
}

export class Timeline {
  scenes: Scene[];
  duration: number;
  background?: (ctx: CanvasRenderingContext2D) => void;
  /** Used when render() is called without a view: the authored version, always fully computed. */
  view = new LiveView();

  constructor(scenes: Scene[], { background }: { background?: (ctx: CanvasRenderingContext2D) => void } = {}) {
    let start = 0;
    this.scenes = scenes.map((scene, index) => {
      const entry = Object.freeze({ ...scene, index, start }) as Scene;
      start += scene.duration;
      return entry;
    });
    this.duration = start;
    this.background = background;
  }

  indexAt(T: number): number {
    let i = 0;
    while (i < this.scenes.length - 1 && T >= this.scenes[i].start + this.scenes[i].duration) i++;
    return i;
  }

  sceneAt(T: number): Scene {
    return this.scenes[this.indexAt(T)];
  }

  /**
   * Draw the frame at global time T as `view` sees it. Expects ctx scaled to stage units.
   * Returns what the scene resolved plus the dip to dark.
   */
  render(ctx: CanvasRenderingContext2D, T: number, view: LiveView = this.view): RenderResult {
    const i = this.indexAt(T);
    const scene = this.scenes[i];
    const next = this.scenes[i + 1];
    const t = T - scene.start;
    const joinsPrevious = i > 0 && scene.continues;
    const joinsNext = Boolean(next?.continues);
    let live: LiveState = STILL;
    try {
      live = view.resolve(scene, t);
    } catch (err) {
      console.error(`Scene "${scene.name}": simulating t = ${t.toFixed(2)} s failed`, err);
    }

    this.background?.(ctx);

    if (scene.header) {
      let alpha = joinsNext ? fade(t, 0.1, 0.9, scene.duration - 0.7, scene.duration - 0.1) : seg(t, 0.1, 0.9);
      if (live.exploring) alpha = 1;
      sceneHeader(ctx, scene.header, alpha);
    }

    ctx.save();
    try {
      scene.draw(ctx, t, live);
    } catch (err) {
      console.error(`Scene "${scene.name}" failed at t = ${t.toFixed(2)} s`, err);
    }
    ctx.restore();

    if (live.pending) text(ctx, 'computing the simulation …', STAGE.width - 40, STAGE.height - 30, { ...type.note, align: 'right' });

    const dipIn = i > 0 && !joinsPrevious ? 1 - seg(t, 0, FADE_IN) : 0;
    const dipOut = next && !joinsNext ? seg(t, scene.duration - FADE_OUT, scene.duration) : 0;
    const dip = live.exploring ? 0 : Math.max(dipIn, dipOut);
    if (dip > 0) {
      ctx.fillStyle = rgba(color.bg, dip);
      ctx.fillRect(0, 0, STAGE.width, STAGE.height);
    }
    return { ...live, dip };
  }
}

/** A film: its scenes plus how it is presented. */
export interface Film {
  id: string;
  title: string;
  /** Two parts of the heading, the second set in the accent colour. */
  heading: [string, string];
  label: string;
  scenes: Scene[];
  /** Frame shown before the viewer presses play. */
  posterTime?: number;
}
