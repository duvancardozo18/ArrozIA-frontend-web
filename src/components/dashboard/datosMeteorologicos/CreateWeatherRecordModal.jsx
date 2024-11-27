import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import '../../../css/RegistroMeteorologicoModal.scss';
import axiosInstance from '../../../config/AxiosInstance';
import SuccessModal from '../../dashboard/modal/SuccessModal';

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const CreateWeatherRecordModal = ({ loteId, loteNombre, prefilledData, onClose, fetchWeatherRecords }) => {
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

  useEffect(() => {
    if (prefilledData) {
      setFormData(prefilledData);
    }
  }, [prefilledData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos a enviar:", formData);
    console.log('loteId:', loteId);  // Verifica el valor de loteId

    try {
      const response = await axiosInstance.post(`/meteorology/manual/${loteId}`, formData);
      console.log("Datos enviados a la BD", response);
      
      // Mostrar el modal de éxito
      setShowSuccessModal(true);

      // Refrescar los registros meteorológicos después de guardar los datos
      fetchWeatherRecords(loteId);

      // Limpiar el localStorage si los datos meteorológicos se almacenan ahí
      localStorage.removeItem("weatherData");  // Cambia 'weatherData' por la clave que estés utilizando

      // Cerrar el modal principal después de enviar los datos
      onClose();
    } catch (error) {
      console.error("Error al registrar los datos meteorológicos:", error);
      alert("Error en el registro.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onClose();  // Cerrar el modal principal después de mostrar el de éxito
  };

  return (
    <>
      <div className="modal-overlay">
       <div className="modal-content">
         <button className="close-button" onClick={onClose}>×</button>
         <h2 className="modal-title">Registrar Datos Meteorológicos</h2>
         <form onSubmit={handleSubmit}>
           <div className="input-group">
             <label>Lote</label>
             <input type="text" value={loteNombre} readOnly />
           </div>
           <div className="input-group">
             <label>Fecha</label>
             <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Temperatura (°C)</label>
            <input
              type="number"
              name="temperatura"
              value={formData.temperatura}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (parseFloat(value) >= -99.99 && parseFloat(value) <= 999.99)) {
                  handleChange(e);
                }
              }}
              required
              step="0.01"
              min="-99.99"
              max="999.99"
            />
          </div>
          <div className="input-group">
            <label>Presión (hPa)</label>
            <input
              type="number"
              name="presion_atmosferica"
              value={formData.presion_atmosferica}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (parseFloat(value) >= 0.00 && parseFloat(value) <= 9999.99)) {
                  handleChange(e);
                }
              }}
              required
              step="0.01"
              min="0.00"
              max="9999.99"
            />
          </div>
          <div className="input-group">
            <label>Humedad (%)</label>
            <input
              type="number"
              name="humedad"
              value={formData.humedad}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (parseFloat(value) >= 0.00 && parseFloat(value) <= 99.99)) {
                  handleChange(e);
                }
              }}
              required
              step="0.01"
              min="0.00"
              max="99.99"
            />
          </div>
          <div className="input-group">
            <label>Precipitación (mm)</label>
            <input
              type="number"
              name="precipitacion"
              value={formData.precipitacion}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (parseFloat(value) >= 0.00 && parseFloat(value) <= 99.99)) {
                  handleChange(e);
                }
              }}
              step="0.01"
              min="0.00"
              max="99.99"
            />
          </div>
          <div className="input-group">
            <label>UV</label>
            <input
              type="number"
              name="indice_ultravioleta"
              value={formData.indice_ultravioleta}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (parseFloat(value) >= 0.00 && parseFloat(value) <= 9.99)) {
                  handleChange(e);
                }
              }}
              step="0.01"
              min="0.00"
              max="9.99"
            />
          </div>
          <div className="input-group">
            <label>Horas de Sol</label>
            <input
              type="number"
              name="horas_sol"
              value={formData.horas_sol}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (parseFloat(value) >= 0.00 && parseFloat(value) <= 9.99)) {
                  handleChange(e);
                }
              }}
              required
              step="0.01"
              min="0.00"
              max="9.99"
            />
          </div>
          <SubmitButton type="submit">Guardar</SubmitButton>
        </form>
      </div>
      </div>

      {showSuccessModal && (
        <SuccessModal 
          message="Datos meteorológicos registrados con éxito."
          onClose={handleCloseSuccessModal} 
        />
      )}
    </>
  );
};

export default CreateWeatherRecordModal;
