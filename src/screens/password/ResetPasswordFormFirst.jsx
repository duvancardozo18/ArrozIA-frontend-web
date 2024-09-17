import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import background from '../../assets/images/background.webp';
import axiosInstance from '../../config/AxiosInstance';
import { AuthContext } from '../../config/AuthProvider'; // Asegúrate de que el contexto esté disponible

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

const WelcomeMessage = styled.h2`
  font-size: 20px;
  font-family: 'Roboto', sans-serif;
  text-align: center;
  margin-bottom: 40px;
`;

const FormContainer = styled.div`
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

  &:hover {
    background-color: #219150;
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ResetPasswordForm = () => {
  const { userId, token } = useContext(AuthContext); // Obtener userId y token desde AuthContext
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Efecto para obtener los datos del usuario al montar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
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

    if (userId) {
      fetchUserData();
    }
  }, [userId, token]);

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const payload = {
      nombre,
      apellido,
      email,
      password,
      primer_login: false,
    };

    console.log('Payload enviado:', payload);

    try {
      const response = await axiosInstance.put(`/users/update/${userId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert('Información actualizada con éxito.');
        navigate('/');
      } else {
        setError('Hubo un problema al actualizar la información.');
      }
    } catch (error) {
      console.error('Error al actualizar la información:', error);
      setError('Hubo un error al procesar tu solicitud.');
    }
  };

  return (
    <ResetContainer>
      <FormContainer>
        <Title>Bienvenido - ARROZ IA</Title>
        <WelcomeMessage>Actualización de datos de usuario</WelcomeMessage>
        {/* Mostrar mensajes de error */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <Input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button onClick={handleResetPassword}>Guardar cambios</Button>
      </FormContainer>
    </ResetContainer>
  );
};

export default ResetPasswordForm;