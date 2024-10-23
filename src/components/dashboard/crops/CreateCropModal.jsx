import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../../config/AxiosInstance';
import SuccessModal from '../../dashboard/modal/SuccessModal';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

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
  max-width: 90%;
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

  input, select {
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

const NewCrop = ({ closeModal, selectedAllotment, selectedFarm }) => {
  const [formData, setFormData] = useState({
    cropName: '', 
    varietyId: '',
    plotId: selectedAllotment ? parseInt(selectedAllotment.id) : '', // Asegúrate de asignar el ID del lote
    plantingDate: '',
    estimatedHarvestDate: ''
  });

  const [varieties, setVarieties] = useState([]); // Estado para almacenar las variedades de arroz
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  // Obtener las variedades desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const varietiesResponse = await axiosInstance.get('/list-varieties'); // Endpoint para obtener las variedades de arroz
        setVarieties(varietiesResponse.data);
      } catch (error) {
        console.error('Error al obtener variedades:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Datos enviados:", formData);
    try {
      const response = await axiosInstance.post('/crops', formData);
      console.log('Cultivo creado:', response.data);
      setShowSuccessModal(true);  // Mostrar modal de éxito
  
      // Extraer los slugs desde la respuesta del backend
      const { slug, plotSlug, fincaSlug } = response.data; // Recibe los slugs desde el backend
      if (slug && plotSlug && fincaSlug) {
        navigate(`/finca/${fincaSlug}/lote/${plotSlug}/cultivo/${slug}`);
      } else {
        console.error('Faltan slugs en la respuesta del backend');
      }
    } catch (error) {
      console.error('Error al crear el cultivo:', error);
      if (error.response && error.response.status === 400) {
        setErrorMessage('Error al crear el cultivo.');
      } else {
        setErrorMessage('Error inesperado al crear el cultivo.');
      }
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal();  // Cierra el modal principal después del éxito
  };

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Crear Cultivo</h2>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <label>Lote Asignado</label>
              <input
                type="text"
                name="plotId"
                value={selectedAllotment ? selectedAllotment.nombre : ''} // Mostrar el nombre del lote
                disabled // Deshabilitar el campo para que no sea editable
              />
            </InputGroup>

            <InputGroup>
              <label>Nombre del Cultivo</label>
              <input
                type="text"
                name="cropName"
                value={formData.cropName}
                onChange={handleChange}
                maxLength={50}
                required
              />
            </InputGroup>

            <InputGroup>
              <label>Variedad de Arroz</label>
              <select
                name="varietyId"
                value={formData.varietyId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una variedad</option>
                {varieties.map((variety) => (
                  <option key={variety.id} value={variety.id}>
                    {variety.nombre}
                  </option>
                ))}
              </select>
            </InputGroup>

            <InputGroup>
              <label>Fecha de Siembra</label>
              <input
                type="date"
                name="plantingDate"
                value={formData.plantingDate}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <label>Fecha Estimada de Cosecha</label>
              <input
                type="date"
                name="estimatedHarvestDate"
                value={formData.estimatedHarvestDate}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <SubmitButton type="submit">Crear</SubmitButton>
          </form>
        </ModalContent>
      </ModalOverlay>
      {showSuccessModal && <SuccessModal closeModal={handleCloseSuccessModal} />}
    </>
  );
};

NewCrop.propTypes = {
  closeModal: PropTypes.func.isRequired,
  selectedAllotment: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Ahora acepta tanto string como number
    nombre: PropTypes.string.isRequired,
  }).isRequired,
  selectedFarm: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
  }), // Agregar selectedFarm como prop
};

export default NewCrop;
