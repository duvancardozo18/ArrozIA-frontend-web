import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axiosInstance from "../../../../config/AxiosInstance";
import SuccessModal from "../../modal/SuccessModal"; // Importa el modal de éxito

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
  flex: 1;

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

const EditVarietyModal = ({ show, closeModal, variety }) => {
  const [formData, setFormData] = useState({
    nombre: variety.nombre || "",
    numero_registro_productor_ica: variety.numero_registro_productor_ica || "",
    caracteristicas_variedad: variety.caracteristicas_variedad || "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (variety) {
      setFormData({
        nombre: variety.nombre,
        numero_registro_productor_ica: variety.numero_registro_productor_ica,
        caracteristicas_variedad: variety.caracteristicas_variedad,
      });
    }
  }, [variety]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validar longitud de los campos
    if ((name === "nombre" || name === "numero_registro_productor_ica") && value.length > 50) {
      setErrorMessage(`Límite de 50 caracteres alcanzado para Registro ICA`);
    } else {
      setFormData({ ...formData, [name]: value });
      setErrorMessage(""); // Limpiar mensaje de error cuando la longitud es válida
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      if (formData.nombre.length > 50 || formData.numero_registro_productor_ica.length > 50) {
        setErrorMessage("No se puede enviar porque se superaron los límites de caracteres.");
        return;
      }

      await axiosInstance.put(`/update-variety/${variety.id}`, formData);
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage("Error al editar la variedad.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal(); // Cierra el modal
    window.location.reload(); // Refresca la página al cerrar el modal
  };

  return (
    <>
      {show && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={closeModal}>×</CloseButton>
            <Title>Editar Variedad de Arroz</Title>
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
                />
              </InputGroup>
              <InputGroup>
                <label>Características</label>
                <textarea
                  name="caracteristicas_variedad"
                  value={formData.caracteristicas_variedad}
                  onChange={handleChange}
                  rows={3}
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
          message="¡Variedad editada exitosamente!"
        />
      )}
    </>
  );
};

export default EditVarietyModal;
