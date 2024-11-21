import React, { useState, useEffect } from 'react';
import '../../../css/ReportSummary.scss';
import CropInputsTable from '../../dashboard/reports/CropInputsTable';
import CulturalWorkTable from '../../dashboard/reports/CulturalWorkTable';
import AgriculturalInputTable from '../../dashboard/reports/AgriculturalInputTable'; // Importa el nuevo componente
import ExportModal from './ExportModal';
import axiosInstance from "../../../config/AxiosInstance";

const Rentabilidad = ({ plantingDate, harvestDate, expenses, income, cultivoId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [overallTotalCost, setOverallTotalCost] = useState("no recibido");
  const [filteredCulturalWorks, setFilteredCulturalWorks] = useState([]);

  const handleFilteredDataChange = (filteredData) => {
    setFilteredCulturalWorks(filteredData);
  };

  useEffect(() => {
    const fetchOverallTotalCost = async () => {
      if (!cultivoId) return;
      try {
        const response = await axiosInstance.get(`/overall-total/${cultivoId}`);
        setOverallTotalCost(response.data.total || 2);
      } catch (error) {
        console.error("Error al obtener el costo total:", error);
      }
    };

    fetchOverallTotalCost();
  }, [cultivoId]);

  const totalIncome = income.reduce((acc, item) => acc + item.amount, 0);
  const totalExpenses = expenses.reduce((acc, item) => acc + item.cost, 0);
  const utility = totalIncome - totalExpenses;

  const handleExport = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="report-summary-container">
      <div className="report-summary">
        <div className="dates">
          <div className="date-item">
            <span className="icon">🌱</span>
            <div>
              <h3>Fecha de siembra</h3>
              <p>{plantingDate || 'No disponible'}</p>
            </div>
          </div>
          <div className="date-item">
            <span className="icon">🌾</span>
            <div>
              <h3>Fecha de Cosecha</h3>
              <p>{harvestDate || 'No disponible'}</p>
            </div>
          </div>
        </div>

        <div className="production">
          <h3>Producción</h3>
          <p>{totalIncome} toneladas</p>
          <h3>Ingresos</h3>
          <p>${totalIncome.toLocaleString()}</p>
        </div>

        <div className="utility">
          <h3>Utilidad</h3>
          <p>${utility.toLocaleString()}</p>
        </div>

        <div className="total-costs">
          <h3>Costos totales</h3>
          <table>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={index}>
                  <td>{expense.name}</td>
                  <td>${expense.cost.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td>VALOR TOTAL</td>
                <td>${overallTotalCost.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tablas de Insumos y Labores Culturales */}
      <CropInputsTable cultivoId={cultivoId} />
      <CulturalWorkTable cultivoId={cultivoId} onFilteredDataChange={handleFilteredDataChange} />
      <AgriculturalInputTable /> {/* Nueva tabla de insumos agrícolas */}

      {/* Botón para abrir el modal */}
      <div className="export-button-container">
        <button className="export-button" onClick={handleExport}>
          Exportar Informe
        </button>
      </div>

      {/* Modal para exportación */}
      {isModalOpen && (
        <ExportModal
          onClose={handleCloseModal}
          cropDetails={{ plantingDate, harvestDate, expenses, income }}
          inputs={[]} // Suponiendo que los insumos vienen desde otra fuente
          culturalWorks={filteredCulturalWorks}
          cultivoId={cultivoId}
        />
      )}
    </div>
  );
};

export default Rentabilidad;
