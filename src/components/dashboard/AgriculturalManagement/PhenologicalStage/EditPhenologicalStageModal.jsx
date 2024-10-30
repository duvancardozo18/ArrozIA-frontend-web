import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axiosInstance from "../../../../config/AxiosInstance";
import SuccessModal from "../../modal/SuccessModal";

// Estilos de modal y elementos
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
    font-size: 0.9em;
  }

  input,
  select {
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
  color: white;
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

const Title = styled.h2`
  text-align: center;
  font-size: 24px;
  margin-bottom: 30px;
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
`;

const EditPhenologicalStageModal = ({ show, closeModal, stage, onSave }) => {
  const [formData, setFormData] = useState({
    variedad_arroz_id: stage?.variety?.id || "",
    etapa_fenologica_id: stage?.phenological_stage?.id || "",
    dias_duracion: stage?.dias_duracion || "",
  });

  const [varieties, setVarieties] = useState([]);
  const [stages, setStages] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchVarietiesAndStages = async () => {
      try {
        const varietyResponse = await axiosInstance.get("/list-varieties");
        setVarieties(varietyResponse.data);

        const stageResponse = await axiosInstance.get("/phenological-stages");
        setStages(stageResponse.data);
      } catch (error) {
        console.error("Error al cargar variedades y etapas:", error);
        setErrorMessage("Error al cargar datos.");
      }
    };

    if (stage) {
      fetchVarietiesAndStages();
    }
  }, [stage]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.put(
        `/variety-rice-stages/${stage.id}`,
        formData
      );
      if (response.status === 200) {
        setShowSuccessModal(true);
      } else {
        setErrorMessage("Error al editar la etapa.");
      }
    } catch (error) {
      console.error("Error al editar la etapa:", error);
      setErrorMessage("Error inesperado al editar la etapa.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal();
    onSave();
  };

  return (
    <>
      {show && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={closeModal}>×</CloseButton>
            <Title>Editar Etapa Fenológica</Title>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <form onSubmit={handleSubmit}>
              <InputGroup>
                <label>Variedad de Arroz</label>
                <select
                  name="variedad_arroz_id"
                  value={formData.variedad_arroz_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Variedad</option>
                  {varieties.map((variety) => (
                    <option key={variety.id} value={variety.id}>
                      {variety.nombre}
                    </option>
                  ))}
                </select>
              </InputGroup>

              <InputGroup>
                <label>Etapa Fenológica</label>
                <select
                  name="etapa_fenologica_id"
                  value={formData.etapa_fenologica_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Etapa</option>
                  {stages.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.nombre}
                    </option>
                  ))}
                </select>
              </InputGroup>

              <InputGroup>
                <label>Días de Duración</label>
                <input
                  type="number"
                  name="dias_duracion"
                  value={formData.dias_duracion}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <SubmitButton type="submit">Guardar Cambios</SubmitButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={handleCloseSuccessModal}
          message="¡Etapa fenológica editada exitosamente!"
        />
      )}
    </>
  );
};

export default EditPhenologicalStageModal;
