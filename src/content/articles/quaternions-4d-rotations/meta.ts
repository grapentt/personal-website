import type { ArticleMeta } from '../types';

const meta: ArticleMeta = {
  slug: 'quaternions-4d-rotations',
  title: 'A geometric introduction to quaternions',
  subtitle: 'A first glimpse into the fourth dimension',
  date: '2025-02-13',
  description:
    'An interactive film about four-dimensional space, seen through its rotations. Rotations of the plane are a quarter turn, exponentiated; in 3D every rotation fixes an axis, which is why there are no 3D numbers; in 4D two planes can turn at once, and when they turn by the same angle we find the quaternions.',
  kind: 'film',
  poster: { video: 'visuals/isoclinicTesseract', alt: 'A tesseract under an isoclinic double rotation' },
  readingMinutes: 25,
  filmMinutes: 8,
  topics: ['Rotations', 'Lie groups', 'Quaternions', 'Four dimensions'],
  series: { name: 'A glimpse into four dimensions', part: 1 },
};

export default meta;
