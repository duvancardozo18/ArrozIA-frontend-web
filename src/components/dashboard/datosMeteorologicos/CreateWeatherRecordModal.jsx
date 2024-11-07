import React, { useState } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../../config/AxiosInstance';
import SuccessModal from '../../dashboard/modal/SuccessModal';
import '../../../css/RegistroMeteorologicoModal.scss';

// Estilos del overlay y contenido del modal
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
  position: relative;
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
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
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
  font-weight: bold;
  margin-top: 15px;

  &:hover {
    background-color: #218838;
  }
`;

const CreateWeatherRecordModal = ({ loteId, loteNombre, onClose, onDataSaved }) => {
  const [formData, setFormData] = useState({
    fecha: '',
    temperatura: '',
    presion_atmosferica: '',
    humedad: '',
    precipitacion: '',
    indice_ultravioleta: '',
    horas_sol: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/weather-record/', {
        lote_id: loteId,
        fecha: formData.fecha,
        temperatura: parseFloat(formData.temperatura),
        presion_atmosferica: parseFloat(formData.presion_atmosferica),
        humedad: parseFloat(formData.humedad),
        precipitacion: parseFloat(formData.precipitacion || 0),
        indice_ultravioleta: parseFloat(formData.indice_ultravioleta || 0),
        horas_sol: parseFloat(formData.horas_sol)
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage("Hubo un error al registrar los datos meteorológicos.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onDataSaved && onDataSaved();
    onClose();
  };

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={onClose}>×</CloseButton>
          <Title>Registrar Datos Meteorológicos</Title>
          {errorMessage && <p style={{ color: '#ff6b6b', textAlign: 'center' }}>{errorMessage}</p>}
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="input-group">
              <label>Lote</label>
              <input type="text" name="loteNombre" value={loteNombre} readOnly className="readonly-input" />
            </div>
            <div className="input-group">
              <label>Fecha</label>
              <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Temperatura (°C)</label>
              <input type="number" name="temperatura" value={formData.temperatura} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Presión (hPa)</label>
              <input type="number" name="presion_atmosferica" value={formData.presion_atmosferica} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Humedad (%)</label>
              <input type="number" name="humedad" value={formData.humedad} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Precipitación (mm)</label>
              <input type="number" name="precipitacion" value={formData.precipitacion} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>UV</label>
              <input type="number" name="indice_ultravioleta" value={formData.indice_ultravioleta} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Horas de Sol</label>
              <input type="number" name="horas_sol" value={formData.horas_sol} onChange={handleChange} required />
            </div>
            <SubmitButton type="submit">Guardar</SubmitButton>
          </form>
        </ModalContent>
      </ModalOverlay>

      {showSuccessModal && (
        <SuccessModal
          onClose={handleCloseSuccessModal}
          message="¡Datos meteorológicos registrados exitosamente!"
        />
      )}
    </>
  );
};

export default CreateWeatherRecordModal;
