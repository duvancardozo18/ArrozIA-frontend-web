import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import EditRoleModal from "../../modal/EditRolModal";
import DeleteModal from "../../modal/DeleteModal";
import DeleteSuccessModal from "../../modal/SuccessModal";
import axiosInstance from "../../../config/AxiosInstance";

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
  transition: transform 0.3s ease, background-color 0.3s ease,
    box-shadow 0.2s ease;

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const openEditModal = () => {
    if (role && role.id) {
      console.log("Opening edit modal for role:", role);
      setShowEditModal(true);
    } else {
      console.error(
        "No se pudo abrir el modal de edición: ID de rol indefinido."
      );
    }
  };

  const closeEditModal = () => setShowEditModal(false);

  const openDeleteModal = () => {
    if (role && role.id) {
      console.log("Opening delete modal for role:", role);
      setShowDeleteModal(true);
    } else {
      console.error(
        "No se pudo abrir el modal de eliminación: ID de rol indefinido."
      );
    }
  };

  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleDelete = async () => {
    if (!role || !role.id) {
      console.error("No se pudo eliminar el rol: ID de rol indefinido.");
      return;
    }

    try {
      console.log(`DELETE /roles/${role.id}`);
      const response = await axiosInstance.delete(`/roles/${role.id}`);
      console.log("Rol eliminado correctamente:", response.data);
      setShowSuccessModal(true);
      closeDeleteModal();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          console.error("Rol no encontrado o ya eliminado.");
          alert("Error: El rol no fue encontrado o ya ha sido eliminado.");
        } else if (error.response.status === 400) {
          console.error(
            "No se puede eliminar el rol debido a registros relacionados."
          );
          alert(
            "Error: No se puede eliminar el rol debido a registros relacionados."
          );
        } else {
          console.error("Error al eliminar el rol:", error.response.data);
          alert("Error: Hubo un problema al eliminar el rol.");
        }
      } else {
        console.error("Error al eliminar el rol:", error.message);
        alert("Error: Rol asignado a usuarios");
      }
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    onSave();
    window.location.reload(); // Refresca la página al cerrar el modal
  };

  const handlePermissions = () => {
    navigate("/roles/permissions", { state: { role } });
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

      {/* Modal de Edición para Roles */}
      {showEditModal && (
        <EditRoleModal
          show={showEditModal}
          closeModal={closeEditModal}
          role={role}
          onSave={onSave}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && (
        <DeleteModal
          show={showDeleteModal}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          title="Eliminar Rol"
          message="¿Estás seguro de que deseas eliminar el Rol? Esta acción no se puede deshacer."
          cancelText="No, cancelar"
          confirmText="Sí, eliminar"
        />
      )}

      {/* Modal de Éxito para Roles */}
      {showSuccessModal && (
        <DeleteSuccessModal
          show={showSuccessModal}
          onClose={closeSuccessModal}
          message="¡Rol Eliminado!"
        />
      )}
    </div>
  );
};

export default AreaTableActionRoles;
