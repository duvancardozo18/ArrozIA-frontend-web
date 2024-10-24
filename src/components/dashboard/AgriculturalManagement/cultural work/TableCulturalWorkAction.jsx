import React, { useState } from "react";
import styled from "styled-components";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import EditCulturalWorkModal from "./EditCulturalWorkModal";
import DeleteModal from "../../modal/DeleteModal";
import SuccessModal from "../../modal/SuccessModal";
import ViewCulturalWorkModal from "./ViewCulturalWork"; // Import the view modal for cultural work
import axiosInstance from "../../../../config/AxiosInstance";

// Styled action buttons
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

const TableCulturalWorkAction = ({ work, onSave }) => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const openViewModal = () => setShowViewModal(true);
  const closeViewModal = () => setShowViewModal(false);

  const openEditModal = () => setShowEditModal(true);
  const closeEditModal = () => {
    setShowEditModal(false);
    onSave(); // Refresh the table after closing the edit modal
  };

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleDelete = async () => {
    try {
      closeDeleteModal();
      await axiosInstance.delete(`/delete-cultural-work/${work.id}`);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al eliminar la labor cultural:", error);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    onSave(); // Refresh the table after closing the success modal
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* View Button */}
      <ViewButton onClick={openViewModal}>
        <HiOutlineEye size={18} />
        Ver
      </ViewButton>

      {/* Edit Button */}
      <EditButton onClick={openEditModal}>
        <HiOutlinePencil size={18} />
        Editar
      </EditButton>

      {/* Delete Button */}
      <DeleteButton onClick={openDeleteModal}>
        <HiOutlineTrash size={18} />
        Eliminar
      </DeleteButton>

      {/* View Modal */}
      <ViewCulturalWorkModal
        show={showViewModal}
        closeModal={closeViewModal}
        work={work}
      />

      {/* Edit Modal */}
      <EditCulturalWorkModal
        show={showEditModal}
        closeModal={closeEditModal}
        work={work}
        onSave={onSave}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Eliminar Labor Cultural"
        message="¿Estás seguro que deseas eliminar esta labor cultural? Esta acción no se puede deshacer."
        cancelText="No, cancelar"
        confirmText="Sí, eliminar"
      />

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={closeSuccessModal}
          message="¡Labor cultural eliminada exitosamente!"
        />
      )}
    </div>
  );
};

export default TableCulturalWorkAction;
