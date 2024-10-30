import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axiosInstance from "../../../../config/AxiosInstance";
import SuccessModal from "../../../dashboard/modal/SuccessModal";

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

const CreatePhenologicalStageModal = ({ closeModal, onSave }) => {
  const [formData, setFormData] = useState({
    variedad_arroz_id: "",
    etapa_fenologica_id: "",
    dias_duracion: "",
  });
  const [varieties, setVarieties] = useState([]);
  const [phenologicalStages, setPhenologicalStages] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Cargar variedades de arroz
  useEffect(() => {
    const fetchVarieties = async () => {
      try {
        const response = await axiosInstance.get("/list-varieties");
        setVarieties(response.data);
      } catch (error) {
        setErrorMessage("Error al cargar las variedades de arroz.");
      }
    };
    fetchVarieties();
  }, []);

  // Cargar etapas fenológicas
  useEffect(() => {
    const fetchPhenologicalStages = async () => {
      try {
        const response = await axiosInstance.get("/phenological-stages");
        setPhenologicalStages(response.data);
      } catch (error) {
        setErrorMessage("Error al cargar las etapas fenológicas.");
      }
    };
    fetchPhenologicalStages();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.post("/variety-rice-stages", formData);
      if (response.status === 200) {
        setShowSuccessModal(true);
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      setErrorMessage("Error inesperado al crear la etapa fenológica.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onSave();
    closeModal();
  };

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Crear Etapa Fenológica
          </h2>
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
                <option value="">Selecciona una variedad</option>
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
                <option value="">Selecciona una etapa</option>
                {phenologicalStages.map((stage) => (
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

            <SubmitButton type="submit">Crear Etapa Fenológica</SubmitButton>
          </form>
        </ModalContent>
      </ModalOverlay>
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={handleCloseSuccessModal}
          message="¡Etapa Fenológica Creada!"
        />
      )}
    </>
  );
};

export default CreatePhenologicalStageModal;
