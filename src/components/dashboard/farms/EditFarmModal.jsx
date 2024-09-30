import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../../config/AxiosInstance';  // Asegúrate de que la ruta sea correcta
import EditFarmSuccessModal from '../modal/SuccessModal';  // Importa el modal de éxito


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

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 18px;  
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;  
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #ff6b6b;
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
    transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;

    &:focus {
      box-shadow: 0px 0px 8px 2px rgba(39, 174, 96, 0.3);
      transform: translateY(-3px);
      outline: none;
    }
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
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #218838;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const EditFarmModal = ({ show, closeModal, farm, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    area_total: '' || null,
    latitud: '' || null,
    longitud: '' || null
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (farm) {
      setFormData({
        nombre: farm.nombre,
        ubicacion: farm.ubicacion,
        area_total: farm.area_total,
        latitud: farm.latitud,
        longitud: farm.longitud,
      });
    }
  }, [farm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setErrorMessage('');
      const response = await axiosInstance.put(`/update/farm/${farm.id}`, formData);
      closeModal();  // Cerrar el EditModal
      setShowSuccessModal(true);
      // Llamar a onSave antes de mostrar el modal de éxito
      onSave(response.data);
      
      // Mostrar el modal de éxito
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage('Error actualizando la finca.');
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  if (!show && !showSuccessModal) return null;
  return (
    <>
      {show && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={closeModal}>×</CloseButton>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Editar Finca</h2>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <form onSubmit={handleSubmit}>
              <InputGroup>
                <label>Nombre de la Finca</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
              <InputGroup>
                <label>Ubicación</label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
              <InputGroup>
                <label>Área Total (Opcional)</label>
                <input
                  type="number"
                  name="area_total"
                  value={formData.area_total}
                  onChange={handleChange}
                />
              </InputGroup>
              <InputGroup>
                <label>Latitud (Opcional)</label>
                <input
                  type="text"
                  name="latitud"
                  value={formData.latitud}
                  onChange={handleChange}
                />
              </InputGroup>
              <InputGroup>
                <label>Longitud (Opcional)</label>
                <input
                  type="text"
                  name="longitud"
                  value={formData.longitud}
                  onChange={handleChange}
                />
              </InputGroup>
              <SubmitButton type="submit">Guardar Cambios</SubmitButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
      {showSuccessModal && (
        <EditFarmSuccessModal 
          show={showSuccessModal} 
          closeModal={handleCloseSuccessModal} 
        />
      )}
    </>
  );
};

export default EditFarmModal;
