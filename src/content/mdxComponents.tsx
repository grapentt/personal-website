import type { MDXComponents } from 'mdx/types';
import Figure from '../components/Figure';
import Video from '../components/Video';
import Callout from '../components/Callout';
import Film from '../stage/react/Film';
import Explorable from '../stage/react/Explorable';

/** Components every article can use without importing them. */
export const mdxComponents: MDXComponents = {
  Figure,
  Video,
  Callout,
  Film,
  Explorable,
};
