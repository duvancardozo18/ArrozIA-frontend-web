import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  width: 400px;
  max-width: 90%;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background-color: #28a745;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 50px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const SuccessMessage = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  font-family: 'Roboto', sans-serif;
`;

const CloseButton = styled.button`
  margin-top: 20px;
  padding: 12px 25px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #218838;
    transform: translateY(-2px);
  }
`;

const EditSuccessModal = ({ show, closeModal }) => {
  if (!show) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <SuccessIcon>✓</SuccessIcon>
        <SuccessMessage>Cambios guardados correctamente</SuccessMessage>
        <CloseButton onClick={closeModal}>Cerrar</CloseButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditSuccessModal;
