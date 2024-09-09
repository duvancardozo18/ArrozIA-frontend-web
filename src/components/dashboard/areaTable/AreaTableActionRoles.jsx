import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineCog } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import EditRoleModal from "../../../screens/roles/EditRoleModal";  // Asegúrate de crear este componente
import DeleteModal from "../../../screens/roles/DeleteModal";  // Reutiliza el modal de confirmación de eliminación
import DeleteSuccessModal from "../../../screens/roles/DeleteSuccessModal";  // Asegúrate de crear este componente para roles
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

const AreaTableActionRoles = ({ role, onSave }) => {
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
      await axiosInstance.delete(`/roles/delete/${role.id}`);  // Cambia la URL a la que corresponde a roles
      setShowSuccessModal(true);  // Muestra el modal de éxito después de eliminar
      closeDeleteModal();  // Cierra el modal de eliminación
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    onSave(); // Refresca la tabla de roles después de cerrar el modal de éxito
  };

  const handlePermissions = () => {
    navigate('/roles/permissions', { state: { role } });  // Asegúrate de tener esta ruta y componente
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
      <PermissionButton onClick={handlePermissions}>
        <HiOutlineCog size={18} />
      </PermissionButton>

      {/* Modal de Edición para Roles */}
      <EditRoleModal
        show={showEditModal}
        closeModal={closeEditModal}
        role={role}
        onSave={onSave}
      />

      {/* Modal de Confirmación de Eliminación */}
      <DeleteModal
        show={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />

      {/* Modal de Éxito para Roles */}
      <DeleteSuccessModal
        show={showSuccessModal}
        closeModal={closeSuccessModal}
      />
    </div>
  );
};

export default AreaTableActionRoles;
