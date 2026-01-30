import React, { useState, useEffect, useRef } from 'react';
import './BackToTopButton.css';

const BackToTopButton = ({ containerRef }) => {
  const [isVisible, setIsVisible] = useState(false);
  const throttleTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const refTop = containerRef.current.getBoundingClientRect().top;
        setIsVisible(refTop < 0);
      }
    };

    // Throttled scroll handler - limits execution to once every 100ms
    const throttledHandleScroll = () => {
      if (throttleTimeout.current === null) {
        handleScroll();
        throttleTimeout.current = setTimeout(() => {
          throttleTimeout.current = null;
        }, 100); // 100ms throttle
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }
    };
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
