/** Site-wide facts in one place. */
export const site = {
  name: 'Thomas Grapentin',
  url: 'https://grapentt.github.io/personal-website',
  description:
    'Thomas Grapentin: mathematician and AI scientist in Berlin. Research on geometry-aware machine learning, foundation models at SAP, and a blog on mathematics, physics and machine learning with interactive visualisations.',
  email: 'grapentthomas@gmail.com',
  github: 'https://github.com/grapentt',
  linkedin: 'https://www.linkedin.com/in/thomas-grapentin-a22024210',
  repository: 'https://github.com/grapentt/personal-website',
};

export const BASE = import.meta.env.BASE_URL; // '/personal-website/'

/** Path of a file in public/, with the deployment base. */
export const asset = (path: string) => `${BASE}${path.replace(/^\//, '')}`;

/** Primary navigation. Entries with `section` are anchors on the home page (hidden on small screens). */
export const navigation: { label: string; to: string; section?: boolean }[] = [
  { label: 'Research', to: '/#research', section: true },
  { label: 'Projects', to: '/#projects', section: true },
  { label: 'Writing', to: '/blog' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];
