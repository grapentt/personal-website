import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import './cell.css';
import BackToTopButton from '../Template/BackToTopButton';

const Cell = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef(null);

  const handleClick = () => setIsExpanded(!isExpanded);
  const Content = data.content;

  return (
    <>
    <div ref={containerRef} className="cell-container">
      <article
        className={`mini-post ${isExpanded ? 'expanded' : ''}`}
        role="button"
        tabIndex="0"
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleClick();
        }}
      >
        <header>
          <h3>
            <a href={data.link}>{data.title}</a>
          </h3>
          <time className="published">
            {dayjs(data.date).format('MMMM, YYYY')}
          </time>
        </header>

        {/* Description (hidden when expanded) */}
        {!isExpanded && (
          <div className="descriptionContainer">
            {data.desc}
          </div>
        )}

        {/* Display image or GIF (hidden when expanded) */}
        {!isExpanded && data.image && (
          <div className="image-container">
            {data.image.endsWith('.gif') ? (
              <img src={data.image} alt={data.title} className="gif" />
            ) : (
              <img src={data.image} alt={data.title} className="image" />
            )}
          </div>
        )}

        {/* Expanded content */}
        {isExpanded && (
          <div className="content" onClick={(e) => e.stopPropagation()}>
            <Content />
          </div>
        )}
      </article>
    </div>
    <BackToTopButton containerRef={containerRef} />
    </>
  );
};

Cell.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string,
    image: PropTypes.string.isRequired, // Path to the image or GIF
    date: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired, // Short description
    content: PropTypes.func.isRequired, // Full article content (LaTeX)
  }).isRequired,
};

export default Cell;