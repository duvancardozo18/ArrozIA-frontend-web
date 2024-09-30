import React, { useState, useEffect } from 'react';
import FarmCard from './FarmCard';
import AddIcon from '@mui/icons-material/Add';
import axiosInstance from '../../../config/AxiosInstance';
import NewFarm from '../../../components/dashboard/farms/CreateFarmModal';
import EditFarmModal from '../../../components/dashboard/farms/EditFarmModal';
import DeleteFarmModal from '../../dashboard/modal/DeleteModal'; // Importar el modal de eliminación

const FarmMain = ({ selectedFarm, setSelectedFarm, isDarkMode }) => {
  const [farms, setFarms] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado para abrir/cerrar modal de eliminación
  const [editingFarm, setEditingFarm] = useState(null);
  const [deletingFarm, setDeletingFarm] = useState(null); // Finca que se va a eliminar

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axiosInstance.get('/farms');
        setFarms(response.data);
      } catch (error) {
        console.error('Error fetching farms:', error);
      }
    };

    fetchFarms();
  }, []);

  const handleAddFarm = () => setIsAddModalOpen(true);

  const handleEditFarm = (farmToEdit) => {
    if (farmToEdit && farmToEdit.id) {
      setEditingFarm(farmToEdit);
      setIsEditModalOpen(true);
    } else {
      console.error('Failed to set the farm for editing: Farm ID is undefined.');
    }
  };

  const handleSaveFarm = (updatedFarm) => {
    setFarms(farms.map(farm => farm.id === updatedFarm.id ? updatedFarm : farm));
    setIsEditModalOpen(false);  // Cerrar el modal después de guardar
  };
  

  const handleDelete = async (farm_id) => {
    try {
      await axiosInstance.delete(`/delete/farm/${farm_id}`);
      setFarms(farms.filter(farm => farm.id !== farm_id)); // Actualiza la lista de fincas eliminando la seleccionada
      setIsDeleteModalOpen(false); // Cierra el modal después de eliminar
    } catch (error) {
      console.error('Error deleting farm:', error);
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

        {farms.map((farm) => (
          <FarmCard
          key={farm.id} // Usa el ID de la finca como clave única
          farm={farm}
          onDelete={() => confirmDeleteFarm(farm)} // Abre el modal de confirmación de eliminación
          onEdit={() => handleEditFarm(farm)} // Abre el modal de edición
          onNavigate={() => {
            console.log('Selected farm:', farm); // Aquí mostramos la finca seleccionada en la consola
            setSelectedFarm(farm); // Guardamos la finca seleccionada en el estado
          }}
          isSelected={selectedFarm && selectedFarm.id === farm.id} // Comparación para selección de finca
          isDarkMode={isDarkMode}
        />
        
        ))}

        <div className="add-farm" onClick={handleAddFarm}>
          <div>
            <AddIcon />
            <h3>Agregar Finca</h3>
          </div>
        </div>
      </div>

      {isAddModalOpen && 
      <NewFarm closeModal={() => setIsAddModalOpen(false)} />}

      {isEditModalOpen && editingFarm && (
        <EditFarmModal
        show={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        farm={editingFarm}
        onSave={handleSaveFarm}
      />
      
      )}

      {/* Modal para confirmar la eliminación de la finca */}
      {isDeleteModalOpen && deletingFarm && (
        <DeleteFarmModal
          show={isDeleteModalOpen} // Muestra el modal
          onClose={() => setIsDeleteModalOpen(false)} // Cierra el modal sin eliminar
          onConfirm={() => handleDelete(deletingFarm.id)} // Confirma la eliminación
        />
      )}

    </div>
  );
};

export default FarmMain;
