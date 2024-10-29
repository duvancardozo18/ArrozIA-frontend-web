import React, { useState } from "react";
import styled from "styled-components";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import EditModal from "../../dashboard/users/EditUserModal";
import DeleteModal from "../modal/DeleteModal";
import SuccessModal from "../modal/SuccessModal"; 
import LaborCulturalList from "../../dashboard/users/LaborCulturalList"; // Importa el modal de lista de labores culturales
import axiosInstance from "../../../config/AxiosInstance";

const ActionButton = styled.button`
  padding: 10px 15px;
  margin: 0 5px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  color: white;
  background-color: #333;
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    opacity: 0.9;
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }
`;

const EditButton = styled(ActionButton)`
  background-color: #3498db;
`;

const DeleteButton = styled(ActionButton)`
  background-color: #e74c3c;
`;

const LaborCulturalButton = styled(ActionButton)`
  background-color: #28a745; /* Color verde */
`;

const AreaTableAction = ({ user, onSave }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLaborListModal, setShowLaborListModal] = useState(false); // Estado para modal de lista de labores culturales

  const openEditModal = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const openLaborListModal = () => setShowLaborListModal(true); // Abre el modal de lista de labores
  const closeLaborListModal = () => setShowLaborListModal(false); // Cierra el modal de lista de labores culturales

  const handleDelete = async () => {
    try {
      closeDeleteModal();
      await axiosInstance.delete(`/users/delete/${user.id}`);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    onSave();
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <EditButton onClick={openEditModal}>
        <HiOutlinePencil size={18} />
        Editar
      </EditButton>
      <DeleteButton onClick={openDeleteModal}>
        <HiOutlineTrash size={18} />
        Eliminar
      </DeleteButton>

      {/* Modal de Edición */}
      <EditModal
        show={showEditModal}
        closeModal={closeEditModal}
        user={user}
        onSave={onSave}
      />

      {/* Modal de Confirmación de Eliminación */}
      <DeleteModal
        show={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Eliminar Usuario"
        message="¿Estás seguro que deseas eliminar el Usuario? Esta acción no se puede deshacer."
        cancelText="No, cancelar"
        confirmText="Sí, eliminar"
      />

      {/* Modal de Lista de Labores Culturales */}
      {showLaborListModal && (
        <LaborCulturalList
          userId={user.id} // Pasa el ID del usuario
          closeModal={closeLaborListModal}
          onSave={onSave}
        />
      )}

      {/* Modal de Éxito */}
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={closeSuccessModal}
          message="¡Usuario Eliminado!"
        />
      )}
    </div>
  );
};

export default AreaTableAction;
