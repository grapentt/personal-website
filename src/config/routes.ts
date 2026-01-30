export interface Route {
  index?: boolean;
  label: string;
  path: string;
}

const routes: Route[] = [
  {
    index: true,
    label: 'Thomas Grapentin',
    path: '/',
  },
  {
    label: 'About',
    path: '/about',
  },
  {
    label: 'Resume',
    path: '/resume',
  },
  {
    label: 'Blog',
    path: '/blog',
  },
  {
    label: 'Contact',
    path: '/contact',
  },
];

export default routes;
