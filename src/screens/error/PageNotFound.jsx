// src/components/PageNotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/Unauthorized.scss'; // Asegúrate de crear este archivo de estilos

const PageNotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <p>Página no encontrada</p>
      <Link to="/" className="home-link">
        Volver al inicio
      </Link>
    </div>
  );
};

export default PageNotFound;
