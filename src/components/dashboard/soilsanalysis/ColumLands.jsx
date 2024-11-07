import React from "react";
import LandCard from "./LandCard";

const ColumLands = ({ lands, selectedLand, onSelectLand }) => {
  return (
    <div className="lands-column">
      <h2>Lotes</h2>
      {lands.map((land) => (
        <LandCard
          key={land.id}
          land={land}
          isExpanded={selectedLand && selectedLand.id === land.id}
          onToggle={() => onSelectLand(land)}
        />
      ))}
    </div>
  );
};

export default ColumLands;
