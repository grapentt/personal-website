import { FC } from 'react';

interface VideoPlayerProps {
  src: string;
  alt: string;
  className?: string;
}

declare const VideoPlayer: FC<VideoPlayerProps>;
export default VideoPlayer;
