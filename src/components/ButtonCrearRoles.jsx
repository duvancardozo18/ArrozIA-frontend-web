import React, { useState } from 'react';
import styled from 'styled-components';
import NewRol from '../screens/roles/Newrol';  // Importa el modal de creación de roles

const ButtonCrearRoles = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <Button onClick={openModal}>Crear Rol</Button>
      <NewRol show={showModal} closeModal={closeModal} onSave={() => console.log("Rol creado")} />
    </>
  );
};

const Button = styled.button`
  padding: 12px 25px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
  }
`;

export default ButtonCrearRoles;
