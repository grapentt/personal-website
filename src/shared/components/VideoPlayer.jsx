import React from 'react';
import PropTypes from 'prop-types';

/**
 * VideoPlayer component for displaying optimized video content
 * Replaces large GIF files with efficient MP4/WebM videos
 *
 * @param {string} src - Base path to video (without extension)
 * @param {string} alt - Alt text for accessibility
 * @param {string} className - Optional CSS class
 */
const VideoPlayer = ({ src, alt, className }) => {
  // Remove .gif extension if present
  const basePath = src.replace(/\.gif$/, '');

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className={className || 'video'}
      aria-label={alt}
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <source src={`${basePath}.webm`} type="video/webm" />
      <source src={`${basePath}.mp4`} type="video/mp4" />
      <p>
        Your browser does not support the video tag.
        {/* Fallback text */}
        <a href={`${basePath}.mp4`}>Download the video</a>
      </p>
    </video>
  );
};

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};

VideoPlayer.defaultProps = {
  className: 'video',
};

export default VideoPlayer;
