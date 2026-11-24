// The Hopf fibration film: the ordered list of scenes.
import type { Film } from '@/stage/engine/timeline';
import title from './scenes/00-title';
import twoDials from './scenes/01-two-dials';
import oneDimensionDown from './scenes/02-one-dimension-down';
import keyhole from './scenes/03-keyhole';
import oneFibre from './scenes/04-one-fibre';
import linked from './scenes/05-linked';
import tori from './scenes/06-tori';
import theMap from './scenes/07-the-map';
import explore from './scenes/08-explore';
import connection from './scenes/09-connection';
import liftALoop from './scenes/10-lift-a-loop';
import halfTheSolidAngle from './scenes/11-half-the-solid-angle';
import bridges from './scenes/12-bridges';

const film: Film = {
  id: 'hopf-fibration',
  title: 'The Hopf fibration',
  heading: ['The Hopf', 'fibration'],
  label: 'Interactive film',
  scenes: [title, twoDials, oneDimensionDown, keyhole, oneFibre, linked, tori, theMap, explore, connection, liftALoop, halfTheSolidAngle, bridges],
  posterTime: 3,
};

export default film;
