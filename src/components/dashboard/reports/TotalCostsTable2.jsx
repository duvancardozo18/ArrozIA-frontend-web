import React, { useEffect, useState } from 'react';
import axiosInstance from "../../../config/AxiosInstance";
import "../../../css/TotalCostsTable2.scss";  // Asegúrate de que este archivo esté presente

const TotalCostsTable2 = ({ cultivoId, onTotalCostChange }) => {
  const [costDetails, setCostDetails] = useState([]);  // Estado para los detalles de los costos
  const [loading, setLoading] = useState(true);  // Estado para manejar la carga
  const [totalCost, setTotalCost] = useState(0); // Estado para el valor total de los costos

  useEffect(() => {
    if (!cultivoId) {
      console.error("Error: cultivoId es undefined o null.");
      return;
    }

    const fetchCostDetails = async () => {
      setLoading(true);  // Comenzamos la carga

      try {
        // Hacer la petición a la ruta '/costs/{cultivo_id}'
        const response = await axiosInstance.get(`/costs/${cultivoId}`);
        setCostDetails(response.data);  // Guardar los detalles de costos

        // Calcular el costo total
        const total = response.data.reduce((acc, item) => acc + item.precio, 0);
        setTotalCost(total); // Guardar el costo total

        if (onTotalCostChange) {
            onTotalCostChange(total);
          }
        } catch (error) {
            console.error("Error al obtener los costos:", error);
          } finally {
            setLoading(false);
          }
    };

    fetchCostDetails();
  }, [cultivoId, onTotalCostChange]);

  if (loading) {
    return <div>Cargando los detalles de costos...</div>;
  }

  return (
    <div className="table-container">
      <h2 className="table-title">Costos del Cultivo</h2>
      <table className="costs-table">
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Descripción</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {costDetails.map((cost) => (
            <tr key={cost.id}>
              <td>{cost.concepto}</td>
              <td>{cost.descripcion}</td>
              <td>${cost.precio.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2" className="total-row">Total</td>
            <td className="total-value">${totalCost.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TotalCostsTable2;
