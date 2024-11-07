import React, { useState } from "react";
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
  select,
  textarea {
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

  textarea {
    resize: vertical;
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

const CreateMachineryModal = ({ closeModal, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    costPerHour: "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && value.length >= 99) {
      setErrorMessage("El campo 'Nombre' no puede exceder los 100 caracteres.");
    } else if (name === "description" && value.length >= 299) {
      setErrorMessage("El campo 'Descripción' no puede exceder los 300 caracteres.");
    } else {
      setErrorMessage("");
    }

    if (name === "name" && value.length <= 100) {
      setFormData({ ...formData, [name]: value });
    } else if (name === "description" && value.length <= 300) {
      setFormData({ ...formData, [name]: value });
    } else if (name === "costPerHour") {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.name.length > 100) {
      setErrorMessage("No se puede enviar porque se superó el límite de 100 caracteres en el campo 'Nombre'.");
      return;
    }

    if (formData.description.length > 300) {
      setErrorMessage("No se puede enviar porque se superó el límite de 300 caracteres en el campo 'Descripción'.");
      return;
    }

    try {
      setErrorMessage("");
      const response = await axiosInstance.post("/machinery/", formData);

      if (response.status === 201) {
        setShowSuccessModal(true);
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al crear la maquinaria:", error.response?.data);
      setErrorMessage("Error inesperado al crear la maquinaria.");
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
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Crear Maquinaria</h2>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <label>Nombre de la Maquinaria</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={100}
              />
            </InputGroup>

            <InputGroup>
              <label>Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                maxLength={300}
              />
            </InputGroup>

            <InputGroup>
              <label>Costo por Hora</label>
              <input
                type="number"
                step="0.01"
                name="costPerHour"
                value={formData.costPerHour}
                onChange={handleChange}
                required
              />
            </InputGroup>
            <SubmitButton type="submit">Crear Maquinaria</SubmitButton>
          </form>
        </ModalContent>
      </ModalOverlay>
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={handleCloseSuccessModal}
          message="¡Maquinaria Creada!"
        />
      )}
    </>
  );
};

export default CreateMachineryModal;
