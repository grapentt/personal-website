// Shape changes with zero angular momentum.
//
// A body of point masses changes its shape along q(τ) (positions in the body frame,
// centred at the centre of mass). In space it sits at r_i = R(τ) q_i(τ). Requiring
// zero total angular momentum,
//     L = R ( I(q) ω + Σ m_i q_i × q̇_i ) = 0,
// gives the body angular velocity ω = −I(q)⁻¹ Σ m_i q_i × q̇_i and Ṙ = R [ω]×.
// The rotation accumulated over a closed loop of shapes is the holonomy of the
// mechanical connection.

import { cross, dot, sub, scale, add, Vec3 } from './vec3';
import { expRotation, multiply, IDENTITY, copy, Mat3 } from './rotation';

/** Positions relative to the mass-weighted centre. */
export function centred(points: Vec3[], masses: number[]): Vec3[] {
  const total = masses.reduce((a, b) => a + b, 0);
  const c = points.reduce((acc, p, i) => add(acc, scale(p, masses[i] / total)), [0, 0, 0] as Vec3);
  return points.map((p) => sub(p, c));
}

function inertia(points: Vec3[], masses: number[]): Mat3 {
  const I: Mat3 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  points.forEach((q, n) => {
    const m = masses[n];
    const r2 = dot(q, q);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) I[i][j] += m * ((i === j ? r2 : 0) - q[i] * q[j]);
  });
  return I;
}

function solve3(A: Mat3, b: Vec3): Vec3 {
  const det = (M: Mat3) =>
    M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
  const D = det(A);
  return [0, 1, 2].map((k) => det(A.map((row, i) => row.map((v, j) => (j === k ? b[i] : v))) as Mat3) / D) as Vec3;
}

/**
 * Integrate the rotation along a path of shapes.
 * @param shapeAt  body-frame positions at τ ∈ [0, 1]
 * @returns rotations R(τ_k) for k = 0 … steps
 */
export function zeroMomentumRotations(shapeAt: (tau: number) => Vec3[], masses: number[], steps = 600): Mat3[] {
  const rotations: Mat3[] = [copy(IDENTITY)];
  let R = rotations[0];
  let previous = centred(shapeAt(0), masses);
  for (let k = 1; k <= steps; k++) {
    const current = centred(shapeAt(k / steps), masses);
    const mid = current.map((q, i) => scale(add(q, previous[i]), 0.5));
    const spin = mid.reduce((acc, q, i) => add(acc, scale(cross(q, sub(current[i], previous[i])), masses[i])), [0, 0, 0] as Vec3);
    const omegaDt = scale(solve3(inertia(mid, masses), spin), -1);
    R = multiply(R, expRotation(omegaDt));
    rotations.push(R);
    previous = current;
  }
  return rotations;
}

/** Sample a list of rotations at τ ∈ [0, 1] (nearest step). */
export const rotationAt = (rotations: Mat3[], tau: number) => rotations[Math.round(Math.max(0, Math.min(1, tau)) * (rotations.length - 1))];
