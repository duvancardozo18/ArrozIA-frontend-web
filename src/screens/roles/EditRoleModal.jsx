import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../config/AxiosInstance';
import EditSuccessRole from './EditSuccessRole'; // Importa el modal de éxito

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
  max-width: 100%;
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
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [permissions, setPermissions] = useState([]); // Estado inicializado como array vacío
  const [selectedPermissions, setSelectedPermissions] = useState([]); // Estado para almacenar permisos seleccionados
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Estado para el modal de éxito

  useEffect(() => {
    if (role && role.id) {
      setNombre(role.nombre || '');
      setDescripcion(role.descripcion || '');

      // Cargar permisos actuales del rol
      const currentPermissions = role.permisos ? role.permisos.map(permiso => permiso.id) : [];
      setSelectedPermissions(currentPermissions);

      // Cargar lista de permisos disponibles
      const fetchPermissions = async () => {
        try {
          const response = await axiosInstance.get('/permissions');
          setPermissions(response.data.permissions || []); // Asegurar que sea un array
        } catch (error) {
          console.error("Error al obtener los permisos:", error);
        }
      };

      fetchPermissions();
    }
  }, [role]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedPermissions((prevState) => {
      const updatedPermissions = checked
        ? [...prevState, parseInt(value)]
        : prevState.filter((permisoId) => permisoId !== parseInt(value));

      return updatedPermissions;
    });
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
        permisos: selectedPermissions // Enviar permisos seleccionados
      });
      console.log("Respuesta del backend:", response.data);
      onSave();
      setShowSuccessModal(true); // Muestra el modal de éxito
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal(); // Cierra el modal de edición

    // Refresca la página con un ligero retraso para que sea imperceptible
    setTimeout(() => {
      window.location.reload();
    }, 100); // Retraso de 100ms para que el refresco parezca instantáneo
  };

  if (!show) return null;

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Editar Rol</h2>
          <InputGroup>
            <label>Nombre del rol</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <label>Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </InputGroup>
          <CheckboxGroup>
            <label>Permisos</label>
            {permissions.map((permiso) => (
              <CheckboxLabel key={permiso.id}>
                <input
                  type="checkbox"
                  value={permiso.id}
                  checked={selectedPermissions.includes(permiso.id)} // Marcado si está en selectedPermissions
                  onChange={handleCheckboxChange}
                />
                {permiso.nombre}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
          <SubmitButton onClick={handleUpdateRole}>Guardar Cambios</SubmitButton>
        </ModalContent>
      </ModalOverlay>

      {/* Modal de Éxito */}
      {showSuccessModal && (
        <EditSuccessRole show={showSuccessModal} closeModal={handleCloseSuccessModal} />
      )}
    </>
  );
};

export default EditRoleModal;
