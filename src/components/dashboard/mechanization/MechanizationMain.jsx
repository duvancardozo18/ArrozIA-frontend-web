import React, { useState, useEffect } from "react";
import MechanizationCard from "./MechanizationCard";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from "../../../config/AxiosInstance";
import NewMechanizationModal from "./CreateMechanizationModal"; // Modal para agregar
import EditMechanizationModal from "./EditMechanizationModal"; // Modal para editar
import DeleteMechanizationModal from "../modal/DeleteModal"; // Modal para eliminar

const MechanizationMain = ({ selectedOperation, setSelectedOperation, isDarkMode }) => {
  const [operations, setOperations] = useState([]);

  // Estados para modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingOperation, setEditingOperation] = useState(null);
  const [deletingOperation, setDeletingOperation] = useState(null);

  useEffect(() => {
    // Simulación de llamada a la API
    const fetchData = async () => {
      try {
        setTimeout(() => {
          setOperations([
            {
              id: 1,
              taskId: 11,
              mechanizationName: "Nivelación de terreno",
              machineryId: 3,
              hoursUsed: 5.5,
            },
            {
              id: 2,
              taskId: 12,
              mechanizationName: "Siembra directa",
              machineryId: 2,
              hoursUsed: 4.0,
            },
            {
              id: 3,
              taskId: 13,
              mechanizationName: "Arado de terreno",
              machineryId: 1,
              hoursUsed: 6.0,
            },
            {
              id: 4,
              taskId: 14,
              mechanizationName: "Riego por aspersión",
              machineryId: 4,
              hoursUsed: 3.5,
            },
            {
              id: 5,
              taskId: 15,
              mechanizationName: "Cosecha mecanizada",
              machineryId: 5,
              hoursUsed: 7.0,
            },
          ]);
        }, 1000);
      } catch (error) {
        console.error("Error al obtener las operaciones de mecanización:", error);
      }
    };

    fetchData();
  }, []);

  // Funciones para manejar operaciones
  const fetchOperations = async () => {
    try {
      const response = await axiosInstance.get("/mechanization");
      setOperations(response.data);
    } catch (error) {
      console.error("Error fetching mechanization operations:", error);
    }
  };

  const handleAddOperation = () => setIsAddModalOpen(true);

  const addOperation = async () => {
    await fetchOperations();
    setIsAddModalOpen(false);
  };

  const handleEditOperation = (operationToEdit) => {
    setEditingOperation(operationToEdit);
    setIsEditModalOpen(true);
  };

  const handleSaveOperation = async () => {
    await fetchOperations();
    setIsEditModalOpen(false);
  };

  const handleDelete = async (operation_id) => {
    await axiosInstance.delete(`/mechanization/${operation_id}`);
    await fetchOperations();
    setIsDeleteModalOpen(false);
  };

  const confirmDeleteOperation = (operation) => {
    setDeletingOperation(operation);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="mechanization-container">
      <div className="layout">
        {/* Columna de la lista de operaciones */}
        <div className="operations-list">
          <div className="operations-header">
            <h2>Operaciones de Mecanización</h2>
            <button className="add-operation" onClick={handleAddOperation}>
              <AddIcon />
              Agregar Operación
            </button>
          </div>
  
          {/* Mapeo de tarjetas de mecanización */}
          {operations.map((operation) => (
            <MechanizationCard
              key={operation.id}
              operation={operation}
              onDelete={() => confirmDeleteOperation(operation)}
              onEdit={() => handleEditOperation(operation)}
              onNavigate={() => setSelectedOperation(operation)}
              isSelected={selectedOperation && selectedOperation.id === operation.id}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
  
        {/* Columna de detalles de la operación */}
        <div className="operation-details">
          {selectedOperation ? (
            <>
              <h3>Detalles de la Operación</h3>
              <p>ID: {selectedOperation.id}</p>
              <p>Nombre: {selectedOperation.mechanizationName}</p>
              <p>ID de maquinaria: {selectedOperation.machineryId}</p>
              <p>Horas Usadas: {selectedOperation.hoursUsed}</p>
              <div className="actions">
                <button className="edit-operation" onClick={() => handleEditOperation(selectedOperation)}>Editar Operación</button>
                <button className="delete-operation" onClick={() => confirmDeleteOperation(selectedOperation)}>Eliminar Operación</button>
              </div>
            </>
          ) : (
            <p>Seleccione una operación para ver los detalles</p>
          )}
        </div>
      </div>
  
      {/* Modales */}
      {isAddModalOpen && (
        <NewMechanizationModal closeModal={() => setIsAddModalOpen(false)} addOperation={addOperation} />
      )}
  
      {isEditModalOpen && editingOperation && (
        <EditMechanizationModal
          show={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
          operation={editingOperation}
          onSave={handleSaveOperation}
        />
      )}
  
      {isDeleteModalOpen && deletingOperation && (
        <DeleteMechanizationModal
          show={isDeleteModalOpen}
          title="Eliminar Operación"
          message="¿Estás seguro que deseas eliminar la operación? Esta acción no se puede deshacer."
          cancelText="No, cancelar"
          confirmText="Sí, eliminar"
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => handleDelete(deletingOperation.id)}
        />
      )}
    </div>
  );
  
};

export default MechanizationMain;
