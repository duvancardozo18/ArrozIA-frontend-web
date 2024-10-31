import React, { useState, useEffect } from "react";
import "../../../../css/AgriculturalTables.scss";
import axiosInstance from "../../../../config/AxiosInstance";
import TablePhenologicalStageAction from "./TablePhenologicalStageAction";

const PhenologicalStageTable = ({ refresh }) => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [riceManagementTables, setRiceManagementTables] = useState([]); // Almacena múltiples tablas de Gestión Arroz
  const [showStageTable, setShowStageTable] = useState(false);

  const fetchPhenologicalStages = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/variety-rice-stages");
      setStages(response.data);
    } catch (error) {
      setError("Hubo un problema al cargar las etapas fenológicas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhenologicalStages();
  }, [refresh]);

  const addRiceManagementTable = () => {
    setRiceManagementTables([...riceManagementTables, stages]);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="table-container">
      

      {/* Tabla principal */}
      <table className="table">
        <thead>
          <tr>
            <th>Variedad de Arroz</th>
            <th>Etapa Fenológica</th>
            <th>Días de Duración</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {stages.map((stage) => (
            <tr key={stage.id}>
              <td>{stage.variety?.nombre || "N/A"}</td>
              <td>{stage.phenological_stage?.nombre || "N/A"}</td>
              <td>{stage.dias_duracion}</td>
              <td>
                <TablePhenologicalStageAction stage={stage} onSave={fetchPhenologicalStages} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabla de Gestión Arroz - Genera una nueva tabla cada vez que se presiona el botón */}
      {riceManagementTables.map((tableData, index) => (
        <div className="table-container" key={index} style={{ marginTop: "20px" }}>
          <h3>Tabla de Gestión Arroz #{index + 1}</h3>
          <table className="table">
            <thead>
              <tr>
                <th>ID de Variedad</th>
                <th>Nombre de Variedad</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((stage) => (
                <tr key={stage.variety?.id || `table-${index}-row`}>
                  <td>{stage.variety?.id || "N/A"}</td>
                  <td>{stage.variety?.nombre || "N/A"}</td>
                  <td>{stage.variety?.descripcion || "Sin descripción"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Tabla de Etapa */}
      {showStageTable && (
        <div className="table-container" style={{ marginTop: "20px" }}>
          <h3>Tabla de Etapa</h3>
          <table className="table">
            <thead>
              <tr>
                <th>ID de Etapa</th>
                <th>Nombre de Etapa</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((stage) => (
                <tr key={stage.phenological_stage?.id || "no-id"}>
                  <td>{stage.phenological_stage?.id || "N/A"}</td>
                  <td>{stage.phenological_stage?.nombre || "N/A"}</td>
                  <td>{stage.phenological_stage?.descripcion || "Sin descripción"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PhenologicalStageTable;
