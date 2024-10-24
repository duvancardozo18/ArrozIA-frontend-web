import React from 'react';
import '../../../css/LoanMessage.scss'; // Assuming the CSS is in this file

const LoanMessage = () => {
  return (
    <div className="loan-container">
      <div className="loan-icon">
        <i className="fa fa-exclamation-circle"></i> {/* Font Awesome icon */}
      </div>
      <div className="loan-text">
        <p>No hay Cultivos Disponibles.</p>
        <p>¡Crea uno nuevo!</p>
      </div>
    </div>
  );
};

export default LoanMessage;
