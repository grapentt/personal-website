import { asset } from '../app/site';

interface VideoProps {
  /** Path under public/ without extension; both .webm and .mp4 must exist. */
  src: string;
  alt: string;
  className?: string;
}

/** Looping, muted video used in place of GIFs. */
const Video = ({ src, alt, className }: VideoProps) => {
  const base = asset(src.replace(/\.(gif|mp4|webm)$/, ''));
  return (
    <video autoPlay loop muted playsInline className={className} aria-label={alt} preload="metadata">
      <source src={`${base}.webm`} type="video/webm" />
      <source src={`${base}.mp4`} type="video/mp4" />
    </video>
  );
};

export default Video;
