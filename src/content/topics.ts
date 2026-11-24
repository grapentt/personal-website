/**
 * The map of what this blog is about. Entries with a `slug` link to an article;
 * the rest are planned. Keep the order: it is the order one would learn them in.
 */
export interface Topic {
  label: string;
  slug?: string;
}

export const topicGroups: { title: string; topics: Topic[] }[] = [
  {
    title: 'Foundations',
    topics: [
      { label: 'A glimpse into 4D: isoclinic rotations and quaternions', slug: 'quaternions-4d-rotations' },
      { label: 'The Hopf fibration: the 3-sphere as a circle of circles', slug: 'hopf-fibration' },
      { label: 'Linear algebra, seen geometrically' },
      { label: 'Multilinear algebra and tensors' },
      { label: 'Group theory and representations' },
      { label: 'Exterior algebra' },
      { label: 'Clifford and geometric algebra' },
    ],
  },
  {
    title: 'Differential geometry and topology',
    topics: [
      { label: 'The geometry of shape space: bundles, connections, curvature', slug: 'shape-space' },
      { label: 'The atoms of space: cell and handle decompositions' },
      { label: 'Topological manifolds' },
      { label: 'The metric tensor: Riemannian geometry' },
      { label: 'Lie groups and Lie algebras' },
      { label: 'Projective spaces, Lie groups and Grassmannians' },
      { label: 'Homology; cohomology and Poincaré duality' },
      { label: 'Differential forms and Hodge duality' },
      { label: 'Intersection forms of 4-manifolds' },
      { label: 'Characteristic classes' },
      { label: 'Morse theory and the h-cobordism theorem' },
      { label: 'Self-duality and Donaldson theory' },
      { label: 'Spin structures, spinors and the Dirac operator' },
      { label: 'Spin^c structures and Seiberg–Witten theory' },
    ],
  },
  {
    title: 'Mathematical physics',
    topics: [
      { label: 'Pseudo-Riemannian geometry and relativity' },
      { label: 'Gauge theory: Maxwell’s equations' },
      { label: 'Gauge theory: Yang–Mills and matter fields' },
      { label: 'The Standard Model' },
      { label: 'Topological quantum field theory' },
      { label: 'Twistor theory' },
      { label: 'Topological quantum computing' },
    ],
  },
  {
    title: 'Machine learning',
    topics: [
      { label: 'Mathematical foundations of machine learning' },
      { label: 'Generative models on manifolds' },
      { label: 'Topological data analysis' },
      { label: 'Geometric and topological deep learning' },
      { label: 'Embedding spaces and representation learning' },
      { label: 'Category theory: a unifying framework?' },
      { label: 'Geometric approaches to explainable AI' },
    ],
  },
];
