// src/components/dashboard/datosMeteorologicos/LoteCard.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudSun } from "@fortawesome/free-solid-svg-icons";
import "../../../css/LoteCard.scss"; // Asegúrate de que los estilos estén importados correctamente

const LoteCard = ({ lote, isExpanded, onToggle }) => {
  const handleToggle = () => {
    onToggle(lote.id);
  };

  return (
    <div
      className={`lote-card ${isExpanded ? "expanded" : ""}`}
      onClick={handleToggle}
    >
      <div className="icon-container">
        <FontAwesomeIcon icon={faCloudSun} className="lote-icon" />
      </div>
      <div className="content">
        <h3 className="lote-name">Lote: {lote.nombre}</h3>
        <p className="lote-id">ID: {lote.id}</p>
      </div>
      {isExpanded && (
        <div className="tasks-container">
          {/* Aquí se pueden agregar tareas o información adicional si es necesario */}
        </div>
      )}
    </div>
  );
};

export default LoteCard;
