import React from 'react';

const Thesis = () => (
  <div className="thesis-container">
    <h1>My Thesis</h1>
    <embed 
      src={`${process.env.PUBLIC_URL}/thesis.pdf`} 
      width="100%" 
      height="1000px" 
      type="application/pdf" 
    />
  </div>
);

export default Thesis;
