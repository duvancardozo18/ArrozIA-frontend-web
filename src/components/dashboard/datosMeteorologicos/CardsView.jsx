import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import LoteCard from './LoteCard'; // Asegúrate de tener este componente

// Estilos para el select
const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  margin-bottom: 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
`;

// Estilos para la navegación de lotes
const LoteNavigation = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;

  .lote-navigation-scroll {
    display: flex;
    overflow-x: auto;
    scroll-behavior: smooth;
    gap: 10px;
    width: 100%;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px;
    font-size: 18px;
    cursor: pointer;
  }
`;

// Componente principal CardsView
const CardsView = ({ farms, selectedFarmId, handleFarmSelect, lotes, selectedLote, handleLoteSelect }) => {
  const scrollRef = useRef(null);
  const [expandedLoteId, setExpandedLoteId] = useState(null); // Lote expandido

  // Función para manejar la expansión de lote
  const handleLoteToggle = (loteId) => {
    setExpandedLoteId(loteId === expandedLoteId ? null : loteId); // Alternar expansión
  };

  // Función para el desplazamiento horizontal
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -150, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 150, behavior: 'smooth' });
  };

    
  return (
    <div className="cards-view">
      <StyledSelect onChange={handleFarmSelect} value={selectedFarmId || ''}>
        <option value="" disabled>Selecciona una finca</option>
        
        {farms.map((farm) => (
          <option key={farm.id} value={farm.id}>{farm.nombre} </option>
        ))}
      </StyledSelect>

      {selectedFarmId && lotes.length > 0 ? (
        <>
          <LoteNavigation>
            <button className="arrow-button green" onClick={scrollLeft}>{"<"}</button>
            <div className="lote-navigation-scroll" ref={scrollRef}>
              {lotes.map((lote) => (
                <LoteCard
                  key={lote.id}
                  lote={lote}
                  isExpanded={selectedLote === lote.id} // Verifica si el lote está expandido
                  onToggle={() => handleLoteSelect(lote)} // Maneja el toggle para expandir/contraer el lote
                />
              ))}
            </div>
            <button className="arrow-button green" onClick={scrollRight}>{">"}</button>
          </LoteNavigation>
        </>
      ) : (
        <p>No hay lotes disponibles para esta finca.</p>
      )}
    </div>
  );
};

export default CardsView;
