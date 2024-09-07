import React, { useState } from 'react';
import styled from 'styled-components';
import DeleteSuccessModal from './DeleteSuccessModal';  // Importa el modal de éxito

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

const ModalTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const ModalText = styled.p`
  text-align: center;
  font-size: 18px;
  color: #555;
  margin-bottom: 30px;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-around;
`;

const CancelButton = styled.button`
  background-color: #7f8c8d;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #2c3e50;
    transform: translateY(-2px);
  }
`;

const ConfirmButton = styled.button`
  background-color: #e74c3c;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #c0392b;
    transform: translateY(-2px);
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
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #ff6b6b;
  }
`;

const DeleteModal = ({ show, onClose, onConfirm }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleDelete = async (event) => {
    event.preventDefault();  // Previene el refresco de la página
    setShowSuccessModal(true);  // Muestra el modal de éxito inmediatamente
    try {
      await onConfirm();  // Llama a la función de eliminación pasada desde el componente padre
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    onClose();  // Cierra el modal principal también
  };

  return (
    <>
      {show && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={onClose}>×</CloseButton>
            <ModalTitle>Confirmar Eliminación</ModalTitle>
            <ModalText>¿Estás seguro de que deseas eliminar este usuario?</ModalText>
            <ModalButtons>
              <CancelButton onClick={onClose}>Cancelar</CancelButton>
              <ConfirmButton onClick={handleDelete}>Eliminar</ConfirmButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}

      {showSuccessModal && (
        <DeleteSuccessModal show={showSuccessModal} closeModal={closeSuccessModal} />
      )}
    </>
  );
};

export default DeleteModal;
