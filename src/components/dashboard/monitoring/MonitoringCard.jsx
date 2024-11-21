import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug, faLeaf, faHeartbeat, faSeedling } from "@fortawesome/free-solid-svg-icons";
import "../../../css/MonitoringCard.scss";
import EditMonitoringModal from "./EditMonitoringModal";
import DeleteModal from "../modal/DeleteModal";
import FinalizeMonitoringModal from "./FinalizeMonitoringModal";
import axiosInstance from "../../../config/AxiosInstance";
import { AuthContext } from "../../../config/AuthProvider";
import EditIcon from "@mui/icons-material/Edit"; // Importación correcta
import DeleteIcon from "@mui/icons-material/Delete"; // Importación correcta

const MonitoringCard = ({ monitoring, onEdit, onDelete, onFinalize }) => {
  const { userId } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(null);
  const [modalState, setModalState] = useState(null); // null | "edit" | "finalize"

  useEffect(() => {
    const checkIfAdmin = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}/is_admin`);
        setIsAdmin(response.data.is_admin);
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };
    checkIfAdmin();
  }, [userId]);

  const getIcon = (tipo) => {
    switch (tipo) {
      case "Plagas":
        return { icon: faBug, color: "#E63946" };
      case "Malezas":
        return { icon: faLeaf, color: "#8A2BE2" };
      case "Nutricional":
        return { icon: faHeartbeat, color: "#FF8C00" };
      case "Enfermedades":
        return { icon: faSeedling, color: "#20B2AA" };
      default:
        return { icon: faSeedling, color: "#696969" };
    }
  };

  const cardBorderColor = monitoring.estado === 1 ? "#FF6B6B" : "#28A745";
  const { icon, color } = getIcon(monitoring.tipo);

  const openModal = (type) => setModalState(type);
  const closeModal = () => setModalState(null);

  return (
    <div className="monitoring-card" style={{ borderColor: cardBorderColor }}>
      <div className="icon-container" style={{ color }}>
        <FontAwesomeIcon icon={icon} size="2x" />
      </div>
      <div className="monitoring-content">
        <h3 className="monitoring-title">{monitoring.tipo}</h3>
        <p>
          <strong>Recomendación:</strong> {monitoring.recomendacion || "No especificada"}
        </p>
        <p>
          <strong>Etapa Fenológica:</strong> {monitoring.etapaNombre || "No especificada"}
        </p>
        <p>
          <strong>Fecha Programada:</strong> {monitoring.fecha_programada}
        </p>
      </div>
      <div className="action-buttons">
        {isAdmin ? (
          <>
            <EditIcon
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => openModal("edit")}
              onMouseEnter={(e) => (e.target.style.color = "darkblue")}
              onMouseLeave={(e) => (e.target.style.color = "blue")}
            />
            <DeleteIcon
              style={{ cursor: "pointer", color: "red" }}
              onClick={onDelete}
              onMouseEnter={(e) => (e.target.style.color = "darkred")}
              onMouseLeave={(e) => (e.target.style.color = "red")}
            />
          </>
        ) : (
          monitoring.estado === 1 && (
            <button
              style={{
                padding: "8px 16px",
                backgroundColor: "#28A745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => openModal("finalize")}
            >
              Finalizar
            </button>
          )
        )}
      </div>

      {modalState === "edit" && (
        <EditMonitoringModal
          show={true}
          closeModal={closeModal}
          monitoring={monitoring}
          onSave={onEdit}
        />
      )}
      {modalState === "finalize" && (
        <FinalizeMonitoringModal
          show={true}
          closeModal={closeModal}
          monitoring={monitoring}
          onFinalize={onFinalize}
        />
      )}
    </div>
  );
};

export default MonitoringCard;
