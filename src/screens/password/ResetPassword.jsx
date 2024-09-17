import { useState } from 'react';
import styled from 'styled-components';
import background from '../../assets/images/background.webp';
import { Link } from 'react-router-dom'; 
import axiosInstance from '../../config/AxiosInstance'; 
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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
  position: relative; /* Agregado para posicionar el overlay */
  background-color: rgba(255, 255, 255, 0.8);
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
  margin: 10px 0 5px 0; /* Ajuste para espacio con el mensaje de error */
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;

  &:focus {
    border-color: #27ae60;
    outline: none;
  }

  &:disabled {
    background-color: #f9f9f9;
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

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

/* Spinner */
const Spinner = styled.div`
  border: 4px solid #f3f3f3; /* Gris claro */
  border-top: 4px solid #27ae60; /* Verde */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

/* Overlay para el Spinner */
const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
`;

/* Checkmark */
const Checkmark = styled.div`
  color: #27ae60;
  font-size: 85px;
`;

/* Icono de Error */
const ErrorIcon = styled.div`
  color: #e74c3c;
  font-size: 88px;
`;

const Message = styled.p`
  font-size: 16px;
  color: #2c3e50;
  font-family: 'Roboto', sans-serif;
`;

/* Mensaje de Error de Validación */
const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
  font-family: 'Roboto', sans-serif;
`;

/* Enlace para volver al inicio */
const HomeLink = styled(Link)`
  display: block;
  margin-top: 20px;
  color: #3498db;
  text-decoration: none;
  font-size: 16px;
  font-family: 'Roboto', sans-serif;

  &:hover {
    text-decoration: underline;
  }
`;

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(''); // Estado para el error de validación de email
  const [loading, setLoading] = useState(false); // Estado para el spinner
  const [success, setSuccess] = useState(false); // Estado para el checkmark
  const [error, setError] = useState(''); // Estado para el mensaje de error

  // Función para validar el email
  const validateEmail = (email) => {
    // Expresión regular para validar email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    // Validar el email
    if (!validateEmail(inputEmail)) {
      setEmailError('Por favor, introduce un correo electrónico válido.');
    } else {
      setEmailError('');
    }
  };

  const handleSendResetLink = async () => {
    if (emailError || email === '') {
      setEmailError('Por favor, introduce un correo electrónico válido.');
      return;
    }

    setLoading(true); // Mostrar spinner
    setError(''); // Limpiar mensaje de error

    try {
      const response = await axiosInstance.post('/password-reset/request', { email });

      setLoading(false); // Ocultar spinner
      if (response.status === 200) {
        setSuccess(true); // Mostrar checkmark
      } else {
        setError('No se pudo enviar el enlace de recuperación.');
      }
    } catch (error) {
      setLoading(false); // Ocultar spinner
      console.error('Error al enviar el enlace de recuperación:', error);
      setError('Correo electrónico no registrado o ocurrió un error en el servidor.');
    }
  };

  return (
    <ResetContainer>
      <FormContainer>
        {success ? (
          <>
            <Checkmark>
              <FaCheckCircle />
            </Checkmark>
            <Title>¡Enlace enviado!</Title>
            <Message>Revisa tu correo electrónico para restablecer tu contraseña.</Message>
            <HomeLink to="/">Volver al inicio</HomeLink>
          </>
        ) : error ? (
          <>
            <ErrorIcon>
              <FaTimesCircle />
            </ErrorIcon>
            <Title>Ocurrió un error</Title>
            <Message>{error}</Message>
            <Button onClick={() => setError('')}>Intentar de nuevo</Button>
            <HomeLink to="/">Volver al inicio</HomeLink>
          </>
        ) : (
          <>
            <Title>Restablecimiento de Contraseña</Title>
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={handleEmailChange}
              disabled={loading}
            />
            {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
            <Button
              onClick={handleSendResetLink}
              disabled={loading || emailError || email === ''}
            >
              Enviar enlace de recuperación
            </Button>
            {loading && (
              <LoadingOverlay>
                <Spinner />
              </LoadingOverlay>
            )}
            <HomeLink to="/">Volver al inicio</HomeLink>
          </>
        )}
      </FormContainer>
    </ResetContainer>
  );
};

export default ResetPassword;
