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

const FlexContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const HalfInputGroup = styled.div`
  flex: 1;

  label {
    font-size: 0.9em;
    font-weight: bold;
  }

  input,
  select {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ddd;
    font-size: 16px;
    box-sizing: border-box;
    transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;

    &:focus {
      box-shadow: 0px 0px 8px 2px rgba(39, 174, 96, 0.3);
      transform: translateY(-3px);
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
    cantidad: "",
    unidad_id: "",
    costo_unitario: "",
    descripcion: "",
    tipo_insumo_id: "", // Nuevo campo
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [units, setUnits] = useState([]);
  const [tiposInsumo, setTiposInsumo] = useState([]); // Estado para los tipos de insumo

  // Efecto para obtener unidades y tipos de insumo
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unitsResponse, tiposResponse] = await Promise.all([
          axiosInstance.get("/units"), // Ruta para unidades
          axiosInstance.get("/input-types"), // Ruta para tipos de insumo
        ]);

        setUnits(unitsResponse.data);
        setTiposInsumo(tiposResponse.data);
      } catch (error) {
        setErrorMessage("Error al cargar los datos iniciales.");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const dataToSend = {
        ...formData,
        unidad_id: parseInt(formData.unidad_id, 10),
        tipo_insumo_id: parseInt(formData.tipo_insumo_id, 10),
        costo_unitario: parseFloat(formData.costo_unitario),
      };

      const response = await axiosInstance.post("/register-input", dataToSend);

      if (response.status === 200) {
        setShowSuccessModal(true);
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      setErrorMessage("Error inesperado al crear el insumo.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onSave();
    closeModal();
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

            <FlexContainer>
              <HalfInputGroup>
                <label>Cantidad</label>
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleChange}
                  required
                />
              </HalfInputGroup>

              <HalfInputGroup>
                <label>Unidad de Medida</label>
                <select
                  name="unidad_id"
                  value={formData.unidad_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona una unidad</option>
                  {units.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      {unit.nombre}
                    </option>
                  ))}
                </select>
              </HalfInputGroup>
            </FlexContainer>

            <InputGroup>
              <label>Tipo de Insumo</label>
              <select
                name="tipo_insumo_id"
                value={formData.tipo_insumo_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un tipo</option>
                {tiposInsumo.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
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
