import React, { useState, useEffect } from "react";
import "../../../../css/AgriculturalTables.scss";
import axiosInstance from "../../../../config/AxiosInstance";
import TableCulturalWorkAction from "./TableCulturalWorkAction"; // Adjust the path if necessary

const CulturalWorkTable = ({ refresh }) => {
  // State for storing the cultural works fetched from the backend
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Function to fetch cultural works from the backend
  const fetchCulturalWorks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axiosInstance.get("/list-cultural-works"); // Make sure this route matches your backend
      console.log("Data received from backend:", response.data); // To debug and verify the data
      setWorks(response.data); // Set the cultural works data to your state
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cultural works:", error);
      setError("There was a problem loading the cultural works.");
      setLoading(false);
    }
  };

  // Hook to fetch cultural works when the component mounts and when `refresh` changes
  useEffect(() => {
    fetchCulturalWorks();
  }, [refresh]); // Re-fetch cultural works when the value of `refresh` changes

  if (loading) {
    return <div>Cargando labores culturales...</div>;
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {works.length > 0 ? (
            works.map((work) => (
              <tr key={work.id}> {/* Use the id of the cultural work */}
                <td>{work.name}</td> {/* Adjust the field according to your data */}
                <td>{work.description}</td> {/* Adjust this field if necessary */}
                <td>
                  {/* Use the TableCulturalWorkAction component for actions */}
                  <TableCulturalWorkAction work={work} onSave={fetchCulturalWorks} />
                </td>
              </tr>
            ))
          ) : (
            <tr>s
              <td colSpan="3">No se encontraron labores culturales</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CulturalWorkTable;
