// TotalCostsTable.jsx
import React, { useEffect, useState } from 'react'; 
import axiosInstance from "../../../config/AxiosInstance";
import "../../../css/TotalCostsTable.css";

const TotalCostsTable = ({ plotId, cultivoTotalCost, insumosTotalCost, insumosAgricolas, totalCulturalWork , cultivoId, onTotalCostChange   }) => {
  const [costs, setCosts] = useState({
    rent: 0,
    machineryAndLabor: 0,
    agriculturalInputs: 0,
  });

  useEffect(() => {
    if (!plotId && !cultivoId && onTotalCostChange) {
      onTotalCostChange(totalCosts);  // Pasamos el total de costos al componente padre
    }

    const fetchCosts = async () => {
      try {
        console.log(`Fetching costs for plotId: ${plotId}`);

        // Realizamos las peticiones a las rutas correspondientes
        const rentResponse = await axiosInstance.get(`/lands/${plotId}/total-rent`);
        const machineryAndLaborResponse = await axiosInstance.get(`/lands/${plotId}/machinery-and-labor-costs`);
        const agriculturalInputsResponse = await axiosInstance.get(`/lands/${plotId}/agricultural-input-costs`);

        // Actualizamos los costos en el estado. Si una ruta falla, usamos 0 como valor por defecto.
        setCosts({
          rent: rentResponse?.data?.total || 0, // Si no hay datos, asignamos 0
          machineryAndLabor: machineryAndLaborResponse?.data?.total || 0,
          agriculturalInputs: agriculturalInputsResponse?.data?.total || 0,
        });
      } catch (error) {
        console.error("Error fetching costs:", error);
        // Si hay error en alguna ruta, asignamos 0 a todos los valores.
        setCosts({
          rent: 0,
          machineryAndLabor: 0,
          agriculturalInputs: 0,
        });
      }
    };

    fetchCosts();
  }, [plotId, cultivoId,]);

  const totalCosts = cultivoTotalCost + insumosTotalCost + totalCulturalWork; // Agregar el total de costos del cultivo

return (
  <div className="total-costs-table">
    <h3>Costos Totales</h3>
    <table>
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Labores Culturales</td>
          <td>{totalCulturalWork ? `$${totalCulturalWork.toLocaleString()}` : "Cargando..."}</td>
        </tr>
        <tr>
          <td>Insumos Agrícolas</td>
          <td>{insumosTotalCost ? `$${insumosTotalCost.toLocaleString()}` : "Cargando..."}</td>
        </tr>
        <tr>
          <td>Costos del Cultivo</td>
          <td>{cultivoTotalCost ? `$${cultivoTotalCost.toLocaleString()}` : "Cargando..."}</td>
        </tr>
        <tr>
          <td><strong>Total</strong></td>
          <td><strong>{(cultivoTotalCost + insumosTotalCost + totalCulturalWork).toLocaleString()}</strong></td>
          </tr>
      </tbody>
    </table>
  </div>
);

};

export default TotalCostsTable;
