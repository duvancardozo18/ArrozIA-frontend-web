import React, { useState, useEffect } from "react";
import "../../../../css/AgriculturalTables.scss";
import axiosInstance from "../../../../config/AxiosInstance";
import TableLaborAction from "./TableLaborAction";
import CreateLaborModal from "./CreateLaborModal";
import EditLaborModal from "./EditLaborModal";
import ViewLaborModal from "./ViewLaborModal";
import SuccessModal from "../../modal/SuccessModal";

const LaborCulturalTable = ({ refresh }) => {
  const [labores, setLabores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLabor, setSelectedLabor] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [phenologicalStages, setPhenologicalStages] = useState([]); // Almacena las etapas fenológicas

  // Function to fetch labores culturales data
  const fetchLabores = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/labor-cultural/read");
      setLabores(response.data);
    } catch (error) {
      console.error("Error al cargar labores culturales:", error);
      setError("Hubo un problema al cargar las labores culturales.");
    } finally {
      setLoading(false);
    }
  };

  // Fetches phenological stages to map names to their IDs
  const fetchPhenologicalStages = async () => {
    try {
      const response = await axiosInstance.get("/phenological-stages");
      setPhenologicalStages(response.data);
    } catch (error) {
      console.error("Error al cargar las etapas fenológicas:", error);
    }
  };

  useEffect(() => {
    fetchLabores();
    fetchPhenologicalStages();
  }, [refresh]);

  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleShowEditModal = (labor) => {
    setSelectedLabor(labor);
    setShowEditModal(true);
  };
  const handleShowViewModal = (labor) => {
    setSelectedLabor(labor);
    setShowViewModal(true);
  };

  const handleCreateLabor = (newLabor) => {
    setLabores((prevLabores) => [newLabor, ...prevLabores]);
    setSuccessMessage("¡Labor cultural creada exitosamente!");
    setShowSuccessModal(true);
    setShowCreateModal(false);
  };

  const handleEditLabor = (updatedLabor) => {
    setLabores((prevLabores) =>
      prevLabores.map((labor) => (labor.id === updatedLabor.id ? updatedLabor : labor))
    );
    setShowEditModal(false);
    setSuccessMessage("¡Labor cultural editada exitosamente!");
    setShowSuccessModal(true);
  };

  const handleDeleteLabor = (deletedLaborId) => {
    setLabores((prevLabores) => prevLabores.filter((labor) => labor.id !== deletedLaborId));
    setSuccessMessage("¡Labor cultural eliminada exitosamente!");
    setShowSuccessModal(true);
  };

  // Helper to get the name of the phenological stage by ID
  const getPhenologicalStageName = (id) => {
    const stage = phenologicalStages.find((stage) => stage.id === id);
    return stage ? stage.nombre : "N/A";
  };

  if (loading) return <div>Cargando labores culturales...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="table-container" style={{ width: "100%", overflowX: "auto" }}>
      <table className="table" style={{ width: "100%", minWidth: "600px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio Hora Real</th>
            <th>Etapa Fenológica</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {labores.length > 0 ? (
            labores.map((labor) => (
              <tr key={labor.id}>
                <td>{labor.nombre}</td>
                <td>{labor.descripcion}</td>
                <td>{labor.precio_hora_real}</td>
                <td>{getPhenologicalStageName(labor.etapa_fenologica_id)}</td>
                <td>
                  <TableLaborAction
                    labor={labor}
                    onEdit={handleEditLabor}
                    onDelete={() => handleDeleteLabor(labor.id)}
                    onView={() => handleShowViewModal(labor)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No se encontraron labores culturales</td>
            </tr>
          )}
        </tbody>
      </table>

      {showCreateModal && (
        <CreateLaborModal
          closeModal={() => setShowCreateModal(false)}
          onSave={handleCreateLabor}
        />
      )}
      {showEditModal && selectedLabor && (
        <EditLaborModal
          labor={selectedLabor}
          closeModal={() => setShowEditModal(false)}
          onSave={handleEditLabor}
        />
      )}
      {showViewModal && selectedLabor && (
        <ViewLaborModal labor={selectedLabor} closeModal={() => setShowViewModal(false)} />
      )}

      {showSuccessModal && (
        <SuccessModal
          onClose={() => setShowSuccessModal(false)}
          message={successMessage}
        />
      )}
    </div>
  );
};

export default LaborCulturalTable;
