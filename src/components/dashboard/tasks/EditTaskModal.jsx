import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axiosInstance from "../../../config/AxiosInstance";
import SuccessModal from "../modal/SuccessModal"; // Modal de éxito

// Estilos
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

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 24px;
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

  input,
  select,
  textarea {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ddd;
  }

  input[type="checkbox"] {
    margin-right: 10px;
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

  &:hover {
    background-color: #218838;
  }
`;

const EditTaskModal = ({ show, closeModal, task, onSave }) => {
  const [formData, setFormData] = useState({
    descripcion: task?.descripcion || "",
    cantidad_insumo: task?.cantidad_insumo || "",
    precio_labor_cultural: task?.precio_labor_cultural || "",
    insumo_agricola_id: task?.insumo_agricola_id || "",
    labor_cultural_id: task?.labor_cultural_id || "",
    maquinaria_agricola_id: task?.maquinaria_agricola_id || "",
    es_mecanizable: task?.es_mecanizable || false,
    usuario_id: task?.usuario_id || "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Convertir los datos a los tipos correctos antes de enviarlos
    const updatedFormData = {
      ...formData,
      cantidad_insumo: parseInt(formData.cantidad_insumo, 10),
      precio_labor_cultural: parseFloat(formData.precio_labor_cultural),
      insumo_agricola_id: parseInt(formData.insumo_agricola_id, 10),
      labor_cultural_id: parseInt(formData.labor_cultural_id, 10),
      maquinaria_agricola_id: parseInt(formData.maquinaria_agricola_id, 10),
      es_mecanizable: formData.es_mecanizable === true,  // Si es un valor booleano
    };

    // Verificar los datos antes de enviarlos
    console.log("Datos enviados al servidor:", updatedFormData);

    try {
      setErrorMessage("");
      await axiosInstance.put(`tasks/${task.id}`, updatedFormData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al editar la tarea:", error);
      setErrorMessage("Error al guardar los cambios.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal();
    onSave();
  };

  if (!show) return null;

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <h2>Editar Tarea</h2>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <label>Descripción</label>
              <input
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <label>Cantidad de Insumo</label>
              <input
                type="number"
                name="cantidad_insumo"
                value={formData.cantidad_insumo}
                onChange={handleChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <label>Precio Labor Cultural</label>
              <input
                type="number"
                name="precio_labor_cultural"
                value={formData.precio_labor_cultural}
                onChange={handleChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <label>Insumo Agrícola ID</label>
              <input
                type="text"
                name="insumo_agricola_id"
                value={formData.insumo_agricola_id}
                onChange={handleChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <label>Labor Cultural ID</label>
              <input
                type="text"
                name="labor_cultural_id"
                value={formData.labor_cultural_id}
                onChange={handleChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <label>Maquinaria Agrícola ID</label>
              <input
                type="text"
                name="maquinaria_agricola_id"
                value={formData.maquinaria_agricola_id}
                onChange={handleChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <label>Es Mecanizable</label>
              <input
                type="checkbox"
                name="es_mecanizable"
                checked={formData.es_mecanizable}
                onChange={handleChange}
              />
              <span></span>
            </InputGroup>
            <InputGroup>
              <label>Usuario ID</label>
              <input
                type="text"
                name="usuario_id"
                value={formData.usuario_id}
                onChange={handleChange}
                required
              />
            </InputGroup>
            <SubmitButton type="submit">Guardar Cambios</SubmitButton>
          </form>
        </ModalContent>
      </ModalOverlay>
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={handleCloseSuccessModal}
          message="¡Tarea editada exitosamente!"
        />
      )}
    </>
  );
};

export default EditTaskModal;
