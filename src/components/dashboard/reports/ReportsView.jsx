import React, { useState, useEffect, useRef } from 'react';
import SpaIcon from '@mui/icons-material/Spa';
import axiosInstance from "../../../config/AxiosInstance";
import CropDetails from './CropDetails';
import styled from 'styled-components';

// Styled components
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

const CropNavigation = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;

  .crop-navigation-scroll {
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

const ReportsView = () => {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axiosInstance.get('/farms');
        setFarms(response.data);
      } catch (error) {
        console.error('Error fetching farms:', error);
      }
    };
    fetchFarms();
  }, []);

  const fetchCropsForFarm = async (farmId) => {
    try {
      const response = await axiosInstance.get(`/farms/${farmId}/crops`);
      console.log("Cultivos obtenidos:", response.data); // Verificar datos
      setCrops(response.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  const handleFarmSelection = (event) => {
    const farmId = event.target.value;
    setSelectedFarmId(farmId);
    setSelectedCrop(null);
    fetchCropsForFarm(farmId);
  };

  const handleCropSelect = (cropId) => {
    console.log("Cultivo seleccionado:", cropId); // Verificar qué valor se está pasando
    setSelectedCrop(cropId);
  };
  
  

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -150, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 150, behavior: 'smooth' });
  };

  return (
    <div className="reports-view">
      <h2>Reportes</h2>
      <StyledSelect onChange={handleFarmSelection} value={selectedFarmId || ''}>
        <option value="" disabled>Selecciona una finca</option>
        {farms.map((farm) => (
          <option key={farm.id} value={farm.id}>{farm.nombre}</option>
        ))}
      </StyledSelect>

      {selectedFarmId && crops.length > 0 ? (
        <>
          <CropNavigation>
            <button className="arrow-button green" onClick={scrollLeft}>{"<"}</button>
            <div className="crop-navigation-scroll" ref={scrollRef}>
              {crops.map((crop) => (
                <div
                  key={crop.id}
                  className={`crop-card ${selectedCrop === crop.id ? 'selected' : ''}`}
                  onClick={() => handleCropSelect(crop.id || "ID no válido")}
                >
                  <div className="icon-container">
                    <SpaIcon style={{ color: 'white', fontSize: 24 }} />
                  </div>
                  <span>{crop.cropName || "Nombre no disponible"}</span>
                </div>
              ))}
            </div>
            <button className="arrow-button green" onClick={scrollRight}>{">"}</button>
          </CropNavigation>

          {selectedCrop ? (
            <CropDetails selectedCropId={selectedCrop} onClose={() => setSelectedCrop(null)} />
          ) : (
            <p>Selecciona un cultivo para ver los detalles...</p>
          )}
        </>
      ) : (
        <p>No hay cultivos disponibles para esta finca.</p>
      )}
    </div>
  );
};

export default ReportsView;
