import React, { useState, useEffect } from "react";
import "../../../../css/AgriculturalTables.scss";
import axiosInstance from "../../../../config/AxiosInstance";
import TableMachineryAction from "./TableMachineryAction"; // Ajusta la ruta si es necesario

const MachineryTable = ({ refresh }) => {
  // Estado para almacenar la maquinaria obtenida del backend
  const [machineries, setMachineries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Función para obtener la maquinaria desde el backend
  const fetchMachineries = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axiosInstance.get("/machineries"); // Asegúrate de que esta ruta coincide con tu backend
      console.log("Datos recibidos del backend:", response.data); // Para depurar y verificar los datos
      setMachineries(response.data); // Asigna los datos de la maquinaria a tu estado
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener la maquinaria:", error);
      setError("Hubo un problema al cargar la maquinaria.");
      setLoading(false);
    }
  };

  // Hook para obtener la maquinaria al cargar el componente y cuando cambie `refresh`
  useEffect(() => {
    fetchMachineries();
  }, [refresh]); // Volver a obtener la maquinaria cuando cambie el valor de `refresh`

  if (loading) {
    return <div>Cargando maquinaria...</div>;
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
            <th>Descripción</th>
            <th>Costo por Hora</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {machineries.map((machinery) => (
            <tr key={machinery.id}>
              <td>{machinery.name}</td>
              <td>{machinery.description}</td>
              <td>{machinery.costPerHour}</td>
              <td>
                {/* Usar el componente TableMachineryAction para las acciones */}
                <TableMachineryAction machinery={machinery} onSave={fetchMachineries} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MachineryTable;
