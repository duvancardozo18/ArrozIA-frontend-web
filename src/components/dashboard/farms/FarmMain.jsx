import React, { useState, useEffect } from "react";
import FarmCard from "./FarmCard";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from "../../../config/AxiosInstance";
import NewFarm from "../../../components/dashboard/farms/CreateFarmModal";
import EditFarmModal from "../../../components/dashboard/farms/EditFarmModal";
import DeleteFarmModal from "../../dashboard/modal/DeleteModal";

const FarmMain = ({ selectedFarm, setSelectedFarm, isDarkMode }) => {
  const [farms, setFarms] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [deletingFarm, setDeletingFarm] = useState(null);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axiosInstance.get("/farms");
        setFarms(response.data);
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    };

    fetchFarms();
  }, []);

  const handleAddFarm = () => setIsAddModalOpen(true);

  // Función para agregar nueva finca al estado
  const addFarm = (newFarm) => {
    setFarms([...farms, newFarm]);
    setIsAddModalOpen(false);
  };

  const handleEditFarm = (farmToEdit) => {
    if (farmToEdit && farmToEdit.id) {
      setEditingFarm(farmToEdit);
      setIsEditModalOpen(true);
    } else {
      console.error(
        "Failed to set the farm for editing: Farm ID is undefined."
      );
    }
  };

  const handleSaveFarm = (updatedFarm) => {
    setFarms(
      farms.map((farm) => (farm.id === updatedFarm.id ? updatedFarm : farm))
    );
    setIsEditModalOpen(false); // Cerrar el modal después de guardar
  };

  const handleDelete = async (farm_id) => {
    try {
      await axiosInstance.delete(`/delete/farm/${farm_id}`);
      setFarms(farms.filter((farm) => farm.id !== farm_id)); // Actualiza la lista de fincas eliminando la seleccionada
      setIsDeleteModalOpen(false); // Cierra el modal después de eliminar
    } catch (error) {
      console.error("Error deleting farm:", error);
    }
  };

  const confirmDeleteFarm = (farm) => {
    setDeletingFarm(farm); // Guarda la finca que se va a eliminar
    setIsDeleteModalOpen(true); // Abre el modal de confirmación de eliminación
  };

  return (
    <div className="right-section">
      <div className="farms">
        <div className="header">
          <h2>Fincas</h2>
        </div>

        <div className="add-farm" onClick={handleAddFarm}>
          <div>
            <AddIcon />
            <h3>Agregar Finca</h3>
          </div>
        </div>

        {farms.map((farm, index) => (
          <FarmCard
            key={farm.id || index} // Usa el índice solo si `farm.id` no está disponible
            farm={farm}
            onDelete={() => confirmDeleteFarm(farm)}
            onEdit={() => handleEditFarm(farm)}
            onNavigate={() => setSelectedFarm(farm)}
            isSelected={selectedFarm && selectedFarm.id === farm.id}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>

      {isAddModalOpen && (
        <NewFarm
          closeModal={() => setIsAddModalOpen(false)}
          addFarm={addFarm} // Pasar la función para agregar la finca
        />
      )}

      {isEditModalOpen && editingFarm && (
        <EditFarmModal
          show={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
          farm={editingFarm}
          onSave={handleSaveFarm}
        />
      )}

      {isDeleteModalOpen && deletingFarm && (
        <DeleteFarmModal
          show={isDeleteModalOpen}
          title="Eliminar Finca"
          message="¿Estás seguro que deseas eliminar la finca? Esta acción no se puede deshacer."
          cancelText="No, cancelar"
          confirmText="Sí, eliminar"
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => handleDelete(deletingFarm.id)}
        />
      )}
    </div>
  );
};

export default FarmMain;
