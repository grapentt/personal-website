import type { Film } from '../stage/engine/timeline';

/** Films by article slug, loaded on demand (for poster frames on cards). */
export const films: Record<string, () => Promise<{ default: Film }>> = {
  'quaternions-4d-rotations': () => import('./articles/quaternions-4d-rotations/film'),
  'hopf-fibration': () => import('./articles/hopf-fibration/film'),
  'shape-space': () => import('./articles/shape-space/film'),
};
