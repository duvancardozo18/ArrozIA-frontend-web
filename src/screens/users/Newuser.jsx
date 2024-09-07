import React, { useState } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../config/AxiosInstance';
import SuccessModal from './SuccessModal'; 

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

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 18px;  // Incrementar el tamaño de la fuente
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;  // Hacer que el texto sea más grueso
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

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  input, select {
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

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #218838;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const Newuser = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol_id: '1',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Estado para manejar mensajes de error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setErrorMessage(''); // Limpiar cualquier mensaje de error previo
      const response = await axiosInstance.post('/register', formData); // Enviar datos al backend
      console.log('Usuario creado:', response.data);
      setShowSuccessModal(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage('El correo ya está registrado.'); // Establece el mensaje de error
      } else {
        setErrorMessage('Error creando el usuario.'); // Otro error inesperado
      }
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal(); // Cierra el modal principal también
  };

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Crear Nuevo Usuario</h2>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <form onSubmit={handleSubmit}>
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
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
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
                <option value="1">Administrador</option>
                <option value="2">Usuario</option>
                {/* Agrega más roles según tu necesidad */}
              </select>
            </InputGroup>
            <SubmitButton type="submit">Crear Usuario</SubmitButton>
          </form>
        </ModalContent>
      </ModalOverlay>
      {showSuccessModal && <SuccessModal closeModal={handleCloseSuccessModal} />}
    </>
  );
};

export default Newuser;
