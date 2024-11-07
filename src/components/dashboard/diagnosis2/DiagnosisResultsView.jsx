import React from 'react';
import styled from 'styled-components';

// Estilos para resaltar el resultado de IA
const HighlightBox = styled.div`
  border: 3px solid #4caf50;
  padding: 20px;
  margin: 30px 0;
  background-color: #e8f5e9;
  text-align: center;
  border-radius: 12px;
  font-weight: bold;
  color: #2e7d32;
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const HighlightText = styled.div`
  font-size: 1.6rem;
  color: #388e3c;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const PredictionResult = styled.div`
  font-size: 2rem;
  color: #1b5e20;
  font-weight: bold;
`;

// Estilos para la imagen y su contenedor
const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;

  img {
    border: 3px solid #007bff;
    border-radius: 10px;
    max-width: 100%;
    height: auto;
  }
`;

// Botón personalizado para acciones
const CustomButton = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;

  &:hover {
    background-color: #218838;
  }
`;

const DiagnosisResultsView = ({ results, onRetakeImages, cropName }) => {
  if (!results || !results.prediction) {
    return <p>No hay resultados disponibles.</p>;
  }

  const { prediction, uploadedImages } = results;
  const {
    confianza_promedio,
    fecha_diagnostico,
    id,
    imagenes_analizadas,
    exportado,
    comparacion_diagnostico,
    resultado_ia,
  } = prediction;


  return (
    <div className="diagnosis-results-view">
      <h2>Resultados del Diagnóstico</h2>
      <div className="results">
        <div className="result-item">
          {/* Mostrar la imagen que se subió */}
          {uploadedImages && uploadedImages.length > 0 && (
            <ImageContainer>
              <img src={URL.createObjectURL(uploadedImages[0])} alt="Resultado del diagnóstico" />
            </ImageContainer>
          )}
          <div className="result-details">
            <p><strong>Nombre del Cultivo:</strong> {cropName}</p>
            <p><strong>Confianza:</strong> {confianza_promedio ? (confianza_promedio * 10).toFixed(2) + '%' : 'N/A'}</p>
            <p><strong>Fecha del Diagnóstico:</strong> {fecha_diagnostico ? new Date(fecha_diagnostico).toLocaleDateString() : 'N/A'}</p>
            <p><strong>ID del Diagnóstico:</strong> {id}</p>
            <p><strong>Imágenes Analizadas:</strong> {imagenes_analizadas}</p>
            <p><strong>Exportado:</strong> {exportado ? 'Sí' : 'No'}</p>
            <p><strong>Comparación Diagnóstico:</strong> {comparacion_diagnostico || 'N/A'}</p>
          </div>
        </div>

        {/* Resaltar el resultado de IA */}
        <HighlightBox>
          <HighlightText>Resultado del Análisis</HighlightText>
          <PredictionResult>{resultado_ia}</PredictionResult>
        </HighlightBox>
      </div>

      <div className="actions">
        <CustomButton onClick={onRetakeImages}>
          Capturar Nuevas Imágenes
        </CustomButton>
      </div>
    </div>
  );
};

export default DiagnosisResultsView;
