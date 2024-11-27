import React, { useState, useEffect } from 'react';
import '../../../css/ReportSummary.scss';
import CropInputsTable from '../../dashboard/reports/CropInputsTable';
import CulturalWorkTable from '../../dashboard/reports/CulturalWorkTable';
import AgriculturalInputTable from '../../dashboard/reports/AgriculturalInputTable';
import axiosInstance from "../../../config/AxiosInstance";
import TotalCostsTable from "../../dashboard/reports/TotalCostsTable";

const Rentabilidad = ({ plantingDate, harvestDate, expenses, income, cultivoId }) => {
  const [overallTotalCost, setOverallTotalCost] = useState("no disponible");
  const [filteredCulturalWorks, setFilteredCulturalWorks] = useState([]);
  const [production, setProduction] = useState(0); // Estado para producción
  const [totalIncome, setTotalIncome] = useState(0); // Estado para ingresos

  const handleFilteredDataChange = (filteredData) => {
    setFilteredCulturalWorks(filteredData);
  };

  useEffect(() => {
    // Obtener costos totales
    const fetchOverallTotalCost = async () => {
      if (!cultivoId) return;
      try {
        const response = await axiosInstance.get(`/overall-total/${cultivoId}`);
        if (response.data && response.data.total !== undefined) {
          setOverallTotalCost(response.data.total);
        } else {
          console.warn("La respuesta no contiene un valor total válido.");
          setOverallTotalCost(0); // Si falla, el valor será 0 para evitar problemas de cálculo
        }
      } catch (error) {
        console.error("Error al obtener el costo total:", error);
        setOverallTotalCost(0); // Si falla, el valor será 0
      }
    };

    // Obtener datos de producción
    const fetchProductionData = async () => {
      if (!cultivoId) return;
      try {
        const response = await axiosInstance.get(`/harvest/crops/${cultivoId}`);
        const productionData = response.data.cosechas?.[0]?.cantidad_producida_cosecha || 0;
        setProduction(productionData);
        const incomeData = response.data.cosechas?.[0]?.venta_cosecha || 0;
        setTotalIncome(incomeData);
      } catch (error) {
        console.error("Error al obtener los datos de producción:", error);
      }
    };

    fetchOverallTotalCost();
    fetchProductionData();
  }, [cultivoId]);

  // Calcular utilidad: ingresos menos costos totales
  const utility =
    typeof totalIncome === "number" && typeof overallTotalCost === "number"
      ? totalIncome - overallTotalCost
      : "No disponible";

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
          <p>{production} toneladas</p>
          <h3>Ingresos</h3>
          <p>${totalIncome.toLocaleString()}</p>
        </div>

        <div className="utility">
          <h3>Utilidad</h3>
          <p>
            {typeof utility === "number"
              ? `$${utility.toLocaleString()}`
              : "No disponible"}
          </p>
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
                <td>${typeof overallTotalCost === 'number' ? overallTotalCost.toLocaleString() : overallTotalCost}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tablas de Insumos y Labores Culturales */}
      <TotalCostsTable cultivoId={cultivoId} />
      <CropInputsTable cultivoId={cultivoId} />
      <CulturalWorkTable cultivoId={cultivoId} onFilteredDataChange={handleFilteredDataChange} />
      {/*<AgriculturalInputTable />*/}
    </div>
  );
};

export default Rentabilidad;
