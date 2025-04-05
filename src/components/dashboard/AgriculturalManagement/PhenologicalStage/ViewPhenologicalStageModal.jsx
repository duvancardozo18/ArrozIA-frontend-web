import React from "react";
import ReactDOM from "react-dom";
import "../../../../css/ViewModal.css"; // Asegúrate de importar tu css

const ViewPhenologicalStageModal = ({ show, closeModal, stage }) => {
  if (!show) return null;

  const { variety, phenological_stage, dias_duracion } = stage || {};

  console.log("Datos de la etapa recibidos en el modal:", stage); // Verifica los datos en el modal

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>×</button>
        <h2 className="title">Detalles de la Etapa Fenológica</h2>
        <div className="details">
          <p><strong>Variedad de Arroz:</strong> {variety?.nombre || 'N/A'}</p>
          <p><strong>Etapa Fenológica:</strong> {phenological_stage?.nombre || 'N/A'}</p>
          <p><strong>Días de Duración:</strong> {dias_duracion || 'N/A'}</p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ViewPhenologicalStageModal;
