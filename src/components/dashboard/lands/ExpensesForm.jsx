import React, { useState } from "react";
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
  position: relative;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 24px;
  margin-bottom: 30px;
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

  input {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ddd;
    font-size: 16px;

    &:focus {
      box-shadow: 0px 0px 8px 2px rgba(39, 174, 96, 0.3);
      outline: none;
    }
  }

  p {
    color: #ff6b6b;
    font-size: 14px;
    margin-top: 5px;
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
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const AddButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ExpensesForm = ({ cultivoId, onSave }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    concepto: "",
    descripcion: "",
    precio: "",
  });
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value.length > 50) {
      setErrors((prev) => ({ ...prev, [name]: "No puede exceder los 50 caracteres." }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validar campos vacíos
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = "Este campo no puede estar vacío.";
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const response = await axiosInstance.post("/costs", {
        ...formData,
        precio: parseFloat(formData.precio),
        cultivo_id: cultivoId,
      });

      if (response.status === 200) {
        setShowSuccessModal(true);
        setErrors({}); // Limpia errores
        onSave(response.data);
        setIsModalOpen(false); // Cierra el modal solo si se registra correctamente
      }
    } catch (error) {
      // Mostrar mensaje de error solo si hay un problema real
      setErrors({
        general: "Error al registrar el costo. Por favor, intenta nuevamente.",
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrors({}); // Limpia errores al cerrar el modal
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <>
      <AddButton onClick={() => setIsModalOpen(true)}>Agregar Costo</AddButton>
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={handleCloseModal}>×</CloseButton>
            <Title>Registrar Costo</Title>
            <form onSubmit={handleSubmit}>
              <InputGroup>
                <label>Concepto</label>
                <input
                  type="text"
                  name="concepto"
                  value={formData.concepto}
                  onChange={handleChange}
                />
                {errors.concepto && <p>{errors.concepto}</p>}
              </InputGroup>
              <InputGroup>
                <label>Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                />
                {errors.descripcion && <p>{errors.descripcion}</p>}
              </InputGroup>
              <InputGroup>
                <label>Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                />
                {errors.precio && <p>{errors.precio}</p>}
              </InputGroup>
              <SubmitButton type="submit">Guardar Costo</SubmitButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={handleCloseSuccessModal}
          message="¡Costo registrado con éxito!"
        />
      )}
    </>
  );
};

export default ExpensesForm;
