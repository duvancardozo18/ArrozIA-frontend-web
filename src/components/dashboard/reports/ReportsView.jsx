import React, { useState, useEffect, useRef } from "react";
import SpaIcon from "@mui/icons-material/Spa";
import axiosInstance from "../../../config/AxiosInstance";
import CropDetails from "./CropDetails";
import styled from "styled-components";
import Header from '../../dashboard/Header';

// Styled components
const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  margin-bottom: 10px;
  margin-top: 40px;
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
  const [farms, setFarms] = useState([]); // Lista de fincas
  const [crops, setCrops] = useState([]); // Cultivos por finca
  const [selectedFarmId, setSelectedFarmId] = useState(null); // ID de la finca seleccionada
  const [selectedFarmName, setSelectedFarmName] = useState(""); // Nombre de la finca seleccionada
  const [selectedCrop, setSelectedCrop] = useState(null); // Cultivo seleccionado
  const scrollRef = useRef(null);

  // Obtener las fincas al cargar
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axiosInstance.get("/farms");
        setFarms(response.data);
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    };
    fetchFarms();
  }, []);

  // Obtener los cultivos de la finca seleccionada
  const fetchCropsForFarm = async (farmId) => {
    try {
      const response = await axiosInstance.get(`/farms/${farmId}/crops`);
      setCrops(response.data);
    } catch (error) {
      console.error("Error fetching crops:", error);
    }
  };

  // Manejar selección de la finca
  const handleFarmSelection = (event) => {
    const farmId = event.target.value;
    const farmName = farms.find((farm) => farm.id === parseInt(farmId))?.nombre || "No disponible";
    setSelectedFarmId(farmId);
    setSelectedFarmName(farmName);
    setSelectedCrop(null);
    fetchCropsForFarm(farmId);
  };

  // Manejar selección de un cultivo
  const handleCropSelect = (cropId) => {
    setSelectedCrop(cropId);
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -150, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 150, behavior: "smooth" });
  };

  return (
    <div className="reports-view">
      <Header title="Reportes" />
      <StyledSelect onChange={handleFarmSelection} value={selectedFarmId || ""}>
        <option value="" disabled>
          Selecciona una finca
        </option>
        {farms.map((farm) => (
          <option key={farm.id} value={farm.id}>
            {farm.nombre}
          </option>
        ))}
      </StyledSelect>

      {selectedFarmId && crops.length > 0 ? (
        <>
          <CropNavigation>
            <button className="arrow-button green" onClick={scrollLeft}>
              {"<"}
            </button>
            <div className="crop-navigation-scroll" ref={scrollRef}>
              {crops.map((crop) => (
                <div
                  key={crop.id}
                  className={`crop-card ${selectedCrop === crop.id ? "selected" : ""}`}
                  onClick={() => handleCropSelect(crop.id)}
                >
                  <div className="icon-container">
                    <SpaIcon style={{ color: "white", fontSize: 24 }} />
                  </div>
                  <span>{crop.cropName || "Nombre no disponible"}</span>
                </div>
              ))}
            </div>
            <button className="arrow-button green" onClick={scrollRight}>
              {">"}
            </button>
          </CropNavigation>

          {selectedCrop ? (
            <CropDetails
              selectedCropId={selectedCrop}
              selectedFarmName={selectedFarmName} // Pasar el nombre de la finca
              onClose={() => setSelectedCrop(null)}
            />
          ) : (
            <p>Selecciona un cultivo para ver los detalles...</p>
          )}
        </>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default ReportsView;
