import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import grassIcon from "../../../assets/icons/grass.svg";
import psychiatryIcon from "../../../assets/icons/psychiatry.svg";
import pottedIcon from "../../../assets/icons/potted.svg";
import agricultureIcon from "../../../assets/icons/agriculture.svg";
import compostIcon from "../../../assets/icons/compost.svg";

const Indicator = styled.div`
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;

  @media (max-width: 768px) {
    top: -25px;
    width: 20px;
    height: 20px;
  }
`;

const ProgressContainer = styled.div`
  background-color: #9e9998;
  border-radius: 25px;
  display: flex;
  width: 100%;
  height: 60px;
  margin: 50px 0 20px 0;
  position: relative;

  @media (max-width: 768px) {
    height: 40px; /* Reduce la altura en pantallas pequeñas */
    margin: 30px 0 15px 0;
  }
`;

const GeneralProgressBar = styled.div`
  background-color: #28a745;
  height: 100%;
  width: ${(props) => props.$progress}%;
  transition: width 0.3s ease;
  border-radius: 25px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
`;

const StagesContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column; /* Cambia a una dirección vertical en pantallas pequeñas */
  }
`;

const StageSection = styled.div`
  flex: ${(props) => props.percentage};
  text-align: center;
  color: white;
  font-size: 12px;
  padding: 10px 5px;
  padding-bottom: 15px;
  font-weight: bold;
  border-right: 1px solid #e0e0e0;
  position: relative;
  background-color: transparent;
  min-width: 100px;

  &:last-child {
    border-right: none;
  }

  @media (max-width: 768px) {
    font-size: 10px; /* Reduce el tamaño de la fuente en pantallas pequeñas */
    padding: 8px 5px;
    padding-bottom: 10px;
    min-width: 80px;
  }
`;

const StageLabel = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 11px; /* Ajusta el tamaño de la fuente para pantallas más pequeñas */
  }
`;

const DateLabel = styled.div`
  font-size: 10px;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 9px; /* Ajusta el tamaño de la fuente en pantallas pequeñas */
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Ajuste para reducir el ancho mínimo en pantallas pequeñas */
    gap: 15px;
    margin-top: 15px;
  }
`;

const CardContainer = styled.div`
  background: #aba6a6;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  @media (max-width: 768px) {
    padding: 15px; /* Reduce el padding en pantallas pequeñas */
  }
`;

// Mapeo de IDs de etapa fenológica con sus nombres
const stageMapping = {
  5: 'Germinación',
  6: 'Plántula',
  7: 'Macollamiento',
  8: 'Elongación del tallo',
  9: 'Embuchamiento',
  10: 'Espigamiento',
  11: 'Floración',
  12: 'Etapa lechosa',
  13: 'Etapa de maduración',
  14: 'Senescencia'
};

const VegetativeCard = ({ plantingDate }) => {
  const [stages, setStages] = useState([]);
  const [totalCycleDuration, setTotalCycleDuration] = useState(0);
  const [generalProgress, setGeneralProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch phenological stages
  const fetchPhenologicalStages = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/variety-rice-stages"); 
      const fetchedStages = response.data;

      // Calculate total duration of the cycle
      const totalDuration = fetchedStages.reduce((acc, stage) => acc + (stage.dias_duracion || 0), 0);
      setTotalCycleDuration(totalDuration);

      // Calculate start and end dates for each stage
      const mappedStagesWithDates = calculateStageDates(fetchedStages, plantingDate);
      setStages(mappedStagesWithDates);
    } catch (error) {
      setError("Hubo un problema al cargar las etapas fenológicas.");
      console.error("Error fetching stages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate start and end dates for each stage based on plantingDate
  const calculateStageDates = (stages, plantingDate) => {
    if (!plantingDate) return stages;
    const startDate = new Date(plantingDate);
    return stages.map((stage) => {
      const start = new Date(startDate);
      const end = new Date(startDate.setDate(startDate.getDate() + (stage.dias_duracion || 0)));
      startDate.setDate(startDate.getDate() + (stage.dias_duracion || 0));
      return {
        ...stage,
        nombre: stageMapping[stage.etapa_fenologica_id] || "Etapa desconocida",
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
      };
    });
  };

  useEffect(() => {
    fetchPhenologicalStages();
  }, [plantingDate]);

  // Calculate progress for the general progress bar
  const calculateProgress = () => {
    if (!plantingDate || !totalCycleDuration) return;
    const start = new Date(plantingDate);
    const now = new Date();
    const elapsedDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    setGeneralProgress((elapsedDays / totalCycleDuration) * 100);
  };

  useEffect(() => {
    calculateProgress();
  }, [plantingDate, totalCycleDuration]);

  const icons = [grassIcon, psychiatryIcon, pottedIcon, agricultureIcon, compostIcon];

  return (
    <>
    {loading && <p>Cargando etapas fenológicas...</p>}
    {error && <p>{error}</p>}
    {!loading && !error && (
      <>
        <p>Duración total del ciclo vegetativo: {totalCycleDuration} días</p>
        <ProgressContainer>
          <GeneralProgressBar $progress={generalProgress} />
          {stages.map((stage, index) => (
            <StageSection key={index} percentage={(stage.dias_duracion / totalCycleDuration) * 100}>
              <Indicator>
                <img src={icons[index % icons.length]} alt={`Icono de ${stage.nombre}`} style={{ width: '30px', height: '30px' }} />
              </Indicator>
              <StageLabel>{stage.nombre}</StageLabel>
              <DateLabel>
                {stage.startDate} - {stage.endDate}
              </DateLabel>
            </StageSection>
          ))}
        </ProgressContainer>

        <GridContainer>
          {stages.map((stage, index) => (
            <CardContainer key={index}>
              <StageLabel>{stage.nombre}</StageLabel>
              <DateLabel>Inicio: {stage.startDate}</DateLabel>
              <DateLabel>Fin: {stage.endDate}</DateLabel>
              <DateLabel>Duración: {stage.dias_duracion} días</DateLabel>
            </CardContainer>
          ))}
        </GridContainer>
      </>
    )}
  </>
  );
};

export default VegetativeCard;