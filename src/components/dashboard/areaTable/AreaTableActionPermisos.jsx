import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
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

const AreaTableActionPermisos = ({ permiso, onSave }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const openEditModal = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/permisos/${permiso.id}`);
      setShowSuccessModal(true);
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting permiso:", error);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    onSave(); // Refresca la tabla de permisos después de cerrar el modal de éxito
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

      {/* Aquí deberías agregar los modales de edición y eliminación, como en el caso de los roles */}
    </div>
  );
};

export default AreaTableActionPermisos;
