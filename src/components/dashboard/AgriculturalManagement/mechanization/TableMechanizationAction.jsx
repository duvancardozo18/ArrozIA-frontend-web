import React, { useState } from "react";
import styled from "styled-components";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import EditMechanizationModal from "./EditMechanizationModal"; // Adjust import path as necessary
import DeleteModal from "../../modal/DeleteModal";
import SuccessModal from "../../modal/SuccessModal";
import ViewMechanizationModal from "./ViewMechanizationModal"; // Import the view modal for mechanization operations
import axiosInstance from "../../../../config/AxiosInstance";

// Styles for the action buttons
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

const TableMechanizationAction = ({ operation, onSave }) => {
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
      await axiosInstance.delete(`/operation-mechanization/{op_mech_id}`);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error deleting mechanization operation:", error);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    onSave(); // Refresh the table after successfully deleting
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
      <ViewMechanizationModal
        show={showViewModal}
        closeModal={closeViewModal}
        operation={operation}
      />

      {/* Edit Modal */}
      <EditMechanizationModal
        show={showEditModal}
        closeModal={closeEditModal}
        operation={operation}
        onSave={onSave}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Eliminar Operación de Mecanización"
        message="¿Estás seguro que deseas eliminar esta operación de mecanización? Esta acción no se puede deshacer."
        cancelText="No, cancelar"
        confirmText="Sí, eliminar"
      />

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={closeSuccessModal}
          message="¡Operación de mecanización eliminada exitosamente!"
        />
      )}
    </div>
  );
};

export default TableMechanizationAction;
