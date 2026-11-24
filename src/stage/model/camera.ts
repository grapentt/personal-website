// A simple perspective camera: rotate (yaw about y, then pitch about x),
// project with focal length `focal`, place at (cx, cy) with `scale` px per unit.

import type { Vec3 } from './vec3';

export interface CameraOptions {
  yaw?: number;
  pitch?: number;
  scale?: number;
  cx?: number;
  cy?: number;
  focal?: number;
  center?: Vec3;
}

export interface Projected {
  x: number;
  y: number;
  /** Depth: larger = farther from the viewer. */
  z: number;
  /** Perspective factor. */
  k: number;
}

export interface Camera extends Required<CameraOptions> {
  project(p: Vec3): Projected;
  /** A direction in view coordinates (z points away from the viewer). */
  rotate(v: Vec3): Vec3;
  /** Inverse of rotate: a view-space direction back to world space. */
  unrotate(v: Vec3): Vec3;
}

const DEFAULTS: Required<CameraOptions> = { yaw: 0.5, pitch: 0.28, scale: 160, cx: 800, cy: 520, focal: 10, center: [0, 0, 0] };

export function camera(options: CameraOptions = {}): Camera {
  const v = { ...DEFAULTS, ...options };
  const cy = Math.cos(v.yaw);
  const sy = Math.sin(v.yaw);
  const cp = Math.cos(v.pitch);
  const sp = Math.sin(v.pitch);

  const rotate = (p: Vec3): Vec3 => {
    const x = p[0] * cy + p[2] * sy;
    const z = -p[0] * sy + p[2] * cy;
    return [x, p[1] * cp - z * sp, p[1] * sp + z * cp];
  };
  const unrotate = (q: Vec3): Vec3 => {
    const y = q[1] * cp + q[2] * sp;
    const z = -q[1] * sp + q[2] * cp;
    return [q[0] * cy - z * sy, y, q[0] * sy + z * cy];
  };

  return {
    ...v,
    rotate,
    unrotate,
    project(p: Vec3): Projected {
      const [x, y2, z2] = rotate([p[0] - v.center[0], p[1] - v.center[1], p[2] - v.center[2]]);
      const k = v.focal / (v.focal + z2);
      // View coordinates (x, y, z) are a rotation of the world, with z pointing away from the viewer.
      // For the picture not to be a mirror image, (screen right, screen up, towards the viewer) must be
      // right-handed too: so screen right is −x. (The thesis engine drew +x, which mirrored every 3D scene.)
      return { x: v.cx - x * v.scale * k, y: v.cy - y2 * v.scale * k, z: z2, k };
    },
  };
}
