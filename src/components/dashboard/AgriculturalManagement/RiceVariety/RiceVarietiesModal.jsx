import React from "react";
import ReactDOM from "react-dom";
import RiceVarietiesTable from "./RiceVarietiesTable"; // Importa la tabla de variedades
import "../../../../css/ViewModal.scss"; // Asegúrate de tener estilos para el modal

const RiceVarietiesModal = ({ show, closeModal, refresh }) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>×</button>
        <h2 className="title">Variedades de Arroz</h2>
        <RiceVarietiesTable refresh={refresh} /> {/* Muestra la tabla de variedades dentro del modal */}
      </div>
    </div>,
    document.body
  );
};

export default RiceVarietiesModal;
