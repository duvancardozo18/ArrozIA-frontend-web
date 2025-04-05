import React, { useState, useEffect } from 'react';
import '../../../css/ReportSummary.css';
import CropInputsTable from '../../dashboard/reports/CropInputsTable';
import CulturalWorkTable from '../../dashboard/reports/CulturalWorkTable';
import AgriculturalInputTable from '../../dashboard/reports/AgriculturalInputTable';
import axiosInstance from "../../../config/AxiosInstance";
import TotalCostsTable from "../../dashboard/reports/TotalCostsTable";  
import TotalCostsTable2 from "../../dashboard/reports/TotalCostsTable2";

const Rentabilidad = ({ plantingDate, harvestDate, expenses, income, cultivoId, plotId,selectedCropId  }) => {
  const [overallTotalCost, setOverallTotalCost] = useState("no disponible");
  const [filteredCulturalWorks, setFilteredCulturalWorks] = useState([]);
  const [production, setProduction] = useState(0); // Estado para producción
  const [totalIncome, setTotalIncome] = useState(0); // Estado para ingresos
  const [cultivoTotalCost, setCultivoTotalCost] = useState(0); // Estado para el total de costos del cultivo
  const [insumosTotalCost, setInsumosTotalCost] = useState(0);  // Estado para almacenar el total de los insumos
  const [totalInsumos, setTotalInsumos] = useState('0');
  const [totalCulturalWork, setTotalCulturalWork] = useState(0);  // Estado para el total de labores culturales

 
  const handleTotalCulturalWorkChange = (total) => {
    setTotalCulturalWork(total);  // Actualiza el total de labores culturales
  };

  const handleInsumosTotalCostChange = (total) => {
    setInsumosTotalCost(total); // Actualizar el estado con el nuevo total de insumos
  };
  
  const handleTotalCostChange = (totalCost) => {
    setCultivoTotalCost(totalCost); // Actualizamos el estado con el total recibido
  };
  const handleFilteredDataChange = (filteredData) => {
    setFilteredCulturalWorks(filteredData);
  };

  // UseEffect para obtener el total de costos desde la API
  useEffect(() => {
    if (cultivoId) {
      console.log("Realizando la solicitud con cultivoId:", cultivoId);
  
      const fetchOverallTotalCost = async () => {
        try {
          const response = await axiosInstance.get(`/overall-total/${cultivoId}`);
          console.log("Respuesta de la API:", response.data); // Imprimir la respuesta de la API
  
          if (response.data && response.data.total_general) {
            setOverallTotalCost(response.data.total_general); // Ajustar esto si el formato de respuesta es diferente
          } else {
            console.error("No se obtuvo un total válido de la API");
          }
        } catch (error) {
          console.error("Error al obtener el total de costos:", error);
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

  }
    
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
                <td>{overallTotalCost !== "no disponible" ? `$${overallTotalCost.toLocaleString()}` : "Cargando..."}</td> {/* Mostrar el total de costos */}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tablas de Insumos y Labores Culturales */}
      <TotalCostsTable cultivoTotalCost={cultivoTotalCost} plotId={cultivoId} insumosTotalCost={insumosTotalCost}  totalCulturalWork={totalCulturalWork} cultivoId={cultivoId}/>
      <TotalCostsTable2 cultivoId={cultivoId} onTotalCostChange={handleTotalCostChange} />
      <CropInputsTable cultivoId={cultivoId} onTotalCostChange={handleInsumosTotalCostChange} />
      <CulturalWorkTable cultivoId={cultivoId} onFilteredDataChange={handleFilteredDataChange} onTotalCulturalWorkChange={handleTotalCulturalWorkChange} />
      {/*<AgriculturalInputTable />*/}
    </div>
  );
};

export default Rentabilidad;
