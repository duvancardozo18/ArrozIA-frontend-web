import React, { useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../../css/Monitory.scss";
import MonitoringCard from "./MonitoringCard";
import DeleteModal from "../modal/DeleteModal"; // Modal de eliminación
import SuccessModal from "../modal/SuccessModal"; // Modal de éxito
import axiosInstance from "../../../config/AxiosInstance";

const localizer = momentLocalizer(moment);

const ColumMonitoring = ({ selectedCrop, monitorings, onOpenModal, refreshMonitorings }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Estado para el modal de éxito
  const [monitoringToDelete, setMonitoringToDelete] = useState(null);

  // Abre el modal de confirmación de eliminación
  const handleDeleteClick = (monitoring) => {
    setMonitoringToDelete(monitoring);
    setIsDeleteModalOpen(true);
  };

  // Cierra el modal de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setMonitoringToDelete(null);
  };

  // Maneja la eliminación del monitoreo
  const handleDeleteMonitoring = async (id) => {
    try {
      await axiosInstance.delete(`/monitoring/${id}`);
      closeDeleteModal(); // Cierra el modal de confirmación de eliminación
      setShowSuccessModal(true); // Muestra el modal de éxito
      refreshMonitorings(); // Actualiza la lista de monitoreos
    } catch (error) {
      console.error("Error al eliminar el monitoreo:", error);
    }
  };

  // Cierra el modal de éxito
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  // Eventos para el calendario
  const events = monitorings.map((monitoring) => ({
    title: monitoring.tipo,
    start: new Date(monitoring.fechaInicio),
    end: new Date(monitoring.fechaFin),
  }));

  return (
    <div className="monitorings-column">
      {selectedCrop ? (
        <div>
          <h2>Monitoreos para {selectedCrop.cropName}</h2>
          <div className="monitoring-cards-container">
            {monitorings.length > 0 ? (
              monitorings.map((monitoring) => (
                <MonitoringCard
                  key={monitoring.id}
                  monitoring={monitoring}
                  onEdit={refreshMonitorings}
                  onDelete={() => handleDeleteClick(monitoring)}
                />
              ))
            ) : (
              <p>No hay monitoreos disponibles.</p>
            )}
          </div>

          <button className="button" onClick={onOpenModal} type="button">
            <span className="button__text">Agregar</span>
            <span className="button__icon">
              <svg
                className="svg"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="12" x2="12" y1="5" y2="19"></line>
                <line x1="5" x2="19" y1="12" y2="12"></line>
              </svg>
            </span>
          </button>

          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, margin: "20px 0" }}
          />
        </div>
      ) : (
        <p>Seleccione un cultivo para ver los monitoreos.</p>
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && monitoringToDelete && (
        <DeleteModal
          show={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={() => handleDeleteMonitoring(monitoringToDelete.id)}
          title="Eliminar Monitoreo"
          message="¿Estás seguro de que deseas eliminar este monitoreo?"
          cancelText="Cancelar"
          confirmText="Eliminar"
        />
      )}

      {/* Modal de éxito de eliminación */}
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={closeSuccessModal}
          message="¡Monitoreo eliminado exitosamente!"
        />
      )}
    </div>
  );
};

export default ColumMonitoring;
