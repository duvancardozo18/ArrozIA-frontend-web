import React, { useState, useEffect } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import "../../../css/CropInputsTable.scss";

const CropInputsTable = ({ cultivoId, onTotalCostChange }) => {
  const [inputs, setInputs] = useState([]);
  const [totalCost, setTotalCost] = useState(0); // Estado para el costo total
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [isFiltering, setIsFiltering] = useState(false); // Estado para indicar si se está aplicando un filtro

  useEffect(() => {
    if (!cultivoId) {
      console.error("Error: cultivoId es undefined en CropInputsTable");
      return;
    }

    // Función para obtener los insumos
    const fetchInputs = async () => {
      try {
        const response = await axiosInstance.get(`/cultivos/${cultivoId}/insumos`);
        setInputs(response.data);
        setIsFiltering(false); // Reiniciar el estado de filtrado al cargar todos los insumos
      } catch (error) {
        console.error("Error fetching inputs:", error);
      }
    };

    // Función para obtener el costo total de los insumos
    const fetchTotalCost = async () => {
      try {
        const response = await axiosInstance.get(`/cultivos/${cultivoId}/insumos/total-cost`);
        const total = response.data.total_cost || 0;
        setTotalCost(total); // Manejar el valor total
        if (onTotalCostChange) {
          onTotalCostChange(total); // Pasamos el total al componente superior
        }
      } catch (error) {
        console.error("Error fetching total input cost:", error);
      }
    };

    fetchInputs();
    fetchTotalCost();
  }, [cultivoId,onTotalCostChange]);

  // Manejar la búsqueda de insumos
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      console.warn("El término de búsqueda está vacío.");
      return;
    }

    try {
      setIsFiltering(true); // Indicar que se está aplicando un filtro
      const response = await axiosInstance.get(`/cultivos/${cultivoId}/insumos/search`, {
        params: { concepto: searchTerm }, // Enviar el término de búsqueda como parámetro
      });
      setInputs(response.data);
    } catch (error) {
      console.error("Error searching inputs:", error);
    }
  };

  // Manejar la limpieza del filtro
  const handleClearFilter = async () => {
    setSearchTerm(""); // Limpiar el campo de búsqueda
    setIsFiltering(false); // Reiniciar el estado de filtrado
    try {
      const response = await axiosInstance.get(`/cultivos/${cultivoId}/insumos`);
      setInputs(response.data); // Recargar todos los insumos
    } catch (error) {
      console.error("Error fetching all inputs:", error);
    }
  };

  return (
    <div className="cultivo-insumos-table">
      <h3>Insumos Utilizados</h3>

      {/* Filtro por nombre de insumo */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Buscar por nombre de insumo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} disabled={!searchTerm.trim()}>
          Buscar
        </button>
        <button onClick={handleClearFilter} disabled={!isFiltering}>
          Limpiar Filtro
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Insumo</th>
            <th>Tipo de Insumo</th>
            <th>Valor Unitario</th>
            <th>Cantidad</th>
            <th>Valor Total</th>
          </tr>
        </thead>
        <tbody>
          {inputs.length > 0 ? (
            inputs.map((input, index) => (
              <tr key={index}>
                <td>{input.fecha ? new Date(input.fecha).toLocaleDateString() : "No disponible"}</td>
                <td>{input.concepto || "No disponible"}</td>
                <td>{input.tipo_insumo?.nombre || "No disponible"}</td>
                <td>${input.valor_unitario?.toLocaleString() || "0"}</td>
                <td>{input.cantidad || 0}</td>
                <td>${input.valor_total?.toLocaleString() || "0"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No se encontraron insumos.</td>
            </tr>
          )}
          <tr className="total-row">
            <td colSpan="5">Valor total</td>
            <td>${totalCost.toLocaleString()}</td> {/* Mostrar el valor total del endpoint */}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CropInputsTable;
