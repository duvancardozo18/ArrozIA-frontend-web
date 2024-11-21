import React, { useState, useEffect } from 'react';
import "../../../css/ExportModal.scss";
import { generatePDF, generateXLS } from "./ReportExport"; // Asegúrate de ajustar la ruta correctamente
import axiosInstance from "../../../config/AxiosInstance"; // Importar AxiosInstance

const ExportModal = ({ onClose, cropDetails, inputs = [], culturalWorks = [], cultivoId }) => {
  const [format, setFormat] = useState('XLSX');
  const [totalInputCost, setTotalInputCost] = useState(0);
  const [totalWorkValue, setTotalWorkValue] = useState(0);

  useEffect(() => {
    // Obtener los valores totales al montar el componente
    const fetchTotals = async () => {
      try {
        const inputCostResponse = await axiosInstance.get(`/cultivos/${cultivoId}/insumos/total-cost`);
        setTotalInputCost(inputCostResponse.data.total_cost || 0);

        const workValueResponse = await axiosInstance.get(`/crops/${cultivoId}/cultural-works/total-value`);
        setTotalWorkValue(workValueResponse.data.total_value || 0);
      } catch (error) {
        console.error("Error al obtener los totales:", error);
      }
    };

    if (cultivoId) {
      fetchTotals();
    }
  }, [cultivoId]);

  const handleGenerateReport = () => {
    if (!cropDetails || !Array.isArray(culturalWorks) || culturalWorks.length === 0) {
      alert("No hay datos filtrados para exportar.");
      return;
    }
  
    if (format === "PDF") {
      generatePDF(cropDetails, inputs, culturalWorks, totalInputCost, totalWorkValue);
    } else if (format === "XLSX") {
      generateXLS(cropDetails, inputs, culturalWorks, totalInputCost, totalWorkValue);
    }
  
    onClose();
  };
  
  
  

  return (
    <div className="export-modal">
      <div className="export-modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h3>Exportar informe de Rentabilidad</h3>
        <p>Seleccione las opciones de exportación:</p>

        <div className="format-selection">
          <label>Formato:</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="XLSX">XLSX</option>
            <option value="PDF">PDF</option>
          </select>
        </div>

        <button
          className="generate-report-button"
          onClick={handleGenerateReport}
        >
          Generar reporte
        </button>
      </div>
    </div>
  );
};

export default ExportModal;
