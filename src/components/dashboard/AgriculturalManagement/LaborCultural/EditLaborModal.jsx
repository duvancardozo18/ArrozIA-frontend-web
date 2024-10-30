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
      box-shadow: 0px 0px 8px 2px rgba(39, 174, 96, 0.3); /* Efecto de iluminación */
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

const EditLaborModal = ({ closeModal, labor, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (labor) {
      setFormData({
        nombre: labor.nombre,
        descripcion: labor.descripcion,
      });
    }
  }, [labor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.nombre || !formData.descripcion) {
      setErrorMessage("Por favor, complete todos los campos.");
      return;
    }

    try {
      const response = await axiosInstance.put(`/labor-cultural/update/${labor.id}`, formData);
      setShowSuccessModal(true);
      onSave({ ...labor, ...formData }); // Pasamos los datos editados al componente padre
    } catch (error) {
      console.error("Error al editar la labor cultural:", error);
      setErrorMessage("Hubo un error al editar la labor cultural.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal();
  };

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <Title>Editar Labor Cultural</Title>
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
              />
            </InputGroup>

            <SubmitButton type="submit">Actualizar</SubmitButton>
          </form>
        </ModalContent>
      </ModalOverlay>
      {showSuccessModal && (
        <SuccessModal
          onClose={handleCloseSuccessModal}
          message="¡Labor Cultural Editada Exitosamente!"
        />
      )}
    </>
  );
};

export default EditLaborModal;
