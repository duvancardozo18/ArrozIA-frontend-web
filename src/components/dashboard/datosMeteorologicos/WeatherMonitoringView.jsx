import React, { useContext, useEffect, useState, useCallback } from 'react';
import axiosInstance from "../../../config/AxiosInstance";
import { AuthContext } from '../../../config/AuthProvider';
import CreateWeatherRecordModal from './CreateWeatherRecordModal';
import SuccessModal from '../../dashboard/modal/SuccessModal'; // Importar modal de éxito
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';
// import '../../../css/MonitoringView.scss';
import CardsView from './CardsView';


const MonitoringView = styled.div`
  display: flex;
  flex-direction: column; /* Asegura que los elementos se apilen uno encima del otro */
  padding: 20px;
  height: 100vh; /* Ocupa el 100% de la altura de la ventana */
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 10px; /* Reducir padding en pantallas pequeñas */
  }
`;

const MonitoringContent = styled.div`
  background-color: white;
  padding: 20px;
  margin-top: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  flex-grow: 1;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 15px; /* Reducir padding en pantallas pequeñas */
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  min-width: 600px;
  margin-top: 20px;
  margin-bottom: 20px; /* Añadido margen inferior al contenedor de la tabla */

  /* Aseguramos que haya scroll solo si la tabla excede la altura del contenedor */
  max-height: 400px;  /* Puedes ajustar la altura según lo necesites */
  overflow-y: auto;  /* Permite el scroll vertical */

  .records-table {
    min-width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
    background-color: #ffffff;
    color: #333;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);   
  }

  .records-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  .records-table th {
    background-color: #3a4b63;
    color: #ffffff;
    font-weight: bold;
  }

  .records-table td {
    background-color: #f9f9f9;
  }
`;

const TableHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;

  h3 {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }

  .actions {
    display: flex;
    gap: 10px;

    button {
      padding: 10px 20px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;

      &:hover {
        background-color: #218838;
      }

      @media (max-width: 768px) {
        width: 100%;
        margin-bottom: 10px;
      }
    }
  }

      @media (max-width: 768px) {
        width: 100%; /* El botón de filtro ocupa el 100% del ancho en pantallas pequeñas */
        margin-top: 10px;
      }
    }
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 1.4rem; /* Reducir el tamaño del título en pantallas pequeñas */
    }
  }
