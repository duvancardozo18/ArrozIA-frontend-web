import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../config/AxiosInstance';

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

  useEffect(() => {
    if (role && role.id) {
      setNombre(role.nombre || '');
      setDescripcion(role.descripcion || '');
    } else {
      console.error("No se pudo editar el rol: ID de rol indefinido.");
    }
  }, [role]);

  const handleUpdateRole = async () => {
    if (!role || !role.id) {
      console.error("No se pudo editar el rol: ID de rol indefinido.");
      return;
    }

    console.log("Datos a enviar para actualizar el rol:", { nombre, descripcion });

    try {
      const response = await axiosInstance.put(`/roles/${role.id}`, { nombre, descripcion });
      console.log("Respuesta del backend:", response.data);
      onSave();
      closeModal();
      alert("Rol editado correctamente");
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
    }
  };

  if (!show) return null;

  return (
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
        <SubmitButton onClick={handleUpdateRole}>Guardar Cambios</SubmitButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditRoleModal;
