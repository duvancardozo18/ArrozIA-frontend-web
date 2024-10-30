import React, { useState } from "react";
import styled from "styled-components";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import ViewPhenologicalStageModal from "./ViewPhenologicalStageModal";
import EditPhenologicalStageModal from "./EditPhenologicalStageModal";
import DeleteModal from "../../modal/DeleteModal";
import SuccessModal from "../../modal/SuccessModal";
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

const TablePhenologicalStageAction = ({ stage, onSave }) => {
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
    try {
      await axiosInstance.delete(`/delete/phenological-stage/${stage.id}`);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al eliminar la etapa:", error);
    } finally {
      closeDeleteModal();
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    onSave(); // Refresca la tabla después de eliminar
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <ViewButton onClick={openViewModal}>
        <HiOutlineEye size={18} />
        Ver
      </ViewButton>

      <EditButton onClick={openEditModal}>
        <HiOutlinePencil size={18} />
        Editar
      </EditButton>

      <DeleteButton onClick={openDeleteModal}>
        <HiOutlineTrash size={18} />
        Eliminar
      </DeleteButton>

      {/* Modales */}
      <ViewPhenologicalStageModal
        show={showViewModal}
        closeModal={closeViewModal}
        stage={stage}
      />

      <EditPhenologicalStageModal
        show={showEditModal}
        closeModal={closeEditModal}
        stage={stage}
        onSave={onSave}
      />

      <DeleteModal
        show={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Eliminar Etapa Fenológica"
        message="¿Estás seguro de que deseas eliminar esta etapa fenológica? Esta acción no se puede deshacer."
        cancelText="No, cancelar"
        confirmText="Sí, eliminar"
      />

      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={closeSuccessModal}
          message="¡Etapa fenológica eliminada exitosamente!"
        />
      )}
    </div>
  );
};

export default TablePhenologicalStageAction;
