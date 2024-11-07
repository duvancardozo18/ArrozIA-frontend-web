import React, { useContext, useState, useEffect } from "react";
import FarmCard from "./FarmCard";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from "../../../config/AxiosInstance";
import NewFarm from "../../../components/dashboard/farms/CreateFarmModal";
import EditFarmModal from "../../../components/dashboard/farms/EditFarmModal";
import DeleteFarmModal from "../../dashboard/modal/DeleteModal";
import { AuthContext } from "../../../config/AuthProvider"; 

const FarmMain = ({ selectedFarm, setSelectedFarm, isDarkMode }) => {
  const [farms, setFarms] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // Nuevo estado para saber si el usuario es administrador
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [deletingFarm, setDeletingFarm] = useState(null);

  // Verificar permisos
  const { userId, permissions } = useContext(AuthContext); 
  const hasPermission = (permission) => permissions.includes(permission);

  // Función para verificar si el usuario es administrador
  const checkIfAdmin = async () => {
    try {
      const response = await axiosInstance.get(`/users/${userId}/is_admin`);
      setIsAdmin(response.data.is_admin); // Establecer estado de administrador
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  // Función para obtener las fincas según el rol del usuario
  const fetchFarms = async () => {
    try {
      const url = isAdmin ? "/farms" : `/users/${userId}/farms`; // Elegir la ruta según si es administrador o no
      const response = await axiosInstance.get(url);
      setFarms(response.data);
    } catch (error) {
      console.error("Error fetching farms:", error);
    }
  };

  useEffect(() => {
    checkIfAdmin(); // Verificar si el usuario es administrador al cargar el componente
  }, []);

  useEffect(() => {
    if (isAdmin !== null) { // Esperar a que se determine el rol del usuario
      fetchFarms();
    }
  }, [isAdmin]);

  const handleAddFarm = () => setIsAddModalOpen(true);

  const addFarm = async () => {
    try {
      await fetchFarms();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error fetching farms after adding a new one:", error);
    }
  };

  const handleEditFarm = (farmToEdit) => {
    if (farmToEdit && farmToEdit.id) {
      setEditingFarm(farmToEdit);
      setIsEditModalOpen(true);
    } else {
      console.error("Failed to set the farm for editing: Farm ID is undefined.");
    }
  };

  const handleSaveFarm = async (updatedFarm) => {
    try {
      await fetchFarms();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error fetching farms after updating:", error);
    }
  };

  const handleDelete = async (farm_id) => {
    try {
      await axiosInstance.delete(`/delete/farm/${farm_id}`);
      await fetchFarms();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting farm:", error);
    }
  };

  const confirmDeleteFarm = (farm) => {
    setDeletingFarm(farm);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="right-section">
      <div className="farms">
        <div className="header">
          <h2>Fincas</h2>
        </div>

        {hasPermission("crear_finca") && (
          <div className="add-farm" onClick={handleAddFarm}>
            <div>
              <AddIcon />
              <h3>Agregar Finca</h3>
            </div>
          </div>
        )}

        {farms.map((farm, index) => (
          <FarmCard
            key={farm.id || index}
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
          addFarm={addFarm}
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
