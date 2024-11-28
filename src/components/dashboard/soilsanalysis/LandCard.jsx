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
    </div>
  );
};

export default LandCard;
