// The shape-space film: the ordered list of scenes. Reorder, drop or add scenes here.
import type { Film } from '@/stage/engine/timeline';
import title from './scenes/00-title';
import roadmap from './scenes/01-roadmap';
import configuration from './scenes/02-configuration';
import potentialEnergy from './scenes/03-potential-energy';
import symmetry from './scenes/04-symmetry';
import tangentSplit from './scenes/05-tangent-split';
import torusBundle from './scenes/06-torus-bundle';
import torusTangent from './scenes/07-torus-tangent';
import connection from './scenes/08-connection';
import metricConnection from './scenes/09-metric-connection';
import integrable from './scenes/10-integrable';
import holonomy from './scenes/11-holonomy';
import curvature from './scenes/12-curvature';
import shapeBundle from './scenes/13-shape-bundle';
import moleculeHolonomy from './scenes/14-molecule-holonomy';
import catExplained from './scenes/15-falling-cat-explained';
import fallingCat from './scenes/16-falling-cat';
import whereThisLeads from './scenes/17-where-this-leads';

const film: Film = {
  id: 'shape-space',
  title: 'The geometry of shape space',
  heading: ['The geometry of', 'shape space'],
  label: 'Interactive film',
  scenes: [
    title,
    roadmap,
    configuration,
    potentialEnergy,
    symmetry,
    tangentSplit,
    torusBundle,
    torusTangent,
    connection,
    metricConnection,
    integrable,
    holonomy,
    curvature,
    shapeBundle,
    moleculeHolonomy,
    catExplained,
    fallingCat,
    whereThisLeads,
  ],
  /** Frame shown before the viewer presses play (the title card, fully drawn). */
  posterTime: 3,
};

export default film;
