import React, { useState, useContext } from "react";
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/AxiosInstance'; 
import { AuthContext } from '../../config/AuthProvider';
import logo from '../../assets/images/logo.png';
import background from '../../assets/images/background.webp';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginContainer = styled.div`
  position: fixed;
  z-index: 101;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-image: url(${background});
  background-size: cover;
  background-position: center;
`;

const FormContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

const Logo = styled.img`
  width: 170px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 30px;
  font-family: 'Roboto', sans-serif;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 15px 0;
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

const PasswordInputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${({ disabled }) => (disabled ? '#ddd' : '#27ae60')};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? '#ddd' : '#219150')};
    box-shadow: ${({ disabled }) => (disabled ? 'none' : '0 8px 15px rgba(0, 0, 0, 0.1)')};
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 5px;  /* Ajusta el margen */
  margin-top: -5px;    /* Espacio más reducido arriba */
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false); // Estado para el error del correo
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Validar el formato del correo
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Manejar el cambio de email y la validación
  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    setEmailError(!validateEmail(emailValue)); // Verificar si es un correo válido
  };

  // Manejar el cambio en la visibilidad de la contraseña
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/login', {
        email: email.trim(),
        password: password.trim(),
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { access_token, refresh_token, user_name } = response.data;
      login(access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('userName', user_name);
      navigate('/farms');
    } catch (error) {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <LoginContainer>
      <FormContainer>
        <Logo src={logo} alt="App Logo" />
        <Title>Arroz IA</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {/* Mostrar el mensaje de error arriba del campo de correo */}
        {emailError && <ErrorMessage>Ingrese un correo válido</ErrorMessage>}
        
        <Input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={handleEmailChange}
        />
        
        <PasswordInputContainer>
          <Input
            type={showPassword ? 'text' : 'password'} // Cambiar entre 'text' y 'password'
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputAdornment position="end" style={{ position: 'absolute', right: '10px', top: '25%' }}>
            <IconButton onClick={handleClickShowPassword} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        </PasswordInputContainer>

        <Button
          onClick={handleLogin}
          disabled={emailError || email === ''} // Deshabilitar el botón si hay error o el campo está vacío
        >
          Iniciar Sesión
        </Button>
      </FormContainer>
    </LoginContainer>
  );
};

export default Login;
