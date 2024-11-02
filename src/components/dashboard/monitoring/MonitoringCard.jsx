import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug, faLeaf, faHeartbeat, faSeedling } from "@fortawesome/free-solid-svg-icons";
import "../../../css/MonitoringCard.scss";
import EditMonitoringModal from "./EditMonitoringModal"; // Importa el modal de edición
import DeleteModal from "../modal/DeleteModal"; // Importa el modal de eliminación
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const MonitoringCard = ({ monitoring, onEdit, onDelete }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Asigna un ícono y color según el tipo de monitoreo
  const getIcon = (tipo) => {
    switch (tipo) {
      case "Plagas":
        return { icon: faBug, color: "#E63946" }; // Rojo para plagas
      case "Malezas":
        return { icon: faLeaf, color: "#8A2BE2" }; // Púrpura para malezas
      case "Nutricional":
        return { icon: faHeartbeat, color: "#FF8C00" }; // Naranja oscuro para nutricional
      case "Enfermedades":
        return { icon: faSeedling, color: "#20B2AA" }; // Turquesa para enfermedades
      default:
        return { icon: faSeedling, color: "#696969" }; // Gris para otros
    }
  };

  const { icon, color } = getIcon(monitoring.tipo);

  // Funciones para abrir y cerrar el modal de edición
  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Funciones para abrir y cerrar el modal de eliminación
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // Confirmación de eliminación
  const confirmDelete = () => {
    onDelete(monitoring.id);
    closeDeleteModal();
  };

  return (
    <div className="monitoring-card" style={{ borderColor: color }}>
      <div className="icon-container" style={{ color }}>
        <FontAwesomeIcon icon={icon} size="2x" />
      </div>
      <div className="monitoring-content">
        <h3 className="monitoring-title">{monitoring.tipo}</h3>
        <p className="monitoring-recommendation">
          <strong>Recomendación:</strong> {monitoring.recomendacion || "No especificada"}
        </p>
        {monitoring.etapaNombre ? (
          <p className="monitoring-stage">
          <strong>Etapa Fenológica:</strong> {monitoring.etapaNombre}
        </p>
      ) : (
        <p className="monitoring-stage">No especificada</p>
      )}
      </div>
      <div className="action-buttons">
        <EditIcon
          style={{ cursor: "pointer", color: "blue" }}
          onClick={(e) => {
            e.stopPropagation();
            handleEditClick();
          }}
          onMouseEnter={(e) => (e.target.style.color = "darkblue")}
          onMouseLeave={(e) => (e.target.style.color = "blue")}
        />
        <DeleteIcon
          style={{ cursor: "pointer", color: "red" }}
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick();
          }}
          onMouseEnter={(e) => (e.target.style.color = "darkred")}
          onMouseLeave={(e) => (e.target.style.color = "red")}
        />
      </div>

      {/* Modal de edición */}
      {isEditModalOpen && (
        <EditMonitoringModal
          show={isEditModalOpen}
          closeModal={closeEditModal}
          monitoring={monitoring}
          onSave={onEdit}
        />
      )}

      {/* Modal de eliminación */}
      {isDeleteModalOpen && (
        <DeleteModal
          show={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          title="Eliminar Monitoreo"
          message="¿Estás seguro de que deseas eliminar este monitoreo?"
          cancelText="Cancelar"
          confirmText="Eliminar"
        />
      )}
    </div>
  );
};

export default MonitoringCard;
