import React, { useContext, useEffect, useState, useCallback } from 'react';
import axiosInstance from "../../../config/AxiosInstance";
import { AuthContext } from '../../../config/AuthProvider';
import LoteCard from './LoteCard';
import CreateWeatherRecordModal from './CreateWeatherRecordModal';
import SuccessModal from '../../dashboard/modal/SuccessModal'; // Importar modal de éxito
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';
import '../../../css/MonitoringView.scss';

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ddd;
  outline: none;
  transition: box-shadow 0.3s ease;

  &:focus {
    box-shadow: 0 0 5px 2px rgba(0, 128, 0, 0.4);
  }
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: #218838;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  width: 100%;
  margin-top: 20px;

  .records-table {
    width: 100%;
    min-width: 600px;
    border-collapse: collapse;
  }

  th, td {
    padding: 8px;
    text-align: center;
  }
`;

const WeatherMonitoringView = () => {
  const { userId } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(null);
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [selectedLote, setSelectedLote] = useState(null);
  const [selectedLoteNombre, setSelectedLoteNombre] = useState("");
  const [weatherRecords, setWeatherRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const checkIfAdmin = async () => {
    try {
      const response = await axiosInstance.get(`/users/${userId}/is_admin`);
      setIsAdmin(response.data.is_admin);
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const fetchFarms = useCallback(async () => {
    try {
      const url = isAdmin ? "/farms" : `/users/${userId}/farms`;
      const response = await axiosInstance.get(url);
      setFarms(response.data);
    } catch (error) {
      console.error("Error fetching farms:", error);
      setError("No se pudieron cargar las fincas.");
    }
  }, [isAdmin, userId]);

  const fetchLotesForFarm = useCallback(async () => {
    if (!selectedFarmId) return;
    try {
      const response = await axiosInstance.get(`/farmlots/farm/${selectedFarmId}`);
      setLotes(response.data);
    } catch (error) {
      console.error('Error fetching lots:', error);
      setError("Error loading lots.");
    }
  }, [selectedFarmId]);

  const fetchWeatherRecords = useCallback(async (loteId, start, end) => {
    setLoading(true);
    setError(null);
    try {
      let url = `/meteorology/history/${loteId}`;
      if (start && end) {
        url += `?fecha_inicio=${start}&fecha_fin=${end}`;
      }
      const response = await axiosInstance.get(url);
      setWeatherRecords(response.data);
    } catch (error) {
      console.error('Error fetching weather history:', error);
      setWeatherRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addWeatherRecordAutomatically = async () => {
    if (!selectedLote) {
      alert("Por favor, selecciona un lote antes de registrar el dato meteorológico.");
      return;
    }
    try {
      const response = await axiosInstance.post(
        "/meteorology/api", // URL del endpoint
        { lote_id: selectedLote }, // Enviar datos en el cuerpo
        {
          headers: {
            "Content-Type": "application/json", // Especificar tipo de contenido
          },
        }
      );
      alert("¡Dato meteorológico registrado automáticamente!");
      fetchWeatherRecords(selectedLote); // Actualizar registros después de agregar el dato
    } catch (error) {
      console.error("Error al registrar el dato meteorológico automáticamente:", error);
      alert("Hubo un error al registrar el dato meteorológico.");
    }
  };
  const handleFarmSelect = (event) => {
    setSelectedFarmId(event.target.value);
    setSelectedLote(null);
    setWeatherRecords([]);
  };

  const handleLoteSelect = (lote) => {
    setSelectedLote(lote.id);
    setSelectedLoteNombre(lote.nombre);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setStartDate(null);
    setEndDate(null);
    fetchWeatherRecords(selectedLote);
  };

  const applyDateFilter = () => {
    if (selectedLote) {
      fetchWeatherRecords(
        selectedLote,
        startDate ? startDate.toISOString().split('T')[0] : null,
        endDate ? endDate.toISOString().split('T')[0] : null
      );
    }
  };

  useEffect(() => {
    if (userId) {
      checkIfAdmin();
    }
  }, [userId]);

  useEffect(() => {
    if (isAdmin !== null) {
      fetchFarms();
    }
  }, [isAdmin, fetchFarms]);

  useEffect(() => {
    fetchLotesForFarm();
  }, [selectedFarmId, fetchLotesForFarm]);

  useEffect(() => {
    if (selectedLote) {
      fetchWeatherRecords(
        selectedLote,
        startDate ? startDate.toISOString().split('T')[0] : null,
        endDate ? endDate.toISOString().split('T')[0] : null
      );
    }
  }, [selectedLote, startDate, endDate, fetchWeatherRecords]);

  return (
    <div className="monitoring-view">
      <div className="monitoring-sidebar">
        <h2>Datos Meteorológicos - Fincas</h2>
        <StyledSelect onChange={handleFarmSelect} value={selectedFarmId || ''}>
          <option value="" disabled>Selecciona una finca</option>
          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>{farm.nombre}</option>
          ))}
        </StyledSelect>
        {selectedFarmId && (
          <>
            <h2 style={{ marginTop: '20px' }}>Lotes</h2>
            <div className="lot-cards">
              {lotes.map((lote) => (
                <LoteCard
                  key={lote.id}
                  lote={lote}
                  isExpanded={selectedLote === lote.id}
                  onToggle={() => handleLoteSelect(lote)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="monitoring-content">
        {selectedLote ? (
          <>
            <div className="table-header">
              <h3>Historial Meteorológico del Lote {selectedLoteNombre}</h3>
              <div className="actions">
                <button 
                  className="register-weather-btn" 
                  onClick={openModal}
                >
                  Registrar Datos Meteorológicos
                </button>
                <button 
                  className="prefill-weather-btn" 
                  onClick={addWeatherRecordAutomatically}
                >
                  Registro Automático (API)
                </button>
                <ActionButton onClick={openModal}>
                  Registro Manual
                </ActionButton>
                <ActionButton onClick={addWeatherRecordAutomatically}>
                  Registro Automático
                </ActionButton>
              </div>
              <div className="date-filter">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Fecha Inicio"
                  className="date-picker"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Fecha Fin"
                  className="date-picker"
                />
                <button className="apply-filter-btn" onClick={applyDateFilter}>
                  Aplicar Filtro
                </button>
              </div>
            </div>
            {loading ? (
              <p>Cargando registros meteorológicos...</p>
            ) : (
              <TableContainer>
                <table className="records-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Temperatura (°C)</th>
                      <th>Presión (hPa)</th>
                      <th>Humedad (%)</th>
                      <th>Precipitación (mm)</th>
                      <th>UV</th>
                      <th>Horas de Sol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weatherRecords.length > 0 ? (
                      weatherRecords.map((record) => (
                        <tr key={record.id}>
                          <td>{record.fecha}</td>
                          <td>{record.temperatura}</td>
                          <td>{record.presion_atmosferica}</td>
                          <td>{record.humedad}</td>
                          <td>{record.precipitacion || 0}</td>
                          <td>{record.indice_ultravioleta}</td>
                          <td>{record.horas_sol}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: "center" }}>No hay datos meteorológicos registrados en este lote</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </TableContainer>
            )}
          </>
        ) : (
          <p>Selecciona un lote para ver los registros meteorológicos.</p>
        )}
      </div>

      {isModalOpen && (
        <CreateWeatherRecordModal
          loteId={selectedLote}
          loteNombre={selectedLoteNombre}
          onClose={closeModal}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          onClose={() => setShowSuccessModal(false)}
          message="¡Datos meteorológicos registrados automáticamente con éxito!"
        />
      )}
    </div>
  );
};

export default WeatherMonitoringView;
