import React, { useState, useEffect } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import "../../../css/CropInputsTable.scss";

const CropInputsTable = ({ cultivoId }) => {
  const [inputs, setInputs] = useState([]);
  const [totalCost, setTotalCost] = useState(0); // Nuevo estado para el total

  useEffect(() => {
    console.log("CropInputsTable - cultivoId recibido:", cultivoId); // Debug
    if (!cultivoId) {
      console.error("Error: cultivoId es undefined en CropInputsTable");
      return;
    }

    // Función para obtener los insumos
    const fetchInputs = async () => {
      try {
        const response = await axiosInstance.get(`/cultivos/${cultivoId}/insumos`);
        setInputs(response.data);
      } catch (error) {
        console.error("Error fetching inputs:", error);
      }
    };

    // Función para obtener el costo total de los insumos
    const fetchTotalCost = async () => {
      try {
        const response = await axiosInstance.get(`/cultivos/${cultivoId}/insumos/total-cost`);
        setTotalCost(response.data.total_cost || 0); // Manejar el valor total
      } catch (error) {
        console.error("Error fetching total input cost:", error);
      }
    };

    // Llamar a ambas funciones
    fetchInputs();
    fetchTotalCost();
  }, [cultivoId]);

  return (
    <div className="cultivo-insumos-table">
      <h3>Insumos Utilizados</h3>
      <table>
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Valor Unitario</th>
            <th>Cantidad</th>
            <th>Descripción</th>
            <th>Valor Total</th>
          </tr>
        </thead>
        <tbody>
          {inputs.map((input, index) => (
            <tr key={index}>
              <td>{input.concepto}</td>
              <td>${input.valor_unitario.toLocaleString()}</td>
              <td>{input.cantidad}</td>
              <td>{input.descripcion}</td>
              <td>${input.valor_total.toLocaleString()}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan="4">Valor total</td>
            <td>${totalCost.toLocaleString()}</td> {/* Mostrar el valor total del endpoint */}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CropInputsTable;
