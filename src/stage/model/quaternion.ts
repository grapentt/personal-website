// Quaternions q = w + x i + y j + z k as [w, x, y, z], following the quaternion
// article: (e1, e2, e3, e4) = (1, i, j, k). Left multiplication by a unit
// quaternion is a left-isoclinic rotation of R^4, right multiplication a
// right-isoclinic one.

import type { Vec3 } from './vec3';

export type Quat = [number, number, number, number];

export const ONE: Quat = [1, 0, 0, 0];
export const I: Quat = [0, 1, 0, 0];
export const J: Quat = [0, 0, 1, 0];
export const K: Quat = [0, 0, 0, 1];

export const multiply = (a: Quat, b: Quat): Quat => [
  a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3],
  a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
  a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1],
  a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0],
];

export const conjugate = (q: Quat): Quat => [q[0], -q[1], -q[2], -q[3]];
export const norm = (q: Quat) => Math.hypot(q[0], q[1], q[2], q[3]);
export const normalize = (q: Quat): Quat => {
  const n = norm(q);
  return [q[0] / n, q[1] / n, q[2] / n, q[3] / n];
};
export const dot4 = (a: Quat, b: Quat) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
export const scale4 = (q: Quat, s: number): Quat => [q[0] * s, q[1] * s, q[2] * s, q[3] * s];
export const add4 = (a: Quat, b: Quat): Quat => [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]];

/** The unit quaternion cos(θ/2) + sin(θ/2) n for the rotation by θ about the unit axis n. */
export const fromAxisAngle = (axis: Vec3, angle: number): Quat => {
  const s = Math.sin(angle / 2);
  return [Math.cos(angle / 2), axis[0] * s, axis[1] * s, axis[2] * s];
};

/** exp of a pure quaternion v = x i + y j + z k: cos|v| + sin|v| v/|v|. */
export const exp = (v: Vec3): Quat => {
  const a = Math.hypot(v[0], v[1], v[2]);
  if (a < 1e-12) return ONE;
  const s = Math.sin(a) / a;
  return [Math.cos(a), v[0] * s, v[1] * s, v[2] * s];
};

/** Rotate the vector v by the unit quaternion q: q v q̄. */
export function rotate(q: Quat, v: Vec3): Vec3 {
  const r = multiply(multiply(q, [0, v[0], v[1], v[2]]), conjugate(q));
  return [r[1], r[2], r[3]];
}

/** Spherical linear interpolation between unit quaternions. */
export function slerp(a: Quat, b: Quat, u: number): Quat {
  let d = dot4(a, b);
  let bb = b;
  if (d < 0) {
    d = -d;
    bb = scale4(b, -1);
  }
  if (d > 0.9995) return normalize(add4(scale4(a, 1 - u), scale4(bb, u)));
  const omega = Math.acos(d);
  const so = Math.sin(omega);
  return add4(scale4(a, Math.sin((1 - u) * omega) / so), scale4(bb, Math.sin(u * omega) / so));
}
