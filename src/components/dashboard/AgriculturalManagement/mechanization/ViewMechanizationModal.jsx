import React from "react";
import ReactDOM from "react-dom";
import "../../../../css/ViewModal.scss"; // Ensure this file exists and is properly configured

const ViewMechanizationModal = ({ show, closeModal, operation }) => {
  if (!show || !operation) return null;

  // Extract the values from the operation that will be displayed in the modal
  const { task, mechanizationName, machinery, hoursUsed } = operation; // Cambia tarea_labor_id y maquinaria_id

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>×</button>
        <h2 className="title">Detalles de la Operación de Mecanización</h2>
        <div className="details">
          <p>
            <strong>Labor de la Tarea:</strong> {task?.descripcion || "Tarea Labor Desconocida"}
          </p>
          <p>
            <strong>Nombre de Mecanización:</strong> {mechanizationName}
          </p>
          <p>
            <strong>Maquinaria:</strong> {machinery?.nombre || "Maquinaria Desconocida"}
          </p>
          <p>
            <strong>Horas de Uso:</strong> {hoursUsed}
          </p>
        </div>
      </div>
    </div>,
    document.body // Render the modal directly in the body
  );
};

export default ViewMechanizationModal;
