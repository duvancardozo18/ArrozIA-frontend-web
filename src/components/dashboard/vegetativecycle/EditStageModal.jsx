import React, { useState } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../../config/AxiosInstance';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const SaveButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const CancelButton = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const EditStageModal = ({ stage, closeModal }) => {
  const [startDate, setStartDate] = useState(stage.startDate || '');
  const [endDate, setEndDate] = useState(stage.endDate || '');

  const handleSave = async () => {
    try {
      await axiosInstance.put(`/phenological-stage/`, {
        fecha_inicio: startDate,
        fecha_fin: endDate
      });
      closeModal();
    } catch (error) {
      console.error("Error al actualizar la etapa:", error);
    }
  };
  

  return (
    <ModalOverlay>
      <ModalContent>
        <h3>Editar Etapa</h3>
        <label>Fecha de Inicio</label>
        <Input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
        />
        <label>Fecha de Fin</label>
        <Input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
        />
        
        <ButtonContainer>
          <CancelButton onClick={closeModal}>Cancelar</CancelButton>
          <SaveButton onClick={handleSave}>Guardar Cambios</SaveButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditStageModal;
