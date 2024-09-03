import React from 'react';
import styled from 'styled-components';
import background from '../../assets/images/background.jpg';



const ResetContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f7f9fb;
  padding: 20px;
  background-image: url(${background});
  background-size: cover;
  background-position: center;
`;

const FormContainer = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 30px;
  font-family: 'Roboto', sans-serif;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;

  &:focus {
    border-color: #27ae60;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  margin-top: 10px;

  &:hover {
    background-color: #219150;
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  right: 15px;
  top: 45px;
  cursor: pointer;
`;

const ResetPassword = () => {
  return (
    <ResetContainer>
      <FormContainer>
        <Title>¿Olvidaste tu contraseña?</Title>
        <Input type="email" placeholder="Ingresa correo electrónico" />
        <Button>Enviar link de recuperación</Button>
        <Input type="text" placeholder="Ingresa código de recuperación" />
        <SearchIcon role="img" aria-label="search">🔍</SearchIcon>
        <Input type="password" placeholder="Ingresa nueva contraseña" />
        <Input type="password" placeholder="Confirma nueva contraseña" />
        <Button>Restablece contraseña</Button>
      </FormContainer>
    </ResetContainer>
  );
};

export default ResetPassword;