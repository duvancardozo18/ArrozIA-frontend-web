// LaborCultural.js
import React, { useState, useEffect } from 'react';
import CreateLaborModal from './LaborCultural/CreateLaborModal';
import LaborCulturalTable from './LaborCultural/LaborCulturalTable';
import axiosInstance from "../../../config/AxiosInstance";

const LaborCultural = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [labores, setLabores] = useState([]); // Estado centralizado para almacenar las labores culturales

  // Función para obtener las labores culturales
  const fetchLabores = async () => {
    try {
      const response = await axiosInstance.get('/labor-cultural/read');
      setLabores(response.data);
    } catch (error) {
      console.error("Error al cargar labores culturales:", error);
    }
  };

  useEffect(() => {
    fetchLabores();
  }, []);

  const handleOpenModal = () => setShowCreateModal(true);
  const handleCloseModal = () => setShowCreateModal(false);

  // Función para agregar una nueva labor a la lista
  const handleAddLabor = (newLabor) => {
    setLabores((prevLabores) => [...prevLabores, newLabor]);
    handleCloseModal(); // Cierra el modal después de crear
  };

  // Función para actualizar una labor editada
  const handleEditLabor = (updatedLabor) => {
    setLabores((prevLabores) =>
      prevLabores.map((labor) =>
        labor.id === updatedLabor.id ? { ...labor, ...updatedLabor } : labor
      )
    );
  };

  // Función para eliminar una labor de la lista
  const handleDeleteLabor = (id) => {
    setLabores((prevLabores) => prevLabores.filter((labor) => labor.id !== id));
  };

  return (
    <div>
      <h2>Gestión de Labor Cultural</h2>
      <button className="btn-create-labor" onClick={handleOpenModal}>
        Crear labor cultural
      </button>

      {showCreateModal && (
        <CreateLaborModal onClose={handleCloseModal} onSave={handleAddLabor} />
      )}

      <LaborCulturalTable
        labores={labores}
        onEditLabor={handleEditLabor}
        onDeleteLabor={handleDeleteLabor}
      />
    </div>
  );
};

export default LaborCultural;
