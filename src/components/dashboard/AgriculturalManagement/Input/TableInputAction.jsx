import React, { useState } from "react";
import styled from "styled-components";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import EditInsumoModal from "./EditInputModal"; // Importa el modal de edición de insumo
import DeleteModal from "../../modal/DeleteModal";
import SuccessModal from "../../modal/SuccessModal";
import ViewInsumoModal from "./ViewInputModal"; // Importa el modal de visualización de insumo
import axiosInstance from "../../../../config/AxiosInstance";

// Estilos para los botones de acción
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

const ViewButton = styled(ActionButton)`
  background-color: #2ecc71;
`;

const EditButton = styled(ActionButton)`
  background-color: #3498db;
`;

const DeleteButton = styled(ActionButton)`
  background-color: #e74c3c;
`;

const TablaInsumosAction = ({ insumo, onSave }) => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const openViewModal = () => setShowViewModal(true);
  const closeViewModal = () => setShowViewModal(false);

  const openEditModal = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleDelete = async () => {
    console.log("Insumo a eliminar:", insumo); // Agregar para verificar el insumo

    try {
      closeDeleteModal();
      if (insumo && insumo.id) {
        // Asegurarse de que el insumo y su id están definidos
        const response = await axiosInstance.delete(`/delete/input/${insumo.id}`);
        if (response.status === 200) {
          setShowSuccessModal(true); // Mostrar modal de éxito si se elimina correctamente
        } else {
          console.error("No se pudo eliminar el insumo, error:", response);
        }
      } else {
        console.error("El ID del insumo es undefined o no existe");
      }
    } catch (error) {
      console.error("Error al eliminar el insumo:", error);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    onSave(); // Refresca la tabla después de eliminar
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* Botón de Ver */}
      <ViewButton onClick={openViewModal}>
        <HiOutlineEye size={18} />
        Ver
      </ViewButton>

      {/* Botón de Edición */}
      <EditButton onClick={openEditModal}>
        <HiOutlinePencil size={18} />
        Editar
      </EditButton>

      {/* Botón de Eliminación */}
      <DeleteButton onClick={openDeleteModal}>
        <HiOutlineTrash size={18} />
        Eliminar
      </DeleteButton>

      {/* Modal de Visualización */}
      <ViewInsumoModal
        show={showViewModal}
        closeModal={closeViewModal}
        insumo={insumo}
      />

      {/* Modal de Edición */}
      <EditInsumoModal
        show={showEditModal}
        closeModal={closeEditModal}
        insumo={insumo}
        onSave={onSave}
      />

      {/* Modal de Confirmación de Eliminación */}
      <DeleteModal
        show={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Eliminar Insumo"
        message="¿Estás seguro que deseas eliminar este insumo? Esta acción no se puede deshacer."
        cancelText="No, cancelar"
        confirmText="Sí, eliminar"
      />

      {/* Modal de Éxito */}
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={closeSuccessModal}
          message="¡Insumo eliminado exitosamente!"
        />
      )}
    </div>
  );
};

export default TablaInsumosAction;
