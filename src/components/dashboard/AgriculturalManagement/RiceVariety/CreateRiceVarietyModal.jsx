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

const CreateRiceVarietyModal = ({ closeModal, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: "",  
    numero_registro_productor_ica: "",  
    caracteristicas_variedad: "",  
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "nombre" || name === "numero_registro_productor_ica") && value.length > 50) {
      setErrorMessage("El campo no puede exceder los 50 caracteres.");
    } else if (name === "caracteristicas_variedad" && value.length > 300) {
      setErrorMessage("El campo 'Características' no puede exceder los 300 caracteres.");
    } else if (name === "nombre" && value.length === 49) {
      setErrorMessage("Queda un solo carácter para el campo 'Nombre'.");
    } else if (name === "numero_registro_productor_ica" && value.length === 49) {
      setErrorMessage("Queda un solo carácter para el campo 'Registro ICA'.");
    } else {
      setFormData({ ...formData, [name]: value });
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.nombre.length > 50) {
      setErrorMessage("No se puede enviar porque se superó el límite de 50 caracteres en el campo 'Nombre'.");
      return;
    }

    if (formData.numero_registro_productor_ica.length > 50) {
      setErrorMessage("No se puede enviar porque se superó el límite de 50 caracteres en el campo 'Registro ICA'.");
      return;
    }

    if (formData.caracteristicas_variedad.length > 300) {
      setErrorMessage("No se puede enviar porque se superó el límite de 300 caracteres en el campo 'Características'.");
      return;
    }

    try {
      setErrorMessage("");
      await axiosInstance.post("/register-variety", formData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al crear la variedad de arroz:", error);
      setErrorMessage("Error inesperado al crear la variedad de arroz.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal();
    onSave();
  };

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Crear Variedad de Arroz
          </h2>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <label>Nombre de la variedad</label>
              <input
                type="text"
                name="nombre"  
                value={formData.nombre}
                onChange={handleChange}
                required
                maxLength={50}
              />
            </InputGroup>

            <InputGroup>
              <label>Registro ICA</label>
              <input
                type="text"
                name="numero_registro_productor_ica"  
                value={formData.numero_registro_productor_ica}
                onChange={handleChange}
                required
                maxLength={50}
              />
            </InputGroup>

            <InputGroup>
              <label>Características (Opcional)</label>
              <textarea
                name="caracteristicas_variedad"  
                value={formData.caracteristicas_variedad}
                onChange={handleChange}
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
          message="¡Variedad de Arroz Creada!"
        />
      )}
    </>
  );
};

export default CreateRiceVarietyModal;
