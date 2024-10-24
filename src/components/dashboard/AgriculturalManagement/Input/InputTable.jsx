import React, { useState, useEffect } from "react";
import "../../../../css/AgriculturalTables.scss";
import axiosInstance from "../../../../config/AxiosInstance";
import TablaInsumosAction from "./TableInputAction"; // Adjust the path if necessary

const InsumosTable = ({ refresh }) => {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInsumos = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axiosInstance.get("/inputs"); // Ensure this route matches your backend
      console.log("Data received from backend:", response.data); // For debugging and verifying data
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
            <th>Unidad de Medida</th>
            <th>Costo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {insumos.map((insumo) => (
            <tr key={insumo.id}>
              <td>{insumo.nombre}</td>
              <td>{insumo.unidad || "N/A"}</td>
              <td>{insumo.costo_unitario}</td>
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
