import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWheatAwn } from "@fortawesome/free-solid-svg-icons"; 
import "../../../css/CropCard.css"; 

const CropCard = ({ crop, isExpanded, onToggle }) => {
  const handleToggle = () => {
    onToggle(crop.id);
  };

  return (
    <div
      className={`crop-card ${isExpanded ? "expanded" : ""}`}
      onClick={handleToggle}
    >
      <div className="icon-container">
        <FontAwesomeIcon icon={faWheatAwn} className="crop-icon" />
      </div>
      <div className="content">
        <h3 className="crop-name">{crop.cropName}</h3>
      </div>
      {isExpanded && Array.isArray(crop.tasks) && (
        <div className="tasks-container">
          {crop.tasks.map((task, index) => (
            <div key={index} className="task-item">
              <p>{task.name}</p>
              <p>{task.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropCard;
