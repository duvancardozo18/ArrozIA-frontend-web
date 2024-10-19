import React, { useState, useEffect } from "react";
import "../../../../css/AgriculturalTables.scss";
import TablaVarietyAction from "./TableVarietyAction"; // Ajusta la ruta si es necesario
import axiosInstance from "../../../../config/AxiosInstance";

const RiceVarietiesTable = ({ refresh }) => {
  // Estado para almacenar las variedades
  const [varieties, setVarieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar las variedades desde la API cuando el componente se monta
  useEffect(() => {
    const fetchVarieties = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/list-varieties"); // Ajusta la ruta según el backend
        setVarieties(response.data); // Asumiendo que la respuesta es una lista de variedades
      } catch (error) {
        console.error("Error al cargar las variedades:", error);
        setError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVarieties();
  }, [refresh]); // Refresca los datos cuando `refresh` cambie

  if (loading) {
    return <p>Cargando variedades...</p>;
  }

  if (error) {
    return <p>{error}</p>;
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
                <td>{variety.nombre}</td> {/* Asume que 'nombre' está en la respuesta */}
                <td>{variety.numero_registro_productor_ica}</td> {/* Campo 'numero_registro_productor_ica' */}
                <td>
                  <TablaVarietyAction variety={variety} onSave={() => {}} />
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
