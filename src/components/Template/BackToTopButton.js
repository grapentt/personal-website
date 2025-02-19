import React, { useState, useEffect } from 'react';
import './BackToTopButton.css';

const BackToTopButton = ({ containerRef }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const refTop = containerRef.current.getBoundingClientRect().top;
        setIsVisible(refTop < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button 
      className="back-to-top" 
      onClick={scrollToTop} 
      style={{ display: isVisible ? 'block' : 'none' }}
    >
      ↑ Back to Top
    </button>
  );
};

export default BackToTopButton;
