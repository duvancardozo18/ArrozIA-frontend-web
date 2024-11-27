import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axiosInstance from "../../../config/AxiosInstance";
import SuccessModal from "../../dashboard/modal/SuccessModal";

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
  max-width: 90%;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.2);
  transform: translateZ(0);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-10px) scale(1.03) perspective(1000px);
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #ff6b6b;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  select,
  textarea, input {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    font-size: 16px;
    transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;

    &:focus {
      box-shadow: 0px 0px 8px 2px rgba(39, 174, 96, 0.3);
      transform: translateY(-3px);
      outline: none;
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: white;2
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-family: "Roboto", sans-serif;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #218838;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CreateMonitoringModal = ({ closeModal, fetchMonitorings, selectedCrop }) => {
  const [formData, setFormData] = useState({
    tipo: "",
    variedad_arroz_etapa_fenologica_id: null,
    recomendacion: "",
    fecha_programada: "", // Agregamos el campo para la fecha programada
  });
  const [etapasFenologicas, setEtapasFenologicas] = useState([]); // Estado para las etapas fenológicas
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // useEffect(() => {
  //   const fetchEtapasFenologicas = async () => {
  //     try {
  //       const response = await axiosInstance.get("/phenological-stages");
  //       setEtapasFenologicas(response.data);
  //     } catch (error) {
  //       console.error("Error al obtener las etapas fenológicas:", error);
  //     }
  //   };

  //   fetchEtapasFenologicas();
  // }, []);

  useEffect(() => {
    const fetchVarietyRiceStages = async () => {
      try {
        // Llama a la nueva ruta del backend
        const response = await axiosInstance.get("/variety-rice-stages");
        setEtapasFenologicas(response.data); // Guarda los datos obtenidos
      } catch (error) {
        console.error("Error al obtener las variedades de arroz etapa fenológica:", error);
      }
    };
  
    fetchVarietyRiceStages();
  }, []);  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dataToSend = {
      tipo: formData.tipo,
      variedad_arroz_etapa_fenologica_id: formData.variedad_arroz_etapa_fenologica_id
        ? parseInt(formData.variedad_arroz_etapa_fenologica_id)
        : null,
      recomendacion: formData.recomendacion || null,
      fecha_programada: formData.fecha_programada, // Incluimos la fecha programada
      fecha_finalizacion: null, // Asegúrate de que siempre se envíe este campo
      crop_id: selectedCrop.id, // Enviar el `crop_id` del cultivo seleccionado
    };

    console.log("Datos a enviar:", dataToSend); // Log para revisar datos antes de enviar

    try {
      await axiosInstance.post("/monitoring/", dataToSend);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al crear el monitoreo:", error);
      setErrorMessage("Error al crear el monitoreo: " + (error.response?.data?.detail || "Datos incorrectos."));
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal();
    fetchMonitorings();
  };

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Crear Monitoreo</h2>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <label>Tipo</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange} required>
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
              name="variedad_arroz_etapa_fenologica_id"
              value={formData.variedad_arroz_etapa_fenologica_id || ""}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione etapa fenológica</option>
              {etapasFenologicas.map((etapa) => (
                <option key={etapa.id} value={etapa.id}>
                  {etapa.nombre || `Etapa ${etapa.etapa_fenologica_id}`}
                </option>
              ))}
            </select>
          </InputGroup>

            {/* <InputGroup>
              <label>Etapa Fenológica</label>
              <select
                name="variedad_arroz_etapa_fenologica_id"
                value={formData.variedad_arroz_etapa_fenologica_id || ""}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione etapa fenológica</option>
                {etapasFenologicas.map((etapa) => (
                  <option key={etapa.id} value={etapa.id}>
                    {etapa.nombre}
                  </option>
                ))}
              </select>
            </InputGroup> */}

            <InputGroup>
              <label>Recomendación</label>
              <textarea
                name="recomendacion"
                value={formData.recomendacion}
                onChange={handleChange}
                maxLength={255}
              />
            </InputGroup>
            <InputGroup>
              <label>Fecha Programada</label>
              <input
                type="date"
                name="fecha_programada"
                value={formData.fecha_programada}
                onChange={handleChange}
                required
              />
            </InputGroup>
            <SubmitButton type="submit">Crear Monitoreo</SubmitButton>
          </form>
        </ModalContent>
      </ModalOverlay>
      {showSuccessModal && (
        <SuccessModal onClose={handleCloseSuccessModal} message="¡Monitoreo Creado!" />
      )}
    </>
  );
};

export default CreateMonitoringModal;
