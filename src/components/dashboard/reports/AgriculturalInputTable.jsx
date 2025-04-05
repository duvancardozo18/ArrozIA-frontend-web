import React, { useState, useEffect } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import "../../../css/CropInputsTable.css"; // Asegúrate de reutilizar los estilos existentes

const AgriculturalInputTable = () => {
  const [inputs, setInputs] = useState([]);

  useEffect(() => {
    const fetchInputs = async () => {
      try {
        const response = await axiosInstance.get("/financial/agricultural-input-costs");
        setInputs(response.data);
      } catch (error) {
        console.error("Error fetching agricultural inputs:", error);
      }
    };

    fetchInputs();
  }, []);

  return (
    <div className="cultivo-insumos-table">
      <h3>Costos de Insumos Agrícolas</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Total Cantidad</th>
            <th>Costo Total</th>
          </tr>
        </thead>
        <tbody>
          {inputs.map((input, index) => (
            <tr key={index}>
              <td>{input.nombre || "No disponible"}</td>
              <td>{input.total_cantidad || "0"}</td>
              <td>${input.costo_total?.toLocaleString() || "0"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgriculturalInputTable;
