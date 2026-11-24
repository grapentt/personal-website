import type { ArticleMeta } from '../types';

const meta: ArticleMeta = {
  slug: 'hopf-fibration',
  title: 'The Hopf fibration',
  subtitle: 'The 3-sphere as a circle of circles',
  date: '2026-11-05',
  description:
    'An interactive film about the most beautiful map in geometry: the 3-sphere of unit quaternions, projected into the space we can see, falls apart into circles, every two of them linked, filling nested tori. Where the circles come from, why they link, and how walking around the ordinary sphere lifts to a rotation along them.',
  kind: 'film',
  poster: { alt: 'Hopf fibres: linked circles filling a torus' },
  readingMinutes: 25,
  filmMinutes: 8,
  topics: ['Hopf fibration', 'Fibre bundles', 'Quaternions', 'Connections', 'Berry phase'],
  series: { name: 'A glimpse into four dimensions', part: 2 },
};

export default meta;
