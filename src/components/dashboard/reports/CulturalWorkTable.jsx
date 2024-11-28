import React, { useState, useEffect } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import "../../../css/CropInputsTable.scss";

const CulturalWorkTable = ({ cultivoId, onFilteredDataChange, onTotalCulturalWorkChange  }) => {
  const [culturalWorks, setCulturalWorks] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [filters, setFilters] = useState({
    activity: "",
    machinery: "",
    operator: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (!cultivoId) return;

    const fetchCulturalWorks = async () => {
      try {
        const response = await axiosInstance.get(`/crops/${cultivoId}/cultural-works`);
        setCulturalWorks(response.data);
        const total = response.data.reduce((acc, work) => acc + work.valor, 0);
        setTotalValue(total);
        onTotalCulturalWorkChange(total);  // Pasar el total de las labores culturales
        onFilteredDataChange(response.data); // Envía los datos iniciales
      } catch (error) {
        console.error("Error fetching cultural works:", error);
      }
    };

    fetchCulturalWorks();
  }, [cultivoId]);

  const handleFilter = async () => {
    try {
      const { activity, machinery, operator, startDate, endDate } = filters;
      let url = `/crops/${cultivoId}/cultural-works`;

      if (activity) {
        url = `/crops/${cultivoId}/cultural-works/filter-by-activity?activity_name=${activity}`;
      } else if (machinery) {
        url = `/crops/${cultivoId}/cultural-works/filter-by-machinery?machinery_name=${machinery}`;
      } else if (operator) {
        url = `/crops/${cultivoId}/cultural-works/filter-by-operator?operator_name=${operator}`;
      } else if (startDate && endDate) {
        url = `/crops/${cultivoId}/cultural-works/filter-by-date-range?start_date=${startDate}&end_date=${endDate}`;
      }

      const response = await axiosInstance.get(url);
      setCulturalWorks(response.data);
      setTotalValue(response.data.reduce((acc, work) => acc + work.valor, 0));
      onFilteredDataChange(response.data); // Envía los datos filtrados
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="cultivo-insumos-table">
      <h3>Labores Culturales</h3>
      <div className="filters">
        <input
          type="text"
          name="activity"
          placeholder="Filtrar por actividad"
          value={filters.activity}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="machinery"
          placeholder="Filtrar por maquinaria"
          value={filters.machinery}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="operator"
          placeholder="Filtrar por operador"
          value={filters.operator}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="startDate"
          placeholder="Fecha inicio"
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="endDate"
          placeholder="Fecha fin"
          value={filters.endDate}
          onChange={handleFilterChange}
        />
        <button onClick={handleFilter}>Aplicar Filtros</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Fecha Inicio</th>
            <th>Fecha de Culminación</th>
            <th>Actividad</th>
            <th>Maquinaria / Insumo</th>
            <th>Operario</th>
            <th>Descripción</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {culturalWorks.map((work, index) => (
            <tr key={index}>
              <td>{new Date(work.fecha_inicio).toLocaleString()}</td>
              <td>{new Date(work.fecha_culminacion).toLocaleString()}</td>
              <td>{work.actividad}</td>
              <td>{work.maquinaria || "No aplica"}</td>
              <td>{work.operario}</td>
              <td>{work.descripcion}</td>
              <td>${work.valor.toLocaleString()}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan="6">Valor Total</td>
            <td>${totalValue.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CulturalWorkTable;
