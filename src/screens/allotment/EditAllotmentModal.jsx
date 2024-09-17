import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../config/AxiosInstance';
import EditAllotmentSuccessModal from './EditAllotmentSuccesModal';


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

  input {
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

const EditAllotmentModal = ({ show, closeModal, lote, onSave }) => {
  const [nombre, setNombre] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [area, setArea] = useState('');
  const [unidadArea, setUnidadArea] = useState('');

  const [showSuccessModal, setShowSuccessModal] = useState(false);


  useEffect(() => {
    if (lote && lote.id) {
      console.log('Datos del lote para editar:', lote); // Asegúrate de que este console.log muestre los datos correctos
      setNombre(lote.nombre || '');
      setLatitud(lote.latitud || '');
      setLongitud(lote.longitud || '');
      setArea(lote.area || '');
      setUnidadArea(lote.unidad_area_id || '');  // Si unidadArea es otro campo en el backend
    } else {
      console.error("No se pudo editar el lote: ID de lote indefinido.");
    }
  }, [lote]);
  

  const handleUpdateAllotment = async () => {
    if (!lote || !lote.id) {
      console.error("No se pudo editar el lote: ID de lote indefinido.");
      return;
    }
  
    const loteData = {
      nombre,
      latitud: latitud === '' ? null : latitud,
      longitud: longitud === '' ? null : longitud,
      area: Number(area),
      unidad_area_id: unidadArea
    };
  
    try {
      const response = await axiosInstance.put(`/update/land/${lote.id}`, loteData);
      console.log("Respuesta del backend:", response.data);
      setShowSuccessModal(true); // Mostrar el modal de éxito
      onSave(); // Actualiza la lista de lotes después de la edición
    } catch (error) {
      console.error("Error al actualizar el lote:", error);
    }
  };
  

  if (!show) return null;

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Editar Lote</h2>
          <InputGroup>
            <label>Nombre del Lote</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <label>Latitud</label>
            <input
              type="text"
              value={latitud}
              onChange={(e) => setLatitud(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <label>Longitud</label>
            <input
              type="text"
              value={longitud}
              onChange={(e) => setLongitud(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <label>Área</label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <label>Unidad de Área</label>
            <input
              type="text"
              value={unidadArea}
              onChange={(e) => setUnidadArea(e.target.value)}
            />
          </InputGroup>
          <SubmitButton onClick={handleUpdateAllotment}>Guardar Cambios</SubmitButton>
        </ModalContent>
      </ModalOverlay>
  
      {/* Modal de éxito */}
      {showSuccessModal && (
        <EditAllotmentSuccessModal
        show={showSuccessModal}
        closeModal={() => setShowSuccessModal(false)}
      />
      )}
    </>
  );
  
};

export default EditAllotmentModal;

