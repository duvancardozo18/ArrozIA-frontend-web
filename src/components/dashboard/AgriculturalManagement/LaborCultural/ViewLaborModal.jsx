import React from "react";
import ReactDOM from "react-dom";
import "../../../../css/ViewModal.scss";

const ViewLaborModal = ({ show, closeModal, labor }) => {
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
          <p>
            <strong>Precio por Hora:</strong> {labor.precio_hora_real ? `$${labor.precio_hora_real.toFixed(2)}` : "N/A"}
          </p>
          <p>
            <strong>Etapa Fenológica:</strong> {labor.etapa_fenologica?.nombre || "N/A"}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ViewLaborModal;
