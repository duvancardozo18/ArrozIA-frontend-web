import React, { useState, useEffect } from "react";
import axiosInstance from "../../../config/AxiosInstance";

const TotalCostsTable = ({ plotId }) => {
  const [costs, setCosts] = useState({
    rent: 0,
    machineryAndLabor: 0,
    agriculturalInputs: 0,
  });

  useEffect(() => {
    if (!plotId) {
      console.error("plotId no disponible en TotalCostsTable");
      return;
    }
  
    const fetchCosts = async () => {
      try {
        console.log(`Fetching costs for plotId: ${plotId}`); // Debug
        const rentResponse = await axiosInstance.get(`/lands/${plotId}/total-rent`);
        const machineryAndLaborResponse = await axiosInstance.get(`/lands/${plotId}/machinery-and-labor-costs`);
        const agriculturalInputsResponse = await axiosInstance.get(`/lands/${plotId}/agricultural-input-costs`);
  
        setCosts({
          rent: rentResponse.data.total || 0,
          machineryAndLabor: machineryAndLaborResponse.data.total || 0,
          agriculturalInputs: agriculturalInputsResponse.data.total || 0,
        });
      } catch (error) {
        console.error("Error fetching costs:", error);
      }
    };
  
    fetchCosts();
  }, [plotId]);
  

  const totalCosts =
    costs.rent + costs.machineryAndLabor + costs.agriculturalInputs;

  return (
    <div className="cultivo-insumos-table">
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
            <td>Arriendo</td>
            <td>${costs.rent.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Maquinaria y Mano de Obra</td>
            <td>${costs.machineryAndLabor.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Insumos Agrícolas</td>
            <td>${costs.agriculturalInputs.toLocaleString()}</td>
          </tr>
          <tr className="total-row">
            <td>VALOR TOTAL</td>
            <td>${totalCosts.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TotalCostsTable;