`;

const WeatherMonitoringView = () => {
  const { userId } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(null);
  const [farm, setFarm] = useState(null);  // Estado para guardar los datos completos de la finca seleccionada
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

  // const fetchFarms = useCallback(async () => {
  //   try {
  //     const url = isAdmin ? "/farms" : `/users/${userId}/farms`;
  //     const response = await axiosInstance.get(url);
  //     setFarms(response.data);
  //   } catch (error) {
  //     console.error("Error fetching farms:", error);
  //     setError("No se pudieron cargar las fincas.");
  //   }
  // }, [isAdmin, userId]);

  const fetchFarms = useCallback(async () => {
    try {
      const url = isAdmin ? "/farms" : `/users/${userId}/farms`;
      const response = await axiosInstance.get(url);
      setFarms(response.data);  // Guarda todas las fincas en el estado
      console.log("Fincas cargadas:", response.data);  // Verificar que los datos se han cargado correctamente
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

      console.log('Fetching weather data from URL:', url);  // Log de la URL

      const response = await axiosInstance.get(url);

      console.log('Weather data fetched successfully:', response.data);  // Log de la respuesta

      setWeatherRecords(response.data);
    } catch (error) {
      console.error('Error fetching weather history:', error);  // Log de error
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
  
    if (!farm) {
      alert("Por favor, selecciona una finca antes de registrar el dato.");
      return;
    }
  
    // Log para ver lo que se va a enviar
    console.log("Enviando datos para registrar el dato meteorológico:", {
      lote_id: selectedLote,
      latitud: farm.latitud,  // Agregar latitud
      longitud: farm.longitud // Agregar longitud
    });
  
    try {
      const response = await axiosInstance.post(
        "/meteorology/api", // URL del endpoint
        {
          lote_id: selectedLote,
          latitud: farm.latitud,   // Enviar latitud
          longitud: farm.longitud  // Enviar longitud
        },
        {
          headers: {
            "Content-Type": "application/json", // Especificar tipo de contenido
          },
        }
      );

      // Recalcular y forzar que el scroll se active
      const tableContainer = document.querySelector('.records-table');
      tableContainer.scrollTop = tableContainer.scrollHeight;  // Lleva el scroll al fondo de la tabla
      alert("¡Dato meteorológico registrado automáticamente!");
      fetchWeatherRecords(selectedLote); // Actualizar registros después de agregar el dato
    } catch (error) {
      console.error("Error al registrar el dato meteorológico automáticamente:", error);
      alert("Hubo un error al registrar el dato meteorológico.");
    }
  };  

  const handleFarmSelect = (event) => {
    const selectedFarmId = event.target.value;  // Obtener el ID de la finca seleccionada
    setSelectedFarmId(selectedFarmId);  // Guardar el ID de la finca seleccionada
    setSelectedLote(null);
    setWeatherRecords([]); // Limpiar registros de clima cuando se cambia la finca seleccionada
  
    // Verificar que el array 'farms' esté cargado y tenga datos
    if (farms && farms.length > 0) {
      // Buscar los datos completos de la finca seleccionada en el array de fincas
      const selectedFarm = farms.find(farm => farm.id === Number(selectedFarmId));  // Asegurar que ambos sean del mismo tipo
      console.log("Buscando finca con ID:", selectedFarmId);
  
      if (selectedFarm) {
        setFarm(selectedFarm);  // Guardar los datos completos de la finca en el estado
        console.log("Finca seleccionada:", selectedFarm);  // Verificar los datos de la finca seleccionada
        console.log("Latitud de la finca seleccionada:", selectedFarm.latitud); // Verificar latitud
        console.log("Longitud de la finca seleccionada:", selectedFarm.longitud); // Verificar longitud
      } else {
        console.log("No se encontró la finca con ID:", selectedFarmId);
        setFarm(null);  // Si no se encuentra la finca, limpiar el estado
      }
    } else {
      console.log("No se han cargado las fincas aún o el array está vacío.");
      setFarm(null);
    }
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
    if (farm) {
      // Acceder a los datos completos de la finca, por ejemplo, latitud y longitud
      console.log("Latitud de la finca:", farm.latitud);
      console.log("Longitud de la finca:", farm.longitud);
    }
  }, [farm]);  // Este efecto se ejecutará solo cuando `farm` cambie

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
    <MonitoringView>
      <div>
        <h2>Datos Meteorológicos - Fincas</h2>
        <CardsView 
          farms={farms}
          selectedFarmId={selectedFarmId}
          handleFarmSelect={handleFarmSelect}
          lotes={lotes}
          selectedLote={selectedLote}
          handleLoteSelect={handleLoteSelect}
        />
      </div>
  
      <MonitoringContent>
        {selectedLote ? (
          <>
            <TableHeader>
              <h3>Historial Meteorológico del Lote {selectedLoteNombre}</h3>
              <div className="actions">
                <button className="register-weather-btn" onClick={openModal}>
                  Registrar Datos Meteorológicos
                </button>
                <button className="prefill-weather-btn" onClick={addWeatherRecordAutomatically}>
                  Registro Automático (API)
                </button>
              </div>
            </TableHeader>
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
                        <td colSpan="7" style={{ textAlign: "center" }}>
                          No hay datos meteorológicos registrados en este lote
                        </td>
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
      </MonitoringContent>
  
      {isModalOpen && (
        <CreateWeatherRecordModal
          loteId={selectedLote}
          loteNombre={selectedLoteNombre}
          onClose={closeModal}
          fetchWeatherRecords={fetch}
        />
      )}
  
      {showSuccessModal && (
        <SuccessModal
          onClose={() => setShowSuccessModal(false)}
          message="¡Datos meteorológicos registrados automáticamente con éxito!"
        />
      )}
    </MonitoringView>
  );      
};

export default WeatherMonitoringView;