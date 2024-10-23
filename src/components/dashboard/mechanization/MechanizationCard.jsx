import React, { useContext } from "react";
import TractorIcon from "@mui/icons-material/Agriculture"; // Icono de mecanización
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { AuthContext } from "../../../config/AuthProvider";

const MechanizationCard = ({ operation, onDelete, onEdit, onNavigate, isSelected }) => {
  // Verificar permisos
  const { permissions } = useContext(AuthContext);
  const hasPermission = (permission) => permissions.includes(permission);

  const handleNavigate = () => {
    onNavigate();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`card-mecanizacion ${isSelected ? "selected" : ""}`}
      onClick={handleNavigate}
      style={{
        cursor: "pointer",
        transition: "box-shadow 0.3s ease",
        boxShadow: isSelected ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
      }}
    >
      <div className="icon-container">
        <TractorIcon style={{ fontSize: "2rem", color: "white" }} />
      </div>
      <div className="content">
        <div className="info">
          <h3>{operation.mechanizationName}</h3>
          <small className="text-muted">ID de maquinaria: {operation.machineryId}</small>
        </div>
      </div>
      <div className="actions">
        {hasPermission("update_mechanization") && (
          <EditIcon
            style={{ cursor: "pointer", color: "blue" }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(operation);
            }}
            onMouseEnter={(e) => (e.target.style.color = "darkblue")}
            onMouseLeave={(e) => (e.target.style.color = "blue")}
          />
        )}
        {hasPermission("delete_mechanization") && (
          <DeleteIcon
            style={{ cursor: "pointer", color: "red" }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(operation);
            }}
            onMouseEnter={(e) => (e.target.style.color = "darkred")}
            onMouseLeave={(e) => (e.target.style.color = "red")}
          />
        )}
      </div>
    </div>
  );
};

export default MechanizationCard;
