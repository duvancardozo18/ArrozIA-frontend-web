import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Unauthorized.scss'; // Puedes agregar estilos si lo deseas

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Vuelve a la página anterior
  };

  return (
    <div className="unauthorized-container">
      <h1>Acceso Denegado</h1>
      <p>No tienes permiso para acceder a esta página.</p>
      <button onClick={handleGoBack}>Volver</button>
    </div>
  );
};

export default Unauthorized;
