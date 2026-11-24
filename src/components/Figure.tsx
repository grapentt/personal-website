import { ReactNode } from 'react';
import Video from './Video';

interface FigureProps {
  /** Video path under public/ (without extension) — or pass children instead. */
  video?: string;
  alt?: string;
  caption?: ReactNode;
  narrow?: boolean;
  children?: ReactNode;
}

const Figure = ({ video, alt = '', caption, narrow = false, children }: FigureProps) => (
  <figure className={`figure${narrow ? ' figure--narrow' : ''}`}>
    {video ? <Video src={video} alt={alt} /> : children}
    {caption && <figcaption>{caption}</figcaption>}
  </figure>
);

export default Figure;
