import React from "react";
import ReactDOM from "react-dom";
import "../../../../css/ViewModal.scss"; // Make sure this file exists and is correctly set up

const ViewCulturalWorkModal = ({ show, closeModal, work }) => {
  if (!show || !work) return null;

  // Extract the name and description from the cultural work to display in the modal
  const { name, description } = work;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>×</button>
        <h2 className="title">Detalles de las labores culturales</h2>
        <div className="details">
          <p>
            <strong>Nombre:</strong> {name}
          </p>
          <p>
            <strong>Descripción:</strong> {description || "Descripción no disponible"}
          </p>
        </div>
      </div>
    </div>,
    document.body // Renders the modal directly in the body
  );
};

export default ViewCulturalWorkModal;
