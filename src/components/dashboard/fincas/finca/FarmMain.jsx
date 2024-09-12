import React, { useState, useEffect } from 'react';
import FarmCard from './FarmCard';
import AddIcon from '@mui/icons-material/Add';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import axiosInstance from '../../../../config/AxiosInstance';
import NewFarm from '../../../../screens/farm/NewFarm';
import EditFarmModal from '../../../../screens/farm/EditFarmModal';
import DeleteFarmModal from '../../../../screens/farm/DeleteFarmModal';

const FarmMain = ({ fincaSeleccionada, setFincaSeleccionada, isDarkMode }) => {
  const [fincas, setFincas] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingFinca, setEditingFinca] = useState(null);
  const [deletingFinca, setDeletingFinca] = useState(null);

  useEffect(() => {
    const fetchFincas = async () => {
      try {
        const response = await axiosInstance.get('/farms');
        setFincas(response.data);
      } catch (error) {
        console.error('Error fetching fincas:', error);
      }
    };

    fetchFincas();
  }, []);

  const handleAddFinca = () => setIsAddModalOpen(true);

  const handleEditFinca = (fincaToEdit) => {
    setEditingFinca(fincaToEdit);
    setIsEditModalOpen(true);
  };

  const handleDeleteFinca = async (farm_id) => {
    try {
      await axiosInstance.delete(`/delete/farm/${farm_id}`);
      setFincas(fincas.filter(finca => finca.id !== farm_id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting finca:', error);
    }
  };

  const confirmDeleteFinca = (finca) => {
    setDeletingFinca(finca);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="right-section">
      <div className="farms">
        <div className="header">
          <h2>Fincas</h2>
          
        </div>

        {fincas.map((finca) => (
          <FarmCard
            key={finca.id} // Usa el ID de la finca como clave única
            finca={finca}
            onDelete={() => confirmDeleteFinca(finca)}
            onEdit={() => handleEditFinca(finca)}
            onNavigate={() => setFincaSeleccionada(finca)}
            isSelected={fincaSeleccionada && fincaSeleccionada.id === finca.id}
            isDarkMode={isDarkMode}
          />
        ))}


        <div className="add-farm" onClick={handleAddFinca}>
          <div>
            <AddIcon />
            <h3>Agregar Finca</h3>
          </div>
        </div>
      </div>

      {isAddModalOpen && <NewFarm closeModal={() => setIsAddModalOpen(false)} />}
      {isEditModalOpen && (
        <EditFarmModal
          show={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
          finca={editingFinca}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteFarmModal
          show={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => handleDeleteFinca(deletingFinca.id)}
        />
      )}
    </div>
  );
};

export default FarmMain;
