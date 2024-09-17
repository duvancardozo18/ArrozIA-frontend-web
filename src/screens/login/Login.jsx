import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/AxiosInstance'; // Importar la instancia de Axios
import { AuthContext } from '../../config/AuthProvider'; // Importar el contexto de autenticación
import logo from '../../assets/images/logo.png';
import background from '../../assets/images/background.webp';

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

  &:hover {
    background-color: #219150;
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const LinkContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const StyledLink = styled.span`
  font-size: 14px;
  color: #34495e;
  font-family: 'Roboto', sans-serif;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Usa la función de login del contexto

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
  
      // Si no hay necesidad de cambiar la contraseña, continuar con el login normal
      login(access_token); // Utiliza la función login del contexto para guardar el token
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('userName', user_name);
      navigate('/fincas');
    } catch (error) {
      // Verifica si es un error de tipo 403 y si requiere cambio de contraseña
      if (error.response && error.response.status === 403 && error.response.data.change_password_required) {
        // Redirigir a la página de cambio de contraseña
        const { access_token, refresh_token } = error.response.data;
        navigate('/change-password-first', {
          state: { accessToken: access_token, refreshToken: refresh_token }
        });
      } else {
        // En caso de otros errores, muestra el mensaje de error estándar
        console.error('Error en el inicio de sesión:', error.response ? error.response.data : error.message);
        setError('Correo o contraseña incorrectos');
      }
    }
  };
  

  return (
    <LoginContainer>
      <FormContainer>
        <Logo src={logo} alt="App Logo" />
        <Title>Arroz IA</Title>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin}>Iniciar Sesión</Button>
        <LinkContainer>
          <StyledLink onClick={() => navigate('/reset-password')}>¿Olvidaste tu contraseña?</StyledLink>
        </LinkContainer>
      </FormContainer>
    </LoginContainer>
  );
};

export default Login;
