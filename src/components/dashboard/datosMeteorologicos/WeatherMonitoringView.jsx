import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from "../../../config/AxiosInstance";
import LoteCard from './LoteCard';
import CreateWeatherRecordModal from './CreateWeatherRecordModal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../../../css/MonitoringView.scss';

const WeatherMonitoringView = () => {
  const [lotes, setLotes] = useState([]);
  const [selectedLote, setSelectedLote] = useState(null);
  const [selectedLoteNombre, setSelectedLoteNombre] = useState("");
  const [weatherRecords, setWeatherRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reload, setReload] = useState(false);

  // Estados para las fechas de filtro
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch lotes on component mount
  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await axiosInstance.get('/lands');
        setLotes(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching lotes:', error);
        setError('Error loading lotes.');
      }
    };
    fetchLotes();
  }, []);

  // Fetch weather records for selected lote with optional date filters
  const fetchWeatherRecords = useCallback(async (loteId, start, end) => {
    setLoading(true);
    setError(null);
    setWeatherRecords([]);
    try {
      let url = `/meteorology/history/${loteId}`;
      if (start && end) {
        url += `?fecha_inicio=${start}&fecha_fin=${end}`;
      }
      const response = await axiosInstance.get(url);
      setWeatherRecords(response.data);
    } catch (error) {
      console.error('Error fetching weather history:', error);
      setError('');
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload weather records on lote selection or filter change
  useEffect(() => {
    if (selectedLote) {
      fetchWeatherRecords(
        selectedLote,
        startDate ? startDate.toISOString().split('T')[0] : null,
        endDate ? endDate.toISOString().split('T')[0] : null
      );
    }
  }, [selectedLote, reload, startDate, endDate, fetchWeatherRecords]);

  const handleLoteSelect = (lote) => {
    setSelectedLote(lote.id);
    setSelectedLoteNombre(lote.nombre);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setReload((prev) => !prev);
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

  return (
    <div className="monitoring-view">
      <div className="monitoring-sidebar">
        <h2>Datos Meteorológicos - Lotes</h2>
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
      </div>

      <div className="monitoring-content">
        {selectedLote ? (
          <>
            <div className="table-header">
              <h3>Historial Meteorológico del Lote {selectedLoteNombre}</h3>
              <button className="register-weather-btn" onClick={openModal}>
                Registrar Datos Meteorológicos
              </button>
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
                <button className="apply-filter-btn" onClick={applyDateFilter}>Aplicar Filtro</button>
              </div>
            </div>
            {error && <p className="error-message">{error}</p>}
            {loading ? (
              <p>Cargando registros meteorológicos...</p>
            ) : (
              <table className="records-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th></th>
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
                        <td>{record.hora}</td>
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
                      <td colSpan="8" style={{ textAlign: "center" }}>No hay registros disponibles</td>
                    </tr>
                  )}
                </tbody>
              </table>
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
    </div>
  );
};

export default WeatherMonitoringView;
