import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../config/axiosInstance'; // Asegúrate de la ruta correcta
import '../../css/Dashboard.scss';

const DatosMeteorologicos = () => {
  const [lotes, setLotes] = useState([]);
  const [selectedLote, setSelectedLote] = useState(null);
  const [weatherRecords, setWeatherRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Obtener todos los lotes desde el backend
    const fetchLotes = async () => {
      try {
        const response = await axiosInstance.get('/lands'); // Ajusta el endpoint si es necesario
        setLotes(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error al obtener los lotes:', error);
        setError('No se pudieron cargar los lotes.');
      }
    };
    fetchLotes();
  }, []);

  const handleLoteSelect = async (loteId) => {
    setSelectedLote(loteId);
    try {
      const response = await axiosInstance.get(`/weather/${loteId}`); // Ajusta el endpoint si es necesario
      setWeatherRecords(response.data);
    } catch (error) {
      console.error('Error al obtener datos meteorológicos:', error);
      setError('No se pudieron cargar los registros meteorológicos.');
      setWeatherRecords([]);
    }
  };

  return (
    <div className="dashboard">
      <h1>Datos Meteorológicos</h1>

      <div className="filter-section">
        <label htmlFor="lote-select">Selecciona un lote:</label>
        <select
          id="lote-select"
          onChange={(e) => handleLoteSelect(e.target.value)}
          value={selectedLote || ""}
        >
          <option value="">Seleccione un lote</option>
          {lotes.map((lote) => (
            <option key={lote.id} value={lote.id}>
              {lote.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="records-section">
        {selectedLote ? (
          <>
            <h2>Registros Meteorológicos para el Lote {selectedLote}</h2>
            {error && <p className="error-message">{error}</p>}
            <table className="records-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Temperatura (°C)</th>
                  <th>Humedad (%)</th>
                  <th>Precipitación (mm)</th>
                </tr>
              </thead>
              <tbody>
                {weatherRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.fecha}</td>
                    <td>{record.temperatura}</td>
                    <td>{record.humedad}</td>
                    <td>{record.precipitacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>Selecciona un lote para ver los registros meteorológicos.</p>
        )}
      </div>
    </div>
  );
};

export default DatosMeteorologicos;
