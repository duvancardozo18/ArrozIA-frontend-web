import React, { useState, useEffect } from "react";
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
    box-sizing: border-box;
    font-size: 16px;
  }
`;

const CheckboxGroup = styled.div`
  margin-bottom: 20px;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  input {
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
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #218838;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #ff6b6b;
  }
`;

const NewRol = ({ show, closeModal, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    permisos: [],
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [permissions, setPermissions] = useState([]); // Estado para almacenar permisos disponibles

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axiosInstance.get("/permissions");
        setPermissions(response.data.permissions);
      } catch (error) {
        // console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => {
      const permisos = checked
        ? [...prevState.permisos, value]
        : prevState.permisos.filter((permiso) => permiso !== value);

      return { ...prevState, permisos };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post("/roles", formData);
      // console.log('Rol creado:', response.data);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creando el rol:", error);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal(); // Cierra el modal principal también
    onSave(); // Refresca la tabla de roles
  };

  if (show) return null;
  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Crear Rol
          </h2>
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <label>Nombre del Rol</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </InputGroup>
            {/* <InputGroup>
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows="4"
              />
            </InputGroup> */}
            <CheckboxGroup>
              <label>Permisos</label>
              {permissions.map((permiso) => (
                <CheckboxLabel key={permiso.id}>
                  <input
                    type="checkbox"
                    value={permiso.id}
                    onChange={handleCheckboxChange}
                  />
                  {permiso.nombre}
                </CheckboxLabel>
              ))}
            </CheckboxGroup>
            <SubmitButton type="submit">Crear</SubmitButton>
          </form>
        </ModalContent>
      </ModalOverlay>
      {showSuccessModal && (
        <SuccessModal
          onClose={handleCloseSuccessModal}
          message="¡Rol Creado!"
        />
      )}
    </>
  );
};

export default NewRol;
