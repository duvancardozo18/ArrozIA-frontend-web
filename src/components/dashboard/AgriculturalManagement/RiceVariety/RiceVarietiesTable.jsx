import React, { useState, useEffect } from "react";
import "../../../../css/AgriculturalTables.css";
import axiosInstance from "../../../../config/AxiosInstance";
import TablaVarietyAction from "./TableVarietyAction"; // Ajusta la ruta si es necesario

const RiceVarietiesTable = ({ refresh }) => {
  // Estado para almacenar las variedades obtenidas del backend
  const [varieties, setVarieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Función para obtener las variedades desde el backend
  const fetchVarieties = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axiosInstance.get("/list-varieties"); // Asegúrate de que esta ruta coincide con tu backend
      //console.log("Datos recibidos del backend:", response.data); // Para depurar y verificar los datos
      setVarieties(response.data); // Asigna los datos de las variedades a tu estado
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener las variedades:", error);
      setError("Hubo un problema al cargar las variedades.");
      setLoading(false);
    }
  };

  // Hook para obtener las variedades al cargar el componente y cuando cambie `refresh`
  useEffect(() => {
    fetchVarieties();
  }, [refresh]); // Volver a obtener las variedades cuando cambie el valor de `refresh`

  if (loading) {
    return <div>Cargando variedades...</div>;
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
            <th>Registro ICA</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {varieties.length > 0 ? (
            varieties.map((variety) => (
              <tr key={variety.id}>
                <td>{variety.nombre}</td>
                <td>{variety.numero_registro_productor_ica}</td>
                <td>
                  <TablaVarietyAction variety={variety} onSave={fetchVarieties} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No se encontraron variedades de arroz</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RiceVarietiesTable;
