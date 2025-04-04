// ButtonCrear.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

const ButtonStyled = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
  margin-left: auto;
  display: block;

  &:hover {
    background-color: #218838;
  }
`;

const ButtonCrear = ({ buttonText, ModalComponent, onSave }) => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleSave = (data) => {
    onSave(data); // Envía el nuevo dato al componente padre
    closeModal(); // Cierra el modal después de guardar
  };

  return (
    <>
      <ButtonStyled onClick={openModal}>{buttonText}</ButtonStyled>
      {showModal && (
        <ModalComponent closeModal={closeModal} onSave={handleSave} />
      )}
    </>
  );
};

export default ButtonCrear;
