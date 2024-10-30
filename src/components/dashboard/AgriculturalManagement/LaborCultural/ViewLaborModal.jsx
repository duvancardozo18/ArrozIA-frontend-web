import React from "react";
import ReactDOM from "react-dom";
import "../../../../css/ViewModal.scss"; // Asegúrate de que el archivo CSS está correctamente configurado

const ViewLaborModal = ({ show, closeModal, labor }) => {
  // Verificamos que show sea true y labor tenga datos
  if (!show || !labor) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>×</button>
        <h2 className="title">Detalles de la Labor Cultural</h2>
        <div className="details">
          <p>
            <strong>Nombre:</strong> {labor.nombre}
          </p>
          <p>
            <strong>Descripción:</strong> {labor.descripcion}
          </p>
        </div>
      </div>
    </div>,
    document.body // Renderiza el modal en el body para evitar conflictos de estilo
  );
};

export default ViewLaborModal;
