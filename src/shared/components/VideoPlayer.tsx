import { FC } from 'react';

interface VideoPlayerProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * VideoPlayer component for displaying optimized video content
 * Replaces large GIF files with efficient MP4/WebM videos
 */
const VideoPlayer: FC<VideoPlayerProps> = ({ src, alt, className = 'video' }) => {
  // Remove .gif extension if present
  const basePath = src.replace(/\.gif$/, '');

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className={className}
      aria-label={alt}
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <source src={`${basePath}.webm`} type="video/webm" />
      <source src={`${basePath}.mp4`} type="video/mp4" />
      <p>
        Your browser does not support the video tag.
        <a href={`${basePath}.mp4`}>Download the video</a>
      </p>
    </video>
  );
};

export default VideoPlayer;
