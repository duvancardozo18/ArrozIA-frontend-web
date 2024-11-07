import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons"; 
import "../../../css/LandCard.scss"; 

const LandCard = ({ land, isExpanded, onToggle }) => {
  const handleToggle = () => {
    onToggle(land.id);
  };

  return (
    <div
      className={`land-card ${isExpanded ? "expanded" : ""}`}
      onClick={handleToggle}
    >
      <div className="icon-container">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="land-icon" />
      </div>
      <div className="content">
        <h3 className="land-name">{land.nombre}</h3>
      </div>
      {isExpanded && (
        <div className="land-details">
          {/* Aquí puedes agregar más detalles si se necesitan al expandir */}
          <p>Área: {land.area} ha</p>
        </div>
      )}
    </div>
  );
};

export default LandCard;
