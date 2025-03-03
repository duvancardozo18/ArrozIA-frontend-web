import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import background from '../../assets/images/background.webp';
import axiosInstance from '../../config/AxiosInstance';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Íconos para éxito y error

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
  background-color: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  position: relative;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
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
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #219150;
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const WelcomeMessage = styled.h2`
  font-size: 20px;
   color: #2c3e50;
  font-family: 'Roboto', sans-serif;
  text-align: center;
  margin-bottom: 30px;
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



/* Checkmark */
const Checkmark = styled.div`
  color: #27ae60;
  font-size: 65px;
  margin-bottom: 20px;
`;

/* Icono de Error */
const ErrorIcon = styled.div`
  color: #e74c3c;
  font-size: 80px;
  margin-bottom: 20px;
`;

const Message = styled.p`
  font-size: 20px;
  color: #2c3e50;
  font-family: 'Roboto', sans-serif;
`;



const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;


const ResetPasswordForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { accessToken, refreshToken } = location.state || {};

  if (!accessToken || !refreshToken) {
    console.error('Faltan tokens para cambiar la contraseña.');
    navigate('/');
    return null;
  }

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  };

  const decodedToken = parseJwt(accessToken);
  const userId = decodedToken ? decodedToken.sub : null;

  if (!userId) {
    console.error('Token de acceso inválido.');
    navigate('/');
    return null;
  }

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200) {
          const { nombre, apellido, email } = response.data;
          setNombre(nombre);
          setApellido(apellido);
          setEmail(email);
        } else {
          setError('No se pudo obtener los datos del usuario.');
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        setError('Hubo un error al obtener los datos del usuario.');
      }
    };

    fetchUserData();
  }, [userId, accessToken]);

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsError(true);
      return;
    }

    const payload = {
      nombre,
      apellido,
      email,
      password,
      primer_login: false,
    };

    setIsLoading(true);
    setError('');
    setIsError(false);
    setIsSuccess(false);

    try {
      const response = await axiosInstance.put(`/users/update/${userId}`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 4000);
      } else {
        setError('Hubo un problema al actualizar la información.');
        setIsError(true);
        setTimeout(() => {
          navigate('/');
        }, 4000);
      }
    } catch (error) {
      console.error('Error al actualizar la información:', error);
      setError('Hubo un error al procesar tu solicitud.');
      setIsError(true);
      setTimeout(() => {
        navigate('/');
      }, 4000);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <ResetContainer>
        <FormContainer>
          <Checkmark>
            <FaCheckCircle />
          </Checkmark>
          <Message>Información actualizada con éxito. Redireccionado...</Message>
        </FormContainer>
      </ResetContainer>
    );
  }


  return (
    <ResetContainer>
      <FormContainer>
        {isLoading && (
          <Overlay>
            <Spinner />
          </Overlay>
        )}
         <Title>Bienvenido - ARROZ IA</Title>
         <WelcomeMessage>Actualización de Datos</WelcomeMessage>
         {/* Mostrar mensajes de error */}
         {error && <p style={{ color: 'red' }}>{error}</p>}

        <Input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={isLoading}
        />
        <Input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          disabled={isLoading}
        />
        <Input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <Input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <Input
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />
        <Button onClick={handleResetPassword} disabled={isLoading}>
          Guardar cambios
        </Button>
      </FormContainer>
    </ResetContainer>
  );
};

export default ResetPasswordForm;