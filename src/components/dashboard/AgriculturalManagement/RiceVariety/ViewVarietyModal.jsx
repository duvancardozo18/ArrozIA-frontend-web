import React from "react";
import ReactDOM from "react-dom";
import "../../../../css/ViewModal.scss"; // Asegúrate de que este archivo existe y está correctamente configurado

const ViewVarietyModal = ({ show, closeModal, variety }) => {
  if (!show || !variety) return null;

  // Extrae los valores de la variedad que se mostrarán en el modal
  const { nombre, numero_registro_productor_ica, caracteristicas_variedad } = variety;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>×</button>
        <h2 className="title">Detalles de la Variedad de Arroz</h2>
        <div className="details">
          <p>
            <strong>Nombre:</strong> {nombre}
          </p>
          <p>
            <strong>Registro ICA:</strong> {numero_registro_productor_ica}
          </p>
          <p>
            <strong>Características:</strong> {caracteristicas_variedad || "Sin características"}
          </p>
        </div>
      </div>
    </div>,
    document.body // Renderiza el modal directamente en el body
  );
};

export default ViewVarietyModal;
