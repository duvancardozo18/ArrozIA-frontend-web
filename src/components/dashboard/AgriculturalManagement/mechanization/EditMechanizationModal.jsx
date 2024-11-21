import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axiosInstance from "../../../../config/AxiosInstance";
import SuccessModal from "../../modal/SuccessModal"; // Import the success modal

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
  textarea,
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

const EditMechanizationModal = ({ show, closeModal, mechanization }) => {
  // Si mechanization está indefinido, usa valores predeterminados
  const [formData, setFormData] = useState({
    tarea_labor_id: mechanization?.taskId || "",
    nombre_mecanizacion: mechanization?.mechanizationName || "",
    maquinaria_id: mechanization?.machineryId || "",
    horas_uso: mechanization?.hoursUsed || "",
  });

  const [laborOptions, setLaborOptions] = useState([]);
  const [maquinariaOptions, setMaquinariaOptions] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch options for tarea_labor_id and maquinaria_id from the backend
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [laborsResponse, machineryResponse] = await Promise.all([
          axiosInstance.get("/tasks"),
          axiosInstance.get("/machinery"),
        ]);

        setLaborOptions(laborsResponse.data);
        setMaquinariaOptions(machineryResponse.data);
      } catch (error) {
        console.error("Error fetching options:", error);
        setErrorMessage("Error al obtener las opciones.");
      }
    };

    if (mechanization) {
      setFormData({
        tarea_labor_id: mechanization.taskId,
        nombre_mecanizacion: mechanization.mechanizationName,
        maquinaria_id: mechanization.machineryId,
        horas_uso: mechanization.hoursUsed,
      });
    }

    fetchOptions();
  }, [mechanization]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nombre_mecanizacion" && value.length > 50) {
      setErrorMessage("Límite de 50 caracteres alcanzado.");
    } else {
      setFormData({ ...formData, [name]: value });
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      if (formData.nombre_mecanizacion.length > 50) {
        setErrorMessage("El límite de caracteres ha sido superado.");
        return;
      }

      await axiosInstance.put(`/operation-mechanization/${mechanization.id}`, formData);
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage("Error al editar la operación de mecanización.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal();
    window.location.reload();
  };

  if (!mechanization) return null;  // Evitar renderizar si mechanization no está definido

  return (
    <>
      {show && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={closeModal}>×</CloseButton>
            <Title>Editar Operación de Mecanización</Title>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <form onSubmit={handleSubmit}>
              {/* Tarea Labor ID selection */}
              <InputGroup>
                <label>Seleccionar Tarea Labor</label>
                <select
                  name="tarea_labor_id"
                  value={formData.tarea_labor_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una tarea labor</option>
                  {laborOptions.map((labor) => (
                    <option key={labor.id} value={labor.id}>
                      {labor.nombre}
                    </option>
                  ))}
                </select>
              </InputGroup>

              {/* Nombre de mecanización */}
              <InputGroup>
                <label>Nombre de Mecanización</label>
                <input
                  type="text"
                  name="nombre_mecanizacion"
                  value={formData.nombre_mecanizacion}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              {/* Maquinaria ID selection */}
              <InputGroup>
                <label>Seleccionar Maquinaria</label>
                <select
                  name="maquinaria_id"
                  value={formData.maquinaria_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione maquinaria</option>
                  {maquinariaOptions.map((maquinaria) => (
                    <option key={maquinaria.id} value={maquinaria.id}>
                      {maquinaria.nombre}
                    </option>
                  ))}
                </select>
              </InputGroup>

              {/* Horas de uso */}
              <InputGroup>
                <label>Horas de Uso</label>
                <input
                  type="number"
                  step="0.01"
                  name="horas_uso"
                  value={formData.horas_uso}
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
          message="¡Operación de mecanización editada exitosamente!"
        />
      )}
    </>
  );
};

export default EditMechanizationModal
