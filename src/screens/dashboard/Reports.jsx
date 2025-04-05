import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../../config/AuthProvider";
import Header from '../../components/dashboard/Header';
import '../../css/Reports.css';
import { Navigate } from 'react-router-dom';
import ReportsView from '../../components/dashboard/reports/ReportsView';
import axiosInstance from "../../config/AxiosInstance";

const Reports = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedReportDetails, setSelectedReportDetails] = useState(null);

  // Obtener todos los reportes (cultivos) al cargar el componente
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axiosInstance.get('/crops/all');
        if (response.data && Array.isArray(response.data)) {
          console.log("Cultivos obtenidos:", response.data); // Agregar log para depuración
          setReports(response.data);
        } else {
          console.error("Respuesta inesperada del backend:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener los cultivos:", error);
      }
    };
    fetchReports();
  }, []);

  // Obtener los detalles del reporte seleccionado
  useEffect(() => {
    if (selectedReportId) {
      const fetchReportDetails = async () => {
        try {
          const response = await axiosInstance.get(`/crops/${selectedReportId}`);
          console.log("Detalles del cultivo seleccionado:", response.data); // Agregar log para depuración
          setSelectedReportDetails(response.data);
        } catch (error) {
          console.error("Error al obtener los detalles del cultivo:", error);
        }
      };
      fetchReportDetails();
    }
  }, [selectedReportId]);

  // Manejar la selección del reporte
  const handleSelectChange = (event) => {
    const reportId = event.target.value;
    setSelectedReportId(reportId);
  };

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="content-area">
      <Header title="Reportes" />

      {/* Select para listar los reportes (cultivos) */}
      <div className="report-select">
        <label htmlFor="report-select">Selecciona un Reporte:</label>
        <select id="report-select" onChange={handleSelectChange} value={selectedReportId || ''}>
          <option value="">Selecciona un reporte</option>
            {reports.map((report) => {
              console.log("Cultivo en mapeo:", report);
               return (
                <option key={report.id} value={report.id}>
                  {report.cropName}
                 </option>
  );
})}

        </select>
      </div>

      {/* Mostrar los detalles del reporte seleccionado */}
      {selectedReportDetails ? (
        <ReportsView reportsData={selectedReportDetails} />
      ) : (
        <p>Selecciona un reporte para ver los detalles...</p>
      )}
    </div>
  );
};

export default Reports;
