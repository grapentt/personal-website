declare module '*.mdx' {
  import { ComponentType } from 'react';

  // Frontmatter metadata
  export const title: string;
  export const date: string;
  export const description: string;
  export const image: string;

  // The MDX content component
  const MDXComponent: ComponentType;
  export default MDXComponent;
}
