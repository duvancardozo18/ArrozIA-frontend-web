import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axiosInstance from "../../../config/AxiosInstance";
import EditSuccessRole from "../../dashboard/modal/SuccessModal";

// Estilos para el modal, input y botones
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

const EditRoleModal = ({ show, closeModal, role, onSave }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (role && role.id) {
      setNombre(role.nombre || "");
      setDescripcion(role.descripcion || "");

      const fetchPermissions = async () => {
        try {
          const [allPermissionsResponse, rolePermissionsResponse] =
            await Promise.all([
              axiosInstance.get("/permissions"),
              axiosInstance.get(`/roles/${role.id}/permissions`),
            ]);

          const allPermissions = allPermissionsResponse.data.permissions || [];
          const rolePermissionNames =
            rolePermissionsResponse.data.permissions || [];

          const permissionNameToId = {};
          allPermissions.forEach((permiso) => {
            permissionNameToId[permiso.nombre] = Number(permiso.id);
          });

          const rolePermissionIds = rolePermissionNames
            .map((permisoNombre) => {
              const id = permissionNameToId[permisoNombre];
              if (isNaN(id)) {
                console.warn(
                  "ID de permiso inválido para permiso:",
                  permisoNombre
                );
              }
              return id;
            })
            .filter((id) => !isNaN(id));

          const allPermissionsWithNumberIds = allPermissions.map((permiso) => ({
            ...permiso,
            id: Number(permiso.id),
          }));

          setPermissions(allPermissionsWithNumberIds);
          setSelectedPermissions(rolePermissionIds);
        } catch (error) {
          console.error("Error al obtener los permisos:", error);
        }
      };

      fetchPermissions();
    }
  }, [role]);

  const handleCheckboxChange = async (e) => {
    const { value, checked } = e.target;
    const permisoId = Number(value);

    if (checked) {
      // Agregar el permiso al rol
      try {
        await axiosInstance.put(`/roles/${role.id}/permissions/${permisoId}`);
        setSelectedPermissions((prevState) => [...prevState, permisoId]);
      } catch (error) {
        console.error(
          `Error al agregar el permiso con ID ${permisoId}:`,
          error
        );
      }
    } else {
      // Eliminar el permiso del rol
      try {
        await axiosInstance.delete(
          `/roles/${role.id}/permissions/${permisoId}`
        );
        setSelectedPermissions((prevState) =>
          prevState.filter((id) => id !== permisoId)
        );
      } catch (error) {
        console.error(
          `Error al eliminar el permiso con ID ${permisoId}:`,
          error
        );
      }
    }
  };

  const handleUpdateRole = async () => {
    if (!role || !role.id) {
      console.error("No se pudo editar el rol: ID de rol indefinido.");
      return;
    }

    try {
      const response = await axiosInstance.put(`/roles/${role.id}`, {
        nombre,
        descripcion,
        permisos: selectedPermissions, // Enviar permisos seleccionados (IDs)
      });
      onSave();
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal();
  };

  const handleCloseModal = () => {
    setSelectedPermissions([]);
    closeModal();
  };

  if (!show && !showSuccessModal) return null;

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={handleCloseModal}>×</CloseButton>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Editar Rol
          </h2>
          <InputGroup>
            <label>Nombre del rol</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </InputGroup>
          <CheckboxGroup>
            <label>Permisos</label>
            {permissions.length > 0 ? (
              permissions.map((permiso, index) => (
                <CheckboxLabel key={index}>
                  <input
                    type="checkbox"
                    value={permiso.id}
                    checked={selectedPermissions.includes(permiso.id)}
                    onChange={handleCheckboxChange}
                  />
                  {permiso.nombre}
                </CheckboxLabel>
              ))
            ) : (
              <p>No hay permisos disponibles</p>
            )}
          </CheckboxGroup>

          <SubmitButton onClick={handleUpdateRole}>
            Guardar Cambios
          </SubmitButton>
        </ModalContent>
      </ModalOverlay>

      {showSuccessModal && (
        <EditSuccessRole
          show={showSuccessModal}
          onClose={handleCloseSuccessModal}
          message="¡Rol Actualizado!"
        />
      )}
    </>
  );
};

export default EditRoleModal;
