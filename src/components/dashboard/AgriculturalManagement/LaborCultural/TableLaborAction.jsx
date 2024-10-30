import React, { useState } from "react";
import styled from "styled-components";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import DeleteModal from "../../modal/DeleteModal";
import ViewLaborModal from "./ViewLaborModal";
import EditLaborModal from "./EditLaborModal";
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

const TableLaborAction = ({ labor, onEdit, onDelete, onView }) => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/labor-cultural/delete/${labor.id}`);
      setShowDeleteModal(false);
      onDelete(); // Actualiza la lista en la tabla tras eliminar
    } catch (error) {
      console.error("Error al eliminar la labor cultural:", error);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <ViewButton onClick={() => setShowViewModal(true)}>
        <HiOutlineEye size={18} />
        Ver
      </ViewButton>

      <EditButton onClick={() => setShowEditModal(true)}>
        <HiOutlinePencil size={18} />
        Editar
      </EditButton>

      <DeleteButton onClick={() => setShowDeleteModal(true)}>
        <HiOutlineTrash size={18} />
        Eliminar
      </DeleteButton>

      {showViewModal && (
        <ViewLaborModal
          show={showViewModal}
          closeModal={() => setShowViewModal(false)}
          labor={labor}
        />
      )}

      {showEditModal && (
        <EditLaborModal
          show={showEditModal}
          closeModal={() => setShowEditModal(false)}
          labor={labor}
          onSave={(updatedLabor) => {
            setShowEditModal(false);
            onEdit(updatedLabor); // Solo actualiza la tabla, sin mensaje de éxito aquí
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Eliminar Labor Cultural"
          message="¿Estás seguro que deseas eliminar esta labor? Esta acción no se puede deshacer."
          cancelText="No, cancelar"
          confirmText="Sí, eliminar"
        />
      )}
    </div>
  );
};

export default TableLaborAction;
