import React, { useState, useEffect } from 'react';
import "../../../css/ExportModal.scss";
import { generatePDF, generateXLS } from "./ReportExport"; // Asegúrate de ajustar la ruta correctamente
import axiosInstance from "../../../config/AxiosInstance"; // Importar AxiosInstance

const ExportModal = ({ onClose, cropDetails, inputs = [], culturalWorks = [], cultivoId }) => {
  const [format, setFormat] = useState('XLSX');
  const [totalInputCost, setTotalInputCost] = useState(0);
  const [totalWorkValue, setTotalWorkValue] = useState(0);
  const [totalRent, setTotalRent] = useState(0); // Estado para el arriendo
  const [machineryAndLaborCosts, setMachineryAndLaborCosts] = useState([]); // Estado para costos de maquinaria y mano de obra
  const [agriculturalInputCosts, setAgriculturalInputCosts] = useState([]); // Estado para costos de insumos agrícolas

  useEffect(() => {
    // Obtener los valores totales al montar el componente
    const fetchTotals = async () => {
      try {
        // Obtener costos de insumos
        const inputCostResponse = await axiosInstance.get(`/cultivos/${cultivoId}/insumos/total-cost`);
        setTotalInputCost(inputCostResponse.data.total_cost || 0);

        // Obtener costos de labores culturales
        const workValueResponse = await axiosInstance.get(`/crops/${cultivoId}/cultural-works/total-value`);
        setTotalWorkValue(workValueResponse.data.total_value || 0);

        // Obtener arriendo total
        const rentResponse = await axiosInstance.get(`/lands/${cultivoId}/total-rent`);
        setTotalRent(rentResponse.data.total_rent || 0);

        // Obtener costos de maquinaria y mano de obra
        const machineryLaborResponse = await axiosInstance.get(`/lands/${cultivoId}/machinery-and-labor-costs`);
        setMachineryAndLaborCosts(machineryLaborResponse.data || []);

        // Obtener costos de insumos agrícolas
        const agriculturalInputResponse = await axiosInstance.get(`/lands/${cultivoId}/agricultural-input-costs`);
        setAgriculturalInputCosts(agriculturalInputResponse.data || []);
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
      generatePDF(
        cropDetails,
        inputs,
        culturalWorks,
        totalInputCost,
        totalWorkValue,
        totalRent,
        machineryAndLaborCosts,
        agriculturalInputCosts
      );
    } else if (format === "XLSX") {
      generateXLS(
        cropDetails,
        inputs,
        culturalWorks,
        totalInputCost,
        totalWorkValue,
        totalRent,
        machineryAndLaborCosts,
        agriculturalInputCosts
      );
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
