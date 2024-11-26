import React, { useState } from "react";
import styled from "styled-components";
import axiosInstance from "../../../config/AxiosInstance";
import SuccessModal from "../modal/SuccessModal";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 20px;
  width: 450px;
  max-width: 100%;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.2);
  position: relative; /* Para posicionar el botón de cierre */
`;

const InputGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    font-size: 16px;
  }

  input[readonly] {
    background-color: #f5f5f5; /* Fondo gris para campos de solo lectura */
    color: #666;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${props => (props.disabled ? "#ccc" : "#28a745")};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s, box-shadow 0.3s;
`;

const CloseButton = styled.button`
  position: absolute; /* Posición relativa al contenedor del modal */
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #ff6b6b;
  }
`;

const FinalizeMonitoringModal = ({ show, closeModal, monitoring, onFinalize }) => {
  const [fechaFinalizacion, setFechaFinalizacion] = useState(monitoring.fecha_finalizacion || "");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

//   const handleFinalizeMonitoring = async () => {
//     const data = {
//       fecha_finalizacion: fechaFinalizacion,
//     };

//     try {
//       const response = await axiosInstance.put(`/monitoring/${monitoring.id}`, data);
//       console.log("Respuesta del backend:", response.data);
//       setShowSuccessModal(true); // Mostrar modal de éxito
//       if (onSave) onSave(); // Refresca la lista de monitoreos
//     } catch (error) {
//       console.error("Error al finalizar el monitoreo:", error);
//       alert("Hubo un error al finalizar el monitoreo. Por favor, intenta nuevamente.");
//     }
//   };

const handleFinalizeMonitoring = async () => {
  // const data = {
  //   fecha_finalizacion: fechaFinalizacion,
  //   estado: 2, // Cambiar el estado a "Finalizado"
  // };

  // console.log("Datos a enviar al backend:", data); // Log para ver los datos antes de enviar

  // try {
  //   const response = await axiosInstance.put(`/monitoring/${monitoring.id}`, data);
  //   console.log("Respuesta del backend:", response.data);
  //   setShowSuccessModal(true); // Mostrar modal de éxito
  //   if (onFinalize) onFinalize(response.data); // Actualiza los datos en el componente padre
  // } catch (error) {
  //   console.error("Error al finalizar el monitoreo:", error);
  //   alert("Hubo un error al finalizar el monitoreo. Por favor, intenta nuevamente.");
  // }

  // Crear un objeto con todos los datos de monitoring
  const data = {
    tipo: monitoring.tipo, // Incluye el tipo
    variedad_arroz_etapa_fenologica_id: monitoring.variedad_arroz_etapa_fenologica_id,
    recomendacion: monitoring.recomendacion,
    crop_id: monitoring.crop_id,
    fecha_programada: monitoring.fecha_programada,
    fecha_finalizacion: fechaFinalizacion, // Actualiza este campo con el valor modificado
    estado: 2, // Cambiar el estado a "Finalizado"
  };

  console.log("Datos a enviar al backend:", data); // Log para verificar los datos

  try {
    const response = await axiosInstance.put(`/monitoring/${monitoring.id}`, data);
    console.log("Respuesta del backend:", response.data);
    setShowSuccessModal(true); // Mostrar modal de éxito
    if (onFinalize) onFinalize(response.data); // Actualiza los datos en el componente padre
  } catch (error) {
    console.error("Error al finalizar el monitoreo:", error);
    alert("Hubo un error al finalizar el monitoreo. Por favor, intenta nuevamente.");
  }
};
  

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal(); // Cierra el modal principal
  };

  if (!show && !showSuccessModal) return null;

  return (
    <>
      {show && (
        <ModalOverlay>
          <ModalContent>
            {/* Botón de cierre con la "X" */}
            <CloseButton onClick={closeModal}>×</CloseButton>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Finalizar Monitoreo</h2>

            <InputGroup>
              <label>Tipo</label>
              <input type="text" value={monitoring.tipo} readOnly />
            </InputGroup>

            <InputGroup>
              <label>Etapa Fenológica</label>
              <input type="text" value={monitoring.etapaNombre || "No especificada"} readOnly />
            </InputGroup>

            <InputGroup>
              <label>Recomendación</label>
              <input type="text" value={monitoring.recomendacion || "No especificada"} readOnly />
            </InputGroup>

            <InputGroup>
              <label>Fecha Programada</label>
              <input type="text" value={monitoring.fecha_programada} readOnly />
            </InputGroup>

            <InputGroup>
              <label>Fecha de Finalización</label>
              <input
                type="date"
                value={fechaFinalizacion}
                onChange={(e) => setFechaFinalizacion(e.target.value)}
                required
              />
            </InputGroup>

            <SubmitButton
              onClick={handleFinalizeMonitoring}
              disabled={!fechaFinalizacion}
            >
              Finalizar Monitoreo
            </SubmitButton>
          </ModalContent>
        </ModalOverlay>
      )}

      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={handleCloseSuccessModal}
          message="¡Monitoreo Finalizado!"
        />
      )}
    </>
  );
};

export default FinalizeMonitoringModal;
