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
  padding: 20px;
  border-radius: 20px;
  width: 500px;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.2);
  position: relative;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 15px;
  color: #555;
  text-decoration: underline;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;

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

const HarvestForm = ({ cultivoId, onSave, fetchHarvests }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fecha_cosecha: "",
    precio_carga_mercado: "",
    gasto_transporte_cosecha: "",
    gasto_recoleccion: "",
    cantidad_producida_cosecha: "",
    venta_cosecha: "",
  });
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" })); // Limpia errores al escribir
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Verificar si ya existe una cosecha para el cultivo
      const existingHarvests = await axiosInstance.get(`/harvest/crops/${cultivoId}`);
      if (existingHarvests.data.cosechas.length > 0) {
        alert("Solo puedes registrar una cosecha por cultivo.");
        return;
      }

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

      const response = await axiosInstance.post("/harvest/", {
        cultivo_id: cultivoId,
        fecha_cosecha: formData.fecha_cosecha,
        precio_carga_mercado: parseFloat(formData.precio_carga_mercado),
        gasto_transporte_cosecha: parseFloat(formData.gasto_transporte_cosecha),
        gasto_recoleccion: parseFloat(formData.gasto_recoleccion),
        cantidad_producida_cosecha: parseFloat(formData.cantidad_producida_cosecha),
        venta_cosecha: parseFloat(formData.venta_cosecha),
      });

      if (response.status === 200) {
        setShowSuccessModal(true);
        setErrors({});
        onSave(response.data);
        setIsModalOpen(false);

        // Refrescar los datos en la tabla
        fetchHarvests();
      }
    } catch (error) {
      console.error("Error al registrar la cosecha:", error);
    }
  };

  return (
    <>
      {/* <AddButton onClick={() => setIsModalOpen(true)}>Agregar Cosecha</AddButton> */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
            <Title>Registrar Cosecha</Title>
            <form onSubmit={handleSubmit}>
              <SectionTitle>Producción</SectionTitle>
              <InputGroup>
                <label>Fecha de Cosecha</label>
                <input
                  type="date"
                  name="fecha_cosecha"
                  value={formData.fecha_cosecha}
                  onChange={handleChange}
                />
              </InputGroup>
              <InputGroup>
                <label>Cantidad Producida</label>
                <input
                  type="number"
                  name="cantidad_producida_cosecha"
                  value={formData.cantidad_producida_cosecha}
                  onChange={handleChange}
                />
              </InputGroup>
              <InputGroup>
                <label>Valor de la Cosecha</label>
                <input
                  type="number"
                  name="venta_cosecha"
                  value={formData.venta_cosecha}
                  onChange={handleChange}
                />
              </InputGroup>

              <SectionTitle>Gastos</SectionTitle>
              <InputGroup>
                <label>Precio de Recolección</label>
                <input
                  type="number"
                  name="gasto_recoleccion"
                  value={formData.gasto_recoleccion}
                  onChange={handleChange}
                />
              </InputGroup>
              <InputGroup>
                <label>Precio de Transporte de Cosecha</label>
                <input
                  type="number"
                  name="gasto_transporte_cosecha"
                  value={formData.gasto_transporte_cosecha}
                  onChange={handleChange}
                />
              </InputGroup>

              <SectionTitle>Mercado</SectionTitle>
              <InputGroup>
                <label>Valor Unitario de Compra de la Carga</label>
                <input
                  type="number"
                  name="precio_carga_mercado"
                  value={formData.precio_carga_mercado}
                  onChange={handleChange}
                />
              </InputGroup>

              <SubmitButton type="submit">Guardar Cosecha</SubmitButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          message="¡Cosecha registrada con éxito!"
        />
      )}
    </>
  );
};

export default HarvestForm;
