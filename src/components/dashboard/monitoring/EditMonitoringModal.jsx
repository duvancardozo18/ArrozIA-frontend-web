import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../../config/AxiosInstance';
import SuccessModal from '../modal/SuccessModal'; // Modal de éxito para monitoreos

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
  transform: translateZ(0);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-10px) scale(1.03) perspective(1000px);
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  input, select {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    font-size: 16px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${props => (props.disabled ? '#ccc' : '#28a745')};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: ${props => (props.disabled ? '#ccc' : '#218838')};
    box-shadow: ${props => (props.disabled ? 'none' : '0px 8px 15px rgba(0, 0, 0, 0.1)')};
  }
`;

const CloseButton = styled.button`
  position: absolute;
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

const EditMonitoringModal = ({ show, closeModal, monitoring, onSave }) => {
  const [tipo, setTipo] = useState("");
  const [recomendacion, setRecomendacion] = useState("");
  const [variedadArrozEtapaFenologicaId, setVariedadArrozEtapaFenologicaId] = useState("");
  const [etapasFenologicas, setEtapasFenologicas] = useState([]); // Estado para las etapas fenológicas
  const [initialMonitoringData, setInitialMonitoringData] = useState(null); // Estado para valores iniciales
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Al abrir el modal, inicializamos los valores del monitoreo y cargamos las etapas fenológicas
  useEffect(() => {
    if (show && monitoring) {
      const initialData = {
        tipo: monitoring.tipo || "",
        recomendacion: monitoring.recomendacion || "",
        variedadArrozEtapaFenologicaId: monitoring.variedad_arroz_etapa_fenologica_id || "",
      };
      setTipo(initialData.tipo);
      setRecomendacion(initialData.recomendacion);
      setVariedadArrozEtapaFenologicaId(initialData.variedadArrozEtapaFenologicaId);
      setInitialMonitoringData(initialData); // Guardar los valores iniciales
    }

    // Obtener las etapas fenológicas
    const fetchEtapasFenologicas = async () => {
      try {
        const response = await axiosInstance.get("/phenological-stages");
        setEtapasFenologicas(response.data);
      } catch (error) {
        console.error("Error al obtener las etapas fenológicas:", error);
      }
    };

    fetchEtapasFenologicas();
  }, [show, monitoring]);

  const isDataChanged = () => {
    return (
      tipo !== initialMonitoringData?.tipo ||
      recomendacion !== initialMonitoringData?.recomendacion ||
      variedadArrozEtapaFenologicaId !== initialMonitoringData?.variedadArrozEtapaFenologicaId
    );
  };

  const handleUpdateMonitoring = async () => {
    if (!isDataChanged()) return; // Evitar guardar si no hay cambios

    const monitoringData = {
      tipo,
      recomendacion: recomendacion || null,
      variedad_arroz_etapa_fenologica_id: variedadArrozEtapaFenologicaId ? parseInt(variedadArrozEtapaFenologicaId) : null,
      crop_id: monitoring.crop_id || null,
    };

    console.log("Datos a enviar al backend:", monitoringData);

    try {
      const response = await axiosInstance.put(`/monitoring/${monitoring.id}`, monitoringData);
      console.log("Respuesta del backend:", response.data);
      setShowSuccessModal(true); // Mostrar el modal de éxito
      if (onSave) onSave(); // Llama a onSave si está definida para refrescar monitoreos
    } catch (error) {
      console.error("Error al actualizar el monitoreo:", error);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal(); // Cierra el modal principal después de éxito
  };

  if (!show && !showSuccessModal) return null;

  return (
    <>
      {show && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={closeModal}>×</CloseButton>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Editar Monitoreo</h2>
            <InputGroup>
              <label>Tipo</label>
              <select name="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} required>
                <option value="">Seleccione un tipo</option>
                <option value="Malezas">Malezas</option>
                <option value="Plagas">Plagas</option>
                <option value="Enfermedades">Enfermedades</option>
                <option value="Nutricional">Nutricional</option>
              </select>
            </InputGroup>
            <InputGroup>
              <label>Etapa Fenológica</label>
              <select
                name="variedadArrozEtapaFenologicaId"
                value={variedadArrozEtapaFenologicaId}
                onChange={(e) => setVariedadArrozEtapaFenologicaId(e.target.value)}
              >
                <option value="">Seleccione etapa fenológica</option>
                {etapasFenologicas.map((etapa) => (
                  <option key={etapa.id} value={etapa.id}>
                    {etapa.nombre}
                  </option>
                ))}
              </select>
            </InputGroup>
            <InputGroup>
              <label>Recomendación</label>
              <input type="text" value={recomendacion} onChange={(e) => setRecomendacion(e.target.value)} />
            </InputGroup>
            <SubmitButton onClick={handleUpdateMonitoring} disabled={!isDataChanged()}>
              Guardar Cambios
            </SubmitButton>
          </ModalContent>
        </ModalOverlay>
      )}

      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={handleCloseSuccessModal}
          message="¡Monitoreo Editado!"
        />
      )}
    </>
  );
};

export default EditMonitoringModal;
