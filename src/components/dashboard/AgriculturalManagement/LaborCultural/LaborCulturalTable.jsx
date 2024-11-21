import React, { useState, useEffect } from "react";
import "../../../../css/AgriculturalTables.scss";
import axiosInstance from "../../../../config/AxiosInstance";
import TableLaborAction from "./TableLaborAction";
import CreateLaborModal from "./CreateLaborModal";
import EditLaborModal from "./EditLaborModal";
import ViewLaborModal from "./ViewLaborModal";
import SuccessModal from "../../modal/SuccessModal";

const LaborCulturalTable = () => {
  const [labores, setLabores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLabor, setSelectedLabor] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [refresh, setRefresh] = useState(false); // Agregado: Controla el refresco de la tabla
  const [phenologicalStages, setPhenologicalStages] = useState([]);

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

  // Fetch phenological stages
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
  }, [refresh]); // Cambiará cuando `refresh` cambie, forzando la recarga

  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleShowEditModal = (labor) => {
    setSelectedLabor(labor);
    setShowEditModal(true);
  };
  const handleShowViewModal = (labor) => {
    setSelectedLabor(labor);
    setShowViewModal(true);
  };

  const handleCreateLabor = () => {
    setSuccessMessage("¡Labor cultural creada exitosamente!");
    setShowSuccessModal(true);
    setShowCreateModal(false);
    setRefresh((prev) => !prev); // Cambia el estado para refrescar la tabla
  };

  const handleEditLabor = () => {
    setShowEditModal(false);
    setSuccessMessage("¡Labor cultural editada exitosamente!");
    setShowSuccessModal(true);
    setRefresh((prev) => !prev); // Cambia el estado para refrescar la tabla
  };

  const handleDeleteLabor = () => {
    setSuccessMessage("¡Labor cultural eliminada exitosamente!");
    setShowSuccessModal(true);
    setRefresh((prev) => !prev); // Cambia el estado para refrescar la tabla
  };

  const getPhenologicalStageName = (id) => {
    const stage = phenologicalStages.find((stage) => stage.id === id);
    return stage ? stage.nombre : "N/A";
  };

  if (loading) return <div>Cargando labores culturales...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio Hectaria</th>
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
                <td>{labor.precio_hectaria}</td>
                <td>{getPhenologicalStageName(labor.id_etapa_fenologica)}</td>
                <td>
                  <TableLaborAction
                    labor={labor}
                    onEdit={() => handleShowEditModal(labor)}
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
          onSave={handleCreateLabor} // Actualiza el estado para refrescar
        />
      )}
      {showEditModal && selectedLabor && (
        <EditLaborModal
          labor={selectedLabor}
          closeModal={() => setShowEditModal(false)}
          onSave={handleEditLabor} // Actualiza el estado para refrescar
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
