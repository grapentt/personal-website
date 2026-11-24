// 3 × 3 rotation matrices as arrays of rows.

import { normalize, cross, Vec3 } from './vec3';

export type Mat3 = [Vec3, Vec3, Vec3];

export const IDENTITY: Mat3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

export const copy = (M: Mat3): Mat3 => M.map((r) => [...r]) as Mat3;

/** Rotation by `angle` (rad) about `axis` (Rodrigues). */
export function axisAngle(axis: Vec3, angle: number): Mat3 {
  const [x, y, z] = normalize(axis);
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const t = 1 - c;
  return [
    [c + x * x * t, x * y * t - z * s, x * z * t + y * s],
    [y * x * t + z * s, c + y * y * t, y * z * t - x * s],
    [z * x * t - y * s, z * y * t + x * s, c + z * z * t],
  ];
}

/** exp of the skew matrix of w: rotation by |w| about w. */
export function expRotation(w: Vec3): Mat3 {
  const angle = Math.hypot(w[0], w[1], w[2]);
  return angle < 1e-12 ? copy(IDENTITY) : axisAngle(w, angle);
}

export const apply = (R: Mat3, p: Vec3): Vec3 => [0, 1, 2].map((i) => R[i][0] * p[0] + R[i][1] * p[1] + R[i][2] * p[2]) as Vec3;

export const multiply = (A: Mat3, B: Mat3): Mat3 =>
  [0, 1, 2].map((i) => [0, 1, 2].map((j) => A[i][0] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j]) as Vec3) as Mat3;

export const transpose = (A: Mat3): Mat3 => [0, 1, 2].map((i) => [0, 1, 2].map((j) => A[j][i]) as Vec3) as Mat3;

/** Rotation angle of R in radians, 0 … π. */
export const rotationAngle = (R: Mat3) => Math.acos(Math.max(-1, Math.min(1, (R[0][0] + R[1][1] + R[2][2] - 1) / 2)));

/** Interpolate from the identity to R (same axis, fraction u of the angle). */
export function partialRotation(R: Mat3, u: number): Mat3 {
  const angle = rotationAngle(R);
  if (angle < 1e-9) return copy(IDENTITY);
  const axis: Vec3 = [R[2][1] - R[1][2], R[0][2] - R[2][0], R[1][0] - R[0][1]];
  return axisAngle(axis, angle * u);
}

/** A unit vector perpendicular to v. */
export function perpendicular(v: Vec3): Vec3 {
  const helper: Vec3 = Math.abs(v[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
  return normalize(cross(v, helper));
}
