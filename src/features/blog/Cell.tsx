import React, { useState, useRef } from 'react';
import dayjs from 'dayjs';
import './cell.css';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BackToTopButton, VideoPlayer } from '@/shared/components';

export interface CellData {
  title: string;
  link?: string;
  image: string;
  date: string;
  desc: string;
  content: React.FC;
}

interface CellProps {
  data: CellData;
}

const Cell: React.FC<CellProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => setIsExpanded(!isExpanded);
  const Content = data.content;

  return (
    <>
    <div ref={containerRef} className="cell-container">
      <article
        className={`mini-post ${isExpanded ? 'expanded' : ''}`}
        role="button"
        tabIndex={0}
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
          <span className="toggle-arrow">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </span>
        </header>

        {/* Description (hidden when expanded) */}
        {!isExpanded && (
          <div className="descriptionContainer">
            {data.desc}
          </div>
        )}

        {/* Display image or video (hidden when expanded) */}
        {!isExpanded && data.image && (
          <div className="image-container">
            {data.image.endsWith('.gif') ? (
              <VideoPlayer
                src={data.image.replace(/\.gif$/, '')}
                alt={data.title}
                className="gif"
              />
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

export default Cell;