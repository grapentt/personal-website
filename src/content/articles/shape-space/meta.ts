import type { ArticleMeta } from '../types';

const meta: ArticleMeta = {
  slug: 'shape-space',
  title: 'The geometry of shape space',
  subtitle: 'Why a molecule lives on a quotient, and how a falling cat lands on its feet',
  date: '2026-11-05',
  description:
    'An interactive film about the space of shapes. A molecule’s energy does not care where it is or how it is turned, so it really lives on a quotient: shape space. That quotient is the base of a bundle, and the bundle is curved: a loop of shapes with zero angular momentum turns the molecule, and a falling cat lands on its feet.',
  kind: 'film',
  poster: { alt: 'A torus as a circle of circles, coloured by energy' },
  readingMinutes: 25,
  filmMinutes: 8,
  topics: ['Fibre bundles', 'Connections', 'Curvature', 'Holonomy', 'Geometric mechanics', 'Molecules'],
};

export default meta;
