// Minimal 3-vector helpers on plain [x, y, z] arrays.

export type Vec3 = [number, number, number];

export const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];
export const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const length = (a: Vec3) => Math.hypot(a[0], a[1], a[2]);
export const normalize = (a: Vec3): Vec3 => scale(a, 1 / length(a));

/** Unit vector along axis k (0 = x, 1 = y, 2 = z), scaled by s. */
export const axisVector = (k: number, s = 1): Vec3 => [0, 1, 2].map((i) => (i === k ? s : 0)) as Vec3;

/** Rotate point p about the line through `origin` with unit direction `axis` (Rodrigues). */
export function rotateAbout(p: Vec3, origin: Vec3, axis: Vec3, angle: number): Vec3 {
  const v = sub(p, origin);
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const d = dot(axis, v);
  const k = cross(axis, v);
  return [0, 1, 2].map((i) => origin[i] + v[i] * c + k[i] * s + axis[i] * d * (1 - c)) as Vec3;
}
