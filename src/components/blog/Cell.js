import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import './cell.css';

const Cell = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => setIsExpanded(!isExpanded);
  const Content = data.content;
  return (
    <div className="cell-container">
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
        
        {!isExpanded && 
        <div className="descriptionContainer"> 
          <div className="description">{data.desc} </div>
        </div> }
        
        {/* Expanded content */}
        {isExpanded && (
          <div className="content">
            <Content />
          </div>
        )}
      </article>
    </div>
  );
};

Cell.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string,
    image: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired, // Short description
    content: PropTypes.string.isRequired, // Full article content (LaTeX)
  }).isRequired,
};

export default Cell;
