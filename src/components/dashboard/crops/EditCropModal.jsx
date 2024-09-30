import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../../config/AxiosInstance';
import EditCropSuccessModal from '../modal/SuccessModal'; // Modal de éxito para cultivos

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 20px;
  width: 450px;
  max-width: 100%;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.2);
  transform: translateZ(0);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-10px) scale(1.03) perspective(1000px);
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  input, select {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    font-size: 16px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #218838;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #ff6b6b;
  }
`;

const EditCropModal = ({ show, closeModal, crop, onSave }) => {
  const [cropName, setCropName] = useState('');
  const [plantingDate, setPlantingDate] = useState('');
  const [estimatedHarvestDate, setEstimatedHarvestDate] = useState('');
  const [varietyId, setVarietyId] = useState('');
  const [plotId, setPlotId] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (crop && crop.id) {
      console.log('Datos del cultivo para editar:', crop);
      setCropName(crop.cropName || '');
      setPlantingDate(crop.plantingDate || '');
      setEstimatedHarvestDate(crop.estimatedHarvestDate || '');
      setVarietyId(crop.varietyId || '');
      setPlotId(crop.plotId || '');
    } else {
      console.error('No se pudo editar el cultivo: ID de cultivo indefinido.');
    }
  }, [crop]);

  const handleUpdateCrop = async () => {
    if (!crop || !crop.id) {
      console.error('No se pudo editar el cultivo: ID de cultivo indefinido.');
      return;
    }

    const cropData = {
      cropName,
      plantingDate: plantingDate === '' ? null : plantingDate,
      estimatedHarvestDate: estimatedHarvestDate === '' ? null : estimatedHarvestDate,
      varietyId: Number(varietyId),
      plotId: Number(plotId)
    };

    try {
      const response = await axiosInstance.put(`/update/crop/${crop.id}`, cropData);
      console.log('Respuesta del backend:', response.data);
      setShowSuccessModal(true); // Mostrar el modal de éxito
      onSave(); // Actualiza la lista de cultivos después de la edición
    } catch (error) {
      console.error('Error al actualizar el cultivo:', error);
    }
  };

  if (!show) return null;

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Editar Cultivo</h2>
          <InputGroup>
            <label>Nombre del Cultivo</label>
            <input
              type="text"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <label>Fecha de Siembra</label>
            <input
              type="date"
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <label>Fecha Estimada de Cosecha</label>
            <input
              type="date"
              value={estimatedHarvestDate}
              onChange={(e) => setEstimatedHarvestDate(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <label>Variedad de Arroz</label>
            <input
              type="number"
              value={varietyId}
              onChange={(e) => setVarietyId(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <label>Lote</label>
            <input
              type="number"
              value={plotId}
              onChange={(e) => setPlotId(e.target.value)}
              required
            />
          </InputGroup>
          <SubmitButton onClick={handleUpdateCrop}>Guardar Cambios</SubmitButton>
        </ModalContent>
      </ModalOverlay>

      {/* Modal de éxito */}
      {showSuccessModal && (
        <EditCropSuccessModal
          show={showSuccessModal}
          closeModal={() => setShowSuccessModal(false)}
        />
      )}
    </>
  );
};

export default EditCropModal;
