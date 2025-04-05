import React, { useState, useEffect } from 'react';
import "../../../css/ExportModal.css";
import { generatePDF } from "./ReportExport"; // Asegúrate de ajustar la ruta correctamente
import axiosInstance from "../../../config/AxiosInstance"; // Importar AxiosInstance

const ExportModal = ({ onClose, cropDetails, inputs, culturalWorks, cultivoId }) => {
  const [format] = useState('PDF');
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

        // Obtener costos de maquinaria y mano de obra (si aplica)
        const machineryAndLaborResponse = await axiosInstance.get(`/cultivos/${cultivoId}/machinery-labor-cost`);
        setMachineryAndLaborCosts(machineryAndLaborResponse.data || []);

        // Obtener costos de insumos agrícolas
        const agriculturalInputResponse = await axiosInstance.get(`/cultivos/${cultivoId}/agricultural-inputs`);
        setAgriculturalInputCosts(agriculturalInputResponse.data || []);
        
      } catch (error) {
        console.error("Error al obtener los totales:", error);
      }
    };

    fetchTotals();
  }, [cultivoId]); // Dependencia para volver a ejecutar cuando cambie el cultivoId

  const handleGenerateReport = () => {
    // Verificar que existan datos (filtrados o completos)
    if (!cropDetails || (!inputs.length && !culturalWorks.length)) {
      alert("No hay datos para exportar.");
      return;
    }
  
    if (format === "PDF") {
      generatePDF(
        cropDetails,
        inputs, // Datos actuales de la tabla de insumos
        culturalWorks, // Datos actuales de la tabla de labores culturales
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
      <div className="modal-content">
        <label>Generar Reporte</label>
        <div className="format-selection">
          <p>El reporte se genera en formato PDF</p>
        </div>

        <button onClick={handleGenerateReport} className="generate-btn">Exportar</button>
        <button onClick={onClose} className="close-btn">x</button>
      </div>
    </div>
  );
};

export default ExportModal;
