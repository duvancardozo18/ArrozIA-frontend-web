import React, { useState, useEffect } from "react"; 
import "../../../../css/AgriculturalTables.scss";
import axiosInstance from "../../../../config/AxiosInstance";
import TableMechanizationAction from "./TableMechanizationAction"; // Adjust path if necessary

const MechanizationOperationsTable = ({ refresh }) => {
  // State to store mechanization operations and related data
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Function to fetch mechanization operations including related task labor and machinery data
  const fetchOperations = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axiosInstance.get("/operation-mechanizations/"); // Ensure this route matches your backend
      console.log("Data received from the backend:", response.data); // For debugging and verifying the data
      setOperations(response.data); // Assign the retrieved operations to your state
      setLoading(false);
    } catch (error) {
      console.error("Error fetching mechanization operations:", error);
      setError("There was a problem loading the mechanization operations.");
      setLoading(false);
    }
  };

  // Hook to fetch the operations when the component loads and when `refresh` changes
  useEffect(() => {
    fetchOperations();
  }, [refresh]); // Refetch the operations when the `refresh` value changes

  if (loading) {
    return <div>Loading mechanization operations...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Labor de la Tarea</th>
            <th>Nombre de Mecanización</th>
            <th>Maquinaria</th>
            <th>Horas de Uso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {operations.length > 0 ? (
            operations.map((operation) => (
              <tr key={operation.id}>
                <td>{operation.task?.descripcion || "Tarea Labor Desconocida"}</td>
                <td>{operation.mechanizationName}</td>
                <td>{operation.machinery?.nombre || "Maquinaria Desconocida"}</td>
                <td>{operation.hoursUsed}</td>
                <td>
                  <TableMechanizationAction operation={operation} onSave={fetchOperations} />
                </td>
              </tr>

            ))
          ) : (
            <tr>
              <td colSpan="5">No se encontraron operaciones de mecanización</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MechanizationOperationsTable;
