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

const EditMachineryModal = ({ show, closeModal, machinery, onSave }) => {
  const [formData, setFormData] = useState({
    name: machinery?.name || "",
    description: machinery?.description || "",
    costPerHour: machinery?.costPerHour || "",
    hoursUsed: machinery?.hoursUsed || "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (machinery) {
      const fetchMachinery = async () => {
        try {
          const response = await axiosInstance.get(`/machinery/${machinery.id}`);
          const fetchedMachinery = response.data;

          setFormData({
            name: fetchedMachinery.name,
            description: fetchedMachinery.description,
            costPerHour: fetchedMachinery.costPerHour,
            hoursUsed: fetchedMachinery.hoursUsed,
          });
        } catch (error) {
          console.error("Error al obtener la maquinaria:", error);
          setErrorMessage("Error al cargar los datos de la maquinaria.");
        }
      };

      fetchMachinery();
    }
  }, [machinery]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && value.length >= 99) {
      setErrorMessage("El campo 'Nombre' no puede exceder los 100 caracteres.");
    } else if (name === "description" && value.length >= 299) {
      setErrorMessage("El campo 'Descripción' no puede exceder los 300 caracteres.");
    } else if (name === "costPerHour" && value.length > 20) {
      setErrorMessage("El campo 'Costo por Hora' no puede exceder los 20 dígitos.");
    } else {
      setFormData({ ...formData, [name]: value });
      setErrorMessage("");
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

    if (formData.costPerHour.length > 20) {
      setErrorMessage("No se puede enviar porque se superó el límite de 20 dígitos en el campo 'Costo por Hora'.");
      return;
    }

    try {
      setErrorMessage("");
      // Realiza una solicitud PUT para actualizar la maquinaria
      await axiosInstance.put(`/machinery/${machinery.id}`, formData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al editar la maquinaria:", error);
      setErrorMessage("Error inesperado al editar la maquinaria.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal();
    onSave(); // Refrescar la lista de maquinarias
  };

  return (
    <>
      {show && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={closeModal}>×</CloseButton>
            <Title>Editar Maquinaria</Title>
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
                <label>Tipo de Maquinaria</label>
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
              <SubmitButton type="submit">Guardar Cambios</SubmitButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={handleCloseSuccessModal}
          message="¡Maquinaria editada exitosamente!"
        />
      )}
    </>
  );
};

export default EditMachineryModal;
