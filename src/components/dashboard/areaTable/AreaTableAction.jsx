import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineCog } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import EditModal from "../../../screens/users/EditModal";
import DeleteModal from "../../../screens/users/DeleteModal";
import DeleteSuccessModal from "../../../screens/users/DeleteSuccessModal";  // Asegúrate de que la ruta sea correcta
import axiosInstance from '../../../config/AxiosInstance';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

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

const PermissionButton = styled(ActionButton)`
  background-color: #f39c12;
  border-radius: 50%; 
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: #e67e22;
    transform: scale(1.1) translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
  }

  &:hover svg {
    animation: ${rotate} 1s linear infinite;
  }
`;

const AreaTableAction = ({ user, onSave }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);  // Estado para manejar el modal de éxito
  const navigate = useNavigate();

  const openEditModal = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/users/delete/${user.id}`);
      setShowSuccessModal(true);  // Muestra el modal de éxito después de eliminar
      closeDeleteModal();  // Cierra el modal de eliminación
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    onSave(); // Refresca la tabla de usuarios después de cerrar el modal de éxito
  };

  const handlePermissions = () => {
    navigate('/permisos', { state: { user } });
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
      />

      {/* Modal de Éxito */}
      <DeleteSuccessModal
        show={showSuccessModal}
        closeModal={closeSuccessModal}
      />
    </div>
  );
};

export default AreaTableAction;
