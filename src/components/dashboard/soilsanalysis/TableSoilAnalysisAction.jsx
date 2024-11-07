import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import ViewSoilAnalysisModal from "./ViewSoilAnalysisModal";
import EditSoilAnalysisModal from "./EditSoilAnalysisModal";
import DeleteModal from "../modal/DeleteModal";
import axiosInstance from "../../../config/AxiosInstance";

// Styled buttons
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

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  tbody tr:hover {
    background-color: #f9f9f9;
  }

  tbody tr td {
    word-wrap: break-word;
  }

  tbody tr {
    transition: background-color 0.2s ease;
  }
`;

const TableSoilAnalysisAction = ({ analyses, selectedLand, onRefresh, onShowSuccess }) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    console.log("Analyses data received:", analyses);
  }, [analyses]);

  // Función para abrir el modal de vista
  const openViewModal = (analysis) => {
    setSelectedAnalysis(analysis);
    setShowViewModal(true);
  };

  // Función para abrir el modal de edición
  const openEditModal = async (analysis) => {
    try {
      const response = await axiosInstance.get(`/soil_analysis/${selectedLand.id}/${analysis.id}`);
      setSelectedAnalysis(response.data);
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching soil analysis:", error);
    }
  };

  // Función para abrir el modal de eliminación
  const openDeleteModal = (analysis) => {
    setSelectedAnalysis(analysis);
    setShowDeleteModal(true);
  };

  // Funciones para cerrar cada modal de manera independiente
  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedAnalysis(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedAnalysis(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedAnalysis(null);
  };

  // Función para manejar la eliminación
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/soil_analysis/${selectedLand.id}/${selectedAnalysis.id}`);
      closeDeleteModal();
      onShowSuccess("¡Análisis edafológico eliminado exitosamente!");
      onRefresh();
    } catch (error) {
      console.error("Error deleting soil analysis:", error);
    }
  };

  // Función para manejar el éxito de la edición
  const handleEditSuccess = () => {
    closeEditModal();
    onShowSuccess("¡Análisis edafológico editado exitosamente!");
    onRefresh();
  };

  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            <th>Fecha del Análisis</th>
            <th>Tipo de Suelo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {analyses.length > 0 ? (
            analyses.map((analysis) => (
              <tr key={analysis.id} style={{ cursor: "pointer" }}>
                <td>{analysis.fecha_analisis || "Fecha no disponible"}</td>
                <td>{analysis.tipo_suelo_descripcion || "Tipo de suelo no disponible"}</td>
                <td>
                  <ViewButton onClick={(e) => { e.stopPropagation(); openViewModal(analysis); }}>
                    <HiOutlineEye size={18} /> Ver
                  </ViewButton>
                  <EditButton onClick={(e) => { e.stopPropagation(); openEditModal(analysis); }}>
                    <HiOutlinePencil size={18} /> Editar
                  </EditButton>
                  <DeleteButton onClick={(e) => { e.stopPropagation(); openDeleteModal(analysis); }}>
                    <HiOutlineTrash size={18} /> Eliminar
                  </DeleteButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", color: "gray" }}>
                No hay análisis edafológicos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </StyledTable>

      {/* Modals */}
      {showViewModal && selectedAnalysis && (
        <ViewSoilAnalysisModal
          show={showViewModal}
          closeModal={closeViewModal}
          selectedLand={selectedLand}
          selectedAnalysis={selectedAnalysis}
        />
      )}

      {showEditModal && selectedAnalysis && (
        <EditSoilAnalysisModal
          show={showEditModal}
          closeModal={closeEditModal}
          soilAnalysisData={selectedAnalysis}
          selectedLand={selectedLand}
          onSave={handleEditSuccess}
        />
      )}
      {showDeleteModal && selectedAnalysis && (
        <DeleteModal
          show={showDeleteModal}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          title="Eliminar Análisis Edafológico"
          message="¿Estás seguro de que deseas eliminar este análisis? Esta acción no se puede deshacer."
          cancelText="No, cancelar"
          confirmText="Sí, eliminar"
        />
      )}
    </TableContainer>
  );
};

export default TableSoilAnalysisAction;
