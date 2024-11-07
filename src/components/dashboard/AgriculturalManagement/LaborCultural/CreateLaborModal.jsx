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
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
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
`;

const InputGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  input,
  textarea {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ddd;
    font-size: 16px;
    transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;

    &:focus {
      box-shadow: 0px 0px 8px 2px rgba(39, 174, 96, 0.3);
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
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const CreateLaborModal = ({ closeModal, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nombre" && value.length >= 99) {
      setErrorMessage("El campo 'Nombre' no puede exceder los 100 caracteres.");
    } else if (name === "descripcion" && value.length >= 299) {
      setErrorMessage("El campo 'Descripción' no puede exceder los 300 caracteres.");
    } else {
      setErrorMessage(""); // Limpiar mensaje de error si la entrada es válida
    }

    if (name === "nombre" && value.length <= 100) {
      setFormData({ ...formData, [name]: value });
    } else if (name === "descripcion" && value.length <= 300) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.nombre.length > 100) {
      setErrorMessage("No se puede enviar porque se superó el límite de 100 caracteres en el campo 'Nombre'.");
      return;
    }

    if (formData.descripcion.length > 300) {
      setErrorMessage("No se puede enviar porque se superó el límite de 300 caracteres en el campo 'Descripción'.");
      return;
    }

    try {
      await axiosInstance.post("/labor-cultural/create", formData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al crear la labor cultural:", error);
      setErrorMessage("Hubo un error al crear la labor cultural.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onSave(); // Actualiza la tabla después de crear
    closeModal(); // Cierra el modal principal
  };

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <Title>Crear Labor Cultural</Title>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <label>Nombre de la labor</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                maxLength={100}
              />
            </InputGroup>
            <InputGroup>
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows={3}
                maxLength={300}
              />
            </InputGroup>
            <SubmitButton type="submit">Crear</SubmitButton>
          </form>
        </ModalContent>
      </ModalOverlay>
      {showSuccessModal && (
        <SuccessModal
          onClose={handleCloseSuccessModal}
          message="¡Labor cultural creada exitosamente!"
        />
      )}
    </>
  );
};

export default CreateLaborModal;
