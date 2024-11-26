import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import '../../../css/RegistroMeteorologicoModal.scss';

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

const CreateWeatherRecordModal = ({ loteId, loteNombre, prefilledData, onClose }) => {
  const [formData, setFormData] = useState({
    fecha: '',
    temperatura: '',
    presion_atmosferica: '',
    humedad: '',
    precipitacion: '',
    indice_ultravioleta: '',
    horas_sol: ''
  });

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
    try {
      alert("Datos enviados correctamente");
      onClose();
    } catch (error) {
      console.error("Error al registrar los datos meteorológicos:", error);
      alert("Error en el registro.");
    }
  };

  return (
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
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Presión (hPa)</label>
            <input
              type="number"
              name="presion_atmosferica"
              value={formData.presion_atmosferica}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Humedad (%)</label>
            <input
              type="number"
              name="humedad"
              value={formData.humedad}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Precipitación (mm)</label>
            <input
              type="number"
              name="precipitacion"
              value={formData.precipitacion}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>UV</label>
            <input
              type="number"
              name="indice_ultravioleta"
              value={formData.indice_ultravioleta}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Horas de Sol</label>
            <input
              type="number"
              name="horas_sol"
              value={formData.horas_sol}
              onChange={handleChange}
              required
            />
          </div>
          <SubmitButton type="submit">Guardar</SubmitButton>
        </form>
      </div>
    </div>
  );
};

export default CreateWeatherRecordModal;
