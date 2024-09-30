import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axiosInstance from "../../../config/AxiosInstance";
import SuccessModal from "../../dashboard/modal/SuccessModal";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate para la redirección

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
  max-width: 100%;
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

const NewAllotment = ({ closeModal, selectedFarm, refreshLands }) => {
  const [formData, setFormData] = useState({
    finca_id: "",
    nombre: "",
    latitud: "" || null,
    longitud: "" || null,
    area: "",
    unidad_area_id: "",
  });

  const [unidadesAreas, setUnidadesAreas] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnidadesAreas = async () => {
      try {
        const response = await axiosInstance.get("/unidades-areas");
        setUnidadesAreas(response.data);
      } catch (error) {
        console.error("Error al obtener las unidades de área:", error);
      }
    };

    fetchUnidadesAreas();
  }, []);

  useEffect(() => {
    if (selectedFarm) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        finca_id: selectedFarm.id,
      }));
    }
  }, [selectedFarm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    formData.latitud = formData.latitud || null;
    formData.longitud = formData.longitud || null;

    if (!formData.finca_id) {
      setErrorMessage("ID de finca no válido.");
      return;
    }

    try {
      setErrorMessage("");
      await axiosInstance.post("/register-land", formData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al crear el lote:", error);
      if (error.response && error.response.status === 400) {
        setErrorMessage("Error al crear el lote.");
      } else {
        setErrorMessage("Error inesperado al crear el lote.");
      }
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal();
    refreshLands(); // Actualiza la lista de lotes
    navigate(`/farms`, { state: { selectedFarm } }); // Redirige a la lista de lotes con la finca seleccionada
  };

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Crear Nuevo Lote
          </h2>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="fincaId" value={formData.finca_id} />

            <InputGroup>
              <label>Nombre del lote</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                maxLength={50}
                required
              />
            </InputGroup>

            <InputGroup>
              <label>Latitud</label>
              <input
                type="number"
                step="0.00001"
                name="latitud"
                value={formData.latitud || ""}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <label>Longitud</label>
              <input
                type="number"
                step="0.00001"
                name="longitud"
                value={formData.longitud || ""}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <label>Área del lote</label>
              <input
                type="number"
                step="0.01"
                name="area"
                value={formData.area || ""}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <label>Unidad de Área</label>
              <select
                name="unidad_area_id"
                value={formData.unidad_area_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione unidad de área</option>
                {unidadesAreas.map((unidad) => (
                  <option key={unidad.id} value={unidad.id}>
                    {unidad.unidad}
                  </option>
                ))}
              </select>
            </InputGroup>

            <SubmitButton type="submit">Crear Lote</SubmitButton>
          </form>
        </ModalContent>
      </ModalOverlay>
      {showSuccessModal && (
         <SuccessModal
         onClose={handleCloseSuccessModal}
         message="¡Lote Creado!"
       />
      )}
    </>
  );
};

export default NewAllotment;
