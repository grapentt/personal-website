const Thesis = () => (
  <div className="thesis-container">
    <h1>My Thesis</h1>
    <embed 
      src={`${import.meta.env.BASE_URL}thesis.pdf`} 
      width="100%" 
      height="1000px" 
      type="application/pdf" 
    />
  </div>
);

export default Thesis;
