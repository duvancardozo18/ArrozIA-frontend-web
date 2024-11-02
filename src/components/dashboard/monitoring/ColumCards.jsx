// src/components/dashboard/monitoring/ColumCards.jsx
import React from "react";
import CropCard from "./CropCard";

const ColumCards = ({ crops, selectedCrop, onSelectCrop }) => {
  return (
    <div className="crops-column">
      <h2>Cultivos</h2>
      {crops.map((crop) => (
        <CropCard
          key={crop.id}
          crop={crop}
          isExpanded={selectedCrop && selectedCrop.id === crop.id}
          onToggle={() => onSelectCrop(crop)}
        />
      ))}
    </div>
  );
};

export default ColumCards;
