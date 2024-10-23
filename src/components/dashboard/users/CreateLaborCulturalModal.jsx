import React, { useState } from "react";
import styled from "styled-components";
import axiosInstance from "../../../config/AxiosInstance";
import SuccessModal from "../modal/SuccessModal";
import PropTypes from "prop-types";

// Estilos del modal y formulario
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
  width: 600px;
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
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #ff6b6b;
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;

  label {
    font-weight: bold;
    margin-bottom: 5px;
  }

  input, textarea {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ddd;
    font-size: 16px;
    box-sizing: border-box;

    &:focus {
      box-shadow: 0px 0px 8px 2px rgba(39, 174, 96, 0.3);
      outline: none;
    }
  }
`;

// Estilo para agrupar las fechas y horas en columnas
const FormGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const Column = styled.div`
  flex: 1;
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

const NewLaborCultural = ({ closeModal, onSave = () => {}, labor = null }) => {
  const [formData, setFormData] = useState({
    nombre: labor?.nombre || "",
    descripcion: labor?.descripcion || "",
    recursos: labor?.recursos || "",
    fechaInicio: labor?.fechaInicio || "",
    horaInicio: labor?.horaInicio || "",
    fechaFin: labor?.fechaFin || "",
    horaFin: labor?.horaFin || ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Validación de formulario
  const validateForm = () => {
    const { nombre, descripcion, recursos, fechaInicio, horaInicio, fechaFin, horaFin } = formData;

    if (!nombre || !descripcion || !recursos || !fechaInicio || !horaInicio || !fechaFin || !horaFin) {
      return "Todos los campos son obligatorios.";
    }

    const start = new Date(`${fechaInicio}T${horaInicio}`);
    const end = new Date(`${fechaFin}T${horaFin}`);

    if (start >= end) {
      return "La fecha y hora de finalización debe ser mayor que la fecha y hora de inicio.";
    }

    return null;
  };

  // Envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      if (labor) {
        // Actualizar labor existente
        await axiosInstance.put(`/labor-cultural/${labor.id}`, formData);
      } else {
        // Registrar nueva labor
        await axiosInstance.post("/labor-cultural/register", formData);
      }

      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage(error.message || "Error procesando la labor cultural.");
    }
  };

  const handleDelete = async () => {
    try {
      if (!labor) return;
      await axiosInstance.delete(`/labor-cultural/${labor.id}`);
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage("Error al eliminar la labor cultural.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal();
    onSave(); // Refresca la tabla después de cerrar el modal
  };

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            {labor ? "Editar Labor Cultural" : "Registrar Labor Cultural"}
          </h2>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <label>Nombre</label>
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
                rows="4"
                required
              />
            </InputGroup>
            <InputGroup>
              <label>Recursos</label>
              <textarea
                name="recursos"
                value={formData.recursos}
                onChange={handleChange}
                rows="2"
                required
              />
            </InputGroup>

            {/* Agrupamos fecha y hora en dos columnas */}
            <FormGrid>
              <Column>
                <InputGroup>
                  <label>Fecha de Inicio</label>
                  <input
                    type="date"
                    name="fechaInicio"
                    value={formData.fechaInicio}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
                <InputGroup>
                  <label>Hora de Inicio</label>
                  <input
                    type="time"
                    name="horaInicio"
                    value={formData.horaInicio}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </Column>
              <Column>
                <InputGroup>
                  <label>Fecha de Finalización</label>
                  <input
                    type="date"
                    name="fechaFin"
                    value={formData.fechaFin}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
                <InputGroup>
                  <label>Hora de Finalización</label>
                  <input
                    type="time"
                    name="horaFin"
                    value={formData.horaFin}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </Column>
            </FormGrid>

            <SubmitButton type="submit">
              {labor ? "Editar Labor" : "Registrar Labor"}
            </SubmitButton>
            {labor && (
              <SubmitButton
                type="button"
                style={{ marginTop: "10px", backgroundColor: "#e74c3c" }}
                onClick={handleDelete}
              >
                Eliminar Labor
              </SubmitButton>
            )}
          </form>
        </ModalContent>
      </ModalOverlay>
      {showSuccessModal && (
        <SuccessModal
          onClose={handleCloseSuccessModal}
          message={labor ? "¡Labor Cultural Actualizada!" : "¡Labor Cultural Registrada!"}
        />
      )}
    </>
  );
};

NewLaborCultural.propTypes = {
  closeModal: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  labor: PropTypes.object // Si hay una labor, la pasamos para editar
};

export default NewLaborCultural;
