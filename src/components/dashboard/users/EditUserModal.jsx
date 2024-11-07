import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axiosInstance from "../../../config/AxiosInstance";
import EditSuccessModal from "../modal/SuccessModal"; // Importa el modal de éxito

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

// Otros componentes estilizados omitidos para brevedad...

const EditModal = ({ show, closeModal, user, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "", // Contraseña opcional
    rol_id: "",
    finca_id: "",
  });

  const [roles, setRoles] = useState([]);
  const [fincas, setFincas] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol_id: user.rol_id,
        finca_id: user.finca_id,
      });
    }
    const fetchRolesAndFincas = async () => {
      try {
        const rolesResponse = await axiosInstance.get("/roles");
        setRoles(rolesResponse.data.roles || []);

        const fincasResponse = await axiosInstance.get("/farms");
        setFincas(fincasResponse.data || []);
      } catch (error) {
        setErrorMessage("Error al cargar roles y fincas. Intente nuevamente.");
      }
    };

    fetchRolesAndFincas();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      // Separar la lógica según los campos que hayan cambiado
      const updatedFields = {};

      // Si el nombre, apellido o email cambian, actualiza esos campos
      if (
        formData.nombre !== user.nombre ||
        formData.apellido !== user.apellido ||
        formData.email !== user.email
      ) {
        updatedFields.nombre = formData.nombre;
        updatedFields.apellido = formData.apellido;
        updatedFields.email = formData.email;

        await axiosInstance.put(`/users/update/${user.id}`, updatedFields);
        setShowSuccessModal(true);
      }

      // Si solo cambia la contraseña
      if (formData.password) {
        await axiosInstance.put(`/users/update-password/${user.id}`, {
          password: formData.password,
        });
        setShowSuccessModal(true);
      }

      // Si solo cambia la finca
      if (formData.finca_id !== user.finca_id) {
        await axiosInstance.put(`/user-farm/update/${user.id}`, {
          finca_id: parseInt(formData.finca_id, 10),
        });
        setShowSuccessModal(true);
      }

      // Si solo cambia el rol
      if (formData.rol_id !== user.rol_id) {
        const updatedRoleData = {
          usuario_id: parseInt(user.id, 10),
          rol_id: parseInt(formData.rol_id, 10),
        };
        // console.log('Datos enviados:', updatedRoleData);
        await axiosInstance.put(`/user-roles/update/${user.id}`, updatedRoleData);
        setShowSuccessModal(true);
      }

      // Cerrar el modal y llamar a la función onSave para actualizar la información
      closeModal();
      onSave();
    } catch (error) {
      setErrorMessage("Error actualizando el usuario.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  if (!show && !showSuccessModal) return null;

  return (
    <>
      {show && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={closeModal}>×</CloseButton>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              Editar usuario
            </h2>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <form onSubmit={handleSubmit}>
              <FormGrid>
                {/* Primera columna: Nombre, Apellido, Email */}
                <Column>
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
                    <label>Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                  
                </Column>

                {/* Segunda columna: Finca y Rol */}
                <Column>
                <InputGroup>
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                 
                  <InputGroup>
                    <label>Rol</label>
                    <select
                      name="rol_id"
                      value={formData.rol_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione un rol</option>
                      {roles.map((rol) => (
                        <option key={rol.id} value={rol.id}>
                          {rol.nombre}
                        </option>
                      ))}
                    </select>
                  </InputGroup>
                </Column>
              </FormGrid>
              <SubmitButton type="submit">Guardar Cambios</SubmitButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
      {showSuccessModal && (
        <EditSuccessModal
          show={showSuccessModal}
          onClose={handleCloseSuccessModal}
          message="¡Información Actualizada!"
        />
      )}
    </>
  );
};

export default EditModal;
