import React, { useState, useEffect } from "react";
import "../../../../css/AgriculturalTables.scss";
import axiosInstance from "../../../../config/AxiosInstance";
import TablaInsumosAction from "./TableInputAction"; // Ajusta la ruta si es necesario

const InsumosTable = ({ refresh }) => {
  // Estado para almacenar los insumos obtenidos del backend
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Función para obtener los insumos desde el backend
  const fetchInsumos = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axiosInstance.get("/inputs"); // Asegúrate de que esta ruta coincide con tu backend
      console.log("Datos recibidos del backend:", response.data); // Para depurar y verificar los datos
      setInsumos(response.data); // Asigna los datos de los insumos a tu estado
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los insumos:", error);
      setError("Hubo un problema al cargar los insumos.");
      setLoading(false);
    }
  };

  // Hook para obtener los insumos al cargar el componente y cuando cambie `refresh`
  useEffect(() => {
    fetchInsumos();
  }, [refresh]); // Volver a obtener los insumos cuando cambie el valor de `refresh`

  if (loading) {
    return <div>Cargando insumos...</div>;
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
            <tr key={insumo.id}> {/* Usa el id del insumo */}
              <td>{insumo.nombre}</td> {/* Muestra el nombre del insumo */}
              <td>{insumo.unidad?.nombre || 'N/A'}</td> {/* Muestra el nombre de la unidad si está disponible */}
              <td>{insumo.costo_unitario}</td> {/* Muestra el costo unitario */}
              <td>
                {/* Usar el componente TablaInsumosAction para las acciones */}
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
