import React, { useState, useEffect } from "react";
import "../../../../css/AgriculturalTables.css";
import axiosInstance from "../../../../config/AxiosInstance";
import TablaInsumosAction from "./TableInputAction"; // Ajusta la ruta si es necesario

const InsumosTable = ({ refresh }) => {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInsumos = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axiosInstance.get("/inputs"); // Asegúrate de que esta ruta coincida con tu backend
      console.log("Data received from backend:", response.data); // Para depuración y verificar datos
      setInsumos(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching insumos:", error);
      setError("There was a problem loading the insumos.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsumos();
  }, [refresh]); // Re-fetch insumos when refresh changes

  if (loading) {
    return <div>Loading insumos...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Unidad de Medida</th>
            <th>Costo Unitario</th>
            <th>Tipo de Insumo</th> {/* Nueva columna */}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {insumos.map((insumo) => (
            <tr key={insumo.id}>
              <td>{insumo.nombre}</td>
              <td>{insumo.cantidad || "N/A"}</td>
              <td>{insumo.unidad ? insumo.unidad.nombre : "N/A"}</td>
              <td>{insumo.costo_unitario}</td>
              <td>{insumo.tipo_insumo ? insumo.tipo_insumo.nombre : "N/A"}</td> {/* Mostrar el tipo de insumo */}
              <td>
                <TablaInsumosAction insumo={insumo} onSave={fetchInsumos} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InsumosTable;
