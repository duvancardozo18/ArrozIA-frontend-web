import React, { useState } from 'react';
import styled from 'styled-components';
import Newuser from '../screens/users/Newuser'; // Importa el componente del modal

const ButtonStyled = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background-color: #218838;
  }
`;

const ButtonCrear = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <ButtonStyled onClick={openModal}>Crear Usuario</ButtonStyled>
      {showModal && <Newuser closeModal={closeModal} />} {/* Muestra el modal si showModal es true */}
    </>
  );
};

export default ButtonCrear;
