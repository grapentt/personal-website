// The quaternion film: the ordered list of scenes.
import type { Film } from '@/stage/engine/timeline';
import title from './scenes/00-title';
import dimension from './scenes/01-dimension';
import symmetry from './scenes/02-symmetry';
import planeSymmetries from './scenes/03-plane-symmetries';
import quarterTurn from './scenes/04-quarter-turn';
import complexNumbers from './scenes/05-complex-numbers';
import threeDimensions from './scenes/06-three-dimensions';
import twoPlanes from './scenes/07-two-planes';
import sameAngle from './scenes/08-same-angle';
import pointsOfS3 from './scenes/09-points-of-s3';
import quaternions from './scenes/10-quaternions';
import backTo3d from './scenes/11-back-to-3d';
import next from './scenes/12-next';

const film: Film = {
  id: 'quaternions-4d-rotations',
  title: 'A geometric introduction to quaternions',
  heading: ['A geometric introduction to', 'quaternions'],
  label: 'Interactive film',
  scenes: [title, dimension, symmetry, planeSymmetries, quarterTurn, complexNumbers, threeDimensions, twoPlanes, sameAngle, pointsOfS3, quaternions, backTo3d, next],
  posterTime: 3,
};

export default film;
