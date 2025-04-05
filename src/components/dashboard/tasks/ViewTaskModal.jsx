import React from "react";
import ReactDOM from "react-dom";
import "../../../css/ViewModal.css"; // Asegúrate de tener un archivo CSS o css para estilos específicos del modal.

const ViewTaskModal = ({ show, closeModal, task }) => {
  if (!show || !task) return null;

  const {
    descripcion,
    estado,
    fecha_estimada,
    fecha_realizacion,
    es_mecanizable,
    labor_cultural,
    usuario,
    cantidad_insumo,
    maquinaria,
    precio_labor,
  } = task;

  // Renderiza el modal en el body utilizando ReactDOM.createPortal
  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>
          ×
        </button>
        <h2 className="title">Detalles de la Tarea</h2>
        <div className="details">
          <p><strong>Descripción:</strong> {descripcion || "Sin descripción"}</p>
          <p><strong>Estado:</strong> {estado || "Sin estado"}</p>
          <p><strong>Fecha Estimada:</strong> {fecha_estimada || "Sin fecha estimada"}</p>
          <p><strong>Fecha de Realización:</strong> {fecha_realizacion || "No realizada"}</p>
          <p><strong>¿Es Mecanizable?:</strong> {es_mecanizable ? "Sí" : "No"}</p>
          <p><strong>Labor Cultural:</strong> {labor_cultural || "Sin información"}</p>
          <p><strong>Usuario Responsable:</strong> {usuario || "Sin responsable"}</p>
          <p><strong>Cantidad de Insumo:</strong> {cantidad_insumo || "N/A"}</p>
          <p><strong>Maquinaria:</strong> {maquinaria || "Sin maquinaria"}</p>
          <p>
            <strong>Precio de la Labor:</strong>{" "}
            {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
            }).format(precio_labor || 0)}
          </p>
        </div>
      </div>
    </div>,
    document.body // Renderiza el modal directamente en el body
  );
};

export default ViewTaskModal;
