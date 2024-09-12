import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import background from '../../assets/images/background.jpg';
import axiosInstance from '../../config/AxiosInstance'; // Asegúrate de que esté configurado correctamente

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

const ResetPasswordForm = () => {
  const { token } = useParams(); // Captura el token desde la URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
  
    const formData = new FormData();
    formData.append('token', token);
    formData.append('new_password', newPassword);
  
    try {
      const response = await axiosInstance.post('password-reset/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.status === 200) {
        alert('Contraseña restablecida con éxito.');
        navigate('/');
      } else {
        setError('Hubo un problema al restablecer la contraseña.');
      }
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      setError('Hubo un error al procesar tu solicitud.');
    }
  };
  

  return (
    <ResetContainer>
      <FormContainer>
        <Title>Restablecer Contraseña</Title>
        {/* Mostrar mensajes de error */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <Input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button onClick={handleResetPassword}>Restablecer contraseña</Button>
      </FormContainer>
    </ResetContainer>
  );
};

export default ResetPasswordForm;
