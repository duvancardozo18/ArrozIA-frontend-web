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

const CreateInsumoModal = ({ closeModal, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    unidad_id: "",
    costo_unitario: "",
    descripcion: "",
  });

  const [unidades, setUnidades] = useState([]); // Estado para las unidades de medida
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Obtener todas las unidades de medida desde el backend al cargar el componente
  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const response = await axiosInstance.get("/input_units"); // Ruta ajustada
        setUnidades(response.data); // Asumiendo que la respuesta es una lista de unidades de medida
      } catch (error) {
        console.error("Error al obtener las unidades de medida:", error);
        setErrorMessage("Error al cargar las unidades de medida.");
      }
    };

    fetchUnidades();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validar longitud de nombre (máximo 100 caracteres)
    if (name === "nombre" && value.length > 100) {
      setErrorMessage("El campo 'Nombre' no puede exceder los 100 caracteres.");
    } else {
      setFormData({ ...formData, [name]: value });
      setErrorMessage(""); // Limpiar mensaje de error cuando es válido
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Validación antes de enviar
      if (formData.nombre.length > 100) {
        setErrorMessage("No se puede enviar porque se superó el límite de 100 caracteres en el campo 'Nombre'.");
        return;
      }

      // Asegurarse de que los datos sean correctos
      const dataToSend = {
        ...formData,
        unidad_id: parseInt(formData.unidad_id, 10),
        costo_unitario: parseFloat(formData.costo_unitario),
      };

      console.log("Enviando insumo al backend: ", dataToSend);  // Log de depuración

      // Conexión con el backend para registrar insumo
      const response = await axiosInstance.post("/register-input", dataToSend);
      console.log("Respuesta del backend:", response);  // Log de la respuesta

      if (response.status === 200) {
        setShowSuccessModal(true);  // Mostrar modal de éxito si el insumo se crea correctamente
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al crear el insumo:", error.response?.data);
      setErrorMessage("Error inesperado al crear el insumo.");
    }
  };

  // Esta función se encarga de manejar el cierre del modal de éxito
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);

    // Envía los datos del nuevo insumo para que se agregue directamente a la tabla
    const newInsumo = {
      id: Date.now(), // Solo para simular un ID único, debes reemplazar con el ID real si el backend lo devuelve
      ...formData,
    };
    onSave(newInsumo); // Pasa el nuevo insumo al padre para que lo agregue a la tabla
    closeModal(); // Cierra el modal de creación
  };

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Crear Insumo
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
              <label>Unidad de Medida</label>
              <select
                name="unidad_id"
                value={formData.unidad_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar Unidad</option>
                {unidades.map((unidad) => (
                  <option key={unidad.id} value={unidad.id}>
                    {unidad.nombre}
                  </option>
                ))}
              </select>
            </InputGroup>

            <InputGroup>
              <label>Costo Unitario</label>
              <input
                type="number"
                step="0.01"
                name="costo_unitario"
                value={formData.costo_unitario}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <label>Descripción (Opcional)</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={3}
              />
            </InputGroup>

            <SubmitButton type="submit">Crear Insumo</SubmitButton>
          </form>
        </ModalContent>
      </ModalOverlay>
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={handleCloseSuccessModal}
          message="¡Insumo Creado!"
        />
      )}
    </>
  );
};

export default CreateInsumoModal;
