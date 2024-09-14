import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const PrivateRoute = ({ element, requiredPermission }) => {
  const { isAuthenticated, permissions } = useContext(AuthContext);

  // Verificar si el usuario está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si se requiere un permiso específico y el usuario no lo tiene
  if (requiredPermission && !permissions.includes(requiredPermission)) {
    console.log(`Permission ${requiredPermission} not found. Redirecting to unauthorized.`);
    return <Navigate to="/unauthorized" replace />;
  }

  // Si el usuario está autenticado y tiene los permisos requeridos, renderizar el componente
  return element;
};

export default PrivateRoute;
