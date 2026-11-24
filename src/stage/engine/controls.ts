// Controls of a live scene. Each control has an authored value over time: a
// constant, or [time, value] keyframes. Numbers ease from one keyframe to the
// next like seg(), so a sudden change needs a holding keyframe just before it;
// choices switch at their keyframe. No DOM access.
//
// A lever changes the simulated physics (it is listed in the simulation's
// `uses`); touching one starts explore mode. A lens only changes the view.

import { lerp, seg } from './timing';

export type Keyframes<T> = [number, T][];
export type Region = [number, number, number, number];

export interface SliderControl {
  kind: 'slider';
  label: string;
  min: number;
  max: number;
  step: number;
  value: number | Keyframes<number>;
  lens: boolean;
  digits: number;
  /** Optional unit shown after the value. */
  unit?: string;
}

export interface ChoiceControl {
  kind: 'choice';
  label: string;
  options: Record<string, string>;
  value: string | Keyframes<string>;
  lens: boolean;
}

export interface ToggleControl {
  kind: 'toggle';
  label: string;
  value: boolean | Keyframes<boolean>;
  lens: boolean;
}

export interface DragControl {
  kind: 'drag';
  label: string;
  region: Region;
  value: [number, number];
  lens: true;
}

export interface PickControl {
  kind: 'pick';
  label: string;
  region: Region;
  /** Picked stage points; clicking near an existing one removes it. */
  value: [number, number][];
  max: number;
  lens: true;
}

export type Control = SliderControl | ChoiceControl | ToggleControl | DragControl | PickControl;
export type Controls = Record<string, Control>;
export type Inputs = Record<string, unknown>;

/** A number between min and max. */
export const slider = (
  label: string,
  { min, max, step = (max - min) / 100, value, lens = false, digits = 2, unit }: { min: number; max: number; step?: number; value: number | Keyframes<number>; lens?: boolean; digits?: number; unit?: string },
): SliderControl => Object.freeze({ kind: 'slider', label, min, max, step, value, lens, digits, unit }) as SliderControl;

/** One of several named options, e.g. choice('Walls', { keep: 'keep the rule', drop: 'drop the current' }, …). */
export const choice = (label: string, options: Record<string, string>, { value, lens = false }: { value: string | Keyframes<string>; lens?: boolean }): ChoiceControl =>
  Object.freeze({ kind: 'choice', label, options: Object.freeze({ ...options }), value, lens }) as ChoiceControl;

/** An on/off switch. */
export const toggle = (label: string, { value, lens = false }: { value: boolean | Keyframes<boolean>; lens?: boolean }): ToggleControl =>
  Object.freeze({ kind: 'toggle', label, value, lens }) as ToggleControl;

/**
 * Dragging inside a stage region ([x0, y0, x1, y1] in stage units). Always a lens; its value is the
 * accumulated drag offset [dx, dy] in stage units, authored as [0, 0].
 */
export const drag = (label: string, { region }: { region: Region }): DragControl =>
  Object.freeze({ kind: 'drag', label, region: Object.freeze([...region]) as unknown as Region, value: [0, 0] as [number, number], lens: true as const }) as DragControl;

/**
 * Clicking inside a stage region adds a point (a lens); clicking near an existing point removes it.
 * The value is the list of stage points. `value` gives the points present at the start.
 */
export const pick = (label: string, { region, max = 12, value = [] }: { region: Region; max?: number; value?: [number, number][] }): PickControl =>
  Object.freeze({ kind: 'pick', label, region: Object.freeze([...region]) as unknown as Region, value, max, lens: true as const }) as PickControl;

const isKeyframes = (control: Control): boolean => control.kind !== 'drag' && control.kind !== 'pick' && Array.isArray(control.value);

/** The authored value of one control at time t. */
export function valueAt(control: Control, t: number): unknown {
  if (!isKeyframes(control)) return control.value;
  const keys = control.value as Keyframes<unknown>;
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i];
    if (t < t1) {
      const [t0, v0] = keys[i - 1];
      return control.kind === 'slider' ? lerp(v0 as number, v1 as number, seg(t, t0, t1)) : v0;
    }
  }
  return keys[keys.length - 1][1];
}

/** Authored values of all controls at time t, as { name: value }. */
export function inputsAt(controls: Controls | null | undefined, t: number): Inputs {
  const input: Inputs = {};
  if (!controls) return input;
  for (const name of Object.keys(controls)) input[name] = valueAt(controls[name], t);
  return input;
}

/** Check a scene's controls; returns the names of its levers. */
export function checkControls(controls: Controls, uses: string[], sceneName: string): string[] {
  const fail = (why: string): never => {
    throw new Error(`Scene "${sceneName}": ${why}`);
  };
  for (const [name, c] of Object.entries(controls)) {
    if (!['slider', 'choice', 'toggle', 'drag', 'pick'].includes(c?.kind)) fail(`control "${name}" is not a slider, choice, toggle, drag or pick.`);
    if (c.value === undefined || (isKeyframes(c) && !(c.value as unknown[]).length)) fail(`control "${name}" needs a value or keyframes.`);
    if (isKeyframes(c)) {
      const keys = c.value as Keyframes<unknown>;
      if (keys.some((k, i) => i > 0 && !(k[0] > keys[i - 1][0]))) fail(`keyframes of "${name}" must have increasing times.`);
    }
    if (c.kind === 'choice') {
      const values = isKeyframes(c) ? (c.value as Keyframes<string>).map(([, v]) => v) : [c.value as string];
      if (!values.every((v) => v in c.options)) fail(`"${name}" has a value that is not one of its options.`);
    }
    // a lever is exactly a control the simulation uses; everything else must be a lens
    if (uses.includes(name) && c.lens) fail(`"${name}" feeds the simulation, so it cannot be a lens.`);
    if (!uses.includes(name) && !c.lens) fail(`"${name}" is not used by the simulation, so it must be a lens.`);
  }
  for (const name of uses) if (!controls[name]) fail(`the simulation uses "${name}", which is not a control.`);
  return uses.slice();
}
